/* Ders içerik dosyalarını denetler.
 * Kullanım: node araclar/ders_dogrula.js web/js/fen.js web/js/fen1.js [...]
 * (ortak.js otomatik yüklenir). Her konu, kazanım, anlatım bölümü, konu durağı ve
 * her üretecin 40 kez çalıştırılmasıyla üretilen sorular kurallara göre denetlenir.
 */
const fs = require("fs"), path = require("path"), vm = require("vm");
const kok = path.join(__dirname, "..");
const ctx = { window: {}, console, Math, Date, JSON, Number, String, Array, Object, Set, Map, isNaN, parseInt, parseFloat };
ctx.window = ctx; vm.createContext(ctx);
const yukle = f => vm.runInContext(fs.readFileSync(path.resolve(kok, f), "utf8"), ctx, { filename: f });
yukle("web/js/ortak.js");
process.argv.slice(2).forEach(yukle);

const DUZEY = ["hatirlama", "aciklama", "uygulama", "transfer", "baglanti"], HATA = ["bilgi", "kavrama", "islem", "dikkat", "strateji"];
const sorunlar = []; const say = { konu: 0, kaz: 0, uretec: 0, soru: 0, durak: 0, benzersiz: 0 };
const sorun = (yer, m) => sorunlar.push(yer + ": " + m);
const ids = new Set();
for (const d of ctx.DERS_LISTESI) {
  const temaIds = new Set(d.temalar.map(t => t.id));
  for (const k of d.konular) {
    say.konu++;
    if (ids.has(k.id)) sorun(k.id, "konu kimliği tekrar ediyor"); ids.add(k.id);
    if (!temaIds.has(k.tema)) sorun(k.id, "tema bulunamadı: " + k.tema);
    if (!k.ad) sorun(k.id, "ad yok");
    if (!Array.isArray(k.anlatim) || k.anlatim.length < 2) sorun(k.id, "en az 2 anlatım bölümü olmalı");
    (k.anlatim || []).forEach((a, i) => {
      if (!a.baslik || !a.metin || !a.ornek) sorun(k.id + " anlatım " + i, "baslik/metin/ornek eksik");
      const dr = a.durak; say.durak++;
      if (!dr || !dr.soru || !Array.isArray(dr.secenekler) || dr.secenekler.length !== 4) { sorun(k.id + " anlatım " + i, "durak 4 seçenekli olmalı"); return; }
      if (dr.secenekler.filter(s => s[1] === true).length !== 1) sorun(k.id + " durak " + i, "tam bir doğru seçenek olmalı");
      dr.secenekler.forEach(s => { if (!s[0] || !s[2]) sorun(k.id + " durak " + i, "seçenek metni ya da açıklaması boş"); });
    });
    // Oyun görevleri (Türkçe Diyarı): eşleştirme, sıralama ve kelime üretme
    if (d.id === "tr") {
      if (!k.gorev || !k.sayfa) sorun(k.id, "gorev ve sayfa alanları gerekli");
      const kazIds = new Set((k.kazanimlar || []).map(z => z.id));
      const trKucuk = x => x.toLocaleLowerCase("tr-TR");
      (k.oyun || []).forEach((o, i) => {
        const yer = k.id + " oyun " + i; say.oyun = (say.oyun || 0) + 1;
        if (!kazIds.has(o.kaz)) sorun(yer, "kaz bu konunun kazanımı olmalı: " + o.kaz);
        if (!o.soru || !o.aciklama) sorun(yer, "soru/aciklama boş");
        if (o.tur === "eslestir") {
          if (!Array.isArray(o.ciftler) || o.ciftler.length < 3 || o.ciftler.length > 4) sorun(yer, "eşleştirmede 3–4 çift olmalı");
          else { const sol = o.ciftler.map(c => c[0]), sag = o.ciftler.map(c => c[1]); if (new Set(sol).size !== sol.length || new Set(sag).size !== sag.length || o.ciftler.some(c => !c[0] || !c[1])) sorun(yer, "eşleştirmede tekrar ya da boş öğe"); }
        } else if (o.tur === "sirala") {
          if (!Array.isArray(o.ogeler) || o.ogeler.length < 3 || o.ogeler.length > 5 || new Set(o.ogeler).size !== o.ogeler.length) sorun(yer, "sıralamada 3–5 farklı öğe olmalı");
        } else if (o.tur === "uret") {
          const harf = [...trKucuk(o.harfler || "")].filter(c => c.trim());
          if (harf.length < 4 || harf.length > 9) sorun(yer, "kelime üretmede 4–9 harf olmalı");
          if (!Array.isArray(o.kelimeler) || o.kelimeler.length < (o.hedef || 3)) sorun(yer, "kabul edilen kelime sayısı hedeften az");
          (o.kelimeler || []).forEach(w => { const kal = harf.slice(); for (const c of trKucuk(w)) { const j = kal.indexOf(c); if (j < 0) { sorun(yer, `“${w}” verilen harflerle yazılamıyor`); return; } kal.splice(j, 1); } if (w.length < 2) sorun(yer, "çok kısa kelime: " + w); });
          if (!(o.hedef >= 2 && o.hedef <= 5)) sorun(yer, "hedef 2–5 olmalı");
        } else sorun(yer, "bilinmeyen oyun türü: " + o.tur);
      });
      if ((k.oyun || []).length < 2) sorun(k.id, "en az 2 oyun görevi (eşleştirme/sıralama/kelime üretme) olmalı");
    }
    for (const z of k.kazanimlar || []) {
      say.kaz++;
      if (ids.has(z.id)) sorun(z.id, "kazanım kimliği tekrar ediyor"); ids.add(z.id);
      const u = (k.uret || {})[z.id];
      if (!u || !u.length) { sorun(z.id, "üreteç yok"); continue; }
      const metinler = new Set();
      u.forEach((f, ui) => {
        say.uretec++;
        let bos = 0;
        for (let i = 0; i < 40; i++) {
          let q; try { q = f(2); } catch (e) { sorun(`${z.id}#${ui}`, "hata: " + e.message); break; }
          if (!q) { bos++; continue; }
          say.soru++; metinler.add(q.soru + "|" + q.secenekler.map(s => s.m).sort().join("|"));
          const yer = `${z.id}#${ui}`;
          if (q.kaz !== z.id) sorun(yer, "kaz alanı yanlış: " + q.kaz);
          if (!DUZEY.includes(q.duzey)) sorun(yer, "düzey geçersiz: " + q.duzey);
          if (![1, 2, 3].includes(q.zorluk)) sorun(yer, "zorluk 1-3 olmalı");
          if (!q.soru || !q.ipucu) sorun(yer, "soru/ipucu boş");
          if (!Array.isArray(q.cozum) || q.cozum.length < 2) sorun(yer, "çözüm en az 2 adım olmalı");
          if (q.secenekler.length !== 4) sorun(yer, "4 seçenek olmalı");
          if (q.secenekler.filter(s => s.dogru).length !== 1) sorun(yer, "tam bir doğru olmalı");
          if (new Set(q.secenekler.map(s => s.m)).size !== 4) sorun(yer, "seçenekler aynı");
          q.secenekler.forEach(s => {
            if (s.m === "Hiçbiri") sorun(yer, "yedek 'Hiçbiri' seçeneği oluştu (3 farklı çeldirici verin)");
            if (!s.dogru && (!HATA.includes(s.hata) || !s.neden)) sorun(yer, "çeldiricinin hata türü/nedeni eksik: " + s.m);
            if (/undefined|NaN|null/.test(s.m)) sorun(yer, "seçenekte undefined/NaN: " + s.m);
          });
          if (/undefined|NaN/.test(q.soru + q.cozum.join(" "))) sorun(yer, "metinde undefined/NaN");
        }
        if (bos === 40) sorun(`${z.id}#${ui}`, "üreteç hep null döndü");
      });
      say.benzersiz += metinler.size;
    }
  }
}
const tekil = [...new Set(sorunlar)];
console.log(`konu ${say.konu} · kazanım ${say.kaz} · üreteç ${say.uretec} · durak ${say.durak} · denenen soru ${say.soru} · farklı soru ${say.benzersiz}${say.oyun ? " · oyun görevi " + say.oyun : ""}`);
console.log(tekil.length ? "SORUNLAR (" + tekil.length + "):\n" + tekil.slice(0, 80).join("\n") : "SORUN: yok");
process.exit(tekil.length ? 1 : 0);
