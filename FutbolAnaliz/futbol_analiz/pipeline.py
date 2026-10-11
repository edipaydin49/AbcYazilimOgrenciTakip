"""Tüm parçaları birleştiren analiz hattı. Kare kare çalışır -> hem canlı hem kayıtlı video."""
from __future__ import annotations

import csv
import time
from pathlib import Path
from typing import Iterator

import cv2
import numpy as np

from .annotate import annotate
from .camera import CameraMotionEstimator
from .core import BALL, GOALKEEPER, REFEREE, Detections, FrameResult, PlayerState
from .pitch import LENGTH, WIDTH, ViewTransformer, inside_pitch, pitch_vertices
from .possession import PossessionTracker
from .stats import StatsAccumulator, player_profiles
from .tactics import TacticsTracker, heatmap, pass_network
from .teams import TeamClassifier
from .tracking import Tracker

PLAYER_HEIGHT_M = 1.8


class MatchAnalyzer:
    """
    detector:        `detect(frame) -> Detections` metodu olan nesne (ör. YoloDetector)
    pitch_detector:  (opsiyonel) saha anahtar noktası modeli -> her karede homografi
    calibration:     (opsiyonel) elle kalibrasyon ViewTransformer'ı -> kamera hareketi telafisiyle
    Hiçbiri yoksa: hız/mesafe oyuncu boyundan ölçeklenir, radar görüntüden yaklaşık çizilir.
    """

    def __init__(self, detector, fps: float, pitch_detector=None, calibration: ViewTransformer | None = None,
                 team_warmup: int = 60, csv_path: str | Path | None = None, realtime: bool = False):
        """realtime=True: canlı kaynaklarda zaman gerçek saatten alınır (işlem yavaşsa hızlar yine doğru çıkar)."""
        self.detector, self.pitch_detector, self.calibration = detector, pitch_detector, calibration
        self.fps = fps
        self.tracker = Tracker()
        self.teams = TeamClassifier(warmup_samples=team_warmup)
        self.camera = CameraMotionEstimator() if calibration is not None and pitch_detector is None else None
        self.stats = StatsAccumulator()
        self.possession = PossessionTracker(fps=fps, max_dist=2.0)
        self.tactics = TacticsTracker()
        self.positions: dict[int, list] = {}
        self.ball_positions: list = []
        self.frame_idx = 0
        self.realtime, self._t0, self._t = realtime, None, 0.0
        self._transformer: ViewTransformer | None = calibration
        self._mpp: float | None = None  # metre / piksel (kalibrasyonsuz mod)
        self._last_ball = (None, 0)
        self._csv = None
        if csv_path:
            f = open(csv_path, "w", newline="", encoding="utf-8")
            self._csv = (f, csv.writer(f))
            self._csv[1].writerow(["kare", "zaman_s", "id", "sinif", "takim", "x_px", "y_px", "x_m", "y_m", "hiz_kmh"])

    # ---- koordinatlar ----
    def _update_transformer(self, frame, people_boxes):
        if self.pitch_detector is not None:
            kp = self.pitch_detector.detect(frame)
            if kp is not None:
                try:
                    self._transformer = ViewTransformer(kp[0], pitch_vertices()[kp[1]])
                except ValueError:
                    pass
        elif self.camera is not None:
            self.camera.update(frame, people_boxes)

    def _to_pitch(self, pts: np.ndarray) -> np.ndarray | None:
        if self._transformer is None:
            return None
        if self.camera is not None:
            pts = self.camera.to_reference(pts)
        return self._transformer.transform(pts)

    # ---- ana adım ----
    def process(self, frame: np.ndarray) -> FrameResult:
        if self.realtime:
            now = time.monotonic()
            self._t0 = self._t0 or now
            t = now - self._t0
        else:
            t = self.frame_idx / self.fps
        self._t = t
        h, w = frame.shape[:2]
        det: Detections = self.tracker.update(self.detector.detect(frame))
        people = det[det.class_id != BALL]
        ball = det[det.class_id == BALL]
        self._update_transformer(frame, people.xyxy)

        feet = people.foot_points
        pitch_xy = self._to_pitch(feet)
        calibrated = pitch_xy is not None
        if calibrated:
            on_pitch = inside_pitch(pitch_xy)  # tribündeki kişileri ele
            people, feet, pitch_xy = people[on_pitch], feet[on_pitch], pitch_xy[on_pitch]
            metric_xy = pitch_xy
        else:
            heights = people.xyxy[:, 3] - people.xyxy[:, 1]
            if len(heights):
                m = PLAYER_HEIGHT_M / max(float(np.median(heights)), 1.0)
                self._mpp = m if self._mpp is None else 0.95 * self._mpp + 0.05 * m
            metric_xy = feet * (self._mpp or 0.0)
            pitch_xy = feet / np.array([w, h]) * np.array([LENGTH, WIDTH])  # yaklaşık radar

        teams = self.teams.update(frame, people, pitch_xy)
        teams[people.class_id == REFEREE] = -1

        # Top (kısa kayıplarda son konumu tut)
        if len(ball):
            ball_img = ball.centers[0]
            self._last_ball = (ball_img, 0)
        elif self._last_ball[0] is not None and self._last_ball[1] < 5:
            ball_img = self._last_ball[0]
            self._last_ball = (ball_img, self._last_ball[1] + 1)
        else:
            ball_img = None
        if ball_img is not None:
            bp = self._to_pitch(ball_img[None])
            ball_pitch = bp[0] if bp is not None else ball_img / np.array([w, h]) * np.array([LENGTH, WIDTH])
            ball_metric = bp[0] if bp is not None else ball_img * (self._mpp or 0.0)
            self.ball_positions.append(ball_pitch)
        else:
            ball_pitch = ball_metric = None

        # Sahiplik + olaylar
        field = people.class_id != REFEREE
        self.possession.update(t, people.tracker_id[field], teams[field], metric_xy[field], ball_metric,
                               ball_pitch if calibrated else None)
        owner = self.possession.owner

        players = []
        for i in range(len(people)):
            tid = int(people.tracker_id[i])
            tr = self.stats.update(t, tid, int(teams[i]), int(people.class_id[i]), metric_xy[i] if self._mpp or calibrated else None)
            if teams[i] >= 0:
                self.positions.setdefault(tid, []).append(pitch_xy[i].astype(np.float32))
            players.append(PlayerState(tid, int(people.class_id[i]), int(teams[i]), people.xyxy[i], feet[i],
                                       pitch_xy[i], tr.speed, tr.distance))
            if self._csv:
                self._csv[1].writerow([self.frame_idx, f"{t:.2f}", tid, int(people.class_id[i]), int(teams[i]),
                                       f"{feet[i][0]:.1f}", f"{feet[i][1]:.1f}", f"{pitch_xy[i][0]:.2f}",
                                       f"{pitch_xy[i][1]:.2f}", f"{tr.speed:.1f}"])

        carrier_xy = next((p.pitch_xy for p in players if p.track_id == owner), None)
        self.tactics.update(t, people.tracker_id[field], teams[field], pitch_xy[field],
                            people.class_id[field] == GOALKEEPER, carrier_xy, self.possession.owner_team)
        self.frame_idx += 1
        return FrameResult(self.frame_idx - 1, t, players, ball_img, ball_pitch, owner, self.possession.owner_team, calibrated)

    def draw(self, frame: np.ndarray, res: FrameResult, show_radar: bool = True) -> np.ndarray:
        ev = self.possession.events
        info = {"Pas A/B": f"{sum(e.type == 'pas' and e.team == 0 for e in ev)} / {sum(e.type == 'pas' and e.team == 1 for e in ev)}"}
        if self.tactics.pressure:
            info["Pres mesafesi"] = f"{np.mean(self.tactics.pressure[-50:]):.1f} m"
        return annotate(frame, res, self.teams.team_colors_bgr, self.possession.possession_pct(),
                        {k: self.tactics.current_formation(k) for k in (0, 1)}, show_radar, info)

    def run(self, frames: Iterator[np.ndarray], video_out: str | Path | None = None,
            show: bool = False, draw: bool = True) -> Iterator[tuple[np.ndarray, FrameResult]]:
        writer = None
        try:
            for frame in frames:
                res = self.process(frame)
                vis = self.draw(frame, res) if draw else frame
                if video_out:
                    if writer is None:
                        writer = cv2.VideoWriter(str(video_out), cv2.VideoWriter_fourcc(*"mp4v"), self.fps, (vis.shape[1], vis.shape[0]))
                    writer.write(vis)
                if show:
                    cv2.imshow("Futbol Analiz", vis)
                    if cv2.waitKey(1) & 0xFF == ord("q"):
                        break
                yield vis, res
        finally:
            if writer is not None:
                writer.release()
            if self._csv:
                self._csv[0].flush()

    def close(self):
        if self._csv:
            self._csv[0].close()
            self._csv = None

    # ---- rapor ----
    def summary(self) -> dict:
        tac = self.tactics.summary()
        dirs = {k: self.tactics.attack_dir(k) for k in (0, 1)}
        profiles = player_profiles(self.stats, self.possession, dirs, self.positions)
        avg_pos = {pid: np.mean(v, axis=0) for pid, v in self.positions.items() if v}
        ev = self.possession.events
        teams = {}
        for k in (0, 1):
            pl = [p for p in profiles if p["takim"] == k]
            passes = sum(e.type == "pas" and e.team == k for e in ev)
            lost = sum(e.type == "top_kaybi" and e.team == k for e in ev)
            teams[k] = {
                "renk_bgr": list(self.teams.team_colors_bgr[k]),
                "topa_sahip_olma_%": round(self.possession.possession_pct()[k], 1),
                "pas": passes, "top_kaybi": lost,
                "pas_isabet_%": round(100 * passes / (passes + lost), 1) if passes + lost else None,
                "sut": sum(e.type == "sut" and e.team == k for e in ev),
                "ortalama_pas_uzunlugu_m": round(float(np.mean([e.length_m for e in ev if e.type == "pas" and e.team == k])), 1)
                if passes else None,
                "toplam_mesafe_m": round(sum(p["mesafe_m"] for p in pl), 1),
                "sprint": sum(p["sprint"] for p in pl),
                **tac[k],
                "pas_agi": pass_network(ev, avg_pos, k),
            }
        return {
            "sure_s": round(self._t, 1),
            "kare": self.frame_idx,
            "kalibre": self._transformer is not None,
            "takimlar": teams,
            "ortalama_pres_mesafesi_m": tac["ortalama_pres_mesafesi_m"],
            "oyuncular": profiles,
            "olaylar": [e.to_dict() for e in ev],
        }

    def heatmaps(self) -> dict[int, np.ndarray]:
        out = {}
        for k in (0, 1):
            ids = [pid for pid, tr in self.stats.tracks.items() if tr.team == k]
            xy = np.concatenate([np.array(self.positions[i]) for i in ids if self.positions.get(i)] or [np.zeros((0, 2))])
            out[k] = heatmap(xy)
        return out
