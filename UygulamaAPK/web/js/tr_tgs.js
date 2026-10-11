/* Türkçe — Türkiye Geneli Sınav (TGS) / deneme tarzı ek sorular (özgün).
 * Paragraflar, şiirler, diyaloglar ve tablolar bu dosya için özgün olarak yazılmıştır.
 */
(function () {
  "use strict";
  const { R, sec, karistir, od, ek, S, Q, G } = OGR;

  /* ======================= 1. TEMA — DİLİMİZİN ZENGİNLİĞİ ======================= */

  /* ---------- Bir Kelime Seyyahı ---------- */
  SORU_EKLE("trsey.anlam",
    Q("trsey.anlam", "uygulama", 2, "I. Annem pazardan iki kilo <b>elma</b> aldı.<br>II. Ablamın <b>tatlı</b> dili, küsen arkadaşlarını hemen barıştırır.<br>III. Matematik dersinde bir <b>açının</b> kenarlarını cetvelle çizdik.<br><br>Bu cümlelerde koyu yazılan sözcükler sırasıyla hangi anlamda kullanılmıştır?", "Gerçek – mecaz – terim",
      [["Mecaz – gerçek – terim", "kavrama", "“Elma” burada yenen meyvenin kendisidir, yani gerçek anlamdadır. “Tatlı dil” ise ağızdaki tadı değil, sevimli ve yumuşak konuşmayı anlatır; bu mecazdır."], ["Gerçek – terim – mecaz", "kavrama", "“Tatlı” bir bilim ya da sanat dalına ait değildir, bu yüzden terim olamaz. “Açı” ise matematiğe ait bir kavramdır; terimdir."], ["Terim – mecaz – gerçek", "kavrama", "“Elma” herkesin kullandığı günlük bir sözcüktür, bir bilim dalının terimi değildir. “Açı” ise matematik terimidir."]],
      "Her sözcük için sor: İlk akla gelen anlamı mı, benzetmeyle kazandığı yeni anlamı mı, yoksa bir ders ya da bilim dalına ait özel anlamı mı?",
      ["🔎 Soruyu anlayalım: Üç cümledeki koyu sözcüklerin anlamlarını sırasıyla bulacağız.",
       "💡 Hatırlayalım: Gerçek anlam, sözcüğün akla gelen ilk anlamıdır. Mecaz anlam, gerçek anlamından uzaklaşan yeni anlamdır. Terim anlam ise bir bilim, sanat ya da meslek dalına ait özel anlamdır.",
       "✏️ I. cümle: “Elma” yenen meyvenin kendisidir. → Gerçek anlam.",
       "✏️ II. cümle: Dilin tadı olmaz; “tatlı dil” sevimli, gönül alan konuşma demektir. → Mecaz anlam.",
       "✏️ III. cümle: “Açı”, matematik dersinde kullanılan özel bir kavramdır. → Terim anlam.",
       "✅ Sonuç: Sıralama “Gerçek – mecaz – terim” olur.",
       "🔁 Kontrol edelim: Terim anlamlı sözcüğü bulmak için “Bu sözcük hangi derse ait?” diye sor. Açı → matematik. Bu soru işini kolaylaştırır."],
      { kural: "Gerçek: ilk anlam. Mecaz: benzetmeyle kazanılan yeni anlam. Terim: bir bilim, sanat ya da meslek dalına ait anlam.", dogruNeden: "“Elma” meyvenin kendisi (gerçek), “tatlı dil” gönül alan konuşma (mecaz), “açı” ise matematik terimidir." }),
    Q("trsey.anlam", "uygulama", 2, "Aşağıdaki cümlelerin hangisinde koyu yazılan sözcük, ötekilerden <b>farklı</b> bir anlamda kullanılmıştır?", "Çocuklar havuzun derin bölümüne girmedi.",
      [["Komşumuz bize her zaman sıcak davranır.", "kavrama", "Buradaki “sıcak” sıcaklık derecesi değil, içten ve samimi davranış anlamındadır; yani mecazdır. Öteki iki seçenek de mecaz olduğu için bu seçenek farklı değildir."], ["Kardeşim ağır bir söz duyunca küstü.", "kavrama", "Sözün ağırlığı tartılamaz; “ağır söz” kırıcı söz demektir. Bu da mecaz anlamdır, yani ötekilerle aynı gruptadır."], ["Bu sorunun çözümü derin bir düşünceyi gerektiriyor.", "dikkat", "Burada “derin” ölçülebilen bir derinlik değil, “ayrıntılı, kapsamlı” düşünce anlamındadır; mecazdır. Aynı sözcüğün gerçek anlamda kullanıldığı başka bir seçenek var."]],
      "Önce her cümledeki koyu sözcüğün gerçek mi mecaz mı olduğunu işaretle. Tek kalan farklı olandır.",
      ["🔎 Soruyu anlayalım: Dört cümleden üçünde sözcükler aynı türde anlam taşıyor; farklı olanı bulacağız.",
       "💡 Hatırlayalım: Bir sözcük, gerçek anlamında ölçülebilen, görülebilen bir özelliği anlatır. Mecazda ise duygu ya da davranış gibi soyut bir şeyi anlatır.",
       "✏️ “Sıcak davranmak” → samimi olmak (mecaz). “Ağır söz” → kırıcı söz (mecaz).",
       "✏️ “Derin bir düşünce” → kapsamlı, ayrıntılı düşünce (mecaz).",
       "✏️ “Havuzun derin bölümü” → suyun dibinin uzak olduğu, ölçülebilen bölüm (gerçek).",
       "✅ Sonuç: Farklı olan, “derin” sözcüğünün gerçek anlamda kullanıldığı “Çocuklar havuzun derin bölümüne girmedi.” cümlesidir.",
       "🔁 Kontrol edelim: Aynı sözcük (derin) iki seçenekte farklı anlamlarda kullanılmış. Böyle sorularda sözcüğün kendisine değil, cümledeki anlamına bakmalısın."],
      { kural: "Bir sözcüğün anlamı cümleye göre değişir; ölçülebilen bir özellik anlatıyorsa gerçek, duygu ya da davranış anlatıyorsa çoğu zaman mecazdır.", dogruNeden: "Havuzun derin bölümü ölçülebilen gerçek bir derinliktir; öteki cümlelerdeki sözcükler mecaz anlamdadır." }),
  );

  SORU_EKLE("trsey.sozluk",
    Q("trsey.sozluk", "uygulama", 2, "Sözlükte “ağız” sözcüğü şöyle açıklanmıştır:<br><i>ağız (isim) <b>1.</b> Yüzde bulunan, yemek yemeye ve konuşmaya yarayan organ. <b>2.</b> Kap, şişe gibi şeylerin açık yeri. <b>3.</b> Bir bölgenin kendine özgü söyleyiş biçimi. <b>4.</b> Kesici araçların keskin yeri.</i><br><br>I. Dedem Karadeniz ağzıyla konuşunca hepimiz gülümsedik.<br>II. Su şişesinin ağzını sıkıca kapat.<br>III. Bıçağın ağzı körelmiş, ekmeği kesmiyor.<br><br>Bu cümlelerde sözlükteki anlamlardan hangisi <b>kullanılmamıştır</b>?", "1. anlam",
      [["2. anlam", "dikkat", "II. cümledeki “şişenin ağzı”, şişenin açık yeridir; yani 2. anlam kullanılmıştır."], ["3. anlam", "dikkat", "I. cümledeki “Karadeniz ağzı”, bir bölgenin söyleyiş biçimidir; 3. anlam kullanılmıştır."], ["4. anlam", "dikkat", "III. cümledeki “bıçağın ağzı”, bıçağın keskin yeridir; 4. anlam kullanılmıştır."]],
      "Her cümleyi sözlükteki numaralarla eşleştir. Hiçbir cümleyle eşleşmeyen numarayı bul.",
      ["🔎 Soruyu anlayalım: Sözlükte 4 anlam var, 3 cümle var. Cümlelerde karşılığı olmayan anlamı bulacağız.",
       "💡 Hatırlayalım: Çok anlamlı bir sözcüğün hangi anlamda kullanıldığını cümlenin bağlamı belirler.",
       "✏️ I. cümle: “Karadeniz ağzı” → bölgeye özgü söyleyiş → 3. anlam.",
       "✏️ II. cümle: “Şişenin ağzı” → şişenin açık yeri → 2. anlam. III. cümle: “Bıçağın ağzı” → keskin yeri → 4. anlam.",
       "✏️ Eşleşen numaralar: 2, 3, 4. Açıkta kalan numara: 1 (organ anlamı).",
       "✅ Sonuç: Cümlelerde kullanılmayan anlam 1. anlamdır.",
       "🔁 Kontrol edelim: Cümlelerin hiçbirinde yüzdeki organdan söz edilmiyor. Sözlük sorularında eşleştirdiğin numaraların üstünü çizmek hata yapmanı önler."],
      { kural: "Sözlük maddesindeki her anlamı cümlelerle tek tek eşleştir; açıkta kalan anlam cevaptır.", dogruNeden: "Cümlelerde ağız; bölgesel söyleyiş (3), şişenin açık yeri (2) ve bıçağın keskin yeri (4) anlamlarında kullanılmış, organ anlamı (1) kullanılmamıştır." }),
    Q("trsey.sozluk", "aciklama", 2, "<i>Köyün girişindeki eski değirmen yıllardır <b>atıl</b> duruyordu. Ne çarkı dönüyor ne de bir avuç un öğütülüyordu. Köylüler, değirmeni yeniden çalıştırmak için bir usta çağırmaya karar verdi.</i><br><br>Bu metinde koyu yazılan sözcüğün anlamı aşağıdakilerden hangisidir?", "Çalışmayan, kullanılmayan",
      [["Çok eski ve yıkık", "dikkat", "Değirmenin eski olduğu metinde “eski” sözcüğüyle zaten söylenmiş. “Atıl” sözcüğünün anlamını, hemen arkasından gelen “Ne çarkı dönüyor ne de un öğütülüyordu.” cümlesi açıklıyor."], ["Gürültülü ve kalabalık", "kavrama", "Çarkı dönmeyen, un öğütmeyen bir değirmen gürültülü olamaz. Bağlamla çelişen bir anlam seçmişsin."], ["Yeni yapılmış", "kavrama", "Metin değirmenin “eski” olduğunu ve yıllardır böyle durduğunu söylüyor; “yeni yapılmış” anlamı bağlama uymaz."]],
      "Bilmediğin sözcüğün hemen arkasındaki cümle, onu açıklıyor olabilir.",
      ["🔎 Soruyu anlayalım: “Atıl” sözcüğünün anlamını metnin yardımıyla bulacağız.",
       "💡 Hatırlayalım: Bilmediğimiz bir sözcüğün anlamını, çevresindeki cümlelerden (bağlamdan) tahmin edebiliriz.",
       "✏️ İpucu 1: “Ne çarkı dönüyor ne de bir avuç un öğütülüyordu.” → Değirmen iş görmüyor.",
       "✏️ İpucu 2: Köylüler onu “yeniden çalıştırmak” istiyor. → Demek ki şu an çalışmıyor.",
       "✅ Sonuç: “Atıl” sözcüğü, “çalışmayan, kullanılmayan” anlamındadır.",
       "🔁 Kontrol edelim: Sözcüğün yerine anlamını koyalım: “Değirmen yıllardır çalışmadan, kullanılmadan duruyordu.” Cümle anlamını korudu, demek ki doğru."],
      { kural: "Anlamını bilmediğin sözcüğün yerine bulduğun anlamı koy; cümle anlamlı kalıyorsa doğru bulmuşsundur.", dogruNeden: "Değirmenin çarkı dönmüyor, un öğütmüyor ve köylüler onu yeniden çalıştırmak istiyor; yani değirmen çalışmıyor." }),
  );

  SORU_EKLE("trsey.eszit",
    Q("trsey.eszit", "uygulama", 2, "<i>Çarşının en yaşlı ustası Hasan Efendi'ydi. İhtiyar usta her sabah dükkânını erkenden açar, genç çıraklarına sabırla iş öğretirdi. “Yavaş ama dikkatli çalışın.” derdi. Çıraklar da onun sakin hâlini çok severdi; çünkü usta hiçbir zaman telaşlı görünmezdi.</i><br><br>Bu metinle ilgili aşağıdaki yargılardan hangileri doğrudur?<br>I. “Yaşlı” ve “ihtiyar” sözcükleri eş anlamlıdır.<br>II. “Yaşlı” ve “genç” sözcükleri zıt anlamlıdır.<br>III. “Sakin” ve “telaşlı” sözcükleri eş anlamlıdır.", "I ve II",
      [["Yalnız I", "dikkat", "I doğru ama II de doğru: “yaşlı” ile “genç” birbirinin karşıtıdır. Öncüllerin hepsini kontrol etmeden seçeneğe geçme."], ["I ve III", "kavrama", "“Sakin” ile “telaşlı” aynı anlamı değil, karşıt anlamları taşır. Bu yüzden III yanlıştır."], ["I, II ve III", "kavrama", "III yanlıştır: Sakin bir insan telaşlı değildir. Bu iki sözcük zıt anlamlıdır, eş anlamlı değil."]],
      "Her öncüldeki iki sözcüğü yan yana koy: Aynı anlamı mı taşıyorlar, karşıt anlamı mı?",
      ["🔎 Soruyu anlayalım: Üç yargıdan hangilerinin doğru olduğunu bulacağız.",
       "💡 Hatırlayalım: Yazılışları farklı, anlamları aynı olan sözcükler eş anlamlıdır. Anlamca birbirinin karşıtı olan sözcükler zıt anlamlıdır.",
       "✏️ I: Yaşlı = ihtiyar. Aynı anlam → eş anlamlı. Doğru ✔",
       "✏️ II: Yaşlı ↔ genç. Karşıt anlam → zıt anlamlı. Doğru ✔",
       "✏️ III: Sakin ↔ telaşlı. Bunlar da karşıt anlamlıdır; “eş anlamlı” denmesi yanlış ✘",
       "✅ Sonuç: Doğru yargılar I ve II'dir.",
       "🔁 Kontrol edelim: Öncüllü sorularda her öncülün yanına ✔ ya da ✘ koy, sonra seçeneklere bak. Böylece “Yalnız I” gibi eksik seçeneklere düşmezsin."],
      { kural: "Eş anlamlı: aynı anlam (yaşlı–ihtiyar). Zıt anlamlı: karşıt anlam (yaşlı–genç, sakin–telaşlı).", dogruNeden: "Yaşlı ile ihtiyar eş anlamlı, yaşlı ile genç zıt anlamlıdır; sakin ile telaşlı ise eş değil zıt anlamlıdır." }),
    Q("trsey.eszit", "uygulama", 1, "Aşağıdaki cümlelerin hangisinde zıt anlamlı sözcükler bir arada <b>kullanılmamıştır</b>?", "Pazardan taze sebze ve meyve aldık, hepsini dolaba yerleştirdik.",
      [["Ağacın dalları ince, gövdesi ise oldukça kalındı.", "dikkat", "Bu cümlede “ince” ile “kalın” zıt anlamlıdır. Soru, zıt anlamlı sözcük bulunmayan cümleyi istiyor."], ["Alçak sesle konuşma, herkes duysun diye yüksek sesle oku.", "dikkat", "Bu cümlede “alçak” ile “yüksek” zıt anlamlıdır, yani cümlede zıt anlamlı sözcükler var."], ["Hızlı bir yürüyüşün ardından adımlarımızı yavaşlattık.", "dikkat", "“Hızlı” ile “yavaş(lattık)” karşıt anlamları taşır. Bu cümlede zıt anlam ilişkisi vardır."]],
      "Her cümlede birbirinin karşıtı olan iki sözcük ara. Hiç bulamadığın cümle cevaptır.",
      ["🔎 Soruyu anlayalım: Zıt anlamlı sözcüklerin BULUNMADIĞI cümleyi arıyoruz.",
       "💡 Hatırlayalım: Zıt anlamlı sözcükler birbirinin karşıtıdır: ince–kalın, alçak–yüksek, hızlı–yavaş.",
       "✏️ 1. cümle: ince ↔ kalın → zıt anlam var.",
       "✏️ 2. cümle: alçak ↔ yüksek → zıt anlam var. 3. cümle: hızlı ↔ yavaş → zıt anlam var.",
       "✏️ “Pazardan taze sebze ve meyve aldık…” cümlesinde birbirinin karşıtı olan iki sözcük yok. “Sebze” ile “meyve” karşıt değil, farklı türlerdir.",
       "✅ Sonuç: Zıt anlamlı sözcük bulunmayan cümle “Pazardan taze sebze ve meyve aldık, hepsini dolaba yerleştirdik.” cümlesidir.",
       "🔁 Kontrol edelim: “Sebze–meyve” gibi aynı gruptaki farklı şeyler zıt anlamlı sayılmaz. Zıt anlam için “biri varsa öteki olamaz” ilişkisi gerekir."],
      { kural: "İki sözcüğün zıt anlamlı olması için birbirinin karşıtı olması gerekir; aynı gruptaki farklı şeyler (sebze–meyve) zıt değildir.", dogruNeden: "Bu cümlede birbirinin karşıtı olan iki sözcük yoktur; öteki cümlelerde ince–kalın, alçak–yüksek, hızlı–yavaş vardır." }),
  );

  /* DEVAM */
})();
