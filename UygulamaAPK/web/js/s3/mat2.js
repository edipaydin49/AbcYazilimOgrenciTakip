/* İlkokul 3. sınıf Matematik — Tema 3–6 konuları:
 * Kesirler, geometrik şekiller ve cisimler, simetri, şekil örüntüleri, ölçme (uzunluk, çevre-alan,
 * zaman, para, tartma, sıvı ölçme), veri toplama ve grafikler.
 * İskelet: web/js/s3/mat.js (ders id "mat"). Tema 1–2 konuları mat1.js dosyasındadır.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, Q, G } = OGR;
  const Y = G.yazi;

  /* ======================= ORTAK YARDIMCILAR ======================= */
  /* Çözüm adımları: 🔎 → 💡 → ✏️ (1–3 adım) → ✅ → 🔁 */
  const coz = (anla, hatir, adimlar, sonuc, kontrol) => ["🔎 Soruyu anlayalım: " + anla, "💡 Hatırlayalım: " + hatir]
    .concat(adimlar.map(a => "✏️ " + a), ["✅ Sonuç: " + sonuc, "🔁 Kontrol edelim: " + kontrol]);
  /* Konu durağı: doğru seçenek + 3 yanlış [metin, neden] */
  const dur = (soru, dogru, neden, ...yan) => ({ soru, secenekler: karistir([[dogru, true, neden]].concat(yan.map(([m, n]) => [m, false, n]))) });
  /* Kısa havuz sorusu: P(kaz, düzey, zorluk, soru, doğru, doğruNeden, yanlışlar, ipucu, çözüm, kural, görsel) */
  const P = (kaz, duzey, zorluk, soru, dogru, dogruNeden, yanlis, ipucu, cozum, kural, gorsel) =>
    Q(kaz, duzey, zorluk, soru, dogru, yanlis, ipucu, cozum, { kural, dogruNeden, gorsel: gorsel || null });
  /* Tekrarsız rastgele seçim */
  const secN = (a, n) => karistir(a).slice(0, n);

  const SAYI = ["sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on"];
  const KO = { 2: "ikide", 3: "üçte", 4: "dörtte", 5: "beşte", 6: "altıda", 7: "yedide", 8: "sekizde", 9: "dokuzda", 10: "onda" };
  const kesirOku = (p, q) => KO[q] + " " + SAYI[p];

  /* ---------- SVG parçaları ---------- */
  const f1 = x => Number(x.toFixed(1));
  const kutu = (x, y, w, h, s = "g-bos", rx = 6) => `<rect class="${s} g-cizgi" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" stroke-width="2"/>`;
  const cizgi = (x1, y1, x2, y2, s = "g-cizgi", k = 2) => `<line class="${s}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke-width="${k}"/>`;
  const kesik = (x1, y1, x2, y2, s = "g-ok-d", k = 3) => `<line class="${s}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${k}" stroke-dasharray="8 6"/>`;
  const E = (x, y, t, b = 30) => `<text x="${f1(x)}" y="${f1(y)}" font-size="${b}" text-anchor="middle">${t}</text>`;
  const B = (x, y, t, b = 20, kalin = true) => `<text class="g-yazi" x="${f1(x)}" y="${f1(y)}" text-anchor="middle" style="font-size:${b}px"${kalin ? ' font-weight="700"' : ""}>${t}</text>`;
  const GS = (w, h, ic, et, min = 420) => w >= min ? G.svg(w, h, ic, et) : G.svg(min, h, `<g transform="translate(${(min - w) / 2} 0)">${ic}</g>`, et);
  const HARF = ["A", "B", "C", "D"];
  /* Dört küçük çizimi A–D etiketleriyle yan yana koyar */
  function dortlu(icler, w = 150, h = 150, et = "A, B, C, D seçenekleri") {
    let ic = "";
    icler.forEach((s, i) => { ic += `<g transform="translate(${i * w} 0)">${s}</g>` + B(i * w + w / 2, h + 26, HARF[i], 22); });
    return G.svg(w * icler.length, h + 36, ic, et);
  }
  /* Harfli seçenek sorusu: adaylar [{ic, dogru:true}|{ic, hata, neden}] → {gorsel, dogru, yanlis} */
  function harfli(adaylar, w, h, et) {
    const a = karistir(adaylar);
    const d = a.findIndex(x => x.dogru);
    return { gorsel: dortlu(a.map(x => x.ic), w, h, et), dogru: HARF[d], yanlis: a.map((x, i) => [HARF[i], x.hata, x.neden]).filter((x, i) => i !== d) };
  }

  /* Kesir modelleri */
  function pasta(p, q, cx = 75, cy = 75, r = 62) {
    if (q === 1) return `<circle class="${p ? "g-b" : "g-bos"} g-cizgi" cx="${cx}" cy="${cy}" r="${r}" stroke-width="2"/>`;
    let ic = "";
    for (let i = 0; i < q; i++) {
      const a0 = i / q * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / q * 2 * Math.PI - Math.PI / 2;
      ic += `<path class="${i < p ? "g-b" : "g-bos"} g-cizgi" stroke-width="2" d="M${cx} ${cy} L${f1(cx + r * Math.cos(a0))} ${f1(cy + r * Math.sin(a0))} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${f1(cx + r * Math.cos(a1))} ${f1(cy + r * Math.sin(a1))} Z"/>`;
    }
    return ic;
  }
  function dikModel(p, q, x = 15, y = 15, w = 120, h = 120) {
    let ic = "";
    if (q === 4 && w === h) { for (let i = 0; i < 4; i++) ic += `<rect class="${i < p ? "g-b" : "g-bos"} g-cizgi" stroke-width="2" x="${x + (i % 2) * w / 2}" y="${y + Math.floor(i / 2) * h / 2}" width="${w / 2}" height="${h / 2}"/>`; return ic; }
    for (let i = 0; i < q; i++) ic += `<rect class="${i < p ? "g-b" : "g-bos"} g-cizgi" stroke-width="2" x="${f1(x + i * w / q)}" y="${y}" width="${f1(w / q)}" height="${h}"/>`;
    return ic;
  }
  /* Tek kesir modeli (tam SVG): tur = daire | kare | serit */
  function model(p, q, tur) {
    if (tur === "daire") return GS(150, 150, pasta(p, q), `${q} eş parçadan ${p} tanesi boyalı daire`);
    if (tur === "kare") return GS(150, 150, dikModel(p, q), `${q} eş parçadan ${p} tanesi boyalı kare`);
    return GS(440, 80, dikModel(p, q, 10, 10, 420, 60), `${q} eş parçadan ${p} tanesi boyalı şerit`);
  }
  /* Kesir yazısı (pay / çizgi / payda) */
  const kesirYaz = (x, y, p, q, b = 30) => B(x, y, p, b) + cizgi(x - b * 0.6, y + b * 0.3, x + b * 0.6, y + b * 0.3, "g-cizgi", 3) + B(x, y + b * 1.25, q, b);

  /* Nesne grubu: emoji ızgarası; grup verilirse kutularla gruplanır, ilk 'boya' grup boyanır */
  function nesneler(emoji, n, { sut = 6, grup = 0, boya = 0, b = 44 } = {}) {
    if (!grup) {
      const s = Math.min(sut, n), sat = Math.ceil(n / s); let ic = "";
      for (let i = 0; i < n; i++) ic += E(30 + (i % s) * b, 38 + Math.floor(i / s) * b, emoji, 30);
      return GS(s * b + 16, sat * b + 14, ic, n + " nesne");
    }
    const k = n / grup, ks = Math.min(k, 3), ksat = Math.ceil(k / ks), gw = ks * 40 + 16, gh = ksat * 40 + 14;
    const gs = Math.min(grup, 5), W = gs * (gw + 12) + 12; let ic = "";
    for (let g = 0; g < grup; g++) {
      const gx = 12 + (g % gs) * (gw + 12), gy = 10 + Math.floor(g / gs) * (gh + 12);
      ic += kutu(gx, gy, gw, gh, g < boya ? "g-b" : "g-bos", 10);
      for (let i = 0; i < k; i++) ic += E(gx + 28 + (i % ks) * 40, gy + 37 + Math.floor(i / ks) * 40, emoji, 28);
    }
    return GS(W, Math.ceil(grup / gs) * (gh + 12) + 10, ic, `${n} nesne, ${grup} eş grup`);
  }

  /* Analog saat (h: 1–12, m: 0–59) */
  function saatIc(h, m, cx = 110, cy = 110, r = 92) {
    let ic = `<circle class="g-bos g-cizgi" cx="${cx}" cy="${cy}" r="${r + 8}" stroke-width="5"/>`;
    for (let i = 0; i < 60; i++) {
      const a = i * Math.PI / 30, u = i % 5 === 0 ? 11 : 5;
      ic += cizgi(cx + r * Math.sin(a), cy - r * Math.cos(a), cx + (r - u) * Math.sin(a), cy - (r - u) * Math.cos(a), "g-cizgi", i % 5 ? 1.2 : 3);
    }
    for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6; ic += B(cx + (r - 27) * Math.sin(a), cy - (r - 27) * Math.cos(a) + 8, i, 22); }
    const ah = ((h % 12) + m / 60) * Math.PI / 6, am = m * Math.PI / 30;
    ic += `<line class="g-cizgi" x1="${cx}" y1="${cy}" x2="${f1(cx + r * 0.5 * Math.sin(ah))}" y2="${f1(cy - r * 0.5 * Math.cos(ah))}" stroke-width="9" stroke-linecap="round"/>`;
    ic += `<line class="g-ok-a" x1="${cx}" y1="${cy}" x2="${f1(cx + r * 0.82 * Math.sin(am))}" y2="${f1(cy - r * 0.82 * Math.cos(am))}" stroke-width="5" stroke-linecap="round"/>`;
    return ic + `<circle class="g-d" cx="${cx}" cy="${cy}" r="7"/>`;
  }
  const saat = (h, m) => GS(220, 220, saatIc(h, m), "saat kadranı");
  const saatYaz = (h, m) => `${h}.${String(m).padStart(2, "0")}`;
  const BELIRTME = { 1: "biri", 2: "ikiyi", 3: "üçü", 4: "dördü", 5: "beşi", 6: "altıyı", 7: "yediyi", 8: "sekizi", 9: "dokuzu", 10: "onu", 11: "on biri", 12: "on ikiyi" };
  const YONELME = { 1: "bire", 2: "ikiye", 3: "üçe", 4: "dörde", 5: "beşe", 6: "altıya", 7: "yediye", 8: "sekize", 9: "dokuza", 10: "ona", 11: "on bire", 12: "on ikiye" };
  const SAATAD = { 1: "bir", 2: "iki", 3: "üç", 4: "dört", 5: "beş", 6: "altı", 7: "yedi", 8: "sekiz", 9: "dokuz", 10: "on", 11: "on bir", 12: "on iki" };
  const sonraki = h => h % 12 + 1, onceki = h => (h + 10) % 12 + 1;

  /* Paralar: kâğıt paralar (TL) ve madeni paralar (kuruş; 100 = 1 TL) */
  function paralar(kagit, madeni) {
    let ic = "", x = 12;
    kagit.forEach((v, i) => { const y = 12 + (i % 2) * 8; ic += `<rect class="g-c g-cizgi" x="${x}" y="${y}" width="104" height="54" rx="5" stroke-width="1.5" fill-opacity="0.45"/><circle class="g-bos g-cizgi" cx="${x + 24}" cy="${y + 27}" r="13" stroke-width="1"/>` + B(x + 68, y + 34, v + " TL", 18); x += 112; });
    const my = kagit.length ? 112 : 40;
    madeni.forEach((v, i) => { const cx = 38 + i * 56; ic += `<circle class="g-b g-cizgi" cx="${cx}" cy="${my}" r="25" stroke-width="2"/>` + B(cx, my + 6, v >= 100 ? v / 100 + " TL" : v + " kr", 14); });
    return GS(Math.max(x + 6, madeni.length * 56 + 20), madeni.length ? my + 34 : 84, ic, "paralar");
  }
  const tlYaz = k => k % 100 === 0 ? `${k / 100} TL` : k < 100 ? `${k} kuruş` : `${Math.floor(k / 100)} TL ${k % 100} kuruş`;

  /* Geometrik şekiller (yerel koordinat, merkez cx, cy; boy s) */
  function sekil(tur, cx = 75, cy = 75, s = 100, sinif = "g-yumusak", kose = false) {
    let ic = "", P = [];
    if (tur === "ucgen") P = [[cx, cy - s * 0.5], [cx - s * 0.55, cy + s * 0.42], [cx + s * 0.55, cy + s * 0.42]];
    else if (tur === "kare") P = [[cx - s * 0.45, cy - s * 0.45], [cx + s * 0.45, cy - s * 0.45], [cx + s * 0.45, cy + s * 0.45], [cx - s * 0.45, cy + s * 0.45]];
    else if (tur === "dikdortgen") P = [[cx - s * 0.65, cy - s * 0.33], [cx + s * 0.65, cy - s * 0.33], [cx + s * 0.65, cy + s * 0.33], [cx - s * 0.65, cy + s * 0.33]];
    if (P.length) { ic = `<polygon class="${sinif} g-cizgi" stroke-width="3" stroke-linejoin="round" points="${P.map(p => p.map(f1).join(",")).join(" ")}"/>`; if (kose) P.forEach(p => { ic += `<circle class="g-d" cx="${f1(p[0])}" cy="${f1(p[1])}" r="6"/>`; }); }
    else if (tur === "cember") ic = `<circle class="g-bos g-cizgi" cx="${cx}" cy="${cy}" r="${s * 0.48}" stroke-width="4"/>`;
    else if (tur === "daire") ic = `<circle class="${sinif === "g-yumusak" ? "g-a" : sinif} g-cizgi" cx="${cx}" cy="${cy}" r="${s * 0.48}" stroke-width="3"/>`;
    return ic;
  }
  const SEKIL_AD = { ucgen: "Üçgen", kare: "Kare", dikdortgen: "Dikdörtgen", cember: "Çember", daire: "Daire" };
  const KOSE = { ucgen: 3, kare: 4, dikdortgen: 4, cember: 0, daire: 0 };

  /* Geometrik cisimler (yerel koordinat; 150×150 kutuya sığar) */
  function cisim(tur, cx = 75, cy = 80) {
    const yuz = (pts, s) => `<polygon class="${s} g-cizgi" stroke-width="2.5" stroke-linejoin="round" points="${pts.map(p => p.map(f1).join(",")).join(" ")}"/>`;
    const kutuC = (w, h, d) => {
      const x = cx - (w + d) / 2, y = cy - (h - d) / 2;
      return yuz([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], "g-yumusak") + yuz([[x, y], [x + d, y - d], [x + w + d, y - d], [x + w, y]], "g-a") + yuz([[x + w, y], [x + w + d, y - d], [x + w + d, y + h - d], [x + w, y + h]], "g-b");
    };
    if (tur === "kup") return kutuC(74, 74, 30);
    if (tur === "dprizma") return kutuC(104, 58, 28);
    if (tur === "kprizma") return kutuC(56, 100, 26);
    if (tur === "silindir") { const rx = 42, ry = 13, t = cy - 45, a = cy + 45; return `<path class="g-yumusak g-cizgi" stroke-width="2.5" d="M${cx - rx} ${t} L${cx - rx} ${a} A${rx} ${ry} 0 0 0 ${cx + rx} ${a} L${cx + rx} ${t} Z"/><ellipse class="g-a g-cizgi" stroke-width="2.5" cx="${cx}" cy="${t}" rx="${rx}" ry="${ry}"/>`; }
    if (tur === "koni") { const rx = 46, ry = 14, a = cy + 45, t = cy - 55; return `<path class="g-yumusak g-cizgi" stroke-width="2.5" stroke-linejoin="round" d="M${cx} ${t} L${cx - rx} ${a} A${rx} ${ry} 0 0 0 ${cx + rx} ${a} Z"/><path class="g-cizgi" fill="none" stroke-width="1.5" stroke-dasharray="5 4" d="M${cx - rx} ${a} A${rx} ${ry} 0 0 1 ${cx + rx} ${a}"/>`; }
    if (tur === "kure") return `<circle class="g-yumusak g-cizgi" cx="${cx}" cy="${cy}" r="52" stroke-width="2.5"/><path class="g-cizgi" fill="none" stroke-width="1.5" stroke-dasharray="5 4" d="M${cx - 52} ${cy} A52 15 0 0 0 ${cx + 52} ${cy}"/><circle class="g-bos" cx="${cx - 18}" cy="${cy - 22}" r="8" opacity="0.8"/>`;
    return "";
  }
  const CISIM_AD = { kup: "Küp", kprizma: "Kare prizma", dprizma: "Dikdörtgen prizma", silindir: "Silindir", koni: "Koni", kure: "Küre" };

  /* Kareli kâğıt: boyalı hücreler [[satır, sütun]], eksen: {tur:"dikey"|"yatay", k: çizgi konumu (hücre sınırı)} */
  function kareli(sat, sut, boyali, { eksen = null, b = 26, x0 = 10, y0 = 10, sinif = "g-a" } = {}) {
    let ic = "";
    for (let i = 0; i < sat; i++) for (let j = 0; j < sut; j++) {
      const dolu = boyali.some(([r, c]) => r === i && c === j);
      ic += `<rect class="${dolu ? sinif : "g-bos"} g-ince" x="${x0 + j * b}" y="${y0 + i * b}" width="${b}" height="${b}"/>`;
    }
    if (eksen) ic += eksen.tur === "dikey" ? kesik(x0 + eksen.k * b, y0 - 6, x0 + eksen.k * b, y0 + sat * b + 6) : kesik(x0 - 6, y0 + eksen.k * b, x0 + sut * b + 6, y0 + eksen.k * b);
    return ic;
  }

  /* Cetvel (cm): 0–uz cm, sarı çubuk bas–son arası */
  function cetvel(bas, son, uz = 12) {
    const b = 40, x0 = 20; let ic = `<rect class="g-b g-cizgi" x="${x0 + bas * b}" y="14" width="${(son - bas) * b}" height="24" rx="4" stroke-width="1.5"/>` + `<rect class="g-yumusak g-cizgi" x="${x0 - 10}" y="48" width="${uz * b + 20}" height="52" rx="4" stroke-width="1.5"/>`;
    for (let m = 0; m <= uz * 2; m++) { const x = x0 + m * b / 2; ic += cizgi(x, 48, x, 48 + (m % 2 ? 10 : 20), "g-cizgi", m % 2 ? 1.2 : 2); if (m % 2 === 0) ic += B(x, 92, m / 2, 15, false); }
    return G.svg(uz * b + 40, 108, ic + kesik(x0 + bas * b, 10, x0 + bas * b, 52, "g-ince", 1.5) + kesik(x0 + son * b, 10, x0 + son * b, 52, "g-ince", 1.5), "cetvel ile ölçülen çubuk");
  }

  /* Eşit kollu terazi: sol/sağ kefedeki yazılar (dizi), egim: -1 sol aşağı, 0 denge, 1 sağ aşağı */
  function terazi(sol, sag, egim = 0) {
    const W = 460, cx = 230, ty = 70, d = egim * 22;
    const kefe = (x, y, ogeler) => cizgi(x - 50, y + 8, x, y - 40) + cizgi(x + 50, y + 8, x, y - 40) + `<path class="g-yumusak g-cizgi" stroke-width="2" d="M${x - 62} ${y + 8} Q${x} ${y + 34} ${x + 62} ${y + 8} Z"/>` + ogeler.map((o, i) => o.length <= 2 ? E(x - (ogeler.length - 1) * 22 + i * 44, y + 2, o, 34) : kutu(x - (ogeler.length - 1) * 30 + i * 60 - 28, y - 22, 56, 26, "g-b", 5) + B(x - (ogeler.length - 1) * 30 + i * 60, y - 3, o, 14)).join("");
    const sy = ty + 40 + d, gy = ty + 40 - d;
    return G.svg(W, 230, `<polygon class="g-a g-cizgi" stroke-width="2" points="${cx - 40},215 ${cx + 40},215 ${cx},${ty}"/>` + cizgi(cx - 140, ty - d, cx + 140, ty + d, "g-cizgi", 6) + `<circle class="g-d" cx="${cx}" cy="${ty}" r="7"/>` + kefe(cx - 140, sy, sol) + kefe(cx + 140, gy, sag), "eşit kollu terazi");
  }

  /* Ölçü kabı: miktar (mL), en çok (mL), adım, etiket adımı */
  function olcuKabi(ml, { max = 1000, adim = 100, etk = 200, x = 60, ad = "" } = {}) {
    const H = 240, y0 = 20, w = 110, yk = v => y0 + H * (1 - v / max);
    let ic = `<rect class="g-a" x="${x}" y="${f1(yk(ml))}" width="${w}" height="${f1(H * ml / max)}" opacity="0.55"/>` + `<path class="g-cizgi" fill="none" stroke-width="3" d="M${x} ${y0 - 10} L${x} ${y0 + H} L${x + w} ${y0 + H} L${x + w} ${y0 - 10}"/>`;
    for (let v = adim; v <= max; v += adim) { ic += cizgi(x, yk(v), x + (v % etk ? 16 : 30), yk(v), "g-cizgi", 2); if (v % etk === 0) ic += Y(x + w + 8, yk(v) + 5, v === 1000 ? "1 L" : v + " mL", { a: "start", k: 1 }); }
    if (ad) ic += B(x + w / 2, y0 + H + 28, ad, 16);
    return ic;
  }

  /* Çetele: n çizgi, 5'li gruplar */
  function cetele(n, x, y, h = 30) {
    let ic = "";
    for (let i = 0; i < n; i++) {
      const g = Math.floor(i / 5), j = i % 5, gx = x + g * 50;
      ic += j < 4 ? cizgi(gx + j * 9, y, gx + j * 9, y + h, "g-cizgi", 2.5) : cizgi(gx - 5, y + h - 4, gx + 32, y + 4, "g-ok-d", 2.5);
    }
    return ic;
  }
  /* Nesne/şekil grafiği satırları: [[ad, adet]], simge emoji ya da "kare" */
  function simgeGrafik(veri, simge, { baslik = "", anahtar = "" } = {}) {
    const b = 40, sol = 120, ust = baslik ? 40 : 12, mx = Math.max(...veri.map(v => v[1]));
    let ic = baslik ? B((sol + mx * b + 20) / 2 + 20, 26, baslik, 17) : "";
    veri.forEach(([ad, n], i) => {
      const y = ust + i * (b + 6);
      ic += Y(sol - 10, y + 27, ad, { a: "end" }) + cizgi(sol, y - 2, sol, y + b + 4, "g-ince", 1);
      for (let k = 0; k < n; k++) ic += simge === "kare" ? `<rect class="g-a g-cizgi" x="${sol + 6 + k * b}" y="${y + 4}" width="${b - 8}" height="${b - 8}" rx="3" stroke-width="1.5"/>` : E(sol + 6 + k * b + (b - 8) / 2, y + 31, simge, 30);
    });
    const H = ust + veri.length * (b + 6) + (anahtar ? 30 : 6);
    if (anahtar) ic += Y(sol, H - 8, anahtar, { a: "start", k: 1 });
    return GS(sol + mx * b + 30, H, ic, baslik || "nesne grafiği");
  }

  const GUN = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  /* Takvim yaprağı: ilk gün (0 = Pazartesi), gün sayısı */
  function takvim(ilk, gs, ad) {
    const satir = []; let s = Array(ilk).fill("");
    for (let d = 1; d <= gs; d++) { s.push(String(d)); if (s.length === 7) { satir.push(s); s = []; } }
    if (s.length) satir.push(s.concat(Array(7 - s.length).fill("")));
    return `<div style="text-align:center;font-weight:700;margin:4px 0">📅 ${ad}</div>` + G.tablo(["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], satir);
  }

  /* @@KONULAR@@ */
})();
