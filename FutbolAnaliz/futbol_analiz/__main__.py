"""Komut satırı.

  python -m futbol_analiz analiz mac.mp4 --model futbol.pt --cikti sonuc/
  python -m futbol_analiz canli --kaynak screen --model futbol.pt --goster
  python -m futbol_analiz kalibre mac.mp4 --cikti kalibrasyon.json
"""
from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

import cv2
import numpy as np


def build(args, fps):
    from .detection import PitchKeypointDetector, YoloDetector
    from .pipeline import MatchAnalyzer
    from .pitch import load_calibration

    det = YoloDetector(args.model, conf=args.conf, imgsz=args.imgsz, device=args.device)
    pitch = PitchKeypointDetector(args.saha_model, device=args.device) if args.saha_model else None
    calib = load_calibration(args.kalibrasyon) if args.kalibrasyon else None
    out = Path(args.cikti)
    out.mkdir(parents=True, exist_ok=True)
    return MatchAnalyzer(det, fps, pitch_detector=pitch, calibration=calib, csv_path=out / "takip.csv",
                         realtime=args.komut == "canli"), out


def run(args):
    from .report import write_report
    from .sources import open_source

    frames, fps = open_source(args.kaynak, stride=args.adim, max_frames=args.max_kare, monitor=args.ekran)
    analyzer, out = build(args, fps)
    t0, n = time.time(), 0
    try:
        for _, res in analyzer.run(frames, video_out=None if args.video_yok else out / "analiz.mp4", show=args.goster):
            n += 1
            if n % 25 == 0:
                pct = analyzer.possession.possession_pct()
                print(f"\rkare {n}  {n / (time.time() - t0):.1f} kare/sn  sahiplik A %{pct[0]:.0f} B %{pct[1]:.0f}  "
                      f"dizilis A {analyzer.tactics.current_formation(0)} B {analyzer.tactics.current_formation(1)}", end="", flush=True)
            if args.sure and time.time() - t0 > args.sure:
                break
    except KeyboardInterrupt:
        print("\nDurduruldu, rapor hazırlanıyor...")
    finally:
        analyzer.close()
    print()
    path = write_report(out, analyzer.summary(), analyzer.heatmaps(), analyzer.possession.timeline)
    print(f"Rapor: {path}\nJSON: {out / 'rapor.json'}\nTakip verisi: {out / 'takip.csv'}")


def calibrate(args):
    """Videonun ilk karesinde saha noktalarına tıklayın; her tıktan sonra terminale köşe numarasını (1-32) yazın.
    Numaralar için README'deki saha şemasına bakın. Bitirmek için 'q'."""
    from .sources import open_source

    frames, _ = open_source(args.video, max_frames=1)
    frame = next(frames)
    pts, ids = [], []

    def click(ev, x, y, *_):
        if ev == cv2.EVENT_LBUTTONDOWN:
            vid = int(input(f"({x},{y}) noktasının köşe numarası (1-32): "))
            pts.append([x, y]); ids.append(vid)
            cv2.circle(frame, (x, y), 5, (0, 0, 255), -1)
            cv2.putText(frame, str(vid), (x + 6, y - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

    cv2.namedWindow("kalibrasyon")
    cv2.setMouseCallback("kalibrasyon", click)
    while True:
        cv2.imshow("kalibrasyon", frame)
        if cv2.waitKey(20) & 0xFF == ord("q"):
            break
    cv2.destroyAllWindows()
    if len(pts) < 4:
        raise SystemExit("En az 4 nokta gerekli")
    Path(args.cikti).write_text(json.dumps({"image_points": pts, "vertex_ids": ids}, indent=2))
    print(f"Kaydedildi: {args.cikti}")


def main(argv=None):
    p = argparse.ArgumentParser(prog="futbol_analiz", description="Futbol maçı video analizi")
    sub = p.add_subparsers(dest="komut", required=True)

    from .detection import default_models

    player_default, pitch_default = default_models()

    def common(sp):
        sp.add_argument("--model", default=player_default, help="oyuncu/top YOLO ağırlığı (futbol modeli önerilir)")
        sp.add_argument("--saha-model", default=pitch_default, help="saha anahtar noktası YOLO-pose ağırlığı (32 nokta)")
        sp.add_argument("--kalibrasyon", help="elle kalibrasyon JSON dosyası")
        sp.add_argument("--cikti", default="sonuc", help="çıktı klasörü")
        sp.add_argument("--adim", type=int, default=1, help="her n. kareyi işle")
        sp.add_argument("--max-kare", type=int)
        sp.add_argument("--conf", type=float, default=0.3)
        sp.add_argument("--imgsz", type=int, help="model giriş boyutu (varsayılan: GPU 1280, CPU 960)")
        sp.add_argument("--device", help="cuda:0 / cpu / mps")
        sp.add_argument("--goster", action="store_true", help="pencerede canlı göster (q: çık)")
        sp.add_argument("--video-yok", action="store_true", help="işaretli video kaydetme")
        sp.add_argument("--sure", type=float, help="en fazla bu kadar saniye analiz et (canlı mod için)")
        sp.add_argument("--ekran", type=int, default=1, help="ekran yakalamada monitör numarası (1, 2, ...)")

    a = sub.add_parser("analiz", help="video dosyasını analiz et")
    a.add_argument("kaynak")
    common(a)
    c = sub.add_parser("canli", help="canlı kaynak: kamera indeksi, rtsp/http adresi veya 'screen'")
    c.add_argument("--kaynak", default="screen")
    common(c)
    k = sub.add_parser("kalibre", help="elle saha kalibrasyonu oluştur")
    k.add_argument("video")
    k.add_argument("--cikti", default="kalibrasyon.json")

    args = p.parse_args(argv)
    if args.komut == "kalibre":
        calibrate(args)
    else:
        run(args)


if __name__ == "__main__":
    main()
