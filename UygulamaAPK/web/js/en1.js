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
          ["“usually” bir alışkanlık anlatır.", "Alışkanlıklar geniş zamanla anlatılır.", "Özne I → do: I usually do my homework after dinner."],
          { kural: "usually, every day, on Mondays → simple present." }),
        Q("endly.cont", "uygulama", 1, "Be quiet! The baby ___ .", "is sleeping",
          [["sleeps", "kavrama", "“Be quiet!” şu anki bir durumu gösterir; şimdiki zaman gerekir."], ["are sleeping", "kavrama", "“the baby” tekildir; “is” kullanılır."], ["sleeping", "bilgi", "-ing'li fiil am/is/are olmadan kullanılmaz."]],
          "Bebek şu anda ne yapıyor?",
          ["“Be quiet!” bize şu anda olan bir şeyi anlatıyor.", "Şimdiki zaman: is + fiil-ing.", "Doğru: The baby is sleeping."],
          { kural: "Look!, Listen!, Be quiet!, now → present continuous." }),
        Q("endly.cont", "aciklama", 2, "Which sentence is about <b>now</b>?", "My sister is resting on the sofa.",
          [["My sister rests after school.", "kavrama", "Bu cümle bir rutini anlatır (her gün okuldan sonra)."], ["My sister always rests on Sundays.", "kavrama", "“always” alışkanlık bildirir."], ["My sister doesn't rest in the morning.", "kavrama", "Bu cümle genel bir alışkanlığı anlatır."]],
          "Şu anı anlatan yapı: am / is / are + fiil-ing.",
          ["Şu an olan eylemler present continuous ile anlatılır.", "“is resting” bu yapıya uyar.", "Cevap: My sister is resting on the sofa."],
          { kural: "Şu an: am/is/are + V-ing. Rutin: fiil / fiil-s." }),
        Q("endly.cont", "transfer", 2, "— What are you doing?<br>— ___", "I'm revising for my English exam.",
          [["I revise every evening.", "kavrama", "Soru şu anı soruyor; bu cevap bir rutini anlatır."], ["Yes, I am.", "kavrama", "Wh- sorusu evet/hayır ile cevaplanmaz."], ["I'm revise for my English exam.", "dikkat", "am'den sonra fiil -ing almalı: I'm revising."]],
          "“What are you doing?” = Ne yapıyorsun (şu anda)?",
          ["Soru şimdiki zamanla sorulmuş.", "Cevap da şimdiki zamanla verilir: I'm + fiil-ing.", "Doğru: I'm revising for my English exam."],
          { kural: "What are you doing? → I'm + V-ing." }),
        Q("endly.cont", "uygulama", 2, "Choose the correct time expression: She is studying maths ___.", "at the moment",
          [["every day", "kavrama", "“every day” rutin anlatır; geniş zamanla kullanılır."], ["on Mondays", "kavrama", "“on Mondays” tekrarlanan bir alışkanlıktır."], ["usually", "kavrama", "“usually” geniş zamanla kullanılır ve bu konumda gelmez."]],
          "Cümle şimdiki zamanda: is studying.",
          ["Cümle present continuous yapısında.", "Şimdiki zamana uyan zaman ifadesi: now, at the moment.", "Cevap: at the moment."],
          { kural: "now, at the moment → present continuous." }),
        Q("endly.cont", "uygulama", 2, "They usually ___ TV in the evening, but tonight they are reading books.", "watch",
          [["are watching", "kavrama", "“usually” rutin anlatır; geniş zaman gerekir."], ["watches", "kavrama", "Özne “they”; fiil -es almaz."], ["watching", "bilgi", "Fiil tek başına -ing ile kullanılmaz."]],
          "Cümlenin ilk bölümü rutini, ikinci bölümü şu anı anlatıyor.",
          ["“usually … in the evening” bir alışkanlık.", "Alışkanlık: geniş zaman; they → watch.", "Doğru: They usually watch TV in the evening."],
          { kural: "Rutin: simple present; bu akşam/şu an: present continuous." }),
      ],
      "endly.howoften": [
        z => {
          const [ad, zamir, iyelik] = sec(KISILER), [, et3, emo] = sec(ETKINLIK), [k, cevap] = sec(SIKLIK_HAFTA);
          const gunler = karistir(GUNLER.map((g, i) => i)).slice(0, k);
          return S({
            kaz: "endly.howoften", duzey: "uygulama", zorluk: 1,
            soru: `${emo} Look at ${ad}'s week. How often does ${ad} <b>${ETKINLIK.find(e => e[2] === emo)[0](iyelik)}</b>?`,
            gorsel: G.tablo(GUNLER, [GUNLER.map((g, i) => gunler.includes(i) ? "✔️" : "–")]),
            dogru: cevap,
            yanlis: SIKLIK_HAFTA.filter(x => x[0] !== k).slice(0, 4).map(([kk, c]) => [c, "dikkat", `Bu cevap haftada ${kk} gün anlamına gelir; tabloda ${k} gün işaretli.`]),
            ipucu: "İşaretli günleri say.",
            cozum: [`Tabloda ${k} gün işaretli.`, "1 → once a week, 2 → twice a week, 3 → three times a week, 7 → every day, 0 → never.", `Cevap: ${cevap} (${ad} ${et3(iyelik)} …)`],
            kural: "once (1), twice (2), three times (3) a week; every day (7).",
          });
        },
        Q("endly.howoften", "uygulama", 1, "— ___ do you tidy your room?<br>— Twice a week.", "How often",
          [["How many", "kavrama", "How many sayı/miktar sorar (kaç tane)."], ["When", "kavrama", "When zamanı sorar; cevap bir sıklık bildiriyor."], ["How long", "strateji", "How long süre sorar (ne kadar süre)."]],
          "Cevap bir sıklık: “Twice a week.”",
          ["Cevap ne sıklıkla yapıldığını söylüyor.", "Sıklık “How often” ile sorulur.", "Doğru: How often do you tidy your room?"],
          { kural: "How often…? → every day, once a week, twice a week, never." }),
        Q("endly.howoften", "hatirlama", 1, "Which one means “haftada üç kez”?", "three times a week",
          [["three weeks a time", "dikkat", "Kelime sırası yanlış; doğru kalıp: … times a week."], ["once a week", "bilgi", "once a week = haftada bir kez."], ["thirty times a week", "dikkat", "thirty = otuz; three = üç."]],
          "üç = three, kez = times, haftada = a week.",
          ["Üç kez = three times.", "Haftada = a week.", "Cevap: three times a week."],
          { kural: "1 kez = once, 2 kez = twice, 3 ve sonrası = three/four… times." }),
        Q("endly.howoften", "aciklama", 2, "Which answer is NOT possible for “How often do you rest after school?”", "At 4 o'clock.",
          [["Every day.", "kavrama", "“Every day.” bir sıklık bildirir; uygun bir cevaptır."], ["Twice a week.", "kavrama", "Bir sıklık bildirir; uygun bir cevaptır."], ["Never.", "kavrama", "“Never.” da bir sıklık cevabıdır."]],
          "Hangisi sıklık değil, saat bildiriyor?",
          ["How often sıklık sorar.", "Every day, twice a week, never sıklık bildirir.", "“At 4 o'clock.” bir saat bildirir; “When…?” sorusunun cevabıdır."],
          { kural: "When → saat/zaman; How often → sıklık." }),
        Q("endly.howoften", "uygulama", 2, "Which sentence is correct?", "She goes swimming once a week.",
          [["She once a week goes swimming.", "kavrama", "“once a week” gibi ifadeler genellikle cümlenin sonuna gelir."], ["She goes once a week swimming.", "kavrama", "Fiil ile nesnesi arasına sıklık ifadesi girmez."], ["She go swimming once a week.", "kavrama", "she ile fiil -es almalı: goes."]],
          "Sıklık ifadesinin yeri cümlenin neresidir?",
          ["Özne + fiil + … + sıklık ifadesi.", "she öznesiyle fiil “goes” olur.", "Doğru: She goes swimming once a week."],
          { kural: "once a week, every day → genellikle cümle sonunda." }),
        Q("endly.howoften", "transfer", 2, "Read and answer.<br><i>Hi, I'm Arda. I study for one hour every day. I revise English on Mondays and Thursdays. On Saturdays, I go to the library.</i><br>How often does Arda revise English?", "Twice a week.",
          [["Every day.", "dikkat", "Her gün yaptığı şey bir saat ders çalışmaktır, İngilizce tekrarı değil."], ["Once a week.", "dikkat", "Kütüphaneye haftada bir (cumartesi) gider; İngilizceyi iki gün tekrar eder."], ["Three times a week.", "islem", "Metinde İngilizce için iki gün (Monday, Thursday) var."]],
          "İngilizce tekrarı hangi günlerde yapıyor? Say.",
          ["“I revise English on Mondays and Thursdays.”", "Pazartesi ve perşembe: haftada iki gün.", "Cevap: Twice a week."],
          { kural: "2 gün = twice a week." }),
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
          return S({
            kaz: "endly.tags", duzey: "uygulama", zorluk: 2,
            soru: `Complete the question tag:<br><b>${cumle}, ___?</b>`,
            dogru,
            yanlis: aday.map(t => [`${t} ${zm}`, /n't/.test(t) === /n't/.test(dogru.split(" ")[0]) && ((/is|are/.test(t)) === (tur >= 2)) ? "dikkat" : "kavrama", neden(t)]),
            ipucu: "Cümle olumlu mu, olumsuz mu? Yardımcı fiil hangisi?",
            cozum: [tur >= 2 ? "Cümlede am/is/are var; tag de aynı yardımcı fiille kurulur." : "Cümle geniş zamanda; tag do/does ile kurulur.", (tur % 2 === 0 ? "Cümle olumlu, tag olumsuz olur." : "Cümle olumsuz, tag olumlu olur.") + ` Özne zamiri: ${zm}.`, `Doğru: ${cumle}, ${dogru}?`],
            kural: "Olumlu cümle → olumsuz tag; olumsuz cümle → olumlu tag; tag'de özne zamir olur.",
          });
        },
        Q("endly.tags", "uygulama", 1, "You get up early, ___?", "don't you",
          [["do you", "kavrama", "Olumlu cümleye olumsuz tag gelir."], ["aren't you", "kavrama", "Cümle geniş zamanda; tag do/don't ile kurulur."], ["doesn't you", "dikkat", "“you” ile “doesn't” değil “don't” kullanılır."]],
          "Cümle olumlu; tag olumsuz olmalı.",
          ["Geniş zaman, özne “you”.", "Olumlu cümle → olumsuz tag: don't.", "Doğru: You get up early, don't you?"],
          { kural: "You + fiil…, don't you?" }),
        Q("endly.tags", "uygulama", 2, "He isn't resting now, ___?", "is he",
          [["isn't he", "kavrama", "Olumsuz cümleye olumlu tag gelir."], ["does he", "kavrama", "Cümle şimdiki zamanda (is); tag “is” ile kurulur."], ["is she", "dikkat", "Özne “he”; tag'de de “he” olmalı."]],
          "Cümle olumsuz ve şimdiki zamanda.",
          ["Yardımcı fiil: isn't (olumsuz).", "Olumsuz cümle → olumlu tag: is he.", "Doğru: He isn't resting now, is he?"],
          { kural: "…isn't…, is he? / …aren't…, are they?" }),
        Q("endly.tags", "uygulama", 2, "Your brother doesn't watch TV in the morning, ___?", "does he",
          [["doesn't he", "kavrama", "Olumsuz cümleye olumlu tag gelir."], ["is he", "kavrama", "Cümle geniş zamanda; tag does ile kurulur."], ["does your brother", "kavrama", "Tag'de isim değil, zamir kullanılır: he."]],
          "Tag'de özne zamir olur: your brother → he.",
          ["Cümle olumsuz geniş zaman (doesn't).", "Olumlu tag: does + zamir.", "Doğru: …, does he?"],
          { kural: "Tag'de isim yerine zamir: your brother → he, my mum → she." }),
        Q("endly.tags", "transfer", 2, "— You are revising for the exam, ___?<br>— Yes, I am. It's tomorrow.", "aren't you",
          [["don't you", "kavrama", "Cümlede “are” var; tag de “are” ile kurulur."], ["are you", "kavrama", "Olumlu cümleye olumsuz tag gelir."], ["isn't you", "dikkat", "“you” ile “is” değil “are” kullanılır."]],
          "Cümledeki yardımcı fiil hangisi?",
          ["Yardımcı fiil: are (olumlu).", "Olumsuz tag: aren't you.", "Doğru: You are revising for the exam, aren't you?"],
          { kural: "You are…, aren't you?" }),
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
          ["diary her gün yaşadıklarımızı yazdığımız deftere denir.", "keep a diary = günlük tutmak.", "Cevap: günlük tutmak."],
          { kural: "diary: günlük; dictionary: sözlük — karıştırma!" }),
        Q("enlrn.activities", "aciklama", 1, "Teacher: “<i>Sort the words into two groups: fruit and vegetables.</i>” What does “sort” mean here?", "gruplara ayırmak",
          [["silmek", "bilgi", "Silmek “delete / rub out” demektir."], ["ezberlemek", "bilgi", "Ezberlemek “memorise” demektir."], ["yüksek sesle okumak", "bilgi", "Yüksek sesle okumak “read aloud” demektir."]],
          "Kelimeler “two groups” içine yerleştiriliyor.",
          ["Öğretmen kelimeleri iki gruba koymamızı istiyor.", "sort = sınıflandırmak, gruplara ayırmak.", "Cevap: gruplara ayırmak."],
          { kural: "sort: sınıflandırmak, gruplara ayırmak." }),
        Q("enlrn.activities", "uygulama", 1, "My English ___ is A1. I'm a beginner.", "level",
          [["diary", "kavrama", "diary günlüktür; A1 bir günlük değildir."], ["lesson", "kavrama", "A1 bir ders değil, bir seviyedir."], ["sort", "kavrama", "sort bir fiildir (gruplara ayırmak)."]],
          "A1, A2, B1… neyi gösterir?",
          ["A1, dil bilgisinin düzeyini gösterir.", "Düzey/seviye = level.", "Doğru: My English level is A1."],
          { kural: "level: seviye, düzey (A1 = başlangıç)." }),
        Q("enlrn.activities", "uygulama", 2, "I don't know the meaning of “generous”. I ___ in a dictionary.", "look it up",
          [["look at it", "kavrama", "look at = bakmak (görmek için); sözlükte anlam aramak “look up”tır."], ["look after it", "kavrama", "look after = ilgilenmek, bakmak (bakım)."], ["look for it", "kavrama", "look for = aramak (kaybolan bir şeyi)."]],
          "Sözlükte bir kelimeye bakmak hangi kalıptır?",
          ["Anlamını bilmediğimiz kelimeyi sözlükte ararız.", "Bunun kalıbı: look up (a word).", "Zamir arada: look it up."],
          { kural: "look up a word = sözlükte bir kelimeye bakmak." }),
        Q("enlrn.activities", "uygulama", 2, "Read the instructions.<br><i>Today we are working in pairs. First, read the text. Then, take notes. Finally, make a poster with your partner.</i><br>What do the students do last?", "They make a poster.",
          [["They read the text.", "dikkat", "Metni okumak ilk adımdır (First)."], ["They take notes.", "dikkat", "Not almak ikinci adımdır (Then)."], ["They keep a diary.", "dikkat", "Talimatlarda günlük tutmak yok."]],
          "First, Then, Finally kelimelerine dikkat et.",
          ["First → read the text.", "Then → take notes.", "Finally (en son) → make a poster. Cevap: They make a poster."],
          { kural: "First (önce), Then (sonra), Finally (en son)." }),
        Q("enlrn.activities", "hatirlama", 1, "“Not almak” İngilizcede hangisidir?", "take notes",
          [["make notes up", "dikkat", "Böyle bir kalıp “not almak” anlamına gelmez."], ["keep a diary", "bilgi", "keep a diary günlük tutmaktır."], ["look up", "bilgi", "look up sözlükte bakmaktır."]],
          "Ders dinlerken defterimize ne yaparız?",
          ["Not almak, önemli bilgileri yazmaktır.", "İngilizcesi: take notes.", "Örnek: I take notes in English lessons."],
          { kural: "take notes: not almak." }),
      ],
      "enlrn.possadj": [
        Q("enlrn.possadj", "uygulama", 1, "I'm Deniz. This is ___ notebook.", "my",
          [["me", "kavrama", "“me” nesne zamiridir; isimden önce iyelik sıfatı gelir."], ["I", "kavrama", "“I” özne zamiridir."], ["mine", "kavrama", "“mine” tek başına kullanılır (benimki); isimden önce gelmez."]],
          "“benim defterim” → ___ notebook.",
          ["Konuşan kişi: I (Deniz).", "I → my (benim).", "Doğru: This is my notebook."],
          { kural: "I → my, you → your, he → his, she → her." }),
        Q("enlrn.possadj", "uygulama", 1, "Emre and Can are brothers. ___ classroom is on the second floor.", "Their",
          [["There", "dikkat", "There “orada” demektir; okunuşu benzer ama anlamı farklı."], ["They", "kavrama", "They özne zamiridir; isimden önce iyelik sıfatı gelir."], ["Them", "kavrama", "Them nesne zamiridir."]],
          "Emre and Can = they. “Onların sınıfı” nasıl söylenir?",
          ["Emre ve Can = they.", "they → their (onların).", "Doğru: Their classroom is on the second floor."],
          { kural: "they → their; their ≠ there." }),
        Q("enlrn.possadj", "uygulama", 2, "We are doing ___ project together.", "our",
          [["we", "kavrama", "we özne zamiridir."], ["us", "kavrama", "us nesne zamiridir."], ["their", "dikkat", "Özne “we”; “onların” değil “bizim” olmalı."]],
          "we → ?",
          ["Özne we (biz).", "we → our (bizim).", "Doğru: We are doing our project together."],
          { kural: "we → our, they → their." }),
        Q("enlrn.possadj", "transfer", 2, "— Is this ___ pen, Ali?<br>— Yes, it's mine. Thank you!", "your",
          [["you", "kavrama", "you özne/nesne zamiridir; isimden önce “your” gelir."], ["you're", "dikkat", "you're = you are; anlam uymaz."], ["his", "kavrama", "Ali'yle doğrudan konuşuyoruz; “senin” = your."]],
          "Ali'ye “Bu senin kalemin mi?” diye soruyoruz.",
          ["Ali'yle konuşuyoruz: you.", "you → your (senin).", "Doğru: Is this your pen, Ali?"],
          { kural: "your = senin/sizin; you're = you are." }),
        Q("enlrn.possadj", "uygulama", 2, "Look at this dictionary. ___ cover is red.", "Its",
          [["It's", "dikkat", "It's = It is; “It is cover is red” anlamsız olur."], ["His", "kavrama", "his erkek kişiler için kullanılır; sözlük bir nesnedir."], ["Their", "kavrama", "Sözlük tekildir; their çoğul içindir."]],
          "Sözlük bir nesne: it → ?",
          ["Sözlük cansız ve tekil: it.", "it → its (onun).", "Doğru: Its cover is red."],
          { kural: "its (onun) ≠ it's (it is)." }),
        Q("enlrn.possadj", "uygulama", 1, "Mr Aksoy is ___ English teacher. He teaches us every Tuesday.", "our",
          [["us", "kavrama", "us nesne zamiridir; isimden önce “our” gelir."], ["we", "kavrama", "we özne zamiridir."], ["ours", "kavrama", "ours (bizimki) isimden önce kullanılmaz."]],
          "“He teaches us” → bize ders veriyor; o hâlde bizim öğretmenimiz.",
          ["Öğretmen bize ders veriyor.", "Bizim öğretmenimiz = our teacher.", "Doğru: Mr Aksoy is our English teacher."],
          { kural: "İyelik sıfatı + isim: our teacher, my book." }),
      ],
      "enlrn.adverb": [
        Q("enlrn.adverb", "uygulama", 1, "Please, listen ___ to the instructions.", "carefully",
          [["careful", "kavrama", "careful bir sıfattır; fiili (listen) zarf niteler."], ["carefuly", "dikkat", "careful + ly → carefully (çift l)."], ["care", "kavrama", "care bir isim/fiildir."]],
          "Nasıl dinlemeliyiz? Fiili niteleyen kelime zarf olmalı.",
          ["“listen” bir fiil; nasıl yapıldığını zarf anlatır.", "careful + -ly = carefully.", "Doğru: Please, listen carefully."],
          { kural: "sıfat + -ly = zarf (careful → carefully)." }),
        Q("enlrn.adverb", "uygulama", 2, "Which sentence is correct?", "She reads the text quietly.",
          [["She reads quietly the text.", "kavrama", "Zarf fiil ile nesnenin arasına girmez."], ["She quiet reads the text.", "kavrama", "“quiet” sıfattır ve fiilden önce bu şekilde kullanılmaz."], ["Quietly she the text reads.", "kavrama", "Fiil özneden sonra gelmeli."]],
          "Sıra: Özne + fiil + nesne + zarf.",
          ["Özne: She, fiil: reads, nesne: the text.", "Zarf (quietly) nesneden sonra gelir.", "Doğru: She reads the text quietly."],
          { kural: "Özne + fiil + nesne + zarf." }),
        Q("enlrn.adverb", "uygulama", 1, "Ece is a quick writer. She writes ___ .", "quickly",
          [["quick", "kavrama", "quick sıfattır; fiili zarf niteler."], ["quicker", "kavrama", "quicker karşılaştırma sıfatıdır."], ["quickily", "dikkat", "Doğru yazım: quick + ly = quickly."]],
          "Sıfat: quick. Zarfı nasıl yaparız?",
          ["“writes” fiilini niteliyoruz.", "quick + ly = quickly.", "Doğru: She writes quickly."],
          { kural: "quick → quickly, slow → slowly." }),
        Q("enlrn.adverb", "uygulama", 3, "Our teacher is a good speaker. She speaks English very ___ .", "well",
          [["good", "kavrama", "good sıfattır; fiili niteleyen zarfı “well”dir."], ["goodly", "bilgi", "good düzensizdir; -ly almaz."], ["best", "kavrama", "best en üstünlük biçimidir; burada kullanılmaz."]],
          "good kelimesinin zarf hâli düzensizdir.",
          ["“speaks” fiilini niteleyen bir zarf gerekir.", "good → well (düzensiz).", "Doğru: She speaks English very well."],
          { kural: "Düzensiz zarflar: good → well, fast → fast, hard → hard." }),
        Q("enlrn.adverb", "uygulama", 2, "Which is the correct order? <b>slowly / the new words / reads / Ali</b>", "Ali reads the new words slowly.",
          [["Ali slowly the new words reads.", "kavrama", "Fiil özneden hemen sonra gelmeli."], ["Ali reads slowly the new words.", "kavrama", "Zarf fiil ile nesnenin arasına girmez."], ["The new words reads Ali slowly.", "kavrama", "Özne cümlenin başında olmalı."]],
          "Önce özne, sonra fiil, sonra nesne, en son zarf.",
          ["Özne: Ali → fiil: reads.", "Nesne: the new words.", "Zarf en sonda: Ali reads the new words slowly."],
          { kural: "Özne + fiil + nesne + zarf." }),
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
          return S({
            kaz: "ennum.cardinal", duzey: "uygulama", zorluk: 2,
            soru: `How do you write <b>${n}</b> in words?`,
            dogru: kelime(n), yanlis: kartYanlis(n),
            ipucu: "Önce yüzler (… hundred), sonra “and”, sonra onlar-birler.",
            cozum: [`${Math.floor(n / 100) * 100} → ${kelime(Math.floor(n / 100) * 100)}.`, n % 100 ? `${n % 100} → ${yuzAlti(n % 100)}.` : "Onlar ve birler basamağı sıfır.", `Birleştir: ${kelime(n)}.`],
            kural: "Yüzlük + and + onlar-birler: two hundred and forty-five.",
          });
        },
        z => {
          const n = R(101, 499), h = Math.floor(n / 100), t = Math.floor(n % 100 / 10), o = n % 10, y = [];
          if (t !== o && t >= 2 && o) y.push([String(h * 100 + o * 10 + t), "dikkat", "Onlar ve birler basamağı yer değiştirmiş."]);
          if (n % 100 >= 13 && n % 100 <= 19) y.push([String(h * 100 + (n % 100 - 10) * 10), "kavrama", "-teen (13–19) ile -ty (30, 40…) karıştırılmış."]);
          if (o === 0 && t >= 3) y.push([String(h * 100 + 10 + t), "kavrama", "-ty (30, 40…) ile -teen (13–19) karıştırılmış."]);
          y.push([String(n + 100), "dikkat", "Yüzler basamağı yanlış okunmuş."]);
          y.push([String(n + 10), "islem", "Onlar basamağı yanlış okunmuş."]);
          y.push([String(n - 10), "islem", "Onlar basamağı yanlış okunmuş."]);
          return S({
            kaz: "ennum.cardinal", duzey: "uygulama", zorluk: 1,
            soru: `Which number is <b>${kelime(n)}</b>?`,
            dogru: String(n), yanlis: y,
            ipucu: "Önce “hundred”dan önceki sayıyı, sonra “and”den sonrasını oku.",
            cozum: [`${BIRLER[h]} hundred = ${h * 100}.`, n % 100 ? `${yuzAlti(n % 100)} = ${n % 100}.` : "Sonrasında sayı yok.", `${h * 100} + ${n % 100} = ${n}.`],
            kural: "hundred = yüz; -teen: 13–19, -ty: 20, 30, 40…",
          });
        },
        z => {
          const a = R(12, 30) * 10, b = R(2, 15) * 10, t = a + b;
          return S({
            kaz: "ennum.cardinal", duzey: "transfer", zorluk: 2,
            soru: `There are <b>${a}</b> students in our school. This year, <b>${b}</b> new students come. How many students are there now?`,
            dogru: kelime(t),
            yanlis: [[kelime(a - b), "islem", "Toplama yerine çıkarma yapılmış."]].concat(kartYanlis(t)),
            ipucu: "Yeni öğrenciler geliyor: toplama yap.",
            cozum: [`${a} + ${b} = ${t}.`, `${t} sayısını yazıyla yaz.`, `Cevap: ${kelime(t)}.`],
            kural: "plus = artı; How many…? → There are … .",
          });
        },
        z => {
          const sayilar = new Set(); const h = R(1, 3);
          while (sayilar.size < 4) sayilar.add(h * 100 + R(0, 99) + (sayilar.size === 3 ? 100 : 0));
          const d = [...sayilar], mx = Math.max(...d);
          return S({
            kaz: "ennum.cardinal", duzey: "aciklama", zorluk: 2,
            soru: "Which number is the <b>biggest</b>?",
            dogru: kelime(mx),
            yanlis: d.filter(x => x !== mx).map(x => [kelime(x), "kavrama", `Bu sayı ${x}; ${mx} daha büyüktür.`]),
            ipucu: "Önce yüzler basamağını (… hundred) karşılaştır.",
            cozum: ["Her sayıyı rakamla yaz: " + d.join(", ") + ".", "Önce yüzler, sonra onlar basamağını karşılaştır.", `En büyük sayı ${mx}: ${kelime(mx)}.`],
            kural: "Karşılaştırırken önce yüzleri (hundred), sonra onlar ve birleri karşılaştır.",
          });
        },
        z => {
          const step = sec([10, 20, 25, 50]), s = R(Math.ceil(100 / step), Math.floor((500 - 3 * step) / step)) * step, nx = s + 3 * step;
          return S({
            kaz: "ennum.cardinal", duzey: "uygulama", zorluk: 2,
            soru: `What comes next? <b>${s}, ${s + step}, ${s + 2 * step}, ___</b>`,
            dogru: kelime(nx),
            yanlis: [[kelime(nx + step), "islem", "Bir adım fazla ilerlenmiş."], [kelime(s + 2 * step), "dikkat", "Bu sayı dizide zaten var."], [kelime(nx).replace(" hundred", " hundreds"), "dikkat", "hundred çoğul eki almaz."], [kelime(nx + 1), "islem", `Dizi ${step}'er artıyor, 1 değil.`]],
            ipucu: "Sayılar kaçar kaçar artıyor?",
            cozum: [`Dizi ${step}'er artıyor.`, `${s + 2 * step} + ${step} = ${nx}.`, `${nx} = ${kelime(nx)}.`],
            kural: "Sayı dizilerinde artış miktarını bul, sonra sayıyı yazıyla yaz.",
          });
        },
        Q("ennum.cardinal", "hatirlama", 1, "How do you say <b>300</b>?", "three hundred",
          [["three hundreds", "dikkat", "hundred bir sayıdan sonra -s almaz."], ["thirty hundred", "kavrama", "thirty 30'dur; 300 = three hundred."], ["three thousand", "bilgi", "thousand bin demektir; 3000 olur."]],
          "hundred = yüz.",
          ["300 = 3 tane yüz.", "3 = three, yüz = hundred.", "hundred çoğul eki almaz: three hundred."],
          { kural: "two hundred, three hundred (hundreds değil)." }),
      ],
      "ennum.ordinal": [
        z => {
          const n = R(1, 50), dogru = siraKisa(n);
          return S({
            kaz: "ennum.ordinal", duzey: "uygulama", zorluk: 1,
            soru: `What is the short form of <b>${siraKelime(n)}</b>?`,
            dogru,
            yanlis: ["st", "nd", "rd", "th"].filter(e => e !== ekSira(n)).map(e => [n + e, n % 100 >= 11 && n % 100 <= 13 ? "dikkat" : "kavrama", n % 100 >= 11 && n % 100 <= 13 ? "11, 12 ve 13 her zaman -th alır." : `Sonu ${n % 10} ile biten sayı ${dogru} şeklinde yazılır.`]),
            ipucu: "Sayının son rakamına bak: 1 → st, 2 → nd, 3 → rd, diğerleri → th (11, 12, 13 hariç).",
            cozum: [`${siraKelime(n)} = ${n}.`, n % 100 >= 11 && n % 100 <= 13 ? "11, 12 ve 13 istisnadır; -th alır." : `Son rakam ${n % 10} → -${ekSira(n)}.`, `Cevap: ${dogru}.`],
            kural: "1st, 2nd, 3rd, 4th… 11th, 12th, 13th… 21st, 22nd, 23rd.",
          });
        },
        z => {
          const n = R(1, 50), dogru = siraKelime(n);
          return S({
            kaz: "ennum.ordinal", duzey: "uygulama", zorluk: 2,
            soru: `How do you write <b>${siraKisa(n)}</b> in words?`,
            dogru,
            yanlis: [[safTh(n), "dikkat", "Sıra sayısı yanlış yazılmış; düzensiz biçimleri hatırla (first, second, third, fifth, ninth, twelfth, -tieth)."], [kelime(n), "kavrama", "Bu sayma sayısıdır; sıra sayısı gerekir."], [siraKelime(n === 50 ? 49 : n + 1), "islem", "Bu, bir sonraki sıra sayısıdır."], [siraKelime(n === 1 ? 3 : n - 1), "islem", "Bu, başka bir sıra sayısıdır."]],
            ipucu: "Bileşik sayılarda yalnızca son kelime sıra sayısı olur: twenty-first.",
            cozum: [`${siraKisa(n)} = ${n}. sıra.`, n > 20 && n % 10 ? `Onlar aynen kalır (${ONLAR[Math.floor(n / 10)]}), birler sıra sayısı olur (${SIRA_BIR[n % 10]}).` : "Bu sayının sıra biçimi tek kelimedir.", `Cevap: ${dogru}.`],
            kural: "first, second, third, fifth, eighth, ninth, twelfth, twentieth, fortieth…",
          });
        },
        z => {
          const k = R(2, 48), ad = sec(ADLAR), p = k + 1, yan = ["st", "nd", "rd", "th"].filter(e => e !== ekSira(p));
          return S({
            kaz: "ennum.ordinal", duzey: "transfer", zorluk: 2,
            soru: `In a race, <b>${k}</b> runners finish before ${ad}. What is ${ad}'s position?`,
            dogru: siraKisa(p),
            yanlis: [[siraKisa(k), "islem", `Önde ${k} kişi var; ${ad} onlardan sonraki sıradadır.`], [siraKisa(k + 2), "islem", "Bir fazla sayılmış."], [p + yan[0], "dikkat", "Sıra sayısının eki yanlış."]],
            ipucu: "Önde kaç kişi var? Bu koşucu kaçıncı olur?",
            cozum: [`Önde ${k} koşucu var.`, `${ad} onlardan sonra gelir: ${k} + 1 = ${p}.`, `Cevap: ${siraKisa(p)} (${siraKelime(p)}).`],
            kural: "position = sıra, derece (1st, 2nd, 3rd…).",
          });
        },
        z => {
          const adlar = karistir(ADLAR).slice(0, 4), nolar = karistir(Array.from({ length: 50 }, (_, i) => i + 1)).slice(0, 4).sort((a, b) => a - b);
          const j = R(0, 3);
          return S({
            kaz: "ennum.ordinal", duzey: "uygulama", zorluk: 1,
            soru: `Look at the class list. Who is <b>${siraKelime(nolar[j])}</b> on the list?`,
            gorsel: G.tablo(["No.", "Name"], nolar.map((x, i) => [x, adlar[i]])),
            dogru: adlar[j],
            yanlis: adlar.filter((a, i) => i !== j).map(a => [a, "dikkat", `${a} listede ${nolar[adlar.indexOf(a)]} numaradadır.`]),
            ipucu: `${siraKelime(nolar[j])} kaçıncı demek?`,
            cozum: [`${siraKelime(nolar[j])} = ${siraKisa(nolar[j])} = ${nolar[j]}.`, `Listede ${nolar[j]} numarayı bul.`, `Cevap: ${adlar[j]}.`],
            kural: "Sıra sayısı kelimesini önce rakama çevir.",
          });
        },
        Q("ennum.ordinal", "hatirlama", 2, "Which word is spelled correctly?", "twelfth",
          [["twelveth", "dikkat", "twelve'in sıra sayısında “ve” → “f” olur: twelfth."], ["twelvth", "dikkat", "Doğru yazım: twelfth."], ["twelfeth", "dikkat", "Fazladan “e” var; doğru yazım: twelfth."]],
          "five → fifth gibi, twelve → ?",
          ["twelve düzensiz bir sıra sayısıdır.", "“ve” yerine “f” gelir, ardından -th.", "Doğru: twelfth."],
          { kural: "five → fifth, twelve → twelfth." }),
        Q("ennum.ordinal", "aciklama", 2, "Which one is <b>wrong</b>?", "22th",
          [["21st", "kavrama", "21 sonu 1 ile bitiyor: 21st doğrudur."], ["13th", "kavrama", "13 her zaman -th alır: doğrudur."], ["42nd", "kavrama", "42 sonu 2 ile bitiyor: 42nd doğrudur."]],
          "Her sayının son rakamına bak.",
          ["21 → st, 13 → th (istisna), 42 → nd.", "22 sonu 2 ile bittiği için -nd almalı.", "Yanlış olan: 22th (doğrusu 22nd)."],
          { kural: "Sonu 2 → nd (22nd, 32nd), ama 12th." }),
      ],
      "ennum.use": [
        z => {
          const d = R(1, 28), ay = sec(AYLAR);
          return S({
            kaz: "ennum.use", duzey: "uygulama", zorluk: 2,
            soru: `How do you say this date? <b>${siraKisa(d)} ${ay}</b>`,
            dogru: `the ${siraKelime(d)} of ${ay}`,
            yanlis: [[`the ${kelime(d)} of ${ay}`, "kavrama", "Tarihlerde gün sıra sayısıyla okunur."], [`the ${safTh(d)} of ${ay}`, "dikkat", "Sıra sayısı yanlış yazılmış."], [`the ${siraKelime(d + 10)} of ${ay}`, "dikkat", "Gün yanlış okunmuş."], [`the ${siraKelime(d + 1)} of ${ay}`, "islem", "Bir sonraki gün okunmuş."]],
            ipucu: "Tarihte gün sıra sayısıyla okunur: the … of …",
            cozum: [`${siraKisa(d)} = ${siraKelime(d)}.`, "Kalıp: the + sıra sayısı + of + ay.", `Cevap: the ${siraKelime(d)} of ${ay}.`],
            kural: "Tarih okuma: 5th May → the fifth of May.",
          });
        },
        z => {
          const m = sec(MILLI), diger = MILLI.filter(x => x.gun !== m.gun);
          return S({
            kaz: "ennum.use", duzey: "baglanti", zorluk: 2,
            soru: `Complete the sentence: <b>${m.ad}</b> is on the ___ of ${AYLAR[m.ay]}.`,
            dogru: siraKelime(m.gun),
            yanlis: [[kelime(m.gun), "kavrama", "Tarihte sayma sayısı değil, sıra sayısı kullanılır."], [safTh(m.gun), "dikkat", "Sıra sayısının yazımı yanlış."]].concat(diger.map(x => [siraKelime(x.gun), "bilgi", `Bu gün ${x.ad} tarihidir.`])),
            ipucu: "Theme 1'deki millî günler tablosunu hatırla.",
            cozum: [`${m.ad}: ${siraKisa(m.gun)} ${AYLAR[m.ay]}.`, `${m.gun} → ${siraKelime(m.gun)}.`, `Cevap: the ${siraKelime(m.gun)} of ${AYLAR[m.ay]}.`],
            kural: "Tarihlerde gün sıra sayısıyla söylenir.",
          });
        },
        z => {
          const tur = karistir(KITAP).slice(0, 4), deg = new Set();
          while (deg.size < 4) deg.add(R(10, 50) * 10 + sec([0, 0, 5]));
          const d = [...deg], j = R(0, 3);
          return S({
            kaz: "ennum.use", duzey: "uygulama", zorluk: 2,
            soru: `Look at the school library table. How many <b>${tur[j]}</b> books are there?`,
            gorsel: G.tablo(["Books", "How many?"], tur.map((t, i) => [t, d[i]])),
            dogru: "There are " + kelime(d[j]) + ".",
            yanlis: d.filter((x, i) => i !== j).map((x, i) => ["There are " + kelime(x) + ".", "dikkat", "Tabloda başka bir satır okunmuş."]).concat([["There are " + kelime(d[j]).replace(" hundred", " hundreds") + ".", "dikkat", "hundred çoğul eki almaz."]]),
            ipucu: `Tabloda “${tur[j]}” satırını bul ve sayıyı yazıyla oku.`,
            cozum: [`“${tur[j]}” satırında ${d[j]} yazıyor.`, `${d[j]} = ${kelime(d[j])}.`, `Cevap: There are ${kelime(d[j])}.`],
            kural: "How many…? → There are + sayı.",
          });
        },
        z => {
          const n = R(30, 50) * 10, p = R(5, 20) * 10, kalan = n - p;
          return S({
            kaz: "ennum.use", duzey: "transfer", zorluk: 3,
            soru: `📘 Kerem's book has <b>${n}</b> pages. He is on page <b>${p}</b>. How many pages are left?`,
            dogru: kelime(kalan),
            yanlis: [[kelime(n + p), "islem", "Çıkarma yerine toplama yapılmış."]].concat(kartYanlis(kalan)),
            ipucu: "Kalan sayfa = toplam sayfa − okunan sayfa.",
            cozum: [`Toplam ${n} sayfa, okunan ${p} sayfa.`, `${n} − ${p} = ${kalan}.`, `Cevap: ${kelime(kalan)}.`],
            kural: "minus = eksi; left = kalan.",
          });
        },
        Q("ennum.use", "uygulama", 1, "Our classroom is on the ___ floor. (3)", "third",
          [["three", "kavrama", "Kat söylerken sıra sayısı kullanılır."], ["threeth", "dikkat", "three'nin sıra sayısı düzensizdir: third."], ["thirdth", "dikkat", "third zaten sıra sayısıdır; -th eklenmez."]],
          "Kaçıncı kat? Sıra sayısı kullan.",
          ["Kat numarası sıra sayısıyla söylenir.", "3 → third (düzensiz).", "Doğru: on the third floor."],
          { kural: "on the first / second / third floor." }),
        Q("ennum.use", "transfer", 2, "— How many students are there in your school?<br>— ___ (320)", "There are three hundred and twenty students.",
          [["There is three hundred and twenty students.", "kavrama", "Çoğul isimle “There are” kullanılır."], ["There are three hundreds and twenty students.", "dikkat", "hundred çoğul eki almaz."], ["There are three hundred and twelve students.", "dikkat", "twelve 12'dir; 20 twenty'dir."]],
          "Hem sayının yazılışına hem There is/are'a dikkat et.",
          ["320 = three hundred and twenty.", "students çoğul → There are.", "Doğru: There are three hundred and twenty students."],
          { kural: "How many…? → There are + sayı + çoğul isim." }),
      ],
    },
  });
})();
