/* 6. sınıf Fen Bilimleri — 3. ve 4. ünite konuları:
 * Bitki ve Hayvanlarda Üreme, Büyüme ve Gelişme · Denetleyici ve Düzenleyici Sistemler ·
 * Işığın Yansıması ve Aynalar · Işığın Soğurulması ve Renkler.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, Q, G } = OGR;

  /* ---------------------------- Ortak çizimler ---------------------------- */
  /* Kutulardan oluşan akış şeması (ör. yaşam döngüsü, refleks yayı). */
  function akis(adimlar, etiket) {
    const n = adimlar.length, bw = 112, ara = 30, W = n * bw + (n - 1) * ara + 20, H = 92;
    let ic = "";
    adimlar.forEach((a, i) => {
      const x = 10 + i * (bw + ara);
      ic += `<rect class="${a === "?" ? "g-b" : "g-yumusak"} g-cizgi" x="${x}" y="20" width="${bw}" height="52" rx="8" stroke-width="2"/>`;
      const satir = String(a).split("|");
      satir.forEach((s, j) => { ic += G.yazi(x + bw / 2, 50 + (j - (satir.length - 1) / 2) * 17, s, { k: satir.length > 1 || s.length > 11 ? 1 : 0, b: a === "?" ? 1 : 0 }); });
      if (i < n - 1) ic += G.ok(x + bw + 3, 46, x + bw + ara - 3, 46);
    });
    return G.svg(W, H, ic, etiket || "akış şeması");
  }

  /* Çiçeğin yapısı: numaralı bölümler. */
  function cicek() {
    let ic = "";
    ic += `<line class="g-cizgi" x1="200" y1="190" x2="200" y2="260" stroke-width="4"/>`;
    ic += `<path class="g-c g-cizgi" d="M200 230 Q170 215 160 232 Q180 245 200 236 Z"/>`;
    ic += `<path class="g-c g-cizgi" d="M200 190 Q160 175 150 160 Q185 160 200 178 Z"/><path class="g-c g-cizgi" d="M200 190 Q240 175 250 160 Q215 160 200 178 Z"/>`;
    ic += `<path class="g-d g-cizgi" d="M200 180 Q120 150 110 70 Q160 100 190 160 Z"/><path class="g-d g-cizgi" d="M200 180 Q280 150 290 70 Q240 100 210 160 Z"/>`;
    ic += `<ellipse class="g-b g-cizgi" cx="200" cy="168" rx="17" ry="14"/><line class="g-cizgi" x1="200" y1="154" x2="200" y2="85" stroke-width="5"/><ellipse class="g-b g-cizgi" cx="200" cy="80" rx="11" ry="6"/>`;
    ic += `<line class="g-cizgi" x1="178" y1="168" x2="160" y2="95"/><ellipse class="g-a g-cizgi" cx="160" cy="90" rx="9" ry="6"/>`;
    ic += `<line class="g-cizgi" x1="222" y1="168" x2="240" y2="95"/><ellipse class="g-a g-cizgi" cx="240" cy="90" rx="9" ry="6"/>`;
    const etik = [[1, 211, 80, 330, 40], [2, 248, 90, 340, 90], [3, 280, 110, 345, 140], [4, 215, 168, 340, 190], [5, 240, 168, 340, 230]];
    etik.forEach(([no, x1, y1, x2, y2]) => { ic += `<line class="g-ince" x1="${x1}" y1="${y1}" x2="${x2 - (x2 > x1 ? 14 : -14)}" y2="${y2}"/>` + `<circle class="g-bos g-cizgi" cx="${x2}" cy="${y2}" r="12"/>` + G.yazi(x2, y2 + 5, no, { k: 1, b: 1 }); });
    return G.svg(400, 270, ic, "çiçeğin yapısı: 1 tepecik, 2 başçık, 3 taç yaprak, 4 yumurtalık, 5 çanak yaprak");
  }

  /* Refleks yayı. */
  const reflexYayi = (soru) => akis(["Uyarı|(sıcak soba)", "Duyu|siniri", soru ? "?" : "Omurilik", "Hareket|(motor) siniri", "Kas|(el çekilir)"], "refleks yayı");

  /* Yansıma çizimi: gelme açısı i (normal ile). mod: "gelme" | "yuzey" | "arasi" — hangi açının yazılacağı. */
  function yansima(i, { mod = "gelme", yansiyanGizli = false } = {}) {
    const W = 460, H = 230, cx = 230, cy = 190, L = 150, r = i * Math.PI / 180;
    const ax = cx - L * Math.sin(r), ay = cy - L * Math.cos(r), bx = cx + L * Math.sin(r), by = cy - L * Math.cos(r);
    let ic = `<rect class="g-yumusak g-cizgi" x="40" y="${cy}" width="380" height="14"/>`;
    for (let x = 48; x < 420; x += 16) ic += `<line class="g-ince" x1="${x}" y1="${cy + 14}" x2="${x - 8}" y2="${cy + 24}"/>`;
    ic += `<line class="g-ince" x1="${cx}" y1="${cy}" x2="${cx}" y2="20" stroke-dasharray="6 5" stroke-width="2"/>` + G.yazi(cx + 6, 22, "normal", { a: "start", k: 1 });
    ic += G.ok(ax, ay, cx - (cx - ax) * 0.45, cy - (cy - ay) * 0.45) + `<line class="g-cizgi" x1="${ax}" y1="${ay}" x2="${cx}" y2="${cy}" stroke-width="3"/>`;
    ic += G.yazi(ax - 6, ay - 6, "gelen ışın", { a: "end", k: 1 });
    if (!yansiyanGizli) { ic += `<line class="g-cizgi" x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke-width="3"/>` + G.ok(cx, cy, cx + (bx - cx) * 0.6, cy - (cy - by) * 0.6) + G.yazi(bx + 6, by - 6, "yansıyan ışın", { a: "start", k: 1 }); }
    const yay = (r1, a1) => [cx - r1 * Math.sin(a1 * Math.PI / 180), cy - r1 * Math.cos(a1 * Math.PI / 180)];
    if (mod === "gelme") { const [x, y] = yay(62, i / 2); ic += G.yazi(x, y + 5, i + "°", { b: 1 }); }
    if (mod === "yuzey") { const [x, y] = yay(70, 90 - (90 - i) / 2); ic += G.yazi(x, y + 5, (90 - i) + "°", { b: 1 }); }
    if (mod === "arasi") ic += `<path class="g-ince" d="M${yay(45, i)[0]} ${yay(45, i)[1]} A45 45 0 0 1 ${cx + 45 * Math.sin(r)} ${yay(45, i)[1]}" stroke-width="2"/>` + G.yazi(cx, cy - 53, (2 * i) + "°", { b: 1 });
    ic += G.yazi(400, cy + 40, "düz ayna", { k: 1 });
    return G.svg(W, H + 20, ic, "düz aynada yansıma");
  }

  /* Düz ayna karşısında kişi ve görüntüsü (uzaklık soruları). */
  function aynaUzaklik(d, { gizle = false } = {}) {
    const W = 520, H = 130, ax = 260, olc = 200 / Math.max(d, 1) > 40 ? 40 : 200 / d;
    const kx = ax - d * olc, gx = ax + d * olc;
    let ic = `<rect class="g-yumusak g-cizgi" x="${ax - 4}" y="15" width="8" height="85"/>` + G.yazi(ax, 120, "ayna", { k: 1 });
    ic += `<text x="${kx}" y="80" font-size="34" text-anchor="middle">🧍</text>`;
    ic += gizle ? G.yazi(gx, 72, "?", { b: 1 }) : `<text x="${gx}" y="80" font-size="34" text-anchor="middle" opacity="0.5">🧍</text>`;
    ic += `<line class="g-ince" x1="${kx}" y1="100" x2="${ax}" y2="100"/>` + G.yazi((kx + ax) / 2, 96, d + " m", { k: 1 });
    return G.svg(W, H, ic, "düz ayna önünde duran kişi");
  }

  /* Renkli ışık ve cisim (gerçek renkler). */
  const RENK = { kırmızı: "#d64545", yeşil: "#2e9b57", mavi: "#2f6fdb", beyaz: "#ffffff", siyah: "#222222", sarı: "#f2c230" };
  function isikCisim(isik, cisim) {
    const W = 460, H = 170;
    let ic = `<text x="50" y="72" font-size="36" text-anchor="middle">🔦</text>` + G.yazi(50, 110, isik + " ışık", { k: 1 });
    const renkler = isik === "beyaz" ? ["#d64545", "#f2c230", "#2e9b57", "#2f6fdb"] : [RENK[isik]];
    renkler.forEach((c, j) => { const dy = (j - (renkler.length - 1) / 2) * 6; ic += `<line x1="80" y1="${60 + dy}" x2="290" y2="${85 + dy}" stroke="${c}" stroke-width="4"/>`; });
    ic += `<rect x="300" y="45" width="90" height="80" rx="8" fill="${RENK[cisim]}" stroke="#555" stroke-width="2"/>`;
    ic += G.yazi(345, 150, "gün ışığında " + cisim + " cisim", { k: 1 });
    return G.svg(W, H, ic, `${isik} ışık altında, gün ışığında ${cisim} olan cisim`);
  }

  /* Prizma ile beyaz ışığın renklere ayrılması (gerçek renkler). */
  function prizma() {
    const renkler = ["#d64545", "#ee8a2a", "#f2c230", "#2e9b57", "#2f6fdb", "#283c8f", "#8a5cd6"];
    let ic = `<line x1="20" y1="120" x2="175" y2="105" stroke="#999" stroke-width="5"/>` + G.yazi(70, 100, "beyaz ışık", { k: 1 });
    ic += `<polygon class="g-yumusak g-cizgi" points="200,30 130,190 270,190" stroke-width="2"/>`;
    renkler.forEach((c, j) => { ic += `<line x1="225" y1="${105 + j * 2}" x2="440" y2="${100 + j * 16}" stroke="${c}" stroke-width="4"/>`; });
    ic += G.yazi(200, 212, "prizma", { k: 1 }) + G.yazi(445, 215, "ekran", { a: "end", k: 1 }) + `<line class="g-cizgi" x1="450" y1="80" x2="450" y2="220" stroke-width="3"/>`;
    return G.svg(470, 225, ic, "prizmada beyaz ışığın renklere ayrılması");
  }

  /* ======================= 1) ÜREME, BÜYÜME VE GELİŞME ======================= */
  KONU_EKLE("fen", {
    id: "f_ureme", tema: "f3", ad: "Bitki ve Hayvanlarda Üreme, Büyüme ve Gelişme",
    kazanimlar: [
      { id: "fure.eseysiz", ad: "Eşeyli ve eşeysiz üremeyi ayırt etme, eşeysiz üreme çeşitlerini örneklendirme" },
      { id: "fure.bitki", ad: "Çiçeğin yapısını, tozlaşmayı, döllenmeyi ve çimlenmeyi açıklama" },
      { id: "fure.gelisme", ad: "Hayvanlarda büyüme ve gelişmeyi, doğrudan ve dolaylı gelişmeyi açıklama" },
    ],
    anlatim: [
      { baslik: "Eşeyli ve eşeysiz üreme",
        metin: "Canlıların kendilerine benzer yeni bireyler oluşturmasına <b>üreme</b> denir.<br><b>Eşeysiz üremede</b> tek bir ata vardır; üreme hücreleri kullanılmaz ve yavrular atasıyla aynı kalıtsal özellikleri taşır.<br><b>Eşeyli üremede</b> dişi ve erkek atalardan gelen üreme hücreleri (yumurta ve sperm) birleşir. Bu birleşmeye <b>döllenme</b>, oluşan ilk hücreye <b>zigot</b> denir. Yavrular atalarından farklı özellikler taşıyabilir; bu da çeşitliliği artırır.",
        ornek: "Amip ikiye bölünerek ürer (eşeysiz). Kedi yavruları anne ve babadan farklı özellikler alır (eşeyli).",
        gorsel: G.tablo(["", "Eşeysiz üreme", "Eşeyli üreme"], [["Ata sayısı", "Tek ata", "İki ata (dişi ve erkek)"], ["Üreme hücresi", "Kullanılmaz", "Yumurta ve sperm"], ["Yavrular", "Ataya tıpatıp benzer", "Farklı özellikler taşıyabilir"]]),
        durak: { soru: "Eşeyli üremeyi eşeysiz üremeden ayıran özellik hangisidir?", secenekler: [["Üreme hücrelerinin birleşmesi (döllenme)", true, "Eşeyli üremede yumurta ve sperm birleşir; eşeysiz üremede döllenme yoktur."], ["Yeni bireylerin oluşması", false, "Her iki üreme türünde de yeni bireyler oluşur."], ["Yalnızca bitkilerde görülmesi", false, "Eşeyli üreme hem bitkilerde hem hayvanlarda görülür."], ["Yavruların ataya tıpatıp benzemesi", false, "Bu, eşeysiz üremenin özelliğidir."]] } },
      { baslik: "Eşeysiz üreme çeşitleri",
        metin: "<b>Bölünme:</b> Tek hücreli canlı ikiye ayrılır (amip, bakteri, öglena, paramesyum).<br><b>Tomurcuklanma:</b> Atanın üzerinde bir çıkıntı (tomurcuk) oluşur, büyür ve ayrılır ya da atasına bağlı kalır (bira mayası, hidra).<br><b>Rejenerasyon (yenilenme):</b> Kopan bir parçadan yeni ve tam bir birey oluşur (deniz yıldızı, planarya).<br><b>Vejetatif üreme:</b> Bitkinin kök, gövde ya da yaprağından yeni bitki oluşur (patates yumrusu, çilek, soğan, çelikle üretilen gül ve söğüt).<br><b>Sporla üreme:</b> Spor denen özel hücrelerle ürerler (küf mantarı, şapkalı mantar, eğrelti otu).",
        ornek: "Kertenkelenin kopan kuyruğunun yeniden oluşması bir <b>onarımdır</b>, üreme değildir; çünkü yeni bir kertenkele oluşmaz.",
        durak: { soru: "Çilek bitkisinin toprağa değen sürünücü gövdesinden yeni bitkiler oluşması hangi üreme çeşididir?", secenekler: [["Vejetatif üreme", true, "Gövde, kök ya da yapraktan yeni bitki oluşması vejetatif üremedir."], ["Tomurcuklanma", false, "Tomurcuklanma bira mayası ve hidra gibi canlılarda görülür."], ["Sporla üreme", false, "Sporla üreme mantarlar ve eğrelti otu gibi canlılarda görülür; çilek spor oluşturmaz."], ["Eşeyli üreme", false, "Bu olayda üreme hücreleri birleşmez; eşeysiz üremedir."]] } },
      { baslik: "Çiçekli bitkilerde üreme",
        metin: "Çiçek, çiçekli bitkilerin <b>üreme organıdır</b>. <b>Çanak yapraklar</b> çiçeği korur, renkli <b>taç yapraklar</b> böcekleri çeker. <b>Erkek organın</b> başçığında <b>polen (çiçek tozu)</b> üretilir. <b>Dişi organ</b> tepecik, dişicik borusu ve yumurtalıktan oluşur; yumurtalıkta <b>tohum taslakları</b> bulunur.<br><b>Tozlaşma:</b> Polenlerin rüzgâr, böcek, su ya da insan yoluyla dişi organın tepeciğine taşınmasıdır.<br><b>Döllenme:</b> Polenden gelen üreme hücresinin yumurtalıktaki yumurta hücresiyle birleşmesidir. Döllenmeden sonra <b>yumurtalık meyveye</b>, <b>tohum taslağı tohuma</b> dönüşür.<br><b>Çimlenme:</b> Tohumun içindeki bitki taslağının (embriyonun) gelişmeye başlamasıdır. Çimlenme için <b>su, uygun sıcaklık ve oksijen (hava)</b> gerekir. Tohum, çimlenme için gereken besini kendi besin deposundan alır.",
        ornek: "Fasulye tohumları ıslak pamuk üzerinde de çimlenir; çünkü çimlenme için toprak değil su, hava ve uygun sıcaklık gerekir.",
        gorsel: cicek(),
        durak: { soru: "Döllenmeden sonra çiçeğin hangi bölümü meyveye dönüşür?", secenekler: [["Yumurtalık", true, "Döllenmeden sonra yumurtalık gelişerek meyveyi oluşturur."], ["Taç yaprak", false, "Taç yapraklar genellikle döllenmeden sonra solup dökülür."], ["Başçık", false, "Başçık erkek organın polen üreten kısmıdır; meyve olmaz."], ["Tepecik", false, "Tepecik polenlerin tutunduğu yerdir; meyveye dönüşmez."]] } },
      { baslik: "Hayvanlarda büyüme ve gelişme",
        metin: "<b>Büyüme:</b> Hücre sayısının ve hücrelerin büyüklüğünün artmasıyla canlının boyunun ve kütlesinin artmasıdır.<br><b>Gelişme:</b> Organların yapı ve görev bakımından olgunlaşması, canlının yeni yetenekler kazanmasıdır.<br><b>Doğrudan gelişme:</b> Yavru, ergin bireye (yetişkine) benzer; yalnızca büyür ve olgunlaşır (insan, kedi, tavuk, kaplumbağa).<br><b>Dolaylı gelişme (başkalaşım, metamorfoz):</b> Yavru ergine benzemez; farklı evrelerden geçer.<br>Kurbağa: yumurta → iribaş → bacaklı iribaş → ergin kurbağa.<br>Kelebek: yumurta → tırtıl (larva) → pupa (koza) → ergin kelebek.",
        ornek: "Bebeğin boyunun uzaması büyümedir; yürümeyi ve konuşmayı öğrenmesi gelişmedir.",
        gorsel: akis(["🥚|Yumurta", "🐛|Tırtıl", "Pupa|(koza)", "🦋|Kelebek"], "kelebeğin başkalaşımı"),
        durak: { soru: "Aşağıdaki canlılardan hangisi dolaylı gelişme (başkalaşım) gösterir?", secenekler: [["Kurbağa", true, "Kurbağa yumurtadan iribaş olarak çıkar; iribaş ergin kurbağaya benzemez."], ["Kedi", false, "Kedi yavrusu ergin kediye benzer; doğrudan gelişme gösterir."], ["Tavuk", false, "Civciv ergin tavuğa benzer; doğrudan gelişir."], ["İnsan", false, "İnsan doğrudan gelişme gösterir; bebek yetişkine benzer."]] } },
    ],
    uret: {
      "fure.eseysiz": [
        Q("fure.eseysiz", "hatirlama", 1, "Amip ve bakteri gibi tek hücreli canlılarda görülen, canlının ikiye ayrılarak çoğalmasına ne ad verilir?", "Bölünme",
          [["Tomurcuklanma", "bilgi", "Tomurcuklanmada atanın üzerinde bir çıkıntı oluşur; canlı ortadan ikiye ayrılmaz."], ["Rejenerasyon", "bilgi", "Rejenerasyon, kopan bir parçadan yeni bireyin oluşmasıdır."], ["Döllenme", "kavrama", "Döllenme eşeyli üremede üreme hücrelerinin birleşmesidir; amip eşeysiz ürer."]],
          "Bir hücre ikiye ayrılırsa ne olur?", ["Amip ve bakteri tek hücrelidir.", "Bu canlılar hücrelerini ikiye ayırarak yeni bireyler oluşturur.", "Bu eşeysiz üreme çeşidine bölünme denir."],
          { kural: "Bölünme: tek hücreli canlının ikiye ayrılmasıdır (amip, bakteri, öglena, paramesyum)." }),
        Q("fure.eseysiz", "aciklama", 1, "Eşeysiz üreme ile oluşan yavrular için aşağıdakilerden hangisi doğrudur?", "Atasıyla aynı kalıtsal özellikleri taşır.",
          [["Anne ve babadan farklı özellikler alır.", "kavrama", "Eşeysiz üremede tek ata vardır; anne-baba ayrımı yoktur."], ["Döllenme sonucunda oluşur.", "bilgi", "Döllenme eşeyli üremeye özgüdür."], ["Yalnızca hayvanlarda görülür.", "bilgi", "Eşeysiz üreme bitkilerde, mantarlarda ve tek hücrelilerde de görülür."]],
          "Eşeysiz üremede kaç ata vardır?", ["Eşeysiz üremede tek bir ata vardır ve üreme hücreleri kullanılmaz.", "Yavru, atasının bir parçasından oluşur.", "Bu nedenle yavru atasıyla aynı kalıtsal özellikleri taşır."],
          { kural: "Eşeysiz üreme: tek ata, döllenme yok, yavrular ataya tıpatıp benzer." }),
        Q("fure.eseysiz", "uygulama", 2, "Tabloda canlılar ve üreme çeşitleri eşleştirilmiştir. Hangi eşleştirme <b>yanlıştır</b>?", "Bira mayası – Sporla üreme",
          [["Deniz yıldızı – Rejenerasyon", "bilgi", "Deniz yıldızının kopan kolundan yeni bir deniz yıldızı oluşabilir; bu eşleştirme doğrudur."], ["Patates – Vejetatif üreme", "bilgi", "Patates yumrusundaki gözlerden yeni bitki oluşur; bu doğrudur."], ["Hidra – Tomurcuklanma", "bilgi", "Hidra tomurcuklanarak çoğalır; bu eşleştirme doğrudur."]],
          "Bira mayası üzerinde küçük çıkıntılar oluşur. Bu hangi üreme çeşidine benzer?", ["Her eşleştirmeyi tek tek kontrol et.", "Bira mayası, üzerinde oluşan tomurcuklarla ürer.", "Bu yüzden “bira mayası – sporla üreme” eşleştirmesi yanlıştır; doğrusu tomurcuklanmadır."],
          { gorsel: G.tablo(["Canlı", "Üreme çeşidi"], [["Deniz yıldızı", "Rejenerasyon"], ["Patates", "Vejetatif üreme"], ["Hidra", "Tomurcuklanma"], ["Bira mayası", "Sporla üreme"]]), kural: "Tomurcuklanma: bira mayası, hidra. Sporla üreme: küf mantarı, şapkalı mantar, eğrelti otu." }),
        Q("fure.eseysiz", "aciklama", 2, "Kertenkelenin kopan kuyruğunun yeniden oluşması neden eşeysiz üreme sayılmaz?", "Çünkü yeni bir kertenkele oluşmaz; yalnızca kayıp parça onarılır.",
          [["Çünkü kertenkele eşeysiz ürer.", "bilgi", "Kertenkele eşeyli ürer; ayrıca kuyruğun yenilenmesi yeni birey oluşturmaz."], ["Çünkü kuyruk hücreleri bölünmez.", "kavrama", "Kuyruk hücreleri bölünerek çoğalır; asıl önemli nokta yeni bir birey oluşmamasıdır."], ["Çünkü kuyruk yeniden oluşmaz.", "bilgi", "Kertenkelenin kuyruğu yeniden oluşabilir; ama bu üreme değil onarımdır."]],
          "Üreme denilmesi için birey sayısı artmalı mı?", ["Üreme, yeni bireylerin oluşmasıdır; birey sayısı artar.", "Kertenkelenin kuyruğu yenilendiğinde hâlâ tek bir kertenkele vardır.", "Bu olay üreme değil, yenilenme (onarım) örneğidir."],
          { kural: "Deniz yıldızının kopan kolundan yeni birey oluşması üremedir; kertenkelenin kuyruğunu yenilemesi onarımdır." }),
        Q("fure.eseysiz", "transfer", 2, "Bir çiftçi, verimli ve hastalıklara dayanıklı gül fidanının aynısından çok sayıda elde etmek istiyor. Hangi yöntemi seçmelidir?", "Gülden kesilen dalları (çelikleri) toprağa dikmek",
          [["Gül tohumlarını ekmek", "strateji", "Tohum eşeyli üremeyle oluşur; yeni bitkiler ana bitkiden farklı özellikler taşıyabilir."], ["Gülleri farklı güllerle tozlaştırmak", "strateji", "Tozlaşma ve döllenme eşeyli üremedir; çeşitlilik oluşur, aynı özellikler korunmaz."], ["Güllerin yapraklarını koparmak", "kavrama", "Yaprak koparmak üremeyi sağlamaz."]],
          "Ataya tıpatıp benzeyen yavrular hangi üreme türüyle oluşur?", ["İstenen: ana bitkinin özelliklerinin aynen korunması.", "Bu, ancak eşeysiz üremeyle olur.", "Çelikle üretme bir vejetatif (eşeysiz) üreme yöntemidir; yeni gül fidanları ana bitkiyle aynı özellikleri taşır."],
          { kural: "İstenen özellikleri korumak için eşeysiz üreme (çelik, yumru, soğan) kullanılır; çeşitlilik için eşeyli üreme gerekir." }),
        Q("fure.eseysiz", "transfer", 3, "Bir bölgedeki muz bitkilerinin hepsi eşeysiz yolla üretilmiştir. Bu bitkilerde bir hastalık görüldüğünde hepsinin kısa sürede hastalanma ihtimali neden yüksektir?", "Hepsi aynı kalıtsal özellikleri taşıdığı için hastalığa karşı dayanıklılıkları da aynıdır.",
          [["Eşeysiz üreyen bitkiler hiç hastalanmaz.", "kavrama", "Eşeysiz üreme hastalığa karşı koruma sağlamaz."], ["Eşeysiz üremede yavrular atalarından çok farklıdır.", "bilgi", "Eşeysiz üremede yavrular ataya tıpatıp benzer."], ["Muz bitkileri yalnızca sporla ürer.", "bilgi", "Bu bilgi yanlıştır ve soruyla ilgili değildir."]],
          "Eşeysiz üremede çeşitlilik olur mu?", ["Eşeysiz üremede tüm bireyler aynı kalıtsal özelliklere sahiptir.", "Bir hastalığa karşı dayanıksız olan bir bitki varsa, hepsi dayanıksızdır.", "Çeşitlilik olmadığı için hastalık hepsini etkileyebilir."],
          { kural: "Eşeyli üreme çeşitlilik sağlar; çeşitlilik, değişen koşullara uyum şansını artırır." }),
        Q("fure.eseysiz", "baglanti", 2, "Bir öğrenci “Eşeyli üremede yavrular ataya tıpatıp benzer.” diyor. Bu ifadeyi nasıl düzeltmelisin?", "Eşeyli üremede yavrular anne ve babadan gelen özellikleri birlikte taşır, bu yüzden farklılık gösterebilir.",
          [["İfade doğrudur, düzeltmeye gerek yoktur.", "kavrama", "Kardeşlerin bile birbirinden farklı olması eşeyli üremedeki çeşitliliği gösterir."], ["Eşeyli üremede tek ata vardır.", "bilgi", "Eşeyli üremede dişi ve erkek olmak üzere iki ata vardır."], ["Eşeyli üremede üreme hücreleri kullanılmaz.", "bilgi", "Eşeyli üremede yumurta ve sperm kullanılır."]],
          "Kardeşler neden birbirine tıpatıp benzemez?", ["Eşeyli üremede yumurta (anneden) ve sperm (babadan) birleşir.", "Yavru her iki atadan da özellik alır.", "Bu yüzden yavrular atalarına ve birbirlerine tıpatıp benzemez; çeşitlilik oluşur."],
          { kural: "Eşeyli üreme: iki ata, döllenme, çeşitlilik." }),
      ],
      "fure.bitki": [
        Q("fure.bitki", "hatirlama", 1, "Şekildeki çiçekte 1 numara ile gösterilen, polenlerin tutunduğu yapı hangisidir?", "Tepecik",
          [["Başçık", "dikkat", "Başçık erkek organın ucundadır ve polen üretir (2 numara)."], ["Çanak yaprak", "bilgi", "Çanak yapraklar çiçeğin en altındaki yeşil yapraklardır (5 numara)."], ["Yumurtalık", "bilgi", "Yumurtalık dişi organın alt kısmındaki şişkin bölümdür (4 numara)."]],
          "Dişi organın en üst kısmını düşün.", ["1 numara, ortadaki dişi organın en üst ucunu göstermektedir.", "Dişi organın üst ucu yapışkandır ve polenleri tutar.", "Bu yapının adı tepeciktir."],
          { gorsel: cicek(), kural: "Dişi organ: tepecik + dişicik borusu + yumurtalık. Erkek organ: başçık + sapçık." }),
        Q("fure.bitki", "hatirlama", 1, "Polenlerin (çiçek tozlarının) dişi organın tepeciğine taşınmasına ne ad verilir?", "Tozlaşma",
          [["Döllenme", "kavrama", "Döllenme, tozlaşmadan sonra yumurtalıkta üreme hücrelerinin birleşmesidir."], ["Çimlenme", "bilgi", "Çimlenme, tohumdaki bitki taslağının gelişmeye başlamasıdır."], ["Tomurcuklanma", "bilgi", "Tomurcuklanma bir eşeysiz üreme çeşididir."]],
          "Bu olay döllenmeden önce mi sonra mı olur?", ["Polenler başçıkta üretilir.", "Rüzgâr, böcek, su ya da insan polenleri tepeciğe taşır.", "Bu taşınma olayına tozlaşma denir; döllenme bundan sonra gerçekleşir."],
          { kural: "Sıra: tozlaşma → döllenme → tohum ve meyve oluşumu → çimlenme." }),
        Q("fure.bitki", "aciklama", 2, "Şekildeki çiçekte 3 numaralı yapıların renkli ve kokulu olmasının bitkiye yararı nedir?", "Böcekleri çekerek tozlaşmaya yardımcı olur.",
          [["Fotosentez yaparak meyve oluşturur.", "kavrama", "Taç yaprakların görevi meyve oluşturmak değildir; meyve yumurtalıktan oluşur."], ["Polen üretir.", "bilgi", "Polen başçıkta üretilir."], ["Tohumu korur.", "bilgi", "Tohumu meyve ve tohum kabuğu korur; taç yaprak tohumu korumaz."]],
          "Arılar hangi çiçeklere daha çok gider?", ["3 numara taç yaprakları göstermektedir.", "Renkli ve kokulu taç yapraklar arı ve kelebek gibi böcekleri çeker.", "Böcekler bir çiçekten diğerine polen taşır; böylece tozlaşma kolaylaşır."],
          { gorsel: cicek(), kural: "Çanak yaprak korur, taç yaprak böcekleri çeker." }),
        Q("fure.bitki", "uygulama", 2, "Döllenmeden sonra çiçeğin yapılarında hangi dönüşüm gerçekleşir?", "Yumurtalık meyveye, tohum taslağı tohuma dönüşür.",
          [["Tohum taslağı meyveye, yumurtalık tohuma dönüşür.", "dikkat", "Eşleştirmeyi ters yaptın: meyve yumurtalıktan, tohum tohum taslağından oluşur."], ["Taç yaprak meyveye dönüşür.", "kavrama", "Taç yapraklar genellikle döllenmeden sonra dökülür."], ["Başçık tohuma dönüşür.", "bilgi", "Başçık erkek organdadır; tohum dişi organdaki tohum taslağından oluşur."]],
          "Bir elmanın içinde çekirdekler (tohumlar) vardır. Elma hangi yapının içini sarar?", ["Döllenme yumurtalıktaki tohum taslağında gerçekleşir.", "Döllenmiş tohum taslağı tohuma dönüşür.", "Tohumları saran yumurtalık gelişerek meyveyi oluşturur."],
          { kural: "Yumurtalık → meyve; tohum taslağı → tohum." }),
        Q("fure.bitki", "uygulama", 2, "Aynı tür fasulye tohumlarıyla tablodaki ortamlar hazırlanıyor. Hangi kapta tohumların çimlenmesi beklenir?", "2. kap",
          [["1. kap", "kavrama", "Kuru pamukta su olmadığı için tohum çimlenemez."], ["3. kap", "kavrama", "Buzdolabındaki düşük sıcaklık çimlenmeye uygun değildir."], ["4. kap", "dikkat", "Hava (oksijen) olmadan tohum çimlenemez; kap su ile tamamen doldurulup kapatılmıştır."]],
          "Çimlenme için gereken üç koşulu düşün: su, uygun sıcaklık, oksijen.", ["Çimlenme için su, uygun sıcaklık ve oksijen birlikte gerekir.", "1. kapta su, 3. kapta uygun sıcaklık, 4. kapta hava yoktur.", "Yalnızca 2. kapta üç koşul da vardır; toprak olmasa da tohum çimlenir."],
          { gorsel: G.tablo(["Kap", "Ortam", "Sıcaklık"], [["1", "Kuru pamuk, açık kap", "Oda sıcaklığı"], ["2", "Islak pamuk, açık kap", "Oda sıcaklığı"], ["3", "Islak pamuk, açık kap", "Buzdolabı (çok soğuk)"], ["4", "Ağzına kadar kaynatılıp soğutulmuş su, kapalı kap", "Oda sıcaklığı"]]), kural: "Çimlenme koşulları: su + uygun sıcaklık + oksijen. Toprak ve ışık çimlenme için şart değildir." }),
        Q("fure.bitki", "aciklama", 2, "Tohum çimlenirken yaprakları henüz oluşmadığı hâlde gelişmesi için gereken besini nereden sağlar?", "Tohumun içindeki besin deposundan",
          [["Topraktaki besinlerden", "kavrama", "Tohum pamukta da çimlenir; ilk besini topraktan değil kendi deposundan alır."], ["Güneş ışığından", "kavrama", "Işık besin değildir; ayrıca yaprak yokken fotosentez yapılamaz."], ["Havadaki oksijenden", "bilgi", "Oksijen çimlenme için gerekir ama besin değildir."]],
          "Fasulye tohumunu ikiye ayırdığında içinde ne görürsün?", ["Tohum; tohum kabuğu, bitki taslağı (embriyo) ve besin deposundan oluşur.", "Yapraklar oluşup fotosentez başlayana kadar bitki taslağı besin deposunu kullanır.", "Bu yüzden ilk besin tohumun kendi besin deposundan sağlanır."],
          { kural: "Tohumun yapısı: tohum kabuğu (korur), embriyo (bitki taslağı), besin deposu (ilk besin)." }),
        Q("fure.bitki", "transfer", 3, "Bir seradaki domates bitkileri bol çiçek açmasına rağmen çok az meyve veriyor. Sera kapalı olduğu için içeri böcek girmiyor. Sera sahibinin meyve sayısını artırmak için ne yapması en uygundur?", "Seraya bombus arısı gibi tozlaşmayı sağlayan böcekler yerleştirmek",
          [["Seradaki sıcaklığı düşürmek", "strateji", "Sorun sıcaklık değil, tozlaşmanın gerçekleşmemesidir."], ["Bitkilerin taç yapraklarını koparmak", "kavrama", "Taç yaprakları koparmak böcekleri çekmeyi zorlaştırır, tozlaşmayı artırmaz."], ["Daha çok tohum ekmek", "strateji", "Çiçek zaten bol; sorun çiçeklerin meyveye dönüşmemesidir."]],
          "Çiçekten meyve oluşması için önce ne olmalı?", ["Meyve oluşması için önce tozlaşma, sonra döllenme olmalıdır.", "Kapalı serada polenleri taşıyacak böcek yoktur; tozlaşma azalır.", "Seraya arı yerleştirmek tozlaşmayı artırır, böylece daha çok meyve oluşur."],
          { kural: "Tozlaşma olmazsa döllenme, döllenme olmazsa tohum ve meyve oluşmaz." }),
      ],
      "fure.gelisme": [
        Q("fure.gelisme", "hatirlama", 1, "Şekilde kelebeğin yaşam döngüsü gösterilmiştir. Soru işaretli evrenin adı nedir?", "Pupa (koza)",
          [["İribaş", "bilgi", "İribaş kurbağanın yavru evresidir."], ["Yumurta", "dikkat", "Yumurta ilk evredir; soru işareti tırtıldan sonraki evrededir."], ["Larva", "dikkat", "Tırtıl zaten larva evresidir; sonraki evre pupadır."]],
          "Tırtıl kendini bir kılıfa sarar.", ["Kelebeğin evreleri: yumurta → tırtıl (larva) → pupa → ergin kelebek.", "Soru işareti tırtıldan sonra, kelebekten önce gelir.", "Bu evre pupa (koza) evresidir."],
          { gorsel: akis(["🥚|Yumurta", "🐛|Tırtıl", "?", "🦋|Kelebek"], "kelebeğin yaşam döngüsü"), kural: "Kelebek: yumurta → tırtıl → pupa → kelebek. Kurbağa: yumurta → iribaş → ergin kurbağa." }),
        Q("fure.gelisme", "uygulama", 2, "Şekilde kurbağanın gelişme evreleri verilmiştir. Soru işaretli evre için hangisi doğrudur?", "Solungaçla solunum yapan, kuyruklu iribaştır.",
          [["Akciğerle solunum yapan, kuyruksuz ergindir.", "dikkat", "Bu özellikler son evredeki ergin kurbağaya aittir."], ["Pupa evresidir.", "bilgi", "Pupa evresi kelebek gibi böceklerde görülür, kurbağada yoktur."], ["Ergin kurbağanın küçük bir kopyasıdır.", "kavrama", "Kurbağa dolaylı gelişir; iribaş ergine benzemez."]],
          "Yumurtadan çıkan yavru suda yaşar ve balığa benzer.", ["Kurbağa: yumurta → iribaş → bacaklı iribaş → ergin kurbağa.", "Soru işaretli evre yumurtadan hemen sonra gelir: iribaş.", "İribaş suda yaşar, kuyrukludur ve solungaçla solunum yapar."],
          { gorsel: akis(["Yumurta", "?", "Bacaklı|iribaş", "🐸|Kurbağa"], "kurbağanın yaşam döngüsü"), kural: "Kurbağa başkalaşım geçirir: iribaş suda solungaçla, ergin kurbağa akciğer ve deriyle solunum yapar." }),
        Q("fure.gelisme", "aciklama", 1, "Büyüme ile gelişme arasındaki farkı en iyi anlatan ifade hangisidir?", "Büyüme boy ve kütle artışı, gelişme ise organların yapı ve görev bakımından olgunlaşmasıdır.",
          [["Büyüme ve gelişme aynı anlama gelir.", "kavrama", "Büyüme miktar (boy, kütle) artışıdır; gelişme yeteneklerin ve organların olgunlaşmasıdır."], ["Gelişme boy artışı, büyüme yetenek kazanmadır.", "dikkat", "Tanımları ters eşleştirdin."], ["Büyüme yalnızca bitkilerde, gelişme yalnızca hayvanlarda görülür.", "bilgi", "Büyüme ve gelişme tüm canlılarda görülür."]],
          "Bebeğin boyu uzarken bir yandan da yürümeyi öğrenir. Hangisi büyüme, hangisi gelişme?", ["Büyüme: hücre sayısı ve büyüklüğü artar, boy ve kütle artar.", "Gelişme: organlar olgunlaşır, canlı yeni yetenekler kazanır.", "Örneğin boyun uzaması büyüme, yürümeyi öğrenmek gelişmedir."],
          { kural: "Büyüme = ölçülebilir artış (boy, kütle). Gelişme = olgunlaşma, yeni yetenekler." }),
        Q("fure.gelisme", "uygulama", 2, "Tablodaki olaylardan hangisi <b>gelişmeye</b> örnektir?", "Bebeğin konuşmaya başlaması",
          [["Çocuğun bir yılda 6 cm uzaması", "kavrama", "Boy uzaması ölçülebilir bir artıştır; büyümedir."], ["Yavru kedinin kütlesinin 2 katına çıkması", "kavrama", "Kütle artışı büyümedir."], ["Fidanın gövdesinin kalınlaşması", "kavrama", "Gövde kalınlaşması büyümedir."]],
          "Hangisi yeni bir yetenek kazanmadır?", ["Boy uzaması, kütle artışı ve gövde kalınlaşması ölçülebilir artışlardır; bunlar büyümedir.", "Konuşmaya başlamak ise organların olgunlaşmasıyla kazanılan yeni bir yetenektir.", "Bu nedenle gelişmeye örnek, bebeğin konuşmaya başlamasıdır."],
          { gorsel: G.tablo(["Olay"], [["Çocuğun bir yılda 6 cm uzaması"], ["Yavru kedinin kütlesinin 2 katına çıkması"], ["Fidanın gövdesinin kalınlaşması"], ["Bebeğin konuşmaya başlaması"]]), kural: "Ölçülebilen artış büyüme; yeni yetenek kazanmak gelişmedir." }),
        Q("fure.gelisme", "uygulama", 2, "Aşağıdaki canlı gruplarından hangisinin tamamı doğrudan gelişme gösterir?", "İnsan, kedi, tavuk",
          [["Kurbağa, kelebek, ipek böceği", "kavrama", "Bu canlıların hepsi başkalaşım (dolaylı gelişme) geçirir."], ["Kedi, kurbağa, tavuk", "dikkat", "Kurbağa iribaş evresinden geçer; dolaylı gelişir."], ["Kelebek, insan, kedi", "dikkat", "Kelebek tırtıl ve pupa evrelerinden geçer; dolaylı gelişir."]],
          "Yavrusu yetişkinine benzeyen canlıları seç.", ["Doğrudan gelişmede yavru ergine benzer, yalnızca büyür ve olgunlaşır.", "İnsan bebeği, kedi yavrusu ve civciv ergine benzer.", "Kurbağa, kelebek ve ipek böceği ise başkalaşım geçirir."],
          { kural: "Doğrudan gelişme: yavru ergine benzer. Dolaylı gelişme (başkalaşım): yavru ergine benzemez, evrelerden geçer." }),
        Q("fure.gelisme", "transfer", 3, "Tırtıllar yaprakla, ergin kelebekler ise çiçek nektarıyla beslenir. Başkalaşımın bu canlılara sağladığı yarar nedir?", "Yavru ve erginler farklı besinlerle beslendiği için aralarında besin rekabeti olmaz.",
          [["Kelebeklerin daha kısa yaşamasını sağlar.", "kavrama", "Başkalaşımın amacı yaşam süresini kısaltmak değildir."], ["Tırtılların hemen uçabilmesini sağlar.", "bilgi", "Tırtılların kanadı yoktur; uçamazlar."], ["Kelebeklerin eşeysiz üremesini sağlar.", "bilgi", "Kelebekler eşeyli ürer; başkalaşım üreme türünü değiştirmez."]],
          "Yavrular ve erginler aynı besini yeseydi ne olurdu?", ["Tırtıl yaprak, kelebek nektar tüketir.", "Aynı besin için yarışmazlar.", "Böylece hem yavrular hem erginler besin bulmakta zorlanmaz."],
          { kural: "Başkalaşım geçiren canlılarda yavru ve ergin genellikle farklı ortamda yaşar ve farklı besinle beslenir." }),
        Q("fure.gelisme", "baglanti", 3, "Bitkilerde tohumun çimlenip fideye dönüşmesi ve hayvanlarda iribaşın kurbağaya dönüşmesi ile ilgili hangisi ortak olarak söylenebilir?", "Her ikisinde de hem büyüme hem gelişme vardır.",
          [["Her ikisi de eşeysiz üremedir.", "kavrama", "Bunlar üreme değil, büyüme ve gelişme süreçleridir."], ["Her ikisinde de yalnızca büyüme vardır.", "kavrama", "Yeni yapılar (yaprak, bacak) oluştuğu için gelişme de vardır."], ["Her ikisi de doğrudan gelişmedir.", "bilgi", "İribaşın kurbağaya dönüşmesi dolaylı gelişmedir (başkalaşım)."]],
          "Fide yaprak çıkarır, iribaş bacak çıkarır. Bu yalnızca boy artışı mı?", ["Çimlenen tohumda boy ve kütle artar (büyüme), yaprak ve kök oluşur (gelişme).", "İribaşta da boy artar (büyüme), bacaklar ve akciğerler oluşur (gelişme).", "Yani iki olayda da büyüme ve gelişme birlikte görülür."],
          { kural: "Canlılarda büyüme ve gelişme genellikle birlikte gerçekleşir." }),
      ],
    },
  });

  /* ================= 2) DENETLEYİCİ VE DÜZENLEYİCİ SİSTEMLER ================= */
  KONU_EKLE("fen", {
    id: "f_denetleyici", tema: "f3", ad: "Denetleyici ve Düzenleyici Sistemler",
    kazanimlar: [
      { id: "fden.sinir", ad: "Sinir sisteminin bölümlerini, görevlerini ve refleksi açıklama" },
      { id: "fden.hormon", ad: "İç salgı bezlerini ve hormonların temel görevlerini açıklama" },
      { id: "fden.ergenlik", ad: "Ergenlik dönemi değişikliklerini ve sistemlerin sağlığını korumanın yollarını açıklama" },
    ],
    anlatim: [
      { baslik: "Sinir sistemi",
        metin: "Vücudumuzdaki sistemlerin uyum içinde çalışmasını <b>sinir sistemi</b> ve <b>iç salgı (endokrin) sistemi</b> sağlar. Sinir sistemi iki bölümden oluşur:<br><b>Merkezi sinir sistemi:</b> beyin, beyincik, omurilik soğanı ve omurilik.<br><b>Çevresel sinir sistemi:</b> merkezi sinir sisteminden vücudun her yerine uzanan sinirler. Duyu organlarından gelen bilgileri merkeze taşır, merkezden gelen emirleri kas ve organlara iletir.<br><b>Beyin:</b> düşünme, öğrenme, hafıza, konuşma, istemli hareketler ve duyuların algılanması.<br><b>Beyincik:</b> vücudun dengesi ve hareketlerin düzenli, uyumlu yapılması.<br><b>Omurilik soğanı:</b> kalp atışı, solunum, sindirim gibi elimizde olmayan (istemsiz) olaylar; öksürme, hapşırma, yutma.<br><b>Omurilik:</b> beyin ile vücut arasındaki iletişim yolu ve refleks merkezi.",
        ornek: "Bisiklete binerken dengede durmamızı beyincik, nereye gideceğimize karar vermemizi beyin sağlar.",
        gorsel: G.tablo(["Bölüm", "Temel görev"], [["Beyin", "Düşünme, hafıza, istemli hareketler"], ["Beyincik", "Denge ve hareketlerin uyumu"], ["Omurilik soğanı", "Kalp atışı, solunum gibi istemsiz olaylar"], ["Omurilik", "İletişim yolu, refleks merkezi"]]),
        durak: { soru: "Cimnastik yapan bir sporcunun denge aleti üzerinde düşmeden durabilmesinde en çok hangi bölüm görev alır?", secenekler: [["Beyincik", true, "Beyincik vücudun dengesini ve hareketlerin uyumunu sağlar."], ["Omurilik soğanı", false, "Omurilik soğanı kalp atışı, solunum gibi istemsiz olayları denetler."], ["Omurilik", false, "Omurilik iletişim yolu ve refleks merkezidir; dengenin asıl merkezi değildir."], ["Pankreas", false, "Pankreas bir bezdir; kan şekerini düzenler."]] } },
      { baslik: "Refleks",
        metin: "Bir uyarıya karşı <b>düşünmeden, istemsiz ve çok hızlı</b> verilen tepkiye <b>refleks</b> denir. Refleksler bizi tehlikelerden korur. Pek çok refleksin merkezi <b>omuriliktir</b>; tepki, beyne gitmeden omurilikten verilir. Bu yüzden çok hızlıdır.<br>Refleks yayı: uyarı → duyu siniri → omurilik → hareket siniri → kas (tepki).",
        ornek: "Elimizi sıcak sobaya değdirince hemen çekmemiz, diz kapağına vurulunca bacağın sıçraması refleks örnekleridir. Acıyı genellikle elimizi çektikten sonra hissederiz.",
        gorsel: reflexYayi(false),
        durak: { soru: "Aşağıdakilerden hangisi bir reflekstir?", secenekler: [["Gözümüze toz kaçacakken göz kapağımızı kırpmamız", true, "Düşünmeden, istemsiz ve hızlı verilen koruyucu bir tepkidir."], ["Ders çalışırken soru çözmemiz", false, "Bu, düşünerek yapılan istemli bir harekettir."], ["Arkadaşımıza el sallamamız", false, "Karar vererek yaptığımız istemli bir harekettir."], ["Şarkı söylememiz", false, "İstemli bir harekettir; beyin tarafından yönetilir."]] } },
      { baslik: "İç salgı bezleri ve hormonlar",
        metin: "İç salgı bezleri ürettikleri <b>hormonları</b> doğrudan <b>kana</b> verir. Hormonlar kanla vücuda taşınır ve büyüme, gelişme, metabolizma gibi olayları düzenler. Hormonların etkisi sinirlere göre daha yavaş ama daha uzun sürelidir.<br><b>Hipofiz:</b> Beynin alt kısmındadır. Büyüme hormonunu salgılar ve diğer bezlerin çalışmasını düzenler; bu yüzden “ana bez” denir.<br><b>Tiroit:</b> Boyundadır. Metabolizma hızını, büyüme ve gelişmeyi düzenler. Çalışması için <b>iyot</b> gerekir; iyot eksikliğinde boyunda şişlik (guatr) görülebilir.<br><b>Böbrek üstü bezleri:</b> Heyecan, korku ve stres anında salgılanan <b>adrenalin</b>, kalp atışını ve solunumu hızlandırır.<br><b>Pankreas:</b> <b>İnsülin</b> kan şekerini düşürür, <b>glukagon</b> yükseltir. İnsülin yeterince üretilmezse şeker hastalığı (diyabet) görülür.<br><b>Eşey bezleri:</b> Kızlarda yumurtalıklar, erkeklerde testisler. Üreme hücrelerini ve ergenlik özelliklerini oluşturan hormonları üretir.",
        ornek: "Sınav öncesi heyecanlandığımızda kalbimizin hızlı atmasının nedeni böbrek üstü bezlerinden salgılanan adrenalindir.",
        durak: { soru: "Diğer iç salgı bezlerinin çalışmasını düzenlediği için “ana bez” olarak bilinen bez hangisidir?", secenekler: [["Hipofiz", true, "Hipofiz büyüme hormonunu salgılar ve diğer bezleri yönetir."], ["Tiroit", false, "Tiroit metabolizma hızını düzenler; diğer bezleri yönetmez."], ["Pankreas", false, "Pankreas kan şekerini düzenler."], ["Böbrek üstü bezi", false, "Böbrek üstü bezi adrenalin salgılar."]] } },
      { baslik: "Ergenlik ve sistemlerin sağlığı",
        metin: "<b>Ergenlik</b>, çocukluktan yetişkinliğe geçiş dönemidir. Hipofizin uyarısıyla eşey bezleri çalışmaya başlar. Kızlarda genellikle erkeklerden daha erken başlar.<br>Değişiklikler: boyda hızlı uzama, terlemenin ve vücut kokusunun artması, sivilce, vücutta kıllanma; erkeklerde sesin kalınlaşması ve kasların gelişmesi; kızlarda göğüslerin gelişmesi ve adet döngüsünün başlaması. Duygu değişimleri de yaşanabilir; bunlar bu dönem için normaldir.<br><b>Sağlık için:</b> düzenli ve yeterli uyumak (büyüme hormonu uykuda daha çok salgılanır), dengeli beslenmek ve <b>iyotlu tuz</b> kullanmak, spor yapmak, kişisel temizliğe dikkat etmek, bisiklet sürerken <b>kask</b> takmak, sigara, alkol ve uyuşturucu gibi zararlı alışkanlıklardan uzak durmak.",
        ornek: "Gece geç saatlere kadar ekran başında kalmak uykuyu azaltır; bu da dikkat, hafıza ve büyümeyi olumsuz etkiler.",
        durak: { soru: "Tiroit bezinin sağlığı için yemeklerde hangisinin kullanılması önerilir?", secenekler: [["İyotlu tuz", true, "Tiroit bezi hormon üretmek için iyota ihtiyaç duyar."], ["Bol şeker", false, "Fazla şeker sağlığa zararlıdır ve tiroit bezine yarar sağlamaz."], ["Hazır içecekler", false, "Hazır içecekler iyot ihtiyacını karşılamaz."], ["Kızartmalar", false, "Kızartmalar sağlıklı beslenme için önerilmez."]] } },
    ],
    uret: {
      "fden.sinir": [
        Q("fden.sinir", "hatirlama", 1, "Aşağıdakilerden hangisi merkezi sinir sisteminin bir bölümü <b>değildir</b>?", "Kollara ve bacaklara uzanan sinirler",
          [["Beyin", "bilgi", "Beyin merkezi sinir sisteminin en büyük bölümüdür."], ["Beyincik", "bilgi", "Beyincik merkezi sinir sistemindedir."], ["Omurilik", "bilgi", "Omurilik merkezi sinir sistemindedir."]],
          "Merkezden vücuda uzanan sinirler hangi bölümü oluşturur?", ["Merkezi sinir sistemi: beyin, beyincik, omurilik soğanı ve omurilik.", "Merkezden kollara ve bacaklara uzanan sinirler çevresel sinir sistemini oluşturur.", "Bu yüzden doğru cevap kollara ve bacaklara uzanan sinirlerdir."],
          { kural: "Merkezi sinir sistemi: beyin, beyincik, omurilik soğanı, omurilik. Çevresel sinir sistemi: vücuda yayılan sinirler." }),
        Q("fden.sinir", "aciklama", 1, "Uyurken bile kalbimizin atması ve nefes almamız hangi bölümün denetimindedir?", "Omurilik soğanı",
          [["Beyincik", "bilgi", "Beyincik denge ve hareket uyumunu sağlar."], ["Beyin", "kavrama", "Beyin istemli hareketleri ve düşünmeyi yönetir; kalp atışı istemsizdir."], ["Tiroit bezi", "bilgi", "Tiroit metabolizma hızını düzenleyen bir bezdir; kalp atışını başlatıp sürdürmez."]],
          "Bu olaylar istemli mi, istemsiz mi?", ["Kalp atışı ve solunum biz istemesek de sürer; istemsiz olaylardır.", "İstemsiz olaylar omurilik soğanı tarafından denetlenir.", "Cevap: omurilik soğanı."],
          { kural: "Omurilik soğanı: kalp atışı, solunum, sindirim, öksürme, hapşırma, yutma." }),
        Q("fden.sinir", "uygulama", 2, "Tabloda bazı olaylar verilmiştir. Hangi eşleştirme doğrudur?", "Matematik problemi çözmek – Beyin",
          [["Dengede yürümek – Omurilik soğanı", "bilgi", "Denge beyinciğin görevidir."], ["Hapşırmak – Beyincik", "bilgi", "Hapşırma omurilik soğanının denetimindedir."], ["Bir şiiri ezberlemek – Omurilik", "bilgi", "Öğrenme ve hafıza beynin görevidir."]],
          "Düşünme ve hafıza hangi bölümdedir?", ["Düşünme, öğrenme ve hafıza beynin görevidir.", "Denge beyincikte, hapşırma omurilik soğanındadır.", "Doğru eşleştirme: matematik problemi çözmek – beyin."],
          { gorsel: G.tablo(["Olay", "Merkezi sinir sistemi bölümü"], [["Matematik problemi çözmek", "?"], ["Dengede yürümek", "?"], ["Hapşırmak", "?"], ["Bir şiiri ezberlemek", "?"]]), kural: "Beyin: düşünme-hafıza. Beyincik: denge. Omurilik soğanı: istemsiz olaylar. Omurilik: refleks." }),
        Q("fden.sinir", "hatirlama", 1, "Şekilde elin sıcak sobadan çekilmesine ait refleks yayı gösterilmiştir. Soru işaretli bölüm hangisidir?", "Omurilik",
          [["Beyin", "kavrama", "Refleks tepkisi beyne gitmeden omurilikten verilir; bu yüzden çok hızlıdır."], ["Beyincik", "bilgi", "Beyincik denge merkezidir; refleks merkezi değildir."], ["Hipofiz", "bilgi", "Hipofiz bir iç salgı bezidir; sinir uyarısını yönetmez."]],
          "Refleksler neden çok hızlıdır?", ["Uyarı duyu siniriyle merkeze taşınır.", "Bu tür reflekslerde merkez omuriliktir; karar beyne gitmeden verilir.", "Hareket siniri emri kasa iletir ve el çekilir. Soru işareti: omurilik."],
          { gorsel: reflexYayi(true), kural: "Refleks yayı: uyarı → duyu siniri → omurilik → hareket siniri → kas." }),
        Q("fden.sinir", "aciklama", 2, "Elini sıcak bir tencereye değdiren Ayşe, elini hemen çekiyor ve acıyı ancak bir an sonra hissediyor. Bunun nedeni nedir?", "Elin çekilme emri omurilikten verilir; acının hissedilmesi için uyarının beyne ulaşması gerekir.",
          [["Acıyı beyincik hissettirir.", "bilgi", "Acının algılanması beyinde olur; beyincik denge merkezidir."], ["Elini çekmeye beyin karar verir.", "kavrama", "Refleksler düşünmeden yapılır; karar beyne gitmeden omurilikte verilir."], ["Hormonlar sinirlerden hızlı çalışır.", "kavrama", "Hormonların etkisi sinirlere göre daha yavaştır."]],
          "Refleksin merkezi neresidir, duyuların algılandığı yer neresidir?", ["Elin çekilmesi bir reflekstir; omurilik hemen emir verir.", "Acı duygusu, uyarı beyne ulaştığında algılanır.", "Omurilikten verilen tepki daha kısa yoldan geldiği için önce el çekilir, sonra acı hissedilir."],
          { kural: "Refleks: istemsiz, hızlı, düşünmeden. Duyuların algılanması ise beyinde olur." }),
        Q("fden.sinir", "transfer", 2, "Bir bisiklet kazasında başını yere çarpan bir kişinin dengesinde ve hareketlerini uyumlu yapmasında sorun başlamıştır. Hangi bölüm zarar görmüş olabilir?", "Beyincik",
          [["Omurilik soğanı", "bilgi", "Omurilik soğanı zarar görseydi solunum ve kalp atışı gibi hayati olaylar etkilenirdi."], ["Pankreas", "bilgi", "Pankreas karın bölgesindedir; dengeyle ilgisi yoktur."], ["Tiroit", "bilgi", "Tiroit boyundaki bir bezdir; dengeyi sağlamaz."]],
          "Denge ve hareket uyumu hangi bölümün göreviydi?", ["Kişide denge ve hareket uyumu bozulmuştur.", "Bu görevler beyinciğe aittir.", "Bu yüzden beyincik zarar görmüş olabilir. Kask takmak bu tür yaralanmaları önler."],
          { kural: "Bisiklet ve paten sürerken kask takmak beyni ve beyinciği korur." }),
        Q("fden.sinir", "baglanti", 3, "Göz bir uyarıyı (ör. trafik ışığının kırmızı yanması) aldığında yayaların durması için bilginin izlediği yol hangisidir?", "Göz → duyu siniri → beyin → hareket siniri → bacak kasları",
          [["Göz → beyin → göz", "kavrama", "Durma hareketi kaslarla yapılır; emir kaslara iletilmelidir."], ["Göz → omurilik → beyincik → göz", "bilgi", "Kırmızı ışıkta durmak düşünerek verilen bir karardır; beyin görev yapar."], ["Bacak kasları → beyin → göz", "dikkat", "Yolu ters yazdın; uyarı gözden başlar, tepki kaslarla biter."]],
          "Bu bir refleks mi, yoksa düşünerek verilen bir karar mı?", ["Göz uyarıyı alır; duyu siniri bilgiyi beyne taşır.", "Kırmızı ışığın anlamını bilip durmaya karar veren beyindir.", "Beyin emri hareket sinirleriyle bacak kaslarına gönderir ve yaya durur."],
          { kural: "İstemli hareketlerde karar beyinde, reflekslerde çoğunlukla omurilikte verilir." }),
      ],
      "fden.hormon": [
        Q("fden.hormon", "hatirlama", 1, "Şekilde iç salgı bezlerinin çalışması gösterilmiştir. Bezlerin ürettiği ve kan yoluyla vücuda taşınan, soru işaretiyle gösterilen maddelere ne ad verilir?", "Hormon",
          [["Enzim", "bilgi", "Enzimler sindirim gibi olaylarda görev alır; iç salgı bezlerinin kana verdiği maddeler hormondur."], ["Sinir", "kavrama", "Sinirler yapıdır, salgılanan madde değildir."], ["Polen", "bilgi", "Polen çiçekli bitkilerin erkek organında üretilir."]],
          "İnsülin ve adrenalin bu maddelere örnektir.", ["İç salgı bezleri ürettikleri maddeleri doğrudan kana verir.", "Bu maddeler kanla taşınarak vücuttaki olayları düzenler.", "Bu maddelere hormon denir (ör. insülin, adrenalin, büyüme hormonu)."],
          { gorsel: akis(["İç salgı|bezi", "?", "Kan", "Hedef|organ"], "hormonların taşınması"), kural: "Hormon: iç salgı bezlerinden kana verilen, düzenleyici madde." }),
        Q("fden.hormon", "uygulama", 2, "Tabloda iç salgı bezleri ve görevleri verilmiştir. Hangi eşleştirme <b>yanlıştır</b>?", "Tiroit – Kan şekerini düzenler",
          [["Hipofiz – Büyüme hormonunu salgılar", "bilgi", "Bu eşleştirme doğrudur; büyüme hormonu hipofizden salgılanır."], ["Böbrek üstü – Adrenalin salgılar", "bilgi", "Bu eşleştirme doğrudur."], ["Eşey bezleri – Ergenlik özelliklerini oluşturur", "bilgi", "Bu eşleştirme doğrudur."]],
          "Kan şekerini düzenleyen insülin hangi bezden salgılanır?", ["Hipofiz, böbrek üstü ve eşey bezleri doğru eşleştirilmiştir.", "Kan şekerini insülin ve glukagon ile pankreas düzenler.", "Tiroit metabolizma hızını düzenler. Yanlış eşleştirme: “tiroit – kan şekerini düzenler”."],
          { gorsel: G.tablo(["Bez", "Görev"], [["Hipofiz", "Büyüme hormonunu salgılar"], ["Tiroit", "Kan şekerini düzenler"], ["Böbrek üstü", "Adrenalin salgılar"], ["Eşey bezleri", "Ergenlik özelliklerini oluşturur"]]), kural: "Kan şekeri: pankreas. Metabolizma hızı: tiroit. Büyüme hormonu: hipofiz. Adrenalin: böbrek üstü." }),
        Q("fden.hormon", "aciklama", 2, "Pankreastan salgılanan insülin hormonu yeterince üretilmezse ne olur?", "Kan şekeri yükselir ve şeker hastalığı (diyabet) görülebilir.",
          [["Boyunda şişlik (guatr) oluşur.", "bilgi", "Guatr, tiroit bezinin iyot eksikliğiyle ilgilidir."], ["Kan şekeri çok düşer.", "kavrama", "İnsülin kan şekerini düşürür; eksik olursa şeker düşmez, yükselir."], ["Kalp atışı hızlanır.", "bilgi", "Kalp atışını hızlandıran hormon adrenalindir."]],
          "İnsülinin görevi kan şekerini düşürmek mi, yükseltmek mi?", ["İnsülin, kandaki şekerin hücrelere geçmesini sağlayarak kan şekerini düşürür.", "İnsülin yetersizse şeker kanda birikir, kan şekeri yükselir.", "Bu durum şeker hastalığı (diyabet) olarak adlandırılır."],
          { kural: "İnsülin kan şekerini düşürür, glukagon yükseltir; ikisi de pankreastan salgılanır." }),
        Q("fden.hormon", "transfer", 2, "Gece karanlık bir sokakta aniden havlayan bir köpekle karşılaşan Can'ın kalbi hızla çarpmaya, nefesi sıklaşmaya başlıyor. Bu değişikliklere en çok hangi hormon neden olur?", "Adrenalin",
          [["İnsülin", "bilgi", "İnsülin kan şekerini düşürür; korku anındaki hızlanmayı sağlamaz."], ["Büyüme hormonu", "bilgi", "Büyüme hormonu boy uzaması ve büyümeyle ilgilidir."], ["Glukagon", "bilgi", "Glukagon kan şekerini yükseltir; kalp atışını hızlandıran asıl hormon değildir."]],
          "Korku ve heyecan anlarında salgılanan hormonu düşün.", ["Can korku ve heyecan yaşamaktadır.", "Böbrek üstü bezlerinden adrenalin salgılanır.", "Adrenalin kalp atışını ve solunumu hızlandırarak vücudu tehlikeye hazırlar."],
          { kural: "Adrenalin: korku, heyecan, stres hormonu (böbrek üstü bezleri)." }),
        Q("fden.hormon", "transfer", 3, "Denizden uzak bazı bölgelerde yaşayan insanlarda boyunda şişlik daha sık görülmüştür. Bunu önlemek için hangisi önerilir?", "İyotlu tuz kullanmak",
          [["Şeker tüketimini artırmak", "kavrama", "Şeker tüketimi iyot ihtiyacını karşılamaz."], ["Daha az su içmek", "kavrama", "Su tüketimini azaltmak guatrı önlemez, sağlığa da zararlıdır."], ["Tuzu tamamen kesmek", "strateji", "Sorun iyot eksikliğidir; çözüm iyotlu tuzu ölçülü kullanmaktır."]],
          "Deniz ürünlerinde ve iyotlu tuzda bulunan madde hangisidir?", ["Boyunda şişlik (guatr), tiroit bezinin iyot eksikliğiyle ilgilidir.", "Denizden uzak bölgelerde besinlerle alınan iyot az olabilir.", "İyotlu tuz kullanmak tiroit bezinin ihtiyaç duyduğu iyotu sağlar."],
          { kural: "Tiroit hormonu üretimi için iyot gerekir; iyot eksikliği guatra yol açabilir." }),
        Q("fden.hormon", "baglanti", 3, "Sinir sistemi ile iç salgı sisteminin karşılaştırıldığı ifadelerden hangisi doğrudur?", "Sinirlerin etkisi hızlı ve kısa süreli, hormonların etkisi daha yavaş ve uzun sürelidir.",
          [["Hormonlar sinirlerden daha hızlı etki eder.", "kavrama", "Hormonlar kanla taşındığı için etkileri daha yavaş başlar."], ["İki sistem birbirinden habersiz çalışır.", "kavrama", "Hipofiz beyinle bağlantılıdır; iki sistem birlikte çalışır."], ["Hormonlar sinirler aracılığıyla taşınır.", "bilgi", "Hormonlar kan yoluyla taşınır."]],
          "Elini sobadan çekmek mi hızlıdır, ergenlikte boyun uzaması mı?", ["Sinir sistemi uyarıları sinirlerle saniyenin kesirleri içinde iletir.", "Hormonlar kana karışıp vücuda dağılır; etkileri daha yavaş başlar ama uzun sürer.", "İki sistem birlikte çalışarak vücudun düzenini sağlar."],
          { kural: "Sinir sistemi: hızlı, kısa süreli. İç salgı sistemi: yavaş, uzun süreli. İkisi birlikte denetleyici ve düzenleyici sistemdir." }),
      ],
      "fden.ergenlik": [
        Q("fden.ergenlik", "hatirlama", 1, "Çocukluktan yetişkinliğe geçiş dönemine ne ad verilir?", "Ergenlik",
          [["Bebeklik", "bilgi", "Bebeklik doğumdan sonraki ilk dönemdir."], ["Yaşlılık", "bilgi", "Yaşlılık yetişkinlikten sonraki dönemdir."], ["Başkalaşım", "kavrama", "Başkalaşım kurbağa, kelebek gibi canlıların geçirdiği evrelerdir; insanda görülmez."]],
          "Bu dönemde eşey bezleri çalışmaya başlar.", ["Çocukluk ile yetişkinlik arasında vücutta hızlı değişimler olur.", "Bu değişimleri eşey bezlerinin hormonları başlatır.", "Bu geçiş dönemine ergenlik denir."],
          { kural: "Ergenlikte hipofiz eşey bezlerini uyarır; vücutta ve duygularda değişimler başlar." }),
        Q("fden.ergenlik", "aciklama", 2, "Aşağıdakilerden hangisi ergenlik döneminde görülen bir değişiklik <b>değildir</b>?", "Kalbin atmayı bırakıp yeniden başlaması",
          [["Boyun hızla uzaması", "bilgi", "Ergenlikte boy hızla uzar."], ["Terlemenin ve sivilcelerin artması", "bilgi", "Ter ve yağ bezleri daha çok çalışır; bu ergenlikte sık görülür."], ["Duygu durumunda sık değişimler", "bilgi", "Ergenlikte duygusal değişimler normaldir."]],
          "Diğer seçenekler ergenlikte görülen bilinen değişimlerdir.", ["Ergenlikte boy uzar, ter ve sivilce artar, duygusal değişimler görülür.", "Kalp ise yaşam boyu düzenli çalışır; durup yeniden başlaması ergenlik değişikliği değildir.", "Doğru cevap: kalbin atmayı bırakıp yeniden başlaması."],
          { kural: "Ergenlik değişiklikleri: boy uzaması, terleme, sivilce, kıllanma, ses değişimi (erkeklerde), göğüs gelişimi ve adet (kızlarda), duygusal değişimler." }),
        Q("fden.ergenlik", "uygulama", 2, "Tabloda iki öğrencinin günlük alışkanlıkları verilmiştir. Hangi öğrenci denetleyici sistemlerinin sağlığı için daha doğru davranmaktadır ve neden?", "Elif; çünkü yeterli uyur, dengeli beslenir ve kask kullanır.",
          [["Mert; çünkü daha geç saatte uyuyor.", "kavrama", "Geç yatmak uykuyu azaltır; büyüme hormonu uykuda daha çok salgılanır."], ["Mert; çünkü enerji içeceği içiyor.", "kavrama", "Enerji içecekleri uykuyu bozabilir ve kalbi yorabilir."], ["İkisi de aynı ölçüde doğru davranıyor.", "dikkat", "Tablodaki alışkanlıkları tek tek karşılaştır; aralarında büyük farklar var."]],
          "Uyku, beslenme ve korunma alışkanlıklarını karşılaştır.", ["Elif 9 saat uyuyor, dengeli besleniyor, bisiklette kask takıyor.", "Mert geç uyuyor, enerji içeceği içiyor, kask takmıyor.", "Yeterli uyku, dengeli beslenme ve kask kullanımı sinir sistemini ve hormonların düzenini korur. Cevap: Elif."],
          { gorsel: G.tablo(["Alışkanlık", "Elif", "Mert"], [["Uyku", "22.00 – 07.00", "01.00 – 07.00"], ["Akşam içeceği", "Süt", "Enerji içeceği"], ["Bisiklet sürerken", "Kask takar", "Kask takmaz"]]), kural: "Sağlık için: yeterli uyku, dengeli beslenme, spor, kask, zararlı alışkanlıklardan uzak durmak." }),
        Q("fden.ergenlik", "aciklama", 2, "Uzmanlar büyüme çağındaki çocukların gece düzenli ve yeterli uyumasını önerir. Bunun nedeni aşağıdakilerden hangisidir?", "Büyüme hormonu uykuda daha çok salgılanır.",
          [["Uyurken beyin tamamen çalışmayı durdurur.", "kavrama", "Uyurken de beyin ve omurilik soğanı çalışmaya devam eder."], ["Uyku sırasında insülin hiç salgılanmaz.", "bilgi", "Bu bilgi yanlıştır ve öneriyle ilgisi yoktur."], ["Uyku adrenalin miktarını artırır.", "bilgi", "Dinlendirici uyku adrenalin artışıyla ilgili değildir."]],
          "Hipofizin salgıladığı hangi hormon büyümeyi sağlar?", ["Büyüme hormonu hipofizden salgılanır.", "Bu hormon özellikle gece derin uykuda daha çok salgılanır.", "Yeterli uyku, büyümeyi ve sinir sisteminin dinlenmesini destekler."],
          { kural: "Düzenli uyku: büyüme hormonu, dikkat ve hafıza için gereklidir." }),
        Q("fden.ergenlik", "transfer", 3, "Bir öğrenci, ergenlikte sesi kalınlaşan ve boyu hızla uzayan bir arkadaşıyla alay edildiğini görüyor. Bilimsel olarak en doğru tutum hangisidir?", "Bu değişikliklerin hormonlara bağlı ve herkeste görülebilen normal değişiklikler olduğunu açıklamak",
          [["Arkadaşının hasta olduğunu söylemek", "bilgi", "Ergenlik değişiklikleri hastalık değil, normal bir gelişim sürecidir."], ["Bu değişikliklerin yalnızca erkeklerde görüldüğünü söylemek", "bilgi", "Ergenlik kızlarda da görülür; kızlarda genellikle daha erken başlar."], ["Değişikliklerin yanlış beslenmeden kaynaklandığını söylemek", "kavrama", "Bu değişiklikleri eşey bezlerinden salgılanan hormonlar başlatır."]],
          "Ergenlik değişikliklerini ne başlatır?", ["Ergenlikte hipofiz eşey bezlerini uyarır.", "Eşey bezlerinin hormonları sesin kalınlaşması, boy uzaması gibi değişikliklere yol açar.", "Bu değişiklikler normaldir; herkes farklı zamanda yaşayabilir. Alay etmek yerine doğru bilgiyi paylaşmak gerekir."],
          { kural: "Ergenlik değişiklikleri normaldir; zamanı kişiden kişiye değişebilir." }),
        Q("fden.ergenlik", "baglanti", 2, "Ergenlik döneminde eşey bezlerinin çalışmaya başlaması, üreme konusundaki hangi bilgiyle ilişkilidir?", "İnsanların eşeyli ürediği ve üreme hücrelerinin eşey bezlerinde oluştuğu",
          [["İnsanların bölünerek ürediği", "bilgi", "Bölünme tek hücreli canlılarda görülen eşeysiz üremedir."], ["İnsanların başkalaşım geçirdiği", "bilgi", "İnsan doğrudan gelişme gösterir."], ["İnsanların sporla ürediği", "bilgi", "Sporla üreme mantarlar gibi canlılarda görülür."]],
          "Yumurta ve sperm nerede üretilir?", ["İnsanlar eşeyli ürer; yumurta yumurtalıklarda, sperm testislerde oluşur.", "Yumurtalık ve testisler eşey bezleridir.", "Ergenlikte bu bezlerin çalışmaya başlaması üremeye hazırlığın bir parçasıdır."],
          { gorsel: akis(["Hipofiz", "Eşey|bezleri", "Hormonlar", "Ergenlik|değişiklikleri"], "ergenliğin başlaması"), kural: "Eşey bezleri hem hormon hem de üreme hücresi üretir." }),
      ],
    },
  });

  /* ===================== 3) IŞIĞIN YANSIMASI VE AYNALAR ===================== */
  const ACILAR = [20, 25, 35, 40, 50, 55, 65, 70];
  KONU_EKLE("fen", {
    id: "f_yansima", tema: "f4", ad: "Işığın Yansıması ve Aynalar",
    kazanimlar: [
      { id: "fyan.kanun", ad: "Yansıma kanunlarını açıklama ve gelme-yansıma açılarını belirleme" },
      { id: "fyan.tur", ad: "Düzgün ve dağınık yansımayı karşılaştırma" },
      { id: "fyan.ayna", ad: "Düz, çukur ve tümsek aynaların özelliklerini ve kullanım alanlarını açıklama" },
    ],
    anlatim: [
      { baslik: "Işığın yansıması",
        metin: "Işık bir yüzeye çarpıp geldiği ortama geri döner. Bu olaya <b>yansıma</b> denir.<br>Yüzeye gelen ışına <b>gelen ışın</b>, yüzeyden geri dönen ışına <b>yansıyan ışın</b>, ışının çarptığı noktada yüzeye dik çizilen çizgiye <b>normal</b> denir.<br>Gelen ışın ile normal arasındaki açı <b>gelme açısı</b>, yansıyan ışın ile normal arasındaki açı <b>yansıma açısıdır</b>.<br><b>Yansıma kanunları:</b> 1) Gelme açısı yansıma açısına eşittir. 2) Gelen ışın, normal ve yansıyan ışın aynı düzlemdedir.",
        ornek: "Gelme açısı 35° ise yansıma açısı da 35° olur. Açılar yüzeyden değil, <b>normalden</b> ölçülür.",
        gorsel: yansima(40),
        durak: { soru: "Bir ışın düz aynaya normalle 30° açı yaparak geliyor. Yansıma açısı kaç derecedir?", secenekler: [["30°", true, "Gelme açısı yansıma açısına eşittir."], ["60°", false, "60°, ışının ayna yüzeyiyle yaptığı açıdır; açılar normalden ölçülür."], ["90°", false, "90°, normalin aynayla yaptığı açıdır."], ["15°", false, "Açı yarıya inmez; gelme ve yansıma açıları eşittir."]] } },
      { baslik: "Düzgün ve dağınık yansıma",
        metin: "<b>Düzgün yansıma:</b> Ayna, durgun su, cilalı metal gibi <b>pürüzsüz</b> yüzeylerde paralel gelen ışınlar paralel yansır. Bu yüzeylerde görüntü oluşur.<br><b>Dağınık yansıma:</b> Kâğıt, duvar, kumaş, tahta gibi <b>pürüzlü</b> yüzeylerde paralel gelen ışınlar farklı yönlere yansır. Görüntü oluşmaz ama cisimleri her yönden görebiliriz.<br>Her iki yansımada da her ışın için <b>gelme açısı = yansıma açısı</b> kuralı geçerlidir; yalnızca yüzeyin her noktasında normalin yönü farklıdır.",
        ornek: "Sınıftaki herkesin tahtadaki yazıyı görebilmesi dağınık yansıma sayesindedir.",
        durak: { soru: "Hangisinde düzgün yansıma olur?", secenekler: [["Rüzgârsız bir günde göl yüzeyi", true, "Durgun su pürüzsüzdür; görüntü oluşturur."], ["Defter sayfası", false, "Kâğıt pürüzlüdür; dağınık yansıma yapar."], ["Boyalı duvar", false, "Duvar yüzeyi pürüzlüdür; dağınık yansıma olur."], ["Pamuklu kumaş", false, "Kumaş pürüzlüdür; görüntü oluşmaz."]] } },
      { baslik: "Düz aynada görüntü",
        metin: "Düz aynada oluşan görüntünün özellikleri:<br>• Görüntü <b>düzdür</b> (baş aşağı değildir).<br>• Görüntünün boyu <b>cismin boyuna eşittir</b>.<br>• Görüntünün aynaya uzaklığı, <b>cismin aynaya uzaklığına eşittir</b>.<br>• Görüntüde <b>sağ ve sol yer değiştirmiş</b> görünür.",
        ornek: "Aynadan 2 m uzakta duran kişinin görüntüsü aynanın 2 m arkasında görünür; kişi ile görüntüsü arası 4 m'dir. Ambulansların önüne “AMBULANS” yazısı ters yazılır ki öndeki sürücü dikiz aynasında doğru okusun.",
        gorsel: aynaUzaklik(2),
        durak: { soru: "Düz aynanın 3 m önünde duran bir çocuk ile görüntüsü arasındaki uzaklık kaç metredir?", secenekler: [["6 m", true, "Görüntü aynanın 3 m arkasındadır: 3 + 3 = 6 m."], ["3 m", false, "3 m, çocuğun aynaya uzaklığıdır; görüntü de aynanın 3 m arkasındadır."], ["1,5 m", false, "Uzaklık yarıya inmez; görüntü aynanın arkasında aynı uzaklıktadır."], ["9 m", false, "Uzaklıkları üç kez topladın; iki uzaklık toplanmalı."]] } },
      { baslik: "Çukur ve tümsek aynalar",
        metin: "<b>Çukur ayna:</b> Yansıtıcı yüzeyi içe doğru kavislidir. Yakındaki cisimlerin görüntüsünü büyük gösterir; ışınları bir noktada toplayabilir.<br>Kullanım: diş hekimi aynası, makyaj ve tıraş aynası, el feneri ve araba farları, güneş ocakları, teleskoplar.<br><b>Tümsek ayna:</b> Yansıtıcı yüzeyi dışa doğru kavislidir. Görüntü küçük ve düzdür, <b>görüş alanı geniştir</b>.<br>Kullanım: araçların yan dikiz aynaları, kavşak ve viraj aynaları, mağaza ve otopark güvenlik aynaları.",
        ornek: "Kaşığın iç yüzeyi çukur, dış yüzeyi tümsek ayna gibi davranır.",
        durak: { soru: "Görüşün az olduğu virajlara konulan trafik aynası hangi tür aynadır?", secenekler: [["Tümsek ayna", true, "Tümsek ayna geniş bir alanı gösterir."], ["Çukur ayna", false, "Çukur ayna yakındaki cismi büyütür; geniş alan göstermez."], ["Düz ayna", false, "Düz aynanın görüş alanı tümsek aynaya göre dardır."], ["Prizma", false, "Prizma ayna değildir; ışığı renklerine ayırır."]] } },
    ],
    uret: {
      "fyan.kanun": [
        z => { const i = sec(ACILAR);
          return S({ kaz: "fyan.kanun", duzey: "uygulama", zorluk: 1, soru: `Şekildeki ışın düz aynaya normalle ${i}° açı yaparak geliyor. Yansıma açısı kaç derecedir?`, gorsel: yansima(i),
            dogru: i + "°", yanlis: [[(90 - i) + "°", "kavrama", "Bu, ışının ayna yüzeyiyle yaptığı açıdır; yansıma açısı normalden ölçülür."], [(2 * i) + "°", "islem", "Bu, gelen ve yansıyan ışın arasındaki açıdır; yansıma açısı onun yarısıdır."], [(180 - 2 * i) + "°", "islem", "Yansıma açısı gelme açısına eşittir; açıları çıkarmana gerek yok."]],
            ipucu: "Gelme açısı ile yansıma açısı arasındaki ilişkiyi hatırla.", cozum: [`Verilen: gelme açısı ${i}° (normalle ölçülmüş).`, "Yansıma kanununa göre gelme açısı = yansıma açısı.", `Yansıma açısı ${i}° olur.`], kural: "Gelme açısı = yansıma açısı. Açılar normalden ölçülür." }); },
        z => { const i = sec(ACILAR), a = 90 - i;
          return S({ kaz: "fyan.kanun", duzey: "uygulama", zorluk: 2, soru: `Şekildeki ışın, <b>ayna yüzeyiyle</b> ${a}° açı yapacak şekilde geliyor. Yansıma açısı kaç derecedir?`, gorsel: yansima(i, { mod: "yuzey" }),
            dogru: i + "°", yanlis: [[a + "°", "dikkat", "Verilen açı yüzeyle yapılan açıdır; açılar normalden ölçülmelidir."], [(2 * a) + "°", "kavrama", "Yüzeyle yapılan açıyı iki katına çıkarmak yansıma açısını vermez."], [(180 - a) + "°", "islem", "Normal yüzeye diktir; 180° değil 90°'den çıkarmalısın."]],
            ipucu: "Normal, ayna yüzeyine diktir (90°).", cozum: [`Işın ayna yüzeyiyle ${a}° açı yapıyor.`, `Normal yüzeye dik olduğundan gelme açısı = 90° − ${a}° = ${i}°.`, `Gelme açısı = yansıma açısı, yani ${i}°.`], kural: "Yüzeyle yapılan açı verilirse: gelme açısı = 90° − o açı." }); },
        z => { const i = sec(ACILAR), t = 2 * i;
          return S({ kaz: "fyan.kanun", duzey: "uygulama", zorluk: 2, soru: `Düz aynaya gelen ışın ile yansıyan ışın arasındaki açı ${t}°'dir. Gelme açısı kaç derecedir?`, gorsel: yansima(i, { mod: "arasi" }),
            dogru: i + "°", yanlis: [[t + "°", "kavrama", "Bu, iki ışın arasındaki açının tamamıdır; normal bu açıyı ikiye böler."], [(90 - i) + "°", "islem", "Bu, ışının ayna yüzeyiyle yaptığı açıdır."], [(180 - t) + "°", "islem", "Açıyı 180°'den çıkarmak gerekmez; iki eş parçaya bölmelisin."]],
            ipucu: "Normal, gelen ve yansıyan ışın arasındaki açıyı iki eşit parçaya böler.", cozum: [`İki ışın arasındaki açı ${t}°.`, "Gelme açısı = yansıma açısı olduğundan normal bu açıyı ikiye böler.", `Gelme açısı = ${t}° ÷ 2 = ${i}°.`], kural: "Gelen ve yansıyan ışın arasındaki açı = 2 × gelme açısı." }); },
        z => { const i = sec(ACILAR), a = 90 - i;
          return S({ kaz: "fyan.kanun", duzey: "uygulama", zorluk: 3, soru: `Bir ışın düz aynaya, ayna yüzeyiyle ${a}° açı yapacak şekilde geliyor. Gelen ışın ile yansıyan ışın arasındaki açı kaç derecedir?`,
            dogru: (2 * i) + "°", yanlis: [[i + "°", "strateji", "Bu yalnızca gelme açısıdır; iki ışın arasındaki açı gelme ve yansıma açılarının toplamıdır."], [(2 * a) + "°", "kavrama", "Yüzeyle yapılan açıları topladın; açıları normalden ölçmelisin."], [a + "°", "dikkat", "Bu, soruda verilen ve yüzeyle yapılan açıdır."]],
            ipucu: "Önce gelme açısını normale göre bul.", cozum: [`Gelme açısı = 90° − ${a}° = ${i}°.`, `Yansıma açısı da ${i}°.`, `Gelen ve yansıyan ışın arası = ${i}° + ${i}° = ${2 * i}°.`], kural: "Gelen ve yansıyan ışın arasındaki açı = gelme açısı + yansıma açısı." }); },
        Q("fyan.kanun", "hatirlama", 1, "Yansıma olayında ışının çarptığı noktada yüzeye dik olarak çizilen çizgiye ne ad verilir?", "Normal",
          [["Gelen ışın", "bilgi", "Gelen ışın yüzeye doğru gelen ışındır."], ["Yansıyan ışın", "bilgi", "Yansıyan ışın yüzeyden geri dönen ışındır."], ["Ayna yüzeyi", "kavrama", "Normal, ayna yüzeyine diktir; yüzeyin kendisi değildir."]],
          "Şekildeki kesikli çizgiyi düşün.", ["Işın yüzeye bir noktada çarpar.", "Bu noktada yüzeye dik (90°) çizilen hayalî çizgiye normal denir.", "Gelme ve yansıma açıları bu çizgiye göre ölçülür."],
          { gorsel: yansima(35, { mod: "yok" }), kural: "Normal: yüzeye dik çizilen hayalî çizgi." }),
        Q("fyan.kanun", "aciklama", 2, "Bir ışın düz aynaya dik olarak (normal doğrultusunda) gelirse ne olur?", "Geldiği yol boyunca geri yansır.",
          [["Ayna yüzeyine paralel yansır.", "kavrama", "Gelme açısı 0° olduğundan yansıma açısı da 0°'dir; ışın normal üzerinde döner."], ["Yansımaz, aynadan geçer.", "bilgi", "Ayna ışığı geçirmez, yansıtır."], ["45° ile yansır.", "islem", "Gelme açısı 0° iken yansıma açısı 45° olamaz; ikisi eşittir."]],
          "Işın normal üzerinden geliyorsa gelme açısı kaç derecedir?", ["Işın aynaya dik gelirse normal ile arasındaki açı 0°'dir.", "Yansıma açısı da 0° olur.", "Işın normal üzerinden, yani geldiği yoldan geri döner."],
          { kural: "Dik gelen ışın kendi üzerinden geri yansır (gelme açısı = yansıma açısı = 0°)." }),
        Q("fyan.kanun", "baglanti", 2, "Işığın yansımasını çizerken ışınları neden düz çizgilerle gösteririz?", "Çünkü ışık aynı ortamda doğrusal yolla yayılır.",
          [["Çünkü ışık yalnızca aynalarda düz gider.", "kavrama", "Işık her türdeş (aynı) ortamda doğrusal yayılır, yalnızca aynalarda değil."], ["Çünkü ışık eğri yollarla yayılır ama çizmesi zordur.", "bilgi", "Işık aynı ortamda eğri değil, doğrusal yayılır."], ["Çünkü ışık sesten yavaştır.", "bilgi", "Işık sesten çok daha hızlıdır ve bu, düz çizilmesinin nedeni değildir."]],
          "Gölgelerin oluşmasını açıklayan özelliği hatırla.", ["Işık aynı ortamda doğrular boyunca yayılır.", "Bu yüzden gelen ve yansıyan ışınları ok uçlu düz çizgilerle gösteririz.", "Gölge oluşumu da ışığın doğrusal yayılmasının bir sonucudur."],
          { kural: "Işık aynı ortamda doğrusal yayılır; ışınlar ok uçlu doğrularla gösterilir." }),
      ],
      "fyan.tur": [
        Q("fyan.tur", "hatirlama", 1, "Şekilde paralel ışınlar bir yüzeyden farklı yönlere yansıyor. Bu yansıma türü ve yüzey için hangisi doğrudur?", "Dağınık yansıma – pürüzlü yüzey",
          [["Düzgün yansıma – pürüzsüz yüzey", "kavrama", "Düzgün yansımada paralel gelen ışınlar paralel yansır."], ["Düzgün yansıma – pürüzlü yüzey", "bilgi", "Pürüzlü yüzeylerde düzgün yansıma olmaz."], ["Dağınık yansıma – pürüzsüz yüzey", "dikkat", "Yansıma türü doğru ama yüzey pürüzlüdür."]],
          "Yansıyan ışınlar paralel mi?", ["Paralel gelen ışınlar farklı yönlere yansımış.", "Bu, dağınık yansımadır.", "Dağınık yansıma pürüzlü yüzeylerde (kâğıt, duvar) olur."],
          { gorsel: (() => { let ic = `<path class="g-yumusak g-cizgi" d="M30 160 L70 150 L110 165 L150 148 L190 162 L230 150 L270 164 L310 149 L350 160 L390 152 L430 160 L430 180 L30 180 Z"/>`;
            [[90, 158, 40], [190, 162, -20], [290, 158, 70], [390, 154, 10]].forEach(([x, y, d]) => { ic += `<line class="g-cizgi" x1="${x - 60}" y1="30" x2="${x}" y2="${y}" stroke-width="2"/>` + G.ok(x, y, x + d, y - 100); });
            return G.svg(460, 190, ic, "pürüzlü yüzeyde yansıma"); })(), kural: "Pürüzlü yüzey → dağınık yansıma; pürüzsüz yüzey → düzgün yansıma." }),
        Q("fyan.tur", "aciklama", 2, "Dağınık yansıma için aşağıdakilerden hangisi doğrudur?", "Her ışın için gelme açısı yansıma açısına eşittir.",
          [["Dağınık yansımada yansıma kanunları geçerli değildir.", "kavrama", "Yansıma kanunları her yansımada geçerlidir; yüzeydeki normaller farklı yönde olduğu için ışınlar dağılır."], ["Dağınık yansımada net görüntü oluşur.", "bilgi", "Net görüntü düzgün yansımada oluşur."], ["Dağınık yansıma yalnızca aynalarda olur.", "bilgi", "Aynalar düzgün yansıma yapar."]],
          "Pürüzlü yüzeyde her küçük parça minicik bir ayna gibidir.", ["Pürüzlü yüzeyin her noktasında normal farklı yöndedir.", "Her ışın kendi normaline göre gelme açısı = yansıma açısı kuralıyla yansır.", "Normaller farklı olduğu için ışınlar farklı yönlere dağılır."],
          { kural: "Düzgün ve dağınık yansımanın ikisinde de yansıma kanunları geçerlidir." }),
        Q("fyan.tur", "uygulama", 1, "Aşağıdaki yüzeylerden hangisinde düzgün yansıma gerçekleşir?", "Cilalı metal tepsi",
          [["Ahşap masa (cilasız)", "bilgi", "Cilasız ahşap pürüzlüdür; dağınık yansıma yapar."], ["Gazete kâğıdı", "bilgi", "Kâğıt pürüzlüdür; dağınık yansıma yapar."], ["Halı", "bilgi", "Halı pürüzlüdür; dağınık yansıma yapar."]],
          "Hangisinde yüzünü görebilirsin?", ["Düzgün yansıma pürüzsüz ve parlak yüzeylerde olur.", "Cilalı metal tepsi pürüzsüzdür; yüzümüzü görebiliriz.", "Diğer yüzeyler pürüzlü olduğu için dağınık yansıma yapar."],
          { kural: "Görüntü oluşuyorsa düzgün yansıma vardır." }),
        Q("fyan.tur", "uygulama", 2, "Tabloda bazı yüzeyler verilmiştir. Kaç tanesinde dağınık yansıma olur?", "3",
          [["2", "dikkat", "Tablodaki pürüzlü yüzeylerin hepsini saymadın; tahta da pürüzlüdür."], ["4", "kavrama", "Durgun su ve ayna pürüzsüzdür; düzgün yansıma yapar."], ["5", "kavrama", "Tüm yüzeyleri saydın; pürüzsüz olanları çıkarmalısın."]],
          "Her yüzey için “pürüzlü mü, pürüzsüz mü?” diye sor.", ["Pürüzsüz: ayna, durgun su → düzgün yansıma.", "Pürüzlü: tahta, kumaş, kâğıt → dağınık yansıma.", "Dağınık yansıma yapan yüzey sayısı 3'tür."],
          { gorsel: G.tablo(["Yüzey"], [["Ayna"], ["Tahta"], ["Durgun su"], ["Kumaş"], ["Kâğıt"]]), kural: "Ayna, durgun su, cam, cilalı metal: düzgün. Kâğıt, duvar, kumaş, tahta: dağınık." }),
        Q("fyan.tur", "transfer", 2, "Sinema perdeleri ve sınıf tahtaları neden parlak ayna gibi değil de mat (pürüzlü) yapılır?", "Dağınık yansıma sayesinde salondaki herkes görüntüyü her yönden görebilsin diye",
          [["Daha çok ışık soğursun diye", "kavrama", "Amaç ışığı soğurmak değil, her yöne yansıtmaktır."], ["Görüntünün sağ-sol ters görünmesi için", "kavrama", "Sağ-sol ters görünme düz aynada olur; perdenin amacı bu değildir."], ["Işığın yansımasını tamamen engellemek için", "bilgi", "Perde ışığı yansıtmasaydı görüntüyü göremezdik."]],
          "Parlak yüzeyde ışık yalnızca tek yöne yansır.", ["Parlak yüzeyde düzgün yansıma olur; ışık tek yöne gider ve parlama yapar.", "Mat yüzeyde dağınık yansıma olur; ışık her yöne yayılır.", "Böylece salondaki herkes perdeyi ya da tahtayı rahatça görebilir."],
          { kural: "Dağınık yansıma, cisimleri farklı yönlerden görebilmemizi sağlar." }),
        Q("fyan.tur", "transfer", 3, "Rüzgârsız bir günde göl yüzeyinde ağaçların net görüntüsü görülürken, rüzgârlı bir günde görüntü bozulur. Bunun nedeni nedir?", "Dalgalanan su yüzeyi pürüzlü hâle gelir ve ışık farklı yönlere yansır.",
          [["Rüzgâr ışığın yayılmasını engeller.", "kavrama", "Rüzgâr ışığı engellemez; değişen su yüzeyidir."], ["Rüzgârlı günde su ışığı yansıtmaz.", "bilgi", "Dalgalı su da ışığı yansıtır, ama dağınık biçimde."], ["Rüzgârlı günde yansıma kanunları geçersiz olur.", "kavrama", "Yansıma kanunları her zaman geçerlidir."]],
          "Durgun su ile dalgalı suyun yüzeyini karşılaştır.", ["Durgun su pürüzsüzdür, düzgün yansıma yapar ve net görüntü oluşur.", "Rüzgâr dalgalar oluşturur; yüzey pürüzlü olur.", "Işınlar farklı yönlere yansır (dağınık yansıma), görüntü bozulur."],
          { kural: "Aynı madde, yüzeyi pürüzlü hâle gelince dağınık yansıma yapar." }),
      ],
      "fyan.ayna": [
        z => { const d = sec([1, 2, 3, 4, 5, 6]);
          return S({ kaz: "fyan.ayna", duzey: "uygulama", zorluk: 1, soru: `Bir öğrenci düz aynanın ${d} m önünde duruyor. Öğrenci ile görüntüsü arasındaki uzaklık kaç metredir?`, gorsel: aynaUzaklik(d, { gizle: true }),
            dogru: 2 * d + " m", yanlis: [[d + " m", "kavrama", "Bu, öğrencinin aynaya uzaklığıdır; görüntü de aynanın arkasında aynı uzaklıktadır."], [od(d / 2) + " m", "kavrama", "Görüntü aynanın önünde değil, arkasında görünür."], [3 * d + " m", "islem", "Uzaklığı iki kez almalısın, üç kez değil."]],
            ipucu: "Görüntü, aynanın arkasında cisimle aynı uzaklıkta görünür.", cozum: [`Öğrencinin aynaya uzaklığı ${d} m.`, `Görüntünün aynaya uzaklığı da ${d} m.`, `Öğrenci ile görüntüsü arası: ${d} + ${d} = ${2 * d} m.`], kural: "Düz aynada cismin aynaya uzaklığı = görüntünün aynaya uzaklığı." }); },
        z => { const d = sec([3, 4, 5, 6, 7, 8]), x = R(1, d - 1), y = d - x;
          return S({ kaz: "fyan.ayna", duzey: "uygulama", zorluk: 3, soru: `Düz aynadan ${d} m uzakta duran Zeynep, aynaya doğru ${x} m yürüyor. Zeynep ile görüntüsü arasındaki uzaklık şimdi kaç metredir?`, gorsel: aynaUzaklik(d),
            dogru: 2 * y + " m", yanlis: [[y + " m", "kavrama", "Bu, Zeynep'in aynaya uzaklığıdır; görüntüsü de aynanın arkasında aynı uzaklıktadır."], [2 * d - x + " m", "kavrama", "Zeynep yaklaşırken görüntüsü de aynaya yaklaşır; ikisi arası 2 × " + x + " m azalır."], [2 * d + " m", "dikkat", "Bu, Zeynep yürümeden önceki uzaklıktır."]],
            ipucu: "Önce Zeynep'in aynaya yeni uzaklığını bul.", cozum: [`Yeni uzaklık: ${d} − ${x} = ${y} m.`, `Görüntü de aynanın ${y} m arkasındadır.`, `Zeynep ile görüntüsü arası: ${y} + ${y} = ${2 * y} m.`], kural: "Cisim aynaya x m yaklaşırsa görüntüsü de x m yaklaşır; aradaki uzaklık 2x azalır." }); },
        Q("fyan.ayna", "hatirlama", 1, "Düz aynada oluşan görüntü için hangisi <b>yanlıştır</b>?", "Görüntü cisimden daha küçüktür.",
          [["Görüntü düzdür (baş aşağı değildir).", "bilgi", "Bu doğrudur; düz aynada görüntü düzdür."], ["Görüntünün aynaya uzaklığı cismin aynaya uzaklığına eşittir.", "bilgi", "Bu doğrudur."], ["Görüntüde sağ ve sol yer değiştirmiştir.", "bilgi", "Bu doğrudur; sağ elini kaldırınca görüntü sol elini kaldırıyor gibi görünür."]],
          "Aynadan uzaklaşınca görüntün gerçekten küçülür mü?", ["Düz aynada görüntü düz, sağ-sol ters ve aynı uzaklıktadır.", "Görüntünün boyu cismin boyuna eşittir.", "Bu yüzden “görüntü cisimden küçüktür” ifadesi yanlıştır."],
          { kural: "Düz ayna: görüntü düz, aynı boy, aynı uzaklık, sağ-sol ters." }),
        Q("fyan.ayna", "transfer", 2, "Ambulansların ön kaputunda “AMBULANS” yazısının harfleri ters yazılır. Bunun nedeni nedir?", "Öndeki sürücü yazıyı dikiz aynasında düz okuyabilsin diye",
          [["Yazının daha dikkat çekici görünmesi için", "kavrama", "Asıl neden aynada sağ-sol yer değişimidir."], ["Aynalar görüntüyü baş aşağı gösterdiği için", "bilgi", "Düz aynada görüntü baş aşağı değildir; sağ-sol yer değiştirir."], ["Yazının gece parlaması için", "kavrama", "Harflerin ters yazılması parlamayla ilgili değildir."]],
          "Aynada sağ ve sol ne olur?", ["Aynada görüntünün sağı ve solu yer değiştirir.", "Ters yazılan yazı aynada bir kez daha ters dönünce düz görünür.", "Böylece öndeki sürücü ambulansı dikiz aynasında hemen tanır."],
          { kural: "Düz aynada sağ-sol yer değiştirir; bu yüzden ters yazı aynada düz okunur." }),
        Q("fyan.ayna", "uygulama", 2, "Tablodaki ayna türü – kullanım alanı eşleştirmelerinden hangisi doğrudur?", "Tümsek ayna – Mağaza güvenlik aynası",
          [["Çukur ayna – Kavşak aynası", "bilgi", "Kavşak aynası geniş alan göstermelidir; bu tümsek aynadır."], ["Tümsek ayna – Diş hekimi aynası", "bilgi", "Diş hekimi aynası dişleri büyük gösterir; bu çukur aynadır."], ["Düz ayna – Araba farı", "bilgi", "Araba farlarında ışığı paralel yansıtmak için çukur ayna kullanılır."]],
          "Hangi ayna geniş alan gösterir, hangisi büyütür?", ["Tümsek ayna geniş alan gösterir: dikiz, kavşak, mağaza aynaları.", "Çukur ayna büyütür ve ışığı toplar: diş hekimi aynası, makyaj aynası, far, el feneri.", "Doğru eşleştirme: tümsek ayna – mağaza güvenlik aynası."],
          { gorsel: G.tablo(["Ayna türü", "Kullanım alanı"], [["Çukur ayna", "Kavşak aynası"], ["Tümsek ayna", "Diş hekimi aynası"], ["Düz ayna", "Araba farı"], ["Tümsek ayna", "Mağaza güvenlik aynası"]]), kural: "Çukur: büyütür, ışığı toplar. Tümsek: küçük gösterir, geniş görüş alanı sağlar." }),
        Q("fyan.ayna", "transfer", 3, "Güneş ışınlarını bir noktada toplayarak su ısıtan ya da yemek pişiren bir “güneş ocağı” yapmak istiyorsun. Hangi aynayı kullanmalısın?", "Çukur ayna",
          [["Tümsek ayna", "kavrama", "Tümsek ayna ışınları toplamaz, dağıtır."], ["Düz ayna", "kavrama", "Tek bir düz ayna ışınları bir noktada toplamaz."], ["Siyah mat kâğıt", "bilgi", "Siyah kâğıt ışığı soğurur ama ayna değildir; ışınları bir noktaya yönlendirmez."]],
          "Hangi ayna ışınları bir noktada toplar?", ["Güneş ocağında ışınların bir noktada toplanması gerekir.", "Çukur ayna gelen paralel ışınları bir noktada toplar.", "Bu noktaya konan kap ısınır."],
          { kural: "Çukur ayna ışınları toplar (güneş ocağı, teleskop); farlarda ise ampulden çıkan ışını paralel yansıtır." }),
        Q("fyan.ayna", "baglanti", 2, "Metal bir kaşığın iç (çukur) yüzeyine bakan bir çocuk, kaşığın dış yüzeyine baktığında ne gözlemler?", "Dış yüzey tümsek ayna gibi davranır; görüntü düz ve küçük görünür.",
          [["Dış yüzey düz ayna gibi davranır.", "kavrama", "Kaşığın dış yüzeyi kavislidir; düz değildir."], ["Dış yüzeyde hiç görüntü oluşmaz.", "kavrama", "Parlak, pürüzsüz yüzey düzgün yansıma yapar; görüntü oluşur."], ["Dış yüzeyde görüntü büyük görünür.", "bilgi", "Büyük görüntü çukur aynanın yakın cisimler için özelliğidir."]],
          "Kaşığın dış yüzeyi içe mi, dışa mı kavislidir?", ["Kaşığın dış yüzeyi dışa doğru kavislidir, yani tümsektir.", "Tümsek aynada görüntü düz ve küçük olur.", "Parlak yüzey düzgün yansıma yaptığı için görüntü oluşur."],
          { kural: "Parlak kaşığın içi çukur ayna, dışı tümsek ayna gibidir." }),
      ],
    },
  });

  /* ================== 4) IŞIĞIN SOĞURULMASI VE RENKLER ================== */
  const ISIK_R = ["kırmızı", "yeşil", "mavi"];
  const CISIM_R = ["kırmızı", "yeşil", "mavi", "beyaz", "siyah"];
  const gorunum = (isik, cisim) => isik === "beyaz" ? cisim : (cisim === isik || cisim === "beyaz") ? isik : "siyah";
  function renkNeden(isik, cisim, secenek) {
    if (secenek === "beyaz") return "Beyaz görünmesi için beyaz ışık altında beyaz bir cisim olması gerekir.";
    if (secenek === "siyah") return `Cisim üzerine düşen ${isik} ışığı yansıtır; bu yüzden siyah görünmez.`;
    if (secenek === cisim) return `Cismin kendi rengini görebilmek için ortamda ${cisim} ışık olmalıdır; burada yalnızca ${isik} ışık var.`;
    if (secenek === isik) return `${cisim[0].toUpperCase() + cisim.slice(1)} cisim ${isik} ışığı yansıtmaz, soğurur.`;
    return `Ortamda ${secenek} ışık yoktur; cisim bu rengi yansıtamaz.`;
  }
  KONU_EKLE("fen", {
    id: "f_sogurma", tema: "f4", ad: "Işığın Soğurulması ve Renkler",
    kazanimlar: [
      { id: "fsog.sogurma", ad: "Işığın soğurulmasını açıklama ve günlük hayat örnekleriyle ilişkilendirme" },
      { id: "fsog.ayrisma", ad: "Beyaz ışığın renklere ayrılmasını açıklama" },
      { id: "fsog.renk", ad: "Cisimlerin renkli görünmesini ve renkli ışık altındaki görünümlerini açıklama" },
    ],
    anlatim: [
      { baslik: "Işığın soğurulması",
        metin: "Işık bir cisme çarptığında <b>yansıyabilir</b>, cismin içinden <b>geçebilir</b> ya da cisim tarafından <b>soğurulabilir</b>. Işığın cisim tarafından tutulmasına <b>soğurulma</b> denir. Soğurulan ışık enerjisi genellikle <b>ısıya</b> dönüşür ve cisim ısınır.<br><b>Siyah</b> ve koyu renkli cisimler ışığın çoğunu soğurur, çabuk ısınır. <b>Beyaz</b> ve açık renkli cisimler ışığın çoğunu yansıtır, daha az ısınır.",
        ornek: "Yazın siyah tişört beyaz tişörtten daha çok ısınır. Sıcak bölgelerdeki evler genellikle beyaza boyanır. Güneş enerjili su ısıtıcılarının panelleri koyu renklidir.",
        durak: { soru: "Güneşte aynı süre bekletilen aynı tür kumaştan yapılmış tişörtlerden hangisi en çok ısınır?", secenekler: [["Siyah tişört", true, "Siyah renk ışığın neredeyse tamamını soğurur; soğurulan ışık ısıya dönüşür."], ["Beyaz tişört", false, "Beyaz renk ışığın çoğunu yansıtır; en az ısınır."], ["Açık sarı tişört", false, "Açık renkler ışığın büyük kısmını yansıtır."], ["Hepsi eşit ısınır", false, "Renk, soğurulan ışık miktarını değiştirir; ısınma farklı olur."]] } },
      { baslik: "Beyaz ışığın renklere ayrılması",
        metin: "Güneş ışığı (beyaz ışık) aslında birçok rengin karışımıdır. Beyaz ışık bir <b>prizmadan</b> geçirildiğinde renklerine ayrılır: <b>kırmızı, turuncu, sarı, yeşil, mavi, lacivert, mor</b>. Bu renk dizisine <b>tayf (spektrum)</b> denir.<br><b>Gökkuşağı</b>, Güneş ışığının havadaki yağmur damlalarından geçerken renklerine ayrılmasıyla oluşur; damlalar küçük prizmalar gibi davranır. Gökkuşağını görmek için Güneş arkamızda, yağmur damlaları önümüzde olmalıdır.",
        ornek: "Isaac Newton prizma deneyiyle beyaz ışığın renklerden oluştuğunu göstermiştir. CD'nin yüzeyinde ve sabun köpüğünde de renkler görülebilir.",
        gorsel: prizma(),
        durak: { soru: "Gökkuşağının oluşmasında yağmur damlaları hangi araç gibi davranır?", secenekler: [["Prizma", true, "Damlalar beyaz ışığı prizma gibi renklerine ayırır."], ["Düz ayna", false, "Düz ayna ışığı renklerine ayırmaz."], ["Tümsek ayna", false, "Tümsek ayna geniş alan gösterir; ışığı renklere ayırmaz."], ["Siyah perde", false, "Siyah perde ışığı soğurur."]] } },
      { baslik: "Cisimler neden renkli görünür?",
        metin: "Saydam olmayan (opak) bir cismin rengi, <b>yansıttığı ışığın rengidir</b>. Cisim diğer renkleri soğurur.<br>• Kırmızı elma, kırmızı ışığı yansıtır; diğer renkleri soğurur.<br>• <b>Beyaz</b> cisim tüm renkleri yansıtır.<br>• <b>Siyah</b> cisim tüm renkleri soğurur; gözümüze ışık gelmediği için siyah görünür.",
        ornek: "Yaprakların yeşil görünmesinin nedeni, yeşil ışığı yansıtıp diğer renklerin çoğunu soğurmalarıdır.",
        gorsel: G.tablo(["Cisim (gün ışığında)", "Yansıttığı", "Soğurduğu"], [["Kırmızı", "Kırmızı", "Diğer renkler"], ["Beyaz", "Tüm renkler", "—"], ["Siyah", "—", "Tüm renkler"]]),
        durak: { soru: "Mavi bir kalem gün ışığında neden mavi görünür?", secenekler: [["Mavi ışığı yansıtıp diğer renkleri soğurduğu için", true, "Cismin rengi yansıttığı ışığın rengidir."], ["Mavi ışığı soğurduğu için", false, "Soğurulan ışık gözümüze gelmez; gördüğümüz renk yansıtılan renktir."], ["Tüm renkleri yansıttığı için", false, "Tüm renkleri yansıtan cisim beyaz görünür."], ["Kendi ışığını ürettiği için", false, "Kalem bir ışık kaynağı değildir."]] } },
      { baslik: "Renkli ışık altında cisimler",
        metin: "Bir cisim yalnızca <b>üzerine düşen ışıkta bulunan</b> renkleri yansıtabilir.<br>• Kırmızı ışık altında kırmızı cisim <b>kırmızı</b> görünür.<br>• Kırmızı ışık altında beyaz cisim <b>kırmızı</b> görünür (beyaz cisim gelen her rengi yansıtır).<br>• Kırmızı ışık altında yeşil ya da mavi cisim <b>siyah</b> görünür; çünkü kırmızı ışığı soğurur ve yansıtacak ışık kalmaz.<br>• Siyah cisim her ışık altında siyah görünür.",
        ornek: "Türk bayrağı kırmızı ışık altında tamamen kırmızı görünür: kırmızı zemin kırmızıyı yansıtır, beyaz ay-yıldız da kırmızı ışığı yansıtır.",
        gorsel: isikCisim("kırmızı", "yeşil"),
        durak: { soru: "Kırmızı ışıkla aydınlatılan karanlık bir odada yeşil bir top hangi renkte görünür?", secenekler: [["Siyah", true, "Yeşil top kırmızı ışığı soğurur; gözümüze ışık gelmez."], ["Yeşil", false, "Yeşil görünmesi için ortamda yeşil ışık olmalıydı."], ["Kırmızı", false, "Kırmızı görünmesi için topun kırmızı ışığı yansıtması gerekirdi."], ["Beyaz", false, "Beyaz görünmesi için beyaz ışık ve beyaz cisim gerekir."]] } },
    ],
    uret: {
      "fsog.sogurma": [
        Q("fsog.sogurma", "hatirlama", 1, "Işığın bir cisim tarafından tutulmasına ne ad verilir?", "Soğurulma",
          [["Yansıma", "kavrama", "Yansımada ışık yüzeyden geri döner; tutulmaz."], ["Kırılma", "bilgi", "Kırılma, ışığın farklı ortamlara geçerken yön değiştirmesidir."], ["Gölge", "bilgi", "Gölge, ışığın ulaşamadığı karanlık bölgedir."]],
          "Soğurulan ışık enerjisi neye dönüşür?", ["Işık bir cisme çarpınca yansıyabilir, geçebilir ya da tutulabilir.", "Işığın cisim tarafından tutulmasına soğurulma denir.", "Soğurulan ışık genellikle ısıya dönüşür."],
          { kural: "Soğurulma: ışığın cisim tarafından tutulması; enerji çoğunlukla ısıya dönüşür." }),
        Q("fsog.sogurma", "aciklama", 2, "Siyah renkli cisimlerin Güneş altında beyaz renkli cisimlerden daha çabuk ısınmasının nedeni nedir?", "Siyah cisimler ışığın neredeyse tamamını soğurur, soğurulan ışık ısıya dönüşür.",
          [["Siyah cisimler ışığın tamamını yansıtır.", "kavrama", "Işığın tamamını yansıtan cisim beyaz görünür."], ["Siyah cisimler kendi ısısını üretir.", "kavrama", "Isınmanın kaynağı soğurulan Güneş ışığıdır."], ["Siyah cisimler ışığı geçirir.", "bilgi", "Siyah opak cisimler ışığı geçirmez."]],
          "Hangi renk ışığı daha çok tutar?", ["Siyah cisimler ışığın neredeyse tamamını soğurur.", "Beyaz cisimler ışığın çoğunu yansıtır.", "Soğurulan ışık ısıya dönüştüğü için siyah cisim daha çok ısınır."],
          { kural: "Koyu renk → çok soğurma → çok ısınma. Açık renk → çok yansıtma → az ısınma." }),
        Q("fsog.sogurma", "uygulama", 2, "Aynı büyüklükteki dört metal kutu farklı renklere boyanıp içlerine eşit miktarda, aynı sıcaklıkta su konuyor ve 1 saat Güneş'te bekletiliyor. Grafikteki sonuçlara göre siyah boyalı kutu hangisi olabilir?", "D",
          [["A", "kavrama", "En az ısınan kutu ışığı en çok yansıtan, yani açık renkli kutudur."], ["B", "dikkat", "B orta düzeyde ısınmıştır; siyah kutu en çok ısınmalıdır."], ["C", "dikkat", "C'den daha çok ısınan bir kutu var."]],
          "Siyah renk ışığı en çok soğurur.", ["Siyah boya ışığın neredeyse tamamını soğurur.", "Soğurulan ışık ısıya dönüşür; bu kutudaki su en çok ısınır.", "Grafikte sıcaklık artışı en fazla olan kutu D'dir."],
          { gorsel: G.sutun([["A", 4], ["B", 7], ["C", 9], ["D", 14]], { baslik: "1 saatte sıcaklık artışı", birim: "°C" }), kural: "Siyah ışığı en çok soğurur, beyaz en çok yansıtır." }),
        Q("fsog.sogurma", "transfer", 2, "Sıcak iklimli bölgelerde evlerin dış duvarlarının çoğunlukla beyaz ya da açık renge boyanmasının nedeni nedir?", "Açık renkler ışığın çoğunu yansıttığı için evlerin daha az ısınması",
          [["Açık renklerin ışığı daha çok soğurması", "kavrama", "Işığı çok soğuran koyu renklerdir."], ["Beyaz boyanın daha pahalı olması", "kavrama", "Bu bilimsel bir neden değildir."], ["Evlerin kışın daha çok ısınması", "dikkat", "Soru sıcak bölgelerdeki serinlik amacını soruyor; açık renk ısınmayı azaltır."]],
          "Beyaz renk ışığı ne yapar?", ["Beyaz ve açık renkler ışığın çoğunu yansıtır.", "Daha az ışık soğurulduğu için daha az ısı oluşur.", "Böylece evlerin içi daha serin kalır."],
          { kural: "Sıcak bölgelerde açık renk giysi ve boya tercih edilir." }),
        Q("fsog.sogurma", "transfer", 3, "Güneş enerjili su ısıtıcılarının (güneş kolektörlerinin) ışık alan yüzeyleri neden koyu (çoğunlukla siyah) renktedir?", "Koyu yüzey ışığı daha çok soğurup ısıya dönüştürdüğü için suyu daha iyi ısıtır.",
          [["Koyu renk ışığı daha iyi yansıtır.", "kavrama", "Işığı iyi yansıtan açık renklerdir; yansıyan ışık suyu ısıtmaz."], ["Koyu renk kirlenmeyi gizlemek için seçilir.", "strateji", "Asıl amaç ısınmayı artırmaktır."], ["Siyah renk ışığı geçirir.", "bilgi", "Siyah boya ışığı geçirmez, soğurur."]],
          "Bu cihazın amacı nedir: ışığı yansıtmak mı, ısıya çevirmek mi?", ["Kolektörün amacı Güneş ışığıyla suyu ısıtmaktır.", "Koyu yüzey ışığın çoğunu soğurur.", "Soğurulan ışık ısıya dönüşür ve içindeki boruda akan suyu ısıtır."],
          { kural: "Isınması istenen yüzeyler koyu, serin kalması istenen yüzeyler açık renkte yapılır." }),
        Q("fsog.sogurma", "baglanti", 2, "Işık bir aynaya çarptığında çoğunlukla yansır, siyah bir kadife kumaşa çarptığında ise çoğunlukla soğurulur. Buna göre hangisi doğrudur?", "Siyah kadife, aynadan daha fazla ısınır.",
          [["Ayna, siyah kadifeden daha fazla ısınır.", "kavrama", "Ayna ışığın çoğunu yansıtır; soğurulan ışık az olduğundan az ısınır."], ["İkisi de hiç ısınmaz.", "bilgi", "Soğurulan ışık ısıya dönüşür; kadife ısınır."], ["Siyah kadifede düzgün yansıma olur.", "bilgi", "Kadife pürüzlüdür; ayrıca siyah renk ışığı çoğunlukla soğurur."]],
          "Hangi yüzey ışığı tutar?", ["Ayna ışığın çoğunu yansıtır; az soğurur.", "Siyah kadife ışığın çoğunu soğurur.", "Soğurulan ışık ısıya dönüştüğü için kadife daha fazla ısınır."],
          { kural: "Yansıyan ışık cismi ısıtmaz; soğurulan ışık ısıtır." }),
      ],
      "fsog.ayrisma": [
        Q("fsog.ayrisma", "hatirlama", 1, "Şekildeki deneyde beyaz ışık prizmadan geçtikten sonra ekranda renkler görülüyor. Bu deney neyi gösterir?", "Beyaz ışığın farklı renklerin karışımı olduğunu",
          [["Prizmanın renkli ışık ürettiğini", "kavrama", "Prizma ışık üretmez; beyaz ışığı oluşturan renkleri ayırır."], ["Işığın yalnızca kırmızı renkten oluştuğunu", "bilgi", "Ekranda birçok renk görülmektedir."], ["Işığın prizmada soğurulduğunu", "kavrama", "Işık prizmadan geçmiştir; soğurulsaydı ekranda renk görülmezdi."]],
          "Renkler prizmanın içinde mi oluştu, yoksa beyaz ışığın içinde mi vardı?", ["Prizmaya beyaz ışık gönderilmiştir.", "Prizmadan çıkan ışık ekranda kırmızıdan mora renkler oluşturur.", "Bu, beyaz ışığın birçok rengin karışımı olduğunu gösterir."],
          { gorsel: prizma(), kural: "Beyaz ışık; kırmızı, turuncu, sarı, yeşil, mavi, lacivert ve mor renklerin karışımıdır." }),
        Q("fsog.ayrisma", "aciklama", 2, "Gökkuşağının oluşması için aşağıdakilerden hangisi gereklidir?", "Güneş ışığı ve havada yağmur damlaları",
          [["Yalnızca bulutlu bir gökyüzü", "kavrama", "Güneş ışığı olmadan gökkuşağı oluşmaz."], ["Gece ve Ay ışığı olmadan karanlık", "bilgi", "Işık yoksa renklere ayrılacak ışık da yoktur."], ["Rüzgârlı ve kuru bir hava", "bilgi", "Işığı ayıracak su damlaları gerekir."]],
          "Prizma görevini gökyüzünde ne yapar?", ["Gökkuşağı, Güneş ışığının renklerine ayrılmasıyla oluşur.", "Bu ayrılmayı havadaki yağmur damlaları yapar; prizma gibi davranırlar.", "Bu yüzden hem Güneş ışığı hem yağmur damlaları gerekir."],
          { kural: "Gökkuşağı: Güneş ışığı + yağmur damlaları (prizma gibi)." }),
        Q("fsog.ayrisma", "transfer", 2, "Bahçeyi hortumla sularken arkası Güneş'e dönük duran Ali, su damlacıklarında küçük bir gökkuşağı görüyor. Bu olay hangi olaya benzer?", "Beyaz ışığın prizmada renklerine ayrılmasına",
          [["Işığın düz aynada yansımasına", "kavrama", "Düz ayna ışığı renklerine ayırmaz."], ["Siyah cismin ışığı soğurmasına", "kavrama", "Soğurmada ışık tutulur; renkler oluşmaz."], ["Gölge oluşumuna", "bilgi", "Gölge ışığın ulaşmadığı bölgedir; renk oluşmaz."]],
          "Su damlacıkları ne gibi davranır?", ["Hortumdan çıkan su damlacıkları havada asılı kalır.", "Güneş ışığı damlalardan geçerken renklerine ayrılır.", "Bu, prizma deneyindeki olayla aynıdır."],
          { kural: "Su damlaları, cam prizma ve CD yüzeyi beyaz ışığı renklerine ayırabilir." }),
        Q("fsog.ayrisma", "uygulama", 1, "Aşağıdakilerden hangisi beyaz ışığı oluşturan renklerden biri <b>değildir</b>?", "Siyah",
          [["Kırmızı", "bilgi", "Kırmızı, tayfın ilk rengidir."], ["Yeşil", "bilgi", "Yeşil, tayfın renklerindendir."], ["Mor", "bilgi", "Mor, tayfın son rengidir."]],
          "Siyah bir ışık rengi mi, yoksa ışığın olmaması mı?", ["Beyaz ışığın renkleri: kırmızı, turuncu, sarı, yeşil, mavi, lacivert, mor.", "Siyah, gözümüze ışık gelmediğinde algıladığımız durumdur.", "Bu yüzden siyah, beyaz ışığı oluşturan renklerden değildir."],
          { kural: "Siyah bir ışık rengi değildir; ışığın gelmediği durumdur." }),
        Q("fsog.ayrisma", "baglanti", 3, "Prizmadan çıkan renklerden yalnızca kırmızı olan ışın ikinci bir prizmaya gönderiliyor. İkinci prizmadan çıkan ışık için ne beklenir?", "Kırmızı olarak kalır, başka renklere ayrılmaz.",
          [["Yeniden tüm renklere ayrılır.", "kavrama", "Kırmızı ışık zaten tek renktir; içinde ayrılacak başka renk yoktur."], ["Beyaz ışığa dönüşür.", "kavrama", "Tek renkli ışık prizmadan geçince beyaza dönüşmez."], ["Siyah ışığa dönüşür.", "bilgi", "Siyah bir ışık rengi değildir."]],
          "Tek bir renkten oluşan ışık ayrılabilir mi?", ["Beyaz ışık birçok rengin karışımı olduğu için prizmada ayrılır.", "Kırmızı ışık ise tek renktir.", "İkinci prizmadan geçen kırmızı ışık yine kırmızı kalır."],
          { kural: "Prizma ışığa renk eklemez; yalnızca karışık ışığı renklerine ayırır." }),
        Q("fsog.ayrisma", "aciklama", 2, "Gökkuşağını görebilmek için gözlemci ile Güneş'in konumu nasıl olmalıdır?", "Güneş gözlemcinin arkasında, yağmur damlaları önünde olmalıdır.",
          [["Gözlemci doğrudan Güneş'e bakmalıdır.", "dikkat", "Güneş'e doğrudan bakmak gözlere zarar verir; ayrıca gökkuşağı Güneş'in karşı tarafında görülür."], ["Güneş tam tepedeyken her yerden görülür.", "bilgi", "Gökkuşağı genellikle Güneş alçaktayken (sabah ya da akşamüstü) görülür."], ["Gece karanlığında daha iyi görülür.", "bilgi", "Renklere ayrılacak Güneş ışığı gerekir."]],
          "Hortum deneyinde Ali Güneş'e göre nasıl duruyordu?", ["Gökkuşağı Güneş ışığının damlalardan geçip gözümüze ulaşmasıyla görülür.", "Bunun için Güneş arkamızda, yağmur damlaları önümüzde olmalıdır.", "Bu yüzden gökkuşağı genellikle Güneş'in karşı tarafındaki gökyüzünde görülür."],
          { kural: "Gökkuşağı: Güneş arkada, yağmur damlaları önde. Güneş'e asla doğrudan bakma!" }),
      ],
      "fsog.renk": [
        z => { const isik = sec(ISIK_R), cisim = sec(CISIM_R), dogru = gorunum(isik, cisim);
          const digerler = karistir(["kırmızı", "yeşil", "mavi", "beyaz", "siyah"].filter(r => r !== dogru));
          const oncelik = [cisim, isik, "siyah", "beyaz"].filter(r => r !== dogru);
          const secilen = [...new Set(oncelik.concat(digerler))].slice(0, 3);
          return S({ kaz: "fsog.renk", duzey: "uygulama", zorluk: 2, soru: `Gün ışığında <b>${cisim}</b> görünen bir cisim, karanlık bir odada yalnızca <b>${isik}</b> ışıkla aydınlatılıyor. Cisim hangi renkte görünür?`, gorsel: isikCisim(isik, cisim),
            dogru: dogru[0].toUpperCase() + dogru.slice(1), yanlis: secilen.map(r => [r[0].toUpperCase() + r.slice(1), r === cisim ? "kavrama" : r === "siyah" ? "kavrama" : "bilgi", renkNeden(isik, cisim, r)]),
            ipucu: `Cisim ${isik} ışığı yansıtır mı, soğurur mu?`,
            cozum: [`Odadaki tek ışık ${isik}.`, cisim === "beyaz" ? "Beyaz cisim üzerine düşen her rengi yansıtır." : cisim === "siyah" ? "Siyah cisim tüm renkleri soğurur." : cisim === isik ? `${cisim[0].toUpperCase() + cisim.slice(1)} cisim ${isik} ışığı yansıtır.` : `${cisim[0].toUpperCase() + cisim.slice(1)} cisim yalnızca ${cisim} ışığı yansıtır; ${isik} ışığı soğurur.`, dogru === "siyah" ? "Gözümüze ışık gelmediği için cisim siyah görünür." : `Gözümüze ${isik} ışık geldiği için cisim ${isik} görünür.`],
            kural: "Cisim, yalnızca üzerine düşen ışıkta bulunan ve kendi yansıttığı rengi gösterebilir; yansıtamazsa siyah görünür." }); },
        z => { const isik = sec(ISIK_R);
          return S({ kaz: "fsog.renk", duzey: "transfer", zorluk: 3, soru: `Kırmızı zemin üzerinde beyaz ay-yıldız bulunan Türk bayrağı, karanlık bir odada yalnızca <b>${isik}</b> ışıkla aydınlatılıyor. Bayrak nasıl görünür?`,
            dogru: isik === "kırmızı" ? "Tamamı kırmızı görünür." : `Zemin siyah, ay-yıldız ${isik} görünür.`,
            yanlis: isik === "kırmızı"
              ? [["Zemin kırmızı, ay-yıldız beyaz görünür.", "kavrama", "Beyaz görünmesi için beyaz ışık gerekir; beyaz ay-yıldız yalnızca kırmızı ışığı yansıtır."], ["Zemin siyah, ay-yıldız kırmızı görünür.", "kavrama", "Kırmızı zemin kırmızı ışığı yansıtır; siyah görünmez."], ["Tamamı siyah görünür.", "kavrama", "Hem kırmızı zemin hem beyaz ay-yıldız kırmızı ışığı yansıtır."]]
              : [["Zemin kırmızı, ay-yıldız beyaz görünür.", "kavrama", `Ortamda kırmızı ve beyaz ışık yok; yalnızca ${isik} ışık var.`], [`Tamamı ${isik} görünür.`, "kavrama", `Kırmızı zemin ${isik} ışığı soğurur; ${isik} görünmez.`], ["Tamamı siyah görünür.", "dikkat", `Beyaz ay-yıldız ${isik} ışığı yansıtır; siyah görünmez.`]],
            ipucu: "Zemini ve ay-yıldızı ayrı ayrı düşün.", cozum: [`Odadaki ışık: ${isik}.`, isik === "kırmızı" ? "Kırmızı zemin kırmızı ışığı yansıtır → kırmızı görünür." : `Kırmızı zemin ${isik} ışığı soğurur → siyah görünür.`, `Beyaz ay-yıldız gelen ${isik} ışığı yansıtır → ${isik} görünür.`],
            kural: "Beyaz cisim, üzerine düşen ışığın rengini alır." }); },
        Q("fsog.renk", "hatirlama", 1, "Saydam olmayan bir cismin gün ışığında hangi renkte görüneceğini ne belirler?", "Yansıttığı ışığın rengi",
          [["Soğurduğu ışığın rengi", "kavrama", "Soğurulan ışık gözümüze gelmez; gördüğümüz renk yansıtılan renktir."], ["Cismin sıcaklığı", "bilgi", "Cismin sıcaklığı gün ışığındaki rengini belirlemez."], ["Cismin kütlesi", "bilgi", "Kütle rengi etkilemez."]],
          "Gözümüze hangi ışık ulaşır?", ["Işık cisme çarpınca bazı renkler soğurulur, bazıları yansır.", "Yansıyan ışık gözümüze ulaşır.", "Bu yüzden cismin rengi yansıttığı ışığın rengidir."],
          { kural: "Opak cismin rengi = yansıttığı ışığın rengi." }),
        Q("fsog.renk", "aciklama", 2, "Gün ışığında beyaz ve siyah görünen cisimler için hangisi doğrudur?", "Beyaz cisim tüm renkleri yansıtır, siyah cisim tüm renkleri soğurur.",
          [["Beyaz cisim tüm renkleri soğurur, siyah cisim tüm renkleri yansıtır.", "dikkat", "Tanımları ters eşleştirdin."], ["İkisi de tüm renkleri yansıtır.", "kavrama", "Siyah cisim ışığı yansıtmadığı için siyah görünür."], ["İkisi de yalnızca bir rengi yansıtır.", "kavrama", "Tek bir rengi yansıtan cisim o renkte görünür; beyaz ya da siyah görünmez."]],
          "Siyah cisimden gözümüze ışık gelir mi?", ["Beyaz cisim kendisine gelen tüm renkleri yansıtır; renklerin karışımı beyaz görünür.", "Siyah cisim tüm renkleri soğurur; gözümüze ışık gelmez.", "Bu yüzden biri beyaz, diğeri siyah görünür."],
          { kural: "Beyaz: hepsini yansıtır. Siyah: hepsini soğurur." }),
        Q("fsog.renk", "uygulama", 3, "Karanlık bir odada yalnızca kırmızı ışıkla aydınlatılan bir cisim kırmızı görünüyor. Bu cismin gün ışığındaki rengi aşağıdakilerden hangisi olabilir?", "Kırmızı ya da beyaz",
          [["Yalnızca kırmızı", "strateji", "Beyaz cisim de kırmızı ışığı yansıtır ve kırmızı görünür; bu olasılığı unutma."], ["Yeşil ya da mavi", "kavrama", "Yeşil ve mavi cisimler kırmızı ışığı soğurur; siyah görünürler."], ["Siyah", "kavrama", "Siyah cisim her ışıkta siyah görünür."]],
          "Kırmızı ışığı hangi cisimler yansıtır?", ["Cisim kırmızı göründüğüne göre kırmızı ışığı yansıtıyor.", "Kırmızı ışığı yansıtan cisimler: kırmızı cisim ve tüm renkleri yansıtan beyaz cisim.", "Bu yüzden cisim gün ışığında kırmızı ya da beyaz olabilir."],
          { gorsel: isikCisim("kırmızı", "kırmızı").replace("gün ışığında kırmızı cisim", "gün ışığında rengi ?"), kural: "Renkli ışık altında o renkte görünen cisim, ya o renktedir ya da beyazdır." }),
        Q("fsog.renk", "transfer", 3, "Kırmızı, yeşil ve mavi ışık kaynakları ile tablodaki cisimler kullanılıyor. Hangi ışık altında <b>her üç cisim de siyah</b> görünür?", "Mavi ışık",
          [["Kırmızı ışık", "dikkat", "Kırmızı ışık altında kırmızı elma kırmızı görünür."], ["Yeşil ışık", "dikkat", "Yeşil ışık altında yeşil yaprak yeşil görünür."], ["Beyaz ışık", "kavrama", "Beyaz ışıkta her cisim kendi renginde görünür."]],
          "Cisimlerden hiçbiri hangi rengi yansıtmıyor?", ["Cisimler: kırmızı elma, yeşil yaprak, siyah kalem.", "Hiçbiri mavi ışığı yansıtmaz; hepsi mavi ışığı soğurur.", "Bu yüzden mavi ışık altında üçü de siyah görünür."],
          { gorsel: G.tablo(["Cisim", "Gün ışığındaki rengi"], [["Elma", "Kırmızı"], ["Yaprak", "Yeşil"], ["Kalem", "Siyah"]]), kural: "Cisim üzerine düşen ışığı yansıtamazsa siyah görünür." }),
        Q("fsog.renk", "baglanti", 2, "Yaz günü Güneş altında yeşil bir tişört ile beyaz bir tişörtten hangisi daha çok ısınır ve neden?", "Yeşil tişört; çünkü yeşil dışındaki renkleri soğurur, beyaz ise tüm renkleri yansıtır.",
          [["Beyaz tişört; çünkü tüm renkleri yansıtır.", "kavrama", "Yansıtılan ışık ısıya dönüşmez; daha az ısınır."], ["İkisi eşit ısınır; çünkü renk ısınmayı etkilemez.", "kavrama", "Soğurulan ışık miktarı renge göre değişir."], ["Yeşil tişört; çünkü yeşil ışığı soğurur.", "dikkat", "Yeşil tişört yeşil ışığı yansıtır; diğer renkleri soğurur."]],
          "Hangisi daha çok ışık soğurur?", ["Beyaz tişört tüm renkleri yansıtır; çok az soğurur.", "Yeşil tişört yalnızca yeşili yansıtır, diğer renkleri soğurur.", "Soğurulan ışık ısıya dönüştüğü için yeşil tişört daha çok ısınır."],
          { kural: "Ne kadar çok renk soğurulursa cisim o kadar çok ısınır." }),
      ],
    },
  });
})();
