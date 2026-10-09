// Görselli soruların önizlemesi: her kazanımdan görselli bir soru üretip tek sayfada çizer ve ekran görüntüsü alır.
// Kullanım: node araclar/gorsel_onizleme.js <çıktı_klasörü> [ders] [koyu]
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "web"), CIKTI = process.argv[2] || "/tmp", DERS = process.argv[3] || "", KOYU = process.argv[4] === "koyu";
const sunucu = http.createServer((q, r) => { const f = path.join(KOK, q.url.split("?")[0] === "/" ? "index.html" : decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": f.endsWith(".js") ? "application/javascript" : "text/html" }); r.end(d); } }); });
(async () => {
  await new Promise(c => sunucu.listen(8766, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await b.newPage({ viewport: { width: 900, height: 1200 }, colorScheme: KOYU ? "dark" : "light" });
  await p.goto("http://localhost:8766/index.html"); await p.waitForSelector("#kAd");
  await p.evaluate(ders => {
    const html = [];
    for (const kz of Object.keys(ICERIK.KAZANIM)) {
      if (ders && ICERIK.KAZANIM[kz].ders !== ders) continue;
      for (let i = 0; i < 40; i++) { const q = ICERIK.soruUret(kz, 1 + i % 3); if (q.gorsel) { html.push(`<section class="kart"><span class="etiket">${kz}</span><p class="soru-metin">${q.soru}</p><div class="gorsel">${q.gorsel}</div></section>`); break; } }
    }
    document.querySelector("#ana").innerHTML = html.join("");
  }, DERS);
  await p.screenshot({ path: path.join(CIKTI, `gorseller_${DERS || "hepsi"}${KOYU ? "_koyu" : ""}.png`), fullPage: true });
  await b.close(); sunucu.close();
})();
