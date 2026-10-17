/* PDF deneme ayrıştırıcı: soru kitapçığının ve cevap anahtarının METİN katmanından
 * dersleri, soru sayılarını, soruların hangi sayfada olduğunu ve doğru cevapları çıkarır.
 * Girdi: sayfalar = [{ w, h, items: [{ s: metin, x, y }] }]  (y yukarıdan aşağı artar)
 * Tarayıcıda pdf.js ile, testlerde Node ile aynı biçimde üretilir. Ağa bağlanmaz, hiçbir şey göndermez. */
(function (kok) {
  "use strict";
  const BUYUK = s => s.replace(/i/g, "İ").replace(/ı/g, "I").toUpperCase();
  const sade = s => BUYUK(s).replace(/[^A-ZÇĞİÖŞÜ0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  // Ders adlarını eşleştirmek için anahtar: ilk sözcüğün ilk 3 harfi (TÜRKÇE/TÜRK DİLİ → TÜR, FEN B./FEN BİLİMLERİ → FEN …)
  const dersAnahtar = ad => { const s = sade(ad).replace(/^TEMEL /, ""); return s.slice(0, 3); };
  const UYGULAMA_DERSI = { "TÜR": "tr", "MAT": "mat", "FEN": "fen", "İNG": "en" };
  const yakin = (a, b, t) => Math.abs(a - b) <= t;

  /* Aynı satırdaki parçaları birleştirir (y farkı ≤ 3) */
  function satirlar(items) {
    const l = items.slice().sort((a, b) => a.y - b.y || a.x - b.x), sonuc = [];
    for (const t of l) {
      const s = sonuc.find(r => yakin(r.y, t.y, 3));
      if (s) s.parcalar.push(t); else sonuc.push({ y: t.y, parcalar: [t] });
    }
    sonuc.forEach(r => { r.parcalar.sort((a, b) => a.x - b.x); r.metin = r.parcalar.map(p => p.s).join(" "); });
    return sonuc;
  }

  /* ---------------- Cevap anahtarı ---------------- */
  const BASLIK_DISI = /S[IİıI] ?N[IİıI] ?F|K[İI]TAP|CEVAP|ANAHTAR|DENEME|OTURUM|YETERL|\(\d{4}\)|^\W*$/;
  function anahtarCoz(sayfalar) {
    const bloklar = [];
    sayfalar.forEach((p, si) => {
      const it = p.items.map(t => ({ ...t, s: t.s.trim() })).filter(t => t.s);
      // 1) numara–harf çiftleri: "12." ve hemen sağındaki tek harf (ya da "12. C" tek parça)
      const ciftler = [];
      for (const t of it) {
        let m = t.s.match(/^(\d{1,3})\s*[.)-]\s*([A-E])$/);
        if (m) { ciftler.push({ no: +m[1], h: m[2], x: t.x + (t.w || t.s.length * 5) / 2, y: t.y }); continue; }
        m = t.s.match(/^(\d{1,3})\s*[.)-]$/);
        if (!m) continue;
        const harf = it.filter(u => /^[A-E]$/.test(u.s) && yakin(u.y, t.y, 3) && u.x > t.x && u.x - t.x < 30).sort((a, b) => a.x - b.x)[0];
        if (harf) ciftler.push({ no: +m[1], h: harf.s, x: (t.x + harf.x + (harf.w || 6)) / 2, y: t.y });
      }
      if (!ciftler.length) return;
      // 2) ders başlık satırları: aynı y'de en az iki büyük harfli ad
      const adaylar = it.filter(t => /[A-ZÇĞİÖŞÜ]{2,}/.test(t.s) && BUYUK(t.s) === t.s && !BASLIK_DISI.test(t.s) && !/^[A-E]$/.test(t.s) && !/^\d/.test(t.s));
      const basliklar = [];
      for (const r of satirlar(adaylar)) {
        if (r.parcalar.length < 2) continue;
        // alt satırdaki "TESTİ" gibi devamları birleştir
        r.parcalar.forEach(b => {
          const alt = adaylar.find(u => u !== b && u.y > b.y && u.y - b.y <= 14 && yakin(u.x + u.s.length * 2.5, b.x + b.s.length * 2.5, 30) && /^TEST/.test(u.s));
          const w = Math.max(b.w || b.s.length * 6, alt ? (alt.x + (alt.w || alt.s.length * 6)) - b.x : 0);
          basliklar.push({ ad: b.s.replace(/\s+TEST[İI]$/, ""), x: b.x, y: b.y, w, altY: alt ? alt.y : b.y });
        });
      }
      if (!basliklar.length) return;
      // 3) her çift, üstündeki en yakın başlık satırının, solundaki en yakın başlığına aittir
      const satirY = [...new Set(basliklar.map(b => b.y))].sort((a, b) => a - b);
      const grup = new Map();
      for (const c of ciftler) {
        const ustSatirlar = satirY.filter(y => y < c.y);
        if (!ustSatirlar.length) continue;
        // aynı yükseklikte yan yana iki blok olabilir: önce x'e göre uygun başlıkları süz
        let secilen = null;
        for (let k = ustSatirlar.length - 1; k >= 0 && !secilen; k--) {
          // en yakın başlık ortası (başlıklar kendi sütunlarının üstünde ortalanır)
          const sat = basliklar.filter(b => b.y === ustSatirlar[k] && b.x <= c.x + 40).sort((a, b) => Math.abs(a.x + a.w / 2 - c.x) - Math.abs(b.x + b.w / 2 - c.x));
          if (sat.length) secilen = sat[0];
        }
        if (!secilen) continue;
        if (!grup.has(secilen)) grup.set(secilen, []);
        grup.get(secilen).push(c);
      }
      // 4) başlıkları bloklara ayır: aynı satır + yakın x aralığı (bloklar arasında boşluk)
      const satirBloklari = {};
      for (const b of basliklar) { if (!grup.has(b)) continue; (satirBloklari[b.y] = satirBloklari[b.y] || []).push(b); }
      for (const [y, bs] of Object.entries(satirBloklari)) {
        bs.sort((a, b) => a.x - b.x);
        // aynı satırda ders adı tekrar ederse yeni blok başlar
        const parcalar = [[]];
        for (const b of bs) { const son = parcalar[parcalar.length - 1]; if (son.some(o => dersAnahtar(o.ad) === dersAnahtar(b.ad))) parcalar.push([b]); else son.push(b); }
        for (const pb of parcalar) {
          const x1 = Math.min(...pb.map(b => b.x)) - 40, x2 = Math.max(...pb.map(b => b.x)) + 160;
          // blok başlığı: başlık satırının üstündeki 60 birimlik alandaki yazılar
          const ust = it.filter(t => t.y < +y && t.y >= +y - 60 && t.x >= x1 - 140 && t.x <= x2).sort((a, b) => a.y - b.y || a.x - b.x).map(t => t.s).join(" ");
          const sinif = (ust.match(/(\d{1,2})\s*\.?\s*S\s*[IİıI]\s*N\s*[IİıI]\s*F/i) || [])[1];
          const kit = (ust.match(/\b([A-D])\s+K[İI]TAP[ÇC]/i) || [])[1];
          const ek = /SÖZEL/i.test(ust) ? "sözel" : /SAYISAL/i.test(ust) ? "sayısal" : "";
          bloklar.push({
            sayfa: si + 1, baslik: ust.replace(/\s+/g, " ").trim(), sinif: sinif ? +sinif : null, kitapcik: kit ? kit.toUpperCase() : null, ek,
            dersler: pb.map(b => { const c = grup.get(b).sort((a, b2) => a.no - b2.no); const cevap = {}; c.forEach(x => { cevap[x.no] = x.h; }); return { ad: b.ad, anahtar: dersAnahtar(b.ad), cevap, n: c.length ? Math.max(...c.map(x => x.no)) : 0 }; }),
          });
        }
      }
    });
    return bloklar;
  }

  /* ---------------- Soru kitapçığı ---------------- */
  function kitapcikCoz(sayfalar) {
    const sonuc = { sinif: null, kitapcik: null, sureDk: null, dersler: [], harita: {} };
    const tumu = sayfalar.flatMap((p, i) => p.items.map(t => ({ ...t, s: t.s.trim(), sayfa: i + 1 }))).filter(t => t.s);
    // sınıf: sayfa başlıklarındaki "6. SINIF"
    const sm = {}; tumu.forEach(t => { const m = t.s.match(/^(\d{1,2})\s*\.?\s*S\s*[IİıI]\s*N\s*[IİıI]\s*F/i); if (m) sm[m[1]] = (sm[m[1]] || 0) + 1; });
    const enCok = Object.entries(sm).sort((a, b) => b[1] - a[1])[0]; if (enCok) sonuc.sinif = +enCok[0];
    // kitapçık türü: "KİTAPÇIK TÜRÜ" yazısının altındaki tek harf; yoksa sayfa üstündeki tek harf
    const kt = tumu.find(t => /K[İI]TAP[ÇC]IK\s*T[ÜU]R[ÜU]/i.test(t.s));
    if (kt) { const h = tumu.filter(t => t.sayfa === kt.sayfa && /^[A-D]$/.test(t.s) && t.y > kt.y && t.y - kt.y < 120 && Math.abs(t.x - kt.x) < 120).sort((a, b) => a.y - b.y)[0]; if (h) sonuc.kitapcik = h.s; }
    if (!sonuc.kitapcik) { const ust = {}; tumu.filter(t => /^[A-D]$/.test(t.s) && t.y < 70).forEach(t => { ust[t.s] = (ust[t.s] || 0) + 1; }); const e = Object.entries(ust).sort((a, b) => b[1] - a[1])[0]; if (e && e[1] >= 3) sonuc.kitapcik = e[0]; }
    // süre
    const sr = tumu.find(t => /S[İI]NAV\s*S[ÜU]RES[İI]/i.test(t.s));
    if (sr) { const n = tumu.filter(t => t.sayfa === sr.sayfa && yakin(t.y, sr.y, 4) && t.x > sr.x && /^\d{2,3}$/.test(t.s)).sort((a, b) => a.x - b.x)[0]; if (n) sonuc.sureDk = +n.s; }
    // kapaktaki soru sayıları: "TÜRKÇE .... 15"
    const kapakSayi = {};
    const ilkTest = tumu.find(t => /TEST[İI](?![A-ZÇĞİÖŞÜ])/.test(BUYUK(t.s)) && !/B[İI]TT[İI]/.test(BUYUK(t.s)));
    const kapakSon = ilkTest ? ilkTest.sayfa : 2;
    tumu.filter(t => t.sayfa < kapakSon && /^[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ .]{2,}$/.test(t.s)).forEach(t => {
      const n = tumu.filter(u => u.sayfa === t.sayfa && yakin(u.y, t.y, 3) && u.x > t.x && /^\d{1,3}$/.test(u.s)).sort((a, b) => a.x - b.x)[0];
      if (n && !/SÜRE|SURE/.test(t.s)) kapakSayi[dersAnahtar(t.s)] = { ad: t.s, n: +n.s };
    });
    // test başlıkları ve soru numaralarının sayfaları
    let aktif = null, beklenen = 1;
    sayfalar.forEach((p, i) => {
      const it = p.items.map(t => ({ ...t, s: t.s.trim() })).filter(t => t.s);
      const basliklar = it.filter(t => /TEST[İI](?![A-ZÇĞİÖŞÜ])/.test(BUYUK(t.s)) && !/B[İI]TT[İI]/.test(BUYUK(t.s)) && t.y < p.h * 0.3);
      // soru numaraları: sayfanın iki sütununda, sütunun en solundaki "N." yazıları
      const nolar = it.filter(t => /^\d{1,3}\.$/.test(t.s) && t.y > 60 && t.y < p.h - 60);
      const yari = p.w / 2;
      const sutunSol = [0, 1].map(k => { const l = nolar.filter(t => (t.x < yari) === (k === 0)); return l.length ? Math.min(...l.map(t => t.x)) : null; });
      const baslikY = basliklar.length ? Math.min(...basliklar.map(b => b.y)) : null;
      const sirali = nolar.filter(t => { const k = t.x < yari ? 0 : 1; return sutunSol[k] != null && t.x - sutunSol[k] <= 8; })
        .sort((a, b) => ((a.x < yari ? 0 : 1) - (b.x < yari ? 0 : 1)) || a.y - b.y);
      const yeniDers = ad => { const temiz = ad.replace(/\s*TEST[İI].*$/i, "").trim(); const a = dersAnahtar(temiz); aktif = sonuc.dersler.find(d => d.anahtar === a); if (!aktif) { aktif = { ad: temiz, anahtar: a, n: 0, ilkSayfa: i + 1 }; sonuc.dersler.push(aktif); sonuc.harita[a] = {}; } beklenen = 1; };
      if (basliklar.length && baslikY != null) yeniDers(basliklar.sort((a, b) => a.y - b.y)[0].s);
      for (const t of sirali) {
        if (!aktif) break;
        const no = +t.s.replace(".", "");
        if (no === beklenen) { sonuc.harita[aktif.anahtar][no] = i + 1; aktif.n = no; beklenen++; }
      }
    });
    // kapakta yazan soru sayısı, bulunan numaradan büyükse onu kullan (kaçan numara olabilir)
    sonuc.dersler.forEach(d => { const k = kapakSayi[d.anahtar]; if (k && k.n > d.n) d.n = k.n; if (k) d.kapakAd = k.ad; d.uygulamaDersi = UYGULAMA_DERSI[d.anahtar] || null; });
    if (!sonuc.dersler.length) Object.values(kapakSayi).forEach(k => sonuc.dersler.push({ ad: k.ad, anahtar: dersAnahtar(k.ad), n: k.n, uygulamaDersi: UYGULAMA_DERSI[dersAnahtar(k.ad)] || null }));
    return sonuc;
  }

  /* Kitapçık + anahtar bloklarını eşleştirir: aynı sınıf ve kitapçık türü, ders adları uyumlu */
  function eslestir(kit, bloklar) {
    const puan = b => (kit.sinif && b.sinif === kit.sinif ? 4 : 0) + (kit.kitapcik && b.kitapcik === kit.kitapcik ? 4 : 0)
      + b.dersler.filter(d => kit.dersler.some(k => k.anahtar === d.anahtar)).length;
    const sirali = bloklar.slice().sort((a, b) => puan(b) - puan(a));
    // aynı sınıf/kitapçık için birden çok blok olabilir (8. sınıf sözel + sayısal): dersleri birleştir
    const en = sirali[0];
    if (!en) return { dersler: kit.dersler.map(d => ({ ...d, cevap: {} })), blok: null };
    const ayni = sirali.filter(b => b.sinif === en.sinif && b.kitapcik === en.kitapcik);
    const cevaplar = {};
    ayni.forEach(b => b.dersler.forEach(d => { if (!cevaplar[d.anahtar]) cevaplar[d.anahtar] = d; }));
    const dersler = (kit.dersler.length ? kit.dersler : Object.values(cevaplar)).map(d => {
      const c = cevaplar[d.anahtar];
      return { ad: d.kapakAd || d.ad, anahtar: d.anahtar, n: d.n || (c ? c.n : 0), cevap: c ? c.cevap : {}, uygulamaDersi: UYGULAMA_DERSI[d.anahtar] || null };
    });
    return { dersler, blok: { sinif: en.sinif, kitapcik: en.kitapcik, baslik: en.baslik, guven: puan(en) } };
  }

  /* Elle girilen "ABCDA..." ya da "1-A 2-C" metnini cevap nesnesine çevirir */
  function cevapMetni(metin, n) {
    const t = BUYUK(String(metin || ""));
    const cevap = {};
    const ciftler = [...t.matchAll(/(\d{1,3})\s*[.)\-: ]\s*([A-E])/g)];
    if (ciftler.length) ciftler.forEach(m => { cevap[+m[1]] = m[2]; });
    else [...t.replace(/[^A-E]/g, "")].forEach((h, i) => { cevap[i + 1] = h; });
    if (n) Object.keys(cevap).forEach(k => { if (+k > n) delete cevap[k]; });
    return cevap;
  }
  const cevapYazi = (cevap, n) => Array.from({ length: n }, (_, i) => cevap[i + 1] || "-").join("");

  const api = { anahtarCoz, kitapcikCoz, eslestir, cevapMetni, cevapYazi, dersAnahtar, UYGULAMA_DERSI };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  kok.PDF_AYRISTIR = api;
})(typeof window !== "undefined" ? window : globalThis);
