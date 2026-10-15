/* Sosyal Bilgiler — görselli ek sorular (şematik haritalar, pusula, zaman şeritleri, tablolar, grafikler, şemalar).
 * Her sorunun görseli çözüm için gereklidir; görseller yalnızca g-* sınıfları ve basit SVG ile çizilir. Haritalar şematiktir, ölçeksizdir.
 */
(function () {
  "use strict";
  const { S, Q, G } = OGR;

  /* Çözüm kurucu: 🔎 anla → 💡 hatırla → ✏️ adımlar → ✅ sonuç → 🔁 kontrol */
  const C = (anla, hatirla, adimlar, sonuc, kontrol) =>
    ["🔎 Soruyu anlayalım: " + anla, "💡 Hatırlayalım: " + hatirla].concat(adimlar.map(a => "✏️ " + a), ["✅ Sonuç: " + sonuc, "🔁 Kontrol edelim: " + kontrol]);

  /* ---------- Görsel yardımcıları ---------- */
  const t13 = (x, y, s, o = {}) => `<text class="g-yazi" style="font-size:${o.f || 13}px" x="${x}" y="${y}" text-anchor="${o.a || "middle"}"${o.b ? ' font-weight="700"' : ""}>${s}</text>`;
  const ikon = (x, y, e, b = 34) => `<text x="${x}" y="${y}" font-size="${b}" text-anchor="middle">${e}</text>`;
  const rozet = (x, y, h) => `<circle class="g-b g-cizgi" cx="${x}" cy="${y}" r="12"/>` + t13(x, y + 5, h, { b: 1 });
  // Harfli kartlar: [[harf, "satır|satır"], ...]
  function kartlar(liste, { w = 125, h = 70, satir = 4, etiket = "kartlar" } = {}) {
    const W = Math.min(liste.length, satir) * (w + 12) + 12, H = Math.ceil(liste.length / satir) * (h + 12) + 12;
    let ic = "";
    liste.forEach(([harf, metin], i) => {
      const x = 12 + (i % satir) * (w + 12), y = 12 + Math.floor(i / satir) * (h + 12), s = metin.split("|");
      ic += `<rect class="${metin === "?" ? "g-b" : "g-yumusak"} g-cizgi" x="${x}" y="${y}" width="${w}" height="${h}" rx="10" stroke-width="1.5"/>`;
      if (harf) ic += rozet(x + 15, y + 15, harf);
      s.forEach((t, j) => { ic += t13(x + w / 2 + (harf ? 8 : 0), y + h / 2 + 5 + (j - (s.length - 1) / 2) * 17, t, { f: metin === "?" ? 24 : 14, b: metin === "?" }); });
    });
    return G.svg(W, H, ic, etiket);
  }
  // Zaman şeridi: [[tarih, "olay|olay"], ...]; olay "?" ise kırmızı nokta
  function zaman(olaylar, etiket) {
    const n = olaylar.length, W = 620, H = 175, sol = 75, sag = 545, y = 70, xk = i => sol + i * (sag - sol) / (n - 1);
    let ic = G.ok(20, y, 605, y);
    olaylar.forEach(([t, m], i) => {
      ic += `<circle class="${m === "?" ? "g-d" : "g-a"}" cx="${xk(i)}" cy="${y}" r="9"/>` + G.yazi(xk(i), y - 18, t, { b: 1 });
      String(m).split("|").forEach((s, j) => { ic += t13(xk(i), y + 32 + j * 16, s, { f: m === "?" ? 22 : 13, b: m === "?" }); });
    });
    return G.svg(W, H, ic, etiket || "zaman şeridi");
  }
  // Pusula gülü (sağ üst köşe için)
  const pusula = (x, y) => `<circle class="g-bos g-cizgi" cx="${x}" cy="${y}" r="26" stroke-width="1.5"/>` +
    `<path class="g-d" d="M${x} ${y - 24} L${x + 6} ${y} L${x - 6} ${y} Z"/><path class="g-a" d="M${x} ${y + 24} L${x + 6} ${y} L${x - 6} ${y} Z"/>` +
    t13(x, y - 30, "K", { b: 1 }) + t13(x, y + 42, "G", { b: 1 }) + t13(x + 36, y + 5, "D", { b: 1 }) + t13(x - 36, y + 5, "B", { b: 1 });

  /* ======================= Gruplar ve Roller ======================= */
  SORU_EKLE("sgru.grup",
    Q("sgru.grup", "aciklama", 2, "Defne, dâhil olduğu grupları şemaya yerleştirmiştir. Şemada <b>yanlış yere</b> yerleştirilen grup hangisidir?", "Satranç kulübü",
      [["Aile", "kavrama", "Aileye doğuştan dâhil oluruz; “Doğuştan” kutusunda olması doğrudur."],
       ["İzci grubu", "kavrama", "İzciliğe kendi isteğimizle katılırız; “İsteğe bağlı” kutusunda olması doğrudur."],
       ["Akrabalar", "kavrama", "Akrabalık doğumla kazanılan bir bağdır; “Doğuştan” kutusunda doğru yerdedir."]],
      "Her grup için sor: Bu gruba doğduğum anda mı katıldım, yoksa kendim mi seçtim?",
      C("Şemadaki yanlış yerleştirilmiş grubu bulacağız.", "Bazı gruplara doğuştan dâhil oluruz (aile, akrabalar); bazılarına kendi isteğimizle katılırız (kulüpler, takımlar, gönüllü gruplar).",
        ["“Doğuştan” kutusunda: aile, akrabalar, satranç kulübü. “İsteğe bağlı” kutusunda: izci grubu, kitap kulübü.", "Satranç kulübüne kimse doğuştan üye olmaz; ilgi duyan kişi kendi isteğiyle katılır."],
        "Yanlış yerleştirilen grup <b>satranç kulübüdür</b>; “İsteğe bağlı” kutusunda olmalıdır.", "Kitap kulübü ile satranç kulübü aynı türden gruplardır; ikisi de aynı kutuda olmalı."),
      { gorsel: G.svg(560, 200,
        `<rect class="g-yumusak g-cizgi" x="10" y="10" width="260" height="180" rx="14" stroke-width="2"/><rect class="g-b g-cizgi" fill-opacity="0.35" x="290" y="10" width="260" height="180" rx="14" stroke-width="2"/>` +
        G.yazi(140, 38, "Doğuştan", { b: 1 }) + G.yazi(420, 38, "İsteğe bağlı", { b: 1 }) +
        ["👨‍👩‍👧 Aile", "👪 Akrabalar", "♟️ Satranç kulübü"].map((m, i) => t13(140, 80 + i * 38, m, { f: 16 })).join("") +
        ["⛺ İzci grubu", "📚 Kitap kulübü"].map((m, i) => t13(420, 90 + i * 44, m, { f: 16 })).join(""), "Defne'nin grupları şeması"),
        kural: "Doğuştan: aile, akrabalar. İsteğe bağlı: kulüpler, takımlar, gönüllü gruplar.", dogruNeden: "Satranç kulübüne kişi kendi isteğiyle katılır; doğuştan dâhil olunan bir grup değildir." }),
  );
  SORU_EKLE("sgru.rol",
    Q("sgru.rol", "uygulama", 2, "Tabloda sınıf başkanı Emir'in rolüyle ilgili bilgiler verilmiştir. “?” ile gösterilen yere hangisi yazılmalıdır?", "Sınıf arkadaşlarının görüşlerini dinleyip öğretmene doğru aktarmak",
      [["Teneffüste istediği zaman eve gitmek", "kavrama", "Bu ne bir hak ne de bir sorumluluktur; okul kurallarına aykırıdır."],
       ["Sınıf adına öğretmenle görüşmek", "dikkat", "Bu, tabloda zaten yazan bir haktır; “?” sorumluluk sütunundadır."],
       ["Arkadaşlarının ödevlerini onların yerine yapmak", "kavrama", "Bu, başkalarının sorumluluğunu üstlenmektir; başkanın görevi değildir."]],
      "“?” hangi sütunda: hak mı, sorumluluk mu?",
      C("Tablodaki boş sorumluluğu bulacağız.", "Her rolün hakları (yararlanabileceği imkânlar) ve sorumlulukları (yerine getirmesi gereken görevler) vardır.",
        ["“?” işareti “Sorumluluk” sütununda; yani başkanın yapması gereken bir görev aranıyor.", "Sınıf başkanı sınıfı temsil eder; bu yüzden arkadaşlarının görüşlerini dinleyip doğru aktarmalıdır."],
        "“?” yerine <b>sınıf arkadaşlarının görüşlerini dinleyip öğretmene doğru aktarmak</b> yazılmalıdır.", "Hak ile sorumluluk birbirini tamamlar: Öğretmenle görüşme hakkı, görüşleri doğru aktarma sorumluluğunu getirir."),
      { gorsel: G.tablo(["Rol", "Hak", "Sorumluluk"], [["Sınıf başkanı (Emir)", "Sınıf adına öğretmenle görüşmek", "?"], ["Öğrenci", "Eğitim almak", "Derslere hazırlıklı gelmek"]]),
        kural: "Hak = yararlanabileceğimiz imkân; sorumluluk = yerine getirmemiz gereken görev.", dogruNeden: "Sınıfı temsil eden başkanın sorumluluğu, arkadaşlarının görüşlerini doğru biçimde aktarmaktır." }),
  );
  SORU_EKLE("sgru.degisim",
    Q("sgru.degisim", "transfer", 2, "Zaman şeridinde Hasan Bey'in hayatındaki rollerden bazıları verilmiştir. Bu şeride dayanarak hangi yargıya <b>ulaşılabilir</b>?", "İnsanın dâhil olduğu gruplar ve rolleri hayatı boyunca değişir.",
      [["İnsan hayatı boyunca hep aynı rolü üstlenir.", "dikkat", "Şeritte Hasan Bey'in rolleri öğrenci, öğretmen, baba, büyükbaba olarak değişmiştir."],
       ["Bir insan aynı anda yalnızca bir grubun üyesi olabilir.", "kavrama", "35 yaşında Hasan Bey hem öğretmen hem baba; aynı anda birden çok grupta yer alıyor."],
       ["Emekli olan kişinin hiçbir rolü kalmaz.", "dikkat", "65 yaşında Hasan Bey büyükbaba ve dernek gönüllüsüdür; yeni roller edinmiştir."]],
      "Şeritte soldan sağa doğru rollerdeki değişime bak.",
      C("Zaman şeridinden genel bir yargı çıkaracağız.", "Yaşımız, ilgilerimiz ve yaşam koşullarımız değiştikçe gruplarımız ve rollerimiz de değişir.",
        ["8 yaş: öğrenci, kardeş. 20 yaş: üniversite öğrencisi. 35 yaş: öğretmen, baba.", "65 yaş: emekli, büyükbaba, dernek gönüllüsü. Her dönemde roller değişmiş, yenileri eklenmiş."],
        "Ulaşılabilecek yargı: <b>insanın grupları ve rolleri hayatı boyunca değişir</b>.", "Kendi hayatını düşün: İlkokuldan ortaokula geçtiğinde senin de yeni rollerin oldu mu?"),
      { gorsel: zaman([["8 yaş", "öğrenci|kardeş"], ["20 yaş", "üniversite|öğrencisi"], ["35 yaş", "öğretmen|baba"], ["65 yaş", "emekli, büyükbaba|dernek gönüllüsü"]], "Hasan Bey'in rolleri zaman şeridi"),
        kural: "Roller zamanla değişir; insan aynı anda birden çok rol üstlenebilir.", dogruNeden: "Şeritte Hasan Bey'in rolleri yaşamının her döneminde değişmiş ve yeni roller eklenmiştir." }),
  );

  /* ======================= Kültürel Bağlar ve Millî Değerler ======================= */
  SORU_EKLE("skul.bag",
    Q("skul.bag", "hatirlama", 1, "Şemada toplumu bir arada tutan kültürel bağlar gösterilmiştir. “?” ile gösterilen kutuya hangisi yazılmalıdır?", "Gelenek ve görenekler",
      [["Hava durumu", "kavrama", "Hava durumu doğal bir olaydır; toplumu kültürel olarak bir arada tutan bir bağ değildir."],
       ["Trafik ışıkları", "kavrama", "Trafik ışıkları bir düzen aracıdır; kültürel bir bağ sayılmaz."],
       ["Market fiyatları", "kavrama", "Fiyatlar ekonomik bir durumdur; ortak kültürün parçası değildir."]],
      "Dil, din ve tarih gibi kuşaktan kuşağa aktarılan ortak değerleri düşün.",
      C("Şemada eksik kalan kültürel bağı bulacağız.", "Toplumu bir arada tutan kültürel bağlar: ortak dil, din, tarih, gelenek ve görenekler.",
        ["Şemada verilenler: dil, din, tarih.", "Eksik olan, düğün, bayram, misafirlik gibi ortak uygulamalarımızı kapsayan gelenek ve göreneklerdir."],
        "“?” kutusuna <b>gelenek ve görenekler</b> yazılmalıdır.", "Seçenekleri sına: Kuşaktan kuşağa aktarılan ve bizi birleştiren hangisi? Yalnızca gelenek ve görenekler."),
      { gorsel: G.svg(560, 230,
        [["Dil", 90, 45], ["Din", 470, 45], ["Tarih", 90, 185], ["?", 470, 185]].map(([m, x, y]) => `<line class="g-cizgi" x1="280" y1="115" x2="${x}" y2="${y}" stroke-width="2"/>`).join("") +
        `<circle class="g-a" cx="280" cy="115" r="52"/><text class="g-bos" style="font-size:14px" font-weight="700" x="280" y="111" text-anchor="middle">Toplumsal</text><text class="g-bos" style="font-size:14px" font-weight="700" x="280" y="129" text-anchor="middle">birlik</text>` +
        [["Dil", 90, 45], ["Din", 470, 45], ["Tarih", 90, 185], ["?", 470, 185]].map(([m, x, y]) => `<rect class="${m === "?" ? "g-b" : "g-yumusak"} g-cizgi" x="${x - 70}" y="${y - 24}" width="140" height="48" rx="10" stroke-width="1.5"/>` + t13(x, y + 6, m, { b: 1, f: m === "?" ? 24 : 16 })).join(""), "kültürel bağlar şeması"),
        kural: "Kültürel bağlar: dil, din, tarih, gelenek ve görenekler.", dogruNeden: "Dil, din ve tarihle birlikte toplumu bir arada tutan dördüncü kültürel bağ gelenek ve göreneklerdir." }),
  );
  SORU_EKLE("skul.deger",
    Q("skul.deger", "aciklama", 1, "Görseldeki kartlardan hangisi <b>millî sembollerimizden biri değildir</b>?", "C",
      [["A", "bilgi", "Türk bayrağı en önemli millî sembolümüzdür; bağımsızlığımızı temsil eder."],
       ["B", "bilgi", "İstiklâl Marşı millî marşımızdır; millî sembollerimiz arasındadır."],
       ["D", "bilgi", "Türkçe, millî kimliğimizin en önemli ögelerinden biri olan ortak dilimizdir."]],
      "Hangi kart bütün milletin ortak değerini değil, bir eğlence aracını gösteriyor?",
      C("Kartlardan millî sembol olmayanı bulacağız.", "Millî semboller bir milleti temsil eden ortak değerlerdir: bayrak, millî marş, ortak dil gibi.",
        ["A: Türk bayrağı ✔, B: İstiklâl Marşı ✔, D: Türkçe ✔.", "C: Futbol topu bir oyun aracıdır; milleti temsil eden bir sembol değildir."],
        "Millî sembol olmayan kart <b>C</b>'dir.", "Millî sembollere saygı göstermek, birlik ve beraberliğimizi korumanın bir yoludur."),
      { gorsel: kartlar([["A", "🇹🇷|Türk bayrağı"], ["B", "🎵|İstiklâl Marşı"], ["C", "⚽|Futbol topu"], ["D", "🗣️|Türkçe"]], { h: 80, etiket: "dört kart: bayrak, marş, futbol topu, Türkçe" }),
        kural: "Bayrak, İstiklâl Marşı ve Türkçe millî değerlerimizdir.", dogruNeden: "Futbol topu bir oyun aracıdır; milletimizi temsil eden millî bir sembol değildir." }),
  );
  SORU_EKLE("skul.birlik",
    Q("skul.birlik", "baglanti", 2, "Görseldeki üç panelde bir köyde yaşananlar anlatılmıştır. Bu durum hangi geleneğimize örnektir?", "İmece",
      [["Hıdrellez", "bilgi", "Hıdrellez baharın gelişini kutlayan bir gelenektir; birlikte iş yapmayı anlatmaz."],
       ["Nevruz", "bilgi", "Nevruz bahar bayramıdır; köylülerin birlikte ekin toplamasıyla ilgisi yoktur."],
       ["Kına gecesi", "bilgi", "Kına gecesi düğün geleneğidir; ortak bir işi tamamlamakla ilgili değildir."]],
      "Köylüler bir kişinin işini karşılıksız, hep birlikte yapıyor. Bu dayanışma geleneğinin adı ne?",
      C("Panellerdeki dayanışmanın hangi geleneğe örnek olduğunu bulacağız.", "İmece: Bir kişinin ya da köyün işini herkesin karşılıksız ve birlikte yapmasıdır.",
        ["1. panel: Ayşe Teyze'nin buğdayı toplanacak, eli yetmiyor. 2. panel: Köylüler tarlaya geliyor.", "3. panel: İş bir günde bitiyor, herkes birlikte yemek yiyor. Bu, imecedir."],
        "Bu durum <b>imece</b> geleneğine örnektir.", "İmece, kültürel bağlarımızın toplumsal birlikteliği nasıl güçlendirdiğini gösterir."),
      { gorsel: kartlar([["1", "🌾 Ayşe Teyze'nin|buğdayı olgunlaştı,|eli yetmiyor."], ["2", "👥 Bütün köy|orağını alıp|tarlaya geldi."], ["3", "🍲 İş bir günde bitti,|herkes birlikte|yemek yedi."]], { w: 175, h: 100, satir: 3, etiket: "imece panelleri" }),
        kural: "İmece = ortak işi karşılıksız birlikte yapma geleneği.", dogruNeden: "Köylülerin Ayşe Teyze'nin hasadını karşılıksız ve birlikte toplaması imecedir." }),
  );

  /* ======================= Toplumsal Sorunlar ======================= */
  SORU_EKLE("ssor.tanim",
    Q("ssor.tanim", "uygulama", 2, "Bir okulda öğrencilerin okul bahçesindeki çöplerin nedenleriyle ilgili görüşleri grafiğe dökülmüştür (temsilî veriler). Grafiğe göre bu sorunun <b>en önemli nedeni</b> hangisidir?", "Çöp kutularının az olması",
      [["Rüzgârın çöpleri savurması", "islem", "Bu neden 10 kişi tarafından seçilmiş; en çok seçilen neden değildir."],
       ["Temizlik görevlisinin olmaması", "dikkat", "Grafikte böyle bir seçenek yok; grafikte olmayan bilgi cevap olamaz."],
       ["Kantinin pahalı olması", "kavrama", "Kantin fiyatlarının bahçedeki çöplerle bir ilgisi yoktur ve grafikte yer almaz."]],
      "En uzun sütun hangisi?",
      C("Grafikten sorunun en önemli nedenini bulacağız.", "Bir sorunu çözmeden önce nedenlerini belirlemek gerekir; grafikte en çok seçilen neden öncelikli nedendir.",
        ["Grafikteki değerler: çöp kutusu az 32, dikkatsizlik 24, rüzgâr 10.", "En büyük değer 32 → çöp kutularının az olması."],
        "En önemli neden: <b>çöp kutularının az olması</b>.", "Çözüm de nedene yönelik olmalı: Bahçeye daha çok çöp kutusu koymak."),
      { gorsel: G.sutun([["Çöp kutusu az", 32], ["Dikkatsizlik", 24], ["Rüzgâr", 10]], { baslik: "Bahçedeki çöplerin nedeni", birim: "öğrenci" }),
        kural: "Sorunun nedenini bulmak çözümün ilk adımıdır.", dogruNeden: "Grafikte en çok öğrencinin (32) seçtiği neden çöp kutularının az olmasıdır." }),
  );
  SORU_EKLE("ssor.etki",
    Q("ssor.etki", "aciklama", 2, "Şemada bir toplumsal sorunun neden ve sonuçları gösterilmiştir. “?” ile gösterilen kutuya hangisi gelmelidir?", "Trafik sıkışıklığı",
      [["Toplu taşıma kullanımının artması", "kavrama", "Toplu taşımanın artması özel araç sayısını azaltır; şemadaki soruna yol açmaz, çözüm olur."],
       ["Bisiklet yollarının çoğalması", "kavrama", "Bisiklet yolları bu sorunun çözüm önerilerinden biridir, sonucu değil."],
       ["Hava kirliliğinin azalması", "dikkat", "Şemanın sonuç kutusunda hava kirliliğinin arttığı yazıyor; azalması sonuçlarla çelişir."]],
      "Soldaki nedenlerden ortaya çıkan, sağdaki sonuçlara yol açan sorun ne olabilir?",
      C("Neden ve sonuçlarına bakarak ortadaki sorunu bulacağız.", "Toplumsal sorunların nedenleri ve birey ile toplum üzerinde sonuçları vardır.",
        ["Nedenler: özel araç sayısının artması, yolların dar olması.", "Sonuçlar: zaman kaybı, hava kirliliğinin artması, stres. Bunların ortak sorunu trafik sıkışıklığıdır."],
        "“?” kutusuna <b>trafik sıkışıklığı</b> gelir.", "Zinciri oku: Araç çok, yol dar → trafik sıkışıyor → insanlar zaman kaybediyor, hava kirleniyor."),
      { gorsel: G.svg(600, 210,
        [["Özel araç sayısının|artması", 15, 30], ["Yolların dar|olması", 15, 125]].map(([m, x, y]) => `<rect class="g-yumusak g-cizgi" x="${x}" y="${y}" width="160" height="56" rx="8" stroke-width="1.5"/>` + m.split("|").map((s, j) => t13(x + 80, y + 24 + j * 17, s)).join("")).join("") +
        `<rect class="g-b g-cizgi" x="225" y="75" width="150" height="60" rx="10" stroke-width="2"/>` + t13(300, 113, "?", { b: 1, f: 26 }) +
        [["Zaman kaybı", 425, 15], ["Hava kirliliğinin|artması", 425, 80], ["Stres", 425, 155]].map(([m, x, y]) => `<rect class="g-yumusak g-cizgi" x="${x}" y="${y}" width="160" height="${m.includes("|") ? 56 : 40}" rx="8" stroke-width="1.5"/>` + m.split("|").map((s, j) => t13(x + 80, y + 25 + j * 17, s)).join("")).join("") +
        G.ok(177, 58, 222, 95) + G.ok(177, 153, 222, 118) + G.ok(377, 95, 422, 38) + G.ok(377, 105, 422, 108) + G.ok(377, 118, 422, 172) +
        t13(95, 205, "NEDENLER", { b: 1 }) + t13(505, 210, "SONUÇLAR", { b: 1 }), "neden sonuç şeması"),
        kural: "Neden → sorun → sonuç zincirini doğru kur.", dogruNeden: "Araç sayısının artması ve dar yollar trafik sıkışıklığına, o da zaman kaybı, hava kirliliği ve strese yol açar." }),
  );
  SORU_EKLE("ssor.cozum",
    Q("ssor.cozum", "transfer", 2, "Tabloda sorunlar ve öğrencilerin önerdiği çözümler eşleştirilmiştir. Hangi satırdaki çözüm önerisi <b>sorunun nedenine yönelik değildir</b>?", "3. satır",
      [["1. satır", "kavrama", "Musluk açık bırakıldığı için su israf ediliyor; uyarı kartları bu nedene yöneliktir."],
       ["2. satır", "kavrama", "Kitaplar az olduğu için okuma azalıyor; kitap bağışı kampanyası nedene yöneliktir."],
       ["4. satır", "kavrama", "Boş sınıfta ışıkların açık kalması enerji israfına yol açar; son çıkanın ışıkları kapatması nedene yöneliktir."]],
      "Her satırda “Bu çözüm, sorunun nedenini ortadan kaldırır mı?” diye sor.",
      C("Nedene yönelik olmayan çözüm önerisini bulacağız.", "İyi bir çözüm önerisi sorunun nedenini ortadan kaldırmaya yöneliktir; uygulanabilir ve herkesin yararına olmalıdır.",
        ["1., 2. ve 4. satırlardaki öneriler sorunun nedenini doğrudan hedefliyor.", "3. satır: Akran zorbalığına karşı “kantine yeni ürünler eklemek” önerilmiş. Ürün çeşidinin zorbalığın nedenleriyle (saygısızlık, empati eksikliği) ilgisi yok."],
        "Nedene yönelik olmayan öneri <b>3. satırdadır</b>.", "3. satır için uygun bir öneri: Empati ve iletişim etkinlikleri düzenlemek, akran arabuluculuğu yapmak."),
      { gorsel: G.tablo(["", "Sorun", "Çözüm önerisi"], [["1", "Lavabolarda su israfı", "Musluklara “Kapatmayı unutma!” kartı asmak"], ["2", "Az kitap okunması", "Sınıf kitaplığı için kitap bağışı kampanyası"], ["3", "Akran zorbalığı", "Kantine yeni ürünler eklemek"], ["4", "Boş sınıfta yanan ışıklar", "Son çıkan öğrencinin ışıkları kapatması"]]),
        kural: "Çözüm önerisi, sorunun nedenine yönelik olmalıdır.", dogruNeden: "Kantine ürün eklemek akran zorbalığının nedenlerini ortadan kaldırmaz." }),
  );
})();
