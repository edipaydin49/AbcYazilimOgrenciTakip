/* İlkokul 3. sınıf Türkçe (Türkiye Yüzyılı Maarif Modeli): 8 tema ve “Türkçe Diyarı” adaları.
 * Konular tr1.js (Tema 1–4) ve tr2.js (Tema 5–8) dosyalarında KONU_EKLE("tr", …) ile eklenir.
 */
DERS_EKLE({
  id: "tr", ad: "Türkçe", kisa: "Tür", simge: "📖",
  temalar: [
    { id: "t3t1", ad: "Erdemler", kisa: "1. Tema", sayfa: "1. tema", ada: { ad: "Erdemler Adası", rozet: "İyilik Elçisi", simge: "🏝️", rozetSimge: "🏅" } },
    { id: "t3t2", ad: "Millî Kültürümüz", kisa: "2. Tema", sayfa: "2. tema", ada: { ad: "Kültür Adası", rozet: "Kültür Kâşifi", simge: "🏰", rozetSimge: "🎖️" } },
    { id: "t3t3", ad: "Doğa ve Evren", kisa: "3. Tema", sayfa: "3. tema", ada: { ad: "Doğa Adası", rozet: "Doğa Dostu", simge: "🌳", rozetSimge: "🏆" } },
    { id: "t3t4", ad: "Bilim ve Teknoloji", kisa: "4. Tema", sayfa: "4. tema", ada: { ad: "Bilim Adası", rozet: "Minik Bilgin", simge: "🔭", rozetSimge: "🥇" } },
    { id: "t3t5", ad: "Sağlık ve Spor", kisa: "5. Tema", sayfa: "5. tema", ada: { ad: "Sağlık Adası", rozet: "Sağlık Şampiyonu", simge: "⚽", rozetSimge: "🏅" } },
    { id: "t3t6", ad: "Okuma Kültürü", kisa: "6. Tema", sayfa: "6. tema", ada: { ad: "Kitap Adası", rozet: "Kitap Kurdu", simge: "📚", rozetSimge: "🎖️" } },
    { id: "t3t7", ad: "Vatandaşlık", kisa: "7. Tema", sayfa: "7. tema", ada: { ad: "Vatan Adası", rozet: "Örnek Vatandaş", simge: "🇹🇷", rozetSimge: "🏆" } },
    { id: "t3t8", ad: "Sanat", kisa: "8. Tema", sayfa: "8. tema", ada: { ad: "Sanat Adası", rozet: "Minik Sanatçı", simge: "🎨", rozetSimge: "🥇" } },
  ],
  yazililar: {
    d1y1: ["t3_harf", "t3_alfabe", "t3_esanlam", "t3_essesli"],
    d1y2: ["t3_ad", "t3_tekil", "t3_sifat", "t3_eylem"],
    d2y1: ["t3_cumle", "t3_buyuk", "t3_ana", "t3_5n1k", "t3_hikaye"],
    d2y2: ["t3_nokta", "t3_kidemi", "t3_siir", "t3_gorsel", "t3_mecaz"],
  },
});
