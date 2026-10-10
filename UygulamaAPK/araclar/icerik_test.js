// İçerik üreteçlerini binlerce kez çalıştırıp tutarlılığı denetler: node araclar/icerik_test.js
global.window = global;
for (const f of ["ortak", "icerik", "mat_ek", "mat_ek2", "fen", "fen1", "fen2", "fen3", "fen_ek1", "fen_ek2", "tr", "tr1", "tr2", "tr3", "tr_ek1", "tr_ek2", "en", "en1", "en2", "en3", "en4", "en_ek1", "en_ek2", "videolar", "birlestir"]) { try { require("../web/js/" + f + ".js"); } catch (e) { if (e.code !== "MODULE_NOT_FOUND") throw e; console.log("yok:", f); } }
const { KONULAR, KAZANIM, soruUret } = window.ICERIK;
let hata = 0, toplam = 0; const sayac = {};
for (const k of KONULAR) {
  for (const kaz of k.kazanimlar) {
    if (!k.uret[kaz.id]) { console.log("ÜRETEÇ YOK:", kaz.id); hata++; continue; }
    for (const [i, g] of k.uret[kaz.id].entries()) {
      let bos = 0;
      for (let n = 0; n < 400; n++) {
        let s; try { s = g(2); } catch (e) { console.log("İSTİSNA", kaz.id, i, e.message); hata++; break; }
        if (!s) { bos++; continue; }
        toplam++;
        const metinler = s.secenekler.map(x => x.m);
        const sorun = [];
        if (s.secenekler.length !== 4) sorun.push("şık sayısı " + s.secenekler.length);
        if (new Set(metinler).size !== 4) sorun.push("tekrar eden şık");
        if (s.secenekler.filter(x => x.dogru).length !== 1) sorun.push("doğru sayısı");
        if (/NaN|undefined|Infinity|null/.test(s.soru + metinler.join("|") + (s.cozum || []).join("|"))) sorun.push("NaN/undefined");
        if (metinler.includes("Hiçbiri")) sorun.push("dolgu şık");
        if (!s.ipucu || !s.cozum || !s.cozum.length) sorun.push("ipucu/çözüm yok");
        if (s.kaz !== kaz.id) sorun.push("kazanım etiketi " + s.kaz);
        if (sorun.length) { const a = kaz.id + "#" + i + ": " + sorun.join(", "); sayac[a] = (sayac[a] || 0) + 1; if (sayac[a] === 1) console.log(a, "|", s.soru.slice(0, 90), metinler); }
      }
      if (bos > 200) console.log("çok boş dönüş:", kaz.id, i, bos);
    }
  }
}
for (const id of Object.keys(KAZANIM)) for (const z of [1, 2, 3]) { const s = soruUret(id, z); if (!s || !s.id) { console.log("soruUret başarısız", id, z); hata++; } }
const sorunlu = Object.values(sayac).reduce((a, b) => a + b, 0);
console.log(`Toplam ${toplam} soru, sorunlu ${sorunlu} (${(100 * sorunlu / toplam).toFixed(2)}%), hata ${hata}. Kazanım: ${Object.keys(KAZANIM).length}, konu: ${KONULAR.length}`);
