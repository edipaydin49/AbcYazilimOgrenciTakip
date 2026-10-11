/* İngilizce — ek sorular (Theme 1–4: School Life, Classroom Life, Personal Life, Family Life).
 * Her soru adım adım çözüm (🔎 → 💡 → ✏️ → ✅ → 🔁), dogruNeden ve 3 açıklamalı çeldirici içerir.
 */
(function () {
  "use strict";
  const { R, sec, karistir, S, Q, G } = OGR;

  /* 6 adımlı çözüm kurucu */
  const C = (anla, hatirla, u1, u2, sonuc, kontrol) => [
    "🔎 Soruyu anlayalım: " + anla, "💡 Hatırlayalım: " + hatirla, "✏️ Uygulayalım: " + u1, "✏️ " + u2, "✅ Sonuç: " + sonuc, "🔁 Kontrol edelim: " + kontrol];

  /* Sayı yardımcıları (İngiliz İngilizcesi: two hundred and five) */
  const BIRLER = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const ONLAR = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const yuzAlti = n => n < 20 ? BIRLER[n] : ONLAR[Math.floor(n / 10)] + (n % 10 ? "-" + BIRLER[n % 10] : "");
  const kelime = n => n < 100 ? yuzAlti(n) : BIRLER[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + yuzAlti(n % 100) : "");
  const SIRA_BIR = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"];
  const SIRA_ON = ["", "", "twentieth", "thirtieth", "fortieth", "fiftieth"];
  const siraKelime = n => n < 20 ? SIRA_BIR[n] : n % 10 === 0 ? SIRA_ON[n / 10] : ONLAR[Math.floor(n / 10)] + "-" + SIRA_BIR[n % 10];
  const ekSira = n => (n % 100 >= 11 && n % 100 <= 13) ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th");
  const siraKisa = n => n + ekSira(n);

  /* =========================================================================
   * THEME 1 — ROLES AND RESPONSIBILITIES AT SCHOOL
   * ========================================================================= */
  const GOREV = [
    ["the librarian", "helps students find books", "kütüphane görevlisi kitap bulmamıza yardım eder"],
    ["the school nurse", "looks after sick students", "okul hemşiresi hasta öğrencilerle ilgilenir"],
    ["the cook", "cooks meals for the students", "aşçı öğrencilere yemek pişirir"],
    ["the security guard", "checks the school gate", "güvenlik görevlisi okul kapısını kontrol eder"],
    ["the headteacher", "manages the school", "müdür okulu yönetir"],
    ["the caretaker", "repairs broken desks and doors", "okul görevlisi kırık sıra ve kapıları onarır"],
    ["the school counsellor", "listens to students' problems", "rehber öğretmen öğrencilerin sorunlarını dinler"],
  ];
  SORU_EKLE("enrol.roles",
    z => {
      const g = sec(GOREV), d = karistir(GOREV.filter(x => x !== g)).slice(0, 3);
      return S({
        kaz: "enrol.roles", duzey: "hatirlama", zorluk: 1,
        soru: `What is the job of <b>${g[0]}</b> at school?`,
        dogru: `He or she ${g[1]}.`,
        yanlis: d.map(x => [`He or she ${x[1]}.`, "bilgi", `Bu görev ${x[0]} kişisine aittir: ${x[2]}.`]),
        ipucu: "Görevin adındaki kelimeye bak; örneğin librarian → library (kütüphane).",
        cozum: C(`Okulda “${g[0]}” kişisinin görevi soruluyor.`, "Okulda her çalışanın bir görevi (role) vardır; görevleri geniş zamanla anlatırız: The cook cooks meals.",
          `“${g[0]}” kelimesinin anlamını düşün.`, `Bu kişinin işi: ${g[2]}.`, `Cevap: He or she ${g[1]}.`, "Diğer seçeneklerdeki işler okuldaki başka çalışanlara ait; her birini sahibiyle eşleştirerek kontrol edebilirsin."),
        kural: "Okul görevlileri: headteacher, librarian, school nurse, cook, caretaker, security guard, school counsellor.",
        dogruNeden: `${g[0]} ${g[1]}; yani ${g[2]}.`,
      });
    },
    Q("enrol.roles", "transfer", 1, "Complete the dialogue.<br>— Excuse me, I feel sick. I've got a headache.<br>— ___", "Go to the school nurse. She can help you.",
      [["Go to the library. The librarian can help you.", "bilgi", "Kütüphane görevlisi kitap konusunda yardım eder; hastalıkla ilgilenmez."], ["Go to the canteen. The cook can help you.", "bilgi", "Aşçı yemek pişirir; baş ağrısına yardım edemez."], ["Yes, I have got a headache too.", "kavrama", "Arkadaşın yardım istiyor; ona nereye gideceğini söylemelisin."]],
      "Hasta bir öğrenciye okulda kim yardım eder?",
      C("Bir öğrenci başının ağrıdığını söylüyor ve yardım istiyor.", "feel sick = kendini hasta hissetmek, headache = baş ağrısı. Hasta öğrencilerle okul hemşiresi (school nurse) ilgilenir.",
        "Seçeneklerde öğrenciyi kimin yanına gönderdiğimize bakalım.", "Kütüphane görevlisi ve aşçı sağlıkla ilgilenmez; son seçenek ise yardım önermiyor.", "Cevap: Go to the school nurse. She can help you.", "Diyalog tamamlarken önce karşıdaki kişinin ne istediğini bul; cevabın ona uygun olmalı."),
      { kural: "Hasta öğrenci → school nurse; kitap → librarian; yemek → cook.", dogruNeden: "Okulda hasta öğrencilerle okul hemşiresi ilgilenir." }),
    Q("enrol.roles", "uygulama", 2, "Read the text.<br><i>Mr Arslan is the caretaker at our school. He comes to school very early. He opens the classrooms and repairs broken chairs. He also waters the plants in the garden.</i><br>Which one is <b>NOT</b> Mr Arslan's job?", "He teaches science.",
      [["He opens the classrooms.", "dikkat", "Metinde “He opens the classrooms.” yazıyor; bu onun işidir."], ["He repairs broken chairs.", "dikkat", "Metinde kırık sandalyeleri onardığı söyleniyor."], ["He waters the plants.", "dikkat", "Metinde bahçedeki bitkileri suladığı yazıyor."]],
      "Metinde geçmeyen görevi bul.",
      C("Metindeki Mr Arslan'ın yapmadığı iş soruluyor (NOT).", "caretaker = okulun bakım ve düzeninden sorumlu görevli. NOT içeren sorularda metinde olmayanı ararız.",
        "Metindeki işler: opens the classrooms, repairs broken chairs, waters the plants.", "Fen dersi vermek (teaches science) metinde yok; bu bir öğretmenin işidir.", "Cevap: He teaches science.", "Her seçeneği metinde tek tek işaretle; işaretleyemediğin seçenek cevaptır."),
      { kural: "NOT soruları: metinde yazanları ele, kalan seçeneği seç.", dogruNeden: "Metinde Mr Arslan'ın ders verdiği yazmıyor; ders vermek öğretmenin görevidir." }),
    Q("enrol.roles", "uygulama", 2, "Look at the table. <b>What is Deniz's responsibility?</b>", "Deniz cleans the board.",
      [["Deniz waters the plants.", "dikkat", "Bitkileri sulamak Selin'in görevidir."], ["Deniz collects the homework.", "dikkat", "Ödevleri toplamak sınıf başkanı Mert'in görevidir."], ["Deniz opens the windows.", "dikkat", "Pencereleri açmak Can'ın görevidir."]],
      "Tabloda Deniz'in satırını bul.",
      C("Tablodan Deniz'in sorumluluğunu bulacağız.", "responsibility = sorumluluk. Tabloda her öğrencinin adının karşısında görevi yazar.",
        "Name sütununda Deniz'i bul.", "Aynı satırdaki görev: cleans the board (tahtayı siler).", "Cevap: Deniz cleans the board.", "Tablo sorularında satırı parmağınla takip et; bir alt ya da üst satıra kayma."),
      { gorsel: G.tablo(["Name", "Role", "Responsibility"], [["Mert", "class monitor", "collects the homework"], ["Deniz", "board helper", "cleans the board"], ["Selin", "plant helper", "waters the plants"], ["Can", "window helper", "opens the windows"]]),
        kural: "Tablo okurken önce satırı (kişi), sonra sütunu (bilgi) bul.", dogruNeden: "Tabloda Deniz'in satırında “cleans the board” yazıyor." }),
  );

  /* a / an / the */
  const TANIM = [
    ["a", "ruler", "r sessiz harf sesiyle başlar"], ["a", "uniform", "“uniform” /yu/ sesiyle başlar; bu sessiz bir sestir"], ["a", "notebook", "n sessiz harf sesiyle başlar"],
    ["a", "university", "“university” /yu/ sesiyle başlar"], ["a", "dictionary", "d sessiz harf sesiyle başlar"], ["a", "pencil case", "p sessiz harf sesiyle başlar"],
    ["an", "eraser", "e sesli harf sesiyle başlar"], ["an", "hour", "“hour” kelimesinde h okunmaz; sesli harf sesiyle başlar"], ["an", "umbrella", "“umbrella” /a/ sesiyle başlar"],
    ["an", "orange", "o sesli harf sesiyle başlar"], ["an", "English book", "“English” sesli harf sesiyle başlar"], ["an", "art lesson", "a sesli harf sesiyle başlar"],
  ];
  SORU_EKLE("enrol.article",
    z => {
      const k = karistir(TANIM), d = k[0], y = k.slice(1, 4);
      const ters = x => x[0] === "a" ? "an" : "a";
      return S({
        kaz: "enrol.article", duzey: "uygulama", zorluk: 2,
        soru: "Which phrase is <b>correct</b>?",
        dogru: `${d[0]} ${d[1]}`,
        yanlis: y.map(x => [`${ters(x)} ${x[1]}`, x[1] === "hour" || x[1] === "uniform" || x[1] === "university" ? "dikkat" : "kavrama", `Yanlış: “${x[1]}” için ${x[0]} gerekir, çünkü ${x[2]}.`]),
        ipucu: "Kelimenin yazılışına değil, ilk SESİNE dikkat et.",
        cozum: C("Dört ifadeden tanımlığı (a / an) doğru olanı seçeceğiz.", "a → sessiz harf sesiyle başlayan kelimeler (a book, a uniform); an → sesli harf sesiyle başlayan kelimeler (an apple, an hour).",
          `Her kelimenin ilk sesini söyle: ${[d].concat(y).map(x => x[1]).join(", ")}.`, `“${d[1]}”: ${d[2]}; bu yüzden “${d[0]}” gelir.`, `Cevap: ${d[0]} ${d[1]}.`, "Diğer üç ifadede tanımlık ters seçilmiş. hour, uniform, university gibi tuzaklı kelimeleri sesli okuyarak kontrol et."),
        kural: "a + sessiz ses (a uniform), an + sesli ses (an hour).",
        dogruNeden: `“${d[1]}” için ${d[0]} kullanılır, çünkü ${d[2]}.`,
      });
    },
    Q("enrol.article", "aciklama", 2, "Complete the text.<br><i>Our school has got ___ big garden. ___ garden has got lots of trees and flowers.</i>", "a / The",
      [["the / A", "kavrama", "İlk kez söz ederken a, ikinci kez söz ederken the kullanılır; burada tersi yapılmış."], ["an / The", "dikkat", "“big” sessiz harf sesiyle başlar; “an” değil “a” gelir."], ["a / A", "kavrama", "Bahçeden ikinci kez söz ediyoruz; artık hangi bahçe olduğu belli, “The” gerekir."]],
      "Bahçeden ilk kez mi, ikinci kez mi söz ediliyor?",
      C("İki boşluğa uygun tanımlıkları seçeceğiz.", "Bir şeyden ilk kez söz ederken a/an, aynı şeyden tekrar söz ederken the kullanırız.",
        "1. boşluk: Bahçeden ilk kez söz ediliyor ve “big” sessiz sesle başlıyor → a big garden.", "2. boşluk: Aynı bahçeden tekrar söz ediliyor; artık belli → The garden.", "Cevap: a / The.", "Cümle başındaki tanımlığın büyük harfle yazıldığına da dikkat et: The garden."),
      { kural: "İlk söyleyiş: a/an → tekrar söyleyiş: the.", dogruNeden: "İlk söyleyişte “a big garden”, aynı bahçe tekrar anıldığında “The garden” denir." }),
    Q("enrol.article", "aciklama", 2, "Which sentence is <b>wrong</b>?", "She is a art teacher.",
      [["He has got an orange bag.", "kavrama", "“orange” sesli harf sesiyle başlar; “an orange bag” doğrudur."], ["I wear a uniform at school.", "dikkat", "“uniform” /yu/ sesiyle başlar; “a uniform” doğrudur."], ["The Sun is very hot.", "bilgi", "Güneş tektir; “the Sun” doğrudur."]],
      "Her cümlede tanımlıktan sonraki kelimenin ilk sesine bak.",
      C("Dört cümleden tanımlığı yanlış kullanılanı bulacağız.", "a + sessiz ses, an + sesli ses; tek olan şeyler (the Sun, the Moon) the alır.",
        "an orange bag ✔ (o sesli), a uniform ✔ (/yu/ sessiz), the Sun ✔ (tek).", "a art teacher ✘: “art” sesli harf sesiyle başlar; “an art teacher” olmalı.", "Cevap: She is a art teacher.", "Doğrusunu söyleyerek kontrol et: She is an art teacher. Kulağa daha akıcı gelir, değil mi?"),
      { kural: "an art teacher, an English teacher, an engineer.", dogruNeden: "“art” sesli harf sesiyle başladığı için “an art teacher” denmeli." }),
    Q("enrol.article", "uygulama", 1, "We can see ___ Moon at night.", "the",
      [["a", "kavrama", "Dünya'nın tek bir Ay'ı var; tek olan şeyler için “the” kullanılır."], ["an", "kavrama", "“Moon” sessiz sesle başlar; üstelik tek olduğu için “the” gerekir."], ["–", "bilgi", "Tekil sayılabilen isim tanımlıksız kullanılmaz."]],
      "Gökyüzünde kaç tane Ay görüyoruz?",
      C("Moon (Ay) kelimesinden önce gelen tanımlığı bulacağız.", "Dünyada tek olan, herkesin bildiği şeyler için “the” kullanırız: the Sun, the Moon, the sky.",
        "Ay tektir; herkes hangi Ay'dan söz edildiğini bilir.", "Bu yüzden a/an kullanamayız.", "Cevap: We can see the Moon at night.", "Benzer örnekler: the Sun, the Earth, the sky. Hepsi tek!"),
      { kural: "Tek olan şeyler: the Sun, the Moon, the Earth.", dogruNeden: "Ay tektir ve herkesçe bilinir; bu yüzden “the Moon” deriz." }),
  );

  /* Emir cümleleri ve nesne zamirleri */
  const NESNE = [
    ["Ali", "doesn't", "him", [["he", "kavrama", "“he” özne zamiridir; fiilden sonra nesne zamiri (him) gelir."], ["her", "dikkat", "Ali bir erkek adıdır; “her” kız için kullanılır."], ["his", "bilgi", "“his” iyelik sıfatıdır (onun …); burada nesne zamiri gerekir."]]],
    ["Zeynep", "doesn't", "her", [["she", "kavrama", "“she” özne zamiridir; fiilden sonra nesne zamiri (her) gelir."], ["him", "dikkat", "Zeynep bir kız adıdır; “him” erkek için kullanılır."], ["them", "dikkat", "Zeynep tek kişidir; “them” birden çok kişi içindir."]]],
    ["Ece and Kaan", "don't", "them", [["they", "kavrama", "“they” özne zamiridir; fiilden sonra “them” gelir."], ["him", "dikkat", "İki kişiden söz ediliyor; “him” tek bir erkek içindir."], ["their", "bilgi", "“their” iyelik sıfatıdır (onların …); burada nesne zamiri gerekir."]]],
    ["My brother and I", "don't", "us", [["we", "kavrama", "“we” özne zamiridir; fiilden sonra “us” gelir."], ["them", "dikkat", "Konuşan kişi de gruba dahil (I); “them” değil “us” olmalı."], ["our", "bilgi", "“our” iyelik sıfatıdır (bizim …); burada nesne zamiri gerekir."]]],
    ["The new student", "doesn't", "him", [["he", "kavrama", "“he” özne zamiridir; fiilden sonra “him” gelir."], ["them", "dikkat", "Tek bir öğrenciden söz ediliyor."], ["his", "bilgi", "“his” iyelik sıfatıdır; burada nesne zamiri gerekir."]]],
  ];
  SORU_EKLE("enrol.rules",
    z => {
      const [kisi, yard, dogru, yanlis] = sec(NESNE), fiil = sec([["understand the question", "help"], ["know the rules", "tell"], ["know the way to the library", "show"]]);
      const not = kisi === "The new student" ? " (He is a boy.)" : "";
      return S({
        kaz: "enrol.rules", duzey: "uygulama", zorluk: 2,
        soru: `<b>${kisi} ${yard} ${fiil[0]}.</b>${not} The teacher says: “Please, ${fiil[1]} ___.”`,
        dogru, yanlis,
        ipucu: "Fiilden sonra kişiyi gösteren nesne zamirini kullan: me, you, him, her, it, us, them.",
        cozum: C(`Öğretmen “${fiil[1]}” fiilinden sonra ${kisi} için bir zamir kullanıyor.`, "Emir cümlesi fiille başlar. Fiilden sonra nesne zamiri gelir: I→me, he→him, she→her, we→us, they→them.",
          `${kisi} yerine geçen özne zamiri: ${{ him: "he", her: "she", them: "they", us: "we" }[dogru]}.`, `Bu zamirin nesne hâli: ${dogru}.`, `Cevap: Please, ${fiil[1]} ${dogru}.`, "Fiilden SONRA geliyorsa nesne zamiri (him, her, us, them); cümlenin BAŞINDA özne ise özne zamiri (he, she, we, they) kullanılır."),
        kural: "Fiil + nesne zamiri: help him, tell her, show us, help them.",
        dogruNeden: `${kisi} için fiilden sonra nesne zamiri “${dogru}” kullanılır.`,
      });
    },
    Q("enrol.rules", "transfer", 2, "Read the library rules.<br><i>LIBRARY RULES: Be quiet. Don't eat or drink. Don't write in the books. Return your books on time.</i><br>Which student is following the rules?", "Can is reading a book quietly.",
      [["Ada is eating crisps at the table.", "dikkat", "Kurallara göre kütüphanede yiyip içmek yasak (Don't eat or drink)."], ["Mert is writing notes in a library book.", "dikkat", "Kütüphane kitaplarına yazı yazmak yasak (Don't write in the books)."], ["Efe is talking loudly on the phone.", "dikkat", "Kütüphanede sessiz olmak gerekir (Be quiet)."]],
      "Her öğrencinin yaptığını kurallarla karşılaştır.",
      C("Kurallara uyan (following the rules) öğrenciyi bulacağız.", "Kurallar emir cümleleriyle yazılır: Be quiet = Sessiz ol, Don't eat = Yemek yeme.",
        "Ada yemek yiyor ✘, Mert kitaba yazıyor ✘, Efe yüksek sesle konuşuyor ✘.", "Can sessizce kitap okuyor ✔; hiçbir kuralı çiğnemiyor.", "Cevap: Can is reading a book quietly.", "Her seçenek için “Hangi kural?” diye sor; kuralı çiğneyen seçenekleri ele."),
      { kural: "Olumlu kural: Be quiet. Olumsuz kural: Don't + fiil.", dogruNeden: "Can sessizce okuyor; bu, “Be quiet” kuralına uyar." }),
    Q("enrol.rules", "uygulama", 1, "It's very cold in the classroom. The teacher says: “___ the window, please.”", "Close",
      [["Open", "kavrama", "Hava soğuk; pencereyi açmak sınıfı daha da soğutur."], ["Closes", "bilgi", "Emir cümlesinde fiil yalın hâlde olur; -s almaz."], ["Don't close", "kavrama", "Soğukta pencerenin kapanması gerekir; olumsuz emir anlamı ters çevirir."]],
      "Soğukta pencereye ne yaparız? Emir cümlesinde fiil hangi hâlde olur?",
      C("Sınıf soğuk; öğretmen pencereyle ilgili bir istekte bulunuyor.", "Emir cümlesi fiilin yalın hâliyle başlar: Close the door. Open your books.",
        "Anlam: Soğukta pencereyi kapatırız → close.", "Biçim: Emir cümlesinde fiil -s almaz → Close (Closes değil).", "Cevap: Close the window, please.", "Hem anlamı hem biçimi kontrol et; iki koşulu da sağlayan tek seçenek “Close”."),
      { kural: "Emir: fiilin yalın hâli + (please).", dogruNeden: "Soğukta pencere kapatılır ve emir cümlesinde fiil yalın kullanılır: Close." }),
    Q("enrol.rules", "aciklama", 2, "Which sentence is <b>wrong</b>?", "Please, listens to the teacher.",
      [["Don't be late for class.", "bilgi", "Olumsuz emir “Don't + fiil” ile kurulur; bu cümle doğrudur."], ["Put your phone in your bag.", "kavrama", "Fiilin yalın hâliyle başlayan doğru bir emir cümlesidir."], ["Help them, please.", "kavrama", "Fiil + nesne zamiri (them); bu cümle doğrudur."]],
      "Emir cümlelerinde fiilin hâline bak.",
      C("Dört emir cümlesinden yanlış yazılanı bulacağız.", "Emir cümlesinde özne yoktur ve fiil yalın hâldedir; -s, -ing almaz.",
        "Don't be late ✔, Put your phone ✔, Help them ✔.", "“listens” -s almış ✘; emir cümlesinde “listen” olmalı.", "Cevap: Please, listens to the teacher.", "Doğrusu: Please, listen to the teacher. -s ekini yalnızca he/she/it öznesiyle geniş zamanda kullanırız."),
      { kural: "Emirde fiil yalındır: listen, sit, open (listens değil).", dogruNeden: "Emir cümlesinde fiil -s almaz; “listen” olmalıdır." }),
  );

  /* =========================================================================
   * THEME 1 — SCHOOL ROUTINES
   * ========================================================================= */
  const FIIL = [
    ["go", "goes", "gos", "going", "to school at 8 o'clock", "o ile biten fiiller -es alır"],
    ["watch", "watches", "watchs", "watching", "a film on Fridays", "ch ile biten fiiller -es alır"],
    ["study", "studies", "studys", "studying", "English after school", "sessiz harf + y ile biten fiillerde y düşer, -ies gelir"],
    ["have", "has", "haves", "having", "lunch in the canteen", "have, he/she ile düzensiz olarak “has” olur"],
    ["play", "plays", "plaies", "playing", "volleyball on Tuesdays", "sesli harf + y ile biten fiiller yalnızca -s alır"],
    ["brush", "brushes", "brushs", "brushing", "their teeth after lunch", "sh ile biten fiiller -es alır"],
    ["finish", "finishes", "finishs", "finishing", "school at 3.30", "sh ile biten fiiller -es alır"],
    ["do", "does", "dos", "doing", "homework in the evening", "o ile biten fiiller -es alır"],
  ];
  const OZNE3 = [["Elif", "her"], ["Mert", "his"], ["My sister", "her"], ["Our teacher", "his"]], OZNEC = [["My friends", "their"], ["We", "our"], ["I", "my"], ["They", "their"]];
  SORU_EKLE("enrut.present",
    z => {
      const f = sec(FIIL), uc = Math.random() < 0.6, [oz, iy] = sec(uc ? OZNE3 : OZNEC), tamam = f[4].replace("their", iy);
      const dogru = uc ? f[1] : f[0];
      const yanlis = uc
        ? [[f[0], "kavrama", `Özne ${oz} (he/she); geniş zamanda fiil -s/-es almalı.`], [f[2], "dikkat", `Ek doğru ama yazım yanlış: ${f[5]}.`], [f[3], "bilgi", "-ing hâli tek başına geniş zaman yapmaz; şimdiki zamanda da is/are gerekir."]]
        : [[f[1], "kavrama", `Özne ${oz}; -s/-es yalnızca he/she/it öznesiyle kullanılır.`], [f[3], "bilgi", "-ing hâli tek başına geniş zaman yapmaz."], [f[2], "dikkat", "Bu yazım hiçbir özneyle doğru değildir."]];
      return S({
        kaz: "enrut.present", duzey: "uygulama", zorluk: uc ? 2 : 1,
        soru: `Complete the sentence about school routines:<br><b>${oz} ___ ${tamam}.</b>`,
        dogru, yanlis,
        ipucu: "Özne he/she/it mi? Öyleyse fiil -s/-es alır.",
        cozum: C("Okul rutinini anlatan cümlede fiilin doğru hâlini bulacağız.", "Geniş zaman (simple present) rutinleri anlatır. he/she/it → fiil + s/es; I/you/we/they → fiilin yalın hâli.",
          `Özne: ${oz} → ${uc ? "tekil üçüncü kişi (he/she)" : "I / we / they grubunda"}.`, uc ? `Fiil ${f[0]} → ${f[1]} (${f[5]}).` : `Fiil yalın kalır: ${f[0]}.`, `Cevap: ${oz} ${dogru} ${tamam}.`, `Özneyi zamirle değiştirip dene: ${uc ? "He/She " + f[1] : "They " + f[0]} … Kulağına doğru geliyor mu?`),
        kural: "he/she/it + fiil-s (goes, watches, studies, has); I/you/we/they + yalın fiil.",
        dogruNeden: uc ? `Özne tekil üçüncü kişi olduğu için fiil “${f[1]}” olur.` : `Özne ${oz} olduğu için fiil yalın hâlde “${f[0]}” kalır.`,
      });
    },
    Q("enrut.present", "uygulama", 2, "Read the text.<br><i>Hi, I'm Defne. My school starts at 8.30. I have six lessons a day. At lunch, I eat in the canteen with my friends. After school, I go to the chess club on Wednesdays.</i><br>When does Defne go to the chess club?", "on Wednesdays",
      [["every day", "dikkat", "Metinde satranç kulübüne her gün değil, çarşambaları gittiği yazıyor."], ["at 8.30", "dikkat", "8.30 okulun başladığı saattir."], ["at lunch", "dikkat", "Öğle arasında kantinde yemek yiyor; kulübe okuldan sonra gidiyor."]],
      "Metinde “chess club” kelimelerini bul.",
      C("Defne'nin satranç kulübüne ne zaman gittiği soruluyor.", "When = ne zaman. Cevap bir zaman ifadesi olmalı: on Mondays, at 9, every day…",
        "Metinde “chess club” geçen cümleyi bul: After school, I go to the chess club on Wednesdays.", "Zaman ifadesi: on Wednesdays (çarşambaları).", "Cevap: on Wednesdays.", "Diğer zaman ifadeleri (8.30, at lunch) metinde başka rutinler için kullanılmış; soruyla aynı cümlede değiller."),
      { kural: "Günlerle “on” kullanılır: on Mondays, on Wednesdays.", dogruNeden: "Metinde “I go to the chess club on Wednesdays.” yazıyor." }),
    Q("enrut.present", "aciklama", 2, "Which sentence is <b>wrong</b>?", "Ayşe don't walk to school.",
      [["We don't have lessons on Sundays.", "kavrama", "we öznesiyle olumsuzda “don't” kullanılır; doğrudur."], ["Does he play football after school?", "kavrama", "he öznesiyle soruda “Does” kullanılır; doğrudur."], ["My friends go home at 3.30.", "kavrama", "çoğul özneyle fiil yalın kalır; doğrudur."]],
      "he/she öznesiyle olumsuzda hangi yardımcı fiil gelir?",
      C("Geniş zaman cümlelerinden yanlış olanı bulacağız.", "Olumsuz: I/you/we/they + don't, he/she/it + doesn't. Soru: Do / Does + özne + yalın fiil.",
        "We don't ✔, Does he play ✔, My friends go ✔.", "Ayşe = she → “doesn't” olmalı; “don't” yanlış ✘.", "Cevap: Ayşe don't walk to school.", "Doğrusu: Ayşe doesn't walk to school. doesn't'tan sonra fiil yalın kalır (walks değil)."),
      { kural: "he/she/it → doesn't + yalın fiil; I/you/we/they → don't + yalın fiil.", dogruNeden: "Ayşe tekil üçüncü kişi olduğu için “doesn't” gerekir." }),
    Q("enrut.present", "transfer", 2, "Complete the dialogue.<br>— Does Kerem ride his bike to school?<br>— ___", "No, he doesn't. He walks.",
      [["No, he don't. He walks.", "kavrama", "he öznesiyle kısa cevapta “doesn't” kullanılır."], ["Yes, he is. He rides it.", "bilgi", "“Does” ile sorulan soruya “does / doesn't” ile cevap verilir, “is” ile değil."], ["Yes, he does. He walks.", "dikkat", "“Yes” dersen bisiklete biniyor demektir; ardından “yürüyor” demek çelişkilidir."]],
      "Soru “Does” ile başlıyor; kısa cevap da “does / doesn't” olmalı.",
      C("“Does” ile başlayan soruya uygun kısa cevabı seçeceğiz.", "Does he …? → Yes, he does. / No, he doesn't.",
        "Kısa cevabın yardımcı fiili soruyla aynı olmalı: does / doesn't.", "Ayrıca cevabın iki parçası birbirini tutmalı: “No” → bisiklete binmiyor → yürüyor.", "Cevap: No, he doesn't. He walks.", "Kısa cevabı bulduktan sonra ikinci cümlenin anlamca çelişip çelişmediğine bak."),
      { kural: "Does …? → Yes, … does. / No, … doesn't.", dogruNeden: "Hem doğru kısa cevap (No, he doesn't) hem de uyumlu açıklama (He walks) bu seçenekte var." }),
  );

  /* Sıklık zarfları: sözcük sırası */
  const ZARF = ["always", "usually", "often", "sometimes", "never"];
  const RUT_BE = [["late for school", "geç kalmak"], ["tired on Mondays", "pazartesileri yorgun olmak"], ["in the library at lunch", "öğle arası kütüphanede olmak"], ["happy on Fridays", "cumaları mutlu olmak"]];
  const RUT_FIIL = [["has", "have", "breakfast at 7"], ["walks", "walk", "to school with her friends"], ["reads", "read", "a book before bed"], ["plays", "play", "basketball after school"]];
  SORU_EKLE("enrut.freq",
    z => {
      const zarf = sec(ZARF), ad = sec(["Elif", "Tom", "Zehra", "Kaan"]);
      if (Math.random() < 0.5) {
        const [r] = sec(RUT_BE);
        return S({
          kaz: "enrut.freq", duzey: "uygulama", zorluk: 2,
          soru: `Which sentence has the <b>correct word order</b>? (${zarf})`,
          dogru: `${ad} is ${zarf} ${r}.`,
          yanlis: [[`${ad} ${zarf} is ${r}.`, "kavrama", "“be” fiili (am/is/are) varsa sıklık zarfı ondan SONRA gelir."], [`${ad} is ${r} ${zarf}.`, "kavrama", "Sıklık zarfı cümlenin sonuna değil, “is”ten hemen sonra gelir."], [`${ad} ${zarf} are ${r}.`, "dikkat", `${ad} tekil; “are” değil “is” kullanılır, zarfın yeri de yanlış.`]],
          ipucu: "Cümlede am / is / are var mı? Varsa zarf onun arkasına gelir.",
          cozum: C(`“${zarf}” zarfının cümledeki doğru yerini bulacağız.`, "Sıklık zarfı: be fiilinden (am/is/are) SONRA, diğer fiillerden ÖNCE gelir.",
            `Cümlemizde “is” var: ${ad} is … ${r}.`, `Zarf “is”ten hemen sonra: ${ad} is ${zarf} …`, `Cevap: ${ad} is ${zarf} ${r}.`, "Hatırlatma cümlesi: “She is always happy.” ama “She always smiles.”"),
          kural: "be + sıklık zarfı (is always); sıklık zarfı + fiil (always walks).",
          dogruNeden: "Cümlede “is” olduğu için sıklık zarfı “is”ten sonra gelir.",
        });
      }
      const [v3, v, r] = sec(RUT_FIIL);
      return S({
        kaz: "enrut.freq", duzey: "uygulama", zorluk: 2,
        soru: `Which sentence has the <b>correct word order</b>? (${zarf})`,
        dogru: `${ad} ${zarf} ${v3} ${r}.`,
        yanlis: [[`${ad} ${v3} ${zarf} ${r}.`, "kavrama", "Ana fiil varsa sıklık zarfı fiilden ÖNCE gelir."], [`${ad} ${zarf} ${v} ${r}.`, "dikkat", `Zarfın yeri doğru ama ${ad} tekil; fiil -s almalı (${v3}).`], [`${ad} is ${zarf} ${v3} ${r}.`, "bilgi", "Geniş zaman cümlesinde ana fiille birlikte “is” kullanılmaz."]],
        ipucu: "Cümlede am / is / are yoksa zarf ana fiilin önüne gelir.",
        cozum: C(`“${zarf}” zarfının cümledeki doğru yerini bulacağız.`, "Sıklık zarfı: diğer fiillerden ÖNCE, be fiilinden (am/is/are) SONRA gelir.",
          `Cümlemizde be fiili yok; ana fiil “${v3}”.`, `Zarf fiilden önce: ${ad} ${zarf} ${v3} …`, `Cevap: ${ad} ${zarf} ${v3} ${r}.`, "Zarf -s ekini almaz; ek yine fiilde kalır: always walks."),
        kural: "Özne + sıklık zarfı + fiil(-s): She usually walks to school.",
        dogruNeden: `Ana fiil “${v3}” olduğu için zarf ondan önce gelir.`,
      });
    },
    Q("enrut.freq", "uygulama", 2, "Look at Ada's week. Which sentence is <b>true</b>?", "Ada never plays computer games.",
      [["Ada always goes swimming.", "dikkat", "Ada haftada yalnızca 2 gün yüzüyor; “always” her gün demektir."], ["Ada never reads a book.", "dikkat", "Ada haftanın 7 günü kitap okuyor; “never” hiç demektir."], ["Ada sometimes reads a book.", "kavrama", "7 günün 7'sinde yapılan iş “always” ile anlatılır."]],
      "7 gün → always, 0 gün → never.",
      C("Tablodaki bilgilere uyan cümleyi bulacağız.", "Sıklık ölçeği: always (her zaman) > usually > often > sometimes > never (asla).",
        "reads a book: 7 gün → always; goes swimming: 2 gün → sometimes.", "plays computer games: 0 gün → never.", "Cevap: Ada never plays computer games.", "Her seçenekteki zarfı tablodaki gün sayısıyla eşleştir; yalnızca biri tutuyor."),
      { gorsel: G.tablo(["Activity", "Days a week"], [["reads a book", "7"], ["goes swimming", "2"], ["plays computer games", "0"]]), kural: "7/7 = always, 0/7 = never.", dogruNeden: "Tabloda bilgisayar oyunu 0 gün; bu “never” ile anlatılır." }),
    Q("enrut.freq", "transfer", 2, "Read the text.<br><i>My grandpa is very healthy. He always gets up at 6. He often walks in the park. He never drinks fizzy drinks, and he sometimes plays chess with me.</i><br>What does Grandpa <b>never</b> do?", "He drinks fizzy drinks.",
      [["He walks in the park.", "dikkat", "Parkta yürümeyi sık sık (often) yapıyor."], ["He plays chess.", "dikkat", "Satrancı bazen (sometimes) oynuyor."], ["He gets up at 6.", "dikkat", "Saat 6'da kalkmayı her zaman (always) yapıyor."]],
      "Metinde “never” kelimesini bul.",
      C("Dedenin hiç yapmadığı şey soruluyor.", "never = asla, hiç. Metinde “never” hangi fiilin önünde?",
        "Metindeki zarflar: always → gets up at 6, often → walks, sometimes → plays chess.", "never → drinks fizzy drinks (gazlı içecek içmek).", "Cevap: He drinks fizzy drinks.", "Soruda “never” var, cevapta değil; cevap, never ile birlikte kullanılan eylemdir."),
      { kural: "never = hiç; sometimes = bazen; often = sık sık.", dogruNeden: "Metinde “He never drinks fizzy drinks.” yazıyor." }),
  );

  /* There is / There are */
  const OKUL = [["gym", "gyms"], ["science lab", "science labs"], ["computer room", "computer rooms"], ["lift", "lifts"], ["music room", "music rooms"], ["swimming pool", "swimming pools"]];
  SORU_EKLE("enrut.there",
    z => {
      const k = karistir(OKUL).slice(0, 4), say = [1, R(2, 4), 0, sec([1, 2, 3])], s = karistir([0, 1, 2, 3]), d = {};
      k.forEach((x, i) => { d[x[0]] = say[s[i]]; });
      const [tek, cok] = sec(k), n = d[tek];
      let cumle, dogru, yanlis, aciklama;
      if (n === 0) {
        cumle = `There ___ any ${cok} in our school.`; dogru = "aren't";
        yanlis = [["are", "kavrama", "Tabloda 0 yazıyor; ayrıca olumlu cümlede “any” kullanılmaz."], ["isn't", "dikkat", "“any” + çoğul isimle “aren't” kullanılır."], ["is", "kavrama", "Tabloda 0 yazıyor; olumsuz cümle gerekir."]];
        aciklama = `0 tane → olumsuz; çoğul isim + any → There aren't any ${cok}.`;
      } else if (n === 1) {
        cumle = `There ___ a ${tek} in our school.`; dogru = "is";
        yanlis = [["are", "kavrama", "“a” + tekil isimle “is” kullanılır."], ["isn't", "dikkat", "Tabloda 1 yazıyor; yani var, olumsuz değil."], ["aren't", "kavrama", "Tabloda 1 yazıyor ve isim tekil."]];
        aciklama = `1 tane → tekil → There is a ${tek}.`;
      } else {
        cumle = `There ___ ${BIRLER[n]} ${cok} in our school.`; dogru = "are";
        yanlis = [["is", "kavrama", "Birden fazla (çoğul) şey için “are” kullanılır."], ["aren't", "dikkat", `Tabloda ${n} yazıyor; yani var, olumsuz değil.`], ["isn't", "kavrama", "Hem çoğul hem olumlu bir cümle gerekiyor."]];
        aciklama = `${n} tane → çoğul → There are ${BIRLER[n]} ${cok}.`;
      }
      return S({
        kaz: "enrut.there", duzey: "uygulama", zorluk: 2,
        soru: `Look at the table. Complete the sentence:<br><b>${cumle}</b>`,
        gorsel: G.tablo(["Our school", "How many?"], k.map(x => [x[0], d[x[0]]])),
        dogru, yanlis,
        ipucu: "Tablodaki sayıya bak: 0 mı, 1 mi, 1'den fazla mı?",
        cozum: C(`Tabloya göre okuldaki “${tek}” sayısını There is / There are ile anlatacağız.`, "There is + tekil (a gym), There are + çoğul (two gyms). Olumsuz: There isn't a … / There aren't any …",
          `Tabloda “${tek}” satırında ${n} yazıyor.`, aciklama, `Cevap: ${cumle.replace("___", dogru)}`, "Boşluktan sonraki kelimeye de bak: “a” tekil ister, “any” ise olumsuz ya da soru cümlesinde kullanılır."),
        kural: "There is a … / There are two … / There aren't any …",
        dogruNeden: aciklama,
      });
    },
    Q("enrut.there", "transfer", 2, "Complete the dialogue.<br>— Is there a swimming pool in your school?<br>— ___", "No, there isn't. But there is a big gym.",
      [["No, there aren't. But there is a big gym.", "kavrama", "Soru “Is there…?” ile sorulmuş; kısa cevap “there isn't” olmalı."], ["Yes, it is. It's a big gym.", "bilgi", "“Is there…?” sorusuna “there is / there isn't” ile cevap verilir, “it is” ile değil."], ["No, there isn't. But there are a big gym.", "dikkat", "“a big gym” tekildir; “there is” olmalı."]],
      "Soru “Is there…?” ile başlıyor. Kısa cevap da “there” ile olmalı.",
      C("“Is there…?” sorusuna uygun cevabı seçeceğiz.", "Is there …? → Yes, there is. / No, there isn't. Are there …? → Yes, there are. / No, there aren't.",
        "Soru tekil (Is there a…) → kısa cevap: No, there isn't.", "İkinci cümle: a big gym tekil → there is a big gym.", "Cevap: No, there isn't. But there is a big gym.", "Cevabın her iki parçasında da tekil/çoğul uyumunu kontrol et."),
      { kural: "Is there…? → there is / there isn't.", dogruNeden: "Kısa cevap ve ikinci cümle tekil isimle uyumlu: there isn't / there is." }),
    Q("enrut.there", "aciklama", 2, "Which sentence is <b>wrong</b>?", "There are a computer room on the first floor.",
      [["There is a big garden behind our school.", "kavrama", "Tekil isimle “There is” doğrudur."], ["There aren't any lockers in our classroom.", "kavrama", "Olumsuz çoğulda “There aren't any” doğrudur."], ["Are there any maps on the wall?", "kavrama", "Çoğul soru “Are there any…?” ile kurulur; doğrudur."]],
      "a + tekil isim, are ile kullanılabilir mi?",
      C("There is / There are cümlelerinden yanlış olanı bulacağız.", "There is + a + tekil isim; There are + çoğul isim.",
        "is a big garden ✔, aren't any lockers ✔, Are there any maps ✔.", "“are a computer room” ✘: “a computer room” tekil, “is” olmalı.", "Cevap: There are a computer room on the first floor.", "Doğrusu: There is a computer room on the first floor."),
      { kural: "a/an + tekil isim → There is.", dogruNeden: "“a computer room” tekil olduğu için “There is” gerekir." }),
  );

  /* =========================================================================
   * THEME 1 — NATIONAL DAYS AND CELEBRATIONS
   * ========================================================================= */
  const GUNLER_M = [
    ["National Sovereignty and Children's Day", 23, "April", "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı"],
    ["Commemoration of Atatürk, Youth and Sports Day", 19, "May", "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı"],
    ["Democracy and National Unity Day", 15, "July", "15 Temmuz Demokrasi ve Millî Birlik Günü"],
    ["Victory Day", 30, "August", "30 Ağustos Zafer Bayramı"],
    ["Republic Day", 29, "October", "29 Ekim Cumhuriyet Bayramı"],
  ];
  SORU_EKLE("ennat.days",
    z => {
      const g = sec(GUNLER_M), d = karistir(GUNLER_M.filter(x => x !== g)).slice(0, 3);
      return S({
        kaz: "ennat.days", duzey: "hatirlama", zorluk: 1,
        soru: `When is <b>${g[0]}</b>?`,
        dogru: `It's on ${siraKisa(g[1])} ${g[2]}.`,
        yanlis: d.map(x => [`It's on ${siraKisa(x[1])} ${x[2]}.`, "bilgi", `Bu tarih ${x[3]} tarihidir.`]),
        ipucu: "Bu günü Türkçe adıyla düşün; hangi ayda kutluyoruz?",
        cozum: C(`“${g[0]}” gününün tarihi soruluyor.`, "Tarih söylerken “on” kullanırız ve günü sıra sayısıyla yazarız: on 23rd April.",
          `${g[0]} = ${g[3]}.`, `Gün: ${g[1]} → ${siraKisa(g[1])}, ay: ${g[2]}.`, `Cevap: It's on ${siraKisa(g[1])} ${g[2]}.`, "Millî günleri ay sırasıyla ezberle: April → May → July → August → October."),
        kural: "Tarihlerde “on” + sıra sayısı + ay: on 29th October.",
        dogruNeden: `${g[0]}, yani ${g[3]}, ${siraKisa(g[1])} ${g[2]} tarihindedir.`,
      });
    },
    Q("ennat.days", "aciklama", 1, "On this day, young people do sports shows in stadiums all over Türkiye. It's ___.", "Youth and Sports Day",
      [["Republic Day", "bilgi", "Cumhuriyet Bayramı 29 Ekim'dedir; spor gösterileri 19 Mayıs'ın simgesidir."], ["Victory Day", "bilgi", "Zafer Bayramı 30 Ağustos'tadır ve Büyük Zafer'i kutlar."], ["Teachers' Day", "bilgi", "Öğretmenler Günü 24 Kasım'dadır; öğretmenlere teşekkür ederiz."]],
      "Gençlik ve spor hangi bayramın adında geçiyor?",
      C("Gençlerin stadyumlarda spor gösterisi yaptığı gün soruluyor.", "19 May = Commemoration of Atatürk, Youth and Sports Day (Atatürk'ü Anma, Gençlik ve Spor Bayramı).",
        "Metindeki ipuçları: young people (gençler), sports shows (spor gösterileri), stadiums (stadyumlar).", "Bu ipuçları bayramın adındaki “Youth” ve “Sports” kelimeleriyle eşleşiyor.", "Cevap: Youth and Sports Day.", "Bayram adlarındaki anahtar kelimelere bak: Children's (çocuk), Youth (gençlik), Victory (zafer), Republic (cumhuriyet)."),
      { kural: "youth = gençlik; sports = spor; 19th May.", dogruNeden: "Spor gösterileri 19 Mayıs Gençlik ve Spor Bayramı'nın simgesidir." }),
    Q("ennat.days", "uygulama", 2, "Read the text.<br><i>Republic Day is on 29th October. On this day in 1923, Türkiye became a republic. Every year, we celebrate it with ceremonies, flags and fireworks.</i><br>When did Türkiye become a republic?", "in 1923",
      [["in 1920", "bilgi", "1920'de (23 Nisan) Türkiye Büyük Millet Meclisi açıldı; cumhuriyet 1923'te ilan edildi."], ["in 1919", "bilgi", "1919'da (19 Mayıs) Atatürk Samsun'a çıktı."], ["every year", "kavrama", "“every year” kutlamanın ne sıklıkla yapıldığını anlatır; cumhuriyetin ilan yılı değildir."]],
      "Metinde “became a republic” ifadesinin yanındaki yılı bul.",
      C("Türkiye'nin hangi yıl cumhuriyet olduğu soruluyor.", "When did …? geçmişteki bir zamanı sorar. Cevap bir yıl olmalı: in + yıl.",
        "Metinde ilgili cümle: On this day in 1923, Türkiye became a republic.", "Yıl: 1923.", "Cevap: in 1923.", "“every year” bir sıklık ifadesidir; “When did…?” sorusu tek bir geçmiş zamanı ister."),
      { kural: "Yıllarla “in” kullanılır: in 1923.", dogruNeden: "Metinde “On this day in 1923, Türkiye became a republic.” yazıyor." }),
  );

  const WH = [
    ["___ is the ceremony?", "It's in the school garden.", "Where", "yer (in the school garden)"],
    ["___ does the ceremony start?", "At ten o'clock.", "When", "zaman (at ten o'clock)"],
    ["___ gives a speech at the ceremony?", "The headteacher does.", "Who", "kişi (the headteacher)"],
    ["___ do you wear on Republic Day?", "A white shirt and a red tie.", "What", "şey (a white shirt and a red tie)"],
    ["___ do the students sing?", "The national anthem.", "What", "şey (the national anthem)"],
    ["___ do people watch the fireworks?", "In the city square.", "Where", "yer (in the city square)"],
    ["___ is Victory Day?", "It's on 30th August.", "When", "zaman (on 30th August)"],
    ["___ carries the flag?", "Burak and Ece do.", "Who", "kişi (Burak and Ece)"],
  ];
  const WH_AC = { Who: "kişi sorar", When: "zaman sorar", Where: "yer sorar", What: "şey / nesne sorar" };
  SORU_EKLE("ennat.wh",
    z => {
      const [s, c, w, tur] = sec(WH);
      return S({
        kaz: "ennat.wh", duzey: "uygulama", zorluk: 1,
        soru: `Complete the question.<br>— <b>${s}</b><br>— ${c}`,
        dogru: w,
        yanlis: ["Who", "When", "Where", "What"].filter(x => x !== w).map(x => [x, "kavrama", `“${x}” ${WH_AC[x]}; oysa cevapta bir ${tur} var.`]),
        ipucu: "Önce cevaba bak: kişi mi, zaman mı, yer mi, bir şey mi?",
        cozum: C("Cevaba bakarak sorudaki Wh- kelimesini bulacağız.", "Who → kişi, When → zaman, Where → yer, What → şey.",
          `Cevap: “${c}”`, `Bu cevap bir ${tur} bildiriyor.`, `Cevap: ${w} — ${s.replace("___", w)}`, "Soruyu tamamlayıp cevapla birlikte yüksek sesle oku; soru ve cevap birbirine uyuyor mu?"),
        kural: "Who (kim), When (ne zaman), Where (nerede), What (ne).",
        dogruNeden: `Cevapta bir ${tur} olduğu için “${w}” kullanılır.`,
      });
    },
    Q("ennat.wh", "uygulama", 2, "Look at the poster.<br>— Where is the 23rd April show?<br>— ___", "It's in the school hall.",
      [["It's at 11 o'clock.", "kavrama", "Bu cevap “When / What time?” sorusuna uygundur; soru yer soruyor."], ["Class 6-A prepares it.", "kavrama", "Bu cevap “Who?” sorusuna uygundur."], ["It's on 23rd April.", "kavrama", "Bu bir tarih; “Where” ise yer sorar."]],
      "Where = nerede. Afişte “Place” satırına bak.",
      C("Afişe bakarak gösterinin nerede olduğunu bulacağız.", "Where → yer sorar; cevap genellikle in / at / on + yer olur.",
        "Afişte “Place” (yer) satırını bul.", "Place: School hall (okul salonu).", "Cevap: It's in the school hall.", "Diğer satırlar (Date, Time, Organiser) başka soruların cevabıdır: When?, What time?, Who?"),
      { gorsel: G.tablo(["23rd April Show", ""], [["Date", "23rd April"], ["Time", "11.00"], ["Place", "School hall"], ["Organiser", "Class 6-A"]]), kural: "Where → Place, When → Date, What time → Time, Who → kişi.", dogruNeden: "Afişte yer (Place) olarak “School hall” yazıyor." }),
    Q("ennat.wh", "aciklama", 2, "Which question–answer pair is <b>wrong</b>?", "— When is Republic Day? — In the school garden.",
      [["— Who reads the poem? — Zeynep does.", "kavrama", "Who kişi sorar; cevapta bir kişi (Zeynep) var. Doğru bir eşleşme."], ["— Where do we watch the parade? — In the main street.", "kavrama", "Where yer sorar; cevapta bir yer var. Doğru bir eşleşme."], ["— What do we hang on the windows? — Flags.", "kavrama", "What şey sorar; cevapta bir şey (Flags) var. Doğru bir eşleşme."]],
      "Her soru kelimesinin istediği bilgi türü cevapta var mı?",
      C("Soru ile cevabın uyuşmadığı eşleşmeyi bulacağız.", "Who → kişi, When → zaman, Where → yer, What → şey.",
        "Who → Zeynep ✔, Where → In the main street ✔, What → Flags ✔.", "When → “In the school garden” ✘: bu bir yerdir, zaman değildir.", "Cevap: — When is Republic Day? — In the school garden.", "Doğru cevap “It's on 29th October.” olmalıydı. Soru kelimesini gördüğünde cevabın türünü hemen tahmin et."),
      { kural: "When sorusu zamanla cevaplanır: on 29th October.", dogruNeden: "“When” zaman sorar ama cevap bir yer bildiriyor." }),
  );

  SORU_EKLE("ennat.celebrate",
    Q("ennat.celebrate", "uygulama", 2, "Read the text.<br><i>On 19th May, our school has a big sports show. Students wear white T-shirts. Some of them do gymnastics, and others play volleyball. Our families watch us and clap.</i><br>What do the families do?", "They watch the students and clap.",
      [["They do gymnastics.", "dikkat", "Jimnastiği öğrencilerin bir kısmı yapıyor, aileler değil."], ["They wear white T-shirts.", "dikkat", "Beyaz tişörtü öğrenciler giyiyor."], ["They play volleyball.", "dikkat", "Voleybolu diğer öğrenciler oynuyor."]],
      "Metinde “Our families” ile başlayan cümleyi bul.",
      C("Ailelerin 19 Mayıs gösterisinde ne yaptığı soruluyor.", "Okuma sorularında önce sorudaki anahtar kelimeyi (families) metinde buluruz.",
        "Metindeki cümle: Our families watch us and clap.", "watch = izlemek, clap = alkışlamak; “us” burada öğrencileri anlatıyor.", "Cevap: They watch the students and clap.", "Diğer seçeneklerdeki eylemleri yapan kişiler öğrenciler; özneye dikkat et."),
      { kural: "Okumada “kim, ne yapıyor?” sorusunda özneyi doğru eşleştir.", dogruNeden: "Metinde “Our families watch us and clap.” yazıyor." }),
    Q("ennat.celebrate", "uygulama", 1, "On Republic Day, we hang ___ on the windows and balconies.", "flags",
      [["fireworks", "bilgi", "Havai fişekler (fireworks) gökyüzünde patlatılır; pencereye asılmaz."], ["speeches", "kavrama", "Konuşmalar (speeches) yapılır, asılmaz."], ["parades", "kavrama", "Geçit törenleri (parades) caddelerde yapılır; asılacak bir şey değildir."]],
      "Pencere ve balkonlara ne asarız? Kırmızı-beyaz düşün.",
      C("Cumhuriyet Bayramı'nda pencere ve balkonlara asılan şeyi bulacağız.", "hang = asmak. Bayram kelimeleri: flag (bayrak), fireworks (havai fişek), parade (geçit töreni), speech (konuşma).",
        "Asılabilen bir nesne arıyoruz.", "Bayramlarda evlere ve okullara Türk bayrağı asarız: flags.", "Cevap: flags.", "Kelimeyi cümleye koyup oku: We hang flags on the windows. Anlamlı ve doğru!"),
      { kural: "hang flags = bayrak asmak; watch fireworks = havai fişek izlemek.", dogruNeden: "Bayramlarda pencere ve balkonlara bayrak (flags) asılır." }),
    Q("ennat.celebrate", "transfer", 2, "Complete the dialogue.<br>— What do you do at the 23rd April ceremony?<br>— ___", "We recite poems and perform folk dances.",
      [["We recite poems on 29th August.", "bilgi", "29 Ağustos bir millî gün değildir; ayrıca soru 23 Nisan törenini soruyor."], ["Yes, we do. It's great.", "kavrama", "“What” sorusu evet/hayır ile cevaplanmaz; bir etkinlik söylenmelidir."], ["It's in the school hall.", "kavrama", "Bu cevap “Where?” sorusuna uygundur."]],
      "What do you do…? → Ne yaparsınız? Cevapta etkinlikler olmalı.",
      C("Törende yapılan etkinlikleri soran bir soruya cevap seçeceğiz.", "What do you do…? sorusu etkinlik sorar; cevap: We + fiil… Kutlama fiilleri: recite (ezbere okumak), perform (sergilemek), sing, decorate.",
        "Evet/hayır cevabı ve yer bildiren cevap soruya uymaz.", "Etkinlik bildiren seçenek: recite poems (şiir okumak) ve perform folk dances (halk oyunları sergilemek).", "Cevap: We recite poems and perform folk dances.", "Soru kelimesine göre cevap türünü kontrol et: What do you do → etkinlik."),
      { kural: "recite a poem = şiir okumak; perform folk dances = halk oyunları oynamak.", dogruNeden: "Soru törende yapılanları soruyor; bu seçenek iki etkinlik söylüyor." }),
  );

  /* =========================================================================
   * THEME 2 — DAILY AND STUDY ROUTINES
   * ========================================================================= */
  const EYLEM = [
    ["read", "reads", "reading", "a book", "kitap okumak"],
    ["play", "plays", "playing", "chess", "satranç oynamak"],
    ["watch", "watches", "watching", "a cartoon", "çizgi film izlemek"],
    ["draw", "draws", "drawing", "a picture", "resim çizmek"],
    ["write", "writes", "writing", "an email", "e-posta yazmak"],
    ["do", "does", "doing", "homework", "ödev yapmak"],
  ];
  SORU_EKLE("endly.cont",
    z => {
      const e = sec(EYLEM), simdi = z % 2 === 0;
      const kisi = sec(["Ayşe", "Emre", "My cousin", "Our teacher"]);
      const zaman = simdi ? sec(["now", "at the moment", "right now"]) : sec(["every evening", "on Saturdays", "after school"]);
      const dogru = simdi ? `is ${e[2]}` : e[1];
      const yanlis = simdi
        ? [[e[1], "kavrama", `“${e[1]}” geniş zamandır; “${zaman}” ise şu anda olan bir eylemi gösterir.`], [`are ${e[2]}`, "dikkat", `Özne tekil (${kisi}); “are” değil “is” kullanılır.`], [`is ${e[0]}`, "bilgi", "Şimdiki zamanda fiile -ing eklenir: is + fiil-ing."]]
        : [[`is ${e[2]}`, "kavrama", `“${zaman}” bir alışkanlığı anlatır; şimdiki zaman değil geniş zaman kullanılır.`], [e[0], "dikkat", `Özne üçüncü tekil kişi (${kisi}); fiile -s/-es eklenmeli.`], [`are ${e[2]}`, "bilgi", "Hem zaman yanlış hem de tekil özneyle “are” kullanılmaz."]];
      return S({
        kaz: "endly.cont", duzey: "uygulama", zorluk: 2,
        soru: `Choose the correct option.<br>${kisi} ___ ${e[3]} ${zaman}.`,
        dogru, yanlis,
        ipucu: `Cümledeki zaman ifadesine bak: “${zaman}”.`,
        cozum: C(`Boşluğa “${e[0]}” (${e[4]}) fiilinin doğru hâlini yazacağız.`, "now / at the moment / right now → şimdiki zaman (am/is/are + fiil-ing). every evening / on Saturdays / after school → geniş zaman (fiil / fiil-s).",
          `Zaman ifadesi: “${zaman}”. Bu ${simdi ? "şu anda olan bir eylemi" : "tekrar eden bir alışkanlığı"} gösterir.`, `Özne “${kisi}” üçüncü tekil kişidir; bu yüzden ${simdi ? "“is + " + e[2] + "”" : "fiile -s/-es ekleriz: " + e[1]}.`,
          `Cevap: ${kisi} ${dogru} ${e[3]} ${zaman}.`, "Önce zaman ifadesini, sonra özneyi kontrol et; ikisi de doğru yardımcı fiili ve eki seçmeni sağlar."),
        kural: "Alışkanlık → simple present; şu anda olan → present continuous.",
        dogruNeden: `“${zaman}” ${simdi ? "şu an olan eylemi gösterir, tekil özneyle “is + -ing” kullanılır" : "alışkanlık bildirir, üçüncü tekil kişide fiil -s/-es alır"}.`,
      });
    },
    Q("endly.cont", "transfer", 2, "Read the message.<br><i>Hi Mum! I'm at Zeynep's house. We ___ for the English exam now. We usually study together on Thursdays.</i><br>Which option completes the message?", "are studying",
      [["study", "kavrama", "“study” geniş zamandır; mesajda “now” var, yani eylem şu anda oluyor."], ["is studying", "dikkat", "Özne “We”; çoğul özneyle “is” değil “are” kullanılır."], ["studies", "bilgi", "-s eki yalnızca he / she / it ile geniş zamanda kullanılır."]],
      "Boşluklu cümledeki “now” kelimesine dikkat et.",
      C("Mesajdaki boşluğa “study” fiilinin doğru hâlini koyacağız.", "Şu anda olan eylem: am / is / are + fiil-ing. Alışkanlık: geniş zaman.",
        "Boşluklu cümlede “now” var; eylem şu anda oluyor.", "Özne “We” olduğu için “are” seçeriz: are studying.", "Cevap: are studying.", "Sonraki cümle “usually” içerdiği için geniş zamanda (study); iki cümlenin farkına dikkat et."),
      { kural: "We / You / They + are + fiil-ing.", dogruNeden: "“now” şu anı gösterir ve özne “We” olduğu için “are studying” doğrudur." }),
    Q("endly.cont", "aciklama", 2, "Which sentence talks about a <b>daily routine</b>?", "Kerem gets up at seven o'clock every day.",
      [["Kerem is getting dressed now.", "kavrama", "“now” şu an olan bir eylemi anlatır; günlük rutin değildir."], ["Kerem is having breakfast at the moment.", "kavrama", "“at the moment” şu anı anlatır; rutin için geniş zaman kullanılır."], ["Look! Kerem is running to the bus stop.", "kavrama", "“Look!” şu anda gördüğümüz bir eylemi gösterir."]],
      "Rutin = her gün tekrar eden iş. Hangi zaman kullanılır?",
      C("Günlük rutini anlatan cümleyi seçeceğiz.", "Rutinler geniş zamanla anlatılır ve every day, usually, always gibi ifadelerle gelir.",
        "Üç seçenekte “is + fiil-ing” var: now, at the moment, Look! → şu an.", "Yalnızca bir cümlede geniş zaman (gets up) ve “every day” var.", "Cevap: Kerem gets up at seven o'clock every day.", "Cümlede tekrar bildiren bir ifade arıyorsan every day, on Mondays, usually gibi kelimelere bak."),
      { kural: "Routine → simple present + every day / usually.", dogruNeden: "Cümle geniş zamanda ve “every day” ile her gün tekrar eden bir işi anlatıyor." }),
  );

  /* How often…? */
  const SIKLIK = [
    ["every day", "her gün", 7], ["three times a week", "haftada üç kez", 3], ["twice a week", "haftada iki kez", 2], ["once a week", "haftada bir kez", 1], ["never", "hiçbir zaman", 0],
  ];
  const GUN_KISA = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  SORU_EKLE("endly.howoften",
    z => {
      const s = sec(SIKLIK), etk = sec([["swims", "swim", "yüzmek"], ["plays the guitar", "play the guitar", "gitar çalmak"], ["rides a bike", "ride a bike", "bisiklete binmek"], ["goes to the library", "go to the library", "kütüphaneye gitmek"]]);
      const kisi = sec(["Can", "Ece", "Burak", "Nil"]);
      const gunler = karistir(GUN_KISA.slice()).slice(0, s[2]);
      const satir = GUN_KISA.map(g => gunler.includes(g) ? "✔" : "—");
      const d = SIKLIK.filter(x => x !== s);
      const yaz = x => x[2] === 0 ? `${kisi} never ${etk[0]}.` : `${kisi} ${etk[0]} ${x[0]}.`;
      return S({
        kaz: "endly.howoften", duzey: "uygulama", zorluk: 2,
        soru: `Look at ${kisi}'s weekly chart. <b>How often does ${kisi} ${etk[1]}?</b>`,
        gorsel: G.tablo(["", ...GUN_KISA], [[etk[1], ...satir]]),
        dogru: yaz(s),
        yanlis: karistir(d).slice(0, 3).map(x => [yaz(x), "dikkat", `Tabloda ${s[2]} tane işaret var; “${x[0]}” ise ${x[1]} demektir.`]),
        ipucu: "Tablodaki ✔ işaretlerini say.",
        cozum: C(`${kisi}'in haftada kaç kez ${etk[2]} eylemini yaptığı soruluyor.`, "once a week = haftada 1, twice a week = haftada 2, three times a week = haftada 3, every day = her gün (7), never = hiç.",
          `Tablodaki ✔ işaretlerini sayalım: ${s[2]} tane.`, `${s[2]} kez = “${s[0]}” (${s[1]}).`, `Cevap: ${yaz(s)}`, "Saydıktan sonra sayıyı kalıpla eşleştir: 1 → once, 2 → twice, 3 ve üstü → … times."),
        kural: "How often…? → once / twice / three times a week, every day, never.",
        dogruNeden: `Tabloda ${s[2]} işaret var; bu “${s[0]}” demektir.`,
      });
    },
    Q("endly.howoften", "aciklama", 1, "Choose the correct question for the answer.<br>— ___<br>— Twice a month.", "How often do you visit your grandparents?",
      [["When do you visit your grandparents?", "kavrama", "“When” zaman sorar; cevabı “on Sundays” ya da “at the weekend” gibi olur."], ["Where do you visit your grandparents?", "kavrama", "“Where” yer sorar; “Twice a month” bir yer değildir."], ["How many grandparents have you got?", "kavrama", "“How many” sayı sorar; cevap “four” gibi olmalıydı."]],
      "“Twice a month” neyi anlatır: yer, zaman mı, sıklık mı?",
      C("Cevabı “Twice a month” olan soruyu bulacağız.", "twice a month = ayda iki kez. Sıklık sormak için “How often…?” kullanılır.",
        "Cevap bir sıklık bildiriyor.", "Seçeneklerden yalnızca biri “How often” ile başlıyor.", "Cevap: How often do you visit your grandparents?", "Soru kelimesi ile cevap türünü eşleştir: How often → sıklık, When → zaman, Where → yer."),
      { kural: "How often…? sorusunun cevabı: once / twice / three times a week / a month.", dogruNeden: "“Twice a month” bir sıklıktır ve sıklık “How often” ile sorulur." }),
    Q("endly.howoften", "transfer", 2, "Read Melis's plan.<br><i>I have piano lessons on Mondays and Thursdays. I go swimming on Saturdays. I tidy my room every day.</i><br>How often does Melis have piano lessons?", "Twice a week.",
      [["Once a week.", "dikkat", "Melis haftada bir kez yüzmeye gidiyor; piyano dersi iki gün var."], ["Every day.", "dikkat", "Her gün yaptığı iş odasını toplamak; piyano değil."], ["Three times a week.", "islem", "Piyano dersi yalnızca Monday ve Thursday günleri, yani iki gün."]],
      "Piyano dersinin hangi günlerde olduğunu say.",
      C("Melis'in piyano dersine haftada kaç kez gittiği soruluyor.", "once = 1 kez, twice = 2 kez, three times = 3 kez.",
        "Metinde piyano dersi: on Mondays and Thursdays.", "Pazartesi + perşembe = 2 gün → twice a week.", "Cevap: Twice a week.", "Metinde her etkinliği ayrı ayrı işaretle; soruda sorulan etkinliği karıştırma."),
      { kural: "2 kez = twice (two times değil).", dogruNeden: "Piyano dersi pazartesi ve perşembe, yani haftada iki kez (twice a week)." }),
  );

  /* Question tags (geniş zaman ve şimdiki zaman) */
  const TAG_C = [
    ["Your brother plays football", "doesn't he?", [["isn't he?", "kavrama", "Cümle geniş zamanda; tag'de am / is / are değil do / does kullanılır."], ["don't he?", "dikkat", "“he” ile “do” değil “does” kullanılır."], ["does he?", "dikkat", "Olumlu cümleye olumsuz tag gelir; burada tag de olumlu kalmış."]], "geniş zaman, olumlu, özne he"],
    ["Elif likes maths", "doesn't she?", [["isn't she?", "kavrama", "Cümle geniş zamanda; tag'de am / is / are değil do / does kullanılır."], ["does she?", "dikkat", "Olumlu cümleye olumsuz tag gelir; burada tag de olumlu kalmış."], ["didn't she?", "bilgi", "“did” geçmiş zamandır; cümle geniş zamanda."]], "geniş zaman, olumlu, özne she"],
    ["They live in Izmir", "don't they?", [["doesn't they?", "dikkat", "“they” ile “does” değil “do” kullanılır."], ["aren't they?", "kavrama", "Cümle geniş zamanda; tag'de am / is / are değil do / does kullanılır."], ["do they?", "dikkat", "Olumlu cümleye olumsuz tag gelir; burada tag de olumlu kalmış."]], "geniş zaman, olumlu, özne they"],
    ["You are reading a comic", "aren't you?", [["don't you?", "kavrama", "Cümle şimdiki zamanda; tag'de do / does değil am / is / are kullanılır."], ["are you?", "dikkat", "Olumlu cümleye olumsuz tag gelir; burada tag de olumlu kalmış."], ["isn't you?", "dikkat", "“you” ile “is” değil “are” kullanılır."]], "şimdiki zaman, olumlu, özne you"],
    ["Mert is doing his homework", "isn't he?", [["doesn't he?", "kavrama", "Cümle şimdiki zamanda; tag'de do / does değil am / is / are kullanılır."], ["is he?", "dikkat", "Olumlu cümleye olumsuz tag gelir; burada tag de olumlu kalmış."], ["aren't he?", "dikkat", "“he” ile “are” değil “is” kullanılır."]], "şimdiki zaman, olumlu, özne he"],
    ["The girls aren't sleeping", "are they?", [["aren't they?", "dikkat", "Olumsuz cümleye olumlu tag gelir; burada tag de olumsuz kalmış."], ["do they?", "kavrama", "Cümle şimdiki zamanda; tag'de do / does değil am / is / are kullanılır."], ["is she?", "dikkat", "“The girls” çoğuldur; zamir “they”, yardımcı fiil “are” olmalı."]], "şimdiki zaman, olumsuz, özne they"],
    ["Ali doesn't eat fish", "does he?", [["doesn't he?", "dikkat", "Olumsuz cümleye olumlu tag gelir; burada tag de olumsuz kalmış."], ["is he?", "kavrama", "Cümle geniş zamanda; tag'de am / is / are değil do / does kullanılır."], ["do he?", "dikkat", "“he” ile “do” değil “does” kullanılır."]], "geniş zaman, olumsuz, özne he"],
  ];
  SORU_EKLE("endly.tags",
    z => {
      const t = sec(TAG_C);
      return S({
        kaz: "endly.tags", duzey: "uygulama", zorluk: 2,
        soru: `Choose the correct question tag.<br>${t[0]}, ___`,
        dogru: t[1],
        yanlis: t[2],
        ipucu: "Cümlenin zamanını, öznesini ve olumlu/olumsuz olduğunu bul.",
        cozum: C(`“${t[0]}” cümlesine uygun soru eki (question tag) bulacağız.`, "Kural: olumlu cümle → olumsuz tag; olumsuz cümle → olumlu tag. Geniş zamanda do/does, şimdiki zamanda am/is/are kullanılır. Tag'de özne zamiri olur.",
          `Cümlenin özellikleri: ${t[3]}.`, `Buna göre tag: ${t[1]}`, `Cevap: ${t[0]}, ${t[1]}`, "Tag'i söyle: yardımcı fiil + zamir. Zamir cümlenin öznesini anlatmalı (Elif → she, the girls → they)."),
        kural: "Olumlu → olumsuz tag; olumsuz → olumlu tag (doesn't he? / are they?).",
        dogruNeden: `Cümle ${t[3]} olduğu için tag “${t[1]}” olur.`,
      });
    },
    Q("endly.tags", "transfer", 2, "Complete the dialogue.<br>— Your sister is studying in her room, ___<br>— Yes, she is. She has got an exam tomorrow.", "isn't she?",
      [["doesn't she?", "kavrama", "Cümle şimdiki zamanda (is studying); tag'de “does” değil “is” kullanılır."], ["is she?", "dikkat", "Cümle olumlu; tag olumsuz olmalı."], ["isn't he?", "dikkat", "“Your sister” bir kızdır; zamir “she” olmalı."]],
      "Cevaptaki “Yes, she is.” sana yardımcı fiili gösteriyor.",
      C("Şimdiki zamanda olumlu bir cümleye tag ekleyeceğiz.", "Şimdiki zaman: is → tag'de isn't. Olumlu cümle → olumsuz tag.",
        "Yardımcı fiil “is”, cümle olumlu → isn't.", "Özne “your sister” → she.", "Cevap: isn't she?", "Cevaptaki kısa yanıt “Yes, she is.” da tag'in “isn't she?” olduğunu doğrular."),
      { kural: "is + fiil-ing cümlesi → isn't + zamir?", dogruNeden: "Cümle olumlu şimdiki zamanda ve özne “she”; bu yüzden “isn't she?” olur." }),
    Q("endly.tags", "aciklama", 3, "Which sentence has the <b>correct</b> question tag?", "We don't go to school on Sundays, do we?",
      [["Hasan usually walks to school, isn't he?", "kavrama", "Geniş zamanda tag “doesn't he?” olur; “is” kullanılmaz."], ["You are listening to me, are you?", "dikkat", "Olumlu cümleye olumsuz tag gelir: aren't you?"], ["Your parents work in a bank, doesn't they?", "dikkat", "“they” ile “do” kullanılır: don't they?"]],
      "Her cümlede zaman, özne ve olumlu/olumsuz uyumunu kontrol et.",
      C("Doğru soru eki kullanılan cümleyi bulacağız.", "Geniş zaman → do/does; şimdiki zaman → am/is/are. Olumlu ↔ olumsuz.",
        "1. cümle: walks (geniş zaman) → doesn't he? olmalı. 2. cümle: olumlu → aren't you? olmalı. 3. cümle: they → don't they? olmalı.", "“We don't go… , do we?” → olumsuz cümle, olumlu tag, özne we. Doğru!", "Cevap: We don't go to school on Sundays, do we?", "Elemeyle çalış: her cümlede üç şeyi kontrol et ve yanlış olanları çiz."),
      { kural: "Olumsuz cümle + olumlu tag: We don't…, do we?", dogruNeden: "Cümle olumsuz geniş zamanda ve öznesi “we”; tag “do we?” olarak doğru kurulmuş." }),
  );

  /* =========================================================================
   * THEME 2 — LEARNING ACTIVITIES IN THE CLASSROOM
   * ========================================================================= */
  const ETKINLIK = [
    ["keep a diary", "write about your day in a notebook every evening", "her akşam bir deftere gününü yazmak"],
    ["role-play", "act out a dialogue with a friend", "bir arkadaşla diyaloğu canlandırmak"],
    ["sort the words", "put the words into groups", "kelimeleri gruplara ayırmak"],
    ["make a poster", "draw pictures and write on a big paper", "büyük bir kâğıda resim çizip yazı yazmak"],
    ["do a quiz", "answer short questions in a game", "bir oyunda kısa soruları cevaplamak"],
    ["make flashcards", "write words on small cards", "kelimeleri küçük kartlara yazmak"],
  ];
  SORU_EKLE("enlrn.activities",
    z => {
      const e = sec(ETKINLIK), d = karistir(ETKINLIK.filter(x => x !== e)).slice(0, 3);
      return S({
        kaz: "enlrn.activities", duzey: "hatirlama", zorluk: 1,
        soru: `Our teacher says, “Please <b>${e[1]}</b>.” Which learning activity is this?`,
        dogru: e[0],
        yanlis: d.map(x => [x[0], "bilgi", `“${x[0]}” etkinliğinde ${x[2]} gerekir.`]),
        ipucu: "Öğretmenin tarif ettiği işi Türkçeye çevirip düşün.",
        cozum: C("Öğretmenin tarif ettiği öğrenme etkinliğinin adını bulacağız.", "Sınıf etkinlikleri: keep a diary (günlük tutmak), role-play (canlandırma), sort (gruplama), make a poster (afiş hazırlamak), do a quiz (kısa sınav/yarışma), make flashcards (kelime kartı hazırlamak).",
          `Tarif: “${e[1]}” → ${e[2]}.`, `Bu işin adı: ${e[0]}.`, `Cevap: ${e[0]}.`, "Diğer seçenekleri de Türkçeye çevir; hiçbiri bu tarife uymuyorsa doğru yoldasın."),
        kural: "Sınıf etkinliği kalıpları: keep a diary, do a quiz, make a poster, role-play.",
        dogruNeden: `“${e[0]}” = ${e[2]}.`,
      });
    },
    Q("enlrn.activities", "transfer", 2, "Read the text.<br><i>I'm Bora. I want to learn new English words. I write each word on a small card and I draw a picture on the back. I look at my cards every day.</i><br>What does Bora do?", "He makes flashcards.",
      [["He keeps a diary.", "kavrama", "Günlük tutmak gününü anlatmaktır; Bora kelime kartı hazırlıyor."], ["He does a role-play.", "bilgi", "Canlandırma bir arkadaşla diyalog oynamaktır; metinde yok."], ["He makes a poster.", "dikkat", "Bora büyük bir kâğıda değil, küçük kartlara yazıyor."]],
      "small card + new words = ?",
      C("Bora'nın kelime öğrenmek için yaptığı etkinliği bulacağız.", "flashcard = bir yüzünde kelime, diğer yüzünde resim/anlam olan küçük kart.",
        "Metinde: write each word on a small card, draw a picture on the back.", "Bu tarif kelime kartı (flashcard) hazırlamaktır.", "Cevap: He makes flashcards.", "Metindeki anahtar kelimeleri (small card, word) seçeneklerle eşleştir."),
      { kural: "make flashcards = kelime kartı hazırlamak.", dogruNeden: "Bora kelimeleri küçük kartlara yazıp arkalarına resim çiziyor; bu flashcard hazırlamaktır." }),
    Q("enlrn.activities", "uygulama", 2, "Look at the table. <b>Which student likes learning with friends by acting?</b>", "Arda",
      [["Lale", "dikkat", "Lale günlük tutmayı seviyor; bu tek başına yapılan bir etkinliktir."], ["Sena", "dikkat", "Sena kelimeleri gruplamayı seviyor; canlandırma yapmıyor."], ["Kaan", "dikkat", "Kaan kısa sınav (quiz) yapmayı seviyor."]],
      "acting (canlandırma) hangi etkinlik?",
      C("Arkadaşlarıyla canlandırma yaparak öğrenmeyi seven öğrenciyi bulacağız.", "act = rol yapmak, canlandırmak → role-play.",
        "Tabloda “role-play” kelimesini ara.", "role-play, Arda'nın satırında.", "Cevap: Arda.", "Önce soruyu etkinlik adına çevir, sonra tabloda o adı bul."),
      { gorsel: G.tablo(["Student", "Favourite activity"], [["Lale", "keep a diary"], ["Arda", "role-play"], ["Sena", "sort the words"], ["Kaan", "do a quiz"]]),
        kural: "role-play = bir arkadaşla canlandırma yapmak.", dogruNeden: "Canlandırma (role-play) Arda'nın en sevdiği etkinliktir." }),
  );

  /* İyelik sıfatları */
  const IYELIK = [["I", "my"], ["you", "your"], ["he", "his"], ["she", "her"], ["it", "its"], ["we", "our"], ["they", "their"]];
  const KISI_IY = [
    ["Mehmet", "his", "he"], ["Zehra", "her", "she"], ["My parents", "their", "they"], ["The cat", "its", "it"], ["Ali and I", "our", "we"],
  ];
  SORU_EKLE("enlrn.possadj",
    z => {
      const k = sec(KISI_IY), esya = sec(["schoolbag", "pencil case", "notebook", "bike"]);
      const nesne = k[0] === "The cat" ? sec(["bowl", "bed"]) : esya;
      const d = karistir(IYELIK.filter(x => x[1] !== k[1])).slice(0, 3);
      return S({
        kaz: "enlrn.possadj", duzey: "uygulama", zorluk: 1,
        soru: `Choose the correct word.<br>${k[0]} ${k[2] === "they" || k[2] === "we" ? "have" : "has"} got a new ${nesne}. ___ ${nesne} is blue.`,
        dogru: k[1][0].toUpperCase() + k[1].slice(1),
        yanlis: d.map(x => [x[1][0].toUpperCase() + x[1].slice(1), "kavrama", `“${x[1]}” ${x[0]} öznesinin iyelik sıfatıdır; burada sahip “${k[0]}” (${k[2]}).`]),
        ipucu: `Önce “${k[0]}” yerine hangi zamiri kullanacağını düşün.`,
        cozum: C(`${nesne} kelimesinin sahibini gösteren iyelik sıfatını bulacağız.`, "I → my, you → your, he → his, she → her, it → its, we → our, they → their.",
          `Sahip: ${k[0]}. Onun zamiri: ${k[2]}.`, `${k[2]} → ${k[1]}.`, `Cevap: ${k[1][0].toUpperCase() + k[1].slice(1)} ${nesne} is blue.`, "İyelik sıfatı her zaman bir isimden önce gelir: my book, their house."),
        kural: "İyelik sıfatı + isim: his bag, her book, their car.",
        dogruNeden: `“${k[0]}” = ${k[2]}; onun iyelik sıfatı “${k[1]}”.`,
      });
    },
    Q("enlrn.possadj", "transfer", 2, "Complete the dialogue.<br>— Excuse me, is this ___ dictionary, Mrs Kaya?<br>— Yes, it is. Thank you!", "your",
      [["her", "kavrama", "Mrs Kaya ile doğrudan konuşuyoruz; karşımızdaki kişiye “your” deriz."], ["my", "kavrama", "“my” konuşanın kendisine ait olanı gösterir; sözlük Mrs Kaya'nın."], ["you", "bilgi", "“you” bir zamirdir; isimden önce iyelik sıfatı “your” gelir."]],
      "Konuştuğun kişiye ait bir şeyi soruyorsun.",
      C("Mrs Kaya'ya, sözlüğün onun olup olmadığını soruyoruz.", "Karşımızdaki kişiye ait olan → your. Bir isimden önce zamir (you) değil iyelik sıfatı (your) kullanılır.",
        "Konuşan öğrenci, dinleyen Mrs Kaya.", "Dinleyen kişiye ait sözlük → your dictionary.", "Cevap: your.", "“her” üçüncü bir kişiden söz ederken kullanılır; yüzüne konuştuğumuz kişi için değil."),
      { kural: "Konuştuğun kişi → you / your.", dogruNeden: "Doğrudan Mrs Kaya ile konuşuluyor; ona ait olan şey için “your” kullanılır." }),
    Q("enlrn.possadj", "aciklama", 2, "Which sentence is <b>correct</b>?", "The bird is in its cage.",
      [["The bird is in it's cage.", "dikkat", "“it's” = it is demektir; iyelik sıfatı kesme işaretsiz “its” yazılır."], ["The children are with his teacher.", "kavrama", "“The children” çoğuldur; iyelik sıfatı “their” olmalı."], ["Ayşe loves him brother.", "bilgi", "“him” nesne zamiridir; Ayşe'nin kardeşi için “her brother” denir."]],
      "Her cümlede sahibi bul ve iyelik sıfatıyla eşleştir.",
      C("İyelik sıfatı doğru kullanılmış cümleyi bulacağız.", "he → his, she → her, it → its, they → their. its (iyelik) ile it's (it is) farklıdır.",
        "Çocuklar (they) → their teacher olmalı. Ayşe (she) → her brother olmalı.", "it's = it is; kafes kuşa ait olduğu için “its cage” doğrudur.", "Cevap: The bird is in its cage.", "Bir kelimede kesme işareti görürsen açılımını dene: it's → it is. Anlam bozuluyorsa “its” yaz."),
      { kural: "its = onun (hayvan/eşya); it's = it is.", dogruNeden: "Kafes kuşa aittir; “it” için iyelik sıfatı kesme işaretsiz “its” olur." }),
  );

  /* Hal zarfları */
  const ZARF_H = [
    ["careful", "carefully", "dikkatle"], ["quiet", "quietly", "sessizce"], ["slow", "slowly", "yavaşça"], ["quick", "quickly", "hızlıca"], ["loud", "loudly", "yüksek sesle"], ["neat", "neatly", "düzenli bir şekilde"],
  ];
  const ZARF_C = [
    ["Please read the questions ___.", "careful", "carefully"], ["We work ___ in the library.", "quiet", "quietly"], ["The old man walks ___.", "slow", "slowly"], ["Tuna finishes his lunch ___ and goes out.", "quick", "quickly"], ["Nur writes ___ in her notebook.", "neat", "neatly"],
  ];
  SORU_EKLE("enlrn.adverb",
    z => {
      const c = sec(ZARF_C), a = ZARF_H.find(x => x[0] === c[1]);
      const baska = sec(ZARF_H.filter(x => x !== a));
      return S({
        kaz: "enlrn.adverb", duzey: "uygulama", zorluk: 1,
        soru: `Choose the correct word.<br>${c[0]}`,
        dogru: c[2],
        yanlis: [[c[1], "kavrama", `“${c[1]}” bir sıfattır; fiili (eylemin nasıl yapıldığını) zarf anlatır: ${c[2]}.`], [c[1] + "ly" === c[2] ? c[1] + "ely" : c[1] + "ly", "dikkat", `Yazıma dikkat: doğru biçim “${c[2]}”.`], [baska[1], "kavrama", `“${baska[1]}” = ${baska[2]}; cümlenin anlamına uymuyor.`]],
        ipucu: "Boşluk bir fiilin nasıl yapıldığını anlatıyor.",
        cozum: C("Boşluğa fiili niteleyen kelimeyi koyacağız.", "Hal zarfı eylemin nasıl yapıldığını anlatır ve çoğunlukla sıfat + -ly ile yapılır: careful → carefully. Zarf genellikle fiilden (ve nesneden) sonra gelir.",
          `Sıfat: ${a[0]} → zarf: ${a[1]} (${a[2]}).`, "Zarf, fiilden ya da nesneden sonra cümlenin sonuna yerleşir.", `Cevap: ${c[0].replace("___", c[2])}`, "Kendine sor: “Nasıl?” Cevap -ly ile bitiyorsa zarf seçmişsindir."),
        kural: "Sıfat + ly = zarf (quiet → quietly).",
        dogruNeden: `Eylemin nasıl yapıldığını zarf anlatır: ${c[2]}.`,
      });
    },
    Q("enlrn.adverb", "aciklama", 2, "Which sentence has the <b>correct word order</b>?", "She opens the door quietly.",
      [["She quietly opens the door quietly.", "dikkat", "Zarf iki kez yazılmış; bir cümlede bir kez yeterli."], ["She opens quietly the door.", "bilgi", "Zarf, fiil ile nesnenin arasına girmez; nesneden sonra gelir."], ["Quietly she the door opens.", "bilgi", "İngilizce cümlede sıra özne + fiil + nesne şeklindedir."]],
      "Özne + fiil + nesne + zarf",
      C("Sözcük sırası doğru olan cümleyi bulacağız.", "İngilizce cümle sırası: özne + fiil + nesne + hal zarfı.",
        "Özne: She, fiil: opens, nesne: the door, zarf: quietly.", "Sıraya dizelim: She opens the door quietly.", "Cevap: She opens the door quietly.", "Fiil ile nesneyi ayırma: “opens the door” birlikte kalmalı."),
      { kural: "Özne + fiil + nesne + zarf: He reads the text carefully.", dogruNeden: "Cümle özne + fiil + nesne + zarf sırasına uyuyor." }),
    Q("enlrn.adverb", "transfer", 2, "Read the classroom rules.<br><i>1. Listen to your teacher ___.<br>2. Walk ___ in the corridors. Don't run!<br>3. Write ___. Your teacher must read it.</i><br>Which words complete the rules?", "carefully – slowly – neatly",
      [["careful – slow – neat", "kavrama", "Bunlar sıfattır; eylemleri (listen, walk, write) zarflar anlatır."], ["quickly – loudly – carefully", "kavrama", "Koridorda hızlı yürümek ve yüksek sesle dinlemek kurallara uymaz."], ["loudly – quickly – slowly", "kavrama", "“Don't run!” diyor; hızlı (quickly) yürümek kurala aykırıdır."]],
      "Her kuralın anlamını düşün; 2. kuralda “Don't run!” var.",
      C("Sınıf kurallarına uygun zarfları seçeceğiz.", "Zarflar fiilden sonra gelir ve eylemin nasıl yapıldığını anlatır.",
        "1. Öğretmeni dikkatle dinle → carefully. 2. Koşma, yavaş yürü → slowly.", "3. Öğretmenin okuyabilmesi için düzgün yaz → neatly.", "Cevap: carefully – slowly – neatly.", "Hem dil bilgisine (zarf mı?) hem de anlama (kurala uygun mu?) bakmalısın."),
      { kural: "listen carefully, walk slowly, write neatly.", dogruNeden: "Üç boşluk da fiili niteliyor ve anlamca sınıf kurallarına uyuyor." }),
  );

  /* =========================================================================
   * THEME 2 — NUMBERS 100–500, 1st–50th
   * ========================================================================= */
  SORU_EKLE("ennum.cardinal",
    z => {
      const n = R(101, 499);
      const yuz = Math.floor(n / 100), kalan = n % 100;
      const y1 = kalan === 0 ? kelime(n + 10) : `${BIRLER[yuz]} hundred ${yuzAlti(kalan)}`;
      const y2 = kalan < 10 && kalan > 0 ? kelime(n + 9) : kelime(yuz * 100 + (kalan % 10) * 10 + Math.floor(kalan / 10) === n ? n + 1 : yuz * 100 + (kalan % 10) * 10 + Math.floor(kalan / 10));
      const y3 = kelime(n + 100 > 500 ? n - 100 : n + 100);
      return S({
        kaz: "ennum.cardinal", duzey: "hatirlama", zorluk: 2,
        soru: `How do we say <b>${n}</b> in English?`,
        dogru: kelime(n),
        yanlis: [[y1, kalan === 0 ? "dikkat" : "bilgi", kalan === 0 ? "Onlar ve birler basamağına dikkat et." : "İngiliz İngilizcesinde “hundred” ile sonraki sayı arasına “and” eklenir."], [y2, "dikkat", "Onlar ve birler basamağındaki rakamları karıştırmışsın."], [y3, "dikkat", "Yüzler basamağına dikkat et."]],
        ipucu: "Önce yüzler basamağını, sonra kalan iki basamağı oku.",
        cozum: C(`${n} sayısını İngilizce yazacağız.`, "Yüzlük sayılar: rakam + hundred. İngiliz İngilizcesinde kalan kısım “and” ile bağlanır: 205 = two hundred and five.",
          `Yüzler: ${yuz} → ${BIRLER[yuz]} hundred.`, kalan ? `Kalan: ${kalan} → ${yuzAlti(kalan)}.` : "Kalan kısım yok; yalnızca “hundred”.", `Cevap: ${kelime(n)}.`, "Sesli oku ve basamakları rakamla karşılaştır: yüzler, onlar, birler."),
        kural: "345 = three hundred and forty-five (hundreds yazılmaz).",
        dogruNeden: `${n} = ${kelime(n)}.`,
      });
    },
    z => {
      const a = R(1, 4) * 100, b = R(1, 9) * 10, n = a + b;
      return S({
        kaz: "ennum.cardinal", duzey: "uygulama", zorluk: 2,
        soru: `Add the numbers and choose the answer in words.<br><b>${kelime(a)}</b> + <b>${kelime(b)}</b> = ___`,
        dogru: kelime(n),
        yanlis: [[kelime(n + 10), "islem", "Toplamada onlar basamağını bir fazla saymışsın."], [kelime(a + b / 10), "islem", `“${kelime(b)}” = ${b}; ${b / 10} değil.`], [kelime(n + 100 > 500 ? n - 100 : n + 100), "islem", "Yüzler basamağına dikkat et."]],
        ipucu: "Önce kelimeleri rakama çevir, topla, sonra yeniden kelimeye çevir.",
        cozum: C("İki sayıyı toplayıp sonucu İngilizce yazacağız.", "ten, twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety; one hundred … five hundred.",
          `${kelime(a)} = ${a}, ${kelime(b)} = ${b}.`, `${a} + ${b} = ${n}.`, `Cevap: ${kelime(n)}.`, `Kontrol: ${n} − ${b} = ${a}; yani ${kelime(a)}. Doğru!`),
        kural: "Sayıları önce rakama çevir, işlemi yap, sonra kelimeyle yaz.",
        dogruNeden: `${a} + ${b} = ${n} = ${kelime(n)}.`,
      });
    },
    Q("ennum.cardinal", "transfer", 2, "Read the sign at the bookshop.<br><i>The dictionary costs <b>three hundred and sixty</b> liras.</i><br>How much is the dictionary?", "360 liras",
      [["316 liras", "bilgi", "316 = three hundred and sixteen; “sixty” 60 demektir."], ["306 liras", "bilgi", "306 = three hundred and six."], ["3060 liras", "kavrama", "“three hundred” 300 demektir; sayılar yan yana yazılmaz, toplanır: 300 + 60."]],
      "sixteen (16) ile sixty (60) farkına dikkat!",
      C("Kelimeyle yazılmış fiyatı rakama çevireceğiz.", "-teen ile biten sayılar 13–19 (sixteen = 16), -ty ile bitenler onluk (sixty = 60).",
        "three hundred = 300.", "and sixty = 60 → 300 + 60 = 360.", "Cevap: 360 liras.", "Okurken -teen ve -ty sonlarına dikkat et; vurgu da farklıdır: sixTEEN, SIXty."),
      { kural: "-teen = 13–19; -ty = 20, 30, … 90.", dogruNeden: "three hundred (300) and sixty (60) = 360." }),
  );

  SORU_EKLE("ennum.ordinal",
    z => {
      const n = R(11, 50);
      const yakin = [n + 1, n - 1, n + 10 > 50 ? n - 10 : n + 10].filter(x => x >= 1 && x !== n);
      return S({
        kaz: "ennum.ordinal", duzey: "hatirlama", zorluk: 2,
        soru: `Which word is <b>${siraKisa(n)}</b>?`,
        dogru: siraKelime(n),
        yanlis: [[n < 20 || n % 10 === 0 ? yuzAlti(n) : yuzAlti(n - n % 10) + "-" + yuzAlti(n % 10), "kavrama", "Bu bir sayma sayısıdır (cardinal); sıra sayısı istiyoruz."], ...yakin.slice(0, 2).map(x => [siraKelime(x), "dikkat", `Bu ${siraKisa(x)} sıra sayısıdır.`])],
        ipucu: "Sıra sayısında son sayıyı first, second, third ya da -th biçiminde söyleriz.",
        cozum: C(`${siraKisa(n)} sıra sayısının yazılışını bulacağız.`, "1st first, 2nd second, 3rd third; diğerleri -th alır. Onlukta -y → -ieth (twenty → twentieth). Bileşik sayılarda yalnızca son kelime sıra sayısı olur: twenty-first.",
          `${n} = ${yuzAlti(n)}.`, `Sıra sayısı: ${siraKelime(n)}.`, `Cevap: ${siraKelime(n)}.`, `Kısaltmanın son iki harfine bak: ${siraKisa(n)} → “${ekSira(n)}”; kelimenin sonu da buna uymalı.`),
        kural: "21st twenty-first, 32nd thirty-second, 43rd forty-third, 50th fiftieth.",
        dogruNeden: `${siraKisa(n)} = ${siraKelime(n)}.`,
      });
    },
    Q("ennum.ordinal", "aciklama", 2, "Which one is <b>written correctly</b>?", "22nd",
      [["22th", "bilgi", "2 ile biten sayılar (12 hariç) -nd alır: 22nd."], ["12nd", "bilgi", "11, 12 ve 13 istisnadır; -th alır: 12th."], ["3th", "bilgi", "3 -rd alır: 3rd."]],
      "Son rakama bak: 1 → st, 2 → nd, 3 → rd; 11, 12, 13 → th.",
      C("Doğru yazılmış sıra sayısı kısaltmasını bulacağız.", "Son rakam 1 → st, 2 → nd, 3 → rd, diğerleri → th. İstisna: 11th, 12th, 13th.",
        "22 → son rakam 2 → 22nd. Doğru.", "12 istisnadır → 12th; 3 → 3rd; 22th yanlış.", "Cevap: 22nd.", "Kelimeyi söyle: twenty-secoND → nd; twelfTH → th."),
      { kural: "1st, 2nd, 3rd, 11th, 12th, 13th, 21st, 22nd, 23rd.", dogruNeden: "22 ikiyle bitiyor ve 12 değil; bu yüzden -nd alır." }),
    Q("ennum.ordinal", "transfer", 2, "Look at the race results. <b>Who is fourth?</b>", "Ozan",
      [["Defne", "dikkat", "Defne üçüncü (3rd)."], ["Yiğit", "dikkat", "Yiğit beşinci (5th)."], ["Pelin", "dikkat", "Pelin ikinci (2nd)."]],
      "fourth = 4th",
      C("Yarışta dördüncü olan kişiyi bulacağız.", "first 1st, second 2nd, third 3rd, fourth 4th, fifth 5th.",
        "fourth → 4th.", "Tabloda 4th satırında Ozan var.", "Cevap: Ozan.", "Kelimeyi rakama çevirip tabloda ara; four + th = fourth."),
      { gorsel: G.tablo(["Place", "Name"], [["1st", "Ebru"], ["2nd", "Pelin"], ["3rd", "Defne"], ["4th", "Ozan"], ["5th", "Yiğit"]]),
        kural: "fourth = 4th, fifth = 5th.", dogruNeden: "Tabloda 4th (fourth) sırasında Ozan yazıyor." }),
  );

  SORU_EKLE("ennum.use",
    z => {
      const kat = R(2, 12), oda = R(1, 9);
      const isim = sec(["Dr Yıldız", "the dentist", "my uncle", "the English teacher"]);
      return S({
        kaz: "ennum.use", duzey: "uygulama", zorluk: 2,
        soru: `Look at the board in the building. <b>Which floor is ${isim} on?</b>`,
        gorsel: G.tablo(["Name", "Floor"], karistir([[isim, siraKisa(kat)], ["Kids' Club", siraKisa(kat === 1 ? 2 : 1)], ["Café", "ground"]])),
        dogru: `on the ${siraKelime(kat)} floor`,
        yanlis: [[`on the ${yuzAlti(kat)} floor`, "bilgi", "Katlarda sıra sayısı kullanılır: the third floor (the three floor değil)."], [`on the ${siraKelime(kat + 1)} floor`, "dikkat", `Tabloda ${siraKisa(kat + 1)} değil ${siraKisa(kat)} yazıyor.`], [`on the ${siraKelime(kat + oda > 50 ? kat + 2 : kat + oda + 1)} floor`, "dikkat", "Tablodaki kat bilgisini dikkatle oku."]],
        ipucu: "Kat söylerken sıra sayısı kullanırız.",
        cozum: C(`${isim} kişisinin hangi katta olduğunu bulacağız.`, "Kat, sayfa değil sıra bildirir: the first floor, the second floor… Katlardan önce “the” ve “on” kullanılır.",
          `Tabloda ${isim}: ${siraKisa(kat)}.`, `${siraKisa(kat)} = ${siraKelime(kat)}.`, `Cevap: on the ${siraKelime(kat)} floor.`, "“the … floor” arasına her zaman sıra sayısı gelir."),
        kural: "on the + sıra sayısı + floor.",
        dogruNeden: `Tabloda ${siraKisa(kat)} yazıyor; bu “the ${siraKelime(kat)} floor” demektir.`,
      });
    },
    Q("ennum.use", "transfer", 2, "Complete the dialogue.<br>— When is your birthday?<br>— It's on ___ (23 April).", "the twenty-third of April",
      [["the twenty-three of April", "bilgi", "Tarihlerde sıra sayısı kullanılır: twenty-third."], ["the twentieth-third of April", "bilgi", "Bileşik sıra sayılarında yalnızca son kelime değişir: twenty-third."], ["the twenty-thirteen of April", "dikkat", "23 = twenty-three; thirteen 13 demektir."]],
      "Tarihlerde sıra sayısı kullanılır.",
      C("23 Nisan tarihini İngilizce söyleyeceğiz.", "İngiliz İngilizcesinde tarih: the + sıra sayısı + of + ay (the first of May).",
        "23 → twenty-three → sıra sayısı: twenty-third.", "Ay: April → the twenty-third of April.", "Cevap: the twenty-third of April.", "Yazarken 23rd April, söylerken “the twenty-third of April” deriz."),
      { kural: "Tarih: the 23rd of April = the twenty-third of April.", dogruNeden: "Tarihlerde gün sıra sayısıyla söylenir: 23 → twenty-third." }),
    Q("ennum.use", "uygulama", 2, "Read the message.<br><i>Open your books at page <b>two hundred and fourteen</b> and do Exercise 3.</i><br>Which page do the students open?", "214",
      [["240", "bilgi", "240 = two hundred and forty; “fourteen” 14 demektir."], ["204", "bilgi", "204 = two hundred and four."], ["2014", "kavrama", "two hundred = 200; 200 + 14 = 214. Sayılar yan yana yazılmaz."]],
      "fourteen ile forty farkını düşün.",
      C("Kelimeyle verilen sayfa numarasını rakama çevireceğiz.", "Sayfa numaraları sayma sayısıyla söylenir: page 214 = page two hundred and fourteen.",
        "two hundred = 200.", "fourteen = 14 → 200 + 14 = 214.", "Cevap: 214.", "Kontrol: 214'ü sesli oku: two hundred and fourteen. Aynı!"),
      { kural: "Sayfa → cardinal (page 214); kat/tarih/sıra → ordinal.", dogruNeden: "two hundred (200) and fourteen (14) = 214." }),
  );

  /* =========================================================================
   * THEME 3 — BODY PARTS, APPEARANCE AND CLOTHES
   * ========================================================================= */
  const VUCUT = [
    ["eyes", "We see with our", "gözlerimizle görürüz"], ["ears", "We hear with our", "kulaklarımızla duyarız"], ["nose", "We smell with our", "burnumuzla koklarız"],
    ["teeth", "We brush our ___ every morning and evening.", "dişlerimizi fırçalarız"], ["feet", "We wear shoes on our", "ayakkabıyı ayağımıza giyeriz"], ["hands", "We wear gloves on our", "eldiveni elimize takarız"],
  ];
  SORU_EKLE("enapp.body",
    z => {
      const v = sec(VUCUT), d = karistir(VUCUT.filter(x => x !== v)).slice(0, 3);
      const cumle = v[1].includes("___") ? v[1] : v[1] + " ___.";
      return S({
        kaz: "enapp.body", duzey: "hatirlama", zorluk: 1,
        soru: `Complete the sentence.<br>${cumle}`,
        dogru: v[0],
        yanlis: d.map(x => [x[0], "bilgi", `“${x[0]}” ile ilgili doğru cümle: ${x[2]}.`]),
        ipucu: "Cümledeki fiili (see, hear, smell, wear…) Türkçeye çevir.",
        cozum: C("Cümleye uygun vücut bölümünü bulacağız.", "eyes göz, ears kulak, nose burun, teeth dişler, feet ayaklar, hands eller.",
          `Cümlenin anlamını düşün: ${v[2]}.`, `Bu vücut bölümü İngilizcede: ${v[0]}.`, `Cevap: ${cumle.replace("___", v[0])}`, "Düzensiz çoğullara dikkat: tooth → teeth, foot → feet."),
        kural: "Düzensiz çoğullar: tooth → teeth, foot → feet.",
        dogruNeden: `${v[2]}; İngilizcesi “${v[0]}”.`,
      });
    },
    Q("enapp.body", "uygulama", 2, "Read the text.<br><i>My grandfather is tall and slim. He has got short white hair and a moustache. He wears glasses.</i><br>Which one is <b>true</b> about the grandfather?", "He has got a moustache.",
      [["He is short and fat.", "dikkat", "Metinde “tall and slim” (uzun ve zayıf) yazıyor."], ["He has got long black hair.", "dikkat", "Metinde saçının “short white” (kısa ve beyaz) olduğu söyleniyor."], ["He has got a beard.", "kavrama", "beard sakaldır; metinde moustache (bıyık) geçiyor."]],
      "moustache = bıyık, beard = sakal",
      C("Metne göre büyükbabayla ilgili doğru bilgiyi bulacağız.", "Görünüş sıfatları: tall/short (uzun/kısa boylu), slim/fat (zayıf/şişman). moustache bıyık, beard sakal, glasses gözlük.",
        "Metin: tall, slim, short white hair, a moustache, glasses.", "Seçeneklerden yalnızca “He has got a moustache.” metinle aynı.", "Cevap: He has got a moustache.", "Her seçeneği metindeki kelimelerle karşılaştır; zıt anlamlılara (tall/short) dikkat et."),
      { kural: "tall ↔ short, slim ↔ fat, long ↔ short hair.", dogruNeden: "Metinde “He has got … a moustache.” yazıyor." }),
    Q("enapp.body", "aciklama", 2, "Which word is the <b>odd one out</b>?", "curly",
      [["elbow", "kavrama", "elbow (dirsek) bir vücut bölümüdür; diğerleriyle aynı gruptadır."], ["knee", "kavrama", "knee (diz) bir vücut bölümüdür."], ["shoulder", "kavrama", "shoulder (omuz) bir vücut bölümüdür."]],
      "Üç kelime vücut bölümü; biri değil.",
      C("Grubun dışında kalan kelimeyi bulacağız.", "elbow dirsek, knee diz, shoulder omuz → vücut bölümleri. curly kıvırcık → saçı anlatan sıfat.",
        "Kelimeleri anlamlarına göre gruplayalım.", "Üçü vücut bölümü, “curly” bir sıfat.", "Cevap: curly.", "Odd one out sorularında kelimelerin türüne (isim/sıfat) ve konusuna bak."),
      { kural: "curly / straight / wavy hair → saç sıfatları.", dogruNeden: "curly bir sıfattır; diğerleri vücut bölümüdür." }),
  );

  const HAVE_K = [["My sister", "has got"], ["Tom", "has got"], ["The twins", "have got"], ["I", "have got"], ["Our cat", "has got"], ["You", "have got"]];
  SORU_EKLE("enapp.havegot",
    z => {
      const k = sec(HAVE_K), ozellik = k[0] === "Our cat" ? sec(["green eyes", "a long tail", "white fur"]) : sec(["brown eyes", "curly hair", "freckles", "a round face"]);
      const yanlisV = k[1] === "has got" ? "have got" : "has got";
      return S({
        kaz: "enapp.havegot", duzey: "uygulama", zorluk: 1,
        soru: `Choose the correct option.<br>${k[0]} ___ ${ozellik}.`,
        dogru: k[1],
        yanlis: [[yanlisV, "dikkat", k[1] === "has got" ? `“${k[0]}” üçüncü tekil kişidir (he / she / it); “has got” kullanılır.` : `“${k[0]}” ile “have got” kullanılır; “has got” yalnızca he / she / it içindir.`], [k[1] === "has got" ? "is got" : "are got", "bilgi", "Sahiplik bildirirken “be” değil “have / has got” kullanılır."], [k[1] === "has got" ? "haven't got" : "hasn't got", "dikkat", "Hem özneye uymuyor hem de cümle olumsuz oluyor."]],
        ipucu: "Özne he / she / it mi, yoksa I / you / we / they mi?",
        cozum: C("Dış görünüşü anlatan cümleye “have got” ya da “has got” seçeceğiz.", "I / you / we / they → have got; he / she / it → has got.",
          `Özne: ${k[0]}.`, `Bu özne ${k[1] === "has got" ? "he / she / it grubunda" : "I / you / we / they grubunda"} → ${k[1]}.`, `Cevap: ${k[0]} ${k[1]} ${ozellik}.`, "Özneyi bir zamirle değiştir (My sister → she, The twins → they); sonra kuralı uygula."),
        kural: "He / She / It has got; I / You / We / They have got.",
        dogruNeden: `“${k[0]}” ile “${k[1]}” kullanılır.`,
      });
    },
    Q("enapp.havegot", "transfer", 2, "Complete the dialogue.<br>— ___ your brother got blue eyes?<br>— No, he hasn't. He's got green eyes.", "Has",
      [["Have", "dikkat", "“your brother” = he; he ile “Has” kullanılır."], ["Is", "bilgi", "“got” ile soru “Have / Has” ile kurulur; “Is” kullanılmaz."], ["Does", "bilgi", "“have got” kalıbında soru “Has he got…?” biçiminde kurulur."]],
      "Cevaptaki kısa yanıt sana yardım ediyor: No, he hasn't.",
      C("“have got” ile soru cümlesi kuracağız.", "Soru: Have / Has + özne + got…? Kısa cevap: Yes, he has. / No, he hasn't.",
        "Özne: your brother → he.", "he → Has: Has your brother got blue eyes?", "Cevap: Has.", "Kısa cevaptaki “hasn't” sorunun “Has” ile başladığını doğrular."),
      { kural: "Has he / she got…? — Yes, he has. / No, she hasn't.", dogruNeden: "Özne “your brother” (he) olduğu için soru “Has” ile başlar." }),
    Q("enapp.havegot", "uygulama", 2, "Look at the table. <b>Which sentence is true?</b>", "Selim hasn't got glasses.",
      [["Selim has got long hair.", "dikkat", "Tabloda Selim'in saçı “short”."], ["Merve and Selim have got blue eyes.", "dikkat", "Merve'nin gözleri mavi ama Selim'inki kahverengi."], ["Merve hasn't got long hair.", "dikkat", "Tabloda Merve'nin saçı “long”."]],
      "Her cümleyi tablodaki satırla karşılaştır.",
      C("Tabloya göre doğru cümleyi bulacağız.", "has got = var, hasn't got = yok. Two people → have got.",
        "Selim: short hair, brown eyes, glasses: no.", "Merve: long hair, blue eyes, glasses: yes. → “Selim hasn't got glasses.” doğru.", "Cevap: Selim hasn't got glasses.", "Olumsuz cümlelerde “no” bilgisini ara."),
      { gorsel: G.tablo(["", "Hair", "Eyes", "Glasses"], [["Merve", "long", "blue", "yes"], ["Selim", "short", "brown", "no"]]),
        kural: "hasn't got = has not got (yok).", dogruNeden: "Tabloda Selim'in gözlüğü yok (no)." }),
  );

  const HAVA_GIY = [
    ["It's snowy and cold.", "a coat, a scarf and boots", "Karlı ve soğuk havada kalın giyiniriz."],
    ["It's hot and sunny.", "a T-shirt, shorts and a cap", "Sıcak ve güneşli havada ince giyiniriz."],
    ["It's rainy.", "a raincoat and wellies", "Yağmurlu havada yağmurluk ve lastik çizme giyeriz."],
  ];
  SORU_EKLE("enapp.clothes",
    z => {
      const h = sec(HAVA_GIY), d = HAVA_GIY.filter(x => x !== h);
      return S({
        kaz: "enapp.clothes", duzey: "uygulama", zorluk: 1,
        soru: `Look at the weather: <b>${h[0]}</b><br>What do you wear?`,
        dogru: `I wear ${h[1]}.`,
        yanlis: [...d.map(x => [`I wear ${x[1]}.`, "kavrama", `Bu kıyafetler “${x[0]}” havası için uygundur.`]), ["I wear a swimsuit and a scarf.", "kavrama", "Mayo ve atkı aynı havaya uygun değildir."]],
        ipucu: "Havayı Türkçeye çevir ve ona uygun kıyafetleri düşün.",
        cozum: C("Hava durumuna uygun kıyafetleri seçeceğiz.", "coat palto, scarf atkı, boots bot, T-shirt tişört, shorts şort, cap şapka, raincoat yağmurluk, wellies lastik çizme.",
          `Hava: ${h[0]}`, h[2], `Cevap: I wear ${h[1]}.`, "Kıyafetleri tek tek düşün: hepsi aynı havaya uygun olmalı."),
        kural: "cold → coat, scarf; hot → T-shirt, shorts; rainy → raincoat, umbrella.",
        dogruNeden: h[2],
      });
    },
    Q("enapp.clothes", "transfer", 2, "Read the message.<br><i>Hi Deniz! Tomorrow we are going to the mountains. It's very cold there. Don't forget your ___ and gloves!</i>", "woolly hat",
      [["sandals", "kavrama", "Sandalet sıcak havada giyilir; soğuk dağda uygun değildir."], ["shorts", "kavrama", "Şort yaz kıyafetidir."], ["sunglasses", "kavrama", "Güneş gözlüğü soğuktan korumaz; eldivenle birlikte sıcak tutan bir şey gerekiyor."]],
      "Soğuk hava ve eldiven (gloves) → başı ne korur?",
      C("Soğuk dağ havası için gereken kıyafeti bulacağız.", "Soğuk hava kıyafetleri: coat, scarf, gloves, woolly hat (yün bere), boots.",
        "Mesajda “very cold” ve “gloves” var.", "Eldivenle birlikte soğuktan koruyan kıyafet: woolly hat.", "Cevap: woolly hat.", "Seçenekleri “sıcak hava / soğuk hava” diye iki gruba ayır."),
      { kural: "woolly hat = yün bere; gloves = eldiven.", dogruNeden: "Soğuk havada başımızı yün bereyle (woolly hat) koruruz." }),
    Q("enapp.clothes", "aciklama", 2, "Which word does <b>NOT</b> belong to the group: <i>trainers, boots, slippers, jumper</i>?", "jumper",
      [["trainers", "kavrama", "trainers (spor ayakkabı) ayağa giyilir; gruptandır."], ["boots", "kavrama", "boots (bot) ayağa giyilir."], ["slippers", "kavrama", "slippers (terlik) ayağa giyilir."]],
      "Hangileri ayağa giyilir?",
      C("Gruba uymayan kıyafeti bulacağız.", "trainers spor ayakkabı, boots bot, slippers terlik, jumper kazak.",
        "İlk üçü ayağa giyilir.", "jumper üst bedene giyilir.", "Cevap: jumper.", "Kıyafetleri vücut bölümüne göre grupla: baş, üst beden, bacak, ayak."),
      { kural: "Ayak: trainers, boots, slippers, sandals. Üst beden: jumper, shirt, jacket.", dogruNeden: "jumper (kazak) ayağa değil üst bedene giyilir." }),
  );

  const SAHIP = [["my", "mine"], ["your", "yours"], ["his", "his"], ["her", "hers"], ["our", "ours"], ["their", "theirs"]];
  SORU_EKLE("enapp.whose",
    z => {
      const s = sec(SAHIP.filter(x => x[0] !== x[1])), esya = sec(["umbrella", "scarf", "jacket", "cap"]);
      const d = SAHIP.filter(x => x !== s && x[1] !== s[1]);
      return S({
        kaz: "enapp.whose", duzey: "uygulama", zorluk: 2,
        soru: `Complete the sentence.<br>This is ${s[0]} ${esya}. It's ___.`,
        dogru: s[1],
        yanlis: [[s[0], "kavrama", `“${s[0]}” bir isimden önce kullanılır; yalnız başına “${s[1]}” gelir.`], ...karistir(d).slice(0, 2).map(x => [x[1], "dikkat", `“${x[1]}” = ${x[0]} + isim; sahip değişmiş olur.`])],
        ipucu: "Cümlenin sonunda isim yok; iyelik zamiri gerekiyor.",
        cozum: C(`“${s[0]} ${esya}” ifadesini tek kelimeyle söyleyeceğiz.`, "İyelik zamirleri: mine, yours, his, hers, ours, theirs. Bunlardan sonra isim gelmez.",
          `${s[0]} ${esya} = “${s[0]}” + isim.`, `İsimsiz hâli: ${s[1]}.`, `Cevap: It's ${s[1]}.`, "Cümlenin sonunda isim yoksa iyelik zamiri (mine, yours…) kullan."),
        kural: "my book → mine; her bag → hers; their car → theirs.",
        dogruNeden: `${s[0]} ${esya} = ${s[1]}.`,
      });
    },
    Q("enapp.whose", "transfer", 2, "Complete the dialogue.<br>— ___ is this red bike?<br>— It's Emir's. He rides it to school.", "Whose",
      [["Who", "kavrama", "“Who” kişi sorar; “bu kimin?” sorusunda “Whose” kullanılır."], ["Where", "kavrama", "“Where” yer sorar; cevapta yer yok."], ["Which", "kavrama", "“Which” seçim sorar; cevap sahipliği bildiriyor."]],
      "Cevapta “Emir's” var: sahiplik.",
      C("Sahipliği soran soru kelimesini bulacağız.", "Whose…? = Kimin…? Cevap: It's Emir's / It's mine.",
        "Cevap “It's Emir's.” → sahibi söylüyor.", "Sahiplik “Whose” ile sorulur.", "Cevap: Whose.", "Who's (who is) ile Whose karıştırılmasın: Whose bike? = Kimin bisikleti?"),
      { kural: "Whose is this? — It's Ayşe's.", dogruNeden: "Cevap bisikletin sahibini söylediği için soru “Whose” ile başlar." }),
    Q("enapp.whose", "uygulama", 2, "Look at the picture labels. <b>Whose are the trainers?</b>", "They're Kerem's.",
      [["They're Nisa's.", "dikkat", "Nisa'nın eşyası şapka (cap)."], ["It's Kerem's.", "dikkat", "trainers çoğuldur; “They're” kullanılır."], ["They're Kerem.", "bilgi", "Sahipliği göstermek için isme 's eklenir: Kerem's."]],
      "trainers çoğul bir kelime; sahibi tabloda.",
      C("Spor ayakkabıların kime ait olduğunu bulacağız.", "Sahiplik: isim + 's (Kerem's). Çoğul eşyalar için “They're”, tekil için “It's”.",
        "Tabloda trainers → Kerem.", "trainers çoğul → They're Kerem's.", "Cevap: They're Kerem's.", "Üç şeye bak: doğru kişi, 's eki ve tekil/çoğul uyumu."),
      { gorsel: G.tablo(["Item", "Owner"], [["cap", "Nisa"], ["trainers", "Kerem"], ["scarf", "Ada"]]),
        kural: "Whose are…? — They're + isim's.", dogruNeden: "Tabloda trainers Kerem'in; çoğul olduğu için “They're Kerem's.”" }),
  );

  /* =========================================================================
   * THEME 3 — PERSONALITY AND CHARACTER
   * ========================================================================= */
  const KISILIK = [
    ["generous", "She always shares her lunch with her friends.", "cömert"], ["hard-working", "He studies for hours and never gives up.", "çalışkan"], ["honest", "She never tells lies.", "dürüst"],
    ["funny", "He tells jokes and makes us laugh.", "komik"], ["shy", "She doesn't talk much with new people.", "utangaç"], ["helpful", "He always helps his classmates.", "yardımsever"], ["lazy", "He sleeps all day and never does his homework.", "tembel"],
  ];
  SORU_EKLE("enper.adj",
    z => {
      const k = sec(KISILIK), d = karistir(KISILIK.filter(x => x !== k)).slice(0, 3);
      return S({
        kaz: "enper.adj", duzey: "aciklama", zorluk: 1,
        soru: `Read: <i>“${k[1]}”</i><br>What is this person like?`,
        dogru: k[0],
        yanlis: d.map(x => [x[0], "bilgi", `“${x[0]}” = ${x[2]}; cümle bunu anlatmıyor.`]),
        ipucu: "Cümlede kişinin ne yaptığını düşün; bu davranış hangi özelliği gösterir?",
        cozum: C("Davranışı anlatılan kişinin karakterini bulacağız.", "What is he / she like? = Nasıl biridir? (karakter sorar).",
          `Cümle: ${k[1]}`, `Bu davranış ${k[2]} birini anlatır.`, `Cevap: ${k[0]}.`, "Davranış ile sıfatı birbirine bağla: paylaşan → generous, yalan söylemeyen → honest."),
        kural: "What is she like? → She is kind / honest / funny.",
        dogruNeden: `Bu davranış ${k[2]} (${k[0]}) bir kişiyi anlatır.`,
      });
    },
    Q("enper.adj", "aciklama", 2, "Which word is the <b>opposite</b> of “hard-working”?", "lazy",
      [["clever", "kavrama", "clever (zeki) çalışkanın zıttı değildir."], ["generous", "bilgi", "generous (cömert) farklı bir özelliktir."], ["friendly", "bilgi", "friendly (arkadaş canlısı) çalışkanlıkla ilgili değildir."]],
      "Çalışkanın zıttı nedir?",
      C("“hard-working” kelimesinin zıt anlamlısını bulacağız.", "hard-working = çalışkan. Zıttı: lazy = tembel.",
        "Seçenekleri çevirelim: clever zeki, generous cömert, friendly arkadaş canlısı, lazy tembel.", "Çalışkanın zıttı tembeldir.", "Cevap: lazy.", "Zıt anlam çiftleri: honest ↔ dishonest, shy ↔ outgoing, generous ↔ mean."),
      { kural: "hard-working ↔ lazy.", dogruNeden: "lazy (tembel), hard-working (çalışkan) kelimesinin zıttıdır." }),
    Q("enper.adj", "transfer", 2, "Read the text.<br><i>My best friend is Duru. She is very kind. She always smiles and says hello to everyone. She has got a lot of friends because she loves meeting new people.</i><br>Which word describes Duru <b>best</b>?", "friendly",
      [["shy", "kavrama", "Utangaç biri yeni insanlarla tanışmaktan çekinir; Duru bunu seviyor."], ["rude", "kavrama", "rude (kaba) biri herkese selam vermez; Duru çok nazik."], ["lazy", "bilgi", "Metinde tembellikle ilgili bir bilgi yok."]],
      "Herkese selam veren ve yeni insanlarla tanışmayı seven biri nasıldır?",
      C("Metne göre Duru'yu en iyi anlatan sıfatı seçeceğiz.", "friendly = arkadaş canlısı, shy = utangaç, rude = kaba, lazy = tembel.",
        "Metinde: smiles, says hello to everyone, a lot of friends, loves meeting new people.", "Bunların hepsi arkadaş canlısı birini anlatır.", "Cevap: friendly.", "Metindeki ipuçlarını topla ve hepsine uyan sıfatı seç."),
      { kural: "friendly ↔ unfriendly; shy ↔ outgoing.", dogruNeden: "Herkese selam verip yeni insanlarla tanışmayı seven Duru arkadaş canlısıdır." }),
  );

  SORU_EKLE("enper.compare",
    z => {
      const a = sec(["Kemal", "Asya", "Yusuf"]), b = sec(["Leyla", "Okan", "Gizem"]);
      const ha = R(130, 160), hb = ha - R(3, 15);
      return S({
        kaz: "enper.compare", duzey: "uygulama", zorluk: 2,
        soru: `Look at the table. Choose the correct sentence.`,
        gorsel: G.tablo(["Name", "Height"], [[a, ha + " cm"], [b, hb + " cm"]]),
        dogru: `${a} is taller than ${b}.`,
        yanlis: [[`${b} is taller than ${a}.`, "dikkat", `${b} ${hb} cm, ${a} ${ha} cm; ${b} daha kısadır.`], [`${a} is more tall than ${b}.`, "bilgi", "Tek heceli sıfatlar -er alır: taller (more tall değil)."], [`${a} is shorter than ${b}.`, "dikkat", `${a} daha uzundur; “shorter” yanlış.`]],
        ipucu: "Boyları karşılaştır: hangisi daha büyük?",
        cozum: C("Tablodaki boylara göre doğru karşılaştırma cümlesini seçeceğiz.", "Tek heceli sıfat + er + than: tall → taller than.",
          `${a}: ${ha} cm, ${b}: ${hb} cm.`, `${ha} > ${hb} → ${a} daha uzun (fark ${ha - hb} cm).`, `Cevap: ${a} is taller than ${b}.`, `Ters yönden de söyleyebiliriz: ${b} is shorter than ${a}.`),
        kural: "tall → taller than; more yalnızca uzun sıfatlarla: more generous.",
        dogruNeden: `${ha} cm > ${hb} cm, yani ${a} ${b}'den daha uzun.`,
      });
    },
    Q("enper.compare", "uygulama", 2, "Choose the correct option.<br>My mother is ___ than my father. She always helps people in need.", "more generous",
      [["generouser", "bilgi", "Uzun (üç heceli) sıfatlar -er almaz; “more” ile karşılaştırılır."], ["more generouser", "bilgi", "“more” ile “-er” birlikte kullanılmaz."], ["the most generous", "kavrama", "Cümlede “than” var; iki kişi karşılaştırılıyor, en üstünlük değil."]],
      "generous kaç heceli? Cümlede “than” var.",
      C("generous sıfatının karşılaştırma hâlini seçeceğiz.", "Kısa sıfat + er (kind → kinder); uzun sıfat → more + sıfat (generous → more generous).",
        "generous = gen-er-ous, üç hece → uzun sıfat.", "“than” var → more generous than.", "Cevap: more generous.", "-er ve “more” aynı anda kullanılmaz; birini seç."),
      { kural: "Uzun sıfat: more + sıfat + than.", dogruNeden: "generous uzun bir sıfattır; karşılaştırması “more generous” olur." }),
    Q("enper.compare", "aciklama", 3, "Which sentence is <b>correct</b>?", "Ahmet is better at football than his brother.",
      [["Ahmet is gooder at football than his brother.", "bilgi", "good düzensizdir: good → better."], ["Ahmet is more good at football than his brother.", "bilgi", "good düzensiz bir sıfattır; “more good” denmez."], ["Ahmet is better at football that his brother.", "dikkat", "Karşılaştırmada “that” değil “than” kullanılır."]],
      "good düzensiz bir sıfattır.",
      C("Doğru karşılaştırma cümlesini bulacağız.", "Düzensiz sıfatlar: good → better, bad → worse. Karşılaştırmada “than” kullanılır.",
        "gooder ve more good yanlış; doğrusu better.", "“that” değil “than” olmalı.", "Cevap: Ahmet is better at football than his brother.", "Düzensiz sıfatları ezberle: good–better–the best, bad–worse–the worst."),
      { kural: "good → better → the best; bad → worse → the worst.", dogruNeden: "good'un karşılaştırma hâli “better”dır ve “than” ile kullanılır." }),
  );

  SORU_EKLE("enper.super",
    z => {
      const adlar = karistir(["Efe", "Mina", "Taylan", "Sude"]).slice(0, 3);
      const yas = karistir([10, 11, 12]);
      const en = adlar[yas.indexOf(12)], kucuk = adlar[yas.indexOf(10)];
      return S({
        kaz: "enper.super", duzey: "uygulama", zorluk: 2,
        soru: "Look at the table. Choose the correct sentence.",
        gorsel: G.tablo(["Name", "Age"], adlar.map((a, i) => [a, String(yas[i])])),
        dogru: `${en} is the oldest.`,
        yanlis: [[`${kucuk} is the oldest.`, "dikkat", `${kucuk} 10 yaşında; en küçük odur.`], [`${en} is the most old.`, "bilgi", "Tek heceli sıfatlar -est alır: the oldest."], [`${en} is the youngest.`, "dikkat", `${en} 12 yaşında; en küçük değil en büyüktür.`]],
        ipucu: "En büyük yaşı bul.",
        cozum: C("Tabloya göre en üstünlük cümlesini seçeceğiz.", "Tek heceli sıfat: the + sıfat + est (old → the oldest, young → the youngest).",
          `Yaşlar: ${adlar.map((a, i) => a + " " + yas[i]).join(", ")}.`, `En büyük yaş 12 → ${en}.`, `Cevap: ${en} is the oldest.`, `Ters yönden: ${kucuk} is the youngest. Bu da tabloya uyuyor.`),
        kural: "the + sıfat + est: the oldest, the tallest.",
        dogruNeden: `${en} 12 yaşında; grubun en büyüğü.`,
      });
    },
    Q("enper.super", "uygulama", 2, "Choose the correct option.<br>Mrs Demir is ___ teacher in our school. Everybody loves her.", "the most patient",
      [["the patientest", "bilgi", "patient iki heceli ve -ent ile bitiyor; “the most patient” denir."], ["more patient", "kavrama", "Bu karşılaştırmadır; okuldaki tüm öğretmenler içinde “en” diyoruz."], ["most patient", "dikkat", "En üstünlükte “the” unutulmamalı: the most patient."]],
      "Okuldaki bütün öğretmenler içinde “en” sabırlı olanı anlatıyoruz.",
      C("patient sıfatının en üstünlük hâlini seçeceğiz.", "Uzun sıfat: the most + sıfat (the most patient). Kısa sıfat: the + sıfat + est.",
        "Cümlede “in our school” var → bir grup içinde en.", "patient uzun sıfat → the most patient.", "Cevap: the most patient.", "En üstünlükte “the” her zaman başta olur."),
      { kural: "the most + uzun sıfat: the most honest, the most generous.", dogruNeden: "Okuldaki tüm öğretmenler içinde “en” sabırlıyı anlatmak için “the most patient” kullanılır." }),
    Q("enper.super", "transfer", 3, "Read the text.<br><i>In my family, my grandma is the oldest person. My uncle Ali is the funniest. He always tells jokes. My cousin Ece is the youngest. She is only two.</i><br>Which one is <b>true</b>?", "Uncle Ali makes everybody laugh.",
      [["Ece is older than grandma.", "dikkat", "Ece ailenin en küçüğü (the youngest), büyükanne ise en büyüğü."], ["Grandma is the funniest person.", "dikkat", "En komik kişi Ali amca."], ["Ece is the oldest in the family.", "dikkat", "Ece sadece iki yaşında; en küçük odur."]],
      "the funniest = en komik. En komik kişi ne yapar?",
      C("Metne göre doğru bilgiyi bulacağız.", "the oldest en yaşlı, the funniest en komik, the youngest en genç.",
        "Metin: grandma → the oldest, Ali → the funniest, Ece → the youngest.", "En komik olan Ali amca herkesi güldürür (makes everybody laugh).", "Cevap: Uncle Ali makes everybody laugh.", "funny → funnier → the funniest: -y ile biten sıfatlarda y → i olur."),
      { kural: "funny → the funniest (y → i + est).", dogruNeden: "Ali amca ailenin en komik kişisi ve hep fıkra anlatıyor." }),
  );

  SORU_EKLE("enper.tag",
    Q("enper.tag", "uygulama", 2, "Choose the correct question tag.<br>Your teacher is very kind, ___", "isn't she?",
      [["is she?", "dikkat", "Olumlu cümleye olumsuz tag gelir."], ["doesn't she?", "kavrama", "Cümlede “is” var; tag'de de “is” kullanılır."], ["aren't you?", "dikkat", "Özne “your teacher”; tag'de “you” değil “she / he” olur."]],
      "Cümledeki fiil “is”; cümle olumlu.",
      C("Karakter anlatan cümleye soru eki ekleyeceğiz.", "be fiilli olumlu cümle → isn't / aren't + zamir. Olumsuz cümle → is / are + zamir.",
        "Fiil: is (olumlu) → isn't.", "Özne: your teacher → she (ya da he).", "Cevap: isn't she?", "Seçeneklerde yalnızca “isn't she?” hem olumsuz hem de özneye uygun."),
      { kural: "She is kind, isn't she?", dogruNeden: "Cümle olumlu ve fiil “is”; tag “isn't she?” olur." }),
    Q("enper.tag", "transfer", 2, "Complete the dialogue.<br>— Mert isn't lazy, ___<br>— No, he isn't. He's very hard-working.", "is he?",
      [["isn't he?", "dikkat", "Cümle olumsuz (isn't); tag olumlu olmalı."], ["does he?", "kavrama", "Cümlede “is” var; tag'de “does” kullanılmaz."], ["is she?", "dikkat", "Mert bir erkek adı; zamir “he” olmalı."]],
      "Olumsuz cümle → olumlu tag.",
      C("Olumsuz cümleye soru eki ekleyeceğiz.", "Olumsuz cümle + olumlu tag: He isn't…, is he?",
        "Fiil: isn't (olumsuz) → tag: is.", "Özne: Mert → he.", "Cevap: is he?", "Cevaptaki “No, he isn't.” de “is he?” sorusuna uyar."),
      { kural: "He isn't lazy, is he?", dogruNeden: "Cümle olumsuz olduğu için tag olumlu: is he?" }),
    Q("enper.tag", "aciklama", 3, "Which sentence has the <b>wrong</b> question tag?", "Your friends are honest, isn't they?",
      [["Selin is very shy, isn't she?", "dikkat", "Bu tag doğru: olumlu is → isn't she?"], ["You aren't rude, are you?", "dikkat", "Bu tag doğru: olumsuz → olumlu are you?"], ["Kaan works hard, doesn't he?", "dikkat", "Bu tag doğru: geniş zaman, he → doesn't he?"]],
      "Öznesi çoğul olan cümleye bak.",
      C("Soru eki yanlış olan cümleyi bulacağız.", "is ↔ isn't (he / she / it), are ↔ aren't (you / we / they), works → doesn't he?",
        "“Your friends” çoğul → they → tag “aren't they?” olmalı.", "Diğer üç cümlenin tag'leri kurala uygun.", "Cevap: Your friends are honest, isn't they?", "“WRONG” soran sorularda her seçeneği doğrula; kurala uymayanı seç."),
      { kural: "They are…, aren't they?", dogruNeden: "Özne çoğul (they) ve fiil “are”; doğru tag “aren't they?” olmalıydı." }),
  );

  /* =========================================================================
   * THEME 4 — FAMILY MEMBERS' JOBS AND WORKPLACES
   * ========================================================================= */
  const MESLEK = [
    ["a vet", "an animal clinic", "looks after sick animals", "veteriner hasta hayvanlara bakar"],
    ["a pilot", "a plane", "flies planes", "pilot uçak uçurur"],
    ["a chef", "a restaurant", "cooks delicious meals", "şef lokantada yemek pişirir"],
    ["a farmer", "a farm", "grows vegetables and feeds animals", "çiftçi sebze yetiştirir, hayvanları besler"],
    ["a mechanic", "a garage", "repairs cars", "tamirci garajda araba onarır"],
    ["a dentist", "a dental clinic", "checks people's teeth", "diş hekimi dişleri kontrol eder"],
    ["a firefighter", "a fire station", "puts out fires", "itfaiyeci yangın söndürür"],
  ];
  SORU_EKLE("enjob.jobs",
    z => {
      const m = sec(MESLEK), d = karistir(MESLEK.filter(x => x !== m)).slice(0, 3), kisi = sec([["My aunt", "She"], ["My father", "He"], ["My cousin", "She"], ["My uncle", "He"]]);
      return S({
        kaz: "enjob.jobs", duzey: "aciklama", zorluk: 1,
        soru: `Read: <i>${kisi[0]} works at ${m[1]}. ${kisi[1]} ${m[2]}.</i><br>What is ${kisi[0].toLowerCase()}'s job?`,
        dogru: `${kisi[1]} is ${m[0]}.`,
        yanlis: d.map(x => [`${kisi[1]} is ${x[0]}.`, "bilgi", `${x[3]}; iş yeri: ${x[1]}.`]),
        ipucu: "İş yerini ve yaptığı işi birlikte düşün.",
        cozum: C("İş yeri ve iş tanımından mesleği bulacağız.", "Meslek + iş yeri: vet → animal clinic, pilot → plane, chef → restaurant, farmer → farm, mechanic → garage, dentist → dental clinic, firefighter → fire station.",
          `İş yeri: ${m[1]}; yaptığı iş: ${m[2]}.`, `Bu tanım: ${m[3]}.`, `Cevap: ${kisi[1]} is ${m[0]}.`, "Mesleklerden önce “a / an” kullanmayı unutma: She is a vet. He is an engineer."),
        kural: "What does he / she do? — He / She is a + meslek.",
        dogruNeden: `${m[3]}.`,
      });
    },
    Q("enjob.jobs", "transfer", 2, "Read the text.<br><i>My mother is a nurse. She works at a hospital. She works at night, so she sleeps in the morning. She loves her job because she helps people.</i><br>Which one is <b>NOT</b> true?", "She works at a school.",
      [["She is a nurse.", "dikkat", "Metinde “My mother is a nurse.” yazıyor; bu doğru."], ["She sleeps in the morning.", "dikkat", "Gece çalıştığı için sabah uyuyor; bu doğru."], ["She helps people.", "dikkat", "Metinde insanlara yardım ettiği yazıyor."]],
      "NOT: metinde olmayanı bul.",
      C("Metne göre yanlış olan bilgiyi bulacağız.", "NOT soruları: metinde yazanları ele, kalanı seç.",
        "Metinde: nurse, hospital, works at night, sleeps in the morning, helps people.", "İş yeri “a hospital”; okul (school) değil.", "Cevap: She works at a school.", "Seçenekleri metinde tek tek işaretle; işaretleyemediğin cevaptır."),
      { kural: "nurse → hospital; teacher → school.", dogruNeden: "Metne göre anne hastanede çalışıyor; okulda değil." }),
    Q("enjob.jobs", "uygulama", 2, "Choose the correct option.<br>My brother is ___ engineer. He designs bridges.", "an",
      [["a", "bilgi", "engineer sesli harfle (e) başlıyor; “an” kullanılır."], ["the", "kavrama", "Mesleği ilk kez söylerken belirsiz tanımlık (a / an) kullanırız."], ["—", "bilgi", "İngilizcede meslekten önce “a / an” gerekir: He is an engineer."]],
      "engineer hangi sesle başlıyor?",
      C("Meslekten önce gelen tanımlığı seçeceğiz.", "Ünsüz sesten önce a (a doctor), ünlü sesten önce an (an engineer, an architect).",
        "engineer → “e” ünlü sesiyle başlıyor.", "Ünlü sesten önce → an.", "Cevap: an.", "Kelimeyi sesli söyle; ilk ses a, e, i, o, u sesi ise “an” kullan."),
      { kural: "a doctor, an engineer, an architect, a pilot.", dogruNeden: "engineer ünlü sesle başladığı için “an engineer” denir." }),
  );

  SORU_EKLE("enjob.future",
    z => {
      const plan = sec([["visit my grandparents", "visiting my grandparents"], ["play tennis", "playing tennis"], ["have a picnic", "having a picnic"], ["meet my friends", "meeting my friends"]]);
      const gun = sec(["tomorrow", "next Saturday", "this evening", "on Sunday"]);
      return S({
        kaz: "enjob.future", duzey: "uygulama", zorluk: 2,
        soru: `Look at my diary: <b>${gun} – ${plan[0]}</b><br>Choose the correct sentence about my plan.`,
        dogru: `I am ${plan[1]} ${gun}.`,
        yanlis: [[`I ${plan[1]} ${gun}.`, "bilgi", "“am” yardımcı fiili unutulmuş: I am + fiil-ing."], [`I am ${plan[0]} ${gun}.`, "bilgi", "am / is / are'den sonra fiil -ing almalı."], [`I is ${plan[1]} ${gun}.`, "dikkat", "“I” ile “is” değil “am” kullanılır."]],
        ipucu: "Kesin gelecek planlarını şimdiki zamanla anlatırız.",
        cozum: C(`Ajandadaki “${plan[0]}” planını anlatan doğru cümleyi seçeceğiz.`, "Kesinleşmiş gelecek planları present continuous ile anlatılır: I am meeting Ali tomorrow.",
          "Özne: I → am.", `Fiil: ${plan[0]} → ${plan[1]}.`, `Cevap: I am ${plan[1]} ${gun}.`, `Zaman ifadesi (${gun}) cümlenin gelecekle ilgili olduğunu gösterir.`),
        kural: "Plan: am / is / are + fiil-ing + gelecek zaman ifadesi.",
        dogruNeden: `Kesin bir plan olduğu için “I am ${plan[1]} ${gun}.” doğrudur.`,
      });
    },
    Q("enjob.future", "transfer", 3, "Read the timetable.<br><i>Train to Ankara — leaves at 9.15, arrives at 13.40</i><br>Choose the correct sentence.", "The train leaves at quarter past nine.",
      [["The train is leaving at quarter to nine.", "dikkat", "Tarifede 9.15 yazıyor; quarter to nine 8.45 demektir."], ["The train leave at quarter past nine.", "dikkat", "Özne “the train” (it) olduğu için fiil -s alır: leaves."], ["The train arrives at quarter past nine.", "dikkat", "9.15 kalkış (leaves) saatidir; varış 13.40."]],
      "Tarifeli olaylar geniş zamanla anlatılır. 9.15 = quarter past nine.",
      C("Tren tarifesine göre doğru cümleyi seçeceğiz.", "Tarife ve programlar (train, film, lesson) simple present ile anlatılır: The bus leaves at 8. quarter past = çeyrek geçe, quarter to = çeyrek kala.",
        "Kalkış: 9.15 → quarter past nine.", "Özne the train → leaves.", "Cevap: The train leaves at quarter past nine.", "Saati, fiili (leaves / arrives) ve -s ekini ayrı ayrı kontrol et."),
      { kural: "Tarife: The film starts at 7. / The train leaves at 9.15.", dogruNeden: "Tarifeli olaylar geniş zamanla anlatılır ve kalkış saati 9.15'tir." }),
    Q("enjob.future", "aciklama", 2, "Complete the dialogue.<br>— What are you doing this weekend?<br>— ___", "I'm helping my dad at his shop.",
      [["I help my dad at his shop every day.", "kavrama", "Bu bir alışkanlıktır; soru bu haftasonunun planını soruyor."], ["Yes, I am.", "kavrama", "“What” sorusu evet/hayır ile cevaplanmaz."], ["I'm helped my dad at his shop.", "bilgi", "Şimdiki zamanda fiil -ing alır: I'm helping."]],
      "Soru “What are you doing…?” ile soruluyor; cevap da aynı zamanla verilir.",
      C("Hafta sonu planını soran soruya cevap seçeceğiz.", "Gelecek plan sorusu: What are you doing this weekend? Cevap: I'm + fiil-ing.",
        "Soru present continuous ile plan soruyor.", "Uygun cevap: I'm helping my dad at his shop.", "Cevap: I'm helping my dad at his shop.", "Soru hangi zamandaysa cevabı da genellikle aynı zamanda ver."),
      { kural: "What are you doing tomorrow? — I'm visiting my aunt.", dogruNeden: "Cevap, sorudaki gibi present continuous ile bir plan anlatıyor." }),
  );

  SORU_EKLE("enjob.when",
    Q("enjob.when", "uygulama", 2, "Choose the correct option.<br>___ my mother is cooking dinner, my father is setting the table.", "While",
      [["When", "kavrama", "İki uzun eylem aynı anda sürüyorsa (is cooking, is setting) “while” daha uygundur."], ["Because", "kavrama", "because neden bildirir; cümlede neden-sonuç yok."], ["But", "bilgi", "but zıtlık bildirir ve cümle başında böyle kullanılmaz."]],
      "İki eylem aynı anda mı oluyor?",
      C("Aynı anda olan iki eylemi bağlayan kelimeyi seçeceğiz.", "while = -iken (aynı anda süren iki eylem), when = -dığında (bir eylem olunca diğeri).",
        "Anne yemek pişiriyor (is cooking), baba sofrayı kuruyor (is setting).", "İki eylem aynı anda sürüyor → while.", "Cevap: While.", "Cümlede iki tane “-ing” eylem varsa “while” ile bağlamayı düşün."),
      { kural: "While + süren eylem: While I am studying, my sister is reading.", dogruNeden: "İki eylem aynı anda sürüyor; bunu “while” bağlar." }),
    Q("enjob.when", "transfer", 2, "Read the text.<br><i>My uncle is a postman. When he arrives at work, he puts the letters in his bag. When the bag is ready, he rides his bike to the village.</i><br>What does he do <b>after</b> his bag is ready?", "He rides his bike to the village.",
      [["He arrives at work.", "dikkat", "İşe varmak ilk eylemdir; çanta hazır olmadan önce olur."], ["He puts the letters in his bag.", "dikkat", "Mektupları çantaya koyması çanta hazır olmadan önceki adımdır."], ["He reads the letters.", "bilgi", "Metinde mektupları okuduğu yazmıyor."]],
      "“When the bag is ready, …” cümlesine bak.",
      C("Çanta hazır olduktan sonra postacının ne yaptığını bulacağız.", "When + eylem 1, eylem 2 → eylem 1 olunca eylem 2 olur.",
        "Metinde: When the bag is ready, he rides his bike to the village.", "Yani çanta hazır olunca bisikletiyle köye gider.", "Cevap: He rides his bike to the village.", "Rutin anlatan metinlerde olayları sıraya diz: varış → mektupları koyma → köye gitme."),
      { kural: "When + eylem 1, eylem 2 (biri olunca diğeri).", dogruNeden: "Metinde “When the bag is ready, he rides his bike to the village.” yazıyor." }),
    Q("enjob.when", "aciklama", 2, "Match the parts.<br><i>When my sister gets home from work, …</i>", "she takes off her shoes and has a rest.",
      [["she is going to work in the morning.", "kavrama", "Eve geldiğinde işe gitmez; cümle anlamca uyumsuz."], ["she took off her shoes.", "bilgi", "Rutin geniş zamanla anlatılır; “took” geçmiş zamandır."], ["while she takes off her shoes.", "bilgi", "Cümle zaten “When” ile başlıyor; ikinci kısma “while” eklenmez."]],
      "Eve gelince ne yapılır? Zaman da geniş zaman olmalı.",
      C("When ile başlayan rutin cümlesini tamamlayacağız.", "When ile kurulan rutin cümlelerinde iki kısım da geniş zamandadır.",
        "Birinci kısım: gets home from work (geniş zaman).", "Eve gelince yapılan mantıklı iş: ayakkabıları çıkarıp dinlenmek → takes off her shoes and has a rest.", "Cevap: she takes off her shoes and has a rest.", "Anlam ve zaman uyumunu birlikte kontrol et."),
      { kural: "When she gets home, she has a rest. (iki kısım da geniş zaman)", dogruNeden: "Anlamca uygun ve iki kısım da geniş zamanda." }),
  );

  /* =========================================================================
   * THEME 4 — FAMILY HOMES AND HOUSES
   * ========================================================================= */
  const ODA = [
    ["kitchen", "We cook meals in the", "mutfakta yemek pişiririz"], ["bathroom", "We have a shower in the", "banyoda duş alırız"], ["bedroom", "We sleep in the", "yatak odasında uyuruz"],
    ["living room", "We watch TV with our family in the", "oturma odasında ailemizle televizyon izleriz"], ["garage", "We park the car in the", "arabayı garaja park ederiz"], ["garden", "We grow flowers in the", "bahçede çiçek yetiştiririz"],
  ];
  SORU_EKLE("enhom.types",
    z => {
      const o = sec(ODA), d = karistir(ODA.filter(x => x !== o)).slice(0, 3);
      return S({
        kaz: "enhom.types", duzey: "hatirlama", zorluk: 1,
        soru: `Complete the sentence.<br>${o[1]} ___.`,
        dogru: o[0],
        yanlis: d.map(x => [x[0], "bilgi", `${x[2]}; bu cümleye uymuyor.`]),
        ipucu: "Cümledeki eylemin evin hangi bölümünde yapıldığını düşün.",
        cozum: C("Eylemin yapıldığı evin bölümünü bulacağız.", "kitchen mutfak, bathroom banyo, bedroom yatak odası, living room oturma odası, garage garaj, garden bahçe.",
          `Cümlenin anlamı: ${o[2]}.`, `Bu bölüm İngilizcede: ${o[0]}.`, `Cevap: ${o[1]} ${o[0]}.`, "Eylem + yer eşleştir: cook → kitchen, sleep → bedroom, shower → bathroom."),
        kural: "Evin bölümleri: kitchen, bathroom, bedroom, living room, garage, garden.",
        dogruNeden: `${o[2]}.`,
      });
    },
    Q("enhom.types", "transfer", 2, "Read the advert.<br><i>FOR SALE: A flat on the fifth floor. It has got two bedrooms, a big balcony and a lift. Address: 25 Lale Street, Izmir.</i><br>Which one is <b>true</b>?", "There is a lift in the building.",
      [["It is a cottage with a garden.", "kavrama", "İlanda “flat” (apartman dairesi) yazıyor; bahçeli kır evi değil."], ["It has got three bedrooms.", "dikkat", "İlanda iki yatak odası (two bedrooms) yazıyor."], ["It is on the fourth floor.", "dikkat", "Daire beşinci katta (fifth floor)."]],
      "İlandaki her bilgiyi seçeneklerle karşılaştır.",
      C("Ev ilanına göre doğru bilgiyi bulacağız.", "flat apartman dairesi, cottage kır evi, lift asansör, balcony balkon.",
        "İlan: flat, fifth floor, two bedrooms, big balcony, lift.", "Seçeneklerden yalnızca asansör bilgisi ilanla aynı.", "Cevap: There is a lift in the building.", "Sayılara (two, fifth) ve konut türüne (flat, cottage) dikkat et."),
      { kural: "Konut türleri: flat, detached house, cottage, villa, terraced house.", dogruNeden: "İlanda dairenin bulunduğu binada asansör (a lift) olduğu yazıyor." }),
    Q("enhom.types", "aciklama", 2, "What is the correct order for an address in English?", "25 Lale Street, Izmir",
      [["Izmir, Lale Street 25", "bilgi", "İngilizce adreste önce numara, sonra sokak, en son şehir yazılır."], ["Lale Street Izmir 25", "bilgi", "Numara sokak adından önce gelir."], ["Street Lale 25, Izmir", "dikkat", "Sokak adı önce, “Street” kelimesi sonra gelir: Lale Street."]],
      "Küçükten büyüğe: numara → sokak → şehir.",
      C("İngilizce adres yazım sırasını bulacağız.", "İngilizce adres: numara + sokak adı + Street/Road, şehir.",
        "Numara: 25 → başa.", "Sokak: Lale Street → ortaya; şehir: Izmir → sona.", "Cevap: 25 Lale Street, Izmir.", "Adresleri küçükten büyüğe yaz: ev numarası, sokak, şehir, ülke."),
      { kural: "Adres: 10 Park Road, London.", dogruNeden: "İngilizce adreste sıra numara, sokak, şehir şeklindedir." }),
  );

  SORU_EKLE("enhom.which",
    z => {
      const ev = karistir([["A", 2, "a garden"], ["B", 3, "a balcony"], ["C", 4, "a garage"]]);
      const hedef = sec(ev);
      return S({
        kaz: "enhom.which", duzey: "uygulama", zorluk: 2,
        soru: `Look at the table. — <b>Which house has got ${hedef[1]} bedrooms and ${hedef[2]}?</b>`,
        gorsel: G.tablo(["House", "Bedrooms", "Extra"], ev.map(e => ["House " + e[0], String(e[1]), e[2]])),
        dogru: `House ${hedef[0]}`,
        yanlis: ev.filter(e => e !== hedef).map(e => [`House ${e[0]}`, "dikkat", `House ${e[0]}: ${e[1]} bedrooms, ${e[2]}.`]).concat([["All of them", "kavrama", "Which sorusu seçenekler arasından birini sorar; tabloda yalnızca bir ev uyuyor."]]),
        ipucu: "Tabloda iki bilgiyi birlikte ara: yatak odası sayısı ve ekstra.",
        cozum: C("İki özelliği birlikte taşıyan evi bulacağız.", "Which…? = Hangisi…? (sınırlı seçenekler arasından seçim sorar).",
          `Aranan: ${hedef[1]} bedrooms ve ${hedef[2]}.`, `Tabloda bu bilgiler House ${hedef[0]} satırında.`, `Cevap: House ${hedef[0]}.`, "İki koşullu sorularda her iki koşulu da aynı satırda kontrol et."),
        kural: "Which house…? — House A / The one with a garden.",
        dogruNeden: `House ${hedef[0]} ${hedef[1]} yatak odalı ve ${hedef[2]} sahibi.`,
      });
    },
    Q("enhom.which", "aciklama", 2, "Choose the correct question.<br>— ___<br>— The blue one. It's next to the park.", "Which house is yours?",
      [["Who is your house?", "bilgi", "“Who” kişi sorar; ev bir kişi değildir."], ["Whose house is blue?", "kavrama", "Bu soru evin sahibini sorar; cevap “The blue one” değil, “It's Ali's” gibi olurdu."], ["How many houses are there?", "kavrama", "Bu soru sayı sorar; cevapta sayı yok."]],
      "“The blue one.” bir seçimdir.",
      C("Cevabı “The blue one.” olan soruyu bulacağız.", "Which…? seçenekler arasından seçim sorar; cevap genellikle “the … one” olur.",
        "Cevap: The blue one (mavi olan) → seçim.", "Seçim soran soru: Which house is yours?", "Cevap: Which house is yours?", "the … one cevabı gördüğünde “Which” düşün."),
      { kural: "Which one? — The big one / The red one.", dogruNeden: "Cevap evlerden birini seçiyor; seçim “Which” ile sorulur." }),
    Q("enhom.which", "transfer", 3, "Read the text.<br><i>There are two houses on my street. The yellow house is big and it has got a swimming pool. The white house is small but it has got a lovely garden. My grandparents live in the house with the garden.</i><br>Which house do the grandparents live in?", "The white one.",
      [["The yellow one.", "dikkat", "Sarı evde havuz var; büyükanne ve büyükbaba bahçeli evde oturuyor."], ["The big one.", "dikkat", "Büyük olan sarı ev; bahçeli ev küçük."], ["The one with a swimming pool.", "dikkat", "Havuzlu ev sarı ev; bahçeli ev beyaz."]],
      "the house with the garden = bahçeli ev. Bahçe hangi evde?",
      C("Büyükanne ve büyükbabanın oturduğu evi bulacağız.", "the house with the garden = bahçeli ev.",
        "Metinde bahçeli ev: The white house is small but it has got a lovely garden.", "Yani bahçeli ev beyaz ve küçük.", "Cevap: The white one.", "Ev tarifinde özellikleri (renk, büyüklük, bahçe/havuz) bir tabloya dökersen karıştırmazsın."),
      { kural: "the one with a garden = bahçeli olan.", dogruNeden: "Bahçesi olan ev beyaz evdir ve büyükanne-büyükbaba orada oturuyor." }),
  );

  const DONUS = [["I", "myself"], ["You", "yourself"], ["He", "himself"], ["She", "herself"], ["We", "ourselves"], ["They", "themselves"]];
  SORU_EKLE("enhom.reflex",
    z => {
      const k = sec(DONUS), is = sec([["paint", "paints", "the walls"], ["clean", "cleans", "the windows"], ["build", "builds", "the bookshelf"], ["repair", "repairs", "the door"]]);
      const fiil = ["He", "She"].includes(k[0]) ? is[1] : is[0];
      const d = karistir(DONUS.filter(x => x !== k)).slice(0, 2);
      const nesne = { I: "me", You: "you", He: "him", She: "her", We: "us", They: "them" }[k[0]];
      return S({
        kaz: "enhom.reflex", duzey: "uygulama", zorluk: 2,
        soru: `Choose the correct word.<br>${k[0]} ${fiil} ${is[2]} ___. Nobody helps.`,
        dogru: k[1],
        yanlis: [...d.map(x => [x[1], "dikkat", `“${x[1]}” ${x[0]} öznesiyle kullanılır; burada özne “${k[0]}”.`]), [nesne, "kavrama", `“${nesne}” nesne zamiridir; işi öznenin kendisinin yaptığını dönüşlü zamir anlatır.`]],
        ipucu: "Özne işi kendi kendine yapıyor; özneye uygun -self / -selves kelimesini seç.",
        cozum: C("Özneye uygun dönüşlü zamiri bulacağız.", "I → myself, you → yourself, he → himself, she → herself, we → ourselves, they → themselves. by + dönüşlü zamir / cümle sonunda dönüşlü zamir = kendi kendine.",
          `Özne: ${k[0]}.`, `${k[0]} → ${k[1]}.`, `Cevap: ${k[0]} ${fiil} ${is[2]} ${k[1]}.`, "Tekil öznede -self, çoğul öznede -selves kullanılır."),
        kural: "Tekil → -self (herself); çoğul → -selves (ourselves).",
        dogruNeden: `“${k[0]}” öznesinin dönüşlü zamiri “${k[1]}”.`,
      });
    },
    Q("enhom.reflex", "transfer", 2, "Complete the dialogue.<br>— Who decorated your bedroom? It's beautiful!<br>— Nobody helped me. I decorated it ___.", "myself",
      [["me", "kavrama", "“me” nesne zamiridir; işi kendi başına yaptığını “myself” anlatır."], ["yourself", "dikkat", "Özne “I”; “yourself” karşıdaki kişi içindir."], ["itself", "dikkat", "“itself” eşya ve hayvanlar içindir; özne “I”."]],
      "Nobody helped me → kendi kendime.",
      C("“Kendi kendime” anlamını veren kelimeyi bulacağız.", "I → myself. Dönüşlü zamir işi öznenin kendisinin yaptığını gösterir.",
        "Özne: I.", "I → myself: I decorated it myself.", "Cevap: myself.", "“Nobody helped me.” cümlesi işin tek başına yapıldığını doğruluyor."),
      { kural: "I did it myself. = Kendim yaptım.", dogruNeden: "Özne “I” olduğu için dönüşlü zamir “myself”tir." }),
    Q("enhom.reflex", "aciklama", 3, "Which sentence is <b>correct</b>?", "The children made the cake themselves.",
      [["The children made the cake themself.", "bilgi", "Çoğul özneyle -selves kullanılır: themselves."], ["The children made the cake theirselves.", "bilgi", "“theirselves” diye bir kelime yoktur; doğrusu themselves."], ["The children made the cake himself.", "dikkat", "“The children” çoğuldur; “himself” tek bir erkek içindir."]],
      "The children = they.",
      C("Dönüşlü zamiri doğru kullanılmış cümleyi bulacağız.", "they → themselves (them + selves).",
        "Özne: The children → they.", "they → themselves; themself ve theirselves yanlış yazımdır.", "Cevap: The children made the cake themselves.", "Çoğul özneler -selves alır: ourselves, yourselves, themselves."),
      { kural: "they → themselves; he → himself (hisself değil).", dogruNeden: "Çoğul özne “the children” (they) için dönüşlü zamir “themselves”tir." }),
  );

  /*SON*/
})();
