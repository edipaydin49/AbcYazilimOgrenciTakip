/* İngilizce oyunları: Downtown Master (şehir kurma, yer–yön), At the Fair Roller Coaster (duygu sıfatları),
 * Yummy Breakfast Chef (kahvaltı ve istek kalıpları), Weather & Clothes (hava durumu–giysi).
 * Her oyun: tur başına puan, en iyi skor, cevaplar “soru” (mod: "oyun"), biten oyun “oyun” olayı olarak kaydedilir.
 * Sürükle-bırak (parmakla) ve dokun-dokun ile oynanabilir. 🔊 düğmeleri cihazın İngilizce sesiyle okur.
 */
(function () {
  "use strict";
  const { KONU, yardim } = ICERIK;
  const { karistir, sec, R } = yardim;
  const $ = s => document.querySelector(s);
  const U = () => window.UYG;
  const ana = () => $("#ana");
  const DERS = "en";
  let SON = null;  // aktif oyun durumu (otomatik testler için)

  /* ---------------- Ses ---------------- */
  const sesVar = () => (window.Android && Android.sesVar && Android.sesVar()) || ("speechSynthesis" in window);
  function oku(metin, hiz = 0.9) {
    metin = String(metin).replace(/<[^>]+>/g, " ").replace(/_{2,}/g, " blank ").replace(/\s+/g, " ").trim();
    if (window.Android && Android.konus && Android.sesVar && Android.sesVar()) return Android.konus(metin, hiz);
    if ("speechSynthesis" in window) { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(metin); u.lang = "en-GB"; u.rate = hiz; speechSynthesis.speak(u); } catch (e) {} }
  }
  const sesBtn = (metin, kucuk) => `<button class="btn ${kucuk ? "kucuk" : ""} ses-btn" data-oku="${U().kacis(metin)}" aria-label="Sesli oku">🔊</button>`;
  function sesBagla(kok) { (kok || document).querySelectorAll("[data-oku]").forEach(b => b.onclick = e => { e.stopPropagation(); oku(b.dataset.oku); }); }

  /* ---------------- Kayıt ve skor ---------------- */
  function kaydetCevap(konuId, dogru, sure) {
    const k = KONU[konuId]; if (!k) return;
    DEPO.kaydet("soru", { ders: DERS, konu: konuId, tema: k.tema, kaz: k.kazanimlar[0].id, duzey: "uygulama", zorluk: 2, mod: "oyun", ilkDogru: dogru, sonDogru: dogru, deneme: 1,
      ilkSure: sure, toplamSure: sure, ipucu: false, cozumGoruldu: false, terk: false, ilkHata: dogru ? null : "kavrama", kendiHata: null, kontrol: false, ref: null, soruNesnesi: null });
  }
  function enIyi(oyun) { return DEPO.liste("oyun").filter(o => o.ders === DERS && o.oyun === oyun).reduce((a, o) => Math.max(a, o.puan || 0), 0); }
  function oyunBitti(oyun, konuId, puan, dogru, n, bas) {
    const once = enIyi(oyun);
    DEPO.kaydet("oyun", { ders: DERS, oyun, konu: konuId, tema: KONU[konuId] ? KONU[konuId].tema : null, puan, dogru, n, yildiz: Math.round(5 * dogru / n), sure: Date.now() - bas });
    return { rekor: puan > once, once };
  }
  function bitisEkrani(oyun, baslik, puan, dogru, n, sonuc, ekHtml) {
    const yildiz = Math.round(5 * dogru / n);
    ana().innerHTML = `<section class="kart vurgu" style="text-align:center"><span class="etiket">${baslik}</span>
        <p class="oyun-buyuk-yildiz">${"★".repeat(yildiz)}${"☆".repeat(5 - yildiz)}</p>
        <h2>${dogru === n ? "Perfect! Mükemmel!" : dogru / n >= 0.7 ? "Great job! Çok iyi!" : dogru / n >= 0.4 ? "Good try! İyi deneme!" : "Keep practising! Çalışmaya devam!"}</h2>
        <p><b>${puan} puan</b> · ${dogru}/${n} doğru</p>
        ${sonuc.rekor ? `<p class="etiket iyi">🏆 Yeni rekor!${sonuc.once ? " Önceki en iyi: " + sonuc.once : ""}</p>` : `<p class="muted">En iyi skorun: ${Math.max(sonuc.once, puan)}</p>`}
        ${ekHtml || ""}</section>
      <section class="izgara dar"><button class="btn ana" id="gTekrar">Tekrar oyna</button><a class="btn" href="#/ing">Oyunlara dön</a><a class="btn" href="#/ders/en">İngilizce ders sayfası</a></section>`;
    $("#gTekrar").onclick = () => OYUNLAR[oyun].baslat();
  }
  function ustBar(baslik, i, n, puan, ek) {
    return `<div class="satir ara"><span class="etiket">${baslik} · ${i + 1}/${n}</span><span class="oyun-sayac">${ek || ""}<span>🪙 ${puan}</span></span></div>`;
  }

  /* ---------------- Sürükle-bırak yardımcısı (parmak ve fare) ---------------- */
  function surukle(kaynakSecici, hedefSecici, birak) {
    ana().querySelectorAll(kaynakSecici).forEach(el => {
      el.addEventListener("pointerdown", e => {
        if (el.disabled) return;
        const bx = e.clientX, by = e.clientY; let hayalet = null, tasindi = false;
        const hareket = ev => {
          if (!tasindi && Math.hypot(ev.clientX - bx, ev.clientY - by) < 8) return;
          if (!tasindi) { tasindi = true; hayalet = el.cloneNode(true); hayalet.classList.add("surukle-hayalet"); document.body.appendChild(hayalet); }
          hayalet.style.left = ev.clientX + "px"; hayalet.style.top = ev.clientY + "px";
          ana().querySelectorAll(hedefSecici).forEach(h => h.classList.remove("hedef-ustunde"));
          const h = document.elementFromPoint(ev.clientX, ev.clientY); const hd = h && h.closest(hedefSecici); if (hd) hd.classList.add("hedef-ustunde");
        };
        const bitir = ev => {
          document.removeEventListener("pointermove", hareket); document.removeEventListener("pointerup", bitir); document.removeEventListener("pointercancel", bitir);
          if (!tasindi) return;
          hayalet.remove(); ana().querySelectorAll(hedefSecici).forEach(h => h.classList.remove("hedef-ustunde"));
          el.dataset.suruklendi = "1"; setTimeout(() => { delete el.dataset.suruklendi; }, 50);
          const h = document.elementFromPoint(ev.clientX, ev.clientY); const hd = h && h.closest(hedefSecici);
          if (hd) birak(el, hd);
        };
        document.addEventListener("pointermove", hareket); document.addEventListener("pointerup", bitir); document.addEventListener("pointercancel", bitir);
      });
    });
  }

  /* ======================= 1. DOWNTOWN MASTER ======================= */
  const BINA = {
    bank: "🏦", museum: "🖼️", skyscraper: "🏙️", hospital: "🏥", school: "🏫", "post office": "🏤", hotel: "🏨", kiosk: "🏪", bakery: "🥐",
    pharmacy: "💊", library: "📚", cinema: "🎬", park: "🌳", mosque: "🕌", "police station": "🚓", café: "☕", supermarket: "🛒", municipality: "🏛️",
  };
  const BINA_TR = { bank: "banka", museum: "müze", skyscraper: "gökdelen", hospital: "hastane", school: "okul", "post office": "postane", hotel: "otel", kiosk: "büfe", bakery: "fırın", pharmacy: "eczane", library: "kütüphane", cinema: "sinema", park: "park", mosque: "cami", "police station": "karakol", café: "kafe", supermarket: "süpermarket", municipality: "belediye" };
  const SATIR = 2, SUTUN = 5;
  const SIFAT = [
    ["🚗🚕🚌🚗🚙🚕📢", "This street is very ___. Cars are honking all the time.", "noisy", ["quiet", "clean"], "Sürekli korna sesi var: gürültülü = noisy."],
    ["🚶‍♀️🚶🚶‍♂️🚶‍♀️🚶🚶‍♂️🚶", "There are too many people on the street. It's ___.", "crowded", ["empty", "quiet"], "Çok kalabalık = crowded."],
    ["🌳🐦🏡🌳", "There are no cars and no noise here. It's very ___.", "quiet", ["noisy", "crowded"], "Sessiz, sakin = quiet."],
    ["🏰🕌🏛️", "These buildings are very old. This part of the city is ___.", "historic", ["modern", "noisy"], "Tarihî = historic."],
    ["🏙️🏢🏙️", "These buildings are new and very tall. This area is ___.", "modern", ["historic", "old"], "Modern = modern."],
    ["🗑️🛢️💨🏭", "There is a lot of rubbish and smoke. The air is ___.", "polluted", ["clean", "fresh"], "Kirli = polluted."],
  ];
  function downtownBaslat() {
    const durum = { ızgara: Array(SATIR * SUTUN).fill(null), komutlar: [], i: 0, puan: 0, dogru: 0, bas: Date.now(), secili: null };
    // Başlangıç binaları
    const adlar = karistir(Object.keys(BINA));
    karistir([...Array(SATIR * SUTUN).keys()]).slice(0, 4).forEach((h, j) => { durum.ızgara[h] = adlar.pop(); });
    durum.havuz = adlar;
    durum.n = 8;
    downtownSonraki(durum);
  }
  const hucre = (r, c) => r * SUTUN + c;
  function tarifUret(iz, h) {
    const r = Math.floor(h / SUTUN), c = h % SUTUN, l = [];
    const bos = iz.map((x, i) => x ? null : i).filter(x => x != null);
    if (c > 0 && c < SUTUN - 1 && iz[hucre(r, c - 1)] && iz[hucre(r, c + 1)]) l.push([`between the ${iz[hucre(r, c - 1)]} and the ${iz[hucre(r, c + 1)]}`, `${BINA_TR[iz[hucre(r, c - 1)]]} ile ${BINA_TR[iz[hucre(r, c + 1)]]} arasına`]);
    if (iz[hucre(1 - r, c)]) l.push([`opposite the ${iz[hucre(1 - r, c)]}`, `${BINA_TR[iz[hucre(1 - r, c)]]} binasının tam karşısına (caddenin öbür tarafı)`]);
    if (c < SUTUN - 1 && iz[hucre(r, c + 1)]) l.push([`to the left of the ${iz[hucre(r, c + 1)]}`, `${BINA_TR[iz[hucre(r, c + 1)]]} binasının soluna`]);
    if (c > 0 && iz[hucre(r, c - 1)]) l.push([`to the right of the ${iz[hucre(r, c - 1)]}`, `${BINA_TR[iz[hucre(r, c - 1)]]} binasının sağına`]);
    // “next to” yalnızca tek bir boş komşu varsa
    for (const [dr, dc] of [[0, -1], [0, 1]]) { const cc = c - dc; if (cc < 0 || cc >= SUTUN || !iz[hucre(r, cc)]) continue; const komsu = [cc - 1, cc + 1].filter(x => x >= 0 && x < SUTUN && bos.includes(hucre(r, x))); if (komsu.length === 1 && komsu[0] === c) l.push([`next to the ${iz[hucre(r, cc)]}`, `${BINA_TR[iz[hucre(r, cc)]]} binasının yanına (yanında tek boş yer var)`]); }
    if ((c === 0 || c === SUTUN - 1) && l.length === 0) l.push([`on the corner, on the ${r === 0 ? "north" : "south"} side of the street, at the ${c === 0 ? "west" : "east"} end`, "köşeye"]);
    return l;
  }
  function downtownSonraki(d) {
    if (d.i >= d.n) {
      const s = oyunBitti("downtown", "en_city", d.puan, d.dogru, d.n, d.bas);
      return bitisEkrani("downtown", "Downtown Master", d.puan, d.dogru, d.n, s, `<div class="sehir-kucuk">${sehirHtml(d, true)}</div>`);
    }
    // Her 4 komuttan biri sıfat sorusu
    if (d.i % 4 === 3) { d.komut = { tur: "sifat", s: sec(SIFAT) }; d.komut.secenek = karistir([d.komut.s[2], ...d.komut.s[3]]); }
    else {
      const bos = d.ızgara.map((x, i) => x ? null : i).filter(x => x != null);
      let aday = karistir(bos).map(h => [h, tarifUret(d.ızgara, h)]).filter(x => x[1].length);
      if (!aday.length || !d.havuz.length) { d.n = d.i; return downtownSonraki(d); }
      const [h, tarifler] = aday[0]; const t = sec(tarifler); const bina = d.havuz.pop();
      d.komut = { tur: "yer", hedef: h, bina, metin: `Place the ${bina} ${t[0]}.`, tr: `${BINA_TR[bina][0].toLocaleUpperCase("tr-TR") + BINA_TR[bina].slice(1)} binasını ${t[1]} yerleştir.`,
        tepsi: karistir([bina, ...karistir(d.havuz).slice(0, 3)]) };
    }
    d.secili = null; d.cevap = null; d.bas1 = Date.now();
    downtownCiz(d);
  }
  function sehirHtml(d, salt) {
    const lot = h => { const b = d.ızgara[h]; return `<div class="sehir-lot ${b ? "dolu" : "bos"} ${d.yeniHucre === h ? "yeni" : ""}" data-lot="${h}">${b ? `<span class="bina">${BINA[b]}</span><small>${b}</small>` : salt ? "" : "<small>empty</small>"}</div>`; };
    return `<div class="sehir"><div class="sehir-sira">${[...Array(SUTUN).keys()].map(c => lot(hucre(0, c))).join("")}</div>
      <div class="sehir-yol"><span class="sehir-yol-ad">Main Street</span><span class="araba">🚗</span><span class="araba ikinci">🚌</span></div>
      <div class="sehir-sira">${[...Array(SUTUN).keys()].map(c => lot(hucre(1, c))).join("")}</div></div>`;
  }
  function downtownCiz(d) { SON = d;
    const k = d.komut, kacis = U().kacis;
    let govde;
    if (k.tur === "sifat") {
      govde = `<p class="soru-metin">${k.s[1].replace("___", "<b>___</b>")} ${sesBtn(k.s[1], 1)}</p><div class="sahne-emoji">${k.s[0]}</div>
        <div class="secenekler">${k.secenek.map((s, j) => `<button class="sec ${d.cevap != null ? (s === k.s[2] ? "dogru" : d.cevap === j ? "yanlis" : "") : ""}" data-j="${j}" ${d.cevap != null ? "disabled" : ""}><b>${"ABC"[j]}</b><span>${s}</span></button>`).join("")}</div>`;
    } else {
      govde = `<p class="soru-metin">🏗️ ${kacis(k.metin)} ${sesBtn(k.metin, 1)}</p><p class="kucuk-yazi muted">Binayı sürükleyip haritada doğru boş yere bırak (ya da önce binaya, sonra boş yere dokun).</p>
        ${sehirHtml(d)}
        <div class="tepsi">${k.tepsi.map(b => `<button class="bina-kart ${d.secili === b ? "secili" : ""}" data-bina="${b}" ${d.cevap != null ? "disabled" : ""}><span class="bina">${BINA[b]}</span><small>${b}</small></button>`).join("")}</div>`;
    }
    ana().innerHTML = `<section class="kart vurgu oyun-kart">${ustBar("Downtown Master", d.i, d.n, d.puan, `<span>⭐ ${d.dogru}</span>`)}${govde}<div id="gGeri"></div></section>`;
    sesBagla(ana());
    if (d.cevap != null) downtownGeri(d);
    if (k.tur === "sifat") ana().querySelectorAll("[data-j]").forEach(b => b.onclick = () => { d.cevap = +b.dataset.j; const ok = k.secenek[d.cevap] === k.s[2]; sonuc(d, ok, "en_city"); downtownCiz(d); });
    else {
      ana().querySelectorAll("[data-bina]").forEach(b => b.onclick = () => { if (b.dataset.suruklendi) return; d.secili = b.dataset.bina; downtownCiz(d); });
      ana().querySelectorAll("[data-lot]").forEach(l => l.onclick = () => { if (d.secili && d.cevap == null) yerlestir(d.secili, +l.dataset.lot); });
      surukle("[data-bina]", "[data-lot]", (el, hd) => yerlestir(el.dataset.bina, +hd.dataset.lot));
    }
    function yerlestir(bina, h) {
      if (d.cevap != null) return;
      if (d.ızgara[h]) return U().toast("Bu yer dolu. Boş bir yer seç.");
      const ok = bina === k.bina && h === k.hedef;
      d.cevap = { bina, h, ok };
      d.ızgara[k.hedef] = k.bina; d.yeniHucre = k.hedef;
      sonuc(d, ok, "en_city"); downtownCiz(d);
      if (ok) oku("Great! " + k.metin.replace("Place", "You placed"));
    }
  }
  function sonuc(d, ok, konu) {
    kaydetCevap(konu, ok, Date.now() - d.bas1);
    if (ok) { d.dogru++; d.puan += 10; ucur("+10"); }
  }
  function ucur(m) { const e = document.createElement("div"); e.className = "oyun-ucan"; e.textContent = m + " ⭐"; document.body.appendChild(e); setTimeout(() => e.remove(), 1200); }
  function downtownGeri(d) {
    const k = d.komut, kacis = U().kacis;
    let html;
    if (k.tur === "sifat") { const ok = k.secenek[d.cevap] === k.s[2]; html = `<div class="geri ${ok ? "iyi" : "kotu"}"><b>${ok ? "Correct! Doğru!" : "Not quite. Doğru cevap: " + k.s[2]}</b><p>${kacis(k.s[4])}</p></div>`; }
    else {
      const c = d.cevap;
      html = `<div class="geri ${c.ok ? "iyi" : "kotu"}"><b>${c.ok ? "Great! Şehrin büyüyor! 🎉" : "Oops! Doğru yer ve bina sarı çerçeveli."}</b>
        <p>${kacis(k.tr)}</p>${!c.ok && c.bina !== k.bina ? `<p>Seçtiğin bina: <b>${c.bina}</b> (${BINA_TR[c.bina]}). İstenen: <b>${k.bina}</b> (${BINA_TR[k.bina]}).</p>` : ""}
        <p class="kucuk-yazi"><b>Unutma:</b> between A and B = A ile B'nin arası · opposite = karşısı · next to = yanı · to the left/right of = solu/sağı.</p></div>`;
    }
    $("#gGeri").innerHTML = html + `<div class="satir"><button class="btn ana" id="gDevam">${d.i < d.n - 1 ? "Next →" : "Finish 🎉"}</button></div>`;
    $("#gDevam").onclick = () => { d.i++; d.yeniHucre = null; downtownSonraki(d); };
  }

  /* ======================= 2. AT THE FAIR: ROLLER COASTER ======================= */
  const DUYGU = [
    // [emoji, cümle, doğru, [yanlışlar], açıklama]
    ["😱", "The roller coaster is ___!", "terrifying", ["terrified", "bored"], "Şeyin özelliği → -ing: terrifying (korkutucu)."],
    ["😱", "I am ___ of the roller coaster.", "scared", ["scary", "boring"], "Kişinin hissi → -ed / sıfat: scared (korkmuş). scary = korkutucu."],
    ["🤩", "The ride is so ___!", "exciting", ["excited", "tired"], "Şeyin özelliği → exciting (heyecan verici)."],
    ["🤩", "We are very ___ about the fair.", "excited", ["exciting", "bored"], "Kişinin hissi → excited (heyecanlı)."],
    ["🥱", "This show is ___. Nothing happens.", "boring", ["bored", "thrilling"], "Şeyin özelliği → boring (sıkıcı)."],
    ["🥱", "I am ___. Let's go home.", "bored", ["boring", "excited"], "Kişinin hissi → bored (sıkılmış)."],
    ["😵‍💫", "The fast ride was ___!", "thrilling", ["bored", "tired"], "Çok heyecanlı, nefes kesici → thrilling."],
    ["😮", "The fireworks were ___!", "amazing", ["amazed", "boring"], "Şeyin özelliği → amazing (harika, şaşırtıcı)."],
    ["😮", "We were ___ by the magic show.", "amazed", ["amazing", "boring"], "Kişinin hissi → amazed (hayran kalmış)."],
    ["😴", "After the fair, I was very ___.", "tired", ["tiring", "excited"], "Kişinin hissi → tired (yorgun)."],
    ["😴", "Walking all day at the fair is ___.", "tiring", ["tired", "scared"], "Şeyin özelliği → tiring (yorucu)."],
    ["🧐", "The science tent was really ___.", "interesting", ["interested", "scared"], "Şeyin özelliği → interesting (ilginç)."],
    ["🧐", "I am ___ in the robot show.", "interested", ["interesting", "boring"], "Kişinin hissi → interested (ilgili)."],
    ["😄", "The clown is very ___. Everybody is laughing.", "funny", ["scary", "boring"], "Komik = funny."],
    ["😨", "The haunted house is ___.", "scary", ["scared", "bored"], "Şeyin özelliği → scary (korkutucu)."],
    ["😊", "I won a teddy bear! I'm so ___.", "happy", ["sad", "bored"], "Mutlu = happy."],
  ];
  function trenBaslat() {
    const d = { liste: karistir(DUYGU).slice(0, 12), i: 0, puan: 0, dogru: 0, seri: 0, hiz: 1, bas: Date.now(), bitti: false };
    d.n = d.liste.length;
    trenCiz(d);
  }
  function trenCiz(d) { SON = d;
    ana().innerHTML = `<section class="kart vurgu oyun-kart" id="trenKart">${ustBar("At the Fair · Roller Coaster", d.i, d.n, d.puan, `<span>🚀 ×${d.hiz.toFixed(1)}</span>`)}
      <div class="lunapark"><svg viewBox="0 0 600 220" class="ray"><path id="rayYol" d="M10 180 C 90 20, 160 20, 220 150 S 340 210, 380 80 S 520 10, 590 170" fill="none" class="ray-cizgi"/>
        <path d="M10 180 C 90 20, 160 20, 220 150 S 340 210, 380 80 S 520 10, 590 170" fill="none" class="ray-travers"/></svg>
        <div class="tren" id="tren">🎢</div><div class="tunel" id="tunel"><span class="tunel-yuz">${d.liste[d.i][0]}</span></div></div>
      <p class="soru-metin" style="text-align:center">${d.liste[d.i][1].replace("___", "<b>_____</b>")} ${sesBtn(d.liste[d.i][1], 1)}</p>
      <div class="sure-cubuk"><i id="sureCubuk"></i></div>
      <div class="secenekler uc">${(d.secenek = karistir([d.liste[d.i][2], ...d.liste[d.i][3]])).map((s, j) => `<button class="sec" data-j="${j}"><span>${s}</span></button>`).join("")}</div>
      <div id="gGeri"></div></section>`;
    sesBagla(ana());
    const yol = $("#rayYol"), tren = $("#tren"), kutu = ana().querySelector(".lunapark");
    const L = yol.getTotalLength ? yol.getTotalLength() : 1000;
    const sure = Math.max(3500, 8000 / d.hiz), bas = Date.now(); d.bas1 = bas;
    let cevaplandi = false;
    const kare = () => {
      if (!document.body.contains(tren)) return;
      const t = Math.min(1, (Date.now() - bas) / sure);
      if (yol.getPointAtLength) { const p = yol.getPointAtLength(t * L * 0.82); const o = kutu.clientWidth / 600; tren.style.transform = `translate(${p.x * o - 18}px, ${p.y * o - 30}px)`; }
      const c = $("#sureCubuk"); if (c) c.style.width = (100 - t * 100) + "%";
      if (t >= 1 && !cevaplandi) { cevaplandi = true; return cevap(-1); }
      if (!cevaplandi) requestAnimationFrame(kare);
    };
    requestAnimationFrame(kare);
    ana().querySelectorAll("[data-j]").forEach(b => b.onclick = () => { if (cevaplandi) return; cevaplandi = true; cevap(+b.dataset.j); });
    function cevap(j) {
      const q = d.liste[d.i], ok = j >= 0 && d.secenek[j] === q[2];
      kaydetCevap("en_festivals", ok, Date.now() - d.bas1);
      ana().querySelectorAll("[data-j]").forEach(b => { b.disabled = true; const s = d.secenek[+b.dataset.j]; if (s === q[2]) b.classList.add("dogru"); else if (+b.dataset.j === j) b.classList.add("yanlis"); });
      if (ok) { d.dogru++; d.seri++; d.hiz = Math.min(2.5, d.hiz + 0.15); const p = 10 + (d.seri >= 3 ? 5 : 0); d.puan += p; ucur("+" + p); $("#tunel").classList.add("isikli"); }
      else { d.seri = 0; d.hiz = Math.max(1, d.hiz - 0.2); $("#trenKart").classList.add("sars"); }
      $("#gGeri").innerHTML = `<div class="geri ${ok ? "iyi" : "kotu"}"><b>${ok ? (d.seri >= 3 ? "Speed bonus! Seri +5 🚀" : "Correct! Tren hızlanıyor!") : j < 0 ? "Time's up! Süre doldu." : "Wrong tunnel! Tren yavaşladı."}</b>
        <p>${ok ? "" : "Doğru cevap: <b>" + q[2] + "</b>. "}${q[4]}</p></div><div class="satir"><button class="btn ana" id="gDevam">${d.i < d.n - 1 ? "Next tunnel →" : "Finish 🎉"}</button></div>`;
      $("#gDevam").onclick = () => { d.i++; if (d.i >= d.n) { const s = oyunBitti("tren", "en_festivals", d.puan, d.dogru, d.n, d.bas); bitisEkrani("tren", "At the Fair · Roller Coaster", d.puan, d.dogru, d.n, s, `<div class="geri bilgi"><b>Unutma:</b> -ing → bir şeyin özelliği (The ride is exciting). -ed → kişinin hissettiği (I am excited).</div>`); } else trenCiz(d); };
    }
  }

  /* ======================= 3. YUMMY BREAKFAST: CHEF ======================= */
  const YEMEK = { olives: "🫒", honey: "🍯", cheese: "🧀", eggs: "🥚", bread: "🍞", butter: "🧈", jam: "🍓", tomatoes: "🍅", cucumbers: "🥒", milk: "🥛", tea: "🍵", "orange juice": "🍊", sausages: "🌭", pancakes: "🥞", cereal: "🥣", simit: "🥯" };
  const YEMEK_TR = { olives: "zeytin", honey: "bal", cheese: "peynir", eggs: "yumurta", bread: "ekmek", butter: "tereyağı", jam: "reçel", tomatoes: "domates", cucumbers: "salatalık", milk: "süt", tea: "çay", "orange juice": "portakal suyu", sausages: "sosis", pancakes: "krep", cereal: "tahıl gevreği", simit: "simit" };
  const MUSTERI = [["👧", "Elif"], ["👦", "Can"], ["👴", "Mr Brown"], ["👩", "Mrs Smith"], ["🧒", "Deniz"], ["👨‍🍳", "Chef Tom"], ["👵", "Grandma Ayşe"], ["🧑", "Alex"]];
  const ve = l => l.length <= 2 ? l.join(" and ") : l.slice(0, -1).join(", ") + " and " + l[l.length - 1];
  const KALIP = [
    l => `Good morning! Can I have some ${ve(l)}, please?`,
    l => `I'd like some ${ve(l)}. ${l[0][0].toUpperCase() + l[0].slice(1)} ${l[0].endsWith("s") ? "are" : "is"} my favourite!`,
    l => `I want a nutritious breakfast: ${ve(l)}, please.`,
    l => `Hello! Some ${ve(l)} for me, please. I'm very hungry!`,
  ];
  const DIYALOG = [
    ["— Would you like some tea?<br>— ___ I love tea!", "Yes, please.", ["Yes, I am.", "No, I don't."], "“Would you like…?” teklifine olumlu cevap: Yes, please. Olumsuz: No, thanks."],
    ["— Do you want some olives?<br>— ___ I don't like olives.", "No, thanks.", ["Yes, please.", "Yes, I do."], "Sevmediğini söylüyor; kibar ret: No, thanks."],
    ["— What's your favourite breakfast food?<br>— ___", "It's honey and cheese.", ["Yes, it is.", "I'm hungry."], "“What's your favourite…?” sorusuna “It's …” ile cevap verilir."],
    ["— Can I have some milk, please?<br>— ___", "Sure, here you are.", ["No, I'm not.", "It's my favourite."], "Bir şey istendiğinde verirken: Here you are / Sure."],
    ["— How about some eggs?<br>— ___ Eggs are my favourite!", "Yes, please.", ["No, thanks.", "I don't like eggs."], "Favori yiyeceği teklif edilince: Yes, please."],
  ];
  function kahvaltiBaslat() {
    const d = { liste: [], i: 0, puan: 0, dogru: 0, bas: Date.now() };
    const musteri = karistir(MUSTERI);
    for (let j = 0; j < 6; j++) {
      if (j === 2 || j === 5) { d.liste.push({ tur: "diyalog", q: sec(DIYALOG) }); continue; }
      const istek = karistir(Object.keys(YEMEK)).slice(0, R(2, 3));
      const sevmez = sec(Object.keys(YEMEK).filter(x => !istek.includes(x)));
      const metin = sec(KALIP)(istek) + (j % 2 ? ` I don't like ${sevmez}.` : "");
      d.liste.push({ tur: "musteri", m: musteri[j], istek, sevmez, metin });
    }
    d.n = d.liste.length;
    kahvaltiCiz(d);
  }
  function kahvaltiCiz(d) { SON = d;
    const o = d.liste[d.i]; d.bas1 = d.bas1 || Date.now();
    let govde;
    if (o.tur === "diyalog") {
      o.secenek = o.secenek || karistir([o.q[1], ...o.q[2]]);
      govde = `<p class="kucuk-yazi muted">Kafede kısa bir sohbet. Boşluğa uygun cevabı seç.</p><div class="balon">${o.q[0]}</div>
        <div class="secenekler">${o.secenek.map((s, j) => `<button class="sec ${o.cevap != null ? (s === o.q[1] ? "dogru" : o.cevap === j ? "yanlis" : "") : ""}" data-j="${j}" ${o.cevap != null ? "disabled" : ""}><b>${"ABC"[j]}</b><span>${s}</span></button>`).join("")}</div>`;
    } else {
      o.tabak = o.tabak || [];
      const yuz = o.sonuc == null ? o.m[0] : o.sonuc ? "😋" : "😞";
      govde = `<div class="musteri ${o.sonuc === false ? "sars" : o.sonuc ? "zipla" : ""}"><span class="musteri-yuz">${yuz}</span><div class="balon"><b>${o.m[1]}:</b> ${o.metin} ${sesBtn(o.metin, 1)}</div></div>
        <div class="tabak" data-tabak="1">${o.tabak.length ? o.tabak.map(y => `<span class="tabak-yemek" data-cikar="${y}" title="${y}">${YEMEK[y]}</span>`).join("") : '<span class="muted kucuk-yazi">Tabak boş — yiyecekleri buraya sürükle ya da dokun</span>'}</div>
        <div class="tepsi yemekler">${Object.keys(YEMEK).map(y => `<button class="bina-kart ${o.tabak.includes(y) ? "secili" : ""}" data-yemek="${y}" ${o.sonuc != null ? "disabled" : ""}><span class="bina">${YEMEK[y]}</span><small>${y}</small></button>`).join("")}</div>
        ${o.sonuc == null ? `<div class="satir"><button class="btn ana" id="gServis" ${o.tabak.length ? "" : "disabled"}>🍽️ Serve</button><button class="btn kucuk" id="gTemizle" ${o.tabak.length ? "" : "disabled"}>Clear plate</button></div>` : ""}`;
    }
    ana().innerHTML = `<section class="kart vurgu oyun-kart">${ustBar("Yummy Breakfast · Chef", d.i, d.n, d.puan, `<span>⭐ ${d.dogru}</span>`)}${govde}<div id="gGeri"></div></section>`;
    sesBagla(ana());
    if (o.tur === "diyalog") {
      ana().querySelectorAll("[data-j]").forEach(b => b.onclick = () => { o.cevap = +b.dataset.j; const ok = o.secenek[o.cevap] === o.q[1]; sonuc(d, ok, "en_food"); o.sonuc = ok; kahvaltiCiz(d); });
      if (o.cevap != null) geri(o.sonuc, `${o.sonuc ? "" : "Doğru cevap: <b>" + o.q[1] + "</b>. "}${o.q[3]}`);
    } else {
      const ekle = y => { if (o.sonuc != null) return; const i = o.tabak.indexOf(y); if (i >= 0) o.tabak.splice(i, 1); else o.tabak.push(y); kahvaltiCiz(d); };
      ana().querySelectorAll("[data-yemek]").forEach(b => b.onclick = () => { if (!b.dataset.suruklendi) ekle(b.dataset.yemek); });
      ana().querySelectorAll("[data-cikar]").forEach(b => b.onclick = () => ekle(b.dataset.cikar));
      surukle("[data-yemek]", "[data-tabak]", el => { if (!o.tabak.includes(el.dataset.yemek)) ekle(el.dataset.yemek); });
      const sv = $("#gServis"); if (sv) sv.onclick = () => {
        const eksik = o.istek.filter(x => !o.tabak.includes(x)), fazla = o.tabak.filter(x => !o.istek.includes(x));
        o.sonuc = !eksik.length && !fazla.length; sonuc(d, o.sonuc, "en_food"); kahvaltiCiz(d);
        oku(o.sonuc ? "Thank you! It's delicious!" : fazla.includes(o.sevmez) ? `Oh no! I don't like ${o.sevmez}!` : "Hmm, this is not my order.");
      };
      const tm = $("#gTemizle"); if (tm) tm.onclick = () => { o.tabak = []; kahvaltiCiz(d); };
      if (o.sonuc != null) {
        const eksik = o.istek.filter(x => !o.tabak.includes(x)), fazla = o.tabak.filter(x => !o.istek.includes(x));
        geri(o.sonuc, o.sonuc ? `“Thank you! It's delicious!” ${o.m[1]} çok mutlu.` : `${eksik.length ? `Eksik: <b>${eksik.map(x => x + " (" + YEMEK_TR[x] + ")").join(", ")}</b>. ` : ""}${fazla.length ? `Fazla: <b>${fazla.map(x => x + " (" + YEMEK_TR[x] + ")").join(", ")}</b>${fazla.includes(o.sevmez) ? " — müşteri bunu sevmiyor!" : "."}` : ""}`);
      }
    }
    function geri(ok, metin) {
      $("#gGeri").innerHTML = `<div class="geri ${ok ? "iyi" : "kotu"}"><b>${ok ? "Yummy! Doğru!" : "Oops!"}</b><p>${metin}</p></div><div class="satir"><button class="btn ana" id="gDevam">${d.i < d.n - 1 ? "Next customer →" : "Finish 🎉"}</button></div>`;
      $("#gDevam").onclick = () => { d.i++; d.bas1 = Date.now(); if (d.i >= d.n) { const s = oyunBitti("kahvalti", "en_food", d.puan, d.dogru, d.n, d.bas); bitisEkrani("kahvalti", "Yummy Breakfast · Chef", d.puan, d.dogru, d.n, s, `<div class="geri bilgi"><b>Unutma:</b> Would you like some…? → Yes, please. / No, thanks. · Can I have some…, please? · It's my favourite.</div>`); } else kahvaltiCiz(d); };
    }
  }

  /* ======================= 4. WEATHER & CLOTHES: WARDROBE ======================= */
  const GIYSI = { coat: "🧥", scarf: "🧣", gloves: "🧤", boots: "👢", umbrella: "☂️", sunglasses: "🕶️", shorts: "🩳", "T-shirt": "👕", cap: "🧢", sandals: "🩴", jeans: "👖", dress: "👗", hat: "👒", socks: "🧦", trainers: "👟" };
  const GIYSI_TR = { coat: "mont", scarf: "atkı", gloves: "eldiven", boots: "bot", umbrella: "şemsiye", sunglasses: "güneş gözlüğü", shorts: "şort", "T-shirt": "tişört", cap: "şapka (kep)", sandals: "sandalet", jeans: "kot pantolon", dress: "elbise", hat: "şapka", socks: "çorap", trainers: "spor ayakkabı" };
  const HAVA = [
    { ad: "freezing", sahne: "❄️☃️❄️", c: -5, metin: "It's freezing and snowy today! It's minus five degrees.", gerek: [["coat"], ["scarf"], ["gloves"], ["boots"]], yasak: ["shorts", "sandals", "sunglasses", "dress"], tepki: "🥶", sinif: "kar", tr: "Dondurucu soğuk ve karlı: mont, atkı, eldiven ve bot şart." },
    { ad: "rainy", sahne: "🌧️💧🌧️", c: 12, metin: "It's rainy and cool today. Don't get wet!", gerek: [["umbrella"], ["boots"], ["coat"]], yasak: ["sandals", "shorts", "sunglasses"], tepki: "💦", sinif: "yagmur", tr: "Yağmurlu ve serin: şemsiye, bot ve mont." },
    { ad: "sunny and hot", sahne: "☀️🌴☀️", c: 33, metin: "It's sunny and very hot today. It's thirty-three degrees!", gerek: [["sunglasses"], ["cap", "hat"], ["shorts", "dress"], ["T-shirt", "dress"]], yasak: ["coat", "scarf", "gloves", "boots"], tepki: "🥵", sinif: "gunes", tr: "Güneşli ve çok sıcak: güneş gözlüğü, şapka, şort ya da elbise, tişört." },
    { ad: "windy", sahne: "🌬️🍂🌬️", c: 9, metin: "It's windy and cold today. Keep warm!", gerek: [["coat"], ["scarf"], ["jeans"]], yasak: ["shorts", "sandals", "umbrella", "dress"], tepki: "🥶", sinif: "ruzgar", tr: "Rüzgârlı ve soğuk: mont, atkı, kot pantolon. Şemsiye rüzgârda ters döner!" },
    { ad: "warm", sahne: "🌤️🌸🌤️", c: 22, metin: "It's warm and sunny today. It's a lovely spring day.", gerek: [["T-shirt"], ["jeans", "dress"], ["trainers"]], yasak: ["coat", "scarf", "gloves", "boots"], tepki: "🥵", sinif: "ilik", tr: "Ilık ve güneşli: tişört, kot ya da elbise, spor ayakkabı." },
    { ad: "foggy", sahne: "🌫️🌫️🌫️", c: 7, metin: "It's foggy and cold this morning. You can't see far.", gerek: [["coat"], ["jeans"], ["boots", "trainers"]], yasak: ["shorts", "sandals", "sunglasses"], tepki: "🥶", sinif: "sis", tr: "Sisli ve soğuk: mont, kot pantolon, bot ya da spor ayakkabı." },
    { ad: "stormy", sahne: "⛈️⚡⛈️", c: 14, metin: "It's stormy! There is thunder and lightning. Wear warm and waterproof clothes.", gerek: [["coat"], ["boots"], ["jeans"]], yasak: ["shorts", "sandals", "sunglasses", "umbrella"], tepki: "😨", sinif: "firtina", tr: "Fırtınalı (gök gürültüsü ve şimşek): mont, bot, kot. Fırtınada şemsiye tehlikelidir!" },
  ];
  function gardiropBaslat() {
    const d = { liste: karistir(HAVA).slice(0, 6), i: 0, puan: 0, dogru: 0, bas: Date.now() };
    d.n = d.liste.length; gardiropCiz(d);
  }
  function gardiropCiz(d) { SON = d;
    const h = d.liste[d.i]; h.giyilen = h.giyilen || []; d.bas1 = d.bas1 || Date.now();
    const yuz = h.sonuc == null ? "🧒" : h.sonuc ? "😄" : h.tepki;
    ana().innerHTML = `<section class="kart vurgu oyun-kart">${ustBar("Weather & Clothes · Wardrobe", d.i, d.n, d.puan, `<span>⭐ ${d.dogru}</span>`)}
      <div class="hava-oda">
        <div class="pencere ${h.sinif}"><div class="pencere-sahne">${h.sahne}</div><div class="termometre"><span>🌡️</span><b>${h.c} °C</b></div></div>
        <div class="karakter ${h.sonuc === false ? "titre" : h.sonuc ? "zipla" : ""}" data-karakter="1"><span class="karakter-yuz">${yuz}</span>
          <div class="giyilen">${h.giyilen.map(g => `<span data-cikar="${g}" title="${g}">${GIYSI[g]}</span>`).join("") || '<small class="muted">Giysileri buraya sürükle</small>'}</div></div>
      </div>
      <p class="soru-metin">${h.metin} ${sesBtn(h.metin, 1)}</p><p class="kucuk-yazi muted">Karakteri havaya uygun giydir: giysileri karaktere sürükle ya da dokun. Sonra “Go outside!”</p>
      <div class="tepsi giysiler">${Object.keys(GIYSI).map(g => `<button class="bina-kart ${h.giyilen.includes(g) ? "secili" : ""}" data-giysi="${g}" ${h.sonuc != null ? "disabled" : ""}><span class="bina">${GIYSI[g]}</span><small>${g}</small></button>`).join("")}</div>
      ${h.sonuc == null ? `<div class="satir"><button class="btn ana" id="gCik" ${h.giyilen.length ? "" : "disabled"}>🚪 Go outside!</button></div>` : ""}
      <div id="gGeri"></div></section>`;
    sesBagla(ana());
    const tak = g => { if (h.sonuc != null) return; const i = h.giyilen.indexOf(g); if (i >= 0) h.giyilen.splice(i, 1); else h.giyilen.push(g); gardiropCiz(d); };
    ana().querySelectorAll("[data-giysi]").forEach(b => b.onclick = () => { if (!b.dataset.suruklendi) tak(b.dataset.giysi); });
    ana().querySelectorAll("[data-cikar]").forEach(b => b.onclick = () => tak(b.dataset.cikar));
    surukle("[data-giysi]", "[data-karakter]", el => { if (!h.giyilen.includes(el.dataset.giysi)) tak(el.dataset.giysi); });
    const c = $("#gCik"); if (c) c.onclick = () => {
      const eksik = h.gerek.filter(grup => !grup.some(g => h.giyilen.includes(g))), yanlis = h.giyilen.filter(g => h.yasak.includes(g));
      h.sonuc = !eksik.length && !yanlis.length; h.eksik = eksik; h.yanlis = yanlis;
      kaydetCevap("en_appearance", h.sonuc, Date.now() - d.bas1); if (KONU.en_future) kaydetCevap("en_future", h.sonuc, Date.now() - d.bas1);
      if (h.sonuc) { d.dogru++; d.puan += 10; ucur("+10"); oku("Perfect! I'm ready for the " + (h.ad === "freezing" ? "snow" : h.ad === "rainy" ? "rain" : "weather") + "!"); }
      else oku(h.tepki === "🥶" ? "Brrr! I'm so cold!" : h.tepki === "🥵" ? "Phew! I'm too hot!" : "Oh no! I'm wet!");
      gardiropCiz(d);
    };
    if (h.sonuc != null) {
      $("#gGeri").innerHTML = `<div class="geri ${h.sonuc ? "iyi" : "kotu"}"><b>${h.sonuc ? "Perfect outfit! Harika kombin!" : h.tepki === "🥶" ? "Brrr! Karakter üşüyor! 🥶" : h.tepki === "🥵" ? "Phew! Karakter çok terledi! 🥵" : "Oh no! Karakter ıslandı ya da korktu!"}</b>
        ${h.eksik.length ? `<p>Eksik: ${h.eksik.map(grup => grup.map(g => `<b>${g}</b> (${GIYSI_TR[g]})`).join(" ya da ")).join(", ")}</p>` : ""}
        ${h.yanlis.length ? `<p>Bu havaya uygun değil: ${h.yanlis.map(g => `<b>${g}</b> (${GIYSI_TR[g]})`).join(", ")}</p>` : ""}
        <p class="kucuk-yazi">${h.tr}</p></div><div class="satir"><button class="btn ana" id="gDevam">${d.i < d.n - 1 ? "Next day →" : "Finish 🎉"}</button></div>`;
      $("#gDevam").onclick = () => { d.i++; d.bas1 = Date.now(); if (d.i >= d.n) { const s = oyunBitti("gardirop", "en_appearance", d.puan, d.dogru, d.n, d.bas); bitisEkrani("gardirop", "Weather & Clothes · Wardrobe", d.puan, d.dogru, d.n, s, `<div class="geri bilgi"><b>Unutma:</b> freezing/snowy → coat, scarf, gloves, boots · rainy → umbrella, boots · sunny and hot → sunglasses, cap, shorts, T-shirt.</div>`); } else gardiropCiz(d); };
    }
  }

  /* ======================= KELİME KARTLARI ======================= */
  function kartlar(konuId) {
    const k = KONU[konuId]; if (!k || !k.sozluk) return merkez();
    let i = 0, ters = false; const l = karistir(k.sozluk);
    const ciz = () => {
      const [en, tr] = l[i];
      ana().innerHTML = `<section class="kart vurgu"><p class="yol-iz"><a href="#/konu/${konuId}">${U().kacis(k.ad)}</a> › Word cards</p>
        <div class="satir ara"><h1>Word cards</h1><span class="etiket">${i + 1} / ${l.length}</span></div>
        <button class="kelime-kart ${ters ? "ters" : ""}" id="kKart"><span class="on">${U().kacis(en)}</span><span class="arka">${U().kacis(tr)}</span></button>
        <p class="kucuk-yazi muted" style="text-align:center">Karta dokun: Türkçesini gör. 🔊 ile dinle ve tekrar et.</p>
        <div class="satir" style="justify-content:center">${sesBtn(en)}<button class="btn" id="kOnce" ${i ? "" : "disabled"}>← Back</button><button class="btn ana" id="kSonra">${i < l.length - 1 ? "Next →" : "Again ↺"}</button></div></section>`;
      sesBagla(ana());
      $("#kKart").onclick = () => { ters = !ters; if (!ters) oku(en); ciz(); };
      $("#kOnce").onclick = () => { i--; ters = false; ciz(); };
      $("#kSonra").onclick = () => { i = (i + 1) % l.length; ters = false; ciz(); oku(l[i][0]); };
    };
    ciz(); oku(l[0][0]);
  }

  /* ======================= MERKEZ ======================= */
  const OYUNLAR = {
    downtown: { ad: "Downtown Master", simge: "🏙️", konu: "en_city", tr: "Şehri kur: binaları komutlara göre doğru yere yerleştir (between, opposite, next to…).", baslat: downtownBaslat },
    tren: { ad: "At the Fair · Roller Coaster", simge: "🎢", konu: "en_festivals", tr: "Tüneldeki yüz ifadesine göre doğru sıfatı hızla seç (exciting / excited…). Doğru cevap treni hızlandırır.", baslat: trenBaslat },
    kahvalti: { ad: "Yummy Breakfast · Chef", simge: "🍳", konu: "en_food", tr: "Müşterinin isteğini oku, tabağı hazırla, servis et. Kafe sohbetlerini tamamla.", baslat: kahvaltiBaslat },
    gardirop: { ad: "Weather & Clothes · Wardrobe", simge: "🧥", konu: "en_appearance", tr: "Pencereden havaya bak, karakteri doğru giysilerle giydir.", baslat: gardiropBaslat },
  };
  function merkez() {
    ana().innerHTML = `<section class="kart vurgu"><span class="etiket">🇬🇧 English games</span><h1 style="margin-top:6px">İngilizce Oyunları</h1>
        <p>Oynayarak öğren! Her doğru cevap <b>+10 puan</b>. ${sesVar() ? "🔊 düğmeleriyle cümleleri dinleyebilirsin." : "Bu cihazda İngilizce ses motoru bulunamadı; Ayarlar › Metin okuma çıkışı'ndan İngilizce ses paketi indirilebilir."}</p></section>
      <section class="izgara">${Object.entries(OYUNLAR).map(([id, o]) => `<button class="kart oyun-ada" data-oyun="${id}"><span class="oyun-ada-simge">${o.simge}</span><h2>${o.ad}</h2><span class="kucuk-yazi">${o.tr}</span>
        <span class="kucuk-yazi muted">En iyi skor: ${enIyi(id) || "—"} · ${DEPO.liste("oyun").filter(x => x.ders === DERS && x.oyun === id).length} kez oynandı</span></button>`).join("")}</section>
      <section class="izgara dar"><a class="btn" href="#/ders/en">İngilizce ders sayfası</a></section>`;
    ana().querySelectorAll("[data-oyun]").forEach(b => b.onclick = () => U().git("#/ing/" + b.dataset.oyun));
  }
  function ac(a, b) {
    if (a === "kart") return kartlar(b);
    if (OYUNLAR[a]) return OYUNLAR[a].baslat();
    return merkez();
  }
  window.INGOYUN = { ac, oku, sesVar, sesBtn, sesBagla, OYUNLAR, enIyi, durum: () => SON };
})();
