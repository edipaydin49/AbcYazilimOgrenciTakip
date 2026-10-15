/* BİLSEM tarzı zekâ ve yetenek soruları — tamamen özgün soru bankası.
 * (Gerçek BİLSEM soruları yayımlanmaz; buradaki bütün sorular bu uygulama için yazılmıştır.)
 * Bölümler: sekil · matris · sayi · uzamsal · sozel · mantik · dikkat
 * Her bölüm: { id, ad, simge, aciklama, sorular: [üreteç fonksiyonları] } → window.BILSEM
 * Görsel seçenekli sorularda seçenekler "A" "B" "C" "D" harfleridir; şekiller soru görselinde aynı harflerle çizilir
 * ve seçenekler harf sırasına dizilir (A düğmesi = görseldeki A şekli).
 */
(function () {
  "use strict";
  const { R, sec, karistir, ek, S, Q, G } = OGR;
  const B = window.BILSEM = window.BILSEM || [];
  const { svg, yazi } = G;

  /* ---------------- ortak yardımcılar ---------------- */
  const HARF = ["A", "B", "C", "D"];
  const sirala = q => { q.secenekler.sort((a, b) => (a.m < b.m ? -1 : a.m > b.m ? 1 : 0)); return q; };
  const SG = o => sirala(S(o));
  /* Görsel seçenekler: ops[0] doğru, diğerleri {c, hata, neden}. Karıştırıp A–D harfi verir. */
  function harfle(ops) {
    const sira = karistir(ops.map((_, i) => i));
    return {
      liste: sira.map(i => ops[i].c),
      harf: HARF[sira.indexOf(0)],
      yanlis: ops.slice(1).map((o, j) => [HARF[sira.indexOf(j + 1)], o.hata, o.neden]),
    };
  }
  const RENK_AD = { "g-a": "mavi", "g-b": "sarı", "g-c": "yeşil", "g-d": "kırmızı" };
  const RENKLER = ["g-a", "g-b", "g-c", "g-d"];
  const SEKIL_AD = { daire: "daire", kare: "kare", ucgen: "üçgen", besgen: "beşgen", altigen: "altıgen", yildiz: "yıldız", arti: "artı", baklava: "baklava dilimi", ok: "ok" };
  const KENAR = { ucgen: 3, kare: 4, besgen: 5, altigen: 6 };
  const P = pts => pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const nk = (n, cx, cy, r, a0 = -90) => Array.from({ length: n }, (_, i) => { const a = (a0 + 360 * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  const mod = (a, n) => ((a % n) + n) % n;

  /* Tek şekil: t türü, (cx,cy) merkez, r yarıçap, renk sınıfı, saat yönünde dönme açısı */
  function sekil(t, cx, cy, r, renk = "g-a", aci = 0) {
    const st = `class="${renk} g-cizgi" stroke-width="2" stroke-linejoin="round"` + (aci ? ` transform="rotate(${aci} ${cx.toFixed(1)} ${cy.toFixed(1)})"` : "");
    if (t === "daire") return `<circle ${st} cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r * 0.9).toFixed(1)}"/>`;
    let p;
    const rel = a => a.map(([x, y]) => [cx + x * r, cy + y * r]);
    if (t === "kare") p = nk(4, cx, cy, r * 1.1, -45);
    else if (t === "ucgen") p = nk(3, cx, cy + r * 0.18, r * 1.12);
    else if (t === "besgen") p = nk(5, cx, cy + r * 0.05, r);
    else if (t === "altigen") p = nk(6, cx, cy, r);
    else if (t === "yildiz") p = Array.from({ length: 10 }, (_, i) => { const a = (-90 + 36 * i) * Math.PI / 180, rr = i % 2 ? r * 0.45 : r * 1.05; return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]; });
    else if (t === "arti") { const w = 0.34; p = rel([[-w, -1], [w, -1], [w, -w], [1, -w], [1, w], [w, w], [w, 1], [-w, 1], [-w, w], [-1, w], [-1, -w], [-w, -w]]); }
    else if (t === "baklava") p = rel([[0, -1.05], [0.62, 0], [0, 1.05], [-0.62, 0]]);
    else if (t === "ok") p = rel([[0, -1], [0.62, -0.12], [0.22, -0.12], [0.22, 0.95], [-0.22, 0.95], [-0.22, -0.12], [-0.62, -0.12]]);
    return `<polygon ${st} points="${P(p)}"/>`;
  }
  /* n nokta (ya da n küçük şekil) düzgün yerleşim */
  function yerlesim(n, cx, cy, alan) {
    const sut = Math.ceil(Math.sqrt(n)), sat = Math.ceil(n / sut), ar = alan / Math.max(sut, sat, 1), l = [];
    for (let i = 0; i < n; i++) {
      const sx = i % sut, sy = Math.floor(i / sut), bu = sy === sat - 1 ? n - sut * (sat - 1) : sut;
      l.push([cx + (sx - (bu - 1) / 2) * ar, cy + (sy - (sat - 1) / 2) * ar]);
    }
    return { l, ar };
  }
  function noktalar(n, cx, cy, alan, sinif = "g-cizgi-uc") {
    const { l, ar } = yerlesim(n, cx, cy, alan), r = Math.min(6, ar * 0.3);
    return l.map(([x, y]) => `<circle class="${sinif}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"/>`).join("");
  }
  function kopyalar(n, t, renk, cx, cy, alan) {
    const { l, ar } = yerlesim(n, cx, cy, alan);
    return l.map(([x, y]) => sekil(t, x, y, ar * 0.38, renk)).join("");
  }
  /* Hücre: f(cx,cy,s) içerik çizer; f === null ise soru işaretli boş hücre */
  function hucre(x, y, s, f) {
    if (f === null) return `<rect class="g-yumusak g-cizgi" x="${x}" y="${y}" width="${s}" height="${s}" rx="8" stroke-width="1.5" stroke-dasharray="5 4"/><text class="g-yazi" x="${x + s / 2}" y="${y + s / 2 + 11}" text-anchor="middle" font-weight="700" style="font-size:30px">?</text>`;
    return `<rect class="g-bos g-cizgi" x="${x}" y="${y}" width="${s}" height="${s}" rx="8" stroke-width="1.5"/>` + f(x + s / 2, y + s / 2, s);
  }
  /* Üstte dizi (hücreler), altta A–D seçenekleri */
  function seriSvg(h, ops, { s = 64, etiket = "şekil dizisi", ustYazi = null } = {}) {
    const ara = 12, n = h.length, m = ops ? ops.length : 0;
    const W = Math.max(n, m) * (s + ara) + ara + 8;
    let ic = "", y1 = 8;
    const x0 = (W - (n * (s + ara) - ara)) / 2;
    h.forEach((f, i) => { const x = x0 + i * (s + ara); ic += hucre(x, y1, s, f); if (ustYazi) ic += yazi(x + s / 2, y1 + s + 16, ustYazi[i], { k: 1 }); });
    let H = y1 + s + (ustYazi ? 26 : 10);
    if (m) {
      const y2 = H + 18; H = y2 + s + 28;
      ic += `<line class="g-ince" x1="8" x2="${W - 8}" y1="${y2 - 13}" y2="${y2 - 13}" stroke-dasharray="4 4"/>`;
      const xb = (W - (m * (s + ara) - ara)) / 2;
      ops.forEach((f, i) => { const x = xb + i * (s + ara); ic += hucre(x, y2, s, f) + yazi(x + s / 2, y2 + s + 19, HARF[i], { b: 1 }); });
    }
    return svg(W, H, ic, etiket);
  }
  /* 3×3 matris (dokuz hücre, biri null) ve altta A–D seçenekleri */
  function matrisSvg(dokuz, ops, { s = 62 } = {}) {
    const ara = 8, mW = 3 * s + 2 * ara, oW = 4 * s + 3 * 14, W = Math.max(mW, oW) + 24;
    let ic = "";
    const x0 = (W - mW) / 2;
    dokuz.forEach((f, i) => { ic += hucre(x0 + (i % 3) * (s + ara), 8 + Math.floor(i / 3) * (s + ara), s, f); });
    if (!ops || !ops.length) return svg(W, 8 + 3 * s + 2 * ara + 8, ic, "3×3 şekil matrisi");
    const y2 = 8 + 3 * s + 2 * ara + 26;
    ic += `<line class="g-ince" x1="8" x2="${W - 8}" y1="${y2 - 13}" y2="${y2 - 13}" stroke-dasharray="4 4"/>`;
    const xb = (W - oW) / 2;
    ops.forEach((f, i) => { const x = xb + i * (s + 14); ic += hucre(x, y2, s, f) + yazi(x + s / 2, y2 + s + 19, HARF[i], { b: 1 }); });
    return svg(W, y2 + s + 28, ic, "3×3 şekil matrisi ve seçenekler");
  }
  /* Kare ızgara: n×n, dolu = Set("r,c") ya da {"r,c": sınıf} */
  function izgaraCiz(x, y, n, b, dolu, renk = "g-a") {
    let ic = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const k = r + "," + c, sn = dolu instanceof Set ? (dolu.has(k) ? renk : "g-bos") : (dolu[k] || "g-bos");
      ic += `<rect class="${sn} g-cizgi" stroke-width="1" x="${(x + c * b).toFixed(1)}" y="${(y + r * b).toFixed(1)}" width="${b.toFixed(1)}" height="${b.toFixed(1)}"/>`;
    }
    return ic;
  }
  /* Analog saat: akrep (saat) ve isteğe bağlı yelkovan (dakika) */
  function saatCiz(cx, cy, r, h, dk = null) {
    let ic = `<circle class="g-bos g-cizgi" stroke-width="2" cx="${cx}" cy="${cy}" r="${r}"/>`;
    for (let i = 0; i < 12; i++) { const a = (i * 30 - 90) * Math.PI / 180, u = i % 3 ? 0.88 : 0.8; ic += `<line class="g-cizgi" stroke-width="${i % 3 ? 1 : 2}" x1="${(cx + r * u * Math.cos(a)).toFixed(1)}" y1="${(cy + r * u * Math.sin(a)).toFixed(1)}" x2="${(cx + r * Math.cos(a)).toFixed(1)}" y2="${(cy + r * Math.sin(a)).toFixed(1)}"/>`; }
    const el = (aci, boy, k) => { const a = (aci - 90) * Math.PI / 180; return `<line class="${k}" stroke-width="${k === "g-cizgi" ? 3.5 : 2.2}" stroke-linecap="round" x1="${cx}" y1="${cy}" x2="${(cx + r * boy * Math.cos(a)).toFixed(1)}" y2="${(cy + r * boy * Math.sin(a)).toFixed(1)}"/>`; };
    ic += el(dk === null ? (h % 12) * 30 : (h % 12) * 30 + dk * 0.5, 0.5, "g-cizgi");
    if (dk !== null) ic += el(dk * 6, 0.8, "g-ok-a");
    [[12, 0], [3, 90], [6, 180], [9, 270]].forEach(([t, a]) => { const rr = (a - 90) * Math.PI / 180; ic += `<text class="g-yazi-k" x="${(cx + r * 0.6 * Math.cos(rr)).toFixed(1)}" y="${(cy + r * 0.6 * Math.sin(rr) + r * 0.1).toFixed(1)}" text-anchor="middle" style="font-size:${Math.max(8, r * 0.3).toFixed(0)}px">${t}</text>`; });
    return ic + `<circle class="g-cizgi-uc" cx="${cx}" cy="${cy}" r="3"/>`;
  }
  const saatNo = h => mod(h - 1, 12) + 1;
  const YON_AD = { 0: "yukarı", 45: "sağ üste", 90: "sağa", 135: "sağ alta", 180: "aşağı", 225: "sol alta", 270: "sola", 315: "sol üste" };

  /* =====================================================================
   * 1) ŞEKİL ÖRÜNTÜLERİ
   * ===================================================================== */
  const K1 = "bilsem.sekil";
  const sekilSorular = [
    /* 1. Dönen ok */
    z => {
      const adim = sec([45, 90, 135]), yon = sec([1, -1]), bas = 45 * R(0, 7);
      const a = i => mod(bas + yon * adim * i, 360);
      const yonAd = yon > 0 ? "saat yönünde" : "saat yönünün tersine";
      const okC = aci => (cx, cy, s) => sekil("ok", cx, cy, s * 0.36, "g-a", aci);
      const aday = [
        [a(3), "dikkat", "Bu ok dizideki son okun aynısı. Ok her adımda döndüğü için sıradaki ok sonuncuyla aynı yöne bakamaz."],
        [mod(a(4) + 180, 360), "kavrama", "Bu ok doğru yönün tam tersini gösteriyor; dönme miktarını ya da yönünü yanlış belirlemiş olabilirsin."],
        [a(5), "islem", "Bu ok bir adım fazla dönmüş. Sıradaki şekil için yalnızca bir dönme adımı eklenir."],
        [a(2), "dikkat", "Bu ok iki adım geride kalıyor; dizinin üçüncü şekliyle aynı."],
      ];
      const gor = new Set([a(4)]), ops = [{ c: okC(a(4)) }];
      for (const [v, h, n] of aday) if (!gor.has(v) && ops.length < 4) { gor.add(v); ops.push({ c: okC(v), hata: h, neden: n }); }
      const hs = harfle(ops), toplam = 4 * adim, kalan = toplam % 360;
      return SG({
        kaz: K1, duzey: "uygulama", zorluk: adim === 90 ? 1 : 2,
        soru: "Oklar soldan sağa belli bir kurala göre dönüyor. Soru işaretli kutuya hangi ok gelmelidir?",
        gorsel: seriSvg([0, 1, 2, 3].map(i => okC(a(i))).concat([null]), hs.liste, { etiket: "dönen oklar dizisi" }),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Ardışık iki oka bak: ok ne kadar ve hangi yöne dönmüş?",
        cozum: [
          "🔎 Soruyu anlayalım: Dört ok verilmiş, beşincisini bulacağız. Okların yalnızca baktığı yön değişiyor.",
          "💡 Hatırlayalım: Dönme örüntülerinde iki ardışık şekil arasındaki dönme miktarını ve yönünü buluruz. Tam tur 360°, çeyrek tur 90°'dir.",
          `✏️ 1. ok ${YON_AD[a(0)]}, 2. ok ${YON_AD[a(1)]} bakıyor: ok ${yonAd} ${adim}° dönmüş. 3. ve 4. oklarda da aynı dönme var.`,
          `✏️ 4. ok ${YON_AD[a(3)]} bakıyor. Bir kez daha ${yonAd} ${adim}° döndürünce ${YON_AD[a(4)]} bakar.`,
          `✅ Sonuç: ${YON_AD[a(4)]} bakan ok, yani ${hs.harf} seçeneği.`,
          `🔁 Kontrol edelim: İlk oktan beşinciye 4 adım var: 4 × ${adim}° = ${toplam}°. ${kalan === 0 ? "Bu tam tur eder; beşinci ok ilk okla aynı yöne bakmalı." : kalan === 180 ? "Bu, ilk okun tam tersi yöne bakmak demek." : "Sonuç tutarlı."}`,
        ],
        kural: "Dönme örüntüsünde önce dönme yönünü, sonra dönme miktarını bul.",
        dogruNeden: `${hs.harf} şıkkındaki ok, son oku bir kez daha ${yonAd} ${adim}° döndürünce elde edilir.`,
      });
    },
    /* 2. Nokta sayısı sabit artıyor */
    z => {
      const a = R(1, 3), d = R(1, 3), n = i => a + d * i, c = n(4);
      return S({
        kaz: K1, duzey: "uygulama", zorluk: 1,
        soru: "Kutulardaki nokta sayıları bir kurala göre değişiyor. Beşinci kutuda kaç nokta olmalıdır?",
        gorsel: seriSvg([0, 1, 2, 3].map(i => (cx, cy, s) => noktalar(n(i), cx, cy, s * 0.66)).concat([null]), null, { etiket: "nokta dizisi" }),
        dogru: c,
        yanlis: [[n(3), "dikkat", "Bu sayı dördüncü kutudaki nokta sayısı; sıradaki kutuda bir artış daha olmalı."], [n(5), "islem", "Bir artışı fazla eklemişsin; dördüncüden beşinciye yalnızca bir adım var."], [c + 1, "islem", `Artış miktarı her adımda ${d}; noktaları yeniden say.`], [c - 1, "islem", `Artış miktarı her adımda ${d}; noktaları yeniden say.`]],
        ipucu: "Her kutudaki noktaları say ve ardışık sayıların farkına bak.",
        cozum: [
          "🔎 Soruyu anlayalım: Dört kutudaki noktaları sayıp beşinci kutudaki sayıyı tahmin edeceğiz.",
          "💡 Hatırlayalım: Ardışık terimlerin farkı hep aynıysa örüntü sabit artışlıdır; her adımda aynı sayıyı ekleriz.",
          `✏️ Sayalım: ${n(0)}, ${n(1)}, ${n(2)}, ${n(3)}.`,
          `✏️ Farklar: ${d}, ${d}, ${d}. Yani her kutuda ${d} nokta artıyor.`,
          `✅ Sonuç: ${n(3)} + ${d} = ${c} nokta.`,
          `🔁 Kontrol edelim: İlk kutudan başla: ${a} + 4 × ${d} = ${c}. Aynı sonuç!`,
        ],
        kural: "Sabit artışlı örüntüde fark hep aynıdır.",
        dogruNeden: `Noktalar her adımda ${d} artıyor; ${n(3)} + ${d} = ${c}.`,
      });
    },
    /* 3. Nokta sayısı artan artışla */
    z => {
      const a = R(1, 3), dizi = [a, a + 1, a + 3, a + 6], c = a + 10;
      return S({
        kaz: K1, duzey: "uygulama", zorluk: 2,
        soru: "Kutulardaki nokta sayıları bir kurala göre artıyor. Beşinci kutuda kaç nokta olmalıdır?",
        gorsel: seriSvg(dizi.map(v => (cx, cy, s) => noktalar(v, cx, cy, s * 0.7)).concat([null]), null, { etiket: "artan nokta dizisi" }),
        dogru: c,
        yanlis: [[a + 9, "dikkat", "Son artışı (3) tekrar etmişsin. Burada artış miktarı her adımda 1 büyüyor."], [a + 12, "kavrama", "Son sayıyı iki katına çıkarmışsın; artışlar ise 1, 2, 3 diye gidiyor."], [a + 11, "islem", "Artış 4 olmalı; toplamayı yeniden kontrol et."]],
        ipucu: "Ardışık kutular arasındaki artışları yaz; artışlar da bir örüntü oluşturuyor mu?",
        cozum: [
          "🔎 Soruyu anlayalım: Dört kutudaki noktaları sayıp beşinci kutuyu bulacağız.",
          "💡 Hatırlayalım: Bazı örüntülerde artış sabit değildir; artış miktarının kendisi de bir kurala uyar.",
          `✏️ Sayalım: ${dizi.join(", ")}.`,
          "✏️ Artışlar: +1, +2, +3. Artış her adımda 1 büyüyor; sıradaki artış +4.",
          `✅ Sonuç: ${a + 6} + 4 = ${c} nokta.`,
          "🔁 Kontrol edelim: Artışlar 1, 2, 3, 4 — düzenli büyüyor. Bir dahaki sefere farkların farkına da bak!",
        ],
        kural: "Farklar sabit değilse farkların örüntüsüne bak.",
        dogruNeden: `Artışlar 1, 2, 3 olduğundan sıradaki artış 4'tür: ${a + 6} + 4 = ${c}.`,
      });
    },
    /* 4. Şekil (3'lü döngü) ve renk (2'li döngü) */
    z => {
      const sk = karistir(["kare", "daire", "ucgen", "yildiz", "besgen"]).slice(0, 3), rk = karistir(RENKLER).slice(0, 2), k = R(5, 6);
      const C = (t, r) => (cx, cy, s) => sekil(t, cx, cy, s * 0.32, r);
      const ds = sk[k % 3], dr = rk[k % 2], d2 = rk[(k + 1) % 2];
      const hs = harfle([{ c: C(ds, dr) },
        { c: C(ds, d2), hata: "dikkat", neden: `Şekil doğru ama renk yanlış; renkler ${RENK_AD[rk[0]]}–${RENK_AD[rk[1]]} diye ikişerli değişiyor.` },
        { c: C(sk[(k + 1) % 3], dr), hata: "kavrama", neden: "Renk doğru ama şekil yanlış; şekiller üçlü bir döngüyle tekrar ediyor." },
        { c: C(sk[(k + 2) % 3], d2), hata: "dikkat", neden: "Bu şekil dizideki son kutunun aynısı; hem şekil hem renk bir adım ilerlemeli." }]);
      return SG({
        kaz: K1, duzey: "uygulama", zorluk: 2,
        soru: "Dizide hem şekiller hem renkler kendi kuralına göre tekrar ediyor. Soru işaretli kutuya hangisi gelmelidir?",
        gorsel: seriSvg(Array.from({ length: k }, (_, i) => C(sk[i % 3], rk[i % 2])).concat([null]), hs.liste, { s: 58 }),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Şekilleri ve renkleri ayrı ayrı incele: Her biri kaç adımda bir tekrar ediyor?",
        cozum: [
          `🔎 Soruyu anlayalım: ${k} kutu verilmiş; ${k + 1}. kutunun hem şeklini hem rengini bulacağız.`,
          "💡 Hatırlayalım: Bir dizide iki özellik değişiyorsa her özelliği ayrı ayrı incelemek işimizi kolaylaştırır.",
          `✏️ Şekiller: ${SEKIL_AD[sk[0]]}, ${SEKIL_AD[sk[1]]}, ${SEKIL_AD[sk[2]]} diye 3'lü tekrar ediyor. ${k + 1}. kutu → ${SEKIL_AD[ds]}.`,
          `✏️ Renkler: ${RENK_AD[rk[0]]}, ${RENK_AD[rk[1]]} diye 2'li tekrar ediyor. ${k + 1}. kutu ${k % 2 === 0 ? "tek" : "çift"} sırada → ${RENK_AD[dr]}.`,
          `✅ Sonuç: ${RENK_AD[dr]} ${SEKIL_AD[ds]}, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Bulduğun şekli dizinin sonuna koyup baştan oku; şekiller üçerli, renkler ikişerli düzgün tekrar ediyor olmalı.",
        ],
        kural: "Birden çok özellik değişiyorsa her özelliğin döngüsünü ayrı bul.",
        dogruNeden: `Şekil döngüsüne göre ${SEKIL_AD[ds]}, renk döngüsüne göre ${RENK_AD[dr]} gelmeli; bu da ${hs.harf} şıkkıdır.`,
      });
    },
    /* 5. Kenar sayısı artan çokgenler, biri eksik */
    z => {
      const tur = ["ucgen", "kare", "besgen", "altigen"], p = R(1, 3), renk = sec(RENKLER);
      const C = t => (cx, cy, s) => sekil(t, cx, cy, s * 0.34, renk);
      const dg = tur[p], digerleri = tur.filter(t => t !== dg);
      const ops = [{ c: C(dg) }];
      karistir(digerleri).slice(0, 2).forEach(t => ops.push({ c: C(t), hata: "dikkat", neden: `Bu bir ${SEKIL_AD[t]} (${KENAR[t]} kenarlı); dizide zaten yeri var. Eksik yerde ${KENAR[dg]} kenarlı şekil olmalı.` }));
      ops.push({ c: C("daire"), hata: "kavrama", neden: "Dairenin köşesi ve düz kenarı yoktur; dizi kenar sayısına göre ilerliyor." });
      const hs = harfle(ops);
      return SG({
        kaz: K1, duzey: "aciklama", zorluk: 1,
        soru: "Dizideki şekiller bir kurala göre sıralanmıştır. Soru işaretli kutuya hangisi gelmelidir?",
        gorsel: seriSvg(tur.map((t, i) => i === p ? null : C(t)), hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Her şeklin kenarlarını say.",
        cozum: [
          "🔎 Soruyu anlayalım: Dört kutudan biri boş; şekillerin sıralanma kuralını bulup boşluğu dolduracağız.",
          "💡 Hatırlayalım: Çokgenleri kenar sayılarına göre adlandırırız: üçgen 3, kare 4, beşgen 5, altıgen 6 kenarlıdır.",
          `✏️ Kenar sayılarını yazalım: ${tur.map((t, i) => i === p ? "?" : KENAR[t]).join(", ")}.`,
          `✏️ Kenar sayısı her adımda 1 artıyor; boş yere ${KENAR[dg]} gelmeli.`,
          `✅ Sonuç: ${KENAR[dg]} kenarlı şekil ${SEKIL_AD[dg]}, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: 3, 4, 5, 6 — her adımda 1 artış var; dizi kusursuz.",
        ],
        kural: "Şekil dizilerinde kenar, köşe ya da parça sayısını saymak kuralı ortaya çıkarır.",
        dogruNeden: `Kenar sayıları 3, 4, 5, 6 diye artar; boşluğa ${KENAR[dg]} kenarlı ${SEKIL_AD[dg]} gelir.`,
      });
    },
    /* 6. Köşelerde dolaşan nokta + renk değişimi */
    z => {
      const KOSE = [[-1, -1], [1, -1], [1, 1], [-1, 1]], KAD = ["sol üst", "sağ üst", "sağ alt", "sol alt"];
      const b = R(0, 3), d = sec([1, -1]), k = R(4, 5), rk = karistir(["g-b", "g-a", "g-c"]).slice(0, 2);
      const C = (pz, r) => (cx, cy, s) => sekil("kare", cx, cy, s * 0.17, r) + `<circle class="g-cizgi-uc" cx="${(cx + KOSE[pz][0] * s * 0.3).toFixed(1)}" cy="${(cy + KOSE[pz][1] * s * 0.3).toFixed(1)}" r="${(s * 0.08).toFixed(1)}"/>`;
      const poz = i => mod(b + d * i, 4), rn = i => rk[i % 2];
      const hs = harfle([{ c: C(poz(k), rn(k)) },
        { c: C(poz(k - 1), rn(k)), hata: "dikkat", neden: "Renk doğru ama nokta bir önceki köşede kalmış; nokta her adımda bir köşe ilerliyor." },
        { c: C(poz(k), rn(k + 1)), hata: "dikkat", neden: "Noktanın yeri doğru ama ortadaki karenin rengi yanlış; renkler sırayla değişiyor." },
        { c: C(poz(k + 2), rn(k + 1)), hata: "kavrama", neden: "Hem noktanın yeri hem renk yanlış; noktanın dönme yönünü yeniden incele." }]);
      const yonAd = d > 0 ? "saat yönünde" : "saat yönünün tersine";
      return SG({
        kaz: K1, duzey: "uygulama", zorluk: 2,
        soru: "Kutulardaki nokta ve ortadaki kare bir kurala göre değişiyor. Soru işaretli kutuya hangisi gelmelidir?",
        gorsel: seriSvg(Array.from({ length: k }, (_, i) => C(poz(i), rn(i))).concat([null]), hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Önce yalnızca noktayı izle, sonra yalnızca ortadaki karenin rengini.",
        cozum: [
          `🔎 Soruyu anlayalım: ${k} kutu var; ${k + 1}. kutuda noktanın hangi köşede olacağını ve karenin rengini bulacağız.`,
          "💡 Hatırlayalım: İki şey birden değişiyorsa onları tek tek izleriz.",
          `✏️ Nokta: ${Array.from({ length: k }, (_, i) => KAD[poz(i)]).join(" → ")}. Her adımda ${yonAd} bir köşe ilerliyor; sıradaki köşe ${KAD[poz(k)]}.`,
          `✏️ Kare: ${RENK_AD[rk[0]]}, ${RENK_AD[rk[1]]} diye sırayla değişiyor; ${k + 1}. kutuda ${RENK_AD[rn(k)]}.`,
          `✅ Sonuç: Nokta ${KAD[poz(k)]} köşede, kare ${RENK_AD[rn(k)]}: ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Nokta 4 adımda tam bir tur atar; ilk kutudan saydığında aynı köşeye ulaşıyorsan doğrudur.",
        ],
        kural: "Hareket eden öğelerde önce yönü, sonra adım büyüklüğünü bul.",
        dogruNeden: `Nokta ${yonAd} ilerleyerek ${KAD[poz(k)]} köşeye gelir, kare de ${RENK_AD[rn(k)]} olur.`,
      });
    },
    /* 7. Merdiven (üçgensel sayılar) */
    z => {
      const k0 = R(1, 2), T = n => n * (n + 1) / 2, n = k0 + 4;
      const C = m => (cx, cy, s) => {
        const u = s * 0.78 / (k0 + 3), x0 = cx - m * u / 2, y0 = cy + m * u / 2; let ic = "";
        for (let c = 0; c < m; c++) for (let r = 0; r <= c; r++) ic += `<rect class="g-b g-cizgi" stroke-width="1" x="${(x0 + c * u).toFixed(1)}" y="${(y0 - (r + 1) * u).toFixed(1)}" width="${u.toFixed(1)}" height="${u.toFixed(1)}"/>`;
        return ic;
      };
      return S({
        kaz: K1, duzey: "transfer", zorluk: 2,
        soru: "Ece küplerle merdivenler yapıyor. Her merdivende bir basamak daha var. Bu düzenle devam ederse soru işaretli merdivende kaç küp olur?",
        gorsel: seriSvg([0, 1, 2, 3].map(i => C(k0 + i)).concat([null]), null, { s: 76, etiket: "küp merdivenler" }),
        dogru: T(n),
        yanlis: [[T(n - 1) + n - 1, "dikkat", "Son artışı tekrar etmişsin; yeni basamak bir öncekinden 1 küp daha yüksektir."], [n * n, "kavrama", "Merdiven kare değildir; basamaklar 1'den başlayıp birer birer yükselir."], [T(n) + n + 1, "islem", "Bir basamak fazla saymışsın."]],
        ipucu: "Her yeni merdivene en sağa ne kadar yüksek bir sütun ekleniyor?",
        cozum: [
          "🔎 Soruyu anlayalım: Merdivenlerdeki küpleri sayıp sıradaki merdivenin küp sayısını bulacağız.",
          "💡 Hatırlayalım: Her yeni merdivene sağdan bir sütun eklenir; bu sütunun yüksekliği basamak sayısına eşittir.",
          `✏️ Sayalım: ${[0, 1, 2, 3].map(i => T(k0 + i)).join(", ")}.`,
          `✏️ Artışlar: ${[1, 2, 3].map(i => "+" + (k0 + i)).join(", ")}. Sıradaki artış +${n}.`,
          `✅ Sonuç: ${T(n - 1)} + ${n} = ${T(n)} küp.`,
          `🔁 Kontrol edelim: ${n} basamaklı merdiven 1 + 2 + … + ${n} = ${T(n)} küptür.`,
        ],
        kural: "1'den n'ye kadar sayıların toplamı merdiven (üçgensel) sayıları verir.",
        dogruNeden: `${n} basamaklı merdivende 1 + 2 + … + ${n} = ${T(n)} küp vardır.`,
      });
    },
    /* 8. Bayrak: yansıma (2'li) + renk (3'lü) */
    z => {
      const rk = karistir(RENKLER).slice(0, 3), m0 = R(0, 1), k = 5;
      const C = (ayna, r) => (cx, cy, s) => {
        const u = s * 0.3, px = cx - u * 0.6;
        const ic = `<line class="g-cizgi" stroke-width="3" x1="${px}" y1="${cy - u * 1.1}" x2="${px}" y2="${cy + u * 1.2}"/><polygon class="${r} g-cizgi" stroke-width="2" points="${P([[px, cy - u * 1.1], [px + u * 1.6, cy - u * 0.6], [px, cy - u * 0.1]])}"/>`;
        return ayna ? `<g transform="translate(${2 * cx} 0) scale(-1 1)">${ic}</g>` : ic;
      };
      const am = i => (i + m0) % 2, rn = i => rk[i % 3];
      const yonAd = i => am(i) ? "sola" : "sağa";
      const hs = harfle([{ c: C(am(k), rn(k)) },
        { c: C(1 - am(k), rn(k)), hata: "dikkat", neden: "Renk doğru ama bayrak ters yöne bakıyor; bayrak her adımda yön değiştiriyor." },
        { c: C(am(k), rn(k + 1)), hata: "kavrama", neden: "Bayrağın yönü doğru ama renk yanlış; renkler üçlü bir sırayla tekrar ediyor." },
        { c: C(1 - am(k), rn(k + 2)), hata: "dikkat", neden: "Bu bayrak son kutudakinin aynısı; sıradaki kutuda iki özellik de değişmeli." }]);
      return SG({
        kaz: K1, duzey: "uygulama", zorluk: 2,
        soru: "Bayrakların yönü ve rengi bir kurala göre değişiyor. Soru işaretli kutuya hangisi gelmelidir?",
        gorsel: seriSvg(Array.from({ length: k }, (_, i) => C(am(i), rn(i))).concat([null]), hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Bayrağın yönü kaç adımda bir, rengi kaç adımda bir tekrar ediyor?",
        cozum: [
          "🔎 Soruyu anlayalım: Beş bayrak verilmiş; altıncının yönünü ve rengini bulacağız.",
          "💡 Hatırlayalım: Bir şeklin aynadaki görüntüsü sağ ile solu yer değiştirir. Bu dizide bayrak her adımda aynada yansıyor.",
          `✏️ Yön: ${[0, 1, 2, 3, 4].map(yonAd).join(", ")} → 6. bayrak ${yonAd(5)} bakar.`,
          `✏️ Renk: ${RENK_AD[rk[0]]}, ${RENK_AD[rk[1]]}, ${RENK_AD[rk[2]]} diye 3'lü tekrar ediyor → 6. bayrak ${RENK_AD[rn(5)]}.`,
          `✅ Sonuç: ${yonAd(5)} bakan ${RENK_AD[rn(5)]} bayrak, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Yön 2 adımda, renk 3 adımda bir tekrar eder; 6. kutu her iki döngüyü de tamamlar, bu yüzden 6. bayrağın rengi 3. bayrağınkiyle aynıdır.",
        ],
        kural: "Yansımada şekil sağdan sola (ya da soldan sağa) döner; döngü uzunluklarını ayrı ayrı bul.",
        dogruNeden: `Yön kuralına göre ${yonAd(5)}, renk kuralına göre ${RENK_AD[rn(5)]} olmalı: ${hs.harf}.`,
      });
    },
    /* 9. Saat ibresi: artan adımlarla ilerliyor */
    z => {
      const h0 = R(1, 12), adimlar = [0, 1, 3, 6], c = saatNo(h0 + 10);
      return S({
        kaz: K1, duzey: "transfer", zorluk: 2,
        soru: "Bir saatin tek ibresi her resimde bir kurala göre ilerliyor. Beşinci resimde ibre hangi sayıyı gösterir?",
        gorsel: seriSvg(adimlar.map(a => (cx, cy, s) => saatCiz(cx, cy, s * 0.42, saatNo(h0 + a))).concat([null]), null, { s: 76, etiket: "ibreli saatler" }),
        dogru: c,
        yanlis: [[saatNo(h0 + 9), "dikkat", "Son artışı (3) tekrar etmişsin; ibre her seferinde bir öncekinden 1 sayı fazla ilerliyor."], [saatNo(h0 + 11), "islem", "İbre 4 sayı ilerlemeli, 5 değil; yeniden say."], [saatNo(h0 + 8), "islem", "İbre 4 sayı ilerlemeli, 2 değil; artışları yeniden yaz."]],
        ipucu: "İbre her resimde kaç sayı ilerliyor? Bu ilerleme miktarları nasıl değişiyor?",
        cozum: [
          "🔎 Soruyu anlayalım: Dört saat resmi verilmiş; beşincide ibrenin hangi sayıyı göstereceğini bulacağız.",
          "💡 Hatırlayalım: Saatte 12 sayı vardır; 12'den sonra yeniden 1'e geçilir.",
          `✏️ İbrenin gösterdiği sayılar: ${adimlar.map(a => saatNo(h0 + a)).join(", ")}.`,
          "✏️ İlerlemeler: 1, 2, 3 sayı. Her seferinde 1 fazla ilerliyor; sıradaki ilerleme 4 sayı.",
          `✅ Sonuç: ${saatNo(h0 + 6)}${ek(saatNo(h0 + 6), "den")} 4 sayı ilerleyince ibre ${c} sayısını gösterir.`,
          "🔁 Kontrol edelim: 12'yi geçerken 1'den saymaya devam ettiğinden emin ol. Saat yüzünde parmağınla sayarak da kontrol edebilirsin.",
        ],
        kural: "Saat üzerinde sayarken 12'den sonra 1'e döneriz.",
        dogruNeden: `İbre 1, 2, 3, 4 sayı ilerliyor; ${saatNo(h0 + 6)} + 4 adım = ${c}.`,
      });
    },
    /* 10. Zıplayan top: üst-orta-alt-orta + renk */
    z => {
      const CYC = [0, 1, 2, 1], YAD = ["üstte", "ortada", "altta"], t0 = R(0, 3), rk = karistir(["g-d", "g-a", "g-c", "g-b"]).slice(0, 2);
      const pz = i => CYC[(t0 + i) % 4], rn = i => rk[i % 2];
      const C = (p, r) => (cx, cy, s) => `<line class="g-ince" x1="${cx}" y1="${cy - s * 0.4}" x2="${cx}" y2="${cy + s * 0.4}" stroke-dasharray="3 3"/><circle class="${r} g-cizgi" stroke-width="2" cx="${cx}" cy="${(cy + (p - 1) * s * 0.28).toFixed(1)}" r="${(s * 0.12).toFixed(1)}"/>`;
      const k = 5, dp = pz(k), ucuncu = [0, 1, 2].find(p => p !== dp && p !== pz(k - 1));
      const hs = harfle([{ c: C(dp, rn(k)) },
        { c: C(dp, rn(k + 1)), hata: "dikkat", neden: "Topun yeri doğru ama rengi yanlış; renk her adımda değişiyor." },
        { c: C(pz(k - 1), rn(k)), hata: "dikkat", neden: "Top bir önceki kutudaki yerinde kalmış; top her adımda yer değiştiriyor." },
        { c: C(ucuncu, rn(k + 1)), hata: "kavrama", neden: "Top üst–orta–alt–orta diye gidip geliyor; bu yer o sıraya uymuyor." }]);
      return SG({
        kaz: K1, duzey: "uygulama", zorluk: 2,
        soru: "Bir top kutularda aşağı yukarı zıplıyor ve rengi de değişiyor. Soru işaretli kutuya hangisi gelmelidir?",
        gorsel: seriSvg(Array.from({ length: k }, (_, i) => C(pz(i), rn(i))).concat([null]), hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Top en alta ya da en üste varınca geri dönüyor mu?",
        cozum: [
          "🔎 Soruyu anlayalım: Beş kutuda topun yeri ve rengi verilmiş; altıncı kutuyu bulacağız.",
          "💡 Hatırlayalım: Gidip gelen hareketlerde şekil bir uca varınca geri döner: üst, orta, alt, orta, üst… diye.",
          `✏️ Topun yeri: ${[0, 1, 2, 3, 4].map(i => YAD[pz(i)]).join(", ")} → sırada ${YAD[dp]}.`,
          `✏️ Renk: ${RENK_AD[rk[0]]}, ${RENK_AD[rk[1]]} diye değişiyor → 6. kutuda ${RENK_AD[rn(k)]}.`,
          `✅ Sonuç: ${YAD[dp]} duran ${RENK_AD[rn(k)]} top, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Topun hareketi 4 adımda bir tekrarlanır (üst-orta-alt-orta). 6. kutu 2. kutuyla aynı yerde olmalı; öyle mi? Evet!",
        ],
        kural: "Gidip gelen hareketlerde döngü uçlarda geri döner.",
        dogruNeden: `Top gidip gelme kuralına göre ${YAD[dp]}, renk kuralına göre ${RENK_AD[rn(k)]} olmalı.`,
      });
    },
    /* 11. Boyalı çeyrek saat yönünde, nokta ters yönde */
    z => {
      const QAD = ["sol üst", "sağ üst", "sağ alt", "sol alt"], QX = [[-1, -1], [0, -1], [0, 0], [-1, 0]];
      const b0 = R(0, 3), d0 = R(0, 3), k = sec([3, 5]);
      const bp = i => mod(b0 + i, 4), dp = i => mod(d0 - i, 4);
      const C = (bq, dq) => (cx, cy, s) => {
        const u = s * 0.36; let ic = "";
        for (let q = 0; q < 4; q++) ic += `<rect class="${q === bq ? "g-a" : "g-bos"} g-cizgi" stroke-width="1.5" x="${(cx + QX[q][0] * u).toFixed(1)}" y="${(cy + QX[q][1] * u).toFixed(1)}" width="${u.toFixed(1)}" height="${u.toFixed(1)}"/>`;
        return ic + `<circle class="g-d g-cizgi" stroke-width="1.5" cx="${(cx + (QX[dq][0] + 0.5) * u).toFixed(1)}" cy="${(cy + (QX[dq][1] + 0.5) * u).toFixed(1)}" r="${(u * 0.22).toFixed(1)}"/>`;
      };
      const hs = harfle([{ c: C(bp(k), dp(k)) },
        { c: C(bp(k), mod(d0 + k, 4)), hata: "kavrama", neden: "Mavi bölge doğru ama kırmızı nokta yanlış yönde ilerletilmiş; nokta saat yönünün tersine gidiyor." },
        { c: C(bp(k + 1), dp(k)), hata: "islem", neden: "Nokta doğru ama mavi bölge bir adım fazla ilerletilmiş." },
        { c: C(bp(k - 1), dp(k - 1)), hata: "dikkat", neden: "Bu, dizideki son kutunun aynısı; sıradaki kutuda iki öğe de birer adım ilerler." }]);
      return SG({
        kaz: K1, duzey: "uygulama", zorluk: 3,
        soru: "Karelerde mavi bölge ve kırmızı nokta farklı kurallara göre hareket ediyor. Soru işaretli kutuya hangisi gelmelidir?",
        gorsel: seriSvg(Array.from({ length: k }, (_, i) => C(bp(i), dp(i))).concat([null]), hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Mavi bölgeyi ve kırmızı noktayı ayrı ayrı takip et; ikisi aynı yöne mi gidiyor?",
        cozum: [
          `🔎 Soruyu anlayalım: ${k} kare verilmiş; ${k + 1}. karedeki mavi bölgeyi ve kırmızı noktayı bulacağız.`,
          "💡 Hatırlayalım: Aynı şekildeki iki öğe farklı yönlere dönebilir. Her birini tek başına izlemek gerekir.",
          `✏️ Mavi bölge: ${Array.from({ length: k }, (_, i) => QAD[bp(i)]).join(" → ")}. Saat yönünde birer adım; sıradaki ${QAD[bp(k)]}.`,
          `✏️ Kırmızı nokta: ${Array.from({ length: k }, (_, i) => QAD[dp(i)]).join(" → ")}. Saat yönünün tersine birer adım; sıradaki ${QAD[dp(k)]}.`,
          `✅ Sonuç: Mavi ${QAD[bp(k)]}, nokta ${QAD[dp(k)]} bölmede: ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: İki öğe zıt yönde döndüğü için bazen aynı bölmeye düşebilir; bu kuralı bozmaz. Seçtiğin şekli dizinin sonuna koyup iki hareketi yeniden izle.",
        ],
        kural: "Zıt yönde hareket eden öğeleri ayrı ayrı izle.",
        dogruNeden: `Mavi bölge saat yönünde ${QAD[bp(k)]} bölmeye, kırmızı nokta ters yönde ${QAD[dp(k)]} bölmeye gelir.`,
      });
    },
    /* 12. 3×3 ızgarada kenar boyunca ilerleyen kare */
    z => {
      const CEV = ["0,0", "0,1", "0,2", "1,2", "2,2", "2,1", "2,0", "1,0"], p0 = R(0, 7), st = sec([1, 2, 3]), k = 5;
      const pz = i => mod(p0 + st * i, 8);
      const C = p => (cx, cy, s) => izgaraCiz(cx - s * 0.36, cy - s * 0.36, 3, s * 0.24, new Set([CEV[p]]), "g-d");
      const hs = harfle([{ c: C(pz(k)) },
        { c: C(pz(k - 1)), hata: "dikkat", neden: "Bu, son kutudaki konum; kare her adımda ilerliyor." },
        { c: C(mod(p0 - st * k, 8)), hata: "kavrama", neden: "Kare bu kadar adımı ters yönde gitmiş gibi; hareket saat yönünde." },
        { c: C(mod(pz(k) + 1, 8)), hata: "islem", neden: "Kare bir kare fazla ilerletilmiş; adım büyüklüğünü yeniden say." }]);
      const adAd = { 1: "bir", 2: "iki", 3: "üç" }[st];
      return SG({
        kaz: K1, duzey: "uygulama", zorluk: st === 1 ? 1 : 2,
        soru: "Kırmızı kare, 3×3'lük ızgaranın dış kenarındaki kutularda bir kurala göre ilerliyor. Soru işaretli kutuya hangisi gelmelidir?",
        gorsel: seriSvg(Array.from({ length: k }, (_, i) => C(pz(i))).concat([null]), hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Ardışık iki şekilde kırmızı kare kaç kutu ve hangi yönde gitmiş?",
        cozum: [
          "🔎 Soruyu anlayalım: Kırmızı kare yalnızca dış kenardaki 8 kutuda dolaşıyor; altıncı konumunu arıyoruz.",
          "💡 Hatırlayalım: Çevrede dolaşan bir öğe 8 kutuluk bir halka üzerinde döner; 8 kutu ilerleyince başladığı yere gelir.",
          `✏️ 1. ve 2. şekli karşılaştıralım: Kare saat yönünde ${adAd} kutu ilerlemiş. Diğer adımlarda da öyle.`,
          `✏️ 5. şekildeki konumdan saat yönünde ${adAd} kutu daha sayıyoruz.`,
          `✅ Sonuç: ${hs.harf} seçeneğindeki konum.`,
          `🔁 Kontrol edelim: İlk konumdan toplam ${5 * st} kutu ilerlemek gerekir; ${5 * st >= 8 ? `${5 * st} − 8 = ${5 * st - 8}, yani ilk konumdan ${5 * st - 8} kutu ötesi` : "bu da aynı yeri verir"}.`,
        ],
        kural: "Halka biçiminde dolaşan öğelerde tur sayısını (burada 8) çıkararak kısa yoldan sayabilirsin.",
        dogruNeden: `Kare her adımda saat yönünde ${adAd} kutu ilerliyor; 6. konum ${hs.harf} şıkkındadır.`,
      });
    },
    /* 13. Hem sayı hem şekil değişiyor */
    z => {
      const sk = karistir(["kare", "daire", "ucgen", "yildiz"]).slice(0, 3), rk = sec(RENKLER), k = 5;
      const C = (n, t) => (cx, cy, s) => kopyalar(n, t, rk, cx, cy, s * 0.72);
      const hs = harfle([{ c: C(k + 1, sk[k % 3]) },
        { c: C(k + 1, sk[(k + 1) % 3]), hata: "kavrama", neden: "Şekil sayısı doğru ama şekil türü yanlış; şekiller üçlü sırayla değişiyor." },
        { c: C(k, sk[k % 3]), hata: "islem", neden: "Şekil türü doğru ama sayısı eksik; her kutuda bir şekil artıyor." },
        { c: C(k + 2, sk[k % 3]), hata: "islem", neden: "Şekil türü doğru ama sayısı fazla; bir sonraki kutuda yalnızca bir şekil eklenir." }]);
      return SG({
        kaz: K1, duzey: "uygulama", zorluk: 2,
        soru: "Kutulardaki şekillerin hem türü hem sayısı değişiyor. Soru işaretli kutuya hangisi gelmelidir?",
        gorsel: seriSvg(Array.from({ length: k }, (_, i) => C(i + 1, sk[i % 3])).concat([null]), hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Önce kutulardaki şekil sayılarını, sonra şekil türlerinin sırasını incele.",
        cozum: [
          "🔎 Soruyu anlayalım: Beş kutu var; altıncı kutuda kaç tane ve hangi şeklin olacağını bulacağız.",
          "💡 Hatırlayalım: İki özellik birlikte değişiyorsa her birinin kuralını ayrı ayrı buluruz.",
          "✏️ Sayılar: 1, 2, 3, 4, 5 → her kutuda bir artıyor; 6. kutuda 6 şekil.",
          `✏️ Türler: ${SEKIL_AD[sk[0]]}, ${SEKIL_AD[sk[1]]}, ${SEKIL_AD[sk[2]]}, sonra yeniden ${SEKIL_AD[sk[0]]}… 6. kutuda ${SEKIL_AD[sk[2]]}.`,
          `✅ Sonuç: 6 tane ${SEKIL_AD[sk[2]]}, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: 3. ve 6. kutular aynı tür şekil içermeli (döngü 3'lü). Seçeneğindeki şekilleri tek tek sayarak 6 olduğunu doğrula.",
        ],
        kural: "Şekil sayılarını sayarken parmağınla tek tek işaretle; atlama yapma.",
        dogruNeden: `Sayı kuralı 6, tür kuralı ${SEKIL_AD[sk[2]]} gerektirir: ${hs.harf}.`,
      });
    },
    /* 14. Aynalı (simetrik) dizi */
    z => {
      const sk = karistir(["kare", "daire", "ucgen", "yildiz", "altigen", "arti"]).slice(0, 4), rk = karistir(RENKLER);
      const sira = [0, 1, 2, 3, 2, 1, 0], m = R(4, 6), d = sira[m];
      const C = i => (cx, cy, s) => sekil(sk[i], cx, cy, s * 0.3, rk[i]);
      const ops = [{ c: C(d) }];
      [0, 1, 2, 3].filter(i => i !== d).forEach(i => ops.push({ c: C(i), hata: i === 3 ? "kavrama" : "dikkat", neden: i === 3 ? "Dizinin ortasındaki şekil yalnızca bir kez görünür; ayna dizisinin ortası tektir." : "Bu şekil, ortadaki şekle göre karşılık gelen yerdeki şekille eşleşmiyor." }));
      const hs = harfle(ops);
      return SG({
        kaz: K1, duzey: "aciklama", zorluk: 1,
        soru: "Bu şekil dizisi ortadaki şekle göre ayna gibi (simetrik) dizilmiştir. Soru işaretli kutuya hangisi gelmelidir?",
        gorsel: seriSvg(sira.map((i, j) => j === m ? null : C(i)), hs.liste, { s: 56 }),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Ortadaki (4.) şekli bul; soru işaretinin ortaya uzaklığı kadar öbür taraftaki şekle bak.",
        cozum: [
          "🔎 Soruyu anlayalım: 7 kutuluk dizide bir kutu boş; dizi ortaya göre simetrik.",
          "💡 Hatırlayalım: Simetrik dizide ortadan eşit uzaklıktaki kutularda aynı şekil bulunur (1. ile 7., 2. ile 6., 3. ile 5.).",
          `✏️ Soru işareti ${m + 1}. kutuda. Ortadaki 4. kutuya uzaklığı ${m - 3}.`,
          `✏️ Öbür taraftaki eşi ${7 - m}. kutu; orada ${SEKIL_AD[sk[d]]} var.`,
          `✅ Sonuç: ${RENK_AD[rk[d]]} ${SEKIL_AD[sk[d]]}, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Diziyi sondan başa oku; baştan okuyunca aynı sırayı vermeli.",
        ],
        kural: "Simetrik dizi tersten okununca da aynıdır.",
        dogruNeden: `${m + 1}. kutunun simetrik eşi ${7 - m}. kutudur ve orada ${SEKIL_AD[sk[d]]} vardır.`,
      });
    },
    /* 15. Kibrit örüntüsü */
    z => {
      const tur = sec(["kare", "ucgen"]), n = R(6, 10);
      const kare = tur === "kare", f = m => kare ? 3 * m + 1 : 2 * m + 1;
      const C = m => (cx, cy, s) => {
        const u = Math.min(s * 0.8 / (kare ? 3 : 2), 30), y0 = cy - u / 2; let ic = "";
        const L = (x1, y1, x2, y2) => `<line class="g-cizgi" stroke-width="3.5" stroke-linecap="round" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
        if (kare) { const x0 = cx - m * u / 2; for (let i = 0; i < m; i++) ic += L(x0 + i * u, y0, x0 + i * u + u, y0) + L(x0 + i * u, y0 + u, x0 + i * u + u, y0 + u) + L(x0 + i * u, y0, x0 + i * u, y0 + u); ic += L(x0 + m * u, y0, x0 + m * u, y0 + u); }
        else {
          const ust = Math.floor(m / 2), alt = Math.ceil(m / 2), x0 = cx - (alt + (m % 2 ? 0 : 0.5)) * u / 2, h = u * 0.87, Bx = j => x0 + j * u, Tx = j => x0 + u / 2 + j * u;
          for (let j = 0; j < alt; j++) ic += L(Bx(j), y0 + h, Bx(j + 1), y0 + h);
          for (let j = 0; j < ust; j++) ic += L(Tx(j), y0, Tx(j + 1), y0);
          for (let i = 0; i <= m; i++) { const j = Math.floor(i / 2); ic += i % 2 === 0 ? L(Bx(j), y0 + h, Tx(j), y0) : L(Tx(j), y0, Bx(j + 1), y0 + h); }
        }
        return ic;
      };
      const ad = kare ? "kare" : "üçgen", art = kare ? 3 : 2, ilk = kare ? 4 : 3;
      return S({
        kaz: K1, duzey: "transfer", zorluk: 3,
        soru: `Arda kibrit çöpleriyle yan yana ${ad}ler yapıyor. 1, 2 ve 3 ${ad} için kullandığı çöpler görselde. Aynı düzenle <b>${n} ${ad}</b> yapmak için kaç kibrit çöpü gerekir?`,
        gorsel: seriSvg([1, 2, 3].map(C), null, { s: 120, etiket: "kibrit çöplerinden şekiller", ustYazi: ["1. adım", "2. adım", "3. adım"] }),
        dogru: f(n),
        yanlis: [[kare ? 4 * n : 3 * n, "kavrama", `Her ${ad}i ayrı ayrı sayıp ortak kenarları iki kez saymışsın; yan yana ${ad}ler bir kenarı paylaşır.`], [f(n) - 1, "islem", "Başlangıçtaki fazladan 1 çöpü unutmuşsun."], [f(n + 1), "islem", `Bir ${ad} fazla hesaplamışsın.`]],
        ipucu: `Her yeni ${ad} için kaç çöp ekleniyor? İlk ${ad} kaç çöple başlıyor?`,
        cozum: [
          `🔎 Soruyu anlayalım: Çöp sayıları ${ad} sayısına bağlı olarak artıyor; ${n} ${ad} için gereken çöpü bulacağız.`,
          `💡 Hatırlayalım: Yan yana duran ${ad}ler bir kenarı ortak kullanır; bu yüzden her yeni ${ad} için ${ilk} değil, daha az çöp gerekir.`,
          `✏️ Sayalım: 1 ${ad} → ${f(1)}, 2 ${ad} → ${f(2)}, 3 ${ad} → ${f(3)} çöp. Her adımda ${art} çöp ekleniyor.`,
          `✏️ Kural: çöp sayısı = ${art} × (${ad} sayısı) + 1. ${n} ${ad} için: ${art} × ${n} + 1.`,
          `✅ Sonuç: ${art * n} + 1 = ${f(n)} çöp.`,
          `🔁 Kontrol edelim: Kuralı 3 ${ad} için dene: ${art} × 3 + 1 = ${f(3)}. Görseldekiyle aynı!`,
        ],
        kural: "Ortak kenarlı şekillerde her yeni şekil için eklenen çöpü bul, başlangıçtaki fazlalığı unutma.",
        dogruNeden: `Her yeni ${ad} ${art} çöp ekler ve başta 1 çöp fazladır: ${art} × ${n} + 1 = ${f(n)}.`,
      });
    },
    /* 16. Kural bul: nokta sayısı ile kenar sayısı */
    z => {
      const kur = sec([{ f: k => k - 1, ad: "kenar sayısından 1 eksik" }, { f: k => k + 1, ad: "kenar sayısından 1 fazla" }, { f: k => k + 2, ad: "kenar sayısından 2 fazla" }, { f: k => 2 * k - 4, ad: "kenar sayısının 2 katından 4 eksik" }]);
      const ornek = karistir(["ucgen", "kare", "besgen"]), c = kur.f(6);
      const C = t => (cx, cy, s) => sekil(t, cx, cy - s * 0.16, s * 0.2, "g-yumusak") + noktalar(kur.f(KENAR[t]), cx, cy + s * 0.27, s * 0.36);
      return S({
        kaz: K1, duzey: "baglanti", zorluk: 2,
        soru: "Her kutuda bir çokgen ve altında birkaç nokta var. Nokta sayısı ile çokgenin kenar sayısı arasında bir ilişki bulunuyor. Altıgenin altında kaç nokta olmalıdır?",
        gorsel: seriSvg(ornek.map(C).concat([(cx, cy, s) => sekil("altigen", cx, cy - s * 0.16, s * 0.2, "g-yumusak") + yazi(cx, cy + s * 0.34, "?", { b: 1 })]), null, { s: 80, etiket: "çokgenler ve noktalar" }),
        dogru: c,
        yanlis: [[6, "kavrama", "Nokta sayısını kenar sayısına eşit saymışsın; örneklerde nokta sayısı kenar sayısıyla aynı değil."], [c + 1, "islem", "Kuralı altıgene uygularken 1 fazla bulmuşsun."], [c - 1, "islem", "Kuralı altıgene uygularken 1 eksik bulmuşsun."], [c + 2, "islem", "Kuralı yeniden uygula."]],
        ipucu: "Her örnekte kenarları say, noktaları say; iki sayıyı yan yana yaz.",
        cozum: [
          "🔎 Soruyu anlayalım: Üç örnekten kuralı bulup altıgene uygulayacağız.",
          "💡 Hatırlayalım: Üçgen 3, kare 4, beşgen 5, altıgen 6 kenarlıdır.",
          `✏️ Örnekler: ${ornek.map(t => `${SEKIL_AD[t]} ${KENAR[t]} kenar → ${kur.f(KENAR[t])} nokta`).join("; ")}.`,
          `✏️ Kural: Nokta sayısı ${kur.ad}. Altıgen için bu kuralı uygulayalım.`,
          `✅ Sonuç: Altıgenin altında ${c} nokta olmalı.`,
          "🔁 Kontrol edelim: Bulduğun kuralı üç örneğin hepsinde dene; biri bile uymazsa kural yanlıştır.",
        ],
        kural: "Kuralı bulduktan sonra bütün örneklerde dene.",
        dogruNeden: `Nokta sayısı ${kur.ad}; altıgen için ${c} nokta olur.`,
      });
    },
  ];
  B.push({ id: "sekil", ad: "Şekil örüntüleri", simge: "🔷", aciklama: "Sıradaki şekli bul: dönme, yansıma, renk ve sayı değişimlerini yakala.", sorular: sekilSorular });

  /* =====================================================================
   * 2) ŞEKİL MATRİSLERİ (3×3)
   * ===================================================================== */
  const K2 = "bilsem.matris";
  const SIRA = ["1.", "2.", "3."];
  /* Hücre içi çizgi öğeleri */
  const CIZ_AD = { y: "yatay çizgi", d: "dikey çizgi", k1: "sol üstten sağ alta çapraz", k2: "sağ üstten sol alta çapraz", c: "küçük daire" };
  const CIZ_TUM = Object.keys(CIZ_AD);
  function cizgiler(set) {
    return (cx, cy, s) => {
      const h = s * 0.32, L = (x1, y1, x2, y2) => `<line class="g-cizgi" stroke-width="3" stroke-linecap="round" x1="${(cx + x1 * h).toFixed(1)}" y1="${(cy + y1 * h).toFixed(1)}" x2="${(cx + x2 * h).toFixed(1)}" y2="${(cy + y2 * h).toFixed(1)}"/>`;
      let ic = `<rect class="g-bos g-ince" x="${(cx - h).toFixed(1)}" y="${(cy - h).toFixed(1)}" width="${(2 * h).toFixed(1)}" height="${(2 * h).toFixed(1)}"/>`;
      if (set.has("y")) ic += L(-1, 0, 1, 0);
      if (set.has("d")) ic += L(0, -1, 0, 1);
      if (set.has("k1")) ic += L(-1, -1, 1, 1);
      if (set.has("k2")) ic += L(1, -1, -1, 1);
      if (set.has("c")) ic += `<circle class="g-bos g-cizgi" stroke-width="3" cx="${cx}" cy="${cy}" r="${(h * 0.38).toFixed(1)}"/>`;
      return ic;
    };
  }
  const kesis = (a, b) => new Set([...a].filter(x => b.has(x)));
  const birles = (a, b) => new Set([...a, ...b]);
  const fark = (a, b) => new Set([...a].filter(x => !b.has(x)));
  const xor = (a, b) => birles(fark(a, b), fark(b, a));
  const altKume = (a, b) => [...a].every(x => b.has(x));
  /* Ortak öğesi olan ama biri ötekini kapsamayan iki küme */
  function ikiKume(tum, enAz = 2, enCok = 3) {
    for (;;) {
      const a = new Set(karistir(tum).slice(0, R(enAz, enCok))), b = new Set(karistir(tum).slice(0, R(enAz, enCok)));
      if (kesis(a, b).size && !altKume(a, b) && !altKume(b, a)) return [a, b];
    }
  }
  const adla = set => [...set].map(x => CIZ_AD[x]).join(", ") || "hiçbir çizgi";
  /* 3×3 mini ızgara desenleri ("r,c" anahtarlı kümeler) */
  const rot90 = set => new Set([...set].map(k => { const [r, c] = k.split(",").map(Number); return c + "," + (2 - r); }));
  const aynaLR = set => new Set([...set].map(k => { const [r, c] = k.split(",").map(Number); return r + "," + (2 - c); }));
  const kaydir = (set, dr, dc, sar = true) => new Set([...set].map(k => { const [r, c] = k.split(",").map(Number); const nr = r + dr, nc = c + dc; return sar ? mod(nr, 3) + "," + mod(nc, 3) : (nr >= 0 && nr < 3 && nc >= 0 && nc < 3 ? nr + "," + nc : null); }).filter(Boolean));
  const anahtar = set => [...set].sort().join(";");
  const HUC9 = ["0,0", "0,1", "0,2", "1,0", "1,1", "1,2", "2,0", "2,1", "2,2"];
  const mini = (set, renk = "g-a") => (cx, cy, s) => izgaraCiz(cx - s * 0.36, cy - s * 0.36, 3, s * 0.24, set, renk);
  /* Dönme ve yansımayla kendine benzemeyen (kiral) desen */
  function kiralDesen(n) {
    for (;;) {
      const d = new Set(karistir(HUC9).slice(0, n)), rots = [d, rot90(d), rot90(rot90(d)), rot90(rot90(rot90(d)))];
      const rs = rots.map(anahtar), aynaRs = rots.map(x => anahtar(aynaLR(x)));
      if (new Set(rs).size === 4 && !aynaRs.some(k => rs.includes(k))) return d;
    }
  }
  /* Matris sorusu kurucusu: hücre(r,c) çizer, eksik (mr,mc) */
  const matrisGorsel = (h, mr, mc, liste) => matrisSvg(Array.from({ length: 9 }, (_, i) => (Math.floor(i / 3) === mr && i % 3 === mc) ? null : h(Math.floor(i / 3), i % 3)), liste);

  const matrisSorular = [
    /* 1. Latin kare: şekil ve renk */
    z => {
      const sk = karistir(["kare", "daire", "ucgen", "yildiz", "besgen", "arti"]).slice(0, 3), rk = karistir(RENKLER).slice(0, 3), o = R(0, 2);
      const si = (r, c) => (r + c) % 3, ri = (r, c) => (2 * r + c + o) % 3;
      const m = R(0, 8), mr = Math.floor(m / 3), mc = m % 3, ds = si(mr, mc), dr = ri(mr, mc);
      const C = (a, b) => (cx, cy, s) => sekil(sk[a], cx, cy, s * 0.3, rk[b]);
      const hs = harfle([{ c: C(ds, dr) },
        { c: C(ds, (dr + 1) % 3), hata: "dikkat", neden: "Şekil doğru ama renk yanlış; bu renk o satırda zaten var." },
        { c: C((ds + 1) % 3, dr), hata: "kavrama", neden: "Renk doğru ama şekil yanlış; bu şekil o satırda zaten kullanılmış." },
        { c: C((ds + 2) % 3, (dr + 2) % 3), hata: "dikkat", neden: "Hem şekil hem renk o satırda zaten var; her satırda her şekil ve her renk bir kez kullanılır." }]);
      const satS = [0, 1, 2].filter(c => c !== mc).map(c => SEKIL_AD[sk[si(mr, c)]]), satR = [0, 1, 2].filter(c => c !== mc).map(c => RENK_AD[rk[ri(mr, c)]]);
      return SG({
        kaz: K2, duzey: "uygulama", zorluk: 1,
        soru: "Tablodaki şekiller bir kurala göre yerleştirilmiştir. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => C(si(r, c), ri(r, c)), mr, mc, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Her satırda hangi şekiller ve hangi renkler var? Hiçbiri iki kez kullanılmış mı?",
        cozum: [
          `🔎 Soruyu anlayalım: ${SIRA[mr]} satırın ${SIRA[mc]} kutusu boş. Kuralı bulup bu kutuyu dolduracağız.`,
          `💡 Hatırlayalım: Bu tür tablolarda çoğu zaman her satırda (ve her sütunda) her şekil ve her renk yalnızca bir kez bulunur. Tabloda ${SEKIL_AD[sk[0]]}, ${SEKIL_AD[sk[1]]}, ${SEKIL_AD[sk[2]]} şekilleri ile ${RENK_AD[rk[0]]}, ${RENK_AD[rk[1]]}, ${RENK_AD[rk[2]]} renkleri var.`,
          `✏️ ${SIRA[mr]} satırdaki öteki şekiller: ${satS.join(" ve ")}. Eksik şekil: ${SEKIL_AD[sk[ds]]}.`,
          `✏️ Aynı satırdaki renkler: ${satR.join(" ve ")}. Eksik renk: ${RENK_AD[rk[dr]]}.`,
          `✅ Sonuç: ${RENK_AD[rk[dr]]} ${SEKIL_AD[sk[ds]]}, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Aynı kutunun sütununa da bak; orada da bu şekil ve bu renk ikinci kez geçmemeli.",
        ],
        kural: "Her satırda ve sütunda her öğe bir kez kullanılıyorsa, eksik öğe satırda olmayan öğedir.",
        dogruNeden: `Satırda eksik kalan şekil ${SEKIL_AD[sk[ds]]}, eksik kalan renk ${RENK_AD[rk[dr]]} olduğundan cevap ${hs.harf}.`,
      });
    },
    /* 2. Şekil sayısı = satır + sütun + 1 */
    z => {
      const sk = karistir(["daire", "kare", "ucgen", "yildiz"]).slice(0, 3), renk = sec(RENKLER);
      const n = (r, c) => r + c + 1, m = sec([4, 5, 7, 8]), mr = Math.floor(m / 3), mc = m % 3, dn = n(mr, mc);
      const C = (k, t) => (cx, cy, s) => kopyalar(k, t, renk, cx, cy, s * 0.72);
      const hs = harfle([{ c: C(dn, sk[mr]) },
        { c: C(dn - 1, sk[mr]), hata: "islem", neden: "Şekil türü doğru ama bir eksik; sağa gittikçe bir şekil artıyor." },
        { c: C(dn + 1, sk[mr]), hata: "islem", neden: "Şekil türü doğru ama bir fazla; şekilleri yeniden say." },
        { c: C(dn, sk[(mr + 1) % 3]), hata: "kavrama", neden: "Sayı doğru ama şekil türü yanlış; her satırda tek tür şekil var." }]);
      return SG({
        kaz: K2, duzey: "uygulama", zorluk: 1,
        soru: "Tablodaki şekillerin türü ve sayısı bir kurala uyuyor. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => C(n(r, c), sk[r]), mr, mc, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Satır boyunca sağa giderken ve sütun boyunca aşağı inerken şekil sayısı nasıl değişiyor?",
        cozum: [
          `🔎 Soruyu anlayalım: ${SIRA[mr]} satır, ${SIRA[mc]} sütundaki kutu boş.`,
          "💡 Hatırlayalım: Tablolarda kural ya satır boyunca ya sütun boyunca ya da ikisinde birden işler. İkisine de bakmalıyız.",
          `✏️ Şekil türü satıra bağlı: ${SIRA[mr]} satırdaki bütün şekiller ${SEKIL_AD[sk[mr]]}.`,
          `✏️ Şekil sayısı: 1. satır 1, 2, 3; 2. satır 2, 3, 4; 3. satır 3, 4, 5. Sağa da aşağı da 1 artıyor; boş kutuda ${dn} şekil olmalı.`,
          `✅ Sonuç: ${dn} tane ${SEKIL_AD[sk[mr]]}, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Boş kutunun solundaki ve üstündeki kutulardan 1 fazla şekil olmalı.",
        ],
        kural: "Satıra ve sütuna ayrı ayrı bak: Kural iki yönde de işleyebilir.",
        dogruNeden: `Satır kuralı ${SEKIL_AD[sk[mr]]}, sayı kuralı ${dn} şekil gerektirir.`,
      });
    },
    /* 3. Üst üste koyma (birleşim) */
    z => {
      const satir = [ikiKume(CIZ_TUM), ikiKume(CIZ_TUM), ikiKume(CIZ_TUM)];
      const [A, B2] = satir[2], dg = birles(A, B2);
      const hs = harfle([{ c: cizgiler(dg) },
        { c: cizgiler(xor(A, B2)), hata: "kavrama", neden: "Ortak çizgileri silmişsin; üst üste koyunca ortak çizgiler kaybolmaz, yerinde kalır." },
        { c: cizgiler(kesis(A, B2)), hata: "kavrama", neden: "Yalnızca ortak çizgileri almışsın; kural iki kutudaki bütün çizgileri birleştirmek." },
        { c: cizgiler(A), hata: "dikkat", neden: "Bu, satırın ilk kutusunun aynısı; ikinci kutudaki çizgiler eklenmemiş." }]);
      return SG({
        kaz: K2, duzey: "uygulama", zorluk: 2,
        soru: "Her satırda üçüncü kutu, ilk iki kutudan bir kurala göre elde ediliyor. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => cizgiler(c === 2 ? birles(...satir[r]) : satir[r][c]), 2, 2, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "1. satırdaki ilk iki kutuyu saydam kâğıt gibi üst üste koyduğunu düşün.",
        cozum: [
          "🔎 Soruyu anlayalım: Üçüncü satırın son kutusu boş. Önce ilk iki satırda kuralı bulacağız.",
          "💡 Hatırlayalım: Şekil tablolarında sık kullanılan kurallar: üst üste koyma (bütün çizgiler), ortak olanları silme, yalnızca ortakları bırakma.",
          `✏️ 1. satır: ilk kutuda ${adla(satir[0][0])}; ikincide ${adla(satir[0][1])}. Üçüncü kutuda hepsi var, ortak çizgi de kaybolmamış. Kural: üst üste koy.`,
          `✏️ 3. satıra uygulayalım: ${adla(A)} + ${adla(B2)} → ${adla(dg)}.`,
          `✅ Sonuç: ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Kuralı 2. satırda da dene; üçüncü kutu ilk iki kutunun birleşimi mi? Evet.",
        ],
        kural: "Kuralı en az iki satırda doğrula, sonra boş satıra uygula.",
        dogruNeden: `İlk iki kutudaki bütün çizgiler üçüncü kutuda birleşir: ${adla(dg)}.`,
      });
    },
    /* 4. Ortak çizgiler kaybolur (simetrik fark) */
    z => {
      const satir = [ikiKume(CIZ_TUM), ikiKume(CIZ_TUM), ikiKume(CIZ_TUM)];
      const [A, B2] = satir[2], dg = xor(A, B2);
      const hs = harfle([{ c: cizgiler(dg) },
        { c: cizgiler(birles(A, B2)), hata: "kavrama", neden: "Bütün çizgileri birleştirmişsin; bu tabloda iki kutuda da bulunan çizgiler siliniyor." },
        { c: cizgiler(kesis(A, B2)), hata: "kavrama", neden: "Yalnızca ortak çizgileri bırakmışsın; kural tam tersi: ortak çizgiler silinir, diğerleri kalır." },
        { c: cizgiler(B2), hata: "dikkat", neden: "Bu, satırın ikinci kutusunun aynısı; ilk kutudaki çizgiler hesaba katılmamış." }]);
      return SG({
        kaz: K2, duzey: "uygulama", zorluk: 3,
        soru: "Her satırda üçüncü kutu, ilk iki kutudan bir kurala göre elde ediliyor. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => cizgiler(c === 2 ? xor(...satir[r]) : satir[r][c]), 2, 2, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "İlk iki kutuda da bulunan çizgiler üçüncü kutuda ne oluyor?",
        cozum: [
          "🔎 Soruyu anlayalım: Üçüncü satırın son kutusu boş; kuralı ilk iki satırdan çıkaracağız.",
          "💡 Hatırlayalım: Bazı tablolarda iki kutu üst üste konunca aynı yerdeki çizgiler birbirini siler; yalnızca tek kutuda olan çizgiler kalır.",
          `✏️ 1. satır: ilk kutu ${adla(satir[0][0])}; ikinci kutu ${adla(satir[0][1])}. Ortak olan ${adla(kesis(...satir[0]))} üçüncü kutuda yok!`,
          `✏️ 3. satırda ortak çizgi: ${adla(kesis(A, B2))}. Bunu silip kalanları alıyoruz: ${adla(dg)}.`,
          `✅ Sonuç: ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: 2. satırda da ortak çizgiler üçüncü kutuda görünmüyor mu? Görünmüyorsa kural doğru.",
        ],
        kural: "Ortak öğeler kayboluyorsa kural “farklı olanlar kalır”dır.",
        dogruNeden: `Ortak çizgiler silinip yalnızca bir kutuda olanlar kalır: ${adla(dg)}.`,
      });
    },
    /* 5. Satır boyunca dönen ok */
    z => {
      const st = sec([90, -90, 45]), bas = karistir([0, 45, 90, 135, 180, 225, 270, 315]).slice(0, 3);
      const a = (r, c) => mod(bas[r] + st * c, 360), dg = a(2, 2);
      const C = v => (cx, cy, s) => sekil("ok", cx, cy, s * 0.34, "g-c", v);
      const gor = new Set([dg]), ops = [{ c: C(dg) }];
      [[a(2, 1), "dikkat", "Bu ok, soldaki kutudakiyle aynı; satırda her adımda dönme var."], [mod(bas[2] - 2 * st, 360), "kavrama", "Ok ters yönde döndürülmüş."], [a(2, 0), "dikkat", "Bu ok satırın ilk kutusundakiyle aynı; iki dönme adımı atlanmış."], [mod(dg + 180, 360), "islem", "Ok doğru yönün tam tersine bakıyor."], [mod(dg + st, 360), "islem", "Ok bir adım fazla döndürülmüş."]]
        .forEach(([v, h, n]) => { if (!gor.has(v) && ops.length < 4) { gor.add(v); ops.push({ c: C(v), hata: h, neden: n }); } });
      const hs = harfle(ops), yonAd = st > 0 ? "saat yönünde" : "saat yönünün tersine";
      return SG({
        kaz: K2, duzey: "uygulama", zorluk: 2,
        soru: "Her satırda oklar soldan sağa aynı kurala göre dönüyor. Boş kutuya hangi ok gelmelidir?",
        gorsel: matrisGorsel((r, c) => C(a(r, c)), 2, 2, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "1. satırda okun ne kadar ve hangi yöne döndüğüne bak.",
        cozum: [
          "🔎 Soruyu anlayalım: Her satır farklı bir yönden başlıyor ama dönme kuralı aynı. Son kutuyu bulacağız.",
          "💡 Hatırlayalım: Çeyrek tur 90°, sekizde bir tur 45°'dir.",
          `✏️ 1. satır: ${YON_AD[a(0, 0)]} → ${YON_AD[a(0, 1)]} → ${YON_AD[a(0, 2)]}. Her adımda ${yonAd} ${Math.abs(st)}°.`,
          `✏️ 3. satır: ${YON_AD[a(2, 0)]} → ${YON_AD[a(2, 1)]} → ? Bir kez daha ${yonAd} ${Math.abs(st)}° döndürürsek ok ${YON_AD[dg]} bakar.`,
          `✅ Sonuç: ${YON_AD[dg]} bakan ok, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: 2. satırda da aynı dönme var mı? Kural bütün satırlarda tutuyorsa cevabın doğrudur.",
        ],
        kural: "Satırların başlangıcı farklı olsa da dönme kuralı aynı kalabilir.",
        dogruNeden: `Ok ${yonAd} ${Math.abs(st)}° dönerek ${YON_AD[dg]} bakar.`,
      });
    },
    /* 6. Boyut (Latin) + satıra göre şekil */
    z => {
      const sk = karistir(["kare", "daire", "ucgen", "altigen", "yildiz"]).slice(0, 3), renk = sec(RENKLER), BOY = [0.16, 0.26, 0.37], BAD = ["küçük", "orta", "büyük"];
      const p = karistir([0, 1, 2]), bi = (r, c) => p[(r + c) % 3];
      const m = R(3, 8), mr = Math.floor(m / 3), mc = m % 3, db = bi(mr, mc);
      const C = (t, b) => (cx, cy, s) => sekil(t, cx, cy, s * BOY[b], renk);
      const hs = harfle([{ c: C(sk[mr], db) },
        { c: C(sk[mr], (db + 1) % 3), hata: "dikkat", neden: "Şekil doğru ama bu boy o satırda zaten var." },
        { c: C(sk[mr], (db + 2) % 3), hata: "dikkat", neden: "Şekil doğru ama bu boy o satırda zaten var." },
        { c: C(sk[(mr + 1) % 3], db), hata: "kavrama", neden: "Boy doğru ama şekil yanlış; her satırda tek tür şekil var." }]);
      return SG({
        kaz: K2, duzey: "aciklama", zorluk: 1,
        soru: "Tablodaki şekillerin türü ve büyüklüğü bir kurala uyuyor. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => C(sk[r], bi(r, c)), mr, mc, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Her satırda kaç farklı büyüklük var?",
        cozum: [
          `🔎 Soruyu anlayalım: ${SIRA[mr]} satırdaki ${SIRA[mc]} kutu boş; hem şekli hem büyüklüğü bulmalıyız.`,
          "💡 Hatırlayalım: Bir satırda küçük, orta ve büyük boyların her biri bir kez kullanılıyorsa eksik boy, satırda görünmeyendir.",
          `✏️ Şekil türü satıra bağlı: ${SIRA[mr]} satırda hep ${SEKIL_AD[sk[mr]]} var.`,
          `✏️ O satırdaki öteki boylar: ${[0, 1, 2].filter(c => c !== mc).map(c => BAD[bi(mr, c)]).join(" ve ")}. Eksik boy: ${BAD[db]}.`,
          `✅ Sonuç: ${BAD[db]} ${SEKIL_AD[sk[mr]]}, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Boş kutunun sütununa da bak; o sütunda da her boy bir kez olmalı.",
        ],
        kural: "Satırda her boy bir kez varsa eksik olan, görünmeyen boydur.",
        dogruNeden: `Satırın şekli ${SEKIL_AD[sk[mr]]}, satırda eksik olan boy ${BAD[db]}.`,
      });
    },
    /* 7. Dilim toplamı: 3. sütun = 1. + 2. */
    z => {
      const renk = sec(["g-a", "g-c", "g-d"]);
      const satir = [0, 1, 2].map(() => { const a = R(1, 3), b = R(1, 4 - a); return [a, b, a + b]; });
      const [a, b, dg] = satir[2];
      const pasta = n => (cx, cy, s) => {
        const r = s * 0.34; let ic = `<circle class="g-bos g-cizgi" stroke-width="2" cx="${cx}" cy="${cy}" r="${r.toFixed(1)}"/>`;
        const nok = q => { const t = (q * 90 - 90) * Math.PI / 180; return [(cx + r * Math.cos(t)).toFixed(1), (cy + r * Math.sin(t)).toFixed(1)]; };
        for (let q = 0; q < n; q++) { const [x1, y1] = nok(q), [x2, y2] = nok(q + 1); ic += `<path class="${renk} g-cizgi" stroke-width="1.5" d="M${cx} ${cy} L${x1} ${y1} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x2} ${y2} Z"/>`; }
        return ic + `<line class="g-ince" x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}"/><line class="g-ince" x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}"/>`;
      };
      const gor = new Set([dg]), ops = [{ c: pasta(dg) }];
      [[Math.abs(a - b), "kavrama", "Dilimleri çıkarmışsın; ilk iki satırda dilimler toplanıyor."], [a, "dikkat", "Bu, satırın ilk dairesiyle aynı; ikinci dairenin dilimleri eklenmemiş."], [b, "dikkat", "Bu, satırın ikinci dairesiyle aynı; ilk dairenin dilimleri eklenmemiş."], [dg + 1, "islem", "Bir dilim fazla boyamışsın; dilimleri yeniden say."], [dg - 1, "islem", "Bir dilim eksik boyamışsın; dilimleri yeniden say."]]
        .forEach(([v, h, n]) => { if (v >= 0 && v <= 4 && !gor.has(v) && ops.length < 4) { gor.add(v); ops.push({ c: pasta(v), hata: h, neden: n }); } });
      const hs = harfle(ops);
      return SG({
        kaz: K2, duzey: "uygulama", zorluk: 2,
        soru: "Dairelerin boyalı dilimleri her satırda bir kurala uyuyor. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => pasta(satir[r][c]), 2, 2, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Her satırda boyalı çeyrek dilimleri say; üçüncü sayı ilk ikisiyle nasıl ilişkili?",
        cozum: [
          "🔎 Soruyu anlayalım: Her daire 4 çeyreğe bölünmüş; boyalı çeyrek sayıları bir kurala uyuyor.",
          "💡 Hatırlayalım: Sayı içeren şekil tablolarında satırlarda toplama, çıkarma gibi bir işlem gizli olabilir.",
          `✏️ 1. satır: ${satir[0].join(", ")} çeyrek; 2. satır: ${satir[1].join(", ")} çeyrek. Üçüncü daire, ilk ikisinin toplamı kadar boyalı.`,
          `✏️ 3. satır: ${a} + ${b} = ${dg} çeyrek boyalı olmalı.`,
          `✅ Sonuç: ${dg} çeyreği boyalı daire, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Kuralı iki satırda da denedik; ikisinde de toplam tuttu.",
        ],
        kural: "Şekillerdeki parçaları sayıya çevir; sayılar arasındaki işlemi ara.",
        dogruNeden: `Üçüncü daire ilk ikisinin toplamı kadar boyalıdır: ${a} + ${b} = ${dg}.`,
      });
    },
    /* 8. Dış şekil satıra, iç şekil sütuna bağlı */
    z => {
      const dis = karistir(["kare", "daire", "altigen"]), ic = karistir(["ucgen", "yildiz", "arti", "baklava"]).slice(0, 3);
      const m = R(0, 8), mr = Math.floor(m / 3), mc = m % 3;
      const C = (d, i) => (cx, cy, s) => sekil(d, cx, cy, s * 0.38, "g-yumusak") + sekil(i, cx, cy, s * 0.15, "g-d");
      const hs = harfle([{ c: C(dis[mr], ic[mc]) },
        { c: C(dis[mr], ic[(mc + 1) % 3]), hata: "dikkat", neden: "Dış şekil doğru ama içteki şekil yanlış; içteki şekil sütuna göre belirleniyor." },
        { c: C(dis[(mr + 1) % 3], ic[mc]), hata: "dikkat", neden: "İçteki şekil doğru ama dış şekil yanlış; dış şekil satıra göre belirleniyor." },
        { c: C(dis[(mr + 2) % 3], ic[(mc + 2) % 3]), hata: "kavrama", neden: "İki şekil de yanlış; satır ve sütun kuralını ayrı ayrı uygula." }]);
      return SG({
        kaz: K2, duzey: "baglanti", zorluk: 2,
        soru: "Tablodaki her kutuda bir dış şekil ve onun içinde küçük bir şekil var. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => C(dis[r], ic[c]), mr, mc, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Dış şekiller satır boyunca mı, sütun boyunca mı aynı kalıyor? İçteki şekiller?",
        cozum: [
          `🔎 Soruyu anlayalım: ${SIRA[mr]} satır, ${SIRA[mc]} sütundaki kutu boş.`,
          "💡 Hatırlayalım: Bazı tablolarda bir özellik satırdan, başka bir özellik sütundan gelir; kutu ikisinin buluştuğu yerdir.",
          `✏️ Dış şekil her satırda aynı: ${SIRA[mr]} satırda ${SEKIL_AD[dis[mr]]}.`,
          `✏️ İçteki şekil her sütunda aynı: ${SIRA[mc]} sütunda ${SEKIL_AD[ic[mc]]}.`,
          `✅ Sonuç: İçinde ${SEKIL_AD[ic[mc]]} olan ${SEKIL_AD[dis[mr]]}, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Bir satranç tahtasında satır ile sütunun kesiştiği kareyi bulmak gibi düşün; iki bilgi birlikte tek bir kutuyu belirler.",
        ],
        kural: "Bir özellik satıra, diğeri sütuna bağlıysa ikisini birleştir.",
        dogruNeden: `Satır kuralı dış şekli (${SEKIL_AD[dis[mr]]}), sütun kuralı içteki şekli (${SEKIL_AD[ic[mc]]}) belirler.`,
      });
    },
    /* 9. Noktalar: 3. sütun = 1. × 2. ya da 1. + 2. */
    z => {
      const carp = sec([true, false]);
      const satir = [0, 1, 2].map(() => { for (;;) { const a = R(carp ? 2 : 1, 3), b = R(carp ? 2 : 1, 3); if (a * b !== a + b) return [a, b, carp ? a * b : a + b]; } });
      const [a, b, dg] = satir[2];
      return S({
        kaz: K2, duzey: "baglanti", zorluk: carp ? 3 : 2,
        soru: "Her satırdaki nokta sayıları bir işlem kuralına uyuyor. Boş kutuda kaç nokta olmalıdır?",
        gorsel: matrisSvg(Array.from({ length: 9 }, (_, i) => i === 8 ? null : (cx, cy, s) => noktalar(satir[Math.floor(i / 3)][i % 3], cx, cy, s * 0.66)), [], {}),
        dogru: dg,
        yanlis: [[carp ? a + b : a * b, "kavrama", carp ? "Sayıları toplamışsın; ilk iki satırda sayılar çarpılıyor." : "Sayıları çarpmışsın; ilk iki satırda sayılar toplanıyor."], [dg + 1, "islem", "Sonuç 1 fazla çıkmış; işlemi yeniden yap."], [Math.abs(a - b) || dg + 2, "kavrama", "Sayıları çıkarmışsın; satırlardaki kural çıkarma değil."], [dg - 1, "islem", "Sonuç 1 eksik çıkmış; işlemi yeniden yap."]],
        ipucu: "Her satırda üçüncü kutudaki noktaları ilk iki kutudakilerle karşılaştır: toplama mı, çarpma mı?",
        cozum: [
          "🔎 Soruyu anlayalım: Noktaları sayıp her satırdaki işlem kuralını bulacağız.",
          "💡 Hatırlayalım: Kuralı bir satırdan bulursan mutlaka ikinci satırda da dene; bazen iki kural birinci satıra uyar.",
          `✏️ 1. satır: ${satir[0][0]}, ${satir[0][1]} → ${satir[0][2]}. 2. satır: ${satir[1][0]}, ${satir[1][1]} → ${satir[1][2]}.`,
          `✏️ Kural: üçüncü sayı = ilk iki sayının ${carp ? "çarpımı" : "toplamı"}. (${satir[0][0]} ${carp ? "×" : "+"} ${satir[0][1]} = ${satir[0][2]}, ${satir[1][0]} ${carp ? "×" : "+"} ${satir[1][1]} = ${satir[1][2]})`,
          `✅ Sonuç: ${a} ${carp ? "×" : "+"} ${b} = ${dg} nokta.`,
          "🔁 Kontrol edelim: Kuralı iki satırda da denedik. Bir dahaki sefere hem toplamayı hem çarpmayı dene, hangisi iki satıra birden uyuyorsa onu seç.",
        ],
        kural: "Kural, verilen bütün satırlara uymalıdır.",
        dogruNeden: `Her satırda üçüncü sayı ilk ikisinin ${carp ? "çarpımı" : "toplamı"}dır: ${a} ${carp ? "×" : "+"} ${b} = ${dg}.`,
      });
    },
    /* 10. Yalnızca ortak kareler kalır (kesişim) */
    z => {
      const satir = [0, 1, 2].map(() => ikiKume(HUC9, 3, 5));
      const [A, B2] = satir[2], dg = kesis(A, B2);
      const hs = harfle([{ c: mini(dg) },
        { c: mini(birles(A, B2)), hata: "kavrama", neden: "Bütün mavi kareleri birleştirmişsin; bu tabloda yalnızca iki kutuda da mavi olan kareler kalıyor." },
        { c: mini(xor(A, B2)), hata: "kavrama", neden: "Ortak kareleri silmişsin; kural tam tersi, yalnızca ortak kareler kalıyor." },
        { c: mini(A), hata: "dikkat", neden: "Bu, satırın ilk kutusunun aynısı." }]);
      return SG({
        kaz: K2, duzey: "uygulama", zorluk: 3,
        soru: "Her satırda üçüncü kutu, ilk iki kutudan bir kurala göre elde ediliyor. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => mini(c === 2 ? kesis(...satir[r]) : satir[r][c]), 2, 2, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Üçüncü kutudaki mavi kareler, ilk iki kutuda nerede mavi?",
        cozum: [
          "🔎 Soruyu anlayalım: Küçük ızgaralarda bazı kareler mavi. Üçüncü kutunun kuralını bulacağız.",
          "💡 Hatırlayalım: İki deseni üst üste koyunca üç olasılık vardır: hepsi kalır, ortaklar kalır ya da ortaklar silinir.",
          "✏️ 1. satıra bakalım: Üçüncü kutuda yalnızca iki kutuda da mavi olan kareler mavi. 2. satırda da öyle.",
          `✏️ 3. satırda iki kutuda da mavi olan ${dg.size} kare var; yalnızca onları mavi bırakıyoruz.`,
          `✅ Sonuç: ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Seçtiğin desendeki her mavi karenin ilk iki kutuda da mavi olduğunu tek tek kontrol et.",
        ],
        kural: "Üçüncü kutudaki her öğenin ilk iki kutuda nerede olduğuna bakarak kuralı bul.",
        dogruNeden: "Yalnızca iki kutuda da mavi olan kareler üçüncü kutuda mavi kalır.",
      });
    },
    /* 11. Mini ızgara her adımda 90° döner */
    z => {
      const satir = [0, 1, 2].map(() => kiralDesen(R(3, 4))), yon = sec([1, -1]);
      const dn = (d, k) => { let x = d; for (let i = 0; i < mod(k * yon, 4); i++) x = rot90(x); return x; };
      const D = satir[2], dg = dn(D, 2);
      const hs = harfle([{ c: mini(dg, "g-a") },
        { c: mini(dn(D, 1), "g-a"), hata: "dikkat", neden: "Bu, soldaki kutunun aynısı; desen bir kez daha dönmeli." },
        { c: mini(aynaLR(dn(D, 1)), "g-a"), hata: "kavrama", neden: "Desen döndürülmemiş, aynada yansıtılmış; yansıma ile dönme farklıdır." },
        { c: mini(aynaLR(D), "g-a"), hata: "kavrama", neden: "Bu, ilk kutunun aynadaki görüntüsü; kural dönme." }]);
      const yonAd = yon > 0 ? "saat yönünde" : "saat yönünün tersine";
      return SG({
        kaz: K2, duzey: "uygulama", zorluk: 3,
        soru: "Her satırda desen soldan sağa aynı kurala göre değişiyor. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => mini(dn(satir[r], c), "g-a"), 2, 2, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Kâğıdı döndürdüğünü düşün: ilk kutudaki desen ikinci kutuda nasıl duruyor?",
        cozum: [
          "🔎 Soruyu anlayalım: Her satırda 3×3'lük desen bir kurala göre değişiyor. Son kutuyu bulacağız.",
          "💡 Hatırlayalım: Bir deseni 90° döndürünce üst kenar yana geçer. Yansımada ise desen ters yüz olur; bu ikisini karıştırma.",
          `✏️ 1. satırda desen her adımda ${yonAd} 90° dönüyor (mavi karelerin nereye gittiğini izle).`,
          "✏️ 3. satırda ilk desen iki kez 90° dönmeli; bu da 180° yani baş aşağı çevirmek demek.",
          `✅ Sonuç: İlk desenin 180° döndürülmüş hâli ${hs.harf} seçeneğinde.`,
          "🔁 Kontrol edelim: 180° dönen desende sol üstteki kare sağ alta, sağ üstteki kare sol alta geçer. Seçeneğini bu yolla dene.",
        ],
        kural: "180° dönmede her kare merkeze göre tam karşıya geçer.",
        dogruNeden: `Desen her adımda ${yonAd} 90° döndüğü için son kutu ilk desenin 180° döndürülmüşüdür.`,
      });
    },
    /* 12. Desen sağa kayar (taşan kare soldan girer) */
    z => {
      const satir = [0, 1, 2].map(() => { for (;;) { const d = new Set(karistir(HUC9).slice(0, 3)); if (anahtar(kaydir(d, 0, 1)) !== anahtar(d)) return d; } });
      const D = satir[2], dg = kaydir(D, 0, 2);
      const gor = new Set([anahtar(dg)]), ops = [{ c: mini(dg, "g-d") }];
      [[kaydir(D, 0, 1), "dikkat", "Bu, soldaki kutunun aynısı; desen bir kez daha kaymalı."], [kaydir(D, 0, 2, false), "kavrama", "Sağdan taşan kareleri silmişsin; taşan kare soldan geri giriyor."], [kaydir(D, 2, 0), "kavrama", "Desen aşağı kaydırılmış; kural sağa kaydırma."], [aynaLR(D), "kavrama", "Desen yansıtılmış; kural kaydırma."], [kaydir(D, 0, 1, false), "dikkat", "Desen yalnızca bir adım kaydırılmış ve taşan kare silinmiş."]]
        .forEach(([v, h, n]) => { const k = anahtar(v); if (!gor.has(k) && ops.length < 4) { gor.add(k); ops.push({ c: mini(v, "g-d"), hata: h, neden: n }); } });
      const hs = harfle(ops);
      return SG({
        kaz: K2, duzey: "uygulama", zorluk: 3,
        soru: "Her satırda kırmızı kareler soldan sağa aynı kurala göre yer değiştiriyor. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => mini(kaydir(satir[r], 0, c), "g-d"), 2, 2, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Her kırmızı kare bir sonraki kutuda kaç sütun kaymış? En sağdaki kare nereye gitmiş?",
        cozum: [
          "🔎 Soruyu anlayalım: Kırmızı karelerin her satırda nasıl hareket ettiğini bulup son kutuyu çizeceğiz.",
          "💡 Hatırlayalım: Kaydırma kurallarında kenardan taşan öğe genellikle karşı kenardan geri girer (dönme dolap gibi).",
          "✏️ 1. satıra bakalım: Her kırmızı kare bir sütun sağa kaymış; en sağ sütundaki kare en sol sütuna geçmiş.",
          "✏️ 3. satırda ilk kutudaki desen iki kez sağa kaymalı. İki kez sağa kaymak, bir kez sola kaymakla aynı sonucu verir.",
          `✅ Sonuç: ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Kırmızı kare sayısı değişmemeli; seçtiğin desende de 3 kırmızı kare olmalı.",
        ],
        kural: "Kaydırmada kare sayısı korunur; taşan kare karşı kenardan girer.",
        dogruNeden: "İlk kutudaki desen iki sütun sağa kaydırılınca (taşanlar soldan girerek) bu desen oluşur.",
      });
    },
    /* 13. Kenar sayısı: sağa +1, aşağı +1 */
    z => {
      const AD = { 3: "üçgen", 4: "dörtgen", 5: "beşgen", 6: "altıgen", 7: "yedigen", 8: "sekizgen", 9: "dokuzgen" };
      const kn = (r, c) => 3 + r + c, m = R(1, 8), mr = Math.floor(m / 3), mc = m % 3, dg = kn(mr, mc), renk = sec(RENKLER);
      const C = n => (cx, cy, s) => `<polygon class="${renk} g-cizgi" stroke-width="2" stroke-linejoin="round" points="${P(nk(n, cx, cy + (n === 3 ? s * 0.05 : 0), s * 0.34, n === 4 ? -45 : -90))}"/>`;
      const gor = new Set([dg]), ops = [{ c: C(dg) }];
      [[dg + 1, "islem", "Bu çokgenin bir kenarı fazla; kenarları tek tek say."], [dg - 1, "islem", "Bu çokgenin bir kenarı eksik; kenarları tek tek say."], [dg + 2, "kavrama", "Kenar sayısı bir adımda 2 artmıyor; sağa ve aşağı birer artıyor."], [dg - 2, "kavrama", "Kenar sayısını fazla azaltmışsın."]]
        .forEach(([v, h, n]) => { if (v >= 3 && !gor.has(v) && ops.length < 4) { gor.add(v); ops.push({ c: C(v), hata: h, neden: n }); } });
      const hs = harfle(ops);
      return SG({
        kaz: K2, duzey: "uygulama", zorluk: 2,
        soru: "Tablodaki çokgenlerin kenar sayıları bir kurala göre değişiyor. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => C(kn(r, c)), mr, mc, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Her çokgenin kenarlarını say; sağa ve aşağı giderken sayı ne kadar değişiyor?",
        cozum: [
          `🔎 Soruyu anlayalım: ${SIRA[mr]} satır, ${SIRA[mc]} sütun boş; kenar sayısını bulacağız.`,
          "💡 Hatırlayalım: Çokgenin kenar sayısı köşe sayısına eşittir; köşeleri saymak da işe yarar.",
          "✏️ 1. satır: 3, 4, 5 kenar → sağa gidince 1 artıyor. 1. sütun: 3, 4, 5 kenar → aşağı inince de 1 artıyor.",
          `✏️ Boş kutu: 3 + ${mr} (aşağı) + ${mc} (sağa) = ${dg} kenar.`,
          `✅ Sonuç: ${dg} kenarlı ${AD[dg]}, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Boş kutunun solundaki ya da üstündeki çokgenden 1 fazla kenarı olmalı.",
        ],
        kural: "Köşeleri işaretleyerek saymak kenar saymaktan daha kolaydır.",
        dogruNeden: `Kenar sayısı sağa ve aşağı birer artar; boş kutuya ${dg} kenarlı ${AD[dg]} gelir.`,
      });
    },
    /* 14. Yarım + yarım = bütün */
    z => {
      const sk = karistir(["kare", "daire", "ucgen"]), rk = karistir(RENKLER).slice(0, 3), mc = R(0, 2);
      const yarim = (t, parca, renk) => (cx, cy, s) => {
        const h = s * 0.32, st = `class="${renk} g-cizgi" stroke-width="2" stroke-linejoin="round"`;
        if (t === "kare") { const x = parca === "sag" ? cx : cx - h, w = parca === "tam" ? 2 * h : h; return `<rect ${st} x="${(parca === "tam" ? cx - h : x).toFixed(1)}" y="${(cy - h).toFixed(1)}" width="${w.toFixed(1)}" height="${(2 * h).toFixed(1)}"/>`; }
        if (t === "daire") { if (parca === "tam") return `<circle ${st} cx="${cx}" cy="${cy}" r="${h.toFixed(1)}"/>`; return `<path ${st} d="M${cx} ${(cy - h).toFixed(1)} A${h.toFixed(1)} ${h.toFixed(1)} 0 0 ${parca === "sag" ? 1 : 0} ${cx} ${(cy + h).toFixed(1)} Z"/>`; }
        const ust = [cx, cy - h], sl = [cx - h, cy + h], sg = [cx + h, cy + h], alt = [cx, cy + h];
        return `<polygon ${st} points="${P(parca === "tam" ? [ust, sg, sl] : parca === "sag" ? [ust, sg, alt] : [ust, alt, sl])}"/>`;
      };
      const PAR = ["sol", "sag", "tam"], PAD = { sol: "sol yarısı", sag: "sağ yarısı", tam: "tamamı" }, TAMLAYAN = { kare: "karenin", daire: "dairenin", ucgen: "üçgenin" };
      const dp = PAR[mc], t = sk[2], r = rk[2];
      const ops = [{ c: yarim(t, dp, r) }];
      PAR.filter(p => p !== dp).forEach(p => ops.push({ c: yarim(t, p, r), hata: "dikkat", neden: `Bu, ${TAMLAYAN[t]} ${PAD[p]}; o parça satırda zaten var.` }));
      ops.push({ c: yarim(sk[0], dp, r), hata: "kavrama", neden: "Parça doğru ama şekil yanlış; her satır tek bir şekle ait." });
      const hs = harfle(ops);
      return SG({
        kaz: K2, duzey: "aciklama", zorluk: 1,
        soru: "Her satırda bir şeklin sol yarısı, sağ yarısı ve tamamı var. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((rr, cc) => yarim(sk[rr], PAR[cc], rk[rr]), 2, mc, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Üst satırlarda sütunların sırası nasıl? 3. satırda hangi parça eksik?",
        cozum: [
          `🔎 Soruyu anlayalım: 3. satırın ${SIRA[mc]} kutusu boş; bu satırdaki şekil ${RENK_AD[r]} ${SEKIL_AD[t]}.`,
          "💡 Hatırlayalım: Bir şeklin sol yarısı ile sağ yarısı birleşince şeklin tamamı oluşur.",
          "✏️ 1. ve 2. satırlarda sıra hep aynı: 1. sütun sol yarı, 2. sütun sağ yarı, 3. sütun bütün şekil.",
          `✏️ Boş kutu ${SIRA[mc]} sütunda olduğundan buraya ${TAMLAYAN[t]} ${PAD[dp]} gelir.`,
          `✅ Sonuç: ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Seçtiğin parçayı satırdaki öteki parçayla birleştir; üçüncü sütundaki bütün şekli vermeli.",
        ],
        kural: "Parça–bütün tablolarında parçalar birleşince bütünü vermelidir.",
        dogruNeden: `3. satırın ${SIRA[mc]} sütununa ${TAMLAYAN[t]} ${PAD[dp]} gelir.`,
      });
    },
    /* 15. Sütunda dönme, satırda büyüme */
    z => {
      const st = sec([90, -90]), a0 = 45 * R(0, 7), BOY = [0.2, 0.28, 0.37], BAD = ["küçük", "orta", "büyük"], renk = sec(["g-a", "g-c", "g-d"]);
      const aci = c => mod(a0 + st * c, 360), m = R(0, 8), mr = Math.floor(m / 3), mc = m % 3;
      const C = (a, b) => (cx, cy, s) => sekil("ok", cx, cy, s * BOY[b], renk, a);
      const hs = harfle([{ c: C(aci(mc), mr) },
        { c: C(aci(mc + 1), mr), hata: "dikkat", neden: "Boy doğru ama ok başka bir sütunun yönüne bakıyor." },
        { c: C(aci(mc), (mr + 1) % 3), hata: "dikkat", neden: "Yön doğru ama boy yanlış; boy satıra göre değişiyor." },
        { c: C(aci(mc + 2), (mr + 2) % 3), hata: "kavrama", neden: "Hem yön hem boy yanlış; sütun ve satır kurallarını ayrı ayrı uygula." }]);
      const yonAd = st > 0 ? "saat yönünde" : "saat yönünün tersine";
      return SG({
        kaz: K2, duzey: "baglanti", zorluk: 2,
        soru: "Tablodaki okların yönü ve büyüklüğü iki ayrı kurala göre değişiyor. Boş kutuya hangisi gelmelidir?",
        gorsel: matrisGorsel((r, c) => C(aci(c), r), mr, mc, hs.liste),
        dogru: hs.harf, yanlis: hs.yanlis,
        ipucu: "Bir sütundaki okların yönü aynı mı? Bir satırdaki okların boyu aynı mı?",
        cozum: [
          `🔎 Soruyu anlayalım: ${SIRA[mr]} satır, ${SIRA[mc]} sütun boş; okun yönünü ve boyunu bulacağız.`,
          "💡 Hatırlayalım: İki özellik değişiyorsa biri satıra, diğeri sütuna bağlı olabilir.",
          `✏️ Yön sütuna bağlı: Her sütunda oklar aynı yöne bakıyor ve sağa geçtikçe ${yonAd} 90° dönüyor. ${SIRA[mc]} sütunda ok ${YON_AD[aci(mc)]} bakıyor.`,
          `✏️ Boy satıra bağlı: 1. satır küçük, 2. satır orta, 3. satır büyük. ${SIRA[mr]} satırda ok ${BAD[mr]}.`,
          `✅ Sonuç: ${YON_AD[aci(mc)]} bakan ${BAD[mr]} ok, yani ${hs.harf} seçeneği.`,
          "🔁 Kontrol edelim: Boş kutunun sütunundaki bir okla yönünü, satırındaki bir okla boyunu karşılaştır.",
        ],
        kural: "Önce hangi özelliğin satıra, hangisinin sütuna bağlı olduğunu bul.",
        dogruNeden: `Sütun kuralı yönü (${YON_AD[aci(mc)]}), satır kuralı boyu (${BAD[mr]}) belirler.`,
      });
    },
  ];
  B.push({ id: "matris", ad: "Şekil matrisleri", simge: "🧩", aciklama: "3×3 tablodaki kuralı bul, eksik parçayı tamamla.", sorular: matrisSorular });

  /* @@DEVAM@@ */
})();
