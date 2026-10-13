// Taşma denetimi: sayfalarda kutusuna sığmayan yazı/öğe var mı? Kullanım: node araclar/tasma_test.js
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "web");
const TUR = { ".html": "text/html", ".js": "application/javascript", ".json": "application/json" };
const sunucu = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(KOK, u === "/" ? "index.html" : u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": TUR[path.extname(f)] || "application/octet-stream" }); r.end(d); } }); });
const SAYFALAR = ["", "ders/tr", "ders/en", "konu/carpan", "anlatim/carpan", "deneme", "tgsd", "pdf", "gelisim", "hatalar", "yazili/mat/d1y1", "oyun", "ing",
  ...["ozet", "dersler", "konu/carpan", "kazanim", "soru", "anlatim", "tekrar", "calisma", "yazili", "denemeler", "gunluk", "kayit", "icerik", "ayar"].map(x => "veli/" + x)];
(async () => {
  await new Promise(c => sunucu.listen(8773, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const sorunlar = [];
  for (const [w, h] of [[800, 1280], [1280, 800], [360, 740]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto("http://localhost:8773/index.html"); await p.fill("#kAd", "Elif Naz Yılmazoğlu"); await p.click("#kTamam");
    await p.evaluate(() => { const kz = Object.keys(ICERIK.KAZANIM); for (let i = 0; i < 150; i++) { const q = ICERIK.soruUret(kz[(i * 7) % kz.length], 2); DEPO.kaydet("soru", { ders: q.ders, konu: q.konu, tema: q.tema, kaz: q.kaz, duzey: q.duzey, zorluk: q.zorluk, mod: "alistirma", ilkDogru: i % 3 > 0, sonDogru: true, deneme: 1, ilkSure: 15000, soruNesnesi: q, sk: "x" + i, ilkHata: i % 3 ? null : "islem" }); } });
    await p.goto("http://localhost:8773/index.html#/veli"); for (const x of ["1", "2", "3", "4", "Tamam"]) { await p.click(`[data-p="${x}"]`); await p.waitForTimeout(80); }
    for (const s of SAYFALAR) {
      await p.goto("http://localhost:8773/index.html#/" + s); await p.waitForTimeout(250);
      const l = await p.evaluate(() => {
        const out = [];
        for (const e of document.querySelectorAll("main *")) {
          const cs = getComputedStyle(e); if (cs.display === "none" || e.closest("svg") || e.closest(".tablo") || e.closest("details:not([open]) > :not(summary)")) continue;
          if (["visible"].includes(cs.overflowX) && e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0 && !["svg", "canvas", "iframe"].includes(e.tagName.toLowerCase()) && e.children.length === 0)
            out.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " «" + (e.textContent || "").trim().slice(0, 40) + "» " + e.scrollWidth + ">" + e.clientWidth);
          const pr = e.parentElement; if (pr && pr !== document.body) { const r = e.getBoundingClientRect(), rp = pr.getBoundingClientRect(); const pcs = getComputedStyle(pr);
            if (r.width > 0 && r.right > rp.right + 2 && pcs.overflowX === "visible" && !e.closest(".tablo") && !e.closest(".sekmeler") && !e.closest(".ders-sec")) out.push("TAŞIYOR " + e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " «" + (e.textContent || "").trim().slice(0, 40) + "» " + Math.round(r.right - rp.right) + "px"); }
        }
        if (document.documentElement.scrollWidth > innerWidth + 2) out.push("SAYFA YATAY KAYIYOR " + document.documentElement.scrollWidth);
        return [...new Set(out)].slice(0, 12);
      });
      l.forEach(x => sorunlar.push(`${w}x${h} #/${s}: ${x}`));
    }
    await p.close();
  }
  await b.close(); sunucu.close();
  console.log(sorunlar.join("\n") || "taşma yok");
  console.log("HATALAR:", sorunlar.length ? sorunlar.length + " taşma" : "yok");
})();
