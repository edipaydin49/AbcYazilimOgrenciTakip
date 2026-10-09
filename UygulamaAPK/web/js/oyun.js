/* “Türkçe Diyarı” oyunu: üç adanın kaybolan yıldızlarını toplama.
 * Her ada bir tema, her görev bir konudur (ders kitabındaki bir metin). Görevde 5 soru vardır:
 * 3 seçenekli sorular (konunun soru havuzundan) ve oyuna özel eşleştirme, sıralama, kelime üretme görevleri.
 * Puan: doğru cevap +10, görevi bitirme +20. Her doğru cevap 1 yıldız; bir görevde 3 yıldız toplayınca
 * sıradaki görev açılır. Adadaki bütün görevler 3+ yıldızla geçilince ada rozeti kazanılır.
 * Kayıtlar: her cevap “soru” (mod: "oyun"), her bitirilen görev “oyun” olayı olarak saklanır.
 */
(function () {
  "use strict";
  const { DERS, KONU, soruUret, yardim } = ICERIK;
  const { karistir, sec } = yardim;
  const DERS_ID = "tr", GOREV_SORU = 5, GECME_YILDIZ = 3, DOGRU_PUAN = 10, BITIRME_PUAN = 20;
  const $ = s => document.querySelector(s);
  const ana = () => $("#ana");
  const U = () => window.UYG;
  const kucuk = s => String(s).toLocaleLowerCase("tr-TR").replace(/\s+/g, "");

  /* ---------------- İlerleme ---------------- */
  function ilerleme() {
    const ders = DERS[DERS_ID]; if (!ders) return null;
    const oyunlar = DEPO.liste("oyun").filter(o => o.ders === DERS_ID);
    const enIyi = {}, oynama = {};
    let puan = 0;
    oyunlar.forEach(o => { enIyi[o.konu] = Math.max(enIyi[o.konu] || 0, o.yildiz || 0); oynama[o.konu] = (oynama[o.konu] || 0) + 1; puan += o.puan || 0; });
    const hepsiAcik = !!DEPO.ayar.oyunHepsiAcik;
    const adalar = ders.temaListesi.map((t, ai) => {
      const gorevler = t.konular.map((k, gi) => ({ konu: k, yildiz: enIyi[k] || 0, oynama: oynama[k] || 0 }));
      return { tema: t, gorevler, rozet: gorevler.length > 0 && gorevler.every(g => g.yildiz >= GECME_YILDIZ), yildiz: gorevler.reduce((a, g) => a + g.yildiz, 0), toplam: gorevler.length * GOREV_SORU };
    });
    adalar.forEach((a, ai) => {
      a.acik = hepsiAcik || ai === 0 || adalar[ai - 1].rozet;
      a.gorevler.forEach((g, gi) => { g.acik = a.acik && (hepsiAcik || gi === 0 || a.gorevler[gi - 1].yildiz >= GECME_YILDIZ); });
    });
    return { adalar, puan, yildiz: adalar.reduce((a, x) => a + x.yildiz, 0), toplam: adalar.reduce((a, x) => a + x.toplam, 0), rozet: adalar.filter(a => a.rozet).length };
  }
  const yildizlar = (n, toplam = GOREV_SORU) => "★".repeat(n) + "☆".repeat(Math.max(0, toplam - n));

  /* ---------------- Harita ---------------- */
  function harita() {
    const p = ilerleme(); if (!p) return U().git("#/");
    ana().innerHTML = `<section class="kart vurgu oyun-baslik"><div class="satir ara"><div><span class="etiket">📖 Türkçe oyunu</span><h1 style="margin-top:6px">Türkçe Diyarı</h1></div>
        <div class="oyun-sayac"><span>⭐ ${p.yildiz}/${p.toplam}</span><span>🪙 ${p.puan}</span><span>🏅 ${p.rozet}/3</span></div></div>
        <p>Türkçe Diyarı'ndaki üç adanın yıldızları kayboldu! Her görevde 5 soru var. Her doğru cevap bir yıldız ve <b>+10 puan</b>; görevi bitirince <b>+20 puan</b>. Bir görevde <b>3 yıldız</b> toplayınca sıradaki görevin kapısı açılır, adanın bütün görevlerini geçince <b>rozet</b> kazanırsın.</p></section>
      <section class="izgara">${p.adalar.map((a, i) => `<button class="kart oyun-ada ${a.acik ? "" : "kilitli"}" data-ada="${a.tema.id}" ${a.acik ? "" : "disabled"}>
          <span class="oyun-ada-simge">${a.acik ? a.tema.ada.simge : "🔒"}</span>
          <span class="etiket">${i + 1}. Ada · kitap ${a.tema.sayfa}</span><h2>${a.tema.ada.ad}</h2>
          <span class="oyun-yildiz">${"⭐".repeat(Math.min(5, Math.round(5 * a.yildiz / Math.max(1, a.toplam))))}<span class="muted"> ${a.yildiz}/${a.toplam} yıldız</span></span>
          <span class="kucuk-yazi">${a.rozet ? `${a.tema.ada.rozetSimge} <b>${a.tema.ada.rozet}</b> rozeti kazanıldı!` : a.acik ? `Ödül: ${a.tema.ada.rozetSimge} ${a.tema.ada.rozet} rozeti` : "Önceki adanın rozetini kazanınca açılır."}</span></button>`).join("")}</section>
      <section class="kart"><h2>Rozetlerim</h2><div class="satir">${p.adalar.map(a => `<span class="oyun-rozet ${a.rozet ? "" : "yok"}" title="${a.tema.ada.rozet}">${a.tema.ada.rozetSimge}<br><small>${a.tema.ada.rozet}</small></span>`).join("")}</div></section>`;
    ana().querySelectorAll("[data-ada]").forEach(b => b.onclick = () => U().git("#/oyun/ada/" + b.dataset.ada));
  }

  function adaEkrani(temaId) {
    const p = ilerleme(); const a = p && p.adalar.find(x => x.tema.id === temaId);
    if (!a || !a.acik) return harita();
    ana().innerHTML = `<section class="kart vurgu"><p class="yol-iz"><a href="#/oyun">Türkçe Diyarı</a> › ${a.tema.kisa}</p>
        <div class="satir ara"><h1>${a.tema.ada.simge} ${a.tema.ada.ad}</h1><span class="oyun-sayac"><span>⭐ ${a.yildiz}/${a.toplam}</span></span></div>
        <p class="muted">Kitap ${a.tema.sayfa} · Ödül: ${a.tema.ada.rozetSimge} <b>${a.tema.ada.rozet}</b></p></section>
      <section class="oyun-yol">${a.gorevler.map((g, i) => { const k = KONU[g.konu];
        return `<button class="oyun-gorev ${g.acik ? "" : "kilitli"} ${g.yildiz >= GECME_YILDIZ ? "gecti" : ""}" data-gorev="${g.konu}" ${g.acik ? "" : "disabled"}>
          <span class="oyun-dugum">${g.acik ? i + 1 : "🔒"}</span>
          <span><b>${k.ad}</b><br><span class="kucuk-yazi muted">${k.gorev} · kitap ${k.sayfa}</span><br><span class="oyun-yildiz">${yildizlar(g.yildiz)}</span>${g.oynama ? `<span class="kucuk-yazi muted"> · ${g.oynama} kez oynandı</span>` : ""}</span></button>`; }).join("")}</section>
      <section class="izgara dar"><a class="btn" href="#/oyun">← Haritaya dön</a><a class="btn" href="#/ders/tr">Türkçe ders sayfası</a></section>`;
    ana().querySelectorAll("[data-gorev]").forEach(b => b.onclick = () => U().git("#/oyun/gorev/" + b.dataset.gorev));
  }

  /* ---------------- Görev ---------------- */
  let aktif = null;
  function gorevHazirla(konuId) {
    const k = KONU[konuId];
    const ozel = karistir(k.oyun || []);
    const ozelSay = Math.min(ozel.length, k.id.startsWith("tr_uret") ? 3 : 2);
    const ogeler = ozel.slice(0, ozelSay).map(o => ({ tur: o.tur, o: JSON.parse(JSON.stringify(o)) }));
    const gorulen = new Set();
    for (let deneme = 0; ogeler.length < GOREV_SORU && deneme < 60; deneme++) {
      const kaz = sec(k.kazanimlar).id;
      const q = soruUret(kaz, sec([1, 1, 2, 2, 3]));
      if (gorulen.has(q.soru)) continue;
      gorulen.add(q.soru);
      // Oyunda 3 seçenek: doğru + rastgele iki çeldirici
      const dogru = q.secenekler.find(s => s.dogru);
      const yanlis = karistir(q.secenekler.filter(s => !s.dogru)).slice(0, 2);
      ogeler.push({ tur: "secmeli", q, secenekler: karistir([dogru, ...yanlis]) });
    }
    return { konu: konuId, ogeler: karistir(ogeler), i: 0, dogru: 0, puan: 0, bas: Date.now(), cevap: null, oncekiEnIyi: (ilerleme().adalar.flatMap(a => a.gorevler).find(g => g.konu === konuId) || {}).yildiz || 0 };
  }
  function gorevBaslat(konuId) {
    const p = ilerleme(); const g = p && p.adalar.flatMap(a => a.gorevler).find(x => x.konu === konuId);
    if (!g || !g.acik) return harita();
    aktif = gorevHazirla(konuId);
    ogeCiz();
  }
  function ust(k) {
    const t = aktif;
    return `<div class="satir ara"><span class="etiket">${k.ad} · görev ${t.i + 1}/${t.ogeler.length}</span><span class="oyun-sayac"><span>⭐ ${t.dogru}</span><span>🪙 ${t.puan}</span></span></div>
      <div class="ilerleme">${t.ogeler.map((o, j) => `<i class="${j <= t.i && o.sonuc != null ? (o.sonuc ? "d" : "y") : j === t.i ? "s" : ""}"></i>`).join("")}</div>`;
  }
  function kaydet(oge, dogru, ekstra = {}) {
    const k = KONU[aktif.konu];
    const q = oge.q;
    DEPO.kaydet("soru", {
      ders: DERS_ID, konu: k.id, tema: k.tema, kaz: q ? q.kaz : oge.o.kaz, duzey: q ? q.duzey : "uygulama", zorluk: q ? q.zorluk : 2, mod: "oyun", testId: aktif.testId || (aktif.testId = DEPO.uid()),
      ilkDogru: dogru, sonDogru: dogru, deneme: 1, ilkSure: Date.now() - (oge.bas || aktif.bas), toplamSure: Date.now() - (oge.bas || aktif.bas), ipucu: !!ekstra.ipucu, cozumGoruldu: false, terk: false,
      ilkHata: q && !dogru ? ekstra.hata || null : null, kendiHata: null, kontrol: false, ref: null, soruNesnesi: q || null, oyunTur: oge.tur,
    });
    oge.sonuc = dogru;
    if (dogru) { aktif.dogru++; aktif.puan += DOGRU_PUAN; puanUcur("+" + DOGRU_PUAN); }
  }
  function puanUcur(m) {
    const e = document.createElement("div"); e.className = "oyun-ucan"; e.textContent = m + " ⭐"; document.body.appendChild(e); setTimeout(() => e.remove(), 1200);
  }
  function geriBildirim(dogru, metin, ekMetin) {
    return `<div class="geri ${dogru ? "iyi" : "kotu"}"><b>${dogru ? sec(["Harika! Bir yıldız daha!", "Süpersin! +10 puan", "Tam isabet! Yıldızı kaptın!"]) : sec(["Olsun, öğrenmek için buradayız!", "Bu sefer olmadı, ama şimdi öğrendin!", "Puanın silinmedi; açıklamaya göz at."])}</b>${metin ? `<p>${metin}</p>` : ""}${ekMetin || ""}</div>
      <div class="satir"><button class="btn ana" id="oDevam">${aktif.i < aktif.ogeler.length - 1 ? "Sonraki soru →" : "Görevi bitir 🎉"}</button></div>`;
  }
  function ogeCiz() {
    const t = aktif, oge = t.ogeler[t.i], k = KONU[t.konu];
    oge.bas = oge.bas || Date.now();
    const kutu = `<section class="kart vurgu oyun-kart">${ust(k)}<div id="oIcerik"></div></section>`;
    ana().innerHTML = kutu;
    ({ secmeli: secmeliCiz, eslestir: eslestirCiz, sirala: siralaCiz, uret: uretCiz }[oge.tur])(oge, $("#oIcerik"));
    window.scrollTo(0, 0);
  }
  function devamBagla() { const b = $("#oDevam"); if (b) b.onclick = () => { if (aktif.i < aktif.ogeler.length - 1) { aktif.i++; ogeCiz(); } else gorevBitir(); }; }

  /* 3 seçenekli soru */
  function secmeliCiz(oge, kok) {
    const q = oge.q, kacis = U().kacis;
    const ciz = () => {
      const c = oge.cevap;
      kok.innerHTML = `<p class="soru-metin">${q.soru}</p>${q.gorsel ? `<div class="gorsel">${q.gorsel}</div>` : ""}
        <div class="secenekler">${oge.secenekler.map((s, j) => { let cl = "sec"; if (c != null && s.dogru) cl += " dogru"; if (c === j && !s.dogru) cl += " yanlis";
          return `<button class="${cl}" data-j="${j}" ${c != null ? "disabled" : ""}><b>${"ABC"[j]}</b><span>${kacis(s.m)}</span></button>`; }).join("")}</div>
        ${c != null ? (() => { const s = oge.secenekler[c], d = oge.secenekler.find(x => x.dogru);
          return geriBildirim(s.dogru, s.dogru ? kacis(d.neden || "") : `<b>Doğru cevap:</b> ${kacis(d.m)}. ${kacis(s.neden || "")}`, q.kural ? `<div class="unutma"><b>Unutma:</b> ${kacis(q.kural)}</div>` : ""); })() : ""}`;
      kok.querySelectorAll("[data-j]").forEach(b => b.onclick = () => { oge.cevap = +b.dataset.j; const s = oge.secenekler[oge.cevap]; kaydet(oge, !!s.dogru, { hata: s.hata }); ogeCizUst(); ciz(); });
      devamBagla();
    };
    ciz();
  }
  function ogeCizUst() {  // üstteki sayaç ve ilerleme çubuğunu yeniler
    const kart = $(".oyun-kart"); if (!kart) return;
    const yeni = document.createElement("div"); yeni.innerHTML = ust(KONU[aktif.konu]);
    kart.children[0].replaceWith(yeni.children[0]); kart.children[1].replaceWith(yeni.children[0]);
  }

  /* Eşleştirme: soldan bir öğe, sağdan eşini seç. En fazla 1 hata ile yıldız kazanılır. */
  function eslestirCiz(oge, kok) {
    const o = oge.o, kacis = U().kacis;
    if (!oge.sag) { oge.sag = karistir(o.ciftler.map((c, i) => i)); oge.eslesen = new Set(); oge.hata = 0; oge.secili = null; }
    const ciz = (son) => {
      const bitti = oge.eslesen.size === o.ciftler.length || oge.vazgecti;
      kok.innerHTML = `<p class="soru-metin">${o.soru}</p><p class="kucuk-yazi muted">Önce soldan bir kutuya, sonra sağdan eşine dokun. ${o.ciftler.length - oge.eslesen.size} eşleşme kaldı · hata: ${oge.hata}</p>
        <div class="oyun-eslestir"><div>${o.ciftler.map((c, i) => `<button class="sec ${oge.eslesen.has(i) ? "dogru" : oge.secili === i ? "secili" : ""}" data-sol="${i}" ${oge.eslesen.has(i) || bitti ? "disabled" : ""}><span>${kacis(c[0])}</span></button>`).join("")}</div>
          <div>${oge.sag.map(i => `<button class="sec ${oge.eslesen.has(i) ? "dogru" : son === i ? "yanlis" : ""}" data-sag="${i}" ${oge.eslesen.has(i) || bitti ? "disabled" : ""}><span>${kacis(o.ciftler[i][1])}</span></button>`).join("")}</div></div>
        ${bitti ? geriBildirim(oge.sonuc, kacis(o.aciklama), `<p class="kucuk-yazi">${o.ciftler.map(c => `${kacis(c[0])} → ${kacis(c[1])}`).join(" · ")}</p>`) : `<div class="satir"><button class="btn kucuk" id="oVazgec">Cevapları göster</button></div>`}`;
      kok.querySelectorAll("[data-sol]").forEach(b => b.onclick = () => { oge.secili = +b.dataset.sol; ciz(); });
      kok.querySelectorAll("[data-sag]").forEach(b => b.onclick = () => {
        if (oge.secili == null) return U().toast("Önce soldan bir kutu seç.");
        const i = +b.dataset.sag;
        if (i === oge.secili) { oge.eslesen.add(i); oge.secili = null; if (oge.eslesen.size === o.ciftler.length) { kaydet(oge, oge.hata <= 1); ogeCizUst(); } ciz(); }
        else { oge.hata++; ciz(i); }
      });
      const v = $("#oVazgec"); if (v) v.onclick = () => { oge.vazgecti = true; o.ciftler.forEach((_, i) => oge.eslesen.add(i)); kaydet(oge, false); ogeCizUst(); ciz(); };
      devamBagla();
    };
    ciz();
  }

  /* Sıralama: öğelere doğru sırayla dokun. */
  function siralaCiz(oge, kok) {
    const o = oge.o, kacis = U().kacis;
    if (!oge.karisik) { let k; do { k = karistir(o.ogeler.map((_, i) => i)); } while (k.every((x, i) => x === i)); oge.karisik = k; oge.dizi = []; }
    const ciz = () => {
      const tamam = oge.dizi.length === o.ogeler.length && oge.kontrol;
      kok.innerHTML = `<p class="soru-metin">${o.soru}</p><p class="kucuk-yazi muted">Öğelere doğru sırayla dokun. Yanlış dokunursan “Sıfırla” ile baştan başlayabilirsin.</p>
        <ol class="oyun-dizi">${o.ogeler.map((_, j) => { const i = oge.dizi[j]; const durum = tamam ? (i === j ? "dogru" : "yanlis") : ""; return `<li class="${durum}">${i != null ? kacis(o.ogeler[i]) : "…"}</li>`; }).join("")}</ol>
        <div class="secenekler">${oge.karisik.map(i => `<button class="sec" data-i="${i}" ${oge.dizi.includes(i) || tamam ? "disabled" : ""}><span>${kacis(o.ogeler[i])}</span></button>`).join("")}</div>
        ${tamam ? geriBildirim(oge.sonuc, kacis(o.aciklama), oge.sonuc ? "" : `<p><b>Doğru sıra:</b> ${o.ogeler.map((x, j) => (j + 1) + ") " + kacis(x)).join("  ")}</p>`)
          : `<div class="satir"><button class="btn kucuk" id="oSifirla" ${oge.dizi.length ? "" : "disabled"}>Sıfırla</button>${oge.dizi.length === o.ogeler.length ? `<button class="btn ana" id="oKontrol">Kontrol et</button>` : ""}</div>`}`;
      kok.querySelectorAll("[data-i]").forEach(b => b.onclick = () => { oge.dizi.push(+b.dataset.i); ciz(); });
      const s = $("#oSifirla"); if (s) s.onclick = () => { oge.dizi = []; ciz(); };
      const k = $("#oKontrol"); if (k) k.onclick = () => { oge.kontrol = true; kaydet(oge, oge.dizi.every((x, j) => x === j)); ogeCizUst(); ciz(); };
      devamBagla();
    };
    ciz();
  }

  /* Kelime üretme: harf kutucuklarına dokunarak kelime yaz; hedef kadar geçerli kelime bul. */
  function uretCiz(oge, kok) {
    const o = oge.o, kacis = U().kacis;
    const harfler = [...o.harfler.toLocaleUpperCase("tr-TR")].filter(c => c.trim());
    const kabul = new Set(o.kelimeler.map(kucuk));
    if (!oge.bulunan) { oge.bulunan = []; oge.yazilan = []; oge.ipucu = 0; }
    const ciz = (mesaj) => {
      const bitti = oge.sonuc != null;
      const kelime = oge.yazilan.map(i => harfler[i]).join("");
      kok.innerHTML = `<p class="soru-metin">${o.soru}</p><p class="kucuk-yazi muted">Harflere dokunarak kelime yaz. Her harfi bir kelimede bir kez kullanabilirsin. Hedef: <b>${o.hedef} kelime</b> · bulunan: ${oge.bulunan.length}</p>
        <div class="oyun-kelime">${kelime ? kacis(kelime) : "<span class='muted'>…</span>"}</div>
        <div class="oyun-harfler">${harfler.map((h, i) => `<button class="oyun-harf" data-h="${i}" ${oge.yazilan.includes(i) || bitti ? "disabled" : ""}>${h}</button>`).join("")}</div>
        ${mesaj ? `<p class="kucuk-yazi"><b>${mesaj}</b></p>` : ""}
        <div class="cips">${oge.bulunan.map(w => `<span class="cip secili">${kacis(w)}</span>`).join("")}</div>
        ${bitti ? geriBildirim(oge.sonuc, kacis(o.aciklama), `<p class="kucuk-yazi">Bu harflerle yazılabilecek bazı kelimeler: ${o.kelimeler.slice(0, 10).map(w => kacis(w)).join(", ")}</p>`)
          : `<div class="satir"><button class="btn ana" id="oEkle" ${kelime.length >= 2 ? "" : "disabled"}>Kelimeyi ekle</button><button class="btn kucuk" id="oSil" ${kelime ? "" : "disabled"}>⌫ Sil</button><button class="btn kucuk" id="oIpucu">İpucu</button><button class="btn kucuk" id="oBitir">Pes et</button></div>`}`;
      kok.querySelectorAll("[data-h]").forEach(b => b.onclick = () => { oge.yazilan.push(+b.dataset.h); ciz(); });
      const on = (id, f) => { const e = $(id); if (e) e.onclick = f; };
      on("#oSil", () => { oge.yazilan.pop(); ciz(); });
      on("#oEkle", () => {
        const w = kucuk(kelime); oge.yazilan = [];
        if (oge.bulunan.map(kucuk).includes(w)) return ciz("Bu kelimeyi zaten buldun.");
        if (!kabul.has(w)) return ciz(`“${kelime}” listemde yok. Başka bir kelime dene!`);
        oge.bulunan.push(kelime.toLocaleLowerCase("tr-TR"));
        if (oge.bulunan.length >= o.hedef) { kaydet(oge, oge.ipucu <= 1, { ipucu: oge.ipucu > 0 }); ogeCizUst(); return ciz(); }
        ciz("Süper! Bir kelime daha bul.");
      });
      on("#oIpucu", () => { const w = o.kelimeler.find(x => !oge.bulunan.map(kucuk).includes(kucuk(x))); oge.ipucu++; ciz(w ? `İpucu: “${w[0].toLocaleUpperCase("tr-TR")}” harfiyle başlayan ${w.length} harfli bir kelime var.` : "Başka kelime kalmadı."); });
      on("#oBitir", () => { kaydet(oge, false); ogeCizUst(); ciz(); });
      devamBagla();
    };
    ciz();
  }

  function gorevBitir() {
    const t = aktif, k = KONU[t.konu];
    const once = ilerleme();
    t.puan += BITIRME_PUAN;
    DEPO.kaydet("oyun", { ders: DERS_ID, konu: t.konu, tema: k.tema, dogru: t.dogru, n: t.ogeler.length, yildiz: t.dogru, puan: t.puan, sure: Date.now() - t.bas });
    const sonra = ilerleme();
    const ada = sonra.adalar.find(a => a.tema.id === k.tema), adaOnce = once.adalar.find(a => a.tema.id === k.tema);
    const sira = ada.gorevler.findIndex(g => g.konu === t.konu);
    const sonraki = ada.gorevler[sira + 1];
    const yeniAcilan = sonraki && sonraki.acik && !adaOnce.gorevler[sira + 1].acik;
    const yeniRozet = ada.rozet && !adaOnce.rozet;
    const gecti = t.dogru >= GECME_YILDIZ;
    ana().innerHTML = `<section class="kart vurgu" style="text-align:center">
        <span class="etiket">${k.ad} · görev tamamlandı</span>
        <p class="oyun-buyuk-yildiz">${yildizlar(t.dogru, t.ogeler.length)}</p>
        <h2>${t.dogru === t.ogeler.length ? "Muhteşem! Bütün yıldızları topladın!" : gecti ? "Tebrikler, görevi geçtin!" : "Güzel deneme! 3 yıldıza çok az kaldı."}</h2>
        <p>Bu görevde <b>${t.dogru} yıldız</b> ve <b>${t.puan} puan</b> kazandın (görevi bitirme ödülü +${BITIRME_PUAN} dahil).</p>
        ${t.dogru > t.oncekiEnIyi && t.oncekiEnIyi ? `<p class="etiket iyi">Yeni rekor! Önceki en iyi: ${t.oncekiEnIyi} yıldız</p>` : ""}
        ${yeniAcilan ? `<div class="geri iyi"><b>🔓 Yeni görev açıldı:</b> ${KONU[sonraki.konu].ad}</div>` : ""}
        ${!gecti ? `<div class="geri bilgi">Sıradaki görevi açmak için bu görevde en az ${GECME_YILDIZ} yıldız topla. İstersen önce konu anlatımına göz at!</div>` : ""}
      </section>
      ${yeniRozet ? `<section class="kart sari oyun-rozet-kutlama" style="text-align:center"><p style="font-size:4rem;margin:0">${ada.tema.ada.rozetSimge}</p><h2>${ada.tema.ada.rozet} rozetini kazandın!</h2><p>${ada.tema.ada.ad}'nın bütün yıldızlarını kurtardın.${sonra.adalar.find((a, i) => i > 0 && a.acik && !once.adalar[i].acik) ? " Yeni bir ada açıldı!" : ""}</p></section>` : ""}
      <section class="izgara dar">
        <button class="btn" id="oTekrar">Tekrar oyna</button>
        ${sonraki && sonraki.acik ? `<a class="btn ana" href="#/oyun/gorev/${sonraki.konu}">Sıradaki görev →</a>` : ""}
        ${!gecti ? `<a class="btn" href="#/anlatim/${t.konu}">Konu anlatımı</a>` : ""}
        <a class="btn" href="#/oyun/ada/${k.tema}">Adaya dön</a>
      </section>`;
    $("#oTekrar").onclick = () => gorevBaslat(t.konu);
    aktif = null;
  }

  /* Veli paneli ve ana sayfa için özet */
  function ozet() { return ilerleme(); }
  function konuOzet(konuId) {
    const l = DEPO.liste("oyun").filter(o => o.konu === konuId);
    return l.length ? { oynama: l.length, enIyi: Math.max(...l.map(o => o.yildiz || 0)), puan: l.reduce((a, o) => a + (o.puan || 0), 0), son: l[l.length - 1] } : null;
  }

  function ac(a, b) {
    if (!DERS[DERS_ID]) return U().git("#/");
    if (a === "ada") return adaEkrani(b);
    if (a === "gorev") return gorevBaslat(b);
    return harita();
  }
  window.OYUN = { ac, ozet, konuOzet, GECME_YILDIZ, GOREV_SORU, durum: () => aktif };  // durum: otomatik testler için
})();
