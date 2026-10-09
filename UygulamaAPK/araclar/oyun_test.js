// Türkçe Diyarı oyun testi (Playwright): görevleri doğru/yanlış oynar, puan, yıldız, kilit ve rozetleri denetler.
// Kullanım: node araclar/oyun_test.js <ekran_goruntusu_klasoru>
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "web"), CIKTI = process.argv[2] || "/tmp";
const sunucu = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(KOK, u === "/" ? "index.html" : u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": f.endsWith(".js") ? "application/javascript" : "text/html" }); r.end(d); } }); });
(async () => {
  await new Promise(c => sunucu.listen(8767, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await b.newPage({ viewport: { width: 800, height: 1280 }, hasTouch: true });
  const hatalar = [];
  p.on("pageerror", e => hatalar.push("pageerror: " + e.message));
  p.on("console", m => { if (m.type() === "error" && !/youtube|ERR_|Failed to load resource/.test(m.text())) hatalar.push("console: " + m.text()); });
  const foto = ad => p.screenshot({ path: path.join(CIKTI, "oyun_" + ad + ".png") });
  const tikla = async s => { await p.click(s); await p.waitForTimeout(60); };
  await p.goto("http://localhost:8767/index.html"); await p.fill("#kAd", "Elif"); await tikla("#kTamam");
  await p.goto("http://localhost:8767/index.html#/ders/tr"); await foto("0_tr_ana");
  await p.goto("http://localhost:8767/index.html#/oyun"); await foto("1_harita");
  const kilitli = await p.evaluate(() => [...document.querySelectorAll("[data-ada]")].map(x => x.disabled));
  if (JSON.stringify(kilitli) !== "[false,true,true]") hatalar.push("ada kilitleri yanlış: " + kilitli);

  // Bir öğeyi doğru (ya da yanlış) çözer
  async function coz(dogruMu, fotoAd) {
    const o = await p.evaluate(() => { const t = OYUN.durum(); const g = t.ogeler[t.i]; return { tur: g.tur, o: g.o, d: g.secenekler ? g.secenekler.findIndex(s => s.dogru) : null }; });
    if (o.tur === "secmeli") await tikla(`[data-j="${dogruMu ? o.d : (o.d + 1) % 3}"]`);
    else if (o.tur === "eslestir") { if (!dogruMu) await tikla("#oVazgec"); else for (let i = 0; i < o.o.ciftler.length; i++) { await tikla(`[data-sol="${i}"]`); await tikla(`[data-sag="${i}"]`); } }
    else if (o.tur === "sirala") { const sira = o.o.ogeler.map((_, i) => i); if (!dogruMu) sira.reverse(); for (const i of sira) await tikla(`[data-i="${i}"]`); await tikla("#oKontrol"); }
    else if (o.tur === "uret") {
      if (!dogruMu) await tikla("#oBitir");
      else {
        const harf = [...o.o.harfler.toLocaleUpperCase("tr-TR")].filter(c => c.trim());
        // önce listede olmayan bir kelime dene (reddedilmeli)
        if (!o.o.kelimeler.map(w => w.toLocaleUpperCase("tr-TR")).includes(harf[0] + harf[1])) { await tikla(`[data-h="0"]`); await tikla(`[data-h="1"]`); await tikla("#oEkle"); }
        for (const w of o.o.kelimeler.slice(0, o.o.hedef)) {
          const kul = [];
          for (const c of w.toLocaleUpperCase("tr-TR")) { const j = harf.findIndex((h, k) => h === c && !kul.includes(k)); kul.push(j); await tikla(`[data-h="${j}"]`); }
          await tikla("#oEkle");
        }
      }
    }
    if (fotoAd) await foto(fotoAd);
    await tikla("#oDevam");
  }
  const turler = new Set();
  async function gorevOyna(konu, dogruSayisi, fotoOnek) {
    await p.goto("http://localhost:8767/index.html#/oyun"); await p.goto("http://localhost:8767/index.html#/oyun/gorev/" + konu); await p.waitForTimeout(100);
    const n = await p.evaluate(() => OYUN.durum().ogeler.length);
    for (let i = 0; i < n; i++) { const tur = await p.evaluate(() => { const t = OYUN.durum(); return t.ogeler[t.i].tur; }); turler.add(tur); await coz(i < dogruSayisi, fotoOnek && !turler.has(tur + "f") ? (turler.add(tur + "f"), fotoOnek + tur) : null); }
    return p.evaluate(() => document.querySelector("main").innerText);
  }
  const konular = await p.evaluate(() => ICERIK.DERS.tr.temaListesi.map(t => t.konular));
  // 1. görev: 2 doğru → geçemez, sonraki kilitli kalır
  let m = await gorevOyna(konular[0][0], 2, "2_"); await foto("3_bitis_kaldi");
  if (!/2 yıldız/.test(m)) hatalar.push("2 doğruda yıldız mesajı yok");
  if (await p.evaluate(k => OYUN.ozet().adalar[0].gorevler[1].acik, konular[0][1])) hatalar.push("3 yıldız olmadan görev açıldı");
  // 1. görev: 5 doğru → 5 yıldız, puan 5×10+20 = 70
  m = await gorevOyna(konular[0][0], 5); await foto("4_bitis_tam");
  if (!/70 puan/.test(m)) hatalar.push("tam puan 70 değil: " + m.slice(0, 200));
  if (!(await p.evaluate(() => OYUN.ozet().adalar[0].gorevler[1].acik))) hatalar.push("5 yıldızla sonraki görev açılmadı");
  // Adanın bütün görevlerini 3 doğruyla geç → rozet ve 2. ada açılır
  for (const k of konular[0].slice(1)) await gorevOyna(k, 3);
  await foto("5_rozet");
  const oz = await p.evaluate(() => { const o = OYUN.ozet(); return { rozet: o.rozet, ada2: o.adalar[1].acik, puan: o.puan, yildiz: o.yildiz }; });
  if (oz.rozet !== 1 || !oz.ada2) hatalar.push("rozet/ada açılması hatalı: " + JSON.stringify(oz));
  await p.goto("http://localhost:8767/index.html#/oyun/ada/" + (await p.evaluate(() => ICERIK.DERS.tr.temaListesi[0].id))); await foto("6_ada");
  // Kayıtlar veli istatistiklerine yansıyor mu?
  const kayit = await p.evaluate(() => ({ soru: DEPO.liste("soru").filter(s => s.mod === "oyun").length, oyun: DEPO.liste("oyun").length }));
  if (kayit.oyun !== 2 + konular[0].length - 1 || kayit.soru < 20) hatalar.push("kayıt sayısı beklenmedik: " + JSON.stringify(kayit));
  await p.goto("http://localhost:8767/index.html#/veli"); for (const x of ["1", "2", "3", "4", "Tamam"]) await tikla(`[data-p="${x}"]`);
  await p.goto("http://localhost:8767/index.html#/veli/ozet"); await foto("7_veli_ozet");
  await p.goto("http://localhost:8767/index.html#/veli/konu/" + konular[0][0]); await foto("8_veli_konu");
  const metin = await p.textContent("main"); if (/NaN|undefined/.test(metin)) hatalar.push("veli konu sayfasında NaN/undefined");
  // Veli ayarı: bütün adaları aç
  await p.goto("http://localhost:8767/index.html#/veli/ayar"); await p.check("#aOyunAcik"); await tikla("#aKaydet");
  if (!(await p.evaluate(() => OYUN.ozet().adalar.every(a => a.acik && a.gorevler.every(g => g.acik))))) hatalar.push("veli ayarı adaları açmadı");
  // 2. ve 3. adalardan birer görev
  for (const k of [konular[1][0], konular[2][0], konular[1][konular[1].length - 1]]) await gorevOyna(k, 5);
  console.log("oynanan türler:", [...turler].filter(t => !t.endsWith("f")).join(", "));
  console.log("HATALAR:", hatalar.length ? hatalar : "yok");
  await b.close(); sunucu.close();
})();
