/* Öğrenci profilleri (oturumlar): aynı tablette birden çok öğrenci (ör. 6. sınıf ve 3. sınıf).
 *
 * - Her öğrencinin verisi ayrı tutulur: 1. öğrenci (eski sürümlerden gelen) eski veritabanı adını
 *   ("ogrenmeYolculugu") ve ayar anahtarını ("ogr.ayar") kullanır, böylece veri taşımaya gerek kalmaz;
 *   sonradan eklenen öğrenciler "ogrenmeYolculugu_<id>" / "ogr.ayar.<id>" kullanır.
 * - Açılışta birden çok öğrenci varsa “Kim çalışacak?” ekranı gösterilir (şifresiz). Seçim bu oturum
 *   boyunca hatırlanır (sessionStorage); öğrenci değiştirince sayfa yeniden yüklenir ve o öğrencinin
 *   sınıfına ait içerik dosyaları yüklenir.
 * - Veli paneli tek veli şifresiyle açılır; panelde öğrenci adına dokununca o öğrenciye geçilir
 *   (yeniden şifre sorulmaz, VELI_GECIS bayrağıyla).
 */
(function () {
  "use strict";
  const LISTE = "ogr.profiller", AKTIF = "ogr.aktifProfil", VELI_GECIS = "ogr.veliGecis", PIN = "ogr.veliPin";
  const UZAK = window.UZAK_MOD === true;
  const oku = (k, v) => { try { const x = localStorage.getItem(k); return x == null ? v : JSON.parse(x); } catch (e) { return v; } };
  const yaz = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const sOku = k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  const sYaz = (k, v) => { try { if (v == null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) {} };

  /* Sınıfa göre içerik dosyaları (sıra önemlidir: ders iskeleti → konular → videolar). */
  const ICERIK = {
    6: ["js/icerik.js", "js/mat_ek.js", "js/mat_ek2.js", "js/mat_tgs.js",
      "js/fen.js", "js/fen1.js", "js/fen2.js", "js/fen3.js", "js/fen_ek1.js", "js/fen_ek2.js", "js/fen_tgs.js",
      "js/tr.js", "js/tr1.js", "js/tr2.js", "js/tr3.js", "js/tr_ek1.js", "js/tr_ek2.js", "js/tr_tgs.js", "js/tr4.js",
      "js/en.js", "js/en1.js", "js/en2.js", "js/en3.js", "js/en4.js", "js/en_ek1.js", "js/en_ek2.js", "js/en_tgs.js",
      "js/sos.js", "js/sos1.js", "js/sos2.js", "js/din.js", "js/din1.js", "js/din2.js", "js/din3.js",
      "js/gorsel_mat.js", "js/gorsel_fen.js", "js/gorsel_tr.js", "js/gorsel_en.js", "js/gorsel_sos.js", "js/gorsel_din.js",
      "js/videolar.js"],
    3: ["js/s3/mat.js", "js/s3/mat1.js", "js/s3/mat2.js", "js/s3/tr.js", "js/s3/tr1.js", "js/s3/tr2.js",
      "js/s3/hb.js", "js/s3/hb1.js", "js/s3/fen.js", "js/s3/fen1.js", "js/s3/en.js", "js/s3/en1.js", "js/s3/videolar.js"],
  };
  const ORTAK_ONCE = ["js/ortak.js"];
  const ORTAK_SONRA = ["js/bilsem.js", "js/birlestir.js", "js/depo.js", "js/analiz.js", "js/oyun.js", "js/ingoyun.js", "js/uygulama.js",
    "js/pdfayristir.js", "js/pdfdeneme.js"];
  const SINIF_EK = { 6: ["tgs/liste.js", "js/tgsdeneme.js", "js/macera.js"], 3: ["js/macera.js"] };
  const AVATAR = ["🦊", "🐼", "🦁", "🐯", "🐨", "🐸", "🦄", "🐧", "🐬", "🦉"];

  /* Profil listesi; ilk açılışta eski kurulumu 1. öğrenci (6. sınıf) olarak tanır. */
  let liste = oku(LISTE, null);
  if (!Array.isArray(liste)) {
    const eski = oku("ogr.ayar", {});
    liste = eski && eski.kurulum ? [{ id: "p1", ad: eski.ogrenciAdi || "Öğrenci", sinif: 6, avatar: "🦊" }] : [];
    if (liste.length && !UZAK) yaz(LISTE, liste);
  }
  const kaydet = () => yaz(LISTE, liste);
  const bul = id => liste.find(p => p.id === id) || null;

  let aktif = null;
  if (UZAK) {
    // Bilgisayardaki veli sayfası: sınıf adres çubuğundan (?s=3) gelir; veri tabletten okunur.
    const s = +(new URLSearchParams(location.search).get("s")) || 6;
    aktif = { id: "uzak", ad: "", sinif: ICERIK[s] ? s : 6, avatar: "👪" };
  } else {
    aktif = bul(sOku(AKTIF)) || (liste.length === 1 ? liste[0] : null);
    if (aktif) sYaz(AKTIF, aktif.id);
  }

  const dbAd = p => (!p || p.id === "p1" ? "ogrenmeYolculugu" : "ogrenmeYolculugu_" + p.id);
  const ayarAnahtar = p => (!p || p.id === "p1" ? "ogr.ayar" : "ogr.ayar." + p.id);
  const kacis = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Yeni öğrenci: ayarları kurulum tamamlanmış olarak yazılır (uygulamanın kurulum ekranı atlanır). */
  function ekle({ ad, sinif, hedef }) {
    const id = liste.length ? "p" + Date.now().toString(36) : "p1";
    const p = { id, ad: String(ad).trim().slice(0, 30), sinif: +sinif === 3 ? 3 : 6, avatar: AVATAR[liste.length % AVATAR.length] };
    liste.push(p); kaydet();
    const a = oku(ayarAnahtar(p), {}) || {};
    yaz(ayarAnahtar(p), { ...a, ogrenciAdi: p.ad, gunlukHedefDk: Math.max(5, +hedef || 30), kurulum: true, pin: veliPin() });
    return p;
  }
  function guncelle(id, alan) { const p = bul(id); if (!p) return; Object.assign(p, alan); kaydet(); if (alan.ad) { const a = oku(ayarAnahtar(p), {}) || {}; a.ogrenciAdi = alan.ad; yaz(ayarAnahtar(p), a); } }
  async function sil(id) {
    const p = bul(id); if (!p || liste.length < 2) return false;
    liste = liste.filter(x => x.id !== id); kaydet();
    try { localStorage.removeItem(ayarAnahtar(p)); } catch (e) {}
    try { indexedDB.deleteDatabase(dbAd(p)); } catch (e) {}
    if (sOku(AKTIF) === id) sYaz(AKTIF, null);
    return true;
  }
  /* Tek veli şifresi: bütün öğrenciler için ortak (eski sürümde 1. öğrencinin ayarındaydı). */
  function veliPin() { const p = oku(PIN, null); if (p) return String(p); const a = oku("ogr.ayar", {}) || {}; return String(a.pin || "1234"); }
  function veliPinYaz(p) { yaz(PIN, String(p)); }

  /* Öğrenciye geç: veli panelinden geçişte şifre yeniden sorulmaz. */
  function gec(id, { veli = false, hash = null } = {}) {
    if (!bul(id)) return;
    sYaz(AKTIF, id);
    if (veli) sYaz(VELI_GECIS, String(Date.now()));
    location.hash = hash || (veli ? "#/veli/ozet" : "#/");
    location.reload();
  }
  function cikis() { sYaz(AKTIF, null); location.hash = "#/"; location.reload(); }
  function veliGecisi() { const t = +sOku(VELI_GECIS) || 0; sYaz(VELI_GECIS, null); return Date.now() - t < 60000; }

  /* Başka bir öğrencinin özetini (bugün / son 7 gün) kendi veritabanından okur — veli “Bütün öğrenciler” kartı. */
  function ozet(p) {
    return new Promise(coz => {
      const bos = { bugunDk: 0, haftaDk: 0, haftaSoru: 0, haftaDogru: 0, sonT: 0 };
      if (!("indexedDB" in window)) return coz(bos);
      let r; try { r = indexedDB.open(dbAd(p)); } catch (e) { return coz(bos); }
      r.onupgradeneeded = () => { try { r.transaction.abort(); } catch (e) {} };
      r.onerror = () => coz(bos);
      r.onsuccess = () => {
        const db = r.result;
        if (!db.objectStoreNames.contains("olaylar")) { db.close(); return coz(bos); }
        const st = db.transaction("olaylar", "readonly").objectStore("olaylar");
        const gun = 86400000, simdi = Date.now(), bugun = new Date(); bugun.setHours(0, 0, 0, 0);
        const o = { ...bos };
        st.openCursor().onsuccess = e => {
          const c = e.target.result;
          if (!c) { db.close(); return coz(o); }
          const v = c.value;
          if (v.t > o.sonT) o.sonT = v.t;
          if (v.tip === "oturum") { if (v.t >= simdi - 7 * gun) o.haftaDk += (v.aktifSn || 0) / 60; if (v.t >= +bugun) o.bugunDk += (v.aktifSn || 0) / 60; }
          if (v.tip === "soru" && !v.terk && !v.kontrol && v.t >= simdi - 7 * gun) { o.haftaSoru++; if (v.ilkDogru) o.haftaDogru++; }
          c.continue();
        };
      };
    });
  }

  /* ---------------- Açılış ekranları (uygulama yüklenmeden önce) ---------------- */
  function ekran(html) {
    const kur = () => { const a = document.getElementById("ana"); if (a) a.innerHTML = html; baglaEkran(); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kur); else kur();
  }
  function secimEkrani() {
    ekran(`<section class="kart vurgu profil-secim"><h1>Kim çalışacak?</h1><p class="muted">Adına dokun.</p>
      <div class="profil-kartlar">${liste.map(p => `<button class="profil-kart" data-profil="${p.id}"><span class="profil-avatar">${p.avatar || "🙂"}</span><b>${kacis(p.ad)}</b><span class="muted">${p.sinif}. sınıf</span></button>`).join("")}</div>
      <div class="satir" style="justify-content:center"><button class="btn" id="pVeli">👪 Veli paneli</button></div></section>`);
  }
  function kurulumEkrani() {
    ekran(`<section class="kart vurgu"><h1>Hoş geldin!</h1>
      <p>Bu uygulama derslerin konularını anlatır, sorular sorar, sınavlara hazırlar ve gelişimi kaydeder. İnternet olmadan da çalışır.</p>
      <label class="alan">Öğrencinin adı<input type="text" id="kAd" maxlength="30" placeholder="Örn. Elif"></label>
      <label class="alan">Sınıfı<select id="kSinif"><option value="6">6. sınıf</option><option value="3">3. sınıf (ilkokul)</option></select></label>
      <label class="alan">Günlük çalışma hedefi (dakika)<input type="number" id="kHedef" value="30" min="5" max="180"></label>
      <p class="kucuk-yazi muted">Veli paneli şifresi başlangıçta <b>1234</b>'tür. Veli panelinden değiştirebilir, başka öğrenci ekleyebilirsiniz.</p>
      <button class="btn ana" id="kTamam">Başla</button></section>`);
  }
  function baglaEkran() {
    document.querySelectorAll("[data-profil]").forEach(b => b.onclick = () => gec(b.dataset.profil));
    const v = document.getElementById("pVeli"); if (v) v.onclick = () => gec(liste[0].id, { hash: "#/veli" });
    const t = document.getElementById("kTamam");
    if (t) t.onclick = () => {
      const ad = document.getElementById("kAd").value.trim();
      if (!ad) { alert("Lütfen öğrencinin adını yazın."); return; }
      const p = ekle({ ad, sinif: document.getElementById("kSinif").value, hedef: document.getElementById("kHedef").value });
      gec(p.id);
    };
    document.querySelectorAll(".ust .ikon-btn").forEach(b => { b.hidden = true; });
  }

  /* Uygulama dosyalarını yazar (sayfa ayrıştırılırken, sıralı yüklensin diye document.write). */
  function yukle() {
    if (!aktif) { if (liste.length) secimEkrani(); else kurulumEkrani(); window.PROFIL_SECIM = true; return; }
    const s = aktif.sinif;
    document.documentElement.dataset.sinif = s;
    const dosyalar = [...ORTAK_ONCE, ...ICERIK[s], ...ORTAK_SONRA, ...(SINIF_EK[s] || [])];
    document.write(dosyalar.map(f => `<script src="${f}"><\/script>`).join(""));
  }

  window.PROFIL = {
    yukle, liste: () => liste.slice(), aktif: () => aktif, sinif: () => (aktif ? aktif.sinif : 6), bul, ekle, guncelle, sil, gec, cikis, ozet,
    dbAd: () => dbAd(aktif), ayarAnahtar: () => ayarAnahtar(aktif), veliPin, veliPinYaz, veliGecisi, ICERIK, AVATAR,
  };
})();
