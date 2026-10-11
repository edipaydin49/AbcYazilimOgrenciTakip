"""YoloDetector sınıf eşlemesi - ultralytics kurulu olmadan sahte modülle test edilir."""
import sys
import types

import numpy as np

from futbol_analiz.core import BALL, PLAYER


class _T(np.ndarray):
    def cpu(self):
        return self

    def numpy(self):
        return np.asarray(self)


def _fake_ultralytics(names, xyxy, cls, conf):
    class Boxes:
        def __init__(self):
            self.xyxy = np.array(xyxy, np.float32).view(_T)
            self.cls = np.array(cls, np.float32).view(_T)
            self.conf = np.array(conf, np.float32).view(_T)

        def __len__(self):
            return len(xyxy)

    class YOLO:
        def __init__(self, w):
            self.names = names

        def predict(self, *a, **k):
            return [types.SimpleNamespace(boxes=Boxes())]

    return types.SimpleNamespace(YOLO=YOLO)


def test_coco_modeli_eslenir_ve_tek_top_kalir(monkeypatch):
    names = {0: "person", 32: "sports ball", 2: "car"}
    fake = _fake_ultralytics(names, [[0, 0, 10, 20], [5, 5, 8, 8], [6, 6, 9, 9], [0, 0, 50, 50]], [0, 32, 32, 2], [0.9, 0.4, 0.8, 0.9])
    monkeypatch.setitem(sys.modules, "ultralytics", fake)
    from futbol_analiz.detection import YoloDetector

    det = YoloDetector("x.pt", imgsz=640).detect(np.zeros((10, 10, 3), np.uint8))
    assert sorted(det.class_id.tolist()) == [BALL, PLAYER]  # araba atıldı, en güvenilir top kaldı
    assert det.confidence[det.class_id == BALL][0] == np.float32(0.8)


def test_varsayilan_modeller_klasorden_bulunur(tmp_path, monkeypatch):
    from futbol_analiz.detection import default_models

    monkeypatch.setenv("FUTBOL_MODELLER", str(tmp_path))
    (tmp_path / "futbol.pt").write_bytes(b"")
    (tmp_path / "saha.pt").write_bytes(b"")
    assert default_models() == (str(tmp_path / "futbol.pt"), str(tmp_path / "saha.pt"))
