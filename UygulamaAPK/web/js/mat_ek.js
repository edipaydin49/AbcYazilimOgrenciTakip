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
        gorsel: G.izgara(a, b), dogru: `${n} = ${a} × ${b}`,
        yanlis: [[`${a + b} = ${a} + ${b}`, "kavrama", "Kenarlar toplanmaz; birim kare sayısı kenarların çarpımıdır."], [`${n} = ${a} × ${b + 1}`, "dikkat", "Sütunları yeniden say; " + b + " sütun var."], [`${2 * (a + b)} = ${a} × ${b}`, "kavrama", "Bu, dikdörtgenin çevresidir; birim kare sayısı alanı verir."]],
        ipucu: "Satır sayısı × sütun sayısı = toplam birim kare.", cozum: [`Satırları say: ${a}. Sütunları say: ${b}.`, `Toplam birim kare: ${a} × ${b} = ${n}.`, `Demek ki ${a} ve ${b}, ${n}${ek(n, "in")} çarpan çiftidir: ${n} = ${a} × ${b}.`] }); },
    z => { const n = sec([12, 18, 20, 24, 30, 36]); const ciftler = bolenler(n).filter(d => d * d <= n).map(d => [d, n / d]); const c = sec(ciftler.filter(x => x[0] > 1));
      if (!c) return null;
      return S({ kaz: "carpan.model", duzey: "transfer", zorluk: 2, soru: `${n} sıra öğrenci bahçede dikdörtgen biçiminde dizilecek. Her sırada eşit sayıda öğrenci olacak. Aşağıdakilerden hangisi olamaz?`,
        dogru: (() => { let d; do { d = R(2, n - 1); } while (n % d === 0); return `${d} sıra`; })(),
        yanlis: ciftler.slice(1).map(([a, b]) => [`${a} sıra`, "kavrama", `${a} sıra olabilir: ${a} × ${b} = ${n}.`]).concat([[`${n} sıra`, "kavrama", `${n} sıra olabilir: ${n} × 1 = ${n}.`]]),
        ipucu: "Sıra sayısı, öğrenci sayısının çarpanı olmalı.", cozum: [`Sıra sayısı × sıradaki kişi = ${n}; bu yüzden sıra sayısı ${n}${ek(n, "in")} bir çarpanı olmalı.`, `${n}${ek(n, "in")} çarpanları: ${bolenler(n).join(", ")}.`, "Bu listede olmayan seçenek olamaz."] }); },
  );
  ekle("carpan.say",
    z => { const n = sec([18, 24, 30, 36, 40, 42, 48, 60]); const tek = bolenler(n).filter(d => d % 2).length;
      return S({ kaz: "carpan.say", duzey: "uygulama", zorluk: 3, soru: `${n} sayısının çarpanlarından kaç tanesi tek sayıdır?`, dogru: tek,
        yanlis: [[bolenler(n).length - tek, "dikkat", "Çift çarpanları saydın; soru tek olanları istiyor."], [bolenler(n).length, "dikkat", "Bütün çarpanları saydın; yalnızca tek olanları say."], [tek - 1, "dikkat", "1 de bir çarpandır ve tek sayıdır."]],
        ipucu: "Önce bütün çarpanları yaz, sonra tek olanları işaretle.", cozum: [`${n}${ek(n, "in")} çarpanları: ${bolenler(n).join(", ")}.`, `Tek olanlar: ${bolenler(n).filter(d => d % 2).join(", ")}.`, `Toplam ${tek} tane.`] }); },
  );
  ekle("kat.aralik",
    z => { const k = R(3, 9), bas = R(1, 4);
      const noktalar = [0, 1, 2, 3].map(i => ({ v: k * (bas + i), ad: "" }));
      return S({ kaz: "kat.aralik", duzey: "aciklama", zorluk: 1, soru: "Sayı doğrusunda kırmızı ile işaretlenen sayılar hangi sayının ardışık katlarıdır?",
        gorsel: G.sayiDogrusu({ min: k * (bas - 1), max: k * (bas + 4), adim: k, araAdim: 1, etiket: x => x, noktalar }), dogru: k,
        yanlis: [[k + 1, "islem", `İşaretli sayılar arasındaki farkı yeniden say: ${k} birim.`], [k * bas, "kavrama", "Bu, işaretli ilk sayıdır; katların ortak çarpanı istendi."], [2 * k, "dikkat", "İşaretli sayılar arasındaki fark " + k + "; " + 2 * k + " değil."]],
        ipucu: "Art arda iki işaretli sayının farkı kaçtır?", cozum: [`İşaretli sayılar: ${noktalar.map(n => n.v).join(", ")}.`, `Her biri bir öncekinden ${k} fazla; hepsi ${k}${ek(k, "e")} kalansız bölünür.`, `Bunlar ${k}${ek(k, "in")} ardışık katlarıdır.`] }); },
    z => { const k = sec([6, 7, 8, 9, 11, 12, 13, 15]); const enk = Math.ceil(100 / k) * k;
      return S({ kaz: "kat.aralik", duzey: "uygulama", zorluk: 3, soru: `${k} sayısının katı olan en küçük üç basamaklı sayı kaçtır?`, dogru: enk,
        yanlis: [[enk - k, "dikkat", `${enk - k} iki basamaklıdır.`], [100, "islem", `100 ÷ ${k} kalanlıdır; ${k}${ek(k, "in")} katı değil.`], [enk + k, "dikkat", "Bu da bir kat ama en küçüğü değil."]],
        ipucu: "En küçük üç basamaklı sayı 100. 100'den sonraki ilk katı bul.", cozum: [`En küçük üç basamaklı sayı 100'dür.`, `100 ÷ ${k} = ${Math.floor(100 / k)}, kalan ${100 % k}.`, `Bir sonraki kat: ${k} × ${Math.ceil(100 / k)} = ${enk}.`] }); },
  );
  ekle("bol.ayirt",
    z => { const ad = sec([[6, "hem 2'ye hem 3'e", n => n % 6 === 0], [10, "hem 2'ye hem 5'e", n => n % 10 === 0], [18, "hem 2'ye hem 9'a", n => n % 18 === 0]]);
      const d = ad[0] * R(6, 50); let y = []; while (y.length < 3) { const x = R(100, 999); if (!ad[2](x) && !y.includes(x) && (x % 2 === 0 || x % (ad[0] / 2) === 0)) y.push(x); }
      return S({ kaz: "bol.ayirt", duzey: "uygulama", zorluk: 2, soru: `Aşağıdaki sayılardan hangisi ${ad[1]} kalansız bölünür?`, dogru: d,
        yanlis: y.map(x => [x, "dikkat", `${x} kurallardan yalnızca birini sağlıyor; ikisini birden sağlamalı.`]),
        ipucu: "İki kuralı ayrı ayrı kontrol et; ikisi de sağlanmalı.", cozum: [`${ad[1]} bölünen sayı ${ad[0]}${ek(ad[0], "e")} de bölünür.`, `${d}: iki kuralı da sağlıyor (${d} ÷ ${ad[0]} = ${d / ad[0]}).`, "Diğer seçenekler kurallardan en az birini sağlamıyor."] }); },
  );
  ekle("asal.ayir",
    z => { const n = sec([24, 36, 40, 48, 54, 60, 72, 84, 90]); const a = carpanAgaci(n, null); const bosIdx = sec([1, 2, 4].filter(i => i < a.dugum.length)); const b = carpanAgaci(n, bosIdx);
      const dogru = b.dugum[bosIdx];
      return S({ kaz: "asal.ayir", duzey: "uygulama", zorluk: 2, soru: `${n} sayısının çarpan ağacında soru işaretli (sarı) kutuya hangi sayı gelmelidir?`, gorsel: b.gorsel, dogru,
        yanlis: [[dogru + 1, "islem", "Kutudaki sayıların çarpımı üstteki sayıyı vermiyor."], [dogru * 2, "islem", "Çarpımı yeniden kontrol et."], [Math.max(1, dogru - 1), "islem", "Kutudaki sayıların çarpımı üstteki sayıyı vermiyor."]],
        ipucu: "Her dalda: sol kutu × sağ kutu = üstteki kutu.", cozum: [...b.adimlar.map(([v, p, k]) => `${v} = ${p} × ${k}`), `Yeşil kutular asal çarpanlardır: ${n} = ${ustlu(asalCarpan(n))}.`],
        kural: "Çarpan ağacında her sayı iki çarpanına ayrılır; asal sayıya ulaşınca dal biter." }); },
  );
  ekle("asal.tani",
    z => { const bas = sec([20, 30, 40, 50, 60, 70]); const l = []; for (let i = bas; i <= bas + 10; i++) if (asalMi(i)) l.push(i); const n = l.length;
      return S({ kaz: "asal.tani", duzey: "uygulama", zorluk: 2, soru: `${bas} ile ${bas + 10} arasında (ikisi de dahil) kaç tane asal sayı vardır?`, dogru: n,
        yanlis: [[n + 1, "kavrama", "Tek sayıların hepsi asal değildir; örneğin " + (bas + (bas % 3 === 0 ? 3 : 5)) + " gibi sayıları kontrol et."], [Math.max(0, n - 1), "dikkat", "Bir asal sayıyı atladın."], [5, "kavrama", "Tek sayıları saymış olabilirsin; her tek sayı asal değildir."]],
        ipucu: "Çift sayıları ele. Kalan tek sayıları 3, 5, 7'ye böl.", cozum: [`${bas}–${bas + 10} arasındaki tek sayılar: ${Array.from({ length: 11 }, (_, i) => bas + i).filter(x => x % 2).join(", ")}.`, "3, 5 ya da 7'ye kalansız bölünenleri ele.", `Kalan asal sayılar: ${l.join(", ") || "yok"} → ${n} tane.`] }); },
  );
  ekle("okat.ekok",
    z => { const [a, b] = sec([[4, 6], [6, 8], [6, 9], [8, 12], [9, 12], [10, 15], [12, 18], [4, 10]]); const e = ekok(a, b);
      const kat = x => Array.from({ length: Math.min(8, e / x + 2) }, (_, i) => x * (i + 1));
      return S({ kaz: "okat.ekok", duzey: "aciklama", zorluk: 1, soru: `Tabloda ${a} ve ${b} sayılarının katları verilmiştir. Bu iki sayının en küçük ortak katı kaçtır?`,
        gorsel: G.tablo(["Sayı", "Katları"], [[a, kat(a).join(", ") + ", …"], [b, kat(b).join(", ") + ", …"]]), dogru: e,
        yanlis: [[a * b === e ? 2 * e : a * b, "strateji", "Sayıları çarpmak her zaman en küçük ortak katı vermez."], [ebob(a, b), "kavrama", "Bu en büyük ortak bölendir."], [2 * e, "dikkat", "Bu da ortak kat ama en küçüğü değil."]],
        ipucu: "İki satırda da bulunan en küçük sayıyı ara.", cozum: [`${a}${ek(a, "in")} katları: ${kat(a).join(", ")} …`, `${b}${ek(b, "in")} katları: ${kat(b).join(", ")} …`, `İkisinde de bulunan ilk sayı ${e}: EKOK = ${e}.`] }); },
  );
  ekle("obol.problem",
    z => { const [a, b] = sec([[12, 18], [16, 24], [18, 24], [20, 30], [24, 36], [30, 45]]); const g = ebob(a, b);
      return S({ kaz: "obol.problem", duzey: "transfer", zorluk: 2, soru: `Kenar uzunlukları ${a} m ve ${b} m olan dikdörtgen bir bahçe, hiç boşluk kalmadan eş ve en büyük karelere bölünecek. Bir karenin kenarı kaç metre olur?`,
        gorsel: G.svg(420, 60 + 180 * a / Math.max(a, b), `<rect class="g-yumusak g-cizgi" x="60" y="20" width="${300 * b / Math.max(a, b)}" height="${180 * a / Math.max(a, b)}" stroke-width="2"/>` + G.yazi(60 + 150 * b / Math.max(a, b), 48 + 180 * a / Math.max(a, b), b + " m") + G.yazi(40, 20 + 90 * a / Math.max(a, b), a + " m", { a: "end" }), "dikdörtgen bahçe"),
        dogru: g, yanlis: [[ekok(a, b), "kavrama", "Bu en küçük ortak kattır; parçalara bölmede ortak bölen kullanılır."], [g / 2 >= 1 && g % 2 === 0 ? g / 2 : g + 1, "strateji", "Bu da ortak bölen olabilir ama en büyüğü değil."], [b - a, "bilgi", "Kenarların farkı kareyi vermez."]],
        ipucu: "Karenin kenarı iki kenarı da tam bölmeli ve en büyük olmalı.", cozum: [`Karenin kenarı hem ${a}${ek(a, "i")} hem ${b}${ek(b, "i")} kalansız bölmeli → ortak bölen.`, `${a}${ek(a, "in")} bölenleri: ${bolenler(a).join(", ")}. ${b}${ek(b, "in")} bölenleri: ${bolenler(b).join(", ")}.`, `Ortak bölenlerin en büyüğü ${g}: kare ${g} m × ${g} m olur.`] }); },
  );
  /* ---------------- Tema 2 ---------------- */
  ekle("ol.tahmin",
    z => { const renk = ["Kırmızı", "Mavi", "Sarı", "Yeşil"]; const n = sec([40, 50, 60]); let d; do { d = [R(4, 20), R(4, 20), R(4, 20)]; } while (d.reduce((a, b) => a + b, 0) >= n - 3); d.push(n - d.reduce((a, b) => a + b, 0)); const i = R(0, 3);
      return S({ kaz: "ol.tahmin", duzey: "uygulama", zorluk: 2, soru: `Dört renkli bir çark ${n} kez çevrildi ve sonuçlar grafikte gösterildi. ${renk[i]} gelme olasılığının gözleme dayalı tahmini nedir?`,
        gorsel: G.sutun(renk.map((r, j) => [r, d[j]]), { baslik: `${n} çevirişin sonuçları`, birim: "kez" }), dogru: kesir(d[i], n),
        yanlis: [[kesir(d[i], n - d[i]), "kavrama", "Toplam deneme sayısına bölmelisin, diğer renklerin toplamına değil."], [`1/4`, "kavrama", "Dört renk var diye olasılık 1/4 değildir; gözleme dayalı tahmin deney sonuçlarından hesaplanır."], [kesir(n - d[i], n), "dikkat", "Bu, " + renk[i] + " gelmeme olasılığıdır."]],
        ipucu: "Gelme sayısı ÷ toplam çeviriş sayısı.", cozum: [`Grafikten ${renk[i]} sütununu oku: ${d[i]} kez.`, `Toplam çeviriş: ${n}.`, `Tahmin: ${d[i]}/${n} = ${kesir(d[i], n)}.`] }); },
  );
  ekle("ol.yorum",
    z => { const r = karistir(["kırmızı", "mavi", "yeşil", "sarı"]).slice(0, 3); const sayi = karistir([2, 3, 5]); const t = {}; r.forEach((x, i) => { t[x] = sayi[i]; }); const enCok = r[sayi.indexOf(5)];
      return S({ kaz: "ol.yorum", duzey: "aciklama", zorluk: 1, soru: "Torbadan bakmadan bir top çekilecek. Hangi renk topun çekilme olasılığı en yüksektir?", gorsel: G.torba(t), dogru: enCok[0].toUpperCase() + enCok.slice(1),
        yanlis: r.filter(x => x !== enCok).map(x => [x[0].toUpperCase() + x.slice(1), "dikkat", `${x[0].toUpperCase() + x.slice(1)} toplar daha az; sayısı az olanın çekilme olasılığı düşüktür.`]).concat([["Hepsinin olasılığı eşittir", "kavrama", "Renklerin sayıları farklı; sayısı çok olanın olasılığı yüksektir."]]),
        ipucu: "Her renkten kaç top var? Say.", cozum: [`Torbadakiler: ${r.map(x => t[x] + " " + x).join(", ")}.`, "Sayısı en çok olan renk en kolay çekilir.", `En olası renk: ${enCok} (${t[enCok]} top).`] }); },
  );
  /* ---------------- Tema 3 ---------------- */
  ekle("bas.deger",
    z => { const tam = R(1, 8), on = R(1, 9);
      return S({ kaz: "bas.deger", duzey: "uygulama", zorluk: 1, soru: "Sayı doğrusunda kırmızı nokta hangi sayıyı gösterir?",
        gorsel: G.sayiDogrusu({ min: tam, max: tam + 1, adim: 1, araAdim: 0.1, etiket: x => od(x), noktalar: [{ v: tam + on / 10 }] }), dogru: od(tam + on / 10),
        yanlis: [[od(tam + on / 100), "kavrama", "Aralıklar onda birdir (0,1), yüzde bir değil."], [`${tam},${10 - on}`, "dikkat", "Çentikleri soldan, " + tam + "'den başlayarak say."], [od(tam + 1 + on / 10), "dikkat", "Nokta " + tam + " ile " + (tam + 1) + " arasında."]],
        ipucu: `${tam} ile ${tam + 1} arası 10 eş parçaya bölünmüş; her parça 0,1.`, cozum: [`${tam} ile ${tam + 1} arası 10 eş parçaya bölünmüş: her çentik 0,1 artar.`, `Kırmızı nokta ${tam}'den sonra ${on}. çentikte.`, `Sayı: ${tam} + ${on} × 0,1 = ${od(tam + on / 10)}.`] }); },
  );
  ekle("yuv.kural",
    z => { const a = R(1, 9), b = R(0, 8), c = R(1, 9); const x = a + b / 10 + c / 100; const yuk = c >= 5; const sonuc = od(yuk ? a + (b + 1) / 10 : a + b / 10);
      return S({ kaz: "yuv.kural", duzey: "aciklama", zorluk: 2, soru: `Sayı doğrusundaki ${od(x)} sayısı en yakın onda birliğe yuvarlanırsa hangi sayı elde edilir?`,
        gorsel: G.sayiDogrusu({ min: a + b / 10, max: a + (b + 1) / 10, adim: 0.1, araAdim: 0.01, etiket: v => od(v), noktalar: [{ v: x, ad: od(x) }] }), dogru: sonuc,
        yanlis: [[od(yuk ? a + b / 10 : a + (b + 1) / 10), "kavrama", `Yüzde birler basamağı ${c}; ${yuk ? "5 veya büyük olduğu için yukarı" : "5'ten küçük olduğu için aşağı"} yuvarlanır.`], [od(Math.round(x)), "dikkat", "Bu en yakın tam sayıya yuvarlamadır."], [od(x), "kavrama", "Yuvarlama yapılmamış."]],
        ipucu: "Nokta hangi uca daha yakın?", cozum: [`${od(x)} sayısı ${od(a + b / 10)} ile ${od(a + (b + 1) / 10)} arasında.`, `Yüzde birler basamağı ${c}: ${yuk ? "5 veya daha büyük → yukarı" : "5'ten küçük → aşağı"} yuvarla.`, `Sonuç: ${sonuc}.`] }); },
  );
  ekle("kb.iliski",
    z => { const q = sec([2, 4, 5, 8, 10]), p = R(1, q - 1);
      return S({ kaz: "kb.iliski", duzey: "aciklama", zorluk: 1, soru: "Şekildeki şeridin boyalı kısmı hangi bölme işleminin sonucunu gösterir?", gorsel: G.kesirSeridi(p, q), dogru: `${p} ÷ ${q}`,
        yanlis: [[`${q} ÷ ${p}`, "kavrama", "Boyalı parça sayısı bölünen, toplam parça sayısı bölendir."], [`${q - p} ÷ ${q}`, "dikkat", "Bu boyasız kısımdır."], [`${p} × ${q}`, "bilgi", "Kesir bir bölmedir, çarpma değil."]],
        ipucu: "Boyalı parça / toplam parça yaz; kesir çizgisi bölmedir.", cozum: [`Şerit ${q} eş parçaya bölünmüş, ${p} parçası boyalı: ${p}/${q}.`, `Kesir çizgisi bölme demektir: ${p}/${q} = ${p} ÷ ${q}.`, `Ondalık gösterimi: ${od(p / q)}.`] }); },
  );
  ekle("pr.para",
    z => { const urun = karistir([["Defter", R(3, 6) * 5 + 0.5], ["Kalem", R(4, 12) + 0.25], ["Silgi", R(2, 6) + 0.75], ["Cetvel", R(5, 12) + 0.5], ["Boya", R(20, 40) + 0.9]]).slice(0, 3);
      const top = Math.round(urun.reduce((a, u) => a + u[1], 0) * 100) / 100; const verilen = top < 50 ? 50 : 100; const ustu = Math.round((verilen - top) * 100) / 100;
      return S({ kaz: "pr.para", duzey: "transfer", zorluk: 2, soru: `Kırtasiye fişi aşağıdadır. Kasaya ${verilen} TL veren Zeynep kaç TL para üstü alır?`,
        gorsel: G.tablo(["Ürün", "Fiyat"], urun.map(u => [u[0], od(u[1]) + " TL"]).concat([["<b>Toplam</b>", "?"]])), dogru: od(ustu) + " TL",
        yanlis: [[od(top) + " TL", "dikkat", "Bu toplam tutardır; para üstü için verilen paradan çıkar."], [od(Math.round((verilen - top + 1) * 100) / 100) + " TL", "islem", "Çıkarmada virgülleri alt alta getirmeyi unutma."], [od(Math.round((verilen - top - 0.1) * 100) / 100) + " TL", "islem", "Toplamayı yeniden kontrol et."]],
        ipucu: "Önce toplamı bul, sonra verilen paradan çıkar.", cozum: [`Toplam: ${urun.map(u => od(u[1])).join(" + ")} = ${od(top)} TL (virgüller alt alta).`, `Para üstü: ${verilen} − ${od(top)} = ${od(ustu)} TL.`] }); },
  );
  ekle("uz.donustur",
    z => { const mm = R(23, 89);
      return S({ kaz: "uz.donustur", duzey: "uygulama", zorluk: 1, soru: "Sarı çubuğun uzunluğu cetvelle ölçülüyor. Çubuk kaç santimetredir?", gorsel: G.cetvel(mm), dogru: od(mm / 10) + " cm",
        yanlis: [[mm + " cm", "kavrama", "Küçük çentikler milimetredir; 10 mm = 1 cm."], [Math.floor(mm / 10) + " cm", "dikkat", "Milimetre kısmını da ekle."], [od(mm / 100) + " cm", "islem", "1 cm = 10 mm; 100'e değil 10'a böl."]],
        ipucu: "Büyük çentikler cm, küçük çentikler mm.", cozum: [`Çubuk ${Math.floor(mm / 10)} tam santimetreyi geçiyor.`, `Sonra ${mm % 10} küçük çentik (mm) daha var.`, `${Math.floor(mm / 10)} cm ${mm % 10} mm = ${od(mm / 10)} cm.`] }); },
  );
  /* ---------------- Tema 4 ---------------- */
  ekle("me.ortalama",
    z => { const gun = ["Pzt", "Salı", "Çrş", "Prş", "Cuma"]; let v; do { v = gun.map(() => R(5, 30)); } while (v.reduce((a, b) => a + b, 0) % 5); const t = v.reduce((a, b) => a + b, 0);
      return S({ kaz: "me.ortalama", duzey: "uygulama", zorluk: 2, soru: "Grafikte Elif'in bir hafta boyunca her gün okuduğu sayfa sayısı verilmiştir. Elif günde ortalama kaç sayfa okumuştur?",
        gorsel: G.sutun(gun.map((g, i) => [g, v[i]]), { baslik: "Okunan sayfa sayısı", birim: "sayfa" }), dogru: t / 5,
        yanlis: [[t, "bilgi", "Bu toplamdır; gün sayısına (5) bölmelisin."], [[...v].sort((a, b) => a - b)[2], "kavrama", "Bu ortancadır; ortalama toplam ÷ gün sayısıdır."], [Math.max(...v) - Math.min(...v), "kavrama", "Bu açıklıktır."]],
        ipucu: "Beş sütunun değerini topla ve 5'e böl.", cozum: [`Değerler: ${v.join(", ")}.`, `Toplam: ${v.join(" + ")} = ${t}.`, `Ortalama: ${t} ÷ 5 = ${t / 5} sayfa.`] }); },
  );
  ekle("me.ortanca",
    z => { const ad = karistir(["Ali", "Ece", "Can", "Naz", "Efe", "Su", "Arda"]).slice(0, 5); const v = ad.map(() => R(120, 160)); const s = [...v].sort((a, b) => a - b);
      return S({ kaz: "me.ortanca", duzey: "uygulama", zorluk: 2, soru: "Tabloda beş öğrencinin boy uzunlukları verilmiştir. Bu verinin ortancası kaç cm'dir?",
        gorsel: G.tablo(["Öğrenci", ...ad], [["Boy (cm)", ...v]]), dogru: s[2],
        yanlis: [[v[2], "dikkat", "Tablodaki sırayla ortadakini aldın; önce küçükten büyüğe sırala."], [Math.round(v.reduce((a, b) => a + b, 0) / 5), "kavrama", "Bu ortalamaya yakın bir değer; ortanca sıralı verinin ortasıdır."], [s[4] - s[0], "kavrama", "Bu açıklıktır."]],
        ipucu: "Boyları küçükten büyüğe sırala, ortadakini bul.", cozum: [`Sıralı: ${s.join(", ")}.`, "5 veri var; ortadaki 3. değerdir.", `Ortanca: ${s[2]} cm.`] }); },
  );
  ekle("ar.veri",
    z => { const v = sec([["Okula ulaşım şekli", ["Yürüyerek", "Servis", "Otobüs", "Araba"], "kategorik", "Sütun grafiği"], ["Kardeş sayısı", ["0", "1", "2", "3"], "nicel", "Sütun grafiği"]]); const d = v[1].map(() => R(2, 10));
      return S({ kaz: "ar.veri", duzey: "aciklama", zorluk: 2, soru: `Bir sınıfta “${v[0]}” sorusunun cevapları grafikte gösterilmiştir. Toplanan veri hangi türdendir?`,
        gorsel: G.sutun(v[1].map((a, i) => [a, d[i]]), { baslik: v[0], birim: "kişi" }), dogru: v[2] === "nicel" ? "Nicel veri" : "Kategorik veri",
        yanlis: [[v[2] === "nicel" ? "Kategorik veri" : "Nicel veri", "kavrama", v[2] === "nicel" ? "Cevaplar sayıdır (kaç kardeş); veri nicel." : "Cevaplar birer ad/gruptur; grafikte sayı olması verinin türünü değiştirmez."], ["Grafikte sayı olduğu için her zaman nicel veri", "kavrama", "Grafikteki sayılar kişi sayısıdır; verinin türü cevaplara bakılarak belirlenir."], ["Veri türü belirlenemez", "bilgi", "Cevaplara bakarak tür belirlenir."]],
        ipucu: "Grafiğin altındaki cevaplara bak: sayı mı, ad mı?", cozum: ["Veri türü, kişilerin verdiği cevaplara göre belirlenir.", `Cevaplar: ${v[1].join(", ")} → ${v[2] === "nicel" ? "sayı" : "ad/grup"}.`, `Bu yüzden veri ${v[2]}dir.`] }); },
  );

  /* ---------------- Kazanım başına “Unutma” kuralları ---------------- */
  const KURAL = {
    "carpan.bul": "Bir sayıyı kalansız bölen sayılar onun çarpanıdır. 1 ve sayının kendisi her zaman çarpandır.",
    "carpan.say": "Çarpanları çiftler hâlinde yaz (1 × n, 2 × …). Kare sayılarda ortadaki çarpan bir kez sayılır.",
    "carpan.model": "Birim karelerle kurulan her dikdörtgenin kenarları bir çarpan çiftidir: satır × sütun = sayı.",
    "kat.bul": "Bir sayının katları, o sayının 1, 2, 3, … ile çarpılmasıyla bulunur ve sonsuza kadar gider.",
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
    "ol.kavram": "İmkânsız olay: 0 · kesin olay: 1 · eşit olasılıklı: 1/2. Deneme sayısı arttıkça tahmin güvenilir olur.",
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
