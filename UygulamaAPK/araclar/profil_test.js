// Çoklu öğrenci (profil) testi: 6. ve 3. sınıf öğrencileri, ayrı veriler, veli panelinde isimle geçiş.
// Kullanım: node araclar/profil_test.js <ekran_goruntusu_klasoru>
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "web"), CIKTI = process.argv[2] || "/tmp";
const TUR = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json" };
const sunucu = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(KOK, u === "/" ? "index.html" : u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": TUR[path.extname(f)] || "text/plain" }); r.end(d); } }); });
(async () => {
  await new Promise(c => sunucu.listen(8773, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
  const p = await ctx.newPage(); const hatalar = [];
  p.on("pageerror", e => hatalar.push("pageerror: " + e.message));
  p.on("console", m => { if (m.type() === "error" && !/youtube|ERR_|net::|Failed to load resource/.test(m.text())) hatalar.push("console: " + m.text()); });
  const foto = async ad => p.screenshot({ path: path.join(CIKTI, ad + ".png") });
  const U = "http://localhost:8773/index.html";
  const hazir = async () => { await p.waitForFunction(() => window.DEPO && document.querySelector("#ana").children.length, null, { timeout: 15000 }); await p.waitForTimeout(400); };
  const soruCoz = async n => { for (let i = 0; i < n && await p.$("[data-s]"); i++) { const d = await p.evaluate(() => TEST_DURUMU().soru.q.secenekler.findIndex(x => x.dogru)); await p.click(`[data-s="${d}"]`); await p.waitForTimeout(60); if (await p.$("#devamB")) { await p.click("#devamB"); await p.waitForTimeout(60); } } };

  // 1) İlk kurulum: 6. sınıf öğrencisi (eski sürümdeki gibi)
  await p.goto(U); await p.waitForSelector("#kAd"); await foto("p1_kurulum");
  await p.fill("#kAd", "Elif"); await p.selectOption("#kSinif", "6"); await p.click("#kTamam"); await hazir();
  if (await p.evaluate(() => PROFIL.sinif()) !== 6) hatalar.push("ilk öğrenci 6. sınıf değil");
  if (await p.evaluate(() => PROFIL.dbAd()) !== "ogrenmeYolculugu") hatalar.push("1. öğrenci eski veritabanı adını kullanmıyor");
  await p.goto(U + "#/konu/carpan"); await hazir(); await p.click('[data-test="alistirma"]'); await soruCoz(4);
  const elifSoru = await p.evaluate(() => DEPO.liste("soru").length);
  if (!elifSoru) hatalar.push("Elif için soru kaydedilmedi");

  // 2) Veli paneli: tek şifre, 3. sınıf öğrencisi ekle
  await p.goto(U + "#/veli"); await hazir(); for (const x of ["1", "2", "3", "4", "Tamam"]) await p.click(`[data-p="${x}"]`);
  await p.goto(U + "#/veli/ayar/ogrenci"); await hazir(); await foto("p2_ogrenciler");
  await p.fill("#yoAd", "Ali"); await p.selectOption("#yoSinif", "3"); await p.click("#yoEkle"); await p.waitForTimeout(300);
  if (await p.evaluate(() => PROFIL.liste().length) !== 2) hatalar.push("ikinci öğrenci eklenmedi");
  if ((await p.$$(".ogrenci-cip[data-ogrenci]")).length !== 2) hatalar.push("veli panelinde 2 isim görünmüyor");

  // 3) Veli panelinde Ali'ye dokun: şifre sorulmadan Ali'nin paneli açılır
  await p.click('.ogrenci-cip[data-ogrenci]:not(.aktif)'); await hazir(); await foto("p3_veli_ali");
  if (await p.$("[data-p]")) hatalar.push("öğrenci değiştirince veli şifresi yeniden soruldu");
  if (await p.evaluate(() => PROFIL.sinif()) !== 3) hatalar.push("Ali'ye geçilmedi (sınıf 3 değil)");
  if (await p.evaluate(() => DEPO.liste("soru").length) !== 0) hatalar.push("Ali'nin verisinde Elif'in soruları görünüyor");
  const ders3 = await p.evaluate(() => ICERIK.DERSLER.map(d => d.id).join(","));
  if (ders3 !== "mat,tr,hb,fen,en") hatalar.push("3. sınıf dersleri yanlış: " + ders3);
  if (await p.$('a[href="#/bursluluk"], [data-test="tgs"]')) hatalar.push("3. sınıfta 6. sınıfa özel bölüm görünüyor");

  // 4) Uygulama yeniden açılınca “Kim çalışacak?”; Ali seçilir, 3. sınıf ekranları ve soru çözümü
  const p2 = await ctx.newPage(); p2.on("pageerror", e => hatalar.push("pageerror(2): " + e.message));
  await p2.goto(U); await p2.waitForSelector(".profil-kart"); await p2.screenshot({ path: path.join(CIKTI, "p4_kim_calisacak.png") });
  if ((await p2.$$(".profil-kart")).length !== 2) hatalar.push("açılışta 2 öğrenci kartı yok");
  await p2.click('.profil-kart:has-text("Ali")'); await p2.waitForFunction(() => window.DEPO && document.querySelector("#ana").children.length); await p2.waitForTimeout(400);
  await p2.screenshot({ path: path.join(CIKTI, "p5_ali_ana.png") });
  for (const d of ["mat", "tr", "hb", "fen", "en"]) {
    const k = await p2.evaluate(d => (ICERIK.KONULAR.find(x => x.ders === d) || {}).id, d); if (!k) { hatalar.push("3. sınıf " + d + " konusu yok"); continue; }
    await p2.goto(U + "#/konu/" + k); await p2.waitForTimeout(300); await p2.click('[data-test="alistirma"]'); await p2.waitForTimeout(200);
    for (let i = 0; i < 3 && await p2.$("[data-s]"); i++) { const x = await p2.evaluate(() => TEST_DURUMU().soru.q.secenekler.findIndex(y => y.dogru)); await p2.click(`[data-s="${x}"]`); await p2.waitForTimeout(60); if (await p2.$("#devamB")) await p2.click("#devamB"); await p2.waitForTimeout(60); }
    if (d === "mat") await p2.screenshot({ path: path.join(CIKTI, "p6_ali_soru.png") });
  }
  const aliSoru = await p2.evaluate(() => DEPO.liste("soru").length); if (aliSoru < 10) hatalar.push("Ali'nin soruları kaydedilmedi: " + aliSoru);
  await p2.goto(U + "#/genel"); await p2.waitForTimeout(300); await p2.click('[data-test="genel3"][data-no="1"]'); await p2.waitForTimeout(200);
  if (await p2.evaluate(() => TEST_DURUMU().plan.length) !== 50) hatalar.push("3. sınıf genel deneme 50 soru değil");
  await p2.goto(U + "#/yazili/mat/d1y1"); await p2.waitForTimeout(300); await p2.screenshot({ path: path.join(CIKTI, "p7_ali_degerlendirme.png") });
  if (!(await p2.textContent("main")).includes("Değerlendirme")) hatalar.push("3. sınıfta 'Değerlendirme' adı kullanılmıyor");
  if (await p2.evaluate(() => window.OYUN && OYUN.ozet().toplam > 0)) { await p2.goto(U + "#/oyun"); await p2.waitForTimeout(300); await p2.screenshot({ path: path.join(CIKTI, "p8_ali_oyun.png") }); }
  else hatalar.push("Türkçe Diyarı 3. sınıfta açılmıyor");

  // 5) Elif'e dönüş: verisi duruyor, Ali'nin soruları karışmamış
  await p2.click("#ogrBtn"); await p2.waitForSelector(".profil-kart"); await p2.click('.profil-kart:has-text("Elif")'); await p2.waitForFunction(() => window.DEPO && document.querySelector("#ana").children.length); await p2.waitForTimeout(300);
  if (await p2.evaluate(() => DEPO.liste("soru").length) !== elifSoru) hatalar.push("Elif'in soru sayısı değişti");
  // Veli özetinde “Bütün öğrenciler”
  await p2.goto(U + "#/veli"); await p2.waitForTimeout(300); for (const x of ["1", "2", "3", "4", "Tamam"]) await p2.click(`[data-p="${x}"]`); await p2.waitForTimeout(1200);
  await p2.screenshot({ path: path.join(CIKTI, "p9_veli_tum.png") });
  if (!(await p2.textContent("#tumOgr").catch(() => "")).includes("soru")) hatalar.push("Bütün öğrenciler kartı dolmadı");
  console.log("HATALAR:", hatalar.length ? hatalar : "yok");
  await b.close(); sunucu.close();
})();
