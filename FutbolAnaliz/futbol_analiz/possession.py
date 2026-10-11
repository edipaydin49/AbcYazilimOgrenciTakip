"""Topa sahip olma, pas, top kaybı ve şut olayları.

- abdullahtarek: topa en yakın oyuncu sahibidir (mesafe eşiği ile).
- tryolabs: "eylemsizlik" - sahiplik ancak birkaç kare üst üste aynı oyuncudaysa değişir.
- Sahip değişimi aynı takım içindeyse pas, farklı takımsa top kaybı/kazanımı.
"""
from __future__ import annotations

from collections import defaultdict
from dataclasses import asdict, dataclass

import numpy as np

from .pitch import LENGTH, WIDTH


@dataclass
class Event:
    type: str  # pas | top_kaybi | sut
    time_s: float
    team: int
    from_id: int
    to_id: int | None = None
    start: tuple[float, float] | None = None
    end: tuple[float, float] | None = None
    length_m: float | None = None

    def to_dict(self):
        return asdict(self)


class PossessionTracker:
    def __init__(self, fps: float, max_dist: float = 1.8, inertia_frames: int = 3, max_pass_gap_s: float = 4.0):
        """max_dist: saha kalibreliyse metre, değilse piksel cinsinden yorumlanır (pipeline ayarlar)."""
        self.fps, self.max_dist, self.inertia, self.max_gap = fps, max_dist, inertia_frames, max_pass_gap_s
        self.owner: int | None = None
        self.owner_team: int | None = None
        self.owner_pos = None
        self.last_owner: tuple[int, int, float, tuple] | None = None  # (id, takım, zaman, konum)
        self._cand, self._cand_n = None, 0
        self.team_frames = defaultdict(int)
        self.events: list[Event] = []
        self.touches = defaultdict(int)
        self.timeline: list[tuple[float, int | None]] = []
        self._ball_hist: list[tuple[float, np.ndarray]] = []

    def update(self, t: float, ids: np.ndarray, teams: np.ndarray, pos: np.ndarray, ball: np.ndarray | None,
               ball_pitch: np.ndarray | None = None):
        """ids/teams/pos: sahadaki oyuncular (hakemler hariç). pos ile ball aynı koordinat sisteminde olmalı."""
        cand = None
        if ball is not None and len(ids):
            d = np.linalg.norm(pos - ball[None], axis=1)
            j = int(np.argmin(d))
            if d[j] <= self.max_dist and teams[j] >= 0:
                cand = (int(ids[j]), int(teams[j]), tuple(map(float, pos[j])))

        if cand is not None and self._cand is not None and cand[0] == self._cand[0]:
            self._cand_n += 1
        else:
            self._cand, self._cand_n = cand, 1 if cand else 0

        if self._cand is not None and self._cand_n >= self.inertia and self._cand[0] != self.owner:
            self._change_owner(t, *self._cand)
        elif self.owner is not None and cand is None and ball is not None:
            # Top serbest: sahibi bırak ama son sahibi pas çözümlemesi için hatırla
            self.owner = None

        if self.owner is not None:
            self.owner_pos = next((tuple(map(float, p)) for i, p in zip(ids, pos) if i == self.owner), self.owner_pos)
        if self.owner_team is not None:
            self.team_frames[self.owner_team] += 1
        self.timeline.append((t, self.owner_team))
        if ball_pitch is not None:
            self._detect_shot(t, ball_pitch)

    def _change_owner(self, t, pid, team, p):
        prev = self.last_owner
        # Kaleye giden hızlı top takım arkadaşına ulaştıysa şut değil, pastı
        if self.events and self.events[-1].type == "sut" and self.events[-1].team == team and t - self.events[-1].time_s < 2.5:
            self.events.pop()
        if prev is not None and prev[0] != pid and t - prev[2] <= self.max_gap:
            length = float(np.hypot(p[0] - prev[3][0], p[1] - prev[3][1]))
            if prev[1] == team:
                self.events.append(Event("pas", t, team, prev[0], pid, prev[3], p, length))
            else:
                self.events.append(Event("top_kaybi", t, prev[1], prev[0], pid, prev[3], p, length))
        self.owner, self.owner_team, self.owner_pos = pid, team, p
        self.touches[pid] += 1
        self.last_owner = (pid, team, t, p)

    def _detect_shot(self, t: float, bp: np.ndarray):
        """Sezgisel: top hızlıca (>50 km/s) kale ağzına doğru gidiyorsa şut."""
        self._ball_hist = [(tt, p) for tt, p in self._ball_hist if t - tt <= 0.5] + [(t, np.asarray(bp, float))]
        if len(self._ball_hist) < 2 or self.last_owner is None:
            return
        (t0, p0), (t1, p1) = self._ball_hist[0], self._ball_hist[-1]
        if t1 - t0 < 0.15:
            return
        v = (p1 - p0) / (t1 - t0)
        if np.linalg.norm(v) * 3.6 < 50 or abs(v[0]) < 1e-3:
            return
        goal_x = LENGTH if v[0] > 0 else 0.0
        y_at_goal = p1[1] + v[1] * (goal_x - p1[0]) / v[0]
        near_goal = abs(goal_x - p1[0]) < 35
        if near_goal and abs(y_at_goal - WIDTH / 2) < 7.32 / 2 + 3:
            last = self.events[-1] if self.events else None
            if last and last.type == "sut" and t - last.time_s < 2:
                return
            self.events.append(Event("sut", t, self.last_owner[1], self.last_owner[0], None, tuple(map(float, p0)), (goal_x, float(y_at_goal))))

    def possession_pct(self) -> dict[int, float]:
        total = sum(self.team_frames.values())
        return {k: 100.0 * self.team_frames.get(k, 0) / total if total else 0.0 for k in (0, 1)}
