/* 6. sınıf Türkçe (Türkiye Yüzyılı Maarif Modeli): temalar ve “Türkçe Diyarı” oyununun adaları.
 * Konular tr1.js, tr2.js ve tr3.js dosyalarında KONU_EKLE("tr", …) ile eklenir. Her konu ders kitabındaki
 * bir metne/bölüme karşılık gelir; kitap metinleri kullanılmaz, sorular özgün kısa metinlerle hazırlanır.
 */
DERS_EKLE({
  id: "tr", ad: "Türkçe", kisa: "Tür", simge: "📖",
  temalar: [
    { id: "tr1", ad: "Dilimizin Zenginliği", kisa: "1. Tema", sayfa: "s. 10–63", ada: { ad: "Dilimizin Zenginliği Adası", rozet: "Kelime Ustası", simge: "🏝️", rozetSimge: "🏅" } },
    { id: "tr2", ad: "Bağımsızlık Yolu", kisa: "2. Tema", sayfa: "s. 66–113", ada: { ad: "Bağımsızlık Yolu Adası", rozet: "Bağımsızlık Kâşifi", simge: "🏰", rozetSimge: "🎖️" } },
    { id: "tr3", ad: "Farklı Dünyalar", kisa: "3. Tema", sayfa: "s. 116–169", ada: { ad: "Farklı Dünyalar Adası", rozet: "Dünya Kâşifi", simge: "🌍", rozetSimge: "🏆" } },
  ],
  /* Yazılı sınav kapsamları (veli panelinden değiştirilebilir). Kitabın 2. cildi eklenince güncellenecek. */
  yazililar: {
    d1y1: ["tr_seyyah", "tr_beylik", "tr_turkce", "tr_kasik", "tr_azerbaycan", "tr_uret1"],
    d1y2: ["tr_at", "tr_vatan", "tr_istiklal", "tr_zafer", "tr_samsun", "tr_uret2"],
    d2y1: ["tr_ova", "tr_ulkeler", "tr_okullar", "tr_eskimo", "tr_turkdunyasi", "tr_uret3"],
    d2y2: ["tr_seyyah", "tr_beylik", "tr_vatan", "tr_zafer", "tr_ova", "tr_eskimo"],
  },
});
