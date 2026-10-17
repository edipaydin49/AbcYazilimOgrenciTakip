"""Ortak soru şablonundan (soru_sablonu.html) tek dosyalık web sayfası üretir."""
import json
from pathlib import Path

SABLON = Path(__file__).with_name("soru_sablonu.html")


def sayfa_yaz(havuz, cikti, baslik, h1, alt, logo, yayin_yolu=None, etiket_dili="tr"):
    govde = SABLON.read_text(encoding="utf-8")
    for anahtar, deger in (("__BASLIK__", baslik), ("__H1__", h1), ("__ALT__", alt), ("__LOGO__", logo), ("__ETIKET_DILI__", etiket_dili)):
        govde = govde.replace(anahtar, deger)
    govde = govde.replace("/*HAVUZ*/", json.dumps(havuz, ensure_ascii=False))
    Path(cikti).write_text('<!doctype html>\n<html lang="tr">\n' + govde + "</html>\n", encoding="utf-8")
    if yayin_yolu:  # claude.ai yayını için: iskelet ve meta etiketleri yayın sırasında eklenir
        Path(yayin_yolu).write_text(govde.replace('<meta charset="utf-8">\n', "").replace(
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n', ""),
            encoding="utf-8")
