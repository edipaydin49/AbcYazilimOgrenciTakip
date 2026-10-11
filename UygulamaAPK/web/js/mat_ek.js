/* Matematik: görselli ek soru üreteçleri ve kazanım başına “Unutma” kuralları.
 * icerik.js'de kaydedilen konulara üreteç ekler (konu ve kazanım kimlikleri değişmez).
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, bolenler, asalMi, ebob, ekok, kesir, asalCarpan, ek, ustlu, S, G } = OGR;
  const MAT = DERS_LISTESI.find(d => d.id === "mat");
  const ekle = (kaz, ...f) => { const k = MAT.konular.find(x => x.kazanimlar.some(z => z.id === kaz)); k.uret[kaz].push(...f); };

  /* Çarpan ağacı görseli: n → (a, n/a) dallanır; bos: boş bırakılacak düğüm sırası */
  function carpanAgaci(n, bos) {
    const dugum = []; let x = n, y = 30, sol = 300, i = 0;
    // Her adımda en küçük asal böleni sola ayır, kalanla devam et.
    const adimlar = [];
    while (!asalMi(x)) { const p = bolenler(x).find(d => d > 1 && asalMi(d)); adimlar.push([x, p, x / p]); x /= p; }
    let ic = "", cx = 120;
    adimlar.forEach(([v, p, kalan], j) => {
      const yy = 30 + j * 60;
      const kutu = (xx, yv, deger, idx) => { const b = idx === bos; dugum.push(deger);
        return `<rect class="${b ? "g-b" : asalMi(deger) && idx !== 0 ? "g-c" : "g-yumusak"} g-cizgi" x="${xx - 26}" y="${yv - 18}" width="52" height="32" rx="6"/>` + G.yazi(xx, yv + 4, b ? "?" : deger, { b: 1 }); };
      if (j === 0) ic += kutu(cx, yy, v, i++);
      ic += `<line class="g-cizgi" x1="${cx}" y1="${yy + 14}" x2="${cx - 50}" y2="${yy + 42}"/><line class="g-cizgi" x1="${cx}" y1="${yy + 14}" x2="${cx + 50}" y2="${yy + 42}"/>`;
      ic += kutu(cx - 50, yy + 60, p, i++);
      ic += kutu(cx + 50, yy + 60, kalan, i++);
      cx += 50;
    });
    return { gorsel: G.svg(cx + 120, 70 + adimlar.length * 60, ic, n + " sayısının çarpan ağacı"), dugum, adimlar };
  }

  /* ---------------- Tema 1 ---------------- */
  ekle("carpan.model",
    z => { const a = R(2, 5), b = R(a + 1, 9), n = a * b;
      return S({ kaz: "carpan.model", duzey: "uygulama", zorluk: 1, soru: "Şekildeki dikdörtgen birim karelerle oluşturulmuştur. Bu model hangi sayının hangi çarpan çiftini gösterir?",
        gorsel: G.izgara(a, b), dogru: `${n} = ${a} × ${b}`, dogruNeden: `${a} satır ve ${b} sütun var; ${a} × ${b} = ${n} birim kare.`,
        yanlis: [[`${a + b} = ${a} + ${b}`, "kavrama", "Kenarlar toplanmaz; birim kare sayısı satır sayısı ile sütun sayısının çarpımıdır."], [`${n} = ${a} × ${b + 1}`, "dikkat", `Sütunları yeniden say; ${b} sütun var. Üstelik ${a} × ${b + 1} işlemi ${n} etmez.`], [`${2 * (a + b)} = ${a} × ${b}`, "kavrama", `${2 * (a + b)} dikdörtgenin çevresidir; birim kare sayısı ise ${a} × ${b} = ${n}'${ek(n, "dir").slice(1)}.`], [`${a * (b - 1)} = ${a} × ${b - 1}`, "dikkat", `Sütunları yeniden say; ${b} sütun var.`]],
        ipucu: "Satır sayısı × sütun sayısı = toplam birim kare.",
        cozum: ["🔎 Soruyu anlayalım: Birim karelerden oluşan dikdörtgenin hangi çarpma işlemini gösterdiğini bulacağız.", "💡 Hatırlayalım: Birim karelerle kurulan her dikdörtgenin kenarları, kare sayısının bir çarpan çiftidir: satır × sütun = toplam kare.", `✏️ Satırları sayalım: ${a}. Sütunları sayalım: ${b}.`, `✏️ Toplam birim kare: ${a} × ${b} = ${n}.`, `✅ Sonuç: Model ${n} = ${a} × ${b} çarpan çiftini gösterir; ${a} ve ${b}, ${n}${ek(n, "in")} çarpanlarıdır.`, `🔁 Kontrol edelim: Kareleri sıra sıra say: her satırda ${b} kare, ${a} satır → ${b} + … + ${b} (${a} kez) = ${n} ✓.`],
        kural: "Dikdörtgen modeli: satır × sütun = birim kare sayısı; kenarlar bir çarpan çiftidir." }); },
    z => { const n = sec([12, 18, 20, 24, 30, 36]); const ciftler = bolenler(n).filter(d => d * d <= n).map(d => [d, n / d]);
      let d; do { d = R(2, n - 1); } while (n % d === 0);
      return S({ kaz: "carpan.model", duzey: "transfer", zorluk: 2, soru: `${n} öğrenci, bahçede her sırada eşit sayıda öğrenci olacak ve kimse dışarıda kalmayacak biçimde sıralar hâlinde dizilecek.<br>Sıra sayısı aşağıdakilerden hangisi <b>olamaz</b>?`,
        dogru: `${d} sıra`, dogruNeden: `${n} ÷ ${d} işleminde ${n % d} kalır; ${d}, ${n}${ek(n, "in")} çarpanı değildir.`,
        yanlis: ciftler.slice(1).map(([a, b]) => [`${a} sıra`, "dikkat", `${a} sıra olabilir: ${a} × ${b} = ${n}. Soru “olamaz” olanı soruyor.`]).concat([[`${n} sıra`, "dikkat", `${n} sıra olabilir: her sırada 1 öğrenci olur (${n} × 1 = ${n}).`]]),
        ipucu: "Sıra sayısı, öğrenci sayısının çarpanı olmalı.",
        cozum: [`🔎 Soruyu anlayalım: ${n} öğrenci eşit sıralara dizilecek; olamayacak sıra sayısını arıyoruz.`, `💡 Hatırlayalım: Sıra sayısı × bir sıradaki öğrenci sayısı = ${n}. Bu yüzden sıra sayısı ${n}${ek(n, "in")} bir çarpanı olmalıdır.`, `✏️ ${n}${ek(n, "in")} çarpan çiftleri: ${ciftler.map(c => c[0] + " × " + c[1]).join(", ")}.`, `✏️ Çarpanlar: ${bolenler(n).join(", ")}. Seçeneklerden yalnızca ${d} bu listede yok.`, `✅ Sonuç: Sıra sayısı ${d} olamaz.`, `🔁 Kontrol edelim: ${n} ÷ ${d} = ${Math.floor(n / d)}, kalan ${n % d}; ${n % d} öğrenci dışarıda kalırdı.`],
        kural: "Eşit sıralara dizmede sıra sayısı toplamın çarpanı olmalıdır." }); },
  );
  ekle("carpan.say",
    z => { const n = sec([18, 24, 30, 36, 40, 42, 48, 60]); const b = bolenler(n), tl = b.filter(d => d % 2), tek = tl.length;
      return S({ kaz: "carpan.say", duzey: "uygulama", zorluk: 3, soru: `${n} sayısının çarpanlarından kaç tanesi tek sayıdır?`, dogru: tek, dogruNeden: `${n}${ek(n, "in")} tek çarpanları ${tl.join(", ")} → ${tek} tane.`,
        yanlis: [[b.length - tek, "dikkat", "Çift çarpanları saydın; soru tek olanları istiyor."], [b.length, "dikkat", "Bütün çarpanları saydın; yalnızca tek olanları saymalısın."], [tek - 1, "dikkat", "1'i unuttun; 1 de bir çarpandır ve tek sayıdır."], [tek + 1, "islem", "Çift olan bir çarpanı da tek saydın; 2'ye bölünen çarpanları ayır."]],
        ipucu: "Önce bütün çarpanları yaz, sonra tek olanları işaretle.",
        cozum: [`🔎 Soruyu anlayalım: ${n}${ek(n, "in")} çarpanlarından tek olanları sayacağız.`, "💡 Hatırlayalım: Çarpanları çiftler hâlinde (1 × n, 2 × …) yazarsak hiçbirini kaçırmayız. Tek sayılar 2'ye bölünmeyen sayılardır.", `✏️ Çarpan çiftleri: ${b.filter(d => d * d <= n).map(d => d + " × " + n / d).join(", ")}.`, `✏️ Bütün çarpanlar: ${b.join(", ")}.`, `✏️ Tek olanlar: ${tl.join(", ")}.`, `✅ Sonuç: ${tek} tane tek çarpan vardır.`, "🔁 Kontrol edelim: 1'i saymayı unutma; 1 her sayının çarpanıdır ve tektir."],
        kural: "Çarpanları çiftler hâlinde yaz; sonra istenen özellikteki (tek, çift, asal …) çarpanları say." }); },
  );
  ekle("kat.aralik",
    z => { const k = R(3, 9), bas = R(2, 4);
      const noktalar = [0, 1, 2, 3].map(i => ({ v: k * (bas + i), ad: "" })); const l = noktalar.map(n => n.v);
      return S({ kaz: "kat.aralik", duzey: "aciklama", zorluk: 1, soru: "Sayı doğrusunda kırmızı ile işaretlenen sayılar hangi sayının ardışık katlarıdır?",
        gorsel: G.sayiDogrusu({ min: k * (bas - 1), max: k * (bas + 4), adim: k, araAdim: 1, etiket: x => x, noktalar }), dogru: k, dogruNeden: `${l.join(", ")} sayıları ${k}${ek(k, "er")} artıyor ve hepsi ${k}${ek(k, "e")} kalansız bölünüyor.`,
        yanlis: [[k + 1, "islem", `İşaretli sayılar arasındaki farkı yeniden say: ${k} birim.`], [k * bas, "kavrama", "Bu, işaretli ilk sayıdır; soru bu sayıların hangi sayının katları olduğunu soruyor."], [2 * k, "dikkat", `Art arda iki işaretli sayının farkı ${k}; ${2 * k} değil.`], [k - 1, "islem", `İşaretli sayılar arasındaki farkı yeniden say: ${k} birim.`]],
        ipucu: "Art arda iki işaretli sayının farkı kaçtır?",
        cozum: ["🔎 Soruyu anlayalım: İşaretli sayıların hangi sayının ardışık katları olduğunu bulacağız.", "💡 Hatırlayalım: Bir sayının ardışık katları, o sayı kadar artarak ilerler: 7, 14, 21 … gibi.", `✏️ İşaretli sayılar: ${l.join(", ")}.`, `✏️ Farklar: ${l[1]} − ${l[0]} = ${k}, ${l[2]} − ${l[1]} = ${k}. Hep ${k} artıyor.`, `✅ Sonuç: Bunlar ${k}${ek(k, "in")} ardışık katlarıdır.`, `🔁 Kontrol edelim: ${l.map(v => `${v} = ${k} × ${v / k}`).join(", ")} ✓.`],
        kural: "Ardışık katlar arasındaki fark, katları alınan sayıya eşittir." }); },
    z => { const k = sec([6, 7, 8, 9, 11, 12, 13, 15]); const enk = Math.ceil(100 / k) * k;
      return S({ kaz: "kat.aralik", duzey: "uygulama", zorluk: 3, soru: `${k} sayısının katı olan en küçük üç basamaklı sayı kaçtır?`, dogru: enk, dogruNeden: `${enk} = ${k} × ${enk / k}; ondan önceki kat ${enk - k} iki basamaklıdır.`,
        yanlis: [[enk - k, "dikkat", `${enk - k} iki basamaklıdır; üç basamaklı en küçük kat istendi.`], [100, "islem", `100 ÷ ${k} işleminde ${100 % k} kalır; 100, ${k}${ek(k, "in")} katı değildir.`], [enk + k, "dikkat", "Bu da üç basamaklı bir kat ama en küçüğü değil."]],
        ipucu: "En küçük üç basamaklı sayı 100. 100'den sonraki ilk katı bul.",
        cozum: [`🔎 Soruyu anlayalım: ${k}${ek(k, "in")} katları arasında 100 ya da 100'den büyük olan ilkini arıyoruz.`, "💡 Hatırlayalım: En küçük üç basamaklı sayı 100'dür. Bir sayıdan büyük ilk katı bulmak için bölüp bölümü bir artırırız.", `✏️ 100 ÷ ${k} = ${Math.floor(100 / k)}, kalan ${100 % k}.`, `✏️ ${k} × ${Math.floor(100 / k)} = ${enk - k} (iki basamaklı). Bir sonraki kat: ${k} × ${Math.ceil(100 / k)} = ${enk}.`, `✅ Sonuç: ${enk}.`, `🔁 Kontrol edelim: ${enk} ÷ ${k} = ${enk / k}, kalan 0 ve ${enk} üç basamaklı ✓.`],
        kural: "Bir sayıdan büyük ilk katı bulmak için böl, bölümü 1 artır ve tekrar çarp." }); },
  );
  ekle("bol.ayirt",
    z => { const ad = sec([[6, "hem 2'ye hem 3'e", n => n % 6 === 0, 3], [10, "hem 2'ye hem 5'e", n => n % 10 === 0, 5], [18, "hem 2'ye hem 9'a", n => n % 18 === 0, 9]]);
      const d = ad[0] * R(6, 50); let y = []; while (y.length < 3) { const x = R(100, 999); if (!ad[2](x) && !y.includes(x) && (x % 2 === 0 || x % ad[3] === 0)) y.push(x); }
      const acik = x => `${x}: ${x % 2 === 0 ? "çift ✓" : "tek ✗"}, ${ad[3]}${ek(ad[3], "e")} ${x % ad[3] === 0 ? "bölünür ✓" : "bölünmez ✗"}`;
      return S({ kaz: "bol.ayirt", duzey: "uygulama", zorluk: 2, soru: `Aşağıdaki sayılardan hangisi ${ad[1]} kalansız bölünür?`, dogru: d, dogruNeden: `${d} çifttir ve ${ad[3]}${ek(ad[3], "e")} bölünür; ${d} ÷ ${ad[0]} = ${d / ad[0]}.`,
        yanlis: y.map(x => [x, "dikkat", `${x} ${x % 2 === 0 ? `çifttir ama ${ad[3]}${ek(ad[3], "e")} bölünmez` : `${ad[3]}${ek(ad[3], "e")} bölünür ama tektir`}; iki kuralı birden sağlamalı.`]),
        ipucu: "İki kuralı ayrı ayrı kontrol et; ikisi de sağlanmalı.",
        cozum: [`🔎 Soruyu anlayalım: ${ad[1]} birlikte bölünen sayıyı arıyoruz.`, `💡 Hatırlayalım: 2 → birler basamağı çift. ${ad[3] === 5 ? "5 → birler basamağı 0 ya da 5." : `${ad[3]} → rakamlar toplamı ${ad[3]}${ek(ad[3], "in")} katı.`} İki koşul birlikte sağlanırsa sayı ${ad[0]}${ek(ad[0], "e")} de bölünür.`, `✏️ ${acik(d)}.`, `✏️ ${y.map(acik).join("; ")}.`, `✅ Sonuç: ${d} sayısı iki koşulu da sağlar.`, `🔁 Kontrol edelim: ${d} ÷ ${ad[0]} = ${d / ad[0]}, kalan 0 ✓.`],
        kural: "6 = 2 ve 3; 10 = 2 ve 5; 18 = 2 ve 9. İki kural birlikte sağlanmalı." }); },
  );
  ekle("asal.ayir",
    z => { const n = sec([24, 36, 40, 48, 54, 60, 72, 84, 90]); const a = carpanAgaci(n, null); const bosIdx = sec([1, 2, 4].filter(i => i < a.dugum.length)); const b = carpanAgaci(n, bosIdx);
      const dogru = b.dugum[bosIdx];
      return S({ kaz: "asal.ayir", duzey: "uygulama", zorluk: 2, soru: `${n} sayısının çarpan ağacında soru işaretli (sarı) kutuya hangi sayı gelmelidir?`, gorsel: b.gorsel, dogru, dogruNeden: "Her dalda sol kutu × sağ kutu, üstteki sayıya eşit olmalıdır; bu ancak bu sayıyla sağlanır.",
        yanlis: [[dogru + 1, "islem", "Bu sayıyla dal çarpımı üstteki sayıyı vermiyor; sol × sağ = üst olmalı."], [dogru * 2, "islem", "İki katını yazdın; dal çarpımını yeniden kontrol et."], [Math.max(1, dogru - 1), "islem", "Bu sayıyla dal çarpımı üstteki sayıyı vermiyor; sol × sağ = üst olmalı."]],
        ipucu: "Her dalda: sol kutu × sağ kutu = üstteki kutu.",
        cozum: [`🔎 Soruyu anlayalım: ${n}${ek(n, "in")} çarpan ağacındaki eksik kutuyu bulacağız.`, "💡 Hatırlayalım: Çarpan ağacında her sayı iki çarpanına ayrılır: sol × sağ = üstteki sayı. Asal sayıya ulaşınca dal biter.", `✏️ Dallar: ${b.adimlar.map(([v, p, k]) => `${v} = ${p} × ${k}`).join("; ")}.`, `✏️ Soru işaretli kutuya ${dogru} gelirse bütün dallar doğru olur.`, `✅ Sonuç: ${dogru}.`, `🔁 Kontrol edelim: Yeşil kutular asal çarpanlardır: ${n} = ${ustlu(asalCarpan(n))} ✓.`],
        kural: "Çarpan ağacında her sayı iki çarpanına ayrılır; asal sayıya ulaşınca dal biter." }); },
  );
  ekle("asal.tani",
    z => { const bas = sec([20, 30, 40, 50, 60, 70]); const l = []; for (let i = bas; i <= bas + 10; i++) if (asalMi(i)) l.push(i); const n = l.length; const tekler = Array.from({ length: 11 }, (_, i) => bas + i).filter(x => x % 2);
      return S({ kaz: "asal.tani", duzey: "uygulama", zorluk: 2, soru: `${bas} ile ${bas + 10} arasında (ikisi de dahil) kaç tane asal sayı vardır?`, dogru: n, dogruNeden: `Bu aralıktaki asal sayılar: ${l.join(", ")}.`,
        yanlis: [[n + 1, "kavrama", `Asal olmayan bir tek sayıyı asal saydın; örneğin ${bas + (bas % 3 === 0 ? 3 : 5)} sayısını kontrol et.`], [Math.max(0, n - 1), "dikkat", "Bir asal sayıyı atladın; tek sayıları yeniden kontrol et."], [tekler.length, "kavrama", "Tek sayıları saydın; her tek sayı asal değildir."]],
        ipucu: "Çift sayıları ele. Kalan tek sayıları 3, 5, 7'ye böl.",
        cozum: [`🔎 Soruyu anlayalım: ${bas}–${bas + 10} arasındaki asal sayıları sayacağız.`, "💡 Hatırlayalım: Asal sayının yalnızca iki çarpanı vardır: 1 ve kendisi. 2 dışında çift sayılar asal değildir.", `✏️ Tek sayılar: ${tekler.join(", ")}.`, `✏️ 3, 5 ya da 7'ye bölünenleri eleyelim: ${tekler.filter(x => !asalMi(x)).map(x => `${x} = ${bolenler(x)[1]} × ${x / bolenler(x)[1]}`).join("; ")}.`, `✅ Sonuç: Asal sayılar ${l.join(", ")} → ${n} tane.`, "🔁 Kontrol edelim: 100'den küçük bir sayı 2, 3, 5 ve 7'ye bölünmüyorsa asaldır."],
        kural: "100'den küçük bir sayı 2, 3, 5, 7'ye bölünmüyorsa asaldır (1 hariç)." }); },
  );
  ekle("okat.ekok",
    z => { const [a, b] = sec([[4, 6], [6, 8], [6, 9], [8, 12], [9, 12], [10, 15], [12, 18], [4, 10]]); const e = ekok(a, b);
      const kat = x => Array.from({ length: Math.min(8, e / x + 2) }, (_, i) => x * (i + 1));
      return S({ kaz: "okat.ekok", duzey: "aciklama", zorluk: 1, soru: `Tabloda ${a} ve ${b} sayılarının katları verilmiştir. Bu iki sayının en küçük ortak katı kaçtır?`,
        gorsel: G.tablo(["Sayı", "Katları"], [[a, kat(a).join(", ") + ", …"], [b, kat(b).join(", ") + ", …"]]), dogru: e, dogruNeden: `${e}, iki satırda da bulunan en küçük sayıdır.`,
        yanlis: [[a * b, "strateji", `${a} × ${b} = ${a * b} ortak kattır ama en küçüğü değil; sayıları çarpmak her zaman EKOK'u vermez.`], [ebob(a, b), "kavrama", "Bu, en büyük ortak bölendir (EBOB); soru en küçük ortak katı istiyor."], [2 * e, "dikkat", "Bu da ortak kat ama en küçüğü değil."], [3 * e, "dikkat", "Bu da ortak kat ama en küçüğü değil."]],
        ipucu: "İki satırda da bulunan en küçük sayıyı ara.",
        cozum: [`🔎 Soruyu anlayalım: ${a} ve ${b}${ek(b, "in")} katlarında ortak olan en küçük sayıyı bulacağız.`, "💡 Hatırlayalım: EKOK, iki sayının da katı olan, sıfırdan büyük en küçük sayıdır.", `✏️ ${a}${ek(a, "in")} katları: ${kat(a).join(", ")} …`, `✏️ ${b}${ek(b, "in")} katları: ${kat(b).join(", ")} …`, `✅ Sonuç: İki listede de bulunan ilk sayı ${e}; EKOK = ${e}.`, `🔁 Kontrol edelim: ${e} ÷ ${a} = ${e / a} ve ${e} ÷ ${b} = ${e / b}; ikisinde de kalan yok ✓.`],
        kural: "EKOK: iki sayının katlarında ortak olan, sıfırdan büyük en küçük sayı." }); },
  );
  ekle("obol.problem",
    z => { const [a, b] = sec([[12, 18], [16, 24], [18, 24], [20, 30], [24, 36], [30, 45]]); const g = ebob(a, b);
      return S({ kaz: "obol.problem", duzey: "transfer", zorluk: 2, soru: `Kenar uzunlukları ${a} m ve ${b} m olan dikdörtgen bir bahçe, hiç boşluk kalmadan eş ve en büyük karelere bölünecek. Bir karenin kenarı kaç metre olur?`,
        gorsel: G.svg(420, 60 + 180 * a / Math.max(a, b), `<rect class="g-yumusak g-cizgi" x="60" y="20" width="${300 * b / Math.max(a, b)}" height="${180 * a / Math.max(a, b)}" stroke-width="2"/>` + G.yazi(60 + 150 * b / Math.max(a, b), 48 + 180 * a / Math.max(a, b), b + " m") + G.yazi(40, 20 + 90 * a / Math.max(a, b), a + " m", { a: "end" }), "dikdörtgen bahçe"),
        dogru: g, dogruNeden: `${g}, ${a} ve ${b}${ek(b, "in")} ortak bölenlerinin en büyüğüdür (EBOB).`,
        yanlis: [[ekok(a, b), "kavrama", "Bu en küçük ortak kattır; bir bütünü parçalara bölmede ortak bölen kullanılır."], [Math.max(...bolenler(g).filter(x => x < g)), "strateji", "Bu da bir ortak bölendir ama en büyüğü değil; daha büyük kareler de iki kenarı tam böler."], [(a / g) * (b / g), "dikkat", "Bu, oluşan kare sayısıdır; soru bir karenin kenar uzunluğunu soruyor."], [2 * g, "islem", `${2 * g} iki kenarı birden kalansız bölmez; örneğin ${a} ÷ ${2 * g} kalanlıdır ya da ${b} ÷ ${2 * g} kalanlıdır.`]],
        ipucu: "Karenin kenarı iki kenarı da tam bölmeli ve en büyük olmalı.",
        cozum: [`🔎 Soruyu anlayalım: ${a} m × ${b} m bahçe eş ve en büyük karelere bölünecek; karenin kenarını arıyoruz.`, `💡 Hatırlayalım: Karenin kenarı hem ${a}${ek(a, "i")} hem ${b}${ek(b, "i")} kalansız bölmeli (ortak bölen); “en büyük” dendiği için EBOB.`, `✏️ ${a}${ek(a, "in")} bölenleri: ${bolenler(a).join(", ")}.`, `✏️ ${b}${ek(b, "in")} bölenleri: ${bolenler(b).join(", ")}. Ortak olanların en büyüğü: ${g}.`, `✅ Sonuç: Karenin kenarı ${g} m olur.`, `🔁 Kontrol edelim: ${a} ÷ ${g} = ${a / g} ve ${b} ÷ ${g} = ${b / g}; bahçe ${a / g} × ${b / g} = ${(a / g) * (b / g)} kareye tam bölünür ✓.`],
        kural: "Bir alanı eş ve en büyük karelere bölmek → kenarların EBOB'u." }); },
  );
  /* ---------------- Tema 2 ---------------- */
  ekle("ol.tahmin",
    z => { const renk = ["Kırmızı", "Mavi", "Sarı", "Yeşil"]; const n = sec([40, 50, 60]); let d; do { d = [R(4, 20), R(4, 20), R(4, 20)]; } while (d.reduce((a, b) => a + b, 0) >= n - 3); d.push(n - d.reduce((a, b) => a + b, 0)); const i = R(0, 3);
      return S({ kaz: "ol.tahmin", duzey: "uygulama", zorluk: 2, soru: `Dört renkli bir çark ${n} kez çevrildi ve sonuçlar grafikte gösterildi. ${renk[i]} gelme olasılığının gözleme dayalı tahmini nedir?`,
        gorsel: G.sutun(renk.map((r, j) => [r, d[j]]), { baslik: `${n} çevirişin sonuçları`, birim: "kez" }), dogru: kesir(d[i], n), dogruNeden: `${renk[i]} ${n} çevirişte ${d[i]} kez gelmiştir: ${d[i]}/${n} = ${kesir(d[i], n)}.`,
        yanlis: [[kesir(d[i], n - d[i]), "kavrama", "Toplam deneme sayısına bölmelisin, diğer renklerin toplamına değil."], ["1/4", "kavrama", "Dört renk var diye olasılık 1/4 değildir; gözleme dayalı tahmin deney sonuçlarından hesaplanır."], [kesir(n - d[i], n), "dikkat", `Bu, ${renk[i].toLocaleLowerCase("tr-TR")} gelmeme olasılığının tahminidir.`], [kesir(d[(i + 1) % 4], n), "dikkat", `Bu, ${renk[(i + 1) % 4].toLocaleLowerCase("tr-TR")} gelme tahminidir; grafikte doğru sütunu oku.`]],
        ipucu: "Gelme sayısı ÷ toplam çeviriş sayısı.",
        cozum: [`🔎 Soruyu anlayalım: Çark ${n} kez çevrilmiş; ${renk[i].toLocaleLowerCase("tr-TR")} gelme olasılığını tahmin edeceğiz.`, "💡 Hatırlayalım: Gözleme dayalı olasılık = olayın gerçekleşme sayısı ÷ toplam deneme sayısı.", `✏️ Grafikten ${renk[i]} sütununu okuyalım: ${d[i]} kez.`, `✏️ Toplam çeviriş: ${d.join(" + ")} = ${n}.`, `✅ Sonuç: Tahmin ${d[i]}/${n}${kesir(d[i], n) !== d[i] + "/" + n ? " = " + kesir(d[i], n) : ""}.`, "🔁 Kontrol edelim: Dört rengin tahminlerini toplarsan 1 eder; payda her zaman toplam çeviriş sayısıdır."],
        kural: "Gözleme dayalı olasılık = gerçekleşme sayısı ÷ toplam deneme sayısı." }); },
  );
  ekle("ol.yorum",
    z => { const r = karistir(["kırmızı", "mavi", "yeşil", "sarı"]).slice(0, 3); const sayi = karistir([2, 3, 5]); const t = {}; r.forEach((x, i) => { t[x] = sayi[i]; }); const enCok = r[sayi.indexOf(5)]; const B = x => x[0].toLocaleUpperCase("tr-TR") + x.slice(1);
      return S({ kaz: "ol.yorum", duzey: "aciklama", zorluk: 1, soru: "Torbadan bakmadan bir top çekilecek. Hangi renk topun çekilme olasılığı en yüksektir?", gorsel: G.torba(t), dogru: B(enCok), dogruNeden: `Torbada en çok ${enCok} top (${t[enCok]} tane) vardır.`,
        yanlis: r.filter(x => x !== enCok).map(x => [B(x), "dikkat", `${B(x)} toplar daha az (${t[x]} tane); sayısı az olanın çekilme olasılığı düşüktür.`]).concat([["Hepsinin olasılığı eşittir", "kavrama", "Renklerin sayıları farklı; sayısı çok olanın olasılığı yüksektir."]]),
        ipucu: "Her renkten kaç top var? Say.",
        cozum: ["🔎 Soruyu anlayalım: Torbadan çekilme olasılığı en yüksek olan rengi bulacağız.", "💡 Hatırlayalım: Bir renkten ne kadar çok top varsa o rengin çekilme olasılığı o kadar yüksektir.", `✏️ Topları sayalım: ${r.map(x => t[x] + " " + x).join(", ")}.`, `✏️ En çok olan: ${enCok} (${t[enCok]} top). Toplam ${10} top içinde ${t[enCok]} tanesi ${enCok}.`, `✅ Sonuç: En olası renk ${enCok}.`, "🔁 Kontrol edelim: “En olası” demek “kesin” demek değildir; başka renk de çekilebilir ama şansı daha düşüktür."],
        kural: "Sayısı en çok olan sonucun olasılığı en yüksektir." }); },
  );
  /* ---------------- Tema 3 ---------------- */
  ekle("bas.deger",
    z => { const tam = R(1, 8), on = R(1, 9);
      return S({ kaz: "bas.deger", duzey: "uygulama", zorluk: 1, soru: "Sayı doğrusunda kırmızı nokta hangi sayıyı gösterir?",
        gorsel: G.sayiDogrusu({ min: tam, max: tam + 1, adim: 1, araAdim: 0.1, etiket: x => od(x), noktalar: [{ v: tam + on / 10 }] }), dogru: od(tam + on / 10), dogruNeden: `Nokta ${tam}'${ek(tam, "den").slice(1)} sonra ${on}. çentikte: ${tam} + ${on} × 0,1 = ${od(tam + on / 10)}.`,
        yanlis: [[od(tam + on / 100), "kavrama", "Aralıklar onda birdir (0,1), yüzde bir değil."], on === 5 ? [od(tam + 0.4), "dikkat", "Çentikleri yeniden say; bir çentik eksik saydın."] : [`${tam},${10 - on}`, "dikkat", `Çentikleri soldan, ${tam}'${ek(tam, "den").slice(1)} başlayarak say.`], [od(tam + 1 + on / 10), "dikkat", `Nokta ${tam} ile ${tam + 1} arasında.`]],
        ipucu: `${tam} ile ${tam + 1} arası 10 eş parçaya bölünmüş; her parça 0,1.`,
        cozum: ["🔎 Soruyu anlayalım: Sayı doğrusundaki kırmızı noktanın gösterdiği ondalık sayıyı bulacağız.", "💡 Hatırlayalım: 1 bütün 10 eş parçaya bölünürse her parça 0,1 (onda bir) olur.", `✏️ ${tam} ile ${tam + 1} arası 10 eş parçaya bölünmüş; her çentik 0,1 artar.`, `✏️ Kırmızı nokta ${tam}'${ek(tam, "den").slice(1)} sonra ${on}. çentikte: ${tam} + ${on} × 0,1.`, `✅ Sonuç: ${od(tam + on / 10)}.`, `🔁 Kontrol edelim: Nokta ${tam + 1}'${ek(tam + 1, "e").slice(1)} ${10 - on} çentik uzaklıkta; ${od(tam + on / 10)} + ${od((10 - on) / 10)} = ${tam + 1} ✓.`],
        kural: "Sayı doğrusunda 1 birim 10 eş parçaya bölünmüşse her çentik 0,1'dir." }); },
  );
  ekle("yuv.kural",
    z => { const a = R(1, 9), b = R(1, 8), c = R(1, 9); const x = a + b / 10 + c / 100; const yuk = c >= 5; const sonuc = od(yuk ? a + (b + 1) / 10 : a + b / 10);
      return S({ kaz: "yuv.kural", duzey: "aciklama", zorluk: 2, soru: `Sayı doğrusundaki ${od(x)} sayısı en yakın onda birliğe yuvarlanırsa hangi sayı elde edilir?`,
        gorsel: G.sayiDogrusu({ min: a + b / 10, max: a + (b + 1) / 10, adim: 0.1, araAdim: 0.01, etiket: v => od(v), noktalar: [{ v: x, ad: od(x) }] }), dogru: sonuc, dogruNeden: `Yüzde birler rakamı ${c}; ${yuk ? "5 ya da büyük olduğu için yukarı" : "5'ten küçük olduğu için aşağı"} yuvarlanır: ${sonuc}.`,
        yanlis: [[od(yuk ? a + b / 10 : a + (b + 1) / 10), "kavrama", `Yüzde birler rakamı ${c}; ${yuk ? "5 ya da büyük olduğu için yukarı" : "5'ten küçük olduğu için aşağı"} yuvarlanır.`], [od(Math.round(x)), "dikkat", "Bu, en yakın tam sayıya yuvarlamadır; soru onda birliğe yuvarlamayı istiyor."], [od(x), "kavrama", "Sayıyı olduğu gibi yazdın; yuvarlama yapmadın."]],
        ipucu: "Nokta hangi uca daha yakın?",
        cozum: [`🔎 Soruyu anlayalım: ${od(x)} sayısını en yakın onda birliğe yuvarlayacağız.`, "💡 Hatırlayalım: Onda birlere yuvarlarken yüzde birler rakamına bakarız: 5 ya da büyükse onda birler 1 artar, küçükse aynı kalır.", `✏️ ${od(x)} sayısı ${od(a + b / 10)} ile ${od(a + (b + 1) / 10)} arasında.`, `✏️ Yüzde birler rakamı ${c}: ${yuk ? "5 ya da daha büyük → yukarı" : "5'ten küçük → aşağı"} yuvarlanır.`, `✅ Sonuç: ${sonuc}.`, `🔁 Kontrol edelim: Sayı doğrusunda nokta ${sonuc} ucuna daha yakın görünüyor ✓.`],
        kural: "Yuvarlanacak basamağın sağındaki rakam 5 ya da büyükse yukarı, küçükse aşağı yuvarla." }); },
  );
  ekle("kb.iliski",
    z => { const q = sec([3, 4, 5, 8, 10]), p = R(1, q - 1); if (2 * p === q) return null;
      return S({ kaz: "kb.iliski", duzey: "aciklama", zorluk: 1, soru: "Şekildeki şeridin boyalı kısmı hangi bölme işleminin sonucunu gösterir?", gorsel: G.kesirSeridi(p, q), dogru: `${p} ÷ ${q}`, dogruNeden: `Boyalı kısım ${p}/${q}'${ek(q, "dir").slice(1)} ve ${p}/${q} = ${p} ÷ ${q}.`,
        yanlis: [[`${q} ÷ ${p}`, "kavrama", "Boyalı parça sayısı bölünen, toplam parça sayısı bölendir; yerlerini değiştirdin."], [`${q - p} ÷ ${q}`, "dikkat", "Bu, boyasız kısmı gösterir."], [`${p} × ${q}`, "bilgi", "Kesir çizgisi bölme demektir, çarpma değil."]],
        ipucu: "Boyalı parça / toplam parça yaz; kesir çizgisi bölmedir.",
        cozum: ["🔎 Soruyu anlayalım: Şeridin boyalı kısmının hangi bölme işlemine eşit olduğunu bulacağız.", "💡 Hatırlayalım: a/b kesri a ÷ b bölmesidir; pay bölünen, payda bölendir.", `✏️ Şerit ${q} eş parçaya bölünmüş, ${p} parçası boyalı: ${p}/${q}.`, `✏️ Kesir çizgisi bölme demektir: ${p}/${q} = ${p} ÷ ${q}.`, `✅ Sonuç: ${p} ÷ ${q}.`, `🔁 Kontrol edelim: ${p} ÷ ${q} = ${od(p / q)}; boyalı kısım bütünün yarısından ${p / q > 0.5 ? "fazla" : "az"}, ${od(p / q)} de 0,5'ten ${p / q > 0.5 ? "büyük" : "küçük"} ✓.`],
        kural: "a/b = a ÷ b. Pay bölünen, payda bölendir." }); },
  );
  ekle("pr.para",
    z => { const urun = karistir([["Defter", R(3, 6) * 500 + 50], ["Kalem", R(4, 12) * 100 + 25], ["Silgi", R(2, 6) * 100 + 75], ["Cetvel", R(5, 12) * 100 + 50], ["Boya", R(20, 40) * 100 + 90]]).slice(0, 3);
      const tl = k => (k / 100).toFixed(2).replace(".", ","); const top = urun.reduce((a, u) => a + u[1], 0); const verilen = top < 5000 ? 50 : 100; const ustu = verilen * 100 - top;
      return S({ kaz: "pr.para", duzey: "transfer", zorluk: 2, soru: `Kırtasiye fişi aşağıdadır. Kasaya ${verilen} TL veren Zeynep kaç TL para üstü alır?`,
        gorsel: G.tablo(["Ürün", "Fiyat"], urun.map(u => [u[0], tl(u[1]) + " TL"]).concat([["<b>Toplam</b>", "?"]])), dogru: tl(ustu) + " TL", dogruNeden: `Toplam ${tl(top)} TL; ${verilen} − ${tl(top)} = ${tl(ustu)} TL.`,
        yanlis: [[tl(top) + " TL", "dikkat", "Bu toplam tutardır; para üstü için verilen paradan çıkarmalısın."], [tl(ustu + 100) + " TL", "islem", "Çıkarmada onluk bozarken hata yaptın; virgülleri alt alta getirip yeniden hesapla."], [tl(ustu - 10) + " TL", "islem", "Toplamada kuruşları yanlış topladın; toplamı yeniden kontrol et."]],
        ipucu: "Önce toplamı bul, sonra verilen paradan çıkar.",
        cozum: ["🔎 Soruyu anlayalım: Fişteki ürünlerin toplamını bulup verilen paradan çıkaracağız.", "💡 Hatırlayalım: Ondalık gösterimle toplama ve çıkarmada virgüller alt alta gelir; eksik basamaklara 0 yazılır.", `✏️ Toplam: ${urun.map(u => tl(u[1])).join(" + ")} = ${tl(top)} TL.`, `✏️ Para üstü: ${verilen},00 − ${tl(top)} = ${tl(ustu)} TL.`, `✅ Sonuç: Zeynep ${tl(ustu)} TL para üstü alır.`, `🔁 Kontrol edelim: ${tl(top)} + ${tl(ustu)} = ${verilen},00 TL ✓.`],
        kural: "Para üstü = verilen para − toplam tutar; virgüller alt alta." }); },
  );
  ekle("uz.donustur",
    z => { let mm; do { mm = R(23, 89); } while (mm % 10 === 0);
      return S({ kaz: "uz.donustur", duzey: "uygulama", zorluk: 1, soru: "Sarı çubuğun uzunluğu cetvelle ölçülüyor. Çubuk kaç santimetredir?", gorsel: G.cetvel(mm), dogru: od(mm / 10) + " cm", dogruNeden: `${Math.floor(mm / 10)} cm ${mm % 10} mm = ${od(mm / 10)} cm.`,
        yanlis: [[mm + " cm", "kavrama", "Küçük çentikler milimetredir; 10 mm = 1 cm."], [Math.floor(mm / 10) + " cm", "dikkat", "Milimetre kısmını da eklemelisin."], [od(mm / 100) + " cm", "islem", "1 cm = 10 mm; 100'e değil 10'a bölmelisin."]],
        ipucu: "Büyük çentikler cm, küçük çentikler mm.",
        cozum: ["🔎 Soruyu anlayalım: Sarı çubuğun boyunu cetvelden okuyup santimetre olarak yazacağız.", "💡 Hatırlayalım: Cetveldeki büyük çentikler santimetreyi, küçük çentikler milimetreyi gösterir. 1 cm = 10 mm, yani 1 mm = 0,1 cm.", `✏️ Çubuk ${Math.floor(mm / 10)} tam santimetreyi geçiyor.`, `✏️ Sonra ${mm % 10} küçük çentik (mm) daha var: ${mm % 10} mm = ${od((mm % 10) / 10)} cm.`, `✅ Sonuç: ${Math.floor(mm / 10)} cm ${mm % 10} mm = ${od(mm / 10)} cm.`, `🔁 Kontrol edelim: Toplam ${mm} mm; ${mm} ÷ 10 = ${od(mm / 10)} cm ✓.`],
        kural: "1 cm = 10 mm; mm'den cm'ye geçerken 10'a böl." }); },
  );
  /* ---------------- Tema 4 ---------------- */
  ekle("me.ortalama",
    z => { const gun = ["Pzt", "Salı", "Çrş", "Prş", "Cuma"]; let v; do { v = gun.map(() => R(5, 30)); } while (v.reduce((a, b) => a + b, 0) % 5); const t = v.reduce((a, b) => a + b, 0);
      return S({ kaz: "me.ortalama", duzey: "uygulama", zorluk: 2, soru: "Grafikte Elif'in bir hafta boyunca her gün okuduğu sayfa sayısı verilmiştir. Elif günde ortalama kaç sayfa okumuştur?",
        gorsel: G.sutun(gun.map((g, i) => [g, v[i]]), { baslik: "Okunan sayfa sayısı", birim: "sayfa" }), dogru: t / 5, dogruNeden: `Toplam ${t} sayfa, 5 gün: ${t} ÷ 5 = ${t / 5}.`,
        yanlis: [[t, "bilgi", "Bu toplamdır; gün sayısına (5) bölmelisin."], [[...v].sort((a, b) => a - b)[2], "kavrama", "Bu ortancadır; ortalama toplam ÷ gün sayısıdır."], [Math.max(...v) - Math.min(...v), "kavrama", "Bu açıklıktır (en büyük − en küçük)."], [Math.max(...v), "kavrama", "Bu, en çok sayfa okunan günün değeridir; ortalama değildir."], [Math.round(t / 4), "islem", "4'e böldün; grafikte 5 gün var."]],
        ipucu: "Beş sütunun değerini topla ve 5'e böl.",
        cozum: ["🔎 Soruyu anlayalım: Beş günde okunan sayfaların ortalamasını bulacağız.", "💡 Hatırlayalım: Aritmetik ortalama = değerlerin toplamı ÷ veri sayısı.", `✏️ Grafikten değerleri okuyalım: ${v.join(", ")}.`, `✏️ Toplam: ${v.join(" + ")} = ${t}.`, `✅ Sonuç: Ortalama ${t} ÷ 5 = ${t / 5} sayfa.`, `🔁 Kontrol edelim: Ortalama, en küçük (${Math.min(...v)}) ile en büyük (${Math.max(...v)}) değer arasında olmalı; ${t / 5} bu aralıkta ✓.`],
        kural: "Aritmetik ortalama = toplam ÷ veri sayısı." }); },
  );
  ekle("me.ortanca",
    z => { const ad = karistir(["Ali", "Ece", "Can", "Naz", "Efe", "Su", "Arda"]).slice(0, 5); let v; do { v = ad.map(() => R(120, 160)); } while (new Set(v).size < 5); const s = [...v].sort((a, b) => a - b); if (v[2] === s[2]) return null;
      return S({ kaz: "me.ortanca", duzey: "uygulama", zorluk: 2, soru: "Tabloda beş öğrencinin boy uzunlukları verilmiştir. Bu verinin ortancası kaç cm'dir?",
        gorsel: G.tablo(["Öğrenci", ...ad], [["Boy (cm)", ...v]]), dogru: s[2], dogruNeden: `Sıralı veride ortadaki (3.) değer ${s[2]}'${ek(s[2], "dir").slice(1)}.`,
        yanlis: [[v[2], "dikkat", "Tablodaki sırayla ortadakini aldın; önce küçükten büyüğe sıralamalısın."], [Math.round(v.reduce((a, b) => a + b, 0) / 5), "kavrama", "Bu, ortalamaya yakın bir değer; ortanca sıralı verinin ortasıdır."], [s[4] - s[0], "kavrama", "Bu açıklıktır."], [s[1], "islem", "Sıralı veride 2. değeri aldın; 5 veride ortanca 3. değerdir."], [s[3], "islem", "Sıralı veride 4. değeri aldın; 5 veride ortanca 3. değerdir."]],
        ipucu: "Boyları küçükten büyüğe sırala, ortadakini bul.",
        cozum: ["🔎 Soruyu anlayalım: Beş boy uzunluğunun ortancasını bulacağız.", "💡 Hatırlayalım: Ortanca, veriler küçükten büyüğe sıralandığında ortada kalan değerdir.", `✏️ Sıralayalım: ${s.join(", ")}.`, "✏️ 5 veri var; ortadaki 3. değerdir (iki yanında 2'şer veri kalır).", `✅ Sonuç: Ortanca ${s[2]} cm.`, `🔁 Kontrol edelim: ${s[2]}'${ek(s[2], "den").slice(1)} küçük 2, büyük 2 değer var ✓.`],
        kural: "Ortanca için önce sırala, sonra ortadakini al." }); },
  );
  ekle("ar.veri",
    z => { const v = sec([["Okula ulaşım şekli", ["Yürüyerek", "Servis", "Otobüs", "Araba"], "kategorik"], ["Kardeş sayısı", ["0", "1", "2", "3"], "nicel"]]); const d = v[1].map(() => R(2, 10)); const nic = v[2] === "nicel";
      return S({ kaz: "ar.veri", duzey: "aciklama", zorluk: 2, soru: `Bir sınıfta “${v[0]}” sorusunun cevapları grafikte gösterilmiştir. Toplanan veri hangi türdendir?`,
        gorsel: G.sutun(v[1].map((a, i) => [a, d[i]]), { baslik: v[0], birim: "kişi" }), dogru: nic ? "Nicel veri" : "Kategorik veri", dogruNeden: nic ? "Cevaplar sayılarak elde edilen sayılardır (kardeş sayısı)." : "Cevaplar birer ad ya da gruptur (ulaşım şekli).",
        yanlis: [[nic ? "Kategorik veri" : "Nicel veri", "kavrama", nic ? "Cevaplar sayıdır (kaç kardeş); bu yüzden veri nicel." : "Cevaplar birer ad/gruptur; grafikte sayı olması verinin türünü değiştirmez."], ["Grafikte sayı olduğu için her zaman nicel veri", "kavrama", "Grafikteki sayılar kişi sayısıdır; verinin türü cevaplara bakılarak belirlenir."], ["Veri türü belirlenemez", "bilgi", "Cevaplara bakarak veri türü belirlenebilir."]],
        ipucu: "Grafiğin altındaki cevaplara bak: sayı mı, ad mı?",
        cozum: ["🔎 Soruyu anlayalım: Grafikte gösterilen verinin kategorik mi nicel mi olduğunu bulacağız.", "💡 Hatırlayalım: Nicel veri sayılır ya da ölçülür; kategorik veri bir grubu ya da özelliği belirtir. Tür, kişilerin verdiği cevaplara göre belirlenir.", `✏️ Cevaplar: ${v[1].join(", ")} → ${nic ? "sayı (sayılarak bulunuyor)" : "ad/grup"}.`, "✏️ Sütunların yüksekliği (kişi sayısı) her grafikte sayıdır; bu, verinin türünü belirlemez.", `✅ Sonuç: Toplanan veri ${v[2]} veridir.`, "🔁 Kontrol edelim: Kendine sor: “Bir öğrencinin cevabı bir sayı mı?” Evet ise nicel, hayır ise kategorik."],
        kural: "Veri türü cevaplara göre belirlenir: sayı → nicel, ad/özellik → kategorik." }); },
  );

  /* ---------------- Kazanım başına “Unutma” kuralları ---------------- */
  const KURAL = {
    "carpan.bul": "Bir sayıyı kalansız bölen sayılar onun çarpanıdır. 1 ve sayının kendisi her zaman çarpandır.",
    "carpan.say": "Çarpanları çiftler hâlinde yaz (1 × n, 2 × …). Kare sayılarda ortadaki çarpan bir kez sayılır.",
    "carpan.model": "Birim karelerle kurulan her dikdörtgenin kenarları bir çarpan çiftidir: satır × sütun = sayı.",
    "kat.bul": "Bir sayının katları, o sayının 0, 1, 2, 3, … ile çarpılmasıyla bulunur ve sonsuza kadar gider.",
    "kat.aralik": "Bir aralıktaki katları bulmak için aralığın başındaki ilk katı bul, sonra sayıyı ekleyerek ilerle.",
    "kat.problem": "“… dakikada bir”, “…'er …'er sayınca artmıyor” ifadeleri kat demektir.",
    "bol.kural": "2: son rakam çift · 3: rakamlar toplamı 3'ün katı · 4: son iki basamak 4'ün katı · 5: son rakam 0 ya da 5 · 6: hem 2 hem 3 · 9: rakamlar toplamı 9'un katı · 10: son rakam 0.",
    "bol.rakam": "Eksik rakam sorularında önce kuralı yaz, sonra 0'dan 9'a kadar rakamları dene.",
    "bol.ayirt": "6'ya bölünme = 2'ye ve 3'e bölünme; 10'a bölünme = 2'ye ve 5'e bölünme.",
    "asal.tani": "Asal sayının yalnızca iki çarpanı vardır: 1 ve kendisi. 1 asal değildir; 2 tek çift asal sayıdır.",
    "asal.ayir": "Asal çarpanlara ayırırken en küçük asal sayıdan (2) başlayarak böl; bölüm 1 olunca dur.",
    "asal.kavram": "1'den büyük ve asal olmayan sayılar bileşik sayıdır.",
    "okat.ekok": "EKOK: iki sayının katlarında ortak olan en küçük sayı. “Birlikte tekrar ne zaman?” sorularında kullanılır.",
    "okat.problem": "“İlk kez birlikte”, “en az kaç” → EKOK. Başlangıç saatine bulduğun EKOK'u ekle.",
    "obol.ebob": "EBOB: iki sayıyı da kalansız bölen en büyük sayı. “Eşit ve en büyük parçalar” sorularında kullanılır.",
    "obol.problem": "Eşit paylaştırma, en büyük parça, en çok kişi → EBOB.",
    "obol.ayirt": "Büyüyen bir şey arıyorsan ortak kat (EKOK), küçük parçalara bölüyorsan ortak bölen (EBOB).",
    "ol.tahmin": "Gözleme dayalı olasılık = olayın gerçekleşme sayısı ÷ toplam deneme sayısı. Değeri 0 ile 1 arasındadır.",
    "ol.kavram": "İmkânsız olay: 0 · kesin olay: 1 · iki eşit olasılıklı sonuçtan her biri: 1/2. Deneme sayısı arttıkça tahmin daha güvenilir olur.",
    "ol.yorum": "Tahmin edilen olasılık × yeni deneme sayısı ≈ beklenen sonuç sayısı.",
    "bas.deger": "Virgülden sonra: onda birler (0,1), yüzde birler (0,01), binde birler (0,001).",
    "bas.ad": "Virgülün hemen sağı onda birler, sonra yüzde birler, sonra binde birler basamağıdır.",
    "bas.cozumle": "Çözümleme: her rakamı basamak değeriyle yazıp topla. 3,47 = 3 + 0,4 + 0,07.",
    "yuv.kural": "Yuvarlanacak basamağın sağındaki rakam 5 veya büyükse yukarı, 5'ten küçükse aşağı yuvarla.",
    "yuv.tahmin": "Tahmin için sayıları yuvarla, işlemi yap; sonuç gerçek sonuca yakın olmalı.",
    "kb.iliski": "a/b = a ÷ b. Pay bölünen, payda bölendir.",
    "kb.ondalik": "Kesri ondalığa çevirmek için paydayı 10, 100 ya da 1000 yapacak şekilde genişlet ya da payı paydaya böl.",
    "kb.paylasim": "Eşit paylaştırma bölmedir: paylaştırılan miktar ÷ kişi sayısı.",
    "pr.para": "Ondalık sayılarla toplama ve çıkarmada virgüller alt alta gelmeli.",
    "pr.kesir": "Bir çokluğun a/b'si: önce b'ye böl, sonra a ile çarp.",
    "pr.cokadim": "Çok adımlı problemlerde verilenleri ve isteneni yaz, her adımı sırayla çöz, sonucu kontrol et.",
    "uz.donustur": "1 km = 1000 m · 1 m = 100 cm · 1 cm = 10 mm. Büyük birimden küçüğe çarp, küçükten büyüğe böl.",
    "uz.birim": "Uzun yollar km, oda ve saha m, kalem ve defter cm, çok küçük şeyler mm ile ölçülür.",
    "uz.problem": "Problemde birimleri önce eşitle, sonra işlem yap.",
    "ar.veri": "Nicel veri sayıyla ölçülür ya da sayılır; kategorik veri bir grup ya da özellik belirtir.",
    "ar.soru": "İyi araştırma sorusu: açık, veri toplanarak cevaplanabilir, hedef grubu belli.",
    "ar.plan": "Veri toplama yolları: anket, gözlem, ölçüm. Anket soruları tarafsız olmalı.",
    "me.grafik": "Kategorik veriler için sütun grafiği, zaman içindeki değişim için çizgi grafiği uygundur.",
    "me.ortalama": "Aritmetik ortalama = değerlerin toplamı ÷ veri sayısı.",
    "me.ortanca": "Ortanca: sıralanmış verinin ortasındaki değer. Tepe değer: en çok tekrar eden değer.",
    "me.aciklik": "Açıklık = en büyük değer − en küçük değer. Uç değer ortalamayı çok, ortancayı az etkiler.",
  };
  MAT.konular.forEach(k => { k.kurallar = Object.fromEntries(k.kazanimlar.map(z => [z.id, KURAL[z.id]]).filter(x => x[1])); });
})();
