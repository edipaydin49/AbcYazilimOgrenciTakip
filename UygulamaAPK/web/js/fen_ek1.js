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

  /* ============================ ÜNİTE 2: BİLEŞKE KUVVET ============================ */

  SORU_EKLE("fbil.kuvvet",
    z => {
      const f1 = sec([2, 4, 5]), x1 = sec([1, 2, 3]), kat = R(2, 4), f2 = f1 * kat, x2 = x1 * kat;
      return S({
        kaz: "fbil.kuvvet", duzey: "uygulama", zorluk: 2,
        soru: `Bir dinamometreye <b>${f1} N</b>'luk bir cisim asıldığında yayı <b>${x1} cm</b> uzuyor. Aynı dinamometreye <b>${f2} N</b>'luk bir cisim asılırsa yay kaç cm uzar? (Yay, ölçüm sınırı içinde kullanılıyor.)`,
        dogru: x2 + " cm",
        yanlis: [[(x1 + f2 - f1) + " cm", "strateji", "Kuvvet farkını uzamaya doğrudan eklemişsin. Uzama, kuvvetle aynı oranda artar; fark değil kat önemlidir."],
          [f2 + " cm", "kavrama", "Kuvvetin değerini uzama olarak yazmışsın. Newton ile santimetre farklı şeylerdir; önce kuvvetin kaç katına çıktığını bul."],
          [(x2 + x1) + " cm", "islem", "Bir kat fazla saymışsın. Kuvvet " + kat + " katına çıktığında uzama da tam " + kat + " katına çıkar."]],
        ipucu: "Yeni kuvvet, ilk kuvvetin kaç katı? Yayın uzaması da o kadar kat artar.",
        cozum: ["🔎 Soruyu anlayalım: " + f1 + " N için uzama " + x1 + " cm. " + f2 + " N için uzamayı bulacağız.",
          "💡 Hatırlayalım: Dinamometrenin içindeki yay, ölçüm sınırı içinde, uygulanan kuvvetle aynı oranda uzar. Kuvvet 2 katına çıkarsa uzama da 2 katına çıkar.",
          `✏️ Kuvvet kaç katına çıktı? ${f2} ÷ ${f1} = ${kat}.`,
          `✏️ Uzama da ${kat} katına çıkar: ${x1} cm × ${kat} = ${x2} cm.`,
          `✅ Sonuç: Yay ${x2} cm uzar.`,
          `🔁 Kontrol edelim: ${x2} ÷ ${x1} = ${kat} ve ${f2} ÷ ${f1} = ${kat}. Kuvvet de uzama da aynı oranda arttı; tutuyor!`],
        kural: "Dinamometrede yayın uzaması uygulanan kuvvetle doğru orantılıdır (ölçüm sınırı içinde).",
        dogruNeden: `Kuvvet ${kat} katına çıktığı için uzama da ${kat} katına çıkar: ${x1} × ${kat} = ${x2} cm.`,
      });
    },
    z => {
      const sapma = R(1, 3), gercek = R(4, 12), okunan = gercek + sapma;
      return S({
        kaz: "fbil.kuvvet", duzey: "transfer", zorluk: 3,
        soru: `Elif, dinamometresine hiçbir şey asmadan baktığında ibrenin <b>${sapma} N</b>'u gösterdiğini fark ediyor ama düzeltmeden ölçüme başlıyor. Bir oyuncağı astığında dinamometre <b>${okunan} N</b> gösteriyor. Oyuncağın ağırlığı gerçekte kaç N'dur?`,
        dogru: gercek + " N",
        yanlis: [[okunan + " N", "dikkat", "İbre ölçümden önce sıfırda değildi. Okunan değerin içinde baştaki " + sapma + " N'luk hata da var."],
          [(okunan + sapma) + " N", "islem", "Hatalı başlangıç değerini çıkarmak yerine eklemişsin. İbre fazladan " + sapma + " N gösteriyordu, bu yüzden çıkarmalısın."],
          [sapma + " N", "kavrama", "Bu, boşken gösterilen hatalı değerdir; oyuncağın ağırlığı değil."]],
        ipucu: "İbre en baştan kaç N fazla gösteriyordu?",
        cozum: ["🔎 Soruyu anlayalım: Dinamometre boşken " + sapma + " N gösteriyor; oyuncak asılınca " + okunan + " N gösteriyor. Gerçek ağırlığı bulacağız.",
          "💡 Hatırlayalım: Doğru ölçüm için dinamometrenin ibresi, hiçbir şey asılı değilken sıfırı göstermelidir. Buna “sıfır ayarı” denir.",
          `✏️ İbre en baştan ${sapma} N fazla gösteriyor. Oyuncak asılınca da bu fazlalık okunan değerin içinde kalır.`,
          `✏️ Fazlalığı çıkaralım: ${okunan} N − ${sapma} N = ${gercek} N.`,
          `✅ Sonuç: Oyuncağın gerçek ağırlığı ${gercek} N'dur.`,
          "🔁 Kontrol edelim: " + gercek + " + " + sapma + " = " + okunan + ". Bir dahaki sefere ölçüme başlamadan önce ibrenin sıfırda olup olmadığına bak!"],
        kural: "Ölçümden önce dinamometrenin ibresi sıfıra ayarlanmalıdır.",
        dogruNeden: `İbre baştan ${sapma} N fazla gösterdiği için gerçek değer ${okunan} − ${sapma} = ${gercek} N'dur.`,
      });
    },
    Q("fbil.kuvvet", "aciklama", 1,
      "Şekilde bir kutuya uygulanan kuvvet bir okla gösterilmiştir. Kuvveti okla göstermemizin nedeni aşağıdakilerden hangisidir?",
      "Okun uzunluğu kuvvetin büyüklüğünü, ucunun baktığı taraf ise yönünü gösterir.",
      [["Ok, kutunun ne kadar ağır olduğunu gösterir.", "kavrama", "Ok, kutuya uygulanan kuvveti gösterir; kutunun kendi ağırlığını değil."],
       ["Ok yalnızca kuvvetin yönünü gösterir; büyüklüğü ok ile gösterilemez.", "bilgi", "Okun uzunluğu da önemlidir: Uzun ok büyük kuvveti, kısa ok küçük kuvveti gösterir."],
       ["Ok, kutunun ne kadar süre itildiğini gösterir.", "kavrama", "Okun uzunluğu süreyi değil, kuvvetin büyüklüğünü anlatır."]],
      "Bir kuvveti tam anlatmak için hangi iki bilgiye ihtiyaç vardır?",
      ["🔎 Soruyu anlayalım: Kuvveti neden ok ile çizdiğimizi soruyor.",
       "💡 Hatırlayalım: Kuvvetin hem büyüklüğü (kaç newton) hem de yönü (sağa, sola, yukarı, aşağı) vardır.",
       "✏️ Okun ucu kuvvetin hangi yöne uygulandığını gösterir. Şekilde ok sağa bakıyor, yani kutu sağa itiliyor.",
       "✏️ Okun boyu kuvvetin büyüklüğünü gösterir. Kuvvet artarsa ok daha uzun çizilir.",
       "✅ Sonuç: Ok, kuvvetin hem büyüklüğünü hem de yönünü tek bir çizimde gösterir.",
       "🔁 Kontrol edelim: Yalnızca “8 N” dersek kutunun hangi yöne gideceğini bilemeyiz. Ok bu eksikliği giderir."],
      { gorsel: G.kuvvet({ sag: [8], cisim: "kutu" }),
        kural: "Kuvvet okla gösterilir: okun yönü kuvvetin yönü, okun uzunluğu kuvvetin büyüklüğüdür.", dogruNeden: "Kuvvetin hem büyüklüğü hem yönü olduğundan ikisini birden gösteren ok kullanılır." }),
  );

  SORU_EKLE("fbil.bileske",
    z => {
      const a = R(10, 25), b = R(8, 20), c = R(5, Math.min(15, a + b - 3));
      const once = a + b - c;
      return S({
        kaz: "fbil.bileske", duzey: "transfer", zorluk: 3,
        soru: `Ali bir kutuyu sağa doğru <b>${a} N</b>, Ayşe sağa doğru <b>${b} N</b> kuvvetle itiyor. Can ise aynı kutuyu sola doğru <b>${c} N</b> kuvvetle çekiyor. Can kutuyu bırakırsa kutuya etki eden bileşke kuvvet kaç N <b>artar</b>?`,
        gorsel: G.kuvvet({ sag: [a, b], sol: [c], cisim: "kutu" }),
        dogru: c + " N",
        yanlis: [[(a + b) + " N", "dikkat", "Bu, Can bıraktıktan sonraki bileşke kuvvetin kendisidir. Soru bileşkenin ne kadar arttığını soruyor."],
          [once + " N", "dikkat", "Bu, Can kutuyu bırakmadan önceki bileşke kuvvettir; artış miktarı değildir."],
          [(2 * c) + " N", "islem", "Can'ın kuvvetini iki kez saymışsın. Can bırakınca bileşkeden yalnızca onun kuvveti kadar azaltan etki kalkar."]],
        ipucu: "Bileşkeyi önce Can varken, sonra Can yokken bul ve ikisini karşılaştır.",
        cozum: ["🔎 Soruyu anlayalım: İki kişi sağa itiyor, bir kişi sola çekiyor. Sola çeken bırakınca bileşkedeki artışı bulacağız.",
          "💡 Hatırlayalım: Aynı yöndeki kuvvetler toplanır. Zıt yöndeki kuvvetlerde büyükten küçük çıkarılır; bileşke büyük olanın yönündedir.",
          `✏️ Önce: sağa ${a} + ${b} = ${a + b} N, sola ${c} N. Bileşke = ${a + b} − ${c} = ${once} N (sağa).`,
          `✏️ Sonra: Can bıraktı, yalnızca sağa ${a + b} N kaldı. Bileşke = ${a + b} N (sağa).`,
          `✏️ Artış: ${a + b} − ${once} = ${c} N.`,
          `✅ Sonuç: Bileşke kuvvet ${c} N artar.`,
          "🔁 Kontrol edelim: Ters yöndeki kuvvet kalkınca bileşke tam o kuvvet kadar büyür. Yani hesap yapmadan da " + c + " N diyebilirdik!"],
        kural: "Zıt yönlü bir kuvvet kaldırılırsa bileşke, o kuvvetin büyüklüğü kadar artar.",
        dogruNeden: `Önce bileşke ${once} N, Can bırakınca ${a + b} N olur; fark ${c} N'dur.`,
      });
    },
    z => {
      const s = R(12, 30), bil = R(2, s - 4), f = s - bil;
      return S({
        kaz: "fbil.bileske", duzey: "uygulama", zorluk: 2,
        soru: `Bir cisme sağa doğru <b>${s} N</b> ve sola doğru büyüklüğü bilinmeyen bir <b>F</b> kuvveti etki ediyor. Cisme etki eden bileşke kuvvet <b>sağa doğru ${bil} N</b> olduğuna göre F kaç N'dur?`,
        dogru: f + " N",
        yanlis: [[(s + bil) + " N", "islem", "Bileşkeyi büyük kuvvete eklemişsin. Bileşke sağa olduğuna göre F, " + s + " N'dan küçük olmalı."],
          [bil + " N", "kavrama", "Bileşke ile F'yi karıştırmışsın. Bileşke, iki kuvvetin birlikte yaptığı etkidir."],
          [s + " N", "kavrama", "F, " + s + " N olsaydı kuvvetler dengelenir ve bileşke 0 N olurdu."]],
        ipucu: "Zıt yönlü kuvvetlerde bileşke = büyük − küçük. Hangi kuvvet büyük?",
        cozum: ["🔎 Soruyu anlayalım: Sağa " + s + " N, sola F var. Bileşke sağa " + bil + " N. F'yi bulacağız.",
          "💡 Hatırlayalım: Zıt yönlü iki kuvvetin bileşkesi = büyük kuvvet − küçük kuvvet; yönü büyük kuvvetin yönüdür.",
          `✏️ Bileşke sağa olduğuna göre sağdaki ${s} N daha büyüktür.`,
          `✏️ ${s} − F = ${bil} → F = ${s} − ${bil} = ${f} N.`,
          `✅ Sonuç: F = ${f} N'dur.`,
          `🔁 Kontrol edelim: ${s} − ${f} = ${bil} N, yönü sağa. Soruda verilenle aynı!`],
        kural: "Zıt yönlü iki kuvvette: bileşke = büyük − küçük, yönü büyüğün yönü.",
        dogruNeden: `${s} − ${f} = ${bil} olduğundan F = ${f} N'dur.`,
      });
    },
    z => {
      const a = R(3, 12), b = R(a + 1, 18);
      return S({
        kaz: "fbil.bileske", duzey: "baglanti", zorluk: 3,
        soru: `Büyüklükleri <b>${a} N</b> ve <b>${b} N</b> olan iki kuvvet aynı doğrultuda bir cisme etki ediyor. Kuvvetlerin yönleri değiştirilerek bileşkenin <b>en büyük</b> ve <b>en küçük</b> değeri bulunuyor. Bu değerler hangisidir?`,
        dogru: `En büyük ${a + b} N, en küçük ${b - a} N`,
        yanlis: [[`En büyük ${a + b} N, en küçük 0 N`, "kavrama", "Büyüklükleri farklı iki kuvvet birbirini tam dengeleyemez; bu yüzden bileşke 0 N olamaz."],
          [`En büyük ${b} N, en küçük ${a} N`, "kavrama", "Kuvvetleri tek tek yazmışsın. Bileşke, iki kuvvetin birlikte etkisidir; toplanır ya da çıkarılır."],
          [`En büyük ${b - a} N, en küçük ${a + b} N`, "dikkat", "Değerleri ters yazmışsın. Aynı yönde toplanınca en büyük, zıt yönde çıkarılınca en küçük olur."]],
        ipucu: "Kuvvetler aynı yöndeyken ve zıt yöndeyken bileşkeyi ayrı ayrı hesapla.",
        cozum: ["🔎 Soruyu anlayalım: İki kuvvetin yönlerini değiştirerek bileşkenin alabileceği en büyük ve en küçük değeri arıyoruz.",
          "💡 Hatırlayalım: Aynı yöndeki kuvvetler toplanır; zıt yöndeki kuvvetlerde büyükten küçük çıkarılır.",
          `✏️ Aynı yönde: ${a} + ${b} = ${a + b} N. Bu en büyük değerdir.`,
          `✏️ Zıt yönde: ${b} − ${a} = ${b - a} N. Bu en küçük değerdir.`,
          `✅ Sonuç: En büyük ${a + b} N, en küçük ${b - a} N.`,
          "🔁 Kontrol edelim: Matematikteki tam sayılarla düşün: (+" + b + ") + (+" + a + ") = " + (a + b) + ", (+" + b + ") + (−" + a + ") = " + (b - a) + ". Aynı sonuç!"],
        kural: "Aynı doğrultudaki iki kuvvetin bileşkesi en çok toplamları, en az farkları kadardır.",
        dogruNeden: `Aynı yönde ${a + b} N (en büyük), zıt yönde ${b - a} N (en küçük) bileşke oluşur.`,
      });
    },
  );

  SORU_EKLE("fbil.denge",
    z => {
      const w = sec([6, 8, 10, 12, 15, 20]), [esya, esyaYa, esyaNin] = sec([["kitap", "kitaba", "kitabın"], ["saksı", "saksıya", "saksının"], ["kavanoz", "kavanoza", "kavanozun"], ["kutu", "kutuya", "kutunun"]]);
      return S({
        kaz: "fbil.denge", duzey: "uygulama", zorluk: 2,
        soru: `Ağırlığı <b>${w} N</b> olan bir ${esya} masanın üzerinde hareketsiz duruyor. Şekilde ${esyaNin} ağırlığı gösterilmiştir. Masanın ${esyaYa} uyguladığı kuvvetin büyüklüğü ve yönü nedir?`,
        gorsel: G.kuvvet({ alt: [w], cisim: esya }),
        dogru: `${w} N, yukarı doğru`,
        yanlis: [[`${w} N, aşağı doğru`, "kavrama", "Aşağı doğru olan kuvvet ağırlıktır. Masa ise cismi yukarı doğru iter; yoksa cisim masanın içine batardı."],
          ["0 N, masa kuvvet uygulamaz", "kavrama", "Masa kuvvet uygulamasaydı cisme yalnızca ağırlık etki eder ve cisim aşağı düşerdi."],
          [`${2 * w} N, yukarı doğru`, "islem", "Masa ağırlıktan büyük kuvvet uygulasaydı kuvvetler dengelenmez ve cisim yukarı doğru hareket ederdi."]],
        ipucu: "Cisim hareketsiz duruyorsa ona etki eden kuvvetler için ne söylenir?",
        cozum: [`🔎 Soruyu anlayalım: ${w} N ağırlığındaki ${esya} masada duruyor. Masanın yukarı doğru uyguladığı kuvveti arıyoruz.`,
          "💡 Hatırlayalım: Duran bir cisme etki eden kuvvetler dengelenmiştir; yani bileşke kuvvet 0 N'dur.",
          `✏️ Aşağı doğru ${w} N ağırlık var. Bunu dengelemek için yukarı doğru bir kuvvet gerekir.`,
          `✏️ Bileşke 0 olmalı: yukarıdaki kuvvet − ${w} = 0 → yukarıdaki kuvvet = ${w} N.`,
          `✅ Sonuç: Masa ${esyaYa} ${w} N büyüklüğünde, yukarı doğru kuvvet uygular.`,
          "🔁 Kontrol edelim: Eşit büyüklükte, zıt yönlü iki kuvvet birbirini dengeler; bu yüzden cisim ne aşağı batar ne yukarı kalkar."],
        kural: "Duran cisme etki eden kuvvetler dengelenmiştir; zıt yönlü kuvvetler eşit büyüklüktedir.",
        dogruNeden: `Cisim durduğuna göre kuvvetler dengelenmiştir; masa, ${w} N'luk ağırlığa eşit ve zıt yönde kuvvet uygular.`,
      });
    },
    Q("fbil.denge", "aciklama", 2,
      "Çimenli sahada yere vurulan bir futbol topu bir süre yuvarlandıktan sonra yavaşlayıp duruyor. Topun durmasının nedeni aşağıdakilerden hangisidir?",
      "Topa hareket yönüne zıt yönde sürtünme kuvveti etki eder; kuvvetler dengelenmemiştir.",
      [["Ayakla verilen kuvvet zamanla tükendiği için top durur.", "kavrama", "Ayak topa yalnızca vurduğu anda kuvvet uygular; kuvvet topun içinde “depolanmaz”. Topu yavaşlatan şey sürtünmedir."],
       ["Topa etki eden kuvvetler dengelendiği için top yavaşlar.", "kavrama", "Dengelenmiş kuvvetler hareketli bir cismin süratini değiştirmez. Yavaşlama, dengelenmemiş kuvvet olduğunu gösterir."],
       ["Yer çekimi topu ileri doğru ittiği için top durur.", "bilgi", "Yer çekimi topu aşağı doğru çeker; ileri doğru itmez ve topu yatay yolda durdurmaz."]],
      "Topun sürati değişiyorsa kuvvetler dengelenmiş olabilir mi?",
      ["🔎 Soruyu anlayalım: Yuvarlanan top neden yavaşlayıp duruyor?",
       "💡 Hatırlayalım: Dengelenmemiş kuvvet, cismin süratini ya da yönünü değiştirir. Dengelenmiş kuvvet ise hareketi değiştirmez.",
       "✏️ Top yuvarlanırken çimen ve hava, topa hareket yönünün tersine sürtünme kuvveti uygular.",
       "✏️ Topu ileri iten bir kuvvet artık yoktur. Geriye doğru olan sürtünme dengelenmez ve topu yavaşlatır.",
       "✅ Sonuç: Top, zıt yöndeki dengelenmemiş sürtünme kuvveti yüzünden yavaşlar ve durur.",
       "🔁 Kontrol edelim: Aynı top buz gibi kaygan bir yüzeyde çok daha uzağa gider; çünkü sürtünme azdır. Bu, nedenin sürtünme olduğunu doğrular."],
      { kural: "Hareketli cisim yavaşlıyorsa ona hareket yönüne zıt, dengelenmemiş bir kuvvet etki ediyordur.", dogruNeden: "Sürtünme kuvveti hareket yönünün tersinedir ve dengelenmediği için topu yavaşlatıp durdurur." }),
    z => {
      const harf = ["K", "L", "M", "N"], dk = R(0, 3);
      const sat = harf.map((h, i) => {
        const a = R(4, 15), b = R(3, 12);
        let c = a + b; if (i !== dk) c += sec([-1, 1]) * R(2, 6);
        return [h, `${a} N ve ${b} N`, `${c} N`, a, b, c];
      });
      const d = sat[dk];
      const yanlis = sat.filter((_, i) => i !== dk).map(s => [s[0], s[5] > s[3] + s[4] ? "islem" : "dikkat", `${s[0]} kutusunda sağa ${s[3] + s[4]} N, sola ${s[5]} N kuvvet var. Bileşke ${Math.abs(s[3] + s[4] - s[5])} N olduğu için kutu ${s[5] > s[3] + s[4] ? "sola" : "sağa"} doğru harekete geçer.`]);
      return S({
        kaz: "fbil.denge", duzey: "transfer", zorluk: 3,
        soru: "Başlangıçta duran dört kutuya etki eden kuvvetler tabloda verilmiştir. Hangi kutu <b>durmaya devam eder</b>?",
        gorsel: G.tablo(["Kutu", "Sağa doğru kuvvetler", "Sola doğru kuvvet"], sat.map(s => s.slice(0, 3))),
        dogru: d[0], yanlis,
        ipucu: "Her kutu için sağa doğru kuvvetleri topla ve sola doğru kuvvetle karşılaştır.",
        cozum: ["🔎 Soruyu anlayalım: Dört duran kutudan hangisine dengelenmiş kuvvet etki ettiğini bulacağız.",
          "💡 Hatırlayalım: Duran bir cisme etki eden kuvvetler dengelenmişse (bileşke 0 N) cisim durmaya devam eder.",
          "✏️ Sağdaki kuvvetleri toplayalım: " + sat.map(s => `${s[0]}: ${s[3]} + ${s[4]} = ${s[3] + s[4]} N`).join("; ") + ".",
          "✏️ Sola doğru kuvvetle karşılaştıralım: " + sat.map(s => `${s[0]}: ${s[3] + s[4]} ve ${s[5]}`).join("; ") + ".",
          `✅ Sonuç: Yalnızca ${d[0]} kutusunda sağa ve sola doğru kuvvetler eşittir (${d[5]} N). Bu kutu durmaya devam eder.`,
          "🔁 Kontrol edelim: Diğer kutularda bileşke 0 değildir; onlar büyük kuvvetin yönünde harekete geçer."],
        kural: "Bileşke kuvvet 0 N ise kuvvetler dengelenmiştir ve duran cisim durmaya devam eder.",
        dogruNeden: `${d[0]} kutusunda sağa ${d[3]} + ${d[4]} = ${d[5]} N, sola ${d[5]} N kuvvet vardır; kuvvetler dengelenmiştir.`,
      });
    },
  );

  /* ============================ ÜNİTE 2: SABİT SÜRATLİ VE SABİT HIZLI HAREKET ============================ */

  SORU_EKLE("fhiz.surat",
    z => {
      const v = sec([1, 2]), dk = R(3, 9), sn = dk * 60, yol = v * sn;
      return S({
        kaz: "fhiz.surat", duzey: "uygulama", zorluk: 2,
        soru: `Zeynep evinden okula kadar olan <b>${yol} m</b>'lik yolu sabit süratle <b>${dk} dakikada</b> yürüyor. Zeynep'in sürati kaç <b>m/s</b>'dir?`,
        dogru: v + " m/s",
        yanlis: [[(yol / dk) + " m/s", "dikkat", "Yolu dakikaya bölmüşsün; bu sonuç m/dk olur. m/s bulmak için önce süreyi saniyeye çevirmelisin."],
          [(v * 60) + " m/s", "islem", "Saniyeye çevirmeyi ters yapmışsın. 1 dakika 60 saniyedir; süre büyür, sürat küçülür."],
          [(v * 2) + " m/s", "islem", "Bölme işlemini yeniden kontrol et: " + yol + " ÷ " + sn + " = " + v + "."]],
        ipucu: "Önce dakikayı saniyeye çevir (1 dakika = 60 saniye).",
        cozum: ["🔎 Soruyu anlayalım: Yol " + yol + " m, süre " + dk + " dakika. Sürati m/s cinsinden bulacağız.",
          "💡 Hatırlayalım: Sürat = alınan yol ÷ geçen süre. Birim m/s ise yol metre, süre saniye olmalıdır.",
          `✏️ Süreyi çevirelim: ${dk} dk × 60 = ${sn} s.`,
          `✏️ Sürati hesaplayalım: ${yol} m ÷ ${sn} s = ${v} m/s.`,
          `✅ Sonuç: Zeynep'in sürati ${v} m/s'dir.`,
          `🔁 Kontrol edelim: ${v} m/s ile ${sn} saniyede ${v} × ${sn} = ${yol} m yol alınır. Tutuyor!`],
        kural: "Sürat = yol ÷ süre. m/s için yol metre, süre saniye olmalıdır.",
        dogruNeden: `${dk} dakika = ${sn} saniye; ${yol} ÷ ${sn} = ${v} m/s.`,
      });
    },
    z => {
      const [kmsa, ms] = sec([[72, 20], [90, 25], [108, 30]]), hayvan = sec([["çita", 28], ["at", 18], ["tavşan", 15], ["deve kuşu", 19]]);
      let hv = hayvan[1]; if (hv === ms) hv += 2;
      const otoHizli = ms > hv, dogru = otoHizli ? "Otomobil" : hayvan[0][0].toLocaleUpperCase("tr-TR") + hayvan[0].slice(1);
      const diger = otoHizli ? hayvan[0][0].toLocaleUpperCase("tr-TR") + hayvan[0].slice(1) : "Otomobil";
      return S({
        kaz: "fhiz.surat", duzey: "transfer", zorluk: 3,
        soru: `Bir ${hayvan[0]} yaklaşık <b>${hv} m/s</b> süratle koşabiliyor. Bir otomobil ise <b>${kmsa} km/sa</b> süratle gidiyor. Hangisi daha süratlidir?`,
        dogru,
        yanlis: [[diger, "kavrama", `Sayıları birimlerine bakmadan karşılaştırmışsın. ${kmsa} km/sa = ${ms} m/s olduğundan karşılaştırma ${ms} ile ${hv} arasında yapılmalı.`],
          ["İkisinin sürati eşittir", "islem", `${kmsa} km/sa, ${ms} m/s eder. ${ms} ile ${hv} eşit değildir.`],
          ["Birimler farklı olduğu için karşılaştırılamaz", "strateji", "Birimler farklıysa birini diğerine çevirip karşılaştırabiliriz; karşılaştırma yapılamaz demek doğru değil."]],
        ipucu: "km/sa'yi m/s'ye çevirmek için 1000'le çarpıp 3600'e böl (ya da 3,6'ya böl).",
        cozum: ["🔎 Soruyu anlayalım: Biri m/s, diğeri km/sa olarak verilen iki sürati karşılaştıracağız.",
          "💡 Hatırlayalım: Farklı birimli süratler karşılaştırılmadan önce aynı birime çevrilir. 1 km = 1000 m, 1 sa = 3600 s.",
          `✏️ ${kmsa} km/sa = ${kmsa} × 1000 m ÷ 3600 s = ${kmsa * 1000} ÷ 3600 = ${ms} m/s.`,
          `✏️ Karşılaştıralım: otomobil ${ms} m/s, ${hayvan[0]} ${hv} m/s → ${otoHizli ? ms + " > " + hv : hv + " > " + ms}.`,
          `✅ Sonuç: ${dogru} daha süratlidir.`,
          "🔁 Kontrol edelim: Kısa yol: km/sa'yi 3,6'ya bölünce m/s bulunur. " + kmsa + " ÷ 3,6 = " + ms + ". Bir dahaki sefere birimlere bakmadan sayı karşılaştırma!"],
        kural: "Süratleri karşılaştırmadan önce aynı birime çevir: km/sa ÷ 3,6 = m/s.",
        dogruNeden: `${kmsa} km/sa = ${ms} m/s olduğundan ${otoHizli ? ms + " m/s > " + hv + " m/s" : hv + " m/s > " + ms + " m/s"}; ${dogru.toLocaleLowerCase("tr-TR")} daha süratlidir.`,
      });
    },
    z => {
      const [v, d] = sec([[60, 12], [60, 15], [60, 30], [60, 45], [60, 90], [90, 9], [90, 45], [120, 30], [120, 60], [120, 90]]);
      const dkk = d * 60 / v;
      return S({
        kaz: "fhiz.surat", duzey: "transfer", zorluk: 3,
        soru: `Sabit <b>${v} km/sa</b> süratle giden bir otobüs, iki durak arasındaki <b>${d} km</b>'lik yolu kaç <b>dakikada</b> alır?`,
        dogru: dkk + " dakika",
        yanlis: [[od(d / v) + " dakika", "dikkat", `${d} ÷ ${v} = ${od(d / v)} sonucunun birimi saattir, dakika değil. Saati 60 ile çarparak dakikaya çevir.`],
          [(dkk * 60) + " dakika", "islem", "60 ile iki kez çarpmışsın; bu sayı dakikayı değil saniyeyi gösterir."],
          Number.isInteger(v / d) ? [(v / d) + " dakika", "strateji", "Sürati yola bölmüşsün. Süre bulmak için yolu sürate bölmek gerekir."] : [(dkk * 2) + " dakika", "islem", "Hesabı yeniden kontrol et; süre = yol ÷ sürat, sonra saati dakikaya çevir."]],
        ipucu: "Önce süreyi saat olarak bul (yol ÷ sürat), sonra 60 ile çarp.",
        cozum: ["🔎 Soruyu anlayalım: Sürat " + v + " km/sa, yol " + d + " km. Süreyi dakika cinsinden bulacağız.",
          "💡 Hatırlayalım: Süre = yol ÷ sürat. 1 saat = 60 dakika.",
          `✏️ Süre (saat): ${d} ÷ ${v} = ${od(d / v)} saat.`,
          `✏️ Dakikaya çevirelim: ${od(d / v)} × 60 = ${dkk} dakika.`,
          `✅ Sonuç: Otobüs bu yolu ${dkk} dakikada alır.`,
          `🔁 Kontrol edelim: ${v} km/sa, dakikada ${od(v / 60)} km demektir. ${dkk} dakikada ${od(v / 60)} × ${dkk} = ${d} km. Tutuyor!`],
        kural: "Süre = yol ÷ sürat; saati dakikaya çevirmek için 60 ile çarp.",
        dogruNeden: `${d} ÷ ${v} = ${od(d / v)} saat = ${dkk} dakika.`,
      });
    },
  );

  SORU_EKLE("fhiz.grafik",
    z => {
      const vK = sec([4, 6, 8]), vL = sec([2, 4].filter(v => v < vK)), t = R(2, 5), fark = (vK - vL) * t;
      return S({
        kaz: "fhiz.grafik", duzey: "uygulama", zorluk: 3,
        soru: `K ve L oyuncak arabaları aynı noktadan, aynı anda ve aynı yönde harekete başlıyor. Grafikte arabaların yol–zaman grafikleri verilmiştir. <b>${t}. saniyenin sonunda</b> arabalar arasındaki uzaklık kaç metredir?`,
        gorsel: yolZaman([{ ad: "K", noktalar: [[0, 0], [5, vK * 5]], sinif: "g-ok-a" }, { ad: "L", noktalar: [[0, 0], [5, vL * 5]], sinif: "g-ok-d" }], { tmax: 5, ymax: 40, tadim: 1, yadim: 4 }),
        dogru: fark + " m",
        yanlis: [[(vK * t) + " m", "dikkat", "Bu yalnızca K'nin aldığı yoldur. Aradaki uzaklık için L'nin aldığı yolu da çıkarmalısın."],
          [((vK + vL) * t) + " m", "kavrama", "Yolları toplamışsın. Arabalar aynı yönde gittiği için aradaki uzaklık yolların farkıdır."],
          [(vK - vL) + " m", "dikkat", "Bu, 1 saniyede açılan uzaklıktır. Soru " + t + ". saniyenin sonunu soruyor."]],
        ipucu: `Grafikte ${t}. saniyeye karşılık gelen iki yol değerini oku.`,
        cozum: [`🔎 Soruyu anlayalım: Aynı yöne giden iki arabanın ${t}. saniyedeki aradaki uzaklığını bulacağız.`,
          "💡 Hatırlayalım: Yol–zaman grafiğinde bir anın karşısındaki değer, o ana kadar alınan yoldur. Aynı yöne gidenler arasındaki uzaklık = yolların farkı.",
          `✏️ K'nin sürati: ${vK * 5} m ÷ 5 s = ${vK} m/s → ${t} s'de ${vK} × ${t} = ${vK * t} m.`,
          `✏️ L'nin sürati: ${vL * 5} m ÷ 5 s = ${vL} m/s → ${t} s'de ${vL} × ${t} = ${vL * t} m.`,
          `✏️ Aradaki uzaklık: ${vK * t} − ${vL * t} = ${fark} m.`,
          `✅ Sonuç: Arabalar arasında ${fark} m vardır.`,
          `🔁 Kontrol edelim: Her saniye aradaki uzaklık ${vK} − ${vL} = ${vK - vL} m artar. ${t} saniyede ${vK - vL} × ${t} = ${fark} m. Aynı sonuç!`],
        kural: "Aynı noktadan aynı yöne giden iki cisim arasındaki uzaklık, aldıkları yolların farkıdır.",
        dogruNeden: `${t}. saniyede K ${vK * t} m, L ${vL * t} m yol almıştır; fark ${fark} m'dir.`,
      });
    },
    z => {
      const [a, b] = karistir([2, 3, 4, 5]).slice(0, 2), dur = R(1, 2), t1 = 2, t2 = t1 + dur, t3 = t2 + 2, y1 = 2 * a, y3 = y1 + 2 * b;
      const araliklar = [`0–${t1} s`, `${t1}–${t2} s`, `${t2}–${t3} s`], dogru = a > b ? araliklar[0] : araliklar[2], ters = a > b ? araliklar[2] : araliklar[0];
      return S({
        kaz: "fhiz.grafik", duzey: "aciklama", zorluk: 2,
        soru: "Şekilde bir bisikletlinin yol–zaman grafiği verilmiştir. Bisikletlinin sürati hangi zaman aralığında <b>en büyüktür</b>?",
        gorsel: yolZaman([{ noktalar: [[0, 0], [t1, y1], [t2, y1], [t3, y3]], sinif: "g-ok-a" }], { tmax: 8, ymax: 20, tadim: 1, yadim: 2 }),
        dogru,
        yanlis: [[ters, "islem", `Bu aralıkta sürat ${a > b ? b : a} m/s'dir; diğer hareketli aralıktaki ${a > b ? a : b} m/s'den küçüktür.`],
          [araliklar[1], "kavrama", "Bu aralıkta grafik yatay; yol değişmiyor, yani bisikletli duruyor. Sürati 0'dır."],
          ["Bütün aralıklarda sürati eşittir", "kavrama", "Grafiğin dikliği aralıklar arasında değişiyor; diklik değişince sürat de değişir."]],
        ipucu: "Her aralıkta alınan yolu süreye böl. Yatay çizgi ne anlatır?",
        cozum: ["🔎 Soruyu anlayalım: Üç zaman aralığından hangisinde bisikletlinin daha hızlı yol aldığını bulacağız.",
          "💡 Hatırlayalım: Yol–zaman grafiğinde çizgi ne kadar dikse sürat o kadar büyüktür. Yatay çizgi durmak demektir.",
          `✏️ 0–${t1} s: ${y1} m ÷ ${t1} s = ${a} m/s.`,
          `✏️ ${t1}–${t2} s: yol değişmiyor (${y1} m) → sürat 0, bisikletli duruyor.`,
          `✏️ ${t2}–${t3} s: (${y3} − ${y1}) m ÷ 2 s = ${2 * b} ÷ 2 = ${b} m/s.`,
          `✅ Sonuç: Sürat en büyük ${dogru} aralığındadır (${Math.max(a, b)} m/s).`,
          "🔁 Kontrol edelim: Grafiğe bak; en dik bölüm bu aralıktadır. Hesap ile görüntü aynı şeyi söylüyor."],
        kural: "Yol–zaman grafiğinde daha dik çizgi daha büyük sürat, yatay çizgi durmak demektir.",
        dogruNeden: `${dogru} aralığında sürat ${Math.max(a, b)} m/s ile en büyüktür; grafik en dik orada.`,
      });
    },
    Q("fhiz.grafik", "baglanti", 2,
      "Şekilde K ve L araçlarının yol–zaman grafikleri verilmiştir. K'nin çizgisinin L'ninkinden <b>daha dik</b> olması ne anlama gelir?",
      "K aynı sürede daha çok yol aldığı için daha süratlidir.",
      [["K daha uzun süre hareket etmiştir.", "kavrama", "İki çizgi de aynı zaman aralığında çizilmiştir. Diklik süreyi değil, sürati gösterir."],
       ["K yokuş yukarı, L düz yolda gitmektedir.", "kavrama", "Grafiğin dikliği yolun eğimini göstermez. Grafik yolun şeklini değil, yol ile zaman ilişkisini anlatır."],
       ["L aynı sürede daha çok yol almıştır.", "dikkat", "Grafikte aynı zamana karşılık K'nin yol değeri daha büyüktür; daha çok yol alan K'dir."]],
      "Aynı bir zaman değerinde (ör. 4. saniye) iki aracın yol değerlerini karşılaştır.",
      ["🔎 Soruyu anlayalım: İki grafikten birinin daha dik olmasının ne anlattığını soruyor.",
       "💡 Hatırlayalım: Sürat = yol ÷ süre. Yol–zaman grafiğinde dikliği sürat belirler.",
       "✏️ 4. saniyeye bakalım: K 32 m, L 16 m yol almış.",
       "✏️ Süratler: K için 32 ÷ 4 = 8 m/s, L için 16 ÷ 4 = 4 m/s. K'nin sürati daha büyük.",
       "✅ Sonuç: Daha dik çizgi, aynı sürede daha çok yol alan, yani daha süratli aracı gösterir.",
       "🔁 Kontrol edelim: Duran bir aracın çizgisi yatay olurdu (diklik yok, sürat 0). Diklik arttıkça sürat artar."],
      { gorsel: yolZaman([{ ad: "K", noktalar: [[0, 0], [5, 40]], sinif: "g-ok-a" }, { ad: "L", noktalar: [[0, 0], [5, 20]], sinif: "g-ok-d" }], { tmax: 5, ymax: 40, tadim: 1, yadim: 8 }),
        kural: "Yol–zaman grafiğinde çizgi ne kadar dikse sürat o kadar büyüktür.", dogruNeden: "Daha dik olan K çizgisi, aynı sürede daha çok yol alındığını yani daha büyük sürati gösterir." }),
  );

  SORU_EKLE("fhiz.hiz",
    Q("fhiz.hiz", "aciklama", 2,
      "Bir asansör önce <b>2 m/s</b> süratle yukarı çıkıyor, ardından yine <b>2 m/s</b> süratle aşağı iniyor. Asansörün hareketiyle ilgili hangisi doğrudur?",
      "Sürati değişmemiştir ama yönü değiştiği için hızı değişmiştir.",
      [["Hem sürati hem hızı değişmemiştir.", "kavrama", "Hız, sürat ile yönün birlikte söylenmesidir. Yön yukarıdan aşağıya döndüğü için hız değişmiştir."],
       ["Sürati değişmiştir ama hızı değişmemiştir.", "kavrama", "Sürat her iki durumda da 2 m/s'dir; değişen yön, dolayısıyla hızdır."],
       ["Hem sürati hem hızı değişmiştir.", "dikkat", "Sürat değerine dikkat et: İki durumda da 2 m/s. Sürat değişmemiştir."]],
      "Sürat yalnızca “ne kadar çabuk” sorusunu yanıtlar; hız buna “hangi yöne” bilgisini de ekler.",
      ["🔎 Soruyu anlayalım: Asansörün sürati ve yönü veriliyor. Sürati ve hızı değişti mi, bunu bulacağız.",
       "💡 Hatırlayalım: Sürat = birim zamanda alınan yol (yön yok). Hız = sürat + yön.",
       "✏️ Sürat: Önce 2 m/s, sonra 2 m/s → değişmemiş.",
       "✏️ Yön: Önce yukarı, sonra aşağı → değişmiş. Yön değişince hız da değişir.",
       "✅ Sonuç: Asansörün sürati aynı kalmış, hızı değişmiştir.",
       "🔁 Kontrol edelim: Hızları yazalım: “yukarı 2 m/s” ve “aşağı 2 m/s”. Bu iki ifade aynı değil; demek ki hızlar farklı."],
      { kural: "Yön değişirse sürat aynı kalsa bile hız değişir.", dogruNeden: "Sürat iki durumda da 2 m/s'dir; yön değiştiği için hız değişmiştir." }),
    z => {
      const harf = ["K", "L", "M", "N"], u = R(2, 4), y = sec([1, -1]);
      const digerU = sec([1, 2, 3, 4, 5].filter(x => x !== u));
      const oklar = karistir([{ uz: u, yon: y }, { uz: u, yon: y }, { uz: u, yon: -y }, { uz: digerU, yon: y }]);
      const ciftler = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
      const ayni = (i, j) => oklar[i].uz === oklar[j].uz && oklar[i].yon === oklar[j].yon;
      const dc = ciftler.find(([i, j]) => ayni(i, j));
      const ad = ([i, j]) => harf[i] + " ve " + harf[j];
      const yanlis = karistir(ciftler.filter(c => c !== dc)).slice(0, 3).map(([i, j]) => {
        const esitUz = oklar[i].uz === oklar[j].uz;
        return [ad([i, j]), esitUz ? "kavrama" : "dikkat", esitUz ? `${harf[i]} ile ${harf[j]}'nin süratleri eşit ama yönleri zıt; bu yüzden hızları farklıdır.` : `${harf[i]} ile ${harf[j]}'nin oklarının uzunlukları farklı, yani süratleri farklıdır; hızları eşit olamaz.`];
      });
      return S({
        kaz: "fhiz.hiz", duzey: "transfer", zorluk: 3,
        soru: "Şekilde düz bir yolda giden dört aracın hızları oklarla gösterilmiştir (okun uzunluğu sürati, ucu yönü gösterir; her kare aralığı eşit sürati temsil eder). Hangi iki aracın <b>hızları eşittir</b>?",
        gorsel: hizOklari(oklar.map((o, i) => ({ ad: harf[i], uzunluk: o.uz, yon: o.yon }))),
        dogru: ad(dc), yanlis,
        ipucu: "Hızların eşit olması için iki şart var: Ok uzunlukları da yönleri de aynı olmalı.",
        cozum: ["🔎 Soruyu anlayalım: Dört okun içinden hem uzunluğu hem yönü aynı olan iki oku bulacağız.",
          "💡 Hatırlayalım: Hız, sürat ve yönün birlikte ifadesidir. İki hızın eşit olması için hem süratler hem yönler aynı olmalıdır.",
          "✏️ Ok uzunluklarını sayalım: " + oklar.map((o, i) => `${harf[i]}: ${o.uz} birim`).join(", ") + ".",
          "✏️ Yönlerine bakalım: " + oklar.map((o, i) => `${harf[i]}: ${o.yon > 0 ? "sağa" : "sola"}`).join(", ") + ".",
          `✅ Sonuç: Uzunluğu da yönü de aynı olan araçlar ${ad(dc)}'dir.`,
          "🔁 Kontrol edelim: Uzunluğu aynı ama yönü zıt olan ok, eşit sürati ama farklı hızı gösterir. Bu tuzağa düşme!"],
        kural: "Hızlar eşitse süratler de yönler de aynıdır.",
        dogruNeden: `${ad(dc)} araçlarının okları aynı uzunlukta ve aynı yöndedir; hem süratleri hem yönleri aynıdır.`,
      });
    },
    Q("fhiz.hiz", "transfer", 3,
      "Denizde sürüklenen bir botu arayan kurtarma ekibi, botun 1 saat sonra nerede olacağını tahmin etmek istiyor. Ekibin deniz akıntısıyla ilgili hangi bilgiye ihtiyacı vardır?",
      "Akıntının hızına, yani hem süratine hem de yönüne",
      [["Yalnızca akıntının süratine", "kavrama", "Sürati bilmek, botun ne kadar yol alacağını söyler ama hangi yöne gideceğini söylemez; bot yanlış yerde aranır."],
       ["Yalnızca akıntının yönüne", "kavrama", "Yönü bilmek yetmez; ne kadar uzağa gideceğini bulmak için sürat de gerekir."],
       ["Denizin sıcaklığına", "bilgi", "Sıcaklık, botun nereye sürükleneceğini doğrudan belirlemez. Gerekli olan akıntının sürati ve yönüdür."]],
      "Botun yerini bulmak için hem “ne kadar uzağa” hem de “hangi tarafa” sorusunu yanıtlamak gerekir.",
      ["🔎 Soruyu anlayalım: Botun 1 saat sonraki yerini tahmin etmek için gereken bilgiyi arıyoruz.",
       "💡 Hatırlayalım: Sürat, birim zamanda alınan yolu; hız ise sürat ile yönü birlikte anlatır.",
       "✏️ Akıntı saatte 3 km sürüklüyorsa bot 1 saatte 3 km uzaklaşır. Bu, “ne kadar uzağa” sorusunun yanıtıdır.",
       "✏️ Ama 3 km kuzeye mi, güneye mi? Bunu yön bilgisi söyler. İkisi birlikte hızı oluşturur.",
       "✅ Sonuç: Ekibin akıntının hızına, yani süratine ve yönüne birlikte ihtiyacı vardır.",
       "🔁 Kontrol edelim: Yalnızca sürat bilinseydi bot, başlangıç noktasından 3 km uzaklıktaki bir çemberin herhangi bir yerinde olabilirdi. Yön, aranacak yeri tek noktaya indirir."],
      { kural: "Bir şeyin nereye varacağını bulmak için hız (sürat + yön) gerekir.", dogruNeden: "Akıntının sürati botun ne kadar uzağa, yönü ise hangi tarafa gideceğini belirler; ikisi birlikte hızdır." }),
  );
})();
