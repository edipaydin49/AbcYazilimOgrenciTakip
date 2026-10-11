/* Matematik — Türkiye Geneli Sınav (TGS) / deneme tarzı ek sorular (özgün). */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, Q, G, bolenler, asalMi, ebob, ekok, kesir } = OGR;

  /* ---------- Öncüllü soru yardımcısı ----------
   * ifadeler: [[metin, dogruMu, aciklama], ...] (2 ya da 3 öncül)
   * Doğru seçenek, doğru öncüllerin etiketi ("Yalnız I", "I ve III" ...); çeldiriciler
   * öncelikle tek öncülde farklılaşan etiketlerden seçilir. */
  const ROMA = ["I", "II", "III"];
  const etiket = m => { const s = ROMA.filter((_, i) => m[i]); return s.length === 1 ? "Yalnız " + s[0] : s.length === 2 ? s[0] + " ve " + s[1] : s.length === 3 ? "I, II ve III" : "Hiçbiri"; };
  function ONC(o) {
    const n = o.ifadeler.length, dm = o.ifadeler.map(f => f[1]);
    const maskeler = []; for (let b = 1; b < (1 << n); b++) maskeler.push([...Array(n)].map((_, i) => !!(b >> i & 1)));
    const fark = m => m.filter((v, i) => v !== dm[i]).length;
    const adaylar = karistir(maskeler.filter(m => fark(m) > 0)).sort((a, b) => fark(a) - fark(b)).slice(0, 3);
    const yanlis = adaylar.map(m => {
      const k = m.findIndex((v, i) => v !== dm[i]);
      return [etiket(m), m[k] ? "kavrama" : "dikkat", m[k] ? `${ROMA[k]} numaralı öncül yanlıştır: ${o.ifadeler[k][2]}` : `${ROMA[k]} numaralı öncülü atladın; o da doğrudur: ${o.ifadeler[k][2]}`];
    });
    const soru = o.giris + "<br>" + o.ifadeler.map((f, i) => `<b>${ROMA[i]}.</b> ${f[0]}`).join("<br>") + "<br>" + (o.soruSonu || "ifadelerinden hangileri doğrudur?");
    const cozum = [`🔎 Soruyu anlayalım: ${n} öncülü tek tek inceleyip doğru olanları seçeceğiz.`, "💡 Hatırlayalım: " + o.hatirla]
      .concat(o.ifadeler.map((f, i) => `✏️ ${ROMA[i]}. öncül ${f[1] ? "doğru ✓" : "yanlış ✗"}: ${f[2]}`))
      .concat([`✅ Sonuç: Doğru olan${dm.filter(Boolean).length > 1 ? "lar" : ""}: ${etiket(dm).replace("Yalnız ", "yalnız ")}.`, "🔁 Kontrol edelim: " + (o.kontrol || "Öncüllü sorularda her öncülü ayrı ayrı değerlendir; doğru bildiğin bir öncülü seçeneklerde arayarak hızlıca eleme yapabilirsin.")]);
    return S({ kaz: o.kaz, duzey: o.duzey, zorluk: o.zorluk, soru, gorsel: o.gorsel, dogru: etiket(dm), yanlis, ipucu: o.ipucu, cozum, kural: o.kural, dogruNeden: `Doğru öncüller ${etiket(dm).replace("Yalnız ", "yalnız ")}; diğerleri yanlıştır.` });
  }
  const sayiYaz = n => n >= 1000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : String(n);

  /* ======================= TEMA 1: SAYILAR VE NİCELİKLER ======================= */

  SORU_EKLE("carpan.bul",
    z => { const n = sec([24, 30, 36, 40, 48, 60, 72]); const bol = bolenler(n).filter(d => d >= 2 && d <= 15); const olmaz = [5, 7, 9, 10, 11, 13, 14].filter(d => n % d); const y = sec(olmaz); const d3 = karistir(bol).slice(0, 3);
      const ciftler = bolenler(n).filter(d => d * d <= n).map(d => `${d} × ${n / d}`).join(", ");
      return S({ kaz: "carpan.bul", duzey: "transfer", zorluk: 2, soru: `Beden eğitimi öğretmeni ${n} öğrenciyi, her takımda eşit sayıda öğrenci olacak ve kimse dışarıda kalmayacak biçimde takımlara ayıracak.<br>Buna göre <b>takım sayısı</b> aşağıdakilerden hangisi <b>olamaz</b>?`,
        dogru: y, yanlis: d3.map(d => [d, "dikkat", `${d} takım kurulursa her takımda ${n / d} öğrenci olur ve kimse dışarıda kalmaz. Bu sayı olabilir; soru “olamaz” olanı soruyor.`]),
        ipucu: `Takım sayısı ${n}${ek(n, "i")} kalansız bölmeli.`,
        cozum: [`🔎 Soruyu anlayalım: ${n} öğrenci eşit takımlara ayrılacak; olamayacak takım sayısını arıyoruz.`, `💡 Hatırlayalım: Kimse dışarıda kalmıyorsa takım sayısı ${n}${ek(n, "in")} bir çarpanı (böleni) olmalıdır.`, `✏️ ${n}${ek(n, "in")} çarpan çiftleri: ${ciftler}.`, `✏️ Seçenekleri kontrol edelim: ${d3.map(d => `${n} ÷ ${d} = ${n / d}`).join("; ")} → kalansız.`, `✏️ ${n} ÷ ${y} işleminde ${n % y} kalır; yani ${y} takım kurulursa ${n % y} öğrenci dışarıda kalır.`, `✅ Sonuç: Takım sayısı ${y} olamaz.`, `🔁 Kontrol edelim: ${y} × ${Math.floor(n / y)} = ${y * Math.floor(n / y)} ≠ ${n}. “Olamaz” sorularında aradığın seçenek çarpan OLMAYAN sayıdır.`],
        kural: "Eşit gruplara kalansız ayırmada grup sayısı da gruptaki kişi sayısı da toplamın çarpanıdır.", dogruNeden: `${y}, ${n}${ek(n, "i")} kalansız bölmez; bu yüzden ${y} takım kurulamaz.` }); },
    () => ONC({ kaz: "carpan.bul", duzey: "aciklama", zorluk: 2, giris: "36 sayısı ile ilgili aşağıdaki ifadeler veriliyor:",
      ifadeler: [["36'nın 9 tane çarpanı vardır.", true, "36'nın çarpanları 1, 2, 3, 4, 6, 9, 12, 18, 36 → 9 tane."], ["36'nın bütün çarpanları çift sayıdır.", false, "1, 3 ve 9 da 36'nın çarpanıdır ve bunlar tek sayıdır."], ["4 ve 9, 36'nın çarpanıdır.", true, "36 ÷ 4 = 9 ve 36 ÷ 9 = 4; ikisinde de kalan yoktur."]],
      hatirla: "Bir sayıyı kalansız bölen sayılar o sayının çarpanlarıdır. Çarpanları çiftler hâlinde bulursak hiçbirini kaçırmayız: 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6.",
      ipucu: "Önce 36'nın çarpanlarını çiftler hâlinde yaz.", kural: "Çarpanları çarpım çiftleriyle bul: 1 × n'den başla, çiftler tekrar edene kadar devam et.",
      kontrol: "6 × 6 çiftinde 6 iki kez yazılmaz; bu yüzden 36'nın çarpan sayısı tek sayıdır (9)." }),
  );

  SORU_EKLE("carpan.say",
    z => { const havuz = karistir([12, 15, 16, 18, 20, 21, 24, 28, 30, 32, 36, 40, 42, 45, 48]).slice(0, 4); const i = R(0, 3); const gercek = havuz.map(n => bolenler(n).length);
      const yazilan = gercek.map((c, j) => j === i ? c + sec([-1, 1]) : c);
      return S({ kaz: "carpan.say", duzey: "uygulama", zorluk: 2, soru: "Ece dört sayının çarpan sayılarını aşağıdaki tabloya yazmış, ancak bir sayıda hata yapmıştır.<br>Ece <b>hangi sayının</b> çarpan sayısını yanlış yazmıştır?",
        gorsel: G.tablo(["Sayı", ...havuz.map(String)], [["Çarpan sayısı", ...yazilan.map(String)]]),
        dogru: havuz[i], yanlis: havuz.filter((_, j) => j !== i).map(n => [n, "islem", `${n}${ek(n, "in")} çarpanları ${bolenler(n).join(", ")} → ${bolenler(n).length} tane; tabloda doğru yazılmış.`]),
        ipucu: "Her sayının çarpanlarını çiftler hâlinde yazıp say.",
        cozum: ["🔎 Soruyu anlayalım: Tablodaki dört sayının çarpan sayısını kontrol edip hatalı olanı bulacağız.", "💡 Hatırlayalım: Çarpanları çiftler hâlinde (1 × n, 2 × …) yazarsak hiçbirini kaçırmayız.",
          ...[[0, 1], [2, 3]].map(p => "✏️ " + p.map(j => `${havuz[j]}: ${bolenler(havuz[j]).join(", ")} → ${gercek[j]} çarpan${j === i ? ` (tabloda ${yazilan[j]} yazıyor ✗)` : " ✓"}`).join(" | ")),
          `✅ Sonuç: Hata ${havuz[i]} sayısında; doğrusu ${gercek[i]} olmalı.`, "🔁 Kontrol edelim: Çarpan çiftlerinin sayısını 2 ile çarp; iki eşit çarpanlı (6 × 6 gibi) bir çift varsa 1 çıkar."],
        kural: "Çarpan sayısını bulurken çarpanları çiftler hâlinde yaz ve say.", dogruNeden: `${havuz[i]}${ek(havuz[i], "in")} ${gercek[i]} çarpanı vardır, tabloda ${yazilan[i]} yazılmıştır.` }); },
    Q("carpan.say", "transfer", 3, "Bir kutuda üzerinde 1'den 20'ye kadar sayılar yazan 20 kart vardır. Öğretmen, üzerindeki sayının <b>çarpan sayısı tek</b> olan kartları ayırıyor.<br>Öğretmen kaç kart ayırır?", "4",
      [["3", "dikkat", "1'i unuttun: 1'in tek bir çarpanı vardır (1) ve 1 tek sayıdır."], ["10", "kavrama", "Kartın üzerindeki sayının tek olmasına baktın; soru çarpan sayısının tek olmasını soruyor."], ["8", "kavrama", "Asal sayıları saydın; asal sayıların 2 çarpanı vardır ve 2 çift sayıdır."]],
      "Çarpanlar genellikle çift çift gelir. Hangi sayılarda bir çarpan kendisiyle eşleşir?",
      ["🔎 Soruyu anlayalım: 1–20 arasındaki sayılardan çarpan sayısı tek olanları sayacağız.", "💡 Hatırlayalım: Çarpanlar çiftler hâlinde yazılır (12 = 1 × 12 = 2 × 6 = 3 × 4). Bir çift aynı iki sayıdan oluşursa (4 = 2 × 2) o çarpan bir kez sayılır ve çarpan sayısı tek olur.", "✏️ Aynı sayının kendisiyle çarpımı olan sayılar: 1 × 1 = 1, 2 × 2 = 4, 3 × 3 = 9, 4 × 4 = 16 (5 × 5 = 25, 20'den büyük).", "✏️ Kontrol: 1 → 1 çarpan; 4 → 1, 2, 4; 9 → 1, 3, 9; 16 → 1, 2, 4, 8, 16. Hepsi tek sayıda.", "✅ Sonuç: 1, 4, 9 ve 16 → 4 kart ayrılır.", "🔁 Kontrol edelim: Örneğin 12'nin çarpanları 1, 2, 3, 4, 6, 12 → 6 tane (çift). Eşleşmeyen çarpan yoksa çarpan sayısı çifttir."],
      { kural: "Bir sayının çarpan sayısı yalnızca sayı bir doğal sayının kendisiyle çarpımı ise (1, 4, 9, 16 …) tektir.", dogruNeden: "Yalnızca 1, 4, 9 ve 16'nın çarpan sayısı tektir." }),
  );

  SORU_EKLE("carpan.model",
    z => { const n = sec([24, 30, 36, 40, 48, 60]); const ciftler = bolenler(n).filter(d => d * d < n).map(d => [d, n / d]); const goster = sec(ciftler.filter(c => c[0] > 1 && c[1] <= 15)) || ciftler[1];
      const k = sec([5, 7, 9, 10, 11].filter(d => n % d)); const yan = [k, Math.round(n / k)]; const digerler = karistir(ciftler.filter(c => c !== goster)).slice(0, 3);
      return S({ kaz: "carpan.model", duzey: "uygulama", zorluk: 2, soru: `Şekildeki ${goster[0]} × ${goster[1]} dikdörtgen modeli ${n} birim kareden oluşmuştur. Bu karelerin <b>hepsi</b> kullanılarak, boşluk kalmadan yeni dikdörtgenler oluşturulacaktır.<br>Aşağıdaki boyutlardan hangisinde bir dikdörtgen <b>oluşturulamaz</b>?`,
        gorsel: G.izgara(goster[0], goster[1]), dogru: `${yan[0]} × ${yan[1]}`,
        yanlis: digerler.map(c => [`${c[0]} × ${c[1]}`, "dikkat", `${c[0]} × ${c[1]} = ${n}; bu dikdörtgen oluşturulabilir. Soru oluşturulamayanı soruyor.`]),
        ipucu: "Kenar uzunluklarının çarpımı kare sayısına eşit olmalı.",
        cozum: [`🔎 Soruyu anlayalım: ${n} birim karenin tamamıyla hangi dikdörtgenin yapılamayacağını bulacağız.`, `💡 Hatırlayalım: ${n} birim kareyle kurulan her dikdörtgenin kenarları, çarpımı ${n} olan bir çarpan çiftidir.`, `✏️ ${n}${ek(n, "in")} çarpan çiftleri: ${ciftler.map(c => c[0] + " × " + c[1]).join(", ")}.`, `✏️ ${yan[0]} × ${yan[1]} = ${yan[0] * yan[1]}; bu ${n} değil.`, `✏️ Zaten ${n} ÷ ${k} işleminde ${n % k} kalır; ${k}, ${n}${ek(n, "in")} çarpanı değildir.`, `✅ Sonuç: ${yan[0]} × ${yan[1]} boyutunda dikdörtgen oluşturulamaz.`, "🔁 Kontrol edelim: Diğer seçeneklerdeki kenarları çarpınca hepsi aynı kare sayısını verir."],
        kural: "Birim karelerle kurulan dikdörtgenin kenarları, kare sayısının bir çarpan çiftidir.", dogruNeden: `${yan[0]} × ${yan[1]} = ${yan[0] * yan[1]} ≠ ${n}; ${k}, ${n}${ek(n, "in")} çarpanı değildir.` }); },
    () => ONC({ kaz: "carpan.model", duzey: "baglanti", zorluk: 2, giris: "Mert, 18 birim kareyi boşluk bırakmadan dizerek kısa kenarı 3 birim olan şekildeki dikdörtgeni oluşturmuştur.", gorsel: G.izgara(3, 6),
      ifadeler: [["Dikdörtgenin uzun kenarı 6 birimdir.", true, "3 × 6 = 18 olduğundan uzun kenar 6 birimdir."], ["Aynı karelerin hepsiyle 2 × 9 boyutunda bir dikdörtgen de oluşturulabilir.", true, "2 × 9 = 18; 2 ile 9 da 18'in bir çarpan çiftidir."], ["Aynı karelerin hepsiyle bir kenarı 4 birim olan dikdörtgen oluşturulabilir.", false, "18 ÷ 4 = 4 kalan 2; 4, 18'in çarpanı değildir."]],
      hatirla: "Birim karelerle kurulan dikdörtgenin kenarları, kare sayısının çarpan çiftidir. 18'in çarpan çiftleri: 1 × 18, 2 × 9, 3 × 6.",
      ipucu: "18'in çarpan çiftlerini yaz.", kural: "Dikdörtgen modeli = çarpan çifti. Kenarlar çarpılınca kare sayısı bulunur." }),
  );

  SORU_EKLE("kat.bul",
    z => { const k = sec([6, 7, 8, 9, 12, 15]); const katlar = karistir([4, 5, 6, 7, 8, 9, 10, 11]).slice(0, 4).map(m => m * k); const olmaz = katlar[3] + R(1, k - 1); const uc = katlar.slice(0, 3);
      return S({ kaz: "kat.bul", duzey: "uygulama", zorluk: 1, soru: `Defne bir oyunda sayı doğrusunun 0 noktasından başlayıp her seferinde ${k} birim ileri zıplıyor.<br>Defne aşağıdaki noktalardan hangisine <b>basamaz</b>?`,
        gorsel: G.sayiDogrusu({ min: 0, max: 4 * k, adim: k, noktalar: [1, 2, 3].map(m => ({ v: m * k, ad: "↷" })) }), dogru: olmaz,
        yanlis: uc.map(m => [m, "dikkat", `${m} = ${k} × ${m / k}; Defne ${m / k}. zıplayışında bu noktaya basar. Soru basmadığı noktayı soruyor.`]),
        ipucu: `Defne'nin bastığı noktalar ${k}${ek(k, "in")} katlarıdır.`,
        cozum: [`🔎 Soruyu anlayalım: Defne 0'dan başlayıp ${k}'${ek(k, "er").slice(1)} ${k}'${ek(k, "er").slice(1)} ilerliyor; basamayacağı noktayı arıyoruz.`, `💡 Hatırlayalım: Bastığı noktalar 0, ${k}, ${2 * k}, ${3 * k} … yani ${k}${ek(k, "in")} katlarıdır.`, `✏️ Seçenekleri ${k}${ek(k, "e")} bölelim: ${uc.map(m => `${m} ÷ ${k} = ${m / k}`).join("; ")} → kalansız.`, `✏️ ${olmaz} ÷ ${k} = ${Math.floor(olmaz / k)} kalan ${olmaz % k} → ${k}${ek(k, "in")} katı değil.`, `✅ Sonuç: Defne ${olmaz} noktasına basamaz.`, `🔁 Kontrol edelim: ${k} × ${Math.floor(olmaz / k)} = ${k * Math.floor(olmaz / k)} ve ${k} × ${Math.floor(olmaz / k) + 1} = ${k * (Math.floor(olmaz / k) + 1)}; ${olmaz} bu iki kat arasında kalıyor.`],
        kural: "Eşit adımlarla 0'dan ilerlerken basılan noktalar adım uzunluğunun katlarıdır.", dogruNeden: `${olmaz}, ${k}${ek(k, "in")} katı değildir; bölümde ${olmaz % k} kalır.` }); },
    () => ONC({ kaz: "kat.bul", duzey: "aciklama", zorluk: 2, giris: "Katlar ile ilgili aşağıdaki ifadeler veriliyor:",
      ifadeler: [["0, her doğal sayının katıdır.", true, "Her sayı × 0 = 0 olduğundan 0 her sayının katıdır."], ["12'nin katları 1, 2, 3, 4, 6 ve 12'dir.", false, "Bunlar 12'nin çarpanlarıdır. 12'nin katları 0, 12, 24, 36 … biçiminde devam eder."], ["Bir sayının katları sonsuza kadar devam eder.", true, "Sayıyı 1, 2, 3 … ile çarpmaya hiç bitmeden devam edebiliriz."]],
      hatirla: "Bir sayının katları, o sayının doğal sayılarla (0, 1, 2, 3 …) çarpımıdır. Çarpanlar sayıdan küçük ya da ona eşittir, katlar ise sayıya eşit ya da ondan büyüktür (0 hariç).",
      ipucu: "Kat ile çarpanı karıştırma: kat, sayının çarpılmasıyla elde edilir.", kural: "a × b = c ise c, a'nın katıdır; a ise c'nin çarpanıdır." }),
  );

  SORU_EKLE("kat.aralik",
    z => { const k = R(3, 9); let a, b; do { a = R(10, 40); b = a + R(25, 50); } while (a % k === 0 || b % k === 0); const ilk = Math.ceil(a / k) * k, son = Math.floor(b / k) * k, say = (son - ilk) / k + 1;
      return S({ kaz: "kat.aralik", duzey: "transfer", zorluk: 2, soru: `Bir bisiklet yolunun başlangıcından itibaren her ${k} km'de bir su istasyonu vardır (ilk istasyon ${k}. km'dedir).<br>Yolun ${a}. km'si ile ${b}. km'si arasında kaç su istasyonu vardır?`,
        dogru: say, yanlis: [[say + 1, "dikkat", `${a} ve ${b}, ${k}${ek(k, "in")} katı değil; aralığın uçlarında istasyon yok. Fazladan bir istasyon saydın.`], [Math.floor(b / k), "strateji", `Yolun başından ${b}. km'ye kadar olan bütün istasyonları saydın; ${a}. km'den önceki istasyonları saymamalısın.`], [say - 1, "islem", "Bir istasyonu atladın; ilk ve son istasyonu da saymayı unutma."]],
        ipucu: `${a}${ek(a, "den")} büyük ilk ${k}${ek(k, "in")} katını ve ${b}${ek(b, "den")} küçük son katını bul.`,
        cozum: [`🔎 Soruyu anlayalım: İstasyonlar ${k}${ek(k, "in")} katlarında. ${a} ile ${b} arasındaki katları sayacağız.`, "💡 Hatırlayalım: Aralıktaki katları saymak için ilk ve son katı bulur, aradaki adımları sayarız: (son − ilk) ÷ adım + 1.", `✏️ ${a}${ek(a, "den")} sonraki ilk kat: ${ilk} (${k} × ${ilk / k}).`, `✏️ ${b}${ek(b, "den")} önceki son kat: ${son} (${k} × ${son / k}).`, `✏️ Sayı: (${son} − ${ilk}) ÷ ${k} + 1 = ${say}.`, `✅ Sonuç: Bu aralıkta ${say} su istasyonu vardır.`, `🔁 Kontrol edelim: Tek tek yazalım: ${[...Array(say)].map((_, i) => ilk + i * k).join(", ")} → ${say} tane.`],
        kural: "Aralıktaki kat sayısı = (son kat − ilk kat) ÷ sayı + 1.", dogruNeden: `${ilk}${ek(ilk, "den")} ${son}${ek(son, "e")} kadar ${k}${ek(k, "er")} artan ${say} kat vardır.` }); },
    () => ONC({ kaz: "kat.aralik", duzey: "uygulama", zorluk: 2, giris: "40 ile 80 arasındaki 6'nın katları ile ilgili aşağıdaki ifadeler veriliyor:",
      ifadeler: [["Bu aralıkta 6'nın 7 katı vardır.", true, "42, 48, 54, 60, 66, 72, 78 → 7 tane."], ["Bu katların en büyüğü 78'dir.", true, "78 = 6 × 13; bir sonraki kat 84, 80'den büyüktür."], ["Bu katların hepsi 3'ün de katıdır.", true, "6 = 2 × 3 olduğundan 6'nın her katı 3'ün de katıdır."]],
      hatirla: "Aralıktaki katları bulmak için ilk ve son katı belirleyip aradakileri sayarız. 6'nın katları 3'e de bölünür, çünkü 6 = 3 × 2.",
      ipucu: "40'tan büyük ilk 6'nın katı 42'dir.", kural: "Bir sayının katı, o sayının çarpanlarının da katıdır.",
      kontrol: "Bu soruda üç öncül de doğru. “Hepsi doğru olamaz” diye düşünme; her öncülü kendi içinde kontrol et." }),
  );

  SORU_EKLE("kat.problem",
    z => { const k = sec([6, 8, 9, 12, 15]); let n; do { n = R(50, 150); } while (n % k === 0); const eksik = k - n % k;
      return S({ kaz: "kat.problem", duzey: "transfer", zorluk: 2, soru: `Bir fabrikada ${n} kavanoz reçel, ${k}'${ek(k, "er").slice(1)} kavanoz alan kolilere yerleştirilecek. Bütün kolilerin tam dolu olması isteniyor.<br>Buna göre <b>en az kaç kavanoz daha</b> üretilmelidir?`,
        dogru: eksik, yanlis: [[n % k, "kavrama", "Bu sayı bölmedeki kalandır; yani açıkta kalan kavanoz sayısı. Kalan koliyi doldurmak için gereken sayıyı bulmalısın."], [Math.ceil(n / k), "kavrama", "Bu sayı gereken koli sayısıdır; soru eklenecek kavanoz sayısını soruyor."], [k, "strateji", `Bir koli dolusu (${k}) eklemek gerekmez; yalnızca eksik kalan yerler kadar kavanoz yeterli.`]],
        ipucu: `${n}${ek(n, "den")} büyük ilk ${k}${ek(k, "in")} katını bul.`,
        cozum: [`🔎 Soruyu anlayalım: ${n} kavanozun hepsi ${k} kavanoz alan kolilere tam dolu yerleşsin istiyoruz.`, `💡 Hatırlayalım: Koliler tam dolu olursa kavanoz sayısı ${k}${ek(k, "in")} katı olmalıdır.`, `✏️ ${n} ÷ ${k} = ${Math.floor(n / k)} kalan ${n % k}. Yani ${Math.floor(n / k)} koli dolar, ${n % k} kavanoz açıkta kalır.`, `✏️ ${n}${ek(n, "den")} büyük ilk ${k}${ek(k, "in")} katı: ${k} × ${Math.ceil(n / k)} = ${Math.ceil(n / k) * k}.`, `✏️ Eksik: ${Math.ceil(n / k) * k} − ${n} = ${eksik}.`, `✅ Sonuç: En az ${eksik} kavanoz daha üretilmelidir.`, `🔁 Kontrol edelim: ${n} + ${eksik} = ${n + eksik} ve ${n + eksik} ÷ ${k} = ${(n + eksik) / k}, kalan 0.`],
        kural: "“En az kaç tane eklenmeli?” sorusunda sayıdan büyük ilk katı bul ve farkı al.", dogruNeden: `${n + eksik}, ${n}${ek(n, "den")} büyük ilk ${k}${ek(k, "in")} katıdır; ${n + eksik} − ${n} = ${eksik}.` }); },
    Q("kat.problem", "transfer", 2, "Bir otoparkta araçlar 6'lı sıralar hâlinde park ediliyor. Otoparkta 40'tan fazla, 50'den az araç vardır ve bütün sıralar tam doludur.<br>Otoparktaki araç sayısı ile ilgili aşağıdakilerden hangisi <b>kesinlikle doğrudur</b>?", "Araç sayısı 42 ya da 48'dir.",
      [["Araç sayısı yalnızca 42'dir.", "dikkat", "48 de 6'nın katıdır ve 40 ile 50 arasındadır; bu yüzden yalnızca 42 diyemeyiz."], ["Araç sayısı 45'tir.", "islem", "45 ÷ 6 = 7 kalan 3; son sıra tam dolmaz. 45 6'nın katı değildir."], ["Araç sayısı 36 ya da 42'dir.", "dikkat", "36, 40'tan küçüktür; araç sayısı 40'tan fazla olmalı."]],
      "Sıralar tam dolu ise araç sayısı 6'nın katıdır. 40 ile 50 arasındaki katları yaz.",
      ["🔎 Soruyu anlayalım: Araç sayısı 40 ile 50 arasında ve 6'lı sıralar tam dolu.", "💡 Hatırlayalım: Bütün sıralar tam doluysa araç sayısı 6'nın katıdır.", "✏️ 6'nın katları: … 36, 42, 48, 54 …", "✏️ 40'tan büyük ve 50'den küçük olanlar: 42 ve 48.", "✅ Sonuç: Araç sayısı 42 ya da 48'dir; ikisi de olabilir.", "🔁 Kontrol edelim: 42 ÷ 6 = 7 sıra, 48 ÷ 6 = 8 sıra; ikisinde de kalan yok. “Kesinlikle” sözcüğü bütün olasılıkları kapsayan seçeneği ister."],
      { kural: "Koşulları sağlayan bütün sayıları bul; “kesinlikle doğru” seçenek hepsini kapsamalı.", dogruNeden: "40 ile 50 arasında 6'nın katı olan iki sayı vardır: 42 ve 48." }),
  );

  SORU_EKLE("bol.kural",
    z => { let N, m; do { N = R(1000, 9999); m = [N % 3 === 0, N % 4 === 0, N % 6 === 0]; } while (!m.some(Boolean)); const t = N % 100, rt = String(N).split("").reduce((a, c) => a + +c, 0);
      return ONC({ kaz: "bol.kural", duzey: "uygulama", zorluk: 2, giris: `Bir kitaplıkta <b>${sayiYaz(N)}</b> kitap vardır. Bu kitaplar ile ilgili aşağıdaki ifadeler veriliyor:`,
        ifadeler: [["Kitaplar 3 rafa eşit olarak, hiç artmadan dağıtılabilir.", m[0], `Rakamlar toplamı ${rt}; bu sayı ${m[0] ? "3'ün katıdır" : "3'ün katı değildir"}.`], ["Kitaplar 4'erli paketlere, hiç artmadan konulabilir.", m[1], `Son iki basamağın oluşturduğu sayı ${t}; bu sayı ${m[1] ? "4'ün katıdır" : "4'ün katı değildir"}.`], ["Kitaplar 6 rafa eşit olarak, hiç artmadan dağıtılabilir.", m[2], N % 2 ? "Sayı tek olduğu için 2'ye, dolayısıyla 6'ya bölünmez." : `Sayı çift${m[0] ? " ve 3'e bölünüyor; bu yüzden 6'ya bölünür" : " ama 3'e bölünmüyor; bu yüzden 6'ya bölünmez"}.`]],
        hatirla: "3 → rakamlar toplamı 3'ün katı. 4 → son iki basamak 4'ün katı. 6 → hem 2'ye hem 3'e bölünmeli.",
        ipucu: "Her öncül bir bölünebilme kuralına karşılık geliyor.", kural: "6'ya bölünebilme = 2'ye bölünebilme + 3'e bölünebilme." }); },
    Q("bol.kural", "transfer", 2, "Bir pastane kurabiyeleri 6'lı kutularda satıyor. Aşağıdaki kurabiye sayılarından hangisi kutulara <b>hiç artmadan</b> yerleştirilebilir?", "3 474",
      [["2 314", "kavrama", "2 314 çifttir ama rakamları toplamı 10; 3'e bölünmediği için 6'ya da bölünmez."], ["4 215", "kavrama", "Rakamları toplamı 12 (3'e bölünür) ama sayı tektir; 2'ye bölünmediği için 6'ya bölünmez."], ["1 352", "islem", "Rakamları toplamı 1 + 3 + 5 + 2 = 11; 3'ün katı değil, bu yüzden 6'ya bölünmez."]],
      "6'ya bölünen bir sayı hem 2'ye hem 3'e bölünmeli.",
      ["🔎 Soruyu anlayalım: Hangi sayının 6'ya kalansız bölündüğünü bulacağız.", "💡 Hatırlayalım: Bir sayı hem 2'ye (çift) hem 3'e (rakamlar toplamı 3'ün katı) bölünüyorsa 6'ya bölünür.", "✏️ 2 314: çift, 2 + 3 + 1 + 4 = 10 → 3'e bölünmez ✗. 4 215: tek → 2'ye bölünmez ✗.", "✏️ 1 352: çift, 1 + 3 + 5 + 2 = 11 → 3'e bölünmez ✗. 3 474: çift, 3 + 4 + 7 + 4 = 18 → 3'e bölünür ✓.", "✅ Sonuç: 3 474 kurabiye 6'lı kutulara hiç artmadan yerleşir.", "🔁 Kontrol edelim: 3 474 ÷ 6 = 579, kalan 0."],
      { kural: "6'ya bölünebilmek için iki koşul birlikte sağlanmalı: çift olmak ve rakamlar toplamının 3'ün katı olması.", dogruNeden: "3 474 çifttir ve rakamları toplamı 18'dir; hem 2'ye hem 3'e, dolayısıyla 6'ya bölünür." }),
  );

  SORU_EKLE("bol.rakam",
    z => { const x = R(1, 9), y = R(0, 9); const A3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => (x + a + y) % 3 === 0), A9 = A3.filter(a => (x + a + y) % 9 === 0); const top = A3.reduce((p, c) => p + c, 0);
      return S({ kaz: "bol.rakam", duzey: "uygulama", zorluk: 3, soru: `Bir kasanın dört basamaklı şifresi <b>${x}A${y}B</b> biçimindedir. Şifre hem 10'a hem 3'e kalansız bölünen bir sayıdır.<br>Buna göre A yerine yazılabilecek rakamların <b>toplamı</b> kaçtır?`,
        dogru: top, yanlis: [[A9.reduce((p, c) => p + c, 0) || top + 3, "kavrama", "Yalnızca 9'a bölünmeyi sağlayan rakamları topladın; koşul 3'e bölünebilmek."], [top - A3[0] || top + 1, "dikkat", "Bir değeri atladın; A yerine 0'dan 9'a kadar bütün rakamları tek tek dene (0 da bir rakamdır)."], [A3.length, "dikkat", "Bu, A'nın alabileceği değerlerin sayısı; soru bu değerlerin toplamını istiyor."]],
        ipucu: "10'a bölünme B'yi, 3'e bölünme A'yı belirler.",
        cozum: [`🔎 Soruyu anlayalım: ${x}A${y}B sayısı 10'a ve 3'e bölünüyor; A'nın alabileceği rakamları toplayacağız.`, "💡 Hatırlayalım: 10'a bölünen sayının birler basamağı 0'dır. 3'e bölünen sayının rakamları toplamı 3'ün katıdır.", "✏️ 10'a bölünme → B = 0.", `✏️ Rakamlar toplamı: ${x} + A + ${y} + 0 = ${x + y} + A. Bu toplam 3'ün katı olmalı.`, `✏️ A = ${A3.join(", ")} için toplam sırasıyla ${A3.map(a => x + y + a).join(", ")} olur; hepsi 3'ün katı.`, `✅ Sonuç: ${A3.join(" + ")} = ${top}.`, "🔁 Kontrol edelim: A'ya 0'dan 9'a kadar bütün rakamları denedik; 3'er artan değerler aldığına dikkat et."],
        kural: "Eksik rakam sorularında önce tek koşullu basamağı (birler) bul, sonra rakamlar toplamı koşulunu uygula.", dogruNeden: `A; ${A3.join(", ")} olabilir ve toplamları ${top}'dir.` }); },
    Q("bol.rakam", "transfer", 3, "Bir saat kulesinin yapım yılı tabelada silinmiş ve <b>19A2</b> biçiminde görünüyor. Rehber, bu yılın hem 3'e hem 4'e kalansız bölündüğünü söylüyor.<br>Buna göre A'nın alabileceği değerlerin toplamı kaçtır?", "12",
      [["18", "dikkat", "Yalnızca 3'e bölünme koşulunu kullandın (0, 3, 6, 9). 4'e bölünme koşulunu da kontrol etmelisin."], ["25", "dikkat", "Yalnızca 4'e bölünme koşulunu kullandın (1, 3, 5, 7, 9). 3'e bölünme koşulunu da kontrol etmelisin."], ["9", "dikkat", "Yalnızca en büyük değeri aldın; 3 de iki koşulu sağlar."]],
      "4 için son iki basamak (A2), 3 için rakamlar toplamı.",
      ["🔎 Soruyu anlayalım: 19A2 sayısı hem 3'e hem 4'e bölünüyor; A'nın olabilecek değerlerini toplayacağız.", "💡 Hatırlayalım: 3 → rakamlar toplamı 3'ün katı. 4 → son iki basamağın oluşturduğu sayı 4'ün katı.", "✏️ 3'e bölünme: 1 + 9 + A + 2 = 12 + A → A = 0, 3, 6, 9.", "✏️ 4'e bölünme: A2 sayısı 4'ün katı → 12, 32, 52, 72, 92 → A = 1, 3, 5, 7, 9.", "✏️ İki listede ortak olanlar: A = 3 ve A = 9 (1932 ve 1992).", "✅ Sonuç: 3 + 9 = 12.", "🔁 Kontrol edelim: 1932 ÷ 3 = 644, 1932 ÷ 4 = 483; 1992 ÷ 3 = 664, 1992 ÷ 4 = 498. İkisi de kalansız."],
      { kural: "İki koşul varsa her koşulun listesini ayrı çıkar, sonra ortak olanları al.", dogruNeden: "Yalnızca A = 3 ve A = 9 iki koşulu birlikte sağlar; 3 + 9 = 12." }),
  );

  SORU_EKLE("bol.ayirt",
    z => { const B = [2, 3, 4, 5, 6, 9, 10]; let N, D, Y; do { N = R(100, 9999); D = B.filter(b => N % b === 0); Y = B.filter(b => N % b); } while (D.length < 3 || !Y.length); const y = sec(Y), d3 = karistir(D).slice(0, 3); const rt = String(N).split("").reduce((a, c) => a + +c, 0);
      const neden = b => ({ 2: `birler basamağı ${N % 10}`, 3: `rakamlar toplamı ${rt}`, 4: `son iki basamak ${N % 100}`, 5: `birler basamağı ${N % 10}`, 6: "2'ye ve 3'e bölünme durumu", 9: `rakamlar toplamı ${rt}`, 10: `birler basamağı ${N % 10}` })[b];
      return S({ kaz: "bol.ayirt", duzey: "uygulama", zorluk: 2, soru: `<b>${sayiYaz(N)}</b> sayısı aşağıdakilerden hangisine <b>kalansız bölünemez</b>?`, dogru: y,
        yanlis: d3.map(b => [b, "dikkat", `${sayiYaz(N)} sayısı ${b}${ek(b, "e")} kalansız bölünür (${neden(b)}). Soru bölünemeyeni soruyor.`]),
        ipucu: "Her seçenek için ilgili kuralı uygula: birler basamağı, son iki basamak ya da rakamlar toplamı.",
        cozum: [`🔎 Soruyu anlayalım: ${sayiYaz(N)} sayısının seçeneklerden hangisine bölünmediğini bulacağız.`, "💡 Hatırlayalım: 2, 5, 10 → birler basamağı; 4 → son iki basamak; 3, 9 → rakamlar toplamı; 6 → 2 ve 3 birlikte.", `✏️ Birler basamağı ${N % 10}, son iki basamak ${N % 100}, rakamlar toplamı ${rt}.`, `✏️ Bölünenler: ${D.join(", ")}.`, `✏️ ${y}: ${neden(y)} → kural sağlanmıyor ✗.`, `✅ Sonuç: ${sayiYaz(N)} sayısı ${y}${ek(y, "e")} kalansız bölünemez.`, `🔁 Kontrol edelim: ${sayiYaz(N)} ÷ ${y} işleminde ${N % y} kalır.`],
        kural: "Bölünebilme kuralları: 2-5-10 birler basamağı, 4 son iki basamak, 3-9 rakamlar toplamı, 6 = 2 ve 3.", dogruNeden: `${sayiYaz(N)} ÷ ${y} işleminde ${N % y} kalır.` }); },
    () => ONC({ kaz: "bol.ayirt", duzey: "aciklama", zorluk: 3, giris: "Bölünebilme kuralları ile ilgili aşağıdaki ifadeler veriliyor:",
      ifadeler: [["9'a kalansız bölünen her sayı 3'e de kalansız bölünür.", true, "Rakamlar toplamı 9'un katıysa 3'ün de katıdır (9 = 3 × 3)."], ["3'e kalansız bölünen her sayı 9'a da kalansız bölünür.", false, "12 sayısı 3'e bölünür ama 9'a bölünmez; tek bir örnek ifadeyi çürütür."], ["10'a kalansız bölünen her sayı hem 2'ye hem 5'e kalansız bölünür.", true, "Birler basamağı 0 olan sayı çifttir ve 0 ile biter; hem 2'ye hem 5'e bölünür."]],
      hatirla: "Büyük sayıya bölünen, onun çarpanlarına da bölünür (9 → 3; 10 → 2 ve 5). Tersi her zaman doğru değildir.",
      ipucu: "“Her sayı” diyen bir ifadeyi çürütmek için tek bir karşı örnek yeter.", kural: "Bir sayıya bölünen sayı, o sayının çarpanlarına da bölünür; tersi her zaman doğru değildir.",
      kontrol: "II. öncül için 12, 15, 21 gibi örnekleri dene: 3'e bölünürler ama 9'a bölünmezler." }),
  );

  SORU_EKLE("asal.tani",
    z => { const bas = R(2, 9) * 10; const sayilar = [...Array(10)].map((_, i) => bas + i); const asallar = sayilar.filter(asalMi), tekler = sayilar.filter(s => s % 2);
      return S({ kaz: "asal.tani", duzey: "transfer", zorluk: 2, soru: `Bir apartmanın ${bas / 10}. katındaki daireler ${bas}'${ek(bas, "den").slice(1)} ${bas + 9}'${ek(bas + 9, "e").slice(1)} kadar numaralandırılmıştır. Yönetici, numarası <b>asal sayı</b> olan dairelere mavi kapı tabelası takacaktır.<br>Kaç daireye mavi tabela takılır?`,
        gorsel: G.tablo(["Daire no", ...sayilar.slice(0, 5).map(String)], [["", ...sayilar.slice(5).map(String)]]),
        dogru: asallar.length, yanlis: [[tekler.length, "kavrama", "Tek sayıları saydın; ama 9, 15, 21 gibi tek sayıların ikiden fazla çarpanı olabilir. Tek sayıların hepsi asal değildir."], [asallar.length + 1, "islem", "Asal olmayan bir sayıyı asal saydın; her sayıyı 2, 3, 5, 7 ile bölmeyi dene."], [Math.max(0, asallar.length - 1), "islem", "Bir asal sayıyı atladın; listeyi yeniden kontrol et."]],
        ipucu: "Çift sayılar ve 5 ile biten sayılar (5 hariç) asal olamaz. Kalanları 3 ve 7 ile bölmeyi dene.",
        cozum: [`🔎 Soruyu anlayalım: ${bas}–${bas + 9} arasındaki asal sayıları sayacağız.`, "💡 Hatırlayalım: Asal sayının yalnızca iki çarpanı vardır: 1 ve kendisi.", `✏️ Çift sayıları ve 5 ile bitenleri eleyelim; geriye kalanlar: ${sayilar.filter(s => s % 2 && s % 5).join(", ")}.`, `✏️ Bunları 3 ve 7 ile bölmeyi deneyelim: ${sayilar.filter(s => s % 2 && s % 5).map(s => asalMi(s) ? s + " asal" : `${s} = ${bolenler(s)[1]} × ${s / bolenler(s)[1]}`).join("; ")}.`, `✅ Sonuç: Asal olanlar ${asallar.join(", ") || "yok"} → ${asallar.length} daire.`, "🔁 Kontrol edelim: Bir sayının asal olduğunu söylemeden önce 2, 3, 5, 7 ile bölünmediğinden emin ol (100'den küçük sayılar için bu yeterlidir)."],
        kural: "100'den küçük bir sayı 2, 3, 5 ve 7'ye bölünmüyorsa asaldır (1 hariç).", dogruNeden: `${bas}–${bas + 9} arasındaki asal sayılar: ${asallar.join(", ")}.` }); },
    () => ONC({ kaz: "asal.tani", duzey: "aciklama", zorluk: 2, giris: "Asal sayılarla ilgili aşağıdaki ifadeler veriliyor:",
      ifadeler: [["2, çift olan tek asal sayıdır.", true, "Diğer bütün çift sayılar 2'ye bölündüğü için ikiden fazla çarpanı vardır."], ["İki asal sayının toplamı her zaman çift sayıdır.", false, "2 + 3 = 5 tek sayıdır. Bir karşı örnek yeter."], ["51 bir asal sayıdır.", false, "5 + 1 = 6 olduğundan 51 3'e bölünür: 51 = 3 × 17."]],
      hatirla: "Asal sayıların tam iki çarpanı vardır. 2 dışındaki asal sayılar tektir. Bir sayıyı asal saymadan önce 3'e bölünüp bölünmediğine rakamlar toplamıyla bak.",
      ipucu: "51'in rakamları toplamına bak.", kural: "Tek sayı olmak asal olmak demek değildir: 9, 15, 21, 51 … tek ama bileşiktir." }),
  );

  SORU_EKLE("asal.ayir",
    z => { const n = sec([60, 72, 84, 90, 120, 126, 150, 180, 168, 140]); const satir = []; let x = n; while (x > 1) { let p = 2; while (x % p) p++; satir.push([x, p]); x /= p; } satir.push([1, ""]);
      const A = satir[1][0], B = satir[2][1], Ci = satir.length - 2, C = satir[Ci][0];
      const tab = satir.map((r, i) => [i === 1 ? "A" : i === Ci ? "C" : String(r[0]), i === 2 ? "B" : String(r[1])]); const top = A + B + C;
      return S({ kaz: "asal.ayir", duzey: "uygulama", zorluk: 2, soru: `Selin, ${n} sayısını bölen merdiveni ile asal çarpanlarına ayırırken bazı yerlere harf yazmıştır.<br>Buna göre <b>A + B + C</b> kaçtır?`,
        gorsel: G.tablo(["Sayı", "Asal bölen"], tab), dogru: top,
        yanlis: [[A + B + satir[Ci - 1][0], "dikkat", "C için bir üst satırdaki sayıyı aldın; C, o sayının asal bölenine bölünmesiyle bulunan bölümdür."], [A + B, "dikkat", "C'yi unuttun; son satıra kadar merdiveni tamamla."], [A + satir[2][0] + C, "kavrama", "B, asal bölen sütunundadır; o satırdaki sayıyı değil, o sayının en küçük asal bölenini almalısın."]],
        ipucu: "Her satırda: sayı ÷ asal bölen = alt satırdaki sayı.",
        cozum: [`🔎 Soruyu anlayalım: ${n}${ek(n, "in")} bölen merdivenindeki A, B, C'yi bulup toplayacağız.`, "💡 Hatırlayalım: Bölen merdiveninde sayı, en küçük asal bölenine bölünür; bölüm bir alt satıra yazılır. 1'e ulaşınca durulur.", `✏️ A = ${n} ÷ ${satir[0][1]} = ${A}.`, `✏️ B, ${satir[2][0]} sayısının en küçük asal böleni: B = ${B}.`, `✏️ C satırı: ${C} ÷ ${satir[Ci][1]} = 1 olduğundan C = ${C}.`, `✅ Sonuç: A + B + C = ${A} + ${B} + ${C} = ${top}.`, `🔁 Kontrol edelim: Asal bölenlerin çarpımı ${satir.slice(0, -1).map(r => r[1]).join(" × ")} = ${n}. Merdiven doğru!`],
        kural: "Bölen merdiveninde her satır: sayı ÷ en küçük asal bölen = alttaki sayı.", dogruNeden: `A = ${A}, B = ${B}, C = ${C}; toplam ${top}.` }); },
    Q("asal.ayir", "baglanti", 2, "Bir sayının asal çarpanları <b>yalnızca 2, 3 ve 7'dir</b>. Bu sayı aşağıdakilerden hangisi olabilir?", "84",
      [["70", "kavrama", "70 = 2 × 5 × 7; asal çarpanları arasında 5 var, 3 yok."], ["63", "kavrama", "63 = 3 × 3 × 7; asal çarpanları arasında 2 yok."], ["105", "kavrama", "105 = 3 × 5 × 7; 2 yok ve 5 var."]],
      "Her seçeneği asal çarpanlarına ayır ve 2, 3, 7 dışında çarpan olup olmadığına bak.",
      ["🔎 Soruyu anlayalım: Asal çarpanları tam olarak 2, 3 ve 7 olan sayıyı arıyoruz.", "💡 Hatırlayalım: Asal çarpanlara ayırmada sayıyı en küçük asal sayıdan başlayarak böleriz.", "✏️ 84 → 2 → 42 → 2 → 21 → 3 → 7 → 7 → 1. 84 = 2² · 3 · 7 ✓.", "✏️ 70 = 2 · 5 · 7 (5 var) ✗; 63 = 3² · 7 (2 yok) ✗; 105 = 3 · 5 · 7 ✗.", "✅ Sonuç: Sayı 84 olabilir.", "🔁 Kontrol edelim: 2 × 2 × 3 × 7 = 84. Asal çarpanların tekrar etmesi sorun değil; farklı asal çarpanlar 2, 3 ve 7."],
      { kural: "Asal çarpanlar sorulduğunda tekrar edenler bir kez yazılır: 84'ün asal çarpanları 2, 3, 7.", dogruNeden: "84 = 2² · 3 · 7; farklı asal çarpanları tam olarak 2, 3 ve 7'dir." }),
  );

  SORU_EKLE("asal.kavram",
    Q("asal.kavram", "uygulama", 2, "Üzerinde 1, 2, 9, 11, 15 ve 17 yazan altı kart vardır. Asal sayı yazan kartlar mavi kutuya, bileşik sayı yazan kartlar kırmızı kutuya atılacaktır.<br>Buna göre aşağıdakilerden hangisi <b>doğrudur</b>?", "1 yazan kart hiçbir kutuya atılmaz.",
      [["Mavi kutuya 4 kart atılır.", "bilgi", "Mavi kutuya 2, 11 ve 17 atılır → 3 kart. 1'i asal saydıysan dikkat: 1 asal değildir."], ["Kırmızı kutuya 9, 15 ve 17 atılır.", "islem", "17'nin yalnızca 1 ve 17 çarpanı var; 17 asaldır, mavi kutuya atılır."], ["2 yazan kart kırmızı kutuya atılır.", "kavrama", "2 çift ama asaldır; çarpanları yalnızca 1 ve 2'dir."]],
      "1 sayısının kaç çarpanı var? Asal sayının tanımında kaç çarpan olmalı?",
      ["🔎 Soruyu anlayalım: Kartları asal ve bileşik diye ayırıp doğru ifadeyi seçeceğiz.", "💡 Hatırlayalım: Asal sayının tam 2 çarpanı, bileşik sayının 2'den fazla çarpanı vardır. 1'in tek çarpanı olduğu için 1 ne asal ne bileşiktir.", "✏️ Asal: 2 (1, 2), 11 (1, 11), 17 (1, 17) → mavi kutuya 3 kart.", "✏️ Bileşik: 9 (1, 3, 9), 15 (1, 3, 5, 15) → kırmızı kutuya 2 kart.", "✏️ 1 yazan kart iki gruba da girmez.", "✅ Sonuç: “1 yazan kart hiçbir kutuya atılmaz.” ifadesi doğrudur.", "🔁 Kontrol edelim: 3 mavi + 2 kırmızı + 1 dışarıda = 6 kart. Hepsi hesaba katıldı."],
      { kural: "1 ne asal ne bileşiktir; 2 hem çift hem asal olan tek sayıdır.", dogruNeden: "1'in yalnızca bir çarpanı vardır; asal da bileşik de değildir." }),
    () => ONC({ kaz: "asal.kavram", duzey: "aciklama", zorluk: 2, giris: "Üç öğrenci asal ve bileşik sayılar hakkında şunları söylüyor:", soruSonu: "Hangi öğrencilerin söyledikleri doğrudur? (I: Ece, II: Can, III: Elif)",
      ifadeler: [["Ece: “Bileşik sayıların en az üç çarpanı vardır.”", true, "Bileşik sayının 1 ve kendisinden başka en az bir çarpanı daha vardır; yani en az 3 çarpan."], ["Can: “Bütün tek sayılar asaldır.”", false, "9 = 3 × 3 tektir ama bileşiktir; 1 de tektir ama asal değildir."], ["Elif: “Her asal sayının çarpanlarından biri 1'dir.”", true, "Asal sayının çarpanları 1 ve kendisidir; 1 her zaman çarpandır."]],
      hatirla: "Asal: tam 2 çarpan (1 ve kendisi). Bileşik: 2'den fazla çarpan. 1: tek çarpan, ne asal ne bileşik.",
      ipucu: "Can'ın sözü için tek bir karşı örnek bul.", kural: "Asal → 2 çarpan; bileşik → 3 ya da daha fazla çarpan." }),
  );

  SORU_EKLE("okat.ekok",
    z => { const L = sec([24, 30, 36, 40, 60, 72]); const b = bolenler(L).filter(d => d > 1 && d < L); const ciftler = []; b.forEach((x, i) => b.slice(i + 1).forEach(y => ciftler.push([x, y])));
      const iyi = ciftler.filter(c => ekok(c[0], c[1]) === L), kotu = karistir(ciftler.filter(c => ekok(c[0], c[1]) !== L && ekok(c[0], c[1]) >= 6)); const d = sec(iyi);
      const k3 = kotu.sort((p, q) => (q[0] * q[1] === L) - (p[0] * p[1] === L)).slice(0, 3);
      return S({ kaz: "okat.ekok", duzey: "uygulama", zorluk: 2, soru: `Aşağıdaki sayı çiftlerinden hangisinin en küçük ortak katı (EKOK) <b>${L}</b>'${ek(L, "dir").slice(1)}?`, dogru: `${d[0]} ve ${d[1]}`,
        yanlis: k3.map(c => [`${c[0]} ve ${c[1]}`, c[0] * c[1] === L ? "kavrama" : "islem", c[0] * c[1] === L ? `${c[0]} × ${c[1]} = ${L} olsa da EKOK çarpım değildir; ${c[0]} ile ${c[1]}${ek(c[1], "in")} EKOK'u ${ekok(c[0], c[1])}.` : `${c[0]} ile ${c[1]}${ek(c[1], "in")} EKOK'u ${ekok(c[0], c[1])}${ek(ekok(c[0], c[1]), "dir")}.`]),
        ipucu: "Büyük sayının katlarını sırayla yaz; küçük sayıya bölünen ilk kat EKOK'tur.",
        cozum: [`🔎 Soruyu anlayalım: EKOK'u ${L} olan sayı çiftini arıyoruz.`, "💡 Hatırlayalım: EKOK, iki sayının sıfırdan büyük en küçük ortak katıdır. Büyük sayının katlarını yazıp küçük sayıya bölünen ilkini bulabiliriz.", `✏️ ${d[0]} ve ${d[1]}: ${d[1]}${ek(d[1], "in")} katları ${[1, 2, 3, 4, 5, 6].map(m => m * d[1]).filter(v => v <= L).join(", ")} → ${d[0]}${ek(d[0], "e")} bölünen ilk kat ${L} ✓.`, `✏️ Diğerleri: ${k3.map(c => `EKOK(${c[0]}, ${c[1]}) = ${ekok(c[0], c[1])}`).join("; ")}.`, `✅ Sonuç: EKOK'u ${L} olan çift ${d[0]} ve ${d[1]}.`, "🔁 Kontrol edelim: İki sayının çarpımı her zaman EKOK değildir; ortak çarpanları varsa EKOK çarpımdan küçük olur."],
        kural: "EKOK = sıfırdan büyük en küçük ortak kat. Ortak çarpan varsa EKOK, çarpımdan küçüktür.", dogruNeden: `${d[0]} ve ${d[1]}${ek(d[1], "in")} ortak katlarının en küçüğü ${L}'dir.` }); },
    Q("okat.ekok", "baglanti", 3, "Asal çarpanlarına ayrılmış hâlleri <b>A = 2² · 3</b> ve <b>B = 2 · 5</b> olan iki sayının EKOK'u aşağıdakilerden hangisidir?", "2² · 3 · 5",
      [["2 · 3 · 5", "kavrama", "2'nin üslerinden küçüğünü aldın. EKOK'ta her asal çarpanın en büyük üssü alınır: 2²."], ["2³ · 3 · 5", "islem", "2'nin üslerini topladın (2 + 1 = 3). EKOK'ta üsler toplanmaz, büyük olan seçilir."], ["2", "kavrama", "Bu, iki sayının en büyük ortak bölenidir (EBOB); EKOK değil."]],
      "A = 12, B = 10. Asal çarpanların en büyük üslülerini al.",
      ["🔎 Soruyu anlayalım: Asal çarpanları verilen A ve B'nin EKOK'unu bulacağız.", "💡 Hatırlayalım: EKOK, iki sayının da katı olmalıdır. Bu yüzden iki sayıdaki bütün asal çarpanları, en büyük üsleriyle almalıyız.", "✏️ Asal çarpanlar: 2 (A'da 2², B'de 2¹), 3 (yalnızca A'da), 5 (yalnızca B'de).", "✏️ En büyük üsler: 2², 3, 5 → EKOK = 2² · 3 · 5 = 60.", "✅ Sonuç: EKOK = 2² · 3 · 5.", "🔁 Kontrol edelim: A = 12, B = 10. 12'nin katları: 12, 24, 36, 48, 60 → 10'a bölünen ilk kat 60 ✓."],
      { kural: "EKOK: ortak ve ortak olmayan bütün asal çarpanlar, en büyük üsleriyle çarpılır.", dogruNeden: "2² · 3 · 5 = 60, hem 12'nin hem 10'un en küçük ortak katıdır." }),
  );

  SORU_EKLE("okat.problem",
    z => { const [a, b] = sec([[4, 6], [6, 8], [6, 9], [8, 12], [10, 15], [4, 10], [9, 12]]); const L = ekok(a, b), T = sec([1, 2, 3]), s = T * 60, say = Math.floor(s / L);
      return S({ kaz: "okat.problem", duzey: "transfer", zorluk: 3, soru: `Bir sahnedeki kırmızı ışık ${a} saniyede bir, mavi ışık ${b} saniyede bir yanıp sönüyor. İki ışık gösterinin başında birlikte yanıyor.<br>Gösterinin ilk <b>${T} dakikasında</b>, başlangıç anı <b>hariç</b>, iki ışık kaç kez birlikte yanar?`,
        dogru: say, yanlis: [[say + 1, "dikkat", "Başlangıç anını da saydın; soru başlangıç anı hariç diyor."], [Math.floor(s / (a * b)), "kavrama", `${a} × ${b} = ${a * b} ortak kattır ama en küçüğü değil; birlikte yanma aralığı EKOK(${a}, ${b}) = ${L} saniyedir.`], [Math.floor(T * 100 / L), "islem", `${T} dakikayı saniyeye çevirirken hata yaptın; 1 dakika = 60 saniye.`]],
        ipucu: "İki ışık EKOK kadar saniyede bir birlikte yanar. Dakikayı saniyeye çevir.",
        cozum: [`🔎 Soruyu anlayalım: Işıklar ${a} ve ${b} saniyede bir yanıyor; ${T} dakikada kaç kez birlikte yandıklarını bulacağız.`, "💡 Hatırlayalım: “Birlikte tekrar” soruları ortak kat ister; birlikte yanma aralığı EKOK'tur.", `✏️ ${b}${ek(b, "in")} katları: ${[1, 2, 3, 4].map(m => m * b).join(", ")} … → ${a}${ek(a, "e")} bölünen ilk kat ${L}. EKOK = ${L} saniye.`, `✏️ ${T} dakika = ${s} saniye.`, `✏️ ${s} ÷ ${L} = ${say}${s % L ? " kalan " + s % L : ""}.`, `✅ Sonuç: Başlangıç hariç ${say} kez birlikte yanarlar.`, `🔁 Kontrol edelim: Birlikte yandıkları anlar: ${[...Array(Math.min(say, 6))].map((_, i) => (i + 1) * L).join(", ")}${say > 6 ? " …" : ""} saniye. Hepsi ${s} saniyeden küçük ya da eşit.`],
        kural: "“Birlikte tekrar” → EKOK. Başlangıç anı dahil mi değil mi, soruyu dikkatle oku.", dogruNeden: `${L} saniyede bir birlikte yanarlar; ${s} ÷ ${L} → ${say} kez.` }); },
    Q("okat.problem", "transfer", 3, "Bir kutudaki kalemler 4'erli, 6'şarlı ve 9'arlı gruplara ayrıldığında her seferinde <b>1 kalem artıyor</b>. Kutudaki kalem sayısı 100'den az olduğuna göre <b>en fazla</b> kaçtır?", "73",
      [["37", "dikkat", "37 koşulları sağlayan en küçük sayıdır; soru 100'den küçük en büyük sayıyı istiyor."], ["72", "dikkat", "72 gruplara tam bölünür; her seferinde 1 kalem artması için 72'ye 1 eklemelisin."], ["109", "dikkat", "109 koşulları sağlar ama 100'den büyüktür."]],
      "Kalem sayısının 1 eksiği 4'e, 6'ya ve 9'a tam bölünür.",
      ["🔎 Soruyu anlayalım: Sayı 4'e, 6'ya, 9'a bölününce hep 1 kalıyor; 100'den küçük en büyük böyle sayıyı arıyoruz.", "💡 Hatırlayalım: Her bölmede 1 artıyorsa sayının 1 eksiği bu sayıların ortak katıdır.", "✏️ EKOK(4, 6, 9): 9'un katları 9, 18, 27, 36 → 36, 4'e ve 6'ya da bölünür. EKOK = 36.", "✏️ Ortak katlar: 36, 72, 108 … → kalem sayısı: 37, 73, 109 …", "✏️ 100'den küçük olanlar: 37 ve 73.", "✅ Sonuç: En fazla 73 kalem vardır.", "🔁 Kontrol edelim: 73 = 4 × 18 + 1 = 6 × 12 + 1 = 9 × 8 + 1. Her seferinde 1 artıyor ✓."],
      { kural: "Hep aynı kalanı veren sayı = ortak kat + kalan.", dogruNeden: "73 − 1 = 72, 4'ün, 6'nın ve 9'un ortak katıdır ve 73 < 100'dür; bir sonraki 109 > 100." }),
  );

  SORU_EKLE("obol.ebob",
    z => { const [a, b] = sec([[24, 36], [18, 30], [20, 30], [16, 40], [28, 42], [30, 45], [36, 54], [32, 48]]); const g = ebob(a, b), ob = bolenler(g);
      return S({ kaz: "obol.ebob", duzey: "uygulama", zorluk: 2, soru: `Aşağıdaki tabloda ${a} ve ${b} sayılarının bölenleri verilmiştir.<br>Buna göre ${a} ile ${b}${ek(b, "in")} <b>kaç tane ortak böleni</b> vardır?`,
        gorsel: G.tablo(["Sayı", "Bölenleri"], [[String(a), bolenler(a).join(", ")], [String(b), bolenler(b).join(", ")]]), dogru: ob.length,
        yanlis: [[g, "kavrama", `${g}, ortak bölenlerin en büyüğüdür (EBOB); soru kaç tane ortak bölen olduğunu soruyor.`], [ob.length - 1, "dikkat", "1'i saymayı unuttun; 1 her sayının bölenidir ve ortak bölendir."], [bolenler(a).length, "dikkat", `Yalnızca ${a}${ek(a, "in")} bölenlerini saydın; ${b}${ek(b, "i")} de bölenleri seçmelisin.`], [bolenler(a).length + bolenler(b).length - ob.length, "kavrama", "İki sayının bütün farklı bölenlerini saydın; yalnızca iki listede de bulunanları saymalısın."]],
        ipucu: "İki listede de bulunan sayıları işaretle.",
        cozum: [`🔎 Soruyu anlayalım: ${a} ve ${b}${ek(b, "in")} ikisini de bölen sayıları sayacağız.`, "💡 Hatırlayalım: İki sayıyı da kalansız bölen sayılara ortak bölen denir. En büyüğü EBOB'dur.", `✏️ ${a}: ${bolenler(a).join(", ")}.`, `✏️ ${b}: ${bolenler(b).join(", ")}.`, `✏️ İki listede de olanlar: ${ob.join(", ")}.`, `✅ Sonuç: ${ob.length} ortak bölen vardır (EBOB = ${g}).`, `🔁 Kontrol edelim: Ortak bölenler, EBOB'un (${g}) bölenleridir: ${bolenler(g).join(", ")} ✓.`],
        kural: "İki sayının ortak bölenleri, EBOB'larının bölenleridir.", dogruNeden: `Ortak bölenler ${ob.join(", ")} → ${ob.length} tane.` }); },
    () => ONC({ kaz: "obol.ebob", duzey: "aciklama", zorluk: 2, giris: "18 ve 30 sayıları ile ilgili aşağıdaki ifadeler veriliyor:",
      ifadeler: [["EBOB(18, 30) = 6'dır.", true, "18'in bölenleri 1, 2, 3, 6, 9, 18; 30'un bölenleri 1, 2, 3, 5, 6, 10, 15, 30. Ortakların en büyüğü 6."], ["18 ile 30'un 4 tane ortak böleni vardır.", true, "Ortak bölenler: 1, 2, 3, 6 → 4 tane."], ["İki sayının EBOB'u, bu sayılardan küçük olanından büyük olabilir.", false, "EBOB küçük sayıyı da bölmeli; bir sayıyı bölen sayı ondan büyük olamaz."]],
      hatirla: "EBOB, iki sayıyı da kalansız bölen en büyük sayıdır. Bir sayının bölenleri o sayıdan büyük olamaz.",
      ipucu: "Önce iki sayının bölenlerini yaz.", kural: "EBOB, sayılardan küçük olanına eşit ya da ondan küçüktür." }),
  );

  SORU_EKLE("obol.problem",
    z => { const g = sec([4, 5, 6, 8, 10, 12]); let x, y; do { x = R(3, 9); y = R(4, 12); } while (x === y || ebob(x, y) !== 1); const a = g * x, b = g * y;
      return S({ kaz: "obol.problem", duzey: "transfer", zorluk: 3, soru: `Bir manavda ${a} L elma suyu ve ${b} L portakal suyu vardır. Meyve suları birbirine karıştırılmadan, hiç artmadan, eşit hacimli ve <b>olabildiğince büyük</b> şişelere doldurulacaktır.<br>Buna göre <b>en az kaç şişe</b> gerekir?`,
        dogru: x + y, yanlis: [[g, "kavrama", `${g} L bir şişenin hacmidir; soru kaç şişe gerektiğini soruyor.`], [ekok(a, b) / g, "kavrama", "EKOK kullandın; eşit parçalara bölme sorularında ortak bölen (EBOB) kullanılır."], [g % 2 === 0 ? (a + b) / (g / 2) : x + y + 1, "strateji", `${g % 2 === 0 ? g / 2 + " L de ortak bölendir ama en büyüğü değil; daha büyük şişelerle daha az şişe gerekir." : "Bir şişeyi fazladan saydın; her meyve suyu için şişe sayısını ayrı bulup topla."}`]],
        ipucu: "Şişe hacmi iki miktarı da tam bölmeli ve en büyük olmalı → EBOB.",
        cozum: [`🔎 Soruyu anlayalım: ${a} L ve ${b} L meyve suyu, eşit ve en büyük şişelere dolacak; şişe sayısını bulacağız.`, "💡 Hatırlayalım: “Eşit parçalara, en büyük, hiç artmadan” ifadeleri EBOB ister.", `✏️ EBOB(${a}, ${b}) = ${g} → bir şişe ${g} L.`, `✏️ Elma suyu: ${a} ÷ ${g} = ${x} şişe. Portakal suyu: ${b} ÷ ${g} = ${y} şişe.`, `✏️ Toplam: ${x} + ${y} = ${x + y} şişe.`, `✅ Sonuç: En az ${x + y} şişe gerekir.`, `🔁 Kontrol edelim: ${x + y} × ${g} = ${a + b} L = ${a} + ${b} ✓. Şişe ne kadar büyükse şişe sayısı o kadar azdır.`],
        kural: "En az sayıda eşit parça → parça büyüklüğü EBOB; parça sayısı = toplam ÷ EBOB.", dogruNeden: `Şişeler ${g} L olur: ${a} ÷ ${g} + ${b} ÷ ${g} = ${x + y}.` }); },
    Q("obol.problem", "transfer", 3, "Bir çiçekçide 24 gül, 36 papatya ve 60 lale vardır. Çiçekçi bu çiçeklerin hepsini kullanarak buketler hazırlayacaktır. Her bukette eşit sayıda gül, eşit sayıda papatya ve eşit sayıda lale olacaktır.<br>Çiçekçi <b>en çok</b> kaç buket hazırlar ve bir bukette kaç çiçek olur?", "12 buket, 10 çiçek",
      [["12 buket, 12 çiçek", "dikkat", "Buket sayısını doğru buldun ama bir buketteki çiçek sayısı 2 gül + 3 papatya + 5 lale = 10'dur."], ["6 buket, 20 çiçek", "strateji", "6 da ortak bölendir ama en büyüğü değildir; en çok buket için EBOB (12) kullanılır."], ["4 buket, 30 çiçek", "strateji", "4 ortak bölendir ama en büyüğü değildir; daha fazla buket hazırlanabilir."]],
      "Buket sayısı 24, 36 ve 60'ın üçünü de bölmeli ve en büyük olmalı.",
      ["🔎 Soruyu anlayalım: 24, 36 ve 60 çiçek, eşit içerikli en çok sayıda bukete ayrılacak.", "💡 Hatırlayalım: Buket sayısı her çiçek sayısını tam bölmeli → ortak bölen. “En çok” → EBOB.", "✏️ EBOB(24, 36, 60): 24 = 2³ · 3, 36 = 2² · 3², 60 = 2² · 3 · 5 → ortak: 2² · 3 = 12.", "✏️ Bir bukette: 24 ÷ 12 = 2 gül, 36 ÷ 12 = 3 papatya, 60 ÷ 12 = 5 lale.", "✏️ Bir buketteki çiçek: 2 + 3 + 5 = 10.", "✅ Sonuç: 12 buket hazırlanır, her bukette 10 çiçek olur.", "🔁 Kontrol edelim: 12 × 10 = 120 = 24 + 36 + 60 ✓."],
      { kural: "En çok sayıda eşit grup → grup sayısı EBOB'dur.", dogruNeden: "EBOB(24, 36, 60) = 12; her bukette 2 + 3 + 5 = 10 çiçek olur." }),
  );

  SORU_EKLE("obol.ayirt",
    Q("obol.ayirt", "aciklama", 2, "Aşağıdaki durumlardan hangisinin çözümünde <b>en büyük ortak bölen (EBOB)</b> kullanılır?", "18 m ve 24 m uzunluğundaki iki kumaşı, artık kalmadan en uzun eş parçalara ayırmak",
      [["6 ve 8 günde bir nöbet tutan iki öğretmenin yeniden birlikte nöbet tutacağı günü bulmak", "kavrama", "“Yeniden birlikte” ifadesi tekrar eden olaylardır; bu EKOK ister."], ["Kenarları 6 cm ve 10 cm olan fayanslarla oluşturulabilecek en küçük kareyi bulmak", "kavrama", "Küçük parçaları birleştirip büyük şekil oluşturmak EKOK ister."], ["3'erli ve 5'erli sayıldığında hiç artmayan en az bilye sayısını bulmak", "kavrama", "Sayı hem 3'ün hem 5'in katı olmalı; bu EKOK ister."]],
      "Büyük bir bütünü eşit parçalara bölmek mi, küçükleri birleştirip ortak bir büyüklüğe ulaşmak mı?",
      ["🔎 Soruyu anlayalım: Dört durumdan hangisinin EBOB ile çözüldüğünü bulacağız.", "💡 Hatırlayalım: Bir bütünü eşit ve en büyük parçalara bölmek → EBOB. Birlikte tekrar, en küçük kare, en az sayı → EKOK.", "✏️ Kumaşları en uzun eş parçalara ayırmak: parça boyu 18'i ve 24'ü bölmeli → EBOB ✓.", "✏️ Nöbet günü (birlikte tekrar), en küçük kare (birleştirme), en az bilye (iki sayının katı) → hepsi EKOK.", "✅ Sonuç: Kumaşları parçalara ayırma durumunda EBOB kullanılır.", "🔁 Kontrol edelim: EBOB(18, 24) = 6 m; parça, kumaştan büyük olamaz. EKOK sonucu ise verilen sayılardan büyük ya da eşittir."],
      { kural: "Parçalamak → EBOB (sonuç verilenlerden küçük). Birleştirmek/tekrar → EKOK (sonuç verilenlerden büyük).", dogruNeden: "Parça uzunluğu iki kumaş boyunu da bölmeli ve en büyük olmalı; bu EBOB'dur." }),
    z => { const [a, b] = sec([[12, 18], [8, 12], [10, 15], [12, 20], [9, 15], [16, 24]]); const g = ebob(a, b), L = ekok(a, b); const m1 = Math.random() < 0.5, m2 = Math.random() < 0.5;
      return ONC({ kaz: "obol.ayirt", duzey: "uygulama", zorluk: 3, giris: `${a} ve ${b} sayıları ile ilgili aşağıdaki ifadeler veriliyor:`,
        ifadeler: [[`${a} ile ${b}${ek(b, "in")} EBOB'u ${m1 ? g : L}'${ek(m1 ? g : L, "dir").slice(1)}.`, m1, m1 ? `${g}, ikisini de bölen en büyük sayıdır.` : `${L} EKOK'tur; EBOB ise ${g}'${ek(g, "dir").slice(1)}.`], [`${a} ile ${b}${ek(b, "in")} EKOK'u ${m2 ? L : a * b}'${ek(m2 ? L : a * b, "dir").slice(1)}.`, m2, m2 ? `${L}, ikisinin de katı olan en küçük sayıdır.` : `${a * b} ortak kattır ama en küçüğü değil; EKOK ${L}'${ek(L, "dir").slice(1)}.`], [`EKOK, EBOB'un bir katıdır.`, true, `${L} ÷ ${g} = ${L / g}; EKOK her zaman EBOB'a kalansız bölünür.`]],
        hatirla: "EBOB iki sayıyı bölen en büyük sayı, EKOK iki sayıya bölünen en küçük sayıdır (0 hariç). EBOB ≤ küçük sayı, EKOK ≥ büyük sayı.",
        ipucu: "EBOB sayılardan küçük, EKOK sayılardan büyük ya da eşit olmalı.", kural: "EBOB küçük sayıdan büyük olamaz; EKOK büyük sayıdan küçük olamaz." }); },
  );

  /* ======================= TEMA 2: İSTATİSTİKSEL OLASILIK ======================= */

  SORU_EKLE("ol.tahmin",
    z => { let c, t, ev; do { c = [...Array(6)].map(() => R(4, 14)); t = c.reduce((a, b) => a + b, 0); ev = c[1] + c[3] + c[5]; } while (kesir(ev, t) === "1/2" || kesir(ev, t) === kesir(t - ev, t));
      return S({ kaz: "ol.tahmin", duzey: "uygulama", zorluk: 2, soru: `Zeynep bir zarı ${t} kez atıp her yüzün kaç kez geldiğini aşağıdaki sütun grafiğinde göstermiştir.<br>Bu deneye göre zarın <b>çift sayı</b> gelme olasılığının tahmini kaçtır?`,
        gorsel: G.sutun(c.map((v, i) => [String(i + 1), v]), { baslik: "Zarın gelen yüzleri", birim: "kez" }), dogru: kesir(ev, t),
        yanlis: [["1/2", "kavrama", "Bu, teorik olasılıktır. Soru deney sonuçlarına göre (gözleme dayalı) tahmini istiyor."], [kesir(ev, t - ev), "kavrama", "Çift gelenleri tek gelenlere böldün; payda toplam atış sayısı olmalı."], [kesir(t - ev, t), "dikkat", "Tek sayı gelme tahminini buldun; soru çift sayıyı soruyor."]],
        ipucu: "2, 4 ve 6'nın kaç kez geldiğini topla; toplam atış sayısına böl.",
        cozum: [`🔎 Soruyu anlayalım: Zar ${t} kez atılmış; grafikteki sonuçlara göre çift sayı gelme olasılığını tahmin edeceğiz.`, "💡 Hatırlayalım: Gözleme dayalı olasılık = olayın gerçekleşme sayısı ÷ toplam deneme sayısı.", `✏️ Grafikten: 2 → ${c[1]}, 4 → ${c[3]}, 6 → ${c[5]} kez. Çift sayı: ${c[1]} + ${c[3]} + ${c[5]} = ${ev}.`, `✏️ Toplam atış: ${c.join(" + ")} = ${t}.`, `✏️ Oran: ${ev}/${t}${kesir(ev, t) !== ev + "/" + t ? " = " + kesir(ev, t) : ""}.`, `✅ Sonuç: Çift sayı gelme olasılığının tahmini ${kesir(ev, t)}.`, `🔁 Kontrol edelim: Tek sayı tahmini ${kesir(t - ev, t)}; iki tahminin toplamı ${ev}/${t} + ${t - ev}/${t} = 1 olmalı ✓.`],
        kural: "Gözleme dayalı tahminde payda her zaman toplam deneme sayısıdır.", dogruNeden: `${t} atışın ${ev} tanesinde çift sayı gelmiştir: ${ev}/${t} = ${kesir(ev, t)}.` }); },
    Q("ol.tahmin", "transfer", 3, "Bir futbol takımında Ada ve Bora'nın antrenmandaki penaltı sonuçları tabloda verilmiştir. Koç, gol atma olasılığı daha yüksek görünen oyuncuyu maçta penaltıya gönderecektir.<br>Buna göre aşağıdakilerden hangisi doğrudur?", "Bora gönderilmeli, çünkü tahmini olasılığı 4/5'tir.",
      [["Ada gönderilmeli, çünkü daha çok gol atmıştır.", "kavrama", "Ada daha çok atış yapmıştır; gol sayısını değil, gol sayısının atış sayısına oranını karşılaştırmalısın."], ["Ada gönderilmeli, çünkü tahmini olasılığı 7/10'dur.", "islem", "7/10 = 0,7 ve 4/5 = 0,8'dir; Bora'nın oranı daha büyük."], ["İkisi de olur, çünkü ikisi de atışlarının çoğunu gole çevirmiştir.", "strateji", "İkisinin de oranı yarıdan fazla ama eşit değil; koç daha yüksek olanı seçmeli."]],
      "Her oyuncu için gol ÷ atış oranını bul ve karşılaştır.",
      ["🔎 Soruyu anlayalım: İki oyuncunun gol atma olasılığını tahmin edip karşılaştıracağız.", "💡 Hatırlayalım: Gözleme dayalı olasılık = gol sayısı ÷ atış sayısı. Atış sayıları farklıysa gol sayılarını değil oranları karşılaştırırız.", "✏️ Ada: 28/40 = 7/10 = 0,7.", "✏️ Bora: 20/25 = 4/5 = 0,8.", "✏️ 0,8 > 0,7 olduğundan Bora'nın tahmini olasılığı daha yüksektir.", "✅ Sonuç: Bora gönderilmeli, çünkü tahmini olasılığı 4/5'tir.", "🔁 Kontrol edelim: Paydaları eşitleyerek de bakabiliriz: 7/10 = 14/20, 4/5 = 16/20. 16/20 daha büyük ✓."],
      { gorsel: G.tablo(["Oyuncu", "Atış sayısı", "Gol sayısı"], [["Ada", "40", "28"], ["Bora", "25", "20"]]), kural: "Deneme sayıları farklıysa sayıları değil oranları karşılaştır.", dogruNeden: "Bora'nın oranı 20/25 = 0,8, Ada'nınki 28/40 = 0,7'dir." }),
  );

  SORU_EKLE("ol.kavram",
    () => ONC({ kaz: "ol.kavram", duzey: "aciklama", zorluk: 2, giris: "Bir torbada yalnızca 5 mavi ve 5 sarı bilye vardır. Torbadan bakmadan bilye çekilecektir.", gorsel: G.torba({ mavi: 5, sarı: 5 }),
      ifadeler: [["Torbadan yeşil bilye çekmek imkânsızdır.", true, "Torbada yeşil bilye yoktur; olasılık 0'dır."], ["Mavi bilye çekme olasılığı ile sarı bilye çekme olasılığı eşittir.", true, "İki renkten de 5'er tane vardır; şansları eşittir (5/10 = 1/2)."], ["Torbadan art arda 2 bilye çekilirse ikisinin de mavi olması kesindir.", false, "Sarı bilye de gelebilir; “kesin” olay her durumda gerçekleşmelidir."]],
      hatirla: "İmkânsız olay hiç gerçekleşmez (0), kesin olay her zaman gerçekleşir (1). Sayıları eşit olan sonuçların olasılıkları eşittir.",
      ipucu: "“Kesin” demek için olayın her durumda gerçekleşmesi gerekir.", kural: "0 → imkânsız, 1 → kesin, eşit sayıda sonuç → eşit olasılık." }),
    Q("ol.kavram", "baglanti", 2, "Aşağıdaki sayı doğrusunda K, L ve M noktaları bazı olayların olasılıklarını göstermektedir.<br>Aşağıdaki olaylardan hangisinin olasılığı <b>L noktası</b> ile gösterilebilir?", "Madenî para atıldığında tura gelmesi",
      [["Bir zar atıldığında 0 gelmesi", "kavrama", "Zarda 0 yoktur; bu olay imkânsızdır ve K noktası (0) ile gösterilir."], ["Pazartesi gününden sonra salı gününün gelmesi", "kavrama", "Bu olay her zaman gerçekleşir; kesindir ve M noktası (1) ile gösterilir."], ["Bir zar atıldığında 1 gelmesi", "bilgi", "Zarın 6 yüzünden yalnızca biri 1'dir; olasılığı 1/6'dır, 1/2 değil."]],
      "L noktası 0 ile 1'in tam ortasında: 1/2.",
      ["🔎 Soruyu anlayalım: K = 0, L = 1/2, M = 1 noktalarını gösteriyor. Olasılığı 1/2 olan olayı arıyoruz.", "💡 Hatırlayalım: 0 imkânsız, 1 kesin, 1/2 ise “eşit şans” demektir.", "✏️ Para atışında iki eşit şanslı sonuç var: yazı ve tura → tura olasılığı 1/2 ✓.", "✏️ Zarda 0 → imkânsız (K). Salıdan önce pazartesi → kesin (M). Zarda 1 → 1/6 (0'a daha yakın).", "✅ Sonuç: Madenî paranın tura gelmesi L noktası ile gösterilir.", "🔁 Kontrol edelim: 1/6, 0 ile 1/2 arasında bir noktadır; L'nin solunda kalır."],
      { gorsel: G.sayiDogrusu({ min: 0, max: 1, adim: 0.5, araAdim: 0.25, etiket: x => x === 0.5 ? "1/2" : od(x), noktalar: [{ v: 0, ad: "K" }, { v: 0.5, ad: "L" }, { v: 1, ad: "M" }] }), kural: "Olasılık 0 ile 1 arasındadır: 0 imkânsız, 1/2 eşit şans, 1 kesin.", dogruNeden: "Paranın iki yüzü eşit şanslıdır; tura gelme olasılığı 1/2'dir." }),
  );

  SORU_EKLE("ol.yorum",
    z => { const n = sec([50, 100, 200]); const k = R(2, 9); const N = sec([1000, 2000, 5000]); const bek = k * N / n;
      return S({ kaz: "ol.yorum", duzey: "transfer", zorluk: 3, soru: `Bir fabrikada üretilen ampullerden rastgele seçilen ${n} ampulün ${k} tanesinin bozuk olduğu görülmüştür.<br>Bu fabrikada üretilen <b>${sayiYaz(N)}</b> ampulde yaklaşık kaç bozuk ampul olması beklenir?`,
        dogru: bek, yanlis: [[k, "dikkat", "Bu, örneklemdeki bozuk ampul sayısıdır; yeni miktara göre büyütmelisin."], [sayiYaz(N - bek), "dikkat", "Bu, sağlam olması beklenen ampul sayısıdır; soru bozukları soruyor."], [sayiYaz(bek * 10), "islem", `${sayiYaz(N)}, ${n}${ek(n, "in")} ${N / n} katıdır; çarparken basamak kaydırdın.`]],
        ipucu: "Önce bozuk çıkma olasılığını tahmin et, sonra bunu yeni ampul sayısına uygula.",
        cozum: [`🔎 Soruyu anlayalım: ${n} ampulde ${k} bozuk çıkmış; ${sayiYaz(N)} ampulde kaç bozuk beklendiğini bulacağız.`, "💡 Hatırlayalım: Beklenen sayı ≈ gözleme dayalı olasılık × yeni deneme sayısı.", `✏️ Bozuk çıkma olasılığının tahmini: ${k}/${n}.`, `✏️ ${sayiYaz(N)} ÷ ${n} = ${N / n}; yani ampul sayısı ${N / n} katına çıkıyor.`, `✏️ Bozuk sayısı da ${N / n} katına çıkar: ${k} × ${N / n} = ${bek}.`, `✅ Sonuç: Yaklaşık ${bek} bozuk ampul beklenir.`, `🔁 Kontrol edelim: ${bek}/${sayiYaz(N)} oranı sadeleşince ${kesir(k, n)} olur; oran korunmuş ✓. Bu bir tahmindir; gerçek sayı biraz farklı olabilir.`],
        kural: "Beklenen sayı = gözleme dayalı olasılık × toplam sayı.", dogruNeden: `${k}/${n} × ${sayiYaz(N)} = ${bek}.` }); },
    () => ONC({ kaz: "ol.yorum", duzey: "transfer", zorluk: 3, giris: "Ece bir raptiyeyi 50 kez atmış ve sonuçları aşağıdaki sütun grafiğinde göstermiştir.", gorsel: G.sutun([["Ucu yukarı", 30], ["Yan yatmış", 20]], { baslik: "Raptiye deneyi", birim: "kez" }),
      ifadeler: [["Raptiyenin ucu yukarı gelme olasılığının tahmini 3/5'tir.", true, "30/50 = 3/5."], ["Raptiye 500 kez atılırsa yaklaşık 300 kez ucu yukarı gelmesi beklenir.", true, "500 × 3/5 = 300."], ["Raptiye bir kez daha atılırsa ucu yukarı geleceği kesindir.", false, "Tahmini olasılık 3/5'tir, 1 değildir; yan da gelebilir."]],
      hatirla: "Gözleme dayalı olasılık bir tahmindir. Yeni deneme sayısıyla çarparak beklenen sayıyı buluruz, ama hiçbir zaman sonucu kesin bilemeyiz.",
      ipucu: "Olasılık 1 olmadıkça hiçbir sonuç kesin değildir.", kural: "Tahmin, beklentidir; kesinlik bildirmez." }),
  );

  /* ======================= TEMA 3: KESİRLER, ONDALIK GÖSTERİM, ÖLÇME ======================= */

  SORU_EKLE("bas.deger",
    z => { const d = () => sec([1, 2, 3, 4, 5, 6, 8, 9]); const dogru = `${R(0, 2)},7${d()}${d()}`; const y1 = `${R(5, 9)},${d()}7${d()}`, y2 = `${R(1, 9)}${d()},${d()}${d()}7`, y3 = `${R(3, 9)},${d()}7`;
      return S({ kaz: "bas.deger", duzey: "uygulama", zorluk: 2, soru: "Aşağıdaki sayılardan hangisinde <b>7 rakamının basamak değeri en büyüktür</b>?", dogru,
        yanlis: [[y1, "kavrama", "Bu sayı daha büyük ama 7 yüzde birler basamağında: basamak değeri 0,07."], [y2, "kavrama", "Sayının kendisi en büyük olabilir ama 7 binde birler basamağında: basamak değeri 0,007."], [y3, "kavrama", "Bu sayıda 7 yüzde birler basamağında: basamak değeri 0,07."]],
        ipucu: "Sayıların büyüklüğüne değil, 7'nin hangi basamakta olduğuna bak.",
        cozum: ["🔎 Soruyu anlayalım: Dört sayıda da 7 var; 7'nin basamak değerinin en büyük olduğu sayıyı arıyoruz.", "💡 Hatırlayalım: Basamak değeri = rakam × bulunduğu basamağın değeri. Onda birler 0,1; yüzde birler 0,01; binde birler 0,001.", `✏️ ${dogru}: 7 onda birler basamağında → 0,7.`, `✏️ ${y1} ve ${y3}: 7 yüzde birler basamağında → 0,07. ${y2}: 7 binde birler basamağında → 0,007.`, "✏️ 0,7 > 0,07 > 0,007.", `✅ Sonuç: 7'nin basamak değeri en büyük olan sayı ${dogru}.`, "🔁 Kontrol edelim: Sayının kendisinin büyük olması, içindeki bir rakamın basamak değerinin büyük olduğu anlamına gelmez."],
        kural: "Bir rakam virgüle ne kadar yakınsa (sağ tarafta) basamak değeri o kadar büyüktür.", dogruNeden: `${dogru} sayısında 7 onda birler basamağındadır; basamak değeri 0,7'dir.` }); },
    () => ONC({ kaz: "bas.deger", duzey: "baglanti", zorluk: 3, giris: "<b>53,264</b> sayısı ile ilgili aşağıdaki ifadeler veriliyor:",
      ifadeler: [["2 rakamının basamak değeri 0,2'dir.", true, "2 onda birler basamağındadır: 2 × 0,1 = 0,2."], ["6 rakamının basamak değeri 0,6'dır.", false, "6 yüzde birler basamağındadır: 6 × 0,01 = 0,06."], ["3 rakamının basamak değeri, 2 rakamının basamak değerinin 15 katıdır.", true, "3'ün basamak değeri 3, 2'ninki 0,2; 0,2 × 15 = 3."]],
      hatirla: "Virgülün solu: birler, onlar …; virgülün sağı: onda birler (0,1), yüzde birler (0,01), binde birler (0,001).",
      ipucu: "Her rakamın hangi basamakta olduğunu yaz.", kural: "Basamak değeri = rakam × basamak değeri (0,1; 0,01; 0,001 …)." }),
  );

  SORU_EKLE("bas.ad",
    z => { const r = karistir([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5); const s = `${r[0]}${r[1]},${r[2]}${r[3]}${r[4]}`; if (new Set([r[3] + r[0], r[2] + r[0], r[3] + r[1], r[4] + r[0]]).size < 4) return null;
      return S({ kaz: "bas.ad", duzey: "uygulama", zorluk: 2, soru: `Bir kumaş topunun uzunluğu <b>${s} m</b>'dir. Bu sayıda <b>yüzde birler</b> basamağındaki rakam ile <b>onlar</b> basamağındaki rakamın toplamı kaçtır?`,
        dogru: r[3] + r[0], yanlis: [[r[2] + r[0], "bilgi", `${r[2]} onda birler basamağındadır; yüzde birler virgülden sonraki 2. basamaktır.`], [r[3] + r[1], "bilgi", `${r[1]} birler basamağındadır; onlar basamağı virgülün solundaki 2. basamaktır.`], [r[4] + r[0], "bilgi", `${r[4]} binde birler basamağındadır; yüzde birler virgülden sonraki 2. basamaktır.`]],
        ipucu: "Virgülden sağa: onda birler, yüzde birler, binde birler. Virgülden sola: birler, onlar.",
        cozum: [`🔎 Soruyu anlayalım: ${s} sayısında yüzde birler ve onlar basamaklarındaki rakamları toplayacağız.`, "💡 Hatırlayalım: Virgülün solunda sağdan sola birler, onlar; virgülün sağında soldan sağa onda birler, yüzde birler, binde birler.", `✏️ Onlar: ${r[0]}, birler: ${r[1]}.`, `✏️ Onda birler: ${r[2]}, yüzde birler: ${r[3]}, binde birler: ${r[4]}.`, `✏️ Toplam: ${r[3]} + ${r[0]} = ${r[3] + r[0]}.`, `✅ Sonuç: ${r[3] + r[0]}.`, "🔁 Kontrol edelim: “Onlar” ile “onda birler” adları birbirine benzer; onlar virgülün solunda, onda birler sağındadır."],
        kural: "Onlar ↔ onda birler, yüzler ↔ yüzde birler: virgülün iki yanında aynalı dizilirler.", dogruNeden: `Yüzde birler basamağında ${r[3]}, onlar basamağında ${r[0]} var; toplam ${r[3] + r[0]}.` }); },
    Q("bas.ad", "uygulama", 2, "Bir sayı ile ilgili ipuçları:<br>• Birler basamağında 2 vardır.<br>• Onda birler basamağında 0 vardır.<br>• Yüzde birler basamağında 8 vardır.<br>• Binde birler basamağında 5 vardır.<br>Bu sayı aşağıdakilerden hangisidir?", "2,085",
      [["2,580", "dikkat", "Ondalık basamakları ters sırayla yazdın; virgülden hemen sonra onda birler (0) gelir."], ["2,058", "bilgi", "Yüzde birler ile binde birler basamaklarını karıştırdın; 8 yüzde birlerde, 5 binde birlerde olmalı."], ["2,85", "dikkat", "Onda birler basamağındaki 0'ı yazmadın; 0 yazılmazsa 8 onda birler basamağına kayar."]],
      "Virgülden sonra sırasıyla onda birler, yüzde birler, binde birler gelir.",
      ["🔎 Soruyu anlayalım: Basamak ipuçlarından sayıyı oluşturacağız.", "💡 Hatırlayalım: Virgülden sonra sıra: onda birler → yüzde birler → binde birler.", "✏️ Tam kısım: birler basamağı 2 → 2,…", "✏️ Ondalık kısım: onda birler 0, yüzde birler 8, binde birler 5 → ,085.", "✅ Sonuç: Sayı 2,085.", "🔁 Kontrol edelim: 2,085 = 2 + 0,08 + 0,005. Basamaktaki 0 da yazılmalı; yoksa diğer rakamların yeri değişir."],
      { kural: "Boş basamağa 0 yazılır; 0 yazmazsan diğer rakamlar yanlış basamağa kayar.", dogruNeden: "2 birler, 0 onda birler, 8 yüzde birler, 5 binde birler → 2,085." }),
  );

  SORU_EKLE("bas.cozumle",
    z => { const [a, b, c, d] = [R(1, 9), R(1, 9), R(1, 9), R(1, 9)]; if (a === b) return null; const dog = `${a}${b},${c}0${d}`;
      return S({ kaz: "bas.cozumle", duzey: "uygulama", zorluk: 2, soru: `Çözümlenmiş hâli <b>${a} × 10 + ${b} × 1 + ${c} × 0,1 + ${d} × 0,001</b> olan sayı aşağıdakilerden hangisidir?`, dogru: dog,
        yanlis: [[`${a}${b},${c}${d}`, "dikkat", "Yüzde birler basamağı çözümlemede yok; o basamağa 0 yazmalısın."], [`${a}${b},0${c}${d}`, "islem", `${c} × 0,1 onda birler basamağındadır; virgülden hemen sonra gelir.`], [`${b}${a},${c}0${d}`, "dikkat", `${a} × 10 onlar basamağıdır; ${a} başa yazılmalı.`]],
        ipucu: "Her çarpım bir basamağı gösterir; eksik basamağa 0 yaz.",
        cozum: ["🔎 Soruyu anlayalım: Çözümlenmiş ifadeden sayıyı yazacağız.", "💡 Hatırlayalım: 10 → onlar, 1 → birler, 0,1 → onda birler, 0,01 → yüzde birler, 0,001 → binde birler.", `✏️ Onlar ${a}, birler ${b} → ${a}${b},…`, `✏️ Onda birler ${c}; yüzde birler verilmemiş → 0; binde birler ${d}.`, `✏️ Ondalık kısım: ,${c}0${d}.`, `✅ Sonuç: ${dog}.`, `🔁 Kontrol edelim: ${a * 10} + ${b} + ${od(c / 10)} + ${od(d / 1000)} = ${dog} ✓.`],
        kural: "Çözümlemede olmayan basamak için 0 yazılır.", dogruNeden: `${a} onlar, ${b} birler, ${c} onda birler, 0 yüzde birler, ${d} binde birler → ${dog}.` }); },
    () => ONC({ kaz: "bas.cozumle", duzey: "aciklama", zorluk: 2, giris: "<b>405,06</b> sayısı ile ilgili aşağıdaki ifadeler veriliyor:",
      ifadeler: [["Sayının çözümlenmiş hâli 4 × 100 + 5 × 1 + 6 × 0,01'dir.", true, "4 yüzler, 0 onlar, 5 birler, 0 onda birler, 6 yüzde birler; sıfırlar çözümlemede yazılmaz."], ["4 rakamı yüzler basamağındadır.", true, "Virgülün solunda sağdan sola birler (5), onlar (0), yüzler (4)."], ["Sayının onda birler basamağında 6 vardır.", false, "Onda birler basamağında 0 vardır; 6 yüzde birler basamağındadır."]],
      hatirla: "Çözümleme: her rakam × basamak değeri. 0 olan basamaklar toplamı değiştirmediği için yazılmayabilir.",
      ipucu: "Virgülden sonraki 1. basamak onda birler, 2. basamak yüzde birlerdir.", kural: "Çözümlemede 0 olan basamaklar yazılmaz ama yerleri korunur." }),
  );

  SORU_EKLE("yuv.kural",
    z => { const t = R(10, 13), o = R(2, 7); const g = () => R(0, 9); const ad = karistir(["Ali", "Berk", "Can", "Deniz"]);
      const v = [`${t},${o - 1}${R(5, 9)}${g()}`, `${t},${o}${R(5, 9)}${g()}`, `${t},${o - 1}${R(0, 4)}${g()}`, `${t},${o - 2}${R(5, 9)}${g()}`]; const hedef = `${t},${o}`;
      const yuv = s => od(Math.round(Number(s.replace(",", ".")) * 10) / 10); const sira = karistir([0, 1, 2, 3]);
      return S({ kaz: "yuv.kural", duzey: "transfer", zorluk: 3, soru: `Bir yüzme yarışında dört sporcunun dereceleri tabloda verilmiştir. Skor tabelasında dereceler <b>onda birler basamağına yuvarlanarak</b> gösterilmektedir.<br>Tabelada derecesi <b>${hedef} saniye</b> olarak görünen sporcu kimdir?`,
        gorsel: G.tablo(["Sporcu", "Derece (saniye)"], sira.map(i => [ad[i], v[i]])), dogru: ad[0],
        yanlis: [[ad[1], "kavrama", `${v[1]} sayısında sağdaki rakam 5 ya da büyük; yukarı yuvarlanır: ${yuv(v[1])}. Kesip atmak yuvarlama değildir.`], [ad[2], "islem", `${v[2]} sayısında yüzde birler rakamı 5'ten küçük; aynı kalır: ${yuv(v[2])}.`], [ad[3], "islem", `${v[3]} yukarı yuvarlanınca ${yuv(v[3])} olur, ${hedef} değil.`]],
        ipucu: "Onda birlere yuvarlarken yüzde birler basamağındaki rakama bak.",
        cozum: [`🔎 Soruyu anlayalım: Hangi derece onda birlere yuvarlanınca ${hedef} oluyor?`, "💡 Hatırlayalım: Onda birlere yuvarlarken sağdaki (yüzde birler) rakama bakarız: 5 ya da büyükse onda birler 1 artar, küçükse aynı kalır.", `✏️ ${ad[0]}: ${v[0]} → yüzde birler ≥ 5 → ${yuv(v[0])}.`, `✏️ ${ad[1]}: ${v[1]} → ${yuv(v[1])}; ${ad[2]}: ${v[2]} → ${yuv(v[2])}.`, `✏️ ${ad[3]}: ${v[3]} → ${yuv(v[3])}.`, `✅ Sonuç: Tabelada ${hedef} olarak görünen sporcu ${ad[0]}.`, `🔁 Kontrol edelim: ${ad[1]} adlı sporcunun derecesi ${hedef} ile başlıyor ama yuvarlanınca ${yuv(v[1])} olur. Rakamları kesip atmak yuvarlama değildir!`],
        kural: "Yuvarlarken yalnızca bir sağdaki rakama bak: 5 ve üstü → artır; 5'ten küçük → aynı bırak.", dogruNeden: `${v[0]} onda birlere yuvarlanınca ${hedef} olur.` }); },
    () => ONC({ kaz: "yuv.kural", duzey: "uygulama", zorluk: 2, giris: "<b>15,648</b> sayısı ile ilgili aşağıdaki ifadeler veriliyor:",
      ifadeler: [["Onda birler basamağına yuvarlanırsa 15,6 olur.", true, "Sağdaki rakam 4 < 5; onda birler (6) aynı kalır."], ["En yakın tam sayıya yuvarlanırsa 16 olur.", true, "Onda birler rakamı 6 ≥ 5; birler 1 artar: 16."], ["Yüzde birler basamağına yuvarlanırsa 15,64 olur.", false, "Sağdaki rakam 8 ≥ 5; yüzde birler 1 artar: 15,65."]],
      hatirla: "Yuvarlanacak basamağın bir sağındaki rakam 5 ya da daha büyükse basamak 1 artar, 5'ten küçükse aynı kalır; sağdaki basamaklar atılır.",
      ipucu: "Her yuvarlamada yalnızca bir sağdaki rakama bak.", kural: "Yuvarlamada yalnızca bir sağdaki rakam önemlidir." }),
  );

  SORU_EKLE("yuv.tahmin",
    z => { const urun = karistir([["Peynir", 0], ["Ekmek", 0], ["Süt", 0], ["Zeytin", 0], ["Yumurta", 0]]).slice(0, 3).map(u => [u[0], R(3, 60) * 100 + sec([15, 25, 40, 45, 60, 75, 85, 90, 95])]);
      const tl = k => (k / 100).toFixed(2).replace(".", ","); const tah = urun.reduce((a, u) => a + Math.round(u[1] / 100), 0), gercek = urun.reduce((a, u) => a + u[1], 0), kes = urun.reduce((a, u) => a + Math.floor(u[1] / 100), 0);
      if (tah === kes) return null;
      return S({ kaz: "yuv.tahmin", duzey: "transfer", zorluk: 2, soru: "Ayşe marketten tablodaki ürünleri alacaktır. Kasaya gitmeden önce her fiyatı <b>en yakın tam sayıya yuvarlayarak</b> toplam tutarı tahmin ediyor.<br>Ayşe'nin tahmini kaç TL'dir?",
        gorsel: G.tablo(["Ürün", "Fiyat (TL)"], urun.map(u => [u[0], tl(u[1])])), dogru: tah + " TL",
        yanlis: [[tl(gercek) + " TL", "dikkat", "Bu, gerçek toplamdır; soru yuvarlanmış fiyatlarla yapılan tahmini istiyor."], [kes + " TL", "kavrama", "Virgülden sonrasını silip attın; yuvarlamada 5 ve üstü yukarı yuvarlanır."], [(tah + 2) + " TL", "islem", "Bir fiyatı yanlış yuvarladın; her fiyatın onda birler rakamına yeniden bak."]],
        ipucu: "Her fiyatın virgülden sonraki ilk rakamına bak: 5 ve üstü → yukarı.",
        cozum: ["🔎 Soruyu anlayalım: Fiyatları en yakın tam sayıya yuvarlayıp toplamı tahmin edeceğiz.", "💡 Hatırlayalım: En yakın tam sayıya yuvarlarken onda birler rakamına bakılır: 5 ya da büyükse birler 1 artar.", ...urun.map(u => `✏️ ${u[0]}: ${tl(u[1])} → ${Math.round(u[1] / 100)}`).slice(0, 2), `✏️ ${urun[2][0]}: ${tl(urun[2][1])} → ${Math.round(urun[2][1] / 100)}. Toplam: ${urun.map(u => Math.round(u[1] / 100)).join(" + ")} = ${tah}.`, `✅ Sonuç: Ayşe'nin tahmini ${tah} TL.`, `🔁 Kontrol edelim: Gerçek toplam ${tl(gercek)} TL; tahminimiz buna çok yakın, demek ki mantıklı.`],
        kural: "Tahminde önce yuvarla, sonra işlem yap.", dogruNeden: `Yuvarlanmış fiyatların toplamı ${tah} TL'dir.` }); },
    Q("yuv.tahmin", "transfer", 2, "Metresi 19,90 TL olan kumaştan 4,85 m alınacaktır. Her iki sayı <b>en yakın tam sayıya yuvarlanarak</b> ödenecek tutar tahmin edilirse sonuç yaklaşık kaç TL olur?", "100",
      [["80", "kavrama", "4,85'i 4'e yuvarladın; onda birler rakamı 8 ≥ 5 olduğu için 5'e yuvarlanır."], ["95", "kavrama", "19,90'ı 19'a yuvarladın; onda birler rakamı 9 ≥ 5 olduğu için 20'ye yuvarlanır."], ["1000", "islem", "5 × 20 = 100'dür; çarpmada bir basamak kaydırdın."]],
      "19,90 ≈ 20 ve 4,85 ≈ 5.",
      ["🔎 Soruyu anlayalım: Fiyatı ve uzunluğu yuvarlayıp tutarı tahmin edeceğiz.", "💡 Hatırlayalım: En yakın tam sayıya yuvarlarken onda birler rakamına bakılır.", "✏️ 19,90 → onda birler 9 ≥ 5 → 20 TL.", "✏️ 4,85 → onda birler 8 ≥ 5 → 5 m.", "✏️ Tahmin: 20 × 5 = 100 TL.", "✅ Sonuç: Yaklaşık 100 TL ödenir.", "🔁 Kontrol edelim: Tahmin, gerçek tutara yakın olmalı. 20 TL'lik kumaştan 5 m almak 100 TL eder; 1000 TL çok fazla, 80 TL ise az görünüyor."],
      { kural: "Tahmin işlemlerinde önce sayıları yuvarla, sonra işlemi zihinden yap.", dogruNeden: "19,90 ≈ 20 ve 4,85 ≈ 5; 20 × 5 = 100." }),
  );

  SORU_EKLE("kb.iliski",
    z => { const q = sec([3, 4, 5, 6, 8]); const p = R(1, q - 1); if (ebob(p, q) !== 1) return null;
      return S({ kaz: "kb.iliski", duzey: "baglanti", zorluk: 2, soru: `Şekildeki şeritte boyalı kısım bir kesri göstermektedir.<br>Aşağıdaki bölme işlemlerinden hangisinin sonucu bu kesre <b>eşittir</b>?`,
        gorsel: G.kesirSeridi(p, q), dogru: `${p} ÷ ${q}`,
        yanlis: [[`${q} ÷ ${p}`, "kavrama", `Bölünen ile böleni yer değiştirdin. ${p}/${q} kesrinde pay (${p}) bölünen, payda (${q}) bölendir.`], [`${q - p} ÷ ${q}`, "dikkat", "Boyanmamış parçaları saydın; kesir boyalı parçaları gösteriyor."], [`${p} ÷ ${q - p}`, "kavrama", "Paydaya boyanmamış parça sayısını yazdın; payda bütündeki toplam parça sayısıdır."]],
        ipucu: "Önce kesri yaz: boyalı parça / toplam parça.",
        cozum: ["🔎 Soruyu anlayalım: Şeridin gösterdiği kesri bulup ona eşit bölme işlemini seçeceğiz.", "💡 Hatırlayalım: a/b kesri a ÷ b bölmesini gösterir; pay bölünen, payda bölendir.", `✏️ Şerit ${q} eş parçaya ayrılmış, ${p} parça boyalı → ${p}/${q}.`, `✏️ ${p}/${q} = ${p} ÷ ${q}.`, `✏️ Örneğin ${p} pizza ${q} kişiye eşit paylaştırılırsa her kişiye ${p}/${q} pizza düşer.`, `✅ Sonuç: ${p} ÷ ${q}.`, `🔁 Kontrol edelim: ${q} ÷ ${p} işleminin sonucu 1'den büyüktür; oysa şeridin boyalı kısmı 1 bütünden küçüktür.`],
        kural: "Kesir çizgisi bölme işaretidir: a/b = a ÷ b.", dogruNeden: `Şerit ${p}/${q}'${ek(q, "i").slice(1)} gösterir ve ${p}/${q} = ${p} ÷ ${q}.` }); },
    () => ONC({ kaz: "kb.iliski", duzey: "aciklama", zorluk: 2, giris: "<b>3/4</b> kesri ile ilgili aşağıdaki ifadeler veriliyor:",
      ifadeler: [["3 ÷ 4 bölme işleminin sonucunu gösterir.", true, "Kesirde pay bölünen, payda bölendir: 3/4 = 3 ÷ 4."], ["4 pizzanın 3 kişiye eşit paylaştırılmasında bir kişiye düşen payı gösterir.", false, "4 pizza 3 kişiye paylaştırılırsa kişi başına 4 ÷ 3 = 4/3 pizza düşer."], ["3 pizzanın 4 kişiye eşit paylaştırılmasında bir kişiye düşen payı gösterir.", true, "3 ÷ 4 = 3/4 pizza."]],
      hatirla: "a/b kesri a ÷ b bölmesidir. a bütün b kişiye paylaştırılırsa her kişiye a/b düşer.",
      ipucu: "Paylaştırılan miktar paya, kişi sayısı paydaya yazılır.", kural: "Paylaştırılan ÷ kişi sayısı = pay/payda." }),
  );

  SORU_EKLE("kb.ondalik",
    z => { const havuz = karistir([[1, 2], [3, 4], [1, 4], [2, 5], [3, 5], [4, 5], [7, 10], [9, 20], [13, 20], [17, 25], [11, 20], [3, 10]]); const sec4 = []; for (const f of havuz) { if (!sec4.some(g => g[0] * f[1] === f[0] * g[1])) sec4.push(f); if (sec4.length === 4) break; }
      const ad = ["Ada", "Bora", "Cem", "Duru"]; const deger = sec4.map(f => f[0] / f[1]); const i = deger.indexOf(Math.max(...deger)); const yaz = sec4.map((f, j) => j % 2 ? od(f[0] / f[1]) + " L" : `${f[0]}/${f[1]} L`);
      return S({ kaz: "kb.ondalik", duzey: "transfer", zorluk: 3, soru: "Dört arkadaşın bir günde içtikleri ayran miktarları tabloda verilmiştir.<br>Buna göre <b>en çok</b> ayranı kim içmiştir?",
        gorsel: G.tablo(["Ad", "İçilen ayran"], ad.map((a, j) => [a, yaz[j]])), dogru: ad[i],
        yanlis: ad.filter((_, j) => j !== i).map(a => { const j = ad.indexOf(a); return [a, "islem", `${a} ${yaz[j]} içmiştir; ondalık gösterimi ${od(deger[j])} L. Bu, ${od(deger[i])} L'den azdır.`]; }),
        ipucu: "Hepsini ondalık gösterime çevir, sonra karşılaştır.",
        cozum: ["🔎 Soruyu anlayalım: Kesir ve ondalık gösterimle verilen miktarları karşılaştırıp en büyüğünü bulacağız.", "💡 Hatırlayalım: Kesri ondalığa çevirmek için paydayı 10 ya da 100 yapacak sayıyla genişletiriz (ya da payı paydaya böleriz).", ...[0, 2].map(j => `✏️ ${ad[j]}: ${sec4[j][0]}/${sec4[j][1]} = ${100 * sec4[j][0] / sec4[j][1]}/100 = ${od(deger[j])} L.`), `✏️ Karşılaştıralım: ${ad.map((a, j) => a + " " + od(deger[j])).join(", ")}.`, `✅ Sonuç: En çok ayranı ${ad[i]} içmiştir (${od(deger[i])} L).`, "🔁 Kontrol edelim: Ondalık sayıları karşılaştırırken basamak basamak bak: önce onda birler, eşitse yüzde birler."],
        kural: "Farklı gösterimleri karşılaştırmadan önce hepsini aynı gösterime (ondalık) çevir.", dogruNeden: `${ad[i]} ${yaz[i]} = ${od(deger[i])} L içmiştir; bu en büyük değerdir.` }); },
    Q("kb.ondalik", "uygulama", 2, "Aşağıdakilerden hangisi <b>0,35</b>'e eşit <b>değildir</b>?", "3/5",
      [["7/20", "islem", "7/20 = 35/100 = 0,35; bu eşittir. Soru eşit olmayanı soruyor."], ["35/100", "dikkat", "35/100, “otuz beş yüzde bir” yani 0,35'tir; eşittir."], ["70/200", "islem", "70/200 sadeleşince 35/100 = 0,35 olur; eşittir."]],
      "Her kesrin paydasını 100 yap.",
      ["🔎 Soruyu anlayalım: Dört kesirden 0,35'e eşit olmayanı bulacağız.", "💡 Hatırlayalım: 0,35 = 35/100. Kesrin paydasını 100 yapınca karşılaştırması kolaylaşır.", "✏️ 7/20 = (7 × 5)/(20 × 5) = 35/100 ✓. 70/200 = 35/100 ✓ (2'ye böldük).", "✏️ 3/5 = (3 × 20)/(5 × 20) = 60/100 = 0,6 ✗.", "✅ Sonuç: 3/5, 0,35'e eşit değildir.", "🔁 Kontrol edelim: 0,35'teki rakamları (3 ve 5) kesir olarak yazmak (3/5) çok yapılan bir hatadır. 3/5 = 0,6'dır."],
      { kural: "0,35 = 35/100; ondalık gösterimdeki rakamları pay ve payda yapma.", dogruNeden: "3/5 = 60/100 = 0,6 ≠ 0,35." }),
  );

  SORU_EKLE("kb.paylasim",
    z => { const b = sec([3, 4, 6, 8]); let a; do { a = R(7, 30); } while (a % b === 0); const t = Math.floor(a / b);
      return S({ kaz: "kb.paylasim", duzey: "uygulama", zorluk: 2, soru: `${a} kg fındık ${b} arkadaşa eşit olarak paylaştırılıyor. Bir kişiye düşen fındık <b>${a}/${b} kg</b>'dır.<br>Bu miktar hangi iki ardışık doğal sayı arasındadır?`,
        dogru: `${t} ile ${t + 1}`, yanlis: [[`${t + 1} ile ${t + 2}`, "islem", `${b} × ${t + 1} = ${b * (t + 1)}, ${a}${ek(a, "den")} büyük; kişi başına ${t + 1} kg düşemez.`], [t > 0 ? `${t - 1} ile ${t}` : `${t + 2} ile ${t + 3}`, "islem", `${b} × ${t} = ${b * t}, ${a}${ek(a, "den")} küçük; her kişiye ${t} kg'dan fazla düşer.`], Math.abs(a % b - t) > 1 ? [`${a % b} ile ${a % b + 1}`, "kavrama", `${a % b} bölmedeki kalandır, tam kısım değildir.`] : [`${t + 2} ile ${t + 3}`, "islem", `${b} × ${t + 2} = ${b * (t + 2)}; bu ${a}${ek(a, "den")} çok büyük. Bölümü yeniden hesapla.`]],
        ipucu: `${a} ÷ ${b} işleminin bölümünü ve kalanını bul.`,
        cozum: [`🔎 Soruyu anlayalım: ${a}/${b} kg'ın hangi iki doğal sayı arasında olduğunu bulacağız.`, "💡 Hatırlayalım: Kesir bir bölmedir: a/b = a ÷ b. Bölüm tam kısmı, kalan ise artan parçaları verir.", `✏️ ${a} ÷ ${b} = ${t} kalan ${a % b}.`, `✏️ Yani ${a}/${b} = ${t} tam ${a % b}/${b}: her kişiye ${t} kg ve biraz daha düşer.`, `✏️ ${t} < ${a}/${b} < ${t + 1}.`, `✅ Sonuç: ${t} ile ${t + 1} arasındadır.`, `🔁 Kontrol edelim: ${b} × ${t} = ${b * t} < ${a} < ${b * (t + 1)} = ${b} × ${t + 1} ✓.`],
        kural: "Bileşik kesrin tam kısmı, payın paydaya bölümüdür.", dogruNeden: `${a} ÷ ${b} = ${t} kalan ${a % b}; ${a}/${b} kg, ${t} ile ${t + 1} arasındadır.` }); },
    Q("kb.paylasim", "transfer", 3, "Birinci masada 3 pizza 4 kişiye, ikinci masada 2 pizza 3 kişiye eşit olarak paylaştırılıyor.<br>Buna göre aşağıdakilerden hangisi <b>doğrudur</b>?", "Birinci masadakiler daha çok pizza alır, çünkü 3/4 > 2/3.",
      [["İki masadakiler eşit pizza alır, çünkü iki masada da kişi sayısı pizza sayısından 1 fazladır.", "strateji", "Farkların eşit olması payların eşit olduğunu göstermez; 3/4 ile 2/3'ü karşılaştırmalısın."], ["İkinci masadakiler daha çok pizza alır, çünkü masada daha az kişi vardır.", "kavrama", "Kişi az ama pizza da az; yalnızca kişi sayısına bakmak yetmez."], ["İkinci masadakiler daha çok pizza alır, çünkü 2/3 > 3/4.", "islem", "2/3 = 8/12, 3/4 = 9/12; 3/4 daha büyüktür."]],
      "Her masada kişi başına düşen payı kesir olarak yaz ve karşılaştır.",
      ["🔎 Soruyu anlayalım: İki masada kişi başına düşen pizzayı karşılaştıracağız.", "💡 Hatırlayalım: a bütün b kişiye paylaştırılırsa kişi başına a/b düşer.", "✏️ Birinci masa: 3 ÷ 4 = 3/4 pizza. İkinci masa: 2 ÷ 3 = 2/3 pizza.", "✏️ Paydaları eşitleyelim: 3/4 = 9/12, 2/3 = 8/12.", "✏️ 9/12 > 8/12 → 3/4 > 2/3.", "✅ Sonuç: Birinci masadakiler daha çok pizza alır.", "🔁 Kontrol edelim: Ondalıkla bak: 3/4 = 0,75; 2/3 yaklaşık 0,67. 0,75 daha büyük ✓."],
      { kural: "Paylaştırma karşılaştırmasında kişi başına düşen kesirleri karşılaştır.", dogruNeden: "Birinci masada kişi başına 3/4, ikincide 2/3 düşer ve 3/4 > 2/3'tür." }),
  );
})();
