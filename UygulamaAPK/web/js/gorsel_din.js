/* Din Kültürü ve Ahlak Bilgisi — görselli ek sorular (zaman şeritleri, tablolar, şemalar, bilgi kartları, takvimler).
 * Saygı ilkesi: Peygamberler ve insan yüzleri çizilmez; görseller yalnızca metin, simge ve şemalardan oluşur.
 * Her sorunun görseli çözüm için gereklidir; görseller yalnızca g-* sınıfları ve basit SVG ile çizilir.
 */
(function () {
  "use strict";
  const { S, Q, G } = OGR;

  /* Çözüm kurucu: 🔎 anla → 💡 hatırla → ✏️ adımlar → ✅ sonuç → 🔁 kontrol */
  const C = (anla, hatirla, adimlar, sonuc, kontrol) =>
    ["🔎 Soruyu anlayalım: " + anla, "💡 Hatırlayalım: " + hatirla].concat(adimlar.map(a => "✏️ " + a), ["✅ Sonuç: " + sonuc, "🔁 Kontrol edelim: " + kontrol]);

  /* ---------- Görsel yardımcıları ---------- */
  const t13 = (x, y, s, o = {}) => `<text class="g-yazi" style="font-size:${o.f || 13}px" x="${x}" y="${y}" text-anchor="${o.a || "middle"}"${o.b ? ' font-weight="700"' : ""}>${s}</text>`;
  const rozet = (x, y, h) => `<circle class="g-b g-cizgi" fill-opacity="0.5" cx="${x}" cy="${y}" r="12"/>` + t13(x, y + 5, h, { b: 1 });
  // Harfli kartlar: [[harf, "satır|satır"], ...]; metin "?" ise sarı vurgulu kart
  function kartlar(liste, { w = 125, h = 70, satir = 4, etiket = "kartlar" } = {}) {
    const W = Math.min(liste.length, satir) * (w + 12) + 12, H = Math.ceil(liste.length / satir) * (h + 12) + 12;
    let ic = "";
    liste.forEach(([harf, metin], i) => {
      const x = 12 + (i % satir) * (w + 12), y = 12 + Math.floor(i / satir) * (h + 12), s = metin.split("|");
      ic += `<rect class="${metin === "?" ? "g-b" : "g-yumusak"} g-cizgi" fill-opacity="0.6" x="${x}" y="${y}" width="${w}" height="${h}" rx="10" stroke-width="1.5"/>`;
      if (harf) ic += rozet(x + 15, y + 15, harf);
      s.forEach((t, j) => { ic += t13(x + w / 2 + (harf ? 8 : 0), y + h / 2 + 5 + (j - (s.length - 1) / 2) * 17, t, { f: metin === "?" ? 24 : 14, b: metin === "?" }); });
    });
    return G.svg(W, H, ic, etiket);
  }
  // Zaman şeridi: [[üst yazı, "alt|alt"], ...]; alt "?" ise kırmızı nokta
  function zaman(olaylar, etiket) {
    const n = olaylar.length, W = 620, H = 175, sol = 75, sag = 545, y = 70, xk = i => sol + i * (sag - sol) / (n - 1);
    let ic = G.ok(20, y, 605, y);
    olaylar.forEach(([t, m], i) => {
      ic += `<circle class="${m === "?" ? "g-d" : "g-a"}" cx="${xk(i)}" cy="${y}" r="9"/>` + G.yazi(xk(i), y - 18, t, { b: 1 });
      String(m).split("|").forEach((s, j) => { ic += t13(xk(i), y + 32 + j * 16, s, { f: m === "?" ? 22 : 13, b: m === "?" }); });
    });
    return G.svg(W, H, ic, etiket || "zaman şeridi");
  }
  // Soldan sağa akış şeması: ["satır|satır", ...]; "?" kutusu sarı
  function akis(kutular, etiket) {
    const n = kutular.length, bw = 130, ara = (620 - n * bw) / (n + 1), H = 120;
    let ic = "";
    kutular.forEach((m, i) => {
      const x = ara + i * (bw + ara), s = m.split("|");
      ic += `<rect class="${m === "?" ? "g-b" : "g-yumusak"} g-cizgi" fill-opacity="0.6" x="${x}" y="20" width="${bw}" height="80" rx="10" stroke-width="1.5"/>` +
        s.map((t, j) => t13(x + bw / 2, 65 + (j - (s.length - 1) / 2) * 17, t, { f: m === "?" ? 26 : 13, b: m === "?" || j === 0 })).join("");
      if (i < n - 1) ic += G.ok(x + bw + 3, 60, x + bw + ara - 3, 60);
    });
    return G.svg(620, H, ic, etiket || "akış şeması");
  }
  // Bilgi kartı: başlık + satırlar
  function bilgiKarti(baslik, satirlar, etiket) {
    const s = satirlar.split("|"), H = 78 + s.length * 26;
    let ic = `<rect class="g-yumusak g-cizgi" x="8" y="8" width="544" height="${H - 16}" rx="12" stroke-width="2"/><rect class="g-b" fill-opacity="0.5" x="9" y="9" width="542" height="42" rx="11"/>` + G.yazi(280, 36, baslik, { b: 1 });
    s.forEach((t, i) => { ic += t13(28, 80 + i * 26, t, { a: "start", f: 15, b: t.includes("?") }); });
    return G.svg(560, H, ic, etiket || "bilgi kartı");
  }

  /* ======================= Peygamber ======================= */
  SORU_EKLE("dpey.ozellik",
    Q("dpey.ozellik", "hatirlama", 2, "Tabloda peygamberlerin ortak özellikleri ve anlamları verilmiştir. “?” ile gösterilen yere hangisi gelmelidir?", "Güvenilir olmak",
      [["Doğru sözlü olmak", "bilgi", "Doğru sözlü olmak “sıdk” özelliğidir; tabloda ayrı satırda yazılıdır."],
       ["Akıllı ve zeki olmak", "bilgi", "Akıllı ve zeki olmak “fetanet” özelliğidir."],
       ["Allah'tan gelen mesajı insanlara iletmek", "bilgi", "Bu “tebliğ” özelliğidir; tabloda ayrıca yer alıyor."]],
      "“Emanet” sözcüğünü düşün: Birine bir şey emanet ederken ondan ne beklersin?",
      C("Tablodaki “emanet” özelliğinin anlamını bulacağız.", "Peygamberlerin ortak özellikleri: sıdk (doğruluk), emanet (güvenilirlik), fetanet (akıllılık), ismet (günahsızlık), tebliğ (mesajı iletme).",
        ["Tabloda sıdk, fetanet, ismet ve tebliğin anlamları yazılı; “?” emanet satırında.", "Emanet, güvenilir olmak demektir. Peygamberler kendilerine bırakılan her şeyi ve vahyi korumuşlardır."],
        "“?” yerine <b>güvenilir olmak</b> gelir.", "Hz. Muhammed'e (sav) gençliğinde “Muhammedü'l-Emin” (güvenilir Muhammed) denmesi de bu özelliği gösterir."),
      { gorsel: G.tablo(["Özellik", "Anlamı"], [["Sıdk", "Doğru sözlü olmak"], ["Emanet", "?"], ["Fetanet", "Akıllı ve zeki olmak"], ["İsmet", "Günah işlemekten korunmuş olmak"], ["Tebliğ", "Allah'tan gelen mesajı insanlara iletmek"]]),
        kural: "Sıdk, emanet, fetanet, ismet, tebliğ: peygamberlerin ortak özellikleri.", dogruNeden: "Emanet, peygamberlerin güvenilir olması demektir." }),
  );
  SORU_EKLE("dpey.gorev",
    Q("dpey.gorev", "aciklama", 2, "Kartlardan hangisi peygamberlerin <b>görevlerinden biri değildir</b>?", "C",
      [["A", "bilgi", "Allah'tan aldıkları vahyi insanlara bildirmek (tebliğ) peygamberlerin temel görevidir."],
       ["B", "bilgi", "Peygamberler güzel ahlakıyla insanlara örnek olmuştur; bu onların görevlerindendir."],
       ["D", "bilgi", "İnsanları Allah'ın birliğine inanmaya çağırmak peygamberlerin ortak görevidir."]],
      "Peygamberler insanlara neyi öğretmek için gönderildi? Zenginlik toplamak bunlardan biri mi?",
      C("Peygamberlerin görevi olmayan kartı bulacağız.", "Peygamberlerin görevleri: vahyi tebliğ etmek, Allah'ın birliğine çağırmak, dini açıklayıp öğretmek, güzel ahlakla örnek olmak.",
        ["A tebliğ ✔, B örnek olmak ✔, D tevhide çağırmak ✔.", "C “Kendileri için mal ve servet biriktirmek” peygamberlerin görevi değildir; onlar dünya malına değil, insanların doğru yolu bulmasına önem vermiştir."],
        "Görev olmayan kart <b>C</b>'dir.", "Peygamberler yaptıkları iş karşılığında insanlardan bir ücret de istememişlerdir."),
      { gorsel: kartlar([["A", "Vahyi insanlara|bildirmek"], ["B", "Güzel ahlakıyla|örnek olmak"], ["C", "Kendileri için|mal ve servet|biriktirmek"], ["D", "Allah'ın birliğine|çağırmak"]], { w: 260, h: 74, satir: 2, etiket: "dört görev kartı" }),
        kural: "Peygamberin görevleri: tebliğ, tevhide çağrı, dini açıklama, örnek olma.", dogruNeden: "Mal ve servet biriktirmek peygamberlerin görevlerinden biri değildir." }),
  );
  SORU_EKLE("dpey.kavram",
    Q("dpey.kavram", "aciklama", 1, "Şemada peygamber gönderilmesinin amaçlarından bazıları verilmiştir. “?” ile gösterilen kutuya hangisi gelmelidir?", "İnsanlara doğru yolu göstermek",
      [["İnsanları birbirine düşürmek", "kavrama", "Peygamberler insanları kardeşliğe ve barışa çağırmıştır; bu amaçla çelişir."],
       ["İnsanların aklını kullanmasını engellemek", "kavrama", "Peygamberler insanları düşünmeye ve aklını kullanmaya davet etmiştir."],
       ["Yalnızca bir kabileye üstünlük sağlamak", "kavrama", "Peygamberlerin mesajı belli bir kabilenin üstünlüğü için değil, insanların iyiliği içindir."]],
      "Öteki üç kutudaki amaçlara benzeyen, onlarla uyumlu olanı seç.",
      C("Şemada eksik kalan amacı bulacağız.", "Allah, insanlara doğru yolu göstermek, onlara Allah'ı tanıtmak ve güzel ahlakı öğretmek için peygamberler göndermiştir.",
        ["Şemadaki amaçlar: Allah'ı tanıtmak, güzel ahlakı öğretmek, iyiliği yaymak.", "Bunlarla uyumlu olan ve peygamberliğin temel amacını özetleyen ifade: insanlara doğru yolu göstermek."],
        "“?” yerine <b>insanlara doğru yolu göstermek</b> gelir.", "Diğer seçenekler peygamberlerin amaçlarının tam tersidir; bu yüzden elenir."),
      { gorsel: G.svg(560, 230,
        [["Allah'ı tanıtmak", 100, 45], ["Güzel ahlakı öğretmek", 460, 45], ["İyiliği yaymak", 100, 185], ["?", 460, 185]].map(([m, x, y]) => `<line class="g-cizgi" x1="280" y1="115" x2="${x}" y2="${y}" stroke-width="2"/>`).join("") +
        `<circle class="g-a" cx="280" cy="115" r="56"/><text class="g-bos" style="font-size:14px" font-weight="700" x="280" y="110" text-anchor="middle">Peygamber</text><text class="g-bos" style="font-size:14px" font-weight="700" x="280" y="128" text-anchor="middle">gönderilmesi</text>` +
        [["Allah'ı tanıtmak", 100, 45], ["Güzel ahlakı öğretmek", 460, 45], ["İyiliği yaymak", 100, 185], ["?", 460, 185]].map(([m, x, y]) => `<rect class="${m === "?" ? "g-b" : "g-yumusak"} g-cizgi" fill-opacity="0.6" x="${x - 88}" y="${y - 24}" width="176" height="48" rx="10" stroke-width="1.5"/>` + t13(x, y + 6, m, { b: 1, f: m === "?" ? 24 : 14 })).join(""), "peygamber gönderilmesinin amaçları şeması"),
        kural: "Peygamberler insanlara doğru yolu göstermek için gönderilmiştir.", dogruNeden: "Peygamber gönderilmesinin temel amacı insanlara doğru yolu göstermektir." }),
  );

  /* ======================= Vahiy ======================= */
  SORU_EKLE("dvah.kavram",
    Q("dvah.kavram", "hatirlama", 1, "Akış şemasında vahyin insanlara ulaşması gösterilmiştir. “?” ile gösterilen kutuya hangisi gelmelidir?", "Vahiy meleği Cebrail",
      [["Mikail", "bilgi", "Mikail, doğa olaylarıyla görevli melektir; vahiy getirmekle görevli değildir."],
       ["Azrail", "bilgi", "Azrail, ölümle görevli melektir."],
       ["İsrafil", "bilgi", "İsrafil, kıyametin kopmasıyla ilgili sura üflemekle görevli melektir."]],
      "Allah'ın mesajını peygamberlere getiren melek hangisidir?",
      C("Vahiy zincirindeki eksik halkayı bulacağız.", "Vahiy, Allah'ın peygamberlerine mesajını bildirmesidir. Vahiy çoğunlukla vahiy meleği Cebrail aracılığıyla gelmiştir.",
        ["Şema: Allah → ? → Peygamber → İnsanlar.", "Allah ile peygamber arasında vahyi taşıyan melek Cebrail'dir."],
        "“?” yerine <b>vahiy meleği Cebrail</b> gelir.", "Dört büyük melekten yalnızca Cebrail vahiy getirmekle görevlidir."),
      { gorsel: akis(["Allah", "?", "Peygamber", "İnsanlar"], "vahyin insanlara ulaşması akış şeması"),
        kural: "Vahiy meleği: Cebrail.", dogruNeden: "Allah'ın mesajını peygamberlere getiren melek Cebrail'dir." }),
  );
  SORU_EKLE("dvah.ilk",
    Q("dvah.ilk", "hatirlama", 2, "Zaman şeridinde Hz. Muhammed'in (sav) hayatından bazı olaylar verilmiştir. “?” ile gösterilen 610 yılındaki olay hangisidir?", "Hira'da ilk vahyin gelmesi",
      [["Mekke'nin fethi", "bilgi", "Mekke 630 yılında fethedilmiştir."],
       ["Hz. Hatice ile evlilik", "bilgi", "Hz. Muhammed (sav), Hz. Hatice ile 595 yılında, 25 yaşındayken evlenmiştir."],
       ["Vedâ Haccı", "bilgi", "Vedâ Haccı 632 yılındadır, vefatından kısa bir süre öncedir."]],
      "Hz. Muhammed (sav) 40 yaşındayken Hira Mağarası'nda ne oldu?",
      C("Şeritteki 610 yılına ait olayı bulacağız.", "Hz. Muhammed (sav) 571'de doğdu. 610 yılında, 40 yaşındayken Hira Mağarası'nda ilk vahiy geldi; Alak suresinin ilk ayetleri indi.",
        ["Şerit: 571 doğum → 610 “?” → 622 hicret → 632 vefat.", "610, ilk vahyin geldiği yıldır."],
        "“?” yerine <b>Hira'da ilk vahyin gelmesi</b> gelir.", "Yaşla kontrol et: 610 − 571 = 39, yani 40 yaşına girmişti. Bilgiyle uyumlu."),
      { gorsel: zaman([["571", "Doğumu"], ["610", "?"], ["622", "Hicret"], ["632", "Vefatı"]], "Hz. Muhammed'in (sav) hayatı zaman şeridi"),
        kural: "610: Hira'da ilk vahiy (Alak suresinin ilk ayetleri).", dogruNeden: "610 yılında Hira Mağarası'nda ilk vahiy gelmiştir." }),
  );
  SORU_EKLE("dvah.rehber",
    Q("dvah.rehber", "transfer", 2, "Kartlarda bazı ayetlerin mesajları ve günlük hayattaki davranışlar verilmiştir. Hangi kartta ayetin mesajı ile davranış <b>uyumlu değildir</b>?", "C",
      [["A", "kavrama", "Ayet ölçü ve tartıda dürüst olmayı emrediyor; pazarcının doğru tartması bu mesaja uygundur."],
       ["B", "kavrama", "Ayet anne babaya iyilik etmeyi öğütlüyor; dedesinin ilacını hatırlatmak buna uygun bir davranıştır."],
       ["D", "kavrama", "Ayet israf etmemeyi öğütlüyor; ışıkları kapatmak bu mesaja uygundur."]],
      "Her kartta mesaj ile davranışı karşılaştır: Davranış mesaja uyuyor mu?",
      C("Vahyin rehberliğine uymayan davranışı bulacağız.", "Vahiy, insanın günlük hayatına rehberlik eder: dürüstlük, anne babaya iyilik, israftan kaçınma, kimseyle alay etmeme gibi.",
        ["A, B ve D'de davranışlar ayetlerin mesajıyla uyumlu.", "C: Mesaj “Birbirinizle alay etmeyin.” ama davranış “arkadaşının kıyafetiyle alay etmek”. Bu mesaja aykırıdır."],
        "Uyumsuz kart <b>C</b>'dir.", "Uygun davranış: Arkadaşının görünüşüyle alay etmemek, onu incitecek söz söylememek."),
      { gorsel: kartlar([["A", "Mesaj: Ölçüyü tam yapın.|Davranış: Pazarcı tartıyı|doğru kullanır."], ["B", "Mesaj: Anne babaya iyilik edin.|Davranış: Dedesinin ilacını|zamanında hatırlatır."], ["C", "Mesaj: Birbirinizle alay etmeyin.|Davranış: Arkadaşının|kıyafetiyle alay eder."], ["D", "Mesaj: İsraf etmeyin.|Davranış: Boş odanın|ışığını kapatır."]], { w: 270, h: 84, satir: 2, etiket: "dört mesaj ve davranış kartı" }),
        kural: "Vahyin mesajları günlük davranışlarımıza yön verir.", dogruNeden: "C kartında alay etmeyi yasaklayan mesaja rağmen arkadaşıyla alay eden bir davranış vardır." }),
  );

  /* ======================= İlahi Kitaplar ======================= */
  SORU_EKLE("dkit.kitap",
    Q("dkit.kitap", "hatirlama", 1, "Tabloda ilahi kitaplar ve gönderildikleri peygamberler verilmiştir. “?” ile gösterilen yere hangisi gelmelidir?", "Hz. Davud",
      [["Hz. Musa", "bilgi", "Hz. Musa'ya Tevrat indirilmiştir; tabloda ilk satırda yer alıyor."],
       ["Hz. İsa", "bilgi", "Hz. İsa'ya İncil indirilmiştir."],
       ["Hz. İbrahim", "bilgi", "Hz. İbrahim'e kitap değil, sayfalar (suhuf) verilmiştir."]],
      "Zebur hangi peygambere indirilmiştir?",
      C("Zebur'un indirildiği peygamberi bulacağız.", "Dört büyük ilahi kitap: Tevrat – Hz. Musa, Zebur – Hz. Davud, İncil – Hz. İsa, Kur'an-ı Kerim – Hz. Muhammed (sav).",
        ["Tabloda Tevrat, İncil ve Kur'an'ın peygamberleri yazılı.", "“?” Zebur satırında; Zebur Hz. Davud'a indirilmiştir."],
        "“?” yerine <b>Hz. Davud</b> gelir.", "Her peygamber tabloda bir kez yer almalı; Hz. Davud dışındakiler zaten başka satırlarda."),
      { gorsel: G.tablo(["İlahi kitap", "Gönderildiği peygamber"], [["📜 Tevrat", "Hz. Musa"], ["📜 Zebur", "?"], ["📜 İncil", "Hz. İsa"], ["📖 Kur'an-ı Kerim", "Hz. Muhammed (sav)"]]),
        kural: "Tevrat–Musa, Zebur–Davud, İncil–İsa, Kur'an–Muhammed (sav).", dogruNeden: "Zebur, Hz. Davud'a indirilen ilahi kitaptır." }),
  );
  SORU_EKLE("dkit.kuran",
    Q("dkit.kuran", "hatirlama", 2, "Kur'an-ı Kerim'i tanıtan bilgi kartında “?” ile gösterilen yere hangisi gelmelidir?", "114",
      [["113", "dikkat", "113, Felak suresinin sıra numarasıdır; Kur'an'daki toplam sure sayısı 114'tür."],
       ["105", "dikkat", "105, Fil suresinin sıra numarasıdır."],
       ["23", "dikkat", "23, Kur'an'ın indirildiği yaklaşık süredir (yıl); sure sayısı değildir."]],
      "Kur'an'ın son suresi Nas suresidir; onun sıra numarası kaçtır?",
      C("Bilgi kartındaki eksik sayıyı bulacağız.", "Kur'an-ı Kerim yaklaşık 23 yılda indirilmiştir; 114 sureden oluşur. İlk suresi Fatiha, son suresi Nas'tır. İlk inen ayetler Alak suresindendir.",
        ["Kartta “sure sayısı: ?” yazıyor; öteki satırlar indiriliş süresi, ilk sure ve ilk inen ayetler.", "Kur'an'da 114 sure vardır."],
        "“?” yerine <b>114</b> gelir.", "Felak 113., Nas 114. suredir. Son surenin numarası toplam sure sayısına eşittir."),
      { gorsel: bilgiKarti("📖 KUR'AN-I KERİM", "• İndirildiği süre: yaklaşık 23 yıl|• Sure sayısı: ?|• Mushaftaki ilk sure: Fatiha|• Mushaftaki son sure: Nas|• İlk inen ayetler: Alak suresinin ilk ayetleri", "Kur'an-ı Kerim bilgi kartı"),
        kural: "Kur'an: 114 sure, yaklaşık 23 yılda indirildi.", dogruNeden: "Kur'an-ı Kerim 114 sureden oluşur." }),
  );
  SORU_EKLE("dkit.mesaj",
    Q("dkit.mesaj", "baglanti", 2, "Şemada dört ilahi kitap ortadaki kutuya bağlanmıştır. Ortadaki kutuya, bu kitapların <b>ortak mesajı</b> olarak hangisi yazılmalıdır?", "Allah'ın bir olduğuna inanmak",
      [["Yalnızca belli bir millete iyilik yapmak", "kavrama", "İlahi kitaplar bütün insanlara iyiliği öğütler; iyiliği bir milletle sınırlamaz."],
       ["Dünya malını her şeyden üstün tutmak", "kavrama", "İlahi kitaplar dünya malına aşırı bağlanmamayı öğütler."],
       ["Her kitabın ayrı bir yaratıcıya inanması", "bilgi", "Bütün ilahi kitaplar aynı kaynaktan, Allah'tan gelmiştir ve tek Allah'a inanmayı öğretir."]],
      "Bütün ilahi kitapların kaynağı kimdir? Hepsinin temel inancı nedir?",
      C("İlahi kitapların ortak mesajını bulacağız.", "İlahi kitapların hepsi Allah'tan gelmiştir. Ortak mesajları: Allah'ın birliğine (tevhid) inanmak, ahirete inanmak, güzel ahlak, adalet ve iyilik.",
        ["Şemada Tevrat, Zebur, İncil ve Kur'an-ı Kerim tek bir merkeze bağlanıyor.", "Hepsinin ortak ve temel mesajı tevhid, yani Allah'ın bir olduğuna inanmaktır."],
        "Ortadaki kutuya <b>Allah'ın bir olduğuna inanmak</b> yazılmalıdır.", "Diğer ortak mesajları da düşün: adaletli olmak, iyilik yapmak, ahirete inanmak."),
      { gorsel: G.svg(560, 230,
        [["Tevrat", 90, 40], ["Zebur", 470, 40], ["İncil", 90, 190], ["Kur'an-ı Kerim", 470, 190]].map(([m, x, y]) => G.ok(x + (x < 280 ? 62 : -62), y + (y < 115 ? 10 : -10), x < 280 ? 196 : 364, y < 115 ? 92 : 138)).join("") +
        [["Tevrat", 90, 40], ["Zebur", 470, 40], ["İncil", 90, 190], ["Kur'an-ı Kerim", 470, 190]].map(([m, x, y]) => `<rect class="g-yumusak g-cizgi" x="${x - 70}" y="${y - 22}" width="140" height="44" rx="10" stroke-width="1.5"/>` + t13(x, y + 5, "📜 " + m, { b: 1, f: 14 })).join("") +
        `<rect class="g-b g-cizgi" fill-opacity="0.5" x="200" y="88" width="160" height="54" rx="12" stroke-width="2"/>` + t13(280, 124, "?", { b: 1, f: 26 }), "dört ilahi kitap ve ortak mesaj şeması"),
        kural: "İlahi kitapların ortak mesajı: tevhid (Allah'ın birliği).", dogruNeden: "Bütün ilahi kitaplar Allah'ın bir olduğuna inanmayı öğretir." }),
  );

  /* ======================= Felak Suresi ======================= */
  SORU_EKLE("dfel.tanit",
    Q("dfel.tanit", "hatirlama", 1, "Felak suresini tanıtan bilgi kartında “?” ile gösterilen yere hangisi gelmelidir?", "Nas",
      [["İhlas", "bilgi", "İhlas suresi Felak'tan önce gelir (112. sure); Muavvizeteyn'in parçası değildir."],
       ["Fil", "bilgi", "Fil suresi 105. suredir; bir sığınma suresi değildir."],
       ["Fatiha", "bilgi", "Fatiha Kur'an'ın ilk suresidir; Muavvizeteyn'den değildir."]],
      "“Muavvizeteyn” iki sığınma suresidir. Felak'tan sonra gelen ve “Kul eûzü” diye başlayan sure hangisi?",
      C("Bilgi kartında eksik kalan sureyi bulacağız.", "Felak suresi 113. suredir ve 5 ayettir. Felak ile Nas surelerine birlikte “Muavvizeteyn” (sığınma sureleri) denir.",
        ["Kartta Felak'ın sıra numarası (113) ve ayet sayısı (5) yazılı.", "“Muavvizeteyn: Felak ve ?” satırındaki eksik sure, 114. sure olan Nas'tır."],
        "“?” yerine <b>Nas</b> gelir.", "İki sure de “Kul eûzü…” (De ki: Sığınırım…) sözleriyle başlar."),
      { gorsel: bilgiKarti("📖 FELAK SURESİ", "• Kur'an'daki sırası: 113. sure|• Ayet sayısı: 5|• Felak: sabah, tan yerinin ağarması|• Muavvizeteyn (sığınma sureleri): Felak ve ?", "Felak suresi bilgi kartı"),
        kural: "Muavvizeteyn = Felak ve Nas sureleri.", dogruNeden: "Felak suresiyle birlikte sığınma surelerini oluşturan sure Nas'tır." }),
  );
  SORU_EKLE("dfel.anlam",
    Q("dfel.anlam", "uygulama", 2, "Tabloda Felak suresinin okunuşu ve anlamı verilmiştir. 5. ayetin anlamı olan “?” yerine hangisi gelmelidir?", "Ve haset ettiği zaman hasetçinin kötülüğünden.",
      [["Karanlığı çöktüğü zaman gecenin kötülüğünden,", "dikkat", "Bu, 3. ayetin (“Ve min şerri ğâsikın izâ vekab.”) anlamıdır."],
       ["Düğümlere üfleyenlerin kötülüğünden,", "dikkat", "Bu, 4. ayetin (“Ve min şerrin neffâsâti fil ukad.”) anlamıdır."],
       ["De ki: Sabahın Rabbine sığınırım,", "dikkat", "Bu, 1. ayetin (“Kul eûzü birabbil felak.”) anlamıdır."]],
      "5. ayetteki “hâsid” ve “hased” sözcüklerine dikkat et.",
      C("Felak suresinin 5. ayetinin anlamını bulacağız.", "Felak suresinde dört kötülükten Allah'a sığınılır: yaratılmışların, gecenin karanlığının, düğümlere üfleyenlerin ve hasetçinin kötülüğü.",
        ["5. ayetin okunuşu: “Ve min şerri hâsidin izâ hased.”", "“Hâsid” haset eden, kıskanan kişi demektir. Anlam: “Ve haset ettiği zaman hasetçinin kötülüğünden.”"],
        "“?” yerine <b>“Ve haset ettiği zaman hasetçinin kötülüğünden.”</b> gelir.", "Seçeneklerdeki öteki anlamlar tablonun 1., 3. ve 4. satırlarına aittir."),
      { gorsel: G.tablo(["Ayet", "Okunuşu", "Anlamı"], [["1", "Kul eûzü birabbil felak.", "De ki: Sabahın Rabbine sığınırım,"], ["2", "Min şerri mâ halak.", "Yarattığı şeylerin kötülüğünden,"], ["3", "Ve min şerri ğâsikın izâ vekab.", "Karanlığı çöktüğü zaman gecenin kötülüğünden,"], ["4", "Ve min şerrin neffâsâti fil ukad.", "Düğümlere üfleyenlerin kötülüğünden,"], ["5", "Ve min şerri hâsidin izâ hased.", "?"]]),
        kural: "Hâsid = haset eden (kıskanç) kişi.", dogruNeden: "5. ayet “Ve haset ettiği zaman hasetçinin kötülüğünden.” anlamına gelir." }),
  );
  SORU_EKLE("dfel.mesaj",
    Q("dfel.mesaj", "baglanti", 2, "Şemada Felak suresinde kötülüğünden Allah'a sığınılan şeyler gösterilmiştir. Bu şemaya göre surenin <b>ana mesajı</b> hangisidir?", "İnsan her türlü kötülükten korunmak için Allah'a sığınmalıdır.",
      [["İnsan yalnızca gündüz olan kötülüklerden korunmalıdır.", "dikkat", "Şemada gecenin karanlığı da var; sure her türlü kötülükten sığınmayı öğretir."],
       ["Haset etmek insana fayda sağlar.", "kavrama", "Surede hasetçinin kötülüğünden Allah'a sığınılır; haset zararlı bir duygudur."],
       ["Kötülüklerden korunmak için hiçbir şey yapılamaz.", "kavrama", "Sure, kötülüklere karşı Allah'a sığınmayı öğreterek güven verir."]],
      "Şemanın ortasında hangi söz var? Etrafındaki kutular neyi anlatıyor?",
      C("Şemadan surenin ana mesajını çıkaracağız.", "Felak suresi “Sığınırım” sözüyle başlar; insanın Allah'a sığınarak kötülüklerden korunmasını öğretir.",
        ["Merkezde “Allah'a sığınırım” var; çevresinde yaratılmışların, gecenin karanlığının, düğümlere üfleyenlerin ve hasetçinin kötülüğü.", "Ortak düşünce: Her türlü kötülüğe karşı Allah'a sığınmak."],
        "Ana mesaj: <b>insan her türlü kötülükten korunmak için Allah'a sığınmalıdır</b>.", "Allah'a sığınmak insana güven ve huzur verir; bu da surenin bize kazandırdığı duygudur."),
      { gorsel: G.svg(560, 230,
        [["Yaratılmışların|kötülüğü", 95, 45], ["Gecenin|karanlığı", 465, 45], ["Düğümlere|üfleyenler", 95, 185], ["Hasetçinin|kötülüğü", 465, 185]].map(([m, x, y]) => `<line class="g-cizgi" x1="280" y1="115" x2="${x}" y2="${y}" stroke-width="2"/>`).join("") +
        `<circle class="g-a" cx="280" cy="115" r="56"/><text class="g-bos" style="font-size:14px" font-weight="700" x="280" y="110" text-anchor="middle">Allah'a</text><text class="g-bos" style="font-size:14px" font-weight="700" x="280" y="128" text-anchor="middle">sığınırım</text>` +
        [["Yaratılmışların|kötülüğü", 95, 45], ["Gecenin|karanlığı", 465, 45], ["Düğümlere|üfleyenler", 95, 185], ["Hasetçinin|kötülüğü", 465, 185]].map(([m, x, y]) => `<rect class="g-yumusak g-cizgi" x="${x - 80}" y="${y - 26}" width="160" height="52" rx="10" stroke-width="1.5"/>` + m.split("|").map((s, j) => t13(x, y - 3 + j * 17, s, { f: 14 })).join("")).join(""), "Felak suresinde sığınılan kötülükler şeması"),
        kural: "Felak suresi: Kötülüklere karşı Allah'a sığınmak.", dogruNeden: "Şemadaki bütün kötülüklere karşı tek sığınak Allah'tır; surenin ana mesajı budur." }),
  );

  /* ======================= Ramazan ve Oruç ======================= */
  SORU_EKLE("dram.ay",
    Q("dram.ay", "hatirlama", 2, "Görselde hicri takvimin aylarından bazıları sırasıyla verilmiştir. “?” ile gösterilen ay hangisidir?", "Ramazan",
      [["Muharrem", "bilgi", "Muharrem hicri yılın ilk ayıdır; Şaban ile Şevval arasında değildir."],
       ["Zilhicce", "bilgi", "Zilhicce hicri yılın son ayıdır; Kurban Bayramı bu aydadır."],
       ["Recep", "dikkat", "Recep, Şaban'dan önce gelir; görselde zaten ilk sırada yer alıyor."]],
      "Ramazan Bayramı Şevval ayının ilk günüdür. Bayramdan önceki ay hangisi?",
      C("Hicri takvimde Şaban ile Şevval arasındaki ayı bulacağız.", "Hicri takvimde aylar Ay'ın hareketine göre belirlenir. Sıra: … Recep, Şaban, Ramazan, Şevval …",
        ["Görsel: Recep → Şaban → ? → Şevval.", "Şaban'dan sonra, Şevval'den önce gelen ay Ramazan'dır."],
        "“?” yerine <b>Ramazan</b> gelir.", "Ramazan ayı biter, Şevval'in ilk günü Ramazan Bayramı başlar. Sıra tutarlı."),
      { gorsel: akis(["🌙 Recep", "🌙 Şaban", "?", "🌙 Şevval"], "hicri aylar sırası"),
        kural: "Recep → Şaban → Ramazan → Şevval.", dogruNeden: "Hicri takvimde Şaban'dan sonra ve Şevval'den önce Ramazan ayı gelir." }),
  );
  SORU_EKLE("dram.kadir",
    Q("dram.kadir", "hatirlama", 2, "Kadir gecesini tanıtan bilgi kartında “?” ile gösterilen yere hangisi gelmelidir?", "Bin aydan daha hayırlıdır.",
      [["Bir haftadan daha uzundur.", "kavrama", "Kadir gecesi bir gecedir; Kadir suresinde değeri “bin aydan hayırlı” diye anlatılır."],
       ["Yalnızca Şevval ayında bulunur.", "bilgi", "Kadir gecesi Ramazan ayındadır; Şevval ayında Ramazan Bayramı vardır."],
       ["Kur'an'ın indirilmesinin tamamlandığı gecedir.", "bilgi", "Kadir gecesi, Kur'an'ın indirilmeye başlandığı gecedir; Kur'an yaklaşık 23 yılda tamamlanmıştır."]],
      "Kadir suresinde bu gecenin değeri kaç aya denk tutulur?",
      C("Kadir gecesinin bilgi kartındaki eksik özelliği bulacağız.", "Kadir gecesi Ramazan ayındadır; Kur'an bu gecede indirilmeye başlamıştır. Kadir suresinde “bin aydan daha hayırlı” olduğu bildirilir.",
        ["Kartta “Ramazan ayındadır” ve “Kur'an bu gece indirilmeye başlamıştır” bilgileri var.", "Eksik özellik, Kadir suresinde geçen “bin aydan daha hayırlıdır” ifadesidir."],
        "“?” yerine <b>bin aydan daha hayırlıdır</b> gelir.", "Bu gece, Ramazan'ın 27. gecesinde ibadet ve dua ile ihya edilir."),
      { gorsel: bilgiKarti("✨ KADİR GECESİ", "• Ramazan ayındadır.|• Kur'an-ı Kerim bu gece indirilmeye başlamıştır.|• ?|• Ülkemizde Ramazan'ın 27. gecesi ihya edilir.", "Kadir gecesi bilgi kartı"),
        kural: "Kadir gecesi bin aydan hayırlıdır.", dogruNeden: "Kadir suresinde bu gecenin bin aydan daha hayırlı olduğu bildirilmiştir." }),
  );
  SORU_EKLE("dram.gelenek",
    Q("dram.gelenek", "uygulama", 1, "Kartlarda Ramazan ayına özgü bazı ibadet ve gelenekler anlatılmıştır. <b>C kartında</b> anlatılan hangisidir?", "Mukabele",
      [["Sahur", "dikkat", "Sahur, imsak vaktinden önce yenen yemektir; A kartında anlatılmıştır."],
       ["Teravih namazı", "dikkat", "Teravih, Ramazan gecelerinde yatsıdan sonra kılınan namazdır; B kartında anlatılmıştır."],
       ["Fitre", "dikkat", "Fitre, bayramdan önce ihtiyaç sahiplerine verilen sadakadır; D kartında anlatılmıştır."]],
      "C kartındaki ipucu: Kur'an'ı baştan sona birlikte takip ederek okumak.",
      C("C kartındaki Ramazan geleneğini bulacağız.", "Ramazan gelenekleri: sahur, iftar, teravih namazı, mukabele, fitre (fıtır sadakası).",
        ["C kartı: “Camilerde bir kişi Kur'an'ı okur, diğerleri kendi mushaflarından takip eder.”", "Karşılıklı okuma ve takip etme anlamına gelen bu gelenek mukabeledir."],
        "C kartında anlatılan: <b>mukabele</b>.", "Mukabele Ramazan boyunca her gün bir cüz okunarak yapılır; ay sonunda Kur'an tamamlanır (hatim)."),
      { gorsel: kartlar([["A", "🌙 İmsak vaktinden önce|yenen yemek"], ["B", "🕌 Ramazan gecelerinde yatsıdan|sonra kılınan namaz"], ["C", "📖 Biri Kur'an'ı okur,|diğerleri mushaftan takip eder"], ["D", "🤲 Bayramdan önce ihtiyaç|sahiplerine verilen sadaka"]], { w: 270, h: 74, satir: 2, etiket: "Ramazan gelenekleri kartları" }),
        kural: "Mukabele: Kur'an'ı karşılıklı okuma ve takip etme.", dogruNeden: "Kur'an'ın bir kişi tarafından okunup diğerlerince takip edilmesine mukabele denir." }),
  );
  SORU_EKLE("doru.tanim",
    Q("doru.tanim", "uygulama", 2, "Şemada Ramazan orucuyla yükümlü olmanın şartları gösterilmiştir. Şemaya göre <b>geçici olarak hasta olan</b> bir kişi ne yapar?", "İyileştikten sonra tutamadığı günleri kaza eder.",
      [["Orucunu hiçbir zaman tutmaz.", "kavrama", "Geçici hastalık bir mazerettir; iyileşen kişi tutamadığı günleri sonra tutar (kaza)."],
       ["Hasta olsa da orucunu tutmak zorundadır.", "bilgi", "Hastalık orucu ertelemek için meşru bir mazerettir; sağlığı tehlikeye atmak doğru değildir."],
       ["Tutamadığı her gün için iki gün oruç tutar.", "bilgi", "Kaza, tutulamayan her gün için bir gün tutmaktır."]],
      "Şemadaki son kutuya bak: “Hayır” cevabı hangi yola çıkıyor?",
      C("Şemayı izleyerek geçici hasta olan kişinin durumunu bulacağız.", "Oruçla yükümlü olmak için Müslüman, akıllı, ergenlik çağına girmiş, sağlıklı ve yolcu olmamak gerekir. Geçici mazeretli olan kişi orucunu sonra kaza eder.",
        ["İlk üç soruya “Evet” diyen kişi dördüncü kutuya gelir: “Sağlıklı ve yolcu değil mi?”", "Geçici hasta olan kişi burada “Hayır” yoluna gider: “Mazeret bitince tutamadığı günleri kaza eder.”"],
        "Geçici hasta kişi <b>iyileştikten sonra tutamadığı günleri kaza eder</b>.", "Kaza, vaktinde tutulamayan orucu daha sonra tutmaktır."),
      { gorsel: G.svg(620, 200,
        [["Müslüman mı?", 10], ["Akıllı mı?", 160], ["Ergenlik çağında mı?", 310], ["Sağlıklı ve|yolcu değil mi?", 460]].map(([m, x], i) => `<rect class="g-yumusak g-cizgi" x="${x}" y="15" width="140" height="56" rx="10" stroke-width="1.5"/>` + m.split("|").map((s, j, a) => t13(x + 70, 48 + (j - (a.length - 1) / 2) * 16, s, { b: 1 })).join("") + (i < 3 ? G.ok(x + 142, 43, x + 158, 43) + t13(x + 150, 33, "Evet", { f: 11 }) : "")).join("") +
        `<rect class="g-c g-cizgi" fill-opacity="0.35" x="440" y="120" width="170" height="64" rx="10" stroke-width="1.5"/>` + t13(525, 147, "Evet: Orucu tutmakla", { f: 13 }) + t13(525, 165, "yükümlüdür.", { f: 13 }) +
        `<rect class="g-b g-cizgi" fill-opacity="0.5" x="210" y="120" width="210" height="64" rx="10" stroke-width="1.5"/>` + t13(315, 147, "Hayır: Mazeret bitince", { f: 13 }) + t13(315, 165, "tutamadığı günleri kaza eder.", { f: 13 }) +
        G.ok(560, 73, 560, 118) + G.ok(490, 73, 400, 118), "oruçla yükümlülük akış şeması"),
        kural: "Geçici mazeret (hastalık, yolculuk) → sonra kaza.", dogruNeden: "Geçici hastalık bir mazerettir; kişi iyileşince tutamadığı günleri kaza eder." }),
  );
  SORU_EKLE("doru.kural",
    Q("doru.kural", "uygulama", 2, "Tabloda bazı durumların orucu bozup bozmadığı işaretlenmiştir. “?” ile gösterilen yere hangisi gelmelidir?", "Bozmaz",
      [["Bozar", "bilgi", "Unutarak yiyip içmek orucu bozmaz; kişi hatırlayınca hemen bırakır ve orucuna devam eder."],
       ["Bozar, iki gün kaza gerekir", "bilgi", "Unutarak yemek orucu bozmadığı için kaza da gerekmez."],
       ["Bozar, fidye gerekir", "bilgi", "Fidye, oruç tutamayacak durumdaki kişilerin yükümlülüğüdür; unutarak su içmekle ilgisi yoktur."]],
      "Bilerek yapmak ile unutarak yapmak arasında fark var mı?",
      C("Tablodaki eksik hükmü bulacağız.", "Oruçlu iken bilerek yiyip içmek orucu bozar. Unutarak yiyip içmek ise orucu bozmaz; hatırlayınca hemen bırakılır.",
        ["Tabloda “Bilerek su içmek: Bozar” yazıyor.", "“?” satırı “Unutarak su içmek”. Unutarak yapılan bu durum orucu bozmaz."],
        "“?” yerine <b>Bozmaz</b> gelir.", "Hatırladığı anda içmeyi bırakmazsa artık bilerek içmiş olur; buna dikkat etmek gerekir."),
      { gorsel: G.tablo(["Durum", "Orucu"], [["💧 Bilerek su içmek", "Bozar"], ["💧 Unutarak su içmek", "?"], ["🚿 Duş almak (su yutmadan)", "Bozmaz"], ["🍞 Bilerek bir şey yemek", "Bozar"]]),
        kural: "Unutarak yiyip içmek orucu bozmaz.", dogruNeden: "Unutarak su içmek orucu bozmaz; kişi hatırlayınca hemen bırakır ve orucuna devam eder." }),
  );
  SORU_EKLE("doru.cesit",
    Q("doru.cesit", "aciklama", 2, "Tabloda oruç çeşitleri ve örnekleri verilmiştir. “?” ile gösterilen yere hangisi gelmelidir?", "Pazartesi ve perşembe günleri tutulan oruç",
      [["Ramazan ayında tutulan oruç", "bilgi", "Ramazan orucu farzdır; tabloda “Farz” satırında yer alıyor."],
       ["Adak orucu", "bilgi", "Adak orucu vaciptir; tabloda “Vacip” satırında yazılı."],
       ["Tutulamayan Ramazan orucunun kazası", "kavrama", "Ramazan orucunun kazası da farzdır; isteğe bağlı nafile oruç değildir."]],
      "Nafile, isteğe bağlı olarak tutulan oruçtur. Hz. Peygamber'in (sav) sıkça tuttuğu günleri hatırla.",
      C("Nafile oruca örnek bulacağız.", "Oruç çeşitleri: farz (Ramazan orucu), vacip (adak orucu), nafile (pazartesi-perşembe, Muharrem'in 9-10. günleri gibi isteğe bağlı oruçlar).",
        ["Tabloda farz → Ramazan orucu, vacip → adak orucu yazılı.", "Nafile satırı boş; Hz. Muhammed'in (sav) sıklıkla tuttuğu pazartesi ve perşembe oruçları nafiledir."],
        "“?” yerine <b>pazartesi ve perşembe günleri tutulan oruç</b> gelir.", "Nafile oruç kişinin isteğine bağlıdır; tutmayan kişi sorumlu olmaz."),
      { gorsel: G.tablo(["Oruç çeşidi", "Örnek"], [["Farz", "Ramazan ayında tutulan oruç"], ["Vacip", "Adak orucu"], ["Nafile", "?"]]),
        kural: "Farz: Ramazan; vacip: adak; nafile: isteğe bağlı oruçlar.", dogruNeden: "Pazartesi ve perşembe günleri tutulan oruç isteğe bağlı, yani nafile bir oruçtur." }),
  );
  SORU_EKLE("dkaz.toplum",
    Q("dkaz.toplum", "baglanti", 2, "Görseldeki kartlarda Ramazan'da bir mahallede yapılanlar gösterilmiştir. Bu kartların ortak noktası hangisidir?", "Orucun yardımlaşma ve paylaşmayı güçlendirmesi",
      [["Orucun yalnızca bireysel bir ibadet olması", "kavrama", "Kartlarda insanlar birbirine yardım ediyor; oruç toplumsal bağları da güçlendirir."],
       ["Ramazan'da alışverişin azalması", "dikkat", "Kartlarda alışverişle ilgili bir bilgi yok; hepsi paylaşmayı anlatıyor."],
       ["Oruç tutanların komşularıyla görüşmemesi", "kavrama", "Kartlarda komşular birlikte iftar ediyor; görüşmemek kartlarla çelişir."]],
      "Dört kartta da insanlar birbirleri için ne yapıyor?",
      C("Kartlardaki davranışların ortak noktasını bulacağız.", "Oruç; yardımlaşma, paylaşma, empati ve kardeşlik duygularını güçlendirerek toplumsal hayata katkı sağlar.",
        ["Kartlar: komşuya iftarlık götürmek, mahallede ortak iftar sofrası, ihtiyaç sahiplerine erzak kolisi, fitrenin bayramdan önce verilmesi.", "Hepsinde paylaşma ve yardımlaşma var."],
        "Ortak nokta: <b>orucun yardımlaşma ve paylaşmayı güçlendirmesi</b>.", "Açlığı yaşayan insan, ihtiyaç sahiplerinin hâlini daha iyi anlar; bu da paylaşmayı artırır."),
      { gorsel: kartlar([["1", "🍲 Komşuya|iftarlık götürmek"], ["2", "🍽️ Mahallede ortak|iftar sofrası"], ["3", "📦 İhtiyaç sahiplerine|erzak kolisi"], ["4", "🤲 Fitreyi bayramdan|önce vermek"]], { w: 135, h: 84, etiket: "Ramazan'da paylaşma kartları" }),
        kural: "Oruç toplumda yardımlaşmayı ve kardeşliği güçlendirir.", dogruNeden: "Kartlardaki bütün davranışlar oruç ayında artan paylaşma ve yardımlaşmayı gösterir." }),
  );
  SORU_EKLE("dift.okunus",
    Q("dift.okunus", "uygulama", 2, "Tabloda iftar duasının okunuşu ve anlamı bölümler hâlinde verilmiştir. “?” ile gösterilen yere hangisi gelmelidir?", "sana güvendim (tevekkül ettim)",
      [["sana inandım,", "dikkat", "Bu, “ve bike âmentü” bölümünün anlamıdır; tabloda bir üst satırda yazılı."],
       ["ve senin rızkınla orucumu açtım.", "dikkat", "Bu, son bölüm olan “ve alâ rızkıke eftartü” ifadesinin anlamıdır."],
       ["Allah'ım! Senin rızan için oruç tuttum,", "dikkat", "Bu, ilk bölüm olan “Allâhümme leke sumtü” ifadesinin anlamıdır."]],
      "“Tevekkeltü” sözcüğü hangi kavramla ilgilidir?",
      C("İftar duasının eksik bölümünün anlamını bulacağız.", "İftar duası: “Allâhümme leke sumtü ve bike âmentü ve aleyke tevekkeltü ve alâ rızkıke eftartü.”",
        ["“?” satırının okunuşu: “ve aleyke tevekkeltü”.", "“Tevekkül” Allah'a güvenip dayanmak demektir; anlamı: “sana güvendim (tevekkül ettim)”."],
        "“?” yerine <b>sana güvendim (tevekkül ettim)</b> gelir.", "Duayı baştan oku: oruç tuttum, inandım, güvendim, rızkınla orucumu açtım. Anlam akışı tamam."),
      { gorsel: G.tablo(["Okunuşu", "Anlamı"], [["Allâhümme leke sumtü", "Allah'ım! Senin rızan için oruç tuttum,"], ["ve bike âmentü", "sana inandım,"], ["ve aleyke tevekkeltü", "?"], ["ve alâ rızkıke eftartü.", "ve senin rızkınla orucumu açtım."]]),
        kural: "Tevekkül = Allah'a güvenip dayanmak.", dogruNeden: "“Ve aleyke tevekkeltü” ifadesi “sana güvendim (tevekkül ettim)” anlamına gelir." }),
  );
  SORU_EKLE("dift.adap",
    Q("dift.adap", "transfer", 1, "Okul panosuna asılan “İftar sofrası adabı” afişindeki maddelerden hangisi <b>adaba uygun değildir</b>?", "4. madde",
      [["1. madde", "kavrama", "Ezanı bekleyip iftarı vaktinde açmak iftar adabındandır."],
       ["2. madde", "kavrama", "Besmeleyle başlamak ve iftar duasını okumak güzel bir adaptır."],
       ["3. madde", "kavrama", "Yemeği israf etmemek hem iftar hem sofra adabının gereğidir."]],
      "İsrafla ilgili maddeyi ve paylaşmayla ilgili maddeyi karşılaştır.",
      C("Afişte adaba uymayan maddeyi bulacağız.", "İftar adabı: vakti beklemek, besmele ve dua ile başlamak, israf etmemek, sofrayı paylaşmak, büyüklere saygı göstermek.",
        ["1., 2. ve 3. maddeler iftar ve sofra adabıyla uyumlu.", "4. madde “Sofraya gelen misafiri beklemeden yemeği bitir.” Bu, paylaşma ve misafire saygı adabına aykırıdır."],
        "Adaba uygun olmayan madde <b>4. madde</b>dir.", "Doğrusu: Misafiri sofraya buyur et ve yemeği birlikte paylaş."),
      { gorsel: bilgiKarti("🍽️ İFTAR SOFRASI ADABI", "1. Ezan okununca orucunu aç.|2. Besmeleyle başla, iftar duasını oku.|3. Tabağına yiyebileceğin kadar al, israf etme.|4. Sofraya gelen misafiri beklemeden yemeği bitir.", "iftar sofrası adabı afişi"),
        kural: "İftar adabı: vakit, dua, israf etmemek, paylaşmak.", dogruNeden: "Misafiri beklemeden yemeği bitirmek paylaşma ve misafire saygı adabına aykırıdır." }),
  );

  /* ======================= Değerler: doğruluk, merhamet, adap, vatan ======================= */
  SORU_EKLE("ddog.hayat",
    Q("ddog.hayat", "baglanti", 2, "Şemada doğru sözlülüğün bireye ve topluma katkıları gösterilmiştir. “?” ile gösterilen kutuya hangisi gelmelidir?", "İnsanlar arasında güven ortamı oluşur.",
      [["Kişi sık sık özür dilemek zorunda kalır.", "kavrama", "Doğru sözlü kişi yalan nedeniyle zor durumda kalmaz; bu, yalancılığın sonucudur."],
       ["İnsanlar birbirinin sözüne inanmaz.", "kavrama", "Bu, yalanın topluma verdiği zarardır; doğru sözlülüğün tam tersidir."],
       ["Herkes yalnızca kendi çıkarını düşünür.", "kavrama", "Doğru sözlülük bencilliği değil, karşılıklı güveni besler."]],
      "“Toplum” sütunundaki diğer kutularla uyumlu olanı seç.",
      C("Şemadaki eksik toplumsal katkıyı bulacağız.", "Doğru sözlülük bireye iç huzuru ve saygınlık kazandırır; toplumda güveni, barışı ve iş birliğini güçlendirir.",
        ["Birey sütunu: iç huzuru, güvenilir biri olarak tanınma.", "Toplum sütunu: haksızlıkların azalması, ve “?”. Bunlarla uyumlu olan: insanlar arasında güven ortamı oluşması."],
        "“?” yerine <b>insanlar arasında güven ortamı oluşur</b> gelir.", "Diğer seçenekler yalanın sonuçlarıdır; doğru sözlülüğün katkısı olamaz."),
      { gorsel: G.svg(560, 200, `<rect class="g-a" x="20" y="10" width="250" height="34" rx="8"/><text class="g-bos" style="font-size:15px" font-weight="700" x="145" y="33" text-anchor="middle">Bireye katkısı</text>` +
        `<rect class="g-c" x="290" y="10" width="250" height="34" rx="8"/><text class="g-bos" style="font-size:15px" font-weight="700" x="415" y="33" text-anchor="middle">Topluma katkısı</text>` +
        [["İç huzuru sağlar.", 20, 60], ["Güvenilir biri olarak tanınır.", 20, 125], ["Haksızlıklar azalır.", 290, 60], ["?", 290, 125]].map(([m, x, y]) => `<rect class="${m === "?" ? "g-b" : "g-yumusak"} g-cizgi" fill-opacity="0.6" x="${x}" y="${y}" width="250" height="52" rx="10" stroke-width="1.5"/>` + t13(x + 125, y + 31, m, { f: m === "?" ? 24 : 14, b: m === "?" })).join(""), "doğru sözlülüğün katkıları şeması"),
        kural: "Doğru sözlülük → bireyde huzur, toplumda güven.", dogruNeden: "Doğru sözlü insanların çoğaldığı toplumda insanlar birbirine güvenir." }),
  );
  SORU_EKLE("dmer.hayat",
    Q("dmer.hayat", "uygulama", 1, "Kartlardan hangisi merhametin <b>hayvanlara</b> yansımasına örnektir?", "A",
      [["B", "kavrama", "Fidan dikmek merhametin doğaya yansımasıdır."],
       ["C", "kavrama", "Köy okuluna kitap göndermek merhametin insanlara yansımasıdır."],
       ["D", "kavrama", "Hasta komşuyu ziyaret etmek de merhametin insanlara yansımasıdır."]],
      "Her kartta merhamet kime ya da neye gösteriliyor?",
      C("Merhametin hayvanlara yansıdığı kartı bulacağız.", "Merhamet; insanlara, hayvanlara ve doğaya karşı şefkatli ve duyarlı olmaktır.",
        ["B doğaya (fidan), C ve D insanlara (öğrenciler, hasta komşu) yönelik.", "A kartında kışın kuşlar için yem ve su konuyor: Merhamet hayvanlara gösteriliyor."],
        "Cevap: <b>A</b> kartı.", "Hz. Muhammed (sav) susuz bir köpeğe su veren kişinin bu davranışından dolayı bağışlandığını haber vermiştir; hayvanlara merhamet çok değerlidir."),
      { gorsel: kartlar([["A", "🐦 Kışın kuşlar için balkona|yem ve su koymak"], ["B", "🌱 Mahalle parkına|fidan dikmek"], ["C", "📚 Köy okuluna|kitap göndermek"], ["D", "🏥 Hastanedeki komşusunu|ziyaret etmek"]], { w: 270, h: 74, satir: 2, etiket: "merhamet kartları" }),
        kural: "Merhamet: insanlara, hayvanlara ve doğaya karşı şefkat.", dogruNeden: "A kartında kuşlara yem ve su koymak, hayvanlara merhamet göstermektir." }),
  );
  SORU_EKLE("dada.selam",
    Q("dada.selam", "uygulama", 2, "Kartlarda bir odaya girerken izin isteme adabının adımları karışık verilmiştir. Doğru sıralama hangisidir?", "L – M – K",
      [["K – L – M", "strateji", "İzin almadan içeri girmek (K) ilk adım olamaz; önce kapı çalınır."],
       ["M – L – K", "dikkat", "Selam verip izin istemek için önce kapıyı çalıp beklemek gerekir."],
       ["L – K – M", "dikkat", "İçeri girdikten sonra izin istemenin anlamı kalmaz; izin girmeden önce istenir."]],
      "Hangi adım en başta, hangisi en sonda olmalı?",
      C("İzin isteme adabını doğru sıraya koyacağız.", "Bir yere girerken kapı çalınır, selam verilir ve izin istenir; izin verilirse içeri girilir.",
        ["Önce kapı çalınıp beklenir (L). Sonra selam verilip izin istenir (M).", "İzin verilince içeri girilir (K)."],
        "Doğru sıralama: <b>L – M – K</b>.", "İzin verilmezse ısrar etmeden ayrılmak da bu adabın bir parçasıdır."),
      { gorsel: kartlar([["K", "🚪 İzin verilirse|içeri girmek"], ["L", "✊ Kapıyı çalıp|beklemek"], ["M", "💬 Selam verip|izin istemek"]], { w: 170, h: 74, satir: 3, etiket: "izin isteme adımları kartları" }),
        kural: "Kapıyı çal → selam ver, izin iste → izin verilirse gir.", dogruNeden: "İzin isteme adabında önce kapı çalınır, sonra selam verilip izin istenir, izin verilince girilir." }),
  );
  SORU_EKLE("dada.sofra",
    Q("dada.sofra", "transfer", 1, "Okul yemekhanesine asılan afişteki maddelerden hangisi <b>sofra adabına uygun değildir</b>?", "3. madde",
      [["1. madde", "kavrama", "Yemekten önce elleri yıkamak sofra adabının ve temizliğin gereğidir."],
       ["2. madde", "kavrama", "Besmeleyle başlamak dinimizin öğütlediği bir sofra adabıdır."],
       ["4. madde", "kavrama", "Yemekten sonra şükretmek ve masayı temiz bırakmak sofra adabındandır."]],
      "Ortak alanda başkalarını rahatsız eden davranış hangisi?",
      C("Afişte sofra adabına uymayan maddeyi bulacağız.", "Sofra adabı: elleri yıkamak, besmeleyle başlamak, israf etmemek, ağzı kapalı çiğnemek, başkalarını rahatsız etmemek, sonunda şükretmek.",
        ["1. el yıkamak ✔, 2. besmele ✔, 4. şükür ve temizlik ✔.", "3. “Yemek yerken telefonla yüksek sesle konuş.” Bu, sofradakileri rahatsız eder; adaba aykırıdır."],
        "Uygun olmayan madde <b>3. madde</b>dir.", "Doğrusu: Sofrada sakin konuşmak, telefonla meşgul olmamak."),
      { gorsel: bilgiKarti("🍽️ YEMEKHANE KURALLARIMIZ", "1. Yemekten önce ellerini yıka.|2. Besmeleyle başla.|3. Yemek yerken telefonla yüksek sesle konuş.|4. Yemekten sonra şükret, masanı temiz bırak.", "yemekhane kuralları afişi"),
        kural: "Sofra ortak alandır; başkalarını rahatsız etmemek adaptır.", dogruNeden: "Sofrada telefonla yüksek sesle konuşmak başkalarını rahatsız eder ve sofra adabına aykırıdır." }),
  );
  SORU_EKLE("dvat.sorumluluk",
    Q("dvat.sorumluluk", "uygulama", 1, "Kartlardan hangisi vatanımıza karşı sorumluluklarımızla <b>bağdaşmaz</b>?", "D",
      [["A", "kavrama", "Kamu malını korumak, hepimizin ortak malı olan vatanı korumaktır."],
       ["B", "kavrama", "Ormanları korumak vatan topraklarının geleceğini korumaktır."],
       ["C", "kavrama", "Derslerine çalışmak, vatanına faydalı bir birey olmanın yoludur."]],
      "Hangi kart ortak malımıza zarar vermeyi anlatıyor?",
      C("Vatanımıza karşı sorumluluklarla bağdaşmayan davranışı bulacağız.", "Vatana karşı sorumluluklarımız: kamu malını korumak, doğayı korumak, iyi yetişip ülkeye faydalı olmak, kanunlara uymak, birlik içinde yaşamak.",
        ["A, B ve C vatana karşı sorumlulukları yerine getiren davranışlar.", "D: “Parktaki banklara ve oyuncaklara zarar vermek.” Park herkesin ortak malıdır; ona zarar vermek vatana karşı sorumlulukla bağdaşmaz."],
        "Bağdaşmayan kart <b>D</b>'dir.", "Kamu malına zarar vermek, aslında hepimizin malına zarar vermektir."),
      { gorsel: kartlar([["A", "🏫 Okul sıralarını|temiz ve sağlam tutmak"], ["B", "🌲 Piknikte ateşi söndürüp|ormanı korumak"], ["C", "📘 Ülkesine faydalı olmak|için derslerine çalışmak"], ["D", "🛝 Parktaki banklara ve|oyuncaklara zarar vermek"]], { w: 270, h: 74, satir: 2, etiket: "vatan sorumluluğu kartları" }),
        kural: "Kamu malını ve doğayı korumak vatana karşı sorumluluğumuzdur.", dogruNeden: "Parktaki ortak eşyalara zarar vermek kamu malına zarar vermektir; vatana karşı sorumlulukla bağdaşmaz." }),
  );

  /* ======================= Hz. Muhammed'in (sav) Doğduğu Çevre, Çocukluğu ve Gençliği ======================= */
  SORU_EKLE("dcev.cografya",
    Q("dcev.cografya", "baglanti", 2, "Şematik haritada Arap Yarımadası ve kervan yolu gösterilmiştir. Haritaya göre Mekke'de <b>ticaretin önemli</b> olmasının coğrafi nedeni hangisidir?", "Yemen ile Şam arasındaki kervan yolu üzerinde bulunması",
      [["Geniş ve verimli ovalarla çevrili olması", "bilgi", "Mekke çorak ve kayalık bir vadidedir; tarıma elverişli değildir."],
       ["Büyük bir akarsuyun kıyısında kurulması", "bilgi", "Haritada Mekke'nin yanında akarsu yok; bölgede sürekli akan büyük akarsu bulunmaz."],
       ["Basra Körfezi kıyısında bir liman şehri olması", "dikkat", "Mekke iç kesimdedir; haritada Kızıldeniz'e yakın ama liman değildir, Basra Körfezi ise doğudadır."]],
      "Kervan yolunun oklarını izle: Yol hangi şehirlerden geçiyor?",
      C("Haritadan Mekke'deki ticaretin coğrafi nedenini çıkaracağız.", "Mekke çorak bir vadide kurulmuştur; tarım yapılamadığı için halk geçimini büyük ölçüde ticaretle sağlardı. Şehir, kuzeyde Şam ile güneyde Yemen arasındaki kervan yolu üzerindeydi.",
        ["Haritada kervan yolu güneyde Yemen'den başlayıp Mekke ve Medine'den geçerek kuzeyde Şam'a uzanıyor.", "Bu yol üzerindeki konum Mekke'yi bir ticaret merkezi yapmıştır; Kâbe'ye yapılan ziyaretler de ticareti canlandırmıştır."],
        "Neden: <b>Yemen ile Şam arasındaki kervan yolu üzerinde bulunması</b>.", "Kureyş'in kış ve yaz yolculukları (Yemen'e ve Şam'a) da bu ticaret yolunu kullanırdı."),
      { gorsel: G.svg(520, 380,
        `<path class="g-b g-cizgi" fill-opacity="0.35" d="M120 60 L400 60 L470 200 L440 300 L330 360 L220 350 L150 250 L110 140 Z" stroke-width="2"/>` +
        t13(85, 230, "Kızıldeniz", { f: 12 }) + t13(512, 112, "Basra Körfezi", { a: "end", f: 12 }) + t13(345, 285, "ARAP YARIMADASI", { b: 1, f: 14 }) + t13(345, 305, "(çöl ve çorak araziler)", { f: 12 }) +
        `<path class="g-ok-a" d="M250 340 L215 205 L195 140 L185 40" fill="none" stroke-width="3" stroke-dasharray="8 6"/>` + G.ok(188, 60, 185, 30, "g-ok-a") +
        [["Şam", 185, 25, -1], ["Medine", 195, 140, -1], ["Mekke", 215, 205, -1], ["Taif", 250, 218, 1], ["Yemen", 250, 340, -1]].map(([a, x, y, d]) => `<circle class="g-d" cx="${x}" cy="${y}" r="6"/>` + t13(x + d * 10, y + 4, a, { a: d < 0 ? "end" : "start", b: 1, f: 14 })).join("") +
        t13(340, 370, "- - - kervan yolu (şematik)", { f: 12 }), "Arap Yarımadası ve kervan yolu şematik haritası"),
        kural: "Mekke: çorak arazi + kervan yolu → ticaret şehri.", dogruNeden: "Mekke, Yemen ile Şam arasındaki ticaret yolu üzerinde bulunduğu için önemli bir ticaret merkeziydi." }),
  );
  SORU_EKLE("dcoc.aile",
    Q("dcoc.aile", "hatirlama", 1, "Soy şemasında Hz. Muhammed'in (sav) yakın ailesi gösterilmiştir. “?” ile gösterilen annesinin adı nedir?", "Amine",
      [["Halime", "bilgi", "Halime, Hz. Muhammed'in (sav) süt annesidir."],
       ["Hatice", "bilgi", "Hz. Hatice, Hz. Muhammed'in (sav) eşidir."],
       ["Fatıma", "bilgi", "Hz. Fatıma, Hz. Muhammed'in (sav) kızıdır."]],
      "Babası Abdullah'ın eşi kimdir?",
      C("Şemadaki eksik ismi bulacağız.", "Hz. Muhammed'in (sav) babası Abdullah, annesi Amine, dedesi Abdülmuttalib, amcası Ebu Talib'dir.",
        ["Şemada Abdülmuttalib'in oğulları Abdullah (baba) ve Ebu Talib (amca) gösterilmiş.", "Abdullah'ın yanındaki “?” Hz. Muhammed'in (sav) annesidir: Amine."],
        "“?” yerine <b>Amine</b> gelir.", "Halime süt annesi, Hatice eşi, Fatıma kızıdır; isimleri karıştırmamaya dikkat et."),
      { gorsel: G.svg(560, 250,
        `<rect class="g-yumusak g-cizgi" x="275" y="10" width="190" height="44" rx="10" stroke-width="1.5"/>` + t13(370, 37, "Abdülmuttalib (dede)", { b: 1, f: 14 }) +
        `<line class="g-cizgi" x1="370" y1="54" x2="370" y2="75" stroke-width="2"/><line class="g-cizgi" x1="280" y1="75" x2="470" y2="75" stroke-width="2"/><line class="g-cizgi" x1="280" y1="75" x2="280" y2="95" stroke-width="2"/><line class="g-cizgi" x1="470" y1="75" x2="470" y2="95" stroke-width="2"/>` +
        `<rect class="g-yumusak g-cizgi" x="205" y="95" width="150" height="44" rx="10" stroke-width="1.5"/>` + t13(280, 122, "Abdullah (baba)", { b: 1, f: 14 }) +
        `<rect class="g-yumusak g-cizgi" x="395" y="95" width="150" height="44" rx="10" stroke-width="1.5"/>` + t13(470, 122, "Ebu Talib (amca)", { b: 1, f: 14 }) +
        `<rect class="g-b g-cizgi" fill-opacity="0.5" x="25" y="95" width="140" height="44" rx="10" stroke-width="2"/>` + t13(95, 124, "? (anne)", { b: 1, f: 18 }) +
        `<line class="g-cizgi" x1="165" y1="117" x2="205" y2="117" stroke-width="3"/><line class="g-cizgi" x1="185" y1="117" x2="185" y2="185" stroke-width="2"/>` +
        `<rect class="g-c g-cizgi" fill-opacity="0.35" x="80" y="185" width="210" height="48" rx="10" stroke-width="2"/>` + t13(185, 214, "Hz. Muhammed (sav)", { b: 1, f: 15 }), "Hz. Muhammed'in (sav) soy şeması"),
        kural: "Baba: Abdullah; anne: Amine; dede: Abdülmuttalib; amca: Ebu Talib.", dogruNeden: "Hz. Muhammed'in (sav) annesi Hz. Amine'dir." }),
  );
  SORU_EKLE("dcoc.cocukluk",
    Q("dcoc.cocukluk", "hatirlama", 2, "Zaman şeridinde Hz. Muhammed'in (sav) çocukluk yıllarından olaylar verilmiştir. 8 yaşındaki “?” olayı hangisidir?", "Dedesi Abdülmuttalib vefat etti, amcası Ebu Talib'in yanına geçti.",
      [["Annesi Amine vefat etti.", "dikkat", "Annesi Hz. Amine, o 6 yaşındayken vefat etmiştir; şeritte zaten yazılı."],
       ["İlk vahiy geldi.", "bilgi", "İlk vahiy 40 yaşında gelmiştir; çocukluk dönemine ait değildir."],
       ["Hz. Hatice ile evlendi.", "bilgi", "Hz. Hatice ile evliliği 25 yaşındadır."]],
      "Annesinin vefatından sonra onu kim himaye etti? O kişi vefat edince kimin yanına geçti?",
      C("Şeritte 8 yaşa ait olayı bulacağız.", "Hz. Muhammed (sav) 6 yaşında annesini kaybetti, dedesi Abdülmuttalib onu himaye etti. 8 yaşında dedesi vefat edince amcası Ebu Talib'in yanına geçti.",
        ["Şerit: 571 doğum → 6 yaş annesinin vefatı → 8 yaş “?” → 12 yaş amcasıyla Şam'a ticaret yolculuğu.", "6 ile 12 yaş arasında, 8 yaşında yaşanan olay dedesinin vefatıdır."],
        "“?” yerine <b>dedesi Abdülmuttalib vefat etti, amcası Ebu Talib'in yanına geçti</b> gelir.", "12 yaşta amcasıyla Şam'a gitmesi de Ebu Talib'in yanında büyüdüğünü doğrular."),
      { gorsel: zaman([["571", "Doğumu"], ["6 yaş", "Annesi Amine|vefat etti"], ["8 yaş", "?"], ["12 yaş", "Amcasıyla Şam'a|ticaret yolculuğu"]], "çocukluk dönemi zaman şeridi"),
        kural: "6 yaş: annesi vefat; 8 yaş: dedesi vefat, amcası Ebu Talib'in yanına.", dogruNeden: "8 yaşında dedesi Abdülmuttalib vefat edince amcası Ebu Talib'in himayesine girmiştir." }),
  );
  SORU_EKLE("dgen.ticaret",
    Q("dgen.ticaret", "hatirlama", 2, "Zaman şeridinde Hz. Muhammed'in (sav) gençlik yıllarından olaylar verilmiştir. 25 yaşındaki “?” olayı hangisidir?", "Hz. Hatice ile evlendi.",
      [["Hira'da ilk vahiy geldi.", "bilgi", "İlk vahiy 40 yaşında gelmiştir; şeridin son noktasıdır."],
       ["Hacerülesved'in yerine konmasında hakemlik yaptı.", "dikkat", "Kâbe onarımındaki hakemlik 35 yaşındadır; şeritte yazılı."],
       ["Hilfu'l-Fudul'a katıldı.", "dikkat", "Hilfu'l-Fudul (Erdemliler Topluluğu) yaklaşık 20 yaşındadır; şeritte ilk noktadır."]],
      "Hz. Hatice'nin ticaret kervanını yöneten genç Muhammed'in (sav) dürüstlüğü neyle sonuçlandı?",
      C("Şeritte 25 yaşa ait olayı bulacağız.", "Hz. Muhammed (sav) gençliğinde ticaretle uğraştı. Hz. Hatice'nin kervanını dürüstlükle yönetti; 25 yaşında Hz. Hatice ile evlendi.",
        ["Şerit: ~20 yaş Hilfu'l-Fudul → 25 yaş “?” → 35 yaş Kâbe hakemliği → 40 yaş ilk vahiy.", "25 yaşındaki olay Hz. Hatice ile evliliğidir."],
        "“?” yerine <b>Hz. Hatice ile evlendi</b> gelir.", "Yaşları sıraya koy: 20 < 25 < 35 < 40. Şerit kronolojik olarak tutarlı."),
      { gorsel: zaman([["~20 yaş", "Hilfu'l-Fudul"], ["25 yaş", "?"], ["35 yaş", "Kâbe onarımında|hakemlik"], ["40 yaş", "İlk vahiy"]], "gençlik dönemi zaman şeridi"),
        kural: "25 yaş: Hz. Hatice ile evlilik; 35 yaş: hakemlik; 40 yaş: ilk vahiy.", dogruNeden: "Hz. Muhammed (sav) 25 yaşında Hz. Hatice ile evlenmiştir." }),
  );
  SORU_EKLE("dfil.anlam",
    Q("dfil.anlam", "uygulama", 2, "Tabloda Fil suresinin okunuşu ve anlamı verilmiştir. 3. ayetin anlamı olan “?” yerine hangisi gelmelidir?", "Onların üzerine sürü sürü kuşlar gönderdi.",
      [["(Kuşlar) onlara pişmiş çamurdan taşlar atıyorlardı.", "dikkat", "Bu, 4. ayetin (“Termîhim bi hıcâratin min siccîl.”) anlamıdır."],
       ["Nihayet onları yenilmiş ekin yaprağı gibi yaptı.", "dikkat", "Bu, 5. ayetin anlamıdır."],
       ["Onların tuzaklarını boşa çıkarmadı mı?", "dikkat", "Bu, 2. ayetin anlamıdır; tabloda zaten yazılı."]],
      "3. ayetteki “tayran ebâbîl” ifadesi “sürü sürü kuşlar” demektir.",
      C("Fil suresinin 3. ayetinin anlamını bulacağız.", "Fil suresi, Kâbe'yi yıkmaya gelen Ebrehe ordusunun Allah'ın gönderdiği kuşlarla yok edilişini anlatır.",
        ["3. ayetin okunuşu: “Ve ersele aleyhim tayran ebâbîl.”", "“Ersele” gönderdi, “tayr” kuş, “ebâbîl” sürü sürü demektir: “Onların üzerine sürü sürü kuşlar gönderdi.”"],
        "“?” yerine <b>“Onların üzerine sürü sürü kuşlar gönderdi.”</b> gelir.", "Olayın akışı: kuşlar gönderildi (3) → taşlar attılar (4) → ordu yok oldu (5)."),
      { gorsel: G.tablo(["Ayet", "Okunuşu", "Anlamı"], [["1", "Elem tera keyfe feale rabbüke bi ashâbil fîl.", "Rabbinin fil sahiplerine ne yaptığını görmedin mi?"], ["2", "Elem yec'al keydehüm fî tadlîl.", "Onların tuzaklarını boşa çıkarmadı mı?"], ["3", "Ve ersele aleyhim tayran ebâbîl.", "?"], ["4", "Termîhim bi hıcâratin min siccîl.", "(Kuşlar) onlara pişmiş çamurdan taşlar atıyorlardı."], ["5", "Fe cealehüm ke asfin me'kûl.", "Nihayet onları yenilmiş ekin yaprağı gibi yaptı."]]),
        kural: "Tayran ebâbîl = sürü sürü kuşlar.", dogruNeden: "3. ayet, Allah'ın fil sahiplerinin üzerine sürü sürü kuşlar gönderdiğini bildirir." }),
  );

  /* ======================= Gelenek, Edebiyat ve Musikide Dinin İzleri ======================= */
  SORU_EKLE("dgel.yasam",
    Q("dgel.yasam", "aciklama", 2, "Zaman şeridinde insan hayatının önemli anları ve bu anlarla ilgili dinî gelenekler verilmiştir. “?” ile gösterilen gelenek hangisidir?", "Bebeğin kulağına ezan ve kamet okunarak adının konması",
      [["Cenaze namazı kılınması", "dikkat", "Cenaze namazı hayatın son anıyla, ölümle ilgilidir; şeridin son noktasında yazılı."],
       ["Nikâh kıyılması", "dikkat", "Nikâh evlilikle ilgilidir; şeritte üçüncü noktada yazılı."],
       ["Bayram namazı kılınması", "kavrama", "Bayram namazı her yıl bayramlarda kılınır; doğumla ilgili bir gelenek değildir."]],
      "Şeridin ilk noktası “Doğum”. Doğumda yapılan dinî gelenek nedir?",
      C("Doğumla ilgili dinî geleneği bulacağız.", "Doğumdan ölüme kadar hayatın önemli anlarında dinî gelenekler vardır: doğumda ezan-kamet ve ad koyma, sünnet, nikâh, cenaze namazı.",
        ["Şerit: Doğum “?” → Sünnet: sünnet düğünü → Evlilik: nikâh → Ölüm: cenaze namazı.", "Doğumda bebeğin kulağına ezan ve kamet okunur ve adı konur."],
        "“?” yerine <b>bebeğin kulağına ezan ve kamet okunarak adının konması</b> gelir.", "Bu gelenek, çocuğun hayata İslam'ın çağrısını duyarak başlamasını sembolize eder."),
      { gorsel: zaman([["Doğum", "?"], ["Sünnet", "Sünnet düğünü"], ["Evlilik", "Nikâh"], ["Ölüm", "Cenaze namazı"]], "hayatın önemli anları ve dinî gelenekler"),
        kural: "Doğum: ezan-kamet ve ad koyma; ölüm: cenaze namazı.", dogruNeden: "Doğumda bebeğin kulağına ezan ve kamet okunup adının konması dinî bir gelenektir." }),
  );
  SORU_EKLE("dgel.gunler",
    Q("dgel.gunler", "hatirlama", 2, "Akış şemasında bazı dinî geceler hicri takvimdeki sırasıyla verilmiştir. Şaban ayının 15. gecesine denk gelen ve “?” ile gösterilen gece hangisidir?", "Berat Kandili",
      [["Mevlid Kandili", "bilgi", "Mevlid Kandili Rebiülevvel ayındadır; Regaip'ten önce gelir."],
       ["Miraç Kandili", "dikkat", "Miraç Kandili Recep ayının 27. gecesidir; şemada zaten yazılı."],
       ["Regaip Kandili", "dikkat", "Regaip Kandili, Recep ayının ilk cuma gecesidir; şemanın ilk kutusudur."]],
      "Şaban ayının ortasındaki mübarek geceyi hatırla.",
      C("Şemadaki eksik kandili bulacağız.", "Kandiller hicri takvime göre: Mevlid (Rebiülevvel), Regaip (Recep), Miraç (Recep), Berat (Şaban), Kadir (Ramazan).",
        ["Şema: Regaip (Recep) → Miraç (Recep) → ? (Şaban) → Kadir (Ramazan).", "Şaban ayının 15. gecesi Berat Kandili'dir."],
        "“?” yerine <b>Berat Kandili</b> gelir.", "Üç aylar Recep, Şaban ve Ramazan'dır; Regaip, Miraç, Berat ve Kadir geceleri bu aylardadır."),
      { gorsel: akis(["Regaip|(Recep)", "Miraç|(Recep)", "?", "Kadir|(Ramazan)"], "üç aylardaki mübarek geceler"),
        kural: "Recep: Regaip, Miraç; Şaban: Berat; Ramazan: Kadir.", dogruNeden: "Şaban ayının 15. gecesi Berat Kandili'dir." }),
  );
  SORU_EKLE("dede.tur",
    Q("dede.tur", "aciklama", 2, "Kartlarda dinî edebiyat türleri tanıtılmıştır. <b>C kartında</b> tanıtılan tür hangisidir?", "Münacat",
      [["Naat", "bilgi", "Naat, Hz. Peygamber'i (sav) övmek için yazılan şiirdir; B kartında tanıtılmıştır."],
       ["Tevhid", "bilgi", "Tevhid, Allah'ın birliğini anlatan şiirdir; A kartında tanıtılmıştır."],
       ["Mevlid", "bilgi", "Mevlid, Hz. Peygamber'in (sav) doğumunu ve hayatını anlatan eserdir; D kartında tanıtılmıştır."]],
      "Allah'a yalvarma ve dua etme anlamına gelen tür hangisi?",
      C("C kartındaki dinî edebiyat türünü bulacağız.", "Dinî edebiyat türleri: tevhid (Allah'ın birliği), münacat (Allah'a yalvarış), naat (Hz. Peygamber'i övme), mevlid (Hz. Peygamber'in doğumu).",
        ["C kartı: “Allah'a yalvarmak, O'na dua etmek için yazılan şiir.”", "Bu tanım münacata aittir."],
        "C kartında tanıtılan tür: <b>münacat</b>.", "Tanımlar arasındaki fark: tevhid Allah'ın birliğini, münacat Allah'a yalvarışı anlatır."),
      { gorsel: kartlar([["A", "Allah'ın birliğini|anlatan şiir"], ["B", "Hz. Peygamber'i (sav)|övmek için yazılan şiir"], ["C", "Allah'a yalvarmak, O'na|dua etmek için yazılan şiir"], ["D", "Hz. Peygamber'in (sav)|doğumunu anlatan eser"]], { w: 270, h: 74, satir: 2, etiket: "dinî edebiyat türleri kartları" }),
        kural: "Tevhid: birlik; münacat: yalvarış; naat: övgü; mevlid: doğum.", dogruNeden: "Allah'a yalvarmak ve dua etmek için yazılan şiirlere münacat denir." }),
  );
  SORU_EKLE("dede.sair",
    Q("dede.sair", "hatirlama", 2, "Tabloda dinî motifler taşıyan bazı eserler ve yazarları verilmiştir. “?” ile gösterilen yazar hangisidir?", "Süleyman Çelebi",
      [["Yunus Emre", "bilgi", "Yunus Emre ilahileriyle tanınır; tabloda Divan'ın yazarı olarak yer alıyor."],
       ["Mevlana", "bilgi", "Mevlana Celaleddin Rumi, Mesnevi'nin yazarıdır."],
       ["Fuzuli", "bilgi", "Fuzuli'nin Su Kasidesi adlı naatı ünlüdür; ama Mevlid'i yazan o değildir."]],
      "Mevlid denince akla gelen ilk şair kimdir?",
      C("Mevlid'in (Vesiletü'n-Necat) yazarını bulacağız.", "Süleyman Çelebi'nin Vesiletü'n-Necat adlı eseri “Mevlid” olarak bilinir ve Hz. Peygamber'in (sav) doğumunu anlatır.",
        ["Tabloda Mesnevi – Mevlana, Divan (ilahiler) – Yunus Emre, Muhammediye – Yazıcıoğlu Mehmed yazılı.", "“?” satırı Mevlid (Vesiletü'n-Necat); yazarı Süleyman Çelebi'dir."],
        "“?” yerine <b>Süleyman Çelebi</b> gelir.", "Mevlid, bugün de doğum, kandil ve anma törenlerinde okunarak yaşatılmaktadır."),
      { gorsel: G.tablo(["Eser", "Yazarı"], [["Mevlid (Vesiletü'n-Necat)", "?"], ["Mesnevi", "Mevlana Celaleddin Rumi"], ["Divan (ilahiler)", "Yunus Emre"], ["Muhammediye", "Yazıcıoğlu Mehmed"]]),
        kural: "Mevlid (Vesiletü'n-Necat) = Süleyman Çelebi.", dogruNeden: "Vesiletü'n-Necat adlı Mevlid'in yazarı Süleyman Çelebi'dir." }),
  );
  SORU_EKLE("dmus.tekke",
    Q("dmus.tekke", "hatirlama", 2, "Kartlarda tekke musikisinde kullanılan bazı çalgılar tanıtılmıştır. <b>A kartında</b> tanıtılan çalgı hangisidir?", "Ney",
      [["Kudüm", "bilgi", "Kudüm, deriyle kaplı küçük çift davuldur; vurmalı bir çalgıdır (B kartı)."],
       ["Bendir", "bilgi", "Bendir, büyük bir tefe benzeyen vurmalı çalgıdır (C kartı)."],
       ["Rebap", "bilgi", "Rebap yaylı bir çalgıdır; yayla çalınır (D kartı)."]],
      "Kamıştan yapılan ve üflenerek çalınan çalgı hangisidir?",
      C("A kartındaki çalgıyı bulacağız.", "Tekke musikisi çalgıları: ney (üflemeli, kamıştan), kudüm (vurmalı, çift davul), bendir (vurmalı), rebap (yaylı).",
        ["A kartı: “Kamıştan yapılır, üflenerek çalınır; Mevlevi ayinlerinin baş sazıdır.”", "Bu tanım neye aittir."],
        "A kartındaki çalgı: <b>ney</b>.", "Diğer kartlar vurmalı ya da yaylı çalgıları anlatır; üflemeli olan yalnızca neydir."),
      { gorsel: kartlar([["A", "🎐 Kamıştan yapılır,|üflenerek çalınır;|Mevlevi ayinlerinin baş sazı"], ["B", "🥁 Deriyle kaplı|küçük çift davul"], ["C", "🪘 Büyük, tef benzeri|vurmalı çalgı"], ["D", "🎻 Yayla çalınan|telli çalgı"]], { w: 270, h: 84, satir: 2, etiket: "tekke musikisi çalgıları kartları" }),
        kural: "Ney: kamıştan, üflemeli; Mevlevi ayinlerinin baş sazı.", dogruNeden: "Kamıştan yapılan ve üflenerek çalınan, Mevlevi ayinlerinin baş sazı olan çalgı neydir." }),
  );
  SORU_EKLE("dmus.eser",
    Q("dmus.eser", "hatirlama", 2, "Tabloda dinî musikimizin bazı bestekârları ve eserleri verilmiştir. “?” ile gösterilen bestekâr hangisidir?", "Buhurizade Mustafa Itri",
      [["Hammamizade İsmail Dede Efendi", "bilgi", "Dede Efendi, Mevlevi ayinleri ve ilahileriyle tanınır; tabloda ikinci satırda yer alıyor."],
       ["Yunus Emre", "bilgi", "Yunus Emre bir şairdir; şiirleri ilahi olarak bestelenmiştir ama bayram tekbirinin bestecisi değildir."],
       ["Süleyman Çelebi", "bilgi", "Süleyman Çelebi Mevlid'in şairidir; tekbirin bestecisi değildir."]],
      "Bayramlarda camilerde okunan tekbirin bestecisi kimdir?",
      C("Bayram tekbirinin bestekârını bulacağız.", "Buhurizade Mustafa Itri, bayramlarda okunan Tekbir'i ve Salât-ı Ümmiyye'yi bestelemiştir. Dede Efendi Mevlevi ayinleriyle tanınır.",
        ["Tabloda “?” satırının eserleri: Bayram Tekbiri, Salât-ı Ümmiyye.", "Bu eserlerin bestekârı Itri'dir."],
        "“?” yerine <b>Buhurizade Mustafa Itri</b> gelir.", "Itri'nin tekbiri yüzyıllardır bayram sabahlarında okunarak yaşatılıyor."),
      { gorsel: G.tablo(["Bestekâr", "Önemli eserleri"], [["?", "Bayram Tekbiri, Salât-ı Ümmiyye"], ["Hammamizade İsmail Dede Efendi", "Mevlevi ayinleri, ilahiler"]]),
        kural: "Itri: Bayram Tekbiri; Dede Efendi: Mevlevi ayinleri.", dogruNeden: "Bayram Tekbiri ve Salât-ı Ümmiyye'nin bestekârı Buhurizade Mustafa Itri'dir." }),
  );
})();
