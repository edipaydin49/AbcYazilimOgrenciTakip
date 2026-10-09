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
            ipucu: "Seçenekteki sayıya böldüğünde kalan 0 oluyor mu?", cozum: [`${n} sayısını seçeneklere böl.`, `${n} ÷ ${d} = ${n / d} ve kalan 0 olduğu için ${d} bir çarpandır.`] }); },
        z => { const n = sec(CARPANLI); const b = bolenler(n); const eksik = sec(b.slice(2, -2)); const liste = b.map(x => x === eksik ? "?" : x).join(", ");
          return S({ kaz: "carpan.bul", duzey: "uygulama", zorluk: 2, soru: `${n} sayısının çarpanları küçükten büyüğe yazılmıştır: ${liste}. Soru işareti yerine hangi sayı gelir?`, dogru: eksik,
            yanlis: [[eksik + 1, "islem", `${n} ÷ ${eksik + 1} kalanlıdır.`], [eksik * 2 <= n && n % (eksik * 2) ? eksik * 2 : eksik + 2, "islem", "Bu sayı listede yer alamaz; böl ve kalanı kontrol et."], [n / eksik + 1, "dikkat", "Çarpan çiftinin diğer elemanını değil, eksik olanı bulmalısın."]],
            ipucu: "Eksik sayının çarpan çiftini düşün: ? × ... = " + n, cozum: [`Çarpan çiftleri: ${b.slice(0, Math.ceil(b.length / 2)).map(x => x + "×" + n / x).join(", ")}.`, `Eksik çarpan ${eksik}${ek(eksik, "dir")} (${eksik} × ${n / eksik} = ${n}).`] }); },
        z => { const a = R(3, 9), b = R(3, 9), n = a * b;
          return S({ kaz: "carpan.bul", duzey: "aciklama", zorluk: 1, soru: `${a} × ${b} = ${n} olduğuna göre aşağıdakilerden hangisi kesinlikle doğrudur?`, dogru: `${a} ve ${b}, ${n} sayısının çarpanlarıdır.`,
            yanlis: [[`${n}, ${a} sayısının çarpanıdır.`, "kavrama", "Çarpan ile katı karıştırdın: büyük sayı küçüklerin katıdır."], [`${a}, ${n} sayısının katıdır.`, "kavrama", `${a}, ${n}${ek(n, "in")} katı değil çarpanıdır.`], [`${n} asal sayıdır.`, "bilgi", `${n} sayısının 1 ve kendisi dışında çarpanları (${a}, ${b}) var; asal değildir.`]],
            ipucu: "Çarpılan sayılar sonuçla nasıl bir ilişki içindedir?", cozum: [`Çarpımı ${n} olan sayılar ${n}${ek(n, "i")} kalansız böler.`, `Bu yüzden ${a} ve ${b}, ${n}${ek(n, "in")} çarpanlarıdır; ${n} ise onların katıdır.`] }); },
      ],
      "carpan.say": [
        z => { const n = sec(CARPANLI); const d = bolenler(n).length;
          return S({ kaz: "carpan.say", duzey: "uygulama", zorluk: 2, soru: `${n} sayısının kaç tane çarpanı vardır?`, dogru: d,
            yanlis: [[d - 2, "dikkat", "1'i ve sayının kendisini de saymalısın."], [Math.ceil(d / 2), "kavrama", "Bu, çarpan çiftlerinin sayısıdır; her çiftte iki çarpan vardır."], [d + 1, "islem", "Kareli sayılarda ortadaki çarpan yalnızca bir kez sayılır."]],
            ipucu: "Çarpan çiftlerini 1'den başlayarak yaz.", cozum: [`Çarpanlar: ${bolenler(n).join(", ")}.`, `Toplam ${d} çarpan.`] }); },
        z => { const n = sec([24, 30, 36, 40, 48, 60]); const d = bolenler(n).length - 2;
          return S({ kaz: "carpan.say", duzey: "transfer", zorluk: 3, soru: `${n} öğrenci, her grupta eşit sayıda öğrenci olacak ve kimse açıkta kalmayacak şekilde gruplara ayrılacak. Her grupta en az 2 öğrenci ve en az 2 grup olacaksa kaç farklı gruplama yapılabilir?`, dogru: d,
            yanlis: [[d + 2, "dikkat", "“En az 2 öğrenci ve en az 2 grup” koşulu 1 ve sayının kendisini dışarıda bırakır."], [Math.ceil((d + 2) / 2), "kavrama", "5'erli grup ile 5 grup farklı gruplamalardır; çiftleri değil çarpanları saymalısın."], [d + 1, "dikkat", "Koşullardan birini atlamışsın."]],
            ipucu: "Grup büyüklüğü, öğrenci sayısının bir çarpanı olmalı. Hangi çarpanlar koşulu sağlamaz?", cozum: [`${n}${ek(n, "in")} çarpanları: ${bolenler(n).join(", ")}.`, `1 (tek kişilik gruplar) ve ${n} (tek grup) koşula uymaz.`, `Kalan çarpan sayısı: ${d}.`] }); },
      ],
      "carpan.model": [
        z => { const n = sec([12, 16, 18, 20, 24, 30, 36]); const d = Math.ceil(bolenler(n).length / 2);
          return S({ kaz: "carpan.model", duzey: "transfer", zorluk: 2, soru: `${n} birim karenin tamamı kullanılarak, aralarında boşluk kalmadan kaç farklı dikdörtgen oluşturulabilir? (2×3 ile 3×2 aynı kabul edilir.)`, dogru: d,
            yanlis: [[bolenler(n).length, "kavrama", "Her dikdörtgen bir çarpan çiftidir; çarpan sayısını değil çift sayısını say."], [d - 1, "dikkat", "Kare de bir dikdörtgendir; onu da say."], [d + 2, "islem", "Çarpan çiftlerini yeniden kontrol et."]],
            ipucu: "Her dikdörtgenin kenarları çarpımı " + n + " olan iki sayıdır.", cozum: [`Çarpan çiftleri: ${bolenler(n).filter(x => x * x <= n).map(x => x + "×" + n / x).join(", ")}.`, `${d} farklı dikdörtgen.`] }); },
        z => { const a = R(2, 6), b = R(a + 1, 12), n = a * b;
          return S({ kaz: "carpan.model", duzey: "aciklama", zorluk: 1, soru: `Birim karelerle kurulan ${a} × ${b} boyutlarındaki dikdörtgen hangi sayının bir çarpan çiftini gösterir?`, dogru: n,
            yanlis: [[a + b, "kavrama", "Kenarları toplamadın, çarpmalısın: dikdörtgendeki kare sayısı çarpımdır."], [2 * (a + b), "kavrama", "Bu çevre uzunluğudur; birim kare sayısı alandır."], [n + a, "islem", "Çarpımı yeniden hesapla."]],
            ipucu: "Dikdörtgende kaç birim kare vardır?", cozum: [`${a} × ${b} = ${n} birim kare.`, `Yani ${a} ile ${b}, ${n}${ek(n, "in")} çarpan çiftidir.`] }); },
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
            ipucu: `${k} ile çarpım tablosunu düşün.`, cozum: [`Bir sayının katları, o sayının 1, 2, 3, … ile çarpımıdır: ${k}, ${2 * k}, ${3 * k}, …`, `Seçenekleri ${k}${ek(k, "e")} böl: ${d} ÷ ${k} = ${d / k}, kalan 0.`, `Demek ki ${k} × ${d / k} = ${d}; ${d}, ${k}${ek(k, "in")} katıdır.`] }); },
        z => { const k = R(4, 12), s = R(4, 9);
          return S({ kaz: "kat.bul", duzey: "uygulama", zorluk: 1, soru: `${k} sayısının sıfırdan büyük katları küçükten büyüğe sıralandığında ${s}. sırada hangi sayı bulunur?`, dogru: k * s,
            yanlis: [[k * (s - 1), "dikkat", "Bir önceki katı buldun; sırayı yeniden say."], [k * (s + 1), "dikkat", "0'ı sıraya dahil etmiş olabilirsin; soru sıfırdan büyük katları istiyor."], [k + s, "kavrama", "Kat, çarpımla bulunur; toplama yapmamalısın."]],
            ipucu: `${s}. kat = ${k} × ${s}.`, cozum: [`Sıfırdan büyük katlar: 1. kat ${k} × 1 = ${k}, 2. kat ${k} × 2 = ${2 * k}, 3. kat ${k} × 3 = ${3 * k} …`, `Kaçıncı kat isteniyorsa ${k} o sayıyla çarpılır.`, `${s}. kat: ${k} × ${s} = ${k * s}.`] }); },
        z => S({ kaz: "kat.bul", duzey: "aciklama", zorluk: 2, soru: "Katlar ile ilgili aşağıdakilerden hangisi doğrudur?", dogru: "0 her doğal sayının katıdır.",
          yanlis: [["Bir sayının katları sınırlı sayıdadır.", "bilgi", "Katlar sonsuza kadar devam eder."], ["Bir sayının katı her zaman o sayıdan küçüktür.", "kavrama", "Katlar sayının kendisine eşit ya da ondan büyüktür (0 hariç)."], ["1 hiçbir sayının katı değildir.", "kavrama", "1, 1'in katıdır (1 × 1 = 1)."]],
          ipucu: "Herhangi bir sayıyı 0 ile çarparsan ne elde edersin?", cozum: ["Her sayı × 0 = 0.", "Bu yüzden 0 her sayının katıdır."] }),
      ],
      "kat.aralik": [
        z => { const k = R(4, 12), a = R(10, 40), b = a + R(30, 60); let n = 0; for (let x = a + 1; x < b; x++) if (x % k === 0) n++;
          return S({ kaz: "kat.aralik", duzey: "uygulama", zorluk: 2, soru: `${a} ile ${b} arasında ${k} sayısının kaç katı vardır?`, dogru: n,
            yanlis: [[n + 1, "dikkat", "“Arasında” denince uç sayılar dahil edilmez; aralığın dışındaki bir katı saymış olabilirsin."], [Math.floor((b - a) / k) + 1, "strateji", "Farkı bölmek yaklaşık sonuç verir; ilk ve son katı bulup say."], [n - 1, "islem", "İlk ya da son katı unutmuş olabilirsin."]],
            ipucu: "Aralıktaki ilk katı ve son katı bul.", cozum: [`İlk kat: ${Math.floor(a / k + 1) * k}, son kat: ${Math.ceil(b / k - 1) * k}.`, `Bu aralıkta ${n} kat vardır.`] }); },
        z => { const k = R(6, 17), n = Math.floor(99 / k) * k;
          return S({ kaz: "kat.aralik", duzey: "uygulama", zorluk: 2, soru: `${k} sayısının katı olan en büyük iki basamaklı sayı kaçtır?`, dogru: n,
            yanlis: [[99, "kavrama", `99, ${k}${ek(k, "in")} katı olmayabilir; kalansız bölünmeli.`], [n - k, "dikkat", "Daha büyük bir iki basamaklı kat var."], [n + k, "dikkat", "Bu sayı üç basamaklı olabilir; kontrol et."]],
            ipucu: `99'u ${k}${ek(k, "e")} böl, kalanı çıkar.`, cozum: [`99 ÷ ${k} = ${Math.floor(99 / k)}, kalan ${99 % k}.`, `99 − ${99 % k} = ${n}.`] }); },
      ],
      "kat.problem": [
        z => { const k = sec([5, 6, 10, 12, 15, 20]), sure = sec([60, 90, 120]);
          return S({ kaz: "kat.problem", duzey: "transfer", zorluk: 2, soru: `Bir otobüs saat 08.00'de duraktan kalkıyor ve ${k} dakikada bir yeni otobüs kalkıyor. 08.00 ile ${sure} dakika sonrası arasında (ikisi de dahil) kaç otobüs kalkar?`, dogru: sure / k + 1,
            yanlis: [[sure / k, "dikkat", "08.00'deki ilk otobüsü saymayı unuttun."], [sure / k + 2, "islem", "Bir fazla saydın; 0, " + k + ", " + 2 * k + " … şeklinde say."], [k, "kavrama", "Kalkış aralığı ile otobüs sayısı farklıdır."]],
            ipucu: `Kalkış zamanları ${k}${ek(k, "in")} katlarıdır: 0, ${k}, ${2 * k}, …`, cozum: [`Otobüsler 0. dakikada ve sonra her ${k} dakikada kalkar: 0, ${k}, ${2 * k}, … Bunlar ${k}${ek(k, "in")} katlarıdır.`, `${sure} ÷ ${k} = ${sure / k}; yani 0'dan sonra ${sure / k} otobüs daha kalkar.`, `08.00'deki ilk otobüsü de ekle: ${sure / k} + 1 = ${sure / k + 1} otobüs.`] }); },
        z => { const k = sec([4, 6, 9]), a = 40, b = 90; const d = sec([...Array(b - a).keys()].map(x => x + a).filter(x => x % k === 0)); const yan = karistir([...Array(b - a).keys()].map(x => x + a).filter(x => x % k)).slice(0, 3);
          return S({ kaz: "kat.problem", duzey: "transfer", zorluk: 2, soru: `Bir kutudaki kalemler ${k}${ek(k, "er")} ${k}${ek(k, "er")} sayıldığında hiç artmıyor. Kalem sayısı 40 ile 90 arasındaysa aşağıdakilerden hangisi kalem sayısı olabilir?`, dogru: d,
            yanlis: yan.map(x => [x, "islem", `${x} ÷ ${k} kalanlıdır; kalem artardı.`]),
            ipucu: `“Hiç artmıyor” demek kalem sayısının ${k}${ek(k, "in")} katı olması demektir.`, cozum: [`${k}${ek(k, "er")} sayınca hiç artmıyorsa kalem sayısı ${k}${ek(k, "in")} katıdır.`, `Seçenekleri ${k}${ek(k, "e")} böl ve kalanı 0 olanı bul.`, `${d} ÷ ${k} = ${d / k}, kalan 0. Cevap ${d}.`] }); },
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
            ipucu: `${b} ile bölünebilme kuralı: ${kural}.`, cozum: [`Kural: ${kural}.`, `${d} sayısı bu kuralı sağlar: ${d} ÷ ${b} = ${d / b}.`] }); },
      ],
      "bol.rakam": [
        z => { const b = sec([3, 9]); const a = R(1, 9), c = R(0, 9); const uygun = [...Array(10).keys()].filter(x => (a + x + c) % b === 0); const d = Math.max(...uygun); const yan = [...Array(10).keys()].filter(x => !uygun.includes(x));
          return S({ kaz: "bol.rakam", duzey: "uygulama", zorluk: 2, soru: `${a}A${c} üç basamaklı sayısı ${b} ile kalansız bölünebildiğine göre A yerine yazılabilecek en büyük rakam kaçtır?`, dogru: d,
            yanlis: [[Math.min(...uygun), "dikkat", "Bu, yazılabilecek en küçük rakamdır; soru en büyüğünü istiyor."], [sec(yan), "islem", "Rakamlar toplamı " + b + "'ün katı olmuyor."], [9 === d ? 8 : 9, "islem", "Rakamlar toplamını yeniden kontrol et."]],
            ipucu: `${a} + A + ${c} toplamı ${b}${ek(b, "in")} katı olmalı.`, cozum: [`${a} + ${c} = ${a + c}.`, `A için uygun rakamlar: ${uygun.join(", ")}.`, `En büyüğü ${d}.`] }); },
        z => { const a = R(1, 9), b2 = R(0, 9); const uygun = [0, 2, 4, 6, 8].filter(x => (a + b2 + x) % 3 === 0); if (!uygun.length) return null; const d = uygun.length;
          return S({ kaz: "bol.rakam", duzey: "transfer", zorluk: 3, soru: `${a}${b2}A üç basamaklı sayısı 6 ile kalansız bölünüyor. A yerine kaç farklı rakam yazılabilir?`, dogru: d,
            yanlis: [[[...Array(10).keys()].filter(x => (a + b2 + x) % 3 === 0).length, "kavrama", "6'ya bölünmek için sayının çift olması da gerekir; yalnızca 3 kuralını uyguladın."], [5, "kavrama", "Yalnızca çift olma şartına baktın; 3 kuralı da gerekir."], [d + 1, "islem", "Uygun rakamları yeniden say."]],
            ipucu: "6 ile bölünme = hem 2 ile hem 3 ile bölünme.", cozum: ["A çift olmalı: 0, 2, 4, 6, 8.", `${a} + ${b2} + A toplamı 3'ün katı olmalı.`, `Uygun rakamlar: ${uygun.join(", ")} → ${d} tane.`] }); },
      ],
      "bol.ayirt": [
        z => S({ kaz: "bol.ayirt", duzey: "aciklama", zorluk: 2, soru: "Bölünebilme kuralları ile ilgili aşağıdakilerden hangisi doğrudur?", dogru: sec(["9 ile bölünebilen her sayı 3 ile de bölünebilir.", "10 ile bölünebilen her sayı 5 ile de bölünebilir.", "4 ile bölünebilen her sayı 2 ile de bölünebilir."]),
          yanlis: [["3 ile bölünebilen her sayı 9 ile de bölünebilir.", "kavrama", "Ters yönde geçerli değil: 12, 3'e bölünür ama 9'a bölünmez."], ["2 ile bölünebilen her sayı 4 ile de bölünebilir.", "kavrama", "6, 2'ye bölünür ama 4'e bölünmez."], ["5 ile bölünebilen her sayı 10 ile de bölünebilir.", "kavrama", "15, 5'e bölünür ama 10'a bölünmez."]],
          ipucu: "Her birini bir örnekle dene.", cozum: ["Bir kuralın diğerini kapsaması için büyük bölen küçüğün katı olmalı.", "9 = 3 × 3 olduğu için 9'a bölünen 3'e de bölünür; tersi her zaman doğru değildir."] }),
        z => { const x = sec([126, 342, 504, 738, 216]);
          return S({ kaz: "bol.ayirt", duzey: "baglanti", zorluk: 3, soru: `${x} sayısı için aşağıdakilerden hangisi yanlıştır?`, dogru: `${x}, 5 ile kalansız bölünür.`,
            yanlis: [[`${x}, 2 ile kalansız bölünür.`, "dikkat", "Bu ifade doğru (çift sayı). Soru yanlış olanı istiyor."], [`${x}, 9 ile kalansız bölünür.`, "dikkat", "Bu ifade doğru (rakamlar toplamı 9'un katı). Soru yanlış olanı istiyor."], [`${x}, 6 ile kalansız bölünür.`, "dikkat", "Bu ifade doğru (hem 2'ye hem 3'e bölünür). Soru yanlış olanı istiyor."]],
            ipucu: "Soru “yanlış” olanı soruyor. Her ifadeyi kontrol et.", cozum: [`${x} çifttir, rakamları toplamı ${String(x).split("").reduce((a, b) => a + +b, 0)} (9'un katı).`, "Birler basamağı 0 ya da 5 olmadığı için 5'e bölünmez."] }); },
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
            ipucu: "Tek sayı olmak asal olmak demek değildir. Küçük asal sayılara bölmeyi dene.", cozum: [`${d} sayısı 2, 3, 5, 7'ye kalansız bölünmez.`, `${d}${ek(d, "in")} yalnızca iki çarpanı var: 1 ve ${d}.`] }); },
        z => { const a = sec([10, 20, 30, 40, 50]), b = a + 20; const n = [...Array(b - a - 1).keys()].map(x => x + a + 1).filter(asalMi).length;
          return S({ kaz: "asal.tani", duzey: "uygulama", zorluk: 2, soru: `${a} ile ${b} arasında kaç tane asal sayı vardır?`, dogru: n,
            yanlis: [[n + 1, "kavrama", "Asal olmayan bir tek sayıyı (ör. 21, 27, 33) asal saymış olabilirsin."], [n - 1, "dikkat", "Bir asal sayıyı atlamış olabilirsin."], [10, "kavrama", "Aralıktaki tek sayıların hepsi asal değildir."]],
            ipucu: "Aralıktaki tek sayıları yaz, 3 ve 7'ye bölünenleri ele.", cozum: [`Asal sayılar: ${[...Array(b - a - 1).keys()].map(x => x + a + 1).filter(asalMi).join(", ")}.`, `Toplam ${n} tane.`] }); },
      ],
      "asal.ayir": [
        z => { const n = sec([12, 18, 20, 24, 28, 36, 40, 45, 48, 54, 60, 72, 84, 90, 100, 120]); const c = asalCarpan(n); const ps = Object.keys(c).map(Number);
          const y1 = { ...c }; y1[ps[0]] = c[ps[0]] + 1; const y2 = { ...c }; y2[ps[ps.length - 1]] = Math.max(1, c[ps[ps.length - 1]] - 1) === c[ps[ps.length - 1]] ? c[ps[ps.length - 1]] + 1 : c[ps[ps.length - 1]] - 1;
          const bilesik = bolenler(n).filter(x => x > 1 && x < n && !asalMi(x));
          return S({ kaz: "asal.ayir", duzey: "uygulama", zorluk: 2, soru: `${n} sayısının asal çarpanlarına ayrılmış hâli hangisidir?`, dogru: ustlu(c),
            yanlis: [[ustlu(y1), "islem", "Bir asal çarpanın kuvvetini fazla saymışsın; çarpımı " + n + " etmiyor."], [ustlu(y2), "islem", "Kuvvetlerden biri hatalı; çarpımı kontrol et."], [bilesik.length ? `${bilesik[0]} · ${n / bilesik[0]}` : ps.join(" · "), "kavrama", "Bu çarpanlardan biri asal değil; asal çarpanlara kadar ayırmalısın."]],
            ipucu: "En küçük asal sayı olan 2'den başlayarak böl.", cozum: [`${n} sayısını sırayla asal sayılara böl.`, `${n} = ${ustlu(c)}.`] }); },
        z => { const n = sec([60, 72, 84, 90, 108, 120, 126, 150, 180]); const c = asalCarpan(n);
          return S({ kaz: "asal.ayir", duzey: "aciklama", zorluk: 2, soru: `Asal çarpanlarına ayrılmış hâli ${ustlu(c)} olan sayı kaçtır?`, dogru: n,
            yanlis: [[Object.entries(c).reduce((s, [p, k]) => s + p * k, 0), "kavrama", "Üslü ifadeyi çarpma yerine p × k olarak hesapladın."], [n / 2, "islem", "Bir çarpanı eksik hesapladın."], [n * 2, "islem", "Bir çarpanı fazla hesapladın."]],
            ipucu: "Kuvvetleri aç ve hepsini çarp.", cozum: [`Üslü ifadeyi aç: üs, tabanın kaç kez çarpıldığını gösterir.`, `${ustlu(c)} = ${Object.entries(c).map(([p, k]) => Array(k).fill(p).join(" · ")).join(" · ")}`, `Hepsini çarp: sonuç ${n}.`] }); },
      ],
      "asal.kavram": [
        z => S({ kaz: "asal.kavram", duzey: "aciklama", zorluk: 1, soru: "Asal sayılarla ilgili hangisi doğrudur?", dogru: sec(["2, çift olan tek asal sayıdır.", "Asal sayıların yalnızca iki çarpanı vardır."]),
          yanlis: [["1 en küçük asal sayıdır.", "bilgi", "1 asal değildir; en küçük asal sayı 2'dir."], ["Bütün tek sayılar asaldır.", "kavrama", "9, 15, 21 gibi tek sayılar asal değildir."], ["Asal sayıların hiç çarpanı yoktur.", "kavrama", "Asal sayıların iki çarpanı vardır: 1 ve kendisi."]],
          ipucu: "Asal sayının tanımını hatırla: kaç çarpanı vardır?", cozum: ["Asal sayı: tam olarak iki çarpanı olan sayı.", "2'nin çarpanları 1 ve 2 → asal ve çift."] }),
        z => { const n = sec([30, 42, 66, 70, 78, 105, 110]); const t = Object.keys(asalCarpan(n)).map(Number).reduce((a, b) => a + b, 0);
          return S({ kaz: "asal.kavram", duzey: "baglanti", zorluk: 3, soru: `${n} sayısının farklı asal çarpanlarının toplamı kaçtır?`, dogru: t,
            yanlis: [[t + 1, "bilgi", "1'i asal çarpan olarak eklemiş olabilirsin; 1 asal değildir."], [bolenler(n).filter(x => x > 1 && x < n).slice(0, 3).reduce((a, b) => a + b, 0), "kavrama", "Asal olmayan çarpanları da toplamış olabilirsin."], [t - 2, "islem", "Asal çarpanlardan birini atlamış olabilirsin."]],
            ipucu: "Önce asal çarpanlarına ayır, sonra farklı olanları topla.", cozum: [`${n} = ${ustlu(asalCarpan(n))}.`, `Farklı asal çarpanlar toplamı: ${Object.keys(asalCarpan(n)).join(" + ")} = ${t}.`] }); },
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
          return S({ kaz: "okat.ekok", duzey: "uygulama", zorluk: 1, soru: `${a} ve ${b} sayılarının en küçük ortak katı kaçtır?`, dogru: e,
            yanlis: [[a * b, "strateji", "Sayıları çarpmak her zaman ortak kat verir ama en küçüğünü vermeyebilir."], [ebob(a, b), "kavrama", "Bu en büyük ortak bölendir; ortak katla karıştırdın."], [e * 2, "dikkat", "Bu bir ortak kattır ama en küçüğü değildir."]],
            ipucu: "Büyük sayının katlarını sırayla yaz; küçük sayıya bölünen ilkini bul.", cozum: [`${b}${ek(b, "in")} katları: ${[1, 2, 3, 4].map(i => b * i).join(", ")}…`, `${a}${ek(a, "e")} bölünen ilk kat: ${e}.`] }); },
        z => { const [a, b] = sec([[4, 6], [6, 8], [3, 5], [4, 10], [6, 9]]); const s = R(1, 30), t = s + R(40, 70); let n = 0; for (let x = s + 1; x < t; x++) if (x % a === 0 && x % b === 0) n++;
          return S({ kaz: "okat.ekok", duzey: "baglanti", zorluk: 3, soru: `${s} ile ${t} arasında hem ${a} sayısının hem de ${b} sayısının katı olan kaç sayı vardır?`, dogru: n,
            yanlis: [[n + 1, "dikkat", "Aralığın dışında kalan bir sayıyı saymış olabilirsin."], [Math.floor((t - s) / (a * b)), "strateji", `Ortak katlar ${ekok(a, b)}${ek(ekok(a, b), "in")} katlarıdır; ${a * b}${ek(a * b, "in")} değil.`], [n + 2, "islem", "Ortak katları tek tek yazarak say."]],
            ipucu: `Ortak katlar, EKOK(${a}, ${b}) = ${ekok(a, b)} sayısının katlarıdır.`, cozum: [`EKOK = ${ekok(a, b)}.`, `Aralıktaki katları: ${[...Array(t - s - 1).keys()].map(x => x + s + 1).filter(x => x % ekok(a, b) === 0).join(", ") || "yok"}.`] }); },
      ],
      "okat.problem": [
        z => { const [a, b] = sec([[6, 8], [10, 15], [12, 18], [15, 20], [9, 12], [20, 30]]); const e = ekok(a, b);
          return S({ kaz: "okat.problem", duzey: "transfer", zorluk: 2, soru: `Bir parkta lambalardan biri ${a} dakikada bir, diğeri ${b} dakikada bir yanıyor. İki lamba birlikte yandıktan en az kaç dakika sonra yine birlikte yanar?`, dogru: e, birim: "",
            yanlis: [[a * b === e ? e * 2 : a * b, "strateji", "Çarpım bir ortak kattır ama en az süre değildir."], [ebob(a, b), "kavrama", "“Birlikte tekrar” sorusu ortak kat ister; ortak bölen bulmuşsun."], [a + b, "kavrama", "Süreleri toplamak birlikte yanma anını vermez."]],
            ipucu: "“Birlikte tekrar ne zaman?” sorusu hangi kavramı ister?", cozum: [`İki lambanın birlikte yandığı anlar ${a} ve ${b}${ek(b, "in")} ortak katlarıdır.`, `En az süre EKOK(${a}, ${b}) = ${e} dakika.`] }); },
        z => { const [a, b] = sec([[3, 4], [4, 5], [4, 6], [5, 6], [3, 5]]); const k = R(1, Math.min(a, b) - 1); const e = ekok(a, b);
          return S({ kaz: "okat.problem", duzey: "transfer", zorluk: 3, soru: `Bir sınıftaki öğrenciler ${a}${ek(a, "er")}li ve ${b}${ek(b, "er")}li gruplara ayrıldığında her seferinde ${k} öğrenci açıkta kalıyor. Sınıfta ${k} kişiden fazla öğrenci olduğuna göre en az kaç öğrenci vardır?`, dogru: e + k,
            yanlis: [[e, "dikkat", `Açıkta kalan ${k} öğrenciyi eklemeyi unuttun.`], [e - k, "kavrama", "Kalan öğrenciler çıkarılmaz, eklenir."], [a * b + k === e + k ? e * 2 + k : a * b + k, "strateji", "En küçük ortak katı kullanmalısın."]],
            ipucu: `Öğrenci sayısının ${k} eksiği hem ${a}${ek(a, "in")} hem ${b}${ek(b, "in")} katı olmalı.`, cozum: [`Öğrenci sayısı − ${k} = EKOK(${a}, ${b}) = ${e}.`, `Öğrenci sayısı = ${e} + ${k} = ${e + k}.`] }); },
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
          return S({ kaz: "obol.ebob", duzey: "uygulama", zorluk: 1, soru: `${a} ve ${b} sayılarının en büyük ortak böleni kaçtır?`, dogru: g,
            yanlis: [[ekok(a, b), "kavrama", "Bu en küçük ortak kattır; ortak bölenle karıştırdın."], [g / 2 >= 1 && g % 2 === 0 ? g / 2 : g + 1, "dikkat", "Bu bir ortak bölen ama en büyüğü değil."], [b - a, "kavrama", "Farkı almak ortak böleni vermez."]],
            ipucu: "Küçük sayının bölenlerini büyükten küçüğe dene.", cozum: [`${a}${ek(a, "in")} bölenleri: ${bolenler(a).join(", ")}.`, `${b}${ek(b, "i")} de bölen en büyüğü: ${g}.`] }); },
      ],
      "obol.problem": [
        z => { const [a, b] = sec([[36, 48], [24, 40], [30, 42], [45, 60], [54, 72], [60, 84]]); const g = ebob(a, b);
          return S({ kaz: "obol.problem", duzey: "transfer", zorluk: 2, soru: `${a} m ve ${b} m uzunluğundaki iki ip, hiç artmayacak şekilde eşit uzunlukta parçalara ayrılacak. Parçalar mümkün olan en uzun boyda olursa toplam kaç parça elde edilir?`, dogru: (a + b) / g,
            yanlis: [[g, "dikkat", "Bu bir parçanın uzunluğudur; soru parça sayısını istiyor."], [(a + b) / (g / 2), "strateji", "Daha kısa parçalar kullandın; en uzun parça EBOB'dur."], [ekok(a, b), "kavrama", "“Eşit parçalara ayırma” ortak bölen ister."]],
            ipucu: "Önce en uzun parça boyunu (EBOB) bul, sonra parça sayısını hesapla.", cozum: [`En uzun parça: EBOB(${a}, ${b}) = ${g} m.`, `${a} / ${g} + ${b} / ${g} = ${a / g} + ${b / g} = ${(a + b) / g} parça.`] }); },
        z => { const [a, b] = sec([[12, 18], [24, 36], [20, 28], [36, 60], [30, 42]]); const g = ebob(a, b);
          return S({ kaz: "obol.problem", duzey: "transfer", zorluk: 3, soru: `Boyutları ${a} m ve ${b} m olan dikdörtgen bir bahçe, hiç boşluk kalmadan eş karelere bölünecek. Kareler mümkün olan en büyük boyutta olursa kaç kare oluşur?`, dogru: (a / g) * (b / g),
            yanlis: [[g, "dikkat", "Bu karenin kenar uzunluğu; soru kare sayısını istiyor."], [a / g + b / g, "islem", "Kare sayısı için satır ve sütun sayısı çarpılmalı, toplanmamalı."], [(a * b) / 4, "strateji", "En büyük kare EBOB ile bulunur."]],
            ipucu: "Karenin kenarı iki kenarı da tam bölmeli ve en büyük olmalı.", cozum: [`Kare kenarı = EBOB(${a}, ${b}) = ${g} m.`, `${a / g} sıra × ${b / g} sütun = ${(a / g) * (b / g)} kare.`] }); },
      ],
      "obol.ayirt": [
        z => { const o = sec([
            ["Bir fabrikada 48 ve 60 litrelik iki tank, hiç artmayacak şekilde eşit ve en büyük hacimli bidonlara boşaltılacak.", "Ortak bölen (EBOB)", "“Eşit ve en büyük parçalara ayırma” ortak bölen ister."],
            ["Biri 8, diğeri 12 günde bir sulanan iki çiçek bugün birlikte sulandı. Yine birlikte ne zaman sulanır?", "Ortak kat (EKOK)", "“Birlikte tekrar ne zaman” ortak kat ister."],
            ["Kenarları 6 cm ve 9 cm olan kartonlar yan yana dizilerek en küçük kare oluşturulacak.", "Ortak kat (EKOK)", "Kartonlar dizildikçe kenar uzar; en küçük kare ortak kat ister."],
            ["30 kalem ve 45 silgi, eşit sayıda olacak şekilde en çok kaç öğrenciye dağıtılır?", "Ortak bölen (EBOB)", "Eşit paylaştırma ve “en çok kişi” ortak bölen ister."]]);
          return S({ kaz: "obol.ayirt", duzey: "aciklama", zorluk: 2, soru: `“${o[0]}” Bu problemi çözmek için hangi kavram kullanılır?`, dogru: o[1], dogruNeden: o[2],
            yanlis: [[o[1].startsWith("Ortak bölen") ? "Ortak kat (EKOK)" : "Ortak bölen (EBOB)", "kavrama", "İki kavramı karıştırdın: " + o[2]], ["Asal çarpanların toplamı", "kavrama", "Bu problem bir ortak kat ya da ortak bölen ister."], ["Sayıların farkı", "bilgi", "Farkı almak bu tür problemleri çözmez."]],
            ipucu: "Büyüyen bir şey mi arıyorsun (kat), yoksa parçalara mı bölüyorsun (bölen)?", cozum: ["Problemdeki anahtar sözcüklere bak: “eşit parçalara ayırma, en büyük, en çok kişiye dağıtma” → ortak bölen; “birlikte tekrar, en az, en küçük kare/zaman” → ortak kat.", o[2], `Bu yüzden cevap: ${o[1]}.`] }); },
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
        z => { const n = sec([20, 40, 50, 60, 80, 100]); const k = R(Math.ceil(n / 10), Math.floor(n * 0.6)); const nesne = sec(["Bir zar", "Bir çark", "Bir para"]);
          return S({ kaz: "ol.tahmin", duzey: "uygulama", zorluk: 1, soru: `Bir torbadan bilye çekip geri bırakma deneyi ${n} kez yapıldı ve ${k} kez kırmızı bilye geldi. Kırmızı bilye çekme olasılığının gözleme dayalı tahmini nedir?`, dogru: kesir(k, n),
            yanlis: [[kesir(n - k, n), "dikkat", "Bu, kırmızı gelmeme olasılığının tahminidir."], [String(k), "kavrama", "Olasılık bir orandır: gerçekleşme sayısı ÷ toplam deneme."], [kesir(k, n - k), "kavrama", "Kırmızıları diğerlerine böldün; toplam deneme sayısına bölmelisin."]],
            ipucu: "Olasılık tahmini = olayın gerçekleşme sayısı ÷ toplam deneme sayısı.", cozum: [`Gözleme dayalı olasılık = olayın gerçekleşme sayısı ÷ toplam deneme sayısı.`, `Kırmızı ${k} kez geldi, deney ${n} kez yapıldı: ${k}/${n}.`, `Sadeleştir: ${k}/${n} = ${kesir(k, n)}.`] }); },
        z => { const k = [R(8, 20), R(8, 20), R(8, 20)]; const t = k[0] + k[1] + k[2]; const renk = ["Kırmızı", "Mavi", "Yeşil"]; const i = R(0, 2);
          return S({ kaz: "ol.tahmin", duzey: "uygulama", zorluk: 2, soru: `Bir torbadan çekilip geri bırakılan bilyelerin renkleri kaydedildi: Kırmızı ${k[0]}, Mavi ${k[1]}, Yeşil ${k[2]} kez. ${renk[i]} bilye çekme olasılığının tahmini nedir?`, dogru: kesir(k[i], t),
            yanlis: [[kesir(k[i], k[(i + 1) % 3] + k[(i + 2) % 3]), "kavrama", "Toplam deneme sayısına bölmelisin, diğer renklerin toplamına değil."], ["1/3", "kavrama", "Üç renk var diye olasılıklar eşit değildir; gözlem sonuçlarını kullan."], [kesir(k[(i + 1) % 3], t), "dikkat", "Başka bir rengin tahminini hesapladın."]],
            ipucu: "Önce toplam deneme sayısını bul.", cozum: [`Toplam deneme: ${k.join(" + ")} = ${t}.`, `${renk[i]}: ${k[i]} / ${t} = ${kesir(k[i], t)}.`] }); },
      ],
      "ol.kavram": [
        z => { const o = sec([
            ["Bir zarı attığımızda 7 gelmesi", "İmkânsız", "Zarda 7 yoktur; olasılığı 0."], ["Bir zarı attığımızda 6'dan küçük ya da 6'ya eşit bir sayı gelmesi", "Kesin", "Zarın her yüzü 6 ya da daha küçüktür; olasılığı 1."],
            ["Madenî parayı attığımızda yazı gelmesi", "Eşit olasılıklı (1/2)", "Yazı ve tura gelme şansı eşittir."], ["Ocak ayından sonra şubat ayının gelmesi", "Kesin", "Takvimde her zaman öyledir; olasılığı 1."]]);
          return S({ kaz: "ol.kavram", duzey: "hatirlama", zorluk: 1, soru: `“${o[0]}” olayı nasıl bir olaydır?`, dogru: o[1], dogruNeden: o[2],
            yanlis: [["İmkânsız", "kavrama", "Bu olay gerçekleşebilir."], ["Kesin", "kavrama", "Bu olay her zaman gerçekleşmez."], ["Eşit olasılıklı (1/2)", "kavrama", "Olasılık 1/2 değil."], ["Olasılığı 2'dir", "bilgi", "Olasılık 0 ile 1 arasındadır, 2 olamaz."]].filter(x => x[0] !== o[1]),
            ipucu: "Olasılık 0 → imkânsız, 1 → kesin.", cozum: ["Önce olayın gerçekleşip gerçekleşemeyeceğini düşün: hiç olamıyorsa imkânsız (0), her zaman oluyorsa kesin (1), şansı yarı yarıya ise eşit olasılıklı (1/2).", o[2], `Bu yüzden olay: ${o[1]}.`] }); },
        z => S({ kaz: "ol.kavram", duzey: "aciklama", zorluk: 2, soru: "Gözleme dayalı olasılıkla ilgili hangisi doğrudur?", dogru: "Deneme sayısı arttıkça tahmin teorik olasılığa yaklaşır.",
          yanlis: [["Deney az yapılırsa tahmin daha doğru olur.", "kavrama", "Az deneme rastlantıya açıktır; tahmin yanıltıcı olabilir."], ["Gözleme dayalı olasılık 1'den büyük olabilir.", "bilgi", "Olasılık her zaman 0 ile 1 arasındadır."], ["Her deneyde aynı sonuç çıkar.", "kavrama", "Deney sonuçları rastlantısaldır; farklı çıkabilir."]],
          ipucu: "Parayı 10 kez ve 1000 kez attığını düşün.", cozum: ["Çok sayıda deneme, rastlantısal sapmaları dengeler.", "Bu yüzden deneme arttıkça tahmin gerçeğe yaklaşır."] }),
      ],
      "ol.yorum": [
        z => { const n = sec([20, 40, 50]); const k = R(Math.floor(n / 2), n - 2); const yeni = sec([100, 200, 400]); const tahmin = Math.round(k / n * yeni);
          return S({ kaz: "ol.yorum", duzey: "transfer", zorluk: 3, soru: `Bir basketbolcu son ${n} serbest atışın ${k}${ek(k, "ini")} sokmuş. Aynı başarıyla ${yeni} atış yaparsa yaklaşık kaç basket atması beklenir?`, dogru: tahmin,
            yanlis: [[k, "dikkat", "Bu eski atışlardaki basket sayısı; yeni atış sayısına göre ölçeklemelisin."], [yeni - tahmin, "dikkat", "Bu kaçırılması beklenen atış sayısıdır."], [Math.round(yeni / 2), "kavrama", "Olasılık 1/2 değil; gözlenen oranı kullanmalısın."]],
            ipucu: `Önce olasılık tahmini: ${k}/${n}. Sonra bunu ${yeni} ile çarp.`, cozum: [`Tahmin: ${kesir(k, n)}.`, `${yeni} × ${kesir(k, n)} ≈ ${tahmin}.`] }); },
        z => { const d = [R(5, 15), R(5, 15), R(5, 15), R(5, 15)]; const ad = ["Kırmızı", "Mavi", "Sarı", "Yeşil"]; const mx = Math.max(...d); if (d.filter(x => x === mx).length > 1) return null; const i = d.indexOf(mx);
          return S({ kaz: "ol.yorum", duzey: "uygulama", zorluk: 2, soru: `Dört renkli bir çark ${d.reduce((a, b) => a + b, 0)} kez çevrildi: ${ad.map((a, j) => a + " " + d[j]).join(", ")}. Gözlemlere göre bir sonraki çevirişte en olası renk hangisidir?`, dogru: ad[i],
            yanlis: ad.filter((_, j) => j !== i).map(a => [a, "dikkat", "Bu renk daha az gelmiş; en çok gelen renk en olası tahmindir."]),
            ipucu: "En çok gözlenen sonuç, en olası tahmindir.", cozum: [`Her rengin kaç kez geldiğine bak: ${ad.map((a, j) => a + " " + d[j]).join(", ")}.`, `Gözleme dayalı tahminde en çok gerçekleşen sonuç en olası kabul edilir.`, `En çok gelen renk ${ad[i]} (${mx} kez).`] }); },
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
        z => { const rak = karistir([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5); const sayi = `${rak[0]}${rak[1]},${rak[2]}${rak[3]}${rak[4]}`; const i = R(2, 4); const deg = [null, null, 0.1, 0.01, 0.001][i] * rak[i];
          return S({ kaz: "bas.deger", duzey: "uygulama", zorluk: 1 + (i === 4 ? 1 : 0), soru: `${sayi} sayısında ${rak[i]} rakamının basamak değeri kaçtır?`, dogru: od(deg),
            yanlis: [[rak[i], "kavrama", "Bu sayı değeridir; basamak değeri bulunduğu basamağa göre belirlenir."], [od(deg * 10), "islem", "Bir basamak sola kaydırmışsın."], [od(deg / 10), "islem", "Bir basamak sağa kaydırmışsın."]],
            ipucu: "Virgülden sonra kaçıncı basamakta? 1. → onda birler, 2. → yüzde birler, 3. → binde birler.", cozum: [`${rak[i]}, virgülden sonra ${i - 1}. basamakta.`, `Basamak değeri: ${od(deg)}.`] }); },
      ],
      "bas.ad": [
        z => { const ad = ["onda birler", "yüzde birler", "binde birler"]; const i = R(0, 2); const rak = karistir([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
          return S({ kaz: "bas.ad", duzey: "hatirlama", zorluk: 1, soru: `${rak[0]},${rak[1]}${rak[2]}${rak[3]} sayısının ${ad[i]} basamağındaki rakam hangisidir?`, dogru: rak[i + 1],
            yanlis: [[rak[0], "bilgi", "Bu birler basamağıdır; ondalık basamaklar virgülün sağındadır."], ...[0, 1, 2].filter(j => j !== i).map(j => [rak[j + 1], "bilgi", `Bu rakam ${ad[j]} basamağında.`])],
            ipucu: "Onda birler virgülden hemen sonraki basamaktır.", cozum: [`Virgülün solu tam kısımdır: ${rak[0]} birler basamağında.`, `Virgülün sağındaki basamaklar sırayla: ${ad.map((a, j) => a + " → " + rak[j + 1]).join(", ")}.`, `İstenen ${ad[i]} basamağındaki rakam: ${rak[i + 1]}.`] }); },
      ],
      "bas.cozumle": [
        z => { const a = R(1, 9), b = R(1, 9), c = R(1, 9); const s = `${a},${b}${c}`;
          return S({ kaz: "bas.cozumle", duzey: "aciklama", zorluk: 2, soru: `${s} sayısının çözümlenmiş hâli hangisidir?`, dogru: `${a} + ${od(b / 10)} + ${od(c / 100)}`,
            yanlis: [[`${a} + ${b} + ${c}`, "kavrama", "Rakamların basamak değerlerini yazmalısın."], [`${a} + ${od(b / 100)} + ${od(c / 10)}`, "islem", "Onda birler ile yüzde birler yer değiştirmiş."], [`${a} + ${od(b / 10)} + ${od(c / 1000)}`, "islem", "Son basamak yüzde birler basamağıdır."]],
            ipucu: "Her rakamı basamak değeriyle yaz.", cozum: [`Basamakları sırala: ${a} birler, ${b} onda birler, ${c} yüzde birler basamağında.`, `Basamak değerleri: ${a} → ${a}, ${b} → ${od(b / 10)}, ${c} → ${od(c / 100)}.`, `Çözümlenmiş hâl: ${a} + ${od(b / 10)} + ${od(c / 100)}.`] }); },
        z => { const a = R(2, 9), b = R(1, 9), c = R(1, 9); const deger = a + b / 10 + c / 100;
          return S({ kaz: "bas.cozumle", duzey: "transfer", zorluk: 2, soru: `${a} tane 1 TL, ${b} tane 10 kuruş ve ${c} tane 1 kuruş toplam kaç TL eder?`, dogru: od(deger) + " TL",
            yanlis: [[od(a + b / 100 + c / 10) + " TL", "kavrama", "10 kuruş 0,1 TL, 1 kuruş 0,01 TL'dir."], [`${a + b + c} TL`, "kavrama", "Kuruşları TL gibi saydın."], [od(a + b / 10 + c / 10) + " TL", "islem", "1 kuruş 0,01 TL'dir."]],
            ipucu: "1 TL = 100 kuruş. 10 kuruş = 0,1 TL; 1 kuruş = 0,01 TL.", cozum: [`1 TL'ler: ${a} TL.`, `10 kuruş = 0,1 TL olduğu için ${b} tane 10 kuruş = ${od(b / 10)} TL.`, `1 kuruş = 0,01 TL olduğu için ${c} tane 1 kuruş = ${od(c / 100)} TL.`, `Topla: ${a} + ${od(b / 10)} + ${od(c / 100)} = ${od(deger)} TL.`] }); },
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
        z => { let x; do { x = R(1000, 99999); } while (x % 10 === 0); x /= 1000; const hedef = sec([["onda birler", 1], ["yüzde birler", 2], ["en yakın tam sayı", 0]]); const k = Math.pow(10, hedef[1]);
          const dogru = Math.round(x * k + 1e-9) / k; const kes = Math.floor(x * k) / k;
          return S({ kaz: "yuv.kural", duzey: "uygulama", zorluk: hedef[1] === 2 ? 2 : 1, soru: `${od(x)} sayısı ${hedef[0]}${hedef[1] ? " basamağına" : "ya"} yuvarlanırsa hangi sayı elde edilir?`, dogru: od(dogru),
            yanlis: [[od(dogru === kes ? kes + 1 / k : kes), "bilgi", "Sağdaki rakama bakarak artırma ya da aynı bırakma kuralını yanlış uyguladın."], [od(Math.round(x * k * 10) / (k * 10)), "dikkat", "Bir basamak fazla bıraktın; istenen basamağa yuvarla."], [od(hedef[1] === 0 ? Math.round(x * 10) / 10 : Math.round(x)), "dikkat", "Yanlış basamağa yuvarladın."]],
            ipucu: "İstenen basamağın sağındaki rakam 5 veya daha büyük mü?", cozum: [`İstenen basamak: ${hedef[0]}.`, `Sağındaki rakama bak ve kurala göre yuvarla: ${od(dogru)}.`] }); },
      ],
      "yuv.tahmin": [
        z => { const a = R(150, 999) / 100, b = R(150, 999) / 100; const t = Math.round(a) + Math.round(b);
          return S({ kaz: "yuv.tahmin", duzey: "transfer", zorluk: 2, soru: `${od(a)} TL ve ${od(b)} TL'lik iki ürün alan Ayşe, fiyatları en yakın tam sayıya yuvarlayarak toplam tutarı tahmin ediyor. Tahmini kaç TL'dir?`, dogru: t,
            yanlis: [[Math.floor(a) + Math.floor(b), "bilgi", "Yuvarlamada sadece virgülden önceki kısmı aldın; sağdaki rakama bakmalısın."], [od(Math.round((a + b) * 100) / 100), "dikkat", "Bu tam sonuç; soru tahmini istiyor."], [Math.ceil(a) + Math.ceil(b) === t ? t + 1 : Math.ceil(a) + Math.ceil(b), "bilgi", "Her zaman yukarı yuvarlanmaz; sağdaki rakam 5'ten küçükse aşağı yuvarlanır."]],
            ipucu: "Her fiyatı ayrı ayrı en yakın tam sayıya yuvarla, sonra topla.", cozum: [`${od(a)} ≈ ${Math.round(a)}, ${od(b)} ≈ ${Math.round(b)}.`, `Tahmin: ${t} TL.`] }); },
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
            yanlis: [[`${b} ÷ ${a}`, "kavrama", "Pay bölünen, payda bölendir; ters çevirdin."], [`${a} × ${b}`, "bilgi", "Kesir çizgisi bölme anlamına gelir, çarpma değil."], [`${b} − ${a}`, "bilgi", "Kesir çizgisi bölmedir."]],
            ipucu: "Kesir çizgisi “bölü” demektir.", cozum: [`Kesir çizgisi bölme işaretidir.`, `Pay (üstteki sayı) bölünen, payda (alttaki sayı) bölendir.`, `${a}/${b} = ${a} ÷ ${b}.`] }); },
      ],
      "kb.ondalik": [
        z => { const [a, b, d] = sec([[1, 2, 0.5], [1, 4, 0.25], [3, 4, 0.75], [2, 5, 0.4], [3, 5, 0.6], [4, 5, 0.8], [1, 5, 0.2], [7, 10, 0.7], [9, 20, 0.45], [3, 20, 0.15], [7, 25, 0.28], [1, 8, 0.125], [3, 8, 0.375]]);
          return S({ kaz: "kb.ondalik", duzey: "uygulama", zorluk: b >= 20 ? 2 : 1, soru: `${a}/${b} kesrinin ondalık gösterimi hangisidir?`, dogru: od(d),
            yanlis: [[`${a},${b}`, "kavrama", "Kesir çizgisi virgül demek değildir; payı paydaya bölmelisin."], [Number.isInteger(b / a * 100) ? od(b / a) : od(d / 10), Number.isInteger(b / a * 100) ? "kavrama" : "islem", Number.isInteger(b / a * 100) ? "Paydayı paya böldün; ters işlem." : "Virgülü yanlış yere koydun."], [od(d * 10), "islem", "Virgülü yanlış yere koydun."]],
            ipucu: `${a} ÷ ${b} işlemini yap ya da paydayı 10, 100 veya 1000'e genişlet.`, cozum: [`Kesri ondalığa çevirmek için paydayı 10, 100 ya da 1000 yapacak sayıyla genişlet.`, (() => { const h = [10, 100, 1000].find(x => x % b === 0); return h ? `${a}/${b} = ${a} × ${h / b} / ${b} × ${h / b} = ${a * h / b}/${h}.` : `${a} ÷ ${b} bölmesini yap.`; })(), `Sonuç: ${od(d)}.`] }); },
      ],
      "kb.paylasim": [
        z => { const a = R(2, 7), b = R(a + 1, 10); const nesne = sec(["pizza", "pasta", "çikolata"]);
          return S({ kaz: "kb.paylasim", duzey: "transfer", zorluk: 2, soru: `${a} ${nesne} ${b} arkadaş arasında eşit olarak paylaştırılırsa her arkadaşa ne kadar ${nesne} düşer?`, dogru: kesir(a, b),
            yanlis: [[kesir(b, a), "kavrama", "Payı ve paydayı ters yazdın: paylaştırılan miktar pay, kişi sayısı paydadır."], [`1/${b}`, "dikkat", "Bu tek bir " + nesne + " paylaştırıldığında düşen paydır."], [String(b - a), "bilgi", "Paylaştırma bölme işlemidir."]],
            ipucu: "Paylaştırma = bölme. Bölme = kesir.", cozum: [`Eşit paylaştırma bölme işlemidir: ${a} ÷ ${b}.`, `Bölme kesir olarak yazılır: paylaştırılan miktar pay, kişi sayısı payda → ${a}/${b}.`, `Her arkadaşa ${kesir(a, b)} ${nesne} düşer.`] }); },
        z => { const k = R(3, 8), b = sec([4, 5, 8, 10]); const a = R(b + 1, 2 * b - 1);
          return S({ kaz: "kb.paylasim", duzey: "baglanti", zorluk: 3, soru: `${a} litre süt ${b} şişeye eşit olarak dolduruluyor. Her şişede kaç litre süt olur? (Ondalık gösterimle)`, dogru: od(a / b),
            yanlis: [[od(b / a), "kavrama", "Şişe sayısını süt miktarına böldün."], [`${a},${b}`, "kavrama", "Kesir virgülle yazılmaz; böl."], [od(Math.floor(a / b)), "dikkat", "Kalanı da paylaştırmalısın."]],
            ipucu: `${a} ÷ ${b} = ${a}/${b}; sonra ondalığa çevir.`, cozum: [`Eşit paylaştırma bölmedir: ${a} ÷ ${b} = ${a}/${b}.`, (() => { const h = [10, 100, 1000].find(x => x % b === 0); return `Paydayı ${h} yap: ${a}/${b} = ${a * h / b}/${h}.`; })(), `Ondalık gösterim: ${od(a / b)} litre.`] }); },
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
        z => { const f = R(150, 1250) / 100, n = R(2, 6), ver = Math.ceil(f * n / 10) * 10 + sec([0, 10, 20]); const top = Math.round(f * n * 100) / 100; const ust = Math.round((ver - top) * 100) / 100;
          return S({ kaz: "pr.para", duzey: "uygulama", zorluk: 2, soru: `Tanesi ${od(f)} TL olan defterden ${n} tane alan Elif kasaya ${ver} TL veriyor. Kaç TL para üstü alır?`, dogru: od(ust) + " TL",
            yanlis: [[od(top) + " TL", "dikkat", "Bu toplam tutardır; soru para üstünü istiyor."], [od(Math.round((ver - f) * 100) / 100) + " TL", "dikkat", "Yalnızca bir defterin fiyatını çıkardın."], [od(Math.round((ver - top + 1) * 100) / 100) + " TL", "islem", "Çıkarma işleminde virgül hizasına dikkat et."]],
            ipucu: "Önce toplam tutarı bul, sonra verilen paradan çıkar.", cozum: [`Toplam: ${od(f)} × ${n} = ${od(top)} TL.`, `Para üstü: ${ver} − ${od(top)} = ${od(ust)} TL.`] }); },
        z => { const f = R(250, 990) / 100, para = sec([20, 30, 50]); const n = Math.floor(para / f);
          return S({ kaz: "pr.para", duzey: "transfer", zorluk: 3, soru: `${para} TL'si olan bir öğrenci tanesi ${od(f)} TL olan kalemlerden en çok kaç tane alabilir?`, dogru: n,
            yanlis: [[n + 1, "dikkat", `${n + 1} kalem ${od(Math.round((n + 1) * f * 100) / 100)} TL eder; para yetmez.`], [od(Math.round(para / f * 100) / 100), "kavrama", "Kalem sayısı tam sayı olmalı."], [n - 1, "islem", "Bir kalem daha alabilirsin."]],
            ipucu: "Parayı kalem fiyatına böl; sonucu aşağı yuvarla.", cozum: [`${para} ÷ ${od(f)} ≈ ${od(Math.round(para / f * 100) / 100)}.`, `En çok ${n} kalem alınabilir.`] }); },
      ],
      "pr.kesir": [
        z => { const top = sec([24, 30, 36, 40, 48, 60]); const [a, b] = sec([[1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [5, 6]].filter(([x, y]) => top % y === 0));
          return S({ kaz: "pr.kesir", duzey: "uygulama", zorluk: 2, soru: `${top} sayfalık bir kitabın ${a}/${b} kadarını okuyan Zeynep'in okuması gereken kaç sayfa kalmıştır?`, dogru: top - top * a / b,
            yanlis: [[top * a / b, "dikkat", "Bu okunan sayfa sayısı; soru kalan sayfayı istiyor."], [top / b, "islem", "Paydaya bölmekle kalma; payla da çarp."], [top - a - b, "kavrama", "Kesrin bir bütünün parçası olduğunu unutma."]],
            ipucu: `Önce okunan sayfayı bul: ${top} × ${a}/${b}.`, cozum: [`Okunan: ${top} ÷ ${b} × ${a} = ${top * a / b}.`, `Kalan: ${top} − ${top * a / b} = ${top - top * a / b}.`] }); },
      ],
      "pr.cokadim": [
        z => { const s = R(3, 6), f1 = R(120, 450) / 100, f2 = R(150, 600) / 100, n2 = R(2, 4); const top = Math.round((s * f1 + n2 * f2) * 100) / 100;
          return S({ kaz: "pr.cokadim", duzey: "baglanti", zorluk: 3, soru: `Bir kırtasiyeden tanesi ${od(f1)} TL olan ${s} kalem ve tanesi ${od(f2)} TL olan ${n2} silgi alındı. Toplam kaç TL ödenir?`, dogru: od(top) + " TL",
            yanlis: [[od(Math.round((f1 + f2) * (s + n2) * 100) / 100) + " TL", "strateji", "Fiyatları toplayıp toplam adetle çarpmak yanlış; her ürünü ayrı hesapla."], [od(Math.round((s * f1) * 100) / 100) + " TL", "dikkat", "Silgileri eklemeyi unuttun."], [od(Math.round((f1 + f2) * 100) / 100) + " TL", "kavrama", "Adetleri hesaba katmadın."]],
            ipucu: "Kalemlerin ve silgilerin tutarını ayrı ayrı bul, sonra topla.", cozum: [`Kalemler: ${s} × ${od(f1)} = ${od(Math.round(s * f1 * 100) / 100)} TL.`, `Silgiler: ${n2} × ${od(f2)} = ${od(Math.round(n2 * f2 * 100) / 100)} TL.`, `Toplam: ${od(top)} TL.`] }); },
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
          const x = b1 === "km" || (BIR[b1] > BIR[b2]) ? R(12, 95) / 10 : R(120, 9500); const sonuc = x * BIR[b1] / BIR[b2]; const oran = BIR[b1] / BIR[b2];
          return S({ kaz: "uz.donustur", duzey: "uygulama", zorluk: oran >= 1000 || oran <= 0.001 ? 2 : 1, soru: `${od(x)} ${b1} kaç ${b2}${ek(b2, "dir")}?`, dogru: od(sonuc) + " " + b2,
            yanlis: [[od(x / oran) + " " + b2, "kavrama", oran > 1 ? "Büyük birimden küçüğe geçerken çarpmalısın, bölmemelisin." : "Küçük birimden büyüğe geçerken bölmelisin, çarpmamalısın."], [od(sonuc * 10) + " " + b2, "islem", "Kaç basamak kaydıracağını yeniden say."], [od(sonuc / 10) + " " + b2, "islem", "Kaç basamak kaydıracağını yeniden say."]],
            ipucu: "Birimler merdiveninde kaç basamak iniyor ya da çıkıyorsun?", cozum: [`1 ${b1} = ${od(oran)} ${b2}.`, `${od(x)} × ${od(oran)} = ${od(sonuc)} ${b2}.`] }); },
        z => { const k = R(1, 5), m = R(50, 950);
          return S({ kaz: "uz.donustur", duzey: "uygulama", zorluk: 2, soru: `${k} km ${m} m kaç metredir?`, dogru: k * 1000 + m,
            yanlis: [[k + m, "kavrama", "km ve m doğrudan toplanmaz; önce km'yi metreye çevir."], [k * 100 + m, "bilgi", "1 km = 1000 m'dir, 100 m değil."], [od(k + m / 1000), "dikkat", "Sonuç metre cinsinden istendi."]],
            ipucu: "1 km = 1000 m.", cozum: [`${k} km = ${k * 1000} m.`, `${k * 1000} + ${m} = ${k * 1000 + m} m.`] }); },
      ],
      "uz.birim": [
        z => { const o = sec([["İki şehir arasındaki uzaklık", "km"], ["Sınıfın uzunluğu", "m"], ["Bir kalemin uzunluğu", "cm"], ["Bir karıncanın boyu", "mm"], ["Bir futbol sahasının uzunluğu", "m"]]);
          return S({ kaz: "uz.birim", duzey: "hatirlama", zorluk: 1, soru: `“${o[0]}” ölçülürken en uygun birim hangisidir?`, dogru: o[1],
            yanlis: ["km", "m", "cm", "mm"].filter(b => b !== o[1]).map(b => [b, "kavrama", "Bu birim ölçülen uzunluğa göre çok " + (["km", "m", "cm", "mm"].indexOf(b) < ["km", "m", "cm", "mm"].indexOf(o[1]) ? "büyük" : "küçük") + " kalır."]),
            ipucu: "Ölçeceğin şey ne kadar büyük?", cozum: ["Birimleri büyükten küçüğe sırala: km (çok uzun yollar) → m (oda, saha) → cm (kalem, defter) → mm (çok küçük şeyler).", `${o[0]} bu sıralamada ${o[1]} ile ölçülecek büyüklüktedir.`, `En uygun birim: ${o[1]}.`] }); },
      ],
      "uz.problem": [
        z => { const tur = sec([200, 250, 400, 500]), n = R(3, 10); const m = tur * n;
          return S({ kaz: "uz.problem", duzey: "transfer", zorluk: 2, soru: `Bir koşu pistinin bir turu ${tur} m'dir. Pistte ${n} tur atan Ahmet kaç km koşmuş olur?`, dogru: od(m / 1000) + " km",
            yanlis: [[m + " km", "dikkat", "Sonuç metre; km'ye çevirmeyi unuttun."], [od(m / 100) + " km", "bilgi", "1 km = 1000 m'dir."], [od(tur / 1000) + " km", "dikkat", "Tur sayısıyla çarpmayı unuttun."]],
            ipucu: "Önce toplam metreyi bul, sonra 1000'e böl.", cozum: [`${tur} × ${n} = ${m} m.`, `${m} m = ${od(m / 1000)} km.`] }); },
        z => { const top = R(3, 9), p = R(25, 90);
          return S({ kaz: "uz.problem", duzey: "baglanti", zorluk: 3, soru: `${top} m uzunluğundaki bir kumaştan ${p} cm'lik parçalar kesiliyor. En çok kaç parça kesilebilir?`, dogru: Math.floor(top * 100 / p),
            yanlis: [[Math.floor(top / p) || top, "kavrama", "Birimleri eşitlemeden böldün; önce metreyi santimetreye çevir."], [Math.floor(top * 100 / p) + 1, "dikkat", "Son parça tam boyda olmaz; aşağı yuvarla."], [od(Math.round(top * 100 / p * 100) / 100), "kavrama", "Parça sayısı tam sayı olmalı."]],
            ipucu: `${top} m = ${top * 100} cm.`, cozum: [`${top} m = ${top * 100} cm.`, `${top * 100} ÷ ${p} = ${Math.floor(top * 100 / p)}, kalan ${top * 100 % p} cm.`] }); },
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
            yanlis: yan.map(x => [x[0], "kavrama", `“${x[0]}” ${x[1]} veridir: ${x[1] === "nicel" ? "sayıyla ölçülür." : "bir grup ya da özellik belirtir."}`]),
            ipucu: "Sayıyla ölçülüyor ya da sayılıyorsa nicel; bir grup adıysa kategoriktir.", cozum: ["Nicel veri sayıyla ölçülür ya da sayılır; kategorik veri bir grup, ad ya da özellik belirtir.", `“${d[0]}” ${tur === "nicel" ? "sayıyla ölçülür/sayılır" : "bir grup ya da özellik belirtir"}.`, `Bu yüzden “${d[0]}” ${tur} veridir.`] }); },
        z => { const d = sec(DEGISKEN);
          return S({ kaz: "ar.veri", duzey: "aciklama", zorluk: 1, soru: `“${d[0]}” verisi hangi türdendir?`, dogru: d[1] === "nicel" ? "Nicel veri" : "Kategorik veri",
            yanlis: [[d[1] === "nicel" ? "Kategorik veri" : "Nicel veri", "kavrama", d[1] === "nicel" ? "Bu veri sayıyla ölçülür; nicel veridir." : "Bu veri bir grup belirtir; kategorik veridir."], ["Her ikisi de", "kavrama", "Bir veri ya kategorik ya nicel olur."], ["Veri değildir", "bilgi", "Toplanabilen her bilgi veridir."]],
            ipucu: "Cevaplar sayı mı, yoksa ad/kategori mi?", cozum: ["Kendine sor: Bu soruya verilecek cevaplar sayı mı, yoksa bir ad/grup mu?", `“${d[0]}” için cevaplar ${d[1] === "nicel" ? "sayıdır (ölçülür ya da sayılır)" : "ad ya da gruptur"}.`, `Sonuç: ${d[1]} veri.`] }); },
      ],
      "ar.soru": [
        z => { const iyi = sec(["Sınıfımızdaki öğrenciler günde kaç saat uyuyor?", "Okulumuzdaki öğrencilerin en çok tercih ettiği kulüp hangisidir?", "Sınıfımızdaki öğrencilerin kaç kardeşi var?", "6. sınıf öğrencileri haftada kaç kitap okuyor?"]);
          return S({ kaz: "ar.soru", duzey: "aciklama", zorluk: 2, soru: "Aşağıdakilerden hangisi iyi bir araştırma sorusudur?", dogru: iyi,
            yanlis: [["Kitap okumak güzel midir?", "kavrama", "“Güzel” ölçülemez; veri toplanarak cevaplanamaz."], ["İnsanlar ne düşünür?", "kavrama", "Çok genel; hedef grup ve ölçülecek şey belirsiz."], ["Dünyadaki bütün çocuklar kaç saat uyur?", "strateji", "Hedef grup çok geniş; bu verileri toplamak mümkün değil."]],
            ipucu: "Veri toplanarak cevaplanabiliyor mu? Hedef grup belli mi?", cozum: ["İyi soru: açık, ölçülebilir ve hedef grubu belli.", `“${iyi}”`] }); },
      ],
      "ar.plan": [
        z => S({ kaz: "ar.plan", duzey: "aciklama", zorluk: 2, soru: "Hangisi yönlendirici (taraflı) bir anket sorusudur?", dogru: sec(["Herkesin sevdiği futbol senin de en sevdiğin spor değil mi?", "Ödevler çok fazla, sence de azaltılmalı değil mi?"]),
          yanlis: [["En sevdiğin spor hangisidir?", "kavrama", "Bu soru tarafsızdır; seçim kişiye bırakılmış."], ["Haftada kaç saat ödev yapıyorsun?", "kavrama", "Bu soru tarafsızdır."], ["Okula hangi yolla geliyorsun?", "kavrama", "Bu soru tarafsızdır."]],
          ipucu: "Soru kişiyi belli bir cevaba itiyor mu?", cozum: ["“Değil mi?”, “herkes gibi” ifadeleri kişiyi yönlendirir.", "İyi anket soruları tarafsız olmalıdır."] }),
        z => { const o = sec([["Sınıftaki öğrencilerin boy uzunlukları", "Ölçüm yapmak"], ["Öğrencilerin en sevdiği yemek", "Anket yapmak"], ["Okul önünden bir saatte geçen araç sayısı", "Gözlem yapmak"]]);
          return S({ kaz: "ar.plan", duzey: "uygulama", zorluk: 2, soru: `“${o[0]}” hakkında veri toplamak için en uygun yöntem hangisidir?`, dogru: o[1],
            yanlis: ["Ölçüm yapmak", "Anket yapmak", "Gözlem yapmak", "Tahmin etmek"].filter(x => x !== o[1]).map(x => [x, x === "Tahmin etmek" ? "bilgi" : "strateji", x === "Tahmin etmek" ? "Tahmin veri toplama yöntemi değildir." : "Bu yöntem bu veriyi toplamak için en uygun değil."]),
            ipucu: "Veri soruyla mı, ölçerek mi, yoksa izleyerek mi toplanır?", cozum: ["Veri toplama yolları: ölçüm (cetvel, terazi ile), anket (kişilere sorarak), gözlem (izleyip sayarak).", `“${o[0]}” ${o[1] === "Ölçüm yapmak" ? "bir araçla ölçülür" : o[1] === "Anket yapmak" ? "kişilerin tercihidir; sorarak öğrenilir" : "izlenerek sayılır"}.`, `En uygun yöntem: ${o[1]}.`] }); },
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
            yanlis: ad[1].filter((_, j) => j !== i).map(a => [a, "dikkat", "Tablodaki sayıları yeniden karşılaştır."]),
            ipucu: "En büyük sayıyı bul.", cozum: ["Grafikte en uzun sütunu bul; sütunun boyu tercih sayısını gösterir.", `Değerler: ${ad[1].map((a, j) => a + " " + d[j]).join(", ")}.`, `En büyük değer ${mx}: en çok tercih edilen ${ad[1][i]}.`] }); },
        z => { const d = [R(4, 15), R(4, 15), R(4, 15), R(4, 15)]; const ad = ["Pzt", "Salı", "Çrş", "Prş"]; const t = d.reduce((a, b) => a + b, 0);
          return S({ kaz: "me.grafik", duzey: "uygulama", zorluk: 2, soru: "Bir kütüphaneden günlere göre ödünç alınan kitap sayıları grafikte verilmiştir. Dört günde toplam kaç kitap ödünç alınmıştır?", gorsel: OGR.G.sutun(ad.map((a, j) => [a, d[j]]), { baslik: "Ödünç alınan kitaplar", birim: "kitap" }), dogru: t,
            yanlis: [[Math.max(...d), "dikkat", "Bu tek bir günün değeri; toplamı istiyor."], [t - d[0], "dikkat", "Bir günü eklemeyi unuttun."], [t + R(1, 4), "islem", "Toplamayı yeniden kontrol et."]],
            ipucu: "Bütün günlerin değerlerini topla.", cozum: ["Grafikten her günün değerini oku.", `Pazartesi ${d[0]}, Salı ${d[1]}, Çarşamba ${d[2]}, Perşembe ${d[3]}.`, `Topla: ${d.join(" + ")} = ${t} kitap.`] }); },
      ],
      "me.ortalama": [
        z => { const n = sec([4, 5]); let v; do { v = Array.from({ length: n }, () => R(4, 20)); } while (v.reduce((a, b) => a + b, 0) % n); const t = v.reduce((a, b) => a + b, 0);
          return S({ kaz: "me.ortalama", duzey: "uygulama", zorluk: 1, soru: `${v.join(", ")} verisinin aritmetik ortalaması kaçtır?`, dogru: t / n,
            yanlis: [[t, "bilgi", "Bu toplamdır; veri sayısına bölmelisin."], [[...v].sort((a, b) => a - b)[Math.floor(n / 2)], "kavrama", "Bu ortanca olabilir; ortalama toplam ÷ veri sayısıdır."], [Math.max(...v) - Math.min(...v), "kavrama", "Bu açıklıktır."]],
            ipucu: "Toplamı bul ve veri sayısına böl.", cozum: [`Toplam: ${v.join(" + ")} = ${t}.`, `${t} ÷ ${n} = ${t / n}.`] }); },
        z => { const notlar = [R(60, 90), R(60, 90), R(60, 90)]; const hedef = sec([75, 80, 85]); const gerek = hedef * 4 - notlar.reduce((a, b) => a + b, 0); if (gerek > 100 || gerek < 40) return null;
          return S({ kaz: "me.ortalama", duzey: "transfer", zorluk: 3, soru: `Ece'nin ilk üç sınav puanı: ${notlar.join(", ")}. Dört sınavın ortalamasının ${hedef} olması için dördüncü sınavdan kaç alması gerekir?`, dogru: gerek,
            yanlis: [[hedef, "kavrama", "Ortalama hedefini dördüncü puan sanmışsın."], [hedef * 3 - notlar.reduce((a, b) => a + b, 0) + hedef, "islem", "Gereken toplamı yeniden hesapla: hedef × 4."], [gerek + 5, "islem", "Toplamaları yeniden kontrol et."]],
            ipucu: `Dört sınavın toplamı ${hedef} × 4 olmalı.`, cozum: [`Gereken toplam: ${hedef} × 4 = ${hedef * 4}.`, `İlk üç sınav toplamı: ${notlar.reduce((a, b) => a + b, 0)}.`, `Gereken puan: ${gerek}.`] }); },
      ],
      "me.ortanca": [
        z => { const v = Array.from({ length: 5 }, () => R(2, 30)); const s = [...v].sort((a, b) => a - b); const ort = s[2];
          return S({ kaz: "me.ortanca", duzey: "uygulama", zorluk: 2, soru: `${v.join(", ")} verisinin ortancası kaçtır?`, dogru: ort,
            yanlis: [[v[2], "dikkat", "Veriyi sıralamadan ortadaki sayıyı aldın; önce küçükten büyüğe sırala."], [od(Math.round(v.reduce((a, b) => a + b, 0) / 5 * 10) / 10), "kavrama", "Bu ortalamadır."], [s[4] - s[0], "kavrama", "Bu açıklıktır."]],
            ipucu: "Önce veriyi küçükten büyüğe sırala.", cozum: [`Sıralı: ${s.join(", ")}.`, `Ortadaki değer: ${ort}.`] }); },
        z => { const t = R(3, 9); const v = karistir([t, t, t, R(10, 15), R(1, 2), R(16, 20)]);
          return S({ kaz: "me.ortanca", duzey: "hatirlama", zorluk: 1, soru: `${v.join(", ")} verisinin tepe değeri kaçtır?`, dogru: t,
            yanlis: [[Math.max(...v), "kavrama", "Tepe değer en büyük değer değil, en çok tekrar eden değerdir."], [v.length, "dikkat", "Bu veri sayısıdır."], [[...v].sort((a, b) => a - b)[3], "kavrama", "Ortanca ile tepe değeri karıştırdın."]],
            ipucu: "En çok tekrar eden değer hangisi?", cozum: ["Tepe değer, veride en çok tekrar eden değerdir.", `Her sayının kaç kez geçtiğini say: ${t} sayısı 3 kez, diğerleri birer kez geçiyor.`, `Tepe değer: ${t}.`] }); },
      ],
      "me.aciklik": [
        z => { const v = Array.from({ length: 6 }, () => R(10, 60));
          return S({ kaz: "me.aciklik", duzey: "uygulama", zorluk: 1, soru: `${v.join(", ")} verisinin açıklığı kaçtır?`, dogru: Math.max(...v) - Math.min(...v),
            yanlis: [[Math.max(...v), "bilgi", "Açıklık en büyük değerden en küçük değerin çıkarılmasıdır."], [Math.abs(v[v.length - 1] - v[0]), "dikkat", "İlk ve son değeri değil, en büyük ve en küçük değeri kullan."], [Math.max(...v) + Math.min(...v), "islem", "Toplama değil çıkarma yapılır."]],
            ipucu: "En büyük − en küçük.", cozum: ["Açıklık = en büyük değer − en küçük değer.", `En büyük değer ${Math.max(...v)}, en küçük değer ${Math.min(...v)}.`, `${Math.max(...v)} − ${Math.min(...v)} = ${Math.max(...v) - Math.min(...v)}.`] }); },
        z => S({ kaz: "me.aciklik", duzey: "baglanti", zorluk: 3, soru: "Bir sınıftaki puanlar: 10, 12, 13, 15, 60. Bu veriyi en iyi temsil eden merkezî eğilim ölçüsü hangisidir? Neden?", dogru: "Ortanca; çünkü 60 uç değeri ortalamayı çok yükseltir.",
          yanlis: [["Ortalama; çünkü bütün değerleri kullanır.", "kavrama", "Ortalama 22 çıkar; öğrencilerin çoğunun puanını temsil etmez."], ["Açıklık; çünkü en büyük farkı gösterir.", "bilgi", "Açıklık bir yayılım ölçüsüdür, merkezî eğilim ölçüsü değildir."], ["En büyük değer; çünkü en başarılıyı gösterir.", "kavrama", "En büyük değer veriyi temsil etmez."]],
          ipucu: "Ortalamayı ve ortancayı hesaplayıp karşılaştır.", cozum: ["Ortalama: 110 ÷ 5 = 22. Ortanca: 13.", "Çoğu öğrenci 10–15 arasında; ortanca daha iyi temsil eder."] }),
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
