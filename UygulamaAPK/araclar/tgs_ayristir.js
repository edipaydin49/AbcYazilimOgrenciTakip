/* Ortak yazılı / TGS hazırlık denemesi PDF'lerini (ReportLab ile üretilmiş, yazı katmanlı) uygulamaya hazırlar.
 * Her deneme için: dersler, soru sayıları, her sorunun sayfadaki yeri (kırpılarak gösterilir), ortak metinler,
 * doğru cevap, kazanım kodu ve adım adım çözümün her adımının yeri.
 *
 * Kullanım: node araclar/tgs_ayristir.js <pdf_klasoru> <pdfjs-dist/legacy/build/pdf.js yolu>
 * Çıktı: web/tgs/liste.js (deneme listesi), web/tgs/veri/<id>.json, web/tgs/pdf/<id>.pdf
 */
const fs = require("fs"), path = require("path");
const [, , KLASOR, PDFJS] = process.argv;
if (!KLASOR || !PDFJS) { console.error("Kullanım: node araclar/tgs_ayristir.js <pdf_klasoru> <pdf.js>"); process.exit(1); }
const pdfjs = require(path.resolve(PDFJS));
const CIKTI = path.join(__dirname, "..", "web", "tgs");
for (const k of ["veri", "pdf"]) fs.mkdirSync(path.join(CIKTI, k), { recursive: true });

const DERS = [
  [/^TÜRKÇE/, "tr", "Türkçe"], [/^MATEMAT/, "mat", "Matematik"], [/^FEN/, "fen", "Fen Bilimleri"],
  [/^SOSYAL/, "sos", "Sosyal Bilgiler"], [/^DIN/, "din", "Din Kültürü ve Ahlak Bilgisi"], [/^INGILIZCE/, "en", "İngilizce"],
];
const dersBul = s => { const u = s.normalize("NFC").toLocaleUpperCase("tr").replace(/I\u0307/g, "I").replace(/İ/g, "I"); const d = DERS.find(([r]) => r.test(u)); return d ? { kod: d[1], ad: d[2] } : null; };
const ALT = 800;   // sayfa altı (sayfa numarasından önce)

async function sayfalar(dosya) {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(dosya)), verbosity: 0 }).promise;
  const l = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const p = await doc.getPage(i), vp = p.getViewport({ scale: 1 }), tc = await p.getTextContent();
    l.push({ w: vp.width, h: vp.height, items: tc.items.filter(t => t.str.trim()).map(t => ({ s: t.str.trim(), x: t.transform[4], y: vp.height - t.transform[5], fs: Math.abs(t.transform[3]) })) });
  }
  return { doc, l };
}

function ayristir(S) {
  const sonuc = { dersler: [] };
  let cozumBas = S.findIndex(p => p.items.some(t => /^Soru \d+$/.test(t.s) || /^Soru \d+ · Doğru cevap/.test(t.s)));
  if (cozumBas < 0) throw new Error("Çözüm bölümü bulunamadı");
  // ---------- Sorular ----------
  let ders = null, ortak = null;
  const ref = [];   // bütün işaretler sırayla: {tur, sayfa, y, ...}
  for (let i = 1; i < cozumBas; i++) {
    const it = S[i].items.slice().sort((a, b) => a.y - b.y || a.x - b.x);
    for (const t of it) {
      if (t.y < 50 || t.y > ALT) continue;
      const m = t.s.match(/^(.+?) · (\d+) soru$/);
      if (m && dersBul(m[1])) { ref.push({ tur: "ders", sayfa: i + 1, y: t.y, d: dersBul(m[1]), n: +m[2] }); continue; }
      const o = t.s.match(/^(\d+)\s*(?:ve|-|–)\s*(\d+)\.\s*soruları/);
      if (o && t.x < 52) { ref.push({ tur: "ortak", sayfa: i + 1, y: t.y, a: +o[1], b: +o[2] }); continue; }
      const q = t.s.match(/^(\d{1,2})\.$/);
      if (q && t.x < 52) ref.push({ tur: "soru", sayfa: i + 1, y: t.y, no: +q[1] });
    }
  }
  const sinir = k => { // k. işaretin bölgesinin sonu: aynı sayfadaki sonraki işaret ya da sayfa altı
    const r = ref[k], s = ref[k + 1];
    return s && s.sayfa === r.sayfa ? s.y - 10 : ALT;
  };
  for (let k = 0; k < ref.length; k++) {
    const r = ref[k];
    if (r.tur === "ders") { ders = { ...r.d, n: r.n, sorular: [] }; sonuc.dersler.push(ders); ortak = null; continue; }
    if (r.tur === "ortak") { ortak = { a: r.a, b: r.b, bolge: [r.sayfa, Math.round(r.y - 12), Math.round(sinir(k))] }; continue; }
    if (!ders) continue;
    const bolge = [r.sayfa, Math.round(r.y - 12), Math.round(sinir(k))];
    ders.sorular.push({ no: r.no, bolge, ortak: ortak && r.no >= ortak.a && r.no <= ortak.b ? ortak.bolge : null });
    if (ortak && r.no >= ortak.b) ortak = null;
  }
  // ---------- Çözümler ----------
  const coz = [];   // {sayfa, y, ders?, no, cevap, kaz} ve adım satırları
  let cDers = null;
  for (let i = cozumBas; i < S.length; i++) {
    const it = S[i].items.slice().sort((a, b) => a.y - b.y || a.x - b.x);
    // satırları birleştir
    const satir = [];
    for (const t of it) { if (t.y < 50 || t.y > ALT) continue; const s = satir.find(x => Math.abs(x.y - t.y) < 2.5); if (s) s.p.push(t); else satir.push({ y: t.y, p: [t] }); }
    satir.forEach(s => { s.p.sort((a, b) => a.x - b.x); s.metin = s.p.map(t => t.s).join(" ").replace(/\s+/g, " "); s.x = s.p[0].x; });
    satir.sort((a, b) => a.y - b.y);
    for (const s of satir) {
      const dh = s.metin.match(/^■\s*(.+)$/);
      if (dh && dersBul(dh[1])) { cDers = dersBul(dh[1]).kod; coz.push({ tur: "ders", sayfa: i + 1, y: s.y, kod: cDers }); continue; }
      const sm = s.metin.match(/^Soru (\d+) · Doğru cevap: ([A-E])\s*\.?\s*\(([^)]*)\)/);
      if (sm) { coz.push({ tur: "soru", sayfa: i + 1, y: s.y, kod: cDers, no: +sm[1], cevap: sm[2], kaz: sm[3] }); continue; }
      const am = s.metin.match(/^(\d)\.\s/);
      if (am && s.x < 60) coz.push({ tur: "adim", sayfa: i + 1, y: s.y, n: +am[1] });
      else coz.push({ tur: "satir", sayfa: i + 1, y: s.y });
    }
  }
  // Her çözümün adımlarını bölgelere ayır (adımlar sayfa geçebilir)
  for (let k = 0; k < coz.length; k++) {
    const c = coz[k]; if (c.tur !== "soru") continue;
    const d = sonuc.dersler.find(x => x.kod === c.kod), q = d && d.sorular.find(x => x.no === c.no);
    if (!q) continue;
    q.cevap = c.cevap; q.kaz = c.kaz;
    const adimlar = []; let j = k + 1, son = c;
    for (; j < coz.length && coz[j].tur !== "soru" && coz[j].tur !== "ders"; j++) {
      const a = coz[j];
      if (a.tur === "adim") adimlar.push({ bas: a, satirlar: [a] });
      else if (adimlar.length) adimlar[adimlar.length - 1].satirlar.push(a);
      son = a;
    }
    const parcala = (bas, satirlar) => { // satırları sayfa sayfa bölgelere çevir
      const b = []; let cur = null;
      for (const s of satirlar) { if (!cur || cur[0] !== s.sayfa) { cur = [s.sayfa, Math.round(s.y - 11), Math.round(s.y + 5)]; b.push(cur); } else cur[2] = Math.round(s.y + 5); }
      return b;
    };
    q.baslik = [c.sayfa, Math.round(c.y - 12), Math.round(c.y + 6)];
    q.adimlar = adimlar.map(a => parcala(a.bas, a.satirlar));
    // üst simgeler (ör. 2³) bir sonraki satırın hemen üstünde durur: adım bölgeleri birbirine taşmasın
    for (let i = 0; i + 1 < q.adimlar.length; i++) {
      const son = q.adimlar[i][q.adimlar[i].length - 1], ilk = q.adimlar[i + 1][0];
      if (son[0] === ilk[0] && son[2] > ilk[1]) son[2] = ilk[1];
    }
    q.cozum = parcala(c, [c, ...adimlar.flatMap(a => a.satirlar)]);
  }
  return sonuc;
}

(async () => {
  const dosyalar = fs.readdirSync(KLASOR).filter(f => /\.pdf$/i.test(f)).sort();
  const liste = [];
  for (const f of dosyalar) {
    const m = f.match(/(\d)donem_(\d)yazili_deneme(\d+)/);
    if (!m) { console.log("atlandı:", f); continue; }
    const id = `d${m[1]}y${m[2]}_${m[3]}`;
    const { l } = await sayfalar(path.join(KLASOR, f));
    const s = ayristir(l);
    const eksik = s.dersler.flatMap(d => d.sorular.filter(q => !q.cevap || !q.adimlar || !q.adimlar.length).map(q => d.kod + q.no));
    const sayiHata = s.dersler.filter(d => d.sorular.length !== d.n).map(d => `${d.kod}: ${d.sorular.length}/${d.n}`);
    const kapak = l[0].items.map(t => t.s).join(" ");
    const veri = { id, ad: `${m[1]}. Dönem ${m[2]}. Ortak Yazılı Hazırlık – Deneme ${+m[3]}`, donem: +m[1], yazili: +m[2], no: +m[3], yaziliId: `d${m[1]}y${m[2]}`,
      sayfa: l.length, w: Math.round(l[0].w), h: Math.round(l[0].h), dersler: s.dersler.map(d => ({ kod: d.kod, ad: d.ad, n: d.n, sorular: d.sorular })) };
    fs.writeFileSync(path.join(CIKTI, "veri", id + ".json"), JSON.stringify(veri));
    fs.copyFileSync(path.join(KLASOR, f), path.join(CIKTI, "pdf", id + ".pdf"));
    liste.push({ id, ad: veri.ad, donem: veri.donem, yazili: veri.yazili, no: veri.no, yaziliId: veri.yaziliId, dersler: veri.dersler.map(d => [d.kod, d.n]) });
    console.log(id, veri.dersler.map(d => d.kod + ":" + d.sorular.length).join(" "), eksik.length ? "EKSİK " + eksik.join(",") : "", sayiHata.length ? "SAYI " + sayiHata.join(",") : "", /süre/i.test(kapak) ? "" : "");
  }
  liste.sort((a, b) => a.donem - b.donem || a.yazili - b.yazili || a.no - b.no);
  fs.writeFileSync(path.join(CIKTI, "liste.js"), "/* Ortak yazılı / TGS hazırlık denemeleri (araclar/tgs_ayristir.js ile üretildi). */\nwindow.TGS_LISTE = " + JSON.stringify(liste) + ";\n");
  console.log("Toplam", liste.length, "deneme");
})().catch(e => { console.error(e); process.exit(1); });
