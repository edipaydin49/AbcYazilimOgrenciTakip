/* Türkçe — görselli ek sorular (afiş, karikatür şeridi, not kâğıdı, tablo, grafik, şema ve harita okuma).
 * Her sorunun görseli çözüm için gereklidir; görseller yalnızca g-* sınıflarıyla çizilir. Metinler özgündür.
 */
(function () {
  "use strict";
  const { S, Q, G } = OGR;

  /* Çözüm kurucu: 🔎 anla → 💡 hatırla → ✏️ adımlar → ✅ sonuç → 🔁 kontrol */
  const C = (anla, hatirla, adimlar, sonuc, kontrol) =>
    ["🔎 Soruyu anlayalım: " + anla, "💡 Hatırlayalım: " + hatirla].concat(adimlar.map(a => "✏️ " + a), ["✅ Sonuç: " + sonuc, "🔁 Kontrol edelim: " + kontrol]);

  /* ---------- Görsel yardımcıları ---------- */
  // 13 piksellik koyu metin (konuşma balonları ve kartlar için)
  const t13 = (x, y, s, o = {}) => `<text class="g-yazi" style="font-size:${o.f || 13}px" x="${x}" y="${y}" text-anchor="${o.a || "middle"}"${o.b ? ' font-weight="700"' : ""}>${s}</text>`;
  const ikon = (x, y, e, b = 34) => `<text x="${x}" y="${y}" font-size="${b}" text-anchor="middle">${e}</text>`;
  // Afiş / pano: başlık şeridi + sola yaslı satırlar ("|" ile ayrılır)
  function afis(baslik, govde, { alt = "", W = 560, etiket = "afiş" } = {}) {
    const s = govde.split("|"), H = 84 + s.length * 24 + (alt ? 24 : 0);
    let ic = `<rect class="g-yumusak g-cizgi" x="8" y="8" width="${W - 16}" height="${H - 16}" rx="14" stroke-width="2"/>` +
      `<rect class="g-b" x="9" y="9" width="${W - 18}" height="44" rx="13"/>` + G.yazi(W / 2, 37, baslik, { b: 1 });
    s.forEach((t, i) => { ic += G.yazi(28, 84 + i * 24, t, { a: "start" }); });
    if (alt) ic += G.yazi(W / 2, H - 20, alt, { k: 1 });
    return G.svg(W, H, ic, etiket);
  }
  // Basit çöp adam (yüz çizilmez)
  const kisi = (x, y, ad) => `<circle class="g-b g-cizgi" cx="${x}" cy="${y}" r="13" stroke-width="2"/>` +
    `<line class="g-cizgi" x1="${x}" y1="${y + 13}" x2="${x}" y2="${y + 44}" stroke-width="3"/><line class="g-cizgi" x1="${x - 16}" y1="${y + 24}" x2="${x + 16}" y2="${y + 24}" stroke-width="3"/>` +
    `<line class="g-cizgi" x1="${x}" y1="${y + 44}" x2="${x - 11}" y2="${y + 64}" stroke-width="3"/><line class="g-cizgi" x1="${x}" y1="${y + 44}" x2="${x + 11}" y2="${y + 64}" stroke-width="3"/>` +
    (ad ? t13(x, y + 82, ad, { b: 1 }) : "");
  // Konuşma balonu: üst-sol köşe (x,y), genişlik w, satırlar "|" ile; kuyruk kx noktasına iner
  function balon(x, y, w, metin, kx) {
    const s = metin.split("|"), h = 14 + s.length * 17;
    return `<path class="g-bos g-cizgi" d="M${kx - 7} ${y + h - 2} L${kx} ${y + h + 14} L${kx + 9} ${y + h - 2}" stroke-width="1.5"/>` +
      `<rect class="g-bos g-cizgi" x="${x}" y="${y}" width="${w}" height="${h}" rx="12" stroke-width="1.5"/>` +
      s.map((t, i) => t13(x + w / 2, y + 22 + i * 17, t)).join("");
  }
  // Karikatür şeridi: [{ ust, balon, ad, ikon }] — her panel 170 px
  function serit(paneller, etiket) {
    const pw = 170, W = paneller.length * pw + 10, H = 262;
    let ic = "";
    paneller.forEach((p, i) => {
      const x = 5 + i * pw, cx = x + pw / 2;
      ic += `<rect class="g-bos g-cizgi" x="${x + 4}" y="5" width="${pw - 8}" height="${H - 10}" rx="8" stroke-width="2"/>`;
      ic += `<circle class="g-a" cx="${x + 22}" cy="24" r="12"/>` + `<text class="g-bos" style="font-size:13px" font-weight="700" x="${x + 22}" y="29" text-anchor="middle">${i + 1}</text>`;
      if (p.ust) p.ust.split("|").forEach((t, j) => { ic += t13(x + 40, 22 + j * 15, t, { a: "start", f: 12 }); });
      if (p.balon) ic += balon(x + 12, p.ust && p.ust.includes("|") ? 50 : 44, pw - 24, p.balon, cx - 20);
      ic += kisi(cx - 20, 160, p.ad);
      if (p.ikon) ic += ikon(cx + 40, 215, p.ikon, 34);
    });
    return G.svg(W, H, ic, etiket || "karikatür şeridi");
  }
  // Harfli kartlar (sözcük ya da cümle kartları): [[harf, metin], ...]
  function kartlar(liste, { w = 125, h = 64, satir = 4, etiket = "kartlar" } = {}) {
    const W = Math.min(liste.length, satir) * (w + 12) + 12, H = Math.ceil(liste.length / satir) * (h + 12) + 12;
    let ic = "";
    liste.forEach(([harf, metin], i) => {
      const x = 12 + (i % satir) * (w + 12), y = 12 + Math.floor(i / satir) * (h + 12), s = metin.split("|");
      ic += `<rect class="g-yumusak g-cizgi" x="${x}" y="${y}" width="${w}" height="${h}" rx="10" stroke-width="1.5"/>`;
      if (harf) ic += `<circle class="g-b g-cizgi" cx="${x + 14}" cy="${y + 14}" r="11"/>` + t13(x + 14, y + 19, harf, { b: 1 });
      s.forEach((t, j) => { ic += t13(x + w / 2 + (harf ? 10 : 0), y + h / 2 + 5 + (j - (s.length - 1) / 2) * 17, t, { f: 14 }); });
    });
    return G.svg(W, H, ic, etiket);
  }

  /* ======================= Bir Kelime Seyyahı ======================= */
  SORU_EKLE("trsey.anlam",
    Q("trsey.anlam", "uygulama", 2, "Aşağıdaki karikatür şeridinde dört konuşma balonu var. <b>Hangi paneldeki</b> balonda “sıcak” sözcüğü <b>mecaz anlamda</b> kullanılmıştır?", "3. panel",
      [["1. panel", "kavrama", "Çorbanın sıcaklığı termometreyle ölçülebilir, dilini yakabilir; burada “sıcak” gerçek anlamdadır."],
       ["2. panel", "kavrama", "Havanın sıcak olması da ölçülebilen bir sıcaklıktır; sözcük gerçek anlamını korumuştur."],
       ["4. panel", "dikkat", "Kaloriferin peteği gerçekten ısınır; dokunduğunda sıcaklığını hissedersin. Bu da gerçek anlamdır."]],
      "Her balonda “sıcak” olan şeye dokunabilir ya da sıcaklığını ölçebilir misin? Ölçemediğin hangisi?",
      C("Dört paneldeki “sıcak” sözcüklerinden mecaz anlamlı olanı bulacağız.", "Gerçek anlam, sözcüğün akla gelen ilk anlamıdır. Mecaz anlamda ise sözcük, ilk anlamından uzaklaşıp yeni bir anlam kazanır.",
        ["1., 2. ve 4. panellerde çorba, hava ve petek gerçekten ısı taşır; hepsi ölçülebilir.", "3. panelde “sıcak bir gülümseme” geçiyor. Gülümsemenin derecesi ölçülemez; burada “sıcak”, “içten, samimi, sevecen” anlamındadır."],
        "Mecaz anlam <b>3. paneldedir</b>.", "“Sıcak gülümseme” yerine “samimi gülümseme” dersek anlam bozulmaz; bu, sözcüğün mecaz anlamda kullanıldığını gösterir."),
      { gorsel: serit([{ ust: "Akşam yemeği", balon: "Çorba çok sıcak,|üfleyerek iç!", ad: "Anne", ikon: "🍲" }, { ust: "Okul bahçesi", balon: "Hava bugün|çok sıcak.", ad: "Can", ikon: "☀️" },
        { ust: "Yeni komşu", balon: "Bizi sıcak bir|gülümsemeyle|karşıladı.", ad: "Ece", ikon: "🏠" }, { ust: "Sınıf", balon: "Kaloriferin peteği|sıcak, dokunma!", ad: "Öğretmen", ikon: "🌡️" }], "dört panelli karikatür şeridi"),
        kural: "Gerçek anlam ölçülebilir ve somuttur; mecaz anlam sözcüğe yeni, soyut bir anlam yükler.", dogruNeden: "“Sıcak gülümseme”de “sıcak” sözcüğü “içten, samimi” anlamında kullanılmıştır; bu mecaz anlamdır." }),
  );

  SORU_EKLE("trsey.sozluk",
    Q("trsey.sozluk", "uygulama", 2, "Görseldeki sözlük kartında “dil” sözcüğünün dört anlamı verilmiştir.<br><i>“Deniz feneri, karaya bağlı ince <b>dilin</b> tam ucunda yanıyordu.”</i><br>Bu cümledeki “dil” sözcüğü karttaki kaçıncı anlamda kullanılmıştır?", "3. anlam",
      [["1. anlam", "kavrama", "Ağızdaki organın ucunda deniz feneri olamaz; cümlede bir kara parçasından söz ediliyor."],
       ["2. anlam", "kavrama", "Cümlede konuşulan bir dil (Türkçe, İngilizce…) anlatılmıyor; fener bir yerde duruyor."],
       ["4. anlam", "dikkat", "4. anlam bir topluluğun anlatım biçimidir; feneri taşıyan bir kara parçası değildir."]],
      "Cümledeki ipuçlarına bak: “deniz feneri”, “karaya bağlı”, “ucunda”.",
      C("Sözlük kartındaki anlamlardan cümleye uyanı seçeceğiz.", "Çok anlamlı bir sözcüğün hangi anlamda kullanıldığını cümledeki öteki sözcükler (bağlam) belirler.",
        ["Bağlamdaki ipuçları: deniz feneri, karaya bağlı, ince, ucunda. Bunlar bir yer tarifidir.", "Karttaki 3. anlam “Denize doğru uzanan ince, uzun kara parçası” diyor. İpuçlarıyla tam örtüşüyor."],
        "“Dil” sözcüğü <b>3. anlamda</b> kullanılmıştır.", "3. anlamı cümleye koyalım: “Deniz feneri, denize uzanan ince kara parçasının ucunda yanıyordu.” Anlam bozulmadı."),
      { gorsel: afis("📖 dil (isim)", "1. Ağızda bulunan, tat almaya yarayan organ.|2. İnsanların anlaşmak için kullandığı sözcükler, lisan.|3. Denize doğru uzanan ince, uzun kara parçası.|4. Bir topluluğa özgü anlatım biçimi: gençlerin dili.", { alt: "Sözlük kartı (uyarlanmıştır)", etiket: "dil sözcüğünün sözlük kartı" }),
        kural: "Çok anlamlı sözcüğün doğru anlamını bulmak için sözlükteki her anlamı cümleye yerleştirip dene.", dogruNeden: "Cümlede denize uzanan, ucunda fener bulunan bir kara parçası anlatıldığı için 3. anlam uygundur." }),
  );

  SORU_EKLE("trsey.eszit",
    Q("trsey.eszit", "aciklama", 1, "Görseldeki dört kartın her birine iki sözcük yazılmıştır. Hangi kartta sözcükler arasında <b>eş anlam</b> ilişkisi <b>yoktur</b>?", "D kartı",
      [["A kartı", "bilgi", "“Cömert” ile “eli açık” aynı anlamı taşır; ikisi de paylaşmayı seven kişiyi anlatır."],
       ["B kartı", "bilgi", "“İhtiyar” ile “yaşlı” eş anlamlıdır; biri yerine öteki kullanılabilir."],
       ["C kartı", "bilgi", "“Varsıl” sözcüğü “zengin” demektir; bu kartta da eş anlam vardır."]],
      "Her karttaki sözcükleri aynı cümlede yer değiştirerek dene. Anlamı tersine dönen kart hangisi?",
      C("Dört kart arasından eş anlamlı olmayan çifti bulacağız.", "Eş anlamlı sözcükler aynı anlamı karşılar; zıt anlamlı sözcükler ise birbirinin karşıtıdır.",
        ["A: cömert = eli açık; B: ihtiyar = yaşlı; C: zengin = varsıl. Üçünde de eş anlam var.", "D: “kolay” ile “güç” (zor) birbirinin karşıtıdır. “Bu soru kolay.” ile “Bu soru güç.” cümleleri ters anlam taşır."],
        "Eş anlam ilişkisi olmayan kart <b>D kartıdır</b>; oradaki sözcükler zıt anlamlıdır.", "“Güç” sözcüğünün “kuvvet” anlamı da vardır; ama “kolay” ile yan yana geldiğinde “zor” anlamındadır."),
      { gorsel: kartlar([["A", "cömert|eli açık"], ["B", "ihtiyar|yaşlı"], ["C", "zengin|varsıl"], ["D", "kolay|güç"]], { etiket: "dört sözcük kartı" }),
        kural: "Eş anlamlılar birbirinin yerine geçer; zıt anlamlılar anlamı tersine çevirir.", dogruNeden: "D kartındaki “kolay” ve “güç” (zor) sözcükleri zıt anlamlıdır, eş anlamlı değildir." }),
  );

  /* ======================= Türkçenin Beyliği ======================= */
  const parcala = (parcalar, etiket) => {
    // parcalar: [[metin, sinif], ...] — kök/ek kutuları ve renk açıklaması
    let x = 20, ic = "";
    parcalar.forEach(([m, s]) => { const w = 30 + m.length * 13; ic += `<rect class="${s} g-cizgi" x="${x}" y="20" width="${w}" height="52" rx="8" stroke-width="2"/>` + (s === "g-a" || s === "g-c" ? `<text class="g-bos" style="font-size:16px" font-weight="700" x="${x + w / 2}" y="53" text-anchor="middle">${m}</text>` : G.yazi(x + w / 2, 53, m, { b: 1 })); x += w + 8; });
    const W = Math.max(x + 12, 520);
    ic += `<rect class="g-a" x="20" y="92" width="22" height="16" rx="3"/>` + G.yazi(48, 105, "kök", { a: "start", k: 1 }) +
      `<rect class="g-c" x="110" y="92" width="22" height="16" rx="3"/>` + G.yazi(138, 105, "yapım eki", { a: "start", k: 1 }) +
      `<rect class="g-b" x="240" y="92" width="22" height="16" rx="3"/>` + G.yazi(268, 105, "çekim eki", { a: "start", k: 1 }) +
      `<rect class="g-bos g-cizgi" x="370" y="92" width="22" height="16" rx="3"/>` + G.yazi(398, 105, "boyanmamış", { a: "start", k: 1 });
    return G.svg(W, 118, ic, etiket);
  };
  SORU_EKLE("trbey.kokek",
    Q("trbey.kokek", "uygulama", 2, "Şemada “gözlükçüler” sözcüğü parçalarına ayrılmış; kök mavi, yapım ekleri yeşil, çekim ekleri sarı boyanmıştır. Boyanmamış (beyaz) kutu hangi renkle boyanmalıdır?", "Yeşil, çünkü -çü yapım ekidir",
      [["Sarı, çünkü -çü çekim ekidir", "kavrama", "-çü eki “gözlük” sözcüğünden “gözlük satan kişi” anlamında yeni bir sözcük türetir; anlamı değiştiren ek yapım ekidir."],
       ["Mavi, çünkü -çü köktür", "bilgi", "Kök, sözcüğün en küçük anlamlı parçasıdır ve başta yer alır; burada kök “göz”dür."],
       ["Sarı, çünkü sondan ikinci ektir", "strateji", "Ekin türü sırasına bakılarak değil, sözcüğe kattığı anlama bakılarak bulunur."]],
      "“Gözlük” ile “gözlükçü” aynı şey mi? Ek yeni bir anlam mı kattı?",
      C("Beyaz kutudaki “-çü” ekinin türünü bulup rengini seçeceğiz.", "Yapım eki sözcükten yeni anlamlı bir sözcük türetir. Çekim eki ise anlamı değiştirmez; çoğul, iyelik, hâl gibi görevler katar.",
        ["göz (kök) + -lük → gözlük: yeni bir nesne adı türedi, -lük yapım eki (yeşil).", "gözlük + -çü → gözlükçü: “gözlük satan, yapan kişi” türedi; yine yeni bir sözcük oluştu.", "gözlükçü + -ler → gözlükçüler: yalnızca çokluk kattı, -ler çekim eki (sarı)."],
        "Beyaz kutudaki “-çü” bir <b>yapım ekidir</b>; <b>yeşile</b> boyanmalıdır.", "Yapım ekleri kökün hemen ardından gelir, çekim ekleri en sona eklenir. Şemadaki sıra da kök → yapım → yapım → çekim biçimindedir."),
      { gorsel: parcala([["göz", "g-a"], ["-lük", "g-c"], ["-çü", "g-bos"], ["-ler", "g-b"]], "gözlükçüler sözcüğünün kök ve ek şeması"),
        kural: "Anlamı değiştiren ek yapım eki, yalnızca görev katan ek çekim ekidir.", dogruNeden: "-çü eki “gözlük” sözcüğünden “gözlükçü” adlı yeni bir sözcük türettiği için yapım ekidir." }),
  );

  SORU_EKLE("trbey.yapimcekim",
    Q("trbey.yapimcekim", "uygulama", 2, "Görseldeki çarşı tabelalarına bakınız. Hangi tabeladaki sözcük <b>yapım eki almamış</b>, yalnızca çekim eki almıştır?", "III. tabela",
      [["I. tabela", "kavrama", "“Balıkçı” sözcüğündeki -çı eki “balık satan kişi” anlamında yeni sözcük türetmiştir; bu bir yapım ekidir."],
       ["II. tabela", "kavrama", "“Çiçekçi” sözcüğünde de -çi yapım eki vardır; çiçek satan kişiyi anlatır."],
       ["IV. tabela", "kavrama", "“Gözlükçü” sözcüğünde -lük ve -çü olmak üzere iki yapım eki vardır."]],
      "Her tabeladaki sözcüğün sonundaki eki kaldır: Kalan sözcükle anlam değişti mi, yoksa sadece sayı mı değişti?",
      C("Dört tabeladaki sözcüklerden yapım eki almayanı bulacağız.", "Yapım eki yeni sözcük türetir (balık → balıkçı). Çekim eki ise anlamı değiştirmeden görev katar (kitap → kitaplar).",
        ["I. balık + -çı, II. çiçek + -çi, IV. göz + -lük + -çü: hepsinde yeni anlamlı sözcük türemiş.", "III. kitap + -lar: “kitaplar” yine kitaptır; ek yalnızca çokluk anlamı katmıştır. Bu çekim ekidir."],
        "Yapım eki almayan sözcük <b>III. tabeladaki “Kitaplar”</b> sözcüğüdür.", "Sözlükte “balıkçı”, “çiçekçi”, “gözlükçü” ayrı madde olarak bulunur; “kitaplar” ise bulunmaz. Çünkü çekim ekiyle sözlüğe yeni sözcük girmez."),
      { gorsel: kartlar([["I", "BALIKÇI|🐟"], ["II", "ÇİÇEKÇİ|🌷"], ["III", "KİTAPLAR|📚"], ["IV", "GÖZLÜKÇÜ|👓"]], { h: 74, etiket: "dört dükkân tabelası" }),
        kural: "Sözlüğe ayrı madde olarak giren sözcükler yapım ekiyle türer; çekim eki sözlüğe yeni sözcük kazandırmaz.", dogruNeden: "“Kitaplar” sözcüğündeki -lar eki yalnızca çokluk bildiren bir çekim ekidir." }),
  );

  SORU_EKLE("trbey.cumle",
    Q("trbey.cumle", "uygulama", 1, "Görseldeki numaralı sözcük kartları anlamlı ve kurallı bir cümle oluşturacak biçimde sıralanırsa <b>en sonda</b> hangi kart yer alır?", "4 numaralı kart",
      [["1 numaralı kart", "kavrama", "“Elif” cümlenin özne ögesidir; Türkçede özne genellikle başa yakın yerde bulunur."],
       ["3 numaralı kart", "kavrama", "“kütüphaneden” bir yer bildirir; yüklemden önce gelir, en sona yerleşmez."],
       ["5 numaralı kart", "dikkat", "“dün” zaman bildirir; kurallı cümlede yüklemden önce gelir."]],
      "Kurallı cümlede iş, oluş ya da hareketi bildiren sözcük nerede bulunur?",
      C("Kartlarla kurallı cümle kurup en sona gelecek kartı bulacağız.", "Kurallı cümlede yüklem (işi bildiren sözcük) en sonda yer alır.",
        ["Kartlardaki sözcükler: Elif (1), kitabı (2), kütüphaneden (3), aldı (4), dün (5).", "İşi bildiren sözcük “aldı”dır. Örnek cümle: “Elif dün kütüphaneden kitabı aldı.”"],
        "Yüklem olan “aldı” sözcüğü, yani <b>4 numaralı kart</b> en sonda yer alır.", "Başka bir sıralama da kurulabilir (“Dün Elif kütüphaneden kitabı aldı.”); ama kurallı cümlede yüklem yine en sondadır."),
      { gorsel: kartlar([["1", "Elif"], ["2", "kitabı"], ["3", "kütüphaneden"], ["4", "aldı"], ["5", "dün"]], { w: 118, satir: 5, etiket: "beş sözcük kartı" }),
        kural: "Kurallı cümlede yüklem en sondadır.", dogruNeden: "“Aldı” sözcüğü işi bildiren yüklemdir ve kurallı cümlede en sona yerleşir." }),
  );

  /* ======================= Türküz, Türkçe Konuşuruz ======================= */
  SORU_EKLE("trtur.karsilik",
    Q("trtur.karsilik", "transfer", 2, "Okul panosuna asılan afişte bazı yabancı sözcükler kullanılmıştır. Bu sözcükler afişteki <b>sırasıyla</b> Türkçe karşılıklarıyla değiştirilirse hangisi doğru olur?", "çevrim içi – çalıştay – öz çekim",
      [["çevrim dışı – çalıştay – öz çekim", "bilgi", "“Online” bağlantılı, canlı demektir; karşılığı “çevrim içi”dir. “Çevrim dışı” tam tersidir."],
       ["çevrim içi – sergi – öz çekim", "bilgi", "“Workshop” birlikte uygulama yapılan çalışmadır; TDK karşılığı “çalıştay”dır, “sergi” değil."],
       ["öz çekim – çalıştay – çevrim içi", "dikkat", "Karşılıklar doğru ama sıra yanlış; afişte önce “online”, en sonda “selfie” geçiyor."]],
      "Afişi yukarıdan aşağı oku ve yabancı sözcükleri sırayla not et.",
      C("Afişteki yabancı sözcükleri bulup sırasıyla Türkçe karşılıklarını seçeceğiz.", "Dilimizi korumak için yerleşik Türkçe karşılığı olan yabancı sözcükleri kullanmayız. Online → çevrim içi, workshop → çalıştay, selfie → öz çekim.",
        ["Afişteki sıra: 1. satırda “online”, 2. satırda “workshop”, 3. satırda “selfie”.", "Karşılıklarını aynı sırayla yazalım: çevrim içi – çalıştay – öz çekim."],
        "Doğru seçenek <b>çevrim içi – çalıştay – öz çekim</b>.", "Afişi yeniden yazalım: “Çevrim içi kayıt…”, “Ahşap boyama çalıştayı…”, “Öz çekim köşesi…” Hepsi anlaşılır ve Türkçe oldu."),
      { gorsel: afis("🎨 BAHAR ŞENLİĞİ", "• Katılım için online kayıt yaptırınız.|• Ahşap boyama workshop'u saat 11.00'de.|• Bahçede selfie köşesi kurulacaktır.", { alt: "6. sınıflar düzenler", etiket: "bahar şenliği afişi" }),
        kural: "Online → çevrim içi, workshop → çalıştay, selfie → öz çekim.", dogruNeden: "Afişteki sırayla “online, workshop, selfie” sözcüklerinin karşılıkları çevrim içi, çalıştay ve öz çekimdir." }),
  );

  SORU_EKLE("trtur.yazim",
    Q("trtur.yazim", "uygulama", 2, "Sınıf başkanı Defne, panoya bir not bıraktı. Notun numaralı satırlarından hangisinde <b>yazım yanlışı</b> vardır?", "3",
      [["1", "dikkat", "Belirli bir tarih bildiren ay adı büyük harfle başlar: “23 Nisan”. Özel ada gelen ek de kesmeyle ayrılır; bu satır doğrudur."],
       ["2", "bilgi", "Şehir adına gelen ek kesmeyle ayrılır: “Ankara'dan”. Bu yazım doğrudur."],
       ["4", "kavrama", "Bağlaç olan “de” ayrı yazılır: “Ece de”. Bu satırda yanlış yok."]],
      "Gün adları ne zaman büyük harfle başlar? Belirli bir tarih var mı?",
      C("Nottaki dört satırdan yazım yanlışı olanı bulacağız.", "Ay ve gün adları belirli bir tarih bildirdiğinde büyük harfle başlar (23 Nisan 2026 Perşembe). Tarih bildirmiyorsa küçük harfle yazılır (salı günü).",
        ["1. satır “23 Nisan'da”: belirli tarih, büyük harf doğru. 2. satır “Ankara'dan”: özel ad + kesme işareti doğru.", "3. satır “Salı günü”: önünde tarih yok, yalnızca gün adı var; küçük harfle “salı günü” yazılmalıydı. 4. satır “Ece de”: bağlaç ayrı yazılmış, doğru."],
        "Yazım yanlışı <b>3. satırdadır</b>.", "Doğrusunu yazalım: “Prova salı günü yapılacak.” Tarihle birlikte yazsaydık “21 Nisan Salı” olurdu."),
      { gorsel: afis("📌 NOT", "1. 23 Nisan'da sınıfça gösteri yapacağız.|2. Ankara'dan gelen konuklarımız da izleyecek.|3. Prova Salı günü yapılacak.|4. Sunucumuz Ece de provaya katılacak.", { alt: "Defne (sınıf başkanı)", etiket: "panodaki not" }),
        kural: "Tarih bildirmeyen gün ve ay adları küçük harfle yazılır.", dogruNeden: "3. satırdaki “Salı” sözcüğü belirli bir tarih bildirmediği için küçük harfle yazılmalıdır." }),
  );

  SORU_EKLE("trtur.koruma",
    Q("trtur.koruma", "transfer", 2, "Öğrenciler mahallelerindeki 40 dükkân tabelasını inceleyip grafiği hazırladı. Grafiğe göre aşağıdaki yargılardan hangisine <b>ulaşılabilir</b>?", "Tabelaların yarısından fazlasında yabancı ad kullanılmıştır.",
      [["Tabelaların çoğunda Türkçe ad kullanılmıştır.", "islem", "Türkçe adlı tabela 14 tanedir; 40'ın yarısı olan 20'den azdır."],
       ["Karışık adlı tabelalar Türkçe adlı tabelalardan fazladır.", "dikkat", "Karışık adlı tabela 5, Türkçe adlı 14 tanedir; karışıklar daha azdır."],
       ["Mahallede Türkçe adlı hiç tabela yoktur.", "dikkat", "Grafikte Türkçe adlı 14 tabela açıkça görülüyor."]],
      "Önce 40'ın yarısını bul, sonra yabancı adlı sütunla karşılaştır.",
      C("Sütun grafiğini okuyup doğru yargıyı seçeceğiz.", "Grafikte sütunun yüksekliği sayıyı gösterir; “yarısından fazla” demek, toplamın yarısını aşmak demektir.",
        ["Grafikten okuyalım: Türkçe ad 14, yabancı ad 21, karışık 5. Toplam 14 + 21 + 5 = 40.", "40'ın yarısı 20'dir. Yabancı adlı tabela 21 tane; 21 > 20."],
        "Ulaşılabilecek yargı: <b>tabelaların yarısından fazlasında yabancı ad kullanılmıştır</b>.", "Bu sonuç, dilimizi korumak için işletmelere Türkçe ad önermek gibi bir çözüme de yol gösterir."),
      { gorsel: G.sutun([["Türkçe ad", 14], ["Yabancı ad", 21], ["Karışık", 5]], { baslik: "Mahallemizdeki tabelalar", birim: "tabela" }),
        kural: "Grafik yorumlarken önce toplamı, sonra karşılaştırmayı yap.", dogruNeden: "40 tabeladan 21'inde yabancı ad vardır ve 21, 40'ın yarısından fazladır." }),
  );

  /* ======================= Kaşık — deyim ve atasözü ======================= */
  SORU_EKLE("trkas.deyim",
    Q("trkas.deyim", "transfer", 2, "Karikatür şeridinde Mert'in başından geçenler anlatılmıştır. Bu şeride en uygun atasözü hangisidir?", "Ne ekersen onu biçersin.",
      [["Damlaya damlaya göl olur.", "kavrama", "Bu atasözü küçük birikimlerin zamanla büyüdüğünü anlatır; Mert hiç birikim yapmamıştır."],
       ["Bir elin nesi var, iki elin sesi var.", "kavrama", "Bu atasözü iş birliğinin gücünü anlatır; şeritte yardımlaşmayla ilgili bir olay yok."],
       ["Komşu komşunun külüne muhtaçtır.", "bilgi", "Bu atasözü komşuluk ilişkileriyle ilgilidir; Mert'in çalışmamasıyla bağı yoktur."]],
      "Mert'in davranışı (1. panel) ile sonucu (3. panel) arasında nasıl bir ilişki var?",
      C("Şeritteki olaylara uygun atasözünü seçeceğiz.", "Atasözleri, uzun deneyimlerden çıkarılmış öğütlerdir. Uygun atasözünü bulmak için olayın ana mesajını belirlemeliyiz.",
        ["1. panelde Mert “daha çok vakit var” diyerek çalışmayı erteliyor; 2. panelde son gün telaşa düşüyor.", "3. panelde düşük not alıyor ve pişman oluyor. Ana mesaj: Yaptığımız işin sonucunu yaşarız."],
        "En uygun atasözü <b>“Ne ekersen onu biçersin.”</b>", "Atasözünü tersine çevirerek sınayalım: Mert düzenli çalışsaydı (iyi tohum eksekti) iyi bir not alırdı (iyi ürün biçerdi)."),
      { gorsel: serit([{ ust: "Pazartesi", balon: "Sınav cumaya,|daha çok vakit var!", ad: "Mert", ikon: "⚽" }, { ust: "Perşembe gecesi", balon: "Hiçbir şey|anlamıyorum!", ad: "Mert", ikon: "📚" },
        { ust: "Cuma: Sınav|sonucu 45", balon: "Keşke zamanında|çalışsaydım…", ad: "Mert", ikon: "📝" }], "Mert'in sınav hikâyesini anlatan üç panel"),
        kural: "Uygun atasözü olayın ana mesajını özetler.", dogruNeden: "Mert çalışmadığı için düşük not almıştır; yaptığının sonucunu yaşamıştır." }),
  );

  SORU_EKLE("trkas.sozvarligi",
    Q("trkas.sozvarligi", "uygulama", 2, "Tarif kartının 2. adımındaki boşluğa görseldeki mutfak araçlarından hangisi gelmelidir? (Harf ve ad birlikte doğru olmalıdır.)", "L – tava",
      [["K – bıçak", "kavrama", "Bıçak doğramak içindir; tereyağı bıçağın içinde eritilemez. Bıçak 1. adımdaki boşluğa uyar."],
       ["L – tencere", "dikkat", "Harf doğru ama ad yanlış; L'deki araç sapı uzun, yayvan bir tavadır."],
       ["M – kaşık", "kavrama", "Kaşık karıştırmak ya da yemek içindir; yağ eritmeye uygun değildir."]],
      "Yağ eritilen, yayvan ve uzun saplı mutfak aracı hangisi?",
      C("Tarifteki boşluğa uygun mutfak aracını görselden seçeceğiz.", "Mutfak söz varlığı: bıçak (doğramak), tava (kızartmak, eritmek), kaşık (karıştırmak), kâse (sunmak).",
        ["1. adım “doğra” diyor; bu K'deki bıçaktır.", "2. adım “içinde erit” diyor; yağ, ocakta ısıtılan yayvan bir kapta erir. Görselde bu L'deki tavadır."],
        "Boşluğa <b>L – tava</b> gelir.", "3. adım karıştırmayı anlatıyor; orada M'deki kaşık kullanılır. Her araç bir adıma uydu."),
      { gorsel: G.svg(560, 250,
        `<rect class="g-yumusak g-cizgi" x="8" y="8" width="544" height="120" rx="12" stroke-width="1.5"/>` + G.yazi(24, 34, "🍳 MENEMEN TARİFİ", { a: "start", b: 1 }) +
        t13(24, 60, "1. Biberleri ve domatesleri ________ ile doğra.", { a: "start", f: 15 }) + t13(24, 86, "2. Tereyağını ________ içinde erit.", { a: "start", f: 15 }) + t13(24, 112, "3. Yumurtaları ekleyip ________ ile karıştır.", { a: "start", f: 15 }) +
        [["K", "🔪"], ["L", "🍳"], ["M", "🥄"], ["N", "🥣"]].map(([h, e], i) => `<rect class="g-bos g-cizgi" x="${30 + i * 132}" y="145" width="110" height="95" rx="10" stroke-width="1.5"/>` + `<circle class="g-b g-cizgi" cx="${46 + i * 132}" cy="160" r="11"/>` + t13(46 + i * 132, 165, h, { b: 1 }) + ikon(85 + i * 132, 215, e, 44)).join(""),
        "menemen tarifi ve harfli mutfak araçları"),
        kural: "Söz varlığını geliştirmek için nesnenin adını işleviyle birlikte öğren.", dogruNeden: "Tereyağı tavada eritilir; görselde tava L harfiyle gösterilmiştir." }),
  );

  /* ======================= Azerbaycan-Türkiye ======================= */
  SORU_EKLE("traze.sozcuk",
    Q("traze.sozcuk", "uygulama", 2, "Tablodaki sözcük eşleşmelerinden yararlanarak Azerbaycan Türkçesiyle yazılmış <b>“Uşaqlar məktəbə gedir.”</b> cümlesinin Türkiye Türkçesindeki karşılığını bulunuz.", "Çocuklar okula gidiyor.",
      [["Kızlar mektuba gidiyor.", "dikkat", "Tabloya bakmadan sözcüklerin sese benzemesine göre tahmin yapılmış; “məktəb” mektup değil, okul demektir."],
       ["Çocuklar okuldan geliyor.", "kavrama", "“-ə” eki yönelme bildirir (okula); “gedir” de “gidiyor” demektir, “geliyor” değil."],
       ["Annemler okula gidiyor.", "bilgi", "Tabloda “ana” anne demektir; cümledeki “uşaq” ise çocuk anlamındadır."]],
      "Cümledeki her sözcüğü tabloda bul, eklerine de dikkat et.",
      C("Tablodaki eşleşmelerle Azerbaycan Türkçesi bir cümleyi çevireceğiz.", "Azerbaycan Türkçesi ile Türkiye Türkçesi kardeş lehçelerdir; sözcükler ve ekler çok benzer, bazı sesler farklıdır.",
        ["Tablodan: uşaq = çocuk, məktəb = okul, getmək = gitmek.", "Ekler: “-lar” çokluk (çocuklar), “-ə” yönelme (okula), “gedir” şimdi yapılan bir işi anlatır (gidiyor)."],
        "Cümlenin karşılığı: <b>“Çocuklar okula gidiyor.”</b>", "Sözcükleri tek tek yerine koyalım: Uşaqlar → Çocuklar, məktəbə → okula, gedir → gidiyor. Hepsi tabloyla uyumlu."),
      { gorsel: G.tablo(["Azerbaycan Türkçesi", "Türkiye Türkçesi"], [["uşaq", "çocuk"], ["ana", "anne"], ["məktəb", "okul"], ["getmək", "gitmek"], ["gəlmək", "gelmek"]]),
        kural: "Kardeş lehçelerde sözcüğün kökünü ve ekini ayrı ayrı eşleştir.", dogruNeden: "Uşaq = çocuk, məktəb = okul, gedir = gidiyor olduğu için cümle “Çocuklar okula gidiyor.” olur." }),
  );

  SORU_EKLE("traze.lehce",
    Q("traze.lehce", "baglanti", 2, "Görselde bazı Türk lehçelerinde “su” sözcüğünün nasıl söylendiği gösterilmiştir. Bu görsele dayanarak hangi yargıya <b>ulaşılabilir</b>?", "Türk lehçelerinde bu sözcük ortak kökten gelir; söylenişinde küçük farklar vardır.",
      [["Türk lehçelerinin hepsinde sözcük tamamen aynı söylenir.", "dikkat", "Görselde “suv”, “suw”, “suu” gibi farklı söylenişler var; tamamen aynı değil."],
       ["Bu lehçelerin “su” sözcükleri arasında hiçbir benzerlik yoktur.", "kavrama", "Hepsi “su” sesleriyle başlıyor; benzerlik çok açık."],
       ["“Su” sözcüğü yalnızca Türkiye Türkçesinde kullanılır.", "dikkat", "Görselde başka lehçelerde de aynı sözcüğün kullanıldığı görülüyor."]],
      "Altı kutudaki sözcükleri karşılaştır: Hangi sesler ortak, hangi sesler farklı?",
      C("Görseldeki söyleyişleri karşılaştırıp ulaşılabilecek yargıyı seçeceğiz.", "Türk lehçeleri aynı kökten gelir; bu yüzden pek çok temel sözcük benzerdir. Farklar genellikle bir iki seste görülür.",
        ["Kutular: Türkiye “su”, Azerbaycan “su”, Türkmen “suw”, Özbek “suv”, Kazak “su”, Kırgız “suu”.", "Hepsinde “su” sesi korunmuş; bazılarında sona bir ses eklenmiş ya da ünlü uzamış."],
        "Ulaşılabilecek yargı: <b>sözcük ortak kökten gelir, söylenişinde küçük farklar vardır</b>.", "Bu ortaklık, Türk dünyasının ortak dil mirasının güzel bir kanıtıdır. Başka bir sözcükle de dene: “göz, kız, el” gibi."),
      { gorsel: G.svg(600, 200,
        [["Türkiye", "su", 60, 120], ["Azerbaycan", "su", 170, 70], ["Türkmenistan", "suw", 270, 140], ["Özbekistan", "suv", 370, 90], ["Kazakistan", "su", 470, 40], ["Kırgızistan", "suu", 500, 140]].map(([ul, s, x, y]) =>
          `<rect class="g-yumusak g-cizgi" x="${x - 52}" y="${y - 24}" width="104" height="54" rx="10" stroke-width="1.5"/>` + t13(x, y - 6, ul, { f: 12 }) + G.yazi(x, y + 20, "💧 " + s, { b: 1 })).join("") +
        G.yazi(300, 192, "(Batıdan doğuya şematik yerleşim)", { k: 1 }), "Türk lehçelerinde su sözcüğü"),
        kural: "Türk lehçelerinde temel sözcüklerin çoğu ortaktır; farklar küçük ses değişiklikleridir.", dogruNeden: "Görseldeki bütün söyleyişler “su” köküne dayanır ve yalnızca birkaç seste farklılaşır." }),
  );

  SORU_EKLE("traze.okuma",
    Q("traze.okuma", "transfer", 2, "6-A sınıfı bir ay boyunca okuduğu kitap sayısını grafiğe dökmüştür. Bu grafiği anlatan bir yazı için <b>en uygun başlık</b> hangisidir?", "Okuma Sevgimiz Her Hafta Büyüyor",
      [["Kitap Okumaya Hiç Vaktimiz Yok", "dikkat", "Grafikte kitap sayısı her hafta artıyor; bu başlık grafikle çelişir."],
       ["Okuma Sayımız Haftadan Haftaya Azaldı", "dikkat", "Sütunlar sağa doğru yükseliyor; sayı azalmamış, artmıştır."],
       ["Matematik Dersinde Başarı", "kavrama", "Grafik okumayla ilgilidir; matematik başarısından söz etmez."]],
      "Sütunların boyu haftadan haftaya nasıl değişiyor?",
      C("Grafiğin anlattığı durumu en iyi özetleyen başlığı seçeceğiz.", "İyi bir başlık metnin konusunu kısa ve doğru biçimde yansıtır; metinle çelişmez.",
        ["Grafikten okuyalım: 1. hafta 8, 2. hafta 12, 3. hafta 15, 4. hafta 20 kitap.", "Sayı her hafta artmış: 8 → 12 → 15 → 20. Ana düşünce: Sınıfın okuma alışkanlığı güçleniyor."],
        "En uygun başlık: <b>“Okuma Sevgimiz Her Hafta Büyüyor”</b>.", "Başlığı grafikle sınayalım: Her hafta daha çok kitap okunmuş mu? Evet. Başlık ve veri uyumlu."),
      { gorsel: G.sutun([["1. hafta", 8], ["2. hafta", 12], ["3. hafta", 15], ["4. hafta", 20]], { baslik: "6-A sınıfının okuduğu kitap sayısı", birim: "kitap" }),
        kural: "Başlık, metnin ya da görselin ana düşüncesini yansıtmalıdır.", dogruNeden: "Grafikte okunan kitap sayısı her hafta artmaktadır; başlık bu artışı anlatır." }),
  );

  /* ======================= Üretmek Gibisi Yok! (1) ======================= */
  // Kök ağacı: ortada kök, çevresinde harfli dallar
  function kokAgaci(kok, dallar, etiket) {
    const W = 600, H = 250, cx = 300, cy = 125, yer = [[150, 50], [450, 50], [150, 200], [450, 200]];
    let ic = `<circle class="g-a" cx="${cx}" cy="${cy}" r="38"/>` + `<text class="g-bos" style="font-size:18px" font-weight="700" x="${cx}" y="${cy + 6}" text-anchor="middle">${kok}</text>`;
    dallar.forEach(([h, m], i) => {
      const [x, y] = yer[i];
      ic = `<line class="g-cizgi" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke-width="2"/>` + ic;
      ic += `<rect class="g-yumusak g-cizgi" x="${x - 120}" y="${y - 24}" width="240" height="48" rx="10" stroke-width="1.5"/>` + `<circle class="g-b g-cizgi" cx="${x - 104}" cy="${y}" r="11"/>` + t13(x - 104, y + 5, h, { b: 1 }) + t13(x + 8, y + 5, m, { f: 14 });
    });
    return G.svg(W, H, ic, etiket);
  }
  SORU_EKLE("truret1.turetme",
    Q("truret1.turetme", "aciklama", 2, "Şemada “tuz” kökünden türetilen sözcükler ve anlamları verilmiştir. Hangi dalda türetilen sözcüğün <b>anlamı yanlış</b> yazılmıştır?", "D",
      [["A", "kavrama", "-luk eki burada “bir şeyin konduğu yer, kap” anlamı katar: tuzluk, tuz konulan kaptır. Bu dal doğru."],
       ["B", "kavrama", "-lu eki “içinde o şey bulunan” anlamı katar: tuzlu yemek, içinde tuz olan yemektir. Bu dal doğru."],
       ["C", "kavrama", "-suz eki “o şeyden yoksun” anlamı katar: tuzsuz, tuzu olmayan demektir. Bu dal doğru."]],
      "-cı/-ci eki bir sözcüğe genellikle hangi anlamı katar? Balıkçı, çiçekçi örneklerini düşün.",
      C("Dört daldaki anlamlardan yanlış olanı bulacağız.", "Yapım ekleri köke yeni anlamlar katar: -lık (kap, yer), -lı (sahip olma), -sız (yoksunluk), -cı (o işi yapan, satan kişi).",
        ["A tuzluk – tuz konulan kap ✔, B tuzlu – içinde tuz olan ✔, C tuzsuz – tuzu olmayan ✔.", "D “tuzcu” sözcüğü -cu ekiyle türemiştir; bu ek “o şeyi satan, o işle uğraşan” anlamı katar. “Tuzu sevmeyen kişi” anlamı yanlıştır."],
        "Anlamı yanlış verilen dal <b>D</b>'dir; tuzcu, tuz satan kişidir.", "Benzer sözcüklerle sına: balıkçı balık satar, simitçi simit satar; öyleyse tuzcu da tuz satar."),
      { gorsel: kokAgaci("tuz", [["A", "tuzluk: tuz konulan kap"], ["B", "tuzlu: içinde tuz olan"], ["C", "tuzsuz: tuzu olmayan"], ["D", "tuzcu: tuzu sevmeyen kişi"]], "tuz kökünden türetilen sözcükler şeması"),
        kural: "-cı/-ci eki çoğunlukla “o işi yapan, o şeyi satan kişi” anlamı katar.", dogruNeden: "Tuzcu “tuz satan kişi” demektir; şemadaki “tuzu sevmeyen kişi” anlamı yanlıştır." }),
  );

  SORU_EKLE("truret1.harf",
    Q("truret1.harf", "uygulama", 1, "Görseldeki harf kartlarının <b>hepsi birer kez</b> kullanılarak aşağıdaki sözcüklerden hangisi yazılabilir?", "kalem",
      [["kemer", "dikkat", "Kartlarda bir tane “e” var ve “r” hiç yok; “kemer” yazılamaz."],
       ["elma", "dikkat", "“Elma” yazılabilir ama “k” kartı artar; soru kartların hepsinin kullanılmasını istiyor."],
       ["kalan", "dikkat", "Kartlarda “n” yok ve yalnızca bir “a” var; “kalan” yazılamaz."]],
      "Her seçeneği harf harf kartlarla eşleştir; artan ya da eksik kart kalmamalı.",
      C("Beş harf kartının hepsini birer kez kullanarak yazılabilen sözcüğü bulacağız.", "Bir sözcüğü verilen harflerle yazmak için her harfin kartlarda olması ve hiçbir kartın artmaması gerekir.",
        ["Kartlar: K, A, L, E, M (beş harf). Seçenekler beş harfli olmalı; “elma” dört harfli olduğu için bir kart artar.", "kalem → k ✔, a ✔, l ✔, e ✔, m ✔. Beş kartın hepsi birer kez kullanıldı."],
        "Yazılabilen sözcük <b>kalem</b>dir.", "Aynı kartlarla “kelam” sözcüğü de yazılabilir; ama seçeneklerde yalnızca “kalem” var."),
      { gorsel: G.svg(420, 90, ["K", "A", "L", "E", "M"].map((h, i) => `<rect class="g-b g-cizgi" x="${20 + i * 78}" y="12" width="66" height="66" rx="10" stroke-width="2"/>` + `<text class="g-yazi" style="font-size:30px" font-weight="700" x="${53 + i * 78}" y="56" text-anchor="middle">${h}</text>`).join(""), "harf kartları: K, A, L, E, M"),
        kural: "Harf oyunlarında önce harf sayısını, sonra her harfi tek tek kontrol et.", dogruNeden: "“Kalem” sözcüğü K, A, L, E, M kartlarının her birini birer kez kullanır." }),
  );

  SORU_EKLE("truret1.kullanma",
    Q("truret1.kullanma", "transfer", 1, "Görseldeki pazar tezgâhını anlatan cümlelerden hangisinde türemiş sözcük <b>anlamına uygun</b> kullanılmıştır?", "Tezgâhın sahibi bir balıkçıdır.",
      [["Tezgâhın sahibi bir balıklıktır.", "kavrama", "“Balıklık” anlamlı bir sözcük olarak bir kişiyi anlatmaz; satıcıyı anlatan ek -çı'dır."],
       ["Tezgâhın sahibi bir balıksızdır.", "kavrama", "-sız eki yokluk anlatır; tezgâh balıkla dolu, üstelik bu sözcük bir kişinin işini anlatmaz."],
       ["Tezgâhın sahibi bir çiçekçidir.", "dikkat", "Türetme doğru ama görseldeki tezgâhta çiçek değil, balık satılıyor."]],
      "Görselde ne satılıyor? Bunu satan kişiye ne denir?",
      C("Görseldeki tezgâha uygun türemiş sözcüğü seçeceğiz.", "-cı/-ci eki “o şeyi satan, o işi yapan kişi” anlamında yeni sözcük türetir.",
        ["Görseldeki tabelada “TAZE BALIK” yazıyor ve tezgâhta balıklar var.", "Balık satan kişi: balık + -çı → balıkçı."],
        "Doğru cümle: <b>“Tezgâhın sahibi bir balıkçıdır.”</b>", "Öteki eklerle dene: balıklı (balığı olan), balıksız (balığı olmayan). Bunlar kişinin mesleğini anlatmaz."),
      { gorsel: G.svg(420, 200,
        `<rect class="g-b g-cizgi" x="60" y="14" width="300" height="44" rx="8" stroke-width="2"/>` + G.yazi(210, 43, "TAZE BALIK", { b: 1 }) +
        `<line class="g-cizgi" x1="80" y1="58" x2="80" y2="100" stroke-width="3"/><line class="g-cizgi" x1="340" y1="58" x2="340" y2="100" stroke-width="3"/>` +
        `<rect class="g-yumusak g-cizgi" x="40" y="100" width="340" height="80" rx="6" stroke-width="2"/>` + ikon(110, 155, "🐟", 40) + ikon(180, 155, "🐠", 40) + ikon(250, 155, "🐟", 40) + ikon(320, 155, "🧊", 36),
        "taze balık satılan pazar tezgâhı"),
        kural: "Türemiş sözcüğü kullanırken ekin kattığı anlamın cümleye uyup uymadığına bak.", dogruNeden: "Görselde balık satılıyor; balık satan kişiye “balıkçı” denir." }),
  );

  /* ======================= Cepheye Koşan At — hikâye okuma ======================= */
  SORU_EKLE("trat.5n1k",
    Q("trat.5n1k", "uygulama", 2, "Görseldeki gazete haberine göre <b>“Niçin?”</b> sorusunun cevabı hangisidir?", "Okul bahçesini gölgeli bir oyun alanına dönüştürmek için",
      [["12 Mayıs Cumartesi sabahı", "dikkat", "Bu bilgi “Ne zaman?” sorusunun cevabıdır."],
       ["Selin Öğretmen ve öğrencileri", "dikkat", "Bu bilgi “Kim?” sorusunun cevabıdır."],
       ["Elli fidan dikerek", "kavrama", "Bu bilgi olayın ne olduğunu ya da nasıl yapıldığını anlatır; amacını anlatmaz."]],
      "“Niçin?” sorusu amaç ya da sebep sorar. Haberde “amaç” sözcüğünü ara.",
      C("Haberdeki bilgilerden “Niçin?” sorusunun cevabını bulacağız.", "5N1K: Ne? Nerede? Ne zaman? Nasıl? Niçin? Kim? “Niçin?” olayın amacını ya da sebebini sorar.",
        ["Haberi sorulara ayıralım: Kim? Selin Öğretmen ve öğrencileri. Ne zaman? 12 Mayıs Cumartesi sabahı. Nerede? Yeşilköy Ortaokulu bahçesi. Ne? 50 fidan dikildi.", "Son satırda amaç söyleniyor: “Amaç, bahçeyi gölgeli bir oyun alanına dönüştürmekti.”"],
        "“Niçin?” sorusunun cevabı: <b>okul bahçesini gölgeli bir oyun alanına dönüştürmek için</b>.", "Cevabı soruya yerleştir: “Fidanlar niçin dikildi?” — “Bahçeyi gölgeli bir oyun alanı yapmak için.” Anlamlı oldu."),
      { gorsel: afis("📰 KÖYDE SEVİNÇLİ GÜN", "12 Mayıs Cumartesi sabahı Yeşilköy Ortaokulunun|bahçesine 50 fidan dikildi. Etkinliği Selin Öğretmen|ve öğrencileri düzenledi. Öğrenciler fidanları|ikişerli gruplar hâlinde dikti. Amaç, bahçeyi|gölgeli bir oyun alanına dönüştürmekti.", { alt: "Yerel gazete haberi (özgün)", etiket: "gazete haberi" }),
        kural: "“Niçin?” sorusunun cevabı olayın amacını ya da sebebini verir.", dogruNeden: "Haberde fidan dikmenin amacının bahçeyi gölgeli bir oyun alanına dönüştürmek olduğu açıkça yazılmıştır." }),
  );

  SORU_EKLE("trat.unsur",
    Q("trat.unsur", "uygulama", 2, "Karikatür şeridinde kısa bir hikâye anlatılmıştır. Bu hikâyenin <b>olay</b> unsuru hangisidir?", "Köylülerin karla kapanan yolu birlikte açması",
      [["Bir kış sabahı", "kavrama", "Bu ifade hikâyenin zaman unsurudur; olayın ne zaman geçtiğini söyler."],
       ["Köy yolu ve okul kapısı", "kavrama", "Bunlar hikâyenin yer unsurudur; olayın nerede geçtiğini söyler."],
       ["Ayşe ve dedesi", "kavrama", "Bunlar hikâyenin kişileridir; olayı yaşayanlardır, olayın kendisi değildir."]],
      "Olay unsuru “Ne oldu?” sorusunun cevabıdır.",
      C("Şeritteki hikâyenin olay unsurunu bulacağız.", "Hikâyenin dört unsuru: olay (ne oldu?), kişiler (kim?), yer (nerede?), zaman (ne zaman?).",
        ["Zaman: bir kış sabahı, öğle vakti. Yer: köy yolu, okul kapısı. Kişiler: Ayşe, dedesi ve köylüler.", "Ne oldu? Kar yolu kapattı; dede kürek istedi, köylüler yardım etti, yol açıldı ve çocuklar okula vardı."],
        "Olay unsuru: <b>köylülerin karla kapanan yolu birlikte açması</b>.", "Diğer seçeneklere “Ne oldu?” diye sor: “Bir kış sabahı oldu.” anlamlı bir olay anlatmıyor; demek ki o zaman unsurudur."),
      { gorsel: serit([{ ust: "Bir kış sabahı,|köy yolunda", balon: "Kar yolu|kapatmış!", ad: "Ayşe", ikon: "❄️" }, { ust: "Biraz sonra", balon: "Kürekleri getirin,|hep birlikte açalım!", ad: "Dede", ikon: "🧹" },
        { ust: "Öğle vakti,|okul kapısında", balon: "Herkes yardım etti,|okula vardık!", ad: "Ayşe", ikon: "🏫" }], "kar yolu hikâyesini anlatan üç panel"),
        kural: "Olay = Ne oldu? Kişi = Kim? Yer = Nerede? Zaman = Ne zaman?", dogruNeden: "Hikâyede yaşanan asıl olay, köylülerin karla kapanan yolu birlikte açmasıdır." }),
  );

  SORU_EKLE("trat.ayrinti",
    Q("trat.ayrinti", "aciklama", 2, "Karikatür şeridinde Zeynep'in kedisi Pamuk kaybolmuştur. Panellere göre Zeynep'in duyguları <b>sırasıyla</b> nasıl değişmiştir?", "Endişe – korku – sevinç",
      [["Sevinç – öfke – üzüntü", "dikkat", "1. panelde Zeynep sevinçli değil, kedisini arayıp bulamadığı için endişelidir."],
       ["Merak – sevinç – öfke", "kavrama", "Son panelde kedisini bulan Zeynep öfkeli değil, sevinçlidir."],
       ["Öfke – endişe – şaşkınlık", "kavrama", "Zeynep kimseye kızmıyor; 2. paneldeki “Ya geri dönmezse?” sözü korku bildirir."]],
      "Her paneldeki konuşma balonunu oku; ünlem ve soru cümleleri sana ipucu verir.",
      C("Üç panelde Zeynep'in duygularını sırayla belirleyeceğiz.", "Kişilerin duygularını sözlerinden, davranışlarından ve olayın gidişinden çıkarırız.",
        ["1. panel: “Her yere baktım!” → kedisini bulamayan Zeynep endişeli.", "2. panel: “Ya geri dönmezse?” → kötü bir şey olmasından korkuyor. 3. panel: “İşte orada!” → kedisini bulduğu için sevinçli."],
        "Duygu sırası: <b>endişe – korku – sevinç</b>.", "Olayın akışıyla sına: kayıp → kötü ihtimal → kavuşma. Duygular da bu sırayla değişiyor."),
      { gorsel: serit([{ ust: "Akşamüstü", balon: "Pamuk nerede?|Her yere baktım!", ad: "Zeynep", ikon: "🔍" }, { ust: "Hava kararıyor", balon: "Ya geri|dönmezse?", ad: "Zeynep", ikon: "🌙" },
        { ust: "Bahçede", balon: "İşte orada!|Ağacın altında!", ad: "Zeynep", ikon: "🐈" }], "kayıp kedi hikâyesini anlatan üç panel"),
        kural: "Duyguyu bulmak için kişinin sözlerine ve olayın gidişine bak.", dogruNeden: "Zeynep önce kedisini bulamadığı için endişelenmiş, sonra kaybetmekten korkmuş, en sonunda bulunca sevinmiştir." }),
  );

  /* ======================= Vatan — şiir ======================= */
  const SIIR = afis("🇹🇷 SINIF PANOSU: VATAN", "1. Sabah olur, güneş doğar,|2. Ovalarına ışık yağar.|3. Bir türkü yükselir dağdan,|4. Sevgin kalbimi sarar.| |5. Toprağında buğday biter,|6. Dallarında kuşlar öter.|7. Her köşen bir başka güzel,|8. Senin adın bana yeter.", { alt: "Şiir: 6-B sınıfı (özgün)", etiket: "sınıf panosunda vatan şiiri" });
  SORU_EKLE("trvat.siir",
    Q("trvat.siir", "uygulama", 1, "Sınıf panosundaki şiir <b>kaç kıta ve kaç dizeden</b> oluşmaktadır?", "2 kıta, 8 dize",
      [["8 kıta, 2 dize", "kavrama", "Kıta ile dize karıştırılmış; her satır bir dizedir, dize grupları ise kıtadır."],
       ["1 kıta, 8 dize", "dikkat", "5. dizeden önce boş bir satır var; şiir iki ayrı bölümden oluşuyor."],
       ["2 kıta, 4 dize", "dikkat", "4 dize her kıtadaki dize sayısıdır; şiirin toplam dize sayısı 8'dir."]],
      "Şiirin her satırına ne denir? Boşlukla ayrılan bölümlere ne denir?",
      C("Panodaki şiirin kıta ve dize sayısını bulacağız.", "Şiirin her satırına <b>dize</b>, dizelerin oluşturduğu ve boşlukla ayrılan bölümlere <b>kıta</b> denir.",
        ["Satırları sayalım: 1'den 8'e kadar numaralandırılmış 8 dize var.", "4. dizeden sonra bir boşluk var; yani 1–4 birinci kıta, 5–8 ikinci kıta. 2 kıta."],
        "Şiir <b>2 kıta ve 8 dizeden</b> oluşur.", "Çarpma ile kontrol: 2 kıta × 4 dize = 8 dize. Sayılar tutarlı."),
      { gorsel: SIIR, kural: "Dize = şiirin her satırı; kıta = dizelerden oluşan bölüm.", dogruNeden: "Şiir dörder dizelik iki bölümden, yani 2 kıta ve toplam 8 dizeden oluşur." }),
  );
  SORU_EKLE("trvat.duygu",
    Q("trvat.duygu", "aciklama", 1, "Sınıf panosundaki şiirde <b>ağır basan duygu</b> hangisidir?", "Vatan sevgisi ve vatana bağlılık",
      [["Özlem ve gurbet acısı", "kavrama", "Şiirde vatandan uzak kalan birinin hüznü anlatılmıyor; şair vatanı içinde yaşıyor."],
       ["Korku ve endişe", "kavrama", "Şiirde tehlike ya da kaygı bildiren bir dize yok; tam tersine huzur var."],
       ["Doğaya karşı öfke", "dikkat", "Doğa (ova, dağ, buğday, kuş) şiirde sevgiyle anlatılmıştır."]],
      "Son dizeye dikkat et: “Senin adın bana yeter.” Şair kime sesleniyor?",
      C("Şiirde öne çıkan duyguyu belirleyeceğiz.", "Şiirdeki duyguyu bulmak için şairin seslendiği varlığa ve kullandığı sözcüklere bakarız.",
        ["Şair vatana “sen” diye sesleniyor: “Ovalarına, toprağında, her köşen…”", "“Sevgin kalbimi sarar.” ve “Senin adın bana yeter.” dizeleri derin bir sevgi ve bağlılık anlatıyor."],
        "Ağır basan duygu: <b>vatan sevgisi ve vatana bağlılık</b>.", "Panonun başlığı da “Vatan”; şiirdeki güzellikler hep vatanın güzellikleri olarak anlatılmış."),
      { gorsel: SIIR, kural: "Şiirin duygusunu şairin sözcük seçimlerinden ve seslendiği varlıktan çıkar.", dogruNeden: "Şair vatanının güzelliklerini sevgiyle anlatıp “Senin adın bana yeter.” diyerek bağlılığını dile getirir." }),
  );

  /* ======================= İstiklâl Marşı ======================= */
  function zaman(olaylar, etiket) {
    const n = olaylar.length, W = 620, H = 170, sol = 70, sag = 550, y = 70, xk = i => sol + i * (sag - sol) / (n - 1);
    let ic = G.ok(20, y, 605, y);
    olaylar.forEach(([t, m], i) => {
      ic += `<circle class="${m === "?" ? "g-d" : "g-a"}" cx="${xk(i)}" cy="${y}" r="9"/>` + G.yazi(xk(i), y - 18, t, { b: 1 });
      String(m).split("|").forEach((s, j) => { ic += t13(xk(i), y + 32 + j * 16, s, { f: m === "?" ? 22 : 13, b: m === "?" }); });
    });
    return G.svg(W, H, ic, etiket || "zaman şeridi");
  }
  SORU_EKLE("trist.bilgi",
    Q("trist.bilgi", "hatirlama", 1, "Zaman şeridinde “?” ile gösterilen olay hangisidir?", "İstiklâl Marşı TBMM'de kabul edildi.",
      [["Cumhuriyet ilan edildi.", "bilgi", "Cumhuriyet 29 Ekim 1923'te ilan edildi; şeridin son noktasıdır."],
       ["TBMM açıldı.", "bilgi", "TBMM 23 Nisan 1920'de açıldı; şeritte zaten ikinci sırada yazıyor."],
       ["Büyük Taarruz başladı.", "bilgi", "Büyük Taarruz 26 Ağustos 1922'de başladı; 12 Mart 1921 ile ilgili değildir."]],
      "12 Mart 1921'i hatırla: Mehmet Âkif'in şiiri o gün mecliste ne oldu?",
      C("Şeritteki 12 Mart 1921 tarihine ait olayı bulacağız.", "İstiklâl Marşı, Mehmet Âkif Ersoy tarafından yazılmış ve 12 Mart 1921'de TBMM'de kabul edilmiştir.",
        ["Şeritteki olaylar: 19 Mayıs 1919 Samsun'a çıkış, 23 Nisan 1920 TBMM'nin açılışı, 29 Ekim 1923 Cumhuriyet'in ilanı.", "Arada kalan 12 Mart 1921, İstiklâl Marşı'nın kabul tarihidir."],
        "“?” yerine <b>İstiklâl Marşı TBMM'de kabul edildi</b> gelir.", "Sıra mantıklı mı? Meclis 1920'de açıldı, marşı 1921'de kabul etti, 1923'te Cumhuriyet ilan edildi. Evet."),
      { gorsel: zaman([["19 Mayıs 1919", "Samsun'a|çıkış"], ["23 Nisan 1920", "TBMM|açıldı"], ["12 Mart 1921", "?"], ["29 Ekim 1923", "Cumhuriyet|ilan edildi"]], "1919–1923 zaman şeridi"),
        kural: "İstiklâl Marşı: Mehmet Âkif Ersoy, 12 Mart 1921, TBMM.", dogruNeden: "12 Mart 1921, İstiklâl Marşı'nın TBMM'de millî marş olarak kabul edildiği tarihtir." }),
  );
  SORU_EKLE("trist.dinleme",
    Q("trist.dinleme", "transfer", 1, "Okul panosuna asılan afişteki maddelerden hangisi İstiklâl Marşı okunurken uyulması gereken <b>saygı kurallarına uymaz</b>?", "4. madde",
      [["1. madde", "kavrama", "Hazır ol duruşu saygının en temel göstergesidir; bu madde doğrudur."],
       ["2. madde", "kavrama", "Marş sırasında konuşmamak ve yerinden ayrılmamak saygı gereğidir."],
       ["3. madde", "kavrama", "Bayrağa dönük durmak, marşa ve bayrağa saygıyı gösterir."]],
      "Marş bitmeden yapılan bir hareket saygısızlık olur mu?",
      C("Afişteki kurallardan yanlış olanı bulacağız.", "İstiklâl Marşı okunurken hazır ol durulur, konuşulmaz, bayrağa dönük durulur ve marş bitene kadar beklenir.",
        ["1., 2. ve 3. maddeler saygı kurallarıyla uyumlu.", "4. madde “marşın son kıtasında oturabilirsin” diyor; marş bitmeden oturmak saygı kuralına aykırıdır."],
        "Kurala uymayan madde <b>4. maddedir</b>.", "Doğrusu: “Marş tamamen bitene kadar hazır ol duruşunu bozma.”"),
      { gorsel: afis("🎵 TÖREN KURALLARIMIZ", "1. Marş başlayınca hazır ol duruşuna geç.|2. Konuşma, yerinden ayrılma.|3. Yüzün bayrağa dönük olsun.|4. Marşın son kıtasında yerine oturabilirsin.", { etiket: "tören kuralları afişi" }),
        kural: "İstiklâl Marşı bitene kadar hazır ol duruşu korunur.", dogruNeden: "Marş bitmeden oturmak saygı kuralına aykırıdır; 4. madde bu yüzden yanlıştır." }),
  );

  /* ======================= 1071'den 1922'ye ======================= */
  SORU_EKLE("trzaf.sira",
    Q("trzaf.sira", "uygulama", 2, "Görseldeki olay kartları <b>oluş sırasına</b> göre (en eskiden en yeniye) dizilirse hangi sıralama elde edilir?", "L – N – M – K",
      [["L – M – N – K", "islem", "İstanbul'un Fethi (1453), Sakarya Meydan Muharebesi'nden (1921) çok önce olmuştur; N, M'den önce gelmeli."],
       ["K – M – N – L", "strateji", "Bu sıralama en yeniden en eskiye doğru yapılmış ve N ile M de karışmış."],
       ["N – L – M – K", "islem", "Malazgirt (1071), İstanbul'un Fethi'nden (1453) öncedir; sıralama L ile başlamalı."]],
      "Kartlardaki yılları küçükten büyüğe sırala.",
      C("Dört olay kartını tarih sırasına koyacağız.", "Oluş sırasına göre dizmek, en küçük yıldan en büyük yıla doğru sıralamak demektir.",
        ["Kartların yılları: K 1922, L 1071, M 1921, N 1453.", "Küçükten büyüğe: 1071 (L) → 1453 (N) → 1921 (M) → 1922 (K)."],
        "Sıralama: <b>L – N – M – K</b>.", "Yan yana iki yıl arasında hep artış var mı? 1071 < 1453 < 1921 < 1922. Evet."),
      { gorsel: kartlar([["K", "Büyük Taarruz|1922"], ["L", "Malazgirt Zaferi|1071"], ["M", "Sakarya Zaferi|1921"], ["N", "İstanbul'un Fethi|1453"]], { w: 150, h: 70, etiket: "dört tarihli olay kartı" }),
        kural: "Oluş sırası = en eski tarihten en yeni tarihe.", dogruNeden: "Yıllar 1071, 1453, 1921, 1922 sırasıyla L, N, M ve K kartlarındadır." }),
  );
  SORU_EKLE("trzaf.sebep",
    Q("trzaf.sebep", "baglanti", 2, "Şemada Kurtuluş Savaşı yıllarında cepheye cephane taşıyan bir köyde yaşananlar sebep–sonuç zinciriyle gösterilmiştir. “?” ile gösterilen kutuya hangisi gelmelidir?", "Kağnılar ilerlemekte zorlandı.",
      [["Günlerce yağmur yağdı.", "kavrama", "Bu, zincirin başındaki ilk sebeptir; sonuç kutusuna gelmez."],
       ["Yollar kurudu ve sertleşti.", "kavrama", "Yağmurdan sonra yollar kurumaz, çamurlaşır; zincirdeki bilgiyle çelişir."],
       ["Köyde bayram kutlandı.", "dikkat", "Bu olayın çamurlu yollarla bir sebep–sonuç ilişkisi yoktur."]],
      "Ok, “bu yüzden” anlamına gelir. “Yollar çamur oldu, bu yüzden …” cümlesini tamamla.",
      C("Zincirdeki son halkayı, yani sonucu bulacağız.", "Sebep–sonuç ilişkisinde ilk olay ikincisinin nedenidir. Okları “bu yüzden” diye okuyabiliriz.",
        ["1. kutu: Günlerce yağmur yağdı → bu yüzden → 2. kutu: Yollar çamur oldu.", "Çamurlu yolun sonucu ne olur? Tekerlekleri tahta olan kağnılar çamura saplanır, zor ilerler."],
        "“?” kutusuna <b>“Kağnılar ilerlemekte zorlandı.”</b> gelir.", "Zinciri baştan oku: Yağmur yağdı, bu yüzden yollar çamur oldu, bu yüzden kağnılar zor ilerledi. Mantıklı."),
      { gorsel: G.svg(600, 120,
        [["Günlerce|yağmur yağdı.", 20], ["Yollar çamur|oldu.", 220], ["?", 420]].map(([m, x]) => `<rect class="${m === "?" ? "g-b" : "g-yumusak"} g-cizgi" x="${x}" y="20" width="160" height="80" rx="10" stroke-width="2"/>` +
          m.split("|").map((s, j, a) => t13(x + 80, 64 + (j - (a.length - 1) / 2) * 18, s, { f: m === "?" ? 30 : 15, b: m === "?" })).join("")).join("") +
        G.ok(182, 60, 216, 60) + G.ok(382, 60, 416, 60), "sebep sonuç zinciri"),
        kural: "Sebep–sonuç zincirinde her halka bir öncekinin sonucudur.", dogruNeden: "Çamurlu yollar, cephane taşıyan kağnıların zor ilerlemesine yol açar." }),
  );

  /* ======================= Mustafa Kemal Paşa'nın Samsun'a Çıkışı ======================= */
  SORU_EKLE("trsam.tarih",
    Q("trsam.tarih", "uygulama", 3, "Şematik haritada Mustafa Kemal Paşa'nın 1919'daki yolculuğunun bazı durakları numaralarla gösterilmiştir. <b>4 numaralı</b> durakta toplanan kongre hangisidir?", "Erzurum Kongresi",
      [["Sivas Kongresi", "dikkat", "Sivas Kongresi 4 Eylül 1919'da toplandı; haritada 5 numaralı duraktır."],
       ["Amasya Genelgesi", "bilgi", "Amasya'da bir kongre değil, genelge yayımlandı; Amasya haritada 3 numaradır."],
       ["Havza Genelgesi", "dikkat", "Havza 2 numaralı duraktır ve orada da kongre değil, genelge yayımlandı."]],
      "4 numaralı durağın şehrini ve tarihini bul; o tarihte hangi kongre toplandı?",
      C("Haritadaki 4 numaralı durakta toplanan kongreyi bulacağız.", "1919'da sırasıyla: Samsun'a çıkış (19 Mayıs), Havza (25 Mayıs), Amasya Genelgesi (22 Haziran), Erzurum Kongresi (23 Temmuz), Sivas Kongresi (4 Eylül), Ankara'ya geliş (27 Aralık).",
        ["Haritada 4 numara doğuda, Erzurum'dadır; tarih 23 Temmuz 1919.", "23 Temmuz 1919'da Erzurum'da toplanan kongre Erzurum Kongresi'dir."],
        "4 numaralı durakta <b>Erzurum Kongresi</b> toplanmıştır.", "Sırayı sına: 3 Amasya (Haziran) → 4 Erzurum (Temmuz) → 5 Sivas (Eylül). Aylar da sıralı."),
      { gorsel: G.svg(600, 300,
        `<path class="g-yumusak g-cizgi" d="M20 70 Q160 40 300 45 Q450 40 590 75 L590 280 L20 280 Z" stroke-width="1.5"/>` + G.yazi(300, 26, "KARADENİZ", { k: 1 }) +
        G.ok(300, 62, 276, 92, "g-ok-a") + G.ok(272, 98, 290, 130, "g-ok-a") + G.ok(292, 138, 528, 148, "g-ok-a") + G.ok(540, 155, 402, 212, "g-ok-a") + G.ok(378, 216, 152, 216, "g-ok-a") +
        [["1", "Samsun", "19 Mayıs 1919", 300, 62, 16, 0, "start"], ["2", "Havza", "25 Mayıs 1919", 272, 98, -16, -6, "end"], ["3", "Amasya", "22 Haziran 1919", 292, 138, -16, 4, "end"], ["4", "Erzurum", "23 Temmuz 1919", 540, 150, 0, -52, "middle"], ["5", "Sivas", "4 Eylül 1919", 390, 216, 0, 10, "middle"], ["6", "Ankara", "27 Aralık 1919", 140, 216, 0, 10, "middle"]].map(([n, ad, t, x, y, dx, dy, a]) =>
          `<circle class="g-d" cx="${x}" cy="${y}" r="11"/>` + `<text class="g-bos" style="font-size:13px" font-weight="700" x="${x}" y="${y + 5}" text-anchor="middle">${n}</text>` +
          t13(x + dx, y + dy + 22, ad, { a, b: 1 }) + t13(x + dx, y + dy + 38, t, { a, f: 12 })).join("") +
        G.yazi(300, 272, "(Şematik çizim, ölçeksizdir.)", { k: 1 }), "1919 yolculuğunun durakları"),
        kural: "1919: Samsun → Havza → Amasya → Erzurum → Sivas → Ankara.", dogruNeden: "Haritada 4 numaralı durak Erzurum'dur ve 23 Temmuz 1919'da burada Erzurum Kongresi toplanmıştır." }),
  );
  SORU_EKLE("trsam.tur",
    Q("trsam.tur", "aciklama", 2, "Görselde iki kitabın arka kapak yazısı verilmiştir. Bu kitapların türleri <b>sırasıyla</b> hangisidir?", "I. anı – II. biyografi",
      [["I. biyografi – II. anı", "kavrama", "I. kitapta yazar kendi yaşadıklarını “ben” diliyle anlatıyor; bu anıdır. II. kitap başkasının hayatını anlatıyor."],
       ["I. masal – II. anı", "bilgi", "Masal olağanüstü olaylar anlatır; I. kitapta yaşanmış gerçek olaylar var."],
       ["I. anı – II. masal", "bilgi", "II. kitap gerçek bir şairin hayatını anlatıyor; masal değildir."]],
      "Kitabı kim yazmış, kimin hayatını anlatıyor? Ben dili mi, o dili mi?",
      C("İki arka kapak yazısından kitapların türlerini belirleyeceğiz.", "Anı: Yazarın kendi yaşadıklarını anlattığı türdür (ben dili). Biyografi: Bir kişinin hayatının başka biri tarafından anlatıldığı türdür (o dili).",
        ["I. kitap: “Köyümde geçen çocukluk yıllarımı anlattım.” Yazar kendi hayatını ben diliyle anlatıyor → anı.", "II. kitap: “Şairin doğumundan ölümüne kadar hayatını belgelerle anlatıyor.” Başkasının hayatı → biyografi."],
        "Türler: <b>I. anı – II. biyografi</b>.", "Ayırt etme ipucu: Anıda yazar ile anlatılan kişi aynıdır; biyografide farklıdır."),
      { gorsel: G.svg(600, 210, [["I", "Çocukluğumun Köyü", "“Bu kitapta köyümde geçen|çocukluk yıllarımı, yaşadığım|her şeyi anlattım.”", 20], ["II", "Bir Şairin Hayatı", "“Yazar, şairin doğumundan|ölümüne kadar hayatını|belgelerle anlatıyor.”", 310]].map(([n, b, m, x]) =>
        `<rect class="g-yumusak g-cizgi" x="${x}" y="10" width="270" height="190" rx="10" stroke-width="2"/>` + `<circle class="g-b g-cizgi" cx="${x + 24}" cy="34" r="13"/>` + t13(x + 24, 39, n, { b: 1 }) + t13(x + 150, 40, "📕 " + b, { b: 1, f: 15 }) +
        m.split("|").map((s, j) => t13(x + 135, 92 + j * 22, s, { f: 14 })).join("")).join(""), "iki kitabın arka kapak yazısı"),
        kural: "Anı = yazarın kendi yaşadıkları; biyografi = başkasının hayat hikâyesi.", dogruNeden: "I. kitapta yazar kendi çocukluğunu, II. kitapta ise bir şairin hayatını anlatmaktadır." }),
  );

  /* ======================= Ova Çocuk ======================= */
  SORU_EKLE("trova.karakter",
    Q("trova.karakter", "aciklama", 1, "Karikatür şeridine göre Ali'nin <b>en belirgin</b> kişilik özelliği hangisidir?", "Yardımsever",
      [["Tembel", "kavrama", "Ali ağır torbaları taşımayı kendisi öneriyor; tembel biri bunu yapmaz."],
       ["Kıskanç", "bilgi", "Şeritte Ali'nin kimseyi kıskandığını gösteren bir söz ya da davranış yok."],
       ["Bencil", "kavrama", "Bencil kişi yalnızca kendini düşünür; Ali ise yaşlı komşusunu düşünüyor."]],
      "Ali ne söylüyor, ne yapıyor? Davranışı ona hangi özelliği kazandırıyor?",
      C("Şeritteki davranışlardan Ali'nin kişilik özelliğini çıkaracağız.", "Hikâyedeki kişilerin özelliklerini sözlerinden ve davranışlarından anlarız.",
        ["1. panel: Ali, torba taşıyan komşusuna “Yardım edeyim!” diyor.", "2. panelde torbalar ağır olsa da vazgeçmiyor; 3. panelde komşusu ona teşekkür ediyor."],
        "Ali'nin en belirgin özelliği <b>yardımsever</b> olmasıdır.", "Ali'nin yerine bencil birini koysaydık torbalara bakıp geçerdi. Ali bunu yapmadı."),
      { gorsel: serit([{ ust: "Market dönüşü", balon: "Nermin Teyze,|yardım edeyim!", ad: "Ali", ikon: "🛍️" }, { ust: "Merdivenlerde", balon: "Biraz ağır|ama olsun!", ad: "Ali", ikon: "🪜" },
        { ust: "Kapının önünde", balon: "Sağ ol evladım,|çok iyisin!", ad: "Nermin Teyze", ikon: "🚪" }], "Ali'nin komşusuna yardımını anlatan üç panel"),
        kural: "Kişilik özelliği, kişinin davranışlarından çıkarılır.", dogruNeden: "Ali, istenmeden komşusunun ağır torbalarını taşıyarak yardımseverliğini göstermiştir." }),
  );

  /* ======================= Mısır - İspanya - Norveç ======================= */
  SORU_EKLE("trulk.karsilastirma",
    Q("trulk.karsilastirma", "uygulama", 2, "Tablodaki bilgilere göre aşağıdaki yargılardan hangisi <b>söylenemez</b>?", "Üç ülkede de aynı dil konuşulur.",
      [["Mısır'ın başkenti Kahire'dir.", "dikkat", "Bu bilgi tabloda açıkça yazıyor; söylenebilir."],
       ["Norveç'te fiyortlar görülür.", "dikkat", "Tablonun “Bilinen özelliği” sütununda Norveç için fiyortlar yazıyor."],
       ["İspanya'nın resmî dili İspanyolcadır.", "dikkat", "Tabloda İspanya'nın dili İspanyolca olarak verilmiş; bu yargı doğrudur."]],
      "“Dil” sütununu yukarıdan aşağı oku: Üç satırda aynı mı yazıyor?",
      C("Tabloyla çelişen yargıyı bulacağız.", "Karşılaştırma yaparken benzer ve farklı yönleri tablodaki sütunlara bakarak belirleriz.",
        ["Başkentler: Kahire, Madrid, Oslo. Bilinen özellikler: Nil Nehri, flamenko, fiyortlar.", "Diller: Arapça, İspanyolca, Norveççe. Üç dil birbirinden farklı."],
        "Söylenemeyecek yargı: <b>“Üç ülkede de aynı dil konuşulur.”</b>", "Bu üç ülke farklı yönleriyle karşılaştırıldığında dil, en açık farklılıklardan biridir."),
      { gorsel: G.tablo(["Ülke", "Başkent", "Dil", "Bilinen özelliği"], [["Mısır", "Kahire", "Arapça", "Nil Nehri, piramitler"], ["İspanya", "Madrid", "İspanyolca", "Flamenko dansı"], ["Norveç", "Oslo", "Norveççe", "Fiyortlar, kutup ışıkları"]]),
        kural: "Tablodan yargı çıkarırken her bilgiyi ilgili satır ve sütunla eşleştir.", dogruNeden: "Tabloda üç ülkenin dilleri Arapça, İspanyolca ve Norveççe olarak birbirinden farklıdır." }),
  );
  SORU_EKLE("trulk.nesnel",
    Q("trulk.nesnel", "uygulama", 2, "Karikatür şeridinde dört öğrenci Norveç hakkında konuşuyor. Hangi paneldeki balonda <b>nesnel</b> bir yargı vardır?", "1. panel",
      [["2. panel", "kavrama", "“En güzel ülke” kişisel bir beğenidir; herkes aynı düşünmeyebilir. Bu öznel yargıdır."],
       ["3. panel", "kavrama", "“İnsanı büyülüyor” bir duygu bildirir; kanıtlanamaz, öznel yargıdır."],
       ["4. panel", "kavrama", "“Sıkıcı” kişiden kişiye değişen bir değerlendirmedir; öznel yargıdır."]],
      "Hangi bilgi atlas ya da ansiklopedi ile doğrulanabilir?",
      C("Dört balondan nesnel yargıyı bulacağız.", "Nesnel yargı kanıtlanabilir, kişiden kişiye değişmez. Öznel yargı kişisel görüş, duygu ya da beğeni bildirir.",
        ["1. panel: “Norveç'in başkenti Oslo'dur.” Atlasla doğrulanabilir; nesnel.", "2., 3. ve 4. panellerde “en güzel”, “büyülüyor”, “sıkıcı” gibi kişisel değerlendirmeler var; öznel."],
        "Nesnel yargı <b>1. paneldedir</b>.", "Sınama yolu: “Bu bilgiye herkes aynı cevabı verir mi?” 1. panel için evet, ötekiler için hayır."),
      { gorsel: serit([{ ust: "Ödev sunumu", balon: "Norveç'in başkenti|Oslo'dur.", ad: "Arda", ikon: "🗺️" }, { ust: "Ödev sunumu", balon: "Norveç dünyanın|en güzel ülkesi!", ad: "Selin", ikon: "😍" },
        { ust: "Ödev sunumu", balon: "Fiyortlar insanı|büyülüyor.", ad: "Kaan", ikon: "🏞️" }, { ust: "Ödev sunumu", balon: "Orada kışlar|çok sıkıcı geçer.", ad: "Duru", ikon: "❄️" }], "Norveç hakkında konuşan dört öğrenci"),
        kural: "Nesnel = kanıtlanabilir bilgi; öznel = kişisel görüş, duygu.", dogruNeden: "Norveç'in başkentinin Oslo olduğu kanıtlanabilir bir bilgidir; nesnel yargıdır." }),
  );

  /* ======================= Ay Avcısı Eskimolar ======================= */
  SORU_EKLE("treks.gercek",
    Q("treks.gercek", "aciklama", 2, "Görseldeki bilgi kartlarından hangisinde <b>hayal ürünü</b> bir ifade vardır?", "C kartı",
      [["A kartı", "kavrama", "Kar bloklarından iglo yapılması gerçek bir yapı tekniğidir; hayal ürünü değildir."],
       ["B kartı", "kavrama", "Kutup bölgesinde kışın uzun geceler yaşanması gerçek bir doğa olayıdır."],
       ["D kartı", "kavrama", "Köpek kızaklarıyla ulaşım, kutup bölgelerinde gerçekten kullanılan bir yöntemdir."]],
      "Gerçek hayatta olabilecek ile olamayacak olanı ayır: Hayvanlar konuşabilir mi?",
      C("Dört karttan hayal ürünü ifadeyi bulacağız.", "Gerçek ifadeler gerçek hayatta olabilecek ya da kanıtlanabilecek durumları anlatır. Hayal ürünü ifadeler gerçekte olamayacak şeyleri anlatır.",
        ["A (iglo), B (uzun kutup geceleri), D (köpek kızağı): hepsi gerçekte görülebilir.", "C kartı: “Kutup ayıları avcılara konuşarak yol gösterir.” Hayvanlar insan gibi konuşamaz."],
        "Hayal ürünü ifade <b>C kartındadır</b>.", "Bu tür ifadeler masal ve fablların özelliğidir; bilgilendirici metinlerde yer almaz."),
      { gorsel: kartlar([["A", "Kar bloklarından|iglo yapılır."], ["B", "Kışın geceler|çok uzun sürer."], ["C", "Kutup ayıları|konuşarak yol|gösterir."], ["D", "Köpek kızağıyla|yolculuk yapılır."]], { w: 260, h: 78, satir: 2, etiket: "dört bilgi kartı" }),
        kural: "Gerçekte olamayacak durumlar hayal ürünüdür.", dogruNeden: "Hayvanların konuşması gerçek hayatta olamaz; C kartı hayal ürünüdür." }),
  );

  /* ======================= Türk Dünyası ======================= */
  SORU_EKLE("trtdk.bilgi",
    Q("trtdk.bilgi", "hatirlama", 2, "Şematik görselde bazı Türk devletleri ve başkentleri verilmiştir. “?” ile gösterilen başkent hangisidir?", "Bişkek",
      [["Taşkent", "bilgi", "Taşkent, Özbekistan'ın başkentidir; görselde zaten Özbekistan'ın kutusunda yazıyor."],
       ["Aşkabat", "bilgi", "Aşkabat, Türkmenistan'ın başkentidir."],
       ["Bakü", "bilgi", "Bakü, Azerbaycan'ın başkentidir."]],
      "“?” hangi ülkenin kutusunda? O ülkenin başkentini hatırla.",
      C("Görselde boş bırakılan başkenti bulacağız.", "Türk devletleri ve başkentleri: Azerbaycan–Bakü, Türkmenistan–Aşkabat, Özbekistan–Taşkent, Kazakistan–Astana, Kırgızistan–Bişkek.",
        ["Görselde dolu olanlar: Bakü, Aşkabat, Taşkent, Astana.", "“?” Kırgızistan'ın kutusunda. Kırgızistan'ın başkenti Bişkek'tir."],
        "“?” yerine <b>Bişkek</b> gelir.", "Elenen seçeneklerin her biri görselde başka bir ülkeye ait; yalnızca Bişkek boşta kaldı."),
      { gorsel: G.svg(600, 220,
        [["Azerbaycan", "Bakü", 70, 150], ["Türkmenistan", "Aşkabat", 200, 170], ["Özbekistan", "Taşkent", 330, 120], ["Kazakistan", "Astana", 420, 40], ["Kırgızistan", "?", 510, 140]].map(([u, b, x, y]) =>
          `<rect class="${b === "?" ? "g-b" : "g-yumusak"} g-cizgi" x="${x - 62}" y="${y - 26}" width="124" height="56" rx="10" stroke-width="1.5"/>` + t13(x, y - 6, u, { b: 1 }) + t13(x, y + 16, "⭐ " + b, { f: b === "?" ? 18 : 13, b: b === "?" })).join("") +
        G.yazi(300, 212, "(Batıdan doğuya şematik yerleşim)", { k: 1 }), "Türk devletleri ve başkentleri"),
        kural: "Kırgızistan–Bişkek, Kazakistan–Astana, Özbekistan–Taşkent, Türkmenistan–Aşkabat, Azerbaycan–Bakü.", dogruNeden: "Görselde “?” Kırgızistan'ın kutusundadır; Kırgızistan'ın başkenti Bişkek'tir." }),
  );

  /* ======================= Üretmek Gibisi Yok! (3) ======================= */
  SORU_EKLE("truret3.tamamla",
    Q("truret3.tamamla", "uygulama", 2, "Annesinin buzdolabına astığı alışveriş listesinde bazı harfler silinmiştir. Boşluklara <b>sırasıyla</b> hangi harfler gelmelidir?", "u – y – t – m",
      [["o – y – t – m", "bilgi", "Doğru yazım “yumurta”dır; “yomurta” yanlıştır."],
       ["u – n – t – m", "dikkat", "“Pe_nir” boşluğuna n gelirse “pennir” olur; doğrusu “peynir”."],
       ["u – y – d – m", "bilgi", "Doğru yazım “zeytin”dir; “zeydin” yanlış yazımdır."]],
      "Her sözcüğü yüksek sesle, doğru söyleyerek oku.",
      C("Listedeki dört sözcüğün eksik harflerini bulacağız.", "Sözcüklerin doğru yazımını sözlükten ve doğru söyleyişten öğreniriz.",
        ["1. y_murta → yumurta (u). 2. pe_nir → peynir (y).", "3. zey_in → zeytin (t). 4. ek_ek → ekmek (m)."],
        "Sırasıyla <b>u – y – t – m</b> harfleri gelir.", "Tamamlanmış liste: yumurta, peynir, zeytin, ekmek. Hepsi bir kahvaltı sofrasına uyuyor."),
      { gorsel: afis("🛒 ALIŞVERİŞ LİSTESİ", "1. y _ murta (10 tane)|2. pe _ nir (yarım kilo)|3. zey _ in (siyah)|4. ek _ ek (2 tane)", { etiket: "eksik harfli alışveriş listesi" }),
        kural: "Yazımından emin olmadığın sözcüğe sözlükten bak.", dogruNeden: "Sözcüklerin doğru yazımı yumurta, peynir, zeytin ve ekmektir; eksik harfler u, y, t, m'dir." }),
  );
})();
