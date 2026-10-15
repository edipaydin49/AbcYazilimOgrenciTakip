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
  const GEZ = ["Merkür", "Venüs", "Dünya", "Mars", "Jüpiter", "Satürn", "Uranüs", "Neptün"], GEZD = ["Merkür'dür", "Venüs'tür", "Dünya'dır", "Mars'tır", "Jüpiter'dir", "Satürn'dür", "Uranüs'tür", "Neptün'dür"];
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
        dogruNeden: gunes ? `Bütün oklar ${kG} cisminden çıkıyor; ışığı üreten cisim Güneş'tir ve Güneş bir yıldızdır.` : `${kA} cismine ${kG} cisminden gelen ışık ondan ${kD} cismine gidiyor; ${kA} yalnızca ışığı yansıtan Ay'dır.`,
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
        dogru: GEZ[i], dogruNeden: `${H[i]}, Güneş'ten itibaren ${i + 1}. yörüngededir; Güneş'ten uzaklık sırasına göre ${i + 1}. gezegen ${GEZD[i]}.`,
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
        dogru: N[hedef] + " numaralı konum", dogruNeden: `${N[hedef]} numaralı konumda ${ACK[hedef]}; ${sor === "ay" ? "Dünya'nın gölgesi Ay'a düşer" : "Ay'ın gölgesi Dünya'ya düşer"}.`,
        yanlis: [0, 1, 2, 3].filter(i => i !== hedef).map(i => [N[i] + " numaralı konum", i === (hedef ^ 2) ? "kavrama" : "dikkat", `${N[i]} numaralı konumda ${ACK[i]}; ${i === (hedef ^ 2) ? (sor === "ay" ? "bu konumda Güneş tutulması olabilir, Ay tutulması olmaz" : "bu konumda Ay tutulması olabilir, Güneş tutulması olmaz") : "Güneş, Dünya ve Ay aynı doğru üzerinde değil, tutulma olmaz"}.`]),
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
      const xk = x => 50 + 500 * x / mx;
      let ic = `<rect class="g-yumusak" x="20" y="70" width="560" height="44"/>` + cizgi(20, 92, 580, 92, "g-bos", 2);
      for (let x = 0; x <= mx; x += mx <= 300 ? 25 : 50) { ic += cizgi(xk(x), 114, xk(x), x % 100 ? 120 : 126, "g-cizgi", 1.5); if (x % 100 === 0) ic += Y(xk(x), 142, x + " m", { k: 1 }); }
      const araba = (x, s) => `<rect class="g-d g-cizgi" x="${x - 26}" y="74" width="52" height="18" rx="6" stroke-width="1.5"/><circle class="g-cizgi" cx="${x - 14}" cy="94" r="6" fill="#333"/><circle class="g-cizgi" cx="${x + 14}" cy="94" r="6" fill="#333"/>` + cizgi(x, 60, x, 112, "g-ok-d", 1.5) + kutu(x - 34, 24, 68, 30, "g-b", 6) + Y(x, 45, "⏱ " + s + " s", { k: 1, b: 1 });
      ic += araba(xk(bas), 0) + araba(xk(son), t);
      return S({ kaz: "fhiz.surat", duzey: "uygulama", zorluk: 2, gorsel: G.svg(600, 155, ic, "yolda hareket eden araç"),
        soru: "Düz bir yolda aynı yönde ilerleyen oyuncak arabanın iki farklı andaki konumu ve kronometrenin gösterdiği süreler şekilde verilmiştir. Araba bu sürede sabit süratle hareket etmiştir.<br>Arabanın sürati kaç <b>m/s</b>'dir?",
        dogru: v + " m/s", dogruNeden: `Alınan yol ${son} − ${bas} = ${d} m, geçen süre ${t} s; sürat ${d} ÷ ${t} = ${v} m/s.`,
        yanlis: [[bas ? od(son / t) + " m/s" : d * t + " m/s", bas ? "strateji" : "kavrama", bas ? `Yalnızca son konumu (${son} m) kullanmışsın; araba ${bas} m'den başladığı için alınan yol ${d} m'dir.` : "Yolu süreyle çarpmışsın; sürat = yol ÷ süre."], [2 * v + " m/s", "islem", `Bölmeyi yeniden yap: ${d} ÷ ${t} = ${v}.`], [d + " m/s", "dikkat", `${d} m alınan yoldur; süreye bölmeyi unuttun.`], [v + 1 + " m/s", "islem", "Bölmeyi yeniden kontrol et."]],
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
        yanlis: [[od(Math.round(x3 / t3 * 10) / 10) + " m/s", "strateji", "Bütün hareketin toplam yolunu toplam süreye bölmüşsün; yalnızca istenen aralığın yolunu ve süresini kullanmalısın."], [od(Math.round((i === 2 ? x3 / (t3 - t2) : x1 / (t2 - t1)) * 10) / 10) + " m/s", "dikkat", "Aralığın başlangıç değerlerini çıkarmayı unutmuşsun ya da yanlış süreyi kullanmışsın."], [i === 0 ? v3 + " m/s" : v1 + " m/s", "dikkat", `Bu, ${i === 0 ? "III" : "I"}. aralığın süratidir.`], ["0 m/s", "kavrama", "Sürat 0 yalnızca grafiğin yatay olduğu II. aralıkta olur."]],
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
      let ic = Y(30, 24, "Batı ←  → Doğu", { a: "start", k: 1 });
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

  /* ======================= 3. ÜNİTE: ÜREME, BÜYÜME, GELİŞME; DENETLEYİCİ SİSTEMLER ======================= */
  const URT = {
    "Bölünme": { ornek: "amip, bakteri", ciz: () => `<ellipse class="g-yumusak g-cizgi" cx="90" cy="100" rx="55" ry="38" stroke-width="2"/><circle class="g-a" cx="90" cy="100" r="9"/>` + G.ok(160, 100, 220, 100) + `<ellipse class="g-yumusak g-cizgi" cx="280" cy="100" rx="45" ry="32" stroke-width="2"/><ellipse class="g-yumusak g-cizgi" cx="370" cy="100" rx="45" ry="32" stroke-width="2"/><circle class="g-a" cx="280" cy="100" r="7"/><circle class="g-a" cx="370" cy="100" r="7"/>` + G.ok(425, 100, 475, 100) + `<ellipse class="g-yumusak g-cizgi" cx="510" cy="70" rx="30" ry="22" stroke-width="2"/><ellipse class="g-yumusak g-cizgi" cx="510" cy="130" rx="30" ry="22" stroke-width="2"/>` },
    "Tomurcuklanma": { ornek: "bira mayası, hidra", ciz: () => `<ellipse class="g-c g-cizgi" cx="110" cy="100" rx="55" ry="45" stroke-width="2" fill-opacity="0.5"/><circle class="g-c g-cizgi" cx="172" cy="70" r="16" stroke-width="2" fill-opacity="0.5"/>` + G.ok(210, 100, 270, 100) + `<ellipse class="g-c g-cizgi" cx="340" cy="100" rx="55" ry="45" stroke-width="2" fill-opacity="0.5"/><ellipse class="g-c g-cizgi" cx="420" cy="62" rx="30" ry="24" stroke-width="2" fill-opacity="0.5"/>` + G.ok(455, 100, 490, 100) + `<ellipse class="g-c g-cizgi" cx="535" cy="100" rx="38" ry="32" stroke-width="2" fill-opacity="0.5"/>` },
    "Rejenerasyon (yenilenme)": { ornek: "deniz yıldızı, planarya", ciz: () => { const yildiz = (cx, cy, r, kol) => { let d = ""; for (let i = 0; i < 10; i++) { if (kol !== undefined && Math.floor(i / 2) !== kol && i % 2 === 0) { } const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; d += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1); } return `<path class="g-d g-cizgi" stroke-width="2" fill-opacity="0.6" d="${d} Z"/>`; };
      const kol = (cx, cy) => `<path class="g-d g-cizgi" stroke-width="2" fill-opacity="0.6" d="M${cx - 12} ${cy + 20} L${cx} ${cy - 40} L${cx + 12} ${cy + 20} Z"/>`;
      return kol(80, 110) + G.ok(120, 100, 200, 100) + `<path class="g-d g-cizgi" stroke-width="2" fill-opacity="0.6" d="M260 120 L270 50 L282 120 Z"/><path class="g-d g-cizgi" stroke-width="2" fill-opacity="0.6" d="M262 118 L232 108 L264 132 Z M280 118 L310 108 L278 132 Z M266 128 L250 150 L272 132 Z M276 128 L292 150 L270 132 Z"/>` + G.ok(330, 100, 400, 100) + yildiz(480, 100, 60); } },
    "Vejetatif üreme (sürünücü gövde)": { ornek: "çilek, çim", ciz: () => { const bitki = (x, s) => `<path class="g-c g-cizgi" stroke-width="1.5" d="M${x} 150 q-${20 * s} -40 -${8 * s} -${60 * s} q${8 * s} ${30 * s} ${8 * s} ${60 * s} q0 -${50 * s} ${14 * s} -${66 * s} q-${2 * s} ${40 * s} -${14 * s} ${66 * s} q${16 * s} -${40 * s} ${30 * s} -${48 * s} q-${10 * s} ${30 * s} -${30 * s} ${48 * s} Z"/>`;
      return cizgi(20, 150, 580, 150, "g-cizgi", 3) + bitki(90, 1.2) + `<path class="g-c g-cizgi" fill="none" stroke-width="3" d="M100 148 Q200 120 300 148 Q400 120 500 148"/>` + bitki(300, 0.8) + bitki(500, 0.5) + `<path class="g-cizgi" fill="none" stroke-width="1.5" d="M300 150 l-8 14 M300 150 l0 16 M300 150 l8 14 M500 150 l-6 10 M500 150 l6 10"/>`; } },
  };
  SORU_EKLE("fure.eseysiz",
    z => {
      const adlar = Object.keys(URT), ad = sec(adlar), u = URT[ad];
      return S({ kaz: "fure.eseysiz", duzey: "uygulama", zorluk: 2, gorsel: G.svg(600, 190, u.ciz(), "bir üreme şeklinin aşamaları"),
        soru: "Şekilde bir canlının yeni bireyler oluşturma aşamaları oklarla gösterilmiştir.<br>Şekilde gösterilen üreme şekli hangisidir?",
        dogru: ad, dogruNeden: `${ad} örneği: ${u.ornek}. Şekildeki aşamalar bu üreme şekline uyuyor.`,
        yanlis: adlar.filter(a => a !== ad).map(a => [a, "kavrama", a === "Bölünme" ? "Bölünmede tek hücreli canlı ortadan ikiye ayrılır; iki eşit yavru hücre oluşur." : a === "Tomurcuklanma" ? "Tomurcuklanmada ana canlının üzerinde küçük bir çıkıntı (tomurcuk) oluşur, büyür ve ayrılır." : a.startsWith("Rejenerasyon") ? "Rejenerasyonda kopan bir parçadan eksik kısımlar tamamlanarak yeni bir canlı oluşur." : "Sürünücü gövdeyle üremede toprak üstünde yayılan gövdeden kök salan yeni bitkiler gelişir."]),
        ipucu: "Yavru bireyler nasıl oluşuyor: ikiye ayrılarak mı, çıkıntıdan mı, kopan parçadan mı, yayılan gövdeden mi?",
        cozum: ["🔎 Soruyu anlayalım: Şekildeki aşamalara bakarak eşeysiz üreme şeklinin adını bulacağız.",
          "💡 Hatırlayalım: Eşeysiz üremede tek ata vardır ve yavrular atasının aynısıdır. Çeşitleri: bölünme (amip), tomurcuklanma (maya, hidra), rejenerasyon (deniz yıldızı), vejetatif üreme (çilek, patates), sporla üreme (küf mantarı).",
          `✏️ Şekli inceleyelim: ${ad === "Bölünme" ? "tek bir hücre ortadan ikiye ayrılıyor, iki eş hücre oluşuyor; bunlar da yeniden bölünüyor" : ad === "Tomurcuklanma" ? "ana canlının üzerinde küçük bir çıkıntı oluşuyor, büyüyor ve ayrılıp yeni birey oluyor" : ad.startsWith("Rejenerasyon") ? "kopan tek bir koldan eksik kollar tamamlanarak yeni bir canlı oluşuyor" : "ana bitkiden toprak üstünde yayılan gövde, belirli yerlerde kök salıp yeni bitkiler oluşturuyor"}.`,
          `✏️ Bu aşamalar ${ad.toLocaleLowerCase("tr-TR")} ile uyumludur; örnek: ${u.ornek}.`,
          `✅ Sonuç: ${ad}.`,
          "🔁 Kontrol edelim: Bu üremede tek bir ata canlı var ve yavrular atasıyla aynı özellikleri taşıyor; bu yüzden eşeysiz üremedir ✓"],
        kural: "Eşeysiz üreme: tek ata, yavrular atanın aynısı (bölünme, tomurcuklanma, rejenerasyon, vejetatif, spor)." });
    },
  );

  SORU_EKLE("fure.bitki",
    z => {
      const PARCA = ["Taç yaprak", "Çanak yaprak", "Başçık", "Tepecik", "Yumurtalık", "Sapçık"], PI = ["taç yaprağı", "çanak yaprağı", "başçığı", "tepeciği", "yumurtalığı", "sapçığı"];
      const N = karistir(["1", "2", "3", "4", "5", "6"]);
      const SORU = [[2, "Polenlerin üretildiği kısım", "Polenler erkek organın başçığında üretilir."], [3, "Tozlaşmada polenlerin konduğu kısım", "Tozlaşmada polen, dişi organın en üstündeki yapışkan tepeciğe konar."], [4, "Döllenmeden sonra meyveye dönüşen kısım", "Döllenmeden sonra yumurtalık gelişerek meyveyi oluşturur."], [0, "Renkli ve kokulu yapısıyla böcekleri çeken kısım", "Taç yapraklar renkleri ve kokularıyla böcekleri çeker."], [1, "Çiçek tomurcukken onu dıştan saran yeşil kısım", "Çanak yapraklar genellikle yeşildir ve tomurcuğu korur."]];
      const [hi, ifade, aciklama] = sec(SORU);
      let ic = cizgi(300, 300, 300, 230, "g-c", 6);
      ic += `<path class="g-c g-cizgi" stroke-width="1.5" d="M300 232 Q250 230 236 196 Q270 206 300 222 Z M300 232 Q350 230 364 196 Q330 206 300 222 Z"/>`; // çanak
      ic += `<path class="g-d g-cizgi" stroke-width="1.5" fill-opacity="0.55" d="M296 220 Q210 210 190 110 Q250 140 292 200 Z M304 220 Q390 210 410 110 Q350 140 308 200 Z"/>`; // taç
      ic += `<ellipse class="g-b g-cizgi" cx="300" cy="200" rx="24" ry="22" stroke-width="2"/><rect class="g-b g-cizgi" x="295" y="110" width="10" height="72" stroke-width="1.5"/><ellipse class="g-b g-cizgi" cx="300" cy="104" rx="16" ry="8" stroke-width="2"/>`; // dişi organ
      ic += cizgi(278, 200, 248, 128, "g-cizgi", 2) + cizgi(322, 200, 352, 128, "g-cizgi", 2) + `<ellipse class="g-a g-cizgi" cx="246" cy="122" rx="9" ry="13" stroke-width="1.5"/><ellipse class="g-a g-cizgi" cx="354" cy="122" rx="9" ry="13" stroke-width="1.5"/>`;
      const hedefler = [[200, 140], [244, 214], [354, 112], [300, 98], [300, 204], [342, 160]], etk = [[110, 120], [150, 268], [470, 70], [190, 40], [470, 240], [480, 160]];
      hedefler.forEach(([x, y], i) => { const [lx, ly] = etk[i]; ic += `<line class="g-ince" x1="${lx}" y1="${ly}" x2="${x}" y2="${y}" stroke-width="1.2"/><circle class="g-bos g-cizgi" cx="${lx}" cy="${ly}" r="13" stroke-width="1.5"/>` + Y(lx, ly + 5, N[i], { b: 1 }); });
      return S({ kaz: "fure.bitki", duzey: "uygulama", zorluk: 2, gorsel: G.svg(600, 310, ic, "numaralandırılmış çiçek kesiti"),
        soru: `Şekilde bir çiçeğin bölümleri numaralarla gösterilmiştir.<br><b>${ifade}</b> hangi numarayla gösterilmiştir?`,
        dogru: N[hi] + " numaralı kısım", dogruNeden: `${N[hi]} numara ${PI[hi]} gösteriyor. ${aciklama}`,
        yanlis: karistir([0, 1, 2, 3, 4, 5].filter(i => i !== hi)).slice(0, 3).map(i => [N[i] + " numaralı kısım", "bilgi", `${N[i]} numara ${PI[i]} gösteriyor; ${aciklama.toLocaleLowerCase("tr-TR").replace(/\.$/, "")}.`]),
        ipucu: "Önce numaraların hangi yapıyı gösterdiğini bul: erkek organın ucunda başçık, dişi organın tepesinde tepecik, tabanında yumurtalık vardır.",
        cozum: [`🔎 Soruyu anlayalım: “${ifade}” ifadesine uyan yapının numarasını bulacağız.`,
          "💡 Hatırlayalım: Çiçeğin bölümleri: çanak yaprak (dışta, yeşil), taç yaprak (renkli), erkek organ (sapçık + başçık; polen üretir), dişi organ (tepecik + dişicik borusu + yumurtalık).",
          "✏️ Şekildeki numaraları eşleştirelim: " + PARCA.map((p, i) => `${N[i]} → ${p.toLocaleLowerCase("tr-TR")}`).join(", ") + ".",
          `✏️ ${aciklama}`,
          `✅ Sonuç: ${N[hi]} numaralı kısım (${PARCA[hi].toLocaleLowerCase("tr-TR")}).`,
          "🔁 Kontrol edelim: Tozlaşma = polenin başçıktan tepeciğe taşınması; döllenme = yumurtalıkta polenin üreme hücresiyle yumurtanın birleşmesi ✓"],
        kural: "Başçık polen üretir, tepecik poleni tutar, yumurtalık meyveye dönüşür." });
    },
  );

  SORU_EKLE("fure.gelisme",
    z => {
      const DONGU = { kurbağa: ["Yumurta", "İribaş", "Bacaklı iribaş", "Ergin kurbağa"], kelebek: ["Yumurta", "Tırtıl", "Pupa", "Ergin kelebek"] };
      const hay = sec(["kurbağa", "kelebek"]), d = DONGU[hay], gizli = R(1, 3), hayIn = { kurbağa: "kurbağanın", kelebek: "kelebeğin" }[hay];
      const P = [[300, 45], [520, 140], [300, 235], [80, 140]];
      let ic = "";
      P.forEach(([x, y], i) => { ic += kutu(x - 80, y - 24, 160, 48, i === gizli ? "g-b" : "g-yumusak", 12) + Y(x, y + 5, i === gizli ? "?" : d[i], { b: 1 }); });
      ic += G.ok(385, 60, 470, 112) + G.ok(470, 168, 385, 222) + G.ok(215, 222, 130, 168) + G.ok(130, 112, 215, 60);
      const diger = hay === "kurbağa" ? DONGU.kelebek : DONGU.kurbağa;
      const yan = karistir(d.filter((_, i) => i !== gizli && i !== 0).map(x => [x, "dikkat", `${x} döngüde başka bir yerde; okların yönünü izle.`]).concat(diger.slice(1, 3).map(x => [x, "bilgi", `${x}, ${hay === "kurbağa" ? "kelebeğin" : "kurbağanın"} gelişim evresidir.`])));
      return S({ kaz: "fure.gelisme", duzey: "uygulama", zorluk: 2, gorsel: G.svg(600, 280, ic, `${hay} yaşam döngüsü`),
        soru: `Şekilde bir ${hayIn} yaşam döngüsü oklarla gösterilmiş, bir evresi “?” ile gizlenmiştir.<br>“?” ile gösterilen evre hangisidir?`,
        dogru: d[gizli], dogruNeden: `${buyuk(hayIn)} gelişimi: ${d.join(" → ")}. “?” ${gizli + 1}. evredir.`,
        yanlis: yan,
        ipucu: "Yumurtadan başlayarak okların yönünde ilerle.",
        cozum: [`🔎 Soruyu anlayalım: ${buyuk(hayIn)} yaşam döngüsündeki eksik evreyi bulacağız.`,
          `💡 Hatırlayalım: ${buyuk(hay)}, yumurtadan çıkan yavrusu ergine hiç benzemeyen ve başkalaşım geçiren bir canlıdır; buna dolaylı gelişme denir.`,
          `✏️ ${buyuk(hayIn)} evreleri sırasıyla: ${d.join(" → ")}.`,
          `✏️ Şekilde yumurtadan başlayıp okları izleyelim: ${d.map((x, i) => i === gizli ? "?" : x).join(" → ")}.`,
          `✅ Sonuç: “?” yerine ${d[gizli].toLocaleLowerCase("tr-TR")} gelir.`,
          "🔁 Kontrol edelim: İnsan, kedi, tavuk gibi canlılarda yavru ergine benzer (doğrudan gelişme); kurbağa ve kelebekte ise başkalaşım vardır ✓"],
        kural: `Dolaylı gelişme (başkalaşım): ${d.join(" → ")}.` });
    },
  );

  SORU_EKLE("fden.sinir",
    z => {
      const ADIM = ["Deri (alıcı)", "Duyu nöronu", "Omurilik", "Motor nöron", "Kol kasları"];
      const gizli = sec([1, 2, 2, 3, 4]);
      let ic = `<text x="40" y="70" font-size="34" text-anchor="middle">🔥</text><text x="40" y="112" font-size="30" text-anchor="middle">✋</text>`;
      ADIM.forEach((a, i) => { const x = 85 + i * 102; ic += kutu(x, 60, 92, 54, i === gizli ? "g-b" : "g-yumusak", 10) + (i === gizli ? Y(x + 46, 93, "?", { b: 1 }) : a.split(" ").map((w, k, ar) => Y(x + 46, 90 + (k - (ar.length - 1) / 2) * 16, w, { k: 1, b: 1 })).join("")); if (i < 4) ic += G.ok(x + 92, 87, x + 102, 87, "g-ok-a"); });
      ic += Y(300, 160, "Sıcak sobaya dokunan el hemen geri çekiliyor.", { k: 1 });
      const yan = ADIM.filter((_, i) => i !== gizli).map(a => [a, "dikkat", `${a} şemada başka bir kutuda yer alıyor; refleks yolunu sırayla izle.`]).concat([["Beyin", "kavrama", "Refleksler beyne danışılmadan, omurilik tarafından yönetilir; bu yüzden çok hızlıdır."]]);
      return S({ kaz: "fden.sinir", duzey: "uygulama", zorluk: 2, gorsel: G.svg(610, 175, ic, "refleks yolu şeması"),
        soru: "Şekilde, sıcak sobaya dokunulduğunda elin hemen geri çekilmesini sağlayan refleks yolu gösterilmiş ve bir kutu “?” ile gizlenmiştir.<br>“?” ile gösterilen yapı hangisidir?",
        dogru: ADIM[gizli], dogruNeden: `Refleks yolu: ${ADIM.join(" → ")}. “?” ${gizli + 1}. sıradadır.`,
        yanlis: karistir(yan).slice(0, 3),
        ipucu: "Uyarı deriden alınır, duyu nöronuyla merkeze taşınır, merkezden gelen emir motor nöronla kasa iletilir.",
        cozum: ["🔎 Soruyu anlayalım: Refleks yolundaki eksik yapıyı bulacağız.",
          "💡 Hatırlayalım: Refleks, istemsiz ve çok hızlı bir tepkidir. Omurilik refleks merkezidir; uyarıyı beyne danışmadan değerlendirir.",
          "✏️ Refleks yolunu sıralayalım: deri sıcaklığı algılar → duyu nöronu uyarıyı omuriliğe taşır → omurilik cevap oluşturur → motor nöron emri kaslara iletir → kol kasları kasılır, el çekilir.",
          `✏️ Şemada “?” ${gizli + 1}. kutuda; bu sırada ${ADIM[gizli].toLocaleLowerCase("tr-TR")} bulunur.`,
          `✅ Sonuç: ${ADIM[gizli]}.`,
          "🔁 Kontrol edelim: Elimizi çektikten sonra “Yandım!” diye acıyı fark etmemiz beynin işidir; ama elin çekilmesi omuriliğin yönettiği reflekstir ✓"],
        kural: "Refleks yolu: alıcı → duyu nöronu → omurilik → motor nöron → kas." });
    },
  );

  SORU_EKLE("fden.hormon",
    z => {
      const BEZ = [["Hipofiz", [300, 50], "büyüme hormonunu salgılayıp vücudun büyümesini düzenleyen", "Büyüme hormonu hipofizden salgılanır; hipofiz diğer bezleri de yönettiği için “ana bez” olarak bilinir."], ["Tiroit", [300, 118], "metabolizma hızını (vücudun enerji kullanma hızını) düzenleyen", "Tiroit bezi boyunda bulunur; salgıladığı hormon metabolizma hızını ayarlar."], ["Pankreas", [285, 215], "kandaki şeker miktarını düzenleyen (insülin salgılayan)", "Pankreas insülin ve glukagon hormonlarıyla kan şekerini dengeler."], ["Böbreküstü bezi", [335, 196], "korku ve heyecan anında adrenalin salgılayan", "Böbreküstü bezleri böbreklerin üstündedir; tehlike anında adrenalin salgılar."]];
      const N = karistir(["1", "2", "3", "4"]), i = R(0, 3), BI = ["hipofizi", "tiroit bezini", "pankreası", "böbreküstü bezini"];
      let ic = `<circle class="g-yumusak g-cizgi" cx="300" cy="50" r="34" stroke-width="2"/><rect class="g-yumusak g-cizgi" x="286" y="84" width="28" height="26" stroke-width="2"/><path class="g-yumusak g-cizgi" stroke-width="2" d="M250 110 h100 l40 120 h-28 l-22 -70 v150 h-30 v-110 h-20 v110 h-30 v-150 l-22 70 h-28 Z"/>`;
      ic += `<ellipse class="g-d" cx="335" cy="215" rx="9" ry="13" fill-opacity="0.35"/>`;
      const L = [[430, 40], [430, 112], [150, 230], [430, 196]];
      BEZ.forEach(([ad, [x, y]], k) => { const [lx, ly] = L[k]; ic += `<circle class="g-b g-cizgi" cx="${x}" cy="${y}" r="6" stroke-width="1.5"/><line class="g-ince" x1="${lx}" y1="${ly}" x2="${x}" y2="${y}" stroke-width="1.2"/><circle class="g-bos g-cizgi" cx="${lx}" cy="${ly}" r="13" stroke-width="1.5"/>` + Y(lx, ly + 5, N[k], { b: 1 }); });
      return S({ kaz: "fden.hormon", duzey: "uygulama", zorluk: 2, gorsel: G.svg(560, 390, ic, "insan vücudunda bazı iç salgı bezleri"),
        soru: `Şekilde insan vücudundaki bazı iç salgı bezlerinin yerleri numaralarla gösterilmiştir.<br>${buyuk(BEZ[i][2])} bez hangi numarayla gösterilmiştir?`,
        dogru: N[i] + " numaralı bez", dogruNeden: `${N[i]} numara ${BI[i]} gösteriyor. ${BEZ[i][3]}`,
        yanlis: BEZ.map((b, k) => [N[k] + " numaralı bez", "bilgi", `${N[k]} numara ${BI[k]} gösteriyor; bu bez ${b[2]} bezdir.`]).filter((_, k) => k !== i),
        ipucu: "Önce bezlerin yerlerini düşün: hipofiz beynin altında, tiroit boyunda, pankreas midenin arkasında, böbreküstü bezleri böbreklerin üstünde.",
        cozum: ["🔎 Soruyu anlayalım: Verilen göreve sahip bezin numarasını şekilden bulacağız.",
          "💡 Hatırlayalım: İç salgı bezleri hormonlarını doğrudan kana verir. Hipofiz → büyüme hormonu; tiroit → metabolizma hızı; pankreas → insülin (kan şekeri); böbreküstü → adrenalin.",
          "✏️ Şekildeki numaraları eşleştirelim: " + BEZ.map((b, k) => `${N[k]} → ${b[0].toLocaleLowerCase("tr-TR")}`).join(", ") + ".",
          `✏️ ${BEZ[i][3]}`,
          `✅ Sonuç: ${N[i]} numaralı bez (${BEZ[i][0].toLocaleLowerCase("tr-TR")}).`,
          "🔁 Kontrol edelim: Hormonlar kan yoluyla taşındığı için etkileri sinirlere göre daha yavaş ama daha uzun sürelidir ✓"],
        kural: "Hipofiz: büyüme; tiroit: metabolizma; pankreas: kan şekeri; böbreküstü: adrenalin." });
    },
  );

  SORU_EKLE("fden.ergenlik",
    z => {
      const kiz = R(0, 1) === 1, tepe = kiz ? sec([11, 12]) : sec([13, 14]);
      const yas = [8, 9, 10, 11, 12, 13, 14, 15, 16];
      const v = yas.map(a => a === tepe ? sec([8, 9, 10]) : Math.abs(a - tepe) === 1 ? sec([6, 7]) : a < tepe ? sec([5, 5, 4]) : Math.max(1, 6 - 2 * (a - tepe)));
      const ad = kiz ? "Elif" : "Kerem";
      return S({ kaz: "fden.ergenlik", duzey: "transfer", zorluk: 2, gorsel: G.sutun(yas.map((a, i) => [a + "→" + (a + 1), v[i]]), { baslik: `${ad}'${kiz ? "in" : "in"} yıllık boy artışı`, birim: "cm" }),
        soru: `Grafikte ${ad}'${kiz ? "in" : "in"} 8 ile 17 yaş arasında her yıl ne kadar uzadığı gösterilmiştir.<br>Grafiğe göre ${ad}'${kiz ? "in" : "in"} <b>ergenlik döneminde</b> görülen hızlı büyüme (büyüme atağı) hangi yaş aralığındadır?`,
        dogru: `${tepe}–${tepe + 1} yaş arası`, dogruNeden: `${tepe}→${tepe + 1} sütunu en uzun (${v[yas.indexOf(tepe)]} cm); boy artışının en hızlı olduğu dönem budur.`,
        yanlis: [["16–17 yaş arası", "strateji", "Bu aralıkta boy en uzundur ama yıllık artış en azdır; soru büyümenin en hızlı olduğu aralığı soruyor."], ["8–9 yaş arası", "dikkat", "Bu aralıkta yıllık boy artışı daha azdır."], [`${tepe - 2}–${tepe - 1} yaş arası`, "dikkat", "Sütunları karşılaştır; bu aralıktaki artış en büyük değil."], [`${tepe + 2}–${tepe + 3} yaş arası`, "dikkat", "Sütunları karşılaştır; bu aralıkta artış azalmaya başlamış."]],
        ipucu: "Grafik boyu değil yıllık boy artışını gösteriyor. En uzun sütunu bul.",
        cozum: ["🔎 Soruyu anlayalım: Grafikte her yaş aralığında boyun kaç cm arttığı gösterilmiş. Büyüme atağının olduğu aralığı bulacağız.",
          "💡 Hatırlayalım: Ergenlik döneminde hipofiz ve eşey bezlerinden salgılanan hormonların etkisiyle boy kısa sürede hızla uzar. Bu dönem kızlarda genellikle erkeklerden biraz daha erken başlar.",
          "✏️ Grafikten okuyalım: " + yas.map((a, i) => `${a}→${a + 1}: ${v[i]} cm`).join(", ") + ".",
          `✏️ En büyük artış ${v[yas.indexOf(tepe)]} cm ile ${tepe}–${tepe + 1} yaş arasındadır.`,
          `✅ Sonuç: ${tepe}–${tepe + 1} yaş arası.`,
          "🔁 Kontrol edelim: Bu aralıktan sonra yıllık artış azalıyor ama boy uzamaya devam ediyor; büyüme yavaşlıyor, durmuyor ✓"],
        kural: "Ergenlikte büyüme hızlanır (büyüme atağı); kızlarda genellikle daha erken başlar." });
    },
  );

  /* ======================= 4. ÜNİTE: IŞIK ======================= */
  SORU_EKLE("fyan.kanun",
    z => {
      const a = sec([20, 25, 30, 35, 40, 50, 55, 60, 65, 70]), g = 90 - a, sor = sec(["gelme", "arasi"]);
      const rad = a * Math.PI / 180, L = 170, cx = 280, cy = 220;
      const x1 = cx - L * Math.cos(rad), y1 = cy - L * Math.sin(rad), x2 = cx + L * Math.cos(rad), y2 = y1;
      let ic = `<rect class="g-yumusak" x="60" y="${cy}" width="440" height="14"/>` + cizgi(60, cy, 500, cy, "g-cizgi", 3);
      for (let x = 70; x < 500; x += 16) ic += cizgi(x, cy + 14, x + 10, cy + 2, "g-cizgi", 1);
      ic += `<line class="g-cizgi" x1="${cx}" y1="${cy}" x2="${cx}" y2="30" stroke-dasharray="6 5" stroke-width="1.5"/>` + Y(cx + 6, 26, "normal", { a: "start", k: 1 });
      ic += G.ok(x1, y1, cx - 4, cy - 2, "g-ok-d") + G.ok(cx, cy, x2, y2, "g-ok-d");
      ic += `<path class="g-cizgi" fill="none" stroke-width="1.5" d="M${cx - 60} ${cy} A60 60 0 0 1 ${(cx - 60 * Math.cos(rad)).toFixed(1)} ${(cy - 60 * Math.sin(rad)).toFixed(1)}"/>` + Y(cx - 75, cy - 12, a + "°", { a: "end", b: 1 });
      ic += Y(x1 - 10, y1 - 8, "gelen ışın", { k: 1 }) + Y(x2 + 10, y2 - 8, "yansıyan ışın", { k: 1 });
      const dogru = sor === "gelme" ? g + "°" : 2 * g + "°";
      return S({ kaz: "fyan.kanun", duzey: "uygulama", zorluk: 2, gorsel: G.svg(560, 250, ic, "düz aynada yansıma"),
        soru: `Şekilde düz bir aynaya gelen ışın ile aynanın yüzeyi arasındaki açı ${a}° olarak verilmiştir.<br>${sor === "gelme" ? "Bu ışının <b>yansıma açısı</b> kaç derecedir?" : "Gelen ışın ile yansıyan ışın arasındaki açı kaç derecedir?"}`,
        dogru, dogruNeden: sor === "gelme" ? `Gelme açısı normal ile ölçülür: 90° − ${a}° = ${g}°. Yansıma açısı gelme açısına eşittir: ${g}°.` : `Gelme açısı 90° − ${a}° = ${g}°, yansıma açısı da ${g}°; ikisinin toplamı ${2 * g}°.`,
        yanlis: [[(sor === "gelme" ? a : 2 * a) + "°", "kavrama", "Açıyı aynanın yüzeyinden ölçmüşsün; gelme ve yansıma açıları normal ile yapılan açılardır."], [(sor === "gelme" ? 2 * g : g) + "°", "dikkat", sor === "gelme" ? "Bu, gelen ve yansıyan ışın arasındaki açıdır; yansıma açısı bunun yarısıdır." : "Bu, yalnızca yansıma açısıdır; iki ışın arasındaki açı gelme + yansıma açısıdır."], [(180 - 2 * a === 2 * g ? 180 - a : 180 - 2 * a) + "°", "islem", "Normal ile ışın arasındaki açıyı yeniden hesapla: 90° − " + a + "°."], ["90°", "kavrama", "Normal aynaya diktir (90°) ama gelme açısı ışın ile normal arasındaki açıdır."]],
        ipucu: "Gelme açısı, gelen ışın ile normal arasındaki açıdır. Normal aynaya diktir.",
        cozum: [`🔎 Soruyu anlayalım: Şekilde verilen ${a}°, ışın ile ayna yüzeyi arasındaki açıdır. ${sor === "gelme" ? "Yansıma açısını" : "İki ışın arasındaki açıyı"} bulacağız.`,
          "💡 Hatırlayalım: Normal, ışının geldiği noktada aynaya dik olan hayalî doğrudur. Gelme açısı = gelen ışın ile normal arasındaki açı; yansıma açısı = yansıyan ışın ile normal arasındaki açı. Yansıma kanunu: gelme açısı = yansıma açısı.",
          `✏️ Normal aynaya dik (90°) olduğu için gelme açısı = 90° − ${a}° = ${g}°.`,
          `✏️ Yansıma açısı = gelme açısı = ${g}°.`,
          sor === "gelme" ? `✏️ İstenen yansıma açısı ${g}°.` : `✏️ Gelen ve yansıyan ışın arasındaki açı = ${g}° + ${g}° = ${2 * g}°.`,
          `✅ Sonuç: ${dogru}.`,
          `🔁 Kontrol edelim: Yansıyan ışın da ayna ile ${a}° açı yapar; şekil normale göre simetriktir ✓`],
        kural: "Açılar normalden ölçülür; gelme açısı = yansıma açısı." });
    },
  );

  SORU_EKLE("fyan.tur",
    z => {
      const [kD, kG] = karistir(["K", "L"]), sor = sec(["duzgun", "dagnik", "goruntu"]);
      const yuzey = (x0, duz) => {
        let ic = duz ? `<rect class="g-yumusak g-cizgi" x="${x0}" y="160" width="220" height="16" stroke-width="2"/>` : `<path class="g-yumusak g-cizgi" stroke-width="2" d="M${x0} 176 V160 ${[...Array(11).keys()].map(i => `L${x0 + 10 + i * 20} ${i % 2 ? 150 : 166} L${x0 + 20 + i * 20} 160`).join(" ")} V176 Z"/>`;
        const gx = [40, 90, 140];
        gx.forEach((d, i) => { const px = x0 + d + 20; ic += G.ok(px - 70, 40, px, 158, "g-ok-d"); const yon = duz ? [70, -118] : [[-60, -100], [100, -60], [10, -120]][i]; ic += G.ok(px, 158, px + yon[0] * 0.75, 158 + yon[1] * 0.75, "g-ok-a"); });
        return ic;
      };
      const solD = kD === "K";
      let ic = yuzey(20, solD) + yuzey(320, !solD) + Y(130, 200, "K yüzeyi", { b: 1 }) + Y(430, 200, "L yüzeyi", { b: 1 });
      const S1 = { duzgun: ["Hangi yüzeyde <b>düzgün yansıma</b> olmuştur ve bu yüzeye bir örnek hangisidir?", `${kD} yüzeyi; ayna`, [[`${kG} yüzeyi; ayna`, "kavrama", `${kG} yüzeyinde paralel gelen ışınlar farklı yönlere dağılıyor; bu dağınık yansımadır.`], [`${kD} yüzeyi; kâğıt`, "bilgi", "Kâğıdın yüzeyi pürüzlüdür, dağınık yansıma yapar; düzgün yansımaya örnek ayna ya da durgun su yüzeyidir."], [`${kG} yüzeyi; tahta`, "kavrama", `${kG} yüzeyinde ışınlar dağılıyor; düzgün yansıma ${kD} yüzeyindedir.`]]],
        dagnik: ["Hangi yüzeyde <b>dağınık yansıma</b> olmuştur ve bu yüzeye bir örnek hangisidir?", `${kG} yüzeyi; defter sayfası`, [[`${kD} yüzeyi; defter sayfası`, "kavrama", `${kD} yüzeyinde paralel gelen ışınlar yine paralel yansıyor; bu düzgün yansımadır.`], [`${kG} yüzeyi; ayna`, "bilgi", "Ayna düzgün yansıma yapar; dağınık yansıma pürüzlü yüzeylerde olur."], [`${kD} yüzeyi; durgun su`, "kavrama", `${kD} yüzeyinde düzgün yansıma oluyor; soru dağınık yansımayı soruyor.`]]],
        goruntu: ["Bu yüzeylerden hangisine bakan bir kişi, yüzeyde <b>kendi görüntüsünü</b> net olarak görebilir?", `${kD} yüzeyine bakan kişi`, [[`${kG} yüzeyine bakan kişi`, "kavrama", `${kG} yüzeyinde ışınlar her yöne dağıldığı için net görüntü oluşmaz.`], ["Her iki yüzeye bakan kişi", "kavrama", "Yalnızca düzgün yansıma yapan yüzeyde net görüntü oluşur."], ["Hiçbirine bakan kişi", "kavrama", `${kD} yüzeyinde ışınlar düzgün yansıdığı için görüntü oluşur.`]]] }[sor];
      return S({ kaz: "fyan.tur", duzey: "aciklama", zorluk: 2, gorsel: G.svg(580, 215, ic, "iki yüzeyde ışığın yansıması"),
        soru: "Şekilde K ve L yüzeylerine birbirine paralel gelen ışınların yansıması gösterilmiştir.<br>" + S1[0],
        dogru: S1[1], dogruNeden: `${kD} yüzeyinde paralel gelen ışınlar paralel yansıyor (düzgün yansıma); ${kG} yüzeyinde ışınlar her yöne dağılıyor (dağınık yansıma).`,
        yanlis: S1[2],
        ipucu: "Yansıyan ışınlar birbirine paralel mi, yoksa farklı yönlere mi gidiyor?",
        cozum: ["🔎 Soruyu anlayalım: İki yüzeydeki yansıyan ışınlara bakarak yansıma türlerini belirleyeceğiz.",
          "💡 Hatırlayalım: Pürüzsüz ve parlak yüzeylerde paralel gelen ışınlar paralel yansır: düzgün yansıma (ayna, durgun su). Pürüzlü yüzeylerde ışınlar farklı yönlere yansır: dağınık yansıma (kâğıt, tahta, duvar).",
          `✏️ ${kD} yüzeyi düz; yansıyan ışınlar birbirine paralel → düzgün yansıma.`,
          `✏️ ${kG} yüzeyi pürüzlü; yansıyan ışınlar farklı yönlere gidiyor → dağınık yansıma. Her ışın yine yansıma kanununa uyar; yalnızca her noktada normalin yönü farklıdır.`,
          `✅ Sonuç: ${S1[1]}.`,
          "🔁 Kontrol edelim: Odadaki eşyaları her yönden görebilmemiz dağınık yansıma sayesindedir; kendimizi ise aynada düzgün yansıma sayesinde görürüz ✓"],
        kural: "Düzgün yansıma → paralel ışınlar, net görüntü; dağınık yansıma → ışınlar dağılır, görüntü oluşmaz." });
    },
  );

  SORU_EKLE("fyan.ayna",
    z => {
      const tur = sec(["çukur", "tümsek", "düz"]);
      let ic = "";
      const cx = 360, cy = 120;
      if (tur === "çukur") ic += `<path class="g-cizgi" fill="none" stroke-width="5" d="M380 30 Q320 120 380 210"/>`;
      else if (tur === "tümsek") ic += `<path class="g-cizgi" fill="none" stroke-width="5" d="M330 30 Q390 120 330 210"/>`;
      else ic += cizgi(355, 30, 355, 210, "g-cizgi", 5);
      [-60, -30, 0, 30, 60].forEach(d => {
        const y = cy + d, xv = tur === "düz" ? 353 : tur === "çukur" ? 352 + Math.abs(d) * 0.35 + d * d / 300 : 358 - d * d / 200;
        ic += G.ok(40, y, xv - 2, y, "g-ok-d");
        if (tur === "çukur") ic += `<line class="g-ok-a" x1="${xv}" y1="${y}" x2="${190}" y2="${cy - d * 0.08}" stroke-width="2.5"/>`;
        else if (tur === "tümsek") ic += G.ok(xv, y, xv - 140, y + d * 1.4, "g-ok-a");
        else ic += `<line class="g-ok-a" x1="${xv}" y1="${y}" x2="${xv - 300}" y2="${y + 4}" stroke-width="1.5" stroke-dasharray="6 4"/>`;
      });
      const KUL = { çukur: "el fenerinin ve araba farının yansıtıcısı", tümsek: "araçların yan aynaları ve virajlardaki trafik aynaları", düz: "boy aynası ve periskop" };
      const DAV = { çukur: "paralel gelen ışınları bir noktada toplar", tümsek: "paralel gelen ışınları dağıtır", düz: "paralel gelen ışınları paralel olarak geri yansıtır" };
      const dogru = `${buyuk(tur)} ayna; ${KUL[tur]}`;
      const digerT = ["çukur", "tümsek", "düz"].filter(t => t !== tur);
      return S({ kaz: "fyan.ayna", duzey: "baglanti", zorluk: 2, gorsel: G.svg(560, 240, ic, "aynaya gelen paralel ışınlar"),
        soru: "Şekilde bir aynaya birbirine paralel gelen ışınlar (kırmızı) ve yansıyan ışınlar (mavi) gösterilmiştir.<br>Bu ayna hangi tür aynadır ve günlük hayatta nerede kullanılır?",
        dogru, dogruNeden: `Ayna ${DAV[tur]}; bu ${tur} aynanın özelliğidir. Kullanım alanı: ${KUL[tur]}.`,
        yanlis: [[`${buyuk(digerT[0])} ayna; ${KUL[digerT[0]]}`, "kavrama", `${buyuk(digerT[0])} ayna ${DAV[digerT[0]]}; şekildeki ışınlar böyle yansımıyor.`], [`${buyuk(digerT[1])} ayna; ${KUL[digerT[1]]}`, "kavrama", `${buyuk(digerT[1])} ayna ${DAV[digerT[1]]}; şekildeki ışınlar böyle yansımıyor.`], [`${buyuk(tur)} ayna; ${KUL[digerT[0]]}`, "bilgi", `Aynanın türünü doğru buldun ama kullanım alanı ${digerT[0]} aynaya aittir.`]],
        ipucu: "Yansıyan ışınlar bir noktada mı toplanıyor, dağılıyor mu, yoksa paralel mi kalıyor?",
        cozum: ["🔎 Soruyu anlayalım: Paralel ışınların yansıma biçiminden aynanın türünü ve kullanım alanını bulacağız.",
          "💡 Hatırlayalım: Düz ayna paralel ışınları paralel yansıtır. Çukur ayna paralel ışınları bir noktada toplar. Tümsek ayna paralel ışınları dağıtır ve geniş bir alanı gösterir.",
          `✏️ Şekilde yansıyan ışınlar ${tur === "çukur" ? "aynanın önünde bir noktada toplanıyor" : tur === "tümsek" ? "birbirinden uzaklaşarak dağılıyor" : "birbirine paralel olarak geri dönüyor"}.`,
          `✏️ Bu davranış ${tur} aynaya aittir. ${tur === "çukur" ? "Ters yönde düşünürsek, odaktaki ampulün ışığı paralel demet hâline gelir; bu yüzden el fenerlerinde kullanılır." : tur === "tümsek" ? "Geniş görüş alanı sağladığı için sürücüler arkayı ve virajları daha geniş görür." : "Görüntü cisimle aynı büyüklükte olduğu için boy aynasında kullanılır."}`,
          `✅ Sonuç: ${dogru}.`,
          "🔁 Kontrol edelim: Kaşığın iç yüzü çukur, dış yüzü tümsek aynaya benzer; iki yüzde görüntünün nasıl değiştiğini deneyerek görebilirsin ✓"],
        kural: "Çukur ayna toplar (fener), tümsek ayna dağıtır (araç yan aynası), düz ayna paralel yansıtır (boy aynası)." });
    },
  );

  SORU_EKLE("fsog.sogurma",
    z => {
      const R3 = karistir(["siyah", "beyaz", "kırmızı"]), T0 = 20;
      const artis = { siyah: R(14, 18), kırmızı: R(8, 11), beyaz: R(3, 5) };
      const H = ["K", "L", "M"], sor = sec(["en", "az"]);
      let ic = "";
      R3.forEach((r, i) => { const x = 90 + i * 170; ic += `<rect x="${x - 40}" y="120" width="80" height="110" rx="8" fill="${RENK[r]}" stroke="#555" stroke-width="2"/>` + termometre(x + 60, 40, T0 + artis[r], 0, 50, 160) + Y(x, 260, H[i] + " (" + r + ")", { b: 1 }); });
      ic += `<circle class="g-b" cx="530" cy="20" r="16"/>`;
      const tgt = sor === "en" ? "siyah" : "beyaz", i = R3.indexOf(tgt);
      return S({ kaz: "fsog.sogurma", duzey: "uygulama", zorluk: 2, gorsel: G.svg(580, 275, ic, "güneş altında üç renkli kutu ve termometreler"),
        soru: `İçlerinde eşit miktarda ${T0} °C su bulunan özdeş K, L ve M kutuları farklı renklere boyanıp aynı süre güneş altında bekletilmiştir. Bu sürenin sonunda kutulardaki termometreler şekildeki değerleri göstermiştir.<br>Bu deneye göre ışığı <b>en ${sor === "en" ? "çok" : "az"}</b> soğuran kutu hangisidir?`,
        dogru: `${H[i]} kutusu`, dogruNeden: `${H[i]} kutusundaki suyun sıcaklığı ${T0 + artis[tgt]} °C oldu; en ${sor === "en" ? "çok" : "az"} bu kutu ısındı; ${tgt} yüzey ışığı en ${sor === "en" ? "çok" : "az"} soğurur.`,
        yanlis: H.filter((_, k) => k !== i).map(h => [h + " kutusu", "dikkat", `${h} kutusundaki termometre ${T0 + artis[R3[H.indexOf(h)]]} °C gösteriyor; sıcaklık artışını diğerleriyle karşılaştır.`]).concat([["Üçü de eşit soğurmuştur.", "kavrama", "Termometrelerin gösterdiği sıcaklıklar farklı; soğurulan ışık miktarı da farklıdır."]]),
        ipucu: "Işığı daha çok soğuran yüzey daha çok ısınır. Termometreleri karşılaştır.",
        cozum: ["🔎 Soruyu anlayalım: Üç kutu aynı koşulda güneşte bekletilmiş. Termometrelere bakarak ışığı en " + (sor === "en" ? "çok" : "az") + " soğuranı bulacağız.",
          "💡 Hatırlayalım: Bir cisme çarpan ışığın bir kısmı soğurulur ve ısıya dönüşür. Koyu renkli yüzeyler ışığı daha çok, açık renkli yüzeyler daha az soğurur.",
          "✏️ Termometreleri okuyalım: " + R3.map((r, k) => `${H[k]} (${r}) ${T0 + artis[r]} °C`).join(", ") + ".",
          `✏️ Sıcaklık artışları: ` + R3.map((r, k) => `${H[k]} ${artis[r]} °C`).join(", ") + `. En ${sor === "en" ? "büyük" : "küçük"} artış ${H[i]} kutusunda.`,
          `✅ Sonuç: Işığı en ${sor === "en" ? "çok" : "az"} soğuran ${H[i]} kutusudur (${tgt}).`,
          "🔁 Kontrol edelim: Yazın açık renkli giysiler giymemizin nedeni, açık renklerin ışığı daha az soğurup daha az ısınmasıdır ✓"],
        kural: "Koyu renk ışığı çok soğurur (çok ısınır); açık renk az soğurur (az ısınır)." });
    },
  );

  SORU_EKLE("fsog.ayrisma",
    z => {
      const ISIK = ["kırmızı", "turuncu", "sarı", "yeşil", "mavi", "lacivert", "mor"];
      const k = R(0, 6);
      let ic = `<path class="g-yumusak g-cizgi" stroke-width="2" d="M220 30 L120 210 L320 210 Z" fill-opacity="0.6"/>` + G.ok(20, 150, 170, 120, "g-cizgi") + Y(30, 140, "beyaz ışık", { a: "start", k: 1 });
      ISIK.forEach((r, i) => { const y2 = 120 + i * 22; ic += cizgi(170, 120, 268, 140 + i * 6) + `<line class="g-cizgi" x1="268" y1="${140 + i * 6}" x2="470" y2="${y2}" stroke-width="2"/>` + Y(490, y2 + 5, i + 1, { b: 1 }); });
      ic += `<rect class="g-bos g-cizgi" x="478" y="100" width="40" height="170" stroke-width="1.5" fill-opacity="0"/>`;
      return S({ kaz: "fsog.ayrisma", duzey: "uygulama", zorluk: 2, gorsel: G.svg(560, 280, ic, "prizmada beyaz ışığın renklere ayrılması"),
        soru: "Beyaz ışık bir cam prizmadan geçirildiğinde renklere ayrılmış ve perdede şekildeki gibi 7 renk oluşmuştur (renkler numaralarla gösterilmiştir). Prizmada en az kırılan renk en üste düşmektedir.<br><b>" + (k + 1) + " numaralı</b> ışın hangi renktir?",
        dogru: buyuk(ISIK[k]), dogruNeden: `Perdede yukarıdan aşağıya renk sırası: ${ISIK.join(", ")}; ${k + 1}. sırada ${ISIK[k]} vardır.`,
        yanlis: [k - 1, k + 1, 6 - k, k + 2, k - 2].filter(j => j >= 0 && j < 7 && j !== k).slice(0, 3).map(j => [buyuk(ISIK[j]), Math.abs(j - k) === 1 ? "dikkat" : "bilgi", `${buyuk(ISIK[j])} ${j + 1}. sırada yer alır; renk sırası kırmızıdan mora doğrudur.`]),
        ipucu: "Gökkuşağının renk sırasını hatırla: kırmızı, turuncu, sarı, yeşil, mavi, lacivert, mor.",
        cozum: ["🔎 Soruyu anlayalım: Prizmada ayrılan beyaz ışığın perdede oluşturduğu renklerden " + (k + 1) + ". sıradakini bulacağız.",
          "💡 Hatırlayalım: Beyaz ışık, birçok rengin karışımıdır. Prizmadan geçerken her renk farklı miktarda kırılır: kırmızı en az, mor en çok kırılır. Bu yüzden renkler kırmızıdan mora sıralanır.",
          "✏️ En az kırılan kırmızı en üstte (1), en çok kırılan mor en altta (7) olur.",
          "✏️ Sıralayalım: " + ISIK.map((r, i) => `${i + 1}-${r}`).join(", ") + ".",
          `✅ Sonuç: ${k + 1} numaralı ışın ${ISIK[k]} renktedir.`,
          "🔁 Kontrol edelim: Gökkuşağı da güneş ışığının yağmur damlalarında renklerine ayrılmasıyla oluşur ve aynı renk sırasını gösterir ✓"],
        kural: "Beyaz ışık → kırmızı, turuncu, sarı, yeşil, mavi, lacivert, mor (kırmızı en az, mor en çok kırılır)." });
    },
  );

  SORU_EKLE("fsog.renk",
    z => {
      const isik = sec(["kırmızı", "yeşil", "mavi"]);
      const cisim = karistir(["beyaz", "kırmızı", "yeşil", "mavi", "siyah"]).slice(0, 3);
      if (!cisim.includes(isik) && !cisim.includes("beyaz")) cisim[0] = sec([isik, "beyaz"]);
      const gor = c => c === "beyaz" ? isik : c === isik ? isik : "siyah";
      const H = ["K", "L", "M"];
      let ic = `<rect class="g-cizgi" x="250" y="8" width="60" height="30" rx="6" fill="#555"/><path d="M250 38 L80 210 L480 210 L310 38 Z" fill="${RENK[isik]}" fill-opacity="0.25"/>` + Y(330, 28, isik + " ışık veren lamba", { a: "start", k: 1 });
      cisim.forEach((c, i) => { const x = 150 + i * 130; ic += `<circle cx="${x}" cy="190" r="30" fill="${RENK[c]}" stroke="#555" stroke-width="2"/>` + Y(x, 245, `${H[i]}: ${c}`, { b: 1 }); });
      ic += cizgi(40, 220, 520, 220, "g-cizgi", 2) + Y(280, 270, "(Topların altında beyaz ışıktaki renkleri yazılıdır.)", { k: 1 });
      const dogru = cisim.map((c, i) => `${H[i]} ${gor(c)}`).join(", ");
      const yan1 = cisim.map((c, i) => `${H[i]} ${c}`).join(", ");
      const yan2 = cisim.map((c, i) => `${H[i]} ${c === "beyaz" ? "beyaz" : gor(c)}`).join(", ");
      const yan3 = cisim.map((c, i) => `${H[i]} ${isik}`).join(", ");
      const yan4 = cisim.map((c, i) => `${H[i]} ${c === isik ? "siyah" : gor(c)}`).join(", ");
      return S({ kaz: "fsog.renk", duzey: "baglanti", zorluk: 3, gorsel: G.svg(560, 280, ic, "renkli ışık altında üç top"),
        soru: `Karanlık bir odada yalnızca <b>${isik}</b> ışık veren bir lamba yakılmıştır. Lambanın altına beyaz ışıktaki renkleri şekilde yazılı olan K, L ve M topları konmuştur.<br>Topların bu odada hangi renkte görüneceği aşağıdakilerden hangisinde doğru verilmiştir?`,
        dogru, dogruNeden: cisim.map((c, i) => `${H[i]} (${c}) → ${gor(c)}`).join("; ") + ".",
        yanlis: [[yan1, "kavrama", "Topların beyaz ışıktaki renklerini yazmışsın; renkli ışık altında cisim yalnızca yansıtabildiği ışığın rengini gösterir."], [yan2, "kavrama", `Beyaz cisim bütün renkleri yansıtır; ${isik} ışık altında ${isik} görünür.`], [yan3, "kavrama", `Her cisim ${isik} ışığı yansıtamaz; ${isik} ışığı soğuran cisim siyah görünür.`], [yan4, "kavrama", `${buyuk(isik)} cisim ${isik} ışığı yansıtır; siyah değil ${isik} görünür.`]],
        ipucu: "Beyaz cisim gelen ışığın rengini alır. Cisim kendi rengindeki ışığı yansıtır, diğerlerini soğurur. Hiç ışık yansıtmayan cisim siyah görünür.",
        cozum: [`🔎 Soruyu anlayalım: Odada yalnızca ${isik} ışık var. Üç topun nasıl görüneceğini bulacağız.`,
          "💡 Hatırlayalım: Bir cisim, rengindeki ışığı yansıtır, diğer renkleri soğurur. Beyaz cisim bütün renkleri yansıtır; siyah cisim bütün renkleri soğurur.",
          ...cisim.map((c, i) => `✏️ ${H[i]} (${c}): ${c === "beyaz" ? `bütün renkleri yansıtır; yalnızca ${isik} ışık geldiği için ${isik} görünür.` : c === isik ? `${isik} ışığı yansıtır → ${isik} görünür.` : c === "siyah" ? "bütün ışıkları soğurur → siyah görünür." : `yalnızca ${c} ışığı yansıtabilir; ${isik} ışığı soğurur, yansıyan ışık olmadığı için siyah görünür.`}`),
          `✅ Sonuç: ${dogru}.`,
          "🔁 Kontrol edelim: Mağazalarda kıyafetin rengini gün ışığında kontrol etmemiz bu yüzdendir; renkli ışık altında renkler farklı görünebilir ✓"],
        kural: "Cisim rengindeki ışığı yansıtır; beyaz → gelen ışığın rengi, yansıtacak ışık yoksa → siyah." });
    },
  );
})();
