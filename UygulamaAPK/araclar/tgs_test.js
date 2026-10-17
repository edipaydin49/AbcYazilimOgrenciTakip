// Ortak yazılı / TGS hazırlık denemeleri testi. Kullanım: node araclar/tgs_test.js <ekran_klasoru>
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "web"), CIKTI = process.argv[2] || "/tmp";
const TUR = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".pdf": "application/pdf" };
const sunucu = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(KOK, u === "/" ? "index.html" : u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": TUR[path.extname(f)] || "application/octet-stream" }); r.end(d); } }); });
(async () => {
  await new Promise(c => sunucu.listen(8772, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await (await b.newContext({ viewport: { width: 800, height: 1280 }, hasTouch: true })).newPage(); const hatalar = [];
  p.on("pageerror", e => hatalar.push("pageerror: " + e.message)); p.on("dialog", d => d.accept());
  const foto = ad => p.screenshot({ path: path.join(CIKTI, ad + ".png") });
  const T = "http://localhost:8772/index.html";
  await p.goto(T); await p.fill("#kAd", "Elif"); await p.click("#kTamam");
  await p.evaluate(() => { DEPO.ayar.obp = 90; DEPO.ayarKaydet(); });
  await p.goto(T + "#/tgsd"); await p.waitForTimeout(300); await foto("t1_liste");
  if ((await p.$$(".konu-satir")).length !== 45) hatalar.push("45 deneme listelenmedi");
  await p.goto(T + "#/tgsd/coz/d1y1_01"); await p.waitForSelector(".tgs-kirp", { timeout: 30000 }); await p.waitForTimeout(500); await foto("t2_soru");
  const v = await p.evaluate(() => TGSD.veriAl("d1y1_01"));
  // Türkçede ilk 10 soru: 6 doğru, 2 yanlış, 2 boş; kalan dersler boş
  const tr = v.dersler[0].sorular;
  for (let i = 0; i < 10; i++) {
    const q = tr[i];
    if (i < 6) await p.click(`.tgs-secenek [data-h="${q.cevap}"]`);
    else if (i < 8) await p.click(`.tgs-secenek [data-h="${["A", "B", "C", "D"].find(h => h !== q.cevap)}"]`);
    else await p.click("#tBos");
    await p.waitForTimeout(350);
  }
  await p.click('[data-td="1"]'); await p.waitForTimeout(400); await foto("t3_matematik");
  await p.click("#tBitir"); await p.waitForTimeout(800); await foto("t4_sonuc");
  const t = await p.evaluate(() => DEPO.liste("test").filter(x => x.tur === "tgsPdf").pop());
  if (!t || t.dogru !== 6 || t.yanlis !== 2 || t.n !== 75 || t.dagilim.tr.b !== 7) hatalar.push("sonuç hatalı: " + JSON.stringify(t && { d: t.dogru, y: t.yanlis, b: t.bos, n: t.n }));
  const beklenen = Math.round((100 + 400 * (4 * 5.33) / (4 * 45 + 30)) * 100) / 100;
  if (!t || Math.abs(t.puan - beklenen) > 0.01) hatalar.push("puan hatalı: " + (t && t.puan) + " beklenen " + beklenen);
  if (!t || !t.obpPuan) hatalar.push("OBP puanı yok");
  const sorular = await p.evaluate(id => DEPO.liste("soru").filter(s => s.testId === id).length, t.testId); if (sorular !== 75) hatalar.push("75 soru kaydı yok: " + sorular);
  // Yanlış bir soruyu aç: ipucu, adım, tam çözüm
  await p.click(".tgs-no.yanlis >> nth=0"); await p.waitForSelector("#sSoru .tgs-kirp"); await p.waitForTimeout(400);
  await p.click("#sIpucu"); await p.waitForTimeout(500); await foto("t5_ipucu");
  if ((await p.$$("#sCozum .tgs-kirp")).length < 1) hatalar.push("ipucu gösterilmedi");
  await p.click("#sTam"); await p.waitForTimeout(800); await foto("t6_tam_cozum");
  if (await p.isHidden("#sDogru")) hatalar.push("tam çözümden sonra doğru cevap görünmüyor");
  await p.click("#sYenidenAc"); await p.click('[data-yh="A"]'); await p.waitForTimeout(300);
  const yeniden = await p.evaluate(() => DEPO.liste("soru").filter(s => s.mod === "yenidenCoz").length); if (yeniden !== 1) hatalar.push("yeniden çözüm kaydedilmedi");
  // Ortak yanlış defteri: TGS yanlışları ve uygulama soruları birlikte
  await p.goto(T + "#/hatalar"); await p.waitForTimeout(400); await foto("t7_yanlis_defteri");
  const m = await p.textContent("main"); if (!/Yanlış defterim/.test(m) || !/Ortak Yazılı/.test(m)) hatalar.push("yanlış defterinde TGS soruları yok");
  await p.click("details[data-kayit] > summary >> nth=0"); await p.click("details[data-kayit] [data-git] >> nth=0"); await p.waitForTimeout(800); await foto("t8_defter_soru");
  if (!(await p.$(".tgs-kirp, .soru-metin"))) hatalar.push("defterden soru açılmadı");
  await b.close(); sunucu.close();
  console.log("HATALAR:", hatalar.length ? hatalar : "yok");
})();
