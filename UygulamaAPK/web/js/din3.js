/* 6. sınıf Din Kültürü ve Ahlak Bilgisi — Ek Ünite (d6): Peygamberimiz Hz. Muhammed'in (sav) Hayatı.
 * Peygamberliğin Başlaması, Mekke Dönemi, Hicret, Medine Dönemi, Hudeybiye ve Mekke'nin Fethi,
 * Vedâ Haccı ve Vefatı, Peygamberimizin Ahlakı. (Doğumu, çocukluğu ve gençliği 4. ünitededir: din2.js)
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

  /* ---------------- Görseller (yalnızca g-* sınıfları) ---------------- */

  /* Zaman şeridi: olaylar [[üst etiket, "alt satır 1|alt satır 2"], ...] */
  function zaman(olaylar, etiket) {
    const W = 640, n = olaylar.length, sol = 78, sag = 78, y = 70, adim = (W - sol - sag) / (n - 1);
    let ic = `<line class="g-cizgi" x1="${sol - 20}" y1="${y}" x2="${W - sag + 20}" y2="${y}" stroke-width="3"/>`;
    olaylar.forEach(([ust, alt], i) => {
      const x = sol + i * adim;
      ic += `<circle class="${ust === "?" ? "g-d" : "g-b"} g-cizgi" cx="${x}" cy="${y}" r="9" stroke-width="2"/>` + G.yazi(x, y - 20, ust, { b: 1 });
      String(alt).split("|").forEach((satir, j) => { ic += G.yazi(x, y + 32 + j * 16, satir, { k: 1 }); });
    });
    return G.svg(W, 150, ic, etiket || "zaman şeridi");
  }

  /* Bilgi kartı / afiş: baslik ve satırlar (her satır en çok ~65 karakter) */
  function kart(baslik, satirlar, etiket) {
    const W = 560, H = 62 + satirlar.length * 26;
    let ic = `<rect class="g-yumusak g-cizgi" x="10" y="8" width="${W - 20}" height="${H - 16}" rx="14" stroke-width="2"/>`;
    ic += G.yazi(W / 2, 38, baslik, { b: 1 }) + `<line class="g-ince" x1="30" y1="50" x2="${W - 30}" y2="50"/>`;
    satirlar.forEach((s, i) => { ic += G.yazi(32, 76 + i * 26, s, { a: "start" }); });
    return G.svg(W, H, ic, etiket || baslik);
  }

  /* Konuşma balonları: [[konuşan, "satır 1|satır 2"], ...] */
  function balon(konusmalar, etiket) {
    const W = 600; let y = 12, ic = "";
    konusmalar.forEach(([kim, soz]) => {
      const satir = String(soz).split("|"), h = 22 + satir.length * 21;
      ic += `<circle class="g-b g-cizgi" cx="46" cy="${y + h / 2}" r="22" stroke-width="2"/>` + G.yazi(46, y + h / 2 + 6, "👤");
      ic += G.yazi(46, y + h / 2 + 40, kim, { k: 1, b: 1 });
      ic += `<path class="g-bos g-cizgi" d="M104 ${y + h / 2 - 8} L84 ${y + h / 2} L104 ${y + h / 2 + 8}" stroke-width="2"/>`;
      ic += `<rect class="g-bos g-cizgi" x="104" y="${y}" width="${W - 116}" height="${h}" rx="14" stroke-width="2"/>`;
      satir.forEach((s, i) => { ic += G.yazi(122, y + 27 + i * 21, s, { a: "start" }); });
      y += Math.max(h, 70) + 22;
    });
    return G.svg(W, y, ic, etiket || "konuşma balonları");
  }

  /* Hicaz bölgesi şematik haritası. harf: yer adları yerine harf göster; yol: hicret yolu çizilsin */
  function harita(harf, yol, etiket) {
    const yerler = [["Medine", 300, 80, "K"], ["Kuba", 312, 108, "L"], ["Bedir", 205, 150, "M"], ["Mekke", 330, 300, "N"], ["Sevr", 345, 345, "P"], ["Taif", 420, 318, "R"]];
    let ic = `<path class="g-yumusak g-cizgi" d="M40 20 L150 20 L150 120 L190 230 L260 330 L300 395 L40 395 Z" stroke-width="2"/>`;
    ic += G.yazi(110, 300, "Kızıldeniz", { k: 1 }) + G.yazi(470, 40, "K ↑", { b: 1 }) + G.yazi(450, 200, "HİCAZ", { b: 1 });
    if (yol) ic += `<path class="g-cizgi" d="M330 300 L345 345 C 300 360, 230 300, 215 220 C 205 160, 270 120, 312 108 L300 80" fill="none" stroke-width="3" stroke-dasharray="8 6"/>`;
    yerler.forEach(([ad, x, y, h]) => { ic += `<circle class="g-d" cx="${x}" cy="${y}" r="6"/>` + G.yazi(x + 12, y + 5, harf ? h : ad, { a: "start", b: 1 }); });
    ic += G.yazi(300, 418, "Şematik çizim; uzaklıklar ölçekli değildir." + (yol ? " Kesikli çizgi: hicret yolu" : ""), { k: 1 });
    return G.svg(560, 428, ic, etiket || "Hicaz bölgesi şematik haritası");
  }

  /* =============================== EK ÜNİTE: PEYGAMBERİMİZ HZ. MUHAMMED'İN (SAV) HAYATI =============================== */

  KONU_EKLE("din", {
    id: "d_hz_peygamberlik", tema: "d6", ad: "Peygamberliğin Başlaması ve İlk Vahiy",
    kazanimlar: [
      { id: "dhzp.vahiy", ad: "İlk vahyin gelişini ve peygamberliğin başlamasını açıklama" },
      { id: "dhzp.ilk", ad: "İlk Müslümanları tanıma ve onların özelliklerini yorumlama" },
      { id: "dhzp.davet", ad: "Gizli ve açık davet dönemlerini karşılaştırma" },
    ],
    anlatim: [
      { baslik: "Hira'dan gelen ilk mesaj",
        metin: "4. ünitede Hz. Muhammed'in (sav) gençlik yıllarında Nur Dağı'ndaki <b>Hira Mağarası</b>'na çekilip tefekkür ettiğini öğrenmiştik. <b>610 yılında, Ramazan ayında</b>, o 40 yaşındayken vahiy meleği <b>Cebrail</b> Hira'da ona geldi ve ilk ayetleri getirdi.<br>İlk inen ayetler <b>Alak suresinin ilk beş ayetidir</b> ve “Oku!” emriyle başlar. Böylece Hz. Muhammed'in (sav) <b>peygamberliği başlamış</b> oldu.<br>Kur'an'ın indirilmeye başladığı bu gece <b>Kadir gecesi</b>dir.",
        ornek: "Kur'an'ın ilk emrinin “Oku!” olması, okumanın, öğrenmenin ve bilginin İslam'da ne kadar değerli olduğunu gösterir.",
        gorsel: zaman([["571", "Doğumu"], ["595", "Hz. Hatice ile|evliliği"], ["610", "İlk vahiy|(40 yaşında)"], ["622", "Hicret"]], "Hz. Muhammed'in (sav) hayatından tarihler"),
        durak: { soru: "İlk vahiy hangi ayda gelmiştir?", secenekler: [
          ["Ramazan", true, "İlk vahiy 610 yılında Ramazan ayında, Kadir gecesinde gelmiştir."],
          ["Muharrem", false, "Muharrem hicri yılın ilk ayıdır; ilk vahiy Ramazan ayında gelmiştir."],
          ["Zilhicce", false, "Zilhicce hac ayıdır; ilk vahiy bu ayda gelmemiştir."],
          ["Rebiülevvel", false, "Rebiülevvel, Hz. Muhammed'in (sav) doğduğu aydır; ilk vahiy Ramazan'da gelmiştir."]] } },
      { baslik: "Hz. Hatice'nin desteği",
        metin: "İlk vahyin ağırlığı karşısında heyecanlanan Hz. Muhammed (sav) evine döndü ve eşi <b>Hz. Hatice</b>'ye yaşadıklarını anlattı. Hz. Hatice onu sakinleştirdi; akrabalarını gözettiğini, doğru sözlü olduğunu, yoksullara ve zor durumdakilere yardım ettiğini hatırlatarak Allah'ın onu asla mahcup etmeyeceğini söyledi.<br>Sonra onu, önceki ilahi kitapları bilen amcasının oğlu <b>Varaka bin Nevfel</b>'e götürdü. Varaka, gelen meleğin Hz. Musa'ya da gelen vahiy meleği olduğunu söyledi.",
        ornek: "Zor bir anda yanımızdaki kişinin bizi dinlemesi ve güzel yönlerimizi hatırlatması bize güç verir. Hz. Hatice de eşine böyle destek olmuştur.",
        durak: { soru: "Hz. Hatice, ilk vahiyden sonra eşini teselli ederken en çok neyi hatırlatmıştır?", secenekler: [
          ["Onun güzel ahlakını ve iyiliklerini", true, "Hz. Hatice onun doğruluğunu, akrabalarını gözetmesini ve yardımseverliğini hatırlatmıştır."],
          ["Onun zenginliğini", false, "Hz. Hatice mal varlığından değil, güzel ahlakından söz etmiştir."],
          ["Onun kabilesinin gücünü", false, "Teselli, kabile gücüne değil güzel ahlaka dayanıyordu."],
          ["Onun ticaretteki başarısını", false, "Ticaret başarısı değil, iyilikleri ve doğruluğu hatırlatılmıştır."]] } },
      { baslik: "İlk Müslümanlar",
        metin: "Hz. Muhammed'e (sav) ilk inananlar onu en yakından tanıyan kişilerdi:<br><b>Hz. Hatice:</b> İlk Müslüman ve kadınlardan ilk inanan.<br><b>Hz. Ebû Bekir:</b> Yetişkin erkeklerden ilk inanan; yakın dostu.<br><b>Hz. Ali:</b> Çocuklardan ilk inanan; amcası Ebû Tâlib'in oğlu.<br><b>Zeyd bin Hârise:</b> Azatlılardan ilk inanan; Hz. Peygamber'in evlatlığı.<br>Hz. Ebû Bekir'in anlatmasıyla Hz. Osman, Abdurrahman bin Avf, Talha, Zübeyr ve Sa'd bin Ebû Vakkas da Müslüman oldu.",
        ornek: "Bir insanı en iyi, onunla aynı evde yaşayanlar ve en yakın dostları tanır. Hz. Muhammed'e (sav) ilk inananların yakınları olması, onun dürüstlüğüne duyulan güveni gösterir.",
        gorsel: G.tablo(["Grup", "İlk inanan"], [["Kadınlardan", "Hz. Hatice"], ["Yetişkin erkeklerden", "Hz. Ebû Bekir"], ["Çocuklardan", "Hz. Ali"], ["Azatlılardan", "Zeyd bin Hârise"]]),
        durak: { soru: "Çocuklardan ilk Müslüman olan kimdir?", secenekler: [
          ["Hz. Ali", true, "Hz. Ali, çocuk yaşta Müslüman olmuştur."],
          ["Hz. Ebû Bekir", false, "Hz. Ebû Bekir yetişkin erkeklerden ilk inanandır."],
          ["Zeyd bin Hârise", false, "Zeyd bin Hârise azatlılardan ilk inanandır."],
          ["Hz. Osman", false, "Hz. Osman, Hz. Ebû Bekir'in anlatmasıyla daha sonra Müslüman olmuştur."]] } },
      { baslik: "Gizli davet: Dârülerkam",
        metin: "Peygamberliğin ilk yıllarında Hz. Muhammed (sav) İslam'ı yalnızca güvendiği kişilere anlattı. Bu döneme <b>gizli davet</b> denir ve yaklaşık <b>üç yıl</b> sürdü.<br>Müslümanlar, Safa tepesinin yakınındaki <b>Erkam bin Ebü'l-Erkam'ın evinde</b> toplanıp Kur'an öğrendiler. Bu eve <b>Dârülerkam</b> (Erkam'ın evi) denir; İslam'ın ilk eğitim merkezi sayılır.<br>Müslümanların sayısı azdı; putperest Mekkelilerin tepkisi düşünülerek tedbirli davranıldı.",
        ornek: "Yeni bir fidan önce rüzgârdan korunur, kökleri güçlenince açık alana dikilir. Gizli davet de inananların önce güçlenmesini sağlamıştır.",
        durak: { soru: "Gizli davet döneminde Müslümanların toplanıp Kur'an öğrendiği yer neresidir?", secenekler: [
          ["Dârülerkam", true, "Erkam'ın evi (Dârülerkam) ilk eğitim ve buluşma merkezidir."],
          ["Dârünnedve", false, "Dârünnedve, Mekke ileri gelenlerinin toplantı yeridir."],
          ["Mescid-i Nebevi", false, "Mescid-i Nebevi hicretten sonra Medine'de yapılmıştır."],
          ["Kuba Mescidi", false, "Kuba Mescidi hicret sırasında Medine yakınında yapılmıştır."]] } },
      { baslik: "Açık davet",
        metin: "Yaklaşık üç yıl sonra “<b>En yakın akrabanı uyar.</b>” (Şuarâ suresi, 214. ayet) ayeti indi ve <b>açık davet</b> başladı. Hz. Muhammed (sav) önce yakın akrabalarını yemeğe çağırıp onlara İslam'ı anlattı.<br>Sonra <b>Safa tepesine</b> çıkıp Mekkelilere seslendi: “Size şu dağın ardında düşman var desem bana inanır mısınız?” Onlar “Evet, senden hiç yalan duymadık.” dediler. Bunun üzerine onları tek olan Allah'a inanmaya çağırdı.<br>Açık davetle birlikte Mekke'nin ileri gelenlerinden tepkiler de başladı.",
        ornek: "Hz. Muhammed (sav) daveti, Mekkelilerin kendi ağızlarından onun dürüstlüğünü onaylatarak başlatmıştır. Güvenilir olmak, söylenen sözün dinlenmesini sağlar.",
        durak: { soru: "Açık davette Hz. Muhammed'in (sav) ilk olarak kimleri İslam'a çağırması emredilmiştir?", secenekler: [
          ["En yakın akrabalarını", true, "Şuarâ suresi 214. ayette “En yakın akrabanı uyar.” buyrulmuştur."],
          ["Medinelileri", false, "Medinelilerle tanışma çok sonra, hac mevsimlerinde olmuştur."],
          ["Komşu ülkelerin hükümdarlarını", false, "Hükümdarlara mektuplar Hudeybiye Antlaşması'ndan sonra gönderilmiştir."],
          ["Yalnızca köleleri", false, "Davet herkese yönelikti; ilk emir yakın akrabalarla ilgilidir."]] } },
    ],
    uret: {
      "dhzp.vahiy": [
        D("dhzp.vahiy", "hatirlama", 1, "Zaman şeridinde soru işaretiyle gösterilen olay olan <b>ilk vahiy</b> hangi yıl gelmiştir?", "610",
          [["571", "kavrama", "571, Hz. Muhammed'in (sav) doğduğu yıldır; ilk vahiy 40 yaşındayken gelmiştir."], ["622", "bilgi", "622 hicret yılıdır; ilk vahiyden on yılı aşkın bir süre sonradır."], ["632", "bilgi", "632, Vedâ Haccı'nın ve Hz. Peygamber'in vefatının yılıdır."]],
          "Şeritte soru işaretinin hangi iki olayın arasında olduğuna bak; hicretten birkaç yıl değil, on yılı aşkın bir süre önceyi düşün.",
          C("Şeritteki “?” ile gösterilen ilk vahyin yılı soruluyor.", "Hz. Muhammed (sav) 571'de doğdu; ilk vahiy geldiğinde 40 yaşındaydı.",
            ["Şeritte “?” işareti doğum (571) ile hicret (622) arasında yer alıyor.", "İlk vahiy, Mekke döneminin başlangıcıdır; hicretten (622) on iki yıl önceye gidersek 610'u buluruz."],
            "İlk vahiy 610 yılında gelmiştir.", "Kontrol edelim: Yaygın kabul gören tarihlere göre ilk vahiy 610, hicret 622; aradaki dönem Mekke dönemidir."),
          "İlk vahiy: 610 yılı, Ramazan ayı, Hira Mağarası, 40 yaş.", "Yaygın kabul gören bilgiye göre ilk vahiy 610 yılında gelmiştir.",
          zaman([["571", "Doğumu"], ["?", "İlk vahiy"], ["622", "Hicret"], ["632", "Vefatı"]], "Hz. Muhammed'in (sav) hayatından olaylar")),
        D("dhzp.vahiy", "hatirlama", 1, "İlk vahyi Hz. Muhammed'e (sav) getiren melek hangisidir?", "Cebrail",
          [["Mikail", "bilgi", "Mikail tabiat olaylarıyla görevli melektir; vahiy meleği Cebrail'dir."], ["İsrafil", "bilgi", "İsrafil, kıyametin kopması ve yeniden dirilişle ilgili sura üfleyecek melektir."], ["Azrail", "bilgi", "Azrail ölüm meleğidir; vahyi getiren Cebrail'dir."]],
          "Vahiy meleği olarak bilinen meleği düşün.",
          C("İlk vahyi getiren melek soruluyor.", "Allah'ın mesajlarını peygamberlere getiren meleğe vahiy meleği denir; bu melek Cebrail'dir.",
            ["Diğer büyük meleklerin görevleri farklıdır: Mikail tabiat olayları, İsrafil sur, Azrail ölüm.", "Hira'da Hz. Muhammed'e (sav) gelen melek Cebrail'dir."],
            "Cebrail.", "Bir dahaki sefere: “vahiy” sözcüğünü görünce Cebrail'i hatırla."),
          "Cebrail: vahiy meleği; Allah'ın mesajlarını peygamberlere getirir.", "Allah'ın mesajlarını peygamberlere getiren melek Cebrail'dir."),
        D("dhzp.vahiy", "aciklama", 2, "İlk inen ayetlerin “<b>Oku!</b>” emriyle başlaması aşağıdakilerden hangisini en iyi gösterir?", "İslam'ın okumaya, öğrenmeye ve bilgiye önem verdiğini",
          [["Yalnızca okuma bilenlerin Müslüman olabileceğini", "kavrama", "İslam herkese yöneliktir; ayet okuma bilmeyenleri dışlamaz, öğrenmeye teşvik eder."], ["Kur'an'ın yalnızca sesli okunması gerektiğini", "kavrama", "“Oku!” emri, öğrenmenin ve bilginin değerine dikkat çeker; okuma biçimi kuralı değildir."], ["İbadetlerin yalnızca okumaktan ibaret olduğunu", "kavrama", "İbadetler namaz, oruç gibi pek çok şeyi kapsar; ayetin vurgusu bilgidir."]],
          "İlk emrin ne olduğunu ve ayetlerde kalemden söz edildiğini düşün.",
          C("İlk ayetlerin “Oku!” diye başlamasının neyi gösterdiği soruluyor.", "Alak suresinin ilk beş ayetinde okuma emri, kalemle öğretme ve insana bilmediğini öğretme anlatılır.",
            ["Bir dinin ilk emrinin “Oku!” olması, bilgiye verilen değeri gösterir.", "Ayetlerde kalemden söz edilmesi de yazma ve öğrenmenin önemini vurgular."],
            "İslam okumaya, öğrenmeye ve bilgiye önem verir.", "Kontrol edelim: Seçeneklerden yalnızca biri “öğrenme” fikrini taşıyor; diğerleri ayetten çıkarılamaz."),
          "İlk emir “Oku!”: İslam'da bilgi ve öğrenme çok değerlidir.", "İlk emrin “Oku!” olması ve kalemle öğretmenin anılması bilgiye verilen önemi gösterir."),
        D("dhzp.vahiy", "uygulama", 2, "Aşağıdaki bilgi kartında hangi olay anlatılmaktadır?", "İlk vahyin gelişi",
          [["Hicret", "bilgi", "Hicret 622'de Mekke'den Medine'ye yapılan göçtür; kartta mağara Hira'dır, Sevr değil."], ["Mekke'nin fethi", "bilgi", "Mekke'nin fethi 630 yılında olmuştur; kartta 40 yaş ve Alak suresi var."], ["Vedâ Hutbesi", "bilgi", "Vedâ Hutbesi 632'de Arafat'ta okunmuştur."]],
          "Karttaki yer, yaş ve sure ipuçlarını birleştir.",
          C("Kartta verilen ipuçlarıyla hangi olayın anlatıldığı soruluyor.", "İlk vahiy 610'da, Ramazan ayında, Hira Mağarası'nda, 40 yaşında gelmiş; ilk ayetler Alak suresindendir.",
            ["Yer: Hira Mağarası → ilk vahiy.", "Yaş: 40, sure: Alak 1–5 → peygamberliğin başlangıcı."],
            "Kartta ilk vahyin gelişi anlatılıyor.", "Kontrol edelim: Sevr Mağarası hicretle, Arafat Vedâ Hutbesi ile ilgilidir; kartta bunlar yok."),
          "Hira + 40 yaş + Alak suresi = ilk vahiy.", "Hira Mağarası, 40 yaş, Ramazan ayı ve Alak suresi bilgileri ilk vahyi gösterir.",
          kart("Bilgi kartı", ["📍 Yer: Nur Dağı, Hira Mağarası", "🌙 Ay: Ramazan (Kadir gecesi)", "🎂 Yaş: 40", "📖 İnen ayetler: Alak suresi 1–5. ayetler"], "olay bilgi kartı")),
        D("dhzp.vahiy", "transfer", 3, "İlk vahiyden sonra heyecanla eve dönen Hz. Muhammed'i (sav) eşi Hz. Hatice dinledi, sakinleştirdi ve onun iyiliklerini hatırlattı.<br><b>Bu olaydan günlük hayatımız için çıkarılabilecek en uygun ders hangisidir?</b>", "Zor anlarında yakınlarımızı dinleyip onlara destek olmalıyız.",
          [["Heyecanlanan birini yalnız bırakmalıyız.", "kavrama", "Olayda Hz. Hatice eşini yalnız bırakmamış, yanında olmuştur."], ["Yaşadıklarımızı kimseye anlatmamalıyız.", "kavrama", "Hz. Muhammed (sav) yaşadıklarını eşine anlatmış ve destek görmüştür."], ["Sadece iyi günlerde arkadaşlarımızın yanında olmalıyız.", "kavrama", "Hz. Hatice'nin tutumu, asıl zor günlerde destek olmanın önemini gösterir."]],
          "Hz. Hatice'nin davranışını tek cümleyle özetle.",
          C("Olaydan çıkarılacak ders soruluyor.", "Hz. Hatice eşini dinlemiş, sakinleştirmiş ve güzel yönlerini hatırlatarak ona güç vermiştir.",
            ["Bu davranış dinlemeyi, teselli etmeyi ve destek olmayı içerir.", "Günlük hayatta da zorlanan bir arkadaşımızı ya da aile bireyimizi dinleyip destek olabiliriz."],
            "Zor anlarında yakınlarımızı dinleyip onlara destek olmalıyız.", "Kontrol edelim: Diğer seçenekler Hz. Hatice'nin davranışının tam tersini söylüyor."),
          "Zor günde destek olmak, gerçek dostluğun ve sevginin göstergesidir.", "Hz. Hatice'nin eşini dinleyip teselli etmesi, zor anda destek olmanın önemini gösterir."),
        D("dhzp.vahiy", "baglanti", 2, "Bakara suresi 185. ayette “Ramazan ayı, insanlara yol gösterici olarak Kur'an'ın indirildiği aydır.” buyrulur.<br><b>Bu ayet, ilk vahiyle ilgili hangi bilgiyi destekler?</b>", "Kur'an'ın indirilmeye Ramazan ayında başlandığını",
          [["İlk vahyin Medine'de geldiğini", "bilgi", "İlk vahiy Mekke yakınlarındaki Hira Mağarası'nda gelmiştir."], ["Kur'an'ın tamamının bir gecede indiğini", "kavrama", "Kur'an'ın inişi Ramazan'da başlamış, yaklaşık 23 yıl sürmüştür."], ["Orucun ilk vahiyle birlikte farz kılındığını", "bilgi", "Ramazan orucu hicretten sonra, Medine'de farz kılınmıştır."]],
          "2. ünitede Ramazan ayı ile Kur'an arasındaki ilişkiyi hatırla.",
          C("Ayetin ilk vahiyle ilgili hangi bilgiyi desteklediği soruluyor.", "Ramazan ayı “Kur'an ayı” olarak da bilinir; Kur'an Kadir gecesinde indirilmeye başlamıştır.",
            ["Ayet, Kur'an'ın Ramazan ayında indirildiğini söylüyor.", "İlk vahiy de 610 yılının Ramazan ayında, Kadir gecesinde gelmiştir."],
            "Ayet, Kur'an'ın indirilmeye Ramazan ayında başlandığını destekler.", "Kontrol edelim: Kur'an'ın inişi yaklaşık 23 yılda tamamlanmıştır; yani bir gecede tamamı inmemiştir."),
          "Kur'an'ın inişi Ramazan'da, Kadir gecesinde başladı ve yaklaşık 23 yıl sürdü.", "Bakara 185 Ramazan'ı Kur'an'ın indirildiği ay olarak tanıtır; ilk vahiy de Ramazan'da gelmiştir."),
      ],
      "dhzp.ilk": [
        D("dhzp.ilk", "hatirlama", 1, "Hz. Muhammed'e (sav) ilk inanan kişi kimdir?", "Hz. Hatice",
          [["Hz. Ebû Bekir", "dikkat", "Hz. Ebû Bekir yetişkin erkeklerden ilk inanandır; ilk inanan kişi ise Hz. Hatice'dir."], ["Hz. Ali", "dikkat", "Hz. Ali çocuklardan ilk inanandır."], ["Hz. Ömer", "bilgi", "Hz. Ömer daha sonraki yıllarda Müslüman olmuştur."]],
          "İlk vahiyden sonra Hz. Peygamber'i evde karşılayan kişiyi düşün.",
          C("İlk Müslüman soruluyor.", "İlk vahiyden sonra Hz. Peygamber'i dinleyip ona hemen inanan eşi Hz. Hatice'dir.",
            ["Hz. Ebû Bekir, Hz. Ali ve Zeyd bin Hârise de ilk inananlardandır ama her biri kendi grubunda ilktir."],
            "İlk Müslüman Hz. Hatice'dir.", "Bir dahaki sefere: “ilk inanan” sorusunda grup belirtilmemişse cevap Hz. Hatice'dir."),
          "İlk Müslüman: Hz. Hatice.", "Hz. Hatice, ilk vahiyden hemen sonra Hz. Peygamber'e inanan ilk kişidir."),
        D("dhzp.ilk", "uygulama", 1, "Tabloda soru işareti yerine hangisi gelmelidir?", "Hz. Ebû Bekir",
          [["Hz. Ömer", "bilgi", "Hz. Ömer, peygamberliğin ilerleyen yıllarında Müslüman olmuştur."], ["Hz. Hamza", "bilgi", "Hz. Hamza, açık davet döneminde Müslüman olmuştur; ilk inanan yetişkin erkek değildir."], ["Hz. Osman", "bilgi", "Hz. Osman, Hz. Ebû Bekir'in anlatmasıyla Müslüman olmuştur."]],
          "Hz. Peygamber'in en yakın dostunu düşün.",
          C("Yetişkin erkeklerden ilk Müslüman olan kişi soruluyor.", "Kadınlardan Hz. Hatice, yetişkin erkeklerden Hz. Ebû Bekir, çocuklardan Hz. Ali, azatlılardan Zeyd bin Hârise ilk inananlardır.",
            ["Tabloda Hz. Hatice, Hz. Ali ve Zeyd bin Hârise yazılı.", "Eksik olan yetişkin erkekler satırıdır."],
            "Soru işareti yerine Hz. Ebû Bekir gelir.", "Kontrol edelim: Hz. Osman, Hz. Ebû Bekir'in anlatmasıyla Müslüman olmuştur; yani ondan sonradır."),
          "İlk inananlar: Hz. Hatice, Hz. Ebû Bekir, Hz. Ali, Zeyd bin Hârise.", "Yetişkin erkeklerden ilk Müslüman olan Hz. Ebû Bekir'dir.",
          G.tablo(["Grup", "İlk inanan"], [["Kadınlardan", "Hz. Hatice"], ["Yetişkin erkeklerden", "?"], ["Çocuklardan", "Hz. Ali"], ["Azatlılardan", "Zeyd bin Hârise"]])),
        D("dhzp.ilk", "aciklama", 2, "Hz. Osman, Abdurrahman bin Avf, Talha, Zübeyr ve Sa'd bin Ebû Vakkas, Hz. Ebû Bekir'in anlatmasıyla Müslüman olmuştur.<br><b>Bu bilgi Hz. Ebû Bekir hakkında neyi gösterir?</b>", "İslam'ı çevresine anlatarak davete katkı sağladığını",
          [["Peygamber olduğunu", "kavrama", "Hz. Ebû Bekir peygamber değil, Hz. Peygamber'in yakın dostu ve sahabesidir."], ["Müslümanların ilk halifesi seçildiğini", "dikkat", "Hz. Ebû Bekir halife olmuştur ama bu çok sonra, Hz. Peygamber'in vefatından sonradır; bilgi bunu göstermez."], ["Bu kişilerle ticaret yaptığını", "dikkat", "Bilgi, ticaretten değil İslam'ı anlatmasından söz ediyor."]],
          "Hz. Ebû Bekir'in bu kişilerin Müslüman olmasındaki rolünü düşün.",
          C("Bilginin Hz. Ebû Bekir hakkında neyi gösterdiği soruluyor.", "Hz. Ebû Bekir, Müslüman olduktan sonra güvendiği kişilere İslam'ı anlatmıştır.",
            ["Onun anlatmasıyla beş önemli sahabe Müslüman olmuştur.", "Bu, onun davete etkin biçimde katkı sağladığını gösterir."],
            "Hz. Ebû Bekir İslam'ı çevresine anlatarak davete katkı sağlamıştır.", "Kontrol edelim: Bilgide halifelik ya da ticaret değil, kişilerin onun anlatmasıyla Müslüman olması var."),
          "Hz. Ebû Bekir, gizli davet döneminde İslam'ın yayılmasına önemli katkı sağlamıştır.", "Beş önemli sahabenin onun anlatmasıyla Müslüman olması, davete katkısını gösterir."),
        D("dhzp.ilk", "aciklama", 2, "İlk Müslümanların çoğu Hz. Muhammed'i (sav) yıllardır yakından tanıyan kişilerdi.<br><b>Bu durum en çok neyi gösterir?</b>", "Onu en iyi tanıyanların onun dürüstlüğüne güvendiğini",
          [["Onun yalnızca akrabalarını sevdiğini", "kavrama", "Davet herkese yönelikti; yakınların önce inanması onu iyi tanımalarındandır."], ["Mekke'de başka insan olmadığını", "dikkat", "Mekke kalabalık bir şehirdi; ilk inananların yakınlar olması güvenle ilgilidir."], ["İnanmanın zorunlu tutulduğunu", "kavrama", "İslam'da inanç zorla olmaz; ilk Müslümanlar kendi istekleriyle inandılar."]],
          "Bir insanı en iyi kimlerin tanıdığını düşün.",
          C("İlk Müslümanların yakın çevreden olmasının neyi gösterdiği soruluyor.", "Hz. Muhammed (sav) peygamberliğinden önce de “el-Emin” (güvenilir) diye anılırdı.",
            ["Onu evde, ticarette ve dostlukta tanıyanlar hiç yalan söylemediğini biliyordu.", "Bu yüzden peygamberliğini duyunca ona hemen inandılar."],
            "Onu en iyi tanıyanlar onun dürüstlüğüne güveniyordu.", "Kontrol edelim: 4. ünitede öğrendiğimiz “el-Emin” lakabı da bu güveni destekler."),
          "Güvenilir olmak, sözümüzün dinlenmesini sağlar.", "Yakın çevresinin ona ilk inanan olması, dürüstlüğüne duyulan güveni gösterir."),
        D("dhzp.ilk", "transfer", 3, "İlk Müslümanlarla ilgili şu yargılar veriliyor:<br>I. Farklı yaşlardan ve farklı toplumsal kesimlerden kişilerdi.<br>II. Hepsi Mekke'nin en zengin ve en güçlü kişileriydi.<br>III. Hz. Muhammed'i (sav) yakından tanıyan kişilerdi.<br><b>Bu yargılardan hangileri doğrudur?</b>", "I ve III",
          [["Yalnız II", "bilgi", "İlk Müslümanların arasında çocuk (Hz. Ali) ve azatlı (Zeyd) da vardı; hepsi zengin değildi."], ["I ve II", "dikkat", "I doğru ama II yanlıştır; ilk Müslümanların hepsi zengin ve güçlü değildi."], ["II ve III", "dikkat", "III doğru ama II yanlıştır."]],
          "Hz. Hatice, Hz. Ebû Bekir, Hz. Ali ve Zeyd bin Hârise'nin yaşlarını ve durumlarını karşılaştır.",
          C("İlk Müslümanlarla ilgili doğru yargılar soruluyor.", "İlk inananlar: Hz. Hatice (kadın), Hz. Ebû Bekir (yetişkin tüccar), Hz. Ali (çocuk), Zeyd bin Hârise (azatlı).",
            ["I: Çocuk, yetişkin, kadın, azatlı… → farklı yaş ve kesimler. Doğru.", "II: Çocuk ve azatlı olanlar varken “hepsi en zengin” denemez. Yanlış.", "III: Hepsi onun eşi, dostu, yeğeni ya da evlatlığıydı. Doğru."],
            "Doğru yargılar I ve III'tür.", "Kontrol edelim: İslam'ın ilk günden toplumun her kesimine ulaştığını görüyoruz."),
          "İslam ilk günden kadın-erkek, çocuk-yetişkin, köle-hür herkese ulaşmıştır.", "İlk Müslümanlar farklı yaş ve kesimlerdendi ve hepsi Hz. Peygamber'i yakından tanıyordu."),
        D("dhzp.ilk", "baglanti", 2, "Konuşma balonundaki sözler hangi sahabeye aittir?", "Zeyd bin Hârise",
          [["Hz. Ali", "dikkat", "Hz. Ali, amcası Ebû Tâlib'in oğludur; köle olarak satılmamıştır."], ["Bilal-i Habeşî", "bilgi", "Bilal de köleydi ama onu Hz. Ebû Bekir satın alıp azat etmiştir; Hz. Peygamber'in evlatlığı değildir."], ["Hz. Ebû Bekir", "bilgi", "Hz. Ebû Bekir hür bir tüccardı; evlatlık değildir."]],
          "4. ünitede “Hira'da tefekkür” bölümünde Hz. Peygamber'in evlat edindiği kişiyi hatırla.",
          C("Balondaki kişinin kim olduğu soruluyor.", "Hz. Muhammed (sav), köle olarak yanına gelen Zeyd bin Hârise'yi azat edip evlat edinmişti.",
            ["Balonda “köle olarak satıldım”, “azat edip evlat edindi” deniyor.", "Bu, azatlılardan ilk inanan Zeyd bin Hârise'dir."],
            "Sözler Zeyd bin Hârise'ye aittir.", "Kontrol edelim: Bilal'i azat eden Hz. Ebû Bekir'dir; evlat edinilen ise Zeyd'dir."),
          "Zeyd bin Hârise: Hz. Peygamber'in azat edip evlat edindiği, azatlılardan ilk Müslüman.", "Azat edilip evlat edinilen ve azatlılardan ilk inanan kişi Zeyd bin Hârise'dir.",
          balon([["Sahabe", "Küçükken köle olarak satıldım. Hz. Muhammed (sav)|beni azat edip evlat edindi. Babam beni almaya|geldiğinde onun yanında kalmayı seçtim. O peygamber|olunca ona hemen inandım."]], "bir sahabenin konuşma balonu")),
      ],
      "dhzp.davet": [
        D("dhzp.davet", "hatirlama", 1, "Zaman şeridine göre <b>gizli davet</b> dönemi yaklaşık kaç yıl sürmüştür?", "3 yıl",
          [["13 yıl", "kavrama", "13 yıl, ilk vahiyden hicrete kadar süren Mekke döneminin tamamıdır."], ["10 yıl", "bilgi", "10 yıl, hicretten vefata kadar süren Medine dönemidir."], ["1 yıl", "dikkat", "Şeritte ilk vahiyden açık davete kadar “yaklaşık 3 yıl” yazıyor."]],
          "Şeritte ilk vahiy ile açık davet arasındaki süreye bak.",
          C("Gizli davetin süresi soruluyor.", "Gizli davet ilk vahiyle başladı, “En yakın akrabanı uyar.” ayeti inince açık davete geçildi.",
            ["Şeride göre ilk vahiy 610'da, açık davet yaklaşık 3 yıl sonra başlıyor.", "Mekke döneminin tamamı ise yaklaşık 13 yıldır; gizli davet bunun ilk bölümüdür."],
            "Gizli davet yaklaşık 3 yıl sürmüştür.", "Kontrol edelim: 3 yıl gizli + yaklaşık 10 yıl açık davet = yaklaşık 13 yıllık Mekke dönemi."),
          "Gizli davet yaklaşık 3 yıl; Mekke dönemi yaklaşık 13 yıl; Medine dönemi yaklaşık 10 yıl.", "İlk vahiyden açık davete kadar geçen gizli davet dönemi yaklaşık 3 yıldır.",
          zaman([["610", "İlk vahiy|gizli davet başlar"], ["+ 3 yıl", "Açık davet|başlar"], ["622", "Hicret"]], "gizli ve açık davet zaman şeridi")),
        D("dhzp.davet", "hatirlama", 1, "Gizli davet döneminde Müslümanların toplanıp Kur'an öğrendiği, İslam'ın ilk eğitim merkezi sayılan ev hangisidir?", "Dârülerkam",
          [["Dârünnedve", "bilgi", "Dârünnedve, Mekke'nin ileri gelenlerinin toplantı yeriydi; Müslümanların buluşma yeri değildi."], ["Suffe", "bilgi", "Suffe, Medine'de Mescid-i Nebevi'nin yanındaki eğitim yeridir."], ["Kuba Mescidi", "bilgi", "Kuba Mescidi hicret sırasında Medine yakınında yapılmıştır."]],
          "Evin adı, sahibinin adından gelir.",
          C("Gizli davet döneminin eğitim merkezi soruluyor.", "Müslümanlar Safa tepesinin yakınındaki Erkam bin Ebü'l-Erkam'ın evinde toplanırdı.",
            ["“Dâr” ev demektir; Dârülerkam “Erkam'ın evi” anlamına gelir.", "Suffe ve Kuba Mescidi Medine dönemine aittir."],
            "Dârülerkam.", "Bir dahaki sefere: Mekke'de ilk eğitim yeri Dârülerkam, Medine'de Suffe."),
          "Mekke'de ilk eğitim yeri: Dârülerkam. Medine'de: Suffe.", "Gizli davet döneminde Müslümanlar Erkam'ın evinde, yani Dârülerkam'da toplanıyordu."),
        D("dhzp.davet", "aciklama", 2, "Açık davetin başlamasıyla ilgili “<b>En yakın akrabanı uyar.</b>” (Şuarâ suresi, 214. ayet) ayeti inince Hz. Muhammed (sav) ne yapmıştır?", "Yakın akrabalarını yemeğe çağırıp onlara İslam'ı anlatmıştır.",
          [["Medine'ye hicret etmiştir.", "bilgi", "Hicret açık davetten yaklaşık 10 yıl sonra, 622'de olmuştur."], ["Hükümdarlara mektup göndermiştir.", "bilgi", "Mektuplar Hudeybiye Antlaşması'ndan (628) sonra gönderilmiştir."], ["Daveti bırakıp Hira'ya çekilmiştir.", "kavrama", "Ayet daveti genişletmeyi emrediyordu; Hz. Peygamber daveti bırakmamıştır."]],
          "Ayetteki “akraba” sözcüğüne dikkat et.",
          C("Ayet inince Hz. Peygamber'in ne yaptığı soruluyor.", "Ayet açıkça yakın akrabaların uyarılmasını emreder.",
            ["Hz. Peygamber, Haşimoğulları'ndan akrabalarını yemeğe davet etti.", "Yemekte onlara İslam'ı anlattı ve onları tek Allah'a inanmaya çağırdı."],
            "Yakın akrabalarını yemeğe çağırıp onlara İslam'ı anlatmıştır.", "Kontrol edelim: Ardından Safa tepesinden bütün Mekkelilere seslenmiştir."),
          "Açık davet: önce yakın akrabalar, sonra bütün Mekkeliler.", "Ayetin emri üzerine Hz. Peygamber önce yakın akrabalarını İslam'a davet etmiştir."),
        D("dhzp.davet", "uygulama", 2, "Safa tepesinde geçen konuşmada Hz. Muhammed (sav) bu soruyu sorarak en çok neyi hatırlatmak istemiştir?", "Hiç yalan söylemediğini ve güvenilir biri olduğunu",
          [["Mekke'ye gerçekten düşman saldıracağını", "kavrama", "Soru bir örnekti; amaç Mekkelilere onun dürüstlüğünü kendi ağızlarından söyletmekti."], ["Safa tepesinin çok yüksek olduğunu", "dikkat", "Konuşmada tepenin yüksekliği değil, onun sözüne güven konu ediliyor."], ["Mekkelilerin savaşa hazırlanması gerektiğini", "kavrama", "Hz. Peygamber savaşa değil, tek olan Allah'a inanmaya çağırmıştır."]],
          "Mekkelilerin verdiği cevaba dikkat et.",
          C("Safa'daki sorunun amacı soruluyor.", "Hz. Muhammed (sav) peygamberlikten önce de “el-Emin” (güvenilir) diye anılırdı.",
            ["Mekkeliler “Evet, senden hiç yalan duymadık.” diye cevap verdi.", "Böylece onun dürüstlüğünü kendileri onaylamış oldular; ardından o, onları Allah'a inanmaya çağırdı."],
            "Hiç yalan söylemediğini ve güvenilir olduğunu hatırlatmak istemiştir.", "Kontrol edelim: Dürüstlüğü kabul edilen birinin getirdiği haber de ciddiye alınmalıdır."),
          "Güvenilirlik, sözün dinlenmesinin temelidir.", "Mekkelilerin “senden hiç yalan duymadık” demesi, sorunun amacının dürüstlüğünü hatırlatmak olduğunu gösterir.",
          balon([["Hz. Peygamber", "Size şu dağın ardında bir düşman var|desem bana inanır mısınız?"], ["Mekkeliler", "Evet, senden hiç yalan duymadık."]], "Safa tepesindeki konuşma")),
        D("dhzp.davet", "transfer", 3, "Tabloda soru işaretiyle gösterilen yere aşağıdakilerden hangisi yazılmalıdır?", "Yakın akrabalara ve bütün Mekkelilere",
          [["Yalnızca güvenilen birkaç kişiye", "dikkat", "Bu, gizli davetin özelliğidir; tabloda açık davet sütunu soruluyor."], ["Yalnızca Medinelilere", "bilgi", "Açık davet Mekke'de başladı; Medinelilerle tanışma daha sonra hac mevsiminde oldu."], ["Yalnızca çocuklara", "bilgi", "Davet bütün insanlara yönelikti."]],
          "Şuarâ 214 ve Safa tepesi olaylarını düşün.",
          C("Açık davetin kimlere yapıldığı soruluyor.", "Gizli davet güvenilen kişilere, açık davet ise önce akrabalara sonra herkese yapılmıştır.",
            ["Tablonun ikinci satırında açık davet sütunu boş.", "“En yakın akrabanı uyar.” ayetiyle akrabalar, Safa tepesi konuşmasıyla bütün Mekkeliler çağrıldı."],
            "Boşluğa “Yakın akrabalara ve bütün Mekkelilere” yazılmalıdır.", "Kontrol edelim: Satırları sütun başlıklarıyla birlikte oku; gizli ile açık davet birbirinin karşıtıdır."),
          "Gizli davet: güvenilen kişiler, Dârülerkam. Açık davet: akrabalar ve herkes, Safa tepesi.", "Açık davette önce akrabalar, ardından Safa tepesinden bütün Mekkeliler İslam'a çağrılmıştır.",
          G.tablo(["", "Gizli davet", "Açık davet"], [["Süre", "Yaklaşık 3 yıl", "Hicrete kadar"], ["Kimlere?", "Güvenilen kişilere", "?"], ["Nerede?", "Dârülerkam", "Safa tepesi ve herkesin önünde"]])),
        D("dhzp.davet", "transfer", 3, "Elif, okulunda bir geri dönüşüm kulübü kurmak istiyor. Önce fikrine güvenen birkaç arkadaşıyla plan yapıyor, kulüp güçlenince okulun bütününe duyuru yapıyor.<br><b>Elif'in bu yöntemi, Hz. Muhammed'in (sav) davetindeki hangi aşamalarla benzerlik gösterir?</b>", "Önce gizli, sonra açık davet",
          [["Önce hicret, sonra fetih", "kavrama", "Hicret ve fetih, davetin aşamaları değil, sonraki dönemlerin olaylarıdır."], ["Önce açık, sonra gizli davet", "dikkat", "Sıralama ters; Elif önce küçük bir grupla başlıyor, bu gizli davete benzer."], ["Önce Medine, sonra Mekke dönemi", "bilgi", "Önce Mekke dönemi, sonra Medine dönemi yaşanmıştır; ayrıca bu davet yöntemiyle ilgili değildir."]],
          "Elif'in önce kimlerle, sonra kimlerle konuştuğuna bak.",
          C("Elif'in yöntemine benzeyen davet aşamaları soruluyor.", "Davet önce güvenilen kişilerle gizli (yaklaşık 3 yıl), sonra herkese açık yapılmıştır.",
            ["Elif önce güvendiği birkaç kişiyle başladı → gizli davete benzer.", "Grup güçlenince herkese duyurdu → açık davete benzer."],
            "Elif'in yöntemi önce gizli, sonra açık davete benzer.", "Kontrol edelim: Sıralamaya dikkat: küçükten büyüğe, yakından uzağa."),
          "Davet aşamalı yapılmıştır: önce gizli, sonra açık.", "Elif'in önce güvendiği küçük bir grupla başlayıp sonra herkese duyurması, gizli davetten açık davete geçişe benzer."),
      ],
    },
  });

  /* SON */
})();
