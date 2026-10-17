// Video takip testi: YouTube oynatıcısının sahte bir kopyasıyla. Kullanım: node araclar/video_test.js
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "web");
const sunucu = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(KOK, u === "/" ? "index.html" : u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "Content-Type": f.endsWith(".js") ? "application/javascript" : "text/html" }); r.end(d); } }); });
(async () => {
  await new Promise(c => sunucu.listen(8767, c));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await b.newPage({ viewport: { width: 800, height: 1280 } }); const hatalar = [];
  p.on("pageerror", e => hatalar.push(e.message));
  await p.clock.install();
  await p.addInitScript(() => {
    // Sahte YouTube oynatıcısı: süre 60 sn, gerçek saatle (sahte saat) ilerler.
    class Oynatici {
      constructor(id, o) { this.o = o; this.t = 0; this.st = -1; this.bas = null; window.__OYN = this; setTimeout(() => o.events.onReady({}), 10); }
      getDuration() { return 60; }
      _guncel() { if (this.st === 1) { this.t = Math.min(60, this.t + (Date.now() - this.bas) / 1000); this.bas = Date.now(); if (this.t >= 60) { this.st = 0; this.o.events.onStateChange({ data: 0 }); } } return this.t; }
      getCurrentTime() { return this._guncel(); }
      getPlayerState() { this._guncel(); return this.st; }
      playVideo() { this.st = 1; this.bas = Date.now(); this.o.events.onStateChange({ data: 1 }); }
      pauseVideo() { this._guncel(); this.st = 2; this.o.events.onStateChange({ data: 2 }); }
      seekTo(x) { this._guncel(); this.t = x; this.bas = Date.now(); }
      destroy() {}
    }
    window.YT = { Player: Oynatici };
  });
  await p.goto("http://localhost:8767/index.html");
  await p.evaluate(() => { Object.assign(DEPO.ayar, { ogrenciAdi: "Test", kurulum: true, videolar: { carpan: { url: "x", vid: "abcdefghijk", bolumler: [
    { baslik: "Giriş", bas: "0:00", durak: "oto" }, { baslik: "Çiftler", bas: "0:30", durak: "ozel", soru: "12'nin çarpanı?", secenekler: ["3", "5", "7", "9"], dogruIndeks: 0 }] } } }); DEPO.ayarKaydet(); location.hash = "#/video/carpan"; });
  await p.clock.runFor(500);
  const ilerle = async sn => { for (let i = 0; i < sn; i++) await p.clock.runFor(1000); };
  await p.evaluate(() => __OYN.playVideo());
  await ilerle(33);                                             // 0 → 33 sn: 30. saniyede bölüm sonu sorusu
  const modal1 = await p.$(".perde"); if (!modal1) hatalar.push("1. bölüm sonunda soru çıkmadı");
  const dogru1 = await p.evaluate(() => [...document.querySelectorAll(".perde [data-o]")].findIndex(b => true));
  await p.click(".perde [data-o] >> nth=0"); await p.click("#dDevam");
  await ilerle(5);                                              // ~35 sn
  await p.evaluate(() => __OYN.seekTo(10)); await ilerle(3);   // geri sarma
  await ilerle(22);                                             // tekrar 30'u geçer: soru tekrar sorulmamalı
  if (await p.$(".perde")) hatalar.push("aynı bölüm sorusu ikinci kez soruldu");
  await p.evaluate(() => __OYN.pauseVideo()); await ilerle(4); await p.evaluate(() => __OYN.playVideo());  // kullanıcı duraklatması
  await ilerle(30);                                             // sona kadar
  const modal2 = await p.$(".perde"); if (!modal2) hatalar.push("video sonunda özel soru çıkmadı");
  else { const metin = await p.textContent(".perde"); if (!metin.includes("12'nin çarpanı?")) hatalar.push("özel soru metni yanlış"); await p.click('.perde [data-o="1"]'); await p.click("#dDevam"); }
  await p.evaluate(() => { location.hash = "#/"; });  // sayfadan çıkınca son durum kaydedilir
  await p.clock.runFor(500);
  const v = await p.evaluate(() => DEPO.liste("video").pop());
  const d = await p.evaluate(() => DEPO.liste("durak"));
  console.log("video kaydı:", JSON.stringify({ toplam: v.toplam, izlenen: v.izlenen, oynatilan: v.oynatilan, geriSarma: v.geriSarma, ileriSarma: v.ileriSarma, duraklatma: v.duraklatma, bolumAcma: v.bolumAcma, bitti: v.bitti }));
  console.log("durak kayıtları:", d.map(x => `bölüm ${x.bolum}: ${x.dogru ? "doğru" : "yanlış"}`).join(", "));
  const h = await p.evaluate(() => { const k = ANALIZ.hesapla({}).konuOzet.carpan.video; return { tamamlama: k.tamamlama, aktif: k.aktif, tekrar: k.tekrarlananBolumler }; });
  console.log("hesaplanan:", JSON.stringify(h));
  if (v.toplam !== 60) hatalar.push("toplam süre yanlış");
  if (v.geriSarma < 1) hatalar.push("geri sarma sayılmadı");
  if (v.duraklatma !== 1) hatalar.push("duraklatma sayısı " + v.duraklatma + " (beklenen 1: soru duraklatmaları sayılmamalı)");
  if (!v.bitti) hatalar.push("bitti işaretlenmedi");
  if (d.length !== 2) hatalar.push("durak kaydı sayısı " + d.length);
  if (!(h.tamamlama > 0.9)) hatalar.push("tamamlama oranı düşük: " + h.tamamlama);
  if (!(h.aktif > h.tamamlama)) hatalar.push("aktif izleme tekrar izlemeyi yansıtmıyor");
  console.log("HATALAR:", hatalar.length ? hatalar : "yok");
  await b.close(); sunucu.close();
})();
