/* Matematik — ek sorular 2 (14 konu, 41 kazanımın tamamı): parametreli üreteçler ve yeni nesil sorular.
 * Her çözüm tahtada anlatır gibi 5–7 adımdır: 🔎 anlayalım → 💡 hatırlayalım → ✏️ uygulayalım → ✅ sonuç → 🔁 kontrol.
 * icerik.js ve mat_ek.js'deki kazanımlara SORU_EKLE ile üreteç ekler.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, bolenler, asalMi, ebob, ekok, kesir, asalCarpan, ek, ustlu, S, Q, G } = OGR;
  const lst = a => a.join(", ");
  /* a'dan b'ye (ikisi de dahil) farklı n tane rastgele tam sayı */
  const farkli = (n, a, b) => karistir([...Array(b - a + 1).keys()].map(i => a + i)).slice(0, n);

  /* =================== ÇARPANLAR =================== */
  SORU_EKLE("carpan.bul",
    z => { const n = sec([45, 51, 56, 63, 65, 72, 75, 77, 84, 85, 90, 91, 98, 99, 117]);
      const b = bolenler(n), p = b[1], cevap = n / p, ikinci = n / b[2];
      return S({ kaz: "carpan.bul", duzey: "uygulama", zorluk: 2, soru: `${n} sayısının 1 ve kendisi dışındaki <b>en büyük</b> çarpanı kaçtır?`, dogru: cevap,
        yanlis: [[p, "dikkat", `${p}, ${n}${ek(n, "in")} 1'den sonraki en küçük çarpanıdır; soru en büyüğünü istiyor.`], [ikinci, "dikkat", `${ikinci} bir çarpandır ama ondan daha büyük bir çarpan (${cevap}) var.`], [n - 1, "kavrama", `${n - 1}, ${n}${ek(n, "i")} kalansız bölmez; ardışık iki sayıdan büyüğü küçüğe bölünmez (1 hariç).`], [Math.floor(n / 2), "islem", `${n} ÷ 2 kalanlı bir bölmedir; ${Math.floor(n / 2)} çarpan değildir.`], [n, "dikkat", "Sayının kendisi soruda hariç tutuldu."]],
        ipucu: "Çarpanlar çift çift gelir: en küçük çarpanın eşi en büyük çarpandır.",
        cozum: [`🔎 Soruyu anlayalım: ${n}${ek(n, "in")} çarpanlarından 1 ve ${n} dışındaki en büyüğünü arıyoruz.`,
          "💡 Hatırlayalım: Çarpanlar çiftler hâlinde bulunur. Çiftteki sayılardan biri küçüldükçe diğeri büyür.",
          `✏️ 1'den sonra ${n}${ek(n, "i")} kalansız bölen ilk sayıyı arayalım: 2, 3, 4, … sırayla denenir. ${p > 2 ? `${n} sayısı 2'ye bölünmez; ilk kalansız bölen ${p} olur.` : `${n} çift sayıdır, 2'ye bölünür.`} En küçük çarpan: ${p}.`,
          `✏️ Bu çarpanın eşini bulalım: ${n} ÷ ${p} = ${cevap}.`,
          `✅ Sonuç: 1 ve ${n} dışındaki en büyük çarpan ${cevap} olur.`,
          `🔁 Kontrol edelim: ${p} × ${cevap} = ${n}. Bütün çarpanlar: ${lst(b)}; sondan ikinci sayı gerçekten ${cevap}.`],
        kural: "En küçük çarpanın eşi en büyük çarpandır: sayı ÷ en küçük çarpan.", dogruNeden: `${n} ÷ ${p} = ${cevap}; ${p} en küçük çarpan olduğu için eşi ${cevap} en büyük çarpandır.` }); },
    z => { const n = sec([12, 15, 16, 18, 20, 21, 22, 26, 27, 28, 32, 33, 35]); const b = bolenler(n), t = b.reduce((x, y) => x + y, 0);
      const ciftler = b.filter(d => d * d <= n).map(d => `${d} × ${n / d}`);
      return S({ kaz: "carpan.bul", duzey: "uygulama", zorluk: 2, soru: `${n} sayısının bütün çarpanlarının toplamı kaçtır?`, dogru: t,
        yanlis: [[t - n, "dikkat", `${n} sayısını unuttun; her sayı kendisinin de çarpanıdır.`], [t - 1, "dikkat", "1'i unuttun; 1 her sayının çarpanıdır."], [t - 1 - n, "bilgi", `1 ve ${n} de çarpandır; ikisini de toplama katmalısın.`], [t + n, "islem", `${n} sayısını iki kez toplamış olabilirsin.`]],
        ipucu: "Çarpan çiftlerini yaz, sonra hepsini topla.",
        cozum: [`🔎 Soruyu anlayalım: ${n}${ek(n, "in")} çarpanlarını bulup toplayacağız.`,
          "💡 Hatırlayalım: Çarpımı sayıyı veren iki doğal sayı bir çarpan çiftidir. 1 ve sayının kendisi de çarpandır.",
          `✏️ Çarpan çiftleri: ${lst(ciftler)}.`,
          `✏️ Çarpanlar: ${lst(b)}.`,
          `✏️ Toplayalım: ${b.join(" + ")} = ${t}.`,
          `✅ Sonuç: Çarpanların toplamı ${t} olur.`,
          `🔁 Kontrol edelim: ${b.length} çarpan bulduk. Her çiftin çarpımı ${n} ediyor; hiçbirini atlamadık.`],
        kural: "Çarpanları çift çift bul; 1 ve sayının kendisini unutma.", dogruNeden: `${n}${ek(n, "in")} çarpanları ${lst(b)}; toplamları ${t}.` }); },
    Q("carpan.bul", "transfer", 2, "Bir fırıncı 36 poğaçayı tepsilere <b>eşit sayıda</b> yerleştirecek ve hiç poğaça artmayacak. Her tepsiye en az 5, en çok 10 poğaça koyacaksa bir tepsideki poğaça sayısı kaç olabilir?", "6 ya da 9",
      [["5 ya da 10", "kavrama", "36 ÷ 5 ve 36 ÷ 10 kalanlıdır; poğaça artar. Bu sayılar 36'nın çarpanı değildir."], ["6, 8 ya da 9", "islem", "36 ÷ 8 = 4, kalan 4. 8, 36'nın çarpanı değildir."], ["Yalnızca 6", "dikkat", "9 da 36'nın çarpanıdır ve 5 ile 10 arasındadır: 36 ÷ 9 = 4."]],
      "Tepsideki poğaça sayısı 36'nın çarpanı olmalı.",
      ["🔎 Soruyu anlayalım: 36 poğaça eşit dağıtılacak, artmayacak. Tepsideki sayı 5 ile 10 arasında olmalı.",
        "💡 Hatırlayalım: Hiç artmadan eşit paylaştırma için tepsideki sayı 36'nın çarpanı olmalıdır.",
        "✏️ 36'nın çarpan çiftleri: 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6.",
        "✏️ Çarpanlar: 1, 2, 3, 4, 6, 9, 12, 18, 36. Bunlardan 5 ile 10 arasında olanlar: 6 ve 9.",
        "✅ Sonuç: Bir tepside 6 ya da 9 poğaça olabilir.",
        "🔁 Kontrol edelim: 6 × 6 = 36 (6 tepsi), 9 × 4 = 36 (4 tepsi). İkisinde de poğaça artmıyor."],
      { kural: "Artmadan eşit paylaştırma = çarpan bulma.", dogruNeden: "36'nın 5 ile 10 arasındaki çarpanları yalnızca 6 ve 9'dur." }),
  );
  SORU_EKLE("carpan.say",
    z => { let s; do { s = farkli(4, 20, 64); } while (new Set(s.map(x => bolenler(x).length)).size < 4);
      const c = s.map(x => bolenler(x).length), mx = Math.max(...c), cevap = s[c.indexOf(mx)];
      return S({ kaz: "carpan.say", duzey: "uygulama", zorluk: 3, soru: `${lst(s)} sayılarından hangisinin çarpan sayısı <b>en fazladır</b>?`, dogru: cevap,
        yanlis: s.filter(x => x !== cevap).map(x => [x, x === Math.max(...s) ? "kavrama" : "islem", `${x} sayısının ${bolenler(x).length} çarpanı var (${lst(bolenler(x))}). Büyük sayının çarpanı her zaman çok olmaz.`]),
        ipucu: "Her sayının çarpanlarını çift çift yazıp say.",
        cozum: [`🔎 Soruyu anlayalım: Dört sayının çarpan sayılarını karşılaştıracağız.`,
          "💡 Hatırlayalım: Çarpanları çiftler hâlinde yazarsak hiçbirini kaçırmayız.",
          `✏️ ${s[0]} → ${lst(bolenler(s[0]))} (${c[0]} tane). ${s[1]} → ${lst(bolenler(s[1]))} (${c[1]} tane).`,
          `✏️ ${s[2]} → ${lst(bolenler(s[2]))} (${c[2]} tane). ${s[3]} → ${lst(bolenler(s[3]))} (${c[3]} tane).`,
          `✏️ Karşılaştıralım: en büyük çarpan sayısı ${mx}.`,
          `✅ Sonuç: Çarpan sayısı en fazla olan sayı ${cevap} olur.`,
          "🔁 Kontrol edelim: Çarpan sayısı sayının büyüklüğüne değil, kaç farklı sayıya kalansız bölündüğüne bağlıdır."],
        kural: "Çarpan sayısı, sayının büyüklüğüne değil kaç sayıya kalansız bölündüğüne bağlıdır.", dogruNeden: `${cevap} sayısının ${mx} çarpanı var; diğerlerinin çarpanı daha az.` }); },
    z => { const k = R(4, 12), n = k * k, b = bolenler(n), c = b.length, cift = b.filter(d => d * d < n).map(d => `${d} × ${n / d}`);
      return S({ kaz: "carpan.say", duzey: "aciklama", zorluk: 2, soru: `${n} sayısının kaç tane çarpanı vardır?`, dogru: c,
        yanlis: [[c + 1, "dikkat", `${k} × ${k} çiftinde ${k} sayısını iki kez saydın; aynı çarpan bir kez sayılır.`], [(c - 1) / 2, "kavrama", "Bu, çarpan çiftlerinin sayısına yakındır; soru çarpanların sayısını istiyor."], [c - 1, "dikkat", "Bir çarpanı atladın; 1 ve sayının kendisini de saymayı unutma."], [c - 2, "bilgi", `1 ve ${n} de çarpandır.`]],
        ipucu: `Çiftlerden biri ${k} × ${k}; aynı sayı iki kez sayılmaz.`,
        cozum: [`🔎 Soruyu anlayalım: ${n}${ek(n, "in")} kaç çarpanı olduğunu bulacağız.`,
          "💡 Hatırlayalım: Çarpanları çift çift yazarız. Bir sayı kendisiyle çarpılıp sonucu veriyorsa o çarpan bir kez sayılır.",
          `✏️ Çarpan çiftleri: ${lst(cift)} ve ${k} × ${k}.`,
          `✏️ Çarpanlar: ${lst(b)}.`,
          `✅ Sonuç: ${n} sayısının ${c} çarpanı vardır.`,
          `🔁 Kontrol edelim: ${cift.length} çift 2'şer çarpan verir: ${cift.length * 2}; ortadaki ${k} × ${k} çifti ise yalnızca 1 çarpan verir: ${cift.length * 2} + 1 = ${c}. Çarpan sayısı tek çıktı; bu yalnızca kare sayılarda olur.`],
        kural: "Kare sayıların çarpan sayısı tektir; ortadaki çarpan bir kez sayılır.", dogruNeden: `${n}${ek(n, "in")} çarpanları ${lst(b)}; toplam ${c} tane.` }); },
    Q("carpan.say", "baglanti", 2, "Bir doğal sayının <b>tam olarak 2 tane</b> çarpanı varsa bu sayı için aşağıdakilerden hangisi kesinlikle doğrudur?", "Bu sayı asal sayıdır.",
      [["Bu sayı çift sayıdır.", "kavrama", "Yalnızca 2 çifttir; 3, 5, 7 gibi sayıların da 2 çarpanı vardır ve tektir."], ["Bu sayı 1'dir.", "bilgi", "1'in yalnızca 1 çarpanı vardır (kendisi)."], ["Bu sayı bir kare sayıdır.", "kavrama", "Kare sayıların çarpan sayısı tektir; 2 çift sayıdır."]],
      "1 ve kendisinden başka çarpanı olmayan sayılara ne ad verilir?",
      ["🔎 Soruyu anlayalım: Çarpan sayısı tam 2 olan bir sayının özelliğini arıyoruz.",
        "💡 Hatırlayalım: 1'den büyük her sayının en az 2 çarpanı vardır: 1 ve kendisi.",
        "✏️ Tam 2 çarpan varsa bu çarpanlar yalnızca 1 ve sayının kendisidir; başka çarpan yoktur.",
        "✏️ 1 ve kendisinden başka çarpanı olmayan, 1'den büyük sayılara asal sayı denir. Örnek: 2 (1, 2), 7 (1, 7), 13 (1, 13).",
        "✅ Sonuç: Bu sayı kesinlikle asal sayıdır.",
        "🔁 Kontrol edelim: 9'un çarpanları 1, 3, 9 (3 tane) — asal değil. 11'in çarpanları 1, 11 (2 tane) — asal. Kural tutuyor."],
      { kural: "Çarpan sayısı 2 olan sayılar asal sayılardır.", dogruNeden: "Tam 2 çarpanı olan sayının çarpanları 1 ve kendisidir; bu asal sayının tanımıdır." }),
  );
  SORU_EKLE("carpan.model",
    z => { const a = R(2, 6), b = R(a + 1, 10), n = a * b, cevre = 2 * (a + b);
      return S({ kaz: "carpan.model", duzey: "uygulama", zorluk: 2, soru: `${n} eş birim karenin tamamı kullanılarak bir dikdörtgen yapılıyor. Dikdörtgenin kısa kenarında ${a} birim kare varsa dikdörtgenin çevresi kaç birimdir?`, dogru: cevre,
        yanlis: [[n, "kavrama", `${n} birim kare dikdörtgenin alanıdır; çevre kenarların toplamıdır.`], [a + b, "dikkat", "Yalnızca iki kenarı topladın; dikdörtgenin dört kenarı vardır."], [2 * a + b, "dikkat", "Uzun kenarlardan birini unuttun."], [4 * b, "islem", "Dikdörtgenin kenarları eşit değildir; dört kenarı ayrı ayrı topla."]],
        ipucu: "Önce uzun kenarı bul: birim kare sayısı ÷ kısa kenar.",
        cozum: [`🔎 Soruyu anlayalım: ${n} birim kareden kısa kenarı ${a} olan dikdörtgen yapılıyor; çevresini arıyoruz.`,
          "💡 Hatırlayalım: Dikdörtgen modelinde kenarlar, birim kare sayısının bir çarpan çiftidir: kısa kenar × uzun kenar = birim kare sayısı.",
          `✏️ Uzun kenar: ${n} ÷ ${a} = ${b} birim.`,
          `✏️ Çevre: ${a} + ${b} + ${a} + ${b} = ${cevre} birim.`,
          `✅ Sonuç: Dikdörtgenin çevresi ${cevre} birimdir.`,
          `🔁 Kontrol edelim: ${a} × ${b} = ${n} birim kare ediyor, model doğru. Çevreyi 2 × (${a} + ${b}) = ${cevre} diye de bulabiliriz.`],
        kural: "Dikdörtgen modelinde kenarlar çarpan çiftidir; alan = kısa × uzun kenar.", dogruNeden: `Uzun kenar ${n} ÷ ${a} = ${b}; çevre 2 × (${a} + ${b}) = ${cevre}.`, gorsel: G.izgara(a, b) }); },
    z => { const n = sec([24, 36, 48, 60, 72]); const cift = bolenler(n).filter(d => d * d <= n).map(d => [d, n / d]);
      let c, d; do { c = R(3, 9); d = Math.round(n / c); } while (n % c === 0 || c * d === n || d < 2 || d === c);
      return S({ kaz: "carpan.model", duzey: "aciklama", zorluk: 2, soru: `${n} birim karenin tamamıyla dikdörtgenler kurulacak. Aşağıdaki kenar uzunluklarından hangisiyle <b>kurulamaz</b>?`, dogru: `${c} × ${d}`,
        yanlis: karistir(cift).map(([x, y]) => [`${x} × ${y}`, "kavrama", `${x} × ${y} = ${n}; bu dikdörtgen kurulabilir.`]),
        ipucu: "Kenar uzunluklarını çarp; sonuç birim kare sayısına eşit olmalı.",
        cozum: [`🔎 Soruyu anlayalım: ${n} birim kareyle kurulamayan dikdörtgeni arıyoruz.`,
          `💡 Hatırlayalım: Kenarları çarpınca ${n} eden dikdörtgen kurulabilir; kenarlar ${n}${ek(n, "in")} bir çarpan çiftidir.`,
          `✏️ ${n}${ek(n, "in")} çarpan çiftleri: ${lst(cift.map(([x, y]) => x + " × " + y))}.`,
          `✏️ ${c} × ${d} = ${c * d}; bu ${n} değildir. Zaten ${n} ÷ ${c} kalanlıdır, ${c} bir çarpan değildir.`,
          `✅ Sonuç: ${c} × ${d} boyutlarında dikdörtgen kurulamaz.`,
          `🔁 Kontrol edelim: ${c} × ${d} için ${c * d} birim kare gerekir; elimizde ${n} var. ${c * d > n ? "Kareler yetmez." : "Kareler artar."}`],
        kural: "Bir dikdörtgen modelinin kenarları, birim kare sayısının çarpan çiftidir.", dogruNeden: `${c} × ${d} = ${c * d} ≠ ${n}; bu yüzden bu dikdörtgen kurulamaz.` }); },
    Q("carpan.model", "transfer", 3, "Bir bahçıvan 18 fidanı dikdörtgen biçiminde, her sırada eşit sayıda fidan olacak şekilde dikecek. Sıra sayısı da sıradaki fidan sayısı da 1'den büyük olacak. Kaç farklı dikim düzeni kurabilir? (3 sıra × 6 fidan ile 6 sıra × 3 fidan farklı düzen sayılır.)", "4",
      [["2", "dikkat", "3 × 6 ile 6 × 3'ü (ya da 2 × 9 ile 9 × 2'yi) aynı saydın; soruda farklı sayılıyor."], ["6", "dikkat", "1 × 18 ve 18 × 1 düzenleri olamaz; sıra sayısı ve sıradaki fidan sayısı 1'den büyük olmalı."], ["3", "islem", "18'in çarpanlarını yeniden yaz: 2, 3, 6, 9 sıra olabilir."]],
      "Sıra sayısı 18'in 1 ve 18 dışındaki çarpanlarından biri olmalı.",
      ["🔎 Soruyu anlayalım: 18 fidan sıra × sıradaki fidan biçiminde dikilecek; iki sayı da 1'den büyük.",
        "💡 Hatırlayalım: Sıra sayısı × sıradaki fidan sayısı = 18. Yani iki sayı 18'in bir çarpan çiftidir.",
        "✏️ 18'in çarpan çiftleri: 1 × 18, 2 × 9, 3 × 6.",
        "✏️ 1 × 18 olamaz. Kalan çiftler sıralı yazılırsa: 2 × 9, 9 × 2, 3 × 6, 6 × 3.",
        "✅ Sonuç: 4 farklı dikim düzeni kurulabilir.",
        "🔁 Kontrol edelim: 2 · 9 = 18, 9 · 2 = 18, 3 · 6 = 18, 6 · 3 = 18. Hepsinde fidan artmıyor."],
      { kural: "Dikdörtgen düzeni kurmak, sayının çarpan çiftlerini bulmaktır.", dogruNeden: "18'in 1 ve 18 dışındaki çarpanları 2, 3, 6, 9; her biri bir sıra sayısı olabilir: 4 düzen." }),
  );

  /* =================== KATLAR =================== */
  SORU_EKLE("kat.bul",
    z => { const k = R(3, 15), t = 15 * k;
      return S({ kaz: "kat.bul", duzey: "uygulama", zorluk: 2, soru: `${k} sayısının sıfırdan büyük ilk 5 katının toplamı kaçtır?`, dogru: t,
        yanlis: [[10 * k, "dikkat", "Sıfırı da kat olarak alıp 4 kat toplamış olabilirsin; soru sıfırdan büyük ilk 5 katı istiyor."], [5 * k, "kavrama", `${5 * k}, yalnızca 5. kattır; ilk 5 katın toplamı istendi.`], [21 * k, "dikkat", "6 kat toplamışsın; ilk 5 kat yeterli."], [t + k, "islem", "Toplamayı yeniden yap."]],
        ipucu: `${k} × 1, ${k} × 2, … , ${k} × 5 sayılarını yaz ve topla.`,
        cozum: [`🔎 Soruyu anlayalım: ${k}${ek(k, "in")} sıfırdan büyük ilk 5 katını yazıp toplayacağız.`,
          `💡 Hatırlayalım: Bir sayının katları, o sayının 1, 2, 3, … ile çarpımıdır.`,
          `✏️ İlk 5 kat: ${[1, 2, 3, 4, 5].map(i => k * i).join(", ")}.`,
          `✏️ Toplayalım: ${[1, 2, 3, 4, 5].map(i => k * i).join(" + ")} = ${t}.`,
          `✅ Sonuç: Toplam ${t} olur.`,
          `🔁 Kontrol edelim: ${k} × (1 + 2 + 3 + 4 + 5) = ${k} × 15 = ${t}. Aynı sonuç!`],
        kural: "Bir sayının katları: sayı × 1, sayı × 2, sayı × 3, …", dogruNeden: `${k} + ${2 * k} + ${3 * k} + ${4 * k} + ${5 * k} = ${t}.` }); },
    z => { const k = R(6, 14), m = farkli(3, 3, 12).map(x => x * k); let y; do { y = k * R(3, 12) + R(1, k - 1); } while (m.includes(y));
      return S({ kaz: "kat.bul", duzey: "aciklama", zorluk: 2, soru: `Aşağıdakilerden hangisi ${k} sayısının katı <b>değildir</b>?`, dogru: y,
        yanlis: m.map(x => [x, "islem", `${k} × ${x / k} = ${x}; bu sayı ${k}${ek(k, "in")} katıdır.`]),
        ipucu: `Her sayıyı ${k}${ek(k, "e")} böl; kalan çıkan kat değildir.`,
        cozum: [`🔎 Soruyu anlayalım: ${k}${ek(k, "e")} kalansız bölünmeyen sayıyı arıyoruz.`,
          `💡 Hatırlayalım: Bir sayı ${k}${ek(k, "e")} kalansız bölünüyorsa ${k}${ek(k, "in")} katıdır.`,
          `✏️ ${m.map(x => `${x} ÷ ${k} = ${x / k}`).join("; ")} — hepsi kalansız.`,
          `✏️ ${y} ÷ ${k} = ${Math.floor(y / k)}, kalan ${y % k}.`,
          `✅ Sonuç: ${y}, ${k}${ek(k, "in")} katı değildir.`,
          `🔁 Kontrol edelim: ${k} × ${Math.floor(y / k)} = ${k * Math.floor(y / k)}, ${k} × ${Math.floor(y / k) + 1} = ${k * Math.floor(y / k) + k}. ${y} bu iki kat arasında kalıyor.`],
        kural: "Bir sayının katları o sayıya kalansız bölünür.", dogruNeden: `${y} ÷ ${k} işleminde kalan ${y % k}; bu yüzden ${y} kat değildir.` }); },
    Q("kat.bul", "transfer", 1, "Bir kırtasiyede boya kalemleri yalnızca 6'lı kutular hâlinde satılıyor. Bir öğretmen tam kutular alacaktır. Öğretmenin aldığı toplam kalem sayısı aşağıdakilerden hangisi <b>olamaz</b>?", "64",
      [["42", "islem", "6 × 7 = 42; 7 kutu alınmış olabilir."], ["54", "islem", "6 × 9 = 54; 9 kutu alınmış olabilir."], ["72", "islem", "6 × 12 = 72; 12 kutu alınmış olabilir."]],
      "Tam kutu alınırsa kalem sayısı 6'nın katı olur.",
      ["🔎 Soruyu anlayalım: Kalemler 6'lı kutularda; tam kutu alınıyor. Olamayacak toplamı arıyoruz.",
        "💡 Hatırlayalım: Kutu sayısı × 6 = kalem sayısı. Yani kalem sayısı 6'nın katı olmalı.",
        "✏️ 42 ÷ 6 = 7, 54 ÷ 6 = 9, 72 ÷ 6 = 12 → hepsi kalansız.",
        "✏️ 64 ÷ 6 = 10, kalan 4 → 64 6'nın katı değil.",
        "✅ Sonuç: Toplam kalem sayısı 64 olamaz.",
        "🔁 Kontrol edelim: 10 kutu 60, 11 kutu 66 kalem eder; 64 arada kalıyor."],
      { kural: "Eşit paketlerden tam alınan miktar, paket sayısının katıdır.", dogruNeden: "64 sayısı 6'ya kalansız bölünmez; 6'nın katı değildir." }),
  );
  SORU_EKLE("kat.aralik",
    z => { const k = sec([3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 15]); const a = Math.floor(99 / k), b = Math.floor(9 / k), c = a - b;
      return S({ kaz: "kat.aralik", duzey: "uygulama", zorluk: 3, soru: `${k} sayısının katı olan <b>iki basamaklı</b> kaç doğal sayı vardır?`, dogru: c,
        yanlis: [[a, "dikkat", "99'a kadar olan bütün katları saydın; tek basamaklı katları çıkarmalısın."], [c + 1, "islem", "Sınırları yeniden kontrol et; ilk ve son katı bir kez say."], [c - 1, "islem", "İlk ya da son katı saymayı unuttun."], [a + 1, "dikkat", "0'ı da saymış olabilirsin; 0 iki basamaklı değildir."], [c + 2, "islem", "Katları tek tek yazıp yeniden say; fazladan sayı eklemişsin."]],
        ipucu: "En küçük ve en büyük iki basamaklı katı bul, aradaki katları say.",
        cozum: [`🔎 Soruyu anlayalım: 10 ile 99 arasındaki, ${k}${ek(k, "e")} kalansız bölünen sayıları sayacağız.`,
          `💡 Hatırlayalım: ${k}${ek(k, "in")} katları ${k} × 1, ${k} × 2, … biçimindedir.`,
          `✏️ En küçük iki basamaklı kat: ${k} × ${b + 1} = ${k * (b + 1)}.`,
          `✏️ En büyük iki basamaklı kat: ${k} × ${a} = ${k * a} (bir sonraki ${k * (a + 1)} üç basamaklı).`,
          `✏️ Çarpanlar ${b + 1}${ek(b + 1, "den")} ${a}${ek(a, "e")} kadar gidiyor: ${a} − ${b + 1} + 1 = ${c} tane.`,
          `✅ Sonuç: ${k}${ek(k, "in")} iki basamaklı ${c} katı vardır.`,
          `🔁 Kontrol edelim: 99'a kadar ${a} kat var, ${b ? `bunlardan ${b} tanesi tek basamaklı: ${a} − ${b} = ${c}.` : `hiçbiri tek basamaklı değil; hepsi iki basamaklı: ${c}.`}`],
        kural: "Aralıktaki kat sayısı = son kattaki çarpan − ilk kattaki çarpan + 1.", dogruNeden: `${k * (b + 1)}${ek(k * (b + 1), "den")} ${k * a}${ek(k * a, "e")} kadar ${c} tane kat vardır.` }); },
    z => { let k, a, b, ilk, son; do { k = R(4, 13); a = R(20, 80); b = a + R(25, 60); ilk = (Math.floor(a / k) + 1) * k; son = Math.ceil(b / k) * k - k; } while (son - ilk < 2 * k || a % k === 0 || b % k === 0);
      const adet = (son - ilk) / k + 1;
      return S({ kaz: "kat.aralik", duzey: "uygulama", zorluk: 2, soru: `${a} ile ${b} arasındaki ${k} katlarından <b>en küçüğü ile en büyüğünün toplamı</b> kaçtır?`, dogru: ilk + son,
        yanlis: [[ilk + son + k, "dikkat", `${son + k}, ${b}${ek(b, "den")} büyüktür; aralığın dışında kalır.`], [ilk + son - k, "dikkat", `${ilk - k}, ${a}${ek(a, "den")} küçüktür; aralığın dışında kalır.`], [son - ilk, "kavrama", "Farkı buldun; soru toplamı istiyor."], [a + b, "kavrama", `${a} ve ${b} sayıları ${k}${ek(k, "in")} katı değildir.`]],
        ipucu: `${a}${ek(a, "den")} sonraki ilk kata ve ${b}${ek(b, "den")} önceki son kata bak.`,
        cozum: [`🔎 Soruyu anlayalım: ${a} ile ${b} arasında ${k}${ek(k, "in")} en küçük ve en büyük katını bulup toplayacağız.`,
          `💡 Hatırlayalım: Bir sayıyı ${k}${ek(k, "e")} bölüp kalana bakarak en yakın katları buluruz.`,
          `✏️ ${a} ÷ ${k} = ${Math.floor(a / k)}, kalan ${a % k}. Sonraki kat: ${k} × ${ilk / k} = ${ilk}.`,
          `✏️ ${b} ÷ ${k} = ${Math.floor(b / k)}, kalan ${b % k}. Önceki kat: ${k} × ${son / k} = ${son}.`,
          `✏️ Toplam: ${ilk} + ${son} = ${ilk + son}.`,
          `✅ Sonuç: İstenen toplam ${ilk + son} olur.`,
          `🔁 Kontrol edelim: ${ilk - k} < ${a} ve ${son + k} > ${b}; yani ${ilk} ve ${son} gerçekten uçtaki katlar. Arada toplam ${adet} kat var.`],
        kural: "Aralıktaki ilk katı bulmak için sayıyı böl, bölümü 1 artır ve çarp.", dogruNeden: `En küçük kat ${ilk}, en büyük kat ${son}; toplamları ${ilk + son}.` }); },
    Q("kat.aralik", "transfer", 2, "30 katlı bir binada bir asansör yalnızca <b>4'ün katı</b> olan katlarda duruyor (zemin kat sayılmıyor, katlar 1'den 30'a kadar numaralı). Bu asansör kaç farklı katta durur?", "7",
      [["8", "dikkat", "32. kat yok; bina 30 katlı. Ya da zemin katı (0) saydın."], ["6", "islem", "28 de 4'ün katıdır (4 × 7); son katı unuttun."], ["4", "kavrama", "4, katların hangi sayının katı olduğunu gösterir; kaç kat olduğunu saymalısın."]],
      "1 ile 30 arasında 4'ün katlarını sırayla yaz.",
      ["🔎 Soruyu anlayalım: 1'den 30'a kadar katlar içinde 4'ün katı olanları sayacağız.",
        "💡 Hatırlayalım: 4'ün katları 4 × 1, 4 × 2, 4 × 3, … biçimindedir.",
        "✏️ 4'ün katları: 4, 8, 12, 16, 20, 24, 28.",
        "✏️ Sonraki kat 32; bu 30'dan büyük olduğu için sayılmaz.",
        "✅ Sonuç: Asansör 7 farklı katta durur.",
        "🔁 Kontrol edelim: 30 ÷ 4 = 7, kalan 2. Bölüm 7 → 30'a kadar 4'ün 7 katı var."],
      { kural: "1'den n'ye kadar k'nın kat sayısı, n ÷ k işleminin bölümüdür.", dogruNeden: "4, 8, 12, 16, 20, 24 ve 28 olmak üzere 7 kat vardır.", gorsel: G.sayiDogrusu({ min: 0, max: 30, adim: 4, araAdim: 1, etiket: x => x, noktalar: [4, 8, 12, 16, 20, 24, 28].map(v => ({ v })) }) }),
  );
  SORU_EKLE("kat.problem",
    z => { const k = R(3, 7), m = R(6, 15), dogru = k * m;
      return S({ kaz: "kat.problem", duzey: "transfer", zorluk: 2, soru: `Ece merdiveni hep ${k} basamak atlayarak çıkıyor: önce ${k}. basamağa, sonra ${2 * k}. basamağa basıyor. Ece aşağıdaki basamaklardan hangisine <b>basar</b>?`, dogru,
        yanlis: karistir([dogru + 1, dogru - 1, dogru + 2, dogru - 2]).map(x => [x, "islem", `${x} ÷ ${k} = ${Math.floor(x / k)}, kalan ${x % k}. Ece bu basamağı atlar.`]),
        ipucu: `Ece'nin bastığı basamaklar ${k}${ek(k, "in")} katlarıdır.`,
        cozum: [`🔎 Soruyu anlayalım: Ece ${k}, ${2 * k}, … basamaklarına basıyor. Seçeneklerden hangisine bastığını bulacağız.`,
          `💡 Hatırlayalım: ${k}, ${2 * k}, ${3 * k}, … sayıları ${k}${ek(k, "in")} katlarıdır.`,
          `✏️ Her seçeneği ${k}${ek(k, "e")} bölelim; kalansız bölünen Ece'nin bastığı basamaktır.`,
          `✏️ ${dogru} ÷ ${k} = ${m}, kalan 0. Diğer seçeneklerde kalan çıkıyor.`,
          `✅ Sonuç: Ece ${dogru}. basamağa basar; bu onun ${m}. adımıdır.`,
          `🔁 Kontrol edelim: ${k} × ${m} = ${dogru}. Bir önceki adımda ${dogru - k}, sonraki adımda ${dogru + k}. basamağa basar.`],
        kural: "Eşit aralıklarla atlanan basamaklar, aralık sayısının katlarıdır.", dogruNeden: `${dogru} = ${k} × ${m}; ${k}${ek(k, "in")} katı olduğu için Ece bu basamağa basar.` }); },
    z => { const k = sec([6, 10, 12, 15, 20, 30]); let n; do { n = R(3 * k, 12 * k); } while (n % k === 0); const az = Math.floor(n / k), cok = az + 1, kalan = n - az * k;
      return S({ kaz: "kat.problem", duzey: "transfer", zorluk: 2, soru: `Bir çiftlikte her viyole ${k}${ek(k, "er")} yumurta konuyor. ${n} yumurtanın <b>hepsini</b> koymak için en az kaç viyol gerekir?`, dogru: cok,
        yanlis: [[az, "strateji", `${az} viyole ${az * k} yumurta sığar; ${kalan} yumurta açıkta kalır.`], [kalan, "kavrama", `${kalan}, son viyole konan yumurta sayısıdır; viyol sayısı değildir.`], [cok + 1, "dikkat", `${cok} viyol yeterli; fazladan viyol gerekmez.`], [az * k, "kavrama", "Bu, yumurta sayısıdır; viyol sayısı istendi."]],
        ipucu: `${k}${ek(k, "in")} katlarından ${n}${ek(n, "e")} eşit ya da ondan büyük olan ilk kata bak.`,
        cozum: [`🔎 Soruyu anlayalım: ${n} yumurta, viyollere ${k}${ek(k, "er")} konacak; hiç yumurta açıkta kalmamalı.`,
          `💡 Hatırlayalım: Viyol sayısı × ${k} = sığan yumurta sayısı; bu sayı ${k}${ek(k, "in")} bir katıdır.`,
          `✏️ ${n} ÷ ${k} = ${az}, kalan ${kalan}. ${az} viyol ${az * k} yumurta alır.`,
          `✏️ Kalan ${kalan} yumurta için bir viyol daha gerekir: ${az} + 1 = ${cok}.`,
          `✅ Sonuç: En az ${cok} viyol gerekir.`,
          `🔁 Kontrol edelim: ${cok} × ${k} = ${cok * k} ≥ ${n}, ama ${az} × ${k} = ${az * k} < ${n}. Son viyolde ${kalan} yumurta olur.`],
        kural: "Hepsi sığsın isteniyorsa kalanlı bölümde bölümü 1 artır.", dogruNeden: `${az} viyol yetmez (${az * k} yumurta), ${cok} viyol ${cok * k} yumurta alır ve yeter.` }); },
    Q("kat.problem", "transfer", 3, "Bir kırtasiye boya kalemlerini 8'li paketlerle satıyor. Sınıftaki 27 öğrenciye birer kalem verilecek. En az kaç paket alınmalı ve dağıtımdan sonra kaç kalem artar?", "4 paket, 5 kalem artar",
      [["3 paket, 3 kalem artar", "strateji", "3 paket 24 kalem eder; 27 öğrenciye yetmez, 3 kalem eksik kalır."], ["4 paket, 3 kalem artar", "islem", "4 paket 32 kalemdir; 32 − 27 = 5 kalem artar."], ["5 paket, 13 kalem artar", "dikkat", "4 paket yeterli; en az paket sayısı istendi."]],
      "27'ye eşit ya da ondan büyük olan ilk 8 katını bul.",
      ["🔎 Soruyu anlayalım: 27 kalem gerekiyor, paketler 8'li. En az paket sayısını ve artan kalemi bulacağız.",
        "💡 Hatırlayalım: Alınan kalem sayısı 8'in katıdır: 8, 16, 24, 32, …",
        "✏️ 3 paket: 3 × 8 = 24 kalem → 27'den az, yetmez.",
        "✏️ 4 paket: 4 × 8 = 32 kalem → yeter. Artan: 32 − 27 = 5.",
        "✅ Sonuç: En az 4 paket alınmalı; 5 kalem artar.",
        "🔁 Kontrol edelim: 27 + 5 = 32 = 4 × 8. Hesap tutuyor."],
      { kural: "İhtiyaçtan büyük ya da ona eşit ilk kat, en az paket sayısını verir.", dogruNeden: "4 × 8 = 32 kalem 27 öğrenciye yeter; 3 paket (24) yetmez. 32 − 27 = 5 kalem artar." }),
  );

  /* =================== KALANSIZ BÖLÜNEBİLME =================== */
  const rt = n => String(n).split("").reduce((a, c) => a + Number(c), 0);
  const son2 = n => n % 100;
  /* Bir sayının d ile bölünüp bölünmediğini kurala dayanarak açıklayan cümle */
  function kuralAcikla(n, d) {
    const r = rt(n), s = n % 10, iki = son2(n);
    const evet = n % d === 0;
    switch (d) {
      case 2: return `Son rakamı ${s}; ${s % 2 ? "tek olduğu için 2'ye bölünmez" : "çift olduğu için 2'ye bölünür"}.`;
      case 3: return `Rakamları toplamı ${r}; ${r % 3 ? "3'ün katı olmadığı için 3'e bölünmez" : "3'ün katı olduğu için 3'e bölünür"}.`;
      case 4: return `Son iki basamağı ${String(iki).padStart(2, "0")}; ${iki % 4 ? "4'e bölünmediği için sayı 4'e bölünmez" : "4'e bölündüğü için sayı 4'e bölünür"}.`;
      case 5: return `Son rakamı ${s}; ${evet ? "0 ya da 5 olduğu için 5'e bölünür" : "0 ya da 5 olmadığı için 5'e bölünmez"}.`;
      case 6: return n % 2 ? "Çift olmadığı için 6'ya bölünmez." : (r % 3 ? `Çift ama rakamları toplamı ${r}, 3'ün katı değil; 6'ya bölünmez.` : `Hem çift hem rakamları toplamı ${r} (3'ün katı); 6'ya bölünür.`);
      case 9: return `Rakamları toplamı ${r}; ${r % 9 ? "9'un katı olmadığı için 9'a bölünmez" : "9'un katı olduğu için 9'a bölünür"}.`;
      case 10: return `Son rakamı ${s}; ${s === 0 ? "0 olduğu için 10'a bölünür" : "0 olmadığı için 10'a bölünmez"}.`;
    }
  }
  const BOLEN_EKI = { 2: "2'ye", 3: "3'e", 4: "4'e", 5: "5'e", 6: "6'ya", 9: "9'a", 10: "10'a" };

  SORU_EKLE("bol.kural",
    z => { const d = sec([4, 9]); let dogru, y = [];
      if (d === 4) {
        dogru = 4 * R(30, 249);
        let a; do { a = 100 * R(1, 9) + sec([10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70, 74, 78, 82, 86, 90, 94, 98]); } while (a === dogru);
        const b = 2 * R(50, 499) + 1;
        let c; do { c = 100 * R(1, 9) + sec([2, 6]); } while (c === a);
        y = [[a, "kavrama", `Son rakamı çift diye 4'e bölünür sandın. 4'te son iki basamağa bakılır: ${son2(a)} ÷ 4 kalanlıdır.`], [b, "bilgi", "Tek sayılar 4'e (hatta 2'ye) bölünmez."], [c, "dikkat", `Son iki basamak ${String(son2(c)).padStart(2, "0")}, yani ${son2(c)}; ${son2(c)} ÷ 4 kalanlıdır.`], [dogru + 2, "kavrama", `Son iki basamak ${String(son2(dogru + 2)).padStart(2, "0")}; 4'e bölünmez.`]];
      } else {
        dogru = 9 * R(12, 111);
        let a; do { a = 3 * R(34, 333); } while (a % 9 === 0);
        let b; do { b = 10 * R(10, 99) + 9; } while (b % 9 === 0);
        const c = dogru + sec([1, -1, 3]);
        y = [[a, "kavrama", `Rakamları toplamı ${rt(a)}; bu 3'ün katı ama 9'un katı değil. 3 kuralını 9 ile karıştırma.`], [b, "kavrama", `Son rakamın 9 olması yetmez; rakamları toplamı ${rt(b)}, 9'un katı değil.`], [c, "islem", `Rakamları toplamı ${rt(c)}; 9'un katı değil.`], [dogru + 2, "islem", `Rakamları toplamı ${rt(dogru + 2)}; 9'un katı değil.`]];
      }
      const hepsi = [dogru, ...y.map(x => x[0])];
      return S({ kaz: "bol.kural", duzey: "uygulama", zorluk: 2, soru: `Aşağıdaki sayılardan hangisi <b>${d}</b> ile kalansız bölünür?`, dogru, yanlis: y,
        ipucu: d === 4 ? "4 ile bölünebilmede son iki basamağa bak." : "9 ile bölünebilmede rakamların toplamına bak.",
        cozum: [`🔎 Soruyu anlayalım: Dört sayıdan ${d} ile kalansız bölüneni bulacağız. Bölme yapmadan kuralla karar verebiliriz.`,
          d === 4 ? "💡 Hatırlayalım: Bir sayının son iki basamağının oluşturduğu sayı 4'e bölünüyorsa (ya da 00 ise) sayı 4'e kalansız bölünür." : "💡 Hatırlayalım: Rakamlarının toplamı 9'un katı olan sayılar 9'a kalansız bölünür.",
          `✏️ ${hepsi[0]}: ${kuralAcikla(hepsi[0], d)}`,
          `✏️ ${hepsi[1]}: ${kuralAcikla(hepsi[1], d)} ${hepsi[2]}: ${kuralAcikla(hepsi[2], d)}`,
          `✏️ ${hepsi[3]}: ${kuralAcikla(hepsi[3], d)}`,
          `✅ Sonuç: ${d} ile kalansız bölünen sayı ${dogru} olur.`,
          `🔁 Kontrol edelim: ${dogru} ÷ ${d} = ${dogru / d}, kalan 0. Kural ile bölme aynı sonucu verdi.`],
        kural: d === 4 ? "4 ile bölünebilme: son iki basamak 4'e bölünmeli." : "9 ile bölünebilme: rakamlar toplamı 9'un katı olmalı.", dogruNeden: `${kuralAcikla(dogru, d)} ${dogru} ÷ ${d} = ${dogru / d}.` }); },
    z => { const n = R(100, 999), B = [2, 3, 4, 5, 6, 9, 10], ev = B.filter(d => n % d === 0), c = ev.length;
      return S({ kaz: "bol.kural", duzey: "uygulama", zorluk: 3, soru: `${n} sayısı 2, 3, 4, 5, 6, 9 ve 10 sayılarından <b>kaç tanesine</b> kalansız bölünür?`, dogru: c,
        yanlis: [[c + 1, "kavrama", "Kuralı sağlamayan bir sayıyı da saydın; her kuralı ayrı ayrı kontrol et."], [c - 1, "dikkat", "Kuralı sağlayan bir sayıyı atladın; 6'yı (2 ve 3) ve 4'ü unutma."], [c + 2, "kavrama", "Fazla sayı saydın. Örneğin 3'e bölünen her sayı 9'a bölünmez."], [c - 2, "dikkat", "İki bölünebilmeyi gözden kaçırdın."], [c + 3, "kavrama", "Kuralları sağlamayan sayıları da saydın; her bölen için kuralı tek tek uygula."]].filter(x => x[0] >= 0),
        ipucu: "Son rakam (2, 5, 10), son iki basamak (4) ve rakamlar toplamı (3, 9) kurallarını sırayla uygula; 6 için 2 ve 3'e birlikte bak.",
        cozum: [`🔎 Soruyu anlayalım: ${n} sayısının 7 sayıdan kaçına kalansız bölündüğünü bulacağız.`,
          "💡 Hatırlayalım: 2, 5, 10 → son rakam; 4 → son iki basamak; 3, 9 → rakamlar toplamı; 6 → hem 2 hem 3.",
          `✏️ ${kuralAcikla(n, 2)} ${kuralAcikla(n, 5)} ${kuralAcikla(n, 10)}`,
          `✏️ ${kuralAcikla(n, 3)} ${kuralAcikla(n, 9)}`,
          `✏️ ${kuralAcikla(n, 4)} ${kuralAcikla(n, 6)}`,
          `✅ Sonuç: ${c ? `${n} sayısı ${c === 1 ? ev[0] + " sayısına" : lst(ev) + " sayılarına"} bölünür; toplam ${c} tane.` : `${n} sayısı bu sayıların hiçbirine bölünmez; cevap 0.`}`,
          "🔁 Kontrol edelim: Bölünen her sayı için bölmeyi yaparsan kalanın 0 çıktığını görürsün. 6'ya bölünen sayı mutlaka 2'ye ve 3'e de bölünür."],
        kural: "6 ile bölünebilme = 2 ile ve 3 ile birlikte bölünebilme.", dogruNeden: c ? `${n}; ${c === 1 ? ev[0] + " sayısına" : lst(ev) + " sayılarına"} kalansız bölünür (${c} tane).` : `${n} bu sayıların hiçbirine kalansız bölünmez.` }); },
    Q("bol.kural", "transfer", 2, "Bir düğünde 234 davetli masalara oturtulacak. Bütün masalar aynı türden olacak ve hiç boş sandalye kalmayacak. Salonda 4, 5, 6 ya da 9 kişilik masalar var. Hangi masa türleri kullanılabilir?", "6 ve 9 kişilik",
      [["4 ve 6 kişilik", "kavrama", "234 çift ama son iki basamağı 34; 34 ÷ 4 kalanlıdır, 4 kişilik masalar kullanılamaz."], ["Yalnızca 9 kişilik", "dikkat", "234 hem çift hem rakamları toplamı 9 olduğundan 6'ya da bölünür."], ["5 ve 9 kişilik", "bilgi", "Son rakam 4; 0 ya da 5 olmadığı için 234, 5'e bölünmez."]],
      "Boş sandalye kalmaması için 234, masa kişi sayısına kalansız bölünmeli.",
      ["🔎 Soruyu anlayalım: 234 kişi aynı tür masalara tam oturacak. Hangi masa türünde boş yer kalmaz?",
        "💡 Hatırlayalım: Boş yer kalmaması için 234, masadaki kişi sayısına kalansız bölünmelidir. Bölünebilme kurallarını kullanalım.",
        "✏️ 4: Son iki basamak 34 → 34 ÷ 4 kalanlı. Olmaz. 5: Son rakam 4 → olmaz.",
        "✏️ Rakamlar toplamı: 2 + 3 + 4 = 9. 9'un katı → 9'a bölünür. Sayı çift ve toplam 3'ün katı → 6'ya da bölünür.",
        "✅ Sonuç: 6 ve 9 kişilik masalar kullanılabilir.",
        "🔁 Kontrol edelim: 234 ÷ 6 = 39 masa, 234 ÷ 9 = 26 masa. İkisinde de kalan 0."],
      { kural: "Artmadan paylaştırma sorularında bölünebilme kuralları hızlı karar verdirir.", dogruNeden: "234 hem 6'ya (çift ve rakam toplamı 9) hem 9'a (rakam toplamı 9) kalansız bölünür; 4'e ve 5'e bölünmez." }),
  );
  SORU_EKLE("bol.rakam",
    z => { let x, y, deger; do { x = R(1, 9); y = R(0, 9); deger = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => (x + a + y) % 3 === 0); } while (deger.length < 3);
      const t = deger.reduce((a, b) => a + b, 0), mx = Math.max(...deger), mn = Math.min(...deger);
      return S({ kaz: "bol.rakam", duzey: "uygulama", zorluk: 3, soru: `Üç basamaklı <b>${x}A${y}</b> sayısı 3 ile kalansız bölünüyor. A yerine yazılabilecek rakamların <b>toplamı</b> kaçtır?`, dogru: t,
        yanlis: [[deger.length, "dikkat", "Kaç farklı rakam yazılabileceğini buldun; soru bu rakamların toplamını istiyor."], [mx, "dikkat", "Yalnızca en büyük rakamı yazdın; hepsini toplamalısın."], [t - mx, "islem", `En büyük değer olan ${mx} rakamını unuttun.`], [mn > 0 ? t - mn : t + 3, "islem", mn > 0 ? `${mn} rakamını unuttun.` : "A'nın alabileceği değerleri yeniden yaz; listede olmayan bir değer eklemişsin."]],
        ipucu: `${x} + A + ${y} toplamı 3'ün katı olmalı.`,
        cozum: [`🔎 Soruyu anlayalım: ${x}A${y} sayısının 3'e bölünmesi için A'nın alabileceği değerleri bulup toplayacağız.`,
          "💡 Hatırlayalım: Bir sayı, rakamlarının toplamı 3'ün katıysa 3'e kalansız bölünür.",
          `✏️ Bilinen rakamların toplamı: ${x} + ${y} = ${x + y}.`,
          `✏️ ${x + y} + A toplamı 3'ün katı olmalı. A = ${deger.map(a => `${a} (toplam ${x + y + a})`).join(", ")}.`,
          `✏️ Toplayalım: ${deger.join(" + ")} = ${t}.`,
          `✅ Sonuç: A yerine yazılabilecek rakamların toplamı ${t} olur.`,
          `🔁 Kontrol edelim: A'nın değerleri 3'er 3'er artıyor (${lst(deger)}). Örneğin ${x}${mx}${y} ÷ 3 = ${(100 * x + 10 * mx + y) / 3}, kalan 0.`],
        kural: "3 ile bölünebilmede eksik rakamın değerleri 3'er 3'er artar.", dogruNeden: `A; ${lst(deger)} olabilir. Toplamları ${t}.` }); },
    z => { const m1 = R(0, 9), m2 = R(0, 9), s = m1 + m2, A = (9 - s % 9) % 9 || 9;
      const A3 = [1, 2, 3].find(v => (v + s) % 3 === 0), A5 = (9 - (s + 5) % 9) % 9 || 9;
      const aday = [[A3, "kavrama", "3 ile bölünebilme kuralını uyguladın; sayı 9 ile bölünmeli."], [A5, "kavrama", "B'yi 5 aldın; 10 ile bölünen sayıların son rakamı 0 olmalı."], [A - 3, "islem", ""], [A + 3, "islem", ""], [A - 1, "islem", ""], [A + 1, "islem", ""]]
        .filter(([v]) => v >= 1 && v <= 9 && v !== A).map(([v, h, n]) => [v, h, (n ? n + " " : "") + `${v}${m1}${m2}0 sayısının rakamları toplamı ${v + s}; 9'un katı değil.`]);
      return S({ kaz: "bol.rakam", duzey: "uygulama", zorluk: 3, soru: `Dört basamaklı <b>A${m1}${m2}B</b> sayısı hem 10 ile hem 9 ile kalansız bölünüyor. Buna göre A kaçtır?`, dogru: A, yanlis: aday,
        ipucu: "Önce 10 kuralıyla B'yi bul, sonra 9 kuralıyla A'yı.",
        cozum: [`🔎 Soruyu anlayalım: A${m1}${m2}B sayısı 10'a ve 9'a bölünüyor. Önce B'yi, sonra A'yı bulacağız.`,
          "💡 Hatırlayalım: 10 ile bölünen sayıların birler basamağı 0'dır. 9 ile bölünen sayıların rakamları toplamı 9'un katıdır.",
          "✏️ 10 kuralı: B = 0.",
          `✏️ Rakamlar toplamı: A + ${m1} + ${m2} + 0 = A + ${s}. Bu toplam 9'un katı olmalı.`,
          `✏️ A bir rakam ve sayının başında olduğu için 0 olamaz. A + ${s} = ${A + s} olunca 9'un katı oluyor → A = ${A}.`,
          `✅ Sonuç: A = ${A}, sayı ${A}${m1}${m2}0 olur.`,
          `🔁 Kontrol edelim: ${A * 1000 + m1 * 100 + m2 * 10} ÷ 9 = ${(A * 1000 + m1 * 100 + m2 * 10) / 9} ve ${A * 1000 + m1 * 100 + m2 * 10} ÷ 10 = ${(A * 1000 + m1 * 100 + m2 * 10) / 10}. İki bölmede de kalan 0.`],
        kural: "Birden fazla koşul varsa önce son rakamı belirleyen kuralı (2, 5, 10) uygula.", dogruNeden: `B = 0 olmalı; A + ${s} toplamının 9'un katı olması için A = ${A}.` }); },
    Q("bol.rakam", "transfer", 3, "Bir kasanın şifresi <b>71A4</b> biçiminde dört basamaklı bir sayıdır. Şifre hem 4 ile hem 9 ile kalansız bölünüyor. A kaçtır?", "6",
      [["3", "kavrama", "A = 3 için rakamlar toplamı 15 olur; bu 3'ün katıdır ama 9'un katı değildir. Ayrıca 34 sayısı 4'e bölünmez."], ["0", "dikkat", "A = 0 için 7104 sayısı 4'e bölünür ama rakamlar toplamı 12, 9'un katı değildir."], ["2", "islem", "A = 2 için son iki basamak 24 (4'e bölünür) ama rakamlar toplamı 14, 9'un katı değildir."]],
      "Önce 9 kuralıyla A için aday bul, sonra 4 kuralıyla kontrol et.",
      ["🔎 Soruyu anlayalım: 71A4 sayısı 4'e ve 9'a bölünecek. A rakamını arıyoruz.",
        "💡 Hatırlayalım: 9 ile bölünmede rakamlar toplamı 9'un katı olmalı. 4 ile bölünmede son iki basamak 4'e bölünmeli.",
        "✏️ Rakamlar toplamı: 7 + 1 + A + 4 = 12 + A. 9'un katı olması için 12 + A = 18 → A = 6.",
        "✏️ 4 kuralı: Son iki basamak A4 = 64. 64 ÷ 4 = 16, kalan 0. Uygun!",
        "✅ Sonuç: A = 6, şifre 7164'tür.",
        "🔁 Kontrol edelim: 7164 ÷ 9 = 796 ve 7164 ÷ 4 = 1791. İkisinde de kalan 0."],
      { kural: "İki koşul varsa birinden aday bul, diğeriyle kontrol et.", dogruNeden: "A = 6 için rakamlar toplamı 18 (9'un katı) ve son iki basamak 64 (4'e bölünür)." }),
  );
  SORU_EKLE("bol.ayirt",
    z => { let n, ev, yok; do { n = R(100, 9999); ev = [2, 3, 4, 5, 6, 9, 10].filter(d => n % d === 0); yok = [2, 3, 4, 5, 6, 9, 10].filter(d => n % d); } while (ev.length < 1 || yok.length < 3);
      const d = sec(ev), yanlisD = karistir(yok).slice(0, 4);
      return S({ kaz: "bol.ayirt", duzey: "aciklama", zorluk: 2, soru: `${n} sayısı için aşağıdakilerden hangisi <b>doğrudur</b>?`, dogru: `${BOLEN_EKI[d]} kalansız bölünür.`,
        yanlis: yanlisD.map(x => [`${BOLEN_EKI[x]} kalansız bölünür.`, x === 4 || x === 6 || x === 9 ? "kavrama" : "bilgi", kuralAcikla(n, x)]),
        ipucu: "Her seçenekteki bölen için o bölenin kuralını uygula.",
        cozum: [`🔎 Soruyu anlayalım: ${n} sayısı için doğru olan bölünebilme ifadesini bulacağız.`,
          "💡 Hatırlayalım: 2, 5, 10 → son rakam; 4 → son iki basamak; 3, 9 → rakamlar toplamı; 6 → hem 2 hem 3 kuralı.",
          `✏️ Doğru seçenek: ${kuralAcikla(n, d)}`,
          ...yanlisD.slice(0, 3).map(x => `✏️ ${kuralAcikla(n, x)}`).slice(0, 2),
          `✅ Sonuç: ${n} sayısı ${BOLEN_EKI[d]} kalansız bölünür.`,
          `🔁 Kontrol edelim: ${n} ÷ ${d} = ${n / d}, kalan 0.`],
        kural: "Her bölen için doğru kuralı seç: son rakam, son iki basamak ya da rakamlar toplamı.", dogruNeden: kuralAcikla(n, d) }); },
    z => { let dogru, a, b, c;
      do { dogru = 18 * (2 * R(3, 27) + 1); } while (dogru > 999);
      a = 36 * R(3, 27);
      do { b = 9 * (2 * R(6, 55) + 1); } while (b === dogru);
      do { c = 6 * R(17, 166); } while (c % 9 === 0 || c % 4 === 0);
      return S({ kaz: "bol.ayirt", duzey: "uygulama", zorluk: 3, soru: "Aşağıdaki sayılardan hangisi 2 ile ve 9 ile kalansız bölündüğü hâlde <b>4 ile bölünmez</b>?", dogru,
        yanlis: [[a, "dikkat", `${a} sayısı 2'ye ve 9'a bölünür ama son iki basamağı (${String(son2(a)).padStart(2, "0")}) 4'e bölündüğü için 4'e de bölünür.`], [b, "bilgi", `${b} tek sayıdır; 2'ye bölünmez.`], [c, "kavrama", `${c} çifttir ama rakamları toplamı ${rt(c)}, 9'un katı değil.`]],
        ipucu: "Üç koşulu sırayla kontrol et: çift mi, rakam toplamı 9'un katı mı, son iki basamak 4'e bölünüyor mu?",
        cozum: ["🔎 Soruyu anlayalım: Aranan sayı 2'ye ve 9'a bölünecek, 4'e bölünmeyecek.",
          "💡 Hatırlayalım: 2 → son rakam çift; 9 → rakamlar toplamı 9'un katı; 4 → son iki basamak 4'e bölünür.",
          `✏️ ${b}: tek sayı, elenir. ${c}: rakamları toplamı ${rt(c)}, 9'un katı değil, elenir.`,
          `✏️ ${a}: çift, rakamları toplamı ${rt(a)}; ama son iki basamak (${String(son2(a)).padStart(2, "0")}) 4'e bölünür, elenir.`,
          `✏️ ${dogru}: çift, rakamları toplamı ${rt(dogru)} (9'un katı), son iki basamak (${String(son2(dogru)).padStart(2, "0")}) 4'e bölünmez.`,
          `✅ Sonuç: Aranan sayı ${dogru} olur.`,
          `🔁 Kontrol edelim: ${dogru} ÷ 18 = ${dogru / 18} (2 ve 9'a bölünür), ${dogru} ÷ 4 = ${Math.floor(dogru / 4)}, kalan ${dogru % 4}.`],
        kural: "2'ye bölünen her sayı 4'e bölünmez; 4 için son iki basamağa bakılır.", dogruNeden: `${dogru} çift, rakamları toplamı ${rt(dogru)} ve son iki basamağı 4'e bölünmüyor.` }); },
    Q("bol.ayirt", "baglanti", 2, "Bir sayının rakamlarının yerleri değiştirilerek yeni bir sayı yazılıyor. İlk sayı hangi sayıya kalansız bölünüyorsa yeni sayının da o sayıya bölündüğü <b>kesindir</b>?", "9",
      [["2", "kavrama", "2 kuralı son rakama bakar; yer değiştirince son rakam değişebilir. Örnek: 12 → 21."], ["4", "kavrama", "4 kuralı son iki basamağa bakar; bunlar değişebilir. Örnek: 136 → 163."], ["5", "kavrama", "5 kuralı son rakama bakar; yer değiştirince son rakam 0 ya da 5 olmayabilir. Örnek: 15 → 51."]],
      "Hangi kural rakamların sırasına değil, yalnızca rakamların kendisine bakar?",
      ["🔎 Soruyu anlayalım: Rakamların yeri değişince hangi bölünebilme kesinlikle korunur?",
        "💡 Hatırlayalım: 2, 5, 10 kuralları son rakama, 4 kuralı son iki basamağa, 3 ve 9 kuralları rakamlar toplamına bakar.",
        "✏️ Rakamların yeri değişse de rakamların toplamı değişmez. Örnek: 162 → 2 + 6 + 1 = 9, 216 → 9, 621 → 9.",
        "✏️ Son rakam değişebilir: 162 çift ama 621 tek. Bu yüzden 2, 4, 5, 10 bölünebilmeleri bozulabilir.",
        "✅ Sonuç: 9'a bölünebilme kesinlikle korunur (3'e bölünebilme de).",
        "🔁 Kontrol edelim: 162 ÷ 9 = 18, 621 ÷ 9 = 69, 216 ÷ 9 = 24. Hepsinde kalan 0."],
      { kural: "Rakam toplamına bakan kurallar (3 ve 9) rakamların sırasından etkilenmez.", dogruNeden: "Rakamların yeri değişince rakamlar toplamı aynı kalır; bu yüzden 9'a bölünebilme bozulmaz." }),
  );

  /* =================== ASAL SAYILAR =================== */
  const ASALLAR = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199];
  const enKucukAsal = n => bolenler(n).find(d => d > 1);
  /* Bölen merdiveni: [[sayı, asal bölen], ...] */
  const merdiven = n => { const a = []; while (n > 1) { const p = enKucukAsal(n); a.push([n, p]); n /= p; } return a; };

  SORU_EKLE("asal.tani",
    z => { const n = sec([49, 77, 91, 119, 133, 143, 161, 169, 187, 203, 209, 221]), p = enKucukAsal(n), as = karistir(ASALLAR).slice(0, 3);
      return S({ kaz: "asal.tani", duzey: "uygulama", zorluk: 3, soru: `Aşağıdaki sayılardan hangisi asal sayı <b>değildir</b>?`, dogru: n,
        yanlis: as.map(x => [x, "kavrama", `${x} yalnızca 1'e ve kendisine bölünür; asal sayıdır.`]),
        ipucu: "Tek sayıların hepsi asal değildir. 7, 11, 13 ile bölmeyi de dene.",
        cozum: ["🔎 Soruyu anlayalım: Seçeneklerden asal olmayanı (bileşik olanı) bulacağız.",
          "💡 Hatırlayalım: Asal sayının yalnızca 2 çarpanı vardır: 1 ve kendisi. Kontrol için sayıyı 2, 3, 5, 7, 11, 13 gibi asallara böleriz.",
          `✏️ Hepsi tek; 2'ye bölünmüyorlar. 3 ve 5 kurallarına da uymuyorlar. Daha büyük asallarla deneyelim.`,
          `✏️ ${n} ÷ ${p} = ${n / p}, kalan 0. Yani ${n} = ${p} × ${n / p}.`,
          `✅ Sonuç: ${n} sayısının 1 ve kendisinden başka çarpanları var; asal değildir.`,
          `🔁 Kontrol edelim: ${n}${ek(n, "in")} çarpanları: ${lst(bolenler(n))}. ${bolenler(n).length} çarpan var; asal olsaydı 2 olurdu.`],
        kural: "Tek sayı olmak asal olmak demek değildir; 7, 11, 13 ile bölmeyi dene.", dogruNeden: `${n} = ${p} × ${n / p}; 1 ve kendisinden başka çarpanı var.` }); },
    z => { let a, b, as; do { a = R(10, 85); b = a + R(10, 14); as = []; for (let i = a + 1; i < b; i++) if (asalMi(i)) as.push(i); } while (as.length < 2 || as.length > 4);
      const t = as.reduce((x, y) => x + y, 0); const tekBil = []; for (let i = a + 1; i < b; i++) if (i % 2 && !asalMi(i)) tekBil.push(i);
      const y = [[t - as[0], "dikkat", `${as[0]} de bu aralıkta bir asal sayıdır.`], [t - as[as.length - 1], "dikkat", `${as[as.length - 1]} de bu aralıkta bir asal sayıdır.`], [t + 2, "islem", "Toplamayı yeniden yap."]];
      if (tekBil.length) { const x = sec(tekBil); y.unshift([t + x, "kavrama", `${x} asal değildir: ${x} = ${enKucukAsal(x)} × ${x / enKucukAsal(x)}.`]); }
      return S({ kaz: "asal.tani", duzey: "uygulama", zorluk: 2, soru: `${a} ile ${b} arasındaki asal sayıların toplamı kaçtır? (${a} ve ${b} dahil değil)`, dogru: t, yanlis: y,
        ipucu: "Çift sayıları ve 3, 5, 7'ye bölünenleri ele.",
        cozum: [`🔎 Soruyu anlayalım: ${a + 1}${ek(a + 1, "den")} ${b - 1}${ek(b - 1, "e")} kadar olan sayılardaki asalları bulup toplayacağız.`,
          "💡 Hatırlayalım: 2 dışındaki çift sayılar asal değildir. Tek sayıları 3, 5, 7 gibi asallara bölerek kontrol ederiz.",
          `✏️ Aralıktaki tek sayılar: ${lst([...Array(b - a - 1).keys()].map(i => a + 1 + i).filter(i => i % 2))}.`,
          tekBil.length ? `✏️ Asal olmayanlar: ${tekBil.map(x => `${x} = ${enKucukAsal(x)} × ${x / enKucukAsal(x)}`).join(", ")}.` : "✏️ Bu tek sayıların hiçbiri 3, 5 ya da 7'ye bölünmüyor.",
          `✏️ Asal sayılar: ${lst(as)}. Toplam: ${as.join(" + ")} = ${t}.`,
          `✅ Sonuç: Asal sayıların toplamı ${t} olur.`,
          `🔁 Kontrol edelim: Bulduğumuz her sayının yalnızca 2 çarpanı var (1 ve kendisi). ${as.length} asal sayı topladık.`],
        kural: "Asal sayı arken önce çiftleri ele, sonra 3, 5, 7 ile bölmeyi dene.", dogruNeden: `Aralıktaki asallar ${lst(as)}; toplamları ${t}.` }); },
    Q("asal.tani", "transfer", 2, "Defne'nin dolap şifresi 70 ile 80 arasındaki <b>asal</b> sayılardan biridir. Şifrenin birler basamağı 3'ten büyükse şifre kaçtır?", "79",
      [["77", "kavrama", "77 = 7 × 11; asal değildir."], ["73", "dikkat", "73 asaldır ama birler basamağı 3; 3'ten büyük değildir."], ["75", "bilgi", "75, 5 ile biter; 5'e bölünür, asal değildir."]],
      "70 ile 80 arasındaki asalları yaz, sonra birler basamağına bak.",
      ["🔎 Soruyu anlayalım: Şifre 70 ile 80 arasında bir asal sayı ve birler basamağı 3'ten büyük.",
        "💡 Hatırlayalım: Asal sayı yalnızca 1'e ve kendisine bölünür. Çiftler ve 5 ile bitenler (5 hariç) asal olamaz.",
        "✏️ Adaylar (tek ve 5 ile bitmeyen): 71, 73, 77, 79.",
        "✏️ 77 = 7 × 11 asal değil. Asallar: 71, 73, 79. Birler basamağı 3'ten büyük olan: 79.",
        "✅ Sonuç: Şifre 79'dur.",
        "🔁 Kontrol edelim: 79; 2, 3, 5, 7 asallarından hiçbirine bölünmüyor (7 × 11 = 77, 7 × 12 = 84). Gerçekten asal."],
      { kural: "Bir sayının asal olup olmadığını küçük asallara bölerek kontrol et.", dogruNeden: "70–80 arasındaki asallar 71, 73, 79; birler basamağı 3'ten büyük olan yalnızca 79." }),
  );
  SORU_EKLE("asal.ayir",
    z => { let n, c; do { n = sec([2, 3]) * sec([2, 3, 5]) * sec([5, 7, 11, 13]) * sec([1, 2, 3]); c = asalCarpan(n); } while (Object.keys(c).length < 2 || n > 300);
      const ps = Object.keys(c).map(Number), mx = Math.max(...ps), mn = Math.min(...ps), m = merdiven(n);
      return S({ kaz: "asal.ayir", duzey: "uygulama", zorluk: 2, soru: `${n} sayısının <b>en büyük asal çarpanı</b> kaçtır?`, dogru: mx,
        yanlis: [[n / mn, "kavrama", `${n / mn}, ${n}${ek(n, "in")} bir çarpanıdır ama ${asalMi(n / mn) ? "en büyük asal çarpan değildir" : "asal değildir"}.`], [mn, "dikkat", `${mn} en küçük asal çarpandır; en büyüğü istendi.`], [ps.reduce((a, b) => a + b, 0), "kavrama", "Asal çarpanları topladın; soru en büyüğünü istiyor."], [mx * mn, "kavrama", `${mx * mn} bileşik bir sayıdır; asal çarpan olamaz.`]],
        ipucu: "Sayıyı en küçük asaldan başlayarak bölmeye devam et; en sonda kalan asal en büyüktür.",
        cozum: [`🔎 Soruyu anlayalım: ${n} sayısını asal çarpanlarına ayırıp en büyüğünü bulacağız.`,
          "💡 Hatırlayalım: Bölen merdiveninde sayıyı en küçük asaldan başlayarak, 1 kalana kadar asal sayılara böleriz.",
          `✏️ Bölmeler: ${m.map(([x, p]) => `${x} ÷ ${p} = ${x / p}`).join("; ")}.`,
          `✏️ Asal çarpanlara ayrılmış hâli: ${n} = ${ustlu(c)}. Farklı asal çarpanlar: ${lst(ps)}.`,
          `✅ Sonuç: En büyük asal çarpan ${mx} olur.`,
          `🔁 Kontrol edelim: ${m.map(x => x[1]).join(" × ")} = ${n}. ${mx} asal; ondan büyük bir asal çarpan yok.`],
        kural: "Asal çarpan hem çarpan hem asal olmalıdır.", dogruNeden: `${n} = ${ustlu(c)}; asal çarpanların en büyüğü ${mx}.` }); },
    z => { const n = sec([24, 36, 40, 48, 54, 56, 60, 72, 80, 84, 90, 96, 100, 108, 120, 126, 144, 150, 168, 180]), c = asalCarpan(n), m = merdiven(n), k = m.length, f = Object.keys(c).length;
      return S({ kaz: "asal.ayir", duzey: "aciklama", zorluk: 2, soru: `${n} sayısı bölen merdiveni (bölme yöntemi) ile asal çarpanlarına ayrılıyor. 1 kalana kadar <b>kaç bölme</b> yapılır?`, dogru: k,
        yanlis: [[f, "kavrama", `${f}, farklı asal çarpan sayısıdır; aynı asal sayıyla birden çok kez bölünür.`], [k + 1, "dikkat", "1'e ulaşınca bölme biter; 1'i de bölme saymış olabilirsin."], [k - 1, "islem", "Bir bölmeyi atladın; her adımı yaz."], [bolenler(n).length, "kavrama", "Bu, çarpan sayısıdır; bölme sayısı asal çarpanların üslerinin toplamıdır."]],
        ipucu: "Merdiveni adım adım yaz ve satırları say.",
        cozum: [`🔎 Soruyu anlayalım: ${n} sayısını asal sayılara böle böle 1'e indireceğiz ve bölme sayısını sayacağız.`,
          "💡 Hatırlayalım: Bölen merdiveninde her satırda sayıyı bölen en küçük asal sayıyı kullanırız.",
          `✏️ ${m.slice(0, Math.ceil(k / 2)).map(([x, p]) => `${x} ÷ ${p} = ${x / p}`).join("; ")}`,
          `✏️ ${m.slice(Math.ceil(k / 2)).map(([x, p]) => `${x} ÷ ${p} = ${x / p}`).join("; ")}`,
          `✅ Sonuç: Toplam ${k} bölme yapılır; ${n} = ${ustlu(c)}.`,
          `🔁 Kontrol edelim: Üslerin toplamı ${Object.values(c).join(" + ")} = ${k}; bölme sayısı ile aynı.`],
        kural: "Bölen merdivenindeki bölme sayısı, asal çarpanların üslerinin toplamına eşittir.", dogruNeden: `${n} = ${ustlu(c)}; ${k} asal çarpan (tekrarlarla) olduğu için ${k} bölme yapılır.` }); },
    Q("asal.ayir", "baglanti", 2, "Mert 60 sayısını çarpan ağacında önce <b>6 × 10</b>, Elif ise önce <b>4 × 15</b> diye ayırmaya başladı. İkisi de dalları asal sayılara ulaşana kadar devam ettirdi. Sonuç için hangisi doğrudur?", "İkisi de 2² · 3 · 5 bulur.",
      [["Mert 2 · 3 · 5, Elif 2² · 3 · 5 bulur.", "islem", "Mert'in ağacında 6 = 2 · 3 ve 10 = 2 · 5; iki tane 2 vardır: 2² · 3 · 5."], ["Sonuçlar farklıdır; çünkü başlangıç çarpanları farklıdır.", "kavrama", "Bir sayının asal çarpanlarına ayrılışı tektir; nereden başlarsan başla aynı asallara ulaşırsın."], ["İkisi de 4 · 3 · 5 bulur.", "bilgi", "4 asal değildir; 4 = 2 · 2 diye ayrılmaya devam edilmelidir."]],
      "Her iki ağacı da sonuna kadar dallandır.",
      ["🔎 Soruyu anlayalım: 60 iki farklı yoldan asal çarpanlarına ayrılıyor; sonuçları karşılaştıracağız.",
        "💡 Hatırlayalım: Bir sayı hangi çarpan çiftiyle başlarsa başlasın, asal çarpanlarına ayrılmış hâli tektir.",
        "✏️ Mert: 60 = 6 × 10 → 6 = 2 × 3, 10 = 2 × 5 → 2 · 2 · 3 · 5.",
        "✏️ Elif: 60 = 4 × 15 → 4 = 2 × 2, 15 = 3 × 5 → 2 · 2 · 3 · 5.",
        "✅ Sonuç: İkisi de 60 = 2² · 3 · 5 bulur.",
        "🔁 Kontrol edelim: 2 · 2 · 3 · 5 = 4 · 15 = 60. Doğru!"],
      { kural: "Bir sayının asal çarpanlarına ayrılmış hâli tektir.", dogruNeden: "İki ağaçta da dallar 2, 2, 3 ve 5'e ulaşır: 2² · 3 · 5 = 60." }),
  );
  SORU_EKLE("asal.kavram",
    z => { const a = R(20, 85), b = a + R(8, 12); const say = [...Array(b - a + 1).keys()].map(i => a + i), as = say.filter(asalMi), bil = say.filter(x => !asalMi(x));
      return S({ kaz: "asal.kavram", duzey: "uygulama", zorluk: 2, soru: `${a} ile ${b} arasında (${a} ve ${b} dahil) kaç tane <b>bileşik</b> sayı vardır?`, dogru: bil.length,
        yanlis: [[as.length, "kavrama", "Asal sayıları saydın; bileşik sayı, 2'den fazla çarpanı olan sayıdır."], [say.length, "kavrama", "Aralıktaki bütün sayıları saydın; asal olanları çıkarmalısın."], [bil.length - 1, "dikkat", `${a} ve ${b} de sayılmalı; uçları kontrol et.`], [bil.length + 1, "islem", "Asal bir sayıyı bileşik saymış olabilirsin."]],
        ipucu: "Önce asal sayıları bul; geri kalanların hepsi bileşiktir.",
        cozum: [`🔎 Soruyu anlayalım: ${a}${ek(a, "den")} ${b}${ek(b, "e")} kadar ${say.length} sayı var; bunlardan bileşik olanları sayacağız.`,
          "💡 Hatırlayalım: 1'den büyük ve asal olmayan sayılar bileşiktir; 2'den fazla çarpanları vardır.",
          `✏️ Aralıktaki asal sayılar: ${as.length ? lst(as) : "yok"} (${as.length} tane).`,
          `✏️ Bileşik sayılar: ${lst(bil)}.`,
          `✏️ Sayalım: ${say.length} − ${as.length} = ${bil.length}.`,
          `✅ Sonuç: ${bil.length} tane bileşik sayı vardır.`,
          `🔁 Kontrol edelim: Asal + bileşik = ${as.length} + ${bil.length} = ${say.length}; aralıktaki bütün sayılar sayıldı.`],
        kural: "1'den büyük her sayı ya asal ya bileşiktir.", dogruNeden: `${say.length} sayıdan ${as.length} tanesi asal; geri kalan ${bil.length} tanesi bileşik.` }); },
    z => { const n = sec([9, 13, 15, 21, 25, 33, 39, 45, 49, 63, 75, 81]), p = n - 2, c = 2 * p;
      return S({ kaz: "asal.kavram", duzey: "baglanti", zorluk: 3, soru: `p ve q iki asal sayıdır ve p + q = ${n} olduğu biliniyor. Buna göre p × q kaçtır?`, dogru: c,
        yanlis: [[p, "dikkat", `${p}, sayılardan yalnızca biridir; soru iki sayının çarpımını istiyor.`], [3 * (n - 3), "kavrama", `3 + ${n - 3} olamaz; ${n - 3} çift sayıdır ve asal değildir.`], [n, "kavrama", "Bu, sayıların toplamıdır; çarpım istendi."], [5 * (n - 5), "kavrama", `${n - 5} çift sayıdır, asal değildir.`]],
        ipucu: "İki tek sayının toplamı çift olur. Toplam tek ise sayılardan biri çift olmalı.",
        cozum: [`🔎 Soruyu anlayalım: Toplamı ${n} olan iki asal sayının çarpımını bulacağız.`,
          "💡 Hatırlayalım: 2 tek çift asal sayıdır; diğer bütün asallar tektir. İki tek sayının toplamı çifttir.",
          `✏️ ${n} tek bir sayı. İki asal da tek olsaydı toplam çift olurdu. O hâlde asallardan biri 2'dir.`,
          `✏️ Diğer asal: ${n} − 2 = ${p}. ${p} asal mı? Yalnızca 1'e ve ${p}${ek(p, "e")} bölünüyor; evet.`,
          `✏️ Çarpım: 2 × ${p} = ${c}.`,
          `✅ Sonuç: p × q = ${c}.`,
          `🔁 Kontrol edelim: 2 + ${p} = ${n} ✓. 2 ve ${p} ikisi de asal ✓.`],
        kural: "Toplamı tek olan iki asal sayıdan biri mutlaka 2'dir.", dogruNeden: `Toplam tek olduğu için asallardan biri 2, diğeri ${p}; çarpımları ${c}.` }); },
    Q("asal.kavram", "aciklama", 1, "1 sayısı için aşağıdakilerden hangisi doğrudur?", "1 ne asal ne de bileşik sayıdır.",
      [["1 asal sayıdır.", "bilgi", "Asal sayıların tam 2 çarpanı vardır; 1'in yalnızca 1 çarpanı vardır."], ["1 bileşik sayıdır.", "bilgi", "Bileşik sayıların 2'den fazla çarpanı vardır; 1'in tek çarpanı var."], ["1 hem asal hem bileşik sayıdır.", "kavrama", "Bir sayı aynı anda hem asal hem bileşik olamaz; 1 ise ikisi de değildir."]],
      "1'in kaç çarpanı var?",
      ["🔎 Soruyu anlayalım: 1 sayısının asal mı, bileşik mi olduğunu soruyor.",
        "💡 Hatırlayalım: Asal sayı: tam 2 çarpanı olan sayı. Bileşik sayı: 2'den fazla çarpanı olan sayı.",
        "✏️ 1'in çarpanları: yalnızca 1. Çarpan sayısı 1.",
        "✏️ 1, 2 çarpanlı olmadığı için asal değil; 2'den fazla çarpanı olmadığı için bileşik de değil.",
        "✅ Sonuç: 1 ne asal ne de bileşik sayıdır.",
        "🔁 Kontrol edelim: En küçük asal sayı 2 (çarpanları 1, 2), en küçük bileşik sayı 4 (çarpanları 1, 2, 4)."],
      { kural: "1 ne asal ne bileşiktir; en küçük asal sayı 2'dir.", dogruNeden: "1'in yalnızca bir çarpanı vardır; asal ya da bileşik olma koşullarının hiçbirini sağlamaz." }),
  );
})();
