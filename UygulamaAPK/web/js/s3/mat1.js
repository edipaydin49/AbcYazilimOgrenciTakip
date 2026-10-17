/* İlkokul 3. sınıf Matematik — 1. Tema (Sayılar ve Nicelikler) ve 2. Tema (İşlemlerden Cebirsel Düşünmeye) konuları.
 * Sayılar 1000'i geçmez; çarpım tablosu 10 × 10'a kadar; bölmede bölen tek basamaklı, bölünen en çok iki basamaklıdır.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, Q, G } = OGR;
  const Y = G.yazi;

  /* ---------- Küçük yardımcılar ---------- */
  const GS = (w, h, ic, et, min = 360) => w >= min ? G.svg(w, h, ic, et) : G.svg(min, h, `<g transform="translate(${((min - w) / 2).toFixed(1)} 0)">${ic}</g>`, et);
  const E = (x, y, t, b = 26) => `<text x="${x}" y="${y}" font-size="${b}" text-anchor="middle">${t}</text>`;
  const BY = (x, y, t, fs = 28, s = "g-yazi") => `<text class="${s}" x="${x}" y="${y}" text-anchor="middle" style="font-size:${fs}px;font-weight:700">${t}</text>`;
  const cizgi = (x1, y1, x2, y2, s = "g-cizgi", k = 2) => `<line class="${s}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${k}"/>`;
  const kutu = (x, y, w, h, s = "g-bos", rx = 8) => `<rect class="${s} g-cizgi" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" stroke-width="2"/>`;
  /* Çözüm adımları: 🔎 → 💡 → ✏️ … → ✅ → 🔁 */
  const C = (anla, hatirla, adimlar, sonuc, kontrol) => ["🔎 Soruyu anlayalım: " + anla, "💡 Hatırlayalım: " + hatirla, ...[].concat(adimlar).map(a => "✏️ " + a), "✅ Sonuç: " + sonuc, "🔁 Kontrol edelim: " + kontrol];
  const AD = [["Elif", "Elif'in", "Elif'e"], ["Ali", "Ali'nin", "Ali'ye"], ["Zeynep", "Zeynep'in", "Zeynep'e"], ["Mert", "Mert'in", "Mert'e"], ["Ayşe", "Ayşe'nin", "Ayşe'ye"],
    ["Can", "Can'ın", "Can'a"], ["Defne", "Defne'nin", "Defne'ye"], ["Emir", "Emir'in", "Emir'e"], ["Ece", "Ece'nin", "Ece'ye"], ["Kerem", "Kerem'in", "Kerem'e"]];
  const iki = () => { const a = karistir(AD); return [a[0], a[1], a[2]]; };

  /* Sayıların okunuşu (0–1000) */
  const BIR = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
  const ON = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
  const oku = n => { if (n === 0) return "sıfır"; if (n === 1000) return "bin"; const y = Math.floor(n / 100), o = Math.floor(n % 100 / 10), b = n % 10; return [y ? (y === 1 ? "yüz" : BIR[y] + " yüz") : "", ON[o], BIR[b]].filter(Boolean).join(" "); };
  const bas = n => [Math.floor(n / 100), Math.floor(n % 100 / 10), n % 10];
  const BAD = ["yüzler", "onlar", "birler"];

  /* Romen rakamları (1–20 ve saat kadranı) */
  const ROM = n => { let s = ""; for (const [v, r] of [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]) while (n >= v) { s += r; n -= v; } return s; };
  const ROMDEG = { I: 1, V: 5, X: 10 };
  const romTopla = r => [...r].reduce((a, c) => a + ROMDEG[c], 0); // çıkarma kuralını unutan çocuğun okuması

  /* ---------- Görseller ---------- */
  /* Onluk taban blokları: y yüzlük, o onluk, b birlik */
  function bloklar(y, o, b, { etiket = false, bozuk = 0 } = {}) {
    const Y0 = 12; let ic = "", x = 14;
    for (let i = 0; i < y; i++) {
      const xx = x + (i % 5) * 80, yy = Y0 + Math.floor(i / 5) * 80;
      ic += `<rect class="g-a g-cizgi" x="${xx}" y="${yy}" width="70" height="70" stroke-width="1.5"/>`;
      for (let k = 1; k < 10; k++) ic += `<line class="g-ince" x1="${xx + k * 7}" y1="${yy}" x2="${xx + k * 7}" y2="${yy + 70}"/><line class="g-ince" x1="${xx}" y1="${yy + k * 7}" x2="${xx + 70}" y2="${yy + k * 7}"/>`;
    }
    const ys = Math.ceil(y / 5);
    if (etiket && y) ic += Y(x + Math.min(y, 5) * 40 - 5, Y0 + ys * 80 + 12, y + " yüzlük", { k: 1 });
    if (y) x += Math.min(y, 5) * 80 + 6;
    const ox = x;
    for (let i = 0; i < o; i++) {
      const xx = x + i * 15;
      ic += `<rect class="g-c g-cizgi" x="${xx}" y="${Y0}" width="9" height="70" stroke-width="1.5"/>`;
      for (let k = 1; k < 10; k++) ic += `<line class="g-ince" x1="${xx}" y1="${Y0 + k * 7}" x2="${xx + 9}" y2="${Y0 + k * 7}"/>`;
    }
    if (etiket && o) ic += Y(ox + o * 7.5, Y0 + 92, o + " onluk", { k: 1 });
    if (o) x += o * 15 + 10;
    const bx = x;
    for (let i = 0; i < b + bozuk; i++) ic += `<rect class="${i < b ? "g-b" : "g-d"} g-cizgi" x="${x + Math.floor(i / 5) * 14}" y="${Y0 + (i % 5) * 14}" width="10" height="10" stroke-width="1.2"/>`;
    if (etiket && b) ic += Y(bx + 12, Y0 + 92, b + " birlik", { k: 1 });
    if (b + bozuk) x += Math.ceil((b + bozuk) / 5) * 14 + 6;
    const H = Y0 + Math.max(ys, 1) * 80 + (etiket ? 24 : 6);
    return GS(x + 10, H, ic, "onluk taban blokları");
  }
  /* Abaküs: yüzler, onlar, birler çubukları */
  function abakus(y, o, b) {
    let ic = `<rect class="g-yumusak g-cizgi" x="20" y="185" width="290" height="18" rx="4" stroke-width="2"/>`;
    [["Y", y, "g-a"], ["O", o, "g-c"], ["B", b, "g-b"]].forEach(([ad, n, s], i) => {
      const x = 75 + i * 90; ic += cizgi(x, 28, x, 185, "g-cizgi", 3) + BY(x, 226, ad, 18);
      for (let k = 0; k < n; k++) ic += `<ellipse class="${s} g-cizgi" cx="${x}" cy="${176 - k * 15}" rx="24" ry="7" stroke-width="1.5"/>`;
    });
    return GS(330, 236, ic, "abaküs");
  }
  /* Emojiden nesne ızgarası */
  function nesneler(e, n, sut = 10) {
    const s = Math.min(sut, n), sat = Math.ceil(n / s); let ic = "";
    for (let i = 0; i < n; i++) ic += E(26 + (i % s) * 36, 34 + Math.floor(i / s) * 38, e, 26);
    return GS(20 + s * 36, 18 + sat * 38, ic, "nesneler");
  }
  /* Kutulara konmuş eşit gruplar (+ isteğe bağlı artan nesneler) */
  function gruplar(e, g, k, art = 0) {
    const ks = Math.min(k, 5), kr = Math.ceil(k / 5), bw = ks * 30 + 16, bh = kr * 32 + 14, sira = Math.min(g, 4) || 1;
    let ic = "";
    for (let i = 0; i < g; i++) {
      const gx = 12 + (i % sira) * (bw + 14), gy = 10 + Math.floor(i / sira) * (bh + 14);
      ic += `<rect class="g-yumusak g-cizgi" x="${gx}" y="${gy}" width="${bw}" height="${bh}" rx="12" stroke-width="2"/>`;
      for (let j = 0; j < k; j++) ic += E(gx + 23 + (j % 5) * 30, gy + 31 + Math.floor(j / 5) * 32, e, 22);
    }
    let W = 12 + sira * (bw + 14), H = 10 + Math.max(1, Math.ceil(g / sira)) * (bh + 14);
    if (art) { for (let j = 0; j < art; j++) ic += E(W + 15 + (j % 3) * 30, 34 + Math.floor(j / 3) * 32, e, 22); W += 20 + Math.min(art, 3) * 30; H = Math.max(H, 20 + Math.ceil(art / 3) * 32); }
    return GS(W, H, ic, "eşit gruplar");
  }
  /* Alt alta işlem (üst, alt, işaret, sonuç); "?" ya da "□" içerebilir */
  function dikey(ust, alt, op, son = "?") {
    const sat = [String(ust), String(alt), String(son)], n = Math.max(...sat.map(s => s.length)), cw = 36, W = 70 + n * cw, xr = W - 16;
    let ic = "";
    sat.forEach((s, r) => { const yy = 42 + r * 46 + (r === 2 ? 12 : 0); [...s].reverse().forEach((c, i) => { ic += BY(xr - cw / 2 - i * cw, yy, c, 30, c === "?" || c === "□" ? "g-yazi" : "g-yazi"); }); });
    ic += BY(28, 88, op, 30) + cizgi(16, 104, W - 6, 104, "g-cizgi", 3);
    return GS(W, 166, ic, "alt alta işlem", 260);
  }
  /* Kutularda sayı dizisi (örüntü) */
  function kutular(a) {
    let ic = "";
    a.forEach((v, i) => { const x = 10 + i * 78; ic += `<rect class="${v === "?" ? "g-b" : "g-yumusak"} g-cizgi" x="${x}" y="10" width="68" height="54" rx="10" stroke-width="2"/>` + BY(x + 34, 47, v, String(v).length > 3 ? 20 : 24); });
    return GS(20 + a.length * 78, 74, ic, "kutulardaki sayılar");
  }
  /* İki sayı kartı arasında boş karşılaştırma dairesi */
  function karsi(a, b) {
    const w = Math.max(String(a).length, String(b).length) * 16 + 50;
    const ic = kutu(10, 10, w, 60, "g-yumusak", 12) + BY(10 + w / 2, 50, a, 26) + `<circle class="g-b g-cizgi" cx="${10 + w + 40}" cy="40" r="22" stroke-width="2"/>` + BY(10 + w + 40, 49, "?", 24)
      + kutu(10 + w + 80, 10, w, 60, "g-yumusak", 12) + BY(10 + w * 1.5 + 80, 50, b, 26);
    return GS(20 + w * 2 + 80, 80, ic, "iki sayının karşılaştırılması");
  }
  /* Sayı kartı */
  const kart = (t, ust = "") => { const w = Math.max(160, String(t).length * 22 + 40); return GS(w + 20, ust ? 104 : 84, (ust ? Y(10 + w / 2, 22, ust, { k: 1 }) : "") + kutu(10, ust ? 32 : 10, w, 62, "g-yumusak", 12) + BY(10 + w / 2, ust ? 74 : 52, t, 30), "sayı kartı"); };
  /* Zıplamalı sayı doğrusu */
  function zipla({ min, max, cent = 1, etiket = 1, bas, adim, sayi, isaret = true }) {
    const W = 620, H = 140, sol = 25, y = 92, xk = v => sol + (W - 2 * sol) * (v - min) / (max - min);
    let ic = cizgi(sol - 12, y, W - sol + 12, y);
    for (let v = min; v <= max; v += cent) ic += cizgi(xk(v), y - 6, xk(v), y + 6, "g-cizgi", 1.5);
    for (let v = min; v <= max; v += etiket) ic += Y(xk(v), y + 26, v, { k: 1 });
    for (let i = 0; i < sayi; i++) {
      const a = xk(bas + i * adim), b = xk(bas + (i + 1) * adim), h = Math.min(40, Math.abs(b - a) * 0.5);
      ic += `<path class="g-ok-a" fill="none" stroke-width="2.5" d="M${a.toFixed(1)} ${y} Q${((a + b) / 2).toFixed(1)} ${(y - 2 * h).toFixed(1)} ${b.toFixed(1)} ${y}"/>` + Y((a + b) / 2, y - h - 8, (adim > 0 ? "+" : "−") + Math.abs(adim), { k: 1 });
    }
    if (isaret) ic += `<circle class="g-d" cx="${xk(bas)}" cy="${y}" r="6"/>`;
    return G.svg(W, H, ic, "zıplamalı sayı doğrusu");
  }
  /* Eşit kollu terazi: sol ve sağ kefe yazıları */
  function terazi(sol, sag) {
    const ic = cizgi(200, 40, 200, 170, "g-cizgi", 4) + `<polygon class="g-yumusak g-cizgi" points="170,190 230,190 200,165" stroke-width="2"/>` + cizgi(60, 50, 340, 50, "g-cizgi", 4)
      + cizgi(60, 50, 40, 100) + cizgi(60, 50, 80, 100) + cizgi(340, 50, 320, 100) + cizgi(340, 50, 360, 100)
      + kutu(10, 100, 100, 46, "g-b", 10) + BY(60, 131, sol, 20) + kutu(290, 100, 100, 46, "g-b", 10) + BY(340, 131, sag, 20);
    return GS(400, 200, ic, "dengedeki terazi");
  }
  /* Romen rakamlı saat (akrep h'de, yelkovan 12'de) */
  function saat(h) {
    const cx = 120, cy = 120; let ic = `<circle class="g-bos g-cizgi" cx="${cx}" cy="${cy}" r="108" stroke-width="4"/>`;
    for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6; ic += BY((cx + 84 * Math.sin(a)).toFixed(1), (cy - 84 * Math.cos(a) + 6).toFixed(1), ROM(i), 17); }
    const a = (h % 12) * Math.PI / 6;
    ic += cizgi(cx, cy, cx, cy - 78, "g-ok-a", 4) + cizgi(cx, cy, (cx + 48 * Math.sin(a)).toFixed(1), (cy - 48 * Math.cos(a)).toFixed(1), "g-ok-d", 7) + `<circle class="g-cizgi-uc" cx="${cx}" cy="${cy}" r="6"/>`;
    return GS(240, 240, ic, "Romen rakamlı saat");
  }
  /* Basamak tablosu */
  const basTablo = (n, sat = "Rakam") => { const [y, o, b] = bas(n); return G.tablo(["", "Yüzler", "Onlar", "Birler"], [[sat, y, o, b]]); };

  /* ======================= TEMA 1 · 1000'E KADAR SAYILAR ======================= */
  KONU_EKLE("mat", {
    id: "m3_sayilar", tema: "m3t1", ad: "1000'e Kadar Sayılar",
    kazanimlar: [
      { id: "m3say.okuma", ad: "1000'e kadar olan sayıları okur ve yazar" },
      { id: "m3say.model", ad: "Nesne sayısını ve onluk taban bloklarıyla gösterilen sayıyı belirler" },
    ],
    anlatim: [
      { baslik: "Birlik, onluk, yüzlük", metin: "Tek bir küçük kareye <b>birlik</b> deriz. 10 birlik yan yana gelince bir <b>onluk</b> çubuk olur. 10 onluk çubuk birleşince bir <b>yüzlük</b> kare olur. 10 yüzlük de <b>bin</b> eder.", ornek: "Resimde 2 yüzlük, 3 onluk ve 4 birlik var. Bu sayı 234'tür.", gorsel: bloklar(2, 3, 4, { etiket: true }),
        durak: { soru: "10 onluk çubuk birleşirse ne olur?", secenekler: [["1 yüzlük", true, "Evet! 10 onluk = 100 = 1 yüzlük."], ["1 birlik", false, "1 birlik tek bir küçük karedir; 10 onluk çok daha büyüktür."], ["10 birlik", false, "10 birlik yalnızca 1 onluk eder."], ["1 bin", false, "Bin için 10 yüzlük gerekir."]] } },
      { baslik: "Sayıları okuyalım", metin: "Üç basamaklı bir sayıyı soldan sağa okuruz. Önce yüzleri, sonra onları, en son birleri söyleriz. Sıfır olan basamağı okumayız.", ornek: "345 → üç yüz kırk beş<br>405 → dört yüz beş (onlar basamağı 0, okunmaz)<br>760 → yedi yüz altmış",
        durak: { soru: "608 sayısı nasıl okunur?", secenekler: [["altı yüz sekiz", true, "Doğru! Onlar basamağı 0 olduğu için okunmaz."], ["altmış sekiz", false, "Yüzler basamağındaki 6'yı unuttun; 608 üç basamaklıdır."], ["altı yüz seksen", false, "Seksen 80 demektir; 608'de onlar basamağı 0'dır."], ["altı yüz sıfır sekiz", false, "Sıfırı sayı okurken söylemeyiz."]] } },
      { baslik: "Sayıları yazalım", metin: "Okunuşu verilen sayıyı yazarken her basamağa bir rakam koyarız. Okunmayan basamağa <b>0</b> yazarız. Böylece sayı doğru uzunlukta olur.", ornek: "yedi yüz on iki → 712<br>beş yüz yedi → 507 (onlar basamağına 0)<br>dokuz yüz → 900", gorsel: G.tablo(["Okunuş", "Yüzler", "Onlar", "Birler", "Sayı"], [["yedi yüz on iki", 7, 1, 2, 712], ["beş yüz yedi", 5, 0, 7, 507], ["dokuz yüz", 9, 0, 0, 900]]),
        durak: { soru: "“Üç yüz dokuz” sayısı nasıl yazılır?", secenekler: [["309", true, "Doğru! 3 yüzlük, 0 onluk, 9 birlik."], ["39", false, "Onlar basamağına 0 koymayı unuttun; bu sayı otuz dokuz olur."], ["3009", false, "Yüz için 300 yazıp yanına 9 koymuşsun; sayı dört basamaklı olmuş."], ["390", false, "390, üç yüz doksan diye okunur."]] } },
      { baslik: "Bine kadar sayalım", metin: "Çok sayıda nesneyi onarlı gruplara ayırırsak saymak kolaylaşır. 10 tane onluk grup 100 eder. 999'dan sonra gelen sayı <b>1000</b>'dir ve “bin” diye okunur.", ornek: "4 paket × 10 kalem ve 3 tek kalem = 43 kalem.<br>998, 999, 1000 diye sayarız.", gorsel: kutular([997, 998, 999, "?"]),
        durak: { soru: "999'dan hemen sonra gelen sayı hangisidir?", secenekler: [["1000", true, "Evet! 999 + 1 = 1000, yani bin."], ["9910", false, "Rakamları yan yana yazmak sayıyı bir artırmaz."], ["998", false, "998, 999'dan önce gelir."], ["990", false, "990, 999'dan küçüktür."]] } },
    ],
    uret: {
      "m3say.okuma": [
        z => { const n = R(1, 9) * 100 + sec([0, R(1, 9)]) * 10 + R(0, 9); const [y, o, b] = bas(n); if (!o && !b) return null;
          return S({ kaz: "m3say.okuma", duzey: "hatirlama", zorluk: 1, gorsel: kart(n), soru: "Kartta yazan sayı nasıl okunur?", dogru: oku(n),
            yanlis: [[oku(y * 100 + b * 10 + o), "dikkat", "Onlar ve birler basamağındaki rakamların yerini karıştırdın."], [oku(o * 10 + b) || "sıfır", "dikkat", "Yüzler basamağını okumayı unuttun."], [oku(b * 100 + o * 10 + y), "dikkat", "Sayıyı sağdan sola okudun; soldan başlamalısın."], [oku(y * 100 + (o + 1) % 10 * 10 + b), "dikkat", "Onlar basamağına dikkatli bak."]],
            ipucu: "Önce yüzler basamağını, sonra onları, en son birleri oku.",
            cozum: C(`Kartta ${n} yazıyor. Okunuşunu bulacağız.`, "Sayıyı soldan sağa okuruz; 0 olan basamağı söylemeyiz.", [`Yüzler basamağında ${y} var → “${oku(y * 100)}”.`, `Onlar ${o}, birler ${b} → “${oku(o * 10 + b) || "okunmaz"}”.`], `${n} → “${oku(n)}”.`, "Okunuşu tekrar rakamla yazalım; aynı sayı çıkıyorsa doğrudur."),
            kural: "Sayılar soldan sağa okunur: önce yüzler, sonra onlar, sonra birler.", dogruNeden: `${n} sayısında ${y} yüzlük, ${o} onluk, ${b} birlik vardır.` }); },
        z => { const y = R(1, 9), o = sec([0, 0, R(1, 9)]), b = sec([0, R(1, 9), R(1, 9)]), n = y * 100 + o * 10 + b; if (n % 100 === 0) return null;
          return S({ kaz: "m3say.okuma", duzey: "uygulama", zorluk: 2, soru: `Okunuşu <b>“${oku(n)}”</b> olan sayı hangisidir?`, dogru: n,
            yanlis: [[`${y * 100}${o * 10 + b}`, "kavrama", `“${oku(y * 100)}” için ${y * 100} yazıp yanına ${o * 10 + b} eklemişsin. Sayı üç basamaklı olmalı.`], [o ? y * 100 + b * 10 + o : y * 10 + b, "dikkat", o ? "Onlar ve birler rakamlarının yerini değiştirdin." : "Onlar basamağına 0 yazmayı unuttun."], [y * 100 + o + b * 10, "dikkat", "Rakamları yanlış basamaklara yerleştirdin."], [n + 10, "dikkat", "Onlar basamağına tekrar bak."]],
            ipucu: "Üç kutu çiz: yüzler, onlar, birler. Okunmayan basamağa 0 yaz.",
            cozum: C(`“${oku(n)}” sayısını rakamla yazacağız.`, "Her basamağa bir rakam yazılır; söylenmeyen basamağa 0 konur.", [`Yüzler: “${oku(y * 100)}” → ${y}.`, `Onlar: ${o ? "“" + ON[o] + "” → " + o : "söylenmemiş → 0"}. Birler: ${b ? "“" + BIR[b] + "” → " + b : "söylenmemiş → 0"}.`], `Sayı ${n}.`, `${n} sayısını okuyalım: “${oku(n)}”. Aynı!`),
            kural: "Okunmayan basamağa 0 yazmayı unutma; üç basamaklı sayıda üç rakam olur.", dogruNeden: `${y} yüzlük, ${o} onluk, ${b} birlik = ${n}.` }); },
        z => { const n = sec([R(1, 9) * 100 + 99, R(1, 9) * 100 + R(1, 9) * 10 + 9, R(2, 9) * 100, R(1, 9) * 100 + R(1, 9) * 10]); const ileri = n % 100 === 0 ? false : sec([true, true, false]); if (n === 999 && !ileri) return null;
          const d = ileri ? n + 1 : n - 1;
          return S({ kaz: "m3say.okuma", duzey: "uygulama", zorluk: 2, gorsel: kutular(ileri ? [n - 1, n, "?"] : ["?", n, n + 1]), soru: ileri ? `Kutulardaki sayılar birer birer artıyor. Soru işaretli kutuya hangi sayı gelir?` : `Kutulardaki sayılar birer birer artıyor. İlk kutuya hangi sayı gelir?`, dogru: d,
            yanlis: ileri ? [[n % 10 === 9 ? `${n}`.slice(0, -1) + "10" : n + 11, "kavrama", n % 10 === 9 ? "Birlere 10 yazılmaz; 9'dan sonra birler 0 olur, onlar 1 artar." : "Hem onlar hem birler basamağını artırdın; yalnızca 1 eklemelisin."], [n + 10, "dikkat", "Birer birer saymalısın, onar onar değil."], [n - 1, "dikkat", "Bu, sayıdan önce gelen sayı."], [n + 2, "dikkat", "Bir sonraki sayı yalnızca 1 fazladır."]]
              : [[n - 10, "dikkat", "Birer birer geriye saymalısın, onar onar değil."], [n + 1, "dikkat", "Bu, sayıdan sonra gelen sayı."], [n - 11, "kavrama", "Hem onlar hem birler basamağını azalttın; yalnızca 1 çıkarmalısın."], [n - 2, "dikkat", "Bir önceki sayı yalnızca 1 eksiktir."]],
            ipucu: ileri ? "Bir sonraki sayıyı bulmak için 1 ekle." : "Bir önceki sayıyı bulmak için 1 çıkar.",
            cozum: C(ileri ? `${n} sayısından hemen sonra gelen sayıyı arıyoruz.` : `${n} sayısından hemen önce gelen sayıyı arıyoruz.`, "Birer birer sayarken her adımda sayı 1 artar ya da 1 azalır.", ileri ? [`${n} + 1 = ${d}.`, n % 10 === 9 ? "Birler 9'dan sonra 0 olur ve bir onluk artar." : "Yalnızca birler basamağı değişir."] : [`${n} − 1 = ${d}.`, n % 10 === 0 ? "Birler 0 olduğu için bir onluk bozulur; birler 9 olur." : "Yalnızca birler basamağı değişir."], `Soru işaretli kutuya ${d} gelir.`, ileri ? `${d} − 1 = ${n}. Doğru!` : `${d} + 1 = ${n}. Doğru!`),
            kural: "Sonraki sayı = sayı + 1; önceki sayı = sayı − 1.", dogruNeden: ileri ? `${n} + 1 = ${d}` : `${n} − 1 = ${d}` }); },
        z => { const [k] = iki(); const y = R(1, 9), o = sec([0, R(1, 9)]), b = R(1, 9), n = y * 100 + o * 10 + b; const yer = sec(["Sinema biletinde koltuk", "Kütüphanedeki kitabın", "Yarışmadaki koşucunun göğüs"]);
          return S({ kaz: "m3say.okuma", duzey: "transfer", zorluk: 2, gorsel: kart("🎫 ?", yer + " numarası"), soru: `${yer} numarası yazıyla “${oku(n)}” diye yazılmış. ${k[0]} bu numarayı rakamla yazmak istiyor. Hangisini yazmalı?`, dogru: n,
            yanlis: [[`${y * 100}${o ? o * 10 + b : b}`, "kavrama", "Sayıyı duyduğun parçaları yan yana yazarak oluşturdun; basamak sayısı fazla oldu."], [o ? y * 10 + o : y * 10 + b, "dikkat", "Bir basamağı eksik yazdın."], [y * 100 + b * 10 + o, "dikkat", "Onlar ve birler rakamlarının yerini değiştirdin."], [n + 100, "dikkat", "Yüzler basamağına tekrar bak."]],
            ipucu: "Yüzler, onlar, birler kutularını doldur.",
            cozum: C(`Yazıyla “${oku(n)}” verilmiş, rakamla yazacağız.`, "Üç basamaklı sayıda yüzler, onlar ve birler basamağı vardır.", [`Yüzler: ${y}, onlar: ${o}, birler: ${b}.`], `Numara ${n}.`, `${n} okunuşu “${oku(n)}”. Aynı!`),
            kural: "Rakamla yazarken her basamağa bir rakam yazılır.", dogruNeden: `${y} yüzlük + ${o} onluk + ${b} birlik = ${n}.` }); },
        Q("m3say.okuma", "hatirlama", 1, "Hangisi <b>“altı yüz altı”</b> sayısıdır?", "606",
          [["660", "dikkat", "660, altı yüz altmış diye okunur."], ["6006", "kavrama", "600 ile 6'yı yan yana yazdın; sayı dört basamaklı oldu."], ["66", "dikkat", "Onlar basamağına 0 yazmayı unuttun; bu sayı altmış altıdır."]],
          "Okunmayan onlar basamağına ne yazılır?",
          C("“Altı yüz altı” sayısını bulacağız.", "Söylenmeyen basamağa 0 yazarız.", ["Yüzler: 6, onlar: söylenmedi → 0, birler: 6."], "Sayı 606.", "606'yı okuyalım: altı yüz altı. Doğru!"),
          { kural: "Sıfır okunmaz ama yazılır.", dogruNeden: "6 yüzlük, 0 onluk, 6 birlik = 606.", gorsel: G.tablo(["Yüzler", "Onlar", "Birler"], [["?", "?", "?"]]) }),
        Q("m3say.okuma", "baglanti", 2, "Bir sayının okunuşunda yalnızca <b>“dokuz yüz”</b> sözcükleri var. Bu sayının onlar ve birler basamağında hangi rakam vardır?", "İkisinde de 0",
          [["İkisinde de 9", "kavrama", "Onlar ve birler 9 olsaydı “dokuz yüz doksan dokuz” okunurdu."], ["Onlarda 9, birlerde 0", "dikkat", "O zaman sayı “dokuz yüz doksan” olurdu."], ["İkisinde de 1", "kavrama", "Okunmayan basamaklarda 1 değil, 0 vardır."]],
          "Okunuşta söylenmeyen basamaklarda hangi rakam vardır?",
          C("“Dokuz yüz” sayısının basamaklarını soruyoruz.", "Okunmayan basamakta 0 vardır.", ["Dokuz yüz = 900.", "Onlar basamağı 0, birler basamağı 0."], "İkisinde de 0 var.", "900 = 9 yüzlük. Onluk ya da birlik yok."),
          { kural: "Sayının okunuşunda söylenmeyen basamaklarda 0 vardır.", dogruNeden: "Dokuz yüz = 900; onlar ve birler basamakları 0'dır.", gorsel: kart(900) }),
      ],
      "m3say.model": [
        z => { const y = R(1, 7), o = sec([0, R(1, 9), R(1, 9)]), b = R(0, 9), n = y * 100 + o * 10 + b; if (o === b) return null;
          return S({ kaz: "m3say.model", duzey: "uygulama", zorluk: 1, gorsel: bloklar(y, o, b), soru: "Mavi kareler yüzlük, yeşil çubuklar onluk, sarı küçük kareler birliktir. Bloklar hangi sayıyı gösteriyor?", dogru: n,
            yanlis: [[y * 100 + b * 10 + o, "dikkat", "Onlukları ve birlikleri karıştırdın."], [y + o + b, "kavrama", "Blokların sayısını topladın; ama her blok farklı değerdedir."], [b * 100 + o * 10 + y, "dikkat", "Yüzlükleri birlik, birlikleri yüzlük saydın."], [n + 10, "dikkat", "Onluk çubukları yeniden say."]],
            ipucu: "Yüzlükleri, onlukları ve birlikleri ayrı ayrı say.",
            cozum: C("Bloklarla gösterilen sayıyı bulacağız.", "1 yüzlük = 100, 1 onluk = 10, 1 birlik = 1.", [`Yüzlük: ${y} → ${y * 100}. Onluk: ${o} → ${o * 10}. Birlik: ${b} → ${b}.`, `${y * 100} + ${o * 10} + ${b} = ${n}.`], `Bloklar ${n} sayısını gösteriyor.`, `${n} = ${y} yüzlük, ${o} onluk, ${b} birlik. Resimle aynı!`),
            kural: "Yüzlük kare 100, onluk çubuk 10, birlik küp 1 değerindedir.", dogruNeden: `${y} yüzlük + ${o} onluk + ${b} birlik = ${n}.` }); },
        z => { const y = R(1, 9), o = R(0, 9), b = R(0, 9), n = y * 100 + o * 10 + b; if (o === b || y === b) return null;
          return S({ kaz: "m3say.model", duzey: "uygulama", zorluk: 1, gorsel: abakus(y, o, b), soru: "Abaküste Y yüzler, O onlar, B birler çubuğudur. Abaküs hangi sayıyı gösteriyor?", dogru: n,
            yanlis: [[b * 100 + o * 10 + y, "dikkat", "Çubukları sağdan sola okudun; Y en solda, yüzler basamağıdır."], [y + o + b, "kavrama", "Boncukların hepsini saydın; ama her çubuk farklı basamaktır."], [y * 100 + b * 10 + o, "dikkat", "Onlar ve birler çubuklarını karıştırdın."], [n + 1, "dikkat", "Birler çubuğundaki boncukları yeniden say."]],
            ipucu: "Her çubuktaki boncuğu ayrı say ve basamağına yaz.",
            cozum: C("Abaküste gösterilen sayıyı bulacağız.", "Her çubuktaki boncuk sayısı, o basamaktaki rakamdır.", [`Y çubuğu: ${y}, O çubuğu: ${o}, B çubuğu: ${b}.`], `Sayı ${n}.`, o === 0 || b === 0 ? "Boş çubuk 0 demektir; 0'ı yazmayı unutmadık." : `${n} sayısının basamakları ${y}, ${o}, ${b}. Doğru!`),
            kural: "Abaküste boş çubuk, o basamakta 0 olduğunu gösterir.", dogruNeden: `${y} yüzlük, ${o} onluk, ${b} birlik = ${n}.` }); },
        z => { const g = R(2, 7), art = R(1, 9), n = g * 10 + art, e = sec(["✏️", "🖍️", "🍬", "🎈"]); const ad = { "✏️": "kalem", "🖍️": "boya kalemi", "🍬": "şeker", "🎈": "balon" }[e];
          return S({ kaz: "m3say.model", duzey: "uygulama", zorluk: 1, gorsel: gruplar(e, g, 10, art), soru: `Her kutuda 10 ${ad} var. Dışarıda da birkaç ${ad} duruyor. Toplam kaç ${ad} var?`, dogru: n,
            yanlis: [[g + art, "kavrama", "Kutuları 1 saydın; her kutuda 10 tane var."], [art * 10 + g, "dikkat", "Kutuları birlik, dışarıdakileri onluk saydın."], [g * 10, "dikkat", "Dışarıdaki tek tek duranları eklemeyi unuttun."], [n + 10, "dikkat", "Kutuları yeniden say."]],
            ipucu: "Önce kutuları onar onar say, sonra tek tekleri ekle.",
            cozum: C(`Kutulardaki ve dışarıdaki ${ad}ları sayacağız.`, "10'arlı gruplar onluk gibidir; onar onar sayarız.", [`${g} kutu → ${Array.from({ length: g }, (_, i) => (i + 1) * 10).join(", ")} → ${g * 10}.`, `Dışarıda ${art} tane var: ${g * 10} + ${art} = ${n}.`], `Toplam ${n} ${ad} var.`, `${n} = ${g} onluk + ${art} birlik. Resimle aynı!`),
            kural: "Çok nesneyi saymanın kolay yolu: önce onarlı gruplar, sonra tekler.", dogruNeden: `${g} onluk (${g * 10}) + ${art} birlik = ${n}.` }); },
        z => { const y = R(1, 9), o = R(0, 9), b = R(0, 9), n = y * 100 + o * 10 + b; if (o === b) return null;
          const t = (a, c, d) => `${a} yüzlük, ${c} onluk, ${d} birlik`;
          return S({ kaz: "m3say.model", duzey: "aciklama", zorluk: 2, soru: `Can, <b>${n}</b> sayısını onluk taban bloklarıyla gösterecek. Hangi blokları almalı?`, dogru: t(y, o, b),
            yanlis: [[t(y, b, o), "dikkat", "Onlar ve birler basamaklarını karıştırdın."], [t(b, o, y), "dikkat", "Sayıyı sağdan okudun; en soldaki rakam yüzleri gösterir."], [t(y, o + 1, b), "dikkat", "Onlar basamağındaki rakamı yeniden oku."], [t(y + 1, o, b), "dikkat", "Yüzler basamağındaki rakamı yeniden oku."]],
            ipucu: "Sayının her rakamı, o basamaktan kaç blok alınacağını söyler.",
            cozum: C(`${n} sayısı için kaç yüzlük, kaç onluk, kaç birlik gerektiğini bulacağız.`, "Yüzler basamağı yüzlük sayısını, onlar basamağı onluk sayısını, birler basamağı birlik sayısını gösterir.", [`${n}: yüzler ${y}, onlar ${o}, birler ${b}.`], `${t(y, o, b)} almalı.`, `${y * 100} + ${o * 10} + ${b} = ${n}. Doğru!`),
            kural: "Rakam, o basamaktan kaç tane olduğunu söyler.", dogruNeden: `${n} = ${y * 100} + ${o * 10} + ${b}.`, gorsel: basTablo(n, "?") }); },
        z => { const y = R(1, 8), o = R(1, 6), b = R(1, 9), kac = R(1, 3), n = y * 100 + o * 10 + b, h = n + kac * 10;
          return S({ kaz: "m3say.model", duzey: "uygulama", zorluk: 2, gorsel: bloklar(y, o, b), soru: `Resimdeki bloklarla <b>${h}</b> sayısını göstermek istiyoruz. Kaç <b>onluk</b> çubuk eklemeliyiz?`, dogru: kac,
            yanlis: [[kac * 10, "kavrama", "Kaç onluk çubuk eklendiğini soruyor; çubuk sayısı " + kac + ", değeri " + kac * 10 + "."], [kac + 1, "islem", "Onluk sayılarını tekrar karşılaştır."], [o + kac, "kavrama", "Bu, eklendikten sonraki toplam onluk sayısı."], [Math.max(1, kac - 1) === kac ? kac + 2 : Math.max(1, kac - 1), "islem", "Onlukları yeniden say."]],
            ipucu: "Resimdeki sayıyı bul; yeni sayıyla onlar basamaklarını karşılaştır.",
            cozum: C(`Resimdeki sayıyı ${h} yapmak için kaç onluk gerektiğini bulacağız.`, "Bir onluk çubuk sayıyı 10 artırır.", [`Resimdeki sayı ${n}.`, `${h} − ${n} = ${kac * 10}; ${kac * 10} = ${kac} onluk.`], `${kac} onluk çubuk eklemeliyiz.`, `${n} + ${kac * 10} = ${h}. Doğru!`),
            kural: "Her onluk çubuk sayıyı 10 artırır.", dogruNeden: `${n} sayısına ${kac} onluk (${kac * 10}) eklenince ${h} olur.` }); },
        z => { const k = R(2, 6), p = R(1, 9), t = R(1, 9), n = k * 100 + p * 10 + t;
          return S({ kaz: "m3say.model", duzey: "transfer", zorluk: 3, gorsel: G.tablo(["Ürün", "İçinde", "Sayı"], [["📦 Büyük kutu", "100 silgi", k], ["🎁 Paket", "10 silgi", p], ["🧽 Tek silgi", "1 silgi", t]]), soru: "Kırtasiyede silgiler tablodaki gibi satılıyor. Dükkânda toplam kaç silgi var?", dogru: n,
            yanlis: [[k + p + t, "kavrama", "Kutu, paket ve tekleri aynı saydın; ama kutuda 100, pakette 10 silgi var."], [k * 10 + p * 100 + t, "dikkat", "Kutu ve paket değerlerini karıştırdın."], [t * 100 + p * 10 + k, "dikkat", "Yüzlük olan kutuları birlik saydın."], [n + 100, "islem", "Kutuları yeniden say."]],
            ipucu: "Kutu = yüzlük, paket = onluk, tek silgi = birlik gibidir.",
            cozum: C("Kutu, paket ve tek silgileri birlikte sayacağız.", "Büyük kutu 100'lük, paket 10'luk, tek silgi 1'liktir.", [`${k} kutu → ${k * 100} silgi.`, `${p} paket → ${p * 10} silgi; ${t} tek silgi → ${t}.`, `${k * 100} + ${p * 10} + ${t} = ${n}.`], `Toplam ${n} silgi var.`, `${n}: ${k} yüzlük, ${p} onluk, ${t} birlik. Tabloyla aynı!`),
            kural: "Yüzlük–onluk–birlik düşüncesi günlük hayatta da işe yarar.", dogruNeden: `${k} × 100 + ${p} × 10 + ${t} = ${n}.` }); },
      ],
    },
  });

  /* SON */
})();
