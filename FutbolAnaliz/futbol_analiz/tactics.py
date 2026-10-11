"""Taktik analiz: diziliş, takım şekli, alan kontrolü (Voronoi), pres, pas ağı.

- Diziliş: EFPI / SoccerCPD fikri - oyuncuların ortalama konumları normalize edilip
  şablon dizilişlerle Macar algoritmasıyla eşleştirilir, en düşük maliyetli şablon seçilir.
- Alan kontrolü: roboflow/sports Voronoi - sahadaki her hücre en yakın oyuncunun takımına.
- Pas ağı: DevaNandanJS / Friends-of-Tracking - pas sayıları + ortalama konumlar.
"""
from __future__ import annotations

from collections import Counter

import numpy as np
from scipy.optimize import linear_sum_assignment

from .pitch import LENGTH, WIDTH

# Şablonlar: (derinlik 0=kendi kale tarafı .. 1=rakip kale, genişlik 0..1), 10 saha oyuncusu
def _lines(*rows):
    pts = []
    for depth, n in rows:
        ys = np.linspace(0.1, 0.9, n) if n > 1 else [0.5]
        pts += [(depth, y) for y in ys]
    return np.array(pts, dtype=float)


FORMATIONS = {
    "4-4-2": _lines((0.0, 4), (0.5, 4), (1.0, 2)),
    "4-3-3": _lines((0.0, 4), (0.5, 3), (1.0, 3)),
    "4-2-3-1": _lines((0.0, 4), (0.33, 2), (0.66, 3), (1.0, 1)),
    "4-1-4-1": _lines((0.0, 4), (0.3, 1), (0.6, 4), (1.0, 1)),
    "4-4-1-1": _lines((0.0, 4), (0.45, 4), (0.75, 1), (1.0, 1)),
    "4-5-1": _lines((0.0, 4), (0.5, 5), (1.0, 1)),
    "3-5-2": _lines((0.0, 3), (0.5, 5), (1.0, 2)),
    "3-4-3": _lines((0.0, 3), (0.5, 4), (1.0, 3)),
    "3-4-2-1": _lines((0.0, 3), (0.4, 4), (0.75, 2), (1.0, 1)),
    "5-3-2": _lines((0.0, 5), (0.5, 3), (1.0, 2)),
    "5-4-1": _lines((0.0, 5), (0.5, 4), (1.0, 1)),
}


def _normalize(xy: np.ndarray) -> np.ndarray:
    lo, hi = xy.min(axis=0), xy.max(axis=0)
    return (xy - lo) / np.maximum(hi - lo, 1e-6)


_TEMPLATES = {name: _normalize(tpl) for name, tpl in FORMATIONS.items()}


def detect_formation(outfield_xy: np.ndarray, attack_dir: int = 1) -> tuple[str, float]:
    """outfield_xy: kaleci hariç oyuncuların (ortalama) saha konumları, metre.
    attack_dir: +1 takım +x yönüne hücum ediyor, -1 tersi. (diziliş, güven 0..1) döndürür."""
    if len(outfield_xy) < 8:
        return "belirsiz", 0.0
    xy = np.asarray(outfield_xy, dtype=float).copy()
    if attack_dir < 0:
        xy[:, 0] = LENGTH - xy[:, 0]
        xy[:, 1] = WIDTH - xy[:, 1]
    q = _normalize(xy)
    costs = {}
    for name, tpl in _TEMPLATES.items():
        c = ((q[:, None, :] - tpl[None, :, :]) ** 2 * np.array([1.5, 1.0])).sum(axis=2)  # derinlik daha önemli
        r, k = linear_sum_assignment(c)  # eksik oyuncu varsa en iyi alt küme
        costs[name] = c[r, k].mean()
    ranked = sorted(costs.items(), key=lambda kv: kv[1])
    best, second = ranked[0], ranked[1]
    conf = float(np.clip((second[1] - best[1]) / (second[1] + 1e-9) * 3, 0, 1))
    return best[0], round(conf, 2)


def team_shape(outfield_xy: np.ndarray, attack_dir: int = 1) -> dict:
    """Genişlik, derinlik, kompaktlık, savunma hattı yüksekliği (metre)."""
    xy = np.asarray(outfield_xy, dtype=float)
    if len(xy) < 3:
        return {}
    xs = xy[:, 0] if attack_dir > 0 else LENGTH - xy[:, 0]
    cen = xy.mean(axis=0)
    width = float(np.percentile(xy[:, 1], 90) - np.percentile(xy[:, 1], 10))
    depth = float(np.percentile(xs, 90) - np.percentile(xs, 10))
    return {
        "genislik_m": round(width, 1),
        "derinlik_m": round(depth, 1),
        "kompaktlik_m": round(float(np.linalg.norm(xy - cen, axis=1).mean()), 1),
        "savunma_hatti_m": round(float(np.sort(xs)[: min(4, len(xs))].mean()), 1),
        "merkez": [round(float(cen[0]), 1), round(float(cen[1]), 1)],
    }


def space_control(xy: np.ndarray, teams: np.ndarray, res: float = 1.0) -> tuple[np.ndarray, dict[int, float]]:
    """Voronoi alan kontrolü. (H,W) takım ızgarası ve takım başına alan yüzdesi."""
    gx, gy = np.meshgrid(np.arange(res / 2, LENGTH, res), np.arange(res / 2, WIDTH, res))
    grid = np.stack([gx, gy], axis=-1)
    ok = teams >= 0
    if ok.sum() == 0 or len(set(teams[ok])) < 2:
        return np.full(gx.shape, -1), {0: 0.0, 1: 0.0}
    d = np.linalg.norm(grid[:, :, None, :] - xy[ok][None, None], axis=-1)
    owner = teams[ok][np.argmin(d, axis=-1)]
    return owner, {k: round(100 * float((owner == k).mean()), 1) for k in (0, 1)}


def pressure_on_ball(carrier_xy, carrier_team: int, xy: np.ndarray, teams: np.ndarray) -> float | None:
    """Top sahibine en yakın rakibin mesafesi (m). Küçük değer = yoğun pres."""
    if carrier_xy is None or carrier_team is None:
        return None
    opp = xy[teams == 1 - carrier_team]
    if len(opp) == 0:
        return None
    return float(np.linalg.norm(opp - np.asarray(carrier_xy), axis=1).min())


def pass_network(events, avg_positions: dict[int, np.ndarray], team: int, min_passes: int = 1) -> dict:
    edges = Counter((e.from_id, e.to_id) for e in events if e.type == "pas" and e.team == team)
    nodes = {pid for pair in edges for pid in pair}
    return {
        "dugumler": {int(p): [round(float(v), 1) for v in avg_positions[p]] for p in nodes if p in avg_positions},
        "kenarlar": [{"kimden": int(a), "kime": int(b), "sayi": n} for (a, b), n in edges.most_common() if n >= min_passes],
    }


def heatmap(xy: np.ndarray, bins=(21, 14)) -> np.ndarray:
    if len(xy) == 0:
        return np.zeros(bins[::-1])
    h, _, _ = np.histogram2d(xy[:, 0], xy[:, 1], bins=bins, range=[[0, LENGTH], [0, WIDTH]])
    return h.T


class TacticsTracker:
    """Zaman içinde takım şekli ve dizilişi izler (son N saniyelik ortalama konumlarla)."""

    def __init__(self, window_s: float = 20.0, every_s: float = 2.0):
        self.window, self.every = window_s, every_s
        self.hist: list[tuple[float, dict[int, tuple[int, np.ndarray, bool]]]] = []
        self.formations: dict[int, list[tuple[float, str, float]]] = {0: [], 1: []}
        self.shapes: dict[int, list[dict]] = {0: [], 1: []}
        self.control: dict[int, list[float]] = {0: [], 1: []}
        self.pressure: list[float] = []
        self.side_votes = {0: [], 1: []}  # takımın ortalama x'i -> hücum yönü
        self._last = -1e9

    def attack_dir(self, team: int) -> int:
        """Ortalaması sahanın solunda olan takım sağa (+x) hücum eder."""
        a, b = np.mean(self.side_votes[0] or [0]), np.mean(self.side_votes[1] or [0])
        if not self.side_votes[0] or not self.side_votes[1]:
            return 1
        left = 0 if a < b else 1
        return 1 if team == left else -1

    def update(self, t: float, ids, teams, xy, is_gk, carrier_xy=None, carrier_team=None):
        self.hist.append((t, {int(i): (int(k), np.asarray(p, float), bool(g)) for i, k, p, g in zip(ids, teams, xy, is_gk) if k >= 0}))
        self.hist = [h for h in self.hist if t - h[0] <= self.window]
        for k in (0, 1):
            pts = xy[(teams == k)]
            if len(pts):
                self.side_votes[k] = self.side_votes[k][-3000:] + [float(pts[:, 0].mean())]  # devre arası yön değişimi
        pr = pressure_on_ball(carrier_xy, carrier_team, xy, teams)
        if pr is not None:
            self.pressure.append(pr)
        if t - self._last < self.every:
            return
        self._last = t
        _, pct = space_control(xy, teams, res=2.0)
        for k in (0, 1):
            self.control[k].append(pct[k])
            outfield = self.window_positions(k)
            if len(outfield) >= 8:
                f, c = detect_formation(outfield, self.attack_dir(k))
                self.formations[k].append((t, f, c))
            if len(outfield) >= 3:
                self.shapes[k].append(team_shape(outfield, self.attack_dir(k)))

    def window_positions(self, team: int) -> np.ndarray:
        """Penceredeki saha oyuncularının (kaleci hariç) ortalama konumları; en çok görülen 10'u."""
        acc: dict[int, list] = {}
        for _, frame in self.hist:
            for pid, (k, p, gk) in frame.items():
                if k == team and not gk:
                    acc.setdefault(pid, []).append(p)
        top = sorted(acc.items(), key=lambda kv: -len(kv[1]))[:10]
        return np.array([np.mean(v, axis=0) for _, v in top]) if top else np.zeros((0, 2))

    def current_formation(self, team: int) -> str:
        return self.formations[team][-1][1] if self.formations[team] else "belirsiz"

    def summary(self) -> dict:
        out = {}
        for k in (0, 1):
            names = [f for _, f, _ in self.formations[k]]
            shapes = self.shapes[k]
            avg_shape = {key: round(float(np.mean([s[key] for s in shapes])), 1)
                         for key in ("genislik_m", "derinlik_m", "kompaktlik_m", "savunma_hatti_m")} if shapes else {}
            changes = [(round(t, 1), f) for i, (t, f, _) in enumerate(self.formations[k]) if i == 0 or f != self.formations[k][i - 1][1]]
            out[k] = {
                "dizilis": Counter(names).most_common(1)[0][0] if names else "belirsiz",
                "dizilis_dagilimi": dict(Counter(names)),
                "dizilis_degisimleri": changes,
                "ortalama_sekil": avg_shape,
                "alan_kontrolu_%": round(float(np.mean(self.control[k])), 1) if self.control[k] else None,
                "hucum_yonu": "sag" if self.attack_dir(k) > 0 else "sol",
            }
        out["ortalama_pres_mesafesi_m"] = round(float(np.mean(self.pressure)), 1) if self.pressure else None
        return out
