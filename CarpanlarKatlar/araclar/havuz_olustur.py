"""6. sınıf (Maarif Modeli) Çarpanlar ve Katlar · Asal Çarpanlar, Ortak Bölenler ve Ortak Katlar soru havuzu.

Çalıştırınca soru_havuzu.json ve ../CarpanlarKatlarSoruUretici.html dosyalarını üretir.
İsteğe bağlı 1. argüman: claude.ai yayın kopyasının yolu.
"""
import json
import random
import sys
from collections import Counter
from math import gcd
from pathlib import Path

BURA = Path(__file__).parent
KOK = BURA.parent
sys.path.insert(0, str(KOK.parent / "ortak"))
from sayfa_olustur import sayfa_yaz  # noqa: E402

rnd = random.Random(608)
SUP = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")

K_CARPAN = "Çarpanlar"
K_KAT = "Katlar"
K_ASAL = "Asal Sayılar"
K_AYIR = "Asal Çarpanlara Ayırma"
K_OBEB = "Ortak Bölenler"
K_OKEK = "Ortak Katlar"

havuz = []


def ekle(konu, zorluk, soru, dogru, yanlislar, sekil=None, birim=""):
    dogru_s = f"{dogru}{birim}"
    secenek = []
    for y in yanlislar:
        y_s = f"{y}{birim}"
        if y_s != dogru_s and y_s not in secenek and (not isinstance(y, int) or y > 0):
            secenek.append(y_s)
    k = 1
    while len(secenek) < 3:
        if not isinstance(dogru, int):
            raise ValueError(f"Yetersiz çeldirici: {soru}")
        for aday in (dogru + k, dogru - k):
            a_s = f"{aday}{birim}"
            if aday > 0 and a_s != dogru_s and a_s not in secenek and len(secenek) < 3:
                secenek.append(a_s)
        k += 1
    secenek = secenek[:3] + [dogru_s]
    rnd.shuffle(secenek)
    kayit = {"id": len(havuz) + 1, "konu": konu, "zorluk": zorluk, "soru": soru,
             "secenekler": secenek, "dogru": secenek.index(dogru_s)}
    if sekil:
        kayit["sekil"] = sekil
    havuz.append(kayit)


def bolenler(n):
    return [d for d in range(1, n + 1) if n % d == 0]


def asal_mi(n):
    return n > 1 and all(n % d for d in range(2, int(n ** 0.5) + 1))


def asal_carpanlar(n):
    """{asal: kuvvet} sözlüğü."""
    s, d = {}, 2
    while n > 1:
        while n % d == 0:
            s[d] = s.get(d, 0) + 1
            n //= d
        d += 1
    return s


def ustlu(c):
    return " · ".join(f"{p}{str(k).translate(SUP)}" if k > 1 else str(p) for p, k in sorted(c.items()))


# Sayıya göre Türkçe ekler (yalnızca soru kalıplarında kullanılan sayılar için).
ULESTIRME = {1: "er", 2: "şer", 3: "er", 4: "er", 5: "er", 6: "şar", 7: "şer", 8: "er", 9: "ar", 10: "ar"}
AYRILMA = {1: "den", 2: "den", 3: "ten", 4: "ten", 5: "ten", 6: "dan", 7: "den", 8: "den", 9: "dan", 10: "dan"}
BULUNMA = {7: "de", 8: "de", 9: "da", 10: "da"}


def ekok(a, b):
    return a * b // gcd(a, b)


ASALLAR = [p for p in range(2, 100) if asal_mi(p)]
BILESIK = [n for n in range(4, 100) if not asal_mi(n)]

# ================= ÇARPANLAR =================
for n in [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 54, 60, 72]:
    b = bolenler(n)
    dogru = rnd.choice([d for d in b if 1 < d < n])
    olmayan = rnd.sample([x for x in range(2, n) if n % x], 3)
    ekle(K_CARPAN, "Kolay", f"Aşağıdakilerden hangisi {n} sayısının çarpanlarından biridir?", dogru, olmayan)
for n in [16, 18, 24, 30, 32, 36, 40, 48, 50, 56, 63, 64]:
    b = [d for d in bolenler(n) if 1 < d < n]
    dogru = rnd.choice([x for x in range(3, n) if n % x])
    ekle(K_CARPAN, "Kolay", f"Aşağıdakilerden hangisi {n} sayısının çarpanlarından biri <b>değildir</b>?",
         dogru, rnd.sample(b, min(3, len(b))))
for en, boy in [(6, 2), (4, 3), (6, 3), (5, 4), (8, 3), (9, 2), (6, 4), (7, 3), (10, 2), (8, 4)]:
    n = en * boy
    ekle(K_CARPAN, "Kolay", f"Şekilde {n} birim kare ile oluşturulmuş bir dikdörtgen modeli verilmiştir. Bu model {n} sayısının hangi çarpan çiftini gösterir?",
         f"{boy} ve {en}", [f"{boy} ve {en + 1}", f"{en} ve {en}", f"2 ve {n // 2 + 1}", f"{boy + 1} ve {en - 1}"],
         sekil={"tip": "dikdortgen", "en": en, "boy": boy})
for n in [12, 16, 18, 20, 24, 28, 30, 36, 40, 45, 48, 60, 64, 72, 100]:
    d = len(bolenler(n))
    ekle(K_CARPAN, "Orta", f"{n} sayısının kaç tane çarpanı vardır?", d, [d - 2, d - 1, d + 1, d + 2, d // 2])
for n in [12, 16, 18, 20, 24, 30, 36, 40]:
    dik = (len(bolenler(n)) + 1) // 2
    ornek = [d for d in bolenler(n) if d * d <= n][-1]
    ekle(K_CARPAN, "Orta", f"{n} birim karenin tamamı kullanılarak, birim kareler arasında boşluk kalmayacak şekilde kaç farklı dikdörtgen oluşturulabilir? (2 × 3 ile 3 × 2 aynı kabul edilir.)",
         dik, [len(bolenler(n)), dik - 1, dik + 1],
         sekil={"tip": "dikdortgen", "en": n // ornek, "boy": ornek})
for n in [18, 20, 24, 28, 30, 36, 40, 42, 48, 54]:
    b = bolenler(n)
    gizli = rnd.choice(b[2:-2])
    goster = ", ".join("A" if x == gizli else str(x) for x in b)
    ekle(K_CARPAN, "Orta", f"{n} sayısının çarpanları küçükten büyüğe şöyle sıralanmıştır: {goster}. A yerine hangi sayı gelmelidir?",
         gizli, [gizli + 1, gizli - 1, gizli * 2, gizli + 2])
for n in [24, 30, 36, 40, 48, 60]:
    b = bolenler(n)
    t = sum(b)
    ekle(K_CARPAN, "Zor", f"{n} sayısının çarpanlarının toplamı kaçtır?", t, [t - n, t - 1, t + n // 2, sum(b[1:-1])])
for n in [36, 48, 60, 72, 90]:
    tek = len([d for d in bolenler(n) if d % 2])
    ekle(K_CARPAN, "Zor", f"{n} sayısının çarpanlarından kaç tanesi tek sayıdır?", tek, [tek + 1, tek - 1, len(bolenler(n)) - tek])
for kisi_toplam in [24, 30, 36, 48]:
    secenek_sayisi = len([d for d in bolenler(kisi_toplam) if 1 < d < kisi_toplam])
    ekle(K_CARPAN, "Zor", f"Bir öğretmen {kisi_toplam} öğrenciyi, her grupta eşit sayıda öğrenci olacak ve hiç öğrenci açıkta kalmayacak şekilde gruplara ayıracaktır. Her grupta en az 2 öğrenci ve en az 2 grup olacaksa öğretmen kaç farklı şekilde gruplama yapabilir?",
         secenek_sayisi, [len(bolenler(kisi_toplam)), secenek_sayisi - 1, secenek_sayisi + 1])

# ================= KATLAR =================
for k in [3, 4, 6, 7, 8, 9, 11, 12, 13, 15]:
    dogru = k * rnd.randint(3, 9)
    olmayan = rnd.sample([x for x in range(10, 100) if x % k], 3)
    ekle(K_KAT, "Kolay", f"Aşağıdakilerden hangisi {k} sayısının katlarından biridir?", dogru, olmayan)
for k in [4, 6, 7, 8, 9, 12]:
    dogru = rnd.choice([x for x in range(20, 90) if x % k])
    ekle(K_KAT, "Kolay", f"Aşağıdakilerden hangisi {k} sayısının katı <b>değildir</b>?", dogru, [k * m for m in rnd.sample(range(3, 10), 3)])
for k, s in [(3, 5), (4, 6), (6, 4), (7, 5), (8, 3), (9, 6), (11, 4), (12, 5)]:
    ekle(K_KAT, "Kolay", f"{k} sayısının sıfırdan büyük katları küçükten büyüğe sıralandığında {s}. sırada hangi sayı bulunur?",
         k * s, [k * (s - 1), k * (s + 1), k + s, k * s + 1])
for a, b in [(4, 20), (6, 30), (3, 21), (5, 35), (8, 24), (7, 28), (9, 45), (12, 36)]:
    ekle(K_KAT, "Kolay", "Aşağıdaki ifadelerden hangisi doğrudur?",
         f"{b} sayısı {a} sayısının katıdır.",
         [f"{a} sayısı {b} sayısının katıdır.", f"{b} sayısı {a} sayısının çarpanıdır.", f"{a} sayısı {b} sayısının çarpanı değildir."])
for adim, soru in [(3, 5), (4, 4), (5, 6), (6, 5), (7, 4), (8, 5), (9, 4), (12, 3), (15, 4), (25, 3)]:
    ekle(K_KAT, "Orta", "Sayı doğrusunda 0'dan başlanarak eşit adımlarla ilerleniyor. Soru işareti (?) yerine hangi sayı gelmelidir?",
         adim * soru, [adim * (soru - 1), adim * (soru + 1), adim + soru, adim * soru + adim // 2 + 1],
         sekil={"tip": "dogru", "adim": adim, "adet": soru + 1, "goster": [0, 1], "soru": soru})
for k, a, b in [(6, 20, 60), (7, 30, 80), (8, 10, 70), (9, 40, 100), (4, 25, 55), (12, 30, 110), (5, 12, 68), (11, 20, 100)]:
    n = len([x for x in range(a + 1, b) if x % k == 0])
    ekle(K_KAT, "Orta", f"{a} ile {b} arasında {k} sayısının kaç katı vardır?", n, [n + 1, n - 1, n + 2, (b - a) // k + 2])
for k in [6, 7, 8, 9, 12, 13, 15, 17]:
    n = 99 // k * k
    ekle(K_KAT, "Orta", f"{k} sayısının katı olan en büyük iki basamaklı sayı kaçtır?", n, [n - k, n + k if n + k < 100 else n - 2 * k, 99, n - 1])
for k in [7, 8, 9, 11, 12, 13, 14]:
    n = -(-100 // k) * k
    ekle(K_KAT, "Orta", f"{k} sayısının katı olan en küçük üç basamaklı sayı kaçtır?", n, [n + k, n - k, 100, n + 1])
for k, adet in [(6, 4), (8, 5), (12, 3), (15, 4), (9, 6)]:
    t = k * adet * (adet + 1) // 2
    ekle(K_KAT, "Zor", f"{k} sayısının sıfırdan büyük ilk {adet} katının toplamı kaçtır?", t, [k * adet, t - k, t + k, k * (adet + 1)])
for sayi, bas, adim in [(5, 9, 5), (3, 8, 3), (4, 11, 4), (6, 7, 6)]:
    seri = [bas + adim * i for i in range(4)]
    son = bas + adim * 9
    ekle(K_KAT, "Zor", f"Bir sayı örüntüsü {', '.join(map(str, seri))}, ... şeklinde devam etmektedir. Bu örüntünün 10. terimi kaçtır?",
         son, [son - adim, son + adim, adim * 10, son + 1])
for k in [4, 6, 9]:
    x = rnd.choice([m for m in range(40, 90) if m % k == 0])
    ekle(K_KAT, "Zor", f"Bir kutudaki kalemler {k}'{ULESTIRME[k]} {k}'{ULESTIRME[k]} sayıldığında hiç kalem artmıyor. Kutudaki kalem sayısı 40 ile 90 arasında olduğuna göre aşağıdakilerden hangisi kutudaki kalem sayısı olabilir?",
         x, rnd.sample([m for m in range(40, 90) if m % k], 3))

# ================= ASAL SAYILAR =================
for _ in range(10):
    dogru = rnd.choice(ASALLAR[3:20])
    ekle(K_ASAL, "Kolay", "Aşağıdakilerden hangisi asal sayıdır?", dogru,
         rnd.sample([1, 9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 57, 63, 65, 69, 77, 81, 87, 91], 3))
for _ in range(8):
    dogru = rnd.choice([1, 9, 15, 21, 27, 33, 39, 49, 51, 57, 87, 91])
    ekle(K_ASAL, "Kolay", "Aşağıdakilerden hangisi asal sayı <b>değildir</b>?", dogru, rnd.sample(ASALLAR[1:20], 3))
ekle(K_ASAL, "Kolay", "En küçük asal sayı kaçtır?", 2, [0, 1, 3])
ekle(K_ASAL, "Kolay", "Hem asal hem de çift olan sayı hangisidir?", 2, [4, 1, 6])
ekle(K_ASAL, "Kolay", "Asal sayılar için aşağıdakilerden hangisi doğrudur?", "Yalnızca 2 çarpanı vardır: 1 ve kendisi.",
     ["1 bir asal sayıdır.", "Bütün asal sayılar tek sayıdır.", "Asal sayıların çarpanı yoktur."])
ekle(K_ASAL, "Kolay", "1 sayısı neden asal sayı değildir?", "Yalnızca 1 tane çarpanı vardır.",
     ["Çift sayı olduğu için", "Çok fazla çarpanı olduğu için", "Tek basamaklı olduğu için"])
for a, b in [(1, 20), (10, 30), (20, 40), (30, 50), (40, 60), (50, 70), (60, 80), (70, 100), (1, 30), (10, 50)]:
    n = len([p for p in ASALLAR if a < p < b])
    ekle(K_ASAL, "Orta", f"{a} ile {b} arasında kaç tane asal sayı vardır?", n, [n + 1, n - 1, n + 2])
ekle(K_ASAL, "Orta", "İki basamaklı en küçük asal sayı kaçtır?", 11, [10, 13, 12])
ekle(K_ASAL, "Orta", "İki basamaklı en büyük asal sayı kaçtır?", 97, [99, 91, 89])
ekle(K_ASAL, "Orta", "Tek basamaklı asal sayıların toplamı kaçtır?", 17, [15, 16, 25])
ekle(K_ASAL, "Orta", "Tek basamaklı kaç tane asal sayı vardır?", 4, [3, 5, 6])
for a, b in [(10, 20), (20, 30), (30, 40), (40, 50), (1, 10), (50, 60)]:
    t = sum(p for p in ASALLAR if a < p < b)
    ekle(K_ASAL, "Zor", f"{a} ile {b} arasındaki asal sayıların toplamı kaçtır?", t, [t - 2, t + 2, t + 9, t - 7])
for n in [40, 50, 60, 70, 80, 90]:
    p = max(q for q in ASALLAR if q < n)
    ekle(K_ASAL, "Zor", f"{n} sayısından küçük en büyük asal sayı kaçtır?", p, [n - 1, p - 2, p + 2 if p + 2 < n else p - 4])
for n in [20, 30, 50, 60, 80, 90]:
    p = min(q for q in range(n + 1, 200) if asal_mi(q))
    ekle(K_ASAL, "Zor", f"{n} sayısından büyük en küçük asal sayı kaçtır?", p, [n + 1, p + 2, p - 2 if p - 2 > n else p + 4])
for a, b in [(3, 5), (5, 7), (11, 13), (17, 19), (29, 31), (41, 43)]:
    ekle(K_ASAL, "Zor", f"Aralarındaki fark 2 olan iki asal sayının toplamı {a + b} ise büyük olan sayı kaçtır?", b, [a, b + 2, (a + b) // 2])

# ================= ASAL ÇARPANLARA AYIRMA =================
AYRILACAK = [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 72, 75, 80, 84, 90, 96, 100, 120]
for n in AYRILACAK[:16]:
    c = asal_carpanlar(n)
    ps = sorted(c)
    bilesik = [d for d in bolenler(n) if 1 < d < n and not asal_mi(d)]
    yanlis1 = ", ".join(map(str, sorted(ps + [rnd.choice(bilesik)]))) if bilesik else None
    baska = [q for q in (2, 3, 5, 7, 11) if q not in ps]
    yanlis2 = ", ".join(map(str, sorted(ps[:-1] + [baska[0]]))) if len(ps) > 1 else f"{ps[0]}, {baska[0]}"
    yanlis3 = ", ".join(map(str, sorted(set(ps[:1] + [baska[-1]]))))
    yanlis4 = "1, " + ", ".join(map(str, ps))
    ekle(K_AYIR, "Kolay", f"{n} sayısının asal çarpanları hangileridir?", ", ".join(map(str, ps)),
         [y for y in (yanlis1, yanlis2, yanlis3, yanlis4) if y])
for n in AYRILACAK:
    c = asal_carpanlar(n)
    dogru = ustlu(c)
    ps = sorted(c)
    y1 = {p: k + (1 if i == 0 else 0) for i, (p, k) in enumerate(sorted(c.items()))}
    y2 = {p: max(1, k - 1) if i == 0 else k for i, (p, k) in enumerate(sorted(c.items()))}
    y3 = dict(c)
    y3[ps[-1]] = c[ps[-1]] + 1
    ikili = [d for d in bolenler(n) if 1 < d < n and not asal_mi(d)]
    y4 = f"{ikili[0]} · {n // ikili[0]}" if ikili else "1 · " + dogru
    ekle(K_AYIR, "Orta", f"{n} sayısının asal çarpanlarının üslü ifade ile gösterimi hangisidir?", dogru,
         [ustlu(y1), ustlu(y2), ustlu(y3), y4])


def agac(n):
    if asal_mi(n):
        return [n]
    p = min(asal_carpanlar(n))
    return [n, [p], agac(n // p)]


def ara_dugumler(d):
    if len(d) == 1:
        return []
    return [d[0]] + ara_dugumler(d[2])


for n in [24, 30, 36, 40, 42, 48, 60, 72, 84, 90, 100, 120]:
    a = agac(n)
    adaylar = ara_dugumler(a)[1:]
    gizli = rnd.choice(adaylar)
    ekle(K_AYIR, "Orta", "Şekildeki çarpan ağacında A yerine hangi sayı gelmelidir? (Daire içindeki sayılar asal çarpanlardır.)",
         gizli, [gizli * 2, gizli // 2 if gizli > 4 else gizli + 3, gizli + 2, gizli - 1],
         sekil={"tip": "agac", "dugum": a, "gizli": str(gizli)})


def merdiven(n):
    satir = []
    while n > 1:
        p = min(asal_carpanlar(n))
        satir.append([n, p])
        n //= p
    satir.append([1])
    return satir


for n in [36, 40, 45, 48, 54, 60, 72, 84, 90, 96, 100, 126]:
    m = merdiven(n)
    i = rnd.randrange(1, len(m) - 1)
    j = rnd.choice([0, 1])
    deger = m[i][j]
    yanlis = [deger + 1, deger * 2, deger - 1, deger + 2] if j == 0 else [q for q in (2, 3, 5, 7, 4, 6) if q != deger]
    ekle(K_AYIR, "Orta", "Şekilde bir sayının bölen merdiveni (asal çarpanlarına ayrılması) verilmiştir. Soru işareti (?) yerine hangi sayı gelmelidir?",
         deger, yanlis, sekil={"tip": "merdiven", "satirlar": m, "gizli": [i, j]})
for n in [60, 72, 84, 90, 108, 120, 126, 150, 180, 200]:
    c = asal_carpanlar(n)
    ekle(K_AYIR, "Zor", f"Asal çarpanlarına ayrılmış hali {ustlu(c)} olan sayı kaçtır?", n,
         [sum(p * k for p, k in c.items()), n // 2, n + min(c), n * 2])
for n in [30, 42, 60, 66, 70, 78, 84, 90, 105, 110]:
    t = sum(asal_carpanlar(n))
    ekle(K_AYIR, "Zor", f"{n} sayısının farklı asal çarpanlarının toplamı kaçtır?", t, [t + 2, t - 2, t + 5, sum(p * k for p, k in asal_carpanlar(n).items()) + 1])
for n in [36, 48, 72, 96, 120]:
    ekle(K_AYIR, "Zor", f"{n} sayısı asal çarpanlarına ayrıldığında 2 çarpanı kaç kez bulunur?", asal_carpanlar(n)[2],
         [asal_carpanlar(n)[2] + 1, asal_carpanlar(n)[2] - 1, len(asal_carpanlar(n))])

# ================= ORTAK BÖLENLER =================
CIFTLER = [(12, 18), (16, 24), (18, 30), (20, 30), (24, 36), (30, 45), (28, 42), (36, 48), (40, 60), (32, 48), (45, 60), (54, 72), (48, 72), (42, 56), (60, 90)]
for a, b in CIFTLER[:10]:
    ortak = [d for d in bolenler(gcd(a, b)) if d > 1]
    dogru = rnd.choice(ortak)
    yanlis = [d for d in bolenler(a) + bolenler(b) if d > 1 and (a % d or b % d)]
    ekle(K_OBEB, "Kolay", f"{a} ve {b} sayılarının ortak bölenlerinden biri aşağıdakilerden hangisidir?",
         dogru, rnd.sample(sorted(set(yanlis)), min(3, len(set(yanlis)))))
for a, b in CIFTLER:
    g = gcd(a, b)
    ekle(K_OBEB, "Orta", f"{a} ve {b} sayılarının en büyük ortak böleni kaçtır?", g, [g // 2, g * 2, ekok(a, b), g + 1])
for a, b in CIFTLER[:10]:
    n = len(bolenler(gcd(a, b)))
    ekle(K_OBEB, "Orta", f"{a} ve {b} sayılarının kaç tane ortak böleni vardır?", n, [n + 1, n - 1, n + 2])
for a, b in [(36, 48), (24, 40), (30, 42), (45, 60), (54, 72), (60, 84), (48, 80)]:
    g = gcd(a, b)
    ekle(K_OBEB, "Zor", f"{a} m ve {b} m uzunluğundaki iki ip, hiç artmayacak şekilde eşit uzunlukta parçalara ayrılacaktır. Parçalar mümkün olan en uzun boyda olacaksa bir parça kaç m olur?",
         g, [g // 2, g * 2, b - a, gcd(a, b) + 2], birim=" m")
for a, b in [(24, 36), (30, 45), (40, 56), (42, 70), (48, 60), (36, 54)]:
    g = gcd(a, b)
    paket = (a + b) // g
    ekle(K_OBEB, "Zor", f"{a} kırmızı ve {b} mavi bilye, her pakette yalnızca bir renk ve eşit sayıda bilye olacak şekilde paketlenecektir. Hiç bilye artmayacaksa en az kaç paket gerekir?",
         paket, [g, paket + 1, paket * 2, (a + b) // 2])
for a, b in [(12, 18), (24, 36), (30, 42), (20, 28), (36, 60), (40, 72)]:
    g = gcd(a, b)
    adet = (a // g) * (b // g)
    ekle(K_OBEB, "Zor", f"Boyutları {a} m ve {b} m olan dikdörtgen şeklindeki bir bahçe, hiç boşluk kalmayacak şekilde eş kare bölümlere ayrılacaktır. Kare bölümler mümkün olan en büyük boyutta olacaksa kaç kare bölüm oluşur?",
         adet, [g, adet * 2, adet + 1, (a * b) // 4],
         sekil={"tip": "dikdortgen", "en": b // g, "boy": a // g, "etiketEn": f"{b} m", "etiketBoy": f"{a} m"})
for a, b in [(18, 24), (36, 45), (48, 64)]:
    g = gcd(a, b)
    ekle(K_OBEB, "Zor", f"{a} kalem ve {b} silgi, hiç artmayacak şekilde öğrencilere eşit olarak dağıtılacaktır. En fazla kaç öğrenciye dağıtım yapılabilir?",
         g, [g // 2, g * 2, ekok(a, b), a + b])

# ================= ORTAK KATLAR =================
OK_CIFT = [(4, 6), (6, 8), (6, 9), (8, 12), (10, 15), (9, 12), (12, 18), (5, 7), (4, 10), (15, 20), (12, 16), (8, 10), (14, 21), (6, 15), (20, 30)]
for a, b in OK_CIFT[:10]:
    e = ekok(a, b)
    dogru = e * rnd.randint(1, 3)
    yanlis = [x for x in range(10, 4 * e) if (x % a == 0) != (x % b == 0)]
    ekle(K_OKEK, "Kolay", f"{a} ve {b} sayılarının ortak katlarından biri aşağıdakilerden hangisidir?", dogru, rnd.sample(yanlis, 3))
for a, b in OK_CIFT:
    e = ekok(a, b)
    ekle(K_OKEK, "Orta", f"{a} ve {b} sayılarının sıfırdan büyük en küçük ortak katı kaçtır?", e, [a * b if a * b != e else e * 2, gcd(a, b), e // 2 if e // 2 > b else e + a, e + b])
for a, b, s, t in [(4, 6, 1, 50), (6, 8, 1, 100), (3, 5, 20, 80), (4, 10, 10, 90), (6, 9, 10, 100), (8, 12, 1, 100)]:
    n = len([x for x in range(s + 1, t) if x % a == 0 and x % b == 0])
    ekle(K_OKEK, "Orta", f"{s} ile {t} arasında hem {a} sayısının hem de {b} sayısının katı olan kaç sayı vardır?", n, [n + 1, n - 1, n + 2])
for a, b in [(6, 8), (10, 15), (12, 18), (15, 20), (9, 12), (20, 30)]:
    e = ekok(a, b)
    ekle(K_OKEK, "Zor", f"Bir parkta bulunan iki lambadan biri {a} dakikada bir, diğeri {b} dakikada bir yanmaktadır. İki lamba birlikte yandıktan en az kaç dakika sonra tekrar birlikte yanar?",
         e, [a * b if a * b != e else e * 2, gcd(a, b), a + b, e // 2 if e // 2 > b else e + a], birim=" dk")
for a, b, saat in [(15, 20, 8), (12, 18, 9), (20, 30, 7), (10, 25, 8), (24, 36, 10)]:
    e = ekok(a, b)
    def fmt(dk):
        return f"{saat + dk // 60:02d}.{dk % 60:02d}"
    ekle(K_OKEK, "Zor", f"Bir duraktan A otobüsü {a} dakikada bir, B otobüsü {b} dakikada bir kalkmaktadır. Saat {saat:02d}.00'{BULUNMA[saat]} birlikte kalkan iki otobüs, en erken saat kaçta tekrar birlikte kalkar?",
         fmt(e), [fmt(a + b), fmt(e // 2 if e // 2 > b else e + a), fmt(min(a * b, 300) if a * b != e else e * 2)])
for a, b in [(4, 6), (6, 10), (8, 12), (9, 12), (10, 15)]:
    e = ekok(a, b)
    adet = (e // a) * (e // b)
    ekle(K_OKEK, "Zor", f"Kenar uzunlukları {a} cm ve {b} cm olan dikdörtgen kartonlar, aynı yönde ve aralarında boşluk kalmadan yan yana dizilerek bir kare oluşturulacaktır. Oluşturulabilecek en küçük karenin bir kenarı kaç cm olur?",
         e, [a * b if a * b != e else e * 2, a + b, gcd(a, b) * 2, e + a], birim=" cm")
    ekle(K_OKEK, "Zor", f"Kenar uzunlukları {a} cm ve {b} cm olan dikdörtgen kartonlarla oluşturulabilecek en küçük kare için kaç karton gerekir?",
         adet, [adet + 2, adet * 2, e // a + e // b, adet - 1])
for a, b, k in [(3, 4, 2), (4, 5, 1), (5, 6, 3), (4, 6, 1), (6, 8, 5), (3, 5, 2)]:
    e = ekok(a, b)
    ekle(K_OKEK, "Zor", f"Bir sınıftaki öğrenciler {a}'{ULESTIRME[a]} {a}'{ULESTIRME[a]} sayıldığında da {b}'{ULESTIRME[b]} {b}'{ULESTIRME[b]} sayıldığında da her seferinde {k} öğrenci artıyor. Sınıfta {k}'{AYRILMA[k]} fazla öğrenci olduğuna göre sınıfta en az kaç öğrenci vardır?",
         e + k, [e, e - k, a * b + k + 1 if a * b == e else a * b + k, e + 2 * k])

cikti = BURA / "soru_havuzu.json"
cikti.write_text(json.dumps(havuz, ensure_ascii=False, indent=1), encoding="utf-8")

LOGO = """<svg width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
      <line class="cizgi" x1="29" y1="16" x2="14" y2="38"></line><line class="cizgi" x1="29" y1="16" x2="44" y2="38"></line>
      <rect class="kare edge" x="15" y="2" width="28" height="20" rx="6"></rect>
      <circle class="asal edge" cx="13" cy="44" r="11"></circle><circle class="asal edge" cx="45" cy="44" r="11"></circle>
    </svg>"""
sayfa_yaz(havuz, KOK / "CarpanlarKatlarSoruUretici.html", "Çarpanlar ve Katlar",
          "Çarpanlar ve Katlar", "6. sınıf · Maarif Modeli", LOGO, sys.argv[1] if len(sys.argv) > 1 else None)
print(len(havuz), "soru")
for (k, z), n in sorted(Counter((s["konu"], s["zorluk"]) for s in havuz).items()):
    print(f"  {k:24} {z:6} {n}")
