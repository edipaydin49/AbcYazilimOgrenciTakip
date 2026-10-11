"""Hafif çoklu nesne takibi (ByteTrack mantığı: önce yüksek, sonra düşük güvenli eşleştirme).

Harici bağımlılık yok; sabit hız tahmini + IoU/merkez mesafesi + Macar algoritması.
"""
from __future__ import annotations

from collections import Counter

import numpy as np
from scipy.optimize import linear_sum_assignment

from .core import BALL, Detections


def iou_matrix(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    if len(a) == 0 or len(b) == 0:
        return np.zeros((len(a), len(b)))
    x1 = np.maximum(a[:, None, 0], b[None, :, 0])
    y1 = np.maximum(a[:, None, 1], b[None, :, 1])
    x2 = np.minimum(a[:, None, 2], b[None, :, 2])
    y2 = np.minimum(a[:, None, 3], b[None, :, 3])
    inter = np.clip(x2 - x1, 0, None) * np.clip(y2 - y1, 0, None)
    area = lambda r: (r[:, 2] - r[:, 0]) * (r[:, 3] - r[:, 1])
    return inter / (area(a)[:, None] + area(b)[None, :] - inter + 1e-9)


class _Track:
    def __init__(self, tid, box, cls):
        self.id, self.box, self.vel = tid, box.astype(np.float32), np.zeros(4, np.float32)
        self.missed, self.hits, self.classes = 0, 1, Counter([cls])

    def predict(self):
        return self.box + self.vel * (self.missed + 1)

    def update(self, box, cls):
        new = box.astype(np.float32)
        self.vel = 0.6 * self.vel + 0.4 * (new - self.box) / (self.missed + 1)
        self.box, self.missed = new, 0
        self.hits += 1
        self.classes[cls] += 1


class Tracker:
    def __init__(self, high_thresh: float = 0.5, match_cost: float = 0.8, max_age: int = 30):
        self.high, self.match_cost, self.max_age = high_thresh, match_cost, max_age
        self.tracks: list[_Track] = []
        self._next = 1

    def _cost(self, tracks, boxes):
        pred = np.array([t.predict() for t in tracks]).reshape(-1, 4)
        iou = iou_matrix(pred, boxes)
        pc = (pred[:, :2] + pred[:, 2:]) / 2
        bc = (boxes[:, :2] + boxes[:, 2:]) / 2
        h = np.maximum(pred[:, 3] - pred[:, 1], 1)[:, None]
        dist = np.linalg.norm(pc[:, None] - bc[None], axis=2) / h  # oyuncu boyuna göre normalize
        return 1 - iou + 0.5 * np.minimum(dist, 2)

    def _match(self, tracks, boxes):
        if not tracks or len(boxes) == 0:
            return [], list(range(len(tracks))), list(range(len(boxes)))
        cost = self._cost(tracks, boxes)
        r, c = linear_sum_assignment(cost)
        pairs = [(i, j) for i, j in zip(r, c) if cost[i, j] < self.match_cost]
        mt = {i for i, _ in pairs}
        md = {j for _, j in pairs}
        return pairs, [i for i in range(len(tracks)) if i not in mt], [j for j in range(len(boxes)) if j not in md]

    def update(self, det: Detections) -> Detections:
        """Top dışındaki tespitlere tracker_id atar. Top için tracker_id = 0."""
        out_ids = np.full(len(det), -1, dtype=int)
        people = np.where(det.class_id != BALL)[0]
        out_ids[det.class_id == BALL] = 0
        boxes, confs, classes = det.xyxy[people], det.confidence[people], det.class_id[people]

        hi = np.where(confs >= self.high)[0]
        lo = np.where(confs < self.high)[0]
        pairs, um_t, um_hi = self._match(self.tracks, boxes[hi])
        for ti, dj in pairs:
            self.tracks[ti].update(boxes[hi[dj]], classes[hi[dj]])
            out_ids[people[hi[dj]]] = self.tracks[ti].id
        # İkinci tur: eşleşmeyen izler <-> düşük güvenli tespitler (ByteTrack fikri)
        rest = [self.tracks[i] for i in um_t]
        pairs2, um_t2, _ = self._match(rest, boxes[lo])
        for ti, dj in pairs2:
            rest[ti].update(boxes[lo[dj]], classes[lo[dj]])
            out_ids[people[lo[dj]]] = rest[ti].id
        for i in um_t2:
            rest[i].missed += 1
        for dj in um_hi:  # yeni iz yalnızca yüksek güvenli tespitten açılır
            t = _Track(self._next, boxes[hi[dj]], classes[hi[dj]])
            self._next += 1
            self.tracks.append(t)
            out_ids[people[hi[dj]]] = t.id
        self.tracks = [t for t in self.tracks if t.missed <= self.max_age]

        res = det[out_ids >= 0]
        res.tracker_id = out_ids[out_ids >= 0]
        # İz için çoğunluk sınıfı (oyuncu/kaleci/hakem titremesini önler)
        cls_by_id = {t.id: t.classes.most_common(1)[0][0] for t in self.tracks}
        res.class_id = np.array([cls_by_id.get(i, c) if i > 0 else c for i, c in zip(res.tracker_id, res.class_id)], dtype=int)
        return res
