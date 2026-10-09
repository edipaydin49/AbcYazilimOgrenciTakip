/* 6. sınıf Fen Bilimleri — 5., 6. ve 7. ünite konuları:
 * Genleşme ve Büzülme · Maddenin Hâl Değişim Noktaları · Yoğunluk ·
 * Elektriğin İletimi · Elektriksel Direnç · Biyoçeşitlilik · İnsan ve Çevre Etkileşimi.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, Q, G } = OGR;

  /* ---------------------------- Ortak çizimler ---------------------------- */
  /* Sıcaklık–zaman grafiği. noktalar: [[dakika, °C], ...]; isaret: eksende yazılacak sıcaklıklar. */
  function grafik(noktalar, { ymin = -20, ymax = 120, isaret = [], baslik = "", harf = false } = {}) {
    const W = 470, H = 270, sol = 62, sag = 450, ust = 28, alt = 226;
    const tmax = noktalar[noktalar.length - 1][0];
    const xk = t => sol + t / tmax * (sag - sol), yk = T => alt - (T - ymin) / (ymax - ymin) * (alt - ust);
    let ic = baslik ? G.yazi(W / 2, 16, baslik, { b: 1, k: 1 }) : "";
    ic += G.ok(sol, alt + 8, sol, ust - 14) + G.ok(sol - 8, yk(Math.max(ymin, Math.min(0, ymax))), sag + 12, yk(Math.max(ymin, Math.min(0, ymax))));
    ic += G.yazi(sol - 6, ust - 16, "Sıcaklık (°C)", { a: "start", k: 1 }) + G.yazi(sag + 8, yk(Math.max(ymin, Math.min(0, ymax))) + 22, "Zaman (dk)", { a: "end", k: 1 });
    isaret.forEach(T => { ic += `<line class="g-ince" x1="${sol}" y1="${yk(T)}" x2="${sag}" y2="${yk(T)}" stroke-dasharray="4 4"/>` + G.yazi(sol - 6, yk(T) + 4, T, { a: "end", k: 1 }); });
    ic += `<polyline class="g-cizgi" fill="none" stroke-width="3" points="${noktalar.map(([t, T]) => xk(t).toFixed(1) + "," + yk(T).toFixed(1)).join(" ")}"/>`;
    noktalar.forEach(([t, T], i) => {
      ic += `<circle class="g-a" cx="${xk(t)}" cy="${yk(T)}" r="4"/>`;
      if (harf) ic += G.yazi(xk(t), yk(T) - 9, "KLMNPRST"[i], { k: 1, b: 1 });
      else if (t > 0) ic += G.yazi(xk(t), alt + 18, t, { k: 1 });
    });
    return G.svg(W, H, ic, "sıcaklık–zaman grafiği");
  }

  /* Kap içinde birbirine karışmayan sıvı katmanları (üstten alta). */
  function katman(sivilar, { cisimler = [] } = {}) {
    const W = 360, H = 250, x = 90, w = 150, ust = 30, alt = 220, h = (alt - ust - 10) / sivilar.length;
    const sinif = ["g-yumusak", "g-b", "g-c", "g-a", "g-d"];
    let ic = "";
    sivilar.forEach((s, i) => {
      const y = ust + 10 + i * h;
      ic += `<rect class="${sinif[i % sinif.length]}" x="${x}" y="${y}" width="${w}" height="${h}" opacity="0.75"/>`;
      ic += `<line class="g-ince" x1="${x + w}" y1="${y + h / 2}" x2="${x + w + 24}" y2="${y + h / 2}"/>` + G.yazi(x + w + 28, y + h / 2 + 5, s, { a: "start", k: 1 });
    });
    cisimler.forEach(([ad, sira]) => { const y = ust + 10 + sira * h + h / 2; ic += `<circle class="g-bos g-cizgi" cx="${x + w / 2}" cy="${y}" r="13" stroke-width="2"/>` + G.yazi(x + w / 2, y + 5, ad, { k: 1, b: 1 }); });
    ic += `<path class="g-cizgi" fill="none" stroke-width="3" d="M${x} ${ust} L${x} ${alt} L${x + w} ${alt} L${x + w} ${ust}"/>`;
    return G.svg(W, H, ic, "karışmayan sıvılar: üstten alta " + sivilar.join(", "));
  }

  /* Dereceli silindir: önce ve sonra su seviyesi (mL). */
  function silindir(once, sonra, maks, cisim) {
    const W = 420, H = 260, alt = 230, ust = 30, yk = v => alt - v / maks * (alt - ust);
    let ic = "";
    [[60, once, false], [250, sonra, true]].forEach(([x, v, ici]) => {
      ic += `<rect class="g-yumusak" x="${x}" y="${yk(v)}" width="70" height="${alt - yk(v)}"/>`;
      for (let m = 0; m <= maks; m += maks / 10) ic += `<line class="g-ince" x1="${x}" y1="${yk(m)}" x2="${x + 14}" y2="${yk(m)}"/>`;
      ic += `<path class="g-cizgi" fill="none" stroke-width="2" d="M${x} ${ust - 10} L${x} ${alt} L${x + 70} ${alt} L${x + 70} ${ust - 10}"/>`;
      ic += `<line class="g-cizgi" x1="${x - 6}" y1="${yk(v)}" x2="${x + 76}" y2="${yk(v)}" stroke-width="2"/>` + G.yazi(x + 80, yk(v) + 5, v + " mL", { a: "start", k: 1, b: 1 });
      if (ici) ic += `<circle class="g-d g-cizgi" cx="${x + 35}" cy="${alt - 16}" r="13"/>`;
    });
    ic += G.ok(160, 130, 225, 130) + G.yazi(192, 120, cisim || "cisim atılıyor", { k: 1 });
    return G.svg(W, H, ic, `dereceli silindirde su seviyesi ${once} mL iken cisim atılınca ${sonra} mL oluyor`);
  }

  /* Telleri yan yana gösteren çizim: [{ad, uzunluk(1-4), kalinlik(1-3)}] */
  function teller(liste) {
    const W = 460, H = 30 + liste.length * 58;
    let ic = "";
    liste.forEach((t, i) => {
      const y = 44 + i * 58, x1 = 70, x2 = 70 + t.uzunluk * 90;
      ic += G.yazi(30, y + 5, t.ad, { b: 1 }) + `<line class="g-cizgi" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke-width="${t.kalinlik * 3}" stroke-linecap="round"/>`;
      if (t.not) ic += G.yazi(x1, y - 14, t.not, { a: "start", k: 1 });
    });
    return G.svg(W, H, ic, "farklı uzunluk ve kalınlıkta teller");
  }

  /* ======================= 1) GENLEŞME VE BÜZÜLME ======================= */
  KONU_EKLE("fen", {
    id: "f_genlesme", tema: "f5", ad: "Genleşme ve Büzülme",
    kazanimlar: [
      { id: "fgen.kavram", ad: "Isı alan maddenin genleştiğini, ısı veren maddenin büzüldüğünü tanecik yapısıyla açıklama" },
      { id: "fgen.ayirt", ad: "Katı, sıvı ve gazların genleşmesini karşılaştırma; genleşmenin ayırt edici özellik olduğunu açıklama" },
      { id: "fgen.gunluk", ad: "Genleşme ve büzülmenin günlük hayattaki etkilerini ve alınan önlemleri örneklendirme" },
    ],
    anlatim: [
      { baslik: "Genleşme ve büzülme nedir?",
        metin: "Bir madde <b>ısı aldığında</b> tanecikleri daha hızlı hareket eder ve tanecikler arasındaki <b>boşluk artar</b>. Bu yüzden maddenin hacmi büyür; buna <b>genleşme</b> denir.<br>Madde <b>ısı verdiğinde</b> tanecikler yavaşlar, aralarındaki boşluk azalır ve hacim küçülür; buna <b>büzülme</b> denir.<br>Genleşme ve büzülmede maddenin <b>kütlesi ve tanecik sayısı değişmez</b>. Taneciklerin kendisi de büyümez; yalnızca aralarındaki uzaklık değişir.",
        ornek: "Ağzına balon geçirilmiş boş bir şişe sıcak suya konunca balon şişer (içindeki hava genleşir); soğuk suya konunca balon söner (hava büzülür).",
        durak: { soru: "Isıtılan bir demir bilyenin genleşmesinin nedeni nedir?", secenekler: [["Tanecikler arasındaki boşluğun artması", true, "Isı alan taneciklerin hareketi hızlanır ve aralarındaki uzaklık artar."], ["Taneciklerin büyümesi", false, "Taneciklerin kendisi büyümez; aralarındaki boşluk artar."], ["Tanecik sayısının artması", false, "Isıtmakla maddeye yeni tanecik eklenmez."], ["Kütlesinin artması", false, "Genleşmede kütle değişmez, hacim artar."]] } },
      { baslik: "Katı, sıvı ve gazlarda genleşme",
        metin: "Katılar, sıvılar ve gazların hepsi ısı alınca genleşir. Aynı sıcaklık artışında genel olarak <b>gazlar en çok, katılar en az</b> genleşir; sıvılar arada yer alır.<br>Aynı ilk boydaki farklı katılar (ör. alüminyum, bakır, demir) aynı miktarda ısıtıldığında <b>farklı miktarlarda</b> uzar. Farklı sıvılar da farklı genleşir. Bu nedenle <b>katı ve sıvılar için genleşme ayırt edici bir özelliktir</b>.<br>Aynı koşullarda farklı gazlar ise hemen hemen aynı miktarda genleşir; gazlar için genleşme ayırt edici değildir.",
        ornek: "Eşit boyda alüminyum, bakır ve demir çubuk aynı sıcaklığa kadar ısıtıldığında en çok alüminyum, en az demir uzar.",
        gorsel: G.sutun([["Alüminyum", 24], ["Bakır", 17], ["Demir", 12]], { baslik: "1 m'lik çubukların 100 °C ısıtılınca uzaması", birim: "mm×10" }),
        durak: { soru: "Eşit boyda iki farklı metal çubuk aynı miktarda ısıtılınca farklı miktarlarda uzuyor. Bu durum neyi gösterir?", secenekler: [["Genleşmenin katılar için ayırt edici bir özellik olduğunu", true, "Aynı koşullarda farklı katıların farklı genleşmesi, genleşmeyi ayırt edici yapar."], ["Metallerin ısıyı iletmediğini", false, "Metaller ısıyı iyi iletir; bu deney uzama miktarını karşılaştırıyor."], ["Çubukların kütlesinin arttığını", false, "Genleşmede kütle değişmez."], ["Katıların sıvılardan çok genleştiğini", false, "Genel olarak sıvılar katılardan daha çok genleşir."]] } },
      { baslik: "Günlük hayatta genleşme ve büzülme",
        metin: "• <b>Köprü ve yollarda</b> bırakılan <b>derz boşlukları</b>, yazın genleşen betonun ve metalin çatlamasını önler.<br>• <b>Tren rayları</b> arasında küçük boşluk bırakılır.<br>• <b>Elektrik telleri</b> yazın genleşip <b>sarkar</b>, kışın büzülüp gerilir; teller bu yüzden biraz gevşek çekilir.<br>• <b>Termometrelerde</b> ısınan sıvı (alkol ya da cıva) genleşerek ince boruda yükselir.<br>• Sıkışmış <b>metal kavanoz kapağı</b> sıcak su altında tutulursa metal kapak camdan daha çok genleşir ve kolay açılır.<br>• Kalın cam bardağa birden kaynar su dökülürse iç yüzey dış yüzeyden hızlı genleşir ve bardak çatlayabilir.",
        ornek: "Yaz günü güneşte bırakılan şişkin bir balon, içindeki havanın genleşmesiyle daha da şişer.",
        durak: { soru: "Köprülerde derz boşluğu bırakılmasının amacı nedir?", secenekler: [["Sıcakta genleşen malzemenin çatlamasını ve bükülmesini önlemek", true, "Boşluk, genleşen malzemenin uzayabileceği yeri sağlar."], ["Yağmur suyunun akmasını sağlamak", false, "Derz boşluğunun asıl amacı genleşmeye yer bırakmaktır."], ["Köprüyü daha hafif yapmak", false, "Küçük boşluklar köprünün kütlesini anlamlı ölçüde değiştirmez."], ["Kışın genleşmeyi önlemek", false, "Kışın malzeme büzülür; genleşme yazın olur."]] } },
    ],
    uret: {
      "fgen.kavram": [
        Q("fgen.kavram", "hatirlama", 1, "Isı alan bir maddenin hacminin artmasına ne ad verilir?", "Genleşme",
          [["Büzülme", "bilgi", "Büzülme, ısı veren maddenin hacminin küçülmesidir."], ["Erime", "kavrama", "Erime katının sıvıya dönüşmesidir; hacim artışının adı genleşmedir."], ["Yoğuşma", "bilgi", "Yoğuşma gazın sıvıya dönüşmesidir."]],
          "Isı alan madde büyür mü, küçülür mü?", ["Madde ısı alınca tanecikleri hızlanır, aralarındaki boşluk artar.", "Bu yüzden maddenin hacmi büyür.", "Hacmin ısı alarak büyümesine genleşme denir."],
          { kural: "Isı alan madde genleşir, ısı veren madde büzülür." }),
        Q("fgen.kavram", "aciklama", 2, "Bir metal bilye ısıtılarak genleştiriliyor. Bilye için aşağıdakilerden hangisi <b>değişmez</b>?", "Kütlesi",
          [["Hacmi", "kavrama", "Genleşmede hacim artar; değişen özellik hacimdir."], ["Tanecikleri arasındaki uzaklık", "kavrama", "Isınan taneciklerin arası açılır; bu değişir."], ["Taneciklerinin hareket hızı", "bilgi", "Isı alan tanecikler daha hızlı hareket eder."]],
          "Bilyeye madde eklendi mi, çıkarıldı mı?", ["Isıtma ile bilyeye yeni tanecik eklenmez, tanecik de eksilmez.", "Tanecikler hızlanır ve araları açılır; hacim artar.", "Tanecik sayısı aynı kaldığı için kütle değişmez."],
          { kural: "Genleşme ve büzülmede kütle sabittir; hacim değişir." }),
        Q("fgen.kavram", "aciklama", 2, "Genleşme ile ilgili Ali “Isınan maddenin tanecikleri büyür.” diyor. Ali'nin hatası nedir?", "Tanecikler büyümez; tanecikler arasındaki boşluk artar.",
          [["Ali haklıdır; tanecikler büyür.", "kavrama", "Bu yaygın bir yanılgıdır; taneciklerin büyüklüğü değişmez."], ["Isınan maddenin tanecikleri küçülür.", "kavrama", "Isınma taneciklerin boyutunu değiştirmez."], ["Isınan maddenin tanecik sayısı artar.", "kavrama", "Isıtma tanecik sayısını değiştirmez."]],
          "Genleşmede değişen şey taneciklerin kendisi mi, aralarındaki uzaklık mı?", ["Isı alan tanecikler daha hızlı titreşir ve hareket eder.", "Hızlanan tanecikler birbirinden uzaklaşır.", "Taneciklerin kendisi değil, aralarındaki boşluk artar; hacim de bu yüzden büyür."],
          { kural: "Genleşme = tanecikler arası boşluğun artması. Taneciklerin boyutu ve sayısı değişmez." }),
        Q("fgen.kavram", "uygulama", 2, "Ağzına balon geçirilmiş boş bir cam şişe önce sıcak suya, sonra buzlu suya konuyor. Balonda ne gözlenir?", "Sıcak suda şişer, buzlu suda söner.",
          [["Sıcak suda söner, buzlu suda şişer.", "kavrama", "Isınan hava genleşir ve balonu şişirir; soğuyan hava büzülür."], ["İki durumda da şişer.", "dikkat", "Buzlu suda hava ısı verir ve büzülür; balon söner."], ["Hiçbir değişiklik olmaz.", "bilgi", "Gazlar sıcaklık değişimine karşı belirgin biçimde genleşir ya da büzülür."]],
          "Şişenin içindeki hava ısı alırsa ne olur?", ["Şişedeki hava sıcak sudan ısı alır, genleşir ve balona dolarak onu şişirir.", "Buzlu suda hava ısı verir, büzülür ve balon söner.", "Gazlar sıcaklık değişiminden çok etkilenir."],
          { gorsel: G.svg(360, 150, `<rect class="g-d" x="20" y="95" width="140" height="45" opacity="0.5"/><rect class="g-yumusak" x="200" y="95" width="140" height="45"/><rect class="g-bos g-cizgi" x="70" y="60" width="40" height="70" rx="6"/><rect class="g-bos g-cizgi" x="250" y="60" width="40" height="70" rx="6"/><circle class="g-b g-cizgi" cx="90" cy="38" r="18"/><circle class="g-b g-cizgi" cx="270" cy="38" r="18"/>` + G.yazi(90, 148, "sıcak su", { k: 1 }) + G.yazi(270, 148, "buzlu su", { k: 1 }), "sıcak ve buzlu suya konan balonlu şişeler"), kural: "Isınan gaz genleşir, soğuyan gaz büzülür." }),
        Q("fgen.kavram", "transfer", 3, "Çukurlaşmış (içe göçmüş) bir pinpon topu kaynar suya bırakılınca eski hâline geliyor. Bunun nedeni nedir?", "Topun içindeki hava ısı alıp genleşir ve topu dışarı doğru iter.",
          [["Topun içine su girer ve onu şişirir.", "kavrama", "Pinpon topunun içine su girmez; içteki hava genleşir."], ["Topun içindeki hava büzülür.", "kavrama", "Isı alan hava büzülmez, genleşir."], ["Topun kütlesi artar.", "bilgi", "Isınmayla kütle değişmez."]],
          "Topun içinde ne var ve sıcakta ne olur?", ["Topun içi hava doludur.", "Kaynar sudan ısı alan hava genleşir ve hacmi büyür.", "Genleşen hava, topun çukurlaşmış duvarını dışarı iter; top düzelir."],
          { kural: "Isı alan gazlar genleşerek bulunduğu kabın duvarlarını iter." }),
        Q("fgen.kavram", "baglanti", 2, "Sıcak havada tanecik hareketiyle ilgili aşağıdakilerden hangisi doğrudur?", "Sıcaklık arttıkça tanecikler hızlanır ve madde genleşir.",
          [["Sıcaklık arttıkça tanecikler yavaşlar.", "kavrama", "Isı alan taneciklerin hareket enerjisi artar; hızlanırlar."], ["Sıcaklık arttıkça tanecikler birbirine yaklaşır.", "kavrama", "Birbirine yaklaşma büzülmede olur."], ["Sıcaklık taneciklerin hareketini etkilemez.", "bilgi", "Sıcaklık değişimi tanecik hareketini doğrudan etkiler."]],
          "Sıcaklık ile tanecik hareketi arasındaki ilişkiyi düşün.", ["Madde ısı aldıkça sıcaklığı artar.", "Sıcaklık arttıkça taneciklerin hareketi hızlanır.", "Hızlanan tanecikler birbirinden uzaklaşır ve madde genleşir."],
          { kural: "Sıcaklık ↑ → tanecik hareketi ↑ → tanecikler arası boşluk ↑ → hacim ↑." }),
      ],
      "fgen.ayirt": [
        Q("fgen.ayirt", "hatirlama", 1, "Aynı sıcaklık artışında genel olarak hangi hâldeki maddeler <b>en çok</b> genleşir?", "Gazlar",
          [["Katılar", "bilgi", "Katıların tanecikleri birbirine sıkıca bağlıdır; en az onlar genleşir."], ["Sıvılar", "bilgi", "Sıvılar katılardan çok, gazlardan az genleşir."], ["Hepsi eşit genleşir", "kavrama", "Katı, sıvı ve gazların genleşme miktarları farklıdır."]],
          "Tanecikleri arasındaki çekim en zayıf olan hâl hangisidir?", ["Katılarda tanecikler birbirine sıkıca bağlıdır.", "Gazlarda tanecikler arası çekim çok zayıftır; kolayca uzaklaşırlar.", "Bu yüzden gazlar en çok, katılar en az genleşir."],
          { kural: "Genleşme miktarı: gaz > sıvı > katı." }),
        Q("fgen.ayirt", "uygulama", 2, "Grafikte eşit boydaki üç metal çubuğun aynı sıcaklık artışında ne kadar uzadığı verilmiştir. Hangi yargı doğrudur?", "En çok alüminyum, en az demir genleşmiştir.",
          [["En çok demir genleşmiştir.", "dikkat", "Grafikte demirin sütunu en kısadır; en az o uzamıştır."], ["Üç metal eşit genleşmiştir.", "dikkat", "Sütun boyları farklıdır; uzamalar eşit değildir."], ["Bakır en az genleşmiştir.", "dikkat", "Bakırın sütunu alüminyum ve demirin arasındadır."]],
          "En uzun ve en kısa sütunu bul.", ["Sütun ne kadar uzunsa çubuk o kadar çok uzamıştır.", "En uzun sütun alüminyumun, en kısa sütun demirin.", "O hâlde en çok alüminyum, en az demir genleşmiştir."],
          { gorsel: G.sutun([["Alüminyum", 24], ["Bakır", 17], ["Demir", 12]], { baslik: "Çubukların uzama miktarı", birim: "birim" }), kural: "Aynı koşulda farklı katılar farklı genleşir; bu yüzden genleşme ayırt edicidir." }),
        z => {
          const ad = karistir(["K", "L", "M"]), d = karistir([3, 5, 8, 11, 14]).slice(0, 3);
          const enCok = ad[d.indexOf(Math.max(...d))], enAz = ad[d.indexOf(Math.min(...d))];
          return S({ kaz: "fgen.ayirt", duzey: "uygulama", zorluk: 2,
            soru: `İlk boyları eşit K, L ve M katı çubukları aynı sıcaklığa kadar ısıtılıyor ve uzamaları tablodaki gibi ölçülüyor. Hangi çubuk <b>en çok</b> genleşmiştir?`,
            gorsel: G.tablo(["Çubuk", "Uzama (mm)"], ad.map((a, i) => [a, d[i]])),
            dogru: enCok + " çubuğu",
            yanlis: [[enAz + " çubuğu", "dikkat", "Bu çubuk en az uzamıştır; soru en çok genleşeni soruyor."], [ad.find(a => a !== enCok && a !== enAz) + " çubuğu", "dikkat", "Bu çubuğun uzaması en büyük değil."], ["Hepsi eşit genleşmiştir", "kavrama", "Uzama miktarları farklı; farklı maddeler farklı genleşir."]],
            ipucu: "Uzama miktarı en büyük olan sayıyı bul.",
            cozum: ["Çubukların ilk boyları ve sıcaklık artışı aynıdır.", `Uzamalar: ${ad.map((a, i) => a + " = " + d[i] + " mm").join(", ")}.`, `En büyük uzama ${Math.max(...d)} mm ile ${enCok} çubuğundadır.`, "Uzamalar farklı olduğuna göre çubuklar farklı maddelerden yapılmıştır."],
            kural: "Aynı koşulda farklı uzayan katılar farklı maddelerdir." });
        },
        Q("fgen.ayirt", "aciklama", 2, "Aynı koşullarda farklı katıların ve farklı sıvıların farklı miktarlarda genleşmesi bize neyi gösterir?", "Genleşmenin katı ve sıvılar için ayırt edici bir özellik olduğunu",
          [["Genleşmenin hiçbir madde için ayırt edici olmadığını", "kavrama", "Katı ve sıvılarda genleşme maddeden maddeye değiştiği için ayırt edicidir."], ["Bütün maddelerin eşit genleştiğini", "kavrama", "Deney, maddelerin farklı genleştiğini gösteriyor."], ["Genleşmenin yalnızca gazlarda olduğunu", "bilgi", "Katı, sıvı ve gazların hepsi genleşir."]],
          "Bir özellik maddeleri birbirinden ayırmaya yarıyorsa ona ne denir?", ["Ayırt edici özellik, maddeyi diğer maddelerden ayırmaya yarayan özelliktir.", "Aynı koşulda farklı katılar ve sıvılar farklı genleşir.", "Bu nedenle genleşme, katı ve sıvılar için ayırt edici bir özelliktir."],
          { kural: "Katı ve sıvılarda genleşme ayırt edicidir; aynı koşuldaki gazlarda ayırt edici değildir." }),
        Q("fgen.ayirt", "baglanti", 3, "Termometrelerde neden cam boru değil, borunun içindeki <b>sıvı</b> sıcaklığı gösterir?", "Sıvı, aynı sıcaklık artışında camdan çok daha fazla genleşir.",
          [["Cam ısınınca hiç genleşmez.", "kavrama", "Cam da genleşir; ama sıvıya göre çok az genleşir."], ["Sıvı ısınınca büzülür.", "kavrama", "Isınan sıvı büzülmez, genleşir ve yükselir."], ["Sıvının kütlesi ısınınca artar.", "bilgi", "Sıvı yükselir ama kütlesi değişmez; hacmi artar."]],
          "Sıvılar ve katılar aynı sıcaklık artışında ne kadar genleşir?", ["Termometredeki sıvı (alkol ya da cıva) ısınınca genleşir.", "Sıvılar katılardan daha çok genleştiği için sıvının ince borudaki yükselmesi belirgin olur.", "Cam çok az genleştiğinden ölçümü bozmaz; sıcaklığı sıvının seviyesi gösterir."],
          { kural: "Sıvılar katılardan daha çok genleşir; termometreler bu ilkeyle çalışır." }),
        Q("fgen.ayirt", "transfer", 3, "Eşit hacimde ve aynı sıcaklıktaki alkol ile su, aynı ince borulu kaplarda ısıtılıyor. Alkol daha yükseğe çıkıyor. Bu deneyden hangi sonuç çıkarılır?", "Farklı sıvılar aynı sıcaklık artışında farklı genleşir.",
          [["Su ısınınca hiç genleşmez.", "kavrama", "Su da genleşir; yalnızca alkolden az genleşmiştir."], ["Alkolün kütlesi sudan daha çok artmıştır.", "bilgi", "Isıtma kütleyi değiştirmez; değişen hacimdir."], ["Sıvılar katılardan az genleşir.", "strateji", "Deneyde katı yok; bu sonuca deneyden ulaşılamaz."]],
          "Deneyde değiştirilen tek şey nedir?", ["Hacim, ilk sıcaklık ve ısıtma aynı; yalnızca sıvının cinsi farklı.", "Alkol daha çok yükseldiğine göre daha çok genleşmiştir.", "Farklı sıvılar farklı genleştiği için genleşme sıvılarda ayırt edici bir özelliktir."],
          { gorsel: G.svg(320, 170, `<rect class="g-yumusak g-cizgi" x="60" y="100" width="60" height="50" rx="6"/><rect class="g-yumusak g-cizgi" x="200" y="100" width="60" height="50" rx="6"/><rect class="g-bos g-cizgi" x="85" y="20" width="10" height="82"/><rect class="g-bos g-cizgi" x="225" y="20" width="10" height="82"/><rect class="g-a" x="86" y="70" width="8" height="32"/><rect class="g-a" x="226" y="40" width="8" height="62"/>` + G.yazi(90, 166, "su", { k: 1 }) + G.yazi(230, 166, "alkol", { k: 1 }), "ısıtılan su ve alkolün ince boruda yükselmesi"), kural: "Deneyde yalnızca bir değişken değiştirilirse sonuç o değişkene bağlanabilir." }),
      ],
      "fgen.gunluk": [
        Q("fgen.gunluk", "hatirlama", 1, "Elektrik telleri yaz aylarında neden daha sarkık görünür?", "Sıcakta genleşip uzadıkları için",
          [["Soğukta genleşip uzadıkları için", "kavrama", "Soğukta teller büzülür ve gerilir."], ["Sıcakta büzüldükleri için", "kavrama", "Isı alan teller büzülmez, genleşir."], ["Üzerlerinden geçen elektrik azaldığı için", "bilgi", "Sarkmanın nedeni sıcaklıkla genleşmedir."]],
          "Yazın teller ısı alır mı, verir mi?", ["Yazın hava sıcaktır; teller ısı alır.", "Isı alan metal teller genleşir ve uzar.", "Uzayan teller direkler arasında daha çok sarkar."],
          { kural: "Elektrik telleri yazın sarkar, kışın gerilir." }),
        Q("fgen.gunluk", "aciklama", 2, "Tren raylarının ek yerlerinde küçük boşluklar bırakılmasının nedeni nedir?", "Sıcak havada genleşen rayların eğilip bükülmesini önlemek",
          [["Soğukta rayların genleşmesine yer açmak", "kavrama", "Soğukta raylar büzülür; boşluk sıcakta genleşmeye yer açar."], ["Trenin daha hızlı gitmesini sağlamak", "bilgi", "Boşluğun amacı hız değil, genleşmeye yer bırakmaktır."], ["Ray yapımında malzemeden tasarruf etmek", "strateji", "Birkaç milimetrelik boşluk tasarruf amacıyla bırakılmaz."]],
          "Raylar yazın uzarsa boşluk olmasa ne olurdu?", ["Raylar metaldir; yazın ısınınca genleşip uzar.", "Ek yerinde boşluk olmasa uzayan raylar birbirini iter ve eğilir.", "Bırakılan boşluk, genleşen rayın uzayabileceği yeri sağlar."],
          { kural: "Köprü, ray ve kaldırımlarda genleşme için boşluk bırakılır." }),
        Q("fgen.gunluk", "uygulama", 2, "Açılmayan metal kapaklı bir cam kavanozu açmak için en uygun yöntem hangisidir?", "Kapağı bir süre sıcak su altında tutmak",
          [["Kavanozu buzdolabına koymak", "kavrama", "Soğuyan metal kapak büzülür ve daha da sıkışır."], ["Kapağı buzlu suya batırmak", "kavrama", "Soğuk su kapağı büzer; açmayı zorlaştırır."], ["Kavanozun dibini ısıtmak", "strateji", "Asıl genleşmesi gereken metal kapaktır; dibi ısıtmak işe yaramaz ve camı çatlatabilir."]],
          "Metal ve cam ısıtıldığında hangisi daha çok genleşir?", ["Metal kapak, cam kavanozdan daha çok genleşir.", "Kapak sıcak su altında tutulunca genleşir ve gevşer.", "Böylece kapak daha kolay açılır."],
          { kural: "Sıkışan metal kapak ısıtılınca genleşir ve gevşer." }),
        Q("fgen.gunluk", "transfer", 3, "Kalın bir cam bardağa birden kaynar su dökülünce bardak çatlıyor. Bunun nedeni nedir?", "Bardağın iç yüzeyi dış yüzeyinden önce ısınıp daha çok genleşir.",
          [["Cam, ısı alınca büzülür.", "kavrama", "Isı alan cam büzülmez, genleşir."], ["Suyun kütlesi bardağı kırar.", "bilgi", "Aynı su ılıkken dökülse bardak çatlamaz; neden kütle değil, sıcaklıktır."], ["Kaynar su bardağın içinde donar.", "dikkat", "Kaynar su donmaz; bu, olayla ilgisizdir."]],
          "Kalın camın iç ve dış yüzeyi aynı anda ısınır mı?", ["Kaynar su önce iç yüzeyi ısıtır; cam ısıyı yavaş ilettiği için dış yüzey henüz soğuktur.", "İç yüzey genleşir, dış yüzey aynı hızda genleşmez.", "Bu fark camda gerilme oluşturur ve bardak çatlayabilir."],
          { kural: "Bir cismin farklı yerleri farklı genleşirse cisimde çatlama olabilir." }),
        Q("fgen.gunluk", "transfer", 2, "Görseldeki köprüde iki beton parça arasında boşluk vardır. Bu boşluğa ne ad verilir ve hangi mevsimde en <b>dar</b> olur?", "Derz boşluğu; yazın en dar olur.",
          [["Derz boşluğu; kışın en dar olur.", "kavrama", "Kışın beton büzülür ve boşluk genişler."], ["Isı boşluğu; kışın en dar olur.", "bilgi", "Bu boşluğun adı derz boşluğudur ve kışın genişler."], ["Derz boşluğu; mevsime göre hiç değişmez.", "kavrama", "Beton sıcaklıkla genleşip büzüldüğü için boşluk değişir."]],
          "Yazın beton genleşir mi, büzülür mü?", ["Bu boşluğa derz boşluğu denir.", "Yazın beton parçalar genleşir ve birbirine yaklaşır; boşluk daralır.", "Kışın beton büzülür; boşluk genişler."],
          { gorsel: G.svg(420, 120, `<rect class="g-yumusak g-cizgi" x="20" y="40" width="180" height="30"/><rect class="g-yumusak g-cizgi" x="216" y="40" width="180" height="30"/><rect class="g-c" x="0" y="100" width="420" height="20"/><rect class="g-bos g-cizgi" x="40" y="70" width="20" height="30"/><rect class="g-bos g-cizgi" x="360" y="70" width="20" height="30"/>` + G.ok(208, 15, 208, 36) + G.yazi(208, 12, "boşluk", { k: 1 }), "köprüde iki beton parça arasında boşluk"), kural: "Yazın genleşme → boşluk daralır; kışın büzülme → boşluk genişler." }),
        Q("fgen.gunluk", "baglanti", 3, "Bir öğrenci yazın tam şişirilmiş bisiklet lastiğini uzun süre güneşte bırakırsa ne olabilir?", "İçindeki hava genleşir, lastik çok gerilir ve patlayabilir.",
          [["İçindeki hava büzülür, lastik söner.", "kavrama", "Güneşte ısınan hava büzülmez, genleşir."], ["Lastiğin içindeki havanın kütlesi artar.", "bilgi", "Kapalı lastikteki havanın kütlesi değişmez."], ["Hiçbir şey olmaz; gazlar genleşmez.", "bilgi", "Gazlar katı ve sıvılardan bile daha çok genleşir."]],
          "Lastiğin içindeki gaz ısınırsa ne olur?", ["Güneş lastiği ve içindeki havayı ısıtır.", "Isı alan hava genleşir ve lastiğin duvarlarını daha çok iter.", "Lastik zaten tam şişkinse bu fazla gerilme patlamaya yol açabilir."],
          { kural: "Kapalı kaptaki gaz ısınınca kabın duvarlarını daha çok iter." }),
      ],
    },
  });

  /* ======================= 2) HÂL DEĞİŞİM NOKTALARI ======================= */
  const SU_GRAFIK = () => grafik([[0, -20], [4, 0], [10, 0], [20, 100], [28, 100]], { ymin: -30, ymax: 120, isaret: [0, 100], harf: true });

  KONU_EKLE("fen", {
    id: "f_hal", tema: "f5", ad: "Maddenin Hâl Değişim Noktaları",
    kazanimlar: [
      { id: "fhal.olay", ad: "Erime, donma, buharlaşma, kaynama ve yoğuşmayı ısı alışverişiyle açıklama" },
      { id: "fhal.nokta", ad: "Erime, donma ve kaynama noktalarının saf maddeler için ayırt edici olduğunu açıklama" },
      { id: "fhal.grafik", ad: "Sıcaklık–zaman grafiğini ve tablosunu yorumlayarak hâl değişimlerini belirleme" },
    ],
    anlatim: [
      { baslik: "Hâl değişimleri",
        metin: "Maddeler ısı alarak ya da ısı vererek hâl değiştirir.<br><b>Isı alarak</b> gerçekleşenler: <b>erime</b> (katı → sıvı), <b>buharlaşma</b> ve <b>kaynama</b> (sıvı → gaz).<br><b>Isı vererek</b> gerçekleşenler: <b>donma</b> (sıvı → katı), <b>yoğuşma</b> (gaz → sıvı).<br><b>Buharlaşma</b> her sıcaklıkta, yalnızca sıvının <b>yüzeyinde</b> olur. <b>Kaynama</b> ise belirli bir sıcaklıkta, sıvının <b>her yerinde</b> kabarcıklar oluşarak gerçekleşir.",
        ornek: "Çamaşırın kuruması buharlaşma, soğuk bardağın dışının buğulanması yoğuşma, gölün kışın buz tutması donmadır.",
        gorsel: G.tablo(["Hâl değişimi", "Değişim", "Isı"], [["Erime", "Katı → Sıvı", "Alır"], ["Donma", "Sıvı → Katı", "Verir"], ["Buharlaşma / Kaynama", "Sıvı → Gaz", "Alır"], ["Yoğuşma", "Gaz → Sıvı", "Verir"]]),
        durak: { soru: "Aşağıdaki hâl değişimlerinden hangisi ısı <b>verilerek</b> gerçekleşir?", secenekler: [["Yoğuşma", true, "Gaz, ısı vererek sıvıya dönüşür."], ["Erime", false, "Erime için katı ısı almalıdır."], ["Kaynama", false, "Kaynayan sıvı ısı alır."], ["Buharlaşma", false, "Buharlaşan sıvı ısı alır; bu yüzden ter buharlaşırken serinleriz."]] } },
      { baslik: "Erime, donma ve kaynama noktası",
        metin: "Katı bir maddenin erimeye başladığı sıcaklığa <b>erime noktası</b>, sıvının donmaya başladığı sıcaklığa <b>donma noktası</b> denir. Saf bir maddenin <b>erime noktası donma noktasına eşittir</b>. Su 0 °C'ta erir ve 0 °C'ta donar.<br>Sıvının kaynamaya başladığı sıcaklığa <b>kaynama noktası</b> denir. Saf su deniz seviyesinde 100 °C'ta kaynar.<br>Erime ve kaynama noktaları maddenin <b>miktarına bağlı değildir</b>; her saf madde için farklıdır. Bu yüzden <b>saf maddeler için ayırt edici özelliktir</b>.",
        ornek: "Bir damla su da bir kova su da (deniz seviyesinde) 100 °C'ta kaynar; ama kovadaki suyun kaynamaya başlaması daha uzun sürer.",
        gorsel: G.tablo(["Madde", "Erime noktası (°C)", "Kaynama noktası (°C)"], [["Su", "0", "100"], ["Alkol (etil alkol)", "−114", "78"], ["Cıva", "−39", "357"]]),
        durak: { soru: "Saf bir maddenin miktarı iki katına çıkarılırsa kaynama noktası nasıl değişir?", secenekler: [["Değişmez", true, "Kaynama noktası madde miktarına bağlı değildir."], ["İki katına çıkar", false, "Miktar artınca kaynamaya ulaşma süresi uzar, sıcaklık değeri değişmez."], ["Yarıya iner", false, "Miktar kaynama noktasını değiştirmez."], ["Önce artar sonra azalır", false, "Kaynama noktası sabit bir değerdir."]] } },
      { baslik: "Hâl değişimi sırasında sıcaklık",
        metin: "Saf bir madde hâl değiştirirken aldığı ısıyı tanecikleri arasındaki bağları zayıflatmak için kullanır. Bu yüzden <b>hâl değişimi süresince sıcaklık sabit kalır</b>.<br>Sıcaklık–zaman grafiğinde <b>yatay (düz) bölümler</b> hâl değişimini gösterir. Bu bölümlerde madde <b>iki hâlde birlikte</b> bulunur (erimede katı + sıvı, kaynamada sıvı + gaz).<br>Eğik bölümlerde ise madde tek hâldedir ve sıcaklığı değişir.",
        ornek: "Grafikte −20 °C'taki buz ısıtılıyor. K–L arasında buz ısınır, L–M arasında erir (0 °C), M–N arasında su ısınır, N–P arasında kaynar (100 °C).",
        gorsel: SU_GRAFIK(),
        durak: { soru: "Saf suyun sıcaklık–zaman grafiğinde L–M aralığında sıcaklık neden değişmez?", secenekler: [["Buz erirken aldığı ısı hâl değişimi için kullanılır.", true, "Hâl değişimi süresince saf maddenin sıcaklığı sabit kalır."], ["Isıtma durdurulmuştur.", false, "Isıtma devam eder; ısı hâl değişimine harcanır."], ["Buz ısı vermektedir.", false, "Eriyen buz ısı alır."], ["Su kaynamaktadır.", false, "L–M aralığı 0 °C'tadır; bu erimedir, kaynama 100 °C'ta olur."]] } },
    ],
    uret: {
      "fhal.olay": [
        Q("fhal.olay", "hatirlama", 1, "Katı bir maddenin ısı alarak sıvı hâle geçmesine ne ad verilir?", "Erime",
          [["Donma", "bilgi", "Donma, sıvının ısı vererek katılaşmasıdır."], ["Yoğuşma", "bilgi", "Yoğuşma, gazın sıvıya dönüşmesidir."], ["Kaynama", "bilgi", "Kaynama, sıvının gaza dönüşmesidir."]],
          "Dondurmanın güneşte ne olduğunu düşün.", ["Katı → sıvı geçişine bakıyoruz.", "Bu geçiş için madde ısı alır.", "Bu hâl değişiminin adı erimedir."],
          { kural: "Erime: katı → sıvı (ısı alır). Donma: sıvı → katı (ısı verir)." }),
        Q("fhal.olay", "aciklama", 2, "Buharlaşma ile kaynama arasındaki fark hangisidir?", "Buharlaşma her sıcaklıkta yüzeyde, kaynama belirli sıcaklıkta sıvının her yerinde olur.",
          [["Buharlaşma ısı verir, kaynama ısı alır.", "kavrama", "İkisi de sıvının ısı alarak gaza dönüşmesidir."], ["Kaynama yalnızca yüzeyde olur.", "kavrama", "Kaynamada kabarcıklar sıvının her yerinde oluşur."], ["Buharlaşma yalnızca 100 °C'ta olur.", "bilgi", "Buharlaşma her sıcaklıkta olur; ıslak çamaşır soğukta da kurur."]],
          "Islak çamaşır kaynamadan kuruyabilir mi?", ["Her ikisinde de sıvı ısı alarak gaza dönüşür.", "Buharlaşma her sıcaklıkta ve yalnızca yüzeyde olur.", "Kaynama, kaynama noktasında ve sıvının her yerinde kabarcıklarla olur."],
          { kural: "Buharlaşma: her sıcaklıkta, yüzeyde. Kaynama: belirli sıcaklıkta, her yerde." }),
        Q("fhal.olay", "uygulama", 2, "Aşağıdaki olaylardan hangisinde madde ısı <b>vermiştir</b>?", "Soğuk su şişesinin dış yüzeyinde su damlacıkları oluşması",
          [["Islak çamaşırın kuruması", "kavrama", "Kuruma buharlaşmadır; su ısı alır."], ["Tereyağının tavada erimesi", "kavrama", "Erime ısı alarak gerçekleşir."], ["Çaydanlıktaki suyun kaynaması", "kavrama", "Kaynayan su ısı alır."]],
          "Hangi olay gazın sıvıya dönüşmesidir?", ["Havadaki su buharı soğuk şişeye çarpınca ısı verir.", "Isı veren su buharı sıvı damlacıklara dönüşür; bu yoğuşmadır.", "Diğer olaylar (kuruma, erime, kaynama) ısı alarak gerçekleşir."],
          { kural: "Yoğuşma ve donma ısı vererek; erime, buharlaşma ve kaynama ısı alarak olur." }),
        Q("fhal.olay", "transfer", 2, "Yaz günü terleyen bir sporcu, ter buharlaşırken serinlediğini hissediyor. Bunun nedeni nedir?", "Buharlaşan ter, ısıyı vücuttan alır.",
          [["Ter buharlaşırken vücuda ısı verir.", "kavrama", "Isı veren bir olay vücudu ısıtırdı; buharlaşma ısı alır."], ["Ter donarak vücudu soğutur.", "bilgi", "Vücut sıcaklığında ter donmaz."], ["Terin kütlesi artar.", "dikkat", "Terin kütlesi artmaz; buharlaşarak azalır."]],
          "Buharlaşma için gereken ısı nereden gelir?", ["Buharlaşma ısı alarak gerçekleşen bir hâl değişimidir.", "Ter bu ısıyı temas ettiği deriden, yani vücuttan alır.", "Vücut ısı kaybettiği için serinleriz."],
          { kural: "Buharlaşan sıvı bulunduğu yüzeyden ısı alır ve onu serinletir." }),
        Q("fhal.olay", "baglanti", 3, "Kışın camların iç yüzeyinde su damlacıkları oluşmasıyla ilgili hangisi doğrudur?", "Odadaki su buharı soğuk cama değince ısı verip yoğuşmuştur.",
          [["Cam erimiş ve su damlacıkları oluşmuştur.", "kavrama", "Cam oda sıcaklığında erimez; damlacıklar havadaki su buharından gelir."], ["Dışarıdaki yağmur camdan içeri geçmiştir.", "bilgi", "Su cam içinden geçemez; damlacıklar iç yüzeyde yoğuşmayla oluşur."], ["Su buharı soğuk camdan ısı alarak sıvılaşmıştır.", "kavrama", "Yoğuşmada su buharı ısı verir, almaz."]],
          "Su buharı soğuk bir yüzeye değerse ne olur?", ["İçerideki havada su buharı vardır.", "Kışın cam soğuktur; su buharı cama değince ısı verir.", "Isı veren gaz sıvıya dönüşür; bu yoğuşmadır."],
          { kural: "Su buharı soğuk yüzeyde ısı vererek yoğuşur." }),
        Q("fhal.olay", "uygulama", 1, "Şemadaki numaralı oklardan hangisi <b>donmayı</b> gösterir?", "3",
          [["1", "dikkat", "1 numaralı ok katıdan sıvıya geçiştir; bu erimedir."], ["2", "dikkat", "2 numaralı ok sıvıdan gaza geçiştir; bu buharlaşmadır."], ["4", "dikkat", "4 numaralı ok gazdan sıvıya geçiştir; bu yoğuşmadır."]],
          "Donma, hangi hâlden hangi hâle geçiştir?", ["Donma, sıvının ısı vererek katıya dönüşmesidir.", "Şemada sıvıdan katıya giden ok 3 numaralıdır.", "Cevap 3'tür."],
          { gorsel: G.svg(460, 170, `<rect class="g-yumusak g-cizgi" x="20" y="60" width="90" height="46" rx="8"/><rect class="g-yumusak g-cizgi" x="185" y="60" width="90" height="46" rx="8"/><rect class="g-yumusak g-cizgi" x="350" y="60" width="90" height="46" rx="8"/>` + G.yazi(65, 89, "Katı") + G.yazi(230, 89, "Sıvı") + G.yazi(395, 89, "Gaz") + G.ok(110, 70, 185, 70) + G.yazi(147, 60, "1", { b: 1 }) + G.ok(275, 70, 350, 70) + G.yazi(312, 60, "2", { b: 1 }) + G.ok(185, 98, 110, 98) + G.yazi(147, 124, "3", { b: 1 }) + G.ok(350, 98, 275, 98) + G.yazi(312, 124, "4", { b: 1 }), "hâl değişim şeması"), kural: "Katı → sıvı erime, sıvı → katı donma, sıvı → gaz buharlaşma, gaz → sıvı yoğuşma." }),
      ],
      "fhal.nokta": [
        Q("fhal.nokta", "hatirlama", 1, "Saf suyun deniz seviyesindeki kaynama noktası kaç °C'tur?", "100 °C",
          [["0 °C", "bilgi", "0 °C suyun erime ve donma noktasıdır."], ["50 °C", "bilgi", "Su deniz seviyesinde 50 °C'ta kaynamaz."], ["37 °C", "dikkat", "37 °C vücut sıcaklığımızdır."]],
          "Çaydanlıktaki su kaç derecede fokurdar?", ["Saf su deniz seviyesinde 100 °C'ta kaynar.", "Kaynama süresince sıcaklık 100 °C'ta sabit kalır."],
          { kural: "Saf su: erime/donma 0 °C, kaynama 100 °C (deniz seviyesinde)." }),
        Q("fhal.nokta", "aciklama", 2, "Saf bir maddenin erime noktası ile donma noktası için ne söylenebilir?", "Birbirine eşittir.",
          [["Erime noktası her zaman daha büyüktür.", "kavrama", "Saf maddede erime ve donma aynı sıcaklıkta olur."], ["Donma noktası her zaman daha büyüktür.", "kavrama", "İki değer eşittir."], ["Madde miktarına göre değişir.", "kavrama", "Erime ve donma noktaları miktara bağlı değildir."]],
          "Su kaç °C'ta erir, kaç °C'ta donar?", ["Su 0 °C'ta erir ve 0 °C'ta donar.", "Bu durum bütün saf maddeler için geçerlidir.", "Saf bir maddenin erime noktası donma noktasına eşittir."],
          { kural: "Saf maddelerde erime noktası = donma noktası." }),
        Q("fhal.nokta", "uygulama", 2, "Tabloya göre oda sıcaklığında (25 °C) <b>sıvı</b> olan madde hangisidir?", "Y",
          [["X", "islem", "X'in erime noktası 80 °C'tur; 25 °C'ta henüz erimemiştir, katıdır."], ["Z", "islem", "Z'nin kaynama noktası −10 °C'tur; 25 °C'ta gaz hâlindedir."], ["T", "islem", "T'nin erime noktası 40 °C'tur; 25 °C'ta katıdır."]],
          "Sıvı olması için sıcaklık, erime noktası ile kaynama noktası arasında olmalı.", ["Bir madde, sıcaklık erime noktasıyla kaynama noktası arasındaysa sıvıdır.", "Y için −20 °C ile 90 °C arası sıvı aralığıdır; 25 °C bu aralıktadır.", "X ve T 25 °C'ta katı, Z ise gazdır. Cevap Y'dir."],
          { gorsel: G.tablo(["Madde", "Erime noktası (°C)", "Kaynama noktası (°C)"], [["X", "80", "218"], ["Y", "−20", "90"], ["Z", "−80", "−10"], ["T", "40", "180"]]), kural: "Erime noktası altında katı, erime ile kaynama noktası arasında sıvı, kaynama noktası üstünde gaz." }),
        z => {
          const m1 = sec([100, 200, 250]), m2 = m1 * sec([2, 3]), mad = sec([["saf su", 100], ["alkol", 78]]);
          return S({ kaz: "fhal.nokta", duzey: "uygulama", zorluk: 2,
            soru: `Deniz seviyesinde ${m1} g ${mad[0]} ${mad[1]} °C'ta kaynıyor. Aynı ortamda ${m2} g ${mad[0]} kaç °C'ta kaynar?`,
            dogru: mad[1] + " °C",
            yanlis: [[mad[1] * m2 / m1 + " °C", "kavrama", "Miktar artınca kaynama noktası artmaz; yalnızca kaynamaya ulaşma süresi uzar."], [mad[1] + (m2 - m1) / 10 + " °C", "kavrama", "Kaynama noktası madde miktarına bağlı değildir."], [mad[1] / 2 + " °C", "islem", "Kaynama noktasını bölmenin bir anlamı yok; değer aynı kalır."]],
            ipucu: "Kaynama noktası miktara bağlı mıdır?",
            cozum: [`Aynı madde (${mad[0]}) ve aynı ortam söz konusu.`, "Kaynama noktası madde miktarına bağlı değildir; her saf madde için sabittir.", `Bu yüzden ${m2} g ${mad[0]} de ${mad[1]} °C'ta kaynar; yalnızca kaynamaya başlaması daha uzun sürer.`],
            kural: "Erime ve kaynama noktası madde miktarına bağlı değildir; ayırt edicidir." });
        },
        Q("fhal.nokta", "aciklama", 2, "Erime ve kaynama noktalarının <b>ayırt edici</b> özellik olmasının nedeni nedir?", "Her saf maddenin erime ve kaynama noktası kendine özgüdür ve miktara bağlı değildir.",
          [["Bütün maddelerin kaynama noktası 100 °C'tur.", "bilgi", "Yalnızca saf su deniz seviyesinde 100 °C'ta kaynar; alkol 78 °C'ta kaynar."], ["Madde miktarı arttıkça erime noktası artar.", "kavrama", "Erime noktası miktara bağlı değildir."], ["Her madde aynı sıcaklıkta erir.", "bilgi", "Su 0 °C'ta, demir çok yüksek bir sıcaklıkta erir; değerler farklıdır."]],
          "Ayırt edici özellik maddeleri birbirinden ayırmaya yarar.", ["Farklı saf maddelerin erime ve kaynama noktaları farklıdır.", "Aynı maddenin az ya da çok miktarının bu noktaları aynıdır.", "Bu yüzden bu noktalar maddeyi tanımamıza yardım eder; ayırt edicidir."],
          { kural: "Erime, donma ve kaynama noktası saf maddeler için ayırt edici özelliktir." }),
        Q("fhal.nokta", "transfer", 3, "Bir öğrenci kaynayan suyun sıcaklığını her dakika ölçüyor. Ocağın altını kıssa da açsa da kaynama süresince termometre hep 100 °C gösteriyor. Bu gözlemin açıklaması hangisidir?", "Kaynama süresince saf suyun sıcaklığı sabit kalır; alınan ısı hâl değişimine harcanır.",
          [["Termometre bozulmuştur.", "strateji", "Gözlem doğru; kaynama sırasında sıcaklık gerçekten sabittir."], ["Ocak suya ısı vermiyordur.", "kavrama", "Ocak ısı verir; bu ısı suyun buhara dönüşmesine harcanır."], ["Su ısı vererek kaynıyordur.", "kavrama", "Kaynayan su ısı alır."]],
          "Hâl değişimi sırasında saf maddenin sıcaklığına ne olur?", ["Su 100 °C'a ulaşınca kaynamaya başlar.", "Ocaktan gelen ısı suyun sıcaklığını artırmak yerine sıvıyı gaza dönüştürmek için kullanılır.", "Ateşi açmak kaynamayı hızlandırır ama sıcaklığı 100 °C'un üstüne çıkarmaz."],
          { kural: "Saf madde hâl değiştirirken sıcaklığı sabit kalır." }),
      ],
      "fhal.grafik": [
        Q("fhal.grafik", "uygulama", 2, "Grafik, −20 °C'taki buzun ısıtılmasını göstermektedir. Hangi aralıkta madde hem katı hem sıvı hâldedir?", "L–M",
          [["K–L", "dikkat", "K–L aralığında yalnızca buz (katı) ısınmaktadır."], ["M–N", "dikkat", "M–N aralığında yalnızca su (sıvı) ısınmaktadır."], ["N–P", "kavrama", "N–P aralığında su kaynamaktadır; sıvı ve gaz birliktedir."]],
          "Erime hangi sıcaklıkta olur ve grafikte nasıl görünür?", ["Hâl değişimleri grafikte yatay bölümlerle gösterilir.", "0 °C'taki yatay bölüm (L–M) erimeyi gösterir.", "Erime sırasında katı ve sıvı birlikte bulunur; cevap L–M'dir."],
          { gorsel: SU_GRAFIK(), kural: "Yatay bölüm = hâl değişimi = iki hâl birlikte." }),
        z => {
          const E = sec([-10, 10, 20, 30, 40, 60]), K = E + sec([50, 60, 80, 100]), T0 = E - sec([20, 30]);
          const t1 = sec([2, 3, 4]), t2 = t1 + sec([4, 5, 6]), t3 = t2 + sec([4, 5, 6]), t4 = t3 + sec([5, 6, 8]);
          const sor = sec(["erime", "kaynama"]), d = sor === "erime" ? E : K;
          return S({ kaz: "fhal.grafik", duzey: "uygulama", zorluk: 2,
            soru: `Saf X katısının ısıtılmasına ait sıcaklık–zaman grafiği verilmiştir. X'in <b>${sor} noktası</b> kaç °C'tur?`,
            gorsel: grafik([[0, T0], [t1, E], [t2, E], [t3, K], [t4, K]], { ymin: T0 - 10, ymax: K + 20, isaret: [T0, E, K] }),
            dogru: d + " °C",
            yanlis: [[(sor === "erime" ? K : E) + " °C", "dikkat", sor === "erime" ? "Bu, ikinci yatay bölümün sıcaklığıdır; o kaynama noktasıdır." : "Bu, ilk yatay bölümün sıcaklığıdır; o erime noktasıdır."], [T0 + " °C", "kavrama", "Bu, maddenin başlangıç sıcaklığıdır; hâl değişimi yatay bölümde olur."], [(sor === "erime" ? t2 - t1 : t4 - t3) + " °C", "dikkat", "Bu sayı yatay bölümün süresidir (dakika), sıcaklık değil."]],
            ipucu: "Grafikteki yatay bölümler hâl değişimini gösterir.",
            cozum: ["Isıtılan katının grafiğinde iki yatay bölüm vardır.", `Birinci yatay bölüm ${E} °C'ta: erime. İkinci yatay bölüm ${K} °C'ta: kaynama.`, `Sorulan ${sor} noktası ${d} °C'tur.`],
            kural: "Isıtma grafiğinde ilk yatay bölüm erime, ikinci yatay bölüm kaynama noktasıdır." });
        },
        z => {
          const E = sec([0, 10, 20, 30]), K = E + sec([60, 70, 80]);
          const hal = sec([["K–L", "katı"], ["M–N", "sıvı"], ["N–P", "sıvı + gaz"], ["L–M", "katı + sıvı"]]);
          const tum = ["katı", "sıvı", "gaz", "katı + sıvı", "sıvı + gaz"].filter(h => h !== hal[1]);
          const yanlisNeden = { "katı": "Katı hâl yalnızca erime noktasının altındaki eğik bölümdedir (K–L).", "sıvı": "Yalnızca sıvı olduğu bölüm M–N arasıdır.", "gaz": "Grafikte madde hiç tamamen gaz hâline geçmemiştir; N–P'de sıvı ve gaz birliktedir.", "katı + sıvı": "Katı ve sıvı birlikte yalnızca erime sırasında (L–M) bulunur.", "sıvı + gaz": "Sıvı ve gaz birlikte yalnızca kaynama sırasında (N–P) bulunur." };
          return S({ kaz: "fhal.grafik", duzey: "aciklama", zorluk: 2,
            soru: `Saf bir katının ısıtılmasına ait grafiğe göre <b>${hal[0]}</b> aralığında madde hangi hâldedir?`,
            gorsel: grafik([[0, E - 20], [3, E], [8, E], [14, K], [20, K]], { ymin: E - 30, ymax: K + 20, isaret: [E, K], harf: true }),
            dogru: hal[1],
            yanlis: karistir(tum).slice(0, 3).map(h => [h, "kavrama", yanlisNeden[h]]),
            ipucu: "Eğik bölümler tek hâli, yatay bölümler iki hâli birlikte gösterir.",
            cozum: ["K–L: katı ısınır. L–M: erime (katı + sıvı).", "M–N: sıvı ısınır. N–P: kaynama (sıvı + gaz).", `Bu yüzden ${hal[0]} aralığında madde ${hal[1]} hâlindedir.`],
            kural: "Yatay bölümde iki hâl birlikte bulunur; eğik bölümde madde tek hâldedir." });
        },
        Q("fhal.grafik", "aciklama", 3, "Grafik, 100 °C'taki su buharının soğutulmasını göstermektedir. M–N aralığında hangi olay gerçekleşmektedir?", "Su donmaktadır (sıvı + katı).",
          [["Su buharı yoğuşmaktadır.", "dikkat", "Yoğuşma 100 °C'taki ilk yatay bölümde (K–L) olur."], ["Buz erimektedir.", "kavrama", "Soğutma grafiğinde madde ısı verir; erime ısı alarak olur."], ["Su kaynamaktadır.", "kavrama", "Soğuyan su kaynamaz; 0 °C'taki yatay bölüm donmadır."]],
          "Soğutma grafiğinde ikinci yatay bölüm kaç °C'tadır?", ["Soğutmada madde ısı verir: önce yoğuşur, sonra donar.", "K–L (100 °C): yoğuşma. L–M: su soğur. M–N (0 °C): donma.", "M–N aralığında su donmaktadır; sıvı ve katı birliktedir."],
          { gorsel: grafik([[0, 100], [6, 100], [14, 0], [22, 0], [26, -20]], { ymin: -30, ymax: 120, isaret: [0, 100], harf: true }), kural: "Soğutma grafiğinde yatay bölümler yoğuşma ve donmayı gösterir." }),
        Q("fhal.grafik", "transfer", 3, "Aynı ocakta 200 g ve 400 g saf su ısıtılıyor. İki suyun sıcaklık–zaman grafikleri karşılaştırılırsa hangisi doğru olur?", "İkisi de 100 °C'ta kaynar; 400 g suyun kaynamaya ulaşması daha uzun sürer.",
          [["400 g su 200 °C'ta kaynar.", "kavrama", "Kaynama noktası miktara bağlı değildir; ikisi de 100 °C'ta kaynar."], ["200 g su daha geç kaynamaya başlar.", "dikkat", "Az olan su daha az ısıyla ısınır; daha önce kaynar."], ["İki grafik de tamamen aynıdır.", "kavrama", "Kaynama sıcaklıkları aynıdır ama ulaşma süreleri farklıdır."]],
          "Miktar neyi değiştirir: sıcaklığı mı, süreyi mi?", ["Kaynama noktası madde miktarına bağlı değildir; ikisi de 100 °C'ta kaynar.", "Daha çok su, aynı sıcaklığa ulaşmak için daha çok ısı (ve zaman) ister.", "Grafiklerde yatay bölümler aynı sıcaklıkta olur; 400 g suyun grafiği daha geç yataylaşır."],
          { kural: "Miktar hâl değişim sıcaklığını değil, ulaşma süresini değiştirir." }),
        Q("fhal.grafik", "baglanti", 3, "Tabloda saf bir sıvının ısıtılırken ölçülen sıcaklıkları verilmiştir. Bu maddenin kaynama noktası kaç °C'tur?", "78 °C",
          [["60 °C", "dikkat", "60 °C'ta sıcaklık artmaya devam ediyor; madde henüz kaynamıyor."], ["90 °C", "dikkat", "Tabloda 90 °C ölçülmemiş; sıcaklık 78 °C'ta sabit kalıyor."], ["20 °C", "kavrama", "20 °C başlangıç sıcaklığıdır."]],
          "Sıcaklığın birkaç dakika boyunca değişmediği değeri bul.", ["Hâl değişimi süresince saf maddenin sıcaklığı sabit kalır.", "Tabloda 6., 8. ve 10. dakikalarda sıcaklık 78 °C'ta sabit kalmıştır.", "Sıvı ısıtıldığı için bu hâl değişimi kaynamadır; kaynama noktası 78 °C'tur (alkolünkine eşit)."],
          { gorsel: G.tablo(["Zaman (dk)", "0", "2", "4", "6", "8", "10"], [["Sıcaklık (°C)", "20", "40", "60", "78", "78", "78"]]), kural: "Tabloda sıcaklığın sabit kaldığı değer hâl değişim noktasıdır." }),
      ],
    },
  });

  /* ============================ 3) YOĞUNLUK ============================ */
  const YOG = [["Alüminyum", 2.7], ["Demir", 7.9], ["Bakır", 8.9], ["Gümüş", 10.5], ["Kurşun", 11.3], ["Altın", 19.3]];
  const YOG_IN = { Alüminyum: "Alüminyumun", Demir: "Demirin", Bakır: "Bakırın", Gümüş: "Gümüşün", Kurşun: "Kurşunun", Altın: "Altının" };
  const YOG_TABLO = () => G.tablo(["Madde", "Yoğunluk (g/cm³)"], YOG.map(([a, d]) => [a, od(d)]));

  KONU_EKLE("fen", {
    id: "f_yogunluk", tema: "f5", ad: "Yoğunluk",
    kazanimlar: [
      { id: "fyog.hesap", ad: "Kütle ve hacim ölçümlerinden yoğunluğu hesaplama (yoğunluk = kütle ÷ hacim)" },
      { id: "fyog.ayirt", ad: "Yoğunluğun ayırt edici bir özellik olduğunu açıklama ve maddeyi yoğunluğundan tanıma" },
      { id: "fyog.yuzme", ad: "Yoğunluğa göre yüzme–batmayı ve karışmayan sıvıların katmanlaşmasını açıklama" },
    ],
    anlatim: [
      { baslik: "Yoğunluk nedir, nasıl hesaplanır?",
        metin: "Bir maddenin <b>birim hacminin kütlesine</b> yoğunluk denir. 1 cm³'lük parçasının kaç gram geldiğini gösterir.<br><b>Yoğunluk = Kütle ÷ Hacim</b> (d = m ÷ V). Kütle gram (g), hacim santimetreküp (cm³) ise yoğunluğun birimi <b>g/cm³</b> olur.<br>Kütle eşit kollu terazi ya da baskülle ölçülür. Düzgün olmayan bir cismin hacmi, <b>dereceli silindirdeki suya</b> atılarak bulunur: su seviyesindeki artış cismin hacmidir. (1 mL = 1 cm³)",
        ornek: "Kütlesi 54 g olan bir taş, 40 mL su bulunan dereceli silindire atılınca su 60 mL'ye çıkıyor. Hacim 60 − 40 = 20 cm³; yoğunluk 54 ÷ 20 = 2,7 g/cm³.",
        gorsel: silindir(40, 60, 100, "taş atılıyor"),
        durak: { soru: "Kütlesi 30 g, hacmi 10 cm³ olan bir cismin yoğunluğu kaç g/cm³'tür?", secenekler: [["3", true, "Yoğunluk = 30 ÷ 10 = 3 g/cm³."], ["300", false, "Kütle ile hacim çarpılmaz; kütle hacme bölünür."], ["40", false, "Kütle ile hacim toplanmaz."], ["0,3", false, "Hacmi kütleye böldün; doğrusu kütle ÷ hacim."]] } },
      { baslik: "Yoğunluk ayırt edici bir özelliktir",
        metin: "Aynı sıcaklıkta her saf maddenin yoğunluğu <b>kendine özgüdür</b>. Bu yüzden yoğunluk <b>ayırt edici bir özelliktir</b>.<br>Bir maddenin miktarı artınca kütlesi ve hacmi <b>aynı oranda</b> artar; yoğunluğu değişmez. Yani bir demir çivinin de demir bir kapının da yoğunluğu aynıdır.<br>Kütle ve hacim tek başına ayırt edici değildir; çünkü farklı maddelerin kütleleri ya da hacimleri eşit olabilir.",
        ornek: "Bir altın yüzüğün yoğunluğu 19,3 g/cm³ ise aynı saflıktaki altın külçenin yoğunluğu da 19,3 g/cm³'tür.",
        gorsel: YOG_TABLO(),
        durak: { soru: "Bir tahta blok ikiye kesiliyor. Parçalardan birinin yoğunluğu için ne söylenebilir?", secenekler: [["Bloğun yoğunluğuna eşittir.", true, "Kütle de hacim de yarıya iner; oranları (yoğunluk) değişmez."], ["Yarıya iner.", false, "Yalnızca kütle ve hacim yarıya iner; yoğunluk aynı kalır."], ["İki katına çıkar.", false, "Kesmek maddenin cinsini değiştirmez; yoğunluk aynıdır."], ["Sıfır olur.", false, "Her madde parçasının bir yoğunluğu vardır."]] } },
      { baslik: "Yüzme, batma ve katmanlaşma",
        metin: "Suyun yoğunluğu yaklaşık <b>1 g/cm³</b>'tür.<br>• Yoğunluğu sudan <b>küçük</b> olan cisim suda <b>yüzer</b> (tahta, buz, zeytinyağı).<br>• Yoğunluğu sudan <b>büyük</b> olan cisim suda <b>batar</b> (demir, taş).<br>• Yoğunluğu suya <b>eşit</b> olan cisim suyun içinde <b>askıda kalır</b>.<br>Birbirine karışmayan sıvılar bir kaba konunca <b>yoğunluğu büyük olan altta, küçük olan üstte</b> toplanır; buna katmanlaşma denir.",
        ornek: "Buzun yoğunluğu (yaklaşık 0,92 g/cm³) sudan küçük olduğu için buz suda yüzer. Kışın göllerin üstü buz tutar, buzun altında canlılar yaşamaya devam eder.",
        gorsel: katman(["Zeytinyağı", "Su", "Bal"]),
        durak: { soru: "Bal, su ve zeytinyağı aynı kaba dökülünce zeytinyağı en üstte kalıyor. Bunun nedeni nedir?", secenekler: [["Zeytinyağının yoğunluğu en küçüktür.", true, "Yoğunluğu küçük sıvı üstte toplanır."], ["Zeytinyağının kütlesi en küçüktür.", false, "Sıvıların sıralanması kütleye değil yoğunluğa bağlıdır."], ["Zeytinyağı en son dökülmüştür.", false, "Hangi sırayla dökülürse dökülsün zeytinyağı üste çıkar."], ["Zeytinyağının yoğunluğu en büyüktür.", false, "Yoğunluğu en büyük sıvı en altta toplanır."]] } },
    ],
    uret: {
      "fyog.hesap": [
        z => {
          const d = sec([0.8, 1.2, 1.5, 2, 2.5, 2.7, 3, 4, 8]), V = sec([10, 20, 30, 40, 50]), m = Math.round(d * V * 10) / 10;
          return S({ kaz: "fyog.hesap", duzey: "uygulama", zorluk: 1,
            soru: `Kütlesi ${od(m)} g, hacmi ${V} cm³ olan bir cismin yoğunluğu kaç g/cm³'tür?`,
            dogru: od(d) + " g/cm³",
            yanlis: [[od(m * V) + " g/cm³", "kavrama", "Kütle ile hacmi çarptın; yoğunluk = kütle ÷ hacim."], [od(Math.round(V / m * 100) / 100) + " g/cm³", "kavrama", "Hacmi kütleye böldün; kütleyi hacme bölmelisin."], [od(Math.round((m + V) * 10) / 10) + " g/cm³", "islem", "Kütle ile hacim toplanmaz; bölünür."]],
            ipucu: "Yoğunluk = kütle ÷ hacim",
            cozum: [`Verilen: kütle ${od(m)} g, hacim ${V} cm³. İstenen: yoğunluk.`, `Yoğunluk = ${od(m)} ÷ ${V}`, `Yoğunluk = ${od(d)} g/cm³.`],
            kural: "d = m ÷ V; birimi g/cm³." });
        },
        z => {
          const once = sec([30, 40, 50]), V = sec([10, 15, 20, 25]), d = sec([2, 2.7, 3, 4, 7.9]), m = Math.round(d * V * 10) / 10;
          return S({ kaz: "fyog.hesap", duzey: "uygulama", zorluk: 2,
            soru: `Kütlesi ${od(m)} g olan bir taş, ${once} mL su bulunan dereceli silindire atılınca su seviyesi ${once + V} mL oluyor. Taşın yoğunluğu kaç g/cm³'tür?`,
            gorsel: silindir(once, once + V, 100),
            dogru: od(d) + " g/cm³",
            yanlis: [[od(Math.round(m / (once + V) * 100) / 100) + " g/cm³", "kavrama", "Son su seviyesini hacim aldın; taşın hacmi seviyedeki artıştır."], [od(Math.round(m / once * 100) / 100) + " g/cm³", "kavrama", "İlk su seviyesi taşın hacmi değildir; artış miktarını bulmalısın."], [od(m * V) + " g/cm³", "islem", "Kütle ile hacmi çarptın; bölmelisin."]],
            ipucu: "Önce taşın hacmini bul: son seviye − ilk seviye.",
            cozum: [`Taşın hacmi = ${once + V} − ${once} = ${V} mL = ${V} cm³.`, `Yoğunluk = kütle ÷ hacim = ${od(m)} ÷ ${V}.`, `Yoğunluk = ${od(d)} g/cm³.`],
            kural: "Taşırma ya da dereceli silindirde cismin hacmi = su seviyesindeki artış; 1 mL = 1 cm³." });
        },
        z => {
          const d = sec([0.8, 1.5, 2, 2.5, 3, 4]), V = sec([5, 10, 20, 30, 40]), m = Math.round(d * V * 10) / 10;
          return S({ kaz: "fyog.hesap", duzey: "uygulama", zorluk: 2,
            soru: `Yoğunluğu ${od(d)} g/cm³ olan bir maddeden ${V} cm³ alınıyor. Bu parçanın kütlesi kaç gramdır?`,
            dogru: od(m) + " g",
            yanlis: [[od(Math.round(V / d * 100) / 100) + " g", "kavrama", "Hacmi yoğunluğa böldün; kütle = yoğunluk × hacim."], [od(Math.round((d + V) * 10) / 10) + " g", "islem", "Yoğunluk ile hacim toplanmaz; çarpılır."], [od(Math.round(d / V * 1000) / 1000) + " g", "kavrama", "Yoğunluğu hacme böldün; kütleyi bulmak için çarpmalısın."]],
            ipucu: "Kütle = yoğunluk × hacim",
            cozum: [`Verilen: yoğunluk ${od(d)} g/cm³, hacim ${V} cm³. İstenen: kütle.`, "d = m ÷ V olduğundan m = d × V olur.", `Kütle = ${od(d)} × ${V} = ${od(m)} g.`],
            kural: "Kütle = yoğunluk × hacim; hacim = kütle ÷ yoğunluk." });
        },
        z => {
          const d = sec([2, 4, 5, 8]), V = sec([5, 10, 15, 20]), m = d * V;
          return S({ kaz: "fyog.hesap", duzey: "uygulama", zorluk: 2,
            soru: `Yoğunluğu ${d} g/cm³ olan bir cismin kütlesi ${m} g'dır. Cismin hacmi kaç cm³'tür?`,
            dogru: V + " cm³",
            yanlis: [[m * d + " cm³", "kavrama", "Kütle ile yoğunluğu çarptın; hacim = kütle ÷ yoğunluk."], [m - d + " cm³", "islem", "Kütleden yoğunluk çıkarılmaz; kütle yoğunluğa bölünür."], [m + d + " cm³", "islem", "Kütle ile yoğunluk toplanmaz."]],
            ipucu: "Hacim = kütle ÷ yoğunluk",
            cozum: [`Verilen: kütle ${m} g, yoğunluk ${d} g/cm³.`, "d = m ÷ V ise V = m ÷ d olur.", `Hacim = ${m} ÷ ${d} = ${V} cm³.`],
            kural: "Hacim = kütle ÷ yoğunluk." });
        },
        Q("fyog.hesap", "aciklama", 1, "Yoğunluğun birimi aşağıdakilerden hangisi olabilir?", "g/cm³",
          [["g", "bilgi", "Gram kütlenin birimidir."], ["cm³", "bilgi", "Santimetreküp hacmin birimidir."], ["°C", "bilgi", "Santigrat derece sıcaklığın birimidir."]],
          "Yoğunluk, kütlenin hacme bölümüdür.", ["Yoğunluk = kütle ÷ hacim.", "Kütle g, hacim cm³ ile ölçülürse birim g/cm³ olur."],
          { kural: "Yoğunluk birimi: g/cm³ (ya da g/mL)." }),
        Q("fyog.hesap", "transfer", 3, "Eşit kollu terazinin bir kefesinde 4 cm³ bakır, diğer kefesinde alüminyum parça vardır. Terazi dengede olduğuna göre alüminyumun hacmi yaklaşık kaç cm³'tür? (Bakır 9 g/cm³, alüminyum 3 g/cm³ alınacak.)", "12 cm³",
          [["4 cm³", "kavrama", "Eşit kütleli farklı maddelerin hacimleri eşit olmaz."], ["36 cm³", "islem", "36 g bakırın kütlesidir; alüminyumun hacmi için 36 ÷ 3 yapmalısın."], ["1,3 cm³", "kavrama", "Yoğunluğu küçük olan maddenin aynı kütle için hacmi daha büyük olmalı."]],
          "Önce bakırın kütlesini bul; terazi dengede ise kütleler eşittir.", ["Bakırın kütlesi = 9 × 4 = 36 g.", "Terazi dengede olduğuna göre alüminyumun kütlesi de 36 g'dır.", "Alüminyumun hacmi = 36 ÷ 3 = 12 cm³."],
          { gorsel: G.svg(400, 150, `<line class="g-cizgi" x1="200" y1="40" x2="200" y2="140" stroke-width="4"/><line class="g-cizgi" x1="70" y1="40" x2="330" y2="40" stroke-width="4"/><line class="g-cizgi" x1="80" y1="40" x2="80" y2="90"/><line class="g-cizgi" x1="320" y1="40" x2="320" y2="90"/><rect class="g-yumusak g-cizgi" x="40" y="90" width="80" height="8"/><rect class="g-yumusak g-cizgi" x="280" y="90" width="80" height="8"/><rect class="g-d g-cizgi" x="68" y="68" width="24" height="22"/><rect class="g-ince g-bos" x="290" y="54" width="60" height="36"/><rect class="g-c g-cizgi" x="292" y="56" width="56" height="34"/>` + G.yazi(80, 118, "bakır", { k: 1 }) + G.yazi(320, 118, "alüminyum", { k: 1 }), "dengedeki eşit kollu terazide bakır ve alüminyum"), kural: "Kütleleri eşit maddelerden yoğunluğu küçük olanın hacmi büyüktür." }),
      ],
      "fyog.ayirt": [
        z => {
          const [ad, d] = sec(YOG), V = sec([2, 4, 5, 10]), m = Math.round(d * V * 10) / 10;
          const digerleri = karistir(YOG.filter(y => y[0] !== ad)).slice(0, 3);
          return S({ kaz: "fyog.ayirt", duzey: "uygulama", zorluk: 2,
            soru: `Kütlesi ${od(m)} g, hacmi ${V} cm³ olan saf bir metal parçası tablodaki maddelerden hangisidir?`,
            gorsel: YOG_TABLO(),
            dogru: ad,
            yanlis: digerleri.map(([a, dd]) => [a, "islem", `${YOG_IN[a]} yoğunluğu ${od(dd)} g/cm³; hesapladığın ${od(d)} g/cm³ ile uyuşmuyor.`]),
            ipucu: "Önce yoğunluğu hesapla, sonra tabloda ara.",
            cozum: [`Yoğunluk = ${od(m)} ÷ ${V} = ${od(d)} g/cm³.`, `Tabloda yoğunluğu ${od(d)} g/cm³ olan madde: ${ad}.`, `Yoğunluk ayırt edici olduğu için bu parça ${ad.toLocaleLowerCase("tr")} olmalıdır.`],
            kural: "Yoğunluk ayırt edicidir; hesaplanan yoğunluk tablodaki değerle karşılaştırılarak madde tanınır." });
        },
        Q("fyog.ayirt", "aciklama", 2, "Aşağıdakilerden hangisi saf maddeler için <b>ayırt edici</b> bir özelliktir?", "Yoğunluk",
          [["Kütle", "kavrama", "Farklı maddelerin kütleleri eşit olabilir; kütle ayırt edici değildir."], ["Hacim", "kavrama", "Farklı maddelerin hacimleri eşit olabilir; hacim ayırt edici değildir."], ["Sıcaklık", "kavrama", "Farklı maddeler aynı sıcaklıkta bulunabilir; sıcaklık ayırt edici değildir."]],
          "Miktara bağlı olmayan, maddeye özgü olan özellik hangisi?", ["Kütle ve hacim madde miktarına bağlıdır; farklı maddelerde eşit olabilir.", "Yoğunluk, kütlenin hacme oranıdır ve miktara bağlı değildir.", "Her saf maddenin yoğunluğu kendine özgü olduğundan yoğunluk ayırt edicidir."],
          { kural: "Ayırt edici: yoğunluk, erime/kaynama noktası, (katı ve sıvılarda) genleşme. Ayırt edici değil: kütle, hacim, sıcaklık." }),
        Q("fyog.ayirt", "uygulama", 2, "Tabloda aynı maddeden yapılmış üç parçanın kütle ve hacimleri verilmiştir. Hangi yargı doğrudur?", "Üç parçanın yoğunluğu da 2,7 g/cm³'tür.",
          [["En büyük parçanın yoğunluğu en büyüktür.", "kavrama", "Kütle ve hacim birlikte arttığı için yoğunluk değişmez."], ["En küçük parçanın yoğunluğu en büyüktür.", "kavrama", "Yoğunluk parçanın büyüklüğüne bağlı değildir."], ["Parçaların yoğunlukları 27, 54 ve 81 g/cm³'tür.", "islem", "Bunlar kütlelerdir; yoğunluk için kütleyi hacme bölmelisin."]],
          "Her parça için kütleyi hacme böl.", ["1. parça: 27 ÷ 10 = 2,7 g/cm³.", "2. parça: 54 ÷ 20 = 2,7 g/cm³; 3. parça: 81 ÷ 30 = 2,7 g/cm³.", "Aynı maddenin bütün parçalarının yoğunluğu eşittir."],
          { gorsel: G.tablo(["Parça", "Kütle (g)", "Hacim (cm³)"], [["1", "27", "10"], ["2", "54", "20"], ["3", "81", "30"]]), kural: "Aynı maddenin farklı parçalarının yoğunluğu aynıdır." }),
        Q("fyog.ayirt", "transfer", 3, "Bir kuyumcu, satın aldığı yüzüğün saf altın olup olmadığını anlamak istiyor. Hangi yöntem en uygundur?", "Yüzüğün kütlesini ve hacmini ölçüp yoğunluğunu hesaplamak",
          [["Yüzüğün yalnızca kütlesini ölçmek", "strateji", "Kütle ayırt edici değildir; farklı maddelerin kütleleri eşit olabilir."], ["Yüzüğün rengine bakmak", "strateji", "Altın rengindeki başka metaller ya da alaşımlar olabilir; renk kesin sonuç vermez."], ["Yüzüğün yalnızca hacmini ölçmek", "strateji", "Hacim tek başına ayırt edici değildir."]],
          "Ayırt edici özelliği ölçmek gerekir.", ["Saf altının yoğunluğu 19,3 g/cm³'tür.", "Yüzüğün kütlesi terazi ile, hacmi su dolu dereceli silindirle ölçülür.", "Hesaplanan yoğunluk 19,3 g/cm³ ise yüzük saf altın olabilir; değilse başka maddeler karışmıştır."],
          { kural: "Bir maddeyi tanımak için ayırt edici özelliği (yoğunluk) kullanılır." }),
        Q("fyog.ayirt", "baglanti", 3, "Bir öğrenci “Bir kova su, bir bardak sudan daha yoğundur.” diyor. Bu ifade için hangisi doğrudur?", "Yanlıştır; kovadaki suyun kütlesi daha büyüktür ama yoğunlukları eşittir.",
          [["Doğrudur; kovadaki suyun kütlesi daha büyüktür.", "kavrama", "Kütlenin büyük olması yoğunluğun büyük olduğunu göstermez; hacim de büyüktür."], ["Yanlıştır; bardaktaki su daha yoğundur.", "kavrama", "Aynı sıcaklıktaki aynı maddenin yoğunluğu miktara bağlı değildir."], ["Doğrudur; kovanın hacmi daha büyüktür.", "kavrama", "Hacmin büyük olması yoğunluğu artırmaz."]],
          "Ağırlık ile yoğunluk aynı şey mi?", ["Kovadaki suyun hem kütlesi hem hacmi bardaktakinden fazladır.", "Kütle ve hacim aynı oranda arttığı için kütle ÷ hacim değişmez.", "İki suyun yoğunluğu da yaklaşık 1 g/cm³'tür; ifade yanlıştır."],
          { kural: "“Ağır” olmak “yoğun” olmak demek değildir." }),
      ],
      "fyog.yuzme": [
        Q("fyog.yuzme", "hatirlama", 1, "Yoğunluğu sudan küçük olan bir cisim suya bırakılınca ne olur?", "Yüzer.",
          [["Batar.", "kavrama", "Yoğunluğu sudan büyük cisimler batar."], ["Askıda kalır.", "kavrama", "Askıda kalma, yoğunluk suyunkine eşitken olur."], ["Erir.", "bilgi", "Suya bırakılan cisim erimez; yoğunluğuna göre yüzer ya da batar."]],
          "Suyun yoğunluğu 1 g/cm³'tür.", ["Cismin yoğunluğu sudan küçükse cisim suyun üstüne çıkar.", "Bu nedenle cisim suda yüzer."],
          { kural: "d(cisim) < d(su) → yüzer; d(cisim) > d(su) → batar; eşitse askıda kalır." }),
        z => {
          const liste = karistir([["A", 0.6], ["B", 2.5], ["C", 0.9], ["D", 7.9], ["E", 1.3], ["F", 0.2]]).slice(0, 4);
          const yuzen = liste.filter(x => x[1] < 1).map(x => x[0]);
          if (yuzen.length < 1 || yuzen.length > 2) return null;
          const batan = liste.filter(x => x[1] > 1).map(x => x[0]);
          const dogru = yuzen.join(" ve ");
          return S({ kaz: "fyog.yuzme", duzey: "uygulama", zorluk: 2,
            soru: "Tabloda yoğunlukları verilen cisimler suya (1 g/cm³) bırakılıyor. Hangileri suda <b>yüzer</b>?",
            gorsel: G.tablo(["Cisim", "Yoğunluk (g/cm³)"], liste.map(([a, d]) => [a, od(d)])),
            dogru,
            yanlis: [[batan.join(" ve "), "kavrama", "Bu cisimlerin yoğunluğu sudan büyük; batarlar."], ["Hepsi", "kavrama", "Yoğunluğu sudan büyük cisimler yüzmez."], [yuzen.length === 2 ? yuzen[0] : batan[0], "dikkat", yuzen.length === 2 ? "Yoğunluğu 1'den küçük başka bir cisim de var; onu atladın." : "Bu cismin yoğunluğu 1 g/cm³'ten büyük; batar."]],
            ipucu: "Yoğunluğu 1 g/cm³'ten küçük olanları seç.",
            cozum: ["Suyun yoğunluğu 1 g/cm³'tür.", "Yoğunluğu 1'den küçük olanlar yüzer, büyük olanlar batar.", `Yüzenler: ${dogru}.`],
            kural: "Sudan az yoğun olan yüzer, sudan çok yoğun olan batar." });
        },
        Q("fyog.yuzme", "uygulama", 2, "Görseldeki kapta birbirine karışmayan üç sıvı vardır. Sıvıların yoğunlukları için hangi sıralama doğrudur?", "Z > Y > X",
          [["X > Y > Z", "kavrama", "En üstteki sıvı en az yoğun olandır; sıralamayı ters yaptın."], ["Y > Z > X", "dikkat", "En alttaki sıvı (Z) en yoğundur."], ["X = Y = Z", "kavrama", "Yoğunlukları eşit olsaydı katman oluşmazdı."]],
          "En yoğun sıvı kabın neresinde toplanır?", ["Karışmayan sıvılarda yoğunluğu büyük olan alta çöker.", "En altta Z, ortada Y, en üstte X vardır.", "Yoğunluk sıralaması: Z > Y > X."],
          { gorsel: katman(["X sıvısı", "Y sıvısı", "Z sıvısı"]), kural: "Katmanlaşmada en yoğun sıvı en altta, en az yoğun sıvı en üsttedir." }),
        Q("fyog.yuzme", "aciklama", 2, "Buz suda yüzer. Bunun nedeni nedir?", "Buzun yoğunluğu suyun yoğunluğundan küçüktür.",
          [["Buz sudan hafiftir; kütlesi küçüktür.", "kavrama", "Büyük bir buzdağı da yüzer; belirleyici olan kütle değil yoğunluktur."], ["Buzun yoğunluğu sudan büyüktür.", "kavrama", "Yoğunluğu büyük olsaydı batardı."], ["Buz soğuk olduğu için yüzer.", "kavrama", "Yüzme sıcaklığa değil, yoğunluk farkına bağlıdır."]],
          "Yüzme ya da batmayı belirleyen özellik nedir?", ["Buzun yoğunluğu yaklaşık 0,92 g/cm³, suyunki 1 g/cm³'tür.", "Yoğunluğu küçük olan cisim, yoğunluğu büyük olan sıvıda yüzer.", "Bu yüzden buz suda yüzer; göllerin üstü buz tutar ama altı donmaz."],
          { kural: "Yüzme–batmayı kütle değil, yoğunluk belirler." }),
        Q("fyog.yuzme", "transfer", 3, "Musluk suyunda batan bir yumurta, suya bolca tuz eklenip karıştırılınca yüzmeye başlıyor. Bunun nedeni nedir?", "Tuz eklenince suyun yoğunluğu artmış ve yumurtanınkinden büyük olmuştur.",
          [["Yumurtanın yoğunluğu artmıştır.", "kavrama", "Yumurtaya bir şey olmadı; değişen suyun yoğunluğudur."], ["Suyun yoğunluğu azalmıştır.", "kavrama", "Tuz çözünce suyun yoğunluğu artar."], ["Yumurtanın kütlesi azalmıştır.", "bilgi", "Yumurtanın kütlesi değişmemiştir."]],
          "Değişen şey yumurta mı, sıvı mı?", ["Başta yumurtanın yoğunluğu musluk suyundan büyüktü; yumurta battı.", "Tuz çözününce sıvının yoğunluğu arttı.", "Sıvının yoğunluğu yumurtanınkini geçince yumurta yüzmeye başladı."],
          { kural: "Bir cisim, yoğunluğu kendisinden büyük olan sıvıda yüzer." }),
        Q("fyog.yuzme", "baglanti", 3, "Görselde yoğunlukları farklı sıvılar katmanlaşmış ve içine K, L katı cisimleri bırakılmıştır. K, iki üst sıvının sınırında; L, en alt sıvının içinde dengededir. Hangisi kesinlikle doğrudur?", "L'nin yoğunluğu K'nınkinden büyüktür.",
          [["K'nın yoğunluğu L'ninkinden büyüktür.", "kavrama", "Daha derinde dengede kalan cisim daha yoğundur; bu L'dir."], ["K ve L'nin yoğunlukları eşittir.", "dikkat", "Eşit olsalardı aynı yükseklikte dengede kalırlardı."], ["L'nin kütlesi K'nınkinden büyüktür.", "kavrama", "Konum kütleyi değil yoğunluğu gösterir; kütleler hakkında bilgi yok."]],
          "Bir cisim, yoğunluğu kendisinden küçük sıvıda batar, büyük sıvıda yüzer.", ["K, üstteki sıvıda batıp ortadaki sıvının üstünde kalmıştır; yoğunluğu bu iki sıvının arasındadır.", "L ise ortadaki sıvıdan da yoğun olduğu için en alttaki sıvıya kadar inmiştir.", "Bu yüzden L'nin yoğunluğu K'nınkinden büyüktür."],
          { gorsel: katman(["Zeytinyağı", "Su", "Bal"], { cisimler: [["K", 0.5], ["L", 2]] }), kural: "Sıvıda daha aşağıda dengede kalan cisim daha yoğundur." }),
      ],
    },
  });

  /* ======================= 4) ELEKTRİĞİN İLETİMİ ======================= */
  const ILETKEN = ["bakır tel", "alüminyum folyo", "demir çivi", "çelik kaşık", "kurşun kalem ucu (grafit)", "gümüş yüzük", "metal ataş"];
  const YALITKAN = ["plastik cetvel", "tahta kalem", "cam çubuk", "silgi", "kâğıt", "lastik eldiven", "porselen fincan", "yün ip"];

  KONU_EKLE("fen", {
    id: "f_iletim", tema: "f6", ad: "Elektriğin İletimi",
    kazanimlar: [
      { id: "file.iletken", ad: "Maddeleri elektriği iletme durumlarına göre iletken ve yalıtkan olarak sınıflandırma" },
      { id: "file.test", ad: "Basit bir devre kurarak maddelerin iletkenliğini test etme ve sonuçları yorumlama" },
      { id: "file.guvenlik", ad: "İletken ve yalıtkan maddelerin günlük hayattaki kullanımını ve elektrik güvenliğini açıklama" },
    ],
    anlatim: [
      { baslik: "İletken ve yalıtkan maddeler",
        metin: "Elektrik akımını üzerinden kolayca geçiren maddelere <b>iletken</b>, geçirmeyen maddelere <b>yalıtkan</b> denir.<br><b>İletkenler:</b> bakır, alüminyum, demir, altın, gümüş gibi <b>metaller</b>; kurşun kalemin ucundaki <b>grafit</b>; <b>tuzlu su</b>; insan vücudu ve toprak.<br><b>Yalıtkanlar:</b> plastik, cam, kuru tahta, lastik, kâğıt, porselen, kumaş ve kuru hava.<br>Saf su elektriği çok az iletir; ancak musluk suyunda çözünmüş maddeler bulunduğu için o iletir. Bu yüzden ıslak elle elektrikli araçlara dokunmak tehlikelidir.",
        ornek: "Kablonun içi bakırdan (iletken), dışı plastikten (yalıtkan) yapılır: akım bakırdan geçer, plastik bizi korur.",
        gorsel: G.tablo(["İletken", "Yalıtkan"], [["Bakır, alüminyum, demir", "Plastik, lastik"], ["Altın, gümüş", "Cam, porselen"], ["Grafit (kalem ucu)", "Kuru tahta, kâğıt"], ["Tuzlu su, insan vücudu", "Kumaş, kuru hava"]]),
        durak: { soru: "Aşağıdakilerden hangisi elektriği <b>iletir</b>?", secenekler: [["Kurşun kalem ucu (grafit)", true, "Grafit metal olmadığı hâlde elektriği iletir."], ["Plastik cetvel", false, "Plastik yalıtkandır."], ["Cam bardak", false, "Cam yalıtkandır."], ["Silgi", false, "Silgi yalıtkandır."]] } },
      { baslik: "Devre ile iletkenlik testi",
        metin: "Bir maddenin iletken olup olmadığını anlamak için pil, ampul, anahtar ve bağlantı kablolarından oluşan basit bir devre kurulur. Devrede bir boşluk bırakılır ve test edilecek madde bu boşluğa bağlanır.<br>• <b>Ampul yanarsa</b> akım maddenin üzerinden geçmiştir; madde <b>iletkendir</b>.<br>• <b>Ampul yanmazsa</b> akım geçememiştir; madde <b>yalıtkandır</b>.<br>Testin doğru olması için devredeki diğer elemanların (pil, ampul, kablolar) sağlam olduğundan ve anahtarın kapalı olduğundan emin olunmalıdır.",
        ornek: "Devreye çelik kaşık bağlanınca ampul yanar, tahta kaşık bağlanınca yanmaz.",
        gorsel: G.devre({ pil: 1, ampul: 1, acik: false, malzeme: "test edilen madde" }),
        durak: { soru: "Devredeki boşluğa bir madde bağlanıp anahtar kapatıldığında ampul yanmıyor. Devre sağlam olduğuna göre madde için ne söylenebilir?", secenekler: [["Yalıtkandır.", true, "Akım maddeden geçemediği için ampul yanmamıştır."], ["İletkendir.", false, "İletken madde bağlansaydı ampul yanardı."], ["Metaldir.", false, "Metaller iletkendir; ampulü yakardı."], ["Pil bitmiştir.", false, "Soruda devrenin sağlam olduğu belirtilmiş."]] } },
      { baslik: "Günlük hayatta iletkenler, yalıtkanlar ve güvenlik",
        metin: "• Elektrik kablolarının içi bakır, dışı plastik kaplıdır.<br>• Tornavida ve pense gibi araçların sapları plastik ya da lastikle kaplanır.<br>• Elektrik direklerindeki teller, porselen ya da camdan yapılmış <b>yalıtkanlarla</b> direğe tutturulur.<br>• Prizlerin dış kapağı plastiktir; fişlerin uçları metaldir.<br><b>Güvenlik kuralları:</b> Prizlere metal cisim sokulmaz; ıslak elle elektrikli araçlara ve prizlere dokunulmaz; kablosu soyulmuş araç kullanılmaz; elektrik çarpan birine çıplak elle dokunulmaz, önce sigorta kapatılır ya da kuru tahta gibi bir yalıtkanla temas kesilir.",
        ornek: "Elektrikçiler çalışırken lastik eldiven ve lastik tabanlı ayakkabı giyer; çünkü lastik yalıtkandır.",
        durak: { soru: "Elektrik çarpmasına uğrayan birine yardım ederken ilk olarak ne yapılmalıdır?", secenekler: [["Sigorta kapatılmalı ya da kuru tahta gibi bir yalıtkanla kişi elektrikten ayrılmalı", true, "Böylece yardım eden kişi de çarpılmaz."], ["Kişi hemen çıplak elle çekilmeli", false, "İnsan vücudu iletkendir; yardım eden de çarpılabilir."], ["Kişinin üstüne su dökülmeli", false, "Musluk suyu iletkendir; tehlikeyi artırır."], ["Metal bir çubukla kişi itilmeli", false, "Metal iletkendir; akım yardım edene geçer."]] } },
    ],
    uret: {
      "file.iletken": [
        Q("file.iletken", "hatirlama", 1, "Elektrik akımını üzerinden kolayca geçiren maddelere ne ad verilir?", "İletken",
          [["Yalıtkan", "bilgi", "Yalıtkanlar elektrik akımını geçirmez."], ["Direnç", "kavrama", "Direnç, maddenin akıma karşı gösterdiği zorluktur; bir madde türü değildir."], ["Anahtar", "bilgi", "Anahtar devreyi açıp kapatan bir devre elemanıdır."]],
          "Elektriği “ileten” madde…", ["Elektriği kolayca geçiren maddelere iletken denir.", "Metaller, grafit ve tuzlu su iletkendir."],
          { kural: "İletken: elektriği geçirir. Yalıtkan: elektriği geçirmez." }),
        z => {
          const il = sec(ILETKEN), ya = karistir(YALITKAN).slice(0, 3);
          return S({ kaz: "file.iletken", duzey: "uygulama", zorluk: 1,
            soru: "Aşağıdakilerden hangisi elektriği <b>iletir</b>?",
            dogru: il[0].toLocaleUpperCase("tr") + il.slice(1),
            yanlis: ya.map(y => [y[0].toLocaleUpperCase("tr") + y.slice(1), "bilgi", "Bu madde yalıtkandır; elektrik akımını geçirmez."]),
            ipucu: "Metaller ve grafit elektriği iletir.",
            cozum: ["Seçeneklerdeki maddelerin hangi maddeden yapıldığını düşün.", `${il[0].toLocaleUpperCase("tr") + il.slice(1)} metal ya da grafit içerir; iletkendir.`, "Diğerleri plastik, cam, tahta, lastik, kâğıt gibi yalıtkanlardır."],
            kural: "Metaller ve grafit iletken; plastik, cam, tahta, lastik, kâğıt yalıtkandır." });
        },
        z => {
          const ya = sec(YALITKAN), il = karistir(ILETKEN).slice(0, 3);
          return S({ kaz: "file.iletken", duzey: "uygulama", zorluk: 1,
            soru: "Aşağıdakilerden hangisi <b>yalıtkandır</b>?",
            dogru: ya[0].toLocaleUpperCase("tr") + ya.slice(1),
            yanlis: il.map(y => [y[0].toLocaleUpperCase("tr") + y.slice(1), "bilgi", "Bu madde metal ya da grafit içerir; elektriği iletir."]),
            ipucu: "Plastik, cam, tahta, lastik ve kâğıt yalıtkandır.",
            cozum: ["Yalıtkan maddeler elektrik akımını geçirmez.", `${ya[0].toLocaleUpperCase("tr") + ya.slice(1)} yalıtkan bir maddeden yapılmıştır.`, "Diğer seçenekler metal ya da grafit olduğu için iletkendir."],
            kural: "Yalıtkanlar: plastik, cam, kuru tahta, lastik, kâğıt, porselen, kumaş." });
        },
        Q("file.iletken", "aciklama", 2, "Ayşe “Yalnızca metaller elektriği iletir.” diyor. Ayşe'nin görüşünü <b>çürüten</b> örnek hangisidir?", "Kurşun kalem ucundaki grafitin elektriği iletmesi",
          [["Bakır telin elektriği iletmesi", "strateji", "Bakır bir metaldir; bu örnek Ayşe'nin görüşünü destekler."], ["Plastiğin elektriği iletmemesi", "strateji", "Plastik metal değildir ve iletmez; bu, görüşü çürütmez."], ["Demir çivinin elektriği iletmesi", "strateji", "Demir bir metaldir; görüşü çürütmez."]],
          "Metal olmadığı hâlde elektriği ileten bir madde ara.", ["Bir görüşü çürütmek için ona uymayan bir örnek gerekir.", "Grafit metal değildir ama elektriği iletir.", "Bu örnek, yalnızca metallerin iletken olmadığını gösterir."],
          { kural: "Grafit ve tuzlu su da metal olmadıkları hâlde iletkendir." }),
        Q("file.iletken", "baglanti", 3, "İnsan vücudu, tuzlu su ve grafitin ortak özelliği nedir?", "Elektriği iletirler.",
          [["Metaldirler.", "kavrama", "Bunların hiçbiri metal değildir."], ["Yalıtkandırlar.", "bilgi", "Üçü de elektriği iletir."], ["Mıknatıs tarafından çekilirler.", "bilgi", "Bu maddeler mıknatısla çekilmez; ortak özellikleri iletken olmalarıdır."]],
          "Bunların elektrikle ilişkisini düşün.", ["İnsan vücudu ve tuzlu su içinde elektriği taşıyabilen tanecikler vardır.", "Grafit de elektriği iletir.", "Ortak özellikleri iletken olmalarıdır; hiçbiri metal değildir."],
          { kural: "Metal olmayan iletkenler: grafit, tuzlu su, insan vücudu, nemli toprak." }),
        Q("file.iletken", "uygulama", 2, "Tabloda bazı maddeler sınıflandırılmıştır. Hangi madde <b>yanlış</b> yere yazılmıştır?", "Alüminyum folyo",
          [["Cam", "bilgi", "Cam yalıtkandır; doğru yere yazılmış."], ["Grafit", "bilgi", "Grafit iletkendir; doğru yere yazılmış."], ["Bakır", "bilgi", "Bakır iletkendir; doğru yere yazılmış."]],
          "Metaller hangi sütunda olmalı?", ["İletkenler: bakır, grafit. Yalıtkanlar: cam, plastik.", "Alüminyum folyo bir metaldir; iletkendir.", "Bu yüzden yalıtkanlar sütununa yazılması yanlıştır."],
          { gorsel: G.tablo(["İletken", "Yalıtkan"], [["Bakır", "Cam"], ["Grafit", "Alüminyum folyo"], ["Tuzlu su", "Plastik"]]), kural: "Bütün metaller iletkendir." }),
      ],
      "file.test": [
        z => {
          const iletken = Math.random() < 0.5, m = iletken ? sec(ILETKEN) : sec(YALITKAN);
          return S({ kaz: "file.test", duzey: "uygulama", zorluk: 1,
            soru: `Şekildeki sağlam devrede boşluğa <b>${m}</b> bağlanıp anahtar kapatılıyor. Ne gözlenir?`,
            gorsel: G.devre({ pil: 1, ampul: 1, acik: false, malzeme: m }),
            dogru: iletken ? "Ampul yanar; madde iletkendir." : "Ampul yanmaz; madde yalıtkandır.",
            yanlis: [[iletken ? "Ampul yanmaz; madde yalıtkandır." : "Ampul yanar; madde iletkendir.", "bilgi", iletken ? "Bu madde metal ya da grafittir; akımı geçirir." : "Bu madde yalıtkandır; akımı geçirmez."], [iletken ? "Ampul yanmaz; madde iletkendir." : "Ampul yanar; madde yalıtkandır.", "kavrama", "İletken madde ampulü yakar, yalıtkan madde yakmaz; ikisi birlikte olmaz."], ["Pil hemen biter.", "kavrama", "Kısa sürede pilin bitmesi beklenmez; gözlenecek olan ampulün yanıp yanmamasıdır."]],
            ipucu: `${m[0].toLocaleUpperCase("tr") + m.slice(1)} iletken mi, yalıtkan mı?`,
            cozum: ["Devre sağlam ve anahtar kapalı; tek değişken boşluğa bağlanan madde.", iletken ? "Bu madde iletkendir; akım üzerinden geçer." : "Bu madde yalıtkandır; akım üzerinden geçemez.", iletken ? "Akım devreyi tamamlar ve ampul yanar." : "Devre tamamlanamaz ve ampul yanmaz."],
            kural: "Ampul yanarsa iletken, yanmazsa yalıtkan." });
        },
        Q("file.test", "aciklama", 2, "İletkenlik testinde ampulün yanmamasının madde yalıtkan olduğu için olduğundan emin olmak için önce ne yapılmalıdır?", "Boşluğa bir metal bağlanarak devrenin çalıştığı kontrol edilmeli",
          [["Pil devreden çıkarılmalı", "strateji", "Pil olmadan hiçbir madde ampulü yakamaz; kontrol yapılamaz."], ["Anahtar açık bırakılmalı", "kavrama", "Anahtar açıkken devre tamamlanmaz; ampul hiçbir zaman yanmaz."], ["Ampul çıkarılmalı", "strateji", "Gözlem ampulle yapılır; ampul çıkarılırsa sonuç görülemez."]],
          "Devrenin sağlam olduğunu nasıl anlarsın?", ["Ampul; bitmiş pil, yanık ampul ya da kopuk kablo yüzünden de yanmayabilir.", "Boşluğa iletken olduğu bilinen bir metal bağlanınca ampul yanıyorsa devre sağlamdır.", "Ancak bundan sonra yanmayan madde için “yalıtkan” denebilir."],
          { kural: "Deneyden önce düzeneğin çalıştığı kontrol edilmelidir." }),
        Q("file.test", "uygulama", 2, "Bir öğrenci dört maddeyi sırayla aynı devreye bağlayıp sonuçları tabloya yazıyor. Hangi gözlem <b>hatalıdır</b>?", "Plastik kaşık – ampul yandı",
          [["Demir çivi – ampul yandı", "bilgi", "Demir iletkendir; ampulün yanması doğrudur."], ["Silgi – ampul yanmadı", "bilgi", "Silgi yalıtkandır; ampulün yanmaması doğrudur."], ["Grafit – ampul yandı", "bilgi", "Grafit iletkendir; ampul yanar."]],
          "Hangi madde yalıtkan olduğu hâlde ampulü yakmış görünüyor?", ["İletkenler ampulü yakar, yalıtkanlar yakmaz.", "Plastik yalıtkandır; ampulü yakmaması gerekir.", "Bu gözlem hatalıdır; ölçüm sırasında kablolar birbirine değmiş olabilir."],
          { gorsel: G.tablo(["Madde", "Ampul"], [["Demir çivi", "Yandı"], ["Silgi", "Yanmadı"], ["Plastik kaşık", "Yandı"], ["Grafit", "Yandı"]]), kural: "Yalıtkan madde bağlanınca ampul yanmaz." }),
        Q("file.test", "transfer", 3, "Devredeki boşluğa önce saf su, sonra aynı suya tuz eklenmiş hâli bağlanıyor. Saf suda ampul yanmıyor, tuzlu suda yanıyor. Bu deneyden hangi sonuç çıkar?", "Tuzlu su elektriği iletir; tuz suyun iletkenliğini artırmıştır.",
          [["Saf su iletken, tuzlu su yalıtkandır.", "dikkat", "Gözlem tam tersini söylüyor: ampul tuzlu suda yanıyor."], ["Tuz eklemek iletkenliği değiştirmez.", "kavrama", "Ampul tuzdan sonra yandığına göre iletkenlik değişmiştir."], ["Ampul bozulmuştur.", "strateji", "Ampul tuzlu suda yandığına göre sağlamdır."]],
          "Değiştirilen tek şey nedir?", ["İki denemede tek fark suya tuz eklenmesidir.", "Saf suda ampul yanmadı: saf su elektriği çok az iletir.", "Tuzlu suda ampul yandı: tuz çözününce su elektriği iletir hâle gelir."],
          { gorsel: G.devre({ pil: 2, ampul: 1, acik: false, malzeme: "su ya da tuzlu su" }), kural: "Tuzlu su iletkendir; saf su elektriği çok az iletir." }),
        Q("file.test", "baglanti", 2, "Anahtarı açık olan bir devrenin boşluğuna bakır tel bağlanıyor. Ampul neden yanmaz?", "Anahtar açık olduğu için devre tamamlanmamıştır.",
          [["Bakır yalıtkandır.", "bilgi", "Bakır iyi bir iletkendir."], ["Bakır tel ampulü söndürür.", "kavrama", "İletken tel akımı geçirir; ampulü söndürmez."], ["Devrede pil fazladır.", "dikkat", "Sorun pilde değil, açık anahtardadır."]],
          "Anahtar açıkken akım dolaşabilir mi?", ["Akımın geçmesi için devrenin kapalı (tamamlanmış) olması gerekir.", "Anahtar açık olduğunda devre bir yerden kesiktir.", "Bakır tel iletken olsa da devre tamamlanmadığı için ampul yanmaz."],
          { gorsel: G.devre({ pil: 1, ampul: 1, acik: true, malzeme: "bakır tel" }), kural: "Ampulün yanması için devre kapalı olmalı ve aradaki madde iletken olmalıdır." }),
      ],
      "file.guvenlik": [
        Q("file.guvenlik", "hatirlama", 1, "Elektrik kablolarının dışının plastikle kaplanmasının nedeni nedir?", "Plastik yalıtkan olduğu için elektrik çarpmasını önler.",
          [["Plastik iletken olduğu için akımı hızlandırır.", "bilgi", "Plastik iletken değil, yalıtkandır."], ["Kablonun daha parlak görünmesi için", "strateji", "Kaplamanın asıl amacı güvenliktir."], ["Bakırın erimesini önlemek için", "kavrama", "Kaplama erimeyi değil, elektrik çarpmasını önlemek içindir."]],
          "Kablonun içinden akım geçerken dışına dokunduğumuzda ne olmalı?", ["Kablonun içindeki bakır akımı iletir.", "Dışındaki plastik yalıtkandır; akımın bize geçmesini önler.", "Böylece kabloya dokunduğumuzda çarpılmayız."],
          { kural: "Kablo: içi iletken (bakır), dışı yalıtkan (plastik)." }),
        Q("file.guvenlik", "uygulama", 2, "Aşağıdaki davranışlardan hangisi elektrik güvenliği açısından <b>doğrudur</b>?", "Fişi prizden çekerken kablodan değil, fişin kendisinden tutmak",
          [["Islak elle saç kurutma makinesinin fişini takmak", "bilgi", "Musluk suyu ve vücudumuz iletkendir; ıslak elle elektrikli araçlara dokunulmaz."], ["Prizin deliklerine metal ataş sokmak", "bilgi", "Metal iletkendir; elektrik çarpmasına yol açar."], ["Kablosu soyulmuş ütüyü kullanmaya devam etmek", "bilgi", "Açıkta kalan iletken tele dokunmak çarpılmaya neden olur."]],
          "Hangi davranış iletkenle temasımızı önler?", ["Islak el, metal cisim ve soyulmuş kablo elektrik çarpması riskini artırır.", "Fişi kablodan çekmek kabloyu zedeleyebilir; fişin plastik gövdesinden tutmak güvenlidir.", "Doğru davranış fişi gövdesinden tutarak çekmektir."],
          { kural: "Islak el, metal cisim, soyulmuş kablo = tehlike." }),
        Q("file.guvenlik", "aciklama", 2, "Elektrikçilerin kullandığı tornavidaların sapları neden plastik ya da lastikle kaplanır?", "Akımın tornavidadan ele geçmesini önlemek için",
          [["Tornavidanın daha iyi iletmesi için", "kavrama", "Plastik ve lastik yalıtkandır; iletmeyi artırmaz."], ["Tornavidanın paslanmaması için", "strateji", "Sapın kaplanmasının asıl nedeni elektrik güvenliğidir."], ["Tornavidanın daha ağır olması için", "strateji", "Amaç ağırlık değil, yalıtımdır."]],
          "Plastik ve lastik iletken mi, yalıtkan mı?", ["Tornavidanın metal ucu iletkendir.", "Sap yalıtkan bir maddeyle kaplanınca akım ele geçemez.", "Böylece elektrikçi çarpılmadan çalışabilir."],
          { kural: "Elektrikle çalışırken yalıtkan saplı araçlar ve lastik eldiven kullanılır." }),
        Q("file.guvenlik", "transfer", 3, "Elektrik direklerinde teller direğe doğrudan değil, porselen ya da cam parçalarla tutturulur. Bunun nedeni nedir?", "Porselen ve cam yalıtkan olduğu için akımın direğe ve toprağa geçmesini önler.",
          [["Porselen ve cam iletken olduğu için akımı direğe aktarır.", "bilgi", "Porselen ve cam yalıtkandır."], ["Tellerin rüzgârda kopmaması için", "strateji", "Bu parçaların asıl görevi yalıtımdır."], ["Tellerin yazın genleşmesini önlemek için", "kavrama", "Bu parçalar genleşmeyi engellemez; akımın direğe geçmesini önler."]],
          "Direğe dokunan biri çarpılmasın diye ne gerekir?", ["Teller üzerinden yüksek gerilimli akım taşınır.", "Teller direğe yalıtkan parçalarla tutturulursa akım direğe geçmez.", "Böylece hem enerji kaybı hem de direğe dokunanların çarpılma tehlikesi önlenir."],
          { kural: "İletkenleri birbirinden ve bizden ayırmak için yalıtkanlar kullanılır." }),
        Q("file.guvenlik", "baglanti", 3, "Banyoda prizlerin kapaklı olması ve ıslak elle elektrikli araçlara dokunulmaması gerekir. Bu kuralların temel nedeni nedir?", "Musluk suyunun ve insan vücudunun elektriği iletmesi",
          [["Suyun yalıtkan olması", "kavrama", "Musluk suyu içindeki çözünmüş maddeler nedeniyle elektriği iletir."], ["Banyonun sıcak olması", "strateji", "Asıl tehlike sıcaklık değil, suyun ve vücudun iletkenliğidir."], ["Elektriğin suyu buharlaştırması", "kavrama", "Kuralların nedeni elektrik çarpması tehlikesidir."]],
          "Su ve vücut iletken mi?", ["Musluk suyunda çözünmüş maddeler vardır; elektriği iletir.", "İnsan vücudu da iletkendir.", "Islak el ile akım vücudumuza kolayca geçebilir; bu yüzden bu kurallara uyulur."],
          { kural: "Su ve elektrik bir araya gelmemeli." }),
      ],
    },
  });

  /* ============== 5) ELEKTRİKSEL DİRENÇ VE BAĞLI OLDUĞU FAKTÖRLER ============== */
  KONU_EKLE("fen", {
    id: "f_direnc", tema: "f6", ad: "Elektriksel Direnç ve Bağlı Olduğu Faktörler",
    kazanimlar: [
      { id: "fdir.kavram", ad: "Elektriksel direnci tanımlama; direnç ile ampul parlaklığı arasındaki ilişkiyi açıklama" },
      { id: "fdir.faktor", ad: "Bir telin direncinin uzunluğa, kesit alanına ve madde cinsine bağlılığını açıklama" },
      { id: "fdir.deney", ad: "Direnç deneyinde değişkenleri belirleme ve ayarlanabilir direncin (reostanın) kullanımını açıklama" },
    ],
    anlatim: [
      { baslik: "Elektriksel direnç",
        metin: "Bir maddenin üzerinden geçen elektrik akımına karşı gösterdiği zorluğa <b>elektriksel direnç</b> denir. Direncin birimi <b>ohm</b>'dur (Ω).<br>Devredeki direnç <b>büyürse</b> devreden geçen akım <b>azalır</b> ve ampul <b>daha sönük</b> yanar. Direnç <b>küçülürse</b> akım artar, ampul <b>daha parlak</b> yanar.<br>İletkenlerin de direnci vardır ama küçüktür; yalıtkanların direnci ise çok büyüktür.",
        ornek: "Aynı devreye önce kısa, sonra çok uzun bir ince tel bağlanırsa uzun tel bağlandığında ampul daha sönük yanar; çünkü uzun telin direnci daha büyüktür.",
        gorsel: G.devre({ pil: 2, ampul: 1, acik: false, malzeme: "direnç teli" }),
        durak: { soru: "Bir devredeki direnç artırılırsa ampulün parlaklığı nasıl değişir?", secenekler: [["Azalır", true, "Direnç artınca akım azalır, ampul daha sönük yanar."], ["Artar", false, "Parlaklığın artması için direncin azalması gerekir."], ["Değişmez", false, "Direnç, devreden geçen akımı ve dolayısıyla parlaklığı etkiler."], ["Ampul patlar", false, "Direncin artması akımı azaltır; ampulü patlatmaz."]] } },
      { baslik: "Direnç neye bağlıdır?",
        metin: "Bir telin direnci üç etkene bağlıdır:<br>• <b>Uzunluk:</b> Tel <b>uzadıkça</b> direnç <b>artar</b>.<br>• <b>Kesit alanı (kalınlık):</b> Tel <b>kalınlaştıkça</b> direnç <b>azalır</b>.<br>• <b>Madde cinsi:</b> Aynı uzunluk ve kalınlıktaki farklı maddelerden yapılmış tellerin dirençleri farklıdır. Örneğin bakırın direnci küçük, krom-nikel telinin direnci büyüktür.<br>Bu yüzden elektrik kablolarında direnci küçük olan bakır, ısıtıcı ve ütü gibi araçların ısıtan bölümünde (rezistans) direnci büyük olan krom-nikel teli kullanılır.",
        ornek: "Su borusunda olduğu gibi düşünebilirsin: uzun ve dar bir borudan su zor akar; kısa ve geniş borudan kolay akar.",
        gorsel: teller([{ ad: "K", uzunluk: 2, kalinlik: 1, not: "kısa, ince" }, { ad: "L", uzunluk: 4, kalinlik: 1, not: "uzun, ince" }, { ad: "M", uzunluk: 2, kalinlik: 3, not: "kısa, kalın" }]),
        durak: { soru: "Görseldeki aynı maddeden yapılmış K, L ve M tellerinden hangisinin direnci en büyüktür?", secenekler: [["L", true, "L hem uzun hem ince; direnci en büyüktür."], ["K", false, "K, L ile aynı kalınlıkta ama daha kısadır; direnci L'ninkinden küçüktür."], ["M", false, "M kısa ve kalındır; direnci en küçüktür."], ["Hepsi eşit", false, "Uzunluk ve kalınlık farklı olduğu için dirençler farklıdır."]] } },
      { baslik: "Deney değişkenleri ve reosta",
        metin: "Bir etkenin dirence etkisini incelerken <b>yalnızca o etken değiştirilir</b>, diğerleri aynı tutulur.<br>• <b>Bağımsız değişken:</b> Bilerek değiştirdiğimiz etken (ör. telin uzunluğu).<br>• <b>Bağımlı değişken:</b> Bu değişikliğe bağlı olarak ölçtüğümüz sonuç (ör. ampulün parlaklığı).<br>• <b>Kontrol edilen değişkenler:</b> Sabit tuttuğumuz etkenler (ör. telin kalınlığı, cinsi, pil ve ampul).<br><b>Reosta (ayarlanabilir direnç):</b> Üzerindeki sürgü hareket ettirildiğinde akımın geçtiği tel uzunluğu değişir ve direnç ayarlanır. Radyonun ses düğmesi, ışık ayar düğmesi ve oyuncak arabaların hız ayarı bu ilkeyle çalışır.",
        ornek: "Telin uzunluğunun dirence etkisini incelemek için aynı kalınlıkta ve aynı maddeden yapılmış 10 cm ve 40 cm'lik teller aynı devreye sırayla bağlanır.",
        durak: { soru: "“Telin kalınlığı direnci etkiler mi?” sorusunu araştıran bir öğrencinin bağımsız değişkeni hangisidir?", secenekler: [["Telin kalınlığı (kesit alanı)", true, "Öğrencinin bilerek değiştirdiği etken kalınlıktır."], ["Ampulün parlaklığı", false, "Parlaklık ölçülen sonuçtur; bağımlı değişkendir."], ["Telin uzunluğu", false, "Uzunluk bu deneyde sabit tutulmalıdır; kontrol edilen değişkendir."], ["Pil sayısı", false, "Pil sayısı sabit tutulur; kontrol edilen değişkendir."]] } },
    ],
    uret: {
      "fdir.kavram": [
        Q("fdir.kavram", "hatirlama", 1, "Bir maddenin üzerinden geçen elektrik akımına karşı gösterdiği zorluğa ne ad verilir?", "Elektriksel direnç",
          [["İletkenlik", "kavrama", "İletkenlik akımı geçirme kolaylığıdır; zorluk değildir."], ["Sigorta", "bilgi", "Sigorta, devreyi aşırı akıma karşı koruyan bir elemandır."], ["Anahtar", "bilgi", "Anahtar devreyi açıp kapatır."]],
          "Akımın geçişine “karşı koyma”…", ["Maddeler akımın geçişine farklı ölçülerde karşı koyar.", "Bu zorluğa elektriksel direnç denir; birimi ohm (Ω)'dur."],
          { kural: "Direnç = akıma karşı gösterilen zorluk; birimi ohm (Ω)." }),
        Q("fdir.kavram", "aciklama", 2, "Devredeki direnç azaltılırsa ne olur?", "Devreden geçen akım artar, ampul daha parlak yanar.",
          [["Akım azalır, ampul sönükleşir.", "kavrama", "Bu, direnç artınca olur."], ["Akım değişmez, ampul aynı parlaklıkta yanar.", "kavrama", "Direnç değişirse akım da değişir."], ["Ampul hemen söner.", "kavrama", "Direncin azalması ampulü söndürmez; parlaklığı artırır."]],
          "Direnç ile akım ters mi, doğru mu ilişkilidir?", ["Direnç, akıma karşı zorluktur.", "Zorluk azalınca daha çok akım geçer.", "Daha çok akım geçince ampul daha parlak yanar."],
          { kural: "Direnç ↓ → akım ↑ → ampul daha parlak." }),
        z => {
          const dir = karistir([2, 4, 6, 8, 10]).slice(0, 3), ad = ["X", "Y", "Z"];
          const enParlak = ad[dir.indexOf(Math.min(...dir))], enSonuk = ad[dir.indexOf(Math.max(...dir))];
          const ikinci = ad.find(a => a !== enParlak && a !== enSonuk);
          return S({ kaz: "fdir.kavram", duzey: "uygulama", zorluk: 2,
            soru: "Dirençleri tabloda verilen X, Y ve Z telleri aynı devreye sırayla bağlanıyor. Hangi tel bağlandığında ampul <b>en parlak</b> yanar?",
            gorsel: G.tablo(["Tel", "Direnç (Ω)"], ad.map((a, i) => [a, dir[i]])),
            dogru: enParlak,
            yanlis: [[enSonuk, "kavrama", "Bu telin direnci en büyük; ampul en sönük yanar."], [ikinci, "dikkat", "Bu telin direnci en küçük değil."], ["Hepsinde aynı parlaklıkta", "kavrama", "Dirençler farklı olduğu için parlaklıklar farklıdır."]],
            ipucu: "Direnci en küçük olan tel en çok akım geçirir.",
            cozum: ["Direnç küçüldükçe devreden geçen akım artar.", `En küçük direnç ${Math.min(...dir)} Ω ile ${enParlak} telindedir.`, `Bu yüzden ${enParlak} bağlandığında ampul en parlak yanar.`],
            kural: "En küçük direnç → en parlak ampul." });
        },
        Q("fdir.kavram", "transfer", 3, "Elektrik kablolarında bakır, ısıtıcıların ısıtan telinde ise krom-nikel kullanılır. Bunun nedeni hangisidir?", "Bakırın direnci küçük olduğu için akımı kolay taşır; krom-nikelin direnci büyük olduğu için çok ısınır.",
          [["Bakırın direnci büyük, krom-nikelin direnci küçüktür.", "kavrama", "Tam tersi: bakır az, krom-nikel çok dirence sahiptir."], ["İkisinin direnci eşittir; seçim fiyata göre yapılır.", "kavrama", "Farklı maddelerin dirençleri farklıdır; seçim dirence göre yapılır."], ["Krom-nikel yalıtkan olduğu için ısıtıcıda kullanılır.", "bilgi", "Krom-nikel iletkendir ama direnci büyüktür; akım geçerken ısınır."]],
          "Kablonun ısınması mı istenir, ısıtıcının mı?", ["Kablolarda enerjinin boşa harcanmaması ve ısınmaması için direnci küçük bakır seçilir.", "Isıtıcıda ise ısı istenir; direnci büyük teller akım geçince çok ısınır.", "Bu yüzden ısıtıcıların ısıtan bölümünde krom-nikel teli kullanılır."],
          { kural: "Direnç madde cinsine bağlıdır: bakır küçük, krom-nikel büyük direnç." }),
        Q("fdir.kavram", "baglanti", 3, "Görseldeki iki devrede pil, ampul ve teller aynıdır; yalnızca 2. devreye fazladan bir direnç teli eklenmiştir. Ampullerin parlaklığı için ne söylenebilir?", "1. devredeki ampul daha parlak yanar.",
          [["2. devredeki ampul daha parlak yanar.", "kavrama", "Eklenen direnç akımı azaltır; 2. devredeki ampul sönükleşir."], ["İkisi aynı parlaklıkta yanar.", "kavrama", "Direnç eklenen devrede akım azalır."], ["2. devredeki ampul hiç yanmaz.", "kavrama", "Direnç teli iletkendir; ampul yanar ama daha sönük yanar."]],
          "Fazladan direnç akımı nasıl etkiler?", ["İki devrede tek fark, 2. devredeki direnç telidir.", "Direnç eklenince devredeki toplam direnç artar, akım azalır.", "Akımı az olan 2. devrenin ampulü daha sönük, 1. devreninki daha parlak yanar."],
          { gorsel: G.tablo(["", "1. devre", "2. devre"], [["Pil", "1", "1"], ["Ampul", "1", "1"], ["Eklenen direnç teli", "Yok", "Var"]]), kural: "Devreye direnç eklemek akımı azaltır." }),
      ],
      "fdir.faktor": [
        z => {
          const mod = sec(["uzunluk", "kesit"]), ad = ["K", "L", "M"];
          const deg = karistir([1, 2, 3]);
          const liste = ad.map((a, i) => mod === "uzunluk" ? { ad: a, uzunluk: deg[i] + 1, kalinlik: 2 } : { ad: a, uzunluk: 3, kalinlik: deg[i] });
          const sor = sec(["en büyük", "en küçük"]);
          // uzunluk: büyük değer → büyük direnç; kesit: büyük değer → küçük direnç
          const buyukDir = mod === "uzunluk" ? ad[deg.indexOf(3)] : ad[deg.indexOf(1)];
          const kucukDir = mod === "uzunluk" ? ad[deg.indexOf(1)] : ad[deg.indexOf(3)];
          const dogru = sor === "en büyük" ? buyukDir : kucukDir, ters = sor === "en büyük" ? kucukDir : buyukDir;
          const orta = ad.find(a => a !== dogru && a !== ters);
          return S({ kaz: "fdir.faktor", duzey: "uygulama", zorluk: 2,
            soru: `Aynı maddeden yapılmış K, L ve M telleri ${mod === "uzunluk" ? "aynı kalınlıkta ama farklı uzunluktadır" : "aynı uzunlukta ama farklı kalınlıktadır"}. Hangisinin direnci <b>${sor}</b>?`,
            gorsel: teller(liste),
            dogru,
            yanlis: [[ters, "kavrama", mod === "uzunluk" ? "Tel kısaldıkça direnç azalır, uzadıkça artar; ilişkiyi ters kurdun." : "Kalın telin direnci küçük, ince telin direnci büyüktür; ilişkiyi ters kurdun."], [orta, "dikkat", "Bu tel ortanca değerdedir."], ["Hepsinin direnci eşittir", "kavrama", mod === "uzunluk" ? "Uzunluklar farklı olduğu için dirençler farklıdır." : "Kalınlıklar farklı olduğu için dirençler farklıdır."]],
            ipucu: mod === "uzunluk" ? "Uzun tel = büyük direnç." : "Kalın tel = küçük direnç.",
            cozum: [mod === "uzunluk" ? "Tellerin cinsi ve kalınlığı aynı; yalnızca uzunlukları farklı." : "Tellerin cinsi ve uzunluğu aynı; yalnızca kalınlıkları farklı.", mod === "uzunluk" ? "Tel uzadıkça direnç artar." : "Tel kalınlaştıkça direnç azalır.", `Bu yüzden direnci ${sor} olan tel ${dogru} telidir.`],
            kural: "Uzunluk ↑ → direnç ↑; kesit alanı (kalınlık) ↑ → direnç ↓." });
        },
        Q("fdir.faktor", "hatirlama", 1, "Aynı maddeden yapılmış ve aynı kalınlıktaki iki telden uzun olanın direnci için ne söylenir?", "Kısa olanınkinden büyüktür.",
          [["Kısa olanınkinden küçüktür.", "kavrama", "Tel uzadıkça direnç artar."], ["Kısa olanınkine eşittir.", "kavrama", "Uzunluk direnci etkiler."], ["Sıfırdır.", "bilgi", "Her telin bir direnci vardır."]],
          "Uzun yolda akım daha çok mu zorlanır?", ["Telin cinsi ve kalınlığı aynı, uzunluğu farklıdır.", "Tel uzadıkça direnç artar.", "Uzun telin direnci daha büyüktür."],
          { kural: "Uzun tel → büyük direnç." }),
        Q("fdir.faktor", "aciklama", 2, "Aynı uzunlukta ve aynı kalınlıkta bakır ve krom-nikel teller aynı devreye sırayla bağlanınca ampul farklı parlaklıkta yanıyor. Bu durum direncin neye bağlı olduğunu gösterir?", "Telin yapıldığı madde cinsine",
          [["Telin uzunluğuna", "dikkat", "Uzunluklar eşit tutulmuş; fark uzunluktan kaynaklanamaz."], ["Telin kalınlığına", "dikkat", "Kalınlıklar eşit tutulmuş."], ["Pilin sayısına", "dikkat", "Aynı devre kullanıldığı için pil sayısı değişmemiştir."]],
          "İki telde farklı olan tek şey nedir?", ["Teller aynı uzunlukta ve aynı kalınlıkta.", "Tek fark maddelerinin cinsidir (bakır – krom-nikel).", "Parlaklık farklı olduğuna göre direnç madde cinsine bağlıdır."],
          { kural: "Direnç; uzunluk, kesit alanı ve madde cinsine bağlıdır." }),
        Q("fdir.faktor", "uygulama", 3, "Tablodaki tellerin hepsi aynı maddeden yapılmıştır. Ampul hangi tel bağlandığında <b>en parlak</b> yanar?", "N",
          [["K", "kavrama", "K uzun ve ince; direnci en büyüktür, ampul en sönük yanar."], ["L", "dikkat", "L kısa ama ince; N'den daha büyük dirence sahiptir."], ["M", "dikkat", "M kalın ama uzun; N'den daha büyük dirence sahiptir."]],
          "Direnci en küçük tel: en kısa ve en kalın olanı.", ["Direnç, tel kısaldıkça ve kalınlaştıkça azalır.", "N hem kısa hem kalındır; direnci en küçüktür.", "Direnç en küçük olunca akım en büyük olur; ampul en parlak yanar."],
          { gorsel: G.tablo(["Tel", "Uzunluk", "Kalınlık"], [["K", "Uzun", "İnce"], ["L", "Kısa", "İnce"], ["M", "Uzun", "Kalın"], ["N", "Kısa", "Kalın"]]), kural: "Kısa + kalın tel = küçük direnç = parlak ampul." }),
        Q("fdir.faktor", "transfer", 3, "Bir ısıtıcı tasarlayan mühendis, ısıtıcının telinin <b>daha çok ısınmasını</b> istiyor. Aynı maddeden yapılmış tellerden hangisini seçmelidir?", "Uzun ve ince olanı",
          [["Kısa ve kalın olanı", "kavrama", "Kısa ve kalın telin direnci küçüktür; daha az ısınır."], ["Kısa ve ince olanı", "dikkat", "İnce olması doğru ama kısa tel, uzun tele göre daha az dirence sahiptir."], ["Uzun ve kalın olanı", "dikkat", "Uzun olması doğru ama kalın tel direnci azaltır."]],
          "Isınması istenen tel büyük dirençli olmalıdır.", ["Isıtıcı tellerinde büyük direnç istenir.", "Direnç, tel uzadıkça artar, inceldikçe artar.", "Bu nedenle uzun ve ince tel seçilmelidir."],
          { kural: "Büyük direnç için: uzun, ince ve direnci büyük maddeden tel." }),
      ],
      "fdir.deney": [
        z => {
          const f = sec(["telin uzunluğu", "telin kalınlığı", "telin yapıldığı madde"]);
          const diger = ["telin uzunluğu", "telin kalınlığı", "telin yapıldığı madde"].filter(x => x !== f);
          const soruAd = { "telin uzunluğu": "uzunluğunun", "telin kalınlığı": "kalınlığının", "telin yapıldığı madde": "yapıldığı maddenin" }[f];
          const cap = s => s[0].toLocaleUpperCase("tr") + s.slice(1);
          return S({ kaz: "fdir.deney", duzey: "aciklama", zorluk: 2,
            soru: `Bir öğrenci “Telin ${soruAd} ampulün parlaklığına etkisi var mı?” sorusunu araştırıyor. Bu deneyin <b>bağımsız değişkeni</b> hangisidir?`,
            dogru: cap(f),
            yanlis: [["Ampulün parlaklığı", "kavrama", "Parlaklık ölçülen sonuçtur; bağımlı değişkendir."], [cap(diger[0]), "kavrama", "Bu etken deneyde sabit tutulmalıdır; kontrol edilen değişkendir."], [cap(diger[1]), "kavrama", "Bu etken deneyde sabit tutulmalıdır; kontrol edilen değişkendir."]],
            ipucu: "Bağımsız değişken, araştırmacının bilerek değiştirdiği etkendir.",
            cozum: [`Öğrenci ${{ "telin uzunluğu": "telin uzunluğunu", "telin kalınlığı": "telin kalınlığını", "telin yapıldığı madde": "telin yapıldığı maddeyi" }[f]} değiştirip sonucu gözlemleyecek.`, `Bilerek değiştirilen etken bağımsız değişkendir: ${f}.`, `Ampulün parlaklığı bağımlı; ${diger.join(" ve ")} ise kontrol edilen değişkenlerdir.`],
            kural: "Bağımsız: değiştirdiğin. Bağımlı: ölçtüğün. Kontrol: sabit tuttuğun." });
        },
        Q("fdir.deney", "uygulama", 2, "Telin uzunluğunun dirence etkisini incelemek isteyen öğrenci tablodaki tellerden hangi ikisini kullanmalıdır?", "1 ve 3",
          [["1 ve 2", "strateji", "1 ve 2'nin kalınlıkları farklı; iki etken birden değişirse sonucu yorumlayamazsın."], ["2 ve 4", "strateji", "2 ve 4'ün maddeleri farklı; yalnızca uzunluk değişmeli."], ["3 ve 4", "strateji", "3 ve 4'ün uzunlukları aynı; uzunluğun etkisi görülemez."]],
          "Yalnızca uzunluğu farklı, diğer özellikleri aynı iki teli bul.", ["Uzunluğun etkisini görmek için uzunluk dışındaki her şey aynı olmalıdır.", "1 ve 3: ikisi de bakır, ikisi de ince; uzunlukları 20 cm ve 40 cm.", "Bu yüzden 1 ve 3 numaralı teller kullanılmalıdır."],
          { gorsel: G.tablo(["Tel", "Madde", "Uzunluk (cm)", "Kalınlık"], [["1", "Bakır", "20", "İnce"], ["2", "Bakır", "40", "Kalın"], ["3", "Bakır", "40", "İnce"], ["4", "Krom-nikel", "40", "İnce"]]), kural: "Bir etkenin etkisini incelerken yalnızca o etken değiştirilir." }),
        Q("fdir.deney", "hatirlama", 1, "Sürgüsü hareket ettirilerek direnci ayarlanabilen devre elemanına ne ad verilir?", "Reosta",
          [["Sigorta", "bilgi", "Sigorta devreyi aşırı akımdan korur; direnci ayarlanmaz."], ["Anahtar", "bilgi", "Anahtar devreyi yalnızca açar ya da kapatır."], ["Pil", "bilgi", "Pil devrenin enerji kaynağıdır."]],
          "“Ayarlanabilir direnç” de denir.", ["Reostanın üzerinde bir sürgü vardır.", "Sürgü kaydırılınca akımın geçtiği tel uzunluğu değişir ve direnç ayarlanır."],
          { kural: "Reosta = ayarlanabilir direnç; tel uzunluğunu değiştirerek çalışır." }),
        Q("fdir.deney", "aciklama", 2, "Reosta, direnci hangi etkeni değiştirerek ayarlar?", "Akımın geçtiği telin uzunluğunu",
          [["Telin yapıldığı maddeyi", "kavrama", "Reosta kullanılırken telin cinsi değişmez."], ["Telin kalınlığını", "kavrama", "Reostadaki telin kalınlığı sabittir."], ["Pilin sayısını", "bilgi", "Reosta pil sayısını değiştirmez."]],
          "Sürgü ilerledikçe ne değişir?", ["Reostada uzun bir tel ve bu tel üzerinde kayan bir sürgü vardır.", "Sürgü kaydırıldıkça akımın geçtiği tel parçası uzar ya da kısalır.", "Tel uzadıkça direnç artar; böylece direnç ayarlanmış olur."],
          { kural: "Reosta: uzunluk ↑ → direnç ↑ → ampul sönük." }),
        Q("fdir.deney", "transfer", 3, "Bir odanın tavan lambası, çevrilerek ışığı kısılıp açılabilen bir düğmeyle çalışıyor. Düğme, ışığı kısmak için çevrilince devredeki direnç ve akım nasıl değişir?", "Direnç artar, akım azalır.",
          [["Direnç azalır, akım artar.", "kavrama", "Böyle olsaydı ışık kısılmaz, parlaklaşırdı."], ["Direnç artar, akım artar.", "kavrama", "Direnç artınca akım azalır."], ["İkisi de değişmez.", "kavrama", "Işık kısıldığına göre akım değişmiştir."]],
          "Işığın kısılması akımın azalması demektir.", ["Bu düğme bir reosta gibi çalışır.", "Işık kısılıyorsa lambadan geçen akım azalmıştır.", "Akımın azalması için devredeki direnç artırılmıştır."],
          { kural: "Işık ayar ve ses düğmeleri reosta ilkesiyle çalışır." }),
        Q("fdir.deney", "baglanti", 3, "Bir öğrenci aynı kalınlıkta ve aynı maddeden yapılmış tellerin uzunluğunu değiştirerek ampulün parlaklığını gözlüyor. Bu deneyde <b>kontrol edilen değişken</b> hangisidir?", "Telin kalınlığı",
          [["Telin uzunluğu", "kavrama", "Uzunluk bilerek değiştirilen etkendir; bağımsız değişkendir."], ["Ampulün parlaklığı", "kavrama", "Parlaklık gözlenen sonuçtur; bağımlı değişkendir."], ["Telin direncinin artması", "kavrama", "Direncin artması deneyin sonucudur; sabit tutulan bir değişken değildir."]],
          "Deneyde hangi özellik bilerek aynı tutuluyor?", ["Değiştirilen: telin uzunluğu (bağımsız).", "Gözlenen: ampulün parlaklığı (bağımlı).", "Aynı tutulan: telin kalınlığı ve maddesi, pil, ampul (kontrol edilen)."],
          { gorsel: teller([{ ad: "1", uzunluk: 1.5, kalinlik: 1, not: "10 cm" }, { ad: "2", uzunluk: 3, kalinlik: 1, not: "20 cm" }, { ad: "3", uzunluk: 4, kalinlik: 1, not: "30 cm" }]), kural: "Kontrol edilen değişkenler deney boyunca sabit tutulur." }),
      ],
    },
  });

  /* ============================ 6) BİYOÇEŞİTLİLİK ============================ */
  KONU_EKLE("fen", {
    id: "f_biyocesitlilik", tema: "f7", ad: "Biyoçeşitlilik",
    kazanimlar: [
      { id: "fbiy.kavram", ad: "Biyoçeşitlilik kavramını ve biyoçeşitliliğin önemini açıklama" },
      { id: "fbiy.turkiye", ad: "Türkiye'nin biyoçeşitlilik zenginliğini ve endemik türleri örneklendirme" },
      { id: "fbiy.tehdit", ad: "Biyoçeşitliliği tehdit eden etkenleri ve koruma yollarını tartışma" },
    ],
    anlatim: [
      { baslik: "Biyoçeşitlilik nedir?",
        metin: "Bir bölgede yaşayan <b>canlı türlerinin çeşitliliğine</b>, bu türlerin bireyleri arasındaki farklılıklara ve bulundukları <b>ekosistemlerin çeşitliliğine</b> birlikte <b>biyoçeşitlilik (biyolojik çeşitlilik)</b> denir.<br>Bir bölgede ne kadar çok farklı tür yaşıyorsa o bölgenin biyoçeşitliliği o kadar fazladır.<br><b>Neden önemlidir?</b> Canlılar birbirine besin zinciriyle bağlıdır; bir türün yok olması diğerlerini de etkiler. Biyoçeşitlilik bize besin, ilaç hammaddesi, kereste, lif ve temiz hava (oksijen) sağlar; doğal dengenin korunmasına yardım eder.",
        ornek: "Arıların azalması, tozlaşmayı azaltarak meyve ve sebze üretimini düşürür; bu da insanları ve başka canlıları etkiler.",
        durak: { soru: "Biyoçeşitlilik en iyi hangi ifadeyle tanımlanır?", secenekler: [["Bir bölgedeki canlı türlerinin ve ekosistemlerin çeşitliliği", true, "Biyoçeşitlilik tür, birey ve ekosistem çeşitliliğini kapsar."], ["Bir bölgedeki tek bir türün birey sayısı", false, "Tek türün birey sayısı çeşitliliği değil, o türün kalabalığını gösterir."], ["Bir bölgedeki cansız varlıkların sayısı", false, "Biyoçeşitlilik canlılarla ilgilidir."], ["Bir bölgedeki iklimin çeşitliliği", false, "İklim biyoçeşitliliği etkiler ama biyoçeşitliliğin kendisi değildir."]] } },
      { baslik: "Türkiye'nin biyoçeşitliliği ve endemik türler",
        metin: "Türkiye biyoçeşitlilik bakımından çok zengin bir ülkedir. Bunun nedenleri: <b>iklim çeşitliliği</b>, dağ, ova, göl, akarsu ve deniz gibi <b>farklı yer şekilleri</b>, üç tarafının denizlerle çevrili olması ve Asya, Avrupa ve Afrika'ya yakınlığı nedeniyle <b>farklı bitki bölgelerinin</b> burada kesişmesidir.<br>Türkiye'de yaklaşık 12 bin bitki türü vardır ve bunların yaklaşık üçte biri <b>endemiktir</b>.<br><b>Endemik tür:</b> Yalnızca belirli bir bölgede doğal olarak yaşayan, dünyanın başka yerlerinde doğal olarak bulunmayan türdür. Örnekler: Van Gölü havzasına özgü <b>inci kefali</b>, Kaz Dağları'na özgü <b>Kaz Dağı göknarı</b>.",
        ornek: "Endemik bir türün yaşadığı tek bölge yok edilirse o tür dünyadan tamamen silinebilir; bu yüzden endemik türlerin korunması çok önemlidir.",
        gorsel: G.tablo(["Endemik tür", "Yaşadığı yer"], [["İnci kefali (balık)", "Van Gölü havzası"], ["Kaz Dağı göknarı (ağaç)", "Kaz Dağları"]]),
        durak: { soru: "“Endemik tür” ne demektir?", secenekler: [["Yalnızca belirli bir bölgede doğal olarak yaşayan tür", true, "Endemik türler dünyanın başka yerlerinde doğal olarak bulunmaz."], ["Her yerde yaşayabilen tür", false, "Bu, endemik türün tam tersidir."], ["Nesli tükenmiş tür", false, "Endemik tür yaşamaktadır; yalnızca yayılış alanı dardır."], ["Başka ülkeden getirilmiş tür", false, "Bu, yabancı (istilacı) türdür."]] } },
      { baslik: "Biyoçeşitliliği tehdit eden etkenler ve koruma",
        metin: "<b>Tehditler:</b><br>• <b>Yaşam alanlarının (habitatların) yok edilmesi:</b> orman kesimi, yapılaşma, sulak alanların kurutulması.<br>• <b>Kirlilik:</b> hava, su ve toprak kirliliği; tarım ilaçlarının bilinçsiz kullanımı.<br>• <b>Aşırı ve kaçak avlanma</b>, küçük balıkların avlanması.<br>• <b>Yabancı (istilacı) türler:</b> Bir bölgeye dışarıdan gelen türler yerli türlerin besinine ve yaşam alanına ortak olur (ör. Akdeniz'e Süveyş Kanalı yoluyla gelen balon balığı).<br>• <b>İklim değişikliği</b> ve <b>orman yangınları</b>.<br><b>Koruma yolları:</b> Milli parklar ve koruma alanları kurmak, avlanma kurallarına uymak, tohum gen bankalarında tohumları saklamak, ağaçlandırma yapmak, kirliliği azaltmak ve halkı bilinçlendirmek.",
        ornek: "Nesli tehlike altındaki deniz kaplumbağalarının (Caretta caretta) yumurtlama kumsallarında gece ışık ve gürültü sınırlanır.",
        durak: { soru: "Aşağıdakilerden hangisi biyoçeşitliliği <b>korumaya</b> yönelik bir çalışmadır?", secenekler: [["Tohum gen bankasında yerli tohumları saklamak", true, "Gen bankaları türlerin kaybolmasına karşı bir güvencedir."], ["Sulak alanları kurutup tarla yapmak", false, "Bu, birçok canlının yaşam alanını yok eder."], ["Avlanma yasağı olan dönemde balık tutmak", false, "Üreme dönemindeki avlanma türlerin azalmasına yol açar."], ["Göle başka bölgeden balık türü getirmek", false, "Yabancı türler yerli türleri tehdit edebilir."]] } },
    ],
    uret: {
      "fbiy.kavram": [
        Q("fbiy.kavram", "hatirlama", 1, "Bir bölgedeki canlı türlerinin ve ekosistemlerin çeşitliliğine ne ad verilir?", "Biyoçeşitlilik",
          [["Besin zinciri", "bilgi", "Besin zinciri canlılar arasındaki beslenme ilişkisidir."], ["Popülasyon", "bilgi", "Popülasyon aynı türün bir bölgedeki bireyleridir; çeşitlilik değildir."], ["Endemizm", "kavrama", "Endemizm bir türün yalnızca belirli bir bölgeye özgü olmasıdır."]],
          "“Biyo” canlı, “çeşitlilik” farklılık demektir.", ["Bir bölgedeki farklı türler, bireyler arasındaki farklılıklar ve farklı ekosistemler birlikte düşünülür.", "Buna biyoçeşitlilik denir."],
          { kural: "Biyoçeşitlilik = tür + birey (genetik) + ekosistem çeşitliliği." }),
        z => {
          const bol = ["K", "L", "M", "N"], say = karistir([12, 20, 35, 48, 60]).slice(0, 4);
          const enCok = bol[say.indexOf(Math.max(...say))], enAz = bol[say.indexOf(Math.min(...say))];
          return S({ kaz: "fbiy.kavram", duzey: "uygulama", zorluk: 1,
            soru: "Grafikte eşit büyüklükteki dört bölgede yaşayan farklı canlı <b>türlerinin sayısı</b> verilmiştir. Biyoçeşitliliği en fazla olan bölge hangisidir?",
            gorsel: G.sutun(bol.map((b, i) => [b, say[i]]), { baslik: "Bölgelerdeki tür sayısı", birim: "tür" }),
            dogru: enCok + " bölgesi",
            yanlis: [[enAz + " bölgesi", "dikkat", "Bu bölgede tür sayısı en azdır."], [bol.find(b => b !== enCok && b !== enAz) + " bölgesi", "dikkat", "Bu bölgenin tür sayısı en büyük değil."], ["Hepsi eşittir", "dikkat", "Sütunların boyları farklı; tür sayıları eşit değil."]],
            ipucu: "Tür sayısı en fazla olan bölgeyi bul.",
            cozum: ["Biyoçeşitlilik, farklı tür sayısı arttıkça artar.", `En yüksek sütun ${Math.max(...say)} tür ile ${enCok} bölgesindedir.`, `Bu yüzden biyoçeşitliliği en fazla olan bölge ${enCok}'dir.`.replace(/'dir\.$/, " bölgesidir.")],
            kural: "Farklı tür sayısı ne kadar çoksa biyoçeşitlilik o kadar fazladır." });
        },
        Q("fbiy.kavram", "aciklama", 2, "Biyoçeşitliliğin insanlar için önemine örnek <b>olmayan</b> hangisidir?", "Plastik atıkların doğada uzun süre kalması",
          [["Birçok ilacın hammaddesinin bitkilerden elde edilmesi", "kavrama", "Bu, biyoçeşitliliğin sağlık için önemine bir örnektir."], ["Arıların tozlaşma ile meyve verimini artırması", "kavrama", "Bu, biyoçeşitliliğin tarım için önemine bir örnektir."], ["Ormanların oksijen üretmesi", "kavrama", "Bu, biyoçeşitliliğin yaşam için önemine bir örnektir."]],
          "Hangi seçenek canlıların bize sağladığı bir yarar değildir?", ["İlaç, tozlaşma ve oksijen canlıların sağladığı yararlardır.", "Plastiğin doğada uzun süre kalması bir çevre sorunudur.", "Bu yüzden biyoçeşitliliğin önemine örnek değildir."],
          { kural: "Biyoçeşitlilik besin, ilaç, oksijen, hammadde sağlar ve doğal dengeyi korur." }),
        Q("fbiy.kavram", "baglanti", 3, "Bir ormandaki kurtların avlanarak yok edilmesinden bir süre sonra tavşan sayısının çok arttığı ve otların azaldığı gözleniyor. Bu durum neyi gösterir?", "Bir türün yok olması besin zincirindeki diğer canlıları da etkiler.",
          [["Kurtların ormanla hiçbir ilişkisi yoktur.", "kavrama", "Kurtlar tavşanları avlayarak sayılarını dengede tutar."], ["Tavşanların artması ormana her zaman yararlıdır.", "kavrama", "Çok artan tavşanlar otları tüketir; denge bozulur."], ["Otların azalması kurtlarla ilgili değildir.", "strateji", "Olaylar zincirleme bağlıdır: kurt azaldı → tavşan arttı → ot azaldı."]],
          "Kurt → tavşan → ot ilişkisini düşün.", ["Ot → tavşan → kurt bir besin zinciridir.", "Kurtlar yok olunca tavşanları avlayan kalmaz ve tavşanlar çoğalır.", "Çoğalan tavşanlar otları tüketir; bir türün kaybı bütün zinciri etkilemiştir."],
          { gorsel: G.svg(420, 80, `<rect class="g-c g-cizgi" x="10" y="20" width="100" height="40" rx="8"/><rect class="g-b g-cizgi" x="160" y="20" width="100" height="40" rx="8"/><rect class="g-d g-cizgi" x="310" y="20" width="100" height="40" rx="8"/>` + G.yazi(60, 46, "Ot 🌿") + G.yazi(210, 46, "Tavşan 🐇") + G.yazi(360, 46, "Kurt 🐺") + G.ok(112, 40, 158, 40) + G.ok(262, 40, 308, 40), "ot, tavşan ve kurttan oluşan besin zinciri"), kural: "Canlılar birbirine bağlıdır; bir türün kaybı doğal dengeyi bozar." }),
        Q("fbiy.kavram", "transfer", 2, "Bir çiftçi tarlasına her yıl aynı tek tür buğdayı ekiyor; komşusu ise farklı ürünleri sırayla ekiyor ve tarla kenarlarında yabani bitkileri koruyor. Bir hastalık salgınında hangi tarlanın daha az zarar görmesi beklenir?", "Farklı ürünler ekilen ve çeşitliliği korunan tarla",
          [["Tek tür buğday ekilen tarla", "kavrama", "Tek tür bitki olduğunda hastalık bütün tarlaya kolayca yayılır."], ["İkisi de aynı zarar görür", "kavrama", "Çeşitlilik, hastalığın yayılmasını sınırlar; zararlar farklı olur."], ["Hiçbiri zarar görmez", "kavrama", "Salgında bitkiler zarar görebilir; önemli olan zararın ne kadar olduğudur."]],
          "Çeşitlilik bir canlı topluluğunu nasıl korur?", ["Bir hastalık genellikle belirli türleri etkiler.", "Tek tür ekilen tarlada bütün bitkiler aynı hastalığa yakalanabilir.", "Çeşitliliğin korunduğu tarlada bazı bitkiler etkilenmez; zarar daha az olur."],
          { kural: "Çeşitlilik arttıkça doğal sistemler değişikliklere ve hastalıklara karşı daha dayanıklı olur." }),
      ],
      "fbiy.turkiye": [
        Q("fbiy.turkiye", "hatirlama", 1, "Yalnızca belirli bir bölgede doğal olarak yaşayan türlere ne ad verilir?", "Endemik tür",
          [["Yabancı tür", "bilgi", "Yabancı tür, bir bölgeye dışarıdan gelen türdür."], ["Nesli tükenmiş tür", "bilgi", "Nesli tükenmiş türün dünyada yaşayan bireyi kalmamıştır."], ["Evcil tür", "bilgi", "Evcil türler insanlarla birlikte yaşayan hayvanlardır."]],
          "Bir yere “özgü” olan…", ["Bazı türler dünyada yalnızca bir bölgede doğal olarak bulunur.", "Bu türlere endemik tür denir."],
          { kural: "Endemik tür = yalnızca belirli bir bölgeye özgü tür." }),
        Q("fbiy.turkiye", "aciklama", 2, "Türkiye'nin biyoçeşitlilik bakımından zengin olmasının nedenlerinden biri <b>değildir</b>?", "Nüfusunun hızla artması",
          [["İklim çeşitliliğinin fazla olması", "kavrama", "Farklı iklimler farklı canlıların yaşamasına olanak verir; bu bir nedendir."], ["Yer şekillerinin çeşitli olması", "kavrama", "Dağ, ova, göl gibi farklı ortamlar çeşitliliği artırır; bu bir nedendir."], ["Üç tarafının denizlerle çevrili olması", "kavrama", "Denizler farklı yaşam alanları sağlar; bu bir nedendir."]],
          "Hangi seçenek biyoçeşitliliği artırmaz, hatta tehdit edebilir?", ["İklim, yer şekli ve deniz çeşitliliği farklı yaşam alanları oluşturur; çeşitliliği artırır.", "Hızlı nüfus artışı ise yapılaşma ve kirlilikle yaşam alanlarını daraltabilir.", "Bu nedenle nüfus artışı zenginliğin nedeni değildir."],
          { kural: "Türkiye'nin zenginliği: iklim çeşitliliği, yer şekilleri, denizler, farklı bitki bölgelerinin kesişmesi." }),
        Q("fbiy.turkiye", "uygulama", 2, "Tabloda bazı canlıların yaşadığı yerler verilmiştir. Hangi canlı <b>endemiktir</b>?", "Z",
          [["X", "kavrama", "X birçok kıtada yaşıyor; endemik değildir."], ["Y", "kavrama", "Y birçok ülkede bulunuyor; endemik değildir."], ["T", "kavrama", "T başka bir ülkeden getirilmiş; bu yabancı türdür."]],
          "Doğal olarak yalnızca tek bir bölgede yaşayanı bul.", ["Endemik tür, yalnızca belirli bir bölgede doğal olarak yaşar.", "Z yalnızca tek bir gölün çevresinde doğal olarak yaşamaktadır.", "Bu yüzden Z endemiktir."],
          { gorsel: G.tablo(["Canlı", "Yaşadığı yerler"], [["X", "Asya, Avrupa ve Afrika'daki birçok ülke"], ["Y", "Türkiye ve komşu ülkeler"], ["Z", "Yalnızca bir gölün çevresi (doğal olarak)"], ["T", "Başka bir ülkeden getirilip yetiştiriliyor"]]), kural: "Endemik türün yayılış alanı dardır; başka yerde doğal olarak bulunmaz." }),
        Q("fbiy.turkiye", "transfer", 3, "Van Gölü havzasına özgü inci kefali, üremek için göle dökülen akarsulara göç eder. Bu türü korumak için hangisi <b>en etkili</b> önlemdir?", "Üreme döneminde avlanmayı yasaklamak ve akarsuların önünü kapatmamak",
          [["İnci kefalini başka göllere taşıyıp çoğaltmak", "strateji", "Türün kendi yaşam alanı korunmalıdır; başka göllere taşımak oradaki dengeyi bozabilir."], ["Üreme döneminde daha çok avlanmak", "kavrama", "Üreme döneminde avlanmak yeni bireylerin oluşmasını engeller."], ["Akarsuların üzerine baraj yapıp suyu tamamen tutmak", "kavrama", "Akarsu yolu kapanırsa balıklar üreme alanlarına ulaşamaz."]],
          "Türün üremesi nasıl korunur?", ["İnci kefali endemiktir; yalnızca Van Gölü havzasında doğal olarak yaşar.", "Üremek için akarsulara göç ettiğinden bu dönemde avlanma ve yolun kapanması türü tehdit eder.", "Üreme döneminde av yasağı ve akarsuların açık tutulması türü korur."],
          { kural: "Endemik türü korumanın yolu, onun yaşam alanını ve üremesini korumaktır." }),
        Q("fbiy.turkiye", "baglanti", 3, "Endemik türlerin korunması, geniş alanda yaşayan türlere göre neden daha acil bir konudur?", "Yaşadıkları tek bölge bozulursa dünyadan tamamen yok olabilirler.",
          [["Endemik türler her yerde yaşayabildiği için korunmaya gerek yoktur.", "kavrama", "Endemik türler yalnızca belirli bir bölgede yaşar."], ["Endemik türlerin hepsinin nesli zaten tükenmiştir.", "bilgi", "Endemik türler yaşamaktadır; korunmaları bu yüzden önemlidir."], ["Endemik türler yalnızca hayvanlardır.", "bilgi", "Endemik bitki türleri de vardır (ör. Kaz Dağı göknarı)."]],
          "Bir türün yaşadığı tek yer yok olursa ne olur?", ["Geniş alanda yaşayan bir tür bir bölgede azalsa bile başka yerlerde yaşamaya devam eder.", "Endemik türün ise başka yaşam alanı yoktur.", "O bölge bozulursa tür dünyadan tamamen silinebilir."],
          { kural: "Türkiye'deki bitki türlerinin yaklaşık üçte biri endemiktir; korunmaları bizim sorumluluğumuzdur." }),
      ],
      "fbiy.tehdit": [
        Q("fbiy.tehdit", "hatirlama", 1, "Aşağıdakilerden hangisi biyoçeşitliliği <b>tehdit eden</b> bir etkendir?", "Sulak alanların kurutulması",
          [["Milli park kurulması", "kavrama", "Milli parklar canlıları korur."], ["Ağaçlandırma yapılması", "kavrama", "Ağaçlandırma yaşam alanlarını artırır."], ["Tohum gen bankası kurulması", "kavrama", "Gen bankaları türleri korumaya yöneliktir."]],
          "Hangisi canlıların yaşam alanını yok eder?", ["Sulak alanlar birçok kuş, balık ve bitkiye yaşam alanı sağlar.", "Kurutulduklarında bu canlılar yaşam alanlarını kaybeder.", "Bu, biyoçeşitliliği tehdit eder."],
          { kural: "En büyük tehditlerden biri yaşam alanı (habitat) kaybıdır." }),
        Q("fbiy.tehdit", "aciklama", 2, "Akdeniz'e Süveyş Kanalı yoluyla gelen balon balığı gibi yabancı (istilacı) türler biyoçeşitliliği nasıl etkiler?", "Yerli türlerle besin ve yaşam alanı için yarışarak onları azaltabilir.",
          [["Her zaman biyoçeşitliliği artırır.", "kavrama", "Yabancı türler çoğu zaman yerli türlerin azalmasına neden olur."], ["Yerli türleri hiçbir şekilde etkilemez.", "kavrama", "Yabancı türler yerli türlerin besinine ve yaşam alanına ortak olur."], ["Yalnızca suyun sıcaklığını değiştirir.", "bilgi", "Yabancı türlerin etkisi sıcaklık değil, canlılar arası ilişkiler üzerindedir."]],
          "Yeni gelen bir tür yerli türlerle neyi paylaşır?", ["Yabancı türün yeni ortamda çoğu zaman doğal düşmanı yoktur ve hızla çoğalır.", "Yerli türlerin besinine ve yaşam alanına ortak olur, bazen onları avlar.", "Bu nedenle yerli türler azalabilir ve biyoçeşitlilik zarar görür."],
          { kural: "Yabancı (istilacı) türler yerli türleri tehdit eder." }),
        z => {
          const ornek = sec([
            ["Bir ormanın kesilip yerine site yapılması", "Yaşam alanı kaybı"],
            ["Fabrika atıklarının arıtılmadan dereye boşaltılması", "Kirlilik"],
            ["Üreme döneminde ve boyu küçük balıkların avlanması", "Aşırı ve bilinçsiz avlanma"],
            ["Bir göle başka bölgeden getirilen balıkların bırakılması", "Yabancı tür girişi"],
          ]);
          const tum = ["Yaşam alanı kaybı", "Kirlilik", "Aşırı ve bilinçsiz avlanma", "Yabancı tür girişi"].filter(t => t !== ornek[1]);
          return S({ kaz: "fbiy.tehdit", duzey: "uygulama", zorluk: 2,
            soru: `“<b>${ornek[0]}</b>” biyoçeşitliliği tehdit eden hangi etkene örnektir?`,
            dogru: ornek[1],
            yanlis: tum.map(t => [t, "kavrama", "Bu etken başka türden bir tehdittir; olayda doğrudan bu durum anlatılmıyor."]),
            ipucu: "Olayda canlılara zarar veren asıl şey nedir?",
            cozum: ["Tehditler: yaşam alanı kaybı, kirlilik, aşırı avlanma, yabancı türler, iklim değişikliği.", `Verilen olayda: ${ornek[0].toLocaleLowerCase("tr")}.`, `Bu olay “${ornek[1].toLocaleLowerCase("tr")}” örneğidir.`],
            kural: "Biyoçeşitlilik tehditlerini olaylarla eşleştirebilmelisin." });
        },
        Q("fbiy.tehdit", "transfer", 3, "Deniz kaplumbağalarının (Caretta caretta) yumurtladığı kumsallarda gece ışık yakılması ve şemsiye dikilmesi yasaklanmıştır. Bu önlemin amacı nedir?", "Yumurtlama alanını ve yavruların denize ulaşmasını korumak",
          [["Turistlerin kumsala gelmesini tamamen yasaklamak", "strateji", "Amaç turizmi yasaklamak değil, kaplumbağaların üremesini korumaktır."], ["Kumsalın daha temiz görünmesini sağlamak", "strateji", "Asıl amaç nesli tehlikedeki türü korumaktır."], ["Kaplumbağaların başka kumsallara göç etmesini sağlamak", "kavrama", "Amaç kaplumbağaları kaçırmak değil, korumaktır."]],
          "Yumurtadan çıkan yavrular denizi nasıl bulur?", ["Kaplumbağalar yumurtalarını kuma gömer; şemsiyeler yuvalara zarar verebilir.", "Yumurtadan çıkan yavrular denizin yansıttığı ışığa yönelir; yapay ışıklar onları karaya doğru şaşırtır.", "Bu önlemler nesli tehlikedeki türün üremesini korur."],
          { kural: "Nesli tehlikedeki türleri korumak için yaşam alanlarında özel önlemler alınır." }),
        Q("fbiy.tehdit", "baglanti", 2, "Bir öğrenci biyoçeşitliliği korumak için yapabileceklerini tabloya yazıyor. Hangisi listeye <b>uygun değildir</b>?", "Piknikte kopardığı yabani çiçekleri eve götürmek",
          [["Doğada çöp bırakmamak", "kavrama", "Bu, kirliliği önleyerek canlıları korur; listeye uygundur."], ["Kâğıdı tasarruflu kullanmak", "kavrama", "Kâğıt tasarrufu ağaç kesimini azaltır; listeye uygundur."], ["Kuşlar için yuva ve su kabı koymak", "kavrama", "Bu, canlılara destek olur; listeye uygundur."]],
          "Hangi davranış doğaya zarar verir?", ["Çöp bırakmamak, kâğıt tasarrufu ve kuşlara yuva yapmak canlıları korur.", "Yabani çiçekleri koparmak, onların tohum vermesini ve çoğalmasını engeller.", "Bu davranış listeye uygun değildir."],
          { gorsel: G.tablo(["Biyoçeşitliliği korumak için yapabileceklerim"], [["Doğada çöp bırakmamak"], ["Kâğıdı tasarruflu kullanmak"], ["Kuşlar için yuva ve su kabı koymak"], ["Piknikte kopardığı yabani çiçekleri eve götürmek"]]), kural: "Biyoçeşitliliği korumak her bireyin sorumluluğudur." }),
      ],
    },
  });

  /* ======================= 7) İNSAN VE ÇEVRE ETKİLEŞİMİ ======================= */
  KONU_EKLE("fen", {
    id: "f_cevre", tema: "f7", ad: "İnsan ve Çevre Etkileşimi",
    kazanimlar: [
      { id: "fcev.sorun", ad: "Hava, su ve toprak kirliliğinin nedenlerini ve sonuçlarını açıklama" },
      { id: "fcev.surdur", ad: "Sürdürülebilir yaşam için geri dönüşüm, enerji ve su tasarrufu gibi bireysel sorumlulukları açıklama" },
      { id: "fcev.co", ad: "Karbonmonoksit zehirlenmesinin nedenlerini ve korunma yollarını açıklama" },
    ],
    anlatim: [
      { baslik: "Çevre sorunları",
        metin: "İnsanlar ihtiyaçlarını karşılarken çevreyi etkiler. Bilinçsiz davranışlar çevre sorunlarına yol açar:<br>• <b>Hava kirliliği:</b> fabrika bacaları, taşıt egzozları, kalitesiz kömür yakılması. Solunum hastalıklarına ve asit yağmurlarına neden olur.<br>• <b>Su kirliliği:</b> arıtılmadan dökülen evsel ve sanayi atıkları, tarım ilaçları. Sudaki canlılar ölür, içme suyu kirlenir.<br>• <b>Toprak kirliliği:</b> çöpler, atık piller, aşırı gübre ve tarım ilacı. Toprağın verimi düşer, zararlı maddeler besinlerimize geçebilir.<br>Kirlilik türleri birbirine bağlıdır: havadaki kirleticiler yağmurla toprağa ve suya karışır.",
        ornek: "Bir atık pil toprağa atılırsa içindeki zararlı maddeler toprağa ve yeraltı suyuna karışabilir; bu yüzden piller atık pil kutularına atılır.",
        durak: { soru: "Aşağıdakilerden hangisi <b>su kirliliğine</b> doğrudan yol açar?", secenekler: [["Fabrika atıklarının arıtılmadan dereye verilmesi", true, "Arıtılmamış atıklar suyu doğrudan kirletir."], ["Güneş panellerinin kullanılması", false, "Güneş panelleri temiz enerji üretir."], ["Ağaç dikilmesi", false, "Ağaç dikmek çevreye yararlıdır."], ["Bisiklet kullanılması", false, "Bisiklet hava kirliliğini azaltır."]] } },
      { baslik: "Sürdürülebilir yaşam ve bireysel sorumluluklar",
        metin: "<b>Sürdürülebilir yaşam:</b> Doğal kaynakları, gelecek nesillerin de ihtiyaçlarını karşılayabileceği şekilde dikkatli kullanmaktır.<br>• <b>Azalt – yeniden kullan – geri dönüştür:</b> İhtiyaç kadar tüket, eşyaları yeniden kullan, kâğıt, cam, plastik ve metal atıkları ayrı kutulara at. Atık piller ve elektronik atıklar ayrı toplanır. Meyve–sebze kabukları kompost yapılarak gübreye dönüştürülebilir.<br>• <b>Su tasarrufu:</b> Dişleri fırçalarken musluğu kapat, damlayan muslukları tamir ettir, çamaşır ve bulaşık makinesini tam dolu çalıştır.<br>• <b>Enerji tasarrufu:</b> Boş odada ışığı kapat, tasarruflu (LED) ampul kullan, cihazları bekleme modunda bırakma, evlerde yalıtım yaptır, güneş ve rüzgâr gibi <b>yenilenebilir enerji kaynaklarını</b> tercih et.",
        ornek: "Geri dönüştürülen her ton kâğıt, yeni kâğıt için kesilecek ağaç sayısını azaltır; cam ise defalarca geri dönüştürülebilir.",
        gorsel: G.tablo(["Atık", "Kutu"], [["Gazete, karton", "Kâğıt"], ["Cam şişe, kavanoz", "Cam"], ["Pet şişe, plastik kap", "Plastik"], ["Konserve kutusu", "Metal"], ["Kullanılmış pil", "Atık pil kutusu"]]),
        durak: { soru: "Aşağıdakilerden hangisi sürdürülebilir yaşama uygun bir davranıştır?", secenekler: [["Alışverişe bez çanta ile gitmek", true, "Bez çanta defalarca kullanılır; plastik poşet tüketimini azaltır."], ["Musluğu açık bırakarak diş fırçalamak", false, "Bu davranış suyu boşa harcar."], ["Boş odada ışıkları açık bırakmak", false, "Bu davranış enerjiyi boşa harcar."], ["Atık pilleri çöp kutusuna atmak", false, "Piller toprağı ve suyu kirletir; ayrı toplanmalıdır."]] } },
      { baslik: "Karbonmonoksit zehirlenmesi ve korunma",
        metin: "<b>Karbonmonoksit</b>; kömür, odun, doğal gaz gibi yakıtlar <b>yeterli oksijen olmadan</b> (tam yanmadan) yandığında oluşan bir gazdır. <b>Renksiz, kokusuz ve tatsızdır</b>; bu yüzden fark edilmesi çok zordur.<br><b>Kaynakları:</b> bacası tıkalı ya da bakımsız sobalar, şofbenler, kombiler, kapalı ortamda yakılan mangal ve kapalı garajda çalışan araçlar.<br><b>Belirtileri:</b> baş ağrısı, baş dönmesi, bulantı, halsizlik ve uyku hâli.<br><b>Korunma:</b> Soba ve bacalar her yıl kontrol ettirilip temizletilmeli, ortam düzenli havalandırılmalı, kapalı alanda mangal yakılmamalı, karbonmonoksit dedektörü kullanılmalı, soba yanarken uyunmamalıdır.<br><b>Şüphelenirsen:</b> Hemen pencere ve kapıları aç, ortamdan çık ve 112'yi ara.",
        ornek: "Doğal gazın kendisi kokusuzdur; kaçakları fark edebilmemiz için özel bir koku eklenir. Gaz kokusu alınırsa ışık düğmelerine dokunulmaz, ateş yakılmaz, vana kapatılır, ortam havalandırılır ve 187 doğal gaz acil hattı aranır.",
        durak: { soru: "Karbonmonoksit neden çok tehlikelidir?", secenekler: [["Renksiz ve kokusuz olduğu için fark edilmesi zordur.", true, "İnsan gazı göremez ve koklayamaz; zehirlenme fark edilmeden başlar."], ["Çok kötü koktuğu için", false, "Karbonmonoksit kokusuzdur."], ["Yalnızca yazın oluştuğu için", false, "Soba ve kombi kullanılan kış aylarında daha sık görülür."], ["Yalnızca açık havada oluştuğu için", false, "Asıl tehlike kapalı ortamlarda birikmesidir."]] } },
    ],
    uret: {
      "fcev.sorun": [
        Q("fcev.sorun", "hatirlama", 1, "Aşağıdakilerden hangisi <b>hava kirliliğinin</b> nedenlerinden biridir?", "Taşıtların egzoz gazları",
          [["Ağaçlandırma çalışmaları", "kavrama", "Ağaçlar havayı temizlemeye yardım eder."], ["Güneş enerjisi kullanımı", "kavrama", "Güneş enerjisi temiz bir kaynaktır; havayı kirletmez."], ["Atıkların geri dönüştürülmesi", "kavrama", "Geri dönüşüm kirliliği azaltır."]],
          "Hangisi havaya zararlı gaz ve duman verir?", ["Taşıtlarda yakıt yanınca egzozdan zararlı gazlar çıkar.", "Bu gazlar havayı kirletir.", "Diğer seçenekler kirliliği azaltan davranışlardır."],
          { kural: "Hava kirliliği: egzoz, fabrika bacası, kalitesiz yakıt." }),
        z => {
          const ornek = sec([
            ["Tarlaya gereğinden fazla gübre ve tarım ilacı atılması", "Toprak kirliliği"],
            ["Kışın kalitesiz kömür yakılması", "Hava kirliliği"],
            ["Evsel atık suların arıtılmadan denize verilmesi", "Su kirliliği"],
            ["Atık pillerin toprağa gömülmesi", "Toprak kirliliği"],
            ["Fabrika bacalarına filtre takılmaması", "Hava kirliliği"],
            ["Gemilerden denize petrol sızması", "Su kirliliği"],
          ]);
          const tum = ["Hava kirliliği", "Su kirliliği", "Toprak kirliliği", "Ses (gürültü) kirliliği"].filter(t => t !== ornek[1]);
          return S({ kaz: "fcev.sorun", duzey: "uygulama", zorluk: 1,
            soru: `“<b>${ornek[0]}</b>” doğrudan hangi çevre sorununa yol açar?`,
            dogru: ornek[1],
            yanlis: tum.map(t => [t, "kavrama", "Olayda kirlenen ortam bu değildir; zararlı maddelerin ilk ulaştığı yere bak."]),
            ipucu: "Zararlı maddeler ilk olarak nereye karışıyor: havaya, suya mı, toprağa mı?",
            cozum: [`Olay: ${ornek[0].toLocaleLowerCase("tr")}.`, `Bu olayda zararlı maddeler doğrudan ${ornek[1] === "Hava kirliliği" ? "havaya" : ornek[1] === "Su kirliliği" ? "suya" : "toprağa"} karışır.`, `Bu yüzden olay ${ornek[1].toLocaleLowerCase("tr")} örneğidir.`],
            kural: "Kirlilik türleri birbirine bağlıdır ama her olay önce bir ortamı kirletir." });
        },
        Q("fcev.sorun", "aciklama", 2, "Tarlalarda aşırı tarım ilacı kullanılması zamanla dere suyunu da kirletebilir. Bunun nedeni nedir?", "Yağmur suları ilaçları topraktan derelere ve yeraltı suyuna taşır.",
          [["Tarım ilaçları buharlaşıp yalnızca havayı kirletir.", "kavrama", "İlaçlar toprağa ve suya da geçer."], ["Toprak, ilaçları tamamen yok eder.", "kavrama", "Pek çok ilaç toprakta uzun süre kalır ve suya karışabilir."], ["Dereler tarlalardan hiç etkilenmez.", "kavrama", "Yağmurla akan su tarladaki maddeleri derelere taşır."]],
          "Yağmur yağınca tarladaki su nereye gider?", ["Tarım ilaçları toprağa karışır.", "Yağmur suyu toprağın üstünden akarak derelere ulaşır, bir kısmı da yeraltına sızar.", "Bu sular ilaçları da taşıdığı için toprak kirliliği su kirliliğine dönüşür."],
          { kural: "Hava, su ve toprak kirliliği birbirine bağlıdır." }),
        Q("fcev.sorun", "uygulama", 2, "Grafikte bir şehrin aylara göre hava kirliliği değerleri verilmiştir. Kirliliğin kış aylarında artmasının en olası nedeni nedir?", "Isınma için yakıt kullanımının artması",
          [["Kışın ağaçların daha çok oksijen üretmesi", "kavrama", "Oksijen üretimi kirliliği artırmaz; ayrıca kışın birçok ağaç yaprak döker."], ["Kışın güneş panellerinin çok kullanılması", "kavrama", "Güneş panelleri havayı kirletmez."], ["Kışın taşıtların hiç kullanılmaması", "dikkat", "Taşıtlar kışın da kullanılır; ayrıca az taşıt kirliliği azaltır."]],
          "Kışın evlerde neye daha çok ihtiyaç duyulur?", ["Grafikte Aralık, Ocak ve Şubat aylarında değerler yüksektir.", "Bu aylarda ısınmak için soba ve kalorifer yakılır; özellikle kalitesiz kömür havayı kirletir.", "Kirliliğin artmasının nedeni ısınma için yakıt kullanımıdır."],
          { gorsel: G.sutun([["Ara", 90], ["Oca", 100], ["Şub", 80], ["Nis", 40], ["Tem", 30], ["Eki", 45]], { baslik: "Aylara göre hava kirliliği", birim: "değer" }), kural: "Kalitesiz yakıt ve fazla yakıt tüketimi hava kirliliğini artırır." }),
        Q("fcev.sorun", "baglanti", 3, "Bir göle arıtılmamış atık sular boşaltılıyor ve bir süre sonra göldeki balıkların azaldığı görülüyor. Bu olay hangi konuyla doğrudan ilişkilidir?", "Kirliliğin biyoçeşitliliği tehdit etmesi",
          [["Maddenin genleşmesi", "bilgi", "Genleşme sıcaklıkla hacmin artmasıdır; bu olayla ilgisi yoktur."], ["Elektriğin iletimi", "bilgi", "Olay elektrikle değil, su kirliliği ve canlılarla ilgilidir."], ["Işığın yansıması", "bilgi", "Olay ışıkla ilgili değildir."]],
          "Balıkların azalması hangi ünitenin konusuyla ilgilidir?", ["Atık sular gölü kirletir; sudaki oksijen azalır ve zararlı maddeler birikir.", "Bu ortamda balıklar ve diğer canlılar yaşayamaz.", "Kirlilik, biyoçeşitliliği tehdit eden etkenlerden biridir."],
          { kural: "Kirlilik, biyoçeşitliliği tehdit eden başlıca etkenlerdendir." }),
      ],
      "fcev.surdur": [
        Q("fcev.surdur", "hatirlama", 1, "Doğal kaynakları gelecek nesillerin ihtiyaçlarını da düşünerek kullanmaya ne ad verilir?", "Sürdürülebilir yaşam",
          [["Aşırı tüketim", "kavrama", "Aşırı tüketim kaynakları hızla bitirir; tam tersidir."], ["Kirlilik", "bilgi", "Kirlilik bir çevre sorunudur."], ["Erozyon", "bilgi", "Erozyon toprağın su ve rüzgârla taşınmasıdır."]],
          "Kaynakların “sürmesi”, yani bitmeden devam etmesi…", ["Kaynakları dikkatli kullanırsak gelecekte de yeterli olur.", "Bu yaşam biçimine sürdürülebilir yaşam denir."],
          { kural: "Sürdürülebilir yaşam = bugünün ihtiyacını yarını tüketmeden karşılamak." }),
        z => {
          const atik = sec([["Gazete", "Kâğıt"], ["Karton kutu", "Kâğıt"], ["Reçel kavanozu", "Cam"], ["Cam şişe", "Cam"], ["Pet şişe", "Plastik"], ["Plastik yoğurt kabı", "Plastik"], ["Konserve kutusu", "Metal"], ["Alüminyum içecek kutusu", "Metal"], ["Kullanılmış kalem pil", "Atık pil kutusu"]]);
          const tum = ["Kâğıt", "Cam", "Plastik", "Metal", "Atık pil kutusu"].filter(t => t !== atik[1]);
          return S({ kaz: "fcev.surdur", duzey: "uygulama", zorluk: 1,
            soru: `<b>${atik[0]}</b> hangi geri dönüşüm kutusuna atılmalıdır?`,
            gorsel: G.svg(460, 100, ["Kâğıt", "Cam", "Plastik", "Metal", "Pil"].map((k, i) => `<rect class="${["g-a", "g-c", "g-b", "g-yumusak", "g-d"][i]} g-cizgi" x="${10 + i * 90}" y="10" width="80" height="50" rx="6"/>` + G.yazi(50 + i * 90, 84, k, { b: 1 })).join(""), "geri dönüşüm kutuları"),
            dogru: atik[1],
            yanlis: karistir(tum).slice(0, 3).map(t => [t, "bilgi", `${atik[0]} bu kutuya ait değildir; yapıldığı maddeyi düşün.`]),
            ipucu: "Atığın hangi maddeden yapıldığını düşün.",
            cozum: ["Atıklar yapıldıkları maddeye göre ayrılır.", `${atik[0]} ${atik[1] === "Atık pil kutusu" ? "zararlı maddeler içerdiği için ayrı toplanır" : atik[1].toLocaleLowerCase("tr") + " atığıdır"}.`, `Doğru kutu: ${atik[1]}.`],
            kural: "Kâğıt, cam, plastik, metal ayrı; piller her zaman atık pil kutusuna." });
        },
        z => {
          const debi = sec([4, 5, 6, 8]), dk = sec([2, 3]), gun = sec([2, 3]), kisi = sec([3, 4, 5]);
          if (gun === kisi) return null; const top = debi * dk * gun * kisi;
          return S({ kaz: "fcev.surdur", duzey: "transfer", zorluk: 3,
            soru: `${kisi} kişilik bir ailede herkes dişlerini günde ${gun} kez fırçalıyor ve her seferinde musluk ${dk} dakika açık kalıyor. Musluktan dakikada ${debi} litre su akıyorsa, aile fırçalarken musluğu kapatarak bir günde en fazla kaç litre su tasarruf eder?`,
            dogru: top + " litre",
            yanlis: [[debi * dk * gun + " litre", "dikkat", "Bu yalnızca bir kişinin tasarrufu; aile kişi sayısıyla çarpmayı unuttun."], [debi * dk * kisi + " litre", "dikkat", "Günde kaç kez fırçalandığını hesaba katmadın."], [debi * dk + " litre", "dikkat", "Bu yalnızca bir kişinin bir fırçalamada harcadığı su."]],
            ipucu: "Bir fırçalamadaki suyu bul, sonra fırçalama sayısı ve kişi sayısıyla çarp.",
            cozum: [`Bir fırçalamada: ${debi} × ${dk} = ${debi * dk} litre.`, `Bir kişi bir günde: ${debi * dk} × ${gun} = ${debi * dk * gun} litre.`, `Bütün aile bir günde: ${debi * dk * gun} × ${kisi} = ${top} litre su tasarruf edebilir.`],
            kural: "Küçük tasarruflar her gün tekrarlanınca büyük miktarlara ulaşır." });
        },
        Q("fcev.surdur", "aciklama", 2, "Aşağıdakilerden hangisi <b>yenilenebilir</b> enerji kaynağıdır?", "Rüzgâr",
          [["Kömür", "bilgi", "Kömür, oluşması milyonlarca yıl süren ve tükenen bir kaynaktır."], ["Petrol", "bilgi", "Petrol tükenebilir bir fosil yakıttır."], ["Doğal gaz", "bilgi", "Doğal gaz da fosil yakıttır; tükenebilir."]],
          "Hangisi kullanıldıkça bitmez, doğada sürekli yenilenir?", ["Kömür, petrol ve doğal gaz fosil yakıtlardır; kullandıkça azalır.", "Rüzgâr, Güneş ve akarsu gibi kaynaklar sürekli yenilenir.", "Yenilenebilir kaynaklar havayı kirletmeden enerji üretir."],
          { kural: "Yenilenebilir: güneş, rüzgâr, su, jeotermal. Tükenebilir: kömür, petrol, doğal gaz." }),
        Q("fcev.surdur", "uygulama", 2, "Tabloda bir öğrencinin bir haftalık davranışları verilmiştir. Hangisi <b>enerji tasarrufu</b> sağlar?", "Odadan çıkarken ışığı kapatmak",
          [["Musluğu kapatarak diş fırçalamak", "dikkat", "Bu davranış su tasarrufudur."], ["Kâğıtların iki yüzünü de kullanmak", "dikkat", "Bu davranış kâğıt (dolayısıyla ağaç) tasarrufudur."], ["Pet şişeyi geri dönüşüme atmak", "dikkat", "Bu davranış atıkların değerlendirilmesidir; doğrudan elektrik tasarrufu değildir."]],
          "Hangi davranış elektrik kullanımını azaltır?", ["Tablodaki davranışların hepsi çevreye yararlıdır.", "Ancak doğrudan elektrik kullanımını azaltan, ışığı kapatmaktır.", "Bu yüzden enerji tasarrufu sağlayan davranış odadan çıkarken ışığı kapatmaktır."],
          { gorsel: G.tablo(["Gün", "Davranış"], [["Pazartesi", "Musluğu kapatarak diş fırçaladı."], ["Salı", "Odadan çıkarken ışığı kapattı."], ["Çarşamba", "Kâğıtların iki yüzünü de kullandı."], ["Perşembe", "Pet şişeyi geri dönüşüme attı."]]), kural: "Enerji tasarrufu: ışığı kapat, LED ampul, bekleme modunu kapat, yalıtım." }),
        Q("fcev.surdur", "baglanti", 3, "Kâğıdın geri dönüştürülmesi biyoçeşitliliğin korunmasına nasıl katkı sağlar?", "Yeni kâğıt için kesilen ağaç sayısını azaltarak ormanları ve oradaki canlıları korur.",
          [["Kâğıt geri dönüşümünün biyoçeşitlilikle ilgisi yoktur.", "kavrama", "Kâğıt ağaçtan üretilir; geri dönüşüm ormanları korur."], ["Ormanlara daha çok çöp taşınmasını sağlar.", "kavrama", "Geri dönüşüm çöpü azaltır."], ["Ağaçların daha hızlı büyümesini sağlar.", "kavrama", "Geri dönüşüm ağaçların büyüme hızını değiştirmez; kesilmelerini azaltır."]],
          "Kâğıt neyden üretilir?", ["Kâğıdın hammaddesi ağaçtır.", "Kâğıt geri dönüştürülünce yeni kâğıt için daha az ağaç kesilir.", "Ormanlar korunduğunda ormanda yaşayan pek çok canlının yaşam alanı da korunur."],
          { kural: "Geri dönüşüm doğal kaynakları ve yaşam alanlarını korur." }),
      ],
      "fcev.co": [
        Q("fcev.co", "hatirlama", 1, "Karbonmonoksit gazı için aşağıdakilerden hangisi doğrudur?", "Renksiz ve kokusuzdur.",
          [["Keskin ve kötü bir kokusu vardır.", "bilgi", "Karbonmonoksit kokusuzdur; bu yüzden fark edilmesi zordur."], ["Koyu renkli bir dumandır.", "bilgi", "Karbonmonoksit renksizdir; görülmez."], ["İnsan sağlığına zararsızdır.", "bilgi", "Karbonmonoksit zehirlidir ve öldürücü olabilir."]],
          "Karbonmonoksit neden “sessiz tehlike” olarak bilinir?", ["Karbonmonoksit renksiz, kokusuz ve tatsızdır.", "İnsan onu göremez ve koklayamaz; zehirlenme fark edilmeden başlayabilir."],
          { kural: "Karbonmonoksit: renksiz, kokusuz, tatsız ve zehirli bir gazdır." }),
        Q("fcev.co", "aciklama", 2, "Karbonmonoksit nasıl oluşur?", "Yakıtlar yeterli oksijen olmadan (tam yanmadan) yandığında",
          [["Su kaynadığında", "bilgi", "Su kaynayınca su buharı oluşur, karbonmonoksit oluşmaz."], ["Bitkiler fotosentez yaptığında", "bilgi", "Fotosentezde oksijen üretilir."], ["Elektrik akımı bir telden geçtiğinde", "bilgi", "Elektrik akımı karbonmonoksit oluşturmaz."]],
          "Soba, şofben ve mangalın ortak noktası nedir?", ["Kömür, odun ve doğal gaz yanarken oksijen kullanır.", "Ortamda yeterli oksijen yoksa ya da baca çekmiyorsa yakıt tam yanmaz.", "Tam yanmayan yakıtlardan karbonmonoksit oluşur."],
          { kural: "Oksijen yetersiz → tam olmayan yanma → karbonmonoksit." }),
        Q("fcev.co", "uygulama", 2, "Aşağıdaki davranışlardan hangisi karbonmonoksit zehirlenmesi riskini <b>artırır</b>?", "Kapalı bir odada mangal yakmak",
          [["Sobanın bacasını her yıl temizletmek", "kavrama", "Temiz baca gazların dışarı atılmasını sağlar; riski azaltır."], ["Evde karbonmonoksit dedektörü kullanmak", "kavrama", "Dedektör gazı fark edip uyarır; riski azaltır."], ["Odayı düzenli olarak havalandırmak", "kavrama", "Havalandırma gazın birikmesini önler; riski azaltır."]],
          "Hangi davranış gazın kapalı ortamda birikmesine yol açar?", ["Mangal kömürü kapalı ortamda yandıkça oksijen azalır.", "Oksijen azalınca yanma tam olmaz ve karbonmonoksit oluşur.", "Gaz dışarı çıkamadığı için odada birikir; bu çok tehlikelidir."],
          { kural: "Kapalı alanda mangal yakılmaz; soba yanarken uyunmaz." }),
        Q("fcev.co", "transfer", 3, "Kışın sobalı bir odada oturan aile bireyleri baş ağrısı, baş dönmesi ve bulantı hissediyor. Önce ne yapılmalıdır?", "Pencere ve kapıları açıp hemen ortamdan çıkmak ve 112'yi aramak",
          [["Belirtiler geçene kadar odada uyumak", "bilgi", "Uyku hâli zehirlenmenin belirtisi olabilir; odada kalmak çok tehlikelidir."], ["Sobaya daha fazla kömür atmak", "kavrama", "Bu, gazın daha da artmasına neden olabilir."], ["Ağrı kesici alıp odada beklemek", "strateji", "Asıl sorun ortamdaki gazdır; ortamdan uzaklaşmak gerekir."]],
          "Bu belirtiler hangi gazı akla getirir?", ["Baş ağrısı, baş dönmesi ve bulantı karbonmonoksit zehirlenmesinin belirtileri olabilir.", "İlk iş temiz hava sağlamaktır: pencere ve kapılar açılır, ortamdan çıkılır.", "Ardından 112 acil çağrı merkezi aranarak yardım istenir."],
          { kural: "Karbonmonoksitten şüphelenirsen: havalandır, ortamdan çık, 112'yi ara." }),
        Q("fcev.co", "baglanti", 3, "Doğal gaz kaçağından şüphelenilen bir evde aşağıdakilerden hangisi <b>yapılmamalıdır</b>?", "Işıkları açıp kapatarak kaçağı aramak",
          [["Gaz vanasını kapatmak", "kavrama", "Vanayı kapatmak gaz akışını durdurur; yapılması gereken bir davranıştır."], ["Pencere ve kapıları açmak", "kavrama", "Havalandırma gazın birikmesini önler; doğru davranıştır."], ["Dışarı çıkıp 187'yi aramak", "kavrama", "187 doğal gaz acil hattıdır; doğru davranıştır."]],
          "Elektrik düğmeleri kıvılcım çıkarabilir mi?", ["Elektrik düğmeleri açılıp kapanırken küçük kıvılcımlar oluşabilir.", "Ortamdaki doğal gaz bu kıvılcımla tutuşup patlayabilir.", "Bu yüzden gaz kokusu alınca ışıklara ve elektrikli araçlara dokunulmaz."],
          { gorsel: G.tablo(["Gaz kokusu alınca", ""], [["Vanayı kapat", "✔"], ["Pencere ve kapıları aç", "✔"], ["Elektrik düğmelerine dokunma", "✔"], ["Dışarı çık, 187'yi ara", "✔"]]), kural: "Gaz kokusu: vana kapat, havalandır, kıvılcım çıkarma, 187'yi ara." }),
        Q("fcev.co", "uygulama", 2, "Tabloda üç evdeki soba kullanımı verilmiştir. Hangi evde karbonmonoksit zehirlenmesi riski <b>en azdır</b>?", "C evi",
          [["A evi", "dikkat", "A evinde baca temizlenmemiş; gazlar dışarı atılamayabilir."], ["B evi", "dikkat", "B evinde soba yanarken uyunuyor; bu çok tehlikelidir."], ["A ve B evi eşittir, C en risklidir", "kavrama", "C evinde bütün önlemler alınmış; risk en azdır."]],
          "Bütün güvenlik önlemlerinin alındığı evi bul.", ["A: baca temizlenmemiş. B: soba yanarken uyunuyor.", "C: baca temizlenmiş, dedektör var, soba yanarken uyunmuyor.", "Riskin en az olduğu ev C evidir."],
          { gorsel: G.tablo(["Ev", "Baca temizliği", "Dedektör", "Soba yanarken uyuma"], [["A", "Yapılmadı", "Yok", "Hayır"], ["B", "Yapıldı", "Yok", "Evet"], ["C", "Yapıldı", "Var", "Hayır"]]), kural: "Baca temizliği + dedektör + havalandırma + soba yanarken uyumamak = güvenlik." }),
      ],
    },
  });

})();
