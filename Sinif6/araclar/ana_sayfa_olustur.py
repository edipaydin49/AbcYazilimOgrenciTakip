"""6. sınıf eğitim seti ana sayfasını üretir.

Kullanım:
  python ana_sayfa_olustur.py                        → ../index.html (yerel dosya bağlantıları)
  python ana_sayfa_olustur.py yayin.html linkler.json → yayın kopyası (claude.ai bağlantıları)
linkler.json, aşağıdaki SAYFALAR anahtarlarını yayın adreslerine eşler.
"""
import json
import sys
from pathlib import Path

BURA = Path(__file__).parent
SINIF = BURA.parent
DEPO = SINIF.parent


def say(yol):
    return len(json.loads((DEPO / yol).read_text(encoding="utf-8")))


# anahtar: (yerel bağlantı, havuz dosyası)
SAYFALAR = {
    "INGILIZCE": ("Ingilizce/IngilizceSoruUretici.html", "Sinif6/Ingilizce/araclar/soru_havuzu.json"),
    "KART": ("Ingilizce/KelimeKartlari.html", "Sinif6/Ingilizce/araclar/kelimeler.json"),
    "MATEMATIK": ("Matematik/MatematikSoruUretici.html", "Sinif6/Matematik/araclar/soru_havuzu.json"),
    "CARPAN": ("../CarpanlarKatlar/CarpanlarKatlarSoruUretici.html", "CarpanlarKatlar/araclar/soru_havuzu.json"),
    "KUP": ("../KupSorulari/KupSoruUretici.html", "KupSorulari/araclar/soru_havuzu.json"),
    "TURKCE": ("../SozVarligi/SozVarligiSoruUretici.html", "SozVarligi/araclar/soru_havuzu.json"),
    "MACERA": ("../SozVarligi/TurkceMacerasi.html", "SozVarligi/araclar/soru_havuzu.json"),
    "FEN": ("Fen/FenSoruUretici.html", "Sinif6/Fen/araclar/soru_havuzu.json"),
    "SOSYAL": ("Sosyal/SosyalSoruUretici.html", "Sinif6/Sosyal/araclar/soru_havuzu.json"),
    "DIN": ("DinKulturu/DinKulturuSoruUretici.html", "Sinif6/DinKulturu/araclar/soru_havuzu.json"),
}
DERSLER = [
    ("İngilizce", "10 ünite · kelime, dilbilgisi, diyalog, okuma, dinleme",
     [("İngilizce Soru Üretici", "INGILIZCE", "soru"), ("Kelime Kartları", "KART", "kelime")]),
    ("Matematik", "İşlem önceliği, tam sayılar, kesirler, ondalık gösterim, oran, cebir, açılar, alan, veri",
     [("Matematik 6", "MATEMATIK", "soru"), ("Çarpanlar ve Katlar", "CARPAN", "soru"), ("Küp Soruları", "KUP", "soru")]),
    ("Türkçe", "Söz varlığı: sözcükte anlam, anlam ilişkileri, söz grupları",
     [("Türkçe Macerası", "MACERA", "ders"), ("Söz Varlığı", "TURKCE", "soru")]),
    ("Fen Bilimleri", "Güneş sistemi, vücudumuzdaki sistemler, kuvvet, madde ve ısı, ses, elektrik",
     [("Fen Bilimleri 6", "FEN", "soru")]),
    ("Sosyal Bilgiler", "Değerler, ilk Türk devletleri, enlem-boylam ve iklim, ekonomi, yönetim",
     [("Sosyal Bilgiler 6", "SOSYAL", "soru")]),
    ("Din Kültürü", "İlahi kitaplar, namaz, zararlı alışkanlıklar, Hz. Muhammed'in hayatı",
     [("Din Kültürü 6", "DIN", "soru")]),
]


def olustur(linkler):
    sayilar = {k: say(h) for k, (_, h) in SAYFALAR.items()}
    kartlar = []
    for ad, konular, sayfalar in DERSLER:
        toplam = sum(sayilar[k] for _, k, tur in sayfalar if tur == "soru")
        satirlar = "".join(
            f'<li><a href="{linkler[k]}">{baslik}<span>{"sunum + pratik" if tur == "ders" else f"{sayilar[k]} {tur}"}</span></a></li>'
            for baslik, k, tur in sayfalar)
        kartlar.append(f'      <article class="card"><div class="ust"><h3>{ad}</h3><span class="sayi">{toplam} soru</span></div>'
                       f'<p class="konular">{konular}</p><ul>{satirlar}</ul></article>')
    govde = (BURA / "ana_sayfa_sablonu.html").read_text(encoding="utf-8")
    govde = govde.replace("{{DERSLER}}", "\n".join(kartlar))
    govde = govde.replace("{{TOPLAM}}", f"{sum(v for k, v in sayilar.items() if k not in ('KART', 'MACERA')):,}".replace(",", "."))
    for k, url in linkler.items():
        govde = govde.replace("{{" + k + "}}", url)
    return govde


if __name__ == "__main__":
    yerel = olustur({k: v[0] for k, v in SAYFALAR.items()})
    (SINIF / "index.html").write_text('<!doctype html>\n<html lang="tr">\n' + yerel + "</html>\n", encoding="utf-8")
    if len(sys.argv) > 2:
        yayin = olustur(json.loads(Path(sys.argv[2]).read_text(encoding="utf-8")))
        Path(sys.argv[1]).write_text(yayin.replace('<meta charset="utf-8">\n', "").replace(
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n', ""), encoding="utf-8")
    print("Ana sayfa hazır.")
