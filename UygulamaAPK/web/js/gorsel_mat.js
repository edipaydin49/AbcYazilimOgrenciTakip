/* Matematik — görselli (resimli) ek sorular. Her sorunun çözümü için görseldeki bilgi
 * (şekil, sayı doğrusu, grafik, tablo, takvim, abaküs, cetvel …) okunmalıdır. Çözümler adım adım anlatılır.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, G, bolenler, asalMi, ebob, ekok, kesir, asalCarpan } = OGR;
  const Y = G.yazi;
  const kutu = (x, y, w, h, s = "g-bos", rx = 6) => `<rect class="${s} g-cizgi" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" stroke-width="2"/>`;
  const cizgi = (x1, y1, x2, y2, s = "g-cizgi", k = 2) => `<line class="${s}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${k}"/>`;
  const RENK = { kırmızı: "#d64545", mavi: "#2f6fdb", yeşil: "#2e9b57", sarı: "#f2b632", mor: "#8a5cd6", turuncu: "#ee8a2a" };
  const BAS = { kırmızı: "K", mavi: "M", yeşil: "Y", sarı: "S", mor: "Mo", turuncu: "T" };
  const sayiYaz = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const TL = k => od(k / 100) + " TL"; // kuruş → "12,5 TL"

  /* Zıplama yaylı sayı doğrusu. yaylar: [{adim, sayi, alt, sinif}] ; etiketler: gösterilecek sayılar */
  function zipla(max, { yaylar = [], etiketler = null, isaret = [] } = {}) {
    const W = 620, H = 150, sol = 25, sag = 25, y = 82, xk = v => sol + (W - sol - sag) * v / max;
    let ic = cizgi(sol - 10, y, W - sag + 10, y);
    for (let v = 0; v <= max; v++) ic += cizgi(xk(v), y - 6, xk(v), y + 6, "g-cizgi", 1.5);
    (etiketler || [...Array(max + 1).keys()]).forEach(v => { ic += Y(xk(v), y + 26, v, { k: 1 }); });
    yaylar.forEach(({ adim, sayi, alt, sinif }) => {
      for (let i = 0; i < sayi; i++) {
        const a = xk(i * adim), b = xk((i + 1) * adim), h = Math.min(48, (b - a) * 0.55) * (alt ? -1 : 1);
        ic += `<path class="${sinif || "g-ok-a"}" fill="none" stroke-width="2.5" d="M${a.toFixed(1)} ${y} Q${((a + b) / 2).toFixed(1)} ${(y - 2 * h).toFixed(1)} ${b.toFixed(1)} ${y}"/>`;
      }
    });
    isaret.forEach(([v, ad]) => { ic += `<circle class="g-d" cx="${xk(v)}" cy="${y}" r="6"/>` + (ad ? Y(xk(v), y - 14, ad, { b: 1 }) : ""); });
    return G.svg(W, H, ic, "zıplamaların gösterildiği sayı doğrusu");
  }

  /* Birim karelerden dikdörtgen (b: kare boyu) */
  const kareler = (x0, y0, sat, sut, b, s = "g-yumusak") => { let ic = ""; for (let i = 0; i < sat; i++) for (let j = 0; j < sut; j++) ic += `<rect class="${s} g-cizgi" x="${x0 + j * b}" y="${y0 + i * b}" width="${b}" height="${b}" stroke-width="1"/>`; return ic; };

  /* Bölünebilme kuralı açıklaması */
  const rakamTop = n => String(n).split("").reduce((a, c) => a + +c, 0);
  function kuralAcik(n, d) {
    const s = String(n), b = n % d === 0, son = s.slice(-1), son2 = s.slice(-2), t = rakamTop(n);
    const e = b ? "bölünür ✓" : "bölünmez ✗";
    if (d === 2) return `${d}${ek(d, "e")} bölünme: birler basamağı ${son}, ${+son % 2 ? "tek" : "çift"} → ${e}`;
    if (d === 5) return `${d}${ek(d, "e")} bölünme: birler basamağı ${son}${+son % 5 ? ", 0 ya da 5 değil" : ""} → ${e}`;
    if (d === 10) return `${d}${ek(d, "e")} bölünme: birler basamağı ${son}${son !== "0" ? ", 0 değil" : ""} → ${e}`;
    if (d === 3 || d === 9) return `${d}${ek(d, "e")} bölünme: rakamlar toplamı ${s.split("").join(" + ")} = ${t}${t % d ? ", " + d + ek(d, "in") + " katı değil" : ", " + d + ek(d, "in") + " katı"} → ${e}`;
    if (d === 4) return `${d}${ek(d, "e")} bölünme: son iki basamak ${son2}${+son2 % 4 ? ", 4'ün katı değil" : ", 4'ün katı"} → ${e}`;
    if (d === 6) return `${d}${ek(d, "e")} bölünme: hem 2'ye hem 3'e bölünmeli (birler ${son}, rakamlar toplamı ${t}) → ${e}`;
    return `${n} ÷ ${d} → ${e}`;
  }

  /* ======================= TEMA 1: ÇARPANLAR, KATLAR, BÖLÜNEBİLME, ASAL ======================= */
  SORU_EKLE("carpan.bul",
    z => {
      const [a, b] = sec([[3, 4], [3, 6], [4, 5], [4, 6], [3, 8], [4, 7], [5, 6], [3, 10], [4, 9]]), n = a * b;
      const bl = bolenler(n).filter(d => d > 1 && d < n);
      let x; do { x = R(2, Math.min(12, n - 1)); } while (n % x === 0);
      const ad = karistir(bl.filter(d => d !== a && d !== b)).concat([a, b]).slice(0, 3);
      let ic = ""; for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) ic += `<circle class="g-b g-cizgi" cx="${40 + j * 32}" cy="${36 + i * 32}" r="12" stroke-width="1.5"/><circle class="g-cizgi" cx="${36 + j * 32}" cy="${32 + i * 32}" r="1.6"/><circle class="g-cizgi" cx="${44 + j * 32}" cy="${39 + i * 32}" r="1.6"/>`;
      const gorsel = G.svg(60 + b * 32, 50 + a * 32, kutu(14, 10, b * 32 + 20, a * 32 + 20, "g-yumusak", 10) + ic, "tepsideki kurabiyeler");
      return S({ kaz: "carpan.bul", duzey: "transfer", zorluk: 2, gorsel,
        soru: "Tepsideki kurabiyeler şekildeki gibi dizilmiştir. Pastacı aynı kurabiyelerin <b>hepsini</b>, her sırada eşit sayıda kurabiye olacak biçimde başka bir tepsiye dizecektir.<br>Bir sırada kaç kurabiye olursa bu dizilişi <b>yapamaz</b>?",
        dogru: x + " kurabiye", dogruNeden: `Toplam ${n} kurabiye var; ${n} ÷ ${x} işleminde kalan ${n % x} olduğu için ${x}, ${n}${ek(n, "in")} çarpanı değildir.`,
        yanlis: ad.map(d => [d + " kurabiye", "kavrama", `${d} olabilir: ${n} ÷ ${d} = ${n / d}, yani ${n / d} sıra × ${d} kurabiye = ${n}. Soru yapılamayanı soruyor.`]),
        ipucu: "Önce kurabiyeleri say (sıra × bir sıradaki). Bir sıradaki sayı, toplamın çarpanı olmalı.",
        cozum: ["🔎 Soruyu anlayalım: Şekildeki kurabiyelerin hepsi eşit sıralara yeniden dizilecek. Hangi sıra uzunluğunun olamayacağını bulacağız.",
          "💡 Hatırlayalım: Eşit sıralara dizebilmek için “bir sıradaki kurabiye sayısı” toplamı kalansız bölmelidir; yani toplamın bir çarpanı olmalıdır.",
          `✏️ Şekilden sayalım: ${a} sıra var, her sırada ${b} kurabiye var. Toplam ${a} × ${b} = ${n} kurabiye.`,
          `✏️ ${n}${ek(n, "in")} çarpanları: ${bolenler(n).join(", ")}.`,
          `✏️ Seçenekleri kontrol edelim: ${ad.map(d => d + " ✓").join(", ")}; ${x} ise listede yok (${n} ÷ ${x} → kalan ${n % x}).`,
          `✅ Sonuç: Bir sırada ${x} kurabiye olacak biçimde dizilemez.`,
          `🔁 Kontrol edelim: ${x} kurabiyelik sıralar yapsak ${Math.floor(n / x)} sıra dolar ve ${n % x} kurabiye artar; eşit diziliş bozulur.`],
        kural: "Eşit sıralara dizmede bir sıradaki sayı, toplam sayının çarpanı olmalıdır." });
    },
  );

  SORU_EKLE("carpan.say",
    z => {
      const n = sec([8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 25]);
      const ciftler = bolenler(n).filter(d => d * d <= n).map(d => [d, n / d]), cs = bolenler(n).length, b = 9;
      let ic = "", x = 20, y = 20, satirH = 0; const W = 600;
      ciftler.forEach(([p, q]) => {
        const w = q * b, h = p * b;
        if (x + w > W - 20) { x = 20; y += satirH + 34; satirH = 0; }
        ic += kareler(x, y, p, q, b) + Y(x + w / 2, y + h + 18, `${p} × ${q}`, { k: 1 });
        x += w + 30; satirH = Math.max(satirH, h);
      });
      const kareVar = ciftler.some(([p, q]) => p === q);
      return S({ kaz: "carpan.say", duzey: "aciklama", zorluk: 2, gorsel: G.svg(W, y + satirH + 30, ic, `${n} birim kareyle yapılabilen bütün dikdörtgenler`),
        soru: `Elif, ${n} özdeş birim kareyi boşluksuz yan yana koyarak oluşturabileceği <b>bütün farklı</b> dikdörtgenleri şekildeki gibi çizmiştir (döndürülünce aynı olanları bir kez çizmiştir).<br>Buna göre ${n} sayısının <b>kaç çarpanı</b> vardır?`,
        dogru: cs, dogruNeden: `Her dikdörtgenin iki kenarı birer çarpandır: ${bolenler(n).join(", ")} → ${cs} çarpan.`,
        yanlis: [[ciftler.length, "strateji", `${ciftler.length} dikdörtgen sayısıdır; her dikdörtgen bir çarpan çifti, yani (çoğunlukla) iki çarpan verir.`], [kareVar ? 2 * ciftler.length : cs + 1, kareVar ? "dikkat" : "islem", kareVar ? "Kare biçimindeki dikdörtgenin iki kenarı aynı sayıdır; o sayıyı bir kez saymalısın." : "Bir çarpanı iki kez saymış olabilirsin; kenarlardaki sayıları tek tek listele."], [cs - 2, "dikkat", `1 ve ${n} de çarpandır; 1 × ${n} dikdörtgenini unutma.`], [cs + 2, "islem", "Kenarlardaki sayıları tek tek yaz; fazla saydın."]],
        ipucu: "Her dikdörtgenin kısa ve uzun kenarı bir çarpan çiftidir. Kenar sayılarını listele.",
        cozum: [`🔎 Soruyu anlayalım: ${n} birim kareyle yapılabilecek bütün dikdörtgenler çizilmiş. Bunlardan ${n}${ek(n, "in")} çarpan sayısını bulacağız.`,
          "💡 Hatırlayalım: Bir dikdörtgenin kenar uzunlukları çarpılınca kare sayısını verir; bu yüzden kenarlar bir çarpan çiftidir.",
          `✏️ Şekildeki dikdörtgenler: ${ciftler.map(c => c[0] + " × " + c[1]).join(", ")} → ${ciftler.length} dikdörtgen.`,
          `✏️ Kenarlardaki sayıları tek tek yazalım: ${bolenler(n).join(", ")}.` + (kareVar ? " Kare olan dikdörtgenin iki kenarı aynı sayı olduğundan o sayıyı bir kez yazdık." : ""),
          `✅ Sonuç: ${n} sayısının ${cs} çarpanı vardır.`,
          `🔁 Kontrol edelim: Her çarpan ${n}${ek(n, "i")} kalansız böler: ${bolenler(n).map(d => n + " ÷ " + d + " = " + n / d).slice(0, 3).join(", ")} … ✓`],
        kural: "Dikdörtgen sayısı ≠ çarpan sayısı: her dikdörtgen iki çarpan verir; kare olan yalnızca bir çarpan verir." });
    },
  );

  SORU_EKLE("carpan.model",
    z => {
      const n = sec([12, 18, 20, 24, 30, 36]);
      const cift = bolenler(n).filter(d => d > 1 && d * d <= n).map(d => [d, n / d]).filter(([p, q]) => q <= 12);
      const secilen = karistir(cift).slice(0, 3);
      while (secilen.length < 3) secilen.push(secilen[0]);
      let hp, hq; do { hp = R(2, 5); hq = R(hp, 10); } while (hp * hq === n || Math.abs(hp * hq - n) > 6);
      const modeller = karistir(secilen.map(c => ({ p: c[0], q: c[1], dogru: true })).concat([{ p: hp, q: hq, dogru: false }]));
      const harf = ["A", "B", "C", "D"], b = 13;
      let ic = "";
      modeller.forEach((m, i) => { const x0 = 20 + (i % 2) * 300, y0 = 30 + Math.floor(i / 2) * 120; ic += Y(x0, y0 - 8, harf[i], { a: "start", b: 1 }) + kareler(x0 + 20, y0, m.p, m.q, b); });
      const hi = modeller.findIndex(m => !m.dogru);
      return S({ kaz: "carpan.model", duzey: "uygulama", zorluk: 2, gorsel: G.svg(600, 270, ic, "birim karelerden oluşan dört dikdörtgen"),
        soru: `Bir öğrenci ${n} sayısının çarpan çiftlerini birim karelerden dikdörtgenler çizerek modellemek istiyor.<br>Şekildeki modellerden hangisi ${n} sayısının bir çarpan çiftini <b>göstermez</b>?`,
        dogru: harf[hi] + " modeli", dogruNeden: `${harf[hi]} modelinde ${hp} × ${hq} = ${hp * hq} birim kare var; ${n} değil.`,
        yanlis: modeller.map((m, i) => [harf[i] + " modeli", "dikkat", `${harf[i]} modelinde ${m.p} sıra ve ${m.q} sütun var: ${m.p} × ${m.q} = ${m.p * m.q}; bu bir çarpan çifti modelidir.`]).filter((_, i) => i !== hi),
        ipucu: "Her modelde sıra ve sütunları say; çarpımları " + n + " olmalı.",
        cozum: [`🔎 Soruyu anlayalım: Dört dikdörtgenden hangisinin ${n} birim kareden oluşmadığını bulacağız.`,
          `💡 Hatırlayalım: Birim karelerle yapılan dikdörtgende sıra sayısı × sütun sayısı = toplam kare. ${n}${ek(n, "in")} çarpan çifti modeli ${n} kareden oluşmalıdır.`,
          "✏️ Her modeli sayalım: " + modeller.map((m, i) => `${harf[i]}: ${m.p} × ${m.q} = ${m.p * m.q}`).join("; ") + ".",
          `✏️ Sonucu ${n} olmayan tek model ${harf[hi]} modelidir (${hp * hq} ≠ ${n}).`,
          `✅ Sonuç: ${harf[hi]} modeli ${n} sayısının çarpan çiftini göstermez.`,
          `🔁 Kontrol edelim: ${n}${ek(n, "in")} çarpan çiftleri ${bolenler(n).filter(d => d * d <= n).map(d => d + " × " + n / d).join(", ")}. ${hp} × ${hq} bu listede yok ✓`],
        kural: "Dikdörtgen modelinde kare sayısı = sıra × sütun; bu sayı verilen sayıya eşit olmalı." });
    },
  );

  SORU_EKLE("kat.bul",
    z => {
      const k = sec([3, 4, 5, 6]), max = k * 5;
      const m = R(7, 12), dogru = k * m;
      const yanlis = [dogru + 1, dogru - 1, dogru + 2, dogru - 2, dogru + k - 1].filter(v => v % k && v > 0);
      return S({ kaz: "kat.bul", duzey: "uygulama", zorluk: 1,
        gorsel: zipla(max, { yaylar: [{ adim: k, sayi: 3 }], etiketler: [...Array(max + 1).keys()].filter(v => v % (k > 4 ? 5 : 2) === 0 || v === k), isaret: [[0, "🐸"]] }),
        soru: "Bir kurbağa sayı doğrusunda 0'dan başlayarak şekildeki gibi hep <b>aynı uzunlukta</b> zıplıyor.<br>Kurbağa zıplamaya devam ederse aşağıdaki sayılardan hangisine basar?",
        dogru, dogruNeden: `Kurbağa ${k}${ek(k, "er")} zıplıyor; bastığı sayılar ${k}${ek(k, "in")} katlarıdır. ${dogru} = ${k} × ${m}.`,
        yanlis: yanlis.slice(0, 3).map(v => [v, "islem", `${v} ÷ ${k} işleminde kalan ${v % k}; ${v}, ${k}${ek(k, "in")} katı olmadığı için kurbağa bu sayıya basmaz.`]),
        ipucu: "Önce bir zıplamanın kaç birim olduğunu şekilden bul.",
        cozum: ["🔎 Soruyu anlayalım: Kurbağa 0'dan başlayıp hep eşit zıplıyor. Hangi sayıya basacağını bulacağız.",
          `✏️ Şekle bakalım: ilk zıplama 0'dan ${k}${ek(k, "e")}, ikincisi ${k}${ek(k, "den")} ${2 * k}${ek(2 * k, "e")} gidiyor. Bir zıplama ${k} birim.`,
          `💡 Hatırlayalım: 0'dan ${k}${ek(k, "er")} sayınca ulaştığımız sayılar ${k}${ek(k, "in")} katlarıdır: ${k}, ${2 * k}, ${3 * k}, ${4 * k}, …`,
          `✏️ Seçeneklerden hangisi ${k}${ek(k, "e")} kalansız bölünüyor? ${dogru} ÷ ${k} = ${m} ✓`,
          `✅ Sonuç: Kurbağa ${dogru} sayısına basar (${m}. zıplamada).`,
          `🔁 Kontrol edelim: Diğer seçenekler ${k}${ek(k, "e")} bölününce kalan veriyor; kurbağa onların üzerinden atlar.`],
        kural: "0'dan başlayan eşit atlamalar, atlama uzunluğunun katlarına basar." });
    },
  );

  SORU_EKLE("kat.aralik",
    z => {
      const k = sec([3, 4, 6, 7, 8, 9]), bas = R(3, 15) * 10 + 1;
      let ic = "";
      for (let i = 0; i < 20; i++) { const x = 20 + (i % 10) * 56, y = 20 + Math.floor(i / 10) * 50; ic += `<rect class="g-bos g-cizgi" x="${x}" y="${y}" width="56" height="50" stroke-width="1.5"/>` + Y(x + 28, y + 31, bas + i); }
      const katlar = []; for (let v = bas; v < bas + 20; v++) if (v % k === 0) katlar.push(v);
      const c = katlar.length;
      return S({ kaz: "kat.aralik", duzey: "uygulama", zorluk: 2, gorsel: G.svg(600, 140, ic, `${bas}–${bas + 19} sayı tablosu`),
        soru: `Şekildeki sayı tablosunda bulunan sayılardan kaç tanesi <b>${k}${ek(k, "in")} katıdır</b>?`,
        dogru: c, dogruNeden: `Tablodaki ${k}${ek(k, "in")} katları: ${katlar.join(", ")} → ${c} tane.`,
        yanlis: [[c + 1, "dikkat", "Fazla saydın; her sayıyı " + k + "'e bölüp kalan sıfır mı diye kontrol et."], [c - 1, "dikkat", "Bir katı atlamışsın; ilk katı bulduktan sonra " + k + " ekleyerek ilerle."], [Math.floor(20 / k) === c ? c + 2 : Math.floor(20 / k), "strateji", "Yalnızca 20 ÷ " + k + " hesabı her zaman doğru sonucu vermez; aralığın başına ve sonuna dikkat et."], [c + 2, "islem", "Fazla saydın; katlar arasında hep " + k + " fark olmalı."]],
        ipucu: `Tablodaki ilk ${k} katını bul, sonra ${k} ekleyerek ilerle.`,
        cozum: [`🔎 Soruyu anlayalım: Tabloda ${bas}'${ek(bas, "den").slice(1)} ${bas + 19}'${ek(bas + 19, "e").slice(1)} kadar sayılar var. Bunlardan ${k}${ek(k, "in")} katı olanları sayacağız.`,
          `💡 Hatırlayalım: Bir sayı, ${k}${ek(k, "e")} kalansız bölünüyorsa ${k}${ek(k, "in")} katıdır. Ardışık katlar arasında hep ${k} fark vardır.`,
          `✏️ Tablodaki ilk kat: ${katlar[0]} (${katlar[0]} = ${k} × ${katlar[0] / k}).`,
          `✏️ ${k} ekleyerek ilerleyelim: ${katlar.join(", ")}${katlar[c - 1] + k <= bas + 19 ? "" : "; bir sonraki " + (katlar[c - 1] + k) + " tablonun dışında"}.`,
          `✅ Sonuç: Tabloda ${k}${ek(k, "in")} ${c} katı vardır.`,
          `🔁 Kontrol edelim: Son kat ${katlar[c - 1]} = ${k} × ${katlar[c - 1] / k}, ilk kat ${k} × ${katlar[0] / k}; ${katlar[c - 1] / k} − ${katlar[0] / k} + 1 = ${c} ✓`],
        kural: "Aralıktaki katları sayarken ilk katı bul, sonra sayıyı ekleyerek son kata kadar ilerle." });
    },
  );

  SORU_EKLE("kat.problem",
    z => {
      const [sat, sut] = sec([[2, 3], [2, 4], [2, 5], [3, 4], [2, 6]]), k = sat * sut, m = R(4, 9), dogru = k * m;
      let ic = kutu(20, 20, sut * 44 + 20, sat * 44 + 20, "g-yumusak", 8);
      for (let i = 0; i < sat; i++) for (let j = 0; j < sut; j++) ic += `<ellipse class="g-bos g-cizgi" cx="${52 + j * 44}" cy="${52 + i * 44}" rx="15" ry="19" stroke-width="1.5"/>`;
      ic += Y(40 + sut * 22 + 10, sat * 44 + 70, "1 koli", { k: 1 });
      const yan = [dogru + 1, dogru - 1, dogru + 2, dogru - 2, dogru + 3].filter(v => v % k);
      return S({ kaz: "kat.problem", duzey: "transfer", zorluk: 2, gorsel: G.svg(sut * 44 + 60, sat * 44 + 80, ic, "yumurta kolisi"),
        soru: "Bir çiftlikte yumurtalar şekildeki gibi <b>tam dolu</b> kolilerle satılıyor ve koli bozulmuyor. Bugün birkaç koli satıldı.<br>Bugün satılan yumurta sayısı aşağıdakilerden hangisi <b>olabilir</b>?",
        dogru, dogruNeden: `Bir kolide ${k} yumurta var; ${dogru} = ${m} × ${k} olduğu için ${m} tam koli eder.`,
        yanlis: yan.slice(0, 3).map(v => [v, "kavrama", `${v} ÷ ${k} işleminde kalan ${v % k}; bu kadar yumurta için bir koliyi bozmak gerekirdi.`]),
        ipucu: "Önce bir kolide kaç yumurta olduğunu say. Satılan sayı bunun katı olmalı.",
        cozum: ["🔎 Soruyu anlayalım: Yumurtalar yalnızca tam koli hâlinde satılıyor. Satılmış olabilecek sayıyı bulacağız.",
          `✏️ Şekilden sayalım: Kolide ${sat} sıra, her sırada ${sut} yumurta var → ${sat} × ${sut} = ${k} yumurta.`,
          `💡 Hatırlayalım: Tam koliler satıldıysa toplam yumurta sayısı ${k}${ek(k, "in")} katıdır: ${k}, ${2 * k}, ${3 * k}, …`,
          `✏️ Seçenekleri ${k}${ek(k, "e")} bölelim: ${dogru} ÷ ${k} = ${m}, kalan 0 ✓; diğerlerinde kalan var.`,
          `✅ Sonuç: ${dogru} yumurta satılmış olabilir (${m} koli).`,
          `🔁 Kontrol edelim: ${m} × ${k} = ${dogru} ✓. Günlük hayatta “paket bozulmuyor” ifadesi bir kat problemi olduğunu gösterir.`],
        kural: "Paketler bozulmadan satılıyorsa toplam, paketteki sayının katıdır." });
    },
    z => {
      const a = sec([3, 4, 5]), b = sec([6, 8, 10, 12].filter(v => v !== a * 2)), son = a * R(5, 8);
      // otobüs her a dakikada bir: tablo saatleri
      const s0 = R(7, 9) * 60, ilk = [0, 1, 2, 3].map(i => s0 + i * a * 5);
      const saat = t => String(Math.floor(t / 60)).padStart(2, "0") + "." + String(t % 60).padStart(2, "0");
      const sefer = R(5, 9), hedef = s0 + sefer * a * 5;
      let ic = kutu(20, 20, 260, 190, "g-yumusak", 10) + Y(150, 46, "🚌 Kalkış saatleri", { b: 1 });
      ilk.forEach((t, i) => { ic += kutu(60, 60 + i * 34, 180, 28, "g-bos", 4) + Y(150, 80 + i * 34, saat(t)); });
      const yan = [hedef + a * 5 - 5, hedef + 5, hedef - 5, hedef + a * 5 + 5].filter(t => (t - s0) % (a * 5));
      return S({ kaz: "kat.problem", duzey: "transfer", zorluk: 3, gorsel: G.svg(300, 220, ic, "otobüs kalkış saatleri tablosu"),
        soru: "Bir otobüs durağındaki tabelada ilk dört seferin kalkış saatleri yazılıdır. Seferler gün boyu <b>aynı aralıkla</b> devam etmektedir.<br>Aşağıdaki saatlerden hangisinde bu duraktan bir otobüs kalkar?",
        dogru: saat(hedef), dogruNeden: `Seferler ${a * 5} dakikada birdir; ${saat(s0)}'dan ${saat(hedef)}'a ${sefer * a * 5} dakika var ve ${sefer * a * 5}, ${a * 5}${ek(a * 5, "in")} katıdır.`,
        yanlis: yan.slice(0, 3).map(t => [saat(t), "islem", `${saat(s0)} ile ${saat(t)} arasında ${t - s0} dakika var; ${t - s0}, ${a * 5}${ek(a * 5, "in")} katı olmadığı için bu saatte sefer yok.`]),
        ipucu: "Tabeladan iki sefer arasındaki dakikayı bul. Kalkış saatleri ilk saatten bu sayının katları kadar sonra olur.",
        cozum: ["🔎 Soruyu anlayalım: Tabelada ilk dört sefer var; seferler eşit aralıklarla sürüyor. Hangi saatte otobüs kalktığını bulacağız.",
          `✏️ Tabeladan aralığı bulalım: ${saat(ilk[0])} → ${saat(ilk[1])} arası ${a * 5} dakika. Diğerleri de ${a * 5}${ek(a * 5, "er")} dakika arayla.`,
          `💡 Hatırlayalım: Kalkış saatleri, ilk seferden ${a * 5}${ek(a * 5, "in")} katları kadar dakika sonradır.`,
          `✏️ Seçenekleri ilk sefere göre dakikaya çevirelim: ${saat(hedef)} → ${sefer * a * 5} dakika sonra; ${sefer * a * 5} ÷ ${a * 5} = ${sefer} ✓`,
          `✅ Sonuç: ${saat(hedef)}'da bir otobüs kalkar.`,
          `🔁 Kontrol edelim: Diğer saatler ilk seferden ${a * 5}${ek(a * 5, "in")} katı olmayan dakikalar kadar sonra; o saatlerde otobüs yok.`],
        kural: "Düzenli tekrar eden olaylar, ilk andan sonra aralığın katları kadar zaman sonra yeniden olur." });
    },
  );

  SORU_EKLE("bol.kural",
    z => {
      const uclu = sec([[2, 3, 5], [3, 5, 9], [5, 2, 3], [9, 2, 5], [4, 3, 5], [10, 3, 4], [6, 5, 4], [3, 4, 10]]);
      const [d1, d2, d3] = uclu, hedef = R(0, 3);
      const kutuNo = n => n % d1 === 0 ? (n % d2 === 0 ? 0 : 1) : (n % d3 === 0 ? 2 : 3);
      let N; let g = 0; do { N = R(100, 9999); g++; } while (kutuNo(N) !== hedef && g < 5000);
      const H = ["A", "B", "C", "D"], dg = kutuNo(N);
      const soruK = (x, y, d) => kutu(x - 80, y - 20, 160, 38, "g-yumusak", 18) + Y(x, y + 4, `${d}${ek(d, "e")} bölünür mü?`, { k: 1 });
      let ic = kutu(220, 8, 120, 34, "g-b", 6) + Y(280, 31, "Sayı: " + N, { b: 1 }) + cizgi(280, 42, 280, 62);
      ic += soruK(280, 82, d1) + cizgi(200, 82, 140, 82) + cizgi(140, 82, 140, 148) + cizgi(360, 82, 420, 82) + cizgi(420, 82, 420, 148);
      ic += Y(170, 74, "Evet", { k: 1 }) + Y(390, 74, "Hayır", { k: 1 });
      ic += soruK(140, 168, d2) + soruK(420, 168, d3);
      [[140, 70, 210], [420, 350, 490]].forEach(([x, xl, xr]) => { ic += cizgi(x, 187, x, 205) + cizgi(xl, 205, xr, 205) + cizgi(xl, 205, xl, 228) + cizgi(xr, 205, xr, 228) + Y(xl - 22, 222, "Evet", { k: 1 }) + Y(xr + 26, 222, "Hayır", { k: 1 }); });
      [70, 210, 350, 490].forEach((x, i) => { ic += kutu(x - 34, 230, 68, 40, "g-bos", 6) + Y(x, 256, H[i], { b: 1 }); });
      const yol = [kuralAcik(N, d1), N % d1 === 0 ? kuralAcik(N, d2) : kuralAcik(N, d3)];
      return S({ kaz: "bol.kural", duzey: "uygulama", zorluk: 2, gorsel: G.svg(560, 280, ic, "bölünebilme ayırma makinesi"),
        soru: "Şekildeki ayırma makinesine giren sayı, sorulara verilen “Evet” ya da “Hayır” cevaplarına göre yol alarak A, B, C ya da D kutusuna düşmektedir.<br>Makineye giren sayı hangi kutuya düşer?",
        dogru: H[dg] + " kutusu", dogruNeden: `${yol.join("; ")}. Bu yol ${H[dg]} kutusuna çıkar.`,
        yanlis: H.filter((_, i) => i !== dg).map(h => [h + " kutusu", h === H[dg ^ 1] ? "islem" : "dikkat", h === H[dg ^ 1] ? "İkinci sorudaki kuralı yeniden uygula; cevabı ters vermişsin." : "İlk sorunun cevabına göre makinenin öbür koluna geçmişsin; ilk kuralı yeniden kontrol et."]),
        ipucu: "Makinedeki soruları sırayla, bölünebilme kurallarıyla cevapla ve okları izle.",
        cozum: ["🔎 Soruyu anlayalım: " + N + " sayısı makinede iki sorudan geçecek. Cevaplara göre okları izleyip kutuyu bulacağız.",
          "💡 Hatırlayalım: 2 → birler basamağı çift; 3 → rakamlar toplamı 3'ün katı; 4 → son iki basamak 4'ün katı; 5 → birler 0 ya da 5; 6 → hem 2 hem 3; 9 → rakamlar toplamı 9'un katı; 10 → birler 0.",
          "✏️ 1. soru: " + yol[0] + ". " + (N % d1 === 0 ? "“Evet” koluna (sola) gideriz." : "“Hayır” koluna (sağa) gideriz."),
          "✏️ 2. soru: " + yol[1] + ".",
          `✅ Sonuç: Sayı ${H[dg]} kutusuna düşer.`,
          `🔁 Kontrol edelim: Bölme yaparak doğrulayalım: ${N} ÷ ${d1} → kalan ${N % d1}; ${N} ÷ ${N % d1 === 0 ? d2 : d3} → kalan ${N % (N % d1 === 0 ? d2 : d3)} ✓`],
        kural: "Akış şemalarında her soruyu ayrı cevapla; “Evet” ve “Hayır” kollarını karıştırma." });
    },
  );

  SORU_EKLE("bol.rakam",
    z => {
      const tur = sec(["dokuz", "alti"]);
      let rakamlar, bos, dogru, aciklama, kosul, yanlis;
      if (tur === "dokuz") {
        do { rakamlar = [R(1, 9), R(0, 9), R(0, 9), R(0, 9)]; bos = R(1, 2); rakamlar[bos] = 0; } while ((9 - rakamTop(+rakamlar.join("")) % 9) % 9 === 0);
        dogru = (9 - rakamTop(+rakamlar.join("")) % 9) % 9; rakamlar[bos] = dogru;
        const top = rakamTop(+rakamlar.join("")) - dogru;
        kosul = "9 ile kalansız bölünebilmektedir"; aciklama = [`💡 Hatırlayalım: Bir sayı, rakamlarının toplamı 9'un katı ise 9 ile kalansız bölünür.`, `✏️ Bilinen rakamları toplayalım: ${rakamlar.filter((_, i) => i !== bos).join(" + ")} = ${top}.`, `✏️ ${top}'${ek(top, "e").slice(1)} hangi rakamı eklersek 9'un katı olur? ${top} + ${dogru} = ${top + dogru} (9'un katı) ✓`];
        const n9 = r => (top + r) % 3 === 0 ? ["kavrama", `Toplam ${top} + ${r} = ${top + r} olur; 3'ün katıdır ama 9'un katı değildir. 3 kuralı ile 9 kuralını karıştırma.`] : ["islem", `Toplam ${top} + ${r} = ${top + r} olur; 9'un katı değildir.`];
        yanlis = [(dogru + 3) % 10, (dogru + 6) % 10, 9 - dogru, (dogru + 1) % 10, (dogru + 8) % 10].filter(r => r !== dogru).map(r => [r, ...n9(r)]);
      } else {
        rakamlar = [R(1, 9), R(0, 9), R(0, 9), 0]; bos = 3;
        const top = rakamTop(+rakamlar.join(""));
        const adaylar = [0, 2, 4, 6, 8].filter(r => (top + r) % 3 === 0);
        dogru = Math.max(...adaylar); rakamlar[3] = dogru;
        kosul = "6 ile kalansız bölünebilmektedir. Şifrenin son rakamı, bu koşulu sağlayan <b>en büyük</b> rakamdır";
        aciklama = ["💡 Hatırlayalım: Bir sayı hem 2'ye hem 3'e bölünüyorsa 6'ya bölünür. 2 için birler basamağı çift olmalı; 3 için rakamlar toplamı 3'ün katı olmalı.", `✏️ Bilinen rakamların toplamı: ${rakamlar.slice(0, 3).join(" + ")} = ${top}.`, `✏️ Son rakam çift olmalı (0, 2, 4, 6, 8) ve toplamı 3'ün katı yapmalı: ${adaylar.map(r => top + " + " + r + " = " + (top + r)).join(", ")}. Uyan rakamlar: ${adaylar.join(", ")}; en büyüğü ${dogru}.`];
        const tekA = [1, 3, 5, 7, 9].find(r => (top + r) % 3 === 0);
        const neden6 = r => (top + r) % 3 === 0 && r % 2 === 0 ? ["dikkat", "Bu rakam da koşulu sağlıyor ama soru en büyük rakamı istiyor."] : r % 2 ? ["kavrama", `${r} tek olduğu için sayı 2'ye, dolayısıyla 6'ya bölünmez.`] : ["islem", `Rakamlar toplamı ${top} + ${r} = ${top + r} olur; 3'ün katı değil, sayı 6'ya bölünmez.`];
        yanlis = [tekA, ...adaylar.filter(r => r !== dogru), (dogru + 2) % 10, (dogru + 1) % 10, (dogru + 3) % 10].filter(r => r !== undefined && r !== dogru).map(r => [r, ...neden6(r)]);
      }
      let ic = `<path class="g-cizgi" fill="none" stroke-width="10" d="M130 92 V60 a60 50 0 0 1 120 0 V92"/>` + kutu(70, 90, 240, 120, "g-b", 18);
      rakamlar.forEach((r, i) => { ic += kutu(95 + i * 50, 125, 40, 50, i === bos ? "g-yumusak" : "g-bos", 6) + Y(115 + i * 50, 157, i === bos ? "?" : r, { b: 1 }); });
      return S({ kaz: "bol.rakam", duzey: "transfer", zorluk: 2, gorsel: G.svg(380, 225, ic, "dört haneli şifreli kilit"),
        soru: `Kerem, bisiklet kilidinin dört basamaklı şifresinin bir rakamını unutmuştur (şekilde “?” ile gösterilen). Şifre olan dört basamaklı sayı ${kosul}.<br>Unutulan rakam kaçtır?`,
        dogru, dogruNeden: `? yerine ${dogru} yazınca ${rakamlar.join("")} sayısı koşulu sağlar.`, yanlis,
        ipucu: tur === "dokuz" ? "Rakamlar toplamı 9'un katı olmalı." : "6'ya bölünme = 2'ye ve 3'e birlikte bölünme.",
        cozum: [`🔎 Soruyu anlayalım: Şifre ${rakamlar.map((r, i) => i === bos ? "?" : r).join("")} biçiminde. Koşulu sağlayan rakamı bulacağız.`].concat(aciklama, [`✅ Sonuç: Unutulan rakam ${dogru}; şifre ${rakamlar.join("")}.`, `🔁 Kontrol edelim: ${rakamlar.join("")} ÷ ${tur === "dokuz" ? 9 : 6} = ${+rakamlar.join("") / (tur === "dokuz" ? 9 : 6)}, kalan 0 ✓`]),
        kural: tur === "dokuz" ? "9 ile bölünebilme: rakamlar toplamı 9'un katı olmalı." : "6 ile bölünebilme: hem 2 hem 3 kuralı birlikte sağlanmalı." });
    },
  );

  SORU_EKLE("bol.ayirt",
    z => {
      const [p, q] = sec([[2, 3], [3, 5], [2, 5], [4, 3], [9, 2], [5, 4], [10, 3]]);
      const bolge = n => n % p === 0 ? (n % q === 0 ? 1 : 0) : (n % q === 0 ? 2 : 3);
      const yerler = [[[115, 110], [120, 165]], [[260, 112], [260, 165]], [[405, 110], [400, 165]], [[490, 250], [40, 250]]];
      const sayilar = [], hedefB = karistir([0, 1, 2, 3, R(0, 3)]);
      hedefB.forEach(b => { let n, g = 0; do { n = R(12, 150); g++; } while ((bolge(n) !== b || sayilar.includes(n)) && g < 3000); sayilar.push(n); });
      const yanlisI = R(0, 4), dolu = [0, 0, 0, 0];
      const gosterilen = sayilar.map((n, i) => i === yanlisI ? -1 : bolge(n));
      gosterilen.forEach(b => { if (b >= 0) dolu[b]++; });
      const gercek = bolge(sayilar[yanlisI]);
      const bos = karistir([0, 1, 2, 3].filter(b => b !== gercek && dolu[b] < 2))[0];
      gosterilen[yanlisI] = bos; const say2 = [0, 0, 0, 0];
      let ic = `<rect class="g-bos g-cizgi" x="8" y="8" width="524" height="264" rx="10" stroke-width="2"/><circle class="g-yumusak g-cizgi" cx="190" cy="140" r="110" stroke-width="2" fill-opacity="0.55"/><circle class="g-yumusak g-cizgi" cx="330" cy="140" r="110" stroke-width="2" fill-opacity="0.55"/>`;
      ic += Y(150, 26, `${p}${ek(p, "e")} bölünenler`, { b: 1 }) + Y(370, 26, `${q}${ek(q, "e")} bölünenler`, { b: 1 });
      sayilar.forEach((n, i) => { const b = gosterilen[i], [x, y] = yerler[b][say2[b]++]; ic += Y(x, y, n, { b: 1 }); });
      const BAD = [`yalnızca ${p}${ek(p, "e")} bölünenler`, `hem ${p}${ek(p, "e")} hem ${q}${ek(q, "e")} bölünenler`, `yalnızca ${q}${ek(q, "e")} bölünenler`, "ikisine de bölünmeyenler"];
      const dogru = sayilar[yanlisI];
      const tanim = n => `${n}: ${n % p ? p + ek(p, "e") + " bölünmez" : p + ek(p, "e") + " bölünür"}, ${n % q ? q + ek(q, "e") + " bölünmez" : q + ek(q, "e") + " bölünür"}`;
      return S({ kaz: "bol.ayirt", duzey: "baglanti", zorluk: 3, gorsel: G.svg(540, 280, ic, "iki kümeli şema"),
        soru: `Zeynep bazı sayıları “${p}${ek(p, "e")} bölünenler” ve “${q}${ek(q, "e")} bölünenler” kümelerinden oluşan şemaya yerleştirmiştir. Kümelerin dışına ikisine de bölünmeyen sayıları yazmıştır.<br>Zeynep hangi sayıyı <b>yanlış bölgeye</b> yazmıştır?`,
        dogru, dogruNeden: `${tanim(dogru)}; bu sayı “${BAD[gercek]}” bölgesinde olmalıydı, Zeynep onu “${BAD[bos]}” bölgesine yazmış.`,
        yanlis: sayilar.filter((_, i) => i !== yanlisI).map(n => [n, "dikkat", `${tanim(n)}; yani doğru bölgede (${BAD[bolge(n)]}).`]),
        ipucu: "Her sayı için iki ayrı soru sor: " + p + "'e bölünüyor mu? " + q + "'e bölünüyor mu?",
        cozum: ["🔎 Soruyu anlayalım: Şemadaki her sayının bulunduğu bölge, iki bölünebilme kuralına verdiği cevaba uymalı. Uymayanı bulacağız.",
          `💡 Hatırlayalım: Ortak bölgede hem ${p}${ek(p, "e")} hem ${q}${ek(q, "e")} bölünenler; sol tarafta yalnızca ${p}${ek(p, "e")}; sağda yalnızca ${q}${ek(q, "e")}; dışarıda ikisine de bölünmeyenler bulunur.`,
          "✏️ Sayıları tek tek kontrol edelim: " + sayilar.map(n => tanim(n)).join("; ") + ".",
          `✏️ ${dogru} şemada “${BAD[bos]}” bölgesinde duruyor, oysa “${BAD[gercek]}” bölgesinde olmalı.`,
          `✅ Sonuç: Yanlış yerleştirilen sayı ${dogru}.`,
          "🔁 Kontrol edelim: Diğer dört sayının bulunduğu bölge, iki sorunun cevabıyla uyumlu ✓"],
        kural: "Kesişim bölgesi “ikisine birden”, dış bölge “hiçbirine” bölünen sayılar içindir." });
    },
  );

  SORU_EKLE("asal.tani",
    z => {
      const bas = sec([21, 31, 41, 51, 61, 71]);
      const sayi = [...Array(30).keys()].map(i => bas + i);
      const asallar = sayi.filter(asalMi);
      const tuzak = sayi.filter(n => !asalMi(n) && n % 2 && n % 5);
      const yanlis1 = sec(tuzak);
      const boyali = new Set(asallar.concat([yanlis1]));
      let ic = "";
      sayi.forEach((n, i) => { const x = 20 + (i % 10) * 56, y = 16 + Math.floor(i / 10) * 46; ic += `<rect class="${boyali.has(n) ? "g-b" : "g-bos"} g-cizgi" x="${x}" y="${y}" width="56" height="46" stroke-width="1.2"/>` + Y(x + 28, y + 29, n, boyali.has(n) ? { b: 1 } : {}); });
      const carp = bolenler(yanlis1).filter(d => d > 1 && d < yanlis1)[0];
      return S({ kaz: "asal.tani", duzey: "uygulama", zorluk: 2, gorsel: G.svg(600, 160, ic, `${bas}–${bas + 29} sayı tablosu`),
        soru: "Can, şekildeki sayı tablosunda <b>asal</b> olduğunu düşündüğü sayıları sarıya boyamıştır. Yalnızca bir sayıyı yanlışlıkla boyamıştır.<br>Can'ın yanlışlıkla boyadığı sayı hangisidir?",
        dogru: yanlis1, dogruNeden: `${yanlis1} = ${carp} × ${yanlis1 / carp}; 1 ve kendisinden başka böleni olduğu için asal değildir.`,
        yanlis: karistir(asallar).slice(0, 3).map(n => [n, "bilgi", `${n} asaldır; 1 ve ${n} dışında böleni yoktur (2, 3, 5, 7 ile bölünmez).`]),
        ipucu: "Boyalı sayıları 3, 7 gibi küçük asal sayılara bölmeyi dene. Tek sayı olmak asal olmak demek değildir.",
        cozum: ["🔎 Soruyu anlayalım: Boyalı sayılardan biri asal değil. Onu bulacağız.",
          "💡 Hatırlayalım: Asal sayının yalnızca iki böleni vardır: 1 ve kendisi. 100'den küçük bir sayının asal olup olmadığını anlamak için onu 2, 3, 5 ve 7'ye bölmeyi denemek yeter.",
          `✏️ Boyalı sayılar: ${[...boyali].sort((a, b) => a - b).join(", ")}. Hepsi tek ve hiçbiri 5 ile bitmiyor; 3 ve 7'yi deneyelim.`,
          `✏️ ${yanlis1} ÷ ${carp} = ${yanlis1 / carp}, kalan 0. Demek ki ${yanlis1}${ek(yanlis1, "in")} ${carp} diye bir böleni daha var.`,
          `✅ Sonuç: ${yanlis1} asal değildir (bileşiktir); Can onu yanlışlıkla boyamıştır.`,
          "🔁 Kontrol edelim: Diğer boyalı sayılar 2, 3, 5 ve 7'nin hiçbirine kalansız bölünmüyor; hepsi asal ✓"],
        kural: "Tek sayıların hepsi asal değildir; 3 ve 7'ye bölünebilmeyi mutlaka dene." });
    },
  );

  SORU_EKLE("asal.ayir",
    z => {
      const n = sec([60, 72, 84, 90, 126, 150, 180, 210, 168, 132]);
      const satir = []; let x = n;
      while (x > 1) { const p = bolenler(x).find(d => d > 1); satir.push([x, p]); x /= p; }
      satir.push([1, ""]);
      const kosul = R(0, 1), sat = R(1, satir.length - 2);
      const sor = kosul === 0 ? [sat, 0] : [sat, 1];
      const dogru = satir[sor[0]][sor[1]];
      let ic = cizgi(150, 20, 150, 20 + satir.length * 36) + cizgi(150, 20 + (satir.length - 1) * 36 + 4, 230, 20 + (satir.length - 1) * 36 + 4, "g-ince", 1);
      satir.forEach(([a, p], i) => {
        const y = 44 + i * 36;
        const bosA = sor[0] === i && sor[1] === 0, bosP = sor[0] === i && sor[1] === 1;
        if (bosA) ic += kutu(100, y - 22, 44, 30, "g-b", 4);
        if (bosP) ic += kutu(158, y - 22, 40, 30, "g-b", 4);
        ic += Y(140, y, bosA ? "?" : a, { a: "end", b: 1 }) + Y(178, y, bosP ? "?" : p, { b: 1 });
      });
      const ust = ustlu(asalCarpan(n));
      const yan = sor[1] === 0 ? [[satir[sat - 1][0] - satir[sat - 1][1], "kavrama", "Bölme yerine çıkarma yapmışsın; her satırda sayı, yanındaki asal sayıya bölünür."], [satir[sat + 1][0], "dikkat", "Bu, bir alt satırdaki sayıdır; ? işaretli satırın bir üstündeki sayıyı bölmelisin."], [dogru * 2, "islem", "Bölmeyi yeniden yap; üstteki sayının yanındaki asala bölümü bulunmalı."]]
        : [[satir[sat][0] / dogru > 1 && !asalMi(satir[sat][0] / dogru) ? satir[sat][0] / dogru : dogru + 2, "kavrama", "Merdivenin sağ tarafına yalnızca asal sayılar yazılır; bu sayı ya asal değil ya da bölümü kalanlı yapar."], [satir[sat][0], "dikkat", "Bu, soldaki sayının kendisidir; sağ tarafa onu bölen en küçük asal sayı yazılır."], [satir[sat][0] / dogru, "dikkat", "Bu, bölme sonucudur ve bir alt satıra yazılır; sağ tarafa bölen asal sayı gelir."], [dogru + 1, "islem", "Bu sayı soldaki sayıyı kalansız bölmüyor."]];
      return S({ kaz: "asal.ayir", duzey: "uygulama", zorluk: 2, gorsel: G.svg(320, 50 + satir.length * 36, ic, `${n} sayısının bölen merdiveni`),
        soru: `${n} sayısı şekildeki bölme (bölen) merdiveniyle asal çarpanlarına ayrılmıştır. Merdivenin her basamağında soldaki sayı, sağına yazılan <b>en küçük asal sayıya</b> bölünmüştür.<br>Sarı kutudaki “?” yerine hangi sayı gelmelidir?`,
        dogru, dogruNeden: sor[1] === 0 ? `${satir[sat - 1][0]} ÷ ${satir[sat - 1][1]} = ${dogru}.` : `${satir[sat][0]} sayısını bölen en küçük asal sayı ${dogru}'${ek(dogru, "dir").slice(1)}.`,
        yanlis: yan,
        ipucu: "Merdivende her satırdaki sayı = üst satırdaki sayı ÷ üst satırın sağındaki asal sayı.",
        cozum: [`🔎 Soruyu anlayalım: ${n}${ek(n, "in")} bölen merdiveninde bir kutu boş. Merdivenin kuralına göre onu dolduracağız.`,
          "💡 Hatırlayalım: Merdivende soldaki sayıyı bölen en küçük asal sayı sağa yazılır, bölüm bir alt satıra geçer. 1'e ulaşınca durulur.",
          "✏️ Merdiveni baştan kuralım: " + satir.slice(0, -1).map(([a, p]) => `${a} ÷ ${p} = ${a / p}`).join("; ") + ".",
          `✏️ Soru işaretli kutu ${sor[1] === 0 ? "sol sütunda, " + (sat + 1) + ". satırda" : "sağ sütunda, " + (sat + 1) + ". satırda"}; buraya ${dogru} gelir.`,
          `✅ Sonuç: “?” yerine ${dogru} yazılmalıdır.`,
          `🔁 Kontrol edelim: Sağ sütundaki asalların çarpımı ${n}${ek(n, "i")} vermeli: ${satir.slice(0, -1).map(s => s[1]).join(" × ")} = ${n} ✓ (üslü yazılışı ${ust}).`],
        kural: "Bölen merdiveninde sağdaki asalların çarpımı, en üstteki sayıya eşittir." });
    },
  );
  const ustlu = OGR.ustlu;

  SORU_EKLE("asal.kavram",
    z => {
      const [a, b] = sec([[3, 5], [3, 7], [3, 9], [5, 7], [3, 11], [5, 5], [3, 13]]), n = a * b, bk = 16;
      const gorsel = G.svg(b * bk + 40, a * bk + 40, kareler(20, 20, a, b, bk, "g-c"), `${n} birim kareden oluşan dikdörtgen`);
      return S({ kaz: "asal.kavram", duzey: "aciklama", zorluk: 2, gorsel,
        soru: "Mert, elindeki birim kareleri boşluksuz dizerek şekildeki dikdörtgeni oluşturmuştur.<br>Mert'in kullandığı birim kare sayısı için aşağıdakilerden hangisi doğrudur?",
        dogru: `Bileşik sayıdır; çünkü 1 ve kendisinden başka ${a} gibi bir çarpanı vardır.`, dogruNeden: `${a} × ${b} = ${n}; ${n}${ek(n, "in")} 1 ve ${n} dışında ${a} çarpanı da vardır, bu yüzden bileşiktir.`,
        yanlis: [[`Asal sayıdır; çünkü tek sayıdır.`, "kavrama", `Tek olmak asal olmak için yetmez; ${n} = ${a} × ${b} olduğu için ${n} bileşiktir.`], [`Asal sayıdır; çünkü yalnızca bir dikdörtgen oluşturulabilir.`, "dikkat", `Şekildeki ${a} × ${b} dikdörtgeni, 1 × ${n} dışında da dikdörtgen kurulabildiğini gösteriyor.`], ["Ne asal ne bileşiktir.", "bilgi", "Yalnızca 1 sayısı ne asal ne bileşiktir; " + n + " ise bileşiktir."]],
        ipucu: "Kare sayısını bul. 1 satırlık olmayan bir dikdörtgen kurulabiliyorsa bu sayı hakkında ne söylenebilir?",
        cozum: ["🔎 Soruyu anlayalım: Şekildeki dikdörtgenin kaç kareden oluştuğunu bulup bu sayının asal mı bileşik mi olduğuna karar vereceğiz.",
          `✏️ Sayalım: ${a} sıra ve her sırada ${b} kare var → ${a} × ${b} = ${n} birim kare.`,
          "💡 Hatırlayalım: Asal sayılarla yalnızca tek sıralık (1 × sayı) dikdörtgen kurulabilir; çünkü tek çarpan çiftleri 1 ve kendisidir. Başka bir dikdörtgen kurulabiliyorsa sayı bileşiktir.",
          `✏️ ${n} kare ${a} sıralık bir dikdörtgen yaptı; demek ki ${a}, ${n}${ek(n, "in")} çarpanıdır.`,
          `✅ Sonuç: ${n} bileşik bir sayıdır.`,
          `🔁 Kontrol edelim: ${n} ÷ ${a} = ${b}, kalan 0 ✓. ${n} tek olduğu hâlde asal değildir; “tek = asal” sanmak sık yapılan bir hatadır.`],
        kural: "Bir sayıyla 1 × sayı dışında dikdörtgen kurulabiliyorsa o sayı bileşiktir." });
    },
  );

  SORU_EKLE("okat.ekok",
    z => {
      const [a, b] = sec([[2, 3], [3, 4], [4, 6], [2, 5], [3, 5], [4, 5], [6, 8], [3, 8], [4, 10], [6, 9]]), e = ekok(a, b), max = Math.max(24, e + 2);
      const etiketler = [...Array(max + 1).keys()].filter(v => v % 2 === 0);
      return S({ kaz: "okat.ekok", duzey: "uygulama", zorluk: 2,
        gorsel: zipla(max, { yaylar: [{ adim: a, sayi: 2, sinif: "g-ok-a" }, { adim: b, sayi: 2, alt: true, sinif: "g-ok-d" }], etiketler }),
        soru: "İki tavşan sayı doğrusunun 0 noktasından aynı anda zıplamaya başlıyor. Mavi tavşanın ilk iki zıplaması doğrunun <b>üstünde</b>, kırmızı tavşanınki <b>altında</b> gösterilmiştir. Her tavşan hep aynı uzunlukta zıplıyor.<br>İki tavşanın 0'dan sonra <b>ilk kez</b> aynı noktaya bastığı sayı kaçtır?",
        dogru: e, dogruNeden: `Mavi tavşan ${a}${ek(a, "in")}, kırmızı tavşan ${b}${ek(b, "in")} katlarına basar; ilk ortak kat EKOK(${a}, ${b}) = ${e}.`,
        yanlis: [[a * b === e ? e + Math.min(a, b) : a * b, a * b === e ? "islem" : "strateji", a * b === e ? "Bu, ortak kat değildir; iki sayının katlarını yeniden yaz." : `${a} × ${b} = ${a * b} ortak kattır ama en küçüğü değildir; daha önce ${e} noktasında buluşurlar.`], [ebob(a, b) > 1 ? ebob(a, b) : a + b, ebob(a, b) > 1 ? "kavrama" : "islem", ebob(a, b) > 1 ? "Bu EBOB'dur; buluşma noktası ortak kat (EKOK) olmalı." : `${a} + ${b} = ${a + b}; zıplama uzunlukları toplanmaz.`], [2 * e, "dikkat", `${2 * e} de ortak noktadır ama ilk buluşma değildir.`], [e + a, "islem", "Katları yeniden yaz; bu sayı iki tavşanın da bastığı bir nokta değil."]],
        ipucu: "Önce her tavşanın bir zıplamasının kaç birim olduğunu bul, sonra katlarını yaz.",
        cozum: ["🔎 Soruyu anlayalım: İki tavşan farklı uzunluklarda zıplıyor. İkisinin de bastığı ilk noktayı (0 hariç) bulacağız.",
          `✏️ Şekilden okuyalım: Mavi tavşan 0 → ${a} → ${2 * a}, yani ${a}${ek(a, "er")} birim; kırmızı tavşan 0 → ${b} → ${2 * b}, yani ${b}${ek(b, "er")} birim zıplıyor.`,
          "💡 Hatırlayalım: İkisinin de bastığı noktalar ortak katlardır; ilk buluşma noktası en küçük ortak kattır (EKOK).",
          `✏️ ${a}${ek(a, "in")} katları: ${[1, 2, 3, 4, 5, 6].map(i => a * i).join(", ")}, …<br>${b}${ek(b, "in")} katları: ${[1, 2, 3, 4, 5].map(i => b * i).join(", ")}, …`,
          `✏️ İki listede de bulunan en küçük sayı: ${e}.`,
          `✅ Sonuç: Tavşanlar ilk kez ${e} noktasında buluşur.`,
          `🔁 Kontrol edelim: ${e} ÷ ${a} = ${e / a} zıplama, ${e} ÷ ${b} = ${e / b} zıplama; ikisi de tam sayı ✓`],
        kural: "Farklı adımlarla ilerleyenlerin ilk buluşma noktası EKOK'tur." });
    },
  );

  SORU_EKLE("okat.problem",
    z => {
      const [a, b] = sec([[2, 3], [3, 4], [4, 6], [2, 5], [3, 6], [4, 5], [6, 4], [2, 7], [3, 5]]), e = ekok(a, b);
      const d = R(1, 30 - e), bas = R(0, 6), son = d + e;
      const GUN = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], GUNA = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
      let ic = kutu(10, 6, 532, 34, "g-a", 6) + `<text x="276" y="29" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">NİSAN</text>`;
      GUN.forEach((g, i) => { ic += Y(48 + i * 76, 60, g, { k: 1, b: 1 }); });
      for (let g = 1; g <= 30; g++) { const k = bas + g - 1, x = 10 + (k % 7) * 76, y = 70 + Math.floor(k / 7) * 40; ic += `<rect class="${g === d ? "g-b" : "g-bos"} g-cizgi" x="${x}" y="${y}" width="76" height="40" stroke-width="1"/>` + Y(x + 38, y + 26, g, g === d ? { b: 1 } : {}); }
      const satirSay = Math.ceil((bas + 30) / 7), gun = g => GUNA[(bas + g - 1) % 7];
      const f = g => `${g} Nisan ${gun(g)}`;
      const yan = [[a * b !== e && d + a * b <= 30 ? f(d + a * b) : f(d + e - 1), a * b !== e ? "strateji" : "islem", a * b !== e ? `${a} × ${b} = ${a * b} gün sonra da birlikte giderler ama bu ilk buluşma değildir; EKOK ${e}.` : "Bir gün eksik saymışsın; işaretli günden " + e + " gün sonrasını bul."], [f(d + e - 1 >= 1 && d + e - 1 !== d + a * b ? d + e - 1 : d + e + 1), "dikkat", `İşaretli günü de saymışsın; ${d} Nisan'a ${e} gün eklenmeli: ${d} + ${e} = ${son}.`], [`${son} Nisan ${GUNA[(bas + son) % 7]}`, "dikkat", "Ayın gününü doğru buldun ama takvimde haftanın gününü yanlış okudun."], [f(Math.min(30, d + a + b)), "kavrama", `${a} + ${b} = ${a + b}; gün sayıları toplanmaz, ortak kat aranır.`]];
      return S({ kaz: "okat.problem", duzey: "transfer", zorluk: 3, gorsel: G.svg(552, 80 + satirSay * 40, ic, "nisan ayı takvimi"),
        soru: `Elif ${a} günde bir, Ozan ${b} günde bir yüzme kursuna gidiyor. İkisi takvimde sarı ile işaretli günde kursta karşılaştılar.<br>İkisinin kursta yeniden karşılaşacağı <b>ilk</b> gün aşağıdakilerden hangisidir?`,
        dogru: f(son), dogruNeden: `EKOK(${a}, ${b}) = ${e}; ${d} + ${e} = ${son}. Takvimde ${son} Nisan ${gun(son)} gününe denk geliyor.`,
        yanlis: yan,
        ipucu: "İşaretli günden kaç gün sonra ikisi aynı gün kursta olur? Bu sayı a ve b'nin ortak katıdır.",
        cozum: [`🔎 Soruyu anlayalım: Elif ${a}, Ozan ${b} günde bir gidiyor. ${d} Nisan'da birlikteler. Bir sonraki ortak günü takvimde bulacağız.`,
          "💡 Hatırlayalım: Düzenli tekrar eden iki olayın yeniden aynı gün olması için geçen gün sayısı, iki sayının ortak katı olmalıdır. İlk karşılaşma için EKOK kullanılır.",
          `✏️ ${a}${ek(a, "in")} katları: ${[1, 2, 3, 4, 5, 6].map(i => a * i).join(", ")}; ${b}${ek(b, "in")} katları: ${[1, 2, 3, 4].map(i => b * i).join(", ")} → EKOK = ${e}.`,
          `✏️ ${d} + ${e} = ${son}. Yani ${son} Nisan'da yeniden karşılaşırlar.`,
          `✏️ Takvimde ${son} rakamının sütununa bakalım: ${gun(son)}.`,
          `✅ Sonuç: ${f(son)}.`,
          `🔁 Kontrol edelim: Elif ${d}${a < e ? ", " + [...Array(e / a).keys()].map(i => d + (i + 1) * a).join(", ") : ""} günlerinde; Ozan ${d}, ${[...Array(e / b).keys()].map(i => d + (i + 1) * b).join(", ")} günlerinde gider. İlk ortak gün ${son} ✓`],
        kural: "“Yeniden ilk kez birlikte” → EKOK kadar gün sonra." });
    },
  );

  /* İki şerit çizimi (uzunluk cm) */
  function seritler(a, b, ad = ["Kırmızı kurdele", "Mavi kurdele"]) {
    const mx = Math.max(a, b), k = 420 / mx;
    let ic = Y(20, 28, ad[0] + ": " + a + " cm", { a: "start", k: 1 }) + `<rect class="g-d g-cizgi" x="20" y="36" width="${a * k}" height="22" rx="4" stroke-width="1.2"/>`;
    ic += Y(20, 92, ad[1] + ": " + b + " cm", { a: "start", k: 1 }) + `<rect class="g-a g-cizgi" x="20" y="100" width="${b * k}" height="22" rx="4" stroke-width="1.2"/>`;
    return G.svg(470, 136, ic, "iki kurdele");
  }

  SORU_EKLE("obol.ebob",
    z => {
      const g = sec([4, 6, 8, 9, 12, 15]); let m, n; do { m = R(2, 7); n = R(2, 7); } while (m === n || ebob(m, n) !== 1 || g * Math.max(m, n) > 120);
      const a = g * m, b = g * n, kucuk = bolenler(g).filter(d => d < g && d > 1);
      return S({ kaz: "obol.ebob", duzey: "uygulama", zorluk: 2, gorsel: seritler(a, b),
        soru: "Şekildeki iki kurdele, hiç artmayacak biçimde <b>eşit uzunlukta</b> parçalara kesilecektir.<br>Bir parçanın uzunluğu <b>en çok</b> kaç santimetre olabilir?",
        dogru: g + " cm", dogruNeden: `Parça uzunluğu ${a} ve ${b}${ek(b, "in")} ortak böleni olmalı; en büyüğü EBOB(${a}, ${b}) = ${g}.`,
        yanlis: [[(kucuk.length ? sec(kucuk) : 1) + " cm", "dikkat", "Bu da iki uzunluğu böler ama en büyük ortak bölen değildir; soru “en çok” diyor."], [Math.abs(a - b) === g ? ekok(a, b) + " cm" : Math.abs(a - b) + " cm", Math.abs(a - b) === g ? "kavrama" : "strateji", Math.abs(a - b) === g ? "Bu EKOK'tur; parça uzunluğu kurdelelerden uzun olamaz." : "Uzunlukların farkını almışsın; parça uzunluğu iki uzunluğu da kalansız bölmeli."], [(m + n) + " cm", "kavrama", `${m + n}, toplam parça sayısıdır; soru bir parçanın uzunluğunu soruyor.`], [ekok(a, b) + " cm", "kavrama", "Bu EKOK'tur; kesme işleminde ortak bölen aranır."]],
        ipucu: "Parça uzunluğu her iki kurdeleyi de kalansız bölmeli. En büyük ortak bölen hangisi?",
        cozum: [`🔎 Soruyu anlayalım: Şekilden kurdelelerin uzunluklarını okuyoruz: ${a} cm ve ${b} cm. Artmadan eşit parçalara kesilecekler; en uzun parçayı arıyoruz.`,
          "💡 Hatırlayalım: Artmadan bölmek için parça uzunluğu iki sayının ortak böleni olmalı; “en çok” dendiği için EBOB'u bulacağız.",
          `✏️ ${a}${ek(a, "in")} bölenleri: ${bolenler(a).join(", ")}.`,
          `✏️ ${b}${ek(b, "in")} bölenleri: ${bolenler(b).join(", ")}. Ortak olanların en büyüğü ${g}.`,
          `✅ Sonuç: Bir parça en çok ${g} cm olabilir.`,
          `🔁 Kontrol edelim: ${a} ÷ ${g} = ${m} parça, ${b} ÷ ${g} = ${n} parça; ikisinde de artık yok ✓`],
        kural: "Artmadan eşit parçalara ayırmada en uzun parça EBOB'dur." });
    },
  );

  SORU_EKLE("obol.problem",
    z => {
      const g = sec([2, 3, 4, 5, 6]); let m, n; do { m = R(2, 6); n = R(m + 1, 9); } while (ebob(m, n) !== 1);
      const a = g * n, b = g * m, k = Math.min(380 / a, 200 / b);
      let ic = `<rect class="g-c g-cizgi" x="60" y="30" width="${a * k}" height="${b * k}" stroke-width="2" fill-opacity="0.35"/>`;
      ic += Y(60 + a * k / 2, 22, a + " m", { b: 1 }) + Y(50, 30 + b * k / 2 + 5, b + " m", { a: "end", b: 1 });
      return S({ kaz: "obol.problem", duzey: "transfer", zorluk: 3, gorsel: G.svg(a * k + 100, b * k + 50, ic, `${a} m × ${b} m bahçe`),
        soru: "Ölçüleri şekilde verilen dikdörtgen biçimindeki bahçe, hiç boşluk kalmayacak ve parça kesilmeyecek biçimde <b>en büyük</b> eş karelere bölünüp her kareye bir çeşit sebze ekilecektir.<br>Bahçe kaç kareye bölünür?",
        dogru: m * n, dogruNeden: `Karenin kenarı EBOB(${a}, ${b}) = ${g} m; ${a} ÷ ${g} = ${n} ve ${b} ÷ ${g} = ${m} → ${n} × ${m} = ${m * n} kare.`,
        yanlis: [[g, "strateji", `${g} m bir karenin kenar uzunluğudur; soru kare sayısını soruyor.`], [m + n, "islem", `Bir kenarda ${n}, diğerinde ${m} kare var; kare sayısı toplam değil çarpımdır.`], [a * b, "kavrama", `${a * b} bahçenin metrekare olarak alanıdır; 1 m'lik kareler en büyük kare değildir.`], [m * n * 4, "islem", "Kenarı EBOB'dan küçük seçmişsin; en büyük kare istendiği için kare sayısı daha az olmalı."]],
        ipucu: "Karenin kenarı, iki kenar uzunluğunun en büyük ortak böleni olmalı.",
        cozum: [`🔎 Soruyu anlayalım: Şekilden bahçenin kenarlarını okuyoruz: ${a} m ve ${b} m. En büyük eş karelere bölüp kare sayısını bulacağız.`,
          "💡 Hatırlayalım: Karenin kenarı iki kenarı da kalansız bölmeli (ortak bölen); en büyük kare için EBOB alınır.",
          `✏️ EBOB(${a}, ${b}) = ${g}. Karenin kenarı ${g} m.`,
          `✏️ Uzun kenara ${a} ÷ ${g} = ${n} kare, kısa kenara ${b} ÷ ${g} = ${m} kare sığar.`,
          `✏️ Toplam kare: ${n} × ${m} = ${m * n}.`,
          `✅ Sonuç: Bahçe ${m * n} kareye bölünür.`,
          `🔁 Kontrol edelim: Alanlarla bakalım: bahçe ${a} × ${b} = ${a * b} m², bir kare ${g} × ${g} = ${g * g} m²; ${a * b} ÷ ${g * g} = ${m * n} ✓`],
        kural: "En büyük eş karelere bölmede kenar = EBOB; kare sayısı = (uzun ÷ EBOB) × (kısa ÷ EBOB)." });
    },
  );

  SORU_EKLE("obol.ayirt",
    z => {
      let a, b; do { a = sec([4, 6, 8, 9, 10, 12, 15]); b = sec([6, 8, 9, 10, 12, 15, 18, 20]); } while (a >= b || ebob(a, b) === 1 || ebob(a, b) === a || ekok(a, b) > 90);
      const kat = R(0, 1) === 0, E = ekok(a, b), B = ebob(a, b), k = Math.min(10, 260 / b);
      let ic = `<rect class="g-b g-cizgi" x="60" y="30" width="${b * k}" height="${a * k}" stroke-width="2"/>` + Y(60 + b * k / 2, 22, b + " cm", { b: 1 }) + Y(52, 30 + a * k / 2 + 5, a + " cm", { a: "end", b: 1 });
      const soru = kat ? "Şekildeki dikdörtgen kartlardan yeterince vardır. Kartlar hep aynı yönde, üst üste binmeden ve boşluk kalmadan yan yana ve alt alta dizilerek <b>bir kare</b> oluşturulacaktır.<br>Oluşturulabilecek <b>en küçük</b> karenin bir kenarı kaç santimetredir?"
        : "Şekildeki dikdörtgen biçimli kâğıt, hiç artmayacak biçimde <b>eş karelere</b> kesilecektir.<br>Kesilebilecek <b>en büyük</b> karenin bir kenarı kaç santimetredir?";
      const dogru = (kat ? E : B) + " cm";
      return S({ kaz: "obol.ayirt", duzey: "baglanti", zorluk: 3, gorsel: G.svg(b * k + 100, a * k + 50, ic, `${b} cm × ${a} cm dikdörtgen`), soru,
        dogru, dogruNeden: kat ? `Karenin kenarı hem ${a} hem ${b}${ek(b, "in")} katı olmalı; en küçüğü EKOK(${a}, ${b}) = ${E}.` : `Karenin kenarı hem ${a} hem ${b}${ek(b, "in")} böleni olmalı; en büyüğü EBOB(${a}, ${b}) = ${B}.`,
        yanlis: [[(kat ? B : E) + " cm", "kavrama", kat ? "Bu EBOB'dur; kartları birleştirip büyüyen bir kare kurarken ortak kat (EKOK) aranır." : "Bu EKOK'tur; bir kâğıdı küçük parçalara keserken ortak bölen (EBOB) aranır."], [a * b + " cm", "strateji", `${a} × ${b} = ${a * b}, ${kat ? "ortak kattır ama en küçüğü değildir" : "kenarlardan büyük olduğu için kâğıttan çıkamaz"}.`], [(b - a) + " cm", "islem", "Kenarların farkı, ortak bölen ya da ortak kat bulma yöntemi değildir."], [(a + b) + " cm", "islem", "Kenarlar toplanmaz."]],
        ipucu: kat ? "Kartlar birleştikçe kare büyür: kenar, hem " + a + " hem " + b + " ile kalansız bölünmeli." : "Kâğıt küçülerek parçalanır: kare kenarı " + a + " ve " + b + " sayılarını kalansız bölmeli.",
        cozum: [`🔎 Soruyu anlayalım: Şekildeki dikdörtgenin kenarları ${b} cm ve ${a} cm. ${kat ? "Kartları birleştirerek büyük bir kare kuracağız." : "Kâğıdı kesip küçük karelere ayıracağız."}`,
          "💡 Hatırlayalım: Parçaları birleştirip büyütüyorsak ortak kat (EKOK), bir bütünü parçalara bölüyorsak ortak bölen (EBOB) aranır.",
          kat ? `✏️ Karenin kenarı, kartın iki kenarının da katı olmalı: ${a}${ek(a, "in")} katları ${[1, 2, 3, 4, 5].map(i => a * i).join(", ")}…; ${b}${ek(b, "in")} katları ${[1, 2, 3].map(i => b * i).join(", ")}…`
            : `✏️ Karenin kenarı, iki kenarı da bölmeli: ${a}${ek(a, "in")} bölenleri ${bolenler(a).join(", ")}; ${b}${ek(b, "in")} bölenleri ${bolenler(b).join(", ")}.`,
          kat ? `✏️ İlk ortak kat ${E}: EKOK(${a}, ${b}) = ${E}.` : `✏️ En büyük ortak bölen ${B}: EBOB(${a}, ${b}) = ${B}.`,
          `✅ Sonuç: Karenin kenarı ${dogru}.`,
          kat ? `🔁 Kontrol edelim: Yan yana ${E} ÷ ${b} = ${E / b} kart, alt alta ${E} ÷ ${a} = ${E / a} kart dizilir ✓` : `🔁 Kontrol edelim: Uzun kenara ${b} ÷ ${B} = ${b / B}, kısa kenara ${a} ÷ ${B} = ${a / B} kare sığar, artık yok ✓`],
        kural: "Birleştirip büyütme → EKOK; bölüp küçültme → EBOB." });
    },
  );
})();
