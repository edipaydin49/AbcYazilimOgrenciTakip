/* İngilizce — görselli ek sorular (saat, ders programı, takvim, kat rehberi, harita, hava durumu haritası, menü, bayraklar, levhalar).
 * A1 düzeyi, British English. Her sorunun görseli çözüm için gereklidir; görseller yalnızca g-* sınıfları ve basit SVG ile çizilir.
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
  const harfRozet = (x, y, h) => `<circle class="g-b g-cizgi" fill-opacity="0.5" cx="${x}" cy="${y}" r="12"/>` + t13(x, y + 5, h, { b: 1 });
  // Analog saat(ler): [[saat, dakika, etiket], ...]
  function saatler(liste, etiket) {
    const W = liste.length * 170 + 10, H = 200;
    let ic = "";
    liste.forEach(([h, m, ad], i) => {
      const cx = 90 + i * 170, cy = 85, r = 66;
      ic += `<circle class="g-bos g-cizgi" cx="${cx}" cy="${cy}" r="${r}" stroke-width="3"/>`;
      for (let k = 1; k <= 12; k++) { const a = k * Math.PI / 6; ic += t13((cx + Math.sin(a) * (r - 14)).toFixed(1), (cy - Math.cos(a) * (r - 14) + 5).toFixed(1), k, { f: 12 }); }
      const as = ((h % 12) + m / 60) * Math.PI / 6, ad2 = m * Math.PI / 30;
      ic += `<line class="g-cizgi" x1="${cx}" y1="${cy}" x2="${(cx + Math.sin(as) * 34).toFixed(1)}" y2="${(cy - Math.cos(as) * 34).toFixed(1)}" stroke-width="5" stroke-linecap="round"/>` +
        `<line class="g-ok-a" x1="${cx}" y1="${cy}" x2="${(cx + Math.sin(ad2) * 42).toFixed(1)}" y2="${(cy - Math.cos(ad2) * 42).toFixed(1)}" stroke-width="3" stroke-linecap="round"/>` +
        `<circle class="g-d" cx="${cx}" cy="${cy}" r="4"/>` + (ad ? t13(cx, 180, ad, { b: 1, f: 14 }) : "");
    });
    return G.svg(W, H, ic, etiket || "saat");
  }
  // Harfli resim kartları: [[harf, emoji, alt yazı?], ...]
  function resimler(liste, etiket, { w = 130, h = 110 } = {}) {
    const W = liste.length * (w + 12) + 12, H = h + 24;
    let ic = "";
    liste.forEach(([hf, e, alt], i) => {
      const x = 12 + i * (w + 12);
      ic += `<rect class="g-yumusak g-cizgi" x="${x}" y="12" width="${w}" height="${h}" rx="10" stroke-width="1.5"/>` + (hf ? harfRozet(x + 16, 28, hf) : "") + ikon(x + w / 2, alt ? 78 : 88, e, 44) + (alt ? t13(x + w / 2, 108, alt, { b: 1 }) : "");
    });
    return G.svg(W, H, ic, etiket);
  }
  // Bilgi panosu (başlık + satırlar)
  function pano(baslik, govde, { W = 520, etiket = "notice" } = {}) {
    const s = govde.split("|"), H = 78 + s.length * 26;
    let ic = `<rect class="g-yumusak g-cizgi" x="8" y="8" width="${W - 16}" height="${H - 16}" rx="12" stroke-width="2"/><rect class="g-b" fill-opacity="0.5" x="9" y="9" width="${W - 18}" height="42" rx="11"/>` + G.yazi(W / 2, 36, baslik, { b: 1 });
    s.forEach((t, i) => { ic += t13(28, 82 + i * 26, t, { a: "start", f: 15 }); });
    return G.svg(W, H, ic, etiket);
  }

  /* ======================= School Routines ======================= */
  SORU_EKLE("enrut.present",
    Q("enrut.present", "uygulama", 1, "Look at Elif's clocks. <b>What time does Elif get up?</b>", "She gets up at half past seven.",
      [["She gets up at half past six.", "dikkat", "Kısa (akrep) ibre 7 ile 8'in arasında; saat altı buçuk değil, yedi buçuk."],
       ["She gets up at seven o'clock.", "dikkat", "Uzun (yelkovan) ibre 6'yı gösteriyor; bu “o'clock” değil, “half past” demektir."],
       ["She get up at half past seven.", "kavrama", "Saat doğru ama he/she/it ile fiile -s eklenir: “She gets up”."]],
      "Önce “get up” yazan saate bak. Yelkovan 6'daysa “half past” denir.",
      C("“Get up” etiketli saati okuyup doğru cümleyi seçeceğiz.", "Yelkovan 12'de ise “o'clock”, 6'da ise “half past” deriz. Geniş zamanda he/she/it ile fiil -s alır.",
        ["“get up” saatinde yelkovan 6'da, akrep 7 ile 8 arasında: 7.30 = half past seven.", "Özne “she”, o hâlde fiil “gets up” olmalı."],
        "Doğru cevap: <b>She gets up at half past seven.</b>", "Öteki saat 8.15 (quarter past eight) ile karıştırma; o saat “go to school” saatidir."),
      { gorsel: saatler([[7, 30, "get up"], [8, 15, "go to school"]], "iki saat: get up 7.30, go to school 8.15"),
        kural: "half past = buçuk, quarter past = çeyrek geçiyor; he/she/it + fiil-s.", dogruNeden: "Saatte yelkovan 6'da, akrep 7 ile 8 arasındadır: half past seven; özne she olduğu için gets kullanılır." }),
  );
  SORU_EKLE("enrut.there",
    Q("enrut.there", "uygulama", 2, "Look at the school plan. Which sentence is <b>true</b>?", "There are two classrooms and a library.",
      [["There is a garden, but there isn't a gym.", "dikkat", "Planda bir spor salonu (gym) var; cümlenin ikinci kısmı yanlış."],
       ["There are three classrooms in the school.", "dikkat", "Planda yalnızca iki sınıf (Class 6A ve 6B) var."],
       ["There isn't a canteen in the school.", "dikkat", "Planda bir kantin (canteen) açıkça görülüyor."]],
      "Plandaki her odayı say ve yan yana olanlara dikkat et.",
      C("Okul planına bakıp doğru cümleyi bulacağız.", "Tekil için “There is / There isn't”, çoğul için “There are / There aren't” kullanılır.",
        ["Üst sıra: Library, Class 6A, Class 6B. Alt sıra: Canteen, Gym.", "Planda iki sınıf (6A, 6B) ve bir kütüphane var: There are two classrooms and a library."],
        "Doğru cümle: <b>There are two classrooms and a library.</b>", "“two classrooms” çoğul olduğu için “There are” doğru; cümle hem dilbilgisi hem bilgi olarak doğru."),
      { gorsel: G.svg(520, 230,
        [["Library", "📚", 20, 20], ["Class 6A", "✏️", 190, 20], ["Class 6B", "✏️", 360, 20], ["Canteen", "🥪", 20, 125], ["Gym", "🏀", 190, 125]].map(([ad, e, x, y]) =>
          `<rect class="g-yumusak g-cizgi" x="${x}" y="${y}" width="150" height="90" rx="6" stroke-width="2"/>` + ikon(x + 75, y + 48, e, 32) + t13(x + 75, y + 78, ad, { b: 1, f: 14 })).join("") +
        `<rect class="g-bos g-cizgi" x="360" y="125" width="150" height="90" rx="6" stroke-width="1" stroke-dasharray="5 4"/>` + t13(435, 175, "Garden 🌳", { f: 14 }), "school plan"),
        kural: "There is + tekil, There are + çoğul.", dogruNeden: "Planda iki sınıf (6A ve 6B) ve bir kütüphane bulunmaktadır." }),
  );
  SORU_EKLE("enrut.freq",
    Q("enrut.freq", "uygulama", 2, "Look at Can's chart for one school week (Monday–Friday). <b>Can ___ walks to school.</b>", "usually",
      [["always", "islem", "“Always” beş günün hepsi demektir; Can bir gün otobüsle gitmiş."],
       ["never", "dikkat", "Can dört gün yürümüş; “never” hiç demektir."],
       ["sometimes", "islem", "“Sometimes” ara sıra demektir; beş günün dördü “usually” (genellikle) olur."]],
      "Yürüyerek gittiği günleri say: 5 günün kaçı?",
      C("Tabloya göre uygun sıklık zarfını seçeceğiz.", "always (her zaman) > usually (genellikle) > often (sık sık) > sometimes (bazen) > never (asla).",
        ["Tabloda “walk” sütununda Monday, Tuesday, Wednesday ve Friday işaretli: 4 gün.", "Thursday günü “bus” işaretli. 5 günün 4'ü → genellikle → usually."],
        "Cevap: <b>usually</b> — Can usually walks to school.", "Hepsi işaretli olsaydı “always”, hiç işaret olmasaydı “never” derdik."),
      { gorsel: G.tablo(["Day", "🚶 walk", "🚌 bus"], [["Monday", "✔", ""], ["Tuesday", "✔", ""], ["Wednesday", "✔", ""], ["Thursday", "", "✔"], ["Friday", "✔", ""]]),
        kural: "5 günün 5'i always, 4'ü usually, 2–3'ü often/sometimes, 0'ı never.", dogruNeden: "Can beş günün dördünde yürüdüğü için “usually” uygundur." }),
  );

  /* ======================= Daily and Study Routines ======================= */
  SORU_EKLE("endly.howoften",
    Q("endly.howoften", "uygulama", 2, "Look at Zeynep's weekly timetable. <b>How often does Zeynep have a piano lesson?</b>", "twice a week",
      [["once a week", "islem", "Tabloda piano iki gün işaretli (Tuesday ve Thursday); bir değil."],
       ["every day", "dikkat", "“Every day” her gün demektir; piyano yalnızca iki gün var."],
       ["three times a week", "dikkat", "Üç gün olan etkinlik “swimming”; piyano iki gündür."]],
      "Tabloda “piano” satırını bul ve işaretleri say.",
      C("Tablodaki piyano dersinin sıklığını bulacağız.", "once a week = haftada bir, twice a week = haftada iki, three times a week = haftada üç kez.",
        ["“Piano” satırı: Tuesday ✔, Thursday ✔ → 2 gün.", "2 kez = twice. Haftada iki kez = twice a week."],
        "Cevap: <b>twice a week</b>.", "Swimming satırını da say: Monday, Wednesday, Friday → three times a week. İki satırı karıştırma."),
      { gorsel: G.tablo(["", "Mon", "Tue", "Wed", "Thu", "Fri"], [["🎹 piano", "", "✔", "", "✔", ""], ["🏊 swimming", "✔", "", "✔", "", "✔"], ["📖 reading", "✔", "✔", "✔", "✔", "✔"]]),
        kural: "once (1), twice (2), three times (3) a week.", dogruNeden: "Piyano dersi salı ve perşembe olmak üzere haftada iki kez işaretlidir: twice a week." }),
  );
  SORU_EKLE("endly.cont",
    Q("endly.cont", "uygulama", 2, "Look at the picture. It's Saturday morning in the Yılmaz family's living room. Which sentence describes the picture?", "Dad is reading a newspaper now.",
      [["Dad reads a newspaper now.", "kavrama", "“now” ile şu anda olan bir eylem anlatılır; present continuous (is reading) gerekir."],
       ["Mum is watching TV now.", "dikkat", "Resimde Mum'ın yanında kitap var; televizyon izleyen kişi Ali."],
       ["Ali is sleeping now.", "dikkat", "Resimde Ali'nin yanında televizyon var; uyumuyor, TV izliyor."]],
      "Her kişinin yanındaki resme bak; “now” hangi zamanı ister?",
      C("Resme uygun ve dilbilgisi doğru cümleyi bulacağız.", "Şu anda yapılan eylemler present continuous ile anlatılır: am/is/are + fiil-ing.",
        ["Resimde: Dad 📰 (gazete), Mum 📖 (kitap), Ali 📺 (televizyon).", "“now” → is reading. Dad is reading a newspaper now. Hem resim hem dilbilgisi uygun."],
        "Doğru cümle: <b>Dad is reading a newspaper now.</b>", "Ötekileri resimle karşılaştır: Mum is reading a book, Ali is watching TV."),
      { gorsel: resimler([["", "📰", "Dad"], ["", "📖", "Mum"], ["", "📺", "Ali"]], "Dad with a newspaper, Mum with a book, Ali with TV"),
        kural: "now / at the moment / look! → present continuous.", dogruNeden: "Resimde babanın yanında gazete vardır ve “now” için is reading kullanılır." }),
  );

  /* ======================= National Days ======================= */
  SORU_EKLE("ennat.days",
    Q("ennat.days", "uygulama", 1, "Look at the calendar pages. <b>Which national day is on the twenty-third of April?</b>", "National Sovereignty and Children's Day",
      [["Republic Day", "bilgi", "Republic Day (Cumhuriyet Bayramı) 29 October'dadır."],
       ["Victory Day", "bilgi", "Victory Day (Zafer Bayramı) 30 August'tadır."],
       ["Commemoration of Atatürk, Youth and Sports Day", "bilgi", "Bu bayram 19 May'dedir."]],
      "“twenty-third of April” = 23 April. Takvimde 23 yazan sayfayı bul.",
      C("Takvimde 23 April'a denk gelen millî günü bulacağız.", "Tarihler sıra sayısıyla okunur: 23 April = the twenty-third of April.",
        ["Takvimdeki sayfalar: 23 April 🧒, 19 May 🏃, 30 August 🏅, 29 October 🇹🇷.", "23 April sayfasında çocuk simgesi var: Ulusal Egemenlik ve Çocuk Bayramı."],
        "Cevap: <b>National Sovereignty and Children's Day</b>.", "Tarihi tersten sına: National Sovereignty and Children's Day is on the 23rd of April. Doğru."),
      { gorsel: G.svg(560, 150, [["23", "April", "🧒"], ["19", "May", "🏃"], ["30", "August", "🏅"], ["29", "October", "🇹🇷"]].map(([g, a, e], i) =>
        `<rect class="g-bos g-cizgi" x="${12 + i * 136}" y="10" width="124" height="130" rx="8" stroke-width="2"/><rect class="g-d" x="${12 + i * 136}" y="10" width="124" height="30" rx="8"/>` +
        `<text class="g-bos" style="font-size:15px" font-weight="700" x="${74 + i * 136}" y="31" text-anchor="middle">${a}</text>` + G.yazi(74 + i * 136, 80, g, { b: 1 }) + ikon(74 + i * 136, 126, e, 32)).join(""), "four calendar pages"),
        kural: "23 April: National Sovereignty and Children's Day; 19 May: Youth and Sports Day; 30 August: Victory Day; 29 October: Republic Day.", dogruNeden: "23 Nisan, Ulusal Egemenlik ve Çocuk Bayramı'dır (National Sovereignty and Children's Day)." }),
  );

  /* ======================= Numbers ======================= */
  SORU_EKLE("ennum.ordinal",
    Q("ennum.ordinal", "transfer", 2, "Look at the shopping centre guide. Ece wants to buy a new book. <b>Which floor does she go to?</b>", "the second floor",
      [["the third floor", "dikkat", "Third floor'da oyuncakçı (toys) var; kitapçı bir kat aşağıda."],
       ["the two floor", "kavrama", "Kat söylerken sıra sayısı kullanılır: two değil, second."],
       ["the ground floor", "dikkat", "Ground floor'da market (food) var; kitaplar 2nd floor'da."]],
      "Rehberde 📚 Books satırını bul ve kat numarasını sıra sayısıyla oku.",
      C("Kat rehberine bakıp kitapçının katını bulacağız.", "Katlar sıra sayısıyla söylenir: 1st = first, 2nd = second, 3rd = third, 4th = fourth. İngiltere'de en alt kat “ground floor”dur.",
        ["Rehberde “Books 📚” satırı: 2nd floor.", "2nd = second → the second floor."],
        "Cevap: <b>the second floor</b>.", "Rehberi yukarıdan aşağı oku: 4th café, 3rd toys, 2nd books, 1st clothes, ground food. Sıralama tutarlı."),
      { gorsel: pano("🏬 CITY MALL – GUIDE", "4th floor ....... ☕ Café|3rd floor ....... 🧸 Toys|2nd floor ....... 📚 Books|1st floor ........ 👕 Clothes|Ground floor ... 🍎 Food", { etiket: "shopping centre guide" }),
        kural: "Katlar sıra sayısıyla söylenir: the first / second / third floor.", dogruNeden: "Rehberde kitaplar 2nd floor'da gösterilmiştir; bu “the second floor” diye okunur." }),
  );
  SORU_EKLE("ennum.cardinal",
    Q("ennum.cardinal", "uygulama", 2, "Look at the bike's price tag. <b>How much is the bike?</b>", "three hundred and forty-five pounds",
      [["three hundred and fifty-four pounds", "dikkat", "Rakamların yeri karışmış: etikette 354 değil, 345 yazıyor."],
       ["thirty-four five pounds", "kavrama", "345 sayısı “three hundred and forty-five” diye okunur; rakamlar tek tek okunmaz."],
       ["four hundred and forty-five pounds", "dikkat", "Etiketteki ilk rakam 3; four hundred değil, three hundred olmalı."]],
      "Etiketteki sayıyı yüzler, onlar ve birler diye ayır.",
      C("Etiketteki fiyatı İngilizce okuyacağız.", "İngiliz İngilizcesinde yüzlerden sonra “and” kullanılır: 345 = three hundred and forty-five.",
        ["£345 → 3 yüzler (three hundred), 45 (forty-five).", "Birleştir: three hundred and forty-five pounds."],
        "Cevap: <b>three hundred and forty-five pounds</b>.", "Yazıyı sayıya geri çevir: three hundred (300) + forty-five (45) = 345. Etiketle aynı."),
      { gorsel: G.svg(420, 150, ikon(90, 105, "🚲", 80) +
        `<path class="g-b g-cizgi" fill-opacity="0.5" d="M200 40 L380 40 L380 120 L200 120 L175 80 Z" stroke-width="2"/><circle class="g-bos g-cizgi" cx="196" cy="80" r="6"/>` +
        `<text class="g-yazi" style="font-size:38px" font-weight="700" x="295" y="94" text-anchor="middle">£345</text>`, "a bike with a price tag of 345 pounds"),
        kural: "Yüzlerden sonra “and”: 345 = three hundred and forty-five.", dogruNeden: "Etiketteki £345, “three hundred and forty-five pounds” diye okunur." }),
  );

  /* ======================= Body Parts, Appearance and Clothes ======================= */
  // Basit karakterler: { ad, sac: "uzun" | "kisa", gozluk, sapka }
  function karakterler(liste, etiket) {
    let ic = "";
    liste.forEach((k, i) => {
      const x = 75 + i * 140, y = 70;
      if (k.sac === "uzun") ic += `<rect fill="#8a5a2b" x="${x - 30}" y="${y - 30}" width="60" height="70" rx="22"/>`;
      ic += `<line class="g-cizgi" x1="${x}" y1="${y + 26}" x2="${x}" y2="${y + 40}" stroke-width="3"/><rect class="g-a" x="${x - 30}" y="${y + 38}" width="60" height="60" rx="14"/>`;
      ic += `<circle class="g-b g-cizgi" fill-opacity="0.5" cx="${x}" cy="${y}" r="26" stroke-width="2"/>`;
      if (k.sac === "kisa") ic += `<path fill="#8a5a2b" d="M${x - 27} ${y - 2} A27 27 0 0 1 ${x + 27} ${y - 2} L${x + 20} ${y - 12} L${x - 20} ${y - 12} Z"/>`;
      if (k.sac === "uzun") ic += `<path fill="#8a5a2b" d="M${x - 27} ${y - 4} A27 27 0 0 1 ${x + 27} ${y - 4} Z"/>`;
      if (k.gozluk) ic += `<circle class="g-bos g-cizgi" cx="${x - 10}" cy="${y + 4}" r="8" stroke-width="2"/><circle class="g-bos g-cizgi" cx="${x + 10}" cy="${y + 4}" r="8" stroke-width="2"/><line class="g-cizgi" x1="${x - 2}" y1="${y + 4}" x2="${x + 2}" y2="${y + 4}" stroke-width="2"/>`;
      if (k.sapka) ic += `<rect class="g-d" x="${x - 34}" y="${y - 26}" width="68" height="8" rx="3"/><rect class="g-d" x="${x - 20}" y="${y - 46}" width="40" height="22" rx="5"/>`;
      ic += t13(x, y + 120, k.ad, { b: 1, f: 15 });
    });
    return G.svg(liste.length * 140 + 10, 200, ic, etiket);
  }
  const KARAKTER4 = karakterler([{ ad: "Tom", sac: "kisa", gozluk: true }, { ad: "Sue", sac: "uzun", gozluk: true }, { ad: "Mike", sac: "kisa", sapka: true }, { ad: "Ann", sac: "uzun" }], "four people: Tom, Sue, Mike, Ann");
  SORU_EKLE("enapp.havegot",
    Q("enapp.havegot", "uygulama", 2, "Look at the picture. <b>Who is it?</b><br><i>“She has got long hair. She has got glasses.”</i>", "Sue",
      [["Ann", "dikkat", "Ann'in saçı uzun ama gözlüğü yok."],
       ["Tom", "dikkat", "Tom'un gözlüğü var ama saçı kısa; ayrıca cümle “she” diyor."],
       ["Mike", "dikkat", "Mike'ın saçı kısa, gözlüğü yok; şapkası var."]],
      "İki ipucunu birlikte kullan: long hair + glasses.",
      C("İki özelliği birden taşıyan kişiyi resimde bulacağız.", "have got / has got sahip olmayı anlatır: She has got long hair = Onun uzun saçı var.",
        ["Uzun saçlı olanlar: Sue ve Ann.", "Bu ikisinden gözlüklü olan: Sue."],
        "Cevap: <b>Sue</b>.", "Tom'u da anlat: He has got short hair and glasses. Sue ile Tom'un ortak özelliği gözlüktür."),
      { gorsel: KARAKTER4, kural: "I/you/we/they have got; he/she/it has got.", dogruNeden: "Resimde hem uzun saçlı hem gözlüklü olan tek kişi Sue'dur." }),
  );
  SORU_EKLE("enapp.body",
    Q("enapp.body", "uygulama", 2, "Look at the picture. Which sentence about <b>Mike</b> is true?", "He has got short hair and a hat.",
      [["He has got long hair and glasses.", "dikkat", "Bu özellikler Sue'ya ait; Mike'ın saçı kısa ve gözlüğü yok."],
       ["He has got short hair and glasses.", "dikkat", "Bu Tom'u anlatıyor; Mike'ın gözlüğü yok."],
       ["He hasn't got a hat.", "dikkat", "Resimde Mike'ın başında kırmızı bir şapka var."]],
      "Resimde Mike'ı bul: saçına, gözlerine ve başına bak.",
      C("Mike'ın görünüşünü doğru anlatan cümleyi seçeceğiz.", "Görünüş anlatırken: short / long hair, glasses, a hat gibi sözcükleri “has got” ile kullanırız.",
        ["Mike: kısa saç (short hair), başında kırmızı şapka (a hat).", "Gözlüğü yok (He hasn't got glasses)."],
        "Doğru cümle: <b>He has got short hair and a hat.</b>", "Olumsuzunu da kur: He hasn't got glasses. Resimle uyumlu."),
      { gorsel: KARAKTER4, kural: "Görünüş: hair (long/short), glasses, a hat, a beard…", dogruNeden: "Resimde Mike'ın saçı kısadır ve başında bir şapka vardır." }),
  );
  SORU_EKLE("enapp.whose",
    Q("enapp.whose", "uygulama", 1, "Look at the name tags. <b>— Whose umbrella is this? —</b> ___", "It's Deniz's.",
      [["It's Can's.", "dikkat", "Can'ın etiketi sırt çantasının üzerinde; şemsiye Deniz'in."],
       ["It's Lale's.", "dikkat", "Lale'nin etiketi topun üzerinde."],
       ["It's Deniz.", "kavrama", "Sahiplik bildirmek için isme 's eklenir: Deniz's."]],
      "Şemsiye (☂️) resmindeki isim etiketini oku ve sahiplik ekini unutma.",
      C("Şemsiyenin kime ait olduğunu bulup doğru cevabı seçeceğiz.", "Whose…? sahiplik sorar; cevapta isme 's eklenir: It's Deniz's (umbrella).",
        ["Resimler: 🎒 Can, ☂️ Deniz, ⚽ Lale.", "Şemsiye Deniz'in → It's Deniz's."],
        "Cevap: <b>It's Deniz's.</b>", "Uzun cevap: It's Deniz's umbrella. Kısa cevapta umbrella sözcüğünü atabiliriz."),
      { gorsel: resimler([["", "🎒", "Can"], ["", "☂️", "Deniz"], ["", "⚽", "Lale"]], "a bag with Can's tag, an umbrella with Deniz's tag, a ball with Lale's tag"),
        kural: "Whose? → isim + 's (Deniz's, Can's).", dogruNeden: "Şemsiyenin üzerindeki etikette Deniz yazar; sahiplik “Deniz's” ile gösterilir." }),
  );
  SORU_EKLE("enapp.clothes",
    Q("enapp.clothes", "transfer", 2, "Look at the weather card for tomorrow. <b>What should Ali wear?</b>", "a coat, a scarf and gloves",
      [["shorts, a T-shirt and sandals", "kavrama", "Bunlar sıcak ve güneşli hava giysileri; kartta −3 °C ve kar var."],
       ["a swimsuit and sunglasses", "kavrama", "Bunlar yaz ve deniz giysileri; karlı havada giyilmez."],
       ["a T-shirt and a cap", "kavrama", "Tişört ve kep −3 °C'de insanı soğuktan korumaz."]],
      "Karttaki sıcaklık ve hava simgesine bak: sıcak mı, soğuk mu?",
      C("Hava durumu kartına uygun giysileri seçeceğiz.", "Soğuk ve karlı havada: coat (mont), scarf (atkı), gloves (eldiven), boots (bot) giyilir.",
        ["Kartta ❄️ (snowy) ve −3 °C yazıyor: çok soğuk.", "Soğuğa uygun seçenek: a coat, a scarf and gloves."],
        "Cevap: <b>a coat, a scarf and gloves</b>.", "Kartta ☀️ ve 30 °C olsaydı “shorts, a T-shirt and sandals” uygun olurdu."),
      { gorsel: G.svg(420, 160, `<rect class="g-yumusak g-cizgi" x="10" y="10" width="400" height="140" rx="14" stroke-width="2"/>` + G.yazi(210, 38, "Tomorrow – Kars", { b: 1 }) + ikon(130, 118, "❄️", 60) +
        `<text class="g-yazi" style="font-size:44px" font-weight="700" x="290" y="112" text-anchor="middle">−3 °C</text>`, "weather card: snowy, minus three degrees"),
        kural: "cold/snowy → coat, scarf, gloves, boots; hot/sunny → T-shirt, shorts, sandals.", dogruNeden: "Kartta karlı ve −3 °C bir hava var; mont, atkı ve eldiven bu havaya uygundur." }),
  );

  /* ======================= Learning Activities ======================= */
  SORU_EKLE("enlrn.activities",
    Q("enlrn.activities", "uygulama", 1, "Look at picture K. <b>What is the student doing?</b>", "She is keeping a diary.",
      [["She is role-playing.", "dikkat", "Rol yapma (role-play) L resmindeki tiyatro maskeleriyle gösteriliyor."],
       ["She is sorting cards.", "dikkat", "Kartları gruplama (sorting) M resmindeki kart kutusuyla gösteriliyor."],
       ["She is painting a picture.", "dikkat", "Resim yapma N resminde; K resminde bir defter (diary) var."]],
      "K resmindeki nesne ne? Her gün yaşadıklarımızı nereye yazarız?",
      C("K resmindeki sınıf etkinliğini bulacağız.", "Sınıf etkinlikleri: keep a diary (günlük tutmak), role-play (rol yapmak), sort (gruplamak), paint (resim yapmak).",
        ["K: 📔 bir günlük defteri. L: 🎭 maskeler. M: 🗂️ kart kutusu. N: 🎨 boya paleti.", "Günlük defteri → keep a diary → şimdiki zamanda: She is keeping a diary."],
        "Cevap: <b>She is keeping a diary.</b>", "Diğer resimleri de söyle: L role-playing, M sorting cards, N painting."),
      { gorsel: resimler([["K", "📔"], ["L", "🎭"], ["M", "🗂️"], ["N", "🎨"]], "four pictures: diary, masks, card box, palette"),
        kural: "keep a diary = günlük tutmak.", dogruNeden: "K resminde günlük defteri vardır; bu etkinlik “keeping a diary”dir." }),
  );

  /* ======================= Personality — comparatives & superlatives ======================= */
  SORU_EKLE("enper.compare",
    Q("enper.compare", "uygulama", 2, "Look at the chart. <b>Which sentence is true?</b>", "Can is taller than Ali.",
      [["Ece is taller than Ali.", "islem", "Ece 142 cm, Ali 150 cm; Ece daha kısadır."],
       ["Can is shorter than Ece.", "islem", "Can 158 cm ile en uzun olandır; Ece'den kısa değildir."],
       ["Ali is more tall than Can.", "kavrama", "Kısa sıfatlar -er alır (taller); ayrıca Ali, Can'den kısadır."]],
      "Sütunların boylarını karşılaştır; “taller than” ile “shorter than”ın anlamına dikkat et.",
      C("Grafikteki boylara göre doğru karşılaştırma cümlesini seçeceğiz.", "Kısa sıfatlarda karşılaştırma: sıfat + -er + than (taller than, shorter than).",
        ["Grafikten: Ali 150 cm, Ece 142 cm, Can 158 cm.", "158 > 150 → Can, Ali'den uzundur: Can is taller than Ali."],
        "Doğru cümle: <b>Can is taller than Ali.</b>", "Ters yönden kur: Ali is shorter than Can. Bu da doğru; demek ki karşılaştırma tutarlı."),
      { gorsel: G.sutun([["Ali", 150], ["Ece", 142], ["Can", 158]], { baslik: "Our heights", birim: "cm" }),
        kural: "tall → taller than; short → shorter than.", dogruNeden: "Grafikte Can 158 cm, Ali 150 cm'dir; Can daha uzundur." }),
  );
  SORU_EKLE("enper.super",
    Q("enper.super", "uygulama", 2, "Look at the race results (100 metres). <b>Who is the fastest?</b>", "Lale is the fastest.",
      [["Kaan is the fastest.", "kavrama", "Kaan yarışı en uzun sürede (14 saniye) bitirmiş; o en yavaş olandır."],
       ["Mert is the fastest.", "islem", "Mert 12 saniyede bitirmiş; Lale ondan daha kısa sürede koşmuş."],
       ["Lale is the faster.", "kavrama", "En üstünlükte “the + sıfat-est” kullanılır: the fastest."]],
      "Yarışta en hızlı olan, en kısa sürede bitirendir.",
      C("Tablodan en hızlı koşucuyu bulup doğru cümleyi seçeceğiz.", "Üç ya da daha fazla kişi karşılaştırılırken en üstünlük: the + sıfat-est (the fastest).",
        ["Süreler: Mert 12 s, Lale 10 s, Kaan 14 s.", "En kısa süre 10 saniye → Lale en hızlıdır."],
        "Cevap: <b>Lale is the fastest.</b>", "En yavaşı da bul: Kaan is the slowest (14 s). İkisi birbirinin tersi."),
      { gorsel: G.tablo(["Runner", "Time"], [["🏃 Mert", "12 seconds"], ["🏃 Lale", "10 seconds"], ["🏃 Kaan", "14 seconds"]]),
        kural: "fast → faster → the fastest.", dogruNeden: "Lale 100 metreyi en kısa sürede (10 saniye) koşmuştur; en hızlı odur." }),
  );

  /* ======================= Jobs and Homes ======================= */
  SORU_EKLE("enjob.jobs",
    Q("enjob.jobs", "uygulama", 1, "<i>“My mum is a nurse. She looks after sick people.”</i><br>Look at the pictures. <b>Where does she work?</b>", "K – at a hospital",
      [["L – at an airport", "bilgi", "Havalimanında pilotlar ve kabin görevlileri çalışır; hemşire hastanede çalışır."],
       ["M – at a school", "bilgi", "Okulda öğretmenler çalışır."],
       ["K – at a fire station", "dikkat", "Harf doğru ama K resmindeki yer itfaiye değil, hastane."]],
      "Hemşire (nurse) hasta insanlara nerede bakar?",
      C("Hemşirenin çalıştığı yeri resimlerden bulacağız.", "Meslek – iş yeri: nurse/doctor → hospital, pilot → airport, teacher → school, firefighter → fire station.",
        ["Resimler: K 🏥 hastane, L ✈️ havalimanı, M 🏫 okul, N 🚒 itfaiye.", "Nurse → hospital → K."],
        "Cevap: <b>K – at a hospital</b>.", "Cümleyi kur: She works at a hospital. She looks after sick people. Anlam bütünlüğü var."),
      { gorsel: resimler([["K", "🏥"], ["L", "✈️"], ["M", "🏫"], ["N", "🚒"]], "four workplaces: hospital, airport, school, fire station"),
        kural: "nurse → hospital; pilot → airport; teacher → school; firefighter → fire station.", dogruNeden: "Hemşireler hastanede çalışır; hastane K resmindedir." }),
  );
  SORU_EKLE("enhom.types",
    Q("enhom.types", "uygulama", 1, "Look at the plan of the flat. <i>“Mum is cooking dinner.”</i> <b>Which room is she in?</b>", "C – the kitchen",
      [["A – the bedroom", "dikkat", "A odasında yatak var; yatak odasında yemek pişirilmez."],
       ["D – the living room", "dikkat", "D odasında kanepe var; orası oturma odasıdır."],
       ["C – the bathroom", "bilgi", "Harf doğru ama C odası mutfaktır; banyo (bathroom) B odasıdır."]],
      "Yemek pişirilen odadaki eşyayı bul (🍳).",
      C("Planda yemek pişirilen odayı bulacağız.", "Evin bölümleri: bedroom (🛏️), bathroom (🛁), kitchen (🍳), living room (🛋️).",
        ["A 🛏️ bedroom, B 🛁 bathroom, C 🍳 kitchen, D 🛋️ living room.", "Cooking → kitchen → C."],
        "Cevap: <b>C – the kitchen</b>.", "Öteki odalarla cümle kur: Dad is sleeping in the bedroom (A). Ali is watching TV in the living room (D)."),
      { gorsel: G.svg(420, 280, `<rect class="g-bos g-cizgi" x="10" y="10" width="400" height="260" stroke-width="4"/><line class="g-cizgi" x1="210" y1="10" x2="210" y2="270" stroke-width="3"/><line class="g-cizgi" x1="10" y1="140" x2="410" y2="140" stroke-width="3"/>` +
        [["A", "🛏️", 110, 75], ["B", "🛁", 310, 75], ["C", "🍳", 110, 205], ["D", "🛋️", 310, 205]].map(([h, e, x, y]) => harfRozet(x - 75, y - 45, h) + ikon(x, y + 18, e, 52)).join(""), "flat plan with four rooms"),
        kural: "kitchen: cook; bedroom: sleep; bathroom: have a shower; living room: watch TV.", dogruNeden: "Yemek mutfakta pişirilir; planda mutfak (🍳) C odasıdır." }),
  );

  /* ======================= Places and Directions in the City ======================= */
  const SOKAK = G.svg(600, 250,
    `<rect class="g-c" fill-opacity="0.18" x="0" y="0" width="600" height="250"/><rect class="g-bos g-cizgi" x="0" y="105" width="600" height="44" stroke-width="1.5"/>` + G.yazi(300, 132, "Green Street", { k: 1 }) +
    [["Bakery", "🥖", 20], ["Bank", "🏦", 165], ["Café", "☕", 310], ["Library", "📚", 455]].map(([a, e, x]) => `<rect class="g-b g-cizgi" fill-opacity="0.5" x="${x}" y="15" width="125" height="80" rx="6" stroke-width="2"/>` + ikon(x + 62, 55, e, 30) + t13(x + 62, 84, a, { b: 1, f: 14 })).join("") +
    [["School", "🏫", 20], ["Park", "🌳", 165], ["Museum", "🏛️", 455]].map(([a, e, x]) => `<rect class="g-yumusak g-cizgi" x="${x}" y="160" width="125" height="80" rx="6" stroke-width="2"/>` + ikon(x + 62, 200, e, 30) + t13(x + 62, 229, a, { b: 1, f: 14 })).join(""), "street map");
  SORU_EKLE("encty.prep",
    Q("encty.prep", "uygulama", 2, "Look at the map. <b>Where is the bank?</b>", "It's between the bakery and the café.",
      [["It's next to the library.", "dikkat", "Kütüphanenin yanında kafe var; banka kütüphanenin yanında değil."],
       ["It's opposite the museum.", "dikkat", "Bankanın karşısında müze değil, park var."],
       ["It's between the school and the park.", "dikkat", "Okul ve park caddenin öbür tarafında; banka onların arasında değil."]],
      "Bankanın sağında ve solunda ne var?",
      C("Haritada bankanın yerini doğru anlatan cümleyi bulacağız.", "between A and B = A ile B'nin arasında; next to = yanında; opposite = karşısında.",
        ["Üst sırada soldan sağa: Bakery, Bank, Café, Library.", "Bankanın solunda fırın (bakery), sağında kafe (café) var → between the bakery and the café."],
        "Cevap: <b>It's between the bakery and the café.</b>", "Bir doğru cümle daha kur: The bank is opposite the park. Bu da haritayla uyumlu."),
      { gorsel: SOKAK, kural: "between … and … iki yerin arasını anlatır.", dogruNeden: "Haritada banka, fırın ile kafenin tam arasındadır." }),
  );
  SORU_EKLE("encty.dir",
    Q("encty.dir", "transfer", 3, "You are at the star (★). Follow the directions:<br><b>“Go straight on. Take the second turning on the right. It's on your left.”</b><br>Which building is it?", "A",
      [["B", "kavrama", "Sağa döndükten sonra B binası sağ tarafta kalır; tarif “on your left” diyor."],
       ["C", "kavrama", "C ikinci sokağın solunda; tarif sağa dönmeni istiyor."],
       ["D", "dikkat", "D birinci sağ sokakta; tarif ikinci sokağı (second turning) söylüyor."]],
      "Kendini haritada yürüyormuş gibi düşün: Sağa döndüğünde yüzün hangi yöne bakar?",
      C("Yol tarifini haritada adım adım izleyeceğiz.", "take the second turning = ikinci sokağa sap; on your left = solunda; on your right = sağında.",
        ["Yıldızdan yukarı doğru yürü; birinci sokağı geç, ikinci sokakta sağa dön.", "Sağa dönünce yüzün haritanın sağına (doğuya) bakar; sol tarafın yukarısı olur. Sol taraftaki bina A'dır."],
        "Gidilen bina <b>A</b>'dır.", "B aynı sokakta ama sağ tarafta kalıyor; “on your left” ile A ayrılıyor."),
      { gorsel: G.svg(600, 370,
        `<rect class="g-c" fill-opacity="0.18" x="0" y="0" width="600" height="370"/>` +
        `<rect class="g-bos" x="275" y="5" width="50" height="360"/><rect class="g-bos" x="15" y="80" width="570" height="40"/><rect class="g-bos" x="15" y="215" width="570" height="40"/>` +
        [["A", 420, 18], ["B", 420, 132], ["C", 90, 18], ["D", 420, 267]].map(([h, x, y]) => `<rect class="g-b g-cizgi" fill-opacity="0.5" x="${x}" y="${y}" width="100" height="50" rx="6" stroke-width="2"/>` + G.yazi(x + 50, y + 32, h, { b: 1 })).join("") +
        `<text x="300" y="350" font-size="30" text-anchor="middle" fill="#d64545">★</text>` + t13(380, 345, "You are here", { b: 1 }) +
        G.ok(560, 360, 560, 315) + t13(560, 305, "N", { b: 1 }), "map with buildings A, B, C, D"),
        kural: "Sağa ya da sola döndükten sonra “on your left / right” yeni yönüne göre söylenir.", dogruNeden: "İkinci sağ sokağa sapınca A binası yolcunun sol tarafında kalır." }),
  );

  /* ======================= Transportation ======================= */
  SORU_EKLE("entrn.rules",
    Q("entrn.rules", "aciklama", 2, "Look at sign A. <b>What does it mean?</b>", "No entry. You mustn't go this way.",
      [["Stop and wait.", "dikkat", "“Dur” anlamı B levhasındadır (STOP)."],
       ["Walk across the road here.", "dikkat", "Yaya geçidi C levhasıdır."],
       ["Turn left at the corner.", "kavrama", "A levhasında ok yok; kırmızı daire içindeki beyaz çizgi “girilmez” demektir."]],
      "Kırmızı daire ve ortasında beyaz yatay çizgi: Bu levha yasak mı bildiriyor, izin mi?",
      C("A levhasının anlamını bulacağız.", "Trafik levhaları: No entry (girilmez), STOP (dur), pedestrian crossing (yaya geçidi).",
        ["A: kırmızı daire + beyaz yatay çizgi → No entry.", "Emir cümlesiyle: Don't go this way. / You mustn't go this way."],
        "Cevap: <b>No entry. You mustn't go this way.</b>", "Öteki levhaları da söyle: B “Stop!”, C “Cross the road here.”"),
      { gorsel: G.svg(480, 145,
        `<circle cx="80" cy="75" r="55" fill="#d64545"/><rect x="40" y="64" width="80" height="22" rx="3" fill="#fff"/>` + harfRozet(25, 20, "A") +
        `<path d="M218 22 L262 22 L293 53 L293 97 L262 128 L218 128 L187 97 L187 53 Z" fill="#d64545"/><text x="240" y="83" font-size="24" font-weight="700" fill="#fff" text-anchor="middle">STOP</text>` + harfRozet(180, 20, "B") +
        `<rect x="345" y="20" width="110" height="110" rx="10" fill="#2f6fdb"/><path d="M400 32 L445 118 L355 118 Z" fill="#fff"/>` + ikon(400, 110, "🚶", 40) + harfRozet(340, 20, "C") , "three traffic signs A, B, C"),
        kural: "Kırmızı daire genellikle yasak bildirir: No entry = girilmez.", dogruNeden: "A levhası “girilmez” (No entry) levhasıdır; bu yöne gidilmemelidir." }),
  );
  SORU_EKLE("entrn.by",
    Q("entrn.by", "uygulama", 2, "Look at the table. <b>— How does Emre go to school and how long does it take?</b>", "He goes on foot. It takes ten minutes.",
      [["He goes by foot. It takes ten minutes.", "kavrama", "Yürüyerek gitmek “on foot” ile söylenir; “by foot” kullanılmaz."],
       ["He goes by bus. It takes twenty minutes.", "dikkat", "Bu bilgi Ayşe'ye ait; tablo satırlarını karıştırma."],
       ["He goes on foot. It takes fifteen minutes.", "dikkat", "On beş dakika Deniz'in süresidir; Emre'nin süresi 10 dakika."]],
      "Tabloda Emre'nin satırını bul; ulaşım şeklini ve süresini oku.",
      C("Tablodan Emre'nin ulaşım şeklini ve süresini bulacağız.", "Ulaşım: by bus, by car, by train ama yürüyerek → on foot. Süre: It takes … minutes.",
        ["Emre satırı: 🚶 walk, 10 minutes.", "Yürümek → on foot; 10 → ten: He goes on foot. It takes ten minutes."],
        "Cevap: <b>He goes on foot. It takes ten minutes.</b>", "Ayşe için de kur: She goes by bus. It takes twenty minutes."),
      { gorsel: G.tablo(["Name", "Transport", "Time"], [["Ayşe", "🚌 bus", "20 minutes"], ["Emre", "🚶 walk", "10 minutes"], ["Deniz", "🚗 car", "15 minutes"]]),
        kural: "by bus / by car / by train ama on foot.", dogruNeden: "Tabloya göre Emre yürüyerek (on foot) gidiyor ve yolu 10 dakika sürüyor." }),
  );

  /* ======================= Countries and Nationalities ======================= */
  SORU_EKLE("encou.nat",
    Q("encou.nat", "uygulama", 2, "Look at the flags. <i>“Yuki is from the country with flag B.”</i> <b>Which language does she speak?</b>", "Japanese",
      [["Japan", "kavrama", "Japan ülkenin adıdır; dil sorulduğu için “Japanese” demeliyiz."],
       ["Italian", "dikkat", "İtalyanca A bayrağının (İtalya) ülkesinde konuşulur."],
       ["German", "dikkat", "Almanca C bayrağının (Almanya) ülkesinde konuşulur."]],
      "B bayrağı: beyaz zemin üzerinde kırmızı bir daire. Hangi ülke?",
      C("B bayrağının ülkesini bulup o ülkenin dilini söyleyeceğiz.", "Ülke – milliyet/dil: Japan – Japanese, Italy – Italian, Germany – German, France – French.",
        ["A: yeşil-beyaz-kırmızı dikey → Italy. B: beyaz zemin, kırmızı daire → Japan.", "C: siyah-kırmızı-sarı yatay → Germany. D: mavi-beyaz-kırmızı dikey → France. Japan'ın dili Japanese."],
        "Cevap: <b>Japanese</b>.", "Tam cümle: Yuki is from Japan. She is Japanese. She speaks Japanese."),
      { gorsel: G.svg(560, 140,
        `<rect x="12" y="20" width="40" height="80" fill="#2e9b57"/><rect x="52" y="20" width="40" height="80" fill="#fff"/><rect x="92" y="20" width="40" height="80" fill="#d64545"/><rect class="g-cizgi" fill="none" x="12" y="20" width="120" height="80"/>` +
        `<rect x="152" y="20" width="120" height="80" fill="#fff"/><circle cx="212" cy="60" r="24" fill="#d0021b"/><rect class="g-cizgi" fill="none" x="152" y="20" width="120" height="80"/>` +
        `<rect x="292" y="20" width="120" height="27" fill="#222"/><rect x="292" y="47" width="120" height="26" fill="#dd0000"/><rect x="292" y="73" width="120" height="27" fill="#ffce00"/><rect class="g-cizgi" fill="none" x="292" y="20" width="120" height="80"/>` +
        `<rect x="432" y="20" width="40" height="80" fill="#0055a4"/><rect x="472" y="20" width="40" height="80" fill="#fff"/><rect x="512" y="20" width="40" height="80" fill="#ef4135"/><rect class="g-cizgi" fill="none" x="432" y="20" width="120" height="80"/>` +
        ["A", "B", "C", "D"].map((h, i) => t13(72 + i * 140, 128, h, { b: 1, f: 16 })).join(""), "four flags: A Italy, B Japan, C Germany, D France"),
        kural: "Ülke adı ile dil/milliyet farklıdır: Japan → Japanese.", dogruNeden: "B bayrağı Japonya'nındır; Japonyada konuşulan dil Japanese'dir." }),
  );

  /* ======================= Food — offering and asking ======================= */
  SORU_EKLE("enfod.offer",
    Q("enfod.offer", "transfer", 3, "Look at the menu. Ali has got <b>£4</b>. He wants a cheese sandwich and a drink. <b>What can he say?</b>", "Can I have a cheese sandwich and a cup of tea, please?",
      [["Can I have a cheese sandwich and an orange juice, please?", "islem", "£3 + £2 = £5 eder; Ali'nin 4 sterlini yetmez."],
       ["Would you like a cheese sandwich?", "kavrama", "“Would you like…?” birine bir şey ikram ederken kullanılır; Ali istekte bulunuyor."],
       ["Can I have eggs and a glass of milk, please?", "dikkat", "Ali peynirli sandviç istiyor; ayrıca bu sipariş de istenen yiyecek değil."]],
      "Menüden fiyatları topla; toplam £4'ü geçmemeli.",
      C("Ali'nin parasıyla alabileceği sandviç ve içeceği seçip doğru istek cümlesini bulacağız.", "Bir şey isterken: Can I have …, please? İkram ederken: Would you like …?",
        ["Menüde cheese sandwich £3. Ali'nin geriye 4 − 3 = £1'i kalır.", "£1'lik içecekler: tea ya da milk. Orange juice £2 olduğu için yetmez."],
        "Cevap: <b>Can I have a cheese sandwich and a cup of tea, please?</b>", "Toplamı kontrol et: £3 + £1 = £4. Tam Ali'nin parası kadar."),
      { gorsel: pano("🍽️ BREAKFAST MENU", "DRINKS: ☕ tea £1 · 🥛 milk £1 · 🍊 orange juice £2| |FOOD: 🍞 toast £2 · 🍳 eggs £3 · 🥪 cheese sandwich £3", { W: 560, etiket: "breakfast menu with prices" }),
        kural: "Can I have …, please? = istek; Would you like …? = ikram.", dogruNeden: "Peynirli sandviç (£3) ve çay (£1) toplam £4 eder ve istek “Can I have …, please?” ile yapılır." }),
  );

  /* ======================= Activities in Nature — simple past ======================= */
  SORU_EKLE("ennat2.past",
    Q("ennat2.past", "uygulama", 2, "Look at Ece's weekend diary. <b>What did Ece do on Sunday?</b>", "She went fishing.",
      [["She goes fishing.", "kavrama", "Soru “did” ile geçmişi soruyor; cevap da geçmiş zamanda olmalı: went."],
       ["She went camping.", "dikkat", "Kamp cumartesi günü yapılmış; pazar günü balık tutulmuş."],
       ["She go fishing.", "kavrama", "Geçmiş zaman için “go” fiilinin düzensiz hâli “went” kullanılır."]],
      "Günlükte Sunday satırını bul; fiili geçmiş zamana çevir.",
      C("Ece'nin pazar günü yaptığını geçmiş zamanla anlatacağız.", "Simple past: go → went (düzensiz). What did you do? → I went …",
        ["Günlük: Saturday ⛺ camping, Sunday 🎣 fishing.", "Pazar → fishing → go fishing → geçmişte: went fishing."],
        "Cevap: <b>She went fishing.</b>", "Cumartesi için kur: On Saturday, she went camping."),
      { gorsel: G.tablo(["Day", "Activity"], [["Saturday", "⛺ camping"], ["Sunday", "🎣 fishing"]]),
        kural: "go → went; What did …? sorusuna geçmiş zamanla cevap verilir.", dogruNeden: "Günlükte pazar günü balık tutma (fishing) var; geçmiş zamanla “She went fishing.” olur." }),
  );

  /* ======================= Festivals ======================= */
  SORU_EKLE("enfes.adj",
    Q("enfes.adj", "uygulama", 2, "Look at the picture. Complete the sentences: <b>The film was ___. Ali was ___.</b>", "boring / bored",
      [["bored / boring", "kavrama", "-ing sıfatı şeyi (film), -ed sıfatı kişinin duygusunu anlatır; yerleri ters olmuş."],
       ["exciting / excited", "dikkat", "Resimde Ali esniyor ve uyukluyor; heyecanlı değil."],
       ["boring / boring", "kavrama", "Ali'nin duygusu için -ed sıfatı gerekir: bored."]],
      "Resimdeki yüz ifadesine bak. Duyguyu yaşayan kişi -ed, duyguya sebep olan şey -ing alır.",
      C("Resme uygun -ing / -ed sıfatlarını seçeceğiz.", "-ing: duyguya sebep olan şey (a boring film). -ed: duyguyu yaşayan kişi (Ali was bored).",
        ["Resimde Ali film izlerken uyukluyor (😴). Demek ki film sıkıcı, Ali sıkılmış.", "Film → boring; Ali → bored."],
        "Cevap: <b>boring / bored</b>.", "Tersi için: The concert was exciting. Ali was excited."),
      { gorsel: G.svg(420, 170, `<rect class="g-yumusak g-cizgi" x="20" y="20" width="200" height="120" rx="8" stroke-width="3"/>` + t13(120, 88, "FILM", { b: 1, f: 22 }) + `<rect class="g-cizgi g-bos" x="100" y="140" width="40" height="15"/>` +
        ikon(320, 110, "😴", 70) + t13(320, 155, "Ali", { b: 1, f: 15 }) + t13(370, 50, "z z z", { f: 16 }), "Ali is sleepy in front of a film"),
        kural: "-ing → şey (boring film); -ed → kişi (bored Ali).", dogruNeden: "Film sıkıcıdır (boring) ve Ali sıkılmıştır (bored)." }),
  );
  SORU_EKLE("enfes.like",
    Q("enfes.like", "uygulama", 2, "Look at the class survey. <b>Which sentence is true?</b>", "Most students love watching parades.",
      [["Most students love dancing.", "islem", "Dans eden 12 öğrenci var; geçit törenini izlemeyi seven 15 öğrenci daha fazla."],
       ["Most students love sing.", "kavrama", "love fiilinden sonra -ing gelir: love singing. Ayrıca şarkıyı en az kişi (8) seçmiş."],
       ["Nobody loves singing.", "dikkat", "Grafikte şarkı söylemeyi seven 8 öğrenci var."]],
      "En uzun sütun hangi etkinliğe ait?",
      C("Anket grafiğine göre doğru cümleyi seçeceğiz.", "like / love / hate + fiil-ing: I love dancing.",
        ["Grafik: dancing 12, singing 8, watching parades 15.", "En büyük sayı 15 → watching parades."],
        "Cevap: <b>Most students love watching parades.</b>", "En az seçileni de söyle: Only eight students love singing."),
      { gorsel: G.sutun([["dancing", 12], ["singing", 8], ["watching parades", 15]], { baslik: "What do you love doing at festivals?", birim: "students" }),
        kural: "love / like / hate + -ing.", dogruNeden: "Grafikte en çok öğrenci (15) geçit törenini izlemeyi seçmiştir." }),
  );

  /* ======================= Environment ======================= */
  SORU_EKLE("enenv.must",
    Q("enenv.must", "aciklama", 2, "Look at the park signs. <b>What does sign 1 mean?</b>", "You mustn't drop litter.",
      [["You must drop litter.", "kavrama", "Üstü çizili işaret yasak bildirir; “must” zorunluluk demektir, anlam ters olmuş."],
       ["You mustn't ride a bike.", "dikkat", "Bisiklet yasağı 2 numaralı levhadır."],
       ["You have to drink this water.", "dikkat", "3 numaralı levha suyun içilmeyeceğini gösterir; ayrıca soru 1. levhayı soruyor."]],
      "1. levhada ne var ve üstü çizili mi?",
      C("1 numaralı levhanın anlamını must / mustn't ile söyleyeceğiz.", "must = zorunlu; mustn't = yasak. Üstü çizili işaretler yasak bildirir.",
        ["Levha 1: 🚯 çöp atan biri ve üstü çizili → çöp atmak yasak.", "Yasak → mustn't: You mustn't drop litter."],
        "Cevap: <b>You mustn't drop litter.</b>", "Öteki levhalar: 2 → You mustn't ride a bike. 3 → You mustn't drink this water."),
      { gorsel: resimler([["1", "🚯"], ["2", "🚳"], ["3", "🚱"]], "three park signs: no litter, no bicycles, non-potable water"),
        kural: "mustn't = yasak; must / have to = zorunluluk.", dogruNeden: "1 numaralı levha çöp atmanın yasak olduğunu gösterir." }),
  );

  /* ======================= Planets ======================= */
  SORU_EKLE("enpla.order",
    Q("enpla.order", "uygulama", 2, "Look at the picture of the Solar System. Planet C is the Earth. <b>What is planet D?</b>", "Mars",
      [["Venus", "bilgi", "Venus Güneş'e ikinci sıradadır (B); Dünya'dan önce gelir."],
       ["Jupiter", "bilgi", "Jupiter beşinci gezegendir (E); D'den sonra gelir."],
       ["Mercury", "bilgi", "Mercury Güneş'e en yakın gezegendir (A)."]],
      "Dünya üçüncü gezegen. Dördüncü hangisi?",
      C("Güneş'ten başlayarak sıralamayı sayıp D gezegenini bulacağız.", "Order: Mercury (1st), Venus (2nd), Earth (3rd), Mars (4th), Jupiter (5th), Saturn (6th), Uranus (7th), Neptune (8th).",
        ["Resimde A, B, C, D… Güneş'ten uzaklaşıyor. C = Earth = the third planet.", "D bir sonraki, yani the fourth planet → Mars."],
        "Cevap: <b>Mars</b>.", "Cümle kur: Mars is the fourth planet from the Sun. It is red."),
      { gorsel: G.svg(620, 150, `<circle cx="-10" cy="75" r="60" fill="#f2b632"/>` +
        [["A", 75, 6], ["B", 130, 10], ["C", 190, 11], ["D", 245, 8], ["E", 330, 30], ["F", 430, 25], ["G", 520, 17], ["H", 590, 16]].map(([h, x, r], i) =>
          `<circle cx="${x}" cy="75" r="${r}" fill="${["#9b9b9b", "#e3b56b", "#2f6fdb", "#d6573a", "#d9a066", "#e8c97a", "#7fd3e0", "#3b5bdb"][i]}"/>` + t13(x, 135, h, { b: 1, f: 15 })).join("") +
        `<ellipse cx="430" cy="75" rx="40" ry="8" fill="none" stroke="#b08d3c" stroke-width="3"/>`, "the Sun and eight planets A to H"),
        kural: "Earth is the third planet; Mars is the fourth.", dogruNeden: "Güneş'ten itibaren dördüncü gezegen Mars'tır; C Dünya ise D Mars'tır." }),
  );

  /* ======================= Weather ======================= */
  SORU_EKLE("enfut.weather",
    Q("enfut.weather", "uygulama", 1, "Look at the weather map. <b>What's the weather like in Trabzon?</b>", "It's cloudy.",
      [["It's snowy.", "dikkat", "Kar simgesi Ankara'nın yanında."],
       ["It's rainy.", "dikkat", "Yağmur simgesi İstanbul'un yanında."],
       ["It's sunny.", "dikkat", "Güneş simgesi İzmir ve Antalya'nın yanında."]],
      "Haritada Trabzon'u bul ve yanındaki simgeye bak.",
      C("Hava durumu haritasında Trabzon'un simgesini okuyacağız.", "☀️ sunny, ☁️ cloudy, 🌧️ rainy, ❄️ snowy, 💨 windy.",
        ["Trabzon, haritanın kuzeydoğusunda; yanındaki simge ☁️.", "☁️ = cloudy → It's cloudy."],
        "Cevap: <b>It's cloudy.</b>", "Başka bir şehir için kur: It's snowy in Ankara. It's rainy in İstanbul."),
      { gorsel: G.svg(600, 240, `<path class="g-yumusak g-cizgi" d="M40 90 Q120 50 230 70 Q380 40 560 70 L570 150 Q520 200 420 190 Q300 230 200 215 Q100 220 50 170 Z" stroke-width="2"/>` +
        [["İstanbul", "🌧️", 110, 85], ["Ankara", "❄️", 250, 130], ["İzmir", "☀️", 80, 160], ["Antalya", "☀️", 220, 205], ["Trabzon", "☁️", 470, 90]].map(([a, e, x, y]) =>
          `<circle class="g-d" cx="${x}" cy="${y}" r="5"/>` + t13(x, y - 10, a, { b: 1 }) + ikon(x + 36, y + 14, e, 28)).join(""), "weather map of Türkiye"),
        kural: "cloud → cloudy, rain → rainy, snow → snowy, sun → sunny.", dogruNeden: "Haritada Trabzon'un yanında bulut simgesi (☁️) vardır: It's cloudy." }),
  );
})();
