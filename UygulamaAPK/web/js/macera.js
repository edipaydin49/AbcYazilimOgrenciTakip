/* “Matematik Macera Akademisi”: 6. sınıf matematiği için oyunlaştırılmış, sakin bir macera modülü.
 *
 * Rotalar (#/macera/<a>/<b>/<c> → MACERA.ac(a, b, c)):
 *  #/macera                       ana menü
 *  #/macera/harita                macera haritası (6 bölge + Kesirler Macerası)
 *  #/macera/bolge/<id>[/<aşama>]  bölge sayfası; aşama: ogren | uygula | ustalas
 *  #/macera/kesir[/<aşama>]       Kesirler Macerası (etkileşimli kesir akışı)
 *  #/macera/oyunlar               mini oyun listesi
 *  #/macera/oyun/<id>             robot | hazine | atolye
 *  #/macera/gorevler              günlük görevler
 *  #/macera/basarilar             yıldızlar, rozetler, bölge ilerlemesi, rekorlar
 *  #/macera/avatar                avatar, robot adı, hazine sandıkları (macera ayarları)
 *
 * Kalıcı durum DEPO.ayar.macera altında tutulur (şema: VARSAYILAN). Her cevaplanan soru ayrıca
 * DEPO.kaydet("soru", …) ile mod:"macera" olarak kaydedilir (yanlış defteri ve veli paneli için);
 * her biten mini oyun DEPO.kaydet("oyun", { ders:"mat", oyun:"macera-<ad>", puan, yildiz, sure }).
 * Dil: çocuk dostu, kırıcı ifade yok; süre baskısı yok.
 */
(function () {
  "use strict";
  if (!window.ICERIK || !window.OGR || !window.DEPO) return;
  const { KONU, KAZANIM, soruUret } = ICERIK;
  const { R, sec, karistir, ebob, S, G } = OGR;
  const svg = G.svg, yazi = G.yazi;

  /* ============================ ORTAK ARAÇLAR ============================ */
  const $ = s => document.querySelector(s);
  const ana = () => $("#ana");
  const kacis = s => (window.UYG && UYG.kacis ? UYG.kacis(s) : String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])));
  const kalin = s => kacis(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const toast = m => { if (window.UYG && UYG.toast) UYG.toast(m); };
  const git = h => { if (window.UYG && UYG.git) UYG.git(h); else location.hash = h; };
  const yildizYaz = (n, t = 3) => "★".repeat(Math.max(0, Math.min(t, n))) + "☆".repeat(Math.max(0, t - Math.max(0, Math.min(t, n))));
  const bugun = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const gunBasi = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
  /* Tohumlu rastgelelik (günlük görevler aynı gün hep aynı gelsin) */
  function tohumlu(metin) {
    let h = 2166136261; for (let i = 0; i < metin.length; i++) { h ^= metin.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const kesirHTML = (p, q) => `<span class="mac-kesir"><i>${p}</i><i>${q}</i></span>`;

  /* Ekran temizliği: zamanlayıcılar ve dinleyiciler her sayfa değişiminde kaldırılır. */
  let iptal = new AbortController();
  const zamanlar = new Set();
  function zamanla(f, ms) { const id = setTimeout(() => { zamanlar.delete(id); f(); }, ms); zamanlar.add(id); return id; }
  function dinle(el, olay, f, sec_) { el.addEventListener(olay, f, Object.assign({ signal: iptal.signal }, sec_ || {})); }
  function kapat() {
    iptal.abort(); iptal = new AbortController();
    zamanlar.forEach(id => clearTimeout(id)); zamanlar.clear();
    document.querySelectorAll(".mac-kutlama, .mac-hayalet").forEach(e => e.remove());
    aktifMotor = null; aktifOyun = null;
  }

  /* ============================ KALICI DURUM ============================ */
  const BOLGE_IDLER = ["sayilar", "cebir", "sekiller", "nicelikler", "istatistik", "olasilik"];
  const VARSAYILAN = () => ({
    surum: 1,
    avatar: "🦊", robotAd: "Pıtır", aksesuar: null, robotRenk: null,
    aksesuarlar: [], robotRenkler: [],
    robotSeviye: 0, robotEnerji: 0,
    bolgeler: {},            // { sayilar: { ogren: 0-3, uygula: 0-3, ustalas: 0-3 }, …, kesir: {…} }
    rozetler: {},            // { rozetId: kazanılma zamanı }
    sandikAcilan: 0,
    bonusYildiz: 0,          // günlük görev ödülleri
    rekorlar: {},            // { robot: puan, hazine: puan, atolye: puan }
    oyunYildiz: {},          // { robot: en iyi yıldız (0-3), … }
    sayac: { ilkDogru: 0, sabir: 0, soru: 0, oyun: 0 },
    gunluk: { tarih: "", gorevler: [], sayac: {}, odul: false },
    son: "",                 // “Devam Et” için son kalınan yer
  });
  function D() {
    const a = DEPO.ayar;
    if (!a.macera || typeof a.macera !== "object") a.macera = VARSAYILAN();
    const m = a.macera, v = VARSAYILAN();
    for (const k in v) if (m[k] === undefined) m[k] = v[k];
    for (const k in v.sayac) if (m.sayac[k] === undefined) m.sayac[k] = 0;
    return m;
  }
  const kaydetDurum = () => { try { DEPO.ayarKaydet(); } catch (e) {} };
  function gunluk() {
    const m = D();
    if (m.gunluk.tarih !== bugun()) m.gunluk = { tarih: bugun(), gorevler: [], sayac: {}, odul: false };
    return m.gunluk;
  }
  function say(ad, n = 1) {   // hem toplam hem günlük sayaç
    const m = D(); m.sayac[ad] = (m.sayac[ad] || 0) + n;
    const g = gunluk(); g.sayac[ad] = (g.sayac[ad] || 0) + n;
  }
  const bolgeYildiz = id => { const b = D().bolgeler[id] || {}; return (b.ogren || 0) + (b.uygula || 0) + (b.ustalas || 0); };
  function toplamYildiz() {
    const m = D();
    let t = 0; for (const id in m.bolgeler) t += bolgeYildiz(id);
    for (const k in m.oyunYildiz) t += m.oyunYildiz[k] || 0;
    return t + (m.bonusYildiz || 0);
  }
  const sandikHakki = () => Math.max(0, Math.floor(toplamYildiz() / 10) - D().sandikAcilan);
  function asamaYildizKaydet(bolgeId, asama, y) {
    const m = D(); const b = m.bolgeler[bolgeId] = m.bolgeler[bolgeId] || {};
    const eski = b[asama] || 0; b[asama] = Math.max(eski, y);
    kaydetDurum();
    return b[asama] - eski;
  }
  const hepsiAcik = () => !!DEPO.ayar.oyunHepsiAcik;
  const bolgeAcik = i => hepsiAcik() || i === 0 || bolgeYildiz(BOLGE_IDLER[i - 1]) >= 6;
  /* Yanlış defterinden düzeltilen sorular (uygulamanın ortak defteri: mod "hata" / "yenidenCoz" ya da ref'li tekrar) */
  const defterDuzeltme = (sinir = 0) => DEPO.liste("soru").filter(s => s.t >= sinir && s.ilkDogru && (s.mod === "hata" || s.mod === "yenidenCoz")).length;

  /* ============================ STİLLER ============================ */
  function stilEkle() {
    if (document.getElementById("macera-stil")) return;
    const st = document.createElement("style"); st.id = "macera-stil";
    st.textContent = `
.mac { display: grid; gap: 16px; min-width: 0; }
.mac * { min-width: 0; }
.mac-bas { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 14px; align-items: center; }
.mac-avatar { position: relative; width: 76px; height: 76px; border-radius: 50%; background: var(--sun-soft); border: 3px solid var(--sun); display: grid; place-items: center; font-size: 2.6rem; line-height: 1; flex: none; }
.mac-avatar .aks { position: absolute; top: -12px; right: -8px; font-size: 1.6rem; }
.mac-avatar.kucuk { width: 52px; height: 52px; font-size: 1.8rem; border-width: 2px; } .mac-avatar.kucuk .aks { font-size: 1.1rem; top: -8px; right: -6px; }
.mac-robot { width: 96px; height: 110px; flex: none; }
.mac-robot.buyuk { width: 150px; height: 172px; }
.mac-balon { position: relative; background: var(--cobalt-soft); border-radius: 14px; padding: 10px 12px; font-size: 1rem; }
.mac-sayaclar { display: flex; flex-wrap: wrap; gap: 8px; }
.mac-sayaclar span { background: var(--sun-soft); border: 1px solid var(--sun); border-radius: 999px; padding: 4px 12px; font-weight: 800; font-variant-numeric: tabular-nums; white-space: nowrap; }
.mac-menu { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
.mac-dugme { display: grid; place-items: center; align-content: center; gap: 4px; min-height: 92px; padding: 10px; border-radius: 16px; border: 2px solid var(--line); background: var(--sheet); color: var(--ink); font: inherit; font-weight: 800; cursor: pointer; text-align: center; text-decoration: none; }
.mac-dugme > span:first-child { font-size: 1.9rem; line-height: 1; }
.mac-dugme small { font-weight: 600; color: var(--muted); font-size: .78rem; }
.mac-dugme.ana { border-color: var(--cobalt); background: var(--cobalt-soft); }
.mac-dugme:hover { border-color: var(--cobalt); }
.mac-dugme:focus-visible, .mac-hucre:focus-visible, .mac-parca:focus-visible { outline: 3px solid var(--sun); outline-offset: 2px; }
.mac-harita { width: 100%; max-width: 540px; margin: 0 auto; display: block; height: auto; }
.mac-harita .dugum { cursor: pointer; }
.mac-harita .dugum:focus { outline: none; } .mac-harita .dugum:focus-visible circle.halka { stroke: var(--sun); stroke-width: 6; }
.mac-patika { fill: none; stroke: var(--sun); stroke-width: 10; stroke-linecap: round; stroke-dasharray: 2 18; }
.mac-patika-alt { fill: none; stroke: var(--sun-soft); stroke-width: 22; stroke-linecap: round; }
.mac-bolgeler { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
.mac-bolge { --renk: var(--cobalt); display: grid; grid-template-columns: 54px minmax(0, 1fr); gap: 12px; align-items: center; padding: 12px; border-radius: 16px; border: 2px solid var(--line); border-left: 8px solid var(--renk); background: var(--sheet); color: var(--ink); font: inherit; text-align: left; cursor: pointer; min-height: 72px; }
.mac-bolge .simge { font-size: 2.2rem; text-align: center; }
.mac-bolge.kilitli { opacity: .6; cursor: not-allowed; }
.mac-bolge b { display: block; overflow-wrap: anywhere; }
.mac-yildiz { color: var(--sun); font-weight: 800; letter-spacing: 1px; white-space: nowrap; }
.mac-asamalar { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
.mac-asama { display: grid; gap: 6px; padding: 14px; border-radius: 16px; border: 2px solid var(--line); background: var(--paper); text-align: left; font: inherit; color: var(--ink); cursor: pointer; min-height: 110px; }
.mac-asama:hover { border-color: var(--cobalt); }
.mac-asama .ad { font-size: 1.15rem; font-weight: 800; }
.mac-kartlar { display: grid; gap: 12px; }
.mac-ogren { display: grid; gap: 10px; padding: 14px; border-radius: 16px; background: var(--paper); border: 1px solid var(--line); }
.mac-ogren .gorsel { background: var(--sheet); }
.mac-noktalar { display: flex; gap: 6px; justify-content: center; }
.mac-noktalar i { width: 10px; height: 10px; border-radius: 50%; background: var(--line); } .mac-noktalar i.a { background: var(--cobalt); }
.mac-gezinti { display: flex; gap: 10px; justify-content: space-between; flex-wrap: wrap; }
.mac-gezinti .btn { flex: 1 1 130px; }
.mac-soru .secenekler .sec { min-height: 56px; }
.sec.mac-denendi { opacity: .55; border-style: dashed; background: var(--sheet); }
.sec.mac-denendi b { background: var(--line); }
.mac-mesaj { border-radius: 14px; padding: 12px 14px; display: grid; gap: 6px; }
.mac-mesaj.iyi { background: var(--good-soft); } .mac-mesaj.nazik { background: var(--sun-soft); } .mac-mesaj.bilgi { background: var(--cobalt-soft); }
.mac-adimlar { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; counter-reset: adim; }
.mac-adimlar li { counter-increment: adim; display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 10px; align-items: start; overflow-wrap: anywhere; }
.mac-adimlar li::before { content: counter(adim); width: 28px; height: 28px; border-radius: 50%; background: var(--cobalt); color: var(--sheet); display: grid; place-items: center; font-weight: 800; font-size: .9rem; }
.mac-seri { font-weight: 800; color: var(--warn); }
.mac-kesir { display: inline-grid; vertical-align: middle; text-align: center; line-height: 1.05; margin: 0 2px; font-weight: 800; }
.mac-kesir i { font-style: normal; padding: 0 3px; } .mac-kesir i:first-child { border-bottom: 2px solid currentColor; }
.mac-boya { width: 100%; max-width: 520px; height: auto; display: block; margin: 0 auto; touch-action: manipulation; }
.mac-boya .parca { cursor: pointer; }
.mac-boya .parca:focus-visible { outline: none; stroke: var(--sun); stroke-width: 5; }
.mac-sonuc { text-align: center; justify-items: center; }
.mac-buyuk-yildiz { font-size: 3rem; color: var(--sun); letter-spacing: 6px; line-height: 1.1; }
.mac-enerji { height: 22px; border-radius: 999px; background: var(--cobalt-soft); overflow: hidden; border: 1px solid var(--line); }
.mac-enerji i { display: block; height: 100%; background: linear-gradient(90deg, var(--good), var(--sun)); border-radius: 999px; transition: width .4s ease; }
.mac-robot-sahne { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 14px; align-items: center; }
.mac-zorluk { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
.mac-izgara { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; width: 100%; max-width: 440px; margin: 0 auto; }
.mac-hucre { aspect-ratio: 1; min-height: 48px; border-radius: 12px; border: 2px solid var(--line); background: var(--good-soft); display: grid; place-items: center; font-size: 1.7rem; line-height: 1; cursor: pointer; padding: 0; color: var(--ink); font-family: inherit; }
.mac-hucre.kaya { background: var(--paper); cursor: default; }
.mac-hucre.komsu { border-color: var(--cobalt); box-shadow: 0 0 0 2px var(--cobalt-soft) inset; }
.mac-hucre.ben { border-color: var(--sun); background: var(--sun-soft); }
.mac-hucre:disabled { cursor: default; }
.mac-tepsi { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; min-height: 110px; padding: 8px; border-radius: 14px; border: 2px dashed var(--line); background: var(--paper); }
.mac-parca { width: 112px; min-height: 104px; padding: 6px; border-radius: 14px; border: 2px solid var(--line); background: var(--sheet); display: grid; place-items: center; gap: 2px; cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; color: var(--ink); font: inherit; }
.mac-parca svg { width: 92px; height: 72px; display: block; pointer-events: none; }
.mac-parca small { font-size: .74rem; font-weight: 700; text-align: center; line-height: 1.1; pointer-events: none; }
.mac-parca.secili { border-color: var(--cobalt); background: var(--cobalt-soft); }
.mac-parca.yerlesti { cursor: default; border-color: var(--good); background: var(--good-soft); }
.mac-hedefler { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
.mac-hedef { min-height: 130px; border-radius: 16px; border: 3px dashed var(--cobalt); background: var(--cobalt-soft); display: grid; align-content: start; justify-items: center; gap: 6px; padding: 8px; cursor: pointer; }
.mac-hedef > b { font-size: .95rem; text-align: center; }
.mac-hedef .ic { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.mac-hedef.ustunde { border-color: var(--sun); background: var(--sun-soft); }
.mac-hayalet { position: fixed; z-index: 70; pointer-events: none; transform: translate(-50%, -50%) scale(1.06); opacity: .92; box-shadow: 0 10px 24px rgba(0,0,0,.25); margin: 0; }
.mac-rozetler { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
.mac-rozet { display: grid; gap: 4px; justify-items: center; text-align: center; padding: 12px 8px; border-radius: 16px; background: var(--sun-soft); border: 2px solid var(--sun); }
.mac-rozet > span { font-size: 2.2rem; line-height: 1.1; }
.mac-rozet small { color: var(--muted); font-size: .76rem; line-height: 1.25; }
.mac-rozet.kilitli { background: var(--paper); border-color: var(--line); }
.mac-rozet.kilitli > span { filter: grayscale(1); opacity: .5; }
.mac-gorev { display: grid; grid-template-columns: 48px minmax(0, 1fr); gap: 12px; align-items: center; padding: 12px; border-radius: 16px; border: 2px solid var(--line); background: var(--sheet); }
.mac-gorev.tamam { border-color: var(--good); background: var(--good-soft); }
.mac-gorev .simge { font-size: 2rem; text-align: center; }
.mac-secim { display: flex; flex-wrap: wrap; gap: 8px; }
.mac-secim button { width: 56px; height: 56px; border-radius: 14px; border: 2px solid var(--line); background: var(--sheet); font-size: 1.8rem; cursor: pointer; line-height: 1; padding: 0; }
.mac-secim button.secili { border-color: var(--cobalt); background: var(--cobalt-soft); box-shadow: 0 0 0 2px var(--cobalt); }
.mac-secim button:disabled { opacity: .35; cursor: not-allowed; }
.mac-tablo { overflow-x: auto; } .mac-tablo table { min-width: 0; }
.mac-kutlama { position: fixed; inset: 0; z-index: 90; display: grid; place-items: center; padding: 16px; background: rgba(10, 16, 30, .45); }
.mac-kutlama .ic { background: var(--sheet); color: var(--ink); border: 3px solid var(--sun); border-radius: 22px; padding: 20px 22px; text-align: center; display: grid; gap: 6px; max-width: min(420px, 100%); box-shadow: 0 16px 40px rgba(0,0,0,.3); }
.mac-kutlama .simge { font-size: 4rem; line-height: 1.1; }
.mac-konfeti { position: fixed; top: -20px; z-index: 91; font-size: 1.4rem; pointer-events: none; }
@media (prefers-reduced-motion: no-preference) {
  .mac-kutlama .ic { animation: macGel .45s cubic-bezier(.2, 1.4, .4, 1); }
  .mac-kutlama .simge { animation: macZipla 1s ease-in-out 2; }
  .mac-konfeti { animation: macDus 1.8s ease-in forwards; }
  .mac-robot .govde-g { animation: macSalla 3s ease-in-out infinite; transform-origin: 50% 90%; }
  .mac-hucre.ben { animation: macNabiz 1.6s ease-in-out infinite; }
  @keyframes macGel { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: none; } }
  @keyframes macZipla { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px) scale(1.08); } }
  @keyframes macDus { to { transform: translateY(105vh) rotate(320deg); opacity: .2; } }
  @keyframes macSalla { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
  @keyframes macNabiz { 0%, 100% { box-shadow: 0 0 0 0 var(--sun); } 50% { box-shadow: 0 0 0 4px var(--sun-soft); } }
}
@media (max-width: 560px) {
  .mac-avatar { width: 62px; height: 62px; font-size: 2.1rem; }
  .mac-robot { width: 76px; height: 88px; }
  .mac-robot.buyuk { width: 110px; height: 126px; }
  .mac-menu { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .mac-dugme { min-height: 84px; font-size: .95rem; }
  .mac-parca { width: 96px; } .mac-parca svg { width: 80px; height: 62px; }
  .mac-hucre { font-size: 1.4rem; }
  .mac-robot-sahne { grid-template-columns: 1fr; justify-items: center; }
}`;
    document.head.appendChild(st);
  }

  /* Kısa kutlama (rozet, sandık, seviye): CSS animasyonu, dokununca ya da 2,5 sn sonra kapanır. */
  function kutla(simge, baslik, metin) {
    document.querySelectorAll(".mac-kutlama").forEach(e => e.remove());
    const k = document.createElement("div"); k.className = "mac-kutlama"; k.setAttribute("role", "dialog"); k.setAttribute("aria-live", "polite");
    k.innerHTML = `<div class="ic"><div class="simge">${simge}</div><h2>${kacis(baslik)}</h2>${metin ? `<p>${kacis(metin)}</p>` : ""}<p class="kucuk-yazi muted">Kapatmak için dokun</p></div>`;
    const kaldir = () => { k.remove(); document.querySelectorAll(".mac-konfeti").forEach(e => e.remove()); };
    k.addEventListener("click", kaldir);
    document.body.appendChild(k);
    for (let i = 0; i < 14; i++) { const c = document.createElement("span"); c.className = "mac-konfeti"; c.textContent = sec(["⭐", "✨", "🎉", "🌟"]); c.style.left = (4 + Math.random() * 92) + "vw"; c.style.animationDelay = (Math.random() * 0.5) + "s"; document.body.appendChild(c); setTimeout(() => c.remove(), 2600); }
    setTimeout(kaldir, 2600);
  }

  let aktifMotor = null, aktifOyun = null;

  /* ============================ SORU KURUCU ============================
   * Kendi üreteçlerimiz uygulamanın soru biçimini kullanır (OGR.S): 4 farklı seçenek, tek doğru,
   * 4–6 adımlı çözüm, SVG görsel. İçeriği uygulamada olmayan bölgelerde kaz/konu null, bolge alanı dolu.
   */
  function gecerli(q) {
    if (!q || !Array.isArray(q.secenekler) || q.secenekler.length !== 4) return false;
    if (q.secenekler.filter(x => x.dogru).length !== 1) return false;
    const m = q.secenekler.map(x => String(x.m).trim());
    if (new Set(m).size !== 4 || m.some(x => !x || x === "Hiçbiri" || /NaN|undefined|Infinity/.test(x))) return false;
    return Array.isArray(q.cozum) && q.cozum.length >= 3 && !!q.soru;
  }
  function kur(o) {
    const yanlis = (o.yanlis || []).filter(y => String(y[0]) !== String(o.dogru));
    let q = S(Object.assign({}, o, { yanlis }));
    if (o.sirali) {   // harfli seçenekler (A, B, C, D) sırasını korusun
      const dogruM = String(o.dogru);
      q.secenekler = o.sirali.map(m => q.secenekler.find(x => x.m === String(m)) || { m: String(m), dogru: String(m) === dogruM, hata: "dikkat", neden: "" });
    }
    q.ders = "mat"; q.konu = o.konu || null; q.tema = o.konu && KONU[o.konu] ? KONU[o.konu].tema : null; q.kaz = o.kaz || null;
    q.bolge = o.bolge; q.ipucu2 = o.ipucu2 || null; q.etkilesim = o.etkilesim || null;
    q.id = "mac:" + o.bolge + ":" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    return q;
  }
  /* Bir üreteçten geçerli soru alana kadar dener (en çok 25 kez). */
  function guvenli(f, z) {
    let q = null;
    for (let i = 0; i < 25; i++) { try { q = f(z); } catch (e) { q = null; } if (gecerli(q)) return q; }
    return q;
  }
  const isaretli = (b, ust = "−") => b >= 0 ? " + " + b : " " + ust + " " + (-b);
  const ifade = (a, b, v = "n") => (a === 1 ? v : a + v) + (b ? isaretli(b) : "");

  /* ============================ SVG YARDIMCILARI ============================ */
  const rad = d => d * Math.PI / 180;
  const f1 = x => Math.round(x * 10) / 10;
  function kutuSvg(x, y, w, h, metin, sinif = "g-yumusak") {
    return `<rect class="${sinif} g-cizgi" x="${x}" y="${y}" width="${w}" height="${h}" rx="10" stroke-width="2"/>` + yazi(x + w / 2, y + h / 2 + 6, metin, { b: 1 });
  }
  /* İşlem makinesi: giriş → adımlar → çıkış */
  function makineSvg(giris, adimlar, cikis = "?") {
    const kutular = [giris, ...adimlar, cikis], w = 96, ara = 34, W = kutular.length * w + (kutular.length - 1) * ara + 20;
    let ic = "";
    kutular.forEach((k, i) => {
      const x = 10 + i * (w + ara);
      ic += kutuSvg(x, 20, w, 56, k, i === 0 ? "g-bos" : i === kutular.length - 1 ? "g-b" : "g-yumusak");
      if (i < kutular.length - 1) ic += G.ok(x + w + 3, 48, x + w + ara - 3, 48);
    });
    return svg(W, 96, ic, "işlem makinesi");
  }
  /* Örüntü: her adımda a sütun mavi nokta (a·n) + b turuncu nokta (sabit) */
  function oruntuSvg(a, b, adimSay = 3) {
    const r = 6, d = 16, satir = Math.max(a, b, 1);
    let x = 14, ic = "";
    for (let k = 1; k <= adimSay; k++) {
      const x0 = x;
      for (let i = 0; i < b; i++) ic += `<circle class="g-b g-cizgi" cx="${x + r}" cy="${18 + i * d + r}" r="${r}"/>`;
      if (b > 0) x += d;
      for (let c = 0; c < k; c++) { for (let i = 0; i < a; i++) ic += `<circle class="g-a" cx="${x + r}" cy="${18 + i * d + r}" r="${r}"/>`; x += d; }
      ic += yazi((x0 + x - 4) / 2, 18 + satir * d + 22, k + ". adım", { k: 1 });
      x += 30;
    }
    return svg(x, satir * d + 50, ic, "şekil örüntüsü");
  }
  /* Açı: köşe (200, 185), bir kol sağa, diğeri m derece; isteğe bağlı açıölçer */
  function aciSvg(m, { olcer = false, etiket = null } = {}) {
    const cx = 200, cy = 185, L = 150;
    let ic = "";
    if (olcer) {
      ic += `<path class="g-yumusak g-cizgi" d="M${cx - 160} ${cy} A160 160 0 0 1 ${cx + 160} ${cy} Z" stroke-width="1.5" fill-opacity=".55"/>`;
      for (let d = 0; d <= 180; d += 5) {
        const u = d % 10 === 0 ? 14 : 7, c = Math.cos(rad(d)), s = Math.sin(rad(d));
        ic += `<line class="g-cizgi" x1="${f1(cx + 160 * c)}" y1="${f1(cy - 160 * s)}" x2="${f1(cx + (160 - u) * c)}" y2="${f1(cy - (160 - u) * s)}" stroke-width="1"/>`;
        if (d % 10 === 0) {
          ic += `<text class="g-yazi-k" x="${f1(cx + 136 * c)}" y="${f1(cy - 136 * s + 4)}" text-anchor="middle" font-size="11">${d}</text>`;
          if (d % 30 === 0) ic += `<text class="g-yazi-k" x="${f1(cx + 112 * c)}" y="${f1(cy - 112 * s + 4)}" text-anchor="middle" font-size="9" opacity=".75">${180 - d}</text>`;
        }
      }
      ic += `<circle class="g-cizgi-uc" cx="${cx}" cy="${cy}" r="3"/>`;
    }
    const x2 = cx + L * Math.cos(rad(m)), y2 = cy - L * Math.sin(rad(m));
    if (m === 90 && !olcer) ic += `<path class="g-cizgi" d="M${cx + 22} ${cy} L${cx + 22} ${cy - 22} L${cx} ${cy - 22}" fill="none" stroke-width="2"/>`;
    else if (!olcer) ic += `<path class="g-ok-a" d="M${cx + 34} ${cy} A34 34 0 0 0 ${f1(cx + 34 * Math.cos(rad(m)))} ${f1(cy - 34 * Math.sin(rad(m)))}" fill="none" stroke-width="3"/>`;
    ic += `<line class="g-cizgi" x1="${cx}" y1="${cy}" x2="${cx + L + (olcer ? 20 : 0)}" y2="${cy}" stroke-width="4" stroke-linecap="round"/>`;
    ic += `<line class="g-cizgi" x1="${cx}" y1="${cy}" x2="${f1(cx + (L + (olcer ? 20 : 0)) * Math.cos(rad(m)))}" y2="${f1(cy - (L + (olcer ? 20 : 0)) * Math.sin(rad(m)))}" stroke-width="4" stroke-linecap="round"/>`;
    if (etiket) ic += yazi(f1(cx + 62 * Math.cos(rad(m / 2))), f1(cy - 62 * Math.sin(rad(m / 2)) + 5), etiket, { b: 1 });
    void x2; void y2;
    return svg(400, 200, ic, olcer ? "açıölçer üzerinde bir açı" : "bir açı");
  }
  /* Açıları verilen üçgen (A sol alt, B sağ alt) */
  function ucgenAciSvg(a, b, etiketler) {
    const c = 180 - a - b, L = 100, AC = L * Math.sin(rad(b)) / Math.sin(rad(c));
    const P = [[0, 0], [L, 0], [AC * Math.cos(rad(a)), AC * Math.sin(rad(a))]];
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
    const mnx = Math.min(...xs), mxx = Math.max(...xs), mxy = Math.max(...ys);
    const k = Math.min(300 / (mxx - mnx), 150 / mxy), W = 360, H = 200;
    const Q = P.map(([x, y]) => [f1(30 + (x - mnx) * k + (300 - (mxx - mnx) * k) / 2), f1(H - 25 - y * k)]);
    let ic = `<polygon class="g-yumusak g-cizgi" points="${Q.map(p => p.join(",")).join(" ")}" stroke-width="3"/>`;
    const ic_ = [(Q[0][0] + Q[1][0] + Q[2][0]) / 3, (Q[0][1] + Q[1][1] + Q[2][1]) / 3];
    Q.forEach((p, i) => { const dx = ic_[0] - p[0], dy = ic_[1] - p[1], u = Math.hypot(dx, dy) || 1, t = Math.min(34, u * 0.55); ic += yazi(f1(p[0] + dx / u * t), f1(p[1] + dy / u * t + 5), etiketler[i], { b: 1 }); });
    return svg(W, H, ic, "üçgen ve iç açıları");
  }
  /* Kenarları verilen üçgen (kenar uzunlukları etiketli) */
  function ucgenKenarSvg(a, b, c) {   // a: taban (AB), b: BC, c: CA
    const cosA = (a * a + c * c - b * b) / (2 * a * c), A = Math.acos(Math.max(-1, Math.min(1, cosA)));
    const P = [[0, 0], [a, 0], [c * Math.cos(A), c * Math.sin(A)]];
    const xs = P.map(p => p[0]), mnx = Math.min(...xs), mxx = Math.max(...xs), mxy = Math.max(...P.map(p => p[1]));
    const k = Math.min(280 / (mxx - mnx), 140 / mxy), H = 200;
    const Q = P.map(([x, y]) => [f1(40 + (x - mnx) * k + (280 - (mxx - mnx) * k) / 2), f1(H - 30 - y * k)]);
    let ic = `<polygon class="g-yumusak g-cizgi" points="${Q.map(p => p.join(",")).join(" ")}" stroke-width="3"/>`;
    const orta = [(Q[0][0] + Q[1][0] + Q[2][0]) / 3, (Q[0][1] + Q[1][1] + Q[2][1]) / 3];
    [[0, 1, a], [1, 2, b], [2, 0, c]].forEach(([i, j, v]) => { const mx = (Q[i][0] + Q[j][0]) / 2, my = (Q[i][1] + Q[j][1]) / 2, dx = mx - orta[0], dy = my - orta[1], u = Math.hypot(dx, dy) || 1; ic += yazi(f1(mx + dx / u * 20), f1(my + dy / u * 20 + 5), v + " cm", { b: 1 }); });
    return svg(360, H, ic, "kenar uzunlukları verilen üçgen");
  }
  function cokgenSvg(n, { numara = false } = {}) {
    const cx = 120, cy = 100, r = 80, P = [];
    for (let i = 0; i < n; i++) { const t = -Math.PI / 2 + i * 2 * Math.PI / n + (n % 2 ? 0 : Math.PI / n); P.push([f1(cx + r * Math.cos(t)), f1(cy + r * Math.sin(t))]); }
    let ic = `<polygon class="g-yumusak g-cizgi" points="${P.map(p => p.join(",")).join(" ")}" stroke-width="3"/>`;
    if (numara) P.forEach((p, i) => { const q = P[(i + 1) % n], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = mx - cx, dy = my - cy, u = Math.hypot(dx, dy) || 1; ic += yazi(f1(mx + dx / u * 14), f1(my + dy / u * 14 + 5), i + 1, { k: 1 }); });
    return svg(240, 200, ic, n + " kenarlı çokgen");
  }
  /* Dikdörtgen (isteğe bağlı birim kare ızgarası) */
  function dikdortgenSvg(a, b, { izgara = false, ust = a + " cm", yan = b + " cm" } = {}) {
    const k = Math.min(280 / a, 150 / b, 34), w = a * k, h = b * k, x = 60, y = 20;
    let ic = `<rect class="g-yumusak g-cizgi" x="${x}" y="${y}" width="${f1(w)}" height="${f1(h)}" stroke-width="3"/>`;
    if (izgara) { for (let i = 1; i < a; i++) ic += `<line class="g-ince" x1="${f1(x + i * k)}" y1="${y}" x2="${f1(x + i * k)}" y2="${f1(y + h)}"/>`; for (let j = 1; j < b; j++) ic += `<line class="g-ince" x1="${x}" y1="${f1(y + j * k)}" x2="${f1(x + w)}" y2="${f1(y + j * k)}"/>`; }
    ic += yazi(f1(x + w / 2), f1(y + h + 24), ust, { b: 1 }) + yazi(x - 8, f1(y + h / 2 + 5), yan, { a: "end", b: 1 });
    return svg(f1(x + w + 30), f1(y + h + 36), ic, "dikdörtgen");
  }
  function ucgenAlanSvg(t, h, kayma) {
    const k = Math.min(260 / t, 140 / h), x = 50, yb = 170, W = 360;
    const A = [x, yb], B = [x + t * k, yb], C = [x + kayma * t * k, yb - h * k];
    let ic = `<polygon class="g-yumusak g-cizgi" points="${[A, B, C].map(p => p.map(f1).join(",")).join(" ")}" stroke-width="3"/>`;
    ic += `<line class="g-ok-d" x1="${f1(C[0])}" y1="${f1(C[1])}" x2="${f1(C[0])}" y2="${yb}" stroke-width="2" stroke-dasharray="6 5"/>`;
    ic += `<path class="g-cizgi" d="M${f1(C[0])} ${yb - 12} h${C[0] > (A[0] + B[0]) / 2 ? -12 : 12} v12" fill="none" stroke-width="1.5"/>`;
    ic += yazi(f1((A[0] + B[0]) / 2), yb + 24, "taban " + t + " cm", { b: 1 }) + yazi(f1(C[0] + (C[0] > (A[0] + B[0]) / 2 ? -8 : 8)), f1((C[1] + yb) / 2 + 5), "h = " + h + " cm", { a: C[0] > (A[0] + B[0]) / 2 ? "end" : "start", b: 1 });
    return svg(W, 200, ic, "üçgen, taban ve yükseklik");
  }
  function paralelkenarSvg(t, h, kenar) {
    const kay = Math.sqrt(Math.max(1, kenar * kenar - h * h));
    const k = Math.min(250 / (t + kay), 130 / h), x = 40, yb = 165;
    const P = [[x, yb], [x + t * k, yb], [x + (t + kay) * k, yb - h * k], [x + kay * k, yb - h * k]].map(p => p.map(f1));
    let ic = `<polygon class="g-yumusak g-cizgi" points="${P.map(p => p.join(",")).join(" ")}" stroke-width="3"/>`;
    ic += `<line class="g-ok-d" x1="${P[3][0]}" y1="${P[3][1]}" x2="${P[3][0]}" y2="${yb}" stroke-width="2" stroke-dasharray="6 5"/><path class="g-cizgi" d="M${P[3][0]} ${yb - 12} h12 v12" fill="none" stroke-width="1.5"/>`;
    ic += yazi(f1((P[0][0] + P[1][0]) / 2), yb + 24, "taban " + t + " cm", { b: 1 }) + yazi(P[3][0] + 6, f1((P[3][1] + yb) / 2 + 5), "h = " + h + " cm", { a: "start", b: 1 });
    ic += yazi(f1((P[0][0] + P[3][0]) / 2 - 8), f1((P[0][1] + P[3][1]) / 2), kenar + " cm", { a: "end", b: 1 });
    return svg(f1(P[2][0] + 30), 200, ic, "paralelkenar");
  }
  /* Birim karelerden şekil (ızgara üzerinde) */
  function parcaSekilSvg(hucreler, sut = 7, sat = 5) {
    const b = 34, x0 = 10, y0 = 10, ks = new Set(hucreler.map(h => h.join(",")));
    let ic = "";
    for (let i = 0; i < sat; i++) for (let j = 0; j < sut; j++) ic += `<rect class="${ks.has(i + "," + j) ? "g-a" : "g-bos"} g-ince" x="${x0 + j * b}" y="${y0 + i * b}" width="${b}" height="${b}"${ks.has(i + "," + j) ? ' fill-opacity=".8"' : ""}/>`;
    ic += `<rect class="g-a" x="${x0 + sut * b + 14}" y="${y0}" width="22" height="22" fill-opacity=".8"/>` + yazi(x0 + sut * b + 42, y0 + 16, "= 1 birim kare", { a: "start", k: 1 });
    return svg(x0 + sut * b + 150, y0 + sat * b + 10, ic, "birim karelerden oluşan şekil");
  }
  /* Kesir şeridi / pasta (boyalı parça kümesi ile) */
  function seritSvg(q, boyali, { w = 480, h = 70, y = 6, etiket = null, tikla = false } = {}) {
    const b = w / q; let ic = "";
    for (let i = 0; i < q; i++) ic += `<rect class="${boyali.has(i) ? "g-b" : "g-bos"} g-cizgi${tikla ? " parca" : ""}" ${tikla ? `data-parca="${i}" tabindex="0" role="button" aria-label="${i + 1}. parça"` : ""} x="${f1(10 + i * b)}" y="${y}" width="${f1(b)}" height="${h}" stroke-width="2"/>`;
    if (etiket) ic += yazi(w + 20, y + h / 2 + 6, etiket, { a: "start", b: 1 });
    return ic;
  }
  function pastaSvg(q, boyali, { tikla = false, cx = 110, cy = 110, r = 100 } = {}) {
    let ic = "";
    for (let i = 0; i < q; i++) {
      const t1 = -Math.PI / 2 + i * 2 * Math.PI / q, t2 = t1 + 2 * Math.PI / q;
      const d = q === 1 ? `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} Z` : `M${cx} ${cy} L${f1(cx + r * Math.cos(t1))} ${f1(cy + r * Math.sin(t1))} A${r} ${r} 0 ${q === 2 ? 0 : 0} 1 ${f1(cx + r * Math.cos(t2))} ${f1(cy + r * Math.sin(t2))} Z`;
      ic += `<path class="${boyali.has(i) ? "g-b" : "g-bos"} g-cizgi${tikla ? " parca" : ""}" ${tikla ? `data-parca="${i}" tabindex="0" role="button" aria-label="${i + 1}. dilim"` : ""} d="${d}" stroke-width="2"/>`;
    }
    return ic;
  }
  const ilkN = n => new Set(Array.from({ length: n }, (_, i) => i));
  function sayiDogrusuSvg(q, ust, noktalar) {   // 0..ust, her birim q parçaya bölünmüş; noktalar: [{v (parça), ad}]
    const W = 620, sol = 30, sag = 30, y = 50, top = ust * q, xk = v => sol + (W - sol - sag) * v / top;
    let ic = `<line class="g-cizgi" x1="${sol - 12}" y1="${y}" x2="${W - sag + 12}" y2="${y}" stroke-width="2"/>`;
    for (let v = 0; v <= top; v++) { const tam = v % q === 0; ic += `<line class="g-cizgi" x1="${f1(xk(v))}" y1="${y - (tam ? 13 : 8)}" x2="${f1(xk(v))}" y2="${y + (tam ? 13 : 8)}" stroke-width="${tam ? 3 : 1.5}"/>`; if (tam) ic += yazi(f1(xk(v)), y + 36, v / q, { b: 1 }); }
    noktalar.forEach(n => { ic += `<circle class="g-d" cx="${f1(xk(n.v))}" cy="${y}" r="7"/>` + yazi(f1(xk(n.v)), y - 20, n.ad, { b: 1 }); });
    return svg(W, 96, ic, "sayı doğrusu");
  }

  /* ============================ CEBİR ÜRETEÇLERİ ============================ */
  const CEBIR = {
    /* İfadenin değeri */
    deger(z) {
      const a = R(2, z >= 2 ? 9 : 5), n = R(2, z >= 3 ? 12 : 6), eksi = z >= 3 && Math.random() < 0.5;
      let b = R(1, z >= 2 ? 15 : 9); if (eksi && b >= a * n) b = R(1, a * n - 1);
      const bb = eksi ? -b : b, v = a * n + bb, ifd = ifade(a, bb);
      const isl = eksi ? "çıkarma" : "toplama";
      return kur({ bolge: "cebir", duzey: "uygulama", zorluk: z, soru: `<b>${ifd}</b> ifadesinin <b>n = ${n}</b> için değeri kaçtır?`, dogru: v,
        dogruNeden: `${a} × ${n} = ${a * n}; ${a * n}${isaretli(bb)} = ${v}.`,
        yanlis: [[a + n + bb, "kavrama", `${a}n, ${a} ile n'nin çarpımıdır; ${a} ile ${n} toplanmaz.`], [a * (n + bb), "islem", `Önce ${isl} yapılmış; işlem önceliğinde çarpma önce gelir.`], [a * n, "dikkat", `Sabit terimi (${bb > 0 ? "+" : "−"}${Math.abs(bb)}) hesaba katmayı unutmuşsun.`], [Number(String(a) + String(n)) + bb, "kavrama", `${a}n, “${a}${n}” diye yan yana yazılmaz; ${a} × ${n} demektir.`], [a * n - bb, "islem", "İşareti ters kullanmışsın."]],
        ipucu: `${a}n demek ${a} × n demek. Önce çarpmayı yap, sonra ${isl}.`, ipucu2: `n yerine ${n} yaz: ${a} × ${n}${isaretli(bb)}. Önce ${a} × ${n} işlemini yap.`,
        gorsel: makineSvg("n = " + n, ["× " + a, (bb > 0 ? "+ " : "− ") + Math.abs(bb)]),
        cozum: [`🔎 Soruyu anlayalım: ${ifd} ifadesinde n yerine ${n} yazıp sonucu bulacağız.`,
          `💡 Hatırlayalım: ${a}n, ${a} × n demektir. İşlem önceliğinde önce çarpma, sonra ${isl} yapılır.`,
          `✏️ n yerine ${n} yazalım: ${a} × ${n}${isaretli(bb)}.`,
          `✏️ Önce çarpma: ${a} × ${n} = ${a * n}.`,
          `✅ Sonuç: ${a * n}${isaretli(bb)} = ${v}.`,
          `🔁 Kontrol edelim: Makineye ${n} girdi; önce ${a} ile çarpıldı (${a * n}), sonra ${Math.abs(bb)} ${eksi ? "çıkarıldı" : "eklendi"} → ${v}.`],
        kural: "Bir ifadenin değerini bulmak için değişkenin yerine sayıyı yaz; önce çarpma, sonra toplama ya da çıkarma yap." });
    },
    /* Sözel ifadeyi cebirsel ifadeye çevirme */
    sozel(z) {
      const a = R(2, 9); let b = R(1, 9); if (b === a) b = a === 9 ? 8 : a + 1;
      const tip = sec(z === 1 ? ["fazla", "eksik"] : ["fazla", "eksik", "katFazla"]);
      let soz, dogru, yanlis, gorsel, kontrolN = 2, kontrol;
      const kutular = (k, sabit, eksi) => { let ic = "", x = 10; for (let i = 0; i < k; i++) { ic += kutuSvg(x, 20, 52, 46, "n"); x += 58; } if (sabit) { ic += kutuSvg(x, 20, 52, 46, (eksi ? "−" : "+") + sabit, eksi ? "g-bos" : "g-b"); x += 58; } return svg(x + 10, 86, ic, "şerit modeli"); };
      if (tip === "fazla") { soz = `Bir sayının ${a} katının ${b} fazlası`; dogru = `${a}n + ${b}`; kontrol = a * kontrolN + b;
        yanlis = [[`${a}(n + ${b})`, "kavrama", `Bu, sayının ${b} fazlasının ${a} katıdır; sıra önemlidir.`], [`${b}n + ${a}`, "dikkat", "Kat sayısı ile eklenen sayının yerini değiştirmişsin."], [`${a}n − ${b}`, "kavrama", "“Fazlası” toplama demektir, çıkarma değil."], [`n + ${a + b}`, "kavrama", `“${a} katı” çarpma demektir; ${a} eklenmez.`]];
        gorsel = kutular(a, b, false); }
      else if (tip === "eksik") { soz = `Bir sayının ${a} katının ${b} eksiği`; dogru = `${a}n − ${b}`; kontrolN = Math.max(2, Math.ceil((b + 1) / a)); kontrol = a * kontrolN - b;
        yanlis = [[`${a}n + ${b}`, "kavrama", "“Eksiği” çıkarma demektir, toplama değil."], [`${b} − ${a}n`, "kavrama", `${b} eksiği, ${a}n'den ${b} çıkarmaktır; sıra ters olmuş.`], [`${a}(n − ${b})`, "kavrama", `Bu, sayının ${b} eksiğinin ${a} katıdır.`], [`${b}n − ${a}`, "dikkat", "Kat sayısı ile çıkarılan sayının yerini değiştirmişsin."]];
        gorsel = kutular(a, b, true); }
      else { soz = `Bir sayının ${b} fazlasının ${a} katı`; dogru = `${a}(n + ${b})`; kontrol = a * (kontrolN + b);
        yanlis = [[`${a}n + ${b}`, "kavrama", `Bu, sayının ${a} katının ${b} fazlasıdır; önce ${b} eklenip sonra ${a} ile çarpılmalı.`], [`${b}(n + ${a})`, "dikkat", "Sayıların yerini değiştirmişsin."], [`n + ${a * b}`, "kavrama", `Parantezin dışındaki ${a}, n'yi de çarpar.`], [`${a} + n + ${b}`, "kavrama", "“Katı” çarpma demektir."]];
        let ic = "", x = 10; for (let i = 0; i < a; i++) { ic += `<rect class="g-yumusak g-cizgi" x="${x}" y="20" width="40" height="46" rx="6" stroke-width="2"/>` + yazi(x + 20, 49, "n", { b: 1 }) + `<rect class="g-b g-cizgi" x="${x + 40}" y="20" width="30" height="46" rx="6" stroke-width="2"/>` + yazi(x + 55, 49, b, { k: 1 }); x += 78; }
        gorsel = svg(x + 10, 86, ic, "şerit modeli"); }
      return kur({ bolge: "cebir", duzey: "aciklama", zorluk: z, soru: `“${soz}” ifadesinin cebirsel gösterimi hangisidir? (Sayıya <b>n</b> diyelim.)`, dogru,
        dogruNeden: `Sayı n; ${tip === "katFazla" ? `önce ${b} fazlası (n + ${b}), sonra ${a} katı` : `${a} katı ${a}n, sonra ${b} ${tip === "fazla" ? "fazlası" : "eksiği"}`} → ${dogru}.`,
        yanlis, ipucu: "Cümleyi baştan sona parça parça oku: “katı” çarpma, “fazlası” toplama, “eksiği” çıkarma demektir.",
        ipucu2: tip === "katFazla" ? `Önce n + ${b} yaz, sonra hepsini ${a} ile çarp: parantez kullan.` : `Önce “${a} katı” → ${a}n yaz, sonra ${b} ${tip === "fazla" ? "ekle" : "çıkar"}.`,
        gorsel, cozum: [`🔎 Soruyu anlayalım: “${soz}” sözünü n değişkeniyle yazacağız.`,
          "💡 Hatırlayalım: Bilinmeyen sayıya bir harf (değişken) veririz. “Katı” → çarpma, “fazlası” → toplama, “eksiği” → çıkarma.",
          tip === "katFazla" ? `✏️ Sayının ${b} fazlası: n + ${b}.` : `✏️ Sayının ${a} katı: ${a}n.`,
          tip === "katFazla" ? `✏️ Bunun ${a} katı: ${a}(n + ${b}).` : `✏️ ${b} ${tip === "fazla" ? "fazlası: " + a + "n + " + b : "eksiği: " + a + "n − " + b}.`,
          `✅ Sonuç: ${dogru}.`,
          `🔁 Kontrol edelim: Sayı ${kontrolN} olsun. ${tip === "katFazla" ? `${kontrolN} + ${b} = ${kontrolN + b}, ${a} katı ${kontrol}` : `${kontrolN} × ${a} = ${a * kontrolN}, ${tip === "fazla" ? b + " fazlası" : b + " eksiği"} ${kontrol}`}. İfadede n = ${kontrolN} yazınca da ${kontrol} çıkıyor.`],
        kural: "Sözel ifadeyi cebirsel ifadeye çevirirken cümledeki işlem sırasını koru." });
    },
    /* Örüntü kuralı */
    kural(z) {
      const a = R(2, z === 1 ? 4 : 6); let b = R(1, z === 1 ? 3 : 6); if (z === 3 && Math.random() < 0.4) b = -R(1, a - 1);
      const t = [1, 2, 3, 4].map(k => a * k + b), dogru = ifade(a, b), gorselli = b >= 0 && b <= 3 && a <= 4;
      const yanlis = [[`n + ${a}`, "kavrama", `Terimler ${a}'şer artıyor; bu, n'nin ${a} katı demektir, n'ye ${a} eklemek değil.`], [`${a}n`, "dikkat", `Bu kural ${a}, ${2 * a}, ${3 * a}… verir; sabit terim eksik.`],
        [ifade(a, t[0]), "kavrama", `İlk terimi sabit terim olarak almışsın; n = 1 yazınca ${a + t[0]} çıkar, ${t[0]} değil.`], [ifade(a + 1, b - 1), "dikkat", `Bu kural ilk terimi tutturur ama 2. terim ${2 * (a + 1) + b - 1} olur.`], [b > 0 && b !== a ? ifade(b, a) : ifade(a, b + 1), "islem", "Kuralı n = 1, 2 için dene; terimler tutmuyor."]];
      return kur({ bolge: "cebir", duzey: "uygulama", zorluk: z, soru: gorselli ? `Şekil örüntüsünde adımlardaki nokta sayıları ${t.slice(0, 3).join(", ")}… biçiminde gidiyor. <b>n. adımdaki</b> nokta sayısını veren kural hangisidir?` : `${t.join(", ")}, … sayı örüntüsünün <b>n. terimini</b> veren kural hangisidir?`, dogru,
        dogruNeden: `Terimler ${a}'şer artıyor (${a}n); n = 1 için ${a} × 1${isaretli(b)} = ${t[0]}.`, yanlis,
        ipucu: "Ardışık iki terim arasındaki farkı bul: bu fark, n'nin katsayısıdır.", ipucu2: `Fark ${a}. Kural ${a}n + ? biçiminde. n = 1 yazınca ${t[0]} çıkmalı.`,
        gorsel: gorselli ? oruntuSvg(a, b, 3) : svg(420, 70, t.map((v, i) => kutuSvg(10 + i * 100, 10, 80, 46, v, "g-yumusak") + (i < 3 ? yazi(100 + i * 100, 40, "→", { k: 1 }) : "")).join(""), "sayı örüntüsü"),
        cozum: [`🔎 Soruyu anlayalım: ${t.join(", ")}… örüntüsünün n. terimini veren kuralı bulacağız.`,
          "💡 Hatırlayalım: Terimler hep aynı sayı kadar artıyorsa kural “(fark) × n + (sabit sayı)” biçimindedir.",
          `✏️ Farkı bulalım: ${t[1]} − ${t[0]} = ${a}, ${t[2]} − ${t[1]} = ${a}. O hâlde kural ${a}n ile başlar.`,
          `✏️ Sabit sayıyı bulalım: n = 1 için ${a} × 1 = ${a}; ilk terim ${t[0]} olduğundan ${b >= 0 ? `${b} eklemeliyiz` : `${-b} çıkarmalıyız`}.`,
          `✅ Sonuç: Kural ${dogru}.`,
          `🔁 Kontrol edelim: n = 4 için ${a} × 4${isaretli(b)} = ${t[3]}. Örüntünün 4. terimi de ${t[3]}!`],
        kural: "Sabit artan örüntülerde kural: fark × n + (ilk terim − fark)." });
    },
    /* Kuralı verilen örüntünün istenen terimi */
    terim(z) {
      const a = R(2, z === 1 ? 5 : 9), b = R(1, 9), k = z === 1 ? R(5, 10) : R(10, 25), v = a * k + b, dogru = v;
      return kur({ bolge: "cebir", duzey: "uygulama", zorluk: z, soru: `Kuralı <b>${ifade(a, b)}</b> olan sayı örüntüsünün <b>${k}. terimi</b> kaçtır?`, dogru,
        dogruNeden: `n = ${k}: ${a} × ${k} + ${b} = ${v}.`,
        yanlis: [[a * k, "dikkat", `Sabit terim ${b}'yi eklemeyi unutmuşsun.`], [a + k + b, "kavrama", `${a}n, ${a} × n demektir.`], [a * (k + b), "islem", "Önce toplama yapılmış; işlem önceliğinde çarpma önce gelir."], [a * (k - 1) + b, "dikkat", `Bu, ${k - 1}. terimdir.`], [a * (k + 1) + b, "dikkat", `Bu, ${k + 1}. terimdir.`]],
        ipucu: `n yerine ${k} yaz.`, ipucu2: `${a} × ${k} işlemini yap, sonra ${b} ekle.`,
        gorsel: makineSvg("n = " + k, ["× " + a, "+ " + b]),
        cozum: [`🔎 Soruyu anlayalım: ${ifade(a, b)} kuralında n yerine ${k} yazarak ${k}. terimi bulacağız.`,
          "💡 Hatırlayalım: Örüntünün kuralı, kaçıncı terim istendiğini n yerine yazınca o terimi verir.",
          `✏️ n = ${k} yazalım: ${a} × ${k} + ${b}.`,
          `✏️ Çarpma: ${a} × ${k} = ${a * k}.`,
          `✅ Sonuç: ${a * k} + ${b} = ${v}.`,
          `🔁 Kontrol edelim: İlk terimler ${[1, 2, 3].map(i => a * i + b).join(", ")}… her adımda ${a} artıyor; ${k}. terim ${a + b} + ${k - 1} × ${a} = ${v}. Aynı sonuç!`],
        kural: "Örüntünün n. terimini bulmak için kuralda n yerine sıra numarasını yaz." });
    },
    /* Değişken içeren günlük durumlar */
    degisken(z) {
      const k = R(2, 9), ad = sec(["Ali", "Elif", "Can", "Zeynep", "Mert", "Defne"]);
      const tip = sec(["yas", "kalem", "bilye", "ceviz"]);
      const T = {
        yas: { soru: `${ad}'nin yaşı <b>x</b>'tir. ${k} yıl sonra ${ad} kaç yaşında olur?`, dogru: `x + ${k}`, simge: "🎂", ac: `${k} yıl sonra yaş ${k} artar.`,
          yanlis: [[`x − ${k}`, "kavrama", `Bu, ${k} yıl önceki yaştır.`], [`${k}x`, "kavrama", "Yaş katlanmaz; her yıl 1 artar."], [`${k} − x`, "kavrama", "Sıra ters; yaşa ekleme yapılmalı."], [`x + ${2 * k}`, "islem", `Yalnızca ${k} yıl geçiyor.`]] },
        kalem: { soru: `Bir kalemin fiyatı <b>x</b> TL'dir. ${k} kalem kaç TL eder?`, dogru: `${k}x`, simge: "✏️", ac: `${k} tane x, ${k} × x yani ${k}x eder.`,
          yanlis: [[`x + ${k}`, "kavrama", `${k} kalemin fiyatı, fiyatın ${k} katıdır; ${k} eklenmez.`], [`x − ${k}`, "kavrama", "Kalem sayısı artınca fiyat azalmaz."], [`x ÷ ${k}`, "kavrama", "Bölme, paylaştırmada kullanılır."], [`${k + 1}x`, "islem", `${k} kalem var.`]] },
        bilye: { soru: `${ad}'nin <b>x</b> tane bilyesi var. Kardeşine ${k} bilye verirse kaç bilyesi kalır?`, dogru: `x − ${k}`, simge: "🔵", ac: `Verdiği ${k} bilye x'ten çıkarılır.`,
          yanlis: [[`x + ${k}`, "kavrama", "Bilye verince azalır."], [`${k} − x`, "kavrama", `Sıra ters; x'ten ${k} çıkarılır.`], [`${k}x`, "kavrama", "Vermek çarpma değil, çıkarmadır."], [`x ÷ ${k}`, "kavrama", "Paylaştırma yok; yalnızca bir kısmı veriliyor."]] },
        ceviz: { soru: `<b>x</b> tane ceviz ${k} kişiye eşit olarak paylaştırılıyor. Bir kişiye kaç ceviz düşer?`, dogru: `x ÷ ${k}`, simge: "🌰", ac: `Eşit paylaştırma bölmedir: x ÷ ${k}.`,
          yanlis: [[`${k} ÷ x`, "kavrama", "Bölünen, paylaştırılan ceviz sayısı (x) olmalı."], [`${k}x`, "kavrama", "Paylaştırınca kişi başına düşen azalır."], [`x − ${k}`, "kavrama", `Her kişiye 1 ceviz verilmiyor; eşit paylaştırma bölmedir.`], [`x + ${k}`, "kavrama", "Paylaştırma toplama değildir."]] },
      }[tip];
      return kur({ bolge: "cebir", duzey: "transfer", zorluk: z, soru: T.soru + " Hangi cebirsel ifade bunu gösterir?", dogru: T.dogru, dogruNeden: T.ac, yanlis: T.yanlis,
        ipucu: "Durumu bir sayıyla dene: x yerine 20 yazınca cevap ne olurdu?", ipucu2: T.ac,
        gorsel: svg(360, 100, `<text x="60" y="68" font-size="48" text-anchor="middle">${T.simge}</text>` + kutuSvg(120, 24, 80, 52, "x", "g-yumusak") + G.ok(208, 50, 250, 50) + kutuSvg(256, 24, 90, 52, "?", "g-b"), "durum modeli"),
        cozum: ["🔎 Soruyu anlayalım: Bilinmeyen miktara x denmiş. Durumu x ile yazacağız.",
          "💡 Hatırlayalım: Değişken, değeri bilinmeyen ya da değişebilen bir miktarı gösteren harftir.",
          "✏️ Hangi işlem gerekiyor? " + T.ac,
          `✅ Sonuç: ${T.dogru}.`,
          `🔁 Kontrol edelim: x = 20 olsun → ${tip === "yas" ? 20 + k : tip === "kalem" ? 20 * k : tip === "bilye" ? 20 - k : "20 ÷ " + k}${tip === "ceviz" ? " (ceviz sayısı " + k + "'nin katı olunca tam bölünür)" : ""}. Durumla uyumlu!`],
        kural: "Değişken içeren durumlarda önce hangi işlemin gerektiğine karar ver, sonra harfle yaz." });
    },
    /* Terim, katsayı, sabit terim */
    terimler(z) {
      const a = R(2, 9); let b = R(1, 9); if (b === a) b = a === 9 ? 1 : a + 1;
      const v = sec(["n", "x", "a", "y"]), eksi = Math.random() < 0.4, ifd = `${a}${v}${eksi ? " − " : " + "}${b}`;
      const tip = sec(z === 1 ? ["katsayi", "sabit"] : ["katsayi", "sabit", "sayi"]);
      let soru, dogru, yanlis, ac;
      if (tip === "katsayi") { soru = `<b>${ifd}</b> ifadesinde <b>${v}</b> değişkeninin katsayısı kaçtır?`; dogru = a; ac = `Değişkenin önündeki çarpan ${a}'dır.`;
        yanlis = [[eksi ? -b : b, "kavrama", "Bu, sabit terimdir."], [a + b, "kavrama", "Katsayı, yalnızca değişkenle çarpılan sayıdır."], [1, "bilgi", `${a}${v} = ${a} × ${v}; katsayı ${a}.`], [2, "bilgi", "Terim sayısı ile katsayıyı karıştırma."]]; }
      else if (tip === "sabit") { soru = `<b>${ifd}</b> ifadesinin sabit terimi kaçtır?`; dogru = eksi ? -b : b; ac = `Değişken içermeyen terim ${eksi ? "−" + b : b}'dir.`;
        yanlis = [[a, "kavrama", "Bu, katsayıdır."], [eksi ? b : -b, "dikkat", "Terimin işaretine dikkat et."], [a + b, "kavrama", "Sabit terim tek bir terimdir."], [0, "bilgi", "Değişken içermeyen bir terim var."]]; }
      else { const c = R(2, 9), w = v === "y" ? "x" : "y", ifd3 = `${a}${v} + ${c}${w}${eksi ? " − " : " + "}${b}`; soru = `<b>${ifd3}</b> ifadesi kaç terimlidir?`; dogru = 3; ac = `Terimler: ${a}${v}, ${c}${w} ve ${eksi ? "−" : ""}${b}.`;
        yanlis = [[2, "kavrama", "Sabit terim de bir terimdir."], [1, "bilgi", "+ ve − işaretleri terimleri ayırır."], [4, "kavrama", "Değişken ile katsayı aynı terimin parçalarıdır."], [5, "kavrama", "Terimleri + ve − işaretlerine göre say."]]; }
      const g = tip === "sayi" ? soru.match(/<b>(.+?)<\/b>/)[1] : ifd;
      return kur({ bolge: "cebir", duzey: "hatirlama", zorluk: z, soru, dogru, dogruNeden: ac, yanlis,
        ipucu: "Terimler + ve − işaretleriyle ayrılır. Değişkenin önündeki sayı katsayı, harf içermeyen terim sabit terimdir.", ipucu2: ac.split(";")[0],
        gorsel: svg(380, 80, `<text class="g-yazi" x="190" y="52" text-anchor="middle" font-size="34" font-weight="700">${g}</text>`, "cebirsel ifade"),
        cozum: [`🔎 Soruyu anlayalım: ${g} ifadesinin parçalarını inceleyeceğiz.`,
          "💡 Hatırlayalım: Terimler + ve − işaretleriyle ayrılır. Harfin önündeki çarpan katsayıdır; harf içermeyen terim sabit terimdir.",
          `✏️ Terimleri ayıralım: ${g.split(/ (?=[+−] )/).join(" | ")}.`,
          "✏️ " + ac, `✅ Sonuç: ${dogru}.`],
        kural: "Cebirsel ifadede: terim, katsayı (harfin önündeki sayı) ve sabit terim (harfsiz sayı) vardır." });
    },
  };

  /* ============================ GEOMETRİK ŞEKİLLER ÜRETEÇLERİ ============================ */
  const ACI_TUR = ["Dar açı", "Dik açı", "Geniş açı", "Doğru açı"];
  const aciTurAd = m => m < 90 ? "Dar açı" : m === 90 ? "Dik açı" : m < 180 ? "Geniş açı" : "Doğru açı";
  const COKGEN_AD = { 3: "Üçgen", 4: "Dörtgen", 5: "Beşgen", 6: "Altıgen", 7: "Yedigen", 8: "Sekizgen" };
  const SEKIL = {
    aciTuru(z) {
      const m = sec([sec([25, 30, 40, 45, 50, 60, 70, 75, 80]), 90, sec([100, 110, 120, 130, 135, 140, 150, 160]), ...(z >= 2 ? [sec([85, 95, 170])] : [])]);
      const d = aciTurAd(m);
      return kur({ bolge: "sekiller", duzey: "hatirlama", zorluk: z, soru: `Şekildeki açının ölçüsü <b>${m}°</b>'dir. Bu açı hangi türdendir?`, dogru: d,
        dogruNeden: m < 90 ? `${m}° < 90° olduğu için dar açıdır.` : m === 90 ? "Ölçüsü tam 90° olan açı dik açıdır." : `90° < ${m}° < 180° olduğu için geniş açıdır.`,
        yanlis: ACI_TUR.filter(x => x !== d).map(x => [x, "bilgi", x === "Dar açı" ? "Dar açının ölçüsü 90°'den küçüktür." : x === "Dik açı" ? "Dik açının ölçüsü tam 90°'dir." : x === "Geniş açı" ? "Geniş açının ölçüsü 90° ile 180° arasındadır." : "Doğru açının ölçüsü 180°'dir; kollar bir doğru oluşturur."]),
        ipucu: "Açının ölçüsünü 90° ile karşılaştır.", ipucu2: "Dar: 90°'den küçük · Dik: 90° · Geniş: 90° ile 180° arası · Doğru: 180°.",
        gorsel: aciSvg(m, { etiket: m + "°" }),
        cozum: [`🔎 Soruyu anlayalım: Ölçüsü ${m}° olan açının türünü bulacağız.`,
          "💡 Hatırlayalım: Dar açı < 90°, dik açı = 90°, 90° < geniş açı < 180°, doğru açı = 180°.",
          `✏️ Karşılaştıralım: ${m}° ${m < 90 ? "<" : m === 90 ? "=" : ">"} 90°${m > 90 ? ` ve ${m}° < 180°` : ""}.`,
          `✅ Sonuç: ${d}.`,
          "🔁 Kontrol edelim: Bir kâğıdın köşesi dik açıdır. Köşeyi açının üzerine koyarsan açının ondan küçük, eşit ya da büyük olduğunu görürsün."],
        kural: "Açılar ölçülerine göre dar, dik, geniş ve doğru açı olarak adlandırılır." });
    },
    aciOlc(z) {
      const m = z === 3 ? sec([25, 35, 55, 65, 115, 125, 145, 155, 75, 105]) : sec([20, 30, 40, 50, 60, 70, 80, 100, 110, 120, 130, 140, 150, 160]);
      return kur({ bolge: "sekiller", duzey: "uygulama", zorluk: z, soru: "Açıölçerin merkezi açının köşesine, bir kolu da <b>0</b> çizgisine yerleştirilmiştir. Açının ölçüsü kaç derecedir?", dogru: m + "°",
        dogruNeden: `Kol dış ölçekte 0'dan başlıyor; öbür kol ${m} çizgisinden geçiyor.`,
        yanlis: [[(180 - m) + "°", "dikkat", "İç ölçeği okumuşsun; 0'dan başlayan ölçeği okumalısın."], [(m + 10) + "°", "islem", "Bir çizgi fazla saymışsın."], [(m - 10) + "°", "islem", "Bir çizgi eksik saymışsın."], [(m + 5) + "°", "islem", "Çentikleri dikkatle say."], [(m - 5) + "°", "islem", "Çentikleri dikkatle say."]],
        ipucu: "Açının bir kolu hangi ölçekte 0'ı gösteriyor? O ölçeği oku.", ipucu2: `Dış ölçek sağdan 0 ile başlıyor. Öbür kolun geçtiği çizgiyi bul; açı ${m < 90 ? "dar" : "geniş"} görünüyor.`,
        gorsel: aciSvg(m, { olcer: true }),
        cozum: ["🔎 Soruyu anlayalım: Açıölçerle ölçülen açının ölçüsünü okuyacağız.",
          "💡 Hatırlayalım: Açıölçerin merkezi köşeye konur; bir kol 0 çizgisine hizalanır ve hangi ölçekte 0 varsa o ölçek okunur.",
          "✏️ Alttaki kol sağdaki 0 çizgisinde; bu yüzden dış ölçeği (sağdan başlayan büyük sayıları) okuyacağız.",
          `✏️ Öbür kol dış ölçekte ${m} çizgisinden geçiyor (her uzun çizgi 10°, kısa çizgi 5°).`,
          `✅ Sonuç: Açının ölçüsü ${m}°.`,
          `🔁 Kontrol edelim: Açı ${m < 90 ? "dar" : "geniş"} görünüyor; ${m}° de 90°'den ${m < 90 ? "küçük" : "büyük"}. Uyumlu!`],
        kural: "Açıölçerde, bir kolun 0 ile hizalandığı ölçek okunur." });
    },
    ucgenAci(z) {
      if (z === 1 || Math.random() < 0.5) {
        const a = R(35, 80), b = R(30, 80), c = 180 - a - b;
        if (c < 20) return null;
        return kur({ bolge: "sekiller", duzey: "uygulama", zorluk: z, soru: `Bir üçgenin iki iç açısı <b>${a}°</b> ve <b>${b}°</b>'dir. Üçüncü açının ölçüsü kaç derecedir?`, dogru: c + "°",
          dogruNeden: `İç açılar toplamı 180°: 180° − ${a}° − ${b}° = ${c}°.`,
          yanlis: [[(360 - a - b) + "°", "bilgi", "Üçgenin iç açıları toplamı 360° değil, 180°'dir."], [(a + b) + "°", "kavrama", "İki açıyı toplamak yetmez; toplamı 180°'den çıkarmalısın."], [(180 - a) + "°", "dikkat", `${b}°'yi de çıkarmayı unutmuşsun.`], [(c + 10) + "°", "islem", "Çıkarma işlemini kontrol et."]],
          ipucu: "Üçgenin iç açılarının toplamı kaç derecedir?", ipucu2: `180° − (${a}° + ${b}°) işlemini yap.`,
          gorsel: ucgenAciSvg(a, b, [a + "°", b + "°", "?"]),
          cozum: [`🔎 Soruyu anlayalım: Açıları ${a}° ve ${b}° olan üçgenin üçüncü açısını bulacağız.`,
            "💡 Hatırlayalım: Her üçgende iç açıların toplamı 180°'dir.",
            `✏️ Bilinen açıları toplayalım: ${a}° + ${b}° = ${a + b}°.`,
            `✏️ 180°'den çıkaralım: 180° − ${a + b}° = ${c}°.`,
            `✅ Sonuç: Üçüncü açı ${c}°.`,
            `🔁 Kontrol edelim: ${a}° + ${b}° + ${c}° = 180°. Tamam!`],
          kural: "Üçgenin iç açılarının ölçüleri toplamı 180°'dir." });
      }
      const tur = sec(["dar", "dik", "genis"]);
      let a, b; if (tur === "dik") { a = 90; b = R(25, 65); } else if (tur === "genis") { a = R(100, 140); b = R(15, 180 - a - 15); } else { a = R(50, 80); b = R(Math.max(50, 101 - a), 80); }
      const c = 180 - a - b; if (c <= 0 || (tur === "dar" && c >= 90)) return null;
      const acilar = karistir([a, b, c]), d = { dar: "Dar açılı üçgen", dik: "Dik açılı üçgen", genis: "Geniş açılı üçgen" }[tur];
      return kur({ bolge: "sekiller", duzey: "aciklama", zorluk: z, soru: `İç açıları <b>${acilar.join("°, ")}°</b> olan üçgen, açılarına göre hangi türdendir?`, dogru: d,
        dogruNeden: tur === "dik" ? "Bir açısı 90° olduğu için dik açılı üçgendir." : tur === "genis" ? `Bir açısı (${a}°) 90°'den büyük olduğu için geniş açılı üçgendir.` : "Üç açısı da 90°'den küçük olduğu için dar açılı üçgendir.",
        yanlis: [["Dar açılı üçgen", "kavrama", "Dar açılı üçgende üç açı da 90°'den küçüktür."], ["Dik açılı üçgen", "kavrama", "Dik açılı üçgende bir açı tam 90°'dir."], ["Geniş açılı üçgen", "kavrama", "Geniş açılı üçgende bir açı 90°'den büyüktür."], ["Böyle bir üçgen çizilemez", "bilgi", `${acilar.join(" + ")} = 180°; bu açılarla üçgen çizilebilir.`]],
        ipucu: "Üçgenin en büyük açısına bak.", ipucu2: `En büyük açı ${Math.max(a, b, c)}°. Bunu 90° ile karşılaştır.`,
        gorsel: ucgenAciSvg(acilar[0], acilar[1], acilar.map(x => x + "°")),
        cozum: [`🔎 Soruyu anlayalım: Açıları ${acilar.join("°, ")}° olan üçgenin türünü bulacağız.`,
          "💡 Hatırlayalım: Açılarına göre üçgen; bir açısı 90° ise dik açılı, bir açısı 90°'den büyükse geniş açılı, hepsi 90°'den küçükse dar açılıdır.",
          `✏️ Toplam: ${acilar.join(" + ")} = 180°; üçgen çizilebilir.`,
          `✏️ En büyük açı ${Math.max(a, b, c)}° → ${Math.max(a, b, c) === 90 ? "tam 90°" : Math.max(a, b, c) > 90 ? "90°'den büyük" : "90°'den küçük"}.`,
          `✅ Sonuç: ${d}.`],
        kural: "Üçgenin türünü açılarına göre belirlemek için en büyük açısına bakmak yeter." });
    },
    ucgenKenar(z) {
      const tur = sec(["eskenar", "ikiz", "cesit"]);
      let k;
      if (tur === "eskenar") { const a = R(3, 12); k = [a, a, a]; }
      else if (tur === "ikiz") { const a = R(4, 12); let b = R(2, 2 * a - 1); if (b === a) b = a - 1 > 1 ? a - 1 : a + 1; k = karistir([a, a, b]); }
      else { const a = R(3, 9), b = R(a + 1, a + 5), c = R(b + 1, a + b - 1); if (c <= b || a * a + b * b === c * c) return null; k = karistir([a, b, c]); }
      const [x, y, w] = k; if (x + y <= w || x + w <= y || y + w <= x) return null;
      const d = { eskenar: "Eşkenar üçgen", ikiz: "İkizkenar üçgen", cesit: "Çeşitkenar üçgen" }[tur];
      return kur({ bolge: "sekiller", duzey: "hatirlama", zorluk: z, soru: `Kenar uzunlukları <b>${k.join(" cm, ")} cm</b> olan üçgen, kenarlarına göre hangi türdendir?`, dogru: d,
        dogruNeden: tur === "eskenar" ? "Üç kenarı da eşit olduğu için eşkenar üçgendir." : tur === "ikiz" ? "İki kenarı eşit olduğu için ikizkenar üçgendir." : "Üç kenarı da farklı uzunlukta olduğu için çeşitkenar üçgendir.",
        yanlis: [["Eşkenar üçgen", "bilgi", "Eşkenar üçgende üç kenar da eşittir."], ["İkizkenar üçgen", "bilgi", "İkizkenar üçgende (en az) iki kenar eşittir."], ["Çeşitkenar üçgen", "bilgi", "Çeşitkenar üçgende üç kenar da farklıdır."], ["Böyle bir üçgen çizilemez", "kavrama", "Her iki kenarın toplamı üçüncüden büyük; üçgen çizilebilir."]],
        ipucu: "Kaç kenar birbirine eşit?", ipucu2: "Üç kenar eşitse eşkenar, iki kenar eşitse ikizkenar, hiçbiri eşit değilse çeşitkenar.",
        gorsel: ucgenKenarSvg(k[0], k[1], k[2]),
        cozum: [`🔎 Soruyu anlayalım: Kenarları ${k.join(", ")} cm olan üçgenin türünü bulacağız.`,
          "💡 Hatırlayalım: Kenarlarına göre üçgenler: eşkenar (3 kenar eşit), ikizkenar (2 kenar eşit), çeşitkenar (hepsi farklı).",
          `✏️ Eşit kenarları sayalım: ${tur === "eskenar" ? "üçü de eşit" : tur === "ikiz" ? "iki kenar eşit" : "eşit kenar yok"}.`,
          `✅ Sonuç: ${d}.`,
          "🔁 Kontrol edelim: Her iki kenarın toplamı üçüncü kenardan büyük olduğu için bu üçgen gerçekten çizilebilir."],
        kural: "Üçgenler kenarlarına göre eşkenar, ikizkenar ve çeşitkenar olarak sınıflandırılır." });
    },
    cokgen(z) {
      const n = R(3, 8), tip = sec(z === 1 ? ["ad", "kenar"] : ["ad", "kenar", "degil"]);
      if (tip === "degil") {
        const cokgenler = karistir(["Kare", "Üçgen", "Beşgen", "Altıgen", "Dikdörtgen"]).slice(0, 4);
        const d = sec(["Daire", "Yarım daire", "Elips"]);
        return kur({ bolge: "sekiller", duzey: "aciklama", zorluk: z, soru: "Aşağıdakilerden hangisi bir <b>çokgen değildir</b>?", dogru: d,
          dogruNeden: `${d} eğri bir çizgiyle çevrilidir; çokgenler yalnızca doğru parçalarıyla çevrilidir.`,
          yanlis: cokgenler.map(x => [x, "kavrama", `${x} doğru parçalarıyla çevrili kapalı bir şekildir; bu yüzden çokgendir.`]),
          ipucu: "Çokgenin kenarları doğru parçasıdır.", ipucu2: "Eğri çizgisi olan şekli bul.",
          gorsel: svg(420, 120, `<circle class="g-yumusak g-cizgi" cx="60" cy="60" r="44" stroke-width="3"/><rect class="g-yumusak g-cizgi" x="140" y="18" width="84" height="84" stroke-width="3"/><polygon class="g-yumusak g-cizgi" points="300,16 350,104 250,104" stroke-width="3"/>` + yazi(60, 116, "eğri", { k: 1 }) + yazi(182, 116, "doğru parçaları", { k: 1 }) + yazi(300, 116, "doğru parçaları", { k: 1 }), "eğri ve doğru parçalarıyla çevrili şekiller"),
          cozum: ["🔎 Soruyu anlayalım: Seçeneklerden çokgen olmayanı bulacağız.",
            "💡 Hatırlayalım: Çokgen, doğru parçalarıyla çevrili kapalı şekildir. Eğri çizgisi olan şekiller çokgen değildir.",
            `✏️ ${cokgenler.join(", ")} şekillerinin kenarları doğru parçasıdır.`,
            `✏️ ${d} ise eğri bir çizgiyle çevrilidir.`,
            `✅ Sonuç: ${d} çokgen değildir.`],
          kural: "Çokgen: doğru parçalarıyla çevrili, kapalı düzlemsel şekil." });
      }
      if (tip === "ad") {
        return kur({ bolge: "sekiller", duzey: "hatirlama", zorluk: z, soru: "Şekildeki çokgenin adı nedir?", dogru: COKGEN_AD[n],
          dogruNeden: `${n} kenarı olduğu için ${COKGEN_AD[n].toLocaleLowerCase("tr-TR")}dir.`,
          yanlis: [n + 1, n - 1, n + 2, n - 2].filter(k => COKGEN_AD[k]).map(k => [COKGEN_AD[k], "dikkat", `${COKGEN_AD[k]} ${k} kenarlıdır; kenarları yeniden say.`]),
          ipucu: "Kenarları tek tek say.", ipucu2: "Bir köşeden başla, saat yönünde kenarları numaralandır.",
          gorsel: cokgenSvg(n),
          cozum: ["🔎 Soruyu anlayalım: Şekildeki çokgenin adını bulacağız.",
            "💡 Hatırlayalım: Çokgenler kenar sayısına göre adlandırılır: 3 üçgen, 4 dörtgen, 5 beşgen, 6 altıgen, 7 yedigen, 8 sekizgen.",
            `✏️ Kenarları sayalım: ${Array.from({ length: n }, (_, i) => i + 1).join(", ")} → ${n} kenar.`,
            `✅ Sonuç: ${COKGEN_AD[n]}.`,
            `🔁 Kontrol edelim: Köşeleri de say; çokgende köşe sayısı kenar sayısına eşittir: ${n} köşe.`],
          kural: "Çokgende kenar sayısı = köşe sayısı = iç açı sayısı." });
      }
      return kur({ bolge: "sekiller", duzey: "hatirlama", zorluk: z, soru: `Bir <b>${COKGEN_AD[n].toLocaleLowerCase("tr-TR")}</b> kaç köşelidir?`, dogru: n,
        dogruNeden: `${COKGEN_AD[n]} ${n} kenarlıdır; köşe sayısı da ${n}'dir.`,
        yanlis: [[n + 1, "bilgi", "Kenar ve köşe sayısı eşittir."], [n - 1, "bilgi", "Kenar ve köşe sayısı eşittir."], [2 * n, "kavrama", "Her köşeyi bir kez say."], [n + 2, "bilgi", "Adındaki sayıya bak."]],
        ipucu: "Çokgenin adı kenar sayısını söyler.", ipucu2: "Çokgende köşe sayısı kenar sayısına eşittir.",
        gorsel: cokgenSvg(n, { numara: true }),
        cozum: [`🔎 Soruyu anlayalım: ${COKGEN_AD[n]}in köşe sayısını bulacağız.`,
          "💡 Hatırlayalım: Çokgenin adı kenar sayısından gelir ve köşe sayısı kenar sayısına eşittir.",
          `✏️ ${COKGEN_AD[n]} → ${n} kenar (şekilde numaralı).`,
          `✅ Sonuç: ${n} köşe.`],
        kural: "Çokgende kenar sayısı = köşe sayısı." });
    },
  };

  /* ============================ GEOMETRİK NİCELİKLER ÜRETEÇLERİ ============================ */
  function parcaUret(k, sut = 7, sat = 5) {
    const h = [[R(1, sat - 2), R(1, sut - 2)]], var_ = new Set([h[0].join(",")]);
    for (let d = 0; h.length < k && d < 400; d++) {
      const [i, j] = sec(h), [di, dj] = sec([[0, 1], [1, 0], [0, -1], [-1, 0]]), y = [i + di, j + dj];
      if (y[0] < 0 || y[1] < 0 || y[0] >= sat || y[1] >= sut || var_.has(y.join(","))) continue;
      var_.add(y.join(",")); h.push(y);
    }
    let cevre = 0; h.forEach(([i, j]) => [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([a, b]) => { if (!var_.has((i + a) + "," + (j + b))) cevre++; }));
    return { h, alan: h.length, cevre };
  }
  const NICELIK = {
    dikdortgenAlan(z) {
      const a = R(3, z === 1 ? 8 : 12), b = R(2, z === 1 ? 6 : 9); if (a === b) return null;
      const A = a * b, br = " cm²";
      return kur({ bolge: "nicelikler", duzey: "uygulama", zorluk: z, soru: `Kenar uzunlukları <b>${a} cm</b> ve <b>${b} cm</b> olan dikdörtgenin alanı kaç cm²'dir?`, dogru: A + br,
        dogruNeden: `Alan = ${a} × ${b} = ${A} cm².`,
        yanlis: [[2 * (a + b) + br, "kavrama", "Bu, çevredir; alan için kenarlar çarpılır."], [a + b + br, "kavrama", "Kenarları toplamak alanı vermez."], [(A % 2 ? A + 2 : A / 2) + br, "bilgi", "Üçgen alanı formülünü kullanmışsın; dikdörtgende ikiye bölünmez."], [A + a + br, "islem", "Çarpmayı kontrol et."]],
        ipucu: "Dikdörtgenin içine kaç birim kare sığar?", ipucu2: `Her sırada ${a} birim kare, ${b} sıra var: ${a} × ${b}.`,
        gorsel: dikdortgenSvg(a, b, { izgara: z <= 2 }),
        cozum: [`🔎 Soruyu anlayalım: ${a} cm'ye ${b} cm'lik dikdörtgenin alanını bulacağız.`,
          "💡 Hatırlayalım: Alan, şeklin kapladığı birim kare sayısıdır. Dikdörtgende alan = uzun kenar × kısa kenar.",
          `✏️ Bir sırada ${a} birim kare, toplam ${b} sıra var.`,
          `✏️ Çarpalım: ${a} × ${b} = ${A}.`,
          `✅ Sonuç: Alan ${A} cm².`,
          `🔁 Kontrol edelim: Çevre ise ${2 * (a + b)} cm olurdu; alan ile çevre farklı şeylerdir.`],
        kural: "Dikdörtgenin alanı = uzun kenar × kısa kenar." });
    },
    ucgenAlan(z) {
      const t = R(4, 14), h = R(3, 10); if ((t * h) % 2) return null;
      const A = t * h / 2;
      return kur({ bolge: "nicelikler", duzey: "uygulama", zorluk: z, soru: `Taban uzunluğu <b>${t} cm</b>, bu tabana ait yüksekliği <b>${h} cm</b> olan üçgenin alanı kaç cm²'dir?`, dogru: A + " cm²",
        dogruNeden: `(${t} × ${h}) ÷ 2 = ${A} cm².`,
        yanlis: [[t * h + " cm²", "bilgi", "İkiye bölmeyi unutmuşsun; üçgen, dikdörtgenin yarısıdır."], [t + h + " cm²", "kavrama", "Taban ile yükseklik toplanmaz, çarpılır."], [(t + h) * 2 + " cm²", "kavrama", "Bu bir çevre hesabına benziyor; alan istendi."], [A + t + " cm²", "islem", "İşlemi kontrol et."]],
        ipucu: "Üçgen, aynı taban ve yükseklikteki dikdörtgenin yarısıdır.", ipucu2: `Önce ${t} × ${h} = ${t * h}, sonra ikiye böl.`,
        gorsel: ucgenAlanSvg(t, h, sec([0.3, 0.5, 0.7])),
        cozum: [`🔎 Soruyu anlayalım: Tabanı ${t} cm, yüksekliği ${h} cm olan üçgenin alanını bulacağız.`,
          "💡 Hatırlayalım: Üçgenin alanı = (taban × yükseklik) ÷ 2. Çünkü üçgen, aynı taban ve yükseklikteki dikdörtgenin yarısıdır.",
          `✏️ Taban × yükseklik: ${t} × ${h} = ${t * h}.`,
          `✏️ İkiye bölelim: ${t * h} ÷ 2 = ${A}.`,
          `✅ Sonuç: Alan ${A} cm².`,
          `🔁 Kontrol edelim: ${t} × ${h} dikdörtgenin alanı ${t * h} cm²; üçgen bunun yarısı, ${A} cm².`],
        kural: "Üçgenin alanı = (taban × yükseklik) ÷ 2." });
    },
    paralelkenarAlan(z) {
      const t = R(4, 12), h = R(3, 8), k = h + R(1, 3), A = t * h;
      return kur({ bolge: "nicelikler", duzey: "uygulama", zorluk: z, soru: `Şekildeki paralelkenarın taban uzunluğu <b>${t} cm</b>, yüksekliği <b>${h} cm</b>, yan kenarı <b>${k} cm</b>'dir. Alanı kaç cm²'dir?`, dogru: A + " cm²",
        dogruNeden: `Alan = taban × yükseklik = ${t} × ${h} = ${A} cm².`,
        yanlis: [[t * k + " cm²", "kavrama", "Yan kenarla çarpmışsın; yükseklik tabana dik olan uzunluktur."], [A / 2 + " cm²", "bilgi", "Paralelkenarın alanı ikiye bölünmez."], [2 * (t + k) + " cm²", "kavrama", "Bu, çevredir."], [A + h + " cm²", "islem", "Çarpmayı kontrol et."]],
        ipucu: "Paralelkenarın bir ucunu kesip öbür uca taşırsan dikdörtgen olur.", ipucu2: `Yükseklik tabana dik olan kesikli çizgidir: ${h} cm. Yan kenarı (${k} cm) kullanma.`,
        gorsel: paralelkenarSvg(t, h, k),
        cozum: [`🔎 Soruyu anlayalım: Tabanı ${t} cm, yüksekliği ${h} cm olan paralelkenarın alanını bulacağız.`,
          "💡 Hatırlayalım: Paralelkenarın alanı = taban × yükseklik. Yükseklik, tabana dik olan uzaklıktır.",
          "✏️ Bir uçtaki üçgeni kesip öbür uca taşırsak aynı taban ve yükseklikte bir dikdörtgen elde ederiz.",
          `✏️ Çarpalım: ${t} × ${h} = ${A}.`,
          `✅ Sonuç: Alan ${A} cm².`,
          `🔁 Kontrol edelim: ${k} cm'lik yan kenar eğik olduğu için alan hesabında kullanılmaz.`],
        kural: "Paralelkenarın alanı = taban × o tabana ait yükseklik." });
    },
    birimKare(z) {
      const p = parcaUret(R(z === 1 ? 5 : 6, z === 1 ? 8 : 11)), cevreSor = z >= 2 && Math.random() < 0.5;
      if (cevreSor) return kur({ bolge: "nicelikler", duzey: "uygulama", zorluk: z, soru: "Birim karelerden oluşan şeklin <b>çevresi</b> kaç birimdir? (Bir birim karenin kenarı 1 birim.)", dogru: p.cevre + " birim",
        dogruNeden: `Şeklin dış kenarında ${p.cevre} birimlik kenar var.`,
        yanlis: [[p.alan + " birim", "kavrama", "Kare sayısını saymışsın; bu alandır."], [(p.cevre - 2) + " birim", "dikkat", "Bazı kenarları atlamışsın."], [(p.cevre + 2) + " birim", "dikkat", "İç kenarları da saymış olabilirsin."], [4 * p.alan + " birim", "kavrama", "İki karenin ortak kenarı dışta değildir."]],
        ipucu: "Yalnızca şeklin dışındaki kenarları say.", ipucu2: "Bir köşeden başla, şeklin etrafında dolaşarak her birim kenarı bir kez say.",
        gorsel: parcaSekilSvg(p.h),
        cozum: ["🔎 Soruyu anlayalım: Şeklin çevresinin uzunluğunu bulacağız.",
          "💡 Hatırlayalım: Çevre, şeklin dış sınırının uzunluğudur. İki karenin birleştiği iç kenarlar sayılmaz.",
          "✏️ Bir köşeden başlayıp şeklin etrafında dolaşalım ve her birim kenarı sayalım.",
          `✏️ Toplam ${p.cevre} birim kenar sayılır.`,
          `✅ Sonuç: Çevre ${p.cevre} birim.`,
          `🔁 Kontrol edelim: ${p.alan} karenin her biri 4 kenarlıdır (${4 * p.alan}); ortak kenarlar iki kez sayılmadığından çevre ${p.cevre} kalır.`],
        kural: "Çevre: dış sınırdaki birim uzunlukların toplamı." });
      return kur({ bolge: "nicelikler", duzey: "hatirlama", zorluk: z, soru: "Birim karelerden oluşan şeklin <b>alanı</b> kaç birim karedir?", dogru: p.alan + " birim kare",
        dogruNeden: `Şekilde ${p.alan} birim kare var.`,
        yanlis: [[p.cevre + " birim kare", "kavrama", "Kenarları saymışsın; bu çevredir."], [(p.alan + 1) + " birim kare", "dikkat", "Bir kareyi iki kez saymış olabilirsin."], [(p.alan - 1) + " birim kare", "dikkat", "Bir kareyi atlamış olabilirsin."], [(p.alan + 2) + " birim kare", "dikkat", "Kareleri işaretleyerek say."]],
        ipucu: "Boyalı kareleri tek tek say.", ipucu2: "Satır satır say, sonra topla.",
        gorsel: parcaSekilSvg(p.h),
        cozum: ["🔎 Soruyu anlayalım: Şeklin kaç birim kare kapladığını bulacağız.",
          "💡 Hatırlayalım: Alan, şeklin kapladığı birim kare sayısıdır.",
          "✏️ Boyalı kareleri satır satır sayalım: " + [...new Set(p.h.map(x => x[0]))].sort((a, b) => a - b).map(i => p.h.filter(x => x[0] === i).length).join(" + ") + ".",
          `✅ Sonuç: Alan ${p.alan} birim kare.`,
          "🔁 Kontrol edelim: Sütun sütun sayarsan da aynı sayıyı bulursun."],
        kural: "Alan, birim karelerle ölçülür." });
    },
    cevre(z) {
      const kare = Math.random() < 0.35, a = R(3, 12); let b = kare ? a : R(2, 9); if (!kare && b === a) b = a - 1;
      const C = 2 * (a + b);
      return kur({ bolge: "nicelikler", duzey: "uygulama", zorluk: z, soru: kare ? `Bir kenarı <b>${a} cm</b> olan karenin çevresi kaç cm'dir?` : `Kenar uzunlukları <b>${a} cm</b> ve <b>${b} cm</b> olan dikdörtgenin çevresi kaç cm'dir?`, dogru: C + " cm",
        dogruNeden: kare ? `4 × ${a} = ${C} cm.` : `${a} + ${b} + ${a} + ${b} = ${C} cm.`,
        yanlis: [[a * b + " cm", "kavrama", "Bu, alandır; çevre için kenarlar toplanır."], [a + b + " cm", "dikkat", "Yalnızca iki kenarı toplamışsın; dört kenar var."], [2 * a + b + " cm", "dikkat", "Bir kenarı eksik saymışsın."], [C + 2 + " cm", "islem", "Toplamayı kontrol et."]],
        ipucu: "Çevre, bütün kenarların toplamıdır.", ipucu2: kare ? "Karenin 4 kenarı eşittir." : "Dikdörtgenin karşılıklı kenarları eşittir: 2 uzun + 2 kısa kenar.",
        gorsel: dikdortgenSvg(a, b),
        cozum: [`🔎 Soruyu anlayalım: ${kare ? "Karenin" : "Dikdörtgenin"} çevresini bulacağız.`,
          "💡 Hatırlayalım: Çevre, şeklin bütün kenarlarının uzunlukları toplamıdır.",
          kare ? `✏️ Karenin 4 kenarı da ${a} cm.` : `✏️ Karşılıklı kenarlar eşit: iki kenar ${a} cm, iki kenar ${b} cm.`,
          `✏️ Toplayalım: ${kare ? `4 × ${a}` : `${a} + ${b} + ${a} + ${b}`} = ${C}.`,
          `✅ Sonuç: Çevre ${C} cm.`],
        kural: kare ? "Karenin çevresi = 4 × kenar." : "Dikdörtgenin çevresi = 2 × (uzun kenar + kısa kenar)." });
    },
    kenarBul(z) {
      const a = R(3, 12), b = R(2, 9); if (a === b) return null;
      const A = a * b;
      return kur({ bolge: "nicelikler", duzey: "transfer", zorluk: Math.max(2, z), soru: `Alanı <b>${A} cm²</b> olan bir dikdörtgenin bir kenarı <b>${a} cm</b>'dir. Diğer kenarı kaç cm'dir?`, dogru: b + " cm",
        dogruNeden: `${A} ÷ ${a} = ${b} cm.`,
        yanlis: [[A - a + " cm", "kavrama", "Alandan kenar çıkarılmaz; bölme yapılır."], [(A / 2 - a) + " cm", "kavrama", "Alanı çevre gibi kullanmışsın."], [b + 1 + " cm", "islem", "Bölmeyi kontrol et."], [a + " cm", "dikkat", "Bu, verilen kenardır."]],
        ipucu: "Alan = kenar × kenar. Bilinmeyen kenarı bulmak için ne yapmalısın?", ipucu2: `${a} × ? = ${A}. Bölme yap: ${A} ÷ ${a}.`,
        gorsel: dikdortgenSvg(a, b, { ust: a + " cm", yan: "?" }),
        cozum: [`🔎 Soruyu anlayalım: Alanı ${A} cm², bir kenarı ${a} cm olan dikdörtgenin diğer kenarını bulacağız.`,
          "💡 Hatırlayalım: Dikdörtgenin alanı = kenar × kenar. Çarpımın bir çarpanı bilinmiyorsa bölme yaparız.",
          `✏️ ${a} × ? = ${A}.`,
          `✏️ ${A} ÷ ${a} = ${b}.`,
          `✅ Sonuç: Diğer kenar ${b} cm.`,
          `🔁 Kontrol edelim: ${a} × ${b} = ${A}. Doğru!`],
        kural: "Alanı ve bir kenarı bilinen dikdörtgende diğer kenar = alan ÷ bilinen kenar." });
    },
  };

  /* ============================ KESİR ÜRETEÇLERİ ============================ */
  const KESIR = {
    boya(z, sekil) {
      const q = R(z === 1 ? 3 : 4, z === 1 ? 6 : 8), p = R(1, q - 1); sekil = sekil || (Math.random() < 0.5 ? "serit" : "pasta");
      return kur({ bolge: "kesir", duzey: "uygulama", zorluk: z, soru: `${sekil === "serit" ? "Şerit" : "Pasta"} ${q} eş parçaya bölünmüştür. ${sekil === "serit" ? "Şeridin" : "Pastanın"} ${kesirHTML(p, q)} kadarını boya. (${p}/${q} kadarını boyamak için kaç parça boyanmalı?)`, dogru: String(p),
        etkilesim: { tur: "boya", p, q, sekil },
        dogruNeden: `Payda ${q}: bütün ${q} eş parça. Pay ${p}: ${p} parça boyanır.`,
        yanlis: [[String(q), "kavrama", "Bu, paydadır; bütünün kaç parçaya bölündüğünü gösterir."], [String(q - p), "kavrama", "Boyanmayan parça sayısını bulmuşsun."], [String(p + 1), "dikkat", "Bir parça fazla boyamışsın."], [String(p + q), "kavrama", "Pay ile payda toplanmaz."], [String(Math.max(1, p - 1) === p ? p + 2 : p - 1), "dikkat", "Parçaları yeniden say."]],
        ipucu: "Payda bütünün kaç eş parçaya bölündüğünü, pay kaç parçanın alındığını gösterir.", ipucu2: `${q} parçadan ${p} tanesine dokun.`,
        gorsel: null,
        cozum: [`🔎 Soruyu anlayalım: ${q} eş parçaya bölünmüş bir bütünün ${p}/${q} kadarını boyayacağız.`,
          "💡 Hatırlayalım: Kesrin paydası bütünün kaç eş parçaya bölündüğünü, payı ise kaç parçanın alındığını gösterir.",
          `✏️ Payda ${q}: ${sekil === "serit" ? "şerit" : "pasta"} ${q} eş parçaya bölünmüş. Doğru!`,
          `✏️ Pay ${p}: ${p} parçayı boyarız (hangi parçalar olduğu önemli değil).`,
          `✅ Sonuç: ${p} parça boyanır.`,
          `🔁 Kontrol edelim: Boyanmayan ${q - p} parça kalır; ${p} + ${q - p} = ${q} parça, yani bütün.`],
        kural: "Pay: alınan parça sayısı · Payda: bütündeki eş parça sayısı." });
    },
    sayiDogrusu(z) {
      const ust = z === 3 ? 2 : 1, q = ust === 2 ? R(3, 6) : R(5, z === 1 ? 6 : 8), top = ust * q, p = R(1, top - 1);
      if (p === q) return null;
      const adaylar = karistir([p + 1, p - 1, top - p, p + 2, p - 2, R(1, top - 1), R(1, top - 1)]).filter(v => v >= 1 && v <= top - 1 && v !== p && v !== q);
      const nok = [p]; for (const v of adaylar) if (!nok.includes(v) && nok.length < 4) nok.push(v);
      if (nok.length < 4) return null;
      nok.sort((a, b) => a - b);
      const harf = "ABCD", dHarf = harf[nok.indexOf(p)];
      return kur({ bolge: "kesir", duzey: "uygulama", zorluk: z, soru: `Sayı doğrusunda ${kesirHTML(p, q)} kesri hangi harfle gösterilen noktadadır?`, dogru: dHarf, sirali: ["A", "B", "C", "D"],
        dogruNeden: `0 ile 1 arası ${q} eş parçaya bölünmüş; 0'dan ${p} aralık sayınca ${dHarf} noktasına gelinir.`,
        yanlis: nok.filter(v => v !== p).map(v => [harf[nok.indexOf(v)], "dikkat", `${harf[nok.indexOf(v)]} noktası ${v}/${q} kesrini gösterir.`]),
        ipucu: `0 ile 1 arasının kaç eş parçaya bölündüğünü say: her aralık 1/${q}.`, ipucu2: `0'dan başlayarak ${p} aralık say.`,
        gorsel: sayiDogrusuSvg(q, ust, nok.map((v, i) => ({ v, ad: harf[i] }))),
        cozum: [`🔎 Soruyu anlayalım: ${p}/${q} kesrinin sayı doğrusundaki yerini bulacağız.`,
          `💡 Hatırlayalım: Payda ${q} ise 0 ile 1 arası ${q} eş aralığa bölünür; her aralık 1/${q}'tür.`,
          `✏️ 0 ile 1 arasındaki aralıkları sayalım: ${q} aralık var.`,
          `✏️ 0'dan başlayıp ${p} aralık ilerleyelim.`,
          `✅ Sonuç: ${p}/${q} kesri ${dHarf} noktasındadır.`,
          p > q ? `🔁 Kontrol edelim: ${p}/${q} > 1 olduğundan nokta 1'in sağında olmalı; öyle!` : `🔁 Kontrol edelim: ${p}/${q} < 1 olduğundan nokta 0 ile 1 arasında olmalı; öyle!`],
        kural: "Sayı doğrusunda p/q: 0 ile 1 arası q eş parçaya bölünür, 0'dan p parça sayılır." });
    },
    karsilastir(z) {
      let a, b, c, d, yol;
      if (z === 1) { b = d = R(4, 10); a = R(1, b - 1); c = R(1, b - 1); yol = "payda"; }
      else if (z === 2) { a = c = R(1, 5); b = R(a + 1, 10); d = R(a + 1, 10); yol = "pay"; }
      else { b = R(3, 9); d = R(3, 9); a = R(1, b - 1); c = R(1, d - 1); yol = "capraz"; if (b === d || a === c) return null; }
      if (a * d === b * c) return null;
      const buyuk = a * d > b * c, K1 = `${a}/${b}`, K2 = `${c}/${d}`, dogru = `${K1} ${buyuk ? ">" : "<"} ${K2}`;
      const neden = yol === "payda" ? `Paydalar eşit (${b}); payı büyük olan büyüktür: ${Math.max(a, c)} > ${Math.min(a, c)}.` : yol === "pay" ? `Paylar eşit (${a}); paydası küçük olan büyüktür, çünkü parçalar daha büyüktür.` : `Paydaları eşitleyelim: ${a}/${b} = ${a * d}/${b * d}, ${c}/${d} = ${c * b}/${b * d}; ${a * d} ${buyuk ? ">" : "<"} ${c * b}.`;
      let ic = seritSvg(b, ilkN(a), { w: 400, h: 44, y: 8, etiket: K1 }) + seritSvg(d, ilkN(c), { w: 400, h: 44, y: 66, etiket: K2 });
      return kur({ bolge: "kesir", duzey: "aciklama", zorluk: z, soru: `${kesirHTML(a, b)} ile ${kesirHTML(c, d)} kesirlerini karşılaştır. Hangisi doğrudur?`, dogru, dogruNeden: neden,
        yanlis: [[`${K1} ${buyuk ? "<" : ">"} ${K2}`, "kavrama", yol === "pay" ? "Paylar eşitken paydası büyük olan kesir küçüktür (parçalar küçülür)." : "Kesirleri yeniden karşılaştır."], [`${K1} = ${K2}`, "kavrama", "Bu kesirler aynı miktarı göstermez."], ["Karşılaştırılamaz", "bilgi", "Her iki kesir de karşılaştırılabilir; paydaları eşitleyebilirsin."]],
        ipucu: yol === "payda" ? "Paydalar eşit: hangisinde daha çok parça var?" : yol === "pay" ? "Paylar eşit: hangi kesrin parçaları daha büyük?" : "Paydaları eşitle, sonra payları karşılaştır.",
        ipucu2: neden.split(";")[0], gorsel: svg(500, 120, ic, "iki kesir şeridi"),
        cozum: [`🔎 Soruyu anlayalım: ${K1} ile ${K2} kesirlerinden hangisinin büyük olduğunu bulacağız.`,
          "💡 Hatırlayalım: Paydalar eşitse payı büyük olan; paylar eşitse paydası küçük olan kesir büyüktür. Diğer durumlarda paydalar eşitlenir.",
          "✏️ " + neden,
          `✅ Sonuç: ${dogru}.`,
          "🔁 Kontrol edelim: Görseldeki şeritlere bak; boyalı kısmı uzun olan kesir daha büyüktür."],
        kural: "Kesirleri karşılaştırmak için paydaları (ya da payları) eşitle." });
    },
    denk(z) {
      const q = R(2, 6), p = R(1, q - 1); if (ebob(p, q) !== 1) return null;
      const k = R(2, z === 1 ? 3 : 5), dogru = `${p * k}/${q * k}`;
      const esit = (x, y) => x * q === y * p;
      const yanlis = [[`${p + k}/${q + k}`, "kavrama", "Pay ve paydaya aynı sayıyı eklemek denk kesir vermez; çarpmak gerekir."], [`${p * k}/${q}`, "dikkat", "Yalnızca payı çarpmışsın; paydayı da aynı sayıyla çarpmalısın."], [`${p}/${q * k}`, "dikkat", "Yalnızca paydayı çarpmışsın."], [`${p * k}/${q * k + 1}`, "islem", "Paydayı kontrol et."], [`${q}/${p}`, "kavrama", "Pay ile payda yer değiştirmiş."]]
        .filter(([m]) => { const [x, y] = m.split("/").map(Number); return !esit(x, y); });
      return kur({ bolge: "kesir", duzey: "uygulama", zorluk: z, soru: `${kesirHTML(p, q)} kesrine denk olan kesir hangisidir?`, dogru, dogruNeden: `Pay ve payda ${k} ile çarpılırsa ${dogru} olur.`, yanlis,
        ipucu: "Denk kesir için pay ve paydayı aynı sayıyla çarp.", ipucu2: `${p}/${q} kesrini ${k} ile genişlet: (${p} × ${k})/(${q} × ${k}).`,
        gorsel: svg(500, 120, seritSvg(q, ilkN(p), { w: 400, h: 44, y: 8, etiket: `${p}/${q}` }) + seritSvg(q * k, ilkN(p * k), { w: 400, h: 44, y: 66, etiket: dogru.replace(/\d+\/\d+/, "?") }), "denk kesir şeritleri"),
        cozum: [`🔎 Soruyu anlayalım: ${p}/${q} ile aynı miktarı gösteren kesri bulacağız.`,
          "💡 Hatırlayalım: Bir kesrin payı ve paydası aynı sayıyla çarpılırsa (genişletme) denk kesir elde edilir.",
          `✏️ ${k} ile genişletelim: (${p} × ${k})/(${q} × ${k}) = ${dogru}.`,
          `✅ Sonuç: ${dogru}.`,
          `🔁 Kontrol edelim: Şeritte her parçayı ${k}'ye bölersek boyalı kısım değişmez: ${p * k}/${q * k}.`],
        kural: "Denk kesirler aynı miktarı gösterir; pay ve payda aynı sayıyla çarpılır ya da bölünür." });
    },
  };
  /* Kesirle bölme ilişkisi: uygulamanın kendi kazanımlarından */
  const kb = kaz => z => soruUret(kaz, z);

  /* ============================ BÖLGELER ============================ */
  const icerikUretecleri = konular => konular.filter(k => KONU[k]).flatMap(k => KONU[k].kazanimlar.map(z => z.id)).filter(id => KAZANIM[id]).map(id => z => soruUret(id, z));
  const BOLGELER = [
    { id: "sayilar", ad: "Sayılar ve Nicelikler Ormanı", kisa: "Sayılar Ormanı", simge: "🌳", renk: "#2e9b57", konular: ["carpan", "kat", "bolunebilme", "asal", "ortakkat", "ortakbolen", "basamak", "yuvarlama", "kesirbolme", "problem", "uzunluk"] },
    { id: "cebir", ad: "İşlemlerle Cebirsel Düşünme Kalesi", kisa: "Cebir Kalesi", simge: "🏰", renk: "#8a5cd6", ozel: CEBIR },
    { id: "sekiller", ad: "Geometrik Şekiller Vadisi", kisa: "Şekiller Vadisi", simge: "🔺", renk: "#e07a1f", ozel: SEKIL },
    { id: "nicelikler", ad: "Geometrik Nicelikler Dağı", kisa: "Nicelikler Dağı", simge: "⛰️", renk: "#5b7fa6", ozel: NICELIK },
    { id: "istatistik", ad: "İstatistiksel Araştırma Limanı", kisa: "İstatistik Limanı", simge: "⚓", renk: "#2f6fdb", konular: ["arastirma", "merkezi"] },
    { id: "olasilik", ad: "Veriden Olasılığa Adası", kisa: "Olasılık Adası", simge: "🏝️", renk: "#d64545", konular: ["olasilik"] },
  ];
  const BOLGE = Object.fromEntries(BOLGELER.map(b => [b.id, b]));
  BOLGELER.forEach(b => { b.uretecler = b.ozel ? Object.values(b.ozel).map(f => z => f(z)) : icerikUretecleri(b.konular); });
  const KESIR_BOLGE = { id: "kesir", ad: "Kesirler Macerası", kisa: "Kesirler", simge: "🍕", renk: "#e0a100",
    uygula: [z => KESIR.boya(z, "serit"), KESIR.sayiDogrusu, KESIR.karsilastir, kb("kb.iliski"), KESIR.denk, kb("kb.paylasim")],
    ustalas: [KESIR.sayiDogrusu, KESIR.karsilastir, KESIR.denk, z => KESIR.boya(z, "pasta"), kb("kb.paylasim"), kb("kb.ondalik"), KESIR.karsilastir, KESIR.sayiDogrusu] };
  KESIR_BOLGE.uretecler = [...new Set([...KESIR_BOLGE.uygula, ...KESIR_BOLGE.ustalas])];
  const bolgeBul = id => id === "kesir" ? KESIR_BOLGE : BOLGE[id];
  /* Aşama planı: [üreteç, zorluk] listesi */
  function asamaPlani(bolgeId, asama) {
    const b = bolgeBul(bolgeId);
    if (bolgeId === "kesir") { const l = asama === "uygula" ? KESIR_BOLGE.uygula : karistir(KESIR_BOLGE.ustalas); return l.map((f, i) => [f, asama === "uygula" ? (i < 3 ? 1 : 2) : [2, 2, 3, 2, 3, 2, 3, 3][i]]); }
    const n = asama === "uygula" ? 6 : asama === "ustalas" ? 8 : 1;
    const zor = asama === "uygula" ? [1, 1, 2, 1, 2, 2] : asama === "ustalas" ? [2, 2, 3, 2, 3, 3, 2, 3] : [1];
    const havuz = []; while (havuz.length < n) havuz.push(...karistir(b.uretecler));
    return havuz.slice(0, n).map((f, i) => [f, zor[i]]);
  }
