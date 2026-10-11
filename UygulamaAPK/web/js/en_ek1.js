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
    ["Your brother plays football", "doesn't he?", ["isn't he?", "don't he?", "does he?"], "geniş zaman, olumlu, özne he"],
    ["Elif likes maths", "doesn't she?", ["isn't she?", "does she?", "didn't she?"], "geniş zaman, olumlu, özne she"],
    ["They live in Izmir", "don't they?", ["doesn't they?", "aren't they?", "do they?"], "geniş zaman, olumlu, özne they"],
    ["You are reading a comic", "aren't you?", ["don't you?", "are you?", "isn't you?"], "şimdiki zaman, olumlu, özne you"],
    ["Mert is doing his homework", "isn't he?", ["doesn't he?", "is he?", "aren't he?"], "şimdiki zaman, olumlu, özne he"],
    ["The girls aren't sleeping", "are they?", ["aren't they?", "do they?", "is she?"], "şimdiki zaman, olumsuz, özne they"],
    ["Ali doesn't eat fish", "does he?", ["doesn't he?", "is he?", "do he?"], "geniş zaman, olumsuz, özne he"],
  ];
  SORU_EKLE("endly.tags",
    z => {
      const t = sec(TAG_C);
      const neden = { "isn't": "“isn't” bu cümleye uymuyor: “is” yalnızca he / she / it ile şimdiki zamanda kullanılır; zamanı ve özneyi kontrol et.", "don't": "Özneye dikkat et; yardımcı fiil özneyle uyumlu olmalı.", "doesn't": "Özneye dikkat et; yardımcı fiil özneyle uyumlu olmalı.", "aren't": "Olumsuz cümleye olumlu tag gelir; ayrıca “are” yalnızca you / we / they ile şimdiki zamanda kullanılır.", "does": "Olumlu cümleye olumsuz, olumsuz cümleye olumlu tag gelir.", "do": "Olumlu cümleye olumsuz, olumsuz cümleye olumlu tag gelir.", "are": "Olumlu cümleye olumsuz, olumsuz cümleye olumlu tag gelir.", "is": "Olumlu cümleye olumsuz, olumsuz cümleye olumlu tag gelir.", "didn't": "“did” geçmiş zamandır; cümle geniş zamanda." };
      return S({
        kaz: "endly.tags", duzey: "uygulama", zorluk: 2,
        soru: `Choose the correct question tag.<br>${t[0]}, ___`,
        dogru: t[1],
        yanlis: t[2].map(x => [x, x.startsWith("is") && t[3].startsWith("geniş") ? "kavrama" : "dikkat", neden[x.split(" ")[0]] || "Yardımcı fiil, özne ve olumlu/olumsuz uyumunu kontrol et."]),
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

  /*SON*/
})();
