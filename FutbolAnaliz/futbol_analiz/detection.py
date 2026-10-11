"""YOLO tabanlı oyuncu/top ve saha anahtar noktası tespiti (ultralytics).

- Futbola özel model (roboflow "football-player-detection" veya abdullahtarek'in
  eğittiği model) varsa sınıflar: ball / goalkeeper / player / referee.
- Yoksa COCO modeli (ör. yolo11m.pt) kullanılır: person -> oyuncu, sports ball -> top.
"""
from __future__ import annotations

import numpy as np

from .core import BALL, GOALKEEPER, PLAYER, REFEREE, Detections

_NAME_MAP = {
    "ball": BALL, "football": BALL, "sports ball": BALL,
    "goalkeeper": GOALKEEPER, "goalie": GOALKEEPER,
    "player": PLAYER, "person": PLAYER,
    "referee": REFEREE,
}


class YoloDetector:
    def __init__(self, weights: str = "yolo11m.pt", conf: float = 0.3, imgsz: int = 1280, device: str | None = None):
        from ultralytics import YOLO

        self.model = YOLO(weights)
        self.conf, self.imgsz, self.device = conf, imgsz, device
        names = self.model.names
        self.class_map = {i: _NAME_MAP[n.lower()] for i, n in names.items() if n.lower() in _NAME_MAP}
        if not self.class_map:
            raise ValueError(f"Model sınıfları tanınmadı: {names}")
        self.has_referee = REFEREE in self.class_map.values()

    def detect(self, frame: np.ndarray) -> Detections:
        r = self.model.predict(frame, conf=self.conf, imgsz=self.imgsz, device=self.device, verbose=False)[0]
        b = r.boxes
        if b is None or len(b) == 0:
            return Detections()
        cls_raw = b.cls.cpu().numpy().astype(int)
        keep = np.array([c in self.class_map for c in cls_raw], dtype=bool)
        cls = np.array([self.class_map.get(c, -1) for c in cls_raw], dtype=int)
        det = Detections(b.xyxy.cpu().numpy()[keep].astype(np.float32), b.conf.cpu().numpy()[keep].astype(np.float32), cls[keep])
        # Top: en güvenilir tek tespiti tut
        ball = np.where(det.class_id == BALL)[0]
        if len(ball) > 1:
            drop = ball[np.argsort(-det.confidence[ball])[1:]]
            det = det[~np.isin(np.arange(len(det)), drop)]
        return det


class PitchKeypointDetector:
    """roboflow "football-field-detection" gibi 32 noktalı YOLO-pose saha modeli."""

    def __init__(self, weights: str, conf: float = 0.5, device: str | None = None):
        from ultralytics import YOLO

        self.model, self.conf, self.device = YOLO(weights), conf, device

    def detect(self, frame: np.ndarray) -> tuple[np.ndarray, np.ndarray] | None:
        """(görüntü noktaları, 0 tabanlı köşe indeksleri) ya da None."""
        r = self.model.predict(frame, device=self.device, verbose=False)[0]
        if r.keypoints is None or r.keypoints.xy is None or len(r.keypoints.xy) == 0:
            return None
        xy = r.keypoints.xy[0].cpu().numpy()
        conf = r.keypoints.conf[0].cpu().numpy() if r.keypoints.conf is not None else np.ones(len(xy))
        ok = conf > self.conf
        if ok.sum() < 4:
            return None
        return xy[ok], np.where(ok)[0]
