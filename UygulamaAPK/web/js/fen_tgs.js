/* Fen Bilimleri — Türkiye Geneli Sınav (TGS) / deneme tarzı ek sorular (özgün). */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, Q, G } = OGR;

  /* ============================ YARDIMCI GÖRSELLER ============================ */

  /* Çizgi grafiği. seriler: [{ad, noktalar:[[x, y], ...], sinif}] — ymin eksi olabilir (sıcaklık). */
  function cizgi(seriler, { xmax, ymin = 0, ymax, xadim, yadim, xad, yad }) {
    const W = 560, H = 270, sol = 60, alt = 42, ust = 26, sag = 30;
    const xk = t => sol + (W - sol - sag) * t / xmax, yk = v => ust + (H - ust - alt) * (1 - (v - ymin) / (ymax - ymin));
    let ic = "";
    for (let v = ymin; v <= ymax + 1e-9; v += yadim) ic += `<line class="g-ince" x1="${sol}" x2="${W - sag}" y1="${yk(v)}" y2="${yk(v)}"/>` + G.yazi(sol - 6, yk(v) + 4, od(v), { a: "end", k: 1 });
    for (let t = 0; t <= xmax + 1e-9; t += xadim) ic += `<line class="g-ince" x1="${xk(t)}" x2="${xk(t)}" y1="${ust}" y2="${H - alt}"/>` + G.yazi(xk(t), H - alt + 18, od(t), { k: 1 });
    const y0 = yk(Math.max(ymin, 0));
    ic += `<line class="g-cizgi" x1="${sol}" y1="${y0}" x2="${W - sag + 6}" y2="${y0}" stroke-width="2"/><line class="g-cizgi" x1="${sol}" y1="${H - alt}" x2="${sol}" y2="${ust - 8}" stroke-width="2"/>`;
    ic += G.yazi(W - sag, H - 4, xad, { a: "end", k: 1 }) + G.yazi(sol + 6, ust - 12, yad, { a: "start", k: 1 });
    seriler.forEach(s => {
      ic += `<polyline class="${s.sinif || "g-cizgi"}" points="${s.noktalar.map(([t, v]) => `${xk(t).toFixed(1)},${yk(v).toFixed(1)}`).join(" ")}" fill="none" stroke-width="3"/>`;
      const [tl, vl] = s.noktalar[s.noktalar.length - 1];
      if (s.ad) ic += G.yazi(xk(tl) + 4, yk(vl) - 8, s.ad, { b: 1, a: "end" });
    });
    return G.svg(W, H, ic, "çizgi grafiği");
  }

  /* Güneş lekesinin günlere göre konumu (teleskop gözlemi) */
  function lekeGozlem() {
    let ic = "";
    [[1, -26], [4, 0], [7, 26]].forEach(([gun, dx], i) => {
      const cx = 95 + i * 185;
      ic += `<circle class="g-b g-cizgi" cx="${cx}" cy="80" r="58" stroke-width="2"/><circle class="g-cizgi" cx="${cx + dx}" cy="74" r="7" fill="#444"/>` + G.yazi(cx, 165, gun + ". gün", { b: 1 });
    });
    return G.svg(560, 180, ic, "Güneş lekesinin 1., 4. ve 7. günlerdeki konumu");
  }

  /* =============================== 1. ÜNİTE: GÜNEŞ SİSTEMİ VE TUTULMALAR =============================== */

  SORU_EKLE("fgun.gunes",
    Q("fgun.gunes", "baglanti", 3, "Bir gözlemevinde, önüne özel güneş filtresi takılmış bir teleskopla Güneş yüzeyindeki koyu bir leke birkaç gün boyunca izlenmiş ve şekildeki gözlemler kaydedilmiştir.<br>Bu gözlemlere göre:<br>I. Güneş kendi ekseni etrafında döner.<br>II. Güneş lekeleri, Güneş'in çevresindeki bölgelerden daha sıcaktır.<br>III. Güneş, Dünya'nın çevresinde dolanır.<br><b>yargılarından hangilerine ulaşılabilir?</b>", "Yalnız I",
      [["I ve II", "kavrama", "Lekeler koyu göründüğü için çevrelerinden daha sıcak değil, daha soğuktur. Üstelik bu gözlem sıcaklık hakkında bilgi vermez."], ["I ve III", "kavrama", "Lekenin yer değiştirmesi Güneş'in kendi çevresinde döndüğünü gösterir. Güneş, Dünya'nın çevresinde dolanmaz; Dünya, Güneş'in çevresinde dolanır."], ["I, II ve III", "bilgi", "II ve III yanlıştır: lekeler çevresinden soğuk olduğu için koyu görünür ve Güneş, Dünya'nın çevresinde dolanmaz."]],
      "Lekenin günler içinde Güneş yüzeyinde kaymasının ne anlama geldiğini düşün. Gözlem sana sıcaklık hakkında bir şey söylüyor mu?",
      ["🔎 Soruyu anlayalım: Teleskop gözleminde bir leke 1. günden 7. güne doğru Güneş yüzeyinde soldan sağa kaymış. Hangi yargılara bu gözlemle ulaşılabileceği soruluyor.",
       "💡 Hatırlayalım: Bir gözlemden ancak o gözlemin gösterdiği sonuç çıkarılır. Güneş de Dünya gibi kendi ekseni etrafında döner.",
       "✏️ I: Leke Güneş'in yüzeyindedir; lekenin düzenli olarak yer değiştirmesi Güneş'in kendi ekseni etrafında döndüğünü gösterir. Ulaşılabilir ✔",
       "✏️ II: Lekeler çevresinden daha soğuk oldukları için koyu görünür. Ayrıca konum gözlemi sıcaklığı ölçmez. Ulaşılamaz ✘",
       "✏️ III: Güneş sistemin merkezindedir; Dünya, Güneş'in çevresinde dolanır. Bu yargı hem yanlış hem de gözlemle ilgisizdir ✘",
       "✅ Sonuç: Bu gözlemlerle yalnızca I. yargıya ulaşılabilir.",
       "🔁 Kontrol edelim: Öncüllü sorularda her yargıyı ayrı ayrı ✔/✘ ile işaretle. Ayrıca Güneş'e asla filtresiz teleskopla ya da çıplak gözle bakılmadığını unutma!"],
      { gorsel: lekeGozlem(), kural: "Güneş lekelerinin yer değiştirmesi Güneş'in kendi ekseni etrafında döndüğünü gösterir; lekeler çevresinden soğuk olduğu için koyu görünür.", dogruNeden: "Lekenin yüzeyde düzenli kayması Güneş'in kendi ekseni etrafında döndüğünü gösterir; diğer iki yargı yanlıştır ve bu gözlemden çıkarılamaz." }),
    Q("fgun.gunes", "transfer", 3, "Tabloda Güneş'ten çıkan ışığın bazı gezegenlere yaklaşık ne kadar sürede ulaştığı verilmiştir.<br>Bir gün Güneş yüzeyinde kısa süren güçlü bir parlama oluyor.<br><b>Buna göre aşağıdakilerden hangisi söylenebilir?</b>", "Parlamanın ışığı Mars'a, Dünya'ya ulaştıktan yaklaşık 4 dakika sonra ulaşır.",
      [["Parlamanın ışığı bütün gezegenlere aynı anda ulaşır.", "kavrama", "Işık çok hızlıdır ama yine de yol alması zaman ister. Tabloda süreler farklı; uzak gezegene ışık daha geç ulaşır."], ["Jüpiter'deki bir gözlemci parlamayı Dünya'daki gözlemciden önce görür.", "dikkat", "Tabloya göre ışık Jüpiter'e yaklaşık 43 dakikada, Dünya'ya yaklaşık 8 dakikada ulaşır. Jüpiter'deki gözlemci parlamayı daha sonra görür."], ["Güneş'e uzaklık arttıkça ışığın ulaşma süresi kısalır.", "dikkat", "Tablo tersini gösteriyor: Merkür'den Jüpiter'e doğru Güneş'e uzaklık arttıkça süre de uzuyor."]],
      "Mars ve Dünya için verilen iki süreyi karşılaştır; aradaki fark kaç dakika?",
      ["🔎 Soruyu anlayalım: Tablodaki ulaşma sürelerine bakarak parlamanın ışığıyla ilgili doğru yargıyı bulacağız.",
       "💡 Hatırlayalım: Güneş, ışık ve ısı enerjisini kendisi üreten bir yıldızdır. Işık çok hızlı yol alır ama uzaklık arttıkça yolculuk süresi de artar.",
       "✏️ Tabloya göre ışık Dünya'ya yaklaşık 8,3 dakikada, Mars'a yaklaşık 12,7 dakikada ulaşıyor.",
       "✏️ Aradaki fark: 12,7 − 8,3 = 4,4 dakika, yani yaklaşık 4 dakika. Yani Mars'a ışık Dünya'dan yaklaşık 4 dakika sonra varır.",
       "✏️ Diğer seçenekler: süreler eşit değil (aynı anda ✘), Jüpiter'e 43 dakikada ulaşıyor (önce ✘), uzaklık artınca süre artıyor (kısalır ✘).",
       "✅ Sonuç: Parlamanın ışığı Mars'a, Dünya'ya ulaştıktan yaklaşık 4 dakika sonra ulaşır.",
       "🔁 Kontrol edelim: Gezegenleri Güneş'e yakınlık sırasıyla diz (Merkür, Dünya, Mars, Jüpiter); süreler de aynı sırayla artıyor. Tutarlı!"],
      { gorsel: G.tablo(["Gezegen", "Işığın ulaşma süresi (yaklaşık)"], [["Merkür", "3,2 dakika"], ["Dünya", "8,3 dakika"], ["Mars", "12,7 dakika"], ["Jüpiter", "43,3 dakika"]]), kural: "Güneş ışığı Dünya'ya yaklaşık 8 dakikada ulaşır; Güneş'e uzaklık arttıkça ışığın ulaşma süresi artar.", dogruNeden: "Işık Mars'a yaklaşık 12,7, Dünya'ya yaklaşık 8,3 dakikada ulaşır; aradaki fark yaklaşık 4 dakikadır." }),
  );

  SORU_EKLE("fgun.gezegen",
    Q("fgun.gezegen", "baglanti", 3, "Tabloda Güneş sistemindeki dört gezegen K, L, M ve N harfleriyle gösterilmiştir.<br>Tablodaki bilgilere göre:<br>I. L ve N karasal (iç) gezegenlerdir.<br>II. Tablodaki gezegenlerden Güneş'e en uzak olanı K'dir.<br>III. Asteroit kuşağı, L ile M'nin yörüngeleri arasında yer alır.<br><b>yargılarından hangileri doğrudur?</b>", "I, II ve III",
      [["I ve II", "kavrama", "III de doğru: L (yılı 1,88 Dünya yılı) Mars'tır, M (yılı 11,9 Dünya yılı) Jüpiter'dir. Asteroit kuşağı Mars ile Jüpiter arasındadır."], ["I ve III", "dikkat", "II de doğru: Güneş'e uzaklık arttıkça bir yıl uzar. Bir yılı en uzun olan (84 Dünya yılı) K, Güneş'e en uzak olandır."], ["Yalnız II", "kavrama", "Halkası olmayan, yılı kısa gezegenler (L ve N) karasal gezegenlerdir; bu yüzden I de doğrudur. III de doğrudur."]],
      "Önce gezegenleri bir yıllarının uzunluğuna göre Güneş'e yakından uzağa sırala.",
      ["🔎 Soruyu anlayalım: Tabloda halkası olup olmadığı ve bir yılının uzunluğu verilen dört gezegen var. Üç yargıyı tek tek değerlendireceğiz.",
       "💡 Hatırlayalım: Gezegen Güneş'ten uzaklaştıkça Güneş çevresindeki turu (bir yılı) uzar. Karasal gezegenlerin halkası yoktur; dış (gazsı) gezegenlerin hepsinin halkası vardır.",
       "✏️ Sıralama (yıl kısadan uzuna): N (0,24) → L (1,88) → M (11,9) → K (84). Bu sırayla Merkür, Mars, Jüpiter ve Uranüs'e karşılık gelir.",
       "✏️ I: L ve N'nin halkası yok, yılları kısa → karasal ✔. II: Yılı en uzun olan K, Güneş'e en uzaktır ✔.",
       "✏️ III: Asteroit kuşağı Mars ile Jüpiter arasındadır; yani L ile M arasında ✔.",
       "✅ Sonuç: Üç yargı da doğrudur: I, II ve III.",
       "🔁 Kontrol edelim: Gezegen adlarını bilmesen bile “yıl uzunluğu = Güneş'e uzaklık sırası” ipucuyla sıralamayı yapabilirsin."],
      { gorsel: G.tablo(["Gezegen", "Halkası", "Bir yılı (Dünya yılı)"], [["K", "var", "84"], ["L", "yok", "1,88"], ["M", "var", "11,9"], ["N", "yok", "0,24"]]), kural: "Gezegen Güneş'ten uzaklaştıkça bir yılı uzar; asteroit kuşağı Mars ile Jüpiter arasındadır.", dogruNeden: "Yıl uzunluklarına göre sıra N–L–M–K'dir (Merkür, Mars, Jüpiter, Uranüs); bu sıralamaya göre üç yargı da doğrudur." }),
    Q("fgun.gezegen", "aciklama", 2, "Gezegenlerle ilgili sınıfta tartışan üç öğrenci şunları söylüyor:<br><b>Ece:</b> Gezegenler Güneş'ten uzaklaştıkça büyür.<br><b>Kaan:</b> Dış gezegenlerin hepsinin çevresinde halka bulunur.<br><b>Mert:</b> Gezegenler ışık üretmez; Güneş'ten gelen ışığı yansıttıkları için görünürler.<br><b>Hangi öğrencilerin söyledikleri doğrudur?</b>", "Kaan ve Mert",
      [["Yalnız Mert", "bilgi", "Kaan da haklı: Jüpiter, Satürn, Uranüs ve Neptün'ün hepsinin halkası vardır; Satürn'ünki yalnızca en belirgin olanıdır."], ["Ece ve Kaan", "kavrama", "Ece yanılıyor: En büyük gezegen Jüpiter'dir ama Güneş'e en uzak gezegen değildir. Mars da Dünya'dan uzak olduğu hâlde ondan küçüktür."], ["Ece, Kaan ve Mert", "kavrama", "Ece'nin söylediği yanlıştır: Gezegenlerin büyüklüğü Güneş'e uzaklıkla düzenli olarak artmaz (Jüpiter en büyüktür, Mars Dünya'dan küçüktür)."]],
      "Her cümleyi bir karşı örnekle sına: Güneş'ten uzaklaştıkça hep büyüyor mu?",
      ["🔎 Soruyu anlayalım: Üç öğrencinin gezegenlerle ilgili cümlelerinden hangilerinin doğru olduğu soruluyor.",
       "💡 Hatırlayalım: Büyüklük sırası Jüpiter > Satürn > Uranüs > Neptün > Dünya > Venüs > Mars > Merkür'dür. Dış gezegenlerin hepsinin halkası vardır. Gezegenler ışık kaynağı değildir.",
       "✏️ Ece: Mars, Dünya'dan Güneş'e daha uzaktır ama Dünya'dan küçüktür; Neptün de Jüpiter'den küçüktür. Bir karşı örnek yeter → yanlış ✘",
       "✏️ Kaan: Jüpiter, Satürn, Uranüs ve Neptün'ün hepsinin halkası vardır → doğru ✔",
       "✏️ Mert: Gezegenler Güneş ışığını yansıtır; kendileri ışık üretmez → doğru ✔",
       "✅ Sonuç: Kaan ve Mert'in söyledikleri doğrudur.",
       "🔁 Kontrol edelim: “Hep, hepsi, her zaman” içeren genellemeleri tek bir karşı örnekle çürütebilirsin; Ece'nin cümlesinde bunu yaptık."],
      { kural: "Gezegenlerin büyüklüğü Güneş'e uzaklıkla düzenli artmaz; dış gezegenlerin hepsinin halkası vardır; gezegenler ışığı yansıtır.", dogruNeden: "Dış gezegenlerin hepsinin halkası vardır ve gezegenler Güneş ışığını yansıtır; büyüklük ise uzaklıkla düzenli artmaz." }),
  );

  SORU_EKLE("fgun.diger",
    Q("fgun.diger", "aciklama", 2, "Bir doğa tarihi müzesinde sergilenen koyu renkli, metalik bir taşın yanında şu bilgi kartı bulunuyor:<br><i>“Bu taş, gece gökyüzünde parlak bir ışık çizgisi oluşturduktan sonra bir tarlaya düşmüş ve çiftçiler tarafından bulunmuştur.”</i><br>Bu taşla ilgili:<br>I. Atmosferde tamamen yanmadan yeryüzüne ulaşmıştır.<br>II. Bir meteorittir.<br>III. Uzaydayken bir yıldızın parçasıydı.<br><b>ifadelerinden hangileri doğrudur?</b>", "I ve II",
      [["Yalnız I", "bilgi", "II de doğru: Atmosferde tamamen yanmadan yere ulaşan göktaşı parçasına meteorit denir."], ["I ve III", "kavrama", "Göktaşları yıldız parçası değildir; asteroit ya da kuyruklu yıldızlardan kopan kaya ve metal parçalarıdır. “Yıldız kayması” adı yanıltıcıdır."], ["I, II ve III", "kavrama", "III yanlıştır: Gökyüzündeki ışık çizgisi bir yıldızın kayması değil, göktaşının atmosferde sürtünmeyle ısınıp parlamasıdır."]],
      "Gökyüzünde parlayıp sonra yere düşen bir taşa ne ad verildiğini hatırla. “Yıldız kayması” gerçekten bir yıldız mıdır?",
      ["🔎 Soruyu anlayalım: Gökyüzünde ışık çizgisi oluşturup tarlaya düşen bir taşla ilgili üç ifade değerlendirilecek.",
       "💡 Hatırlayalım: Uzaydaki küçük kaya-metal parçaları atmosfere girince sürtünmeyle ısınıp parlar (halk arasında “yıldız kayması”). Atmosferde tamamen yanmadan yere düşen parçaya meteorit denir.",
       "✏️ I: Taş tarlada bulunduğuna göre atmosferde tamamen yanmamıştır ✔",
       "✏️ II: Yere ulaşan göktaşı parçası meteorittir ✔",
       "✏️ III: Göktaşları asteroit ya da kuyruklu yıldız parçalarıdır; yıldızlar ise dev gaz kütleleridir, bir yıldızdan taş kopup Dünya'ya düşmez ✘",
       "✅ Sonuç: Doğru ifadeler I ve II'dir.",
       "🔁 Kontrol edelim: Gördüğümüz ışık çizgisinin “yıldız kayması” diye anılması bir halk deyişidir; bilimsel adı göktaşıdır (meteor). Adlara aldanma!"],
      { kural: "Atmosferde parlayan göktaşı “yıldız kayması” olarak görülür; tamamen yanmadan yere ulaşan parçaya meteorit denir.", dogruNeden: "Tarlada bulunan taş atmosferde tamamen yanmamış bir göktaşı parçasıdır, yani meteorittir; yıldız parçası değildir." }),
    Q("fgun.diger", "transfer", 3, "Bilim insanlarının kabul ettiği tanıma göre bir gök cisminin <b>gezegen</b> sayılabilmesi için şu üç koşulu sağlaması gerekir:<br>1) Güneş'in çevresinde dolanmalıdır.<br>2) Kendi çekim kuvvetiyle yaklaşık küre biçimini alacak kadar büyük olmalıdır.<br>3) Yörüngesinin çevresini, yakınındaki benzer büyüklükteki gök cisimlerinden temizlemiş olmalıdır.<br>Plüton, Güneş'in çevresinde dolanan ve yaklaşık küre biçimli bir gök cismidir. Ancak yörüngesi, benzer büyüklükte pek çok buzlu gök cisminin bulunduğu bir kuşağın içindedir.<br><b>Buna göre Plüton'un gezegen değil cüce gezegen sayılmasının nedeni aşağıdakilerden hangisidir?</b>", "Üçüncü koşulu sağlamaması",
      [["Birinci koşulu sağlamaması", "dikkat", "Metinde Plüton'un Güneş'in çevresinde dolandığı açıkça yazıyor; birinci koşulu sağlıyor."], ["İkinci koşulu sağlamaması", "dikkat", "Metinde Plüton'un yaklaşık küre biçimli olduğu söyleniyor; yani ikinci koşulu da sağlıyor."], ["Kendi ışığını üretmesi", "bilgi", "Plüton ışık üretmez; kendi ışığını üreten gök cisimleri yıldızlardır. Ayrıca bu durum koşullar arasında yok."]],
      "Plüton için metinde verilen her bilgiyi koşullarla eşleştir; eşleşmeyen koşul hangisi?",
      ["🔎 Soruyu anlayalım: Gezegen olmanın üç koşulu verilmiş. Plüton'un hangi koşulu sağlamadığı için cüce gezegen sayıldığını bulacağız.",
       "💡 Hatırlayalım: Plüton eskiden dokuzuncu gezegen sayılıyordu; bugün cüce gezegen olarak sınıflandırılıyor.",
       "✏️ 1. koşul: “Güneş'in çevresinde dolanan” → sağlıyor ✔",
       "✏️ 2. koşul: “yaklaşık küre biçimli” → sağlıyor ✔",
       "✏️ 3. koşul: Yörüngesi benzer büyüklükte pek çok buzlu cismin bulunduğu bir kuşakta → yörüngesini temizlememiş ✘",
       "✅ Sonuç: Plüton üçüncü koşulu sağlamadığı için cüce gezegen sayılır.",
       "🔁 Kontrol edelim: Paragraf sorularında cevap metindedir; “Ancak” sözcüğünden sonra gelen bilgi çoğu zaman sonucun anahtarıdır."],
      { kural: "Plüton, Güneş'in çevresinde dolanan küre biçimli bir cüce gezegendir; yörüngesini benzer cisimlerden temizlemediği için gezegen sayılmaz.", dogruNeden: "Plüton ilk iki koşulu sağlar ama yörüngesi benzer büyüklükte cisimlerle dolu olduğu için üçüncü koşulu sağlamaz." }),
  );
})();
