// Bursluluk, yazılı hazırlık setleri, BİLSEM ve Matematik Macera Akademisi testi (Playwright).
// Kullanım: node araclar/ozel_test.js <ekran_goruntusu_klasoru>
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "web"), CIKTI = process.argv[2] || "/tmp";
const TUR = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json" };
const sunucu = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(KOK, u === "/" ? "index.html" : u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": TUR[path.extname(f)] || "text/plain" }); r.end(d); } }); });
(async () => {
  await new Promise(c => sunucu.listen(8771, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 800, height: 1280 }, hasTouch: true });
  const p = await ctx.newPage(); const hatalar = [];
  p.on("pageerror", e => hatalar.push("pageerror: " + e.message));
  p.on("console", m => { if (m.type() === "error" && !/youtube|ERR_|net::|Failed to load resource/.test(m.text())) hatalar.push("console: " + m.text()); });
  const foto = async ad => p.screenshot({ path: path.join(CIKTI, ad + ".png"), fullPage: false });
  const tikla = async s => { await p.click(s); await p.waitForTimeout(60); };
  const git = async h => { await p.goto("http://localhost:8771/index.html" + h); await p.waitForTimeout(150); };
  await git("");
  await p.fill("#kAd", "Elif"); await tikla("#kTamam");
  const sinavCoz = async () => {
    const n = await p.evaluate(() => TEST_DURUMU().plan.length);
    for (let i = 0; i < n; i++) { const d = await p.evaluate(() => TEST_DURUMU().soru.q.secenekler.findIndex(x => x.dogru)); if (i % 7 !== 6) await tikla(`[data-s="${i % 3 ? d : (d + 1) % 4}"]`); await tikla("#sonrakiB"); }
    return n;
  };

  // --- Bursluluk ---
  await git("#/bursluluk"); await foto("o1_bursluluk");
  if ((await p.$$('[data-test="bursluluk"]')).length !== 15) hatalar.push("bursluluk deneme sayısı 15 değil");
  await tikla('[data-test="bursluluk"][data-no="3"]');
  const ilk = await p.evaluate(() => TEST_DURUMU().plan.map(x => x.hazir.soru).join("|"));
  const n = await sinavCoz(); await foto("o2_bursluluk_sonuc");
  if (n !== 80) hatalar.push("bursluluk soru sayısı 80 değil: " + n);
  const bt = await p.evaluate(() => DEPO.liste("test").filter(t => t.tur === "bursluluk").pop());
  const dg = bt && bt.dagilim || {}, say = d => dg[d] ? dg[d].d + dg[d].y + dg[d].b : 0;
  if (!bt || bt.no !== 3 || say("tr") !== 20 || say("mat") !== 20 || say("fen") !== 20 || say("sos") + say("din") !== 20) hatalar.push("bursluluk dağılımı hatalı: " + JSON.stringify(dg));
  if (!(await p.textContent("main")).includes("Tahmini bursluluk puanı")) hatalar.push("bursluluk puanı gösterilmedi");
  await git("#/bursluluk"); await tikla('[data-test="bursluluk"][data-no="3"]');
  const ikinci = await p.evaluate(() => TEST_DURUMU().plan.map(x => x.hazir.soru).join("|"));
  if (ilk !== ikinci) hatalar.push("aynı numaralı bursluluk denemesi farklı sorular verdi");
  await git("#/bursluluk"); await tikla('[data-test="bursluluk"][data-no="4"]');
  if (ilk === await p.evaluate(() => TEST_DURUMU().plan.map(x => x.hazir.soru).join("|"))) hatalar.push("farklı bursluluk denemeleri aynı");

  // --- Yazılı hazırlık setleri ---
  for (const ders of ["mat", "tr", "fen", "en", "sos", "din"]) {
    await git(`#/yazili/${ders}/d1y1`);
    const k = await p.$$(`[data-test="yaziliSet"][data-ders="${ders}"]`); if (k.length !== 6) { hatalar.push(ders + ": yazılı set sayısı 6 değil: " + k.length); continue; }
    if (ders === "mat") await foto("o3_yazili_set");
    await tikla(`[data-test="yaziliSet"][data-ders="${ders}"][data-no="2"]`);
    const sn = await sinavCoz();
    const t = await p.evaluate(() => DEPO.liste("test").filter(t => t.tur === "yaziliSet").pop());
    if (sn !== 20 || !t || t.no !== 2 || t.ders !== ders || t.yazili !== "d1y1") hatalar.push(ders + ": yazılı set kaydı hatalı");
  }

  // --- BİLSEM ---
  await git("#/bilsem"); await foto("o4_bilsem");
  const bs = await p.$$('[data-test="bilsem"]');
  if (bs.length < 5) hatalar.push("BİLSEM bölüm sayısı az: " + bs.length);
  else {
    await bs[0].click(); await p.waitForTimeout(100); await foto("o5_bilsem_soru");
    for (let i = 0; i < 10 && await p.$("[data-s]"); i++) {
      const d = await p.evaluate(() => TEST_DURUMU().soru.q.secenekler.findIndex(x => x.dogru));
      if (i === 1) { await tikla(`[data-s="${(d + 1) % 4}"]`); await foto("o6_bilsem_yanlis"); }
      await tikla(`[data-s="${d}"]`); if (await p.$("#devamB")) await tikla("#devamB");
    }
    await foto("o7_bilsem_sonuc");
    const s = await p.evaluate(() => DEPO.liste("soru").filter(x => x.mod === "bilsem").length);
    if (s < 10) hatalar.push("BİLSEM soruları kaydedilmedi: " + s);
  }
  // Veli paneli BİLSEM/bursluluk kayıtlarıyla açılıyor mu
  await git("#/veli"); for (const x of ["1", "2", "3", "4", "Tamam"]) await tikla(`[data-p="${x}"]`);
  for (const s of ["ozet", "gunluk", "denemeler", "konular", "rapor"]) { await git("#/veli/" + s); await p.waitForTimeout(100); }
  await foto("o8_veli");

  // --- Matematik Macera Akademisi ---
  if (await p.evaluate(() => !!window.MACERA)) {
    await git("#/macera"); await foto("o9_macera_menu");
    await git("#/macera/harita"); await foto("o10_harita");
    await git("#/macera/bolge/sayilar"); await foto("o11_bolge");
    for (const oyun of ["robot", "hazine", "atolye"]) { await git("#/macera/oyun/" + oyun); await p.waitForTimeout(150); await foto("o12_" + oyun);
      const r = await p.evaluate(o => window.MACERA.testOyna(o), oyun); if (!r || !r.ok) hatalar.push("mini oyun çalışmadı: " + oyun + " " + JSON.stringify(r)); }
    await git("#/macera/kesir"); await foto("o13_kesir");
    const k = await p.evaluate(() => window.MACERA.testKesir()); if (!k || !k.ok) hatalar.push("kesir akışı: " + JSON.stringify(k));
    await git("#/macera/gorevler"); await foto("o14_gorev");
    await git("#/macera/basarilar"); await foto("o15_basari");
    const d = await p.evaluate(() => window.MACERA.durum()); if (!d || !(d.yildiz > 0)) hatalar.push("yıldız kazanılmadı: " + JSON.stringify(d));
  }
  console.log("HATALAR:", hatalar.length ? hatalar : "yok");
  await b.close(); sunucu.close();
})();
