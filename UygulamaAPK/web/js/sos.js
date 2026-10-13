/* 6. sınıf Sosyal Bilgiler (Türkiye Yüzyılı Maarif Modeli): öğrenme alanları.
 * Konular sos1.js ve sos2.js dosyalarında KONU_EKLE("sos", …) ile eklenir.
 */
DERS_EKLE({
  id: "sos", ad: "Sosyal Bilgiler", kisa: "Sosyal", simge: "🌍",
  temalar: [
    { id: "s1", ad: "Birlikte Yaşamak", kisa: "1. Öğrenme Alanı" },
    { id: "s2", ad: "Evimiz Dünya", kisa: "2. Öğrenme Alanı" },
    { id: "s3", ad: "Ortak Mirasımız", kisa: "3. Öğrenme Alanı" },
  ],
  yazililar: {
    d1y1: ["s_gruplar", "s_kultur", "s_sorunlar"],
    d1y2: ["s_konum", "s_cevre", "s_turkdunyasi"],
    d2y1: ["s_turkistan", "s_islam"],
    d2y2: ["s_islamiyet", "s_anadolu"],
  },
});
