/* 6. sınıf Fen Bilimleri (Türkiye Yüzyılı Maarif Modeli): üniteler.
 * Konular fen1.js, fen2.js ve fen3.js dosyalarında KONU_EKLE("fen", …) ile eklenir.
 */
DERS_EKLE({
  id: "fen", ad: "Fen Bilimleri", kisa: "Fen", simge: "🔬",
  temalar: [
    { id: "f1", ad: "Güneş Sistemi ve Tutulmalar", kisa: "1. Ünite" },
    { id: "f2", ad: "Kuvvetin Etkisinde Hareket", kisa: "2. Ünite" },
    { id: "f3", ad: "Canlılarda Sistemler", kisa: "3. Ünite" },
    { id: "f4", ad: "Işığın Yansıması ve Renkler", kisa: "4. Ünite" },
    { id: "f5", ad: "Maddenin Ayırt Edici Özellikleri", kisa: "5. Ünite" },
    { id: "f6", ad: "Elektriğin İletimi ve Direnç", kisa: "6. Ünite" },
    { id: "f7", ad: "Sürdürülebilir Yaşam ve Etkileşim", kisa: "7. Ünite" },
  ],
  /* Yazılı sınav kapsamları (veli panelinden değiştirilebilir). */
  yazililar: {
    d1y1: ["f_gunes", "f_tutulma", "f_bileske"],
    d1y2: ["f_bileske", "f_hiz", "f_ureme", "f_denetleyici"],
    d2y1: ["f_yansima", "f_sogurma", "f_genlesme", "f_hal"],
    d2y2: ["f_yogunluk", "f_iletim", "f_direnc", "f_biyocesitlilik", "f_cevre"],
  },
});
