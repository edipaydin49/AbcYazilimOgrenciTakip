/* Arayüz: öğrenci ekranları (ders seçimi, konular, yazılılar), test motoru, video anlatım takibi ve veli/admin paneli. */
(function () {
  "use strict";
  const { DERSLER, DERS, TEMALAR, TEMA, KONULAR, KONU, KAZANIM, YAZILILAR, yaziliKapsam, yaziliTarih, soruUret, yardim } = ICERIK;
  const { karistir, sec } = yardim;
  const $ = s => document.querySelector(s);
  const ana = $("#ana");
  const kacis = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const kalin = s => kacis(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const yuzde = x => (x == null ? "—" : "%" + Math.round(x * 100));
  const sn = ms => (ms == null ? "—" : (ms / 1000 < 60 ? Math.round(ms / 1000) + " sn" : Math.floor(ms / 60000) + " dk " + Math.round((ms % 60000) / 1000) + " sn"));
  const dk = d => (d == null ? "—" : d < 1 ? Math.round(d * 60) + " sn" : Math.round(d) + " dk");
  const tarih = t => new Date(t).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const gunTarih = t => new Date(t).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
  const durumEtiket = x => x == null ? '<span class="etiket">veri yok</span>' : x >= 0.8 ? `<span class="etiket iyi">${yuzde(x)} güçlü</span>` : x >= 0.6 ? `<span class="etiket orta">${yuzde(x)} gelişiyor</span>` : `<span class="etiket kotu">${yuzde(x)} tekrar</span>`;
  function toast(m) { const t = document.createElement("div"); t.className = "toast"; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); }
  function git(h) { if (location.hash === h) yonlendir(); else location.hash = h; }
  const temaAd = id => TEMA[id] ? TEMA[id].ad : "";
  const dersAd = id => DERS[id] ? DERS[id].ad : "";

  let veliAcik = false;
  let durum = {}; // ekranlar arası geçici durum (aktif test, sonuç...)
  let aktifDers = "mat";
  try { aktifDers = DERS[localStorage.getItem("ogr.ders")] ? localStorage.getItem("ogr.ders") : "mat"; } catch (e) {}
  function dersSec(id) { if (!DERS[id]) return; aktifDers = id; try { localStorage.setItem("ogr.ders", id); } catch (e) {} }

  /* ============================ YÖNLENDİRME ============================ */
  function yonlendir() {
    if (window.VIDEO_KAPAT) { window.VIDEO_KAPAT(); window.VIDEO_KAPAT = null; }
    document.querySelectorAll(".perde").forEach(p => p.remove());
    window.scrollTo(0, 0);
    const [yol, a, b] = location.hash.replace(/^#\/?/, "").split("/");
    if (DEPO.uzak) return uzakYonlendir(yol, a, b);
    $("#ustAd").textContent = DEPO.ayar.ogrenciAdi ? "Öğrenme Yolculuğu · " + DEPO.ayar.ogrenciAdi : "Öğrenme Yolculuğu";
    ustDurum();
    if (!DEPO.ayar.kurulum) return kurulum();
    if (yol === "veli") return veliAcik ? veliPaneli(a || "ozet", b) : pinEkrani();
    veliAcik = false;
    if (yol === "ders") { dersSec(a); return anaSayfa(); }
    ({ "": anaSayfa, konu: () => konuSayfasi(a), anlatim: () => anlatim(a), video: () => videoSayfasi(a, +b || 0), test: testEkrani,
      sonuc: sonucEkrani, gelisim: gelisimSayfasi, hatalar: hataDefteri, yazili: () => yaziliSayfasi(a, b), deneme: denemeMerkezi, oyun: () => { dersSec("tr"); OYUN.ac(a, b); }, ing: () => { dersSec("en"); INGOYUN.ac(a, b); } }[yol] || anaSayfa)();
  }
  window.addEventListener("hashchange", yonlendir);
  $("#evBtn").addEventListener("click", () => git("#/"));
  $("#veliBtn").addEventListener("click", () => git("#/veli"));
  function ustDurum() {
    const b = DEPO.bekleyenSayisi();
    $("#ustDurum").textContent = DEPO.ayar.bulutUrl ? (navigator.onLine ? (b ? b + " kayıt gönderilecek" : "eşitlendi") : "çevrimdışı · " + b + " kayıt bekliyor") : "";
  }
  window.addEventListener("online", ustDurum); window.addEventListener("offline", ustDurum);
  setInterval(ustDurum, 30000);

  /* ============================ BİLGİSAYARDAN İZLEME (veli.html) ============================ */
  let uzakPin = null, uzakSaat = null, uzakHazir = false;
  function uzakYonlendir(yol, a, b) {
    document.body.classList.add("uzak");
    $("#evBtn").hidden = true;
    if (!$("#veliBtn").dataset.uzak) { const eski = $("#veliBtn"), yeni = eski.cloneNode(true); yeni.dataset.uzak = "1"; yeni.textContent = "Yenile"; eski.replaceWith(yeni); yeni.onclick = () => uzakYenile(true); }
    const zaman = DEPO.uzakZaman();
    $("#ustAd").textContent = "Veli paneli (bilgisayar)" + (DEPO.ayar.ogrenciAdi ? " · " + DEPO.ayar.ogrenciAdi : "");
    $("#ustDurum").textContent = uzakHazir ? "tabletten alındı: " + new Date(zaman).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    if (!uzakHazir) return uzakGiris();
    veliAcik = true;
    if (yol !== "veli" || a === "icerik" || a === "ayar") return git("#/veli/ozet");
    veliPaneli(a || "ozet", b);
  }
  async function uzakYenile(elle) {
    if (!uzakPin) return;
    try {
      const r = await fetch("/api/veri?pin=" + encodeURIComponent(uzakPin), { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) { if (elle) toast(j.hata || "Veri alınamadı."); if (r.status === 401) { uzakHazir = false; uzakPin = null; yonlendir(); } return; }
      if (j.zaman !== DEPO.uzakZaman() || elle) { DEPO.uzakYukle(j); yonlendir(); }
      if (elle) toast("Güncellendi.");
    } catch (e) { if (elle) toast("Tablete ulaşılamadı. Tablette uygulama açık ve “İzleme” açık olmalı."); }
  }
  function uzakGiris() {
    const canli = /^https?:$/.test(location.protocol);
    ana.innerHTML = `<section class="kart vurgu" style="max-width:560px;margin:0 auto;width:100%"><h1>Veli paneli · bilgisayar</h1>
      ${canli ? `<p>Tabletteki <b>Öğrenme Yolculuğu</b> uygulamasının veli şifresini girin.</p>
        <label class="alan">Veli şifresi<input type="password" id="uPin" inputmode="numeric" autocomplete="off" placeholder="••••"></label>
        <button class="btn ana" id="uBaglan">Bağlan</button><p class="kucuk-yazi muted" id="uDurum"></p>` : ""}
      <details ${canli ? "" : "open"}><summary><b>${canli ? "Ya da" : "Tablete bağlı değilsiniz:"} veri metnini yapıştırın</b></summary>
        <p class="kucuk-yazi">Tablette: Veli paneli › Ayarlar › “Tüm verileri kopyala” ya da “Tüm verileri paylaş”. Metni buraya yapıştırın.</p>
        <textarea id="uMetin" placeholder='{"surum":1,...}'></textarea><button class="btn" id="uYapistir">Verileri göster</button></details></section>`;
    const b = $("#uBaglan");
    if (b) {
      const dene = async () => {
        uzakPin = $("#uPin").value.trim(); $("#uDurum").textContent = "Bağlanılıyor…";
        try {
          const r = await fetch("/api/veri?pin=" + encodeURIComponent(uzakPin), { cache: "no-store" });
          const j = await r.json();
          if (!r.ok) { $("#uDurum").textContent = j.hata || "Bağlanılamadı."; uzakPin = null; return; }
          DEPO.uzakYukle(j); uzakHazir = true;
          clearInterval(uzakSaat); uzakSaat = setInterval(() => uzakYenile(false), 15000);
          git("#/veli/ozet");
        } catch (e) { $("#uDurum").textContent = "Tablete ulaşılamadı. Tablette uygulamanın açık olduğundan emin olun."; uzakPin = null; }
      };
      b.onclick = dene; $("#uPin").onkeydown = e => { if (e.key === "Enter") dene(); }; $("#uPin").focus();
    }
    $("#uYapistir").onclick = () => {
      try { const j = JSON.parse($("#uMetin").value); if (!Array.isArray(j.olaylar)) throw 0; DEPO.uzakYukle(j); uzakHazir = true; git("#/veli/ozet"); }
      catch (e) { toast("Metin okunamadı. Tamamını yapıştırdığınızdan emin olun."); }
    };
  }

  /* ============================ KURULUM ============================ */
  function kurulum() {
    ana.innerHTML = `<section class="kart vurgu"><h1>Hoş geldin!</h1>
      <p>Bu uygulama 6. sınıf Matematik, Fen Bilimleri, Türkçe ve İngilizce konularını anlatır, sorular sorar, yazılılara hazırlar ve gelişimini kaydeder. İnternet olmadan da çalışır.</p>
      <label class="alan">Öğrencinin adı<input type="text" id="kAd" maxlength="30" placeholder="Örn. Elif"></label>
      <label class="alan">Günlük çalışma hedefi (dakika)<input type="number" id="kHedef" value="30" min="5" max="180"></label>
      <p class="kucuk-yazi muted">Veli paneli şifresi başlangıçta <b>1234</b>'tür. Veli panelinden değiştirebilirsiniz.</p>
      <button class="btn ana" id="kTamam">Başla</button></section>`;
    $("#kTamam").onclick = () => {
      const ad = $("#kAd").value.trim();
      if (!ad) { toast("Lütfen öğrencinin adını yazın."); return; }
      const a = DEPO.ayar; a.ogrenciAdi = ad; a.gunlukHedefDk = Math.max(5, +$("#kHedef").value || 30); a.kurulum = true; DEPO.ayarKaydet();
      git("#/");
    };
  }

  /* ============================ ÖĞRENCİ: ANA SAYFA ============================ */
  function bugunDk() { const g = ANALIZ.bugunNo(); return DEPO.liste("oturum").filter(o => ANALIZ.gunNo(o.t) === g).reduce((a, o) => a + o.aktifSn, 0) / 60; }
  function oneriButonu(o) {
    if (o.tur === "tekrar") return `<button class="btn ana" data-test="tekrar${o.gun}" data-konu="${o.konu}">Tekrar testini başlat</button>`;
    if (o.tur === "anlatim") return `<a class="btn ana" href="#/konu/${o.konu}">Konuya git</a>`;
    if (o.tur === "deneme") return `<button class="btn ana" data-test="deneme" data-ders="${o.ders || aktifDers}">Genel deneme</button>`;
    return `<button class="btn ana" data-test="${o.tur}" data-konu="${o.konu}">Başla</button>`;
  }
  function dersSecici(secili, hedef = "ders") {
    return `<nav class="ders-sec" aria-label="Ders seçimi">${DERSLER.map(d => `<a class="sekme ${d.id === secili ? "aktif" : ""}" href="#/${hedef}/${d.id}">${d.simge} ${d.ad}</a>`).join("")}</nav>`;
  }
  /* Yazılı için hazırlık oranı: kapsamdaki konuların ustalık ortalaması (hiç çalışılmayan konu 0 sayılır). */
  function yaziliHazirlik(h, dersId, yid) {
    const l = yaziliKapsam(dersId, yid);
    if (!l.length) return null;
    return l.reduce((a, k) => a + (ortUstalik(h, k) || 0), 0) / l.length;
  }
  function yaziliKart(h, dersId, y) {
    const t = yaziliTarih(dersId, y.id), hz = yaziliHazirlik(h, dersId, y.id);
    const kalan = t ? Math.ceil((new Date(t + "T09:00") - Date.now()) / ANALIZ.GUN) : null;
    return `<button class="konu-satir" data-git="#/yazili/${dersId}/${y.id}"><span><b>${y.ad}</b><br><span class="kucuk-yazi muted">${yaziliKapsam(dersId, y.id).length} konu${t ? " · " + gunTarih(t + "T09:00") + (kalan >= 0 ? ` · ${kalan} gün kaldı` : " · geçti") : ""}</span></span>
      <span><span class="kucuk-yazi muted">${hz == null ? "—" : "hazırlık " + yuzde(hz)}</span><span class="bar" style="display:block"><i style="width:${(hz || 0) * 100}%"></i></span></span></button>`;
  }
  function anaSayfa() {
    const d = DERS[aktifDers];
    const h = ANALIZ.hesapla({ ders: d.id });
    const hedef = DEPO.ayar.gunlukHedefDk, bugun = bugunDk();
    const o = ANALIZ.oneri(h, d.id);
    const vadesi = ANALIZ.tekrarPlani(d.id).filter(p => p.vadesi).filter((p, i, a) => a.findIndex(x => x.konu === p.konu) === i);
    const hataSay = hataListesi(d.id).length;
    const tekil = d.id === "fen" ? "Ünite" : "Tema";
    ana.innerHTML = `
      <section class="kart vurgu">
        <div class="satir ara"><h1>Merhaba ${kacis(DEPO.ayar.ogrenciAdi)}!</h1><span class="etiket">${new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}</span></div>
        <div><div class="satir ara kucuk-yazi"><span>Bugünkü hedef: ${hedef} dakika (bütün dersler)</span><span class="sayac">${Math.round(bugun)} / ${hedef} dk</span></div>
        <div class="bar" style="margin-top:6px"><i style="width:${Math.min(100, 100 * bugun / hedef)}%;${bugun >= hedef ? "background:var(--good)" : ""}"></i></div></div>
        ${dersSecici(d.id)}
        <div class="kart sari" style="padding:12px"><span class="kucuk-yazi muted">${d.ad} · sıradaki adım</span><p><b>${kacis(o.metin)}</b></p><div>${oneriButonu(o)}</div></div>
      </section>
      ${d.id === "tr" && window.OYUN ? (() => { const p = OYUN.ozet(); return `<section class="kart sari oyun-giris"><span class="simge">🎮</span><div style="display:grid;gap:8px"><h2>Türkçe Diyarı</h2>
        <p>Üç adanın kaybolan yıldızlarını topla! <b>⭐ ${p.yildiz}/${p.toplam}</b> yıldız · <b>🪙 ${p.puan}</b> puan · <b>🏅 ${p.rozet}/3</b> rozet</p><div><a class="btn ana" href="#/oyun">Oyuna gir</a></div></div></section>`; })() : ""}
      ${d.id === "en" && window.INGOYUN ? `<section class="kart sari oyun-giris"><span class="simge">🎮</span><div style="display:grid;gap:8px"><h2>English Games</h2>
        <p>${Object.values(INGOYUN.OYUNLAR).map(o => o.simge + " " + o.ad).join(" · ")}</p><div><a class="btn ana" href="#/ing">Oyunlara gir</a></div></div></section>` : ""}
      ${vadesi.length ? `<section class="kart"><h2>Tekrar zamanı</h2><p class="muted kucuk-yazi">Öğrendiklerini unutmamak için kısa tekrar testleri.</p>
        ${vadesi.map(p => `<div class="satir ara"><span>${KONU[p.konu].ad} · <b>${p.gun}. gün</b> tekrarı</span><button class="btn kucuk" data-test="tekrar${p.gun}" data-konu="${p.konu}">Başla</button></div>`).join("")}</section>` : ""}
      <section class="kart"><h2>Yazılılara hazırlık · ${d.ad}</h2><p class="muted kucuk-yazi">Her yazılı için konu tekrarı, videolar, eksik kapatma ve yazılı provası.</p>
        <div class="izgara">${YAZILILAR.map(y => yaziliKart(h, d.id, y)).join("")}</div></section>
      ${d.temaListesi.map(t => `<section class="kart">
        <div class="satir ara"><div><span class="etiket">${t.kisa}</span><h2 style="margin-top:4px">${t.ad}</h2></div></div>
        <div class="satir"><button class="btn kucuk" data-test="hazir" data-tema="${t.id}">Hazır mıyız?</button>
          <button class="btn kucuk" data-test="izleme" data-tema="${t.id}">${d.id === "tr" ? "Bu Tema Başka Tema!" : "İzleme testi"}</button>
          <button class="btn kucuk" data-test="tema" data-tema="${t.id}">${d.id === "tr" ? "Haydi, Bitirelim!" : tekil + " değerlendirme"}</button>
          ${d.id === "tr" && window.OYUN ? `<a class="btn kucuk" href="#/oyun/ada/${t.id}">🎮 ${t.ada.ad}</a>` : ""}</div>
        <div style="display:grid;gap:8px">${t.konular.map(k => { const ks = h.konuOzet[k]; const u = ortUstalik(h, k);
          return `<button class="konu-satir" data-git="#/konu/${k}"><span><b>${KONU[k].ad}</b><br><span class="kucuk-yazi muted">${ks.konuSonu ? "Konu sonu: " + yuzde(ks.konuSonu.son) : ks.n ? ks.n + " soru çözüldü" : "Başlanmadı"}</span></span>
            <span><span class="kucuk-yazi muted">${u == null ? "—" : yuzde(u)}</span><span class="bar" style="display:block"><i style="width:${u == null ? 0 : u * 100}%"></i></span></span></button>`; }).join("")}</div>
      </section>`).join("")}
      <section class="izgara dar">
        <button class="btn ana" data-test="deneme" data-ders="${d.id}">${d.ad} genel deneme (20 soru)</button>
        <a class="btn ana" href="#/deneme">📝 Deneme merkezi</a>
        <a class="btn" href="#/hatalar">Hata defterim (${hataSay})</a>
        <a class="btn" href="#/gelisim">Gelişimim</a>
      </section>`;
    baglaOrtak();
  }
  function ortUstalik(h, konuId) {
    const k = KONU[konuId].kazanimlar.map(z => h.kazanim[z.id]).filter(x => x && x.ustalik != null);
    return k.length ? k.reduce((a, x) => a + x.ustalik, 0) / k.length : null;
  }
  function baglaOrtak() {
    ana.querySelectorAll("[data-git]").forEach(b => b.onclick = () => git(b.dataset.git));
    ana.querySelectorAll("[data-test]").forEach(b => b.onclick = () => testBaslat(b.dataset.test, { konu: b.dataset.konu, tema: b.dataset.tema, ders: b.dataset.ders, yazili: b.dataset.yazili, kendiIstegi: b.dataset.kendi === "1" }));
  }

  /* ============================ YAZILI HAZIRLIK SAYFASI ============================ */
  function yaziliSayfasi(dersId, yid) {
    const d = DERS[dersId], y = YAZILILAR.find(x => x.id === yid);
    if (!d || !y) return anaSayfa();
    dersSec(dersId);
    const h = ANALIZ.hesapla({ ders: dersId });
    const kapsam = yaziliKapsam(dersId, yid), t = yaziliTarih(dersId, yid), hz = yaziliHazirlik(h, dersId, yid);
    const provalar = DEPO.liste("test").filter(x => x.tur === "yazili" && x.ders === dersId && x.yazili === yid).slice(-5).reverse();
    const zayif = kapsam.flatMap(k => KONU[k].kazanimlar.map(z => [z, h.kazanim[z.id]])).filter(([, x]) => x && x.ustalik != null && x.ustalik < 0.6);
    ana.innerHTML = `<section class="kart vurgu"><p class="yol-iz"><a href="#/ders/${dersId}">${d.ad}</a> › Yazılılar</p>
        <h1>${d.ad} · ${y.ad}</h1>
        <p class="muted">${t ? "Sınav tarihi: <b>" + gunTarih(t + "T09:00") + "</b>" : "Sınav tarihini veli panelinden girebilirsiniz."} · ${kapsam.length} konu</p>
        <div><div class="satir ara kucuk-yazi"><span>Hazırlık durumu</span><span class="sayac">${hz == null ? "—" : yuzde(hz)}</span></div><div class="bar" style="margin-top:6px"><i style="width:${(hz || 0) * 100}%"></i></div></div>
        <div class="izgara dar">
          <button class="btn ana" data-test="yaziliTekrar" data-ders="${dersId}" data-yazili="${yid}">1. Konu tekrar testi (12)</button>
          <button class="btn" data-test="yaziliEksik" data-ders="${dersId}" data-yazili="${yid}" ${zayif.length ? "" : "disabled"}>2. Eksiklerimi kapat (10)${zayif.length ? "" : " · eksik yok"}</button>
          <button class="btn" data-test="yazili" data-ders="${dersId}" data-yazili="${yid}">3. Yazılı provası (20 soru · 40 dk)</button>
        </div></section>
      <section class="kart"><h2>Yazılı konuları</h2><p class="muted kucuk-yazi">Her konunun anlatımına, videolarına ve alıştırmasına buradan ulaşabilirsin.</p>
        ${kapsam.map(k => { const u = ortUstalik(h, k); const vl = konuVideolari(k);
          return `<div class="kart" style="padding:12px;gap:8px"><div class="satir ara"><span><span class="etiket">${TEMA[KONU[k].tema].kisa}</span> <b>${KONU[k].ad}</b></span>${durumEtiket(u)}</div>
            <div class="bar"><i style="width:${(u || 0) * 100}%"></i></div>
            <div class="satir"><a class="btn kucuk" href="#/anlatim/${k}">Konu anlatımı</a>${vl.length ? `<a class="btn kucuk" href="#/video/${k}/0">Video (${vl.length})</a>` : ""}<button class="btn kucuk" data-test="alistirma" data-konu="${k}">Alıştırma</button><a class="btn kucuk" href="#/konu/${k}">Konu sayfası</a></div></div>`; }).join("") || '<p class="muted">Bu yazılı için konu seçilmemiş. Veli panelinden konuları seçebilirsiniz.</p>'}</section>
      ${zayif.length ? `<section class="kart"><h2>Eksik görünen kazanımlar</h2>${zayif.map(([z, x]) => `<div class="satir ara"><span>${z.ad}</span>${durumEtiket(x.ustalik)}</div>`).join("")}</section>` : ""}
      ${provalar.length ? `<section class="kart"><h2>Önceki yazılı provaların</h2>${provalar.map(p => `<div class="satir ara"><span>${tarih(p.t)}</span><span>${p.dogru} / ${p.n} · ${sn(p.sure)}</span>${durumEtiket(p.n ? p.dogru / p.n : null)}</div>`).join("")}</section>` : ""}`;
    baglaOrtak();
  }

  /* ============================ KONU SAYFASI ============================ */
  /* Konunun videoları: velinin eklediği video (bölümlü) en başta, sonra gizlenmemiş hazır videolar. */
  function konuVideolari(konuId) {
    const l = [];
    const v = DEPO.ayar.videolar[konuId];
    if (v && v.vid) l.push({ vid: v.vid, baslik: v.baslik || "Velinin eklediği video", kaynak: "Veli", bolumler: v.bolumler || [] });
    const gizli = DEPO.ayar.gizliVideolar || {};
    (window.HAZIR_VIDEOLAR && HAZIR_VIDEOLAR[konuId] || []).forEach(x => { if (!gizli[x.vid] && !l.some(y => y.vid === x.vid)) l.push({ ...x, bolumler: [] }); });
    return l;
  }
  function izlenenOran(vid) {
    try { const s = JSON.parse(localStorage.getItem("izlenen:" + vid) || "[]").length; const t = +localStorage.getItem("sure:" + vid) || 0; return t ? Math.min(1, s / t) : s ? null : 0; } catch (e) { return null; }
  }
  function konuSayfasi(id) {
    const k = KONU[id]; if (!k) return anaSayfa();
    dersSec(k.ders);
    const h = ANALIZ.hesapla({ konu: id });
    const ks = h.konuOzet[id];
    const vl = konuVideolari(id);
    ana.innerHTML = `
      <section class="kart vurgu"><p class="yol-iz"><a href="#/ders/${k.ders}">${dersAd(k.ders)}</a> › ${TEMA[k.tema].kisa} · ${temaAd(k.tema)}</p><h1>${k.ad}</h1>
        ${k.onKosul ? `<p class="kucuk-yazi muted">Bu konu şunlarla bağlantılı: ${k.onKosul.map(x => KONU[x].ad).join(", ")}</p>` : ""}
        <div class="izgara dar">
          <a class="btn ${ks.anlatim ? "" : "ana"}" href="#/anlatim/${id}">1. Konu anlatımı${ks.anlatim && ks.anlatim.bitti ? " ✓" : ""}</a>
          ${vl.length ? `<a class="btn" href="#/video/${id}/0">Video anlatım${ks.video ? " · " + yuzde(ks.video.tamamlama) : ""}</a>` : ""}
          <button class="btn ${ks.anlatim && !ks.n ? "ana" : ""}" data-test="alistirma" data-konu="${id}">2. Alıştırma (10)</button>
          <button class="btn" data-test="konuSonu" data-konu="${id}">3. Konu sonu testi (12)</button>
          <button class="btn" data-test="kendi" data-konu="${id}" data-kendi="1">Kendi tekrarım (6)</button>
          ${k.sozluk && window.INGOYUN ? `<a class="btn" href="#/ing/kart/${id}">🃏 Word cards (${k.sozluk.length})</a>` : ""}
          ${k.ders === "en" && window.INGOYUN ? Object.entries(INGOYUN.OYUNLAR).filter(([, o]) => o.konu === id).map(([oid, o]) => `<a class="btn" href="#/ing/${oid}">${o.simge} ${o.ad}</a>`).join("") : ""}
          ${k.oyun && window.OYUN ? `<a class="btn" href="#/oyun/gorev/${id}">🎮 Oyun görevi${(o => o ? " · " + "★".repeat(o.enIyi) : "")(OYUN.konuOzet(id))}</a>` : ""}
        </div>${k.gorev ? `<p class="kucuk-yazi muted">Kitap ${k.sayfa} · ${k.gorev}</p>` : ""}</section>
      ${vl.length ? `<section class="kart"><h2>Konu anlatım videoları</h2><p class="muted kucuk-yazi">Videolar uygulamanın içinde oynar. İzlemek için internet gerekir.</p>
        <div style="display:grid;gap:8px">${vl.map((v, i) => { const o = izlenenOran(v.vid);
          return `<button class="video-satir" data-git="#/video/${id}/${i}"><img src="https://i.ytimg.com/vi/${v.vid}/mqdefault.jpg" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
            <span><b>${kacis(v.baslik)}</b><br><span class="kucuk-yazi muted">${v.kaynak ? kacis(v.kaynak) + " · " : ""}${v.not ? kacis(v.not) + " · " : ""}${o ? "izlendi " + yuzde(o) : "izlenmedi"}</span></span></button>`; }).join("")}</div></section>` : ""}
      <section class="kart"><h2>Kazanımlarım</h2>
        ${k.kazanimlar.map(z => { const x = h.kazanim[z.id]; return `<div style="display:grid;gap:4px"><div class="satir ara"><span>${z.ad}</span>${durumEtiket(x.ustalik)}</div>
          <div class="bar"><i style="width:${(x.ustalik || 0) * 100}%"></i></div><span class="kucuk-yazi muted">${x.cevaplanan} soru · güven: ${x.guven.ad}</span></div>`; }).join("")}
      </section>`;
    baglaOrtak();
  }

  /* ============================ METİN ANLATIM (akıllı konu durakları) ============================ */
  function anlatim(id) {
    const k = KONU[id]; if (!k) return anaSayfa();
    const kayit = DEPO.kaydet("anlatim", { konu: id, ders: k.ders, okunan: 0, toplam: k.anlatim.length, bitti: false });
    let i = 0, cevap = null, bas = Date.now(), sira = null;
    function ciz() {
      const s = k.anlatim[i];
      if (!sira) sira = karistir([0, 1, 2, 3]);
      const d = s.durak;
      ana.innerHTML = `<section class="kart vurgu">
        <div class="satir ara"><span class="etiket">${k.ad} · ${i + 1} / ${k.anlatim.length}</span><a class="btn kucuk" href="#/konu/${id}">Konuya dön</a></div>
        <div class="ilerleme">${k.anlatim.map((_, j) => `<i class="${j < i ? "d" : j === i ? "s" : ""}"></i>`).join("")}</div>
        <h1>${s.baslik}</h1><p style="font-size:1.1rem">${s.metin}</p>
        ${s.gorsel ? `<div class="gorsel">${s.gorsel}</div>` : ""}
        <div class="geri bilgi"><b>Örnek</b><p>${s.ornek}</p></div></section>
        <section class="kart"><span class="etiket">Konu durağı · anladın mı?</span><p class="soru-metin">${d.soru}</p>
        <div class="secenekler">${sira.map((o, j) => { const [m, dogru] = d.secenekler[o]; let c = "sec"; if (cevap !== null && dogru) c += " dogru"; if (cevap === o && !dogru) c += " yanlis";
          return `<button class="${c}" data-o="${o}" ${cevap !== null ? "disabled" : ""}><b>${"ABCD"[j]}</b><span>${m}</span></button>`; }).join("")}</div>
        ${cevap !== null ? `<div class="geri ${d.secenekler[cevap][1] ? "iyi" : "kotu"}"><b>${d.secenekler[cevap][1] ? "Doğru!" : "Bu doğru değil."}</b><p>${d.secenekler[cevap][2]}</p>
          ${d.secenekler[cevap][1] ? "" : `<p><b>Doğru cevap:</b> ${d.secenekler.find(x => x[1])[2]}</p>`}</div>
          <div class="satir">${i > 0 ? `<button class="btn" id="geriB">← Önceki</button>` : ""}<button class="btn ana" id="ileriB">${i < k.anlatim.length - 1 ? "Sonraki bölüm →" : "Anlatımı bitir → Alıştırma"}</button></div>` : ""}
        </section>`;
      ana.querySelectorAll("[data-o]").forEach(b => b.onclick = () => {
        cevap = +b.dataset.o;
        DEPO.kaydet("durak", { konu: id, ders: k.ders, kaynak: "metin", bolum: i, dogru: !!d.secenekler[cevap][1], sure: Date.now() - bas });
        DEPO.guncelle(kayit, { okunan: Math.max(kayit.okunan, i + 1) });
        ciz();
      });
      const ileri = $("#ileriB"), geri = $("#geriB");
      if (geri) geri.onclick = () => { i--; cevap = null; sira = null; bas = Date.now(); ciz(); };
      if (ileri) ileri.onclick = () => {
        if (i < k.anlatim.length - 1) { i++; cevap = null; sira = null; bas = Date.now(); ciz(); window.scrollTo(0, 0); }
        else { DEPO.guncelle(kayit, { bitti: true, okunan: k.anlatim.length }); testBaslat("alistirma", { konu: id }); }
      };
    }
    ciz();
  }

  /* ============================ VİDEO ANLATIM (YouTube, uygulama içinde) ============================ */
  function ytKimlik(url) {
    const m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(url || "") ? url : null);
  }
  let ytHazir = null;
  function ytYukle() {
    if (ytHazir) return ytHazir;
    ytHazir = new Promise((coz, red) => {
      if (window.YT && window.YT.Player) return coz();
      window.onYouTubeIframeAPIReady = () => coz();
      const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; s.onerror = () => { ytHazir = null; red(new Error("yüklenemedi")); };
      document.head.appendChild(s);
      setTimeout(() => { if (!(window.YT && window.YT.Player)) { ytHazir = null; red(new Error("zaman aşımı")); } }, 15000);
    });
    return ytHazir;
  }
  const saniye = t => { const p = String(t).split(":").map(Number); return p.length === 2 ? p[0] * 60 + p[1] : p[0] || 0; };
  const zaman = s => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

  function videoSayfasi(id, vi) {
    const k = KONU[id], liste = k ? konuVideolari(id) : [];
    if (!k || !liste.length) return konuSayfasi(id);
    vi = Math.min(Math.max(0, vi), liste.length - 1);
    const v = liste[vi];
    // Bölüm tanımlı değilse süre öğrenilince video yaklaşık 4 dakikalık bölümlere ayrılır (en çok 5 bölüm).
    let bolumler = (v.bolumler && v.bolumler.length ? v.bolumler : [{ baslik: "Anlatım", bas: "0:00", durak: "oto" }]).map(b => ({ ...b, sn: saniye(b.bas) })).sort((a, b) => a.sn - b.sn);
    const otoBol = !(v.bolumler && v.bolumler.length);
    ana.innerHTML = `<section class="kart vurgu"><div class="satir ara"><h1>${k.ad} · video</h1><a class="btn kucuk" href="#/konu/${id}">Konuya dön</a></div>
      <p class="kucuk-yazi muted">${kacis(v.baslik)}${v.kaynak ? " · " + kacis(v.kaynak) : ""}</p>
      <div class="video-kutu"><div id="oynatici"></div></div><p id="vDurum" class="kucuk-yazi muted">Video yükleniyor…</p>
      ${liste.length > 1 ? `<div class="satir">${vi > 0 ? `<a class="btn kucuk" href="#/video/${id}/${vi - 1}">← Önceki video</a>` : ""}${vi < liste.length - 1 ? `<a class="btn kucuk" href="#/video/${id}/${vi + 1}">Başka bir anlatım dene →</a>` : ""}<span class="kucuk-yazi muted">${vi + 1} / ${liste.length}</span></div>` : ""}</section>
      <section class="kart"><h2>Bölümler</h2><div id="bolumListe" style="display:grid;gap:8px"></div></section>`;
    const listeCiz = () => {
      $("#bolumListe").innerHTML = bolumler.map((b, i) => `<button class="konu-satir" data-b="${i}"><span><b>${i + 1}. ${kacis(b.baslik)}</b><br><span class="kucuk-yazi muted">${zaman(b.sn)}${b.durak && b.durak !== "yok" ? " · bölüm sonunda soru" : ""}</span></span><span class="kucuk-yazi muted" id="bd${i}"></span></button>`).join("");
      ana.querySelectorAll("[data-b]").forEach(btn => btn.onclick = () => { if (!oyn || !oyn.seekTo) return; const i = +btn.dataset.b; oyn.seekTo(bolumler[i].sn, true); oyn.playVideo(); window.scrollTo(0, 0); });
    };
    let oyn = null;
    listeCiz();
    if (!navigator.onLine) { $("#vDurum").innerHTML = "Video için internet bağlantısı gerekiyor. <a href='#/anlatim/" + id + "'>Metin anlatıma geç</a>."; return; }

    // Benzersiz izlenen saniyeler bu cihazda video bazında birikir (tamamlama oranı için).
    const izAnahtar = "izlenen:" + v.vid;
    let izlenen = new Set(); try { izlenen = new Set(JSON.parse(localStorage.getItem(izAnahtar) || "[]")); } catch (e) {}
    const kayit = DEPO.kaydet("video", { konu: id, ders: k.ders, vid: v.vid, toplam: 0, izlenen: izlenen.size, oynatilan: 0, geriSarma: 0, ileriSarma: 0, duraklatma: 0, bolumAcma: {}, bitti: false });
    let onceki = null, aktifBolum = -1, durakta = false, sistemDuraklatti = false, zamanlayici = null, kaydetSayac = 0;
    const cevaplananDurak = new Set();
    const kaydetVideo = () => { try { localStorage.setItem(izAnahtar, JSON.stringify([...izlenen])); } catch (e) {} DEPO.guncelle(kayit, { izlenen: izlenen.size }); };
    window.VIDEO_KAPAT = () => { clearInterval(zamanlayici); window.VIDEO_OYNUYOR = false; kaydetVideo(); try { oyn && oyn.destroy(); } catch (e) {} };

    function bolumBul(t) { let b = 0; bolumler.forEach((x, i) => { if (t >= x.sn) b = i; }); return b; }
    function tik() {
      if (!oyn || !oyn.getCurrentTime) return;
      const t = oyn.getCurrentTime(), st = oyn.getPlayerState();
      if (st !== 1) { onceki = t; return; }
      window.VIDEO_OYNUYOR = true;
      kayit.oynatilan += 1;
      izlenen.add(Math.floor(t));
      if (onceki != null) { const fark = t - onceki; if (fark < -2) kayit.geriSarma++; else if (fark > 3) kayit.ileriSarma++; }
      const b = bolumBul(t);
      if (b !== aktifBolum) {
        // Bir bölüm bitti: bölüm sonu sorusu (akıllı konu durağı)
        if (aktifBolum >= 0 && b === aktifBolum + 1 && !cevaplananDurak.has(aktifBolum) && bolumler[aktifBolum].durak !== "yok") return durakSor(aktifBolum);
        aktifBolum = b; kayit.bolumAcma[b] = (kayit.bolumAcma[b] || 0) + 1; bolumGoster();
      }
      onceki = t;
      if (++kaydetSayac % 5 === 0) kaydetVideo(); else DEPO.guncelle(kayit, {});
    }
    function bolumGoster() { bolumler.forEach((_, i) => { const e = $("#bd" + i); if (e) e.textContent = (i === aktifBolum ? "oynuyor · " : "") + (kayit.bolumAcma[i] ? kayit.bolumAcma[i] + " kez açıldı" : ""); }); }
    function durakSor(bi) {
      durakta = true; sistemDuraklatti = true; oyn.pauseVideo();
      const b = bolumler[bi];
      let q;
      if (b.durak === "ozel" && b.soru) q = { soru: kacis(b.soru), secenekler: b.secenekler.map((m, j) => ({ m, dogru: j === +b.dogruIndeks, neden: "" })), cozum: [] };
      else { const kz = k.kazanimlar[bi % k.kazanimlar.length].id; q = soruUret(kz, 1); }
      const sira = karistir(q.secenekler.map((_, j) => j));
      const perde = document.createElement("div"); perde.className = "perde";
      perde.innerHTML = `<div class="kart"><span class="etiket">Bölüm ${bi + 1} bitti · kısa soru</span><p class="soru-metin">${q.soru}</p>${q.gorsel ? `<div class="gorsel">${q.gorsel}</div>` : ""}
        <div class="secenekler">${sira.map((o, j) => `<button class="sec" data-o="${o}"><b>${"ABCD"[j]}</b><span>${kacis(q.secenekler[o].m)}</span></button>`).join("")}</div><div id="dSonuc"></div></div>`;
      document.body.appendChild(perde);
      const bas = Date.now();
      perde.querySelectorAll("[data-o]").forEach(btn => btn.onclick = () => {
        const s = q.secenekler[+btn.dataset.o];
        perde.querySelectorAll("[data-o]").forEach(x => { x.disabled = true; const o = q.secenekler[+x.dataset.o]; if (o.dogru) x.classList.add("dogru"); else if (x === btn) x.classList.add("yanlis"); });
        DEPO.kaydet("durak", { konu: id, ders: k.ders, kaynak: "video", bolum: bi, dogru: !!s.dogru, sure: Date.now() - bas });
        cevaplananDurak.add(bi);
        perde.querySelector("#dSonuc").innerHTML = `<div class="geri ${s.dogru ? "iyi" : "kotu"}"><b>${s.dogru ? "Doğru!" : "Bu doğru değil."}</b>${s.neden ? `<p>${kacis(s.neden)}</p>` : ""}</div>
          <div class="satir" style="margin-top:10px">${s.dogru ? "" : `<button class="btn" id="dTekrar">Bu bölümü tekrar izle</button>`}<button class="btn ana" id="dDevam">Devam et</button></div>`;
        perde.querySelector("#dDevam").onclick = () => {
          perde.remove(); durakta = false;
          if (bi + 1 < bolumler.length) { aktifBolum = bi + 1; kayit.bolumAcma[bi + 1] = (kayit.bolumAcma[bi + 1] || 0) + 1; bolumGoster(); oyn.playVideo(); }
          DEPO.guncelle(kayit, {});
        };
        const tk = perde.querySelector("#dTekrar");
        if (tk) tk.onclick = () => { perde.remove(); durakta = false; cevaplananDurak.delete(bi); aktifBolum = bi; kayit.bolumAcma[bi] = (kayit.bolumAcma[bi] || 0) + 1; bolumGoster(); oyn.seekTo(bolumler[bi].sn, true); oyn.playVideo(); };
      });
    }
    function sureOgrenildi(sure) {
      if (!sure) return;
      DEPO.guncelle(kayit, { toplam: Math.round(sure) });
      try { localStorage.setItem("sure:" + v.vid, String(Math.round(sure))); } catch (e) {}
      if (otoBol && bolumler.length === 1 && sure > 6 * 60) {
        const n = Math.min(5, Math.round(sure / 240)), adim = sure / n;
        bolumler = Array.from({ length: n }, (_, i) => ({ baslik: `${i + 1}. kısım`, bas: zaman(i * adim), sn: Math.round(i * adim), durak: "oto" }));
        listeCiz(); bolumGoster();
      }
    }

    ytYukle().then(() => {
      oyn = new YT.Player("oynatici", {
        videoId: v.vid, host: "https://www.youtube-nocookie.com",
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1, origin: location.origin, fs: 1 },
        events: {
          onReady: () => { sureOgrenildi(oyn.getDuration()); $("#vDurum").textContent = "Videoyu başlatmak için oynat düğmesine dokun. Her bölümün sonunda kısa bir soru gelecek."; zamanlayici = setInterval(tik, 1000); },
          onStateChange: e => {
            if (e.data === 2) { if (!sistemDuraklatti && !durakta) DEPO.guncelle(kayit, { duraklatma: kayit.duraklatma + 1 }); sistemDuraklatti = false; window.VIDEO_OYNUYOR = false; }
            if (e.data === 0) { window.VIDEO_OYNUYOR = false; const son = bolumler.length - 1; if (!cevaplananDurak.has(son) && bolumler[son].durak !== "yok") durakSor(son); DEPO.guncelle(kayit, { bitti: true }); kaydetVideo(); }
            if (e.data === 1) { if (!kayit.toplam) sureOgrenildi(oyn.getDuration()); }
          },
          onError: e => { $("#vDurum").innerHTML = `Bu video uygulama içinde oynatılamıyor (hata ${e.data}). Video kaldırılmış ya da sahibi gömülü oynatmayı kapatmış olabilir. ${vi < liste.length - 1 ? `<a href="#/video/${id}/${vi + 1}">Sıradaki videoyu dene</a> ya da ` : ""}<a href="#/anlatim/${id}">metin anlatıma geç</a>.`; },
        },
      });
    }).catch(() => { $("#vDurum").innerHTML = "YouTube oynatıcısı yüklenemedi. İnternet bağlantınızı kontrol edin. <a href='#/anlatim/" + id + "'>Metin anlatıma geç</a>."; });
  }

  /* ============================ TEST MOTORU ============================ */
  const TEST_AD = { alistirma: "Alıştırma", konuSonu: "Konu sonu testi", kendi: "Kendi tekrarım", hazir: "Hazır mıyız?", izleme: "İzleme testi", tema: "Tema / ünite değerlendirme", deneme: "Genel deneme sınavı", hata: "Hata defteri tekrarı",
    yazili: "Yazılı provası", yaziliTekrar: "Yazılı konu tekrarı", yaziliEksik: "Yazılı: eksik kapatma", oyun: "Türkçe Diyarı oyunu", mini: "Mini deneme", karma: "Karma deneme (4 ders)",
    tekrar1: "1. gün tekrar testi", tekrar3: "3. gün tekrar testi", tekrar7: "7. gün tekrar testi", tekrar30: "30. gün kalıcılık testi" };
  const KENDI_HATA = [["bilgi", "Konuyu bilmiyordum"], ["kavrama", "Soruyu yanlış anladım"], ["islem", "İşlem hatası yaptım"], ["dikkat", "Dikkatsizlik yaptım"], ["strateji", "Acele ettim / yol bulamadım"]];

  function kazanimSec(liste, h) {
    // Zayıf kazanımlara daha fazla ağırlık ver (uyarlanabilir seçim)
    const agirlik = liste.map(id => { const x = h.kazanim[id]; return x && x.ustalik != null ? 1.4 - x.ustalik : 1.2; });
    let r = Math.random() * agirlik.reduce((a, b) => a + b, 0);
    for (let i = 0; i < liste.length; i++) { r -= agirlik[i]; if (r <= 0) return liste[i]; }
    return liste[liste.length - 1];
  }
  function temaKazanimlari(tema) { return KONULAR.filter(k => k.tema === tema).flatMap(k => k.kazanimlar.map(z => z.id)); }
  function dersKazanimlari(ders) { return KONULAR.filter(k => k.ders === ders).flatMap(k => k.kazanimlar.map(z => z.id)); }
  const konularKazanim = l => l.flatMap(k => KONU[k].kazanimlar.map(z => z.id));
  /* Listeyi karıştırıp n elemana tamamlar (liste kısaysa döngüyle). */
  const dagit = (l, n) => { const k = karistir(l); return Array.from({ length: n }, (_, i) => k[i % k.length]); };

  function testBaslat(tur, { konu, tema, ders, yazili, kendiIstegi } = {}) {
    let plan = [];   // { kaz, zorluk } ya da { hazir: soru }
    ders = ders || (konu ? KONU[konu].ders : tema ? TEMA[tema].ders : aktifDers);
    const konuKaz = konu ? KONU[konu].kazanimlar.map(z => z.id) : [];
    if (tur === "alistirma") plan = Array.from({ length: 10 }, () => ({ kaz: null, uyarla: true }));
    else if (tur === "konuSonu") { const z = [1, 2, 3, 2, 1, 3, 2, 2, 3, 1, 2, 3]; plan = z.map((zz, i) => ({ kaz: konuKaz[i % konuKaz.length], zorluk: zz })); }
    else if (tur === "kendi" || tur.startsWith("tekrar")) plan = Array.from({ length: 6 }, (_, i) => ({ kaz: konuKaz[i % konuKaz.length], zorluk: i < 2 ? 1 : 2 }));
    else if (tur === "hazir") plan = karistir(temaKazanimlari(tema)).slice(0, 6).map(k => ({ kaz: k, zorluk: 1 }));
    else if (tur === "izleme") plan = dagit(temaKazanimlari(tema), 8).map(k => ({ kaz: k, zorluk: 2 }));
    else if (tur === "tema") plan = dagit(temaKazanimlari(tema), 15).map((k, i) => ({ kaz: k, zorluk: i % 3 === 0 ? 3 : 2 }));
    else if (tur === "deneme") plan = dagit(dersKazanimlari(ders), 20).map((k, i) => ({ kaz: k, zorluk: [1, 2, 2, 3][i % 4] }));
    else if (tur === "mini") plan = dagit(dersKazanimlari(ders), 10).map((k, i) => ({ kaz: k, zorluk: [1, 2, 2, 3, 2][i % 5] }));
    else if (tur === "karma") { ders = "karma"; plan = DERSLER.flatMap(d => dagit(dersKazanimlari(d.id), 10).map((k, i) => ({ kaz: k, zorluk: [1, 2, 2, 3, 2][i % 5] }))); }
    else if (tur === "yazili") plan = dagit(konularKazanim(yaziliKapsam(ders, yazili)), 20).map((k, i) => ({ kaz: k, zorluk: [1, 2, 2, 3][i % 4] }));
    else if (tur === "yaziliTekrar") plan = dagit(konularKazanim(yaziliKapsam(ders, yazili)), 12).map((k, i) => ({ kaz: k, zorluk: [1, 2, 2][i % 3] }));
    else if (tur === "yaziliEksik") {
      const h = ANALIZ.hesapla({ ders });
      const l = konularKazanim(yaziliKapsam(ders, yazili)).filter(k => h.kazanim[k] && h.kazanim[k].ustalik != null && h.kazanim[k].ustalik < 0.6);
      plan = dagit(l, 10).map(k => ({ kaz: k, uyarla: true, zorluk: null }));
    }
    else if (tur === "hata") { plan = karistir(hataListesi(null)).slice(0, 10).map(o => ({ hazir: o.soruNesnesi, ref: o.id })); DEPO.kaydet("hataDefteri", {}); }
    if (!plan.length || plan.some(p => !p.hazir && p.kaz === undefined)) { toast("Bu test için soru bulunamadı."); return; }
    const sinav = ["deneme", "yazili", "mini", "karma"].includes(tur);
    durum.test = {
      tur, ders, yazili: yazili || null, konu: konu || null, tema: tema || (konu ? KONU[konu].tema : null), kendiIstegi: !!kendiIstegi || tur === "kendi",
      sinav, testId: DEPO.uid(), plan, i: 0, sonuclar: [], bas: Date.now(), seri: 0, zorlukKaydir: 0,
      sure: { deneme: 30, yazili: 40, mini: 15, karma: 60 }[tur] ? { deneme: 30, yazili: 40, mini: 15, karma: 60 }[tur] * 60 * 1000 : null, konuKaz,
    };
    durum.test.soru = soruHazirla(durum.test, 0);
    git("#/test");
  }

  function soruHazirla(t, i) {
    const p = t.plan[i];
    let q;
    if (p.hazir) q = JSON.parse(JSON.stringify(p.hazir));
    else if (p.kontrolIcin) q = soruUret(p.kontrolIcin, p.zorluk);
    else {
      let kaz = p.kaz;
      if (!kaz) kaz = kazanimSec(t.konuKaz, ANALIZ.hesapla({ konu: t.konu }));
      let z = p.zorluk || ANALIZ.onerilenZorluk(kaz);
      if (p.uyarla) z = Math.max(1, Math.min(3, z + t.zorlukKaydir));
      q = soruUret(kaz, z);
    }
    return { q, ref: p.ref || null, kontrol: !!p.kontrolIcin, bas: Date.now(), ilkSure: null, deneme: 0, ilkSecim: null, sonSecim: null, ipucu: false, cozum: false, kendiHata: null, bitti: false, sinavSecim: null };
  }

  function soruKaydet(t, s, terk) {
    const ilk = s.ilkSecim != null ? s.q.secenekler[s.ilkSecim] : null;
    const son = s.sonSecim != null ? s.q.secenekler[s.sonSecim] : null;
    const kayit = {
      ders: s.q.ders || (KONU[s.q.konu] || {}).ders, konu: s.q.konu, tema: s.q.tema, kaz: s.q.kaz, duzey: s.q.duzey, zorluk: s.q.zorluk, mod: t.tur, testId: t.testId,
      ilkDogru: !!(ilk && ilk.dogru), sonDogru: !!(son && son.dogru), deneme: s.deneme, ilkSure: s.ilkSure, toplamSure: Date.now() - s.bas,
      ipucu: s.ipucu, cozumGoruldu: s.cozum, terk: !!terk, ilkHata: ilk && !ilk.dogru ? ilk.hata : null, kendiHata: s.kendiHata, kontrol: s.kontrol, ref: s.ref,
      soruNesnesi: s.q,
    };
    s.kayit = DEPO.kaydet("soru", kayit);
    t.sonuclar.push(kayit);
    // Uyarlanabilir zorluk: art arda 2 yanlış → daha temel, 3 doğru → daha ileri
    if (kayit.ilkDogru) { t.seri = t.seri > 0 ? t.seri + 1 : 1; if (t.seri >= 3) { t.zorlukKaydir = Math.min(1, t.zorlukKaydir + 1); t.seri = 0; } }
    else { t.seri = t.seri < 0 ? t.seri - 1 : -1; if (t.seri <= -2) { t.zorlukKaydir = Math.max(-1, t.zorlukKaydir - 1); t.seri = 0; } }
  }

  /* Adım adım çözüm kutusu (test ekranı, sınav sonucu ve hata defteri ortak kullanır). */
  /* Adım adım çözüm: adımlar tek tek açılır (“Sonraki adım”), sonunda doğru cevap ve bütün seçeneklerin
   * tek tek incelemesi gösterilir. Eski sorularda ipucu “soruyu anlayalım” adımına, doğru cevap “sonuç” adımına dönüşür. */
  function cozumAdimlari(q) {
    const d = q.secenekler.findIndex(x => x.dogru), l = [];
    if (q.ipucu && !/^🔎/.test(q.cozum[0] || "")) l.push("🔎 Önce soruyu anlayalım: " + q.ipucu);
    q.cozum.forEach(c => l.push(c));
    if (!q.cozum.some(c => /^✅/.test(c))) l.push(`✅ Sonuç: doğru cevap **${"ABCD"[d]}) ${q.secenekler[d].m}**` + (q.secenekler[d].neden ? ` — ${q.secenekler[d].neden}` : ""));
    return l;
  }
  function cozumKutusu(q, { baslik = "Adım adım çözüm", secilen = null, acik = false } = {}) {
    const d = q.secenekler.findIndex(x => x.dogru), l = cozumAdimlari(q);
    return `<div class="geri bilgi cozum" data-cozum><div class="satir ara"><b>${baslik}</b><span class="kucuk-yazi muted" data-adim-sayac>${acik ? l.length : 1} / ${l.length} adım</span></div>
      <ol class="adimlar">${l.map((a, i) => `<li ${i > 0 && !acik ? "hidden" : ""}><span>${kalin(a)}</span></li>`).join("")}</ol>
      <div class="satir" data-adim-dugme ${acik || l.length < 2 ? "hidden" : ""}><button class="btn ana kucuk" data-adim-ileri>Sonraki adım ▸</button><button class="btn kucuk" data-adim-hepsi>Hepsini göster</button></div>
      <div data-cozum-son ${acik || l.length < 2 ? "" : "hidden"} style="display:grid;gap:8px">
        <p><b>Doğru cevap:</b> ${"ABCD"[d]}) ${kacis(q.secenekler[d].m)}</p>
        <details ${secilen != null && !q.secenekler[secilen].dogru ? "open" : ""}><summary><b>Seçenekleri tek tek inceleyelim</b></summary>
          <ul class="secenek-analiz">${q.secenekler.map((s, j) => `<li class="${s.dogru ? "iyi" : "kotu"}${j === secilen ? " secilen" : ""}"><b>${"ABCD"[j]}) ${kacis(s.m)}</b> ${s.dogru ? "✓ doğru cevap" : "✗ bu seçenek cevap değil"}${j === secilen ? " · senin seçimin" : ""}<br><span>${kacis(s.dogru ? (s.neden || "Bu seçenek sorunun istediğini tam olarak karşılıyor.") : (s.neden || ""))}</span></li>`).join("")}</ul></details>
        ${q.kural ? `<div class="unutma"><b>Unutma:</b> ${kacis(q.kural)}</div>` : ""}</div></div>`;
  }
  // Adım düğmeleri (bütün ekranlar için tek dinleyici)
  document.addEventListener("click", e => {
    const ileri = e.target.closest("[data-adim-ileri]"), hepsi = e.target.closest("[data-adim-hepsi]");
    if (!ileri && !hepsi) return;
    const k = e.target.closest("[data-cozum]"), li = [...k.querySelectorAll(".adimlar li")];
    if (hepsi) li.forEach(x => { x.hidden = false; });
    else { const s = li.find(x => x.hidden); if (s) { s.hidden = false; s.classList.add("yeni-adim"); } }
    const acik = li.filter(x => !x.hidden).length;
    k.querySelector("[data-adim-sayac]").textContent = acik + " / " + li.length + " adım";
    if (acik === li.length) { k.querySelector("[data-adim-dugme]").hidden = true; k.querySelector("[data-cozum-son]").hidden = false; }
  });

  let sinavSaat = null;
  function testEkrani() {
    const t = durum.test; if (!t) return anaSayfa();
    clearInterval(sinavSaat);
    const s = t.soru, q = s.q;
    const toplam = t.plan.length;
    const dogruIdx = q.secenekler.findIndex(x => x.dogru);
    const ogrenme = !t.sinav;
    const ilerleme = t.plan.map((_, j) => { const r = t.sonuclar[j]; return `<i class="${j === t.i ? "s" : r ? (t.sinav ? "s" : r.ilkDogru ? "d" : "y") : ""}"></i>`; }).join("");
    let secHtml = q.secenekler.map((o, j) => {
      let c = "sec", kapali = s.bitti || (ogrenme && s.deneme > 0 && (s.cozum || s.deneme >= 2));
      if (t.sinav) { if (s.sinavSecim === j) c += " secili"; kapali = false; }
      else {
        if (s.bitti && j === dogruIdx) c += " dogru";
        if (j === s.ilkSecim && !o.dogru) c += " yanlis";
        if (j === s.sonSecim && !o.dogru) c += " yanlis";
        if (!s.bitti && s.deneme === 1 && j === s.ilkSecim) kapali = true;
      }
      return `<button class="${c}" data-s="${j}" ${kapali || (!t.sinav && j === s.ilkSecim && s.deneme === 1) ? "disabled" : ""}><b>${"ABCD"[j]}</b><span>${kacis(o.m)}</span></button>`;
    }).join("");
    let geri = "";
    if (ogrenme && s.deneme >= 1) {
      const ilk = q.secenekler[s.ilkSecim];
      const sonDogru = s.bitti && s.sonSecim != null && q.secenekler[s.sonSecim].dogru;
      if (sonDogru) {
        geri = `<div class="geri iyi"><b>${s.deneme === 1 ? sec(["Harika, doğru!", "Tam isabet!", "Çok iyi!"]) : "Düzelttin, aferin!"}</b>${q.secenekler[dogruIdx].neden ? `<p>${kacis(q.secenekler[dogruIdx].neden)}</p>` : ""}
          ${!s.cozum && q.cozum.length ? `<details><summary>Çözümü yine de görmek ister misin?</summary>${cozumKutusu(q, { baslik: "Çözüm" })}</details>` : ""}</div>`;
      } else {
        geri = `<div class="geri kotu"><b>Bu cevap doğru değil.</b>${ilk && ilk.neden ? `<p>${kacis(ilk.neden)}</p>` : ""}</div>`;
        if (!s.bitti) geri += `<div class="kart" style="padding:12px"><span class="kucuk-yazi"><b>Sence neden yanlış yaptın?</b> (isteğe bağlı)</span>
          <div class="cips">${KENDI_HATA.map(([k, a]) => `<button class="cip ${s.kendiHata === k ? "secili" : ""}" data-kh="${k}">${a}</button>`).join("")}</div>
          <div class="satir"><button class="btn ana" id="tekrarDene">Tekrar dene</button><button class="btn" id="cozumGor">Çözümü gör</button></div></div>`;
      }
      if (s.cozum || (s.bitti && !sonDogru)) geri += cozumKutusu(q, { secilen: s.sonSecim });
    }
    const kalan = t.sure ? t.sure - (Date.now() - t.bas) : null;
    const baslikEk = t.konu ? " · " + KONU[t.konu].ad : t.yazili ? " · " + dersAd(t.ders) + " · " + YAZILILAR.find(x => x.id === t.yazili).ad : t.tema ? " · " + TEMA[t.tema].kisa : t.tur === "deneme" || t.tur === "mini" ? " · " + dersAd(t.ders) : "";
    ana.innerHTML = `<section class="kart vurgu">
      <div class="satir ara"><span class="etiket">${TEST_AD[t.tur]}${baslikEk}</span>
        <span class="sayac">${t.sinav ? `<span id="kalanSure">${sn(kalan)}</span> · ` : ""}${t.i + 1} / ${toplam}</span></div>
      <div class="ilerleme">${ilerleme}</div>
      ${s.kontrol ? `<span class="etiket orta">Çözümünü gördüğün soruya benzer yeni bir soru</span>` : ""}
      <p class="soru-metin">${q.soru}${q.ders === "en" && window.INGOYUN ? " " + INGOYUN.sesBtn(q.soru, 1) : ""}</p>
      ${q.gorsel ? `<div class="gorsel">${q.gorsel}</div>` : ""}
      ${s.ipucu && !t.sinav ? `<div class="geri bilgi"><b>İpucu:</b> ${kacis(q.ipucu)}</div>` : ""}
      <div class="secenekler">${secHtml}</div>
      ${geri}
      <div class="satir ara">
        <span class="satir">${ogrenme && !s.bitti && !s.ipucu && s.deneme === 0 ? `<button class="btn kucuk" id="ipucuB">İpucu al</button>` : ""}
        ${ogrenme && !s.bitti && s.deneme === 0 ? `<button class="btn kucuk" id="gecB">Bu soruyu geç</button>` : ""}
        ${ogrenme && s.bitti && s.cozum && !s.kontrol && !s.benzerEklendi ? `<button class="btn kucuk" id="benzerB">Benzer bir soru çöz</button>` : ""}</span>
        ${t.sinav ? `<span class="satir">${t.i > 0 ? `<button class="btn" id="oncekiB">← Önceki</button>` : ""}<button class="btn ana" id="sonrakiB">${t.i < toplam - 1 ? "Sonraki →" : "Sınavı bitir"}</button></span>`
          : s.bitti ? `<button class="btn ana" id="devamB">${t.i < toplam - 1 ? "Devam →" : "Sonuçları gör"}</button>` : ""}
      </div></section>`;

    ana.querySelectorAll("[data-s]").forEach(b => b.onclick = () => secimYap(+b.dataset.s));
    if (window.INGOYUN) INGOYUN.sesBagla(ana);
    ana.querySelectorAll("[data-kh]").forEach(b => b.onclick = () => { s.kendiHata = b.dataset.kh; testEkrani(); });
    const on = (id, f) => { const e = $(id); if (e) e.onclick = f; };
    on("#ipucuB", () => { s.ipucu = true; testEkrani(); });
    on("#gecB", () => { if (s.ilkSure == null) s.ilkSure = Date.now() - s.bas; s.bitti = true; soruKaydet(t, s, true); ileri(); });
    on("#tekrarDene", () => { s.tekrarModu = true; testEkrani(); });
    on("#cozumGor", () => { s.cozum = true; s.bitti = true; soruKaydet(t, s); testEkrani(); });
    on("#benzerB", () => { s.benzerEklendi = true; t.plan.splice(t.i + 1, 0, { kontrolIcin: q.kaz, zorluk: q.zorluk }); ileri(); });
    on("#devamB", ileri);
    on("#oncekiB", () => { t.i--; t.soru = t.sinavSorulari[t.i]; testEkrani(); });
    on("#sonrakiB", () => { if (t.i < toplam - 1) ileri(); else sinaviBitir(); });
    if (t.sinav) sinavSaat = setInterval(() => { const k = t.sure - (Date.now() - t.bas); const e = $("#kalanSure"); if (k <= 0) { clearInterval(sinavSaat); sinaviBitir(); } else if (e) e.textContent = sn(k); }, 1000);

    function secimYap(j) {
      if (t.sinav) {
        if (s.ilkSure == null) s.ilkSure = Date.now() - s.bas;
        if (s.sinavSecim != null && s.sinavSecim !== j) s.degisti = true;
        s.sinavSecim = j; testEkrani(); return;
      }
      if (s.bitti) return;
      s.deneme++;
      if (s.deneme === 1) { s.ilkSure = Date.now() - s.bas; s.ilkSecim = j; s.sonSecim = j; if (q.secenekler[j].dogru) { s.bitti = true; soruKaydet(t, s); } }
      else { s.sonSecim = j; s.bitti = true; soruKaydet(t, s); }
      testEkrani();
    }
  }
  function ileri() {
    const t = durum.test;
    if (t.sinav) {
      t.sinavSorulari = t.sinavSorulari || [];
      t.sinavSorulari[t.i] = t.soru;
      t.i++;
      t.soru = t.sinavSorulari[t.i] || soruHazirla(t, t.i);
      t.sinavSorulari[t.i] = t.soru;
      return testEkrani();
    }
    if (t.i >= t.plan.length - 1) return testBitir();
    t.i++; t.soru = soruHazirla(t, t.i); testEkrani();
  }
  function sinaviBitir() {
    const t = durum.test; clearInterval(sinavSaat);
    t.sinavSorulari = t.sinavSorulari || []; t.sinavSorulari[t.i] = t.soru;
    for (let j = 0; j < t.plan.length; j++) {
      const s = t.sinavSorulari[j] || soruHazirla(t, j);
      s.deneme = s.sinavSecim != null ? 1 : 0; s.ilkSecim = s.sinavSecim; s.sonSecim = s.sinavSecim; s.bitti = true;
      soruKaydet(t, s, s.sinavSecim == null);
      t.sinavSorulari[j] = s;
    }
    testBitir();
  }
  function testBitir() {
    const t = durum.test;
    const asil = t.sonuclar.filter(r => !r.kontrol);
    const dogru = asil.filter(r => r.ilkDogru).length;
    const bos = asil.filter(r => r.terk).length, yanlis = asil.length - dogru - bos;
    const dagilim = {};
    if (t.tur === "karma") asil.forEach(r => { const x = dagilim[r.ders] = dagilim[r.ders] || { d: 0, y: 0, b: 0 }; if (r.terk) x.b++; else if (r.ilkDogru) x.d++; else x.y++; });
    const test = DEPO.kaydet("test", { testId: t.testId, tur: t.tur, ders: t.ders, yazili: t.yazili, konu: t.konu, tema: t.tema, n: asil.length, dogru, yanlis, bos, net: t.sinav ? Math.round((dogru - yanlis / 3) * 100) / 100 : null, dagilim: t.tur === "karma" ? dagilim : null, sure: Date.now() - t.bas, oz: null, kendiIstegi: t.kendiIstegi });
    durum.sonuc = { t, test };
    clearInterval(sinavSaat);
    git("#/sonuc");
  }

  function sonucEkrani() {
    const r = durum.sonuc; if (!r) return anaSayfa();
    const { t, test } = r;
    const oranD = test.n ? test.dogru / test.n : 0;
    const kazSonuc = {};
    t.sonuclar.filter(x => !x.kontrol).forEach(x => { (kazSonuc[x.kaz] = kazSonuc[x.kaz] || { d: 0, n: 0 }); kazSonuc[x.kaz].n++; if (x.ilkDogru) kazSonuc[x.kaz].d++; });
    const neresi = t.konu ? "Bu konuda" : "Bu testte";
    const mesaj = oranD >= 0.9 ? `Muhteşem! ${neresi} çok güçlüsün.` : oranD >= 0.7 ? "Çok iyi! Küçük eksikleri tekrar edersen tam olacak." : oranD >= 0.5 ? "İyi gidiyorsun. Zorlandığın kazanımları tekrar edelim." : t.konu ? "Bu konuyu biraz daha çalışmalıyız. Konu anlatımına bir göz atıp alıştırma yapalım." : "Aşağıda “tekrar” yazan kazanımların konularına dönüp anlatımı ve alıştırmaları yapalım.";
    const hataTurleri = {};
    t.sonuclar.forEach(x => { if (x.ilkHata) hataTurleri[x.ilkHata] = (hataTurleri[x.ilkHata] || 0) + 1; });
    const enCokHata = Object.entries(hataTurleri).sort((a, b) => b[1] - a[1])[0];
    ana.innerHTML = `<section class="kart vurgu" style="text-align:center"><span class="etiket">${TEST_AD[t.tur]}${t.yazili ? " · " + dersAd(t.ders) : ""}</span>
      <p style="font-size:3rem;font-weight:800;line-height:1">${test.dogru} / ${test.n}</p><h2>${mesaj}</h2>
      <p class="muted">Süre: ${sn(test.sure)} · İlk denemede doğru: ${yuzde(oranD)}</p>
      ${test.net != null ? `<div class="izgara dar" style="text-align:left">${[["Doğru", test.dogru], ["Yanlış", test.yanlis], ["Boş", test.bos], ["Net", test.net]].map(([a, v]) => `<div class="metrik"><b>${String(v).replace(".", ",")}</b><span>${a}</span></div>`).join("")}</div><p class="kucuk-yazi muted">Net = doğru − yanlış ÷ 3 (3 yanlış 1 doğruyu götürür; boş bırakmak net düşürmez).</p>` : ""}
      ${test.dagilim ? `<div class="tablo"><table><thead><tr><th>Ders</th><th class="sayi">Doğru</th><th class="sayi">Yanlış</th><th class="sayi">Boş</th><th class="sayi">Net</th></tr></thead><tbody>${Object.entries(test.dagilim).map(([d, x]) => `<tr><td>${dersAd(d)}</td><td class="sayi">${x.d}</td><td class="sayi">${x.y}</td><td class="sayi">${x.b}</td><td class="sayi">${String(Math.round((x.d - x.y / 3) * 100) / 100).replace(".", ",")}</td></tr>`).join("")}</tbody></table></div>` : ""}</section>
      <section class="kart"><h2>Bu çalışmada kendini nasıl değerlendiriyorsun?</h2>
        <div class="cips">${[[1, "Hiç anlamadım"], [2, "Zorlandım"], [3, "Fena değil"], [4, "İyiydim"], [5, "Çok iyiydim"]].map(([v, a]) => `<button class="cip ${test.oz === v ? "secili" : ""}" data-oz="${v}">${a}</button>`).join("")}</div></section>
      <section class="kart"><h2>Kazanımlara göre${Object.keys(kazSonuc).length > 12 ? " (en çok zorlandığın 12)" : ""}</h2>${Object.entries(kazSonuc).sort((a, b) => a[1].d / a[1].n - b[1].d / b[1].n).slice(0, 12).map(([k, x]) => `<div class="satir ara"><span>${KAZANIM[k].ad} <span class="kucuk-yazi muted">· ${KONU[KAZANIM[k].konu].ad}</span></span>${durumEtiket(x.d / x.n)}</div>`).join("")}
        ${enCokHata ? `<div class="geri bilgi"><b>En sık hata türün: ${HATA_AD[enCokHata[0]]}</b><p>${HATA_ONERI[enCokHata[0]]}</p></div>` : ""}</section>
      ${t.sinav ? `<section class="kart"><h2>Sınav cevapları ve çözümleri</h2>${t.sinavSorulari.map((s, j) => { const d = s.q.secenekler.findIndex(x => x.dogru); const ok = s.sinavSecim === d;
        return `<details><summary>${j + 1}. ${ok ? "✓ Doğru" : s.sinavSecim == null ? "— Boş" : "✗ Yanlış"} · ${KAZANIM[s.q.kaz].ad}</summary><p>${s.q.soru}</p>${s.q.gorsel ? `<div class="gorsel">${s.q.gorsel}</div>` : ""}${cozumKutusu(s.q, { secilen: s.sinavSecim })}</details>`; }).join("")}</section>` : ""}
      <section class="izgara dar">
        ${t.konu ? `<a class="btn" href="#/konu/${t.konu}">Konuya dön</a>` : ""}
        ${t.konu && oranD < 0.7 ? `<a class="btn" href="#/anlatim/${t.konu}">Anlatımı tekrar oku</a>` : ""}
        ${t.yazili ? `<a class="btn" href="#/yazili/${t.ders}/${t.yazili}">Yazılı sayfasına dön</a>` : ""}
        ${t.sinav && !t.yazili ? `<a class="btn" href="#/deneme">Deneme merkezi</a>` : ""}
        <a class="btn ana" href="#/">Ana sayfa</a></section>`;
    ana.querySelectorAll("[data-oz]").forEach(b => b.onclick = () => { DEPO.guncelle(test, { oz: +b.dataset.oz }); sonucEkrani(); toast("Teşekkürler!"); });
  }

  /* ============================ HATA DEFTERİ ============================ */
  function hataListesi(ders) {
    const sorular = DEPO.liste("soru");
    const duzeltilen = new Set(sorular.filter(s => s.ref && s.ilkDogru).map(s => s.ref));
    return sorular.filter(s => !s.ref && !s.kontrol && !s.terk && !s.ilkDogru && s.soruNesnesi && !duzeltilen.has(s.id) && KONU[s.konu] && (!ders || ANALIZ.dersi(s) === ders));
  }
  function hataDefteri() {
    const l = hataListesi(null);
    const grup = {};
    l.forEach(s => { (grup[s.konu] = grup[s.konu] || []).push(s); });
    ana.innerHTML = `<section class="kart vurgu"><h1>Hata defterim</h1><p>Yanlış yaptığın sorular burada toplanır. Bir soruyu doğru çözdüğünde defterden silinir.</p>
      <button class="btn ana" data-test="hata" ${l.length ? "" : "disabled"}>${l.length ? Math.min(10, l.length) + " soruyu tekrar çöz" : "Defterin boş, harika!"}</button></section>
      ${DERSLER.map(d => { const ks = Object.keys(grup).filter(k => KONU[k].ders === d.id); return ks.length ? `<section class="kart"><h2>${d.simge} ${d.ad}</h2>${ks.map(k => `<details><summary><b>${KONU[k].ad}</b> <span class="etiket kotu">${grup[k].length} soru</span></summary>
        ${grup[k].slice(-5).map(s => `<div class="kart" style="padding:12px;margin-top:8px"><p>${s.soruNesnesi.soru}</p>${s.soruNesnesi.gorsel ? `<div class="gorsel">${s.soruNesnesi.gorsel}</div>` : ""}${cozumKutusu(s.soruNesnesi, { baslik: "Çözüm" })}</div>`).join("")}</details>`).join("")}</section>` : ""; }).join("")}`;
    baglaOrtak();
  }

  /* ============================ GRAFİKLER ============================ */
  function cizgiGrafik(seri, { ust = 1, etiket = x => yuzde(x), hedef = null } = {}) {
    const G = 640, Y = 200, sol = 36, alt = 24, ustBos = 16, sag = 24;
    const w = (G - sol - sag) / Math.max(1, seri.length - 1);
    const yk = v => ustBos + (Y - ustBos - alt) * (1 - v / ust);
    const noktalar = seri.map((s, i) => s.v == null ? null : [sol + i * w, yk(s.v), s]).filter(Boolean);
    const yol = noktalar.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const son = noktalar[noktalar.length - 1];
    return `<div class="grafik"><svg viewBox="0 0 ${G} ${Y}" role="img" aria-label="Zaman içinde gelişim grafiği">
      ${[0, 0.5, 1].map(f => `<line class="eksen" x1="${sol}" x2="${G - 8}" y1="${yk(f * ust)}" y2="${yk(f * ust)}"></line><text x="${sol - 6}" y="${yk(f * ust) + 4}" text-anchor="end">${etiket(f * ust)}</text>`).join("")}
      ${hedef != null ? `<line class="hedef" x1="${sol}" x2="${G - 8}" y1="${yk(hedef)}" y2="${yk(hedef)}"></line>` : ""}
      ${seri.map((s, i) => i % Math.ceil(seri.length / 7) === 0 || i === seri.length - 1 ? `<text x="${sol + i * w}" y="${Y - 6}" text-anchor="middle">${s.ad}</text>` : "").join("")}
      ${yol ? `<path class="cizgi" d="${yol}"></path>` : ""}
      ${noktalar.map(p => `<circle class="nokta" cx="${p[0]}" cy="${p[1]}" r="5"><title>${p[2].ad}: ${etiket(p[2].v)}${p[2].n != null ? " (" + p[2].n + " soru)" : ""}</title></circle>`).join("")}
      ${son ? `<text class="deger" x="${Math.min(son[0], G - 40)}" y="${son[1] - 10}" text-anchor="middle">${etiket(son[2].v)}</text>` : ""}
    </svg></div>`;
  }
  function sutunGrafik(seri, { ust, etiket = x => Math.round(x), hedef = null } = {}) {
    const G = 640, Y = 200, sol = 36, alt = 24, ustBos = 18, sag = 8;
    ust = ust || Math.max(1, hedef || 0, ...seri.map(s => s.v || 0));
    const w = (G - sol - sag) / seri.length;
    const yk = v => ustBos + (Y - ustBos - alt) * (1 - v / ust);
    return `<div class="grafik"><svg viewBox="0 0 ${G} ${Y}" role="img" aria-label="Sütun grafiği">
      <line class="eksen" x1="${sol}" x2="${G - 8}" y1="${yk(0)}" y2="${yk(0)}"></line>
      <text x="${sol - 6}" y="${yk(ust) + 4}" text-anchor="end">${etiket(ust)}</text>
      ${hedef != null ? `<line class="hedef" x1="${sol}" x2="${G - 8}" y1="${yk(hedef)}" y2="${yk(hedef)}"></line><text x="${G - 10}" y="${yk(hedef) - 4}" text-anchor="end">hedef</text>` : ""}
      ${seri.map((s, i) => { const x = sol + i * w + 3, bw = Math.max(4, w - 6), v = s.v || 0, y = yk(v);
        return `<g><path class="sutun" d="M${x} ${yk(0)} V${y + Math.min(4, (yk(0) - y) / 2)} Q${x} ${y} ${x + Math.min(4, bw / 2)} ${y} H${x + bw - Math.min(4, bw / 2)} Q${x + bw} ${y} ${x + bw} ${y + Math.min(4, (yk(0) - y) / 2)} V${yk(0)} Z"><title>${s.ad}: ${etiket(v)}</title></path>
          ${v ? `<text class="deger" x="${x + bw / 2}" y="${y - 4}" text-anchor="middle">${etiket(v)}</text>` : s.yok ? `<text x="${x + bw / 2}" y="${yk(0) - 6}" text-anchor="middle">veri yok</text>` : ""}
          ${i % Math.ceil(seri.length / 7) === 0 || i === seri.length - 1 ? `<text x="${x + bw / 2}" y="${Y - 6}" text-anchor="middle">${s.ad}</text>` : ""}</g>`; }).join("")}
    </svg></div>`;
  }
  const gunAdi = g => new Date(g * ANALIZ.GUN).toLocaleDateString("tr-TR", { day: "numeric", month: "numeric" });

  /* ============================ DENEME MERKEZİ ============================ */
  const DENEME_TUR = ["deneme", "mini", "karma", "yazili"];
  const netOran = t => t.n ? Math.max(0, (t.net != null ? t.net : t.dogru - (t.n - t.dogru) / 3) / t.n) : null;
  function denemeListesi(ders) { return DEPO.liste("test").filter(t => DENEME_TUR.includes(t.tur) && (!ders || t.ders === ders || (t.tur === "karma" && t.dagilim && t.dagilim[ders]))); }
  function denemeTablosu(l) {
    return `<div class="tablo"><table><thead><tr><th>Tarih</th><th>Deneme</th><th>Ders</th><th class="sayi">D</th><th class="sayi">Y</th><th class="sayi">B</th><th class="sayi">Net</th><th class="sayi">Süre</th></tr></thead><tbody>
      ${l.slice().reverse().map(t => { const y = t.yanlis != null ? t.yanlis : t.n - t.dogru, b = t.bos || 0, net = t.net != null ? t.net : Math.round((t.dogru - y / 3) * 100) / 100;
        return `<tr><td>${tarih(t.t)}</td><td>${TEST_AD[t.tur] || t.tur}${t.yazili ? " · " + YAZILILAR.find(x => x.id === t.yazili).kisa : ""}</td><td>${t.tur === "karma" ? "4 ders" : dersAd(t.ders)}</td><td class="sayi">${t.dogru}</td><td class="sayi">${y}</td><td class="sayi">${b}</td><td class="sayi"><b>${String(net).replace(".", ",")}</b> / ${t.n}</td><td class="sayi">${sn(t.sure)}</td></tr>`; }).join("") || '<tr><td colspan="8" class="muted">Henüz deneme çözülmedi.</td></tr>'}
      </tbody></table></div>`;
  }
  function denemeGrafik(l) {
    const son = l.slice(-12);
    return son.length >= 2 ? cizgiGrafik(son.map(t => ({ ad: new Date(t.t).toLocaleDateString("tr-TR", { day: "numeric", month: "numeric" }), v: netOran(t), n: t.n }))) : '<p class="muted">İki deneme çözünce net gelişim grafiği burada oluşur.</p>';
  }
  function denemeMerkezi() {
    const l = denemeListesi(null);
    ana.innerHTML = `<section class="kart vurgu"><h1>📝 Deneme merkezi</h1>
        <p>Sınav modunda çözersin: süre işler, soruların arasında gidip gelebilirsin, cevaplar sınav bitince gösterilir. Sonuçta <b>doğru, yanlış, boş ve net</b> hesaplanır (3 yanlış 1 doğruyu götürür) ve her sorunun adım adım çözümünü görebilirsin. Sorular her denemede yeniden seçilir; deneme sayısının sınırı yoktur.</p></section>
      <section class="kart sari"><h2>🧩 Karma deneme (4 ders · 40 soru · 60 dakika)</h2><p>Matematik, Fen Bilimleri, Türkçe ve İngilizceden 10'ar soru — gerçek sınav provası.</p><div><button class="btn ana" data-test="karma">Karma denemeye başla</button></div></section>
      <section class="izgara">${DERSLER.map(d => { const dl = denemeListesi(d.id).filter(t => t.tur !== "karma"), son = dl[dl.length - 1];
        return `<div class="kart"><h2>${d.simge} ${d.ad}</h2><p class="kucuk-yazi muted">${dl.length} deneme çözüldü${son ? " · son net " + String(son.net != null ? son.net : son.dogru).replace(".", ",") + " / " + son.n : ""}</p>
          <div class="satir"><button class="btn ana kucuk" data-test="mini" data-ders="${d.id}">Mini deneme (10 soru · 15 dk)</button><button class="btn kucuk" data-test="deneme" data-ders="${d.id}">Ders denemesi (20 soru · 30 dk)</button></div></div>`; }).join("")}</section>
      <section class="kart"><h2>Net gelişimim (son 12 deneme)</h2><p class="kucuk-yazi muted">Net ÷ soru sayısı olarak gösterilir.</p>${denemeGrafik(l)}</section>
      <section class="kart"><h2>Çözdüğüm denemeler</h2>${denemeTablosu(l.slice(-20))}</section>`;
    baglaOrtak();
  }

  /* ============================ ÖĞRENCİ PANELİ: GELİŞİMİM ============================ */
  function gelisimSayfasi() {
    const d = DERS[aktifDers];
    const h = ANALIZ.hesapla({ ders: d.id });
    const gz = ANALIZ.gucluZayif(h);
    const seri = ANALIZ.gunlukSeri(14, d.id);
    const o = ANALIZ.oneri(h, d.id);
    const dersKonu = KONULAR.filter(k => k.ders === d.id);
    ana.innerHTML = `<section class="kart vurgu"><h1>Gelişimim</h1>${dersSecici(d.id, "ders")}
      <div class="izgara dar">
        <div class="metrik"><b>${Math.round(bugunDk())} / ${DEPO.ayar.gunlukHedefDk} dk</b><span>bugünkü çalışma (tüm dersler)</span></div>
        <div class="metrik"><b>${h.genel.cevaplanan}</b><span>${d.ad}: çözülen soru</span></div>
        <div class="metrik"><b>${yuzde(h.genel.ilkDeneme)}</b><span>ilk denemede doğru</span></div>
        <div class="metrik"><b>${h.calisma.tamamlananKonu} / ${dersKonu.length}</b><span>tamamlanan konu</span></div>
      </div></section>
      <section class="kart"><h2>Son 14 gün başarım · ${d.ad}</h2>${seri.some(s => s.basari != null) ? cizgiGrafik(seri.map(s => ({ ad: gunAdi(s.gun), v: s.basari, n: s.n }))) : '<p class="muted">Soru çözdükçe grafiğin burada oluşacak.</p>'}</section>
      <section class="izgara">
        <div class="kart"><h2>Güçlü olduğum konular</h2>${gz.guclu.length ? gz.guclu.map(([, x]) => `<div class="satir ara"><span>${x.ad}</span>${durumEtiket(x.ilkDeneme)}</div>`).join("") : '<p class="muted">Henüz yeterli veri yok.</p>'}</div>
        <div class="kart"><h2>Tekrar etmem gerekenler</h2>${gz.zayif.length ? gz.zayif.map(([, x]) => `<div class="satir ara"><span>${x.ad}</span>${durumEtiket(x.ilkDeneme)}</div>`).join("") : '<p class="muted">Şu an tekrar gerektiren konu yok.</p>'}</div>
      </section>
      <section class="kart"><h2>Konu bazlı gelişim</h2>${dersKonu.map(k => { const u = ortUstalik(h, k.id); return `<div style="display:grid;gap:4px"><div class="satir ara"><span>${k.ad}</span><span class="kucuk-yazi muted">${u == null ? "başlanmadı" : yuzde(u)}</span></div><div class="bar"><i style="width:${(u || 0) * 100}%"></i></div></div>`; }).join("")}</section>
      <section class="kart sari"><h2>Sonraki çalışma önerisi</h2><p>${kacis(o.metin)}</p><div>${oneriButonu(o)}</div></section>`;
    ana.querySelectorAll('.ders-sec a').forEach(a => a.onclick = e => { e.preventDefault(); dersSec(a.getAttribute("href").split("/").pop()); gelisimSayfasi(); });
    baglaOrtak();
  }

  /* ============================ VELİ / ADMİN ============================ */
  function pinEkrani() {
    let pin = "";
    const ciz = () => {
      ana.innerHTML = `<section class="kart vurgu" style="max-width:420px;margin:0 auto;width:100%"><h1 style="text-align:center">Veli paneli</h1>
        <p class="muted" style="text-align:center">Şifreyi girin (başlangıç şifresi 1234)</p>
        <div class="pin-gosterge">${"●".repeat(pin.length)}${"○".repeat(Math.max(0, 4 - pin.length))}</div>
        <div class="pin">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "Sil", 0, "Tamam"].map(x => `<button data-p="${x}">${x}</button>`).join("")}</div></section>`;
      ana.querySelectorAll("[data-p]").forEach(b => b.onclick = () => {
        const x = b.dataset.p;
        if (x === "Sil") pin = pin.slice(0, -1);
        else if (x === "Tamam") { if (pin === String(DEPO.ayar.pin)) { veliAcik = true; return git("#/veli/ozet"); } toast("Şifre yanlış."); pin = ""; }
        else if (pin.length < 8) pin += x;
        ciz();
      });
    };
    ciz();
  }

  const SEKMELER = [["ozet", "Özet"], ["dersler", "Ders ve konular"], ["kazanim", "Kazanım haritası"], ["soru", "Soru analizi"], ["anlatim", "Anlatım ve video"], ["tekrar", "Aralıklı tekrar"], ["calisma", "Çalışma alışkanlığı"], ["yazili", "Yazılılar"], ["denemeler", "Denemeler"], ["kayit", "Soru kayıtları"], ["icerik", "Videolar"], ["ayar", "Ayarlar ve eşitleme"]];
  let aralik = 7, veliDers = null;
  const dersKonulari = () => KONULAR.filter(k => !veliDers || k.ders === veliDers);
  const dersTemalari = () => TEMALAR.filter(t => !veliDers || t.ders === veliDers);
  function veliPaneli(sekme, param) {
    const h = ANALIZ.hesapla({ gun: aralik || null, ders: veliDers });
    const ust = `<section class="kart vurgu"><div class="satir ara"><h1>Veli paneli · ${kacis(DEPO.ayar.ogrenciAdi)}</h1>
      <span class="satir">${[[7, "Son 7 gün"], [30, "Son 30 gün"], [0, "Tümü"]].map(([g, a]) => `<button class="sekme ${aralik === g ? "aktif" : ""}" data-aralik="${g}">${a}</button>`).join("")}</span></div>
      <div class="ders-sec">${[[null, "Tüm dersler"], ...DERSLER.map(d => [d.id, d.simge + " " + d.ad])].map(([id, a]) => `<button class="sekme ${veliDers === id ? "aktif" : ""}" data-vders="${id || ""}">${a}</button>`).join("")}</div>
      <nav class="sekmeler">${SEKMELER.filter(([k]) => !DEPO.uzak || (k !== "icerik" && k !== "ayar")).map(([k, a]) => `<a class="sekme ${k === sekme || (sekme === "konu" && k === "dersler") ? "aktif" : ""}" href="#/veli/${k}">${a}</a>`).join("")}</nav>
      <p class="kucuk-yazi muted">Güven düzeyi: her değerin yanında kaç soruya dayandığı yazar. 5'ten az soru = düşük güven, 15 ve üzeri = yüksek güven.</p></section>`;
    const icerik = { ozet: veliOzet, dersler: veliDersler, konu: veliKonuDetay, kazanim: veliKazanim, soru: veliSoru, anlatim: veliAnlatim, tekrar: veliTekrar, calisma: veliCalisma, yazili: veliYazili, denemeler: veliDenemeler, kayit: veliKayit, icerik: veliVideolar, ayar: veliAyar }[sekme] || veliOzet;
    ana.innerHTML = ust + icerik(h, param);
    ana.querySelectorAll("[data-aralik]").forEach(b => b.onclick = () => { aralik = +b.dataset.aralik; veliPaneli(sekme, param); });
    ana.querySelectorAll("[data-vders]").forEach(b => b.onclick = () => { veliDers = b.dataset.vders || null; veliPaneli(sekme === "konu" ? "dersler" : sekme); });
    ana.querySelectorAll("[data-git]").forEach(b => b.onclick = () => git(b.dataset.git));
    if (VELI_BAGLA[sekme]) VELI_BAGLA[sekme](param);
  }
  const metrik = (deger, ad, not) => `<div class="metrik"><b>${deger}</b><span>${ad}</span>${not ? `<small>${not}</small>` : ""}</div>`;
  const cubuk = (ad, x, not) => `<div style="display:grid;gap:4px"><div class="satir ara"><span>${ad}</span><span class="kucuk-yazi">${yuzde(x)}${not ? " · " + not : ""}</span></div><div class="bar"><i style="width:${(x || 0) * 100}%"></i></div></div>`;

  function haftaKarsilastir(ders) {
    const simdi = Date.now(), G = ANALIZ.GUN;
    const parca = (bas, son) => {
      const s = DEPO.liste("soru").filter(x => x.t >= bas && x.t < son && !x.terk && (!ders || ANALIZ.dersi(x) === ders));
      return { dk: DEPO.liste("oturum").filter(o => o.t >= bas && o.t < son).reduce((a, o) => a + o.aktifSn, 0) / 60, soru: s.length,
        basari: s.length ? s.filter(x => x.ilkDogru).length / s.length : null, test: DEPO.liste("test").filter(x => x.t >= bas && x.t < son && (!ders || ANALIZ.dersi(x) === ders)).length };
    };
    return { bu: parca(simdi - 7 * G, simdi), onceki: parca(simdi - 14 * G, simdi - 7 * G) };
  }
  const fark = (a, b, f = x => Math.round(x)) => (a == null || b == null ? "" : (a - b >= 0 ? "▲ " : "▼ ") + f(Math.abs(a - b)) + " önceki haftaya göre");
  const sonCalisma = konuId => { const l = DEPO.liste("soru").filter(s => s.konu === konuId); return l.length ? l[l.length - 1].t : null; };

  function veliOzet(h) {
    const hk = haftaKarsilastir(veliDers);
    const gz = ANALIZ.gucluZayif(h);
    const seri = ANALIZ.gunlukSeri(14, veliDers);
    const hataSirali = Object.entries(h.hataSay).sort((a, b) => b[1] - a[1]);
    const tamam = dersKonulari().filter(k => h.konuOzet[k.id] && h.konuOzet[k.id].konuSonu);
    const dersKartlari = DERSLER.map(d => { const hd = ANALIZ.hesapla({ gun: aralik || null, ders: d.id }); const ks = KONULAR.filter(k => k.ders === d.id);
      const basla = ks.filter(k => hd.konuOzet[k.id].n).length;
      return `<button class="konu-satir" data-git="#/veli/dersler" onclick="return false" data-vders-ac="${d.id}"><span><b>${d.simge} ${d.ad}</b><br><span class="kucuk-yazi muted">${hd.genel.cevaplanan} soru · ilk deneme ${yuzde(hd.genel.ilkDeneme)} · ${basla}/${ks.length} konuya başlandı · ${hd.calisma.tamamlananKonu} konu tamam</span></span>
        <span><span class="kucuk-yazi muted">${yuzde(hd.genel.ilkDeneme)}</span><span class="bar" style="display:block"><i style="width:${(hd.genel.ilkDeneme || 0) * 100}%"></i></span></span></button>`; }).join("");
    const op = window.OYUN && OYUN.ozet();
    const ingOyun = window.INGOYUN && (!veliDers || veliDers === "en") ? Object.entries(INGOYUN.OYUNLAR).map(([id, o]) => { const l = DEPO.liste("oyun").filter(x => x.ders === "en" && x.oyun === id); return l.length ? `<div class="satir ara"><span>${o.simge} ${o.ad}</span><span class="kucuk-yazi">${l.length} kez · en iyi ${INGOYUN.enIyi(id)} puan · son ${l[l.length - 1].dogru}/${l[l.length - 1].n}</span></div>` : ""; }).join("") : "";
    return `<section class="kart"><h2>Derslere göre durum</h2><div style="display:grid;gap:8px">${dersKartlari}</div></section>
      ${ingOyun ? `<section class="kart"><h2>🇬🇧 İngilizce oyunları</h2>${ingOyun}</section>` : ""}
      ${op && (!veliDers || veliDers === "tr") ? `<section class="kart"><h2>🎮 Türkçe Diyarı oyunu</h2><div class="izgara dar">${metrik(op.yildiz + " / " + op.toplam, "toplanan yıldız", "")}${metrik(op.puan, "toplam puan", "")}${metrik(op.rozet + " / 3", "kazanılan rozet", op.adalar.filter(a => a.rozet).map(a => a.tema.ada.rozet).join(", "))}${metrik(DEPO.liste("oyun").filter(o => o.ders === "tr").length, "oynanan görev", "")}</div>
        ${op.adalar.map(a => `<div class="satir ara"><span>${a.tema.ada.simge} ${a.tema.ada.ad}</span><span class="kucuk-yazi">${a.gorevler.filter(g => g.yildiz >= OYUN.GECME_YILDIZ).length}/${a.gorevler.length} görev geçildi · ⭐ ${a.yildiz}/${a.toplam}</span></div>`).join("")}</section>` : ""}
      <section class="izgara dar">
        ${metrik(dk(hk.bu.dk), "bu hafta çalışma (tüm dersler)", fark(hk.bu.dk, hk.onceki.dk, x => Math.round(x) + " dk"))}
        ${metrik(hk.bu.soru, "bu hafta çözülen soru", fark(hk.bu.soru, hk.onceki.soru))}
        ${metrik(yuzde(hk.bu.basari), "bu hafta ilk deneme başarısı", fark(hk.bu.basari, hk.onceki.basari, x => "%" + Math.round(x * 100)))}
        ${metrik(hk.bu.test, "bu hafta tamamlanan test", fark(hk.bu.test, hk.onceki.test))}
      </section>
      <section class="kart"><h2>Zaman içindeki gelişim (ilk deneme başarısı)${veliDers ? " · " + dersAd(veliDers) : ""}</h2>${cizgiGrafik(seri.map(s => ({ ad: gunAdi(s.gun), v: s.basari, n: s.n })))}</section>
      <section class="kart"><h2>Günlük çalışma süresi (dakika)</h2>${sutunGrafik(seri.map(s => ({ ad: gunAdi(s.gun), v: Math.round(s.dk) })), { hedef: DEPO.ayar.gunlukHedefDk })}</section>
      <section class="izgara">
        <div class="kart"><h2>Tamamlanan konular</h2>${tamam.length ? tamam.map(k => `<div class="satir ara"><span>${k.ad} <span class="kucuk-yazi muted">· ${dersAd(k.ders)}</span></span>${durumEtiket(h.konuOzet[k.id].konuSonu.son)}</div>`).join("") : '<p class="muted">Bu aralıkta tamamlanan konu sonu testi yok.</p>'}</div>
        <div class="kart"><h2>Evde desteklenebilecek alanlar</h2>
          ${gz.zayif.length ? gz.zayif.slice(0, 4).map(([, x]) => `<div class="satir ara"><span>${x.ad} <span class="kucuk-yazi muted">· ${KONU[x.konu].ad}</span></span>${durumEtiket(x.ilkDeneme)}</div>`).join("") : '<p class="muted">Belirgin bir zayıf alan görünmüyor.</p>'}
          ${hataSirali.length ? `<div class="geri bilgi"><b>En sık hata türü: ${HATA_AD[hataSirali[0][0]]} (${hataSirali[0][1]} kez)</b><p>${HATA_ONERI[hataSirali[0][0]]}</p></div>` : ""}</div>
      </section>
      <section class="kart"><h2>Haftalık özet raporu</h2><p class="muted kucuk-yazi">Raporu WhatsApp, e-posta ya da SMS ile paylaşabilirsiniz.</p>
        <div class="satir"><button class="btn ana" id="raporPaylas">Raporu paylaş</button><button class="btn" id="raporKopyala">Panoya kopyala</button></div></section>`;
  }
  function raporMetni() {
    const satirlar = [`Öğrenme Yolculuğu – ${DEPO.ayar.ogrenciAdi} – haftalık rapor (${new Date().toLocaleDateString("tr-TR")})`];
    const hkTum = haftaKarsilastir(null);
    satirlar.push(`Toplam çalışma: ${dk(hkTum.bu.dk)} (önceki hafta ${dk(hkTum.onceki.dk)}), hedef günde ${DEPO.ayar.gunlukHedefDk} dk`);
    for (const d of DERSLER) {
      const h = ANALIZ.hesapla({ gun: 7, ders: d.id }); const hk = haftaKarsilastir(d.id); const gz = ANALIZ.gucluZayif(h);
      const hs = Object.entries(h.hataSay).sort((a, b) => b[1] - a[1])[0];
      satirlar.push("", `【${d.ad}】`, `Çözülen soru: ${hk.bu.soru}, ilk deneme başarısı: ${yuzde(hk.bu.basari)} (önceki hafta ${yuzde(hk.onceki.basari)})`,
        `Ortalama çözüm süresi: ${sn(h.genel.ortSure)}, ipucusuz çözme: ${yuzde(h.genel.ipucusuzCozme)}, yanlıştan sonra düzeltme: ${yuzde(h.genel.duzeltme)}`,
        `Güçlü: ${gz.guclu.map(([, x]) => x.ad).join(", ") || "—"}`, `Tekrar gereken: ${gz.zayif.map(([, x]) => x.ad).join(", ") || "—"}`);
      if (hs) satirlar.push(`En sık hata türü: ${HATA_AD[hs[0]]}. Öneri: ${HATA_ONERI[hs[0]]}`);
    }
    return satirlar.join("\n");
  }
  function paylas(baslik, metin) {
    if (window.Android && Android.paylas) Android.paylas(baslik, metin);
    else if (navigator.share) navigator.share({ title: baslik, text: metin }).catch(() => {});
    else kopyala(metin);
  }
  function kopyala(metin) {
    const ta = document.createElement("textarea"); ta.value = metin; document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
    ta.remove();
    if (!ok && navigator.clipboard) navigator.clipboard.writeText(metin).then(() => toast("Panoya kopyalandı."), () => toast("Kopyalanamadı."));
    else toast(ok ? "Panoya kopyalandı." : "Kopyalanamadı.");
  }

  /* Ders > tema/ünite > konu ağacı: her konunun özet istatistikleri; konuya dokununca ayrıntı açılır. */
  function veliDersler(h) {
    return (veliDers ? [DERS[veliDers]] : DERSLER).map(d => `<section class="kart"><h2>${d.simge} ${d.ad}</h2>
      ${d.temaListesi.map(t => `<h3>${t.kisa} · ${t.ad}</h3><div class="tablo"><table><thead><tr><th>Konu</th><th class="sayi">Soru</th><th class="sayi">İlk deneme</th><th class="sayi">Ustalık</th><th class="sayi">Konu sonu</th><th class="sayi">Video</th><th>Anlatım</th><th>Son çalışma</th><th></th></tr></thead><tbody>
        ${t.konular.map(k => { const x = h.konuOzet[k] || {}; const u = ortUstalik(h, k); const sc = sonCalisma(k);
          return `<tr><td><b>${KONU[k].ad}</b></td><td class="sayi">${x.cevaplanan || 0}</td><td class="sayi">${yuzde(x.ilkDeneme)}</td><td class="sayi">${yuzde(u)}</td><td class="sayi">${x.konuSonu ? yuzde(x.konuSonu.son) : "—"}</td>
            <td class="sayi">${x.video ? yuzde(x.video.tamamlama) : "—"}</td><td>${x.anlatim ? (x.anlatim.bitti ? "✓" : x.anlatim.okunan + "/" + x.anlatim.toplam) : "—"}</td><td>${sc ? tarih(sc) : "—"}</td>
            <td><button class="btn kucuk" data-git="#/veli/konu/${k}">Ayrıntı</button></td></tr>`; }).join("")}
      </tbody></table></div>`).join("")}</section>`).join("");
  }

  /* Tek konunun bütün istatistikleri */
  function veliKonuDetay(_, konuId) {
    const k = KONU[konuId]; if (!k) return veliDersler(ANALIZ.hesapla({ gun: aralik || null, ders: veliDers }));
    const h = ANALIZ.hesapla({ gun: aralik || null, konu: konuId });
    const x = h.konuOzet[konuId], g = h.genel;
    const testler = DEPO.liste("test").filter(t => t.konu === konuId && (!aralik || t.t >= Date.now() - aralik * ANALIZ.GUN)).slice(-12).reverse();
    const plan = ANALIZ.tekrarPlani().filter(p => p.konu === konuId);
    const sorular = h.sorular.slice(-20).reverse();
    const toplamHata = Object.values(h.hataSay).reduce((a, b) => a + b, 0);
    const vl = konuVideolari(konuId);
    const u = ortUstalik(h, konuId);
    const oneri = !x.n ? "Henüz bu konuda soru çözülmemiş. Konu anlatımı ve videoyla başlamasını önerin."
      : u != null && u < 0.6 ? "Bu konuda zorlanıyor. Anlatımı tekrar etmesi, sonra kolay sorulardan alıştırma yapması iyi olur."
      : !x.konuSonu ? "Alıştırmalar iyi gidiyor; konu sonu testine hazır görünüyor."
      : "Konu sonu testi yapıldı. Aralıklı tekrarları zamanında yapması kalıcılığı artırır.";
    return `<section class="kart"><p class="yol-iz"><a href="#/veli/dersler">${dersAd(k.ders)}</a> › ${TEMA[k.tema].kisa} · ${temaAd(k.tema)}</p><h2>${k.ad}</h2>
        <div class="geri bilgi"><b>Değerlendirme</b><p>${oneri}</p></div></section>
      <section class="izgara dar">
        ${metrik(yuzde(u), "ustalık (son cevaplar)", x.cevaplanan + " soru")}
        ${metrik(yuzde(g.ilkDeneme), "ilk deneme başarısı", "")}
        ${metrik(yuzde(g.sonDeneme), "son deneme başarısı", "")}
        ${metrik(sn(g.ortSure), "ortalama çözüm süresi", "")}
        ${metrik(yuzde(g.ipucusuzCozme), "ipucusuz çözme", "")}
        ${metrik(yuzde(g.duzeltme), "yanlıştan sonra düzeltme", g.duzeltmeN + " ikinci deneme")}
        ${metrik(yuzde(g.terk), "soru geçme oranı", "")}
        ${metrik(x.durak.n ? yuzde(x.durak.basari) : "—", "konu durağı başarısı", x.durak.n + " durak sorusu")}
        ${metrik(x.anlatim ? (x.anlatim.bitti ? "Bitti" : x.anlatim.okunan + " / " + x.anlatim.toplam) : "—", "metin anlatım", "")}
        ${metrik(x.video ? yuzde(x.video.tamamlama) : "—", "video tamamlama", x.video ? x.video.videolar.length + " video izlendi" : "")}
        ${metrik(x.konuSonu ? yuzde(x.konuSonu.ilk) + " → " + yuzde(x.konuSonu.son) : "—", "konu sonu testi (ilk → son)", x.konuSonu ? x.konuSonu.sayi + " kez" : "")}
      </section>
      <section class="kart"><h2>Kazanımlar</h2><div class="tablo"><table><thead><tr><th>Kazanım</th><th class="sayi">İlk deneme</th><th class="sayi">Son deneme</th><th class="sayi">Ort. süre</th><th class="sayi">Soru</th><th>Güven</th><th>Durum</th></tr></thead><tbody>
        ${k.kazanimlar.map(z => { const y = h.kazanim[z.id]; return `<tr><td>${z.ad}</td><td class="sayi">${yuzde(y.ilkDeneme)}</td><td class="sayi">${yuzde(y.sonDeneme)}</td><td class="sayi">${sn(y.ortSure)}</td><td class="sayi">${y.cevaplanan}</td><td>${y.guven.ad}</td><td>${durumEtiket(y.ustalik)}</td></tr>`; }).join("")}
      </tbody></table></div></section>
      <section class="izgara">
        <div class="kart"><h2>Zorluk düzeyine göre</h2>${[1, 2, 3].map(z => cubuk(["", "Kolay", "Orta", "Zor"][z], h.zorluk[z].basari, h.zorluk[z].n + " soru")).join("")}</div>
        <div class="kart"><h2>Bilişsel düzeye göre</h2>${Object.keys(DUZEY_AD).map(d => cubuk(DUZEY_AD[d], h.duzey[d].basari, h.duzey[d].n + " soru")).join("")}</div>
      </section>
      <section class="kart"><h2>Hata türleri (bu konu)</h2>${toplamHata ? Object.keys(HATA_AD).filter(t => h.hataSay[t] || h.kendiSay[t]).map(t => `<div class="satir ara"><span><b>${HATA_AD[t]}</b> · sistem ${h.hataSay[t] || 0}, öğrenci beyanı ${h.kendiSay[t] || 0}</span></div><p class="kucuk-yazi muted">${HATA_ONERI[t]}</p>`).join("") : '<p class="muted">Bu konuda yanlış cevap yok.</p>'}</section>
      <section class="izgara">
        <div class="kart"><h2>Testler</h2>${testler.length ? testler.map(t => `<div class="satir ara"><span>${TEST_AD[t.tur] || t.tur} <span class="kucuk-yazi muted">· ${tarih(t.t)}</span></span><span>${t.dogru}/${t.n}</span></div>`).join("") : '<p class="muted">Bu aralıkta test yok.</p>'}</div>
        <div class="kart"><h2>Aralıklı tekrar planı</h2>${plan.length ? plan.map(p => `<div class="satir ara"><span>${p.gun}. gün</span><span>${p.yapildi ? yuzde(p.sonuc) : p.vadesi ? "<span class='etiket orta'>zamanı geldi</span>" : gunTarih(p.zaman)}</span></div>`).join("") : '<p class="muted">Konu sonu testi yapılınca plan oluşur.</p>'}</div>
      </section>
      ${k.oyun && window.OYUN ? (o => `<section class="kart"><h2>Türkçe Diyarı oyunu</h2>${o ? `<p>${o.oynama} kez oynandı · en iyi ${o.enIyi}/${OYUN.GOREV_SORU} yıldız · toplam ${o.puan} puan · son oyun ${tarih(o.son.t)} (${o.son.dogru}/${o.son.n})</p>` : '<p class="muted">Bu görev henüz oynanmadı.</p>'}</section>`)(OYUN.konuOzet(konuId)) : ""}
      <section class="kart"><h2>Videolar</h2>${vl.length ? vl.map(v => { const vv = x.video && x.video.videolar.find(y => y.vid === v.vid); return `<div class="satir ara"><span>${kacis(v.baslik)}</span><span class="kucuk-yazi">${vv ? "izlendi " + yuzde(vv.tamamlama) + " · " + vv.oturum + " kez açıldı" : "açılmadı"}</span></div>`; }).join("") : '<p class="muted">Bu konuda video yok.</p>'}
        ${x.video ? `<p class="kucuk-yazi muted">Geri sarma ${x.video.geriSarma} · duraklatma ${x.video.duraklatma} · aktif izleme ${yuzde(x.video.aktif)}</p>` : ""}</section>
      <section class="kart"><h2>Son ${sorular.length} soru</h2><div class="tablo"><table><thead><tr><th>Zaman</th><th>Kazanım</th><th class="sayi">Zorluk</th><th class="sayi">Süre</th><th>İlk</th><th>Son</th><th>Yardım</th><th>Hata türü</th></tr></thead><tbody>
        ${sorular.map(s => `<tr><td>${tarih(s.t)}</td><td>${KAZANIM[s.kaz] ? KAZANIM[s.kaz].ad : s.kaz}</td><td class="sayi">${s.zorluk}</td><td class="sayi">${sn(s.ilkSure)}</td><td>${s.terk ? "geçti" : s.ilkDogru ? "✓" : "✗"}</td><td>${s.terk ? "" : s.sonDogru ? "✓" : "✗"}</td><td>${[s.ipucu ? "ipucu" : "", s.cozumGoruldu ? "çözüm" : ""].filter(Boolean).join(", ")}</td><td>${s.ilkHata ? HATA_AD[s.ilkHata] : ""}</td></tr>`).join("") || '<tr><td colspan="8" class="muted">Henüz soru yok.</td></tr>'}
      </tbody></table></div></section>`;
  }

  function veliKazanim(h) {
    return dersTemalari().map(t => `<section class="kart"><h2>${dersAd(t.ders)} · ${t.kisa} · ${t.ad}</h2><div class="tablo"><table>
      <thead><tr><th>Konu / kazanım</th><th class="sayi">İlk deneme</th><th class="sayi">Son deneme</th><th class="sayi">Ort. süre</th><th class="sayi">Soru</th><th>Güven</th><th>Durum</th></tr></thead><tbody>
      ${t.konular.map(k => `<tr><td colspan="7"><b>${KONU[k].ad}</b> <button class="btn kucuk" data-git="#/veli/konu/${k}">Ayrıntı</button></td></tr>` + KONU[k].kazanimlar.map(z => { const x = h.kazanim[z.id];
        return `<tr><td>${z.ad}</td><td class="sayi">${yuzde(x.ilkDeneme)}</td><td class="sayi">${yuzde(x.sonDeneme)}</td><td class="sayi">${sn(x.ortSure)}</td><td class="sayi">${x.cevaplanan}</td><td>${x.guven.ad}</td><td>${durumEtiket(x.ilkDeneme)}</td></tr>`; }).join("")).join("")}
      </tbody></table></div></section>`).join("");
  }

  function veliSoru(h) {
    const g = h.genel;
    const duzeyAd = { hatirlama: "Bilgiyi hatırlama (temel bilgiyi hatırlayabiliyor mu?)", aciklama: "Kavramı açıklama / ayırt etme (ne öğrendiğini anlıyor mu?)", uygulama: "Örnek üzerinde uygulama (bilgiyi kullanabiliyor mu?)", transfer: "Yeni nesil / transfer (farklı durumda kullanabiliyor mu?)", baglanti: "Önceki konularla bağlantı (bilgileri birleştirebiliyor mu?)" };
    const toplamHata = Object.values(h.hataSay).reduce((a, b) => a + b, 0);
    return `<section class="izgara dar">
        ${metrik(yuzde(g.ilkDeneme), "İlk deneme başarı oranı", g.cevaplanan + " soru")}
        ${metrik(yuzde(g.sonDeneme), "Son deneme başarı oranı", "ikinci denemeler dahil")}
        ${metrik(sn(g.ortSure), "Ortalama çözüm süresi", "ilk cevaba kadar")}
        ${metrik(yuzde(g.terk), "Soruyu terk etme oranı", "“geç” denen sorular")}
        ${metrik(yuzde(g.ipucuylaCozulen), "İpucuyla çözülen soru oranı", "doğru çözülenler içinde")}
        ${metrik(yuzde(g.ipucusuzCozme), "İpucu almadan çözme", "ilk denemede, yardımsız")}
        ${metrik(yuzde(g.duzeltme), "Yanlıştan sonra düzeltme", g.duzeltmeN + " ikinci deneme")}
        ${metrik(yuzde(g.cozumSonrasi), "Çözümü gördükten sonra benzer soru", g.cozumSonrasiN + " kontrol sorusu")}
        ${metrik(yuzde(h.hataTekrarOrani), "Aynı hata türünün tekrarı", "aynı kazanımda")}
      </section>
      <section class="kart"><h2>Kolay, orta ve zor sorulardaki başarı</h2>${[1, 2, 3].map(z => cubuk(["", "Kolay", "Orta", "Zor"][z], h.zorluk[z].basari, h.zorluk[z].n + " soru")).join("")}</section>
      <section class="kart"><h2>Bilişsel düzeylere göre başarı</h2>${Object.entries(duzeyAd).map(([k, a]) => cubuk(a, h.duzey[k].basari, h.duzey[k].n + " soru · güven " + ANALIZ.guven(h.duzey[k].n).ad)).join("")}</section>
      <section class="kart"><h2>Hata türleri ve öneriler</h2><p class="muted kucuk-yazi">Sistemin tespiti: öğrencinin seçtiği yanlış şıkkın türü. Öğrencinin beyanı: “Neden yanlış yaptın?” sorusuna verdiği cevap.</p>
        <div class="tablo"><table><thead><tr><th>Hata türü</th><th class="sayi">Sistem tespiti</th><th class="sayi">Öğrenci beyanı</th><th>Öneri</th></tr></thead><tbody>
        ${Object.keys(HATA_AD).map(k => `<tr><td><b>${HATA_AD[k]}</b></td><td class="sayi">${h.hataSay[k] || 0}${toplamHata ? " (" + yuzde((h.hataSay[k] || 0) / toplamHata) + ")" : ""}</td><td class="sayi">${h.kendiSay[k] || 0}</td><td>${HATA_ONERI[k]}</td></tr>`).join("")}
        </tbody></table></div>
        ${h.tekrarEdenHata.length ? `<h3>Tekrar eden hatalar</h3>${h.tekrarEdenHata.slice(0, 6).map(x => `<div class="satir ara"><span>${KAZANIM[x.kaz] ? KAZANIM[x.kaz].ad : x.kaz}</span><span class="etiket kotu">${HATA_AD[x.hata]} · ${x.n} kez</span></div>`).join("")}` : ""}</section>
      <section class="kart"><h2>Test türlerine göre</h2><div class="tablo"><table><thead><tr><th>Test</th><th class="sayi">Sayı</th><th class="sayi">Başarı</th></tr></thead><tbody>
        ${Object.entries(h.testTur).map(([k, x]) => `<tr><td>${{ tekrar: "Aralıklı tekrar testleri", yazili: "Yazılı çalışmaları", ...TEST_AD }[k] || k}</td><td class="sayi">${x.sayi}</td><td class="sayi">${yuzde(x.n ? x.dogru / x.n : null)}</td></tr>`).join("") || '<tr><td colspan="3" class="muted">Henüz test yok.</td></tr>'}
      </tbody></table></div></section>`;
  }

  function veliAnlatim(h) {
    return `<section class="kart"><h2>Anlatım ve video takibi</h2><p class="muted kucuk-yazi">Tamamlama: izlenen benzersiz süre / toplam süre (izlenen videolar). Aktif izleme: gerçekten oynatılan süre / toplam süre (tekrar izlemeler dahil, %100'ü geçebilir).</p>
      <div class="tablo"><table><thead><tr><th>Konu</th><th>Metin anlatım</th><th class="sayi">Video tamamlama</th><th class="sayi">Aktif izleme</th><th class="sayi">Geri sarma</th><th class="sayi">Duraklatma</th><th>Tekrar açılan bölümler</th><th class="sayi">Konu durağı başarısı</th></tr></thead><tbody>
      ${dersKonulari().map(k => { const x = h.konuOzet[k.id], v = x.video;
        return `<tr><td><b>${k.ad}</b><br><span class="kucuk-yazi muted">${dersAd(k.ders)}</span></td><td>${x.anlatim ? (x.anlatim.bitti ? "Tamamlandı" : x.anlatim.okunan + " / " + x.anlatim.toplam) : "—"}</td>
          <td class="sayi">${v ? yuzde(v.tamamlama) : "—"}</td><td class="sayi">${v ? yuzde(v.aktif) : "—"}</td><td class="sayi">${v ? v.geriSarma : "—"}</td><td class="sayi">${v ? v.duraklatma : "—"}</td>
          <td>${v && v.tekrarlananBolumler.length ? v.tekrarlananBolumler.map(i => (i + 1) + ". bölüm (" + v.bolumAcma[i] + " kez)").join(", ") : "—"}</td>
          <td class="sayi">${x.durak.n ? yuzde(x.durak.basari) + " (" + x.durak.n + ")" : "—"}</td></tr>`; }).join("")}
      </tbody></table></div>
      <div class="geri bilgi"><b>Nasıl yorumlanır?</b><p>Sık geri sarılan ya da tekrar açılan bölümler, öğrencinin zorlandığı olası konu parçalarıdır. Duraklatma sayısının yüksek olması not alma ya da dikkat dağınıklığına işaret edebilir. Konu durağı başarısı, dinlenen bilginin ne kadar anlaşıldığını gösterir.</p></div></section>`;
  }

  function veliTekrar(h) {
    const plan = ANALIZ.tekrarPlani(veliDers);
    const tb = h.tekrarBasari;
    return `<section class="kart"><h2>Unutma eğrisi: tekrar testlerindeki başarı</h2>
      ${sutunGrafik([[0, "İlk öğrenme"], [1, "1 gün sonra"], [3, "3 gün sonra"], [7, "7 gün sonra"], [30, "30 gün sonra"]].map(([g, a]) => ({ ad: a, v: tb[g].basari == null ? 0 : Math.round(tb[g].basari * 100), yok: tb[g].basari == null })), { ust: 100, etiket: x => "%" + Math.round(x) })}
      <p class="muted kucuk-yazi">${[0, 1, 3, 7, 30].map(g => `${g ? g + ". gün" : "İlk"}: ${tb[g].n} test`).join(" · ")}</p></section>
      <section class="kart"><h2>Konulara göre tekrar planı</h2><div class="tablo"><table><thead><tr><th>Konu</th><th class="sayi">İlk test</th>${ANALIZ.TEKRAR_GUNLERI.map(g => `<th class="sayi">${g}. gün</th>`).join("")}</tr></thead><tbody>
      ${dersKonulari().filter(k => h.konuOzet[k.id].konuSonu).map(k => `<tr><td>${k.ad}</td><td class="sayi">${yuzde(h.konuOzet[k.id].konuSonu.ilk)}</td>${ANALIZ.TEKRAR_GUNLERI.map(g => { const p = plan.find(x => x.konu === k.id && x.gun === g); return `<td class="sayi">${!p ? "—" : p.yapildi ? yuzde(p.sonuc) : p.vadesi ? "<span class='etiket orta'>zamanı geldi</span>" : new Date(p.zaman).toLocaleDateString("tr-TR")}</td>`; }).join("")}</tr>`).join("") || `<tr><td colspan="6" class="muted">Konu sonu testi yapılınca tekrar planı burada oluşur.</td></tr>`}
      </tbody></table></div></section>`;
  }

  function veliCalisma(h) {
    const c = h.calisma;
    const seri = ANALIZ.gunlukSeri(aralik === 7 ? 7 : 30, veliDers);
    return `<section class="izgara dar">
        ${metrik(dk(c.toplamDk), "toplam aktif çalışma (tüm dersler)", c.oturumSayisi + " oturum")}
        ${metrik(dk(c.gunlukOrtDk), "günlük ortalama", "hedef " + DEPO.ayar.gunlukHedefDk + " dk")}
        ${metrik((c.planFarkDk >= 0 ? "+" : "−") + dk(Math.abs(c.planFarkDk)), "plan ile gerçekleşen farkı", "planlanan " + dk(c.planDk))}
        ${metrik(c.hedefTutanGun + " / " + c.gunSay, "hedefe ulaşılan gün", "")}
        ${metrik(c.testSayisi, "tamamlanan test", c.tamamlananKonu + " konu tamamlandı (≥%70)")}
        ${metrik(c.kesinti, "dikkat dağılması olabilecek kesinti", "uygulamadan çıkma ya da 90 sn hareketsizlik")}
        ${metrik(c.kendiTekrari, "kendi isteğiyle başlattığı tekrar", "")}
        ${metrik(yuzde(c.yardimsiz), "yardım almadan çözdüğü soru", "ipucu ve çözüm görmeden")}
        ${metrik(c.hataDefteriDonus, "önceki yanlışlarına dönme", "hata defteri açılışı")}
        ${metrik(c.ozDegerlendirme ? c.ozDegerlendirme.ort.toFixed(1) + " / 5" : "—", "çalışma sonu öz değerlendirme", c.ozDegerlendirme ? "gerçek başarıya göre " + c.ozDegerlendirme.gercek.toFixed(1) + " / 5" : "")}
      </section>
      <section class="kart"><h2>Günlük çalışma süresi</h2>${sutunGrafik(seri.map(s => ({ ad: gunAdi(s.gun), v: Math.round(s.dk) })), { hedef: DEPO.ayar.gunlukHedefDk })}</section>
      ${c.ozDegerlendirme ? `<section class="kart"><h2>Öz değerlendirme ile gerçek başarı</h2><p>${c.ozDegerlendirme.ort - c.ozDegerlendirme.gercek > 0.7 ? "Öğrenci kendini gerçek başarısından daha iyi değerlendiriyor; yanlışlarını birlikte incelemek farkındalık kazandırır." : c.ozDegerlendirme.gercek - c.ozDegerlendirme.ort > 0.7 ? "Öğrenci kendini olduğundan düşük değerlendiriyor; başarılarını fark etmesi için cesaretlendirin." : "Öğrencinin öz değerlendirmesi gerçek başarısıyla uyumlu."}</p></section>` : ""}`;
  }

  /* Yazılı sınavlar: tarih, kapsam (konu seçimi), hazırlık ve prova sonuçları */
  function veliYazili(h) {
    return (veliDers ? [DERS[veliDers]] : DERSLER).map(d => { const hd = ANALIZ.hesapla({ ders: d.id });
      return `<section class="kart"><h2>${d.simge} ${d.ad} · yazılılar</h2>
      ${YAZILILAR.map(y => { const kap = new Set(yaziliKapsam(d.id, y.id)); const hz = yaziliHazirlik(hd, d.id, y.id);
        const pr = DEPO.liste("test").filter(t => t.tur === "yazili" && t.ders === d.id && t.yazili === y.id);
        const son = pr[pr.length - 1];
        return `<details><summary><b>${y.ad}</b> · ${kap.size} konu · hazırlık ${yuzde(hz)}${son ? " · son prova " + son.dogru + "/" + son.n : ""}${yaziliTarih(d.id, y.id) ? " · " + gunTarih(yaziliTarih(d.id, y.id) + "T09:00") : ""}</summary>
          <div style="display:grid;gap:10px;margin-top:10px" data-yaz="${d.id}.${y.id}">
            <label class="alan">Sınav tarihi<input type="date" class="yTarih" value="${yaziliTarih(d.id, y.id)}"></label>
            <div style="display:grid;gap:6px">${d.temaListesi.map(t => `<span class="kucuk-yazi muted">${t.kisa} · ${t.ad}</span>${t.konular.map(k => `<label class="satir"><input type="checkbox" class="yKonu" value="${k}" ${kap.has(k) ? "checked" : ""}> ${KONU[k].ad} ${kap.has(k) ? durumEtiket(ortUstalik(hd, k)) : ""}</label>`).join("")}`).join("")}</div>
            ${DEPO.uzak ? '<p class="kucuk-yazi muted">Bilgisayardan yalnızca görüntülenir; tarih ve konuları tablette değiştirin.</p>' : '<div class="satir"><button class="btn ana kucuk yKaydet">Kaydet</button><button class="btn kucuk yVarsayilan">Varsayılana dön</button></div>'}
            ${pr.length ? `<div class="tablo"><table><thead><tr><th>Prova</th><th class="sayi">Doğru</th><th class="sayi">Süre</th></tr></thead><tbody>${pr.slice(-6).reverse().map(p => `<tr><td>${tarih(p.t)}</td><td class="sayi">${p.dogru} / ${p.n}</td><td class="sayi">${sn(p.sure)}</td></tr>`).join("")}</tbody></table></div>` : '<p class="muted kucuk-yazi">Henüz yazılı provası yapılmadı.</p>'}
          </div></details>`; }).join("")}</section>`; }).join("") +
      `<p class="kucuk-yazi muted">Varsayılan kapsamlar okulların yaygın yıllık planına göre hazırlanmıştır. Öğretmenin duyurduğu konulara göre işaretleri değiştirebilirsiniz.</p>`;
  }

  function veliDenemeler() {
    const l = denemeListesi(veliDers).filter(t => !aralik || t.t >= Date.now() - aralik * ANALIZ.GUN);
    const ort = l.length ? l.reduce((a, t) => a + (netOran(t) || 0), 0) / l.length : null;
    return `<section class="izgara dar">${metrik(l.length, "çözülen deneme", "")}${metrik(yuzde(ort), "ortalama net oranı", "net ÷ soru")}${metrik(l.length ? String(Math.max(...l.map(t => t.net != null ? t.net : t.dogru))).replace(".", ",") : "—", "en yüksek net", "")}${metrik(l.reduce((a, t) => a + (t.bos || 0), 0), "boş bırakılan soru", "")}</section>
      <section class="kart"><h2>Net gelişimi</h2>${denemeGrafik(l)}</section>
      <section class="kart"><h2>Deneme sonuçları</h2>${denemeTablosu(l)}
        <p class="kucuk-yazi muted">Net = doğru − yanlış ÷ 3. Karma deneme dört dersten 10'ar sorudur; ders bazında netler sonuç ekranında ve soru analizinde görünür.</p></section>`;
  }

  function veliKayit(h) {
    const son = h.sorular.slice(-150).reverse();
    return `<section class="kart"><h2>Son ${son.length} soru</h2><div class="tablo"><table><thead><tr><th>Zaman</th><th>Ders / konu / kazanım</th><th>Düzey</th><th class="sayi">Zorluk</th><th class="sayi">Süre</th><th>İlk</th><th>Son</th><th>Yardım</th><th>Hata türü</th><th>Test</th></tr></thead><tbody>
      ${son.map(s => `<tr><td>${tarih(s.t)}</td><td><span class="kucuk-yazi muted">${dersAd(ANALIZ.dersi(s))} · ${KONU[s.konu] ? KONU[s.konu].ad : ""}</span><br>${KAZANIM[s.kaz] ? KAZANIM[s.kaz].ad : s.kaz}</td><td>${(DUZEY_AD[s.duzey] || "").split(" ")[0]}</td><td class="sayi">${s.zorluk}</td><td class="sayi">${sn(s.ilkSure)}</td>
        <td>${s.terk ? "geçti" : s.ilkDogru ? "✓" : "✗"}</td><td>${s.terk ? "" : s.sonDogru ? "✓" : "✗"}</td><td>${[s.ipucu ? "ipucu" : "", s.cozumGoruldu ? "çözüm" : "", s.kontrol ? "benzer soru" : ""].filter(Boolean).join(", ")}</td>
        <td>${s.ilkHata ? HATA_AD[s.ilkHata] : ""}${s.kendiHata ? " / beyan: " + HATA_AD[s.kendiHata] : ""}</td><td>${TEST_AD[s.mod] || s.mod}</td></tr>`).join("") || '<tr><td colspan="10" class="muted">Henüz kayıt yok.</td></tr>'}
      </tbody></table></div></section>`;
  }

  function veliVideolar() {
    const v = DEPO.ayar.videolar, gizli = DEPO.ayar.gizliVideolar || {};
    return `<section class="kart"><h2>Konu anlatım videoları</h2>
      <p>Her konuya farklı kanallardan hazır videolar eklendi. Beğenmediğiniz videoyu <b>gizleyebilir</b>, isterseniz kendi videonuzu ekleyip bölümlere ayırabilirsiniz (her bölüm sonunda öğrenciye kısa soru gelir). Bölüm tanımlanmayan videolar, süresine göre yaklaşık 4 dakikalık parçalara otomatik bölünür.</p>
      <p class="kucuk-yazi muted">Not: Video kaldırılmışsa ya da sahibi gömülü oynatmayı kapattıysa uygulama bunu söyler ve sıradaki videoyu önerir.</p></section>
      ${dersTemalari().map(t => `<section class="kart"><h2>${dersAd(t.ders)} · ${t.kisa} · ${t.ad}</h2>${t.konular.map(k => { const x = v[k] || {}; const hazir = (window.HAZIR_VIDEOLAR && HAZIR_VIDEOLAR[k]) || []; const acik = hazir.filter(h => !gizli[h.vid]).length + (x.vid ? 1 : 0);
        return `<details><summary><b>${KONU[k].ad}</b> <span class="etiket ${acik ? "iyi" : ""}">${acik} video</span></summary>
        <div style="display:grid;gap:8px;margin-top:10px">${hazir.map(h => `<div class="satir ara"><span>${gizli[h.vid] ? "<s>" : ""}${kacis(h.baslik)}${gizli[h.vid] ? "</s>" : ""} <span class="kucuk-yazi muted">${kacis(h.kaynak || "")}${h.not ? " · " + kacis(h.not) : ""}</span></span><button class="btn kucuk" data-gizle="${h.vid}">${gizli[h.vid] ? "Göster" : "Gizle"}</button></div>`).join("")}</div>
        <div style="display:grid;gap:10px;margin-top:10px" data-konu="${k}"><h3>Kendi videonuz</h3>
          <label class="alan">YouTube bağlantısı<input type="url" class="vUrl" value="${kacis(x.url || "")}" placeholder="https://www.youtube.com/watch?v=..."></label>
          <label class="alan">Video adı (isteğe bağlı)<input type="text" class="vAd" value="${kacis(x.baslik || "")}" placeholder="Örn. Öğretmenimizin anlatımı"></label>
          <div class="vBolumler" style="display:grid;gap:8px">${(x.bolumler || []).map(b => bolumSatiri(b)).join("")}</div>
          <div class="satir"><button class="btn kucuk vBolumEkle">Bölüm ekle</button><button class="btn ana kucuk vKaydet">Kaydet</button>${x.vid ? `<button class="btn kucuk tehlike vSil">Videoyu kaldır</button>` : ""}</div>
        </div></details>`; }).join("")}</section>`).join("")}`;
  }
  function bolumSatiri(b = {}) {
    return `<div class="kart vBolum" style="padding:10px;gap:8px"><div class="satir"><input type="text" class="bBaslik" placeholder="Bölüm başlığı" value="${kacis(b.baslik || "")}" style="flex:2;min-width:140px">
      <input type="text" class="bBas" placeholder="Başlangıç (dk:sn)" value="${kacis(b.bas || "")}" style="flex:1;min-width:100px">
      <select class="bDurak" style="flex:1;min-width:150px"><option value="oto" ${b.durak !== "yok" && b.durak !== "ozel" ? "selected" : ""}>Bölüm sonu: otomatik soru</option><option value="ozel" ${b.durak === "ozel" ? "selected" : ""}>Bölüm sonu: kendi sorum</option><option value="yok" ${b.durak === "yok" ? "selected" : ""}>Bölüm sonu: soru yok</option></select>
      <button class="btn kucuk tehlike bSil">Sil</button></div>
      <div class="bOzel" ${b.durak === "ozel" ? "" : "hidden"} style="display:grid;gap:6px"><input type="text" class="bSoru" placeholder="Soru" value="${kacis(b.soru || "")}">
        ${[0, 1, 2, 3].map(i => `<input type="text" class="bSec" placeholder="${"ABCD"[i]} şıkkı" value="${kacis((b.secenekler || [])[i] || "")}">`).join("")}
        <label class="alan">Doğru şık<select class="bDogru">${[0, 1, 2, 3].map(i => `<option value="${i}" ${+b.dogruIndeks === i ? "selected" : ""}>${"ABCD"[i]}</option>`).join("")}</select></label></div></div>`;
  }
  function veliAyar() {
    const a = DEPO.ayar;
    return `<section class="kart"><h2>Öğrenci ve hedef</h2>
        <label class="alan">Öğrencinin adı<input type="text" id="aAd" value="${kacis(a.ogrenciAdi)}"></label>
        <label class="alan">Günlük çalışma hedefi (dakika)<input type="number" id="aHedef" value="${a.gunlukHedefDk}" min="5" max="240"></label>
        <label class="alan">Veli paneli şifresi (yalnızca rakam)<input type="password" id="aPin" inputmode="numeric" value="${kacis(a.pin)}"></label>
        <label class="satir"><input type="checkbox" id="aOyunAcik" ${a.oyunHepsiAcik ? "checked" : ""}> Türkçe Diyarı oyununda bütün adaları ve görevleri aç (sınıfta ileriki temalara geçildiyse)</label>
        <button class="btn ana" id="aKaydet">Kaydet</button></section>
      <section class="kart"><h2>💻 Bilgisayardan izleme (aynı Wi‑Fi ağı)</h2>
        <p>Tablet ve bilgisayar aynı modeme bağlıyken veli panelini bilgisayarın tarayıcısından (Chrome, Edge…) görebilirsiniz. İnternet gerekmez; veriler yalnızca ev ağınızda dolaşır.</p>
        ${window.Android && Android.sunucuBaslat ? (u => u ? `<div class="geri iyi"><b>Açık.</b> Bilgisayarın tarayıcısının adres çubuğuna şunu yazın:<p style="font-size:1.6rem;font-weight:800;letter-spacing:.5px;user-select:all">${kacis(u)}</p><p class="kucuk-yazi">Açılan sayfada veli şifresini girin. İzleme sürerken bu uygulama tablette açık kalmalı (ekran kendiliğinden kapanmaz). Veriler 10 saniyede bir yenilenir.</p></div>
          <div class="satir"><button class="btn tehlike" id="aSunucuDurdur">İzlemeyi kapat</button></div>`
          : `<div class="satir"><button class="btn ana" id="aSunucuBaslat">İzlemeyi başlat</button></div><p class="kucuk-yazi muted">Güvenlik: sayfa yalnızca veli şifresiyle açılır. Varsayılan şifre 1234 ise önce değiştirin.</p>`)(Android.sunucuAdres ? Android.sunucuAdres() : "")
          : '<p class="muted">Bu özellik tablete kurulu uygulamada çalışır.</p>'}</section>
      <section class="kart"><h2>İnternet gelince otomatik gönderme (bulut)</h2>
        <p>Uygulama internet yokken bütün verileri tablette saklar. Aşağıya bir bulut adresi girilirse, internet geldiğinde biriken veriler otomatik gönderilir ve başka bir cihazdan (örneğin velinin telefonundaki aynı uygulamadan) <b>“Buluttan verileri al”</b> ile görülebilir.</p>
        <label class="alan">Bulut adresi (Google Apps Script web uygulaması)<input type="url" id="aUrl" value="${kacis(a.bulutUrl)}" placeholder="https://script.google.com/macros/s/.../exec"></label>
        <p class="kucuk-yazi muted">Son eşitleme: ${a.sonEsitleme ? tarih(a.sonEsitleme) : "hiç"} · Gönderilmeyi bekleyen kayıt: ${DEPO.bekleyenSayisi()}</p>
        <div class="satir"><button class="btn ana" id="aUrlKaydet">Adresi kaydet</button><button class="btn" id="aGonder">Şimdi gönder</button><button class="btn" id="aCek">Buluttan verileri al</button></div>
        <details><summary><b>Bulut adresi nasıl alınır? (5 dakika, ücretsiz)</b></summary><ol style="display:grid;gap:6px">
          <li>Bilgisayar ya da telefondan Google hesabınızla <b>sheets.google.com</b> adresinde yeni boş bir tablo açın.</li>
          <li>Menüden <b>Uzantılar → Apps Script</b>'i açın, içindeki kodu silip aşağıdaki kodu yapıştırın ve kaydedin.</li>
          <li><b>Dağıt → Yeni dağıtım → Tür: Web uygulaması</b> seçin. “Erişimi olanlar: <b>Herkes</b>” yapın ve Dağıt'a basın. İzin isterse onaylayın.</li>
          <li>Verilen <b>/exec</b> ile biten adresi kopyalayıp buraya yapıştırın. Aynı adresi velinin telefonundaki uygulamaya da girin.</li></ol>
          <textarea readonly id="aKod">${kacis(APPS_SCRIPT)}</textarea><button class="btn kucuk" id="aKodKopyala">Kodu kopyala</button>
          <p class="kucuk-yazi muted">Güvenlik: adresi bilen herkes verileri görebilir; adresi kimseyle paylaşmayın.</p></details></section>
      <section class="kart"><h2>İnternetsiz taşıma (kopyala-yapıştır)</h2><p>Bütün verileri metin olarak kopyalayıp başka bir cihazdaki uygulamaya yapıştırabilirsiniz.</p>
        <div class="satir"><button class="btn" id="aDisa">Tüm verileri kopyala</button><button class="btn" id="aDisaPaylas">Tüm verileri paylaş</button></div>
        <label class="alan">Başka cihazdan gelen veriyi buraya yapıştırın<textarea id="aIce" placeholder='{"surum":1,...}'></textarea></label><button class="btn" id="aIceAl">İçe aktar</button></section>
      <section class="kart"><h2>Verileri sıfırla</h2><p class="muted">Bütün çalışma kayıtları silinir; ayarlar ve videolar kalır. Bu işlem geri alınamaz.</p>
        <div class="satir"><button class="btn tehlike" id="aSifir">Kayıtları sil</button><span id="aSifirOnay" hidden>Emin misiniz? <button class="btn tehlike kucuk" id="aSifirEvet">Evet, sil</button> <button class="btn kucuk" id="aSifirHayir">Vazgeç</button></span></div></section>
      <p class="kucuk-yazi muted" style="text-align:center">Öğrenme Yolculuğu ${window.Android && Android.surum ? Android.surum() : "web"} · cihaz ${a.cihaz}</p>`;
  }
  const APPS_SCRIPT = `function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Olaylar') || ss.insertSheet('Olaylar');
  var rows = (d.olaylar || []).map(function (o) { return [o.id, new Date(o.t), d.ogrenci || '', o.tip, JSON.stringify(o)]; });
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, 5).setValues(rows);
  return ContentService.createTextOutput(JSON.stringify({ ok: true, n: rows.length })).setMimeType(ContentService.MimeType.JSON);
}
function doGet(e) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Olaylar');
  var out = [];
  if (sh && sh.getLastRow() > 0) {
    var v = sh.getRange(1, 5, sh.getLastRow(), 1).getValues();
    for (var i = 0; i < v.length; i++) { try { out.push(JSON.parse(v[i][0])); } catch (x) {} }
  }
  return ContentService.createTextOutput(JSON.stringify({ olaylar: out })).setMimeType(ContentService.MimeType.JSON);
}`;

  const VELI_BAGLA = {
    ozet() {
      $("#raporPaylas").onclick = () => paylas("Haftalık rapor", raporMetni()); $("#raporKopyala").onclick = () => kopyala(raporMetni());
      ana.querySelectorAll("[data-vders-ac]").forEach(b => b.onclick = () => { veliDers = b.dataset.vdersAc; git("#/veli/dersler"); });
    },
    yazili() {
      if (DEPO.uzak) { ana.querySelectorAll("[data-yaz] input").forEach(x => { x.disabled = true; }); return; }
      ana.querySelectorAll("[data-yaz]").forEach(kutu => {
        const anahtar = kutu.dataset.yaz;
        kutu.querySelector(".yKaydet").onclick = () => {
          const konular = [...kutu.querySelectorAll(".yKonu")].filter(x => x.checked).map(x => x.value);
          DEPO.ayar.yazililar = DEPO.ayar.yazililar || {};
          DEPO.ayar.yazililar[anahtar] = { konular, tarih: kutu.querySelector(".yTarih").value };
          DEPO.ayarKaydet(); toast("Kaydedildi."); veliPaneli("yazili");
        };
        kutu.querySelector(".yVarsayilan").onclick = () => { if (DEPO.ayar.yazililar) delete DEPO.ayar.yazililar[anahtar]; DEPO.ayarKaydet(); toast("Varsayılan kapsam geri yüklendi."); veliPaneli("yazili"); };
      });
    },
    icerik() {
      ana.querySelectorAll("[data-gizle]").forEach(b => b.onclick = () => {
        const g = DEPO.ayar.gizliVideolar = DEPO.ayar.gizliVideolar || {};
        if (g[b.dataset.gizle]) delete g[b.dataset.gizle]; else g[b.dataset.gizle] = true;
        DEPO.ayarKaydet();
        b.textContent = g[b.dataset.gizle] ? "Göster" : "Gizle";
        const ad = b.previousElementSibling; ad.style.textDecoration = g[b.dataset.gizle] ? "line-through" : "";
      });
      ana.querySelectorAll("[data-konu]").forEach(kutu => {
        const k = kutu.dataset.konu;
        const ozelBagla = () => kutu.querySelectorAll(".vBolum").forEach(r => {
          r.querySelector(".bDurak").onchange = e => { r.querySelector(".bOzel").hidden = e.target.value !== "ozel"; };
          r.querySelector(".bSil").onclick = () => r.remove();
        });
        ozelBagla();
        kutu.querySelector(".vBolumEkle").onclick = () => { kutu.querySelector(".vBolumler").insertAdjacentHTML("beforeend", bolumSatiri({ bas: kutu.querySelectorAll(".vBolum").length ? "" : "0:00" })); ozelBagla(); };
        kutu.querySelector(".vKaydet").onclick = () => {
          const url = kutu.querySelector(".vUrl").value.trim();
          const vid = ytKimlik(url);
          if (url && !vid) return toast("Geçerli bir YouTube bağlantısı girin.");
          const bolumler = [...kutu.querySelectorAll(".vBolum")].map(r => ({
            baslik: r.querySelector(".bBaslik").value.trim() || "Bölüm", bas: r.querySelector(".bBas").value.trim() || "0:00", durak: r.querySelector(".bDurak").value,
            soru: r.querySelector(".bSoru").value.trim(), secenekler: [...r.querySelectorAll(".bSec")].map(x => x.value.trim()), dogruIndeks: +r.querySelector(".bDogru").value,
          })).filter(b => /^\d+(:\d{1,2})?$/.test(b.bas));
          for (const b of bolumler) if (b.durak === "ozel" && (!b.soru || b.secenekler.some(x => !x))) return toast("Kendi sorunuz için soruyu ve dört şıkkı doldurun.");
          if (vid) DEPO.ayar.videolar[k] = { url, vid, baslik: kutu.querySelector(".vAd").value.trim(), bolumler }; else delete DEPO.ayar.videolar[k];
          DEPO.ayarKaydet(); toast("Kaydedildi."); veliPaneli("icerik");
        };
        const sil = kutu.querySelector(".vSil");
        if (sil) sil.onclick = () => { delete DEPO.ayar.videolar[k]; DEPO.ayarKaydet(); veliPaneli("icerik"); };
      });
    },
    ayar() {
      $("#aKaydet").onclick = () => {
        const pin = $("#aPin").value.trim();
        if (!/^\d{4,8}$/.test(pin)) return toast("Şifre 4–8 rakam olmalı.");
        Object.assign(DEPO.ayar, { ogrenciAdi: $("#aAd").value.trim() || DEPO.ayar.ogrenciAdi, gunlukHedefDk: Math.max(5, +$("#aHedef").value || 30), pin, oyunHepsiAcik: $("#aOyunAcik").checked });
        DEPO.ayarKaydet(); toast("Kaydedildi."); yonlendir();
      };
      $("#aUrlKaydet").onclick = () => { const u = $("#aUrl").value.trim(); if (u && !/^https:\/\//.test(u)) return toast("Adres https:// ile başlamalı."); DEPO.ayar.bulutUrl = u; DEPO.ayarKaydet(); toast("Adres kaydedildi."); };
      $("#aGonder").onclick = async () => { toast("Gönderiliyor…"); const r = await DEPO.gonder(); toast(r.ok ? r.n + " kayıt gönderildi." : "Gönderilemedi: " + r.neden); veliPaneli("ayar"); };
      $("#aCek").onclick = async () => { toast("Alınıyor…"); const r = await DEPO.cek(); toast(r.ok ? r.n + " yeni kayıt alındı." : "Alınamadı: " + r.neden); };
      $("#aKodKopyala").onclick = () => kopyala(APPS_SCRIPT);
      const sb = $("#aSunucuBaslat"); if (sb) sb.onclick = () => { const u = Android.sunucuBaslat(); if (!u) return toast("Sunucu başlatılamadı. Tableti yeniden başlatıp deneyin."); DEPO.tabletePaylas(true); if (/^http:\/\/:/.test(u)) toast("Tablet bir Wi‑Fi ağına bağlı görünmüyor."); veliPaneli("ayar"); };
      const sd = $("#aSunucuDurdur"); if (sd) sd.onclick = () => { Android.sunucuDurdur(); veliPaneli("ayar"); };
      $("#aDisa").onclick = () => kopyala(DEPO.disaAktar());
      $("#aDisaPaylas").onclick = () => paylas("Öğrenme Yolculuğu verileri", DEPO.disaAktar());
      $("#aIceAl").onclick = () => { try { const j = JSON.parse($("#aIce").value); toast(DEPO.iceAktar(j.olaylar) + " kayıt içe aktarıldı."); } catch (e) { toast("Metin okunamadı. Tamamını yapıştırdığınızdan emin olun."); } };
      $("#aSifir").onclick = () => { $("#aSifirOnay").hidden = false; };
      $("#aSifirHayir").onclick = () => { $("#aSifirOnay").hidden = true; };
      $("#aSifirEvet").onclick = async () => { await DEPO.sifirla(); toast("Kayıtlar silindi."); veliPaneli("ayar"); };
    },
  };

  window.UYG = { kacis, toast, git, konuVideolari };  // oyun.js için ortak araçlar
  window.TEST_DURUMU = () => durum.test;  // otomatik testler için salt okunur erişim

  /* ============================ BAŞLAT ============================ */
  DEPO.baslat().then(() => { yonlendir(); DEPO.gonder(); });
})();
