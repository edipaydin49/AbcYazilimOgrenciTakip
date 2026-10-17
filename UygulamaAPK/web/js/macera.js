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
    document.querySelectorAll(".mac-kutlama, .mac-hayalet, .mac-konfeti").forEach(e => e.remove());
    aktifMotor = null; aktifOyun = null;
    document.body.classList.remove("mac-genis");
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
/* Geniş ekran (tablet yatay, ör. 1280×800): oyun alanı + yan panel yan yana */
body.mac-genis main { max-width: 1240px; }
.mac-iki, .mac-oyun, .mac-soru-duzen { display: grid; gap: 16px; align-items: start; }
.mac-soru-sol, .mac-soru-sag { display: grid; gap: 12px; align-content: start; }
.mac-panel { align-content: start; }
@media (min-width: 960px) {
  .mac-iki { grid-template-columns: minmax(0, 1.15fr) minmax(320px, 1fr); }
  .mac-iki.esit { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
  .mac-oyun { grid-template-columns: minmax(0, 1.45fr) minmax(320px, 1fr); }
  .mac-oyun > .mac-panel { position: sticky; top: 72px; }
  .mac-soru-duzen { grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); }
  .mac-oyun .mac-soru-duzen, .mac-panel .mac-soru-duzen, .mac-soru-duzen.tek { grid-template-columns: 1fr; }
  .mac-soru-duzen.tek .mac-boya { max-width: 640px; }
  .mac-parca { width: 140px; min-height: 124px; } .mac-parca svg { width: 120px; height: 90px; }
  .mac-hedef { min-height: 170px; }
  .mac-izgara { max-width: 560px; }
  .mac-harita { max-height: calc(100vh - 120px); width: auto; max-width: 100%; }
  .mac-menu { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (min-width: 960px) and (min-height: 700px) { .mac-hucre { font-size: 2.2rem; } }
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
    { id: "sayilar", ad: "Sayılar ve Nicelikler Ormanı", kisa: "Sayılar Ormanı", de: "Sayılar Ormanı'nda", simge: "🌳", renk: "#2e9b57", konular: ["carpan", "kat", "bolunebilme", "asal", "ortakkat", "ortakbolen", "basamak", "yuvarlama", "kesirbolme", "problem", "uzunluk"] },
    { id: "cebir", ad: "İşlemlerle Cebirsel Düşünme Kalesi", kisa: "Cebir Kalesi", de: "Cebir Kalesi'nde", simge: "🏰", renk: "#8a5cd6", ozel: CEBIR },
    { id: "sekiller", ad: "Geometrik Şekiller Vadisi", kisa: "Şekiller Vadisi", de: "Şekiller Vadisi'nde", simge: "🔺", renk: "#e07a1f", ozel: SEKIL },
    { id: "nicelikler", ad: "Geometrik Nicelikler Dağı", kisa: "Nicelikler Dağı", de: "Nicelikler Dağı'nda", simge: "⛰️", renk: "#5b7fa6", ozel: NICELIK },
    { id: "istatistik", ad: "İstatistiksel Araştırma Limanı", kisa: "İstatistik Limanı", de: "İstatistik Limanı'nda", simge: "⚓", renk: "#2f6fdb", konular: ["arastirma", "merkezi"] },
    { id: "olasilik", ad: "Veriden Olasılığa Adası", kisa: "Olasılık Adası", de: "Olasılık Adası'nda", simge: "🏝️", renk: "#d64545", konular: ["olasilik"] },
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

  /* ============================ ÖĞREN KARTLARI ============================ */
  const asallar30 = (() => { let ic = ""; for (let n = 1; n <= 30; n++) { const i = (n - 1) % 10, j = Math.floor((n - 1) / 10), asal = OGR.asalMi(n); ic += `<rect class="${asal ? "g-c" : "g-bos"} g-ince" x="${10 + i * 46}" y="${10 + j * 46}" width="42" height="42" rx="8"${asal ? ' fill-opacity=".85"' : ""}/>` + yazi(31 + i * 46, 38 + j * 46, n, { b: asal ? 1 : 0 }); } return svg(480, 150, ic, "1'den 30'a kadar asal sayılar yeşil"); })();
  const OGREN = {
    sayilar: [
      { b: "Çarpanlar ve katlar", m: "12 birim kareyi dikdörtgen biçiminde dizebileceğimiz her şekil, 12'nin bir <b>çarpan çiftini</b> gösterir: 1 × 12, 2 × 6, 3 × 4. 12; 1, 2, 3, 4, 6 ve 12'nin <b>katıdır</b>.", g: () => G.izgara(3, 4) },
      { b: "Bölünebilme kuralları", m: "<b>2</b>: birler basamağı çift · <b>3</b>: rakamları toplamı 3'ün katı · <b>5</b>: birler basamağı 0 ya da 5 · <b>9</b>: rakamları toplamı 9'un katı · <b>10</b>: birler basamağı 0.", g: () => G.tablo(["Sayı", "2", "3", "5", "9", "10"], [["90", "✔", "✔", "✔", "✔", "✔"], ["105", "—", "✔", "✔", "—", "—"], ["72", "✔", "✔", "—", "✔", "—"]]) },
      { b: "Asal sayılar", m: "Yalnızca 1'e ve kendisine bölünebilen, 1'den büyük sayılar <b>asal sayıdır</b>. 1 asal değildir; 2 tek çift asal sayıdır.", g: () => asallar30 },
      { b: "Ondalık gösterim ve basamaklar", m: "3,47'de 3 birler, 4 onda birler (0,4), 7 yüzde birler (0,07) basamağındadır. Virgülün sağındaki ilk basamak <b>onda birler</b>dir.", g: () => G.tablo(["Birler", ",", "Onda birler", "Yüzde birler"], [["3", ",", "4", "7"]]) },
      { b: "Kesir bir bölmedir", m: "3/4 = 3 ÷ 4. Üç pizzayı dört kişiye eşit paylaştırırsak her kişiye <b>3/4</b> pizza düşer. Kesirlerle daha çok oynamak için Kesirler Macerası'na uğra!", g: () => G.kesirSeridi(3, 4) },
    ],
    cebir: [
      { b: "Değişken nedir?", m: "Değeri bilinmeyen ya da değişebilen bir miktarı bir harfle gösteririz: bu harfe <b>değişken</b> denir. “Kutudaki bilye sayısı” → <b>n</b>.", g: () => svg(360, 100, `<text x="60" y="70" font-size="50" text-anchor="middle">📦</text>` + kutuSvg(120, 24, 80, 52, "n") + yazi(270, 56, "= ? bilye", { b: 1 }), "değişken") },
      { b: "Cebirsel ifade", m: "<b>3n + 2</b> bir cebirsel ifadedir. 3n ve 2 ifadenin <b>terimleri</b>dir; 3, n'nin <b>katsayısı</b>, 2 ise <b>sabit terim</b>dir.", g: () => svg(380, 120, `<text class="g-yazi" x="190" y="60" text-anchor="middle" font-size="40" font-weight="700">3n + 2</text>` + yazi(132, 100, "katsayı", { k: 1 }) + yazi(160, 20, "değişken", { k: 1 }) + yazi(250, 100, "sabit terim", { k: 1 }), "cebirsel ifadenin parçaları") },
      { b: "İfadenin değeri", m: "Değişkenin yerine bir sayı yazarak ifadenin değerini buluruz. n = 4 için 3n + 2 = 3 × 4 + 2 = <b>14</b>. Önce çarpma, sonra toplama!", g: () => makineSvg("n = 4", ["× 3", "+ 2"], "14") },
      { b: "Örüntü kuralı", m: "Her adımda 3 nokta ekleniyor ve başta 1 nokta var: kural <b>3n + 1</b>. n. adımdaki nokta sayısını bu kural verir: 10. adımda 3 × 10 + 1 = 31 nokta.", g: () => oruntuSvg(3, 1, 3) },
    ],
    sekiller: [
      { b: "Çokgenler", m: "Doğru parçalarıyla çevrili kapalı şekillere <b>çokgen</b> denir. Daire çokgen değildir çünkü eğri bir çizgiyle çevrilidir. Çokgenler kenar sayısına göre adlandırılır.", g: () => svg(480, 130, [3, 4, 5, 6].map((n, i) => cokgenSvg(n).replace(/^<svg[^>]*>|<\/svg>$/g, "").replace("<polygon", `<polygon transform="translate(${i * 120} 0) scale(.5) translate(0 20)"`)).join("") + [3, 4, 5, 6].map((n, i) => yazi(60 + i * 120, 124, COKGEN_AD[n], { k: 1 })).join(""), "üçgen, dörtgen, beşgen, altıgen") },
      { b: "Açı türleri", m: "<b>Dar açı</b> 90°'den küçük, <b>dik açı</b> tam 90°, <b>geniş açı</b> 90° ile 180° arası, <b>doğru açı</b> 180°'dir.", g: () => svg(480, 130, [[45, "dar"], [90, "dik"], [135, "geniş"]].map(([m, ad], i) => { const x = 40 + i * 160, y = 100, L = 70; return `<line class="g-cizgi" x1="${x}" y1="${y}" x2="${x + L}" y2="${y}" stroke-width="4"/><line class="g-cizgi" x1="${x}" y1="${y}" x2="${f1(x + L * Math.cos(rad(m)))}" y2="${f1(y - L * Math.sin(rad(m)))}" stroke-width="4"/>` + yazi(x + 40, y + 24, ad + " " + m + "°", { b: 1 }); }).join(""), "dar, dik ve geniş açı") },
      { b: "Açı ölçme", m: "Açıölçerin merkezini açının köşesine koy, bir kolu <b>0</b> çizgisine hizala. 0 hangi ölçekteyse o ölçekteki sayıyı oku.", g: () => aciSvg(60, { olcer: true }) },
      { b: "Üçgen çeşitleri", m: "Kenarlarına göre: <b>eşkenar</b> (3 kenar eşit), <b>ikizkenar</b> (2 kenar eşit), <b>çeşitkenar</b> (hepsi farklı). Açılarına göre: <b>dar</b>, <b>dik</b>, <b>geniş açılı</b>. İç açılar toplamı her zaman <b>180°</b>.", g: () => ucgenAciSvg(90, 40, ["90°", "40°", "50°"]) },
    ],
    nicelikler: [
      { b: "Alan nedir?", m: "Bir şeklin kapladığı yüzeye <b>alan</b> denir. Alanı birim karelerle ölçeriz: bu şekil 7 birim kare kaplıyor.", g: () => parcaSekilSvg([[1, 1], [1, 2], [1, 3], [2, 2], [2, 3], [3, 3], [3, 4]]) },
      { b: "Dikdörtgenin alanı", m: "Her sırada 5 birim kare, 3 sıra var: 5 × 3 = <b>15 birim kare</b>. Dikdörtgenin alanı = uzun kenar × kısa kenar.", g: () => dikdortgenSvg(5, 3, { izgara: true, ust: "5 birim", yan: "3 birim" }) },
      { b: "Üçgenin alanı", m: "Üçgen, aynı taban ve yükseklikteki dikdörtgenin <b>yarısıdır</b>. Üçgenin alanı = (taban × yükseklik) ÷ 2.", g: () => ucgenAlanSvg(6, 4, 0.5) },
      { b: "Paralelkenarın alanı", m: "Paralelkenarın bir ucundaki üçgeni kesip öbür uca taşırsak dikdörtgen olur. Alan = <b>taban × yükseklik</b> (eğik kenar değil!).", g: () => paralelkenarSvg(6, 4, 5) },
      { b: "Çevre", m: "<b>Çevre</b>, şeklin etrafının uzunluğudur: bütün kenarlar toplanır. 5 cm'ye 3 cm'lik dikdörtgenin çevresi 5 + 3 + 5 + 3 = 16 cm.", g: () => dikdortgenSvg(5, 3) },
    ],
    istatistik: [
      { b: "Araştırma sorusu", m: "İyi bir araştırma sorusu <b>veri toplayarak</b> cevaplanabilir ve farklı cevaplar içerir. “Sınıfımızdaki öğrencilerin en sevdiği meyve hangisidir?” iyi bir sorudur.", g: () => svg(420, 100, `<text x="50" y="66" font-size="46" text-anchor="middle">❓</text>` + G.ok(90, 50, 150, 50) + `<text x="190" y="66" font-size="46" text-anchor="middle">📋</text>` + G.ok(230, 50, 290, 50) + `<text x="330" y="66" font-size="46" text-anchor="middle">📊</text>` + yazi(50, 96, "soru", { k: 1 }) + yazi(190, 96, "veri topla", { k: 1 }) + yazi(330, 96, "göster, yorumla", { k: 1 }), "araştırma süreci") },
      { b: "Veri türleri", m: "Sayıyla ifade edilen veriler <b>nicel</b> (boy, yaş, puan), sayıyla ifade edilmeyen veriler <b>nitel</b> (renk, meyve, şehir) veridir.", g: () => G.tablo(["Nitel veri", "Nicel veri"], [["En sevilen renk", "Boy (cm)"], ["Doğulan şehir", "Kardeş sayısı"]]) },
      { b: "Sütun grafiği", m: "Verileri sütun grafiğiyle gösterince karşılaştırmak kolaylaşır. En uzun sütun en çok tercih edileni gösterir.", g: () => G.sutun([["Elma", 8], ["Muz", 5], ["Çilek", 10], ["Kiraz", 3]], { baslik: "En sevilen meyve", birim: "öğrenci" }) },
      { b: "Ortalama, ortanca, tepe değer, açıklık", m: "Veri: 2, 3, 3, 5, 7. <b>Ortalama</b> = 20 ÷ 5 = 4 · <b>Ortanca</b> (sıralı veride ortadaki) = 3 · <b>Tepe değer</b> (en çok tekrar eden) = 3 · <b>Açıklık</b> = 7 − 2 = 5.", g: () => svg(420, 90, [2, 3, 3, 5, 7].map((v, i) => kutuSvg(20 + i * 78, 16, 64, 50, v, i === 2 ? "g-b" : "g-yumusak")).join("") + yazi(176, 86, "ortanca", { k: 1 }), "sıralı veri") },
    ],
    olasilik: [
      { b: "Deney ve çıktı", m: "Torbadan bir top çekmek bir <b>deney</b>dir. Çekilebilecek renkler bu deneyin <b>çıktıları</b>dır.", g: () => G.torba({ kırmızı: 3, mavi: 2, yeşil: 1 }) },
      { b: "Olasılık dili", m: "Hiç olamayacak olay <b>imkânsız</b> (0), kesinlikle olacak olay <b>kesin</b> (1) olaydır. Olasılık 0 ile 1 arasında bir sayıdır.", g: () => G.sayiDogrusu({ min: 0, max: 1, adim: 0.5, etiket: v => v === 0 ? "0 imkânsız" : v === 1 ? "1 kesin" : "1/2 eşit", noktalar: [] }) },
      { b: "Gözleme dayalı olasılık", m: "Bir parayı 20 kez attık, 12 kez tura geldi. Tura gelme olasılığını gözleme dayalı olarak <b>12/20</b> diye tahmin ederiz. Deneme sayısı arttıkça tahmin daha güvenilir olur.", g: () => G.sutun([["Yazı", 8], ["Tura", 12]], { baslik: "20 atışın sonucu", birim: "kez" }) },
    ],
  };
  /* Kesirler Macerası: Öğren aşaması etkileşimli görevlerden oluşur */
  const KESIR_OGREN = [
    { b: "Kesir nedir?", m: "Bir bütünü eş parçalara böleriz. <b>Payda</b> kaç eş parça olduğunu, <b>pay</b> kaç parça aldığımızı gösterir.", gorev: { tur: "boya", sekil: "serit", p: 3, q: 4, yonerge: "Şeridin 3/4 kadarını boya: 4 parçadan 3 tanesine dokun." } },
    { b: "Pasta dilimleri", m: "Pasta da bir bütündür. 6 eş dilimden 2'si yenirse pastanın <b>2/6</b> kadarı yenmiştir.", gorev: { tur: "boya", sekil: "pasta", p: 2, q: 6, yonerge: "Pastanın 2/6 kadarını boya." } },
    { b: "Hangisi daha büyük?", m: "Paydaları eşit kesirlerde <b>payı büyük olan</b> daha büyüktür. Paylar eşitse <b>paydası küçük olan</b> daha büyüktür, çünkü parçalar daha büyüktür.", gorev: { tur: "karsilastir", a: [2, 3], b: [2, 5], yonerge: "Hangi şerit daha çok boyanmış? Büyük olan kesre dokun." } },
    { b: "Denk kesirler", m: "1/2 ile 2/4 aynı miktarı gösterir; bunlar <b>denk kesirler</b>dir. Pay ve paydayı aynı sayıyla çarparak denk kesir buluruz.", gorev: { tur: "denk", p: 1, q: 2, k: 2, yonerge: "Alttaki şeridi, üstteki 1/2'ye denk olacak şekilde boya." } },
  ];

  /* ============================ ROZETLER ============================ */
  const ROZETLER = [
    { id: "ilkYildiz", ad: "İlk Yıldız", simge: "🌟", kosul: "Macerada ilk yıldızını kazan.", tamam: () => toplamYildiz() >= 1 },
    { id: "kesirUstasi", ad: "Kesir Ustası", simge: "🍕", kosul: "Kesirler Macerası'nın Ustalaş aşamasında 3 yıldız kazan.", tamam: () => ((D().bolgeler.kesir || {}).ustalas || 0) >= 3 },
    { id: "geometriMimari", ad: "Geometri Mimarı", simge: "📐", kosul: "Geometri Atölyesi'nin bütün görevlerini bitir ya da Şekiller Vadisi ile Nicelikler Dağı'nda toplam 9 yıldız topla.", tamam: () => (D().rekorlar.atolye || 0) > 0 || bolgeYildiz("sekiller") + bolgeYildiz("nicelikler") >= 9 },
    { id: "veriDedektifi", ad: "Veri Dedektifi", simge: "🔎", kosul: "İstatistik Limanı ve Olasılık Adası'nın Ustalaş aşamalarını bitir.", tamam: () => ((D().bolgeler.istatistik || {}).ustalas || 0) >= 1 && ((D().bolgeler.olasilik || {}).ustalas || 0) >= 1 },
    { id: "problemUzmani", ad: "Problem Çözme Uzmanı", simge: "🧠", kosul: "Macerada 40 soruyu ilk denemede doğru çöz.", tamam: () => (D().sayac.ilkDogru || 0) >= 40 },
    { id: "sabirliKasif", ad: "Sabırlı Kâşif", simge: "🧭", kosul: "İpucu ya da yardım aldıktan sonra vazgeçmeden 5 soruyu doğru çöz.", tamam: () => (D().sayac.sabir || 0) >= 5 },
    { id: "tekrarSampiyonu", ad: "Tekrar Şampiyonu", simge: "🔁", kosul: "Yanlış Sorularım defterinden 10 soruyu yeniden çözüp düzelt.", tamam: () => defterDuzeltme() >= 10 },
    { id: "robotMuhendisi", ad: "Robot Mühendisi", simge: "🤖", kosul: "Matematik Robotu'nu 3. seviyeye çıkar.", tamam: () => (D().robotSeviye || 0) >= 3 },
    { id: "hazineAvcisi", ad: "Hazine Avcısı", simge: "🗝️", kosul: "Hazine Avı'nda sandığı aç.", tamam: () => (D().rekorlar.hazine || 0) > 0 },
  ];
  function rozetKontrol() {
    const m = D(), yeni = ROZETLER.filter(r => !m.rozetler[r.id] && r.tamam());
    if (!yeni.length) return [];
    yeni.forEach(r => { m.rozetler[r.id] = Date.now(); });
    kaydetDurum();
    kutla(yeni[0].simge, "Yeni rozet: " + yeni[0].ad, yeni.length > 1 ? `Ve ${yeni.length - 1} rozet daha! Başarılarım'a bak.` : yeni[0].kosul);
    return yeni;
  }

  /* ============================ SORU MOTORU ============================
   * Yanlış cevap akışı: 1. → nazik mesaj + ipucu · 2. → ipucu 2 / görsel destek · 3. → adım adım çözüm
   * (adımlar tek tek açılır) + benzer soru. Her soru bitince DEPO'ya “soru” olarak kaydedilir.
   */
  const NAZIK = ["Az kaldı! Bir daha bakalım.", "Güzel deneme! Bir kez daha düşünelim.", "Neredeyse! İpucuna göz at."];
  const OVGU = ["Harika! 🎉", "Süpersin! ⭐", "Çok güzel! 👏", "Aferin! 🌟", "Tam isabet! 🎯"];
  function soruKaydi(m, baglam) {
    const q = m.q, ilk = m.ilkSecim, dIdx = q.secenekler.findIndex(x => x.dogru);
    const kayit = {
      ders: "mat", konu: q.konu && KONU[q.konu] ? q.konu : null, tema: q.konu && KONU[q.konu] ? KONU[q.konu].tema : null,
      kaz: q.kaz && KAZANIM[q.kaz] ? q.kaz : null, duzey: q.duzey || null, zorluk: q.zorluk || null, mod: "macera", testId: baglam.testId || null,
      ilkDogru: !!(ilk && ilk.dogru), sonDogru: !!m.dogru, deneme: m.deneme, ilkSure: m.ilkSure, toplamSure: Date.now() - m.bas,
      ipucu: m.yardim >= 1, cozumGoruldu: m.yardim >= 3, terk: false, ilkHata: ilk && !ilk.dogru ? (ilk.hata || "kavrama") : null,
      soruNesnesi: q, secim: ilk ? String(ilk.m) : null, dogruCevap: dIdx >= 0 ? q.secenekler[dIdx].m : null,
      yardim: m.yardim, yanlisSayisi: m.yanlislar.length, bolge: q.bolge || baglam.bolge || null, asama: baglam.asama || null, benzer: !!m.benzer,
    };
    if (!kayit.konu) { kayit.kaz = null; kayit.tema = null; }
    try { DEPO.kaydet("soru", kayit); } catch (e) {}
    say("soru"); if (kayit.ilkDogru) say("ilkDogru");
    if (m.dogru && !kayit.ilkDogru && m.yardim >= 1) say("sabir");
    kaydetDurum();
    return kayit;
  }

  /* kap: içine çizilecek eleman · o: { q, uretec, z, baglam, onBitti(sonuc), ustHTML } */
  function motor(kap, o) {
    const m = { q: o.q, deneme: 0, yanlislar: [], yardim: 0, adim: 0, bitti: false, dogru: false, bas: Date.now(), ilkSure: null, ilkSecim: null, boyali: new Set(), benzer: !!o.benzer, sonuc: o.sonuc || null };
    aktifMotor = m;
    m.ciz = () => ciz();
    m.sec = j => secim(j);
    m.boyaKontrol = () => boyaKontrol();
    const q = () => m.q;
    function secenekSonucu(sonuc) {
      m.deneme++;
      if (m.ilkSecim == null) { m.ilkSecim = sonuc; m.ilkSure = Date.now() - m.bas; }
      if (sonuc.dogru) { m.bitti = true; m.dogru = true; }
      else { m.yanlislar.push(sonuc); m.yardim = Math.max(m.yardim, Math.min(3, m.yanlislar.length)); if (m.yanlislar.length >= 3) { m.bitti = true; m.adim = 1; } }
      if (m.bitti) { m.kayit = soruKaydi(m, o.baglam || {}); if (!m.sonuc) m.sonuc = { ilkDogru: m.kayit.ilkDogru, dogru: m.dogru, yardim: m.yardim }; }
      ciz();
    }
    function secim(j) {
      if (m.bitti || m.yanlislar.some(y => y.j === j)) return;
      const s = q().secenekler[j]; if (!s) return;
      secenekSonucu({ j, m: s.m, dogru: !!s.dogru, hata: s.hata, neden: s.neden });
    }
    function boyaKontrol() {
      if (m.bitti) return;
      const e = q().etkilesim, n = m.boyali.size, j = q().secenekler.findIndex(x => String(x.m) === String(n));
      const s = j >= 0 ? q().secenekler[j] : { m: String(n), dogru: false, hata: "kavrama", neden: "" };
      secenekSonucu({ j: -1, m: String(n), dogru: n === e.p, hata: s.hata || "kavrama", neden: n === e.p ? s.neden : `${n} parça boyadın; ${e.q} parçadan ${e.p} tanesi boyanmalı.` });
    }
    function boyaHTML() {
      const e = q().etkilesim, goster = m.bitti && !m.dogru ? ilkN(e.p) : m.boyali, tikla = !m.bitti;
      const ic = e.sekil === "pasta" ? svg(220, 220, pastaSvg(e.q, goster, { tikla }), "pasta").replace('class="gorsel-svg"', 'class="mac-boya" style="max-width:300px"') : svg(500, 82, seritSvg(e.q, goster, { tikla }), "şerit").replace('class="gorsel-svg"', 'class="mac-boya"');
      return `<div class="gorsel">${ic}</div><div class="satir ara"><span class="kucuk-yazi muted">Boyanan: <b>${goster.size}</b> / ${e.q} parça</span>${m.bitti ? "" : '<button class="btn ana" data-mac="kontrol">Kontrol et</button>'}</div>`;
    }
    function ciz() {
      const Q = q(), dIdx = Q.secenekler.findIndex(x => x.dogru), e = Q.etkilesim;
      const adimlar = Q.cozum || [];
      const son = m.yanlislar[m.yanlislar.length - 1];
      let geri = "";
      if (m.bitti && m.dogru) geri = `<div class="mac-mesaj iyi"><b>${sec(OVGU)}</b>${Q.secenekler[dIdx].neden ? `<span>${kalin(Q.secenekler[dIdx].neden)}</span>` : ""}${m.yanlislar.length ? '<span class="kucuk-yazi">Vazgeçmeden denedin, bu çok değerli! 🧭</span>' : ""}</div>`;
      else if (m.bitti) {
        geri = `<div class="mac-mesaj bilgi"><b>Gel, birlikte adım adım çözelim 🤝</b><ol class="mac-adimlar">${adimlar.slice(0, m.adim).map(a => `<li>${kalin(a)}</li>`).join("")}</ol>
          ${m.adim < adimlar.length ? '<div><button class="btn" data-mac="adim">Sonraki adım ▸</button></div>' : `<span>Doğru cevap: <b>${kacis(Q.secenekler[dIdx].m)}</b></span>${Q.kural ? `<div class="unutma"><b>Unutma:</b> ${kalin(Q.kural)}</div>` : ""}`}</div>`;
      } else if (son) geri = `<div class="mac-mesaj nazik"><b>${NAZIK[(m.yanlislar.length - 1) % NAZIK.length]}</b>${son.neden ? `<span class="kucuk-yazi">${kalin(son.neden)}</span>` : ""}</div>`;
      const ipucu1 = m.yardim >= 1 && Q.ipucu && !(m.bitti && !m.dogru) ? `<div class="mac-mesaj bilgi"><b>💡 İpucu:</b> <span>${kalin(Q.ipucu)}</span></div>` : "";
      const ip2 = Q.ipucu2 || (adimlar.find(a => /^💡/.test(a)) || "").replace(/^💡\s*Hatırlayalım:\s*/, "");
      const ipucu2 = m.yardim >= 2 && ip2 && !(m.bitti && !m.dogru) ? `<div class="mac-mesaj bilgi"><b>🔍 İpucu 2:</b> <span>${kalin(ip2)}</span></div>` : "";
      const yardimBtn = !m.bitti && m.yardim < 2 ? `<button class="btn kucuk" data-mac="ipucu">${m.yardim === 0 ? "💡 İpucu" : "🔍 Biraz daha yardım"}</button>` : "";
      const devamHazir = m.bitti && (m.dogru || m.adim >= adimlar.length);
      const metin = e && e.tur === "boya" ? `${e.sekil === "serit" ? "Şeridin" : "Pastanın"} ${kesirHTML(e.p, e.q)} kadarını boya. Parçalara dokunarak boya, sonra <b>Kontrol et</b>.` : Q.soru;
      kap.innerHTML = `<div class="mac-soru mac-soru-duzen${e && e.tur === "boya" ? " tek" : ""}">
        <div class="mac-soru-sol">${o.ustHTML || ""}${m.benzer ? '<span class="etiket orta">Benzer soru</span>' : ""}<p class="soru-metin">${metin}</p>${e && e.tur === "boya" ? boyaHTML() : Q.gorsel ? `<div class="gorsel">${Q.gorsel}</div>` : ""}</div>
        <div class="mac-soru-sag">${e && e.tur === "boya" ? "" : `<div class="secenekler">${Q.secenekler.map((s, j) => { let c = "sec"; const denendi = m.yanlislar.some(y => y.j === j); if (m.bitti && j === dIdx) c += " dogru"; else if (denendi) c += " mac-denendi";
          return `<button class="${c}" data-mac-s="${j}" ${m.bitti || denendi ? "disabled" : ""}><b>${"ABCD"[j]}</b><span>${kacis(s.m)}</span></button>`; }).join("")}</div>`}
        ${geri}${ipucu1}${ipucu2}
        <div class="satir">${yardimBtn}${devamHazir && !m.dogru && o.uretec && !m.benzer ? '<button class="btn" data-mac="benzer">🔄 Benzer soru</button>' : ""}${devamHazir ? `<button class="btn ana" data-mac="devam">${o.devamYazi || "Devam ▸"}</button>` : ""}</div></div></div>`;
      kap.querySelectorAll("[data-mac-s]").forEach(b => b.onclick = () => secim(+b.dataset.macS));
      kap.querySelectorAll(".mac-boya .parca").forEach(p => { const t = () => { if (m.bitti) return; const i = +p.dataset.parca; m.boyali.has(i) ? m.boyali.delete(i) : m.boyali.add(i); ciz(); const y = kap.querySelector(`.mac-boya [data-parca="${i}"]`); if (y) y.focus(); }; p.onclick = t; p.onkeydown = ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); t(); } }; });
      const b = s => kap.querySelector(`[data-mac="${s}"]`);
      if (b("kontrol")) b("kontrol").onclick = boyaKontrol;
      if (b("ipucu")) b("ipucu").onclick = () => { m.yardim = Math.min(2, m.yardim + 1); ciz(); };
      if (b("adim")) b("adim").onclick = () => { m.adim++; ciz(); };
      if (b("benzer")) b("benzer").onclick = () => { const yeni = guvenli(o.uretec, o.z || 2); if (!gecerli(yeni)) return toast("Şu an benzer soru hazırlanamadı."); motor(kap, Object.assign({}, o, { q: yeni, benzer: true, sonuc: m.sonuc })); };
      if (b("devam")) b("devam").onclick = () => { aktifMotor = null; o.onBitti(m.sonuc || { ilkDogru: false, dogru: false, yardim: 3 }); };
    }
    ciz();
    return m;
  }
  /* Otomatik test: aktif soruyu doğru cevaplayıp “Devam”a basar. */
  function otomatikCevapla() {
    const m = aktifMotor; if (!m) return false;
    if (!m.bitti) {
      const e = m.q.etkilesim;
      if (e && e.tur === "boya") { m.boyali = ilkN(e.p); m.boyaKontrol(); }
      else { const d = m.q.secenekler.findIndex(x => x.dogru); const btn = document.querySelector(`[data-mac-s="${d}"]`); if (btn) btn.click(); else m.sec(d); }
    }
    const dv = document.querySelector('[data-mac="devam"]'); if (!dv) return false;
    dv.click(); return true;
  }

  /* ============================ AVATAR VE ROBOT ============================ */
  const AVATARLAR = ["🦊", "🐼", "🐱", "🐯", "🦉", "🐸", "🐧", "🐻", "🐰", "🐨", "🦁", "🐢"];
  const AKSESUARLAR = [{ id: "sapka", s: "🎩", ad: "Silindir şapka" }, { id: "gozluk", s: "🕶️", ad: "Güneş gözlüğü" }, { id: "fiyonk", s: "🎀", ad: "Fiyonk" }, { id: "tac", s: "👑", ad: "Taç" }, { id: "kep", s: "🎓", ad: "Mezuniyet kepi" }, { id: "cicek", s: "🌼", ad: "Papatya" }, { id: "kask", s: "⛑️", ad: "Kâşif kaskı" }, { id: "nota", s: "🎵", ad: "Nota" }];
  const ROBOT_RENKLER = [{ id: "yesil", r: "#2e9b57", ad: "Orman yeşili" }, { id: "mor", r: "#8a5cd6", ad: "Kale moru" }, { id: "turuncu", r: "#e07a1f", ad: "Vadi turuncusu" }, { id: "kirmizi", r: "#d64545", ad: "Ada kırmızısı" }, { id: "altin", r: "#c9a227", ad: "Altın" }];
  const PARCALAR = ["Anten", "Jet motoru", "Kalkan", "Pervane", "Lazer gözlük", "Roket kolları", "Yıldız taç"];
  function robotSvg(seviye, renk, buyuk) {
    const g = renk || "var(--cobalt)", L = seviye || 0;
    let ic = "";
    if (L >= 2) ic += `<path d="M44 128 L50 140 L56 128 Z M64 128 L70 140 L76 128 Z" style="fill:#f2b632"/>`;
    ic += `<rect x="44" y="108" width="12" height="20" rx="4" style="fill:var(--muted)"/><rect x="64" y="108" width="12" height="20" rx="4" style="fill:var(--muted)"/>`;
    ic += `<line x1="30" y1="70" x2="14" y2="92" stroke-width="7" stroke-linecap="round" style="stroke:var(--muted)"/><line x1="90" y1="70" x2="106" y2="92" stroke-width="7" stroke-linecap="round" style="stroke:var(--muted)"/>`;
    if (L >= 6) ic += `<rect x="6" y="88" width="14" height="14" rx="3" style="fill:#e07a1f"/><rect x="100" y="88" width="14" height="14" rx="3" style="fill:#e07a1f"/>`;
    ic += `<rect x="30" y="58" width="60" height="52" rx="12" style="fill:${g}"/><circle cx="60" cy="84" r="9" style="fill:var(--sun)"/>`;
    if (L >= 3) ic += `<path d="M98 76 h20 v14 q0 14 -10 20 q-10 -6 -10 -20 Z" style="fill:var(--good);stroke:var(--sheet);stroke-width:2"/>`;
    if (L >= 1) ic += `<line x1="60" y1="22" x2="60" y2="8" stroke-width="3" style="stroke:var(--ink)"/><circle cx="60" cy="7" r="5" style="fill:#d64545"/>`;
    if (L >= 4) ic += `<ellipse cx="60" cy="3" rx="18" ry="3" style="fill:var(--muted)"/>`;
    ic += `<rect x="34" y="20" width="52" height="40" rx="12" style="fill:${g}"/><rect x="40" y="27" width="40" height="22" rx="8" style="fill:var(--sheet)"/>`;
    ic += L >= 5 ? `<rect x="40" y="31" width="40" height="10" rx="5" style="fill:#d64545"/>` : `<circle cx="51" cy="37" r="4" style="fill:var(--ink)"/><circle cx="69" cy="37" r="4" style="fill:var(--ink)"/>`;
    ic += `<path d="M52 44 q8 6 16 0" fill="none" stroke-width="2.5" stroke-linecap="round" style="stroke:var(--ink)"/>`;
    if (L >= 7) ic += `<polygon points="80,14 83,21 90,21 84,25 86,32 80,28 74,32 76,25 70,21 77,21" style="fill:var(--sun)"/>`;
    return `<svg class="mac-robot${buyuk ? " buyuk" : ""}" viewBox="0 0 120 142" role="img" aria-label="Robot ${kacis(D().robotAd)}, seviye ${L}"><g class="govde-g">${ic}</g></svg>`;
  }
  function avatarHTML(kucuk) {
    const m = D(), a = AKSESUARLAR.find(x => x.id === m.aksesuar);
    return `<span class="mac-avatar${kucuk ? " kucuk" : ""}" aria-label="Avatarın"><span>${m.avatar}</span>${a ? `<span class="aks">${a.s}</span>` : ""}</span>`;
  }
  const robotRenk = () => (ROBOT_RENKLER.find(r => r.id === D().robotRenk) || {}).r || null;
  function sayaclarHTML() {
    const m = D();
    return `<div class="mac-sayaclar"><span title="Yıldız">⭐ ${toplamYildiz()}</span><span title="Rozet">🏅 ${Object.keys(m.rozetler).length}/${ROZETLER.length}</span><span title="Robot seviyesi">🤖 Sv. ${m.robotSeviye}</span>${sandikHakki() ? `<span>🎁 ${sandikHakki()} sandık</span>` : ""}</div>`;
  }
  const yolIz = parcalar => `<p class="yol-iz"><a href="#/macera">Macera Akademisi</a>${parcalar.map(([ad, h]) => " › " + (h ? `<a href="${h}">${ad}</a>` : ad)).join("")}</p>`;
  function bagla(kok) {
    (kok || ana()).querySelectorAll("[data-git]").forEach(b => b.onclick = () => git(b.dataset.git));
  }

  /* ============================ ANA MENÜ ============================ */
  function menu() {
    const m = D(), ad = DEPO.ayar.ogrenciAdi || "Kâşif";
    const g = gunluk(), gorevler = gunlukGorevler(), biten = gorevler.filter(x => x.tamam).length;
    const dugmeler = [
      ["▶️", "Devam Et", m.son ? "kaldığın yerden" : "maceraya başla", m.son || "#/macera/harita", "ana"],
      ["🗺️", "Macera Haritası", "6 bölge", "#/macera/harita"],
      ["🎮", "Mini Oyunlar", "robot, hazine, atölye", "#/macera/oyunlar"],
      ["🍕", "Kesirler Macerası", bolgeYildiz("kesir") + "/9 yıldız", "#/macera/kesir"],
      ["📚", "Derslerim", "matematik konuları", "#/ders/mat"],
      ["📝", "Sınav Merkezi", "denemeler", "#/deneme"],
      ["📒", "Yanlış Sorularım", "yeniden çöz", "#/hatalar"],
      ["🏆", "Başarılarım", Object.keys(m.rozetler).length + " rozet", "#/macera/basarilar"],
      ["📅", "Günlük Görevler", g.odul ? "bugün tamam ✔" : biten + "/3", "#/macera/gorevler"],
      ["👪", "Veli Paneli", "PIN ile", "#/veli"],
      ["⚙️", "Ayarlar", "avatar, robot", "#/macera/avatar"],
    ];
    ana().innerHTML = `<div class="mac mac-iki">
      <section class="kart vurgu mac-panel"><span class="etiket">🧮 Matematik</span><h1>Matematik Macera Akademisi</h1>
        <div class="mac-bas">${avatarHTML()}<div class="mac-balon">Merhaba <b>${kacis(ad)}</b>! Ben ${kacis(m.robotAd)}. ${toplamYildiz() ? "Bugün hangi bölgeyi keşfedelim?" : "Haritadan ilk bölgeyi seçerek başlayalım!"}</div></div>
        <div class="mac-robot-sahne">${robotSvg(m.robotSeviye, robotRenk())}<div style="display:grid;gap:8px">${sayaclarHTML()}<p class="kucuk-yazi muted">Acele yok: istediğin kadar dene, ipuçlarını kullan. Her soru seni biraz daha güçlendirir.</p></div></div></section>
      <section class="mac-menu" aria-label="Macera menüsü">${dugmeler.map(([s, a, k, h, c]) => `<button class="mac-dugme ${c || ""}" data-git="${h}"><span>${s}</span>${a}<small>${k}</small></button>`).join("")}</section></div>`;
    bagla();
  }

  /* ============================ MACERA HARİTASI ============================ */
  const HARITA_NOKTA = [[90, 560], [270, 470], [100, 370], [270, 270], [100, 170], [260, 70]];
  function harita() {
    const yol = "M" + HARITA_NOKTA.map(p => p.join(" ")).join(" L");
    let dug = "";
    BOLGELER.forEach((b, i) => {
      const [x, y] = HARITA_NOKTA[i], acik = bolgeAcik(i), yd = bolgeYildiz(b.id);
      dug += `<g class="dugum" data-bolge="${b.id}" tabindex="0" role="button" aria-label="${b.ad}${acik ? "" : " (kilitli)"}">
        <circle cx="${x}" cy="${y}" r="40" style="fill:var(--sheet)"/><circle class="halka" cx="${x}" cy="${y}" r="40" style="fill:${b.renk};fill-opacity:${acik ? 0.9 : 0.3};stroke:var(--sheet);stroke-width:4"/>
        <text x="${x}" y="${y + 13}" text-anchor="middle" font-size="36">${acik ? b.simge : "🔒"}</text>
        <rect x="${x - 72}" y="${y + 44}" width="144" height="40" rx="10" style="fill:var(--sheet);stroke:var(--line)"/>
        <text class="g-yazi" x="${x}" y="${y + 61}" text-anchor="middle" font-size="13" font-weight="700">${b.kisa}</text>
        <text x="${x}" y="${y + 78}" text-anchor="middle" font-size="13" style="fill:var(--sun)">${"★".repeat(Math.min(9, yd))}${"☆".repeat(9 - Math.min(9, yd))}</text></g>`;
    });
    const harSvg = `<svg class="mac-harita" viewBox="0 0 360 660" role="img" aria-label="Macera haritası">
      <rect x="0" y="0" width="360" height="660" rx="24" style="fill:var(--good-soft)"/>
      <path d="M0 610 Q90 590 180 620 T360 600 V660 H0 Z" style="fill:var(--cobalt-soft)"/><path d="M220 0 Q300 40 360 20 V0 Z" style="fill:var(--cobalt-soft)"/>
      <text x="320" y="610" font-size="22">🌊</text><text x="20" y="40" font-size="22">☁️</text><text x="190" y="140" font-size="18">🌲</text><text x="300" y="380" font-size="18">🌲</text><text x="30" y="300" font-size="18">🪨</text>
      <path class="mac-patika-alt" d="${yol}"/><path class="mac-patika" d="${yol}"/>${dug}</svg>`;
    ana().innerHTML = `<div class="mac">${yolIz([["Harita"]])}<div class="mac-iki">
      <section class="kart">${harSvg}</section>
      <div class="mac" style="align-content:start"><section class="kart vurgu"><div class="satir ara"><h1>🗺️ Macera Haritası</h1>${sayaclarHTML()}</div>
        <p>Bir bölgeye dokun. Her bölgede <b>Öğren</b>, <b>Uygula</b> ve <b>Ustalaş</b> aşamaları var; her aşamadan en çok 3 yıldız kazanırsın. Bir bölgede <b>6 yıldız</b> toplayınca sıradaki bölge açılır.</p></section>
      <section class="mac-bolgeler">${BOLGELER.map((b, i) => { const acik = bolgeAcik(i); return `<button class="mac-bolge ${acik ? "" : "kilitli"}" style="--renk:${b.renk}" data-bolge="${b.id}" ${acik ? "" : 'aria-disabled="true"'}><span class="simge">${acik ? b.simge : "🔒"}</span><span><b>${b.ad}</b><span class="mac-yildiz">${yildizYaz(bolgeYildiz(b.id), 9)}</span><br><span class="kucuk-yazi muted">${acik ? bolgeYildiz(b.id) + "/9 yıldız" : `${BOLGELER[i - 1].de} 6 yıldız topla`}</span></span></button>`; }).join("")}
        <button class="mac-bolge" style="--renk:${KESIR_BOLGE.renk}" data-git="#/macera/kesir"><span class="simge">🍕</span><span><b>Kesirler Macerası</b><span class="mac-yildiz">${yildizYaz(bolgeYildiz("kesir"), 9)}</span><br><span class="kucuk-yazi muted">Özel görev · her zaman açık</span></span></button></section></div></div></div>`;
    ana().querySelectorAll("[data-bolge]").forEach(el => { const ac_ = () => { const i = BOLGE_IDLER.indexOf(el.dataset.bolge); if (!bolgeAcik(i)) return toast(`Bu bölge kilitli. ${BOLGELER[i - 1].de} 6 yıldız toplayınca açılacak.`); git("#/macera/bolge/" + el.dataset.bolge); }; el.onclick = ac_; el.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ac_(); } }; });
    bagla();
  }

  /* ============================ BÖLGE SAYFASI ============================ */
  const ASAMA = { ogren: { ad: "Öğren", s: "📖", a: "Kısa, görselli anlatım kartları ve bir hızlı kontrol sorusu." }, uygula: { ad: "Uygula", s: "✏️", a: "6 soru. İpuçları seninle!" }, ustalas: { ad: "Ustalaş", s: "🏅", a: "8 karışık soru. Hatasız seri yaparsan bonus yıldız!" } };
  function bolgeSayfasi(id, asama) {
    if (id === "kesir") return kesirSayfasi(asama);
    const b = BOLGE[id], i = BOLGE_IDLER.indexOf(id);
    if (!b) return harita();
    if (!bolgeAcik(i)) { toast("Bu bölge henüz kilitli."); return harita(); }
    if (asama === "ogren") return ogrenAkisi(id);
    if (asama === "uygula" || asama === "ustalas") return asamaAkisi(id, asama);
    const y = D().bolgeler[id] || {};
    ana().innerHTML = `<div class="mac">${yolIz([["Harita", "#/macera/harita"], [b.kisa]])}
      <section class="kart" style="border-left:8px solid ${b.renk}"><div class="mac-bas"><span style="font-size:3rem">${b.simge}</span><div><h1>${b.ad}</h1><span class="mac-yildiz">${yildizYaz(bolgeYildiz(id), 9)}</span> <span class="muted">${bolgeYildiz(id)}/9</span></div></div>
        <p class="muted">${b.ozel ? "Bu bölgenin soruları macera için özel hazırlandı." : "Konular: " + b.konular.filter(k => KONU[k]).map(k => KONU[k].ad).join(", ") + "."}</p></section>
      <section class="mac-asamalar">${Object.entries(ASAMA).map(([k, a]) => `<button class="mac-asama" data-git="#/macera/bolge/${id}/${k}"><span style="font-size:2rem">${a.s}</span><span class="ad">${a.ad}</span><span class="mac-yildiz">${yildizYaz(y[k] || 0)}</span><span class="kucuk-yazi muted">${a.a}</span></button>`).join("")}</section>
      ${id === "sayilar" ? `<section class="kart sari"><div class="satir ara"><div><h2>🍕 Kesirler Macerası</h2><p class="kucuk-yazi">Kesirleri boyayarak, karşılaştırarak öğren.</p></div><button class="btn ana" data-git="#/macera/kesir">Git</button></div></section>` : ""}</div>`;
    bagla();
  }
  /* Öğren: kartlar + hızlı kontrol sorusu */
  function ogrenAkisi(id) {
    const b = BOLGE[id], kartlar = OGREN[id]; let i = 0;
    D().son = "#/macera/bolge/" + id + "/ogren"; kaydetDurum();
    const ciz = () => {
      const k = kartlar[i];
      ana().innerHTML = `<div class="mac">${yolIz([["Harita", "#/macera/harita"], [b.kisa, "#/macera/bolge/" + id], ["Öğren"]])}
        <section class="kart vurgu"><div class="satir ara"><h1>📖 ${b.kisa}: Öğren</h1><span class="etiket">${i + 1}/${kartlar.length}</span></div>
        <div class="mac-ogren mac-iki esit"><div class="mac" style="align-content:start"><h2>${k.b}</h2><p>${k.m}</p></div><div class="gorsel">${k.g()}</div></div>
        <div class="mac-noktalar">${kartlar.map((_, j) => `<i class="${j === i ? "a" : ""}"></i>`).join("")}</div>
        <div class="mac-gezinti"><button class="btn" data-mac="geri" ${i === 0 ? "disabled" : ""}>◂ Geri</button><button class="btn ana" data-mac="ileri">${i === kartlar.length - 1 ? "Hızlı kontrole geç ▸" : "İleri ▸"}</button></div></section></div>`;
      ana().querySelector('[data-mac="geri"]').onclick = () => { if (i > 0) { i--; ciz(); } };
      ana().querySelector('[data-mac="ileri"]').onclick = () => { if (i < kartlar.length - 1) { i++; ciz(); } else kontrol(); };
    };
    const kontrol = () => {
      const [[f, z]] = asamaPlani(id, "ogren"), testId = DEPO.uid();
      ana().innerHTML = `<div class="mac">${yolIz([["Harita", "#/macera/harita"], [b.kisa, "#/macera/bolge/" + id], ["Öğren"]])}<section class="kart vurgu"><h2>⚡ Hızlı kontrol</h2><p class="kucuk-yazi muted">Öğrendiklerini bir soruyla deneyelim.</p></section><section class="kart" id="macSoruKap"></section></div>`;
      motor($("#macSoruKap"), { q: guvenli(f, z), uretec: f, z, baglam: { bolge: id, asama: "ogren", testId }, devamYazi: "Bitir ▸", onBitti: r => asamaSonu(id, "ogren", r.ilkDogru ? 3 : 2, { dogru: r.ilkDogru ? 1 : 0, toplam: 1 }) });
    };
    ciz();
  }
  /* Uygula / Ustalaş */
  function asamaAkisi(id, asama, bitince) {
    const b = bolgeBul(id), plan = asamaPlani(id, asama), testId = DEPO.uid();
    const A = { i: 0, ilk: [], seri: 0, enSeri: 0, puan: 0 };
    const yol = id === "kesir" ? [["Kesirler", "#/macera/kesir"], [ASAMA[asama].ad]] : [["Harita", "#/macera/harita"], [b.kisa, "#/macera/bolge/" + id], [ASAMA[asama].ad]];
    D().son = (id === "kesir" ? "#/macera/kesir/" : "#/macera/bolge/" + id + "/") + asama; kaydetDurum();
    const sonraki = () => {
      if (A.i >= plan.length) {
        const d = A.ilk.filter(Boolean).length;
        let y = asama === "uygula" ? (d >= 5 ? 3 : d >= 3 ? 2 : 1) : (d >= 7 ? 3 : d >= 5 ? 2 : 1);
        const bonus = asama === "ustalas" && A.enSeri >= 5 && y < 3; if (bonus) y++;
        return asamaSonu(id, asama, y, { dogru: d, toplam: plan.length, enSeri: A.enSeri, bonus, puan: A.puan }, bitince);
      }
      const [f, z] = plan[A.i];
      ana().innerHTML = `<div class="mac">${yolIz(yol)}
        <section class="kart vurgu"><div class="satir ara"><h2>${ASAMA[asama].s} ${b.kisa}: ${ASAMA[asama].ad}</h2><span class="etiket">Soru ${A.i + 1}/${plan.length}</span></div>
          <div class="ilerleme">${plan.map((_, j) => `<i class="${j < A.i ? (A.ilk[j] ? "d" : "s") : ""}"></i>`).join("")}</div>
          ${asama === "ustalas" ? `<p class="kucuk-yazi">${A.seri >= 2 ? `<span class="mac-seri">🔥 ${A.seri} soruluk seri!</span> ` : ""}Hatasız 5'li seri = bonus yıldız.</p>` : ""}</section>
        <section class="kart" id="macSoruKap"></section></div>`;
      motor($("#macSoruKap"), { q: guvenli(f, z), uretec: f, z, baglam: { bolge: id, asama, testId }, onBitti: r => {
        A.ilk.push(r.ilkDogru);
        if (r.ilkDogru) { A.seri++; A.enSeri = Math.max(A.enSeri, A.seri); A.puan += 10 + (A.seri >= 3 ? 5 : 0); } else { A.seri = 0; A.puan += r.dogru ? 5 : 2; }
        A.i++; sonraki();
      } });
    };
    sonraki();
  }
  function asamaSonu(id, asama, y, ozet, bitince) {
    const b = bolgeBul(id), onceAcik = BOLGELER.map((_, i) => bolgeAcik(i));
    const artis = asamaYildizKaydet(id, asama, y);
    say(asama); if (id === "kesir") say("kesir");
    const yeniAcilan = BOLGELER.filter((_, i) => bolgeAcik(i) && !onceAcik[i]);
    kaydetDurum();
    if (bitince) return bitince(y);
    const sira = ["ogren", "uygula", "ustalas"], sonrakiA = sira[sira.indexOf(asama) + 1];
    const taban = id === "kesir" ? "#/macera/kesir" : "#/macera/bolge/" + id;
    ana().innerHTML = `<div class="mac"><section class="kart vurgu mac-sonuc"><h1>${ASAMA[asama].ad} tamam! 🎉</h1>
      <div class="mac-buyuk-yildiz" aria-label="${y} yıldız">${yildizYaz(y)}</div>
      <p>${ozet.toplam > 1 ? `${ozet.toplam} sorudan <b>${ozet.dogru}</b> tanesini ilk denemede çözdün.` : ozet.dogru ? "Hızlı kontrolü ilk denemede çözdün!" : "Hızlı kontrolü birlikte çözdük; bu da harika bir öğrenme!"}</p>
      ${ozet.enSeri >= 3 ? `<p class="mac-seri">🔥 En uzun serin: ${ozet.enSeri}${ozet.bonus ? " · bonus yıldız kazandın!" : ""}</p>` : ""}
      ${artis > 0 ? `<p><b>+${artis} yeni yıldız!</b> Toplam: ⭐ ${toplamYildiz()}</p>` : `<p class="muted">Bu aşamadaki en iyi sonucun: ${yildizYaz((D().bolgeler[id] || {})[asama] || 0)}</p>`}
      ${yeniAcilan.length ? `<div class="mac-mesaj iyi"><b>${yeniAcilan[0].simge} Yeni bölge açıldı: ${yeniAcilan[0].ad}!</b></div>` : ""}
      ${sandikHakki() ? `<p>🎁 Açılmayı bekleyen <b>${sandikHakki()}</b> hazine sandığın var!</p>` : ""}
      <div class="satir" style="justify-content:center">${sonrakiA ? `<button class="btn ana" data-git="${taban}/${sonrakiA}">${ASAMA[sonrakiA].s} ${ASAMA[sonrakiA].ad} aşamasına geç</button>` : ""}
        <button class="btn" data-git="${taban}/${asama}">🔁 Yeniden oyna</button><button class="btn" data-git="${taban}">${b.kisa} sayfası</button><button class="btn" data-git="#/macera/harita">🗺️ Harita</button>${sandikHakki() ? '<button class="btn" data-git="#/macera/avatar">🎁 Sandık aç</button>' : ""}</div></section></div>`;
    bagla();
    if (!rozetKontrol().length && yeniAcilan.length) kutla(yeniAcilan[0].simge, "Yeni bölge açıldı!", yeniAcilan[0].ad);
    if (D().son === taban + "/" + asama) { D().son = sonrakiA ? taban + "/" + sonrakiA : "#/macera/harita"; kaydetDurum(); }
  }

  /* ============================ KESİRLER MACERASI ============================ */
  function kesirSayfasi(asama) {
    if (asama === "ogren") return kesirOgren();
    if (asama === "uygula" || asama === "ustalas") return asamaAkisi("kesir", asama);
    const y = D().bolgeler.kesir || {};
    ana().innerHTML = `<div class="mac">${yolIz([["Kesirler Macerası"]])}
      <section class="kart sari"><div class="mac-bas"><span style="font-size:3rem">🍕</span><div><h1>Kesirler Macerası</h1><span class="mac-yildiz">${yildizYaz(bolgeYildiz("kesir"), 9)}</span> <span class="muted">${bolgeYildiz("kesir")}/9</span></div></div>
        <p>Pizzacı ${kacis(D().robotAd)} siparişlere yetişemiyor! Kesirleri boyayarak, karşılaştırarak ve sayı doğrusuna yerleştirerek ona yardım et.</p></section>
      <section class="mac-asamalar">${[["ogren", "Şerit ve pasta boya, karşılaştır, denk kesir bul."], ["uygula", "6 soru: boyama, sayı doğrusu, karşılaştırma, kesir-bölme."], ["ustalas", "8 karışık soru, seri bonusu."]].map(([k, a]) => `<button class="mac-asama" data-git="#/macera/kesir/${k}"><span style="font-size:2rem">${ASAMA[k].s}</span><span class="ad">${ASAMA[k].ad}</span><span class="mac-yildiz">${yildizYaz(y[k] || 0)}</span><span class="kucuk-yazi muted">${a}</span></button>`).join("")}</section></div>`;
    bagla();
  }
  let kesirOgrenDurum = null;
  function kesirOgren() {
    const S_ = kesirOgrenDurum = { i: 0, tamam: new Set(), boyali: new Set(), mesaj: null, deneme: 0 };
    D().son = "#/macera/kesir/ogren"; kaydetDurum();
    const gorevBasarili = () => { S_.tamam.add(S_.i); S_.mesaj = { iyi: true, m: sec(OVGU) + " Görevi tamamladın." }; ciz(); };
    const gorevOlmadi = ipucu => { S_.deneme++; S_.mesaj = { iyi: false, m: "Az kaldı! Bir daha bakalım. " + ipucu }; ciz(); };
    S_.kontrol = () => {
      const g = KESIR_OGREN[S_.i].gorev;
      if (g.tur === "boya") return S_.boyali.size === g.p ? gorevBasarili() : gorevOlmadi(`${g.q} parçadan tam ${g.p} tanesi boyanmalı; şu an ${S_.boyali.size} parça boyalı.`);
      if (g.tur === "denk") return S_.boyali.size === g.p * g.k ? gorevBasarili() : gorevOlmadi(`Alttaki şerit ${g.q * g.k} parça. Üstteki boyalı kısımla aynı uzunlukta boyamalısın: ${g.p * g.k} parça.`);
    };
    S_.karsilastir = t => { const g = KESIR_OGREN[S_.i].gorev, A = g.a[0] / g.a[1], B = g.b[0] / g.b[1]; ((t === "a") === (A > B)) ? gorevBasarili() : gorevOlmadi("Paylar eşit. Parçaları daha büyük olan, yani paydası küçük olan kesir daha büyüktür."); };
    S_.coz = () => { const g = KESIR_OGREN[S_.i].gorev; if (g.tur === "karsilastir") return S_.karsilastir(g.a[0] / g.a[1] > g.b[0] / g.b[1] ? "a" : "b"); S_.boyali = ilkN(g.tur === "denk" ? g.p * g.k : g.p); S_.kontrol(); };
    const ciz = () => {
      const k = KESIR_OGREN[S_.i], g = k.gorev, bitti = S_.tamam.has(S_.i);
      let w = "";
      if (g.tur === "boya") w = g.sekil === "pasta" ? svg(220, 220, pastaSvg(g.q, S_.boyali, { tikla: !bitti }), "pasta").replace('class="gorsel-svg"', 'class="mac-boya" style="max-width:300px"') : svg(500, 82, seritSvg(g.q, S_.boyali, { tikla: !bitti }), "şerit").replace('class="gorsel-svg"', 'class="mac-boya"');
      else if (g.tur === "denk") w = svg(500, 82, seritSvg(g.q, ilkN(g.p), {}), "1/2 şeridi").replace('class="gorsel-svg"', 'class="mac-boya"') + svg(500, 82, seritSvg(g.q * g.k, S_.boyali, { tikla: !bitti }), "boyanacak şerit").replace('class="gorsel-svg"', 'class="mac-boya"');
      else w = `<div class="mac-hedefler">${[["a", g.a], ["b", g.b]].map(([t, [p, q]]) => `<button class="mac-hedef" style="cursor:pointer" data-kar="${t}" ${bitti ? "disabled" : ""}><b style="font-size:1.4rem">${kesirHTML(p, q)}</b>${svg(500, 82, seritSvg(q, ilkN(p), {}), p + "/" + q).replace('class="gorsel-svg"', 'class="mac-boya"')}</button>`).join("")}</div>`;
      ana().innerHTML = `<div class="mac">${yolIz([["Kesirler", "#/macera/kesir"], ["Öğren"]])}
        <section class="kart vurgu"><div class="satir ara"><h1>📖 ${k.b}</h1><span class="etiket">${S_.i + 1}/${KESIR_OGREN.length}</span></div>
          <div class="mac-iki esit"><div class="mac" style="align-content:start"><p>${k.m}</p><div class="mac-mesaj bilgi"><b>🎯 Görev:</b> <span>${g.yonerge}</span></div>
            ${S_.mesaj ? `<div class="mac-mesaj ${S_.mesaj.iyi ? "iyi" : "nazik"}">${kacis(S_.mesaj.m)}</div>` : ""}</div>
          <div class="mac" style="align-content:start">${w}${(g.tur === "boya" || g.tur === "denk") && !bitti ? `<div class="satir ara"><span class="kucuk-yazi muted">Boyanan: <b>${S_.boyali.size}</b> parça</span><button class="btn ana" data-mac="kontrol">Kontrol et</button></div>` : ""}</div></div>
          <div class="mac-noktalar">${KESIR_OGREN.map((_, j) => `<i class="${j === S_.i ? "a" : ""}"></i>`).join("")}</div>
          <div class="mac-gezinti"><button class="btn" data-mac="geri" ${S_.i === 0 ? "disabled" : ""}>◂ Geri</button>${!bitti && S_.deneme >= 2 ? '<button class="btn" data-mac="goster">👀 Bana göster</button>' : ""}<button class="btn ${bitti ? "ana" : ""}" data-mac="ileri">${S_.i === KESIR_OGREN.length - 1 ? "Bitir ▸" : bitti ? "İleri ▸" : "Sonra yaparım ▸"}</button></div></section></div>`;
      ana().querySelectorAll(".mac-boya .parca").forEach(p => { const t = () => { const i = +p.dataset.parca; S_.boyali.has(i) ? S_.boyali.delete(i) : S_.boyali.add(i); S_.mesaj = null; ciz(); }; p.onclick = t; p.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t(); } }; });
      ana().querySelectorAll("[data-kar]").forEach(b => b.onclick = () => S_.karsilastir(b.dataset.kar));
      const b = s => ana().querySelector(`[data-mac="${s}"]`);
      if (b("kontrol")) b("kontrol").onclick = S_.kontrol;
      if (b("goster")) b("goster").onclick = S_.coz;
      b("geri").onclick = () => { if (S_.i > 0) { S_.i--; S_.boyali = new Set(); S_.mesaj = null; S_.deneme = 0; ciz(); } };
      b("ileri").onclick = () => {
        if (S_.i < KESIR_OGREN.length - 1) { S_.i++; S_.boyali = new Set(); S_.mesaj = null; S_.deneme = 0; ciz(); }
        else { const n = S_.tamam.size; asamaSonu("kesir", "ogren", n >= 4 ? 3 : n >= 2 ? 2 : 1, { dogru: n, toplam: KESIR_OGREN.length }); kesirOgrenDurum = null; }
      };
    };
    S_.ciz = ciz;
    ciz();
  }

  /* ============================ GÜNLÜK GÖREVLER ============================ */
  const GOREV_HAVUZ = {
    uygula: { s: "✏️", ad: "Bir bölgede Uygula aşamasını bitir", hedef: 1, git: "#/macera/harita" },
    ustalas: { s: "🏅", ad: "Bir Ustalaş aşamasını bitir", hedef: 1, git: "#/macera/harita" },
    ogren: { s: "📖", ad: "Bir bölgede Öğren kartlarını tamamla", hedef: 1, git: "#/macera/harita" },
    robotDogru: { s: "🤖", ad: "Matematik Robotu'nda 5 doğru cevap ver", hedef: 5, git: "#/macera/oyun/robot" },
    defter: { s: "📒", ad: "Yanlış defterinden 2 soru düzelt", hedef: 2, git: "#/hatalar" },
    hazine: { s: "🗝️", ad: "Hazine Avı'nda sandığa ulaş", hedef: 1, git: "#/macera/oyun/hazine" },
    atolyeGorev: { s: "📐", ad: "Geometri Atölyesi'nde 3 görev tamamla", hedef: 3, git: "#/macera/oyun/atolye" },
    ilkDogru: { s: "🎯", ad: "8 soruyu ilk denemede doğru çöz", hedef: 8, git: "#/macera/harita" },
    kesir: { s: "🍕", ad: "Kesirler Macerası'nda bir aşama bitir", hedef: 1, git: "#/macera/kesir" },
  };
  function gunlukGorevler() {
    const g = gunluk();
    if (!g.gorevler || g.gorevler.length !== 3) {
      const rnd = tohumlu(g.tarih + (DEPO.ayar.ogrenciAdi || ""));
      const defterVar = DEPO.liste("soru").some(s => !s.ilkDogru && s.soruNesnesi);
      let havuz = Object.keys(GOREV_HAVUZ).filter(k => k !== "defter" || defterVar);
      const secilen = [];
      // bir soru görevi + bir oyun görevi + bir serbest görev (toplam 10–15 dakika)
      const soruG = ["uygula", "ogren", "kesir", "ilkDogru", "ustalas"], oyunG = ["robotDogru", "hazine", "atolyeGorev"];
      const al = l => { const a = l.filter(k => havuz.includes(k) && !secilen.includes(k)); if (a.length) secilen.push(a[Math.floor(rnd() * a.length)]); };
      al(soruG); al(oyunG); al(defterVar ? ["defter"] : havuz);
      while (secilen.length < 3) al(havuz);
      g.gorevler = secilen; kaydetDurum();
    }
    return g.gorevler.map(id => { const t = GOREV_HAVUZ[id], n = id === "defter" ? defterDuzeltme(gunBasi()) : (g.sayac[id] || 0); return Object.assign({ id, n: Math.min(n, t.hedef), tamam: n >= t.hedef }, t); });
  }
  function gorevlerSayfasi() {
    const g = gunluk(), l = gunlukGorevler(), hepsi = l.every(x => x.tamam);
    ana().innerHTML = `<div class="mac">${yolIz([["Günlük Görevler"]])}<div class="mac-iki">
      <section class="kart vurgu"><h1>📅 Günlük Görevler</h1><p>Bugün için 3 küçük görev. Hepsi yaklaşık 10–15 dakika sürer. Bitirince <b>1 yıldız</b> ödül!</p>
        <div class="mac-bas">${robotSvg(D().robotSeviye, robotRenk())}<div class="mac-balon">${g.odul ? "Bugünlük bu kadar yeter, aferin! Yarın yeni görevlerle görüşürüz. 🌙" : hepsi ? "Bütün görevleri bitirdin! Ödülünü almayı unutma." : "Acele yok; istediğin görevden başlayabilirsin."}</div></div>
        ${hepsi && !g.odul ? '<button class="btn ana" data-mac="odul">🎁 Ödülü al (+1 ⭐)</button>' : ""}</section>
      <section class="kart"><h2>Bugünün görevleri</h2><div class="mac" style="gap:10px">${l.map(x => `<div class="mac-gorev ${x.tamam ? "tamam" : ""}"><span class="simge">${x.tamam ? "✅" : x.s}</span><div class="mac" style="gap:6px"><b>${x.ad}</b><div class="bar"><i style="width:${Math.round(100 * x.n / x.hedef)}%"></i></div><div class="satir ara"><span class="kucuk-yazi muted">${x.n}/${x.hedef}</span>${x.tamam ? '<span class="etiket iyi">tamam</span>' : `<button class="btn kucuk" data-git="${x.git}">Başla</button>`}</div></div></div>`).join("")}</div></section></div></div>`;
    bagla();
    const o = ana().querySelector('[data-mac="odul"]');
    if (o) o.onclick = () => { if (g.odul) return; g.odul = true; D().bonusYildiz = (D().bonusYildiz || 0) + 1; kaydetDurum(); kutla("🌟", "Günlük ödül!", "Bugünlük bu kadar yeter, aferin!"); rozetKontrol(); gorevlerSayfasi(); };
  }

  /* ============================ BAŞARILARIM ============================ */
  function basarilarSayfasi() {
    const m = D(), oyunAd = { robot: "🤖 Matematik Robotu", hazine: "🗝️ Hazine Avı", atolye: "📐 Geometri Atölyesi" };
    ana().innerHTML = `<div class="mac">${yolIz([["Başarılarım"]])}
      <section class="kart vurgu"><div class="satir ara"><h1>🏆 Başarılarım</h1>${sayaclarHTML()}</div>
        <div class="izgara dar"><div class="metrik"><b>${toplamYildiz()}</b><span>toplam yıldız</span></div><div class="metrik"><b>${m.sayac.soru || 0}</b><span>çözülen soru</span></div><div class="metrik"><b>${m.sayac.ilkDogru || 0}</b><span>ilk denemede doğru</span></div><div class="metrik"><b>${m.sayac.sabir || 0}</b><span>yardımla çözülen</span></div></div></section>
      <section class="kart"><h2>Rozetler</h2><div class="mac-rozetler">${ROZETLER.map(r => `<div class="mac-rozet ${m.rozetler[r.id] ? "" : "kilitli"}"><span>${r.simge}</span><b>${r.ad}</b><small>${m.rozetler[r.id] ? "✔ Kazanıldı · " + new Date(m.rozetler[r.id]).toLocaleDateString("tr-TR") : "🔒 " + r.kosul}</small></div>`).join("")}</div></section>
      <div class="mac-iki esit">
      <section class="kart"><h2>Bölge ilerlemesi</h2><div class="mac" style="gap:8px">${[...BOLGELER, KESIR_BOLGE].map(b => { const y = m.bolgeler[b.id] || {}; return `<div class="mac-gorev"><span class="simge">${b.simge}</span><div><b>${b.kisa}</b><div class="satir kucuk-yazi">${Object.keys(ASAMA).map(k => `<span>${ASAMA[k].ad} <span class="mac-yildiz">${yildizYaz(y[k] || 0)}</span></span>`).join("")}</div></div></div>`; }).join("")}</div></section>
      <section class="kart"><h2>Oyun rekorları</h2><div class="mac" style="gap:8px">${Object.entries(oyunAd).map(([k, a]) => `<div class="satir ara"><span>${a}</span><span><b>${m.rekorlar[k] || 0}</b> puan <span class="mac-yildiz">${yildizYaz(m.oyunYildiz[k] || 0)}</span></span></div>`).join("")}</div>
        <h2>Robotum</h2><div class="mac-bas">${robotSvg(m.robotSeviye, robotRenk())}<div><b>${kacis(m.robotAd)}</b> · seviye ${m.robotSeviye}<div class="mac-enerji" style="margin-top:6px"><i style="width:${m.robotEnerji}%"></i></div><p class="kucuk-yazi muted">Parçalar: ${PARCALAR.slice(0, m.robotSeviye).join(", ") || "henüz yok"}</p></div></div>
        <button class="btn" data-git="#/macera/avatar">🎁 Sandıklar ve avatar</button></section></div></div>`;
    bagla();
  }

  /* ============================ AVATAR, ROBOT VE SANDIKLAR (AYARLAR) ============================ */
  function avatarSayfasi() {
    const m = D();
    ana().innerHTML = `<div class="mac">${yolIz([["Ayarlar"]])}<div class="mac-iki">
      <section class="kart vurgu"><h1>⚙️ Avatarım ve Robotum</h1>
        <div class="mac-bas">${avatarHTML()}${robotSvg(m.robotSeviye, robotRenk(), true)}</div>
        <h3>Avatar seç</h3><div class="mac-secim">${AVATARLAR.map(a => `<button class="${m.avatar === a ? "secili" : ""}" data-avatar="${a}" aria-label="avatar ${a}">${a}</button>`).join("")}</div>
        <label class="alan">Robotunun adı<input type="text" id="macRobotAd" maxlength="14" value="${kacis(m.robotAd)}"></label>
        <div><button class="btn ana" data-mac="adKaydet">Adı kaydet</button></div>
        <p class="kucuk-yazi muted">Macerada ses yoktur; sessiz ortamda rahatça çalışabilirsin.</p></section>
      <section class="kart"><h2>🎁 Hazine sandıkları</h2><p>Her <b>10 yıldızda</b> bir sandık kazanırsın. Sandıktan avatar aksesuarı ya da robot boyası çıkar (yalnızca süs).</p>
        <div class="satir ara"><span class="mac-sayaclar"><span>🎁 ${sandikHakki()} sandık</span><span>⭐ ${toplamYildiz()}</span></span><button class="btn ana" data-mac="sandik" ${sandikHakki() ? "" : "disabled"}>Sandık aç</button></div>
        ${sandikHakki() ? "" : `<p class="kucuk-yazi muted">Sonraki sandığa ${10 - toplamYildiz() % 10} yıldız kaldı.</p>`}
        <h3>Aksesuarlar</h3><div class="mac-secim"><button class="${!m.aksesuar ? "secili" : ""}" data-aks="" aria-label="aksesuarsız">🚫</button>${AKSESUARLAR.map(a => `<button class="${m.aksesuar === a.id ? "secili" : ""}" data-aks="${a.id}" ${m.aksesuarlar.includes(a.id) ? "" : "disabled"} title="${a.ad}${m.aksesuarlar.includes(a.id) ? "" : " (sandıktan çıkar)"}">${m.aksesuarlar.includes(a.id) ? a.s : "🔒"}</button>`).join("")}</div>
        <h3>Robot boyası</h3><div class="mac-secim"><button class="${!m.robotRenk ? "secili" : ""}" data-renk="" aria-label="mavi">🔵</button>${ROBOT_RENKLER.map(r => `<button class="${m.robotRenk === r.id ? "secili" : ""}" data-renk="${r.id}" ${m.robotRenkler.includes(r.id) ? "" : "disabled"} title="${r.ad}"><span style="display:inline-block;width:30px;height:30px;border-radius:50%;background:${m.robotRenkler.includes(r.id) ? r.r : "var(--line)"}"></span></button>`).join("")}</div>
        <h3>Robot parçaları</h3><p class="kucuk-yazi">Matematik Robotu'nda enerji doldukça yeni parça gelir: ${PARCALAR.map((p, i) => i < m.robotSeviye ? "✔ " + p : "🔒 " + p).join(" · ")}</p></section></div></div>`;
    ana().querySelectorAll("[data-avatar]").forEach(b => b.onclick = () => { m.avatar = b.dataset.avatar; kaydetDurum(); avatarSayfasi(); });
    ana().querySelectorAll("[data-aks]").forEach(b => b.onclick = () => { m.aksesuar = b.dataset.aks || null; kaydetDurum(); avatarSayfasi(); });
    ana().querySelectorAll("[data-renk]").forEach(b => b.onclick = () => { m.robotRenk = b.dataset.renk || null; kaydetDurum(); avatarSayfasi(); });
    ana().querySelector('[data-mac="adKaydet"]').onclick = () => { const v = $("#macRobotAd").value.trim().slice(0, 14); if (v) { m.robotAd = v; kaydetDurum(); toast("Robotunun adı: " + v); avatarSayfasi(); } };
    ana().querySelector('[data-mac="sandik"]').onclick = () => {
      if (!sandikHakki()) return;
      m.sandikAcilan++;
      const kalan = [...AKSESUARLAR.filter(a => !m.aksesuarlar.includes(a.id)).map(a => ["a", a]), ...ROBOT_RENKLER.filter(r => !m.robotRenkler.includes(r.id)).map(r => ["r", r])];
      if (!kalan.length) { kaydetDurum(); kutla("✨", "Sandıktan parıltı çıktı!", "Bütün süsleri topladın. Harika bir koleksiyon!"); return avatarSayfasi(); }
      const [t, x] = sec(kalan);
      if (t === "a") { m.aksesuarlar.push(x.id); m.aksesuar = x.id; } else { m.robotRenkler.push(x.id); m.robotRenk = x.id; }
      kaydetDurum(); avatarSayfasi();
      kutla(t === "a" ? x.s : "🎨", "Sandıktan çıktı: " + x.ad, t === "a" ? "Avatarına taktık!" : "Robotunu boyadık!");
    };
  }

  /* ============================ MİNİ OYUNLAR ============================ */
  const OYUNLAR = [
    { id: "robot", ad: "Matematik Robotu", s: "🤖", a: "Doğru cevaplarla robotunun enerjisini doldur; enerji dolunca robotun seviye atlar ve yeni parça kazanır." },
    { id: "hazine", ad: "Matematik Hazine Avı", s: "🗝️", a: "Haritada dolaş, kapılardaki soruları çöz, 3 anahtar topla ve hazine sandığını aç." },
    { id: "atolye", ad: "Geometri Atölyesi", s: "📐", a: "Şekilleri sürükleyip doğru yere bırak: alan, açı, çokgen ve üçgen görevleri." },
  ];
  function oyunlarSayfasi() {
    const m = D();
    ana().innerHTML = `<div class="mac">${yolIz([["Mini Oyunlar"]])}<section class="kart vurgu"><h1>🎮 Mini Oyunlar</h1><p>Süre sınırı yok. İstediğin oyunu seç, rahatça oyna!</p></section>
      <section class="mac-bolgeler">${OYUNLAR.map(o => `<button class="mac-bolge" data-git="#/macera/oyun/${o.id}"><span class="simge">${o.s}</span><span><b>${o.ad}</b><span class="kucuk-yazi">${o.a}</span><br><span class="kucuk-yazi muted">Rekor: ${m.rekorlar[o.id] || 0} puan</span> <span class="mac-yildiz">${yildizYaz(m.oyunYildiz[o.id] || 0)}</span></span></button>`).join("")}</section></div>`;
    bagla();
  }
  function oyunBitti(id, puan, yildiz, sure) {
    try { DEPO.kaydet("oyun", { ders: "mat", oyun: "macera-" + id, puan, yildiz, sure }); } catch (e) {}
    const m = D(), rekor = puan > (m.rekorlar[id] || 0);
    if (rekor) m.rekorlar[id] = puan;
    m.oyunYildiz[id] = Math.max(m.oyunYildiz[id] || 0, yildiz);
    say("oyun"); kaydetDurum();
    return rekor;
  }
  function oyunSonuHTML(id, puan, yildiz, rekor, ek) {
    return `<section class="kart vurgu mac-sonuc"><h1>Oyun bitti! 🎉</h1><div class="mac-buyuk-yildiz">${yildizYaz(yildiz)}</div><p><b>${puan}</b> puan${rekor ? " · 🏆 Yeni rekor!" : ""}</p>${ek || ""}
      <div class="satir" style="justify-content:center"><button class="btn ana" data-git="#/macera/oyun/${id}">🔁 Yeniden oyna</button><button class="btn" data-git="#/macera/oyunlar">🎮 Oyunlar</button><button class="btn" data-git="#/macera">🏠 Macera menüsü</button></div></section>`;
  }
  const karisikUretec = () => sec([...BOLGELER.flatMap(b => b.uretecler), ...KESIR_BOLGE.uretecler]);

  /* ---------- Matematik Robotu ---------- */
  function robotOyunu() {
    const m = D(); D().son = "#/macera/oyun/robot"; kaydetDurum();
    const O = aktifOyun = { id: "robot", asama: "secim" };
    const panel = () => `<aside class="kart mac-panel"><div class="mac-robot-sahne">${robotSvg(m.robotSeviye, robotRenk(), true)}<div class="mac" style="gap:8px"><b>${kacis(m.robotAd)} · seviye ${m.robotSeviye}</b>
      <div class="mac-enerji" role="progressbar" aria-valuenow="${m.robotEnerji}" aria-valuemin="0" aria-valuemax="100"><i style="width:${m.robotEnerji}%"></i></div><span class="kucuk-yazi muted">Enerji: %${m.robotEnerji}${m.robotSeviye < PARCALAR.length ? ` · sıradaki parça: ${PARCALAR[m.robotSeviye]}` : ""}</span>
      ${O.asama === "oyun" ? `<div class="mac-sayaclar"><span>❓ ${O.i + (O.i < 10 ? 1 : 0)}/10</span><span>✅ ${O.dogru}</span><span>🪙 ${O.puan}</span></div>${O.seri >= 2 ? `<span class="mac-seri">🔥 ${O.seri} seri</span>` : ""}` : ""}</div></div>
      <p class="kucuk-yazi muted">Doğru cevap enerjiyi doldurur; yanlış cevap enerjiyi azaltmaz, yalnızca seriyi sıfırlar.</p></aside>`;
    const secim = () => {
      ana().innerHTML = `<div class="mac">${yolIz([["Mini Oyunlar", "#/macera/oyunlar"], ["Matematik Robotu"]])}<div class="mac-oyun">
        <section class="kart vurgu"><h1>🤖 Matematik Robotu</h1><p>10 soru çöz. Her doğru cevapla robotun <b>${kacis(m.robotAd)}</b> enerji kazanır. Enerji %100 olunca robotun seviye atlar ve yeni bir parça kazanır!</p>
        <h2>Zorluk seç</h2><div class="mac-zorluk">${[[1, "🌱 Kolay"], [2, "🌿 Orta"], [3, "🌳 Zor"]].map(([z, a]) => `<button class="mac-dugme" data-zorluk="${z}">${a}</button>`).join("")}</div></section>${panel()}</div></div>`;
      ana().querySelectorAll("[data-zorluk]").forEach(b => b.onclick = () => basla(+b.dataset.zorluk));
    };
    const basla = z => { Object.assign(O, { asama: "oyun", z, i: 0, dogru: 0, seri: 0, puan: 0, bas: Date.now(), testId: DEPO.uid(), seviyeAtladi: 0 }); soru(); };
    const soru = () => {
      if (O.i >= 10) return bitir();
      const f = karisikUretec();
      ana().innerHTML = `<div class="mac">${yolIz([["Mini Oyunlar", "#/macera/oyunlar"], ["Matematik Robotu"]])}<div class="mac-oyun"><section class="kart" id="macSoruKap"></section>${panel()}</div></div>`;
      motor($("#macSoruKap"), { q: guvenli(f, O.z), uretec: f, z: O.z, baglam: { bolge: "robot", asama: "oyun", testId: O.testId }, onBitti: r => {
        if (r.ilkDogru) { O.seri++; O.dogru++; } else O.seri = 0;
        if (r.dogru) { const e = r.ilkDogru ? 15 + (O.seri >= 3 ? 5 : 0) : 8; O.puan += r.ilkDogru ? 10 + (O.seri >= 3 ? 5 : 0) : 4; m.robotEnerji += e; say("robotDogru"); }
        if (m.robotEnerji >= 100) { m.robotEnerji -= 100; m.robotSeviye++; O.seviyeAtladi++; kaydetDurum(); kutla("🤖", `${m.robotAd} seviye atladı!`, m.robotSeviye <= PARCALAR.length ? "Yeni parça: " + PARCALAR[m.robotSeviye - 1] : "Süper robot oldu!"); }
        kaydetDurum(); O.i++; soru();
      } });
    };
    const bitir = () => {
      const y = O.dogru >= 9 ? 3 : O.dogru >= 6 ? 2 : 1, rekor = oyunBitti("robot", O.puan, y, Date.now() - O.bas);
      O.asama = "bitti"; O.sonuc = { puan: O.puan, yildiz: y };
      ana().innerHTML = `<div class="mac">${yolIz([["Mini Oyunlar", "#/macera/oyunlar"], ["Matematik Robotu"]])}<div class="mac-oyun">${oyunSonuHTML("robot", O.puan, y, rekor, `<p>10 sorudan <b>${O.dogru}</b> tanesini ilk denemede çözdün.${O.seviyeAtladi ? ` Robotun ${O.seviyeAtladi} seviye atladı!` : ""}</p>`)}${panel()}</div></div>`;
      bagla(); rozetKontrol();
    };
    O.basla = basla;
    secim();
  }

  /* ---------- Hazine Avı ---------- */
  const HAZINE_HARITALAR = [
    ["S..#D", ".#D..", "D..#.", ".#.D.", "...#C"],
    ["S.D..", "#.##D", "..D..", "D#.#.", "...DC"],
    ["S.#.C", "D.#D.", "..D.#", ".#..D", "...#."],
  ];
  function hazineOyunu() {
    D().son = "#/macera/oyun/hazine"; kaydetDurum();
    const harita_ = sec(HAZINE_HARITALAR).map(s => s.split(""));
    const O = aktifOyun = { id: "hazine", h: harita_, ben: [0, 0], acik: new Set(), anahtar: 0, ilkDogru: 0, puan: 0, bas: Date.now(), testId: DEPO.uid(), soru: null, mesaj: "Komşu karelere dokunarak ilerle. Kapılarda 🚪 soru seni bekliyor!", bitti: false };
    const k = (r, c) => r + "-" + c;
    const tip = (r, c) => O.h[r][c];
    const komsu = (r, c) => Math.abs(r - O.ben[0]) + Math.abs(c - O.ben[1]) === 1;
    O.gecilir = (r, c) => r >= 0 && c >= 0 && r < 5 && c < 5 && tip(r, c) !== "#";
    const panelHTML = () => `<aside class="kart mac-panel"><h2>🗝️ Hazine Avı</h2><div class="mac-sayaclar"><span>🗝️ ${O.anahtar}/3</span><span>🪙 ${O.puan}</span></div>
      <div class="mac-mesaj ${O.bitti ? "iyi" : "bilgi"}">${kacis(O.mesaj)}</div>${O.soru ? '<div id="macSoruKap"></div>' : ""}
      <p class="kucuk-yazi muted">🚪 kapı · 🪨 kaya · 🧰 sandık (3 anahtarla açılır)</p></aside>`;
    const ciz = () => {
      let hucreler = "";
      for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
        const t = tip(r, c), ben = O.ben[0] === r && O.ben[1] === c, kom = !O.soru && !O.bitti && komsu(r, c) && t !== "#";
        const ic = ben ? D().avatar : t === "#" ? "🪨" : t === "D" ? (O.acik.has(k(r, c)) ? "✨" : "🚪") : t === "C" ? (O.bitti ? "🎉" : "🧰") : "";
        hucreler += `<button class="mac-hucre ${t === "#" ? "kaya" : ""} ${ben ? "ben" : ""} ${kom ? "komsu" : ""}" data-hz="${k(r, c)}" ${kom ? "" : "disabled"} aria-label="${r + 1}. satır ${c + 1}. sütun ${t === "#" ? "kaya" : t === "D" ? "kapı" : t === "C" ? "sandık" : ""}">${ic}</button>`;
      }
      ana().innerHTML = `<div class="mac">${yolIz([["Mini Oyunlar", "#/macera/oyunlar"], ["Hazine Avı"]])}<div class="mac-oyun">
        <section class="kart"><div class="mac-izgara" role="grid" aria-label="Hazine haritası">${hucreler}</div></section>${O.bitti ? O.sonucHTML : panelHTML()}</div></div>`;
      ana().querySelectorAll("[data-hz]").forEach(b => b.onclick = () => { const [r, c] = b.dataset.hz.split("-").map(Number); O.dokun(r, c); });
      bagla();
      if (O.soru) {
        const f = O.soru.f;
        motor($("#macSoruKap"), { q: O.soru.q, uretec: null, z: 2, baglam: { bolge: "hazine", asama: "oyun", testId: O.testId }, devamYazi: "Tamam ▸", onBitti: r => {
          const [rr, cc] = O.soru.yer; O.soru = null; void f;
          if (r.dogru) { O.acik.add(k(rr, cc)); O.anahtar++; O.ben = [rr, cc]; O.puan += r.ilkDogru ? 30 : 15; if (r.ilkDogru) O.ilkDogru++; O.mesaj = O.anahtar >= 3 ? "Kapı açıldı, 3 anahtarın var! Şimdi sandığa git. 🧰" : `Kapı açıldı! Bir anahtar buldun (${O.anahtar}/3).`; }
          else O.mesaj = "Kapı şimdilik kapalı kaldı. Çözüm yolunu gördün; istersen kapıya yeniden dokun, yeni bir soru gelsin.";
          ciz();
        } });
      }
    };
    O.dokun = (r, c) => {
      if (O.soru || O.bitti || !O.gecilir(r, c) || !komsu(r, c)) return;
      const t = tip(r, c);
      if (t === "D" && !O.acik.has(k(r, c))) { const f = karisikUretec(); O.soru = { yer: [r, c], f, q: guvenli(f, 2) }; O.mesaj = "Kapıyı açmak için soruyu çöz:"; return ciz(); }
      if (t === "C") {
        if (O.anahtar < 3) { O.mesaj = `Sandığı açmak için 3 anahtar gerekiyor. Şu an ${O.anahtar} anahtarın var.`; return ciz(); }
        O.ben = [r, c]; O.bitti = true; O.puan += 50;
        const y = O.ilkDogru >= 3 ? 3 : O.ilkDogru >= 2 ? 2 : 1, rekor = oyunBitti("hazine", O.puan, y, Date.now() - O.bas);
        say("hazine"); kaydetDurum();
        O.sonuc = { puan: O.puan, yildiz: y };
        O.mesaj = "Sandığı açtın!";
        O.sonucHTML = oyunSonuHTML("hazine", O.puan, y, rekor, "<p>Sandıktan altınlar fışkırdı! 🪙✨</p>");
        ciz(); kutla("🧰", "Hazineyi buldun!", O.puan + " puan"); rozetKontrol(); return;
      }
      O.ben = [r, c]; ciz();
    };
    /* Otomatik test için: hedefe giden ilk adım (kapalı kapılar hedef değilse geçilmez) */
    O.yol = hedef => {
      const bas = O.ben.join("-"), onceki = { [bas]: null }, kuyruk = [O.ben];
      while (kuyruk.length) {
        const [r, c] = kuyruk.shift();
        if (r === hedef[0] && c === hedef[1]) { let x = k(r, c), yol = []; while (onceki[x]) { yol.unshift(x); x = onceki[x]; } return yol.map(s => s.split("-").map(Number)); }
        for (const [a, b] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) { const y = [r + a, c + b], ky = k(y[0], y[1]); if (!O.gecilir(y[0], y[1]) || ky in onceki) continue; const t = tip(y[0], y[1]); const hedefMi = y[0] === hedef[0] && y[1] === hedef[1]; if (!hedefMi && ((t === "D" && !O.acik.has(ky)) || t === "C")) continue; onceki[ky] = k(r, c); kuyruk.push(y); }
      }
      return null;
    };
    ciz();
  }

  /* ---------- Geometri Atölyesi ---------- */
  const mini = (ic, w = 120, h = 90) => `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true">${ic}</svg>`;
  function izgaraParca(a, b) { const k = Math.min(104 / a, 80 / b, 20), x0 = (120 - a * k) / 2, y0 = (90 - b * k) / 2; let ic = ""; for (let i = 0; i < b; i++) for (let j = 0; j < a; j++) ic += `<rect class="g-yumusak g-cizgi" x="${f1(x0 + j * k)}" y="${f1(y0 + i * k)}" width="${f1(k)}" height="${f1(k)}" stroke-width="1"/>`; return mini(ic); }
  function ucgenIzgara(t, h, kayma) { const k = 13, x0 = (120 - t * k) / 2, yb = 84; let ic = ""; for (let i = 0; i <= 6; i++) ic += `<line class="g-ince" x1="${f1(x0 - k)}" y1="${yb - i * k}" x2="${f1(x0 + (t + 1) * k)}" y2="${yb - i * k}"/>`; for (let j = -1; j <= t + 1; j++) ic += `<line class="g-ince" x1="${f1(x0 + j * k)}" y1="${yb - 6 * k}" x2="${f1(x0 + j * k)}" y2="${yb}"/>`; ic += `<polygon class="g-b g-cizgi" points="${f1(x0)},${yb} ${f1(x0 + t * k)},${yb} ${f1(x0 + kayma * k)},${yb - h * k}" stroke-width="2" fill-opacity=".85"/>`; return mini(ic); }
  const ucgenMini = (P) => mini(`<polygon class="g-yumusak g-cizgi" points="${P}" stroke-width="3"/>`);
  const aciMini = m => { const x = 30, y = 74, L = 70; return mini(`<line class="g-cizgi" x1="${x}" y1="${y}" x2="${x + L}" y2="${y}" stroke-width="4"/><line class="g-cizgi" x1="${x}" y1="${y}" x2="${f1(x + 60 * Math.cos(rad(m)))}" y2="${f1(y - 60 * Math.sin(rad(m)))}" stroke-width="4"/>` + (m === 90 ? `<path class="g-cizgi" d="M${x + 14} ${y} v-14 h-14" fill="none" stroke-width="2"/>` : `<path class="g-ok-a" d="M${x + 20} ${y} A20 20 0 0 0 ${f1(x + 20 * Math.cos(rad(m)))} ${f1(y - 20 * Math.sin(rad(m)))}" fill="none" stroke-width="3"/>`)); };
  const ATOLYE = [
    { b: "Alanı 12 birim kare olan dikdörtgeni ızgaraya yerleştir.", ip: "Kareleri say: sıradaki kare sayısı × sıra sayısı.", hedefler: [["izgara", "📏 Izgara (12 birim kare)"]],
      parcalar: [["r34", izgaraParca(4, 3), "", "izgara"], ["r25", izgaraParca(5, 2), "", null, "Bu dikdörtgen 5 × 2 = 10 birim kare."], ["r44", izgaraParca(4, 4), "", null, "Bu kare 4 × 4 = 16 birim kare."], ["r27", izgaraParca(7, 2), "", null, "Bu dikdörtgen 7 × 2 = 14 birim kare."]] },
    { b: "Dik açılı üçgeni dik açı kutusuna sürükle.", ip: "Dik açı, kâğıdın köşesi gibi 90°'dir.", hedefler: [["dik", "📐 Dik açı kutusu"]],
      parcalar: [["dik", ucgenMini("20,80 20,15 100,80") , "", "dik"], ["dar", ucgenMini("15,80 105,80 55,12"), "", null, "Bu üçgenin bütün açıları 90°'den küçük: dar açılı."], ["genis", ucgenMini("8,80 75,80 112,30"), "", null, "Bu üçgenin bir açısı 90°'den büyük: geniş açılı."]] },
    { b: "Bu şekillerden çokgen olanları sepete at.", ip: "Çokgen: doğru parçalarıyla çevrili kapalı şekil.", hedefler: [["sepet", "🧺 Çokgen sepeti"]],
      parcalar: [["kare", mini(`<rect class="g-yumusak g-cizgi" x="30" y="15" width="60" height="60" stroke-width="3"/>`), "", "sepet"], ["ucgen", ucgenMini("60,10 105,80 15,80"), "", "sepet"], ["altigen", mini(cokgenSvg(6).replace(/^<svg[^>]*>|<\/svg>$/g, "").replace("<polygon", '<polygon transform="translate(0 -5) scale(.5) translate(0 10)"')), "", "sepet"],
        ["daire", mini(`<circle class="g-yumusak g-cizgi" cx="60" cy="45" r="34" stroke-width="3"/>`), "", null, "Daire eğri bir çizgiyle çevrili; çokgen değildir."], ["acik", mini(`<polyline class="g-cizgi" points="15,75 40,15 70,70 105,20" fill="none" stroke-width="3"/>`), "", null, "Bu şekil kapalı değil; çokgen kapalı olmalıdır."], ["yarim", mini(`<path class="g-yumusak g-cizgi" d="M20 70 A40 40 0 0 1 100 70 Z" stroke-width="3"/>`), "", null, "Yarım dairenin eğri bir kenarı var; çokgen değildir."]] },
    { b: "Açıları türlerine göre kutulara yerleştir.", ip: "90°'den küçük: dar · tam 90°: dik · 90°'den büyük: geniş.", hedefler: [["dar", "Dar açı"], ["dik", "Dik açı"], ["genis", "Geniş açı"]],
      parcalar: [["a40", aciMini(40), "40°", "dar"], ["a90", aciMini(90), "90°", "dik"], ["a130", aciMini(130), "130°", "genis"], ["a70", aciMini(70), "70°", "dar"]] },
    { b: "Çevresi 12 birim olan dikdörtgeni çerçeveye koy.", ip: "Çevre = bütün kenarların toplamı: 2 × (uzun + kısa).", hedefler: [["cerceve", "🖼️ Çerçeve (çevre 12 birim)"]],
      parcalar: [["c24", izgaraParca(4, 2), "", "cerceve"], ["c25", izgaraParca(5, 2), "", null, "Çevresi 5 + 2 + 5 + 2 = 14 birim."], ["c34", izgaraParca(4, 3), "", null, "Çevresi 4 + 3 + 4 + 3 = 14 birim."], ["c14", izgaraParca(4, 1), "", null, "Çevresi 4 + 1 + 4 + 1 = 10 birim."]] },
    { b: "Alanı 6 birim kare olan üçgeni yerleştir.", ip: "Üçgenin alanı = (taban × yükseklik) ÷ 2. Izgaradaki kareleri kullan.", hedefler: [["u6", "🔺 Alanı 6 birim kare"]],
      parcalar: [["t43", ucgenIzgara(4, 3, 1), "", "u6"], ["t44", ucgenIzgara(4, 4, 2), "", null, "Taban 4, yükseklik 4: alan (4 × 4) ÷ 2 = 8 birim kare."], ["t32", ucgenIzgara(3, 2, 0), "", null, "Taban 3, yükseklik 2: alan (3 × 2) ÷ 2 = 3 birim kare."], ["t63", ucgenIzgara(6, 3, 3), "", null, "Taban 6, yükseklik 3: alan (6 × 3) ÷ 2 = 9 birim kare."]] },
    { b: "Üçgenleri kenarlarına göre doğru kutulara yerleştir.", ip: "Eşkenar: 3 kenar eşit · İkizkenar: 2 kenar eşit.", hedefler: [["eskenar", "Eşkenar üçgen"], ["ikiz", "İkizkenar üçgen"]],
      parcalar: [["k555", ucgenMini("60,12 102,80 18,80"), "5, 5, 5 cm", "eskenar"], ["k553", ucgenMini("60,8 85,82 35,82"), "5, 5, 3 cm", "ikiz"], ["k456", ucgenMini("15,80 105,80 40,25"), "4, 5, 6 cm", null, "Bu üçgenin üç kenarı da farklı: çeşitkenar. Buradaki kutulara uymuyor."]] },
  ];
  function atolyeOyunu() {
    D().son = "#/macera/oyun/atolye"; kaydetDurum();
    const O = aktifOyun = { id: "atolye", i: 0, yer: {}, hata: 0, gorevHata: 0, puan: 0, bas: Date.now(), secili: null, mesaj: null, bitti: false };
    const gorev = () => ATOLYE[O.i];
    const gerekli = () => gorev().parcalar.filter(p => p[3]);
    const tamamMi = () => gerekli().every(p => O.yer[p[0]]);
    O.yerlestir = (pid, hid) => {
      if (O.bitti || tamamMi()) return false;
      const p = gorev().parcalar.find(x => x[0] === pid); if (!p || O.yer[pid]) return false;
      O.secili = null;
      if (p[3] === hid) { O.yer[pid] = hid; O.mesaj = { iyi: true, m: sec(["Tam yerine oturdu!", "Harika yerleştirdin!", "Çok güzel!"]) }; if (tamamMi()) { O.puan += O.gorevHata ? 10 : 20; say("atolyeGorev"); O.mesaj = { iyi: true, m: "Görev tamam! " + sec(OVGU) }; } }
      else { O.hata++; O.gorevHata++; O.mesaj = { iyi: false, m: "Az kaldı! " + (p[4] || (p[3] ? "Bu şekil başka bir kutuya ait." : "")) + " " + gorev().ip }; }
      ciz(); return p[3] === hid;
    };
    O.sonraki = () => { if (!tamamMi()) return; O.i++; O.yer = {}; O.gorevHata = 0; O.mesaj = null; if (O.i >= ATOLYE.length) return bitir(); ciz(); };
    const parcaHTML = p => `<button class="mac-parca ${O.secili === p[0] ? "secili" : ""} ${O.yer[p[0]] ? "yerlesti" : ""}" data-parca-id="${p[0]}" ${O.yer[p[0]] ? 'aria-disabled="true"' : ""} aria-label="şekil ${p[2] || ""}">${p[1]}${p[2] ? `<small>${p[2]}</small>` : ""}</button>`;
    const ciz = () => {
      const g = gorev(), bekleyen = g.parcalar.filter(p => !O.yer[p[0]]);
      ana().innerHTML = `<div class="mac">${yolIz([["Mini Oyunlar", "#/macera/oyunlar"], ["Geometri Atölyesi"]])}<div class="mac-oyun">
        <section class="kart"><div class="mac-hedefler">${g.hedefler.map(([id, ad]) => `<div class="mac-hedef" data-hedef="${id}" role="button" tabindex="0"><b>${ad}</b><div class="ic">${g.parcalar.filter(p => O.yer[p[0]] === id).map(parcaHTML).join("")}</div></div>`).join("")}</div>
          <p class="kucuk-yazi muted" style="text-align:center">Şekli sürükle ya da önce şekle, sonra kutuya dokun.</p>
          <div class="mac-tepsi" aria-label="Şekil tepsisi">${bekleyen.map(parcaHTML).join("") || '<span class="muted">Tepsi boş</span>'}</div></section>
        <aside class="kart mac-panel"><div class="satir ara"><h2>📐 Görev ${O.i + 1}/${ATOLYE.length}</h2><span class="mac-sayaclar"><span>🪙 ${O.puan}</span></span></div>
          <div class="ilerleme">${ATOLYE.map((_, j) => `<i class="${j < O.i ? "d" : j === O.i && tamamMi() ? "d" : ""}"></i>`).join("")}</div>
          <p class="soru-metin">${g.b}</p>${O.mesaj ? `<div class="mac-mesaj ${O.mesaj.iyi ? "iyi" : "nazik"}">${kacis(O.mesaj.m)}</div>` : `<div class="mac-mesaj bilgi"><span><b>💡 İpucu:</b> ${kacis(g.ip)}</span></div>`}
          ${tamamMi() ? `<button class="btn ana" data-mac="sonraki">${O.i === ATOLYE.length - 1 ? "Atölyeyi bitir ▸" : "Sonraki görev ▸"}</button>` : ""}</aside></div></div>`;
      const sonraki = ana().querySelector('[data-mac="sonraki"]'); if (sonraki) sonraki.onclick = O.sonraki;
      ana().querySelectorAll(".mac-hedef").forEach(h => { const t = () => { if (O.secili) O.yerlestir(O.secili, h.dataset.hedef); }; h.onclick = t; h.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t(); } }; });
      ana().querySelectorAll(".mac-parca:not(.yerlesti)").forEach(el => { el.onpointerdown = e => surukleBasla(e, el); el.onclick = () => { if (O.tiklamaYok) { O.tiklamaYok = false; return; } O.secili = O.secili === el.dataset.parcaId ? null : el.dataset.parcaId; ciz(); }; });
    };
    /* Sürükle-bırak (pointer events: fare, kalem ve dokunmatik) */
    let s = null;
    const hedefAlti = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.closest ? el.closest(".mac-hedef") : null; };
    function surukleBasla(e, el) {
      if (O.bitti) return;
      s = { id: el.dataset.parcaId, x: e.clientX, y: e.clientY, el, hayalet: null, pid: e.pointerId };
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
    }
    dinle(window, "pointermove", e => {
      if (!s || e.pointerId !== s.pid) return;
      if (!s.hayalet) { if (Math.hypot(e.clientX - s.x, e.clientY - s.y) < 8) return; s.hayalet = s.el.cloneNode(true); s.hayalet.classList.add("mac-hayalet"); document.body.appendChild(s.hayalet); s.el.style.opacity = ".35"; }
      s.hayalet.style.left = e.clientX + "px"; s.hayalet.style.top = e.clientY + "px";
      document.querySelectorAll(".mac-hedef.ustunde").forEach(h => h.classList.remove("ustunde"));
      const h = hedefAlti(e.clientX, e.clientY); if (h) h.classList.add("ustunde");
      e.preventDefault();
    }, { passive: false });
    const birak = e => {
      if (!s || e.pointerId !== s.pid) return;
      const surukle = !!s.hayalet, id = s.id;
      if (s.hayalet) s.hayalet.remove(); s.el.style.opacity = "";
      s = null;
      if (!surukle) return;
      O.tiklamaYok = true; setTimeout(() => { O.tiklamaYok = false; }, 50);
      const h = e.type === "pointerup" ? hedefAlti(e.clientX, e.clientY) : null;
      if (h) O.yerlestir(id, h.dataset.hedef); else ciz();
    };
    dinle(window, "pointerup", birak); dinle(window, "pointercancel", birak);
    const bitir = () => {
      O.bitti = true;
      const y = O.hata <= 1 ? 3 : O.hata <= 4 ? 2 : 1, rekor = oyunBitti("atolye", O.puan, y, Date.now() - O.bas);
      O.sonuc = { puan: O.puan, yildiz: y };
      ana().innerHTML = `<div class="mac">${yolIz([["Mini Oyunlar", "#/macera/oyunlar"], ["Geometri Atölyesi"]])}${oyunSonuHTML("atolye", O.puan, y, rekor, `<p>${ATOLYE.length} görevin hepsini tamamladın! Usta bir mimarsın. 🏗️</p>`)}</div>`;
      bagla(); rozetKontrol();
    };
    ciz();
  }

  /* ============================ YÖNLENDİRME VE DIŞ ARAYÜZ ============================ */
  function ac(a, b, c) {
    kapat();
    stilEkle();
    document.body.classList.add("mac-genis");
    D();
    const sayfa = {
      harita, bolge: () => bolgeSayfasi(b, c), kesir: () => kesirSayfasi(b), oyunlar: oyunlarSayfasi,
      oyun: () => ({ robot: robotOyunu, hazine: hazineOyunu, atolye: atolyeOyunu }[b] || oyunlarSayfasi)(),
      gorevler: gorevlerSayfasi, basarilar: basarilarSayfasi, avatar: avatarSayfasi, ayarlar: avatarSayfasi,
    }[a];
    if (sayfa) sayfa(); else { menu(); rozetKontrol(); }
  }
  function durum() {
    const m = D(), bolgeler = {};
    [...BOLGELER, KESIR_BOLGE].forEach((b, i) => { const y = m.bolgeler[b.id] || {}; bolgeler[b.id] = { ogren: y.ogren || 0, uygula: y.uygula || 0, ustalas: y.ustalas || 0, toplam: bolgeYildiz(b.id), acik: b.id === "kesir" ? true : bolgeAcik(i) }; });
    return { yildiz: toplamYildiz(), rozetler: Object.keys(m.rozetler), bolgeler, robotSeviye: m.robotSeviye || 0, robotEnerji: m.robotEnerji || 0, sandik: sandikHakki(), rekorlar: Object.assign({}, m.rekorlar) };
  }
  /* Otomatik test: oyunu doğru hamlelerle baştan sona oynar. */
  function testOyna(id) {
    try {
      ac("oyun", id);
      const O = aktifOyun;
      if (!O) return { ok: false, neden: "oyun açılmadı" };
      if (id === "robot") {
        O.basla(1);
        for (let i = 0; i < 40 && O.asama !== "bitti"; i++) if (!otomatikCevapla()) break;
        return { ok: O.asama === "bitti", puan: O.puan, yildiz: O.sonuc && O.sonuc.yildiz };
      }
      if (id === "hazine") {
        for (let i = 0; i < 400 && !O.bitti; i++) {
          if (aktifMotor) { if (!otomatikCevapla()) return { ok: false, neden: "soru cevaplanamadı" }; continue; }
          let hedef = null, yol = null;
          if (O.anahtar < 3) {
            for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) if (O.h[r][c] === "D" && !O.acik.has(r + "-" + c)) { const y = O.yol([r, c]); if (y && (!yol || y.length < yol.length)) { yol = y; hedef = [r, c]; } }
          } else { for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) if (O.h[r][c] === "C") hedef = [r, c]; yol = O.yol(hedef); }
          if (!yol || !yol.length) return { ok: false, neden: "yol bulunamadı" };
          const [r, c] = yol[0], btn = document.querySelector(`[data-hz="${r}-${c}"]`);
          if (btn && !btn.disabled) btn.click(); else O.dokun(r, c);
        }
        return { ok: !!O.bitti, puan: O.puan, yildiz: O.sonuc && O.sonuc.yildiz };
      }
      if (id === "atolye") {
        for (let g = 0; g < ATOLYE.length && !O.bitti; g++) {
          ATOLYE[O.i].parcalar.filter(p => p[3]).forEach(p => O.yerlestir(p[0], p[3]));
          const b = document.querySelector('[data-mac="sonraki"]'); if (b) b.click(); else O.sonraki();
        }
        return { ok: !!O.bitti, puan: O.puan, yildiz: O.sonuc && O.sonuc.yildiz };
      }
      return { ok: false, neden: "bilinmeyen oyun: " + id };
    } catch (e) { return { ok: false, neden: e.message }; }
  }
  /* Otomatik test: Kesirler Macerası'nı (Öğren → Uygula → Ustalaş) doğru cevaplarla bitirir. */
  function testKesir() {
    try {
      ac("kesir", "ogren");
      const S_ = kesirOgrenDurum;
      for (let i = 0; i < KESIR_OGREN.length; i++) { S_.coz(); const b = document.querySelector('[data-mac="ileri"]'); if (!b) return { ok: false, neden: "ileri düğmesi yok" }; b.click(); }
      for (const asama of ["uygula", "ustalas"]) {
        ac("kesir", asama);
        let n = 0; while (aktifMotor && n < 40) { if (!otomatikCevapla()) return { ok: false, neden: asama + " sorusu cevaplanamadı" }; n++; }
        if (n !== (asama === "uygula" ? 6 : 8)) return { ok: false, neden: asama + " soru sayısı " + n };
      }
      const y = D().bolgeler.kesir || {};
      return { ok: y.ogren === 3 && y.uygula === 3 && y.ustalas === 3, yildiz: bolgeYildiz("kesir"), asamalar: y };
    } catch (e) { return { ok: false, neden: e.message }; }
  }

  window.MACERA = { ac, kapat, durum, testOyna, testKesir };
  /* Geliştirici/test erişimi (numaralandırılmaz) */
  Object.defineProperty(window.MACERA, "_ic", { value: { CEBIR, SEKIL, NICELIK, KESIR, BOLGELER, KESIR_BOLGE, HAZINE_HARITALAR, ATOLYE, OGREN, gecerli, guvenli, asamaPlani, otomatikCevapla, motor: () => aktifMotor, oyun: () => aktifOyun }, enumerable: false });
})();
