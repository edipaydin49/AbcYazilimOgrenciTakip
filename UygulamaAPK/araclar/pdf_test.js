// PDF deneme testi: örnek kitapçık ve cevap anahtarını yükler, optik formla çözer, sonucu denetler.
// Kullanım: node araclar/pdf_test.js <ekran_klasoru> <kitapcik.pdf> <anahtar.pdf>
// PDF verilmezse araclar/ornek_pdf/ altında küçük bir deneme PDF'i üretip onu kullanır.
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "web"), CIKTI = process.argv[2] || "/tmp";
const TUR = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css" };
const sunucu = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(KOK, u === "/" ? "index.html" : u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": TUR[path.extname(f)] || "application/octet-stream" }); r.end(d); } }); });
(async () => {
  const [kitap, anahtar] = [process.argv[3], process.argv[4]];
  if (!kitap || !fs.existsSync(kitap)) { console.log("Kitapçık PDF'i verilmedi; test atlandı.\nHATALAR: yok"); return; }
  await new Promise(c => sunucu.listen(8771, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
  const p = await ctx.newPage(); const hatalar = [];
  p.on("pageerror", e => hatalar.push("pageerror: " + e.message));
  p.on("dialog", d => d.accept());
  const foto = ad => p.screenshot({ path: path.join(CIKTI, ad + ".png") });
  await p.goto("http://localhost:8771/index.html"); await p.fill("#kAd", "Elif"); await p.click("#kTamam");
  await p.goto("http://localhost:8771/index.html#/pdf"); await p.waitForTimeout(200); await foto("p1_liste");
  await p.goto("http://localhost:8771/index.html#/pdf/yeni"); await p.waitForTimeout(200);
  await p.setInputFiles("#pKitap", kitap);
  await p.waitForSelector("#pBaslik", { timeout: 120000 });
  if (anahtar) { await p.setInputFiles("#pAnahtar", anahtar); await p.waitForFunction(() => document.querySelector(".dCevap") && !/-/.test(document.querySelector(".dCevap").value), null, { timeout: 120000 }).catch(() => hatalar.push("anahtar okunamadı")); }
  await p.waitForTimeout(300); await foto("p2_onizleme");
  const cevaplar = await p.$$eval(".dCevap", l => l.map(x => x.value));
  console.log("Okunan cevaplar:", cevaplar.join(" | "));
  await p.click("#pKaydet"); await p.waitForTimeout(500);
  const pd = await p.evaluate(() => Object.values(DEPO.ayar.pdfDenemeler)[0]);
  if (!pd) { hatalar.push("PDF deneme kaydedilmedi"); }
  else {
    console.log("Kayıt:", pd.baslik, pd.sinif, pd.kitapcik, pd.sureDk, pd.dersler.map(d => d.ad + ":" + d.n + ":" + Object.keys(d.sayfa).length + " sayfa").join(", "));
    await p.goto("http://localhost:8771/index.html#/pdf/coz/" + pd.id); await p.waitForSelector("#pTuval"); await p.waitForTimeout(2500); await foto("p3_coz");
    // ilk dersin ilk 5 sorusunu doğru, sonraki 3'ü yanlış işaretle, kalanını boş bırak
    const d0 = pd.dersler[0];
    for (let no = 1; no <= 8; no++) { const dogru = d0.cevap[no]; const h = no <= 5 ? dogru : ["A", "B", "C", "D"].find(x => x !== dogru); await p.click(`#pForm .optik-harf[data-no="${no}"][data-h="${h}"]`); }
    await p.click('.optik-no[data-no="3"]'); await p.waitForTimeout(1200); await foto("p4_soru3");
    const sayfa = await p.textContent("#pSayfaNo"); if (d0.sayfa[3] && !sayfa.startsWith(d0.sayfa[3] + " ")) hatalar.push("3. soruya dokununca doğru sayfa açılmadı: " + sayfa);
    await p.click("#pBitir"); await p.waitForTimeout(800); await foto("p5_sonuc");
    const t = await p.evaluate(() => DEPO.liste("test").filter(x => x.tur === "pdfDeneme").pop());
    const top = pd.dersler.filter(d => d.dahil).reduce((a, d) => a + d.n, 0);
    if (!t || t.dogru !== 5 || t.yanlis !== 3 || t.bos !== top - 8 || Math.abs(t.net - 4) > 0.01) hatalar.push("sonuç hatalı: " + JSON.stringify(t && { d: t.dogru, y: t.yanlis, b: t.bos, net: t.net, n: t.n }));
    await p.goto("http://localhost:8771/index.html#/pdf/incele/" + t.testId); await p.waitForTimeout(2000); await foto("p6_incele");
    if ((await p.$$(".optik-harf.dogru")).length < 1) hatalar.push("incelemede doğru cevaplar işaretli değil");
    await p.setViewportSize({ width: 800, height: 1280 }); await p.goto("http://localhost:8771/index.html#/pdf/coz/" + pd.id); await p.waitForTimeout(2000); await foto("p7_dikey");
    await p.goto("http://localhost:8771/index.html#/deneme"); await p.waitForTimeout(200); const m = await p.textContent("main"); if (!/PDF/.test(m)) hatalar.push("deneme merkezinde PDF bölümü yok");
    await p.goto("http://localhost:8771/index.html#/veli"); for (const x of ["1", "2", "3", "4", "Tamam"]) await p.click(`[data-p="${x}"]`);
    await p.goto("http://localhost:8771/index.html#/veli/denemeler"); await p.waitForTimeout(300); if (!/PDF/.test(await p.textContent("main"))) hatalar.push("veli denemelerinde PDF sonucu yok");
    await p.goto("http://localhost:8771/index.html#/veli/gunluk"); await p.waitForTimeout(300); if (!/PDF deneme/.test(await p.textContent("main"))) hatalar.push("günlük ekranda PDF deneme yok");
  }
  await b.close(); sunucu.close();
  console.log("HATALAR:", hatalar.length ? hatalar : "yok");
})();
