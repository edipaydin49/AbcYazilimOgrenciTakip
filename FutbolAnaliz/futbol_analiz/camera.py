"""Kamera hareketi telafisi (abdullahtarek yöntemi: Lucas-Kanade optik akış).

Elle yapılmış tek bir kalibrasyon kullanılırken yayın kamerası sağa-sola kayarsa,
oyuncu konumları kalibrasyon karesinin koordinatlarına geri taşınır.
Saha anahtar noktası modeli varsa her karede yeni homografi hesaplandığından gerekmez.
"""
from __future__ import annotations

import cv2
import numpy as np


class CameraMotionEstimator:
    def __init__(self, min_distance: float = 0.5):
        self.prev = None
        self.offset = np.zeros(2, dtype=np.float32)  # kalibrasyon karesine göre toplam kayma
        self.min_distance = min_distance
        self.lk = dict(winSize=(15, 15), maxLevel=2, criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 10, 0.03))

    def update(self, frame: np.ndarray, people_boxes: np.ndarray) -> np.ndarray:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        mask = np.full(gray.shape, 255, dtype=np.uint8)
        for x1, y1, x2, y2 in people_boxes.astype(int):  # hareketli oyuncuları maskele
            mask[max(0, y1):y2, max(0, x1):x2] = 0
        if self.prev is not None:
            p0 = cv2.goodFeaturesToTrack(self.prev[0], maxCorners=200, qualityLevel=0.3, minDistance=7, mask=self.prev[1])
            if p0 is not None:
                p1, st, _ = cv2.calcOpticalFlowPyrLK(self.prev[0], gray, p0, None, **self.lk)
                good = st.reshape(-1) == 1
                if good.sum() >= 5:
                    flow = np.median((p1 - p0).reshape(-1, 2)[good], axis=0)
                    if np.linalg.norm(flow) > self.min_distance:
                        self.offset += flow
        self.prev = (gray, mask)
        return self.offset.copy()

    def to_reference(self, points: np.ndarray) -> np.ndarray:
        """Şimdiki karedeki noktaları kalibrasyon karesine taşır."""
        return np.asarray(points, dtype=np.float32) - self.offset
