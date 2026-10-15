/* Fen Bilimleri — görselli (resimli) ek sorular. Her sorunun çözümü için görseldeki bilgi
 * (deney düzeneği, model, diyagram, grafik, ölçüm aleti …) okunmalıdır. Çözümler adım adım anlatılır.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, G } = OGR;
  const Y = G.yazi;
  const kutu = (x, y, w, h, s = "g-bos", rx = 6) => `<rect class="${s} g-cizgi" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" stroke-width="2"/>`;
  const cizgi = (x1, y1, x2, y2, s = "g-cizgi", k = 2) => `<line class="${s}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${k}"/>`;
  const GS = (w, h, ic, et, min = 520) => w >= min ? G.svg(w, h, ic, et) : G.svg(min, h, `<g transform="translate(${(min - w) / 2} 0)">${ic}</g>`, et);
  const RENK = { kırmızı: "#d64545", mavi: "#2f6fdb", yeşil: "#2e9b57", sarı: "#f2b632", turuncu: "#ee8a2a", lacivert: "#2b3a8f", mor: "#8a5cd6", beyaz: "#ffffff", siyah: "#222222", gri: "#9aa0a6" };
  const harfler = n => ["K", "L", "M", "N", "P", "R"].slice(0, n);
  const buyuk = s => s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1);
  /* Termometre: x, üst y, değer, aralık */
  function termometre(x, y, T, min, max, boy = 160) {
    const yk = t => y + boy - (t - min) / (max - min) * boy;
    let ic = `<rect class="g-bos g-cizgi" x="${x - 9}" y="${y - 8}" width="18" height="${boy + 16}" rx="9" stroke-width="2"/><circle class="g-d g-cizgi" cx="${x}" cy="${y + boy + 20}" r="14" stroke-width="2"/>`;
    ic += `<rect class="g-d" x="${x - 4}" y="${yk(T)}" width="8" height="${y + boy + 10 - yk(T)}"/>`;
    for (let t = min; t <= max; t += (max - min) / 10) { const b = Math.round(t) % ((max - min) / 5) === 0; ic += cizgi(x + 9, yk(t), x + (b ? 20 : 15), yk(t), "g-cizgi", 1.2); if (b) ic += Y(x + 24, yk(t) + 4, Math.round(t), { a: "start", k: 1 }); }
    return ic;
  }

  /* ======================= 1. ÜNİTE: GÜNEŞ SİSTEMİ VE TUTULMALAR ======================= */
  const GEZ = ["Merkür", "Venüs", "Dünya", "Mars", "Jüpiter", "Satürn", "Uranüs", "Neptün"];
  const GEZR = [5, 7, 7, 6, 15, 13, 10, 10], GEZS = ["g-yumusak", "g-b", "g-a", "g-d", "g-b", "g-b", "g-yumusak", "g-a"];
  function gunesSistemi(etiket, { kusak = null } = {}) {
    const W = 600, H = 210, cy = 105; let ic = `<circle class="g-b g-cizgi" cx="-145" cy="${cy}" r="195" stroke-width="2"/>` + Y(4, cy + 5, "Güneş", { a: "start", k: 1, b: 1 });
    const x = i => 70 + i * 66;
    GEZ.forEach((g, i) => {
      ic += `<path class="g-ince" fill="none" stroke-dasharray="4 4" d="M${x(i)} 10 Q${x(i) + 16} ${cy} ${x(i)} ${H - 10}"/>`;
    });
    if (kusak !== null) { for (let k = 0; k < 40; k++) { const t = k / 40, yy = 18 + t * (H - 36); ic += `<circle class="g-cizgi" cx="${x(3) + 33 + (k * 7) % 13 - 6 + 12 * Math.sin(t * Math.PI)}" cy="${yy}" r="1.6"/>`; } ic += Y(x(3) + 46, 20, kusak, { b: 1 }); }
    GEZ.forEach((g, i) => {
      const xx = x(i) + 12 * Math.sin(Math.PI / 2);
      if (i === 5) ic += `<ellipse class="g-cizgi" cx="${xx}" cy="${cy}" rx="24" ry="6" fill="none" stroke-width="2"/>`;
      ic += `<circle class="${GEZS[i]} g-cizgi" cx="${xx}" cy="${cy}" r="${GEZR[i]}" stroke-width="1.5"/>`;
      if (etiket[i]) ic += Y(xx, cy + GEZR[i] + 22, etiket[i], { b: 1 });
    });
    return G.svg(W, H, ic, "Güneş sistemi modeli");
  }

  SORU_EKLE("fgun.gunes",
    z => {
      const [kG, kA, kD] = karistir(["X", "Y", "Z"]), sor = sec(["gunes", "ay"]);
      let ic = `<circle class="g-b g-cizgi" cx="70" cy="110" r="52" stroke-width="2"/>`;
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ic += cizgi(70 + 58 * Math.cos(a), 110 + 58 * Math.sin(a), 70 + 72 * Math.cos(a), 110 + 72 * Math.sin(a), "g-cizgi", 2); }
      ic += `<circle class="g-yumusak g-cizgi" cx="330" cy="60" r="16" stroke-width="2"/><circle class="g-a g-cizgi" cx="480" cy="150" r="34" stroke-width="2"/>`;
      ic += G.ok(140, 95, 308, 64, "g-ok-a") + G.ok(346, 72, 448, 132, "g-ok-a") + G.ok(140, 125, 440, 155, "g-ok-a");
      ic += Y(70, 200, kG, { b: 1 }) + Y(330, 30, kA, { b: 1 }) + Y(480, 205, kD, { b: 1 });
      const gunes = sor === "gunes";
      return S({ kaz: "fgun.gunes", duzey: "aciklama", zorluk: 1, gorsel: G.svg(560, 215, ic, "Güneş, Ay ve Dünya arasında ışığın yolu"),
        soru: `Şekilde üç gök cismi ve aralarındaki ışığın yolu oklarla gösterilmiştir (ölçekli değildir). Oklar, ışığın çıktığı cisimden gittiği cisme doğru çizilmiştir.<br>${gunes ? `<b>${kG}</b> ile gösterilen gök cismi için hangisi doğrudur?` : `<b>${kA}</b> ile gösterilen gök cismi için hangisi doğrudur?`}`,
        dogru: gunes ? "Bir yıldızdır; kendi ışığını ve ısısını üretir." : "Kendi ışığı yoktur; aldığı ışığı yansıtır.",
        dogruNeden: gunes ? `Bütün oklar ${kG} cisminden çıkıyor; ışığı üreten cisim Güneş'tir ve Güneş bir yıldızdır.` : `${kA} cismine ${kG}'den gelen ışık ondan ${kD} cismine gidiyor; ${kA} yalnızca ışığı yansıtan Ay'dır.`,
        yanlis: gunes ? [["Bir gezegendir; ışığı başka bir cisimden alır.", "bilgi", "Işığı üreten ve bütün okların çıktığı cisim yıldızdır, gezegen değildir."], ["Işığını Ay'dan alıp Dünya'ya yansıtır.", "kavrama", "Okların yönüne bak: ışık bu cisimden çıkıp diğerlerine gidiyor, tersi olmuyor."], ["Katı bir yüzeyi olan soğuk bir gök cismidir.", "bilgi", "Güneş, çok sıcak gazlardan oluşan bir yıldızdır; katı yüzeyi yoktur."]]
          : [["Kendi ışığını üreten bir yıldızdır.", "kavrama", "Bu cisme ok geliyor ve ondan başka bir cisme gidiyor; ışığı üretmiyor, yansıtıyor."], ["Işığı yalnızca geceleri üretir.", "kavrama", "Ay hiçbir zaman ışık üretmez; geceleri görmemizin nedeni Güneş ışığını yansıtmasıdır."], ["Güneş'e ışık gönderen bir gök cismidir.", "dikkat", "Oklar Güneş'ten çıkıyor; Ay'dan Güneş'e giden bir ok yok."]],
        ipucu: "Okların hangi cisimden çıktığına bak: ışık kaynağı ışığı üreten cisimdir.",
        cozum: ["🔎 Soruyu anlayalım: Şekilde ışığın yolu oklarla verilmiş. Okların başladığı ve bittiği yerlere bakarak cisimleri tanıyacağız.",
          "💡 Hatırlayalım: Güneş bir yıldızdır; ışık ve ısı üretir. Ay ve gezegenler ışık üretmez, Güneş'ten aldıkları ışığı yansıtır.",
          `✏️ Bütün oklar ${kG} cisminden çıkıyor → ${kG} ışık kaynağıdır, yani Güneş'tir.`,
          `✏️ ${kA} cismine gelen ışık oradan ${kD} cismine gidiyor → ${kA} ışığı yansıtır (Ay). ${kD} ise ışığı alan Dünya'dır.`,
          `✅ Sonuç: ${gunes ? kG + " bir yıldızdır; kendi ışığını ve ısısını üretir." : kA + " kendi ışığı olmayan, ışığı yansıtan Ay'dır."}`,
          "🔁 Kontrol edelim: Gece Ay'ı görebiliyoruz ama Ay'ın ışığı aslında Güneş ışığıdır; bu yüzden Ay'ın evreleri oluşur ✓"],
        kural: "Güneş ışık kaynağıdır (yıldız); Ay ve gezegenler ışığı yansıtır." });
    },
  );

  SORU_EKLE("fgun.gezegen",
    z => {
      const H = karistir(["A", "B", "C", "D", "E", "F", "G", "H"]), i = R(0, 7);
      const kom = [i - 1, i + 1, i - 2, i + 2, 7 - i].filter(j => j >= 0 && j < 8 && j !== i);
      const ozel = { 0: "Güneş'e en yakın", 1: "Güneş'e ikinci yakın", 2: "üzerinde yaşadığımız", 3: "Dünya'dan sonraki ilk", 4: "en büyük", 5: "belirgin halkaları olan", 6: "Satürn'den sonraki", 7: "Güneş'e en uzak" }[i];
      return S({ kaz: "fgun.gezegen", duzey: "uygulama", zorluk: 2, gorsel: gunesSistemi(H),
        soru: `Şekilde Güneş sistemindeki gezegenler yörüngeleriyle birlikte gösterilmiş ve harflerle adlandırılmıştır (büyüklükler ve uzaklıklar ölçekli değildir).<br><b>${H[i]}</b> harfiyle gösterilen gezegen hangisidir?`,
        dogru: GEZ[i], dogruNeden: `${H[i]}, Güneş'ten itibaren ${i + 1}. yörüngededir; Güneş'ten uzaklık sırasına göre ${i + 1}. gezegen ${GEZ[i]}'dir.`,
        yanlis: [...new Set(kom)].map(j => [GEZ[j], Math.abs(j - i) === 1 ? "dikkat" : "bilgi", `${GEZ[j]}, Güneş'ten itibaren ${j + 1}. gezegendir; ${H[i]} ise ${i + 1}. yörüngede.`]),
        ipucu: "Güneş'ten başlayarak yörüngeleri say: Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs, Neptün.",
        cozum: [`🔎 Soruyu anlayalım: Şekilde ${H[i]} harfiyle gösterilen gezegenin adını, yörüngesinin sırasından bulacağız.`,
          "💡 Hatırlayalım: Gezegenlerin Güneş'e uzaklık sırası: Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs, Neptün. İlk dördü iç (karasal), son dördü dış (gaz) gezegenlerdir.",
          `✏️ Güneş'ten başlayarak sayalım: ${H.slice(0, i + 1).join(" → ")}. ${H[i]}, ${i + 1}. sırada.`,
          `✏️ ${i + 1}. gezegen ${GEZ[i]}; ${ozel} gezegendir. Şekildeki büyüklüğü${i === 5 ? " ve halkası" : ""} de buna uyuyor.`,
          `✅ Sonuç: ${H[i]} harfi ${GEZ[i]} gezegenini gösterir.`,
          `🔁 Kontrol edelim: ${i < 4 ? "İlk dört gezegen küçük ve kayalıktır" : "Mars'tan sonraki dört gezegen büyük gaz gezegenleridir"}; ${GEZ[i]} de bu gruptadır ✓`],
        kural: "Sıra: Merkür, Venüs, Dünya, Mars | Jüpiter, Satürn, Uranüs, Neptün." });
    },
  );

  SORU_EKLE("fgun.diger",
    z => {
      if (R(0, 1)) {
        return S({ kaz: "fgun.diger", duzey: "hatirlama", zorluk: 1, gorsel: gunesSistemi(["", "", "", "", "", "", "", ""], { kusak: "X" }),
          soru: "Şekildeki Güneş sistemi modelinde çok sayıda küçük noktadan oluşan <b>X</b> yapısı gösterilmiştir.<br>X ile gösterilen yapı nedir ve hangi iki gezegenin yörüngesi arasında bulunur?",
          dogru: "Asteroit kuşağı; Mars ile Jüpiter arasında", dogruNeden: "Asteroit kuşağı, Güneş'ten itibaren 4. gezegen Mars ile 5. gezegen Jüpiter'in yörüngeleri arasındadır.",
          yanlis: [["Asteroit kuşağı; Dünya ile Mars arasında", "dikkat", "Yörüngeleri yeniden say: X, dördüncü ve beşinci yörüngeler arasında."], ["Kuyruklu yıldızlar; Mars ile Jüpiter arasında", "bilgi", "Kuyruklu yıldızlar çok uzun, basık yörüngelerde dolanır; bir kuşak oluşturmaz."], ["Meteorlar; Jüpiter ile Satürn arasında", "bilgi", "Meteor, atmosfere girip yanan göktaşıdır; uzayda kuşak oluşturmaz."]],
          ipucu: "Güneş'ten başlayarak yörüngeleri say: X kaçıncı yörüngeden sonra geliyor?",
          cozum: ["🔎 Soruyu anlayalım: Modeldeki küçük noktalardan oluşan X yapısının adını ve yerini bulacağız.",
            "💡 Hatırlayalım: Asteroitler, Güneş'in çevresinde dolanan, gezegenlerden çok küçük kaya ve metal parçalarıdır. Çoğu bir kuşak hâlinde bulunur.",
            "✏️ Güneş'ten itibaren yörüngeleri sayalım: Merkür, Venüs, Dünya, Mars → sonra X → sonra en büyük gezegen Jüpiter.",
            "✏️ X, dördüncü (Mars) ve beşinci (Jüpiter) yörüngeler arasındadır.",
            "✅ Sonuç: X asteroit kuşağıdır; Mars ile Jüpiter arasındadır.",
            "🔁 Kontrol edelim: Asteroit kuşağı iç (karasal) gezegenleri dış (gaz) gezegenlerden ayıran bir sınır gibi düşünülebilir ✓"],
          kural: "Asteroit kuşağı Mars ile Jüpiter arasındadır." });
      }
      const H = ["A", "B", "C", "D"], dogruI = R(0, 3), yonler = [];
      let ic = `<circle class="g-b g-cizgi" cx="280" cy="140" r="34" stroke-width="2"/>` + Y(280, 145, "Güneş", { k: 1, b: 1 }) + `<ellipse class="g-ince" cx="280" cy="140" rx="230" ry="110" fill="none" stroke-dasharray="5 5"/>`;
      [[60, 140], [280, 32], [500, 140], [280, 248]].forEach(([x, y], i) => {
        const dx = x - 280, dy = y - 140, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
        const yon = i === dogruI ? [ux, uy] : sec([[-ux, -uy], [-uy, ux], [uy, -ux]]); yonler.push(yon);
        const tx = x + yon[0] * 60, ty = y + yon[1] * 60;
        ic += `<path class="g-yumusak" d="M${x - yon[1] * 6} ${y + yon[0] * 6} L${tx - yon[1] * 16} ${ty + yon[0] * 16} L${tx + yon[1] * 16} ${ty - yon[0] * 16} L${x + yon[1] * 6} ${y - yon[0] * 6} Z" stroke="#8aa" stroke-width="1"/><circle class="g-a g-cizgi" cx="${x}" cy="${y}" r="7"/>` + Y(x + (i === 0 ? -14 : i === 2 ? 14 : 18), y + (i === 1 ? -6 : i === 3 ? 18 : -12), H[i], { b: 1 });
      });
      return S({ kaz: "fgun.diger", duzey: "uygulama", zorluk: 2, gorsel: G.svg(560, 285, ic, "kuyruklu yıldızın dört konumu"),
        soru: "Bir öğrenci, Güneş'in çevresinde dolanan bir kuyruklu yıldızın dört farklı konumunu kuyruklarıyla birlikte çizmiştir. Bu çizimlerden yalnızca birinde kuyruğun yönü <b>doğru</b> çizilmiştir.<br>Doğru çizilen konum hangisidir?",
        dogru: H[dogruI] + " konumu", dogruNeden: `${H[dogruI]} konumunda kuyruk Güneş'in tam tersi yönüne bakıyor; kuyruklu yıldızın kuyruğu her zaman Güneş'ten uzağa doğrudur.`,
        yanlis: H.map((h, i) => [h + " konumu", "kavrama", `${h} konumunda kuyruk Güneş'ten uzağa bakmıyor; kuyruk, kuyruklu yıldızın gittiği yöne göre değil Güneş'e göre yönlenir.`]).filter((_, i) => i !== dogruI),
        ipucu: "Kuyruk, Güneş'ten gelen ışık ve parçacıkların etkisiyle oluşur. Bu durumda kuyruk hangi yöne itilir?",
        cozum: ["🔎 Soruyu anlayalım: Dört konumdaki kuyruk yönlerinden hangisinin doğru olduğunu bulacağız.",
          "💡 Hatırlayalım: Kuyruklu yıldızlar buz, toz ve gazdan oluşur. Güneş'e yaklaşınca buzlar buharlaşır; Güneş'ten gelen ışık ve parçacıklar bu gaz ve tozu iterek kuyruğu oluşturur. Bu yüzden kuyruk her zaman Güneş'ten uzağa bakar.",
          "✏️ Her konumda Güneş'ten kuyruklu yıldıza bir çizgi düşünelim; kuyruk bu çizginin devamı yönünde olmalı.",
          `✏️ Yalnızca ${H[dogruI]} konumunda kuyruk Güneş'in tam ters yönünde; diğerlerinde kuyruk Güneş'e doğru ya da yana bakıyor.`,
          `✅ Sonuç: ${H[dogruI]} konumu doğru çizilmiştir.`,
          "🔁 Kontrol edelim: Kuyruklu yıldız Güneş'ten uzaklaşırken bile kuyruğu Güneş'ten uzağa, yani önüne doğru bakar ✓"],
        kural: "Kuyruklu yıldızın kuyruğu her zaman Güneş'in ters yönündedir." });
    },
  );

  SORU_EKLE("ftut.gunes",
    z => {
      const [kT, kP, kG] = karistir(["K", "L", "M"]), sor = sec(["tam", "parcali", "yok"]);
      let ic = `<circle class="g-b g-cizgi" cx="40" cy="130" r="70" stroke-width="2"/>` + Y(40, 230, "Güneş", { k: 1, b: 1 });
      ic += `<path class="g-yumusak" d="M240 118 L470 98 L470 162 L240 142 Z" fill-opacity="0.7"/>`; // yarı gölge
      ic += `<path fill="#333" fill-opacity="0.75" d="M240 122 L455 128 L455 132 L240 138 Z"/>`;
      ic += `<circle class="g-yumusak g-cizgi" cx="240" cy="130" r="13" stroke-width="2"/>` + Y(240, 104, "Ay", { k: 1, b: 1 });
      ic += `<circle class="g-a g-cizgi" cx="500" cy="130" r="48" stroke-width="2" fill-opacity="0.85"/>` + Y(500, 200, "Dünya", { k: 1, b: 1 });
      ic += `<circle class="g-d" cx="453" cy="130" r="4"/>` + Y(440, 122, kT, { b: 1, a: "end" });
      ic += `<circle class="g-d" cx="458" cy="104" r="4"/>` + Y(446, 92, kP, { b: 1, a: "end" });
      ic += `<circle class="g-d" cx="535" cy="98" r="4"/>` + Y(548, 86, kG, { b: 1 });
      const dog = { tam: kT, parcali: kP, yok: kG }[sor], ad = { tam: "tam Güneş tutulması", parcali: "parçalı Güneş tutulması", yok: "Güneş tutulması gözlenemez" }[sor];
      const ac = { [kT]: "Ay'ın tam gölgesinde (koyu bölge)", [kP]: "Ay'ın yarı gölgesinde (açık bölge)", [kG]: "Dünya'nın Güneş'e bakmayan (gece) yüzünde" };
      return S({ kaz: "ftut.gunes", duzey: "uygulama", zorluk: 2, gorsel: G.svg(560, 240, ic, "Güneş tutulması modeli"),
        soru: `Şekilde Güneş, Ay ve Dünya'nın bir andaki konumları ile Ay'ın tam gölgesi (koyu) ve yarı gölgesi (açık) gösterilmiştir (ölçekli değildir).<br>Dünya üzerindeki K, L, M noktalarından hangisinde bulunan bir gözlemci için “<b>${ad}</b>” ifadesi doğrudur?`,
        dogru: dog + " noktası", dogruNeden: `${dog} noktası ${ac[dog]}.`,
        yanlis: ["K", "L", "M"].filter(h => h !== dog).map(h => [h + " noktası", "kavrama", `${h} noktası ${ac[h]}; ${h === kT ? "burada Güneş tamamen kapanır" : h === kP ? "burada Güneş'in yalnızca bir kısmı kapanır" : "buradan Güneş görülmez, tutulma da gözlenmez"}.`]).concat([["Hiçbir noktada gözlenemez", "kavrama", "Ay'ın gölgesi Dünya'ya düştüğü için gölgedeki yerlerde Güneş tutulması gözlenir."]]),
        ipucu: "Tam gölgede Güneş tamamen, yarı gölgede kısmen örtülür. Gece olan yerden Güneş görünmez.",
        cozum: ["🔎 Soruyu anlayalım: Ay, Güneş ile Dünya arasına girmiş; gölgesi Dünya'ya düşüyor. Noktaların hangi gölgede olduğuna bakacağız.",
          "💡 Hatırlayalım: Güneş tutulması, Ay Güneş ile Dünya arasına girip gölgesini Dünya'ya düşürdüğünde (yeni ay evresinde) olur. Tam gölgede tam, yarı gölgede parçalı tutulma görülür.",
          `✏️ ${kT} noktası koyu tam gölgede → tam Güneş tutulması.`,
          `✏️ ${kP} noktası açık yarı gölgede → parçalı Güneş tutulması. ${kG} noktası Dünya'nın gece tarafında → Güneş görünmez.`,
          `✅ Sonuç: ${dog} noktası.`,
          "🔁 Kontrol edelim: Ay küçük olduğu için tam gölgesi Dünya'da çok dar bir alana düşer; bu yüzden tam Güneş tutulması aynı anda dünyanın küçük bir bölgesinden izlenebilir ✓"],
        kural: "Güneş tutulması: Güneş – Ay – Dünya sıralanır; tam gölge → tam, yarı gölge → parçalı tutulma." });
    },
  );

  SORU_EKLE("ftut.ay",
    z => {
      const N = karistir(["1", "2", "3", "4"]), sor = sec(["ay", "ay", "gunes"]);
      // konumlar: 0 Güneş tarafı (sol), 1 üst, 2 arka (sağ), 3 alt
      const P = [[200, 130], [300, 40], [400, 130], [300, 220]];
      let ic = `<circle class="g-b g-cizgi" cx="-10" cy="130" r="60" stroke-width="2"/>` + Y(30, 235, "Güneş ışınları →", { k: 1 });
      for (let i = 0; i < 4; i++) ic += G.ok(60, 70 + i * 40, 130, 70 + i * 40, "g-ok-a");
      ic += `<circle class="g-ince" cx="300" cy="130" r="100" fill="none" stroke-dasharray="5 5"/>`;
      ic += `<path fill="#333" fill-opacity="0.25" d="M300 100 L540 112 L540 148 L300 160 Z"/>`;
      ic += `<circle class="g-a g-cizgi" cx="300" cy="130" r="30" stroke-width="2"/><text x="300" y="135" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">Dünya</text>`;
      P.forEach(([x, y], i) => { ic += `<circle class="g-yumusak g-cizgi" cx="${x}" cy="${y}" r="12" stroke-width="2"/>` + Y(x + (i === 2 ? 0 : 0), y + (i === 1 ? -18 : i === 3 ? 30 : -18), N[i], { b: 1 }); });
      const hedef = sor === "ay" ? 2 : 0;
      const ACK = ["Ay, Güneş ile Dünya arasında (yeni ay)", "Ay, Dünya'nın yanında (dördün)", "Ay, Dünya'nın arkasında, Dünya'nın gölgesinde (dolunay)", "Ay, Dünya'nın yanında (dördün)"];
      return S({ kaz: "ftut.ay", duzey: "uygulama", zorluk: 2, gorsel: G.svg(560, 260, ic, "Ay'ın Dünya çevresindeki dört konumu"),
        soru: `Şekilde Ay'ın Dünya çevresindeki dört farklı konumu numaralarla gösterilmiştir (ölçekli değildir). Güneş ışınları soldan gelmektedir.<br>${sor === "ay" ? "Ay hangi konumdayken <b>Ay tutulması</b> gerçekleşebilir?" : "Ay hangi konumdayken <b>Güneş tutulması</b> gerçekleşebilir?"}`,
        dogru: N[hedef] + " numaralı konum", dogruNeden: `${N[hedef]} numaralı konumda ${ACK[hedef].toLocaleLowerCase("tr-TR")}; ${sor === "ay" ? "Dünya'nın gölgesi Ay'a düşer" : "Ay'ın gölgesi Dünya'ya düşer"}.`,
        yanlis: [0, 1, 2, 3].filter(i => i !== hedef).map(i => [N[i] + " numaralı konum", i === (hedef ^ 2) ? "kavrama" : "dikkat", `${N[i]} numaralı konumda ${ACK[i].toLocaleLowerCase("tr-TR")}; ${i === (hedef ^ 2) ? (sor === "ay" ? "bu konumda Güneş tutulması olabilir, Ay tutulması olmaz" : "bu konumda Ay tutulması olabilir, Güneş tutulması olmaz") : "Güneş, Dünya ve Ay aynı doğru üzerinde değil, tutulma olmaz"}.`]),
        ipucu: sor === "ay" ? "Ay tutulmasında Dünya, Güneş ile Ay'ın arasına girer." : "Güneş tutulmasında Ay, Güneş ile Dünya'nın arasına girer.",
        cozum: ["🔎 Soruyu anlayalım: Ay'ın dört konumundan hangisinde istenen tutulmanın olabileceğini bulacağız.",
          "💡 Hatırlayalım: Ay tutulması: Güneş – Dünya – Ay sıralanır, Dünya'nın gölgesi Ay'a düşer (dolunay evresi). Güneş tutulması: Güneş – Ay – Dünya sıralanır, Ay'ın gölgesi Dünya'ya düşer (yeni ay evresi).",
          `✏️ Işık soldan geliyor; Dünya'nın gölgesi sağ tarafa düşüyor (şekildeki koyu bölge).`,
          `✏️ ${sor === "ay" ? `Dünya'nın gölgesindeki konum ${N[2]} numaralı konumdur.` : `Güneş ile Dünya arasındaki konum ${N[0]} numaralı konumdur.`}`,
          `✅ Sonuç: ${N[hedef]} numaralı konum.`,
          `🔁 Kontrol edelim: Her ${sor === "ay" ? "dolunayda" : "yeni ayda"} tutulma olmaz; çünkü Ay'ın yörüngesi biraz eğiktir ve üç gök cismi her zaman tam aynı doğru üzerine gelmez ✓`],
        kural: "Ay tutulması: Güneş – Dünya – Ay (dolunay). Güneş tutulması: Güneş – Ay – Dünya (yeni ay)." });
    },
  );

  SORU_EKLE("ftut.model",
    z => {
      const ayT = R(0, 1) === 1; // true: fener - futbol - tenis (ay tutulması)
      let ic = `<rect class="g-d g-cizgi" x="20" y="105" width="70" height="40" rx="6" stroke-width="2"/><path class="g-b g-cizgi" stroke-width="2" d="M90 100 L110 90 L110 160 L90 150 Z"/>` + Y(60, 185, "El feneri", { k: 1, b: 1 });
      ic += `<path class="g-b" fill-opacity="0.35" d="M110 92 L520 40 L520 210 L110 158 Z"/>`;
      const kucuk = (x) => `<circle class="g-c g-cizgi" cx="${x}" cy="125" r="13" stroke-width="2"/>` + Y(x, 185, "Tenis topu", { k: 1, b: 1 });
      const buyukT = (x) => `<circle class="g-bos g-cizgi" cx="${x}" cy="125" r="45" stroke-width="2"/><path class="g-cizgi" fill="none" stroke-width="1.5" d="M${x - 30} ${125 - 34} l14 18 l22 -4 l8 20 l-16 16 l4 20"/>` + Y(x, 195, "Futbol topu", { k: 1, b: 1 });
      if (ayT) ic += buyukT(260) + `<path fill="#333" fill-opacity="0.35" d="M300 105 L520 110 L520 140 L300 145 Z"/>` + kucuk(440);
      else ic += kucuk(240) + `<path fill="#333" fill-opacity="0.45" d="M250 120 L410 123 L410 127 L250 130 Z"/>` + buyukT(450);
      return S({ kaz: "ftut.model", duzey: "baglanti", zorluk: 2, gorsel: G.svg(560, 215, ic, "el feneri ve iki topla tutulma modeli"),
        soru: "Bir öğrenci karanlık bir odada el feneri, tenis topu ve futbol topuyla şekildeki modeli kurmuştur. Gölgenin düştüğü top üzerinde bir tutulmayı modellemektedir.<br>Bu model hangi tutulmayı gösterir ve <b>tenis topu</b> neyi temsil eder?",
        dogru: ayT ? "Ay tutulması; tenis topu Ay'ı temsil eder." : "Güneş tutulması; tenis topu Ay'ı temsil eder.",
        dogruNeden: ayT ? "Sıralama el feneri (Güneş) – futbol topu (Dünya) – tenis topu (Ay); büyük topun gölgesi küçük topa düşüyor: Ay tutulması." : "Sıralama el feneri (Güneş) – tenis topu (Ay) – futbol topu (Dünya); küçük topun gölgesi büyük topa düşüyor: Güneş tutulması.",
        yanlis: [[ayT ? "Güneş tutulması; tenis topu Ay'ı temsil eder." : "Ay tutulması; tenis topu Ay'ı temsil eder.", "kavrama", ayT ? "Gölge küçük topa (Ay'a) düşüyor; Ay karardığı için bu Ay tutulmasıdır." : "Gölge büyük topa (Dünya'ya) düşüyor; Dünya'dan Güneş görülemez, bu Güneş tutulmasıdır."], [ayT ? "Ay tutulması; tenis topu Dünya'yı temsil eder." : "Güneş tutulması; tenis topu Dünya'yı temsil eder.", "kavrama", "Modelde büyük top Dünya'yı, küçük top Ay'ı temsil eder; çünkü Dünya Ay'dan büyüktür."], [ayT ? "Güneş tutulması; tenis topu Güneş'i temsil eder." : "Ay tutulması; tenis topu Güneş'i temsil eder.", "bilgi", "Işık kaynağı olan el feneri Güneş'i temsil eder."]],
        ipucu: "El feneri ışık kaynağıdır. Büyük top Dünya, küçük top Ay olmalı. Gölge hangisinin üzerine düşüyor?",
        cozum: ["🔎 Soruyu anlayalım: Modeldeki cisimlerin neyi temsil ettiğini ve hangi tutulmanın modellendiğini bulacağız.",
          "💡 Hatırlayalım: Güneş tutulmasında Ay, Güneş ile Dünya arasına girer ve gölgesi Dünya'ya düşer. Ay tutulmasında Dünya, Güneş ile Ay arasına girer ve gölgesi Ay'a düşer.",
          "✏️ Temsil: el feneri → Güneş (ışık kaynağı); futbol topu → Dünya (büyük); tenis topu → Ay (küçük).",
          ayT ? "✏️ Sıralama: fener – futbol topu – tenis topu, yani Güneş – Dünya – Ay. Futbol topunun gölgesi tenis topuna düşüyor." : "✏️ Sıralama: fener – tenis topu – futbol topu, yani Güneş – Ay – Dünya. Tenis topunun gölgesi futbol topuna düşüyor.",
          `✅ Sonuç: ${ayT ? "Ay tutulması" : "Güneş tutulması"} modellenmiştir; tenis topu Ay'ı temsil eder.`,
          "🔁 Kontrol edelim: Modelde topları yer değiştirirsek öbür tutulmayı modellemiş oluruz; temsil edilen cisimler ise değişmez ✓"],
        kural: "Modelde: ışık kaynağı = Güneş, büyük top = Dünya, küçük top = Ay; gölgenin düştüğü cisme göre tutulma adlandırılır." });
    },
  );

  /* ======================= 2. ÜNİTE: KUVVET VE HAREKET ======================= */
  SORU_EKLE("fbil.kuvvet",
    z => {
      const max = sec([10, 20]), adim = max === 10 ? 1 : 2, deger = R(2, max / adim - 1) * adim, b = 220;
      const yk = v => 40 + v / max * b;
      let ic = `<rect class="g-cizgi" x="140" y="10" width="80" height="12" rx="3" fill="none" stroke-width="2"/>` + cizgi(180, 22, 180, 34) + kutu(150, 34, 60, b + 20, "g-yumusak", 6);
      for (let v = 0; v <= max; v += adim) { ic += cizgi(196, yk(v), 210, yk(v), "g-cizgi", 1.5); if (v % (adim * (max === 10 ? 2 : 2)) === 0) ic += Y(222, yk(v) + 5, v, { a: "start", k: 1 }); }
      ic += `<path class="g-cizgi" fill="none" stroke-width="2" d="M180 38 ${[...Array(10).keys()].map(i => `L${i % 2 ? 170 : 190} ${38 + (i + 1) * (yk(deger) - 38) / 11}`).join(" ")} L180 ${yk(deger)}"/>`;
      ic += cizgi(160, yk(deger), 200, yk(deger), "g-ok-d", 3) + cizgi(180, yk(deger), 180, b + 70, "g-cizgi", 2);
      ic += kutu(150, b + 70, 60, 40, "g-b", 4) + Y(180, b + 95, "cisim", { k: 1 }) + Y(262, 30, "N", { b: 1 });
      return S({ kaz: "fbil.kuvvet", duzey: "uygulama", zorluk: 1, gorsel: GS(320, b + 120, ic, "dinamometre ve asılı cisim", 360),
        soru: "Şekildeki dinamometreye bir cisim asılmış ve dinamometrenin göstergesi kırmızı çizgiyle gösterilen yerde durmuştur.<br>Dinamometre cisme etki eden kuvveti kaç <b>newton</b> olarak ölçmüştür?",
        dogru: deger + " N", dogruNeden: `Kırmızı gösterge çizgisi ölçeğin ${deger} çizgisinin hizasında; dinamometre ${deger} N gösteriyor.`,
        yanlis: [[deger + adim + " N", "dikkat", "Göstergenin hizasındaki çizgiyi yeniden oku; bir çizgi aşağısını okumuşsun."], [deger - adim + " N", "dikkat", "Göstergenin hizasındaki çizgiyi yeniden oku; bir çizgi yukarısını okumuşsun."], [deger / adim + " N", "islem", `Çentik sayısını saymışsın; ölçekte her aralık ${adim} N'dir.`], [max + " N", "kavrama", `${max} N dinamometrenin ölçebileceği en büyük değerdir (ölçme sınırı), ölçülen değer değil.`]],
        ipucu: `Ölçekte iki çentik arası ${adim} N. Kırmızı göstergenin hizasındaki değeri oku.`,
        cozum: ["🔎 Soruyu anlayalım: Dinamometrenin göstergesini okuyarak cisme etki eden kuvveti bulacağız.",
          "💡 Hatırlayalım: Dinamometre, içindeki yayın uzamasından yararlanarak kuvveti ölçer. Birimi newton (N)'dur. Okuma yaparken göz gösterge hizasında olmalıdır.",
          `✏️ Ölçeği inceleyelim: 0'dan ${max}'${ek(max, "e").slice(1)} kadar; her çentik ${adim} N.`,
          `✏️ Kırmızı gösterge ${deger} çizgisinin hizasında.`,
          `✅ Sonuç: Dinamometre ${deger} N ölçmüştür.`,
          `🔁 Kontrol edelim: Daha ağır bir cisim assaydık yay daha çok uzar, gösterge aşağı inerdi; değer ${deger} N'den büyük olurdu ✓`],
        kural: "Dinamometre kuvveti newton (N) cinsinden ölçer; okurken ölçeğin bölme değerine dikkat et." });
    },
  );

  SORU_EKLE("fbil.bileske",
    z => {
      let sol, sag, ts, tg; do { sol = [R(2, 9) * 10, R(2, 9) * 10]; sag = [R(2, 9) * 10, R(2, 9) * 10]; ts = sol[0] + sol[1]; tg = sag[0] + sag[1]; } while (ts === tg || Math.abs(ts - tg) > 60);
      const net = Math.abs(ts - tg), yon = ts > tg ? "sola" : "sağa";
      const cocuk = (x, f, s) => `<circle class="g-yumusak g-cizgi" cx="${x}" cy="95" r="14" stroke-width="2"/><rect class="${s}" x="${x - 13}" y="111" width="26" height="40" rx="8"/>` + Y(x, 60, f + " N", { b: 1 });
      let ic = cizgi(40, 120, 520, 120, "g-cizgi", 4) + `<line class="g-d" x1="280" y1="100" x2="280" y2="140" stroke="#d64545" stroke-width="4"/>` + Y(280, 160, "işaret", { k: 1 });
      ic += cocuk(70, sol[0], "g-d") + cocuk(140, sol[1], "g-d") + cocuk(420, sag[0], "g-a") + cocuk(490, sag[1], "g-a");
      ic += G.ok(110, 30, 40, 30, "g-ok-d") + Y(120, 34, "Kırmızı takım", { a: "start", k: 1 }) + G.ok(450, 30, 520, 30, "g-ok-a") + Y(440, 34, "Mavi takım", { a: "end", k: 1 });
      return S({ kaz: "fbil.bileske", duzey: "uygulama", zorluk: 2, gorsel: G.svg(560, 175, ic, "halat çekme oyunu"),
        soru: "Halat çekme oyununda kırmızı takım halatı sola, mavi takım sağa doğru çekmektedir. Her öğrencinin uyguladığı kuvvet başının üstünde yazılıdır.<br>Halata etki eden <b>bileşke kuvvetin</b> büyüklüğü ve yönü nedir?",
        dogru: `${net} N, ${yon}`, dogruNeden: `Sola ${sol.join(" + ")} = ${ts} N, sağa ${sag.join(" + ")} = ${tg} N; zıt yönlü kuvvetlerde bileşke ${Math.max(ts, tg)} − ${Math.min(ts, tg)} = ${net} N, büyük kuvvet yönünde (${yon}).`,
        yanlis: [[`${ts + tg} N, ${yon}`, "kavrama", "Zıt yönlü kuvvetler toplanmaz; büyükten küçük çıkarılır."], [`${net} N, ${yon === "sola" ? "sağa" : "sola"}`, "dikkat", "Bileşke, büyük olan kuvvet toplamının yönündedir; takımların toplamlarını karşılaştır."], [`0 N, hareket yok`, "kavrama", `İki takımın toplam kuvveti eşit değil (${ts} N ve ${tg} N); bileşke sıfır olmaz.`], [`${Math.max(...sol, ...sag)} N, ${yon}`, "strateji", "Yalnızca en güçlü öğrenciye bakmışsın; her takımın kuvvetlerini önce toplamalısın."]],
        ipucu: "Önce her takımın kuvvetlerini kendi içinde topla (aynı yön). Sonra iki toplamı karşılaştır (zıt yön).",
        cozum: ["🔎 Soruyu anlayalım: Halata dört kuvvet etki ediyor: ikisi sola, ikisi sağa. Bileşkeyi bulacağız.",
          "💡 Hatırlayalım: Aynı yönlü kuvvetlerin bileşkesi toplanarak bulunur. Zıt yönlü kuvvetlerin bileşkesi büyükten küçük çıkarılarak bulunur ve büyük kuvvetin yönündedir.",
          `✏️ Kırmızı takım (sola): ${sol[0]} + ${sol[1]} = ${ts} N.`,
          `✏️ Mavi takım (sağa): ${sag[0]} + ${sag[1]} = ${tg} N.`,
          `✏️ Zıt yönlü: ${Math.max(ts, tg)} − ${Math.min(ts, tg)} = ${net} N; büyük olan ${ts > tg ? "kırmızı" : "mavi"} takımın yönünde, yani ${yon}.`,
          `✅ Sonuç: Bileşke kuvvet ${net} N, ${yon}; halattaki işaret ${yon} kayar.`,
          `🔁 Kontrol edelim: ${ts > tg ? "Mavi" : "Kırmızı"} takım ${net} N daha fazla kuvvet uygulasaydı bileşke sıfır olur, halat hareket etmezdi ✓`],
        kural: "Aynı yön → topla; zıt yön → çıkar, büyük kuvvetin yönü." });
    },
  );

  SORU_EKLE("fbil.denge",
    z => {
      const yatayEsit = R(0, 1) === 1, agirlik = R(3, 8) * 10, hareketli = R(0, 1) === 1;
      let sol, sag; do { sol = [R(2, 8) * 5, R(1, 6) * 5]; sag = [R(3, 12) * 5]; } while ((sol[0] + sol[1] === sag[0]) !== yatayEsit || sol[0] + sol[1] > 80 || sag[0] > 80 || (!yatayEsit && Math.abs(sol[0] + sol[1] - sag[0]) < 5));
      if (yatayEsit) sag = [sol[0] + sol[1]];
      const ts = sol[0] + sol[1], tg = sag[0], net = Math.abs(ts - tg), yon = ts > tg ? "sola" : "sağa";
      const dogru = yatayEsit ? (hareketli ? "Sağa doğru sabit süratle gitmeye devam eder." : "Durmaya devam eder.") : (hareketli ? (yon === "sağa" ? "Sağa doğru giderken sürati artar." : "Sağa doğru giderken sürati azalır.") : `${buyuk(yon)} doğru harekete başlar.`);
      const secenek = hareketli ? ["Sağa doğru sabit süratle gitmeye devam eder.", "Sağa doğru giderken sürati artar.", "Sağa doğru giderken sürati azalır.", "Hemen durur."] : ["Durmaya devam eder.", "Sola doğru harekete başlar.", "Sağa doğru harekete başlar.", "Yukarı doğru harekete başlar."];
      const neden = m => m === "Hemen durur." ? "Dengelenmiş kuvvetler hareketli cismi durdurmaz; dengelenmemiş kuvvet de cismi bir anda durdurmaz." : m.includes("Yukarı") ? `Yukarı ve aşağı yöndeki kuvvetler eşit (${agirlik} N); dikey yönde bileşke sıfırdır.` : yatayEsit ? `Yatay kuvvetler ${ts} N ve ${tg} N, eşit; bileşke sıfır olduğu için cismin hareket durumu değişmez.` : `Yatay bileşke ${net} N ve ${yon}; bu seçenek bileşkenin yönüne uymuyor.`;
      return S({ kaz: "fbil.denge", duzey: "baglanti", zorluk: 3, gorsel: G.kuvvet({ sol, sag, ust: [agirlik], alt: [agirlik], cisim: "kutu" }),
        soru: `Yatay düz bir zemindeki kutuya etki eden kuvvetler şekilde gösterilmiştir (sürtünmeyi önemsemeyelim). Kutu başlangıçta ${hareketli ? "<b>sağa doğru sabit süratle</b> gitmektedir" : "<b>durmaktadır</b>"}.<br>Bu kuvvetler etki ettiğinde kutunun hareketi için hangisi doğrudur?`,
        dogru, dogruNeden: yatayEsit ? `Sola ${ts} N, sağa ${tg} N; kuvvetler dengelenmiş, bileşke 0. Cisim ${hareketli ? "sabit süratle hareketine" : "durgun kalmaya"} devam eder.` : `Sola ${ts} N, sağa ${tg} N; bileşke ${net} N ${yon}. Dengelenmemiş kuvvet ${hareketli ? (yon === "sağa" ? "hareket yönünde olduğu için sürati artırır" : "harekete zıt olduğu için sürati azaltır") : "duran cismi bu yönde harekete geçirir"}.`,
        yanlis: secenek.filter(m => m !== dogru).map(m => [m, "kavrama", neden(m)]),
        ipucu: "Önce yatay kuvvetlerin bileşkesini bul. Bileşke sıfırsa hareket durumu değişmez.",
        cozum: ["🔎 Soruyu anlayalım: Kutuya dört kuvvet etki ediyor. Bileşke kuvvete göre kutunun hareketinin nasıl değişeceğini bulacağız.",
          "💡 Hatırlayalım: Bileşke kuvvet sıfırsa kuvvetler dengelenmiştir: duran cisim durur, hareket eden cisim sabit süratle gider. Bileşke sıfır değilse (dengelenmemiş) cismin sürati ya da yönü değişir.",
          `✏️ Dikey kuvvetler: yukarı ${agirlik} N, aşağı ${agirlik} N → dikey bileşke 0.`,
          `✏️ Yatay kuvvetler: sola ${sol.join(" + ")} = ${ts} N, sağa ${tg} N → ${yatayEsit ? "bileşke 0 (dengelenmiş)" : "bileşke " + net + " N " + yon + " (dengelenmemiş)"}.`,
          `✏️ Kutu başlangıçta ${hareketli ? "sağa sabit süratle gidiyor" : "duruyor"}: ${yatayEsit ? "hareket durumu değişmez" : hareketli ? (yon === "sağa" ? "bileşke hareketle aynı yönde, sürat artar" : "bileşke harekete zıt, sürat azalır") : "bileşke yönünde harekete başlar"}.`,
          `✅ Sonuç: ${dogru}`,
          "🔁 Kontrol edelim: “Kuvvet yoksa cisim durur” düşüncesi yanlıştır; bileşke sıfırken hareket eden cisim de sabit süratle hareketini sürdürür ✓"],
        kural: "Dengelenmiş kuvvetler hareket durumunu değiştirmez; dengelenmemiş kuvvetler sürati ya da yönü değiştirir." });
    },
  );

  SORU_EKLE("fhiz.surat",
    z => {
      let v, t; do { v = sec([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]); t = sec([5, 10, 15, 20, 25, 30, 40, 50]); } while (v * t > 600 || v * t < 40);
      const d = v * t;
      const bas = R(0, 3) * 50, son = bas + d, mx = Math.ceil((son + 50) / 100) * 100;
      const xk = x => 30 + 540 * x / mx;
      let ic = `<rect class="g-yumusak" x="20" y="70" width="560" height="44"/>` + cizgi(20, 92, 580, 92, "g-bos", 2);
      for (let x = 0; x <= mx; x += mx <= 300 ? 25 : 50) { ic += cizgi(xk(x), 114, xk(x), x % 100 ? 120 : 126, "g-cizgi", 1.5); if (x % 100 === 0) ic += Y(xk(x), 142, x + " m", { k: 1 }); }
      const araba = (x, s) => `<rect class="g-d g-cizgi" x="${x - 26}" y="74" width="52" height="18" rx="6" stroke-width="1.5"/><circle class="g-cizgi" cx="${x - 14}" cy="94" r="6" fill="#333"/><circle class="g-cizgi" cx="${x + 14}" cy="94" r="6" fill="#333"/>` + cizgi(x, 60, x, 112, "g-ok-d", 1.5) + kutu(x - 34, 24, 68, 30, "g-b", 6) + Y(x, 45, "⏱ " + s + " s", { k: 1, b: 1 });
      ic += araba(xk(bas), 0) + araba(xk(son), t);
      return S({ kaz: "fhiz.surat", duzey: "uygulama", zorluk: 2, gorsel: G.svg(600, 155, ic, "yolda hareket eden araç"),
        soru: "Düz bir yolda aynı yönde ilerleyen oyuncak arabanın iki farklı andaki konumu ve kronometrenin gösterdiği süreler şekilde verilmiştir. Araba bu sürede sabit süratle hareket etmiştir.<br>Arabanın sürati kaç <b>m/s</b>'dir?",
        dogru: v + " m/s", dogruNeden: `Alınan yol ${son} − ${bas} = ${d} m, geçen süre ${t} s; sürat ${d} ÷ ${t} = ${v} m/s.`,
        yanlis: [[bas ? od(son / t) + " m/s" : d * t + " m/s", bas ? "strateji" : "kavrama", bas ? `Yalnızca son konumu (${son} m) kullanmışsın; araba ${bas} m'den başladığı için alınan yol ${d} m'dir.` : "Yolu süreyle çarpmışsın; sürat = yol ÷ süre."], [od(t / d) + " m/s", "kavrama", "Süreyi yola bölmüşsün; sürat = alınan yol ÷ geçen süre."], [d + " m/s", "dikkat", `${d} m alınan yoldur; süreye bölmeyi unuttun.`], [v + 1 + " m/s", "islem", "Bölmeyi yeniden kontrol et."]],
        ipucu: "Sürat = alınan yol ÷ geçen süre. Alınan yolu iki konum arasındaki farktan bul.",
        cozum: ["🔎 Soruyu anlayalım: Şekilden arabanın iki konumunu ve sürelerini okuyup süratini bulacağız.",
          "💡 Hatırlayalım: Sürat = alınan yol ÷ geçen süre. Yol metre (m), süre saniye (s) ise sürat m/s olur.",
          `✏️ Şekilden okuyalım: 0 s'de araba ${bas} m çizgisinde, ${t} s'de ${son} m çizgisinde.`,
          `✏️ Alınan yol: ${son} − ${bas} = ${d} m. Geçen süre: ${t} − 0 = ${t} s.`,
          `✏️ Sürat: ${d} ÷ ${t} = ${v} m/s.`,
          `✅ Sonuç: Arabanın sürati ${v} m/s.`,
          `🔁 Kontrol edelim: ${v} m/s demek her saniye ${v} m yol almak demek; ${t} saniyede ${v} × ${t} = ${d} m ✓`],
        kural: "Sürat = alınan yol ÷ geçen süre (birimi m/s ya da km/sa)." });
    },
  );

  SORU_EKLE("fhiz.grafik",
    z => {
      const t1 = R(2, 4) * 10, t2 = t1 + R(1, 3) * 10, t3 = t2 + R(2, 4) * 10, v1 = sec([2, 3, 4]), v3 = sec([1, 2, 3, 5].filter(x => x !== v1));
      const x1 = v1 * t1, x3 = x1 + v3 * (t3 - t2);
      const N = [[0, 0], [t1, x1], [t2, x1], [t3, x3]];
      const W = 520, Hh = 280, sol = 60, sag = 490, ust = 30, alt = 240, xmax = Math.ceil(x3 / 20) * 20 + 20;
      const xk = t => sol + t / t3 * (sag - sol - 20), yk = x => alt - x / xmax * (alt - ust);
      let ic = G.ok(sol, alt + 6, sol, ust - 16) + G.ok(sol - 6, alt, sag + 14, alt) + Y(sol + 4, ust - 18, "Yol (m)", { a: "start", k: 1 }) + Y(sag + 10, alt + 34, "Zaman (s)", { a: "end", k: 1 });
      [x1, x3].forEach(x => { ic += `<line class="g-ince" x1="${sol}" y1="${yk(x)}" x2="${sag}" y2="${yk(x)}" stroke-dasharray="4 4"/>` + Y(sol - 6, yk(x) + 4, x, { a: "end", k: 1 }); });
      [t1, t2, t3].forEach(t => { ic += `<line class="g-ince" x1="${xk(t)}" y1="${ust}" x2="${xk(t)}" y2="${alt}" stroke-dasharray="4 4"/>` + Y(xk(t), alt + 18, t, { k: 1 }); });
      ic += `<polyline class="g-ok-a" fill="none" stroke-width="3" points="${N.map(([t, x]) => xk(t) + "," + yk(x)).join(" ")}"/>`;
      ["I", "II", "III"].forEach((r, i) => { ic += Y((xk(N[i][0]) + xk(N[i + 1][0])) / 2 - (i === 1 ? 0 : 14), (yk(N[i][1]) + yk(N[i + 1][1])) / 2 - 10, r, { b: 1 }); });
      const sor = sec(["dur", "surat"]);
      if (sor === "dur") return S({ kaz: "fhiz.grafik", duzey: "aciklama", zorluk: 2, gorsel: G.svg(W, Hh, ic, "yol–zaman grafiği"),
        soru: "Bir bisikletlinin yol–zaman grafiği şekilde verilmiştir.<br>Bisikletli hangi zaman aralığında <b>durmuştur</b>?",
        dogru: `II. aralıkta (${t1}–${t2} s)`, dogruNeden: `II. aralıkta zaman ilerlerken yol ${x1} m'de sabit kalıyor; alınan yol 0, yani bisikletli duruyor.`,
        yanlis: [[`I. aralıkta (0–${t1} s)`, "kavrama", `I. aralıkta yol 0'dan ${x1} m'ye artıyor; bisikletli hareket ediyor.`], [`III. aralıkta (${t2}–${t3} s)`, "kavrama", `III. aralıkta yol ${x1} m'den ${x3} m'ye artıyor; bisikletli hareket ediyor.`], ["Hiçbir aralıkta durmamıştır.", "dikkat", "Grafikte yatay (zaman eksenine paralel) bir bölüm var; orada yol değişmiyor."]],
        ipucu: "Durmak, zaman geçtiği hâlde yolun değişmemesi demektir. Grafiğin yatay olduğu yere bak.",
        cozum: ["🔎 Soruyu anlayalım: Yol–zaman grafiğinden bisikletlinin durduğu aralığı bulacağız.",
          "💡 Hatırlayalım: Yol–zaman grafiğinde eğik çizgi hareketi, zaman eksenine paralel (yatay) çizgi durmayı gösterir. Çizgi ne kadar dikse sürat o kadar büyüktür.",
          `✏️ I. aralık: yol 0 → ${x1} m, artıyor (hareket).`,
          `✏️ II. aralık: yol ${x1} m → ${x1} m, değişmiyor (durgun). III. aralık: yol ${x1} → ${x3} m, artıyor (hareket).`,
          `✅ Sonuç: Bisikletli II. aralıkta (${t1}–${t2} s) durmuştur.`,
          `🔁 Kontrol edelim: II. aralıkta sürat = 0 m ÷ ${t2 - t1} s = 0 ✓`],
        kural: "Yol–zaman grafiğinde yatay çizgi = durgunluk; eğim büyüdükçe sürat artar." });
      const i = sec([0, 2]), dx = i === 0 ? x1 : x3 - x1, dt = i === 0 ? t1 : t3 - t2, v = i === 0 ? v1 : v3, r = i === 0 ? "I" : "III";
      return S({ kaz: "fhiz.grafik", duzey: "uygulama", zorluk: 3, gorsel: G.svg(W, Hh, ic, "yol–zaman grafiği"),
        soru: `Bir bisikletlinin yol–zaman grafiği şekilde verilmiştir.<br>Bisikletlinin <b>${r}. aralıktaki</b> sürati kaç m/s'dir?`,
        dogru: v + " m/s", dogruNeden: `${r}. aralıkta ${dx} m yol ${dt} s'de alınmış: ${dx} ÷ ${dt} = ${v} m/s.`,
        yanlis: [[i === 2 ? od(x3 / t3) + " m/s" : od(x3 / t3) + " m/s", "strateji", "Bütün hareketin toplam yolunu toplam süreye bölmüşsün; yalnızca istenen aralığın yolunu ve süresini kullanmalısın."], [i === 2 ? od(x3 / (t3 - t2)) + " m/s" : od(x1 / (t2 - t1)) + " m/s", "dikkat", "Aralığın başlangıç değerlerini çıkarmayı unutmuşsun ya da yanlış süreyi kullanmışsın."], [i === 0 ? v3 + " m/s" : v1 + " m/s", "dikkat", `Bu, ${i === 0 ? "III" : "I"}. aralığın süratidir.`], ["0 m/s", "kavrama", "Sürat 0 yalnızca grafiğin yatay olduğu II. aralıkta olur."]],
        ipucu: "Aralığın başındaki ve sonundaki yol ile zaman değerlerini oku; farklarını al.",
        cozum: [`🔎 Soruyu anlayalım: Grafikten ${r}. aralıkta alınan yolu ve geçen süreyi okuyup sürati bulacağız.`,
          "💡 Hatırlayalım: Sürat = alınan yol ÷ geçen süre. Bir aralıkta alınan yol = son konum − ilk konum; geçen süre = son zaman − ilk zaman.",
          `✏️ ${r}. aralık: zaman ${i === 0 ? 0 : t2} s → ${i === 0 ? t1 : t3} s, yol ${i === 0 ? 0 : x1} m → ${i === 0 ? x1 : x3} m.`,
          `✏️ Alınan yol ${dx} m, geçen süre ${dt} s.`,
          `✏️ Sürat: ${dx} ÷ ${dt} = ${v} m/s.`,
          `✅ Sonuç: ${v} m/s.`,
          `🔁 Kontrol edelim: Grafikte ${v1 > v3 ? "I" : "III"}. aralıktaki çizgi daha dik; sürati de daha büyük (${Math.max(v1, v3)} m/s) ✓`],
        kural: "Bir aralığın sürati: (son yol − ilk yol) ÷ (son zaman − ilk zaman)." });
    },
  );

  SORU_EKLE("fhiz.hiz",
    z => {
      const H = harfler(4), s = sec([40, 50, 60, 80]), s2 = s + sec([10, 20]), yonA = sec(["doğu", "batı"]), ters = yonA === "doğu" ? "batı" : "doğu";
      const araclar = karistir([[s, yonA, true], [s, yonA, true], [s, ters, false], [s2, yonA, false]]);
      const es = araclar.map((a, i) => a[2] ? H[i] : null).filter(Boolean);
      let ic = Y(560, 24, "Kuzey ↑", { a: "end", k: 1 }) + Y(30, 24, "Batı ←  → Doğu", { a: "start", k: 1 });
      araclar.forEach(([v, y], i) => { const yy = 50 + i * 52, sag = y === "doğu"; ic += Y(30, yy + 6, H[i], { b: 1 }) + `<rect class="g-b g-cizgi" x="70" y="${yy - 12}" width="60" height="24" rx="6" stroke-width="1.5"/>` + (sag ? G.ok(140, yy, 300, yy, "g-ok-a") : G.ok(300, yy, 140, yy, "g-ok-a")) + Y(320, yy + 5, v + " km/sa", { a: "start" }); });
      const cift = (a, b) => `${a} ve ${b}`;
      const tum = []; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) tum.push([i, j]);
      const dog = cift(es[0], es[1]);
      const yanl = karistir(tum.filter(([i, j]) => cift(H[i], H[j]) !== dog)).slice(0, 3).map(([i, j]) => [cift(H[i], H[j]), araclar[i][0] === araclar[j][0] ? "kavrama" : "dikkat", araclar[i][0] === araclar[j][0] ? `${H[i]} ve ${H[j]} araçlarının süratleri eşit ama yönleri farklı; hız yönü de içerir.` : `${H[i]} ve ${H[j]} araçlarının süratleri farklı (${araclar[i][0]} ve ${araclar[j][0]} km/sa).`]);
      return S({ kaz: "fhiz.hiz", duzey: "aciklama", zorluk: 2, gorsel: G.svg(580, 250, ic, "araçların sürat ve hareket yönleri"),
        soru: "Düz bir yolda hareket eden K, L, M ve N araçlarının süratleri ve hareket yönleri şekilde gösterilmiştir.<br>Hangi iki aracın <b>hızları</b> birbirine eşittir?",
        dogru: dog, dogruNeden: `${es[0]} ve ${es[1]} araçlarının hem süratleri (${s} km/sa) hem de yönleri (${yonA}) aynıdır.`,
        yanlis: yanl,
        ipucu: "Hız = sürat + yön. Hızları eşit olan araçların hem sürati hem yönü aynı olmalı.",
        cozum: ["🔎 Soruyu anlayalım: Dört aracın süratleri ve yönleri verilmiş. Hızları eşit olan ikisini bulacağız.",
          "💡 Hatırlayalım: Sürat yalnızca birim zamanda alınan yolu (büyüklüğü) gösterir. Hız ise sürat ile hareketin yönünü birlikte belirtir. İki hızın eşit olması için hem büyüklük hem yön aynı olmalı.",
          "✏️ Şekilden okuyalım: " + araclar.map((a, i) => `${H[i]}: ${a[0]} km/sa, ${a[1]}`).join("; ") + ".",
          `✏️ Sürati ${s} km/sa ve yönü ${yonA} olan araçlar: ${es.join(" ve ")}. Aynı süratte olup ${ters} yönünde giden aracın hızı farklıdır.`,
          `✅ Sonuç: ${dog}.`,
          "🔁 Kontrol edelim: Süratleri eşit iki araç farklı yönlere gidiyorsa hızları farklıdır; günlük dilde karıştırılsa da fen bilimlerinde hız ve sürat farklı kavramlardır ✓"],
        kural: "Sürat = büyüklük; hız = büyüklük + yön." });
    },
  );
})();
