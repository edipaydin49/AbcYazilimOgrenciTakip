"""Soru havuzu kurmak için ortak yardımcılar."""
import random
import re
from collections import Counter

SUP = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")


def us(taban, kuvvet):
    return f"{taban}{str(kuvvet).translate(SUP)}"


class Havuz:
    def __init__(self, tohum):
        self.rnd = random.Random(tohum)
        self.sorular = []
        self._gorulen = set()

    def ekle(self, konu, zorluk, soru, dogru, yanlislar, birim="", **ek):
        """Doğru cevap + 3 farklı çeldirici. Sayısal cevapta çeldirici eksikse ±k ile tamamlanır.
        Aynı soru (aynı metin ve cevap) ikinci kez eklenmez; eklenip eklenmediği döner."""
        dogru_s = f"{dogru}{birim}"
        secenek = []
        for y in yanlislar:
            y_s = f"{y}{birim}"
            gecerli = not isinstance(y, (int, float)) or y > 0
            if y_s != dogru_s and y_s not in secenek and gecerli:
                secenek.append(y_s)
        k = 1
        taban = dogru if isinstance(dogru, int) else (int(dogru) if re.fullmatch(r"-?[0-9]+", str(dogru)) else None)
        while len(secenek) < 3:
            if taban is None or k > 50:
                raise ValueError(f"Yetersiz çeldirici: {soru} / {dogru}")
            for aday in (taban + k, taban - k):
                a_s = f"{aday}{birim}"
                if (aday > 0 or taban <= 0) and a_s != dogru_s and a_s not in secenek and len(secenek) < 3:
                    secenek.append(a_s)
            k += 1
        secenek = secenek[:3]
        anahtar = (konu, soru, dogru_s, tuple(sorted(secenek)))
        if anahtar in self._gorulen:
            return False
        self._gorulen.add(anahtar)
        secenek.append(dogru_s)
        self.rnd.shuffle(secenek)
        kayit = {"id": len(self.sorular) + 1, "konu": konu, "zorluk": zorluk, "soru": soru,
                 "secenekler": secenek, "dogru": secenek.index(dogru_s)}
        kayit.update({k: v for k, v in ek.items() if v is not None})
        self.sorular.append(kayit)
        return True

    def tekrar(self, adet, fonk):
        """fonk() bir soru eklemeyi dener; tekrar eden sorular sayılmaz."""
        eklenen = deneme = 0
        while eklenen < adet and deneme < adet * 30:
            deneme += 1
            if fonk():
                eklenen += 1

    def liste(self, konu, zorluk, satirlar):
        """[(soru, doğru, [yanlış, yanlış, yanlış]), ...] biçimindeki elle yazılmış soruları ekler."""
        for soru, dogru, yanlis in satirlar:
            self.ekle(konu, zorluk, soru, dogru, yanlis)

    def ozet(self):
        print(len(self.sorular), "soru")
        for (k, z), n in sorted(Counter((s["konu"], s["zorluk"]) for s in self.sorular).items()):
            print(f"  {k:40} {z:6} {n}")
