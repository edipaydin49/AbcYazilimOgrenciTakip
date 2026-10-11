"""Oyuncu fiziksel istatistikleri ve özellik profili.

- abdullahtarek: kayan pencerede hız (km/s) ve toplam mesafe.
- SportsLabKit: her kare için konum kaydı (CSV'ye dökülür).
- Profil puanları (0-100) bu maçtaki verilerden türetilir; FIFA/SoFIFA reytingi değildir.
"""
from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass, field

import numpy as np

from .pitch import LENGTH, WIDTH

SPRINT_KMH, HIGH_INTENSITY_KMH, MAX_HUMAN_KMH = 25.0, 19.8, 38.0


@dataclass
class PlayerTrack:
    track_id: int
    team_votes: dict = field(default_factory=lambda: defaultdict(int))
    class_votes: dict = field(default_factory=lambda: defaultdict(int))
    times: list = field(default_factory=list)
    xy: list = field(default_factory=list)  # son pencere çapası (saha metresi)
    distance: float = 0.0
    hi_distance: float = 0.0
    top_speed: float = 0.0
    sprints: int = 0
    speed: float = 0.0
    seen_s: float = 0.0
    last_t: float | None = None
    _in_sprint: bool = False

    @property
    def team(self) -> int:
        return max(self.team_votes, key=self.team_votes.get) if self.team_votes else -1

    @property
    def class_id(self) -> int:
        return max(self.class_votes, key=self.class_votes.get) if self.class_votes else -1

    @property
    def seconds(self) -> float:
        """Oyuncunun görüntüde görüldüğü toplam süre."""
        return self.seen_s


class StatsAccumulator:
    def __init__(self, speed_window_s: float = 0.4):
        self.window = speed_window_s
        self.tracks: dict[int, PlayerTrack] = {}

    def update(self, t: float, track_id: int, team: int, class_id: int, xy: np.ndarray | None):
        tr = self.tracks.setdefault(track_id, PlayerTrack(track_id))
        if team >= 0:
            tr.team_votes[team] += 1
        tr.class_votes[class_id] += 1
        if tr.last_t is not None:
            tr.seen_s += min(t - tr.last_t, 0.5)
        tr.last_t = t
        if xy is None:
            return tr
        xy = np.asarray(xy, dtype=float)
        if tr.times and t - tr.times[-1] > 2.0:  # uzun kayıp -> yeniden başla
            tr.times, tr.xy = [], []
        if not tr.times:
            tr.times, tr.xy = [t], [xy]
            return tr
        # abdullahtarek gibi pencere uçları arasındaki yer değiştirme: kare kare titreşim mesafeyi şişirmez
        dt = t - tr.times[-1]
        if dt + 1e-9 < self.window:
            return tr
        step = float(np.linalg.norm(xy - tr.xy[-1]))
        speed = step / dt * 3.6
        tr.times, tr.xy = [t], [xy]
        if speed > MAX_HUMAN_KMH:  # tespit/kimlik sıçraması -> sayma
            return tr
        tr.speed = speed if tr.speed == 0 else 0.5 * tr.speed + 0.5 * speed
        tr.distance += step
        if tr.speed >= HIGH_INTENSITY_KMH:
            tr.hi_distance += step
        tr.top_speed = max(tr.top_speed, tr.speed)
        if tr.speed >= SPRINT_KMH and not tr._in_sprint:
            tr.sprints += 1
        tr._in_sprint = tr.speed >= SPRINT_KMH
        return tr


def _scale(v, lo, hi):
    return int(np.clip((v - lo) / (hi - lo) * 100, 0, 100))


def player_profiles(stats: StatsAccumulator, possession, attack_dir: dict[int, int], all_positions: dict[int, list],
                    min_seconds: float = 5.0) -> list[dict]:
    """Her oyuncu için istatistik + türetilmiş özellik puanları + rol tahmini."""
    passes_made, passes_recv, turnovers, shots = defaultdict(int), defaultdict(int), defaultdict(int), defaultdict(int)
    for e in possession.events:
        if e.type == "pas":
            passes_made[e.from_id] += 1
            passes_recv[e.to_id] += 1
        elif e.type == "top_kaybi":
            turnovers[e.from_id] += 1
        elif e.type == "sut":
            shots[e.from_id] += 1

    rows = []
    for tid, tr in stats.tracks.items():
        pos = np.array(all_positions.get(tid, []))
        if tr.team < 0 or len(pos) == 0 or tr.seconds < min_seconds:
            continue
        avg = pos.mean(axis=0)
        depth = avg[0] if attack_dir.get(tr.team, 1) > 0 else LENGTH - avg[0]  # kendi kalesinden uzaklık
        rows.append((tid, tr, avg, depth))
    # Rol: takımın saha oyuncuları içindeki göreli derinliğe göre (geride oynayan takımda da forvet bulunur)
    span = {}
    for k in (0, 1):
        d = [r[3] for r in rows if r[1].team == k and r[1].class_id != 1]
        span[k] = (min(d), max(d)) if d else (0, 1)

    out = []
    for tid, tr, avg, depth in rows:
        mins = tr.seconds / 60
        lo, hi = span[tr.team]
        rel = (depth - lo) / max(hi - lo, 1e-6)
        if tr.class_id == 1:
            role = "Kaleci"
        elif rel < 0.3:
            role = "Defans"
        elif rel < 0.75:
            role = "Orta saha"
        else:
            role = "Forvet"
        side = "Sol" if (avg[1] < WIDTH / 3) == (attack_dir.get(tr.team, 1) > 0) else "Sağ"
        if WIDTH / 3 <= avg[1] <= 2 * WIDTH / 3:
            side = "Merkez"
        attempts = passes_made[tid] + turnovers[tid]
        out.append({
            "id": tid, "takim": tr.team, "rol": role, "bolge": side,
            "sure_dk": round(mins, 2),
            "mesafe_m": round(tr.distance, 1),
            "dakikada_mesafe_m": round(tr.distance / mins, 1) if mins else 0,
            "yuksek_tempo_mesafe_m": round(tr.hi_distance, 1),
            "max_hiz_kmh": round(tr.top_speed, 1),
            "sprint": tr.sprints,
            "topla_bulusma": possession.touches.get(tid, 0),
            "pas": passes_made[tid], "pas_alma": passes_recv[tid],
            "top_kaybi": turnovers[tid], "sut": shots[tid],
            "pas_isabet_%": round(100 * passes_made[tid] / attempts, 1) if attempts else None,
            "ort_konum": [round(float(avg[0]), 1), round(float(avg[1]), 1)],
            "puan": {
                "hiz": _scale(tr.top_speed, 18, 34),
                "dayaniklilik": _scale(tr.distance / mins if mins else 0, 50, 140),
                "yogunluk": _scale(tr.hi_distance / max(tr.distance, 1) * 100, 0, 25),
                "oyuna_katilim": _scale((possession.touches.get(tid, 0)) / mins if mins else 0, 0, 3),
                "pas": _scale(100 * passes_made[tid] / attempts, 40, 95) if attempts else None,
            },
        })
    return sorted(out, key=lambda r: (r["takim"], r["id"]))
