/* Ortak yardımcılar: rastgelelik, sayı biçimi, Türkçe ekler, soru kurucu ve soru görselleri (SVG).
 *
 * Ders içerik dosyaları (mat.js, fen.js …) bu araçlarla konularını kurar ve DERS_EKLE() ile kaydeder.
 * Bir soru şu biçimdedir:
 *  { kaz, duzey, zorluk, soru, gorsel?, secenekler:[{m, dogru, hata, neden}], ipucu, cozum:[adımlar], kural? }
 *  duzey : hatirlama | aciklama | uygulama | transfer | baglanti
 *  hata  : bilgi | kavrama | islem | dikkat | strateji
 *  gorsel: soruyla birlikte gösterilen SVG/HTML (yalnızca uygulamanın kendi kodundan gelir)
 *  kural : çözümün altında “Unutma” kutusunda gösterilen kısa kural
 */
(function () {
  "use strict";
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const sec = a => a[Math.floor(Math.random() * a.length)];
  const karistir = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const od = x => String(Number(Number(x).toFixed(6))).replace(".", ",");
  const bolenler = n => { const b = []; for (let i = 1; i <= n; i++) if (n % i === 0) b.push(i); return b; };
  const asalMi = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const ebob = (a, b) => b ? ebob(b, a % b) : a;
  const ekok = (a, b) => a / ebob(a, b) * b;
  const sade = (a, b) => { const g = ebob(Math.abs(a), Math.abs(b)) || 1; return [a / g, b / g]; };
  const kesir = (a, b) => { const [p, q] = sade(a, b); return q === 1 ? String(p) : `${p}/${q}`; };
  const asalCarpan = n => { const s = {}; let d = 2; while (n > 1) { while (n % d === 0) { s[d] = (s[d] || 0) + 1; n /= d; } d++; } return s; };

  /* Sayıya Türkçe ek: okunuşun son sözcüğüne göre ünlü uyumu (42 → 42'nin, 30 → 30'un, 6 → 6'şar). */
  const SOZ = { 0: "sıfır", 1: "bir", 2: "iki", 3: "üç", 4: "dört", 5: "beş", 6: "altı", 7: "yedi", 8: "sekiz", 9: "dokuz" };
  const ONLAR = { 1: "on", 2: "yirmi", 3: "otuz", 4: "kırk", 5: "elli", 6: "altmış", 7: "yetmiş", 8: "seksen", 9: "doksan" };
  function sonSozcuk(n) {
    n = Math.abs(Math.round(Number(n)));
    if (n === 0) return "sıfır";
    if (n % 10) return SOZ[n % 10];
    if (n % 100) return ONLAR[(n % 100) / 10];
    if (n % 1000) return "yüz";
    if (n % 1000000) return "bin";
    return "milyon";
  }
  function ek(n, tur) {
    const w = sonSozcuk(n);
    const unlu = [...w].reverse().find(c => "aeıioöuü".includes(c));
    const sonUnlu = "aeıioöuü".includes(w[w.length - 1]);
    const sert = "fstkçşhp".includes(w[w.length - 1]);
    const dort = { a: "ı", ı: "ı", e: "i", i: "i", o: "u", u: "u", ö: "ü", ü: "ü" }[unlu];
    const iki = "aıou".includes(unlu) ? "a" : "e";
    const d = sert ? "t" : "d";
    const e = {
      in: sonUnlu ? "n" + dort + "n" : dort + "n",
      i: sonUnlu ? "y" + dort : dort,
      e: sonUnlu ? "y" + iki : iki,
      den: d + iki + "n",
      dir: d + dort + "r",
      er: sonUnlu ? "ş" + iki + "r" : iki + "r",
      ini: sonUnlu ? "s" + dort + "n" + dort : dort + "n" + dort,
    }[tur];
    return "'" + e;
  }
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const us = (t, k) => k === 1 ? String(t) : t + String(k).split("").map(c => SUP[c]).join("");
  const ustlu = c => Object.keys(c).map(Number).sort((a, b) => a - b).map(p => us(p, c[p])).join(" · ");

  /* Soru kurucu: doğru cevap + çeldiriciler (her birinin hata türü ve nedeni). */
  function S(o) {
    const goruldu = new Set([String(o.dogru)]);
    const yanlis = [];
    for (const [m, hata, neden] of o.yanlis) {
      const k = String(m);
      if (goruldu.has(k) || k === "" || k === "NaN" || k === "undefined" || k === "null") continue;
      goruldu.add(k); yanlis.push({ m: k, dogru: false, hata, neden });
      if (yanlis.length === 3) break;
    }
    // Yedek çeldiriciler: doğru cevaba yakın, aynı biçimde (kesir, ondalık, birimli) değerler.
    const ekle = k => { if (!goruldu.has(k) && yanlis.length < 3) { goruldu.add(k); yanlis.push({ m: k, dogru: false, hata: "islem", neden: "Hesaplamada küçük bir hata yapılmış olabilir." }); } };
    const ds = String(o.dogru);
    const kes = ds.match(/^(\d+)\/(\d+)$/);
    const sayiM = ds.match(/^(-?\d+(?:,(\d+))?)(.*)$/);
    if (kes) {
      const p = +kes[1], q = +kes[2];
      [[p + 1, q], [p, q + 1], [Math.max(1, p - 1), q], [q, p], [p + 1, q + 1], [p * 2, q + 1]].forEach(([a, b]) => ekle(a === b ? `${a}/${b + 1}` : `${a}/${b}`));
    } else if (sayiM) {
      const ondalik = sayiM[2] ? sayiM[2].length : 0, adim = Math.pow(10, -ondalik), son = sayiM[3] || o.birim || "";
      const x = Number(sayiM[1].replace(",", "."));
      for (let d = 1; yanlis.length < 3 && d < 30; d++)
        for (const a of [x + d * adim, x - d * adim]) if (a >= 0) ekle(od(Math.round(a / adim) * adim) + son);
    }
    while (yanlis.length < 3) yanlis.push({ m: "Hiçbiri", dogru: false, hata: "kavrama", neden: "Seçeneklerden biri doğrudur." });
    return {
      kaz: o.kaz, duzey: o.duzey, zorluk: o.zorluk, soru: o.soru, gorsel: o.gorsel || null,
      secenekler: karistir([{ m: String(o.dogru), dogru: true, hata: null, neden: o.dogruNeden || "" }].concat(yanlis)),
      ipucu: o.ipucu, cozum: o.cozum, kural: o.kural || null,
    };
  }

  /* Sabit (havuz) soru: tek satırda yazılan soruyu üreteç fonksiyonuna çevirir.
   * Q("kaz", "uygulama", 2, "Soru?", "Doğru", [["Yanlış", "kavrama", "Neden yanlış"], ...], "İpucu", ["Adım 1", "Adım 2"], { gorsel, kural, dogruNeden })
   */
  function Q(kaz, duzey, zorluk, soru, dogru, yanlis, ipucu, cozum, ekler) {
    return () => S(Object.assign({ kaz, duzey, zorluk, soru, dogru, yanlis, ipucu, cozum }, ekler || {}));
  }

  /* ============================ SORU GÖRSELLERİ ============================
   * Renkler CSS sınıflarıyla verilir (index.html'de açık/koyu tema için tanımlı):
   *  g-cizgi (kontur), g-ince (ince/soluk kontur), g-a (mavi dolgu), g-b (sarı dolgu), g-c (yeşil dolgu),
   *  g-d (kırmızı dolgu), g-yumusak (açık mavi dolgu), g-bos (sayfa rengi dolgu), g-yazi (metin), g-yazi-k (küçük metin)
   */
  const svg = (w, h, ic, etiket) => `<svg class="gorsel-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${etiket || "soru görseli"}">${ic}</svg>`;
  const yazi = (x, y, t, o = {}) => `<text class="${o.k ? "g-yazi-k" : "g-yazi"}" x="${x}" y="${y}" text-anchor="${o.a || "middle"}"${o.b ? ' font-weight="700"' : ""}>${t}</text>`;
  const ok = (x1, y1, x2, y2, sinif = "g-cizgi") => {
    const a = Math.atan2(y2 - y1, x2 - x1), u = 10;
    const p1 = [x2 - u * Math.cos(a - 0.45), y2 - u * Math.sin(a - 0.45)], p2 = [x2 - u * Math.cos(a + 0.45), y2 - u * Math.sin(a + 0.45)];
    return `<line class="${sinif}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="3"/><path class="${sinif}-uc" d="M${x2} ${y2} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z"/>`;
  };

  const G = {
    svg, yazi, ok,
    /* Birim kare ızgarası (dikdörtgen modeli). boyali: boyanacak kare sayısı */
    izgara(sat, sut, { boyali = sat * sut, etiket = true } = {}) {
      const b = Math.min(28, Math.floor(300 / Math.max(sut, sat))), w = sut * b + 60, h = sat * b + 40;
      let ic = "";
      for (let i = 0; i < sat; i++) for (let j = 0; j < sut; j++) ic += `<rect class="${i * sut + j < boyali ? "g-a" : "g-bos"} g-ince" x="${40 + j * b}" y="${10 + i * b}" width="${b}" height="${b}"/>`;
      if (etiket) ic += yazi(40 + sut * b / 2, sat * b + 32, sut + " birim") + yazi(30, 10 + sat * b / 2 + 4, sat, { a: "end" });
      return svg(w, h, ic, `${sat} sıra ${sut} sütunluk kare modeli`);
    },
    /* Sayı doğrusu: min–max arası, ana çentikler ve isteğe bağlı işaretli nokta(lar) */
    sayiDogrusu({ min, max, adim, araAdim = null, etiket = x => od(x), noktalar = [] }) {
      const W = 620, H = 90, sol = 30, sag = 30, y = 45;
      const xk = v => sol + (W - sol - sag) * (v - min) / (max - min);
      let ic = `<line class="g-cizgi" x1="${sol - 15}" y1="${y}" x2="${W - sag + 15}" y2="${y}" stroke-width="2"/>`;
      if (araAdim) for (let v = min; v <= max + 1e-9; v += araAdim) ic += `<line class="g-ince" x1="${xk(v)}" y1="${y - 6}" x2="${xk(v)}" y2="${y + 6}"/>`;
      for (let v = min; v <= max + 1e-9; v += adim) ic += `<line class="g-cizgi" x1="${xk(v)}" y1="${y - 11}" x2="${xk(v)}" y2="${y + 11}" stroke-width="2"/>` + yazi(xk(v), y + 30, etiket(Math.round(v * 1e6) / 1e6));
      noktalar.forEach(n => { ic += `<circle class="${n.sinif || "g-d"}" cx="${xk(n.v)}" cy="${y}" r="7"/>` + (n.ad ? yazi(xk(n.v), y - 18, n.ad, { b: 1 }) : ""); });
      return svg(W, H, ic, "sayı doğrusu");
    },
    /* Sütun grafiği: [[ad, değer], ...] */
    sutun(veri, { baslik = "", birim = "" } = {}) {
      const W = 560, H = 250, sol = 44, alt = 34, ust = (baslik ? 34 : 14) + (birim ? 16 : 0);
      const mx = Math.max(...veri.map(v => v[1])), adim = mx <= 10 ? 2 : mx <= 25 ? 5 : mx <= 60 ? 10 : 20, tepe = Math.ceil(mx / adim) * adim;
      const yk = v => ust + (H - ust - alt) * (1 - v / tepe), bw = (W - sol - 20) / veri.length;
      let ic = baslik ? yazi(W / 2, 20, baslik, { b: 1 }) : "";
      for (let v = 0; v <= tepe; v += adim) ic += `<line class="g-ince" x1="${sol}" x2="${W - 10}" y1="${yk(v)}" y2="${yk(v)}"/>` + yazi(sol - 6, yk(v) + 4, v, { a: "end", k: 1 });
      veri.forEach(([ad, v], i) => { const x = sol + i * bw + bw * 0.2, w = bw * 0.6; ic += `<rect class="g-a" x="${x}" y="${yk(v)}" width="${w}" height="${yk(0) - yk(v)}" rx="3"/>` + yazi(x + w / 2, H - 12, ad, { k: 1 }); });
      ic += `<line class="g-cizgi" x1="${sol}" x2="${W - 10}" y1="${yk(0)}" y2="${yk(0)}"/>` + (birim ? yazi(sol - 30, ust - 14, "(" + birim + ")", { a: "start", k: 1 }) : "");
      return svg(W, H, ic, baslik || "sütun grafiği");
    },
    /* Torba / kutu içinde renkli toplar: { "kırmızı": 3, "mavi": 2 } */
    torba(sayilar) {
      const RENK = { kırmızı: "#d64545", mavi: "#2f6fdb", yeşil: "#2e9b57", sarı: "#f2b632", mor: "#8a5cd6", turuncu: "#ee8a2a", siyah: "#333", beyaz: "#fff" };
      const toplar = []; Object.entries(sayilar).forEach(([r, n]) => { for (let i = 0; i < n; i++) toplar.push(r); });
      const sut = Math.min(8, Math.ceil(Math.sqrt(toplar.length * 2))), satir = Math.ceil(toplar.length / sut), W = 60 + sut * 40, H = 50 + satir * 40;
      let ic = `<rect class="g-cizgi g-bos" x="10" y="10" width="${W - 20}" height="${H - 18}" rx="22" stroke-width="2"/>`;
      karistir(toplar).forEach((r, i) => { ic += `<circle cx="${45 + (i % sut) * 40}" cy="${40 + Math.floor(i / sut) * 40}" r="15" fill="${RENK[r] || "#999"}" stroke="#555" stroke-width="1.5"/>`; });
      return svg(W, H, ic, "torbadaki toplar: " + Object.entries(sayilar).map(([r, n]) => n + " " + r).join(", "));
    },
    /* Kesir şeridi: q eş parçadan p tanesi boyalı */
    kesirSeridi(p, q, { genislik = 480 } = {}) {
      const b = genislik / q; let ic = "";
      for (let i = 0; i < q; i++) ic += `<rect class="${i < p ? "g-b" : "g-bos"} g-cizgi" x="${10 + i * b}" y="10" width="${b}" height="44"/>`;
      return svg(genislik + 20, 64, ic, `${q} parçadan ${p} tanesi boyalı şerit`);
    },
    /* Cetvel ve ölçülen çubuk (cm, mm çentikli) */
    cetvel(uzunlukMm) {
      const cm = Math.ceil(uzunlukMm / 10) + 1, b = Math.min(52, 560 / cm), W = cm * b + 40;
      let ic = `<rect class="g-b" x="20" y="14" width="${uzunlukMm / 10 * b}" height="20" rx="3"/><rect class="g-yumusak g-cizgi" x="20" y="44" width="${cm * b}" height="44"/>`;
      for (let m = 0; m <= cm * 10; m++) { const x = 20 + m * b / 10, u = m % 10 === 0 ? 18 : m % 5 === 0 ? 12 : 7; ic += `<line class="g-cizgi" x1="${x}" y1="44" x2="${x}" y2="${44 + u}"/>`; if (m % 10 === 0) ic += yazi(x, 82, m / 10, { k: 1 }); }
      return svg(W, 96, ic, "cetvel");
    },
    /* Kuvvet diyagramı: kutuya etki eden oklar. sol/sag/ust/alt: newton değerleri dizisi */
    kuvvet({ sol = [], sag = [], ust = [], alt = [], cisim = "" }) {
      const W = 560, H = 230, cx = 280, cy = 115; let ic = `<rect class="g-yumusak g-cizgi" x="${cx - 45}" y="${cy - 35}" width="90" height="70" rx="6" stroke-width="2"/>` + (cisim ? yazi(cx, cy + 5, cisim, { k: 1 }) : "");
      const ciz = (dizi, f) => dizi.forEach((n, i) => { ic += f(n, i, dizi.length); });
      ciz(sag, (n, i, t) => { const y = cy - (t - 1) * 12 + i * 24; const L = 30 + n * 6; return ok(cx + 45, y, cx + 45 + Math.min(200, L), y, "g-ok-a") + yazi(cx + 55 + Math.min(200, L), y - 6, n + " N", { a: "end", k: 1 }); });
      ciz(sol, (n, i, t) => { const y = cy - (t - 1) * 12 + i * 24; const L = 30 + n * 6; return ok(cx - 45, y, cx - 45 - Math.min(200, L), y, "g-ok-d") + yazi(cx - 55 - Math.min(200, L), y - 6, n + " N", { a: "start", k: 1 }); });
      ciz(ust, n => ok(cx, cy - 35, cx, cy - 35 - Math.min(70, 25 + n * 3), "g-ok-a") + yazi(cx + 30, cy - 70, n + " N", { k: 1 }));
      ciz(alt, n => ok(cx, cy + 35, cx, cy + 35 + Math.min(70, 25 + n * 3), "g-ok-d") + yazi(cx + 30, cy + 80, n + " N", { k: 1 }));
      return svg(W, H, ic, "cisme etki eden kuvvetler");
    },
    /* Yol üzerinde hareket eden araç ve işaretli noktalar (sürat soruları) */
    yol(isaretler, { arac = "🚲" } = {}) {
      const W = 600, H = 100, sol = 30, sag = 30, mx = isaretler[isaretler.length - 1].x;
      const xk = v => sol + (W - sol - sag) * v / mx;
      let ic = `<line class="g-cizgi" x1="${sol}" y1="60" x2="${W - sag}" y2="60" stroke-width="3"/>` + `<text x="${sol}" y="45" font-size="26" text-anchor="middle">${arac}</text>`;
      isaretler.forEach(m => { ic += `<line class="g-cizgi" x1="${xk(m.x)}" y1="52" x2="${xk(m.x)}" y2="68" stroke-width="2"/>` + yazi(xk(m.x), 86, m.ad, { k: 1 }); });
      return svg(W, H, ic, "yol ve araç");
    },
    /* HTML tablo görseli */
    tablo(basliklar, satirlar) {
      return `<div class="tablo gorsel-tablo"><table><thead><tr>${basliklar.map(b => `<th>${b}</th>`).join("")}</tr></thead><tbody>${satirlar.map(s => `<tr>${s.map(h => `<td>${h}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    },
    /* Ampul–pil devresi: piller, ampuller, anahtar açık/kapalı, isteğe bağlı araya giren malzeme */
    devre({ pil = 1, ampul = 1, acik = false, malzeme = null }) {
      const W = 520, H = 210; let ic = `<rect class="g-cizgi" x="40" y="40" width="440" height="130" rx="8" fill="none" stroke-width="3"/>`;
      for (let i = 0; i < pil; i++) { const x = 70 + i * 50; ic += `<rect class="g-bos" x="${x - 4}" y="155" width="44" height="30"/><rect class="g-b g-cizgi" x="${x}" y="158" width="34" height="24" rx="3"/>` + yazi(x + 17, 175, "+ −", { k: 1 }); }
      for (let i = 0; i < ampul; i++) { const x = 230 + i * 70; ic += `<rect class="g-bos" x="${x - 22}" y="20" width="44" height="40"/><circle class="g-b g-cizgi" cx="${x}" cy="34" r="18" stroke-width="2"/>` + yazi(x, 39, "💡", { k: 1 }); }
      ic += `<rect class="g-bos" x="410" y="150" width="60" height="40"/>` + (acik ? `<line class="g-cizgi" x1="410" y1="170" x2="455" y2="148" stroke-width="3"/>` : `<line class="g-cizgi" x1="410" y1="170" x2="470" y2="170" stroke-width="3"/>`) + yazi(440, 200, acik ? "anahtar açık" : "anahtar kapalı", { k: 1 });
      if (malzeme) ic += `<rect class="g-bos" x="20" y="80" width="40" height="50"/><rect class="g-c g-cizgi" x="26" y="85" width="28" height="40" rx="4"/>` + yazi(90, 110, malzeme, { a: "start", k: 1 });
      return svg(W, H, ic, "elektrik devresi");
    },
  };

  /* ============================ DERS KAYDI ============================ */
  const DERS_LISTESI = [];
  function DERS_EKLE(ders) { ders.konular = ders.konular || []; DERS_LISTESI.push(ders); return ders; }
  /* Bir derse konu ekler (ders dosyası önce DERS_EKLE ile kaydedilmiş olmalı). */
  function KONU_EKLE(dersId, konu) { DERS_LISTESI.find(d => d.id === dersId).konular.push(konu); return konu; }

  window.OGR = { R, sec, karistir, od, bolenler, asalMi, ebob, ekok, sade, kesir, asalCarpan, ek, us, ustlu, S, Q, G };
  window.DERS_LISTESI = DERS_LISTESI;
  window.DERS_EKLE = DERS_EKLE;
  window.KONU_EKLE = KONU_EKLE;
  /* Var olan bir kazanıma yeni soru üreteçleri ekler (ek soru dosyaları için). */
  window.SORU_EKLE = function (kazId, ...uretecler) {
    for (const d of DERS_LISTESI) for (const k of d.konular) if (k.kazanimlar.some(z => z.id === kazId)) { (k.uret[kazId] = k.uret[kazId] || []).push(...uretecler); return; }
    throw new Error("Kazanım bulunamadı: " + kazId);
  };
})();
