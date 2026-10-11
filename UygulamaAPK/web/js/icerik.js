/* 6. sınıf Matematik (Maarif Modeli) içeriği: temalar, konular, kazanımlar, konu anlatımları ve soru üreteçleri.
 * Ek (görselli) üreteçler mat_ek.js dosyasındadır. Ortak yardımcılar ortak.js içindedir.
 *
 * Her soru şu biçimdedir:
 *  { kaz, duzey, zorluk, soru, secenekler:[{m, dogru, hata, neden}], ipucu, cozum:[adımlar] }
 *  duzey : hatirlama | aciklama | uygulama | transfer | baglanti
 *  hata  : bilgi | kavrama | islem | dikkat | strateji   (yanlış şıkkın hangi hatayı gösterdiği)
 * Üreteçler her çağrıldığında yeni sayılarla yeni bir soru üretir; böylece "benzer soru",
 * "tekrar testi" ve "uyarlanabilir" sorular için soru sınırı yoktur.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, bolenler, asalMi, ebob, ekok, sade, kesir, asalCarpan, ek, us, ustlu, S } = OGR;

  /* ============================== TEMA 1 ============================== */
  const T1 = { id: "t1", ad: "Sayılar ve Nicelikler (1)", kisa: "Tema 1" };
  const T2 = { id: "t2", ad: "Veriden Olasılığa", kisa: "Tema 2" };
  const T3 = { id: "t3", ad: "Sayılar ve Nicelikler (2)", kisa: "Tema 3" };
  const T4 = { id: "t4", ad: "İstatistiksel Araştırma Süreci", kisa: "Tema 4" };
  const CARPANLI = [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 54, 56, 60, 72, 84, 90, 96];

  const KONULAR = [];
  function konu(k) { KONULAR.push(k); return k; }

  konu({
    id: "carpan", tema: "t1", ad: "Çarpanlar",
    kazanimlar: [{ id: "carpan.bul", ad: "Bir sayının çarpanlarını bulma" }, { id: "carpan.say", ad: "Çarpan sayısını belirleme" }, { id: "carpan.model", ad: "Çarpanları dikdörtgen modelle ilişkilendirme" }],
    anlatim: [
      { baslik: "Çarpan nedir?", metin: "Bir doğal sayıyı <b>kalansız bölen</b> doğal sayılara o sayının <b>çarpanları</b> (bölenleri) denir.", ornek: "12'nin çarpanları: 1, 2, 3, 4, 6, 12. Çünkü 12 bu sayıların her birine kalansız bölünür.",
        durak: { soru: "Aşağıdakilerden hangisi 18'in çarpanıdır?", secenekler: [["6", true, "18 ÷ 6 = 3, kalan 0. Bu yüzden 6, 18'in çarpanıdır."], ["4", false, "18 ÷ 4 = 4, kalan 2. Kalan olduğu için 4 çarpan değildir."], ["36", false, "36, 18'in katıdır; çarpanı değildir. Çarpanlar sayıdan büyük olamaz."], ["5", false, "18 ÷ 5 kalanlıdır."]] } },
      { baslik: "Çarpan çiftleri", metin: "Çarpanları <b>çiftler hâlinde</b> bulmak hiçbirini kaçırmamayı sağlar: çarpımı sayıyı veren iki sayıyı yan yana yaz.", ornek: "24 = 1 × 24 = 2 × 12 = 3 × 8 = 4 × 6. Çarpanlar: 1, 2, 3, 4, 6, 8, 12, 24 (8 tane).",
        durak: { soru: "36'nın kaç çarpanı vardır?", secenekler: [["9", true, "1×36, 2×18, 3×12, 4×9, 6×6 → 1, 2, 3, 4, 6, 9, 12, 18, 36: 9 çarpan. 6 bir kez sayılır."], ["10", false, "6 × 6 çiftinde 6'yı iki kez saymış olabilirsin."], ["8", false, "Bir çarpanı kaçırdın; çarpan çiftlerini sırayla yaz."], ["5", false, "Bu çarpan çiftlerinin sayısıdır, çarpanların değil."]] } },
      { baslik: "Dikdörtgen modeli", metin: "Bir sayı kadar birim kareyle kurulabilen her dikdörtgenin kenarları o sayının bir <b>çarpan çiftidir</b>.", ornek: "12 birim kare: 1×12, 2×6, 3×4 dikdörtgenleri. 3 farklı dikdörtgen.",
        durak: { soru: "16 birim kareyle kaç farklı dikdörtgen kurulabilir? (2×8 ile 8×2 aynı)", secenekler: [["3", true, "1×16, 2×8, 4×4 → 3 dikdörtgen (kare de bir dikdörtgendir)."], ["5", false, "Bu, 16'nın çarpan sayısıdır; her dikdörtgen bir çarpan çiftidir."], ["2", false, "4×4 kare de bir dikdörtgendir; onu unuttun."], ["4", false, "Çarpan çiftlerini tekrar say: 1×16, 2×8, 4×4."]] } },
    ],
    uret: {
      "carpan.bul": [
        z => { const n = sec(CARPANLI); const b = bolenler(n).filter(x => x > 1 && x < n); const d = sec(b); const olmayan = karistir([...Array(n).keys()].filter(x => x > 2 && n % x)).slice(0, 2);
          return S({ kaz: "carpan.bul", duzey: "hatirlama", zorluk: 1, soru: `Aşağıdakilerden hangisi ${n} sayısının çarpanlarından biridir?`, dogru: d, dogruNeden: `${n} ÷ ${d} = ${n / d}, kalan 0.`,
            yanlis: [[2 * n, "kavrama", `${2 * n}, ${n}${ek(n, "in")} katıdır; çarpan değildir. Çarpan sayının kendisinden büyük olamaz.`], [olmayan[0], "islem", `${n} ÷ ${olmayan[0]} kalanlı bir bölmedir.`], [olmayan[1], "islem", `${n} ÷ ${olmayan[1]} kalanlı bir bölmedir.`]],
            ipucu: "Seçenekteki sayıya böldüğünde kalan 0 oluyor mu?", cozum: [`🔎 Soruyu anlayalım: Seçeneklerden hangisinin ${n} sayısını kalansız böldüğünü arıyoruz.`,
              "💡 Hatırlayalım: Bir sayıyı kalansız bölen sayılar onun çarpanıdır. Çarpan, sayının kendisinden büyük olamaz.",
              `✏️ ${2 * n} sayısı ${n}${ek(n, "den")} büyük; çarpan olamaz, o ${n}${ek(n, "in")} katıdır. ${olmayan[0]} ve ${olmayan[1]} ise ${n}${ek(n, "i")} bölünce kalan bırakır.`,
              `✏️ ${n} ÷ ${d} işlemini yapalım: ${n} ÷ ${d} = ${n / d}, kalan 0.`,
              `✅ Sonuç: ${d}, ${n} sayısının çarpanıdır.`,
              `🔁 Kontrol edelim: ${d} × ${n / d} = ${n}. Çarpım tuttu, harika!`] }); },
        z => { const n = sec(CARPANLI); const b = bolenler(n); const eksik = sec(b.slice(2, -2)); const liste = b.map(x => x === eksik ? "?" : x).join(", ");
          return S({ kaz: "carpan.bul", duzey: "uygulama", zorluk: 2, soru: `${n} sayısının çarpanları küçükten büyüğe yazılmıştır: ${liste}. Soru işareti yerine hangi sayı gelir?`, dogru: eksik,
            yanlis: [[eksik + 1, "islem", `${n} ÷ ${eksik + 1} kalanlıdır.`], [eksik * 2 <= n && n % (eksik * 2) ? eksik * 2 : eksik + 2, "islem", "Bu sayı listede yer alamaz; böl ve kalanı kontrol et."], [n / eksik + 1, "dikkat", "Çarpan çiftinin diğer elemanını değil, eksik olanı bulmalısın."]],
            ipucu: "Eksik sayının çarpan çiftini düşün: ? × ... = " + n, cozum: [`🔎 Soruyu anlayalım: ${n} sayısının çarpanları sıralı yazılmış, biri eksik. Eksik çarpanı bulacağız.`,
              `💡 Hatırlayalım: Çarpanlar çiftler hâlinde gelir; bir çiftteki iki sayının çarpımı ${n} eder.`,
              `✏️ Çarpan çiftlerini yazalım: ${b.slice(0, Math.ceil(b.length / 2)).map(x => x + " × " + n / x).join(", ")}.`,
              `✏️ Listeyle karşılaştıralım: ${liste}. Soru işaretinin yerinde ${eksik} olmalı.`,
              `✅ Sonuç: Eksik çarpan ${eksik}${ek(eksik, "dir")}.`,
              `🔁 Kontrol edelim: ${n} ÷ ${eksik} = ${n / eksik}, kalan 0. Üstelik ${eksik}, sıralamada iki komşusunun arasına tam oturuyor.`], dogruNeden: `${eksik} × ${n / eksik} = ${n} olduğu için ${eksik}, ${n} sayısının çarpanıdır ve listede eksik olan sayıdır.` }); },
        z => { const a = R(3, 9), b = R(3, 9), n = a * b;
          return S({ kaz: "carpan.bul", duzey: "aciklama", zorluk: 1, soru: `${a} × ${b} = ${n} olduğuna göre aşağıdakilerden hangisi kesinlikle doğrudur?`, dogru: `${a} ve ${b}, ${n} sayısının çarpanlarıdır.`,
            yanlis: [[`${n}, ${a} sayısının çarpanıdır.`, "kavrama", "Çarpan ile katı karıştırdın: büyük sayı küçüklerin katıdır."], [`${a}, ${n} sayısının katıdır.`, "kavrama", `${a}, ${n}${ek(n, "in")} katı değil çarpanıdır.`], [`${n} asal sayıdır.`, "bilgi", `${n} sayısının 1 ve kendisi dışında çarpanları (${a}, ${b}) var; asal değildir.`]],
            ipucu: "Çarpılan sayılar sonuçla nasıl bir ilişki içindedir?", cozum: [`🔎 Soruyu anlayalım: ${a} × ${b} = ${n} eşitliği veriliyor; bu eşitlikten kesin olarak çıkan bilgiyi arıyoruz.`,
              "💡 Hatırlayalım: Çarpılan sayılar sonucun çarpanlarıdır; sonuç ise o sayıların katıdır.",
              `✏️ ${n} ÷ ${a} = ${b} ve ${n} ÷ ${b} = ${a}; iki bölmede de kalan 0.`,
              `✏️ Demek ki ${a} ve ${b}, ${n}${ek(n, "i")} kalansız böler. Büyük sayı olan ${n} ise onların katıdır.`,
              `✅ Sonuç: ${a} ve ${b}, ${n} sayısının çarpanlarıdır.`,
              `🔁 Kontrol edelim: “${n}, ${a} sayısının çarpanıdır” gibi ters cümleler yanlıştır; çünkü çarpan, sayının kendisinden büyük olamaz.`], dogruNeden: `${a} × ${b} = ${n} olduğu için ${a} ve ${b}, ${n}${ek(n, "i")} kalansız böler; yani çarpanlarıdır.` }); },
      ],
      "carpan.say": [
        z => { const n = sec(CARPANLI); const d = bolenler(n).length;
          return S({ kaz: "carpan.say", duzey: "uygulama", zorluk: 2, soru: `${n} sayısının kaç tane çarpanı vardır?`, dogru: d, dogruNeden: `${n} sayısını kalansız bölen sayılar ${bolenler(n).join(", ")}; bunlar ${d} tanedir.`,
            yanlis: [[d - 2, "dikkat", "1'i ve sayının kendisini de saymalısın."], [Math.ceil(d / 2), "kavrama", "Bu, çarpan çiftlerinin sayısıdır; her çiftte iki çarpan vardır."], [d + 1, "islem", "Kareli sayılarda ortadaki çarpan yalnızca bir kez sayılır."]],
            ipucu: "Çarpan çiftlerini 1'den başlayarak yaz.", cozum: [`🔎 Soruyu anlayalım: ${n} sayısını kalansız bölen kaç sayı olduğunu bulacağız.`,
              "💡 Hatırlayalım: Hiçbir çarpanı kaçırmamak için 1'den başlayarak çarpan çiftlerini yazarız.",
              `✏️ Çarpan çiftleri: ${bolenler(n).filter(x => x * x <= n).map(x => x + " × " + n / x).join(", ")}.`,
              `✏️ Çiftlerdeki sayıları küçükten büyüğe dizelim: ${bolenler(n).join(", ")}.`,
              `✅ Sonuç: ${n} sayısının ${d} çarpanı vardır.`,
              `🔁 Kontrol edelim: 1'i ve ${n}${ek(n, "i")} saydık. ${Number.isInteger(Math.sqrt(n)) ? Math.sqrt(n) + " × " + Math.sqrt(n) + " çiftindeki " + Math.sqrt(n) + " yalnızca bir kez sayıldı." : "Her çift 2 çarpan verdi: " + bolenler(n).filter(x => x * x <= n).length + " × 2 = " + d + "."}`] }); },
        z => { const n = sec([24, 30, 36, 40, 48, 60]); const d = bolenler(n).length - 2;
          return S({ kaz: "carpan.say", duzey: "transfer", zorluk: 3, soru: `${n} öğrenci, her grupta eşit sayıda öğrenci olacak ve kimse açıkta kalmayacak şekilde gruplara ayrılacak. Her grupta en az 2 öğrenci ve en az 2 grup olacaksa kaç farklı gruplama yapılabilir?`, dogru: d, dogruNeden: `Grup büyüklüğü ${n}${ek(n, "in")} 1 ve ${n} dışındaki çarpanlarından biri olabilir: ${bolenler(n).filter(x => x > 1 && x < n).join(", ")}; yani ${d} seçenek.`,
            yanlis: [[d + 2, "dikkat", "“En az 2 öğrenci ve en az 2 grup” koşulu 1 ve sayının kendisini dışarıda bırakır."], [Math.ceil((d + 2) / 2), "kavrama", `Örneğin 2${ek(2, "er")}li gruplar ile 2 grup farklı gruplamalardır; çarpan çiftlerini değil, uygun çarpanları tek tek saymalısın.`], [d + 1, "dikkat", "Koşullardan birini atlamışsın."]],
            ipucu: "Grup büyüklüğü, öğrenci sayısının bir çarpanı olmalı. Hangi çarpanlar koşulu sağlamaz?", cozum: [`🔎 Soruyu anlayalım: ${n} öğrenci eşit gruplara ayrılacak; her grupta en az 2 kişi olacak ve en az 2 grup kurulacak.`,
              "💡 Hatırlayalım: Kimse açıkta kalmıyorsa grup büyüklüğü, öğrenci sayısının bir çarpanıdır.",
              `✏️ ${n}${ek(n, "in")} çarpanları: ${bolenler(n).join(", ")}.`,
              `✏️ 1 kişilik gruplar (en az 2 kişi koşulu) ve ${n} kişilik tek grup (en az 2 grup koşulu) olmaz; bu ikisini çıkaralım.`,
              `✅ Sonuç: Geriye ${bolenler(n).filter(x => x > 1 && x < n).join(", ")} kalır; ${d} farklı gruplama yapılabilir.`,
              `🔁 Kontrol edelim: Örneğin ${bolenler(n)[1]} kişilik gruplarla ${n / bolenler(n)[1]} grup olur ve ${bolenler(n)[1]} × ${n / bolenler(n)[1]} = ${n}. Her gruplama böyle sağlanır.`] }); },
      ],
      "carpan.model": [
        z => { const n = sec([12, 16, 18, 20, 24, 30, 36]); const d = Math.ceil(bolenler(n).length / 2);
          return S({ kaz: "carpan.model", duzey: "transfer", zorluk: 2, soru: `${n} birim karenin tamamı kullanılarak, aralarında boşluk kalmadan kaç farklı dikdörtgen oluşturulabilir? (2×3 ile 3×2 aynı kabul edilir.)`, dogru: d, dogruNeden: `Her dikdörtgen ${n}${ek(n, "in")} bir çarpan çiftidir; ${n} sayısının ${d} çarpan çifti vardır.`,
            yanlis: [[bolenler(n).length, "kavrama", "Her dikdörtgen bir çarpan çiftidir; çarpan sayısını değil çift sayısını say."], [d - 1, "dikkat", "Kare de bir dikdörtgendir; onu da say."], [d + 2, "islem", "Çarpan çiftlerini yeniden kontrol et."]],
            ipucu: "Her dikdörtgenin kenarları çarpımı " + n + " olan iki sayıdır.", cozum: [`🔎 Soruyu anlayalım: ${n} birim kareyi boşluksuz dizerek kaç farklı dikdörtgen kurabileceğimizi arıyoruz.`,
              `💡 Hatırlayalım: Satır × sütun = ${n} olmalı; yani her dikdörtgen bir çarpan çiftidir.`,
              `✏️ Çarpan çiftlerini 1'den başlayarak yazalım: ${bolenler(n).filter(x => x * x <= n).map(x => x + " × " + n / x).join(", ")}.`,
              "✏️ 2 × 3 ile 3 × 2 aynı sayıldığı için her çifti yalnızca bir kez sayarız.",
              `✅ Sonuç: ${d} farklı dikdörtgen kurulabilir.`,
              `🔁 Kontrol edelim: Kare de bir dikdörtgendir${Number.isInteger(Math.sqrt(n)) ? "; " + Math.sqrt(n) + " × " + Math.sqrt(n) + " karesini de saydık" : ""}. Her çiftin kenarlarını çarptığımızda ${n} çıkıyor.`] }); },
        z => { const a = R(2, 6), b = R(a + 1, 12), n = a * b;
          return S({ kaz: "carpan.model", duzey: "aciklama", zorluk: 1, soru: `Birim karelerle kurulan ${a} × ${b} boyutlarındaki dikdörtgen hangi sayının bir çarpan çiftini gösterir?`, dogru: n,
            yanlis: [[a + b, "kavrama", "Kenarları toplamadın, çarpmalısın: dikdörtgendeki kare sayısı çarpımdır."], [2 * (a + b), "kavrama", "Bu çevre uzunluğudur; birim kare sayısı alandır."], [n + a, "islem", "Çarpımı yeniden hesapla."]],
            ipucu: "Dikdörtgende kaç birim kare vardır?", cozum: [`🔎 Soruyu anlayalım: ${a} sıra ve ${b} sütundan oluşan birim kare dikdörtgeninin hangi sayıyı gösterdiğini bulacağız.`,
              "💡 Hatırlayalım: Dikdörtgendeki birim kare sayısı = satır sayısı × sütun sayısı.",
              `✏️ ${a} × ${b} = ${n} birim kare.`,
              `✏️ Kenarlar ${a} ve ${b} olduğundan bu iki sayı ${n}${ek(n, "in")} bir çarpan çiftidir.`,
              `✅ Sonuç: Model ${n} sayısını gösterir.`,
              `🔁 Kontrol edelim: Kenarları toplamak (${a + b}) ya da çevreyi bulmak (${2 * (a + b)}) kare sayısını vermez; kareleri sayan işlem çarpmadır.`], dogruNeden: `${a} × ${b} = ${n} birim kare olduğu için dikdörtgen ${n} sayısının bir çarpan çiftini gösterir.` }); },
      ],
    },
  });

  konu({
    id: "kat", tema: "t1", ad: "Katlar",
    kazanimlar: [{ id: "kat.bul", ad: "Bir sayının katlarını belirleme" }, { id: "kat.aralik", ad: "Belirli aralıktaki katları bulma" }, { id: "kat.problem", ad: "Kat kavramını problemlerde kullanma" }],
    anlatim: [
      { baslik: "Kat nedir?", metin: "Bir sayının doğal sayılarla çarpımına o sayının <b>katları</b> denir. 0 her sayının katıdır; katlar sonsuza kadar gider.", ornek: "7'nin katları: 0, 7, 14, 21, 28, 35, …",
        durak: { soru: "Hangisi 6'nın katıdır?", secenekler: [["42", true, "6 × 7 = 42."], ["16", false, "16, 6'ya kalansız bölünmez."], ["3", false, "3, 6'nın çarpanıdır; katı değildir."], ["26", false, "26 ÷ 6 kalanlıdır."]] } },
      { baslik: "Çarpan mı, kat mı?", metin: "a × b = c ise <b>a ve b, c'nin çarpanı</b>; <b>c ise a'nın ve b'nin katı</b>dır. Kat büyüktür, çarpan küçüktür.", ornek: "4 × 5 = 20 → 20, 4'ün katıdır; 4, 20'nin çarpanıdır.",
        durak: { soru: "“24, 8'in …… dır.” cümlesindeki boşluğa ne gelir?", secenekler: [["katı", true, "8 × 3 = 24 olduğu için 24, 8'in katıdır."], ["çarpanı", false, "Ters söyledin: 8, 24'ün çarpanıdır."], ["asal çarpanı", false, "24 asal değildir."], ["böleni", false, "Bölen, çarpan demektir; 24, 8'in böleni olamaz."]] } },
      { baslik: "Aralıktaki katlar", metin: "Bir aralıktaki katları bulmak için aralıktaki <b>ilk</b> ve <b>son</b> katı bul, sonra kaç adım olduğunu say.", ornek: "20 ile 50 arasında 6'nın katları: 24, 30, 36, 42, 48 → 5 tane.",
        durak: { soru: "10 ile 40 arasında 7'nin kaç katı vardır?", secenekler: [["4", true, "14, 21, 28, 35 → 4 tane."], ["5", false, "42, 40'tan büyüktür; aralığın dışında kalır."], ["3", false, "14'ü unutmuş olabilirsin."], ["6", false, "Katları tek tek yazarak kontrol et."]] } },
    ],
    uret: {
      "kat.bul": [
        z => { const k = R(3, 13); const d = k * R(3, 9); const olmayan = karistir([...Array(80).keys()].filter(x => x > 10 && x % k)).slice(0, 2); const carp = sec(bolenler(k).filter(x => x > 1 && x < k)) || 1;
          return S({ kaz: "kat.bul", duzey: "hatirlama", zorluk: 1, soru: `Aşağıdakilerden hangisi ${k} sayısının katıdır?`, dogru: d,
            yanlis: [[olmayan[0], "islem", `${olmayan[0]} ÷ ${k} kalanlıdır.`], [olmayan[1], "islem", `${olmayan[1]} ÷ ${k} kalanlıdır.`], [carp === 1 ? k + 1 : carp, "kavrama", "Bu sayı katı değil; çarpan ile katı karıştırmış olabilirsin."]],
            ipucu: `${k} ile çarpım tablosunu düşün.`, cozum: [`🔎 Soruyu anlayalım: Seçeneklerden hangisinin ${k} sayısının katı olduğunu arıyoruz.`,
              `💡 Hatırlayalım: Bir sayının katları, o sayının 1, 2, 3, … ile çarpımıdır: ${k}, ${2 * k}, ${3 * k}, …`,
              `✏️ Seçenekleri ${k}${ek(k, "e")} bölelim: ${d} ÷ ${k} = ${d / k}, kalan 0.`,
              `✏️ ${olmayan[0]} ve ${olmayan[1]} ise ${k}${ek(k, "e")} bölündüğünde kalan bırakıyor; bu yüzden kat değiller.`,
              `✅ Sonuç: ${k} × ${d / k} = ${d} olduğu için ${d}, ${k} sayısının katıdır.`,
              `🔁 Kontrol edelim: 0 dışındaki katlar sayının kendisinden küçük olamaz. ${k}${ek(k, "den")} küçük bir seçenek görürsen o çarpan olabilir, kat değil.`], dogruNeden: `${d} ÷ ${k} = ${d / k} ve kalan 0; yani ${d} = ${k} × ${d / k}.` }); },
        z => { const k = R(4, 12), s = R(4, 9);
          return S({ kaz: "kat.bul", duzey: "uygulama", zorluk: 1, soru: `${k} sayısının sıfırdan büyük katları küçükten büyüğe sıralandığında ${s}. sırada hangi sayı bulunur?`, dogru: k * s,
            yanlis: [[k * (s - 1), "dikkat", "Bir önceki katı buldun; sırayı yeniden say."], [k * (s + 1), "dikkat", "0'ı sıraya dahil etmiş olabilirsin; soru sıfırdan büyük katları istiyor."], [k + s, "kavrama", "Kat, çarpımla bulunur; toplama yapmamalısın."]],
            ipucu: `${s}. kat = ${k} × ${s}.`, cozum: [`🔎 Soruyu anlayalım: ${k}${ek(k, "in")} sıfırdan büyük katları sıralanınca ${s}. sıradaki sayıyı arıyoruz.`,
              `💡 Hatırlayalım: 1. kat ${k} × 1, 2. kat ${k} × 2 … Kaçıncı kat isteniyorsa ${k} o sayıyla çarpılır.`,
              `✏️ İlk katları yazalım: ${k}, ${2 * k}, ${3 * k}, …`,
              `✏️ ${s}. kat: ${k} × ${s} = ${k * s}.`,
              `✅ Sonuç: ${s}. sırada ${k * s} bulunur.`,
              `🔁 Kontrol edelim: ${k * s} ÷ ${k} = ${s}. Soru “sıfırdan büyük” dediği için 0'ı saymadık; buna dikkat et!`], dogruNeden: `${s}. kat, ${k} ile ${s} sayısının çarpımıdır: ${k} × ${s} = ${k * s}.` }); },
        z => S({ kaz: "kat.bul", duzey: "aciklama", zorluk: 2, soru: "Katlar ile ilgili aşağıdakilerden hangisi doğrudur?", dogru: "0 her doğal sayının katıdır.",
          yanlis: [["Bir sayının katları sınırlı sayıdadır.", "bilgi", "Katlar sonsuza kadar devam eder."], ["Bir sayının katı her zaman o sayıdan küçüktür.", "kavrama", "Katlar sayının kendisine eşit ya da ondan büyüktür (0 hariç)."], ["1 hiçbir sayının katı değildir.", "kavrama", "1, 1'in katıdır (1 × 1 = 1)."]],
          ipucu: "Herhangi bir sayıyı 0 ile çarparsan ne elde edersin?", cozum: ["🔎 Soruyu anlayalım: Katlarla ilgili dört cümleden hangisinin her zaman doğru olduğunu bulacağız.",
            "💡 Hatırlayalım: Bir sayının katları, o sayının 0, 1, 2, 3, … ile çarpımıdır.",
            "✏️ Herhangi bir sayıyı 0 ile çarparsak sonuç 0 olur: 5 × 0 = 0, 12 × 0 = 0.",
            "✏️ Diğer cümleleri sınayalım: Katlar sonsuza kadar gider; 0 dışındaki katlar sayıdan küçük olmaz; 1 × 1 = 1 olduğundan 1, 1'in katıdır.",
            "✅ Sonuç: “0 her doğal sayının katıdır.” cümlesi doğrudur.",
            "🔁 Kontrol edelim: Yanlış cümleleri birer örnekle çürüttük. Bir dahaki sefere sen de cümleyi bir sayı üzerinde dene!"], dogruNeden: "Her sayı × 0 = 0 olduğu için 0, bütün doğal sayıların katıdır." }),
      ],
      "kat.aralik": [
        z => { const k = R(4, 12), a = R(10, 40), b = a + R(30, 60); let n = 0; for (let x = a + 1; x < b; x++) if (x % k === 0) n++;
          return S({ kaz: "kat.aralik", duzey: "uygulama", zorluk: 2, soru: `${a} ile ${b} arasında ${k} sayısının kaç katı vardır?`, dogru: n, dogruNeden: `${a} ile ${b} arasındaki ${k} katları tek tek yazıldığında ${n} sayı bulunur; uç sayılar sayılmaz.`,
            yanlis: [[n + 1, "dikkat", "“Arasında” denince uç sayılar dahil edilmez; aralığın dışındaki bir katı saymış olabilirsin."], [Math.floor((b - a) / k) + 1, "strateji", "Farkı bölmek yaklaşık sonuç verir; ilk ve son katı bulup say."], [n - 1, "islem", "İlk ya da son katı unutmuş olabilirsin."]],
            ipucu: "Aralıktaki ilk katı ve son katı bul.", cozum: [`🔎 Soruyu anlayalım: ${a} ile ${b} arasında (uçlar hariç) ${k}${ek(k, "in")} kaç katı olduğunu sayacağız.`,
              `💡 Hatırlayalım: “Arasında” denince ${a} ve ${b} sayılmaz. Önce ilk katı bulur, sonra ${k}${ek(k, "er")} ekleyerek ilerleriz.`,
              `✏️ ${a}${ek(a, "den")} büyük ilk kat: ${Math.floor(a / k + 1) * k}. ${b}${ek(b, "den")} küçük son kat: ${Math.ceil(b / k - 1) * k}.`,
              `✏️ Katları yazalım: ${[...Array(b - a - 1).keys()].map(x => x + a + 1).filter(x => x % k === 0).join(", ")}.`,
              `✅ Sonuç: Bu aralıkta ${k} sayısının ${n} katı vardır.`,
              `🔁 Kontrol edelim: (son kat − ilk kat) ÷ ${k} + 1 = (${Math.ceil(b / k - 1) * k} − ${Math.floor(a / k + 1) * k}) ÷ ${k} + 1 = ${n}. Aynı sonucu bulduk!`] }); },
        z => { const k = R(6, 17), n = Math.floor(99 / k) * k;
          return S({ kaz: "kat.aralik", duzey: "uygulama", zorluk: 2, soru: `${k} sayısının katı olan en büyük iki basamaklı sayı kaçtır?`, dogru: n, dogruNeden: `${n} = ${k} × ${n / k}; bir sonraki kat ${n + k} üç basamaklıdır.`,
            yanlis: [[99, "kavrama", `99, ${k}${ek(k, "in")} katı olmayabilir; kalansız bölünmeli.`], [n - k, "dikkat", "Daha büyük bir iki basamaklı kat var."], [n + k, "dikkat", "Bu sayı üç basamaklı olabilir; kontrol et."]],
            ipucu: `99'u ${k}${ek(k, "e")} böl, kalanı çıkar.`, cozum: [`🔎 Soruyu anlayalım: ${k}${ek(k, "in")} katı olan iki basamaklı sayıların en büyüğünü arıyoruz.`,
              "💡 Hatırlayalım: En büyük iki basamaklı sayı 99'dur. 99'u geçmeyen ve ona en yakın katı bulmalıyız.",
              `✏️ 99 ÷ ${k} = ${Math.floor(99 / k)}, kalan ${99 % k}.`,
              `✏️ Kalanı çıkarırsak kata ulaşırız: 99 − ${99 % k} = ${n}.`,
              `✅ Sonuç: ${k} sayısının katı olan en büyük iki basamaklı sayı ${n}.`,
              `🔁 Kontrol edelim: ${k} × ${Math.floor(99 / k)} = ${n}. Bir sonraki kat ${n + k} ise üç basamaklıdır.`] }); },
      ],
      "kat.problem": [
        z => { const k = sec([5, 6, 10, 12, 15, 20]), sure = sec([60, 90, 120]);
          return S({ kaz: "kat.problem", duzey: "transfer", zorluk: 2, soru: `Bir otobüs saat 08.00'de duraktan kalkıyor ve ${k} dakikada bir yeni otobüs kalkıyor. 08.00 ile ${sure} dakika sonrası arasında (ikisi de dahil) kaç otobüs kalkar?`, dogru: sure / k + 1, dogruNeden: `Kalkış dakikaları 0, ${k}, ${2 * k}, …, ${sure}; bunlar ${sure / k} + 1 = ${sure / k + 1} tanedir.`,
            yanlis: [[sure / k, "dikkat", "08.00'deki ilk otobüsü saymayı unuttun."], [sure / k + 2, "islem", "Bir fazla saydın; 0, " + k + ", " + 2 * k + " … şeklinde say."], [k, "kavrama", "Kalkış aralığı ile otobüs sayısı farklıdır."]],
            ipucu: `Kalkış zamanları ${k}${ek(k, "in")} katlarıdır: 0, ${k}, ${2 * k}, …`, cozum: [`🔎 Soruyu anlayalım: İlk otobüs 08.00'de kalkıyor, sonra ${k} dakikada bir otobüs var. ${sure} dakikalık sürede (başı ve sonu dahil) kaç otobüs kalkar?`,
              `💡 Hatırlayalım: Kalkış dakikaları ${k}${ek(k, "in")} katlarıdır: 0, ${k}, ${2 * k}, …`,
              `✏️ ${sure} ÷ ${k} = ${sure / k}; yani 0. dakikadan sonra ${sure / k} otobüs daha kalkar.`,
              `✏️ 08.00'deki (0. dakika) ilk otobüsü de eklemeliyiz: ${sure / k} + 1.`,
              `✅ Sonuç: Toplam ${sure / k + 1} otobüs kalkar.`,
              `🔁 Kontrol edelim: Küçük bir örnek düşün: 0, ${k} ve ${2 * k}. dakikalarda 3 otobüs kalkar; ${2 * k} ÷ ${k} + 1 = 3. Kural tutuyor.`] }); },
        z => { const k = sec([4, 6, 9]), a = 40, b = 90; const d = sec([...Array(b - a - 1).keys()].map(x => x + a + 1).filter(x => x % k === 0)); const yan = karistir([...Array(b - a - 1).keys()].map(x => x + a + 1).filter(x => x % k)).slice(0, 3);
          return S({ kaz: "kat.problem", duzey: "transfer", zorluk: 2, soru: `Bir kutudaki kalemler ${k}${ek(k, "er")} ${k}${ek(k, "er")} sayıldığında hiç artmıyor. Kalem sayısı 40 ile 90 arasındaysa aşağıdakilerden hangisi kalem sayısı olabilir?`, dogru: d,
            yanlis: yan.map(x => [x, "islem", `${x} ÷ ${k} kalanlıdır; kalem artardı.`]),
            ipucu: `“Hiç artmıyor” demek kalem sayısının ${k}${ek(k, "in")} katı olması demektir.`, cozum: [`🔎 Soruyu anlayalım: Kalemler ${k}${ek(k, "er")} ${k}${ek(k, "er")} sayılınca hiç artmıyor ve sayısı 40 ile 90 arasında. Hangi seçenek olabilir?`,
              `💡 Hatırlayalım: “Hiç artmıyor” demek, kalem sayısının ${k}${ek(k, "e")} kalansız bölündüğü, yani ${k}${ek(k, "in")} katı olduğu demektir.`,
              `✏️ Seçenekleri tek tek ${k}${ek(k, "e")} bölelim ve kalana bakalım.`,
              `✏️ ${d} ÷ ${k} = ${d / k}, kalan 0. Diğer seçeneklerde kalan var.`,
              `✅ Sonuç: Kalem sayısı ${d} olabilir.`,
              `🔁 Kontrol edelim: ${k} × ${d / k} = ${d} ve ${d}, 40 ile 90 arasında. İki koşul da sağlandı.`], dogruNeden: `${d} = ${k} × ${d / k} olduğu için ${k}${ek(k, "er")} sayıldığında hiç kalem artmaz.` }); },
      ],
    },
  });

  konu({
    id: "bolunebilme", tema: "t1", ad: "Kalansız Bölünebilme", onKosul: ["kat"],
    kazanimlar: [{ id: "bol.kural", ad: "2, 3, 4, 5, 6, 9, 10 bölünebilme kuralları" }, { id: "bol.rakam", ad: "Kurala göre eksik rakamı bulma" }, { id: "bol.ayirt", ad: "Kuralları birbirinden ayırt etme" }],
    anlatim: [
      { baslik: "2, 5 ve 10 kuralları", metin: "Bu kurallar için yalnızca <b>birler basamağına</b> bak: 2 → çift rakam (0, 2, 4, 6, 8); 5 → 0 veya 5; 10 → 0.", ornek: "3 470 sayısı 2'ye, 5'e ve 10'a kalansız bölünür (birler basamağı 0).",
        durak: { soru: "Hangisi 5 ile kalansız bölünür ama 10 ile bölünmez?", secenekler: [["735", true, "Birler basamağı 5: 5'e bölünür, 0 olmadığı için 10'a bölünmez."], ["740", false, "Birler basamağı 0 olduğu için 10'a da bölünür."], ["752", false, "Birler basamağı 2; 5'e bölünmez."], ["748", false, "Birler basamağı 8; 5'e bölünmez."]] } },
      { baslik: "3 ve 9 kuralları", metin: "Rakamların <b>toplamına</b> bak: toplam 3'ün katıysa sayı 3'e, 9'un katıysa 9'a kalansız bölünür.", ornek: "4 815 → 4+8+1+5 = 18. 18 hem 3'ün hem 9'un katı → sayı 3'e ve 9'a bölünür.",
        durak: { soru: "2 7A sayısı 9 ile kalansız bölünüyorsa A kaçtır?", secenekler: [["0 veya 9", true, "2+7+A toplamı 9'un katı olmalı: A = 0 → 9, A = 9 → 18."], ["9", false, "A = 0 da olur (2+7+0 = 9); iki değer var."], ["3", false, "2+7+3 = 12, 9'un katı değil."], ["6", false, "2+7+6 = 15, 9'un katı değil."]] } },
      { baslik: "4 ve 6 kuralları", metin: "4 → <b>son iki basamağın</b> oluşturduğu sayı 4'ün katı olmalı. 6 → sayı hem <b>2'ye hem 3'e</b> bölünmeli.", ornek: "1 316 → 16, 4'ün katı → 4'e bölünür. 312 → çift ve 3+1+2 = 6 → 6'ya bölünür.",
        durak: { soru: "Hangisi 6 ile kalansız bölünür?", secenekler: [["414", true, "Çift (2'ye bölünür) ve 4+1+4 = 9, 3'ün katı → 6'ya bölünür."], ["415", false, "Tek sayı; 2'ye bölünmez, 6'ya da bölünmez."], ["416", false, "Çift ama 4+1+6 = 11, 3'ün katı değil."], ["418", false, "Çift ama 4+1+8 = 13, 3'ün katı değil."]] } },
    ],
    uret: {
      "bol.kural": [
        z => { const b = sec([2, 3, 4, 5, 6, 9, 10]); const uy = x => x % b === 0; const sayilar = []; let d; while (!d) { const x = R(100, 999); if (uy(x)) d = x; }
          while (sayilar.length < 3) { const x = R(100, 999); if (!uy(x) && !sayilar.includes(x)) sayilar.push(x); }
          const kural = { 2: "birler basamağı çift olmalı", 3: "rakamları toplamı 3'ün katı olmalı", 4: "son iki basamağı 4'ün katı olmalı", 5: "birler basamağı 0 ya da 5 olmalı", 6: "hem 2'ye hem 3'e bölünmeli", 9: "rakamları toplamı 9'un katı olmalı", 10: "birler basamağı 0 olmalı" }[b];
          return S({ kaz: "bol.kural", duzey: "uygulama", zorluk: [2, 5, 10].includes(b) ? 1 : 2, soru: `Aşağıdaki sayılardan hangisi ${b} ile kalansız bölünür?`, dogru: d, dogruNeden: `Kural: ${kural}.`,
            yanlis: sayilar.map(x => [x, b === 6 || b === 4 ? "kavrama" : "bilgi", `${x} için kural sağlanmıyor (${kural}).`]),
            ipucu: `${b} ile bölünebilme kuralı: ${kural}.`, cozum: [`🔎 Soruyu anlayalım: Seçeneklerden hangisinin ${b} ile kalansız bölündüğünü bulacağız.`,
              `💡 Hatırlayalım: ${b} ile bölünebilme kuralı: ${kural}.`,
              `✏️ Kuralı ${d} sayısına uygulayalım: ${(() => { const t = String(d).split("").reduce((x, c) => x + +c, 0); return { 2: `birler basamağı ${d % 10}, çift bir rakam.`, 3: `rakamları toplamı ${String(d).split("").join(" + ")} = ${t}, 3'ün katı.`, 4: `son iki basamağın oluşturduğu sayı ${d % 100}, 4'ün katı.`, 5: `birler basamağı ${d % 10}.`, 6: `${d} çift ve rakamları toplamı ${t}, 3'ün katı.`, 9: `rakamları toplamı ${String(d).split("").join(" + ")} = ${t}, 9'un katı.`, 10: "birler basamağı 0." }[b]; })()}`,
              `✏️ Diğer seçenekler (${sayilar.join(", ")}) bu kuralı sağlamıyor.`,
              `✅ Sonuç: ${d} sayısı ${b} ile kalansız bölünür.`,
              `🔁 Kontrol edelim: ${d} ÷ ${b} = ${d / b}, kalan 0. Kural ile bölme işlemi aynı sonucu verdi.`] }); },
      ],
      "bol.rakam": [
        z => { const b = sec([3, 9]); const a = R(1, 9), c = R(0, 9); const uygun = [...Array(10).keys()].filter(x => (a + x + c) % b === 0); const d = Math.max(...uygun); const yan = [...Array(10).keys()].filter(x => !uygun.includes(x));
          return S({ kaz: "bol.rakam", duzey: "uygulama", zorluk: 2, soru: `${a}A${c} üç basamaklı sayısı ${b} ile kalansız bölünebildiğine göre A yerine yazılabilecek en büyük rakam kaçtır?`, dogru: d, dogruNeden: `A = ${d} için rakamlar toplamı ${a + d + c}; bu ${b}${ek(b, "in")} katı ve ${d}${ek(d, "den")} büyük uygun rakam yok.`,
            yanlis: [[Math.min(...uygun), "dikkat", "Bu, yazılabilecek en küçük rakamdır; soru en büyüğünü istiyor."], [sec(yan), "islem", `Bu rakamla rakamlar toplamı ${b}${ek(b, "in")} katı olmuyor.`], [9 === d ? 8 : 9, "islem", "Rakamlar toplamını yeniden kontrol et."]],
            ipucu: `${a} + A + ${c} toplamı ${b}${ek(b, "in")} katı olmalı.`, cozum: [`🔎 Soruyu anlayalım: ${a}A${c} sayısı ${b} ile kalansız bölünüyor; A yerine gelebilecek en büyük rakamı arıyoruz.`,
              `💡 Hatırlayalım: Bir sayı ${b} ile bölünebiliyorsa rakamları toplamı ${b}${ek(b, "in")} katıdır.`,
              `✏️ Bilinen rakamları toplayalım: ${a} + ${c} = ${a + c}. Rakamlar toplamı ${a + c} + A olacak.`,
              `✏️ A'ya 0'dan 9'a kadar değer verip deneyelim; uygun olanlar: ${uygun.join(", ")}.`,
              `✅ Sonuç: Yazılabilecek en büyük rakam ${d}.`,
              `🔁 Kontrol edelim: ${a} + ${d} + ${c} = ${a + d + c}; bu sayı ${b}${ek(b, "in")} katı. Sayı ${a}${d}${c} olur.`] }); },
        z => { const a = R(1, 9), b2 = R(0, 9); const uygun = [0, 2, 4, 6, 8].filter(x => (a + b2 + x) % 3 === 0); if (!uygun.length) return null; const d = uygun.length;
          return S({ kaz: "bol.rakam", duzey: "transfer", zorluk: 3, soru: `${a}${b2}A üç basamaklı sayısı 6 ile kalansız bölünüyor. A yerine kaç farklı rakam yazılabilir?`, dogru: d, dogruNeden: `A hem çift olmalı hem de rakamlar toplamını 3'ün katı yapmalı; bu iki koşulu yalnızca ${uygun.join(" ve ")} sağlar.`,
            yanlis: [[[...Array(10).keys()].filter(x => (a + b2 + x) % 3 === 0).length, "kavrama", "6'ya bölünmek için sayının çift olması da gerekir; yalnızca 3 kuralını uyguladın."], [5, "kavrama", "Yalnızca çift olma şartına baktın; 3 kuralı da gerekir."], [d + 1, "islem", "Uygun rakamları yeniden say."]],
            ipucu: "6 ile bölünme = hem 2 ile hem 3 ile bölünme.", cozum: [`🔎 Soruyu anlayalım: ${a}${b2}A sayısı 6 ile kalansız bölünüyor; A yerine kaç farklı rakam yazılabilir?`,
              "💡 Hatırlayalım: 6 ile bölünebilmek için sayı hem 2 ile hem 3 ile bölünebilmelidir.",
              "✏️ 2 koşulu: Birler basamağı A çift olmalı → A: 0, 2, 4, 6, 8.",
              `✏️ 3 koşulu: ${a} + ${b2} + A toplamı 3'ün katı olmalı. ${a} + ${b2} = ${a + b2}; çift adaylardan uyanlar: ${uygun.join(", ")}.`,
              `✅ Sonuç: A yerine ${d} farklı rakam yazılabilir.`,
              `🔁 Kontrol edelim: Örneğin A = ${uygun[0]} için ${a}${b2}${uygun[0]} ÷ 6 = ${(a * 100 + b2 * 10 + uygun[0]) / 6}, kalan 0.`] }); },
      ],
      "bol.ayirt": [
        z => S({ kaz: "bol.ayirt", duzey: "aciklama", zorluk: 2, soru: "Bölünebilme kuralları ile ilgili aşağıdakilerden hangisi doğrudur?", dogru: sec(["9 ile bölünebilen her sayı 3 ile de bölünebilir.", "10 ile bölünebilen her sayı 5 ile de bölünebilir.", "4 ile bölünebilen her sayı 2 ile de bölünebilir."]),
          yanlis: [["3 ile bölünebilen her sayı 9 ile de bölünebilir.", "kavrama", "Ters yönde geçerli değil: 12, 3'e bölünür ama 9'a bölünmez."], ["2 ile bölünebilen her sayı 4 ile de bölünebilir.", "kavrama", "6, 2'ye bölünür ama 4'e bölünmez."], ["5 ile bölünebilen her sayı 10 ile de bölünebilir.", "kavrama", "15, 5'e bölünür ama 10'a bölünmez."]],
          ipucu: "Her birini bir örnekle dene.", cozum: ["🔎 Soruyu anlayalım: Bölünebilme kurallarıyla ilgili cümlelerden hangisinin her zaman doğru olduğunu arıyoruz.",
            "💡 Hatırlayalım: Bir sayı büyük bir bölene bölünüyorsa o bölenin çarpanlarına da bölünür. Ama tersi her zaman doğru değildir.",
            "✏️ 9 = 3 × 3, 10 = 2 × 5, 4 = 2 × 2 olduğundan 9'a bölünen 3'e, 10'a bölünen 5'e, 4'e bölünen 2'ye de bölünür.",
            "✏️ Ters yönleri örnekle deneyelim: 12, 3'e bölünür ama 9'a bölünmez; 6, 2'ye bölünür ama 4'e bölünmez; 15, 5'e bölünür ama 10'a bölünmez.",
            "✅ Sonuç: Büyük bölenden onun çarpanına doğru kurulan cümle doğrudur.",
            "🔁 Kontrol edelim: Bir cümleyi çürütmek için tek bir karşı örnek yeter. Bir dahaki sefere sen de küçük sayılarla dene!"], dogruNeden: "Büyük bölen küçük olanın katı olduğundan, büyük sayıya bölünen her sayı küçük sayıya da bölünür." }),
        z => { const x = sec([126, 342, 504, 738, 216]);
          return S({ kaz: "bol.ayirt", duzey: "baglanti", zorluk: 3, soru: `${x} sayısı için aşağıdakilerden hangisi yanlıştır?`, dogru: `${x}, 5 ile kalansız bölünür.`,
            yanlis: [[`${x}, 2 ile kalansız bölünür.`, "dikkat", "Bu ifade doğru (çift sayı). Soru yanlış olanı istiyor."], [`${x}, 9 ile kalansız bölünür.`, "dikkat", "Bu ifade doğru (rakamlar toplamı 9'un katı). Soru yanlış olanı istiyor."], [`${x}, 6 ile kalansız bölünür.`, "dikkat", "Bu ifade doğru (hem 2'ye hem 3'e bölünür). Soru yanlış olanı istiyor."]],
            ipucu: "Soru “yanlış” olanı soruyor. Her ifadeyi kontrol et.", cozum: [`🔎 Soruyu anlayalım: ${x} sayısı için verilen cümlelerden YANLIŞ olanı bulacağız. “Yanlış” kelimesine dikkat!`,
              "💡 Hatırlayalım: 2 → birler basamağı çift; 9 → rakamlar toplamı 9'un katı; 6 → hem 2 hem 3; 5 → birler basamağı 0 ya da 5.",
              `✏️ ${x} çifttir (birler basamağı ${x % 10}); 2'ye bölünür.`,
              `✏️ Rakamlar toplamı ${String(x).split("").join(" + ")} = ${String(x).split("").reduce((a, b) => a + +b, 0)}; 9'un (dolayısıyla 3'ün) katı. Yani 9'a ve 6'ya da bölünür.`,
              `✅ Sonuç: Birler basamağı ${x % 10}; 0 ya da 5 değil. “${x}, 5 ile kalansız bölünür.” cümlesi yanlıştır.`,
              `🔁 Kontrol edelim: ${x} ÷ 5 = ${Math.floor(x / 5)}, kalan ${x % 5}. Kalan var; demek ki 5'e bölünmez.`], dogruNeden: `${x} sayısının birler basamağı ${x % 10} olduğu için 5'e kalansız bölünmez; diğer üç cümle doğrudur.` }); },
      ],
    },
  });

  konu({
    id: "asal", tema: "t1", ad: "Asal Sayılar", onKosul: ["carpan"],
    kazanimlar: [{ id: "asal.tani", ad: "Asal sayıları belirleme" }, { id: "asal.ayir", ad: "Asal çarpanlara ayırma" }, { id: "asal.kavram", ad: "Asal ve bileşik sayı kavramları" }],
    anlatim: [
      { baslik: "Asal sayı", metin: "Yalnızca <b>iki çarpanı</b> olan (1 ve kendisi) sayılara asal sayı denir. 1 asal değildir, çünkü tek çarpanı vardır.", ornek: "İlk asal sayılar: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. 2 tek çift asal sayıdır.",
        durak: { soru: "Hangisi asal sayıdır?", secenekler: [["29", true, "29'un çarpanları yalnızca 1 ve 29."], ["27", false, "27 = 3 × 9; çarpanları 1, 3, 9, 27."], ["1", false, "1'in yalnızca bir çarpanı var; asal değildir."], ["21", false, "21 = 3 × 7."]] } },
      { baslik: "Asal çarpanlara ayırma", metin: "Bir sayıyı en küçük asal sayıdan başlayarak böl; bölüm 1 olana kadar devam et (bölen merdiveni ya da çarpan ağacı).", ornek: "60 → 2 → 30 → 2 → 15 → 3 → 5 → 5 → 1. Yani 60 = 2² · 3 · 5.",
        durak: { soru: "36 sayısının asal çarpanlarına ayrılmış hâli hangisidir?", secenekler: [["2² · 3²", true, "36 = 2 · 2 · 3 · 3 = 2² · 3²."], ["4 · 9", false, "4 ve 9 asal değildir; asal çarpanlara kadar ayırmalısın."], ["2 · 3", false, "Bu yalnızca farklı asal çarpanlar; kuvvetleri eksik (2 · 3 = 6)."], ["2³ · 3", false, "2³ · 3 = 24 olur."]] } },
    ],
    uret: {
      "asal.tani": [
        z => { const asallar = [...Array(60).keys()].filter(asalMi).filter(x => x > 10); const d = sec(asallar); const tuzak = karistir([1, 9, 15, 21, 25, 27, 33, 35, 39, 49, 51, 57]).slice(0, 3);
          return S({ kaz: "asal.tani", duzey: "hatirlama", zorluk: 1, soru: "Aşağıdakilerden hangisi asal sayıdır?", dogru: d,
            yanlis: tuzak.map(x => [x, x === 1 ? "bilgi" : "kavrama", x === 1 ? "1 asal değildir; yalnızca bir çarpanı vardır." : `${x} tek sayıdır ama asal değildir: ${x} = ${bolenler(x)[1]} × ${x / bolenler(x)[1]}.`]),
            ipucu: "Tek sayı olmak asal olmak demek değildir. Küçük asal sayılara bölmeyi dene.", cozum: ["🔎 Soruyu anlayalım: Seçeneklerden hangisinin asal sayı olduğunu bulacağız.",
              "💡 Hatırlayalım: Asal sayının yalnızca iki çarpanı vardır: 1 ve kendisi. 1 asal değildir.",
              `✏️ Diğer seçenekleri inceleyelim: ${tuzak.map(x => x === 1 ? "1'in tek çarpanı var" : x + " = " + bolenler(x)[1] + " × " + x / bolenler(x)[1]).join("; ")}.`,
              `✏️ ${d} sayısını küçük asal sayılara bölelim: 2, 3, 5 ve 7'nin hiçbirine kalansız bölünmüyor.`,
              `✅ Sonuç: ${d} sayısının yalnızca iki çarpanı var (1 ve ${d}); ${d} asaldır.`,
              "🔁 Kontrol edelim: Tek sayı olmak asal olmak demek değildir (9, 15, 21 gibi). Her zaman küçük asal sayılara bölmeyi dene."], dogruNeden: `${d}, 1 ve kendisinden başka hiçbir sayıya kalansız bölünmez.` }); },
        z => { const a = sec([10, 20, 30, 40, 50]), b = a + 20; const n = [...Array(b - a - 1).keys()].map(x => x + a + 1).filter(asalMi).length;
          return S({ kaz: "asal.tani", duzey: "uygulama", zorluk: 2, soru: `${a} ile ${b} arasında kaç tane asal sayı vardır?`, dogru: n, dogruNeden: `Aralıktaki asal sayılar ${[...Array(b - a - 1).keys()].map(x => x + a + 1).filter(asalMi).join(", ")}; toplam ${n} tane.`,
            yanlis: [[n + 1, "kavrama", "Asal olmayan bir tek sayıyı (ör. 21, 27, 33) asal saymış olabilirsin."], [n - 1, "dikkat", "Bir asal sayıyı atlamış olabilirsin."], [10, "kavrama", "Aralıktaki tek sayıların hepsi asal değildir."]],
            ipucu: "Aralıktaki tek sayıları yaz, 3 ve 7'ye bölünenleri ele.", cozum: [`🔎 Soruyu anlayalım: ${a} ile ${b} arasındaki (uçlar hariç) asal sayıları sayacağız.`,
              "💡 Hatırlayalım: 2 dışındaki çift sayılar asal değildir; tek sayıları da 3, 5 ve 7 gibi küçük asal sayılara bölerek denetleriz.",
              `✏️ Aralıktaki tek sayılar: ${[...Array(b - a - 1).keys()].map(x => x + a + 1).filter(x => x % 2).join(", ")}.`,
              `✏️ 3, 5 ya da 7'ye bölünenleri eleyelim: ${[...Array(b - a - 1).keys()].map(x => x + a + 1).filter(x => x % 2 && !asalMi(x)).join(", ") || "elenen yok"}.`,
              `✅ Sonuç: Asal sayılar ${[...Array(b - a - 1).keys()].map(x => x + a + 1).filter(asalMi).join(", ")}; toplam ${n} tane.`,
              "🔁 Kontrol edelim: Kalan her sayının yalnızca 1'e ve kendisine bölündüğünü tek tek doğrula. 21, 27, 33 gibi tuzaklara dikkat!"] }); },
      ],
      "asal.ayir": [
        z => { const n = sec([12, 18, 20, 24, 28, 36, 40, 45, 48, 54, 60, 72, 84, 90, 100, 120]); const c = asalCarpan(n); const ps = Object.keys(c).map(Number);
          const y1 = { ...c }; y1[ps[0]] = c[ps[0]] + 1; const y2 = { ...c }; y2[ps[ps.length - 1]] = Math.max(1, c[ps[ps.length - 1]] - 1) === c[ps[ps.length - 1]] ? c[ps[ps.length - 1]] + 1 : c[ps[ps.length - 1]] - 1;
          const bilesik = bolenler(n).filter(x => x > 1 && x < n && !asalMi(x));
          return S({ kaz: "asal.ayir", duzey: "uygulama", zorluk: 2, soru: `${n} sayısının asal çarpanlarına ayrılmış hâli hangisidir?`, dogru: ustlu(c), dogruNeden: `Bu ifadedeki bütün tabanlar asaldır ve çarpımları ${n} eder.`,
            yanlis: [[ustlu(y1), "islem", "Bir asal çarpanın kuvvetini fazla saymışsın; çarpımı " + n + " etmiyor."], [ustlu(y2), "islem", "Kuvvetlerden biri hatalı; çarpımı kontrol et."], [bilesik.length ? `${bilesik[0]} · ${n / bilesik[0]}` : ps.join(" · "), "kavrama", "Bu çarpanlardan biri asal değil; asal çarpanlara kadar ayırmalısın."]],
            ipucu: "En küçük asal sayı olan 2'den başlayarak böl.", cozum: [`🔎 Soruyu anlayalım: ${n} sayısını asal sayıların çarpımı olarak yazacağız.`,
              "💡 Hatırlayalım: En küçük asal sayı olan 2'den başlarız; bölüm 1 olana kadar asal sayılara böleriz.",
              `✏️ Bölen merdiveni: ${(() => { let x = n; const s = []; for (let p = 2; x > 1; p++) while (x % p === 0) { s.push(x + " ÷ " + p + " = " + x / p); x /= p; } return s.join(" → "); })()}.`,
              `✏️ Kullandığımız bölenler: ${Object.entries(c).map(([p, k]) => Array(k).fill(p).join(" · ")).join(" · ")}. Aynı olanları üslü yazalım.`,
              `✅ Sonuç: ${n} = ${ustlu(c)}.`,
              `🔁 Kontrol edelim: Çarpanları çarparsak yine ${n} bulunur. Bir seçenekte asal olmayan sayı (4, 6, 9 gibi) varsa ayırma bitmemiştir.`] }); },
        z => { const n = sec([60, 72, 84, 90, 108, 120, 126, 150, 180]); const c = asalCarpan(n);
          return S({ kaz: "asal.ayir", duzey: "aciklama", zorluk: 2, soru: `Asal çarpanlarına ayrılmış hâli ${ustlu(c)} olan sayı kaçtır?`, dogru: n, dogruNeden: `${Object.entries(c).map(([p, k]) => Math.pow(p, k)).join(" × ")} = ${n}.`,
            yanlis: [[Object.entries(c).reduce((s, [p, k]) => s + p * k, 0), "kavrama", "Üslü ifadeyi çarpma yerine p × k olarak hesapladın."], [n / 2, "islem", "Bir çarpanı eksik hesapladın."], [n * 2, "islem", "Bir çarpanı fazla hesapladın."]],
            ipucu: "Kuvvetleri aç ve hepsini çarp.", cozum: [`🔎 Soruyu anlayalım: Asal çarpanları ${ustlu(c)} olarak verilen sayıyı bulacağız.`,
              "💡 Hatırlayalım: Üs, tabanın kaç kez çarpıldığını gösterir. Örneğin 2³ = 2 · 2 · 2 = 8.",
              `✏️ Üslü ifadeleri açalım: ${ustlu(c)} = ${Object.entries(c).map(([p, k]) => Array(k).fill(p).join(" · ")).join(" · ")}.`,
              `✏️ Her parçanın değeri: ${Object.entries(c).map(([p, k]) => us(p, k) + " = " + Math.pow(p, k)).join(", ")}.`,
              `✅ Sonuç: ${Object.entries(c).map(([p, k]) => Math.pow(p, k)).join(" × ")} = ${n}.`,
              `🔁 Kontrol edelim: ${n} sayısını yeniden asal çarpanlarına ayırırsan aynı ifadeyi bulursun.`] }); },
      ],
      "asal.kavram": [
        z => S({ kaz: "asal.kavram", duzey: "aciklama", zorluk: 1, soru: "Asal sayılarla ilgili hangisi doğrudur?", dogru: sec(["2, çift olan tek asal sayıdır.", "Asal sayıların yalnızca iki çarpanı vardır."]),
          yanlis: [["1 en küçük asal sayıdır.", "bilgi", "1 asal değildir; en küçük asal sayı 2'dir."], ["Bütün tek sayılar asaldır.", "kavrama", "9, 15, 21 gibi tek sayılar asal değildir."], ["Asal sayıların hiç çarpanı yoktur.", "kavrama", "Asal sayıların iki çarpanı vardır: 1 ve kendisi."]],
          ipucu: "Asal sayının tanımını hatırla: kaç çarpanı vardır?", cozum: ["🔎 Soruyu anlayalım: Asal sayılarla ilgili cümlelerden doğru olanı seçeceğiz.",
            "💡 Hatırlayalım: Asal sayı, tam olarak iki çarpanı (1 ve kendisi) olan sayıdır.",
            "✏️ 1'in yalnızca bir çarpanı var; bu yüzden asal değildir. En küçük asal sayı 2'dir.",
            "✏️ 2'nin çarpanları 1 ve 2'dir; hem asal hem çifttir. Diğer çift sayılar 2'ye de bölündüğü için asal olamaz.",
            "✅ Sonuç: Asal sayıların tam iki çarpanı vardır ve 2, çift olan tek asal sayıdır.",
            "🔁 Kontrol edelim: “Bütün tek sayılar asaldır” cümlesini 9 ile dene: 9 = 3 × 3. Tek bir karşı örnek cümleyi çürütür."], dogruNeden: "Asal sayının tanımı gereği yalnızca iki çarpanı vardır; 2 de bu tanıma uyan tek çift sayıdır." }),
        z => { const n = sec([30, 42, 66, 70, 78, 105, 110]); const t = Object.keys(asalCarpan(n)).map(Number).reduce((a, b) => a + b, 0);
          return S({ kaz: "asal.kavram", duzey: "baglanti", zorluk: 3, soru: `${n} sayısının farklı asal çarpanlarının toplamı kaçtır?`, dogru: t, dogruNeden: `${n} sayısının farklı asal çarpanları ${Object.keys(asalCarpan(n)).join(", ")}; toplamları ${t}.`,
            yanlis: [[t + 1, "bilgi", "1'i asal çarpan olarak eklemiş olabilirsin; 1 asal değildir."], [bolenler(n).filter(x => x > 1 && x < n).slice(0, 3).reduce((a, b) => a + b, 0), "kavrama", "Asal olmayan çarpanları da toplamış olabilirsin."], [t - 2, "islem", "Asal çarpanlardan birini atlamış olabilirsin."]],
            ipucu: "Önce asal çarpanlarına ayır, sonra farklı olanları topla.", cozum: [`🔎 Soruyu anlayalım: ${n} sayısını asal çarpanlarına ayırıp farklı asal çarpanları toplayacağız.`,
              "💡 Hatırlayalım: 1 asal değildir; 4, 6, 10 gibi asal olmayan çarpanlar da toplama katılmaz.",
              `✏️ Bölen merdiveni: ${(() => { let x = n; const s = []; for (let p = 2; x > 1; p++) while (x % p === 0) { s.push(x + " ÷ " + p + " = " + x / p); x /= p; } return s.join(" → "); })()}.`,
              `✏️ ${n} = ${ustlu(asalCarpan(n))}; farklı asal çarpanlar: ${Object.keys(asalCarpan(n)).join(", ")}.`,
              `✅ Sonuç: ${Object.keys(asalCarpan(n)).join(" + ")} = ${t}.`,
              `🔁 Kontrol edelim: ${Object.keys(asalCarpan(n)).join(" × ")} = ${Object.keys(asalCarpan(n)).reduce((a, b) => a * b, 1)}; bu ${n} sayısına eşit, yani hiçbir asal çarpanı atlamadık.`] }); },
      ],
    },
  });

  konu({
    id: "ortakkat", tema: "t1", ad: "Ortak Kat", onKosul: ["kat", "asal"],
    kazanimlar: [{ id: "okat.ekok", ad: "En küçük ortak katı bulma" }, { id: "okat.problem", ad: "Ortak kat problemleri" }],
    anlatim: [
      { baslik: "Ortak kat", metin: "İki sayının <b>her ikisinin de katı</b> olan sayılara ortak kat denir. Sıfırdan büyük en küçüğüne <b>en küçük ortak kat</b> (EKOK) denir.", ornek: "4'ün katları: 4, 8, 12, 16, 20, 24… 6'nın katları: 6, 12, 18, 24… Ortak katlar: 12, 24… EKOK = 12.",
        durak: { soru: "6 ve 8'in en küçük ortak katı kaçtır?", secenekler: [["24", true, "6: 6, 12, 18, 24 · 8: 8, 16, 24 → ilk ortak kat 24."], ["48", false, "48 bir ortak kattır ama en küçüğü değildir."], ["2", false, "2, ortak bölendir; ortak kat değil."], ["14", false, "Sayıları toplamak ortak katı vermez."]] } },
      { baslik: "Ne zaman ortak kat?", metin: "“<b>Birlikte tekrar</b> ne zaman?”, “<b>en az kaç</b>?”, “<b>en küçük kare</b>?” gibi sorular genellikle ortak kat ister.", ornek: "Lambalardan biri 6 dk, diğeri 9 dk'da bir yanıyorsa birlikte yandıktan 18 dk sonra yine birlikte yanar (EKOK).",
        durak: { soru: "Biri 4, diğeri 10 günde bir nöbet tutan iki öğretmen bugün birlikte nöbetçi. En az kaç gün sonra yine birlikte nöbet tutarlar?", secenekler: [["20", true, "EKOK(4, 10) = 20."], ["40", false, "4 × 10 bir ortak kattır ama en küçüğü değildir."], ["2", false, "Bu ortak bölendir; soru “birlikte tekrar ne zaman” diye ortak kat istiyor."], ["14", false, "Sayıları toplamak bu soruda işe yaramaz."]] } },
    ],
    uret: {
      "okat.ekok": [
        z => { const [a, b] = sec([[4, 6], [6, 8], [6, 9], [8, 12], [10, 15], [9, 12], [12, 18], [4, 10], [15, 20], [12, 16], [14, 21], [6, 15]]); const e = ekok(a, b);
          return S({ kaz: "okat.ekok", duzey: "uygulama", zorluk: 1, soru: `${a} ve ${b} sayılarının en küçük ortak katı kaçtır?`, dogru: e, dogruNeden: `${e}, hem ${a}${ek(a, "e")} hem ${b}${ek(b, "e")} kalansız bölünen en küçük sayıdır.`,
            yanlis: [[a * b, "strateji", "Sayıları çarpmak her zaman ortak kat verir ama en küçüğünü vermeyebilir."], [ebob(a, b), "kavrama", "Bu en büyük ortak bölendir; ortak katla karıştırdın."], [e * 2, "dikkat", "Bu bir ortak kattır ama en küçüğü değildir."]],
            ipucu: "Büyük sayının katlarını sırayla yaz; küçük sayıya bölünen ilkini bul.", cozum: [`🔎 Soruyu anlayalım: ${a} ve ${b} sayılarının ikisinin de katı olan en küçük sayıyı (EKOK) arıyoruz.`,
              "💡 Hatırlayalım: Büyük sayının katlarını sırayla yazar, küçük sayıya kalansız bölünen ilkini buluruz.",
              `✏️ ${b}${ek(b, "in")} katları: ${Array.from({ length: e / b + 1 }, (_, i) => b * (i + 1)).join(", ")}, …`,
              `✏️ Sırayla ${a}${ek(a, "e")} bölelim: kalansız bölünen ilk kat ${e} (${e} ÷ ${a} = ${e / a}).`,
              `✅ Sonuç: EKOK(${a}, ${b}) = ${e}.`,
              `🔁 Kontrol edelim: ${e} ÷ ${a} = ${e / a} ve ${e} ÷ ${b} = ${e / b}; ikisi de kalansız. ${a} × ${b} = ${a * b} de bir ortak kattır ama ${a * b === e ? "bu soruda EKOK'a eşittir" : "en küçüğü değildir"}.`] }); },
        z => { const [a, b] = sec([[4, 6], [6, 8], [3, 5], [4, 10], [6, 9]]); const s = R(1, 30), t = s + R(40, 70); let n = 0; for (let x = s + 1; x < t; x++) if (x % a === 0 && x % b === 0) n++;
          return S({ kaz: "okat.ekok", duzey: "baglanti", zorluk: 3, soru: `${s} ile ${t} arasında hem ${a} sayısının hem de ${b} sayısının katı olan kaç sayı vardır?`, dogru: n, dogruNeden: `Ortak katlar ${ekok(a, b)}${ek(ekok(a, b), "in")} katlarıdır; aralıkta bunlardan ${n} tane vardır.`,
            yanlis: [[n + 1, "dikkat", "Aralığın dışında kalan bir sayıyı saymış olabilirsin."], [Math.floor((t - s) / (a * b)), "strateji", `Ortak katlar ${ekok(a, b)}${ek(ekok(a, b), "in")} katlarıdır; ${a * b}${ek(a * b, "in")} değil.`], [n + 2, "islem", "Ortak katları tek tek yazarak say."]],
            ipucu: `Ortak katlar, EKOK(${a}, ${b}) = ${ekok(a, b)} sayısının katlarıdır.`, cozum: [`🔎 Soruyu anlayalım: ${s} ile ${t} arasında hem ${a}${ek(a, "in")} hem ${b}${ek(b, "in")} katı olan sayıları sayacağız.`,
              "💡 Hatırlayalım: İki sayının ortak katları, EKOK'larının katlarıdır.",
              `✏️ EKOK(${a}, ${b}) = ${ekok(a, b)}.`,
              `✏️ ${s} ile ${t} arasındaki ${ekok(a, b)} katları: ${[...Array(t - s - 1).keys()].map(x => x + s + 1).filter(x => x % ekok(a, b) === 0).join(", ") || "yok"}.`,
              `✅ Sonuç: Böyle ${n} sayı vardır.`,
              `🔁 Kontrol edelim: Bulduğun her sayıyı ${a}${ek(a, "e")} ve ${b}${ek(b, "e")} böl; kalan 0 olmalı. “Arasında” dendiği için ${s} ve ${t} sayılmaz.`] }); },
      ],
      "okat.problem": [
        z => { const [a, b] = sec([[6, 8], [10, 15], [12, 18], [15, 20], [9, 12], [20, 30]]); const e = ekok(a, b);
          return S({ kaz: "okat.problem", duzey: "transfer", zorluk: 2, soru: `Bir parkta lambalardan biri ${a} dakikada bir, diğeri ${b} dakikada bir yanıyor. İki lamba birlikte yandıktan en az kaç dakika sonra yine birlikte yanar?`, dogru: e, birim: "", dogruNeden: `${e}, ${a} ve ${b} sayılarının en küçük ortak katıdır; lambalar ilk kez ${e}. dakikada yine birlikte yanar.`,
            yanlis: [[a * b === e ? e * 2 : a * b, "strateji", "Çarpım bir ortak kattır ama en az süre değildir."], [ebob(a, b), "kavrama", "“Birlikte tekrar” sorusu ortak kat ister; ortak bölen bulmuşsun."], [a + b, "kavrama", "Süreleri toplamak birlikte yanma anını vermez."]],
            ipucu: "“Birlikte tekrar ne zaman?” sorusu hangi kavramı ister?", cozum: [`🔎 Soruyu anlayalım: ${a} ve ${b} dakikada bir yanan iki lamba birlikte yandıktan sonra ilk kez ne zaman yine birlikte yanar?`,
              "💡 Hatırlayalım: “Birlikte tekrar ne zaman?” sorusu ortak kat, “en az” sözü en küçük ortak kat (EKOK) ister.",
              `✏️ ${b} dakikalık lambanın yandığı anlar: ${[1, 2, 3, 4].map(i => b * i).join(", ")}, … dakika.`,
              `✏️ Bunlardan ${a}${ek(a, "e")} kalansız bölünen ilki: ${e}.`,
              `✅ Sonuç: Lambalar en az ${e} dakika sonra yine birlikte yanar.`,
              `🔁 Kontrol edelim: ${e} ÷ ${a} = ${e / a} ve ${e} ÷ ${b} = ${e / b}; ikisi de tam sayı. Daha küçük bir ortak kat yok.`] }); },
        z => { const [a, b] = sec([[3, 4], [4, 5], [4, 6], [5, 6], [3, 5]]); const k = R(1, Math.min(a, b) - 1); const e = ekok(a, b);
          return S({ kaz: "okat.problem", duzey: "transfer", zorluk: 3, soru: `Bir sınıftaki öğrenciler ${a}${ek(a, "er")}${a === 6 ? "lı" : "li"} ve ${b}${ek(b, "er")}${b === 6 ? "lı" : "li"} gruplara ayrıldığında her seferinde ${k} öğrenci açıkta kalıyor. Sınıfta ${k} kişiden fazla öğrenci olduğuna göre en az kaç öğrenci vardır?`, dogru: e + k, dogruNeden: `${e + k} − ${k} = ${e} hem ${a}${ek(a, "in")} hem ${b}${ek(b, "in")} katıdır ve bu özellikteki en küçük sayıdır.`,
            yanlis: [[e, "dikkat", `Açıkta kalan ${k} öğrenciyi eklemeyi unuttun.`], [e - k, "kavrama", "Kalan öğrenciler çıkarılmaz, eklenir."], [a * b + k === e + k ? e * 2 + k : a * b + k, "strateji", "En küçük ortak katı kullanmalısın."]],
            ipucu: `Öğrenci sayısının ${k} eksiği hem ${a}${ek(a, "in")} hem ${b}${ek(b, "in")} katı olmalı.`, cozum: [`🔎 Soruyu anlayalım: ${a}${ek(a, "er")}${a === 6 ? "lı" : "li"} ve ${b}${ek(b, "er")}${b === 6 ? "lı" : "li"} gruplarda hep ${k} öğrenci açıkta kalıyor. Sınıfta en az kaç öğrenci var?`,
              `💡 Hatırlayalım: Açıkta kalanları ayırırsak geri kalanlar iki gruplamaya da tam uyar; yani (öğrenci sayısı − ${k}) bir ortak kattır.`,
              `✏️ EKOK(${a}, ${b}) = ${e}.`,
              `✏️ Öğrenci sayısı − ${k} = ${e} → öğrenci sayısı = ${e} + ${k}.`,
              `✅ Sonuç: Sınıfta en az ${e + k} öğrenci vardır.`,
              `🔁 Kontrol edelim: ${e + k} ÷ ${a} = ${Math.floor((e + k) / a)}, kalan ${(e + k) % a}; ${e + k} ÷ ${b} = ${Math.floor((e + k) / b)}, kalan ${(e + k) % b}. İki bölmede de kalan ${k}.`] }); },
      ],
    },
  });

  konu({
    id: "ortakbolen", tema: "t1", ad: "Ortak Bölen", onKosul: ["carpan", "asal"],
    kazanimlar: [{ id: "obol.ebob", ad: "En büyük ortak böleni bulma" }, { id: "obol.problem", ad: "Ortak bölen problemleri" }, { id: "obol.ayirt", ad: "Ortak kat ile ortak böleni ayırt etme" }],
    anlatim: [
      { baslik: "Ortak bölen", metin: "İki sayıyı da kalansız bölen sayılara <b>ortak bölen</b> denir. En büyüğüne <b>en büyük ortak bölen</b> (EBOB) denir.", ornek: "12'nin bölenleri: 1, 2, 3, 4, 6, 12. 18'in bölenleri: 1, 2, 3, 6, 9, 18. Ortak bölenler: 1, 2, 3, 6 → EBOB = 6.",
        durak: { soru: "24 ve 36'nın en büyük ortak böleni kaçtır?", secenekler: [["12", true, "24 ve 36'yı kalansız bölen en büyük sayı 12."], ["72", false, "72 ortak kattır (EKOK); ortak bölen değildir."], ["6", false, "6 bir ortak bölendir ama en büyüğü değildir."], ["4", false, "4 ortak bölen ama daha büyükleri var."]] } },
      { baslik: "Kat mı, bölen mi?", metin: "“<b>Eşit parçalara böl</b>, <b>en büyük</b> parça, <b>en az</b> paket” → genellikle <b>ortak bölen</b>. “<b>Birlikte tekrar</b>, en küçük kare” → <b>ortak kat</b>.", ornek: "24 m ve 36 m'lik iki ip, en uzun eşit parçalara ayrılacak → EBOB(24, 36) = 12 m.",
        durak: { soru: "18 kırmızı ve 24 mavi bilye, her pakette tek renk ve eşit sayıda olacak şekilde en az kaç pakete konur?", secenekler: [["7", true, "EBOB = 6 bilyelik paketler: 18/6 + 24/6 = 3 + 4 = 7 paket."], ["6", false, "6 paket başına bilye sayısıdır; paket sayısı değil."], ["72", false, "Bu soru ortak kat değil ortak bölen ister."], ["42", false, "Bu toplam bilye sayısıdır."]] } },
    ],
    uret: {
      "obol.ebob": [
        z => { const [a, b] = sec([[12, 18], [16, 24], [18, 30], [20, 30], [24, 36], [30, 45], [28, 42], [36, 48], [40, 60], [32, 48], [45, 60], [54, 72]]); const g = ebob(a, b);
          return S({ kaz: "obol.ebob", duzey: "uygulama", zorluk: 1, soru: `${a} ve ${b} sayılarının en büyük ortak böleni kaçtır?`, dogru: g, dogruNeden: `${g}, hem ${a}${ek(a, "i")} hem ${b}${ek(b, "i")} kalansız bölen en büyük sayıdır.`,
            yanlis: [[ekok(a, b), "kavrama", "Bu en küçük ortak kattır; ortak bölenle karıştırdın."], [Math.max(...bolenler(g).filter(x => x < g)), "dikkat", "Bu da bir ortak bölendir ama en büyüğü değil; daha büyük bir ortak bölen var."], [Math.max(...bolenler(a).filter(x => b % x)), "dikkat", "Bu sayı yalnızca birini bölüyor; ortak bölen iki sayıyı da kalansız bölmeli."]],
            ipucu: "Küçük sayının bölenlerini büyükten küçüğe dene.", cozum: [`🔎 Soruyu anlayalım: ${a} ve ${b} sayılarını kalansız bölen en büyük sayıyı (EBOB) arıyoruz.`,
              "💡 Hatırlayalım: Ortak bölen iki sayıyı da kalansız böler; en büyüğü EBOB'dur ve küçük sayıdan büyük olamaz.",
              `✏️ ${a}${ek(a, "in")} bölenleri: ${bolenler(a).join(", ")}.`,
              `✏️ Bunları büyükten küçüğe deneyelim: ${b}${ek(b, "i")} de kalansız bölen ilk sayı ${g}.`,
              `✅ Sonuç: EBOB(${a}, ${b}) = ${g}.`,
              `🔁 Kontrol edelim: ${a} ÷ ${g} = ${a / g} ve ${b} ÷ ${g} = ${b / g}. Bu iki bölümün 1'den başka ortak böleni yok; demek ki ${g} gerçekten en büyük.`] }); },
      ],
      "obol.problem": [
        z => { const [a, b] = sec([[36, 48], [24, 40], [30, 42], [45, 60], [54, 72], [60, 84]]); const g = ebob(a, b);
          return S({ kaz: "obol.problem", duzey: "transfer", zorluk: 2, soru: `${a} m ve ${b} m uzunluğundaki iki ip, hiç artmayacak şekilde eşit uzunlukta parçalara ayrılacak. Parçalar mümkün olan en uzun boyda olursa toplam kaç parça elde edilir?`, dogru: (a + b) / g, dogruNeden: `En uzun parça EBOB(${a}, ${b}) = ${g} m; ${a / g} + ${b / g} = ${(a + b) / g} parça çıkar.`,
            yanlis: [[g, "dikkat", "Bu bir parçanın uzunluğudur; soru parça sayısını istiyor."], [(a + b) / (g / 2), "strateji", "Daha kısa parçalar kullandın; en uzun parça EBOB'dur."], [ekok(a, b), "kavrama", "“Eşit parçalara ayırma” ortak bölen ister."]],
            ipucu: "Önce en uzun parça boyunu (EBOB) bul, sonra parça sayısını hesapla.", cozum: [`🔎 Soruyu anlayalım: ${a} m ve ${b} m'lik ipler artmadan, eşit ve en uzun parçalara kesilecek; toplam parça sayısını arıyoruz.`,
              "💡 Hatırlayalım: “Eşit parçalara ayır, en uzun parça” ifadesi en büyük ortak böleni (EBOB) ister.",
              `✏️ En uzun parça: EBOB(${a}, ${b}) = ${g} m.`,
              `✏️ Birinci ipten ${a} ÷ ${g} = ${a / g} parça, ikinci ipten ${b} ÷ ${g} = ${b / g} parça çıkar.`,
              `✅ Sonuç: Toplam ${a / g} + ${b / g} = ${(a + b) / g} parça elde edilir.`,
              `🔁 Kontrol edelim: ${(a + b) / g} parça × ${g} m = ${a + b} m; iplerin toplamı da ${a} + ${b} = ${a + b} m. Hiç ip artmadı.`] }); },
        z => { const [a, b] = sec([[12, 18], [24, 36], [20, 28], [36, 60], [30, 42]]); const g = ebob(a, b);
          return S({ kaz: "obol.problem", duzey: "transfer", zorluk: 3, soru: `Boyutları ${a} m ve ${b} m olan dikdörtgen bir bahçe, hiç boşluk kalmadan eş karelere bölünecek. Kareler mümkün olan en büyük boyutta olursa kaç kare oluşur?`, dogru: (a / g) * (b / g), dogruNeden: `Kare kenarı EBOB(${a}, ${b}) = ${g} m; ${a / g} × ${b / g} = ${(a / g) * (b / g)} kare sığar.`,
            yanlis: [[g, "dikkat", "Bu karenin kenar uzunluğu; soru kare sayısını istiyor."], [a / g + b / g, "islem", "Kare sayısı için satır ve sütun sayısı çarpılmalı, toplanmamalı."], [(a * b) / 4, "strateji", "En büyük kare EBOB ile bulunur."]],
            ipucu: "Karenin kenarı iki kenarı da tam bölmeli ve en büyük olmalı.", cozum: [`🔎 Soruyu anlayalım: ${a} m × ${b} m'lik bahçe boşluksuz, eş ve en büyük karelere bölünecek; kaç kare oluşacağını arıyoruz.`,
              "💡 Hatırlayalım: Karenin kenarı iki kenarı da tam bölmeli ve en büyük olmalı → EBOB.",
              `✏️ Kare kenarı = EBOB(${a}, ${b}) = ${g} m.`,
              `✏️ Bir kenar boyunca ${a} ÷ ${g} = ${a / g} sıra, diğer kenar boyunca ${b} ÷ ${g} = ${b / g} sütun kare dizilir.`,
              `✅ Sonuç: ${a / g} × ${b / g} = ${(a / g) * (b / g)} kare oluşur.`,
              `🔁 Kontrol edelim: Alanlar tutmalı: ${(a / g) * (b / g)} × ${g * g} m² = ${a * b} m² ve bahçe ${a} × ${b} = ${a * b} m². Tutuyor!`] }); },
      ],
      "obol.ayirt": [
        z => { const o = sec([
            ["Bir fabrikada 48 ve 60 litrelik iki tank, hiç artmayacak şekilde eşit ve en büyük hacimli bidonlara boşaltılacak.", "Ortak bölen (EBOB)", "“Eşit ve en büyük parçalara ayırma” ortak bölen ister."],
            ["Biri 8, diğeri 12 günde bir sulanan iki çiçek bugün birlikte sulandı. Yine birlikte ne zaman sulanır?", "Ortak kat (EKOK)", "“Birlikte tekrar ne zaman” ortak kat ister."],
            ["Kenarları 6 cm ve 9 cm olan kartonlar yan yana dizilerek en küçük kare oluşturulacak.", "Ortak kat (EKOK)", "Kartonlar dizildikçe kenar uzar; en küçük kare ortak kat ister."],
            ["30 kalem ve 45 silgi, eşit sayıda olacak şekilde en çok kaç öğrenciye dağıtılır?", "Ortak bölen (EBOB)", "Eşit paylaştırma ve “en çok kişi” ortak bölen ister."]]);
          return S({ kaz: "obol.ayirt", duzey: "aciklama", zorluk: 2, soru: `“${o[0]}” Bu problemi çözmek için hangi kavram kullanılır?`, dogru: o[1], dogruNeden: o[2],
            yanlis: [[o[1].startsWith("Ortak bölen") ? "Ortak kat (EKOK)" : "Ortak bölen (EBOB)", "kavrama", "İki kavramı karıştırdın: " + o[2]], ["Asal çarpanların toplamı", "kavrama", "Bu problem bir ortak kat ya da ortak bölen ister."], ["Sayıların farkı", "bilgi", "Farkı almak bu tür problemleri çözmez."]],
            ipucu: "Büyüyen bir şey mi arıyorsun (kat), yoksa parçalara mı bölüyorsun (bölen)?", cozum: ["🔎 Soruyu anlayalım: Problemi çözmek için ortak kat mı, ortak bölen mi gerektiğine karar vereceğiz.",
              "💡 Hatırlayalım: “Eşit parçalara ayırma, en büyük parça, en çok kişiye dağıtma” → ortak bölen (EBOB); “birlikte tekrar, en az süre, en küçük kare” → ortak kat (EKOK).",
              `✏️ Problemdeki durum: ${o[0]}`,
              `✏️ ${o[2]}`,
              `✅ Sonuç: Bu problemde ${o[1]} kullanılır.`,
              "🔁 Kontrol edelim: Kendine sor: Aradığım sayı verilen sayılardan büyük mü (kat), küçük mü (bölen)?"] }); },
      ],
    },
  });

  /* ============================== TEMA 2 ============================== */
  konu({
    id: "olasilik", tema: "t2", ad: "Gözleme Dayalı Olasılık",
    kazanimlar: [{ id: "ol.tahmin", ad: "Deney sonuçlarından olasılık tahmini" }, { id: "ol.kavram", ad: "Kesin, imkânsız, eşit olasılık kavramları" }, { id: "ol.yorum", ad: "Tahmini yeni durumlara uygulama" }],
    anlatim: [
      { baslik: "Olasılık nedir?", metin: "Olasılık bir olayın <b>olma şansını</b> 0 ile 1 arasında bir sayıyla gösterir. 0 → <b>imkânsız</b>, 1 → <b>kesin</b>.", ornek: "Güneşin doğudan doğması kesindir (1). Bir zarda 7 gelmesi imkânsızdır (0).",
        durak: { soru: "Bir torbada yalnızca mavi bilyeler var. Torbadan kırmızı bilye çekme olasılığı kaçtır?", secenekler: [["0", true, "Torbada kırmızı bilye yok; olay imkânsızdır."], ["1", false, "1 kesin olaylar içindir; mavi bilye çekme olasılığı 1'dir."], ["1/2", false, "İki renk olsaydı bu düşünülebilirdi; ama kırmızı hiç yok."], ["Bilinemez", false, "İçerik bilindiği için olasılık hesaplanabilir."]] } },
      { baslik: "Gözleme dayalı tahmin", metin: "Bir deneyi çok kez yapıp sonucu sayarız: <b>olayın gerçekleşme sayısı ÷ toplam deneme sayısı</b> bize olasılığın tahminini verir.", ornek: "Bir rakip 40 penaltının 30'unu gole çevirdiyse gol atma olasılığı yaklaşık 30/40 = 3/4.",
        durak: { soru: "Bir zar 60 kez atıldı ve 6 sayısı 12 kez geldi. Gözleme dayalı olasılık tahmini nedir?", secenekler: [["1/5", true, "12/60 = 1/5."], ["1/6", false, "Bu teorik olasılıktır; soru gözleme dayalı tahmini istiyor."], ["12", false, "Bu, olayın kaç kez gerçekleştiğidir; olasılık bir orandır."], ["4/5", false, "Bu 6 gelmeme tahminidir."]] } },
      { baslik: "Deney sayısı arttıkça", metin: "Deneme sayısı arttıkça gözleme dayalı olasılık genellikle <b>teorik olasılığa yaklaşır</b>. Az denemeyle yapılan tahmin yanıltıcı olabilir.", ornek: "Para 10 kez atılınca 7 yazı gelebilir; 1000 kez atılınca yazı oranı 1/2'ye yaklaşır.",
        durak: { soru: "Hangisi daha güvenilir bir tahmin verir?", secenekler: [["Deneyi 500 kez yapmak", true, "Deneme sayısı arttıkça tahmin gerçeğe yaklaşır."], ["Deneyi 5 kez yapmak", false, "Az deneme rastlantıya çok açıktır."], ["Hiç deney yapmadan tahmin etmek", false, "Gözleme dayalı tahmin için deney gerekir."], ["Fark etmez", false, "Deneme sayısı tahminin güvenilirliğini etkiler."]] } },
    ],
    uret: {
      "ol.tahmin": [
        z => { const n = sec([20, 40, 50, 60, 80, 100]); const k = R(Math.ceil(n / 10), Math.floor(n * 0.6)); const g = ebob(k, n);
          return S({ kaz: "ol.tahmin", duzey: "uygulama", zorluk: 1, soru: `Bir torbadan bilye çekip geri bırakma deneyi ${n} kez yapıldı ve ${k} kez kırmızı bilye geldi. Kırmızı bilye çekme olasılığının gözleme dayalı tahmini nedir?`, dogru: kesir(k, n),
            dogruNeden: `Kırmızı ${k} kez geldi, toplam ${n} deneme yapıldı: ${k}/${n} = ${kesir(k, n)}.`,
            yanlis: [[kesir(n - k, n), "dikkat", "Bu, kırmızı gelmeme olasılığının tahminidir; soru kırmızı gelmesini soruyor."], [String(k), "kavrama", "Bu, kırmızının kaç kez geldiğidir. Olasılık bir orandır: gerçekleşme sayısı ÷ toplam deneme."], [kesir(k, n - k), "kavrama", "Kırmızıları diğer renklere böldün; toplam deneme sayısına bölmelisin."]],
            ipucu: "Olasılık tahmini = olayın gerçekleşme sayısı ÷ toplam deneme sayısı.", cozum: [`🔎 Soruyu anlayalım: Deney ${n} kez yapılmış ve kırmızı ${k} kez gelmiş. Kırmızı çekme olasılığını tahmin edeceğiz.`,
              "💡 Hatırlayalım: Gözleme dayalı olasılık = olayın gerçekleşme sayısı ÷ toplam deneme sayısı.",
              `✏️ Gerçekleşme sayısı ${k}, toplam deneme ${n}. Oranı yazalım: ${k}/${n}.`,
              g > 1 ? `✏️ Sadeleştirelim: pay ve paydayı ${g}${ek(g, "e")} bölersek ${k}/${n} = ${kesir(k, n)}.` : `✏️ ${k} ile ${n} sayısının 1'den başka ortak böleni yok; kesir zaten en sade hâlinde.`,
              `✅ Sonuç: Kırmızı bilye çekme olasılığının tahmini ${kesir(k, n)}.`,
              `🔁 Kontrol edelim: Olasılık 0 ile 1 arasında olmalı; ${kesir(k, n)} bu aralıkta. Kırmızı gelmeme tahmini ${kesir(n - k, n)}; ikisinin toplamı 1 eder.`] }); },
        z => { const k = [R(8, 20), R(8, 20), R(8, 20)]; const t = k[0] + k[1] + k[2]; const renk = ["Kırmızı", "Mavi", "Yeşil"]; const i = R(0, 2);
          return S({ kaz: "ol.tahmin", duzey: "uygulama", zorluk: 2, soru: `Bir torbadan çekilip geri bırakılan bilyelerin renkleri kaydedildi: Kırmızı ${k[0]}, Mavi ${k[1]}, Yeşil ${k[2]} kez. ${renk[i]} bilye çekme olasılığının tahmini nedir?`, dogru: kesir(k[i], t),
            dogruNeden: `Toplam ${t} çekilişin ${k[i]} tanesi ${renk[i].toLocaleLowerCase("tr-TR")}: ${k[i]}/${t} = ${kesir(k[i], t)}.`,
            yanlis: [[kesir(k[i], k[(i + 1) % 3] + k[(i + 2) % 3]), "kavrama", "Diğer renklerin toplamına böldün; toplam deneme sayısına bölmelisin."], ["1/3", "kavrama", "Üç renk var diye olasılıklar eşit olmaz; gözlem sonuçlarını kullanmalısın."], [kesir(k[(i + 1) % 3], t), "dikkat", "Başka bir rengin tahminini hesapladın; soruda hangi rengin sorulduğuna yeniden bak."]],
            ipucu: "Önce toplam deneme sayısını bul.", cozum: [`🔎 Soruyu anlayalım: Üç rengin kaç kez geldiği verilmiş. ${renk[i]} bilye çekme olasılığını tahmin edeceğiz.`,
              "💡 Hatırlayalım: Tahmin = istenen rengin gelme sayısı ÷ toplam çekiliş sayısı.",
              `✏️ Toplam çekiliş: ${k.join(" + ")} = ${t}.`,
              `✏️ ${renk[i]} ${k[i]} kez gelmiş: ${k[i]}/${t}.`,
              `✅ Sonuç: Tahmin ${kesir(k[i], t)}.`,
              `🔁 Kontrol edelim: Üç rengin tahminlerini toplarsak ${k[0]}/${t} + ${k[1]}/${t} + ${k[2]}/${t} = ${t}/${t} = 1 olur. Payda hep toplam deneme sayısıdır.`] }); },
      ],
      "ol.kavram": [
        z => { const o = sec([
            ["Bir zarı attığımızda 7 gelmesi", "İmkânsız", "Zarda 7 yoktur; bu olay hiç gerçekleşmez, olasılığı 0'dır."], ["Bir zarı attığımızda 6'dan küçük ya da 6'ya eşit bir sayı gelmesi", "Kesin", "Zarın her yüzü 6 ya da daha küçüktür; bu olay her atışta gerçekleşir, olasılığı 1'dir."],
            ["Madenî parayı attığımızda yazı gelmesi", "Eşit olasılıklı (1/2)", "Paranın iki yüzü vardır; yazı ve tura gelme şansı eşittir."], ["Ocak ayından sonra şubat ayının gelmesi", "Kesin", "Takvimde ocaktan sonra her zaman şubat gelir; olasılığı 1'dir."]]);
          return S({ kaz: "ol.kavram", duzey: "hatirlama", zorluk: 1, soru: `“${o[0]}” olayı nasıl bir olaydır?`, dogru: o[1], dogruNeden: o[2],
            yanlis: [["İmkânsız", "kavrama", "Bu olay gerçekleşebilir; imkânsız olay hiç gerçekleşmeyen olaydır."], ["Kesin", "kavrama", "Bu olay her zaman gerçekleşmez; kesin olay her denemede gerçekleşir."], ["Eşit olasılıklı (1/2)", "kavrama", "Bu olayda iki sonucun şansı yarı yarıya değil."], ["Olasılığı 2'dir", "bilgi", "Olasılık 0 ile 1 arasında bir sayıdır; 2 olamaz."]].filter(x => x[0] !== o[1]),
            ipucu: "Olasılık 0 → imkânsız, 1 → kesin.", cozum: [`🔎 Soruyu anlayalım: “${o[0]}” olayının imkânsız mı, kesin mi, yoksa eşit olasılıklı mı olduğunu bulacağız.`,
              "💡 Hatırlayalım: Hiç gerçekleşmeyen olay imkânsızdır (0); her zaman gerçekleşen olay kesindir (1); iki sonucun şansı eşitse olasılık 1/2'dir.",
              "✏️ Kendimize soralım: Bu olay hiç olmayabilir mi, her zaman mı olur, yoksa yarı yarıya mı?",
              `✏️ ${o[2]}`,
              `✅ Sonuç: Bu olay “${o[1]}” bir olaydır.`,
              "🔁 Kontrol edelim: Olasılık hiçbir zaman 0'dan küçük ya da 1'den büyük olamaz. “Olasılığı 2” gibi bir seçenek her zaman yanlıştır."] }); },
        z => S({ kaz: "ol.kavram", duzey: "aciklama", zorluk: 2, soru: "Gözleme dayalı olasılıkla ilgili hangisi doğrudur?", dogru: "Deneme sayısı arttıkça tahmin teorik olasılığa yaklaşır.",
          dogruNeden: "Çok sayıda denemede rastlantısal sapmalar dengelenir; bu yüzden tahmin teorik olasılığa yaklaşır.",
          yanlis: [["Deney az yapılırsa tahmin daha doğru olur.", "kavrama", "Az deneme rastlantıya açıktır; tahmin yanıltıcı olabilir."], ["Gözleme dayalı olasılık 1'den büyük olabilir.", "bilgi", "Gerçekleşme sayısı deneme sayısını geçemez; bu yüzden olasılık en fazla 1 olur."], ["Her deneyde aynı sonuç çıkar.", "kavrama", "Deney sonuçları rastlantısaldır; her seferinde farklı çıkabilir."]],
          ipucu: "Parayı 10 kez ve 1000 kez attığını düşün.", cozum: ["🔎 Soruyu anlayalım: Gözleme dayalı olasılıkla ilgili dört cümleden doğru olanı seçeceğiz.",
            "💡 Hatırlayalım: Gözleme dayalı olasılık, deney sonuçlarından hesaplanan bir tahmindir ve değeri 0 ile 1 arasındadır.",
            "✏️ Bir örnek düşünelim: Bir parayı 10 kez atınca 7 yazı gelebilir (7/10). 1000 kez atınca yazı oranı 1/2'ye çok yaklaşır.",
            "✏️ Diğer cümleleri sınayalım: Az deneme yanıltabilir; gerçekleşme sayısı deneme sayısını geçemeyeceği için olasılık 1'i aşamaz; deney sonuçları her seferinde aynı olmaz.",
            "✅ Sonuç: “Deneme sayısı arttıkça tahmin teorik olasılığa yaklaşır.” cümlesi doğrudur.",
            "🔁 Kontrol edelim: Bir tahmine güvenmeden önce “Kaç deneme yapılmış?” diye sor. Deneme çoksa tahmin daha güvenilirdir."] }),
      ],
      "ol.yorum": [
        z => { const n = sec([20, 40, 50]); const k = R(Math.floor(n / 2), n - 2); const yeni = sec([100, 200, 400].filter(y => y % n === 0)); const kat = yeni / n; const tahmin = k * kat;
          return S({ kaz: "ol.yorum", duzey: "transfer", zorluk: 3, soru: `Bir basketbolcu son ${n} serbest atışın ${k}${ek(k, "ini")} sokmuş. Aynı başarıyla ${yeni} atış yaparsa kaç basket atması beklenir?`, dogru: tahmin,
            dogruNeden: `Başarı oranı ${kesir(k, n)}; ${yeni} atışta ${yeni} × ${kesir(k, n)} = ${tahmin} basket beklenir.`,
            yanlis: [[k, "dikkat", "Bu eski atışlardaki basket sayısı; yeni atış sayısına göre büyütmelisin."], [yeni - tahmin, "dikkat", "Bu, kaçırılması beklenen atış sayısıdır; soru basketleri soruyor."], [yeni / 2, "kavrama", "Başarı oranı 1/2 değil; gözlenen oranı kullanmalısın."]],
            ipucu: `Önce başarı oranını bul: ${k}/${n}. Sonra bunu ${yeni} atışa uygula.`, cozum: [`🔎 Soruyu anlayalım: Oyuncu ${n} atışın ${k}${ek(k, "ini")} sokmuş. Aynı başarıyla ${yeni} atışta kaç basket beklenir?`,
              "💡 Hatırlayalım: Beklenen sonuç sayısı ≈ olasılık tahmini × yeni deneme sayısı.",
              `✏️ Olasılık tahmini: ${k}/${n}${kesir(k, n) !== k + "/" + n ? " = " + kesir(k, n) : ""}.`,
              `✏️ ${yeni} atış, ${n} atışın ${kat} katıdır. Basket sayısı da ${kat} katına çıkar: ${k} × ${kat} = ${tahmin}.`,
              `✅ Sonuç: ${tahmin} basket atması beklenir.`,
              `🔁 Kontrol edelim: ${tahmin}/${yeni} sadeleşince yine ${kesir(k, n)} olur; oran korunmuş. Unutma, bu bir beklentidir; gerçek sonuç biraz farklı çıkabilir.`] }); },
        z => { const d = [R(5, 15), R(5, 15), R(5, 15), R(5, 15)]; const ad = ["Kırmızı", "Mavi", "Sarı", "Yeşil"]; const mx = Math.max(...d); if (d.filter(x => x === mx).length > 1) return null; const i = d.indexOf(mx); const top = d.reduce((a, b) => a + b, 0);
          return S({ kaz: "ol.yorum", duzey: "uygulama", zorluk: 2, soru: `Dört renkli bir çark ${top} kez çevrildi: ${ad.map((a, j) => a + " " + d[j]).join(", ")}. Gözlemlere göre bir sonraki çevirişte en olası renk hangisidir?`, dogru: ad[i],
            dogruNeden: `${ad[i]} en çok (${mx} kez) gelmiştir; tahmini olasılığı ${kesir(mx, top)} ile en büyüktür.`,
            yanlis: ad.filter((_, j) => j !== i).map(a => [a, "dikkat", `${a} daha az gelmiş; en çok gelen renk en olası tahmindir.`]),
            ipucu: "En çok gözlenen sonuç, en olası tahmindir.", cozum: [`🔎 Soruyu anlayalım: Çark ${top} kez çevrilmiş. Bir sonraki çevirişte gelme olasılığı en yüksek görünen rengi arıyoruz.`,
              "💡 Hatırlayalım: Gözleme dayalı olasılıkta en çok gerçekleşen sonucun tahmini olasılığı en büyüktür.",
              `✏️ Sonuçları karşılaştıralım: ${ad.map((a, j) => a + " " + d[j]).join(", ")}.`,
              `✏️ En büyük sayı ${mx}; bu ${ad[i]} renge ait. Tahmini olasılığı ${mx}/${top}${kesir(mx, top) !== mx + "/" + top ? " = " + kesir(mx, top) : ""}.`,
              `✅ Sonuç: En olası renk ${ad[i]}.`,
              "🔁 Kontrol edelim: Diğer renklerin tahminlerinde payda aynı, pay daha küçük; yani olasılıkları daha düşük. Ama “kesin gelir” diyemeyiz; yalnızca en olası tahmindir."] }); },
      ],
    },
  });

  /* ============================== TEMA 3 ============================== */
  konu({
    id: "basamak", tema: "t3", ad: "Ondalık Gösterimlerde Basamak Değeri",
    kazanimlar: [{ id: "bas.deger", ad: "Basamak değerini belirleme" }, { id: "bas.ad", ad: "Basamak adlarını bilme" }, { id: "bas.cozumle", ad: "Ondalık gösterimi çözümleme" }],
    anlatim: [
      { baslik: "Virgülün sağı", metin: "Virgülün sağındaki basamaklar: <b>onda birler</b> (0,1), <b>yüzde birler</b> (0,01), <b>binde birler</b> (0,001).", ornek: "4,356 → 4 birler, 3 onda birler (0,3), 5 yüzde birler (0,05), 6 binde birler (0,006).",
        durak: { soru: "27,481 sayısında 8 hangi basamaktadır?", secenekler: [["Yüzde birler", true, "Virgülden sonra 1. basamak onda birler (4), 2. basamak yüzde birler (8)."], ["Onda birler", false, "Onda birler basamağında 4 var."], ["Onlar", false, "Onlar basamağı virgülün solundadır (2)."], ["Binde birler", false, "Binde birler basamağında 1 var."]] } },
      { baslik: "Sayı değeri ve basamak değeri", metin: "Rakamın kendisi <b>sayı değeri</b>dir. Bulunduğu basamağa göre değeri <b>basamak değeri</b>dir.", ornek: "5,73 sayısında 7'nin sayı değeri 7, basamak değeri 0,7.",
        durak: { soru: "12,368 sayısında 6 rakamının basamak değeri kaçtır?", secenekler: [["0,06", true, "6 yüzde birler basamağında: 6 × 0,01 = 0,06."], ["6", false, "Bu sayı değeridir."], ["0,6", false, "6 onda birler basamağında değil."], ["0,006", false, "6 binde birler basamağında değil."]] } },
    ],
    uret: {
      "bas.deger": [
        z => { const rak = karistir([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5); const sayi = `${rak[0]}${rak[1]},${rak[2]}${rak[3]}${rak[4]}`; const i = R(2, 4); const bd = [null, null, 0.1, 0.01, 0.001][i]; const deg = bd * rak[i]; const adlar = [null, null, "onda birler", "yüzde birler", "binde birler"];
          return S({ kaz: "bas.deger", duzey: "uygulama", zorluk: 1 + (i === 4 ? 1 : 0), soru: `${sayi} sayısında ${rak[i]} rakamının basamak değeri kaçtır?`, dogru: od(deg),
            dogruNeden: `${rak[i]}, ${adlar[i]} basamağındadır: ${rak[i]} × ${od(bd)} = ${od(deg)}.`,
            yanlis: [[rak[i], "kavrama", "Bu, rakamın sayı değeridir; basamak değeri rakamın bulunduğu basamağa göre belirlenir."], i > 2 ? [od(deg * 10), "islem", "Bir basamak sola kaydırdın; virgülden sonra kaçıncı basamakta olduğunu yeniden say."] : [od(deg / 100), "islem", "İki basamak sağa kaydırdın; virgülden hemen sonraki basamak onda birler basamağıdır."], [od(deg / 10), "islem", "Bir basamak sağa kaydırdın; virgülden sonra kaçıncı basamakta olduğunu yeniden say."]],
            ipucu: "Virgülden sonra kaçıncı basamakta? 1. → onda birler, 2. → yüzde birler, 3. → binde birler.", cozum: [`🔎 Soruyu anlayalım: ${sayi} sayısındaki ${rak[i]} rakamının basamak değerini bulacağız.`,
              "💡 Hatırlayalım: Virgülden sonraki 1. basamak onda birler (0,1), 2. basamak yüzde birler (0,01), 3. basamak binde birler (0,001) basamağıdır. Basamak değeri = rakam × basamağın değeri.",
              `✏️ ${rak[i]} rakamı virgülden sonra ${i - 1}. sırada; yani ${adlar[i]} basamağında.`,
              `✏️ Basamak değeri: ${rak[i]} × ${od(bd)} = ${od(deg)}.`,
              `✅ Sonuç: ${rak[i]} rakamının basamak değeri ${od(deg)}.`,
              `🔁 Kontrol edelim: Sayı değeri ${rak[i]} (rakamın kendisi), basamak değeri ${od(deg)}. Bu ikisini karıştırma!`] }); },
      ],
      "bas.ad": [
        z => { const ad = ["onda birler", "yüzde birler", "binde birler"]; const i = R(0, 2); const rak = karistir([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
          return S({ kaz: "bas.ad", duzey: "hatirlama", zorluk: 1, soru: `${rak[0]},${rak[1]}${rak[2]}${rak[3]} sayısının ${ad[i]} basamağındaki rakam hangisidir?`, dogru: rak[i + 1],
            dogruNeden: `${ad[i]} basamağı virgülden sonraki ${i + 1}. basamaktır; orada ${rak[i + 1]} vardır.`,
            yanlis: [[rak[0], "bilgi", "Bu birler basamağıdır; ondalık basamaklar virgülün sağındadır."], ...[0, 1, 2].filter(j => j !== i).map(j => [rak[j + 1], "bilgi", `Bu rakam ${ad[j]} basamağında; basamakları virgülden başlayarak sırayla say.`])],
            ipucu: "Onda birler virgülden hemen sonraki basamaktır.", cozum: [`🔎 Soruyu anlayalım: ${rak[0]},${rak[1]}${rak[2]}${rak[3]} sayısında ${ad[i]} basamağındaki rakamı arıyoruz.`,
              "💡 Hatırlayalım: Virgülün solu tam kısımdır. Virgülün sağında sırasıyla onda birler, yüzde birler ve binde birler basamakları gelir.",
              `✏️ Virgülün solundaki ${rak[0]}, birler basamağındadır.`,
              `✏️ Virgülün sağındaki basamaklar: ${ad.map((a, j) => a + " → " + rak[j + 1]).join(", ")}.`,
              `✅ Sonuç: ${ad[i]} basamağındaki rakam ${rak[i + 1]}.`,
              `🔁 Kontrol edelim: ${ad[i]} basamağı virgülden sonraki ${i + 1}. basamaktır; parmağınla sayınca ${rak[i + 1]} rakamına geliyorsun.`] }); },
      ],
      "bas.cozumle": [
        z => { const a = R(1, 9), b = R(1, 9), c = R(1, 9); const s = `${a},${b}${c}`;
          return S({ kaz: "bas.cozumle", duzey: "aciklama", zorluk: 2, soru: `${s} sayısının çözümlenmiş hâli hangisidir?`, dogru: `${a} + ${od(b / 10)} + ${od(c / 100)}`,
            dogruNeden: `${a} birler, ${b} onda birler (${od(b / 10)}), ${c} yüzde birler (${od(c / 100)}) basamağındadır.`,
            yanlis: [[`${a} + ${b} + ${c}`, "kavrama", "Rakamları değil, basamak değerlerini toplamalısın."], [`${a} + ${od(b / 100)} + ${od(c / 10)}`, "islem", "Onda birler ile yüzde birler basamaklarının yerini değiştirdin."], [`${a} + ${od(b / 10)} + ${od(c / 1000)}`, "islem", "Son rakam binde birler değil, yüzde birler basamağındadır."]],
            ipucu: "Her rakamı basamak değeriyle yaz.", cozum: [`🔎 Soruyu anlayalım: ${s} sayısını basamak değerlerinin toplamı olarak yazacağız.`,
              "💡 Hatırlayalım: Çözümleme, her rakamı basamak değeriyle yazıp toplamaktır.",
              `✏️ Basamakları belirleyelim: ${a} birler, ${b} onda birler, ${c} yüzde birler basamağında.`,
              `✏️ Basamak değerleri: ${a} → ${a}; ${b} → ${b} × 0,1 = ${od(b / 10)}; ${c} → ${c} × 0,01 = ${od(c / 100)}.`,
              `✅ Sonuç: ${s} = ${a} + ${od(b / 10)} + ${od(c / 100)}.`,
              `🔁 Kontrol edelim: ${a} + ${od(b / 10)} + ${od(c / 100)} toplamını yaparsan yine ${s} bulursun.`] }); },
        z => { const a = R(2, 9), b = R(1, 9), c = R(1, 9); const deger = a + b / 10 + c / 100;
          return S({ kaz: "bas.cozumle", duzey: "transfer", zorluk: 2, soru: `${a} tane 1 TL, ${b} tane 10 kuruş ve ${c} tane 1 kuruş toplam kaç TL eder?`, dogru: od(deger) + " TL",
            dogruNeden: `${a} TL + ${od(b / 10)} TL + ${od(c / 100)} TL = ${od(deger)} TL.`,
            yanlis: [[od(a + b / 100 + c / 10) + " TL", "kavrama", "10 kuruş 0,1 TL, 1 kuruş 0,01 TL'dir; değerlerin yerini değiştirdin."], [`${a + b + c} TL`, "kavrama", "Kuruşları da TL gibi saydın. 100 kuruş 1 TL eder."], [od(a + b / 10 + c / 10) + " TL", "islem", "1 kuruş 0,1 TL değil, 0,01 TL'dir."]],
            ipucu: "1 TL = 100 kuruş. 10 kuruş = 0,1 TL; 1 kuruş = 0,01 TL.", cozum: [`🔎 Soruyu anlayalım: ${a} tane 1 TL, ${b} tane 10 kuruş ve ${c} tane 1 kuruşun toplamını TL olarak bulacağız.`,
              "💡 Hatırlayalım: 1 TL = 100 kuruş. Bu yüzden 10 kuruş = 0,1 TL (onda bir), 1 kuruş = 0,01 TL (yüzde bir).",
              `✏️ 1 TL'ler: ${a} TL. 10 kuruşlar: ${b} × 0,1 = ${od(b / 10)} TL.`,
              `✏️ 1 kuruşlar: ${c} × 0,01 = ${od(c / 100)} TL.`,
              `✅ Sonuç: ${a} + ${od(b / 10)} + ${od(c / 100)} = ${od(deger)} TL.`,
              `🔁 Kontrol edelim: Kuruş olarak say: ${a * 100} + ${b * 10} + ${c} = ${a * 100 + b * 10 + c} kuruş = ${od(deger)} TL. Aynı sonuç!`] }); },
      ],
    },
  });

  konu({
    id: "yuvarlama", tema: "t3", ad: "Ondalık Gösterimlerde Yuvarlama", onKosul: ["basamak"],
    kazanimlar: [{ id: "yuv.kural", ad: "Belirli basamağa yuvarlama" }, { id: "yuv.tahmin", ad: "Yuvarlamayı tahminde kullanma" }],
    anlatim: [
      { baslik: "Yuvarlama kuralı", metin: "Yuvarlanacak basamağın <b>sağındaki rakama</b> bak: 5 veya büyükse bir artır; 5'ten küçükse aynı bırak. Sağdaki basamaklar atılır.", ornek: "4,376 → onda birlere: sağdaki 7 ≥ 5 → 4,4. Yüzde birlere: sağdaki 6 ≥ 5 → 4,38.",
        durak: { soru: "8,642 sayısı yüzde birler basamağına yuvarlanırsa ne olur?", secenekler: [["8,64", true, "Yüzde birlerin sağındaki rakam 2 < 5 → 8,64."], ["8,65", false, "Sağdaki rakam 2; 5'ten küçük olduğu için artırılmaz."], ["8,6", false, "Bu onda birlere yuvarlamadır."], ["9", false, "Bu en yakın tam sayıya yuvarlamadır."]] } },
      { baslik: "Neden yuvarlarız?", metin: "Yuvarlama <b>tahmin yapmayı</b> ve hızlı hesaplamayı kolaylaştırır. Alışverişte yaklaşık tutarı bulmak gibi.", ornek: "19,90 TL + 30,15 TL ≈ 20 + 30 = 50 TL.",
        durak: { soru: "4,95 TL + 2,10 TL toplamı en yakın tam sayıya yuvarlanarak tahmin edilirse kaç TL olur?", secenekler: [["7", true, "4,95 ≈ 5 ve 2,10 ≈ 2 → 7 TL."], ["6", false, "4,95'i 4'e yuvarladın; sağdaki 9 ≥ 5 olduğu için 5 olur."], ["8", false, "2,10, 2'ye yuvarlanır."], ["7,05", false, "Bu tam sonuç; soru yuvarlanmış tahmini istiyor."]] } },
    ],
    uret: {
      "yuv.kural": [
        z => { let xi; do { xi = R(1000, 99999); } while (xi % 10 === 0); const x = xi / 1000; const hedef = sec([["onda birler", 1], ["yüzde birler", 2], ["en yakın tam sayı", 0]]); const h = hedef[1], k = Math.pow(10, h), taban = Math.pow(10, 3 - h);
          const kesI = Math.floor(xi / taban), sag = Math.floor(xi / (taban / 10)) % 10, hRak = kesI % 10; const dogru = (kesI + (sag >= 5 ? 1 : 0)) / k, kes = kesI / k, ust = (kesI + 1) / k;
          const t2 = taban / 10; const birFazla = (Math.floor(xi / t2) + (h < 2 && Math.floor(xi / (t2 / 10)) % 10 >= 5 ? 1 : 0)) / (k * 10);
          const yanlisBas = h === 0 ? (Math.floor(xi / 10) + (xi % 10 >= 5 ? 1 : 0)) / 100 : h === 1 ? Math.floor(xi / 1000) + (Math.floor(xi / 100) % 10 >= 5 ? 1 : 0) : (Math.floor(xi / 100) + (Math.floor(xi / 10) % 10 >= 5 ? 1 : 0)) / 10;
          const basAd = h === 0 ? "birler" : hedef[0];
          return S({ kaz: "yuv.kural", duzey: "uygulama", zorluk: h === 2 ? 2 : 1, soru: `${od(x)} sayısı ${hedef[0]}${h ? " basamağına" : "ya"} yuvarlanırsa hangi sayı elde edilir?`, dogru: od(dogru),
            dogruNeden: `${basAd} basamağının sağındaki rakam ${sag}; ${sag >= 5 ? "5 veya büyük olduğu için basamak 1 artar" : "5'ten küçük olduğu için basamak aynı kalır"}: ${od(dogru)}.`,
            yanlis: [[od(dogru === kes ? ust : kes), "bilgi", `Sağdaki rakam ${sag}; ${sag >= 5 ? "5 veya büyük olduğunda basamak 1 artırılır" : "5'ten küçük olduğunda basamak aynı bırakılır"}. Kuralı ters uyguladın.`], [od(h === 2 ? x : birFazla), "dikkat", "İstenenden bir basamak fazla bıraktın; yuvarlanan basamağın sağındaki rakamlar atılır."], [od(yanlisBas), "dikkat", "Yanlış basamağa yuvarladın; hangi basamağın istendiğini yeniden oku."]],
            ipucu: "İstenen basamağın sağındaki rakam 5 veya daha büyük mü?", cozum: [`🔎 Soruyu anlayalım: ${od(x)} sayısını ${hedef[0]}${h ? " basamağına" : "ya"} yuvarlayacağız.`,
              "💡 Hatırlayalım: Yuvarlanacak basamağın sağındaki rakam 5 veya büyükse o basamak 1 artar; 5'ten küçükse aynı kalır. Sağdaki basamaklar atılır.",
              `✏️ Yuvarlanacak basamak ${basAd} basamağı; burada ${hRak} rakamı var.`,
              `✏️ Sağındaki rakam ${sag}: ${sag >= 5 ? `5 veya büyük → ${hRak} rakamını 1 artırırız` : `5'ten küçük → ${hRak} rakamını aynı bırakırız`}. Sağdaki basamakları atarız.`,
              `✅ Sonuç: ${od(x)} ≈ ${od(dogru)}.`,
              `🔁 Kontrol edelim: ${od(x)} sayısı ${od(kes)} ile ${od(ust)} arasında ve ${od(dogru)} sayısına daha yakın (tam ortadaysa yukarı yuvarlanır).`] }); },
      ],
      "yuv.tahmin": [
        z => { const ai = R(150, 999), bi = R(150, 999); const a = ai / 100, b = bi / 100; const ra = Math.floor(ai / 100) + (Math.floor(ai / 10) % 10 >= 5 ? 1 : 0), rb = Math.floor(bi / 100) + (Math.floor(bi / 10) % 10 >= 5 ? 1 : 0); const t = ra + rb;
          return S({ kaz: "yuv.tahmin", duzey: "transfer", zorluk: 2, soru: `${od(a)} TL ve ${od(b)} TL'lik iki ürün alan Ayşe, fiyatları en yakın tam sayıya yuvarlayarak toplam tutarı tahmin ediyor. Tahmini kaç TL'dir?`, dogru: t,
            dogruNeden: `${od(a)} ≈ ${ra} ve ${od(b)} ≈ ${rb}; ${ra} + ${rb} = ${t} TL.`,
            yanlis: [[Math.floor(a) + Math.floor(b), "bilgi", "Yalnızca virgülden önceki kısmı aldın; onda birler basamağına bakarak yuvarlamalısın."], [od((ai + bi) / 100), "dikkat", "Bu, gerçek toplamdır; soru yuvarlanmış tahmini istiyor."], [Math.ceil(a) + Math.ceil(b) === t ? t + 1 : Math.ceil(a) + Math.ceil(b), "bilgi", "Her zaman yukarı yuvarlanmaz; onda birler rakamı 5'ten küçükse aşağı yuvarlanır."]],
            ipucu: "Her fiyatı ayrı ayrı en yakın tam sayıya yuvarla, sonra topla.", cozum: [`🔎 Soruyu anlayalım: ${od(a)} TL ve ${od(b)} TL'yi en yakın tam sayıya yuvarlayıp toplayarak tahmin yapacağız.`,
              "💡 Hatırlayalım: En yakın tam sayıya yuvarlarken onda birler basamağına bakarız: 5 veya büyükse yukarı, 5'ten küçükse aşağı.",
              `✏️ ${od(a)}: onda birler rakamı ${Math.floor(ai / 10) % 10} → ${ra}.`,
              `✏️ ${od(b)}: onda birler rakamı ${Math.floor(bi / 10) % 10} → ${rb}.`,
              `✅ Sonuç: Tahmin ${ra} + ${rb} = ${t} TL.`,
              `🔁 Kontrol edelim: Gerçek toplam ${od((ai + bi) / 100)} TL; tahminimiz ${t} TL buna yakın. Tahmin, hesabın mantıklı olup olmadığını hızlıca anlamamızı sağlar.`] }); },
      ],
    },
  });

  konu({
    id: "kesirbolme", tema: "t3", ad: "Kesir ile Bölme İlişkisi",
    kazanimlar: [{ id: "kb.iliski", ad: "Kesri bölme işlemi olarak yorumlama" }, { id: "kb.ondalik", ad: "Kesri ondalık gösterime çevirme" }, { id: "kb.paylasim", ad: "Paylaştırma problemlerinde kesir" }],
    anlatim: [
      { baslik: "Kesir bir bölmedir", metin: "a/b kesri <b>a ÷ b</b> bölme işlemini gösterir. Pay bölünen, payda bölendir.", ornek: "3/4 = 3 ÷ 4. 3 pizza 4 kişiye eşit paylaşılırsa her kişiye 3/4 pizza düşer.",
        durak: { soru: "5 ÷ 8 işleminin kesirle gösterimi hangisidir?", secenekler: [["5/8", true, "Bölünen pay, bölen payda olur: 5/8."], ["8/5", false, "Pay ile paydayı ters yazdın."], ["5,8", false, "Bölme işlemi virgülle yazılmaz."], ["1/5", false, "Bölünen sayıyı kaybettin."]] } },
      { baslik: "Ondalık gösterime çevirme", metin: "Kesri ondalığa çevirmek için payı paydaya böl ya da paydayı 10, 100, 1000 yapacak sayıyla genişlet.", ornek: "3/4 = 75/100 = 0,75. 2/5 = 4/10 = 0,4.",
        durak: { soru: "3/5 kesrinin ondalık gösterimi hangisidir?", secenekler: [["0,6", true, "3/5 = 6/10 = 0,6."], ["3,5", false, "Kesir çizgisi virgül demek değildir."], ["0,35", false, "3 ÷ 5 = 0,6."], ["1,6", false, "3/5 birden küçüktür."]] } },
    ],
    uret: {
      "kb.iliski": [
        z => { const a = R(2, 9), b = R(a + 1, 12);
          return S({ kaz: "kb.iliski", duzey: "hatirlama", zorluk: 1, soru: `${a}/${b} kesri hangi bölme işlemini gösterir?`, dogru: `${a} ÷ ${b}`,
            dogruNeden: `Kesir çizgisi bölme demektir; pay (${a}) bölünen, payda (${b}) bölendir.`,
            yanlis: [[`${b} ÷ ${a}`, "kavrama", "Pay bölünen, payda bölendir; sayıların yerini ters çevirdin."], [`${a} × ${b}`, "bilgi", "Kesir çizgisi bölme anlamına gelir, çarpma değil."], [`${b} − ${a}`, "bilgi", "Kesir çizgisi çıkarma değil, bölme anlamına gelir."]],
            ipucu: "Kesir çizgisi “bölü” demektir.", cozum: [`🔎 Soruyu anlayalım: ${a}/${b} kesrinin hangi bölme işlemine karşılık geldiğini bulacağız.`,
              "💡 Hatırlayalım: Kesir çizgisi bölme işaretidir. Pay (üstteki sayı) bölünen, payda (alttaki sayı) bölendir.",
              `✏️ Payı belirleyelim: ${a} → bölünen.`,
              `✏️ Paydayı belirleyelim: ${b} → bölen.`,
              `✅ Sonuç: ${a}/${b} = ${a} ÷ ${b}.`,
              `🔁 Kontrol edelim: ${a} tane bütün ${b} kişiye eşit paylaşılırsa her kişiye ${a}/${b} düşer. Paylaşılan miktar paya, kişi sayısı paydaya yazılır.`] }); },
      ],
      "kb.ondalik": [
        z => { const [a, b, d] = sec([[1, 2, 0.5], [1, 4, 0.25], [3, 4, 0.75], [2, 5, 0.4], [3, 5, 0.6], [4, 5, 0.8], [1, 5, 0.2], [7, 10, 0.7], [9, 20, 0.45], [3, 20, 0.15], [7, 25, 0.28], [1, 8, 0.125], [3, 8, 0.375]]); const h = [10, 100, 1000].find(x => x % b === 0);
          return S({ kaz: "kb.ondalik", duzey: "uygulama", zorluk: b >= 20 ? 2 : 1, soru: `${a}/${b} kesrinin ondalık gösterimi hangisidir?`, dogru: od(d),
            dogruNeden: h === b ? `Paydası ${b} olan kesirde virgülden sonra ${String(h).length - 1} basamak yazılır: ${a}/${b} = ${od(d)}.` : `${a}/${b} = ${a * h / b}/${h} = ${od(d)}.`,
            yanlis: [[`${a},${b}`, "kavrama", "Kesir çizgisi virgül demek değildir; payı paydaya bölmelisin."], [Number.isInteger(b / a * 100) ? od(b / a) : od(d / 10), Number.isInteger(b / a * 100) ? "kavrama" : "islem", Number.isInteger(b / a * 100) ? "Paydayı paya böldün; pay bölünen, payda bölendir." : "Virgülü bir basamak fazla kaydırdın; paydadaki sıfır sayısına dikkat et."], [od(d * 10), "islem", "Virgülü bir basamak eksik kaydırdın; paydadaki sıfır sayısı kadar basamak olmalı."]],
            ipucu: `${a} ÷ ${b} işlemini yap ya da paydayı 10, 100 veya 1000'e genişlet.`, cozum: [`🔎 Soruyu anlayalım: ${a}/${b} kesrini ondalık gösterimle yazacağız.`,
              "💡 Hatırlayalım: Paydası 10, 100 ya da 1000 olan kesirler kolayca ondalığa çevrilir. Bunun için kesri genişletiriz (pay ve paydayı aynı sayıyla çarparız).",
              h === b ? `✏️ Payda zaten ${b}; genişletmeye gerek yok.` : `✏️ ${b} × ${h / b} = ${h} olduğundan pay ve paydayı ${h / b} ile çarpalım: (${a} × ${h / b})/(${b} × ${h / b}) = ${a * h / b}/${h}.`,
              `✏️ Paydada ${h} var; ${String(h).length - 1} sıfır olduğu için virgülden sonra ${String(h).length - 1} basamak yazarız: ${a * h / b}/${h} = ${od(d)}.`,
              `✅ Sonuç: ${a}/${b} = ${od(d)}.`,
              `🔁 Kontrol edelim: ${a} ÷ ${b} bölmesini yaparsan da ${od(d)} bulursun. ${a} < ${b} olduğu için sonuç 1'den küçük çıkmalıydı; çıktı.`] }); },
      ],
      "kb.paylasim": [
        z => { const a = R(2, 7), b = R(a + 1, 10); const nesne = sec(["pizza", "pasta", "çikolata"]);
          return S({ kaz: "kb.paylasim", duzey: "transfer", zorluk: 2, soru: `${a} ${nesne} ${b} arkadaş arasında eşit olarak paylaştırılırsa her arkadaşa ne kadar ${nesne} düşer?`, dogru: kesir(a, b),
            dogruNeden: `Eşit paylaştırma bölmedir: ${a} ÷ ${b} = ${kesir(a, b)}.`,
            yanlis: [[kesir(b, a), "kavrama", "Payı ve paydayı ters yazdın: paylaştırılan miktar pay, kişi sayısı paydadır."], [`1/${b}`, "dikkat", `Bu, tek bir ${nesne} paylaştırıldığında düşen paydır; burada ${a} ${nesne} var.`], [String(b - a), "bilgi", "Paylaştırma bir bölme işlemidir; çıkarma yapmamalısın."]],
            ipucu: "Paylaştırma = bölme. Bölme = kesir.", cozum: [`🔎 Soruyu anlayalım: ${a} ${nesne} ${b} kişiye eşit paylaştırılıyor. Her kişinin payını bulacağız.`,
              "💡 Hatırlayalım: Eşit paylaştırma bölme işlemidir ve her bölme bir kesir olarak yazılabilir: a ÷ b = a/b.",
              `✏️ İşlem: ${a} ÷ ${b}.`,
              `✏️ Kesir olarak yazalım: paylaştırılan miktar (${a}) pay, kişi sayısı (${b}) payda → ${a}/${b}${kesir(a, b) !== a + "/" + b ? " = " + kesir(a, b) : ""}.`,
              `✅ Sonuç: Her arkadaşa ${kesir(a, b)} ${nesne} düşer.`,
              `🔁 Kontrol edelim: ${b} kişinin payını toplarsak ${b} × ${a}/${b} = ${a} ${nesne} eder. Hepsi paylaştırılmış!`] }); },
        z => { const b = sec([4, 5, 8, 10]); const a = R(b + 1, 2 * b - 1); const h = [10, 100, 1000].find(x => x % b === 0);
          return S({ kaz: "kb.paylasim", duzey: "baglanti", zorluk: 3, soru: `${a} litre süt ${b} şişeye eşit olarak dolduruluyor. Her şişede kaç litre süt olur? (Ondalık gösterimle)`, dogru: od(a / b),
            dogruNeden: `${a} ÷ ${b} = ${a}/${b} = ${a * h / b}/${h} = ${od(a / b)} litre.`,
            yanlis: [[od(b / a), "kavrama", "Şişe sayısını süt miktarına böldün; süt miktarı bölünen olmalı."], [`${a},${b}`, "kavrama", "Kesir virgülle yazılmaz; bölme işlemini yapmalısın."], [od(Math.floor(a / b)), "dikkat", "Yalnızca tam kısmı aldın; artan sütü de şişelere paylaştırmalısın."]],
            ipucu: `${a} ÷ ${b} = ${a}/${b}; sonra ondalığa çevir.`, cozum: [`🔎 Soruyu anlayalım: ${a} litre süt ${b} şişeye eşit dağıtılıyor. Bir şişedeki süt miktarını ondalık gösterimle bulacağız.`,
              "💡 Hatırlayalım: Eşit paylaştırma bölmedir; bölme kesirle, kesir de ondalık gösterimle yazılabilir.",
              `✏️ İşlem: ${a} ÷ ${b} = ${a}/${b}.`,
              `✏️ Paydayı ${h} yapalım: ${a}/${b} = ${a * h / b}/${h} = ${od(a / b)}.`,
              `✅ Sonuç: Her şişede ${od(a / b)} litre süt olur.`,
              `🔁 Kontrol edelim: ${od(a / b)} × ${b} = ${a} litre. Ayrıca ${a} > ${b} olduğu için her şişeye 1 litreden fazla düşmeliydi; düştü.`] }); },
      ],
    },
  });

  konu({
    id: "problem", tema: "t3", ad: "Gerçek Yaşam Problemleri", onKosul: ["basamak", "kesirbolme"],
    kazanimlar: [{ id: "pr.para", ad: "Ondalık gösterimle para problemleri" }, { id: "pr.kesir", ad: "Kesirli miktar problemleri" }, { id: "pr.cokadim", ad: "Çok adımlı problemler" }],
    anlatim: [
      { baslik: "Problem çözme adımları", metin: "1) Verilenleri yaz. 2) İsteneni belirle. 3) İşlemi seç. 4) Çöz. 5) Sonucun mantıklı olup olmadığını kontrol et.", ornek: "“3 defter 12,75 TL ise 1 defter?” → Verilen: 3 defter, 12,75 TL. İstenen: 1 defter. İşlem: bölme → 4,25 TL.",
        durak: { soru: "Tanesi 2,50 TL olan kalemlerden 4 tane alan Can kaç TL öder?", secenekler: [["10 TL", true, "2,50 × 4 = 10."], ["8,50 TL", false, "Kuruşları ayrı çarpmayı unuttun: 0,50 × 4 = 2."], ["6,50 TL", false, "Toplama yaptın; adet ile fiyat çarpılır."], ["10,50 TL", false, "Çarpımı yeniden kontrol et."]] } },
      { baslik: "Sonucu kontrol et", metin: "Cevabın <b>mantıklı</b> olup olmadığını yaklaşık hesapla kontrol et: 9,90 TL'lik 3 ürün yaklaşık 30 TL eder.", ornek: "Cevabın 3 TL ya da 300 TL çıkıyorsa bir hata vardır.",
        durak: { soru: "50 TL ile tanesi 7,25 TL olan defterlerden en çok kaç tane alınabilir?", secenekler: [["6", true, "7,25 × 6 = 43,50 ≤ 50; 7 tane 50,75 TL eder ve yetmez."], ["7", false, "7 × 7,25 = 50,75 TL; 50 TL yetmez."], ["6,89", false, "Defter sayısı tam sayı olmalı."], ["5", false, "6 defter de alınabilir."]] } },
    ],
    uret: {
      "pr.para": [
        z => { const fi = R(150, 1250), n = R(2, 6); const topI = fi * n; let ver = Math.ceil(topI / 1000) * 10 + sec([0, 10, 20]); if (ver * 100 === topI) ver += 10; const f = fi / 100, top = topI / 100, ust = (ver * 100 - topI) / 100;
          return S({ kaz: "pr.para", duzey: "uygulama", zorluk: 2, soru: `Tanesi ${od(f)} TL olan defterden ${n} tane alan Elif kasaya ${ver} TL veriyor. Kaç TL para üstü alır?`, dogru: od(ust) + " TL",
            dogruNeden: `Toplam ${od(f)} × ${n} = ${od(top)} TL; para üstü ${ver} − ${od(top)} = ${od(ust)} TL.`,
            yanlis: [[od(top) + " TL", "dikkat", "Bu, toplam tutardır; soru para üstünü istiyor."], [od((ver * 100 - fi) / 100) + " TL", "dikkat", "Yalnızca bir defterin fiyatını çıkardın; önce defterlerin toplam fiyatını bulmalısın."], [od((ver * 100 - topI + 100) / 100) + " TL", "islem", "Çıkarmada bir basamağı hatalı aldın; virgülleri alt alta yazıp yeniden çıkar."]],
            ipucu: "Önce toplam tutarı bul, sonra verilen paradan çıkar.", cozum: [`🔎 Soruyu anlayalım: Elif tanesi ${od(f)} TL olan ${n} defter alıyor ve ${ver} TL veriyor. Para üstünü bulacağız.`,
              "💡 Hatırlayalım: Önce toplam tutar = adet × birim fiyat; sonra para üstü = verilen para − toplam tutar. Virgüller alt alta gelmeli.",
              `✏️ Toplam tutar: ${od(f)} × ${n} = ${od(top)} TL.`,
              `✏️ Para üstü: ${ver} − ${od(top)} = ${od(ust)} TL.`,
              `✅ Sonuç: Elif ${od(ust)} TL para üstü alır.`,
              `🔁 Kontrol edelim: Toplam tutar ile para üstünü toplayalım: ${od(top)} + ${od(ust)} = ${ver} TL. Verilen parayı bulduk!`] }); },
        z => { const fi = R(250, 990), para = sec([20, 30, 50]); const n = Math.floor(para * 100 / fi); const f = fi / 100; const kalan = (para * 100 - n * fi) / 100;
          return S({ kaz: "pr.para", duzey: "transfer", zorluk: 3, soru: `${para} TL'si olan bir öğrenci tanesi ${od(f)} TL olan kalemlerden en çok kaç tane alabilir?`, dogru: n,
            dogruNeden: `${n} kalem ${od(n * fi / 100)} TL eder ve para yeter; ${n + 1} kalem ${od((n + 1) * fi / 100)} TL eder ve para yetmez.`,
            yanlis: [[n + 1, "dikkat", `${n + 1} kalem ${od((n + 1) * fi / 100)} TL eder; ${para} TL yetmez.`], [od(Math.floor(para * 10000 / fi) / 100), "kavrama", "Bölme sonucunu olduğu gibi yazdın; kalem sayısı tam sayı olmalı, yarım kalem alınamaz."], [n - 1, "islem", `Bir kalem daha alabilirsin: ${n} kalem ${od(n * fi / 100)} TL eder.`]],
            ipucu: "Parayı kalem fiyatına böl; sonucu aşağı yuvarla.", cozum: [`🔎 Soruyu anlayalım: ${para} TL ile tanesi ${od(f)} TL olan kalemlerden en çok kaç tane alınabileceğini bulacağız.`,
              "💡 Hatırlayalım: “En çok kaç tane” sorularında bölme yapılır. Sonuç tam sayı değilse aşağı yuvarlanır; çünkü yarım kalem alınamaz.",
              `✏️ ${para} ÷ ${od(f)} ≈ ${od(Math.floor(para * 10000 / fi) / 100)}. Bu sayının tam kısmı ${n}.`,
              `✏️ Deneyelim: ${n} kalem → ${n} × ${od(f)} = ${od(n * fi / 100)} TL (yeter). ${n + 1} kalem → ${od((n + 1) * fi / 100)} TL (yetmez).`,
              `✅ Sonuç: En çok ${n} kalem alınabilir.`,
              `🔁 Kontrol edelim: Geriye ${od(kalan)} TL kalır; bu para bir kalem daha almaya yetmez (${od(f)} TL'den az).`] }); },
      ],
      "pr.kesir": [
        z => { const top = sec([24, 30, 36, 40, 48, 60]); const [a, b] = sec([[1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [5, 6]].filter(([x, y]) => top % y === 0)); const okunan = top * a / b, kalan = top - okunan;
          return S({ kaz: "pr.kesir", duzey: "uygulama", zorluk: 2, soru: `${top} sayfalık bir kitabın ${a}/${b} kadarını okuyan Zeynep'in okuması gereken kaç sayfa kalmıştır?`, dogru: kalan,
            dogruNeden: `Okunan ${top} ÷ ${b} × ${a} = ${okunan} sayfa; kalan ${top} − ${okunan} = ${kalan} sayfa.`,
            yanlis: [[okunan, "dikkat", "Bu, okunan sayfa sayısıdır; soru kalan sayfayı istiyor."], [top / b, "islem", "Paydaya bölmekle kaldın; bu yalnızca 1 parçadır. Payla da çarpmalısın."], [top - a - b, "kavrama", "Kesrin pay ve paydasını sayfa sayısından çıkardın; kesir bir bütünün parçasını gösterir."]],
            ipucu: `Önce okunan sayfayı bul: ${top} × ${a}/${b}.`, cozum: [`🔎 Soruyu anlayalım: ${top} sayfalık kitabın ${a}/${b} kadarı okunmuş. Okunmayan (kalan) sayfa sayısını bulacağız.`,
              "💡 Hatırlayalım: Bir çokluğun a/b kadarını bulmak için önce paydaya bölüp bir parçayı buluruz, sonra payla çarparız.",
              `✏️ Bir parça (1/${b}): ${top} ÷ ${b} = ${top / b} sayfa.`,
              `✏️ Okunan (${a}/${b}): ${top / b} × ${a} = ${okunan} sayfa.`,
              `✅ Sonuç: Kalan ${top} − ${okunan} = ${kalan} sayfa.`,
              `🔁 Kontrol edelim: Kalan kısım kitabın ${b - a}/${b} kadarıdır: ${top / b} × ${b - a} = ${kalan}. Aynı sonucu bulduk!`] }); },
      ],
      "pr.cokadim": [
        z => { const s = R(3, 6), f1i = R(120, 450), f2i = R(150, 600), n2 = R(2, 4); const k1 = s * f1i, k2 = n2 * f2i, topI = k1 + k2; const f1 = f1i / 100, f2 = f2i / 100;
          return S({ kaz: "pr.cokadim", duzey: "baglanti", zorluk: 3, soru: `Bir kırtasiyeden tanesi ${od(f1)} TL olan ${s} kalem ve tanesi ${od(f2)} TL olan ${n2} silgi alındı. Toplam kaç TL ödenir?`, dogru: od(topI / 100) + " TL",
            dogruNeden: `Kalemler ${od(k1 / 100)} TL, silgiler ${od(k2 / 100)} TL; toplam ${od(topI / 100)} TL.`,
            yanlis: [[od((f1i + f2i) * (s + n2) / 100) + " TL", "strateji", "Fiyatları toplayıp toplam adetle çarpmak yanlış sonuç verir; her ürünün tutarını ayrı hesapla."], [od(k1 / 100) + " TL", "dikkat", "Yalnızca kalemlerin tutarını buldun; silgileri eklemeyi unuttun."], [od((f1i + f2i) / 100) + " TL", "kavrama", "Birer tane fiyatı topladın; adetleri hesaba katmadın."]],
            ipucu: "Kalemlerin ve silgilerin tutarını ayrı ayrı bul, sonra topla.", cozum: [`🔎 Soruyu anlayalım: ${s} kalem (tanesi ${od(f1)} TL) ve ${n2} silgi (tanesi ${od(f2)} TL) alınmış. Toplam ödemeyi bulacağız.`,
              "💡 Hatırlayalım: Farklı ürünlerde her ürünün tutarı ayrı bulunur (adet × birim fiyat), sonra tutarlar toplanır.",
              `✏️ Kalemler: ${s} × ${od(f1)} = ${od(k1 / 100)} TL.`,
              `✏️ Silgiler: ${n2} × ${od(f2)} = ${od(k2 / 100)} TL.`,
              `✅ Sonuç: ${od(k1 / 100)} + ${od(k2 / 100)} = ${od(topI / 100)} TL ödenir.`,
              `🔁 Kontrol edelim: Yaklaşık hesap: ${s} × ${Math.round(f1)} + ${n2} × ${Math.round(f2)} = ${s * Math.round(f1) + n2 * Math.round(f2)} TL. Bulduğumuz ${od(topI / 100)} TL buna yakın; sonuç mantıklı.`] }); },
      ],
    },
  });

  konu({
    id: "uzunluk", tema: "t3", ad: "Uzunluk Ölçme Birimleri", onKosul: ["basamak"],
    kazanimlar: [{ id: "uz.donustur", ad: "Uzunluk birimlerini dönüştürme" }, { id: "uz.birim", ad: "Uygun birimi seçme" }, { id: "uz.problem", ad: "Uzunluk problemleri" }],
    anlatim: [
      { baslik: "Birimler merdiveni", metin: "km → m → dm → cm → mm. Büyükten küçüğe inerken <b>çarp</b>, küçükten büyüğe çıkarken <b>böl</b>. 1 km = 1000 m, 1 m = 10 dm = 100 cm = 1000 mm.", ornek: "3,5 m = 350 cm. 450 cm = 4,5 m. 2 km 300 m = 2300 m.",
        durak: { soru: "2,4 m kaç cm'dir?", secenekler: [["240 cm", true, "1 m = 100 cm → 2,4 × 100 = 240 cm."], ["24 cm", false, "Bu dm'ye çevirmedir (×10); cm için ×100."], ["2400 cm", false, "1000 ile çarptın; bu mm'dir."], ["0,024 cm", false, "Büyük birimden küçüğe geçerken çarpılır, bölünmez."]] } },
      { baslik: "Uygun birim", metin: "Ölçülecek şeyin büyüklüğüne uygun birim seçilir: şehirler arası yol → km, oda → m, kalem → cm, karınca → mm.", ornek: "İstanbul–Ankara arası yaklaşık 450 km.",
        durak: { soru: "Bir silginin uzunluğu hangi birimle ölçülmeye en uygundur?", secenekler: [["cm", true, "Silgi birkaç santimetre uzunluğundadır."], ["km", false, "km, şehirler arası mesafeler içindir."], ["m", false, "Metre, sınıf ya da oda gibi büyük uzunluklar içindir."], ["Hiçbiri", false, "Uzunluk birimleriyle ölçülür."]] } },
    ],
    uret: {
      "uz.donustur": [
        z => { const BIR = { km: 1000000, m: 1000, dm: 100, cm: 10, mm: 1 }; const [b1, b2] = sec([["m", "cm"], ["km", "m"], ["cm", "mm"], ["m", "mm"], ["dm", "cm"], ["cm", "m"], ["m", "km"], ["mm", "cm"]]);
          const x = BIR[b1] > BIR[b2] ? R(12, 95) / 10 : R(120, 9500); const oran = BIR[b1] / BIR[b2]; const buyuk = oran > 1; const c = buyuk ? oran : BIR[b2] / BIR[b1]; const sonuc = buyuk ? x * c : x / c;
          return S({ kaz: "uz.donustur", duzey: "uygulama", zorluk: c >= 1000 ? 2 : 1, soru: `${od(x)} ${b1} kaç ${b2}'dir?`, dogru: od(sonuc) + " " + b2,
            dogruNeden: buyuk ? `1 ${b1} = ${c} ${b2}; ${od(x)} × ${c} = ${od(sonuc)} ${b2}.` : `1 ${b2} = ${c} ${b1}; ${od(x)} ÷ ${c} = ${od(sonuc)} ${b2}.`,
            yanlis: [[od(buyuk ? x / c : x * c) + " " + b2, "kavrama", buyuk ? "Büyük birimden küçük birime geçerken çarpmalısın, bölmemelisin." : "Küçük birimden büyük birime geçerken bölmelisin, çarpmamalısın."], [od(sonuc * 10) + " " + b2, "islem", "Virgülü bir basamak fazla kaydırdın; iki birim arasındaki katı yeniden yaz."], [od(sonuc / 10) + " " + b2, "islem", "Virgülü bir basamak eksik kaydırdın; iki birim arasındaki katı yeniden yaz."]],
            ipucu: "Birimler merdiveninde kaç basamak iniyor ya da çıkıyorsun?", cozum: [`🔎 Soruyu anlayalım: ${od(x)} ${b1} uzunluğunu ${b2} cinsinden yazacağız.`,
              "💡 Hatırlayalım: km → m (× 1000), m → dm (× 10), dm → cm (× 10), cm → mm (× 10). Büyük birimden küçüğe inerken çarpar, küçükten büyüğe çıkarken böleriz.",
              buyuk ? `✏️ ${b1} büyük, ${b2} küçük birim; aşağı iniyoruz, çarpacağız. 1 ${b1} = ${c} ${b2}.` : `✏️ ${b1} küçük, ${b2} büyük birim; yukarı çıkıyoruz, böleceğiz. 1 ${b2} = ${c} ${b1}.`,
              `✏️ ${od(x)} ${buyuk ? "×" : "÷"} ${c} = ${od(sonuc)}.`,
              `✅ Sonuç: ${od(x)} ${b1} = ${od(sonuc)} ${b2}.`,
              `🔁 Kontrol edelim: ${buyuk ? "Küçük birime geçince sayı büyümeli" : "Büyük birime geçince sayı küçülmeli"}: ${od(x)} → ${od(sonuc)}. Mantıklı!`] }); },
        z => { const k = R(1, 5), m = R(50, 950);
          return S({ kaz: "uz.donustur", duzey: "uygulama", zorluk: 2, soru: `${k} km ${m} m kaç metredir?`, dogru: k * 1000 + m,
            dogruNeden: `${k} km = ${k * 1000} m; ${k * 1000} + ${m} = ${k * 1000 + m} m.`,
            yanlis: [[k + m, "kavrama", "km ve m doğrudan toplanmaz; önce km'yi metreye çevirmelisin."], [k * 100 + m, "bilgi", "1 km = 1000 m'dir, 100 m değil."], [od(k + m / 1000), "dikkat", "Bu, kilometre cinsinden sonuçtur; soru metre istiyor."]],
            ipucu: "1 km = 1000 m.", cozum: [`🔎 Soruyu anlayalım: ${k} km ${m} m uzunluğun tamamını metre olarak yazacağız.`,
              "💡 Hatırlayalım: 1 km = 1000 m. Farklı birimler toplanmadan önce aynı birime çevrilir.",
              `✏️ Kilometreyi metreye çevirelim: ${k} km = ${k} × 1000 = ${k * 1000} m.`,
              `✏️ Metreleri toplayalım: ${k * 1000} + ${m} = ${k * 1000 + m}.`,
              `✅ Sonuç: ${k} km ${m} m = ${k * 1000 + m} m.`,
              `🔁 Kontrol edelim: ${k * 1000 + m} m'yi kilometreye çevirirsek ${od(k + m / 1000)} km olur; yani ${k} km ve ${m} m. Tutuyor!`] }); },
      ],
      "uz.birim": [
        z => { const o = sec([["İki şehir arasındaki uzaklık", "km", "Şehirler arası uzaklık binlerce metredir; kilometreyle ifade etmek kolaydır."], ["Sınıfın uzunluğu", "m", "Bir sınıf birkaç metre uzunluğundadır."], ["Bir kalemin uzunluğu", "cm", "Bir kalem birkaç santimetre uzunluğundadır."], ["Bir karıncanın boyu", "mm", "Bir karınca birkaç milimetre boyundadır."], ["Bir futbol sahasının uzunluğu", "m", "Bir futbol sahası yaklaşık yüz metre uzunluğundadır."]]); const B = ["km", "m", "cm", "mm"];
          return S({ kaz: "uz.birim", duzey: "hatirlama", zorluk: 1, soru: `“${o[0]}” ölçülürken en uygun birim hangisidir?`, dogru: o[1], dogruNeden: o[2],
            yanlis: B.filter(b => b !== o[1]).map(b => [b, "kavrama", `Bu birim ölçülen uzunluğa göre çok ${B.indexOf(b) < B.indexOf(o[1]) ? "büyük; sonuç 0,… gibi küçük bir sayı çıkar" : "küçük; sonuç çok büyük bir sayı çıkar"}.`]),
            ipucu: "Ölçeceğin şey ne kadar büyük?", cozum: [`🔎 Soruyu anlayalım: “${o[0]}” için en uygun uzunluk birimini seçeceğiz.`,
              "💡 Hatırlayalım: Birimler büyükten küçüğe: km (çok uzun yollar) → m (oda, saha) → cm (kalem, defter) → mm (çok küçük şeyler).",
              `✏️ Ölçülecek uzunluğu düşünelim: ${o[2]}`,
              `✏️ Daha büyük bir birim seçersek çok küçük bir ondalık sayı, daha küçük bir birim seçersek çok büyük bir sayı elde ederiz.`,
              `✅ Sonuç: En uygun birim ${o[1]}.`,
              "🔁 Kontrol edelim: Uygun birim, ölçümü akılda kalan, kolay okunur bir sayıyla söylememizi sağlar."] }); },
      ],
      "uz.problem": [
        z => { const tur = sec([200, 250, 400, 500]), n = R(3, 10); const m = tur * n;
          return S({ kaz: "uz.problem", duzey: "transfer", zorluk: 2, soru: `Bir koşu pistinin bir turu ${tur} m'dir. Pistte ${n} tur atan Ahmet kaç km koşmuş olur?`, dogru: od(m / 1000) + " km",
            dogruNeden: `${tur} × ${n} = ${m} m = ${od(m / 1000)} km.`,
            yanlis: [[m + " km", "dikkat", "Bu sayı metre cinsindendir; kilometreye çevirmeyi unuttun."], [od(m / 100) + " km", "bilgi", "1 km = 1000 m'dir; 100'e değil 1000'e bölmelisin."], [od(tur / 1000) + " km", "dikkat", "Bu, yalnızca bir turun uzunluğudur; tur sayısıyla çarpmayı unuttun."]],
            ipucu: "Önce toplam metreyi bul, sonra 1000'e böl.", cozum: [`🔎 Soruyu anlayalım: Bir tur ${tur} m, Ahmet ${n} tur atıyor. Toplam yolu kilometre olarak bulacağız.`,
              "💡 Hatırlayalım: 1 km = 1000 m. Metreyi kilometreye çevirirken 1000'e böleriz.",
              `✏️ Toplam yol: ${tur} × ${n} = ${m} m.`,
              `✏️ Kilometreye çevirelim: ${m} ÷ 1000 = ${od(m / 1000)}.`,
              `✅ Sonuç: Ahmet ${od(m / 1000)} km koşmuştur.`,
              `🔁 Kontrol edelim: ${od(m / 1000)} km × 1000 = ${m} m ve ${m} ÷ ${tur} = ${n} tur. Her şey tutuyor!`] }); },
        z => { const top = R(3, 9), p = R(25, 90); const parca = Math.floor(top * 100 / p);
          return S({ kaz: "uz.problem", duzey: "baglanti", zorluk: 3, soru: `${top} m uzunluğundaki bir kumaştan ${p} cm'lik parçalar kesiliyor. En çok kaç parça kesilebilir?`, dogru: parca,
            dogruNeden: `${top} m = ${top * 100} cm; ${top * 100} ÷ ${p} = ${parca}, kalan ${top * 100 % p} cm.`,
            yanlis: [[Math.floor(top * 1000 / p), "bilgi", "Metreyi 1000 ile çarptın; bu milimetreye çevirmedir. 1 m = 100 cm'dir."], [parca + 1, "dikkat", `Son parça ${p} cm'den kısa kalır; tam parça sayılmaz.`], [od(Math.round(top * 10000 / p) / 100), "kavrama", "Parça sayısı tam sayı olmalı; bölme sonucunu aşağı yuvarla."]],
            ipucu: `${top} m = ${top * 100} cm.`, cozum: [`🔎 Soruyu anlayalım: ${top} m'lik kumaştan ${p} cm'lik parçalar kesilecek. En çok kaç tam parça çıkar?`,
              "💡 Hatırlayalım: Önce birimleri eşitleriz. 1 m = 100 cm. “En çok kaç parça” sorusunda kalan kısım bir parça sayılmaz.",
              `✏️ Birimleri eşitleyelim: ${top} m = ${top * 100} cm.`,
              `✏️ Bölelim: ${top * 100} ÷ ${p} = ${parca}, kalan ${top * 100 % p} cm.`,
              `✅ Sonuç: En çok ${parca} parça kesilebilir.`,
              `🔁 Kontrol edelim: ${parca} × ${p} = ${parca * p} cm ve ${parca * p} + ${top * 100 % p} = ${top * 100} cm. Artan ${top * 100 % p} cm, bir parça için yetmez.`] }); },
      ],
    },
  });

  /* ============================== TEMA 4 ============================== */
  const DEGISKEN = [["En sevilen meyve", "kategorik"], ["Göz rengi", "kategorik"], ["Gidilen okulun türü", "kategorik"], ["Tutulan takım", "kategorik"], ["Evcil hayvan türü", "kategorik"], ["Okula ulaşım şekli", "kategorik"],
    ["Boy uzunluğu (cm)", "nicel"], ["Haftalık kitap okuma süresi (saat)", "nicel"], ["Kardeş sayısı", "nicel"], ["Matematik sınav puanı", "nicel"], ["Okula uzaklık (km)", "nicel"], ["Günlük ekran süresi (dakika)", "nicel"]];
  konu({
    id: "arastirma", tema: "t4", ad: "Araştırma Sorusu ve Veri Türleri",
    kazanimlar: [{ id: "ar.veri", ad: "Kategorik ve nicel veriyi ayırt etme" }, { id: "ar.soru", ad: "Araştırma sorusu ölçütleri" }, { id: "ar.plan", ad: "Araştırmayı planlama ve anket sorusu" }],
    anlatim: [
      { baslik: "İki tür veri", metin: "<b>Kategorik veri</b> bir özelliği ya da grubu anlatır (renk, takım). <b>Nicel veri</b> sayıyla ölçülür ya da sayılır (boy, puan, kardeş sayısı).", ornek: "“En sevdiğin renk?” → kategorik. “Kaç kardeşin var?” → nicel.",
        durak: { soru: "Hangisi nicel veridir?", secenekler: [["Öğrencilerin boy uzunlukları", true, "Boy sayıyla ölçülür → nicel."], ["Öğrencilerin göz renkleri", false, "Renk bir kategoridir."], ["Öğrencilerin tuttuğu takım", false, "Takım adı bir kategoridir."], ["Öğrencilerin doğduğu şehir", false, "Şehir adı bir kategoridir."]] } },
      { baslik: "İyi bir araştırma sorusu", metin: "İyi bir araştırma sorusu <b>açık</b> ve <b>anlaşılır</b> olmalı, <b>veri toplanarak</b> cevaplanabilmeli ve kimin hakkında olduğu (<b>hedef grup</b>) belli olmalı.", ornek: "Zayıf: “Spor iyi midir?” Güçlü: “Sınıfımızdaki öğrenciler haftada kaç saat spor yapıyor?”",
        durak: { soru: "Hangisi veri toplanarak cevaplanabilecek bir araştırma sorusudur?", secenekler: [["Okulumuzdaki 6. sınıf öğrencileri okula hangi yolla geliyor?", true, "Hedef grup ve toplanacak veri açık."], ["Kediler köpeklerden daha mı güzel?", false, "“Güzel” kişiden kişiye değişir; ölçülemez."], ["Matematik zor mu?", false, "Kimin hakkında olduğu ve neyin ölçüleceği belirsiz."], ["Uzayda kaç yıldız var?", false, "Bu soru için öğrencilerin veri toplaması mümkün değil."]] } },
      { baslik: "Anket sorusu", metin: "Anket soruları <b>tarafsız</b> olmalı, kişiyi bir cevaba <b>yönlendirmemeli</b>. Seçenekler bütün olası cevapları kapsamalı.", ornek: "Yönlendirici: “Futbol en güzel spor değil mi?” Tarafsız: “En sevdiğin spor hangisidir?”",
        durak: { soru: "Hangisi tarafsız bir anket sorusudur?", secenekler: [["Okul kantininde en çok hangi yiyeceği alıyorsun?", true, "Kişiyi bir cevaba yönlendirmiyor."], ["Kantindeki sağlıksız yiyecekler kaldırılmalı değil mi?", false, "“Değil mi?” kişiyi “evet”e yönlendirir."], ["Herkes gibi sen de simidi seviyorsun, değil mi?", false, "“Herkes gibi” ifadesi baskı kurar."], ["Kantin çok pahalı, sence de öyle değil mi?", false, "Görüş dayatıyor."]] } },
    ],
    uret: {
      "ar.veri": [
        z => { const tur = sec(["kategorik", "nicel"]); const d = sec(DEGISKEN.filter(x => x[1] === tur)); const yan = karistir(DEGISKEN.filter(x => x[1] !== tur)).slice(0, 3);
          return S({ kaz: "ar.veri", duzey: "hatirlama", zorluk: 1, soru: `Aşağıdakilerden hangisi ${tur} veridir?`, dogru: d[0],
            dogruNeden: `“${d[0]}” sorusunun cevapları ${tur === "nicel" ? "sayıdır (ölçülür ya da sayılır)" : "birer ad ya da gruptur"}; bu yüzden ${tur} veridir.`,
            yanlis: yan.map(x => [x[0], "kavrama", `“${x[0]}” ${x[1]} veridir: ${x[1] === "nicel" ? "cevapları sayıdır, ölçülür ya da sayılır." : "cevapları bir grup ya da özellik belirtir."}`]),
            ipucu: "Sayıyla ölçülüyor ya da sayılıyorsa nicel; bir grup adıysa kategoriktir.", cozum: [`🔎 Soruyu anlayalım: Seçeneklerdeki verilerden hangisinin ${tur} veri olduğunu bulacağız.`,
              "💡 Hatırlayalım: Nicel veri sayıyla ölçülür ya da sayılır (boy, puan, kardeş sayısı). Kategorik veri bir grup, ad ya da özellik belirtir (renk, takım, şehir).",
              "✏️ Her seçenek için kendimize soralım: Bu soruya verilecek cevaplar sayı mı, yoksa bir ad mı?",
              `✏️ “${d[0]}” için cevaplar ${tur === "nicel" ? "sayıdır" : "birer ad ya da gruptur"}. Diğer seçeneklerin cevapları ise ${tur === "nicel" ? "ad ya da gruptur" : "sayıdır"}.`,
              `✅ Sonuç: “${d[0]}” ${tur} veridir.`,
              "🔁 Kontrol edelim: Örnek bir cevap uydur. “Mavi”, “Futbol” gibi bir cevapsa kategorik; “142”, “3” gibi bir sayıysa nicel veridir."] }); },
        z => { const d = sec(DEGISKEN); const nicel = d[1] === "nicel";
          return S({ kaz: "ar.veri", duzey: "aciklama", zorluk: 1, soru: `“${d[0]}” verisi hangi türdendir?`, dogru: nicel ? "Nicel veri" : "Kategorik veri",
            dogruNeden: nicel ? "Bu verinin cevapları sayıdır; ölçülür ya da sayılır." : "Bu verinin cevapları birer ad ya da gruptur.",
            yanlis: [[nicel ? "Kategorik veri" : "Nicel veri", "kavrama", nicel ? "Bu verinin cevapları sayıdır; bu yüzden nicel veridir." : "Bu verinin cevapları bir grup ya da ad belirtir; bu yüzden kategorik veridir."], ["Her ikisi de", "kavrama", "Bir veri ya kategorik ya da nicel olur; cevaplara bakarak karar verilir."], ["Veri değildir", "bilgi", "Bir gruptan toplanabilen her bilgi veridir."]],
            ipucu: "Cevaplar sayı mı, yoksa ad/kategori mi?", cozum: [`🔎 Soruyu anlayalım: “${d[0]}” verisinin kategorik mi, nicel mi olduğunu belirleyeceğiz.`,
              "💡 Hatırlayalım: Cevaplar sayıysa (ölçülüyor ya da sayılıyorsa) nicel; bir ad, renk ya da grupsa kategorik veridir.",
              `✏️ Bu veride örnek cevaplar düşünelim: ${nicel ? "cevaplar birer sayı olur." : "cevaplar birer ad ya da grup olur."}`,
              `✏️ Cevaplar ${nicel ? "sayı olduğu için ölçülebilir ya da sayılabilir" : "sayı olmadığı için yalnızca gruplara ayrılabilir"}.`,
              `✅ Sonuç: ${nicel ? "Nicel" : "Kategorik"} veri.`,
              "🔁 Kontrol edelim: Bu verinin ortalamasını almak anlamlı mı? Anlamlıysa nicel, anlamsızsa (örneğin göz renklerinin ortalaması) kategorik veridir."] }); },
      ],
      "ar.soru": [
        z => { const iyi = sec(["Sınıfımızdaki öğrenciler günde kaç saat uyuyor?", "Okulumuzdaki öğrencilerin en çok tercih ettiği kulüp hangisidir?", "Sınıfımızdaki öğrencilerin kaç kardeşi var?", "Okulumuzdaki 6. sınıf öğrencileri haftada kaç kitap okuyor?"]);
          return S({ kaz: "ar.soru", duzey: "aciklama", zorluk: 2, soru: "Aşağıdakilerden hangisi iyi bir araştırma sorusudur?", dogru: iyi,
            dogruNeden: "Bu soru açıktır, hedef grubu bellidir ve veri toplanarak cevaplanabilir.",
            yanlis: [["Kitap okumak güzel midir?", "kavrama", "“Güzel” kişiden kişiye değişir, ölçülemez; veri toplanarak cevaplanamaz."], ["İnsanlar ne düşünür?", "kavrama", "Çok genel bir soru; hedef grup ve ölçülecek şey belirsiz."], ["Dünyadaki bütün çocuklar kaç saat uyur?", "strateji", "Hedef grup çok geniş; bu verileri bizim toplamamız mümkün değil."]],
            ipucu: "Veri toplanarak cevaplanabiliyor mu? Hedef grup belli mi?", cozum: ["🔎 Soruyu anlayalım: Dört sorudan hangisinin iyi bir araştırma sorusu olduğunu seçeceğiz.",
              "💡 Hatırlayalım: İyi bir araştırma sorusu açık ve anlaşılırdır, kimin hakkında olduğu (hedef grup) bellidir ve veri toplanarak cevaplanabilir.",
              "✏️ Zayıf soruları eleyelim: “güzel midir?” ölçülemez; “İnsanlar ne düşünür?” belirsiz; “Dünyadaki bütün çocuklar” hedef grubu çok geniş.",
              `✏️ “${iyi}” sorusunda hedef grup belli ve cevaplar anketle ya da sayarak toplanabilir.`,
              `✅ Sonuç: İyi araştırma sorusu “${iyi}”`,
              "🔁 Kontrol edelim: Soruyu okuyunca “Kime soracağım, ne toplayacağım?” sorularının cevabı hemen belli oluyorsa soru iyidir."] }); },
      ],
      "ar.plan": [
        z => S({ kaz: "ar.plan", duzey: "aciklama", zorluk: 2, soru: "Hangisi yönlendirici (taraflı) bir anket sorusudur?", dogru: sec(["Herkesin sevdiği futbol senin de en sevdiğin spor değil mi?", "Ödevler çok fazla, sence de azaltılmalı değil mi?"]),
          dogruNeden: "Bu soru görüşünü baştan söyleyip “değil mi?” diye sorarak kişiyi belli bir cevaba yönlendiriyor.",
          yanlis: [["En sevdiğin spor hangisidir?", "kavrama", "Bu soru tarafsızdır; seçimi kişiye bırakıyor."], ["Haftada kaç saat ödev yapıyorsun?", "kavrama", "Bu soru tarafsızdır; yalnızca bir bilgi istiyor."], ["Okula hangi yolla geliyorsun?", "kavrama", "Bu soru tarafsızdır; kişiyi bir cevaba itmiyor."]],
          ipucu: "Soru kişiyi belli bir cevaba itiyor mu?", cozum: ["🔎 Soruyu anlayalım: Dört anket sorusundan hangisinin kişiyi belli bir cevaba yönlendirdiğini bulacağız.",
            "💡 Hatırlayalım: Anket soruları tarafsız olmalıdır. “Değil mi?”, “herkes gibi”, “sence de” gibi ifadeler kişiyi yönlendirir.",
            "✏️ Tarafsız sorular: “En sevdiğin spor hangisidir?”, “Haftada kaç saat ödev yapıyorsun?”, “Okula hangi yolla geliyorsun?” Bunlar yalnızca bilgi istiyor.",
            "✏️ Yönlendirici soru, cevabı baştan söylüyor ve kişiden onay bekliyor.",
            "✅ Sonuç: “Değil mi?” ile biten ve görüş dayatan soru yönlendiricidir.",
            "🔁 Kontrol edelim: Soruyu okuyan biri “hayır” demekte zorlanıyorsa soru taraflıdır. Tarafsız soruda her cevap eşit kolaylıkta verilir."] }),
        z => { const o = sec([["Sınıftaki öğrencilerin boy uzunlukları", "Ölçüm yapmak", "boy, şerit metre ile ölçülerek bulunur"], ["Öğrencilerin en sevdiği yemek", "Anket yapmak", "en sevilen yemek bir tercihtir; kişilere sorularak öğrenilir"], ["Okul önünden bir saatte geçen araç sayısı", "Gözlem yapmak", "araçlar izlenip sayılarak bulunur"]]);
          return S({ kaz: "ar.plan", duzey: "uygulama", zorluk: 2, soru: `“${o[0]}” hakkında veri toplamak için en uygun yöntem hangisidir?`, dogru: o[1],
            dogruNeden: `Bu veride ${o[2]}.`,
            yanlis: ["Ölçüm yapmak", "Anket yapmak", "Gözlem yapmak", "Tahmin etmek"].filter(x => x !== o[1]).map(x => [x, x === "Tahmin etmek" ? "bilgi" : "strateji", x === "Tahmin etmek" ? "Tahmin etmek veri toplamak değildir; gerçek verilere ulaşmayı sağlamaz." : "Bu yöntem başka tür veriler için uygundur; bu veriyi toplamanın en kolay ve doğru yolu değildir."]),
            ipucu: "Veri sorarak mı, ölçerek mi, yoksa izleyerek mi toplanır?", cozum: [`🔎 Soruyu anlayalım: “${o[0]}” hakkında veriyi en uygun hangi yolla toplayacağımızı seçeceğiz.`,
              "💡 Hatırlayalım: Veri toplama yolları: ölçüm (cetvel, terazi gibi araçlarla), anket (kişilere sorarak), gözlem (izleyip sayarak).",
              `✏️ Toplanacak veriyi düşünelim: ${o[2]}.`,
              "✏️ Tahmin etmek bir veri toplama yöntemi değildir; diğer yöntemler de bu veri için daha zahmetli ya da yanıltıcıdır.",
              `✅ Sonuç: En uygun yöntem: ${o[1]}.`,
              "🔁 Kontrol edelim: Kendine sor: “Bu bilgiyi bir araçla mı ölçerim, birine mi sorarım, yoksa izleyip mi sayarım?” Cevap yöntemi gösterir."] }); },
      ],
    },
  });

  konu({
    id: "merkezi", tema: "t4", ad: "Verileri Görselleştirme ve Merkezî Eğilim", onKosul: ["arastirma"],
    kazanimlar: [{ id: "me.grafik", ad: "Tablo ve grafik okuma, uygun grafik seçme" }, { id: "me.ortalama", ad: "Aritmetik ortalama" }, { id: "me.ortanca", ad: "Ortanca ve tepe değer" }, { id: "me.aciklik", ad: "Açıklık" }],
    anlatim: [
      { baslik: "Uygun grafik", metin: "<b>Kategorik</b> veriler (renk, takım) için <b>sütun grafiği</b>; zaman içindeki değişim için <b>çizgi grafiği</b> uygundur.", ornek: "Sınıfın en sevdiği meyveler → sütun grafiği. Bir haftalık sıcaklık → çizgi grafiği.",
        durak: { soru: "Bir sınıftaki öğrencilerin tuttuğu takımları göstermek için hangi grafik en uygundur?", secenekler: [["Sütun grafiği", true, "Takımlar kategoriktir; sütun grafiği her takımın sayısını karşılaştırır."], ["Çizgi grafiği", false, "Çizgi grafiği zaman içindeki değişimi gösterir."], ["Termometre", false, "Bu bir ölçme aracıdır, grafik değil."], ["Sayı doğrusu", false, "Kategorileri karşılaştırmaz."]] } },
      { baslik: "Ortalama, ortanca, tepe değer", metin: "<b>Ortalama</b>: değerlerin toplamı ÷ veri sayısı. <b>Ortanca</b>: sıraya dizince ortadaki değer. <b>Tepe değer</b>: en çok tekrar eden değer.", ornek: "3, 5, 5, 7, 10 → ortalama 30 ÷ 5 = 6, ortanca 5, tepe değer 5.",
        durak: { soru: "2, 4, 4, 6, 9 verisinin ortancası kaçtır?", secenekler: [["4", true, "Sıralı verinin ortasındaki (3.) değer 4."], ["5", false, "Bu ortalamadır: 25 ÷ 5 = 5."], ["9", false, "Bu en büyük değerdir."], ["6", false, "Ortadaki değer 3. sıradaki 4'tür."]] } },
      { baslik: "Açıklık ve yorum", metin: "<b>Açıklık</b> = en büyük değer − en küçük değer; verinin ne kadar <b>yayıldığını</b> gösterir. Bir uç değer ortalamayı çok, ortancayı az etkiler.", ornek: "10, 12, 13, 15, 60 → ortalama 22 (60 yüzünden yüksek), ortanca 13 daha iyi temsil eder.",
        durak: { soru: "5, 9, 12, 20 verisinin açıklığı kaçtır?", secenekler: [["15", true, "20 − 5 = 15."], ["46", false, "Bu toplamdır."], ["11,5", false, "Bu ortalamadır."], ["10,5", false, "Bu ortancadır."]] } },
    ],
    uret: {
      "me.grafik": [
        z => { const ad = sec([["meyve", ["Elma", "Muz", "Çilek", "Portakal"]], ["spor", ["Futbol", "Voleybol", "Basketbol", "Yüzme"]]]); const d = ad[1].map(() => R(3, 12)); const mx = Math.max(...d); if (d.filter(x => x === mx).length > 1) return null; const i = d.indexOf(mx);
          return S({ kaz: "me.grafik", duzey: "uygulama", zorluk: 1, soru: `Bir sınıfın en sevdiği ${ad[0]} grafiği aşağıdadır. En çok tercih edilen ${ad[0]} hangisidir?`, gorsel: OGR.G.sutun(ad[1].map((a, j) => [a, d[j]]), { baslik: "En sevilen " + ad[0], birim: "kişi" }), dogru: ad[1][i],
            dogruNeden: `${ad[1][i]} sütunu en uzun sütundur (${mx} kişi).`,
            yanlis: ad[1].filter((_, j) => j !== i).map(a => [a, "dikkat", `${a} sütunu daha kısa; sütunların boylarını yeniden karşılaştır.`]),
            ipucu: "En uzun sütunu bul.", cozum: [`🔎 Soruyu anlayalım: Grafikte en çok tercih edilen ${ad[0]} türünü bulacağız.`,
              "💡 Hatırlayalım: Sütun grafiğinde sütunun boyu, o seçeneği kaç kişinin tercih ettiğini gösterir. En uzun sütun en çok tercih edilendir.",
              `✏️ Grafikten değerleri okuyalım: ${ad[1].map((a, j) => a + " " + d[j]).join(", ")}.`,
              `✏️ En büyük değer ${mx}; bu değer ${ad[1][i]} sütununa ait.`,
              `✅ Sonuç: En çok tercih edilen ${ad[0]}: ${ad[1][i]}.`,
              "🔁 Kontrol edelim: Sütunun tepesinden sol taraftaki sayı eksenine yatay bir çizgi çekersen değeri doğru okuduğunu görürsün."] }); },
        z => { const d = [R(4, 15), R(4, 15), R(4, 15), R(4, 15)]; const ad = ["Pzt", "Salı", "Çrş", "Prş"]; const t = d.reduce((a, b) => a + b, 0);
          return S({ kaz: "me.grafik", duzey: "uygulama", zorluk: 2, soru: "Bir kütüphaneden günlere göre ödünç alınan kitap sayıları grafikte verilmiştir. Dört günde toplam kaç kitap ödünç alınmıştır?", gorsel: OGR.G.sutun(ad.map((a, j) => [a, d[j]]), { baslik: "Ödünç alınan kitaplar", birim: "kitap" }), dogru: t,
            dogruNeden: `${d.join(" + ")} = ${t} kitap.`,
            yanlis: [[Math.max(...d), "dikkat", "Bu, yalnızca bir günün değeridir; soru dört günün toplamını istiyor."], [t - d[0], "dikkat", "Pazartesi gününü eklemeyi unuttun."], [t + R(1, 4), "islem", "Toplama işlemini yeniden kontrol et."]],
            ipucu: "Bütün günlerin değerlerini topla.", cozum: ["🔎 Soruyu anlayalım: Dört günde ödünç alınan kitapların toplamını bulacağız.",
              "💡 Hatırlayalım: Her sütunun boyu o günün kitap sayısını gösterir; toplam için bütün sütunların değerleri toplanır.",
              `✏️ Grafikten okuyalım: Pazartesi ${d[0]}, Salı ${d[1]}, Çarşamba ${d[2]}, Perşembe ${d[3]}.`,
              `✏️ Toplayalım: ${d[0]} + ${d[1]} = ${d[0] + d[1]}; ${d[0] + d[1]} + ${d[2]} = ${d[0] + d[1] + d[2]}; ${d[0] + d[1] + d[2]} + ${d[3]} = ${t}.`,
              `✅ Sonuç: Dört günde ${t} kitap ödünç alınmıştır.`,
              `🔁 Kontrol edelim: Toplam, en büyük değerin (${Math.max(...d)}) 4 katından fazla olamaz: ${4 * Math.max(...d)}. ${t} bu sınırın altında; sonuç mantıklı.`] }); },
      ],
      "me.ortalama": [
        z => { const n = sec([4, 5]); let v; do { v = Array.from({ length: n }, () => R(4, 20)); } while (v.reduce((a, b) => a + b, 0) % n); const t = v.reduce((a, b) => a + b, 0); const s = [...v].sort((a, b) => a - b); const ortanca = n % 2 ? s[2] : (s[1] + s[2]) / 2;
          return S({ kaz: "me.ortalama", duzey: "uygulama", zorluk: 1, soru: `${v.join(", ")} verisinin aritmetik ortalaması kaçtır?`, dogru: t / n,
            dogruNeden: `Toplam ${t}, veri sayısı ${n}: ${t} ÷ ${n} = ${t / n}.`,
            yanlis: [[t, "bilgi", "Bu, değerlerin toplamıdır; veri sayısına bölmeyi unuttun."], [od(ortanca), "kavrama", "Bu, ortancadır (sıralı verinin ortası); ortalama ise toplam ÷ veri sayısıdır."], [s[n - 1] - s[0], "kavrama", "Bu, açıklıktır (en büyük − en küçük); ortalama değildir."]],
            ipucu: "Toplamı bul ve veri sayısına böl.", cozum: [`🔎 Soruyu anlayalım: ${n} değerin aritmetik ortalamasını bulacağız.`,
              "💡 Hatırlayalım: Aritmetik ortalama = değerlerin toplamı ÷ veri sayısı.",
              `✏️ Değerleri toplayalım: ${v.join(" + ")} = ${t}.`,
              `✏️ Veri sayısına bölelim: ${t} ÷ ${n} = ${t / n}.`,
              `✅ Sonuç: Aritmetik ortalama ${t / n}.`,
              `🔁 Kontrol edelim: Ortalama, en küçük (${s[0]}) ile en büyük (${s[n - 1]}) değer arasında olmalı; ${t / n} bu aralıkta. Ayrıca ${t / n} × ${n} = ${t}.`] }); },
        z => { const notlar = [R(60, 90), R(60, 90), R(60, 90)]; const hedef = sec([75, 80, 85]); const top3 = notlar.reduce((a, b) => a + b, 0); const gerek = hedef * 4 - top3; if (gerek > 100 || gerek < 40) return null;
          return S({ kaz: "me.ortalama", duzey: "transfer", zorluk: 3, soru: `Ece'nin ilk üç sınav puanı: ${notlar.join(", ")}. Dört sınavın ortalamasının ${hedef} olması için dördüncü sınavdan kaç alması gerekir?`, dogru: gerek,
            dogruNeden: `Dört sınavın toplamı ${hedef} × 4 = ${hedef * 4} olmalı; ${hedef * 4} − ${top3} = ${gerek}.`,
            yanlis: [[hedef, "kavrama", "Hedef ortalamayı dördüncü puan sandın; önce gereken toplamı bulmalısın."], [Math.round(top3 / 3), "kavrama", "Bu, ilk üç sınavın ortalamasıdır; dördüncü sınavda gereken puan değil."], [hedef * 3 - top3 + 2 * hedef > 100 ? gerek + 5 : hedef * 3 - top3 + 2 * hedef, "islem", `Gereken toplamı ${hedef} × 4 = ${hedef * 4} olarak hesaplamalısın.`]],
            ipucu: `Dört sınavın toplamı ${hedef} × 4 olmalı.`, cozum: [`🔎 Soruyu anlayalım: Ece'nin üç puanı belli. Dört sınavın ortalaması ${hedef} olsun diye dördüncü sınavda kaç alması gerektiğini bulacağız.`,
              "💡 Hatırlayalım: Ortalama = toplam ÷ veri sayısı. Buradan toplam = ortalama × veri sayısı.",
              `✏️ Gereken toplam: ${hedef} × 4 = ${hedef * 4}.`,
              `✏️ İlk üç sınavın toplamı: ${notlar.join(" + ")} = ${top3}.`,
              `✅ Sonuç: Dördüncü sınavdan ${hedef * 4} − ${top3} = ${gerek} alması gerekir.`,
              `🔁 Kontrol edelim: (${notlar.join(" + ")} + ${gerek}) ÷ 4 = ${hedef * 4} ÷ 4 = ${hedef}. Hedef ortalamaya ulaştık!`] }); },
      ],
      "me.ortanca": [
        z => { const v = Array.from({ length: 5 }, () => R(2, 30)); const s = [...v].sort((a, b) => a - b); const ort = s[2];
          return S({ kaz: "me.ortanca", duzey: "uygulama", zorluk: 2, soru: `${v.join(", ")} verisinin ortancası kaçtır?`, dogru: ort,
            dogruNeden: `Sıralı veri ${s.join(", ")}; ortadaki (3.) değer ${ort}.`,
            yanlis: [[v[2], "dikkat", "Veriyi sıralamadan ortadaki sayıyı aldın; önce küçükten büyüğe sıralamalısın."], [od(Math.round(v.reduce((a, b) => a + b, 0) / 5 * 10) / 10), "kavrama", "Bu, ortalamadır; ortanca sıralı verinin ortasındaki değerdir."], [s[4] - s[0], "kavrama", "Bu, açıklıktır (en büyük − en küçük)."]],
            ipucu: "Önce veriyi küçükten büyüğe sırala.", cozum: [`🔎 Soruyu anlayalım: ${v.join(", ")} verisinin ortancasını bulacağız.`,
              "💡 Hatırlayalım: Ortanca, veri küçükten büyüğe sıralandığında tam ortada kalan değerdir.",
              `✏️ Sıralayalım: ${s.join(", ")}.`,
              "✏️ 5 veri var; ortadaki değer 3. sıradadır (solunda 2, sağında 2 değer kalır).",
              `✅ Sonuç: Ortanca ${ort}.`,
              `🔁 Kontrol edelim: ${ort} değerinden küçük ya da ona eşit 2 değer solda, büyük ya da eşit 2 değer sağda. Tam ortada!`] }); },
        z => { const t = R(3, 9); const v = karistir([t, t, t, R(10, 15), R(1, 2), R(16, 20)]); const top = v.reduce((a, b) => a + b, 0);
          return S({ kaz: "me.ortanca", duzey: "hatirlama", zorluk: 1, soru: `${v.join(", ")} verisinin tepe değeri kaçtır?`, dogru: t,
            dogruNeden: `${t} sayısı veride 3 kez geçer; diğer değerler birer kez geçer.`,
            yanlis: [[Math.max(...v), "kavrama", "Tepe değer en büyük değer değil, en çok tekrar eden değerdir."], [v.length, "dikkat", "Bu, veri sayısıdır; tepe değer verinin içindeki bir değerdir."], [od(Math.round(top / 6 * 10) / 10), "kavrama", "Bu, ortalamadır; tepe değer en çok tekrar eden değerdir."]],
            ipucu: "En çok tekrar eden değer hangisi?", cozum: [`🔎 Soruyu anlayalım: ${v.join(", ")} verisinin tepe değerini bulacağız.`,
              "💡 Hatırlayalım: Tepe değer, veride en çok tekrar eden değerdir.",
              `✏️ Her değerin kaç kez geçtiğini sayalım: ${t} → 3 kez; diğer değerler → birer kez.`,
              `✏️ En çok tekrar eden değer ${t}.`,
              `✅ Sonuç: Tepe değer ${t}.`,
              "🔁 Kontrol edelim: Veriyi sıralarsan aynı değerler yan yana gelir; en uzun tekrar grubunu kolayca görürsün."] }); },
      ],
      "me.aciklik": [
        z => { const v = Array.from({ length: 6 }, () => R(10, 60)); const mx = Math.max(...v), mn = Math.min(...v);
          return S({ kaz: "me.aciklik", duzey: "uygulama", zorluk: 1, soru: `${v.join(", ")} verisinin açıklığı kaçtır?`, dogru: mx - mn,
            dogruNeden: `En büyük değer ${mx}, en küçük değer ${mn}: ${mx} − ${mn} = ${mx - mn}.`,
            yanlis: [[mx, "bilgi", "Bu, en büyük değerdir; açıklık için en küçük değeri de çıkarmalısın."], [Math.abs(v[v.length - 1] - v[0]), "dikkat", "İlk ve son yazılan değerleri kullandın; en büyük ve en küçük değeri kullanmalısın."], [mx + mn, "islem", "Açıklıkta toplama değil, çıkarma yapılır."]],
            ipucu: "En büyük − en küçük.", cozum: [`🔎 Soruyu anlayalım: ${v.join(", ")} verisinin açıklığını bulacağız.`,
              "💡 Hatırlayalım: Açıklık = en büyük değer − en küçük değer. Verinin ne kadar yayıldığını gösterir.",
              `✏️ En büyük değer: ${mx}.`,
              `✏️ En küçük değer: ${mn}.`,
              `✅ Sonuç: Açıklık ${mx} − ${mn} = ${mx - mn}.`,
              `🔁 Kontrol edelim: ${mn} + ${mx - mn} = ${mx}. Değerleri bulurken sıralama yapmak, gözden kaçırmayı önler.`] }); },
        z => S({ kaz: "me.aciklik", duzey: "baglanti", zorluk: 3, soru: "Bir sınıftaki puanlar: 10, 12, 13, 15, 60. Bu veriyi en iyi temsil eden merkezî eğilim ölçüsü hangisidir? Neden?", dogru: "Ortanca; çünkü 60 uç değeri ortalamayı çok yükseltir.",
          dogruNeden: "Ortalama 22 çıkar ve öğrencilerin çoğunun puanından çok yüksektir; ortanca 13 ise çoğunluğu temsil eder.",
          yanlis: [["Ortalama; çünkü bütün değerleri kullanır.", "kavrama", "Ortalama 22 çıkar; 60 uç değeri yüzünden öğrencilerin çoğunun puanını temsil etmez."], ["Açıklık; çünkü en büyük farkı gösterir.", "bilgi", "Açıklık bir yayılım ölçüsüdür, merkezî eğilim ölçüsü değildir."], ["En büyük değer; çünkü en başarılıyı gösterir.", "kavrama", "En büyük değer yalnızca bir kişiyi gösterir; veriyi temsil etmez."]],
          ipucu: "Ortalamayı ve ortancayı hesaplayıp karşılaştır.", cozum: ["🔎 Soruyu anlayalım: 10, 12, 13, 15, 60 puanlarını en iyi hangi merkezî eğilim ölçüsünün temsil ettiğini bulacağız.",
            "💡 Hatırlayalım: Merkezî eğilim ölçüleri ortalama, ortanca ve tepe değerdir. Uç değer ortalamayı çok, ortancayı az etkiler.",
            "✏️ Ortalama: (10 + 12 + 13 + 15 + 60) ÷ 5 = 110 ÷ 5 = 22.",
            "✏️ Ortanca: Sıralı veride ortadaki değer 13. Beş öğrenciden dördü 10–15 arasında.",
            "✅ Sonuç: Ortanca daha iyi temsil eder; çünkü 60 uç değeri ortalamayı çok yükseltir.",
            "🔁 Kontrol edelim: 60 yerine 16 olsaydı ortalama 13,2 olurdu, ortanca yine 13 kalırdı. Uç değer ortancayı neredeyse hiç etkilemedi."] }),
      ],
    },
  });

  /* ============================== Kayıt ============================== */
  DERS_EKLE({
    id: "mat", ad: "Matematik", kisa: "Mat", simge: "➗", temalar: [T1, T2, T3, T4], konular: KONULAR,
    /* Yazılı sınav kapsamları (veli panelinden değiştirilebilir). */
    yazililar: {
      d1y1: ["carpan", "kat", "bolunebilme", "asal"],
      d1y2: ["asal", "ortakkat", "ortakbolen", "olasilik"],
      d2y1: ["basamak", "yuvarlama", "kesirbolme", "problem"],
      d2y2: ["uzunluk", "arastirma", "merkezi"],
    },
  });
})();
