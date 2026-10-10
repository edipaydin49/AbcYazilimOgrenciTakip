"""Bilgisayardan izleme sayfalarını index.html'den üretir.

- web/veli.html: tabletteki küçük sunucunun sunduğu sayfa (aynı betikleri kullanır, UZAK_MOD açık).
- VeliPaneli.html: tek dosya hâlinde (bütün betikler içinde); internetsiz, veri metni yapıştırılarak açılır.
Kullanım: python3 araclar/veli_sayfasi.py
"""
import re
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
WEB = KOK / "web"


def main():
    s = (WEB / "index.html").read_text(encoding="utf-8")
    s = s.replace("<title>Öğrenme Yolculuğu</title>", "<title>Öğrenme Yolculuğu · Veli Paneli</title>")
    ilk = s.index("<script src=")
    veli = s[:ilk] + "<script>window.UZAK_MOD = true;</script>\n" + s[ilk:]
    (WEB / "veli.html").write_text(veli, encoding="utf-8")

    def ic(m):
        kod = (WEB / m.group(1)).read_text(encoding="utf-8").replace("</script", "<\\/script")
        return "<script>\n" + kod + "\n</script>"
    tek = re.sub(r'<script src="([^"]+)"></script>', ic, veli)
    (KOK / "VeliPaneli.html").write_text(tek, encoding="utf-8")
    print("veli.html ve VeliPaneli.html üretildi", len(tek) // 1024, "KB")


if __name__ == "__main__":
    main()
