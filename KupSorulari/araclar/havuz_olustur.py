"""6. sınıf küp soruları havuzunu üretir.

Çıktı: soru_havuzu.json (web sayfası ve Excel bu dosyadan beslenir).
Her soru: id, konu, zorluk, soru, secenekler (4), dogru (0-3), sekil (isteğe bağlı).
"""
import json
import random
from pathlib import Path

rnd = random.Random(2026)
SUP = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")

K1 = "Sayının Küpü"
K2 = "Küpün Hacmi"
K3 = "Küpün Özellikleri"
K4 = "Birim Küplerle Yapılar"

havuz = []


def us(taban, kuvvet):
    return f"{taban}{str(kuvvet).translate(SUP)}"


def ekle(konu, zorluk, soru, dogru, yanlislar, sekil=None, birim=""):
    """Doğru cevap + 3 farklı çeldiriciyle soruyu havuza ekler."""
    dogru_s = f"{dogru}{birim}"
    secenek = []
    for y in yanlislar:
        y_s = f"{y}{birim}"
        if y_s != dogru_s and y_s not in secenek and (not isinstance(y, int) or y > 0):
            secenek.append(y_s)
    k = 1
    while len(secenek) < 3 and isinstance(dogru, int):
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


# ---------------- 1) Sayının küpü ----------------
for a in range(1, 11):
    ekle(K1, "Kolay", f"{us(a, 3)} ifadesinin değeri kaçtır?", a ** 3, [a * 3, a ** 2, a ** 3 + a, a + 3])
for a in range(2, 10):
    ekle(K1, "Kolay", f"{a} · {a} · {a} çarpımının üslü gösterimi hangisidir?",
         us(a, 3), [us(3, a), us(a, 2), f"{a} · 3", us(a, 4), f"{3 * a}"])
for a in range(2, 10):
    ekle(K1, "Kolay", f"{us(a, 3)} ifadesinin anlamı aşağıdakilerden hangisidir?",
         f"{a} · {a} · {a}", [f"{a} · 3", f"{a} + {a} + {a}", f"3 · 3 · " + " · ".join(["3"] * (a - 2)) if a > 2 else "3 · 3",
          f"{a} · {a}", f"{3 * a}"])
for a in range(2, 11):
    ekle(K1, "Orta", f"Küpü {a ** 3} olan doğal sayı kaçtır?", a, [a + 1, a - 1, a + 2, a ** 2])
for a, b in [(2, 3), (2, 5), (3, 2), (3, 4), (4, 3), (2, 7), (5, 2), (3, 6), (4, 5), (2, 9)]:
    ekle(K1, "Orta", f"{us(a, 3)} + {us(b, 2)} işleminin sonucu kaçtır?",
         a ** 3 + b ** 2, [a * 3 + b * 2, a ** 3 + b * 2, a ** 2 + b ** 2, a ** 3 + b ** 3])
for a, b in [(3, 2), (3, 4), (4, 3), (4, 5), (5, 3), (5, 7), (4, 7), (5, 10)]:
    ekle(K1, "Orta", f"{us(a, 3)} − {us(b, 2)} işleminin sonucu kaçtır?",
         a ** 3 - b ** 2, [a ** 3 - b * 2, a ** 2 - b, a * 3 + b ** 2 - 2 * b ** 2 + 30, a ** 3 + b ** 2])
ifadeler = [(2, 3), (3, 2), (4, 2), (5, 2), (3, 3), (6, 2), (2, 5), (7, 2), (4, 3), (9, 2), (5, 3), (10, 2)]
for i in range(8):
    while True:
        secim = rnd.sample(ifadeler, 4)
        degerler = [t ** k for t, k in secim]
        if len(set(degerler)) == 4:
            break
    en_buyuk = i % 2 == 0
    hedef = max(degerler) if en_buyuk else min(degerler)
    dogru = us(*secim[degerler.index(hedef)])
    ekle(K1, "Orta", f"Aşağıdakilerden hangisinin değeri en {'büyüktür' if en_buyuk else 'küçüktür'}?",
         dogru, [us(t, k) for t, k in secim if us(t, k) != dogru])
kupler = [8, 27, 64, 125, 216, 343, 512, 729, 1000]
kup_olmayan = [9, 16, 25, 32, 36, 49, 81, 100, 50, 18]
for i in range(6):
    yanlis = rnd.sample(kupler, 3)
    dogru = rnd.choice([x for x in kup_olmayan])
    ekle(K1, "Orta", "Aşağıdakilerden hangisi bir doğal sayının küpü değildir?", dogru, yanlis)
for i in range(6):
    yanlis = rnd.sample(kup_olmayan, 3)
    dogru = rnd.choice(kupler)
    ekle(K1, "Orta", "Aşağıdakilerden hangisi bir doğal sayının küpüdür?", dogru, yanlis)
for a, b, c, d in [(3, 4, 5, 2), (2, 3, 2, 5), (4, 6, 7, 3), (5, 10, 9, 4), (3, 2, 8, 6), (4, 5, 8, 1), (2, 1, 6, 9), (5, 4, 20, 7)]:
    sonuc = a ** 3 - b * c + d
    ekle(K1, "Zor", f"{us(a, 3)} − {b} · {c} + {d} işleminin sonucu kaçtır?",
         sonuc, [(a ** 3 - b) * c + d, a * 3 - b * c + d + 20, a ** 3 - b * c - d, a ** 3 - b * (c + d)])
for a, b in [(1, 2), (1, 3), (2, 2), (2, 3), (1, 4), (3, 3), (2, 4), (1, 5)]:
    ekle(K1, "Zor", f"({a} + {b})³ ifadesinin değeri kaçtır?",
         (a + b) ** 3, [a ** 3 + b ** 3, (a + b) * 3, (a + b) ** 2, a ** 3 + b])
for a, k in [(3, 5), (4, 6), (2, 9), (5, 11), (6, 4), (3, 13), (4, 10), (7, 7)]:
    ekle(K1, "Zor", f"Bir doğal sayının küpünün {k} fazlası {a ** 3 + k}'dir. Bu sayı kaçtır?",
         a, [a + 1, a - 1, (a ** 3 + k) // 3, a + 2])
for a, k in [(2, 5), (3, 4), (4, 2), (5, 3), (2, 10), (3, 9)]:
    ekle(K1, "Zor", f"Bir doğal sayının küpü {a ** 3}'dir. Bu sayının {k} fazlasının karesi kaçtır?",
         (a + k) ** 2, [a ** 2 + k, (a + k) * 2, a ** 3 + k, (a + k) ** 3])

# ---------------- 2) Küpün hacmi ----------------
for a in range(2, 13):
    ekle(K2, "Kolay", f"Bir ayrıtı {a} cm olan küpün hacmi kaç cm³'tür?",
         a ** 3, [a * 3, a ** 2, 6 * a ** 2, 12 * a], sekil={"tip": "kup", "etiket": f"{a} cm"})
for a in range(2, 5):
    ekle(K2, "Kolay", f"Şekildeki gibi bir ayrıtı {a} birim olan küp kaç birim küpten oluşur?",
         a ** 3, [a * 3, a ** 2, 6 * a ** 2], sekil={"tip": "yapi", "h": [[a] * a for _ in range(a)]})
for a in range(5, 9):
    ekle(K2, "Kolay", f"Bir ayrıtı {a} birim olan küp kaç birim küpten oluşur?", a ** 3, [a * 3, a ** 2, 6 * a ** 2])
for a in range(2, 11):
    ekle(K2, "Orta", f"Hacmi {a ** 3} cm³ olan küpün bir ayrıtı kaç cm'dir?",
         a, [a + 1, a - 1, a ** 3 // 3, a ** 2], sekil={"tip": "kup", "etiket": "? cm"})
for a, b in [(4, 2), (6, 2), (6, 3), (8, 2), (8, 4), (9, 3), (10, 5), (12, 3), (12, 4), (10, 2)]:
    ekle(K2, "Orta", f"Bir ayrıtı {a} cm olan küp şeklindeki bir kutunun içine, bir ayrıtı {b} cm olan küp şeklindeki kutulardan en fazla kaç tane yerleştirilebilir?",
         (a // b) ** 3, [a // b, (a // b) ** 2, 3 * (a // b), (a // b) ** 3 * 2])
for a, n in [(2, 3), (3, 2), (2, 5), (4, 3), (3, 4), (5, 2)]:
    ekle(K2, "Orta", f"Bir ayrıtı {a} cm olan {n} tane küp, aralarında boşluk kalmayacak şekilde üst üste konuyor. Oluşan prizmanın hacmi kaç cm³'tür?",
         n * a ** 3, [n * a ** 2, a ** 3 + n, (n * a) ** 3, 3 * n * a])
for a, b in [(2, 3), (2, 4), (3, 4), (3, 5), (1, 3), (4, 5), (2, 5), (1, 4)]:
    ekle(K2, "Zor", f"Bir ayrıtı {a} birim olan küp şeklindeki yapıyı, bir ayrıtı {b} birim olan küpe tamamlamak için en az kaç birim küp gerekir?",
         b ** 3 - a ** 3, [b ** 3, (b - a) ** 3, b ** 2 - a ** 2, a ** 3])
for a in range(2, 10):
    ekle(K2, "Zor", f"Bir ayrıtı {a} dm olan küp şeklindeki boş akvaryum tamamen doldurulursa kaç litre su alır? (1 dm³ = 1 L)",
         a ** 3, [a * 3, a ** 2, 6 * a ** 2], birim=" L", sekil={"tip": "kup", "etiket": f"{a} dm"})
for a in (10, 20, 30, 40, 50):
    k = a // 10
    ekle(K2, "Zor", f"Bir ayrıtı {a} cm olan küp şeklindeki su deposu kaç litre su alır? (1 L = 1000 cm³)",
         k ** 3, [k ** 2, 3 * k, k ** 3 * 10, k ** 3 * 100], birim=" L")
for k in (2, 3, 4, 5):
    ekle(K2, "Zor", f"Bir küpün ayrıt uzunluğu {k} katına çıkarılırsa hacmi kaç katına çıkar?",
         k ** 3, [k, k ** 2, 3 * k])

# ---------------- 3) Küpün özellikleri ----------------
ekle(K3, "Kolay", "Küpün kaç yüzü vardır?", 6, [4, 8, 12])
ekle(K3, "Kolay", "Küpün kaç ayrıtı vardır?", 12, [6, 8, 10])
ekle(K3, "Kolay", "Küpün kaç köşesi vardır?", 8, [6, 4, 12])
ekle(K3, "Kolay", "Küpün yüzleri hangi geometrik şekle sahiptir?", "Kare", ["Dikdörtgen", "Üçgen", "Beşgen"])
ekle(K3, "Kolay", "Küpün bir köşesinde kaç ayrıt birleşir?", 3, [2, 4, 6])
ekle(K3, "Kolay", "Küpün bir yüzünde kaç ayrıt bulunur?", 4, [3, 6, 12])
ekle(K3, "Kolay", "Aşağıdakilerden hangisi küp şeklindedir?", "Zar", ["Top", "Konserve kutusu", "Dondurma külahı"])
ekle(K3, "Kolay", "Küp ile ilgili aşağıdakilerden hangisi yanlıştır?", "Ayrıtları farklı uzunluktadır",
     ["Tüm yüzleri karedir", "12 ayrıtı vardır", "8 köşesi vardır"])
for a in range(2, 11):
    ekle(K3, "Orta", f"Bir ayrıtı {a} cm olan küpün tüm ayrıtlarının uzunlukları toplamı kaç cm'dir?",
         12 * a, [6 * a, 8 * a, a ** 3, 4 * a], sekil={"tip": "kup", "etiket": f"{a} cm"})
for a in range(2, 11):
    ekle(K3, "Orta", f"Bir ayrıtı {a} cm olan küpün yüzey alanı kaç cm²'dir?",
         6 * a ** 2, [4 * a ** 2, a ** 3, 6 * a, a ** 2], sekil={"tip": "kup", "etiket": f"{a} cm"})
for a in range(2, 9):
    ekle(K3, "Orta", f"Bir yüzünün alanı {a ** 2} cm² olan küpün bir ayrıtı kaç cm'dir?", a, [a + 1, a ** 2 // 2, a + 2, 2 * a])
for a in range(2, 9):
    ekle(K3, "Zor", f"Tüm ayrıtlarının uzunlukları toplamı {12 * a} cm olan küpün hacmi kaç cm³'tür?",
         a ** 3, [(12 * a) ** 2, 12 * a // 3, a ** 2, 6 * a ** 2])
for a in range(2, 8):
    ekle(K3, "Zor", f"Yüzey alanı {6 * a ** 2} cm² olan küpün hacmi kaç cm³'tür?",
         a ** 3, [a ** 2, 6 * a, 6 * a ** 2 // 2, (a + 1) ** 3])
for n in (3, 4, 5):
    on = f"Bir ayrıtı {n} birim olan küp, birim küplerden oluşturuluyor ve dış yüzeyinin tamamı boyanıyor. "
    ekle(K3, "Zor", on + "Hiç boyanmamış kaç birim küp vardır?", (n - 2) ** 3,
         [n ** 3 - 6 * n, 6 * (n - 2) ** 2, 12 * (n - 2), 8], sekil={"tip": "yapi", "h": [[n] * n for _ in range(n)]})
    ekle(K3, "Zor", on + "Yalnızca 1 yüzü boyalı kaç birim küp vardır?", 6 * (n - 2) ** 2,
         [12 * (n - 2), (n - 2) ** 3, 6 * n, 8], sekil={"tip": "yapi", "h": [[n] * n for _ in range(n)]})
    ekle(K3, "Zor", on + "Yalnızca 2 yüzü boyalı kaç birim küp vardır?", 12 * (n - 2),
         [6 * (n - 2) ** 2, 8, 12 * n, (n - 2) ** 3], sekil={"tip": "yapi", "h": [[n] * n for _ in range(n)]})
ekle(K3, "Zor", "Birim küplerden oluşan bir küpün dış yüzeyi boyanıyor. 3 yüzü boyalı kaç birim küp vardır?", 8, [6, 12, 4])


# ---------------- 4) Birim küplerle yapılar (şekilli) ----------------
def yapi_uret(satir, sutun, en_yuksek):
    """Arkadan öne doğru yüksekliği azalan (her küpü görünen) bir yapı üretir."""
    while True:
        h = [[0] * sutun for _ in range(satir)]
        for i in range(satir):
            for j in range(sutun):
                ust = en_yuksek
                if i > 0:
                    ust = min(ust, h[i - 1][j])
                if j > 0:
                    ust = min(ust, h[i][j - 1])
                h[i][j] = rnd.randint(0 if (i or j) else 1, ust)
        if h[0][0] >= 2 and sum(map(sum, h)) >= 4:
            return h


gorulen = set()
for zorluk, boyut, adet in [("Kolay", (2, 2, 3), 8), ("Orta", (3, 3, 3), 10), ("Orta", (2, 3, 4), 4)]:
    uretilen = 0
    while uretilen < adet:
        h = yapi_uret(*boyut)
        anahtar = json.dumps(h)
        if anahtar in gorulen:
            continue
        gorulen.add(anahtar)
        t = sum(map(sum, h))
        ekle(K4, zorluk, "Şekildeki yapı kaç birim küpten oluşmaktadır? (Yapıda görünmeyen boşluk yoktur.)",
             t, [t + 1, t - 1, t + 2, t - 2], sekil={"tip": "yapi", "h": h})
        uretilen += 1
uretilen = 0
while uretilen < 10:
    h = yapi_uret(3, 3, 3)
    anahtar = "z" + json.dumps(h)
    if anahtar in gorulen:
        continue
    gorulen.add(anahtar)
    t = sum(map(sum, h))
    ekle(K4, "Zor", "Şekildeki yapıyı bir ayrıtı 3 birim olan küpe tamamlamak için en az kaç birim küp gerekir?",
         27 - t, [t, 27 - t + 1, 27 - t - 1, 9 - t if 9 - t > 0 else 27 - t + 3], sekil={"tip": "yapi", "h": h})
    uretilen += 1

cikti = Path(__file__).with_name("soru_havuzu.json")
cikti.write_text(json.dumps(havuz, ensure_ascii=False, indent=1), encoding="utf-8")
from collections import Counter
print(len(havuz), Counter((s["konu"], s["zorluk"]) for s in havuz))
