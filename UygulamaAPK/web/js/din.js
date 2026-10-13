/* 6. sınıf Din Kültürü ve Ahlak Bilgisi (Türkiye Yüzyılı Maarif Modeli): üniteler.
 * Konular din1.js ve din2.js dosyalarında KONU_EKLE("din", …) ile eklenir.
 */
DERS_EKLE({
  id: "din", ad: "Din Kültürü", kisa: "Din", simge: "🕌",
  temalar: [
    { id: "d1", ad: "Peygamber ve İlahi Kitap İnancı", kisa: "1. Ünite" },
    { id: "d2", ad: "Ramazan ve Oruç", kisa: "2. Ünite" },
    { id: "d3", ad: "Ahlaki Davranışlar", kisa: "3. Ünite" },
    { id: "d4", ad: "Peygamberliğinden Önce Hz. Muhammed", kisa: "4. Ünite" },
    { id: "d5", ad: "Kültürümüzdeki Dinî Motifler", kisa: "5. Ünite" },
  ],
  yazililar: {
    d1y1: ["d_peygamber", "d_vahiy", "d_kitaplar", "d_felak", "d_ramazan"],
    d1y2: ["d_oruc", "d_kazanim", "d_iftar", "d_dogru", "d_merhamet"],
    d2y1: ["d_adap", "d_vatan", "d_kunut", "d_cevre", "d_cocukluk"],
    d2y2: ["d_genclik", "d_fil", "d_gelenek", "d_edebiyat", "d_musiki"],
  },
});
