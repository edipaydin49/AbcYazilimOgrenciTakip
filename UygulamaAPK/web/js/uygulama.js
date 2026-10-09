/* Arayüz: öğrenci ekranları, test motoru, video anlatım takibi ve veli/admin paneli. */
(function () {
  "use strict";
  const { TEMALAR, KONULAR, KONU, KAZANIM, soruUret, yardim } = ICERIK;
  const { karistir, sec } = yardim;
  const $ = s => document.querySelector(s);
  const ana = $("#ana");
  const kacis = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const yuzde = x => (x == null ? "—" : "%" + Math.round(x * 100));
  const sn = ms => (ms == null ? "—" : (ms / 1000 < 60 ? Math.round(ms / 1000) + " sn" : Math.floor(ms / 60000) + " dk " + Math.round((ms % 60000) / 1000) + " sn"));
  const dk = d => (d == null ? "—" : d < 1 ? Math.round(d * 60) + " sn" : Math.round(d) + " dk");
  const tarih = t => new Date(t).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const durumEtiket = x => x == null ? '<span class="etiket">veri yok</span>' : x >= 0.8 ? `<span class="etiket iyi">${yuzde(x)} güçlü</span>` : x >= 0.6 ? `<span class="etiket orta">${yuzde(x)} gelişiyor</span>` : `<span class="etiket kotu">${yuzde(x)} tekrar</span>`;
  function toast(m) { const t = document.createElement("div"); t.className = "toast"; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); }
  function git(h) { if (location.hash === h) yonlendir(); else location.hash = h; }

  let veliAcik = false;
  let durum = {}; // ekranlar arası geçici durum (aktif test, sonuç...)

  /* ============================ YÖNLENDİRME ============================ */
  function yonlendir() {
    if (window.VIDEO_KAPAT) { window.VIDEO_KAPAT(); window.VIDEO_KAPAT = null; }
    window.scrollTo(0, 0);
    const [yol, a, b] = location.hash.replace(/^#\/?/, "").split("/");
    $("#ustAd").textContent = DEPO.ayar.ogrenciAdi ? "Öğrenme Yolculuğu · " + DEPO.ayar.ogrenciAdi : "Öğrenme Yolculuğu";
    ustDurum();
    if (!DEPO.ayar.kurulum) return kurulum();
    if (yol === "veli") return veliAcik ? veliPaneli(a || "ozet") : pinEkrani();
    veliAcik = false;
    ({ "": anaSayfa, konu: () => konuSayfasi(a), anlatim: () => anlatim(a), video: () => videoSayfasi(a), test: testEkrani,
      sonuc: sonucEkrani, gelisim: gelisimSayfasi, hatalar: hataDefteri, tema: () => temaSayfasi(a) }[yol] || anaSayfa)();
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

  /* ============================ KURULUM ============================ */
  function kurulum() {
    ana.innerHTML = `<section class="kart vurgu"><h1>Hoş geldin!</h1>
      <p>Bu uygulama 6. sınıf Matematik konularını anlatır, sorular sorar ve gelişimini kaydeder. İnternet olmadan da çalışır.</p>
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
    if (o.tur === "deneme") return `<button class="btn ana" data-test="deneme">Genel deneme</button>`;
    return `<button class="btn ana" data-test="${o.tur}" data-konu="${o.konu}">Başla</button>`;
  }
  function anaSayfa() {
    const h = ANALIZ.hesapla({});
    const hedef = DEPO.ayar.gunlukHedefDk, bugun = bugunDk();
    const o = ANALIZ.oneri(h);
    const vadesi = ANALIZ.tekrarPlani().filter(p => p.vadesi).filter((p, i, a) => a.findIndex(x => x.konu === p.konu) === i);
    const hataSay = hataListesi().length;
    ana.innerHTML = `
      <section class="kart vurgu">
        <div class="satir ara"><h1>Merhaba ${kacis(DEPO.ayar.ogrenciAdi)}!</h1><span class="etiket">${new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}</span></div>
        <div><div class="satir ara kucuk-yazi"><span>Bugünkü hedef: ${hedef} dakika</span><span class="sayac">${Math.round(bugun)} / ${hedef} dk</span></div>
        <div class="bar" style="margin-top:6px"><i style="width:${Math.min(100, 100 * bugun / hedef)}%;${bugun >= hedef ? "background:var(--good)" : ""}"></i></div></div>
        <div class="kart sari" style="padding:12px"><span class="kucuk-yazi muted">Sıradaki adım</span><p><b>${kacis(o.metin)}</b></p><div>${oneriButonu(o)}</div></div>
      </section>
      ${vadesi.length ? `<section class="kart"><h2>Tekrar zamanı</h2><p class="muted kucuk-yazi">Öğrendiklerini unutmamak için kısa tekrar testleri.</p>
        ${vadesi.map(p => `<div class="satir ara"><span>${KONU[p.konu].ad} · <b>${p.gun}. gün</b> tekrarı</span><button class="btn kucuk" data-test="tekrar${p.gun}" data-konu="${p.konu}">Başla</button></div>`).join("")}</section>` : ""}
      ${TEMALAR.map(t => `<section class="kart">
        <div class="satir ara"><div><span class="etiket">${t.kisa}</span><h2 style="margin-top:4px">${t.ad}</h2></div></div>
        <div class="satir"><button class="btn kucuk" data-test="hazir" data-tema="${t.id}">Hazır mıyız?</button>
          <button class="btn kucuk" data-test="izleme" data-tema="${t.id}">İzleme testi</button>
          <button class="btn kucuk" data-test="tema" data-tema="${t.id}">Ölçme ve değerlendirme</button></div>
        <div style="display:grid;gap:8px">${t.konular.map(k => { const ks = h.konuOzet[k]; const u = ortUstalik(h, k);
          return `<button class="konu-satir" data-git="#/konu/${k}"><span><b>${KONU[k].ad}</b><br><span class="kucuk-yazi muted">${ks.konuSonu ? "Konu sonu: " + yuzde(ks.konuSonu.son) : ks.n ? ks.n + " soru çözüldü" : "Başlanmadı"}</span></span>
            <span><span class="kucuk-yazi muted">${u == null ? "—" : yuzde(u)}</span><span class="bar" style="display:block"><i style="width:${u == null ? 0 : u * 100}%"></i></span></span></button>`; }).join("")}</div>
      </section>`).join("")}
      <section class="izgara dar">
        <button class="btn ana" data-test="deneme">Genel deneme (20 soru)</button>
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
    ana.querySelectorAll("[data-test]").forEach(b => b.onclick = () => testBaslat(b.dataset.test, { konu: b.dataset.konu, tema: b.dataset.tema, kendiIstegi: b.dataset.kendi === "1" }));
  }

  /* ============================ KONU SAYFASI ============================ */
  function konuSayfasi(id) {
    const k = KONU[id]; if (!k) return anaSayfa();
    const h = ANALIZ.hesapla({ konu: id });
    const ks = h.konuOzet[id];
    const v = DEPO.ayar.videolar[id];
    ana.innerHTML = `
      <section class="kart vurgu"><span class="etiket">${TEMALAR.find(t => t.id === k.tema).ad}</span><h1>${k.ad}</h1>
        ${k.onKosul ? `<p class="kucuk-yazi muted">Bu konu şunlarla bağlantılı: ${k.onKosul.map(x => KONU[x].ad).join(", ")}</p>` : ""}
        <div class="izgara dar">
          <a class="btn ${ks.anlatim ? "" : "ana"}" href="#/anlatim/${id}">1. Konu anlatımı${ks.anlatim && ks.anlatim.bitti ? " ✓" : ""}</a>
          ${v && v.vid ? `<a class="btn" href="#/video/${id}">Video anlatım${ks.video ? " · " + yuzde(ks.video.tamamlama) : ""}</a>` : `<span class="btn" style="opacity:.55" title="Veli panelinden video eklenebilir">Video eklenmemiş</span>`}
          <button class="btn ${ks.anlatim && !ks.n ? "ana" : ""}" data-test="alistirma" data-konu="${id}">2. Alıştırma (10)</button>
          <button class="btn" data-test="konuSonu" data-konu="${id}">3. Konu sonu testi (12)</button>
          <button class="btn" data-test="kendi" data-konu="${id}" data-kendi="1">Kendi tekrarım (6)</button>
        </div></section>
      <section class="kart"><h2>Kazanımlarım</h2>
        ${k.kazanimlar.map(z => { const x = h.kazanim[z.id]; return `<div style="display:grid;gap:4px"><div class="satir ara"><span>${z.ad}</span>${durumEtiket(x.ustalik)}</div>
          <div class="bar"><i style="width:${(x.ustalik || 0) * 100}%"></i></div><span class="kucuk-yazi muted">${x.cevaplanan} soru · güven: ${x.guven.ad}</span></div>`; }).join("")}
      </section>`;
    baglaOrtak();
  }

  /* ============================ METİN ANLATIM (akıllı konu durakları) ============================ */
  function anlatim(id) {
    const k = KONU[id]; if (!k) return anaSayfa();
    const kayit = DEPO.kaydet("anlatim", { konu: id, okunan: 0, toplam: k.anlatim.length, bitti: false });
    let i = 0, cevap = null, bas = Date.now(), sira = null;
    function ciz() {
      const s = k.anlatim[i];
      if (!sira) sira = karistir([0, 1, 2, 3]);
      const d = s.durak;
      ana.innerHTML = `<section class="kart vurgu">
        <div class="satir ara"><span class="etiket">${k.ad} · ${i + 1} / ${k.anlatim.length}</span><a class="btn kucuk" href="#/konu/${id}">Konuya dön</a></div>
        <div class="ilerleme">${k.anlatim.map((_, j) => `<i class="${j < i ? "d" : j === i ? "s" : ""}"></i>`).join("")}</div>
        <h1>${s.baslik}</h1><p style="font-size:1.1rem">${s.metin}</p>
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
        DEPO.kaydet("durak", { konu: id, kaynak: "metin", bolum: i, dogru: !!d.secenekler[cevap][1], sure: Date.now() - bas });
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

  function videoSayfasi(id) {
    const k = KONU[id], v = DEPO.ayar.videolar[id];
    if (!k || !v || !v.vid) return konuSayfasi(id);
    const bolumler = (v.bolumler && v.bolumler.length ? v.bolumler : [{ baslik: "Anlatım", bas: "0:00", durak: "oto" }]).map(b => ({ ...b, sn: saniye(b.bas) })).sort((a, b) => a.sn - b.sn);
    ana.innerHTML = `<section class="kart vurgu"><div class="satir ara"><h1>${k.ad} · video</h1><a class="btn kucuk" href="#/konu/${id}">Konuya dön</a></div>
      <div class="video-kutu"><div id="oynatici"></div></div><p id="vDurum" class="kucuk-yazi muted">Video yükleniyor…</p></section>
      <section class="kart"><h2>Bölümler</h2><div id="bolumListe" style="display:grid;gap:8px">${bolumler.map((b, i) => `<button class="konu-satir" data-b="${i}"><span><b>${i + 1}. ${kacis(b.baslik)}</b><br><span class="kucuk-yazi muted">${zaman(b.sn)}${b.durak && b.durak !== "yok" ? " · bölüm sonunda soru" : ""}</span></span><span class="kucuk-yazi muted" id="bd${i}"></span></button>`).join("")}</div></section>`;
    if (!navigator.onLine) { $("#vDurum").innerHTML = "Video için internet bağlantısı gerekiyor. <a href='#/anlatim/" + id + "'>Metin anlatıma geç</a>."; return; }

    // Benzersiz izlenen saniyeler bu cihazda video bazında birikir (tamamlama oranı için).
    const izAnahtar = "izlenen:" + v.vid;
    let izlenen = new Set(); try { izlenen = new Set(JSON.parse(localStorage.getItem(izAnahtar) || "[]")); } catch (e) {}
    const kayit = DEPO.kaydet("video", { konu: id, vid: v.vid, toplam: 0, izlenen: izlenen.size, oynatilan: 0, geriSarma: 0, ileriSarma: 0, duraklatma: 0, bolumAcma: {}, bitti: false });
    let oyn = null, onceki = null, aktifBolum = -1, durakta = false, sistemDuraklatti = false, zamanlayici = null, kaydetSayac = 0;
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
      if (b.durak === "ozel" && b.soru) q = { soru: b.soru, secenekler: b.secenekler.map((m, j) => ({ m, dogru: j === +b.dogruIndeks, neden: "" })), cozum: [] };
      else { const kz = k.kazanimlar[bi % k.kazanimlar.length].id; q = soruUret(kz, 1); }
      const sira = karistir(q.secenekler.map((_, j) => j));
      const perde = document.createElement("div"); perde.className = "perde";
      perde.innerHTML = `<div class="kart"><span class="etiket">Bölüm ${bi + 1} bitti · kısa soru</span><p class="soru-metin">${q.soru}</p>
        <div class="secenekler">${sira.map((o, j) => `<button class="sec" data-o="${o}"><b>${"ABCD"[j]}</b><span>${kacis(q.secenekler[o].m)}</span></button>`).join("")}</div><div id="dSonuc"></div></div>`;
      document.body.appendChild(perde);
      const bas = Date.now();
      perde.querySelectorAll("[data-o]").forEach(btn => btn.onclick = () => {
        const s = q.secenekler[+btn.dataset.o];
        perde.querySelectorAll("[data-o]").forEach(x => { x.disabled = true; const o = q.secenekler[+x.dataset.o]; if (o.dogru) x.classList.add("dogru"); else if (x === btn) x.classList.add("yanlis"); });
        DEPO.kaydet("durak", { konu: id, kaynak: "video", bolum: bi, dogru: !!s.dogru, sure: Date.now() - bas });
        cevaplananDurak.add(bi);
        perde.querySelector("#dSonuc").innerHTML = `<div class="geri ${s.dogru ? "iyi" : "kotu"}"><b>${s.dogru ? "Doğru!" : "Bu doğru değil."}</b>${s.neden ? `<p>${s.neden}</p>` : ""}</div>
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
    ana.querySelectorAll("[data-b]").forEach(btn => btn.onclick = () => { if (!oyn || !oyn.seekTo) return; const i = +btn.dataset.b; oyn.seekTo(bolumler[i].sn, true); oyn.playVideo(); window.scrollTo(0, 0); });

    ytYukle().then(() => {
      oyn = new YT.Player("oynatici", {
        videoId: v.vid, host: "https://www.youtube-nocookie.com",
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1, origin: location.origin, fs: 1 },
        events: {
          onReady: () => { DEPO.guncelle(kayit, { toplam: Math.round(oyn.getDuration()) }); $("#vDurum").textContent = "Videoyu başlatmak için oynat düğmesine dokun. Her bölümün sonunda kısa bir soru gelecek."; zamanlayici = setInterval(tik, 1000); },
          onStateChange: e => {
            if (e.data === 2) { if (!sistemDuraklatti && !durakta) DEPO.guncelle(kayit, { duraklatma: kayit.duraklatma + 1 }); sistemDuraklatti = false; window.VIDEO_OYNUYOR = false; }
            if (e.data === 0) { window.VIDEO_OYNUYOR = false; const son = bolumler.length - 1; if (!cevaplananDurak.has(son) && bolumler[son].durak !== "yok") durakSor(son); DEPO.guncelle(kayit, { bitti: true }); kaydetVideo(); }
            if (e.data === 1) { if (!kayit.toplam) DEPO.guncelle(kayit, { toplam: Math.round(oyn.getDuration()) }); }
          },
          onError: e => { $("#vDurum").innerHTML = `Bu video uygulama içinde oynatılamıyor (hata ${e.data}). Video sahibi gömülü oynatmayı kapatmış olabilir; veli panelinden başka bir video bağlantısı deneyin. <a href="#/anlatim/${id}">Metin anlatıma geç</a>.`; },
        },
      });
    }).catch(() => { $("#vDurum").innerHTML = "YouTube oynatıcısı yüklenemedi. İnternet bağlantınızı kontrol edin. <a href='#/anlatim/" + id + "'>Metin anlatıma geç</a>."; });
  }

  /* ============================ TEST MOTORU ============================ */
  const TEST_AD = { alistirma: "Alıştırma", konuSonu: "Konu sonu testi", kendi: "Kendi tekrarım", hazir: "Hazır mıyız?", izleme: "İzleme testi", tema: "Ölçme ve değerlendirme", deneme: "Genel deneme sınavı", hata: "Hata defteri tekrarı", tekrar1: "1. gün tekrar testi", tekrar3: "3. gün tekrar testi", tekrar7: "7. gün tekrar testi", tekrar30: "30. gün kalıcılık testi" };
  const KENDI_HATA = [["bilgi", "Konuyu bilmiyordum"], ["kavrama", "Soruyu yanlış anladım"], ["islem", "İşlem hatası yaptım"], ["dikkat", "Dikkatsizlik yaptım"], ["strateji", "Acele ettim / yol bulamadım"]];

  function kazanimSec(liste, h) {
    // Zayıf kazanımlara daha fazla ağırlık ver (uyarlanabilir seçim)
    const agirlik = liste.map(id => { const x = h.kazanim[id]; return x && x.ustalik != null ? 1.4 - x.ustalik : 1.2; });
    let r = Math.random() * agirlik.reduce((a, b) => a + b, 0);
    for (let i = 0; i < liste.length; i++) { r -= agirlik[i]; if (r <= 0) return liste[i]; }
    return liste[liste.length - 1];
  }
  function temaKazanimlari(tema) { return KONULAR.filter(k => !tema || k.tema === tema).flatMap(k => k.kazanimlar.map(z => z.id)); }

  function testBaslat(tur, { konu, tema, kendiIstegi } = {}) {
    const h = ANALIZ.hesapla({});
    let plan = [];   // { kaz, zorluk } ya da { hazir: soru }
    const konuKaz = konu ? KONU[konu].kazanimlar.map(z => z.id) : [];
    if (tur === "alistirma") plan = Array.from({ length: 10 }, () => ({ kaz: null, uyarla: true }));
    else if (tur === "konuSonu") { const z = [1, 2, 3, 2, 1, 3, 2, 2, 3, 1, 2, 3]; plan = z.map((zz, i) => ({ kaz: konuKaz[i % konuKaz.length], zorluk: zz })); }
    else if (tur === "kendi" || tur.startsWith("tekrar")) plan = Array.from({ length: 6 }, (_, i) => ({ kaz: konuKaz[i % konuKaz.length], zorluk: i < 2 ? 1 : 2 }));
    else if (tur === "hazir") { const l = temaKazanimlari(tema); plan = karistir(l).slice(0, 6).map(k => ({ kaz: k, zorluk: 1 })); }
    else if (tur === "izleme") { const l = temaKazanimlari(tema); plan = Array.from({ length: 8 }, (_, i) => ({ kaz: l[i % l.length], zorluk: 2 })); plan = karistir(plan); }
    else if (tur === "tema") { const l = temaKazanimlari(tema); plan = karistir(Array.from({ length: 15 }, (_, i) => ({ kaz: l[i % l.length], zorluk: i % 3 === 0 ? 3 : 2 }))); }
    else if (tur === "deneme") { const l = temaKazanimlari(null); plan = karistir(l).slice(0, 20).map((k, i) => ({ kaz: k, zorluk: [1, 2, 2, 3][i % 4] })); }
    else if (tur === "hata") { plan = karistir(hataListesi()).slice(0, 10).map(o => ({ hazir: o.soruNesnesi, ref: o.id })); DEPO.kaydet("hataDefteri", {}); }
    if (!plan.length) { toast("Bu test için soru bulunamadı."); return; }
    durum.test = {
      tur, konu: konu || null, tema: tema || (konu ? KONU[konu].tema : null), kendiIstegi: !!kendiIstegi || tur === "kendi",
      sinav: tur === "deneme", testId: DEPO.uid(), plan, i: 0, sonuclar: [], bas: Date.now(), seri: 0, zorlukKaydir: 0,
      sure: tur === "deneme" ? 30 * 60 * 1000 : null, konuKaz,
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
      konu: s.q.konu, tema: s.q.tema, kaz: s.q.kaz, duzey: s.q.duzey, zorluk: s.q.zorluk, mod: t.tur, testId: t.testId,
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
      if (s.bitti && s.sonSecim != null && q.secenekler[s.sonSecim].dogru) {
        geri = `<div class="geri iyi"><b>${s.deneme === 1 ? sec(["Harika, doğru!", "Tam isabet!", "Çok iyi!"]) : "Düzelttin, aferin!"}</b>${q.secenekler[dogruIdx].neden ? `<p>${kacis(q.secenekler[dogruIdx].neden)}</p>` : ""}</div>`;
      } else {
        geri = `<div class="geri kotu"><b>Bu cevap doğru değil.</b>${ilk && ilk.neden ? `<p>${kacis(ilk.neden)}</p>` : ""}</div>`;
        if (!s.bitti) geri += `<div class="kart" style="padding:12px"><span class="kucuk-yazi"><b>Sence neden yanlış yaptın?</b> (isteğe bağlı)</span>
          <div class="cips">${KENDI_HATA.map(([k, a]) => `<button class="cip ${s.kendiHata === k ? "secili" : ""}" data-kh="${k}">${a}</button>`).join("")}</div>
          <div class="satir"><button class="btn ana" id="tekrarDene">Tekrar dene</button><button class="btn" id="cozumGor">Çözümü gör</button></div></div>`;
      }
      if (s.cozum || (s.bitti && !(s.sonSecim != null && q.secenekler[s.sonSecim].dogru))) {
        geri += `<div class="geri bilgi cozum"><b>Adım adım çözüm</b><ol>${q.cozum.map(c => `<li>${kacis(c)}</li>`).join("")}</ol><p><b>Doğru cevap:</b> ${"ABCD"[dogruIdx]}) ${kacis(q.secenekler[dogruIdx].m)}</p></div>`;
      }
    }
    const kalan = t.sure ? t.sure - (Date.now() - t.bas) : null;
    ana.innerHTML = `<section class="kart vurgu">
      <div class="satir ara"><span class="etiket">${TEST_AD[t.tur]}${t.konu ? " · " + KONU[t.konu].ad : t.tema ? " · " + TEMALAR.find(x => x.id === t.tema).kisa : ""}</span>
        <span class="sayac">${t.sinav ? `<span id="kalanSure">${sn(kalan)}</span> · ` : ""}${t.i + 1} / ${toplam}</span></div>
      <div class="ilerleme">${ilerleme}</div>
      ${s.kontrol ? `<span class="etiket orta">Çözümünü gördüğün soruya benzer yeni bir soru</span>` : ""}
      <p class="soru-metin">${q.soru}</p>
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
    const test = DEPO.kaydet("test", { testId: t.testId, tur: t.tur, konu: t.konu, tema: t.tema, n: asil.length, dogru, sure: Date.now() - t.bas, oz: null, kendiIstegi: t.kendiIstegi });
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
    ana.innerHTML = `<section class="kart vurgu" style="text-align:center"><span class="etiket">${TEST_AD[t.tur]}</span>
      <p style="font-size:3rem;font-weight:800;line-height:1">${test.dogru} / ${test.n}</p><h2>${mesaj}</h2>
      <p class="muted">Süre: ${sn(test.sure)} · İlk denemede doğru: ${yuzde(oranD)}</p></section>
      <section class="kart"><h2>Bu çalışmada kendini nasıl değerlendiriyorsun?</h2>
        <div class="cips">${[[1, "Hiç anlamadım"], [2, "Zorlandım"], [3, "Fena değil"], [4, "İyiydim"], [5, "Çok iyiydim"]].map(([v, a]) => `<button class="cip ${test.oz === v ? "secili" : ""}" data-oz="${v}">${a}</button>`).join("")}</div></section>
      <section class="kart"><h2>Kazanımlara göre</h2>${Object.entries(kazSonuc).sort((a, b) => a[1].d / a[1].n - b[1].d / b[1].n).map(([k, x]) => `<div class="satir ara"><span>${KAZANIM[k].ad}</span>${durumEtiket(x.d / x.n)}</div>`).join("")}
        ${enCokHata ? `<div class="geri bilgi"><b>En sık hata türün: ${HATA_AD[enCokHata[0]]}</b><p>${HATA_ONERI[enCokHata[0]]}</p></div>` : ""}</section>
      ${t.sinav ? `<section class="kart"><h2>Sınav cevapları</h2>${t.sinavSorulari.map((s, j) => { const d = s.q.secenekler.findIndex(x => x.dogru); const ok = s.sinavSecim === d;
        return `<details><summary>${j + 1}. ${ok ? "✓ Doğru" : s.sinavSecim == null ? "— Boş" : "✗ Yanlış"} · ${KAZANIM[s.q.kaz].ad}</summary><p>${s.q.soru}</p><p><b>Doğru cevap:</b> ${kacis(s.q.secenekler[d].m)}</p>${s.sinavSecim != null && !ok ? `<p class="muted">Senin cevabın: ${kacis(s.q.secenekler[s.sinavSecim].m)} — ${kacis(s.q.secenekler[s.sinavSecim].neden)}</p>` : ""}<ol>${s.q.cozum.map(c => `<li>${kacis(c)}</li>`).join("")}</ol></details>`; }).join("")}</section>` : ""}
      <section class="izgara dar">
        ${t.konu ? `<a class="btn" href="#/konu/${t.konu}">Konuya dön</a>` : ""}
        ${t.konu && oranD < 0.7 ? `<a class="btn" href="#/anlatim/${t.konu}">Anlatımı tekrar oku</a>` : ""}
        <a class="btn ana" href="#/">Ana sayfa</a></section>`;
    ana.querySelectorAll("[data-oz]").forEach(b => b.onclick = () => { DEPO.guncelle(test, { oz: +b.dataset.oz }); sonucEkrani(); toast("Teşekkürler!"); });
  }

  /* ============================ HATA DEFTERİ ============================ */
  function hataListesi() {
    const sorular = DEPO.liste("soru");
    const duzeltilen = new Set(sorular.filter(s => s.ref && s.ilkDogru).map(s => s.ref));
    return sorular.filter(s => !s.ref && !s.kontrol && !s.terk && !s.ilkDogru && s.soruNesnesi && !duzeltilen.has(s.id));
  }
  function hataDefteri() {
    const l = hataListesi();
    ana.innerHTML = `<section class="kart vurgu"><h1>Hata defterim</h1><p>Yanlış yaptığın sorular burada toplanır. Bir soruyu doğru çözdüğünde defterden silinir.</p>
      <button class="btn ana" data-test="hata" ${l.length ? "" : "disabled"}>${l.length ? Math.min(10, l.length) + " soruyu tekrar çöz" : "Defterin boş, harika!"}</button></section>
      ${l.length ? `<section class="kart"><h2>Konulara göre</h2>${Object.entries(l.reduce((a, s) => { a[s.konu] = (a[s.konu] || 0) + 1; return a; }, {})).map(([k, n]) => `<div class="satir ara"><span>${KONU[k].ad}</span><span class="etiket kotu">${n} soru</span></div>`).join("")}</section>` : ""}`;
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

  /* ============================ ÖĞRENCİ PANELİ: GELİŞİMİM ============================ */
  function gelisimSayfasi() {
    const h = ANALIZ.hesapla({});
    const gz = ANALIZ.gucluZayif(h);
    const seri = ANALIZ.gunlukSeri(14);
    const o = ANALIZ.oneri(h);
    ana.innerHTML = `<section class="kart vurgu"><h1>Gelişimim</h1>
      <div class="izgara dar">
        <div class="metrik"><b>${Math.round(bugunDk())} / ${DEPO.ayar.gunlukHedefDk} dk</b><span>bugünkü çalışma</span></div>
        <div class="metrik"><b>${h.genel.cevaplanan}</b><span>çözülen soru</span></div>
        <div class="metrik"><b>${yuzde(h.genel.ilkDeneme)}</b><span>ilk denemede doğru</span></div>
        <div class="metrik"><b>${h.calisma.tamamlananKonu} / ${KONULAR.length}</b><span>tamamlanan konu</span></div>
      </div></section>
      <section class="kart"><h2>Son 14 gün başarım</h2>${seri.some(s => s.basari != null) ? cizgiGrafik(seri.map(s => ({ ad: gunAdi(s.gun), v: s.basari, n: s.n }))) : '<p class="muted">Soru çözdükçe grafiğin burada oluşacak.</p>'}</section>
      <section class="izgara">
        <div class="kart"><h2>Güçlü olduğum konular</h2>${gz.guclu.length ? gz.guclu.map(([, x]) => `<div class="satir ara"><span>${x.ad}</span>${durumEtiket(x.ilkDeneme)}</div>`).join("") : '<p class="muted">Henüz yeterli veri yok.</p>'}</div>
        <div class="kart"><h2>Tekrar etmem gerekenler</h2>${gz.zayif.length ? gz.zayif.map(([, x]) => `<div class="satir ara"><span>${x.ad}</span>${durumEtiket(x.ilkDeneme)}</div>`).join("") : '<p class="muted">Şu an tekrar gerektiren konu yok.</p>'}</div>
      </section>
      <section class="kart"><h2>Konu bazlı gelişim</h2>${KONULAR.map(k => { const u = ortUstalik(h, k.id); return `<div style="display:grid;gap:4px"><div class="satir ara"><span>${k.ad}</span><span class="kucuk-yazi muted">${u == null ? "başlanmadı" : yuzde(u)}</span></div><div class="bar"><i style="width:${(u || 0) * 100}%"></i></div></div>`; }).join("")}</section>
      <section class="kart sari"><h2>Sonraki çalışma önerisi</h2><p>${kacis(o.metin)}</p><div>${oneriButonu(o)}</div></section>`;
    baglaOrtak();
  }
  function temaSayfasi() { anaSayfa(); }

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

  const SEKMELER = [["ozet", "Veli özeti"], ["kazanim", "Kazanım haritası"], ["soru", "Soru analizi"], ["anlatim", "Anlatım ve video"], ["tekrar", "Aralıklı tekrar"], ["calisma", "Çalışma alışkanlığı"], ["kayit", "Soru kayıtları"], ["icerik", "Videolar"], ["ayar", "Ayarlar ve eşitleme"]];
  let aralik = 7;
  function veliPaneli(sekme) {
    const h = ANALIZ.hesapla({ gun: aralik || null });
    const ust = `<section class="kart vurgu"><div class="satir ara"><h1>Veli paneli · ${kacis(DEPO.ayar.ogrenciAdi)}</h1>
      <span class="satir">${[[7, "Son 7 gün"], [30, "Son 30 gün"], [0, "Tümü"]].map(([g, a]) => `<button class="sekme ${aralik === g ? "aktif" : ""}" data-aralik="${g}">${a}</button>`).join("")}</span></div>
      <nav class="sekmeler">${SEKMELER.map(([k, a]) => `<a class="sekme ${k === sekme ? "aktif" : ""}" href="#/veli/${k}">${a}</a>`).join("")}</nav>
      <p class="kucuk-yazi muted">Güven düzeyi: her değerin yanında kaç soruya dayandığı yazar. 5'ten az soru = düşük güven, 15 ve üzeri = yüksek güven.</p></section>`;
    const icerik = { ozet: veliOzet, kazanim: veliKazanim, soru: veliSoru, anlatim: veliAnlatim, tekrar: veliTekrar, calisma: veliCalisma, kayit: veliKayit, icerik: veliVideolar, ayar: veliAyar }[sekme] || veliOzet;
    ana.innerHTML = ust + icerik(h);
    ana.querySelectorAll("[data-aralik]").forEach(b => b.onclick = () => { aralik = +b.dataset.aralik; veliPaneli(sekme); });
    if (VELI_BAGLA[sekme]) VELI_BAGLA[sekme]();
  }
  const metrik = (deger, ad, not) => `<div class="metrik"><b>${deger}</b><span>${ad}</span>${not ? `<small>${not}</small>` : ""}</div>`;

  function haftaKarsilastir() {
    const simdi = Date.now(), G = ANALIZ.GUN;
    const parca = (bas, son) => {
      const s = DEPO.liste("soru").filter(x => x.t >= bas && x.t < son && !x.terk);
      return { dk: DEPO.liste("oturum").filter(o => o.t >= bas && o.t < son).reduce((a, o) => a + o.aktifSn, 0) / 60, soru: s.length,
        basari: s.length ? s.filter(x => x.ilkDogru).length / s.length : null, test: DEPO.liste("test").filter(x => x.t >= bas && x.t < son).length };
    };
    return { bu: parca(simdi - 7 * G, simdi), onceki: parca(simdi - 14 * G, simdi - 7 * G) };
  }
  const fark = (a, b, f = x => Math.round(x)) => (a == null || b == null ? "" : (a - b >= 0 ? "▲ " : "▼ ") + f(Math.abs(a - b)) + " önceki haftaya göre");

  function veliOzet(h) {
    const hk = haftaKarsilastir();
    const gz = ANALIZ.gucluZayif(h);
    const seri = ANALIZ.gunlukSeri(14);
    const hataSirali = Object.entries(h.hataSay).sort((a, b) => b[1] - a[1]);
    const tamam = ICERIK.KONULAR.filter(k => h.konuOzet[k.id].konuSonu);
    return `<section class="izgara dar">
        ${metrik(dk(hk.bu.dk), "bu hafta çalışma", fark(hk.bu.dk, hk.onceki.dk, x => Math.round(x) + " dk"))}
        ${metrik(hk.bu.soru, "bu hafta çözülen soru", fark(hk.bu.soru, hk.onceki.soru))}
        ${metrik(yuzde(hk.bu.basari), "bu hafta ilk deneme başarısı", fark(hk.bu.basari, hk.onceki.basari, x => "%" + Math.round(x * 100)))}
        ${metrik(hk.bu.test, "bu hafta tamamlanan test", fark(hk.bu.test, hk.onceki.test))}
      </section>
      <section class="kart"><h2>Zaman içindeki gelişim (ilk deneme başarısı)</h2>${cizgiGrafik(seri.map(s => ({ ad: gunAdi(s.gun), v: s.basari, n: s.n })))}</section>
      <section class="kart"><h2>Günlük çalışma süresi (dakika)</h2>${sutunGrafik(seri.map(s => ({ ad: gunAdi(s.gun), v: Math.round(s.dk) })), { hedef: DEPO.ayar.gunlukHedefDk })}</section>
      <section class="izgara">
        <div class="kart"><h2>Tamamlanan konular</h2>${tamam.length ? tamam.map(k => `<div class="satir ara"><span>${k.ad}</span>${durumEtiket(h.konuOzet[k.id].konuSonu.son)}</div>`).join("") : '<p class="muted">Bu aralıkta tamamlanan konu sonu testi yok.</p>'}</div>
        <div class="kart"><h2>Evde desteklenebilecek alanlar</h2>
          ${gz.zayif.length ? gz.zayif.slice(0, 3).map(([, x]) => `<div class="satir ara"><span>${x.ad}</span>${durumEtiket(x.ilkDeneme)}</div>`).join("") : '<p class="muted">Belirgin bir zayıf alan görünmüyor.</p>'}
          ${hataSirali.length ? `<div class="geri bilgi"><b>En sık hata türü: ${HATA_AD[hataSirali[0][0]]} (${hataSirali[0][1]} kez)</b><p>${HATA_ONERI[hataSirali[0][0]]}</p></div>` : ""}</div>
      </section>
      <section class="kart"><h2>Haftalık özet raporu</h2><p class="muted kucuk-yazi">Raporu WhatsApp, e-posta ya da SMS ile paylaşabilirsiniz.</p>
        <div class="satir"><button class="btn ana" id="raporPaylas">Raporu paylaş</button><button class="btn" id="raporKopyala">Panoya kopyala</button></div></section>`;
  }
  function raporMetni() {
    const h = ANALIZ.hesapla({ gun: 7 }); const hk = haftaKarsilastir(); const gz = ANALIZ.gucluZayif(h);
    const hs = Object.entries(h.hataSay).sort((a, b) => b[1] - a[1])[0];
    return [`Öğrenme Yolculuğu – ${DEPO.ayar.ogrenciAdi} – haftalık rapor (${new Date().toLocaleDateString("tr-TR")})`,
      `Çalışma: ${dk(hk.bu.dk)} (önceki hafta ${dk(hk.onceki.dk)}), hedef günde ${DEPO.ayar.gunlukHedefDk} dk`,
      `Çözülen soru: ${hk.bu.soru}, ilk deneme başarısı: ${yuzde(hk.bu.basari)} (önceki hafta ${yuzde(hk.onceki.basari)})`,
      `Ortalama çözüm süresi: ${sn(h.genel.ortSure)}, ipucusuz çözme: ${yuzde(h.genel.ipucusuzCozme)}, yanlıştan sonra düzeltme: ${yuzde(h.genel.duzeltme)}`,
      `Güçlü: ${gz.guclu.map(([, x]) => x.ad).join(", ") || "—"}`, `Tekrar gereken: ${gz.zayif.map(([, x]) => x.ad).join(", ") || "—"}`,
      hs ? `En sık hata türü: ${HATA_AD[hs[0]]}. Öneri: ${HATA_ONERI[hs[0]]}` : "", `Tamamlanan konu sayısı: ${h.calisma.tamamlananKonu}`].filter(Boolean).join("\n");
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

  function veliKazanim(h) {
    return TEMALAR.map(t => `<section class="kart"><h2>${t.kisa} · ${t.ad}</h2><div class="tablo"><table>
      <thead><tr><th>Konu / kazanım</th><th class="sayi">İlk deneme</th><th class="sayi">Son deneme</th><th class="sayi">Ort. süre</th><th class="sayi">Soru</th><th>Güven</th><th>Durum</th></tr></thead><tbody>
      ${t.konular.map(k => `<tr><td colspan="7"><b>${KONU[k].ad}</b></td></tr>` + KONU[k].kazanimlar.map(z => { const x = h.kazanim[z.id];
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
      <section class="kart"><h2>Kolay, orta ve zor sorulardaki başarı</h2>
        ${[1, 2, 3].map(z => `<div style="display:grid;gap:4px"><div class="satir ara"><span>${["", "Kolay", "Orta", "Zor"][z]}</span><span class="kucuk-yazi">${yuzde(h.zorluk[z].basari)} · ${h.zorluk[z].n} soru</span></div><div class="bar"><i style="width:${(h.zorluk[z].basari || 0) * 100}%"></i></div></div>`).join("")}</section>
      <section class="kart"><h2>Bilişsel düzeylere göre başarı</h2>
        ${Object.entries(duzeyAd).map(([k, a]) => `<div style="display:grid;gap:4px"><div class="satir ara"><span>${a}</span><span class="kucuk-yazi">${yuzde(h.duzey[k].basari)} · ${h.duzey[k].n} soru · güven ${ANALIZ.guven(h.duzey[k].n).ad}</span></div><div class="bar"><i style="width:${(h.duzey[k].basari || 0) * 100}%"></i></div></div>`).join("")}</section>
      <section class="kart"><h2>Hata türleri ve öneriler</h2><p class="muted kucuk-yazi">Sistemin tespiti: öğrencinin seçtiği yanlış şıkkın türü. Öğrencinin beyanı: “Neden yanlış yaptın?” sorusuna verdiği cevap.</p>
        <div class="tablo"><table><thead><tr><th>Hata türü</th><th class="sayi">Sistem tespiti</th><th class="sayi">Öğrenci beyanı</th><th>Öneri</th></tr></thead><tbody>
        ${Object.keys(HATA_AD).map(k => `<tr><td><b>${HATA_AD[k]}</b></td><td class="sayi">${h.hataSay[k] || 0}${toplamHata ? " (" + yuzde((h.hataSay[k] || 0) / toplamHata) + ")" : ""}</td><td class="sayi">${h.kendiSay[k] || 0}</td><td>${HATA_ONERI[k]}</td></tr>`).join("")}
        </tbody></table></div>
        ${h.tekrarEdenHata.length ? `<h3>Tekrar eden hatalar</h3>${h.tekrarEdenHata.slice(0, 6).map(x => `<div class="satir ara"><span>${KAZANIM[x.kaz].ad}</span><span class="etiket kotu">${HATA_AD[x.hata]} · ${x.n} kez</span></div>`).join("")}` : ""}</section>
      <section class="kart"><h2>Test türlerine göre</h2><div class="tablo"><table><thead><tr><th>Test</th><th class="sayi">Sayı</th><th class="sayi">Başarı</th></tr></thead><tbody>
        ${Object.entries(h.testTur).map(([k, x]) => `<tr><td>${{ tekrar: "Aralıklı tekrar testleri", ...TEST_AD }[k] || k}</td><td class="sayi">${x.sayi}</td><td class="sayi">${yuzde(x.n ? x.dogru / x.n : null)}</td></tr>`).join("") || '<tr><td colspan="3" class="muted">Henüz test yok.</td></tr>'}
      </tbody></table></div></section>`;
  }

  function veliAnlatim(h) {
    return `<section class="kart"><h2>Anlatım ve video takibi</h2><p class="muted kucuk-yazi">Tamamlama: izlenen benzersiz süre / toplam süre. Aktif izleme: gerçekten oynatılan süre / toplam süre (tekrar izlemeler dahil, %100'ü geçebilir).</p>
      <div class="tablo"><table><thead><tr><th>Konu</th><th>Metin anlatım</th><th class="sayi">Video tamamlama</th><th class="sayi">Aktif izleme</th><th class="sayi">Geri sarma</th><th class="sayi">Duraklatma</th><th>Tekrar açılan bölümler</th><th class="sayi">Konu durağı başarısı</th></tr></thead><tbody>
      ${KONULAR.map(k => { const x = h.konuOzet[k.id], v = x.video, bl = (DEPO.ayar.videolar[k.id] || {}).bolumler || [];
        return `<tr><td><b>${k.ad}</b></td><td>${x.anlatim ? (x.anlatim.bitti ? "Tamamlandı" : x.anlatim.okunan + " / " + x.anlatim.toplam) : "—"}</td>
          <td class="sayi">${v ? yuzde(v.tamamlama) : "—"}</td><td class="sayi">${v ? yuzde(v.aktif) : "—"}</td><td class="sayi">${v ? v.geriSarma : "—"}</td><td class="sayi">${v ? v.duraklatma : "—"}</td>
          <td>${v && v.tekrarlananBolumler.length ? v.tekrarlananBolumler.map(i => (bl[i] ? kacis(bl[i].baslik) : "Bölüm " + (i + 1)) + " (" + v.bolumAcma[i] + " kez)").join(", ") : "—"}</td>
          <td class="sayi">${x.durak.n ? yuzde(x.durak.basari) + " (" + x.durak.n + ")" : "—"}</td></tr>`; }).join("")}
      </tbody></table></div>
      <div class="geri bilgi"><b>Nasıl yorumlanır?</b><p>Sık geri sarılan ya da tekrar açılan bölümler, öğrencinin zorlandığı olası konu parçalarıdır. Duraklatma sayısının yüksek olması not alma ya da dikkat dağınıklığına işaret edebilir. Konu durağı başarısı, dinlenen bilginin ne kadar anlaşıldığını gösterir.</p></div></section>`;
  }

  function veliTekrar(h) {
    const plan = ANALIZ.tekrarPlani();
    const tb = h.tekrarBasari;
    return `<section class="kart"><h2>Unutma eğrisi: tekrar testlerindeki başarı</h2>
      ${sutunGrafik([[0, "İlk öğrenme"], [1, "1 gün sonra"], [3, "3 gün sonra"], [7, "7 gün sonra"], [30, "30 gün sonra"]].map(([g, a]) => ({ ad: a, v: tb[g].basari == null ? 0 : Math.round(tb[g].basari * 100), yok: tb[g].basari == null })), { ust: 100, etiket: x => "%" + Math.round(x) })}
      <p class="muted kucuk-yazi">${[0, 1, 3, 7, 30].map(g => `${g ? g + ". gün" : "İlk"}: ${tb[g].n} test`).join(" · ")}</p></section>
      <section class="kart"><h2>Konulara göre tekrar planı</h2><div class="tablo"><table><thead><tr><th>Konu</th><th class="sayi">İlk test</th>${ANALIZ.TEKRAR_GUNLERI.map(g => `<th class="sayi">${g}. gün</th>`).join("")}</tr></thead><tbody>
      ${KONULAR.filter(k => h.konuOzet[k.id].konuSonu).map(k => `<tr><td>${k.ad}</td><td class="sayi">${yuzde(h.konuOzet[k.id].konuSonu.ilk)}</td>${ANALIZ.TEKRAR_GUNLERI.map(g => { const p = plan.find(x => x.konu === k.id && x.gun === g); return `<td class="sayi">${p.yapildi ? yuzde(p.sonuc) : p.vadesi ? "<span class='etiket orta'>zamanı geldi</span>" : new Date(p.zaman).toLocaleDateString("tr-TR")}</td>`; }).join("")}</tr>`).join("") || `<tr><td colspan="6" class="muted">Konu sonu testi yapılınca tekrar planı burada oluşur.</td></tr>`}
      </tbody></table></div></section>`;
  }

  function veliCalisma(h) {
    const c = h.calisma;
    const seri = ANALIZ.gunlukSeri(aralik === 7 ? 7 : 30);
    return `<section class="izgara dar">
        ${metrik(dk(c.toplamDk), "toplam aktif çalışma", c.oturumSayisi + " oturum")}
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

  function veliKayit(h) {
    const son = h.sorular.slice(-150).reverse();
    return `<section class="kart"><h2>Son ${son.length} soru</h2><div class="tablo"><table><thead><tr><th>Zaman</th><th>Konu / kazanım</th><th>Düzey</th><th class="sayi">Zorluk</th><th class="sayi">Süre</th><th>İlk</th><th>Son</th><th>Yardım</th><th>Hata türü</th><th>Test</th></tr></thead><tbody>
      ${son.map(s => `<tr><td>${tarih(s.t)}</td><td>${KAZANIM[s.kaz] ? KAZANIM[s.kaz].ad : s.kaz}</td><td>${(DUZEY_AD[s.duzey] || "").split(" ")[0]}</td><td class="sayi">${s.zorluk}</td><td class="sayi">${sn(s.ilkSure)}</td>
        <td>${s.terk ? "geçti" : s.ilkDogru ? "✓" : "✗"}</td><td>${s.terk ? "" : s.sonDogru ? "✓" : "✗"}</td><td>${[s.ipucu ? "ipucu" : "", s.cozumGoruldu ? "çözüm" : "", s.kontrol ? "benzer soru" : ""].filter(Boolean).join(", ")}</td>
        <td>${s.ilkHata ? HATA_AD[s.ilkHata] : ""}${s.kendiHata ? " / beyan: " + HATA_AD[s.kendiHata] : ""}</td><td>${TEST_AD[s.mod] || s.mod}</td></tr>`).join("") || '<tr><td colspan="10" class="muted">Henüz kayıt yok.</td></tr>'}
      </tbody></table></div></section>`;
  }

  function veliVideolar() {
    const v = DEPO.ayar.videolar;
    return `<section class="kart"><h2>Konu anlatım videoları</h2>
      <p>Her konuya bir YouTube video bağlantısı ekleyin. Video uygulamanın içinde oynatılır; YouTube uygulamasına gerek yoktur. İsterseniz videoyu bölümlere ayırın; her bölüm bitince öğrenciye kısa bir soru sorulur.</p>
      <p class="kucuk-yazi muted">Not: Sahibi “yerleştirmeye izin ver” seçeneğini kapattıysa video uygulama içinde oynamaz; başka bir video seçin.</p></section>
      ${TEMALAR.map(t => `<section class="kart"><h2>${t.kisa} · ${t.ad}</h2>${t.konular.map(k => { const x = v[k] || {}; return `<details ${x.vid ? "" : ""}><summary><b>${KONU[k].ad}</b> ${x.vid ? '<span class="etiket iyi">video var · ' + ((x.bolumler || []).length || 1) + " bölüm</span>" : '<span class="etiket">video yok</span>'}</summary>
        <div style="display:grid;gap:10px;margin-top:10px" data-konu="${k}">
          <label class="alan">YouTube bağlantısı<input type="url" class="vUrl" value="${kacis(x.url || "")}" placeholder="https://www.youtube.com/watch?v=..."></label>
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
        <button class="btn ana" id="aKaydet">Kaydet</button></section>
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
    ozet() { $("#raporPaylas").onclick = () => paylas("Haftalık rapor", raporMetni()); $("#raporKopyala").onclick = () => kopyala(raporMetni()); },
    icerik() {
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
          if (vid) DEPO.ayar.videolar[k] = { url, vid, bolumler }; else delete DEPO.ayar.videolar[k];
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
        Object.assign(DEPO.ayar, { ogrenciAdi: $("#aAd").value.trim() || DEPO.ayar.ogrenciAdi, gunlukHedefDk: Math.max(5, +$("#aHedef").value || 30), pin });
        DEPO.ayarKaydet(); toast("Kaydedildi."); yonlendir();
      };
      $("#aUrlKaydet").onclick = () => { const u = $("#aUrl").value.trim(); if (u && !/^https:\/\//.test(u)) return toast("Adres https:// ile başlamalı."); DEPO.ayar.bulutUrl = u; DEPO.ayarKaydet(); toast("Adres kaydedildi."); };
      $("#aGonder").onclick = async () => { toast("Gönderiliyor…"); const r = await DEPO.gonder(); toast(r.ok ? r.n + " kayıt gönderildi." : "Gönderilemedi: " + r.neden); veliPaneli("ayar"); };
      $("#aCek").onclick = async () => { toast("Alınıyor…"); const r = await DEPO.cek(); toast(r.ok ? r.n + " yeni kayıt alındı." : "Alınamadı: " + r.neden); };
      $("#aKodKopyala").onclick = () => kopyala(APPS_SCRIPT);
      $("#aDisa").onclick = () => kopyala(DEPO.disaAktar());
      $("#aDisaPaylas").onclick = () => paylas("Öğrenme Yolculuğu verileri", DEPO.disaAktar());
      $("#aIceAl").onclick = () => { try { const j = JSON.parse($("#aIce").value); toast(DEPO.iceAktar(j.olaylar) + " kayıt içe aktarıldı."); } catch (e) { toast("Metin okunamadı. Tamamını yapıştırdığınızdan emin olun."); } };
      $("#aSifir").onclick = () => { $("#aSifirOnay").hidden = false; };
      $("#aSifirHayir").onclick = () => { $("#aSifirOnay").hidden = true; };
      $("#aSifirEvet").onclick = async () => { await DEPO.sifirla(); toast("Kayıtlar silindi."); veliPaneli("ayar"); };
    },
  };

  window.TEST_DURUMU = () => durum.test;  // otomatik testler için salt okunur erişim

  /* ============================ BAŞLAT ============================ */
  DEPO.baslat().then(() => { yonlendir(); DEPO.gonder(); });
})();
