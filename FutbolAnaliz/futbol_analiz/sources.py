"""Görüntü kaynakları: video dosyası, webcam, RTSP/HTTP yayın veya ekran yakalama (canlı)."""
from __future__ import annotations

import time
from typing import Iterator

import cv2
import numpy as np


def open_source(source: str | int, stride: int = 1, max_frames: int | None = None,
                screen_region: tuple[int, int, int, int] | None = None) -> tuple[Iterator[np.ndarray], float]:
    """(kare üreteci, fps) döndürür.

    source: dosya yolu, "0" gibi kamera indeksi, "rtsp://..." / "http://..." adresi
            ya da "screen" (ekranda açık maç yayınını canlı analiz eder, `mss` gerekir).
    stride: her n. kareyi işle (canlı modda gecikmeyi azaltır).
    """
    if str(source) == "screen":
        return _screen_frames(screen_region, stride, max_frames), 25.0 / stride

    src = int(source) if str(source).isdigit() else str(source)
    cap = cv2.VideoCapture(src)
    if not cap.isOpened():
        raise FileNotFoundError(f"Kaynak açılamadı: {source}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    if not np.isfinite(fps) or fps <= 1:
        fps = 25.0

    def gen():
        i = produced = 0
        try:
            while True:
                ok, frame = cap.read()
                if not ok:
                    break
                if i % stride == 0:
                    yield frame
                    produced += 1
                    if max_frames and produced >= max_frames:
                        break
                i += 1
        finally:
            cap.release()

    return gen(), fps / stride


def _screen_frames(region, stride, max_frames):
    try:
        import mss
    except ImportError as e:  # pragma: no cover
        raise ImportError("Ekran yakalama için: pip install mss") from e
    with mss.mss() as sct:
        mon = sct.monitors[1]
        if region:
            mon = {"left": region[0], "top": region[1], "width": region[2], "height": region[3]}
        produced, period = 0, stride / 25.0
        while not max_frames or produced < max_frames:
            t0 = time.time()
            frame = cv2.cvtColor(np.array(sct.grab(mon)), cv2.COLOR_BGRA2BGR)
            yield frame
            produced += 1
            time.sleep(max(0.0, period - (time.time() - t0)))
