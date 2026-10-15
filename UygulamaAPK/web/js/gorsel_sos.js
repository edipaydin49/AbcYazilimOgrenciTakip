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
  // Basit sütun grafiği (eksen adımı elle verilir): veri [[ad, değer]], tepe, adim
  function grafik(veri, { baslik = "", birim = "", tepe, adim }) {
    const W = 600, H = 260, sol = 50, alt = 30, ust = 50, yk = v => ust + (H - ust - alt) * (1 - v / tepe), bw = (W - sol - 10) / veri.length;
    let ic = G.yazi(W / 2, 20, baslik, { b: 1 }) + t13(sol - 40, 40, "(" + birim + ")", { a: "start", f: 12 });
    for (let v = 0; v <= tepe; v += adim) ic += `<line class="g-ince" x1="${sol}" x2="${W - 10}" y1="${yk(v)}" y2="${yk(v)}"/>` + t13(sol - 6, yk(v) + 4, v, { a: "end", f: 12 });
    veri.forEach(([a, v], i) => { const x = sol + i * bw + bw * 0.18, w = bw * 0.64; ic += `<rect class="g-a" x="${x}" y="${yk(v)}" width="${w}" height="${yk(0) - yk(v)}" rx="3"/>` + t13(x + w / 2, H - 10, a, { f: 12 }); });
    return G.svg(W, H, ic + `<line class="g-cizgi" x1="${sol}" x2="${W - 10}" y1="${yk(0)}" y2="${yk(0)}"/>`, baslik);
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

  /* ======================= Konum ======================= */
  SORU_EKLE("skon.mutlak",
    Q("skon.mutlak", "uygulama", 2, "Enlem ve boylam ağında dört nokta işaretlenmiştir. Hangi nokta hem <b>Güney Yarım Küre'de</b> hem de <b>Batı Yarım Küre'de</b> yer alır?", "B",
      [["A", "kavrama", "A, Ekvator'un kuzeyinde (20° K) ve başlangıç meridyeninin doğusundadır (40° D)."],
       ["C", "dikkat", "C batıda (20° B) ama Ekvator'un kuzeyinde (40° K) yer alıyor."],
       ["D", "dikkat", "D Ekvator'un tam üzerinde (0°) ve doğu boylamındadır (60° D); güney yarım kürede değildir."]],
      "Ekvator'un altı güney, başlangıç meridyeninin solu batı yarım küredir.",
      C("İki koşulu birlikte sağlayan noktayı bulacağız.", "Ekvator Dünya'yı kuzey ve güney yarım kürelere; başlangıç meridyeni doğu ve batı yarım kürelere ayırır.",
        ["Noktaların konumları: A (20° K, 40° D), B (20° G, 40° B), C (40° K, 20° B), D (0°, 60° D).", "Güney (G) ve batı (B) değerlerini birlikte taşıyan tek nokta B'dir."],
        "Cevap: <b>B</b> noktası.", "B'nin mutlak konumunu yaz: 20° Güney enlemi, 40° Batı boylamı. İki koşul da sağlanıyor."),
      { gorsel: (() => {
        const W = 560, H = 335, xk = b => 280 + b * 3.8, yk = e => 172 - e * 3.1;
        let ic = "";
        for (let e = -40; e <= 40; e += 20) ic += `<line class="${e === 0 ? "g-cizgi" : "g-ince"}" x1="${xk(-65)}" x2="${xk(65)}" y1="${yk(e)}" y2="${yk(e)}"${e === 0 ? ' stroke-width="2.5"' : ""}/>` + t13(xk(-65) - 6, yk(e) + 4, e === 0 ? "0°" : Math.abs(e) + "° " + (e > 0 ? "K" : "G"), { a: "end", f: 12 });
        for (let b = -60; b <= 60; b += 20) ic += `<line class="${b === 0 ? "g-cizgi" : "g-ince"}" y1="${yk(45)}" y2="${yk(-45)}" x1="${xk(b)}" x2="${xk(b)}"${b === 0 ? ' stroke-width="2.5"' : ""}/>` + t13(xk(b), yk(-45) + 16, b === 0 ? "0°" : Math.abs(b) + "° " + (b > 0 ? "D" : "B"), { f: 12 });
        ic += t13(xk(-63), yk(0) - 6, "Ekvator", { a: "start", f: 12, b: 1 }) + t13(xk(0) + 4, yk(45) - 4, "Başlangıç meridyeni", { a: "start", f: 12, b: 1 });
        [["A", 40, 20], ["B", -40, -20], ["C", -20, 40], ["D", 60, 0]].forEach(([h, b, e]) => { ic += `<circle class="g-d" cx="${xk(b)}" cy="${yk(e)}" r="7"/>` + G.yazi(xk(b) + 10, yk(e) - 8, h, { a: "start", b: 1 }); });
        return G.svg(W, H, ic, "enlem boylam ağında A, B, C, D noktaları");
      })(),
        kural: "Ekvator: kuzey/güney; başlangıç meridyeni: doğu/batı yarım küre.", dogruNeden: "B noktası 20° güney enlemi ile 40° batı boylamının kesiştiği yerdedir." }),
  );
  SORU_EKLE("skon.goreceli",
    Q("skon.goreceli", "uygulama", 2, "Şematik haritada Türkiye ve bazı komşuları gösterilmiştir. Pusula gülüne göre Türkiye'nin <b>güneydoğusunda</b> yer alan komşusu hangisidir?", "Irak",
      [["Gürcistan", "dikkat", "Gürcistan haritada Türkiye'nin kuzeydoğusundadır."],
       ["Bulgaristan", "dikkat", "Bulgaristan Türkiye'nin kuzeybatısındadır."],
       ["Yunanistan", "dikkat", "Yunanistan Türkiye'nin batısındadır."]],
      "Pusula gülünde güney aşağı, doğu sağ taraf. Sağ alt köşeye bak.",
      C("Pusula gülünü kullanarak güneydoğudaki komşuyu bulacağız.", "Göreceli konum, bir yerin başka yerlere göre konumudur. Ara yönler: kuzeydoğu, kuzeybatı, güneydoğu, güneybatı.",
        ["Pusulaya göre: yukarısı kuzey, aşağısı güney, sağı doğu, solu batı. Güneydoğu = sağ alt.", "Haritada sağ alttaki komşu Irak'tır. (Suriye güneyde, Gürcistan kuzeydoğuda.)"],
        "Türkiye'nin güneydoğusundaki komşu: <b>Irak</b>.", "Göreceli konum cümlesi kur: Irak, Türkiye'nin güneydoğusunda, Suriye'nin doğusunda yer alır."),
      { gorsel: G.svg(600, 290,
        `<path class="g-b g-cizgi" fill-opacity="0.55" d="M110 120 Q200 90 320 100 Q420 85 470 110 L480 175 Q380 200 300 195 Q200 205 140 190 Q100 170 110 120 Z" stroke-width="2"/>` + G.yazi(295, 155, "TÜRKİYE", { b: 1 }) +
        [["Bulgaristan", 70, 60], ["Yunanistan", 50, 150], ["Gürcistan", 420, 55], ["İran", 545, 165], ["Irak", 470, 245], ["Suriye", 300, 250]].map(([u, x, y]) => `<rect class="g-yumusak g-cizgi" x="${x - 46}" y="${y - 17}" width="92" height="30" rx="6" stroke-width="1.2"/>` + t13(x, y + 3, u, { f: 12, b: 1 })).join("") +
        pusula(560, 50) + t13(300, 284, "(Şematik çizim)", { f: 11 }), "Türkiye ve komşuları şematik harita"),
        kural: "Ara yönler: KD, KB, GD, GB.", dogruNeden: "Haritada Irak, Türkiye'nin sağ altında yani güneydoğusunda yer almaktadır." }),
  );
  SORU_EKLE("skon.turkiye",
    Q("skon.turkiye", "uygulama", 3, "Görselde Türkiye'nin en batı ve en doğu noktalarından geçen boylamlar gösterilmiştir. Türkiye'nin en doğusu ile en batısı arasındaki <b>yerel saat farkı</b> kaç dakikadır?", "76 dakika",
      [["19 dakika", "kavrama", "19, boylam farkıdır; her boylam 4 dakikalık fark oluşturduğu için 4 ile çarpmak gerekir."],
       ["72 dakika", "islem", "18 boylam sayılmış gibi hesaplanmış; 45 − 26 = 19 boylam farkı vardır."],
       ["60 dakika", "islem", "Bir saatlik fark 15 boylama karşılık gelir; burada boylam farkı 19'dur."]],
      "Önce iki boylam arasındaki farkı bul, sonra her boylam için 4 dakika ekle.",
      C("En doğu ve en batı arasındaki yerel saat farkını hesaplayacağız.", "Ardışık iki boylam arasında 4 dakikalık yerel saat farkı vardır. Doğudaki yerde Güneş daha erken doğar.",
        ["Görselden: en batı 26° D, en doğu 45° D boylamı. Boylam farkı: 45 − 26 = 19.", "Yerel saat farkı: 19 × 4 = 76 dakika."],
        "Yerel saat farkı <b>76 dakikadır</b> (1 saat 16 dakika).", "Sonucu bu yönden de düşün: Doğuda Güneş doğduktan 76 dakika sonra en batıda doğar. Bu yüzden ülke genelinde ortak saat kullanılır."),
      { gorsel: G.svg(600, 230,
        `<path class="g-b g-cizgi" fill-opacity="0.5" d="M80 90 Q200 60 320 75 Q440 55 530 85 L540 150 Q420 180 320 170 Q200 185 120 165 Q70 140 80 90 Z" stroke-width="2"/>` + G.yazi(310, 125, "TÜRKİYE", { b: 1 }) +
        `<line class="g-ok-d" x1="75" y1="20" x2="75" y2="200" stroke-width="3" stroke-dasharray="7 5"/><line class="g-ok-a" x1="545" y1="20" x2="545" y2="200" stroke-width="3" stroke-dasharray="7 5"/>` +
        t13(75, 218, "26° D (en batı)", { b: 1 }) + t13(545, 218, "45° D (en doğu)", { b: 1 }) + ikon(560, 38, "🌅", 26) + t13(310, 30, "1 boylam farkı = 4 dakika", { f: 14 }), "Türkiye'nin en batı ve en doğu boylamları"),
        kural: "Yerel saat farkı = boylam farkı × 4 dakika.", dogruNeden: "45° − 26° = 19 boylam farkı vardır; 19 × 4 = 76 dakika eder." }),
  );
  SORU_EKLE("skon.kita",
    Q("skon.kita", "uygulama", 2, "Şematik dünya haritasında okyanuslar A, B ve C harfleriyle gösterilmiştir. <b>A</b> ile gösterilen okyanus hangisidir?", "Atlas Okyanusu",
      [["Büyük Okyanus (Pasifik)", "dikkat", "Büyük Okyanus, Amerika kıtalarının batısında ve Asya'nın doğusundadır; haritada C ile gösterilmiştir."],
       ["Hint Okyanusu", "dikkat", "Hint Okyanusu Afrika ile Okyanusya arasındadır; haritada B ile gösterilmiştir."],
       ["Akdeniz", "bilgi", "Akdeniz bir okyanus değil, iç denizdir; Avrupa ile Afrika arasındadır."]],
      "A harfinin bir yanında Amerika, öbür yanında Avrupa ve Afrika var.",
      C("A harfiyle gösterilen okyanusu kıtaların konumuna göre bulacağız.", "Atlas Okyanusu: Amerika ile Avrupa-Afrika arası. Hint Okyanusu: Afrika ile Okyanusya arası. Büyük Okyanus: Asya-Okyanusya ile Amerika arası.",
        ["A, Kuzey-Güney Amerika'nın doğusunda, Avrupa ve Afrika'nın batısında.", "Bu konum Atlas Okyanusu'na aittir."],
        "A: <b>Atlas Okyanusu</b>.", "B ve C'yi de adlandır: B Hint Okyanusu, C Büyük Okyanus. Üç harf üç farklı okyanus oldu."),
      { gorsel: G.svg(620, 300,
        `<rect class="g-yumusak" x="0" y="0" width="620" height="300"/>` +
        [["Kuzey|Amerika", 90, 60, 110, 80], ["Güney|Amerika", 140, 160, 70, 90], ["Avrupa", 300, 50, 70, 45], ["Afrika", 300, 115, 90, 110], ["Asya", 390, 40, 150, 90], ["Okyanusya", 500, 185, 85, 50], ["Antarktika", 160, 270, 300, 24]].map(([a, x, y, w, h]) =>
          `<rect class="g-c g-cizgi" fill-opacity="0.55" x="${x}" y="${y}" width="${w}" height="${h}" rx="14" stroke-width="1.2"/>` + a.split("|").map((s, j, d) => t13(x + w / 2, y + h / 2 + 5 + (j - (d.length - 1) / 2) * 16, s, { b: 1, f: 12 })).join("")).join("") +
        [["A", 245, 140], ["B", 440, 200], ["C", 40, 170]].map(([h, x, y]) => `<circle class="g-b g-cizgi" cx="${x}" cy="${y}" r="17" stroke-width="2"/>` + G.yazi(x, y + 6, h, { b: 1 })).join("") +
        `<line class="g-cizgi" stroke-dasharray="6 5" x1="0" x2="620" y1="150" y2="150"/>` + t13(612, 145, "Ekvator", { a: "end", f: 11 }), "şematik dünya haritası, okyanuslar A, B, C"),
        kural: "Atlas: Amerika–Avrupa/Afrika arası; Hint: Afrika–Okyanusya arası; Büyük Okyanus: Asya–Amerika arası.", dogruNeden: "A, Amerika kıtaları ile Avrupa ve Afrika arasında yer aldığı için Atlas Okyanusu'dur." }),
  );

  /* ======================= Doğal ve Beşerî Çevre ======================= */
  SORU_EKLE("scev.unsur",
    Q("scev.unsur", "aciklama", 1, "Numaralı görsellerden hangileri <b>beşerî</b> çevre unsurudur?", "2, 4 ve 6",
      [["1, 3 ve 5", "kavrama", "Dağ, deniz ve orman doğada kendiliğinden oluşur; bunlar doğal unsurlardır."],
       ["1, 2 ve 3", "kavrama", "Dağ (1) ve deniz (3) doğal unsurdur; yalnızca köprü (2) insan yapımıdır."],
       ["2, 3 ve 4", "dikkat", "Deniz (3) insan yapımı değildir; doğal bir unsurdur."]],
      "Hangilerini insan yaptı, hangileri kendiliğinden oluştu?",
      C("Görsellerdeki unsurları doğal ve beşerî olarak ayıracağız.", "Doğal unsurlar insan etkisi olmadan oluşur (dağ, akarsu, orman). Beşerî unsurlar insan eliyle yapılır (yol, köprü, bina, fabrika).",
        ["1 dağ, 3 deniz, 5 orman → doğal.", "2 köprü, 4 fabrika, 6 köy evleri → insan yapımı, beşerî."],
        "Beşerî unsurlar: <b>2, 4 ve 6</b>.", "Sına: “İnsanlar olmasaydı bu var olur muydu?” Köprü, fabrika ve evler olmazdı."),
      { gorsel: G.svg(600, 250, [["1", "🏔️", "dağ"], ["2", "🌉", "köprü"], ["3", "🌊", "deniz"], ["4", "🏭", "fabrika"], ["5", "🌲", "orman"], ["6", "🏘️", "köy evleri"]].map(([n, e, a], i) => {
        const x = 12 + (i % 3) * 196, y = 10 + Math.floor(i / 3) * 120;
        return `<rect class="g-yumusak g-cizgi" x="${x}" y="${y}" width="184" height="110" rx="10" stroke-width="1.5"/>` + rozet(x + 18, y + 18, n) + ikon(x + 92, y + 68, e, 46) + t13(x + 92, y + 100, a, { b: 1, f: 14 });
      }).join(""), "altı görsel: dağ, köprü, deniz, fabrika, orman, köy evleri"),
        kural: "Doğal unsur kendiliğinden oluşur; beşerî unsuru insan yapar.", dogruNeden: "Köprü, fabrika ve köy evleri insan eliyle yapılmış beşerî unsurlardır." }),
  );
  SORU_EKLE("scev.etki",
    Q("scev.etki", "transfer", 3, "Grafikte Doğu Karadeniz kıyısındaki bir şehrin aylık yağış miktarları verilmiştir (temsilî veriler). Bu yağış özelliğinin <b>konutlara etkisi</b> aşağıdakilerden hangisidir?", "Evlerin çatıları dik ve eğimli yapılır.",
      [["Evler düz damlı ve kerpiçten yapılır.", "kavrama", "Düz dam ve kerpiç az yağışlı, kurak yerlere uygundur; bol yağışta kerpiç zarar görür, düz damda su birikir."],
       ["Evlerin çevresine sulama kanalları açılır.", "kavrama", "Her ay bol yağış alan bir yerde sulama ihtiyacı azdır; bu, kurak yerlerin özelliğidir."],
       ["Evler sıcaktan korunmak için kalın duvarlı ve küçük pencereli yapılır.", "kavrama", "Bu özellik çok sıcak ve kurak yerlerin konutlarına uyar; grafik bol yağışı gösteriyor."]],
      "Grafikte yağışın hiç azalmadığı bir ay var mı? Yağmur suyu çatıdan nasıl uzaklaştırılır?",
      C("Yağış grafiğine bakarak konut özelliğini belirleyeceğiz.", "Doğal çevre özellikleri konutların yapımını etkiler. Bol yağışlı yerlerde yağmur suyunun ve karın kolay akması için çatılar eğimli yapılır.",
        ["Grafikte her ay 100 mm'nin üzerinde yağış var; en çok yağış sonbaharda.", "Bütün yıl yağışlı bir yerde suyun birikmemesi için evlerin çatıları dik ve eğimli olur."],
        "Cevap: <b>Evlerin çatıları dik ve eğimli yapılır.</b>", "Ters örnekle sına: Az yağışlı Güneydoğu Anadolu'da düz damlı evler görülür. Demek ki yağış, çatı biçimini belirliyor."),
      { gorsel: grafik([["Oca", 230], ["Şub", 190], ["Mar", 150], ["Nis", 100], ["May", 100], ["Haz", 140], ["Tem", 150], ["Ağu", 200], ["Eyl", 260], ["Eki", 300], ["Kas", 280], ["Ara", 260]], { baslik: "Aylık yağış (temsilî)", birim: "mm", tepe: 300, adim: 50 }),
        kural: "Bol yağış → eğimli çatı; az yağış → düz dam.", dogruNeden: "Yıl boyunca bol yağış alan yerlerde suyun kolay akması için çatılar eğimli yapılır." }),
  );
  SORU_EKLE("scev.insan",
    Q("scev.insan", "baglanti", 2, "Görseldeki kartlarda bir yamaçta yaşanan değişim anlatılmıştır. “?” ile gösterilen kartta <b>en olası sonuç</b> hangisidir?", "Toprak kayması ve sel yaşanması",
      [["Ormanın kendiliğinden hemen yenilenmesi", "kavrama", "Kesilen bir orman uzun yıllarda yetişir; şiddetli yağışla hemen yenilenmez."],
       ["Yamaçtaki toprağın daha da verimli hâle gelmesi", "kavrama", "Ağaç kökleri toprağı tutar; ağaçlar kesilince verimli üst toprak sularla taşınır."],
       ["Yağışın tamamen durması", "kavrama", "Ağaç kesimi yağışı hemen durdurmaz; şiddetli yağış zaten üçüncü kartta görülüyor."]],
      "Ağaç kökleri toprağa ne yapar? Kökler olmazsa yağmur suyu toprağı nereye götürür?",
      C("İnsanın doğayı değiştirmesinin sonucunu kartlardan çıkaracağız.", "Ağaçların kökleri toprağı tutar ve suyu emer. Ağaçlar kesildiğinde erozyon, toprak kayması ve sel riski artar.",
        ["1. kart: Yamaç ormanla kaplı. 2. kart: Ağaçlar kesiliyor.", "3. kart: Şiddetli yağış başlıyor. Toprağı tutan kökler olmadığı için toprak su ile birlikte kayar, sel oluşur."],
        "En olası sonuç: <b>toprak kayması ve sel yaşanması</b>.", "Önlem de düşün: Yamaçları ağaçlandırmak bu tehlikeyi azaltır."),
      { gorsel: kartlar([["1", "🌳🌳🌳|Yamaç ormanla|kaplı"], ["2", "🪓|Ağaçlar|kesildi"], ["3", "⛈️|Şiddetli yağış|başladı"], ["4", "?"]], { w: 135, h: 100, etiket: "yamaçtaki değişim kartları" }),
        kural: "Bitki örtüsünü yok etmek erozyon, sel ve toprak kaymasını artırır.", dogruNeden: "Ağaçları kesilmiş yamaçta şiddetli yağış toprağı sürükler; toprak kayması ve sel olur." }),
  );

  /* ======================= Türk Dünyası ======================= */
  SORU_EKLE("stdu.ortak",
    Q("stdu.ortak", "aciklama", 1, "Kartlardan hangisi Türk dünyasının <b>ortak kültürel ögelerinden biri değildir</b>?", "C",
      [["A", "bilgi", "Nevruz, 21 Mart'ta Türk dünyasının pek çok ülkesinde kutlanan ortak bahar bayramıdır."],
       ["B", "bilgi", "Dede Korkut Hikâyeleri Türk dünyasının ortak destan ve hikâye mirasıdır."],
       ["D", "bilgi", "Manas Destanı, Kırgız Türklerinin büyük destanıdır ve Türk dünyasının ortak mirasındadır."]],
      "Hangi kart Türk kültüründen değil, başka bir kültürden geliyor?",
      C("Türk dünyasının ortak kültürüne ait olmayan kartı bulacağız.", "Türk dünyasının ortak ögeleri: dil, Nevruz gibi bayramlar, Dede Korkut ve Manas gibi destanlar, halk oyunları ve gelenekler.",
        ["A Nevruz ✔, B Dede Korkut ✔, D Manas ✔.", "C Cadılar Bayramı (Halloween) Batı kültürüne ait bir gelenektir."],
        "Ortak kültürel öge olmayan kart <b>C</b>'dir.", "Ortak ögeler Türk devletleri arasındaki kültürel iş birliğinin temelidir."),
      { gorsel: kartlar([["A", "🔥 Nevruz|21 Mart"], ["B", "📜 Dede Korkut|Hikâyeleri"], ["C", "🎃 Cadılar|Bayramı"], ["D", "🐎 Manas|Destanı"]], { h: 78, etiket: "dört kültür kartı" }),
        kural: "Nevruz, Dede Korkut, Manas: Türk dünyasının ortak mirası.", dogruNeden: "Cadılar Bayramı Batı kültürüne ait bir gelenektir; Türk dünyasının ortak ögesi değildir." }),
  );
  SORU_EKLE("stdu.kurum",
    Q("stdu.kurum", "hatirlama", 2, "Tabloda Türk dünyasıyla iş birliği yapan kuruluşlar ve görevleri verilmiştir. “?” ile gösterilen kuruluş hangisidir?", "Yunus Emre Enstitüsü",
      [["TİKA", "bilgi", "TİKA (Türk İşbirliği ve Koordinasyon Ajansı) kalkınma projeleri ve yardımlarıyla bilinir; tabloda ayrı satırda yer alıyor."],
       ["TÜRKSOY", "bilgi", "TÜRKSOY Türk kültürü ve sanatını koruyup tanıtmak için çalışır; tabloda zaten yazılı."],
       ["Türk Devletleri Teşkilatı", "bilgi", "Bu teşkilat Türk devletleri arasında siyasi ve ekonomik iş birliğini geliştirir; Türkçe öğretimi asıl görevi değildir."]],
      "Yurt dışında Türkçe öğreten kuruluşu düşün; adını bir Türk ozanından alır.",
      C("Görevi verilen kuruluşu bulacağız.", "Türkiye'nin kültürel iş birliği kuruluşları: TİKA (kalkınma), TÜRKSOY (kültür-sanat), Yunus Emre Enstitüsü (Türkçe öğretimi ve kültür tanıtımı), Türk Devletleri Teşkilatı (devletler arası iş birliği).",
        ["Tabloda TİKA ve TÜRKSOY yazılı; “?” satırının görevi: yurt dışında Türkçe öğretmek ve Türk kültürünü tanıtmak.", "Bu görev Yunus Emre Enstitüsüne aittir."],
        "Cevap: <b>Yunus Emre Enstitüsü</b>.", "Kuruluşun adı, Türkçeyi ustalıkla kullanan ozan Yunus Emre'den gelir; görevine de çok uygundur."),
      { gorsel: G.tablo(["Kuruluş", "Görevi"], [["TİKA", "Kalkınma projeleri, okul ve hastane yapımı gibi yardımlar"], ["TÜRKSOY", "Türk kültürünü ve sanatını korumak, tanıtmak"], ["?", "Yurt dışında Türkçe öğretmek, Türk kültürünü tanıtmak"]]),
        kural: "Yunus Emre Enstitüsü = Türkçe öğretimi ve kültür tanıtımı.", dogruNeden: "Yurt dışında Türkçe öğretip Türk kültürünü tanıtan kuruluş Yunus Emre Enstitüsüdür." }),
  );

  /* ======================= Türkistan'daki İlk Türk Devletleri ======================= */
  SORU_EKLE("stur.devlet",
    Q("stur.devlet", "hatirlama", 2, "Zaman şeridinde Türkistan'da kurulan ilk Türk devletleri gösterilmiştir. “?” ile gösterilen devlet hangisidir?", "I. Kök Türk Devleti",
      [["Asya Hun Devleti", "dikkat", "Asya Hun Devleti şeridin ilk noktasıdır (MÖ 220)."],
       ["Uygur Devleti", "dikkat", "Uygur Devleti 744'te kurulmuştur; şeridin son noktasıdır."],
       ["Türkiye Selçuklu Devleti", "bilgi", "Türkiye Selçuklu Devleti Anadolu'da 1075'te kurulmuştur; Türkistan'daki ilk devletlerden değildir."]],
      "552 yılında Bumin Kağan hangi devleti kurdu?",
      C("Şeritteki 552 yılına ait devleti bulacağız.", "Türkistan'daki ilk Türk devletleri: Asya Hun (MÖ 220 dolayları), I. Kök Türk (552, Bumin Kağan), Uygur (744).",
        ["Şerit: MÖ 220 Asya Hun → 552 “?” → 744 Uygur.", "552'de Bumin Kağan önderliğinde I. Kök Türk Devleti kuruldu."],
        "“?” yerine <b>I. Kök Türk Devleti</b> gelir.", "Kök Türkler “Türk” adını devlet adı olarak kullanan ilk Türk devletidir; Orhun Yazıtları da onlara aittir."),
      { gorsel: zaman([["MÖ 220", "Asya Hun|Devleti"], ["552", "?"], ["744", "Uygur|Devleti"]], "ilk Türk devletleri zaman şeridi"),
        kural: "Asya Hun → Kök Türk (552) → Uygur (744).", dogruNeden: "552 yılında Bumin Kağan tarafından I. Kök Türk Devleti kurulmuştur." }),
  );
  SORU_EKLE("stur.yasam",
    Q("stur.yasam", "aciklama", 1, "Görselde göçebe bir Türk ailesinin yıl içindeki yer değiştirmesi gösterilmiştir. “?” ile gösterilen, yazın çıkılan serin ve otlağı bol yere ne ad verilir?", "Yaylak",
      [["Kışlak", "kavrama", "Kışlak kışın inilen, daha korunaklı ve ılık yerdir; görselde aşağıdadır."],
       ["Otağ", "bilgi", "Otağ hükümdarın çadırıdır; bir mevsimlik yer adı değildir."],
       ["Kurultay", "bilgi", "Kurultay devlet işlerinin görüşüldüğü meclistir."]],
      "Yaz → yayla, kış → kışla sözcüklerini düşün.",
      C("Görselde yazın gidilen yerin adını bulacağız.", "Göçebe Türkler hayvanlarına otlak bulmak için yazın yüksek ve serin yaylaklara çıkar, kışın korunaklı kışlaklara inerdi.",
        ["Görselde dağın üst kısmında güneş (yaz) ve “?” var; alt kısımda kar tanesi (kış) ve “kışlak” yazıyor.", "Yazın çıkılan yüksek ve serin otlak → yaylak."],
        "“?” yerine <b>yaylak</b> gelir.", "Bu yaşam biçimi bugün de yayla geleneği olarak bazı bölgelerimizde sürüyor."),
      { gorsel: G.svg(560, 250, `<path class="g-c g-cizgi" fill-opacity="0.45" d="M20 230 L250 40 L310 70 L540 230 Z" stroke-width="2"/>` +
        `<rect class="g-b g-cizgi" x="210" y="70" width="110" height="44" rx="8" stroke-width="2"/>` + t13(265, 100, "?", { b: 1, f: 24 }) + ikon(355, 70, "☀️", 30) + t13(265, 132, "YAZ", { b: 1 }) +
        `<rect class="g-yumusak g-cizgi" x="60" y="180" width="110" height="40" rx="8" stroke-width="2"/>` + t13(115, 205, "kışlak", { b: 1, f: 15 }) + ikon(200, 210, "❄️", 26) + t13(115, 170, "KIŞ", { b: 1 }) +
        G.ok(150, 175, 215, 118, "g-ok-a") + G.ok(240, 120, 175, 180, "g-ok-d") + ikon(470, 215, "⛺", 30) + ikon(420, 215, "🐑", 26), "yaylak ve kışlak şeması"),
        kural: "Yaz: yaylak (yüksek, serin). Kış: kışlak (alçak, korunaklı).", dogruNeden: "Göçebe Türklerin yazın çıktığı yüksek ve serin otlaklara yaylak denir." }),
  );
  SORU_EKLE("stur.katki",
    Q("stur.katki", "uygulama", 2, "Bilgi kartında tanıtılan eser hangisidir?", "Orhun Yazıtları",
      [["Kutadgu Bilig", "bilgi", "Kutadgu Bilig, Karahanlılar döneminde Yusuf Has Hacib'in yazdığı bir kitaptır; taşa kazınmamıştır."],
       ["Divanü Lugati't-Türk", "bilgi", "Bu eser Kaşgarlı Mahmud'un XI. yüzyılda yazdığı Türkçe–Arapça sözlüktür."],
       ["Dede Korkut Hikâyeleri", "bilgi", "Dede Korkut Hikâyeleri sözlü gelenekten derlenen hikâyelerdir; Kök Türk alfabesiyle taşa yazılmamıştır."]],
      "Karttaki ipuçları: taş anıt, Kök Türk alfabesi, Bilge Kağan, Kül Tigin, Tonyukuk.",
      C("Karttaki bilgilerden eseri tanıyacağız.", "Kök Türkler VIII. yüzyılda Bilge Kağan, Kül Tigin ve Tonyukuk adına taş anıtlar diktirmiştir. Bunlara Orhun Yazıtları (Orhun Abideleri) denir.",
        ["Kartta “taş anıt”, “VIII. yüzyıl”, “Kök Türk alfabesi” ve “Bilge Kağan, Kül Tigin, Tonyukuk” adları var.", "Bu bilgilerin hepsi Orhun Yazıtları'nı anlatır."],
        "Kartta tanıtılan eser: <b>Orhun Yazıtları</b>.", "Orhun Yazıtları, “Türk” adının geçtiği ilk Türkçe yazılı belgelerdendir; Türk tarihinin önemli bir kaynağıdır."),
      { gorsel: G.svg(560, 200, `<rect class="g-yumusak g-cizgi" x="10" y="10" width="540" height="180" rx="12" stroke-width="2"/>` +
        `<path class="g-bos g-cizgi" d="M40 175 L40 50 Q70 25 100 50 L100 175 Z" stroke-width="2"/>` + [70, 95, 120, 145].map(y => `<line class="g-ince" x1="52" x2="88" y1="${y}" y2="${y}"/>`).join("") +
        ["• Taşa kazınmış anıtlardır.", "• VIII. yüzyılda dikilmiştir.", "• Kök Türk alfabesiyle yazılmıştır.", "• Bilge Kağan, Kül Tigin ve Tonyukuk", "  adına diktirilmiştir."].map((s, i) => t13(125, 48 + i * 30, s, { a: "start", f: 15 })).join(""), "bir eseri tanıtan bilgi kartı"),
        kural: "Orhun Yazıtları: VIII. yüzyıl, Kök Türkler, Kök Türk alfabesi.", dogruNeden: "Kök Türk alfabesiyle VIII. yüzyılda Bilge Kağan, Kül Tigin ve Tonyukuk adına dikilen taş anıtlar Orhun Yazıtları'dır." }),
  );

  /* ======================= İslam Medeniyeti ======================= */
  SORU_EKLE("sisl.kurum",
    Q("sisl.kurum", "hatirlama", 1, "Tabloda İslam medeniyetinde kurulan bazı kurumlar ve görevleri verilmiştir. “?” ile gösterilen kurum hangisidir?", "Rasathane",
      [["Medrese", "bilgi", "Medrese eğitim kurumudur; tabloda ayrı satırda yer alıyor."],
       ["Darüşşifa", "bilgi", "Darüşşifa hastaların tedavi edildiği sağlık kurumudur."],
       ["Kervansaray", "bilgi", "Kervansaray ticaret yollarında konaklama yeridir; gök cisimleri gözlemlenmez."]],
      "Gök cisimlerini gözlemlemek için kurulan yapıya ne denir?",
      C("Tablodaki görevine göre kurumu bulacağız.", "İslam medeniyetinin kurumları: medrese (eğitim), darüşşifa (sağlık), rasathane (gökbilim gözlemi), Beytülhikme (çeviri ve bilim, Bağdat).",
        ["“?” satırının görevi: gök cisimlerini gözlemlemek, takvim hazırlamak.", "Bu görev gözlemevi, yani rasathanedir."],
        "“?” yerine <b>rasathane</b> gelir.", "Bugünkü adıyla rasathane “gözlemevi” demektir; tablodaki görevle tam örtüşür."),
      { gorsel: G.tablo(["Kurum", "Görevi"], [["🏫 Medrese", "Eğitim ve öğretim"], ["🏥 Darüşşifa", "Hastaların tedavisi"], ["🔭 ?", "Gök cisimlerini gözlemlemek, takvim hazırlamak"], ["📚 Beytülhikme", "Kitapların çevrilmesi ve bilimsel çalışmalar"]]),
        kural: "Rasathane = gözlemevi.", dogruNeden: "Gök cisimlerinin gözlemlendiği ve takvim çalışmalarının yapıldığı kurum rasathanedir." }),
  );
  SORU_EKLE("sisl.bilgin",
    Q("sisl.bilgin", "uygulama", 2, "Görselde numaralı bilim insanları ile harfli çalışma alanları verilmiştir. Doğru eşleştirme hangisidir?", "1-b, 2-a, 3-c",
      [["1-a, 2-b, 3-c", "bilgi", "Harezmî cebirle, İbn Sina tıpla tanınır; ilk iki eşleştirme ters olmuş."],
       ["1-c, 2-a, 3-b", "bilgi", "Dünya'nın çevresini hesaplayan Biruni'dir (3); Harezmî ise cebirle tanınır."],
       ["1-b, 2-c, 3-a", "bilgi", "İbn Sina, El-Kanun fi't-Tıb adlı tıp kitabıyla tanınır; tıp “a” seçeneğidir."]],
      "Her bilim insanının en bilinen çalışmasını hatırla: cebir, tıp, Dünya'nın çevresi.",
      C("Bilim insanlarını çalışma alanlarıyla eşleştireceğiz.", "Harezmî: cebirin kurucusu sayılır. İbn Sina: El-Kanun fi't-Tıb adlı tıp eseri. Biruni: Dünya'nın çevresini büyük bir doğrulukla hesapladı.",
        ["1 Harezmî → b (cebir).", "2 İbn Sina → a (tıp); 3 Biruni → c (Dünya'nın çevresini hesaplama)."],
        "Doğru eşleştirme: <b>1-b, 2-a, 3-c</b>.", "Her harf yalnızca bir kez kullanıldı; eşleştirme eksiksiz."),
      { gorsel: G.svg(560, 200,
        [["1", "Harezmî"], ["2", "İbn Sina"], ["3", "Biruni"]].map(([n, a], i) => `<rect class="g-yumusak g-cizgi" x="20" y="${15 + i * 62}" width="170" height="48" rx="10" stroke-width="1.5"/>` + rozet(42, 39 + i * 62, n) + t13(118, 44 + i * 62, a, { b: 1, f: 15 })).join("") +
        [["a", "🩺 Tıp (El-Kanun)"], ["b", "➗ Cebir"], ["c", "🌍 Dünya'nın çevresini hesaplama"]].map(([h, a], i) => `<rect class="g-b g-cizgi" fill-opacity="0.45" x="250" y="${15 + i * 62}" width="290" height="48" rx="10" stroke-width="1.5"/>` + rozet(272, 39 + i * 62, h) + t13(405, 44 + i * 62, a, { f: 14 })).join(""), "bilim insanları ve çalışma alanları"),
        kural: "Harezmî–cebir, İbn Sina–tıp, Biruni–Dünya'nın çevresi.", dogruNeden: "Harezmî cebirle, İbn Sina tıpla, Biruni Dünya'nın çevresini hesaplamasıyla tanınır." }),
  );
  SORU_EKLE("sisl.miras",
    Q("sisl.miras", "baglanti", 2, "Akış şemasında İbn Sina'nın tıp kitabının yolculuğu gösterilmiştir. Bu şema en çok hangi yargıyı destekler?", "İslam medeniyetinin bilgi birikimi Avrupa'ya aktarılarak insanlığın ortak mirası olmuştur.",
      [["İslam medeniyetinde yazılan kitaplar yalnızca Müslümanlar tarafından okunmuştur.", "dikkat", "Şemada kitabın Latinceye çevrilip Avrupa üniversitelerinde okutulduğu görülüyor."],
       ["Avrupa'da tıp alanında hiç kitap okunmamıştır.", "kavrama", "Şema tam tersine Avrupa'da bu tıp kitabının ders kitabı olarak okutulduğunu gösteriyor."],
       ["Bilgi bir medeniyetten diğerine aktarılamaz.", "kavrama", "Şemanın bütünü bilginin bir medeniyetten ötekine aktarılmasını anlatıyor."]],
      "Şemadaki okları takip et: Kitap nerede yazıldı, nereye ulaştı?",
      C("Akış şemasından genel bir yargı çıkaracağız.", "VII–XIII. yüzyıllarda İslam dünyasında yazılan bilim eserleri çevirilerle Avrupa'ya ulaşmış ve Avrupa'daki bilimsel gelişmelere katkı sağlamıştır.",
        ["1. kutu: İbn Sina El-Kanun fi't-Tıb'ı yazdı (XI. yüzyıl). 2. kutu: Kitap Latinceye çevrildi (XII. yüzyıl).", "3. kutu: Kitap Avrupa üniversitelerinde yüzyıllarca ders kitabı olarak okutuldu."],
        "Şema, <b>İslam medeniyetinin bilgi birikiminin Avrupa'ya aktarılarak insanlığın ortak mirası olduğunu</b> destekler.", "Benzer örnek: Harezmî'nin cebir kitabı da Latinceye çevrilmiş, “algoritma” sözcüğü onun adından türemiştir."),
      { gorsel: G.svg(620, 140,
        [["İbn Sina, El-Kanun|fi't-Tıb'ı yazdı.|(XI. yüzyıl)", 10], ["Kitap Latinceye|çevrildi.|(XII. yüzyıl)", 215], ["Avrupa üniversitelerinde|ders kitabı olarak|okutuldu.", 420]].map(([m, x]) =>
          `<rect class="g-yumusak g-cizgi" x="${x}" y="20" width="190" height="100" rx="10" stroke-width="1.5"/>` + m.split("|").map((s, j) => t13(x + 95, 52 + j * 20, s, { f: 13 })).join("")).join("") +
        G.ok(201, 70, 213, 70) + G.ok(406, 70, 418, 70), "bir tıp kitabının yolculuğu akış şeması"),
        kural: "Çeviri, bilginin medeniyetler arasında aktarılmasını sağlar.", dogruNeden: "Şema, İslam dünyasında yazılan bir eserin çevrilip Avrupa'da okutulduğunu, yani bilginin insanlığın ortak mirasına katıldığını gösterir." }),
  );

  /* ======================= İslamiyet'in Kabulü ======================= */
  SORU_EKLE("siye.kabul",
    Q("siye.kabul", "hatirlama", 2, "Zaman şeridinde Türklerin İslamiyet'i kabul sürecindeki bazı olaylar gösterilmiştir. “?” ile gösterilen olay hangisidir?", "Talas Savaşı",
      [["Malazgirt Meydan Muharebesi", "bilgi", "Malazgirt 1071'de, Büyük Selçuklular ile Bizans arasında olmuştur; 751 ile ilgisi yoktur."],
       ["Dandanakan Savaşı", "dikkat", "Dandanakan Savaşı 1040'tadır; şeritte zaten son nokta olarak yazılı."],
       ["Kösedağ Savaşı", "bilgi", "Kösedağ Savaşı 1243'te Türkiye Selçukluları ile Moğollar arasında olmuştur."]],
      "751'de Türklerin Abbasilerle birlikte Çinlilere karşı savaştığı olayı hatırla.",
      C("Şeritteki 751 yılına ait olayı bulacağız.", "751 Talas Savaşı'nda Abbasiler ile Türkler birlikte Çin'e karşı savaştı; bu, Türklerin İslamiyet'e yakınlaşmasında önemli bir dönüm noktası oldu.",
        ["Şerit: 751 “?” → X. yüzyıl Karahanlılar İslamiyet'i kabul etti → 1040 Dandanakan Savaşı.", "751'deki olay Talas Savaşı'dır."],
        "“?” yerine <b>Talas Savaşı</b> gelir.", "Sıra mantıklı mı? Önce yakınlaşma (751), sonra ilk Müslüman Türk devleti (X. yüzyıl), sonra Büyük Selçukluların güçlenmesi (1040)."),
      { gorsel: zaman([["751", "?"], ["X. yüzyıl", "Karahanlılar|İslamiyet'i kabul etti"], ["1040", "Dandanakan|Savaşı"]], "İslamiyet'in kabulü zaman şeridi"),
        kural: "751 Talas → Karahanlılar (ilk Müslüman Türk devleti) → 1040 Dandanakan.", dogruNeden: "751'de Türklerin Abbasilerle birlikte Çin'e karşı savaştığı olay Talas Savaşı'dır." }),
  );
  SORU_EKLE("siye.eser",
    Q("siye.eser", "uygulama", 2, "Görseldeki eser kartlarından hangisi, Türkçenin Arapça kadar zengin bir dil olduğunu göstermek amacıyla yazılmış <b>sözlüktür</b>?", "B",
      [["A", "bilgi", "Kutadgu Bilig mutluluk veren bilgi anlamına gelir; devlet yönetimini anlatan öğüt kitabıdır, sözlük değildir."],
       ["C", "bilgi", "Atabetü'l-Hakayık ahlaki öğütler içeren manzum bir eserdir."],
       ["D", "bilgi", "Divan-ı Hikmet, Hoca Ahmet Yesevi'nin dinî-tasavvufi şiirlerinden oluşur."]],
      "Kaşgarlı Mahmud'un eserini bul.",
      C("Kartlar arasından Türkçe–Arapça sözlüğü bulacağız.", "Divanü Lugati't-Türk, Kaşgarlı Mahmud'un XI. yüzyılda Araplara Türkçe öğretmek ve Türkçenin zenginliğini göstermek için yazdığı sözlüktür.",
        ["A Kutadgu Bilig (Yusuf Has Hacib), C Atabetü'l-Hakayık (Edip Ahmet Yükneki), D Divan-ı Hikmet (Hoca Ahmet Yesevi).", "B Divanü Lugati't-Türk (Kaşgarlı Mahmud) → sözlük."],
        "Cevap: <b>B</b> kartı.", "Eserin adı da ipucu verir: “Lugat” sözcüğü sözlük anlamına gelir."),
      { gorsel: kartlar([["A", "Kutadgu Bilig|Yusuf Has Hacib"], ["B", "Divanü Lugati't-Türk|Kaşgarlı Mahmud"], ["C", "Atabetü'l-Hakayık|Edip Ahmet Yükneki"], ["D", "Divan-ı Hikmet|Hoca Ahmet Yesevi"]], { w: 260, h: 64, satir: 2, etiket: "dört eser kartı" }),
        kural: "Divanü Lugati't-Türk = Kaşgarlı Mahmud'un Türkçe–Arapça sözlüğü.", dogruNeden: "B kartındaki Divanü Lugati't-Türk, Türkçenin zenginliğini göstermek için yazılmış bir sözlüktür." }),
  );
  SORU_EKLE("siye.yasam",
    Q("siye.yasam", "uygulama", 1, "Kartlarda Türk-İslam mimarisindeki bazı yapıların görevleri verilmiştir. <b>C kartında</b> anlatılan yapı hangisidir?", "Kervansaray",
      [["Kümbet", "bilgi", "Kümbet, önemli kişiler için yapılan mezar yapısıdır; A kartında anlatılmıştır."],
       ["Medrese", "bilgi", "Medrese eğitim kurumudur; B kartında anlatılmıştır."],
       ["Darüşşifa", "bilgi", "Darüşşifa hastanedir; D kartında anlatılmıştır."]],
      "C kartındaki ipuçları: deve, ticaret yolu, tüccarlar, konaklama.",
      C("C kartındaki görevi taşıyan yapıyı bulacağız.", "Türk-İslam mimarisi: kümbet (mezar yapısı), medrese (okul), kervansaray (ticaret yolunda konaklama), darüşşifa (hastane).",
        ["C kartı: “Ticaret yolları üzerinde tüccarların ve kervanların konakladığı yapı.”", "Bu görev kervansaraya aittir."],
        "C kartındaki yapı: <b>kervansaray</b>.", "Kervansaraylar ticareti güvenli hâle getirerek şehirlerin gelişmesine katkı sağlamıştır."),
      { gorsel: kartlar([["A", "Önemli kişiler için|yapılan mezar yapısı"], ["B", "📖 Öğrencilerin ders|gördüğü eğitim kurumu"], ["C", "🐫 Ticaret yolunda|tüccarların konakladığı|yapı"], ["D", "🩺 Hastaların tedavi|edildiği yapı"]], { w: 260, h: 78, satir: 2, etiket: "dört yapı kartı" }),
        kural: "Kervansaray = ticaret yolundaki konaklama yapısı.", dogruNeden: "Ticaret yolları üzerinde kervanların konakladığı yapıya kervansaray denir." }),
  );

  /* ======================= Anadolu'nun Türkleşmesi ======================= */
  SORU_EKLE("sana.malazgirt",
    Q("sana.malazgirt", "hatirlama", 2, "Zaman şeridinde “?” ile gösterilen olay hangisidir?", "Türkiye Selçuklu Devleti'nin kurulması",
      [["Miryokefalon Savaşı", "dikkat", "Miryokefalon 1176'dadır; şeritte zaten yazılı."],
       ["İstanbul'un fethi", "bilgi", "İstanbul 1453'te Osmanlılar tarafından fethedilmiştir."],
       ["Talas Savaşı", "bilgi", "Talas Savaşı 751'dedir; Malazgirt'ten çok öncedir."]],
      "Malazgirt'ten (1071) dört yıl sonra Süleyman Şah ne yaptı?",
      C("Şeritteki 1075 yılına ait olayı bulacağız.", "1071 Malazgirt Zaferi Anadolu'nun kapılarını Türklere açtı; 1075'te Süleyman Şah, İznik merkezli Türkiye Selçuklu Devleti'ni kurdu.",
        ["Şerit: 1071 Malazgirt → 1075 “?” → 1176 Miryokefalon → 1243 Kösedağ.", "1075'teki olay: Türkiye Selçuklu Devleti'nin kurulması."],
        "“?” yerine <b>Türkiye Selçuklu Devleti'nin kurulması</b> gelir.", "Malazgirt'ten hemen sonra Anadolu'da kurulan Türk devletleri, zaferin sonuçlarını gösterir."),
      { gorsel: zaman([["1071", "Malazgirt|Zaferi"], ["1075", "?"], ["1176", "Miryokefalon|Savaşı"], ["1243", "Kösedağ|Savaşı"]], "1071–1243 zaman şeridi"),
        kural: "1071 Malazgirt → 1075 Türkiye Selçuklu → 1176 Miryokefalon → 1243 Kösedağ.", dogruNeden: "1075'te Süleyman Şah, İznik merkezli Türkiye Selçuklu Devleti'ni kurmuştur." }),
  );
  SORU_EKLE("sana.beylik",
    Q("sana.beylik", "uygulama", 2, "Şematik haritada Malazgirt'ten sonra Anadolu'da kurulan ilk Türk beylikleri gösterilmiştir. İzmir ve çevresinde kurulan, Türk denizciliğinin temelini atan ve haritada “?” ile gösterilen beylik hangisidir?", "Çaka Beyliği",
      [["Saltuklular", "dikkat", "Saltuklular Erzurum ve çevresinde kurulmuştur; haritada doğuda gösterilmiştir."],
       ["Artuklular", "dikkat", "Artuklular Diyarbakır, Mardin ve Hasankeyf çevresinde, güneydoğudadır."],
       ["Danişmentliler", "dikkat", "Danişmentliler Sivas, Tokat ve Amasya çevresinde, iç kuzeyde kurulmuştur."]],
      "Haritanın en batısında, Ege kıyısındaki beyliği düşün; ilk Türk donanmasını kurmuştur.",
      C("Haritada İzmir'deki beyliği bulacağız.", "İlk Türk beylikleri: Danişmentliler (Sivas-Tokat), Saltuklular (Erzurum), Mengücekliler (Erzincan-Divriği), Artuklular (Diyarbakır-Mardin), Çaka Beyliği (İzmir).",
        ["Haritada doğu ve iç kesimlerdeki beylikler yazılı; “?” batıda, Ege kıyısında, İzmir'de.", "İzmir'de kurulan ve ilk Türk donanmasını oluşturan beylik Çaka Beyliği'dir."],
        "“?” yerine <b>Çaka Beyliği</b> gelir.", "Çaka Bey'in donanması, Türklerin denizlerde de güçlenmeye başladığını gösterir."),
      { gorsel: G.svg(600, 260,
        `<path class="g-b g-cizgi" fill-opacity="0.45" d="M60 95 Q200 60 320 75 Q440 55 560 85 L570 160 Q450 200 330 195 Q200 215 110 190 Q50 160 60 95 Z" stroke-width="2"/>` + t13(300, 40, "KARADENİZ", { f: 12 }) + t13(300, 245, "AKDENİZ", { f: 12 }) + t13(25, 140, "EGE", { f: 12 }) +
        [["Danişmentliler", 300, 110], ["Saltuklular", 505, 105], ["Mengücekliler", 420, 140], ["Artuklular", 460, 182], ["?", 100, 140]].map(([a, x, y]) =>
          `<circle class="g-d" cx="${x}" cy="${y}" r="6"/>` + t13(x, y - 10, a, { b: 1, f: a === "?" ? 24 : 13 })).join("") + t13(100, 162, "(İzmir)", { f: 12 }) + pusula(560, 42), "ilk Türk beylikleri şematik haritası"),
        kural: "Çaka Beyliği: İzmir, ilk Türk donanması.", dogruNeden: "İzmir ve çevresinde kurulan ve ilk Türk donanmasını oluşturan beylik Çaka Beyliği'dir." }),
  );
  SORU_EKLE("sana.turklesme",
    Q("sana.turklesme", "aciklama", 2, "Tabloda Anadolu'da yapılan savaşlar ve sonuçları verilmiştir. “?” ile gösterilen sonuç hangisidir?", "Türkiye Selçukluları Moğol hâkimiyetine girdi, Anadolu'da beylikler dönemi başladı.",
      [["Anadolu'nun kapıları Türklere açıldı.", "dikkat", "Bu sonuç 1071 Malazgirt Zaferi'ne aittir; tabloda ilk satırda yazılı."],
       ["Bizans, Anadolu'yu Türklerden geri alma umudunu yitirdi.", "dikkat", "Bu sonuç 1176 Miryokefalon Savaşı'na aittir."],
       ["İstanbul fethedildi ve Orta Çağ kapandı.", "bilgi", "İstanbul 1453'te fethedilmiştir; Kösedağ ile ilgisi yoktur."]],
      "Kösedağ'da Türkiye Selçukluları kime yenildi?",
      C("Kösedağ Savaşı'nın sonucunu bulacağız.", "1243 Kösedağ Savaşı'nda Türkiye Selçukluları Moğollara yenildi; devlet zayıfladı ve zamanla Anadolu'da beylikler dönemi başladı.",
        ["Tabloda Malazgirt (1071) ve Miryokefalon (1176) sonuçları yazılı.", "“?” Kösedağ (1243) satırında. Bu savaşta Moğollar kazandı; Selçuklular Moğol hâkimiyetine girdi."],
        "“?” yerine <b>Türkiye Selçukluları Moğol hâkimiyetine girdi, Anadolu'da beylikler dönemi başladı</b> gelir.", "Üç savaşı sırayla düşün: Anadolu'ya giriş (1071) → Anadolu'nun Türk yurdu olması (1176) → Selçukluların zayıflaması (1243)."),
      { gorsel: G.tablo(["Savaş", "Yıl", "Sonucu"], [["Malazgirt", "1071", "Anadolu'nun kapıları Türklere açıldı."], ["Miryokefalon", "1176", "Bizans, Anadolu'yu geri alma umudunu yitirdi."], ["Kösedağ", "1243", "?"]]),
        kural: "Kösedağ (1243): Moğollara yenilgi, Selçukluların zayıflaması.", dogruNeden: "Kösedağ Savaşı'nda Moğollara yenilen Türkiye Selçukluları Moğol hâkimiyetine girmiş, zamanla beylikler dönemi başlamıştır." }),
  );
})();
