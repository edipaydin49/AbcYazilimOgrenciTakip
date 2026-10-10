// Bilgisayardan izleme testi: tablet uygulamasının verisini üretir, gerçek YerelSunucu.java'yı (JVM'de) çalıştırır,
// bilgisayar tarayıcısı gibi bağlanıp veli panelini açar. Kullanım: node araclar/uzak_test.js <ekran_goruntusu_klasoru>
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path"), { spawn, execFileSync } = require("child_process");
const KOK = path.join(__dirname, ".."), CIKTI = process.argv[2] || "/tmp", GECICI = path.join(KOK, "araclar", ".derleme", "uzak");
const sunucu = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(KOK, "web", u === "/" ? "index.html" : u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": f.endsWith(".js") ? "application/javascript" : "text/html" }); r.end(d); } }); });
(async () => {
  const hatalar = [];
  fs.mkdirSync(GECICI, { recursive: true });
  execFileSync("python3", [path.join(KOK, "araclar", "veli_sayfasi.py")]);
  execFileSync("javac", ["-d", GECICI, path.join(KOK, "android/src/tr/abc/ogrenme/YerelSunucu.java"), path.join(KOK, "araclar/SunucuDeneme.java")], { stdio: "ignore" });
  await new Promise(c => sunucu.listen(8769, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  // 1) “Tablet”: veri üret, Android köprüsünün veriGuncelle çağrısını yakala
  const t = await b.newPage();
  await t.addInitScript(() => { window.__gonderilen = null; window.Android = { sunucuAdres: () => "http://x:8080", veriGuncelle: (j, p) => { window.__gonderilen = { j, p }; } }; });
  await t.goto("http://localhost:8769/index.html"); await t.fill("#kAd", "Elif"); await t.click("#kTamam");
  await t.evaluate(() => { const kz = Object.keys(ICERIK.KAZANIM); for (let i = 0; i < 120; i++) { const q = ICERIK.soruUret(kz[(i * 7) % kz.length], 2); DEPO.kaydet("soru", { ders: q.ders, konu: q.konu, kaz: q.kaz, duzey: q.duzey, zorluk: q.zorluk, mod: "alistirma", ilkDogru: i % 3 > 0, sonDogru: true, deneme: 1, ilkSure: 15000, soruNesnesi: q }); }
    DEPO.ayar.pin = "4826"; DEPO.ayarKaydet(); DEPO.tabletePaylas(true); });
  const g = await t.evaluate(() => window.__gonderilen);
  if (!g || g.p !== "4826") hatalar.push("tablet veriyi köprüye göndermedi");
  if (g && /"pin"/.test(g.j)) hatalar.push("gönderilen veride şifre var!");
  fs.writeFileSync(path.join(GECICI, "veri.json"), g.j);
  // 2) Gerçek Java sunucusu
  const java = spawn("java", ["-cp", GECICI, "SunucuDeneme", KOK, path.join(GECICI, "veri.json"), "4826"]);
  const port = await new Promise(c => java.stdout.on("data", d => { const m = String(d).match(/PORT (\d+)/); if (m) c(+m[1]); }));
  const taban = "http://localhost:" + port;
  const al = async (u) => { const r = await fetch(taban + u, { redirect: "manual" }); return { kod: r.status, govde: await r.text(), yer: r.headers.get("location") }; };
  let r = await al("/"); if (r.kod !== 302 || r.yer !== "/veli.html") hatalar.push("kök yönlendirmesi yok");
  r = await al("/api/veri"); if (r.kod !== 401) hatalar.push("şifresiz veri verildi: " + r.kod);
  r = await al("/../araclar/apk_derle.py"); if (r.kod === 200) hatalar.push("dizin dışına çıkılabildi");
  r = await al("/%2e%2e/OKU_BENI.md"); if (r.kod === 200) hatalar.push("kodlanmış .. ile dizin dışına çıkılabildi");
  r = await al("/js/depo.js"); if (r.kod !== 200) hatalar.push("statik dosya sunulmadı");
  // 3) “Bilgisayar” tarayıcısı
  const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
  p.on("pageerror", e => hatalar.push("pageerror: " + e.message));
  await p.goto(taban + "/"); await p.waitForSelector("#uPin"); await p.screenshot({ path: path.join(CIKTI, "uzak_1_giris.png") });
  await p.fill("#uPin", "1111"); await p.click("#uBaglan"); await p.waitForTimeout(400);
  if (!/yanlış/i.test(await p.textContent("#uDurum"))) hatalar.push("yanlış şifre uyarısı yok");
  await p.fill("#uPin", "4826"); await p.click("#uBaglan"); await p.waitForSelector(".sekmeler"); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(CIKTI, "uzak_2_ozet.png"), fullPage: false });
  const sekmeler = await p.$$eval(".sekmeler .sekme", l => l.map(x => x.textContent));
  if (sekmeler.some(x => /Ayarlar|Videolar/.test(x))) hatalar.push("uzakta ayar/video sekmesi görünüyor");
  for (const sk of ["dersler", "kazanim", "soru", "yazili", "kayit"]) { await p.goto(taban + "/veli.html#/veli/" + sk); await p.waitForTimeout(250); const m = await p.textContent("main"); if (/NaN|undefined/.test(m)) hatalar.push(sk + " NaN/undefined"); if (sk === "kayit" && !/Elif|✓|✗/.test(m)) hatalar.push("kayıtlar görünmüyor"); }
  await p.screenshot({ path: path.join(CIKTI, "uzak_3_kayit.png") });
  await p.goto(taban + "/veli.html#/"); await p.waitForTimeout(250); if (!/veli\/ozet/.test(p.url())) hatalar.push("öğrenci sayfasına gidilebildi: " + p.url());
  const yerel = await p.evaluate(() => { try { return localStorage.length; } catch (e) { return 0; } });
  if (yerel > 1) hatalar.push("bilgisayarda veri kaydedildi: localStorage " + yerel);
  // 4) Kilitlenme: 5 yanlış deneme → 429
  for (let i = 0; i < 5; i++) await al("/api/veri?pin=0000");
  r = await al("/api/veri?pin=4826"); if (r.kod !== 429) hatalar.push("5 yanlış denemeden sonra kilitlenmedi: " + r.kod);
  java.kill(); await b.close(); sunucu.close();
  console.log("HATALAR:", hatalar.length ? hatalar : "yok");
})();
