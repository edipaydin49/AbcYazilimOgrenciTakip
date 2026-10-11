"""Paket genelinde kullanılan ortak veri tipleri."""
from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np

# Sınıf kimlikleri (roboflow/sports "football-player-detection" modeliyle aynı isimler)
BALL, GOALKEEPER, PLAYER, REFEREE = 0, 1, 2, 3
CLASS_NAMES = {BALL: "top", GOALKEEPER: "kaleci", PLAYER: "oyuncu", REFEREE: "hakem"}


@dataclass
class Detections:
    """Bir karedeki tespitler. xyxy: (N,4) piksel kutuları."""

    xyxy: np.ndarray = field(default_factory=lambda: np.zeros((0, 4), dtype=np.float32))
    confidence: np.ndarray = field(default_factory=lambda: np.zeros(0, dtype=np.float32))
    class_id: np.ndarray = field(default_factory=lambda: np.zeros(0, dtype=int))
    tracker_id: np.ndarray = field(default_factory=lambda: np.zeros(0, dtype=int))

    def __len__(self) -> int:
        return len(self.xyxy)

    def __getitem__(self, mask) -> "Detections":
        tid = self.tracker_id if len(self.tracker_id) == len(self.xyxy) else np.full(len(self.xyxy), -1)
        return Detections(self.xyxy[mask], self.confidence[mask], self.class_id[mask], tid[mask])

    @property
    def foot_points(self) -> np.ndarray:
        """Kutunun alt-orta noktası: oyuncunun sahaya bastığı yer."""
        return np.stack([(self.xyxy[:, 0] + self.xyxy[:, 2]) / 2, self.xyxy[:, 3]], axis=1)

    @property
    def centers(self) -> np.ndarray:
        return np.stack([(self.xyxy[:, 0] + self.xyxy[:, 2]) / 2, (self.xyxy[:, 1] + self.xyxy[:, 3]) / 2], axis=1)


@dataclass
class PlayerState:
    """Bir oyuncunun tek karedeki durumu."""

    track_id: int
    class_id: int
    team: int  # 0 / 1, hakem ve bilinmeyen için -1
    box: np.ndarray
    image_xy: np.ndarray
    pitch_xy: np.ndarray | None  # metre (0..105, 0..68)
    speed_kmh: float = 0.0
    distance_m: float = 0.0


@dataclass
class FrameResult:
    """Pipeline'ın bir kare için ürettiği her şey."""

    index: int
    time_s: float
    players: list[PlayerState]
    ball_image_xy: np.ndarray | None
    ball_pitch_xy: np.ndarray | None
    owner_id: int | None
    owner_team: int | None
    calibrated: bool
