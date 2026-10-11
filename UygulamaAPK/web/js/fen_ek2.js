/* Fen Bilimleri — ek sorular (5., 6. ve 7. ünite: genleşme, hâl değişimi, yoğunluk,
 * elektriğin iletimi, direnç, biyoçeşitlilik, insan ve çevre). Çözümler adım adım anlatılır.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, Q, G } = OGR;

  /* ---------------------------- Ortak çizimler ---------------------------- */
  /* Sıcaklık–zaman grafiği. noktalar: [[dakika, °C], ...]; harf: köşelere K, L, M … yazılır. */
  function grafik(noktalar, { ymin = -20, ymax = 120, isaret = [], harf = false, dakika = true } = {}) {
    const W = 470, H = 270, sol = 62, sag = 450, ust = 28, alt = 226;
    const tmax = noktalar[noktalar.length - 1][0];
    const xk = t => sol + t / tmax * (sag - sol), yk = T => alt - (T - ymin) / (ymax - ymin) * (alt - ust);
    const y0 = yk(Math.max(ymin, Math.min(0, ymax)));
    let ic = G.ok(sol, alt + 8, sol, ust - 14) + G.ok(sol - 8, y0, sag + 12, y0);
    ic += G.yazi(sol - 6, ust - 16, "Sıcaklık (°C)", { a: "start", k: 1 }) + G.yazi(sag + 8, y0 + 22, "Zaman (dk)", { a: "end", k: 1 });
    isaret.forEach(T => { ic += `<line class="g-ince" x1="${sol}" y1="${yk(T)}" x2="${sag}" y2="${yk(T)}" stroke-dasharray="4 4"/>` + G.yazi(sol - 6, yk(T) + 4, T, { a: "end", k: 1 }); });
    ic += `<polyline class="g-cizgi" fill="none" stroke-width="3" points="${noktalar.map(([t, T]) => xk(t).toFixed(1) + "," + yk(T).toFixed(1)).join(" ")}"/>`;
    noktalar.forEach(([t, T], i) => {
      ic += `<circle class="g-a" cx="${xk(t)}" cy="${yk(T)}" r="4"/>`;
      if (harf) ic += G.yazi(xk(t), yk(T) - 9, "KLMNPRST"[i], { k: 1, b: 1 });
      if (dakika && t > 0) ic += G.yazi(xk(t), alt + 18, t, { k: 1 });
    });
    return G.svg(W, H, ic, "sıcaklık–zaman grafiği");
  }

  /* Kütle–hacim grafiği: çizgiler [[ad, yoğunluk], ...] (orijinden geçen doğrular). */
  function kutleHacim(cizgiler, { vmax = 10, mmax = 40 } = {}) {
    const W = 420, H = 260, sol = 60, sag = 390, ust = 30, alt = 220;
    const xk = v => sol + v / vmax * (sag - sol), yk = m => alt - m / mmax * (alt - ust);
    let ic = G.ok(sol, alt + 6, sol, ust - 16) + G.ok(sol - 6, alt, sag + 12, alt);
    ic += G.yazi(sol - 4, ust - 20, "Kütle (g)", { a: "start", k: 1 }) + G.yazi(sag + 8, alt + 34, "Hacim (cm³)", { a: "end", k: 1 });
    for (let v = 2; v <= vmax; v += 2) ic += `<line class="g-ince" x1="${xk(v)}" y1="${ust}" x2="${xk(v)}" y2="${alt}" stroke-dasharray="3 4"/>` + G.yazi(xk(v), alt + 16, v, { k: 1 });
    for (let m = mmax / 4; m <= mmax; m += mmax / 4) ic += `<line class="g-ince" x1="${sol}" y1="${yk(m)}" x2="${sag}" y2="${yk(m)}" stroke-dasharray="3 4"/>` + G.yazi(sol - 6, yk(m) + 4, m, { a: "end", k: 1 });
    cizgiler.forEach(([ad, d]) => {
      const vSon = Math.min(vmax, mmax / d);
      ic += `<line class="g-cizgi" x1="${xk(0)}" y1="${yk(0)}" x2="${xk(vSon)}" y2="${yk(d * vSon)}" stroke-width="3"/>` + G.yazi(xk(vSon) + 8, yk(d * vSon) + 4, ad, { a: "start", b: 1 });
    });
    return G.svg(W, H, ic, "kütle–hacim grafiği");
  }

  /* Reosta ile kurulmuş devre: sürgünün konumu (0: A ucu, 1: B ucu). */
  function reostaDevre(konum, okYonu) {
    const W = 520, H = 220, x1 = 150, x2 = 390, sx = x1 + konum * (x2 - x1);
    let ic = `<rect class="g-cizgi" x="40" y="40" width="440" height="140" rx="8" fill="none" stroke-width="3"/>`;
    ic += `<rect class="g-bos" x="66" y="165" width="48" height="30"/><rect class="g-b g-cizgi" x="72" y="168" width="36" height="24" rx="3"/>` + G.yazi(90, 185, "+ −", { k: 1 });
    ic += `<rect class="g-bos" x="238" y="20" width="44" height="40"/><circle class="g-b g-cizgi" cx="260" cy="34" r="18" stroke-width="2"/>` + G.yazi(260, 39, "💡", { k: 1 });
    ic += `<rect class="g-bos" x="${x1 - 10}" y="160" width="${x2 - x1 + 20}" height="40"/>`;
    for (let i = 0; i < 12; i++) { const a = x1 + i * (x2 - x1) / 12; ic += `<path class="g-cizgi" fill="none" stroke-width="2" d="M${a} 180 l${(x2 - x1) / 48} -10 l${(x2 - x1) / 24} 20 l${(x2 - x1) / 48} -10"/>`; }
    ic += `<line class="g-cizgi" x1="${x1 - 30}" y1="180" x2="${x1}" y2="180" stroke-width="3"/>`;
    ic += G.yazi(x1, 212, "A", { b: 1 }) + G.yazi(x2, 212, "B", { b: 1 });
    ic += `<line class="g-cizgi" x1="${sx}" y1="140" x2="${sx}" y2="172" stroke-width="3"/><path class="g-cizgi-uc" d="M${sx} 174 l-7 -10 l14 0 Z"/><line class="g-cizgi" x1="${sx}" y1="140" x2="480" y2="140" stroke-width="3"/>`;
    ic += `<rect class="g-bos" x="${x2 + 2}" y="160" width="88" height="40"/>`;
    ic += G.yazi(sx, 132, "sürgü", { k: 1 });
    if (okYonu) ic += okYonu < 0 ? G.ok(sx - 10, 112, sx - 70, 112, "g-ok-a") : G.ok(sx + 10, 112, sx + 70, 112, "g-ok-a");
    return G.svg(W, H, ic, "reostalı devre");
  }

  /* Telleri yan yana gösteren çizim: [{ad, uzunluk(1-4), kalinlik(1-3), not}] */
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
  SORU_EKLE("fgen.kavram",
    Q("fgen.kavram", "baglanti", 2, "Halka ve bilye deneyinde soğuk metal bilye halkadan rahatça geçiyor. Bilye ısıtılınca halkadan <b>geçemiyor</b>, bir süre soğuk suda bekletilince yeniden geçiyor. Bu deneyden hangi sonuç çıkarılır?", "Isı alan katı genleşir, ısı veren katı büzülür.",
      [["Isıtılan bilyenin kütlesi artar.", "kavrama", "Isıtmakla bilyeye madde eklenmez; kütle aynı kalır, yalnızca hacim değişir."], ["Isıtılan bilyenin tanecikleri büyür.", "kavrama", "Tanecikler büyümez; ısınınca tanecikler arasındaki boşluk artar."], ["Soğuyan bilyenin tanecik sayısı azalır.", "kavrama", "Soğuyan bilyeden tanecik kaybolmaz; tanecikler birbirine yaklaşır."]],
      "Bilyenin halkadan geçip geçmemesi neyin değiştiğini gösteriyor?",
      ["🔎 Soruyu anlayalım: Bilye ısıtılınca halkadan geçemiyor, soğutulunca yine geçiyor. Bu gözlemden bir sonuç çıkarmamız isteniyor.",
       "💡 Hatırlayalım: Isı alan maddenin tanecikleri hızlanır ve aralarındaki boşluk artar; buna genleşme denir. Isı veren maddede tersi olur; buna büzülme denir.",
       "✏️ Isıtılan bilyenin halkadan geçememesi, hacminin büyüdüğünü yani genleştiğini gösterir.",
       "✏️ Soğuk suda bekleyen bilye ısı verir; hacmi küçülür, yani büzülür. Bu yüzden yeniden geçer.",
       "✅ Sonuç: Isı alan katı genleşir, ısı veren katı büzülür.",
       "🔁 Kontrol edelim: Bilyenin kütlesi ya da tanecik sayısı değişseydi, soğutunca eski hâline dönmezdi. Değişen yalnızca tanecikler arasındaki uzaklıktır."],
      { kural: "Isı alan madde genleşir, ısı veren madde büzülür; kütle değişmez.", dogruNeden: "Isınan bilyenin hacmi büyüdüğü için geçemez, soğuyunca hacmi küçüldüğü için yeniden geçer.",
        gorsel: G.svg(420, 150, `<circle class="g-bos g-cizgi" cx="110" cy="70" r="34" stroke-width="6"/><line class="g-cizgi" x1="110" y1="104" x2="110" y2="140" stroke-width="5"/><circle class="g-d g-cizgi" cx="300" cy="70" r="30" stroke-width="2"/><line class="g-cizgi" x1="300" y1="40" x2="300" y2="10" stroke-width="3"/>` + G.yazi(110, 20, "halka", { k: 1 }) + G.yazi(350, 120, "bilye", { k: 1 }), "halka ve bilye deney düzeneği") }),
    Q("fgen.kavram", "transfer", 2, "Ağzı açık, boş ve soğuk bir cam şişenin ağzına ıslatılmış bozuk para konuyor. Şişe iki elle sıkıca kavranınca para zaman zaman <b>zıplayıp</b> kapanıyor. Bunun nedeni nedir?", "Elin ısısıyla şişedeki hava genleşir ve parayı iterek dışarı çıkar.",
      [["Elin sıkmasıyla şişe küçülür ve hava dışarı fışkırır.", "kavrama", "Cam şişe elle sıkılınca fark edilecek kadar küçülmez; para ısınma sayesinde zıplar."], ["Şişedeki hava soğuyup büzülür ve parayı çeker.", "kavrama", "Hava büzülseydi para yerine oturur, zıplamazdı. Elden ısı alan hava genleşir."], ["Para ısınıp genleşir ve kendiliğinden zıplar.", "dikkat", "Paranın genleşmesi onu zıplatmaz; parayı iten şişedeki havadır."]],
      "Elin sıcaklığı şişenin içindeki havaya ne yapar?",
      ["🔎 Soruyu anlayalım: Şişeyi elimizle tutunca ağzındaki para zıplıyor. Nedenini bulacağız.",
       "💡 Hatırlayalım: Isı alan gaz genleşir; gazlar katı ve sıvılardan çok daha fazla genleşir.",
       "✏️ Elimiz şişeden daha sıcaktır. Isı elimizden cama, camdan içerideki havaya geçer.",
       "✏️ Isınan havanın tanecikleri hızlanır ve daha çok yer kaplamak ister. Kapalı şişede yer yetmeyince hava parayı iterek biraz dışarı kaçar; para zıplar.",
       "✅ Sonuç: Elin ısısıyla şişedeki hava genleşir ve parayı iter.",
       "🔁 Kontrol edelim: Şişeyi buzdolabından çıkmış hâliyle denersen para daha çok zıplar; çünkü sıcaklık farkı büyüktür."],
      { kural: "Gazlar ısı alınca kolayca genleşir.", dogruNeden: "Isınan hava genleşip şişeye sığmayınca parayı iterek dışarı çıkar." }),
    Q("fgen.kavram", "aciklama", 2, "Sıcak bir odadaki sıvılı termometre buzlu suya konunca borudaki sıvı aşağı iniyor. Bu sırada sıvının <b>tanecikleri</b> için hangisi doğrudur?", "Yavaşlar ve birbirlerine yaklaşırlar.",
      [["Hızlanır ve birbirlerinden uzaklaşırlar.", "kavrama", "Bu, ısı alan maddede olur. Buzlu suya konan sıvı ısı verir."], ["Küçülürler ve sayıları azalır.", "kavrama", "Taneciklerin boyu ve sayısı değişmez; yalnızca aralarındaki uzaklık azalır."], ["Hiç hareket etmeden donarlar.", "bilgi", "Sıvı termometrede donmaz; tanecikler yalnızca yavaşlar."]],
      "Buzlu suya konan termometredeki sıvı ısı mı alır, ısı mı verir?",
      ["🔎 Soruyu anlayalım: Termometre sıcaktan soğuğa geçiyor ve sıvı aşağı iniyor. Taneciklere ne olduğunu soruyoruz.",
       "💡 Hatırlayalım: Isı veren maddenin tanecikleri yavaşlar, aralarındaki boşluk azalır; madde büzülür.",
       "✏️ Termometredeki sıvı, kendisinden soğuk olan buzlu suya ısı verir.",
       "✏️ Isı veren sıvı büzülür; hacmi küçüldüğü için ince boruda aşağı iner.",
       "✅ Sonuç: Tanecikler yavaşlar ve birbirlerine yaklaşır.",
       "🔁 Kontrol edelim: Termometreyi sıcak suya koysaydık sıvı yükselirdi; bu kez tanecikler hızlanıp uzaklaşırdı."],
      { kural: "Büzülmede tanecikler yavaşlar ve yaklaşır; tanecik sayısı değişmez.", dogruNeden: "Isı veren sıvının tanecikleri yavaşlayıp yaklaştığı için sıvı büzülür ve seviye düşer." }),
  );

  SORU_EKLE("fgen.ayirt",
    z => {
      const d20 = sec([1, 2, 3]), kat = sec([2, 3, 4]), mad = sec(["X", "Y", "K"]);
      const tablo = [[20, d20], [40, d20 * 2], [60, d20 * 3]];
      const sorT = 20 * (kat + 2), dogruD = d20 * sorT / 20;
      return S({ kaz: "fgen.ayirt", duzey: "uygulama", zorluk: 3,
        soru: `Bir ${mad} çubuğu farklı sıcaklık artışlarında ısıtılıyor ve uzama miktarları tabloya yazılıyor. Uzama bu düzenle sürerse çubuk <b>${sorT} °C</b> ısıtıldığında kaç mm uzar?`,
        gorsel: G.tablo(["Sıcaklık artışı (°C)", "Uzama (mm)"], tablo.map(([t, u]) => [t, u]).concat([[sorT, "?"]])),
        dogru: dogruD + " mm",
        yanlis: [[d20 * 3 + " mm", "strateji", "Bu, 60 °C'taki uzamadır. Sıcaklık artışı daha büyük olduğu için uzama da artmalı."], [sorT + " mm", "dikkat", "Sıcaklık artışını uzama sanmışsın; uzama mm, sıcaklık °C ile ölçülür."], [d20 * (sorT / 20 + 1) + " mm", "islem", "20 °C'lık parça sayısını bir fazla saymışsın; " + sorT + " ÷ 20 = " + (sorT / 20) + " olmalı."]],
        ipucu: "Her 20 °C'lık artışta çubuk kaç mm uzuyor?",
        cozum: [`🔎 Soruyu anlayalım: Tabloda 20, 40 ve 60 °C artışlardaki uzamalar var. ${sorT} °C artıştaki uzamayı tahmin edeceğiz.`,
          "💡 Hatırlayalım: Bir katı çubuğun uzaması, sıcaklık artışı büyüdükçe artar. Tabloda bu artış düzenli ilerliyor.",
          `✏️ Tabloya bakalım: 20 °C'ta ${d20} mm, 40 °C'ta ${d20 * 2} mm, 60 °C'ta ${d20 * 3} mm. Yani her 20 °C için ${d20} mm uzama var.`,
          `✏️ ${sorT} °C içinde kaç tane 20 °C var? ${sorT} ÷ 20 = ${sorT / 20}.`,
          `✏️ Toplam uzama: ${sorT / 20} × ${d20} = ${dogruD} mm.`,
          `✅ Sonuç: Çubuk ${dogruD} mm uzar.`,
          `🔁 Kontrol edelim: 60 °C'ta ${d20 * 3} mm idi; ${sorT} °C daha büyük olduğu için uzama da ondan büyük olmalı. ${dogruD} > ${d20 * 3}, tutarlı.`],
        kural: "Aynı çubukta sıcaklık artışı kaç katına çıkarsa uzama da yaklaşık o kadar katına çıkar.",
        dogruNeden: `Her 20 °C için ${d20} mm uzadığından ${sorT / 20} × ${d20} = ${dogruD} mm bulunur.` });
    },
    Q("fgen.ayirt", "uygulama", 2, "Özdeş üç cam balonun birine hava, birine su, birine de su ile birlikte küçük demir bilyeler konuyor; her birinin ağzına aynı ince boru takılıyor. Hepsi aynı sıcaklık artışına uğratılırsa hacim artışları için hangi sıralama <b>en doğrudur</b>?<br><i>(Balonların camının genleşmesini önemsemeyelim.)</i>", "Hava > su > su ve demir bilyeler",
      [["Su ve demir bilyeler > su > hava", "kavrama", "Sıralamayı ters yaptın. Katılar en az, gazlar en çok genleşir."], ["Hepsinin hacmi eşit artar.", "kavrama", "Aynı sıcaklık artışında gaz, sıvı ve katı aynı miktarda genleşmez."], ["Su > hava > su ve demir bilyeler", "bilgi", "Gazlar sıvılardan daha çok genleşir; hava suyun önünde olmalı."]],
      "Aynı sıcaklık artışında en çok genleşen hâl hangisidir? Demir bilyeler, balonun bir kısmını neyle doldurmuş oluyor?",
      ["🔎 Soruyu anlayalım: Üç balonda aynı hacimde farklı maddeler var: yalnızca hava, yalnızca su ve su ile demir (sıvı + katı). Hepsi eşit ısıtılıyor.",
       "💡 Hatırlayalım: Aynı sıcaklık artışında genel olarak gazlar en çok, sıvılar daha az, katılar en az genleşir.",
       "✏️ Hava gazdır; en çok genleşen odur.",
       "✏️ İkinci balondaki her yer sudur. Üçüncü balonda suyun bir kısmının yerini demir almıştır; demir sudan daha az genleşir. Bu yüzden üçüncünün toplam genleşmesi ikinciden azdır.",
       "✅ Sonuç: Hava > su > su ve demir bilyeler.",
       "🔁 Kontrol edelim: “Gaz en çok, katı en az” kuralına göre içinde katı olan balon en sonda olmalı. Sıralamamız bu kurala uyuyor."],
      { kural: "Aynı sıcaklık artışında: gaz > sıvı > katı genleşir.", dogruNeden: "Gaz en çok genleşir; katı eklenen balonda toplam genleşme, yalnız su olan balondan azdır." }),
    Q("fgen.ayirt", "baglanti", 3, "Aynı büyüklükteki iki özdeş balondan biri oksijen, diğeri karbondioksit gazıyla aynı miktarda şişiriliyor. Balonlar aynı sıcaklıktan aynı sıcaklığa kadar ısıtılınca ikisi de hemen hemen <b>aynı miktarda</b> büyüyor. Bu gözlem neyi gösterir?", "Gazlar için genleşme ayırt edici bir özellik değildir.",
      [["Gazlar ısıtılınca genleşmez.", "dikkat", "Balonların ikisi de büyümüştür; gazlar genleşmiştir."], ["Genleşme bütün maddeler için ayırt edicidir.", "kavrama", "Farklı gazlar aynı miktarda genleştiğine göre genleşmeye bakarak bu iki gazı ayırt edemeyiz."], ["Oksijen ile karbondioksit aynı maddedir.", "bilgi", "Bunlar farklı maddelerdir; yalnızca genleşmeleri birbirine çok yakındır."]],
      "Genleşmeye bakarak oksijeni karbondioksitten ayırt edebilir miyiz?",
      ["🔎 Soruyu anlayalım: İki farklı gaz aynı koşulda ısıtılıyor ve aynı miktarda genleşiyor.",
       "💡 Hatırlayalım: Bir özellik ayırt ediciyse, farklı maddelerde farklı çıkar ve maddeyi tanımamıza yarar.",
       "✏️ Oksijen ve karbondioksit farklı gazlardır ama aynı ısıtmada eşit genleştiler.",
       "✏️ Demek ki genleşme miktarına bakarak bu iki gazı birbirinden ayıramayız.",
       "✅ Sonuç: Gazlar için genleşme ayırt edici bir özellik değildir.",
       "🔁 Kontrol edelim: Katılarda ve sıvılarda durum farklıdır; aynı boydaki alüminyum ve demir çubuk farklı uzar. Bu yüzden genleşme katı ve sıvılar için ayırt edicidir."],
      { kural: "Genleşme katı ve sıvılar için ayırt edicidir; gazlar için değildir.", dogruNeden: "Farklı gazlar aynı koşulda hemen hemen eşit genleştiği için genleşme onları ayırt etmeye yaramaz." }),
    Q("fgen.ayirt", "transfer", 3, "Bakır ve demir şeritler boylu boyunca perçinlenerek tek bir düz şerit (bimetal) yapılıyor. Aynı sıcaklık artışında bakır demirden daha çok genleşir. Şerit ısıtılırsa ne olur?", "Şerit, bakır dış tarafta kalacak biçimde bükülür.",
      [["Şerit, demir dış tarafta kalacak biçimde bükülür.", "kavrama", "Dış taraf daha çok uzayan taraftır; o taraf bakırdır."], ["Şerit düz kalır, yalnızca uzar.", "kavrama", "İki metal farklı uzadığı ve birbirine bağlı olduğu için şerit düz kalamaz."], ["Şerit kısalır.", "bilgi", "Isıtılan metaller büzülmez, genleşir."]],
      "Bir yay çizdiğinde dış kenar mı daha uzun olur, iç kenar mı?",
      ["🔎 Soruyu anlayalım: Birbirine sıkıca bağlı iki farklı metal aynı miktarda ısıtılıyor. Şeridin şeklini soruyoruz.",
       "💡 Hatırlayalım: Farklı katılar aynı sıcaklık artışında farklı miktarlarda uzar. Burada bakır, demirden daha çok uzar.",
       "✏️ Bakır daha çok uzamak ister ama demire bağlıdır. İki şerit ayrılamadığı için şerit eğilmek zorunda kalır.",
       "✏️ Eğilen bir şeritte dış kenar iç kenardan uzundur. Uzun olan bakır olduğuna göre bakır dışa gelir.",
       "✅ Sonuç: Şerit, bakır dış tarafta kalacak şekilde bükülür.",
       "🔁 Kontrol edelim: Bu düzenek bazı ütülerde ve ısıtıcılarda sıcaklık artınca devreyi açıp kapayan anahtar olarak kullanılır."],
      { kural: "Bimetal şerit ısınınca daha çok genleşen metal dışta kalacak şekilde bükülür.", dogruNeden: "Bükülen şeritte dış kenar uzun olur; daha çok uzayan metal bakır olduğu için dışta kalır." }),
  );

  SORU_EKLE("fgen.gunluk",
    Q("fgen.gunluk", "transfer", 2, "Gazlı içecek ve meyve suyu şişeleri fabrikada ağzına kadar doldurulmaz; üstte bir miktar boşluk bırakılır. Bunun temel nedeni nedir?", "Sıcakta genleşen sıvının şişeyi zorlayıp patlatmasını önlemek",
      [["Şişeyi daha hafif yapıp taşımayı kolaylaştırmak", "strateji", "Küçük boşluk taşımayı anlamlı ölçüde kolaylaştırmaz; asıl amaç genleşmeye yer bırakmaktır."], ["Soğukta sıvının genleşmesine yer bırakmak", "kavrama", "Sıvılar soğukta genleşmez, büzülür. Genleşme sıcaklık artınca olur."], ["Sıvının kütlesinin artmasını önlemek", "kavrama", "Sıcaklık değişince sıvının kütlesi değişmez; değişen hacmidir."]],
      "Yaz günü sıcak bir arabada kalan şişedeki sıvıya ne olur?",
      ["🔎 Soruyu anlayalım: Şişelerin üst kısmında neden boşluk bırakıldığını arıyoruz.",
       "💡 Hatırlayalım: Sıvılar ısı alınca genleşir; hacimleri artar.",
       "✏️ Şişe yazın sıcak bir yerde kalırsa içindeki sıvı genleşir ve daha çok yer kaplamak ister.",
       "✏️ Şişe ağzına kadar dolu olsaydı genleşen sıvı şişeyi ya da kapağı zorlardı; şişe çatlayabilir, kapak fırlayabilirdi.",
       "✅ Sonuç: Boşluk, sıcakta genleşen sıvıya yer bırakmak içindir.",
       "🔁 Kontrol edelim: Köprülerdeki derz boşlukları ve raylardaki aralıklar da aynı fikre dayanır: Genleşmeye yer bırakmak."],
      { kural: "Genleşme hesaba katılmazsa kaplar, yollar ve borular zarar görebilir.", dogruNeden: "Üstteki boşluk, ısınan sıvının genleşebileceği yeri sağlar ve şişeyi korur." }),
    Q("fgen.gunluk", "uygulama", 2, "Eski zamanlarda demirciler tahta tekerleğin çevresine geçirecekleri demir çemberi önce ateşte kızdırır, tekerleğe geçirdikten sonra üzerine su dökerdi. Bu yöntemin amacı nedir?", "Isınıp genleşen çember kolayca geçer, soğuyunca büzülüp tekerleği sıkıca sarar.",
      [["Isıtılan çember büzülür ve tekerleğe sıkıca oturur.", "kavrama", "Isıtılan çember büzülmez, genleşir. Büzülme, su dökülüp soğutulunca olur."], ["Su, çemberin paslanmasını önlemek için dökülür.", "strateji", "Su tam tersine paslanmayı kolaylaştırır; burada amaç çemberi hızla soğutup büzmektir."], ["Ateş, tahtanın genleşip çemberi kırmasını sağlar.", "dikkat", "Ateşte ısıtılan tahta değil, demir çemberdir."]],
      "Çember ısınınca, sonra soğuyunca boyu nasıl değişir?",
      ["🔎 Soruyu anlayalım: Demir çember önce ısıtılıyor, tekerleğe geçiriliyor, sonra soğutuluyor. Amaç nedir?",
       "💡 Hatırlayalım: Isı alan katı genleşir, ısı veren katı büzülür.",
       "✏️ Kızdırılan çember genleşir; iç çapı büyür ve tekerleğe kolayca geçer.",
       "✏️ Üzerine su dökülünce çember ısı verir ve büzülür; tekerleği sıkıca sarar.",
       "✅ Sonuç: Genleşen çember kolay geçer, büzülen çember sıkı oturur.",
       "🔁 Kontrol edelim: Sıkışan metal kavanoz kapağını sıcak suyla açmak da aynı fikrin tersidir: Isınıp genleşen kapak gevşer."],
      { kural: "Isıtıp genleştirme ve soğutup büzme, parçaları sıkıca birleştirmek için kullanılır.", dogruNeden: "Sıcak çember genleştiği için kolayca geçer; soğuyunca büzülüp tekerleğe sıkıca oturur." }),
    Q("fgen.gunluk", "baglanti", 3, "Sıcak hava balonunda brülör, balonun içindeki havayı ısıtır ve balon yükselir. Bu olayın açıklaması hangisidir?", "Isınan hava genleşir; aynı kütle daha büyük hacim kaplayınca yoğunluğu azalır ve dışarıdaki soğuk havanın üstüne çıkar.",
      [["Isınan havanın kütlesi azalır, bu yüzden balon hafifler.", "kavrama", "Isınan havanın kütlesi değişmez; hacmi artar, böylece yoğunluğu azalır."], ["Isınan hava büzülür ve balonu yukarı çeker.", "kavrama", "Isı alan hava büzülmez, genleşir."], ["Brülörün alevi balonu yukarı doğru iter.", "strateji", "Balonu yükselten alevin itmesi değil, içerideki havanın dışarıdakinden daha az yoğun olmasıdır."]],
      "Genleşme ile yoğunluk arasındaki ilişkiyi düşün: kütle aynı, hacim artarsa?",
      ["🔎 Soruyu anlayalım: Balonun içindeki hava ısıtılınca balon yükseliyor. Neden olduğunu iki konuyu birleştirerek açıklayacağız.",
       "💡 Hatırlayalım: Isı alan gaz genleşir. Yoğunluk = kütle ÷ hacim; kütle aynı kalıp hacim artarsa yoğunluk azalır.",
       "✏️ Brülör havayı ısıtır; hava genleşir ve bir kısmı balonun alt ağzından dışarı taşar. Balonda kalan hava, aynı hacimdeki soğuk havadan daha hafiftir.",
       "✏️ Yoğunluğu az olan madde, yoğunluğu fazla olanın üstüne çıkar (yağın suyun üstünde kalması gibi).",
       "✅ Sonuç: Isınan havanın yoğunluğu azalır, balon soğuk havanın içinde yükselir.",
       "🔁 Kontrol edelim: Brülör kapatılınca içerideki hava soğur, büzülür, yoğunluğu artar ve balon yavaşça alçalır."],
      { kural: "Isınan gazın yoğunluğu azalır; sıcak hava yükselir.", dogruNeden: "Genleşen sıcak havanın yoğunluğu dışarıdaki soğuk havadan küçük olduğu için balon yükselir." }),
  );
})();
