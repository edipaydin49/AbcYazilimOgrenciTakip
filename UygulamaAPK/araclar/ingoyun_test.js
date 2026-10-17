// İngilizce oyunları testi (Playwright): dört oyunu doğru ve yanlış cevaplarla oynar; sürükle-bırakı da dener.
// Kullanım: node araclar/ingoyun_test.js <ekran_goruntusu_klasoru>
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "web"), CIKTI = process.argv[2] || "/tmp";
const sunucu = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(KOK, u === "/" ? "index.html" : u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": f.endsWith(".js") ? "application/javascript" : "text/html" }); r.end(d); } }); });
(async () => {
  await new Promise(c => sunucu.listen(8768, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await b.newPage({ viewport: { width: 1000, height: 1300 }, hasTouch: true });
  const hatalar = [];
  p.on("pageerror", e => hatalar.push("pageerror: " + e.message));
  p.on("console", m => { if (m.type() === "error" && !/youtube|ERR_|Failed to load resource/.test(m.text())) hatalar.push("console: " + m.text()); });
  const foto = ad => p.screenshot({ path: path.join(CIKTI, "ing_" + ad + ".png") });
  const tikla = async s => { await p.click(s); await p.waitForTimeout(50); };
  const D = () => p.evaluate(() => { const d = INGOYUN.durum(); return JSON.parse(JSON.stringify(d)); });
  // Fare ile sürükle-bırak
  const surukle = async (kaynak, hedef) => { const a = await p.locator(kaynak).boundingBox(), h = await p.locator(hedef).boundingBox();
    await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down(); await p.mouse.move(a.x + 20, a.y + 20, { steps: 3 });
    await p.mouse.move(h.x + h.width / 2, h.y + h.height / 2, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(80); };
  await p.goto("http://localhost:8768/index.html"); await p.fill("#kAd", "Elif"); await tikla("#kTamam");
  await p.goto("http://localhost:8768/index.html#/ders/en"); await foto("0_ana");
  await p.goto("http://localhost:8768/index.html#/ing"); await foto("1_merkez");

  // 1) Downtown: ilk komut sürükle-bırak, diğerleri dokun-dokun; bir tanesi bilerek yanlış
  await p.goto("http://localhost:8768/index.html#/ing/downtown");
  for (let i = 0; i < 12; i++) {
    const d = await D(); if (d.i >= d.n) break;
    const k = d.komut;
    if (k.tur === "sifat") { const j = k.secenek.indexOf(k.s[2]); await tikla(`[data-j="${j}"]`); }
    else if (i === 0) { await surukle(`[data-bina="${k.bina}"]`, `[data-lot="${k.hedef}"]`); }
    else if (i === 1) { const bos = d.ızgara.map((x, h) => x ? null : h).filter(x => x != null && x !== k.hedef); await tikla(`[data-bina="${k.bina}"]`); await tikla(`[data-lot="${bos[0]}"]`); }
    else { await tikla(`[data-bina="${k.bina}"]`); await tikla(`[data-lot="${k.hedef}"]`); }
    if (i === 0) await foto("2_downtown");
    if (!(await p.$("#gDevam"))) { hatalar.push("downtown: cevap işlenmedi (komut " + i + ")"); break; }
    await tikla("#gDevam");
  }
  await foto("3_downtown_bitis");
  let o = await p.evaluate(() => DEPO.liste("oyun").filter(x => x.oyun === "downtown").pop());
  if (!o || o.dogru !== o.n - 1) hatalar.push("downtown sonucu beklenmedik: " + JSON.stringify(o));

  // 2) Roller coaster: hepsi doğru, biri süre dolsun diye beklenir
  await p.goto("http://localhost:8768/index.html#/ing/tren");
  for (let i = 0; i < 12; i++) {
    const d = await D(); const j = d.secenek.indexOf(d.liste[d.i][2]);
    if (i === 3) await p.waitForSelector("#gDevam", { timeout: 12000 }); else await tikla(`[data-j="${j}"]`);
    if (i === 1) await foto("4_tren");
    await tikla("#gDevam");
  }
  o = await p.evaluate(() => DEPO.liste("oyun").filter(x => x.oyun === "tren").pop());
  if (!o || o.dogru !== 11) hatalar.push("tren sonucu beklenmedik: " + JSON.stringify(o && { dogru: o.dogru, n: o.n }));

  // 3) Kahvaltı: müşteriye sürükleyerek ve dokunarak; bir müşteriye sevmediği yiyecek
  await p.goto("http://localhost:8768/index.html#/ing/kahvalti");
  for (let i = 0; i < 6; i++) {
    const d = await D(); const x = d.liste[d.i];
    if (x.tur === "diyalog") { const j = x.secenek.indexOf(x.q[1]); await tikla(`[data-j="${j}"]`); }
    else {
      for (const [n, y] of x.istek.entries()) { if (n === 0) await surukle(`[data-yemek="${y}"]`, "[data-tabak]"); else await tikla(`[data-yemek="${y}"]`); }
      if (i === 3) await tikla(`[data-yemek="${x.sevmez}"]`);
      if (i === 0) await foto("5_kahvalti");
      await tikla("#gServis");
      if (i === 3) await foto("6_kahvalti_mutsuz");
    }
    await tikla("#gDevam");
  }
  o = await p.evaluate(() => DEPO.liste("oyun").filter(x => x.oyun === "kahvalti").pop());
  if (!o || o.dogru !== 5) hatalar.push("kahvaltı sonucu beklenmedik: " + JSON.stringify(o && { dogru: o.dogru, n: o.n }));

  // 4) Gardırop: her grubun ilk giysisi; bir turda yanlış giysi
  await p.goto("http://localhost:8768/index.html#/ing/gardirop");
  for (let i = 0; i < 6; i++) {
    const d = await D(); const h = d.liste[d.i];
    for (const [n, grup] of h.gerek.entries()) { if (n === 0) await surukle(`[data-giysi="${grup[0]}"]`, "[data-karakter]"); else if (!(await p.evaluate(g => INGOYUN.durum().liste[INGOYUN.durum().i].giyilen.includes(g), grup[0]))) await tikla(`[data-giysi="${grup[0]}"]`); }
    if (i === 2) await tikla(`[data-giysi="${h.yasak[0]}"]`);
    if (i === 0) await foto("7_gardirop");
    await tikla("#gCik");
    if (i === 2) await foto("8_gardirop_titre");
    await tikla("#gDevam");
  }
  o = await p.evaluate(() => DEPO.liste("oyun").filter(x => x.oyun === "gardirop").pop());
  if (!o || o.dogru !== 5) hatalar.push("gardırop sonucu beklenmedik: " + JSON.stringify(o && { dogru: o.dogru, n: o.n }));
  await foto("9_gardirop_bitis");

  // Kelime kartları ve veli özeti
  const kartKonu = await p.evaluate(() => (ICERIK.KONULAR.find(k => k.sozluk) || {}).id);
  if (kartKonu) { await p.goto("http://localhost:8768/index.html#/ing/kart/" + kartKonu); await tikla("#kKart"); await foto("10_kart"); await tikla("#kSonra"); }
  else hatalar.push("sözlüklü konu yok");
  await p.goto("http://localhost:8768/index.html#/veli"); for (const x of ["1", "2", "3", "4", "Tamam"]) await tikla(`[data-p="${x}"]`);
  await p.goto("http://localhost:8768/index.html#/veli/ozet"); await foto("11_veli");
  const metin = await p.textContent("main"); if (!/İngilizce oyunları/.test(metin)) hatalar.push("veli özetinde İngilizce oyunları yok");
  console.log("HATALAR:", hatalar.length ? hatalar : "yok");
  await b.close(); sunucu.close();
})();
