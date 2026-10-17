/* İlkokul 3. sınıf Hayat Bilgisi (Türkiye Yüzyılı Maarif Modeli): 6 tema.
 * Konular hb1.js dosyasında KONU_EKLE("hb", …) ile eklenir.
 */
DERS_EKLE({
  id: "hb", ad: "Hayat Bilgisi", kisa: "HB", simge: "🌱",
  temalar: [
    { id: "h3t1", ad: "Ben ve Okulum", kisa: "1. Tema" },
    { id: "h3t2", ad: "Sağlığım ve Güvenliğim", kisa: "2. Tema" },
    { id: "h3t3", ad: "Ailem ve Toplum", kisa: "3. Tema" },
    { id: "h3t4", ad: "Yaşadığım Yer ve Ülkem", kisa: "4. Tema" },
    { id: "h3t5", ad: "Doğa ve Çevre", kisa: "5. Tema" },
    { id: "h3t6", ad: "Bilim, Teknoloji ve Sanat", kisa: "6. Tema" },
  ],
  yazililar: {
    d1y1: ["h3_ben", "h3_okul", "h3_arkadas", "h3_beslenme", "h3_temizlik"],
    d1y2: ["h3_trafik", "h3_acil", "h3_internet", "h3_aile", "h3_gelenek"],
    d2y1: ["h3_butce", "h3_meslek", "h3_adres", "h3_ilim", "h3_milli"],
    d2y2: ["h3_mevsim", "h3_canli", "h3_afet", "h3_cevre", "h3_teknoloji", "h3_mucit", "h3_sanat"],
  },
});
