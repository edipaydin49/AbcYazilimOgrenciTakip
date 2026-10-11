/* 6. sınıf Fen Bilimleri — ek sorular (1–4. üniteler: Güneş Sistemi, Tutulmalar, Bileşke Kuvvet,
 * Sabit Süratli ve Sabit Hızlı Hareket, Üreme-Büyüme-Gelişme, Denetleyici Sistemler, Işığın Yansıması, Işığın Soğurulması).
 * Her çözüm adım adım: 🔎 Soruyu anlayalım → 💡 Hatırlayalım → ✏️ adımlar → ✅ Sonuç → 🔁 Kontrol.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, Q, G } = OGR;

  /* ============================ YARDIMCI GÖRSELLER ============================ */

  /* Yol–zaman grafiği. seriler: [{ad, noktalar:[[t, x], ...], sinif}] */
  function yolZaman(seriler, { tmax, ymax, tadim, yadim, tbirim = "s", ybirim = "m" }) {
    const W = 560, H = 270, sol = 56, alt = 40, ust = 24, sag = 30;
    const xk = t => sol + (W - sol - sag) * t / tmax, yk = v => ust + (H - ust - alt) * (1 - v / ymax);
    let ic = "";
    for (let v = 0; v <= ymax + 1e-9; v += yadim) ic += `<line class="g-ince" x1="${sol}" x2="${W - sag}" y1="${yk(v)}" y2="${yk(v)}"/>` + G.yazi(sol - 6, yk(v) + 4, v, { a: "end", k: 1 });
    for (let t = 0; t <= tmax + 1e-9; t += tadim) ic += `<line class="g-ince" x1="${xk(t)}" x2="${xk(t)}" y1="${ust}" y2="${yk(0)}"/>` + G.yazi(xk(t), yk(0) + 18, t, { k: 1 });
    ic += `<line class="g-cizgi" x1="${sol}" y1="${yk(0)}" x2="${W - sag + 6}" y2="${yk(0)}" stroke-width="2"/><line class="g-cizgi" x1="${sol}" y1="${yk(0)}" x2="${sol}" y2="${ust - 8}" stroke-width="2"/>`;
    ic += G.yazi(W - sag, yk(0) + 34, "Zaman (" + tbirim + ")", { a: "end", k: 1 }) + G.yazi(sol + 6, ust - 10, "Yol (" + ybirim + ")", { a: "start", k: 1 });
    seriler.forEach(s => {
      const p = s.noktalar.map(([t, v]) => `${xk(t).toFixed(1)},${yk(v).toFixed(1)}`).join(" ");
      ic += `<polyline class="${s.sinif || "g-cizgi"}" points="${p}" fill="none" stroke-width="3"/>`;
      const [tl, vl] = s.noktalar[s.noktalar.length - 1];
      if (s.ad) ic += G.yazi(xk(tl) - 4, yk(vl) - 8, s.ad, { b: 1, a: "end" });
    });
    return G.svg(W, H, ic, "yol–zaman grafiği");
  }

  /* Dünya'nın çevresinde Ay'ın dört olası konumu (soldan Güneş ışığı gelir). etiketler: [sol, üst, sağ, alt] */
  function ayKonum(etiketler) {
    let ic = `<circle class="g-b g-cizgi" cx="30" cy="120" r="56"/>` + G.yazi(40, 200, "Güneş", { k: 1 });
    ic += `<circle class="g-ince" cx="360" cy="120" r="90" fill="none" stroke-dasharray="6 6"/>`;
    ic += `<circle class="g-a g-cizgi" cx="360" cy="120" r="26"/>` + G.yazi(360, 125, "Dünya", { k: 1 });
    [[270, 120], [360, 30], [450, 120], [360, 210]].forEach(([x, y], i) => { ic += `<circle class="g-yumusak g-cizgi" cx="${x}" cy="${y}" r="11"/>` + G.yazi(x + (i === 2 ? 26 : i === 0 ? -24 : 26), y + 5, etiketler[i], { b: 1 }); });
    for (let i = 0; i < 3; i++) ic += G.ok(100, 70 + i * 50, 150, 70 + i * 50, "g-ok-a");
    return G.svg(520, 235, ic, "Ay'ın Dünya çevresindeki dört konumu");
  }

  /* Hız okları: [{ad, uzunluk (birim), yon: 1 sağ / -1 sol}] — her birim 40 piksel */
  function hizOklari(oklar) {
    const W = 560, H = 60 + oklar.length * 52; let ic = "";
    oklar.forEach((o, i) => {
      const y = 44 + i * 52, bas = 280 - (o.yon > 0 ? o.uzunluk * 20 : -o.uzunluk * 20), son = bas + o.yon * o.uzunluk * 40;
      ic += G.yazi(30, y + 5, o.ad, { b: 1 }) + G.ok(bas, y, son, y, o.yon > 0 ? "g-ok-a" : "g-ok-d");
    });
    for (let x = 80; x <= 480; x += 40) ic += `<line class="g-ince" x1="${x}" y1="20" x2="${x}" y2="${H - 14}"/>`;
    return G.svg(W, H, ic, "hareketlilerin hız okları");
  }

  /* Düz ayna, normal ve ışınlar: gelme açısı a (derece). Açılar etiketlenmez, yalnızca şema. */
  function aynaSema(etiket) {
    let ic = `<rect class="g-yumusak g-cizgi" x="60" y="170" width="440" height="14"/>`;
    for (let x = 70; x < 500; x += 16) ic += `<line class="g-ince" x1="${x}" y1="184" x2="${x - 8}" y2="196"/>`;
    ic += `<line class="g-ince" x1="280" y1="170" x2="280" y2="30" stroke-dasharray="6 5"/>` + G.yazi(292, 34, "normal", { a: "start", k: 1 });
    ic += G.ok(150, 50, 278, 168, "g-ok-a") + G.ok(282, 168, 410, 50, "g-ok-d");
    ic += G.yazi(120, 46, "gelen ışın", { k: 1 }) + G.yazi(440, 46, "yansıyan ışın", { k: 1 });
    if (etiket) ic += G.yazi(280, 222, etiket, { k: 1 });
    return G.svg(560, 232, ic, "düz aynada yansıma şeması");
  }

  const ROMA = ["I", "II", "III", "IV"];

  /* ============================ ÜNİTE 1: GÜNEŞ SİSTEMİ ============================ */

  SORU_EKLE("fgun.gunes",
    Q("fgun.gunes", "hatirlama", 2,
      "Bir öğrenci Güneş hakkında şu notları almıştır:<br>I. Gaz hâlindedir; en çok hidrojen ve helyum içerir.<br>II. Dünya'dan küçük olduğu için gökyüzünde küçük görünür.<br>III. Kendi ekseni etrafında döner.<br>IV. Yüzey sıcaklığı yaklaşık 5500 °C'dir.<br>Bu notlardan hangileri <b>doğrudur</b>?",
      "I, III ve IV",
      [["I ve II", "bilgi", "II. not yanlış: Güneş, Dünya'dan çok büyüktür. Küçük görünmesinin nedeni bize çok uzak olmasıdır."],
       ["Yalnız IV", "bilgi", "Güneş'in gazlardan oluştuğu ve kendi ekseni etrafında döndüğü de doğrudur; yalnızca sıcaklık bilgisini seçmek eksik kalır."],
       ["II, III ve IV", "kavrama", "Uzaktaki cisimler küçük görünür. Güneş'in küçük görünmesi gerçekten küçük olduğunu göstermez; II yanlıştır."]],
      "Her notu tek tek ele al. “Küçük görünmek” ile “küçük olmak” aynı şey mi?",
      ["🔎 Soruyu anlayalım: Dört not var. Doğru olanları seçeceğiz.",
       "💡 Hatırlayalım: Güneş bir yıldızdır. Gazlardan oluşur, küre şeklindedir, kendi ekseni etrafında döner ve çok sıcaktır.",
       "✏️ I. not: Güneş'te en çok hidrojen ve helyum gazı vardır. Doğru ✔",
       "✏️ II. not: Güneş, Dünya'dan yaklaşık 109 kat daha geniştir. Küçük görünmesi uzaklığından kaynaklanır. Yanlış ✘",
       "✏️ III. not doğru ✔ (Güneş de kendi ekseni etrafında döner). IV. not doğru ✔ (yüzeyi yaklaşık 5500 °C).",
       "✅ Sonuç: Doğru notlar I, III ve IV'tür.",
       "🔁 Kontrol edelim: Uzaktaki bir uçak da küçük görünür ama aslında çok büyüktür. Görünen boyut ile gerçek boyutu karıştırma!"],
      { kural: "Güneş: gaz yapılı, küre şeklinde, kendi ekseni etrafında dönen, çok büyük ve çok sıcak bir yıldızdır.", dogruNeden: "Güneş gazlardan oluşur, kendi ekseni etrafında döner ve yüzeyi yaklaşık 5500 °C'dir; ama Dünya'dan çok büyüktür." }),
    Q("fgun.gunes", "transfer", 3,
      "Güneş'in çapı, Dünya'nın çapının yaklaşık <b>109 katıdır</b>. Sınıfta bir model hazırlayan Defne, Dünya'yı <b>1 cm</b> çaplı bir boncukla gösteriyor. Aynı ölçekte Güneş'i göstermek için hangisini seçmelidir?",
      "Çapı yaklaşık 1 metre olan büyük bir top",
      [["Çapı yaklaşık 2 cm olan bir bilye", "kavrama", "Güneş, Dünya'nın yalnızca iki katı değildir; çapı yaklaşık 109 katıdır. Bilye çok küçük kalır."],
       ["Çapı yaklaşık 10 cm olan bir portakal", "islem", "10 cm, 1 cm'nin yalnızca 10 katıdır. 109 kat için yaklaşık 109 cm gerekir."],
       ["Çapı yaklaşık 100 metre olan bir daire", "islem", "109 cm'yi 109 m ile karıştırmışsın. 109 cm yaklaşık 1 metredir."]],
      "1 cm'yi 109 ile çarp, sonucu metreye çevir.",
      ["🔎 Soruyu anlayalım: Dünya modeli 1 cm. Güneş modelinin çapını bulacağız.",
       "💡 Hatırlayalım: Ölçekli modelde her şey aynı oranda küçültülür. Güneş'in çapı Dünya'nınkinin yaklaşık 109 katıdır.",
       "✏️ Uygulayalım: 1 cm × 109 = 109 cm.",
       "✏️ 100 cm = 1 m olduğuna göre 109 cm yaklaşık 1 metredir.",
       "✅ Sonuç: Güneş modeli, çapı yaklaşık 1 metre olan büyük bir top olmalıdır.",
       "🔁 Kontrol edelim: Böyle bir topun yanında 1 cm'lik boncuk minicik kalır. Bu da Güneş'in Dünya'dan ne kadar büyük olduğunu gösterir."],
      { kural: "Güneş'in çapı Dünya'nınkinin yaklaşık 109 katıdır.", dogruNeden: "1 cm × 109 = 109 cm, yani yaklaşık 1 metre eder." }),
    Q("fgun.gunes", "aciklama", 1,
      "Güneş'in şekli aşağıdakilerden hangisine en çok benzer?",
      "Futbol topu gibi küre şeklindedir.",
      [["Tabak gibi düz bir daire şeklindedir.", "kavrama", "Güneş gökyüzünde daire gibi görünür ama her yönden bakınca yuvarlak görünen bir küredir; düz değildir."],
       ["Yumurta gibi uzunca bir şekildedir.", "bilgi", "Güneş'in şekli küreye çok yakındır; belirgin biçimde uzunca değildir."],
       ["Yıldız çizimlerindeki gibi beş köşelidir.", "kavrama", "Resimlerde yıldızlar köşeli çizilir ama gerçek yıldızlar, Güneş de dahil, küre şeklindedir."]],
      "Güneş'e hangi yönden bakılırsa bakılsın yuvarlak görünür.",
      ["🔎 Soruyu anlayalım: Güneş'in gerçek şeklini soruyor.",
       "💡 Hatırlayalım: Güneş, gazlardan oluşan çok büyük bir yıldızdır ve kendi kütle çekimi onu her yönden eşit sıkıştırır.",
       "✏️ Her yönden eşit sıkışan bir gaz kütlesi küre şeklini alır.",
       "✏️ Gökyüzünde daire gibi görmemiz, küreye uzaktan baktığımız içindir.",
       "✅ Sonuç: Güneş, futbol topu gibi küre şeklindedir.",
       "🔁 Kontrol edelim: Bir topa hangi yandan bakarsan bak daire görürsün. Güneş için de durum aynıdır."],
      { kural: "Güneş küre şeklindedir; uzaktan daire gibi görünür.", dogruNeden: "Güneş her yönden yuvarlak görünen bir gaz küresidir." }),
  );

  /* Gezegenlerin dolanma süreleri (yaklaşık) */
  const DOLANMA = [["Merkür", "88 gün", 0], ["Venüs", "225 gün", 1], ["Dünya", "365 gün", 2], ["Mars", "687 gün", 3], ["Jüpiter", "12 yıl", 4], ["Satürn", "29 yıl", 5], ["Uranüs", "84 yıl", 6], ["Neptün", "165 yıl", 7]];
  const GEZ = ["Merkür", "Venüs", "Dünya", "Mars", "Jüpiter", "Satürn", "Uranüs", "Neptün"];

  SORU_EKLE("fgun.gezegen",
    z => {
      const bas = R(0, 4), dort = DOLANMA.slice(bas, bas + 4), harf = ["K", "L", "M", "N"], dag = karistir(dort);
      const enYakin = sec([true, false]), hedef = enYakin ? dort[0] : dort[3];
      const dogru = harf[dag.indexOf(hedef)];
      const yanlis = harf.filter(h => h !== dogru).map(h => { const g = dag[harf.indexOf(h)]; return [h, g === (enYakin ? dort[3] : dort[0]) ? "kavrama" : "dikkat", `${h} gezegeninin dolanma süresi ${g[1]}. ${enYakin ? "Güneş'e en yakın gezegenin turu en kısa sürer" : "Güneş'e en uzak gezegenin turu en uzun sürer"}; bu değer ${g === (enYakin ? dort[3] : dort[0]) ? "tam tersi durumu gösterir" : "en " + (enYakin ? "kısa" : "uzun") + " değil"}.`]; });
      return S({
        kaz: "fgun.gezegen", duzey: "transfer", zorluk: 2,
        soru: `Tabloda dört gezegenin Güneş çevresindeki bir turunu yaklaşık ne kadar sürede tamamladığı verilmiştir (1 yıl = 365 gün). Bu gezegenlerden hangisi Güneş'e <b>en ${enYakin ? "yakın" : "uzak"}</b>tır?`,
        gorsel: G.tablo(["Gezegen", "Bir turun süresi"], dag.map((g, i) => [harf[i], g[1]])),
        dogru, yanlis,
        ipucu: "Güneş'e yaklaştıkça yörünge kısalır. Süreleri aynı birime çevirip karşılaştır.",
        cozum: ["🔎 Soruyu anlayalım: Dolanma sürelerine bakarak Güneş'e en " + (enYakin ? "yakın" : "uzak") + " gezegeni bulacağız.",
          "💡 Hatırlayalım: Güneş'e yakın gezegenlerin yörüngesi kısadır, turlarını kısa sürede tamamlarlar. Uzaktakilerin turu çok uzun sürer.",
          "✏️ Önce birimlere dikkat: “yıl” yazan süreler, “gün” yazanlardan büyüktür (1 yıl = 365 gün).",
          `✏️ Süreleri küçükten büyüğe sıralayalım: ${dort.map(g => g[1]).join(" < ")}.`,
          `✅ Sonuç: En ${enYakin ? "kısa" : "uzun"} süre ${hedef[1]}; bu da ${dogru} gezegenidir (${hedef[0]}).`,
          "🔁 Kontrol edelim: Dünya'nın turu 365 gün sürer. Ondan kısa süren gezegenler Güneş'e daha yakın, uzun sürenler daha uzaktır."],
        kural: "Gezegen Güneş'ten uzaklaştıkça bir turunu tamamlama süresi uzar.",
        dogruNeden: `${dogru} gezegeninin turu en ${enYakin ? "kısa" : "uzun"} sürer; bu, Güneş'e en ${enYakin ? "yakın" : "uzak"} olduğunu gösterir.`,
      });
    },
    z => {
      let i = R(0, 5), j = R(i + 2, 7); if (j > 7) j = 7;
      const n = j - i - 1, ara = GEZ.slice(i + 1, j);
      return S({
        kaz: "fgun.gezegen", duzey: "uygulama", zorluk: 2,
        soru: `Gezegenler Güneş'e olan uzaklıklarına göre sıralandığında <b>${GEZ[i]}</b> ile <b>${GEZ[j]}</b> arasında kaç gezegen bulunur?`,
        dogru: String(n),
        yanlis: [[String(n + 1), "dikkat", "Sayarken uçlardaki gezegenlerden birini de saymışsın. Yalnızca aradakiler sayılır."], [String(n + 2), "dikkat", "İki uçtaki gezegeni de saymışsın; soru yalnızca aradakileri istiyor."], [String(Math.max(0, n - 1)) === String(n) ? String(n + 3) : String(Math.max(0, n - 1)), "bilgi", "Gezegen sırasını eksik hatırlıyorsun. Sırayı Merkür'den Neptün'e kadar tek tek yaz."]],
        ipucu: "Sırayı yaz: Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs, Neptün.",
        cozum: ["🔎 Soruyu anlayalım: İki gezegen arasında kalan gezegenleri sayacağız; uçtakiler sayılmaz.",
          "💡 Hatırlayalım: Güneş'e en yakından en uzağa: Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs, Neptün.",
          `✏️ ${GEZ[i]} ${i + 1}. sırada, ${GEZ[j]} ${j + 1}. sıradadır.`,
          `✏️ Aradakiler: ${ara.join(", ")}.`,
          `✅ Sonuç: Arada ${n} gezegen vardır.`,
          `🔁 Kontrol edelim: Sıra numaralarından da bulabiliriz: ${j + 1} − ${i + 1} − 1 = ${n}.`],
        kural: "Gezegen sırası: Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs, Neptün.",
        dogruNeden: `${GEZ[i]} ile ${GEZ[j]} arasında ${ara.join(", ")} bulunur; bunlar ${n} gezegendir.`,
      });
    },
    Q("fgun.gezegen", "baglanti", 3,
      "Bir gezegenle ilgili şu ipuçları veriliyor:<br>• Asteroit kuşağının dışında yer alır.<br>• Gaz yapılıdır ve çevresinde halka bulunur.<br>• Çok sayıda uydusu vardır.<br>Bu gezegen aşağıdakilerden hangisi <b>olamaz</b>?",
      "Mars",
      [["Satürn", "bilgi", "Satürn asteroit kuşağının dışındadır, gaz yapılıdır, belirgin halkaları ve çok sayıda uydusu vardır; ipuçlarına uyar."],
       ["Jüpiter", "bilgi", "Jüpiter de asteroit kuşağının dışındaki gaz yapılı bir dış gezegendir; ince halkaları ve çok sayıda uydusu vardır."],
       ["Uranüs", "bilgi", "Uranüs bir dış gezegendir; gaz yapılıdır, halkası ve çok sayıda uydusu vardır; ipuçlarına uyar."]],
      "Asteroit kuşağı Mars ile Jüpiter arasındadır. Mars kuşağın hangi tarafında kalır?",
      ["🔎 Soruyu anlayalım: İpuçlarına UYMAYAN gezegeni bulacağız.",
       "💡 Hatırlayalım: Asteroit kuşağı Mars ile Jüpiter arasındadır. Kuşağın içinde kalan iç gezegenler (Merkür, Venüs, Dünya, Mars) kayalıktır; dışındaki dış gezegenler (Jüpiter, Satürn, Uranüs, Neptün) gaz yapılıdır.",
       "✏️ Jüpiter, Satürn ve Uranüs kuşağın dışındadır, gaz yapılıdır ve halkaları vardır.",
       "✏️ Mars ise kuşağın iç tarafındadır, kayalık yapılıdır ve halkası yoktur; yalnızca iki küçük uydusu vardır.",
       "✅ Sonuç: İpuçlarına uymayan gezegen Mars'tır.",
       "🔁 Kontrol edelim: Dört dış gezegenin hepsinde halka vardır. Halkası en belirgin olan Satürn'dür ama tek halkalı gezegen o değildir."],
      { kural: "Asteroit kuşağı Mars ile Jüpiter arasındadır; dış gezegenler gaz yapılı ve halkalıdır.", dogruNeden: "Mars, asteroit kuşağının iç tarafında kalan kayalık bir gezegendir ve halkası yoktur." }),
  );

  SORU_EKLE("fgun.diger",
    Q("fgun.diger", "transfer", 2,
      "Halley kuyruklu yıldızı Güneş çevresindeki bir turunu yaklaşık <b>76 yılda</b> tamamlar ve en son <b>1986</b> yılında Dünya'dan çıplak gözle görülmüştür. Halley'in bir sonraki görünüşü yaklaşık hangi yıllarda beklenir?",
      "2060'lı yıllarda",
      [["2000'li yıllarda", "islem", "1986'ya 76 eklemek gerekir; 2000'li yıllar yalnızca 14–15 yıl sonrasıdır."],
       ["2020'li yıllarda", "islem", "76 yıl yerine yaklaşık 38 yıl (yarısı) eklemişsin. Bir tam tur 76 yıldır."],
       ["2100'lü yıllarda", "islem", "1986 + 76 hesabında fazla eklemişsin; sonuç 2100'ü geçmez."]],
      "Son görülme yılına bir turun süresini ekle.",
      ["🔎 Soruyu anlayalım: Son görülme yılı ve bir turun süresi verilmiş. Bir sonraki yılı bulacağız.",
       "💡 Hatırlayalım: Kuyruklu yıldızlar Güneş'in çevresinde uzun, basık yörüngelerde dolanır; Güneş'e yaklaştıklarında parlar ve görünür olurlar.",
       "✏️ Uygulayalım: 1986 + 76 = 2062.",
       "✏️ Süre “yaklaşık” verildiği için sonucu da yaklaşık söyleriz: 2060'lı yıllar.",
       "✅ Sonuç: Halley'in yeniden 2060'lı yıllarda görülmesi beklenir.",
       "🔁 Kontrol edelim: 2062 − 76 = 1986. Ters işlem de tutuyor. Belki sen de o yıllarda Halley'i görebilirsin!"],
      { kural: "Kuyruklu yıldızlar belirli aralıklarla Güneş'e yaklaşır ve o zaman görünür olur.", dogruNeden: "1986 + 76 = 2062 olduğu için Halley yaklaşık 2060'lı yıllarda görülür." }),
    Q("fgun.diger", "aciklama", 2,
      "Ay, Dünya'nın <b>doğal</b> uydusudur. Türksat ise insanlar tarafından uzaya gönderilmiş <b>yapay</b> bir uydudur. Bu iki gök cisminin <b>ortak</b> özelliği hangisidir?",
      "İkisi de Dünya'nın çevresinde dolanır.",
      [["İkisi de kendi ışığını üretir.", "bilgi", "Ne Ay ne de yapay uydular ışık üretir. Ay, Güneş'ten aldığı ışığı yansıtır."],
       ["İkisi de insanlar tarafından yapılmıştır.", "kavrama", "Ay doğal bir uydudur; onu insanlar yapmamıştır. Yalnızca Türksat yapaydır."],
       ["İkisi de Güneş'in çevresinde Dünya'dan bağımsız dolanır.", "kavrama", "Uydular bir gezegenin çevresinde dolanır. Dünya ile birlikte Güneş'in çevresinde dolanırlar ama Dünya'dan bağımsız değildirler."]],
      "“Uydu” sözcüğünün anlamını düşün.",
      ["🔎 Soruyu anlayalım: Doğal bir uydu ile yapay bir uydunun ortak noktasını arıyoruz.",
       "💡 Hatırlayalım: Uydu, bir gezegenin çevresinde dolanan gök cismidir.",
       "✏️ Ay doğaldır, kayalıktır, ışık üretmez ve Dünya'nın çevresinde dolanır.",
       "✏️ Türksat yapaydır, insanlar yapmıştır ve o da Dünya'nın çevresinde dolanır.",
       "✅ Sonuç: Ortak özellikleri Dünya'nın çevresinde dolanmalarıdır.",
       "🔁 Kontrol edelim: “Uydu” adı ikisine de bu yüzden verilir; birinin doğal, diğerinin yapay olması bunu değiştirmez."],
      { kural: "Uydu: bir gezegenin çevresinde dolanan gök cismi. Doğal (Ay) ya da yapay (Türksat) olabilir.", dogruNeden: "Hem Ay hem de Türksat Dünya'nın çevresinde dolanır; bu yüzden ikisi de uydudur." }),
    Q("fgun.diger", "hatirlama", 1,
      "Bir bilgi kartında şu tanım yazıyor:<br><i>“Güneş'in çevresinde dolanan; gezegenlerden çok daha küçük, düzensiz şekilli kaya ve metal parçaları. Çoğu Mars ile Jüpiter arasındaki bir kuşakta bulunur.”</i><br>Bu kart hangi gök cismini anlatmaktadır?",
      "Asteroit",
      [["Uydu", "bilgi", "Uydular gezegenlerin çevresinde dolanır; tanımdaki cisimler ise doğrudan Güneş'in çevresinde dolanıyor."],
       ["Kuyruklu yıldız", "bilgi", "Kuyruklu yıldızlar buz, toz ve gazdan oluşur ve Güneş'e yaklaşınca kuyruk oluşturur; tanımda kuyruktan söz edilmiyor."],
       ["Yıldız", "kavrama", "Yıldızlar Güneş gibi kendi ışığını üreten dev gaz küreleridir; küçük kaya parçaları değildir."]],
      "“Mars ile Jüpiter arasındaki kuşak” ifadesine dikkat et.",
      ["🔎 Soruyu anlayalım: Tanımı okuyup hangi gök cismi olduğunu bulacağız.",
       "💡 Hatırlayalım: Asteroitler kaya ve metalden oluşan, düzensiz şekilli küçük gök cisimleridir; çoğu asteroit kuşağındadır.",
       "✏️ Tanımda “kaya ve metal”, “düzensiz şekil” ve “Mars–Jüpiter arası kuşak” ipuçları var.",
       "✏️ Bu ipuçlarının hepsi asteroitleri anlatır.",
       "✅ Sonuç: Kart asteroiti anlatmaktadır.",
       "🔁 Kontrol edelim: Uydu bir gezegene, kuyruklu yıldız kuyruğuna, yıldız kendi ışığına göre tanınır. Bu kartta bunların hiçbiri yok."],
      { kural: "Asteroit: Güneş çevresinde dolanan, küçük, düzensiz şekilli kaya ve metal parçası.", dogruNeden: "Kaya ve metalden oluşan, düzensiz şekilli ve çoğu Mars ile Jüpiter arasında bulunan gök cisimleri asteroittir." }),
  );

  /* ============================ ÜNİTE 1: TUTULMALAR ============================ */

  SORU_EKLE("ftut.gunes",
    z => {
      const et = karistir(["1", "2", "3", "4"]), dogru = et[0];
      const ad = ["Güneş ile Dünya arasındaki konum", "Dünya'nın üst tarafındaki konum", "Dünya'nın Güneş'e göre arka tarafı", "Dünya'nın alt tarafındaki konum"];
      return S({
        kaz: "ftut.gunes", duzey: "uygulama", zorluk: 2,
        soru: "Şekilde Ay'ın Dünya çevresindeki dört konumu numaralarla gösterilmiştir. Ay hangi konumdayken <b>Güneş tutulması</b> gerçekleşebilir?",
        gorsel: ayKonum(et),
        dogru: dogru + " numaralı konum",
        yanlis: [[et[2] + " numaralı konum", "kavrama", "Bu konumda Ay, Dünya'nın arkasındadır; Dünya'nın gölgesine girerse Ay tutulması olur, Güneş tutulması değil."],
          [et[1] + " numaralı konum", "kavrama", "Bu konumda Güneş, Dünya ve Ay aynı doğru üzerinde değildir; Ay'ın gölgesi Dünya'ya düşmez."],
          [et[3] + " numaralı konum", "kavrama", "Bu konumda üç gök cismi aynı doğru üzerinde değildir; tutulma olmaz."]],
        ipucu: "Güneş tutulmasında Ay, Güneş'in ışığını Dünya'ya ulaşmadan keser.",
        cozum: ["🔎 Soruyu anlayalım: Ay'ın hangi konumda Güneş'i örtebileceğini bulacağız.",
          "💡 Hatırlayalım: Güneş tutulmasında dizilim Güneş – Ay – Dünya'dır. Ay'ın gölgesi Dünya'ya düşer.",
          `✏️ Şekilde ${dogru} numaralı konum, Güneş ile Dünya'nın tam arasındadır.`,
          `✏️ ${et[2]} numaralı konum Dünya'nın arkasında kalır; ${et[1]} ve ${et[3]} ise doğrunun dışındadır.`,
          `✅ Sonuç: Güneş tutulması Ay ${dogru} numaralı konumdayken gerçekleşebilir. Bu konumda Ay yeni ay evresindedir.`,
          "🔁 Kontrol edelim: Ay Dünya'nın arkasına geçseydi (Güneş – Dünya – Ay) bu kez Ay tutulması olurdu."],
        kural: "Güneş tutulması: Güneş – Ay – Dünya dizilimi, yeni ay evresi.",
        dogruNeden: "Bu konumda Ay, Güneş ile Dünya'nın arasındadır ve gölgesi Dünya'ya düşebilir.",
      });
    },
    Q("ftut.gunes", "aciklama", 2,
      "Tam Güneş tutulmasını izleyen bir gözlemci aşağıdakilerden hangisini <b>gözlemlemez</b>?",
      "Ay'ın bakır kırmızısı renkte görünmesi",
      [["Gündüz olduğu hâlde ortalığın kararması", "kavrama", "Tam Güneş tutulmasında Ay, Güneş'i tamamen örttüğü için gündüz ortalık kararır; bu gözlenir."],
       ["Hava sıcaklığının bir miktar düşmesi", "kavrama", "Güneş ışığı kesildiği için sıcaklık birkaç derece düşebilir; bu gözlenir."],
       ["Bazı parlak gezegen ve yıldızların görünür hâle gelmesi", "kavrama", "Gökyüzü karardığı için parlak gök cisimleri görülebilir; bu da gözlenir."]],
      "Hangi seçenek aslında öbür tutulmaya ait?",
      ["🔎 Soruyu anlayalım: Tam Güneş tutulmasında GÖRÜLMEYEN olayı arıyoruz.",
       "💡 Hatırlayalım: Tam Güneş tutulmasında Ay, Güneş'in önüne geçer ve Güneş ışığını kısa bir süre tamamen keser.",
       "✏️ Işık kesilince gündüz kararır, hava biraz serinler, parlak gezegenler ve yıldızlar görünür. Bunların hepsi gözlenir.",
       "✏️ Ay'ın kırmızımsı görünmesi ise Ay tutulmasında, Ay Dünya'nın gölgesine girdiğinde olur.",
       "✅ Sonuç: Tam Güneş tutulmasında Ay'ın bakır kırmızısı görünmesi gözlenmez.",
       "🔁 Kontrol edelim: Güneş tutulmasında Ay'ın Dünya'ya bakan yüzü karanlıktır; zaten o sırada Ay yeni ay evresindedir."],
      { kural: "Güneş tutulmasında gündüz kararır; Ay'ın kızıl görünmesi Ay tutulmasına aittir.", dogruNeden: "Ay'ın kızıl görünmesi, Ay Dünya'nın gölgesine girdiğinde yani Ay tutulmasında olur." }),
    Q("ftut.gunes", "aciklama", 3,
      "Bir yerde tam Güneş tutulması en fazla birkaç dakika sürer. Bunun nedeni aşağıdakilerden hangisidir?",
      "Ay'ın tam gölgesi küçüktür ve Dünya üzerinde hızla yer değiştirir.",
      [["Güneş tutulması yalnızca gece olduğu için kısa sürer.", "bilgi", "Güneş tutulması gündüz olur; gece Güneş zaten görünmez."],
       ["Ay, Dünya'nın gölgesine çok kısa süre girer.", "kavrama", "Ay'ın Dünya'nın gölgesine girmesi Ay tutulmasıdır. Güneş tutulmasında gölge Ay'ındır ve Dünya'ya düşer."],
       ["Güneş, Ay'dan küçük olduğu için Ay onu hemen geçer.", "bilgi", "Güneş, Ay'dan çok büyüktür; yalnızca Dünya'ya çok uzak olduğu için Ay ile aynı büyüklükte görünür."]],
      "Tutulmayı oluşturan gölge kimin gölgesi ve ne kadar büyük?",
      ["🔎 Soruyu anlayalım: Tam Güneş tutulmasının bir yerde neden kısa sürdüğünü açıklayacağız.",
       "💡 Hatırlayalım: Güneş tutulmasında Ay'ın gölgesi Dünya'ya düşer. Tam tutulma, Ay'ın tam gölgesinin altında kalan yerlerden görülür.",
       "✏️ Ay, Dünya'dan çok küçüktür; bu yüzden tam gölgesi Dünya üzerinde yalnızca dar bir alanı kaplar.",
       "✏️ Ay yörüngesinde hareket ettiği ve Dünya döndüğü için bu küçük gölge, yeryüzünde hızla kayar.",
       "✅ Sonuç: Tam gölge bir yerin üzerinden kısa sürede geçtiği için tam tutulma birkaç dakika sürer.",
       "🔁 Kontrol edelim: Ay tutulmasında ise Ay, Dünya'nın çok büyük gölgesinden geçer; bu yüzden Ay tutulması saatlerce sürebilir."],
      { kural: "Ay'ın tam gölgesi küçük ve hızlıdır → tam Güneş tutulması bir yerde birkaç dakika sürer.", dogruNeden: "Ay'ın küçük tam gölgesi yeryüzünde hızla ilerlediği için bir yer kısa süre tam gölgede kalır." }),
  );

  SORU_EKLE("ftut.ay",
    Q("ftut.ay", "aciklama", 3,
      "Tam Ay tutulması sırasında Ay tamamen kaybolmaz; bakır kırmızısı bir renkte görünür. Bunun nedeni aşağıdakilerden hangisidir?",
      "Dünya'nın atmosferinden geçip yön değiştiren Güneş ışığının kırmızı tonlarının Ay'a ulaşması",
      [["Ay'ın tutulma sırasında kendi ışığını üretmeye başlaması", "bilgi", "Ay hiçbir zaman kendi ışığını üretmez; gördüğümüz ışık her zaman Güneş'ten gelir."],
       ["Güneş'in tutulma sırasında yalnızca kırmızı ışık yayması", "kavrama", "Güneş her zaman beyaz ışık yayar; tutulma Güneş'i değiştirmez."],
       ["Ay'ın tutulma sırasında Güneş'e çok yaklaşması", "kavrama", "Ay, tutulmada yörüngesinden çıkmaz; Güneş'e yaklaşmaz. Renk, ışığın Dünya'nın atmosferinden geçmesiyle ilgilidir."]],
      "Dünya'nın çevresini saran hava katmanı ışığa ne yapabilir?",
      ["🔎 Soruyu anlayalım: Ay, Dünya'nın gölgesine girdiği hâlde neden kızıl görünüyor?",
       "💡 Hatırlayalım: Ay ışık kaynağı değildir; Güneş'ten gelen ışığı yansıtır. Ay tutulmasında Dünya, Güneş ile Ay'ın arasına girer.",
       "✏️ Dünya'nın çevresinde atmosfer vardır. Güneş ışığının bir kısmı atmosferden geçerken yön değiştirir ve gölgenin içine doğru kırılır.",
       "✏️ Atmosferden geçen ışığın mavi tonları saçılır, en çok kırmızı tonları yol alır.",
       "✅ Sonuç: Ay'a ulaşan bu kırmızımsı ışık yüzünden Ay, tutulmada bakır kırmızısı görünür.",
       "🔁 Kontrol edelim: Gün batımında gökyüzünün kızıllaşması da ışığın atmosferden uzun yol almasıyla ilgilidir."],
      { kural: "Tam Ay tutulmasında Ay kaybolmaz; atmosferden geçen kırmızımsı ışık nedeniyle kızıl görünür.", dogruNeden: "Güneş ışığının kırmızı tonları Dünya'nın atmosferinden geçip gölgenin içindeki Ay'a ulaşır." }),
    Q("ftut.ay", "transfer", 3,
      "Bir Ay tutulması, Türkiye'de saatin <b>öğle 12.00</b> olduğu sırada gerçekleşiyor. Bu tutulmayı Türkiye'den izlemek mümkün müdür?",
      "Hayır; Türkiye o sırada gündüzdür ve dolunaydaki Ay ufkun altındadır.",
      [["Evet; Ay tutulması Dünya'nın her yerinden aynı anda görülür.", "kavrama", "Ay tutulması yalnızca Dünya'nın gece yaşanan, Ay'ı görebilen yarısından izlenebilir."],
       ["Evet; ama yalnızca tutulma gözlüğüyle izlenebilir.", "bilgi", "Ay tutulması çıplak gözle izlenebilir; sorun gözlük değil, Ay'ın o sırada ufkun altında olmasıdır."],
       ["Hayır; Ay tutulması yalnızca kutuplardan izlenebilir.", "bilgi", "Ay tutulması, gece yaşanan bütün bölgelerden izlenebilir; kutuplarla sınırlı değildir."]],
      "Ay tutulmasında Ay, Dünya'ya göre Güneş'in tam karşısındadır. Öğlen Güneş tepedeyse Ay nerededir?",
      ["🔎 Soruyu anlayalım: Öğle saatinde olan bir Ay tutulmasının Türkiye'den görülüp görülmeyeceğini soruyor.",
       "💡 Hatırlayalım: Ay tutulmasında dizilim Güneş – Dünya – Ay'dır; Ay dolunay evresindedir.",
       "✏️ Ay, Güneş'in tam karşı tarafında olduğu için Dünya'nın gece yaşanan yarısından görünür.",
       "✏️ Türkiye'de öğle 12.00 ise Türkiye Güneş'e bakan yani gündüz yaşayan yarıdadır; Ay ufkun altında kalır.",
       "✅ Sonuç: Bu tutulma Türkiye'den izlenemez; o sırada gece yaşanan ülkelerden izlenir.",
       "🔁 Kontrol edelim: Dolunay akşam doğar, sabah batar. Öğle saatinde dolunay gökyüzünde olmaz."],
      { kural: "Ay tutulması, Dünya'nın gece yaşanan yarısından izlenebilir.", dogruNeden: "Ay tutulmasında Ay, Güneş'in karşısındadır; öğlen Türkiye'den bakıldığında Ay ufkun altındadır." }),
    Q("ftut.ay", "baglanti", 2,
      "Bir takvimde şu bilgiler var:<br>• <b>14 Mart:</b> Dolunay — Ay tutulması gerçekleşti.<br>• <b>29 Mart:</b> Yeni ay.<br>Buna göre 29 Mart'ta hangi olay <b>gerçekleşebilir</b>?",
      "Güneş tutulması",
      [["Ay tutulması", "dikkat", "Ay tutulması yalnızca dolunayda olur. 29 Mart'ta Ay yeni ay evresindedir."],
       ["Hiçbir tutulma olamaz; bir ayda yalnızca bir tutulma olur.", "kavrama", "Böyle bir kural yoktur. Tutulmalar çoğu zaman yaklaşık iki hafta arayla çift olarak gerçekleşir."],
       ["Gece görülen bir Güneş tutulması", "bilgi", "Güneş tutulması yalnızca gündüz, Güneş'in görüldüğü yerlerden izlenebilir."]],
      "Yeni ay evresinde Ay, Güneş ile Dünya'nın neresindedir?",
      ["🔎 Soruyu anlayalım: Dolunaydaki Ay tutulmasından iki hafta sonra, yeni ayda hangi olayın olabileceğini bulacağız.",
       "💡 Hatırlayalım: Ay tutulması dolunayda (Güneş – Dünya – Ay), Güneş tutulması yeni ayda (Güneş – Ay – Dünya) olur.",
       "✏️ 14 Mart'ta Ay tutulması olduysa üç gök cismi neredeyse aynı doğrultudaydı.",
       "✏️ Yaklaşık iki hafta sonra Ay, Dünya'nın öbür yanına, Güneş ile Dünya'nın arasına gelir. Hizalanma hâlâ yeterliyse Ay'ın gölgesi Dünya'ya düşebilir.",
       "✅ Sonuç: 29 Mart'ta Güneş tutulması gerçekleşebilir.",
       "🔁 Kontrol edelim: Gerçekten de 2025 yılında 14 Mart'ta tam Ay tutulması, 29 Mart'ta ise parçalı Güneş tutulması yaşanmıştır."],
      { kural: "Dolunay → Ay tutulması olabilir; yeni ay → Güneş tutulması olabilir. Tutulmalar sık sık iki hafta arayla çift gelir.", dogruNeden: "Yeni ay evresinde Ay, Güneş ile Dünya'nın arasındadır; hizalanma uygunsa Güneş tutulması olur." }),
  );

  SORU_EKLE("ftut.model",
    Q("ftut.model", "uygulama", 2,
      "Elif bir el feneri (Güneş), bir futbol topu (Dünya) ve bir tenis topu (Ay) ile <b>Ay tutulmasını</b> modellemek istiyor. Tenis topunu nereye koymalıdır?",
      "Futbol topunun el fenerine göre arka tarafına, üçü aynı doğru üzerinde olacak şekilde",
      [["El feneri ile futbol topunun arasına, aynı doğru üzerinde", "kavrama", "Bu dizilim (Güneş – Ay – Dünya) Güneş tutulmasını modeller; tenis topunun gölgesi futbol topuna düşer."],
       ["Futbol topunun yanına, el fenerinin ışığı ikisine de eşit düşecek şekilde", "kavrama", "Yan yana duran toplar birbirine gölge düşürmez; tutulma için üçü aynı doğru üzerinde olmalıdır."],
       ["El fenerinin arkasına", "dikkat", "El fenerinin arkasında ışık yoktur; burada hiçbir tutulma modellenemez."]],
      "Ay tutulmasında kimin gölgesi kimin üzerine düşer?",
      ["🔎 Soruyu anlayalım: Modelde Ay tutulmasını oluşturacak dizilimi kuracağız.",
       "💡 Hatırlayalım: Ay tutulmasında Dünya, Güneş ile Ay'ın arasına girer ve Dünya'nın gölgesi Ay'ın üzerine düşer: Güneş – Dünya – Ay.",
       "✏️ Modelde el feneri Güneş'i, futbol topu Dünya'yı gösteriyor.",
       "✏️ Futbol topunun gölgesinin tenis topuna düşmesi için tenis topu, futbol topunun fenere göre arka tarafında ve aynı doğru üzerinde olmalıdır.",
       "✅ Sonuç: Tenis topu futbol topunun arkasına, üçü aynı doğru üzerinde olacak şekilde konmalıdır.",
       "🔁 Kontrol edelim: Tenis topunu fener ile futbol topunun arasına koysaydık Güneş tutulması modeli kurmuş olurduk."],
      { kural: "Ay tutulması modeli: ışık kaynağı – büyük top – küçük top; hepsi aynı doğru üzerinde.", dogruNeden: "Ay tutulmasında dizilim Güneş – Dünya – Ay'dır; böylece futbol topunun gölgesi tenis topuna düşer." }),
    Q("ftut.model", "transfer", 2,
      "Okulda Güneş tutulmasını <b>dolaylı</b> ve <b>güvenli</b> bir yolla izlemek isteyen öğrenciler aşağıdakilerden hangisini yapmalıdır?",
      "Bir kartona iğne deliği açıp Güneş'in görüntüsünü ikinci bir kartona düşürmek ve o görüntüye bakmak",
      [["Koyu renkli güneş gözlüğü takıp Güneş'e bakmak", "bilgi", "Güneş gözlükleri tutulma gözlüğü değildir; Güneş'in zararlı ışınlarını yeterince engellemez."],
       ["Dürbünle kısa bir süre Güneş'e bakmak", "bilgi", "Dürbün ışığı toplayıp güçlendirir; Güneş'e dürbünle bakmak gözde kalıcı hasara yol açabilir."],
       ["Üst üste konmuş renkli şeffaf dosyaların arkasından Güneş'e bakmak", "bilgi", "Renkli plastikler görünür ışığı azaltsa da zararlı ışınları durdurmaz; güvenli değildir."]],
      "“Dolaylı” izleme, Güneş'e hiç doğrudan bakmamak demektir.",
      ["🔎 Soruyu anlayalım: Güneş'e doğrudan bakmadan tutulmayı izlemenin güvenli yolunu arıyoruz.",
       "💡 Hatırlayalım: Güneş'e çıplak gözle, güneş gözlüğüyle ya da dürbünle bakmak gözlere kalıcı zarar verebilir.",
       "✏️ İğne deliği yönteminde ışık küçük bir delikten geçer ve ikinci kartonda Güneş'in küçük bir görüntüsü oluşur.",
       "✏️ Öğrenciler Güneş'e değil, kartondaki görüntüye baktıkları için gözleri korunur. Ay Güneş'i örttükçe görüntüde hilal biçimi görülür.",
       "✅ Sonuç: İğne deliği yöntemi dolaylı ve güvenli bir gözlem yoludur.",
       "🔁 Kontrol edelim: Doğrudan bakmak gerekirse yalnızca onaylı tutulma gözlüğü kullanılmalıdır. Bir dahaki sefere “Güneş'e bakıyor muyum?” diye kendine sor."],
      { kural: "Güneş tutulması: ya onaylı tutulma gözlüğü ya da iğne deliği gibi dolaylı yöntem.", dogruNeden: "İğne deliği yönteminde Güneş'e değil, kartondaki görüntüsüne bakılır; bu yüzden gözler korunur." }),
    Q("ftut.model", "baglanti", 2,
      "Tabloda K ve L olaylarının bazı özellikleri verilmiştir. K ve L hangi olaylardır?",
      "K: Ay tutulması, L: Güneş tutulması",
      [["K: Güneş tutulması, L: Ay tutulması", "kavrama", "Dolunayda olan, gece gözlenen ve geniş alandan görülen olay Ay tutulmasıdır; eşleştirme ters yapılmış."],
       ["K ve L: Ay tutulması", "dikkat", "L yeni ayda ve gündüz gözleniyor; Ay tutulması dolunayda ve gece olur."],
       ["K ve L: Güneş tutulması", "dikkat", "K dolunayda ve gece gözleniyor; Güneş tutulması yeni ayda ve gündüz olur."]],
      "Önce “Ay'ın evresi” satırına bak.",
      ["🔎 Soruyu anlayalım: Özelliklere bakarak hangi olayın hangi tutulma olduğunu bulacağız.",
       "💡 Hatırlayalım: Ay tutulması dolunayda, gece olur, geniş alandan görülür. Güneş tutulması yeni ayda, gündüz olur, dar alandan görülür.",
       "✏️ K: dolunay, gece, geniş alan, saatlerce sürebilir → Ay tutulması.",
       "✏️ L: yeni ay, gündüz, dar alan, tam evresi birkaç dakika → Güneş tutulması.",
       "✅ Sonuç: K Ay tutulması, L Güneş tutulmasıdır.",
       "🔁 Kontrol edelim: Ay tutulmasında gölge büyük Dünya'nındır, bu yüzden geniş alandan uzun süre izlenir. Mantık tutuyor."],
      { gorsel: G.tablo(["Özellik", "K", "L"], [["Ay'ın evresi", "Dolunay", "Yeni ay"], ["Gözlendiği zaman", "Gece", "Gündüz"], ["Görüldüğü alan", "Geniş", "Dar"], ["Süresi", "Saatlerce sürebilir", "Tam evresi birkaç dakika"]]),
        kural: "Ay tutulması: dolunay–gece–geniş alan. Güneş tutulması: yeni ay–gündüz–dar alan.", dogruNeden: "Dolunayda ve gece olan K Ay tutulması; yeni ayda ve gündüz olan L Güneş tutulmasıdır." }),
  );
})();
