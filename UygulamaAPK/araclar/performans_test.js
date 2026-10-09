// Zayıf tablet benzetimi: işlemci 6 kat yavaş, ~6 aylık veri. Kullanım: node araclar/performans_test.js
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "web");
const sunucu = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(KOK, u === "/" ? "index.html" : u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": f.endsWith(".js") ? "application/javascript" : "text/html" }); r.end(d); } }); });
(async () => {
  await new Promise(c => sunucu.listen(8766, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await b.newPage({ viewport: { width: 800, height: 1280 } });
  const cdp = await p.context().newCDPSession(p);
  await p.goto("http://localhost:8766/index.html");
  await p.evaluate(() => { DEPO.ayar.ogrenciAdi = "Test"; DEPO.ayar.kurulum = true; DEPO.ayarKaydet(); });
  await p.evaluate(() => {
    const G = 86400000, simdi = Date.now(), kaz = Object.keys(ICERIK.KAZANIM);
    for (let g = 180; g >= 1; g--) {
      const t = simdi - g * G; const o = DEPO.kaydet("oturum", { bas: t, son: t, aktifSn: 1500, kesinti: 1 }); o.t = t;
      for (let k = 0; k < 28; k++) { const q = ICERIK.soruUret(kaz[(g * 7 + k) % kaz.length], 2); const s = DEPO.kaydet("soru", { konu: q.konu, kaz: q.kaz, duzey: q.duzey, zorluk: q.zorluk, mod: "alistirma", ilkDogru: Math.random() < .65, sonDogru: true, deneme: 1, ilkSure: 20000, soruNesnesi: q }); s.t = t + k; }
      if (g % 3 === 0) { const x = DEPO.kaydet("test", { tur: "konuSonu", konu: ICERIK.KONULAR[g % 14].id, n: 12, dogru: 8, sure: 600000 }); x.t = t; }
    }
  });
  await p.evaluate(() => DEPO.yazmaBitti());
  await p.reload(); await p.waitForTimeout(800);
  const n = await p.evaluate(() => DEPO.liste().length);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 6 });
  const olc = async (ad, hash, eylem) => { const t0 = Date.now(); await p.evaluate(h => { location.hash = h; }, hash); await p.waitForTimeout(50); if (eylem) await eylem(); await p.waitForSelector("main > *"); const ms = Date.now() - t0; console.log(ad.padEnd(28), ms + " ms"); return ms; };
  console.log("Olay sayısı:", n);
  const t0 = Date.now(); await p.reload(); await p.waitForSelector("main h1"); console.log("Açılış (veri yükleme dahil)".padEnd(28), (Date.now() - t0) + " ms");
  await olc("Ana sayfa", "#/x"); await olc("Ana sayfa", "#/");
  await olc("Konu sayfası", "#/konu/asal");
  await olc("Yazılı sayfası", "#/yazili/mat/d1y1");
  await p.evaluate(() => { location.hash = "#/konu/asal"; });
  const t1 = Date.now(); await p.click('[data-test="alistirma"]'); await p.waitForSelector(".sec"); console.log("Alıştırma başlatma".padEnd(28), (Date.now() - t1) + " ms");
  const t2 = Date.now(); const i = await p.evaluate(() => TEST_DURUMU().soru.q.secenekler.findIndex(x => x.dogru)); await p.click(`[data-s="${i}"]`); await p.click("#devamB"); await p.waitForSelector(".sec"); console.log("Cevap + sonraki soru".padEnd(28), (Date.now() - t2) + " ms");
  await olc("Gelişimim", "#/gelisim");
  await p.evaluate(() => { location.hash = "#/veli"; }); for (const x of ["1", "2", "3", "4", "Tamam"]) await p.click(`[data-p="${x}"]`);
  for (const s of ["ozet", "dersler", "konu/asal", "kazanim", "soru", "anlatim", "tekrar", "calisma", "yazili", "kayit", "icerik"]) await olc("Veli: " + s, "#/veli/" + s);
  await b.close(); sunucu.close();
})();
