/* 6. sınıf İngilizce — Theme 7 (Life in Nature & Global Problems) ve Theme 8 (Life in the Universe & Future).
 * Konular: Activities in Nature · Environmental Problems and Solutions · Planets and the Earth ·
 * Weather and Life on Earth in the Future.
 */
(function () {
  "use strict";
  const { R, sec, karistir, S, Q, G } = OGR;

  /* ---------------------------- Ortak üreteçler ---------------------------- */
  /* Sözlükten kelime anlamı sorusu (İngilizce→Türkçe ya da Türkçe→İngilizce). */
  function kelime(kaz, liste) {
    return z => {
      const k = karistir(liste).slice(0, 4), [en, tr] = k[0], diger = k.slice(1);
      if (Math.random() < 0.5)
        return S({ kaz, duzey: "hatirlama", zorluk: 1, soru: `What does “<b>${en}</b>” mean in Turkish?`, dogru: tr,
          yanlis: diger.map(([e, t]) => [t, "bilgi", `“${t}” kelimesinin İngilizcesi “${e}” olur.`]),
          ipucu: `“${en}” kelimesini konunun örnek cümlelerinde hatırlamaya çalış.`,
          cozum: [`Soruda “${en}” kelimesinin Türkçe anlamı soruluyor.`, `Diğer seçenekler: ${diger.map(([e, t]) => `${t} = ${e}`).join(", ")}.`, `Doğru cevap: ${en} = ${tr}.`],
          kural: `${en} = ${tr}` });
      return S({ kaz, duzey: "hatirlama", zorluk: 1, soru: `Which word means “<b>${tr}</b>” in English?`, dogru: en,
        yanlis: diger.map(([e, t]) => [e, "bilgi", `“${e}” kelimesi “${t}” demektir.`]),
        ipucu: "Seçeneklerdeki kelimelerin Türkçe anlamlarını tek tek düşün.",
        cozum: [`Soruda “${tr}” kelimesinin İngilizcesi soruluyor.`, `Diğer seçenekler: ${diger.map(([e, t]) => `${e} = ${t}`).join(", ")}.`, `Doğru cevap: ${tr} = ${en}.`],
        kural: `${en} = ${tr}` });
    };
  }

  /* ======================= 1) ACTIVITIES IN NATURE ======================= */
  /* [yalın, geçmiş, -ing, 3. tekil, yanlış düzenli biçim (düzensizse), cümle, Türkçe] */
  const FIILLER = [
    ["go", "went", "going", "goes", "goed", "We ___ camping in the forest last summer.", "gitmek"],
    ["swim", "swam", "swimming", "swims", "swimmed", "My brother ___ in the lake yesterday.", "yüzmek"],
    ["see", "saw", "seeing", "sees", "seed", "I ___ a beautiful waterfall two days ago.", "görmek"],
    ["ride", "rode", "riding", "rides", "rided", "They ___ their bikes in the countryside last weekend.", "sürmek"],
    ["make", "made", "making", "makes", "maked", "Dad ___ a campfire last night.", "yapmak"],
    ["take", "took", "taking", "takes", "taked", "Elif ___ a lot of photos on the trip last Sunday.", "almak / çekmek"],
    ["catch", "caught", "catching", "catches", "catched", "Grandpa ___ three fish at the river yesterday.", "yakalamak"],
    ["eat", "ate", "eating", "eats", "eated", "We ___ sandwiches by the lake last Saturday.", "yemek"],
    ["sleep", "slept", "sleeping", "sleeps", "sleeped", "We ___ in a tent last night.", "uyumak"],
    ["have", "had", "having", "has", "haved", "The children ___ a picnic in the park yesterday.", "sahip olmak / yapmak"],
    ["climb", "climbed", "climbing", "climbs", null, "Ali ___ the mountain with his father last month.", "tırmanmak"],
    ["hike", "hiked", "hiking", "hikes", null, "We ___ along the river last weekend.", "doğa yürüyüşü yapmak"],
    ["camp", "camped", "camping", "camps", null, "My family ___ near the sea last summer.", "kamp yapmak"],
    ["sail", "sailed", "sailing", "sails", null, "Zeynep ___ a small boat on the lake yesterday.", "yelkenliyle gezmek"],
    ["visit", "visited", "visiting", "visits", null, "We ___ a national park three days ago.", "ziyaret etmek"],
    ["watch", "watched", "watching", "watches", null, "They ___ the birds in the forest yesterday morning.", "izlemek"],
    ["stop", "stopped", "stopping", "stops", null, "The bus ___ near the lake last Sunday.", "durmak"],
    ["enjoy", "enjoyed", "enjoying", "enjoys", null, "I ___ the trip very much last week.", "keyif almak"],
  ];
  const NAT_SOZ = [["camping", "kamp yapma"], ["hiking", "doğa yürüyüşü"], ["sailing", "yelkenli gezisi"], ["snowboarding", "kar sörfü"], ["fishing", "balık tutma"], ["climbing", "tırmanma"],
    ["adventure", "macera"], ["tent", "çadır"], ["campfire", "kamp ateşi"], ["forest", "orman"], ["lake", "göl"], ["river", "nehir"], ["waterfall", "şelale"], ["valley", "vadi"],
    ["sleeping bag", "uyku tulumu"], ["backpack", "sırt çantası"], ["map", "harita"], ["torch", "el feneri"], ["picnic", "piknik"], ["countryside", "kırsal bölge"], ["canoeing", "kano yapma"], ["rafting", "rafting (bot ile akıntıda iniş)"]];

  KONU_EKLE("en", {
    id: "en_nature", tema: "en7", ad: "Activities in Nature", tr: "Doğada etkinlikler",
    kazanimlar: [
      { id: "ennat2.past", ad: "Simple past: düzenli ve düzensiz fiiller" },
      { id: "ennat2.vocab", ad: "Doğa etkinlikleri ve kamp kelimeleri" },
      { id: "ennat2.talk", ad: "Geçmiş tatili anlatma: Did you…? / Where did you go? / soru eklentileri" },
    ],
    sozluk: NAT_SOZ,
    anlatim: [
      { baslik: "Doğada neler yapabiliriz?",
        metin: "Doğa etkinliklerinin çoğu <b>go + fiil-ing</b> kalıbıyla söylenir: <b>go camping</b> (kampa gitmek), <b>go hiking</b> (doğa yürüyüşüne gitmek), <b>go sailing</b> (yelkenliyle gezmeye gitmek), <b>go fishing</b> (balığa gitmek), <b>go snowboarding</b> (kar sörfüne gitmek). Kampa giderken <b>a tent</b> (çadır), <b>a sleeping bag</b> (uyku tulumu), <b>a backpack</b> (sırt çantası), <b>a map</b> (harita) ve <b>a torch</b> (el feneri) alırız. Heyecanlı ve tehlikeli olabilen etkinliklere <b>adventure</b> (macera) denir.",
        ornek: "<b>We go hiking every Sunday.</b> — Her pazar doğa yürüyüşüne gideriz.<br><b>Snowboarding is an adventure for me.</b> — Kar sörfü benim için bir macera.",
        durak: { soru: "Which one do you need to sleep outside at a camp?", secenekler: [["a tent", true, "Çadır (tent) kampta içinde uyuduğumuz yerdir."], ["a map", false, "Harita (map) yol bulmak içindir, içinde uyunmaz."], ["a torch", false, "El feneri (torch) karanlıkta görmek içindir."], ["a boat", false, "Tekne (boat) suda gezmek içindir."]] } },
      { baslik: "Simple past: düzenli fiiller (-ed)",
        metin: "Geçmişte olup bitmiş olayları <b>simple past</b> ile anlatırız. Düzenli (regular) fiillere <b>-ed</b> ekleriz: climb → <b>climbed</b>, camp → <b>camped</b>, visit → <b>visited</b>. Fiil -e ile bitiyorsa yalnızca <b>-d</b> eklenir: hike → <b>hiked</b>. Kısa ve sessiz harfle biten fiillerde son harf ikilenir: stop → <b>stopped</b>. Sessiz harf + y ile bitenlerde y → i olur: study → <b>studied</b>; sesli harf + y ise değişmez: enjoy → <b>enjoyed</b>. Geçmiş zaman ifadeleri: <b>yesterday, last week, last summer, two days ago</b>.",
        ornek: "<b>We camped near the lake last summer.</b> — Geçen yaz gölün yakınında kamp yaptık.<br><b>I enjoyed the trip.</b> — Gezi hoşuma gitti.",
        durak: { soru: "Which one is the correct simple past form of “stop”?", secenekler: [["stopped", true, "Kısa fiillerde son sessiz harf ikilenir: stop → stopped."], ["stoped", false, "Son harf “p” ikilenmeli: stopped."], ["stopping", false, "Bu -ing hâlidir, geçmiş zaman değildir."], ["stops", false, "Bu geniş zamanın üçüncü tekil hâlidir."]] } },
      { baslik: "Simple past: düzensiz fiiller ve sorular",
        metin: "Bazı fiiller <b>-ed</b> almaz, ezberlenir: go → <b>went</b>, swim → <b>swam</b>, see → <b>saw</b>, ride → <b>rode</b>, make → <b>made</b>, take → <b>took</b>, eat → <b>ate</b>, sleep → <b>slept</b>, catch → <b>caught</b>, have → <b>had</b>. Soru ve olumsuzda <b>did / didn't</b> kullanılır ve fiil yalın hâle döner: <b>Did you go camping?</b> — <b>Yes, I did. / No, I didn't.</b> · <b>I didn't swim.</b> Soru eklentisi (question tag) olumlu cümlede <b>didn't</b>, olumsuz cümlede <b>did</b> ile yapılır: <b>You went hiking, didn't you?</b> · <b>She didn't swim, did she?</b>",
        ornek: "<b>Where did you go last weekend?</b> — <b>I went to Uludağ. I went snowboarding.</b>",
        durak: { soru: "Choose the correct question: “___ you see the waterfall?”", secenekler: [["Did", true, "Geçmiş zaman sorusu “Did” ile başlar ve fiil yalın kalır."], ["Do", false, "“Do” geniş zaman sorusudur."], ["Were", false, "“Were” ile soru “see” gibi bir fiille kurulmaz."], ["Was", false, "“Was” be fiilinin geçmişidir; ana fiil “see” için “Did” gerekir."]] } },
    ],
    uret: {
      "ennat2.past": [
        z => { const [b, p, ing, s3, yanlisReg, cumle] = sec(FIILLER);
          const yanlis = [[b, "kavrama", `Cümlede geçmiş zaman ifadesi var; yalın hâl “${b}” değil, geçmiş hâl gerekir.`], [ing, "bilgi", `“${ing}” tek başına geçmişi anlatmaz; simple past için fiilin 2. hâli kullanılır.`], [s3, "kavrama", `“${s3}” geniş zamandır; cümle geçmişte olmuş bir olayı anlatıyor.`]];
          if (yanlisReg) yanlis.unshift([yanlisReg, "bilgi", `“${b}” düzensiz bir fiildir; -ed almaz, geçmiş hâli “${p}” olur.`]);
          return S({ kaz: "ennat2.past", duzey: "uygulama", zorluk: yanlisReg ? 2 : 1, soru: `Choose the correct answer:<br><b>${cumle}</b>`, dogru: p, yanlis: yanlis.slice(0, 3),
            ipucu: "Cümledeki zaman ifadesine bak: yesterday, last…, …ago geçmiş zamandır.",
            cozum: ["Cümlede geçmiş zaman ifadesi (yesterday / last … / … ago) var.", "Geçmişte olup biten olaylar simple past ile anlatılır.", yanlisReg ? `“${b}” düzensiz fiildir: ${b} → ${p}.` : `“${b}” düzenli fiildir: ${b} → ${p}.`],
            kural: yanlisReg ? `Düzensiz fiil: ${b} → ${p}` : "Düzenli fiiller: fiil + -ed (hike → hiked, stop → stopped)." }); },
        z => { const duz = karistir(FIILLER.filter(f => f[4])), [b, p, , , yr] = duz[0];
          return S({ kaz: "ennat2.past", duzey: "hatirlama", zorluk: 1, soru: `What is the simple past form of “<b>${b}</b>”?`, dogru: p,
            yanlis: [[yr, "bilgi", `“${b}” düzensiz fiildir; -ed eklenmez.`], [duz[1][1], "dikkat", `“${duz[1][1]}”, “${duz[1][0]}” fiilinin geçmiş hâlidir.`], [duz[2][1], "dikkat", `“${duz[2][1]}”, “${duz[2][0]}” fiilinin geçmiş hâlidir.`]],
            ipucu: "Bu fiil düzensizdir; -ed ile yapılmaz.", cozum: [`“${b}” fiili düzensiz (irregular) fiillerdendir.`, "Düzensiz fiillerin geçmiş hâlleri ezberlenir.", `${b} → ${p}`], kural: "Düzensiz fiillerin geçmiş hâlleri ezberlenir: go–went, see–saw, swim–swam…" }); },
        Q("ennat2.past", "aciklama", 1, "Which verb is <b>regular</b> (takes -ed in the past)?", "climb",
          [["swim", "bilgi", "swim düzensizdir: swam."], ["catch", "bilgi", "catch düzensizdir: caught."], ["sleep", "bilgi", "sleep düzensizdir: slept."]],
          "Hangi fiilin geçmişi -ed ile yapılır?", ["Fiillerin geçmiş hâllerini düşün: swim → swam, catch → caught, sleep → slept.", "climb → climbed; -ed almıştır.", "Düzenli fiil: climb."], { kural: "Düzenli fiil: -ed alır. Düzensiz fiil: farklı bir biçime dönüşür." }),
        Q("ennat2.past", "uygulama", 2, "Choose the correct negative sentence.", "We didn't go sailing yesterday.",
          [["We didn't went sailing yesterday.", "kavrama", "“didn't” sonrasında fiil yalın hâle döner: go."], ["We don't went sailing yesterday.", "kavrama", "Geçmiş zamanın olumsuzu “didn't” ile yapılır."], ["We not went sailing yesterday.", "bilgi", "Olumsuz için yardımcı fiil “didn't” gerekir."]],
          "Olumsuz geçmiş zaman: didn't + fiilin yalın hâli.", ["Simple past olumsuzu “didn't” ile kurulur.", "“didn't” den sonra fiil yalın hâlde kullanılır: go.", "Doğru cümle: We didn't go sailing yesterday."], { kural: "Olumsuz: Subject + didn't + V1 (I didn't swim)." }),
        Q("ennat2.past", "uygulama", 2, "Read and choose the correct verbs:<br><i>Last summer, my family ___ (1) to the Black Sea. We ___ (2) in a tent near a river.</i>", "went – slept",
          [["go – sleep", "kavrama", "“Last summer” geçmiş zamandır; fiillerin geçmiş hâli gerekir."], ["goed – sleeped", "bilgi", "go ve sleep düzensizdir: went, slept."], ["went – sleeping", "kavrama", "İkinci boşluk da geçmiş zaman olmalı: slept."]],
          "“Last summer” hangi zamanı gösterir?", ["“Last summer” geçmiş zaman ifadesidir.", "go → went, sleep → slept (ikisi de düzensiz).", "Doğru cevap: went – slept."], { kural: "Paragraf geçmişte geçiyorsa bütün fiiller simple past olur." }),
        Q("ennat2.past", "baglanti", 2, "Theme 6'dan hatırla: “ate” hangi fiilin geçmiş hâlidir? Choose: <b>We ___ fish by the river last night.</b>", "ate",
          [["eated", "bilgi", "eat düzensizdir; -ed almaz."], ["eat", "kavrama", "“last night” geçmiş zamandır."], ["eats", "kavrama", "“eats” geniş zamandır ve “we” ile kullanılmaz."]],
          "eat düzenli mi düzensiz mi?", ["“last night” geçmiş zaman ifadesidir.", "eat düzensiz fiildir: eat → ate.", "Cevap: We ate fish by the river last night."], { kural: "eat → ate, drink → drank, have → had" }),
      ],
      "ennat2.vocab": [
        kelime("ennat2.vocab", NAT_SOZ),
        Q("ennat2.vocab", "aciklama", 1, "You need a board and a snowy mountain for this activity. What is it?", "snowboarding",
          [["sailing", "kavrama", "Sailing için tekne ve su gerekir."], ["hiking", "kavrama", "Hiking için yalnızca yürüyüş ayakkabısı yeterlidir."], ["fishing", "kavrama", "Fishing için olta ve su gerekir."]],
          "Kar ve tahta (board) birlikte düşün.", ["Etkinlik için bir tahta (board) ve karlı dağ gerekiyor.", "snow + board = snowboarding (kar sörfü).", "Cevap: snowboarding."], { kural: "snowboarding = kar sörfü, sailing = yelkenli gezisi, hiking = doğa yürüyüşü" }),
        Q("ennat2.vocab", "uygulama", 1, "Complete: <b>It's dark in the forest. Can you give me the ___, please?</b>", "torch",
          [["tent", "kavrama", "Çadır karanlıkta görmeyi sağlamaz."], ["map", "kavrama", "Harita yol bulmak içindir; karanlıkta ışık vermez."], ["backpack", "kavrama", "Sırt çantası eşya taşımak içindir."]],
          "Karanlıkta ne işe yarar?", ["Cümlede ormanın karanlık olduğu söyleniyor.", "Karanlıkta görmek için el feneri (torch) gerekir.", "Cevap: torch."], { kural: "torch (İng.) = flashlight (Amerikan İng.) = el feneri" }),
        Q("ennat2.vocab", "uygulama", 1, "Which word does <b>not</b> belong to the group?<br><i>lake – river – waterfall – tent</i>", "tent",
          [["lake", "dikkat", "Göl bir doğa/su yeridir; gruba uyar."], ["river", "dikkat", "Nehir bir doğa/su yeridir; gruba uyar."], ["waterfall", "dikkat", "Şelale bir doğa/su yeridir; gruba uyar."]],
          "Üçü doğadaki su yerleri, biri kamp malzemesi.", ["lake, river ve waterfall doğadaki su kaynaklarıdır.", "tent ise bir kamp malzemesidir.", "Gruba uymayan: tent."], { kural: "Doğa yerleri: lake, river, waterfall, forest, valley. Kamp malzemeleri: tent, torch, map, sleeping bag." }),
        Q("ennat2.vocab", "uygulama", 2, "Complete with the correct verb: <b>Let's go ___ on the lake. We have a boat!</b>", "sailing",
          [["hiking", "kavrama", "Hiking yürüyüştür; tekne gerekmez."], ["snowboarding", "kavrama", "Snowboarding karda yapılır."], ["climbing", "kavrama", "Climbing dağa ya da kayaya tırmanmaktır."]],
          "Göl ve tekne ile hangi etkinlik yapılır?", ["Cümlede göl (lake) ve tekne (boat) geçiyor.", "Teknenin suda yelkenle gitmesi sailing'dir.", "Cevap: go sailing."], { kural: "go + V-ing: go sailing, go hiking, go camping, go fishing." }),
        z => { const veri = [["Mon", R(2, 9)], ["Tue", R(2, 9)], ["Wed", R(2, 9)], ["Thu", R(2, 9)], ["Fri", R(2, 9)]];
          const ust = [...veri].sort((a, b) => b[1] - a[1]); if (ust[0][1] === ust[1][1]) return null;
          const ad = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" }, act = sec(["went hiking", "went fishing", "went sailing"]);
          const dig = veri.filter(v => v[0] !== ust[0][0]).slice(0, 3);
          return S({ kaz: "ennat2.vocab", duzey: "uygulama", zorluk: 2, soru: `The graph shows how many students ${act} last week. On which day did the most students go?`, gorsel: G.sutun(veri, { baslik: "Students who " + act, birim: "students" }),
            dogru: ad[ust[0][0]], yanlis: dig.map(v => [ad[v[0]], "dikkat", `${ad[v[0]]} günü ${v[1]} öğrenci var; en yüksek sütun bu değil.`]),
            ipucu: "En uzun sütunu bul.", cozum: ["Grafikte her sütun bir günü gösterir.", `En uzun sütun ${ad[ust[0][0]]} (${ust[0][1]} öğrenci).`, `Cevap: ${ad[ust[0][0]]}.`], kural: "the most = en çok" }); },
      ],
      "ennat2.talk": [
        Q("ennat2.talk", "transfer", 1, "Complete the dialogue:<br>— Did you go camping last weekend?<br>— ___ We stayed at home because it was rainy.", "No, I didn't.",
          [["Yes, I did.", "dikkat", "Kişi evde kaldığını söylüyor; kampa gitmemiş."], ["No, I don't.", "kavrama", "Soru geçmiş zamanda (Did); kısa cevap da “didn't” olmalı."], ["Yes, I was.", "kavrama", "“Did” ile sorulan soruya “did/didn't” ile cevap verilir."]],
          "İkinci cümlede ne yaptığını söylüyor?", ["Soru “Did you…?” ile soruluyor; kısa cevap “Yes, I did / No, I didn't” olur.", "Kişi evde kaldığını söylüyor, yani kampa gitmedi.", "Cevap: No, I didn't."], { kural: "Did you…? → Yes, I did. / No, I didn't." }),
        Q("ennat2.talk", "transfer", 1, "Complete the dialogue:<br>— ___ did you go last summer?<br>— We went to Antalya.", "Where",
          [["When", "kavrama", "“When” zaman sorar; cevap bir yer (Antalya)."], ["What", "kavrama", "“What” ne olduğunu sorar; yer için “Where” kullanılır."], ["Who", "kavrama", "“Who” kişi sorar."]],
          "Cevap bir yer mi, zaman mı?", ["Cevap “Antalya”, yani bir yer.", "Yer sormak için “Where” kullanılır.", "Cevap: Where did you go last summer?"], { kural: "Where = nerede/nereye, When = ne zaman, Who = kim, What = ne" }),
        Q("ennat2.talk", "uygulama", 2, "Choose the correct question tag: <b>You climbed the mountain, ___?</b>", "didn't you",
          [["did you", "kavrama", "Cümle olumlu; soru eklentisi olumsuz olmalı."], ["don't you", "kavrama", "Cümle geçmiş zamanda; “didn't” gerekir."], ["weren't you", "bilgi", "Ana fiil “climbed”; yardımcı fiil “did” olur, “were” değil."]],
          "Olumlu cümle → olumsuz eklenti.", ["Cümle olumlu ve simple past (climbed).", "Simple past yardımcı fiili “did”dir; olumlu cümleye olumsuz eklenti gelir.", "Cevap: didn't you?"], { kural: "Olumlu geçmiş cümle → didn't …? (You went, didn't you?)" }),
        Q("ennat2.talk", "uygulama", 2, "Choose the correct question tag: <b>Mert didn't go fishing, ___?</b>", "did he",
          [["didn't he", "kavrama", "Cümle olumsuz; eklenti olumlu olmalı."], ["does he", "kavrama", "Cümle geçmiş zamanda; “did” gerekir."], ["did she", "dikkat", "Mert erkek ismidir; “he” kullanılır."]],
          "Olumsuz cümle → olumlu eklenti.", ["Cümle olumsuz (didn't go).", "Olumsuz cümleye olumlu eklenti gelir: did.", "Mert = he; cevap: did he?"], { kural: "Olumsuz geçmiş cümle → did …? (She didn't swim, did she?)" }),
        Q("ennat2.talk", "transfer", 2, "Read the text and answer the question.<br><i>Hi, I'm Can. Last weekend I went to a national park with my class. We hiked for three hours and saw a big waterfall. In the evening we made a campfire and ate sausages. It was a great adventure!</i><br>What did Can do in the evening?", "He made a campfire.",
          [["He saw a waterfall.", "dikkat", "Şelaleyi gün içinde yürüyüş sırasında gördü."], ["He hiked for three hours.", "dikkat", "Yürüyüş akşam değil, gündüz yapıldı."], ["He went sailing.", "dikkat", "Metinde yelkenli gezisinden söz edilmiyor."]],
          "“In the evening” ifadesini metinde bul.", ["Metinde “In the evening” cümlesini bul.", "“In the evening we made a campfire and ate sausages.”", "Cevap: He made a campfire."], { kural: "Okuma sorularında sorudaki anahtar ifadeyi (in the evening) metinde ara." }),
        Q("ennat2.talk", "transfer", 2, "Which answer is correct?<br>— What did you do in Uludağ?<br>— ___", "I went snowboarding.",
          [["I go snowboarding.", "kavrama", "Soru geçmiş zamanda; cevap da geçmiş olmalı."], ["I am going snowboarding.", "kavrama", "Bu şimdiki zaman / gelecek planıdır."], ["Yes, I did.", "kavrama", "“What” ile başlayan soruya Yes/No ile cevap verilmez."]],
          "Soru hangi zamanda?", ["Soru “What did you do…?” — geçmiş zaman.", "Cevapta fiilin geçmiş hâli kullanılır: went.", "Cevap: I went snowboarding."], { kural: "What did you do? → I + V2 (I went…, I visited…)" }),
      ],
    },
  });

  /* ================ 2) ENVIRONMENTAL PROBLEMS AND SOLUTIONS ================ */
  const KURALLAR = [
    ["throw rubbish into the sea", false], ["recycle paper, glass and plastic", true], ["cut down trees in the forest", false], ["turn off the lights in empty rooms", true],
    ["waste water", false], ["plant more trees", true], ["leave plastic bags in nature", false], ["save energy", true],
    ["start a fire in the forest", false], ["use both sides of the paper", true], ["pick flowers in the national park", false], ["put the rubbish in the bin", true],
    ["leave the tap running for a long time", false], ["take the rubbish home after a picnic", true],
  ];
  const ENV_SOZ = [["pollution", "kirlilik"], ["recycling", "geri dönüşüm"], ["global warming", "küresel ısınma"], ["deforestation", "ormansızlaşma"], ["energy", "enerji"], ["danger", "tehlike"],
    ["effect", "etki / sonuç"], ["solution", "çözüm"], ["problem", "sorun"], ["rubbish", "çöp"], ["waste", "atık / israf etmek"], ["plastic", "plastik"], ["environment", "çevre"],
    ["air pollution", "hava kirliliği"], ["water pollution", "su kirliliği"], ["endangered animals", "nesli tükenmekte olan hayvanlar"], ["save", "tasarruf etmek / kurtarmak"],
    ["protect", "korumak"], ["reuse", "yeniden kullanmak"], ["reduce", "azaltmak"], ["factory", "fabrika"], ["climate", "iklim"], ["drought", "kuraklık"]];
  const OZNE = [["I", "have to"], ["You", "have to"], ["We", "have to"], ["They", "have to"], ["My mother", "has to"], ["He", "has to"], ["She", "has to"], ["Our school", "has to"]];

  KONU_EKLE("en", {
    id: "en_environment", tema: "en7", ad: "Environmental Problems and Solutions", tr: "Çevre sorunları ve çözümler",
    kazanimlar: [
      { id: "enenv.must", ad: "must / mustn't / have to ile kurallar ve zorunluluklar" },
      { id: "enenv.vocab", ad: "Çevre sorunları kelimeleri" },
      { id: "enenv.solution", ad: "Sorunlar, sonuçları ve çözüm önerileri" },
    ],
    sozluk: ENV_SOZ,
    anlatim: [
      { baslik: "Dünyamızın sorunları",
        metin: "Dünyada pek çok çevre sorunu (environmental problem) vardır: <b>air pollution</b> (hava kirliliği), <b>water pollution</b> (su kirliliği), <b>global warming</b> (küresel ısınma), <b>deforestation</b> (ormansızlaşma, ağaçların kesilmesi) ve <b>endangered animals</b> (nesli tükenmekte olan hayvanlar). Bu sorunların <b>effects</b> (etkileri/sonuçları) vardır: buzullar erir, hayvanlar evsiz kalır, insanlar hastalanır. Her soruna bir <b>solution</b> (çözüm) bulabiliriz.",
        ornek: "<b>Factories cause air pollution.</b> — Fabrikalar hava kirliliğine neden olur.<br><b>Global warming is a big danger for polar bears.</b> — Küresel ısınma kutup ayıları için büyük bir tehlikedir.",
        gorsel: G.tablo(["Problem", "Effect", "Solution"], [["air pollution", "people get ill", "use public transport"], ["deforestation", "animals lose their homes", "plant trees"], ["water pollution", "fish die", "don't throw rubbish into rivers"]]),
        durak: { soru: "“Deforestation” ne demektir?", secenekler: [["Ormanların yok edilmesi (ormansızlaşma)", true, "deforestation: ağaçların kesilerek ormanların yok olması."], ["Geri dönüşüm", false, "Geri dönüşüm “recycling” kelimesidir."], ["Küresel ısınma", false, "Küresel ısınma “global warming”dir."], ["Su kirliliği", false, "Su kirliliği “water pollution”dır."]] } },
      { baslik: "must ve mustn't: kurallar",
        metin: "Kuralları ve yapmamız gereken şeyleri <b>must</b> (-meli/-malı), yasakları <b>mustn't</b> (must not; -memeli/-mamalı) ile söyleriz. must'tan sonra fiil <b>yalın</b> gelir ve her öznede aynı kalır: <b>I must, he must, they must</b>. “must to” ya da “musts” yanlıştır. Parklarda ve okullarda kurallar çoğunlukla must / mustn't ile yazılır.",
        ornek: "<b>We must recycle plastic.</b> — Plastiği geri dönüştürmeliyiz.<br><b>You mustn't throw rubbish into the sea.</b> — Denize çöp atmamalısın.",
        durak: { soru: "Choose the correct rule: “You ___ cut down trees.”", secenekler: [["mustn't", true, "Ağaç kesmek çevreye zarar verir; bu bir yasaktır: mustn't."], ["must", false, "Ağaç kesmek bir zorunluluk değildir, yasaklanmalıdır."], ["must to", false, "must'tan sonra “to” gelmez."], ["musts", false, "must hiçbir öznede -s almaz."]] } },
      { baslik: "have to / has to ve çözüm önerileri",
        metin: "<b>have to / has to</b> da zorunluluk anlatır (-mak zorunda). <b>I, you, we, they</b> ile <b>have to</b>; <b>he, she, it</b> ile <b>has to</b> kullanılır. Sonrasında fiil yalın gelir: <b>She has to save water.</b> Çözüm önerirken şu kalıpları kullanabiliriz: <b>We must…</b>, <b>We should…</b>, <b>Let's…</b>. Üç altın kural: <b>reduce</b> (azalt), <b>reuse</b> (yeniden kullan), <b>recycle</b> (geri dönüştür).",
        ornek: "<b>We have to protect the forests.</b> — Ormanları korumak zorundayız.<br><b>He has to turn off the tap.</b> — Musluğu kapatmak zorunda.",
        durak: { soru: "Choose the correct answer: “My sister ___ recycle the bottles.”", secenekler: [["has to", true, "My sister = she; üçüncü tekil şahısta “has to” kullanılır."], ["have to", false, "“have to” I, you, we, they ile kullanılır."], ["haves to", false, "Böyle bir biçim yoktur."], ["must to", false, "must'tan sonra “to” gelmez."]] } },
    ],
    uret: {
      "enenv.must": [
        z => { const [eylem, iyi] = sec(KURALLAR);
          return S({ kaz: "enenv.must", duzey: "uygulama", zorluk: 1, soru: `Complete the environment rule:<br><b>You ___ ${eylem}.</b>`, dogru: iyi ? "must" : "mustn't",
            yanlis: [[iyi ? "mustn't" : "must", "kavrama", iyi ? "Bu davranış çevreyi korur; yasak değil, yapılması gereken bir şeydir." : "Bu davranış çevreye zarar verir; yapılmaması gerekir."], [iyi ? "must to" : "mustn't to", "bilgi", "must / mustn't sonrasında “to” kullanılmaz."], [iyi ? "musts" : "don't must", "bilgi", iyi ? "must hiçbir öznede -s almaz." : "must'ın olumsuzu “mustn't” olur; “don't must” yanlıştır."]],
            ipucu: "Bu davranış çevreye yararlı mı, zararlı mı?", cozum: [`Davranış: “${eylem}”.`, iyi ? "Bu davranış çevreyi korur; yapılması gerekir." : "Bu davranış çevreye zarar verir; yasaklanmalıdır.", `Cevap: You ${iyi ? "must" : "mustn't"} ${eylem}.`],
            kural: "must + V1 = -meli (zorunluluk, kural). mustn't + V1 = -memeli (yasak)." }); },
        z => { const [ozne, dogru] = sec(OZNE), [eylem] = sec(KURALLAR.filter(k => k[1]));
          return S({ kaz: "enenv.must", duzey: "uygulama", zorluk: 1, soru: `Choose the correct answer:<br><b>${ozne} ___ ${eylem}.</b>`, dogru,
            yanlis: [[dogru === "have to" ? "has to" : "have to", "kavrama", dogru === "have to" ? `“${ozne}” ile “have to” kullanılır; “has to” yalnızca he/she/it içindir.` : `“${ozne}” üçüncü tekil şahıstır (he/she/it); “has to” gerekir.`], ["haves to", "bilgi", "Böyle bir biçim yoktur: have to ya da has to."], ["must to", "bilgi", "must'tan sonra “to” gelmez."]],
            ipucu: "Özne he/she/it gibi mi, yoksa I/you/we/they gibi mi?", cozum: [`Özne: ${ozne}.`, dogru === "has to" ? "Bu özne üçüncü tekil şahıstır (he/she/it)." : "Bu özne I / you / we / they grubundadır.", `Cevap: ${ozne} ${dogru} ${eylem}.`],
            kural: "I/you/we/they + have to; he/she/it + has to (+ V1)." }); },
        Q("enenv.must", "aciklama", 1, "Look at the sign in the park: <b>🚯 NO LITTERING</b>. What does it mean?", "You mustn't throw rubbish here.",
          [["You must throw rubbish here.", "kavrama", "Tabela bir yasağı gösteriyor; “must” zorunluluktur."], ["You have to throw rubbish here.", "kavrama", "“have to” zorunluluk anlatır; tabela ise yasaklıyor."], ["You must pick flowers here.", "dikkat", "Tabela çiçeklerle ilgili değil, çöple ilgili."]],
          "“NO …” ile başlayan tabelalar yasak bildirir.", ["“NO LITTERING” yere çöp atmanın yasak olduğunu gösterir.", "Yasaklar “mustn't” ile anlatılır.", "Cevap: You mustn't throw rubbish here."], { kural: "Yasak tabelaları (NO …) → You mustn't …" }),
        Q("enenv.must", "uygulama", 2, "Which sentence is <b>correct</b>?", "We must save energy.",
          [["We must to save energy.", "bilgi", "must'tan sonra “to” gelmez."], ["We musts save energy.", "bilgi", "must -s almaz."], ["We must saving energy.", "bilgi", "must'tan sonra fiilin yalın hâli gelir, -ing değil."]],
          "must + fiilin yalın hâli.", ["must bir yardımcı fiildir, -s ya da “to” almaz.", "Sonrasında fiil yalın gelir: save.", "Doğru: We must save energy."], { kural: "must + V1 (must go, must save, must recycle)" }),
        Q("enenv.must", "transfer", 2, "Read the school rules and answer.<br><i>GREEN SCHOOL RULES<br>1. Students must turn off the lights after class.<br>2. Students mustn't waste paper.<br>3. Students have to put plastic bottles in the yellow bin.</i><br>Which one is <b>not</b> allowed?", "wasting paper",
          [["turning off the lights", "dikkat", "Işıkları kapatmak bir zorunluluktur (must), yasak değildir."], ["putting bottles in the yellow bin", "dikkat", "Bu bir zorunluluktur (have to)."], ["recycling plastic", "dikkat", "Plastiği geri dönüştürmek kurallarla teşvik ediliyor."]],
          "Yasak hangi kelimeyle anlatılır?", ["Yasaklar “mustn't” ile anlatılır.", "Kural 2: Students mustn't waste paper.", "İzin verilmeyen davranış: kâğıt israf etmek (wasting paper)."], { kural: "must / have to = zorunlu; mustn't = yasak (not allowed)." }),
        Q("enenv.must", "uygulama", 2, "Choose the correct question tag: <b>We must protect the animals, ___?</b>", "mustn't we",
          [["must we", "kavrama", "Cümle olumlu; soru eklentisi olumsuz olmalı."], ["don't we", "kavrama", "Cümlede yardımcı fiil “must”; eklentide de must kullanılır."], ["mustn't they", "dikkat", "Özne “we”; eklentide de “we” olmalı."]],
          "Olumlu cümle → olumsuz eklenti, aynı yardımcı fiil.", ["Yardımcı fiil “must”, özne “we”.", "Olumlu cümleye olumsuz eklenti gelir: mustn't.", "Cevap: mustn't we?"], { kural: "We must…, mustn't we? · You mustn't…, must you?" }),
      ],
      "enenv.vocab": [
        kelime("enenv.vocab", ENV_SOZ),
        Q("enenv.vocab", "aciklama", 1, "People cut down too many trees and forests disappear. What is this problem called?", "deforestation",
          [["global warming", "kavrama", "Küresel ısınma dünyanın sıcaklığının artmasıdır."], ["recycling", "kavrama", "Recycling bir sorun değil, çözümdür."], ["water pollution", "kavrama", "Su kirliliği suların kirlenmesidir."]],
          "Forest kelimesini hatırla.", ["Tanım: ağaçların kesilmesi ve ormanların yok olması.", "de- + forest + -ation = deforestation.", "Cevap: deforestation."], { kural: "deforestation = ormansızlaşma" }),
        Q("enenv.vocab", "aciklama", 1, "The Earth is getting hotter and the ice at the poles is melting. What is this problem?", "global warming",
          [["deforestation", "kavrama", "Ormansızlaşma ağaçların kesilmesidir."], ["air pollution", "kavrama", "Hava kirliliği küresel ısınmaya katkı yapar ama tanım dünyanın ısınmasını anlatıyor."], ["drought", "kavrama", "Kuraklık uzun süre yağmur yağmamasıdır."]],
          "Hotter = daha sıcak.", ["Dünyanın ısınması ve buzulların erimesi anlatılıyor.", "Bu soruna “global warming” denir.", "Cevap: global warming."], { kural: "global warming = küresel ısınma" }),
        Q("enenv.vocab", "uygulama", 1, "Complete: <b>Don't throw away the glass bottles. We can ___ them.</b>", "recycle",
          [["pollute", "kavrama", "“pollute” kirletmek demektir; olumsuz bir davranıştır."], ["waste", "kavrama", "“waste” israf etmektir."], ["cut down", "kavrama", "“cut down” ağaç kesmek için kullanılır."]],
          "Şişeleri atmak yerine ne yapabiliriz?", ["Cümle şişeleri atmamamızı söylüyor.", "Şişeleri geri dönüştürebiliriz: recycle.", "Cevap: We can recycle them."], { kural: "recycle = geri dönüştürmek, reuse = yeniden kullanmak, reduce = azaltmak" }),
        Q("enenv.vocab", "uygulama", 2, "Which word does <b>not</b> belong to the group?<br><i>pollution – deforestation – global warming – recycling</i>", "recycling",
          [["pollution", "dikkat", "Kirlilik bir çevre sorunudur; gruba uyar."], ["deforestation", "dikkat", "Ormansızlaşma bir çevre sorunudur; gruba uyar."], ["global warming", "dikkat", "Küresel ısınma bir çevre sorunudur; gruba uyar."]],
          "Üçü sorun, biri çözüm.", ["pollution, deforestation, global warming çevre sorunlarıdır.", "recycling ise bir çözümdür.", "Gruba uymayan: recycling."], { kural: "Problems: pollution, deforestation, global warming. Solutions: recycling, planting trees, saving energy." }),
        z => { const veri = [["Paper", R(10, 40)], ["Plastic", R(10, 40)], ["Glass", R(10, 40)], ["Metal", R(10, 40)]];
          const s = [...veri].sort((a, b) => a[1] - b[1]); if (s[0][1] === s[1][1]) return null;
          return S({ kaz: "enenv.vocab", duzey: "uygulama", zorluk: 2, soru: "Our class collected rubbish for recycling. The graph shows the results. Which material did we collect the <b>least</b>?", gorsel: G.sutun(veri, { baslik: "Recycling in our class", birim: "kg" }),
            dogru: s[0][0], yanlis: s.slice(1).map(v => [v[0], v === s[3] ? "kavrama" : "dikkat", v === s[3] ? `“least” en az demektir; ${v[0]} (${v[1]} kg) en çok toplanandır.` : `${v[0]} için ${v[1]} kg toplandı; en kısa sütun bu değil.`]),
            ipucu: "least = en az. En kısa sütunu bul.", cozum: ["“the least” = en az.", `En kısa sütun: ${s[0][0]} (${s[0][1]} kg).`, `Cevap: ${s[0][0]}.`], kural: "the most = en çok, the least = en az" }); },
      ],
      "enenv.solution": [
        Q("enenv.solution", "aciklama", 1, "What is a <b>solution</b> for air pollution?", "using public transport and bikes",
          [["using more cars", "kavrama", "Daha çok araba daha çok egzoz gazı demektir; kirliliği artırır."], ["building more factories", "kavrama", "Fabrikalar hava kirliliğine neden olur."], ["burning rubbish", "kavrama", "Çöp yakmak havayı kirletir."]],
          "Havayı kirleten şeyleri azaltan seçenek hangisi?", ["Hava kirliliğinin nedenleri: arabalar, fabrikalar, çöp yakmak.", "Toplu taşıma ve bisiklet kullanmak egzoz gazını azaltır.", "Çözüm: using public transport and bikes."], { kural: "Air pollution → use public transport, ride bikes, plant trees." }),
        Q("enenv.solution", "aciklama", 2, "Match the problem with its <b>effect</b>: <b>deforestation</b> → ?", "Animals lose their homes.",
          [["The sea gets dirty.", "kavrama", "Denizin kirlenmesi su kirliliğinin sonucudur."], ["We save energy.", "kavrama", "Bu bir sonuç değil, olumlu bir davranıştır."], ["People recycle more.", "kavrama", "Bu bir çözümdür, ormansızlaşmanın sonucu değildir."]],
          "Ağaçlar kesilince ormandaki hayvanlara ne olur?", ["Deforestation = ağaçların kesilmesi.", "Ormanlar birçok hayvanın evidir.", "Sonuç (effect): Animals lose their homes."], { kural: "effect = sonuç / etki. Problem → effect → solution." }),
        Q("enenv.solution", "transfer", 1, "Complete the dialogue:<br>— The lights are on, but there is nobody in the classroom.<br>— ___", "We must turn them off. Let's save energy!",
          [["We must turn them on.", "kavrama", "Işıklar zaten açık; boş sınıfta kapatılmalı."], ["We mustn't save energy.", "kavrama", "Enerji tasarrufu iyi bir davranıştır; yasaklanmaz."], ["Yes, please.", "kavrama", "Bu, bir teklif cevabıdır; duruma uygun değil."]],
          "Boş sınıfta açık ışık neye neden olur?", ["Boş sınıfta ışık açık kalınca enerji israf edilir.", "Çözüm: ışıkları kapatmak (turn off).", "Cevap: We must turn them off. Let's save energy!"], { kural: "turn on = açmak, turn off = kapatmak" }),
        Q("enenv.solution", "transfer", 2, "Read the text and answer the question.<br><i>Every year people throw millions of plastic bags into the sea. Sea turtles think the bags are food and eat them. This is very dangerous for them. We must use cloth bags when we go shopping.</i><br>What is the <b>solution</b> in the text?", "using cloth bags",
          [["throwing bags into the sea", "dikkat", "Bu, metindeki sorundur."], ["sea turtles eating bags", "dikkat", "Bu, sorunun sonucudur (effect)."], ["buying more plastic bags", "kavrama", "Daha çok plastik poşet sorunu büyütür."]],
          "“We must …” ile başlayan cümleyi bul.", ["Sorun: insanlar denize plastik poşet atıyor.", "Sonuç: deniz kaplumbağaları poşetleri yiyor.", "Çözüm (We must…): bez çanta kullanmak — using cloth bags."], { kural: "Metinde problem, effect ve solution cümlelerini ayır." }),
        Q("enenv.solution", "uygulama", 2, "Which one is an example of <b>reuse</b>?", "using an old jar as a pencil holder",
          [["throwing the jar into the bin", "kavrama", "Atmak yeniden kullanmak değildir."], ["buying a new jar every day", "kavrama", "Bu tüketimi artırır, yeniden kullanım değildir."], ["breaking the jar", "kavrama", "Kırmak yeniden kullanmak değildir."]],
          "reuse = bir eşyayı yeniden, başka bir iş için kullanmak.", ["“reuse” yeniden kullanmak demektir.", "Eski bir kavanozu kalemlik yapmak onu yeniden kullanmaktır.", "Cevap: using an old jar as a pencil holder."], { kural: "Reduce (azalt), Reuse (yeniden kullan), Recycle (geri dönüştür)." }),
        Q("enenv.solution", "baglanti", 2, "Theme 5'i hatırla: Şehirler için kullanılan sıfatlardan hangisi <b>air pollution</b> ile ilgilidir? <b>There are a lot of factories and cars. The city is ___.</b>", "polluted",
          [["clean", "kavrama", "Fabrika ve araba çok olan bir şehrin havası temiz olmaz."], ["quiet", "kavrama", "“quiet” sessiz demektir; kirlilikle ilgili değildir."], ["historic", "kavrama", "“historic” tarihî demektir."]],
          "Fabrika ve araba havayı ne yapar?", ["Fabrikalar ve arabalar havayı kirletir.", "Kirli = polluted.", "Cevap: The city is polluted."], { kural: "pollute (kirletmek) → pollution (kirlilik) → polluted (kirli)" }),
      ],
    },
  });

  /* ======================= 3) PLANETS AND THE EARTH ======================= */
  /* [ad, Türkçe, sıra (1–8), ipucu cümlesi, boyut (çizim için)] */
  const GEZEGEN = [
    ["Mercury", "Merkür", 1, "It is the closest planet to the Sun and it is the smallest planet.", 5],
    ["Venus", "Venüs", 2, "It is the hottest planet in the solar system.", 8],
    ["Earth", "Dünya", 3, "It is the only planet with life. It has a lot of water.", 8.5],
    ["Mars", "Mars", 4, "People call it “the Red Planet”.", 6],
    ["Jupiter", "Jüpiter", 5, "It is the biggest planet in the solar system.", 20],
    ["Saturn", "Satürn", 6, "It has big and beautiful rings around it.", 16],
    ["Uranus", "Uranüs", 7, "It is the seventh planet from the Sun. It spins on its side.", 11],
    ["Neptune", "Neptün", 8, "It is the farthest planet from the Sun.", 10.5],
  ];
  const SIRA = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];
  const PLA_SOZ = [["planet", "gezegen"], ["the Sun", "Güneş"], ["the Moon", "Ay"], ["star", "yıldız"], ["space", "uzay"], ["astronaut", "astronot"], ["rocket", "roket"], ["spaceship", "uzay gemisi"],
    ["orbit", "yörünge"], ["solar system", "Güneş sistemi"], ["satellite", "uydu"], ["telescope", "teleskop"], ["gravity", "yer çekimi"], ["crater", "krater"], ["rings", "halkalar"],
    ["Mercury", "Merkür"], ["Venus", "Venüs"], ["Earth", "Dünya"], ["Jupiter", "Jüpiter"], ["Saturn", "Satürn"], ["Uranus", "Uranüs"], ["Neptune", "Neptün"]];

  /* Güneş sistemi çizimi: gezegenler numaralı (isimsiz) ya da isimli. */
  function gunesSistemi(isimli) {
    let ic = `<circle class="g-b g-cizgi" cx="-20" cy="80" r="70"/>` + G.yazi(18, 84, "Sun", { b: 1 });
    let x = 70;
    GEZEGEN.forEach(([ad, , no, , r]) => {
      x += r + 10;
      ic += `<circle class="${no === 3 ? "g-c" : no === 4 ? "g-d" : "g-a"} g-cizgi" cx="${x}" cy="80" r="${r}"/>`;
      if (no === 6) ic += `<ellipse class="g-cizgi" cx="${x}" cy="80" rx="${r + 9}" ry="5" fill="none" stroke-width="2"/>`;
      ic += G.yazi(x, 80 + 22 + 16, isimli ? ad : no, { k: isimli ? 1 : 0, b: 1 });
      x += r + 12;
    });
    return G.svg(x + 10, 130, ic, isimli ? "Güneş sistemi: gezegenler sırasıyla" : "Güneş sistemi: gezegenler 1'den 8'e numaralı");
  }

  KONU_EKLE("en", {
    id: "en_planets", tema: "en8", ad: "Planets and the Earth", tr: "Gezegenler ve Dünya",
    kazanimlar: [
      { id: "enpla.vocab", ad: "Uzay ve gezegen kelimeleri" },
      { id: "enpla.order", ad: "Gezegenlerin sırası ve sıra sayıları" },
      { id: "enpla.facts", ad: "Gezegenler hakkında bilgi verme (simple present, en üstünlük sıfatları)" },
    ],
    sozluk: PLA_SOZ,
    anlatim: [
      { baslik: "Güneş sistemi ve gezegenler",
        metin: "Güneş sisteminde (<b>the solar system</b>) <b>the Sun</b> (Güneş) bir yıldızdır (<b>a star</b>). Etrafında sekiz gezegen (<b>planets</b>) döner. Güneş'ten uzaklığa göre sıraları: <b>Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune</b>. Bu sırayı hatırlamak için şu cümle işe yarar: <i>“<b>M</b>y <b>V</b>ery <b>E</b>asy <b>M</b>ethod <b>J</b>ust <b>S</b>peeds <b>U</b>p <b>N</b>aming.”</i> <b>The Moon</b> (Ay) bir gezegen değil, Dünya'nın uydusudur (<b>satellite</b>). Not: “the Sun, the Moon, the Earth” kelimeleri tek olduğu için “the” ile kullanılır.",
        ornek: "<b>Earth is the third planet from the Sun.</b> — Dünya, Güneş'ten itibaren üçüncü gezegendir.",
        gorsel: gunesSistemi(true),
        durak: { soru: "Which one is <b>not</b> a planet?", secenekler: [["the Moon", true, "Ay bir gezegen değildir; Dünya'nın uydusudur."], ["Mars", false, "Mars dördüncü gezegendir."], ["Venus", false, "Venüs ikinci gezegendir."], ["Neptune", false, "Neptün sekizinci gezegendir."]] } },
      { baslik: "Sıra sayılarıyla gezegenler",
        metin: "Gezegenlerin yerini <b>sıra sayılarıyla</b> (ordinal numbers) söyleriz: <b>first (1st), second (2nd), third (3rd), fourth (4th), fifth (5th), sixth (6th), seventh (7th), eighth (8th)</b>. Kalıp: <b>… is the ___ planet from the Sun.</b> Dikkat: <b>eighth</b> yazımında “t” bir kez yazılır ve “h” ile biter; <b>fifth</b> de “five + th” değil, “fif + th” olur.",
        ornek: "<b>Jupiter is the fifth planet from the Sun.</b><br><b>Neptune is the eighth planet from the Sun.</b>",
        durak: { soru: "Mars is the ___ planet from the Sun.", secenekler: [["fourth", true, "Mercury, Venus, Earth, Mars: Mars dördüncüdür."], ["third", false, "Üçüncü gezegen Earth (Dünya)'dır."], ["fifth", false, "Beşinci gezegen Jupiter'dir."], ["four", false, "“four” sayma sayısıdır; sıra için “fourth” gerekir."]] } },
      { baslik: "Gezegenler hakkında konuşmak",
        metin: "Bilimsel gerçekleri <b>simple present</b> ile anlatırız: <b>The Earth goes around the Sun.</b> · <b>The Moon goes around the Earth.</b> Karşılaştırmalarda Theme 3'teki en üstünlük sıfatlarını kullanırız: <b>the biggest</b> (en büyük: Jupiter), <b>the smallest</b> (en küçük: Mercury), <b>the hottest</b> (en sıcak: Venus), <b>the closest</b> (en yakın: Mercury), <b>the farthest</b> (en uzak: Neptune). Mars kırmızı rengi yüzünden <b>the Red Planet</b> diye anılır; Saturn'ün güzel halkaları (<b>rings</b>) vardır.",
        ornek: "<b>Jupiter is bigger than Earth. It is the biggest planet.</b><br><b>Astronauts travel to space in a rocket.</b>",
        durak: { soru: "Which planet is the biggest?", secenekler: [["Jupiter", true, "Jüpiter güneş sisteminin en büyük gezegenidir."], ["Saturn", false, "Satürn büyüktür ama Jüpiter'den küçüktür."], ["Earth", false, "Dünya, Jüpiter'den çok daha küçüktür."], ["Mercury", false, "Merkür en küçük gezegendir."]] } },
    ],
    uret: {
      "enpla.vocab": [
        kelime("enpla.vocab", PLA_SOZ),
        Q("enpla.vocab", "aciklama", 1, "A person who travels to space is called ___.", "an astronaut",
          [["a pilot", "kavrama", "Pilot uçak kullanır; uzaya giden kişi astronottur."], ["a telescope", "kavrama", "Telescope bir araçtır, kişi değildir."], ["a satellite", "kavrama", "Satellite (uydu) bir gök cismi ya da araçtır."]],
          "Uzaya giden kişiye ne denir?", ["Tanım: uzaya giden kişi.", "Bu kişiye astronaut denir.", "Cevap: an astronaut (sesli harfle başladığı için “an”)."], { kural: "astronaut = astronot; an + sesli harf sesi" }),
        Q("enpla.vocab", "aciklama", 1, "We use it to look at the stars and planets. What is it?", "a telescope",
          [["a rocket", "kavrama", "Roket uzaya gitmek için kullanılır."], ["a map", "kavrama", "Harita yol bulmak içindir."], ["a crater", "kavrama", "Krater, gök cisimlerinin yüzeyindeki çukurdur."]],
          "Uzaktaki cisimleri büyütüp gösteren araç.", ["Yıldızlara ve gezegenlere bakmak için bir araç gerekir.", "Bu araç teleskoptur.", "Cevap: a telescope."], { kural: "telescope = teleskop" }),
        Q("enpla.vocab", "uygulama", 1, "Complete: <b>The Moon goes around the Earth. It is the Earth's ___.</b>", "satellite",
          [["star", "kavrama", "Ay ışık üretmez; yıldız değildir."], ["planet", "kavrama", "Ay bir gezegenin etrafında döner; gezegen değil uydudur."], ["sun", "kavrama", "Güneş bir yıldızdır; Ay değildir."]],
          "Bir gezegenin etrafında dönen gök cismine ne denir?", ["Ay, Dünya'nın etrafında döner.", "Bir gezegenin etrafında dönen gök cismine uydu (satellite) denir.", "Cevap: satellite."], { kural: "satellite = uydu. The Moon is the Earth's natural satellite." }),
        Q("enpla.vocab", "uygulama", 2, "Which word does <b>not</b> belong to the group?<br><i>Venus – Jupiter – Saturn – the Moon</i>", "the Moon",
          [["Venus", "dikkat", "Venüs bir gezegendir."], ["Jupiter", "dikkat", "Jüpiter bir gezegendir."], ["Saturn", "dikkat", "Satürn bir gezegendir."]],
          "Üçü gezegen, biri uydu.", ["Venus, Jupiter ve Saturn gezegendir.", "The Moon ise Dünya'nın uydusudur.", "Gruba uymayan: the Moon."], { kural: "Planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune." }),
        Q("enpla.vocab", "transfer", 2, "Read and answer.<br><i>Hi! I'm Defne. I want to be an astronaut. I want to fly to space in a rocket and walk on the Moon. I love looking at the stars with my telescope every night.</i><br>What does Defne use every night?", "a telescope",
          [["a rocket", "dikkat", "Defne roketle uzaya gitmek istiyor; her gece kullanmıyor."], ["a spaceship", "dikkat", "Metinde uzay gemisinden söz edilmiyor."], ["a map", "dikkat", "Metinde harita yok."]],
          "“every night” ifadesini metinde bul.", ["Sorudaki anahtar ifade: every night.", "“I love looking at the stars with my telescope every night.”", "Cevap: a telescope."], { kural: "want to + V1 = -mek istemek (Theme 5'ten hatırla)." }),
      ],
      "enpla.order": [
        z => { const g = sec(GEZEGEN), n = g[2], dig = karistir(GEZEGEN.filter(x => x !== g)).slice(0, 3);
          return S({ kaz: "enpla.order", duzey: "uygulama", zorluk: 1, soru: `Look at the picture. Which planet is the <b>${SIRA[n - 1]}</b> planet from the Sun?`, gorsel: gunesSistemi(false),
            dogru: g[0], yanlis: dig.map(x => [x[0], "bilgi", `${x[0]}, Güneş'ten itibaren ${SIRA[x[2] - 1]} (${x[2]}.) gezegendir.`]),
            ipucu: "Sıra: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.", cozum: [`“${SIRA[n - 1]}” = ${n}.`, "Gezegenleri Güneş'ten başlayarak say: Mercury (1), Venus (2), Earth (3), Mars (4), Jupiter (5), Saturn (6), Uranus (7), Neptune (8).", `${n}. gezegen: ${g[0]}.`],
            kural: "My Very Easy Method Just Speeds Up Naming → Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune" }); },
        z => { const g = sec(GEZEGEN), n = g[2];
          const yan = [];
          if (n > 1) yan.push([SIRA[n - 2], "bilgi", `${SIRA[n - 2]} = ${n - 1}.; ${GEZEGEN[n - 2][0]} bu sıradadır.`]);
          if (n < 8) yan.push([SIRA[n], "bilgi", `${SIRA[n]} = ${n + 1}.; ${GEZEGEN[n][0]} bu sıradadır.`]);
          yan.push([["one", "two", "three", "four", "five", "six", "seven", "eight"][n - 1], "kavrama", "Bu bir sayma sayısıdır; sıra bildirmek için sıra sayısı (ordinal) gerekir."]);
          const yanlisYazim = { first: "firstth", second: "secondth", third: "threeth", fourth: "fourh", fifth: "fiveth", sixth: "sixt", seventh: "sevent", eighth: "eightth" };
          yan.push([yanlisYazim[SIRA[n - 1]], "dikkat", `Yazım hatası var; doğrusu “${SIRA[n - 1]}”.`]);
          if (n > 2) yan.push([SIRA[n - 3], "bilgi", `${SIRA[n - 3]} = ${n - 2}.; ${GEZEGEN[n - 3][0]} bu sıradadır.`]);
          return S({ kaz: "enpla.order", duzey: "uygulama", zorluk: 2, soru: `Complete: <b>${g[0]} is the ___ planet from the Sun.</b>`, gorsel: gunesSistemi(true),
            dogru: SIRA[n - 1], yanlis: karistir(yan).slice(0, 3),
            ipucu: "Resimde gezegeni bul ve Güneş'ten başlayarak say.", cozum: [`${g[0]} Güneş'ten itibaren ${n}. sıradadır.`, `${n}. = ${SIRA[n - 1]} (${n}${["st", "nd", "rd"][n - 1] || "th"}).`, `Cevap: ${g[0]} is the ${SIRA[n - 1]} planet from the Sun.`],
            kural: "1st first, 2nd second, 3rd third, 4th fourth, 5th fifth, 6th sixth, 7th seventh, 8th eighth" }); },
        Q("enpla.order", "aciklama", 1, "Which is the correct order from the Sun?", "Mercury – Venus – Earth – Mars",
          [["Venus – Mercury – Earth – Mars", "bilgi", "Güneş'e en yakın gezegen Merkür'dür; Venüs ikincidir."], ["Mercury – Earth – Venus – Mars", "bilgi", "Venüs, Dünya'dan önce gelir."], ["Mercury – Venus – Mars – Earth", "bilgi", "Dünya üçüncü, Mars dördüncüdür."]],
          "İlk dört gezegen: My Very Easy Method…", ["M = Mercury (1), V = Venus (2), E = Earth (3), M = Mars (4).", "Bu sıra Güneş'ten uzaklığa göredir.", "Cevap: Mercury – Venus – Earth – Mars."], { kural: "İç gezegenler: Mercury, Venus, Earth, Mars." }),
        Q("enpla.order", "uygulama", 2, "Which planet comes <b>between</b> Saturn and Neptune?", "Uranus",
          [["Jupiter", "bilgi", "Jüpiter, Satürn'den önce gelir (5.)."], ["Mars", "bilgi", "Mars dördüncü gezegendir."], ["Earth", "bilgi", "Dünya üçüncü gezegendir."]],
          "Saturn 6., Neptune 8. ise arada hangisi var?", ["Saturn altıncı, Neptune sekizinci gezegendir.", "Arada yedinci gezegen vardır.", "Yedinci gezegen: Uranus."], { kural: "between = arasında (Theme 5 prepositions of place)." }),
        Q("enpla.order", "baglanti", 1, "How do we write “<b>8th</b>” in words?", "eighth",
          [["eightth", "dikkat", "“eight” zaten “t” ile biter; yalnızca “h” eklenir."], ["eigth", "dikkat", "“g” ve “h” arasında harf eksik değil; doğrusu e-i-g-h-t-h."], ["eight", "kavrama", "“eight” sayma sayısıdır; sıra sayısı “eighth” olur."]],
          "eight + h", ["8 = eight (sayma sayısı).", "Sıra sayısı yapmak için “eight”in sonuna yalnızca “h” eklenir.", "8th = eighth."], { kural: "Düzensiz yazımlar: first, second, third, fifth, eighth, ninth, twelfth." }),
      ],
      "enpla.facts": [
        z => { const g = sec(GEZEGEN), dig = karistir(GEZEGEN.filter(x => x !== g)).slice(0, 3);
          return S({ kaz: "enpla.facts", duzey: "aciklama", zorluk: 1, soru: `Read the clue and find the planet:<br><i>${g[3]}</i>`, dogru: g[0],
            yanlis: dig.map(x => [x[0], "bilgi", `${x[0]} için doğru bilgi: ${x[3]}`]),
            ipucu: "Cümledeki anahtar kelimeye bak (closest, hottest, biggest, red, rings, farthest…).", cozum: ["İpucundaki anahtar bilgiyi bul.", `Bu bilgi ${g[0]} (${g[1]}) gezegenine aittir.`, `Cevap: ${g[0]}.`],
            kural: "Mercury: closest/smallest · Venus: hottest · Earth: life · Mars: Red Planet · Jupiter: biggest · Saturn: rings · Neptune: farthest" }); },
        Q("enpla.facts", "uygulama", 1, "Choose the correct sentence.", "The Earth goes around the Sun.",
          [["The Sun goes around the Earth.", "bilgi", "Güneş, Dünya'nın etrafında dönmez; Dünya Güneş'in etrafında döner."], ["The Earth go around the Sun.", "kavrama", "“The Earth” üçüncü tekildir; fiil “goes” olmalı."], ["The Earth is go around the Sun.", "kavrama", "Simple present cümlesinde “is” ve yalın fiil birlikte kullanılmaz."]],
          "Bilimsel gerçekler simple present ile anlatılır.", ["Dünya, Güneş'in etrafında döner (bilimsel gerçek).", "“The Earth” = it; simple present'ta fiil -s/-es alır: goes.", "Cevap: The Earth goes around the Sun."], { kural: "Facts → simple present; he/she/it + V-s (goes, has, spins)." }),
        Q("enpla.facts", "uygulama", 2, "Complete: <b>Mercury is ___ planet in the solar system.</b>", "the smallest",
          [["smaller", "kavrama", "“smaller” karşılaştırmadır (than ile kullanılır); bütün gezegenler içinde en küçük için “the smallest” gerekir."], ["the smaller", "bilgi", "En üstünlük -est ile yapılır: the smallest."], ["the most small", "bilgi", "Kısa sıfatlarda “most” kullanılmaz; -est eklenir."]],
          "Bütün gezegenler arasında karşılaştırma: en …", ["Cümle tüm gezegenler arasında karşılaştırma yapıyor (in the solar system).", "Kısa sıfatlarda en üstünlük: the + sıfat + -est.", "small → the smallest."], { kural: "the + adj-est (the biggest, the hottest, the smallest)" }),
        Q("enpla.facts", "uygulama", 2, "Complete: <b>Jupiter is ___ than the Earth.</b>", "bigger",
          [["biggest", "kavrama", "“than” varsa karşılaştırma (-er) kullanılır."], ["more big", "bilgi", "Kısa sıfatlarda “more” kullanılmaz: bigger."], ["biger", "dikkat", "big kelimesinde son harf ikilenir: bigger."]],
          "“than” görünce -er kullan.", ["Cümlede “than” var: iki şey karşılaştırılıyor.", "big kısa bir sıfat; son sessiz harf ikilenir ve -er eklenir.", "Cevap: bigger."], { kural: "adj-er + than (bigger than, hotter than)" }),
        Q("enpla.facts", "transfer", 2, "Look at the table. Which sentence is <b>true</b>?", "Venus is hotter than Mars.",
          [["Mars is hotter than Venus.", "dikkat", "Tabloya göre Mars -60 °C, Venüs 460 °C; Venüs daha sıcak."], ["Earth is the hottest planet.", "dikkat", "En sıcak gezegen tabloda Venüs'tür."], ["Mercury is colder than Mars.", "dikkat", "Merkür 167 °C, Mars -60 °C; Merkür daha sıcaktır."]],
          "Tablodaki sıcaklıkları karşılaştır.", ["Tabloyu oku: Mercury 167 °C, Venus 460 °C, Earth 15 °C, Mars -60 °C.", "En yüksek sıcaklık Venüs'tedir; Venus Mars'tan daha sıcaktır.", "Doğru cümle: Venus is hotter than Mars."],
          { gorsel: G.tablo(["Planet", "Average temperature"], [["Mercury", "167 °C"], ["Venus", "460 °C"], ["Earth", "15 °C"], ["Mars", "-60 °C"]]), kural: "hot → hotter → the hottest; cold → colder → the coldest" }),
      ],
    },
  });
})();
