"""6. sınıf Matematik soru havuzu (Küp ve Çarpanlar-Katlar konuları ayrı sayfalardadır).

Tüm sorular sayılarla üretilir; cevaplar program tarafından hesaplanır.
Çalıştırınca soru_havuzu.json ve ../MatematikSoruUretici.html dosyalarını üretir.
"""
import json
import sys
from decimal import Decimal
from fractions import Fraction as K
from pathlib import Path

BURA = Path(__file__).parent
KOK = BURA.parent
sys.path.insert(0, str(KOK.parent.parent / "ortak"))
from havuz_araclari import Havuz, us  # noqa: E402
from sayfa_olustur import sayfa_yaz  # noqa: E402

H = Havuz(6)
rnd = H.rnd

ISLEM = "İşlem Önceliği ve Üslü İfadeler"
TAM = "Tam Sayılar"
KESIR = "Kesirlerle İşlemler"
ONDA = "Ondalık Gösterim"
ORAN = "Oran"
CEBIR = "Cebirsel İfadeler"
ACI = "Açılar"
ALAN = "Alan Ölçme"
VERI = "Veri İşleme"


def ks(f):
    """Kesri sadeleştirilmiş 'a/b' biçiminde yazar."""
    f = K(f)
    return str(f.numerator) if f.denominator == 1 else f"{f.numerator}/{f.denominator}"


def od(x):
    """Ondalık sayıyı Türkçe virgüllü yazar."""
    s = format(Decimal(str(x)).normalize(), "f")
    return s.replace(".", ",")


def tm(n):
    """Negatif sayıları parantez içinde yazar."""
    return f"({n})" if n < 0 else str(n)


# ---------------- İşlem önceliği ve üslü ifadeler ----------------
for a, b, c in [(5, 3, 4), (12, 2, 5), (20, 4, 3), (7, 6, 2), (9, 3, 8), (15, 5, 2), (30, 6, 4), (8, 2, 7)]:
    H.ekle(ISLEM, "Kolay", f"{a} + {b} · {c} işleminin sonucu kaçtır?", a + b * c, [(a + b) * c, a * b + c, a + b + c])
for a, b, c, d in [(4, 6, 3, 2), (10, 5, 2, 7), (3, 9, 4, 6), (8, 2, 5, 3), (6, 4, 7, 10)]:
    H.ekle(ISLEM, "Orta", f"({a} + {b}) · {c} − {d} işleminin sonucu kaçtır?", (a + b) * c - d,
           [a + b * c - d, (a + b) * (c - d), a + b * (c - d) + 20])
for a, b, c in [(48, 6, 2), (36, 4, 3), (60, 5, 4), (72, 8, 3), (90, 9, 5)]:
    H.ekle(ISLEM, "Orta", f"{a} ÷ {b} · {c} işleminin sonucu kaçtır?", a // b * c, [a // (b * c) if a % (b * c) == 0 else a // b + c, a // b - c, a // b + c])
for t, k in [(2, 3), (3, 2), (5, 2), (2, 5), (10, 3), (4, 3), (3, 4), (1, 9), (7, 2), (6, 2), (2, 6), (9, 2)]:
    H.ekle(ISLEM, "Kolay", f"{us(t, k)} ifadesinin değeri kaçtır?", t ** k, [t * k, k ** t if k ** t != t ** k else t + k, t ** k + t])
for t in [3, 5, 7, 12, 25, 100]:
    H.ekle(ISLEM, "Kolay", f"{t}⁰ ifadesinin değeri kaçtır?", 1, [0, t, 10])
    H.ekle(ISLEM, "Kolay", f"{t}¹ ifadesinin değeri kaçtır?", t, [1, 0, t * 10])
for a, ka, b, kb in [(2, 3, 3, 2), (5, 2, 2, 4), (10, 2, 4, 3), (3, 3, 6, 2), (2, 4, 4, 2)]:
    H.ekle(ISLEM, "Orta", f"{us(a, ka)} + {us(b, kb)} işleminin sonucu kaçtır?", a ** ka + b ** kb,
           [a * ka + b * kb, a ** ka * b ** kb if a ** ka * b ** kb < 2000 else a ** ka + b, (a + b) ** 2])
for a, b, c, d in [(2, 3, 4, 2), (3, 2, 5, 1), (5, 2, 3, 6), (4, 2, 10, 3)]:
    H.ekle(ISLEM, "Zor", f"{us(a, b)} · {c} − {d} · {us(2, 2)} işleminin sonucu kaçtır?", a ** b * c - d * 4,
           [(a ** b * c - d) * 4, a * b * c - d * 4, a ** b * (c - d) * 4])
for n, k in [(1000, 3), (100, 2), (10000, 4), (100000, 5)]:
    H.ekle(ISLEM, "Orta", f"{n} sayısının 10'un kuvveti olarak yazılışı hangisidir?", us(10, k),
           [us(10, k + 1), us(k, 10), us(10, k - 1)])
for kare in [16, 25, 49, 64, 81, 121, 144]:
    r = int(kare ** 0.5)
    H.ekle(ISLEM, "Zor", f"x² = {kare} eşitliğini sağlayan doğal sayı kaçtır?", r, [kare // 2, r + 1, r * 2])

# ---------------- Tam sayılar ----------------
for n in [-7, -12, 5, -25, -9, -3, 18, -40]:
    H.ekle(TAM, "Kolay", f"|{n}| ifadesinin değeri kaçtır?", str(abs(n)), [str(-abs(n)) if n else "1", str(abs(n) + 1), str(abs(n) * 2) if n else "-1"])
for a, b in [(-5, 3), (-8, -2), (-4, 4), (-10, -3), (-6, 1), (-1, 7)]:
    n = len(range(a + 1, b)) if a < b else len(range(b + 1, a))
    lo, hi = min(a, b), max(a, b)
    H.ekle(TAM, "Orta", f"{lo} ile {hi} arasında kaç tane tam sayı vardır?", n, [n + 1, n + 2, n - 1 if n > 1 else n + 3])
for _ in range(8):
    sayilar = rnd.sample(range(-15, 16), 4)
    H.ekle(TAM, "Kolay", f"{', '.join(map(str, sayilar))} sayılarından en küçüğü hangisidir?", str(min(sayilar)),
           [str(x) for x in sayilar if x != min(sayilar)])
for _ in range(6):
    sayilar = rnd.sample(range(-20, 0), 4)
    H.ekle(TAM, "Orta", f"{', '.join(map(str, sayilar))} sayılarından en büyüğü hangisidir?", str(max(sayilar)),
           [str(x) for x in sayilar if x != max(sayilar)])
for sicaklik, dusus in [(5, 8), (3, 10), (-2, 6), (12, 15), (0, 7)]:
    son = sicaklik - dusus
    H.ekle(TAM, "Zor", f"Sabah {sicaklik} °C olan hava sıcaklığı akşam {dusus} °C düşmüştür. Akşam hava sıcaklığı kaç °C olmuştur?",
           f"{son} °C", [f"{-son} °C", f"{sicaklik + dusus} °C", f"{son + 1} °C", f"{son - 1} °C"])
for kat, in_ in [(3, 5), (2, 4), (5, 6), (1, 3)]:
    son = kat - in_
    H.ekle(TAM, "Zor", f"Bir asansör {kat}. kattan {in_} kat aşağı iniyor. Zemin kat 0 kabul edilirse asansör hangi kata gelmiştir?",
           str(son), [str(-son) if son else "1", str(kat + in_), str(son - 1)])
for n in [-6, -11, 4, -2]:
    H.ekle(TAM, "Orta", f"Sayı doğrusunda {n} sayısının sıfıra olan uzaklığı kaç birimdir?", abs(n), [abs(n) + 1, abs(n) * 2, abs(n) - 1 if abs(n) > 1 else 3])

# ---------------- Kesirler ----------------
for a, b, c, d in [(1, 2, 1, 4), (2, 3, 1, 6), (3, 4, 1, 8), (1, 3, 1, 4), (2, 5, 1, 2), (5, 6, 1, 3), (3, 8, 1, 4), (1, 6, 3, 4)]:
    s = K(a, b) + K(c, d)
    H.ekle(KESIR, "Kolay" if d % b == 0 else "Orta", f"{a}/{b} + {c}/{d} işleminin sonucu kaçtır?", ks(s),
           [f"{a + c}/{b + d}", ks(s + K(1, b * d)), ks(K(a * c, b * d))])
for a, b, c, d in [(3, 4, 1, 2), (5, 6, 1, 3), (7, 8, 1, 4), (2, 3, 1, 4), (4, 5, 1, 2)]:
    s = K(a, b) - K(c, d)
    H.ekle(KESIR, "Orta", f"{a}/{b} − {c}/{d} işleminin sonucu kaçtır?", ks(s), [f"{a - c}/{abs(b - d) or 1}", ks(s + K(1, 4)), ks(K(a, b) + K(c, d))])
for n, a, b in [(24, 3, 4), (36, 2, 3), (40, 3, 5), (48, 5, 6), (60, 7, 10), (28, 3, 7), (45, 2, 9), (72, 5, 8)]:
    v = n * a // b
    H.ekle(KESIR, "Kolay", f"{n} sayısının {a}/{b} kadarı kaçtır?",
           v, [n // b, n * b // a if n * b % a == 0 else v + a, v + b])
for a, b, c, d in [(2, 3, 3, 4), (1, 2, 4, 5), (3, 5, 5, 6), (4, 7, 7, 8), (2, 9, 3, 4)]:
    p = K(a, b) * K(c, d)
    H.ekle(KESIR, "Orta", f"{a}/{b} · {c}/{d} işleminin sonucu kaçtır?", ks(p), [ks(K(a + c, b + d)), ks(K(a, b) + K(c, d)), ks(K(a * d, b * c))])
for a, b, c, d in [(1, 2, 1, 4), (2, 3, 1, 3), (3, 4, 3, 8), (5, 6, 1, 3), (4, 5, 2, 5)]:
    q = K(a, b) / K(c, d)
    H.ekle(KESIR, "Zor", f"{a}/{b} ÷ {c}/{d} işleminin sonucu kaçtır?", ks(q), [ks(K(a, b) * K(c, d)), ks(K(c, d) / K(a, b)), ks(K(a, c) if c else 1)])
for top, a, b in [(30, 2, 5), (24, 3, 8), (40, 3, 4), (36, 5, 9)]:
    H.ekle(KESIR, "Zor", f"Bir sınıftaki {top} öğrencinin {a}/{b} kadarı gezi kulübüne katılmıştır. Gezi kulübüne katılmayan kaç öğrenci vardır?",
           top - top * a // b, [top * a // b, top // b, top - top // b])
for a, b in [(7, 3), (11, 4), (9, 2), (13, 5), (17, 6)]:
    H.ekle(KESIR, "Orta", f"{a}/{b} bileşik kesrinin tam sayılı kesir olarak yazılışı hangisidir?",
           f"{a // b} tam {a % b}/{b}", [f"{a % b} tam {a // b}/{b}", f"{a // b + 1} tam {a % b}/{b}", f"{a // b} tam {b}/{a % b}"])

# ---------------- Ondalık gösterim ----------------
for a, b in [("2.5", "1.3"), ("3.75", "1.25"), ("0.6", "0.45"), ("4.2", "2.08"), ("10.5", "3.75"), ("1.9", "0.1")]:
    s = Decimal(a) + Decimal(b)
    H.ekle(ONDA, "Kolay", f"{od(a)} + {od(b)} işleminin sonucu kaçtır?", od(s),
           [od(s + Decimal("0.1")), od(s - Decimal("0.01")), od(s * 10)])
for a, b in [("5.4", "2.3"), ("8.25", "3.5"), ("6", "2.75"), ("10.1", "4.05")]:
    s = Decimal(a) - Decimal(b)
    H.ekle(ONDA, "Orta", f"{od(a)} − {od(b)} işleminin sonucu kaçtır?", od(s), [od(s + 1), od(s - Decimal("0.1")), od(s * 10)])
for a, k in [("3.25", 10), ("0.48", 100), ("7.5", 100), ("12.345", 1000), ("0.06", 10)]:
    s = Decimal(a) * k
    H.ekle(ONDA, "Kolay", f"{od(a)} · {k} işleminin sonucu kaçtır?", od(s), [od(s / 10), od(s * 10), od(Decimal(a) + k)])
for a, b in [("1.5", "4"), ("0.3", "0.2"), ("2.5", "1.2"), ("0.6", "0.5")]:
    s = Decimal(a) * Decimal(b)
    H.ekle(ONDA, "Orta", f"{od(a)} · {od(b)} işleminin sonucu kaçtır?", od(s), [od(s * 10), od(s / 10), od(Decimal(a) + Decimal(b))])
for pay, payda, yaz in [(3, 10, "0.3"), (25, 100, "0.25"), (7, 100, "0.07"), (1, 2, "0.5"), (3, 4, "0.75"), (2, 5, "0.4")]:
    H.ekle(ONDA, "Kolay", f"{pay}/{payda} kesrinin ondalık gösterimi hangisidir?", od(yaz),
           [od(Decimal(yaz) * 10), od(Decimal(yaz) / 10), f"{pay},{payda}"])
for yazi, sayi in [("Üç tam yüzde on beş", "3.15"), ("Sıfır tam onda yedi", "0.7"), ("İki tam yüzde beş", "2.05"), ("On iki tam binde dört", "12.004")]:
    H.ekle(ONDA, "Orta", f"“{yazi}” şeklinde okunan sayı hangisidir?", od(sayi),
           [od(Decimal(sayi) * 10), od(Decimal(sayi) + Decimal("0.1")), od(Decimal(sayi) / 10)])
for a, b in [("2.8", "3.4"), ("1.4", "2.1"), ("4.6", "1.9")]:
    s = Decimal(a) + Decimal(b)
    H.ekle(ONDA, "Zor", f"Ece markete giderken {od(a)} km, eve dönerken başka bir yoldan {od(b)} km yürümüştür. Ece toplam kaç km yürümüştür?",
           f"{od(s)} km", [f"{od(s + 1)} km", f"{od(abs(Decimal(b) - Decimal(a)))} km", f"{od(s * 10)} km"])

# ---------------- Oran ----------------
for kiz, erkek in [(12, 18), (15, 10), (14, 21), (16, 20), (9, 12), (20, 25)]:
    H.ekle(ORAN, "Kolay", f"Bir sınıfta {kiz} kız ve {erkek} erkek öğrenci vardır. Kız öğrenci sayısının erkek öğrenci sayısına oranı kaçtır?",
           ks(K(kiz, erkek)), [ks(K(erkek, kiz)), ks(K(kiz, kiz + erkek)), ks(K(erkek, kiz + erkek))])
for a, b, x in [(2, 3, 12), (3, 5, 15), (4, 7, 20), (5, 8, 25)]:
    y = x * b // a
    H.ekle(ORAN, "Orta", f"Elma sayısının armut sayısına oranı {a}/{b} olarak verilmiştir. Sepette {x} elma varsa kaç armut vardır?",
           y, [x * a // b if x * a % b == 0 else y - 1, x + (b - a), y + b])
for sure, ucret, yeni in [(3, 45, 5), (2, 30, 6), (4, 60, 7), (5, 80, 3)]:
    H.ekle(ORAN, "Zor", f"{sure} kg elma {ucret} TL ise aynı elmadan {yeni} kg kaç TL'dir?", f"{ucret * yeni // sure} TL",
           [f"{ucret + yeni} TL", f"{ucret * sure // yeni} TL" if ucret * sure % yeni == 0 else f"{ucret * yeni // sure + 5} TL", f"{ucret // sure} TL"])
for a, b, top in [(2, 3, 40), (1, 4, 35), (3, 5, 48), (2, 7, 45)]:
    birim = top // (a + b)
    H.ekle(ORAN, "Zor", f"{top} bilye, Ali ve Can arasında {a}/{b} oranında paylaştırılıyor (Ali'nin payı / Can'ın payı). Can kaç bilye alır?",
           b * birim, [a * birim, top // 2, birim])

# ---------------- Cebirsel ifadeler ----------------
for a, b, x in [(3, 5, 4), (2, 7, 6), (5, 1, 3), (4, 9, 2), (6, 2, 5), (7, 3, 4)]:
    H.ekle(CEBIR, "Kolay", f"x = {x} için {a}x + {b} ifadesinin değeri kaçtır?", a * x + b, [a + x + b, a * (x + b), a * x - b])
for a, b, x in [(2, 3, 5), (4, 1, 3), (3, 6, 4)]:
    H.ekle(CEBIR, "Orta", f"x = {x} için {a}(x + {b}) ifadesinin değeri kaçtır?", a * (x + b), [a * x + b, a + x + b, a * x * b])
ifadeler = [("Bir sayının 3 katının 5 fazlası", "3x + 5", ["3(x + 5)", "5x + 3", "3x − 5"]),
            ("Bir sayının 2 katının 4 eksiği", "2x − 4", ["2(x − 4)", "4x − 2", "2x + 4"]),
            ("Bir sayının 7 fazlasının 2 katı", "2(x + 7)", ["2x + 7", "7x + 2", "x + 14 + 2"]),
            ("Bir sayının yarısının 6 fazlası", "x/2 + 6", ["(x + 6)/2", "2x + 6", "x/6 + 2"]),
            ("Bir sayının 5 eksiğinin 3 katı", "3(x − 5)", ["3x − 5", "5x − 3", "x − 15 + 3"]),
            ("Bir sayının karesinin 1 fazlası", "x² + 1", ["(x + 1)²", "2x + 1", "x + 1"])]
for metin, d, y in ifadeler:
    H.ekle(CEBIR, "Orta", f"“{metin}” ifadesinin cebirsel gösterimi hangisidir?", d, y)
for ifade, terim, katsayi, sabit in [("4x + 7", 2, 4, 7), ("3a − 2b + 5", 3, 3, 5), ("x² + 6x + 9", 3, 6, 9), ("9y − 1", 2, 9, -1)]:
    H.ekle(CEBIR, "Orta", f"{ifade} cebirsel ifadesinin terim sayısı kaçtır?", terim, [terim + 1, terim - 1 if terim > 1 else terim + 2, terim + 2])
    H.ekle(CEBIR, "Orta", f"{ifade} cebirsel ifadesindeki sabit terim kaçtır?", sabit, [katsayi, terim, sabit + 1 if sabit > 0 else 1])
for a, b, x in [(5, 2, 4), (3, 8, 6), (10, 5, 3)]:
    H.ekle(CEBIR, "Zor", f"Bir kalem {a} TL, bir defter {b} TL'dir. Buna göre {x} kalem ve 2 defter alan Ali kaç TL öder?",
           f"{a * x + 2 * b} TL", [f"{(a + b) * x} TL", f"{a * x + b} TL", f"{a + b + x + 2} TL"])
for n in [4, 6, 9]:
    H.ekle(CEBIR, "Zor", f"Bir örüntünün n. terimi 3n + 1 kuralıyla bulunuyor. Bu örüntünün {n}. terimi kaçtır?", 3 * n + 1, [3 * n, 3 + n + 1, 4 * n])

# ---------------- Açılar ----------------
for a in [25, 35, 48, 62, 70, 15, 54]:
    H.ekle(ACI, "Kolay", f"Ölçüsü {a}° olan bir açının tümleri kaç derecedir?", f"{90 - a}°", [f"{180 - a}°", f"{a}°", f"{90 + a}°"])
for a in [40, 75, 110, 130, 25, 95]:
    H.ekle(ACI, "Kolay", f"Ölçüsü {a}° olan bir açının bütünleri kaç derecedir?", f"{180 - a}°", [f"{90 - a}°" if a < 90 else f"{a - 90}°", f"{a}°", f"{180 + a}°"])
for a in [35, 70, 115, 140]:
    H.ekle(ACI, "Orta", f"Kesişen iki doğrunun oluşturduğu açılardan biri {a} derecedir. Bu açının ters açısı kaç derecedir?",
           f"{a}°", [f"{180 - a}°", f"{90 - a}°" if a < 90 else f"{a - 90}°", f"{360 - a}°"])
for a in [30, 45, 60, 20]:
    H.ekle(ACI, "Zor", f"Birbirinin bütünleri olan iki açıdan biri {a}° ise diğeri kaç derecedir?", f"{180 - a}°", [f"{90 - a}°", f"{a}°", f"{360 - a}°", f"{190 - a}°"])
H.liste(ACI, "Kolay", [
    ("Ölçüsü 90°'den küçük olan açıya ne ad verilir?", "Dar açı", ["Geniş açı", "Dik açı", "Doğru açı"]),
    ("Ölçüsü 90° olan açıya ne ad verilir?", "Dik açı", ["Dar açı", "Geniş açı", "Tam açı"]),
    ("Ölçüsü 90° ile 180° arasında olan açıya ne ad verilir?", "Geniş açı", ["Dar açı", "Dik açı", "Tam açı"]),
    ("Ölçüsü 180° olan açıya ne ad verilir?", "Doğru açı", ["Tam açı", "Dik açı", "Geniş açı"]),
    ("Ölçüleri toplamı 90° olan iki açıya ne ad verilir?", "Tümler açılar", ["Bütünler açılar", "Ters açılar", "Komşu açılar"]),
    ("Ölçüleri toplamı 180° olan iki açıya ne ad verilir?", "Bütünler açılar", ["Tümler açılar", "Ters açılar", "Dik açılar"]),
    ("Köşeleri ve birer kenarları ortak olan iki açıya ne ad verilir?", "Komşu açılar", ["Ters açılar", "Tümler açılar", "Dar açılar"]),
])

# ---------------- Alan ölçme ----------------
for t, h in [(8, 5), (10, 6), (12, 7), (6, 9), (14, 4), (9, 8)]:
    H.ekle(ALAN, "Kolay", f"Taban uzunluğu {t} cm, bu tabana ait yüksekliği {h} cm olan üçgenin alanı kaç cm²'dir?",
           f"{t * h / 2:g} cm²".replace(".", ","), [f"{t * h} cm²", f"{t + h} cm²", f"{2 * (t + h)} cm²"])
for t, h in [(8, 5), (12, 4), (9, 6), (15, 3), (7, 7)]:
    H.ekle(ALAN, "Kolay", f"Taban uzunluğu {t} cm, yüksekliği {h} cm olan paralelkenarın alanı kaç cm²'dir?",
           f"{t * h} cm²", [f"{t * h // 2} cm²" if t * h % 2 == 0 else f"{t * h + 1} cm²", f"{t + h} cm²", f"{2 * (t + h)} cm²"])
for a, b in [(12, 5), (8, 6), (15, 4), (9, 7)]:
    H.ekle(ALAN, "Orta", f"Kenar uzunlukları {a} m ve {b} m olan dikdörtgen şeklindeki bir bahçenin alanı kaç m²'dir?",
           f"{a * b} m²", [f"{2 * (a + b)} m²", f"{a + b} m²", f"{a * b // 2} m²" if a * b % 2 == 0 else f"{a * b + 2} m²"])
for alan, t in [(24, 6), (40, 8), (30, 5), (63, 9)]:
    H.ekle(ALAN, "Zor", f"Alanı {alan} cm² olan paralelkenarın taban uzunluğu {t} cm ise bu tabana ait yüksekliği kaç cm'dir?",
           f"{alan // t} cm", [f"{alan - t} cm", f"{alan * 2 // t} cm", f"{alan // t + 2} cm"])
for alan, t in [(24, 8), (30, 6), (42, 12), (35, 10)]:
    H.ekle(ALAN, "Zor", f"Alanı {alan} cm² olan üçgenin taban uzunluğu {t} cm ise bu tabana ait yüksekliği kaç cm'dir?",
           f"{2 * alan // t} cm" if (2 * alan) % t == 0 else f"{od(Decimal(2 * alan) / t)} cm",
           [f"{alan // t} cm" if alan % t == 0 else f"{od(Decimal(alan) / t)} cm", f"{alan - t} cm", f"{2 * alan // t + 3} cm"])
for m2, birim, sonuc in [(3, "dm²", "300 dm²"), (2, "cm²", "20000 cm²"), (5, "dm²", "500 dm²")]:
    H.ekle(ALAN, "Orta", f"{m2} m² kaç {birim}'dir?", sonuc,
           [f"{m2 * 10} {birim}", f"{m2 * 1000} {birim}", f"{m2 * (100 if birim == 'cm²' else 10000)} {birim}"])

# ---------------- Veri işleme ----------------
for _ in range(8):
    n = rnd.choice([4, 5])
    while True:
        veri = [rnd.randint(4, 20) for _ in range(n)]
        if sum(veri) % n == 0:
            break
    ort = sum(veri) // n
    H.ekle(VERI, "Orta", f"{', '.join(map(str, veri))} sayılarının aritmetik ortalaması kaçtır?", ort,
           [sum(veri), ort + 2, (max(veri) + min(veri)) // 2 if (max(veri) + min(veri)) // 2 != ort else ort - 2])
for _ in range(6):
    veri = rnd.sample(range(10, 60), 5)
    H.ekle(VERI, "Kolay", f"{', '.join(map(str, veri))} veri grubunun açıklığı kaçtır?", max(veri) - min(veri),
           [max(veri), min(veri), max(veri) + min(veri)])
for notlar, istenen in [([70, 80, 90], 85), ([60, 75], 80), ([90, 85, 80], 90)]:
    n = len(notlar) + 1
    gerek = istenen * n - sum(notlar)
    H.ekle(VERI, "Zor", f"Ayşe'nin ilk {len(notlar)} sınavdaki notları {', '.join(map(str, notlar))} olarak verilmiştir. Dört sınavın ortalamasının {istenen} olması için sonraki sınavdan kaç alması gerekir?",
           gerek, [istenen, gerek - 5, gerek + 5])
H.liste(VERI, "Kolay", [
    ("Bir veri grubundaki en büyük değer ile en küçük değer arasındaki farka ne ad verilir?", "Açıklık", ["Aritmetik ortalama", "Toplam", "Sıklık"]),
    ("Veri değerlerinin toplamının veri sayısına bölümüne ne ad verilir?", "Aritmetik ortalama", ["Açıklık", "Tepe değer", "Sıklık"]),
    ("Sınıftaki öğrencilerin en sevdiği meyveleri göstermek için hangi grafik en uygundur?", "Sütun grafiği", ["Çizgi grafiği", "Termometre", "Sayı doğrusu"]),
])

for i, s in enumerate(H.sorular, start=1):
    s["id"] = i
(BURA / "soru_havuzu.json").write_text(json.dumps(H.sorular, ensure_ascii=False, indent=1), encoding="utf-8")
LOGO = """<svg width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
      <rect class="kare edge" x="5" y="5" width="48" height="48" rx="10"></rect>
      <text class="lbl" x="29" y="36" text-anchor="middle" style="font-size:22px">π</text>
    </svg>"""
sayfa_yaz(H.sorular, KOK / "MatematikSoruUretici.html", "Matematik 6 Soru Üretici", "Matematik 6",
          "6. sınıf Matematik", LOGO, sys.argv[1] if len(sys.argv) > 1 else None)
H.ozet()
