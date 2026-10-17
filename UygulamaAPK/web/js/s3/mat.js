/* İlkokul 3. sınıf Matematik (Türkiye Yüzyılı Maarif Modeli): temalar.
 * Konular mat1.js (Tema 1–2) ve mat2.js (Tema 3–6) dosyalarında KONU_EKLE("mat", …) ile eklenir.
 */
DERS_EKLE({
  id: "mat", ad: "Matematik", kisa: "Mat", simge: "🔢",
  temalar: [
    { id: "m3t1", ad: "Sayılar ve Nicelikler (1)", kisa: "1. Tema" },
    { id: "m3t2", ad: "İşlemlerden Cebirsel Düşünmeye", kisa: "2. Tema" },
    { id: "m3t3", ad: "Sayılar ve Nicelikler (2): Kesirler", kisa: "3. Tema" },
    { id: "m3t4", ad: "Geometrik Şekiller", kisa: "4. Tema" },
    { id: "m3t5", ad: "Geometrik Nicelikler (Ölçme)", kisa: "5. Tema" },
    { id: "m3t6", ad: "Veriye Dayalı Araştırma", kisa: "6. Tema" },
  ],
  /* 3. sınıfta notlu yazılı yok: dönem değerlendirme kapsamları */
  yazililar: {
    d1y1: ["m3_sayilar", "m3_basamak", "m3_karsilastir", "m3_yuvarla", "m3_oruntu", "m3_romen"],
    d1y2: ["m3_toplama", "m3_zihinden", "m3_cikarma", "m3_eksik", "m3_carpma", "m3_bolme", "m3_problem"],
    d2y1: ["m3_kesir", "m3_kesirkars", "m3_sekiller", "m3_cisimler", "m3_simetri", "m3_sekiloruntu"],
    d2y2: ["m3_uzunluk", "m3_cevrealan", "m3_zaman", "m3_para", "m3_tartma", "m3_sivi", "m3_veri", "m3_grafik"],
  },
});
