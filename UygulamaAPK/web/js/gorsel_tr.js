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
      s.forEach((t, j) => { ic += t13(x + w / 2 + (harf ? 6 : 0), y + h / 2 + 5 + (j - (s.length - 1) / 2) * 17, t, { f: 14 }); });
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
})();
