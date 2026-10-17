/* İlkokul 3. sınıf İngilizce (A1, British English) — 10 ünite.
 * Greeting · My Family · People I Love · Feelings · Toys and Games · My House · In My City ·
 * Transportation · Weather · Nature. Her konunun sozluk alanı [["word", "Türkçe"], …] biçimindedir
 * ve “English Games” kelime kartlarında kullanılır.
 */
(function () {
  "use strict";
  const { R, sec, karistir, S, G } = OGR;

  /* ------------------------------ Yardımcılar ------------------------------ */
  const kac = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const emo = (x, y, e, b = 56) => `<text x="${x}" y="${y}" font-size="${b}" text-anchor="middle" dominant-baseline="central">${e}</text>`;
  const ISIM_K = ["Elif", "Zeynep", "Ece", "Defne", "Ayşe", "Emma", "Lucy"];
  const ISIM_E = ["Ali", "Can", "Mert", "Emre", "Kerem", "Tom", "Jack"];

  /* Tek resim kartı */
  function kart(e, alt) {
    return G.svg(180, alt ? 172 : 150, `<rect class="g-yumusak g-cizgi" x="10" y="10" width="160" height="130" rx="18" stroke-width="2"/>` + emo(90, 76, e, 72) + (alt ? G.yazi(90, 164, kac(alt), { b: 1 }) : ""), "resim kartı");
  }
  /* Yan yana resim kartları: [[emoji, etiket], …] */
  function kartlar(liste) {
    const W = liste.length * 130 + 20;
    const ic = liste.map(([e, a], i) => { const x = 10 + i * 130; return `<rect class="g-yumusak g-cizgi" x="${x}" y="10" width="120" height="110" rx="14" stroke-width="2"/>` + emo(x + 60, 66, e, 56) + (a ? G.yazi(x + 60, 146, kac(a), { b: 1 }) : ""); }).join("");
    return G.svg(W, 160, ic, "resim kartları");
  }
  /* Konuşma balonları: [[emoji, metin], …] — sırayla solda ve sağda */
  function balon(satirlar) {
    const W = 600, H = satirlar.length * 84 + 14;
    const ic = satirlar.map(([e, t], i) => {
      const y = 12 + i * 84, sol = i % 2 === 0, w = Math.min(440, 40 + String(t).length * 10);
      const bx = sol ? 82 : W - 82 - w;
      return emo(sol ? 42 : W - 42, y + 36, e, 46) + `<rect class="g-bos g-cizgi" x="${bx}" y="${y + 8}" width="${w}" height="56" rx="20" stroke-width="2"/>` + G.yazi(bx + w / 2, y + 42, kac(t), { b: 1 });
    }).join("");
    return G.svg(W, H, ic, "konuşma balonları");
  }
  /* Nesne sayma görseli (5'li sıralar) */
  function sayGorsel(e, n) {
    const sut = 5, sat = Math.ceil(n / sut); let ic = `<rect class="g-yumusak g-cizgi" x="6" y="6" width="${sut * 54 + 16}" height="${sat * 54 + 16}" rx="14"/>`;
    for (let i = 0; i < n; i++) ic += emo(41 + (i % sut) * 54, 41 + Math.floor(i / sut) * 54, e, 40);
    return G.svg(sut * 54 + 28, sat * 54 + 28, ic, n + " nesne");
  }

  /* Çözüm adımları: [anla, hatırla, …uygula, kontrol] → 🔎 💡 ✏️ … ✅ 🔁 */
  function adimlar(a, dogru, neden) {
    const out = ["🔎 Soruyu anlayalım: " + a[0], "💡 Hatırlayalım: " + a[1]];
    a.slice(2, -1).forEach(t => out.push("✏️ " + t));
    out.push("✅ Sonuç: Doğru cevap “" + dogru + "”. " + neden);
    out.push("🔁 Kontrol edelim: " + a[a.length - 1]);
    return out;
  }
  /* Havuz sorusu */
  function P(kaz, duzey, zorluk, soru, dogru, yanlis, ipucu, a, ekler) {
    const e = ekler || {};
    return () => S({ kaz, duzey, zorluk, soru, dogru, yanlis, ipucu, gorsel: e.gorsel || null, kural: e.kural, dogruNeden: e.neden, cozum: adimlar(a, dogru, e.neden) });
  }
  const HT = ["bilgi", "dikkat", "kavrama"];
  /* Resimli kelime / kalıp üreteci. liste: [{e, en, tr, haric?}] */
  function E(kaz, liste, o) {
    const kalip = o.kalip || (d => d.en);
    return () => {
      const d = sec(liste), y = karistir(liste.filter(x => x !== d && !(d.haric || []).includes(x.en))).slice(0, 3);
      const neden = `${d.tr} İngilizcede “${d.en}” olarak söylenir.`;
      return S({
        kaz, duzey: o.duzey || "hatirlama", zorluk: o.zorluk || 1,
        soru: typeof o.soru === "function" ? o.soru(d) : o.soru, gorsel: o.gorsel ? o.gorsel(d) : kart(d.e),
        dogru: kalip(d), yanlis: y.map((w, i) => [kalip(w), HT[i], `“${w.en}” ${w.tr} demektir. Resimde ise ${d.tr} var.`]),
        ipucu: o.ipucu || "Önce resmi Türkçe söyle, sonra İngilizcesini hatırla.",
        cozum: [
          "🔎 Soruyu anlayalım: " + (o.anla || "Resme bakıp onu anlatan İngilizce seçeneği bulacağız."),
          `💡 Hatırlayalım: Resimde ${d.tr} var. ${neden}`,
          `✏️ Seçeneklere bakalım: “${y[0].en}” ${y[0].tr}, “${y[1].en}” ${y[1].tr} demektir.`,
          `✏️ “${y[2].en}” ise ${y[2].tr} demektir. Bunlar resme uymuyor.`,
          `✅ Sonuç: Doğru cevap “${kalip(d)}”.`,
          `🔁 Kontrol edelim: Cevabı yüksek sesle oku ve resme bir daha bak: ${d.e} = ${d.en}.`],
        kural: o.kural, dogruNeden: neden,
      });
    };
  }
  /* Çeviri üreteci (resimsiz): Türkçe → İngilizce ya da İngilizce → Türkçe */
  function T(kaz, liste, o) {
    return () => {
      const d = sec(liste), y = karistir(liste.filter(x => x !== d && !(d.haric || []).includes(x.en))).slice(0, 3), ing = Math.random() < 0.5;
      const dg = ing ? d.en : d.tr, al = w => ing ? w.en : w.tr;
      return S({
        kaz, duzey: "hatirlama", zorluk: ing ? 2 : 1,
        soru: ing ? `“${d.tr}” İngilizcede hangisidir?` : `“${d.en}” sözcüğünün Türkçesi hangisidir?`,
        dogru: dg, yanlis: y.map((w, i) => [al(w), HT[i], `Bu seçenek “${w.en}” = ${w.tr} demektir; aradığımız sözcük değil.`]),
        ipucu: "Sözcüğü kafanda bir resim gibi düşün.",
        cozum: [
          "🔎 Soruyu anlayalım: " + (ing ? `“${d.tr}” sözcüğünün İngilizcesini arıyoruz.` : `“${d.en}” sözcüğünün Türkçesini arıyoruz.`),
          `💡 Hatırlayalım: ${d.e ? d.e + " " : ""}${d.en} = ${d.tr}.`,
          `✏️ “${y[0].en}” = ${y[0].tr}; “${y[1].en}” = ${y[1].tr}.`,
          `✏️ “${y[2].en}” = ${y[2].tr}. Bunlar aradığımız sözcük değil.`,
          `✅ Sonuç: Doğru cevap “${dg}”.`,
          `🔁 Kontrol edelim: Sözcüğü bir cümlede kullan: ${o.cumle ? o.cumle(d) : d.en + "!"}`],
        kural: o.kural, dogruNeden: `${d.en} = ${d.tr}.`,
      });
    };
  }

  /* =========================================================================
   * UNIT 1 — GREETING
   * ========================================================================= */
  const ZAMAN = [
    { e: "🌅", en: "Good morning!", tr: "sabah (Günaydın!)" },
    { e: "🌞", en: "Good afternoon!", tr: "öğleden sonra (İyi günler!)" },
    { e: "🌆", en: "Good evening!", tr: "akşam (İyi akşamlar!)" },
    { e: "🛏️🌙", en: "Good night!", tr: "gece yatarken (İyi geceler!)" },
  ];
  const SELAM = [
    { en: "hello", tr: "merhaba" }, { en: "goodbye", tr: "hoşça kal" }, { en: "good morning", tr: "günaydın" },
    { en: "good night", tr: "iyi geceler" }, { en: "thank you", tr: "teşekkür ederim" }, { en: "see you", tr: "görüşürüz" },
    { en: "name", tr: "ad, isim" }, { en: "fine", tr: "iyi" },
  ];
  KONU_EKLE("en", {
    id: "e3_greeting", tema: "e3t1", ad: "Greeting", tr: "Selamlaşma",
    kazanimlar: [
      { id: "e3grt.hello", ad: "Selamlaşma ve vedalaşma ifadelerini kullanma (Hello, Goodbye, Good morning…)" },
      { id: "e3grt.intro", ad: "Kendini tanıtma ve hal hatır sorma (What's your name? How are you?)" },
    ],
    sozluk: [
      ["hello", "merhaba"], ["hi", "selam"], ["goodbye", "hoşça kal"], ["bye", "güle güle, hoşça kal"],
      ["good morning", "günaydın"], ["good afternoon", "iyi günler (öğleden sonra)"], ["good evening", "iyi akşamlar"], ["good night", "iyi geceler"],
      ["see you", "görüşürüz"], ["thank you", "teşekkür ederim"], ["name", "ad, isim"], ["fine", "iyi"],
      ["What's your name?", "Adın ne?"], ["How are you?", "Nasılsın?"], ["Nice to meet you.", "Tanıştığımıza memnun oldum."],
    ],
    anlatim: [
      { baslik: "Hello! Goodbye!",
        metin: "Biriyle karşılaşınca <b>Hello!</b> ya da <b>Hi!</b> deriz. Bu, “Merhaba!” demektir.<br>Ayrılırken <b>Goodbye!</b>, <b>Bye!</b> ya da <b>See you!</b> deriz.<br>Selamlaşırken gülümsemeyi unutma! 😊",
        ornek: "Okulun kapısında: <b>Hello, Can!</b> — <b>Hi, Elif!</b><br>Okul bitince: <b>Goodbye, Can!</b> — <b>Bye, Elif! See you!</b>",
        gorsel: balon([["👧", "Hello, Can!"], ["👦", "Hi, Elif!"]]),
        durak: { soru: "Okul bitti, eve gidiyorsun. Arkadaşına ne dersin?", secenekler: [["Goodbye!", true, "Ayrılırken “Goodbye!” deriz."], ["Hello!", false, "“Hello!” karşılaşınca söylenir."], ["Good morning!", false, "“Good morning!” sabah selamlaşırken söylenir."], ["Thank you!", false, "“Thank you!” teşekkür etmek içindir."]] } },
      { baslik: "Good morning! Good night!",
        metin: "Günün saatine göre farklı selamlar vardır.<br>🌅 Sabah: <b>Good morning!</b> (Günaydın!)<br>🌞 Öğleden sonra: <b>Good afternoon!</b><br>🌆 Akşam: <b>Good evening!</b> (İyi akşamlar!)<br>🛏️ Gece yatarken: <b>Good night!</b> (İyi geceler!)",
        ornek: "Sabah sınıfa girdin: <b>Good morning, teacher!</b><br>Yatmadan önce: <b>Good night, Mum!</b>",
        gorsel: kartlar([["🌅", "morning"], ["🌞", "afternoon"], ["🌆", "evening"], ["🌙", "night"]]),
        durak: { soru: "Gece yatağına giderken annene ne dersin?", secenekler: [["Good night, Mum!", true, "Yatmadan önce “Good night!” deriz."], ["Good morning, Mum!", false, "Bu sabah söylenir."], ["Good afternoon, Mum!", false, "Bu öğleden sonra söylenir."], ["Hello, Mum!", false, "“Hello” karşılaşınca söylenir, yatarken değil."]] } },
      { baslik: "What's your name? How are you?",
        metin: "Birinin adını öğrenmek için <b>What's your name?</b> (Adın ne?) diye sorarız.<br>Cevap: <b>I'm Ali.</b> ya da <b>My name is Ali.</b><br>Hal hatır sormak için <b>How are you?</b> (Nasılsın?) deriz. Cevap: <b>I'm fine, thank you.</b><br>Yeni biriyle tanışınca <b>Nice to meet you.</b> deriz.",
        ornek: "— <b>Hello! What's your name?</b><br>— <b>I'm Zeynep. Nice to meet you.</b><br>— <b>Nice to meet you, too!</b>",
        gorsel: balon([["👦", "What's your name?"], ["👧", "My name is Zeynep."]]),
        durak: { soru: "“How are you?” sorusuna hangisi uygun cevaptır?", secenekler: [["I'm fine, thank you.", true, "Nasılsın sorusuna “İyiyim, teşekkür ederim.” deriz."], ["I'm Ali.", false, "Bu, ad sorusunun cevabıdır."], ["Goodbye!", false, "Bu, vedalaşma sözüdür."], ["Good night!", false, "Bu, gece yatarken söylenir."]] } },
    ],
    uret: {
      "e3grt.hello": [
        E("e3grt.hello", ZAMAN, { soru: "Resimdeki zamana uygun selamlaşma hangisidir?", anla: "Resim günün hangi saatini gösteriyor? Ona uygun selamı seçeceğiz.", kural: "Sabah: Good morning · Öğleden sonra: Good afternoon · Akşam: Good evening · Yatarken: Good night" }),
        T("e3grt.hello", SELAM, { kural: "hello = merhaba · goodbye = hoşça kal", cumle: d => kac(d.en.charAt(0).toUpperCase() + d.en.slice(1)) + ", Elif!" }),
        P("e3grt.hello", "uygulama", 1, "Konuşmayı tamamla. Can ne demeli?", "Bye, Ayşe!",
          [["Good morning, Ayşe!", "kavrama", "Ayşe vedalaşıyor; sabah selamı burada uygun değil."], ["Hello, Ayşe!", "kavrama", "“Hello” karşılaşınca söylenir; Ayşe ise gidiyor."], ["I'm fine.", "bilgi", "Bu, “How are you?” sorusunun cevabıdır."]],
          "Ayşe “Goodbye” diyor; o hâlde ayrılıyorlar.",
          ["Ayşe “Goodbye, Can!” diyor. Can'ın cevabını bulacağız.", "Ayrılırken Goodbye!, Bye!, See you! deriz.", "Ayşe gidiyor, Can da ona vedalaşma sözüyle cevap vermeli.", "Seçeneklerden yalnızca “Bye” vedalaşma sözüdür.", "Karşılaşınca Hello, ayrılırken Bye. Cevap ayrılmaya uyuyor."],
          { gorsel: balon([["👧", "Goodbye, Can!"], ["👦", "______"]]), kural: "Ayrılırken: Goodbye! / Bye! / See you!", neden: "Vedalaşan birine “Bye!” diye cevap veririz." }),
        P("e3grt.hello", "uygulama", 1, "Sabah okula geldin ve öğretmenini gördün. Ne dersin?", "Good morning, teacher!",
          [["Good night, teacher!", "kavrama", "“Good night” gece yatarken söylenir."], ["Goodbye, teacher!", "kavrama", "“Goodbye” ayrılırken söylenir; sen yeni geldin."], ["Good evening, teacher!", "dikkat", "“Good evening” akşam söylenir; şimdi sabah."]],
          "Saat kaç? Sabah mı, akşam mı?",
          ["Sabah okula gelince söylenecek selamı arıyoruz.", "Sabah: Good morning! Akşam: Good evening! Gece: Good night!", "Resimde güneş yeni doğuyor; zaman sabah.", "Yeni geldiğimiz için vedalaşma sözü de uymaz.", "Sabah + karşılaşma = Good morning!"],
          { gorsel: kartlar([["🌅", "8 o'clock"], ["🏫", "school"]]), kural: "Sabah karşılaşınca: Good morning!", neden: "Sabah karşılaştığımız birine “Good morning!” deriz." }),
        P("e3grt.hello", "aciklama", 2, "“Good night!” ne zaman söylenir?", "Gece yatmadan önce",
          [["Sabah okula gelince", "bilgi", "Sabah “Good morning!” denir."], ["Arkadaşla karşılaşınca", "kavrama", "Karşılaşınca “Hello!” ya da “Hi!” denir."], ["Öğle yemeğinde", "dikkat", "Öğleden sonra “Good afternoon!” denir."]],
          "night = gece",
          ["“Good night!” sözünün ne zaman kullanıldığını soruyor.", "night = gece. “Good night!” = İyi geceler!", "Gece birinden ayrılırken ya da yatmaya giderken söyleriz.", "Sabah, öğle ve karşılaşma anları başka selamlar ister.", "Yatağa giderken “Good night, Dad!” demek doğru olur."],
          { kural: "Good night = İyi geceler (yatarken, gece ayrılırken).", neden: "“Good night!” gece yatmadan önce söylenir." }),
        P("e3grt.hello", "hatirlama", 1, "Hangisi KARŞILAŞINCA söylenir?", "Hi!",
          [["Bye!", "kavrama", "“Bye!” ayrılırken söylenir."], ["See you!", "kavrama", "“See you!” görüşürüz demektir; ayrılırken söylenir."], ["Goodbye!", "kavrama", "“Goodbye!” hoşça kal demektir."]],
          "Merhaba demenin kısa yolu hangisi?",
          ["Karşılaşma anında söylenen sözü arıyoruz.", "Hello! ve Hi! = Merhaba! Goodbye!, Bye!, See you! = ayrılırken.", "Seçeneklerden üçü ayrılırken söylenir.", "Yalnızca “Hi!” merhaba demektir.", "“Hi, Mert!” diye arkadaşını selamlayabilirsin."],
          { kural: "Karşılaşınca: Hello! / Hi!", neden: "“Hi!” merhaba demektir; karşılaşınca söylenir." }),
        P("e3grt.hello", "uygulama", 2, "Öğretmen sınıfa giriyor. Öğrenciler ne der?", "Good morning, teacher!",
          [["Good morning, class!", "dikkat", "Bunu öğretmen söyler; öğrenciler “teacher” der."], ["Good night, teacher!", "kavrama", "Okulda sabah “Good night” denmez."], ["See you, teacher!", "kavrama", "“See you” ayrılırken söylenir."]],
          "Öğretmen sınıfa “class” diyor. Sınıf da öğretmene ne der?",
          ["Öğretmen “Good morning, class!” diyor. Öğrencilerin cevabını arıyoruz.", "class = sınıf, teacher = öğretmen.", "Öğrenciler aynı selamı öğretmene söyler.", "Selam aynı kalır, sadece “class” yerine “teacher” gelir.", "Sabah + öğretmene cevap = Good morning, teacher!"],
          { gorsel: balon([["👩‍🏫", "Good morning, class!"], ["🧒", "______"]]), kural: "Selama aynı selamla cevap veririz.", neden: "Öğrenciler öğretmene “Good morning, teacher!” diye cevap verir." }),
      ],
      "e3grt.intro": [
        z => { const n = sec(ISIM_K); return S({ kaz: "e3grt.intro", duzey: "uygulama", zorluk: 1, soru: "Konuşmayı tamamla. Kız ne demeli?",
          gorsel: balon([["👦", "Hello! What's your name?"], ["👧", "______"]]), dogru: sec([`I'm ${n}.`, `My name is ${n}.`]),
          yanlis: [["I'm fine, thank you.", "kavrama", "Bu, “How are you?” sorusunun cevabıdır."], ["Goodbye!", "bilgi", "Bu, vedalaşma sözüdür."], ["I'm eight.", "dikkat", "Bu, yaş sorusunun (How old are you?) cevabıdır."]],
          ipucu: "Soru adını soruyor.", dogruNeden: "“What's your name?” sorusuna adımızı söyleyerek cevap veririz.",
          cozum: adimlar(["Erkek çocuk “What's your name?” diye soruyor.", "What's your name? = Adın ne? Cevap: I'm … ya da My name is …", "Kız adını söylemeli: " + n + ".", "Diğer seçenekler hal, yaş ya da vedalaşma cevabıdır.", "Soru “name” diyor, cevapta da isim var."], `I'm ${n}. / My name is ${n}.`, "Ad sorusuna adımızla cevap veririz."), kural: "What's your name? → I'm … / My name is …" }); },
        z => { const n = sec(ISIM_K), m = sec(ISIM_E); return S({ kaz: "e3grt.intro", duzey: "uygulama", zorluk: 1, soru: `Konuşmayı tamamla. ${n} ne demeli?`,
          gorsel: balon([["👦", `Hi, ${n}! How are you?`], ["👧", "______"]]), dogru: sec(["I'm fine, thank you.", "I'm fine, thanks."]),
          yanlis: [[`I'm ${n}.`, "kavrama", "Bu, ad sorusunun cevabıdır; burada nasıl olduğun soruluyor."], ["Good night!", "bilgi", "Bu, gece yatarken söylenir."], [`My name is ${m}.`, "dikkat", "Hem soru ad sormuyor hem de bu ad " + n + " değil."]],
          ipucu: "How are you? = Nasılsın?", dogruNeden: "“How are you?” sorusuna “I'm fine, thank you.” deriz.",
          cozum: adimlar(["Erkek çocuk “How are you?” diye soruyor.", "How are you? = Nasılsın? Cevap: I'm fine, thank you. (İyiyim, teşekkür ederim.)", n + " nasıl olduğunu söylemeli.", "Ad söylemek ya da “Good night” demek bu soruya uymaz.", "Nasılsın? → İyiyim, teşekkürler. Anlam uyuyor."], "I'm fine, thank you.", "Hal hatır sorusuna “I'm fine.” diye cevap veririz."), kural: "How are you? → I'm fine, thank you." }); },
        z => { const n = sec(ISIM_E); return S({ kaz: "e3grt.intro", duzey: "aciklama", zorluk: 2, soru: "Konuşmadaki boşluğa hangi soru gelmeli?",
          gorsel: balon([["👧", "______"], ["👦", `I'm ${n}.`]]), dogru: "What's your name?",
          yanlis: [["How are you?", "kavrama", "Bu sorunun cevabı “I'm fine.” olurdu."], ["How old are you?", "dikkat", "Bu sorunun cevabında bir sayı olurdu: I'm eight."], ["Goodbye!", "bilgi", "Bu bir soru değil, vedalaşma sözüdür."]],
          ipucu: "Cevapta bir isim var. İsmi hangi soru sorar?", dogruNeden: "“I'm " + n + ".” cevabı ad sorusuna verilir.",
          cozum: adimlar(["Cevap verilmiş: “I'm " + n + ".” Soruyu bulacağız.", "Ad sormak için: What's your name?", "Cevapta bir isim var, sayı ya da “fine” yok.", "Demek ki soru adı soruyor.", "“What's your name?” — “I'm " + n + ".” Soru ve cevap uyuyor."], "What's your name?", "Cevapta isim olduğu için soru ad sorar."), kural: "What's your name? = Adın ne?" }); },
        P("e3grt.intro", "uygulama", 1, "“Nice to meet you.” diyen birine ne deriz?", "Nice to meet you, too.",
          [["I'm fine.", "kavrama", "Bu, “How are you?” sorusunun cevabıdır."], ["Good night.", "bilgi", "Bu, gece yatarken söylenir."], ["What's your name?", "dikkat", "Tanışma bitti; adı sormak cevap olmaz."]],
          "too = de, da",
          ["Biri bize “Tanıştığımıza memnun oldum.” diyor.", "Nice to meet you. = Tanıştığımıza memnun oldum. too = de/da.", "Biz de “Ben de memnun oldum.” demeliyiz.", "Bunun İngilizcesi: Nice to meet you, too.", "Aynı cümleyi sonuna “too” ekleyerek geri söyleriz."],
          { gorsel: balon([["👧", "Nice to meet you."], ["👦", "______"]]), kural: "Nice to meet you. → Nice to meet you, too.", neden: "“too” ekleyerek “Ben de memnun oldum.” demiş oluruz." }),
        P("e3grt.intro", "aciklama", 1, "“My name is Elif.” cümlesinin Türkçesi hangisidir?", "Benim adım Elif.",
          [["Ben iyiyim, Elif.", "bilgi", "“fine” iyi demektir; cümlede yok."], ["Bu Elif.", "kavrama", "“Bu Elif.” = This is Elif."], ["Elif, nasılsın?", "bilgi", "“Nasılsın?” = How are you?"]],
          "my = benim, name = ad",
          ["İngilizce cümlenin Türkçesini arıyoruz.", "my = benim, name = ad, is = -dır.", "My name is Elif. → Benim adım Elif.", "Diğer seçeneklerde “nasılsın”, “bu”, “iyiyim” var; cümlede yoklar.", "Sözcükleri tek tek eşledik: my-benim, name-ad, Elif."],
          { kural: "My name is … = Benim adım …", neden: "my = benim, name = ad olduğu için cümle “Benim adım Elif.” demektir." }),
        P("e3grt.intro", "uygulama", 2, "Sözcükleri doğru sıraya koy: <b>name / your / What's / ?</b>", "What's your name?",
          [["Your name what's?", "kavrama", "İngilizcede soru “What's” ile başlar."], ["What's name your?", "dikkat", "“your” (senin) “name” sözcüğünden önce gelir."], ["Name your what's?", "kavrama", "Soru sözcüğü (What's) en başta olmalı."]],
          "Soru sözcüğü en başa gelir.",
          ["Karışık sözcüklerden doğru soruyu kuracağız.", "Ad sorma kalıbı: What's your name?", "What's en başta gelir.", "Sonra “your”, en sonda “name” gelir: your name = senin adın.", "Soruyu yüksek sesle oku: What's your name? Kulağa doğru geliyor."],
          { kural: "What's + your + name?", neden: "Soru sözcüğü başta, “your name” sonda olmalıdır." }),
        P("e3grt.intro", "hatirlama", 1, "Hangisi kendi adını söyleyen bir cümledir?", "I'm Deniz.",
          [["I'm fine.", "kavrama", "Bu, nasıl olduğunu söyler; ad değil."], ["How are you?", "bilgi", "Bu bir sorudur: Nasılsın?"], ["Thank you.", "bilgi", "Bu, teşekkür etmektir."]],
          "Cümlede bir isim var mı?",
          ["Adını söyleyen cümleyi arıyoruz.", "Adımızı söylerken: I'm … ya da My name is …", "“I'm Deniz.” cümlesinde bir isim var.", "“I'm fine.” cümlesinde isim değil, “iyi” sözcüğü var.", "I'm + isim = adını söyleme. Deniz bir isim."],
          { gorsel: kart("🧒", "I'm …"), kural: "I'm + ad: I'm Deniz.", neden: "“I'm Deniz.” cümlesi bir ad söyler." }),
      ],
    },
  });

  /* =========================================================================
   * UNIT 2 — MY FAMILY
   * ========================================================================= */
  const AILE = [
    { en: "grandmother", tr: "büyükanne (nine)", e: "👵", x: 180, y: 58 },
    { en: "grandfather", tr: "büyükbaba (dede)", e: "👴", x: 340, y: 58 },
    { en: "mother", tr: "anne", e: "👩", x: 180, y: 168 },
    { en: "father", tr: "baba", e: "👨", x: 340, y: 168 },
    { en: "sister", tr: "kız kardeş", e: "👧", x: 110, y: 278 },
    { en: "brother", tr: "erkek kardeş", e: "👦", x: 410, y: 278 },
  ];
  function soyAgaci(isaret) {
    let ic = `<line class="g-ince" x1="180" y1="58" x2="340" y2="58"/><line class="g-ince" x1="260" y1="58" x2="260" y2="168"/><line class="g-ince" x1="180" y1="168" x2="340" y2="168"/>` +
      `<line class="g-ince" x1="260" y1="168" x2="260" y2="230"/><line class="g-ince" x1="110" y1="230" x2="410" y2="230"/><line class="g-ince" x1="110" y1="230" x2="110" y2="250"/><line class="g-ince" x1="410" y1="230" x2="410" y2="250"/>`;
    AILE.forEach(a => { ic += `<circle class="${a === isaret ? "g-b" : "g-bos"} g-cizgi" cx="${a.x}" cy="${a.y}" r="40" stroke-width="${a === isaret ? 4 : 1.5}"/>` + emo(a.x, a.y, a.e, 44); if (a === isaret) ic += G.yazi(a.x + 58, a.y - 26, "?", { b: 1 }); });
    ic += `<circle class="g-yumusak g-cizgi" cx="260" cy="278" r="40" stroke-width="2"/>` + emo(260, 278, "🧒", 44) + G.yazi(260, 338, "ME (ben)", { b: 1 });
    return G.svg(520, 350, ic, "aile ağacı");
  }
  KONU_EKLE("en", {
    id: "e3_family", tema: "e3t2", ad: "My Family", tr: "Ailem",
    kazanimlar: [
      { id: "e3fam.members", ad: "Aile bireylerinin adlarını tanıma (mother, father, sister, brother, grandparents)" },
      { id: "e3fam.this", ad: "Aile bireylerini tanıtma (This is my …, He/She is my …)" },
    ],
    sozluk: [
      ["family", "aile"], ["mother", "anne"], ["mum", "anne (anneciğim)"], ["father", "baba"], ["dad", "baba (babacığım)"],
      ["sister", "kız kardeş"], ["brother", "erkek kardeş"], ["grandmother", "büyükanne"], ["grandfather", "büyükbaba"],
      ["grandparents", "büyükanne ve büyükbaba"], ["parents", "anne ve baba"], ["baby", "bebek"], ["me", "ben, beni"], ["This is my …", "Bu benim …"],
    ],
    anlatim: [
      { baslik: "My family (Ailem)",
        metin: "Ailemizdeki kişilerin İngilizce adları:<br>👩 <b>mother</b> (anne) — kısaca <b>Mum</b><br>👨 <b>father</b> (baba) — kısaca <b>Dad</b><br>👧 <b>sister</b> (kız kardeş) · 👦 <b>brother</b> (erkek kardeş)<br>👵 <b>grandmother</b> (büyükanne) · 👴 <b>grandfather</b> (büyükbaba)",
        ornek: "Anne ve baba birlikte: <b>parents</b>. Büyükanne ve büyükbaba birlikte: <b>grandparents</b>.",
        gorsel: soyAgaci(null),
        durak: { soru: "“brother” ne demektir?", secenekler: [["erkek kardeş", true, "brother = erkek kardeş."], ["kız kardeş", false, "Kız kardeş “sister” olur."], ["baba", false, "Baba “father” olur."], ["büyükbaba", false, "Büyükbaba “grandfather” olur."]] } },
      { baslik: "This is my …",
        metin: "Ailemizi tanıtırken <b>This is my …</b> (Bu benim …) deriz.<br>Erkekler için <b>he</b> (o), kızlar ve kadınlar için <b>she</b> (o) kullanırız.<br><b>He is my brother.</b> · <b>She is my sister.</b>",
        ornek: "📷 Fotoğrafı gösteriyorum: <b>This is my mother. She is a teacher. This is my father.</b>",
        gorsel: kartlar([["👩", "This is my mum."], ["👨", "This is my dad."]]),
        durak: { soru: "Fotoğraftaki büyükbabanı tanıtıyorsun. Hangisi doğru?", secenekler: [["This is my grandfather.", true, "Büyükbaba = grandfather."], ["This is my grandmother.", false, "grandmother büyükanne demektir."], ["This is my brother.", false, "brother erkek kardeş demektir."], ["I am my grandfather.", false, "Tanıtırken “This is my …” deriz."]] } },
      { baslik: "Who is he? Who is she?",
        metin: "<b>Who is he?</b> = O (erkek) kim?<br><b>Who is she?</b> = O (kız/kadın) kim?<br>Cevap verirken yine he ya da she kullanırız: <b>He is my father.</b> <b>She is my grandmother.</b>",
        ornek: "— <b>Who is she?</b> — <b>She is my sister, Ece.</b>",
        gorsel: balon([["👦", "Who is she?"], ["👧", "She is my sister."]]),
        durak: { soru: "Fotoğrafta babanı gösteriyorsun. Arkadaşın “Who is he?” diye soruyor. Ne dersin?", secenekler: [["He is my father.", true, "Babamız erkek olduğu için “he” deriz."], ["She is my father.", false, "“she” kızlar ve kadınlar içindir."], ["He is my mother.", false, "mother anne demektir."], ["I'm fine.", false, "Bu, “How are you?” sorusunun cevabıdır."]] } },
    ],
    uret: {
      "e3fam.members": [
        z => { const d = sec(AILE), y = karistir(AILE.filter(a => a !== d)).slice(0, 3); return S({ kaz: "e3fam.members", duzey: "uygulama", zorluk: 2,
          soru: "Aile ağacında sarı daire içindeki kişi kim? Tamamla: <b>This is my ___.</b>", gorsel: soyAgaci(d), dogru: d.en,
          yanlis: y.map((w, i) => [w.en, HT[i], `“${w.en}” ${w.tr} demektir. Sarı dairedeki ise ${d.tr}.`]), ipucu: "“ME” yazan sensin. Sarı dairedeki kişi sana göre kim?",
          dogruNeden: `Sarı dairedeki kişi senin ${d.tr}; İngilizcesi “${d.en}”.`,
          cozum: adimlar(["Ağaçta “ME” sensin. Sarı dairedeki kişinin sana göre kim olduğunu bulacağız.", "Üst sıra: grandmother, grandfather · Orta sıra: mother, father · Alt sıra: sister, brother.", `Sarı daire ${d.y < 100 ? "en üst sırada" : d.y < 200 ? "orta sırada" : "senin sıranda"}, resimde ${d.e} var.`, `Bu kişi senin ${d.tr}.`, `“This is my ${d.en}.” cümlesini söyle ve resimle karşılaştır.`], d.en, `${d.tr} = ${d.en}.`), kural: "mother · father · sister · brother · grandmother · grandfather" }); },
        T("e3fam.members", AILE.concat([{ e: "👶", en: "baby", tr: "bebek" }]), { kural: "Aile: mother, father, sister, brother, grandmother, grandfather", cumle: d => `This is my ${d.en}.` }),
        P("e3fam.members", "aciklama", 2, "Annemin annesi benim neyim olur?", "grandmother",
          [["grandfather", "dikkat", "grandfather büyükbaba (dede) demektir; annenin annesi bir kadındır."], ["sister", "bilgi", "sister kız kardeş demektir."], ["mother", "kavrama", "mother kendi annendir; annenin annesi senin büyükannendir."]],
          "Annenin annesine “anneanne” deriz.",
          ["Annemin annesinin İngilizce adını arıyoruz.", "Annemin annesi = anneanne = büyükanne = grandmother.", "grand + mother: büyük + anne.", "grandfather erkektir; mother ise kendi annemdir.", "grand + mother = grandmother. Anlam tutuyor."],
          { gorsel: kartlar([["👵", "?"], ["➡️", ""], ["👩", "mother"], ["➡️", ""], ["🧒", "me"]]), kural: "grandmother = büyükanne · grandfather = büyükbaba", neden: "Annenin annesi senin büyükannendir: grandmother." }),
        P("e3fam.members", "hatirlama", 1, "Resimdeki iki kişi kim? <b>They are my ___.</b>", "parents",
          [["grandparents", "dikkat", "grandparents büyükanne ve büyükbaba demektir."], ["sisters", "bilgi", "sisters kız kardeşler demektir."], ["brothers", "bilgi", "brothers erkek kardeşler demektir."]],
          "Mum + Dad = ?",
          ["Resimde Mum ve Dad var. İkisine birlikte ne denir?", "Anne ve baba birlikte = parents.", "Büyükanne ve büyükbaba birlikte = grandparents.", "Resimdekiler anne ve baba, yani parents.", "“They are my parents.” = Onlar benim annem ve babam."],
          { gorsel: kartlar([["👩", "Mum"], ["👨", "Dad"]]), kural: "parents = anne ve baba", neden: "Anne ve babaya birlikte “parents” denir." }),
        P("e3fam.members", "hatirlama", 1, "Resimdeki iki kişi kim? <b>They are my ___.</b>", "grandparents",
          [["parents", "dikkat", "parents anne ve baba demektir."], ["brothers", "bilgi", "brothers erkek kardeşler demektir."], ["sisters", "bilgi", "sisters kız kardeşler demektir."]],
          "grand = büyük",
          ["Resimde büyükanne ve büyükbaba var.", "grandmother + grandfather = grandparents.", "Başında “grand” olan sözcük büyükanne ve büyükbabayı anlatır.", "parents ise anne ve babadır.", "“They are my grandparents.” = Onlar benim büyükannem ve büyükbabam."],
          { gorsel: kartlar([["👵", "Grandma"], ["👴", "Grandpa"]]), kural: "grandparents = büyükanne ve büyükbaba", neden: "Büyükanne ve büyükbabaya birlikte “grandparents” denir." }),
        P("e3fam.members", "aciklama", 2, "Hangisi FARKLI? (Hangisi aile bireyi değil?)", "ball",
          [["mother", "dikkat", "mother anne demektir; aile bireyidir."], ["brother", "dikkat", "brother erkek kardeş demektir; aile bireyidir."], ["grandfather", "dikkat", "grandfather büyükbaba demektir; aile bireyidir."]],
          "Hangisi bir oyuncak?",
          ["Dört sözcükten aileye ait olmayanı bulacağız.", "mother, brother, grandfather aile bireyleridir.", "ball top demektir; bir oyuncaktır.", "O hâlde aile grubuna uymayan sözcük “ball”.", "Diğer üç sözcük “This is my …” ile söylenebilir: This is my mother."],
          { kural: "Aile sözcükleri: mother, father, sister, brother, grandmother, grandfather", neden: "ball bir oyuncaktır, aile bireyi değildir." }),
        P("e3fam.members", "uygulama", 2, "Resme bak. <b>How many sisters?</b> (Kaç kız kardeş var?)", "two",
          [["one", "dikkat", "Erkek kardeş tek; kız kardeşler ise iki."], ["three", "islem", "Üç, bütün kardeşlerin sayısıdır; sadece kız kardeşleri say."], ["four", "islem", "Resimde dört kardeş yok."]],
          "Sadece 👧 kartlarını say.",
          ["Resimde kardeşler var. Kaç kız kardeş olduğunu soruyor.", "sister = kız kardeş (👧), brother = erkek kardeş (👦).", "👧 kartlarını sayalım: 1, 2.", "👦 kartı bir tane; o erkek kardeş.", "İki kız kardeş: two sisters."],
          { gorsel: kartlar([["👧", "sister"], ["👦", "brother"], ["👧", "sister"]]), kural: "one, two, three … · sister = kız kardeş", neden: "Resimde iki kız kardeş (👧) var: two." }),
      ],
      "e3fam.this": [
        z => { const d = sec(AILE), y = karistir(AILE.filter(a => a !== d)).slice(0, 2); return S({ kaz: "e3fam.this", duzey: "uygulama", zorluk: 1,
          soru: `Fotoğraftaki kişi senin <b>${d.tr}</b>. Onu nasıl tanıtırsın?`, gorsel: kart(d.e, d.tr), dogru: `This is my ${d.en}.`,
          yanlis: [[`This is my ${y[0].en}.`, "bilgi", `“${y[0].en}” ${y[0].tr} demektir.`], [`This is my ${y[1].en}.`, "dikkat", `“${y[1].en}” ${y[1].tr} demektir.`], [`I am my ${d.en}.`, "kavrama", "Başkasını tanıtırken “I am” değil, “This is my …” deriz."]],
          ipucu: "Tanıtma kalıbı: This is my …", dogruNeden: `“This is my ${d.en}.” cümlesinde ${d.en} = ${d.tr}.`,
          cozum: adimlar(["Fotoğraftaki kişiyi tanıtacağız.", "Tanıtırken: This is my … (Bu benim …).", `${d.tr} = ${d.en}.`, "“I am …” kendimizi anlatır; başkasını tanıtmaz.", "Kalıp doğru, sözcük doğru: This is my " + d.en + "."], `This is my ${d.en}.`, "Başkasını “This is my …” ile tanıtırız."), kural: "This is my + aile bireyi." }); },
        P("e3fam.this", "aciklama", 1, "“This is my father.” cümlesinin Türkçesi hangisidir?", "Bu benim babam.",
          [["Bu benim annem.", "bilgi", "Anne “mother” olur."], ["Ben babayım.", "kavrama", "“Ben” = I. Cümlede “This” (bu) var."], ["Babam nerede?", "bilgi", "Bu bir sorudur; cümlede soru yok."]],
          "This = bu, my = benim",
          ["Cümlenin Türkçesini arıyoruz.", "This = bu, my = benim, father = baba.", "Sözcükleri birleştirelim: Bu benim babam.", "Diğer seçeneklerde anne, ben ya da nerede var; cümlede bunlar yok.", "Bu (This) benim (my) babam (father). Tamam!"],
          { kural: "This is my … = Bu benim …", neden: "This = bu, my = benim, father = baba." }),
        P("e3fam.this", "uygulama", 2, "Resimdeki kişiyi gösteriyorsun. Arkadaşın “Who is she?” diye soruyor. Hangisi doğru cevaptır?", "She is my grandmother.",
          [["He is my grandmother.", "dikkat", "Büyükanne kadındır; “she” kullanırız."], ["She is my grandfather.", "bilgi", "grandfather büyükbaba demektir."], ["It is my grandmother.", "kavrama", "İnsanlar için “it” değil, he ya da she kullanırız."]],
          "Kadınlar ve kızlar için: she",
          ["Arkadaşın “O kim?” diye soruyor. Resimde büyükanne var.", "Kadın ve kızlar için she, erkekler için he kullanırız.", "Büyükanne kadındır: She is my …", "Büyükanne = grandmother.", "She + grandmother: ikisi de kadını anlatıyor."],
          { gorsel: kart("👵", "Grandma"), kural: "Kadın / kız → she · Erkek → he", neden: "Büyükanne kadındır; “She is my grandmother.” deriz." }),
        P("e3fam.this", "uygulama", 2, "Resimdeki kişiyi gösteriyorsun. Arkadaşın “Who is he?” diye soruyor. Hangisi doğru cevaptır?", "He is my grandfather.",
          [["She is my grandfather.", "dikkat", "Büyükbaba erkektir; “he” kullanırız."], ["He is my grandmother.", "bilgi", "grandmother büyükanne demektir."], ["He is my sister.", "bilgi", "sister kız kardeş demektir."]],
          "Erkekler için: he",
          ["Resimde büyükbaba var. “O kim?” sorusunu cevaplayacağız.", "Erkekler için he, kadınlar ve kızlar için she.", "Büyükbaba erkektir: He is my …", "Büyükbaba = grandfather.", "He + grandfather: ikisi de erkeği anlatıyor."],
          { gorsel: kart("👴", "Grandpa"), kural: "Erkek → he · Kadın / kız → she", neden: "Büyükbaba erkektir; “He is my grandfather.” deriz." }),
        P("e3fam.this", "hatirlama", 1, "Boşluğa ne gelmeli? <b>This ___ my brother.</b>", "is",
          [["am", "kavrama", "“am” sadece “I” ile kullanılır: I am."], ["are", "kavrama", "“are” you, we, they ile kullanılır."], ["my", "dikkat", "Cümlede “my” zaten var."]],
          "This is …",
          ["Boşluğa uygun sözcüğü bulacağız.", "I am · He / She / This is · You / They are.", "Öznemiz “This”.", "This ile “is” kullanılır.", "“This is my brother.” cümlesi doğru ve tamam."],
          { kural: "This is my …", neden: "“This” ile her zaman “is” kullanılır." }),
        P("e3fam.this", "transfer", 2, "Kemal ailesini tanıtıyor: <i>“This is my mum. This is my dad. This is my sister, Ece.”</i> Kemal kaç kişiyi tanıttı?", "three",
          [["two", "dikkat", "Kız kardeşi Ece'yi de saymalısın."], ["four", "islem", "Kemal kendisini tanıtmadı; üç kişi var."], ["one", "dikkat", "Kemal üç kez “This is my …” dedi."]],
          "“This is my …” cümlelerini say.",
          ["Kemal'in kaç aile bireyini tanıttığını bulacağız.", "Her “This is my …” cümlesi bir kişiyi tanıtır.", "mum (1), dad (2), sister Ece (3).", "Üç cümle var, üç kişi tanıtıldı.", "Bir daha say: mum, dad, sister. Üç! three = üç."],
          { gorsel: kartlar([["👩", "mum"], ["👨", "dad"], ["👧", "Ece"]]), kural: "one = 1, two = 2, three = 3", neden: "Kemal anne, baba ve kız kardeşini tanıttı: three." }),
      ],
    },
  });
})();
