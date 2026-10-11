/* Matematik — ek sorular 2 (14 konu, 41 kazanımın tamamı): parametreli üreteçler ve yeni nesil sorular.
 * Her çözüm tahtada anlatır gibi 5–7 adımdır: 🔎 anlayalım → 💡 hatırlayalım → ✏️ uygulayalım → ✅ sonuç → 🔁 kontrol.
 * icerik.js ve mat_ek.js'deki kazanımlara SORU_EKLE ile üreteç ekler.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, bolenler, asalMi, ebob, ekok, kesir, asalCarpan, ek, ustlu, S, Q, G } = OGR;
  const lst = a => a.join(", ");
  /* a'dan b'ye (ikisi de dahil) farklı n tane rastgele tam sayı */
  const farkli = (n, a, b) => karistir([...Array(b - a + 1).keys()].map(i => a + i)).slice(0, n);

})();
