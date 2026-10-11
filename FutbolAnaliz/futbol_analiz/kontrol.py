"""Sistem kontrolü: python -m futbol_analiz.kontrol"""
import platform
import sys
import time


def main():
    print(f"Python      : {sys.version.split()[0]} ({platform.platform()})")
    ok = True
    try:
        import torch

        cuda = torch.cuda.is_available()
        print(f"PyTorch     : {torch.__version__}  CUDA: {'VAR - ' + torch.cuda.get_device_name(0) if cuda else 'yok (CPU kullanilacak)'}")
    except Exception as e:  # pragma: no cover
        print(f"PyTorch     : YUKLENEMEDI ({e})")
        return 1
    for mod in ("cv2", "ultralytics", "streamlit", "sklearn", "scipy", "matplotlib", "mss"):
        try:
            m = __import__(mod)
            print(f"{mod:<12}: {getattr(m, '__version__', 'ok')}")
        except Exception as e:
            ok = False
            print(f"{mod:<12}: HATA {e}")

    from .detection import YoloDetector, default_models, model_dir

    player, pitch = default_models()
    print(f"Model klasoru: {model_dir()}")
    print(f"Oyuncu modeli: {player}")
    print(f"Saha modeli  : {pitch or 'yok (elle kalibrasyon ya da yaklasik mod)'}")
    try:
        import numpy as np

        det = YoloDetector(player)
        frame = np.zeros((720, 1280, 3), np.uint8)
        det.detect(frame)
        t0, n = time.time(), 5
        for _ in range(n):
            det.detect(frame)
        fps = n / (time.time() - t0)
        print(f"Model testi  : OK, yaklasik {fps:.1f} kare/sn (imgsz={det.imgsz})")
        if fps < 8:
            print("  Not: canli analizde --adim 3 veya daha buyuk kullanin; NVIDIA GPU ile cok daha hizli calisir.")
    except Exception as e:
        ok = False
        print(f"Model testi  : HATA {e}")
    try:
        import mss

        with mss.mss() as s:
            print(f"Monitorler   : {len(s.monitors) - 1} adet " + ", ".join(f"{i}: {m['width']}x{m['height']}" for i, m in enumerate(s.monitors[1:], 1)))
    except Exception as e:
        print(f"Monitorler   : okunamadi ({e})")
    print("\nSONUC: " + ("Her sey hazir." if ok else "Sorun var, yukaridaki hatalara bakin."))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
