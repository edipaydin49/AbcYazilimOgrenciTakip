/* 6. sınıf İngilizce — Theme 3 (Personal Life) ve Theme 4 (Family Life):
 * Body Parts, Appearance and Clothes · Personality and Character ·
 * Family Members' Jobs and Workplaces · Family Homes and Houses.
 */
(function () {
  "use strict";
  const { R, sec, karistir, S, Q, G } = OGR;

  /* Parametreli (S ile kurulan) soruların kısa çözümlerini 🔎 💡 ✏️ ✅ 🔁 biçiminde 5–7 adıma genişletir:
   * soruyu anlama, hatırlanacak bilgi, çeldiricilerin tek tek elenmesi, sonuç ve son çeldiriciyle kontrol. */
  function zengin(o) {
    if (!o || !Array.isArray(o.cozum) || o.cozum.length >= 5) return o;
    const nokta = t => /[.!?…:)”"]$/.test(String(t).trim()) ? String(t).trim() : String(t).trim() + ".";
    const goruldu = new Set([String(o.dogru)]), y = [];
    for (const w of o.yanlis || []) { const m = String(w[0]); if (!m || m === "NaN" || m === "undefined" || m === "null" || goruldu.has(m)) continue; goruldu.add(m); y.push(w); if (y.length === 3) break; }
    const s = o.cozum, n = s.length, out = ["🔎 Soruyu anlayalım: " + String(s[0]).replace(/^Soru:\s*/, "")];
    if (n >= 3) { out.push("💡 Hatırlayalım: " + s[1]); for (let i = 2; i <= n - 2; i++) out.push("✏️ " + s[i]); }
    else out.push("💡 Hatırlayalım: " + (o.kural || s[0]));
    const sonIcerir = String(s[n - 1]).toLocaleLowerCase("tr").includes(String(o.dogru).toLocaleLowerCase("tr").replace(/[.!?]$/, ""));
    if (!sonIcerir) out.push("✏️ " + s[n - 1]);
    y.slice(0, -1).forEach((w, i) => out.push((i === 0 ? "✏️ Seçenekleri tek tek inceleyelim: " : "✏️ ") + "“" + w[0] + "” → " + nokta(w[2])));
    out.push("✅ Sonuç: " + (sonIcerir ? String(s[n - 1]) : "Doğru cevap “" + o.dogru + "”.").replace(/^(Doğru cevap|Doğru cümle|Doğru seçenek|Doğru sıra|Doğru|Cevap)\s*:\s*/, ""));
    if (y.length) { const w = y[y.length - 1]; out.push("🔁 Kontrol edelim: Son seçenek “" + w[0] + "” de aradığımız cevap değil: " + nokta(w[2]) + " Geriye yalnızca “" + o.dogru + "” kalıyor."); }
    else out.push("🔁 Kontrol edelim: " + (o.kural || "Cevabı soruya yerleştirip yeniden oku."));
    o.cozum = out;
    if (!o.dogruNeden) o.dogruNeden = n >= 3 ? nokta(s[n - 2]) : nokta(o.kural || s[0]);
    return o;
  }

  /* ---------------------------- Ortak üreteçler ---------------------------- */
  /* Kelime anlamı: İngilizce → Türkçe ya da Türkçe → İngilizce (liste: [[en, tr], ...]). */
  /* Anlamı çok yakın kelimeler (ör. kind “nazik” – polite “kibar”) aynı soruda birlikte çıkmaz; tartışmalı soru oluşmasın. */
  const YAKIN = [["kind", "polite", "friendly"], ["calm", "patient"], ["funny", "cheerful"], ["short", "slim"], ["coat", "jacket"], ["hat", "cap"], ["boss", "businessman"], ["apartment", "floor"], ["cottage", "bungalow", "villa", "detached house"]];
  const yakinMi = (a, b) => YAKIN.some(g => g.includes(a) && g.includes(b));
  function kelimeSor(kaz, liste, kural) {
    return () => {
      const [en, tr] = sec(liste);
      const diger = karistir(liste.filter(x => x[0] !== en && x[1] !== tr && !yakinMi(en, x[0]))).slice(0, 3);
      if (Math.random() < 0.5) {
        return S(zengin({
          kaz, duzey: "hatirlama", zorluk: 1,
          soru: `What does “<b>${en}</b>” mean in Turkish?`, dogru: tr,
          yanlis: diger.map(d => [d[1], "bilgi", `“${d[1]}” İngilizcede “${d[0]}” demektir.`]),
          ipucu: "Kelimeyi kısa bir cümlede düşün ve resmini gözünün önüne getir.",
          cozum: [`Sorulan kelime: “${en}”.`, `“${en}” Türkçede “${tr}” anlamına gelir.`, `Diğer seçenekler başka kelimelerin karşılığıdır: ${diger.map(d => d[1] + " = " + d[0]).join(", ")}.`],
          kural,
        }));
      }
      return S(zengin({
        kaz, duzey: "hatirlama", zorluk: 1,
        soru: `Which word means “<b>${tr}</b>” in English?`, dogru: en,
        yanlis: diger.map(d => [d[0], "bilgi", `“${d[0]}” kelimesi “${d[1]}” demektir.`]),
        ipucu: "Türkçe kelimenin İngilizcesini hatırlamaya çalış; seçenekleri tek tek çevir.",
        cozum: [`Aranan anlam: “${tr}”.`, `Bunun İngilizcesi “${en}” kelimesidir.`, `Diğerleri: ${diger.map(d => d[0] + " = " + d[1]).join(", ")}.`],
        kural,
      }));
    };
  }

  /* Resimden kelime bulma (emoji). liste: [[emoji, kelime], ...] */
  function resimSor(kaz, liste, kural) {
    return () => {
      const [e, w] = sec(liste);
      const diger = karistir(liste.filter(x => x[1] !== w)).slice(0, 3);
      return S(zengin({
        kaz, duzey: "hatirlama", zorluk: 1,
        soru: `Look at the picture: ${e}<br>Which word matches the picture?`, dogru: w,
        yanlis: diger.map(d => [d[1], "dikkat", `“${d[1]}” şu resimle gösterilir: ${d[0]}`]),
        ipucu: "Resimdeki eşyayı nerede ve ne zaman kullandığını düşün.",
        cozum: [`Resimde ${e} görülüyor.`, `Bu eşyanın İngilizcesi “${w}”.`, "Diğer seçenekler başka eşyaları anlatıyor."],
        kural,
      }));
    };
  }

  /* ======================= 1) BODY PARTS, APPEARANCE AND CLOTHES ======================= */
  const VUCUT = [["head", "baş"], ["hair", "saç"], ["eye", "göz"], ["ear", "kulak"], ["nose", "burun"], ["mouth", "ağız"], ["arm", "kol"], ["hand", "el"], ["leg", "bacak"], ["foot", "ayak"], ["shoulder", "omuz"], ["knee", "diz"], ["finger", "parmak"], ["neck", "boyun"], ["tooth", "diş"], ["face", "yüz"]];
  const GORUNUS = [["tall", "uzun boylu"], ["short", "kısa boylu"], ["slim", "zayıf, ince"], ["curly", "kıvırcık"], ["straight", "düz (saç)"], ["wavy", "dalgalı"], ["blonde", "sarışın"], ["beard", "sakal"], ["moustache", "bıyık"], ["freckles", "çil"], ["well-built", "iri yapılı"]];
  const GIYSI = [["coat", "palto, mont"], ["scarf", "atkı"], ["gloves", "eldiven"], ["boots", "bot, çizme"], ["raincoat", "yağmurluk"], ["sunglasses", "güneş gözlüğü"], ["shorts", "şort"], ["T-shirt", "tişört"], ["jeans", "kot pantolon"], ["dress", "elbise"], ["skirt", "etek"], ["hat", "şapka"], ["cap", "kasket, kep"], ["sweater", "kazak"], ["jacket", "ceket"], ["trainers", "spor ayakkabı"], ["socks", "çorap"]];
  const GIYSI_RESIM = [["🧥", "coat"], ["🧣", "scarf"], ["🧤", "gloves"], ["👢", "boots"], ["🕶️", "sunglasses"], ["🩳", "shorts"], ["👕", "T-shirt"], ["👖", "jeans"], ["👗", "dress"], ["🧢", "cap"], ["👒", "hat"], ["🧦", "socks"], ["👟", "trainers"]];

  /* have got / has got üreteci */
  const OZNE = [["I", 0], ["You", 0], ["We", 0], ["They", 0], ["My parents", 0], ["The twins", 0], ["He", 1], ["She", 1], ["My sister", 1], ["Tom", 1], ["My grandad", 1], ["Elif", 1]];
  const OZELLIK = ["blue eyes", "long, curly hair", "short, straight hair", "big brown eyes", "freckles", "a small nose", "wavy, blonde hair", "dark hair", "green eyes"];
  function haveGot() {
    const [s, tekil] = sec(OZNE), oz = sec(OZELLIK), tur = R(0, 2);
    const kural = "I / you / we / they → have got (haven't got); he / she / it → has got (hasn't got). Soru: Have you got…? / Has she got…?";
    if (tur === 0) {
      const d = tekil ? "has got" : "have got";
      return S(zengin({
        kaz: "enapp.havegot", duzey: "uygulama", zorluk: 1,
        soru: `Complete the sentence: <b>${s} ___ ${oz}.</b>`, dogru: d,
        yanlis: [[tekil ? "have got" : "has got", "kavrama", tekil ? `“${s}” tekil 3. kişidir; “has got” gerekir.` : `“${s}” tekil 3. kişi değildir; “have got” gerekir.`], [tekil ? "is got" : "are got", "bilgi", "“have got” yapısında be fiili (am/is/are) kullanılmaz."], ["having got", "bilgi", "Geniş zaman cümlesinde -ing'li biçim kullanılmaz."]],
        ipucu: "Özne he / she / it gibi tekil 3. kişi mi?",
        cozum: [`Özne: “${s}”.`, tekil ? "Bu özne he / she gibi tekil 3. kişidir." : "Bu özne I / you / we / they grubundadır.", `Bu yüzden “${d}” kullanılır: ${s} ${d} ${oz}.`],
        kural,
      }));
    }
    if (tur === 1) {
      const d = tekil ? "hasn't got" : "haven't got";
      return S(zengin({
        kaz: "enapp.havegot", duzey: "uygulama", zorluk: 2,
        soru: `Make the sentence negative: <b>${s} ___ ${oz}.</b>`, dogru: d,
        yanlis: [[tekil ? "haven't got" : "hasn't got", "kavrama", "Olumsuzda da özneye göre have / has seçilir."], [tekil ? "doesn't got" : "don't got", "bilgi", "“have got” yapısı do / does ile olumsuz yapılmaz."], [tekil ? "isn't got" : "aren't got", "bilgi", "“have got” yapısında be fiili kullanılmaz."]],
        ipucu: "Olumsuz yapmak için have / has sonrasına “not” eklenir.",
        cozum: [`Özne: “${s}”.`, `Olumlu biçim: ${s} ${tekil ? "has" : "have"} got…`, `Olumsuz: ${s} ${d} ${oz}.`],
        kural,
      }));
    }
    const soz = s === "I" ? "you" : ["You", "We", "They", "He", "She"].includes(s) ? s.toLowerCase() : s, d = tekil ? "Has" : "Have";
    return S(zengin({
      kaz: "enapp.havegot", duzey: "uygulama", zorluk: 2,
      soru: `Complete the question: <b>___ ${soz} got ${oz}?</b>`, dogru: d,
      yanlis: [[tekil ? "Have" : "Has", "kavrama", "Soruda da özneye göre have / has seçilir."], [tekil ? "Does" : "Do", "bilgi", "“have got” sorusu do / does ile kurulmaz."], [tekil ? "Is" : "Are", "bilgi", "“have got” yapısında be fiili kullanılmaz."]],
      ipucu: "Soruda have / has cümlenin başına gelir.",
      cozum: [`Özne: “${soz}”.`, tekil ? "Tekil 3. kişi → has." : "I / you / we / they → have.", `Soru: ${d} ${soz} got ${oz}?`],
      kural,
    }));
  }

  KONU_EKLE("en", {
    id: "en_appearance", tema: "en3", ad: "Body Parts, Appearance and Clothes", tr: "Vücut, dış görünüş ve kıyafetler",
    kazanimlar: [
      { id: "enapp.body", ad: "Vücut bölümleri ve dış görünüş sıfatları" },
      { id: "enapp.havegot", ad: "have got / has got ile dış görünüşü anlatma" },
      { id: "enapp.clothes", ad: "Kıyafetler ve havaya uygun giyinme" },
      { id: "enapp.whose", ad: "Whose ile sahiplik sorma (Elif's, mine, his…)" },
    ],
    sozluk: [["head", "baş"], ["hair", "saç"], ["eye", "göz"], ["nose", "burun"], ["foot / feet", "ayak / ayaklar"], ["tall", "uzun boylu"], ["slim", "zayıf, ince"], ["curly", "kıvırcık"], ["straight", "düz (saç)"], ["beard", "sakal"],
      ["coat", "palto, mont"], ["scarf", "atkı"], ["gloves", "eldiven"], ["boots", "bot, çizme"], ["raincoat", "yağmurluk"], ["sunglasses", "güneş gözlüğü"], ["shorts", "şort"], ["T-shirt", "tişört"], ["jeans", "kot pantolon"], ["dress", "elbise"],
      ["skirt", "etek"], ["sweater", "kazak"], ["jacket", "ceket"], ["trainers", "spor ayakkabı"], ["socks", "çorap"]],
    anlatim: [
      {
        baslik: "Vücut bölümleri ve dış görünüş",
        metin: "Vücut bölümlerini öğrenirken düzensiz çoğullara dikkat et: <b>a foot → two feet</b>, <b>a tooth → teeth</b>. Birini tarif ederken boy (<b>tall, short</b>), yapı (<b>slim, well-built</b>), saç biçimi (<b>long, short, curly, straight, wavy</b>) ve renk (<b>blonde, brown, black, red</b>) sıfatlarını kullanırız. Birden fazla sıfatta sıra genellikle şöyledir: uzunluk + biçim + renk + isim → <b>long, curly, black hair</b>. “hair” sayılamaz bir isimdir: <b>She has got long hair.</b> (long hairs değil).",
        ornek: "<b>My uncle is tall and slim. He has got short, black hair and a beard.</b> — Amcam uzun boylu ve zayıf. Kısa, siyah saçları ve sakalı var.",
        durak: { soru: "“foot” (ayak) kelimesinin çoğulu hangisidir?", secenekler: [["feet", true, "Doğru! foot düzensiz bir isimdir: one foot, two feet."], ["foots", false, "foot düzensizdir; -s almaz."], ["feets", false, "feet zaten çoğuldur; ayrıca -s almaz."], ["footes", false, "Böyle bir biçim yoktur."]] },
      },
      {
        baslik: "have got / has got",
        metin: "Sahip olduğumuz fiziksel özellikleri anlatırken <b>have got</b> kullanırız. <b>I / you / we / they + have got</b>, <b>he / she / it + has got</b>. Kısaltmalar: I've got, she's got. Olumsuz: <b>haven't got / hasn't got</b>. Soru: <b>Have you got…? — Yes, I have. / No, I haven't.</b> <b>Has she got…? — Yes, she has. / No, she hasn't.</b> Dikkat: Boy ve yapı için <b>be</b> kullanılır: <b>He is tall.</b> (He has got tall değil).",
        ornek: "<b>Has your sister got blue eyes? — No, she hasn't. She's got brown eyes.</b>",
        durak: { soru: "Hangi seçenek boşluğa uyar? “My brother ___ blue eyes.”", secenekler: [["has got", true, "Doğru! my brother = he → has got."], ["have got", false, "he / she / it ile “has got” kullanılır."], ["is got", false, "“have got” yapısında be fiili olmaz."], ["are", false, "Göz rengi için “has got” kullanılır."]] },
      },
      {
        baslik: "Kıyafetler, hava durumu ve Whose",
        metin: "Soğuk ve karlı havada <b>a coat, a scarf, gloves, boots, a sweater</b>; yağmurlu havada <b>a raincoat</b> ve şemsiye (<b>an umbrella</b>); sıcak ve güneşli havada <b>shorts, a T-shirt, a cap, sunglasses</b> giyeriz. <b>jeans, shorts, sunglasses, gloves, socks, trainers</b> hep çoğul kullanılır: <b>My jeans are blue.</b> Sahipliği sormak için <b>Whose</b> (kimin) kullanılır: <b>Whose scarf is this? — It's Elif's. / It's mine.</b> Sahiplik zamirleri: <b>mine, yours, his, hers, ours, theirs</b>. <b>Whose</b> ile <b>Who's</b> (= Who is) karıştırılmamalıdır.",
        ornek: "<b>It's snowy today. Put on your coat and gloves! — Whose gloves are these? — They're Ali's.</b>",
        durak: { soru: "Boşluğa ne gelir? “— ___ jacket is this? — It's Murat's.”", secenekler: [["Whose", true, "Doğru! “Kimin?” sorusu Whose ile sorulur."], ["Who's", false, "Who's = Who is; sahiplik sormaz."], ["Who", false, "Who “kim” demektir; “kimin” için Whose gerekir."], ["Which", false, "Which “hangisi” demektir; cevap bir kişinin eşyası olduğu için Whose gerekir."]] },
      },
    ],
    uret: {
      "enapp.body": [
        kelimeSor("enapp.body", VUCUT, "Vücut bölümleri: head, face, eye, ear, nose, mouth, neck, shoulder, arm, hand, finger, leg, knee, foot."),
        kelimeSor("enapp.body", GORUNUS, "Dış görünüş: tall / short, slim / well-built, curly / straight / wavy hair, a beard, a moustache, freckles."),
        Q("enapp.body", "uygulama", 1, "Complete the sentence: <b>We see with our ___.</b>", "eyes",
          [["ears", "bilgi", "Kulaklarla (ears) duyarız."], ["hands", "bilgi", "Ellerle (hands) tutarız."], ["feet", "bilgi", "Ayaklarla (feet) yürürüz."]],
          "“see” görmek demektir.", [
           "🔎 Soruyu anlayalım: “see” = görmek.",
           "💡 Hatırlayalım: Görme organı gözdür: eye.",
           "✏️ Seçenekleri tek tek inceleyelim: “ears” → Kulaklarla (ears) duyarız.",
           "✏️ “hands” → Ellerle (hands) tutarız.",
           "✅ Sonuç: Çoğul: We see with our eyes.",
           "🔁 Kontrol edelim: Son seçenek “feet” de aradığımız cevap değil: Ayaklarla (feet) yürürüz. Geriye yalnızca “eyes” kalıyor."],
          { kural: "We see with our eyes, hear with our ears, smell with our nose, walk with our feet.", dogruNeden: "Görme organı gözdür: eye." }),
        Q("enapp.body", "uygulama", 2, "Which sentence is correct?", "My grandma has got short, curly, grey hair.",
          [["My grandma has got grey, curly, short hair.", "dikkat", "Sıfat sırası: uzunluk + biçim + renk; renk en sona yakın gelir."], ["My grandma has got short, curly, grey hairs.", "kavrama", "Baştaki saçlar için “hair” sayılamaz; “hairs” denmez."], ["My grandma have got short, curly, grey hair.", "kavrama", "my grandma = she → has got."]],
          "Sıfat sırası ve “hair” kelimesinin tekil olmasına dikkat et.", [
           "🔎 Soruyu anlayalım: Özne my grandma (she) → has got.",
           "💡 Hatırlayalım: Sıfat sırası: short (uzunluk), curly (biçim), grey (renk).",
           "✏️ hair sayılamaz: short, curly, grey hair.",
           "✏️ Seçenekleri tek tek inceleyelim: “My grandma has got grey, curly, short hair.” → Sıfat sırası: uzunluk + biçim + renk; renk en sona yakın gelir.",
           "✏️ “My grandma has got short, curly, grey hairs.” → Baştaki saçlar için “hair” sayılamaz; “hairs” denmez.",
           "✅ Sonuç: Doğru cevap “My grandma has got short, curly, grey hair.”.",
           "🔁 Kontrol edelim: Son seçenek “My grandma have got short, curly, grey hair.” de aradığımız cevap değil: my grandma = she → has got. Geriye yalnızca “My grandma has got short, curly, grey hair.” kalıyor."],
          { kural: "Uzunluk + biçim + renk + hair: long, straight, black hair.", dogruNeden: "Sıfat sırası: short (uzunluk), curly (biçim), grey (renk)." }),
        Q("enapp.body", "aciklama", 1, "Which one is <b>NOT</b> a body part?", "jacket",
          [["knee", "bilgi", "knee (diz) bir vücut bölümüdür."], ["shoulder", "bilgi", "shoulder (omuz) bir vücut bölümüdür."], ["neck", "bilgi", "neck (boyun) bir vücut bölümüdür."]],
          "Seçeneklerden hangisi giyilen bir şey?", [
           "🔎 Soruyu anlayalım: knee = diz, shoulder = omuz, neck = boyun.",
           "💡 Hatırlayalım: jacket = ceket, bir kıyafettir.",
           "✏️ Seçenekleri tek tek inceleyelim: “knee” → knee (diz) bir vücut bölümüdür.",
           "✏️ “shoulder” → shoulder (omuz) bir vücut bölümüdür.",
           "✅ Sonuç: Vücut bölümü olmayan: jacket.",
           "🔁 Kontrol edelim: Son seçenek “neck” de aradığımız cevap değil: neck (boyun) bir vücut bölümüdür. Geriye yalnızca “jacket” kalıyor."],
          { kural: "Vücut bölümleri (body parts) ile kıyafetleri (clothes) karıştırma.", dogruNeden: "jacket = ceket, bir kıyafettir." }),
        Q("enapp.body", "uygulama", 2, "Read and answer.<br><i>Hi, I'm Zeynep. I'm eleven. I'm not very tall. I've got long, straight, brown hair and big green eyes. I've also got freckles on my nose.</i><br>Which is true about Zeynep?", "She has got freckles.",
          [["She is very tall.", "dikkat", "Metinde “I'm not very tall.” yazıyor."], ["She has got curly hair.", "dikkat", "Saçı “straight” yani düz."], ["She has got blue eyes.", "dikkat", "Gözleri “green” yani yeşil."]],
          "Her seçeneği metindeki cümleyle karşılaştır.", [
           "🔎 Soruyu anlayalım: Boyu: not very tall → çok uzun değil.",
           "💡 Hatırlayalım: Saçı: long, straight, brown; gözleri: big, green.",
           "✏️ Seçenekleri tek tek inceleyelim: “She is very tall.” → Metinde “I'm not very tall.” yazıyor.",
           "✏️ “She has got curly hair.” → Saçı “straight” yani düz.",
           "✅ Sonuç: “I've also got freckles” → Çilleri var. Doğru seçenek: She has got freckles.",
           "🔁 Kontrol edelim: Son seçenek “She has got blue eyes.” de aradığımız cevap değil: Gözleri “green” yani yeşil. Geriye yalnızca “She has got freckles.” kalıyor."],
          { kural: "Okuma sorularında her seçeneği metindeki bilgiyle tek tek karşılaştır.", dogruNeden: "Saçı: long, straight, brown; gözleri: big, green." }),
        Q("enapp.body", "uygulama", 2, "Look at the table. <b>Who is tall and has got short, black hair?</b>", "Kerem",
          [["Defne", "dikkat", "Defne uzun boylu ama saçı uzun ve sarı."], ["Burak", "dikkat", "Burak'ın saçı kısa ve siyah ama kendisi kısa boylu."], ["Selin", "dikkat", "Selin kısa boylu ve saçı kıvırcık, kahverengi."]],
          "İki bilgiyi birlikte kontrol et: boy ve saç.", [
           "🔎 Soruyu anlayalım: Tall olanlar: Kerem ve Defne.",
           "💡 Hatırlayalım: Bunlardan saçı short, black olan: Kerem.",
           "✏️ Seçenekleri tek tek inceleyelim: “Defne” → Defne uzun boylu ama saçı uzun ve sarı.",
           "✏️ “Burak” → Burak'ın saçı kısa ve siyah ama kendisi kısa boylu.",
           "✅ Sonuç: Kerem.",
           "🔁 Kontrol edelim: Son seçenek “Selin” de aradığımız cevap değil: Selin kısa boylu ve saçı kıvırcık, kahverengi. Geriye yalnızca “Kerem” kalıyor."],
          { gorsel: G.tablo(["Name", "Height", "Hair", "Eyes"], [["Kerem", "tall", "short, black", "brown"], ["Defne", "tall", "long, blonde", "blue"], ["Burak", "short", "short, black", "green"], ["Selin", "short", "curly, brown", "brown"]]), kural: "Tablo sorularında tüm koşulları sağlayan satırı bul.", dogruNeden: "Bunlardan saçı short, black olan: Kerem." }),
      ],
      "enapp.havegot": [
        haveGot,
        haveGot,
        Q("enapp.havegot", "transfer", 1, "Complete the dialogue.<br>— Has your brother got a beard?<br>— ___ He's only twelve!", "No, he hasn't.",
          [["No, he hasn't got.", "bilgi", "Kısa cevapta “got” kullanılmaz: No, he hasn't."], ["No, he doesn't.", "kavrama", "Soru “Has…got” ile sorulduğu için cevap “hasn't” olur."], ["Yes, he has.", "dikkat", "On iki yaşındaki birinin sakalı olmaz; cevap olumsuz olmalı."]],
          "Kısa cevap, sorudaki yardımcı fiille verilir.", [
           "🔎 Soruyu anlayalım: Has your brother got…?",
           "💡 Hatırlayalım: Kısa cevap has ile verilir ve “got” eklenmez.",
           "✏️ Seçenekleri tek tek inceleyelim: “No, he hasn't got.” → Kısa cevapta “got” kullanılmaz: No, he hasn't.",
           "✏️ “No, he doesn't.” → Soru “Has…got” ile sorulduğu için cevap “hasn't” olur.",
           "✅ Sonuç: Kardeşi 12 yaşında olduğu için: No, he hasn't.",
           "🔁 Kontrol edelim: Son seçenek “Yes, he has.” de aradığımız cevap değil: On iki yaşındaki birinin sakalı olmaz; cevap olumsuz olmalı. Geriye yalnızca “No, he hasn't.” kalıyor."],
          { kural: "Has he got…? — Yes, he has. / No, he hasn't. (got kısa cevapta yoktur)", dogruNeden: "Kısa cevap has ile verilir ve “got” eklenmez." }),
        Q("enapp.havegot", "aciklama", 2, "Which sentence is correct?", "He is tall and he has got short hair.",
          [["He has got tall and he has got short hair.", "kavrama", "Boy için be kullanılır: He is tall."], ["He is tall and he is got short hair.", "bilgi", "“is got” yanlıştır: has got olmalı."], ["He is tall and he have got short hair.", "kavrama", "he → has got."]],
          "Boy için hangi fiil, saç için hangi yapı kullanılır?", [
           "🔎 Soruyu anlayalım: Boy ve yapı sıfatları be ile kullanılır: He is tall.",
           "💡 Hatırlayalım: Saç, göz gibi özellikler have / has got ile anlatılır.",
           "✏️ Seçenekleri tek tek inceleyelim: “He has got tall and he has got short hair.” → Boy için be kullanılır: He is tall.",
           "✏️ “He is tall and he is got short hair.” → “is got” yanlıştır: has got olmalı.",
           "✅ Sonuç: He is tall and he has got short hair.",
           "🔁 Kontrol edelim: Son seçenek “He is tall and he have got short hair.” de aradığımız cevap değil: he → has got. Geriye yalnızca “He is tall and he has got short hair.” kalıyor."],
          { kural: "be + tall / short / slim; have got + hair / eyes / a beard.", dogruNeden: "Saç, göz gibi özellikler have / has got ile anlatılır." }),
        Q("enapp.havegot", "transfer", 2, "Ece describes her best friend: <i>“She's got long, red hair and blue eyes. She hasn't got glasses.”</i> Which picture is her friend?", "👩‍🦰 long red hair, blue eyes, no glasses",
          [["👩‍🦰 long red hair, blue eyes, glasses", "dikkat", "“She hasn't got glasses.” → Gözlüğü yok."], ["👱‍♀️ long blonde hair, blue eyes, no glasses", "dikkat", "Saçı “red” (kızıl), sarı değil."], ["👩‍🦰 short red hair, green eyes, no glasses", "dikkat", "Saçı uzun (long) ve gözleri mavi (blue)."]],
          "Olumlu ve olumsuz bilgileri ayrı ayrı işaretle.", [
           "🔎 Soruyu anlayalım: has got: long, red hair; blue eyes.",
           "💡 Hatırlayalım: hasn't got: glasses → gözlük yok.",
           "✏️ Bütün bilgilere uyan seçenek: long red hair, blue eyes, no glasses.",
           "✏️ Seçenekleri tek tek inceleyelim: “👩‍🦰 long red hair, blue eyes, glasses” → “She hasn't got glasses.” → Gözlüğü yok.",
           "✏️ “👱‍♀️ long blonde hair, blue eyes, no glasses” → Saçı “red” (kızıl), sarı değil.",
           "✅ Sonuç: Doğru cevap “👩‍🦰 long red hair, blue eyes, no glasses”.",
           "🔁 Kontrol edelim: Son seçenek “👩‍🦰 short red hair, green eyes, no glasses” de aradığımız cevap değil: Saçı uzun (long) ve gözleri mavi (blue). Geriye yalnızca “👩‍🦰 long red hair, blue eyes, no glasses” kalıyor."],
          { kural: "hasn't got = sahip değil (olumsuz).", dogruNeden: "hasn't got: glasses → gözlük yok." }),
        Q("enapp.havegot", "uygulama", 1, "Choose the correct short form: <b>They have got a big dog.</b>", "They've got a big dog.",
          [["They's got a big dog.", "kavrama", "’s = has; they ile has kullanılmaz."], ["Theyve got a big dog.", "dikkat", "Kısaltmada kesme işareti (’) unutulmamalı."], ["They're got a big dog.", "bilgi", "’re = are; have got yapısı are ile kurulmaz."]],
          "have kısaltılınca ’ve olur.", [
           "🔎 Soruyu anlayalım: have → ’ve, has → ’s.",
           "💡 Hatırlayalım: They have got → They've got.",
           "✏️ Seçenekleri tek tek inceleyelim: “They's got a big dog.” → ’s = has; they ile has kullanılmaz.",
           "✏️ “Theyve got a big dog.” → Kısaltmada kesme işareti (’) unutulmamalı.",
           "✅ Sonuç: They've got a big dog.",
           "🔁 Kontrol edelim: Son seçenek “They're got a big dog.” de aradığımız cevap değil: ’re = are; have got yapısı are ile kurulmaz. Geriye yalnızca “They've got a big dog.” kalıyor."],
          { kural: "I've / you've / we've / they've got; he's / she's / it's got.", dogruNeden: "They have got → They've got." }),
      ],
      "enapp.clothes": [
        kelimeSor("enapp.clothes", GIYSI, "Kıyafetler: coat, scarf, gloves, boots, raincoat, sunglasses, shorts, T-shirt, jeans, dress, skirt, hat, cap, sweater, jacket, trainers, socks."),
        resimSor("enapp.clothes", GIYSI_RESIM, "Bazı kıyafetler hep çoğuldur: jeans, shorts, sunglasses, gloves, socks, trainers, boots."),
        Q("enapp.clothes", "transfer", 1, "❄️ It's snowy and freezing today. What should Ali wear?", "a coat, a scarf and gloves",
          [["shorts and a T-shirt", "strateji", "Şort ve tişört sıcak havada giyilir."], ["sunglasses and a cap", "strateji", "Güneş gözlüğü ve kep güneşli havaya uygundur."], ["a raincoat and sandals", "strateji", "Karlı ve dondurucu havada sandalet giyilmez; sıcak tutan giysiler gerekir."]],
          "freezing = dondurucu soğuk.", [
           "🔎 Soruyu anlayalım: Hava karlı (snowy) ve çok soğuk (freezing).",
           "💡 Hatırlayalım: Vücudu sıcak tutan giysiler gerekir.",
           "✏️ Seçenekleri tek tek inceleyelim: “shorts and a T-shirt” → Şort ve tişört sıcak havada giyilir.",
           "✏️ “sunglasses and a cap” → Güneş gözlüğü ve kep güneşli havaya uygundur.",
           "✅ Sonuç: a coat, a scarf and gloves.",
           "🔁 Kontrol edelim: Son seçenek “a raincoat and sandals” de aradığımız cevap değil: Karlı ve dondurucu havada sandalet giyilmez; sıcak tutan giysiler gerekir. Geriye yalnızca “a coat, a scarf and gloves” kalıyor."],
          { kural: "Cold / snowy → coat, scarf, gloves, boots; rainy → raincoat, umbrella; hot / sunny → shorts, T-shirt, sunglasses, cap.", dogruNeden: "Vücudu sıcak tutan giysiler gerekir." }),
        Q("enapp.clothes", "transfer", 1, "☀️ It's hot and sunny. We are going to the beach. What do we need?", "sunglasses, shorts and a cap",
          [["a coat and boots", "strateji", "Palto ve bot soğuk hava içindir."], ["a scarf and gloves", "strateji", "Atkı ve eldiven kış giysileridir."], ["a raincoat and a sweater", "strateji", "Yağmurluk yağmurlu, kazak soğuk havada giyilir."]],
          "Sıcak ve güneşli havada ne giyersin?", [
           "🔎 Soruyu anlayalım: Hava sıcak (hot) ve güneşli (sunny).",
           "💡 Hatırlayalım: Güneşten korunmak için güneş gözlüğü ve kep, serin kalmak için şort giyeriz.",
           "✏️ Seçenekleri tek tek inceleyelim: “a coat and boots” → Palto ve bot soğuk hava içindir.",
           "✏️ “a scarf and gloves” → Atkı ve eldiven kış giysileridir.",
           "✅ Sonuç: sunglasses, shorts and a cap.",
           "🔁 Kontrol edelim: Son seçenek “a raincoat and a sweater” de aradığımız cevap değil: Yağmurluk yağmurlu, kazak soğuk havada giyilir. Geriye yalnızca “sunglasses, shorts and a cap” kalıyor."],
          { kural: "Hot / sunny → shorts, T-shirt, sunglasses, a cap, a hat.", dogruNeden: "Güneşten korunmak için güneş gözlüğü ve kep, serin kalmak için şort giyeriz." }),
        Q("enapp.clothes", "uygulama", 2, "Look at the weather table. <b>On which day does Can need a raincoat?</b>", "Wednesday",
          [["Monday", "dikkat", "Pazartesi hava güneşli; yağmurluk gerekmez."], ["Tuesday", "dikkat", "Salı hava karlı; bot ve palto gerekir."], ["Thursday", "dikkat", "Perşembe hava rüzgârlı ve bulutlu; yağmur yok."]],
          "raincoat = yağmurluk. Hangi gün yağmurlu?", [
           "🔎 Soruyu anlayalım: Yağmurluk yağmurlu (rainy) havada giyilir.",
           "💡 Hatırlayalım: Tabloda rainy olan gün Wednesday.",
           "✏️ Seçenekleri tek tek inceleyelim: “Monday” → Pazartesi hava güneşli; yağmurluk gerekmez.",
           "✏️ “Tuesday” → Salı hava karlı; bot ve palto gerekir.",
           "✅ Sonuç: Wednesday.",
           "🔁 Kontrol edelim: Son seçenek “Thursday” de aradığımız cevap değil: Perşembe hava rüzgârlı ve bulutlu; yağmur yok. Geriye yalnızca “Wednesday” kalıyor."],
          { gorsel: G.tablo(["Day", "Weather"], [["Monday", "☀️ sunny"], ["Tuesday", "❄️ snowy"], ["Wednesday", "🌧️ rainy"], ["Thursday", "💨 windy and cloudy"]]), kural: "rainy → raincoat, umbrella, boots.", dogruNeden: "Tabloda rainy olan gün Wednesday." }),
        Q("enapp.clothes", "uygulama", 2, "Choose the correct sentence.", "My new jeans are blue.",
          [["My new jeans is blue.", "kavrama", "jeans hep çoğuldur; “are” ile kullanılır."], ["My new jean are blue.", "bilgi", "Kot pantolon her zaman “jeans” biçimindedir."], ["My new jeans are blues.", "kavrama", "Sıfatlar (renkler) çoğul eki almaz."]],
          "jeans tekil mi çoğul mu?", [
           "🔎 Soruyu anlayalım: jeans, shorts, sunglasses gibi kelimeler hep çoğuldur.",
           "💡 Hatırlayalım: Çoğul isimle “are” kullanılır.",
           "✏️ Seçenekleri tek tek inceleyelim: “My new jeans is blue.” → jeans hep çoğuldur; “are” ile kullanılır.",
           "✏️ “My new jean are blue.” → Kot pantolon her zaman “jeans” biçimindedir.",
           "✅ Sonuç: Renk sıfatı -s almaz: My new jeans are blue.",
           "🔁 Kontrol edelim: Son seçenek “My new jeans are blues.” de aradığımız cevap değil: Sıfatlar (renkler) çoğul eki almaz. Geriye yalnızca “My new jeans are blue.” kalıyor."],
          { kural: "jeans / shorts / trousers / sunglasses + are; a pair of jeans.", dogruNeden: "Çoğul isimle “are” kullanılır." }),
        Q("enapp.clothes", "baglanti", 2, "Read and answer.<br><i>Today is 29 October, Republic Day. Mert is going to the school ceremony. It's cold and windy, so he is wearing a white shirt, a warm sweater, a jacket and a red scarf.</i><br>Why is Mert wearing a jacket and a scarf?", "Because it's cold and windy.",
          [["Because it's hot and sunny.", "dikkat", "Metinde “It's cold and windy” yazıyor."], ["Because it's his birthday.", "dikkat", "Bugün Cumhuriyet Bayramı; doğum günü değil."], ["Because he is going to the beach.", "dikkat", "Mert okuldaki törene gidiyor."]],
          "“so” kelimesinden önceki bölüm sebebi verir.", [
           "🔎 Soruyu anlayalım: Metinde: It's cold and windy, so he is wearing…",
           "💡 Hatırlayalım: “so” (bu yüzden) sonucu bağlar; sebep ondan önceki bölümdür.",
           "✏️ Seçenekleri tek tek inceleyelim: “Because it's hot and sunny.” → Metinde “It's cold and windy” yazıyor.",
           "✏️ “Because it's his birthday.” → Bugün Cumhuriyet Bayramı; doğum günü değil.",
           "✅ Sonuç: Because it's cold and windy.",
           "🔁 Kontrol edelim: Son seçenek “Because he is going to the beach.” de aradığımız cevap değil: Mert okuldaki törene gidiyor. Geriye yalnızca “Because it's cold and windy.” kalıyor."],
          { kural: "so = bu yüzden (sonuç); because = çünkü (sebep).", dogruNeden: "“so” (bu yüzden) sonucu bağlar; sebep ondan önceki bölümdür." }),
      ],
      "enapp.whose": [
        Q("enapp.whose", "uygulama", 1, "Complete the question: <b>— ___ cap is this? — It's Emre's.</b>", "Whose",
          [["Who's", "kavrama", "Who's = Who is; “kimin” anlamı vermez."], ["Who", "kavrama", "Who “kim” demektir; sahiplik için Whose gerekir."], ["What", "bilgi", "What “ne” demektir; cevap bir kişinin eşyası olduğu için Whose kullanılır."]],
          "Cevapta “Emre's” (Emre'nin) var.", [
           "🔎 Soruyu anlayalım: Cevap bir sahiplik bildiriyor: Emre's.",
           "💡 Hatırlayalım: Sahiplik sorusu Whose (kimin) ile sorulur.",
           "✏️ Seçenekleri tek tek inceleyelim: “Who's” → Who's = Who is; “kimin” anlamı vermez.",
           "✏️ “Who” → Who “kim” demektir; sahiplik için Whose gerekir.",
           "✅ Sonuç: Whose cap is this? — It's Emre's.",
           "🔁 Kontrol edelim: Son seçenek “What” de aradığımız cevap değil: What “ne” demektir; cevap bir kişinin eşyası olduğu için Whose kullanılır. Geriye yalnızca “Whose” kalıyor."],
          { kural: "Whose + isim + is this / are these? → It's / They're + kişi + 's / mine…", dogruNeden: "Sahiplik sorusu Whose (kimin) ile sorulur." }),
        Q("enapp.whose", "uygulama", 1, "Complete: <b>— Whose sunglasses are these? — They're ___. (Ayşe)</b>", "Ayşe's",
          [["Ayşe", "bilgi", "Sahiplik için ismin sonuna ’s eklenir."], ["Ayşes", "dikkat", "Kesme işareti (’) unutulmuş."], ["Ayşe is", "kavrama", "Ayşe is = Ayşe … -dir; sahiplik bildirmez."]],
          "Türkçedeki “-nin” eki İngilizcede nasıl yapılır?", [
           "🔎 Soruyu anlayalım: Sahiplik ’s ile gösterilir.",
           "💡 Hatırlayalım: Ayşe + ’s → Ayşe's (Ayşe'nin).",
           "✏️ Seçenekleri tek tek inceleyelim: “Ayşe” → Sahiplik için ismin sonuna ’s eklenir.",
           "✏️ “Ayşes” → Kesme işareti (’) unutulmuş.",
           "✅ Sonuç: They're Ayşe's.",
           "🔁 Kontrol edelim: Son seçenek “Ayşe is” de aradığımız cevap değil: Ayşe is = Ayşe … -dir; sahiplik bildirmez. Geriye yalnızca “Ayşe's” kalıyor."],
          { kural: "Sahiplik: isim + ’s → Elif's bag, my dad's car.", dogruNeden: "Ayşe + ’s → Ayşe's (Ayşe'nin)." }),
        Q("enapp.whose", "uygulama", 2, "Choose the correct answer: <b>— Is this your scarf? — Yes, it's ___.</b>", "mine",
          [["my", "kavrama", "“my” kendinden sonra isim ister (my scarf); tek başına “mine” kullanılır."], ["me", "bilgi", "me nesne zamiridir; sahiplik bildirmez."], ["I", "bilgi", "I özne zamiridir."]],
          "Arkasından isim gelmiyorsa sahiplik zamiri kullanılır.", [
           "🔎 Soruyu anlayalım: Cümlede “it's ___.” ve arkasında isim yok.",
           "💡 Hatırlayalım: my + isim → my scarf; isim yoksa → mine.",
           "✏️ Seçenekleri tek tek inceleyelim: “my” → “my” kendinden sonra isim ister (my scarf); tek başına “mine” kullanılır.",
           "✏️ “me” → me nesne zamiridir; sahiplik bildirmez.",
           "✅ Sonuç: Yes, it's mine.",
           "🔁 Kontrol edelim: Son seçenek “I” de aradığımız cevap değil: I özne zamiridir. Geriye yalnızca “mine” kalıyor."],
          { kural: "my → mine, your → yours, his → his, her → hers, our → ours, their → theirs.", dogruNeden: "my + isim → my scarf; isim yoksa → mine." }),
        Q("enapp.whose", "transfer", 2, "Complete the dialogue.<br>— Whose trainers are these? Are they Kaan's?<br>— No, they aren't ___. Kaan's trainers are white. These are black.", "his",
          [["he", "bilgi", "he özne zamiridir; sahiplik bildirmez."], ["him", "bilgi", "him nesne zamiridir (Theme 1)."], ["hers", "dikkat", "Kaan erkek; hers “kızın / kadının” demektir."]],
          "Kaan bir erkek. “onunki” nasıl söylenir?", [
           "🔎 Soruyu anlayalım: Kaan = he.",
           "💡 Hatırlayalım: he için sahiplik zamiri “his” dir (his = onunki).",
           "✏️ Seçenekleri tek tek inceleyelim: “he” → he özne zamiridir; sahiplik bildirmez.",
           "✏️ “him” → him nesne zamiridir (Theme 1).",
           "✅ Sonuç: No, they aren't his.",
           "🔁 Kontrol edelim: Son seçenek “hers” de aradığımız cevap değil: Kaan erkek; hers “kızın / kadının” demektir. Geriye yalnızca “his” kalıyor."],
          { kural: "Sahiplik zamirleri: mine, yours, his, hers, ours, theirs.", dogruNeden: "he için sahiplik zamiri “his” dir (his = onunki)." }),
        Q("enapp.whose", "aciklama", 2, "Look at the table. <b>Whose is the red scarf?</b>", "It's Deniz's.",
          [["It's Ela's.", "dikkat", "Ela'nın eşyası mavi eldivenler."], ["They're Deniz's.", "kavrama", "scarf tekildir; “It's” kullanılır."], ["It's Arda's.", "dikkat", "Arda'nın eşyası siyah botlar."]],
          "Tabloda “red scarf” satırını bul.", [
           "🔎 Soruyu anlayalım: Red scarf → Deniz.",
           "💡 Hatırlayalım: scarf tekil olduğu için “It's” kullanılır.",
           "✏️ Seçenekleri tek tek inceleyelim: “It's Ela's.” → Ela'nın eşyası mavi eldivenler.",
           "✏️ “They're Deniz's.” → scarf tekildir; “It's” kullanılır.",
           "✅ Sonuç: It's Deniz's.",
           "🔁 Kontrol edelim: Son seçenek “It's Arda's.” de aradığımız cevap değil: Arda'nın eşyası siyah botlar. Geriye yalnızca “It's Deniz's.” kalıyor."],
          { gorsel: G.tablo(["Clothes", "Owner"], [["🧣 a red scarf", "Deniz"], ["🧤 blue gloves", "Ela"], ["👢 black boots", "Arda"]]), kural: "Tekil → It's Deniz's.; çoğul → They're Ela's.", dogruNeden: "scarf tekil olduğu için “It's” kullanılır." }),
        Q("enapp.whose", "baglanti", 2, "Which sentence is correct?", "This is my sister's dress.",
          [["This is my sisters dress.", "dikkat", "Sahiplik için kesme işareti gerekir: sister's."], ["This is my sister dress.", "bilgi", "Sahiplik ’s eki unutulmuş."], ["This is dress my sister's.", "kavrama", "Sıra: sahip + ’s + eşya: my sister's dress."]],
          "Sahip + ’s + eşya sırasını hatırla (Theme 1).", [
           "🔎 Soruyu anlayalım: Sahip: my sister; eşya: dress.",
           "💡 Hatırlayalım: Sahip + ’s + eşya → my sister's dress.",
           "✏️ Seçenekleri tek tek inceleyelim: “This is my sisters dress.” → Sahiplik için kesme işareti gerekir: sister's.",
           "✏️ “This is my sister dress.” → Sahiplik ’s eki unutulmuş.",
           "✅ Sonuç: This is my sister's dress.",
           "🔁 Kontrol edelim: Son seçenek “This is dress my sister's.” de aradığımız cevap değil: Sıra: sahip + ’s + eşya: my sister's dress. Geriye yalnızca “This is my sister's dress.” kalıyor."],
          { kural: "Possessive ’s: Ali's book, my mum's coat.", dogruNeden: "Sahip + ’s + eşya → my sister's dress." }),
      ],
    },
  });

  /* ======================= 2) PERSONALITY AND CHARACTER ======================= */
  const KARAKTER = [["friendly", "arkadaş canlısı"], ["generous", "cömert"], ["lazy", "tembel"], ["honest", "dürüst"], ["hard-working", "çalışkan"], ["kind", "nazik, iyi kalpli"], ["funny", "komik"], ["shy", "utangaç"], ["rude", "kaba"], ["selfish", "bencil"], ["patient", "sabırlı"], ["brave", "cesur"], ["clever", "zeki"], ["helpful", "yardımsever"], ["talkative", "konuşkan"], ["polite", "kibar"], ["calm", "sakin"], ["cheerful", "neşeli"]];

  /* Karşılaştırma sıfatları: [sıfat, comparative, superlative, tür] */
  const SIFAT = [
    ["tall", "taller", "the tallest", "er"], ["short", "shorter", "the shortest", "er"], ["strong", "stronger", "the strongest", "er"], ["old", "older", "the oldest", "er"], ["young", "younger", "the youngest", "er"], ["fast", "faster", "the fastest", "er"],
    ["big", "bigger", "the biggest", "cift"], ["slim", "slimmer", "the slimmest", "cift"],
    ["funny", "funnier", "the funniest", "y"], ["lazy", "lazier", "the laziest", "y"], ["happy", "happier", "the happiest", "y"], ["noisy", "noisier", "the noisiest", "y"],
    ["generous", "more generous", "the most generous", "more"], ["honest", "more honest", "the most honest", "more"], ["hard-working", "more hard-working", "the most hard-working", "more"], ["patient", "more patient", "the most patient", "more"], ["helpful", "more helpful", "the most helpful", "more"], ["talkative", "more talkative", "the most talkative", "more"],
    ["good", "better", "the best", "irr"], ["bad", "worse", "the worst", "irr"],
  ];
  const KISI = ["My brother", "My sister", "Elif", "Can", "My cousin Deniz", "Mert", "Our teacher", "My uncle"];
  const KARS_KURAL = "Kısa sıfat + -er (taller); -y → -ier (funnier); kısa ünlü + ünsüz → harf ikizleşir (bigger); uzun sıfat → more (more generous); good → better, bad → worse.";
  const ENUST_KURAL = "the + kısa sıfat + -est (the tallest); -y → -iest (the funniest); uzun sıfat → the most (the most generous); good → the best, bad → the worst.";

  function karsilastir() {
    const [a, c, , t] = sec(SIFAT);
    const [k1, k2] = karistir(KISI).slice(0, 2);
    const ozel = { good: ["My new phone", "my old one"], bad: ["The weather today", "yesterday"], big: ["An elephant", "a horse"] }[a];
    const cumle = ozel ? `${ozel[0]} is ___ than ${ozel[1]}. (${a})` : `${k1} is ___ than ${k2.replace(/^(My|Our) /, w => w.toLowerCase())}. (${a})`;
    const yanlis = {
      er: [[`more ${a}`, "kavrama", `“${a}” kısa bir sıfattır; “more” değil -er eki alır.`], [`more ${c}`, "kavrama", "-er eki ile “more” birlikte kullanılmaz."], [`the ${a}est`, "kavrama", "İki kişi karşılaştırılırken (than) en üstünlük biçimi kullanılmaz."]],
      cift: [[`${a}er`, "dikkat", `Kısa ünlü + tek ünsüzle biten sıfatlarda son harf ikizleşir: ${c}.`], [`more ${a}`, "kavrama", `“${a}” kısa bir sıfattır; -er eki alır.`], [`the ${c.replace("er", "est")}`, "kavrama", "than ile comparative (karşılaştırma) biçimi kullanılır."]],
      y: [[`${a}er`, "dikkat", `-y ile biten sıfatlarda y → i olur: ${c}.`], [`more ${c}`, "kavrama", "-er eki ile “more” birlikte kullanılmaz."], [`the ${a.slice(0, -1)}iest`, "kavrama", "than ile comparative (karşılaştırma) biçimi kullanılır."]],
      more: [[`${a}er`, "kavrama", `“${a}” uzun bir sıfattır; -er değil “more” alır.`], [`more ${a}er`, "kavrama", "“more” ile -er birlikte kullanılmaz."], [`the most ${a}`, "kavrama", "than ile comparative (more …) kullanılır."]],
      irr: [[a === "good" ? "gooder" : "badder", "bilgi", `“${a}” düzensizdir: ${c}.`], [`more ${a}`, "bilgi", `“${a}” düzensizdir; more almaz.`], [a === "good" ? "the best" : "the worst", "kavrama", "than ile comparative biçimi kullanılır."]],
    }[t];
    return S(zengin({
      kaz: "enper.compare", duzey: "uygulama", zorluk: t === "er" ? 1 : 2,
      soru: `Complete the sentence: <b>${cumle}</b>`, dogru: c, yanlis,
      ipucu: "Cümlede “than” var mı? Sıfat kısa mı, uzun mu, düzensiz mi?",
      cozum: ["“than” iki şeyi karşılaştırdığımızı gösterir → comparative.", t === "irr" ? `“${a}” düzensiz bir sıfattır: ${a} → ${c}.` : t === "more" ? `“${a}” uzun bir sıfattır → more ${a}.` : t === "y" ? `“${a}” -y ile biter → y düşer, -ier eklenir: ${c}.` : t === "cift" ? `“${a}” kısa ünlü + ünsüzle biter → son harf ikizleşir: ${c}.` : `“${a}” kısa bir sıfattır → -er eklenir: ${c}.`, `Cümle: ${cumle.replace("___", c).replace(/ \(.*\)$/, "")}`],
      kural: KARS_KURAL,
    }));
  }

  function enUstun() {
    const [a, , s, t] = sec(SIFAT);
    const k = sec(["My brother", "My sister", "My cousin Deniz", "My uncle", "My aunt Nur", "My dad"]);
    const ozel = { good: "This is ___ film of the year. (good)", bad: "That was ___ day of my holiday. (bad)", big: "Jupiter is ___ planet in our solar system. (big)", old: "My great-grandma is ___ person in our family. (old)" }[a];
    const cumle = ozel || `${k} is ___ person in my family. (${a})`;
    const kok = s.replace(/^the (most )?/, "");
    const yanlis = {
      er: [[`the ${a}er`, "kavrama", "en üstünlükte -est eki kullanılır."], [`the most ${a}`, "kavrama", `“${a}” kısa bir sıfattır; “most” değil -est alır.`], [kok, "dikkat", "En üstünlük sıfatından önce “the” gelir."]],
      cift: [[`the ${a}est`, "dikkat", `Son harf ikizleşir: ${s}.`], [`the most ${a}`, "kavrama", `“${a}” kısa bir sıfattır; -est alır.`], [`the ${a}${a.slice(-1)}er`, "kavrama", "En üstünlükte -est eki kullanılır."]],
      y: [[`the ${a}est`, "dikkat", `-y ile biten sıfatlarda y → i olur: ${s}.`], [`the ${a.slice(0, -1)}ier`, "kavrama", "En üstünlükte -est eki kullanılır."], [`the most ${a.slice(0, -1)}iest`, "kavrama", "-est eki ile “most” birlikte kullanılmaz."]],
      more: [[`the ${a}est`, "kavrama", `“${a}” uzun bir sıfattır; “the most” ile kullanılır.`], [`the more ${a}`, "kavrama", "En üstünlükte “more” değil “most” kullanılır."], [`most ${a}`, "dikkat", "En üstünlük sıfatından önce “the” gelir."]],
      irr: [[a === "good" ? "the goodest" : "the baddest", "bilgi", `“${a}” düzensizdir: ${s}.`], [a === "good" ? "the better" : "the worse", "kavrama", "better / worse karşılaştırma biçimidir; en üstünlük: the best / the worst."], [`the most ${a}`, "bilgi", `“${a}” düzensizdir; most almaz.`]],
    }[t];
    return S(zengin({
      kaz: "enper.super", duzey: "uygulama", zorluk: t === "er" ? 1 : 2,
      soru: `Complete the sentence: <b>${cumle}</b>`, dogru: s, yanlis,
      ipucu: "Bir grubun içinde “en …” olanı anlatıyoruz. Sıfat kısa mı, uzun mu, düzensiz mi?",
      cozum: ["Cümle bir grup içinde “en …” olanı anlatıyor → superlative.", t === "irr" ? `“${a}” düzensizdir: ${s}.` : t === "more" ? `“${a}” uzun bir sıfattır → the most ${a}.` : t === "y" ? `-y → -iest: ${s}.` : t === "cift" ? `Son harf ikizleşir: ${s}.` : `Kısa sıfat → the + -est: ${s}.`, `Cümle: ${cumle.replace("___", s).replace(/ \(.*\)$/, "")}`],
      kural: ENUST_KURAL,
    }));
  }

  KONU_EKLE("en", {
    id: "en_personality", tema: "en3", ad: "Personality and Character", tr: "Kişilik ve karakter",
    kazanimlar: [
      { id: "enper.adj", ad: "Kişilik ve karakter sıfatları" },
      { id: "enper.compare", ad: "Karşılaştırma: comparative (taller, more generous, better)" },
      { id: "enper.super", ad: "En üstünlük: superlative (the tallest, the most honest, the best)" },
      { id: "enper.tag", ad: "Question tags ile onay isteme (isn't she? / doesn't he?)" },
    ],
    sozluk: KARAKTER.slice(0, 18).concat([["comparative", "karşılaştırma (-er / more)"], ["superlative", "en üstünlük (-est / the most)"], ["personality", "kişilik"], ["character", "karakter"]]),
    anlatim: [
      {
        baslik: "Kişilik sıfatları",
        metin: "Birinin karakterini anlatırken <b>be</b> fiilini kullanırız: <b>She is friendly.</b> Olumlu özellikler: <b>friendly, kind, generous, honest, hard-working, patient, helpful, polite, brave, cheerful</b>. Olumsuz özellikler: <b>lazy, rude, selfish, impatient</b>. Bazı sıfatların zıtları ön ekle yapılır: <b>patient ↔ impatient, polite ↔ impolite, honest ↔ dishonest, kind ↔ unkind</b>. Bir özelliği yumuşatmak için <b>a bit</b>, güçlendirmek için <b>very / really</b> kullanırız: <b>He is a bit shy.</b>",
        ornek: "<b>My grandma is very generous. She always shares her food with the neighbours.</b> — Büyükannem çok cömerttir.",
        durak: { soru: "“He never tells lies.” (Asla yalan söylemez.) Bu kişi nasıl biridir?", secenekler: [["honest", true, "Doğru! Yalan söylemeyen kişi dürüsttür (honest)."], ["lazy", false, "lazy tembel demektir."], ["rude", false, "rude kaba demektir."], ["selfish", false, "selfish bencil demektir."]] },
      },
      {
        baslik: "Comparative: iki şeyi karşılaştırma",
        metin: "İki kişiyi ya da şeyi karşılaştırırken sıfatın karşılaştırma biçimini ve <b>than</b> kullanırız. Kısa sıfat + <b>-er</b>: <b>tall → taller</b>. <b>-y</b> ile bitenler: <b>funny → funnier</b>. Kısa ünlü + ünsüzle bitenler: <b>big → bigger, slim → slimmer</b>. Uzun sıfatlar: <b>generous → more generous</b>. Düzensizler: <b>good → better, bad → worse</b>. Dikkat: <b>more taller</b> gibi -er ile more birlikte kullanılmaz.",
        ornek: "<b>My brother is taller than me, but I am more patient than him.</b> — Ağabeyim benden uzun ama ben ondan sabırlıyım.",
        durak: { soru: "Boşluğa ne gelir? “Selin is ___ than her sister.” (helpful)", secenekler: [["more helpful", true, "Doğru! helpful uzun bir sıfattır: more helpful."], ["helpfuler", false, "Uzun sıfatlar -er almaz."], ["the most helpful", false, "than ile comparative biçimi kullanılır."], ["more helpfuler", false, "more ile -er birlikte kullanılmaz."]] },
      },
      {
        baslik: "Superlative ve question tags",
        metin: "Bir grubun içinde “en …” olanı anlatırken <b>the + sıfat-est</b> ya da <b>the most + uzun sıfat</b> kullanırız: <b>the tallest, the funniest, the biggest, the most generous, the best, the worst</b>. Onay istemek için cümlenin sonuna kısa bir soru (question tag) ekleriz: olumlu cümle → olumsuz tag, olumsuz cümle → olumlu tag. <b>She is kind, isn't she?</b> <b>You aren't lazy, are you?</b> Geniş zamanda do / does kullanılır: <b>He plays chess, doesn't he?</b> <b>They don't like rude people, do they?</b>",
        ornek: "<b>Ayşe is the most hard-working student in our class, isn't she? — Yes, she is.</b>",
        durak: { soru: "Doğru question tag hangisidir? “Your father is very patient, ___?”", secenekler: [["isn't he", true, "Doğru! Olumlu cümle (is) → olumsuz tag (isn't), özne he."], ["is he", false, "Olumlu cümleye olumsuz tag eklenir."], ["doesn't he", false, "Cümlede be fiili (is) var; tag da be ile yapılır."], ["isn't your father", false, "Tag'de isim değil zamir kullanılır."]] },
      },
    ],
    uret: {
      "enper.adj": [
        kelimeSor("enper.adj", KARAKTER, "Olumlu: friendly, kind, generous, honest, hard-working, patient, helpful; olumsuz: lazy, rude, selfish."),
        kelimeSor("enper.adj", KARAKTER, "Kişiliği anlatırken be kullanılır: She is cheerful. He isn't selfish."),
        Q("enper.adj", "aciklama", 1, "<i>Burak always shares his sandwiches and toys with his friends.</i> What is Burak like?", "generous",
          [["selfish", "kavrama", "selfish (bencil) kişi paylaşmaz; anlamca zıttır."], ["lazy", "bilgi", "lazy tembel demektir; paylaşmakla ilgili değildir."], ["shy", "bilgi", "shy utangaç demektir."]],
          "“shares” = paylaşır.", [
           "🔎 Soruyu anlayalım: Burak her zaman paylaşıyor.",
           "💡 Hatırlayalım: Paylaşan kişi cömerttir.",
           "✏️ Seçenekleri tek tek inceleyelim: “selfish” → selfish (bencil) kişi paylaşmaz; anlamca zıttır.",
           "✏️ “lazy” → lazy tembel demektir; paylaşmakla ilgili değildir.",
           "✅ Sonuç: Cömert = generous.",
           "🔁 Kontrol edelim: Son seçenek “shy” de aradığımız cevap değil: shy utangaç demektir. Geriye yalnızca “generous” kalıyor."],
          { kural: "What is he like? = Nasıl biridir? (karakter sorusu)", dogruNeden: "Paylaşan kişi cömerttir." }),
        Q("enper.adj", "aciklama", 1, "<i>Elif never does her homework. She sleeps all day and watches TV.</i> What is Elif like?", "lazy",
          [["hard-working", "kavrama", "hard-working (çalışkan) bu davranışların tam tersidir."], ["honest", "bilgi", "honest dürüst demektir."], ["polite", "bilgi", "polite kibar demektir."]],
          "Hiç ödev yapmayan biri nasıl biridir?", [
           "🔎 Soruyu anlayalım: Elif ödev yapmıyor, bütün gün uyuyor.",
           "💡 Hatırlayalım: Bu davranışlar tembelliği gösterir.",
           "✏️ Seçenekleri tek tek inceleyelim: “hard-working” → hard-working (çalışkan) bu davranışların tam tersidir.",
           "✏️ “honest” → honest dürüst demektir.",
           "✅ Sonuç: Tembel = lazy.",
           "🔁 Kontrol edelim: Son seçenek “polite” de aradığımız cevap değil: polite kibar demektir. Geriye yalnızca “lazy” kalıyor."],
          { kural: "lazy ↔ hard-working", dogruNeden: "Bu davranışlar tembelliği gösterir." }),
        Q("enper.adj", "hatirlama", 2, "What is the opposite of <b>patient</b>?", "impatient",
          [["unpatient", "bilgi", "patient sıfatının zıttı “im-” ön ekiyle yapılır."], ["dispatient", "bilgi", "Böyle bir kelime yoktur."], ["patiently", "kavrama", "patiently bir zarftır (sabırla); zıt anlam bildirmez."]],
          "p ile başlayan bazı sıfatlar im- ön eki alır.", [
           "🔎 Soruyu anlayalım: patient = sabırlı.",
           "💡 Hatırlayalım: Zıttı im- ön ekiyle yapılır.",
           "✏️ Seçenekleri tek tek inceleyelim: “unpatient” → patient sıfatının zıttı “im-” ön ekiyle yapılır.",
           "✏️ “dispatient” → Böyle bir kelime yoktur.",
           "✅ Sonuç: impatient = sabırsız.",
           "🔁 Kontrol edelim: Son seçenek “patiently” de aradığımız cevap değil: patiently bir zarftır (sabırla); zıt anlam bildirmez. Geriye yalnızca “impatient” kalıyor."],
          { kural: "Zıt anlam ön ekleri: un- (unkind), im- (impatient, impolite), dis- (dishonest).", dogruNeden: "Zıttı im- ön ekiyle yapılır." }),
        Q("enper.adj", "transfer", 2, "Complete the dialogue.<br>— What's your best friend like?<br>— ___", "She's friendly and very funny.",
          [["She likes pizza and football.", "kavrama", "“What is she like?” karakter sorar; “What does she like?” sevdiklerini sorar."], ["She's fine, thanks.", "kavrama", "Bu cevap “How is she?” (Nasıl, iyi mi?) sorusuna verilir."], ["She's got long hair.", "kavrama", "Bu dış görünüşü anlatır; soru karakteri soruyor."]],
          "“What is she like?” ile “What does she like?” farklıdır.", [
           "🔎 Soruyu anlayalım: What's she like? = Nasıl biridir? (kişilik)",
           "💡 Hatırlayalım: Cevapta karakter sıfatları kullanılır.",
           "✏️ Seçenekleri tek tek inceleyelim: “She likes pizza and football.” → “What is she like?” karakter sorar; “What does she like?” sevdiklerini sorar.",
           "✏️ “She's fine, thanks.” → Bu cevap “How is she?” (Nasıl, iyi mi?) sorusuna verilir.",
           "✅ Sonuç: She's friendly and very funny.",
           "🔁 Kontrol edelim: Son seçenek “She's got long hair.” de aradığımız cevap değil: Bu dış görünüşü anlatır; soru karakteri soruyor. Geriye yalnızca “She's friendly and very funny.” kalıyor."],
          { kural: "What is he like? → karakter; What does he look like? → dış görünüş; What does he like? → sevdikleri.", dogruNeden: "Cevapta karakter sıfatları kullanılır." }),
        Q("enper.adj", "uygulama", 2, "Read and answer.<br><i>My cousin Arda is very shy. He doesn't talk much at parties. But he is really clever and helpful. He helps me with my maths homework.</i><br>Which word does <b>NOT</b> describe Arda?", "talkative",
          [["shy", "dikkat", "Metinde “Arda is very shy.” yazıyor."], ["clever", "dikkat", "Metinde “he is really clever” yazıyor."], ["helpful", "dikkat", "Metinde “helpful” ve “He helps me” yazıyor."]],
          "“He doesn't talk much” ne anlama gelir?", [
           "🔎 Soruyu anlayalım: Arda: shy, clever, helpful.",
           "💡 Hatırlayalım: “He doesn't talk much” → çok konuşmaz.",
           "✏️ Seçenekleri tek tek inceleyelim: “shy” → Metinde “Arda is very shy.” yazıyor.",
           "✏️ “clever” → Metinde “he is really clever” yazıyor.",
           "✅ Sonuç: Konuşkan (talkative) değildir.",
           "🔁 Kontrol edelim: Son seçenek “helpful” de aradığımız cevap değil: Metinde “helpful” ve “He helps me” yazıyor. Geriye yalnızca “talkative” kalıyor."],
          { kural: "talkative ↔ shy / quiet", dogruNeden: "“He doesn't talk much” → çok konuşmaz." }),
      ],
      "enper.compare": [
        karsilastir, karsilastir, karsilastir,
        Q("enper.compare", "uygulama", 2, "Look at the table. Which sentence is correct?", "Ece is older than Ozan.",
          [["Ozan is older than Ece.", "dikkat", "Ozan 11, Ece 13 yaşında; Ece daha büyük."], ["Ece is younger than Ozan.", "dikkat", "13 yaşındaki Ece, 11 yaşındaki Ozan'dan küçük değildir."], ["Ozan is taller than Ece.", "dikkat", "Ozan 140 cm, Ece 152 cm; Ece daha uzun."]],
          "Yaş ve boy sütunlarını karşılaştır.", [
           "🔎 Soruyu anlayalım: Ece 13, Ozan 11 yaşında → Ece is older.",
           "💡 Hatırlayalım: Ece 152 cm, Ozan 140 cm → Ece is taller.",
           "✏️ Seçenekleri tek tek inceleyelim: “Ozan is older than Ece.” → Ozan 11, Ece 13 yaşında; Ece daha büyük.",
           "✏️ “Ece is younger than Ozan.” → 13 yaşındaki Ece, 11 yaşındaki Ozan'dan küçük değildir.",
           "✅ Sonuç: Ece is older than Ozan.",
           "🔁 Kontrol edelim: Son seçenek “Ozan is taller than Ece.” de aradığımız cevap değil: Ozan 140 cm, Ece 152 cm; Ece daha uzun. Geriye yalnızca “Ece is older than Ozan.” kalıyor."],
          { gorsel: G.tablo(["Name", "Age", "Height"], [["Ece", "13", "152 cm"], ["Ozan", "11", "140 cm"]]), kural: "older ↔ younger, taller ↔ shorter", dogruNeden: "Ece 152 cm, Ozan 140 cm → Ece is taller." }),
        Q("enper.compare", "transfer", 2, "Complete the dialogue.<br>— Who is more patient, your mum or your dad?<br>— My mum. She is ___ my dad.", "more patient than",
          [["patienter than", "kavrama", "patient iki heceli uzun bir sıfattır; more ile kullanılır."], ["more patient that", "dikkat", "Karşılaştırmada “than” kullanılır, “that” değil."], ["the most patient than", "kavrama", "than ile comparative kullanılır."]],
          "Soruda kullanılan biçimi cevapta da kullan.", [
           "🔎 Soruyu anlayalım: more patient.",
           "💡 Hatırlayalım: Karşılaştırma: more + sıfat + than.",
           "✏️ Seçenekleri tek tek inceleyelim: “patienter than” → patient iki heceli uzun bir sıfattır; more ile kullanılır.",
           "✏️ “more patient that” → Karşılaştırmada “than” kullanılır, “that” değil.",
           "✅ Sonuç: She is more patient than my dad.",
           "🔁 Kontrol edelim: Son seçenek “the most patient than” de aradığımız cevap değil: than ile comparative kullanılır. Geriye yalnızca “more patient than” kalıyor."],
          { kural: "more + uzun sıfat + than", dogruNeden: "Karşılaştırma: more + sıfat + than." }),
      ],
      "enper.super": [
        enUstun, enUstun, enUstun,
        Q("enper.super", "uygulama", 2, "Look at the chart. <b>Who is the tallest?</b>", "Murat",
          [["Aslı", "dikkat", "Aslı en kısa olandır."], ["Kerem", "dikkat", "Kerem Murat'tan kısadır."], ["Duru", "dikkat", "Duru Murat'tan kısadır."]],
          "En uzun sütunu bul.", [
           "🔎 Soruyu anlayalım: Grafikte boylar: Aslı 138, Kerem 150, Murat 158, Duru 146.",
           "💡 Hatırlayalım: En büyük değer 158 cm.",
           "✏️ Seçenekleri tek tek inceleyelim: “Aslı” → Aslı en kısa olandır.",
           "✏️ “Kerem” → Kerem Murat'tan kısadır.",
           "✅ Sonuç: The tallest is Murat.",
           "🔁 Kontrol edelim: Son seçenek “Duru” de aradığımız cevap değil: Duru Murat'tan kısadır. Geriye yalnızca “Murat” kalıyor."],
          { gorsel: G.sutun([["Aslı", 138], ["Kerem", 150], ["Murat", 158], ["Duru", 146]], { baslik: "Height", birim: "cm" }), kural: "the tallest = en uzun; the shortest = en kısa.", dogruNeden: "En büyük değer 158 cm." }),
        Q("enper.super", "aciklama", 2, "Which sentence is correct?", "Ali is the funniest boy in the class.",
          [["Ali is the funnyest boy in the class.", "dikkat", "-y ile biten sıfatlarda y → i olur: funniest."], ["Ali is funniest boy in the class.", "dikkat", "Superlative'den önce “the” gelir."], ["Ali is the most funniest boy in the class.", "kavrama", "-est ile most birlikte kullanılmaz."]],
          "funny sıfatı -y ile bitiyor.", [
           "🔎 Soruyu anlayalım: funny → y düşer → funni + est.",
           "💡 Hatırlayalım: Önüne “the” gelir.",
           "✏️ Seçenekleri tek tek inceleyelim: “Ali is the funnyest boy in the class.” → -y ile biten sıfatlarda y → i olur: funniest.",
           "✏️ “Ali is funniest boy in the class.” → Superlative'den önce “the” gelir.",
           "✅ Sonuç: Ali is the funniest boy in the class.",
           "🔁 Kontrol edelim: Son seçenek “Ali is the most funniest boy in the class.” de aradığımız cevap değil: -est ile most birlikte kullanılmaz. Geriye yalnızca “Ali is the funniest boy in the class.” kalıyor."],
          { kural: "happy → the happiest, funny → the funniest, lazy → the laziest", dogruNeden: "Önüne “the” gelir." }),
      ],
      "enper.tag": [
        Q("enper.tag", "uygulama", 1, "Choose the correct question tag: <b>Mert is very brave, ___?</b>", "isn't he",
          [["is he", "kavrama", "Olumlu cümleye olumsuz tag eklenir."], ["doesn't he", "kavrama", "Cümlede is var; tag da be ile yapılır."], ["isn't Mert", "bilgi", "Tag'de isim yerine zamir kullanılır."]],
          "Cümle olumlu mu? Fiil ne?", [
           "🔎 Soruyu anlayalım: Cümle olumlu ve fiil “is”.",
           "💡 Hatırlayalım: Olumlu → olumsuz tag: isn't. Mert = he.",
           "✏️ Seçenekleri tek tek inceleyelim: “is he” → Olumlu cümleye olumsuz tag eklenir.",
           "✏️ “doesn't he” → Cümlede is var; tag da be ile yapılır.",
           "✅ Sonuç: Mert is very brave, isn't he?",
           "🔁 Kontrol edelim: Son seçenek “isn't Mert” de aradığımız cevap değil: Tag'de isim yerine zamir kullanılır. Geriye yalnızca “isn't he” kalıyor."],
          { kural: "Olumlu cümle → olumsuz tag; olumsuz cümle → olumlu tag.", dogruNeden: "Olumlu → olumsuz tag: isn't. Mert = he." }),
        Q("enper.tag", "uygulama", 1, "Choose the correct question tag: <b>Your sisters aren't lazy, ___?</b>", "are they",
          [["aren't they", "kavrama", "Olumsuz cümleye olumlu tag eklenir."], ["is she", "dikkat", "sisters çoğuldur → they."], ["do they", "kavrama", "Cümlede be fiili var; tag da be ile yapılır."]],
          "Cümle olumsuz; özne çoğul.", [
           "🔎 Soruyu anlayalım: Cümle olumsuz (aren't).",
           "💡 Hatırlayalım: Olumsuz → olumlu tag: are. sisters = they.",
           "✏️ Seçenekleri tek tek inceleyelim: “aren't they” → Olumsuz cümleye olumlu tag eklenir.",
           "✏️ “is she” → sisters çoğuldur → they.",
           "✅ Sonuç: Your sisters aren't lazy, are they?",
           "🔁 Kontrol edelim: Son seçenek “do they” de aradığımız cevap değil: Cümlede be fiili var; tag da be ile yapılır. Geriye yalnızca “are they” kalıyor."],
          { kural: "aren't … → are they? / isn't … → is she?", dogruNeden: "Olumsuz → olumlu tag: are. sisters = they." }),
        Q("enper.tag", "uygulama", 2, "Choose the correct question tag: <b>Your grandpa tells funny stories, ___?</b>", "doesn't he",
          [["isn't he", "kavrama", "Cümlede be yok; geniş zaman fiili (tells) var → does."], ["don't he", "kavrama", "he ile does kullanılır."], ["does he", "kavrama", "Olumlu cümleye olumsuz tag eklenir."]],
          "Geniş zamanda tag için do / does kullanılır.", [
           "🔎 Soruyu anlayalım: Fiil “tells” (he / she / it ile -s almış).",
           "💡 Hatırlayalım: Olumlu → olumsuz tag: doesn't. grandpa = he.",
           "✏️ Seçenekleri tek tek inceleyelim: “isn't he” → Cümlede be yok; geniş zaman fiili (tells) var → does.",
           "✏️ “don't he” → he ile does kullanılır.",
           "✅ Sonuç: Your grandpa tells funny stories, doesn't he?",
           "🔁 Kontrol edelim: Son seçenek “does he” de aradığımız cevap değil: Olumlu cümleye olumsuz tag eklenir. Geriye yalnızca “doesn't he” kalıyor."],
          { kural: "He works… → doesn't he? / They work… → don't they?", dogruNeden: "Olumlu → olumsuz tag: doesn't. grandpa = he." }),
        Q("enper.tag", "uygulama", 2, "Choose the correct question tag: <b>You don't like rude people, ___?</b>", "do you",
          [["don't you", "kavrama", "Olumsuz cümleye olumlu tag eklenir."], ["are you", "kavrama", "Cümlede be değil do var."], ["does you", "bilgi", "you ile does değil do kullanılır."]],
          "Cümlede “don't” var.", [
           "🔎 Soruyu anlayalım: Cümle olumsuz (don't).",
           "💡 Hatırlayalım: Olumsuz → olumlu tag: do you.",
           "✏️ Seçenekleri tek tek inceleyelim: “don't you” → Olumsuz cümleye olumlu tag eklenir.",
           "✏️ “are you” → Cümlede be değil do var.",
           "✅ Sonuç: You don't like rude people, do you?",
           "🔁 Kontrol edelim: Son seçenek “does you” de aradığımız cevap değil: you ile does değil do kullanılır. Geriye yalnızca “do you” kalıyor."],
          { kural: "don't → do …?, doesn't → does …?", dogruNeden: "Olumsuz → olumlu tag: do you." }),
        Q("enper.tag", "transfer", 2, "Complete the dialogue.<br>— Ms Yılmaz is the kindest teacher in our school, ___?<br>— Yes, she is. Everybody loves her.", "isn't she",
          [["is she", "kavrama", "Olumlu cümleye olumsuz tag eklenir."], ["doesn't she", "kavrama", "Cümlede be fiili (is) var."], ["aren't they", "dikkat", "Ms Yılmaz tek kişidir ve kadındır → she."]],
          "Cevap “Yes, she is.” ipucu veriyor.", [
           "🔎 Soruyu anlayalım: Cümle olumlu ve fiil is.",
           "💡 Hatırlayalım: Ms Yılmaz = she.",
           "✏️ Seçenekleri tek tek inceleyelim: “is she” → Olumlu cümleye olumsuz tag eklenir.",
           "✏️ “doesn't she” → Cümlede be fiili (is) var.",
           "✅ Sonuç: Tag: isn't she?",
           "🔁 Kontrol edelim: Son seçenek “aren't they” de aradığımız cevap değil: Ms Yılmaz tek kişidir ve kadındır → she. Geriye yalnızca “isn't she” kalıyor."],
          { kural: "Cevap tag'deki yardımcı fiille verilir: …, isn't she? — Yes, she is.", dogruNeden: "Ms Yılmaz = she." }),
        Q("enper.tag", "baglanti", 2, "Choose the correct question tag: <b>Emre has got curly hair, ___?</b>", "hasn't he",
          [["doesn't he", "kavrama", "“has got” yapısında tag has ile yapılır."], ["isn't he", "kavrama", "Cümlede be değil has got var."], ["has he", "kavrama", "Olumlu cümleye olumsuz tag eklenir."]],
          "have got cümlesinde yardımcı fiil “has”.", [
           "🔎 Soruyu anlayalım: Cümle: Emre has got… (olumlu).",
           "💡 Hatırlayalım: Yardımcı fiil has → olumsuz tag: hasn't.",
           "✏️ Seçenekleri tek tek inceleyelim: “doesn't he” → “has got” yapısında tag has ile yapılır.",
           "✏️ “isn't he” → Cümlede be değil has got var.",
           "✅ Sonuç: Emre has got curly hair, hasn't he?",
           "🔁 Kontrol edelim: Son seçenek “has he” de aradığımız cevap değil: Olumlu cümleye olumsuz tag eklenir. Geriye yalnızca “hasn't he” kalıyor."],
          { kural: "She has got… → hasn't she? / They have got… → haven't they?", dogruNeden: "Yardımcı fiil has → olumsuz tag: hasn't." }),
      ],
    },
  });

  /* ======================= 3) FAMILY MEMBERS' JOBS AND WORKPLACES ======================= */
  const MESLEK = [["author", "yazar"], ["boss", "patron"], ["businessman", "iş insanı"], ["cook", "aşçı"], ["pilot", "pilot"], ["nurse", "hemşire"], ["engineer", "mühendis"], ["farmer", "çiftçi"], ["firefighter", "itfaiyeci"], ["police officer", "polis memuru"], ["vet", "veteriner"], ["dentist", "diş hekimi"], ["mechanic", "araba tamircisi"], ["waiter", "garson"], ["cashier", "kasiyer"], ["architect", "mimar"], ["shop assistant", "satış görevlisi"]];
  const YER = [["hospital", "hastane"], ["airport", "havalimanı"], ["office", "ofis, büro"], ["factory", "fabrika"], ["garage", "oto tamirhanesi"], ["restaurant", "restoran"], ["farm", "çiftlik"], ["fire station", "itfaiye istasyonu"], ["police station", "karakol"], ["school", "okul"], ["supermarket", "süpermarket"]];
  /* [meslek (a/an ile), iş yeri, ne yapar] */
  const IS = [
    ["a pilot", "at an airport", "flies planes"], ["a nurse", "in a hospital", "looks after sick people"], ["a cook", "in a restaurant", "makes meals"], ["a farmer", "on a farm", "grows vegetables and keeps animals"],
    ["a firefighter", "at a fire station", "puts out fires"], ["a mechanic", "in a garage", "repairs cars"], ["a vet", "at an animal clinic", "looks after sick animals"], ["a cashier", "in a supermarket", "takes money from customers"],
    ["an author", "at home or in a library", "writes books"], ["a dentist", "at a dental clinic", "checks people's teeth"], ["a teacher", "at a school", "teaches students"], ["a police officer", "at a police station", "protects people"],
  ];
  function nerede() {
    const [m, y] = sec(IS);
    const diger = karistir(IS.filter(x => x[1] !== y)).slice(0, 3);
    return S(zengin({
      kaz: "enjob.jobs", duzey: "aciklama", zorluk: 1,
      soru: `Where does ${m} work?`, dogru: `He / She works ${y}.`,
      yanlis: diger.map(d => [`He / She works ${d[1]}.`, "bilgi", `Burada çalışan kişi genellikle ${d[0].replace(/^an? /, "")} olur.`]),
      ipucu: `${m} ne iş yapar? Bu işi nerede yapar?`,
      cozum: [`${m} → ${IS.find(x => x[0] === m)[2]}.`, `Bu iş ${y} yapılır.`, `Cevap: He / She works ${y}.`],
      kural: "Where does she work? — She works in a hospital / at an airport / on a farm.",
    }));
  }
  function kimdir() {
    const [m, , n] = sec(IS);
    const diger = karistir(IS.filter(x => x[0] !== m)).slice(0, 3);
    return S(zengin({
      kaz: "enjob.jobs", duzey: "aciklama", zorluk: 1,
      soru: `<i>This person ${n}.</i> What is his or her job?`, dogru: `He / She is ${m}.`,
      yanlis: diger.map(d => [`He / She is ${d[0]}.`, "bilgi", `${d[0].replace(/^an? /, "")}: ${d[2]}.`]),
      ipucu: "Tanımdaki fiili (ne yapıyor?) bul.",
      cozum: [`Tanım: “${n}”.`, `Bu işi yapan kişi ${m}.`, `Meslek söylerken a / an kullanılır: He / She is ${m}.`],
      kural: "Meslekten önce a / an gelir: She is an engineer. He is a cook.",
    }));
  }

  KONU_EKLE("en", {
    id: "en_jobs", tema: "en4", ad: "Family Members' Jobs and Workplaces", tr: "Aile bireylerinin meslekleri ve iş yerleri",
    kazanimlar: [
      { id: "enjob.jobs", ad: "Meslekler, iş yerleri ve iş rutinleri" },
      { id: "enjob.future", ad: "Gelecek planları (present continuous) ve programlı olaylar (simple present)" },
      { id: "enjob.when", ad: "when / while ile rutinleri anlatma" },
    ],
    sozluk: MESLEK.slice(0, 14).concat(YER.slice(0, 9)),
    anlatim: [
      {
        baslik: "Meslekler ve iş yerleri",
        metin: "Meslek söylerken meslekten önce <b>a / an</b> kullanırız: <b>She is a nurse. He is an engineer. My aunt is an author.</b> Meslek ve iş yeri sormak için: <b>What does your father do? — He's a pilot.</b> <b>Where does he work? — He works at an airport.</b> İş yerlerinde edatlara dikkat: <b>in a hospital, in an office, in a factory, in a restaurant</b>; <b>at an airport, at a school, at a fire station</b>; <b>on a farm</b>. Rutinleri simple present ile anlatırız: <b>She starts work at 8 a.m.</b>",
        ornek: "<b>My mum is a vet. She works at an animal clinic. She looks after sick animals.</b>",
        durak: { soru: "Boşluğa ne gelir? “My uncle is ___ engineer.”", secenekler: [["an", true, "Doğru! engineer sesli harfle başlar: an engineer."], ["a", false, "Sesli harf sesiyle başlayan kelimeden önce an gelir."], ["the", false, "Meslek söylerken a / an kullanılır."], ["–", false, "İngilizcede meslekten önce a / an gerekir."]] },
      },
      {
        baslik: "Gelecek planları ve programlar",
        metin: "Kesinleşmiş, ayarlanmış gelecek planlarını <b>present continuous</b> ile anlatırız (bilet alınmış, randevu verilmiş): <b>My dad is flying to Ankara tomorrow.</b> <b>We are visiting Grandma this weekend.</b> Tarifeli ve programlı olaylar (tren, uçak, film, ders saatleri) için <b>simple present</b> kullanılır: <b>The plane leaves at 7.30 tomorrow.</b> <b>The film starts at 8 p.m.</b> Zaman ifadeleri: <b>tomorrow, tonight, next week, this weekend, on Monday</b>.",
        ornek: "<b>— What are you doing on Saturday? — I'm meeting my cousins. Our bus leaves at 9 a.m.</b>",
        durak: { soru: "Hangisi programlı (tarifeli) bir olayı anlatır?", secenekler: [["The train leaves at 6.15 tomorrow morning.", true, "Doğru! Tren tarifesi programlı bir olaydır; simple present kullanılır."], ["I am meeting Ali after school.", false, "Bu, kişisel bir plan (ayarlanmış buluşma); present continuous ile anlatılmış."], ["She is working now.", false, "Bu cümle şu an olan bir eylemi anlatır."], ["He works in an office.", false, "Bu bir rutin/genel gerçektir; gelecek değildir."]] },
      },
      {
        baslik: "when ve while",
        metin: "<b>when</b> (-dığında, -ınca) bir olay olunca diğerinin olduğunu anlatır: <b>When my mum gets home, she has a cup of tea.</b> <b>while</b> (-iken) iki eylemin aynı anda olduğunu anlatır: <b>While my dad is cooking, I am setting the table.</b> <b>while</b> genellikle süren (devam eden) eylemlerle kullanılır. when / while ile başlayan bölüm cümlenin başına gelirse virgül koyarız: <b>When I finish school, I go home.</b> Sona gelirse virgül gerekmez: <b>I go home when I finish school.</b>",
        ornek: "<b>While my mum is working at the hospital, my grandma looks after us.</b>",
        durak: { soru: "Boşluğa ne gelir? “___ my sister is studying, I am listening to music.”", secenekler: [["While", true, "Doğru! İki eylem aynı anda sürüyor: while (-iken)."], ["Which", false, "Which “hangisi” demektir; bağlaç değildir."], ["Whose", false, "Whose “kimin” demektir."], ["Than", false, "than karşılaştırmada kullanılır."]] },
      },
    ],
    uret: {
      "enjob.jobs": [
        kelimeSor("enjob.jobs", MESLEK, "Meslekten önce a / an: a pilot, a cook, an author, an engineer, an architect."),
        kelimeSor("enjob.jobs", YER, "in a hospital / in an office / in a factory; at an airport / at a fire station; on a farm."),
        nerede, kimdir,
        Q("enjob.jobs", "uygulama", 2, "Look at the table. <b>Where does Selin's mother work?</b>", "She works at an airport.",
          [["She works in a hospital.", "dikkat", "Hastanede çalışan Selin'in babası (nurse)."], ["She works on a farm.", "dikkat", "Çiftlikte çalışan Selin'in büyükbabası."], ["She works in a restaurant.", "dikkat", "Tabloda restoranda çalışan biri yok."]],
          "Tabloda “mother” satırını bul.", [
           "🔎 Soruyu anlayalım: Mother → pilot.",
           "💡 Hatırlayalım: Pilotlar havalimanında çalışır: at an airport.",
           "✏️ Seçenekleri tek tek inceleyelim: “She works in a hospital.” → Hastanede çalışan Selin'in babası (nurse).",
           "✏️ “She works on a farm.” → Çiftlikte çalışan Selin'in büyükbabası.",
           "✅ Sonuç: She works at an airport.",
           "🔁 Kontrol edelim: Son seçenek “She works in a restaurant.” de aradığımız cevap değil: Tabloda restoranda çalışan biri yok. Geriye yalnızca “She works at an airport.” kalıyor."],
          { gorsel: G.tablo(["Family member", "Job", "Workplace"], [["Father", "nurse", "a hospital"], ["Mother", "pilot", "an airport"], ["Grandfather", "farmer", "a farm"], ["Aunt", "author", "home"]]), kural: "Where does she work? — She works at / in / on…", dogruNeden: "Pilotlar havalimanında çalışır: at an airport." }),
        Q("enjob.jobs", "transfer", 1, "Complete the dialogue.<br>— ___<br>— He's a mechanic. He repairs cars.", "What does your father do?",
          [["Where does your father work?", "kavrama", "Bu soru iş yerini sorar; cevap “He works in a garage.” olurdu."], ["What is your father doing?", "kavrama", "Bu soru şu an ne yaptığını sorar."], ["How is your father?", "kavrama", "Bu soru nasıl olduğunu (iyi mi) sorar."]],
          "Cevapta meslek söyleniyor.", [
           "🔎 Soruyu anlayalım: Cevap: He's a mechanic → meslek.",
           "💡 Hatırlayalım: Meslek sormak için: What does he do?",
           "✏️ Seçenekleri tek tek inceleyelim: “Where does your father work?” → Bu soru iş yerini sorar; cevap “He works in a garage.” olurdu.",
           "✏️ “What is your father doing?” → Bu soru şu an ne yaptığını sorar.",
           "✅ Sonuç: Doğru soru: What does your father do?",
           "🔁 Kontrol edelim: Son seçenek “How is your father?” de aradığımız cevap değil: Bu soru nasıl olduğunu (iyi mi) sorar. Geriye yalnızca “What does your father do?” kalıyor."],
          { kural: "What does she do? = Ne iş yapar? / What is she doing? = Şu an ne yapıyor?", dogruNeden: "Meslek sormak için: What does he do?" }),
        Q("enjob.jobs", "uygulama", 2, "Read and answer.<br><i>My aunt Nur is a cook. She works in a big restaurant in Izmir. She starts work at 10 a.m. and finishes at 6 p.m. She makes delicious fish dishes.</i><br>When does Nur finish work?", "At 6 p.m.",
          [["At 10 a.m.", "dikkat", "10 a.m. işe başladığı saat."], ["At 10 p.m.", "dikkat", "Metinde 10 p.m. geçmiyor."], ["At 6 a.m.", "dikkat", "a.m. sabah, p.m. öğleden sonra / akşam demektir; metinde 6 p.m. yazıyor."]],
          "“finishes” kelimesini metinde bul.", [
           "🔎 Soruyu anlayalım: starts work at 10 a.m. → başlama saati.",
           "💡 Hatırlayalım: finishes at 6 p.m. → bitirme saati.",
           "✏️ Seçenekleri tek tek inceleyelim: “At 10 a.m.” → 10 a.m. işe başladığı saat.",
           "✏️ “At 10 p.m.” → Metinde 10 p.m. geçmiyor.",
           "✅ Sonuç: At 6 p.m.",
           "🔁 Kontrol edelim: Son seçenek “At 6 a.m.” de aradığımız cevap değil: a.m. sabah, p.m. öğleden sonra / akşam demektir; metinde 6 p.m. yazıyor. Geriye yalnızca “At 6 p.m.” kalıyor."],
          { kural: "a.m. = öğleden önce, p.m. = öğleden sonra.", dogruNeden: "finishes at 6 p.m. → bitirme saati." }),
      ],
      "enjob.future": [
        Q("enjob.future", "uygulama", 1, "Complete the sentence: <b>My mum ___ to Istanbul tomorrow. She has got her plane ticket.</b>", "is flying",
          [["flying", "bilgi", "Present continuous'ta be fiili (is) gerekir."], ["are flying", "kavrama", "my mum = she → is."], ["fly", "kavrama", "Ayarlanmış (biletli) bir plan present continuous ile anlatılır; ayrıca she ile fly olmaz."]],
          "Bileti alınmış bir plan → hangi zaman?", [
           "🔎 Soruyu anlayalım: Bilet alınmış: kesinleşmiş bir plan.",
           "💡 Hatırlayalım: Ayarlanmış planlar present continuous ile anlatılır: am / is / are + -ing.",
           "✏️ Seçenekleri tek tek inceleyelim: “flying” → Present continuous'ta be fiili (is) gerekir.",
           "✏️ “are flying” → my mum = she → is.",
           "✅ Sonuç: My mum is flying to Istanbul tomorrow.",
           "🔁 Kontrol edelim: Son seçenek “fly” de aradığımız cevap değil: Ayarlanmış (biletli) bir plan present continuous ile anlatılır; ayrıca she ile fly olmaz. Geriye yalnızca “is flying” kalıyor."],
          { kural: "Ayarlanmış plan: am / is / are + fiil-ing + gelecek zaman ifadesi.", dogruNeden: "Ayarlanmış planlar present continuous ile anlatılır: am / is / are + -ing." }),
        Q("enjob.future", "uygulama", 1, "Complete the sentence: <b>The bus to Ankara ___ at 8.45 tomorrow morning.</b>", "leaves",
          [["leave", "kavrama", "the bus = it → leaves."], ["is leave", "bilgi", "is ile fiilin yalın hâli birlikte kullanılmaz."], ["leaving", "bilgi", "be fiili olmadan -ing kullanılmaz."]],
          "Otobüs saatleri bir tarifedir.", [
           "🔎 Soruyu anlayalım: Tarifeli olaylar (otobüs, tren, uçak) simple present ile anlatılır.",
           "💡 Hatırlayalım: the bus = it → fiil -s alır.",
           "✏️ Seçenekleri tek tek inceleyelim: “leave” → the bus = it → leaves.",
           "✏️ “is leave” → is ile fiilin yalın hâli birlikte kullanılmaz.",
           "✅ Sonuç: The bus leaves at 8.45 tomorrow morning.",
           "🔁 Kontrol edelim: Son seçenek “leaving” de aradığımız cevap değil: be fiili olmadan -ing kullanılmaz. Geriye yalnızca “leaves” kalıyor."],
          { kural: "Program / tarife: The train leaves… The film starts… The lesson begins…", dogruNeden: "the bus = it → fiil -s alır." }),
        Q("enjob.future", "uygulama", 2, "Look at Dad's diary. <b>What is Dad doing on Wednesday?</b>", "He is meeting his boss.",
          [["He is flying to Izmir.", "dikkat", "Bu Salı günkü plan."], ["He is visiting the factory.", "dikkat", "Bu Perşembe günkü plan."], ["He meets his boss every day.", "kavrama", "Soru bir rutin değil, Çarşamba için yapılmış planı soruyor."]],
          "Tabloda Wednesday satırını bul.", [
           "🔎 Soruyu anlayalım: Wednesday → meet the boss.",
           "💡 Hatırlayalım: Ayarlanmış plan present continuous ile söylenir.",
           "✏️ Seçenekleri tek tek inceleyelim: “He is flying to Izmir.” → Bu Salı günkü plan.",
           "✏️ “He is visiting the factory.” → Bu Perşembe günkü plan.",
           "✅ Sonuç: He is meeting his boss.",
           "🔁 Kontrol edelim: Son seçenek “He meets his boss every day.” de aradığımız cevap değil: Soru bir rutin değil, Çarşamba için yapılmış planı soruyor. Geriye yalnızca “He is meeting his boss.” kalıyor."],
          { gorsel: G.tablo(["Day", "Dad's plans for next week"], [["Tuesday", "fly to Izmir ✈️"], ["Wednesday", "meet the boss 💼"], ["Thursday", "visit the factory 🏭"], ["Friday", "have lunch with Grandma 🍲"]]), kural: "What are you doing on Friday? — I'm having lunch with Grandma.", dogruNeden: "Ayarlanmış plan present continuous ile söylenir." }),
        Q("enjob.future", "transfer", 2, "Complete the dialogue.<br>— Are you free on Saturday?<br>— Sorry, I'm not. ___", "I'm visiting my aunt in Bursa.",
          [["I visit my aunt in Bursa.", "kavrama", "Ayarlanmış bir plan present continuous ile anlatılır."], ["I visiting my aunt in Bursa.", "bilgi", "be fiili (am) eksik."], ["I'm visit my aunt in Bursa.", "bilgi", "am ile fiil -ing almalıdır: I'm visiting."]],
          "Cumartesi için yapılmış plan nasıl anlatılır?", [
           "🔎 Soruyu anlayalım: Gelecekteki kişisel bir plan söz konusu.",
           "💡 Hatırlayalım: Kişisel planlar: am / is / are + -ing.",
           "✏️ Seçenekleri tek tek inceleyelim: “I visit my aunt in Bursa.” → Ayarlanmış bir plan present continuous ile anlatılır.",
           "✏️ “I visiting my aunt in Bursa.” → be fiili (am) eksik.",
           "✅ Sonuç: I'm visiting my aunt in Bursa.",
           "🔁 Kontrol edelim: Son seçenek “I'm visit my aunt in Bursa.” de aradığımız cevap değil: am ile fiil -ing almalıdır: I'm visiting. Geriye yalnızca “I'm visiting my aunt in Bursa.” kalıyor."],
          { kural: "Davet reddederken: Sorry, I'm not free. I'm …ing.", dogruNeden: "Kişisel planlar: am / is / are + -ing." }),
        Q("enjob.future", "aciklama", 2, "Which sentence talks about a <b>timetable</b> (tarife)?", "The museum opens at 9 a.m. on Sundays.",
          [["I'm meeting Zeynep at 9 a.m. on Sunday.", "kavrama", "Bu, kişisel ayarlanmış bir plandır."], ["We are having a picnic tomorrow.", "kavrama", "Bu, kişisel bir plandır."], ["My sister is reading a book now.", "kavrama", "Bu, şu an olan bir eylemdir."]],
          "Kurumların açılış-kapanış saatleri tarifedir.", [
           "🔎 Soruyu anlayalım: Müzenin açılış saati her hafta aynıdır; bir programdır.",
           "💡 Hatırlayalım: Programlar simple present ile anlatılır: opens.",
           "✏️ Seçenekleri tek tek inceleyelim: “I'm meeting Zeynep at 9 a.m. on Sunday.” → Bu, kişisel ayarlanmış bir plandır.",
           "✏️ “We are having a picnic tomorrow.” → Bu, kişisel bir plandır.",
           "✅ Sonuç: The museum opens at 9 a.m. on Sundays.",
           "🔁 Kontrol edelim: Son seçenek “My sister is reading a book now.” de aradığımız cevap değil: Bu, şu an olan bir eylemdir. Geriye yalnızca “The museum opens at 9 a.m. on Sundays.” kalıyor."],
          { kural: "Tarife → simple present; kişisel plan → present continuous.", dogruNeden: "Programlar simple present ile anlatılır: opens." }),
        Q("enjob.future", "baglanti", 3, "Read and answer.<br><i>Hi Ece! I've got great news. My dad is a pilot and he is flying to London next week. Mum and I are going with him! Our plane takes off at 7 a.m. on Monday. We are staying there for five days.</i><br>Which sentence is <b>true</b>?", "Their plane takes off on Monday morning.",
          [["Ece's dad is a pilot.", "dikkat", "Pilot olan, mektubu yazan kişinin babası; Ece mektubu okuyan kişi."], ["They are staying in London for a week.", "dikkat", "Metinde “for five days” yazıyor."], ["The writer is going alone.", "dikkat", "Yazar annesi ve babasıyla gidiyor."]],
          "Seçenekleri metinle tek tek karşılaştır.", [
           "🔎 Soruyu anlayalım: Plane takes off at 7 a.m. on Monday → Pazartesi sabahı.",
           "💡 Hatırlayalım: Pilot olan yazarın babası; beş gün kalacaklar; anneyle gidiyorlar.",
           "✏️ Seçenekleri tek tek inceleyelim: “Ece's dad is a pilot.” → Pilot olan, mektubu yazan kişinin babası; Ece mektubu okuyan kişi.",
           "✏️ “They are staying in London for a week.” → Metinde “for five days” yazıyor.",
           "✅ Sonuç: Their plane takes off on Monday morning.",
           "🔁 Kontrol edelim: Son seçenek “The writer is going alone.” de aradığımız cevap değil: Yazar annesi ve babasıyla gidiyor. Geriye yalnızca “Their plane takes off on Monday morning.” kalıyor."],
          { kural: "takes off (tarife) → simple present; is flying / are staying (plan) → present continuous.", dogruNeden: "Pilot olan yazarın babası; beş gün kalacaklar; anneyle gidiyorlar." }),
      ],
      "enjob.when": [
        Q("enjob.when", "uygulama", 1, "Complete the sentence: <b>___ my dad gets home from work, he always has a shower.</b>", "When",
          [["While", "kavrama", "“gets home” anlık bir eylemdir; “-dığında” anlamı için when kullanılır."], ["Which", "bilgi", "Which “hangisi” demektir."], ["Whose", "bilgi", "Whose “kimin” demektir."]],
          "“Eve geldiğinde” nasıl söylenir?", [
           "🔎 Soruyu anlayalım: Eve gelmek anlık bir eylemdir.",
           "💡 Hatırlayalım: “-dığında” anlamı when ile verilir.",
           "✏️ Seçenekleri tek tek inceleyelim: “While” → “gets home” anlık bir eylemdir; “-dığında” anlamı için when kullanılır.",
           "✏️ “Which” → Which “hangisi” demektir.",
           "✅ Sonuç: When my dad gets home from work, he always has a shower.",
           "🔁 Kontrol edelim: Son seçenek “Whose” de aradığımız cevap değil: Whose “kimin” demektir. Geriye yalnızca “When” kalıyor."],
          { kural: "when = -dığında (anlık eylem); while = -iken (süren eylem).", dogruNeden: "“-dığında” anlamı when ile verilir." }),
        Q("enjob.when", "uygulama", 1, "Complete the sentence: <b>___ my mum is working in the garden, my brother is doing his homework.</b>", "While",
          [["Than", "bilgi", "than karşılaştırmada kullanılır."], ["Whose", "bilgi", "Whose “kimin” demektir."], ["Who", "bilgi", "Who “kim” demektir."]],
          "İki eylem aynı anda mı oluyor?", [
           "🔎 Soruyu anlayalım: İki eylem aynı anda sürüyor (is working / is doing).",
           "💡 Hatırlayalım: Aynı anda süren eylemler while ile bağlanır.",
           "✏️ Seçenekleri tek tek inceleyelim: “Than” → than karşılaştırmada kullanılır.",
           "✏️ “Whose” → Whose “kimin” demektir.",
           "✅ Sonuç: While my mum is working…, my brother is doing his homework.",
           "🔁 Kontrol edelim: Son seçenek “Who” de aradığımız cevap değil: Who “kim” demektir. Geriye yalnızca “While” kalıyor."],
          { kural: "While + süren eylem, + diğer eylem.", dogruNeden: "Aynı anda süren eylemler while ile bağlanır." }),
        Q("enjob.when", "aciklama", 2, "Which sentence is correct?", "When the nurse finishes work, she goes home by bus.",
          [["When the nurse finishes work she go home by bus.", "kavrama", "she ile fiil -es / -s alır: goes; ayrıca baştaki when bölümünden sonra virgül gelir."], ["While the nurse finish work, she goes home by bus.", "kavrama", "she ile finishes olmalı; anlık eylem için when kullanılır."], ["When the nurse is finishes work, she goes home by bus.", "bilgi", "is ile fiilin -es'li hâli birlikte kullanılmaz."]],
          "Özne-fiil uyumuna ve virgüle bak.", [
           "🔎 Soruyu anlayalım: the nurse = she → finishes, goes.",
           "💡 Hatırlayalım: When ile başlayan bölümden sonra virgül konur.",
           "✏️ Seçenekleri tek tek inceleyelim: “When the nurse finishes work she go home by bus.” → she ile fiil -es / -s alır: goes; ayrıca baştaki when bölümünden sonra virgül gelir.",
           "✏️ “While the nurse finish work, she goes home by bus.” → she ile finishes olmalı; anlık eylem için when kullanılır.",
           "✅ Sonuç: When the nurse finishes work, she goes home by bus.",
           "🔁 Kontrol edelim: Son seçenek “When the nurse is finishes work, she goes home by bus.” de aradığımız cevap değil: is ile fiilin -es'li hâli birlikte kullanılmaz. Geriye yalnızca “When the nurse finishes work, she goes home by bus.” kalıyor."],
          { kural: "When … , … (when başta ise virgül)", dogruNeden: "When ile başlayan bölümden sonra virgül konur." }),
        Q("enjob.when", "transfer", 2, "Match the parts: <b>While my grandma is cooking dinner, …</b>", "my grandpa is watching the news.",
          [["my grandpa watched the news yesterday.", "kavrama", "While ile anlatılan iki eylem aynı zaman diliminde olmalı."], ["my grandpa are watching the news.", "kavrama", "my grandpa = he → is watching."], ["my grandpa watching the news.", "bilgi", "be fiili (is) eksik."]],
          "İki eylem aynı anda süren eylemler olmalı.", [
           "🔎 Soruyu anlayalım: İlk bölüm: is cooking (şimdiki zaman, süren eylem).",
           "💡 Hatırlayalım: İkinci bölüm de aynı anda süren bir eylem olmalı: is watching.",
           "✏️ Seçenekleri tek tek inceleyelim: “my grandpa watched the news yesterday.” → While ile anlatılan iki eylem aynı zaman diliminde olmalı.",
           "✏️ “my grandpa are watching the news.” → my grandpa = he → is watching.",
           "✅ Sonuç: While my grandma is cooking dinner, my grandpa is watching the news.",
           "🔁 Kontrol edelim: Son seçenek “my grandpa watching the news.” de aradığımız cevap değil: be fiili (is) eksik. Geriye yalnızca “my grandpa is watching the news.” kalıyor."],
          { kural: "while + present continuous, present continuous", dogruNeden: "İkinci bölüm de aynı anda süren bir eylem olmalı: is watching." }),
        Q("enjob.when", "baglanti", 2, "Read and answer.<br><i>My father is a firefighter. When the alarm rings, he puts on his uniform and jumps into the fire engine. While he is working, my mum and I watch TV and wait for him.</i><br>What does the father do when the alarm rings?", "He puts on his uniform.",
          [["He watches TV.", "dikkat", "TV izleyenler yazar ve annesi."], ["He waits for his son.", "dikkat", "Bekleyenler yazar ve annesi."], ["He goes to bed.", "dikkat", "Metinde böyle bir bilgi yok."]],
          "“When the alarm rings” bölümünden sonra ne geliyor?", [
           "🔎 Soruyu anlayalım: When the alarm rings → alarm çaldığında.",
           "💡 Hatırlayalım: Ardından: he puts on his uniform and jumps into the fire engine.",
           "✏️ Seçenekleri tek tek inceleyelim: “He watches TV.” → TV izleyenler yazar ve annesi.",
           "✏️ “He waits for his son.” → Bekleyenler yazar ve annesi.",
           "✅ Sonuç: He puts on his uniform.",
           "🔁 Kontrol edelim: Son seçenek “He goes to bed.” de aradığımız cevap değil: Metinde böyle bir bilgi yok. Geriye yalnızca “He puts on his uniform.” kalıyor."],
          { kural: "when cümlesinde ikinci bölüm, birinci olay olduğunda ne olduğunu anlatır.", dogruNeden: "Ardından: he puts on his uniform and jumps into the fire engine." }),
      ],
    },
  });

  /* ======================= 4) FAMILY HOMES AND HOUSES ======================= */
  const EV = [["apartment", "apartman dairesi"], ["cottage", "kır evi"], ["villa", "villa"], ["detached house", "müstakil ev"], ["bungalow", "tek katlı ev"], ["address", "adres"], ["bin", "çöp kutusu"], ["garden", "bahçe"], ["balcony", "balkon"], ["garage", "garaj"], ["roof", "çatı"], ["living room", "oturma odası"], ["bedroom", "yatak odası"], ["kitchen", "mutfak"], ["bathroom", "banyo"], ["stairs", "merdiven"], ["neighbour", "komşu"], ["lift", "asansör"], ["chimney", "baca"], ["floor", "kat"]];

  /* Dönüşlü zamirler */
  const DONUSLU = [["I", "myself", "hata", "meself"], ["You", "yourself", "", ""], ["He", "himself", "hata", "hisself"], ["She", "herself", "hata", "herselves"], ["We", "ourselves", "hata", "ourself"], ["They", "themselves", "hata", "theirselves"], ["My brother", "himself", "hata", "hisself"], ["My sister", "herself", "hata", "herselves"], ["The children", "themselves", "hata", "theirselves"]];
  const KALIP = ["{S} can tidy the room by ___.", "{S} can make breakfast by ___.", "Look! {S} can see ___ in the mirror.", "{S} should look after ___."];
  function donuslu() {
    const [s, d, , h] = sec(DONUSLU);
    const kalip = sec(KALIP);
    const cumle = kalip.replace("{S}", s);
    const digerleri = karistir(["myself", "yourself", "himself", "herself", "ourselves", "themselves"].filter(x => x !== d && !(s === "You" && x === "yourselves"))).slice(0, h ? 2 : 3);
    const yanlis = digerleri.map(x => [x, "kavrama", `“${x}” başka bir özneye aittir; “${s}” için “${d}” kullanılır.`]);
    if (h) yanlis.push([h, "bilgi", `“${h}” diye bir kelime yoktur; doğrusu “${d}”.`]);
    return S(zengin({
      kaz: "enhom.reflex", duzey: "uygulama", zorluk: s === "You" || s === "I" ? 1 : 2,
      soru: `Complete the sentence: <b>${cumle}</b>`, dogru: d, yanlis,
      ipucu: "Dönüşlü zamir özneyle uyumlu olmalı.",
      cozum: [`Özne: “${s}”.`, `Bu öznenin dönüşlü zamiri: ${d}.`, `Cümle: ${cumle.replace("___", d)}`],
      kural: "I → myself, you → yourself, he → himself, she → herself, it → itself, we → ourselves, they → themselves.",
    }));
  }

  KONU_EKLE("en", {
    id: "en_homes", tema: "en4", ad: "Family Homes and Houses", tr: "Aile evleri ve konut türleri",
    kazanimlar: [
      { id: "enhom.types", ad: "Konut türleri, evin bölümleri ve adres" },
      { id: "enhom.which", ad: "Which ile seçim sorma ve ev tarifi" },
      { id: "enhom.reflex", ad: "Dönüşlü zamirler (myself, himself, themselves…)" },
    ],
    sozluk: EV,
    anlatim: [
      {
        baslik: "Konut türleri ve evin bölümleri",
        metin: "Farklı ev türleri: <b>an apartment</b> (apartman dairesi; İngiliz İngilizcesinde <b>a flat</b>), <b>a block of flats</b> (apartman binası), <b>a detached house</b> (müstakil ev), <b>a cottage</b> (küçük kır evi), <b>a villa</b> (büyük, bahçeli lüks ev), <b>a bungalow</b> (tek katlı ev). Evin bölümleri: <b>a living room, a kitchen, a bedroom, a bathroom, a garden, a balcony, a garage, a roof, stairs</b>. Adres sormak için: <b>What's your address? — It's 12 Lale Street, Ankara.</b> Çöpleri <b>bin</b>'e (çöp kutusu) atarız.",
        ornek: "<b>We live in an apartment on the fifth floor. It has got three bedrooms and a big balcony.</b>",
        durak: { soru: "Hangisi tek katlı bir evdir?", secenekler: [["a bungalow", true, "Doğru! Bungalow tek katlı evdir."], ["a block of flats", false, "Apartman binası çok katlıdır."], ["a skyscraper", false, "Gökdelen çok yüksek bir binadır."], ["a villa", false, "Villa büyük bir evdir; tek katlı olmak zorunda değildir."]] },
      },
      {
        baslik: "Which ile seçim sorma",
        metin: "Sınırlı seçenekler arasından seçim sorarken <b>Which</b> (hangi, hangisi) kullanırız: <b>Which house is yours? — The white one with a red roof.</b> <b>Which do you prefer, a flat or a cottage? — I prefer a cottage.</b> Tekrar etmemek için <b>one / ones</b> kullanılır: <b>the big one, the blue ones</b>. Karşılaştırma sıfatlarıyla da sık kullanılır (Theme 3): <b>Which house is bigger?</b> <b>Which room is the biggest?</b>",
        ornek: "<b>— Which bedroom is yours? — The small one next to the bathroom.</b>",
        durak: { soru: "Boşluğa ne gelir? “— ___ flat is yours, the one on the first floor or the one on the second floor?”", secenekler: [["Which", true, "Doğru! İki seçenek arasından seçim soruluyor: Which."], ["Whose", false, "Whose “kimin” demektir; burada seçim soruluyor."], ["Who", false, "Who “kim” demektir."], ["Where", false, "Where yer sorar; ama burada iki daireden hangisi olduğu soruluyor."]] },
      },
      {
        baslik: "Dönüşlü zamirler",
        metin: "Eylemi yapan ve eylemden etkilenen aynı kişiyse <b>dönüşlü zamir</b> kullanılır: <b>I → myself, you → yourself, he → himself, she → herself, it → itself, we → ourselves, you → yourselves, they → themselves</b>. <b>by + dönüşlü zamir</b> “kendi kendine, yalnız başına” demektir: <b>My brother cleans his room by himself.</b> Ayrıca vurgu için kullanılır: <b>We painted the house ourselves.</b> Sık yapılan hatalar: <b>hisself</b> ve <b>theirselves</b> yanlıştır.",
        ornek: "<b>My little sister can't dress herself, so my mum helps her.</b>",
        durak: { soru: "Boşluğa ne gelir? “They built the garden wall by ___.”", secenekler: [["themselves", true, "Doğru! they → themselves."], ["theirselves", false, "Böyle bir kelime yoktur."], ["themself", false, "they ile çoğul biçim kullanılır: themselves."], ["himself", false, "himself he için kullanılır."]] },
      },
    ],
    uret: {
      "enhom.types": [
        kelimeSor("enhom.types", EV, "Ev türleri: apartment / flat, detached house, cottage, villa, bungalow. Evin bölümleri: kitchen, living room, bedroom, bathroom, garden, balcony."),
        kelimeSor("enhom.types", EV, "What's your address? — It's 15 Gül Street. Put the rubbish in the bin."),
        Q("enhom.types", "aciklama", 1, "Where do we usually cook meals?", "in the kitchen",
          [["in the bedroom", "bilgi", "Yatak odasında uyuruz."], ["in the bathroom", "bilgi", "Banyoda yıkanırız."], ["in the garage", "bilgi", "Garajda araba durur."]],
          "cook = yemek pişirmek.", [
           "🔎 Soruyu anlayalım: Yemek pişirmek evin belli bir bölümünde yapılır.",
           "💡 Hatırlayalım: Bu bölüm mutfaktır.",
           "✏️ Seçenekleri tek tek inceleyelim: “in the bedroom” → Yatak odasında uyuruz.",
           "✏️ “in the bathroom” → Banyoda yıkanırız.",
           "✅ Sonuç: in the kitchen",
           "🔁 Kontrol edelim: Son seçenek “in the garage” de aradığımız cevap değil: Garajda araba durur. Geriye yalnızca “in the kitchen” kalıyor."],
          { kural: "kitchen → cook; bedroom → sleep; bathroom → have a shower; living room → watch TV.", dogruNeden: "Bu bölüm mutfaktır." }),
        Q("enhom.types", "transfer", 1, "Complete the dialogue.<br>— ___<br>— It's 27 Papatya Street, Konya.", "What's your address?",
          [["Where's your address?", "kavrama", "Adres sorulurken “What's your address?” kullanılır."], ["Which is your street?", "kavrama", "Bu soru tam adresi sormaz; cevap bir adres veriyor."], ["Who's your address?", "bilgi", "Who kişi sorar."]],
          "Türkçede “Adresin nerede?” deriz ama İngilizcede farklıdır.", [
           "🔎 Soruyu anlayalım: Cevap bir adres: 27 Papatya Street, Konya.",
           "💡 Hatırlayalım: İngilizcede adres “What” ile sorulur.",
           "✏️ Seçenekleri tek tek inceleyelim: “Where's your address?” → Adres sorulurken “What's your address?” kullanılır.",
           "✏️ “Which is your street?” → Bu soru tam adresi sormaz; cevap bir adres veriyor.",
           "✅ Sonuç: What's your address?",
           "🔁 Kontrol edelim: Son seçenek “Who's your address?” de aradığımız cevap değil: Who kişi sorar. Geriye yalnızca “What's your address?” kalıyor."],
          { kural: "What's your address? — It's 27 Papatya Street.", dogruNeden: "İngilizcede adres “What” ile sorulur." }),
        Q("enhom.types", "uygulama", 2, "Read and answer.<br><i>My grandparents live in a small cottage in a village. It has got a red roof, a chimney and a big garden with apple trees. There isn't a garage because they haven't got a car.</i><br>Which is <b>NOT</b> true?", "The cottage has got a garage.",
          [["The cottage has got a chimney.", "dikkat", "Metinde “a chimney” geçiyor; bu doğru."], ["There are apple trees in the garden.", "dikkat", "Metinde “a big garden with apple trees” yazıyor; bu doğru."], ["The roof is red.", "dikkat", "Metinde “a red roof” yazıyor; bu doğru."]],
          "“There isn't a garage” cümlesine dikkat et.", [
           "🔎 Soruyu anlayalım: Metin: red roof, chimney, big garden with apple trees.",
           "💡 Hatırlayalım: “There isn't a garage” → garaj yok.",
           "✏️ Seçenekleri tek tek inceleyelim: “The cottage has got a chimney.” → Metinde “a chimney” geçiyor; bu doğru.",
           "✏️ “There are apple trees in the garden.” → Metinde “a big garden with apple trees” yazıyor; bu doğru.",
           "✅ Sonuç: Doğru olmayan: The cottage has got a garage.",
           "🔁 Kontrol edelim: Son seçenek “The roof is red.” de aradığımız cevap değil: Metinde “a red roof” yazıyor; bu doğru. Geriye yalnızca “The cottage has got a garage.” kalıyor."],
          { kural: "There is / There are (Theme 1) ve has got ile ev tarif edilir.", dogruNeden: "“There isn't a garage” → garaj yok." }),
        Q("enhom.types", "transfer", 2, "Your family has got five people and two dogs. You want a big garden and a house with no neighbours on either side. Which home is the best?", "a detached house with a garden",
          [["a small flat on the tenth floor", "strateji", "Onuncu kattaki küçük bir dairede bahçe olmaz."], ["a studio apartment in the city centre", "strateji", "Tek odalı daire beş kişilik bir aileye küçük gelir ve bahçesi yoktur."], ["a semi-detached house without a garden", "strateji", "İkiz evin bir yanında komşu vardır ve bu evde bahçe yok."]],
          "“no neighbours on either side” = iki yanında da komşu yok.", [
           "🔎 Soruyu anlayalım: İstekler: büyük bahçe, iki yanında komşu olmayan ev.",
           "💡 Hatırlayalım: Bitişik duvarı olmayan ev müstakil evdir: detached house.",
           "✏️ Seçenekleri tek tek inceleyelim: “a small flat on the tenth floor” → Onuncu kattaki küçük bir dairede bahçe olmaz.",
           "✏️ “a studio apartment in the city centre” → Tek odalı daire beş kişilik bir aileye küçük gelir ve bahçesi yoktur.",
           "✅ Sonuç: a detached house with a garden.",
           "🔁 Kontrol edelim: Son seçenek “a semi-detached house without a garden” de aradığımız cevap değil: İkiz evin bir yanında komşu vardır ve bu evde bahçe yok. Geriye yalnızca “a detached house with a garden” kalıyor."],
          { kural: "detached = müstakil; semi-detached = tek duvarı bitişik ikiz ev.", dogruNeden: "Bitişik duvarı olmayan ev müstakil evdir: detached house." }),
        Q("enhom.types", "baglanti", 2, "Look at the table. <b>Whose home is the biggest?</b>", "Ayşe's",
          [["Can's", "dikkat", "Can'ın evinde 2 yatak odası var."], ["Efe's", "dikkat", "Efe'nin evinde 3 yatak odası var."], ["Lara's", "dikkat", "Lara'nın evinde 1 yatak odası var."]],
          "Yatak odası sayılarını karşılaştır.", [
           "🔎 Soruyu anlayalım: Yatak odaları: Ayşe 5, Can 2, Efe 3, Lara 1.",
           "💡 Hatırlayalım: En çok oda Ayşe'nin evinde.",
           "✏️ Seçenekleri tek tek inceleyelim: “Can's” → Can'ın evinde 2 yatak odası var.",
           "✏️ “Efe's” → Efe'nin evinde 3 yatak odası var.",
           "✅ Sonuç: Ayşe's home is the biggest.",
           "🔁 Kontrol edelim: Son seçenek “Lara's” de aradığımız cevap değil: Lara'nın evinde 1 yatak odası var. Geriye yalnızca “Ayşe's” kalıyor."],
          { gorsel: G.tablo(["Name", "Home", "Bedrooms"], [["Ayşe", "villa", "5"], ["Can", "flat", "2"], ["Efe", "detached house", "3"], ["Lara", "bungalow", "1"]]), kural: "Whose (kimin) + superlative: Whose home is the biggest?", dogruNeden: "En çok oda Ayşe'nin evinde." }),
      ],
      "enhom.which": [
        Q("enhom.which", "uygulama", 1, "Complete the question: <b>— ___ do you prefer, a villa or a cottage? — A cottage. It's cosy.</b>", "Which",
          [["Who", "bilgi", "Who “kim” demektir."], ["Whose", "kavrama", "Whose “kimin” demektir; burada iki seçenek arasından seçim soruluyor."], ["When", "bilgi", "When zaman sorar."]],
          "İki seçenek arasından seçim yapılıyor.", [
           "🔎 Soruyu anlayalım: Soruda iki seçenek var: a villa or a cottage.",
           "💡 Hatırlayalım: Seçenekler arasından seçim Which ile sorulur.",
           "✏️ Seçenekleri tek tek inceleyelim: “Who” → Who “kim” demektir.",
           "✏️ “Whose” → Whose “kimin” demektir; burada iki seçenek arasından seçim soruluyor.",
           "✅ Sonuç: Which do you prefer, a villa or a cottage?",
           "🔁 Kontrol edelim: Son seçenek “When” de aradığımız cevap değil: When zaman sorar. Geriye yalnızca “Which” kalıyor."],
          { kural: "Which … , A or B? → seçim sorusu.", dogruNeden: "Seçenekler arasından seçim Which ile sorulur." }),
        Q("enhom.which", "uygulama", 2, "Complete the answer: <b>— Which house is yours? — The ___ with the blue door.</b>", "one",
          [["ones", "kavrama", "house tekildir → one."], ["it", "bilgi", "“The it” diye bir kullanım yoktur."], ["house's", "kavrama", "’s sahiplik bildirir; tekrar etmemek için one kullanılır."]],
          "house kelimesini tekrar etmemek için ne kullanılır?", [
           "🔎 Soruyu anlayalım: Tekil ismin yerine one kullanılır.",
           "💡 Hatırlayalım: house tekil → the one.",
           "✏️ Seçenekleri tek tek inceleyelim: “ones” → house tekildir → one.",
           "✏️ “it” → “The it” diye bir kullanım yoktur.",
           "✅ Sonuç: The one with the blue door.",
           "🔁 Kontrol edelim: Son seçenek “house's” de aradığımız cevap değil: ’s sahiplik bildirir; tekrar etmemek için one kullanılır. Geriye yalnızca “one” kalıyor."],
          { kural: "Tekil → one (the big one); çoğul → ones (the blue ones).", dogruNeden: "house tekil → the one." }),
        Q("enhom.which", "aciklama", 2, "Look at the table. <b>Which flat is the cheapest?</b>", "Flat B",
          [["Flat A", "dikkat", "Flat A ayda 9.000 TL; daha pahalı."], ["Flat C", "dikkat", "Flat C ayda 12.000 TL; en pahalısıdır."], ["Flat D", "dikkat", "Flat D ayda 8.000 TL; Flat B'den pahalı."]],
          "the cheapest = en ucuz.", [
           "🔎 Soruyu anlayalım: Kiralar: A 9.000, B 7.500, C 12.000, D 8.000 TL.",
           "💡 Hatırlayalım: En küçük değer 7.500 TL (Flat B).",
           "✏️ Seçenekleri tek tek inceleyelim: “Flat A” → Flat A ayda 9.000 TL; daha pahalı.",
           "✏️ “Flat C” → Flat C ayda 12.000 TL; en pahalısıdır.",
           "✅ Sonuç: The cheapest flat is Flat B.",
           "🔁 Kontrol edelim: Son seçenek “Flat D” de aradığımız cevap değil: Flat D ayda 8.000 TL; Flat B'den pahalı. Geriye yalnızca “Flat B” kalıyor."],
          { gorsel: G.tablo(["Flat", "Rooms", "Rent (per month)"], [["Flat A", "3", "9.000 TL"], ["Flat B", "2", "7.500 TL"], ["Flat C", "4", "12.000 TL"], ["Flat D", "2", "8.000 TL"]]), kural: "cheap → cheaper → the cheapest; expensive → more expensive → the most expensive.", dogruNeden: "En küçük değer 7.500 TL (Flat B)." }),
        Q("enhom.which", "transfer", 2, "Complete the dialogue.<br>— Which room is your favourite?<br>— ___", "The living room. We watch films there together.",
          [["Yes, it is.", "kavrama", "Which sorusuna evet / hayır ile cevap verilmez."], ["It's my mum's.", "kavrama", "Bu cevap “Whose room is it?” sorusuna uyar."], ["It's on Lale Street.", "kavrama", "Bu cevap “Where is your house?” sorusuna uyar."]],
          "Which sorusu bir seçim ister.", [
           "🔎 Soruyu anlayalım: Hangi oda en sevdiğin?",
           "💡 Hatırlayalım: Cevap bir oda adı olmalı.",
           "✏️ Seçenekleri tek tek inceleyelim: “Yes, it is.” → Which sorusuna evet / hayır ile cevap verilmez.",
           "✏️ “It's my mum's.” → Bu cevap “Whose room is it?” sorusuna uyar.",
           "✅ Sonuç: The living room. We watch films there together.",
           "🔁 Kontrol edelim: Son seçenek “It's on Lale Street.” de aradığımız cevap değil: Bu cevap “Where is your house?” sorusuna uyar. Geriye yalnızca “The living room. We watch films there together.” kalıyor."],
          { kural: "Which sorusuna seçeneklerden birini söyleyerek cevap verilir.", dogruNeden: "Cevap bir oda adı olmalı." }),
        Q("enhom.which", "uygulama", 2, "Read and answer.<br><i>Mira lives in a block of flats. Her flat is on the third floor. Next to her flat, there is Mr Demir's flat. On the fourth floor, there are two flats: the Kayas' and the Şahins'.</i><br>Which floor is Mira's flat on?", "the third floor",
          [["the fourth floor", "dikkat", "Dördüncü katta Kayalar ve Şahinler oturuyor."], ["the first floor", "dikkat", "Metinde birinci kat geçmiyor."], ["the second floor", "dikkat", "Metinde “on the third floor” yazıyor."]],
          "“on the … floor” ifadesini bul.", [
           "🔎 Soruyu anlayalım: Metinde: Her flat is on the third floor.",
           "💡 Hatırlayalım: third = üçüncü (sıra sayısı, Theme 2).",
           "✏️ Seçenekleri tek tek inceleyelim: “the fourth floor” → Dördüncü katta Kayalar ve Şahinler oturuyor.",
           "✏️ “the first floor” → Metinde birinci kat geçmiyor.",
           "✅ Sonuç: the third floor.",
           "🔁 Kontrol edelim: Son seçenek “the second floor” de aradığımız cevap değil: Metinde “on the third floor” yazıyor. Geriye yalnızca “the third floor” kalıyor."],
          { kural: "on the first / second / third floor (sıra sayısı + floor).", dogruNeden: "third = üçüncü (sıra sayısı, Theme 2)." }),
      ],
      "enhom.reflex": [
        donuslu, donuslu, donuslu,
        Q("enhom.reflex", "aciklama", 1, "What does <b>by myself</b> mean?", "kendi kendime, yalnız başıma",
          [["benimle birlikte", "kavrama", "“with me” benimle demektir."], ["benim için", "kavrama", "“for me” benim için demektir."], ["benim yanımda", "kavrama", "“next to me” benim yanımda demektir."]],
          "“I did it by myself.” cümlesini düşün.", [
           "🔎 Soruyu anlayalım: myself = kendim.",
           "💡 Hatırlayalım: by + dönüşlü zamir = kendi kendine, yardımsız.",
           "✏️ by myself = kendi kendime.",
           "✏️ Seçenekleri tek tek inceleyelim: “benimle birlikte” → “with me” benimle demektir.",
           "✏️ “benim için” → “for me” benim için demektir.",
           "✅ Sonuç: Doğru cevap “kendi kendime, yalnız başıma”.",
           "🔁 Kontrol edelim: Son seçenek “benim yanımda” de aradığımız cevap değil: “next to me” benim yanımda demektir. Geriye yalnızca “kendi kendime, yalnız başıma” kalıyor."],
          { kural: "by myself / by himself… = yalnız başına, kimseden yardım almadan.", dogruNeden: "by + dönüşlü zamir = kendi kendine, yardımsız." }),
        Q("enhom.reflex", "transfer", 2, "Complete the dialogue.<br>— Who painted your bedroom walls?<br>— We painted them ___! It took two days.", "ourselves",
          [["ourself", "bilgi", "we çoğul olduğu için ourselves olur."], ["us", "kavrama", "us nesne zamiridir; vurgu için dönüşlü zamir gerekir."], ["themselves", "kavrama", "themselves they için kullanılır."]],
          "Özne “We”.", [
           "🔎 Soruyu anlayalım: Özne we.",
           "💡 Hatırlayalım: we → ourselves.",
           "✏️ Seçenekleri tek tek inceleyelim: “ourself” → we çoğul olduğu için ourselves olur.",
           "✏️ “us” → us nesne zamiridir; vurgu için dönüşlü zamir gerekir.",
           "✅ Sonuç: We painted them ourselves!",
           "🔁 Kontrol edelim: Son seçenek “themselves” de aradığımız cevap değil: themselves they için kullanılır. Geriye yalnızca “ourselves” kalıyor."],
          { kural: "we → ourselves (vurgu: biz kendimiz).", dogruNeden: "we → ourselves." }),
        Q("enhom.reflex", "baglanti", 2, "Which sentence is correct?", "My brother tidies his room by himself.",
          [["My brother tidies his room by hisself.", "bilgi", "“hisself” diye bir kelime yoktur."], ["My brother tidy his room by himself.", "kavrama", "my brother = he → tidies."], ["My brother tidies his room by herself.", "dikkat", "brother erkektir → himself."]],
          "Fiil uyumunu ve zamiri kontrol et.", [
           "🔎 Soruyu anlayalım: my brother = he → fiil -es alır: tidies.",
           "💡 Hatırlayalım: he → himself.",
           "✏️ Seçenekleri tek tek inceleyelim: “My brother tidies his room by hisself.” → “hisself” diye bir kelime yoktur.",
           "✏️ “My brother tidy his room by himself.” → my brother = he → tidies.",
           "✅ Sonuç: My brother tidies his room by himself.",
           "🔁 Kontrol edelim: Son seçenek “My brother tidies his room by herself.” de aradığımız cevap değil: brother erkektir → himself. Geriye yalnızca “My brother tidies his room by himself.” kalıyor."],
          { kural: "he → himself (hisself yanlış), they → themselves (theirselves yanlış).", dogruNeden: "he → himself." }),
      ],
    },
  });
})();
