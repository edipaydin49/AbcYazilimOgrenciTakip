// Uçtan uca arayüz testi (Playwright). Kullanım: node araclar/arayuz_test.js <ekran_goruntusu_klasoru>
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "web"), CIKTI = process.argv[2] || "/tmp";
const TUR = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css" };
const sunucu = http.createServer((q, r) => { const f = path.join(KOK, decodeURIComponent(q.url.split("?")[0]) === "/" ? "index.html" : decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": TUR[path.extname(f)] || "text/plain" }); r.end(d); } }); });
(async () => {
  await new Promise(c => sunucu.listen(8765, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 800, height: 1280 }, hasTouch: true });
  const p = await ctx.newPage(); const hatalar = [];
  p.on("pageerror", e => hatalar.push("pageerror: " + e.message));
  p.on("console", m => { if (m.type() === "error" && !/youtube|ERR_|net::|Failed to load resource/.test(m.text())) hatalar.push("console: " + m.text()); });
  const foto = async ad => p.screenshot({ path: path.join(CIKTI, ad + ".png"), fullPage: false });
  const tikla = async s => { await p.click(s); await p.waitForTimeout(80); };
  await p.goto("http://localhost:8765/index.html");
  // Kurulum
  await p.fill("#kAd", "Elif"); await tikla("#kTamam"); await foto("1_ana");
  // Konu anlatımı + duraklar
  await p.goto("http://localhost:8765/index.html#/anlatim/carpan");
  for (let i = 0; i < 3; i++) { await tikla(".sec >> nth=0"); if (i === 0) await foto("2_anlatim"); await tikla("#ileriB"); }
  // Alıştırma: karışık davranış (doğru, yanlış + ikinci deneme, ipucu, çözüm + benzer soru, geç)
  const soruCoz = async (dav) => {
    const dogru = await p.evaluate(() => [...document.querySelectorAll(".sec")].findIndex((_, j) => window.__dogru === undefined) );
    const idx = await p.evaluate(() => { const t = window.__T(); return t.soru.q.secenekler.findIndex(x => x.dogru); });
    const yanlisIdx = idx === 0 ? 1 : 0;
    if (dav === "ipucu") { await tikla("#ipucuB"); await tikla(`[data-s="${idx}"]`); }
    else if (dav === "dogru") await tikla(`[data-s="${idx}"]`);
    else if (dav === "duzelt") { await tikla(`[data-s="${yanlisIdx}"]`); await tikla('[data-kh="islem"]'); await tikla(`[data-s="${idx}"]`); }
    else if (dav === "cozum") { await tikla(`[data-s="${yanlisIdx}"]`); await tikla("#cozumGor"); await foto("4_cozum"); await tikla("#benzerB"); return; }
    else if (dav === "gec") { await tikla("#gecB"); return; }
    else if (dav === "yanlis2") { await tikla(`[data-s="${yanlisIdx}"]`); const ikinci = [0,1,2,3].find(j => j !== idx && j !== yanlisIdx); await tikla(`[data-s="${ikinci}"]`); }
    await tikla("#devamB");
  };
  await p.evaluate(() => { window.__T = () => window.__testDurum(); });
  await p.addInitScript(() => {});
  // test durumuna erişim için küçük kanca
  await p.evaluate(() => { const orj = window.location; });
  await p.exposeFunction("noop", () => {});
  await p.evaluate(() => { window.__testDurum = () => window.TEST_DURUMU(); });
  const davranis = ["dogru", "duzelt", "ipucu", "cozum", "dogru", "gec", "yanlis2", "dogru", "dogru", "dogru", "dogru"];
  for (const d of davranis) { if (!(await p.$("[data-s]"))) break; await soruCoz(d); if (d === "duzelt") await foto("3_soru"); }
  await p.waitForTimeout(200);
  await tikla('[data-oz="4"]'); await foto("5_sonuc");
  // Konu sonu testi
  await p.goto("http://localhost:8765/index.html#/konu/carpan"); await tikla('[data-test="konuSonu"]');
  for (let i = 0; i < 12; i++) await soruCoz(i % 4 === 3 ? "yanlis2" : "dogru");
  // Genel deneme (sınav modu)
  await p.goto("http://localhost:8765/index.html#/"); await tikla('[data-test="deneme"]'); await foto("6_deneme");
  for (let i = 0; i < 20; i++) { if (i % 5 !== 4) await tikla(`[data-s="${i % 4}"]`); await tikla("#sonrakiB"); }
  await foto("7_deneme_sonuc");
  // Fen Bilimleri: ders seçimi, konu, anlatım, alıştırma
  await p.goto("http://localhost:8765/index.html#/ders/fen"); await foto("11_fen_ana");
  const fenKonu = await p.evaluate(() => ICERIK.KONULAR.find(k => k.ders === "fen").id);
  await p.goto("http://localhost:8765/index.html#/konu/" + fenKonu); await foto("12_fen_konu");
  await p.goto("http://localhost:8765/index.html#/anlatim/" + fenKonu);
  const bolum = await p.evaluate(k => ICERIK.KONU[k].anlatim.length, fenKonu);
  for (let i = 0; i < bolum; i++) { await tikla(".sec >> nth=0"); await tikla("#ileriB"); }
  for (const d of ["dogru", "cozum", "dogru", "duzelt", "dogru", "dogru", "yanlis2", "dogru", "dogru", "dogru", "dogru"]) { if (!(await p.$("[data-s]"))) break; await soruCoz(d); if (d === "cozum") await foto("13_fen_cozum"); }
  // Yazılı hazırlık: sayfa, konu tekrar testi, prova (sınav modu)
  await p.goto("http://localhost:8765/index.html#/yazili/fen/d2y1"); await foto("14_yazili");
  await tikla('[data-test="yaziliTekrar"]'); for (let i = 0; i < 12; i++) await soruCoz(i % 3 ? "dogru" : "yanlis2");
  await p.goto("http://localhost:8765/index.html#/yazili/mat/d1y1"); await tikla('[data-test="yazili"]');
  for (let i = 0; i < 20; i++) { await tikla(`[data-s="${i % 4}"]`); await tikla("#sonrakiB"); }
  await foto("15_yazili_sonuc");
  const yt = await p.evaluate(() => DEPO.liste("test").filter(t => t.tur === "yazili" && t.ders === "mat" && t.yazili === "d1y1").length); if (yt !== 1) hatalar.push("yazılı provası kaydedilmedi");
  // Görselli soruların hepsi hatasız çizilebiliyor mu?
  const gorselHata = await p.evaluate(() => { const h = []; for (const kz of Object.keys(ICERIK.KAZANIM)) for (let i = 0; i < 6; i++) { try { const q = ICERIK.soruUret(kz, 1 + i % 3); if (q.gorsel) { const d = document.createElement("div"); d.innerHTML = q.gorsel; if (/NaN|undefined/.test(q.gorsel)) h.push(kz + " görselde NaN/undefined"); } } catch (e) { h.push(kz + ": " + e.message); } } return [...new Set(h)]; });
  hatalar.push(...gorselHata);
  // Hata defteri
  await p.goto("http://localhost:8765/index.html#/hatalar"); await tikla('[data-test="hata"]'); await soruCoz("dogru");
  // Gelişimim
  await p.goto("http://localhost:8765/index.html#/gelisim"); await foto("8_gelisim");
  // Geçmiş günlere yapay veri: aralıklı tekrar ve grafikler için
  await p.evaluate(() => {
    const G = 86400000, simdi = Date.now();
    for (let g = 13; g >= 1; g--) {
      const t = simdi - g * G;
      const o = DEPO.kaydet("oturum", { bas: t, son: t, aktifSn: 600 + Math.round(Math.random() * 1800), kesinti: Math.round(Math.random() * 2) }); o.t = t;
      for (let k = 0; k < 8; k++) { const q = ICERIK.soruUret((l => l[Math.floor(Math.random() * l.length)])(Object.keys(ICERIK.KAZANIM)), 2);
        const s = DEPO.kaydet("soru", { konu: q.konu, kaz: q.kaz, duzey: q.duzey, zorluk: q.zorluk, mod: "alistirma", ilkDogru: Math.random() < 0.4 + g / 30, sonDogru: true, deneme: 1, ilkSure: 8000 + Math.random() * 40000, ipucu: Math.random() < .2, ilkHata: ["bilgi","kavrama","islem","dikkat"][k % 4], soruNesnesi: q }); s.t = t + k * 1000; }
    }
    const kt = DEPO.liste("test").find(x => x.tur === "konuSonu"); kt.t = simdi - 8 * G;
    const v = DEPO.kaydet("video", { konu: "carpan", vid: "abcdefghijk", toplam: 600, izlenen: 480, oynatilan: 720, geriSarma: 3, ileriSarma: 1, duraklatma: 4, bolumAcma: { 0: 1, 1: 3, 2: 1 }, bitti: true });
  });
  await p.goto("http://localhost:8765/index.html#/"); await foto("9_ana_tekrar");
  const tekrarVar = await p.$('[data-test^="tekrar"]'); if (!tekrarVar) hatalar.push("tekrar zamanı görünmüyor");
  else { await tikla('[data-test^="tekrar"] >> nth=0'); for (let i = 0; i < 6; i++) await soruCoz("dogru"); }
  // Veli paneli
  await p.goto("http://localhost:8765/index.html#/veli");
  for (const x of ["1", "2", "3", "4", "Tamam"]) await tikla(`[data-p="${x}"]`);
  for (const sk of ["ozet", "dersler", "konu/carpan", "konu/" + fenKonu, "kazanim", "soru", "anlatim", "tekrar", "calisma", "yazili", "kayit", "icerik", "ayar"]) {
    await p.goto("http://localhost:8765/index.html#/veli/" + sk); await p.waitForTimeout(150);
    const metin = await p.textContent("main"); if (/NaN|undefined|\[object/.test(metin)) hatalar.push(sk + " sekmesinde NaN/undefined: " + metin.match(/.{0,40}(NaN|undefined|\[object).{0,40}/)[0]);
    await foto("v_" + sk.replace("/", "_"));
    if (sk === "ozet") { await tikla('[data-aralik="0"]'); await tikla('[data-aralik="30"]'); await tikla('[data-vders="fen"]'); await foto("v_ozet_fen"); await tikla('[data-vders=""]'); }
    if (sk === "yazili") { await p.click("details >> nth=0"); await p.fill('[data-yaz="mat.d1y1"] .yTarih', "2026-11-05"); await tikla('[data-yaz="mat.d1y1"] .yKaydet');
      const y = await p.evaluate(() => DEPO.ayar.yazililar["mat.d1y1"]); if (!y || y.tarih !== "2026-11-05") hatalar.push("yazılı tarihi kaydedilmedi"); }
  }
  // Video ekleme
  await p.goto("http://localhost:8765/index.html#/veli/icerik");
  await p.click("details >> nth=0"); await p.fill('[data-konu="carpan"] .vUrl', "https://youtu.be/dQw4w9WgXcQ");
  await tikla('[data-konu="carpan"] .vBolumEkle'); await p.fill('[data-konu="carpan"] .bBaslik', "Giriş");
  await tikla('[data-konu="carpan"] .vBolumEkle'); await p.fill('[data-konu="carpan"] .vBolum >> nth=1 >> .bBaslik', "Çarpan çiftleri"); await p.fill('[data-konu="carpan"] .vBolum >> nth=1 >> .bBas', "2:30");
  await p.selectOption('[data-konu="carpan"] .vBolum >> nth=1 >> .bDurak', "ozel");
  await p.fill('[data-konu="carpan"] .vBolum >> nth=1 >> .bSoru', "12'nin çarpanı hangisi?");
  for (const [i, v] of ["3", "5", "7", "9"].entries()) await p.fill(`[data-konu="carpan"] .vBolum >> nth=1 >> .bSec >> nth=${i}`, v);
  await tikla('[data-konu="carpan"] .vKaydet');
  const v = await p.evaluate(() => DEPO.ayar.videolar.carpan); if (!v || v.vid !== "dQw4w9WgXcQ" || v.bolumler.length !== 2) hatalar.push("video kaydedilmedi: " + JSON.stringify(v));
  await p.goto("http://localhost:8765/index.html#/konu/carpan"); await foto("10a_konu_video_liste");
  const vSay = await p.evaluate(() => document.querySelectorAll(".video-satir").length); if (vSay < 4) hatalar.push("konu sayfasında video listesi eksik: " + vSay);
  await p.goto("http://localhost:8765/index.html#/video/carpan/0"); await p.waitForTimeout(1500); await foto("10_video");
  // Ayarlar: dışa/içe aktarma
  await p.goto("http://localhost:8765/index.html#/veli/ayar");
  for (const x of ["1", "2", "3", "4", "Tamam"]) await tikla(`[data-p="${x}"]`);
  await p.goto("http://localhost:8765/index.html#/veli/ayar");
  const disa = await p.evaluate(() => DEPO.disaAktar()); const n = JSON.parse(disa).olaylar.length;
  await p.fill("#aIce", disa); await tikla("#aIceAl");
  console.log("olay sayısı:", n, "| veri boyutu:", (disa.length / 1024).toFixed(0), "KB");
  // Yeniden yükleme sonrası verinin kalıcılığı
  await p.evaluate(() => DEPO.yazmaBitti());
  await p.reload(); await p.waitForTimeout(500);
  const sonra = await p.evaluate(() => DEPO.liste().length); if (sonra < n) hatalar.push(`yeniden yüklemede veri kayboldu: ${n} → ${sonra}`);
  console.log("HATALAR:", hatalar.length ? hatalar : "yok");
  await b.close(); sunucu.close();
})();
