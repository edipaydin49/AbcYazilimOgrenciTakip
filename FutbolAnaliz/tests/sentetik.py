"""Testler için sentetik maç: kuşbakışı saha, renkli formalı oyuncular, pas yapan top."""
import numpy as np
import cv2

from futbol_analiz.core import BALL, GOALKEEPER, PLAYER, REFEREE, Detections
from futbol_analiz.tactics import FORMATIONS

PX = 10  # piksel / metre
W, H = 1050, 680
RED, BLUE = (40, 40, 220), (220, 120, 30)


def team_positions(formation, attack_dir):
    tpl = FORMATIONS[formation]
    x = 15 + tpl[:, 0] * 30  # kendi yarı sahasında 15..45 m
    y = 8 + tpl[:, 1] * 52
    if attack_dir < 0:
        x, y = 105 - x, 68 - y
    return np.stack([x, y], axis=1)


class SyntheticMatch:
    def __init__(self, fps=25, seconds=24, seed=0):
        self.fps, self.n = fps, fps * seconds
        rng = np.random.default_rng(seed)
        a = team_positions("4-4-2", +1)
        b = team_positions("4-3-3", -1)
        self.base = np.vstack([a, [[3, 34]], b, [[102, 34]], [[52, 20]]])  # 10 A, GK A, 10 B, GK B, hakem
        self.team = np.array([0] * 11 + [1] * 11 + [-1])
        self.cls = np.array([PLAYER] * 10 + [GOALKEEPER] + [PLAYER] * 10 + [GOALKEEPER] + [REFEREE])
        self.phase = rng.uniform(0, 2 * np.pi, (len(self.base), 2))
        # Top: A takımı içinde paslar, sonra B'nin 15 numaralı oyuncusu araya girer, B içinde pas
        self.chain = [0, 5, 8, 6, 9, 15, 12, 18]  # oyuncu indeksleri
        self.hold_s = 2.0

    def positions(self, f):
        t = f / self.fps
        jitter = 1.5 * np.sin(t * 0.8 + self.phase)  # yavaş salınım (~1 m/s)
        drift = np.array([[0.4 * t, 0]])  # herkes yavaşça sağa
        return self.base + jitter + drift

    def ball(self, f, pos):
        t = f / self.fps
        k = int(t // self.hold_s)
        if k >= len(self.chain) - 1:
            return pos[self.chain[-1]] + [0.5, 0]
        frac = (t % self.hold_s) / self.hold_s
        a, b = pos[self.chain[k]] + [0.5, 0], pos[self.chain[k + 1]] + [0.5, 0]
        if frac < 0.6:  # oyuncuda bekle
            return a
        return a + (b - a) * (frac - 0.6) / 0.4  # pas yolu

    def frame(self, f):
        img = np.full((H, W, 3), (60, 140, 60), np.uint8)
        pos = self.positions(f)
        boxes, cls = [], []
        for i, (x, y) in enumerate(pos):
            px, py = int(x * PX), int(y * PX)
            x1, y1, x2, y2 = px - 9, py - 36, px + 9, py
            color = RED if self.team[i] == 0 else BLUE if self.team[i] == 1 else (0, 230, 230)
            if self.cls[i] == GOALKEEPER:
                color = (30, 200, 30) if self.team[i] == 0 else (200, 30, 200)
            cv2.rectangle(img, (x1, y1), (x2, y1 + 18), color, -1)
            cv2.rectangle(img, (x1, y1 + 18), (x2, y2), (20, 20, 20), -1)
            boxes.append([x1 - 3, y1 - 3, x2 + 3, y2])  # biraz çim payı (gerçek kutular gibi)
            cls.append(self.cls[i])
        bx, by = self.ball(f, pos) * PX
        cv2.circle(img, (int(bx), int(by)), 4, (255, 255, 255), -1)
        boxes.append([bx - 4, by - 4, bx + 4, by + 4])
        cls.append(BALL)
        det = Detections(np.array(boxes, np.float32), np.full(len(boxes), 0.9, np.float32), np.array(cls))
        return img, det


class FakeDetector:
    """Gerçek YOLO yerine sentetik maçın doğru kutularını döndürür."""

    def __init__(self, match):
        self.match, self.f = match, 0
        self.pending = None

    def frames(self):
        for f in range(self.match.n):
            img, det = self.match.frame(f)
            self.pending = det
            yield img

    def detect(self, frame):
        return self.pending
