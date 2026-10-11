/* Fen Bilimleri — Türkiye Geneli Sınav (TGS) / deneme tarzı ek sorular (özgün). */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, Q, G } = OGR;

  /* ============================ YARDIMCI GÖRSELLER ============================ */

  /* Çizgi grafiği. seriler: [{ad, noktalar:[[x, y], ...], sinif}] — ymin eksi olabilir (sıcaklık). */
  function cizgi(seriler, { xmax, ymin = 0, ymax, xadim, yadim, xad, yad, x0 = 0 }) {
    const W = 560, H = 270, sol = 60, alt = 42, ust = 26, sag = 30;
    const xk = t => sol + (W - sol - sag) * t / xmax, yk = v => ust + (H - ust - alt) * (1 - (v - ymin) / (ymax - ymin));
    let ic = "";
    for (let v = ymin; v <= ymax + 1e-9; v += yadim) ic += `<line class="g-ince" x1="${sol}" x2="${W - sag}" y1="${yk(v)}" y2="${yk(v)}"/>` + G.yazi(sol - 6, yk(v) + 4, od(v), { a: "end", k: 1 });
    for (let t = 0; t <= xmax + 1e-9; t += xadim) ic += `<line class="g-ince" x1="${xk(t)}" x2="${xk(t)}" y1="${ust}" y2="${H - alt}"/>` + G.yazi(xk(t), H - alt + 18, od(t + x0), { k: 1 });
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

  SORU_EKLE("ftut.gunes",
    Q("ftut.gunes", "aciklama", 2, "Bir yerden Güneş tutulmasının gözlenebilmesi için:<br>I. Ay'ın yeni ay evresinde olması<br>II. Gözlem yapılan yerde gündüz yaşanıyor olması<br>III. Dünya'nın, Güneş ile Ay'ın arasında bulunması<br><b>durumlarından hangileri gereklidir?</b>", "I ve II",
      [["Yalnız I", "kavrama", "Ay yeni ay evresinde olsa bile gözlem yapılan yerde gece yaşanıyorsa Güneş görünmez, tutulma da izlenemez. II de gereklidir."], ["I ve III", "kavrama", "Dünya, Güneş ile Ay'ın arasındaysa Ay tutulması olur. Güneş tutulmasında ortada olan Ay'dır."], ["I, II ve III", "bilgi", "III yanlıştır: Dünya'nın ortada olduğu dizilim Ay tutulmasının dizilimidir."]],
      "Güneş tutulmasında hangi gök cismi ortadadır? Güneş'i görebilmek için gündüz mü gece mi olmalı?",
      ["🔎 Soruyu anlayalım: Güneş tutulmasını bir yerden izleyebilmek için gerekli olan durumları seçeceğiz.",
       "💡 Hatırlayalım: Güneş tutulmasında dizilim Güneş – Ay – Dünya'dır; Ay ortadadır ve bu konum yeni ay evresidir.",
       "✏️ I: Ay, Güneş ile Dünya'nın arasında olduğunda yeni ay evresindedir → gerekli ✔",
       "✏️ II: Tutulmada Ay, Güneş'in önünü kapatır; bunu görmek için Güneş'in gökyüzünde, yani gündüz olması gerekir → gerekli ✔",
       "✏️ III: Dünya'nın ortada olması Ay tutulmasının dizilimidir → gerekli değil ✘",
       "✅ Sonuç: Gerekli olan durumlar I ve II'dir.",
       "🔁 Kontrol edelim: Kısa yol: Güneş tutulması → Ay ortada, yeni ay, gündüz. Ay tutulması → Dünya ortada, dolunay, gece."],
      { kural: "Güneş tutulması: Ay ortada, yeni ay evresi, gündüz gözlenir.", dogruNeden: "Güneş tutulmasında Ay ortadadır (yeni ay) ve Güneş'i görebilmek için gözlem yerinde gündüz olmalıdır." }),
    Q("ftut.gunes", "uygulama", 2, "Gökyüzü gözlemcisi Selin'in tuttuğu gözlem defterinden bazı kayıtlar tabloda verilmiştir.<br><b>Selin bu kayıtlardan hangisinde bir Güneş tutulması gözlemlemiş olabilir?</b>", "L",
      [["K", "kavrama", "Dolunayda Ay, Dünya'nın Güneş'e bakmayan tarafındadır; Güneş tutulması olamaz. Üstelik saat 21.30'da gecedir."], ["M", "bilgi", "İlk dördünde Güneş, Dünya ve Ay aynı doğru üzerinde değildir; tutulma olmaz."], ["N", "dikkat", "Ay yeni ay evresinde ama saat 02.00'de gecedir. Güneş gökyüzünde olmadığı için Güneş tutulması gözlenemez."]],
      "Hem Ay evresine hem de gözlem saatine birlikte bak. İki koşulu birden sağlayan kayıt hangisi?",
      ["🔎 Soruyu anlayalım: Tablodaki dört kayıttan hangisinde Güneş tutulması gözlenebileceğini bulacağız.",
       "💡 Hatırlayalım: Güneş tutulması için iki koşul gerekir: Ay yeni ay evresinde olmalı ve gözlem gündüz yapılmalı.",
       "✏️ Yeni ay evresinde olan kayıtlar: L (10.15) ve N (02.00).",
       "✏️ Bunlardan gündüz olan yalnızca L'dir; N'de saat 02.00, yani gecedir.",
       "✅ Sonuç: Selin Güneş tutulmasını L kaydında gözlemlemiş olabilir.",
       "🔁 Kontrol edelim: K (dolunay, gece) bir Ay tutulması için uygun olabilirdi ama soru Güneş tutulmasını soruyor. Soru kökündeki tutulma türünü her zaman iki kez oku."],
      { gorsel: G.tablo(["Kayıt", "Ay'ın evresi", "Gözlem saati"], [["K", "Dolunay", "21.30"], ["L", "Yeni ay", "10.15"], ["M", "İlk dördün", "13.00"], ["N", "Yeni ay", "02.00"]]), kural: "Güneş tutulması yalnızca yeni ay evresinde ve gündüz gözlenebilir.", dogruNeden: "L kaydında Ay yeni ay evresindedir ve saat 10.15'tir; Güneş tutulması için iki koşul da sağlanır." }),
  );

  SORU_EKLE("ftut.ay",
    Q("ftut.ay", "aciklama", 2, "Ay tutulmasıyla ilgili:<br>I. Dünya'nın gece yaşanan tarafındaki yerlerden izlenebilir.<br>II. Tam Güneş tutulmasından daha kısa sürer.<br>III. Ay dolunay evresindeyken gerçekleşir.<br><b>ifadelerinden hangileri doğrudur?</b>", "I ve III",
      [["Yalnız III", "bilgi", "I de doğrudur: Ay tutulmasında Ay'ın kendisi kararır; Ay'ı gökyüzünde görebilen, yani gece yaşanan her yerden izlenebilir."], ["I ve II", "kavrama", "Ay, Dünya'nın büyük gölgesinden geçtiği için Ay tutulması saatlerce sürebilir; tam Güneş tutulması ise bir yerden birkaç dakika görülür. II yanlıştır."], ["I, II ve III", "kavrama", "II yanlıştır: Ay tutulması, Güneş tutulmasından daha uzun sürer çünkü Dünya'nın gölgesi çok büyüktür."]],
      "Ay tutulmasında kimin gölgesi kime düşer? Gölge büyükse tutulma kısa mı sürer, uzun mu?",
      ["🔎 Soruyu anlayalım: Ay tutulmasıyla ilgili üç ifadeden doğru olanları seçeceğiz.",
       "💡 Hatırlayalım: Ay tutulmasında dizilim Güneş – Dünya – Ay'dır; Dünya'nın gölgesi Ay'a düşer ve bu konum dolunay evresidir.",
       "✏️ I: Kararan cisim Ay'ın kendisidir; Ay'ı gören, yani gece yaşanan her yerden izlenir ✔",
       "✏️ II: Dünya'nın gölgesi çok büyük olduğundan Ay bu gölgeden geç çıkar; Ay tutulması daha uzun sürer ✘",
       "✏️ III: Dünya ortadayken Ay'ın aydınlık yüzü tamamen Dünya'ya bakar; bu dolunaydır ✔",
       "✅ Sonuç: Doğru ifadeler I ve III'tür.",
       "🔁 Kontrol edelim: Ay tutulması → geniş alan, uzun süre, çıplak gözle izlenir. Güneş tutulması → dar alan, kısa süre, özel gözlükle izlenir."],
      { kural: "Ay tutulması dolunayda olur, gece yaşanan her yerden izlenebilir ve Güneş tutulmasından uzun sürer.", dogruNeden: "Ay tutulması dolunayda olur ve Ay'ı gören her yerden izlenebilir; Dünya'nın gölgesi büyük olduğu için kısa değil uzun sürer." }),
    Q("ftut.ay", "transfer", 3, "Tam Ay tutulmasının gerçekleştiği bir anda Dünya üzerindeki K şehrinde gece, L şehrinde ise öğle saatleridir.<br>Buna göre:<br>I. K şehrindeki gözlemci, hava açıksa tutulmayı izleyebilir.<br>II. L şehrindeki gözlemci tutulmayı izleyemez çünkü Ay o sırada L'nin gökyüzünde değildir.<br>III. Tutulma sırasında Ay, dolunay evresindedir.<br><b>yargılarından hangileri doğrudur?</b>", "I, II ve III",
      [["Yalnız I", "kavrama", "II ve III de doğrudur: Dolunaydaki Ay, Güneş'in tam karşısındadır; öğle saatlerinde yaşanan bir yerde Ay ufkun altında kalır."], ["I ve III", "kavrama", "II de doğrudur: Ay tutulmasında Ay, Dünya'nın Güneş'e bakmayan tarafındadır. Öğle saatlerinde (gündüz) yaşanan L şehrinden Ay görülemez."], ["II ve III", "dikkat", "I de doğrudur: K şehrinde gece olduğu için Ay gökyüzündedir; hava açıksa tutulma rahatça izlenir."]],
      "Ay tutulmasında Ay, Dünya'nın hangi tarafındadır: Güneş'e bakan mı, bakmayan mı?",
      ["🔎 Soruyu anlayalım: Tam Ay tutulması anında K'de gece, L'de öğle saatleri yaşanıyor. Üç yargının doğruluğunu inceleyeceğiz.",
       "💡 Hatırlayalım: Ay tutulmasında dizilim Güneş – Dünya – Ay'dır. Ay, Dünya'nın Güneş'e bakmayan (gece yaşanan) tarafının gökyüzündedir.",
       "✏️ I: K'de gece var, Ay gökyüzünde; hava açıksa tutulma izlenir ✔",
       "✏️ II: L'de öğle saatleri, yani L Güneş'e bakan taraftadır; Ay ise tam karşı taraftadır, L'nin ufkunun altında kalır ✔",
       "✏️ III: Dünya'nın ortada olduğu bu dizilim dolunay evresidir ✔",
       "✅ Sonuç: Üç yargı da doğrudur: I, II ve III.",
       "🔁 Kontrol edelim: Bir yerde aynı anda hem Güneş'i hem de tutulmadaki Ay'ı yüksekte görmek mümkün değildir; çünkü ikisi Dünya'nın zıt taraflarındadır."],
      { kural: "Ay tutulması yalnızca gece yaşanan yerlerden izlenebilir; tutulma anında Ay dolunay evresindedir.", dogruNeden: "Tutulmadaki Ay, Dünya'nın gece yaşanan tarafındadır; K'den görülür, L'den görülmez ve Ay dolunay evresindedir." }),
  );

  SORU_EKLE("ftut.model",
    Q("ftut.model", "baglanti", 3, "Karanlık bir sınıfta öğrenciler masaya bir lamba, bir basketbol topu ve bir pinpon topu yerleştiriyor. Pinpon topu basketbol topunun gölgesine girdiğinde karardığını görüyorlar.<br>Öğretmen bu modelle ilgili şu yorumları yapıyor:<br>I. Lamba ile toplar arasındaki uzaklıklar, gerçek uzaklıkların oranlarına uygun değildir.<br>II. Pinpon topunun kararması Ay tutulmasını temsil eder.<br>III. Gerçekte Güneş, Dünya'dan küçük olduğu için lamba toplardan küçük seçilmiştir.<br><b>Bu yorumlardan hangileri doğrudur?</b>", "I ve II",
      [["Yalnız II", "kavrama", "I de doğrudur: Sınıftaki bir modelde Güneş–Dünya–Ay uzaklıkları gerçek oranlarla gösterilemez; bu, modelin bir sınırlılığıdır."], ["II ve III", "bilgi", "Güneş, Dünya'dan çok büyüktür (çapı Dünya'nınkinin yaklaşık 109 katı). Lambanın küçük olması modelin sınırlılığıdır, gerçeği yansıtmaz."], ["I, II ve III", "bilgi", "III yanlıştır: Gerçekte Güneş, Dünya'dan çok daha büyüktür."]],
      "Modelde lamba, basketbol topu ve pinpon topu neyi temsil ediyor? Model her şeyi gerçekteki gibi gösterebilir mi?",
      ["🔎 Soruyu anlayalım: Lamba, büyük ve küçük topla kurulan bir tutulma modeli için öğretmenin üç yorumunu değerlendireceğiz.",
       "💡 Hatırlayalım: Modeller gerçeği basitleştirir; bazı özellikleri (büyüklük, uzaklık oranları) gerçeğe uygun gösteremez. Güneş, Dünya'dan çok büyüktür.",
       "✏️ Eşleştirme: lamba → Güneş, basketbol topu → Dünya, pinpon topu → Ay.",
       "✏️ I: Gerçek uzaklıklar çok büyük olduğu için sınıfta aynı oranla gösterilemez ✔. II: Ay'ın Dünya'nın gölgesine girip kararması Ay tutulmasıdır ✔",
       "✏️ III: Güneş'in çapı Dünya'nınkinin yaklaşık 109 katıdır; lambanın küçük seçilmesi gerçeği değil, modelin sınırlılığını gösterir ✘",
       "✅ Sonuç: Doğru yorumlar I ve II'dir.",
       "🔁 Kontrol edelim: Bir modeli değerlendirirken “Neyi doğru gösteriyor, neyi gösteremiyor?” diye iki soru sor."],
      { kural: "Tutulma modellerinde lamba Güneş'i, büyük top Dünya'yı, küçük top Ay'ı temsil eder; modeller büyüklük ve uzaklık oranlarını gerçeğe uygun gösteremez.", dogruNeden: "Model gerçek uzaklık oranlarını gösteremez ve küçük topun büyük topun gölgesinde kararması Ay tutulmasıdır; Güneş ise Dünya'dan küçük değildir." }),
    Q("ftut.model", "transfer", 2, "Bir Güneş tutulmasını izlemeye hazırlanan dört öğrencinin planı şöyledir:<br><b>Aras:</b> Koyu camlı güneş gözlüğümü takıp Güneş'e bakacağım.<br><b>Bade:</b> Dürbünün önüne siyah poşet gerip Güneş'e bakacağım.<br><b>Cem:</b> Tutulmanın en güzel anında Güneş'e kısa bir süre çıplak gözle bakacağım.<br><b>Deniz:</b> Uygunluğu onaylanmış, çiziksiz bir tutulma gözlüğüyle izleyeceğim.<br><b>Hangi öğrencinin planı göz sağlığı açısından güvenlidir?</b>", "Deniz",
      [["Aras", "bilgi", "Güneş gözlüğü, Güneş'in zararlı ışınlarını yeterince engellemez. Tutulmayı onunla izlemek gözde kalıcı hasar bırakabilir."], ["Bade", "kavrama", "Dürbün ışığı toplayıp yoğunlaştırır; poşet gibi rastgele malzemeler zararlı ışınları durdurmaz. Bu plan çok tehlikelidir."], ["Cem", "kavrama", "Tutulma sırasında da Güneş'in görünen kısmı gözü yakabilir. Güneş'e kısa süreliğine bile çıplak gözle bakılmaz."]],
      "Güneş tutulması sırasında Güneş'in ışınları göze zarar vermeye devam eder mi? Hangi araç bu iş için üretilmiştir?",
      ["🔎 Soruyu anlayalım: Dört öğrenciden hangisinin Güneş tutulmasını güvenli bir şekilde izleyeceği soruluyor.",
       "💡 Hatırlayalım: Güneş'e hiçbir zaman çıplak gözle, güneş gözlüğüyle ya da filtresiz dürbün/teleskopla bakılmaz. Uygun tutulma gözlüğü ya da dolaylı yöntemler (iğne deliği kamerası) kullanılır.",
       "✏️ Aras: Güneş gözlüğü yeterli koruma sağlamaz ✘. Bade: Dürbün ışığı yoğunlaştırır, poşet koruma sağlamaz ✘",
       "✏️ Cem: Kısa süreli bakış bile göze kalıcı zarar verebilir ✘",
       "✏️ Deniz: Onaylı ve çiziksiz tutulma gözlüğü zararlı ışınları süzer ✔",
       "✅ Sonuç: Güvenli plan Deniz'in planıdır.",
       "🔁 Kontrol edelim: Gözlüğün çizik ya da delik olmaması da önemlidir; hasarlı bir gözlük de koruma sağlamaz. Ay tutulması ise çıplak gözle güvenle izlenebilir."],
      { kural: "Güneş tutulması yalnızca onaylı tutulma gözlüğüyle ya da dolaylı yöntemlerle izlenir; güneş gözlüğü ve çıplak göz güvenli değildir.", dogruNeden: "Onaylı ve hasarsız tutulma gözlüğü, Güneş'in göze zarar veren ışınlarını süzerek güvenli gözlem sağlar." }),
  );

  /* =============================== 2. ÜNİTE: KUVVET VE HAREKET =============================== */

  /* Öncüllü seçenek kümeleri: doğru küme (ör. [1,3]) → "I ve III" */
  const ROMA = ["", "I", "II", "III"];
  const kumeAd = k => k.length === 1 ? "Yalnız " + ROMA[k[0]] : k.length === 2 ? ROMA[k[0]] + " ve " + ROMA[k[1]] : "I, II ve III";
  const KUMELER = [[1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]];
  /* dogruMu: [true/false ×3], aciklama: her öncül için neden doğru/yanlış olduğu */
  function onculSecenek(dogruMu, aciklama) {
    const dogru = [1, 2, 3].filter(i => dogruMu[i - 1]);
    const yanlis = karistir(KUMELER.filter(k => kumeAd(k) !== kumeAd(dogru))).slice(0, 3).map(k => {
      const i = [1, 2, 3].find(j => k.includes(j) !== dogruMu[j - 1]);
      return [kumeAd(k), k.includes(i) ? "kavrama" : "dikkat", (k.includes(i) ? ROMA[i] + ". öncül yanlıştır: " : ROMA[i] + ". öncül de doğrudur: ") + aciklama[i - 1]];
    });
    return { dogru: kumeAd(dogru), yanlis };
  }

  SORU_EKLE("fbil.kuvvet",
    Q("fbil.kuvvet", "uygulama", 2, "Ezgi, kuvvet ile yayın uzaması arasındaki ilişkiyi incelemek için aynı yayın ucuna sırayla ağırlıkları farklı cisimler asıyor ve her seferinde yayın ne kadar uzadığını cetvelle ölçüp tabloya yazıyor.<br><b>Bu deneyde bağımsız değişken, bağımlı değişken ve kontrol edilen (sabit tutulan) değişken sırasıyla hangisidir?</b>", "Asılan cismin ağırlığı – yayın uzama miktarı – kullanılan yay",
      [["Yayın uzama miktarı – asılan cismin ağırlığı – kullanılan yay", "kavrama", "Ezgi'nin kendisi değiştirdiği şey asılan ağırlıktır (bağımsız). Uzama ise bu değişikliğin sonucu olarak ölçülür (bağımlı). Sen ikisini ters yazdın."], ["Kullanılan yay – yayın uzama miktarı – asılan cismin ağırlığı", "kavrama", "Deneyde yay hiç değiştirilmiyor; hep aynı yay kullanılıyor. Bu yüzden yay, sabit tutulan (kontrol edilen) değişkendir."], ["Asılan cismin ağırlığı – kullanılan yay – yayın uzama miktarı", "kavrama", "Ölçülen ve tabloya yazılan şey uzama miktarıdır; bu yüzden bağımlı değişken uzamadır. Yay ise sabit tutulur."]],
      "Ezgi neyi kendisi değiştiriyor, neyi ölçüyor, neyi hiç değiştirmiyor?",
      ["🔎 Soruyu anlayalım: Yay deneyinde üç değişkenin (bağımsız, bağımlı, kontrol) ne olduğu soruluyor.",
       "💡 Hatırlayalım: Bağımsız değişken deneyi yapanın bilerek değiştirdiği, bağımlı değişken buna bağlı olarak değişip ölçülen, kontrol değişkeni ise adil bir deney için sabit tutulandır.",
       "✏️ Ezgi her seferinde farklı ağırlıkta cisim asıyor → bağımsız değişken: asılan cismin ağırlığı.",
       "✏️ Her seferinde ölçüp tabloya yazdığı şey → bağımlı değişken: yayın uzama miktarı.",
       "✏️ Bütün ölçümlerde aynı yayı kullanıyor → kontrol edilen değişken: kullanılan yay.",
       "✅ Sonuç: Asılan cismin ağırlığı – yayın uzama miktarı – kullanılan yay.",
       "🔁 Kontrol edelim: “Ağırlık değişince uzama değişiyor mu?” cümlesi deneyin sorusudur. Bu cümlede ilk söylenen bağımsız, sonra gelen bağımlı değişkendir."],
      { kural: "Bağımsız değişken: bilerek değiştirilen; bağımlı değişken: ölçülen sonuç; kontrol değişkeni: sabit tutulan.", dogruNeden: "Ezgi ağırlığı değiştiriyor, uzamayı ölçüyor ve hep aynı yayı kullanıyor." }),
    Q("fbil.kuvvet", "transfer", 2, "Bir laboratuvarda iki dinamometre bulunuyor:<br>• <b>K:</b> İnce yaylı, en fazla 10 N ölçebiliyor; çizgileri 0,5 N aralıklı.<br>• <b>L:</b> Kalın yaylı, en fazla 100 N ölçebiliyor; çizgileri 5 N aralıklı.<br>Buna göre:<br>I. Ağırlığı yaklaşık 60 N olan bir çantanın ağırlığı L ile ölçülmelidir.<br>II. Ağırlığı yaklaşık 3 N olan bir elmanın ağırlığı K ile daha hassas ölçülür.<br>III. İki dinamometre de cisimlerin kütlesini kilogram cinsinden gösterir.<br><b>yargılarından hangileri doğrudur?</b>", "I ve II",
      [["Yalnız I", "dikkat", "II de doğrudur: K'nin çizgileri 0,5 N aralıklıdır; 3 N'luk elmayı L ile (5 N aralıklı) ölçersen değeri tam okuyamazsın."], ["I, II ve III", "bilgi", "III yanlıştır: Dinamometre kuvvet ölçer ve birimi newtondur (N). Kütle ise eşit kollu terazi ile ölçülür."], ["II ve III", "kavrama", "60 N'luk çanta K'nin ölçme sınırını (10 N) aşar; yayı bozulabilir. Bu yüzden I doğrudur. III ise yanlıştır."]],
      "Dinamometreyi seçerken iki şeye bak: ölçme sınırı yeterli mi ve çizgi aralıkları ne kadar küçük?",
      ["🔎 Soruyu anlayalım: Ölçme sınırları ve çizgi aralıkları farklı iki dinamometreyle ilgili üç yargıyı değerlendireceğiz.",
       "💡 Hatırlayalım: Dinamometre kuvveti newton (N) birimiyle ölçer. Ağır cisimler için kalın (sert) yaylı, hafif cisimler için ince yaylı dinamometre seçilir; çizgi aralığı küçük olan daha hassastır.",
       "✏️ I: 60 N, K'nin sınırını (10 N) aşar; L ise 100 N'a kadar ölçer → L kullanılmalı ✔",
       "✏️ II: 3 N, iki dinamometrenin de sınırının altındadır; K'nin çizgileri 0,5 N aralıklı olduğu için daha hassastır ✔",
       "✏️ III: Dinamometre kütle değil kuvvet ölçer; birimi kilogram değil newtondur ✘",
       "✅ Sonuç: Doğru yargılar I ve II'dir.",
       "🔁 Kontrol edelim: Ölçülecek kuvvet dinamometrenin sınırını aşarsa yay kalıcı olarak bozulabilir; bu yüzden önce sınıra, sonra hassasiyete bakılır."],
      { kural: "Dinamometre kuvveti newton (N) cinsinden ölçer; ölçme sınırı yeterli olan dinamometrelerden çizgi aralığı küçük olan daha hassastır.", dogruNeden: "60 N'luk çanta yalnızca L ile ölçülebilir, 3 N'luk elma K ile daha hassas ölçülür; dinamometreler kütle değil kuvvet ölçer." }),
  );

  SORU_EKLE("fbil.bileske",
    z => {
      const a = R(3, 12), b = R(2, 10);
      let c = R(4, 24); while (Math.abs(a + b - c) < 2) c = R(4, 24);
      const net = a + b - c, Rb = Math.abs(net), yon = net > 0 ? "sağa" : "sola", ters = net > 0 ? "sola" : "sağa";
      const d = [Math.random() < 0.6, Math.random() < 0.6, Math.random() < 0.6];
      if (!d.some(x => x)) d[R(0, 2)] = true;
      const I = d[0] ? Rb : a + b + c, II = d[1] ? yon : ters, III = d[2] ? ters : yon;
      const ac = [
        `Aynı yönlü kuvvetler toplanır: sağa ${a} + ${b} = ${a + b} N. Zıt yönlülerde büyükten küçük çıkarılır: ${Math.max(a + b, c)} − ${Math.min(a + b, c)} = ${Rb} N. ${d[0] ? "" : "Bütün kuvvetleri toplamak (" + (a + b + c) + " N) yanlıştır."}`,
        `Bileşke ${Rb} N ${yon} olduğu için cisim ${yon} doğru harekete geçer.`,
        `Kuvvetleri dengelemek için bileşkeyle aynı büyüklükte ama ters yönde (${ters}) ${Rb} N uygulanmalıdır.`];
      const o = onculSecenek(d, ac);
      return S({ kaz: "fbil.bileske", duzey: "uygulama", zorluk: 3,
        soru: `Sürtünmesi önemsenmeyen bir zeminde başlangıçta durmakta olan kutuya şekildeki kuvvetler etki ediyor.<br>Buna göre:<br>I. Kutuya etki eden bileşke kuvvetin büyüklüğü ${I} N'dur.<br>II. Kutu ${II} doğru harekete geçer.<br>III. Kutuya ${III} doğru ${Rb} N'luk bir kuvvet daha uygulanırsa kuvvetler dengelenir.<br><b>yargılarından hangileri doğrudur?</b>`,
        gorsel: G.kuvvet({ sag: [a, b], sol: [c], cisim: "kutu" }),
        dogru: o.dogru, yanlis: o.yanlis,
        ipucu: "Önce sağa doğru olan kuvvetleri topla, sonra sola doğru olanla karşılaştır. Büyük olan taraf bileşkenin yönünü verir.",
        cozum: [
          `🔎 Soruyu anlayalım: Kutuya sağa ${a} N ve ${b} N, sola ${c} N kuvvet etki ediyor. Üç yargıyı tek tek değerlendireceğiz.`,
          "💡 Hatırlayalım: Aynı yönlü kuvvetler toplanır; zıt yönlü kuvvetlerde büyükten küçük çıkarılır ve bileşke büyük olanın yönündedir.",
          `✏️ Sağa: ${a} + ${b} = ${a + b} N. Sola: ${c} N. Bileşke: ${Math.max(a + b, c)} − ${Math.min(a + b, c)} = ${Rb} N, yönü ${yon}.`,
          `✏️ I: “${I} N” → ${d[0] ? "doğru ✔" : "yanlış ✘"}. II: “${II} doğru hareket” → ${d[1] ? "doğru ✔" : "yanlış ✘"}.`,
          `✏️ III: Dengelemek için bileşkeye zıt yönde (${ters}) ${Rb} N gerekir; yargıda ${III} deniyor → ${d[2] ? "doğru ✔" : "yanlış ✘"}.`,
          `✅ Sonuç: Doğru yargılar: ${o.dogru.replace("Yalnız ", "yalnız ")}.`,
          "🔁 Kontrol edelim: Dengeleyici kuvvet eklenince sağa ve sola doğru olan kuvvetlerin toplamı eşitlenmeli; hesabını bu yolla sınayabilirsin."],
        kural: "Aynı yönlü kuvvetler toplanır, zıt yönlüler çıkarılır; dengeleyici kuvvet, bileşkeyle aynı büyüklükte ve ters yöndedir.",
        dogruNeden: `Bileşke ${Rb} N ve ${yon} doğrudur; kutu ${yon} harekete geçer ve onu ${ters} doğru ${Rb} N dengeler. Buna uyan öncüller: ${o.dogru.replace("Yalnız ", "yalnız ")}.` });
    },
    Q("fbil.bileske", "transfer", 2, "Ali ve Banu bir koliyi üç farklı durumda yatay olarak itip çekiyor. Uyguladıkları kuvvetler tabloda verilmiştir.<br><b>1., 2. ve 3. durumlarda koliye etki eden bileşke kuvvet sırasıyla hangisidir?</b>", "65 N sağa – 15 N sağa – 0",
      [["65 N sağa – 65 N sağa – 80 N sağa", "kavrama", "Zıt yönlü kuvvetler toplanmaz, çıkarılır. 2. durumda 40 − 25 = 15 N, 3. durumda 40 − 40 = 0 olur."], ["65 N sağa – 15 N sola – 0", "dikkat", "2. durumda sağa doğru olan kuvvet (40 N) daha büyüktür; bileşke büyük kuvvetin yönünde, yani sağa doğrudur."], ["15 N sağa – 65 N sağa – 0", "dikkat", "1. ve 2. durumların sonuçlarını yer değiştirmişsin: 1. durumda iki kuvvet de sağa doğrudur ve toplanır (65 N)."]],
      "Her durumda önce kuvvetlerin yönlerine bak: Aynı yönlüyse topla, zıt yönlüyse çıkar.",
      ["🔎 Soruyu anlayalım: Üç durumda koliye etki eden bileşke kuvvetin büyüklüğü ve yönü soruluyor.",
       "💡 Hatırlayalım: Aynı yönlü kuvvetlerin bileşkesi toplamlarına eşittir. Zıt yönlü kuvvetlerde büyükten küçük çıkarılır, yön büyük olanın yönüdür. Eşit ve zıt kuvvetlerin bileşkesi sıfırdır.",
       "✏️ 1. durum: İkisi de sağa → 40 + 25 = 65 N, sağa.",
       "✏️ 2. durum: Zıt yönlü → 40 − 25 = 15 N, büyük olan (Ali) sağa ittiği için sağa.",
       "✏️ 3. durum: 40 N sağa, 40 N sola → 40 − 40 = 0; kuvvetler dengelenmiş.",
       "✅ Sonuç: 65 N sağa – 15 N sağa – 0.",
       "🔁 Kontrol edelim: İki kuvvetin bileşkesi en fazla toplamları (65 N), en az farkları (15 N; eşitse 0) kadar olabilir. Bulduğumuz değerler bu sınırların içinde."],
      { gorsel: G.tablo(["Durum", "Ali'nin kuvveti", "Banu'nun kuvveti"], [["1", "40 N sağa", "25 N sağa"], ["2", "40 N sağa", "25 N sola"], ["3", "40 N sağa", "40 N sola"]]), kural: "Aynı yönlü kuvvetler toplanır; zıt yönlü kuvvetler çıkarılır ve bileşke büyük olanın yönündedir.", dogruNeden: "1. durumda 40 + 25 = 65 N sağa, 2. durumda 40 − 25 = 15 N sağa, 3. durumda 40 − 40 = 0 bulunur." }),
  );

  SORU_EKLE("fbil.denge",
    Q("fbil.denge", "transfer", 3, "Düz bir yolda hareket eden oyuncak bir arabanın süratinin zamanla değişimi tabloda verilmiştir.<br><b>Buna göre hangi zaman aralığında arabaya etki eden kuvvetler dengelenmiştir?</b>", "2. ile 4. saniyeler arasında",
      [["0. ile 2. saniyeler arasında", "kavrama", "Bu aralıkta sürat 0'dan 4 m/s'ye çıkıyor; araba hızlanıyor. Hızlanan cisme etki eden kuvvetler dengelenmemiştir."], ["4. ile 5. saniyeler arasında", "kavrama", "Bu aralıkta sürat 4 m/s'den 2 m/s'ye düşüyor; araba yavaşlıyor. Yavaşlama da dengelenmemiş kuvvetin sonucudur."], ["0. ile 5. saniyeler arasında", "dikkat", "Tablonun tamamında sürat sabit değil; hızlanma ve yavaşlama olan aralıklarda kuvvetler dengelenmemiştir."]],
      "Kuvvetler dengelenmişse hareket eden bir cismin sürati nasıl değişir? Tabloda sürati değişmeyen aralığı bul.",
      ["🔎 Soruyu anlayalım: Tablodaki sürat değerlerine bakarak kuvvetlerin dengelendiği zaman aralığını bulacağız.",
       "💡 Hatırlayalım: Dengelenmiş kuvvetlerin etkisindeki cisim duruyorsa durmaya, hareket ediyorsa aynı süratle aynı yönde gitmeye devam eder. Sürat artıyor ya da azalıyorsa kuvvetler dengelenmemiştir.",
       "✏️ 0–2. saniyeler: 0 → 2 → 4 m/s, sürat artıyor → dengelenmemiş.",
       "✏️ 2–4. saniyeler: 4 → 4 → 4 m/s, sürat sabit → dengelenmiş. 4–5. saniyeler: 4 → 2 m/s, sürat azalıyor → dengelenmemiş.",
       "✅ Sonuç: Kuvvetler 2. ile 4. saniyeler arasında dengelenmiştir.",
       "🔁 Kontrol edelim: “Hareket ediyor, öyleyse bir kuvvet onu itiyor olmalı.” düşüncesi yaygın bir yanılgıdır. Sabit süratli harekette bileşke kuvvet sıfırdır."],
      { gorsel: G.tablo(["Zaman (s)", "0", "1", "2", "3", "4", "5"], [["Sürat (m/s)", "0", "2", "4", "4", "4", "2"]]), kural: "Dengelenmiş kuvvetler etkisindeki cisim ya durur ya da sabit süratle düz bir yolda hareketine devam eder.", dogruNeden: "2. ile 4. saniyeler arasında sürat 4 m/s'de sabit kalmıştır; sabit süratli harekette kuvvetler dengelenmiştir." }),
    Q("fbil.denge", "baglanti", 3, "Ayşe, odadaki ağır bir dolabı 50 N'luk kuvvetle sağa doğru itiyor ama dolap hareket etmiyor. Sonra Ali de dolabı aynı yönde 30 N'luk kuvvetle itmeye başlıyor ve dolap harekete geçiyor.<br>Buna göre:<br>I. Yalnızca Ayşe iterken dolaba etki eden kuvvetler dengelenmiştir.<br>II. Yalnızca Ayşe iterken dolaba sola doğru 50 N'luk sürtünme kuvveti etki eder.<br>III. Ali de itmeye başlayınca dolaba etki eden kuvvetler dengelenmemiş hâle gelmiştir.<br><b>yargılarından hangileri doğrudur?</b>", "I, II ve III",
      [["Yalnız III", "kavrama", "Dolap ilk durumda hareketsiz kaldıysa kuvvetler dengelenmiştir (I). Ayşe'nin 50 N'luk kuvvetini dengeleyen de sola doğru 50 N'luk sürtünmedir (II)."], ["I ve III", "kavrama", "II de doğrudur: Dolap kıpırdamadığına göre Ayşe'nin kuvvetini tam olarak dengeleyen bir kuvvet olmalıdır; bu, ters yöndeki 50 N'luk sürtünme kuvvetidir."], ["I ve II", "kavrama", "III de doğrudur: Durmakta olan dolap harekete geçtiyse artık bileşke kuvvet sıfır değildir; kuvvetler dengelenmemiştir."]],
      "Duran bir cisim durmaya devam ediyorsa kuvvetler hakkında ne söylenir? Harekete geçmesi neyi gösterir?",
      ["🔎 Soruyu anlayalım: Önce yalnız Ayşe, sonra Ayşe ve Ali birlikte dolabı itiyor. Üç yargının doğruluğunu inceleyeceğiz.",
       "💡 Hatırlayalım: Duran bir cisim durmaya devam ediyorsa ona etki eden kuvvetler dengelenmiştir. Duran cisim harekete geçiyorsa kuvvetler dengelenmemiştir.",
       "✏️ I: Ayşe iterken dolap hareket etmiyor → kuvvetler dengelenmiş ✔",
       "✏️ II: Ayşe'nin sağa doğru 50 N'unu dengeleyen kuvvet, zeminle dolap arasındaki sola doğru 50 N'luk sürtünmedir ✔",
       "✏️ III: Ali katılınca toplam itme 50 + 30 = 80 N oldu ve dolap harekete geçti → kuvvetler dengelenmemiş ✔",
       "✅ Sonuç: Üç yargı da doğrudur: I, II ve III.",
       "🔁 Kontrol edelim: “İtiyorum ama kıpırdamıyor” durumunda itme kuvveti boşa gitmez; zemin, sürtünme kuvvetiyle aynı büyüklükte karşı koyar."],
      { kural: "Duran cisim durmaya devam ediyorsa kuvvetler dengelenmiştir; harekete geçiyorsa dengelenmemiştir.", dogruNeden: "Dolap hareketsizken Ayşe'nin kuvveti 50 N'luk sürtünmeyle dengelenir; Ali katılınca dolap harekete geçtiği için kuvvetler dengelenmemiştir." }),
  );

  SORU_EKLE("fhiz.surat",
    z => {
      const [v1, v2, d] = sec([[6, 3, 120], [12, 4, 120], [15, 10, 150], [20, 5, 200], [12, 6, 240], [10, 15, 150]]);
      const t1 = d / v1, t2 = d / v2, ort = 2 * d / (t1 + t2), yanlisOrt = (v1 + v2) / 2;
      return S({ kaz: "fhiz.surat", duzey: "transfer", zorluk: 3,
        soru: `Bir koşucu K noktasından M noktasına koşuyor. Yolun K–L ve L–M bölümleriyle ilgili bilgiler tabloda verilmiştir.<br><b>Koşucunun K–M arasındaki tüm yoldaki ortalama sürati kaç m/s'dir?</b>`,
        gorsel: G.tablo(["Bölüm", "Uzunluk (m)", "Süre (s)"], [["K–L", d, t1], ["L–M", d, t2]]),
        dogru: od(ort) + " m/s",
        yanlis: [[od(yanlisOrt) + " m/s", "kavrama", `İki bölümün süratlerinin (${v1} ve ${v2} m/s) ortalamasını aldın. Bölümlerin süreleri farklı olduğu için bu yol yanlış; toplam yolu toplam süreye bölmelisin.`], [od(v1 + v2) + " m/s", "islem", "İki bölümün süratini topladın. Sürat toplanmaz; tüm yol için sürat = toplam yol ÷ toplam süredir."], [od(2 * d / Math.max(t1, t2)) + " m/s", "islem", `Toplam yolu (${2 * d} m) yalnızca bir bölümün süresine böldün; iki bölümün sürelerini toplaman gerekiyordu (${t1} + ${t2} = ${t1 + t2} s).`], [od(Math.max(v1, v2)) + " m/s", "dikkat", "Bu yalnızca bir bölümün sürati; soru tüm yoldaki ortalama sürati soruyor."]],
        ipucu: "Tüm yol için sürat hesaplarken toplam yolu ve toplam süreyi bul.",
        cozum: [
          "🔎 Soruyu anlayalım: İki bölümden oluşan bir yolda koşucunun tüm yoldaki ortalama sürati isteniyor.",
          "💡 Hatırlayalım: Sürat = alınan yol ÷ geçen süre. Tüm yol için: toplam yol ÷ toplam süre.",
          `✏️ Toplam yol: ${d} + ${d} = ${2 * d} m.`,
          `✏️ Toplam süre: ${t1} + ${t2} = ${t1 + t2} s.`,
          `✏️ Ortalama sürat: ${2 * d} ÷ ${t1 + t2} = ${od(ort)} m/s.`,
          `✅ Sonuç: Koşucunun ortalama sürati ${od(ort)} m/s'dir.`,
          `🔁 Kontrol edelim: Bölüm süratleri ${v1} ve ${v2} m/s. Koşucu yavaş bölümde daha uzun süre geçirdiği için ortalama, ${od(yanlisOrt)} yerine yavaş olana daha yakın çıkar.`],
        kural: "Tüm yoldaki ortalama sürat = toplam yol ÷ toplam süre; bölüm süratlerinin ortalaması alınmaz.",
        dogruNeden: `Toplam yol ${2 * d} m, toplam süre ${t1 + t2} s olduğundan ortalama sürat ${od(ort)} m/s'dir.` });
    },
    Q("fhiz.surat", "baglanti", 2, "Bir koşu etkinliğinde üç öğrenciyle ilgili şu bilgiler veriliyor:<br>• <b>Ece</b> 400 m'yi 80 saniyede koşuyor.<br>• <b>Can</b> sabit 5 m/s süratle koşuyor.<br>• <b>Deniz</b> 300 m'yi 1 dakikada koşuyor.<br>Öğrencilerin sabit süratle koştuğu kabul edilirse:<br>I. Ece ile Can'ın süratleri eşittir.<br>II. Aynı sürede Deniz, Ece'den daha az yol alır.<br>III. Üçü de 2 dakika koşarsa her biri 600 m yol alır.<br><b>yargılarından hangileri doğrudur?</b>", "I ve III",
      [["Yalnız I", "islem", "III de doğrudur: 5 m/s süratle 2 dakikada (120 s) 5 × 120 = 600 m yol alınır."], ["I ve II", "islem", "Deniz'in sürati 300 ÷ 60 = 5 m/s'dir; Ece'ninkiyle aynıdır. Aynı sürede eşit yol alırlar; II yanlıştır."], ["II ve III", "islem", "Ece'nin sürati 400 ÷ 80 = 5 m/s'dir; Can'ınkiyle eşittir. I doğru, II yanlıştır."]],
      "Önce üç öğrencinin süratini aynı birimle (m/s) hesapla. Dakikayı saniyeye çevirmeyi unutma!",
      ["🔎 Soruyu anlayalım: Üç öğrencinin süratleriyle ilgili üç yargıyı değerlendireceğiz.",
       "💡 Hatırlayalım: Sürat = yol ÷ zaman. Karşılaştırma yaparken birimler aynı olmalı: 1 dakika = 60 saniye.",
       "✏️ Ece: 400 ÷ 80 = 5 m/s. Can: 5 m/s. Deniz: 300 m ÷ 60 s = 5 m/s.",
       "✏️ I: Ece ile Can 5 m/s → eşit ✔. II: Deniz ile Ece'nin sürati eşit, aynı sürede eşit yol alırlar ✘",
       "✏️ III: 2 dakika = 120 s; 5 × 120 = 600 m → ✔",
       "✅ Sonuç: Doğru yargılar I ve III'tür.",
       "🔁 Kontrol edelim: Verilerin farklı görünmesi süratlerin farklı olduğu anlamına gelmez; hesaplamadan karar verme."],
      { kural: "Sürat = yol ÷ zaman; karşılaştırmadan önce birimleri eşitle (1 dk = 60 s).", dogruNeden: "Üç öğrencinin sürati de 5 m/s'dir; bu yüzden I ve III doğru, II yanlıştır." }),
  );

  SORU_EKLE("fhiz.grafik",
    Q("fhiz.grafik", "baglanti", 3, "Aynı noktadan aynı yöne doğru harekete başlayan K ve L bisikletlilerinin yol–zaman grafiği şekilde verilmiştir.<br>Grafiğe göre:<br>I. L, K'den 10 saniye sonra harekete başlamıştır.<br>II. L'nin sürati K'nin süratinden büyüktür.<br>III. 40. saniyede K, L'nin önündedir.<br><b>yargılarından hangileri doğrudur?</b>", "I ve II",
      [["Yalnız I", "islem", "II de doğrudur: K'nin sürati 200 ÷ 40 = 5 m/s, L'ninki 240 ÷ 30 = 8 m/s'dir."], ["I ve III", "dikkat", "40. saniyede K 200 m'de, L ise 240 m'dedir; önde olan L'dir. III yanlıştır."], ["I, II ve III", "dikkat", "III yanlıştır: 40. saniyede grafikte L'nin çizgisi K'ninkinin üstündedir; L daha fazla yol almıştır."]],
      "Her çizginin başladığı ve bittiği noktaları oku. Sürati bulmak için yolu, o yolun alındığı süreye böl.",
      ["🔎 Soruyu anlayalım: K ve L'nin yol–zaman grafiğinden üç yargıyı değerlendireceğiz.",
       "💡 Hatırlayalım: Yol–zaman grafiğinde yatay kısım durmayı, eğik doğru sabit süratli hareketi gösterir; sürat = alınan yol ÷ geçen süre.",
       "✏️ I: L'nin çizgisi 0–10. saniyelerde yatay (yol 0), sonra yükseliyor → L 10 s sonra başlamış ✔",
       "✏️ II: K: 200 m ÷ 40 s = 5 m/s. L: 240 m ÷ (40 − 10) s = 8 m/s → L daha süratli ✔",
       "✏️ III: 40. saniyede K 200 m'de, L 240 m'de → önde olan L ✘",
       "✅ Sonuç: Doğru yargılar I ve II'dir.",
       "🔁 Kontrol edelim: L'nin süresini hesaplarken hareketsiz geçen 10 saniyeyi çıkarmayı unutma; yoksa L'nin süratini 240 ÷ 40 = 6 m/s diye yanlış bulursun."],
      { gorsel: cizgi([{ ad: "K", noktalar: [[0, 0], [40, 200]], sinif: "g-ok-a" }, { ad: "L", noktalar: [[0, 0], [10, 0], [40, 240]], sinif: "g-ok-d" }], { xmax: 40, ymax: 240, xadim: 10, yadim: 40, xad: "Zaman (s)", yad: "Yol (m)" }), kural: "Yol–zaman grafiğinde yatay kısım durmayı gösterir; sürat hesaplanırken yalnızca hareket edilen süre kullanılır.", dogruNeden: "L 10 s geç başlamıştır ve sürati 8 m/s ile K'nin 5 m/s'lik süratinden büyüktür; 40. saniyede ise önde olan L'dir." }),
    Q("fhiz.grafik", "uygulama", 2, "Bir yürüyüşçünün aldığı yolun zamana göre değişimi tabloda verilmiştir.<br>Tabloya göre:<br>I. Yürüyüşçü 20. ile 40. saniyeler arasında durmuştur.<br>II. Yürüyüşçünün 40. ile 50. saniyeler arasındaki sürati, 0. ile 20. saniyeler arasındaki süratinin 2 katıdır.<br>III. Yürüyüşçü hareketi boyunca hep aynı süratle gitmiştir.<br><b>yargılarından hangileri doğrudur?</b>", "I ve II",
      [["Yalnız I", "islem", "II de doğrudur: 0–20 s arası 60 ÷ 20 = 3 m/s, 40–50 s arası (120 − 60) ÷ 10 = 6 m/s; 6, 3'ün 2 katıdır."], ["I ve III", "kavrama", "Yürüyüşçü bir süre durmuş ve sonra daha süratli yürümüştür; hep aynı süratle gitmemiştir. III yanlıştır."], ["II ve III", "dikkat", "20. ile 40. saniyeler arasında yol 60 m'de sabit kalmış; yürüyüşçü durmuştur. I doğru, III yanlıştır."]],
      "Yolun değişmediği aralık neyi gösterir? Her aralıkta yol farkını süre farkına böl.",
      ["🔎 Soruyu anlayalım: Yol–zaman tablosuna bakarak yürüyüşçünün hareketiyle ilgili üç yargıyı değerlendireceğiz.",
       "💡 Hatırlayalım: Zaman geçtiği hâlde yol değişmiyorsa cisim durmaktadır. Bir aralıktaki sürat = o aralıktaki yol farkı ÷ süre farkı.",
       "✏️ I: 20. s'de 60 m, 30. s'de 60 m, 40. s'de 60 m → yol değişmemiş, durmuş ✔",
       "✏️ II: 0–20 s: 60 ÷ 20 = 3 m/s. 40–50 s: (120 − 60) ÷ 10 = 6 m/s → 2 katı ✔",
       "✏️ III: Süratler 3 m/s, 0 m/s ve 6 m/s → hep aynı değil ✘",
       "✅ Sonuç: Doğru yargılar I ve II'dir.",
       "🔁 Kontrol edelim: Bu tabloyu grafiğe çizseydin önce eğik, sonra yatay, en son daha dik bir çizgi elde ederdin; dik olan kısım daha süratli hareketi gösterir."],
      { gorsel: G.tablo(["Zaman (s)", "0", "10", "20", "30", "40", "50"], [["Yol (m)", "0", "30", "60", "60", "60", "120"]]), kural: "Yol değişmiyorsa cisim durmaktadır; bir aralıktaki sürat, yol farkının süre farkına bölümüdür.", dogruNeden: "20–40 s arasında yol değişmemiştir ve 40–50 s arasındaki 6 m/s'lik sürat, 0–20 s arasındaki 3 m/s'nin 2 katıdır." }),
  );

  SORU_EKLE("fhiz.hiz",
    Q("fhiz.hiz", "uygulama", 2, "Düz ve doğu–batı doğrultusundaki bir yolda giden dört aracın süratleri ve hareket yönleri tabloda verilmiştir.<br>Buna göre:<br>I. K ile L'nin süratleri eşittir.<br>II. K ile N'nin hızları eşittir.<br>III. K ile L'nin hızları eşittir.<br><b>yargılarından hangileri doğrudur?</b>", "I ve II",
      [["Yalnız I", "kavrama", "II de doğrudur: K ile N'nin hem süratleri (60 km/sa) hem de yönleri (doğu) aynıdır; bu yüzden hızları eşittir."], ["I, II ve III", "kavrama", "III yanlıştır: K ile L'nin süratleri eşit ama yönleri zıttır. Hız hem sürati hem de yönü içerir; yön farklıysa hız da farklıdır."], ["II ve III", "kavrama", "Hızın eşit olması için sürat ve yön birlikte aynı olmalıdır. K doğuya, L batıya gittiği için hızları eşit değildir."]],
      "Hız = sürat + yön. Sürat karşılaştırırken yalnızca sayılara, hız karşılaştırırken hem sayılara hem yönlere bak.",
      ["🔎 Soruyu anlayalım: Tablodaki dört aracın sürat ve hızlarıyla ilgili üç yargıyı değerlendireceğiz.",
       "💡 Hatırlayalım: Sürat yalnızca birim zamanda alınan yolu gösterir. Hız ise sürat ile hareketin yönünü birlikte ifade eder.",
       "✏️ I: K 60 km/sa, L 60 km/sa → süratler eşit ✔",
       "✏️ II: K 60 km/sa doğu, N 60 km/sa doğu → sürat ve yön aynı, hızlar eşit ✔",
       "✏️ III: K doğuya, L batıya gidiyor → süratler eşit olsa da yönler zıt, hızlar farklı ✘",
       "✅ Sonuç: Doğru yargılar I ve II'dir.",
       "🔁 Kontrol edelim: M'nin yönü K ile aynı ama sürati farklı; o da K ile aynı hıza sahip değildir. Hız eşitliği için iki koşul birlikte gerekir."],
      { gorsel: G.tablo(["Araç", "Sürat", "Yön"], [["K", "60 km/sa", "doğu"], ["L", "60 km/sa", "batı"], ["M", "80 km/sa", "doğu"], ["N", "60 km/sa", "doğu"]]), kural: "Hız = sürat + yön; iki hareketlinin hızları ancak süratleri ve yönleri aynıysa eşittir.", dogruNeden: "K ile L'nin süratleri aynıdır; K ile N'nin hem sürati hem yönü aynı olduğu için hızları da eşittir." }),
    Q("fhiz.hiz", "aciklama", 2, "Duvar saatinin yelkovanının ucu, saatin kadranı üzerinde sabit süratle dönmektedir.<br>Yelkovanın ucunun hareketiyle ilgili:<br>I. Sürati sabittir.<br>II. Hızı sabittir.<br>III. Hareket yönü sürekli değişir.<br><b>ifadelerinden hangileri doğrudur?</b>", "I ve III",
      [["Yalnız I", "kavrama", "III de doğrudur: Yelkovanın ucu daire çizerek döner; bir an yukarı, bir an sağa, bir an aşağı gider. Yönü sürekli değişir."], ["I ve II", "kavrama", "Yön sürekli değiştiği için hız sabit olamaz. Sabit hız için hem sürat hem yön değişmemelidir."], ["I, II ve III", "kavrama", "II yanlıştır: Sürati sabit olsa bile yönü değiştiği için yelkovan ucunun hızı sürekli değişir."]],
      "Yelkovanın ucu düz bir çizgide mi gidiyor, yoksa daire mi çiziyor? Yön değişirse hız ne olur?",
      ["🔎 Soruyu anlayalım: Sabit süratle dönen yelkovan ucunun sürati, hızı ve yönüyle ilgili üç ifadeyi değerlendireceğiz.",
       "💡 Hatırlayalım: Sabit hızlı hareket için sürat ve yön değişmemelidir; bu ancak düz bir yolda olur. Dairesel harekette yön her an değişir.",
       "✏️ I: Soruda “sabit süratle” deniyor → sürat sabit ✔",
       "✏️ III: Uç daire çizdiği için hareket yönü sürekli değişir ✔",
       "✏️ II: Yön değiştiğine göre hız da değişir → hız sabit değil ✘",
       "✅ Sonuç: Doğru ifadeler I ve III'tür.",
       "🔁 Kontrol edelim: Dönme dolap, atletizm pisti ve saat ibreleri aynı mantıkla çalışır: sürat sabit olabilir, hız sabit olamaz."],
      { kural: "Dairesel harekette sürat sabit olabilir ama yön sürekli değiştiği için hız sabit değildir.", dogruNeden: "Yelkovan ucunun sürati sabittir; dairesel hareket ettiği için yönü, dolayısıyla hızı sürekli değişir." }),
  );

  /* =============================== 3. ÜNİTE: CANLILAR VE İNSAN (ÜREME, DENETLEYİCİ SİSTEMLER) =============================== */

  SORU_EKLE("fure.eseysiz",
    Q("fure.eseysiz", "uygulama", 2, "Bir öğrencinin doğa gözlem defterinde şu notlar yer alıyor:<br>1) Bahçedeki çilek bitkisinin toprak üstünde uzanan gövdesinden yeni çilek bitkileri gelişti.<br>2) Akvaryumda ikiye ayrılan bir planaryanın her parçasından yeni bir planarya oluştu.<br>3) Kümesteki tavuğun döllenmiş yumurtasından civciv çıktı.<br>4) Mayalı hamurdaki maya hücresinin üzerinde oluşan çıkıntı ayrılarak yeni bir maya hücresi oldu.<br><b>Bu notlardan hangileri eşeysiz üremeye örnektir?</b>", "1, 2 ve 4",
      [["Yalnız 4", "kavrama", "Eşeysiz üreme yalnızca tek hücrelilerde görülmez. Çilekteki gövdeyle (vejetatif) üreme ve planaryadaki yenilenmeyle üreme de eşeysizdir."], ["2 ve 4", "kavrama", "Çilek de eşeysiz ürüyor: Toprak üstündeki gövdeden çıkan yeni bitkiler, tohum ve döllenme olmadan oluşur (vejetatif üreme)."], ["1, 2, 3 ve 4", "kavrama", "3. not eşeyli üremedir: Civciv, sperm ile yumurtanın birleşmesiyle (döllenme) oluşmuş bir yumurtadan çıkar."]],
      "Her notta “Döllenme, yani iki ayrı üreme hücresinin birleşmesi var mı?” diye sor.",
      ["🔎 Soruyu anlayalım: Dört gözlem notundan hangilerinin eşeysiz üreme örneği olduğu soruluyor.",
       "💡 Hatırlayalım: Eşeysiz üremede tek bir ata yeterlidir, üreme hücreleri ve döllenme yoktur; yavrular atayla aynı kalıtsal özellikleri taşır. Çeşitleri: bölünme, tomurcuklanma, rejenerasyon (yenilenme), vejetatif üreme, sporla üreme.",
       "✏️ 1) Çilekte gövdeden yeni bitki → vejetatif üreme (eşeysiz) ✔. 2) Planaryada parçadan yeni canlı → rejenerasyonla üreme (eşeysiz) ✔",
       "✏️ 3) Döllenmiş yumurtadan civciv → döllenme var, eşeyli üreme ✘",
       "✏️ 4) Maya hücresinde çıkıntının ayrılması → tomurcuklanma (eşeysiz) ✔",
       "✅ Sonuç: Eşeysiz üremeye örnek olanlar 1, 2 ve 4'tür.",
       "🔁 Kontrol edelim: “Döllenmiş” sözcüğünü gördüğün an eşeyli üremeyi düşün; döllenme ancak sperm ile yumurta birleşince olur."],
      { kural: "Eşeysiz üremede döllenme yoktur: bölünme, tomurcuklanma, rejenerasyon, vejetatif üreme ve sporla üreme eşeysiz üreme çeşitleridir.", dogruNeden: "Çilekteki vejetatif üreme, planaryadaki yenilenme ve mayadaki tomurcuklanma döllenme olmadan gerçekleşir; civciv ise döllenmiş yumurtadan çıkar." }),
    Q("fure.eseysiz", "baglanti", 3, "Selin, patates yumrusunu parçalara ayırıp iki saksıya ekiyor. Birinci saksıya “göz” denilen çukurcuk içeren bir parça, ikinci saksıya göz içermeyen bir parça koyuyor. Diğer bütün koşulları aynı tutuyor. Birkaç hafta sonra yalnızca birinci saksıda filiz çıktığını görüyor.<br>Bu deneyle ilgili:<br>I. Patatesin yumrusuyla çoğalması eşeysiz bir üreme çeşididir.<br>II. Birinci saksıda oluşan bitki, parçanın alındığı patates bitkisinin kalıtsal özelliklerini taşır.<br>III. Deney, patates bitkisinin hiçbir zaman çiçek açıp tohum oluşturmadığını gösterir.<br><b>yargılarından hangileri doğrudur?</b>", "I ve II",
      [["Yalnız I", "kavrama", "II de doğrudur: Eşeysiz üremede yeni birey tek bir atadan oluşur ve atayla aynı kalıtsal özellikleri taşır."], ["I ve III", "dikkat", "Deneyde yalnızca yumru parçaları kullanıldı; çiçek ve tohumla ilgili hiçbir şey gözlenmedi. Üstelik patates çiçek açıp tohum da oluşturabilir. III yanlıştır."], ["I, II ve III", "dikkat", "III yanlıştır: Bir deneyden ancak test edilen konuyla ilgili sonuç çıkarılır; bu deney çiçek ve tohum oluşumunu test etmiyor."]],
      "Deneyde neyi değiştirdi, ne gözledi? Bu gözlem çiçekler hakkında bilgi veriyor mu?",
      ["🔎 Soruyu anlayalım: Göz içeren ve içermeyen patates parçalarıyla yapılan bir deneyle ilgili üç yargıyı değerlendireceğiz.",
       "💡 Hatırlayalım: Patates, yumru adı verilen toprak altı gövdesindeki gözlerden yeni bitki oluşturabilir. Bu, vejetatif üreme adı verilen eşeysiz üremedir.",
       "✏️ I: Yumrudan yeni bitki oluşması döllenme gerektirmez → eşeysiz üreme ✔",
       "✏️ II: Eşeysiz üremede yavru, tek atanın kalıtsal özelliklerinin aynısını taşır ✔",
       "✏️ III: Deneyde çiçek ya da tohum incelenmedi; bu yüzden böyle bir sonuca ulaşılamaz (patates çiçek açıp tohum da oluşturabilir) ✘",
       "✅ Sonuç: Doğru yargılar I ve II'dir.",
       "🔁 Kontrol edelim: Deneyin değişkenleri: bağımsız → parçada göz olup olmaması; bağımlı → filiz çıkması; sabit → toprak, su, ışık, sıcaklık. Sonuç yalnızca bu değişkenlerle ilgili olabilir."],
      { kural: "Yumru, çelik, sürünücü gövde gibi yapılarla çoğalma vejetatif (eşeysiz) üremedir; yavrular atanın kalıtsal özelliklerini taşır.", dogruNeden: "Gözlü yumru parçasından bitki oluşması eşeysiz üremedir ve yeni bitki atasıyla aynı kalıtsal özelliklere sahiptir; deney çiçek ve tohum hakkında bilgi vermez." }),
  );

  SORU_EKLE("fure.bitki",
    Q("fure.bitki", "uygulama", 3, "Ege, aynı tür ve sayıda fasulye tohumuyla dört kap hazırlıyor. Kapların koşulları tabloda verilmiştir.<br>Ege, tohumların çimlenmesi için <b>ışığın gerekli olup olmadığını</b> test etmek istiyor.<br><b>Ege hangi iki kabın sonuçlarını karşılaştırmalıdır?</b>", "1 ve 4",
      [["1 ve 2", "strateji", "1 ve 2 numaralı kaplarda değişen tek koşul sudur. Bu iki kap suyun etkisini test eder, ışığın değil."], ["3 ve 4", "strateji", "3 ve 4 numaralı kaplarda değişen tek koşul sıcaklıktır; ışık ikisinde de yok. Bu karşılaştırma sıcaklığın etkisini test eder."], ["1 ve 3", "strateji", "1 ve 3 numaralı kaplarda hem sıcaklık hem ışık farklıdır. İki koşul birden değişirse sonucun hangisinden kaynaklandığını bilemezsin."]],
      "Adil bir karşılaştırmada iki kap arasında yalnızca test edilen koşul farklı olmalıdır.",
      ["🔎 Soruyu anlayalım: Işığın çimlenmeye etkisini test etmek için hangi iki kabın karşılaştırılması gerektiği soruluyor.",
       "💡 Hatırlayalım: Bir değişkenin etkisini test etmek için yalnızca o değişken farklı, diğer bütün koşullar aynı olmalıdır.",
       "✏️ Test edilen (bağımsız) değişken ışık. O hâlde biri ışıklı, biri karanlık; ama su ve sıcaklık aynı olan iki kap arıyoruz.",
       "✏️ Kap 1: su var, 22 °C, ışıklı. Kap 4: su var, 22 °C, karanlık → yalnızca ışık farklı.",
       "✅ Sonuç: Ege 1 ve 4 numaralı kapları karşılaştırmalıdır.",
       "🔁 Kontrol edelim: Bu deneyde fasulye tohumları iki kapta da çimlenirse “Fasulyenin çimlenmesi için ışık gerekli değildir.” sonucuna varılır. Çimlenme için su, uygun sıcaklık ve hava gereklidir."],
      { gorsel: G.tablo(["Kap", "Su", "Sıcaklık", "Işık"], [["1", "var", "22 °C", "var"], ["2", "yok", "22 °C", "var"], ["3", "var", "4 °C", "yok"], ["4", "var", "22 °C", "yok"]]), kural: "Bir koşulun etkisini test ederken yalnızca o koşul değiştirilir; diğer bütün koşullar sabit tutulur.", dogruNeden: "1 ve 4 numaralı kaplarda su ve sıcaklık aynı, yalnızca ışık farklıdır; bu yüzden ışığın etkisini bu iki kap gösterir." }),
    Q("fure.bitki", "transfer", 3, "Son yıllarda bazı bölgelerde arı sayısının hızla azaldığı haberleri yayımlanıyor. Bir tarım uzmanı bu durumun ürünleri nasıl etkileyebileceğini açıklıyor.<br>Uzmanın açıklamasında yer alabilecek:<br>I. Böceklerle tozlaşan meyve ağaçlarında meyve ve tohum oluşumu azalabilir.<br>II. Mısır gibi rüzgârla tozlaşan bitkiler, arıların azalmasından daha az etkilenir.<br>III. Arılar polenleri dişi organın tepeciğinden erkek organın başçığına taşır.<br><b>ifadelerinden hangileri bilimsel olarak doğrudur?</b>", "I ve II",
      [["Yalnız I", "kavrama", "II de doğrudur: Rüzgârla tozlaşan bitkiler polen taşınması için arılara ihtiyaç duymaz; bu yüzden daha az etkilenir."], ["I ve III", "bilgi", "III'te yön ters yazılmış: Polenler erkek organın başçığında üretilir ve dişi organın tepeciğine taşınır."], ["I, II ve III", "bilgi", "III yanlıştır: Tozlaşmada polen başçıktan (erkek organ) tepeciğe (dişi organ) taşınır, tersi değil."]],
      "Tozlaşmayı tanımla: Polen nereden nereye taşınıyor? Bunu yapan tek etmen arılar mı?",
      ["🔎 Soruyu anlayalım: Arı sayısının azalmasının bitkilere etkisiyle ilgili üç ifadeden doğru olanları seçeceğiz.",
       "💡 Hatırlayalım: Tozlaşma, polenlerin erkek organın başçığından dişi organın tepeciğine taşınmasıdır. Polenleri böcekler, rüzgâr, su ve başka hayvanlar taşıyabilir. Tozlaşma ve döllenme olmadan meyve ve tohum oluşmaz.",
       "✏️ I: Arı azalırsa böceklerle tozlaşan bitkilerde tozlaşma azalır; döllenme ve meyve-tohum oluşumu da azalır ✔",
       "✏️ II: Rüzgârla tozlaşan bitkiler arılara bağımlı değildir → daha az etkilenir ✔",
       "✏️ III: Polenin yönü ters yazılmış; doğrusu başçıktan tepeciğe ✘",
       "✅ Sonuç: Bilimsel olarak doğru ifadeler I ve II'dir.",
       "🔁 Kontrol edelim: Sıralama hep aynıdır: tozlaşma → döllenme → tohum ve meyve oluşumu. İlk halka koparsa sonrakiler de gerçekleşmez."],
      { kural: "Tozlaşma: polenin başçıktan tepeciğe taşınması. Tozlaşma → döllenme → tohum ve meyve.", dogruNeden: "Arılar azalınca böceklerle tozlaşan bitkilerde meyve-tohum azalır, rüzgârla tozlaşanlar daha az etkilenir; polen ise başçıktan tepeciğe taşınır." }),
  );

  SORU_EKLE("fure.gelisme",
    Q("fure.gelisme", "uygulama", 2, "Tabloda bazı hayvanların yumurtadan çıktıktan sonra ergin (yetişkin) olana kadar geçirdiği evreler verilmiştir.<br><b>Bu hayvanlardan hangileri dolaylı gelişme (başkalaşım) gösterir?</b>", "Kurbağa, kelebek ve çekirge",
      [["Yalnız kelebek", "kavrama", "Başkalaşım yalnızca kelebekte görülmez. Kurbağa (iribaş evresi) ve çekirge (nimf evresi) de ergine benzemeyen evrelerden geçer."], ["Kurbağa ve kelebek", "dikkat", "Çekirgeyi atladın: Yumurtadan çıkan nimf, kanatsızdır ve ergine tam benzemez; birkaç kez deri değiştirerek ergin olur. Bu eksik başkalaşımdır."], ["Kelebek, çekirge ve tavuk", "kavrama", "Civciv, yetişkin tavuğa benzer; yalnızca büyür ve tüyleri değişir. Tavuk doğrudan gelişme gösterir. Kurbağa ise başkalaşım geçirir."]],
      "Yavrunun yumurtadan çıktığında erginine benzeyip benzemediğine bak.",
      ["🔎 Soruyu anlayalım: Dört hayvandan hangilerinin dolaylı gelişme (başkalaşım) gösterdiği soruluyor.",
       "💡 Hatırlayalım: Yavru erginine benziyor ve yalnızca büyüyorsa doğrudan gelişme vardır. Yavru erginine benzemiyor ve evreler geçirerek şekil değiştiriyorsa dolaylı gelişme (başkalaşım) vardır.",
       "✏️ Kurbağa: iribaş solungaçlı ve kuyrukludur, ergine benzemez → başkalaşım ✔. Kelebek: tırtıl ve pupa evreleri → tam başkalaşım ✔",
       "✏️ Çekirge: nimf kanatsızdır, deri değiştirerek ergin olur → eksik başkalaşım ✔",
       "✏️ Tavuk: civciv yetişkin tavuğa benzer, yalnızca büyür → doğrudan gelişme ✘",
       "✅ Sonuç: Dolaylı gelişme gösterenler kurbağa, kelebek ve çekirgedir.",
       "🔁 Kontrol edelim: Kuşlar ve memeliler (tavuk, kedi, insan) doğrudan gelişme gösterir. Kurbağa ve birçok böcek ise başkalaşım geçirir."],
      { gorsel: G.tablo(["Hayvan", "Gelişme evreleri"], [["Kurbağa", "yumurta → iribaş → ergin kurbağa"], ["Kelebek", "yumurta → tırtıl → pupa → ergin kelebek"], ["Çekirge", "yumurta → nimf (kanatsız) → ergin çekirge"], ["Tavuk", "yumurta → civciv → yetişkin tavuk"]]), kural: "Yavru erginine benziyorsa doğrudan gelişme; benzemiyor ve evrelerden geçiyorsa dolaylı gelişme (başkalaşım) vardır.", dogruNeden: "Kurbağa, kelebek ve çekirgenin yavruları erginlerine benzemez ve evreler geçirerek ergin olur; civciv ise tavuğa benzer." }),
    Q("fure.gelisme", "baglanti", 3, "Bir gölette yapılan gözlemde kurbağa yavrularıyla ilgili tablodaki bilgiler kaydedilmiştir.<br>Bu bilgilere göre:<br>I. İribaş evresinde canlı, suda solungaçlarıyla solunum yapar.<br>II. 8. haftada vücut yapısında yeni organlar oluştuğu için gelişme gerçekleşmiştir.<br>III. Kurbağa doğrudan gelişme gösteren bir hayvandır.<br><b>yargılarından hangileri doğrudur?</b>", "I ve II",
      [["Yalnız II", "dikkat", "I de doğrudur: Tabloda 3. hafta için “solungaçlı, kuyruklu iribaş” yazıyor; iribaş suda solungaçla solunum yapar."], ["I ve III", "kavrama", "İribaş ergin kurbağaya benzemez ve şekil değiştirerek kurbağaya dönüşür. Bu, dolaylı gelişmedir (başkalaşım); III yanlıştır."], ["I, II ve III", "kavrama", "III yanlıştır: Yavrunun ergine benzememesi ve evrelerden geçmesi dolaylı gelişmeyi gösterir."]],
      "Büyüme yalnızca boyutun artmasıdır; yeni yapıların oluşması ise gelişmedir. İribaş kurbağaya benziyor mu?",
      ["🔎 Soruyu anlayalım: Kurbağanın haftalara göre değişimini gösteren tabloya bakarak üç yargıyı değerlendireceğiz.",
       "💡 Hatırlayalım: Büyüme, canlının boyutunun ve kütlesinin artmasıdır. Gelişme ise yeni yapıların oluşması ve var olanların değişmesidir. Kurbağa başkalaşım geçirir.",
       "✏️ I: 3. haftada iribaş solungaçlıdır; suda solungaçla solunum yapar ✔",
       "✏️ II: 8. haftada arka bacaklar çıkmış; yeni organ oluşması gelişmedir ✔",
       "✏️ III: Yumurtadan çıkan iribaş ergine benzemiyor; 12. haftada kuyruğu kaybolup akciğerli kurbağa oluyor → dolaylı gelişme. “Doğrudan” ifadesi yanlış ✘",
       "✅ Sonuç: Doğru yargılar I ve II'dir.",
       "🔁 Kontrol edelim: Kurbağa yaşamının başında suda (solungaç), erginken karada da yaşar (akciğer ve deri). Bu büyük değişim başkalaşımın işaretidir."],
      { gorsel: G.tablo(["Zaman", "Gözlem"], [["1. hafta", "Jöle kıvamında yumurta kümeleri"], ["3. hafta", "Solungaçlı, kuyruklu iribaşlar"], ["8. hafta", "Arka bacakları çıkmış iribaşlar"], ["12. hafta", "Akciğerli, kuyruksuz küçük kurbağalar"]]), kural: "Kurbağa başkalaşım geçirir: yumurta → solungaçlı iribaş → akciğerli ergin kurbağa.", dogruNeden: "İribaş solungaçla solunum yapar ve yeni organların oluşması gelişmedir; kurbağa ise doğrudan değil dolaylı gelişme gösterir." }),
  );

  SORU_EKLE("fden.sinir",
    Q("fden.sinir", "baglanti", 3, "Deniz, arkadaşının tuttuğu bir cetveli parmaklarının arasında bekliyor. Arkadaşı haber vermeden cetveli bırakıyor ve Deniz cetveli görür görmez yakalıyor. Cetvelin düştüğü uzunluk ne kadar kısaysa Deniz o kadar çabuk tepki vermiş demektir. Sonuçlar tabloda verilmiştir.<br>Buna göre:<br>I. Cetveli yakalamak, omuriliğin kontrol ettiği bir reflekstir.<br>II. Cetvelin düştüğünü göz algılar; yakalama kararı beyinde verilir.<br>III. Denemeler ilerledikçe Deniz cetveli daha kısa sürede yakalamıştır.<br><b>yargılarından hangileri doğrudur?</b>", "II ve III",
      [["Yalnız III", "dikkat", "II de doğrudur: Cetveli görmek (göz) ve yakalamaya karar vermek (beyin) istemli bir harekettir."], ["I ve III", "kavrama", "Cetveli yakalamak istemli bir harekettir; Deniz bunu bilerek ve dikkatini vererek yapıyor. Refleks ise istemsizdir, düşünmeden olur (ör. sıcaktan eli çekme)."], ["I, II ve III", "kavrama", "I yanlıştır: Refleksler omurilikte düşünmeden gerçekleşir. Cetveli yakalamak beynin kontrolündeki istemli bir harekettir."]],
      "Cetveli yakalamak için Deniz önce görüp sonra karar veriyor mu, yoksa düşünmeden mi oluyor? Tabloda uzunluklar nasıl değişiyor?",
      ["🔎 Soruyu anlayalım: Cetvel yakalama deneyiyle ilgili üç yargıyı değerlendireceğiz. Tabloda cetvelin düştüğü uzunluk veriliyor.",
       "💡 Hatırlayalım: İstemli hareketler beyin tarafından yönetilir. Refleksler ise ani tehlikelere karşı omurilik tarafından düşünmeden verilen tepkilerdir.",
       "✏️ I: Deniz cetveli bekliyor, görünce bilerek yakalıyor → istemli hareket, refleks değil ✘",
       "✏️ II: Uyarıyı göz alır, duyu sinirleriyle beyne iletir; beyin kararı verir ve kaslara emir gönderir ✔",
       "✏️ III: Uzunluklar 18 → 15 → 12 → 11 cm; düşme uzunluğu azaldıkça tepki süresi kısalmış ✔",
       "✅ Sonuç: Doğru yargılar II ve III'tür.",
       "🔁 Kontrol edelim: Deneyde bağımsız değişken deneme sırası, bağımlı değişken cetvelin düştüğü uzunluktur (tepki süresinin göstergesi)."],
      { gorsel: G.tablo(["Deneme", "1.", "2.", "3.", "4."], [["Cetvelin düştüğü uzunluk", "18 cm", "15 cm", "12 cm", "11 cm"]]), kural: "İstemli hareketleri beyin yönetir; refleksler omurilik tarafından düşünmeden gerçekleştirilir.", dogruNeden: "Cetveli görüp yakalamak beynin yönettiği istemli bir harekettir ve düşme uzunluğu azaldıkça Deniz daha çabuk tepki vermiştir." }),
    Q("fden.sinir", "aciklama", 2, "Elini yanlışlıkla sıcak bir ütüye değdiren Ece'de sırasıyla şu olaylar gerçekleşiyor:<br>1) Düşünmeden elini hemen geri çekiyor.<br>2) Bir an sonra parmağında yanma ve acı hissediyor.<br>3) Ne yapması gerektiğini düşünüp parmağını soğuk suyun altına tutuyor.<br><b>Bu olayların yönetildiği merkezler hangi seçenekte doğru verilmiştir?</b>", "1: omurilik – 2: beyin – 3: beyin",
      [["1: beyin – 2: beyin – 3: beyin", "kavrama", "Elin düşünmeden geri çekilmesi bir reflekstir; refleksler beyne gidilmeden omurilikte yönetilir. Böylece zaman kazanılır."], ["1: omurilik – 2: omurilik – 3: beyin", "kavrama", "Acıyı hissetmek (algılamak) beyinde olur. Omurilik refleksi yönetir ama duyuları algılamaz."], ["1: beyincik – 2: beyin – 3: omurilik", "bilgi", "Beyincik denge ve hareketlerin uyumunu sağlar; refleksi omurilik yönetir. Soğuk suya tutmak ise düşünerek yapılan istemli bir harekettir, beyin yönetir."]],
      "Düşünmeden yapılan tepki nerede yönetilir? Acıyı hissetmek ve karar vermek nerede olur?",
      ["🔎 Soruyu anlayalım: Sıcak ütüye dokunan Ece'deki üç olayın hangi merkezlerce yönetildiği soruluyor.",
       "💡 Hatırlayalım: Refleksler omurilikte düşünmeden gerçekleşir. Duyuları algılama, düşünme, karar verme ve istemli hareketler beyinde yönetilir.",
       "✏️ 1) Düşünmeden eli çekme → refleks → omurilik.",
       "✏️ 2) Acıyı hissetme → duyunun algılanması → beyin. Bilgi beyne refleksten biraz sonra ulaştığı için acı bir an sonra hissedilir.",
       "✏️ 3) Düşünüp parmağı suya tutma → istemli hareket → beyin.",
       "✅ Sonuç: 1: omurilik – 2: beyin – 3: beyin.",
       "🔁 Kontrol edelim: Refleks bizi korumak için zaman kazandırır: Önce el çekilir, sonra acı hissedilir. Bu sıra, iki olayın farklı merkezlerde yönetildiğini gösterir."],
      { kural: "Refleks → omurilik; algılama, düşünme ve istemli hareket → beyin; denge → beyincik.", dogruNeden: "Eli düşünmeden çekmek omuriliğin yönettiği reflekstir; acıyı hissetmek ve düşünerek suya tutmak beyinde yönetilir." }),
  );

  SORU_EKLE("fden.hormon",
    Q("fden.hormon", "baglanti", 3, "Grafikte Ali ve Berk'in aynı kahvaltıyı yaptıktan sonraki saatlerde kanlarındaki şeker miktarının değişimi gösterilmiştir. Berk'te insülin hormonu ile ilgili bir sorun bulunmaktadır.<br>Grafiğe göre:<br>I. Kahvaltıdan sonra ikisinin de kan şekeri yükselmiştir.<br>II. Ali'nin kan şekeri, Berk'inkine göre daha kısa sürede normal düzeyine dönmüştür.<br>III. Ali'nin pankreası kan şekerini düzenleyecek kadar insülin üretiyor olabilir.<br><b>yargılarından hangileri doğrudur?</b>", "I, II ve III",
      [["I ve II", "kavrama", "III de doğrudur: İnsülin, pankreastan salgılanır ve kan şekerini düşürür. Ali'nin kan şekerinin hızla normale dönmesi, insülinin görevini yaptığını düşündürür."], ["Yalnız I", "dikkat", "II de doğrudur: Ali'nin kan şekeri 3. saatte başlangıç düzeyine dönmüştür; Berk'inki ise hâlâ yüksektir."], ["II ve III", "dikkat", "I de doğrudur: Grafikte iki çizgi de kahvaltıdan sonra 1. saate kadar yükseliyor."]],
      "Önce çizgilerin 0. ve 1. saatteki değerlerini, sonra 3. saatteki değerlerini karşılaştır. Kan şekerini düşüren hormon hangisidir?",
      ["🔎 Soruyu anlayalım: İki kişinin kahvaltı sonrası kan şekeri grafiğine bakarak üç yargıyı değerlendireceğiz.",
       "💡 Hatırlayalım: Pankreasın salgıladığı insülin hormonu, kandaki şekerin hücrelere geçmesini sağlayarak kan şekerini düşürür. İnsülin yetersizse ya da etkili olamıyorsa kan şekeri yüksek kalır (şeker hastalığı).",
       "✏️ I: 0. saatten 1. saate Ali 90 → 140, Berk 120 → 250 → ikisi de yükselmiş ✔",
       "✏️ II: 3. saatte Ali 90 (başlangıç düzeyi), Berk 210 (hâlâ yüksek) → Ali daha kısa sürede normale dönmüş ✔",
       "✏️ III: Ali'nin kan şekerinin hızla düşmesi insülinin yeterince üretilip görevini yaptığını düşündürür ✔",
       "✅ Sonuç: Üç yargı da doğrudur: I, II ve III.",
       "🔁 Kontrol edelim: Grafik sorularında “olabilir” ifadesi, verinin bir yargıyı desteklediğini anlatır. Ali'nin verisi insülinin düzgün çalıştığını destekliyor."],
      { gorsel: cizgi([{ ad: "Berk", noktalar: [[0, 120], [1, 250], [2, 230], [3, 210]], sinif: "g-ok-d" }, { ad: "Ali", noktalar: [[0, 90], [1, 140], [2, 100], [3, 90]], sinif: "g-ok-a" }], { xmax: 3, ymax: 300, xadim: 1, yadim: 50, xad: "Kahvaltıdan sonra geçen süre (saat)", yad: "Kan şekeri (mg/dL)" }), kural: "Pankreastan salgılanan insülin kan şekerini düşürür; insülin sorunu olan kişide kan şekeri uzun süre yüksek kalır.", dogruNeden: "İkisinin de kan şekeri yükselmiş, Ali'ninki insülin sayesinde kısa sürede normale dönmüş; Berk'inki ise yüksek kalmıştır." }),
    Q("fden.hormon", "aciklama", 2, "Okul gösterisinde sahneye çıkan Mert, perde açılır açılmaz heyecanlanıyor; kalbi hızla çarpmaya ve elleri terlemeye başlıyor. Gösteri bittikten sonra da kalbi birkaç dakika hızlı çarpmaya devam ediyor.<br>Bu durumla ilgili:<br>I. Kalbin hızlı çarpmasında böbrek üstü bezinden salgılanan hormonun etkisi vardır.<br>II. Hormonlar kan yoluyla taşındığı için etkileri sinirsel tepkilere göre daha uzun sürer.<br>III. İç salgı sistemi, sinir sisteminden daha hızlı tepki verir.<br><b>ifadelerinden hangileri doğrudur?</b>", "I ve II",
      [["Yalnız I", "kavrama", "II de doğrudur: Hormonlar kanla vücuda yayılır ve kandan temizlenmeleri zaman alır; bu yüzden etkileri daha uzun sürer. Gösteriden sonra kalbin hızlı çarpması bunu gösterir."], ["I ve III", "kavrama", "III yanlıştır: Sinir sistemi elektriksel uyarılarla çok hızlı tepki verir. Hormonlar kanla taşındığı için daha yavaş etki eder ama etkileri uzun sürer."], ["II ve III", "bilgi", "I doğrudur: Heyecan, korku ve stres anlarında böbrek üstü bezinden salgılanan hormon kalp atışını ve solunumu hızlandırır. III ise yanlıştır."]],
      "Heyecan anında hangi bez çalışır? Hormonlar vücuda nasıl taşınır; bu, etkinin süresini nasıl etkiler?",
      ["🔎 Soruyu anlayalım: Heyecanlanan Mert'in kalbinin gösteri bittikten sonra da hızlı çarpmasıyla ilgili üç ifadeyi değerlendireceğiz.",
       "💡 Hatırlayalım: Böbrek üstü bezi heyecan, korku ve stres anında kalp atışını ve solunumu hızlandıran hormon salgılar. Sinir sistemi hızlı ama kısa süreli; iç salgı sistemi daha yavaş ama uzun süreli etki eder.",
       "✏️ I: Heyecanla kalbin hızlanması böbrek üstü bezi hormonunun etkisidir ✔",
       "✏️ II: Hormon kanla taşınır ve bir süre kanda kalır; bu yüzden gösteri bitince de kalp hızlı çarpmayı sürdürür ✔",
       "✏️ III: En hızlı tepkiyi sinir sistemi verir; iç salgı sistemi daha yavaştır ✘",
       "✅ Sonuç: Doğru ifadeler I ve II'dir.",
       "🔁 Kontrol edelim: Sinir sistemi bir telefon araması gibi anında ulaşır; hormonlar ise posta gibi kanla taşınır, geç ulaşır ama etkisi uzun sürer."],
      { kural: "Sinir sistemi hızlı ve kısa süreli, iç salgı sistemi daha yavaş ve uzun süreli etki eder; böbrek üstü bezi heyecan anında kalbi hızlandırır.", dogruNeden: "Heyecanla salgılanan böbrek üstü bezi hormonu kanla taşınır ve etkisi uzun sürer; ancak iç salgı sistemi sinir sisteminden yavaştır." }),
  );

  SORU_EKLE("fden.ergenlik",
    Q("fden.ergenlik", "baglanti", 3, "Grafikte kızlarda ve erkeklerde yaşa göre bir yılda boyun ortalama kaç santimetre uzadığı gösterilmiştir.<br>Grafiğe göre:<br>I. Boy uzamasının en hızlı olduğu yaş kızlarda erkeklere göre daha küçüktür.<br>II. 14 yaşında erkeklerin bir yıllık boy uzaması kızlarınkinden fazladır.<br>III. Ergenlik dönemi kızlarda ve erkeklerde tam olarak aynı yaşta başlar.<br><b>yargılarından hangileri doğrudur?</b>", "I ve II",
      [["Yalnız I", "dikkat", "II de doğrudur: 14 yaşında erkeklerde yıllık uzama 8 cm, kızlarda 2 cm'dir."], ["I ve III", "kavrama", "Grafik, hızlı boy uzamasının kızlarda daha erken başladığını gösteriyor. Ergenlik kişiden kişiye ve cinsiyete göre farklı yaşlarda başlar; III yanlıştır."], ["I, II ve III", "kavrama", "III yanlıştır: Kızlarda en hızlı uzama 11, erkeklerde 13 yaştadır; ergenlik değişiklikleri aynı yaşta başlamaz."]],
      "Her iki çizginin tepe noktasının hangi yaşa denk geldiğini bul. Sonra 14 yaşındaki değerleri karşılaştır.",
      ["🔎 Soruyu anlayalım: Yaşa göre yıllık boy uzaması grafiğine bakarak üç yargıyı değerlendireceğiz.",
       "💡 Hatırlayalım: Ergenlikte boy hızla uzar. Ergenlik genellikle kızlarda erkeklerden daha erken başlar ve başlama yaşı kişiden kişiye değişir.",
       "✏️ I: Kızların çizgisi 11 yaşında (8 cm), erkeklerinki 13 yaşında (9 cm) en yüksek → kızlarda daha küçük yaşta ✔",
       "✏️ II: 14 yaşında erkekler 8 cm, kızlar 2 cm → erkeklerinki fazla ✔",
       "✏️ III: Tepe noktaları farklı yaşlarda; ergenlik aynı yaşta başlamaz ✘",
       "✅ Sonuç: Doğru yargılar I ve II'dir.",
       "🔁 Kontrol edelim: Bir arkadaşın senden önce ya da sonra uzamaya başlaması normaldir; ergenlikteki değişikliklerin zamanı herkeste farklıdır."],
      { gorsel: cizgi([{ ad: "Kız", noktalar: [[0, 5], [1, 5], [2, 6], [3, 8], [4, 7], [5, 4], [6, 2], [7, 1]], sinif: "g-ok-d" }, { ad: "Erkek", noktalar: [[0, 5], [1, 5], [2, 5], [3, 5], [4, 6], [5, 9], [6, 8], [7, 5]], sinif: "g-ok-a" }], { xmax: 7, ymax: 10, xadim: 1, yadim: 2, x0: 8, xad: "Yaş", yad: "Yıllık boy uzaması (cm)" }), kural: "Ergenlikte boy hızla uzar; ergenlik kızlarda genellikle daha erken başlar ve başlama yaşı kişiden kişiye değişir.", dogruNeden: "Kızlarda en hızlı uzama 11, erkeklerde 13 yaştadır ve 14 yaşında erkeklerin yıllık uzaması daha fazladır; ergenlik aynı yaşta başlamaz." }),
    Q("fden.ergenlik", "aciklama", 2, "Okul rehber öğretmeni, ergenlik dönemiyle ilgili bir sunumda şu bilgileri veriyor:<br>I. Bu dönemde ter ve yağ bezleri daha fazla çalışmaya başladığı için düzenli banyo yapmak ve temiz giysiler giymek önemlidir.<br>II. Ani duygu değişimleri ve kendini başkalarıyla kıyaslama bu dönemde sık görülür ve normaldir.<br>III. Ergenlik değişiklikleri herkeste aynı yaşta başlar ve aynı hızda ilerler.<br><b>Öğretmenin verdiği bilgilerden hangileri doğrudur?</b>", "I ve II",
      [["Yalnız I", "kavrama", "II de doğrudur: Ergenlikte bedensel değişikliklerin yanında duygusal (ruhsal) değişiklikler de görülür; bunlar bu dönemin doğal parçasıdır."], ["I ve III", "kavrama", "III yanlıştır: Ergenliğin başlama yaşı ve değişikliklerin hızı kişiden kişiye değişir."], ["I, II ve III", "kavrama", "III yanlıştır: Herkesin gelişim takvimi farklıdır; bir arkadaşının senden önce ya da sonra değişmesi normaldir."]],
      "Ergenlikte hem bedensel hem duygusal değişiklikler olur. Bu değişiklikler herkeste aynı zamanda mı başlar?",
      ["🔎 Soruyu anlayalım: Rehber öğretmenin ergenlikle ilgili üç bilgisinden doğru olanları seçeceğiz.",
       "💡 Hatırlayalım: Ergenlikte hormonların etkisiyle bedensel (boy uzaması, ter bezlerinin çalışması, ses değişimi) ve duygusal değişiklikler olur. Başlama zamanı kişiden kişiye farklıdır.",
       "✏️ I: Ter ve yağ bezleri daha çok çalışır; kişisel temizlik önem kazanır ✔",
       "✏️ II: Duygu değişimleri ve kıyaslama bu dönemde sık görülür ve doğaldır ✔",
       "✏️ III: Ergenlik herkeste farklı yaşta başlar ve farklı hızda ilerler ✘",
       "✅ Sonuç: Doğru bilgiler I ve II'dir.",
       "🔁 Kontrol edelim: Bu dönemde dengeli beslenmek, yeterli uyumak, spor yapmak ve duygularını güvendiğin yetişkinlerle paylaşmak denetleyici sistemlerin sağlığını korur."],
      { kural: "Ergenlikte bedensel ve duygusal değişiklikler olur; başlama yaşı ve hızı kişiden kişiye değişir.", dogruNeden: "Ergenlikte ter ve yağ bezleri daha çok çalışır ve duygusal dalgalanmalar normaldir; ancak değişiklikler herkeste aynı yaşta başlamaz." }),
  );
})();
