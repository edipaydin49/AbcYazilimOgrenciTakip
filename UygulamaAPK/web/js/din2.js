/* 6. sınıf Din Kültürü ve Ahlak Bilgisi — 3., 4. ve 5. ünite konuları:
 * Ahlaki Davranışlar (Doğru Sözlülük, Merhamet, Adap ve Nezaket, Vatan Sevgisi, Kunut Duaları),
 * Peygamberliğinden Önce Hz. Muhammed (Doğduğu Çevre, Ailesi ve Çocukluğu, Gençlik Yılları, Fil Suresi),
 * Kültürümüzdeki Dinî Motifler (Gelenek, Edebiyat, Musiki).
 */
(function () {
  "use strict";
  const { S, Q, G } = OGR;

  /* Çözüm kurucu: 🔎 → 💡 → ✏️ (1–3 adım) → ✅ → 🔁 (toplam 5–7 adım) */
  const C = (anla, hatirla, adimlar, sonuc, kontrol) =>
    ["🔎 Soruyu anlayalım: " + anla, "💡 Hatırlayalım: " + hatirla].concat(adimlar.map(a => "✏️ " + a), ["✅ Sonuç: " + sonuc, "🔁 " + kontrol]);
  /* Havuz sorusu kısayolu */
  const D = (kaz, duzey, zorluk, soru, dogru, yanlis, ipucu, cozum, kural, dogruNeden, gorsel) =>
    Q(kaz, duzey, zorluk, soru, dogru, yanlis, ipucu, cozum, { kural, dogruNeden, gorsel });

  /* Zaman şeridi: olaylar [[etiket(yıl/yaş), açıklama], ...] — yalnızca g-* sınıfları */
  function zamanSeridi(olaylar, etiket) {
    const W = 640, n = olaylar.length, sol = 50, sag = 50, y = 70, adim = (W - sol - sag) / (n - 1);
    let ic = `<line class="g-cizgi" x1="${sol - 20}" y1="${y}" x2="${W - sag + 20}" y2="${y}" stroke-width="3"/>`;
    olaylar.forEach(([ust, alt], i) => {
      const x = sol + i * adim;
      ic += `<circle class="g-b g-cizgi" cx="${x}" cy="${y}" r="9" stroke-width="2"/>` + G.yazi(x, y - 20, ust, { b: 1 });
      String(alt).split("|").forEach((satir, j) => { ic += G.yazi(x, y + 32 + j * 16, satir, { k: 1 }); });
    });
    return G.svg(W, 150, ic, etiket || "zaman şeridi");
  }

  /* =============================== 3. ÜNİTE: AHLAKİ DAVRANIŞLAR =============================== */

  /* SON */
})();
