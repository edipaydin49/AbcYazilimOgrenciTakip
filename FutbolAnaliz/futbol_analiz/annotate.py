"""Videonun üzerine çizim: oyuncu elipsleri, top, sahiplik çubuğu, hız/mesafe, radar (mini harita)."""
from __future__ import annotations

import cv2
import numpy as np

from .core import GOALKEEPER, REFEREE, FrameResult
from .pitch import draw_pitch, to_radar_px
from .tactics import space_control

REF_COLOR = (0, 215, 255)


def _ellipse(img, box, color, label=None):
    x1, y1, x2, y2 = box.astype(int)
    cx, w = (x1 + x2) // 2, max(x2 - x1, 10)
    cv2.ellipse(img, (cx, y2), (w // 2, max(w // 6, 4)), 0, -45, 235, color, 2, cv2.LINE_AA)
    if label:
        (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
        cv2.rectangle(img, (cx - tw // 2 - 3, y2 + 6), (cx + tw // 2 + 3, y2 + 10 + th), color, -1)
        cv2.putText(img, label, (cx - tw // 2, y2 + 8 + th), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0), 1, cv2.LINE_AA)


def _triangle(img, x, y, color):
    pts = np.array([[x, y], [x - 8, y - 16], [x + 8, y - 16]], np.int32)
    cv2.drawContours(img, [pts], 0, color, -1)
    cv2.drawContours(img, [pts], 0, (0, 0, 0), 1)


def radar(res: FrameResult, colors, scale: float = 5.0, voronoi: bool = True) -> np.ndarray:
    pad = 12
    img = draw_pitch(scale=scale, padding=pad)
    pl = [p for p in res.players if p.pitch_xy is not None and p.team >= 0]
    if voronoi and pl:
        xy = np.array([p.pitch_xy for p in pl])
        owner, _ = space_control(xy, np.array([p.team for p in pl]), res=1.0)
        if (owner >= 0).any():
            over = np.zeros((owner.shape[0], owner.shape[1], 3), np.uint8)
            for k in (0, 1):
                over[owner == k] = colors[k]
            over = cv2.resize(over, (img.shape[1] - 2 * pad, img.shape[0] - 2 * pad), interpolation=cv2.INTER_NEAREST)
            roi = img[pad:-pad, pad:-pad]
            img[pad:-pad, pad:-pad] = cv2.addWeighted(roi, 0.6, over, 0.4, 0)
    for p in res.players:
        if p.pitch_xy is None:
            continue
        c = REF_COLOR if p.class_id == REFEREE else colors[p.team] if p.team >= 0 else (200, 200, 200)
        x, y = to_radar_px(p.pitch_xy, scale, pad)[0]
        cv2.circle(img, (x, y), 7, c, -1, cv2.LINE_AA)
        cv2.circle(img, (x, y), 7, (0, 0, 0), 1, cv2.LINE_AA)
    if res.ball_pitch_xy is not None:
        x, y = to_radar_px(res.ball_pitch_xy, scale, pad)[0]
        cv2.circle(img, (x, y), 5, (255, 255, 255), -1, cv2.LINE_AA)
        cv2.circle(img, (x, y), 5, (0, 0, 0), 1, cv2.LINE_AA)
    return img


def annotate(frame: np.ndarray, res: FrameResult, colors, possession_pct: dict, formations: dict,
             show_radar: bool = True, live_info: dict | None = None) -> np.ndarray:
    out = frame.copy()
    for p in res.players:
        if p.class_id == REFEREE:
            _ellipse(out, p.box, REF_COLOR)
            continue
        color = colors[p.team] if p.team >= 0 else (200, 200, 200)
        label = f"{'GK ' if p.class_id == GOALKEEPER else ''}{p.track_id}"
        _ellipse(out, p.box, color, label)
        if res.calibrated or p.speed_kmh > 0:
            x1, _, x2, y2 = p.box.astype(int)
            txt = f"{p.speed_kmh:.0f} km/s {p.distance_m:.0f} m"
            cv2.putText(out, txt, (x1 - 10, y2 + 34), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 2, cv2.LINE_AA)
            cv2.putText(out, txt, (x1 - 10, y2 + 34), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1, cv2.LINE_AA)
        if p.track_id == res.owner_id:
            _triangle(out, int((p.box[0] + p.box[2]) / 2), int(p.box[1]), (0, 0, 255))
    if res.ball_image_xy is not None:
        _triangle(out, int(res.ball_image_xy[0]), int(res.ball_image_xy[1]) - 6, (0, 255, 0))

    # Bilgi paneli (sağ üst)
    h, w = out.shape[:2]
    lines = [f"Topa sahip olma  A %{possession_pct.get(0, 0):.0f} - B %{possession_pct.get(1, 0):.0f}",
             f"Dizilis  A {formations.get(0, '?')}  |  B {formations.get(1, '?')}"]
    for k, v in (live_info or {}).items():
        lines.append(f"{k}: {v}")
    bw, bh = 430, 14 + 22 * len(lines)
    panel = out[10:10 + bh, w - bw - 10:w - 10]
    out[10:10 + bh, w - bw - 10:w - 10] = cv2.addWeighted(panel, 0.35, np.full_like(panel, 255), 0.65, 0)
    for i, ln in enumerate(lines):
        cv2.putText(out, ln, (w - bw, 32 + 22 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 0, 0), 1, cv2.LINE_AA)
    # Sahiplik çubuğu
    a = possession_pct.get(0, 0) / 100 if sum(possession_pct.values()) else 0.5
    cv2.rectangle(out, (w - bw - 10, 14 + bh), (w - bw - 10 + int(bw * a), 24 + bh), colors[0], -1)
    cv2.rectangle(out, (w - bw - 10 + int(bw * a), 14 + bh), (w - 10, 24 + bh), colors[1], -1)

    if show_radar and any(p.pitch_xy is not None for p in res.players):
        r = radar(res, colors, scale=max(2.0, w / 4 / 105))
        rh, rw = r.shape[:2]
        if rh < h and rw < w:
            y0, x0 = h - rh - 10, (w - rw) // 2
            out[y0:y0 + rh, x0:x0 + rw] = cv2.addWeighted(out[y0:y0 + rh, x0:x0 + rw], 0.2, r, 0.8, 0)
    if not res.calibrated:
        cv2.putText(out, "Saha kalibre degil: metrikler yaklasik", (12, h - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)
    return out
