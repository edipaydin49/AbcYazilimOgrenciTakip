/* 6. sınıf Fen Bilimleri — 1. ve 2. ünite konuları:
 * Güneş Sistemi, Güneş ve Ay Tutulmaları, Bileşke Kuvvet, Sabit Süratli ve Sabit Hızlı Hareket.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, Q, G } = OGR;

  /* ============================ KONUYA ÖZEL GÖRSELLER ============================ */
  const GEZEGEN = ["Merkür", "Venüs", "Dünya", "Mars", "Jüpiter", "Satürn", "Uranüs", "Neptün"];
  const GEZ_IN = ["Merkür'ün", "Venüs'ün", "Dünya'nın", "Mars'ın", "Jüpiter'in", "Satürn'ün", "Uranüs'ün", "Neptün'ün"];

  /* Güneş ve sıralı gezegenler. etiket: "isim" | "harf" | "sira" | "yok"; kusak: asteroit kuşağını çiz */
  function gezegenler({ etiket = "isim", harfler = "ABCDEFGH", kusak = false, kusakEtiket = "" } = {}) {
    const X = [105, 150, 195, 240, 335, 425, 508, 588], Rr = [4, 7, 7, 5, 22, 18, 12, 12];
    let ic = `<circle class="g-b g-cizgi" cx="0" cy="70" r="60"/>` + G.yazi(6, 146, "Güneş", { k: 1, a: "start" });
    if (kusak) {
      for (let i = 0; i < 26; i++) ic += `<circle class="g-a" cx="${266 + (i * 13) % 36}" cy="${30 + (i * 23) % 80}" r="1.8"/>`;
      if (kusakEtiket) ic += G.yazi(284, 18, kusakEtiket, { k: 1, b: 1 });
    }
    X.forEach((x, i) => {
      if (i === 5) ic += `<ellipse class="g-cizgi" cx="${x}" cy="70" rx="30" ry="6" fill="none" stroke-width="2"/>`;
      ic += `<circle class="g-yumusak g-cizgi" cx="${x}" cy="70" r="${Rr[i]}"/>`;
      const t = etiket === "isim" ? GEZEGEN[i] : etiket === "harf" ? harfler[i] : etiket === "sira" ? String(i + 1) : "";
      if (t) ic += G.yazi(x, 128, t, { k: etiket === "isim" ? 1 : 0, b: etiket !== "isim" ? 1 : 0 });
    });
    return G.svg(640, 152, ic, "Güneş ve çevresindeki gezegenler");
  }

  /* Güneş (G), Dünya (D), Ay (A) dizilimi. sira: ["G","A","D"] gibi; adlar: gösterilecek etiketler */
  function dizilim(sira, adlar) {
    const X = [80, 300, 500], y = 85, Rr = { G: 46, D: 24, A: 11 }, K = { G: "g-b g-cizgi", D: "g-a g-cizgi", A: "g-yumusak g-cizgi" };
    const AD = { G: "Güneş", D: "Dünya", A: "Ay" };
    let ic = `<line class="g-ince" x1="20" y1="${y}" x2="560" y2="${y}" stroke-dasharray="6 6"/>`;
    sira.forEach((c, i) => { ic += `<circle class="${K[c]}" cx="${X[i]}" cy="${y}" r="${Rr[c]}"/>` + G.yazi(X[i], 162, adlar ? adlar[i] : AD[c], { b: 1 }); });
    return G.svg(580, 175, ic, "Güneş, Dünya ve Ay'ın dizilimi");
  }

  /* Güneş tutulmasında Ay'ın tam ve yarı gölgesi; Dünya üzerinde X, Y, Z noktaları */
  function gunesGolge() {
    let ic = `<circle class="g-b g-cizgi" cx="10" cy="110" r="70"/>` + G.yazi(40, 205, "Güneş", { k: 1 });
    ic += `<polygon class="g-yumusak" points="262,101 262,119 438,148 438,72" opacity="0.8"/>`;
    ic += `<polygon class="g-a" points="262,101 262,119 432,110" opacity="0.75"/>`;
    ic += `<circle class="g-yumusak g-cizgi" cx="262" cy="110" r="10"/>` + G.yazi(262, 92, "Ay", { k: 1 });
    ic += `<circle class="g-bos g-cizgi" cx="482" cy="110" r="50" stroke-width="2"/>` + G.yazi(482, 182, "Dünya", { k: 1 });
    [["X", 432, 110, 418, 114], ["Y", 438, 84, 424, 80], ["Z", 532, 110, 548, 114]].forEach(([t, x, yy, tx, ty]) => {
      ic += `<circle class="g-d" cx="${x}" cy="${yy}" r="4"/>` + G.yazi(tx, ty, t, { b: 1 });
    });
    ic += G.yazi(330, 205, "koyu: tam gölge · açık: yarı gölge", { k: 1 });
    return G.svg(600, 215, ic, "Güneş tutulmasında Ay'ın gölgesi");
  }

  /* Ay tutulmasında Dünya'nın gölgesi; Ay'ın üç olası konumu K, L, M */
  function ayGolge() {
    let ic = `<circle class="g-b g-cizgi" cx="10" cy="110" r="70"/>` + G.yazi(40, 205, "Güneş", { k: 1 });
    ic += `<polygon class="g-yumusak" points="250,70 250,150 570,182 570,38" opacity="0.8"/>`;
    ic += `<polygon class="g-a" points="250,70 250,150 520,110" opacity="0.75"/>`;
    ic += `<circle class="g-a g-cizgi" cx="250" cy="110" r="40"/>` + G.yazi(250, 172, "Dünya", { k: 1 });
    [["K", 400, 110], ["L", 400, 72], ["M", 400, 22]].forEach(([t, x, yy]) => {
      ic += `<circle class="g-bos g-cizgi" cx="${x}" cy="${yy}" r="8"/>` + G.yazi(x + 22, yy + 5, t, { b: 1 });
    });
    ic += G.yazi(330, 205, "koyu: tam gölge · açık: yarı gölge", { k: 1 });
    return G.svg(600, 215, ic, "Ay tutulmasında Dünya'nın gölgesi");
  }

  /* Kuyruklu yıldız ve dört olası kuyruk yönü */
  function kuyrukluYildiz(solda, harfler) {
    const sx = 300, sy = 110, cx = solda ? 120 : 480, cy = 110, L = 62;
    const yon = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let ic = `<circle class="g-b g-cizgi" cx="${sx}" cy="${sy}" r="34"/>` + G.yazi(sx, sy + 56, "Güneş", { k: 1 });
    yon.forEach(([dx, dy], i) => {
      const x2 = cx + dx * L, y2 = cy + dy * L;
      ic += G.ok(cx + dx * 12, cy + dy * 12, x2, y2) + G.yazi(x2 + dx * 16 + (dy ? 14 : 0), y2 + dy * 16 + 5, harfler[i], { b: 1 });
    });
    ic += `<circle class="g-yumusak g-cizgi" cx="${cx}" cy="${cy}" r="9"/>`;
    return G.svg(600, 220, ic, "kuyruklu yıldız ve Güneş");
  }

  /* Dinamometre: 0..max ölçekli, ibre deger konumunda */
  function dinamometre(deger, max, adim, etiketAdim) {
    const y0 = 50, y1 = 250, yk = v => y0 + (y1 - y0) * v / max;
    let ic = `<line class="g-cizgi" x1="100" y1="8" x2="100" y2="30" stroke-width="3"/><rect class="g-yumusak g-cizgi" x="62" y="30" width="76" height="236" rx="10" stroke-width="2"/>`;
    for (let v = 0; v <= max + 1e-9; v += adim) {
      const ana = Math.abs(v / etiketAdim - Math.round(v / etiketAdim)) < 1e-9;
      ic += `<line class="g-cizgi" x1="${ana ? 96 : 104}" y1="${yk(v)}" x2="122" y2="${yk(v)}"/>`;
      if (ana) ic += G.yazi(90, yk(v) + 5, od(v), { a: "end", k: 1 });
    }
    ic += `<rect class="g-d" x="122" y="${yk(deger) - 3}" width="24" height="6" rx="2"/>`;
    ic += `<line class="g-cizgi" x1="100" y1="266" x2="100" y2="286" stroke-width="2"/><rect class="g-b g-cizgi" x="76" y="286" width="48" height="30" rx="4"/>` + G.yazi(100, 306, "?", { b: 1 });
    ic += G.yazi(170, 40, "N", { k: 1 });
    return G.svg(200, 325, ic, "dinamometre");
  }

  /* Yol–zaman çizgi grafiği. seriler: [{ ad, nokta: [[t, x], ...], kesik }] */
  function grafik({ seriler, xMax, yMax, xAdim, yAdim, xEt = "zaman (s)", yEt = "yol (m)" }) {
    const W = 460, H = 270, sol = 58, alt = 44, ust = 26, sag = 70;
    const xk = v => sol + (W - sol - sag) * v / xMax, yk = v => H - alt - (H - alt - ust) * v / yMax;
    let ic = "";
    for (let v = 0; v <= xMax + 1e-9; v += xAdim) ic += `<line class="g-ince" x1="${xk(v)}" y1="${yk(0)}" x2="${xk(v)}" y2="${yk(yMax)}"/>` + G.yazi(xk(v), yk(0) + 18, od(v), { k: 1 });
    for (let v = 0; v <= yMax + 1e-9; v += yAdim) ic += `<line class="g-ince" x1="${xk(0)}" y1="${yk(v)}" x2="${xk(xMax)}" y2="${yk(v)}"/>` + (v ? G.yazi(xk(0) - 6, yk(v) + 4, od(v), { a: "end", k: 1 }) : "");
    ic += G.ok(xk(0), yk(0), xk(xMax) + 26, yk(0)) + G.ok(xk(0), yk(0), xk(0), yk(yMax) - 20);
    ic += G.yazi(xk(xMax) + 24, yk(0) + 34, xEt, { a: "end", k: 1 }) + G.yazi(xk(0) + 8, ust - 8, yEt, { a: "start", k: 1 });
    seriler.forEach(s => {
      ic += `<polyline class="g-cizgi" fill="none" stroke-width="3"${s.kesik ? ' stroke-dasharray="8 5"' : ""} points="${s.nokta.map(([a, b]) => xk(a) + "," + yk(b)).join(" ")}"/>`;
      s.nokta.forEach(([a, b]) => { ic += `<circle class="g-a g-cizgi" cx="${xk(a)}" cy="${yk(b)}" r="4"/>`; });
      if (s.ad) { const [a, b] = s.nokta[s.nokta.length - 1]; ic += G.yazi(xk(a) + 10, yk(b) + 5, s.ad, { a: "start", b: 1 }); }
    });
    return G.svg(W, H, ic, "yol–zaman grafiği");
  }

  /* İki şeritte iki araç ve hareket yönleri */
  function ikiArac(a, b) {
    let ic = `<line class="g-ince" x1="20" y1="60" x2="580" y2="60"/><line class="g-ince" x1="20" y1="140" x2="580" y2="140"/>`;
    [[a, 40], [b, 120]].forEach(([o, y]) => {
      const sag = o.yon === "doğu", x = 300;
      ic += `<text x="${x}" y="${y + 10}" font-size="30" text-anchor="middle">${o.simge}</text>` + G.yazi(30, y + 6, o.ad, { b: 1, a: "start" });
      ic += G.ok(sag ? x + 30 : x - 30, y, sag ? x + 150 : x - 150, y) + G.yazi(sag ? x + 100 : x - 100, y - 10, o.v + " m/s", { k: 1 });
    });
    ic += G.yazi(560, 185, "doğu →", { k: 1, a: "end" }) + G.yazi(40, 185, "← batı", { k: 1, a: "start" });
    return G.svg(600, 195, ic, "iki aracın hareket yönleri");
  }

  /* ============================== GÜNEŞ SİSTEMİ ============================== */
  KONU_EKLE("fen", {
    id: "f_gunes", tema: "f1", ad: "Güneş Sistemi",
    kazanimlar: [
      { id: "fgun.gunes", ad: "Güneş'in özelliklerini açıklama" },
      { id: "fgun.gezegen", ad: "Gezegenleri sıralama ve özelliklerine göre karşılaştırma" },
      { id: "fgun.diger", ad: "Güneş sistemindeki diğer gök cisimlerini tanıma" },
    ],
    anlatim: [
      { baslik: "Güneş: Kendi ışığını üreten yıldız",
        metin: "Güneş bir <b>yıldızdır</b>: çok sıcak gazlardan oluşur ve <b>kendi ısısını ve ışığını üretir</b>. Güneş sisteminin <b>merkezindedir</b> ve sistemdeki en büyük gök cismidir. Dünya'ya en yakın yıldız olduğu için gökyüzünde diğer yıldızlardan çok daha büyük ve parlak görünür.<br>Gezegenler ve uydular ise ışık üretmez; Güneş'ten aldıkları ışığı yansıttıkları için görünürler.",
        ornek: "Gece gökyüzünde parlak görünen Ay bir ışık kaynağı değildir; üzerine düşen Güneş ışığını yansıtır. Güneş ise ışık kaynağıdır.",
        durak: { soru: "Güneş'i bir yıldız yapan özellik hangisidir?", secenekler: [
          ["Kendi ısısını ve ışığını üretmesi", true, "Yıldızların temel özelliği ışık ve ısıyı kendilerinin üretmesidir."],
          ["Gökyüzünde parlak görünmesi", false, "Ay ve Venüs de parlak görünür ama ışığı yansıtırlar; parlak görünmek yetmez."],
          ["Doğudan doğup batıdan batması", false, "Bu, Dünya'nın kendi ekseni etrafında dönmesinin sonucudur."],
          ["Etrafında uyduların dolanması", false, "Uydular gezegenlerin çevresinde dolanır; bu yıldız olmanın ölçütü değildir."]] } },
      { baslik: "Gezegenler ve sıralaması",
        metin: "Güneş'in çevresinde belirli yörüngelerde dolanan sekiz gezegen vardır. Güneş'e yakınlığa göre sıralama: <b>Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs, Neptün</b>.<br>En küçük gezegen <b>Merkür</b>, en büyük gezegen <b>Jüpiter</b>dir. Gezegen Güneş'ten uzaklaştıkça yörüngesi uzar, Güneş çevresindeki bir turu daha uzun sürer.",
        ornek: "Sıralamayı hatırlamak için ilk harfleri kullanabilirsin: M-V-D-M-J-S-U-N.",
        gorsel: gezegenler({ etiket: "isim", kusak: true }),
        durak: { soru: "Güneş'e en uzak gezegen hangisidir?", secenekler: [
          ["Neptün", true, "Sıralamanın son gezegeni Neptün'dür."],
          ["Jüpiter", false, "Jüpiter en büyük gezegendir ama beşinci sıradadır."],
          ["Uranüs", false, "Uranüs yedinci sıradadır; ondan sonra Neptün gelir."],
          ["Satürn", false, "Satürn altıncı sıradadır."]] } },
      { baslik: "İç ve dış gezegenler",
        metin: "Asteroit kuşağının içinde kalan <b>Merkür, Venüs, Dünya ve Mars</b> iç gezegenlerdir. Bunlar <b>karasal</b> (kayalık) yapıdadır, küçüktür ve halkaları yoktur.<br>Kuşağın dışındaki <b>Jüpiter, Satürn, Uranüs ve Neptün</b> dış gezegenlerdir. Bunlar <b>gazsal</b> yapıdadır, çok büyüktür, halkaları ve çok sayıda uydusu vardır. Halkaları en belirgin olan gezegen Satürn'dür.<br>Merkür ve Venüs'ün uydusu yoktur; Dünya'nın 1, Mars'ın 2 uydusu vardır.",
        ornek: "Venüs, Merkür'den daha uzakta olduğu hâlde en sıcak gezegendir; çünkü kalın atmosferi ısıyı tutar.",
        gorsel: G.tablo(["Özellik", "İç gezegenler", "Dış gezegenler"], [["Yapı", "Karasal (kayalık)", "Gazsal"], ["Büyüklük", "Küçük", "Büyük"], ["Halka", "Yok", "Var"], ["Uydu", "Az ya da hiç yok", "Çok sayıda"]]),
        durak: { soru: "Aşağıdakilerden hangisi dış gezegenlerin ortak özelliğidir?", secenekler: [
          ["Gazsal yapıda olmaları ve halkalarının bulunması", true, "Jüpiter, Satürn, Uranüs ve Neptün gazsaldır ve halkaları vardır."],
          ["Kayalık bir yüzeylerinin olması", false, "Kayalık yapı iç gezegenlerin özelliğidir."],
          ["Uydularının olmaması", false, "Dış gezegenlerin çok sayıda uydusu vardır; uydusu olmayanlar Merkür ve Venüs'tür."],
          ["Dünya'dan küçük olmaları", false, "Dış gezegenlerin hepsi Dünya'dan çok daha büyüktür."]] } },
      { baslik: "Güneş sistemindeki diğer gök cisimleri",
        metin: "<b>Uydu:</b> Bir gezegenin çevresinde dolanan gök cismi (Ay, Dünya'nın uydusudur).<br><b>Asteroit kuşağı:</b> Mars ile Jüpiter arasında, Güneş'in çevresinde dolanan çok sayıda kaya ve metal parçasının oluşturduğu kuşak.<br><b>Göktaşı:</b> Uzayda dolaşan küçük kaya ya da metal parçaları. Atmosfere girip sürtünmeyle yanarken bıraktığı ışık izine <b>meteor</b> (halk arasında “yıldız kayması”) denir. Atmosferde tamamen yanmadan yeryüzüne ulaşan parçaya <b>meteorit</b> denir.<br><b>Kuyruklu yıldız:</b> Buz, toz ve gazdan oluşur. Güneş'e yaklaştıkça buzları buharlaşır ve <b>Güneş'in tersi yönünde</b> uzanan bir kuyruk oluşur.",
        ornek: "“Yıldız kayması” aslında bir yıldız değildir; atmosferde yanan küçük bir göktaşının bıraktığı ışık izidir.",
        durak: { soru: "Atmosferde tamamen yanmayıp yeryüzüne düşen göktaşı parçasına ne denir?", secenekler: [
          ["Meteorit", true, "Yeryüzüne ulaşan parçaya meteorit denir."],
          ["Meteor", false, "Meteor, atmosferde yanarken oluşan ışık izidir; yere ulaşan parça değildir."],
          ["Kuyruklu yıldız", false, "Kuyruklu yıldız buz, toz ve gazdan oluşan, Güneş'in çevresinde dolanan bir gök cismidir."],
          ["Uydu", false, "Uydu, bir gezegenin çevresinde dolanan gök cismidir."]] } },
    ],
    uret: {
      "fgun.gunes": [
        Q("fgun.gunes", "hatirlama", 1, "Güneş hangi tür gök cismidir?", "Yıldız",
          [["Gezegen", "bilgi", "Gezegenler ışık üretmez ve bir yıldızın çevresinde dolanır; Güneş ise sistemin merkezindeki yıldızdır."],
           ["Uydu", "bilgi", "Uydular gezegenlerin çevresinde dolanır; Güneş bir gezegenin çevresinde dolanmaz."],
           ["Kuyruklu yıldız", "dikkat", "Adında “yıldız” geçse de kuyruklu yıldız ışık üretmeyen buz ve toz yığınıdır."]],
          "Kendi ışığını üreten gök cisimlerine ne ad verilir?",
          ["Güneş kendi ısısını ve ışığını üretir.", "Kendi ışığını üreten gök cisimleri yıldızdır.", "Bu yüzden Güneş bir yıldızdır."],
          { kural: "Yıldızlar ışık ve ısı üretir; gezegenler ve uydular ışığı yansıtır." }),
        Q("fgun.gunes", "hatirlama", 1, "Güneş sisteminin merkezinde hangi gök cismi bulunur?", "Güneş",
          [["Dünya", "bilgi", "Dünya, Güneş'in çevresinde dolanan üçüncü gezegendir; merkezde değildir."],
           ["Jüpiter", "kavrama", "Jüpiter en büyük gezegendir ama o da Güneş'in çevresinde dolanır."],
           ["Ay", "bilgi", "Ay, Dünya'nın uydusudur; Dünya'nın çevresinde dolanır."]],
          "Sistemin adı sana ipucu veriyor.",
          ["Gezegenler, asteroitler ve kuyruklu yıldızlar bir merkez etrafında dolanır.", "Bu merkez, sistemin tek yıldızı olan Güneş'tir."],
          { kural: "Güneş sistemi: merkezde Güneş, çevresinde dolanan gezegenler, uydular ve diğer gök cisimleri." }),
        Q("fgun.gunes", "aciklama", 2, "Güneş'in yıldız olduğunu gösteren özelliği hangisidir?", "Kendi ısısını ve ışığını üretmesi",
          [["Çok büyük olması", "kavrama", "Büyüklük yıldız olmanın ölçütü değildir; Jüpiter de büyüktür ama ışık üretmez."],
           ["Gündüz gökyüzünde parlak görünmesi", "kavrama", "Ay da gündüz görülebilir ve parlak görünür; ama ışığı yansıtır."],
           ["Doğudan doğup batıdan batması", "bilgi", "Bu görünüm, Dünya'nın kendi ekseni etrafında dönmesinden kaynaklanır."]],
          "Yıldızları gezegenlerden ayıran temel fark nedir?",
          ["Yıldızlar ışık kaynağıdır; ışığı kendileri üretir.", "Güneş de kendi ısısını ve ışığını ürettiği için yıldızdır."],
          { kural: "Işık kaynağı olan gök cismi = yıldız." }),
        Q("fgun.gunes", "aciklama", 2, "Güneş, gece gördüğümüz yıldızlardan çok daha büyük ve parlak görünür. Bunun nedeni nedir?", "Dünya'ya en yakın yıldız olması",
          [["Evrendeki en büyük yıldız olması", "kavrama", "Güneş orta büyüklükte bir yıldızdır; ondan çok daha büyük yıldızlar vardır."],
           ["Diğer yıldızların ışık üretmemesi", "bilgi", "Bütün yıldızlar ışık üretir; çok uzakta oldukları için sönük görünürler."],
           ["Gündüz görülmesi", "dikkat", "Gündüz görülmesi parlaklığın nedeni değil, sonucudur."]],
          "Uzaktaki bir sokak lambası ile yanındaki lambayı karşılaştır.",
          ["Bir ışık kaynağı ne kadar yakınsa o kadar büyük ve parlak görünür.", "Güneş, Dünya'ya en yakın yıldızdır.", "Bu yüzden diğer yıldızlardan büyük ve parlak görünür."],
          { kural: "Güneş orta büyüklükte bir yıldızdır; bize en yakın yıldız olduğu için büyük görünür." }),
        Q("fgun.gunes", "uygulama", 2, "Tabloda dört gök cisminin bazı özellikleri verilmiştir. Hangisi <b>Güneş</b> olabilir?", "K",
          [["L", "kavrama", "L katı yüzeyli ve ışık üretmiyor; bu bir gezegen ya da uydu olabilir."],
           ["M", "kavrama", "M gazlardan oluşuyor ama ışık üretmiyor; bu, Jüpiter gibi gazsal bir gezegen olabilir."],
           ["N", "dikkat", "N ışık üretmiyor ve bir gezegenin çevresinde dolanıyor; bu bir uydudur."]],
          "Işık üreten tek gök cismini bul.",
          ["Güneş kendi ışığını üretir ve sıcak gazlardan oluşur.", "Tabloda ışık üreten tek gök cismi K'dir.", "Bu yüzden Güneş K olabilir."],
          { gorsel: G.tablo(["Gök cismi", "Kendi ışığını üretir", "Katı yüzeyi var", "Bir gezegenin çevresinde dolanır"], [["K", "Evet", "Hayır", "Hayır"], ["L", "Hayır", "Evet", "Hayır"], ["M", "Hayır", "Hayır", "Hayır"], ["N", "Hayır", "Evet", "Evet"]]),
            kural: "Güneş: ışık kaynağı, sıcak gazlardan oluşan, sistemin merkezindeki yıldız." }),
        Q("fgun.gunes", "transfer", 2, "Güneş'ten çıkan ışık Dünya'ya yaklaşık 8 dakikada ulaşır. Buna göre Güneş'e baktığımızda gördüğümüz ışık ne zaman Güneş'ten yola çıkmıştır?", "Yaklaşık 8 dakika önce",
          [["Aynı anda", "kavrama", "Işık çok hızlıdır ama anında ulaşmaz; yolculuğu yaklaşık 8 dakika sürer."],
           ["Yaklaşık 8 saat önce", "dikkat", "Süre dakika olarak verilmiştir, saat değil."],
           ["Yaklaşık 8 gün önce", "dikkat", "Verilen süreyi doğru birimle oku: 8 dakika."]],
          "Işığın yolculuğu ne kadar sürüyor?",
          ["Işık Güneş'ten Dünya'ya yaklaşık 8 dakikada gelir.", "O hâlde şu an gözümüze ulaşan ışık, yaklaşık 8 dakika önce Güneş'ten çıkmıştır."],
          { kural: "Güneş, Dünya'dan yaklaşık 150 milyon km uzaktadır; ışığı bize yaklaşık 8 dakikada ulaşır." }),
        Q("fgun.gunes", "baglanti", 3, "Gece gökyüzünde Ay ve Venüs çok parlak görünür. Bu gök cisimlerinin görünmesini sağlayan nedir?", "Güneş'ten aldıkları ışığı yansıtmaları",
          [["Kendi ışıklarını üretmeleri", "kavrama", "Ay ve gezegenler ışık kaynağı değildir; yalnızca yıldızlar ışık üretir."],
           ["Sıcak gazlardan oluşmaları", "bilgi", "Ay ve Venüs kayalık yapıdadır; sıcak gazlardan oluşan Güneş'tir."],
           ["Dünya'daki ışıkları yansıtmaları", "dikkat", "Onlara ulaşan asıl ışık Güneş'ten gelir."]],
          "Işık ünitesini hatırla: Işık kaynağı olmayan cisimleri nasıl görürüz?",
          ["Bir cismi görmemiz için ışığın o cisimden gözümüze gelmesi gerekir.", "Ay ve Venüs ışık üretmez; üzerlerine düşen Güneş ışığını yansıtırlar.", "Yansıyan ışık gözümüze ulaşınca onları parlak görürüz."],
          { kural: "Işık kaynağı olmayan cisimler, üzerlerine düşen ışığı yansıttıkları için görünür." }),
        Q("fgun.gunes", "hatirlama", 1, "Güneş ile ilgili aşağıdakilerden hangisi <b>yanlıştır</b>?", "Katı ve kayalık bir yüzeyi vardır.",
          [["Güneş sisteminin en büyük gök cismidir.", "bilgi", "Bu doğrudur; Güneş sistemdeki tüm gezegenlerden çok daha büyüktür."],
           ["Kendi ısısını ve ışığını üretir.", "bilgi", "Bu doğrudur; Güneş bir ışık kaynağıdır."],
           ["Dünya'ya en yakın yıldızdır.", "bilgi", "Bu doğrudur; bu yüzden büyük ve parlak görünür."]],
          "Güneş neyden oluşur?",
          ["Güneş çok sıcak gazlardan oluşan bir yıldızdır.", "Katı, kayalık yüzey karasal gezegenlerin özelliğidir.", "Yanlış olan ifade “katı ve kayalık bir yüzeyi vardır” ifadesidir."],
          { kural: "Güneş sıcak gazlardan oluşur; katı bir yüzeyi yoktur." }),
      ],
      "fgun.gezegen": [
        z => { const i = R(0, 7), n = i + 1;
          const aday = [[GEZEGEN[i + 1], "dikkat", "Bir sıra fazla saydın; saymaya Merkür'den başla."], [GEZEGEN[i - 1], "dikkat", "Bir sıra eksik saydın; saymaya Merkür'den başla."],
            [GEZEGEN[7 - i], "strateji", "Sıralamayı Neptün'den, yani sondan saydın; sıra Güneş'ten başlar."], [GEZEGEN[(i + 3) % 8], "bilgi", "Gezegenlerin sırasını yeniden hatırla: Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs, Neptün."],
            [GEZEGEN[(i + 5) % 8], "bilgi", "Bu gezegen o sırada değildir; sıralamayı baştan say."]].filter(a => a[0]);
          return S({ kaz: "fgun.gezegen", duzey: "hatirlama", zorluk: 1, soru: `Şekilde gezegenler Güneş'e yakınlıklarına göre numaralandırılmıştır. <b>${n}.</b> sıradaki gezegen hangisidir?`,
            gorsel: gezegenler({ etiket: "sira", kusak: true }), dogru: GEZEGEN[i], yanlis: aday,
            ipucu: "M-V-D-M-J-S-U-N kısaltmasını kullan.", cozum: ["Güneş'e yakınlık sırası: Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs, Neptün.", `Baştan saydığımızda ${n}. sırada ${GEZEGEN[i]} vardır.`],
            kural: "Sıralama: Merkür, Venüs, Dünya, Mars | asteroit kuşağı | Jüpiter, Satürn, Uranüs, Neptün." }); },
        z => { const h = karistir("KLMNPRST".split("")).join(""), i = R(0, 7);
          const yan = karistir([0, 1, 2, 3, 4, 5, 6, 7].filter(j => j !== i)).slice(0, 3).map(j => [h[j], Math.abs(j - i) === 1 ? "dikkat" : "bilgi", `${h[j]} harfiyle gösterilen gezegen ${GEZEGEN[j]}; bu gezegen ${j + 1}. sıradadır.`]);
          return S({ kaz: "fgun.gezegen", duzey: "uygulama", zorluk: 2, soru: `Şekilde Güneş ve gezegenler harflerle gösterilmiştir. Hangi harf <b>${GEZEGEN[i]}</b> gezegenini gösterir?`,
            gorsel: gezegenler({ etiket: "harf", harfler: h }), dogru: h[i], yanlis: yan,
            ipucu: "Önce gezegenin kaçıncı sırada olduğunu bul, sonra Güneş'ten başlayarak say.",
            cozum: [`${GEZEGEN[i]}, Güneş'e yakınlık sırasına göre ${i + 1}. gezegendir.`, `Güneş'ten başlayarak ${i + 1}. gezegeni sayınca ${h[i]} harfine ulaşırız.`, i === 5 ? "Ayrıca halkasının belirgin çizilmesi de Satürn olduğunu gösterir." : `Cevap: ${h[i]}.`],
            kural: "En büyük gezegen Jüpiter, halkaları en belirgin olan Satürn, en küçük gezegen Merkür'dür." }); },
        Q("fgun.gezegen", "hatirlama", 1, "Güneş sistemindeki en büyük gezegen hangisidir?", "Jüpiter",
          [["Satürn", "kavrama", "Satürn'ün halkaları onu büyük gösterir ama ikinci büyük gezegendir."],
           ["Neptün", "kavrama", "Neptün en uzak gezegendir; en uzak olmak en büyük olmak demek değildir."],
           ["Dünya", "bilgi", "Dünya bir iç gezegendir; dış gezegenlerin hepsi Dünya'dan büyüktür."]],
          "Dış gezegenlerin en büyüğünü düşün.",
          ["Dış gezegenler iç gezegenlerden çok büyüktür.", "Bunların içinde en büyüğü Jüpiter'dir."],
          { kural: "En büyük gezegen Jüpiter, en küçük gezegen Merkür." }),
        Q("fgun.gezegen", "hatirlama", 1, "Güneş sistemindeki en küçük gezegen hangisidir?", "Merkür",
          [["Mars", "bilgi", "Mars küçük bir gezegendir ama Merkür ondan da küçüktür."],
           ["Ay", "kavrama", "Ay bir gezegen değil, Dünya'nın uydusudur."],
           ["Neptün", "kavrama", "Neptün en uzak gezegendir ama küçük değildir; Dünya'dan çok büyüktür."]],
          "Güneş'e en yakın gezegen aynı zamanda en küçüğüdür.",
          ["Gezegenlerin büyüklüklerini karşılaştır.", "En küçük gezegen Güneş'e en yakın olan Merkür'dür."],
          { kural: "Merkür: Güneş'e en yakın ve en küçük gezegen." }),
        Q("fgun.gezegen", "aciklama", 2, "İç gezegenlerin ortak özelliği hangisidir?", "Karasal (kayalık) yapıda ve küçük olmaları",
          [["Halkalarının bulunması", "bilgi", "Halkalar dış gezegenlerde bulunur."],
           ["Çok sayıda uydularının olması", "bilgi", "Merkür ve Venüs'ün hiç uydusu yoktur; Dünya'nın 1, Mars'ın 2 uydusu vardır."],
           ["Gazsal yapıda olmaları", "kavrama", "Gazsal yapı dış gezegenlerin özelliğidir."]],
          "İç gezegenler: Merkür, Venüs, Dünya, Mars.",
          ["İç gezegenler asteroit kuşağının içinde kalan dört gezegendir.", "Hepsi kayalık (karasal) yapıdadır ve dış gezegenlerden küçüktür."],
          { kural: "İç = karasal, küçük, halkasız. Dış = gazsal, büyük, halkalı, çok uydulu." }),
        z => { const SAT = { Venüs: ["İç", "Kayalık", "Yok", "0"], Dünya: ["İç", "Kayalık", "Yok", "1"], Mars: ["İç", "Kayalık", "Yok", "2"], Jüpiter: ["Dış", "Gazsal", "Var", "Çok sayıda"] };
          const adlar = Object.keys(SAT), hedef = sec(adlar), harf = karistir(["K", "L", "M", "N"]);
          const satir = adlar.map((a, j) => [harf[j]].concat(SAT[a])).sort((x, y) => x[0] < y[0] ? -1 : 1);
          const dH = harf[adlar.indexOf(hedef)];
          const yan = adlar.filter(a => a !== hedef).map(a => [harf[adlar.indexOf(a)], a === "Jüpiter" || hedef === "Jüpiter" ? "kavrama" : "dikkat", `${harf[adlar.indexOf(a)]} gezegeninin özellikleri ${a} gezegenine uyar.`]);
          const ipucu = hedef === "Jüpiter" ? "Gazsal ve halkalı olan gezegeni bul." : "Uydu sayısına dikkat et.";
          const neden = { Venüs: "Venüs'ün uydusu yoktur.", Dünya: "Dünya'nın tek uydusu Ay'dır.", Mars: "Mars'ın 2 uydusu vardır.", Jüpiter: "Jüpiter gazsal bir dış gezegendir, halkası ve çok sayıda uydusu vardır." }[hedef];
          return S({ kaz: "fgun.gezegen", duzey: "uygulama", zorluk: 2, soru: `Tabloda dört gezegenin bazı özellikleri verilmiştir. Hangisi <b>${hedef}</b> olabilir?`,
            gorsel: G.tablo(["Gezegen", "İç / dış", "Yapı", "Halka", "Uydu sayısı"], satir), dogru: dH, yanlis: yan, ipucu,
            cozum: [hedef === "Jüpiter" ? "Jüpiter bir dış gezegendir." : `${hedef} bir iç gezegendir; kayalıktır ve halkası yoktur.`, neden, `Bu özelliklere uyan satır ${dH} satırıdır.`],
            kural: "Uydusu olmayan gezegenler: Merkür ve Venüs. Dünya'nın 1, Mars'ın 2 uydusu vardır." }); },
        Q("fgun.gezegen", "aciklama", 3, "Neptün'ün Güneş çevresindeki bir turu, Dünya'nınkinden çok daha uzun sürer. Bunun temel nedeni nedir?", "Güneş'e çok uzak olduğu için yörüngesinin çok uzun olması",
          [["Dünya'dan büyük olması", "kavrama", "Dolanma süresini büyüklük değil, Güneş'e olan uzaklık belirler; Jüpiter Neptün'den büyüktür ama turu daha kısa sürer."],
           ["Gazsal yapıda olması", "kavrama", "Yapının dolanma süresiyle ilgisi yoktur."],
           ["Çok sayıda uydusu olması", "bilgi", "Uydular gezegenin Güneş çevresindeki dolanma süresini belirlemez."]],
          "Koşu pistinde dış kulvarda koşan kişinin turu neden daha uzun sürer?",
          ["Gezegen Güneş'ten uzaklaştıkça yörüngesi büyür.", "Büyük yörüngede bir tur atmak daha uzun sürer.", "Neptün en dıştaki gezegen olduğu için turu en uzun süren gezegendir."],
          { kural: "Güneş'e uzaklık arttıkça bir yılın (Güneş çevresindeki bir turun) süresi uzar." }),
        Q("fgun.gezegen", "transfer", 3, "Dünya'dan fırlatılan bir uzay aracı, Güneş'ten uzaklaşacak biçimde Neptün'e doğru gidiyor. Araç yolda sırasıyla hangi gezegenlerin yörüngelerinden geçer?", "Mars, Jüpiter, Satürn, Uranüs",
          [["Venüs, Merkür, Jüpiter, Satürn", "kavrama", "Araç Güneş'ten uzaklaşıyor; Venüs ve Merkür Dünya'dan daha içtedir."],
           ["Jüpiter, Mars, Satürn, Uranüs", "dikkat", "Mars, Jüpiter'den önce gelir; sırayı karıştırdın."],
           ["Mars, Satürn, Jüpiter, Uranüs", "dikkat", "Jüpiter, Satürn'den önce gelir."]],
          "Dünya'dan sonra gelen gezegenleri sırayla yaz.",
          ["Dünya üçüncü gezegendir; dışarı doğru gidildiğinde ondan sonraki gezegenler geçilir.", "Dünya'dan sonra: Mars, (asteroit kuşağı), Jüpiter, Satürn, Uranüs ve en son Neptün.", "Neptün hedef olduğu için yolda geçilen yörüngeler: Mars, Jüpiter, Satürn, Uranüs."],
          { kural: "Güneş'ten dışarı doğru: Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs, Neptün." }),
        Q("fgun.gezegen", "transfer", 2, "Grafikte gezegenlerin çaplarının Dünya'nın çapının yaklaşık kaç katı olduğu verilmiştir (Dünya = 1). Grafiğe göre hangisi <b>doğrudur</b>?", "Uranüs ile Neptün'ün büyüklükleri birbirine yakındır.",
          [["Satürn en büyük gezegendir.", "dikkat", "Grafikte en uzun sütun Jüpiter'e aittir."],
           ["İç gezegenler dış gezegenlerden büyüktür.", "kavrama", "İlk dört sütun (iç gezegenler) en kısa sütunlardır."],
           ["Venüs, Dünya'dan çok daha büyüktür.", "dikkat", "Venüs ile Dünya'nın sütunları neredeyse eşittir; büyüklükleri yakındır."]],
          "Sütunların uzunluklarını karşılaştır.",
          ["Jüpiter'in sütunu en uzundur; en büyük gezegen Jüpiter'dir.", "İç gezegenlerin sütunları kısa, dış gezegenlerinki uzundur.", "Uranüs ile Neptün'ün sütunları hemen hemen aynı uzunluktadır; doğru ifade budur."],
          { gorsel: G.sutun([["Merkür", 0.4], ["Venüs", 1], ["Dünya", 1], ["Mars", 0.5], ["Jüpiter", 11], ["Satürn", 9.5], ["Uranüs", 4], ["Neptün", 3.9]], { baslik: "Çapın Dünya'ya göre kaç katı olduğu" }),
            kural: "Venüs ile Dünya ikiz gibi benzer büyüklüktedir; Uranüs ile Neptün de birbirine yakın büyüklüktedir." }),
        Q("fgun.gezegen", "baglanti", 3, "Venüs, Merkür'den Güneş'e daha uzak olduğu hâlde Güneş sisteminin en sıcak gezegenidir. Bunun nedeni nedir?", "Kalın atmosferinin ısıyı tutması (sera etkisi)",
          [["Güneş'e en yakın gezegen olması", "bilgi", "Güneş'e en yakın gezegen Merkür'dür, Venüs değil."],
           ["Kendi ışığını ve ısısını üretmesi", "kavrama", "Gezegenler ısı ve ışık üretmez; bunu yalnızca yıldızlar yapar."],
           ["En büyük gezegen olması", "bilgi", "En büyük gezegen Jüpiter'dir; Venüs Dünya büyüklüğündedir."]],
          "Atmosferdeki gazların ısıyı tutmasına ne ad verilir? (Sürdürülebilir yaşam ünitesi)",
          ["Merkür'ün atmosferi yok denecek kadar incedir; ısı uzaya kaçar.", "Venüs'ün çok kalın atmosferi ısıyı tutar; buna sera etkisi denir.", "Bu yüzden Venüs, Merkür'den uzak olduğu hâlde daha sıcaktır."],
          { kural: "Sera etkisi: Atmosferdeki gazlar ısıyı tutar. Aşırı sera etkisi Dünya'da küresel ısınmaya yol açar." }),
        Q("fgun.gezegen", "hatirlama", 2, "Uydusu olmayan gezegenler hangileridir?", "Merkür ve Venüs",
          [["Dünya ve Mars", "bilgi", "Dünya'nın bir uydusu (Ay), Mars'ın iki uydusu vardır."],
           ["Jüpiter ve Satürn", "kavrama", "Dış gezegenlerin çok sayıda uydusu vardır."],
           ["Uranüs ve Neptün", "kavrama", "Uranüs ve Neptün de çok sayıda uyduya sahip dış gezegenlerdir."]],
          "Güneş'e en yakın iki gezegeni düşün.",
          ["Gezegenlerin uydu sayıları farklıdır.", "Güneş'e en yakın iki gezegen olan Merkür ve Venüs'ün hiç uydusu yoktur."],
          { kural: "Uydusuz: Merkür, Venüs. Dünya: 1 uydu (Ay). Mars: 2 uydu." }),
      ],
      "fgun.diger": [
        Q("fgun.diger", "hatirlama", 1, "Bir gezegenin çevresinde dolanan gök cismine ne ad verilir?", "Uydu",
          [["Yıldız", "bilgi", "Yıldızlar ışık üretir; gezegenler yıldızların çevresinde dolanır, tersi değil."],
           ["Asteroit", "bilgi", "Asteroitler Güneş'in çevresinde dolanan kaya parçalarıdır."],
           ["Meteor", "bilgi", "Meteor, atmosferde yanan göktaşının bıraktığı ışık izidir."]],
          "Ay, Dünya'nın nesidir?",
          ["Ay, Dünya'nın çevresinde dolanır.", "Bir gezegenin çevresinde dolanan gök cisimlerine uydu denir."],
          { kural: "Uydu: gezegenin çevresinde dolanan gök cismi. Ay, Dünya'nın tek doğal uydusudur." }),
        Q("fgun.diger", "hatirlama", 1, "Şekilde iki gezegenin yörüngeleri arasında noktalarla gösterilen bölgede çok sayıda kaya ve metal parçası bulunur. Bu bölgenin adı nedir?", "Asteroit kuşağı",
          [["Samanyolu", "bilgi", "Samanyolu, Güneş sisteminin de içinde bulunduğu galaksinin adıdır."],
           ["Kuyruklu yıldız", "kavrama", "Kuyruklu yıldız tek bir gök cismidir; kuşak oluşturmaz."],
           ["Atmosfer", "bilgi", "Atmosfer, bir gezegeni saran gaz tabakasıdır."]],
          "Bu bölge Mars ile Jüpiter arasındadır.",
          ["Mars ile Jüpiter arasında, Güneş'in çevresinde dolanan çok sayıda kaya ve metal parçası vardır.", "Bu parçalara asteroit, oluşturdukları bölgeye asteroit kuşağı denir."],
          { gorsel: gezegenler({ etiket: "isim", kusak: true, kusakEtiket: "?" }), kural: "Asteroit kuşağı Mars ile Jüpiter arasındadır; iç ve dış gezegenleri ayırır." }),
        Q("fgun.diger", "aciklama", 2, "Gece gökyüzünde aniden beliren ve kısa sürede kaybolan ışık çizgisine halk arasında “yıldız kayması” denir. Bu olay aslında nedir?", "Atmosfere giren bir göktaşının sürtünmeyle yanması (meteor)",
          [["Bir yıldızın yerinden kayıp düşmesi", "kavrama", "Yıldızlar Güneş gibi dev gök cisimleridir ve gökyüzünden kaymaz; bu yaygın bir yanılgıdır."],
           ["Yeryüzüne ulaşmış bir göktaşı parçası (meteorit)", "dikkat", "Meteorit yere düşen parçadır; gökyüzündeki ışık izi meteordur."],
           ["Güneş'e yaklaşan bir kuyruklu yıldız", "bilgi", "Kuyruklu yıldızlar günlerce, haftalarca görülebilir; bir anda kaybolmaz."]],
          "Hızla atmosfere giren küçük bir kaya parçasına ne olur?",
          ["Uzayda dolaşan küçük göktaşları atmosfere çok hızlı girer.", "Hava ile sürtünme sonucu ısınıp yanarlar ve parlak bir iz bırakırlar.", "Bu ışık izine meteor denir; yıldızlarla ilgisi yoktur."],
          { kural: "Meteor = atmosferde yanan göktaşının ışık izi. Meteorit = yere ulaşan parça." }),
        Q("fgun.diger", "hatirlama", 2, "Atmosferde tamamen yanmadan yeryüzüne ulaşan göktaşı parçasına ne ad verilir?", "Meteorit",
          [["Meteor", "kavrama", "Meteor, göktaşı atmosferde yanarken oluşan ışık izidir."],
           ["Asteroit", "bilgi", "Asteroit, asteroit kuşağında Güneş'in çevresinde dolanan kaya parçasıdır."],
           ["Uydu", "bilgi", "Uydu, gezegenin çevresinde dolanan gök cismidir."]],
          "Adının sonundaki “-it” ekini “yere iniş” olarak düşünebilirsin.",
          ["Göktaşlarının çoğu atmosferde yanıp biter.", "Yanmadan yeryüzüne ulaşabilen parçaya meteorit denir."],
          { kural: "Atmosferde yanan: meteor. Yere düşen: meteorit." }),
        z => { const solda = sec([true, false]), harf = karistir(["K", "L", "M", "N"]);
          const di = solda ? 0 : 1, ters = solda ? 1 : 0;
          const yanlis = [[harf[ters], "kavrama", "Bu ok Güneş'e doğru bakıyor; kuyruk Güneş'in itişiyle Güneş'ten uzağa doğru uzanır."],
            [harf[2], "dikkat", "Bu ok Güneş'e göre yana bakıyor; kuyruk Güneş'in tam ters yönündedir."], [harf[3], "dikkat", "Bu ok Güneş'e göre yana bakıyor; kuyruk Güneş'in tam ters yönündedir."]];
          return S({ kaz: "fgun.diger", duzey: "uygulama", zorluk: 2, soru: "Şekilde Güneş'e yaklaşan bir kuyruklu yıldız gösterilmiştir. Kuyruklu yıldızın kuyruğu hangi okla gösterilen yönde oluşur?",
            gorsel: kuyrukluYildiz(solda, harf), dogru: harf[di], yanlis,
            ipucu: "Kuyruk, Güneş'e göre hangi yönde uzanır?",
            cozum: ["Kuyruklu yıldız Güneş'e yaklaşınca buzları buharlaşır, gaz ve toz açığa çıkar.", "Güneş'ten gelen etkiler bu gaz ve tozu Güneş'in ters yönüne iter.", `Bu yüzden kuyruk Güneş'ten uzağa bakan ${harf[di]} oku yönündedir.`],
            kural: "Kuyruklu yıldızın kuyruğu her zaman Güneş'in tersi yönündedir; Güneş'e yaklaştıkça kuyruk uzar." }); },
        Q("fgun.diger", "uygulama", 2, "Tabloda bazı gök cisimleri ve tanımları verilmiştir. Hangi gök cisminin tanımı <b>yanlış</b> yazılmıştır?", "Kuyruklu yıldız",
          [["Asteroit", "dikkat", "Asteroitin tanımı doğrudur: Mars ile Jüpiter arasında kuşak oluşturan kaya parçalarıdır."],
           ["Meteor", "dikkat", "Meteorun tanımı doğrudur: Atmosferde yanan göktaşının bıraktığı ışık izidir."],
           ["Meteorit", "dikkat", "Meteoritin tanımı doğrudur: Yeryüzüne ulaşan göktaşı parçasıdır."]],
          "Hangi tanımda “ışık üreten” ifadesi yanlış kullanılmış?",
          ["Kuyruklu yıldızlar buz, toz ve gazdan oluşur.", "Işık üretmezler; Güneş'e yaklaşınca Güneş ışığını yansıtarak parlak görünürler.", "Bu yüzden “ışık üreten küçük bir yıldız” tanımı yanlıştır."],
          { gorsel: G.tablo(["Gök cismi", "Tanım"], [["Asteroit", "Mars ile Jüpiter arasında kuşak oluşturan kaya ve metal parçaları"], ["Meteor", "Atmosferde sürtünmeyle yanan göktaşının bıraktığı ışık izi"], ["Meteorit", "Atmosferde tamamen yanmadan yeryüzüne ulaşan göktaşı parçası"], ["Kuyruklu yıldız", "Kendi ışığını üreten küçük bir yıldız"]]),
            kural: "Kuyruklu yıldız: buz, toz ve gaz; yıldız değildir." }),
        Q("fgun.diger", "transfer", 2, "Bilim insanları yeryüzünde bulunan meteoritleri büyük bir dikkatle inceler. Meteoritler neden önemlidir?", "Uzaydan geldikleri için Güneş sistemindeki gök cisimlerinin yapısı hakkında bilgi verirler.",
          [["Kendi ışıklarını üretirler.", "bilgi", "Meteoritler kaya ya da metal parçalarıdır; ışık üretmezler."],
           ["Dünya'nın atmosferinde oluşmuşlardır.", "kavrama", "Meteoritler uzaydan gelir; atmosferde oluşmazlar, yalnızca atmosferden geçerler."],
           ["Yeryüzüne her gün büyük parçalar hâlinde düşerler.", "bilgi", "Büyük meteorit düşmesi nadirdir; göktaşlarının çoğu atmosferde yanar."]],
          "Meteorit nereden gelir?",
          ["Meteoritler uzayda dolaşan göktaşlarından kopup yeryüzüne ulaşan parçalardır.", "Uzaya gitmeden uzaydaki maddeyi incelemeyi sağlarlar.", "Bu yüzden Güneş sisteminin yapısı hakkında bilgi verirler."],
          { kural: "Meteoritler, uzaydan gelen “örnekler” gibidir." }),
        Q("fgun.diger", "baglanti", 3, "Ay'ın yüzeyinde çok sayıda krater (çukur) vardır, Dünya'da ise çok azdır. Bunun en önemli nedeni nedir?", "Dünya'nın atmosferinin göktaşlarının çoğunu yakması",
          [["Ay'ın Dünya'dan büyük olması", "bilgi", "Ay, Dünya'dan çok daha küçüktür."],
           ["Dünya'ya hiç göktaşı düşmemesi", "kavrama", "Dünya'ya da göktaşı gelir; ancak çoğu atmosferde yanar."],
           ["Ay'ın kendi ışığını üretmesi", "kavrama", "Ay ışık üretmez; ayrıca bunun kraterlerle ilgisi yoktur."]],
          "Ay'ın bir atmosferi var mıdır?",
          ["Ay'ın atmosferi yoktur; göktaşları hiç yanmadan yüzeyine çarpar ve krater açar.", "Dünya'nın atmosferi, giren göktaşlarının çoğunu sürtünmeyle yakar (meteor).", "Bu yüzden Dünya'da krater sayısı çok azdır."],
          { kural: "Atmosfer, Dünya'yı göktaşlarına karşı koruyan bir kalkan gibidir." }),
      ],
    },
  });

  /* ========================== GÜNEŞ VE AY TUTULMALARI ========================== */
  KONU_EKLE("fen", {
    id: "f_tutulma", tema: "f1", ad: "Güneş ve Ay Tutulmaları",
    kazanimlar: [
      { id: "ftut.gunes", ad: "Güneş tutulmasının nasıl oluştuğunu açıklama" },
      { id: "ftut.ay", ad: "Ay tutulmasının nasıl oluştuğunu açıklama" },
      { id: "ftut.model", ad: "Tutulmaları model üzerinde gösterme, karşılaştırma ve güvenli gözlem" },
    ],
    anlatim: [
      { baslik: "Güneş tutulması",
        metin: "<b>Ay, Güneş ile Dünya'nın arasına girip</b> üçü aynı doğru üzerinde sıralandığında Ay'ın gölgesi Dünya'ya düşer. Gölgedeki bölgelerden Güneş kısmen ya da tamamen görülemez. Buna <b>Güneş tutulması</b> denir.<br>Güneş tutulması <b>yeni ay</b> evresinde ve <b>gündüz</b> olur. Ay'ın <b>tam gölgesinde</b> kalan yerlerde <b>tam</b>, <b>yarı gölgesinde</b> kalan yerlerde <b>parçalı</b> Güneş tutulması görülür. Ay küçük olduğu için gölgesi Dünya'nın yalnızca dar bir bölgesine düşer.",
        ornek: "Dizilim: Güneş – Ay – Dünya. Ay ortada!",
        gorsel: dizilim(["G", "A", "D"]),
        durak: { soru: "Güneş tutulması hangi Ay evresinde gerçekleşir?", secenekler: [
          ["Yeni ay", true, "Ay, Güneş ile Dünya arasında olduğunda Dünya'ya bakan yüzü karanlıktır: yeni ay."],
          ["Dolunay", false, "Dolunayda Dünya ortadadır; bu, Ay tutulmasının olabildiği evredir."],
          ["İlk dördün", false, "İlk dördünde Güneş, Dünya ve Ay aynı doğru üzerinde değildir."],
          ["Son dördün", false, "Son dördünde de üçü aynı doğru üzerinde değildir."]] } },
      { baslik: "Ay tutulması",
        metin: "<b>Dünya, Güneş ile Ay'ın arasına girip</b> üçü aynı doğru üzerinde sıralandığında Dünya'nın gölgesi Ay'ın üzerine düşer. Ay kısmen ya da tamamen kararır. Buna <b>Ay tutulması</b> denir.<br>Ay tutulması <b>dolunay</b> evresinde ve <b>gece</b> olur. Dünya'nın gölgesi çok büyük olduğu için Ay tutulması daha uzun sürer ve Dünya'nın gece yaşanan tüm bölgelerinden görülebilir. Ay ışık üretmediği için Ay tutulması <b>çıplak gözle güvenle</b> izlenebilir.",
        ornek: "Dizilim: Güneş – Dünya – Ay. Dünya ortada!",
        gorsel: dizilim(["G", "D", "A"]),
        durak: { soru: "Ay tutulmasında Ay'ın kararmasının nedeni nedir?", secenekler: [
          ["Dünya'nın gölgesinin Ay'ın üzerine düşmesi", true, "Dünya, Güneş ışığının Ay'a ulaşmasını engeller."],
          ["Ay'ın gölgesinin Dünya'ya düşmesi", false, "Bu, Güneş tutulmasında olur."],
          ["Ay'ın ışık üretmeyi bırakması", false, "Ay zaten ışık üretmez; Güneş ışığını yansıtır."],
          ["Bulutların Ay'ı örtmesi", false, "Bulutlar bir hava olayıdır; tutulmayla ilgisi yoktur."]] } },
      { baslik: "Tutulmalar neden her ay olmaz?",
        metin: "Ay her ay yeni ay ve dolunay evrelerinden geçer. Ama her ay tutulma olmaz; çünkü Ay'ın Dünya çevresindeki yörüngesi, Dünya'nın Güneş çevresindeki yörüngesine göre <b>yaklaşık 5° eğiktir</b>. Bu yüzden çoğu yeni ay ve dolunayda Ay, Güneş–Dünya doğrusunun biraz üstünde ya da altında kalır; gölge hedefe düşmez.<br>Tutulma için Güneş, Dünya ve Ay'ın <b>aynı doğru üzerinde</b> olması gerekir.",
        ornek: "Bir yılda birkaç tutulma olabilir ama aynı yerden tam Güneş tutulması görmek çok nadirdir.",
        durak: { soru: "Tutulmaların her yeni ay ve dolunayda olmamasının nedeni nedir?", secenekler: [
          ["Ay'ın yörüngesinin Dünya'nın yörüngesine göre eğik olması", true, "Bu eğiklik yüzünden üç gök cismi çoğu zaman tam aynı doğru üzerine gelmez."],
          ["Ay'ın bazı aylarda Dünya'nın çevresinde dolanmaması", false, "Ay her zaman Dünya'nın çevresinde dolanır."],
          ["Güneş'in bazı aylarda ışık vermemesi", false, "Güneş sürekli ışık üretir."],
          ["Dünya'nın bazı aylarda dönmeyi durdurması", false, "Dünya dönmesini hiç durdurmaz."]] } },
      { baslik: "Tutulmaları güvenle gözlemleme",
        metin: "Güneş'e <b>asla çıplak gözle</b> bakılmamalıdır; parçalı evrede bile göz kalıcı olarak zarar görebilir. Güneş tutulması yalnızca <b>onaylı tutulma gözlüğüyle</b> ya da delikli kartonla yere düşürülen görüntüye bakılarak (iğne deliği yöntemi) izlenir. Güneş gözlüğü, isli cam, film negatifi <b>güvenli değildir</b>; dürbün ve teleskopla filtresiz bakmak çok tehlikelidir.<br>Ay tutulması ise çıplak gözle güvenle izlenebilir.",
        ornek: "Bir kartona iğneyle küçük bir delik aç, Güneş'e sırtını dön ve deliğin yere düşürdüğü Güneş görüntüsünü izle.",
        durak: { soru: "Güneş tutulmasını izlemek için hangisi güvenlidir?", secenekler: [
          ["Onaylı tutulma gözlüğü kullanmak", true, "Tutulma gözlükleri Güneş ışığının zararlı kısmını süzer."],
          ["Koyu renkli güneş gözlüğü takmak", false, "Güneş gözlükleri gözü korumaya yetmez."],
          ["Dürbünle bakmak", false, "Dürbün ışığı toplayıp gözü çok daha hızlı yakar."],
          ["İsli camdan bakmak", false, "İsli cam zararlı ışınları süzmez; güvenli değildir."]] } },
    ],
    uret: {
      "ftut.gunes": [
        Q("ftut.gunes", "hatirlama", 1, "Güneş tutulması sırasında Güneş, Dünya ve Ay hangi sırayla dizilir?", "Güneş – Ay – Dünya",
          [["Güneş – Dünya – Ay", "kavrama", "Dünya ortadayken Dünya'nın gölgesi Ay'a düşer; bu Ay tutulmasıdır."],
           ["Ay – Güneş – Dünya", "bilgi", "Güneş ortada olsaydı ne Ay'ın gölgesi Dünya'ya ne de Dünya'nın gölgesi Ay'a düşerdi."],
           ["Dünya – Güneş – Ay", "bilgi", "Güneş ortadayken tutulma olmaz."]],
          "Hangi gök cisminin gölgesi Dünya'ya düşmeli?",
          ["Güneş tutulmasında Güneş, Dünya'dan görülemez hâle gelir.", "Bunun için Ay, Güneş ile Dünya'nın arasına girmelidir.", "Dizilim: Güneş – Ay – Dünya."],
          { gorsel: dizilim(["G", "A", "D"], ["?", "?", "?"]), kural: "Güneş tutulması: Ay ortada. Ay tutulması: Dünya ortada." }),
        Q("ftut.gunes", "hatirlama", 1, "Güneş tutulması hangi Ay evresinde olur?", "Yeni ay",
          [["Dolunay", "kavrama", "Dolunayda Dünya, Güneş ile Ay'ın arasındadır; bu Ay tutulmasının evresidir."],
           ["İlk dördün", "bilgi", "İlk dördünde üç gök cismi aynı doğru üzerinde değildir."],
           ["Son dördün", "bilgi", "Son dördünde üç gök cismi aynı doğru üzerinde değildir."]],
          "Ay, Güneş ile Dünya arasındayken Dünya'dan Ay'ın hangi yüzü görünür?",
          ["Ay, Güneş ile Dünya'nın arasındayken Güneş ışığı Ay'ın Dünya'ya bakmayan yüzüne düşer.", "Dünya'dan Ay'ın aydınlık yüzü görülmez; bu evre yeni aydır.", "Güneş tutulması yalnızca yeni ay evresinde olabilir."],
          { kural: "Güneş tutulması → yeni ay; Ay tutulması → dolunay." }),
        Q("ftut.gunes", "aciklama", 2, "Bir Güneş tutulması bir şehirden tam olarak, komşu bir ülkeden ise parçalı olarak görülüyor. Bunun nedeni nedir?", "Şehrin Ay'ın tam gölgesinde, komşu ülkenin ise yarı gölgesinde kalması",
          [["Komşu ülkede o sırada gece olması", "kavrama", "Gece Güneş görülmez; parçalı tutulmayı görebilmek için gündüz olmalıdır."],
           ["Ay'ın komşu ülkeye daha yakın olması", "kavrama", "Fark, Ay'a olan uzaklıktan değil, gölgenin hangi kısmında kalındığından kaynaklanır."],
           ["Güneş'in komşu ülkede daha küçük olması", "bilgi", "Güneş her yerden aynı büyüklükte görülür."]],
          "Ay'ın gölgesinin iki bölümü vardır.",
          ["Ay'ın gölgesinin ortasında tam gölge, çevresinde yarı gölge vardır.", "Tam gölgedeki yerlerden Güneş'in tamamı örtülmüş görülür: tam tutulma.", "Yarı gölgedeki yerlerden Güneş'in bir kısmı görülür: parçalı tutulma."],
          { kural: "Tam gölge → tam tutulma; yarı gölge → parçalı tutulma." }),
        Q("ftut.gunes", "aciklama", 2, "Tam Güneş tutulması neden Dünya'nın her yerinden görülemez?", "Ay küçük olduğu için tam gölgesi Dünya'nın yalnızca dar bir bölgesine düşer.",
          [["Tutulma gece olduğu için", "bilgi", "Güneş tutulması gündüz olur; gece Güneş zaten görülmez."],
           ["Güneş'in bir kısmı söndüğü için", "kavrama", "Güneş sönmez; Ay yalnızca önünü kapatır."],
           ["Bulutlar Güneş'i kapattığı için", "dikkat", "Bulutlar gözlemi engelleyebilir ama tutulmanın görüldüğü alanı belirlemez."]],
          "Ay'ın büyüklüğünü Dünya ile karşılaştır.",
          ["Ay, Dünya'dan çok daha küçüktür.", "Bu yüzden tam gölgesi Dünya üzerinde yalnızca dar bir şerit oluşturur.", "Tam tutulma yalnızca bu şeritteki yerlerden görülür."],
          { kural: "Güneş tutulması dar bir alandan, kısa süreli; Ay tutulması geniş bir alandan, daha uzun süreli görülür." }),
        Q("ftut.gunes", "transfer", 3, "Bir haber sitesinde şu cümle yer alıyor: “Bu gece saat 23.00'te Türkiye'den tam Güneş tutulması izlenecek.” Bu haberdeki bilimsel hata nedir?", "Güneş tutulması gündüz gözlenir; gece Güneş görünmez.",
          [["Güneş tutulması yalnızca yaz aylarında olur.", "bilgi", "Tutulmalar mevsime bağlı değildir; yılın farklı zamanlarında olabilir."],
           ["Tam Güneş tutulması diye bir olay yoktur.", "bilgi", "Ay'ın tam gölgesindeki yerlerden tam Güneş tutulması görülür."],
           ["Güneş tutulması dolunay evresinde olur.", "kavrama", "Güneş tutulması yeni ay evresinde olur; ayrıca haberdeki hata saatle ilgilidir."]],
          "Saat 23.00'te gökyüzünde Güneş var mıdır?",
          ["Güneş tutulmasında Ay, Güneş'in önünü kapatır.", "Bunu görebilmek için Güneş'in gökyüzünde olması, yani gündüz olması gerekir.", "Saat 23.00 gecedir; o sırada Güneş görünmez. Haberdeki hata budur."],
          { kural: "Güneş tutulması gündüz, Ay tutulması gece gözlenir." }),
        z => { const tip = sec(["tam", "parçalı", "yok"]);
          const D = { tam: "X", "parçalı": "Y", yok: "Z" }[tip];
          const soru = { tam: "<b>tam</b> Güneş tutulması", "parçalı": "<b>parçalı</b> Güneş tutulması", yok: "Güneş tutulması <b>gözlenemez</b>" }[tip];
          const ne = { X: "X noktası Ay'ın tam gölgesindedir; buradan tam tutulma görülür.", Y: "Y noktası Ay'ın yarı gölgesindedir; buradan parçalı tutulma görülür.", Z: "Z noktası Dünya'nın Güneş'e bakmayan (gece olan) yüzündedir; buradan tutulma görülmez." };
          const yanlis = ["X", "Y", "Z"].filter(h => h !== D).map(h => [h, h === "Z" || D === "Z" ? "kavrama" : "dikkat", ne[h]]).concat([[tip === "tam" ? "X ve Y" : tip === "parçalı" ? "X ve Z" : "X ve Y", "dikkat", "Yalnızca bir nokta bu koşulu sağlar; tam ve yarı gölgeyi ayırt et."]]);
          return S({ kaz: "ftut.gunes", duzey: "uygulama", zorluk: 3, soru: `Şekilde bir Güneş tutulması sırasında Ay'ın tam ve yarı gölgesi gösterilmiştir. Dünya üzerindeki X, Y, Z noktalarından hangisinde ${soru}?`,
            gorsel: gunesGolge(), dogru: D, yanlis,
            ipucu: "Koyu bölge tam gölge, açık bölge yarı gölgedir. Gece olan yerden Güneş görülür mü?",
            cozum: ["Ay'ın tam gölgesine düşen yerlerden tam, yarı gölgesine düşen yerlerden parçalı tutulma görülür.", "Dünya'nın Güneş'e bakmayan yüzünde gece vardır; oradan Güneş ve tutulma görülmez.", ne[D]],
            kural: "Güneş tutulması yalnızca Dünya'nın gündüz yaşanan ve Ay'ın gölgesine düşen bölgelerinden görülür." }); },
        Q("ftut.gunes", "baglanti", 2, "Ay, Güneş'ten yaklaşık 400 kat küçüktür ama Dünya'ya yaklaşık 400 kat daha yakındır. Bu bilgi tam Güneş tutulmasını nasıl açıklar?", "Ay ve Güneş gökyüzünde yaklaşık aynı büyüklükte görünür; bu yüzden Ay, Güneş'i tamamen örtebilir.",
          [["Ay, Güneş'ten büyük olduğu için Güneş'i örter.", "bilgi", "Ay, Güneş'ten çok küçüktür; yalnızca yakın olduğu için büyük görünür."],
           ["Ay'ın ışığı Güneş'in ışığını bastırır.", "kavrama", "Ay ışık üretmez; tutulmada Güneş ışığının önünü keser."],
           ["Tutulma sırasında Güneş küçülür.", "kavrama", "Güneş'in büyüklüğü değişmez; Ay önüne geçer."]],
          "Yakındaki küçük bir cisim, uzaktaki büyük bir cismi nasıl kapatabilir? (Elini gözüne yaklaştırıp uzaktaki bir binayı kapatmayı düşün.)",
          ["Yakındaki cisimler büyük, uzaktakiler küçük görünür.", "Ay hem 400 kat küçük hem de 400 kat yakın olduğu için gökyüzünde Güneş'le hemen hemen aynı büyüklükte görünür.", "Bu yüzden Ay, Güneş'in önüne tam geldiğinde onu tamamen örtebilir."],
          { kural: "Görünen büyüklük, gerçek büyüklüğe ve uzaklığa bağlıdır." }),
      ],
      "ftut.ay": [
        Q("ftut.ay", "hatirlama", 1, "Ay tutulması sırasında Güneş, Dünya ve Ay hangi sırayla dizilir?", "Güneş – Dünya – Ay",
          [["Güneş – Ay – Dünya", "kavrama", "Ay ortadayken Ay'ın gölgesi Dünya'ya düşer; bu Güneş tutulmasıdır."],
           ["Dünya – Güneş – Ay", "bilgi", "Güneş ortadayken tutulma olmaz."],
           ["Ay – Güneş – Dünya", "bilgi", "Güneş ortadayken Dünya'nın gölgesi Ay'a düşemez."]],
          "Ay'ın üzerine hangi gök cisminin gölgesi düşmeli?",
          ["Ay tutulmasında Ay, Dünya'nın gölgesine girer.", "Bunun için Dünya, Güneş ile Ay'ın arasında olmalıdır.", "Dizilim: Güneş – Dünya – Ay."],
          { gorsel: dizilim(["G", "D", "A"], ["?", "?", "?"]), kural: "Ay tutulması: Dünya ortada, dolunay, gece." }),
        Q("ftut.ay", "hatirlama", 1, "Ay tutulması hangi Ay evresinde olur?", "Dolunay",
          [["Yeni ay", "kavrama", "Yeni ayda Ay, Güneş ile Dünya'nın arasındadır; bu Güneş tutulmasının evresidir."],
           ["İlk dördün", "bilgi", "İlk dördünde üç gök cismi aynı doğru üzerinde değildir."],
           ["Hilal", "bilgi", "Hilal evresinde üç gök cismi aynı doğru üzerinde değildir."]],
          "Dünya, Güneş ile Ay'ın arasındayken Ay'ın aydınlık yüzü Dünya'ya mı bakar?",
          ["Dünya ortadayken Ay'ın Güneş'e bakan aydınlık yüzü Dünya'ya da bakar.", "Bu evre dolunaydır.", "Ay tutulması yalnızca dolunayda olabilir."],
          { kural: "Ay tutulması → dolunay." }),
        Q("ftut.ay", "aciklama", 2, "Ay tutulmasında Ay'ın üzerine düşen gölge hangi gök cismine aittir?", "Dünya",
          [["Güneş", "kavrama", "Güneş ışık kaynağıdır; ışık kaynakları gölge oluşturmaz, gölgeyi ışığın önündeki cisim oluşturur."],
           ["Ay", "kavrama", "Ay'ın kendi gölgesi Ay'ın arkasına, uzaya doğru düşer."],
           ["Bulutlar", "bilgi", "Bulutlar Dünya atmosferindedir; Ay'ın üzerine gölge düşüremez."]],
          "Güneş ile Ay'ın arasına hangi gök cismi giriyor?",
          ["Ay tutulmasında Dünya, Güneş ile Ay'ın arasına girer.", "Dünya, Güneş ışığının Ay'a ulaşmasını engeller.", "Ay, Dünya'nın gölgesinde kalır ve kararır."],
          { kural: "Gölgeyi her zaman ışık kaynağının önündeki saydam olmayan cisim oluşturur." }),
        Q("ftut.ay", "aciklama", 3, "Ay tutulması neden Güneş tutulmasından çok daha geniş bir alandan izlenebilir?", "Ay, Dünya'nın büyük gölgesine girdiği için tutulma, Dünya'nın gece yaşanan her yerinden görülür.",
          [["Ay, Güneş'ten daha parlak olduğu için", "bilgi", "Ay ışık üretmez; Güneş çok daha parlaktır."],
           ["Ay tutulması gündüz olduğu için", "kavrama", "Ay tutulması gece olur."],
           ["Ay'ın gölgesi Dünya'nın tamamını kapladığı için", "kavrama", "Ay tutulmasında Ay'ın değil, Dünya'nın gölgesi söz konusudur; ayrıca Ay'ın gölgesi küçüktür."]],
          "Ay tutulmasında kararan cisim Ay'dır. Ay'ı kimler görebilir?",
          ["Ay tutulmasında Ay'ın kendisi kararır.", "O sırada Ay'ı gökyüzünde görebilen herkes, yani gece yaşanan bölgelerdeki herkes tutulmayı görür.", "Güneş tutulmasında ise yalnızca Ay'ın küçük gölgesinin düştüğü dar bölge tutulmayı görür."],
          { kural: "Ay tutulması: geniş alan, uzun süre, çıplak gözle izlenir." }),
        Q("ftut.ay", "transfer", 2, "Zeynep bu gece gerçekleşecek Ay tutulmasını izlemek istiyor. Hangisi doğru bir davranıştır?", "Ay tutulmasını çıplak gözle izlemek",
          [["Tutulma gözlüğü almadan izlememek", "kavrama", "Ay ışık üretmez ve gözü zarar verecek kadar parlak değildir; tutulma gözlüğü gerekmez."],
           ["Ay tutulmasını gündüz izlemeye çalışmak", "bilgi", "Ay tutulması dolunayda, gece gözlenir."],
           ["Yalnızca güneş gözlüğüyle bakmak", "kavrama", "Ay'a bakarken güneş gözlüğüne gerek yoktur; görüntüyü gereksiz yere karartır."]],
          "Ay'ın ışığı Güneş'in ışığı kadar tehlikeli midir?",
          ["Ay kendi ışığını üretmez; yansıttığı ışık gözümüze zarar vermez.", "Bu yüzden Ay tutulması çıplak gözle güvenle izlenebilir.", "Dürbünle izlemek de güvenlidir ve ayrıntıları daha iyi gösterir."],
          { kural: "Ay tutulması çıplak gözle izlenebilir; Güneş'e ise asla çıplak gözle bakılmaz." }),
        Q("ftut.ay", "aciklama", 2, "Ay tutulması, Güneş tutulmasından daha uzun sürer. Bunun nedeni nedir?", "Dünya'nın gölgesi çok büyük olduğu için Ay'ın bu gölgeden geçmesi uzun sürer.",
          [["Ay tutulmasında Ay durduğu için", "kavrama", "Ay hiçbir zaman durmaz; yörüngesinde dolanmaya devam eder."],
           ["Gece, gündüzden uzun olduğu için", "dikkat", "Süre farkı gece ve gündüz uzunluğundan değil, gölgenin büyüklüğünden kaynaklanır."],
           ["Ay'ın gölgesi Dünya'nın gölgesinden büyük olduğu için", "bilgi", "Tersi doğrudur: Dünya Ay'dan büyüktür, gölgesi de büyüktür."]],
          "Büyük bir gölgeden geçmek mi, küçük bir gölgeden geçmek mi daha uzun sürer?",
          ["Dünya, Ay'dan çok büyüktür; gölgesi de çok büyüktür.", "Ay bu büyük gölgenin içinden geçerken uzun süre karanlıkta kalır.", "Bu yüzden Ay tutulması saatlerce, tam Güneş tutulması ise birkaç dakika sürer."],
          { kural: "Büyük gölge → uzun süreli tutulma." }),
        Q("ftut.ay", "baglanti", 2, "Bir Ay tutulmasından yaklaşık iki hafta (15 gün) sonra Ay hangi evrede görülür?", "Yeni ay",
          [["Dolunay", "dikkat", "Ay tutulması dolunayda olur; iki hafta sonra Ay evresi değişmiştir."],
           ["İlk dördün", "kavrama", "Dolunaydan yaklaşık bir hafta sonra son dördün gelir; ilk dördün yeni aydan sonra gelir."],
           ["Son dördün", "islem", "Son dördün, dolunaydan yaklaşık bir hafta sonra görülür; iki hafta sonra değil."]],
          "Ay'ın evreleri yaklaşık 29,5 günde tamamlanır. Dolunaydan yarım tur sonra hangi evre gelir?",
          ["Ay tutulması dolunay evresinde olur.", "Evreler: dolunay → son dördün (yaklaşık 1 hafta) → yeni ay (yaklaşık 2 hafta).", "Yani yaklaşık 15 gün sonra yeni ay evresi görülür."],
          { kural: "Dolunay ile yeni ay arasında yaklaşık 15 gün vardır." }),
        Q("ftut.ay", "uygulama", 2, "Şekilde Ay tutulması sırasında Dünya'nın tam ve yarı gölgesi gösterilmiştir. Ay, K, L ve M konumlarından hangisindeyken <b>tam Ay tutulması</b> gözlenir?", "K",
          [["L", "kavrama", "L konumu yarı gölgededir; Ay burada tamamen kararmaz."],
           ["M", "kavrama", "M konumu gölgenin dışındadır; Ay burada Güneş ışığı alır ve tutulma olmaz."],
           ["L ve M", "dikkat", "Tam tutulma için Ay'ın tamamen tam gölgenin içinde olması gerekir; yalnızca bir konum bunu sağlar."]],
          "Koyu bölge tam gölgedir.",
          ["Tam Ay tutulması için Ay'ın tamamı Dünya'nın tam gölgesine girmelidir.", "Şekilde tam gölgenin (koyu bölge) içinde kalan konum K'dir.", "L yarı gölgede, M gölgenin dışındadır."],
          { gorsel: ayGolge(), kural: "Ay, Dünya'nın tam gölgesine girdiğinde tam Ay tutulması olur." }),
      ],
      "ftut.model": [
        z => { const [sira, tip] = sec([[["G", "A", "D"], "g"], [["D", "A", "G"], "g"], [["G", "D", "A"], "a"], [["A", "D", "G"], "a"], [["A", "G", "D"], "y"], [["D", "G", "A"], "y"]]);
          const M = { g: "Güneş tutulması", a: "Ay tutulması", y: "Tutulma olmaz" };
          const N = { g: "Ay, Güneş ile Dünya'nın arasında; Ay'ın gölgesi Dünya'ya düşer.", a: "Dünya, Güneş ile Ay'ın arasında; Dünya'nın gölgesi Ay'a düşer.", y: "Güneş ortada; ne Ay'ın gölgesi Dünya'ya ne de Dünya'nın gölgesi Ay'a düşebilir." };
          const yanlis = Object.keys(M).filter(k => k !== tip).map(k => [M[k], "kavrama", `Bu olay için ${k === "g" ? "Ay'ın" : k === "a" ? "Dünya'nın" : "Güneş'in"} ortada olması gerekirdi. Şekildeki dizilimde ortadaki gök cismini yeniden incele.`])
            .concat([["Hem Güneş hem Ay tutulması", "kavrama", "Bir dizilimde ortada yalnızca bir gök cismi olabilir; iki tutulma aynı anda olmaz."]]);
          return S({ kaz: "ftut.model", duzey: "uygulama", zorluk: 1, soru: "Şekildeki gibi bir dizilim oluştuğunda Dünya'dan hangi olay gözlenebilir?",
            gorsel: dizilim(sira), dogru: M[tip], yanlis, ipucu: "Ortada hangi gök cismi var?",
            cozum: ["Tutulmayı ortadaki gök cismi belirler.", N[tip], `Sonuç: ${M[tip]}.`],
            kural: "Ay ortada → Güneş tutulması. Dünya ortada → Ay tutulması." }); },
        z => { const g = sec([true, false]), h = karistir(["K", "L", "M"]);
          const sira = g ? ["G", "A", "D"] : ["G", "D", "A"];
          const ad = { G: "Güneş", D: "Dünya", A: "Ay" }, adl = sira.map(c => ad[c]);
          const dogru = `${h[0]}: ${adl[0]}, ${h[1]}: ${adl[1]}, ${h[2]}: ${adl[2]}`;
          const f = (a, b, c) => `${h[0]}: ${a}, ${h[1]}: ${b}, ${h[2]}: ${c}`;
          const yanlis = g
            ? [[f("Güneş", "Dünya", "Ay"), "kavrama", "Bu dizilimde Dünya ortadadır; bu Ay tutulmasının dizilimidir."], [f("Dünya", "Ay", "Güneş"), "dikkat", "Ay ortada ama ışık kaynağı olan Güneş, en büyük ve sarı çizilen cisimdir."], [f("Ay", "Güneş", "Dünya"), "bilgi", "Güneş ortadayken tutulma olmaz."]]
            : [[f("Güneş", "Ay", "Dünya"), "kavrama", "Bu dizilimde Ay ortadadır; bu Güneş tutulmasının dizilimidir."], [f("Ay", "Dünya", "Güneş"), "dikkat", "Dünya ortada ama ışık kaynağı olan Güneş, en büyük ve sarı çizilen cisimdir."], [f("Dünya", "Güneş", "Ay"), "bilgi", "Güneş ortadayken tutulma olmaz."]];
          return S({ kaz: "ftut.model", duzey: "aciklama", zorluk: 2, soru: `Şekilde bir <b>${g ? "Güneş" : "Ay"} tutulması</b> sırasında üç gök cisminin dizilimi modellenmiştir. K, L ve M hangi gök cisimleridir?`,
            gorsel: dizilim(sira, h), dogru, yanlis, ipucu: g ? "Güneş tutulmasında ortada Ay vardır." : "Ay tutulmasında ortada Dünya vardır.",
            cozum: [`${g ? "Güneş" : "Ay"} tutulmasında dizilim: ${adl.join(" – ")}.`, `Şekilde en büyük ve ışık kaynağı olan ${h[0]}, Güneş'tir; ortadaki ${h[1]}, ${adl[1]}; diğer uçtaki ${h[2]}, ${adl[2]}.`],
            kural: "Modelde en büyük cisim Güneş; tutulmayı ortadaki cisim belirler." }); },
        Q("ftut.model", "aciklama", 3, "Ay her ay yeni ay ve dolunay evrelerinden geçtiği hâlde her ay tutulma olmaz. Bunun nedeni nedir?", "Ay'ın yörüngesinin Dünya'nın yörüngesine göre yaklaşık 5° eğik olması",
          [["Ay'ın bazı aylarda Dünya'nın çevresinde dolanmaması", "bilgi", "Ay her zaman Dünya'nın çevresinde dolanır."],
           ["Güneş'in bazı aylarda Dünya'dan çok uzaklaşması", "kavrama", "Dünya–Güneş uzaklığındaki küçük değişimler tutulmanın olup olmamasını belirlemez."],
           ["Yeni ay ve dolunayın her ay olmaması", "bilgi", "Yeni ay ve dolunay her ay olur; soru da bunu söylüyor."]],
          "Üç gök cismi tam aynı doğru üzerinde olmalıdır.",
          ["Tutulma için Güneş, Dünya ve Ay'ın aynı doğru üzerinde olması gerekir.", "Ay'ın yörüngesi eğik olduğu için Ay çoğu yeni ay ve dolunayda bu doğrunun biraz üstünde ya da altında kalır.", "Gölge hedefe düşmez; bu yüzden her ay tutulma olmaz."],
          { kural: "Tutulma koşulu: doğru evre (yeni ay ya da dolunay) + üç gök cismi aynı doğru üzerinde." }),
        Q("ftut.model", "hatirlama", 1, "Güneş tutulmasını izlemek için aşağıdakilerden hangisi kullanılmalıdır?", "Onaylı tutulma gözlüğü",
          [["Koyu renkli güneş gözlüğü", "kavrama", "Güneş gözlükleri zararlı ışınları yeterince süzmez; göz zarar görebilir."],
           ["İsli cam ya da film negatifi", "bilgi", "Bunlar güvenli değildir; zararlı ışınlar gözü yakabilir."],
           ["Filtresiz dürbün", "bilgi", "Dürbün ışığı toplar; filtresiz bakmak gözü çok hızlı ve kalıcı biçimde yakar."]],
          "Güneş'in zararlı ışınlarını süzmek için özel olarak üretilmiş araç hangisi?",
          ["Güneş'e çıplak gözle ya da sıradan araçlarla bakmak gözde kalıcı hasar bırakabilir.", "Güneş tutulması yalnızca onaylı tutulma gözlüğüyle ya da iğne deliği yöntemiyle izlenir."],
          { kural: "Güneş'e asla çıplak gözle, güneş gözlüğüyle ya da filtresiz dürbünle bakma." }),
        Q("ftut.model", "transfer", 2, "Okulda Güneş tutulması gözlemi yapılıyor. Aşağıdaki davranışlardan hangisi göz sağlığı için <b>tehlikelidir</b>?", "Parçalı evrede Güneş'e birkaç saniye çıplak gözle bakmak",
          [["Onaylı tutulma gözlüğüyle izlemek", "dikkat", "Bu güvenli bir yöntemdir; tehlikeli olanı sormuştuk."],
           ["Delikli kartonla yere düşen görüntüye bakmak", "dikkat", "İğne deliği yöntemi güvenlidir; Güneş'e doğrudan bakılmaz."],
           ["Tutulmayı canlı yayından izlemek", "dikkat", "Ekrandan izlemek tamamen güvenlidir."]],
          "Hangi davranışta göz doğrudan Güneş'e bakıyor?",
          ["Güneş'in küçük bir parçası bile gözü kalıcı olarak yakacak kadar güçlü ışık yayar.", "Parçalı evrede Güneş sönük görünse de çıplak gözle bakmak tehlikelidir.", "Diğer seçenekler güvenli gözlem yollarıdır."],
          { kural: "Güneş'in yalnızca küçük bir kısmı görünse bile ona çıplak gözle bakılmaz." }),
        Q("ftut.model", "uygulama", 2, "Tabloda Güneş ve Ay tutulmaları karşılaştırılmıştır. Hangi satırda <b>hata</b> vardır?", "Çıplak gözle izlenebilir mi?",
          [["Ortadaki gök cismi", "dikkat", "Bu satır doğrudur: Güneş tutulmasında Ay, Ay tutulmasında Dünya ortadadır."],
           ["Ay evresi", "dikkat", "Bu satır doğrudur: Güneş tutulması yeni ayda, Ay tutulması dolunayda olur."],
           ["Gözlem zamanı", "dikkat", "Bu satır doğrudur: Güneş tutulması gündüz, Ay tutulması gece gözlenir."]],
          "Hangi tutulmada Güneş'e bakılır?",
          ["Güneş tutulmasında Güneş'e bakılır; bu çıplak gözle yapılamaz.", "Ay tutulmasında ise Ay'a bakılır; çıplak gözle güvenle izlenir.", "Tabloda bu satırdaki cevaplar yer değiştirmiştir; hata bu satırdadır."],
          { gorsel: G.tablo(["Özellik", "Güneş tutulması", "Ay tutulması"], [["Ortadaki gök cismi", "Ay", "Dünya"], ["Ay evresi", "Yeni ay", "Dolunay"], ["Gözlem zamanı", "Gündüz", "Gece"], ["Çıplak gözle izlenebilir mi?", "Evet", "Hayır"]]),
            kural: "Güneş tutulması: Ay ortada, yeni ay, gündüz, özel gözlükle. Ay tutulması: Dünya ortada, dolunay, gece, çıplak gözle." }),
        Q("ftut.model", "transfer", 3, "Elif, el feneri (Güneş), futbol topu (Dünya) ve tenis topu (Ay) ile bir model kuruyor. Tenis topunun gölgesini futbol topunun üzerine düşürmek için tenis topunu nereye koymalıdır?", "El feneri ile futbol topunun arasına, aynı doğru üzerine",
          [["Futbol topunun arkasına, aynı doğru üzerine", "kavrama", "Bu durumda futbol topunun gölgesi tenis topuna düşer; bu Ay tutulması modelidir."],
           ["El fenerinin arkasına", "bilgi", "Işık kaynağının arkasındaki cismin gölgesi öndeki cisme düşmez."],
           ["Futbol topunun yanına, el fenerine dik açı yapacak şekilde", "dikkat", "Üç cisim aynı doğru üzerinde olmazsa gölge futbol topuna düşmez."]],
          "Hangi tutulmanın modelini kurmak istiyor?",
          ["Ay'ın gölgesinin Dünya'ya düşmesi Güneş tutulmasıdır.", "Güneş tutulmasında Ay, Güneş ile Dünya'nın arasındadır.", "Tenis topu, el feneri ile futbol topunun arasına ve aynı doğru üzerine konmalıdır."],
          { kural: "Modelde gölge, ışık kaynağı ile hedef arasına konan cisimden oluşur." }),
        Q("ftut.model", "baglanti", 2, "Tutulmaların oluşmasını sağlayan temel olay hangisidir?", "Işığın doğrusal yolla yayılması ve saydam olmayan cisimlerin arkasında gölge oluşması",
          [["Işığın düz aynadan yansıması", "kavrama", "Yansıma ışığın yüzeyden geri dönmesidir; tutulmayı gölge oluşturur."],
           ["Ay'ın kendi ışığını üretmesi", "bilgi", "Ay ışık üretmez; Güneş ışığını yansıtır."],
           ["Dünya'nın kendi ekseni etrafında dönmesi", "bilgi", "Dünya'nın dönmesi gece ile gündüzü oluşturur; tutulmaların nedeni değildir."]],
          "Gölge nasıl oluşur? (Işık ve gölge konusunu hatırla.)",
          ["Işık doğrular boyunca yayılır.", "Işığın önüne saydam olmayan bir cisim (Ay ya da Dünya) girerse arkasında gölge oluşur.", "Tutulmalar, bu gölgenin Dünya'ya ya da Ay'a düşmesiyle oluşur."],
          { kural: "Tutulma = gök cisimleri ölçeğinde gölge olayı." }),
      ],
    },
  });

  /* ============================== BİLEŞKE KUVVET ============================== */
  const isim = () => sec(["Ali", "Ece", "Can", "Zeynep", "Mert", "Elif", "Deniz", "Ayşe"]);

  KONU_EKLE("fen", {
    id: "f_bileske", tema: "f2", ad: "Bileşke Kuvvet",
    kazanimlar: [
      { id: "fbil.kuvvet", ad: "Kuvveti tanıma ve dinamometreyle ölçme" },
      { id: "fbil.bileske", ad: "Aynı ve zıt yönlü kuvvetlerin bileşkesini bulma" },
      { id: "fbil.denge", ad: "Dengelenmiş ve dengelenmemiş kuvvetlerin harekete etkisini açıklama" },
    ],
    anlatim: [
      { baslik: "Kuvvet ve ölçülmesi",
        metin: "Bir cismi itmek ya da çekmek için uygulanan etkiye <b>kuvvet</b> denir. Kuvvet duran bir cismi harekete geçirebilir, hareketli bir cismi durdurabilir, cismin süratini ya da yönünü değiştirebilir, cismin şeklini değiştirebilir.<br>Kuvvetin birimi <b>newton (N)</b>, ölçme aracı <b>dinamometre</b>dir. Dinamometrenin içindeki yay, uygulanan kuvvet arttıkça daha çok esner; ibre ölçeği gösterir.",
        ornek: "Dinamometreye asılan çanta yayı uzatır; ibre 15 çizgisini gösteriyorsa çantaya etki eden kuvvet 15 N'dur.",
        gorsel: dinamometre(6, 10, 1, 5),
        durak: { soru: "Kuvvet hangi araçla ölçülür?", secenekler: [
          ["Dinamometre", true, "Dinamometre, içindeki yayın esnemesiyle kuvveti ölçer."],
          ["Terazi", false, "Eşit kollu terazi kütle ölçer."],
          ["Termometre", false, "Termometre sıcaklık ölçer."],
          ["Cetvel", false, "Cetvel uzunluk ölçer."]] } },
      { baslik: "Aynı yönlü kuvvetlerin bileşkesi",
        metin: "Bir cisme etki eden kuvvetlerin yaptığı etkinin aynısını tek başına yapan kuvvete <b>bileşke kuvvet</b> denir.<br>Kuvvetler <b>aynı yönlü</b> ise bileşke, kuvvetlerin <b>toplamına</b> eşittir ve yönü kuvvetlerle <b>aynı yöndedir</b>.",
        ornek: "Bir kutuyu sağa doğru biri 3 N, diğeri 5 N kuvvetle itiyor. Bileşke = 3 + 5 = 8 N, sağa doğru.",
        gorsel: G.kuvvet({ sag: [3, 5], cisim: "kutu" }),
        durak: { soru: "Bir arabayı aynı yönde 40 N ve 60 N'luk kuvvetlerle iki kişi itiyor. Bileşke kuvvet kaç N'dur?", secenekler: [
          ["100 N", true, "Aynı yönlü kuvvetler toplanır: 40 + 60 = 100 N."],
          ["20 N", false, "Kuvvetleri çıkardın; çıkarma zıt yönlü kuvvetlerde yapılır."],
          ["60 N", false, "Yalnızca büyük kuvveti aldın; iki kişinin kuvveti birleşir."],
          ["2400 N", false, "Kuvvetler çarpılmaz, toplanır."]] } },
      { baslik: "Zıt yönlü kuvvetlerin bileşkesi",
        metin: "Kuvvetler <b>zıt yönlü</b> ise bileşke, <b>büyük kuvvetten küçük kuvvetin çıkarılmasıyla</b> bulunur. Bileşkenin yönü <b>büyük kuvvetin yönündedir</b>.<br>Halat çekme oyununda iki takım halatı zıt yönlere çeker; kuvvetleri toplamı daha büyük olan takım kazanır.",
        ornek: "Bir kutu sola 4 N, sağa 9 N kuvvetle çekiliyor. Bileşke = 9 − 4 = 5 N, sağa doğru.",
        gorsel: G.kuvvet({ sol: [4], sag: [9], cisim: "kutu" }),
        durak: { soru: "Bir cisme sağa 12 N, sola 7 N kuvvet uygulanıyor. Bileşke kuvvet nedir?", secenekler: [
          ["5 N, sağa doğru", true, "12 − 7 = 5 N; yön büyük kuvvet olan 12 N'un yönü, yani sağ."],
          ["5 N, sola doğru", false, "Bileşke, büyük kuvvetin yönündedir; büyük kuvvet sağa doğrudur."],
          ["19 N, sağa doğru", false, "Zıt yönlü kuvvetler toplanmaz, çıkarılır."],
          ["12 N, sağa doğru", false, "Sola etki eden 7 N'luk kuvveti hesaba katmadın."]] } },
      { baslik: "Dengelenmiş ve dengelenmemiş kuvvetler",
        metin: "Bir cisme etki eden kuvvetlerin bileşkesi <b>sıfır</b> ise kuvvetler <b>dengelenmiştir</b>. Dengelenmiş kuvvetlerin etkisindeki cisim <b>duruyorsa durmaya devam eder</b>, <b>hareket ediyorsa aynı süratle aynı yönde hareketine devam eder</b>.<br>Bileşke sıfırdan farklıysa kuvvetler <b>dengelenmemiştir</b>. Bu durumda cismin hareket durumu değişir: duran cisim harekete geçer, hareketli cisim hızlanır, yavaşlar, durur ya da yön değiştirir.",
        ornek: "Masada duran kitaba etki eden ağırlık ile masanın tepki kuvveti dengelenmiştir; kitap durmaya devam eder.",
        gorsel: G.kuvvet({ sol: [6], sag: [6], cisim: "kutu" }),
        durak: { soru: "Dengelenmiş kuvvetlerin etkisinde sabit süratle giden bir bisiklet için ne söylenebilir?", secenekler: [
          ["Aynı süratle hareketine devam eder.", true, "Bileşke sıfır olduğu için hareket durumu değişmez."],
          ["Yavaşlayıp durur.", false, "Durması için dengelenmemiş bir kuvvet gerekir."],
          ["Hızlanır.", false, "Hızlanması için hareket yönünde dengelenmemiş bir kuvvet gerekir."],
          ["Hemen geri döner.", false, "Yön değiştirmesi için dengelenmemiş bir kuvvet gerekir."]] } },
    ],
    uret: {
      "fbil.kuvvet": [
        Q("fbil.kuvvet", "hatirlama", 1, "Kuvvetin birimi hangisidir?", "Newton (N)",
          [["Kilogram (kg)", "kavrama", "Kilogram kütle birimidir; kuvvet birimi değildir."],
           ["Metre (m)", "bilgi", "Metre uzunluk birimidir."],
           ["Saniye (s)", "bilgi", "Saniye zaman birimidir."]],
          "Birim, bir bilim insanının adından gelir.",
          ["Kuvvet büyüklükleri sayı ve birimle ifade edilir.", "Kuvvetin birimi newtondur; kısaca N ile gösterilir."],
          { kural: "Kuvvet birimi: newton (N). Ölçme aracı: dinamometre." }),
        Q("fbil.kuvvet", "hatirlama", 1, "Kuvveti ölçmek için kullanılan araç hangisidir?", "Dinamometre",
          [["Eşit kollu terazi", "kavrama", "Terazi kütleyi ölçer; kütle ile kuvvet farklı büyüklüklerdir."],
           ["Termometre", "bilgi", "Termometre sıcaklık ölçer."],
           ["Kronometre", "bilgi", "Kronometre zaman ölçer."]],
          "İçinde yay bulunan ölçme aracını düşün.",
          ["Kuvvet dinamometreyle ölçülür.", "Dinamometredeki yay, uygulanan kuvvetle esner ve ibre değeri gösterir."],
          { kural: "Dinamometre = yaylı kuvvet ölçer." }),
        z => { const [max, adim, et] = sec([[10, 1, 5], [20, 2, 10], [50, 5, 25]]); let k = R(1, 9); if (k === 5) k = 4; const v = k * adim;
          return S({ kaz: "fbil.kuvvet", duzey: "uygulama", zorluk: adim === 1 ? 1 : 2, soru: "Şekildeki dinamometreye bir cisim asılmıştır. Dinamometrenin gösterdiği kuvvet kaç N'dur?",
            gorsel: dinamometre(v, max, adim, et), dogru: v + " N",
            yanlis: [[k + " N", "kavrama", `Çizgileri saydın ama her çizgi aralığı ${adim} N değerindedir.`], [(v + adim) + " N", "dikkat", "İbrenin bir alt çizgisini okudun; ibrenin tam hizasına bak."],
              [(v - adim) + " N", "dikkat", "İbrenin bir üst çizgisini okudun; ibrenin tam hizasına bak."], [(max - v) + " N", "strateji", "Ölçeği aşağıdan yukarıya doğru okudun; ölçek 0'dan başlayarak aşağı doğru artıyor."]],
            ipucu: "Önce iki çizgi arasının kaç N olduğunu bul.",
            cozum: [`Ölçekte ${et} N'luk aralıkta ${et / adim} çizgi aralığı var; her aralık ${adim} N.`, `İbre 0'dan itibaren ${k}. çizgide.`, `${k} × ${adim} = ${v} N.`],
            kural: "Ölçek okurken önce bir çizgi aralığının değerini bul." }); },
        Q("fbil.kuvvet", "aciklama", 2, "Dinamometre kuvveti nasıl ölçer?", "İçindeki yay, uygulanan kuvvet arttıkça daha çok esner.",
          [["Cismin kütlesini terazi gibi karşılaştırarak", "kavrama", "Dinamometre karşılaştırma yapmaz; yayın esnemesine bakar."],
           ["İçindeki sıvının ısınıp genleşmesiyle", "bilgi", "Bu, termometrenin çalışma ilkesidir."],
           ["İçindeki mıknatısın cismi çekmesiyle", "bilgi", "Dinamometrede ölçme mıknatısla yapılmaz."]],
          "Dinamometrenin içinde ne vardır?",
          ["Dinamometrenin içinde esnek bir yay bulunur.", "Kuvvet büyüdükçe yay daha çok uzar.", "Yaya bağlı ibre ölçek üzerinde kuvvetin değerini gösterir."],
          { kural: "Büyük kuvvet → yayda büyük uzama." }),
        Q("fbil.kuvvet", "aciklama", 1, "Aşağıdakilerden hangisi kuvvetin bir cisim üzerindeki etkilerinden biri <b>değildir</b>?", "Cismin kütlesini artırmak",
          [["Duran cismi harekete geçirmek", "bilgi", "Bu bir kuvvet etkisidir: Topa vurunca top harekete geçer."],
           ["Hareketli cismin yönünü değiştirmek", "bilgi", "Bu bir kuvvet etkisidir: Kaleci topun yönünü değiştirir."],
           ["Cismin şeklini değiştirmek", "bilgi", "Bu bir kuvvet etkisidir: Hamuru sıkınca şekli değişir."]],
          "Kuvvet hareketi ve şekli değiştirebilir. Madde miktarını değiştirebilir mi?",
          ["Kuvvet; harekete geçirme, durdurma, sürat ve yön değiştirme, şekil değiştirme etkileri yapar.", "Cisme kuvvet uygulamak cismin madde miktarını (kütlesini) değiştirmez."],
          { kural: "Kuvvetin etkileri: harekete geçirme, durdurma, hızlandırma, yavaşlatma, yön değiştirme, şekil değiştirme." }),
        z => { const w = sec([12, 18, 25, 30, 35, 40]);
          const D = [[10, "0–10 N"], [20, "0–20 N"], [50, "0–50 N"], [100, "0–100 N"]];
          const uygun = D.find(d => d[0] >= w);
          const yanlis = D.filter(d => d !== uygun).map(d => [d[1] + " ölçebilen dinamometre", d[0] < w ? "kavrama" : "strateji", d[0] < w ? `Bu dinamometrenin en büyük değeri ${d[0]} N; ${w} N'luk yükte yay aşırı uzar ve bozulabilir.` : "Bu dinamometre de ölçebilir ama ölçeği çok geniştir; daha uygun olan, yükü karşılayan en küçük ölçekli dinamometredir."]);
          return S({ kaz: "fbil.kuvvet", duzey: "transfer", zorluk: 2, soru: `Bir okul çantasına etki eden yer çekimi kuvveti yaklaşık ${w} N'dur. Bu kuvveti ölçmek için aşağıdaki dinamometrelerden hangisi en uygundur?`,
            dogru: uygun[1] + " ölçebilen dinamometre", yanlis,
            ipucu: "Dinamometrenin ölçebildiği en büyük değer, ölçülecek kuvvetten küçük olmamalı.",
            cozum: [`Ölçülecek kuvvet yaklaşık ${w} N.`, "Ölçme sınırı bu değerden küçük olan dinamometrenin yayı aşırı uzar ve bozulur.", `Yükü karşılayan en küçük ölçekli dinamometre ${uygun[1]} olandır; hem güvenli hem daha hassas ölçer.`],
            kural: "Ölçülecek kuvvete uygun ölçme sınırı olan dinamometre seçilir." }); },
        Q("fbil.kuvvet", "baglanti", 1, "Aşağıdakilerden hangisinde cisimler birbirine dokunmadan kuvvet uygulanmaktadır?", "Mıknatısın uzaktaki ataşı kendine çekmesi",
          [["Kapıyı itip açmak", "kavrama", "Kapıyı itmek için ele dokunmak gerekir; bu temas gerektiren kuvvettir."],
           ["Halatı çekmek", "kavrama", "Halatı tutup çekmek temas gerektiren bir kuvvettir."],
           ["Topa ayakla vurmak", "kavrama", "Ayak topa dokunarak kuvvet uygular."]],
          "Mıknatıslar konusunu hatırla: Hangi kuvvet uzaktan etki eder?",
          ["Kuvvetler temas gerektiren ve temas gerektirmeyen olarak ikiye ayrılabilir.", "Mıknatısın ataşı uzaktan çekmesi dokunmadan uygulanan bir kuvvettir.", "Yer çekimi de dokunmadan etki eden bir kuvvettir."],
          { kural: "Temas gerektirmeyen kuvvetler: mıknatıs kuvveti, yer çekimi, elektriklenme." }),
      ],
      "fbil.bileske": [
        z => { let a = R(2, 12), b = R(2, 12); if (a === b) b = a + 3; const yon = sec(["sağa", "sola"]), t = a + b, buyuk = Math.max(a, b);
          const ters = yon === "sağa" ? "sola" : "sağa";
          return S({ kaz: "fbil.bileske", duzey: "uygulama", zorluk: 1, soru: `Şekildeki kutuya aynı yönde ${a} N ve ${b} N büyüklüğünde iki kuvvet etki ediyor. Bileşke kuvvet nedir?`,
            gorsel: G.kuvvet(yon === "sağa" ? { sag: [a, b], cisim: "kutu" } : { sol: [a, b], cisim: "kutu" }), dogru: `${t} N, ${yon} doğru`,
            yanlis: [[`${Math.abs(a - b)} N, ${yon} doğru`, "kavrama", "Kuvvetleri çıkardın; aynı yönlü kuvvetler toplanır."], [`${t} N, ${ters} doğru`, "dikkat", "Büyüklük doğru ama yön yanlış; bileşke kuvvetlerle aynı yöndedir."],
              [`${buyuk} N, ${yon} doğru`, "strateji", "Yalnızca büyük kuvveti aldın; iki kuvvetin etkisi birleşir."]],
            ipucu: "Aynı yönlü kuvvetlerde bileşke nasıl bulunur?",
            cozum: [`Kuvvetler aynı yönde (${yon}).`, `Aynı yönlü kuvvetler toplanır: ${a} + ${b} = ${t} N.`, `Bileşke: ${t} N, ${yon} doğru.`],
            kural: "Aynı yönlü kuvvetler: bileşke = toplam, yön aynı." }); },
        z => { let a = R(2, 15), b = R(2, 15); if (a === b) b = a + R(2, 5); const bS = a > b ? "sola" : "sağa", kS = a > b ? "sağa" : "sola", f = Math.abs(a - b);
          return S({ kaz: "fbil.bileske", duzey: "uygulama", zorluk: 2, soru: `Şekildeki kutuya sola doğru ${a} N, sağa doğru ${b} N kuvvet uygulanıyor. Bileşke kuvvet nedir?`,
            gorsel: G.kuvvet({ sol: [a], sag: [b], cisim: "kutu" }), dogru: `${f} N, ${bS} doğru`,
            yanlis: [[`${a + b} N, ${bS} doğru`, "kavrama", "Kuvvetleri topladın; zıt yönlü kuvvetlerde büyükten küçük çıkarılır."], [`${f} N, ${kS} doğru`, "dikkat", "Bileşke büyük kuvvetin yönündedir."],
              [`${Math.max(a, b)} N, ${bS} doğru`, "strateji", "Küçük kuvveti hesaba katmadın; iki kuvvet de cisme etki ediyor."]],
            ipucu: "Zıt yönlü kuvvetlerde büyükten küçüğü çıkar; yön büyüğün yönüdür.",
            cozum: [`Kuvvetler zıt yönlü: sola ${a} N, sağa ${b} N.`, `Bileşke = ${Math.max(a, b)} − ${Math.min(a, b)} = ${f} N.`, `Yön büyük kuvvetin yönü: ${bS}.`],
            kural: "Zıt yönlü kuvvetler: bileşke = büyük − küçük, yön büyüğün yönü." }); },
        z => { const s1 = R(2, 9), s2 = R(2, 9), l = R(3, 20); const sag = s1 + s2; if (sag === l) return null; const f = Math.abs(sag - l), y = sag > l ? "sağa" : "sola", ty = sag > l ? "sola" : "sağa";
          return S({ kaz: "fbil.bileske", duzey: "uygulama", zorluk: 3, soru: `Şekildeki cisme sağa doğru ${s1} N ve ${s2} N, sola doğru ${l} N kuvvet etki ediyor. Bileşke kuvvet nedir?`,
            gorsel: G.kuvvet({ sag: [s1, s2], sol: [l], cisim: "cisim" }), dogru: `${f} N, ${y} doğru`,
            yanlis: [[`${s1 + s2 + l} N, ${y} doğru`, "kavrama", "Bütün kuvvetleri topladın; zıt yöndeki kuvveti çıkarmalısın."], [`${f} N, ${ty} doğru`, "dikkat", "Bileşke, toplamı büyük olan yöndedir."],
              [`${Math.abs(Math.max(s1, s2) - l)} N, ${Math.max(s1, s2) > l ? "sağa" : "sola"} doğru`, "strateji", "Sağdaki kuvvetlerden yalnızca birini kullandın; önce aynı yönlüleri topla."]],
            ipucu: "Önce aynı yöndeki kuvvetleri topla, sonra zıt yöndekilerle karşılaştır.",
            cozum: [`Sağa doğru toplam: ${s1} + ${s2} = ${sag} N.`, `Sola doğru: ${l} N.`, `Bileşke = ${Math.max(sag, l)} − ${Math.min(sag, l)} = ${f} N, ${y} doğru.`],
            kural: "Önce her yöndeki kuvvetleri topla, sonra iki yönü karşılaştır." }); },
        z => { const A = [R(8, 20) * 10, R(8, 20) * 10, R(8, 20) * 10], B = [R(8, 20) * 10, R(8, 20) * 10, R(8, 20) * 10];
          const ta = A[0] + A[1] + A[2], tb = B[0] + B[1] + B[2]; if (ta === tb) return null;
          
          const kaz = ta > tb ? "Mavi takım" : "Kırmızı takım", kay = ta > tb ? "Kırmızı takım" : "Mavi takım", f = Math.abs(ta - tb);
          return S({ kaz: "fbil.bileske", duzey: "transfer", zorluk: 3, soru: "Halat çekme oyununda iki takımın oyuncularının halata uyguladığı kuvvetler tabloda verilmiştir. Hangi takım kazanır ve halata etki eden bileşke kuvvet kaç N'dur?",
            gorsel: G.tablo(["Takım", "1. oyuncu", "2. oyuncu", "3. oyuncu"], [["Mavi takım (sola çeker)", A[0] + " N", A[1] + " N", A[2] + " N"], ["Kırmızı takım (sağa çeker)", B[0] + " N", B[1] + " N", B[2] + " N"]]),
            dogru: `${kaz} kazanır; bileşke ${f} N`,
            yanlis: [[`${kaz} kazanır; bileşke ${ta + tb} N`, "kavrama", "Takımlar zıt yönde çektiği için toplamlar birbirinden çıkarılır."], [`${kay} kazanır; bileşke ${f} N`, "dikkat", "Toplam kuvveti büyük olan takım kazanır; toplamları yeniden karşılaştır."],
              [`Berabere kalırlar; bileşke 0 N`, "islem", "Takımların toplam kuvvetleri eşit değildir; toplamaları yeniden yap."]],
            ipucu: "Her takımın toplam kuvvetini bul, sonra büyükten küçüğü çıkar.",
            cozum: [`Mavi takım: ${A.join(" + ")} = ${ta} N (sola).`, `Kırmızı takım: ${B.join(" + ")} = ${tb} N (sağa).`, `Bileşke = ${Math.max(ta, tb)} − ${Math.min(ta, tb)} = ${f} N; halat ${ta > tb ? "sola" : "sağa"} kayar, ${kaz.toLowerCase()} kazanır.`],
            kural: "Halat çekmede takımların toplam kuvvetleri zıt yönlüdür; büyük toplam kazanır." }); },
        z => { let a = R(3, 14), b = R(3, 14); if (a === b) return null; const f = Math.abs(a - b), y = a > b ? "sağa" : "sola", ty = a > b ? "sola" : "sağa";
          return S({ kaz: "fbil.bileske", duzey: "uygulama", zorluk: 2, soru: `Duran bir kutuya sola doğru ${a} N, sağa doğru ${b} N kuvvet uygulanıyor. Kutuya etki eden kuvvetlerin dengelenmesi için üçüncü bir kuvvet hangi yönde ve kaç N olmalıdır?`,
            gorsel: G.kuvvet({ sol: [a], sag: [b], cisim: "kutu" }), dogru: `${f} N, ${y} doğru`,
            yanlis: [[`${f} N, ${ty} doğru`, "dikkat", "Bu yön bileşkenin yönüdür; dengelemek için bileşkeye zıt yönde kuvvet gerekir."], [`${a + b} N, ${y} doğru`, "islem", "Kuvvetleri topladın; önce zıt yönlü kuvvetlerin bileşkesini bul."],
              [`${Math.max(a, b)} N, ${y} doğru`, "kavrama", "Yalnızca büyük kuvveti dengelemeye çalıştın; diğer kuvvet de etki ediyor."]],
            ipucu: "Önce bileşkeyi bul; dengeleyen kuvvet bileşkeyle aynı büyüklükte ve zıt yönde olmalı.",
            cozum: [`Bileşke = ${Math.max(a, b)} − ${Math.min(a, b)} = ${f} N, ${ty} doğru.`, `Dengelemek için aynı büyüklükte (${f} N) ve zıt yönde (${y}) bir kuvvet uygulanmalı.`, "Böylece bileşke sıfır olur ve kuvvetler dengelenir."],
            kural: "Dengeleyici kuvvet = bileşke ile aynı büyüklükte, zıt yönde." }); },
        Q("fbil.bileske", "aciklama", 1, "Bileşke kuvvet nedir?", "Bir cisme etki eden kuvvetlerin yaptığı etkinin aynısını tek başına yapan kuvvet",
          [["Cisme etki eden en büyük kuvvet", "kavrama", "Bileşke, diğer kuvvetleri de hesaba katar; yalnızca en büyük kuvvet değildir."],
           ["Cisme etki eden kuvvetlerin sayısı", "kavrama", "Bileşke bir sayı adedi değil, bir kuvvettir; birimi N'dur."],
           ["Her durumda kuvvetlerin toplamı", "dikkat", "Toplam yalnızca aynı yönlü kuvvetlerde geçerlidir; zıt yönlülerde çıkarılır."]],
          "“Bileşke” sözcüğü “birleşmek” ile ilgilidir.",
          ["Bir cisme birden fazla kuvvet etki edebilir.", "Bu kuvvetlerin toplam etkisini tek başına yapan kuvvete bileşke kuvvet denir."],
          { kural: "Bileşke kuvvet: tüm kuvvetlerin yerine geçebilen tek kuvvet." }),
        z => { let s = R(3, 15), l = R(3, 15); if (s === l) return null; const f = s - l;
          const fYaz = f < 0 ? "−" + (-f) : "+" + f, tYaz = f < 0 ? "+" + (-f) : "−" + f;
          return S({ kaz: "fbil.bileske", duzey: "baglanti", zorluk: 2, soru: `Bir cisme sağa doğru ${s} N, sola doğru ${l} N kuvvet etki ediyor. Matematikteki tam sayılar gibi sağ yönü pozitif (+), sol yönü negatif (−) kabul edersek bileşke kuvvet hangi tam sayıyla gösterilir?`,
            gorsel: G.kuvvet({ sag: [s], sol: [l], cisim: "cisim" }), dogru: `${fYaz} N`,
            yanlis: [[`${tYaz} N`, "dikkat", "İşaret yanlış: bileşke büyük kuvvetin yönündedir; sağ +, sol −."], [`+${s + l} N`, "kavrama", "Zıt yönlü kuvvetleri topladın; (+" + s + ") + (−" + l + ") işlemini yap."],
              [`−${s + l} N`, "islem", "Tam sayılarda toplama: (+" + s + ") + (−" + l + ") = " + fYaz + "."]],
            ipucu: `(+${s}) + (−${l}) işlemini yap.`,
            cozum: [`Sağa ${s} N → +${s}, sola ${l} N → −${l}.`, `Bileşke = (+${s}) + (−${l}) = ${fYaz} N.`, `İşaret ${f > 0 ? "pozitif: bileşke sağa" : "negatif: bileşke sola"} doğrudur, büyüklüğü ${Math.abs(f)} N'dur.`],
            kural: "Zıt yönlü kuvvetler, sayı doğrusundaki pozitif ve negatif tam sayılar gibi toplanır." }); },
      ],
      "fbil.denge": [
        Q("fbil.denge", "hatirlama", 1, "Dengelenmiş kuvvetlerin bileşkesi kaç N'dur?", "0 N",
          [["Kuvvetlerin toplamı kadar", "kavrama", "Dengelenmiş kuvvetler birbirinin etkisini yok eder; bileşke toplam değil, sıfırdır."],
           ["En büyük kuvvet kadar", "kavrama", "Dengede kuvvetler eşit ve zıt yönlüdür; bileşke sıfırdır."],
           ["1 N", "dikkat", "Bileşke 1 N olsaydı kuvvetler dengelenmemiş olurdu."]],
          "Dengelenmiş kuvvetler birbirini ne yapar?",
          ["Dengelenmiş kuvvetler eşit büyüklükte ve zıt yönlüdür.", "Birbirlerinin etkisini yok ederler; bileşke sıfır olur."],
          { kural: "Dengelenmiş kuvvetler: bileşke = 0." }),
        Q("fbil.denge", "aciklama", 2, "Duran bir cisme etki eden kuvvetler dengelenmiş ise cisim için ne söylenebilir?", "Durmaya devam eder.",
          [["Harekete başlar.", "kavrama", "Harekete geçmesi için bileşkenin sıfırdan farklı olması gerekir."],
           ["Büyük kuvvetin yönünde hareket eder.", "kavrama", "Dengelenmiş kuvvetlerde büyük kuvvet yoktur; kuvvetler eşittir."],
           ["Önce titreşir, sonra hareket eder.", "bilgi", "Bileşke sıfır olduğu için hareket durumu değişmez."]],
          "Bileşke sıfırsa hareket durumu değişir mi?",
          ["Dengelenmiş kuvvetlerin bileşkesi sıfırdır.", "Bileşke sıfır olduğunda cismin hareket durumu değişmez.", "Duran cisim durmaya devam eder."],
          { kural: "Dengelenmiş kuvvetler hareket durumunu değiştirmez." }),
        Q("fbil.denge", "aciklama", 3, "Düz bir yolda sabit süratle giden bir arabaya etki eden kuvvetler dengelenmiş hâle geliyor. Araba için ne söylenebilir?", "Aynı süratle ve aynı yönde hareketine devam eder.",
          [["Yavaşlayıp durur.", "kavrama", "Bu çok yaygın bir yanılgıdır; durması için dengelenmemiş bir kuvvet gerekir."],
           ["Hızlanır.", "kavrama", "Hızlanma için hareket yönünde bir bileşke kuvvet gerekir."],
           ["Hemen durur.", "kavrama", "Bileşke sıfırken hareket durumu değişmez; hareket eden cisim durmaz."]],
          "Dengelenmiş kuvvetler hareket durumunu değiştirir mi?",
          ["Kuvvetler dengelenmişse bileşke sıfırdır.", "Bileşke sıfırken cismin hareket durumu değişmez.", "Araba aynı süratle aynı yönde gitmeye devam eder."],
          { kural: "Dengelenmiş kuvvet: duran durur, hareket eden sabit süratle devam eder." }),
        z => { const tip = sec(["denge", "sag", "sol"]); const a = R(3, 12); const b = tip === "denge" ? a : tip === "sag" ? a + R(2, 6) : Math.max(1, a - R(2, 5));
          const M = { denge: "Durmaya devam eder.", sag: "Sağa doğru harekete geçer.", sol: "Sola doğru harekete geçer." };
          const N = { denge: "Kuvvetler eşit ve zıt yönlü; bileşke sıfırdır, cisim durmaya devam eder.", sag: "Sağdaki kuvvet büyük; bileşke sağa doğrudur, cisim sağa doğru harekete geçer.", sol: "Soldaki kuvvet büyük; bileşke sola doğrudur, cisim sola doğru harekete geçer." };
          const yanlis = Object.keys(M).filter(k => k !== tip).map(k => [M[k], k === "denge" || tip === "denge" ? "kavrama" : "dikkat", N[k].split(";")[0] + " değil; kuvvetlerin büyüklüklerini yeniden karşılaştır."])
            .concat([["Önce sağa, sonra sola gider.", "kavrama", "Kuvvetler değişmediği sürece cisim yön değiştirmez."]]);
          return S({ kaz: "fbil.denge", duzey: "uygulama", zorluk: 2, soru: `Başlangıçta duran bir kutuya şekildeki kuvvetler etki ediyor (sola ${a} N, sağa ${b} N). Kutunun hareketi için ne söylenebilir?`,
            gorsel: G.kuvvet({ sol: [a], sag: [b], cisim: "kutu" }), dogru: M[tip], yanlis,
            ipucu: "Kuvvetler dengelenmiş mi, dengelenmemiş mi?",
            cozum: [`Sola ${a} N, sağa ${b} N kuvvet var.`, `Bileşke = ${Math.abs(a - b)} N${a === b ? "" : ", " + (b > a ? "sağa" : "sola") + " doğru"}.`, N[tip]],
            kural: "Bileşke 0 → hareket durumu değişmez; bileşke 0 değil → hareket durumu değişir." }); },
        Q("fbil.denge", "transfer", 2, "Halat çekme oyununda iki takım halatı eşit büyüklükte kuvvetlerle zıt yönlere çekiyor. Halat için ne söylenebilir?", "Kuvvetler dengelendiği için halat hareket etmez.",
          [["Halat iki takım arasında sürekli ileri geri gider.", "kavrama", "Kuvvetler eşit ve değişmiyorsa bileşke sıfırdır; halat hareketsiz kalır."],
           ["Halat, ilk çekmeye başlayan takımın yönünde hareket eder.", "kavrama", "Kimin önce başladığı değil, kuvvetlerin büyüklüğü önemlidir."],
           ["Halata hiç kuvvet etki etmez.", "kavrama", "Halata iki kuvvet etki eder; ancak bileşkeleri sıfırdır."]],
          "Eşit ve zıt yönlü kuvvetlerin bileşkesi nedir?",
          ["İki takım eşit büyüklükte, zıt yönlü kuvvet uyguluyor.", "Bileşke kuvvet sıfırdır; kuvvetler dengelenmiştir.", "Duran halat hareketsiz kalır."],
          { kural: "Kuvvet etki etmesi ile bileşkenin sıfır olması farklıdır: kuvvetler var ama birbirini dengeliyor." }),
        Q("fbil.denge", "uygulama", 2, "Aşağıdakilerden hangisinde cisme <b>dengelenmemiş</b> kuvvet etki etmektedir?", "Yeşil ışık yanınca duran otomobilin harekete geçmesi",
          [["Masanın üzerinde duran kitap", "kavrama", "Kitap duruyor ve durmaya devam ediyor; kuvvetler dengelenmiştir."],
           ["Tavana asılı, hareketsiz duran lamba", "kavrama", "Lambanın hareket durumu değişmiyor; kuvvetler dengelenmiştir."],
           ["Düz yolda sabit süratle aynı yönde giden tren", "kavrama", "Sabit süratle aynı yönde hareket eden cismin hareket durumu değişmez; kuvvetler dengelenmiştir."]],
          "Hareket durumu değişen cismi bul.",
          ["Dengelenmemiş kuvvet, cismin hareket durumunu değiştirir.", "Duran otomobilin harekete geçmesi hareket durumunun değiştiğini gösterir.", "Diğer seçeneklerde hareket durumu değişmiyor; kuvvetler dengelenmiş."],
          { kural: "Harekete geçme, hızlanma, yavaşlama, durma ve yön değiştirme → dengelenmemiş kuvvet." }),
        Q("fbil.denge", "baglanti", 3, "Ece, yerdeki ağır bir kutuyu 20 N'luk kuvvetle sağa doğru itiyor ama kutu hareket etmiyor. Bunun nedeni nedir?", "Sürtünme kuvvetinin 20 N büyüklüğünde ve ters yönde etki ederek kuvvetleri dengelemesi",
          [["Ece'nin kuvvetinin kutuya etki etmemesi", "kavrama", "Ece'nin kuvveti kutuya etki eder; ama tek kuvvet o değildir."],
           ["Sürtünme kuvvetinin 20 N'dan büyük olması", "kavrama", "Sürtünme 20 N'dan büyük olsaydı bileşke sola olurdu ve kutu sola kayardı; sürtünme itme kuvvetini ancak dengeler."],
           ["Kutunun kütlesinin kuvveti yok etmesi", "bilgi", "Kütle kuvveti yok etmez; kutuyu yerinde tutan, kuvvetlerin dengelenmesidir."]],
          "Sürtünme kuvveti konusunu hatırla: Sürtünme hangi yönde etki eder?",
          ["Kutu duruyor ve durmaya devam ediyor; demek ki kuvvetler dengelenmiş.", "Sürtünme kuvveti harekete zıt yönde (sola) etki eder.", "Bileşke sıfır olduğuna göre sürtünme kuvveti de 20 N'dur."],
          { kural: "Duran cisim itildiği hâlde hareket etmiyorsa sürtünme itme kuvvetini dengeliyordur." }),
        z => { const w = sec([500, 600, 700, 800]);
          return S({ kaz: "fbil.denge", duzey: "transfer", zorluk: 3, soru: `Paraşütüyle birlikte ${w} N ağırlığındaki bir paraşütçü, belli bir süre sonra yere doğru <b>sabit süratle</b> inmeye başlıyor. Bu sırada paraşütçüye yukarı doğru etki eden hava direnci kuvveti kaç N'dur?`,
            gorsel: G.kuvvet({ ust: [w], alt: [w], cisim: "paraşütçü" }).replace(">" + w + " N<", ">? N<"), dogru: `${w} N`,
            yanlis: [["0 N", "kavrama", "Paraşüt açık olduğu için hava direnci vardır; sıfır olsaydı paraşütçü hızlanırdı."], [`${w / 2} N`, "kavrama", "Hava direnci ağırlıktan küçük olsaydı paraşütçü hızlanırdı; sürat sabit."],
              [`${w * 2} N`, "kavrama", "Hava direnci ağırlıktan büyük olsaydı paraşütçü yavaşlardı."]],
            ipucu: "Sabit süratle hareket eden cisimde kuvvetler nasıldır?",
            cozum: ["Paraşütçü sabit süratle iniyor; hareket durumu değişmiyor.", "Demek ki ona etki eden kuvvetler dengelenmiş, bileşke sıfır.", `Aşağı doğru ${w} N ağırlık varsa yukarı doğru hava direnci de ${w} N olmalıdır.`],
            kural: "Sabit süratle hareket = dengelenmiş kuvvetler: zıt yönlü kuvvetler eşittir." }); },
      ],
    },
  });

  /* ==================== SABİT SÜRATLİ VE SABİT HIZLI HAREKET ==================== */
  KONU_EKLE("fen", {
    id: "f_hiz", tema: "f2", ad: "Sabit Süratli ve Sabit Hızlı Hareket",
    kazanimlar: [
      { id: "fhiz.surat", ad: "Sürati hesaplama ve birimlerini dönüştürme" },
      { id: "fhiz.grafik", ad: "Yol–zaman tablosu ve grafiğini yorumlama" },
      { id: "fhiz.hiz", ad: "Sürat ile hız arasındaki farkı açıklama" },
    ],
    anlatim: [
      { baslik: "Sürat nedir?",
        metin: "Bir cismin <b>birim zamanda aldığı yola</b> sürat denir.<br><b>Sürat = alınan yol ÷ geçen süre</b><br>Yol metre (m), süre saniye (s) ise sürat <b>m/s</b>; yol kilometre (km), süre saat (sa) ise sürat <b>km/sa</b> olur. Sürati sabit olan cisim eşit zaman aralıklarında eşit yollar alır; buna <b>sabit süratli hareket</b> denir.",
        ornek: "Bir bisikletli 120 m'yi 20 saniyede gidiyor. Sürat = 120 ÷ 20 = 6 m/s.",
        gorsel: G.yol([{ x: 0, ad: "0 m" }, { x: 60, ad: "60 m" }, { x: 120, ad: "120 m" }]),
        durak: { soru: "Bir koşucu 200 m'yi 25 saniyede koşuyor. Sürati kaç m/s'dir?", secenekler: [
          ["8 m/s", true, "200 ÷ 25 = 8 m/s."],
          ["5000 m/s", false, "Yolu süreyle çarptın; sürat = yol ÷ süre."],
          ["175 m/s", false, "Yoldan süreyi çıkardın; bölme yapmalısın."],
          ["225 m/s", false, "Yol ile süreyi topladın; bölme yapmalısın."]] } },
      { baslik: "Birim dönüşümleri",
        metin: "1 km = 1000 m, 1 saat = 60 dakika = 3600 saniye.<br><b>km/sa → m/s:</b> 3,6'ya böl. <b>m/s → km/sa:</b> 3,6 ile çarp.<br>Çünkü 1 km/sa = 1000 m ÷ 3600 s'dir.",
        ornek: "72 km/sa = 72 ÷ 3,6 = 20 m/s. 10 m/s = 10 × 3,6 = 36 km/sa.",
        gorsel: G.tablo(["km/sa", "m/s"], [["18", "5"], ["36", "10"], ["72", "20"], ["108", "30"]]),
        durak: { soru: "54 km/sa kaç m/s'dir?", secenekler: [
          ["15 m/s", true, "54 ÷ 3,6 = 15 m/s."],
          ["194,4 m/s", false, "3,6 ile çarptın; km/sa'ten m/s'ye geçerken bölünür."],
          ["0,9 m/s", false, "Yalnızca saati dakikaya çevirip 60'a böldün."],
          ["54000 m/s", false, "Yalnızca km'yi m'ye çevirdin; saati saniyeye çevirmeyi unuttun."]] } },
      { baslik: "Yol–zaman tablosu ve grafiği",
        metin: "Sabit süratli harekette yol ile zaman <b>doğru orantılıdır</b>: süre 2 katına çıkınca yol da 2 katına çıkar.<br>Yol–zaman grafiği, başlangıç noktasından geçen <b>eğik bir doğrudur</b>. Doğru ne kadar <b>dikse</b> sürat o kadar <b>büyüktür</b>. Grafik <b>yatay</b> ise cisim o aralıkta <b>duruyordur</b> (yol değişmiyor).",
        ornek: "Bir cisim her saniye 5 m yol alıyorsa: 1 s → 5 m, 2 s → 10 m, 3 s → 15 m. Sürat 5 m/s.",
        gorsel: grafik({ seriler: [{ ad: "K", nokta: [[0, 0], [4, 40]] }, { ad: "L", nokta: [[0, 0], [4, 20]], kesik: true }], xMax: 4, yMax: 40, xAdim: 1, yAdim: 10 }),
        durak: { soru: "Grafikteki K ve L araçlarından hangisi daha süratlidir?", secenekler: [
          ["K", true, "K'nin doğrusu daha diktir: 4 saniyede 40 m (10 m/s); L ise 4 saniyede 20 m (5 m/s)."],
          ["L", false, "Eğimi az olan doğru daha yavaş hareketi gösterir."],
          ["İkisi eşit süratlidir.", false, "Aynı sürede farklı yollar aldıkları için süratleri farklıdır."],
          ["Grafikten anlaşılamaz.", false, "Aynı süredeki yolları karşılaştırarak anlaşılır."]] } },
      { baslik: "Sürat ve hız",
        metin: "Sürat yalnızca “ne kadar çabuk” sorusunu yanıtlar. <b>Hız</b> ise süratin <b>yönüyle birlikte</b> ifade edilmesidir: “doğuya doğru 20 m/s” bir hızdır.<br>Düz bir yolda <b>aynı yönde sabit süratle</b> giden cisim <b>sabit hızlı</b> hareket eder. Dairesel bir pistte sabit süratle dönen cismin sürati sabittir ama yönü sürekli değiştiği için <b>hızı değişir</b>.",
        ornek: "Biri doğuya, diğeri batıya 20 m/s ile giden iki aracın süratleri eşit, hızları farklıdır.",
        durak: { soru: "Hangisi bir hız bilgisidir?", secenekler: [
          ["Kuzeye doğru 60 km/sa", true, "Hem büyüklük hem yön verilmiş: hız."],
          ["60 km/sa", false, "Yön yok; bu bir sürattir."],
          ["Kuzeye doğru 60 km", false, "Bu bir yol (konum değişimi) bilgisidir; birim km/sa değil."],
          ["60 dakika", false, "Bu bir süre bilgisidir."]] } },
    ],
    uret: {
      "fhiz.surat": [
        z => { const yol = sec([120, 150, 180, 240, 300, 360]), sure = sec([20, 30, 40, 50, 60]); if (yol % sure) return null; const v = yol / sure;
          return S({ kaz: "fhiz.surat", duzey: "uygulama", zorluk: 1, soru: `Bir bisikletli ${yol} metreyi ${sure} saniyede gidiyor. Bisikletlinin sürati kaç m/s'dir?`,
            gorsel: G.yol([{ x: 0, ad: "0 m" }, { x: yol, ad: yol + " m" }]), dogru: v + " m/s",
            yanlis: [[yol * sure + " m/s", "kavrama", "Yolu süreyle çarptın; sürat = yol ÷ süre."], [(yol - sure) + " m/s", "islem", "Yoldan süreyi çıkardın; bölme yapmalısın."], [(yol + sure) + " m/s", "islem", "Yol ile süreyi topladın; bölme yapmalısın."]],
            ipucu: "Sürat = alınan yol ÷ geçen süre.", cozum: [`Verilenler: yol ${yol} m, süre ${sure} s.`, `Sürat = ${yol} ÷ ${sure} = ${v} m/s.`],
            kural: "Sürat = yol ÷ zaman; birimi m/s veya km/sa." }); },
        z => { const v = sec([40, 50, 60, 70, 80, 90]), t = sec([2, 3, 4, 5]), yol = v * t;
          return S({ kaz: "fhiz.surat", duzey: "uygulama", zorluk: 2, soru: `Bir otobüs iki şehir arasındaki ${yol} km'lik yolu sabit süratle ${t} saatte gidiyor. Otobüsün sürati kaç km/sa'tir?`, dogru: v + " km/sa",
            yanlis: [[yol * t + " km/sa", "kavrama", "Yolu süreyle çarptın; sürat = yol ÷ süre."], [yol + " km/sa", "dikkat", "Toplam yolu sürat sandın; sürat bir saatte alınan yoldur."], [(v + 10) + " km/sa", "islem", `Bölmeyi kontrol et: ${v + 10} × ${t} = ${(v + 10) * t}, ${yol} değil.`]],
            ipucu: "Otobüs bir saatte kaç km yol alır?", cozum: [`Yol ${yol} km, süre ${t} saat.`, `Sürat = ${yol} ÷ ${t} = ${v} km/sa.`, `Sağlama: ${v} × ${t} = ${yol} km.`],
            kural: "km/sa: bir saatte alınan kilometre." }); },
        z => { const v = sec([5, 8, 10, 12, 15, 20, 25]), t = sec([4, 6, 8, 10, 12]), d = v * t;
          return S({ kaz: "fhiz.surat", duzey: "uygulama", zorluk: 2, soru: `Sabit ${v} m/s süratle koşan bir atlet ${t} saniyede kaç metre yol alır?`,
            gorsel: G.yol([{ x: 0, ad: "0 s" }, { x: t, ad: t + " s" }], { arac: "🏃" }), dogru: d + " m",
            yanlis: [[(v + t) + " m", "islem", "Sürat ile süreyi topladın; yol = sürat × süre."], [v * (t + 1) + " m", "dikkat", "Bir saniye fazla hesapladın."], [d + " m/s", "kavrama", "Sonuç bir yoldur; birimi m olmalı, m/s değil."]],
            ipucu: "Her saniyede kaç metre gidiyor? Bunu kaç saniye yapıyor?",
            cozum: [`Atlet her saniyede ${v} m yol alıyor.`, `${t} saniyede: ${v} × ${t} = ${d} m.`],
            kural: "Yol = sürat × zaman." }); },
        z => { const v = sec([4, 5, 8, 10, 15, 20]), t = sec([3, 6, 9, 12, 15]), d = v * t;
          return S({ kaz: "fhiz.surat", duzey: "uygulama", zorluk: 2, soru: `Sabit ${v} m/s süratle giden bir kaykaycı ${d} m'lik yolu kaç saniyede alır?`, dogru: t + " s",
            yanlis: [[d * v + " s", "kavrama", "Yolu süratle çarptın; süre = yol ÷ sürat."], [(d - v) + " s", "islem", "Yoldan sürati çıkardın; bölme yapmalısın."], [(t + 2) + " s", "islem", `Sağlama yap: ${v} × ${t + 2} = ${v * (t + 2)}, ${d} değil.`]],
            ipucu: "Her saniyede " + v + " m gidiyorsa " + d + " m'yi kaç saniyede bitirir?",
            cozum: [`Yol ${d} m, sürat ${v} m/s.`, `Süre = yol ÷ sürat = ${d} ÷ ${v} = ${t} s.`, `Sağlama: ${v} × ${t} = ${d} m.`],
            kural: "Zaman = yol ÷ sürat." }); },
        z => { const k = sec([18, 36, 54, 72, 90, 108]), m = k / 3.6;
          return S({ kaz: "fhiz.surat", duzey: "uygulama", zorluk: 3, soru: `Bir otomobilin sürati ${k} km/sa'tir. Bu sürat kaç m/s'dir?`, dogru: od(m) + " m/s",
            yanlis: [[od(k * 3.6) + " m/s", "islem", "3,6 ile çarptın; km/sa'ten m/s'ye geçerken 3,6'ya bölünür."], [od(k / 60) + " m/s", "kavrama", "Yalnızca saati dakikaya çevirdin; km'yi metreye, saati saniyeye çevirmelisin."],
              [k * 1000 + " m/s", "kavrama", "Yalnızca km'yi m'ye çevirdin; saati de saniyeye (3600 s) çevirmelisin."]],
            ipucu: "1 km = 1000 m, 1 saat = 3600 s.",
            cozum: [`${k} km/sa = ${k} × 1000 m ÷ 3600 s.`, `Bu, ${k} ÷ 3,6 demektir.`, `${k} ÷ 3,6 = ${od(m)} m/s.`],
            kural: "km/sa → m/s: 3,6'ya böl. m/s → km/sa: 3,6 ile çarp." }); },
        z => { const m = sec([5, 10, 15, 20, 25, 30]), k = m * 3.6;
          return S({ kaz: "fhiz.surat", duzey: "transfer", zorluk: 3, soru: `Bir yolda hız sınırı 50 km/sa'tir. Bu yolda ölçülen bir aracın sürati ${m} m/s'dir. Aracın sürati kaç km/sa'tir ve hız sınırına uyuyor mu?`,
            dogru: `${od(k)} km/sa; ${k <= 50 ? "uyuyor" : "uymuyor"}`,
            yanlis: [[`${od(m / 3.6)} km/sa; uyuyor`, "islem", "3,6'ya böldün; m/s'den km/sa'e geçerken 3,6 ile çarpılır."], [`${m} km/sa; uyuyor`, "kavrama", "Birimi çevirmeden karşılaştırdın; m/s ile km/sa aynı birim değildir."],
              [`${od(k)} km/sa; ${k <= 50 ? "uymuyor" : "uyuyor"}`, "dikkat", "Dönüşüm doğru ama karşılaştırma yanlış; 50 ile karşılaştır."]],
            ipucu: "Önce m/s'yi km/sa'e çevir: 3,6 ile çarp.",
            cozum: [`${m} m/s = ${m} × 3,6 = ${od(k)} km/sa.`, `${od(k)} ${k <= 50 ? "≤" : ">"} 50.`, k <= 50 ? "Araç hız sınırına uyuyor." : "Araç hız sınırını aşıyor."],
            kural: "Karşılaştırma yapmadan önce birimleri aynı yap." }); },
        z => { const ad = karistir(["Ayşe", "Can", "Elif"]); const v = karistir([2, 3, 4, 5, 6, 8]).slice(0, 3), t = v.map(() => sec([10, 20, 30, 40, 50]));
          const d = v.map((x, i) => x * t[i]); const enH = v.indexOf(Math.max(...v)), enY = d.indexOf(Math.max(...d));
          if (enH === enY) { const j = (enH + 1) % 3; t[j] = Math.ceil((d[enH] + 10) / v[j] / 10) * 10; d[j] = v[j] * t[j]; }
          const yanlis = [0, 1, 2].filter(i => i !== enH).map(i => [ad[i], d[i] === Math.max(...d) ? "kavrama" : "islem", `${ad[i]}: ${d[i]} ÷ ${t[i]} = ${v[i]} m/s; ${d[i] === Math.max(...d) ? "en uzun yolu gitmiş ama daha uzun sürede gitmiş." : "daha yavaş."}`])
            .concat([["Üçünün sürati eşittir", "islem", "Her birinin yolunu süresine böl; sonuçlar farklıdır."]]);
          return S({ kaz: "fhiz.surat", duzey: "transfer", zorluk: 3, soru: "Üç arkadaşın koştuğu yollar ve süreler tabloda verilmiştir. Sürati en büyük olan kimdir?",
            gorsel: G.tablo(["Ad", "Alınan yol", "Geçen süre"], ad.map((a, i) => [a, d[i] + " m", t[i] + " s"])), dogru: ad[enH], yanlis,
            ipucu: "En uzun yolu giden değil, birim zamanda en çok yol alan en süratlidir.",
            cozum: ad.map((a, i) => `${a}: ${d[i]} ÷ ${t[i]} = ${v[i]} m/s`).concat([`En büyük sürat ${v[enH]} m/s ile ${ad[enH]}.`]),
            kural: "Süratleri karşılaştırmak için her birinin yolunu süresine böl." }); },
        Q("fhiz.surat", "hatirlama", 1, "Aşağıdakilerden hangisi bir sürat birimidir?", "km/sa",
          [["km", "kavrama", "Kilometre bir uzunluk (yol) birimidir."],
           ["saniye", "kavrama", "Saniye bir zaman birimidir."],
           ["N", "bilgi", "Newton kuvvet birimidir."]],
          "Sürat = yol ÷ zaman. Birimi de yol birimi ÷ zaman birimi olur.",
          ["Sürat, yolun zamana bölünmesiyle bulunur.", "Bu yüzden birimi de “uzunluk birimi / zaman birimi” biçimindedir: m/s, km/sa."],
          { kural: "Sürat birimleri: m/s, km/sa." }),
      ],
      "fhiz.grafik": [
        z => { const v = sec([2, 3, 4, 5, 6, 8, 10]), st = sec([1, 2, 5]); const T = [0, 1, 2, 3, 4].map(i => i * st), Y = T.map(t => t * v);
          const tS = T[4], yS = Y[4];
          return S({ kaz: "fhiz.grafik", duzey: "uygulama", zorluk: 1, soru: "Sabit süratle hareket eden bir oyuncak arabanın yol–zaman tablosu verilmiştir. Arabanın sürati kaç m/s'dir?",
            gorsel: G.tablo(["Zaman (s)"].concat(T), [["Yol (m)"].concat(Y)]), dogru: v + " m/s",
            yanlis: [[yS + " m/s", "dikkat", "Son satırdaki yolu sürat sandın; yolu süreye bölmelisin."], [v * st + " m/s", "kavrama", `Ardışık iki sütun arasındaki süre ${st} s; bu sürede alınan yolu ${st}'e bölmelisin.`],
              [yS * tS + " m/s", "kavrama", "Yolu süreyle çarptın; sürat = yol ÷ süre."], [(v + 2) + " m/s", "islem", "Bölmeyi kontrol et."]],
            ipucu: "Herhangi bir sütundaki yolu o sütundaki süreye böl.",
            cozum: [`Örneğin ${tS} s'de ${yS} m yol alınmış.`, `Sürat = ${yS} ÷ ${tS} = ${v} m/s.`, "Her sütunda yol ÷ süre aynı çıkar; sürat sabittir."],
            kural: "Sabit süratli harekette yol ÷ zaman her zaman aynı sayıyı verir." }); },
        z => { const v = sec([3, 4, 5, 6, 7, 8, 9, 12]), st = sec([1, 2, 3]); const T = [0, 1, 2, 3, 4].map(i => i * st), k = R(2, 4), Y = T.map((t, i) => i === k ? "?" : t * v), dg = T[k] * v;
          return S({ kaz: "fhiz.grafik", duzey: "uygulama", zorluk: 2, soru: "Sabit süratle yürüyen bir öğrencinin yol–zaman tablosunda bir değer silinmiştir. Soru işaretinin yerine hangi değer gelmelidir?",
            gorsel: G.tablo(["Zaman (s)"].concat(T), [["Yol (m)"].concat(Y)]), dogru: dg + " m",
            yanlis: [[(dg + v * st) + " m", "dikkat", "Bir sonraki sütunun değerini buldun."], [(dg - v * st) + " m", "dikkat", "Bir önceki sütunun değerini buldun."], [(T[k] + v) + " m", "islem", "Süre ile sürati topladın; yol = sürat × süre."], [(2 * dg) + " m", "islem", "Çarpmayı kontrol et."]],
            ipucu: "Önce sürati bul, sonra o süreyle çarp.",
            cozum: [`Sürat = ${T[1] * v} ÷ ${T[1]} = ${v} m/s.`, `${T[k]} s'deki yol = ${v} × ${T[k]} = ${dg} m.`],
            kural: "Sabit süratte eşit zaman aralıklarında eşit yollar alınır." }); },
        z => { const t = sec([4, 5, 6, 8, 10]), v = sec([2, 3, 4, 5, 10, 15, 20]), d = v * t, xA = t <= 6 ? 1 : 2;
          return S({ kaz: "fhiz.grafik", duzey: "uygulama", zorluk: 2, soru: "Şekilde sabit süratle hareket eden bir koşucunun yol–zaman grafiği verilmiştir. Koşucunun sürati kaç m/s'dir?",
            gorsel: grafik({ seriler: [{ nokta: [[0, 0], [t, d]] }], xMax: t, yMax: d, xAdim: xA, yAdim: v * xA }), dogru: v + " m/s",
            yanlis: [[d + " m/s", "dikkat", "Grafikteki son yolu sürat sandın; yolu süreye böl."], [d * t + " m/s", "kavrama", "Yolu süreyle çarptın."], [v * xA === v ? (v + 1) + " m/s" : v * xA + " m/s", "islem", xA === 1 ? "Grafiği yeniden oku ve bölmeyi kontrol et." : "Bir kare aralığında alınan yolu sürat sandın; bir kare aralığı 2 saniyedir."], [(v + 2) + " m/s", "islem", "Bölmeyi kontrol et."]],
            ipucu: "Grafikteki son noktayı oku: kaç saniyede kaç metre?",
            cozum: [`Grafikte ${t} saniyede ${d} m yol alınmıştır.`, `Sürat = ${d} ÷ ${t} = ${v} m/s.`],
            kural: "Yol–zaman grafiğinde herhangi bir noktadaki yol ÷ zaman = sürat." }); },
        z => { const vL = sec([2, 3, 4, 5]), k = sec([2, 3]), vK = vL * k, T = 6;
          return S({ kaz: "fhiz.grafik", duzey: "aciklama", zorluk: 3, soru: "Şekilde K ve L araçlarının yol–zaman grafikleri verilmiştir. K aracının sürati, L aracının süratinin kaç katıdır?",
            gorsel: grafik({ seriler: [{ ad: "K", nokta: [[0, 0], [T, vK * T]] }, { ad: "L", nokta: [[0, 0], [T, vL * T]], kesik: true }], xMax: T, yMax: vK * T, xAdim: 1, yAdim: vK * T / 6 }),
            dogru: `${k} katı`,
            yanlis: [[`${k + 1} katı`, "islem", "Grafikten değerleri yeniden oku ve böl."], ["Süratleri eşittir", "kavrama", "Aynı sürede farklı yollar aldıkları için süratleri farklıdır."], ["L, K'den daha süratlidir", "kavrama", "Daha dik olan doğru daha büyük sürati gösterir; K'nin doğrusu daha diktir."]],
            ipucu: "Aynı sürede (örneğin 6 s'de) iki aracın aldığı yolları karşılaştır.",
            cozum: [`6 saniyede K ${vK * T} m, L ${vL * T} m yol alıyor.`, `K'nin sürati ${vK} m/s, L'nin sürati ${vL} m/s.`, `${vK} ÷ ${vL} = ${k}; K, L'den ${k} kat süratlidir.`],
            kural: "Yol–zaman grafiğinde doğru ne kadar dikse sürat o kadar büyüktür." }); },
        Q("fhiz.grafik", "aciklama", 2, "Şekildeki yol–zaman grafiğine göre cisim 2. ve 4. saniyeler arasında ne yapmaktadır?", "Durmaktadır.",
          [["Sabit süratle hareket etmektedir.", "kavrama", "Yatay çizgi yolun değişmediğini gösterir; cisim yol almıyorsa hareket etmiyordur."],
           ["Süratlenmektedir.", "kavrama", "Süratlenseydi grafik daha dik hâle gelirdi."],
           ["Geri dönmektedir.", "kavrama", "Geri dönseydi alınan yol değil, başlangıca uzaklık azalırdı; burada değer sabittir."]],
          "Bu aralıkta yol değeri değişiyor mu?",
          ["2. saniyede yol 20 m, 4. saniyede de yol 20 m.", "İki saniye boyunca hiç yol alınmamış; grafik yatay.", "Demek ki cisim bu aralıkta durmaktadır."],
          { gorsel: grafik({ seriler: [{ nokta: [[0, 0], [2, 20], [4, 20], [6, 50]] }], xMax: 6, yMax: 50, xAdim: 1, yAdim: 10 }),
            kural: "Yol–zaman grafiğinde yatay çizgi = cisim duruyor." }),
        Q("fhiz.grafik", "aciklama", 2, "Sabit süratle hareket eden bir cismin yol–zaman grafiği nasıldır?", "Başlangıç noktasından geçen eğik bir doğru",
          [["Zaman eksenine paralel yatay bir doğru", "kavrama", "Yatay doğru, yolun değişmediğini, yani cismin durduğunu gösterir."],
           ["Yol eksenine paralel dikey bir doğru", "kavrama", "Dikey doğru, sıfır sürede yol alınması demektir; bu mümkün değildir."],
           ["Giderek dikleşen bir eğri", "kavrama", "Giderek dikleşen eğri, süratin arttığını gösterir."]],
          "Eşit zamanlarda eşit yollar alınırsa noktalar nasıl dizilir?",
          ["Sabit süratte her saniye aynı miktarda yol alınır.", "Noktalar aynı doğru üzerinde dizilir.", "Başlangıçta yol 0 olduğu için doğru başlangıç noktasından geçer."],
          { kural: "Sabit sürat → yol–zaman grafiği eğik doğru." }),
        z => { const A = [["Bisiklet", sec([15, 20, 25])], ["Otobüs", sec([60, 70, 80])], ["Tren", sec([100, 120])], ["Motosiklet", sec([40, 50])]]; const t = sec([2, 3, 4]);
          const mx = A.reduce((a, b) => b[1] > a[1] ? b : a), mn = A.reduce((a, b) => b[1] < a[1] ? b : a);
          return S({ kaz: "fhiz.grafik", duzey: "transfer", zorluk: 3, soru: `Grafikte dört taşıtın sabit süratleri verilmiştir. En süratli taşıt ${t} saatte kaç km yol alır?`,
            gorsel: G.sutun(A, { baslik: "Taşıtların süratleri", birim: "km/sa" }), dogru: mx[1] * t + " km",
            yanlis: [[mx[1] + " km", "dikkat", `Bu, bir saatte alınan yoldur; ${t} saatle çarpmalısın.`], [mn[1] * t + " km", "dikkat", "En yavaş taşıtı seçtin; en uzun sütun en süratli taşıttır."], [(mx[1] + t) + " km", "islem", "Sürat ile süreyi topladın; yol = sürat × zaman."]],
            ipucu: "En uzun sütunu bul, sonra yol = sürat × zaman.",
            cozum: [`En uzun sütun ${mx[0]}: ${mx[1]} km/sa.`, `${t} saatte: ${mx[1]} × ${t} = ${mx[1] * t} km.`],
            kural: "Yol = sürat × zaman." }); },
        Q("fhiz.grafik", "baglanti", 2, "Sabit süratle giden bir aracın aldığı yol ile geçen süre arasındaki ilişki, matematikteki hangi ilişkiye örnektir?", "Doğru orantı: süre 2 katına çıkınca yol da 2 katına çıkar.",
          [["Ters orantı: süre artınca yol azalır.", "kavrama", "Daha uzun süre giden araç daha çok yol alır; yol azalmaz."],
           ["Hiçbir ilişki yoktur.", "kavrama", "Sabit süratte yol, süreyle düzenli olarak artar."],
           ["Süre 2 katına çıkınca yol 4 katına çıkar.", "islem", "Sabit süratte yol, süreyle aynı oranda artar: 2 kat süre → 2 kat yol."]],
          "1 saatte 60 km giden araç 2 saatte kaç km gider?",
          ["Sabit süratte her saatte aynı yol alınır.", "Süre 2 katına çıkınca yol da 2 katına, 3 katına çıkınca 3 katına çıkar.", "Bu, doğru orantıdır; yol ÷ zaman oranı (sürat) sabittir."],
          { kural: "Sabit süratte yol ve zaman doğru orantılıdır; oran = sürat." }),
      ],
      "fhiz.hiz": [
        Q("fhiz.hiz", "hatirlama", 1, "Hız ile sürat arasındaki fark nedir?", "Hız, süratin yönüyle birlikte ifade edilmesidir.",
          [["Hız ile sürat tamamen aynı şeydir.", "kavrama", "Günlük dilde karıştırılsa da bilimde hız yön de içerir."],
           ["Sürat yön bildirir, hız bildirmez.", "kavrama", "Tersi doğrudur: hız yön bildirir, sürat bildirmez."],
           ["Hızın birimi N'dur.", "bilgi", "N kuvvet birimidir; hız ve süratin birimi m/s veya km/sa'tir."]],
          "“Kuzeye doğru 50 km/sa” ifadesinde fazladan hangi bilgi var?",
          ["Sürat yalnızca birim zamanda alınan yolu bildirir.", "Hız ise sürate ek olarak hareketin yönünü de bildirir."],
          { kural: "Hız = sürat + yön." }),
        Q("fhiz.hiz", "aciklama", 2, "Bir atlet dairesel bir pistte sabit süratle koşuyor. Atletin hareketi için ne söylenebilir?", "Sürati sabittir ama yönü sürekli değiştiği için hızı değişir.",
          [["Hem sürati hem hızı sabittir.", "kavrama", "Dairesel pistte yön sürekli değişir; yön değişince hız da değişir."],
           ["Hızı sabittir ama sürati değişir.", "kavrama", "Sürati sabit verilmiş; değişen yön olduğu için değişen hızdır."],
           ["Hem sürati hem hızı sürekli artar.", "dikkat", "Soruda sürat sabit verilmiş."]],
          "Dairesel pistte koşarken yönün değişir mi?",
          ["Atlet eşit zamanlarda eşit yollar alıyor: sürati sabit.", "Dairesel pistte hareket yönü sürekli değişiyor.", "Hız yön içerdiği için yön değişince hız da değişir."],
          { kural: "Sabit hızlı hareket için hem sürat hem yön sabit olmalıdır." }),
        Q("fhiz.hiz", "uygulama", 1, "Aşağıdakilerden hangisi bir <b>hız</b> bilgisidir?", "Doğuya doğru 15 m/s",
          [["15 m/s", "kavrama", "Yön bilgisi olmadığı için bu bir sürattir."],
           ["Doğuya doğru 15 m", "dikkat", "Birim metre olduğu için bu bir yol bilgisidir."],
           ["15 saniye", "bilgi", "Bu bir süre bilgisidir."]],
          "Hem büyüklük hem yön içeren seçeneği bul.",
          ["Hız bilgisinde sürat (m/s veya km/sa) ve yön birlikte bulunur.", "“Doğuya doğru 15 m/s” ifadesi ikisini de içerir."],
          { kural: "Hız: büyüklük (m/s, km/sa) + yön (doğuya, kuzeye…)." }),
        Q("fhiz.hiz", "uygulama", 2, "Aşağıdakilerden hangisi <b>sabit hızlı</b> harekete örnektir?", "Düz bir rayda aynı yönde sabit 90 km/sa süratle giden tren",
          [["Virajı sabit süratle dönen otomobil", "kavrama", "Sürati sabit ama virajda yönü değiştiği için hızı değişir."],
           ["Sabit süratle dönen dönme dolaptaki kabin", "kavrama", "Dairesel harekette yön sürekli değişir; hız sabit değildir."],
           ["Duraklarda durup kalkan otobüs", "kavrama", "Otobüsün sürati sürekli değişiyor."]],
          "Hem sürat hem yön sabit olmalı.",
          ["Sabit hızlı hareket için sürat ve yön değişmemelidir.", "Düz rayda aynı yönde sabit süratle giden trenin sürati de yönü de sabittir.", "Diğer örneklerde ya sürat ya da yön değişiyor."],
          { kural: "Sabit hız = düz bir yolda, aynı yönde, sabit sürat." }),
        z => { const durum = sec(["ayniV_zit", "ayniV_ayni", "farkV_ayni", "farkV_zit"]);
          const v1 = sec([10, 15, 20, 25]), v2 = durum.startsWith("ayniV") ? v1 : v1 + sec([5, 10]);
          const y1 = sec(["doğu", "batı"]), y2 = durum.endsWith("zit") ? (y1 === "doğu" ? "batı" : "doğu") : y1;
          const M = { ee: "Süratleri de hızları da eşittir.", ef: "Süratleri eşit, hızları farklıdır.", ff: "Süratleri de hızları da farklıdır.", fe: "Hızları eşit, süratleri farklıdır." };
          const dk = v1 === v2 ? (y1 === y2 ? "ee" : "ef") : "ff";
          const N = { ee: "Süratler ve yönler aynı olduğu için hızlar da eşittir.", ef: "Süratler eşit ama yönler farklı; yön farklıysa hızlar farklıdır.", ff: "Süratler farklı; sürati farklı olan araçların hızları da farklıdır.", fe: "Hızlar eşitse süratler de eşit olmak zorundadır; bu seçenek hiçbir durumda doğru olamaz." };
          const yanlis = Object.keys(M).filter(k => k !== dk).map(k => [M[k], k === "fe" ? "kavrama" : "dikkat", N[k] + " Şekildeki süratleri ve yönleri yeniden karşılaştır."]);
          return S({ kaz: "fhiz.hiz", duzey: "transfer", zorluk: 2, soru: "Şekilde K ve L araçlarının süratleri ve hareket yönleri gösterilmiştir. Bu araçlar için hangisi doğrudur?",
            gorsel: ikiArac({ ad: "K", simge: "🚗", v: v1, yon: y1 }, { ad: "L", simge: "🚙", v: v2, yon: y2 }), dogru: M[dk], yanlis,
            ipucu: "Önce süratleri, sonra yönleri karşılaştır.",
            cozum: [`K: ${y1}ya doğru ${v1} m/s; L: ${y2}ya doğru ${v2} m/s.`, v1 === v2 ? "Süratler eşittir." : "Süratler farklıdır.", N[dk]],
            kural: "Hızların eşit olması için hem süratlerin hem yönlerin aynı olması gerekir." }); },
        Q("fhiz.hiz", "transfer", 3, "Otomobillerdeki “hız göstergesi” aslında aracın süratini gösterir. Bunun nedeni nedir?", "Gösterge yön bilgisi vermez; yalnızca birim zamanda alınan yolu gösterir.",
          [["Gösterge aracın gittiği yönü de gösterdiği için", "kavrama", "Gösterge yön göstermez; yön gösterseydi hızı göstermiş olurdu."],
           ["Gösterge km/sa yerine metre gösterdiği için", "bilgi", "Göstergenin birimi km/sa'tir; bu bir sürat birimidir."],
           ["Araç hep düz yolda gittiği için", "kavrama", "Araç virajda dönse de gösterge aynı biçimde çalışır; yön bilgisi vermez."]],
          "Göstergede “kuzeye”, “doğuya” gibi bir bilgi var mı?",
          ["Göstergede yalnızca “80 km/sa” gibi bir sayı ve birim görülür.", "Yön bilgisi olmadığı için bu değer sürattir.", "Hız için yön de bilinmelidir."],
          { kural: "Yön yoksa sürat; yön varsa hız." }),
        Q("fhiz.hiz", "baglanti", 3, "Düz bir yolda sabit hızla giden bir otomobile etki eden kuvvetlerin bileşkesi için ne söylenebilir?", "Sıfırdır; kuvvetler dengelenmiştir.",
          [["Hareket yönündedir.", "kavrama", "Bileşke hareket yönünde olsaydı otomobil hızlanırdı."],
           ["Harekete ters yöndedir.", "kavrama", "Bileşke harekete ters olsaydı otomobil yavaşlardı."],
           ["Motorun kuvvetine eşittir.", "kavrama", "Motorun kuvveti sürtünme ve hava direnciyle dengelenir; bileşke sıfırdır."]],
          "Bileşke kuvvet konusunu hatırla: Hareket durumu değişmeyen cisimde kuvvetler nasıldır?",
          ["Sabit hızla giden otomobilin sürati ve yönü değişmez.", "Hareket durumu değişmeyen cisme etki eden kuvvetler dengelenmiştir.", "Dengelenmiş kuvvetlerin bileşkesi sıfırdır."],
          { kural: "Sabit hız ↔ bileşke kuvvet sıfır (dengelenmiş kuvvetler)." }),
        z => { const v = sec([4, 5, 6, 8]), t = sec([10, 20, 30]);
          return S({ kaz: "fhiz.hiz", duzey: "baglanti", zorluk: 2, soru: `Bir bisikletli düz bir yolda doğuya doğru ${v} m/s süratle gidiyor. Bisikletliye etki eden kuvvetler dengelenmiştir. ${t} saniye sonra bisikletlinin hızı ne olur?`,
            dogru: `Doğuya doğru ${v} m/s`,
            yanlis: [["0 m/s (durur)", "kavrama", "Dengelenmiş kuvvetler hareketli cismi durdurmaz; cisim aynı hızla devam eder."], [`Doğuya doğru ${v * t} m/s`, "islem", "Sürati süreyle çarptın; bu, alınan yolu verir (metre), hızı değil."],
              [`Batıya doğru ${v} m/s`, "kavrama", "Yön değiştirmesi için dengelenmemiş bir kuvvet gerekirdi."]],
            ipucu: "Dengelenmiş kuvvetler hareket durumunu değiştirir mi?",
            cozum: ["Kuvvetler dengelenmiş, bileşke sıfır.", "Bileşke sıfır olduğu için sürat de yön de değişmez.", `${t} saniye sonra da hız doğuya doğru ${v} m/s olur (bu sürede ${v * t} m yol alır).`],
            kural: "Dengelenmiş kuvvetler etkisindeki hareketli cisim sabit hızla hareketine devam eder." }); },
      ],
    },
  });
})();
