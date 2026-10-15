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
  const GS = (w, h, ic, et, min = 520) => w >= min ? G.svg(w, h, ic, et) : G.svg(min, h, `<g transform="translate(${(min - w) / 2} 0)">${ic}</g>`, et);
  const TL = k => od(k / 100) + " TL"; // kuruş → "12,5 TL"

  /* Zıplama yaylı sayı doğrusu. yaylar: [{adim, sayi, alt, sinif}] ; etiketler: gösterilecek sayılar */
  function zipla(max, { yaylar = [], etiketler = null, isaret = [] } = {}) {
    const W = 620, H = 150, sol = 25, sag = 25, y = 82, xk = v => sol + (W - sol - sag) * v / max;
    let ic = cizgi(sol - 10, y, W - sag + 10, y);
    for (let v = 0; v <= max; v++) ic += cizgi(xk(v), y - 6, xk(v), y + 6, "g-cizgi", 1.5);
        yaylar.forEach(({ adim, sayi, alt, sinif }) => {
      for (let i = 0; i < sayi; i++) {
        const a = xk(i * adim), b = xk((i + 1) * adim), h = Math.min(48, (b - a) * 0.55) * (alt ? -1 : 1);
        ic += `<path class="${sinif || "g-ok-a"}" fill="none" stroke-width="2.5" d="M${a.toFixed(1)} ${y} Q${((a + b) / 2).toFixed(1)} ${(y - 2 * h).toFixed(1)} ${b.toFixed(1)} ${y}"/>`;
      }
    });
    (etiketler || [...Array(max + 1).keys()]).forEach(v => { ic += `<text class="g-yazi-k" x="${xk(v)}" y="${y + 26}" text-anchor="middle" style="paint-order:stroke;stroke:var(--sheet);stroke-width:5px">${v}</text>`; });
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
      const gorsel = GS(60 + b * 32, 50 + a * 32, kutu(14, 10, b * 32 + 20, a * 32 + 20, "g-yumusak", 10) + ic, "tepsideki kurabiyeler");
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
      const harf = ["A", "B", "C", "D"], b = 16;
      let ic = "";
      modeller.forEach((m, i) => { const x0 = 20 + (i % 2) * 300, y0 = 30 + Math.floor(i / 2) * 110; ic += Y(x0, y0 - 8, harf[i], { a: "start", b: 1 }) + kareler(x0 + 20, y0, m.p, m.q, b); });
      const hi = modeller.findIndex(m => !m.dogru);
      return S({ kaz: "carpan.model", duzey: "uygulama", zorluk: 2, gorsel: G.svg(600, 250, ic, "birim karelerden oluşan dört dikdörtgen"),
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
      return S({ kaz: "kat.problem", duzey: "transfer", zorluk: 2, gorsel: GS(sut * 44 + 60, sat * 44 + 80, ic, "yumurta kolisi"),
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
      return S({ kaz: "kat.problem", duzey: "transfer", zorluk: 3, gorsel: GS(300, 220, ic, "otobüs kalkış saatleri tablosu"),
        soru: "Bir otobüs durağındaki tabelada ilk dört seferin kalkış saatleri yazılıdır. Seferler gün boyu <b>aynı aralıkla</b> devam etmektedir.<br>Aşağıdaki saatlerden hangisinde bu duraktan bir otobüs kalkar?",
        dogru: saat(hedef), dogruNeden: `Seferler ${a * 5} dakikada birdir; ${saat(s0)} ile ${saat(hedef)} arasında ${sefer * a * 5} dakika var ve ${sefer * a * 5}, ${a * 5}${ek(a * 5, "in")} katıdır.`,
        yanlis: yan.slice(0, 3).map(t => [saat(t), "islem", `${saat(s0)} ile ${saat(t)} arasında ${t - s0} dakika var; ${t - s0}, ${a * 5}${ek(a * 5, "in")} katı olmadığı için bu saatte sefer yok.`]),
        ipucu: "Tabeladan iki sefer arasındaki dakikayı bul. Kalkış saatleri ilk saatten bu sayının katları kadar sonra olur.",
        cozum: ["🔎 Soruyu anlayalım: Tabelada ilk dört sefer var; seferler eşit aralıklarla sürüyor. Hangi saatte otobüs kalktığını bulacağız.",
          `✏️ Tabeladan aralığı bulalım: ${saat(ilk[0])} → ${saat(ilk[1])} arası ${a * 5} dakika. Diğerleri de ${a * 5}${ek(a * 5, "er")} dakika arayla.`,
          `💡 Hatırlayalım: Kalkış saatleri, ilk seferden ${a * 5}${ek(a * 5, "in")} katları kadar dakika sonradır.`,
          `✏️ Seçenekleri ilk sefere göre dakikaya çevirelim: ${saat(hedef)} → ${sefer * a * 5} dakika sonra; ${sefer * a * 5} ÷ ${a * 5} = ${sefer} ✓`,
          `✅ Sonuç: Saat ${saat(hedef)} olduğunda bir otobüs kalkar.`,
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
      return S({ kaz: "bol.rakam", duzey: "transfer", zorluk: 2, gorsel: GS(380, 225, ic, "dört haneli şifreli kilit"),
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
      return S({ kaz: "asal.ayir", duzey: "uygulama", zorluk: 2, gorsel: GS(320, 50 + satir.length * 36, ic, `${n} sayısının bölen merdiveni`),
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
      const gorsel = GS(b * bk + 40, a * bk + 40, kareler(20, 20, a, b, bk, "g-c"), `${n} birim kareden oluşan dikdörtgen`);
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
        ipucu: "İşaretli günden kaç gün sonra ikisi aynı gün kursta olur? Bu sayı iki gidiş aralığının ortak katıdır.",
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
      return S({ kaz: "obol.problem", duzey: "transfer", zorluk: 3, gorsel: GS(a * k + 100, b * k + 50, ic, `${a} m × ${b} m bahçe`),
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
      const kat = R(0, 1) === 0, E = ekok(a, b), B = ebob(a, b), k = Math.min(16, 300 / b, 180 / a);
      let ic = `<rect class="g-b g-cizgi" x="60" y="30" width="${b * k}" height="${a * k}" stroke-width="2"/>` + Y(60 + b * k / 2, 22, b + " cm", { b: 1 }) + Y(52, 30 + a * k / 2 + 5, a + " cm", { a: "end", b: 1 });
      const soru = kat ? "Şekildeki dikdörtgen kartlardan yeterince vardır. Kartlar hep aynı yönde, üst üste binmeden ve boşluk kalmadan yan yana ve alt alta dizilerek <b>bir kare</b> oluşturulacaktır.<br>Oluşturulabilecek <b>en küçük</b> karenin bir kenarı kaç santimetredir?"
        : "Şekildeki dikdörtgen biçimli kâğıt, hiç artmayacak biçimde <b>eş karelere</b> kesilecektir.<br>Kesilebilecek <b>en büyük</b> karenin bir kenarı kaç santimetredir?";
      const dogru = (kat ? E : B) + " cm";
      return S({ kaz: "obol.ayirt", duzey: "baglanti", zorluk: 3, gorsel: GS(b * k + 100, a * k + 50, ic, `${b} cm × ${a} cm dikdörtgen`), soru,
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

  /* ======================= TEMA 2: OLASILIK ======================= */
  /* Çetele çizgileri: n tane (5'li gruplar) */
  function cetele(x, y, n) {
    let ic = "";
    for (let i = 0; i < n; i++) {
      const g = Math.floor(i / 5), j = i % 5, gx = x + g * 44;
      ic += j < 4 ? cizgi(gx + j * 8, y, gx + j * 8, y + 26, "g-cizgi", 2) : cizgi(gx - 4, y + 22, gx + 28, y + 4, "g-cizgi", 2);
    }
    return ic;
  }
  SORU_EKLE("ol.tahmin",
    z => {
      const renk = karistir(["kırmızı", "mavi", "yeşil", "sarı"]).slice(0, 3), N = sec([20, 25, 30, 40]);
      let c; do { const a = R(3, N - 6), b = R(3, N - a - 3); c = [a, b, N - a - b]; } while (c[2] < 3 || new Set(c).size < 3 || c.some(v => v > 22));
      const i = R(0, 2), sor = renk[i], dogru = kesir(c[i], N);
      let ic = Y(20, 24, "Renk", { a: "start", b: 1 }) + Y(150, 24, "Çetele", { a: "start", b: 1 });
      renk.forEach((r, k) => { const y = 40 + k * 46; ic += `<circle cx="34" cy="${y + 13}" r="11" fill="${RENK[r]}" stroke="#555"/>` + Y(52, y + 18, r, { a: "start" }) + cetele(150, y, c[k]); });
      return S({ kaz: "ol.tahmin", duzey: "uygulama", zorluk: 2, gorsel: GS(420, 185, ic, "çekiliş sonuçlarının çetele tablosu"),
        soru: `Bir torbadan bakmadan bilye çekilip rengi çetele tablosuna işaretleniyor ve bilye torbaya geri atılıyor. Ece ${N} çekilişin sonucunu şekildeki gibi kaydetmiştir.<br>Bu deneye göre bir sonraki çekilişte <b>${sor}</b> bilye gelme olasılığı için en iyi tahmin hangisidir?`,
        dogru, dogruNeden: `${N} çekilişin ${c[i]} tanesinde ${sor} geldi: ${c[i]}/${N} = ${dogru}.`,
        yanlis: [[kesir(c[i], N - c[i]), "strateji", `${sor} gelen sayıyı gelmeyenlere böldün; olasılıkta paydaya bütün çekilişler (${N}) yazılır.`], [kesir(c[(i + 1) % 3], N), "dikkat", `Bu, ${renk[(i + 1) % 3]} rengin oranıdır; soru ${sor} rengi soruyor.`], ["1/3", "kavrama", "Üç renk olması olasılıkların eşit olduğu anlamına gelmez; torbadaki sayılar farklı olabilir. Tahmini deney sonuçlarından yapmalıyız."], [kesir(c[i] + 1, N), "islem", "Çetele çizgilerini yeniden say; 5'li gruplardaki çapraz çizgi de bir çekiliştir."]],
        ipucu: "Çeteleyi 5'li gruplar hâlinde say. Olasılık tahmini = istenen sonuç sayısı ÷ toplam deneme.",
        cozum: [`🔎 Soruyu anlayalım: Çetele tablosu ${N} çekilişin sonuçlarını gösteriyor. ${sor[0].toUpperCase() + sor.slice(1)} gelme olasılığını tahmin edeceğiz.`,
          "💡 Hatırlayalım: Gözleme dayalı olasılık = olayın gerçekleşme sayısı ÷ toplam deneme sayısı. Çetelede her çapraz çizgi bir grubu 5'e tamamlar.",
          "✏️ Çeteleleri sayalım: " + renk.map((r, k) => `${r} ${c[k]}`).join(", ") + `. Toplam ${c.join(" + ")} = ${N} ✓`,
          `✏️ ${sor[0].toUpperCase() + sor.slice(1)}: ${c[i]} kez. Olasılık tahmini: ${c[i]}/${N}.`,
          `✏️ Sadeleştirelim: ${c[i]}/${N} = ${dogru}.`,
          `✅ Sonuç: En iyi tahmin ${dogru}.`,
          "🔁 Kontrol edelim: Üç rengin tahminleri toplanınca 1 etmeli: " + c.map(v => v + "/" + N).join(" + ") + ` = ${N}/${N} = 1 ✓`],
        kural: "Deneysel olasılık = olayın sayısı ÷ toplam deneme; payda her zaman bütün denemelerdir." });
    },
  );

  /* Çark: renkler dizisi (eşit dilimler) */
  function cark(cx, cy, r, renkler) {
    const k = renkler.length; let ic = "";
    renkler.forEach((rk, i) => {
      const a0 = (-90 + i * 360 / k) * Math.PI / 180, a1 = (-90 + (i + 1) * 360 / k) * Math.PI / 180, am = (a0 + a1) / 2;
      ic += `<path d="M${cx} ${cy} L${(cx + r * Math.cos(a0)).toFixed(1)} ${(cy + r * Math.sin(a0)).toFixed(1)} A${r} ${r} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)} Z" fill="${RENK[rk]}" stroke="#444" stroke-width="1.5"/>`;
      ic += `<text x="${(cx + r * 0.62 * Math.cos(am)).toFixed(1)}" y="${(cy + r * 0.62 * Math.sin(am) + 4).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">${BAS[rk]}</text>`;
    });
    return ic + `<path class="g-cizgi-uc" d="M${cx - 6} ${cy - r - 12} L${cx + 6} ${cy - r - 12} L${cx} ${cy - r + 2} Z"/>`;
  }
  SORU_EKLE("ol.kavram",
    z => {
      const tur = sec(["imkansiz", "kesin", "esit"]), H = ["A", "B", "C", "D"], k = sec([4, 6, 8]);
      const say = (c, r) => c.filter(x => x === r).length;
      const uyar = c => tur === "imkansiz" ? say(c, "kırmızı") === 0 : tur === "kesin" ? say(c, "kırmızı") === k : say(c, "kırmızı") === say(c, "mavi") && say(c, "kırmızı") > 0;
      const rast = () => [...Array(k)].map(() => sec(["kırmızı", "mavi", "sarı", "yeşil"]));
      const hedef = R(0, 3), carklar = [];
      for (let i = 0; i < 4; i++) {
        let c, g = 0;
        if (i === hedef) { do { c = tur === "kesin" ? Array(k).fill("kırmızı") : rast(); g++; } while (!uyar(c) && g < 5000); }
        else { do { c = rast(); if (tur === "kesin" && R(0, 1)) c = Array(k).fill("kırmızı").map((x, j) => j === 0 ? sec(["mavi", "sarı"]) : x); g++; } while ((uyar(c) || say(c, "kırmızı") === 0 && tur !== "imkansiz") && g < 5000); }
        carklar.push(c);
      }
      let ic = ""; carklar.forEach((c, i) => { const cx = 75 + i * 140; ic += cark(cx, 95, 55, c) + Y(cx, 180, H[i] + " çarkı", { b: 1 }); });
      const ifade = { imkansiz: "kırmızı gelmesi <b>imkânsız</b>", kesin: "kırmızı gelmesi <b>kesin</b>", esit: "kırmızı ile mavinin gelme olasılığı <b>eşit</b>" }[tur];
      const ac = c => `${say(c, "kırmızı")} kırmızı, ${say(c, "mavi")} mavi dilim`;
      return S({ kaz: "ol.kavram", duzey: "aciklama", zorluk: 1, gorsel: G.svg(560, 195, ic, "dört renkli çark"),
        soru: `Şekildeki çarklar eş dilimlere ayrılmıştır (K: kırmızı, M: mavi, S: sarı, Y: yeşil). Çark çevrilince ok bir dilimin üzerinde durmaktadır.<br>Hangi çark çevrildiğinde ${ifade} olur?`,
        dogru: H[hedef] + " çarkı", dogruNeden: `${H[hedef]} çarkında ${ac(carklar[hedef])} var; ${tur === "imkansiz" ? "hiç kırmızı dilim olmadığı için kırmızı gelemez" : tur === "kesin" ? "bütün dilimler kırmızı olduğu için ok mutlaka kırmızıda durur" : "kırmızı ve mavi dilim sayıları eşit"}.`,
        yanlis: carklar.map((c, i) => [H[i] + " çarkı", "kavrama", `${H[i]} çarkında ${ac(c)} var; bu çark istenen durumu sağlamaz.`]).filter((_, i) => i !== hedef),
        ipucu: tur === "imkansiz" ? "İmkânsız olay: o renkte hiç dilim yoktur." : tur === "kesin" ? "Kesin olay: bütün dilimler o renktir." : "Eşit olasılık: iki rengin dilim sayıları aynıdır.",
        cozum: ["🔎 Soruyu anlayalım: Dört çarktan hangisinde istenen durumun olduğunu, dilimleri sayarak bulacağız.",
          "💡 Hatırlayalım: Hiç gerçekleşemeyen olay imkânsızdır (olasılık 0). Mutlaka gerçekleşen olay kesindir (olasılık 1). Dilim sayıları aynı olan renklerin gelme olasılığı eşittir.",
          "✏️ Çarkları sayalım: " + carklar.map((c, i) => `${H[i]}: ${ac(c)}`).join("; ") + ".",
          `✏️ ${tur === "imkansiz" ? "Kırmızı dilimi olmayan" : tur === "kesin" ? "Bütün dilimleri kırmızı olan" : "Kırmızı ve mavi dilim sayıları eşit olan"} çark ${H[hedef]} çarkıdır.`,
          `✅ Sonuç: ${H[hedef]} çarkı.`,
          "🔁 Kontrol edelim: Diğer çarklarda bu koşul bozuluyor; bir dilim bile fark ettirir ✓"],
        kural: "İmkânsız → hiç yok; kesin → hepsi; eşit olasılık → sayılar aynı." });
    },
  );

  /* Kavanoz içinde bilyeler */
  function kavanoz(x, kirmizi, mavi, ad, ly) {
    const top = kirmizi + mavi, sut = 4, sat = Math.ceil(top / sut);
    let ic = `<path class="g-yumusak g-cizgi" stroke-width="2" d="M${x} 40 h120 v${sat * 30 + 20} a14 14 0 0 1 -14 14 h-92 a14 14 0 0 1 -14 -14 Z" fill-opacity="0.5"/>` + kutu(x + 10, 26, 100, 16, "g-b", 4);
    const toplar = karistir(Array(kirmizi).fill("kırmızı").concat(Array(mavi).fill("mavi")));
    toplar.forEach((r, i) => { ic += `<circle cx="${x + 22 + (i % sut) * 26}" cy="${62 + Math.floor(i / sut) * 28}" r="11" fill="${RENK[r]}" stroke="#444"/>`; });
    return ic + Y(x + 60, ly, ad, { b: 1 });
  }
  SORU_EKLE("ol.yorum",
    z => {
      let r1, m1, r2, m2, g = 0;
      const tuzak = R(0, 2) > 0;
      do { r1 = R(2, 8); m1 = R(2, 10); r2 = R(1, 6); m2 = R(1, 8); g++; } while ((r1 + m1 > 16 || r2 + m2 > 16 || r1 * (r2 + m2) === r2 * (r1 + m1) || (tuzak && !(r1 > r2 && r1 * (r2 + m2) < r2 * (r1 + m1))) || (!tuzak && r1 === r2)) && g < 10000);
      const ab = R(0, 1), sol = ab ? [r2, m2] : [r1, m1], sag = ab ? [r1, m1] : [r2, m2];
      const pA = sol[0] / (sol[0] + sol[1]), pB = sag[0] / (sag[0] + sag[1]), dogru = pA > pB ? "A kavanozu" : "B kavanozu";
      const cok = sol[0] > sag[0] ? "A" : "B";
      const H = Math.max(Math.ceil((sol[0] + sol[1]) / 4), Math.ceil((sag[0] + sag[1]) / 4)) * 30 + 120;
      const ic = kavanoz(60, sol[0], sol[1], "A kavanozu", H - 14) + kavanoz(280, sag[0], sag[1], "B kavanozu", H - 14);
      const fa = `${sol[0]}/${sol[0] + sol[1]}`, fb = `${sag[0]}/${sag[0] + sag[1]}`;
      return S({ kaz: "ol.yorum", duzey: "transfer", zorluk: 3, gorsel: G.svg(460, H, ic, "kırmızı ve mavi bilyeli iki kavanoz"),
        soru: "Şekildeki kavanozlarda yalnızca kırmızı ve mavi bilyeler vardır. Defne, bakmadan bir bilye çektiğinde <b>kırmızı</b> gelmesini istiyor.<br>Defne kırmızı bilye çekme olasılığı <b>daha yüksek</b> olan kavanozu seçmek için hangisinden çekmelidir?",
        dogru, dogruNeden: `A'da olasılık ${fa}, B'de ${fb}; ${pA > pB ? fa + " > " + fb : fb + " > " + fa}.`,
        yanlis: [[dogru === "A kavanozu" ? "B kavanozu" : "A kavanozu", cok !== dogru[0] ? "strateji" : "islem", cok !== dogru[0] ? `${cok} kavanozunda kırmızı bilye sayısı daha fazla ama toplam bilye de çok; olasılık kırmızı sayısının toplama oranıdır.` : "Oranları yeniden karşılaştır; kırmızıların toplam bilyeye oranına bak."], ["İki kavanozda eşittir.", "islem", `Oranlar eşit değil: ${fa} ve ${fb}.`], ["Kırmızı bilyeler sayılmadan karar verilemez.", "kavrama", "Şekilde bütün bilyeler görünüyor; sayıp oranları karşılaştırarak karar verebiliriz."]],
        ipucu: "Her kavanoz için: kırmızı bilye sayısı ÷ toplam bilye sayısı. Sonra kesirleri karşılaştır.",
        cozum: ["🔎 Soruyu anlayalım: İki kavanozdan hangisinde kırmızı çekme olasılığının daha büyük olduğunu bulacağız.",
          "💡 Hatırlayalım: Olasılık = istenen sonuç sayısı ÷ tüm sonuç sayısı. Kırmızı bilyenin fazla olması tek başına yetmez; toplam bilye sayısı da önemlidir.",
          `✏️ A kavanozu: ${sol[0]} kırmızı, ${sol[1]} mavi → olasılık ${fa}.`,
          `✏️ B kavanozu: ${sag[0]} kırmızı, ${sag[1]} mavi → olasılık ${fb}.`,
          `✏️ Karşılaştıralım (çapraz çarpım): ${sol[0]} × ${sag[0] + sag[1]} = ${sol[0] * (sag[0] + sag[1])} ve ${sag[0]} × ${sol[0] + sol[1]} = ${sag[0] * (sol[0] + sol[1])}. Büyük olan ${pA > pB ? "A" : "B"}.`,
          `✅ Sonuç: Defne ${dogru}ndan çekmelidir.`,
          `🔁 Kontrol edelim: Ondalık olarak A ≈ ${od(Math.round(pA * 100) / 100)}, B ≈ ${od(Math.round(pB * 100) / 100)} ✓`],
        kural: "Olasılıkları karşılaştırırken sayıları değil, oranları (kesirleri) karşılaştır." });
    },
  );

  /* ======================= TEMA 3: ONDALIK GÖSTERİM, KESİR, PROBLEMLER, UZUNLUK ======================= */
  const BASAD = ["Onlar", "Birler", "Onda birler", "Yüzde birler", "Binde birler"];
  function abakus(rk) {
    let ic = cizgi(30, 222, 520, 222, "g-cizgi", 4);
    rk.forEach((d, i) => {
      const x = 70 + i * 100 + (i >= 2 ? 10 : 0);
      ic += cizgi(x, 40, x, 222, "g-cizgi", 3);
      for (let j = 0; j < d; j++) ic += `<ellipse class="${i < 2 ? "g-a" : "g-b"} g-cizgi" cx="${x}" cy="${212 - j * 17}" rx="18" ry="8" stroke-width="1"/>`;
      const s = BASAD[i].split(" "); ic += Y(x, 242, s[0], { k: 1 }) + (s[1] ? Y(x, 257, s[1], { k: 1 }) : "");
    });
    ic += `<circle class="g-d" cx="225" cy="215" r="6"/>` + Y(225, 200, "virgül", { k: 1 });
    return G.svg(540, 265, ic, "ondalık abaküs");
  }
  const sayiStr = rk => `${rk[0] ? rk[0] : ""}${rk[1]},${rk[2]}${rk[3]}${rk[4]}`;

  SORU_EKLE("bas.deger",
    z => {
      const rk = [R(1, 9), R(0, 9), R(1, 9), R(1, 9), R(1, 9)], i = R(2, 4), d = rk[i];
      const deger = od(d / Math.pow(10, i - 1));
      return S({ kaz: "bas.deger", duzey: "uygulama", zorluk: 2, gorsel: abakus(rk),
        soru: `Şekildeki abaküste bir ondalık gösterim modellenmiştir (kırmızı nokta virgülün yerini gösterir).<br>Bu sayının <b>${BASAD[i].toLocaleLowerCase("tr-TR")}</b> basamağındaki rakamın <b>basamak değeri</b> kaçtır?`,
        dogru: deger, dogruNeden: `${BASAD[i]} çubuğunda ${d} boncuk var; basamak değeri ${d} × ${od(1 / Math.pow(10, i - 1))} = ${deger}.`,
        yanlis: [[d, "kavrama", `${d}, o basamaktaki rakamdır (sayı değeri); basamak değeri, rakamın bulunduğu basamakla çarpılmasıyla bulunur.`], [od(d / Math.pow(10, i === 2 ? 2 : i - 2)), "dikkat", "Basamağı bir kaydırmışsın; virgülden sonraki 1. basamak onda birler, 2. yüzde birler, 3. binde birlerdir."], [od(d / Math.pow(10, i === 4 ? 2 : i)), "dikkat", "Basamağı bir kaydırmışsın; çubukların altındaki adları kontrol et."], [od(d * 10), "kavrama", "Virgülün sağındaki basamakların değeri 1'den küçüktür."]],
        ipucu: "Önce istenen basamağın çubuğundaki boncukları say, sonra o basamağın değeriyle çarp.",
        cozum: [`🔎 Soruyu anlayalım: Abaküsteki sayının ${BASAD[i].toLocaleLowerCase("tr-TR")} basamağındaki rakamın basamak değerini bulacağız.`,
          "💡 Hatırlayalım: Virgülden sonraki basamaklar: onda birler (0,1), yüzde birler (0,01), binde birler (0,001). Basamak değeri = rakam × basamağın değeri.",
          `✏️ Çubukları okuyalım: ${rk.map((v, j) => BASAD[j] + " " + v).join(", ")}. Sayı ${sayiStr(rk)}.`,
          `✏️ ${BASAD[i]} çubuğunda ${d} boncuk var → rakam ${d}.`,
          `✏️ Basamak değeri: ${d} × ${od(1 / Math.pow(10, i - 1))} = ${deger}.`,
          `✅ Sonuç: ${deger}.`,
          `🔁 Kontrol edelim: ${sayiStr(rk)} sayısının çözümlemesinde ${deger} terimi yer alır ✓`],
        kural: "Basamak değeri = rakam × basamağın değeri (onda birler 0,1; yüzde birler 0,01; binde birler 0,001)." });
    },
  );

  SORU_EKLE("bas.cozumle",
    z => {
      const rk = [R(0, 3), R(1, 9), R(1, 9), R(1, 9), R(1, 9)]; rk[sec([2, 3])] = 0;
      const dogru = sayiStr(rk);
      const sifirsiz = `${rk[0] || ""}${rk[1]},${rk.slice(2).filter(x => x).join("")}`;
      return S({ kaz: "bas.cozumle", duzey: "uygulama", zorluk: 2, gorsel: abakus(rk),
        soru: "Şekildeki abaküste her boncuk, bulunduğu çubuğun basamağında 1 birimi gösterir (kırmızı nokta virgüldür).<br>Abaküste modellenen sayı hangisidir?",
        dogru, dogruNeden: `Çubuklar soldan sağa ${rk.join(", ")} boncuk gösteriyor; boş çubuk 0 demektir: ${dogru}.`,
        yanlis: [[sifirsiz, "dikkat", "Boş çubuğu atlamışsın; boncuk olmayan basamağa 0 yazılır."], [`${rk[0] || ""}${rk[1]}${rk[2]},${rk[3]}${rk[4]}`, "kavrama", "Virgülü yanlış yere koymuşsun; virgül birler ile onda birler arasındadır."], [`${rk[0] || ""}${rk[1]},${rk[4]}${rk[3]}${rk[2]}`, "dikkat", "Ondalık basamakları ters sırada yazmışsın; virgülden sonra önce onda birler gelir."], [`${rk[1]},${rk[2]}${rk[3]}${rk[4]}`, "dikkat", "Onlar basamağını atlamışsın."]],
        ipucu: "Her çubuktaki boncukları say; boş çubuk için 0 yaz.",
        cozum: ["🔎 Soruyu anlayalım: Abaküsün çubuklarındaki boncuklardan sayıyı yazacağız.",
          "💡 Hatırlayalım: Basamaklar soldan sağa: onlar, birler, (virgül), onda birler, yüzde birler, binde birler. Boş çubuk o basamakta 0 olduğunu gösterir.",
          `✏️ Boncukları sayalım: ${rk.map((v, j) => BASAD[j] + " " + v).join(", ")}.`,
          `✏️ Çözümleyelim: ${rk[0] ? rk[0] + " × 10 + " : ""}${rk[1]} × 1 + ${rk[2]} × 0,1 + ${rk[3]} × 0,01 + ${rk[4]} × 0,001.`,
          `✅ Sonuç: Sayı ${dogru}.`,
          `🔁 Kontrol edelim: ${dogru} sayısında virgülden sonra ${rk.slice(2).join(", ")} rakamları sırasıyla onda birler, yüzde birler, binde birler basamağında ✓`],
        kural: "Boş basamağa 0 yazmayı unutma; 3,05 ile 3,5 farklı sayılardır." });
    },
  );

  SORU_EKLE("bas.ad",
    z => {
      const AD = ["Yüzler", "Onlar", "Birler", "Onda birler", "Yüzde birler", "Binde birler"];
      const rk = [R(1, 9), R(0, 9), R(0, 9), R(0, 9), R(0, 9), R(0, 9)], i = sec([0, 1, 3, 4, 5]);
      let ic = "";
      AD.forEach((a, j) => {
        const x = 15 + j * 90 + (j >= 3 ? 20 : 0);
        ic += `<rect class="${j === i ? "g-b" : "g-yumusak"} g-cizgi" x="${x}" y="15" width="90" height="46" stroke-width="1.5"/>`;
        const s = a.split(" "); ic += j === i ? Y(x + 45, 44, "?", { b: 1 }) : Y(x + 45, s[1] ? 34 : 43, s[0], { k: 1 }) + (s[1] ? Y(x + 45, 50, s[1], { k: 1 }) : "");
        ic += `<rect class="${j === i ? "g-b" : "g-bos"} g-cizgi" x="${x}" y="61" width="90" height="46" stroke-width="1.5"/>` + Y(x + 45, 91, rk[j], { b: 1 });
      });
      ic += `<circle class="g-d" cx="${15 + 270 + 10}" cy="98" r="5"/>`;
      const sayi = `${rk.slice(0, 3).join("")},${rk.slice(3).join("")}`;
      const hed = AD[i].toLocaleLowerCase("tr-TR");
      const yak = [AD[i - 1], AD[i + 1], AD[5 - i], AD[(i + 3) % 6]].filter(a => a && a !== AD[i]);
      return S({ kaz: "bas.ad", duzey: "hatirlama", zorluk: 1, gorsel: G.svg(590, 120, ic, "basamak tablosu"),
        soru: `Şekildeki basamak tablosunda ${sayi} sayısı gösterilmiştir. Sarı sütunun başlığı silinmiştir.<br>Sarı sütundaki basamağın adı nedir?`,
        dogru: AD[i] + " basamağı", dogruNeden: `Sarı sütun virgülün ${i < 3 ? "solunda, sağdan " + (3 - i) + "." : "sağında " + (i - 2) + "."} basamaktır: ${hed}.`,
        yanlis: [...new Set(yak)].map(a => [a + " basamağı", i >= 3 && AD.indexOf(a) < 3 || i < 3 && AD.indexOf(a) >= 3 ? "kavrama" : "dikkat", i >= 3 && AD.indexOf(a) < 3 || i < 3 && AD.indexOf(a) >= 3 ? "Virgülün hangi tarafında olduğuna dikkat et; virgülün sağındakiler “onda, yüzde, binde birler”dir." : "Basamağı bir kaydırmışsın; virgülden itibaren sayarak ilerle."]),
        ipucu: "Virgülün yerini bul ve virgülden başlayarak basamakları say.",
        cozum: [`🔎 Soruyu anlayalım: Tabloda ${sayi} sayısı var; sarı sütunun basamak adını bulacağız.`,
          "💡 Hatırlayalım: Virgülün solunda sağdan sola birler, onlar, yüzler; virgülün sağında soldan sağa onda birler, yüzde birler, binde birler basamakları vardır.",
          `✏️ Kırmızı nokta (virgül), birler ile onda birler arasındadır.`,
          `✏️ Sarı sütun virgülün ${i < 3 ? "solunda, virgülden itibaren " + (3 - i) + ". basamak" : "sağında, virgülden itibaren " + (i - 2) + ". basamak"}tır.`,
          `✅ Sonuç: ${AD[i]} basamağı; bu basamaktaki rakam ${rk[i]}.`,
          `🔁 Kontrol edelim: ${rk[i]} rakamının basamak değeri ${od(rk[i] * Math.pow(10, 2 - i))}${rk[i] ? "" : " (rakam 0 olduğu için değer de 0)"}; bu da ${hed} basamağına uyar ✓`],
        kural: "Virgülün sağı: onda birler, yüzde birler, binde birler; solu: birler, onlar, yüzler." });
    },
  );

  SORU_EKLE("yuv.kural",
    z => {
      let t; do { t = R(1001, 9999); } while (t % 10 === 0 || t % 100 === 50 || t % 1000 === 500);
      const tur = R(0, 2), ad = ["en yakın tam sayıya", "onda birler basamağına", "yüzde birler basamağına"][tur];
      const bol = [1000, 100, 10][tur], kat = [1, 10, 100][tur];
      const fx = (v, k) => (v / k).toFixed(String(k).length - 1).replace(".", ","), yuv = (x, b, k) => fx(Math.round(x / b), k), kes = (x, b, k) => fx(Math.floor(x / b), k);
      const deger = od(t / 1000), dogru = yuv(t, bol, kat) + " kg";
      const urun = sec(["🍎 elmanın", "🍅 domatesin", "🧀 peynirin", "🍇 üzümün"]);
      let ic = `<path class="g-yumusak g-cizgi" stroke-width="2" d="M60 70 h260 l-20 110 h-220 Z"/>` + kutu(110, 120, 160, 46, "g-bos", 6) + `<text x="190" y="152" text-anchor="middle" font-size="24" font-family="monospace" font-weight="700" class="g-yazi">${deger} kg</text>`;
      ic += `<ellipse class="g-bos g-cizgi" cx="190" cy="62" rx="120" ry="14" stroke-width="2"/>` + `<text x="190" y="52" text-anchor="middle" font-size="28">${urun.split(" ")[0]}</text>`;
      const yanl = [[kes(t, bol, kat) + " kg", "kavrama", "Yalnızca sağdaki basamakları silmişsin; sağdaki ilk rakam 5 ya da daha büyükse yuvarlanan basamak 1 artırılır."], [yuv(t, [100, 10, 1000][tur], [10, 100, 1][tur]) + " kg", "dikkat", "Başka bir basamağa yuvarlamışsın; soru " + ad + " yuvarlamayı istiyor."], [fx(Math.round(t / bol) + (Math.round(t / bol) * bol > t ? -1 : 1), kat) + " kg", "islem", "Yuvarlama yönünü ters seçmişsin; sağdaki rakama yeniden bak."], [od(t / 1000 + 1 / kat) + " kg", "islem", "Sağdaki basamakları atmayı unutmuşsun."]];
      const sag = String(t % bol).padStart(String(bol).length - 1, "0")[0];
      return S({ kaz: "yuv.kural", duzey: "uygulama", zorluk: 2, gorsel: GS(380, 200, ic, "dijital mutfak terazisi"),
        soru: `Manavdaki dijital terazi, tartılan ${urun.split(" ")[1]} kütlesini şekildeki gibi göstermektedir.<br>Bu değer <b>${ad}</b> yuvarlanırsa kaç kilogram olur?`,
        dogru, dogruNeden: `Yuvarlanan basamağın sağındaki rakam ${sag}; ${+sag >= 5 ? "5 ya da daha büyük olduğu için yuvarlanan basamak 1 artar" : "5'ten küçük olduğu için yuvarlanan basamak aynı kalır"}.`,
        yanlis: yanl,
        ipucu: "Yuvarlanacak basamağın hemen sağındaki rakama bak: 5 ya da daha büyükse yukarı, küçükse aşağı yuvarla.",
        cozum: [`🔎 Soruyu anlayalım: Terazide ${deger} kg yazıyor. Bu sayıyı ${ad} yuvarlayacağız.`,
          "💡 Hatırlayalım: Yuvarlanacak basamağın sağındaki ilk rakam 0, 1, 2, 3, 4 ise o basamak aynı kalır; 5, 6, 7, 8, 9 ise 1 artırılır. Sağdaki basamaklar atılır.",
          `✏️ ${deger} sayısında ${["birler", "onda birler", "yüzde birler"][tur]} basamağı ${String(t).padStart(4, "0")[tur]}, sağındaki rakam ${sag}.`,
          `✏️ ${sag} ${+sag >= 5 ? "≥ 5 → yukarı yuvarlarız" : "< 5 → aşağı yuvarlarız"}.`,
          `✅ Sonuç: ${dogru}.`,
          `🔁 Kontrol edelim: Yuvarlanmış değer ile gerçek değer arasındaki fark, yuvarlanan basamağın yarım biriminden küçük olmalı: |${deger} − ${yuv(t, bol, kat)}| = ${od(Math.abs(t / 1000 - Math.round(t / bol) / kat))} ✓`],
        kural: "Sağdaki rakam 5 veya büyükse yukarı, küçükse aşağı yuvarla." });
    },
  );

  SORU_EKLE("yuv.tahmin",
    z => {
      const AD = karistir(["Süt", "Ekmek", "Peynir", "Yumurta", "Zeytin", "Domates", "Makarna", "Pirinç"]).slice(0, sec([3, 4]));
      const fiy = AD.map(() => { let k; do { k = R(500, 9999); } while (k % 100 === 50); return k; });
      const yuvar = fiy.map(k => Math.round(k / 100)), kes = fiy.map(k => Math.floor(k / 100)), top = fiy.reduce((a, b) => a + b, 0);
      const t = yuvar.reduce((a, b) => a + b, 0), tk = kes.reduce((a, b) => a + b, 0);
      const fyaz = k => `${Math.floor(k / 100)},${String(k % 100).padStart(2, "0")}`;
      let ic = `<path class="g-bos g-cizgi" stroke-width="2" d="M30 10 h260 v${AD.length * 30 + 85} l-13 10 l-13 -10 l-13 10 l-13 -10 l-13 10 l-13 -10 l-13 10 l-13 -10 l-13 10 l-13 -10 l-13 10 l-13 -10 l-13 10 l-13 -10 l-13 10 l-13 -10 l-13 10 l-13 -10 l-13 10 l-13 -10 l-13 10 Z"/>` + Y(160, 36, "MARKET FİŞİ", { b: 1 });
      AD.forEach((a, i) => { ic += Y(50, 70 + i * 30, a, { a: "start" }) + Y(270, 70 + i * 30, fyaz(fiy[i]) + " TL", { a: "end" }); });
      ic += `<line class="g-ince" x1="45" y1="${55 + AD.length * 30}" x2="275" y2="${55 + AD.length * 30}" stroke-dasharray="4 3"/>` + Y(50, 78 + AD.length * 30, "TOPLAM", { a: "start", b: 1 }) + Y(270, 78 + AD.length * 30, "?", { a: "end", b: 1 });
      return S({ kaz: "yuv.tahmin", duzey: "transfer", zorluk: 2, gorsel: GS(320, AD.length * 30 + 115, ic, "market fişi"),
        soru: "Ali, market fişindeki toplam tutarı zihinden tahmin etmek için her ürünün fiyatını <b>en yakın tam liraya</b> yuvarlayıp topluyor.<br>Ali'nin bulduğu tahmini toplam kaç liradır?",
        dogru: t + " TL", dogruNeden: `Yuvarlanmış fiyatlar ${yuvar.join(" + ")} = ${t} TL.`,
        yanlis: [[tk === t ? t + 1 + " TL" : tk + " TL", tk === t ? "islem" : "kavrama", tk === t ? "Toplamayı yeniden kontrol et." : "Kuruşları yalnızca silmişsin; 50 kuruş ve üstü olan fiyatlar bir üst liraya yuvarlanır."], [fyaz(top) + " TL", "strateji", "Bu, gerçek toplamdır; soru yuvarlayarak yapılan tahmini istiyor."], [Math.round(top / 1000) * 10 + " TL", "dikkat", "Toplamı onluğa yuvarlamışsın; soru her fiyatı en yakın tam liraya yuvarlamayı istiyor."], [t - 1 + " TL", "islem", "Toplamayı yeniden kontrol et."]],
        ipucu: "Her fiyatta kuruşa bak: 50 ya da üstüyse lirayı 1 artır, altındaysa kuruşu at.",
        cozum: ["🔎 Soruyu anlayalım: Fişteki fiyatları en yakın tam liraya yuvarlayıp toplayarak tahmini toplamı bulacağız.",
          "💡 Hatırlayalım: En yakın tam sayıya yuvarlarken onda birler basamağına bakılır: 5 ve üstü → yukarı, 5'ten küçük → aşağı.",
          "✏️ Fiyatları yuvarlayalım: " + AD.map((a, i) => `${fyaz(fiy[i])} → ${yuvar[i]}`).join("; ") + ".",
          `✏️ Toplayalım: ${yuvar.join(" + ")} = ${t}.`,
          `✅ Sonuç: Tahmini toplam ${t} TL.`,
          `🔁 Kontrol edelim: Gerçek toplam ${fyaz(top)} TL; tahminimiz buna çok yakın ✓ Tahmin, kasada ödenecek parayı hızlıca kontrol etmeye yarar.`],
        kural: "Tahmin yaparken her sayıyı önce yuvarla, sonra işlemi yap." });
    },
  );

  /* Pizzalar ve çocuklar */
  function pizzaCocuk(a, b) {
    let ic = "";
    for (let i = 0; i < a; i++) { const cx = 50 + i * 80; ic += `<circle class="g-b g-cizgi" cx="${cx}" cy="50" r="32" stroke-width="2"/><circle class="g-d" cx="${cx - 10}" cy="40" r="5"/><circle class="g-d" cx="${cx + 12}" cy="48" r="5"/><circle class="g-d" cx="${cx - 2}" cy="64" r="5"/><circle class="g-c" cx="${cx + 8}" cy="34" r="3"/>`; }
    for (let i = 0; i < b; i++) { const cx = 40 + i * 56; ic += `<circle class="g-yumusak g-cizgi" cx="${cx}" cy="125" r="13" stroke-width="1.5"/><rect class="g-a" x="${cx - 13}" y="141" width="26" height="30" rx="8"/>`; }
    return GS(Math.max(a * 80 + 20, b * 56 + 20), 185, ic, `${a} pizza ve ${b} çocuk`);
  }
  SORU_EKLE("kb.iliski",
    z => {
      let a, b; do { a = R(2, 5); b = R(2, 8); } while (a === b || ebob(a, b) !== 1);
      return S({ kaz: "kb.iliski", duzey: "aciklama", zorluk: 1, gorsel: pizzaCocuk(a, b),
        soru: "Şekildeki pizzaların tamamı, şekildeki çocuklar arasında <b>eşit</b> olarak paylaştırılacaktır.<br>Bir çocuğa düşen pizza miktarını gösteren bölme işlemi ve kesir hangisidir?",
        dogru: `${a} ÷ ${b} = ${a}/${b}`, dogruNeden: `${a} pizza ${b} çocuğa bölünür: ${a} ÷ ${b} = ${a}/${b}${a > b ? " (1'den büyük)" : ""}.`,
        yanlis: [[`${b} ÷ ${a} = ${b}/${a}`, "kavrama", "Bölünen paylaştırılan pizzadır, bölen çocuk sayısıdır; ikisini yer değiştirmişsin."], [`1 ÷ ${b} = 1/${b}`, "dikkat", `Yalnızca bir pizzayı paylaştırmışsın; şekilde ${a} pizza var.`], [`${a} ÷ ${b} = ${b}/${a}`, "kavrama", "Kesir çizgisi bölme işaretidir: bölünen paya, bölen paydaya yazılır."], [`${a} × ${b} = ${a * b}`, "kavrama", "Paylaştırma bir bölme işlemidir, çarpma değil."]],
        ipucu: "Pizza sayısı ÷ çocuk sayısı. Kesirde pay = bölünen, payda = bölen.",
        cozum: ["🔎 Soruyu anlayalım: Şekildeki pizzalar şekildeki çocuklara eşit bölünecek.",
          `✏️ Şekilden sayalım: ${a} pizza, ${b} çocuk var.`,
          "💡 Hatırlayalım: Eşit paylaştırma bir bölmedir. a ÷ b işleminin sonucu a/b kesriyle gösterilir: bölünen paya, bölen paydaya yazılır.",
          `✏️ Paylaşılan ${a} pizza, paylaşan ${b} çocuk → ${a} ÷ ${b}.`,
          `✅ Sonuç: Bir çocuğa ${a} ÷ ${b} = ${a}/${b} pizza düşer.`,
          `🔁 Kontrol edelim: ${b} çocuğun payları toplanırsa ${b} × ${a}/${b} = ${a} pizza eder ✓`],
        kural: "a ÷ b = a/b: bölünen paya, bölen paydaya yazılır." });
    },
  );

  SORU_EKLE("kb.ondalik",
    z => {
      const q = sec([2, 4, 5, 10, 20, 25]), p = R(1, q - 1), dogru = od(p / q);
      return S({ kaz: "kb.ondalik", duzey: "uygulama", zorluk: 2, gorsel: G.kesirSeridi(p, q),
        soru: "Şekildeki şerit eş parçalara ayrılmış ve bazı parçaları sarıya boyanmıştır.<br>Boyalı kısmın şeridin tamamına oranını gösteren <b>ondalık gösterim</b> hangisidir?",
        dogru, dogruNeden: `${q} parçanın ${p} tanesi boyalı: ${p}/${q} = ${p * (100 / q)}/100 = ${dogru}.`,
        yanlis: [[`0,${p}`, "kavrama", `Payı doğrudan virgülden sonra yazmışsın; bu ancak payda 10 ise doğru olur. Önce paydayı 10, 100 yap.`], [`${p},${q}`, "kavrama", "Kesir çizgisi virgül değildir; pay ve paydayı virgülle birleştiremeyiz."], [od((q - p) / q), "dikkat", "Boyanmamış kısmı yazmışsın; soru boyalı kısmı soruyor."], [od(p / q + 0.1), "islem", "Genişletmeyi yeniden kontrol et."]],
        ipucu: "Boyalı parçaları ve toplam parçaları say; kesri paydası 10 ya da 100 olacak biçimde genişlet.",
        cozum: ["🔎 Soruyu anlayalım: Şeridin boyalı kısmını önce kesir, sonra ondalık gösterim olarak yazacağız.",
          `✏️ Şekilden sayalım: Şerit ${q} eş parçaya bölünmüş, ${p} parça boyalı → ${p}/${q}.`,
          "💡 Hatırlayalım: Kesri ondalık gösterime çevirmek için paydayı 10, 100 ya da 1000 yapacak biçimde genişletiriz (ya da payı paydaya böleriz).",
          `✏️ ${q} × ${100 / q} = 100 olduğundan pay ve paydayı ${100 / q} ile çarparız: ${p}/${q} = ${p * 100 / q}/100.`,
          `✏️ ${p * 100 / q}/100 = ${dogru}.`,
          `✅ Sonuç: ${dogru}.`,
          `🔁 Kontrol edelim: ${p} ÷ ${q} bölme işlemini yaparsak da ${dogru} buluruz ✓`],
        kural: "Kesri ondalığa çevir: paydayı 10, 100, 1000 yap ya da payı paydaya böl." });
    },
  );

  SORU_EKLE("kb.paylasim",
    z => {
      let a, b; do { a = R(2, 5); b = R(a + 1, 8); } while (ebob(a, b) !== 1);
      let ic = "";
      for (let i = 0; i < a; i++) { const x = 30 + i * 60; ic += `<path class="g-yumusak g-cizgi" stroke-width="2" d="M${x + 12} 20 h16 v14 l12 16 v80 a6 6 0 0 1 -6 6 h-44 a6 6 0 0 1 -6 -6 v-80 l12 -16 Z" transform="translate(6 0)"/>` + Y(x + 26, 100, "1 L", { b: 1 }); }
      for (let i = 0; i < b; i++) { const x = 30 + i * 52; ic += `<path class="g-bos g-cizgi" stroke-width="2" d="M${x} 160 l6 60 h28 l6 -60 Z"/>`; }
      return S({ kaz: "kb.paylasim", duzey: "transfer", zorluk: 2, gorsel: GS(Math.max(a * 60 + 50, b * 52 + 40), 235, ic, `${a} şişe ayran ve ${b} bardak`),
        soru: "Şekildeki 1 litrelik şişelerin hepsindeki ayran, şekildeki bardaklara <b>eşit</b> olarak boşaltılacaktır.<br>Bir bardağa kaç litre ayran düşer?",
        dogru: `${a}/${b} L`, dogruNeden: `${a} L ayran ${b} bardağa bölünür: ${a} ÷ ${b} = ${a}/${b} L.`,
        yanlis: [[`${b}/${a} L`, "kavrama", "Bölünen ayran miktarı (paya), bölen bardak sayısı (paydaya) yazılır; tersini yazmışsın."], [`1/${b} L`, "dikkat", `Yalnızca bir şişeyi paylaştırmışsın; şekilde ${a} şişe var.`], [`${a}/${a + b} L`, "kavrama", "Şişe ve bardak sayılarını toplamak gerekmez; ayran bardak sayısına bölünür."]],
        ipucu: "Toplam ayran (litre) ÷ bardak sayısı.",
        cozum: ["🔎 Soruyu anlayalım: Şişelerdeki ayranın tamamı bardaklara eşit dağıtılacak; bir bardaktaki miktarı bulacağız.",
          `✏️ Şekilden sayalım: ${a} şişe × 1 L = ${a} L ayran; ${b} bardak.`,
          "💡 Hatırlayalım: Eşit paylaştırma bölmedir ve a ÷ b = a/b biçiminde kesirle yazılabilir.",
          `✏️ ${a} ÷ ${b} = ${a}/${b}.`,
          `✅ Sonuç: Bir bardağa ${a}/${b} L ayran düşer.`,
          `🔁 Kontrol edelim: ${b} bardak × ${a}/${b} L = ${a} L; şişelerdeki ayranın hepsi ✓`],
        kural: "Paylaştırmada: toplam miktar ÷ kişi (kap) sayısı = toplam/sayı." });
    },
  );

  /* Para çizimi: kağıt paralar ve madeni paralar (kuruş) */
  const fyaz = k => `${Math.floor(k / 100)},${String(k % 100).padStart(2, "0")} TL`;
  function paralar(kagit, madeni) {
    let ic = "", x = 15;
    kagit.forEach((v, i) => { const y = 15 + (i % 2) * 10; ic += `<rect class="g-c g-cizgi" x="${x}" y="${y}" width="100" height="52" rx="5" stroke-width="1.5" fill-opacity="0.45"/>` + `<circle class="g-bos g-cizgi" cx="${x + 26}" cy="${y + 26}" r="13" stroke-width="1"/>` + Y(x + 70, y + 32, v + " TL", { b: 1 }); x += 110; });
    madeni.forEach((v, i) => { const cx = 40 + i * 54; ic += `<circle class="g-b g-cizgi" cx="${cx}" cy="120" r="23" stroke-width="2"/>` + Y(cx, 125, v >= 100 ? v / 100 + " TL" : v + " kr", { k: 1, b: 1 }); });
    return GS(Math.max(x + 10, madeni.length * 54 + 30), 155, ic, "cüzdandaki paralar");
  }
  SORU_EKLE("pr.para",
    z => {
      const kagit = karistir([200, 100, 50, 20, 10, 5]).slice(0, R(2, 3)).sort((a, b) => b - a), madeni = Array.from({ length: R(3, 5) }, () => sec([100, 100, 50, 25, 10])).sort((a, b) => b - a);
      const top = kagit.reduce((a, b) => a + b, 0) * 100 + madeni.reduce((a, b) => a + b, 0);
      let fiyat; do { fiyat = R(Math.floor(top * 0.4), top - 100); } while (fiyat % 5);
      const kalan = top - fiyat, madT = madeni.reduce((a, b) => a + b, 0);
      return S({ kaz: "pr.para", duzey: "transfer", zorluk: 2, gorsel: paralar(kagit, madeni),
        soru: `Duru'nun cüzdanındaki paraların tamamı şekilde gösterilmiştir. Duru, fiyatı <b>${fyaz(fiyat)}</b> olan bir kitap alıyor.<br>Kitabı aldıktan sonra Duru'nun kaç lirası kalır?`,
        dogru: fyaz(kalan), dogruNeden: `Cüzdanda ${fyaz(top)} var; ${fyaz(top)} − ${fyaz(fiyat)} = ${fyaz(kalan)}.`,
        yanlis: [[fyaz(top), "dikkat", "Bu, cüzdandaki toplam paradır; kitabın fiyatını çıkarmayı unuttun."], [fyaz(kalan - madT + Math.round(madT / 100) * 100 === kalan ? kalan + 50 : kalan - madT + madeni.length * 100), "kavrama", "Madeni paraların hepsini 1 TL saymışsın; kuruşlu paraları ayrı topla (100 kuruş = 1 TL)."], [fyaz(kalan + 100), "islem", "Çıkarmada onluk bozarken hata yapmışsın; kuruşları ve liraları ayrı ayrı kontrol et."], [fyaz(Math.max(5, kalan - 100)), "islem", "Çıkarmayı yeniden kontrol et."]],
        ipucu: "Önce kâğıt paraları, sonra madeni paraları topla (100 kr = 1 TL). Sonra fiyatı çıkar.",
        cozum: ["🔎 Soruyu anlayalım: Cüzdandaki paraları sayıp kitap fiyatını çıkaracağız.",
          "💡 Hatırlayalım: 1 TL = 100 kuruş. Ondalık gösterimde virgülden sonraki iki basamak kuruşu gösterir.",
          `✏️ Kâğıt paralar: ${kagit.join(" + ")} = ${kagit.reduce((a, b) => a + b, 0)} TL.`,
          `✏️ Madeni paralar: ${madeni.map(v => v >= 100 ? "1 TL" : v + " kr").join(" + ")} = ${fyaz(madT)}. Toplam para: ${fyaz(top)}.`,
          `✏️ Kitabı alınca: ${fyaz(top)} − ${fyaz(fiyat)} = ${fyaz(kalan)}.`,
          `✅ Sonuç: Duru'nun ${fyaz(kalan)} parası kalır.`,
          `🔁 Kontrol edelim: Kalan ile fiyatı toplarsak ${fyaz(kalan)} + ${fyaz(fiyat)} = ${fyaz(top)} ✓`],
        kural: "Para problemlerinde lira ve kuruşları alt alta, virgüller hizalı yazarak işlem yap." });
    },
  );

  SORU_EKLE("pr.kesir",
    z => {
      const q = sec([4, 5, 6, 8, 10]), p = R(1, q - 1), C = q * sec([20, 25, 30, 40, 50, 60]), bos = R(0, 1) === 1;
      const h = 220, w = 150, x0 = 90, y0 = 20, birim = C / q;
      let ic = `<rect class="g-a" x="${x0}" y="${y0 + h * (q - p) / q}" width="${w}" height="${h * p / q}" fill-opacity="0.55"/>` + `<rect class="g-cizgi" x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke-width="3"/>`;
      for (let i = 1; i < q; i++) ic += `<line class="g-cizgi" x1="${x0}" y1="${y0 + h * i / q}" x2="${x0 + 18}" y2="${y0 + h * i / q}" stroke-width="2"/>`;
      ic += Y(x0 + w + 12, y0 + 16, `Kapasite: ${C} L`, { a: "start", b: 1 }) + Y(x0 + w + 12, y0 + 40, "(çizgiler eş aralıklı)", { a: "start", k: 1 });
      const dogru = (bos ? birim * (q - p) : birim * p) + " L";
      return S({ kaz: "pr.kesir", duzey: "transfer", zorluk: 2, gorsel: GS(420, 260, ic, "yarısı dolu su deposu"),
        soru: `Şekildeki su deposunun yan yüzündeki çizgiler depoyu eş bölmelere ayırmaktadır; mavi kısım depodaki suyu gösterir.<br>${bos ? "Depoyu tamamen doldurmak için <b>kaç litre daha</b> su gerekir?" : "Depoda <b>kaç litre</b> su vardır?"}`,
        dogru, dogruNeden: `Depo ${q} eş bölme, bir bölme ${C} ÷ ${q} = ${birim} L. ${bos ? `Boş ${q - p} bölme × ${birim} = ${birim * (q - p)} L.` : `Dolu ${p} bölme × ${birim} = ${birim * p} L.`}`,
        yanlis: [[(bos ? birim * p : birim * (q - p)) + " L", "dikkat", bos ? "Bu, depodaki su miktarıdır; soru doldurmak için gereken miktarı soruyor." : "Bu, boş kısmın miktarıdır; soru depodaki suyu soruyor."], [birim + " L", "strateji", "Bu, yalnızca bir bölmenin miktarıdır; kaç bölme olduğunu da hesaba kat."], [(bos ? q - p : p) * 10 + " L", "kavrama", "Bölme sayısını litre sanmışsın; önce bir bölmenin kaç litre olduğunu bul."], [C + " L", "dikkat", "Bu, deponun tamamının kapasitesidir."]],
        ipucu: "Önce depo kaç eş bölmeye ayrılmış, bir bölme kaç litre, onu bul.",
        cozum: [`🔎 Soruyu anlayalım: Deponun kapasitesi ${C} L. ${bos ? "Boş kısmı dolduracak suyu" : "İçindeki suyu"} bulacağız.`,
          `✏️ Şekilden sayalım: Depo ${q} eş bölmeye ayrılmış; ${p} bölme dolu, ${q - p} bölme boş. Dolu kısım deponun ${p}/${q}${ek(q, "i")}.`,
          "💡 Hatırlayalım: Bir çokluğun a/b'sini bulmak için çokluk b'ye bölünür, a ile çarpılır.",
          `✏️ Bir bölme: ${C} ÷ ${q} = ${birim} L.`,
          `✏️ ${bos ? "Boş" : "Dolu"} ${bos ? q - p : p} bölme: ${bos ? q - p : p} × ${birim} = ${bos ? birim * (q - p) : birim * p} L.`,
          `✅ Sonuç: ${dogru}.`,
          `🔁 Kontrol edelim: Dolu + boş = ${birim * p} + ${birim * (q - p)} = ${C} L, kapasiteye eşit ✓`],
        kural: "Bir çokluğun a/b'si: çokluk ÷ b × a." });
    },
  );

  SORU_EKLE("pr.cokadim",
    z => {
      const URUN = karistir([["Defter", 2400, 5800], ["Kalem", 650, 1850], ["Silgi", 375, 1200], ["Boya kalemi", 4500, 8900], ["Cetvel", 900, 2250]]).slice(0, 3);
      const f = URUN.map(u => R(u[1] / 5, u[2] / 5) * 5), n = URUN.map(() => R(1, 3));
      const top = f.reduce((a, v, i) => a + v * n[i], 0), ode = top < 10000 ? 10000 : top < 20000 ? 20000 : 50000, ustu = ode - top;
      let ic = "";
      URUN.forEach((u, i) => { const x = 15 + i * 150; ic += `<path class="g-b g-cizgi" stroke-width="1.5" d="M${x} 20 h120 v60 h-120 l-14 -30 Z"/><circle class="g-bos g-cizgi" cx="${x + 4}" cy="50" r="4"/>` + Y(x + 64, 44, u[0], { k: 1 }) + Y(x + 64, 66, fyaz(f[i]), { b: 1 }); });
      ic += kutu(140, 100, 220, 32 + 26 * 3, "g-yumusak", 6) + Y(250, 122, "Alışveriş listesi", { b: 1 });
      URUN.forEach((u, i) => { ic += Y(160, 148 + i * 26, `${n[i]} tane ${u[0].toLocaleLowerCase("tr-TR")}`, { a: "start" }); });
      return S({ kaz: "pr.cokadim", duzey: "transfer", zorluk: 3, gorsel: G.svg(480, 225, ic, "fiyat etiketleri ve alışveriş listesi"),
        soru: `Kırtasiyedeki ürünlerin fiyat etiketleri ve Ada'nın alışveriş listesi şekilde verilmiştir. Ada listedekilerin hepsini alıp kasaya <b>${ode / 100} TL</b> veriyor.<br>Ada kaç lira para üstü alır?`,
        dogru: fyaz(ustu), dogruNeden: `Tutar: ${URUN.map((u, i) => n[i] + " × " + fyaz(f[i])).join(" + ")} = ${fyaz(top)}; ${ode / 100} − ${fyaz(top)} = ${fyaz(ustu)}.`,
        yanlis: [[fyaz(ode - f.reduce((a, b) => a + b, 0)), "dikkat", "Her üründen birer tane almış gibi hesaplamışsın; listedeki adetlerle çarpmalısın."], [fyaz(top), "strateji", "Bu, alışverişin tutarıdır; para üstü için verilen paradan çıkarmalısın."], [fyaz(ustu + 100), "islem", "Çıkarmayı yeniden kontrol et; lira ve kuruşları hizala."], [fyaz(Math.max(5, ustu - 100)), "islem", "Toplamayı yeniden kontrol et."]],
        ipucu: "1) Her ürün için adet × fiyat. 2) Hepsini topla. 3) Verilen paradan çıkar.",
        cozum: ["🔎 Soruyu anlayalım: Etiketlerden fiyatları, listeden adetleri okuyup para üstünü bulacağız.",
          "💡 Hatırlayalım: Çok adımlı problemlerde sırayla ilerleriz: önce her ürünün tutarı (adet × fiyat), sonra toplam, en son para üstü.",
          "✏️ Ürün tutarları: " + URUN.map((u, i) => `${u[0]}: ${n[i]} × ${fyaz(f[i])} = ${fyaz(n[i] * f[i])}`).join("; ") + ".",
          `✏️ Toplam: ${URUN.map((u, i) => fyaz(n[i] * f[i])).join(" + ")} = ${fyaz(top)}.`,
          `✏️ Para üstü: ${ode / 100},00 − ${fyaz(top)} = ${fyaz(ustu)}.`,
          `✅ Sonuç: Ada ${fyaz(ustu)} para üstü alır.`,
          `🔁 Kontrol edelim: ${fyaz(top)} + ${fyaz(ustu)} = ${ode / 100},00 TL ✓`],
        kural: "Çok adımlı problemde ara sonuçları yaz; en sonda ters işlemle sağlama yap." });
    },
  );

  /* Duvardaki boy ölçer */
  SORU_EKLE("uz.donustur",
    z => {
      const h = R(23, 31) * 5, alt = 100, ust = 165, k = 5, yk = v => 20 + (ust - v) * k;
      let ic = `<rect class="g-b g-cizgi" x="60" y="20" width="60" height="${(ust - alt) * k}" stroke-width="1.5"/>`;
      for (let v = alt; v <= ust; v++) { const u = v % 10 === 0 ? 24 : v % 5 === 0 ? 16 : 8; ic += cizgi(60, yk(v), 60 + u, yk(v), "g-cizgi", v % 5 ? 1 : 1.6); if (v % 10 === 0) ic += Y(54, yk(v) + 4, v, { a: "end", k: 1 }); }
      ic += Y(54, 14, "cm", { a: "end", k: 1 });
      const yy = yk(h);
      ic += `<circle class="g-yumusak g-cizgi" cx="200" cy="${yy + 18}" r="18" stroke-width="2"/><rect class="g-a" x="182" y="${yy + 38}" width="36" height="${Math.max(20, yk(alt) - yy - 38)}" rx="10"/>`;
      ic += `<line class="g-ok-d" x1="120" y1="${yy}" x2="225" y2="${yy}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
      const dogru = od(h / 100) + " m";
      return S({ kaz: "uz.donustur", duzey: "uygulama", zorluk: 2, gorsel: GS(270, (ust - alt) * k + 40, ic, "duvardaki boy ölçer", 320),
        soru: "Emre, duvardaki santimetre çizelgesinin önünde boyunu ölçüyor. Başının üstü kırmızı kesikli çizgiyle gösterilmiştir.<br>Emre'nin boyu kaç <b>metredir</b>?",
        dogru, dogruNeden: `Çizgi ${h} cm'yi gösteriyor; 100 cm = 1 m olduğundan ${h} ÷ 100 = ${od(h / 100)} m.`,
        yanlis: [[od(h / 10) + " m", "islem", "10'a bölmüşsün; 1 m = 100 cm olduğu için 100'e bölmeliyiz."], [od(h / 1000) + " m", "islem", "1000'e bölmüşsün; 1000'e bölme mm'den m'ye geçerken yapılır."], [h + " m", "kavrama", "Okuduğun değer santimetredir; birimi dönüştürmeden m yazmışsın."], [od((h - 5) / 100) + " m", "dikkat", "Çizelgeyi yanlış okumuşsun; büyük çentikler 10 cm, orta çentikler 5 cm'dir."]],
        ipucu: "Önce çizelgeden cm olarak oku; 100 cm = 1 m.",
        cozum: ["🔎 Soruyu anlayalım: Çizelgeden boyu santimetre olarak okuyup metreye çevireceğiz.",
          "✏️ Çizelgeyi okuyalım: Uzun çentikler 10 cm'de bir, orta çentikler 5 cm'de bir, kısa çentikler 1 cm'de birdir.",
          `✏️ Kırmızı çizgi ${Math.floor(h / 10) * 10} ile ${Math.floor(h / 10) * 10 + 10} arasında, ${h % 10 ? "ortadaki 5 çentiğinde" : "uzun çentikte"}: ${h} cm.`,
          "💡 Hatırlayalım: 1 m = 100 cm. Santimetreden metreye geçerken 100'e böleriz (virgül 2 basamak sola kayar).",
          `✏️ ${h} ÷ 100 = ${od(h / 100)}.`,
          `✅ Sonuç: Emre'nin boyu ${dogru}.`,
          `🔁 Kontrol edelim: ${od(h / 100)} m × 100 = ${h} cm ✓ Ayrıca bir çocuğun boyu için ${od(h / 100)} m mantıklı bir değer.`],
        kural: "cm → m: 100'e böl; m → cm: 100 ile çarp." });
    },
    z => {
      const bas = R(1, 4) * 10 + sec([0, 5]), uz = R(35, 95), son = bas + uz, cm = 13, b = 40;
      let ic = `<rect class="g-yumusak g-cizgi" x="20" y="70" width="${cm * b + 20}" height="50" stroke-width="1.5"/>`;
      for (let m = 0; m <= cm * 10; m++) { const x = 30 + m * b / 10, u = m % 10 === 0 ? 18 : m % 5 === 0 ? 12 : 6; ic += cizgi(x, 70, x, 70 + u, "g-cizgi", 1); if (m % 10 === 0) ic += Y(x, 114, m / 10, { k: 1 }); }
      const x1 = 30 + bas * b / 10, x2 = 30 + son * b / 10;
      ic += `<rect class="g-b g-cizgi" x="${x1}" y="34" width="${x2 - x1 - 18}" height="22" stroke-width="1.5"/><path class="g-d g-cizgi" stroke-width="1.5" d="M${x2 - 18} 34 L${x2} 45 L${x2 - 18} 56 Z"/>`;
      ic += `<line class="g-ince" x1="${x1}" y1="30" x2="${x1}" y2="70" stroke-dasharray="3 3"/><line class="g-ince" x1="${x2}" y1="30" x2="${x2}" y2="70" stroke-dasharray="3 3"/>`;
      return S({ kaz: "uz.donustur", duzey: "uygulama", zorluk: 3, gorsel: G.svg(cm * b + 60, 128, ic, "cetvel ve kalem"),
        soru: "Şekildeki kalemin boyu, kalem cetvelin 0 çizgisinden başlatılmadan ölçülmüştür. Cetvelde sayılar santimetreyi, küçük çentikler milimetreyi gösterir.<br>Kalemin boyu kaç <b>santimetredir</b>?",
        dogru: od(uz / 10) + " cm", dogruNeden: `Kalem ${od(bas / 10)} cm'den ${od(son / 10)} cm'ye kadar: ${od(son / 10)} − ${od(bas / 10)} = ${od(uz / 10)} cm.`,
        yanlis: [[od(son / 10) + " cm", "strateji", "Yalnızca kalemin bittiği yeri okudun; kalem 0'dan başlamıyor, başlangıç değerini çıkarmalısın."], [uz + " cm", "kavrama", `Uzunluk ${uz} mm'dir; santimetreye çevirmek için 10'a bölmelisin.`], [od((uz + 10) / 10) + " cm", "islem", "Çıkarmayı yeniden yap; başlangıç ve bitiş değerlerini dikkatle oku."], [od((uz - 5) / 10) + " cm", "dikkat", "Milimetre çentiklerini yeniden say; orta boy çentik 5 mm'yi gösterir."]],
        ipucu: "Uzunluk = bitiş noktası − başlangıç noktası. 1 cm = 10 mm.",
        cozum: ["🔎 Soruyu anlayalım: Kalem cetvelin 0 çizgisinden başlamıyor. Kalemin gerçek boyunu bulacağız.",
          "💡 Hatırlayalım: Ölçüm 0'dan başlamıyorsa uzunluk = bitiş değeri − başlangıç değeri. 1 cm = 10 mm.",
          `✏️ Başlangıç: ${Math.floor(bas / 10)} cm ${bas % 10} mm = ${od(bas / 10)} cm.`,
          `✏️ Bitiş (kalemin ucu): ${Math.floor(son / 10)} cm ${son % 10} mm = ${od(son / 10)} cm.`,
          `✏️ Uzunluk: ${od(son / 10)} − ${od(bas / 10)} = ${od(uz / 10)} cm (= ${uz} mm).`,
          `✅ Sonuç: Kalemin boyu ${od(uz / 10)} cm.`,
          `🔁 Kontrol edelim: ${od(bas / 10)} + ${od(uz / 10)} = ${od(son / 10)} ✓`],
        kural: "Cetvelde ölçüm 0'dan başlamıyorsa: uzunluk = son − baş." });
    },
  );

  SORU_EKLE("uz.birim",
    z => {
      const OG = [["🚪", "Sınıf kapısının yüksekliği", "2", "m", "km"], ["✏️", "Kurşun kalemin boyu", "15", "cm", "m"], ["🐜", "Bir karıncanın boyu", "5", "mm", "cm"], ["🛣️", "İki şehir arasındaki yol", "450", "km", "m"], ["⚽", "Futbol sahasının uzunluğu", "100", "m", "km"], ["📏", "Okul cetvelinin boyu", "30", "cm", "m"], ["🧱", "Bir tuğlanın boyu", "20", "cm", "km"], ["📎", "Ataşın boyu", "3", "cm", "m"]];
      const s = karistir(OG).slice(0, 4), y = R(0, 3);
      let ic = "";
      s.forEach((o, i) => { const x = 10 + (i % 2) * 290, yy = 10 + Math.floor(i / 2) * 90; ic += kutu(x, yy, 280, 80, "g-bos", 10) + `<text x="${x + 34}" y="${yy + 52}" text-anchor="middle" font-size="30">${o[0]}</text>` + Y(x + 70, yy + 32, o[1], { a: "start", k: 1 }) + Y(x + 70, yy + 60, `${o[2]} ${i === y ? o[4] : o[3]}`, { a: "start", b: 1 }); });
      const yaz = (o, b) => `${o[1]}: ${o[2]} ${b}`;
      return S({ kaz: "uz.birim", duzey: "aciklama", zorluk: 1, gorsel: G.svg(590, 195, ic, "uzunluk ölçümleri yazılı kartlar"),
        soru: "Bir öğrenci, şekildeki kartlara bazı uzunlukları ölçüm birimleriyle yazmıştır. Kartlardan yalnızca birinde <b>birim yanlış</b> seçilmiştir.<br>Birimi yanlış yazılan ölçüm hangisidir?",
        dogru: yaz(s[y], s[y][4]), dogruNeden: `${s[y][1]} ${s[y][2]} ${s[y][4]} olamaz; doğrusu ${s[y][2]} ${s[y][3]}.`,
        yanlis: s.filter((_, i) => i !== y).map(o => [yaz(o, o[3]), "bilgi", `${o[1]} için ${o[2]} ${o[3]} gerçekçi bir ölçümdür.`]),
        ipucu: "Her kartta “Bu uzunluk gerçekte bu kadar olabilir mi?” diye düşün. Elinin boyu yaklaşık 15 cm, bir adım yaklaşık 1 m'dir.",
        cozum: ["🔎 Soruyu anlayalım: Kartlardaki ölçümlerden hangisinin biriminin gerçek uzunluğa uymadığını bulacağız.",
          "💡 Hatırlayalım: Çok küçük uzunluklar mm, küçük nesneler cm, oda-bina-saha gibi uzunluklar m, şehirler arası uzaklıklar km ile ölçülür. 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm.",
          "✏️ Kartları tek tek değerlendirelim: " + s.map((o, i) => `${o[1]} ${o[2]} ${i === y ? o[4] + " ✗" : o[3] + " ✓"}`).join("; ") + ".",
          `✏️ ${s[y][2]} ${s[y][4]}, ${s[y][1].toLocaleLowerCase("tr-TR")} için gerçekçi değil; uygun birim ${s[y][3]}.`,
          `✅ Sonuç: Yanlış olan “${yaz(s[y], s[y][4])}”.`,
          "🔁 Kontrol edelim: Doğru birimle yazınca (" + `${s[y][2]} ${s[y][3]}` + ") ölçüm gerçek hayata uyar ✓"],
        kural: "Birim seçerken nesnenin büyüklüğünü düşün: mm < cm < m < km." });
    },
  );

  SORU_EKLE("uz.problem",
    z => {
      const a = R(8, 25) * 100, b = R(3, 9) * 50, c = R(4, 18) * 100, top = a + b + c;
      const km = v => od(v / 1000) + " km";
      const P = [[40, 160], [190, 60], [330, 150], [520, 70]], ADL = ["Ev", "Fırın", "Park", "Okul"];
      let ic = `<polyline class="g-cizgi" fill="none" stroke-width="4" stroke-dasharray="10 6" points="${P.map(p => p.join(",")).join(" ")}"/>`;
      P.forEach(([x, y], i) => { ic += `<circle class="${i === 0 || i === 3 ? "g-d" : "g-a"} g-cizgi" cx="${x}" cy="${y}" r="10" stroke-width="2"/>` + Y(x, y + (i % 2 ? -18 : 30), ADL[i], { b: 1 }); });
      const et = [km(a), b + " m", sec([0, 1]) ? km(c) : c + " m"];
      [[0, 1], [1, 2], [2, 3]].forEach(([i, j], k) => { const mx = (P[i][0] + P[j][0]) / 2, my = (P[i][1] + P[j][1]) / 2; ic += kutu(mx - 40, my - 32, 80, 24, "g-b", 6) + Y(mx, my - 15, et[k], { k: 1, b: 1 }); });
      return S({ kaz: "uz.problem", duzey: "transfer", zorluk: 3, gorsel: G.svg(560, 200, ic, "evden okula giden yolun haritası"),
        soru: "Şekildeki haritada Kaan'ın evden okula giderken izlediği yol ve yol parçalarının uzunlukları verilmiştir.<br>Kaan evden okula gidip <b>aynı yoldan</b> eve dönerse toplam kaç <b>metre</b> yol yürümüş olur?",
        dogru: 2 * top + " m", dogruNeden: `Gidiş ${a} + ${b} + ${c} = ${top} m; gidiş-dönüş 2 × ${top} = ${2 * top} m.`,
        yanlis: [[top + " m", "dikkat", "Yalnızca gidişi hesapladın; dönüş yolu da eklenmeli."], [od(2 * (a / 1000 + b + c / (et[2].includes("km") ? 1000 : 1))) + " m", "kavrama", "Farklı birimleri dönüştürmeden toplamışsın; önce hepsini metreye çevir (1 km = 1000 m)."], [2 * top + 1000 + " m", "islem", "Toplamayı yeniden kontrol et."], [2 * (top - b) + " m", "dikkat", "Bir yol parçasını atlamışsın."]],
        ipucu: "Önce bütün uzunlukları metreye çevir (1 km = 1000 m), sonra topla; dönüşü unutma.",
        cozum: ["🔎 Soruyu anlayalım: Haritadaki üç yol parçası farklı birimlerle yazılmış. Gidiş-dönüş toplam yolu metre olarak bulacağız.",
          "💡 Hatırlayalım: Uzunlukları toplamadan önce aynı birime çeviririz. 1 km = 1000 m; km'den m'ye geçerken 1000 ile çarparız.",
          `✏️ Metreye çevirelim: ${et[0]} = ${a} m; ${et[1]}; ${et[2]} = ${c} m.`,
          `✏️ Gidiş: ${a} + ${b} + ${c} = ${top} m.`,
          `✏️ Gidiş-dönüş: ${top} × 2 = ${2 * top} m.`,
          `✅ Sonuç: Kaan toplam ${2 * top} m yürür.`,
          `🔁 Kontrol edelim: ${2 * top} m = ${km(2 * top)}; kilometre olarak da mantıklı bir yürüyüş mesafesi ✓`],
        kural: "Farklı birimlerdeki uzunlukları toplamadan önce aynı birime çevir." });
    },
  );

  /* ======================= TEMA 4: VERİ, GRAFİK, MERKEZÎ EĞİLİM ======================= */
  SORU_EKLE("ar.veri",
    z => {
      const KAT = ["En sevdiğin meyve hangisidir?", "Okula hangi araçla geliyorsun?", "Göz rengin nedir?", "En sevdiğin ders hangisidir?", "Hangi mevsimde doğdun?", "En sevdiğin renk hangisidir?"];
      const NIC = ["Kaç kardeşin var?", "Boyun kaç santimetre?", "Günde kaç saat uyuyorsun?", "Okula kaç dakikada geliyorsun?", "Bu ay kaç kitap okudun?", "Haftada kaç saat spor yapıyorsun?"];
      const nicelAra = R(0, 1) === 1;
      const tek = sec(nicelAra ? NIC : KAT), diger = karistir(nicelAra ? KAT : NIC).slice(0, 3);
      const sorular = karistir(diger.concat([tek])), i = sorular.indexOf(tek);
      let ic = kutu(10, 10, 520, 60 + sorular.length * 40, "g-bos", 10) + Y(270, 40, "ÖĞRENCİ ANKETİ", { b: 1 });
      sorular.forEach((s, j) => { ic += Y(30, 78 + j * 40, `${j + 1}) ${s}`, { a: "start" }) + `<line class="g-ince" x1="330" y1="${84 + j * 40}" x2="510" y2="${84 + j * 40}" stroke-dasharray="3 3"/>`; });
      const tur = nicelAra ? "nicel (sayısal)" : "kategorik";
      return S({ kaz: "ar.veri", duzey: "aciklama", zorluk: 2, gorsel: G.svg(540, 80 + sorular.length * 40, ic, "anket formu"),
        soru: `Şekildeki anket formunda dört soru vardır. Bu sorulardan yalnızca birine verilecek cevaplar <b>${tur}</b> veri olur.<br>Bu soru kaçıncı sorudur?`,
        dogru: `${i + 1}. soru`, dogruNeden: `“${tek}” sorusunun cevapları ${nicelAra ? "sayı ile ifade edilir; sayma ya da ölçme sonucudur" : "bir kategori (ad, tür, renk) olarak verilir; sayı değildir"}.`,
        yanlis: sorular.map((s, j) => [`${j + 1}. soru`, "kavrama", `“${s}” sorusunun cevapları ${nicelAra ? "kategoriktir (sayı değil, ad ya da tür)" : "sayıdır, yani nicel veridir"}.`]).filter((_, j) => j !== i),
        ipucu: "Her sorunun olası cevaplarını düşün: cevap bir sayı mı, yoksa bir ad/tür mü?",
        cozum: [`🔎 Soruyu anlayalım: Formdaki dört sorudan hangisinin cevaplarının ${tur} veri olacağını bulacağız.`,
          "💡 Hatırlayalım: Sayma ya da ölçme ile elde edilen sayısal veriler nicel veridir (kardeş sayısı, boy …). Gruplara/türlere ayrılan veriler kategorik veridir (renk, meyve, ulaşım aracı …).",
          "✏️ Soruları tek tek düşünelim: " + sorular.map((s, j) => `${j + 1}) ${NIC.includes(s) ? "sayı → nicel" : "ad/tür → kategorik"}`).join("; ") + ".",
          `✏️ Diğerlerinden farklı olan ${i + 1}. sorudur.`,
          `✅ Sonuç: ${i + 1}. soru.`,
          "🔁 Kontrol edelim: Bir cevabı “toplayıp ortalamasını” alabiliyorsak nicel, alamıyorsak kategorik veridir. “Ortalama göz rengi” olmaz ama “ortalama kardeş sayısı” olur ✓"],
        kural: "Nicel veri sayıdır (sayma/ölçme); kategorik veri ad, tür ya da gruptur." });
    },
  );

  SORU_EKLE("ar.soru",
    z => {
      const IYI = ["Sınıfımızdaki öğrenciler okula en çok hangi ulaşım aracıyla geliyor?", "Okulumuzdaki 6. sınıf öğrencileri haftada kaç saat kitap okuyor?", "Sınıfımızdaki öğrencilerin en sevdiği spor dalı hangisidir?", "Sınıfımızdaki öğrenciler hafta sonu kaç saat ekran başında kalıyor?"];
      const KOTU = [["Futbol en güzel spor mudur?", "kişisel görüş sorar; veri toplanarak cevaplanamaz"], ["Ali'nin kaç kardeşi var?", "tek bir kişiyle ilgilidir; tek bir veriyle cevaplanır"], ["Dünyadaki bütün çocuklar kaç saat uyur?", "kapsamı çok geniştir; bu veriyi toplamamız mümkün değildir"], ["Bir haftada kaç gün vardır?", "cevabı zaten bilinir; veri toplamaya gerek yoktur"], ["Okuldaki herkes mutlu mu?", "ölçütü belirsizdir; “mutlu” kavramı açıkça tanımlanmamıştır"]];
      const IN = { Ece: "Ece'nin", Can: "Can'ın", Lale: "Lale'nin", Arda: "Arda'nın", Mina: "Mina'nın", Efe: "Efe'nin" };
      const iyi = sec(IYI), kotu = karistir(KOTU).slice(0, 3), AD = karistir(["Ece", "Can", "Lale", "Arda", "Mina", "Efe"]).slice(0, 4);
      const notlar = karistir([[iyi, null]].concat(kotu)), i = notlar.findIndex(n => n[1] === null);
      const sat = s => { const w = s.split(" "), l = [""]; w.forEach(x => { if ((l[l.length - 1] + " " + x).length > 28) l.push(x); else l[l.length - 1] = (l[l.length - 1] + " " + x).trim(); }); return l; };
      let ic = `<rect class="g-b" x="5" y="5" width="590" height="290" rx="12" fill-opacity="0.35"/>`;
      notlar.forEach((n, j) => { const x = 15 + (j % 2) * 290, y = 15 + Math.floor(j / 2) * 140; ic += kutu(x, y, 280, 130, "g-bos", 4) + `<circle class="g-d" cx="${x + 140}" cy="${y + 8}" r="6"/>` + Y(x + 14, y + 30, AD[j] + ":", { a: "start", b: 1 }); sat(n[0]).forEach((l, k) => { ic += Y(x + 14, y + 56 + k * 22, l, { a: "start" }); }); });
      return S({ kaz: "ar.soru", duzey: "baglanti", zorluk: 2, gorsel: G.svg(600, 300, ic, "araştırma soruları panosu"),
        soru: "Öğretmen, öğrencilerden veri toplayarak cevaplayabilecekleri birer araştırma sorusu yazmalarını istemiştir. Öğrencilerin yazdığı sorular panoda gösterilmiştir.<br>Hangi öğrencinin sorusu <b>uygun bir araştırma sorusudur</b>?",
        dogru: IN[AD[i]] + " sorusu", dogruNeden: `“${iyi}” sorusu belirli bir grup hakkındadır, açıktır ve veri toplanarak cevaplanabilir.`,
        yanlis: notlar.map((n, j) => [IN[AD[j]] + " sorusu", "kavrama", `Bu soru ${n[1]}.`]).filter((_, j) => j !== i),
        ipucu: "İyi bir araştırma sorusu: belirli bir gruptan, açıkça tanımlanmış ve toplanabilir veriyle cevaplanır.",
        cozum: ["🔎 Soruyu anlayalım: Panodaki dört sorudan hangisinin veri toplanarak cevaplanabilecek iyi bir araştırma sorusu olduğunu bulacağız.",
          "💡 Hatırlayalım: Araştırma sorusu açık ve anlaşılır olmalı; kimden veri toplanacağı belli olmalı; cevabı önceden bilinmemeli; birden çok kişiden veri toplanarak cevaplanabilmeli; kişisel görüş sormamalı.",
          "✏️ Soruları ölçütlerle karşılaştıralım: " + notlar.map((n, j) => `${AD[j]}: ${n[1] === null ? "ölçütlere uyuyor ✓" : n[1] + " ✗"}`).join("; ") + ".",
          `✏️ Bütün ölçütleri sağlayan tek soru ${IN[AD[i]]} sorusudur.`,
          `✅ Sonuç: ${IN[AD[i]]} sorusu uygun bir araştırma sorusudur.`,
          "🔁 Kontrol edelim: Bu soru için bir anket hazırlayıp sınıftan cevap toplayabilir, sonuçları tablo ya da grafikle gösterebiliriz ✓"],
        kural: "İyi araştırma sorusu: net, belirli bir grup, toplanabilir veri, önceden bilinmeyen cevap." });
    },
  );

  SORU_EKLE("ar.plan",
    z => {
      const KONU = [["Okula geliş biçimi", ["Yürüyerek", "Otobüsle", "Servisle", "Bisikletle"], "Sınıfımızdaki öğrenciler okula nasıl geliyor?"],
        ["Kardeş sayısı", ["0", "1", "2", "3 ya da daha çok"], "Sınıfımızdaki öğrencilerin kaç kardeşi var?"],
        ["Kahvaltıda içilen", ["Süt", "Çay", "Meyve suyu", "Ayran"], "Sınıfımızdaki öğrenciler kahvaltıda en çok ne içiyor?"],
        ["Günlük uyku süresi", ["7 saatten az", "7–8 saat", "9–10 saat", "10 saatten çok"], "Sınıfımızdaki öğrenciler günde kaç saat uyuyor?"],
        ["Sevilen mevsim", ["İlkbahar", "Yaz", "Sonbahar", "Kış"], "Sınıfımızdaki öğrencilerin en sevdiği mevsim hangisidir?"]];
      const t = R(0, KONU.length - 1), k = KONU[t];
      let ic = kutu(10, 10, 460, 40, "g-yumusak", 0) + Y(110, 36, "?", { b: 1 }) + Y(290, 36, "Çetele", { b: 1 }) + Y(420, 36, "Sıklık", { b: 1 });
      const c = k[1].map(() => R(2, 9));
      k[1].forEach((a, i) => { const y = 50 + i * 40; ic += kutu(10, y, 200, 40, "g-bos", 0) + kutu(210, y, 160, 40, "g-bos", 0) + kutu(370, y, 100, 40, "g-bos", 0) + Y(110, y + 26, a, { k: 1 }) + cetele(225, y + 7, c[i]) + Y(420, y + 26, c[i]); });
      return S({ kaz: "ar.plan", duzey: "baglanti", zorluk: 2, gorsel: G.svg(480, 220, ic, "çetele ve sıklık tablosu"),
        soru: "Bir öğrenci araştırması için topladığı verileri şekildeki çetele ve sıklık tablosuna işlemiştir. Tablonun ilk sütun başlığı silinmiştir.<br>Bu tablo aşağıdaki araştırma sorularından hangisi için hazırlanmıştır?",
        dogru: k[2], dogruNeden: `İlk sütundaki ${k[1].join(", ")} seçenekleri, “${k[0].toLocaleLowerCase("tr-TR")}” sorusunun cevaplarıdır.`,
        yanlis: karistir(KONU.filter((_, i) => i !== t)).slice(0, 3).map(o => [o[2], "dikkat", `Bu soru için tablonun ilk sütununda ${o[1].slice(0, 3).join(", ")} … gibi seçenekler olurdu.`]),
        ipucu: "Tablonun ilk sütunundaki seçenekler hangi sorunun cevapları olabilir?",
        cozum: ["🔎 Soruyu anlayalım: Başlığı silinmiş tablonun hangi araştırma sorusu için hazırlandığını bulacağız.",
          "💡 Hatırlayalım: Araştırmayı planlarken önce soru belirlenir, sonra bu sorunun olası cevapları (seçenekler) tabloya yazılır; veriler çeteleyle işlenip sıklıklar bulunur.",
          `✏️ Tablonun ilk sütunundaki seçenekler: ${k[1].join(", ")}.`,
          `✏️ Bu seçenekler “${k[0].toLocaleLowerCase("tr-TR")}” ile ilgili; uygun soru: “${k[2]}”`,
          `✅ Sonuç: Tablo “${k[2]}” sorusu için hazırlanmıştır.`,
          `🔁 Kontrol edelim: Sıklıkların toplamı ${c.join(" + ")} = ${c.reduce((a, b) => a + b, 0)}; yani araştırmaya ${c.reduce((a, b) => a + b, 0)} öğrenci katılmış ✓`],
        kural: "Veri toplama tablosundaki seçenekler, araştırma sorusunun olası cevaplarıdır." });
    },
  );

  /* Çizgi grafiği: etiketler, değerler (tam sayı), adım */
  function cizgiGrafik(et, v, { baslik = "", birim = "", adim = 2 } = {}) {
    const W = 560, H = 290, sol = 56, sag = 530, ust = 46, alt = 250;
    const ymin = Math.max(0, Math.floor((Math.min(...v) - adim) / adim) * adim), ymax = Math.ceil((Math.max(...v) + adim) / adim) * adim;
    const xk = i => sol + 30 + i * (sag - sol - 60) / (et.length - 1), yk = d => alt - (d - ymin) / (ymax - ymin) * (alt - ust);
    let ic = Y(W / 2, 22, baslik, { b: 1 }) + Y(sol - 40, ust - 16, birim, { a: "start", k: 1 });
    for (let d = ymin; d <= ymax; d += adim) ic += `<line class="g-ince" x1="${sol}" y1="${yk(d)}" x2="${sag}" y2="${yk(d)}"/>` + Y(sol - 6, yk(d) + 4, d, { a: "end", k: 1 });
    ic += cizgi(sol, ust - 6, sol, alt) + cizgi(sol, alt, sag, alt);
    ic += `<polyline class="g-ok-a" fill="none" stroke-width="3" points="${v.map((d, i) => xk(i).toFixed(1) + "," + yk(d).toFixed(1)).join(" ")}"/>`;
    v.forEach((d, i) => { ic += `<circle class="g-a" cx="${xk(i)}" cy="${yk(d)}" r="5"/>` + Y(xk(i), alt + 22, et[i], { k: 1 }); });
    return G.svg(W, H, ic, baslik || "çizgi grafiği");
  }
  const GUNL = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"], GUNK = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  SORU_EKLE("me.grafik",
    z => {
      let v, fark, mx; do { v = [R(4, 12) * 2]; for (let i = 1; i < 5; i++) v.push(Math.max(4, Math.min(30, v[i - 1] + R(-3, 4) * 2))); fark = v.slice(1).map((d, i) => d - v[i]); mx = Math.max(...fark); } while (mx <= 0 || fark.filter(f => f === mx).length > 1);
      const i = fark.indexOf(mx), cift = (j) => `${GUNL[j]} ile ${GUNL[j + 1]} arası`;
      const enB = v.indexOf(Math.max(...v));
      const digerler = [0, 1, 2, 3].filter(j => j !== i);
      return S({ kaz: "me.grafik", duzey: "uygulama", zorluk: 2, gorsel: cizgiGrafik(GUNK.slice(0, 5), v, { baslik: "Öğle saatlerinde hava sıcaklığı", birim: "(°C)" }),
        soru: "Bir hafta içinde öğle saatlerinde ölçülen hava sıcaklıkları çizgi grafiğinde gösterilmiştir.<br>Sıcaklık, art arda gelen hangi iki gün arasında <b>en çok artmıştır</b>?",
        dogru: cift(i), dogruNeden: `${GUNL[i]} ${v[i]} °C, ${GUNL[i + 1]} ${v[i + 1]} °C; artış ${mx} °C ile en büyük artıştır.`,
        yanlis: digerler.map(j => [cift(j), fark[j] < 0 ? "kavrama" : "islem", fark[j] < 0 ? `Bu aralıkta sıcaklık ${-fark[j]} °C azalmış; soru artışı soruyor.` : fark[j] === 0 ? "Bu aralıkta sıcaklık değişmemiş." : `Bu aralıktaki artış ${fark[j]} °C; ${mx} °C'lik artıştan küçük.`]).concat(enB > 0 && enB - 1 !== i ? [[cift(enB - 1), "strateji", "En yüksek sıcaklığa ulaşılan gün, en büyük artışın olduğu gün olmak zorunda değildir."]] : []),
        ipucu: "Her iki komşu gün için “sonraki − önceki” farkını hesapla. Çizginin en dik yükseldiği yere bak.",
        cozum: ["🔎 Soruyu anlayalım: Grafikteki günlük sıcaklıklardan, art arda iki gün arasındaki en büyük artışı bulacağız.",
          "💡 Hatırlayalım: Çizgi grafiğinde çizginin yükselmesi artışı, alçalması azalışı gösterir. Çizgi ne kadar dik yükseliyorsa artış o kadar fazladır.",
          "✏️ Grafikten okuyalım: " + v.map((d, j) => `${GUNK[j]} ${d} °C`).join(", ") + ".",
          "✏️ Farkları hesaplayalım: " + fark.map((f, j) => `${GUNK[j]}→${GUNK[j + 1]}: ${f > 0 ? "+" : ""}${f}`).join("; ") + ".",
          `✅ Sonuç: En büyük artış ${cift(i).toLocaleLowerCase("tr-TR").replace(/^./, c => c.toLocaleUpperCase("tr-TR"))} (${mx} °C).`,
          "🔁 Kontrol edelim: Grafikte bu iki gün arasındaki çizgi parçası en dik yükselen parçadır ✓"],
        kural: "Çizgi grafiğinde en dik yükselen parça en büyük artışı gösterir." });
    },
  );

  SORU_EKLE("me.ortalama",
    z => {
      const k = sec([2, 4, 10]), AD = karistir(["Ayşe", "Bora", "Cem", "Duru", "Efe", "Nil"]).slice(0, sec([4, 5]));
      let yarim; do { yarim = AD.map(() => R(2, 12)); } while ((yarim.reduce((a, b) => a + b, 0) * k / 2) % AD.length !== 0);
      const v = yarim.map(h => h * k / 2), top = v.reduce((a, b) => a + b, 0), ort = top / AD.length;
      let ic = Y(20, 24, "Okunan kitap sayısı", { a: "start", b: 1 });
      AD.forEach((a, i) => { const y = 40 + i * 40; ic += Y(20, y + 22, a, { a: "start" }); for (let j = 0; j < yarim[i]; j += 2) { const x = 90 + (j / 2) * 34, w = yarim[i] - j >= 2 ? 24 : 12; ic += `<rect class="g-a g-cizgi" x="${x}" y="${y + 4}" width="${w}" height="26" rx="2" stroke-width="1"/>` + (w === 24 ? `<line class="g-bos" x1="${x + 12}" y1="${y + 6}" x2="${x + 12}" y2="${y + 28}" stroke="#fff" stroke-width="1.5"/>` : ""); } });
      const yy = 40 + AD.length * 40 + 10;
      ic += `<rect class="g-a g-cizgi" x="20" y="${yy}" width="24" height="26" rx="2" stroke-width="1"/>` + Y(52, yy + 19, `= ${k} kitap`, { a: "start", b: 1 }) + `<rect class="g-a g-cizgi" x="180" y="${yy}" width="12" height="26" rx="2" stroke-width="1"/>` + Y(200, yy + 19, `= ${k / 2} kitap`, { a: "start", b: 1 });
      return S({ kaz: "me.ortalama", duzey: "uygulama", zorluk: 3, gorsel: G.svg(460, yy + 40, ic, "okunan kitapların şekil grafiği"),
        soru: "Bir kitap kulübündeki öğrencilerin bir ayda okudukları kitap sayıları şekil grafiğinde gösterilmiştir. Grafiğin altındaki anahtar, bir tam ve bir yarım şeklin kaç kitabı gösterdiğini belirtir.<br>Öğrencilerin okudukları kitap sayılarının <b>aritmetik ortalaması</b> kaçtır?",
        dogru: ort, dogruNeden: `Toplam ${v.join(" + ")} = ${top}; ${top} ÷ ${AD.length} = ${ort}.`,
        yanlis: [[od(yarim.reduce((a, b) => a + b, 0) / 2 / AD.length), "kavrama", `Şekilleri sayıp ortalamasını almışsın; her tam şekil ${k} kitap olduğu için anahtarla çarpmalısın.`], [top, "dikkat", "Bu, toplam kitap sayısıdır; ortalama için öğrenci sayısına bölmelisin."], [od(top / (AD.length - 1)), "islem", `Toplamı ${AD.length - 1}${ek(AD.length - 1, "e")} bölmüşsün; ${AD.length} öğrenci var.`], [ort + k / 2, "islem", "Yarım şekilleri yeniden say."]],
        ipucu: "Önce her öğrencinin kitap sayısını anahtarla bul, sonra topla ve öğrenci sayısına böl.",
        cozum: [`🔎 Soruyu anlayalım: Şekil grafiğinden ${AD.length} öğrencinin kitap sayılarını bulup ortalamasını hesaplayacağız.`,
          `💡 Hatırlayalım: Şekil grafiğinde her şekil anahtardaki kadar veriyi gösterir (tam şekil ${k}, yarım şekil ${k / 2}). Aritmetik ortalama = verilerin toplamı ÷ veri sayısı.`,
          "✏️ Grafikten okuyalım: " + AD.map((a, i) => `${a} ${Math.floor(yarim[i] / 2)} tam${yarim[i] % 2 ? " + 1 yarım" : ""} → ${v[i]}`).join("; ") + ".",
          `✏️ Toplam: ${v.join(" + ")} = ${top}.`,
          `✏️ Ortalama: ${top} ÷ ${AD.length} = ${ort}.`,
          `✅ Sonuç: Aritmetik ortalama ${ort} kitaptır.`,
          `🔁 Kontrol edelim: ${ort} × ${AD.length} = ${top} ✓ Ortalama, en küçük (${Math.min(...v)}) ile en büyük (${Math.max(...v)}) değer arasında olmalı ✓`],
        kural: "Şekil grafiğinde önce anahtarla değerleri bul; ortalama = toplam ÷ veri sayısı." });
    },
  );

  SORU_EKLE("me.ortanca",
    z => {
      const bas = sec([33, 34, 35]), deg = [0, 1, 2, 3, 4, 5].map(i => bas + i);
      let c, N; do { c = deg.map(() => R(0, 5)); N = c.reduce((a, b) => a + b, 0); } while (N % 2 === 0 || N < 9 || N > 19 || c.filter(x => x === Math.max(...c)).length > 1);
      const liste = []; deg.forEach((d, i) => { for (let j = 0; j < c[i]; j++) liste.push(d); });
      const ortanca = liste[(N - 1) / 2], tepe = deg[c.indexOf(Math.max(...c))];
      const sor = R(0, 1) === 0 ? "ortanca" : "tepe";
      let ic = cizgi(30, 180, 530, 180);
      deg.forEach((d, i) => { const x = 70 + i * 82; ic += cizgi(x, 175, x, 185) + Y(x, 204, d, { b: 1 }); for (let j = 0; j < c[i]; j++) ic += `<circle class="g-a g-cizgi" cx="${x}" cy="${164 - j * 26}" r="10" stroke-width="1"/>`; });
      ic += Y(280, 230, "Ayakkabı numarası", { k: 1 });
      const dogru = sor === "ortanca" ? ortanca : tepe, diger = sor === "ortanca" ? tepe : ortanca;
      const ortS = od(Math.round(liste.reduce((a, b) => a + b, 0) / N * 10) / 10);
      return S({ kaz: "me.ortanca", duzey: "uygulama", zorluk: 3, gorsel: G.svg(560, 240, ic, "ayakkabı numaralarının nokta grafiği"),
        soru: `Bir sınıftaki öğrencilerin ayakkabı numaraları nokta grafiğinde gösterilmiştir. Her nokta bir öğrenciyi gösterir.<br>Bu verilerin <b>${sor === "ortanca" ? "ortancası" : "tepe değeri"}</b> kaçtır?`,
        dogru, dogruNeden: sor === "ortanca" ? `${N} veri sıralanınca ortadaki (${(N + 1) / 2}.) veri ${ortanca}.` : `En çok tekrar eden numara ${tepe} (${Math.max(...c)} öğrenci).`,
        yanlis: [[diger !== dogru ? diger : dogru + 1, "kavrama", sor === "ortanca" ? "Bu, tepe değerdir (en çok tekrar eden). Ortanca, sıralı verinin ortasındaki değerdir." : "Bu, ortancadır. Tepe değer en çok tekrar eden veridir."], [Math.max(...c), "dikkat", `${Math.max(...c)}, en uzun sütundaki nokta sayısıdır; soru ayakkabı numarasını soruyor.`], [deg[2], "strateji", "Yatay eksendeki numaraların ortasına bakmışsın; her numaradaki öğrenci sayısını hesaba katmalısın."], [ortS, "kavrama", "Aritmetik ortalamayı hesaplamışsın; soru başka bir merkezî eğilim ölçüsünü istiyor."], [dogru + 1, "islem", "Noktaları yeniden say."]],
        ipucu: sor === "ortanca" ? "Bütün noktaları küçükten büyüğe sırala; tam ortadaki veriyi bul." : "En yüksek nokta sütunu hangi numaranın üstünde?",
        cozum: [`🔎 Soruyu anlayalım: Nokta grafiğinden ayakkabı numaralarının ${sor === "ortanca" ? "ortancasını" : "tepe değerini"} bulacağız.`,
          "💡 Hatırlayalım: Ortanca, veriler küçükten büyüğe sıralanınca tam ortada kalan değerdir. Tepe değer, en çok tekrar eden değerdir.",
          "✏️ Grafikten okuyalım: " + deg.map((d, i) => `${d} → ${c[i]} öğrenci`).join(", ") + `. Toplam ${N} öğrenci.`,
          sor === "ortanca" ? `✏️ ${N} veri tek sayıda; ortadaki veri (${N} + 1) ÷ 2 = ${(N + 1) / 2}. sıradadır. Soldan sayalım: ${deg.map((d, i) => c[i] ? d + " (" + c[i] + ")" : "").filter(Boolean).join(", ")} → ${(N + 1) / 2}. veri ${ortanca}.`
            : `✏️ En uzun nokta sütunu ${tepe} numarasının üstünde; ${Math.max(...c)} nokta var.`,
          `✅ Sonuç: ${sor === "ortanca" ? "Ortanca" : "Tepe değer"} ${dogru}.`,
          sor === "ortanca" ? `🔁 Kontrol edelim: ${ortanca}${ek(ortanca, "den")} küçük ${liste.filter(x => x < ortanca).length}, büyük ${liste.filter(x => x > ortanca).length} veri var; ortadaki değerin iki yanında en fazla ${(N - 1) / 2} veri kalır ✓` : `🔁 Kontrol edelim: Başka hiçbir numarada ${Math.max(...c)} nokta yok; tepe değer tek ✓`],
        kural: "Ortanca: sıralı verinin ortası. Tepe değer: en sık görülen veri." });
    },
  );

  SORU_EKLE("me.aciklik",
    z => {
      const n = 7; let v; do { v = [...Array(n)].map(() => R(5, 15) * 2); } while (Math.max(...v) - Math.min(...v) < 6 || v.filter(x => x === Math.max(...v)).length > 1 || v.filter(x => x === Math.min(...v)).length > 1);
      const mx = Math.max(...v), mn = Math.min(...v), d = mx - mn;
      return S({ kaz: "me.aciklik", duzey: "uygulama", zorluk: 2, gorsel: cizgiGrafik(GUNK, v, { baslik: "Bir haftada günlük en yüksek sıcaklık", birim: "(°C)" }),
        soru: "Bir şehirde bir hafta boyunca ölçülen günlük en yüksek sıcaklıklar çizgi grafiğinde gösterilmiştir.<br>Bu verilerin <b>açıklığı</b> kaç derecedir (°C)?",
        dogru: d + " °C", dogruNeden: `En büyük değer ${mx}, en küçük değer ${mn}; açıklık ${mx} − ${mn} = ${d}.`,
        yanlis: [[Math.abs(v[n - 1] - v[0]) !== d ? Math.abs(v[n - 1] - v[0]) + " °C" : d + 2 + " °C", "strateji", "İlk ve son günün farkını almışsın; açıklık en büyük ve en küçük değerin farkıdır."], [mx + " °C", "kavrama", "Bu, en büyük değerdir; açıklık için en küçük değeri çıkarmalısın."], [mx + mn + " °C", "islem", "En büyük ve en küçük değeri toplamışsın; çıkarmalısın."], [d - 2 + " °C", "dikkat", "Grafiği yeniden oku; yatay çizgiler 2'şer derece artar."]],
        ipucu: "Grafikteki en yüksek ve en alçak noktayı bul; değerlerini çıkar.",
        cozum: ["🔎 Soruyu anlayalım: Grafikteki 7 günlük sıcaklıkların açıklığını bulacağız.",
          "💡 Hatırlayalım: Açıklık = en büyük değer − en küçük değer. Verilerin ne kadar yayıldığını gösterir.",
          "✏️ Grafikten okuyalım: " + v.map((x, i) => `${GUNK[i]} ${x}`).join(", ") + ".",
          `✏️ En büyük değer ${mx} (${GUNL[v.indexOf(mx)]}), en küçük değer ${mn} (${GUNL[v.indexOf(mn)]}).`,
          `✏️ Açıklık: ${mx} − ${mn} = ${d}.`,
          `✅ Sonuç: Açıklık ${d} °C.`,
          "🔁 Kontrol edelim: Bütün değerler " + mn + " ile " + mx + " arasında; bu aralığın genişliği " + d + " ✓"],
        kural: "Açıklık = en büyük − en küçük (ilk − son değil!)." });
    },
  );
})();
