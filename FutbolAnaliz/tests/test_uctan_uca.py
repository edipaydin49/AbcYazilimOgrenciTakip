"""Sentetik maç videosu üzerinde tüm hattın uçtan uca testi."""
import json

import numpy as np
import pytest

from futbol_analiz.pipeline import MatchAnalyzer
from futbol_analiz.pitch import ViewTransformer, pitch_vertices
from futbol_analiz.report import write_report
from tests.sentetik import PX, FakeDetector, SyntheticMatch


def test_tam_analiz(tmp_path):
    match = SyntheticMatch()
    det = FakeDetector(match)
    v = pitch_vertices()
    calib = ViewTransformer(v * PX, v)  # sentetik görüntü kuşbakışı: piksel = metre * 10
    an = MatchAnalyzer(det, fps=match.fps, calibration=calib, team_warmup=40, csv_path=tmp_path / "takip.csv")
    for vis, res in an.run(det.frames(), video_out=tmp_path / "analiz.mp4"):
        assert vis.shape == (680, 1050, 3)
    an.close()
    s = an.summary()

    # Takım eşlemesi rengine göre: kırmızı takım hangi küme ise o "A" olsun
    red = 0 if s["takimlar"][0]["renk_bgr"][2] > s["takimlar"][0]["renk_bgr"][0] else 1
    blue = 1 - red
    T = s["takimlar"]
    assert T[red]["dizilis"] == "4-4-2"
    assert T[blue]["dizilis"] == "4-3-3"
    assert T[red]["hucum_yonu"] == "sag" and T[blue]["hucum_yonu"] == "sol"

    passes = [e for e in s["olaylar"] if e["type"] == "pas"]
    lost = [e for e in s["olaylar"] if e["type"] == "top_kaybi"]
    assert sum(e["team"] == red for e in passes) == 4  # A içinde 4 pas
    assert sum(e["team"] == blue for e in passes) == 2  # araya girdikten sonra B 2 pas
    assert len(lost) == 1 and lost[0]["team"] == red
    assert not [e for e in s["olaylar"] if e["type"] == "sut"]  # hızlı paslar şut sayılmamalı
    # Kırmızı ~10 sn, mavi ~14 sn topu tutuyor
    assert T[red]["topa_sahip_olma_%"] == pytest.approx(42, abs=5)

    # Hızlar makul (sentetik oyuncular ~0.4-1.5 m/s)
    for p in s["oyuncular"]:
        assert 0 < p["max_hiz_kmh"] < 12
    assert any(p["rol"] == "Kaleci" for p in s["oyuncular"])
    roles = lambda k: sorted(p["rol"] for p in s["oyuncular"] if p["takim"] == k and p["rol"] != "Kaleci")
    assert roles(red) == ["Defans"] * 4 + ["Forvet"] * 2 + ["Orta saha"] * 4  # 4-4-2
    assert roles(blue) == ["Defans"] * 4 + ["Forvet"] * 3 + ["Orta saha"] * 3  # 4-3-3

    path = write_report(tmp_path, s, an.heatmaps(), an.possession.timeline)
    assert "Maç Analiz Raporu" in path.read_text(encoding="utf-8")
    json.loads((tmp_path / "rapor.json").read_text(encoding="utf-8"))
    assert (tmp_path / "takip.csv").stat().st_size > 1000
    assert (tmp_path / "analiz.mp4").exists()


def test_kalibrasyonsuz_mod_calisir():
    match = SyntheticMatch(seconds=6)
    det = FakeDetector(match)
    an = MatchAnalyzer(det, fps=match.fps, team_warmup=40)
    for _, res in an.run(det.frames(), draw=True):
        assert not res.calibrated
    s = an.summary()
    assert s["kalibre"] is False
    assert all(np.isfinite(p["mesafe_m"]) for p in s["oyuncular"])
