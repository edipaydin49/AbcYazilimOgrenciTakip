"""Web arayüzü: streamlit run app.py

Video yükle ya da canlı kaynak (ekran / kamera / RTSP) seç; analiz kare kare ekranda akar,
bitince rapor, grafikler ve indirilebilir dosyalar gösterilir.
"""
import tempfile
import time
from pathlib import Path

import cv2
import pandas as pd
import streamlit as st

from futbol_analiz.detection import PitchKeypointDetector, YoloDetector
from futbol_analiz.pipeline import MatchAnalyzer
from futbol_analiz.pitch import load_calibration
from futbol_analiz.report import figures, write_report
from futbol_analiz.sources import open_source

st.set_page_config(page_title="Futbol Analiz", layout="wide")
st.title("⚽ Futbol Maç Analizi")

with st.sidebar:
    mode = st.radio("Kaynak", ["Video yükle", "Ekran (canlı yayın)", "Kamera", "RTSP / HTTP adresi"])
    model = st.text_input("Oyuncu/top modeli", "yolo11m.pt")
    pitch_model = st.text_input("Saha anahtar noktası modeli (opsiyonel)", "")
    calib = st.file_uploader("Elle kalibrasyon JSON (opsiyonel)", type=["json"])
    stride = st.slider("Her n. kareyi işle", 1, 10, 2)
    max_frames = st.number_input("En fazla kare (0 = sınırsız)", 0, 500000, 0)
    max_s = st.number_input("Canlı analiz süresi, sn (0 = sınırsız)", 0, 10800, 0,
                            help="Süre dolunca analiz durur ve rapor hazırlanır")
    device = st.text_input("Cihaz (boş = otomatik)", "")

source = None
if mode == "Video yükle":
    up = st.file_uploader("Maç videosu", type=["mp4", "avi", "mov", "mkv"])
    if up:
        tmp = Path(tempfile.mkdtemp()) / up.name
        tmp.write_bytes(up.getbuffer())
        source = str(tmp)
elif mode == "Ekran (canlı yayın)":
    source = "screen"
elif mode == "Kamera":
    source = str(st.number_input("Kamera indeksi", 0, 10, 0))
else:
    source = st.text_input("Yayın adresi", "rtsp://")

if source and st.button("Analizi başlat", type="primary"):
    out = Path(tempfile.mkdtemp())
    calib_obj = None
    if calib:
        (out / "kalib.json").write_bytes(calib.getbuffer())
        calib_obj = load_calibration(out / "kalib.json")
    frames, fps = open_source(source, stride=stride, max_frames=max_frames or None)
    with st.spinner("Modeller yükleniyor..."):
        analyzer = MatchAnalyzer(
            YoloDetector(model, device=device or None), fps,
            pitch_detector=PitchKeypointDetector(pitch_model, device=device or None) if pitch_model else None,
            calibration=calib_obj, csv_path=out / "takip.csv")
    col_v, col_s = st.columns([3, 1])
    view, live = col_v.empty(), col_s.empty()
    t0 = time.time()
    for i, (vis, res) in enumerate(analyzer.run(frames, video_out=out / "analiz.mp4")):
        if i % 2 == 0:
            view.image(cv2.cvtColor(vis, cv2.COLOR_BGR2RGB), width="stretch")
            pct = analyzer.possession.possession_pct()
            ev = analyzer.possession.events
            live.markdown(
                f"**Süre:** {res.time_s:.0f} s · {i / max(time.time() - t0, 1e-6):.1f} kare/sn\n\n"
                f"**Sahiplik:** A %{pct[0]:.0f} – B %{pct[1]:.0f}\n\n"
                f"**Diziliş:** A {analyzer.tactics.current_formation(0)} · B {analyzer.tactics.current_formation(1)}\n\n"
                f"**Pas:** A {sum(e.type == 'pas' and e.team == 0 for e in ev)} · B {sum(e.type == 'pas' and e.team == 1 for e in ev)}\n\n"
                f"**Top kaybı:** A {sum(e.type == 'top_kaybi' and e.team == 0 for e in ev)} · B {sum(e.type == 'top_kaybi' and e.team == 1 for e in ev)}")
        if max_s and time.time() - t0 > max_s:
            break
    analyzer.close()

    summary = analyzer.summary()
    path = write_report(out, summary, analyzer.heatmaps(), analyzer.possession.timeline)
    st.success("Analiz tamamlandı")
    T = summary["takimlar"]
    keys = ["topa_sahip_olma_%", "dizilis", "pas", "pas_isabet_%", "top_kaybi", "sut", "alan_kontrolu_%", "toplam_mesafe_m", "sprint"]
    st.subheader("Takımlar")
    st.dataframe(pd.DataFrame({"Takım A": [T[0].get(k) for k in keys], "Takım B": [T[1].get(k) for k in keys]}, index=keys).astype(str))
    for b64 in figures(summary, analyzer.heatmaps(), analyzer.possession.timeline).values():
        st.image(f"data:image/png;base64,{b64}")
    st.subheader("Oyuncular")
    st.dataframe(pd.json_normalize(summary["oyuncular"]))
    c1, c2, c3, c4 = st.columns(4)
    c1.download_button("Rapor (HTML)", path.read_bytes(), "rapor.html")
    c2.download_button("Rapor (JSON)", (out / "rapor.json").read_bytes(), "rapor.json")
    c3.download_button("Takip verisi (CSV)", (out / "takip.csv").read_bytes(), "takip.csv")
    if (out / "analiz.mp4").exists():
        c4.download_button("İşaretli video", (out / "analiz.mp4").read_bytes(), "analiz.mp4")
