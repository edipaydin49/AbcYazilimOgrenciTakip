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
