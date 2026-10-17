/* 6. sınıf İngilizce — Theme 1 (School Life) ve Theme 2 (Classroom Life).
 * Konular: Roles and Responsibilities at School · School Routines · National Days and Celebrations ·
 * Daily and Study Routines · Learning Activities in the Classroom · Numbers (100–500, 1st–50th).
 */
(function () {
  "use strict";
  const { R, sec, karistir, S, Q, G } = OGR;

  /* Parametreli (S ile kurulan) soruların kısa çözümlerini 🔎 💡 ✏️ ✅ 🔁 biçiminde 5–7 adıma genişletir:
   * soruyu anlama, hatırlanacak bilgi, çeldiricilerin tek tek elenmesi, sonuç ve son çeldiriciyle kontrol. */
  function zengin(o) {
    if (!o || !Array.isArray(o.cozum) || o.cozum.length >= 5) return o;
    const nokta = t => /[.!?…:)”"]$/.test(String(t).trim()) ? String(t).trim() : String(t).trim() + ".";
    const goruldu = new Set([String(o.dogru)]), y = [];
    for (const w of o.yanlis || []) { const m = String(w[0]); if (!m || m === "NaN" || m === "undefined" || m === "null" || goruldu.has(m)) continue; goruldu.add(m); y.push(w); if (y.length === 3) break; }
    const s = o.cozum, n = s.length, out = ["🔎 Soruyu anlayalım: " + String(s[0]).replace(/^Soru:\s*/, "")];
    if (n >= 3) { out.push("💡 Hatırlayalım: " + s[1]); for (let i = 2; i <= n - 2; i++) out.push("✏️ " + s[i]); }
    else out.push("💡 Hatırlayalım: " + (o.kural || s[0]));
    const sonIcerir = String(s[n - 1]).toLocaleLowerCase("tr").includes(String(o.dogru).toLocaleLowerCase("tr").replace(/[.!?]$/, ""));
    if (!sonIcerir) out.push("✏️ " + s[n - 1]);
    y.slice(0, -1).forEach((w, i) => out.push((i === 0 ? "✏️ Seçenekleri tek tek inceleyelim: " : "✏️ ") + "“" + w[0] + "” → " + nokta(w[2])));
    out.push("✅ Sonuç: " + (sonIcerir ? String(s[n - 1]) : "Doğru cevap “" + o.dogru + "”.").replace(/^(Doğru cevap|Doğru cümle|Doğru seçenek|Doğru sıra|Doğru|Cevap)\s*:\s*/, ""));
    if (y.length) { const w = y[y.length - 1]; out.push("🔁 Kontrol edelim: Son seçenek “" + w[0] + "” de aradığımız cevap değil: " + nokta(w[2]) + " Geriye yalnızca “" + o.dogru + "” kalıyor."); }
    else out.push("🔁 Kontrol edelim: " + (o.kural || "Cevabı soruya yerleştirip yeniden oku."));
    o.cozum = out;
    if (!o.dogruNeden) o.dogruNeden = n >= 3 ? nokta(s[n - 2]) : nokta(o.kural || s[0]);
    return o;
  }

  /* ---------------------------- Sayı yardımcıları ---------------------------- */
  const BIRLER = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const ONLAR = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const yuzAlti = n => n < 20 ? BIRLER[n] : ONLAR[Math.floor(n / 10)] + (n % 10 ? "-" + BIRLER[n % 10] : "");
  /* İngiliz İngilizcesi: 245 → two hundred and forty-five */
  const kelime = n => n < 100 ? yuzAlti(n) : BIRLER[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + yuzAlti(n % 100) : "");
  const SIRA_BIR = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"];
  const SIRA_ON = ["", "", "twentieth", "thirtieth", "fortieth", "fiftieth"];
  const siraKelime = n => n < 20 ? SIRA_BIR[n] : n % 10 === 0 ? SIRA_ON[n / 10] : ONLAR[Math.floor(n / 10)] + "-" + SIRA_BIR[n % 10];
  const ekSira = n => (n % 100 >= 11 && n % 100 <= 13) ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th");
  const siraKisa = n => n + ekSira(n);
  /* Sık yapılan yanlış: sayının sonuna doğrudan -th eklemek (twelveth, nineth, twenty-oneth) */
  const safTh = n => kelime(n) + "th";
  const AYLAR = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  /* 100–500 arası bir sayının yazılışı için çeldiriciler */
  function kartYanlis(n) {
    const h = Math.floor(n / 100), r = n % 100, t = Math.floor(r / 10), o = r % 10, y = [];
    y.push([kelime(n).replace(" hundred", " hundreds"), "dikkat", "“hundred” bir sayıdan sonra çoğul eki (-s) almaz: two hundred, three hundred."]);
    if (t >= 2 && o && t !== o) y.push([kelime(h * 100 + o * 10 + t), "dikkat", "Onlar ve birler basamağı yer değiştirmiş."]);
    if (r >= 13 && r <= 19) y.push([kelime(h * 100 + (r - 10) * 10), "kavrama", "-teen (13–19) ile -ty (30, 40…) karıştırılmış."]);
    if (o === 0 && t >= 3) y.push([kelime(h * 100 + 10 + t), "kavrama", "-ty (30, 40…) ile -teen (13–19) karıştırılmış."]);
    y.push([kelime(n + 10), "islem", "Onlar basamağı bir fazla okunmuş."]);
    y.push([kelime(n - 10), "islem", "Onlar basamağı bir eksik okunmuş."]);
    return y;
  }

  /* =========================================================================
   * THEME 1 — 1) ROLES AND RESPONSIBILITIES AT SCHOOL
   * ========================================================================= */
  KONU_EKLE("en", {
    id: "en_roles", tema: "en1", ad: "Roles and Responsibilities at School", tr: "Okulda görevler ve sorumluluklar",
    kazanimlar: [
      { id: "enrol.roles", ad: "Okuldaki görevleri ve sorumlulukları tanıma (roles, responsibilities, 's)" },
      { id: "enrol.article", ad: "a / an / the kullanımı" },
      { id: "enrol.rules", ad: "Emir cümleleri ve nesne zamirleriyle okul kurallarını anlatma" },
    ],
    sozluk: [
      ["headteacher", "okul müdürü"], ["deputy head", "müdür yardımcısı"], ["teacher", "öğretmen"], ["class monitor", "sınıf başkanı"],
      ["leader", "lider"], ["librarian", "kütüphane görevlisi"], ["school counsellor", "rehber öğretmen"], ["caretaker", "okul görevlisi, hizmetli"],
      ["cook", "aşçı"], ["security guard", "güvenlik görevlisi"], ["school nurse", "okul hemşiresi"], ["student", "öğrenci"],
      ["role", "görev, rol"], ["responsibility", "sorumluluk"], ["rule", "kural"], ["collect", "toplamak"],
      ["clean", "temizlemek"], ["corridor", "koridor"], ["canteen", "kantin"], ["on duty", "nöbetçi"],
    ],
    anlatim: [
      { baslik: "Okuldaki görevler (roles at school)",
        metin: "Okulda herkesin bir <b>görevi (role)</b> ve <b>sorumluluğu (responsibility)</b> vardır. Görevleri anlatırken geniş zamanı kullanırız; he / she öznesinde fiil <b>-s</b> alır.<br><b>The headteacher</b> manages the school. (Müdür okulu yönetir.)<br><b>The librarian</b> helps us find books.<br><b>The school counsellor</b> listens to our problems.<br><b>The class monitor</b> collects the homework.<br>Bir görevin kime ait olduğunu <b>'s</b> ile gösteririz: <b>the monitor's job</b> (sınıf başkanının görevi), <b>Ayşe's role</b> (Ayşe'nin görevi).",
        ornek: "<b>Kerem is the class monitor. Kerem's job is to collect the homework.</b> (Kerem sınıf başkanıdır. Kerem'in görevi ödevleri toplamaktır.)",
        gorsel: G.tablo(["Role", "Responsibility"], [["the headteacher", "manages the school"], ["the librarian", "helps students find books"], ["the school nurse", "looks after sick students"], ["the cook", "cooks meals"], ["the security guard", "checks the school gate"]]),
        durak: { soru: "Who looks after sick students at school?", secenekler: [["the school nurse", true, "Okul hemşiresi hasta öğrencilerle ilgilenir."], ["the librarian", false, "Kütüphane görevlisi kitap bulmamıza yardım eder."], ["the cook", false, "Aşçı yemek pişirir."], ["the security guard", false, "Güvenlik görevlisi okul kapısını kontrol eder."]] } },
      { baslik: "a / an / the",
        metin: "Tekil ve sayılabilen bir ismi <b>ilk kez</b> söylerken <b>a</b> ya da <b>an</b> kullanırız.<br><b>a</b>: sessiz harf <i>sesiyle</i> başlayan kelimeler → <b>a</b> teacher, <b>a</b> book, <b>a</b> university (yu- sesi).<br><b>an</b>: sesli harf <i>sesiyle</i> başlayan kelimeler → <b>an</b> apple, <b>an</b> English teacher, <b>an</b> hour (h okunmaz).<br><b>the</b>: daha önce söz ettiğimiz ya da herkesin bildiği, tek olan şeyler → <b>the</b> board, <b>the</b> headteacher, <b>the</b> Sun.",
        ornek: "<b>I have a new friend. The friend is from İzmir.</b> (İlk söyleyişte a, ikinci söyleyişte the.)",
        durak: { soru: "Mr Demir is ___ English teacher.", secenekler: [["an", true, "“English” sesli harf sesiyle başlar; bu yüzden “an English teacher” deriz."], ["a", false, "“a” sessiz harf sesiyle başlayan kelimelerden önce gelir."], ["the", false, "Mr Demir'i ilk kez tanıtıyoruz; a/an kullanılır."], ["–", false, "Tekil sayılabilen isimden önce a/an gerekir."]] } },
      { baslik: "Okul kuralları: emir cümleleri ve nesne zamirleri",
        metin: "Kural ve talimat verirken <b>emir cümlesi (imperative)</b> kullanırız. Cümle fiilin <b>yalın hâliyle</b> başlar, özne yazılmaz.<br>Olumlu: <b>Raise your hand.</b> <b>Listen to your teacher.</b> <b>Be quiet.</b><br>Olumsuz: <b>Don't</b> + fiil → <b>Don't run</b> in the corridor. <b>Don't eat</b> in the classroom.<br>Kibar olmak için <b>please</b> ekleriz: <b>Please, close the door.</b><br>Fiilden sonra kişiyi gösteren <b>nesne zamirleri</b> gelir: me, you, him, her, it, us, them. → <b>Help him.</b> <b>Listen to me.</b>",
        ornek: "<b>Don't shout in the library. Please, help us.</b> (Kütüphanede bağırma. Lütfen bize yardım et.)",
        durak: { soru: "Hangisi doğru bir okul kuralıdır?", secenekler: [["Don't run in the corridor.", true, "Olumsuz emir: Don't + fiilin yalın hâli."], ["Doesn't run in the corridor.", false, "Emir cümlesinde “doesn't” kullanılmaz; “Don't” kullanılır."], ["Not run in the corridor.", false, "Olumsuz emir “Don't” ile kurulur."], ["Runs in the corridor.", false, "Emir cümlesinde fiil yalın hâldedir ve bu cümle kural değildir."]] } },
    ],
    uret: {
      "enrol.roles": [
        Q("enrol.roles", "hatirlama", 1, "Who helps students find books in the school library?", "the librarian",
          [["the cook", "bilgi", "Aşçı (cook) okulda yemek pişirir."], ["the security guard", "bilgi", "Güvenlik görevlisi okulun kapısını ve güvenliğini kontrol eder."], ["the school nurse", "bilgi", "Okul hemşiresi hasta öğrencilerle ilgilenir."]],
          "“library” ve “librarian” kelimelerine bak.",
          [
           "🔎 Soruyu anlayalım: Kütüphanede kitap bulmamıza kim yardım eder?",
           "💡 Hatırlayalım: library = kütüphane, librarian = kütüphane görevlisi.",
           "✏️ Seçenekleri tek tek inceleyelim: “the cook” → Aşçı (cook) okulda yemek pişirir.",
           "✏️ “the security guard” → Güvenlik görevlisi okulun kapısını ve güvenliğini kontrol eder.",
           "✅ Sonuç: the librarian.",
           "🔁 Kontrol edelim: Son seçenek “the school nurse” de aradığımız cevap değil: Okul hemşiresi hasta öğrencilerle ilgilenir. Geriye yalnızca “the librarian” kalıyor."],
          { kural: "librarian: kütüphane görevlisi; library: kütüphane.", dogruNeden: "library = kütüphane, librarian = kütüphane görevlisi." }),
        Q("enrol.roles", "hatirlama", 1, "“school counsellor” ne demektir?", "rehber öğretmen",
          [["okul müdürü", "bilgi", "Okul müdürü “headteacher” demektir."], ["kütüphane görevlisi", "bilgi", "Kütüphane görevlisi “librarian” demektir."], ["sınıf başkanı", "bilgi", "Sınıf başkanı “class monitor” demektir."]],
          "Counsellor, öğrencileri dinleyen ve onlara yol gösteren kişidir.",
          [
           "🔎 Soruyu anlayalım: counsellor = danışman, rehber.",
           "💡 Hatırlayalım: Okulda öğrencilerin sorunlarını dinleyen kişi rehber öğretmendir.",
           "✏️ Seçenekleri tek tek inceleyelim: “okul müdürü” → Okul müdürü “headteacher” demektir.",
           "✏️ “kütüphane görevlisi” → Kütüphane görevlisi “librarian” demektir.",
           "✅ Sonuç: school counsellor = rehber öğretmen.",
           "🔁 Kontrol edelim: Son seçenek “sınıf başkanı” de aradığımız cevap değil: Sınıf başkanı “class monitor” demektir. Geriye yalnızca “rehber öğretmen” kalıyor."],
          { kural: "school counsellor: rehber öğretmen; headteacher: okul müdürü.", dogruNeden: "Okulda öğrencilerin sorunlarını dinleyen kişi rehber öğretmendir." }),
        Q("enrol.roles", "hatirlama", 1, "“Okul müdürü” İngilizcede nasıl söylenir?", "headteacher",
          [["caretaker", "bilgi", "caretaker okulun temizlik ve bakımıyla ilgilenen görevlidir."], ["class monitor", "bilgi", "class monitor sınıf başkanıdır."], ["deputy head", "kavrama", "deputy head müdür yardımcısıdır."]],
          "head = baş, en üstteki kişi.",
          [
           "🔎 Soruyu anlayalım: Okulu yöneten kişi okul müdürüdür.",
           "💡 Hatırlayalım: İngilizcede okul müdürüne “headteacher” denir.",
           "✏️ deputy head ise müdür yardımcısıdır.",
           "✏️ Seçenekleri tek tek inceleyelim: “caretaker” → caretaker okulun temizlik ve bakımıyla ilgilenen görevlidir.",
           "✏️ “class monitor” → class monitor sınıf başkanıdır.",
           "✅ Sonuç: Doğru cevap “headteacher”.",
           "🔁 Kontrol edelim: Son seçenek “deputy head” de aradığımız cevap değil: deputy head müdür yardımcısıdır. Geriye yalnızca “headteacher” kalıyor."],
          { kural: "headteacher: okul müdürü; deputy head: müdür yardımcısı.", dogruNeden: "İngilizcede okul müdürüne “headteacher” denir." }),
        Q("enrol.roles", "uygulama", 2, "Read the text and answer.<br><i>Hi! I'm Kerem. I'm the class monitor in 6-B. I collect the homework and give it to our teacher. When the teacher isn't in the classroom, I keep the class quiet.</i><br>What does Kerem do?", "He collects the homework.",
          [["He cooks lunch for the students.", "dikkat", "Metinde yemek pişirmekten söz edilmiyor; bu aşçının görevidir."], ["He checks the school gate.", "dikkat", "Kapıyı kontrol etmek güvenlik görevlisinin işidir."], ["He teaches English.", "kavrama", "Kerem bir öğrencidir; ders vermez."]],
          "Metinde “I collect…” cümlesini bul.",
          [
           "🔎 Soruyu anlayalım: Metin Kerem'in sınıf başkanı olduğunu söylüyor.",
           "💡 Hatırlayalım: “I collect the homework and give it to our teacher.” cümlesi görevini anlatıyor.",
           "✏️ Seçenekleri tek tek inceleyelim: “He cooks lunch for the students.” → Metinde yemek pişirmekten söz edilmiyor; bu aşçının görevidir.",
           "✏️ “He checks the school gate.” → Kapıyı kontrol etmek güvenlik görevlisinin işidir.",
           "✅ Sonuç: He collects the homework.",
           "🔁 Kontrol edelim: Son seçenek “He teaches English.” de aradığımız cevap değil: Kerem bir öğrencidir; ders vermez. Geriye yalnızca “He collects the homework.” kalıyor."],
          { kural: "Okuma sorularında cevabı metindeki cümleyle karşılaştır; metinde olmayanı seçme.", dogruNeden: "“I collect the homework and give it to our teacher.” cümlesi görevini anlatıyor." }),
        Q("enrol.roles", "uygulama", 2, "It's ___ job to cook meals for the students.", "the cook's",
          [["the cooks", "dikkat", "Sahiplik için kesme işareti gerekir: the cook's job."], ["the cook", "kavrama", "“job” kime ait? Sahiplik eki 's eksik."], ["the cook is", "kavrama", "Burada fiil değil, sahiplik (… 'nın işi) gerekir."]],
          "“Aşçının işi” derken aşçıya hangi eki ekleriz?",
          [
           "🔎 Soruyu anlayalım: Cümle “Öğrencilere yemek pişirmek ___ işidir.” diyor.",
           "💡 Hatırlayalım: Sahipliği tekil isimde 's ile gösteririz: the cook's.",
           "✏️ Seçenekleri tek tek inceleyelim: “the cooks” → Sahiplik için kesme işareti gerekir: the cook's job.",
           "✏️ “the cook” → “job” kime ait? Sahiplik eki 's eksik.",
           "✅ Sonuç: It's the cook's job to cook meals.",
           "🔁 Kontrol edelim: Son seçenek “the cook is” de aradığımız cevap değil: Burada fiil değil, sahiplik (… 'nın işi) gerekir. Geriye yalnızca “the cook's” kalıyor."],
          { kural: "Sahiplik: isim + 's → the monitor's job, Ali's book.", dogruNeden: "Sahipliği tekil isimde 's ile gösteririz: the cook's." }),
        Q("enrol.roles", "transfer", 2, "— Who is the leader of the science club?<br>— ___", "Ayşe is. She plans our meetings.",
          [["Yes, she is.", "kavrama", "“Who” sorusu evet/hayır ile cevaplanmaz; bir kişi söylenmelidir."], ["It's on Monday.", "kavrama", "Bu cevap “When?” (ne zaman) sorusuna uygundur."], ["In the science lab.", "kavrama", "Bu cevap “Where?” (nerede) sorusuna uygundur."]],
          "Who = kim. Cevapta bir kişi olmalı.",
          [
           "🔎 Soruyu anlayalım: Bilim kulübünün lideri kim?",
           "💡 Hatırlayalım: “Who” sorusuna kişi adıyla cevap veririz.",
           "✏️ Seçenekleri tek tek inceleyelim: “Yes, she is.” → “Who” sorusu evet/hayır ile cevaplanmaz; bir kişi söylenmelidir.",
           "✏️ “It's on Monday.” → Bu cevap “When?” (ne zaman) sorusuna uygundur.",
           "✅ Sonuç: Ayşe is. She plans our meetings.",
           "🔁 Kontrol edelim: Son seçenek “In the science lab.” de aradığımız cevap değil: Bu cevap “Where?” (nerede) sorusuna uygundur. Geriye yalnızca “Ayşe is. She plans our meetings.” kalıyor."],
          { kural: "Who → kişi, When → zaman, Where → yer sorar.", dogruNeden: "“Who” sorusuna kişi adıyla cevap veririz." }),
        Q("enrol.roles", "aciklama", 1, "Which sentence is <b>wrong</b>?", "The cook manages the school.",
          [["The librarian helps us find books.", "bilgi", "Bu cümle doğrudur; kütüphane görevlisi kitap bulmamıza yardım eder."], ["The school nurse looks after sick students.", "bilgi", "Bu cümle doğrudur."], ["The security guard checks the school gate.", "bilgi", "Bu cümle doğrudur."]],
          "Okulu kim yönetir?",
          [
           "🔎 Soruyu anlayalım: Her cümledeki görevi kontrol et.",
           "💡 Hatırlayalım: Okulu yöneten kişi “the headteacher”dır, aşçı değil.",
           "✏️ Seçenekleri tek tek inceleyelim: “The librarian helps us find books.” → Bu cümle doğrudur; kütüphane görevlisi kitap bulmamıza yardım eder.",
           "✏️ “The school nurse looks after sick students.” → Bu cümle doğrudur.",
           "✅ Sonuç: Yanlış cümle: The cook manages the school.",
           "🔁 Kontrol edelim: Son seçenek “The security guard checks the school gate.” de aradığımız cevap değil: Bu cümle doğrudur. Geriye yalnızca “The cook manages the school.” kalıyor."],
          { kural: "manage: yönetmek; okulu headteacher yönetir.", dogruNeden: "Okulu yöneten kişi “the headteacher”dır, aşçı değil." }),
      ],
      "enrol.article": [
        Q("enrol.article", "uygulama", 1, "Choose the correct answer: I have ___ apple.", "an",
          [["a", "kavrama", "“apple” sesli harfle (a) başladığı için “an” kullanılır."], ["the", "kavrama", "İlk kez söz edilen tek bir nesne için a/an kullanılır."], ["–", "bilgi", "Tekil sayılabilen isimlerin önüne a/an gerekir."]],
          "Kelime sesli harfle mi başlıyor?",
          [
           "🔎 Soruyu anlayalım: Boşluktan sonraki kelime “apple”.",
           "💡 Hatırlayalım: “apple” sesli harf sesiyle başlar (a).",
           "✏️ Seçenekleri tek tek inceleyelim: “a” → “apple” sesli harfle (a) başladığı için “an” kullanılır.",
           "✏️ “the” → İlk kez söz edilen tek bir nesne için a/an kullanılır.",
           "✅ Sonuç: Sesli harfle başlayan tekil isimlerden önce “an” gelir: an apple.",
           "🔁 Kontrol edelim: Son seçenek “–” de aradığımız cevap değil: Tekil sayılabilen isimlerin önüne a/an gerekir. Geriye yalnızca “an” kalıyor."],
          { kural: "a + sessiz harf sesi (a book), an + sesli harf sesi (an apple, an hour).", dogruNeden: "“apple” sesli harf sesiyle başlar (a)." }),
        Q("enrol.article", "uygulama", 1, "Look at ___ board, please.", "the",
          [["a", "kavrama", "Sınıftaki tahta herkesin bildiği belirli bir tahtadır; “the” gerekir."], ["an", "kavrama", "“board” sessiz harfle başlar ve burada belirli bir nesnedir."], ["–", "bilgi", "Tekil sayılabilen isim tek başına kullanılmaz."]],
          "Sınıfta herkes hangi tahtadan söz edildiğini biliyor mu?",
          [
           "🔎 Soruyu anlayalım: Öğretmen sınıftaki tahtayı kastediyor.",
           "💡 Hatırlayalım: Herkesin bildiği, belirli şeyler için “the” kullanırız.",
           "✏️ Seçenekleri tek tek inceleyelim: “a” → Sınıftaki tahta herkesin bildiği belirli bir tahtadır; “the” gerekir.",
           "✏️ “an” → “board” sessiz harfle başlar ve burada belirli bir nesnedir.",
           "✅ Sonuç: Look at the board, please.",
           "🔁 Kontrol edelim: Son seçenek “–” de aradığımız cevap değil: Tekil sayılabilen isim tek başına kullanılmaz. Geriye yalnızca “the” kalıyor."],
          { kural: "the: belirli, bilinen ya da tek olan şeyler (the board, the headteacher).", dogruNeden: "Herkesin bildiği, belirli şeyler için “the” kullanırız." }),
        Q("enrol.article", "uygulama", 2, "There is ___ university near our school.", "a",
          [["an", "dikkat", "“university” u harfiyle yazılır ama “yu” sesiyle başlar; bu bir sessiz sestir."], ["the", "kavrama", "Üniversiteden ilk kez söz ediliyor; a/an gerekir."], ["–", "bilgi", "Tekil sayılabilen isimden önce a/an gerekir."]],
          "Harfe değil, ilk sese dikkat et: /yu/niversity.",
          [
           "🔎 Soruyu anlayalım: Kural yazılışa değil, ilk sese bakar.",
           "💡 Hatırlayalım: “university” kelimesi /yu/ sesiyle başlar; bu sessiz bir sestir.",
           "✏️ Seçenekleri tek tek inceleyelim: “an” → “university” u harfiyle yazılır ama “yu” sesiyle başlar; bu bir sessiz sestir.",
           "✏️ “the” → Üniversiteden ilk kez söz ediliyor; a/an gerekir.",
           "✅ Sonuç: Bu yüzden “a university” deriz.",
           "🔁 Kontrol edelim: Son seçenek “–” de aradığımız cevap değil: Tekil sayılabilen isimden önce a/an gerekir. Geriye yalnızca “a” kalıyor."],
          { kural: "a university, a uniform (yu- sesi) — an umbrella (a sesi).", dogruNeden: "“university” kelimesi /yu/ sesiyle başlar; bu sessiz bir sestir." }),
        Q("enrol.article", "uygulama", 2, "The school trip takes ___ hour by bus.", "an",
          [["a", "dikkat", "“hour” kelimesinde h okunmaz; kelime sesli harf sesiyle başlar."], ["the", "kavrama", "Burada belirli bir saat değil, “bir saat” anlatılıyor."], ["–", "bilgi", "“hour” tekil ve sayılabilir; a/an gerekir."]],
          "“hour” nasıl okunur? H harfi duyuluyor mu?",
          [
           "🔎 Soruyu anlayalım: “hour” /aur/ diye okunur; h sessizdir.",
           "💡 Hatırlayalım: İlk ses sesli harf sesidir.",
           "✏️ Seçenekleri tek tek inceleyelim: “a” → “hour” kelimesinde h okunmaz; kelime sesli harf sesiyle başlar.",
           "✏️ “the” → Burada belirli bir saat değil, “bir saat” anlatılıyor.",
           "✅ Sonuç: Bu yüzden “an hour” deriz.",
           "🔁 Kontrol edelim: Son seçenek “–” de aradığımız cevap değil: “hour” tekil ve sayılabilir; a/an gerekir. Geriye yalnızca “an” kalıyor."],
          { kural: "an hour, an honest boy: h okunmazsa an kullanılır.", dogruNeden: "İlk ses sesli harf sesidir." }),
        Q("enrol.article", "aciklama", 2, "Which is correct?", "I have a dog. The dog is very friendly.",
          [["I have the dog. A dog is very friendly.", "kavrama", "İlk söyleyişte a, ikinci söyleyişte the kullanılır; burada tersi yapılmış."], ["I have an dog. The dog is very friendly.", "dikkat", "“dog” sessiz harfle başlar; “an” değil “a” gelir."], ["I have dog. Dog is very friendly.", "bilgi", "Tekil sayılabilen isimler tek başına kullanılmaz."]],
          "İlk kez söylerken ve ikinci kez söylerken hangi tanımlık gelir?",
          [
           "🔎 Soruyu anlayalım: Köpekten ilk kez söz ederken “a dog” deriz.",
           "💡 Hatırlayalım: Aynı köpekten tekrar söz ederken artık belirlidir: “the dog”.",
           "✏️ Seçenekleri tek tek inceleyelim: “I have the dog. A dog is very friendly.” → İlk söyleyişte a, ikinci söyleyişte the kullanılır; burada tersi yapılmış.",
           "✏️ “I have an dog. The dog is very friendly.” → “dog” sessiz harfle başlar; “an” değil “a” gelir.",
           "✅ Sonuç: I have a dog. The dog is very friendly.",
           "🔁 Kontrol edelim: Son seçenek “I have dog. Dog is very friendly.” de aradığımız cevap değil: Tekil sayılabilen isimler tek başına kullanılmaz. Geriye yalnızca “I have a dog. The dog is very friendly.” kalıyor."],
          { kural: "İlk söyleyiş: a/an. Tekrar söyleyiş (artık belli): the.", dogruNeden: "Aynı köpekten tekrar söz ederken artık belirlidir: “the dog”." }),
        Q("enrol.article", "uygulama", 1, "Mr Yılmaz is ___ teacher. He teaches maths.", "a",
          [["an", "kavrama", "“teacher” sessiz harf sesiyle (t) başlar."], ["the", "kavrama", "Bir kişinin mesleğini söylerken a/an kullanırız."], ["–", "bilgi", "İngilizcede meslekten önce a/an gerekir."]],
          "Meslek söylerken tekil isimden önce ne gelir?",
          [
           "🔎 Soruyu anlayalım: Mesleği söylerken a/an kullanırız: He is a teacher.",
           "💡 Hatırlayalım: “teacher” sessiz harf sesiyle başlar.",
           "✏️ Seçenekleri tek tek inceleyelim: “an” → “teacher” sessiz harf sesiyle (t) başlar.",
           "✏️ “the” → Bir kişinin mesleğini söylerken a/an kullanırız.",
           "✅ Sonuç: a.",
           "🔁 Kontrol edelim: Son seçenek “–” de aradığımız cevap değil: İngilizcede meslekten önce a/an gerekir. Geriye yalnızca “a” kalıyor."],
          { kural: "Meslekler: He is a teacher. She is an engineer.", dogruNeden: "“teacher” sessiz harf sesiyle başlar." }),
      ],
      "enrol.rules": [
        Q("enrol.rules", "hatirlama", 1, "Which rule means “Koridorda koşmayın.”?", "Don't run in the corridor.",
          [["Run in the corridor.", "kavrama", "Bu olumlu bir emirdir: “Koridorda koşun.”"], ["Doesn't run in the corridor.", "bilgi", "Emir cümlesinde “doesn't” kullanılmaz."], ["Not run in the corridor.", "bilgi", "Olumsuz emir “Don't” ile başlar."]],
          "Olumsuz emir hangi kelimeyle başlar?",
          [
           "🔎 Soruyu anlayalım: Koşmayın = olumsuz emir.",
           "💡 Hatırlayalım: Olumsuz emir: Don't + fiilin yalın hâli.",
           "✏️ Seçenekleri tek tek inceleyelim: “Run in the corridor.” → Bu olumlu bir emirdir: “Koridorda koşun.”",
           "✏️ “Doesn't run in the corridor.” → Emir cümlesinde “doesn't” kullanılmaz.",
           "✅ Sonuç: Don't run in the corridor.",
           "🔁 Kontrol edelim: Son seçenek “Not run in the corridor.” de aradığımız cevap değil: Olumsuz emir “Don't” ile başlar. Geriye yalnızca “Don't run in the corridor.” kalıyor."],
          { kural: "Olumsuz emir: Don't + fiil (Don't run, Don't shout).", dogruNeden: "Olumsuz emir: Don't + fiilin yalın hâli." }),
        Q("enrol.rules", "uygulama", 1, "___ your hand before you speak.", "Raise",
          [["Raises", "kavrama", "Emir cümlesinde fiil -s almaz."], ["Raising", "kavrama", "Emir cümlesi fiilin yalın hâliyle başlar, -ing almaz."], ["To raise", "bilgi", "Emir cümlesi “to” ile başlamaz."]],
          "Emir cümlesinde fiil hangi hâldedir?",
          [
           "🔎 Soruyu anlayalım: Bu bir sınıf kuralı, yani emir cümlesi.",
           "💡 Hatırlayalım: Emir cümlesi fiilin yalın hâliyle başlar.",
           "✏️ Seçenekleri tek tek inceleyelim: “Raises” → Emir cümlesinde fiil -s almaz.",
           "✏️ “Raising” → Emir cümlesi fiilin yalın hâliyle başlar, -ing almaz.",
           "✅ Sonuç: Raise your hand before you speak.",
           "🔁 Kontrol edelim: Son seçenek “To raise” de aradığımız cevap değil: Emir cümlesi “to” ile başlamaz. Geriye yalnızca “Raise” kalıyor."],
          { kural: "Emir cümlesi: fiilin yalın hâli + … (Raise your hand. Listen carefully.)", dogruNeden: "Emir cümlesi fiilin yalın hâliyle başlar." }),
        Q("enrol.rules", "aciklama", 1, "Look at the class rules. Which one is NOT a good class rule?", "Throw rubbish on the floor.",
          [["Keep the classroom clean.", "kavrama", "Bu iyi bir kuraldır: Sınıfı temiz tut."], ["Listen to your teacher.", "kavrama", "Bu iyi bir kuraldır: Öğretmenini dinle."], ["Be kind to your friends.", "kavrama", "Bu iyi bir kuraldır: Arkadaşlarına nazik ol."]],
          "Hangi davranış sınıfa zarar verir?",
          [
           "🔎 Soruyu anlayalım: Her kuralı Türkçeye çevir.",
           "💡 Hatırlayalım: “Throw rubbish on the floor.” = Çöpleri yere at.",
           "✏️ Seçenekleri tek tek inceleyelim: “Keep the classroom clean.” → Bu iyi bir kuraldır: Sınıfı temiz tut.",
           "✏️ “Listen to your teacher.” → Bu iyi bir kuraldır: Öğretmenini dinle.",
           "✅ Sonuç: Bu iyi bir kural değildir; doğrusu “Don't throw rubbish on the floor.” olmalıdır.",
           "🔁 Kontrol edelim: Son seçenek “Be kind to your friends.” de aradığımız cevap değil: Bu iyi bir kuraldır: Arkadaşlarına nazik ol. Geriye yalnızca “Throw rubbish on the floor.” kalıyor."],
          { gorsel: G.tablo(["✅ Do", "❌ Don't"], [["Listen to your teacher.", "Don't shout."], ["Keep the classroom clean.", "Don't eat during lessons."], ["Be kind to your friends.", "Don't run in the corridor."]]), kural: "Do: yapılması gerekenler; Don't: yapılmaması gerekenler.", dogruNeden: "“Throw rubbish on the floor.” = Çöpleri yere at." }),
        Q("enrol.rules", "uygulama", 1, "The teacher says: “___ talk during the exam!”", "Don't",
          [["Doesn't", "bilgi", "Emir cümlesinde özne olmadığı için “doesn't” kullanılmaz."], ["Not", "bilgi", "Olumsuz emir “Not” ile değil “Don't” ile başlar."], ["No", "kavrama", "“No talking” kullanılabilir ama “No talk” yanlıştır."]],
          "Olumsuz emir kalıbını hatırla.",
          [
           "🔎 Soruyu anlayalım: Öğretmen sınavda konuşmayı yasaklıyor.",
           "💡 Hatırlayalım: Yasak bildiren emir: Don't + fiil.",
           "✏️ Seçenekleri tek tek inceleyelim: “Doesn't” → Emir cümlesinde özne olmadığı için “doesn't” kullanılmaz.",
           "✏️ “Not” → Olumsuz emir “Not” ile değil “Don't” ile başlar.",
           "✅ Sonuç: Don't talk during the exam!",
           "🔁 Kontrol edelim: Son seçenek “No” de aradığımız cevap değil: “No talking” kullanılabilir ama “No talk” yanlıştır. Geriye yalnızca “Don't” kalıyor."],
          { kural: "Don't + fiil = …ma / …me (Don't talk = Konuşma).", dogruNeden: "Yasak bildiren emir: Don't + fiil." }),
        Q("enrol.rules", "uygulama", 2, "This is Mr Kaya, our new teacher. Please, give ___ your homework.", "him",
          [["he", "kavrama", "“he” özne zamiridir; fiilden sonra nesne zamiri “him” gelir."], ["his", "kavrama", "“his” iyelik sıfatıdır (onun …); burada nesne gerekir."], ["her", "dikkat", "Mr Kaya bir erkektir; “her” kadınlar için kullanılır."]],
          "Fiilden (give) sonra hangi zamir gelir?",
          [
           "🔎 Soruyu anlayalım: Mr Kaya bir erkek: he → him.",
           "💡 Hatırlayalım: Fiilden sonra nesne zamiri kullanırız.",
           "✏️ Seçenekleri tek tek inceleyelim: “he” → “he” özne zamiridir; fiilden sonra nesne zamiri “him” gelir.",
           "✏️ “his” → “his” iyelik sıfatıdır (onun …); burada nesne gerekir.",
           "✅ Sonuç: give him your homework.",
           "🔁 Kontrol edelim: Son seçenek “her” de aradığımız cevap değil: Mr Kaya bir erkektir; “her” kadınlar için kullanılır. Geriye yalnızca “him” kalıyor."],
          { kural: "Nesne zamirleri: me, you, him, her, it, us, them (Help him. Listen to me.)", dogruNeden: "Fiilden sonra nesne zamiri kullanırız." }),
        Q("enrol.rules", "uygulama", 2, "The students are noisy. The teacher says: “Be quiet, please. Listen to ___.”", "me",
          [["I", "kavrama", "“I” öznedir; “to” edatından sonra nesne zamiri “me” gelir."], ["my", "kavrama", "“my” iyelik sıfatıdır; kendinden sonra bir isim ister."], ["mine", "kavrama", "“mine” benimki demektir; burada “beni” anlamı gerekir."]],
          "“Beni dinleyin.” cümlesinde “beni” hangi zamirdir?",
          [
           "🔎 Soruyu anlayalım: Öğretmen kendini kastediyor: I → me.",
           "💡 Hatırlayalım: “listen to” kalıbından sonra nesne zamiri gelir.",
           "✏️ Seçenekleri tek tek inceleyelim: “I” → “I” öznedir; “to” edatından sonra nesne zamiri “me” gelir.",
           "✏️ “my” → “my” iyelik sıfatıdır; kendinden sonra bir isim ister.",
           "✅ Sonuç: Listen to me.",
           "🔁 Kontrol edelim: Son seçenek “mine” de aradığımız cevap değil: “mine” benimki demektir; burada “beni” anlamı gerekir. Geriye yalnızca “me” kalıyor."],
          { kural: "I → me, we → us, they → them (nesne olarak).", dogruNeden: "“listen to” kalıbından sonra nesne zamiri gelir." }),
      ],
    },
  });

  /* =========================================================================
   * THEME 1 — 2) SCHOOL ROUTINES
   * ========================================================================= */
  const SIKLIK = [
    { k: 7, ad: "always", tr: "her zaman" }, { k: 6, ad: "usually", tr: "genellikle" }, { k: 5, ad: "usually", tr: "genellikle" },
    { k: 3, ad: "sometimes", tr: "bazen" }, { k: 2, ad: "sometimes", tr: "bazen" }, { k: 0, ad: "never", tr: "asla, hiç" },
  ];
  const GUNLER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const KISILER = [["Elif", "she", "her"], ["Mert", "he", "his"], ["Zeynep", "she", "her"], ["Can", "he", "his"], ["Defne", "she", "her"], ["Emir", "he", "his"]];
  const RUTIN = [
    ["walks to school", "walk to school", "🚶"], ["has breakfast", "have breakfast", "🍳"], ["reads a book", "read a book", "📖"],
    ["eats in the canteen", "eat in the canteen", "🍽️"], ["plays football in the break", "play football in the break", "⚽"], ["does homework", "do homework", "📝"],
  ];

  KONU_EKLE("en", {
    id: "en_routines", tema: "en1", ad: "School Routines", tr: "Okul rutinleri",
    kazanimlar: [
      { id: "enrut.present", ad: "Geniş zaman (simple present) ile okul rutinlerini anlatma" },
      { id: "enrut.freq", ad: "Sıklık zarfları (always, usually, often, sometimes, never) ve yerleri" },
      { id: "enrut.there", ad: "There is / There are ile okulu tanıtma" },
    ],
    sozluk: [
      ["get up", "kalkmak"], ["have breakfast", "kahvaltı yapmak"], ["catch the school bus", "okul servisine yetişmek"], ["arrive at school", "okula varmak"],
      ["line up", "sıraya girmek"], ["national anthem", "İstiklal Marşı, millî marş"], ["bell", "zil"], ["break", "teneffüs"],
      ["lunch break", "öğle arası"], ["timetable", "ders programı"], ["lesson", "ders"], ["playground", "oyun alanı, bahçe"],
      ["canteen", "kantin"], ["go home", "eve gitmek"], ["always", "her zaman"], ["usually", "genellikle"],
      ["often", "sık sık"], ["sometimes", "bazen"], ["never", "asla, hiç"], ["routine", "rutin, alışkanlık"],
    ],
    anlatim: [
      { baslik: "Geniş zaman: her gün yaptıklarımız",
        metin: "Rutinleri, alışkanlıkları ve genel doğruları <b>simple present (geniş zaman)</b> ile anlatırız.<br>I / you / we / they → fiil yalın: <b>We have</b> lunch at 12:10.<br>he / she / it → fiil <b>-s / -es / -ies</b> alır: She <b>gets</b> up, he <b>watches</b>, she <b>goes</b>, he <b>studies</b>. <b>have → has</b>.<br>Olumsuz: <b>don't / doesn't</b> + fiil → He <b>doesn't walk</b> to school.<br>Soru: <b>Do / Does</b> + özne + fiil → <b>Does</b> she <b>take</b> the school bus?",
        ornek: "<b>Our lessons start at 08:30. The bell rings at 10:00 and we have a break.</b>",
        gorsel: G.tablo(["Time", "Routine"], [["08:15", "Students line up in the playground."], ["08:30", "Lessons start."], ["10:00", "Break"], ["12:10", "Lunch break"], ["15:20", "School finishes. We go home."]]),
        durak: { soru: "My brother ___ to school by bus.", secenekler: [["goes", true, "he/she öznesiyle fiil -es alır: go → goes."], ["go", false, "Özne üçüncü tekil kişi (my brother = he); fiil -es almalı."], ["going", false, "Geniş zamanda fiil -ing almaz."], ["is go", false, "Geniş zamanda “is” ile fiil yan yana kullanılmaz."]] } },
      { baslik: "Sıklık zarfları",
        metin: "Bir şeyi ne sıklıkla yaptığımızı sıklık zarflarıyla anlatırız:<br><b>always</b> (her zaman, %100) → <b>usually</b> (genellikle) → <b>often</b> (sık sık) → <b>sometimes</b> (bazen) → <b>never</b> (asla, %0).<br>Yerleri: <b>Ana fiilden önce</b> → I <b>always</b> have breakfast. / She <b>never</b> walks to school.<br><b>am / is / are'den sonra</b> → I am <b>never</b> late for school. / He is <b>usually</b> on time.",
        ornek: "<b>Tom usually plays football in the break, but he is never late for lessons.</b>",
        gorsel: G.tablo(["always", "usually", "often", "sometimes", "never"], [["100%", "≈ 80%", "≈ 60%", "≈ 40%", "0%"]]),
        durak: { soru: "Hangi cümle doğrudur?", secenekler: [["I am never late for school.", true, "Sıklık zarfı “am / is / are”den sonra gelir."], ["I never am late for school.", false, "“be” fiiliyle sıklık zarfı fiilden sonra gelir."], ["Never I am late for school.", false, "Sıklık zarfı cümlenin başına bu şekilde konmaz."], ["I am late never for school.", false, "Zarf “late” kelimesinden sonra gelmez."]] } },
      { baslik: "There is / There are",
        metin: "Bir yerde bir şeyin <b>var olduğunu</b> söylerken kullanırız.<br>Tekil: <b>There is</b> (There's) a library in our school.<br>Çoğul: <b>There are</b> thirty students in my class.<br>Olumsuz: <b>There isn't</b> a pool. / <b>There aren't any</b> lockers.<br>Soru: <b>Is there</b> a canteen? — Yes, there is. / No, there isn't. <b>Are there any</b> computers? — Yes, there are. / No, there aren't.",
        ornek: "<b>There is a big playground and there are two computer labs in our school.</b>",
        durak: { soru: "There ___ twenty-five desks in our classroom.", secenekler: [["are", true, "“desks” çoğuldur; There are kullanılır."], ["is", false, "“is” tekil isimlerle kullanılır."], ["am", false, "“am” yalnızca “I” ile kullanılır."], ["be", false, "Cümlede fiilin çekimli hâli (are) gerekir."]] } },
    ],
    uret: {
      "enrut.present": [
        Q("enrut.present", "uygulama", 1, "Mert ___ to school by bus every day.", "goes",
          [["go", "kavrama", "Özne “Mert” (he); geniş zamanda fiil -es almalı."], ["going", "bilgi", "Geniş zamanda fiil -ing almaz."], ["is go", "bilgi", "“is” ve fiilin yalın hâli birlikte kullanılmaz."]],
          "Özne üçüncü tekil kişi mi?",
          [
           "🔎 Soruyu anlayalım: “every day” rutin anlatır → geniş zaman.",
           "💡 Hatırlayalım: Özne Mert = he; fiil -s/-es alır.",
           "✏️ Seçenekleri tek tek inceleyelim: “go” → Özne “Mert” (he); geniş zamanda fiil -es almalı.",
           "✏️ “going” → Geniş zamanda fiil -ing almaz.",
           "✅ Sonuç: go → goes: Mert goes to school by bus every day.",
           "🔁 Kontrol edelim: Son seçenek “is go” de aradığımız cevap değil: “is” ve fiilin yalın hâli birlikte kullanılmaz. Geriye yalnızca “goes” kalıyor."],
          { kural: "he / she / it + fiil-s: goes, watches, has, studies.", dogruNeden: "Özne Mert = he; fiil -s/-es alır." }),
        Q("enrut.present", "uygulama", 1, "My friends and I ___ lunch in the canteen.", "have",
          [["has", "kavrama", "Özne “my friends and I” = we; fiil -s almaz."], ["having", "bilgi", "Geniş zamanda -ing kullanılmaz."], ["haves", "dikkat", "“have” fiili he/she ile “has” olur; “haves” diye bir biçim yoktur."]],
          "“My friends and I” hangi zamire eşittir?",
          [
           "🔎 Soruyu anlayalım: My friends and I = we.",
           "💡 Hatırlayalım: we öznesiyle fiil yalın hâlde kalır.",
           "✏️ Seçenekleri tek tek inceleyelim: “has” → Özne “my friends and I” = we; fiil -s almaz.",
           "✏️ “having” → Geniş zamanda -ing kullanılmaz.",
           "✅ Sonuç: have.",
           "🔁 Kontrol edelim: Son seçenek “haves” de aradığımız cevap değil: “have” fiili he/she ile “has” olur; “haves” diye bir biçim yoktur. Geriye yalnızca “have” kalıyor."],
          { kural: "I / you / we / they + fiilin yalın hâli.", dogruNeden: "we öznesiyle fiil yalın hâlde kalır." }),
        Q("enrut.present", "uygulama", 2, "___ your sister walk to school?", "Does",
          [["Do", "kavrama", "“your sister” = she; soru “Does” ile kurulur."], ["Is", "kavrama", "Cümlede ana fiil (walk) var; geniş zaman sorusu Do/Does ile kurulur."], ["Are", "kavrama", "“Are” çoğul ya da “you” ile kullanılır ve ana fiille kullanılmaz."]],
          "Ana fiil var mı? Özne kim?",
          [
           "🔎 Soruyu anlayalım: Ana fiil “walk”, yani geniş zaman sorusu.",
           "💡 Hatırlayalım: Özne your sister = she.",
           "✏️ Seçenekleri tek tek inceleyelim: “Do” → “your sister” = she; soru “Does” ile kurulur.",
           "✏️ “Is” → Cümlede ana fiil (walk) var; geniş zaman sorusu Do/Does ile kurulur.",
           "✅ Sonuç: she için soru: Does she walk…? → Does your sister walk to school?",
           "🔁 Kontrol edelim: Son seçenek “Are” de aradığımız cevap değil: “Are” çoğul ya da “you” ile kullanılır ve ana fiille kullanılmaz. Geriye yalnızca “Does” kalıyor."],
          { kural: "Soru: Do (I/you/we/they) / Does (he/she/it) + özne + fiil?", dogruNeden: "Özne your sister = she." }),
        Q("enrut.present", "uygulama", 2, "Elif ___ eat in the canteen. She brings her lunch from home.", "doesn't",
          [["don't", "kavrama", "Elif = she; olumsuzda “doesn't” kullanılır."], ["isn't", "kavrama", "Ana fiil (eat) varken “isn't” kullanılmaz."], ["not", "bilgi", "Olumsuz geniş zaman yardımcı fiil ister: doesn't."]],
          "Olumsuz cümlede he/she ile hangi yardımcı fiil gelir?",
          [
           "🔎 Soruyu anlayalım: Elif = she.",
           "💡 Hatırlayalım: Geniş zaman olumsuz: she doesn't + fiilin yalın hâli.",
           "✏️ Seçenekleri tek tek inceleyelim: “don't” → Elif = she; olumsuzda “doesn't” kullanılır.",
           "✏️ “isn't” → Ana fiil (eat) varken “isn't” kullanılmaz.",
           "✅ Sonuç: Elif doesn't eat in the canteen.",
           "🔁 Kontrol edelim: Son seçenek “not” de aradığımız cevap değil: Olumsuz geniş zaman yardımcı fiil ister: doesn't. Geriye yalnızca “doesn't” kalıyor."],
          { kural: "Olumsuz: don't (I/you/we/they), doesn't (he/she/it) + fiil.", dogruNeden: "Geniş zaman olumsuz: she doesn't + fiilin yalın hâli." }),
        Q("enrut.present", "uygulama", 1, "Look at the timetable. When does the lunch break start?", "At 12:10.",
          [["At 10:00.", "dikkat", "10:00 teneffüs (break) saatidir."], ["At 08:30.", "dikkat", "08:30 derslerin başladığı saattir."], ["At 15:20.", "dikkat", "15:20 okulun bittiği saattir."]],
          "Tabloda “Lunch break” satırını bul.",
          [
           "🔎 Soruyu anlayalım: Tabloda her saatin karşısında bir rutin var.",
           "💡 Hatırlayalım: “Lunch break” satırındaki saat 12:10.",
           "✏️ Seçenekleri tek tek inceleyelim: “At 10:00.” → 10:00 teneffüs (break) saatidir.",
           "✏️ “At 08:30.” → 08:30 derslerin başladığı saattir.",
           "✅ Sonuç: At 12:10.",
           "🔁 Kontrol edelim: Son seçenek “At 15:20.” de aradığımız cevap değil: 15:20 okulun bittiği saattir. Geriye yalnızca “At 12:10.” kalıyor."],
          { gorsel: G.tablo(["Time", "Routine"], [["08:30", "Lessons start"], ["10:00", "Break"], ["12:10", "Lunch break"], ["15:20", "School finishes"]]), kural: "Saat söylerken “at” kullanılır: at 12:10, at 8 o'clock.", dogruNeden: "“Lunch break” satırındaki saat 12:10." }),
        Q("enrut.present", "aciklama", 2, "Which sentence is correct?", "He studies English after school.",
          [["He study English after school.", "kavrama", "he öznesiyle fiil -s almalı."], ["He studys English after school.", "dikkat", "Sessiz harf + y ile biten fiillerde y düşer, -ies gelir: studies."], ["He is studies English after school.", "bilgi", "“is” ile geniş zaman fiili birlikte kullanılmaz."]],
          "study fiili he öznesiyle nasıl yazılır?",
          [
           "🔎 Soruyu anlayalım: Özne he; fiil -s almalı.",
           "💡 Hatırlayalım: study sessiz harf + y ile biter: y düşer, -ies eklenir.",
           "✏️ Seçenekleri tek tek inceleyelim: “He study English after school.” → he öznesiyle fiil -s almalı.",
           "✏️ “He studys English after school.” → Sessiz harf + y ile biten fiillerde y düşer, -ies gelir: studies.",
           "✅ Sonuç: He studies English after school.",
           "🔁 Kontrol edelim: Son seçenek “He is studies English after school.” de aradığımız cevap değil: “is” ile geniş zaman fiili birlikte kullanılmaz. Geriye yalnızca “He studies English after school.” kalıyor."],
          { kural: "study → studies, carry → carries; ama play → plays (sesli harf + y).", dogruNeden: "study sessiz harf + y ile biter: y düşer, -ies eklenir." }),
      ],
      "enrut.freq": [
        z => {
          const [ad, zamir] = sec(KISILER), [r3, rYalin, emo] = sec(RUTIN), f = sec(SIKLIK);
          const gunler = karistir(GUNLER.map((g, i) => i)).slice(0, f.k);
          const satir = GUNLER.map((g, i) => gunler.includes(i) ? "✔️" : "–");
          const diger = ["always", "usually", "sometimes", "never"].filter(x => x !== f.ad);
          return S(zengin({
            kaz: "enrut.freq", duzey: "uygulama", zorluk: 2,
            soru: `${emo} Look at the table. Complete the sentence:<br><b>${ad} ___ ${r3}.</b>`,
            gorsel: G.tablo(GUNLER, [satir]),
            dogru: f.ad,
            yanlis: diger.map(x => [x, "dikkat", `Tabloda ${f.k} gün işaretli; bu sıklık “${x}” ile anlatılmaz.`]),
            ipucu: "Haftada kaç gün işaretli? 7 gün → always, hiç → never.",
            cozum: [`Tabloda ${f.k} gün işaretlenmiş.`, "7/7 → always, 5–6 → usually, 2–3 → sometimes, 0 → never.", `Bu yüzden: ${ad} ${f.ad} ${r3}.`],
            kural: "always (%100) – usually – often – sometimes – never (%0).",
          }));
        },
        Q("enrut.freq", "hatirlama", 1, "“usually” ne demektir?", "genellikle",
          [["her zaman", "bilgi", "her zaman = always."], ["bazen", "bilgi", "bazen = sometimes."], ["asla", "bilgi", "asla = never."]],
          "Sıklık sırası: always – usually – often – sometimes – never.",
          [
           "🔎 Soruyu anlayalım: usually, always'tan sonra gelen yüksek bir sıklıktır.",
           "💡 Hatırlayalım: Türkçede “genellikle” anlamına gelir.",
           "✏️ Seçenekleri tek tek inceleyelim: “her zaman” → her zaman = always.",
           "✏️ “bazen” → bazen = sometimes.",
           "✅ Sonuç: genellikle.",
           "🔁 Kontrol edelim: Son seçenek “asla” de aradığımız cevap değil: asla = never. Geriye yalnızca “genellikle” kalıyor."],
          { kural: "usually = genellikle, often = sık sık, sometimes = bazen.", dogruNeden: "Türkçede “genellikle” anlamına gelir." }),
        Q("enrut.freq", "uygulama", 2, "Which is the correct order? <b>always / Tom / breakfast / has</b>", "Tom always has breakfast.",
          [["Tom has always breakfast.", "kavrama", "Sıklık zarfı ana fiilden (has) önce gelir."], ["Always Tom has breakfast.", "kavrama", "Sıklık zarfı özneden önce değil, ana fiilden önce gelir."], ["Tom has breakfast always.", "kavrama", "“always” cümlenin sonuna konmaz; ana fiilden önce gelir."]],
          "Ana fiil hangisi? Zarf onun neresine gelir?",
          [
           "🔎 Soruyu anlayalım: Özne: Tom, ana fiil: has.",
           "💡 Hatırlayalım: Sıklık zarfı ana fiilden önce gelir.",
           "✏️ Seçenekleri tek tek inceleyelim: “Tom has always breakfast.” → Sıklık zarfı ana fiilden (has) önce gelir.",
           "✏️ “Always Tom has breakfast.” → Sıklık zarfı özneden önce değil, ana fiilden önce gelir.",
           "✅ Sonuç: Tom always has breakfast.",
           "🔁 Kontrol edelim: Son seçenek “Tom has breakfast always.” de aradığımız cevap değil: “always” cümlenin sonuna konmaz; ana fiilden önce gelir. Geriye yalnızca “Tom always has breakfast.” kalıyor."],
          { kural: "Özne + sıklık zarfı + ana fiil (Tom always has…).", dogruNeden: "Sıklık zarfı ana fiilden önce gelir." }),
        Q("enrut.freq", "uygulama", 2, "Which sentence is correct?", "She is usually on time.",
          [["She usually is on time.", "kavrama", "“be” fiiliyle sıklık zarfı fiilden sonra gelir: is usually."], ["Usually she on time is.", "kavrama", "Kelime sırası bozulmuş."], ["She is on time usually always.", "dikkat", "İki sıklık zarfı birlikte kullanılmaz ve sıra yanlıştır."]],
          "Cümlede “is” var. Zarf ondan önce mi, sonra mı?",
          [
           "🔎 Soruyu anlayalım: Cümlenin fiili “is” (be fiili).",
           "💡 Hatırlayalım: be fiiliyle sıklık zarfı fiilden sonra gelir.",
           "✏️ Seçenekleri tek tek inceleyelim: “She usually is on time.” → “be” fiiliyle sıklık zarfı fiilden sonra gelir: is usually.",
           "✏️ “Usually she on time is.” → Kelime sırası bozulmuş.",
           "✅ Sonuç: She is usually on time.",
           "🔁 Kontrol edelim: Son seçenek “She is on time usually always.” de aradığımız cevap değil: İki sıklık zarfı birlikte kullanılmaz ve sıra yanlıştır. Geriye yalnızca “She is usually on time.” kalıyor."],
          { kural: "am / is / are + sıklık zarfı (He is never late.)", dogruNeden: "be fiiliyle sıklık zarfı fiilden sonra gelir." }),
        Q("enrut.freq", "transfer", 1, "Selin brushes her teeth every morning and every evening. She ___ forgets it.", "never",
          [["always", "kavrama", "Selin dişlerini her gün fırçalıyor; unutmayı “her zaman” yapmaz."], ["usually", "kavrama", "Selin hiç aksatmıyor; “genellikle unutur” yanlış olur."], ["sometimes", "kavrama", "Metne göre Selin hiç unutmuyor; “bazen unutur” yanlış olur."]],
          "Selin dişlerini her gün fırçalıyorsa ne sıklıkla unutur?",
          [
           "🔎 Soruyu anlayalım: Selin dişlerini her sabah ve her akşam fırçalıyor.",
           "💡 Hatırlayalım: Yani fırçalamayı hiç unutmuyor.",
           "✏️ Seçenekleri tek tek inceleyelim: “always” → Selin dişlerini her gün fırçalıyor; unutmayı “her zaman” yapmaz.",
           "✏️ “usually” → Selin hiç aksatmıyor; “genellikle unutur” yanlış olur.",
           "✅ Sonuç: hiç = never: She never forgets it.",
           "🔁 Kontrol edelim: Son seçenek “sometimes” de aradığımız cevap değil: Metne göre Selin hiç unutmuyor; “bazen unutur” yanlış olur. Geriye yalnızca “never” kalıyor."],
          { kural: "never = hiç, asla (%0).", dogruNeden: "Yani fırçalamayı hiç unutmuyor." }),
      ],
      "enrut.there": [
        Q("enrut.there", "uygulama", 1, "There ___ a big library in our school.", "is",
          [["are", "kavrama", "“a big library” tekildir; There is kullanılır."], ["am", "bilgi", "“am” yalnızca “I” ile kullanılır."], ["be", "bilgi", "Fiilin çekimli hâli (is) gerekir."]],
          "a library tekil mi, çoğul mu?",
          [
           "🔎 Soruyu anlayalım: “a library” tekildir.",
           "💡 Hatırlayalım: Tekil isimle “There is” kullanılır.",
           "✏️ Seçenekleri tek tek inceleyelim: “are” → “a big library” tekildir; There is kullanılır.",
           "✏️ “am” → “am” yalnızca “I” ile kullanılır.",
           "✅ Sonuç: There is a big library in our school.",
           "🔁 Kontrol edelim: Son seçenek “be” de aradığımız cevap değil: Fiilin çekimli hâli (is) gerekir. Geriye yalnızca “is” kalıyor."],
          { kural: "There is + tekil, There are + çoğul.", dogruNeden: "Tekil isimle “There is” kullanılır." }),
        Q("enrut.there", "uygulama", 1, "There ___ thirty students in my class.", "are",
          [["is", "kavrama", "“thirty students” çoğuldur; There are kullanılır."], ["isn't", "kavrama", "Hem olumsuz hem tekil biçimdir; anlam ve sayı uymaz."], ["am", "bilgi", "“am” yalnızca “I” ile kullanılır."]],
          "students kelimesinin sonundaki -s ne anlatıyor?",
          [
           "🔎 Soruyu anlayalım: “students” çoğuldur.",
           "💡 Hatırlayalım: Çoğul isimlerle “There are” kullanılır.",
           "✏️ Seçenekleri tek tek inceleyelim: “is” → “thirty students” çoğuldur; There are kullanılır.",
           "✏️ “isn't” → Hem olumsuz hem tekil biçimdir; anlam ve sayı uymaz.",
           "✅ Sonuç: There are thirty students in my class.",
           "🔁 Kontrol edelim: Son seçenek “am” de aradığımız cevap değil: “am” yalnızca “I” ile kullanılır. Geriye yalnızca “are” kalıyor."],
          { kural: "There are + çoğul isim (There are two labs.)", dogruNeden: "Çoğul isimlerle “There are” kullanılır." }),
        Q("enrut.there", "uygulama", 2, "— ___ there a canteen in your school?<br>— Yes, there is.", "Is",
          [["Are", "kavrama", "“a canteen” tekildir; “Is there…?” sorulur."], ["Does", "bilgi", "There is/are soruları Do/Does ile kurulmaz."], ["Do", "bilgi", "There is/are soruları Do/Does ile kurulmaz."]],
          "Cevaba bak: “Yes, there is.”",
          [
           "🔎 Soruyu anlayalım: Soru tekil bir şey hakkında: a canteen.",
           "💡 Hatırlayalım: There is cümlesinin sorusu: Is there…?",
           "✏️ Seçenekleri tek tek inceleyelim: “Are” → “a canteen” tekildir; “Is there…?” sorulur.",
           "✏️ “Does” → There is/are soruları Do/Does ile kurulmaz.",
           "✅ Sonuç: Is there a canteen in your school?",
           "🔁 Kontrol edelim: Son seçenek “Do” de aradığımız cevap değil: There is/are soruları Do/Does ile kurulmaz. Geriye yalnızca “Is” kalıyor."],
          { kural: "Is there a …? / Are there any …?", dogruNeden: "There is cümlesinin sorusu: Is there…?" }),
        Q("enrut.there", "uygulama", 2, "Look at the table. Which sentence is true?", "There are two computer labs.",
          [["There is two computer labs.", "dikkat", "Sayı doğru ama “two labs” çoğuldur; “There are” gerekir."], ["There are twelve science labs.", "dikkat", "Tabloda bir tane fen laboratuvarı var; 12 sınıf sayısıdır."], ["There isn't a gym.", "dikkat", "Tabloda bir spor salonu var."]],
          "Tablodaki sayıları cümlelerle karşılaştır; tekil–çoğul uyumuna da bak.",
          [
           "🔎 Soruyu anlayalım: Tabloya göre: 12 classrooms, 1 science lab, 2 computer labs, 1 gym.",
           "💡 Hatırlayalım: İki laboratuvar çoğuldur: There are two computer labs.",
           "✏️ Diğer cümleler ya sayı ya da dil bilgisi bakımından yanlış.",
           "✏️ Seçenekleri tek tek inceleyelim: “There is two computer labs.” → Sayı doğru ama “two labs” çoğuldur; “There are” gerekir.",
           "✏️ “There are twelve science labs.” → Tabloda bir tane fen laboratuvarı var; 12 sınıf sayısıdır.",
           "✅ Sonuç: Doğru cevap “There are two computer labs.”.",
           "🔁 Kontrol edelim: Son seçenek “There isn't a gym.” de aradığımız cevap değil: Tabloda bir spor salonu var. Geriye yalnızca “There are two computer labs.” kalıyor."],
          { gorsel: G.tablo(["Our school", "How many?"], [["classrooms", "12"], ["science lab", "1"], ["computer labs", "2"], ["gym", "1"]]), kural: "There is one…, There are two/three…", dogruNeden: "İki laboratuvar çoğuldur: There are two computer labs." }),
        Q("enrut.there", "transfer", 2, "— Are there any lockers in your classroom?<br>— ___", "No, there aren't.",
          [["No, there isn't.", "kavrama", "Soru “Are there…?” ile çoğul sorulmuş; kısa cevap “there aren't” olmalı."], ["No, they aren't.", "kavrama", "“There are” sorusuna “there” ile cevap verilir, “they” ile değil."], ["Yes, there is.", "kavrama", "Çoğul soruya tekil kısa cevap verilmez."]],
          "Kısa cevap soruyla aynı yapıda olmalı.",
          [
           "🔎 Soruyu anlayalım: Are there any lockers…? (çoğul)",
           "💡 Hatırlayalım: Olumsuz kısa cevap: No, there aren't.",
           "✏️ Olumlu olsaydı: Yes, there are.",
           "✏️ Seçenekleri tek tek inceleyelim: “No, there isn't.” → Soru “Are there…?” ile çoğul sorulmuş; kısa cevap “there aren't” olmalı.",
           "✏️ “No, they aren't.” → “There are” sorusuna “there” ile cevap verilir, “they” ile değil.",
           "✅ Sonuç: Doğru cevap “No, there aren't.”.",
           "🔁 Kontrol edelim: Son seçenek “Yes, there is.” de aradığımız cevap değil: Çoğul soruya tekil kısa cevap verilmez. Geriye yalnızca “No, there aren't.” kalıyor."],
          { kural: "Are there…? → Yes, there are. / No, there aren't.", dogruNeden: "Olumsuz kısa cevap: No, there aren't." }),
        Q("enrut.there", "uygulama", 2, "There ___ any computers in our classroom, but there is a smart board.", "aren't",
          [["isn't", "kavrama", "“computers” çoğuldur; olumsuzu “aren't”tır."], ["are", "kavrama", "“any” olumsuz cümlede kullanılır ve “but” zıtlık gösterir; olumsuz olmalı."], ["not", "bilgi", "“There not” diye bir yapı yoktur."]],
          "“any” ve “but” kelimeleri cümlenin olumsuz olduğunu gösteriyor.",
          [
           "🔎 Soruyu anlayalım: “computers” çoğul, cümle olumsuz.",
           "💡 Hatırlayalım: Çoğul olumsuz: There aren't any…",
           "✏️ Seçenekleri tek tek inceleyelim: “isn't” → “computers” çoğuldur; olumsuzu “aren't”tır.",
           "✏️ “are” → “any” olumsuz cümlede kullanılır ve “but” zıtlık gösterir; olumsuz olmalı.",
           "✅ Sonuç: There aren't any computers in our classroom.",
           "🔁 Kontrol edelim: Son seçenek “not” de aradığımız cevap değil: “There not” diye bir yapı yoktur. Geriye yalnızca “aren't” kalıyor."],
          { kural: "There isn't a… / There aren't any…", dogruNeden: "Çoğul olumsuz: There aren't any…" }),
      ],
    },
  });

  /* =========================================================================
   * THEME 1 — 3) NATIONAL DAYS AND CELEBRATIONS
   * ========================================================================= */
  const MILLI = [
    { ad: "Republic Day", gun: 29, ay: 9 },
    { ad: "National Sovereignty and Children's Day", gun: 23, ay: 3 },
    { ad: "Commemoration of Atatürk, Youth and Sports Day", gun: 19, ay: 4 },
    { ad: "Victory Day", gun: 30, ay: 7 },
    { ad: "Teachers' Day", gun: 24, ay: 10 },
  ];

  KONU_EKLE("en", {
    id: "en_national", tema: "en1", ad: "National Days and Celebrations", tr: "Millî günler ve kutlamalar",
    kazanimlar: [
      { id: "ennat.days", ad: "Millî günleri ve tarihlerini tanıma" },
      { id: "ennat.wh", ad: "Wh- soruları (who, when, what, where) sorma ve cevaplama" },
      { id: "ennat.celebrate", ad: "Kutlama etkinliklerini anlatma (ceremony, flag, parade…)" },
    ],
    sozluk: [
      ["national day", "millî gün"], ["celebration", "kutlama"], ["celebrate", "kutlamak"], ["Republic Day", "Cumhuriyet Bayramı"],
      ["Victory Day", "Zafer Bayramı"], ["Teachers' Day", "Öğretmenler Günü"], ["sovereignty", "egemenlik"], ["independence", "bağımsızlık"],
      ["ceremony", "tören"], ["flag", "bayrak"], ["national anthem", "İstiklal Marşı, millî marş"], ["parade", "geçit töreni"],
      ["poem", "şiir"], ["recite a poem", "şiir okumak"], ["costume", "kostüm"], ["folk dance", "halk oyunu"],
      ["wave", "sallamak"], ["decorate", "süslemek"], ["fireworks", "havai fişek"], ["youth", "gençlik"],
    ],
    anlatim: [
      { baslik: "Millî günlerimiz",
        metin: "Türkiye'de her yıl kutladığımız önemli günler vardır. Tarih söylerken <b>on</b> kullanırız ve günü <b>sıra sayısıyla</b> okuruz: <b>on 29th October</b> → “on the twenty-ninth of October”.<br><b>23rd April</b> – National Sovereignty and Children's Day (Ulusal Egemenlik ve Çocuk Bayramı)<br><b>19th May</b> – Commemoration of Atatürk, Youth and Sports Day (Atatürk'ü Anma, Gençlik ve Spor Bayramı)<br><b>30th August</b> – Victory Day (Zafer Bayramı)<br><b>29th October</b> – Republic Day (Cumhuriyet Bayramı)<br><b>24th November</b> – Teachers' Day (Öğretmenler Günü)",
        ornek: "<b>We celebrate Republic Day on 29th October.</b> (Cumhuriyet Bayramı'nı 29 Ekim'de kutlarız.)",
        gorsel: G.tablo(["Date", "National day"], MILLI.slice().sort((a, b) => a.ay - b.ay).map(m => [siraKisa(m.gun) + " " + AYLAR[m.ay], m.ad])),
        durak: { soru: "When do we celebrate Victory Day?", secenekler: [["On 30th August.", true, "Zafer Bayramı 30 Ağustos'ta kutlanır."], ["On 29th October.", false, "29 Ekim Cumhuriyet Bayramı'dır."], ["On 23rd April.", false, "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı'dır."], ["On 24th November.", false, "24 Kasım Öğretmenler Günü'dür."]] } },
      { baslik: "Wh- soruları",
        metin: "Bilgi almak için soru kelimeleriyle başlarız:<br><b>Who</b> (kim) → Who reads the poem? — <b>Zeynep</b> does.<br><b>When</b> (ne zaman) → When is Teachers' Day? — <b>On 24th November.</b><br><b>What</b> (ne) → What do you do on 23rd April? — <b>We sing songs.</b><br><b>Where</b> (nerede) → Where is the ceremony? — <b>In the school garden.</b><br>Geniş zamanda: Wh- + <b>do / does</b> + özne + fiil?",
        ornek: "<b>— Where do people watch the parade? — In the city square.</b>",
        durak: { soru: "— ___ is the ceremony? — It's at 10 o'clock.", secenekler: [["When", true, "Cevap bir saat; zaman sorusu “When” ile sorulur."], ["Where", false, "Where yer sorar; cevap bir yer olmalıydı."], ["Who", false, "Who kişi sorar."], ["What", false, "What bir şeyi/olayı sorar; saat için When kullanılır."]] } },
      { baslik: "Kutlamalarda neler yaparız?",
        metin: "Millî günlerde yaptıklarımızı geniş zamanla anlatırız:<br>We <b>sing the national anthem</b>. (İstiklal Marşı'nı söyleriz.)<br>Students <b>recite poems</b>. (Öğrenciler şiir okur.)<br>People <b>wave flags</b>. (İnsanlar bayrak sallar.)<br>We <b>decorate</b> our classroom with flags. (Sınıfı bayraklarla süsleriz.)<br>Children <b>wear costumes</b> and <b>perform folk dances</b>.<br>In the evening, there are <b>fireworks</b> and a <b>parade</b>.",
        ornek: "<b>On 23rd April, children from different countries come to Türkiye and we celebrate together.</b>",
        durak: { soru: "“wave flags” ne demektir?", secenekler: [["bayrak sallamak", true, "wave = sallamak, flag = bayrak."], ["bayrak asmak", false, "Bayrak asmak “hang flags” demektir."], ["bayrak çizmek", false, "Çizmek “draw” demektir."], ["bayrak satın almak", false, "Satın almak “buy” demektir."]] } },
    ],
    uret: {
      "ennat.days": [
        z => {
          const m = sec(MILLI), diger = MILLI.filter(x => x !== m);
          return S(zengin({
            kaz: "ennat.days", duzey: "hatirlama", zorluk: 1,
            soru: `When do we celebrate <b>${m.ad}</b> in Türkiye?`,
            dogru: `On ${siraKisa(m.gun)} ${AYLAR[m.ay]}.`,
            yanlis: diger.map(x => [`On ${siraKisa(x.gun)} ${AYLAR[x.ay]}.`, "bilgi", `Bu tarih ${x.ad} içindir.`]),
            ipucu: "Millî günler tablosunu hatırla.",
            cozum: [`${m.ad} her yıl aynı gün kutlanır.`, `Bu gün ${siraKisa(m.gun)} ${AYLAR[m.ay]} tarihidir.`, "Tarihten önce “on” kullanırız: On " + siraKisa(m.gun) + " " + AYLAR[m.ay] + "."],
            kural: "Tarihlerde “on” kullanılır: on 29th October, on 23rd April.",
          }));
        },
        Q("ennat.days", "hatirlama", 1, "23rd April is ___ .", "National Sovereignty and Children's Day",
          [["Republic Day", "bilgi", "Cumhuriyet Bayramı 29 Ekim'dedir."], ["Teachers' Day", "bilgi", "Öğretmenler Günü 24 Kasım'dadır."], ["Victory Day", "bilgi", "Zafer Bayramı 30 Ağustos'tadır."]],
          "Bu bayram tüm dünya çocuklarına armağan edilmiştir.",
          [
           "🔎 Soruyu anlayalım: 23 Nisan, TBMM'nin açıldığı gündür.",
           "💡 Hatırlayalım: Atatürk bu günü çocuklara armağan etmiştir.",
           "✏️ Seçenekleri tek tek inceleyelim: “Republic Day” → Cumhuriyet Bayramı 29 Ekim'dedir.",
           "✏️ “Teachers' Day” → Öğretmenler Günü 24 Kasım'dadır.",
           "✅ Sonuç: İngilizcesi: National Sovereignty and Children's Day.",
           "🔁 Kontrol edelim: Son seçenek “Victory Day” de aradığımız cevap değil: Zafer Bayramı 30 Ağustos'tadır. Geriye yalnızca “National Sovereignty and Children's Day” kalıyor."],
          { kural: "sovereignty = egemenlik; children = çocuklar.", dogruNeden: "Atatürk bu günü çocuklara armağan etmiştir." }),
        Q("ennat.days", "aciklama", 1, "We give flowers and cards to our teachers on 24th November. What is the name of this day?", "Teachers' Day",
          [["Victory Day", "bilgi", "Victory Day 30 Ağustos'tur."], ["Republic Day", "bilgi", "Republic Day 29 Ekim'dir."], ["Children's Day", "kavrama", "Çocuk Bayramı 23 Nisan'dır; öğretmenlerle ilgili değildir."]],
          "Çiçek ve kartları kime veriyoruz?",
          [
           "🔎 Soruyu anlayalım: Cümlede öğretmenlere çiçek ve kart verildiği söyleniyor.",
           "💡 Hatırlayalım: 24 Kasım Öğretmenler Günü'dür.",
           "✏️ Seçenekleri tek tek inceleyelim: “Victory Day” → Victory Day 30 Ağustos'tur.",
           "✏️ “Republic Day” → Republic Day 29 Ekim'dir.",
           "✅ Sonuç: Teachers' Day.",
           "🔁 Kontrol edelim: Son seçenek “Children's Day” de aradığımız cevap değil: Çocuk Bayramı 23 Nisan'dır; öğretmenlerle ilgili değildir. Geriye yalnızca “Teachers' Day” kalıyor."],
          { kural: "24th November: Teachers' Day (Öğretmenler Günü).", dogruNeden: "24 Kasım Öğretmenler Günü'dür." }),
        Q("ennat.days", "uygulama", 2, "Look at the calendar. Which national day is in August?", "Victory Day",
          [["Republic Day", "dikkat", "Republic Day ekim (October) ayındadır."], ["Teachers' Day", "dikkat", "Teachers' Day kasım (November) ayındadır."], ["Children's Day", "dikkat", "Children's Day nisan (April) ayındadır."]],
          "August = Ağustos. Tabloda August satırını bul.",
          [
           "🔎 Soruyu anlayalım: Tablodaki ayları Türkçeye çevir.",
           "💡 Hatırlayalım: August = Ağustos; bu satırda 30th August yazıyor.",
           "✏️ Seçenekleri tek tek inceleyelim: “Republic Day” → Republic Day ekim (October) ayındadır.",
           "✏️ “Teachers' Day” → Teachers' Day kasım (November) ayındadır.",
           "✅ Sonuç: 30 Ağustos: Victory Day.",
           "🔁 Kontrol edelim: Son seçenek “Children's Day” de aradığımız cevap değil: Children's Day nisan (April) ayındadır. Geriye yalnızca “Victory Day” kalıyor."],
          { gorsel: G.tablo(["Month", "Day", "Celebration"], [["April", "23rd", "Children's Day"], ["August", "30th", "Victory Day"], ["October", "29th", "Republic Day"], ["November", "24th", "Teachers' Day"]]), kural: "Ay adları büyük harfle başlar: April, August, October.", dogruNeden: "August = Ağustos; bu satırda 30th August yazıyor." }),
        Q("ennat.days", "uygulama", 2, "Which is the correct order from January to December?", "23rd April – 19th May – 30th August – 29th October",
          [["19th May – 23rd April – 30th August – 29th October", "dikkat", "Nisan (April) mayıstan (May) önce gelir."], ["23rd April – 30th August – 19th May – 29th October", "dikkat", "Mayıs (May) ağustostan (August) önce gelir."], ["29th October – 30th August – 19th May – 23rd April", "strateji", "Bu sıralama aralıktan ocağa doğru, yani tersten yapılmış."]],
          "Ayların sırası: January, February, March, April, May, June, July, August…",
          [
           "🔎 Soruyu anlayalım: Ayları sırala: April (4), May (5), August (8), October (10).",
           "💡 Hatırlayalım: Yılın başından sonuna doğru sıralıyoruz.",
           "✏️ Seçenekleri tek tek inceleyelim: “19th May – 23rd April – 30th August – 29th October” → Nisan (April) mayıstan (May) önce gelir.",
           "✏️ “23rd April – 30th August – 19th May – 29th October” → Mayıs (May) ağustostan (August) önce gelir.",
           "✅ Sonuç: 23rd April – 19th May – 30th August – 29th October.",
           "🔁 Kontrol edelim: Son seçenek “29th October – 30th August – 19th May – 23rd April” de aradığımız cevap değil: Bu sıralama aralıktan ocağa doğru, yani tersten yapılmış. Geriye yalnızca “23rd April – 19th May – 30th August – 29th October” kalıyor."],
          { kural: "Ay sırası: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec.", dogruNeden: "Yılın başından sonuna doğru sıralıyoruz." }),
      ],
      "ennat.wh": [
        Q("ennat.wh", "uygulama", 1, "— ___ do we celebrate Republic Day?<br>— On 29th October.", "When",
          [["Where", "kavrama", "Where yer sorar; cevap bir tarih."], ["Who", "kavrama", "Who kişi sorar."], ["What", "kavrama", "Tarih sorarken “When” kullanılır."]],
          "Cevap bir tarih mi, yer mi, kişi mi?",
          [
           "🔎 Soruyu anlayalım: Cevap “On 29th October” bir tarihtir.",
           "💡 Hatırlayalım: Zaman ve tarih “When” ile sorulur.",
           "✏️ Seçenekleri tek tek inceleyelim: “Where” → Where yer sorar; cevap bir tarih.",
           "✏️ “Who” → Who kişi sorar.",
           "✅ Sonuç: When do we celebrate Republic Day?",
           "🔁 Kontrol edelim: Son seçenek “What” de aradığımız cevap değil: Tarih sorarken “When” kullanılır. Geriye yalnızca “When” kalıyor."],
          { kural: "When → zaman/tarih; Where → yer; Who → kişi; What → şey/olay.", dogruNeden: "Zaman ve tarih “When” ile sorulur." }),
        Q("ennat.wh", "uygulama", 1, "— ___ do people watch the parade?<br>— In the city square.", "Where",
          [["When", "kavrama", "Cevap bir zaman değil, bir yer."], ["Who", "kavrama", "Cevap bir kişi değil."], ["What", "kavrama", "Yer sorarken “Where” kullanılır."]],
          "“In the city square” ne anlatıyor?",
          [
           "🔎 Soruyu anlayalım: Cevap bir yer bildiriyor: şehir meydanında.",
           "💡 Hatırlayalım: Yer sorusu “Where” ile sorulur.",
           "✏️ Seçenekleri tek tek inceleyelim: “When” → Cevap bir zaman değil, bir yer.",
           "✏️ “Who” → Cevap bir kişi değil.",
           "✅ Sonuç: Where do people watch the parade?",
           "🔁 Kontrol edelim: Son seçenek “What” de aradığımız cevap değil: Yer sorarken “Where” kullanılır. Geriye yalnızca “Where” kalıyor."],
          { kural: "Where → yer (in the school garden, in the city square).", dogruNeden: "Yer sorusu “Where” ile sorulur." }),
        Q("ennat.wh", "uygulama", 1, "— ___ recites the poem at the ceremony?<br>— Zeynep does.", "Who",
          [["What", "kavrama", "Cevap bir kişi (Zeynep); kişi “Who” ile sorulur."], ["Where", "kavrama", "Cevap bir yer değil."], ["When", "kavrama", "Cevap bir zaman değil."]],
          "Cevapta bir kişi adı var.",
          [
           "🔎 Soruyu anlayalım: Cevap: Zeynep does. (Bir kişi)",
           "💡 Hatırlayalım: Kişiyi sorarken “Who” kullanırız.",
           "✏️ Seçenekleri tek tek inceleyelim: “What” → Cevap bir kişi (Zeynep); kişi “Who” ile sorulur.",
           "✏️ “Where” → Cevap bir yer değil.",
           "✅ Sonuç: Who recites the poem at the ceremony?",
           "🔁 Kontrol edelim: Son seçenek “When” de aradığımız cevap değil: Cevap bir zaman değil. Geriye yalnızca “Who” kalıyor."],
          { kural: "Who + fiil-s …? → Zeynep does.", dogruNeden: "Kişiyi sorarken “Who” kullanırız." }),
        Q("ennat.wh", "uygulama", 2, "— ___ do students wear on 23rd April?<br>— They wear traditional costumes.", "What",
          [["Who", "kavrama", "Cevap bir kişi değil, giyilen şey."], ["Where", "kavrama", "Cevap bir yer değil."], ["When", "dikkat", "Tarih soruda verilmiş; cevap giyilen şeyi söylüyor."]],
          "Cevap neyi anlatıyor: kişi, yer, zaman, şey?",
          [
           "🔎 Soruyu anlayalım: Cevap: geleneksel kostümler (bir şey).",
           "💡 Hatırlayalım: Bir şeyi sorarken “What” kullanırız.",
           "✏️ Seçenekleri tek tek inceleyelim: “Who” → Cevap bir kişi değil, giyilen şey.",
           "✏️ “Where” → Cevap bir yer değil.",
           "✅ Sonuç: What do students wear on 23rd April?",
           "🔁 Kontrol edelim: Son seçenek “When” de aradığımız cevap değil: Tarih soruda verilmiş; cevap giyilen şeyi söylüyor. Geriye yalnızca “What” kalıyor."],
          { kural: "What → bir şey ya da olay sorar.", dogruNeden: "Bir şeyi sorarken “What” kullanırız." }),
        Q("ennat.wh", "transfer", 2, "— What do you do on Teachers' Day?<br>— ___", "We give cards to our teachers.",
          [["On 24th November.", "kavrama", "Bu cevap “When?” sorusuna uygundur."], ["At school.", "kavrama", "Bu cevap “Where?” sorusuna uygundur."], ["My teacher does.", "kavrama", "Bu cevap “Who?” sorusuna uygundur."]],
          "What do you do…? = Ne yaparsın?",
          [
           "🔎 Soruyu anlayalım: Soru, o gün ne yaptığımızı soruyor.",
           "💡 Hatırlayalım: Cevapta bir etkinlik olmalı.",
           "✏️ Seçenekleri tek tek inceleyelim: “On 24th November.” → Bu cevap “When?” sorusuna uygundur.",
           "✏️ “At school.” → Bu cevap “Where?” sorusuna uygundur.",
           "✅ Sonuç: We give cards to our teachers.",
           "🔁 Kontrol edelim: Son seçenek “My teacher does.” de aradığımız cevap değil: Bu cevap “Who?” sorusuna uygundur. Geriye yalnızca “We give cards to our teachers.” kalıyor."],
          { kural: "What do you do…? → yapılan etkinlikle cevap verilir.", dogruNeden: "Cevapta bir etkinlik olmalı." }),
        Q("ennat.wh", "uygulama", 2, "Read the text and answer.<br><i>My favourite national day is 23rd April. On that day, we decorate our classroom with flags and balloons. In the afternoon, there is a show in the school garden. I usually perform a folk dance with my friends.</i><br>Where is the show?", "In the school garden.",
          [["In the classroom.", "dikkat", "Sınıf süslenir ama gösteri okul bahçesindedir."], ["In the afternoon.", "kavrama", "Bu bir zaman; soru yer soruyor (Where)."], ["On 23rd April.", "kavrama", "Bu bir tarih; soru yer soruyor."]],
          "Where = nerede. Metinde “show” kelimesini bul.",
          [
           "🔎 Soruyu anlayalım: Metinde “there is a show in the school garden” yazıyor.",
           "💡 Hatırlayalım: Soru gösterinin yerini soruyor.",
           "✏️ Seçenekleri tek tek inceleyelim: “In the classroom.” → Sınıf süslenir ama gösteri okul bahçesindedir.",
           "✏️ “In the afternoon.” → Bu bir zaman; soru yer soruyor (Where).",
           "✅ Sonuç: In the school garden.",
           "🔁 Kontrol edelim: Son seçenek “On 23rd April.” de aradığımız cevap değil: Bu bir tarih; soru yer soruyor. Geriye yalnızca “In the school garden.” kalıyor."],
          { kural: "Where sorusuna yer bildiren bir ifadeyle cevap verilir.", dogruNeden: "Soru gösterinin yerini soruyor." }),
      ],
      "ennat.celebrate": [
        Q("ennat.celebrate", "hatirlama", 1, "“tören” İngilizcede hangisidir?", "ceremony",
          [["parade", "bilgi", "parade geçit törenidir (yürüyüş)."], ["poem", "bilgi", "poem şiir demektir."], ["costume", "bilgi", "costume kostüm demektir."]],
          "Okul bahçesinde İstiklal Marşı ile başlayan etkinlik…",
          [
           "🔎 Soruyu anlayalım: tören = resmî kutlama etkinliği.",
           "💡 Hatırlayalım: İngilizcesi “ceremony”dir.",
           "✏️ parade ise sokakta yapılan geçit törenidir.",
           "✏️ Seçenekleri tek tek inceleyelim: “parade” → parade geçit törenidir (yürüyüş).",
           "✏️ “poem” → poem şiir demektir.",
           "✅ Sonuç: Doğru cevap “ceremony”.",
           "🔁 Kontrol edelim: Son seçenek “costume” de aradığımız cevap değil: costume kostüm demektir. Geriye yalnızca “ceremony” kalıyor."],
          { kural: "ceremony: tören; parade: geçit töreni.", dogruNeden: "İngilizcesi “ceremony”dir." }),
        Q("ennat.celebrate", "uygulama", 1, "On Republic Day, we ___ the national anthem in the school garden.", "sing",
          [["sings", "kavrama", "Özne “we”; fiil -s almaz."], ["singing", "bilgi", "Geniş zamanda fiil -ing almaz."], ["watch", "kavrama", "Marş izlenmez, söylenir; anlam uymuyor."]],
          "İstiklal Marşı ile hangi fiil kullanılır?",
          [
           "🔎 Soruyu anlayalım: Marşı söyleriz: sing.",
           "💡 Hatırlayalım: Özne “we” olduğu için fiil yalın kalır.",
           "✏️ Seçenekleri tek tek inceleyelim: “sings” → Özne “we”; fiil -s almaz.",
           "✏️ “singing” → Geniş zamanda fiil -ing almaz.",
           "✅ Sonuç: we sing the national anthem.",
           "🔁 Kontrol edelim: Son seçenek “watch” de aradığımız cevap değil: Marş izlenmez, söylenir; anlam uymuyor. Geriye yalnızca “sing” kalıyor."],
          { kural: "sing the national anthem: millî marşı söylemek.", dogruNeden: "Özne “we” olduğu için fiil yalın kalır." }),
        Q("ennat.celebrate", "aciklama", 1, "Which one is NOT a usual activity on national days?", "We have a maths exam.",
          [["We wave flags.", "kavrama", "Bayrak sallamak millî günlerde yapılır."], ["We recite poems.", "kavrama", "Şiir okumak millî günlerde yapılır."], ["We watch the parade.", "kavrama", "Geçit törenini izlemek millî günlerde yapılır."]],
          "Hangisi bir kutlama etkinliği değildir?",
          [
           "🔎 Soruyu anlayalım: Millî günlerde tören, şiir, bayrak, geçit töreni olur.",
           "💡 Hatırlayalım: Millî bayramlar tatildir; sınav yapılmaz.",
           "✏️ Seçenekleri tek tek inceleyelim: “We wave flags.” → Bayrak sallamak millî günlerde yapılır.",
           "✏️ “We recite poems.” → Şiir okumak millî günlerde yapılır.",
           "✅ Sonuç: We have a maths exam.",
           "🔁 Kontrol edelim: Son seçenek “We watch the parade.” de aradığımız cevap değil: Geçit törenini izlemek millî günlerde yapılır. Geriye yalnızca “We have a maths exam.” kalıyor."],
          { kural: "Kutlama etkinlikleri: wave flags, recite poems, sing songs, watch the parade.", dogruNeden: "Millî bayramlar tatildir; sınav yapılmaz." }),
        Q("ennat.celebrate", "uygulama", 2, "Match the picture: 🎆 There are ___ in the sky on Republic Day evening.", "fireworks",
          [["flags", "kavrama", "Bayraklar gökyüzünde patlamaz; resimdeki havai fişektir."], ["poems", "kavrama", "Şiir gökyüzünde görülmez."], ["costumes", "kavrama", "Kostüm giyilir; gökyüzünde olmaz."]],
          "🎆 hangi kelimeyi gösteriyor?",
          [
           "🔎 Soruyu anlayalım: Resim gökyüzündeki renkli patlamaları gösteriyor.",
           "💡 Hatırlayalım: Bunlar havai fişeklerdir.",
           "✏️ Seçenekleri tek tek inceleyelim: “flags” → Bayraklar gökyüzünde patlamaz; resimdeki havai fişektir.",
           "✏️ “poems” → Şiir gökyüzünde görülmez.",
           "✅ Sonuç: İngilizcesi: fireworks.",
           "🔁 Kontrol edelim: Son seçenek “costumes” de aradığımız cevap değil: Kostüm giyilir; gökyüzünde olmaz. Geriye yalnızca “fireworks” kalıyor."],
          { kural: "fireworks: havai fişek.", dogruNeden: "Bunlar havai fişeklerdir." }),
        Q("ennat.celebrate", "uygulama", 2, "Read the text and answer.<br><i>My favourite national day is 23rd April. On that day, we decorate our classroom with flags and balloons. In the afternoon, there is a show in the school garden. I usually perform a folk dance with my friends.</i><br>What does the writer usually do?", "The writer performs a folk dance.",
          [["The writer recites a poem.", "dikkat", "Metinde şiir okumaktan söz edilmiyor."], ["The writer watches the parade.", "dikkat", "Metinde geçit töreninden söz edilmiyor."], ["The writer sings the national anthem alone.", "dikkat", "Metinde yalnız başına marş söylendiği yazmıyor."]],
          "Metinde “usually” kelimesini bul.",
          [
           "🔎 Soruyu anlayalım: “usually” cümlesi: I usually perform a folk dance with my friends.",
           "💡 Hatırlayalım: Yazar arkadaşlarıyla halk oyunu oynuyor.",
           "✏️ Seçenekleri tek tek inceleyelim: “The writer recites a poem.” → Metinde şiir okumaktan söz edilmiyor.",
           "✏️ “The writer watches the parade.” → Metinde geçit töreninden söz edilmiyor.",
           "✅ Sonuç: The writer performs a folk dance.",
           "🔁 Kontrol edelim: Son seçenek “The writer sings the national anthem alone.” de aradığımız cevap değil: Metinde yalnız başına marş söylendiği yazmıyor. Geriye yalnızca “The writer performs a folk dance.” kalıyor."],
          { kural: "perform a folk dance: halk oyunu oynamak.", dogruNeden: "Yazar arkadaşlarıyla halk oyunu oynuyor." }),
      ],
    },
  });

  /* =========================================================================
   * THEME 2 — 4) DAILY AND STUDY ROUTINES
   * ========================================================================= */
  const SIKLIK_HAFTA = [[7, "Every day."], [1, "Once a week."], [2, "Twice a week."], [3, "Three times a week."], [0, "Never."]];
  const ETKINLIK = [
    [p => `tidy ${p} room`, p => `tidies ${p} room`, "🧹"], [() => "go swimming", () => "goes swimming", "🏊"], [() => "play chess", () => "plays chess", "♟️"],
    [p => `help ${p} mum with the cooking`, p => `helps ${p} mum with the cooking`, "🍲"], [() => "revise for exams", () => "revises for exams", "📚"], [() => "ride a bike", () => "rides a bike", "🚲"],
  ];
  const ETIKET_OZNE = [["You", "you", false], ["We", "we", false], ["They", "they", false], ["Ali", "he", true], ["My sister", "she", true], ["Your brother", "he", true]];
  const ETIKET_GENIS = [["go to bed at ten", "goes to bed at ten"], ["have breakfast at seven", "has breakfast at seven"], ["do homework after school", "does homework after school"], ["study English every day", "studies English every day"], ["walk to school", "walks to school"]];
  const ETIKET_SIMDI = ["having lunch", "resting", "doing homework", "reading a book", "brushing their teeth"];

  KONU_EKLE("en", {
    id: "en_daily", tema: "en2", ad: "Daily and Study Routines", tr: "Günlük ve ders çalışma rutinleri",
    kazanimlar: [
      { id: "endly.cont", ad: "Şimdiki zaman (present continuous) ile geniş zamanı (simple present) ayırt etme" },
      { id: "endly.howoften", ad: "How often…? ile sıklık sorma ve cevaplama (once a week, every day…)" },
      { id: "endly.tags", ad: "Geniş zaman ve şimdiki zamanda question tags (doesn't she? / isn't he?)" },
    ],
    sozluk: [
      ["wake up", "uyanmak"], ["get up", "kalkmak"], ["brush my teeth", "dişlerimi fırçalamak"], ["wash my face", "yüzümü yıkamak"],
      ["get dressed", "giyinmek"], ["have breakfast", "kahvaltı yapmak"], ["rest", "dinlenmek"], ["do homework", "ödev yapmak"],
      ["study", "ders çalışmak"], ["revise", "tekrar yapmak"], ["take a shower", "duş almak"], ["tidy my room", "odamı toplamak"],
      ["have a snack", "atıştırmak"], ["go to bed", "yatmak"], ["study plan", "çalışma planı"], ["once", "bir kez"],
      ["twice", "iki kez"], ["three times", "üç kez"], ["every day", "her gün"], ["at the moment", "şu anda"],
    ],
    anlatim: [
      { baslik: "Simple present mi, present continuous mı?",
        metin: "<b>Simple present (geniş zaman)</b> her zaman yaptığımız rutinleri anlatır: every day, usually, on Mondays.<br>→ I <b>brush</b> my teeth every morning.<br><b>Present continuous (şimdiki zaman)</b> şu anda olan eylemi anlatır: now, at the moment, Look!, Listen!<br>Yapı: <b>am / is / are + fiil-ing</b> → I <b>am resting</b> now. She <b>is studying</b>. They <b>are having</b> breakfast.<br>Olumsuz: She <b>isn't</b> sleeping. Soru: <b>Are</b> you <b>revising</b>?",
        ornek: "<b>My sister usually rests after school, but now she is doing her homework.</b>",
        durak: { soru: "Look! Ali ___ his teeth.", secenekler: [["is brushing", true, "“Look!” şu anda olan bir eylemi gösterir: is + fiil-ing."], ["brushes", false, "Geniş zaman rutinler içindir; “Look!” şimdiki zaman ister."], ["brush", false, "Ali = he; ayrıca şu an olan eylem için -ing gerekir."], ["are brushing", false, "Ali tekil (he); “is” kullanılır."]] } },
      { baslik: "How often…?",
        metin: "Bir şeyi ne sıklıkla yaptığımızı sormak için <b>How often</b> kullanırız.<br><b>How often do you</b> revise? — <b>Every day.</b><br><b>How often does she</b> go swimming? — <b>Twice a week.</b><br>Cevaplar: <b>once</b> a week (haftada bir), <b>twice</b> a week (haftada iki kez), <b>three times</b> a week, <b>every</b> day / weekend, <b>never</b>.<br>Bu ifadeler genellikle <b>cümlenin sonuna</b> gelir: She goes swimming <b>twice a week</b>.",
        ornek: "<b>— How often do you tidy your room? — Once a week, on Saturdays.</b>",
        gorsel: G.tablo(["Ifade", "Anlamı"], [["once a week", "haftada bir kez"], ["twice a week", "haftada iki kez"], ["three times a week", "haftada üç kez"], ["every day", "her gün"]]),
        durak: { soru: "“Haftada iki kez” İngilizcede nasıl söylenir?", secenekler: [["twice a week", true, "twice = iki kez, a week = haftada."], ["two once a week", false, "Böyle bir ifade yoktur."], ["once a week", false, "once a week = haftada bir kez."], ["every two days", false, "every two days = iki günde bir."]] } },
      { baslik: "Question tags (…, değil mi?)",
        metin: "Cümlenin sonuna eklenen kısa soruya <b>question tag</b> denir; Türkçedeki “…, değil mi?” gibidir.<br>Kural: <b>Olumlu cümle → olumsuz tag</b>, <b>olumsuz cümle → olumlu tag</b>. Tag'de özne <b>zamir</b> olur.<br>Geniş zaman: You <b>get</b> up early, <b>don't you</b>? / She <b>studies</b> every day, <b>doesn't she</b>? / He <b>doesn't</b> rest, <b>does he</b>?<br>Şimdiki zaman: They <b>are</b> reading, <b>aren't they</b>? / Ali <b>isn't</b> sleeping, <b>is he</b>?",
        ornek: "<b>Your mum works at a hospital, doesn't she?</b> (Annen hastanede çalışıyor, değil mi?)",
        durak: { soru: "Ayşe studies every evening, ___?", secenekler: [["doesn't she", true, "Olumlu geniş zaman, Ayşe = she → doesn't she?"], ["does she", false, "Olumlu cümleye olumsuz tag gelir."], ["isn't she", false, "Cümlede “is” yok; geniş zaman tag'i does/doesn't ile kurulur."], ["don't she", false, "she ile “don't” değil “doesn't” kullanılır."]] } },
    ],
    uret: {
      "endly.cont": [
        Q("endly.cont", "uygulama", 1, "I usually ___ my homework after dinner.", "do",
          [["am doing", "kavrama", "“usually” rutin anlatır; geniş zaman gerekir."], ["does", "kavrama", "Özne “I”; fiil -s almaz."], ["doing", "bilgi", "Fiil tek başına -ing ile kullanılmaz."]],
          "“usually” hangi zamanla kullanılır?",
          [
           "🔎 Soruyu anlayalım: “usually” bir alışkanlık anlatır.",
           "💡 Hatırlayalım: Alışkanlıklar geniş zamanla anlatılır.",
           "✏️ Seçenekleri tek tek inceleyelim: “am doing” → “usually” rutin anlatır; geniş zaman gerekir.",
           "✏️ “does” → Özne “I”; fiil -s almaz.",
           "✅ Sonuç: Özne I → do: I usually do my homework after dinner.",
           "🔁 Kontrol edelim: Son seçenek “doing” de aradığımız cevap değil: Fiil tek başına -ing ile kullanılmaz. Geriye yalnızca “do” kalıyor."],
          { kural: "usually, every day, on Mondays → simple present.", dogruNeden: "Alışkanlıklar geniş zamanla anlatılır." }),
        Q("endly.cont", "uygulama", 1, "Be quiet! The baby ___ .", "is sleeping",
          [["sleeps", "kavrama", "“Be quiet!” şu anki bir durumu gösterir; şimdiki zaman gerekir."], ["are sleeping", "kavrama", "“the baby” tekildir; “is” kullanılır."], ["sleeping", "bilgi", "-ing'li fiil am/is/are olmadan kullanılmaz."]],
          "Bebek şu anda ne yapıyor?",
          [
           "🔎 Soruyu anlayalım: “Be quiet!” bize şu anda olan bir şeyi anlatıyor.",
           "💡 Hatırlayalım: Şimdiki zaman: is + fiil-ing.",
           "✏️ Seçenekleri tek tek inceleyelim: “sleeps” → “Be quiet!” şu anki bir durumu gösterir; şimdiki zaman gerekir.",
           "✏️ “are sleeping” → “the baby” tekildir; “is” kullanılır.",
           "✅ Sonuç: The baby is sleeping.",
           "🔁 Kontrol edelim: Son seçenek “sleeping” de aradığımız cevap değil: -ing'li fiil am/is/are olmadan kullanılmaz. Geriye yalnızca “is sleeping” kalıyor."],
          { kural: "Look!, Listen!, Be quiet!, now → present continuous.", dogruNeden: "Şimdiki zaman: is + fiil-ing." }),
        Q("endly.cont", "aciklama", 2, "Which sentence is about <b>now</b>?", "My sister is resting on the sofa.",
          [["My sister rests after school.", "kavrama", "Bu cümle bir rutini anlatır (her gün okuldan sonra)."], ["My sister always rests on Sundays.", "kavrama", "“always” alışkanlık bildirir."], ["My sister doesn't rest in the morning.", "kavrama", "Bu cümle genel bir alışkanlığı anlatır."]],
          "Şu anı anlatan yapı: am / is / are + fiil-ing.",
          [
           "🔎 Soruyu anlayalım: Şu an olan eylemler present continuous ile anlatılır.",
           "💡 Hatırlayalım: “is resting” bu yapıya uyar.",
           "✏️ Seçenekleri tek tek inceleyelim: “My sister rests after school.” → Bu cümle bir rutini anlatır (her gün okuldan sonra).",
           "✏️ “My sister always rests on Sundays.” → “always” alışkanlık bildirir.",
           "✅ Sonuç: My sister is resting on the sofa.",
           "🔁 Kontrol edelim: Son seçenek “My sister doesn't rest in the morning.” de aradığımız cevap değil: Bu cümle genel bir alışkanlığı anlatır. Geriye yalnızca “My sister is resting on the sofa.” kalıyor."],
          { kural: "Şu an: am/is/are + V-ing. Rutin: fiil / fiil-s.", dogruNeden: "“is resting” bu yapıya uyar." }),
        Q("endly.cont", "transfer", 2, "— What are you doing?<br>— ___", "I'm revising for my English exam.",
          [["I revise every evening.", "kavrama", "Soru şu anı soruyor; bu cevap bir rutini anlatır."], ["Yes, I am.", "kavrama", "Wh- sorusu evet/hayır ile cevaplanmaz."], ["I'm revise for my English exam.", "dikkat", "am'den sonra fiil -ing almalı: I'm revising."]],
          "“What are you doing?” = Ne yapıyorsun (şu anda)?",
          [
           "🔎 Soruyu anlayalım: Soru şimdiki zamanla sorulmuş.",
           "💡 Hatırlayalım: Cevap da şimdiki zamanla verilir: I'm + fiil-ing.",
           "✏️ Seçenekleri tek tek inceleyelim: “I revise every evening.” → Soru şu anı soruyor; bu cevap bir rutini anlatır.",
           "✏️ “Yes, I am.” → Wh- sorusu evet/hayır ile cevaplanmaz.",
           "✅ Sonuç: I'm revising for my English exam.",
           "🔁 Kontrol edelim: Son seçenek “I'm revise for my English exam.” de aradığımız cevap değil: am'den sonra fiil -ing almalı: I'm revising. Geriye yalnızca “I'm revising for my English exam.” kalıyor."],
          { kural: "What are you doing? → I'm + V-ing.", dogruNeden: "Cevap da şimdiki zamanla verilir: I'm + fiil-ing." }),
        Q("endly.cont", "uygulama", 2, "Choose the correct time expression: She is studying maths ___.", "at the moment",
          [["every day", "kavrama", "“every day” rutin anlatır; geniş zamanla kullanılır."], ["on Mondays", "kavrama", "“on Mondays” tekrarlanan bir alışkanlıktır."], ["usually", "kavrama", "“usually” geniş zamanla kullanılır ve bu konumda gelmez."]],
          "Cümle şimdiki zamanda: is studying.",
          [
           "🔎 Soruyu anlayalım: Cümle present continuous yapısında.",
           "💡 Hatırlayalım: Şimdiki zamana uyan zaman ifadesi: now, at the moment.",
           "✏️ Seçenekleri tek tek inceleyelim: “every day” → “every day” rutin anlatır; geniş zamanla kullanılır.",
           "✏️ “on Mondays” → “on Mondays” tekrarlanan bir alışkanlıktır.",
           "✅ Sonuç: at the moment.",
           "🔁 Kontrol edelim: Son seçenek “usually” de aradığımız cevap değil: “usually” geniş zamanla kullanılır ve bu konumda gelmez. Geriye yalnızca “at the moment” kalıyor."],
          { kural: "now, at the moment → present continuous.", dogruNeden: "Şimdiki zamana uyan zaman ifadesi: now, at the moment." }),
        Q("endly.cont", "uygulama", 2, "They usually ___ TV in the evening, but tonight they are reading books.", "watch",
          [["are watching", "kavrama", "“usually” rutin anlatır; geniş zaman gerekir."], ["watches", "kavrama", "Özne “they”; fiil -es almaz."], ["watching", "bilgi", "Fiil tek başına -ing ile kullanılmaz."]],
          "Cümlenin ilk bölümü rutini, ikinci bölümü şu anı anlatıyor.",
          [
           "🔎 Soruyu anlayalım: “usually … in the evening” bir alışkanlık.",
           "💡 Hatırlayalım: Alışkanlık: geniş zaman; they → watch.",
           "✏️ Seçenekleri tek tek inceleyelim: “are watching” → “usually” rutin anlatır; geniş zaman gerekir.",
           "✏️ “watches” → Özne “they”; fiil -es almaz.",
           "✅ Sonuç: They usually watch TV in the evening.",
           "🔁 Kontrol edelim: Son seçenek “watching” de aradığımız cevap değil: Fiil tek başına -ing ile kullanılmaz. Geriye yalnızca “watch” kalıyor."],
          { kural: "Rutin: simple present; bu akşam/şu an: present continuous.", dogruNeden: "Alışkanlık: geniş zaman; they → watch." }),
      ],
      "endly.howoften": [
        z => {
          const [ad, zamir, iyelik] = sec(KISILER), [, et3, emo] = sec(ETKINLIK), [k, cevap] = sec(SIKLIK_HAFTA);
          const gunler = karistir(GUNLER.map((g, i) => i)).slice(0, k);
          return S(zengin({
            kaz: "endly.howoften", duzey: "uygulama", zorluk: 1,
            soru: `${emo} Look at ${ad}'s week. How often does ${ad} <b>${ETKINLIK.find(e => e[2] === emo)[0](iyelik)}</b>?`,
            gorsel: G.tablo(GUNLER, [GUNLER.map((g, i) => gunler.includes(i) ? "✔️" : "–")]),
            dogru: cevap,
            yanlis: SIKLIK_HAFTA.filter(x => x[0] !== k).slice(0, 4).map(([kk, c]) => [c, "dikkat", `Bu cevap haftada ${kk} gün anlamına gelir; tabloda ${k} gün işaretli.`]),
            ipucu: "İşaretli günleri say.",
            cozum: [`Tabloda ${k} gün işaretli.`, "1 → once a week, 2 → twice a week, 3 → three times a week, 7 → every day, 0 → never.", `Cevap: ${cevap} (${ad} ${et3(iyelik)} …)`],
            kural: "once (1), twice (2), three times (3) a week; every day (7).",
          }));
        },
        Q("endly.howoften", "uygulama", 1, "— ___ do you tidy your room?<br>— Twice a week.", "How often",
          [["How many", "kavrama", "How many sayı/miktar sorar (kaç tane)."], ["When", "kavrama", "When zamanı sorar; cevap bir sıklık bildiriyor."], ["How long", "strateji", "How long süre sorar (ne kadar süre)."]],
          "Cevap bir sıklık: “Twice a week.”",
          [
           "🔎 Soruyu anlayalım: Cevap ne sıklıkla yapıldığını söylüyor.",
           "💡 Hatırlayalım: Sıklık “How often” ile sorulur.",
           "✏️ Seçenekleri tek tek inceleyelim: “How many” → How many sayı/miktar sorar (kaç tane).",
           "✏️ “When” → When zamanı sorar; cevap bir sıklık bildiriyor.",
           "✅ Sonuç: How often do you tidy your room?",
           "🔁 Kontrol edelim: Son seçenek “How long” de aradığımız cevap değil: How long süre sorar (ne kadar süre). Geriye yalnızca “How often” kalıyor."],
          { kural: "How often…? → every day, once a week, twice a week, never.", dogruNeden: "Sıklık “How often” ile sorulur." }),
        Q("endly.howoften", "hatirlama", 1, "Which one means “haftada üç kez”?", "three times a week",
          [["three weeks a time", "dikkat", "Kelime sırası yanlış; doğru kalıp: … times a week."], ["once a week", "bilgi", "once a week = haftada bir kez."], ["thirty times a week", "dikkat", "thirty = otuz; three = üç."]],
          "üç = three, kez = times, haftada = a week.",
          [
           "🔎 Soruyu anlayalım: Üç kez = three times.",
           "💡 Hatırlayalım: Haftada = a week.",
           "✏️ Seçenekleri tek tek inceleyelim: “three weeks a time” → Kelime sırası yanlış; doğru kalıp: … times a week.",
           "✏️ “once a week” → once a week = haftada bir kez.",
           "✅ Sonuç: three times a week.",
           "🔁 Kontrol edelim: Son seçenek “thirty times a week” de aradığımız cevap değil: thirty = otuz; three = üç. Geriye yalnızca “three times a week” kalıyor."],
          { kural: "1 kez = once, 2 kez = twice, 3 ve sonrası = three/four… times.", dogruNeden: "Haftada = a week." }),
        Q("endly.howoften", "aciklama", 2, "Which answer is NOT possible for “How often do you rest after school?”", "At 4 o'clock.",
          [["Every day.", "kavrama", "“Every day.” bir sıklık bildirir; uygun bir cevaptır."], ["Twice a week.", "kavrama", "Bir sıklık bildirir; uygun bir cevaptır."], ["Never.", "kavrama", "“Never.” da bir sıklık cevabıdır."]],
          "Hangisi sıklık değil, saat bildiriyor?",
          [
           "🔎 Soruyu anlayalım: How often sıklık sorar.",
           "💡 Hatırlayalım: Every day, twice a week, never sıklık bildirir.",
           "✏️ Seçenekleri tek tek inceleyelim: “Every day.” → “Every day.” bir sıklık bildirir; uygun bir cevaptır.",
           "✏️ “Twice a week.” → Bir sıklık bildirir; uygun bir cevaptır.",
           "✅ Sonuç: “At 4 o'clock.” bir saat bildirir; “When…?” sorusunun cevabıdır.",
           "🔁 Kontrol edelim: Son seçenek “Never.” de aradığımız cevap değil: “Never.” da bir sıklık cevabıdır. Geriye yalnızca “At 4 o'clock.” kalıyor."],
          { kural: "When → saat/zaman; How often → sıklık.", dogruNeden: "Every day, twice a week, never sıklık bildirir." }),
        Q("endly.howoften", "uygulama", 2, "Which sentence is correct?", "She goes swimming once a week.",
          [["She once a week goes swimming.", "kavrama", "“once a week” gibi ifadeler genellikle cümlenin sonuna gelir."], ["She goes once a week swimming.", "kavrama", "Fiil ile nesnesi arasına sıklık ifadesi girmez."], ["She go swimming once a week.", "kavrama", "she ile fiil -es almalı: goes."]],
          "Sıklık ifadesinin yeri cümlenin neresidir?",
          [
           "🔎 Soruyu anlayalım: Özne + fiil + … + sıklık ifadesi.",
           "💡 Hatırlayalım: she öznesiyle fiil “goes” olur.",
           "✏️ Seçenekleri tek tek inceleyelim: “She once a week goes swimming.” → “once a week” gibi ifadeler genellikle cümlenin sonuna gelir.",
           "✏️ “She goes once a week swimming.” → Fiil ile nesnesi arasına sıklık ifadesi girmez.",
           "✅ Sonuç: She goes swimming once a week.",
           "🔁 Kontrol edelim: Son seçenek “She go swimming once a week.” de aradığımız cevap değil: she ile fiil -es almalı: goes. Geriye yalnızca “She goes swimming once a week.” kalıyor."],
          { kural: "once a week, every day → genellikle cümle sonunda.", dogruNeden: "she öznesiyle fiil “goes” olur." }),
        Q("endly.howoften", "transfer", 2, "Read and answer.<br><i>Hi, I'm Arda. I study for one hour every day. I revise English on Mondays and Thursdays. On Saturdays, I go to the library.</i><br>How often does Arda revise English?", "Twice a week.",
          [["Every day.", "dikkat", "Her gün yaptığı şey bir saat ders çalışmaktır, İngilizce tekrarı değil."], ["Once a week.", "dikkat", "Kütüphaneye haftada bir (cumartesi) gider; İngilizceyi iki gün tekrar eder."], ["Three times a week.", "islem", "Metinde İngilizce için iki gün (Monday, Thursday) var."]],
          "İngilizce tekrarı hangi günlerde yapıyor? Say.",
          [
           "🔎 Soruyu anlayalım: “I revise English on Mondays and Thursdays.”",
           "💡 Hatırlayalım: Pazartesi ve perşembe: haftada iki gün.",
           "✏️ Seçenekleri tek tek inceleyelim: “Every day.” → Her gün yaptığı şey bir saat ders çalışmaktır, İngilizce tekrarı değil.",
           "✏️ “Once a week.” → Kütüphaneye haftada bir (cumartesi) gider; İngilizceyi iki gün tekrar eder.",
           "✅ Sonuç: Twice a week.",
           "🔁 Kontrol edelim: Son seçenek “Three times a week.” de aradığımız cevap değil: Metinde İngilizce için iki gün (Monday, Thursday) var. Geriye yalnızca “Twice a week.” kalıyor."],
          { kural: "2 gün = twice a week.", dogruNeden: "Pazartesi ve perşembe: haftada iki gün." }),
      ],
      "endly.tags": [
        z => {
          const [ozne, zm, ucuncu] = sec(ETIKET_OZNE), tur = R(0, 3);
          let cumle, dogru;
          if (tur < 2) {
            const [yalin, ekli] = sec(ETIKET_GENIS);
            if (tur === 0) { cumle = `${ozne} ${ucuncu ? ekli : yalin}`; dogru = `${ucuncu ? "doesn't" : "don't"} ${zm}`; }
            else { cumle = `${ozne} ${ucuncu ? "doesn't" : "don't"} ${yalin}`; dogru = `${ucuncu ? "does" : "do"} ${zm}`; }
          } else {
            let fiil = sec(ETIKET_SIMDI);
            if (fiil.includes("their")) fiil = fiil.replace("their", ucuncu ? (zm === "he" ? "his" : "her") : ozne === "You" ? "your" : ozne === "We" ? "our" : "their");
            const be = ucuncu ? "is" : "are";
            if (tur === 2) { cumle = `${ozne} ${be} ${fiil}`; dogru = `${be}n't ${zm}`; }
            else { cumle = `${ozne} ${be}n't ${fiil}`; dogru = `${be} ${zm}`; }
          }
          const aday = ucuncu ? ["doesn't", "does", "isn't", "is", "don't"] : ["don't", "do", "aren't", "are", "doesn't"];
          const neden = t => {
            if (t === "don't" && ucuncu) return `“${zm}” ile “don't” değil “doesn't” kullanılır.`;
            if (t === "doesn't" && !ucuncu) return `“${zm}” ile “doesn't” değil “don't” kullanılır.`;
            if ((/is|are/.test(t)) !== (tur >= 2)) return tur >= 2 ? "Cümlede am/is/are var (şimdiki zaman); tag de be fiiliyle kurulur." : "Cümle geniş zamanda; tag do/does ile kurulur.";
            return "Olumlu cümleye olumsuz, olumsuz cümleye olumlu tag gelir.";
          };
          return S(zengin({
            kaz: "endly.tags", duzey: "uygulama", zorluk: 2,
            soru: `Complete the question tag:<br><b>${cumle}, ___?</b>`,
            dogru,
            yanlis: aday.map(t => [`${t} ${zm}`, /n't/.test(t) === /n't/.test(dogru.split(" ")[0]) && ((/is|are/.test(t)) === (tur >= 2)) ? "dikkat" : "kavrama", neden(t)]),
            ipucu: "Cümle olumlu mu, olumsuz mu? Yardımcı fiil hangisi?",
            cozum: [tur >= 2 ? "Cümlede am/is/are var; tag de aynı yardımcı fiille kurulur." : "Cümle geniş zamanda; tag do/does ile kurulur.", (tur % 2 === 0 ? "Cümle olumlu, tag olumsuz olur." : "Cümle olumsuz, tag olumlu olur.") + ` Özne zamiri: ${zm}.`, `Doğru: ${cumle}, ${dogru}?`],
            kural: "Olumlu cümle → olumsuz tag; olumsuz cümle → olumlu tag; tag'de özne zamir olur.",
          }));
        },
        Q("endly.tags", "uygulama", 1, "You get up early, ___?", "don't you",
          [["do you", "kavrama", "Olumlu cümleye olumsuz tag gelir."], ["aren't you", "kavrama", "Cümle geniş zamanda; tag do/don't ile kurulur."], ["doesn't you", "dikkat", "“you” ile “doesn't” değil “don't” kullanılır."]],
          "Cümle olumlu; tag olumsuz olmalı.",
          [
           "🔎 Soruyu anlayalım: Geniş zaman, özne “you”.",
           "💡 Hatırlayalım: Olumlu cümle → olumsuz tag: don't.",
           "✏️ Seçenekleri tek tek inceleyelim: “do you” → Olumlu cümleye olumsuz tag gelir.",
           "✏️ “aren't you” → Cümle geniş zamanda; tag do/don't ile kurulur.",
           "✅ Sonuç: You get up early, don't you?",
           "🔁 Kontrol edelim: Son seçenek “doesn't you” de aradığımız cevap değil: “you” ile “doesn't” değil “don't” kullanılır. Geriye yalnızca “don't you” kalıyor."],
          { kural: "You + fiil…, don't you?", dogruNeden: "Olumlu cümle → olumsuz tag: don't." }),
        Q("endly.tags", "uygulama", 2, "He isn't resting now, ___?", "is he",
          [["isn't he", "kavrama", "Olumsuz cümleye olumlu tag gelir."], ["does he", "kavrama", "Cümle şimdiki zamanda (is); tag “is” ile kurulur."], ["is she", "dikkat", "Özne “he”; tag'de de “he” olmalı."]],
          "Cümle olumsuz ve şimdiki zamanda.",
          [
           "🔎 Soruyu anlayalım: Yardımcı fiil: isn't (olumsuz).",
           "💡 Hatırlayalım: Olumsuz cümle → olumlu tag: is he.",
           "✏️ Seçenekleri tek tek inceleyelim: “isn't he” → Olumsuz cümleye olumlu tag gelir.",
           "✏️ “does he” → Cümle şimdiki zamanda (is); tag “is” ile kurulur.",
           "✅ Sonuç: He isn't resting now, is he?",
           "🔁 Kontrol edelim: Son seçenek “is she” de aradığımız cevap değil: Özne “he”; tag'de de “he” olmalı. Geriye yalnızca “is he” kalıyor."],
          { kural: "…isn't…, is he? / …aren't…, are they?", dogruNeden: "Olumsuz cümle → olumlu tag: is he." }),
        Q("endly.tags", "uygulama", 2, "Your brother doesn't watch TV in the morning, ___?", "does he",
          [["doesn't he", "kavrama", "Olumsuz cümleye olumlu tag gelir."], ["is he", "kavrama", "Cümle geniş zamanda; tag does ile kurulur."], ["does your brother", "kavrama", "Tag'de isim değil, zamir kullanılır: he."]],
          "Tag'de özne zamir olur: your brother → he.",
          [
           "🔎 Soruyu anlayalım: Cümle olumsuz geniş zaman (doesn't).",
           "💡 Hatırlayalım: Olumlu tag: does + zamir.",
           "✏️ Seçenekleri tek tek inceleyelim: “doesn't he” → Olumsuz cümleye olumlu tag gelir.",
           "✏️ “is he” → Cümle geniş zamanda; tag does ile kurulur.",
           "✅ Sonuç: …, does he?",
           "🔁 Kontrol edelim: Son seçenek “does your brother” de aradığımız cevap değil: Tag'de isim değil, zamir kullanılır: he. Geriye yalnızca “does he” kalıyor."],
          { kural: "Tag'de isim yerine zamir: your brother → he, my mum → she.", dogruNeden: "Olumlu tag: does + zamir." }),
        Q("endly.tags", "transfer", 2, "— You are revising for the exam, ___?<br>— Yes, I am. It's tomorrow.", "aren't you",
          [["don't you", "kavrama", "Cümlede “are” var; tag de “are” ile kurulur."], ["are you", "kavrama", "Olumlu cümleye olumsuz tag gelir."], ["isn't you", "dikkat", "“you” ile “is” değil “are” kullanılır."]],
          "Cümledeki yardımcı fiil hangisi?",
          [
           "🔎 Soruyu anlayalım: Yardımcı fiil: are (olumlu).",
           "💡 Hatırlayalım: Olumsuz tag: aren't you.",
           "✏️ Seçenekleri tek tek inceleyelim: “don't you” → Cümlede “are” var; tag de “are” ile kurulur.",
           "✏️ “are you” → Olumlu cümleye olumsuz tag gelir.",
           "✅ Sonuç: You are revising for the exam, aren't you?",
           "🔁 Kontrol edelim: Son seçenek “isn't you” de aradığımız cevap değil: “you” ile “is” değil “are” kullanılır. Geriye yalnızca “aren't you” kalıyor."],
          { kural: "You are…, aren't you?", dogruNeden: "Olumsuz tag: aren't you." }),
      ],
    },
  });

  /* =========================================================================
   * THEME 2 — 5) LEARNING ACTIVITIES IN THE CLASSROOM
   * ========================================================================= */
  KONU_EKLE("en", {
    id: "en_learning", tema: "en2", ad: "Learning Activities in the Classroom", tr: "Sınıfta öğrenme etkinlikleri",
    kazanimlar: [
      { id: "enlrn.activities", ad: "Sınıf içi öğrenme etkinliklerini tanıma (keep a diary, sort, role-play…)" },
      { id: "enlrn.possadj", ad: "İyelik sıfatları (my, your, his, her, its, our, their)" },
      { id: "enlrn.adverb", ad: "Hal zarfları (carefully, quietly…) ve sözcük sırası" },
    ],
    sozluk: [
      ["learning", "öğrenme"], ["activity", "etkinlik"], ["keep a diary", "günlük tutmak"], ["diary", "günlük"],
      ["level", "seviye, düzey"], ["sort", "sınıflandırmak, gruplara ayırmak"], ["work in pairs", "ikili çalışmak"], ["work in groups", "grupla çalışmak"],
      ["role-play", "canlandırma"], ["make a poster", "poster hazırlamak"], ["take notes", "not almak"], ["look up", "(sözlükte) bakmak"],
      ["dictionary", "sözlük"], ["practise", "alıştırma yapmak"], ["mind map", "zihin haritası"], ["quiz", "kısa sınav, bilgi yarışması"],
      ["presentation", "sunum"], ["flashcard", "kelime kartı"], ["project", "proje"], ["carefully", "dikkatlice"],
    ],
    anlatim: [
      { baslik: "Sınıfta öğrenme etkinlikleri",
        metin: "İngilizce derslerinde farklı <b>etkinlikler (activities)</b> yaparız:<br><b>keep a diary</b> – günlük tutmak · <b>sort</b> the cards – kartları gruplara ayırmak · <b>work in pairs / groups</b> – ikili / grupla çalışmak · <b>role-play</b> – canlandırma · <b>make a poster</b> – poster hazırlamak · <b>take notes</b> – not almak · <b>look up</b> a word in a dictionary – sözlükte kelimeye bakmak · <b>mind map</b> – zihin haritası.<br>İngilizce <b>level</b> (seviye): A1 başlangıç düzeyidir.",
        ornek: "<b>We work in pairs and sort the flashcards into two groups: verbs and nouns.</b>",
        durak: { soru: "We act out a dialogue in front of the class. This is ___ .", secenekler: [["a role-play", true, "Bir diyaloğu sınıf önünde canlandırmak role-play'dir."], ["a mind map", false, "Mind map, bilgileri dallar hâlinde çizdiğimiz zihin haritasıdır."], ["a diary", false, "Diary, her gün yazdığımız günlüktür."], ["a dictionary", false, "Dictionary sözlüktür."]] } },
      { baslik: "İyelik sıfatları",
        metin: "Bir şeyin kime ait olduğunu, ismin <b>önüne</b> gelen iyelik sıfatlarıyla gösteririz:<br>I → <b>my</b> book · you → <b>your</b> diary · he → <b>his</b> pen · she → <b>her</b> notebook · it → <b>its</b> cover · we → <b>our</b> project · they → <b>their</b> poster<br>Dikkat: <b>its</b> (onun) ile <b>it's</b> (it is) farklıdır; <b>their</b> (onların) ile <b>there</b> (orada) farklıdır.",
        ornek: "<b>Emre and Can are making their poster. Emre is drawing and Can is writing in his notebook.</b>",
        durak: { soru: "Elif is writing in ___ diary.", secenekler: [["her", true, "Elif bir kız; she → her."], ["his", false, "his erkekler için kullanılır."], ["she", false, "she özne zamiridir; isimden önce iyelik sıfatı gelir."], ["its", false, "its cansızlar ve hayvanlar için kullanılır."]] } },
      { baslik: "Hal zarfları ve sözcük sırası",
        metin: "Bir eylemin <b>nasıl</b> yapıldığını hal zarflarıyla anlatırız. Çoğu sıfata <b>-ly</b> ekleriz:<br>careful → <b>carefully</b>, quiet → <b>quietly</b>, quick → <b>quickly</b>, slow → <b>slowly</b>, easy → <b>easily</b> (y → i).<br>Düzensiz: good → <b>well</b>, fast → <b>fast</b>, hard → <b>hard</b>.<br>Sözcük sırası: <b>Özne + fiil + (nesne) + zarf</b> → She reads <b>the text</b> <b>quietly</b>. Zarf fiil ile nesnenin arasına girmez.",
        ornek: "<b>Listen carefully and write the words quickly.</b>",
        durak: { soru: "Hangi cümle doğrudur?", secenekler: [["He writes the answers carefully.", true, "Özne + fiil + nesne + zarf sırası doğrudur."], ["He writes carefully the answers.", false, "Zarf fiil ile nesnenin arasına girmez."], ["He carefully the answers writes.", false, "Fiil özneden hemen sonra gelmeli."], ["He writes the answers careful.", false, "Fiili niteleyen kelime zarf olmalı: carefully."]] } },
    ],
    uret: {
      "enlrn.activities": [
        Q("enlrn.activities", "hatirlama", 1, "“keep a diary” ne demektir?", "günlük tutmak",
          [["ders programı yapmak", "bilgi", "Ders programı “timetable”dır."], ["sözlük kullanmak", "bilgi", "Sözlük “dictionary”dir."], ["not almak", "bilgi", "Not almak “take notes”tur."]],
          "diary = günlük.",
          [
           "🔎 Soruyu anlayalım: diary her gün yaşadıklarımızı yazdığımız deftere denir.",
           "💡 Hatırlayalım: keep a diary = günlük tutmak.",
           "✏️ Seçenekleri tek tek inceleyelim: “ders programı yapmak” → Ders programı “timetable”dır.",
           "✏️ “sözlük kullanmak” → Sözlük “dictionary”dir.",
           "✅ Sonuç: günlük tutmak.",
           "🔁 Kontrol edelim: Son seçenek “not almak” de aradığımız cevap değil: Not almak “take notes”tur. Geriye yalnızca “günlük tutmak” kalıyor."],
          { kural: "diary: günlük; dictionary: sözlük — karıştırma!", dogruNeden: "keep a diary = günlük tutmak." }),
        Q("enlrn.activities", "aciklama", 1, "Teacher: “<i>Sort the words into two groups: fruit and vegetables.</i>” What does “sort” mean here?", "gruplara ayırmak",
          [["silmek", "bilgi", "Silmek “delete / rub out” demektir."], ["ezberlemek", "bilgi", "Ezberlemek “memorise” demektir."], ["yüksek sesle okumak", "bilgi", "Yüksek sesle okumak “read aloud” demektir."]],
          "Kelimeler “two groups” içine yerleştiriliyor.",
          [
           "🔎 Soruyu anlayalım: Öğretmen kelimeleri iki gruba koymamızı istiyor.",
           "💡 Hatırlayalım: sort = sınıflandırmak, gruplara ayırmak.",
           "✏️ Seçenekleri tek tek inceleyelim: “silmek” → Silmek “delete / rub out” demektir.",
           "✏️ “ezberlemek” → Ezberlemek “memorise” demektir.",
           "✅ Sonuç: gruplara ayırmak.",
           "🔁 Kontrol edelim: Son seçenek “yüksek sesle okumak” de aradığımız cevap değil: Yüksek sesle okumak “read aloud” demektir. Geriye yalnızca “gruplara ayırmak” kalıyor."],
          { kural: "sort: sınıflandırmak, gruplara ayırmak.", dogruNeden: "sort = sınıflandırmak, gruplara ayırmak." }),
        Q("enlrn.activities", "uygulama", 1, "My English ___ is A1. I'm a beginner.", "level",
          [["diary", "kavrama", "diary günlüktür; A1 bir günlük değildir."], ["lesson", "kavrama", "A1 bir ders değil, bir seviyedir."], ["sort", "kavrama", "sort bir fiildir (gruplara ayırmak)."]],
          "A1, A2, B1… neyi gösterir?",
          [
           "🔎 Soruyu anlayalım: A1, dil bilgisinin düzeyini gösterir.",
           "💡 Hatırlayalım: Düzey/seviye = level.",
           "✏️ Seçenekleri tek tek inceleyelim: “diary” → diary günlüktür; A1 bir günlük değildir.",
           "✏️ “lesson” → A1 bir ders değil, bir seviyedir.",
           "✅ Sonuç: My English level is A1.",
           "🔁 Kontrol edelim: Son seçenek “sort” de aradığımız cevap değil: sort bir fiildir (gruplara ayırmak). Geriye yalnızca “level” kalıyor."],
          { kural: "level: seviye, düzey (A1 = başlangıç).", dogruNeden: "Düzey/seviye = level." }),
        Q("enlrn.activities", "uygulama", 2, "I don't know the meaning of “generous”. I ___ in a dictionary.", "look it up",
          [["look at it", "kavrama", "look at = bakmak (görmek için); sözlükte anlam aramak “look up”tır."], ["look after it", "kavrama", "look after = ilgilenmek, bakmak (bakım)."], ["look for it", "kavrama", "look for = aramak (kaybolan bir şeyi)."]],
          "Sözlükte bir kelimeye bakmak hangi kalıptır?",
          [
           "🔎 Soruyu anlayalım: Anlamını bilmediğimiz kelimeyi sözlükte ararız.",
           "💡 Hatırlayalım: Bunun kalıbı: look up (a word).",
           "✏️ Seçenekleri tek tek inceleyelim: “look at it” → look at = bakmak (görmek için); sözlükte anlam aramak “look up”tır.",
           "✏️ “look after it” → look after = ilgilenmek, bakmak (bakım).",
           "✅ Sonuç: Zamir arada: look it up.",
           "🔁 Kontrol edelim: Son seçenek “look for it” de aradığımız cevap değil: look for = aramak (kaybolan bir şeyi). Geriye yalnızca “look it up” kalıyor."],
          { kural: "look up a word = sözlükte bir kelimeye bakmak.", dogruNeden: "Bunun kalıbı: look up (a word)." }),
        Q("enlrn.activities", "uygulama", 2, "Read the instructions.<br><i>Today we are working in pairs. First, read the text. Then, take notes. Finally, make a poster with your partner.</i><br>What do the students do last?", "They make a poster.",
          [["They read the text.", "dikkat", "Metni okumak ilk adımdır (First)."], ["They take notes.", "dikkat", "Not almak ikinci adımdır (Then)."], ["They keep a diary.", "dikkat", "Talimatlarda günlük tutmak yok."]],
          "First, Then, Finally kelimelerine dikkat et.",
          [
           "🔎 Soruyu anlayalım: First → read the text.",
           "💡 Hatırlayalım: Then → take notes.",
           "✏️ Seçenekleri tek tek inceleyelim: “They read the text.” → Metni okumak ilk adımdır (First).",
           "✏️ “They take notes.” → Not almak ikinci adımdır (Then).",
           "✅ Sonuç: Finally (en son) → make a poster. Cevap: They make a poster.",
           "🔁 Kontrol edelim: Son seçenek “They keep a diary.” de aradığımız cevap değil: Talimatlarda günlük tutmak yok. Geriye yalnızca “They make a poster.” kalıyor."],
          { kural: "First (önce), Then (sonra), Finally (en son).", dogruNeden: "Then → take notes." }),
        Q("enlrn.activities", "hatirlama", 1, "“Not almak” İngilizcede hangisidir?", "take notes",
          [["make notes up", "dikkat", "Böyle bir kalıp “not almak” anlamına gelmez."], ["keep a diary", "bilgi", "keep a diary günlük tutmaktır."], ["look up", "bilgi", "look up sözlükte bakmaktır."]],
          "Ders dinlerken defterimize ne yaparız?",
          [
           "🔎 Soruyu anlayalım: Not almak, önemli bilgileri yazmaktır.",
           "💡 Hatırlayalım: İngilizcesi: take notes.",
           "✏️ Seçenekleri tek tek inceleyelim: “make notes up” → Böyle bir kalıp “not almak” anlamına gelmez.",
           "✏️ “keep a diary” → keep a diary günlük tutmaktır.",
           "✅ Sonuç: Örnek: I take notes in English lessons.",
           "🔁 Kontrol edelim: Son seçenek “look up” de aradığımız cevap değil: look up sözlükte bakmaktır. Geriye yalnızca “take notes” kalıyor."],
          { kural: "take notes: not almak.", dogruNeden: "İngilizcesi: take notes." }),
      ],
      "enlrn.possadj": [
        Q("enlrn.possadj", "uygulama", 1, "I'm Deniz. This is ___ notebook.", "my",
          [["me", "kavrama", "“me” nesne zamiridir; isimden önce iyelik sıfatı gelir."], ["I", "kavrama", "“I” özne zamiridir."], ["mine", "kavrama", "“mine” tek başına kullanılır (benimki); isimden önce gelmez."]],
          "“benim defterim” → ___ notebook.",
          [
           "🔎 Soruyu anlayalım: Konuşan kişi: I (Deniz).",
           "💡 Hatırlayalım: I → my (benim).",
           "✏️ Seçenekleri tek tek inceleyelim: “me” → “me” nesne zamiridir; isimden önce iyelik sıfatı gelir.",
           "✏️ “I” → “I” özne zamiridir.",
           "✅ Sonuç: This is my notebook.",
           "🔁 Kontrol edelim: Son seçenek “mine” de aradığımız cevap değil: “mine” tek başına kullanılır (benimki); isimden önce gelmez. Geriye yalnızca “my” kalıyor."],
          { kural: "I → my, you → your, he → his, she → her.", dogruNeden: "I → my (benim)." }),
        Q("enlrn.possadj", "uygulama", 1, "Emre and Can are brothers. ___ classroom is on the second floor.", "Their",
          [["There", "dikkat", "There “orada” demektir; okunuşu benzer ama anlamı farklı."], ["They", "kavrama", "They özne zamiridir; isimden önce iyelik sıfatı gelir."], ["Them", "kavrama", "Them nesne zamiridir."]],
          "Emre and Can = they. “Onların sınıfı” nasıl söylenir?",
          [
           "🔎 Soruyu anlayalım: Emre ve Can = they.",
           "💡 Hatırlayalım: they → their (onların).",
           "✏️ Seçenekleri tek tek inceleyelim: “There” → There “orada” demektir; okunuşu benzer ama anlamı farklı.",
           "✏️ “They” → They özne zamiridir; isimden önce iyelik sıfatı gelir.",
           "✅ Sonuç: Their classroom is on the second floor.",
           "🔁 Kontrol edelim: Son seçenek “Them” de aradığımız cevap değil: Them nesne zamiridir. Geriye yalnızca “Their” kalıyor."],
          { kural: "they → their; their ≠ there.", dogruNeden: "they → their (onların)." }),
        Q("enlrn.possadj", "uygulama", 2, "We are doing ___ project together.", "our",
          [["we", "kavrama", "we özne zamiridir."], ["us", "kavrama", "us nesne zamiridir."], ["their", "dikkat", "Özne “we”; “onların” değil “bizim” olmalı."]],
          "we → ?",
          [
           "🔎 Soruyu anlayalım: Özne we (biz).",
           "💡 Hatırlayalım: we → our (bizim).",
           "✏️ Seçenekleri tek tek inceleyelim: “we” → we özne zamiridir.",
           "✏️ “us” → us nesne zamiridir.",
           "✅ Sonuç: We are doing our project together.",
           "🔁 Kontrol edelim: Son seçenek “their” de aradığımız cevap değil: Özne “we”; “onların” değil “bizim” olmalı. Geriye yalnızca “our” kalıyor."],
          { kural: "we → our, they → their.", dogruNeden: "we → our (bizim)." }),
        Q("enlrn.possadj", "transfer", 2, "— Is this ___ pen, Ali?<br>— Yes, it's mine. Thank you!", "your",
          [["you", "kavrama", "you özne/nesne zamiridir; isimden önce “your” gelir."], ["you're", "dikkat", "you're = you are; anlam uymaz."], ["his", "kavrama", "Ali'yle doğrudan konuşuyoruz; “senin” = your."]],
          "Ali'ye “Bu senin kalemin mi?” diye soruyoruz.",
          [
           "🔎 Soruyu anlayalım: Ali'yle konuşuyoruz: you.",
           "💡 Hatırlayalım: you → your (senin).",
           "✏️ Seçenekleri tek tek inceleyelim: “you” → you özne/nesne zamiridir; isimden önce “your” gelir.",
           "✏️ “you're” → you're = you are; anlam uymaz.",
           "✅ Sonuç: Is this your pen, Ali?",
           "🔁 Kontrol edelim: Son seçenek “his” de aradığımız cevap değil: Ali'yle doğrudan konuşuyoruz; “senin” = your. Geriye yalnızca “your” kalıyor."],
          { kural: "your = senin/sizin; you're = you are.", dogruNeden: "you → your (senin)." }),
        Q("enlrn.possadj", "uygulama", 2, "Look at this dictionary. ___ cover is red.", "Its",
          [["It's", "dikkat", "It's = It is; “It is cover is red” anlamsız olur."], ["His", "kavrama", "his erkek kişiler için kullanılır; sözlük bir nesnedir."], ["Their", "kavrama", "Sözlük tekildir; their çoğul içindir."]],
          "Sözlük bir nesne: it → ?",
          [
           "🔎 Soruyu anlayalım: Sözlük cansız ve tekil: it.",
           "💡 Hatırlayalım: it → its (onun).",
           "✏️ Seçenekleri tek tek inceleyelim: “It's” → It's = It is; “It is cover is red” anlamsız olur.",
           "✏️ “His” → his erkek kişiler için kullanılır; sözlük bir nesnedir.",
           "✅ Sonuç: Its cover is red.",
           "🔁 Kontrol edelim: Son seçenek “Their” de aradığımız cevap değil: Sözlük tekildir; their çoğul içindir. Geriye yalnızca “Its” kalıyor."],
          { kural: "its (onun) ≠ it's (it is).", dogruNeden: "it → its (onun)." }),
        Q("enlrn.possadj", "uygulama", 1, "Mr Aksoy is ___ English teacher. He teaches us every Tuesday.", "our",
          [["us", "kavrama", "us nesne zamiridir; isimden önce “our” gelir."], ["we", "kavrama", "we özne zamiridir."], ["ours", "kavrama", "ours (bizimki) isimden önce kullanılmaz."]],
          "“He teaches us” → bize ders veriyor; o hâlde bizim öğretmenimiz.",
          [
           "🔎 Soruyu anlayalım: Öğretmen bize ders veriyor.",
           "💡 Hatırlayalım: Bizim öğretmenimiz = our teacher.",
           "✏️ Seçenekleri tek tek inceleyelim: “us” → us nesne zamiridir; isimden önce “our” gelir.",
           "✏️ “we” → we özne zamiridir.",
           "✅ Sonuç: Mr Aksoy is our English teacher.",
           "🔁 Kontrol edelim: Son seçenek “ours” de aradığımız cevap değil: ours (bizimki) isimden önce kullanılmaz. Geriye yalnızca “our” kalıyor."],
          { kural: "İyelik sıfatı + isim: our teacher, my book.", dogruNeden: "Bizim öğretmenimiz = our teacher." }),
      ],
      "enlrn.adverb": [
        Q("enlrn.adverb", "uygulama", 1, "Please, listen ___ to the instructions.", "carefully",
          [["careful", "kavrama", "careful bir sıfattır; fiili (listen) zarf niteler."], ["carefuly", "dikkat", "careful + ly → carefully (çift l)."], ["care", "kavrama", "care bir isim/fiildir."]],
          "Nasıl dinlemeliyiz? Fiili niteleyen kelime zarf olmalı.",
          [
           "🔎 Soruyu anlayalım: “listen” bir fiil; nasıl yapıldığını zarf anlatır.",
           "💡 Hatırlayalım: careful + -ly = carefully.",
           "✏️ Seçenekleri tek tek inceleyelim: “careful” → careful bir sıfattır; fiili (listen) zarf niteler.",
           "✏️ “carefuly” → careful + ly → carefully (çift l).",
           "✅ Sonuç: Please, listen carefully.",
           "🔁 Kontrol edelim: Son seçenek “care” de aradığımız cevap değil: care bir isim/fiildir. Geriye yalnızca “carefully” kalıyor."],
          { kural: "sıfat + -ly = zarf (careful → carefully).", dogruNeden: "careful + -ly = carefully." }),
        Q("enlrn.adverb", "uygulama", 2, "Which sentence is correct?", "She reads the text quietly.",
          [["She reads quietly the text.", "kavrama", "Zarf fiil ile nesnenin arasına girmez."], ["She quiet reads the text.", "kavrama", "“quiet” sıfattır ve fiilden önce bu şekilde kullanılmaz."], ["Quietly she the text reads.", "kavrama", "Fiil özneden sonra gelmeli."]],
          "Sıra: Özne + fiil + nesne + zarf.",
          [
           "🔎 Soruyu anlayalım: Özne: She, fiil: reads, nesne: the text.",
           "💡 Hatırlayalım: Zarf (quietly) nesneden sonra gelir.",
           "✏️ Seçenekleri tek tek inceleyelim: “She reads quietly the text.” → Zarf fiil ile nesnenin arasına girmez.",
           "✏️ “She quiet reads the text.” → “quiet” sıfattır ve fiilden önce bu şekilde kullanılmaz.",
           "✅ Sonuç: She reads the text quietly.",
           "🔁 Kontrol edelim: Son seçenek “Quietly she the text reads.” de aradığımız cevap değil: Fiil özneden sonra gelmeli. Geriye yalnızca “She reads the text quietly.” kalıyor."],
          { kural: "Özne + fiil + nesne + zarf.", dogruNeden: "Zarf (quietly) nesneden sonra gelir." }),
        Q("enlrn.adverb", "uygulama", 1, "Ece is a quick writer. She writes ___ .", "quickly",
          [["quick", "kavrama", "quick sıfattır; fiili zarf niteler."], ["quicker", "kavrama", "quicker karşılaştırma sıfatıdır."], ["quickily", "dikkat", "Doğru yazım: quick + ly = quickly."]],
          "Sıfat: quick. Zarfı nasıl yaparız?",
          [
           "🔎 Soruyu anlayalım: “writes” fiilini niteliyoruz.",
           "💡 Hatırlayalım: quick + ly = quickly.",
           "✏️ Seçenekleri tek tek inceleyelim: “quick” → quick sıfattır; fiili zarf niteler.",
           "✏️ “quicker” → quicker karşılaştırma sıfatıdır.",
           "✅ Sonuç: She writes quickly.",
           "🔁 Kontrol edelim: Son seçenek “quickily” de aradığımız cevap değil: Doğru yazım: quick + ly = quickly. Geriye yalnızca “quickly” kalıyor."],
          { kural: "quick → quickly, slow → slowly.", dogruNeden: "quick + ly = quickly." }),
        Q("enlrn.adverb", "uygulama", 3, "Our teacher is a good speaker. She speaks English very ___ .", "well",
          [["good", "kavrama", "good sıfattır; fiili niteleyen zarfı “well”dir."], ["goodly", "bilgi", "good düzensizdir; -ly almaz."], ["best", "kavrama", "best en üstünlük biçimidir; burada kullanılmaz."]],
          "good kelimesinin zarf hâli düzensizdir.",
          [
           "🔎 Soruyu anlayalım: “speaks” fiilini niteleyen bir zarf gerekir.",
           "💡 Hatırlayalım: good → well (düzensiz).",
           "✏️ Seçenekleri tek tek inceleyelim: “good” → good sıfattır; fiili niteleyen zarfı “well”dir.",
           "✏️ “goodly” → good düzensizdir; -ly almaz.",
           "✅ Sonuç: She speaks English very well.",
           "🔁 Kontrol edelim: Son seçenek “best” de aradığımız cevap değil: best en üstünlük biçimidir; burada kullanılmaz. Geriye yalnızca “well” kalıyor."],
          { kural: "Düzensiz zarflar: good → well, fast → fast, hard → hard.", dogruNeden: "good → well (düzensiz)." }),
        Q("enlrn.adverb", "uygulama", 2, "Which is the correct order? <b>slowly / the new words / reads / Ali</b>", "Ali reads the new words slowly.",
          [["Ali slowly the new words reads.", "kavrama", "Fiil özneden hemen sonra gelmeli."], ["Ali reads slowly the new words.", "kavrama", "Zarf fiil ile nesnenin arasına girmez."], ["The new words reads Ali slowly.", "kavrama", "Özne cümlenin başında olmalı."]],
          "Önce özne, sonra fiil, sonra nesne, en son zarf.",
          [
           "🔎 Soruyu anlayalım: Özne: Ali → fiil: reads.",
           "💡 Hatırlayalım: Nesne: the new words.",
           "✏️ Seçenekleri tek tek inceleyelim: “Ali slowly the new words reads.” → Fiil özneden hemen sonra gelmeli.",
           "✏️ “Ali reads slowly the new words.” → Zarf fiil ile nesnenin arasına girmez.",
           "✅ Sonuç: Zarf en sonda: Ali reads the new words slowly.",
           "🔁 Kontrol edelim: Son seçenek “The new words reads Ali slowly.” de aradığımız cevap değil: Özne cümlenin başında olmalı. Geriye yalnızca “Ali reads the new words slowly.” kalıyor."],
          { kural: "Özne + fiil + nesne + zarf.", dogruNeden: "Nesne: the new words." }),
      ],
    },
  });

  /* =========================================================================
   * THEME 2 — 6) NUMBERS: 100–500 AND 1st–50th
   * ========================================================================= */
  const ADLAR = ["Ali", "Elif", "Mert", "Zeynep", "Can", "Defne", "Emir", "Selin", "Arda", "Ece"];
  const KITAP = ["story", "science", "history", "art", "sports", "poetry"];

  KONU_EKLE("en", {
    id: "en_numbers", tema: "en2", ad: "Numbers: 100–500 and 1st–50th", tr: "Sayılar ve sıra sayıları",
    kazanimlar: [
      { id: "ennum.cardinal", ad: "100–500 arası sayıları okuma ve yazma" },
      { id: "ennum.ordinal", ad: "1st–50th sıra sayılarını okuma ve yazma" },
      { id: "ennum.use", ad: "Sayıları ve sıra sayılarını günlük hayatta kullanma (tarih, sayfa, kat, yarış)" },
    ],
    sozluk: [
      ["number", "sayı"], ["hundred", "yüz"], ["one hundred", "yüz (100)"], ["two hundred and fifty", "iki yüz elli"],
      ["thirteen / thirty", "on üç / otuz"], ["fourteen / forty", "on dört / kırk"], ["first", "birinci"], ["second", "ikinci"],
      ["third", "üçüncü"], ["fifth", "beşinci"], ["twelfth", "on ikinci"], ["twentieth", "yirminci"],
      ["fortieth", "kırkıncı"], ["fiftieth", "ellinci"], ["ordinal number", "sıra sayısı"], ["plus", "artı"],
      ["minus", "eksi"], ["floor", "kat"], ["race", "yarış"], ["date", "tarih"], ["page", "sayfa"],
    ],
    anlatim: [
      { baslik: "100–500 arası sayılar",
        metin: "100 = <b>one hundred</b> (a hundred), 200 = <b>two hundred</b> … 500 = <b>five hundred</b>. <b>hundred</b> sayıdan sonra <b>-s almaz</b>: three hundreds değil, <b>three hundred</b>.<br>İngiliz İngilizcesinde yüzlerden sonra <b>and</b> gelir ve onlar-birler arasına <b>tire (-)</b> konur:<br>245 → <b>two hundred and forty-five</b><br>108 → <b>one hundred and eight</b><br>370 → <b>three hundred and seventy</b><br>Dikkat: <b>thirteen</b> (13) – <b>thirty</b> (30), <b>fourteen</b> (14) – <b>forty</b> (40; “fourty” değil!), <b>fifteen</b> (15) – <b>fifty</b> (50).",
        ornek: "<b>There are four hundred and twelve students in our school.</b>",
        durak: { soru: "How do you write 314 in words?", secenekler: [["three hundred and fourteen", true, "300 = three hundred, 14 = fourteen."], ["three hundred and forty", false, "forty 40'tır; 14 fourteen olarak yazılır."], ["three hundreds and fourteen", false, "hundred çoğul eki almaz."], ["thirty hundred and fourteen", false, "3 yüzlük “three hundred” olarak söylenir."]] } },
      { baslik: "Sıra sayıları (1st–50th)",
        metin: "Sıra sayıları (birinci, ikinci…) çoğunlukla <b>-th</b> ekiyle yapılır: fourth, sixth, tenth.<br>Düzensizler: <b>first (1st), second (2nd), third (3rd), fifth (5th), eighth (8th), ninth (9th), twelfth (12th)</b>.<br>-ty ile bitenlerde y → ie: twenty → <b>twentieth</b>, forty → <b>fortieth</b>.<br>Bileşiklerde yalnızca son kelime değişir: 21st <b>twenty-first</b>, 32nd <b>thirty-second</b>, 43rd <b>forty-third</b>.<br>Kısaltma: sonu 1 → <b>st</b>, 2 → <b>nd</b>, 3 → <b>rd</b>, diğerleri → <b>th</b>. Ama <b>11th, 12th, 13th</b> her zaman -th alır!",
        ornek: "<b>Our classroom is on the second floor. Ece finished the race in 21st place.</b>",
        gorsel: G.tablo(["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "23rd"], [["first", "second", "third", "fourth", "eleventh", "twelfth", "thirteenth", "twenty-first", "twenty-second", "twenty-third"]]),
        durak: { soru: "Hangisi doğru yazılmıştır?", secenekler: [["12th", true, "11, 12 ve 13 her zaman -th alır."], ["12nd", false, "12 -nd almaz; 11, 12, 13 -th alır."], ["13rd", false, "13 -rd almaz; doğrusu 13th."], ["22th", false, "Sonu 2 ile biten 22 “22nd” olur."]] } },
      { baslik: "Sayıları günlük hayatta kullanma",
        metin: "<b>Tarihler</b> sıra sayısıyla okunur: 29th October → “<b>the twenty-ninth of October</b>”. Önüne <b>on</b> gelir: on 23rd April.<br><b>Kat ve sıra</b>: the third floor, the first lesson, in tenth place.<br><b>Miktar</b> sayma sayısıyla söylenir: There are <b>two hundred and fifty</b> pages in this book.<br>Soru kalıpları: <b>How many</b> students are there? — There are three hundred. / <b>What's the date today?</b> — It's the fifth of May.",
        ornek: "<b>— What's the date today? — It's the twenty-third of April. It's Children's Day!</b>",
        durak: { soru: "How do you say “19th May”?", secenekler: [["the nineteenth of May", true, "Tarihte gün sıra sayısıyla okunur: nineteenth."], ["the nineteen of May", false, "Tarihlerde sayma sayısı değil, sıra sayısı kullanılır."], ["the ninth of May", false, "ninth 9. demektir; 19. nineteenth'tir."], ["the ninetieth of May", false, "ninetieth 90. demektir."]] } },
    ],
    uret: {
      "ennum.cardinal": [
        z => {
          const n = R(101, 499);
          return S(zengin({
            kaz: "ennum.cardinal", duzey: "uygulama", zorluk: 2,
            soru: `How do you write <b>${n}</b> in words?`,
            dogru: kelime(n), yanlis: kartYanlis(n),
            ipucu: "Önce yüzler (… hundred), sonra “and”, sonra onlar-birler.",
            cozum: [`${Math.floor(n / 100) * 100} → ${kelime(Math.floor(n / 100) * 100)}.`, n % 100 ? `${n % 100} → ${yuzAlti(n % 100)}.` : "Onlar ve birler basamağı sıfır.", `Birleştir: ${kelime(n)}.`],
            kural: "Yüzlük + and + onlar-birler: two hundred and forty-five.",
          }));
        },
        z => {
          const n = R(101, 499), h = Math.floor(n / 100), t = Math.floor(n % 100 / 10), o = n % 10, y = [];
          if (t !== o && t >= 2 && o) y.push([String(h * 100 + o * 10 + t), "dikkat", "Onlar ve birler basamağı yer değiştirmiş."]);
          if (n % 100 >= 13 && n % 100 <= 19) y.push([String(h * 100 + (n % 100 - 10) * 10), "kavrama", "-teen (13–19) ile -ty (30, 40…) karıştırılmış."]);
          if (o === 0 && t >= 3) y.push([String(h * 100 + 10 + t), "kavrama", "-ty (30, 40…) ile -teen (13–19) karıştırılmış."]);
          y.push([String(n + 100), "dikkat", "Yüzler basamağı yanlış okunmuş."]);
          y.push([String(n + 10), "islem", "Onlar basamağı yanlış okunmuş."]);
          y.push([String(n - 10), "islem", "Onlar basamağı yanlış okunmuş."]);
          return S(zengin({
            kaz: "ennum.cardinal", duzey: "uygulama", zorluk: 1,
            soru: `Which number is <b>${kelime(n)}</b>?`,
            dogru: String(n), yanlis: y,
            ipucu: "Önce “hundred”dan önceki sayıyı, sonra “and”den sonrasını oku.",
            cozum: [`${BIRLER[h]} hundred = ${h * 100}.`, n % 100 ? `${yuzAlti(n % 100)} = ${n % 100}.` : "Sonrasında sayı yok.", `${h * 100} + ${n % 100} = ${n}.`],
            kural: "hundred = yüz; -teen: 13–19, -ty: 20, 30, 40…",
          }));
        },
        z => {
          const a = R(12, 30) * 10, b = R(2, 15) * 10, t = a + b;
          return S(zengin({
            kaz: "ennum.cardinal", duzey: "transfer", zorluk: 2,
            soru: `There are <b>${a}</b> students in our school. This year, <b>${b}</b> new students come. How many students are there now?`,
            dogru: kelime(t),
            yanlis: [[kelime(a - b), "islem", "Toplama yerine çıkarma yapılmış."]].concat(kartYanlis(t)),
            ipucu: "Yeni öğrenciler geliyor: toplama yap.",
            cozum: [`${a} + ${b} = ${t}.`, `${t} sayısını yazıyla yaz.`, `Cevap: ${kelime(t)}.`],
            kural: "plus = artı; How many…? → There are … .",
          }));
        },
        z => {
          const sayilar = new Set(); const h = R(1, 3);
          while (sayilar.size < 4) sayilar.add(h * 100 + R(0, 99) + (sayilar.size === 3 ? 100 : 0));
          const d = [...sayilar], mx = Math.max(...d);
          return S(zengin({
            kaz: "ennum.cardinal", duzey: "aciklama", zorluk: 2,
            soru: "Which number is the <b>biggest</b>?",
            dogru: kelime(mx),
            yanlis: d.filter(x => x !== mx).map(x => [kelime(x), "kavrama", `Bu sayı ${x}; ${mx} daha büyüktür.`]),
            ipucu: "Önce yüzler basamağını (… hundred) karşılaştır.",
            cozum: ["Her sayıyı rakamla yaz: " + d.join(", ") + ".", "Önce yüzler, sonra onlar basamağını karşılaştır.", `En büyük sayı ${mx}: ${kelime(mx)}.`],
            kural: "Karşılaştırırken önce yüzleri (hundred), sonra onlar ve birleri karşılaştır.",
          }));
        },
        z => {
          const step = sec([10, 20, 25, 50]), s = R(Math.ceil(100 / step), Math.floor((500 - 3 * step) / step)) * step, nx = s + 3 * step;
          return S(zengin({
            kaz: "ennum.cardinal", duzey: "uygulama", zorluk: 2,
            soru: `What comes next? <b>${s}, ${s + step}, ${s + 2 * step}, ___</b>`,
            dogru: kelime(nx),
            yanlis: [[kelime(nx + step), "islem", "Bir adım fazla ilerlenmiş."], [kelime(s + 2 * step), "dikkat", "Bu sayı dizide zaten var."], [kelime(nx).replace(" hundred", " hundreds"), "dikkat", "hundred çoğul eki almaz."], [kelime(nx + 1), "islem", `Dizi ${step}'er artıyor, 1 değil.`]],
            ipucu: "Sayılar kaçar kaçar artıyor?",
            cozum: [`Dizi ${step}'er artıyor.`, `${s + 2 * step} + ${step} = ${nx}.`, `${nx} = ${kelime(nx)}.`],
            kural: "Sayı dizilerinde artış miktarını bul, sonra sayıyı yazıyla yaz.",
          }));
        },
        Q("ennum.cardinal", "hatirlama", 1, "How do you say <b>300</b>?", "three hundred",
          [["three hundreds", "dikkat", "hundred bir sayıdan sonra -s almaz."], ["thirty hundred", "kavrama", "thirty 30'dur; 300 = three hundred."], ["three thousand", "bilgi", "thousand bin demektir; 3000 olur."]],
          "hundred = yüz.",
          [
           "🔎 Soruyu anlayalım: 300 = 3 tane yüz.",
           "💡 Hatırlayalım: 3 = three, yüz = hundred.",
           "✏️ Seçenekleri tek tek inceleyelim: “three hundreds” → hundred bir sayıdan sonra -s almaz.",
           "✏️ “thirty hundred” → thirty 30'dur; 300 = three hundred.",
           "✅ Sonuç: hundred çoğul eki almaz: three hundred.",
           "🔁 Kontrol edelim: Son seçenek “three thousand” de aradığımız cevap değil: thousand bin demektir; 3000 olur. Geriye yalnızca “three hundred” kalıyor."],
          { kural: "two hundred, three hundred (hundreds değil).", dogruNeden: "3 = three, yüz = hundred." }),
      ],
      "ennum.ordinal": [
        z => {
          const n = R(1, 50), dogru = siraKisa(n);
          return S(zengin({
            kaz: "ennum.ordinal", duzey: "uygulama", zorluk: 1,
            soru: `What is the short form of <b>${siraKelime(n)}</b>?`,
            dogru,
            yanlis: ["st", "nd", "rd", "th"].filter(e => e !== ekSira(n)).map(e => [n + e, n % 100 >= 11 && n % 100 <= 13 ? "dikkat" : "kavrama", n % 100 >= 11 && n % 100 <= 13 ? "11, 12 ve 13 her zaman -th alır." : `Sonu ${n % 10} ile biten sayı ${dogru} şeklinde yazılır.`]),
            ipucu: "Sayının son rakamına bak: 1 → st, 2 → nd, 3 → rd, diğerleri → th (11, 12, 13 hariç).",
            cozum: [`${siraKelime(n)} = ${n}.`, n % 100 >= 11 && n % 100 <= 13 ? "11, 12 ve 13 istisnadır; -th alır." : `Son rakam ${n % 10} → -${ekSira(n)}.`, `Cevap: ${dogru}.`],
            kural: "1st, 2nd, 3rd, 4th… 11th, 12th, 13th… 21st, 22nd, 23rd.",
          }));
        },
        z => {
          const n = R(1, 50), dogru = siraKelime(n);
          return S(zengin({
            kaz: "ennum.ordinal", duzey: "uygulama", zorluk: 2,
            soru: `How do you write <b>${siraKisa(n)}</b> in words?`,
            dogru,
            yanlis: [[safTh(n), "dikkat", "Sıra sayısı yanlış yazılmış; düzensiz biçimleri hatırla (first, second, third, fifth, ninth, twelfth, -tieth)."], [kelime(n), "kavrama", "Bu sayma sayısıdır; sıra sayısı gerekir."], [siraKelime(n === 50 ? 49 : n + 1), "islem", "Bu, bir sonraki sıra sayısıdır."], [siraKelime(n === 1 ? 3 : n - 1), "islem", "Bu, başka bir sıra sayısıdır."]],
            ipucu: "Bileşik sayılarda yalnızca son kelime sıra sayısı olur: twenty-first.",
            cozum: [`${siraKisa(n)} = ${n}. sıra.`, n > 20 && n % 10 ? `Onlar aynen kalır (${ONLAR[Math.floor(n / 10)]}), birler sıra sayısı olur (${SIRA_BIR[n % 10]}).` : "Bu sayının sıra biçimi tek kelimedir.", `Cevap: ${dogru}.`],
            kural: "first, second, third, fifth, eighth, ninth, twelfth, twentieth, fortieth…",
          }));
        },
        z => {
          const k = R(2, 48), ad = sec(ADLAR), p = k + 1, yan = ["st", "nd", "rd", "th"].filter(e => e !== ekSira(p));
          return S(zengin({
            kaz: "ennum.ordinal", duzey: "transfer", zorluk: 2,
            soru: `In a race, <b>${k}</b> runners finish before ${ad}. What is ${ad}'s position?`,
            dogru: siraKisa(p),
            yanlis: [[siraKisa(k), "islem", `Önde ${k} kişi var; ${ad} onlardan sonraki sıradadır.`], [siraKisa(k + 2), "islem", "Bir fazla sayılmış."], [p + yan[0], "dikkat", "Sıra sayısının eki yanlış."]],
            ipucu: "Önde kaç kişi var? Bu koşucu kaçıncı olur?",
            cozum: [`Önde ${k} koşucu var.`, `${ad} onlardan sonra gelir: ${k} + 1 = ${p}.`, `Cevap: ${siraKisa(p)} (${siraKelime(p)}).`],
            kural: "position = sıra, derece (1st, 2nd, 3rd…).",
          }));
        },
        z => {
          const adlar = karistir(ADLAR).slice(0, 4), nolar = karistir(Array.from({ length: 50 }, (_, i) => i + 1)).slice(0, 4).sort((a, b) => a - b);
          const j = R(0, 3);
          return S(zengin({
            kaz: "ennum.ordinal", duzey: "uygulama", zorluk: 1,
            soru: `Look at the class list. Who is <b>${siraKelime(nolar[j])}</b> on the list?`,
            gorsel: G.tablo(["No.", "Name"], nolar.map((x, i) => [x, adlar[i]])),
            dogru: adlar[j],
            yanlis: adlar.filter((a, i) => i !== j).map(a => [a, "dikkat", `${a} listede ${nolar[adlar.indexOf(a)]} numaradadır.`]),
            ipucu: `${siraKelime(nolar[j])} kaçıncı demek?`,
            cozum: [`${siraKelime(nolar[j])} = ${siraKisa(nolar[j])} = ${nolar[j]}.`, `Listede ${nolar[j]} numarayı bul.`, `Cevap: ${adlar[j]}.`],
            kural: "Sıra sayısı kelimesini önce rakama çevir.",
          }));
        },
        Q("ennum.ordinal", "hatirlama", 2, "Which word is spelled correctly?", "twelfth",
          [["twelveth", "dikkat", "twelve'in sıra sayısında “ve” → “f” olur: twelfth."], ["twelvth", "dikkat", "Doğru yazım: twelfth."], ["twelfeth", "dikkat", "Fazladan “e” var; doğru yazım: twelfth."]],
          "five → fifth gibi, twelve → ?",
          [
           "🔎 Soruyu anlayalım: twelve düzensiz bir sıra sayısıdır.",
           "💡 Hatırlayalım: “ve” yerine “f” gelir, ardından -th.",
           "✏️ Seçenekleri tek tek inceleyelim: “twelveth” → twelve'in sıra sayısında “ve” → “f” olur: twelfth.",
           "✏️ “twelvth” → Doğru yazım: twelfth.",
           "✅ Sonuç: twelfth.",
           "🔁 Kontrol edelim: Son seçenek “twelfeth” de aradığımız cevap değil: Fazladan “e” var; doğru yazım: twelfth. Geriye yalnızca “twelfth” kalıyor."],
          { kural: "five → fifth, twelve → twelfth.", dogruNeden: "“ve” yerine “f” gelir, ardından -th." }),
        Q("ennum.ordinal", "aciklama", 2, "Which one is <b>wrong</b>?", "22th",
          [["21st", "kavrama", "21 sonu 1 ile bitiyor: 21st doğrudur."], ["13th", "kavrama", "13 her zaman -th alır: doğrudur."], ["42nd", "kavrama", "42 sonu 2 ile bitiyor: 42nd doğrudur."]],
          "Her sayının son rakamına bak.",
          [
           "🔎 Soruyu anlayalım: 21 → st, 13 → th (istisna), 42 → nd.",
           "💡 Hatırlayalım: 22 sonu 2 ile bittiği için -nd almalı.",
           "✏️ Seçenekleri tek tek inceleyelim: “21st” → 21 sonu 1 ile bitiyor: 21st doğrudur.",
           "✏️ “13th” → 13 her zaman -th alır: doğrudur.",
           "✅ Sonuç: Yanlış olan: 22th (doğrusu 22nd).",
           "🔁 Kontrol edelim: Son seçenek “42nd” de aradığımız cevap değil: 42 sonu 2 ile bitiyor: 42nd doğrudur. Geriye yalnızca “22th” kalıyor."],
          { kural: "Sonu 2 → nd (22nd, 32nd), ama 12th.", dogruNeden: "22 sonu 2 ile bittiği için -nd almalı." }),
      ],
      "ennum.use": [
        z => {
          const d = R(1, 28), ay = sec(AYLAR);
          return S(zengin({
            kaz: "ennum.use", duzey: "uygulama", zorluk: 2,
            soru: `How do you say this date? <b>${siraKisa(d)} ${ay}</b>`,
            dogru: `the ${siraKelime(d)} of ${ay}`,
            yanlis: [[`the ${kelime(d)} of ${ay}`, "kavrama", "Tarihlerde gün sıra sayısıyla okunur."], [`the ${safTh(d)} of ${ay}`, "dikkat", "Sıra sayısı yanlış yazılmış."], [`the ${siraKelime(d + 10)} of ${ay}`, "dikkat", "Gün yanlış okunmuş."], [`the ${siraKelime(d + 1)} of ${ay}`, "islem", "Bir sonraki gün okunmuş."]],
            ipucu: "Tarihte gün sıra sayısıyla okunur: the … of …",
            cozum: [`${siraKisa(d)} = ${siraKelime(d)}.`, "Kalıp: the + sıra sayısı + of + ay.", `Cevap: the ${siraKelime(d)} of ${ay}.`],
            kural: "Tarih okuma: 5th May → the fifth of May.",
          }));
        },
        z => {
          const m = sec(MILLI), diger = MILLI.filter(x => x.gun !== m.gun);
          return S(zengin({
            kaz: "ennum.use", duzey: "baglanti", zorluk: 2,
            soru: `Complete the sentence: <b>${m.ad}</b> is on the ___ of ${AYLAR[m.ay]}.`,
            dogru: siraKelime(m.gun),
            yanlis: [[kelime(m.gun), "kavrama", "Tarihte sayma sayısı değil, sıra sayısı kullanılır."], [safTh(m.gun), "dikkat", "Sıra sayısının yazımı yanlış."]].concat(diger.map(x => [siraKelime(x.gun), "bilgi", `Bu gün ${x.ad} tarihidir.`])),
            ipucu: "Theme 1'deki millî günler tablosunu hatırla.",
            cozum: [`${m.ad}: ${siraKisa(m.gun)} ${AYLAR[m.ay]}.`, `${m.gun} → ${siraKelime(m.gun)}.`, `Cevap: the ${siraKelime(m.gun)} of ${AYLAR[m.ay]}.`],
            kural: "Tarihlerde gün sıra sayısıyla söylenir.",
          }));
        },
        z => {
          const tur = karistir(KITAP).slice(0, 4), deg = new Set();
          while (deg.size < 4) deg.add(R(10, 50) * 10 + sec([0, 0, 5]));
          const d = [...deg], j = R(0, 3);
          return S(zengin({
            kaz: "ennum.use", duzey: "uygulama", zorluk: 2,
            soru: `Look at the school library table. How many <b>${tur[j]}</b> books are there?`,
            gorsel: G.tablo(["Books", "How many?"], tur.map((t, i) => [t, d[i]])),
            dogru: "There are " + kelime(d[j]) + ".",
            yanlis: d.filter((x, i) => i !== j).map((x, i) => ["There are " + kelime(x) + ".", "dikkat", "Tabloda başka bir satır okunmuş."]).concat([["There are " + kelime(d[j]).replace(" hundred", " hundreds") + ".", "dikkat", "hundred çoğul eki almaz."]]),
            ipucu: `Tabloda “${tur[j]}” satırını bul ve sayıyı yazıyla oku.`,
            cozum: [`“${tur[j]}” satırında ${d[j]} yazıyor.`, `${d[j]} = ${kelime(d[j])}.`, `Cevap: There are ${kelime(d[j])}.`],
            kural: "How many…? → There are + sayı.",
          }));
        },
        z => {
          const n = R(30, 50) * 10, p = R(5, 20) * 10, kalan = n - p;
          return S(zengin({
            kaz: "ennum.use", duzey: "transfer", zorluk: 3,
            soru: `📘 Kerem's book has <b>${n}</b> pages. He is on page <b>${p}</b>. How many pages are left?`,
            dogru: kelime(kalan),
            yanlis: [[kelime(n + p), "islem", "Çıkarma yerine toplama yapılmış."]].concat(kartYanlis(kalan)),
            ipucu: "Kalan sayfa = toplam sayfa − okunan sayfa.",
            cozum: [`Toplam ${n} sayfa, okunan ${p} sayfa.`, `${n} − ${p} = ${kalan}.`, `Cevap: ${kelime(kalan)}.`],
            kural: "minus = eksi; left = kalan.",
          }));
        },
        Q("ennum.use", "uygulama", 1, "Our classroom is on the ___ floor. (3)", "third",
          [["three", "kavrama", "Kat söylerken sıra sayısı kullanılır."], ["threeth", "dikkat", "three'nin sıra sayısı düzensizdir: third."], ["thirdth", "dikkat", "third zaten sıra sayısıdır; -th eklenmez."]],
          "Kaçıncı kat? Sıra sayısı kullan.",
          [
           "🔎 Soruyu anlayalım: Kat numarası sıra sayısıyla söylenir.",
           "💡 Hatırlayalım: 3 → third (düzensiz).",
           "✏️ Seçenekleri tek tek inceleyelim: “three” → Kat söylerken sıra sayısı kullanılır.",
           "✏️ “threeth” → three'nin sıra sayısı düzensizdir: third.",
           "✅ Sonuç: on the third floor.",
           "🔁 Kontrol edelim: Son seçenek “thirdth” de aradığımız cevap değil: third zaten sıra sayısıdır; -th eklenmez. Geriye yalnızca “third” kalıyor."],
          { kural: "on the first / second / third floor.", dogruNeden: "3 → third (düzensiz)." }),
        Q("ennum.use", "transfer", 2, "— How many students are there in your school?<br>— ___ (320)", "There are three hundred and twenty students.",
          [["There is three hundred and twenty students.", "kavrama", "Çoğul isimle “There are” kullanılır."], ["There are three hundreds and twenty students.", "dikkat", "hundred çoğul eki almaz."], ["There are three hundred and twelve students.", "dikkat", "twelve 12'dir; 20 twenty'dir."]],
          "Hem sayının yazılışına hem There is/are'a dikkat et.",
          [
           "🔎 Soruyu anlayalım: 320 = three hundred and twenty.",
           "💡 Hatırlayalım: students çoğul → There are.",
           "✏️ Seçenekleri tek tek inceleyelim: “There is three hundred and twenty students.” → Çoğul isimle “There are” kullanılır.",
           "✏️ “There are three hundreds and twenty students.” → hundred çoğul eki almaz.",
           "✅ Sonuç: There are three hundred and twenty students.",
           "🔁 Kontrol edelim: Son seçenek “There are three hundred and twelve students.” de aradığımız cevap değil: twelve 12'dir; 20 twenty'dir. Geriye yalnızca “There are three hundred and twenty students.” kalıyor."],
          { kural: "How many…? → There are + sayı + çoğul isim.", dogruNeden: "students çoğul → There are." }),
      ],
    },
  });
})();
