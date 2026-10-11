"""Saha geometrisi ve görüntü -> saha (metre) dönüşümü.

Anahtar nokta sırası roboflow/sports `SoccerPitchConfiguration` ile aynıdır; böylece
onların "football-field-detection" anahtar nokta modeli doğrudan kullanılabilir.
Ölçüler gerçek FIFA ölçüleridir (105 x 68 m).
"""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np

LENGTH, WIDTH = 105.0, 68.0
PENALTY_BOX_W, PENALTY_BOX_L = 40.32, 16.5
GOAL_BOX_W, GOAL_BOX_L = 18.32, 5.5
CIRCLE_R, PENALTY_SPOT = 9.15, 11.0


def pitch_vertices() -> np.ndarray:
    """32 saha anahtar noktası (metre)."""
    L, W = LENGTH, WIDTH
    pb0, pb1 = (W - PENALTY_BOX_W) / 2, (W + PENALTY_BOX_W) / 2
    gb0, gb1 = (W - GOAL_BOX_W) / 2, (W + GOAL_BOX_W) / 2
    return np.array([
        (0, 0), (0, pb0), (0, gb0), (0, gb1), (0, pb1), (0, W),
        (GOAL_BOX_L, gb0), (GOAL_BOX_L, gb1), (PENALTY_SPOT, W / 2),
        (PENALTY_BOX_L, pb0), (PENALTY_BOX_L, gb0), (PENALTY_BOX_L, gb1), (PENALTY_BOX_L, pb1),
        (L / 2, 0), (L / 2, W / 2 - CIRCLE_R), (L / 2, W / 2 + CIRCLE_R), (L / 2, W),
        (L - PENALTY_BOX_L, pb0), (L - PENALTY_BOX_L, gb0), (L - PENALTY_BOX_L, gb1), (L - PENALTY_BOX_L, pb1),
        (L - PENALTY_SPOT, W / 2), (L - GOAL_BOX_L, gb0), (L - GOAL_BOX_L, gb1),
        (L, 0), (L, pb0), (L, gb0), (L, gb1), (L, pb1), (L, W),
        (L / 2 - CIRCLE_R, W / 2), (L / 2 + CIRCLE_R, W / 2),
    ], dtype=np.float32)


# Çizim için çizgi bağlantıları (1 tabanlı indeksler, roboflow ile aynı)
PITCH_EDGES = [
    (1, 2), (2, 3), (3, 4), (4, 5), (5, 6), (7, 8), (10, 11), (11, 12), (12, 13), (14, 15),
    (15, 16), (16, 17), (18, 19), (19, 20), (20, 21), (23, 24), (25, 26), (26, 27), (27, 28),
    (28, 29), (29, 30), (1, 14), (2, 10), (3, 7), (4, 8), (5, 13), (6, 17), (14, 25),
    (18, 26), (23, 27), (24, 28), (21, 29), (17, 30),
]


class ViewTransformer:
    """Homografi ile görüntü noktalarını saha koordinatına çevirir."""

    def __init__(self, image_pts: np.ndarray, pitch_pts: np.ndarray):
        image_pts = np.asarray(image_pts, dtype=np.float32)
        pitch_pts = np.asarray(pitch_pts, dtype=np.float32)
        if len(image_pts) < 4:
            raise ValueError("Homografi için en az 4 nokta gerekir")
        self.m, _ = cv2.findHomography(image_pts, pitch_pts, cv2.RANSAC if len(image_pts) > 4 else 0, 1.0)
        if self.m is None:
            raise ValueError("Homografi hesaplanamadı")

    def transform(self, points: np.ndarray) -> np.ndarray:
        points = np.asarray(points, dtype=np.float32).reshape(-1, 1, 2)
        if points.size == 0:
            return np.zeros((0, 2), dtype=np.float32)
        return cv2.perspectiveTransform(points, self.m).reshape(-1, 2)


def load_calibration(path: str | Path) -> ViewTransformer:
    """Elle kalibrasyon dosyası: {"image_points": [[x,y],...], "pitch_points": [[x,y],...]}
    ya da pitch_points yerine "vertex_ids": [1..32] (anahtar nokta numaraları)."""
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    img = np.array(data["image_points"], dtype=np.float32)
    if "vertex_ids" in data:
        pitch = pitch_vertices()[np.array(data["vertex_ids"]) - 1]
    else:
        pitch = np.array(data["pitch_points"], dtype=np.float32)
    return ViewTransformer(img, pitch)


def inside_pitch(xy: np.ndarray, margin: float = 3.0) -> np.ndarray:
    xy = np.atleast_2d(xy)
    return (xy[:, 0] > -margin) & (xy[:, 0] < LENGTH + margin) & (xy[:, 1] > -margin) & (xy[:, 1] < WIDTH + margin)


def draw_pitch(scale: float = 8.0, padding: int = 20, bg=(34, 139, 34), line=(255, 255, 255)) -> np.ndarray:
    """Kuşbakışı saha görüntüsü (BGR). Saha noktası -> piksel: padding + xy*scale."""
    h, w = int(WIDTH * scale) + 2 * padding, int(LENGTH * scale) + 2 * padding
    img = np.full((h, w, 3), bg, dtype=np.uint8)
    v = pitch_vertices()

    def p(pt):
        return int(pt[0] * scale) + padding, int(pt[1] * scale) + padding

    for a, b in PITCH_EDGES:
        cv2.line(img, p(v[a - 1]), p(v[b - 1]), line, 2, cv2.LINE_AA)
    cv2.circle(img, p((LENGTH / 2, WIDTH / 2)), int(CIRCLE_R * scale), line, 2, cv2.LINE_AA)
    for spot in (v[8], v[21], (LENGTH / 2, WIDTH / 2)):
        cv2.circle(img, p(spot), 4, line, -1, cv2.LINE_AA)
    return img


def to_radar_px(xy: np.ndarray, scale: float = 8.0, padding: int = 20) -> np.ndarray:
    return (np.atleast_2d(xy) * scale + padding).astype(int)
