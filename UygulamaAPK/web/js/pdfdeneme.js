/* PDF denemeleri: elinizdeki deneme kitapçığının PDF'ini ve cevap anahtarını tablete yükleyip
 * optik form ile, süre tutarak çözme. Sorular ve cevaplar PDF'in metin katmanından okunur (pdfayristir.js);
 * dosya tablette kalır (IndexedDB), hiçbir yere gönderilmez. Sonuç doğru/yanlış/boş/net olarak deneme listesine kaydedilir. */
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  const ana = document.querySelector("main");
  const { kacis, toast, git } = window.UYG;
  const A = window.PDF_AYRISTIR;
  const HARFLER = ["A", "B", "C", "D", "E"];
  const DIGER_AD = { "SOS": "Sosyal Bilgiler", "DİN": "Din Kültürü", "İNK": "İnkılap Tarihi" };

  /* ---------------- pdf.js (yalnızca gerektiğinde yüklenir) ---------------- */
  let pdfjsSoz = null;
  function pdfjsYukle() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfjsSoz) return pdfjsSoz;
    pdfjsSoz = new Promise((tamam, hata) => {
      const s = document.createElement("script");
      s.src = "lib/pdfjs/pdf.min.js";
      s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "lib/pdfjs/pdf.worker.min.js"; tamam(window.pdfjsLib); };
      s.onerror = () => { pdfjsSoz = null; hata(new Error("PDF okuyucu yüklenemedi")); };
      document.head.appendChild(s);
    });
    return pdfjsSoz;
  }
  async function pdfAc(veri) { const lib = await pdfjsYukle(); return lib.getDocument({ data: veri.slice(0) }).promise; }
  async function metinCikar(doc, ilerleme) {
    const sayfalar = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const p = await doc.getPage(i), vp = p.getViewport({ scale: 1 }), tc = await p.getTextContent();
      sayfalar.push({ w: vp.width, h: vp.height, items: tc.items.filter(t => t.str && t.str.trim()).map(t => ({ s: t.str, x: Math.round(t.transform[4]), y: Math.round(vp.height - t.transform[5]), w: Math.round(t.width) })) });
      if (ilerleme) ilerleme(i, doc.numPages);
    }
    return sayfalar;
  }

  /* ---------------- Dosya deposu (IndexedDB, yalnızca bu tablette) ---------------- */
  let dbSoz = null;
  function db() {
    if (dbSoz) return dbSoz;
    dbSoz = new Promise((tamam, hata) => { const r = indexedDB.open("ogrenme_pdf", 1); r.onupgradeneeded = () => r.result.createObjectStore("dosya"); r.onsuccess = () => tamam(r.result); r.onerror = () => hata(r.error); });
    return dbSoz;
  }
  async function dosyaYaz(id, veri) { const d = await db(); return new Promise((t, h) => { const tx = d.transaction("dosya", "readwrite"); tx.objectStore("dosya").put(veri, id); tx.oncomplete = () => t(); tx.onerror = () => h(tx.error); }); }
  async function dosyaOku(id) { const d = await db(); return new Promise((t, h) => { const r = d.transaction("dosya").objectStore("dosya").get(id); r.onsuccess = () => t(r.result || null); r.onerror = () => h(r.error); }); }
  async function dosyaSil(id) { const d = await db(); return new Promise(t => { const tx = d.transaction("dosya", "readwrite"); tx.objectStore("dosya").delete(id); tx.oncomplete = () => t(); }); }

  const denemeler = () => (DEPO.ayar.pdfDenemeler = DEPO.ayar.pdfDenemeler || {});
  const dersAdi = d => d.uygulamaDersi && ICERIK.DERS[d.uygulamaDersi] ? ICERIK.DERS[d.uygulamaDersi].ad : DIGER_AD[d.anahtar] || d.ad;
  const dagilimAnahtari = d => d.uygulamaDersi || d.anahtar;
  const net = (d, y) => Math.round((d - y / 3) * 100) / 100;
  const sonuclar = id => DEPO.liste("test").filter(t => t.tur === "pdfDeneme" && t.pdfId === id);

  /* ============================ LİSTE ============================ */
  function liste() {
    const l = Object.values(denemeler()).sort((a, b) => b.eklendi - a.eklendi);
    ana.innerHTML = `<section class="kart vurgu"><p class="yol-iz"><a href="#/deneme">Deneme merkezi</a> › PDF denemelerim</p><h1>📄 PDF denemelerim</h1>
        <p>Elinizdeki deneme sınavının <b>soru kitapçığı PDF'ini</b> ve <b>cevap anahtarını</b> yükleyin. Uygulama dersleri, soru sayılarını, her sorunun sayfasını ve doğru cevapları kendisi bulur; öğrenci kitapçığı tablette okuyup <b>optik form</b> üzerinde işaretler. Süre tutulur; sonuçta her ders için doğru, yanlış, boş ve net hesaplanır.</p>
        <p class="kucuk-yazi muted">PDF yalnızca bu tablette saklanır, hiçbir yere gönderilmez. Taranmış (fotoğraf) PDF'lerde yazı okunamadığı için cevaplar elle girilir.</p>
        <div><a class="btn ana" href="#/pdf/yeni">➕ Yeni PDF deneme ekle</a></div></section>
      ${l.length ? l.map(p => { const s = sonuclar(p.id), son = s[s.length - 1], n = p.dersler.filter(d => d.dahil).reduce((a, d) => a + d.n, 0);
        return `<section class="kart"><div class="satir ara"><div><h2>${kacis(p.baslik)}</h2><p class="kucuk-yazi muted">${p.sinif ? p.sinif + ". sınıf · " : ""}${p.kitapcik ? p.kitapcik + " kitapçığı · " : ""}${n} soru · ${p.sureDk} dk · ${p.dersler.filter(d => d.dahil).map(d => dersAdi(d) + " " + d.n).join(", ")}</p>
          ${son ? `<p class="kucuk-yazi">Son sonuç: <b>${son.dogru} doğru · ${son.yanlis} yanlış · ${son.bos} boş · net ${String(son.net).replace(".", ",")}</b> (${s.length} kez çözüldü)</p>` : ""}</div></div>
          <div class="satir"><a class="btn ana kucuk" href="#/pdf/coz/${p.id}">${DEPO.ayar.pdfTaslak && DEPO.ayar.pdfTaslak[p.id] ? "Kaldığın yerden devam et" : "Çözmeye başla"}</a>
            ${son ? `<a class="btn kucuk" href="#/pdf/sonuc/${son.testId}">Son sonuç ve inceleme</a>` : ""}<a class="btn kucuk" href="#/pdf/duzenle/${p.id}">Cevap anahtarı</a><button class="btn kucuk tehlike" data-sil="${p.id}">Sil</button></div></section>`; }).join("")
        : '<section class="kart"><p class="muted">Henüz PDF deneme eklenmedi.</p></section>'}`;
    ana.querySelectorAll("[data-sil]").forEach(b => b.onclick = async () => {
      if (!confirm("Bu PDF deneme silinsin mi? (Daha önceki sonuçlar deneme listesinde kalır.)")) return;
      const id = b.dataset.sil; delete denemeler()[id]; if (DEPO.ayar.pdfTaslak) delete DEPO.ayar.pdfTaslak[id]; DEPO.ayarKaydet(); await dosyaSil(id); liste();
    });
  }

  /* ============================ YENİ / DÜZENLE ============================ */
  let taslak = null;   // yükleme sırasında: { id, veri(ArrayBuffer), kit, bloklar, eslesme, baslik }
  function yeni() {
    taslak = null;
    ana.innerHTML = `<section class="kart vurgu"><p class="yol-iz"><a href="#/pdf">PDF denemelerim</a> › Yeni</p><h1>Yeni PDF deneme</h1>
        <ol style="display:grid;gap:6px;padding-left:20px"><li><b>Soru kitapçığı PDF'ini</b> seçin.</li><li><b>Cevap anahtarı PDF'ini</b> seçin (anahtar kitapçığın sonundaysa bu adımı atlayın).</li><li>Bulunan cevapları kontrol edip <b>Kaydet</b>'e basın.</li></ol>
        <label class="btn ana" for="pKitap">1. Soru kitapçığı PDF'ini seç</label><input type="file" id="pKitap" accept="application/pdf,.pdf" hidden>
        <p id="pDurum" class="kucuk-yazi muted"></p></section><div id="pAlan"></div>`;
    $("#pKitap").onchange = async e => {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      try {
        $("#pDurum").textContent = "PDF okunuyor…";
        const veri = await f.arrayBuffer();
        const doc = await pdfAc(veri);
        const sayfalar = await metinCikar(doc, (i, n) => { $("#pDurum").textContent = `Sayfalar okunuyor: ${i} / ${n}`; });
        const kit = A.kitapcikCoz(sayfalar);
        const icAnahtar = A.anahtarCoz(sayfalar);   // anahtar kitapçığın içinde olabilir
        taslak = { id: "pdf" + Date.now().toString(36), veri, sayfaSayisi: doc.numPages, kit, bloklar: icAnahtar, dosyaAdi: f.name };
        taslak.eslesme = A.eslestir(kit, icAnahtar);
        $("#pDurum").textContent = `${doc.numPages} sayfa okundu.`;
        onizle();
      } catch (x) { $("#pDurum").textContent = "PDF açılamadı: " + (x.message || x); }
    };
  }
  function onizle() {
    const t = taslak, k = t.kit, e = t.eslesme;
    const metinYok = !k.dersler.length;
    const varsayilanBaslik = [k.sinif ? k.sinif + ". Sınıf" : "", "Deneme", k.kitapcik ? "· " + k.kitapcik + " kitapçığı" : ""].filter(Boolean).join(" ") || t.dosyaAdi.replace(/\.pdf$/i, "");
    $("#pAlan").innerHTML = `<section class="kart"><h2>Kitapçıkta bulunanlar</h2>
        ${metinYok ? '<div class="geri kotu"><b>Bu PDF\'te okunabilir yazı bulunamadı (taranmış olabilir).</b><p>Dersleri ve cevapları aşağıya elle girebilirsiniz.</p></div>' : ""}
        <div class="izgara dar">
          <div class="metrik"><b>${k.sinif ? k.sinif + ". sınıf" : "—"}</b><span>sınıf</span></div>
          <div class="metrik"><b>${k.kitapcik || "—"}</b><span>kitapçık türü</span></div>
          <div class="metrik"><b>${k.sureDk ? k.sureDk + " dk" : "—"}</b><span>sınav süresi</span></div>
          <div class="metrik"><b>${k.dersler.reduce((a, d) => a + d.n, 0)}</b><span>soru (${k.dersler.length} ders)</span></div></div>
        <label class="alan">Deneme adı<input type="text" id="pBaslik" maxlength="80" value="${kacis(varsayilanBaslik)}"></label>
        <label class="alan">Süre (dakika)<input type="number" id="pSure" min="5" max="300" value="${k.sureDk || Math.max(20, Math.round(k.dersler.reduce((a, d) => a + d.n, 0) * 1.3)) || 60}"></label></section>
      <section class="kart"><h2>2. Cevap anahtarı</h2>
        <p class="kucuk-yazi muted">${e.blok ? `Eşleşen anahtar: <b>${kacis(e.blok.baslik)}</b>` : "Henüz cevap anahtarı bulunamadı."} Anahtar ayrı bir PDF ise seçin; birden çok sınıfın anahtarı aynı dosyadaysa doğru sınıf ve kitapçık otomatik seçilir.</p>
        <div class="satir"><label class="btn" for="pAnahtar">Cevap anahtarı PDF'ini seç</label><input type="file" id="pAnahtar" accept="application/pdf,.pdf" hidden><span id="pAnDurum" class="kucuk-yazi muted"></span></div>
        ${t.bloklar && t.bloklar.length > 1 ? `<label class="alan">Anahtar bloğu<select id="pBlok">${t.bloklar.map((b, i) => `<option value="${i}" ${e.blok && b.sinif === e.blok.sinif && b.kitapcik === e.blok.kitapcik ? "selected" : ""}>${b.sinif ? b.sinif + ". sınıf " : ""}${b.kitapcik ? b.kitapcik + " kitapçığı " : ""}${b.ek} · ${b.dersler.map(d => d.ad).join(", ")}</option>`).join("")}</select></label>` : ""}
        <div id="pDersler">${dersFormu(e.dersler)}</div>
        <button class="btn" id="pDersEkle">+ Ders ekle (elle)</button></section>
      <section class="kart"><button class="btn ana" id="pKaydet">Kaydet</button></section>`;
    $("#pAnahtar").onchange = async ev => {
      const f = ev.target.files && ev.target.files[0]; if (!f) return;
      try {
        $("#pAnDurum").textContent = "Okunuyor…";
        const doc = await pdfAc(await f.arrayBuffer());
        t.bloklar = A.anahtarCoz(await metinCikar(doc));
        if (!t.bloklar.length) { $("#pAnDurum").textContent = "Bu PDF'te cevap anahtarı bulunamadı; cevapları elle girebilirsiniz."; return; }
        t.eslesme = A.eslestir(t.kit, t.bloklar);
        onizle(); toast("Cevap anahtarı okundu. Lütfen kontrol edin.");
      } catch (x) { $("#pAnDurum").textContent = "Açılamadı: " + (x.message || x); }
    };
    if ($("#pBlok")) $("#pBlok").onchange = () => {
      const b = t.bloklar[+$("#pBlok").value];
      t.eslesme = A.eslestir({ ...t.kit, sinif: b.sinif, kitapcik: b.kitapcik }, t.bloklar.filter(x => x.sinif === b.sinif && x.kitapcik === b.kitapcik));
      onizle();
    };
    $("#pDersEkle").onclick = () => { dersleriTopla(); t.eslesme.dersler.push({ ad: "Yeni ders", anahtar: "YEN" + t.eslesme.dersler.length, n: 10, cevap: {}, dahil: true }); onizle(); };
    baglaDersFormu();
    $("#pKaydet").onclick = async () => {
      const dersler = dersleriTopla();
      const sorun = dersler.filter(d => d.dahil && Object.keys(d.cevap).length < d.n);
      if (!dersler.some(d => d.dahil && d.n)) { toast("En az bir ders gerekli."); return; }
      if (sorun.length && !confirm(sorun.map(d => `${d.ad}: ${d.n - Object.keys(d.cevap).length} sorunun cevabı eksik`).join("\n") + "\n\nEksik cevaplı sorular puanlanmaz. Yine de kaydedilsin mi?")) return;
      const p = { id: t.id, baslik: $("#pBaslik").value.trim() || "PDF deneme", sinif: t.kit.sinif, kitapcik: t.kit.kitapcik, sureDk: Math.max(5, +$("#pSure").value || 60), sayfaSayisi: t.sayfaSayisi,
        dersler: dersler.map(d => ({ ad: d.ad, anahtar: d.anahtar, n: d.n, cevap: d.cevap, dahil: d.dahil, uygulamaDersi: d.uygulamaDersi || A.UYGULAMA_DERSI[d.anahtar] || null, sayfa: (t.kit.harita || {})[d.anahtar] || {} })),
        eklendi: Date.now() };
      try { await dosyaYaz(p.id, t.veri); } catch (x) { toast("PDF tablete kaydedilemedi: " + (x.message || x)); return; }
      denemeler()[p.id] = p; DEPO.ayarKaydet(); toast("PDF deneme kaydedildi."); taslak = null; git("#/pdf");
    };
  }
  function dersFormu(dersler) {
    return `<div style="display:grid;gap:10px;margin:8px 0">${dersler.map((d, i) => { const yazi = A.cevapYazi(d.cevap || {}, d.n), eksik = (yazi.match(/-/g) || []).length;
      return `<div class="kart" style="padding:12px;gap:6px" data-ders="${i}"><div class="satir ara"><label class="satir"><input type="checkbox" class="dDahil" ${d.dahil !== false ? "checked" : ""}> <input type="text" class="dAd" value="${kacis(d.ad)}" style="font-weight:700;max-width:260px"></label>
        <label class="satir kucuk-yazi">Soru sayısı <input type="number" class="dN" min="1" max="200" value="${d.n}" style="width:70px"></label></div>
        <label class="kucuk-yazi">Cevaplar (sırayla harfler; bilinmeyen için -)<input type="text" class="dCevap" value="${yazi}" style="font-family:monospace;letter-spacing:2px;text-transform:uppercase" autocapitalize="characters" spellcheck="false"></label>
        <span class="kucuk-yazi ${eksik ? "" : "muted"} dBilgi">${eksik ? "⚠️ " + eksik + " sorunun cevabı eksik" : "✓ " + d.n + " cevap"}</span></div>`; }).join("")}</div>`;
  }
  function baglaDersFormu() {
    ana.querySelectorAll("[data-ders]").forEach(k => {
      const g = () => { const n = +k.querySelector(".dN").value || 0, c = A.cevapMetni(k.querySelector(".dCevap").value, n), eksik = n - Object.keys(c).length; k.querySelector(".dBilgi").textContent = eksik > 0 ? "⚠️ " + eksik + " sorunun cevabı eksik" : "✓ " + n + " cevap"; };
      k.querySelector(".dCevap").oninput = g; k.querySelector(".dN").oninput = g;
    });
  }
  function dersleriTopla() {
    const l = taslak.eslesme.dersler;
    ana.querySelectorAll("[data-ders]").forEach(k => {
      const d = l[+k.dataset.ders]; if (!d) return;
      d.ad = k.querySelector(".dAd").value.trim() || d.ad; d.n = Math.max(1, +k.querySelector(".dN").value || d.n);
      d.cevap = A.cevapMetni(k.querySelector(".dCevap").value, d.n); d.dahil = k.querySelector(".dDahil").checked;
    });
    return l;
  }
  function duzenle(id) {
    const p = denemeler()[id]; if (!p) return liste();
    taslak = { eslesme: { dersler: p.dersler.map(d => ({ ...d })) } };
    ana.innerHTML = `<section class="kart vurgu"><p class="yol-iz"><a href="#/pdf">PDF denemelerim</a> › Cevap anahtarı</p><h1>${kacis(p.baslik)}</h1>
        <p class="kucuk-yazi muted">Cevapları kontrol edin, gerekirse düzeltin. Önceki sonuçlar değişmez; yeni çözümler bu anahtara göre puanlanır.</p>
        <div id="pDersler">${dersFormu(taslak.eslesme.dersler)}</div><div class="satir"><button class="btn ana" id="pKaydet">Kaydet</button><a class="btn" href="#/pdf">Vazgeç</a></div></section>`;
    baglaDersFormu();
    $("#pKaydet").onclick = () => { const l = dersleriTopla(); p.dersler = p.dersler.map((d, i) => ({ ...d, ad: l[i].ad, n: l[i].n, cevap: l[i].cevap, dahil: l[i].dahil })); DEPO.ayarKaydet(); toast("Kaydedildi."); git("#/pdf"); };
  }

  /* ============================ ÇÖZME / İNCELEME EKRANI ============================ */
  let gor = null;   // { doc, sayfa, olcek, ... }
  let sayac = null;
  async function coz(id, incelemeTestId) {
    const p = denemeler()[id];
    const sonucTest = incelemeTestId ? DEPO.liste("test").find(t => t.testId === incelemeTestId) : null;
    if (!p && !sonucTest) return liste();
    clearInterval(sayac);
    const inceleme = !!sonucTest;
    const dersler = (inceleme ? sonucTest.dersler : p.dersler).filter(d => d.dahil !== false);
    DEPO.ayar.pdfTaslak = DEPO.ayar.pdfTaslak || {};
    let durum = inceleme ? { cevaplar: sonucTest.cevaplar, bas: 0 } : (DEPO.ayar.pdfTaslak[id] || (DEPO.ayar.pdfTaslak[id] = { cevaplar: {}, bas: Date.now(), gecen: 0 }));
    if (!inceleme) { durum.devam = Date.now(); DEPO.ayarKaydet(); }
    let aktif = 0;
    ana.innerHTML = `<section class="kart pdf-ust"><div class="satir ara"><div><p class="yol-iz"><a href="#/pdf">PDF denemelerim</a></p><h1 style="font-size:1.2rem">${kacis((p || sonucTest).baslik)}${inceleme ? " · inceleme" : ""}</h1></div>
        ${inceleme ? `<a class="btn kucuk" href="#/pdf/sonuc/${sonucTest.testId}">Sonuca dön</a>` : `<span class="satir"><span class="sayac" id="pSaat">--:--</span><button class="btn ana kucuk" id="pBitir">Sınavı bitir</button></span>`}</div></section>
      <div class="pdf-duzen">
        <section class="kart pdf-gorunum"><div class="satir ara pdf-arac"><span class="satir"><button class="btn kucuk" id="pOnce" aria-label="Önceki sayfa">◀</button><span id="pSayfaNo" class="kucuk-yazi">…</span><button class="btn kucuk" id="pSonra" aria-label="Sonraki sayfa">▶</button></span>
          <span class="satir"><button class="btn kucuk" id="pKucult" aria-label="Küçült">−</button><button class="btn kucuk" id="pBuyut" aria-label="Büyüt">+</button></span></div>
          <div class="pdf-tuval" id="pTuvalKutu"><canvas id="pTuval"></canvas><p id="pYukDurum" class="muted kucuk-yazi">Kitapçık açılıyor…</p></div></section>
        <section class="kart pdf-optik"><nav class="sekmeler" id="pSekmeler"></nav><div id="pForm"></div>
          <p class="kucuk-yazi muted">${inceleme ? "Yeşil: doğru cevap · kırmızı: senin yanlış cevabın. Numaraya dokununca sorunun sayfası açılır." : "Cevabı işaretlemek için harfe dokun; değiştirmek için başka harfe, silmek için aynı harfe dokun. Numaraya dokununca sorunun sayfası açılır."}</p></section>
      </div>`;
    // optik form
    const formCiz = () => {
      $("#pSekmeler").innerHTML = dersler.map((d, i) => { const c = Object.keys(durum.cevaplar[d.anahtar] || {}).length; return `<button class="sekme ${i === aktif ? "aktif" : ""}" data-sek="${i}">${kacis(dersAdi(d))} <span class="kucuk-yazi">${c}/${d.n}</span></button>`; }).join("");
      const d = dersler[aktif], c = durum.cevaplar[d.anahtar] || {}, harfSay = Math.max(4, ...Object.values(d.cevap).map(h => HARFLER.indexOf(h) + 1));
      $("#pForm").innerHTML = `<div class="optik">${Array.from({ length: d.n }, (_, i) => { const no = i + 1, dogru = d.cevap[no], sec = c[no];
        return `<div class="optik-satir"><button class="optik-no" data-no="${no}" title="Sayfasını aç">${no}</button>${HARFLER.slice(0, harfSay).map(h => {
          let cls = sec === h ? "secili" : ""; if (inceleme) cls = h === dogru ? "dogru" : sec === h ? "yanlis" : "";
          return `<button class="optik-harf ${cls}" data-h="${h}" data-no="${no}" ${inceleme ? "disabled" : ""} aria-label="${no}. soru ${h}">${h}</button>`; }).join("")}${inceleme ? `<span class="kucuk-yazi">${!sec ? "boş" : sec === dogru ? "✓" : dogru ? "✗" : ""}</span>` : ""}</div>`; }).join("")}</div>`;
      ana.querySelectorAll("[data-sek]").forEach(b => b.onclick = () => { aktif = +b.dataset.sek; formCiz(); const s = ilkSayfa(dersler[aktif]); if (s) sayfaGoster(s); });
      ana.querySelectorAll(".optik-no").forEach(b => b.onclick = () => { const s = (dersler[aktif].sayfa || {})[b.dataset.no]; if (s) sayfaGoster(+s); else toast("Bu sorunun sayfası bulunamadı; sayfaları kaydırarak bulabilirsin."); });
      if (!inceleme) ana.querySelectorAll(".optik-harf").forEach(b => b.onclick = () => {
        const dd = dersler[aktif], m = durum.cevaplar[dd.anahtar] = durum.cevaplar[dd.anahtar] || {};
        if (m[b.dataset.no] === b.dataset.h) delete m[b.dataset.no]; else m[b.dataset.no] = b.dataset.h;
        DEPO.ayarKaydet(); formCiz();
      });
    };
    const ilkSayfa = d => { const v = Object.values(d.sayfa || {}); return v.length ? Math.min(...v) : null; };
    formCiz();
    // süre
    if (!inceleme) {
      const toplam = p.sureDk * 60000;
      const kalan = () => toplam - (durum.gecen || 0) - (durum.devam ? Date.now() - durum.devam : 0);
      const yaz = () => { const k = Math.max(0, kalan()), dk = Math.floor(k / 60000), sn = Math.floor(k / 1000) % 60; const e = $("#pSaat"); if (!e) { clearInterval(sayac); return; } e.textContent = String(dk).padStart(2, "0") + ":" + String(sn).padStart(2, "0"); if (k <= 0) { clearInterval(sayac); toast("Süre bitti!"); bitir(p, durum); } };
      yaz(); sayac = setInterval(yaz, 1000);
      $("#pBitir").onclick = () => { const bos = dersler.reduce((a, d) => a + d.n - Object.keys(durum.cevaplar[d.anahtar] || {}).length, 0); if (confirm(bos ? `${bos} soru boş. Sınavı bitirmek istiyor musun?` : "Sınavı bitirmek istiyor musun?")) bitir(p, durum); };
      // uygulamadan çıkıp dönünce süre kaldığı yerden devam eder
      window.PDF_DURAKLAT = () => { if (durum.devam) durum.gecen = (durum.gecen || 0) + (Date.now() - durum.devam); durum.devam = null; DEPO.ayarKaydet(); };
      window.PDF_DEVAM = () => { if (!durum.devam) durum.devam = Date.now(); };
    }
    // kitapçık
    try {
      const veri = await dosyaOku(id || sonucTest.pdfId);
      if (!veri) { $("#pYukDurum").textContent = "Kitapçık dosyası bu tablette bulunamadı (silinmiş olabilir). Optik formu yine de kullanabilirsin."; return; }
      const doc = await pdfAc(veri);
      gor = { doc, sayfa: 1, olcek: 1 };
      $("#pYukDurum").remove();
      $("#pOnce").onclick = () => sayfaGoster(gor.sayfa - 1); $("#pSonra").onclick = () => sayfaGoster(gor.sayfa + 1);
      $("#pBuyut").onclick = () => { gor.olcek = Math.min(3, gor.olcek + 0.25); sayfaGoster(gor.sayfa); };
      $("#pKucult").onclick = () => { gor.olcek = Math.max(0.5, gor.olcek - 0.25); sayfaGoster(gor.sayfa); };
      let bas = null; const kutu = $("#pTuvalKutu");
      kutu.addEventListener("touchstart", e => { bas = e.touches.length === 1 && gor.olcek <= 1 ? e.touches[0].clientX : null; }, { passive: true });
      kutu.addEventListener("touchend", e => { if (bas == null) return; const d = e.changedTouches[0].clientX - bas; if (Math.abs(d) > 70) sayfaGoster(gor.sayfa + (d < 0 ? 1 : -1)); bas = null; });
      sayfaGoster(ilkSayfa(dersler[0]) || 1);
    } catch (x) { const e = $("#pYukDurum"); if (e) e.textContent = "Kitapçık açılamadı: " + (x.message || x); }

    function sayfaGoster(n) {
      if (!gor || n < 1 || n > gor.doc.numPages) return;
      gor.sayfa = n; $("#pSayfaNo").textContent = n + " / " + gor.doc.numPages;
      // sayfadaki derse göre optik formun sekmesini değiştir
      const i = dersler.findIndex(d => Object.values(d.sayfa || {}).includes(n));
      if (i >= 0 && i !== aktif) { aktif = i; formCiz(); }
      gor.doc.getPage(n).then(pg => {
        const kutu = $("#pTuvalKutu"); if (!kutu) return;
        const taban = pg.getViewport({ scale: 1 });
        const olcek = (kutu.clientWidth - 4) / taban.width * gor.olcek;
        const vp = pg.getViewport({ scale: olcek }), dpr = Math.min(2, window.devicePixelRatio || 1);
        const c = $("#pTuval"); c.width = Math.floor(vp.width * dpr); c.height = Math.floor(vp.height * dpr); c.style.width = Math.floor(vp.width) + "px"; c.style.height = Math.floor(vp.height) + "px";
        if (gor.gorev) try { gor.gorev.cancel(); } catch (e) {}
        gor.gorev = pg.render({ canvasContext: c.getContext("2d"), viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null });
        gor.gorev.promise.catch(() => {});
      });
    }
  }
  function bitir(p, durum) {
    clearInterval(sayac); window.PDF_DURAKLAT = null; window.PDF_DEVAM = null;
    const dagilim = {}, dersler = p.dersler.filter(d => d.dahil !== false);
    let D = 0, Y = 0, B = 0, n = 0;
    for (const d of dersler) {
      const c = durum.cevaplar[d.anahtar] || {}; let dd = 0, yy = 0, bb = 0;
      for (let no = 1; no <= d.n; no++) { const dogru = d.cevap[no]; if (!dogru) continue; const s = c[no]; if (!s) bb++; else if (s === dogru) dd++; else yy++; }
      dagilim[dagilimAnahtari(d)] = { d: dd, y: yy, b: bb, ad: dersAdi(d) }; D += dd; Y += yy; B += bb; n += dd + yy + bb;
    }
    const sure = (durum.gecen || 0) + (durum.devam ? Date.now() - durum.devam : 0);
    const testId = DEPO.uid();
    DEPO.kaydet("test", { testId, tur: "pdfDeneme", ders: "karma", pdfId: p.id, baslik: p.baslik, n, dogru: D, yanlis: Y, bos: B, net: net(D, Y), dagilim, sure,
      cevaplar: durum.cevaplar, dersler: dersler.map(d => ({ ad: d.ad, anahtar: d.anahtar, n: d.n, cevap: d.cevap, sayfa: d.sayfa, uygulamaDersi: d.uygulamaDersi, dahil: true })) });
    delete DEPO.ayar.pdfTaslak[p.id]; DEPO.ayarKaydet();
    git("#/pdf/sonuc/" + testId);
  }

  /* ============================ SONUÇ ============================ */
  function sonuc(testId) {
    const t = DEPO.liste("test").find(x => x.testId === testId); if (!t) return liste();
    const sat = Object.values(t.dagilim);
    const yanlislar = (t.dersler || []).map(d => { const c = (t.cevaplar || {})[d.anahtar] || {}; const l = []; for (let no = 1; no <= d.n; no++) { if (d.cevap[no] && c[no] && c[no] !== d.cevap[no]) l.push({ no, s: c[no], d: d.cevap[no] }); } return { d, l, bos: Array.from({ length: d.n }, (_, i) => i + 1).filter(no => d.cevap[no] && !c[no]) }; });
    const onceki = DEPO.liste("test").filter(x => x.tur === "pdfDeneme" && x.pdfId === t.pdfId && x.t < t.t).pop();
    ana.innerHTML = `<section class="kart vurgu" style="text-align:center"><span class="etiket">PDF deneme · ${kacis(t.baslik)}</span>
        <p style="font-size:3rem;font-weight:800;line-height:1">${String(t.net).replace(".", ",")} net</p>
        <p class="muted">${t.dogru} doğru · ${t.yanlis} yanlış · ${t.bos} boş · ${t.n} soru · süre ${Math.round(t.sure / 60000)} dk${onceki ? ` · önceki deneme: ${String(onceki.net).replace(".", ",")} net (${t.net >= onceki.net ? "▲" : "▼"} ${String(Math.abs(Math.round((t.net - onceki.net) * 100) / 100)).replace(".", ",")})` : ""}</p>
        <div class="tablo" style="text-align:left"><table><thead><tr><th>Ders</th><th class="sayi">Soru</th><th class="sayi">Doğru</th><th class="sayi">Yanlış</th><th class="sayi">Boş</th><th class="sayi">Net</th></tr></thead><tbody>
          ${sat.map(x => `<tr><td>${kacis(x.ad)}</td><td class="sayi">${x.d + x.y + x.b}</td><td class="sayi">${x.d}</td><td class="sayi">${x.y}</td><td class="sayi">${x.b}</td><td class="sayi"><b>${String(net(x.d, x.y)).replace(".", ",")}</b></td></tr>`).join("")}
        </tbody></table></div><p class="kucuk-yazi muted">Net = doğru − yanlış ÷ 3.</p>
        <div class="satir" style="justify-content:center"><a class="btn ana" href="#/pdf/incele/${t.testId}">Kitapçıkta incele</a><a class="btn" href="#/pdf">PDF denemelerim</a></div></section>
      <section class="kart"><h2>Yanlış ve boş sorular</h2>${yanlislar.map(({ d, l, bos }) => `<h3>${kacis(dersAdi(d))}</h3>
        ${l.length ? `<p>${l.map(x => `<span class="etiket kotu">${x.no}. soru: ${x.s} → doğru ${x.d}</span>`).join(" ")}</p>` : '<p class="kucuk-yazi muted">Yanlış yok.</p>'}
        ${bos.length ? `<p class="kucuk-yazi">Boş: ${bos.join(", ")}</p>` : ""}`).join("")}
        <p class="kucuk-yazi muted">“Kitapçıkta incele” ile her sorunun sayfasını açıp doğru cevabı görebilirsin. Yanlış yaptığın konuları uygulamadaki konu anlatımı ve alıştırmalarla tekrar etmeyi unutma.</p></section>`;
  }

  /* ---------------- Yönlendirme ---------------- */
  function ac(a, b) {
    if (a === "yeni") return yeni();
    if (a === "duzenle") return duzenle(b);
    if (a === "coz") return coz(b);
    if (a === "sonuc") return sonuc(b);
    if (a === "incele") { const t = DEPO.liste("test").find(x => x.testId === b); return t ? coz(t.pdfId, b) : liste(); }
    return liste();
  }
  // Uygulamadan çıkılınca süre durur, dönünce devam eder.
  document.addEventListener("visibilitychange", () => { if (document.hidden) { if (window.PDF_DURAKLAT) window.PDF_DURAKLAT(); } else if (window.PDF_DEVAM) window.PDF_DEVAM(); });
  window.PDFDENEME = { ac, pdfjsYukle, kapat: () => { clearInterval(sayac); if (window.PDF_DURAKLAT) window.PDF_DURAKLAT(); window.PDF_DURAKLAT = null; window.PDF_DEVAM = null; gor = null; } };
})();
