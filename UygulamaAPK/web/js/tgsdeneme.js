/* Ortak yazılı / TGS hazırlık denemeleri (web/tgs): 6 ders, 75 soru.
 * Sorular ve çözüm adımları PDF'ten bölge bölge kırpılarak gösterilir (yazı biçimi, üslü ifadeler ve tablolar bozulmaz).
 * Sınav bitince: ders ders doğru/yanlış/boş/net, LGS mantığıyla tahmini puan, isteğe bağlı OBP ile değerlendirme,
 * konu (ünite) konu sorular, her soruda ipucu → adım adım çözüm → tam çözüm. Her soru "soru" kaydı olarak saklanır
 * (yanlış defteri, istatistikler ve günlük rapor bu kayıtları kullanır). */
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  const ana = document.querySelector("main");
  const { kacis, toast, git } = window.UYG;
  const DERS_AD = { tr: "Türkçe", mat: "Matematik", fen: "Fen Bilimleri", sos: "Sosyal Bilgiler", din: "Din Kültürü", en: "İngilizce" };
  const DERS_SIMGE = { tr: "📖", mat: "➗", fen: "🔬", sos: "🌍", din: "🕌", en: "🇬🇧" };
  /* LGS'deki ders ağırlıkları (Türkçe, Matematik, Fen 4; diğerleri 1). */
  const AGIRLIK = { tr: 4, mat: 4, fen: 4, sos: 1, din: 1, en: 1 };
  const YAZILI_AD = { d1y1: "1. Dönem 1. Ortak Yazılı", d1y2: "1. Dönem 2. Ortak Yazılı", d2y1: "2. Dönem 1. Ortak Yazılı", d2y2: "2. Dönem 2. Ortak Yazılı" };
  const SURE_DK = 130;
  const X0 = 36, X1 = 562;   // kırpılan genişlik (sayfa kenar boşlukları dışarıda)
  const liste = () => window.TGS_LISTE || [];
  const net = (d, y) => Math.round((d - y / 3) * 100) / 100;
  const virgul = x => String(x).replace(".", ",");

  /* ---------------- Ünite / konu etiketleri (kazanım kodundan) ---------------- */
  function unite(ders, kod) {
    const k = String(kod || "");
    if (ders === "tr") return /^T\.O/.test(k) ? "Okuma ve anlama" : /^T\.Y/.test(k) ? "Yazma, yazım ve dil bilgisi" : /^T\.D/.test(k) ? "Dinleme" : /^T\.K/.test(k) ? "Konuşma" : "Türkçe";
    const m = k.match(/\.6\.(\d+)/);
    const n = m ? +m[1] : null;
    if (!n) return "Genel";
    const d = window.ICERIK && ICERIK.DERS[ders];
    const t = d && d.temaListesi && d.temaListesi[n - 1];
    return t ? `${t.kisa} · ${t.ad}` : `${n}. ünite`;
  }
  const temaId = (ders, kod) => { const m = String(kod || "").match(/\.6\.(\d+)/); const d = window.ICERIK && ICERIK.DERS[ders]; const t = m && d && d.temaListesi && d.temaListesi[+m[1] - 1]; return t ? t.id : null; };

  /* ---------------- Veri ve PDF ---------------- */
  const veriOnbellek = {}, belgeOnbellek = {};
  async function veriAl(id) {
    if (veriOnbellek[id]) return veriOnbellek[id];
    const r = await fetch("tgs/veri/" + id + ".json");
    if (!r.ok) throw new Error("Deneme bulunamadı");
    return (veriOnbellek[id] = await r.json());
  }
  async function belgeAl(id) {
    if (belgeOnbellek[id]) return belgeOnbellek[id];
    const lib = await PDFDENEME.pdfjsYukle();
    const r = await fetch("tgs/pdf/" + id + ".pdf");
    const veri = new Uint8Array(await r.arrayBuffer());
    return (belgeOnbellek[id] = lib.getDocument({ data: veri }).promise);
  }
  /* Bir bölgeyi ([sayfa, y1, y2]) kutunun genişliğine sığdırıp çizer. */
  async function kirp(id, bolge, kutu) {
    const [sayfa, y1, y2] = bolge;
    const doc = await belgeAl(id);
    const pg = await doc.getPage(sayfa);
    const genis = Math.max(260, kutu.clientWidth || 600);
    const olcek = genis / (X1 - X0), dpr = Math.min(2, window.devicePixelRatio || 1);
    const c = document.createElement("canvas");
    c.width = Math.round((X1 - X0) * olcek * dpr); c.height = Math.round((y2 - y1) * olcek * dpr);
    c.style.width = Math.round((X1 - X0) * olcek) + "px"; c.style.height = Math.round((y2 - y1) * olcek) + "px";
    c.className = "tgs-kirp";
    kutu.appendChild(c);
    const vp = pg.getViewport({ scale: olcek * dpr });
    await pg.render({ canvasContext: c.getContext("2d"), viewport: vp, transform: [1, 0, 0, 1, -X0 * olcek * dpr, -y1 * olcek * dpr] }).promise;
    return c;
  }
  async function bolgeler(id, liste, kutu) { for (const b of liste) await kirp(id, b, kutu); }

  /* ---------------- Sonuç hesapları ---------------- */
  function puanHesapla(dagilim) {
    let ust = 0, alt = 0;
    for (const [d, x] of Object.entries(dagilim)) { const w = AGIRLIK[d] || 1; ust += w * Math.max(-x.n, net(x.d, x.y)); alt += w * x.n; }
    return alt ? Math.round((100 + 400 * Math.max(0, ust) / alt) * 100) / 100 : null;
  }
  const obpPuan = p => { const o = +DEPO.ayar.obp; return o > 0 && p != null ? Math.round((0.7 * p + 0.3 * o * 5) * 100) / 100 : null; };
  const sonuclar = id => DEPO.liste("test").filter(t => t.tur === "tgsPdf" && (!id || t.tgsId === id));

  /* ============================ LİSTE ============================ */
  function listeEkrani() {
    const gruplar = {};
    liste().forEach(d => (gruplar[d.yaziliId] = gruplar[d.yaziliId] || []).push(d));
    const tum = sonuclar();
    ana.innerHTML = `<section class="kart vurgu"><p class="yol-iz"><a href="#/deneme">Deneme merkezi</a> › Ortak yazılı ve TGS denemeleri</p>
        <h1>🇹🇷 Ortak yazılı ve TGS hazırlık denemeleri</h1>
        <p>Her deneme 6 dersten 75 sorudur: Türkçe 15, Matematik 15, Fen Bilimleri 15, Sosyal Bilgiler 10, Din Kültürü 10, İngilizce 10 (önerilen süre ${SURE_DK} dk). Sınav bitince her dersin neti, <b>tahmini puan</b> ve bütün soruların adım adım çözümü gösterilir.</p>
        <p class="kucuk-yazi muted">Puan, LGS'deki ders ağırlıklarıyla (Türkçe, Matematik ve Fen 4; Sosyal, Din ve İngilizce 1) 100–500 arasında <b>tahmini</b> olarak hesaplanır; resmî bir sonuç değildir.${DEPO.ayar.obp ? ` Okul başarı puanı (OBP): <b>${virgul(DEPO.ayar.obp)}</b>.` : " Okul başarı puanını veli paneli → Ayarlar'dan girebilirsiniz."}</p>
        ${tum.length ? `<p>Çözülen deneme: <b>${tum.length}</b> · son puan <b>${virgul(tum[tum.length - 1].puan)}</b> · en iyi <b>${virgul(Math.max(...tum.map(t => t.puan || 0)))}</b></p>` : ""}</section>
      ${Object.entries(gruplar).map(([yid, l]) => `<section class="kart"><h2>${YAZILI_AD[yid] || yid} hazırlık denemeleri</h2><div class="izgara dar">
        ${l.map(d => { const s = sonuclar(d.id), son = s[s.length - 1], taslak = DEPO.ayar.tgsTaslak && DEPO.ayar.tgsTaslak[d.id];
          return `<button class="konu-satir" data-git="${son && !taslak ? "#/tgsd/sonuc/" + son.testId : "#/tgsd/coz/" + d.id}"><span><b>Deneme ${d.no}</b><br><span class="kucuk-yazi muted">${taslak ? "yarım kaldı · devam et" : son ? `${s.length} kez · net ${virgul(son.net)} · puan ${virgul(son.puan)}` : "75 soru · " + SURE_DK + " dk"}</span></span><span class="etiket ${son ? "iyi" : ""}">${son ? "✓" : "Başla"}</span></button>`; }).join("")}
      </div></section>`).join("")}`;
    ana.querySelectorAll("[data-git]").forEach(b => b.onclick = () => git(b.dataset.git));
  }

  /* ============================ ÇÖZME ============================ */
  let sayac = null, aktifDurum = null;
  async function cozEkrani(id) {
    clearInterval(sayac);
    const v = await veriAl(id).catch(() => null);
    if (!v) return listeEkrani();
    DEPO.ayar.tgsTaslak = DEPO.ayar.tgsTaslak || {};
    const d = DEPO.ayar.tgsTaslak[id] = DEPO.ayar.tgsTaslak[id] || { cevap: {}, sure: {}, gecen: 0, ders: 0, no: 1 };
    d.devam = Date.now(); DEPO.ayarKaydet();
    aktifDurum = d;
    const toplam = SURE_DK * 60000;
    const kalan = () => toplam - d.gecen - (d.devam ? Date.now() - d.devam : 0);
    ana.innerHTML = `<section class="kart"><div class="satir ara"><div><p class="yol-iz"><a href="#/tgsd">Ortak yazılı ve TGS denemeleri</a></p><h1 style="font-size:1.15rem">${kacis(v.ad)}</h1></div>
        <span class="satir"><span class="sayac" id="tSaat">--:--</span><button class="btn ana kucuk" id="tBitir">Sınavı bitir</button></span></div>
        <nav class="sekmeler" id="tDersler"></nav><div class="tgs-nolar" id="tNolar"></div></section>
      <section class="kart"><div id="tSoru" class="tgs-soru"></div>
        <div class="tgs-secenek" id="tSecenek">${["A", "B", "C", "D"].map(h => `<button class="optik-harf buyuk" data-h="${h}">${h}</button>`).join("")}<button class="btn kucuk" id="tBos">Boş bırak</button></div>
        <div class="satir ara"><button class="btn" id="tOnce">◀ Önceki</button><button class="btn ana" id="tSonra">Sonraki ▶</button></div></section>`;
    let soruBas = Date.now();
    const suredeTut = () => { const k = v.dersler[d.ders].kod + d.no; d.sure[k] = (d.sure[k] || 0) + (Date.now() - soruBas); soruBas = Date.now(); };
    const ciz = async () => {
      const ders = v.dersler[d.ders], q = ders.sorular[d.no - 1], c = d.cevap[ders.kod] || {};
      $("#tDersler").innerHTML = v.dersler.map((x, i) => `<button class="sekme ${i === d.ders ? "aktif" : ""}" data-td="${i}">${DERS_SIMGE[x.kod] || ""} ${DERS_AD[x.kod] || x.ad} <span class="kucuk-yazi">${Object.keys(d.cevap[x.kod] || {}).length}/${x.n}</span></button>`).join("");
      $("#tNolar").innerHTML = ders.sorular.map(s => `<button class="tgs-no ${s.no === d.no ? "aktif" : ""} ${c[s.no] ? "dolu" : ""}" data-tno="${s.no}">${s.no}</button>`).join("");
      ana.querySelectorAll(".tgs-secenek .optik-harf").forEach(b => b.classList.toggle("secili", c[d.no] === b.dataset.h));
      ana.querySelectorAll("[data-td]").forEach(b => b.onclick = () => { suredeTut(); d.ders = +b.dataset.td; d.no = 1; DEPO.ayarKaydet(); ciz(); });
      ana.querySelectorAll("[data-tno]").forEach(b => b.onclick = () => { suredeTut(); d.no = +b.dataset.tno; DEPO.ayarKaydet(); ciz(); });
      const kutu = $("#tSoru"); kutu.innerHTML = `<p class="kucuk-yazi muted">${DERS_AD[ders.kod]} · ${q.no}. soru</p>`;
      try { if (q.ortak) await kirp(id, q.ortak, kutu); await kirp(id, q.bolge, kutu); } catch (e) { kutu.insertAdjacentHTML("beforeend", '<p class="muted">Soru gösterilemedi.</p>'); }
    };
    const ileri = yon => {
      suredeTut();
      const ders = v.dersler[d.ders];
      if (yon > 0) { if (d.no < ders.n) d.no++; else if (d.ders < v.dersler.length - 1) { d.ders++; d.no = 1; } }
      else { if (d.no > 1) d.no--; else if (d.ders > 0) { d.ders--; d.no = v.dersler[d.ders].n; } }
      DEPO.ayarKaydet(); ciz(); window.scrollTo(0, 0);
    };
    ana.querySelectorAll(".tgs-secenek .optik-harf").forEach(b => b.onclick = () => {
      const k = v.dersler[d.ders].kod, m = d.cevap[k] = d.cevap[k] || {};
      if (m[d.no] === b.dataset.h) delete m[d.no]; else m[d.no] = b.dataset.h;
      DEPO.ayarKaydet(); ana.querySelectorAll(".tgs-secenek .optik-harf").forEach(x => x.classList.toggle("secili", m[d.no] === x.dataset.h));
      setTimeout(() => { if (m[d.no]) ileri(1); }, 250);
    });
    $("#tBos").onclick = () => { const k = v.dersler[d.ders].kod; if (d.cevap[k]) delete d.cevap[k][d.no]; DEPO.ayarKaydet(); ileri(1); };
    $("#tOnce").onclick = () => ileri(-1); $("#tSonra").onclick = () => ileri(1);
    const yaz = () => { const e = $("#tSaat"); if (!e) { clearInterval(sayac); return; } const k = Math.max(0, kalan()); e.textContent = String(Math.floor(k / 60000)).padStart(2, "0") + ":" + String(Math.floor(k / 1000) % 60).padStart(2, "0"); if (k <= 0) { clearInterval(sayac); toast("Süre bitti!"); bitir(id, v, d); } };
    yaz(); sayac = setInterval(yaz, 1000);
    $("#tBitir").onclick = () => { suredeTut(); const bos = v.dersler.reduce((a, x) => a + x.n - Object.keys(d.cevap[x.kod] || {}).length, 0); if (confirm(bos ? `${bos} soru boş. Sınavı bitirmek istiyor musun?` : "Sınavı bitirmek istiyor musun?")) bitir(id, v, d); };
    ciz();
  }
  function duraklat() { const d = aktifDurum; if (!d) return; if (d.devam) d.gecen += Date.now() - d.devam; d.devam = null; DEPO.ayarKaydet(); }
  document.addEventListener("visibilitychange", () => { const d = aktifDurum; if (!d) return; if (document.hidden) duraklat(); else d.devam = Date.now(); });

  function bitir(id, v, d) {
    clearInterval(sayac); duraklat(); aktifDurum = null;
    const testId = DEPO.uid(), dagilim = {};
    let D = 0, Y = 0, B = 0, n = 0;
    for (const ders of v.dersler) {
      const c = d.cevap[ders.kod] || {}, x = dagilim[ders.kod] = { d: 0, y: 0, b: 0, n: ders.n, ad: DERS_AD[ders.kod] || ders.ad };
      for (const q of ders.sorular) {
        const s = c[q.no], dogru = !!s && s === q.cevap;
        if (!s) x.b++; else if (dogru) x.d++; else x.y++;
        DEPO.kaydet("soru", { ders: ders.kod, konu: null, tema: temaId(ders.kod, q.kaz), kaz: null, kazKod: q.kaz, duzey: null, zorluk: null, mod: "tgsPdf", testId,
          ilkDogru: dogru, sonDogru: dogru, deneme: s ? 1 : 0, ilkSure: d.sure[ders.kod + q.no] || null, toplamSure: d.sure[ders.kod + q.no] || null,
          ipucu: false, cozumGoruldu: false, terk: !s, ilkHata: null, secim: s || null, dogruCevap: q.cevap,
          kaynak: { tip: "tgsPdf", id, ders: ders.kod, no: q.no, ad: v.ad }, sk: `tgs:${id}:${ders.kod}:${q.no}` });
      }
      D += x.d; Y += x.y; B += x.b; n += ders.n;
    }
    const puan = puanHesapla(dagilim);
    DEPO.kaydet("test", { testId, tur: "tgsPdf", ders: "karma", tgsId: id, baslik: v.ad, yazili: v.yaziliId, n, dogru: D, yanlis: Y, bos: B, net: net(D, Y), dagilim, puan, obpPuan: obpPuan(puan), cevaplar: d.cevap, sure: d.gecen });
    delete DEPO.ayar.tgsTaslak[id]; DEPO.ayarKaydet();
    git("#/tgsd/sonuc/" + testId);
  }

  /* ============================ SONUÇ ============================ */
  async function sonucEkrani(testId) {
    const t = DEPO.liste("test").find(x => x.testId === testId); if (!t) return listeEkrani();
    const v = await veriAl(t.tgsId).catch(() => null); if (!v) return listeEkrani();
    const onceki = sonuclar().filter(x => x.t < t.t).pop();
    const satir = Object.entries(t.dagilim).map(([k, x]) => `<tr><td>${DERS_SIMGE[k] || ""} ${x.ad}</td><td class="sayi">${x.n}</td><td class="sayi">${x.d}</td><td class="sayi">${x.y}</td><td class="sayi">${x.b}</td><td class="sayi"><b>${virgul(net(x.d, x.y))}</b></td></tr>`).join("");
    const konular = v.dersler.map(ders => {
      const c = (t.cevaplar || {})[ders.kod] || {};
      const grup = []; // ünite sırası sınavdaki ilk görünüşe göre, sorular sınav sırasında
      for (const q of ders.sorular) { const u = unite(ders.kod, q.kaz); let g = grup.find(x => x.ad === u); if (!g) grup.push(g = { ad: u, l: [] }); g.l.push(q); }
      return `<h3>${DERS_SIMGE[ders.kod] || ""} ${DERS_AD[ders.kod] || ders.ad}</h3>${grup.map(g => { const dd = g.l.filter(q => c[q.no] === q.cevap).length;
        return `<div class="tgs-unite"><div class="satir ara"><span class="kucuk-yazi"><b>${kacis(g.ad)}</b></span><span class="etiket ${dd === g.l.length ? "iyi" : dd / g.l.length < 0.5 ? "kotu" : ""}">${dd}/${g.l.length}</span></div>
          <div class="tgs-nolar">${g.l.map(q => { const s = c[q.no]; return `<button class="tgs-no ${!s ? "bos" : s === q.cevap ? "dogru" : "yanlis"}" data-git="#/tgsd/soru/${testId}/${ders.kod}/${q.no}" title="${q.no}. soru">${q.no}${!s ? "" : s === q.cevap ? " ✓" : " ✗"}</button>`; }).join("")}</div></div>`; }).join("")}`;
    }).join("");
    ana.innerHTML = `<section class="kart vurgu" style="text-align:center"><span class="etiket">${kacis(t.baslik)} · ${new Date(t.t).toLocaleDateString("tr-TR")}</span>
        <div class="izgara dar" style="text-align:left;margin-top:8px">
          <div class="metrik"><b>${virgul(t.puan)}</b><span>tahmini puan (100–500)</span><small>LGS ağırlıklarıyla, resmî değildir</small></div>
          <div class="metrik"><b>${virgul(t.net)}</b><span>toplam net</span><small>${t.dogru} D · ${t.yanlis} Y · ${t.bos} B</small></div>
          ${t.obpPuan ? `<div class="metrik"><b>${virgul(t.obpPuan)}</b><span>OBP ile (bilgi amaçlı)</span><small>%70 sınav + %30 OBP×5</small></div>` : ""}
          ${onceki ? `<div class="metrik"><b>${t.puan >= onceki.puan ? "▲" : "▼"} ${virgul(Math.abs(Math.round((t.puan - onceki.puan) * 100) / 100))}</b><span>önceki denemeye göre</span><small>${kacis(onceki.baslik || "")}</small></div>` : ""}
        </div>
        <div class="tablo" style="text-align:left"><table><thead><tr><th>Ders</th><th class="sayi">Soru</th><th class="sayi">Doğru</th><th class="sayi">Yanlış</th><th class="sayi">Boş</th><th class="sayi">Net</th></tr></thead><tbody>${satir}</tbody></table></div>
        <p class="kucuk-yazi muted">Net = doğru − yanlış ÷ 3. Puan = 100 + 400 × (ağırlıklı net ÷ ağırlıklı soru sayısı); ağırlıklar Türkçe, Matematik ve Fen için 4, diğer dersler için 1.</p></section>
      <section class="kart"><h2>Sorular (konu konu, sınavdaki sırayla)</h2><p class="kucuk-yazi muted">Bir soruya dokun: soru açılır; önce ipucu, sonra adım adım çözüm ve en sonda tam çözüm gösterilir.</p>${konular}</section>`;
    ana.querySelectorAll("[data-git]").forEach(b => b.onclick = () => git(b.dataset.git));
  }

  /* ============================ SORU İNCELEME (ipucu modu) ============================ */
  /* testId "-" ise soru yanlış defterinden ya da listeden açılmıştır; kaynak bilgisi parametredeki "id" ile verilir. */
  async function soruEkrani(testId, kod, no, kaynakId) {
    const t = testId !== "-" ? DEPO.liste("test").find(x => x.testId === testId) : null;
    const id = t ? t.tgsId : kaynakId;
    const v = await veriAl(id).catch(() => null); if (!v) return listeEkrani();
    const ders = v.dersler.find(x => x.kod === kod), q = ders && ders.sorular.find(x => x.no === +no);
    if (!q) return t ? sonucEkrani(testId) : listeEkrani();
    const secim = t ? ((t.cevaplar || {})[kod] || {})[q.no] : null;
    const sk = `tgs:${id}:${kod}:${q.no}`;
    const gecmis = DEPO.liste("soru").filter(s => s.sk === sk);
    const yanlisSay = gecmis.filter(s => !s.ilkDogru && !s.terk).length;
    const sira = v.dersler.flatMap(x => x.sorular.map(s => [x.kod, s.no]));
    const i = sira.findIndex(([k, n]) => k === kod && n === q.no);
    const komsu = j => sira[j] ? `#/tgsd/soru/${testId}/${sira[j][0]}/${sira[j][1]}${t ? "" : "/" + id}` : null;
    ana.innerHTML = `<section class="kart"><p class="yol-iz">${t ? `<a href="#/tgsd/sonuc/${testId}">Sonuç</a>` : `<a href="#/yanlislar">Yanlış defterim</a>`} › ${DERS_AD[kod]} › ${q.no}. soru</p>
        <h2>${kacis(v.ad)} · ${DERS_AD[kod]} ${q.no}. soru</h2>
        <p class="kucuk-yazi muted">${kacis(unite(kod, q.kaz))} · kazanım ${kacis(q.kaz || "")}${yanlisSay > 1 ? ` · <b>${yanlisSay} kez yanlış yapıldı</b>` : ""}</p>
        <div id="sSoru" class="tgs-soru"></div>
        ${t ? `<div class="satir"><span class="etiket ${!secim ? "" : secim === q.cevap ? "iyi" : "kotu"}">Senin cevabın: ${secim || "boş"}</span><span class="etiket" id="sDogru" hidden>Doğru cevap: ${q.cevap}</span></div>` : ""}
        <div id="sYeniden" class="tgs-secenek" ${t ? "hidden" : ""}><span class="kucuk-yazi">Yeniden çöz:</span>${["A", "B", "C", "D"].map(h => `<button class="optik-harf buyuk" data-yh="${h}">${h}</button>`).join("")}</div>
        <div class="satir"><button class="btn" id="sIpucu">💡 İpucu</button><button class="btn" id="sAdim" hidden>Sonraki adım</button><button class="btn ana" id="sTam">Tam çözüm</button>${t ? '<button class="btn" id="sYenidenAc">Yeniden çöz</button>' : ""}</div>
        <div id="sCozum" class="tgs-cozum"></div>
        <div class="satir ara"><button class="btn" id="sOnce" ${komsu(i - 1) ? "" : "disabled"}>◀ Önceki soru</button><button class="btn" id="sSonra" ${komsu(i + 1) ? "" : "disabled"}>Sonraki soru ▶</button></div></section>`;
    const kutu = $("#sSoru");
    try { if (q.ortak) await kirp(id, q.ortak, kutu); await kirp(id, q.bolge, kutu); } catch (e) { kutu.textContent = "Soru gösterilemedi."; }
    let adim = 0;
    const coz = $("#sCozum");
    const adimGoster = async () => {
      if (adim >= q.adimlar.length) return;
      if (adim === 0) coz.insertAdjacentHTML("beforeend", `<p class="kucuk-yazi"><b>💡 İpucu (1. adım)</b></p>`);
      else coz.insertAdjacentHTML("beforeend", `<p class="kucuk-yazi"><b>${adim + 1}. adım</b></p>`);
      await bolgeler(id, q.adimlar[adim], coz); adim++;
      $("#sIpucu").hidden = true; $("#sAdim").hidden = adim >= q.adimlar.length;
      if (adim >= q.adimlar.length) { const e = $("#sDogru"); if (e) e.hidden = false; }
    };
    $("#sIpucu").onclick = adimGoster; $("#sAdim").onclick = adimGoster;
    $("#sTam").onclick = async () => { coz.innerHTML = `<p class="kucuk-yazi"><b>✅ Tam çözüm</b></p>`; await kirp(id, q.baslik, coz); for (const a of q.adimlar) await bolgeler(id, a, coz); adim = q.adimlar.length; ["#sIpucu", "#sAdim", "#sTam"].forEach(s => { $(s).hidden = true; }); const e = $("#sDogru"); if (e) e.hidden = false; };
    if ($("#sYenidenAc")) $("#sYenidenAc").onclick = () => { $("#sYeniden").hidden = false; $("#sYenidenAc").hidden = true; };
    let bas = Date.now();
    ana.querySelectorAll("[data-yh]").forEach(b => b.onclick = () => {
      const s = b.dataset.yh, dogru = s === q.cevap;
      DEPO.kaydet("soru", { ders: kod, konu: null, tema: temaId(kod, q.kaz), kaz: null, kazKod: q.kaz, mod: "yenidenCoz", testId: null, ilkDogru: dogru, sonDogru: dogru, deneme: 1, ilkSure: Date.now() - bas, toplamSure: Date.now() - bas,
        ipucu: adim > 0, cozumGoruldu: adim >= q.adimlar.length, terk: false, ilkHata: null, secim: s, dogruCevap: q.cevap, kaynak: { tip: "tgsPdf", id, ders: kod, no: q.no, ad: v.ad }, sk, tekrar: true });
      ana.querySelectorAll("[data-yh]").forEach(x => { x.disabled = true; x.classList.toggle(x.dataset.yh === q.cevap ? "dogru" : "x", x.dataset.yh === q.cevap); if (x === b && !dogru) x.classList.add("yanlis"); });
      toast(dogru ? "Doğru! 🎉" : "Olmadı. Çözüm adımlarına bak.");
      if (!dogru && !adim) adimGoster();
    });
    $("#sOnce").onclick = () => komsu(i - 1) && git(komsu(i - 1));
    $("#sSonra").onclick = () => komsu(i + 1) && git(komsu(i + 1));
  }

  function ac(a, b, c, d) {
    if (a === "coz") return cozEkrani(b);
    if (a === "sonuc") return sonucEkrani(b);
    if (a === "soru") return soruEkrani(b, c, d, arguments[4]);
    return listeEkrani();
  }
  window.TGSD = { ac, kapat: () => { clearInterval(sayac); duraklat(); aktifDurum = null; }, unite, puanHesapla, DERS_AD, liste, veriAl };
})();
