"""Forma rengiyle takım ayırma.

- abdullahtarek: göğüs bölgesini 2 renge ayır, köşe piksellerine bakarak arka planı (çim) at.
- roboflow/sports: kalecileri sahadaki takım merkezine yakınlığa göre ata.
- Kimlik başına oy çokluğu ile takım bilgisi sabitlenir (titreme yok).
"""
from __future__ import annotations

from collections import Counter, defaultdict

import cv2
import numpy as np
from sklearn.cluster import KMeans

from .core import GOALKEEPER, PLAYER, Detections


def jersey_color(frame: np.ndarray, box: np.ndarray) -> np.ndarray | None:
    """Kutunun üst yarısından forma rengini (Lab) çıkarır."""
    x1, y1, x2, y2 = box.astype(int)
    h, w = frame.shape[:2]
    x1, x2 = max(0, x1), min(w, x2)
    y1, y2 = max(0, y1), min(h, y2)
    if x2 - x1 < 4 or y2 - y1 < 8:
        return None
    crop = frame[y1:y1 + (y2 - y1) // 2, x1:x2]
    crop = cv2.resize(crop, (16, 16), interpolation=cv2.INTER_AREA)
    lab = cv2.cvtColor(crop, cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
    km = KMeans(n_clusters=2, n_init=2, random_state=0).fit(lab)
    labels = km.labels_.reshape(16, 16)
    corners = [labels[0, 0], labels[0, -1], labels[-1, 0], labels[-1, -1]]
    bg = Counter(corners).most_common(1)[0][0]
    return km.cluster_centers_[1 - bg]


class TeamClassifier:
    def __init__(self, warmup_samples: int = 60):
        self.warmup = warmup_samples
        self.samples: list[np.ndarray] = []
        self.model: KMeans | None = None
        self.votes: dict[int, Counter] = defaultdict(Counter)
        self.team_colors_bgr: list[tuple[int, int, int]] = [(255, 191, 0), (60, 60, 255)]

    @property
    def ready(self) -> bool:
        return self.model is not None

    def _fit(self):
        X = np.array(self.samples)
        self.model = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X)
        for k, c in enumerate(self.model.cluster_centers_):
            lab = np.clip(c, 0, 255).astype(np.uint8).reshape(1, 1, 3)
            self.team_colors_bgr[k] = tuple(int(v) for v in cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)[0, 0])

    def update(self, frame: np.ndarray, det: Detections, pitch_xy: np.ndarray | None = None) -> np.ndarray:
        """Her tespit için takım (0/1, bilinmiyor/hakem/top: -1) döndürür."""
        teams = np.full(len(det), -1, dtype=int)
        players = np.where(det.class_id == PLAYER)[0]
        # Takımı kesinleşmiş (yeterli oyu olan) kimlikler için renk tekrar hesaplanmaz -> hız
        colors = {i: (jersey_color(frame, det.xyxy[i]) if sum(self.votes[int(det.tracker_id[i])].values()) < 25 else None)
                  for i in players}
        if not self.ready:
            self.samples += [c for c in colors.values() if c is not None]
            if len(self.samples) >= self.warmup:
                self._fit()
            else:
                return teams
        for i, c in colors.items():
            tid = int(det.tracker_id[i])
            if c is not None:
                self.votes[tid][int(self.model.predict(c[None])[0])] += 1
            if self.votes[tid]:
                teams[i] = self.votes[tid].most_common(1)[0][0]

        # Kaleciler: konumu en yakın takım merkezine (roboflow yöntemi)
        pos = pitch_xy if pitch_xy is not None else det.foot_points
        for i in np.where(det.class_id == GOALKEEPER)[0]:
            tid = int(det.tracker_id[i])
            cents = [pos[(teams == k) & (det.class_id == PLAYER)].mean(axis=0) if ((teams == k) & (det.class_id == PLAYER)).any() else None for k in (0, 1)]
            if all(c is not None for c in cents):
                d = [np.linalg.norm(pos[i] - c) for c in cents]
                self.votes[tid][int(np.argmin(d))] += 1
            if self.votes[tid]:
                teams[i] = self.votes[tid].most_common(1)[0][0]
        return teams
