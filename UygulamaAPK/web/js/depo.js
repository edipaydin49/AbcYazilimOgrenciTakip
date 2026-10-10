/* Veri katmanı: çevrimdışı öncelikli olay günlüğü (IndexedDB), ayarlar, çalışma oturumu takibi ve bulut eşitleme.
 *
 * Her şey bir "olay" olarak kaydedilir: { id, tip, t (oluşma zamanı), s (son güncelleme), cihaz, ... }.
 * İnternet yokken olaylar cihazda birikir; bulut adresi tanımlıysa internet gelince gönderilmemiş
 * olaylar topluca yollanır. Aynı olay birden çok kez gelse bile id ve "s" alanıyla tekilleştirilir.
 */
(function () {
  "use strict";
  const DB_AD = "ogrenmeYolculugu", DB_SURUM = 1, AYAR_ANAHTAR = "ogr.ayar";
  // UZAK_MOD: veli paneli bilgisayardan açıldı (veli.html). Veri tabletten okunur, bu cihazda hiçbir şey kaydedilmez.
  const UZAK = window.UZAK_MOD === true;
  let db = null;
  const olaylar = new Map();

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const VARSAYILAN = { ogrenciAdi: "", pin: "1234", gunlukHedefDk: 30, bulutUrl: "", videolar: {}, gizliVideolar: {}, yazililar: {}, oyunHepsiAcik: false, cihaz: "", sonEsitleme: 0, kurulum: false };
  let ayar = { ...VARSAYILAN };
  try { ayar = { ...VARSAYILAN, ...JSON.parse(localStorage.getItem(AYAR_ANAHTAR) || "{}") }; } catch (e) {}
  if (!ayar.cihaz) ayar.cihaz = "c" + uid();

  function ayarKaydet() {
    if (UZAK) return;
    try { localStorage.setItem(AYAR_ANAHTAR, JSON.stringify(ayar)); } catch (e) {}
    if (db) try { db.transaction("ayar", "readwrite").objectStore("ayar").put({ k: "ayar", v: ayar }); } catch (e) {}
  }

  function ac() {
    return new Promise(coz => {
      if (!("indexedDB" in window)) return coz(null);
      const r = indexedDB.open(DB_AD, DB_SURUM);
      r.onupgradeneeded = () => {
        const d = r.result;
        if (!d.objectStoreNames.contains("olaylar")) d.createObjectStore("olaylar", { keyPath: "id" });
        if (!d.objectStoreNames.contains("ayar")) d.createObjectStore("ayar", { keyPath: "k" });
      };
      r.onsuccess = () => coz(r.result);
      r.onerror = () => coz(null);
    });
  }

  async function baslat() {
    if (UZAK) return;
    db = await ac();
    if (!db) return;
    await new Promise(coz => {
      const tx = db.transaction(["olaylar", "ayar"], "readonly");
      const st = tx.objectStore("olaylar");
      if (st.getAll) st.getAll().onsuccess = e => { for (const o of e.target.result) olaylar.set(o.id, o); };
      else st.openCursor().onsuccess = e => { const c = e.target.result; if (c) { olaylar.set(c.value.id, c.value); c.continue(); } };
      tx.objectStore("ayar").get("ayar").onsuccess = e => {
        // localStorage silinmişse ayarları IndexedDB yedeğinden geri yükle.
        const v = e.target.result && e.target.result.v;
        if (v && !ayar.kurulum && v.kurulum) ayar = { ...VARSAYILAN, ...v };
      };
      tx.oncomplete = coz; tx.onerror = coz;
    });
    onbellek = null;
    ayarKaydet();
  }

  /* Yazma kuyruğu: kayıtlar tek bir IndexedDB işleminde toplu yazılır (zayıf cihazlarda hızlı ve güvenli). */
  const kuyruk = new Map();
  let zamanlayici = null, bekleyenler = [];
  function bosalt() {
    zamanlayici = null;
    if (!db || !kuyruk.size) { const b = bekleyenler; bekleyenler = []; b.forEach(f => f()); return; }
    const parca = [...kuyruk.values()]; kuyruk.clear();
    const b = bekleyenler; bekleyenler = [];
    try {
      const tx = db.transaction("olaylar", "readwrite"), st = tx.objectStore("olaylar");
      parca.forEach(o => st.put(o));
      tx.oncomplete = () => b.forEach(f => f());
      tx.onerror = tx.onabort = () => { parca.forEach(o => kuyruk.set(o.id, o)); b.forEach(f => f()); planla(); };
    } catch (e) { parca.forEach(o => kuyruk.set(o.id, o)); b.forEach(f => f()); }
  }
  function planla() { if (!zamanlayici) zamanlayici = setTimeout(bosalt, 300); }
  let onbellek = null;  // tür → zamana göre sıralı liste (her yazmada geçersizleşir)
  let tableteDegisti = true;  // bilgisayardan izleme açıkken veriyi yeniden gönderme işareti
  function yaz(o) {
    tableteDegisti = true;
    olaylar.set(o.id, o);
    onbellek = null;
    kuyruk.set(o.id, o);
    planla();
  }
  const yazmaBitti = () => new Promise(c => { bekleyenler.push(c); clearTimeout(zamanlayici); bosalt(); });

  /* Yeni olay ekler; dönen nesne daha sonra guncelle() ile değiştirilebilir. */
  function kaydet(tip, veri) {
    const simdi = Date.now();
    const o = { id: uid(), tip, t: simdi, s: simdi, cihaz: ayar.cihaz, gonderildi: false, ...veri };
    yaz(o);
    return o;
  }
  function guncelle(o, degisim) {
    Object.assign(o, degisim, { s: Date.now(), gonderildi: false });
    yaz(o);
    return o;
  }
  function liste(tip) {
    if (!onbellek) {
      onbellek = { "": [...olaylar.values()].sort((a, b) => a.t - b.t) };
      for (const o of onbellek[""]) (onbellek[o.tip] = onbellek[o.tip] || []).push(o);
    }
    return (onbellek[tip || ""] || []).slice();
  }

  /* Dışarıdan gelen olayları birleştirir (aynı id'de en son güncellenen kazanır). */
  function iceAktar(gelen) {
    let n = 0;
    for (const o of gelen || []) {
      if (!o || !o.id || !o.tip) continue;
      const var_ = olaylar.get(o.id);
      if (!var_ || (o.s || o.t) > (var_.s || var_.t)) { yaz({ ...o, gonderildi: true }); n++; }
    }
    return n;
  }

  /* ---------------- Çalışma oturumu: aktif süre ve kesintiler ---------------- */
  let oturum = null, sonEtkilesim = Date.now(), gizlendi = null, bostaSayildi = false;
  function oturumBaslat() {
    oturum = kaydet("oturum", { bas: Date.now(), son: Date.now(), aktifSn: 0, kesinti: 0 });
  }
  function etkilesim() {
    if (UZAK) return;
    sonEtkilesim = Date.now(); bostaSayildi = false;
    if (!oturum) oturumBaslat();
  }
  ["pointerdown", "keydown", "touchstart", "scroll"].forEach(e => document.addEventListener(e, etkilesim, { passive: true }));
  document.addEventListener("visibilitychange", () => {
    if (UZAK) return;
    if (document.hidden) { gizlendi = Date.now(); if (oturum) guncelle(oturum, { son: Date.now() }); clearTimeout(zamanlayici); bosalt(); }
    else if (gizlendi) {
      const sure = Date.now() - gizlendi; gizlendi = null;
      if (sure > 30 * 60 * 1000) oturum = null;            // 30 dk'dan uzun ara → yeni oturum
      else if (sure > 30 * 1000 && oturum) guncelle(oturum, { kesinti: oturum.kesinti + 1 });
      etkilesim();
    }
  });
  const ADIM = 15;
  setInterval(() => {
    if (UZAK || !oturum || document.hidden) return;
    const bosta = Date.now() - sonEtkilesim;
    const videoOynuyor = window.VIDEO_OYNUYOR === true;
    if (bosta < 90 * 1000 || videoOynuyor) guncelle(oturum, { aktifSn: oturum.aktifSn + ADIM, son: Date.now() });
    else if (!bostaSayildi) { bostaSayildi = true; guncelle(oturum, { kesinti: oturum.kesinti + 1 }); }
  }, ADIM * 1000);

  /* ---------------- Bulut eşitleme (isteğe bağlı) ---------------- */
  let esitleniyor = false;
  async function gonder() {
    if (UZAK) return { ok: false, neden: "uzak görünüm" };
    if (!ayar.bulutUrl || esitleniyor || !navigator.onLine) return { ok: false, neden: ayar.bulutUrl ? "çevrimdışı" : "adres yok" };
    const bekleyen = [...olaylar.values()].filter(o => !o.gonderildi && o.cihaz === ayar.cihaz);
    if (!bekleyen.length) return { ok: true, n: 0 };
    esitleniyor = true;
    try {
      for (let i = 0; i < bekleyen.length; i += 300) {
        const parca = bekleyen.slice(i, i + 300).map(({ gonderildi, ...o }) => o);  // gönderim anındaki kopya
        const r = await fetch(ayar.bulutUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ ogrenci: ayar.ogrenciAdi, cihaz: ayar.cihaz, olaylar: parca }) });
        const j = await r.json();
        if (!j.ok) throw new Error("sunucu reddetti");
        // Gönderim sırasında güncellenen olaylar (ör. süren video) bir sonraki turda yeniden gönderilir.
        parca.forEach(k => { const o = olaylar.get(k.id); if (o && o.s === k.s) { o.gonderildi = true; yaz(o); } });
      }
      ayar.sonEsitleme = Date.now(); ayarKaydet();
      return { ok: true, n: bekleyen.length };
    } catch (e) {
      return { ok: false, neden: e.message };
    } finally { esitleniyor = false; }
  }
  async function cek() {
    if (!ayar.bulutUrl) return { ok: false, neden: "adres yok" };
    try {
      const r = await fetch(ayar.bulutUrl + (ayar.bulutUrl.includes("?") ? "&" : "?") + "islem=al");
      const j = await r.json();
      return { ok: true, n: iceAktar(j.olaylar) };
    } catch (e) { return { ok: false, neden: e.message }; }
  }
  if (!UZAK) window.addEventListener("online", () => gonder());
  window.addEventListener("pagehide", () => { clearTimeout(zamanlayici); bosalt(); });
  if (!UZAK) setInterval(() => gonder(), 2 * 60 * 1000);

  /* Bütün verinin dışa aktarımı (kopyala-yapıştır ile başka cihaza taşımak için). */
  function disaAktar() {
    const { pin, bulutUrl, ...a } = ayar;
    return JSON.stringify({ surum: 1, zaman: Date.now(), ogrenci: ayar.ogrenciAdi, ayar: a, olaylar: [...olaylar.values()].map(({ gonderildi, ...o }) => o) });
  }

  /* ---------------- Bilgisayardan izleme ---------------- */
  // Tablet: veriyi Android'deki küçük sunucuya verir (sunucu açıksa, değişiklik oldukça en geç 10 sn'de bir).
  function tabletVeri() {
    const { pin, bulutUrl, ...a } = ayar;
    return JSON.stringify({ surum: 1, zaman: Date.now(), ogrenci: ayar.ogrenciAdi, ayar: a, olaylar: [...olaylar.values()].map(({ gonderildi, ...o }) => o) });
  }
  function tabletePaylas(zorla) {
    if (UZAK || !(window.Android && Android.sunucuAdres && Android.veriGuncelle)) return;
    if (!zorla && !tableteDegisti) return;
    if (!Android.sunucuAdres()) return;
    tableteDegisti = false;
    try { Android.veriGuncelle(tabletVeri(), String(ayar.pin)); } catch (e) {}
  }
  if (!UZAK) setInterval(() => tabletePaylas(false), 10000);
  // Bilgisayar: tabletten gelen veriyi yalnızca bellekte tutar.
  let uzakZaman = 0;
  function uzakYukle(v) {
    olaylar.clear(); onbellek = null;
    for (const o of v.olaylar || []) if (o && o.id) olaylar.set(o.id, { ...o, gonderildi: true });
    ayar = { ...VARSAYILAN, ...(v.ayar || {}), ogrenciAdi: v.ogrenci || (v.ayar || {}).ogrenciAdi || "", kurulum: true };
    uzakZaman = v.zaman || Date.now();
    return olaylar.size;
  }

  window.DEPO = {
    baslat, kaydet, guncelle, liste, iceAktar, gonder, cek, disaAktar, ayarKaydet, uid, yazmaBitti, tabletePaylas, uzakYukle, uzak: UZAK, uzakZaman: () => uzakZaman,
    get ayar() { return ayar; }, set ayar(v) { ayar = v; ayarKaydet(); },
    bekleyenSayisi: () => [...olaylar.values()].filter(o => !o.gonderildi && o.cihaz === ayar.cihaz).length,
    sifirla: async () => { olaylar.clear(); kuyruk.clear(); onbellek = null; if (db) await new Promise(c => { const tx = db.transaction("olaylar", "readwrite"); tx.objectStore("olaylar").clear(); tx.oncomplete = c; }); },
  };
})();
