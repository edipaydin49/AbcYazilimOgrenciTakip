/* 6. sınıf İngilizce — Theme 1 (School Life) ve Theme 2 (Classroom Life).
 * Konular: Roles and Responsibilities at School · School Routines · National Days and Celebrations ·
 * Daily and Study Routines · Learning Activities in the Classroom · Numbers (100–500, 1st–50th).
 */
(function () {
  "use strict";
  const { R, sec, karistir, S, Q, G } = OGR;

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
          ["Soru: Kütüphanede kitap bulmamıza kim yardım eder?", "library = kütüphane, librarian = kütüphane görevlisi.", "Cevap: the librarian."],
          { kural: "librarian: kütüphane görevlisi; library: kütüphane." }),
        Q("enrol.roles", "hatirlama", 1, "“school counsellor” ne demektir?", "rehber öğretmen",
          [["okul müdürü", "bilgi", "Okul müdürü “headteacher” demektir."], ["kütüphane görevlisi", "bilgi", "Kütüphane görevlisi “librarian” demektir."], ["sınıf başkanı", "bilgi", "Sınıf başkanı “class monitor” demektir."]],
          "Counsellor, öğrencileri dinleyen ve onlara yol gösteren kişidir.",
          ["counsellor = danışman, rehber.", "Okulda öğrencilerin sorunlarını dinleyen kişi rehber öğretmendir.", "school counsellor = rehber öğretmen."],
          { kural: "school counsellor: rehber öğretmen; headteacher: okul müdürü." }),
        Q("enrol.roles", "hatirlama", 1, "“Okul müdürü” İngilizcede nasıl söylenir?", "headteacher",
          [["caretaker", "bilgi", "caretaker okulun temizlik ve bakımıyla ilgilenen görevlidir."], ["class monitor", "bilgi", "class monitor sınıf başkanıdır."], ["deputy head", "kavrama", "deputy head müdür yardımcısıdır."]],
          "head = baş, en üstteki kişi.",
          ["Okulu yöneten kişi okul müdürüdür.", "İngilizcede okul müdürüne “headteacher” denir.", "deputy head ise müdür yardımcısıdır."],
          { kural: "headteacher: okul müdürü; deputy head: müdür yardımcısı." }),
        Q("enrol.roles", "uygulama", 2, "Read the text and answer.<br><i>Hi! I'm Kerem. I'm the class monitor in 6-B. I collect the homework and give it to our teacher. When the teacher isn't in the classroom, I keep the class quiet.</i><br>What does Kerem do?", "He collects the homework.",
          [["He cooks lunch for the students.", "dikkat", "Metinde yemek pişirmekten söz edilmiyor; bu aşçının görevidir."], ["He checks the school gate.", "dikkat", "Kapıyı kontrol etmek güvenlik görevlisinin işidir."], ["He teaches English.", "kavrama", "Kerem bir öğrencidir; ders vermez."]],
          "Metinde “I collect…” cümlesini bul.",
          ["Metin Kerem'in sınıf başkanı olduğunu söylüyor.", "“I collect the homework and give it to our teacher.” cümlesi görevini anlatıyor.", "Cevap: He collects the homework."],
          { kural: "Okuma sorularında cevabı metindeki cümleyle karşılaştır; metinde olmayanı seçme." }),
        Q("enrol.roles", "uygulama", 2, "It's ___ job to cook meals for the students.", "the cook's",
          [["the cooks", "dikkat", "Sahiplik için kesme işareti gerekir: the cook's job."], ["the cook", "kavrama", "“job” kime ait? Sahiplik eki 's eksik."], ["the cook is", "kavrama", "Burada fiil değil, sahiplik (… 'nın işi) gerekir."]],
          "“Aşçının işi” derken aşçıya hangi eki ekleriz?",
          ["Cümle “Öğrencilere yemek pişirmek ___ işidir.” diyor.", "Sahipliği tekil isimde 's ile gösteririz: the cook's.", "Doğru cümle: It's the cook's job to cook meals."],
          { kural: "Sahiplik: isim + 's → the monitor's job, Ali's book." }),
        Q("enrol.roles", "transfer", 2, "— Who is the leader of the science club?<br>— ___", "Ayşe is. She plans our meetings.",
          [["Yes, she is.", "kavrama", "“Who” sorusu evet/hayır ile cevaplanmaz; bir kişi söylenmelidir."], ["It's on Monday.", "kavrama", "Bu cevap “When?” (ne zaman) sorusuna uygundur."], ["In the science lab.", "kavrama", "Bu cevap “Where?” (nerede) sorusuna uygundur."]],
          "Who = kim. Cevapta bir kişi olmalı.",
          ["Soru: Bilim kulübünün lideri kim?", "“Who” sorusuna kişi adıyla cevap veririz.", "Doğru cevap: Ayşe is. She plans our meetings."],
          { kural: "Who → kişi, When → zaman, Where → yer sorar." }),
        Q("enrol.roles", "aciklama", 1, "Which sentence is <b>wrong</b>?", "The cook manages the school.",
          [["The librarian helps us find books.", "bilgi", "Bu cümle doğrudur; kütüphane görevlisi kitap bulmamıza yardım eder."], ["The school nurse looks after sick students.", "bilgi", "Bu cümle doğrudur."], ["The security guard checks the school gate.", "bilgi", "Bu cümle doğrudur."]],
          "Okulu kim yönetir?",
          ["Her cümledeki görevi kontrol et.", "Okulu yöneten kişi “the headteacher”dır, aşçı değil.", "Yanlış cümle: The cook manages the school."],
          { kural: "manage: yönetmek; okulu headteacher yönetir." }),
      ],
      "enrol.article": [
        Q("enrol.article", "uygulama", 1, "Choose the correct answer: I have ___ apple.", "an",
          [["a", "kavrama", "“apple” sesli harfle (a) başladığı için “an” kullanılır."], ["the", "kavrama", "İlk kez söz edilen tek bir nesne için a/an kullanılır."], ["–", "bilgi", "Tekil sayılabilen isimlerin önüne a/an gerekir."]],
          "Kelime sesli harfle mi başlıyor?",
          ["Boşluktan sonraki kelime “apple”.", "“apple” sesli harf sesiyle başlar (a).", "Sesli harfle başlayan tekil isimlerden önce “an” gelir: an apple."],
          { kural: "a + sessiz harf sesi (a book), an + sesli harf sesi (an apple, an hour)." }),
        Q("enrol.article", "uygulama", 1, "Look at ___ board, please.", "the",
          [["a", "kavrama", "Sınıftaki tahta herkesin bildiği belirli bir tahtadır; “the” gerekir."], ["an", "kavrama", "“board” sessiz harfle başlar ve burada belirli bir nesnedir."], ["–", "bilgi", "Tekil sayılabilen isim tek başına kullanılmaz."]],
          "Sınıfta herkes hangi tahtadan söz edildiğini biliyor mu?",
          ["Öğretmen sınıftaki tahtayı kastediyor.", "Herkesin bildiği, belirli şeyler için “the” kullanırız.", "Doğru cevap: Look at the board, please."],
          { kural: "the: belirli, bilinen ya da tek olan şeyler (the board, the headteacher)." }),
        Q("enrol.article", "uygulama", 2, "There is ___ university near our school.", "a",
          [["an", "dikkat", "“university” u harfiyle yazılır ama “yu” sesiyle başlar; bu bir sessiz sestir."], ["the", "kavrama", "Üniversiteden ilk kez söz ediliyor; a/an gerekir."], ["–", "bilgi", "Tekil sayılabilen isimden önce a/an gerekir."]],
          "Harfe değil, ilk sese dikkat et: /yu/niversity.",
          ["Kural yazılışa değil, ilk sese bakar.", "“university” kelimesi /yu/ sesiyle başlar; bu sessiz bir sestir.", "Bu yüzden “a university” deriz."],
          { kural: "a university, a uniform (yu- sesi) — an umbrella (a sesi)." }),
        Q("enrol.article", "uygulama", 2, "The school trip takes ___ hour by bus.", "an",
          [["a", "dikkat", "“hour” kelimesinde h okunmaz; kelime sesli harf sesiyle başlar."], ["the", "kavrama", "Burada belirli bir saat değil, “bir saat” anlatılıyor."], ["–", "bilgi", "“hour” tekil ve sayılabilir; a/an gerekir."]],
          "“hour” nasıl okunur? H harfi duyuluyor mu?",
          ["“hour” /aur/ diye okunur; h sessizdir.", "İlk ses sesli harf sesidir.", "Bu yüzden “an hour” deriz."],
          { kural: "an hour, an honest boy: h okunmazsa an kullanılır." }),
        Q("enrol.article", "aciklama", 2, "Which is correct?", "I have a dog. The dog is very friendly.",
          [["I have the dog. A dog is very friendly.", "kavrama", "İlk söyleyişte a, ikinci söyleyişte the kullanılır; burada tersi yapılmış."], ["I have an dog. The dog is very friendly.", "dikkat", "“dog” sessiz harfle başlar; “an” değil “a” gelir."], ["I have dog. Dog is very friendly.", "bilgi", "Tekil sayılabilen isimler tek başına kullanılmaz."]],
          "İlk kez söylerken ve ikinci kez söylerken hangi tanımlık gelir?",
          ["Köpekten ilk kez söz ederken “a dog” deriz.", "Aynı köpekten tekrar söz ederken artık belirlidir: “the dog”.", "Doğru seçenek: I have a dog. The dog is very friendly."],
          { kural: "İlk söyleyiş: a/an. Tekrar söyleyiş (artık belli): the." }),
        Q("enrol.article", "uygulama", 1, "Mr Yılmaz is ___ teacher. He teaches maths.", "a",
          [["an", "kavrama", "“teacher” sessiz harf sesiyle (t) başlar."], ["the", "kavrama", "Bir kişinin mesleğini söylerken a/an kullanırız."], ["–", "bilgi", "İngilizcede meslekten önce a/an gerekir."]],
          "Meslek söylerken tekil isimden önce ne gelir?",
          ["Mesleği söylerken a/an kullanırız: He is a teacher.", "“teacher” sessiz harf sesiyle başlar.", "Cevap: a."],
          { kural: "Meslekler: He is a teacher. She is an engineer." }),
      ],
      "enrol.rules": [
        Q("enrol.rules", "hatirlama", 1, "Which rule means “Koridorda koşmayın.”?", "Don't run in the corridor.",
          [["Run in the corridor.", "kavrama", "Bu olumlu bir emirdir: “Koridorda koşun.”"], ["Doesn't run in the corridor.", "bilgi", "Emir cümlesinde “doesn't” kullanılmaz."], ["Not run in the corridor.", "bilgi", "Olumsuz emir “Don't” ile başlar."]],
          "Olumsuz emir hangi kelimeyle başlar?",
          ["Koşmayın = olumsuz emir.", "Olumsuz emir: Don't + fiilin yalın hâli.", "Doğru cevap: Don't run in the corridor."],
          { kural: "Olumsuz emir: Don't + fiil (Don't run, Don't shout)." }),
        Q("enrol.rules", "uygulama", 1, "___ your hand before you speak.", "Raise",
          [["Raises", "kavrama", "Emir cümlesinde fiil -s almaz."], ["Raising", "kavrama", "Emir cümlesi fiilin yalın hâliyle başlar, -ing almaz."], ["To raise", "bilgi", "Emir cümlesi “to” ile başlamaz."]],
          "Emir cümlesinde fiil hangi hâldedir?",
          ["Bu bir sınıf kuralı, yani emir cümlesi.", "Emir cümlesi fiilin yalın hâliyle başlar.", "Doğru cevap: Raise your hand before you speak."],
          { kural: "Emir cümlesi: fiilin yalın hâli + … (Raise your hand. Listen carefully.)" }),
        Q("enrol.rules", "aciklama", 1, "Look at the class rules. Which one is NOT a good class rule?", "Throw rubbish on the floor.",
          [["Keep the classroom clean.", "kavrama", "Bu iyi bir kuraldır: Sınıfı temiz tut."], ["Listen to your teacher.", "kavrama", "Bu iyi bir kuraldır: Öğretmenini dinle."], ["Be kind to your friends.", "kavrama", "Bu iyi bir kuraldır: Arkadaşlarına nazik ol."]],
          "Hangi davranış sınıfa zarar verir?",
          ["Her kuralı Türkçeye çevir.", "“Throw rubbish on the floor.” = Çöpleri yere at.", "Bu iyi bir kural değildir; doğrusu “Don't throw rubbish on the floor.” olmalıdır."],
          { gorsel: G.tablo(["✅ Do", "❌ Don't"], [["Listen to your teacher.", "Don't shout."], ["Keep the classroom clean.", "Don't eat during lessons."], ["Be kind to your friends.", "Don't run in the corridor."]]), kural: "Do: yapılması gerekenler; Don't: yapılmaması gerekenler." }),
        Q("enrol.rules", "uygulama", 1, "The teacher says: “___ talk during the exam!”", "Don't",
          [["Doesn't", "bilgi", "Emir cümlesinde özne olmadığı için “doesn't” kullanılmaz."], ["Not", "bilgi", "Olumsuz emir “Not” ile değil “Don't” ile başlar."], ["No", "kavrama", "“No talking” kullanılabilir ama “No talk” yanlıştır."]],
          "Olumsuz emir kalıbını hatırla.",
          ["Öğretmen sınavda konuşmayı yasaklıyor.", "Yasak bildiren emir: Don't + fiil.", "Doğru cevap: Don't talk during the exam!"],
          { kural: "Don't + fiil = …ma / …me (Don't talk = Konuşma)." }),
        Q("enrol.rules", "uygulama", 2, "This is Mr Kaya, our new teacher. Please, give ___ your homework.", "him",
          [["he", "kavrama", "“he” özne zamiridir; fiilden sonra nesne zamiri “him” gelir."], ["his", "kavrama", "“his” iyelik sıfatıdır (onun …); burada nesne gerekir."], ["her", "dikkat", "Mr Kaya bir erkektir; “her” kadınlar için kullanılır."]],
          "Fiilden (give) sonra hangi zamir gelir?",
          ["Mr Kaya bir erkek: he → him.", "Fiilden sonra nesne zamiri kullanırız.", "Doğru cevap: give him your homework."],
          { kural: "Nesne zamirleri: me, you, him, her, it, us, them (Help him. Listen to me.)" }),
        Q("enrol.rules", "uygulama", 2, "The students are noisy. The teacher says: “Be quiet, please. Listen to ___.”", "me",
          [["I", "kavrama", "“I” öznedir; “to” edatından sonra nesne zamiri “me” gelir."], ["my", "kavrama", "“my” iyelik sıfatıdır; kendinden sonra bir isim ister."], ["mine", "kavrama", "“mine” benimki demektir; burada “beni” anlamı gerekir."]],
          "“Beni dinleyin.” cümlesinde “beni” hangi zamirdir?",
          ["Öğretmen kendini kastediyor: I → me.", "“listen to” kalıbından sonra nesne zamiri gelir.", "Doğru cevap: Listen to me."],
          { kural: "I → me, we → us, they → them (nesne olarak)." }),
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
          ["“every day” rutin anlatır → geniş zaman.", "Özne Mert = he; fiil -s/-es alır.", "go → goes: Mert goes to school by bus every day."],
          { kural: "he / she / it + fiil-s: goes, watches, has, studies." }),
        Q("enrut.present", "uygulama", 1, "My friends and I ___ lunch in the canteen.", "have",
          [["has", "kavrama", "Özne “my friends and I” = we; fiil -s almaz."], ["having", "bilgi", "Geniş zamanda -ing kullanılmaz."], ["haves", "dikkat", "“have” fiili he/she ile “has” olur; “haves” diye bir biçim yoktur."]],
          "“My friends and I” hangi zamire eşittir?",
          ["My friends and I = we.", "we öznesiyle fiil yalın hâlde kalır.", "Doğru cevap: have."],
          { kural: "I / you / we / they + fiilin yalın hâli." }),
        Q("enrut.present", "uygulama", 2, "___ your sister walk to school?", "Does",
          [["Do", "kavrama", "“your sister” = she; soru “Does” ile kurulur."], ["Is", "kavrama", "Cümlede ana fiil (walk) var; geniş zaman sorusu Do/Does ile kurulur."], ["Are", "kavrama", "“Are” çoğul ya da “you” ile kullanılır ve ana fiille kullanılmaz."]],
          "Ana fiil var mı? Özne kim?",
          ["Ana fiil “walk”, yani geniş zaman sorusu.", "Özne your sister = she.", "she için soru: Does she walk…? → Does your sister walk to school?"],
          { kural: "Soru: Do (I/you/we/they) / Does (he/she/it) + özne + fiil?" }),
        Q("enrut.present", "uygulama", 2, "Elif ___ eat in the canteen. She brings her lunch from home.", "doesn't",
          [["don't", "kavrama", "Elif = she; olumsuzda “doesn't” kullanılır."], ["isn't", "kavrama", "Ana fiil (eat) varken “isn't” kullanılmaz."], ["not", "bilgi", "Olumsuz geniş zaman yardımcı fiil ister: doesn't."]],
          "Olumsuz cümlede he/she ile hangi yardımcı fiil gelir?",
          ["Elif = she.", "Geniş zaman olumsuz: she doesn't + fiilin yalın hâli.", "Doğru cevap: Elif doesn't eat in the canteen."],
          { kural: "Olumsuz: don't (I/you/we/they), doesn't (he/she/it) + fiil." }),
        Q("enrut.present", "uygulama", 1, "Look at the timetable. When does the lunch break start?", "At 12:10.",
          [["At 10:00.", "dikkat", "10:00 teneffüs (break) saatidir."], ["At 08:30.", "dikkat", "08:30 derslerin başladığı saattir."], ["At 15:20.", "dikkat", "15:20 okulun bittiği saattir."]],
          "Tabloda “Lunch break” satırını bul.",
          ["Tabloda her saatin karşısında bir rutin var.", "“Lunch break” satırındaki saat 12:10.", "Cevap: At 12:10."],
          { gorsel: G.tablo(["Time", "Routine"], [["08:30", "Lessons start"], ["10:00", "Break"], ["12:10", "Lunch break"], ["15:20", "School finishes"]]), kural: "Saat söylerken “at” kullanılır: at 12:10, at 8 o'clock." }),
        Q("enrut.present", "aciklama", 2, "Which sentence is correct?", "He studies English after school.",
          [["He study English after school.", "kavrama", "he öznesiyle fiil -s almalı."], ["He studys English after school.", "dikkat", "Sessiz harf + y ile biten fiillerde y düşer, -ies gelir: studies."], ["He is studies English after school.", "bilgi", "“is” ile geniş zaman fiili birlikte kullanılmaz."]],
          "study fiili he öznesiyle nasıl yazılır?",
          ["Özne he; fiil -s almalı.", "study sessiz harf + y ile biter: y düşer, -ies eklenir.", "Doğru: He studies English after school."],
          { kural: "study → studies, carry → carries; ama play → plays (sesli harf + y)." }),
      ],
      "enrut.freq": [
        z => {
          const [ad, zamir] = sec(KISILER), [r3, rYalin, emo] = sec(RUTIN), f = sec(SIKLIK);
          const gunler = karistir(GUNLER.map((g, i) => i)).slice(0, f.k);
          const satir = GUNLER.map((g, i) => gunler.includes(i) ? "✔️" : "–");
          const diger = ["always", "usually", "sometimes", "never"].filter(x => x !== f.ad);
          return S({
            kaz: "enrut.freq", duzey: "uygulama", zorluk: 2,
            soru: `${emo} Look at the table. Complete the sentence:<br><b>${ad} ___ ${r3}.</b>`,
            gorsel: G.tablo(GUNLER, [satir]),
            dogru: f.ad,
            yanlis: diger.map(x => [x, "dikkat", `Tabloda ${f.k} gün işaretli; bu sıklık “${x}” ile anlatılmaz.`]),
            ipucu: "Haftada kaç gün işaretli? 7 gün → always, hiç → never.",
            cozum: [`Tabloda ${f.k} gün işaretlenmiş.`, "7/7 → always, 5–6 → usually, 2–3 → sometimes, 0 → never.", `Bu yüzden: ${ad} ${f.ad} ${r3}.`],
            kural: "always (%100) – usually – often – sometimes – never (%0).",
          });
        },
        Q("enrut.freq", "hatirlama", 1, "“usually” ne demektir?", "genellikle",
          [["her zaman", "bilgi", "her zaman = always."], ["bazen", "bilgi", "bazen = sometimes."], ["asla", "bilgi", "asla = never."]],
          "Sıklık sırası: always – usually – often – sometimes – never.",
          ["usually, always'tan sonra gelen yüksek bir sıklıktır.", "Türkçede “genellikle” anlamına gelir.", "Cevap: genellikle."],
          { kural: "usually = genellikle, often = sık sık, sometimes = bazen." }),
        Q("enrut.freq", "uygulama", 2, "Which is the correct order? <b>always / Tom / breakfast / has</b>", "Tom always has breakfast.",
          [["Tom has always breakfast.", "kavrama", "Sıklık zarfı ana fiilden (has) önce gelir."], ["Always Tom has breakfast.", "kavrama", "Sıklık zarfı özneden önce değil, ana fiilden önce gelir."], ["Tom has breakfast always.", "kavrama", "“always” cümlenin sonuna konmaz; ana fiilden önce gelir."]],
          "Ana fiil hangisi? Zarf onun neresine gelir?",
          ["Özne: Tom, ana fiil: has.", "Sıklık zarfı ana fiilden önce gelir.", "Doğru sıra: Tom always has breakfast."],
          { kural: "Özne + sıklık zarfı + ana fiil (Tom always has…)." }),
        Q("enrut.freq", "uygulama", 2, "Which sentence is correct?", "She is usually on time.",
          [["She usually is on time.", "kavrama", "“be” fiiliyle sıklık zarfı fiilden sonra gelir: is usually."], ["Usually she on time is.", "kavrama", "Kelime sırası bozulmuş."], ["She is on time usually always.", "dikkat", "İki sıklık zarfı birlikte kullanılmaz ve sıra yanlıştır."]],
          "Cümlede “is” var. Zarf ondan önce mi, sonra mı?",
          ["Cümlenin fiili “is” (be fiili).", "be fiiliyle sıklık zarfı fiilden sonra gelir.", "Doğru: She is usually on time."],
          { kural: "am / is / are + sıklık zarfı (He is never late.)" }),
        Q("enrut.freq", "transfer", 1, "Selin brushes her teeth every morning and every evening. She ___ forgets it.", "never",
          [["always", "kavrama", "Selin dişlerini her gün fırçalıyor; unutmayı “her zaman” yapmaz."], ["usually", "kavrama", "Selin hiç aksatmıyor; “genellikle unutur” yanlış olur."], ["sometimes", "kavrama", "Metne göre Selin hiç unutmuyor; “bazen unutur” yanlış olur."]],
          "Selin dişlerini her gün fırçalıyorsa ne sıklıkla unutur?",
          ["Selin dişlerini her sabah ve her akşam fırçalıyor.", "Yani fırçalamayı hiç unutmuyor.", "hiç = never: She never forgets it."],
          { kural: "never = hiç, asla (%0)." }),
      ],
      "enrut.there": [
        Q("enrut.there", "uygulama", 1, "There ___ a big library in our school.", "is",
          [["are", "kavrama", "“a big library” tekildir; There is kullanılır."], ["am", "bilgi", "“am” yalnızca “I” ile kullanılır."], ["be", "bilgi", "Fiilin çekimli hâli (is) gerekir."]],
          "a library tekil mi, çoğul mu?",
          ["“a library” tekildir.", "Tekil isimle “There is” kullanılır.", "Doğru cevap: There is a big library in our school."],
          { kural: "There is + tekil, There are + çoğul." }),
        Q("enrut.there", "uygulama", 1, "There ___ thirty students in my class.", "are",
          [["is", "kavrama", "“thirty students” çoğuldur; There are kullanılır."], ["isn't", "kavrama", "Hem olumsuz hem tekil biçimdir; anlam ve sayı uymaz."], ["am", "bilgi", "“am” yalnızca “I” ile kullanılır."]],
          "students kelimesinin sonundaki -s ne anlatıyor?",
          ["“students” çoğuldur.", "Çoğul isimlerle “There are” kullanılır.", "Doğru: There are thirty students in my class."],
          { kural: "There are + çoğul isim (There are two labs.)" }),
        Q("enrut.there", "uygulama", 2, "— ___ there a canteen in your school?<br>— Yes, there is.", "Is",
          [["Are", "kavrama", "“a canteen” tekildir; “Is there…?” sorulur."], ["Does", "bilgi", "There is/are soruları Do/Does ile kurulmaz."], ["Do", "bilgi", "There is/are soruları Do/Does ile kurulmaz."]],
          "Cevaba bak: “Yes, there is.”",
          ["Soru tekil bir şey hakkında: a canteen.", "There is cümlesinin sorusu: Is there…?", "Doğru: Is there a canteen in your school?"],
          { kural: "Is there a …? / Are there any …?" }),
        Q("enrut.there", "uygulama", 2, "Look at the table. Which sentence is true?", "There are two computer labs.",
          [["There is two computer labs.", "dikkat", "Sayı doğru ama “two labs” çoğuldur; “There are” gerekir."], ["There are twelve science labs.", "dikkat", "Tabloda bir tane fen laboratuvarı var; 12 sınıf sayısıdır."], ["There isn't a gym.", "dikkat", "Tabloda bir spor salonu var."]],
          "Tablodaki sayıları cümlelerle karşılaştır; tekil–çoğul uyumuna da bak.",
          ["Tabloya göre: 12 classrooms, 1 science lab, 2 computer labs, 1 gym.", "İki laboratuvar çoğuldur: There are two computer labs.", "Diğer cümleler ya sayı ya da dil bilgisi bakımından yanlış."],
          { gorsel: G.tablo(["Our school", "How many?"], [["classrooms", "12"], ["science lab", "1"], ["computer labs", "2"], ["gym", "1"]]), kural: "There is one…, There are two/three…" }),
        Q("enrut.there", "transfer", 2, "— Are there any lockers in your classroom?<br>— ___", "No, there aren't.",
          [["No, there isn't.", "kavrama", "Soru “Are there…?” ile çoğul sorulmuş; kısa cevap “there aren't” olmalı."], ["No, they aren't.", "kavrama", "“There are” sorusuna “there” ile cevap verilir, “they” ile değil."], ["Yes, there is.", "kavrama", "Çoğul soruya tekil kısa cevap verilmez."]],
          "Kısa cevap soruyla aynı yapıda olmalı.",
          ["Soru: Are there any lockers…? (çoğul)", "Olumsuz kısa cevap: No, there aren't.", "Olumlu olsaydı: Yes, there are."],
          { kural: "Are there…? → Yes, there are. / No, there aren't." }),
        Q("enrut.there", "uygulama", 2, "There ___ any computers in our classroom, but there is a smart board.", "aren't",
          [["isn't", "kavrama", "“computers” çoğuldur; olumsuzu “aren't”tır."], ["are", "kavrama", "“any” olumsuz cümlede kullanılır ve “but” zıtlık gösterir; olumsuz olmalı."], ["not", "bilgi", "“There not” diye bir yapı yoktur."]],
          "“any” ve “but” kelimeleri cümlenin olumsuz olduğunu gösteriyor.",
          ["“computers” çoğul, cümle olumsuz.", "Çoğul olumsuz: There aren't any…", "Doğru: There aren't any computers in our classroom."],
          { kural: "There isn't a… / There aren't any…" }),
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
          return S({
            kaz: "ennat.days", duzey: "hatirlama", zorluk: 1,
            soru: `When do we celebrate <b>${m.ad}</b> in Türkiye?`,
            dogru: `On ${siraKisa(m.gun)} ${AYLAR[m.ay]}.`,
            yanlis: diger.map(x => [`On ${siraKisa(x.gun)} ${AYLAR[x.ay]}.`, "bilgi", `Bu tarih ${x.ad} içindir.`]),
            ipucu: "Millî günler tablosunu hatırla.",
            cozum: [`${m.ad} her yıl aynı gün kutlanır.`, `Bu gün ${siraKisa(m.gun)} ${AYLAR[m.ay]} tarihidir.`, "Tarihten önce “on” kullanırız: On " + siraKisa(m.gun) + " " + AYLAR[m.ay] + "."],
            kural: "Tarihlerde “on” kullanılır: on 29th October, on 23rd April.",
          });
        },
        Q("ennat.days", "hatirlama", 1, "23rd April is ___ .", "National Sovereignty and Children's Day",
          [["Republic Day", "bilgi", "Cumhuriyet Bayramı 29 Ekim'dedir."], ["Teachers' Day", "bilgi", "Öğretmenler Günü 24 Kasım'dadır."], ["Victory Day", "bilgi", "Zafer Bayramı 30 Ağustos'tadır."]],
          "Bu bayram tüm dünya çocuklarına armağan edilmiştir.",
          ["23 Nisan, TBMM'nin açıldığı gündür.", "Atatürk bu günü çocuklara armağan etmiştir.", "İngilizcesi: National Sovereignty and Children's Day."],
          { kural: "sovereignty = egemenlik; children = çocuklar." }),
        Q("ennat.days", "aciklama", 1, "We give flowers and cards to our teachers on 24th November. What is the name of this day?", "Teachers' Day",
          [["Victory Day", "bilgi", "Victory Day 30 Ağustos'tur."], ["Republic Day", "bilgi", "Republic Day 29 Ekim'dir."], ["Children's Day", "kavrama", "Çocuk Bayramı 23 Nisan'dır; öğretmenlerle ilgili değildir."]],
          "Çiçek ve kartları kime veriyoruz?",
          ["Cümlede öğretmenlere çiçek ve kart verildiği söyleniyor.", "24 Kasım Öğretmenler Günü'dür.", "Cevap: Teachers' Day."],
          { kural: "24th November: Teachers' Day (Öğretmenler Günü)." }),
        Q("ennat.days", "uygulama", 2, "Look at the calendar. Which national day is in August?", "Victory Day",
          [["Republic Day", "dikkat", "Republic Day ekim (October) ayındadır."], ["Teachers' Day", "dikkat", "Teachers' Day kasım (November) ayındadır."], ["Children's Day", "dikkat", "Children's Day nisan (April) ayındadır."]],
          "August = Ağustos. Tabloda August satırını bul.",
          ["Tablodaki ayları Türkçeye çevir.", "August = Ağustos; bu satırda 30th August yazıyor.", "30 Ağustos: Victory Day."],
          { gorsel: G.tablo(["Month", "Day", "Celebration"], [["April", "23rd", "Children's Day"], ["August", "30th", "Victory Day"], ["October", "29th", "Republic Day"], ["November", "24th", "Teachers' Day"]]), kural: "Ay adları büyük harfle başlar: April, August, October." }),
        Q("ennat.days", "uygulama", 2, "Which is the correct order from January to December?", "23rd April – 19th May – 30th August – 29th October",
          [["19th May – 23rd April – 30th August – 29th October", "dikkat", "Nisan (April) mayıstan (May) önce gelir."], ["23rd April – 30th August – 19th May – 29th October", "dikkat", "Mayıs (May) ağustostan (August) önce gelir."], ["29th October – 30th August – 19th May – 23rd April", "strateji", "Bu sıralama aralıktan ocağa doğru, yani tersten yapılmış."]],
          "Ayların sırası: January, February, March, April, May, June, July, August…",
          ["Ayları sırala: April (4), May (5), August (8), October (10).", "Yılın başından sonuna doğru sıralıyoruz.", "Doğru sıra: 23rd April – 19th May – 30th August – 29th October."],
          { kural: "Ay sırası: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec." }),
      ],
      "ennat.wh": [
        Q("ennat.wh", "uygulama", 1, "— ___ do we celebrate Republic Day?<br>— On 29th October.", "When",
          [["Where", "kavrama", "Where yer sorar; cevap bir tarih."], ["Who", "kavrama", "Who kişi sorar."], ["What", "kavrama", "Tarih sorarken “When” kullanılır."]],
          "Cevap bir tarih mi, yer mi, kişi mi?",
          ["Cevap “On 29th October” bir tarihtir.", "Zaman ve tarih “When” ile sorulur.", "Doğru: When do we celebrate Republic Day?"],
          { kural: "When → zaman/tarih; Where → yer; Who → kişi; What → şey/olay." }),
        Q("ennat.wh", "uygulama", 1, "— ___ do people watch the parade?<br>— In the city square.", "Where",
          [["When", "kavrama", "Cevap bir zaman değil, bir yer."], ["Who", "kavrama", "Cevap bir kişi değil."], ["What", "kavrama", "Yer sorarken “Where” kullanılır."]],
          "“In the city square” ne anlatıyor?",
          ["Cevap bir yer bildiriyor: şehir meydanında.", "Yer sorusu “Where” ile sorulur.", "Doğru: Where do people watch the parade?"],
          { kural: "Where → yer (in the school garden, in the city square)." }),
        Q("ennat.wh", "uygulama", 1, "— ___ recites the poem at the ceremony?<br>— Zeynep does.", "Who",
          [["What", "kavrama", "Cevap bir kişi (Zeynep); kişi “Who” ile sorulur."], ["Where", "kavrama", "Cevap bir yer değil."], ["When", "kavrama", "Cevap bir zaman değil."]],
          "Cevapta bir kişi adı var.",
          ["Cevap: Zeynep does. (Bir kişi)", "Kişiyi sorarken “Who” kullanırız.", "Doğru: Who recites the poem at the ceremony?"],
          { kural: "Who + fiil-s …? → Zeynep does." }),
        Q("ennat.wh", "uygulama", 2, "— ___ do students wear on 23rd April?<br>— They wear traditional costumes.", "What",
          [["Who", "kavrama", "Cevap bir kişi değil, giyilen şey."], ["Where", "kavrama", "Cevap bir yer değil."], ["When", "dikkat", "Tarih soruda verilmiş; cevap giyilen şeyi söylüyor."]],
          "Cevap neyi anlatıyor: kişi, yer, zaman, şey?",
          ["Cevap: geleneksel kostümler (bir şey).", "Bir şeyi sorarken “What” kullanırız.", "Doğru: What do students wear on 23rd April?"],
          { kural: "What → bir şey ya da olay sorar." }),
        Q("ennat.wh", "transfer", 2, "— What do you do on Teachers' Day?<br>— ___", "We give cards to our teachers.",
          [["On 24th November.", "kavrama", "Bu cevap “When?” sorusuna uygundur."], ["At school.", "kavrama", "Bu cevap “Where?” sorusuna uygundur."], ["My teacher does.", "kavrama", "Bu cevap “Who?” sorusuna uygundur."]],
          "What do you do…? = Ne yaparsın?",
          ["Soru, o gün ne yaptığımızı soruyor.", "Cevapta bir etkinlik olmalı.", "Doğru cevap: We give cards to our teachers."],
          { kural: "What do you do…? → yapılan etkinlikle cevap verilir." }),
        Q("ennat.wh", "uygulama", 2, "Read the text and answer.<br><i>My favourite national day is 23rd April. On that day, we decorate our classroom with flags and balloons. In the afternoon, there is a show in the school garden. I usually perform a folk dance with my friends.</i><br>Where is the show?", "In the school garden.",
          [["In the classroom.", "dikkat", "Sınıf süslenir ama gösteri okul bahçesindedir."], ["In the afternoon.", "kavrama", "Bu bir zaman; soru yer soruyor (Where)."], ["On 23rd April.", "kavrama", "Bu bir tarih; soru yer soruyor."]],
          "Where = nerede. Metinde “show” kelimesini bul.",
          ["Metinde “there is a show in the school garden” yazıyor.", "Soru gösterinin yerini soruyor.", "Cevap: In the school garden."],
          { kural: "Where sorusuna yer bildiren bir ifadeyle cevap verilir." }),
      ],
      "ennat.celebrate": [
        Q("ennat.celebrate", "hatirlama", 1, "“tören” İngilizcede hangisidir?", "ceremony",
          [["parade", "bilgi", "parade geçit törenidir (yürüyüş)."], ["poem", "bilgi", "poem şiir demektir."], ["costume", "bilgi", "costume kostüm demektir."]],
          "Okul bahçesinde İstiklal Marşı ile başlayan etkinlik…",
          ["tören = resmî kutlama etkinliği.", "İngilizcesi “ceremony”dir.", "parade ise sokakta yapılan geçit törenidir."],
          { kural: "ceremony: tören; parade: geçit töreni." }),
        Q("ennat.celebrate", "uygulama", 1, "On Republic Day, we ___ the national anthem in the school garden.", "sing",
          [["sings", "kavrama", "Özne “we”; fiil -s almaz."], ["singing", "bilgi", "Geniş zamanda fiil -ing almaz."], ["watch", "kavrama", "Marş izlenmez, söylenir; anlam uymuyor."]],
          "İstiklal Marşı ile hangi fiil kullanılır?",
          ["Marşı söyleriz: sing.", "Özne “we” olduğu için fiil yalın kalır.", "Doğru: we sing the national anthem."],
          { kural: "sing the national anthem: millî marşı söylemek." }),
        Q("ennat.celebrate", "aciklama", 1, "Which one is NOT a usual activity on national days?", "We have a maths exam.",
          [["We wave flags.", "kavrama", "Bayrak sallamak millî günlerde yapılır."], ["We recite poems.", "kavrama", "Şiir okumak millî günlerde yapılır."], ["We watch the parade.", "kavrama", "Geçit törenini izlemek millî günlerde yapılır."]],
          "Hangisi bir kutlama etkinliği değildir?",
          ["Millî günlerde tören, şiir, bayrak, geçit töreni olur.", "Millî bayramlar tatildir; sınav yapılmaz.", "Cevap: We have a maths exam."],
          { kural: "Kutlama etkinlikleri: wave flags, recite poems, sing songs, watch the parade." }),
        Q("ennat.celebrate", "uygulama", 2, "Match the picture: 🎆 There are ___ in the sky on Republic Day evening.", "fireworks",
          [["flags", "kavrama", "Bayraklar gökyüzünde patlamaz; resimdeki havai fişektir."], ["poems", "kavrama", "Şiir gökyüzünde görülmez."], ["costumes", "kavrama", "Kostüm giyilir; gökyüzünde olmaz."]],
          "🎆 hangi kelimeyi gösteriyor?",
          ["Resim gökyüzündeki renkli patlamaları gösteriyor.", "Bunlar havai fişeklerdir.", "İngilizcesi: fireworks."],
          { kural: "fireworks: havai fişek." }),
        Q("ennat.celebrate", "uygulama", 2, "Read the text and answer.<br><i>My favourite national day is 23rd April. On that day, we decorate our classroom with flags and balloons. In the afternoon, there is a show in the school garden. I usually perform a folk dance with my friends.</i><br>What does the writer usually do?", "The writer performs a folk dance.",
          [["The writer recites a poem.", "dikkat", "Metinde şiir okumaktan söz edilmiyor."], ["The writer watches the parade.", "dikkat", "Metinde geçit töreninden söz edilmiyor."], ["The writer sings the national anthem alone.", "dikkat", "Metinde yalnız başına marş söylendiği yazmıyor."]],
          "Metinde “usually” kelimesini bul.",
          ["“usually” cümlesi: I usually perform a folk dance with my friends.", "Yazar arkadaşlarıyla halk oyunu oynuyor.", "Cevap: The writer performs a folk dance."],
          { kural: "perform a folk dance: halk oyunu oynamak." }),
      ],
    },
  });
})();
