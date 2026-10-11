import numpy as np
import pytest

from futbol_analiz.core import BALL, PLAYER, Detections
from futbol_analiz.pitch import ViewTransformer, pitch_vertices
from futbol_analiz.possession import PossessionTracker
from futbol_analiz.stats import StatsAccumulator
from futbol_analiz.tactics import FORMATIONS, detect_formation, space_control, team_shape
from futbol_analiz.tracking import Tracker


def test_saha_noktalari_ve_homografi():
    v = pitch_vertices()
    assert v.shape == (32, 2)
    assert v[:, 0].max() == 105 and v[:, 1].max() == 68
    # görüntü = saha * 10 + 50 -> geri dönüşüm doğru olmalı
    tr = ViewTransformer(v * 10 + 50, v)
    np.testing.assert_allclose(tr.transform(np.array([[575, 390]])), [[52.5, 34]], atol=1e-3)


def test_takip_kimlikleri_korur():
    tr = Tracker()
    ids = None
    for f in range(30):
        boxes = np.array([[100 + 3 * f, 100, 120 + 3 * f, 150], [400 - 3 * f, 100, 420 - 3 * f, 150]], np.float32)
        out = tr.update(Detections(boxes, np.array([0.9, 0.9], np.float32), np.array([PLAYER, PLAYER])))
        if ids is None:
            ids = list(out.tracker_id)
        assert list(out.tracker_id) == ids


def test_takip_kisa_kaybi_tolere_eder():
    tr = Tracker()
    first = tr.update(Detections(np.array([[0, 0, 20, 50]], np.float32), np.array([0.9], np.float32), np.array([PLAYER])))
    tr.update(Detections())
    out = tr.update(Detections(np.array([[2, 0, 22, 50]], np.float32), np.array([0.3], np.float32), np.array([PLAYER])))
    assert out.tracker_id[0] == first.tracker_id[0]


@pytest.mark.parametrize("name", ["4-4-2", "4-3-3", "3-5-2", "4-2-3-1", "5-3-2"])
@pytest.mark.parametrize("direction", [1, -1])
def test_dizilis_tespiti(name, direction):
    rng = np.random.default_rng(1)
    tpl = FORMATIONS[name]
    xy = np.stack([20 + tpl[:, 0] * 30, 6 + tpl[:, 1] * 56], axis=1) + rng.normal(0, 0.8, (10, 2))
    if direction < 0:
        xy = np.array([105, 68]) - xy
    f, conf = detect_formation(xy, direction)
    assert f == name, (f, conf)


def test_alan_kontrolu_ve_sekil():
    xy = np.array([[22.5, 34], [82.5, 34]], float)  # orta nokta = orta saha çizgisi
    _, pct = space_control(xy, np.array([0, 1]))
    assert pct[0] == pytest.approx(pct[1], abs=2)
    shape = team_shape(np.array([[30, 10], [30, 58], [50, 34], [40, 34]]), 1)
    assert shape["savunma_hatti_m"] == pytest.approx(37.5)


def test_hiz_ve_mesafe():
    s = StatsAccumulator()
    rng = np.random.default_rng(0)
    for f in range(51):  # 25 fps, 5 m/s -> 18 km/s, tespit titreşimi ±10 cm
        tr = s.update(f / 25, 1, 0, PLAYER, np.array([f * 0.2, 10.0]) + rng.uniform(-0.1, 0.1, 2))
    assert tr.speed == pytest.approx(18, abs=1.5)
    assert tr.distance == pytest.approx(10, abs=0.5)


def test_pas_ve_top_kaybi():
    p = PossessionTracker(fps=25, max_dist=1.5, inertia_frames=3)
    ids, teams = np.array([1, 2, 3]), np.array([0, 0, 1])
    pos = np.array([[10, 10], [30, 10], [40, 20]], float)
    seq = [pos[0]] * 10 + [np.array([20, 10])] * 5 + [pos[1]] * 10 + [pos[2]] * 10
    for i, b in enumerate(seq):
        p.update(i / 25, ids, teams, pos, np.asarray(b, float))
    types = [(e.type, e.from_id, e.to_id) for e in p.events]
    assert types == [("pas", 1, 2), ("top_kaybi", 2, 3)]
    assert p.events[0].length_m == pytest.approx(20)
    assert p.possession_pct()[0] > p.possession_pct()[1]


def test_eylemsizlik_titremeyi_engeller():
    p = PossessionTracker(fps=25, max_dist=1.5, inertia_frames=3)
    ids, teams = np.array([1, 2]), np.array([0, 1])
    pos = np.array([[10, 10], [11.2, 10]], float)
    for i in range(20):  # top tek karelik sıçramalarla 2'ye yaklaşıyor
        b = pos[1] if i % 4 == 3 else pos[0]
        p.update(i / 25, ids, teams, pos, b)
    assert p.events == [] and p.owner == 1
