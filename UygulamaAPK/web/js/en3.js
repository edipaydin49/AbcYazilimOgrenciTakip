/* 6. sınıf İngilizce — Theme 5 (Life in the Neighbourhood & City) ve Theme 6 (Life in the World & Culture).
 * Konular: Festivals and Events · Places and Directions in the City · Transportation ·
 * Countries, Nationalities and Languages · Food from Around the World and Breakfast.
 */
(function () {
  "use strict";
  const { R, sec, karistir, S, Q, G } = OGR;

  /* Sözlükten kelime anlamı sorusu (İngilizce→Türkçe ya da Türkçe→İngilizce). */
  function kelime(kaz, liste) {
    return () => {
      const [en, tr] = sec(liste);
      const diger = karistir(liste.filter(w => w[0] !== en && w[1] !== tr)).slice(0, 3);
      if (Math.random() < 0.5)
        return S({ kaz, duzey: "hatirlama", zorluk: 1, soru: `What does <b>“${en}”</b> mean in Turkish?`, dogru: tr,
          yanlis: diger.map(w => [w[1], "bilgi", `“${w[1]}” İngilizcede “${w[0]}” demektir.`]),
          ipucu: "Kelimeyi konuyla ilgili bir cümle içinde düşün.",
          cozum: [`Sorulan kelime: “${en}”.`, `Bu kelimenin Türkçe karşılığı “${tr}” olur.`, "Diğer seçenekler konudaki başka kelimelerin karşılığıdır."],
          kural: "Yeni kelimeleri Türkçe karşılığı ve örnek bir cümleyle birlikte tekrar et." });
      return S({ kaz, duzey: "hatirlama", zorluk: 1, soru: `Which English word means <b>“${tr}”</b>?`, dogru: en,
        yanlis: diger.map(w => [w[0], "bilgi", `“${w[0]}” kelimesinin anlamı “${w[1]}” olur.`]),
        ipucu: "Türkçe kelimeyi düşün ve konudaki İngilizce karşılığını hatırla.",
        cozum: [`Aranan anlam: “${tr}”.`, `İngilizcede bu anlamı veren kelime “${en}” olur.`, "Diğer seçenekler farklı anlamlara gelir."],
        kural: "Kelime öğrenirken İngilizceden Türkçeye ve Türkçeden İngilizceye iki yönlü çalış." });
    };
  }

  /* ========================= 1) FESTIVALS AND EVENTS ========================= */
  const FES_SOZ = [["festival", "festival, şenlik"], ["audience", "seyirci, izleyici"], ["musician", "müzisyen"], ["concert", "konser"], ["fair", "fuar, panayır"],
    ["fireworks", "havai fişek"], ["parade", "geçit töreni"], ["stage", "sahne"], ["costume", "kostüm"], ["competition", "yarışma"], ["exhibition", "sergi"],
    ["exciting", "heyecan verici"], ["excited", "heyecanlı"], ["boring", "sıkıcı"], ["bored", "sıkılmış"], ["terrifying", "dehşet verici"], ["terrified", "dehşete düşmüş"],
    ["amazing", "harika, şaşırtıcı"], ["scary", "korkutucu"], ["scared", "korkmuş"], ["interesting", "ilginç"], ["interested", "ilgili, meraklı"],
    ["tiring", "yorucu"], ["tired", "yorgun"], ["thrilling", "çok heyecanlı, coşturucu"]];

  /* -ing / -ed sıfat çiftleri ve bağlam cümleleri. */
  const SIFAT = [
    ["excite", "exciting", "excited", "The football match was really ___. Everybody was shouting.", "The children were very ___ about the festival."],
    ["bore", "boring", "bored", "The speech was too long. It was ___.", "Nothing happened at the fair. I was ___."],
    ["terrify", "terrifying", "terrified", "The ghost train was ___. I screamed!", "My little brother was ___ of the big dragon costume."],
    ["amaze", "amazing", "amazed", "The fireworks were ___. The sky was full of colours.", "We were ___ by the dancers' colourful costumes."],
    ["interest", "interesting", "interested", "The science exhibition was very ___. I learnt a lot.", "Ali is ___ in music, so he went to the concert."],
    ["tire", "tiring", "tired", "The marathon was very ___. My legs hurt.", "After the long walk at the fair, we were ___."],
    ["thrill", "thrilling", "thrilled", "The roller coaster ride was ___!", "The fans were ___ when their team won the cup."],
  ];

  KONU_EKLE("en", {
    id: "en_festivals", tema: "en5", ad: "Festivals and Events", tr: "Festivaller ve etkinlikler",
    kazanimlar: [
      { id: "enfes.vocab", ad: "Festival ve etkinlik kelimelerini (festival, audience, concert, parade…) tanıma" },
      { id: "enfes.adj", ad: "Duygu bildiren -ing / -ed sıfatlarını (exciting / excited, boring / bored…) ayırt etme" },
      { id: "enfes.past", ad: "Geçmişteki etkinlikleri was / were ile anlatma ve sorma" },
      { id: "enfes.like", ad: "like / love / hate + -ing ve want + to ile tercih bildirme" },
    ],
    sozluk: FES_SOZ,
    anlatim: [
      { baslik: "Festivaller ve etkinlikler",
        metin: "Şehirlerde müzik, spor ve sanat <b>festivalleri</b> düzenlenir. Bir konserde <b>musicians</b> (müzisyenler) <b>stage</b> (sahne) üzerinde çalar, <b>audience</b> (seyirciler) onları izler. Bayramlarda <b>parade</b> (geçit töreni) ve <b>fireworks</b> (havai fişek) olur. Okullarda <b>competition</b> (yarışma) ve <b>exhibition</b> (sergi) yapılır.<br>Geçmişteki bir etkinliği anlatırken <b>be</b> fiilinin geçmiş hâlini kullanırız: <b>I / he / she / it → was</b>, <b>you / we / they → were</b>. Olumsuz: <b>wasn't / weren't</b>. Soru: <b>Was it fun? — Yes, it was.</b>",
        ornek: "<b>The concert was amazing. There were a lot of people in the audience.</b> (Konser harikaydı. Seyircilerin arasında çok insan vardı.)<br><b>Where were you yesterday? — I was at the book fair.</b>",
        gorsel: G.tablo(["Özne", "Olumlu", "Olumsuz", "Soru"], [["I / He / She / It", "was", "wasn't", "Was …?"], ["You / We / They", "were", "weren't", "Were …?"]]),
        durak: { soru: "Choose the correct answer: My friends ___ at the music festival last Saturday.", secenekler: [["were", true, "“My friends” çoğuldur (they); geçmiş zamanda “were” kullanılır."], ["was", false, "“was” tekil özneler (I, he, she, it) içindir."], ["are", false, "“last Saturday” geçmişi gösterir; “are” geniş/şimdiki zamandır."], ["is", false, "“is” hem tekil hem şimdiki zaman içindir; burada uymaz."]] } },
      { baslik: "-ing ve -ed sıfatları",
        metin: "Duyguları anlatan bazı sıfatların iki hâli vardır:<br><b>-ing</b> ile biten sıfat, bir şeyin <b>nasıl olduğunu</b>, yani duyguya neden olan şeyi anlatır: <b>The film was boring.</b> (Film sıkıcıydı.)<br><b>-ed</b> ile biten sıfat, kişinin <b>ne hissettiğini</b> anlatır: <b>I was bored.</b> (Ben sıkılmıştım.)<br>Çiftler: exciting / excited, boring / bored, terrifying / terrified, amazing / amazed, interesting / interested, tiring / tired, thrilling / thrilled. Dikkat: <b>scary</b> (korkutucu) – <b>scared</b> (korkmuş).",
        ornek: "<b>The fireworks were exciting, so the children were excited.</b><br><b>The ghost house was scary. I was scared.</b>",
        gorsel: G.tablo(["-ing (şey / olay)", "-ed (kişinin duygusu)", "Türkçe"], [["exciting", "excited", "heyecan verici / heyecanlı"], ["boring", "bored", "sıkıcı / sıkılmış"], ["terrifying", "terrified", "dehşet verici / dehşete düşmüş"], ["interesting", "interested", "ilginç / ilgili"], ["tiring", "tired", "yorucu / yorgun"], ["scary", "scared", "korkutucu / korkmuş"]]),
        durak: { soru: "Choose the correct sentence.", secenekler: [["I was tired after the long parade.", true, "Kişinin hissettiği duygu “-ed” ile anlatılır: tired (yorgun)."], ["I was tiring after the long parade.", false, "“tiring” bir şeyin yorucu olduğunu anlatır; kişinin duygusu için “tired” gerekir."], ["The parade was tired.", false, "Geçit töreni bir duygu hissetmez; “tiring” denmelidir."], ["The film was bored.", false, "Film bir şey hissetmez; “boring” denmelidir."]] } },
      { baslik: "Sevdiklerimiz ve isteklerimiz",
        metin: "Sevdiğimiz ya da sevmediğimiz etkinlikleri anlatırken <b>like / love / enjoy / hate / don't like</b> fiillerinden sonra fiile <b>-ing</b> ekleriz: <b>I love dancing. She hates waiting in long queues.</b><br>Yazım: dance → danc<b>ing</b>, swim → swi<b>mm</b>ing, watch → watch<b>ing</b>.<br>Bir şeyi yapmak istediğimizi anlatırken <b>want + to + fiil</b> kullanırız: <b>I want to go to the concert.</b>",
        ornek: "<b>— Do you like watching parades? — Yes, I do. I love watching them.</b><br><b>We want to see the fireworks tonight.</b>",
        durak: { soru: "Choose the correct answer: My brother loves ___ in the school competitions.", secenekler: [["singing", true, "“love” fiilinden sonra -ing kullanılır: loves singing."], ["sing", false, "“love” fiilinden sonra fiilin yalın hâli değil -ing hâli gelir."], ["sings", false, "İkinci fiile -s eklenmez; “singing” olmalıdır."], ["sang", false, "“sang” geçmiş zaman hâlidir; “love”dan sonra -ing gerekir."]] } },
    ],
    uret: {
      "enfes.vocab": [
        kelime("enfes.vocab", FES_SOZ),
        Q("enfes.vocab", "aciklama", 1, "The people who watch a concert or a show are the ___.", "audience",
          [["musicians", "kavrama", "Müzisyenler sahnede çalan kişilerdir, izleyenler değil."], ["stage", "bilgi", "“stage” sahne demektir; bir yer adıdır."], ["costumes", "bilgi", "“costumes” kostümler demektir."]],
          "Konseri sahnede değil, koltukta oturarak kimler izler?", ["Cümle “bir konseri ya da gösteriyi izleyen insanlar” diyor.", "İzleyici/seyirci anlamındaki kelime “audience” olur.", "The audience clapped at the end of the concert."],
          { kural: "audience: seyirciler, izleyiciler · musician: müzisyen · stage: sahne." }),
        Q("enfes.vocab", "uygulama", 1, "🎆 On Republic Day, we watched the ___ in the night sky. They were colourful.", "fireworks",
          [["exhibition", "bilgi", "Sergi gökyüzünde izlenmez; bir salonda gezilir."], ["audience", "kavrama", "“audience” izleyen kişilerdir, gökyüzünde görülen şey değil."], ["competition", "bilgi", "Yarışma gökyüzünde izlenen renkli bir gösteri değildir."]],
          "Gece gökyüzünde renkli ışıklarla patlayan şeyi düşün.", ["Cümlede “gece gökyüzü” ve “renkli” ifadeleri var.", "Gökyüzünde renk renk patlayan gösteriye “fireworks” (havai fişek) denir.", "Doğru cevap: fireworks."],
          { kural: "fireworks: havai fişek · parade: geçit töreni · exhibition: sergi." }),
        Q("enfes.vocab", "transfer", 2, "Read the text and answer the question.<br><i>Last June, there was an art festival in our town. There was a big exhibition of children's paintings at the museum. In the evening, a famous musician gave a concert in the park. The audience was very happy.</i><br>Where was the exhibition?", "at the museum",
          [["in the park", "dikkat", "Parkta konser vardı; sergi müzedeydi."], ["at school", "dikkat", "Metinde okuldan söz edilmiyor."], ["on the stage", "dikkat", "Metinde sergi için sahne denmiyor; sergi müzedeydi."]],
          "Metinde “exhibition” kelimesinin geçtiği cümleyi bul.", ["Soru, serginin nerede olduğunu soruyor.", "İkinci cümle: “There was a big exhibition … at the museum.”", "Demek ki sergi müzedeydi: at the museum."],
          { kural: "Okuma sorularında önce sorudaki anahtar kelimeyi (exhibition) metinde bul." }),
        Q("enfes.vocab", "transfer", 2, "Look at the festival programme. What time was the <b>parade</b>?", "at 11 a.m.",
          [["at 2 p.m.", "dikkat", "Saat 14.00'te yarışma (competition) vardı."], ["at 6 p.m.", "dikkat", "Saat 18.00'de konser vardı."], ["at 9 p.m.", "dikkat", "Saat 21.00'de havai fişek gösterisi vardı."]],
          "Tabloda “parade” satırını bul.", ["Tabloda etkinlikler ve saatleri var.", "“Parade” satırında saat 11 a.m. yazıyor.", "Cevap: The parade was at 11 a.m."],
          { gorsel: G.tablo(["Event", "Place", "Time"], [["🥁 Parade", "Main Street", "11 a.m."], ["🏆 Dance competition", "Town Square", "2 p.m."], ["🎸 Rock concert", "City Park", "6 p.m."], ["🎆 Fireworks", "Seaside", "9 p.m."]]), kural: "a.m.: öğleden önce, p.m.: öğleden sonra / akşam." }),
      ],
      "enfes.adj": [
        () => {
          const [fiil, ing, ed, cIng, cEd] = sec(SIFAT), edMi = Math.random() < 0.5;
          const dogru = edMi ? ed : ing, diger = edMi ? ing : ed;
          return S({ kaz: "enfes.adj", duzey: "uygulama", zorluk: 2, soru: `Choose the correct answer (${fiil}):<br><b>${edMi ? cEd : cIng}</b>`, dogru,
            yanlis: [[diger, "kavrama", edMi ? `Burada kişinin ne hissettiği anlatılıyor; “${diger}” ise bir şeyin nasıl olduğunu anlatır.` : `Burada bir şeyin (olayın) nasıl olduğu anlatılıyor; “${diger}” kişinin duygusunu anlatır.`],
              [fiil, "bilgi", `“${fiil}” fiilin yalın hâlidir; was/were'den sonra sıfat gerekir.`], [fiil + "s", "islem", "Fiile -s eklemek sıfat oluşturmaz; -ing ya da -ed hâli gerekir."]],
            ipucu: edMi ? "Cümlede bir kişinin duygusu mu anlatılıyor?" : "Cümlede bir olayın / şeyin nasıl olduğu mu anlatılıyor?",
            cozum: [edMi ? "Boşluktan önce bir kişi (ya da kişiler) var ve onun ne hissettiği anlatılıyor." : "Boşluktan önce bir şey ya da olay var ve onun nasıl olduğu anlatılıyor.",
              edMi ? "Kişinin duygusu -ed ile biten sıfatla anlatılır." : "Duyguya neden olan şey -ing ile biten sıfatla anlatılır.", `Doğru cevap: ${dogru}.`],
            kural: "-ing: şeyin / olayın özelliği (boring film). -ed: kişinin duygusu (bored student)." });
        },
        Q("enfes.adj", "aciklama", 1, "Which sentence describes a <b>feeling</b> of a person?", "Elif was interested in the art exhibition.",
          [["The art exhibition was interesting.", "kavrama", "Bu cümle serginin nasıl olduğunu anlatır, kişinin duygusunu değil."], ["The concert was exciting.", "kavrama", "Bu cümle konserin özelliğini anlatır."], ["The match was thrilling.", "kavrama", "Bu cümle maçın nasıl olduğunu anlatır."]],
          "Kişinin hissettiği duygu hangi ekle biten sıfatla anlatılır?", ["Kişinin duygusu -ed ile biten sıfatlarla anlatılır.", "Seçenekler içinde -ed ile biten sıfat yalnızca “interested”.", "Elif was interested … cümlesi Elif'in duygusunu anlatır."],
          { kural: "Kişi + was/were + -ed sıfat → duygu: I was excited, they were bored." }),
        Q("enfes.adj", "uygulama", 1, "👻 The haunted house at the fair was very ___. My little sister cried.", "scary",
          [["scared", "kavrama", "“scared” korkmuş kişiyi anlatır; ev bir şey hissetmez."], ["bored", "kavrama", "“bored” sıkılmış kişiyi anlatır ve anlam uymuyor."], ["interested", "kavrama", "“interested” ilgili kişiyi anlatır; ev için kullanılmaz."]],
          "Ev mi korkuyor, yoksa korkutucu olan şey mi ev?", ["Boşluk “the haunted house” (perili ev) için bir özellik istiyor.", "Ev korkutucu bir şeydir; korkan kişi ise kız kardeştir.", "Korkutucu = scary. Cevap: scary."],
          { kural: "scary: korkutucu (şey) · scared: korkmuş (kişi)." }),
        Q("enfes.adj", "transfer", 2, "— How was the concert last night?<br>— It was ___! The singer was fantastic and everybody was dancing.", "amazing",
          [["boring", "kavrama", "Herkesin dans ettiği ve şarkıcının harika olduğu bir konser sıkıcı değildir."], ["amazed", "kavrama", "Konser bir şey hissetmez; konserin özelliği için “amazing” denir."], ["tired", "kavrama", "“tired” yorgun kişiyi anlatır; konser yorgun olamaz."]],
          "Konser hakkında olumlu bir sıfat lazım. -ing mi, -ed mi?", ["Konuşmacı konserin nasıl olduğunu anlatıyor.", "Şarkıcı harika ve herkes dans ediyor; demek ki konser çok güzeldi.", "Olayın özelliği -ing ile: amazing."],
          { kural: "How was the …? sorusuna olayın özelliğini anlatan -ing sıfatıyla cevap ver: It was exciting / amazing." }),
        Q("enfes.adj", "uygulama", 2, "Which sentence is <b>wrong</b>?", "I was very boring during the long film.",
          [["The long film was very boring.", "kavrama", "Bu cümle doğrudur; filmin özelliği -ing ile anlatılır."], ["We were excited before the match.", "kavrama", "Bu cümle doğrudur; kişilerin duygusu -ed ile anlatılır."], ["The roller coaster was thrilling.", "kavrama", "Bu cümle doğrudur; olayın özelliği -ing ile anlatılır."]],
          "Kişinin duygusunu anlatan cümlede -ed mi kullanılmış?", ["Her cümlede sıfatın kimi anlattığına bak.", "“I was very boring” cümlesi “Ben çok sıkıcıydım” anlamına gelir; anlatılmak istenen ise sıkılmış olmaktır.", "Doğrusu: I was very bored during the long film."],
          { kural: "I was bored = Sıkıldım. I was boring = Ben sıkıcı biriydim (farklı anlam!)." }),
      ],
      "enfes.past": [
        () => {
          const [ozne, dogru, simdi] = sec([["I", "was", "am"], ["You", "were", "are"], ["He", "was", "is"], ["She", "was", "is"], ["We", "were", "are"], ["They", "were", "are"], ["My sister", "was", "is"], ["My friends", "were", "are"], ["Our teacher", "was", "is"], ["The children", "were", "are"]]);
          const yer = sec(["at the music festival yesterday", "at the book fair last Sunday", "at the concert last night", "very excited at the parade last week", "at the science exhibition two days ago", "in the audience at the school show last Friday"]);
          const diger = dogru === "was" ? "were" : "was";
          return S({ kaz: "enfes.past", duzey: "uygulama", zorluk: 1, soru: `Choose the correct answer:<br><b>${ozne} ___ ${yer}.</b>`, dogru,
            yanlis: [[diger, "kavrama", dogru === "was" ? `“${ozne}” tekil (ya da I) olduğu için “was” kullanılır.` : `“${ozne}” çoğul (ya da you) olduğu için “were” kullanılır.`],
              [simdi, "dikkat", "Cümlede geçmiş zaman ifadesi var; şimdiki/geniş zaman hâli uymaz."], ["be", "bilgi", "“be” fiilin yalın hâlidir; özneye göre was/were olarak çekimlenir."]],
            ipucu: "Önce zamanı, sonra özneyi kontrol et.",
            cozum: ["Cümledeki zaman ifadesi (yesterday, last…, ago) geçmişi gösterir.", `Özne “${ozne}”: ${dogru === "was" ? "I / he / she / it ve tekil isimlerle “was”" : "you / we / they ve çoğul isimlerle “were”"} kullanılır.`, `Doğru cevap: ${ozne} ${dogru} …`],
            kural: "I / he / she / it → was; you / we / they → were." });
        },
        Q("enfes.past", "uygulama", 1, "Make the sentence negative: <b>The match was boring.</b>", "The match wasn't boring.",
          [["The match weren't boring.", "kavrama", "“The match” tekildir; olumsuzu “wasn't” olur."], ["The match didn't boring.", "bilgi", "be fiili olumsuz yapılırken “didn't” kullanılmaz; “wasn't” kullanılır."], ["The match isn't boring.", "dikkat", "Cümle geçmiş zamandadır; “isn't” şimdiki zamandır."]],
          "was fiilinin olumsuz hâli nedir?", ["Cümlede “was” var.", "was + not = wasn't.", "Olumsuz cümle: The match wasn't boring."],
          { kural: "was not = wasn't · were not = weren't." }),
        Q("enfes.past", "transfer", 1, "— ___ you at the fireworks show last night?<br>— Yes, I was. It was amazing!", "Were",
          [["Was", "kavrama", "“you” öznesiyle geçmişte “were” kullanılır."], ["Did", "bilgi", "be fiili ile soru sorarken “did” kullanılmaz."], ["Are", "dikkat", "“last night” geçmişi gösterir; “are” şimdiki zamandır."]],
          "Soru “you” ile soruluyor ve zaman geçmiş.", ["“last night” geçmiş zaman ifadesidir.", "“you” öznesi ile be fiilinin geçmişi “were” olur.", "Soru: Were you at the fireworks show last night?"],
          { kural: "Soru yaparken was/were özneden önce gelir: Were you …? Was she …?" }),
        Q("enfes.past", "transfer", 2, "— Where were you last weekend?<br>— ___", "I was at the music festival with my cousins.",
          [["I am at the music festival.", "dikkat", "Soru geçmişi soruyor; cevap da geçmiş zamanda olmalı."], ["Yes, I was.", "kavrama", "Where sorusu Yes/No ile cevaplanmaz; yer söylemek gerekir."], ["It was on Saturday.", "kavrama", "Soru “nerede” diye soruyor, “ne zaman” diye değil."]],
          "“Where” ne sorar? Zaman hangisi?", ["“Where” yer sorar.", "“last weekend” geçmiş zamandır; cevapta “was” olmalı.", "Uygun cevap: I was at the music festival with my cousins."],
          { kural: "Where … ? → yer; When … ? → zaman; Who … ? → kişi. Cevaplar da aynı zamanda verilir." }),
        Q("enfes.past", "baglanti", 2, "Choose the correct question tag: <b>The festival was exciting, ___?</b>", "wasn't it",
          [["was it", "kavrama", "Olumlu cümleye olumsuz soru eki gelir."], ["isn't it", "dikkat", "Cümle geçmiş zamanda (was); soru eki de geçmiş zamanda olmalı."], ["didn't it", "bilgi", "be fiili olan cümlede soru ekinde “did” kullanılmaz."]],
          "Olumlu cümle → olumsuz soru eki. Fiil “was”.", ["Cümle olumlu ve fiili “was”.", "Soru ekinde aynı fiilin olumsuzu ve özne zamiri kullanılır: wasn't + it.", "The festival was exciting, wasn't it?"],
          { kural: "Olumlu cümle → olumsuz soru eki: It was fun, wasn't it? / They were there, weren't they?" }),
      ],
      "enfes.like": [
        Q("enfes.like", "uygulama", 1, "Choose the correct answer: I love ___ at festivals.", "dancing",
          [["dance", "bilgi", "love fiilinden sonra -ing hâli kullanılır."], ["dances", "islem", "İkinci fiile -s eklenmez."], ["danceing", "islem", "Sonu -e ile biten fiillerde -e düşer: dancing."]],
          "love + fiil-ing", ["“love” sevdiğimiz bir etkinliği anlatır.", "Ardından gelen fiil -ing alır.", "dance → dancing (sondaki -e düşer)."],
          { kural: "like / love / enjoy / hate + fiil-ing. -e ile biten fiil: dance → dancing." }),
        Q("enfes.like", "uygulama", 2, "Choose the correct sentence.", "Mert hates waiting in long queues.",
          [["Mert hates wait in long queues.", "bilgi", "hate fiilinden sonra fiil -ing almalıdır."], ["Mert hate waiting in long queues.", "dikkat", "Özne üçüncü tekil (Mert) olduğu için “hates” olmalıdır."], ["Mert hates to waiting in long queues.", "islem", "“to” ile -ing birlikte kullanılmaz."]],
          "Hem öznenin fiiline hem de ikinci fiile bak.", ["Mert = he, bu yüzden “hates”.", "hate fiilinden sonra ikinci fiil -ing alır: waiting.", "Doğru cümle: Mert hates waiting in long queues."],
          { kural: "He / She + likes / loves / hates + fiil-ing." }),
        Q("enfes.like", "uygulama", 1, "Choose the correct answer: We want ___ the fireworks tonight.", "to watch",
          [["watching", "kavrama", "want fiilinden sonra “to + fiil” kullanılır, -ing değil."], ["watch", "bilgi", "want fiilinden sonra “to” gerekir."], ["watches", "islem", "want'tan sonra fiil -s almaz; “to watch” olmalı."]],
          "want + to + fiil", ["“want” bir isteği anlatır.", "Ardından “to” ve fiilin yalın hâli gelir.", "We want to watch the fireworks tonight."],
          { kural: "want + to + fiil: I want to go. She wants to sing." }),
        Q("enfes.like", "transfer", 2, "Look at the table. Which sentence is <b>true</b>?", "Zeynep loves swimming.",
          [["Can likes swimming.", "dikkat", "Tabloda Can için yüzme 👎 (doesn't like) olarak işaretli."], ["Zeynep hates dancing.", "dikkat", "Zeynep dans etmeyi seviyor (❤️)."], ["Can hates singing.", "dikkat", "Can şarkı söylemeyi seviyor (❤️)."]],
          "Her kişinin satırını dikkatle oku: ❤️ love, 👍 like, 👎 don't like, 😡 hate.", ["Tabloda Zeynep'in yüzme sütununda ❤️ var.", "❤️ = love, yani Zeynep loves swimming.", "Diğer cümleler tabloyla uyuşmuyor."],
          { gorsel: G.tablo(["", "🏊 swimming", "💃 dancing", "🎤 singing"], [["Zeynep", "❤️", "❤️", "👍"], ["Can", "👎", "😡", "❤️"]]), kural: "❤️ love > 👍 like > 👎 don't like > 😡 hate." }),
        Q("enfes.like", "transfer", 2, "— Do you like watching football matches?<br>— ___ I think they are boring.", "No, I don't.",
          [["Yes, I do.", "kavrama", "Maçları sıkıcı bulan biri “Evet, severim” demez."], ["No, I'm not.", "bilgi", "Soru “Do you…?” ile sorulduğu için cevap “don't” ile verilir."], ["Yes, I like.", "bilgi", "Kısa cevapta “Yes, I do.” denir; “Yes, I like.” yanlıştır."]],
          "Soru “Do you…?” ile başlıyor. Konuşmacı maçları nasıl buluyor?", ["Konuşmacı maçları “boring” (sıkıcı) buluyor; cevap olumsuz olmalı.", "“Do you …?” sorusuna kısa olumsuz cevap: No, I don't.", "Cevap: No, I don't."],
          { kural: "Do you like …-ing? → Yes, I do. / No, I don't." }),
      ],
    },
  });

  /* ================= 2) PLACES AND DIRECTIONS IN THE CITY ================= */
  const CTY_SOZ = [["skyscraper", "gökdelen"], ["kiosk", "büfe"], ["municipality", "belediye"], ["museum", "müze"], ["bank", "banka"], ["pharmacy", "eczane"],
    ["bakery", "fırın"], ["hospital", "hastane"], ["police station", "karakol"], ["post office", "postane"], ["library", "kütüphane"], ["cinema", "sinema"],
    ["noisy", "gürültülü"], ["crowded", "kalabalık"], ["quiet", "sessiz, sakin"], ["modern", "modern"], ["historic", "tarihî"], ["polluted", "kirli, kirlenmiş"],
    ["next to", "yanında"], ["between", "arasında"], ["opposite", "karşısında"], ["behind", "arkasında"], ["in front of", "önünde"], ["turn left", "sola dön"], ["go straight", "düz git"]];

  const YERLER = [["🏦", "bank"], ["💊", "pharmacy"], ["🥖", "bakery"], ["🏛️", "museum"], ["📚", "library"], ["🎬", "cinema"], ["🏥", "hospital"], ["📮", "post office"], ["🚓", "police station"], ["🌳", "park"]];
  const NEREDE = [
    ["Where can you buy medicine?", "pharmacy", "Eczane (pharmacy) ilaç satın aldığımız yerdir."],
    ["Where can you buy bread and cakes?", "bakery", "Fırın (bakery) ekmek ve kek satılan yerdir."],
    ["Where can you borrow books?", "library", "Kütüphanede (library) kitap ödünç alınır."],
    ["Where can you watch a new film?", "cinema", "Sinemada (cinema) film izlenir."],
    ["Where can you see old and historic objects?", "museum", "Müzede (museum) eski ve tarihî eserler sergilenir."],
    ["Where can you send a letter?", "post office", "Postanede (post office) mektup gönderilir."],
    ["Where do doctors and nurses work?", "hospital", "Doktorlar ve hemşireler hastanede (hospital) çalışır."],
    ["Where can you save your money?", "bank", "Bankada (bank) para biriktirilir."],
    ["Where can you buy a newspaper and a bottle of water quickly?", "kiosk", "Büfede (kiosk) gazete, su gibi şeyler hızlıca alınır."],
  ];

  KONU_EKLE("en", {
    id: "en_city", tema: "en5", ad: "Places and Directions in the City", tr: "Şehirde yerler ve yön tarifi",
    kazanimlar: [
      { id: "encty.places", ad: "Şehirdeki yerleri ve şehri anlatan sıfatları (noisy, crowded, historic…) tanıma" },
      { id: "encty.prep", ad: "Yer edatlarıyla (next to, between, opposite, behind…) yer tarif etme" },
      { id: "encty.dir", ad: "Yol sorma ve tarif etme (go straight, turn left / right, take the second turning)" },
    ],
    sozluk: CTY_SOZ,
    anlatim: [
      { baslik: "Şehirdeki yerler ve şehri anlatmak",
        metin: "Şehirde pek çok yer vardır: <b>a bank</b> (banka), <b>a pharmacy</b> (eczane), <b>a bakery</b> (fırın), <b>a hospital</b> (hastane), <b>a police station</b> (karakol), <b>a post office</b> (postane), <b>a library</b> (kütüphane), <b>a cinema</b> (sinema), <b>a museum</b> (müze), <b>a kiosk</b> (büfe), <b>a skyscraper</b> (gökdelen), <b>the municipality</b> (belediye).<br>Bir şehri ya da mahalleyi anlatırken şu sıfatları kullanırız: <b>noisy</b> (gürültülü) – <b>quiet</b> (sessiz), <b>crowded</b> (kalabalık), <b>modern</b> (modern) – <b>historic</b> (tarihî), <b>clean</b> (temiz) – <b>polluted</b> (kirli).",
        ornek: "<b>Istanbul is a crowded and historic city. There are a lot of skyscrapers, too.</b><br><b>My village is quiet and clean.</b>",
        durak: { soru: "Where can you buy medicine?", secenekler: [["at the pharmacy", true, "İlaç eczaneden (pharmacy) alınır."], ["at the bakery", false, "Fırında ekmek ve kek satılır."], ["at the library", false, "Kütüphanede kitap okunur ve ödünç alınır."], ["at the post office", false, "Postanede mektup ve kargo gönderilir."]] } },
      { baslik: "Yer edatları",
        metin: "Bir yerin nerede olduğunu anlatırken yer edatlarını kullanırız:<br><b>next to</b> (yanında), <b>between … and …</b> (… ile … arasında), <b>opposite / across from</b> (karşısında), <b>in front of</b> (önünde), <b>behind</b> (arkasında), <b>near</b> (yakınında), <b>on the corner of</b> (köşesinde).<br>Soru: <b>Where is the bank?</b> Cevap: <b>It's next to the bakery.</b>",
        ornek: "<b>The pharmacy is between the bank and the bakery.</b><br><b>The library is opposite the park.</b><br><b>The kiosk is on the corner of Atatürk Street.</b>",
        gorsel: G.tablo(["⬅️ West", "Main Street", "East ➡️"], [["🏦 bank", "💊 pharmacy", "🥖 bakery"], ["🚗 ═════", "🚗 ═════", "🚗 ═════"], ["📚 library", "🌳 park", "🎬 cinema"]]),
        durak: { soru: "Look at the map. Where is the pharmacy?", secenekler: [["It's between the bank and the bakery.", true, "Eczane, bankanın ve fırının ortasındadır."], ["It's next to the cinema.", false, "Sinema caddenin karşı tarafındadır; eczanenin yanında değildir."], ["It's opposite the library.", false, "Eczanenin karşısında park vardır; kütüphane bankanın karşısındadır."], ["It's behind the park.", false, "Eczane parkın arkasında değil, caddenin karşısındadır."]] } },
      { baslik: "Yol sormak ve tarif etmek",
        metin: "Yol sorarken kibarca <b>Excuse me, how can I get to the museum?</b> ya da <b>Where is the post office, please?</b> deriz.<br>Yol tarif ederken emir cümleleri kullanırız: <b>Go straight</b> (düz git), <b>Turn left</b> (sola dön), <b>Turn right</b> (sağa dön), <b>Take the first / second turning on the left</b> (soldaki birinci / ikinci sokağa sap), <b>Cross the street</b> (karşıya geç). Sonunda yerin konumunu söyleriz: <b>It's on your left / right.</b>",
        ornek: "<b>— Excuse me, how can I get to the library?<br>— Go straight and take the second turning on the right. The library is on your left, next to the bank.<br>— Thank you!</b>",
        durak: { soru: "⬆️ ➡️ Which direction is correct for these arrows?", secenekler: [["Go straight and turn right.", true, "⬆️ düz gitmeyi, ➡️ sağa dönmeyi gösterir."], ["Go straight and turn left.", false, "➡️ oku sağı gösterir; sol ⬅️ olurdu."], ["Turn left and go straight.", false, "İlk ok düz, ikinci ok sağ yönü gösterir."], ["Turn right and cross the street.", false, "İlk ok ⬆️ düz gitmeyi gösterir."]] } },
    ],
    uret: {
      "encty.places": [
        kelime("encty.places", CTY_SOZ),
        () => {
          const [soru, dogru, aciklama] = sec(NEREDE);
          const diger = karistir(NEREDE.filter(n => n[1] !== dogru)).slice(0, 3);
          return S({ kaz: "encty.places", duzey: "aciklama", zorluk: 1, soru, dogru: "at the " + dogru,
            yanlis: diger.map(n => ["at the " + n[1], "bilgi", n[2]]),
            ipucu: "Sorudaki eylemi (buy, borrow, watch, send…) hangi yerde yaparız?",
            cozum: ["Sorudaki eylemi bul.", aciklama, `Cevap: at the ${dogru}.`],
            kural: "Where can you …? sorusuna “at the + yer” ile cevap verilir." });
        },
        Q("encty.places", "aciklama", 1, "🏙️ A very tall building in a big city is a ___.", "skyscraper",
          [["kiosk", "bilgi", "“kiosk” küçük bir büfedir, çok yüksek bir bina değildir."], ["bakery", "bilgi", "“bakery” ekmek yapılan fırındır."], ["pharmacy", "bilgi", "“pharmacy” eczanedir."]],
          "Gökyüzüne doğru uzanan çok yüksek bina…", ["Tanım “büyük şehirdeki çok yüksek bina” diyor.", "Bunun İngilizcesi “skyscraper” (gökdelen) olur.", "sky (gökyüzü) + scraper (sıyıran) = skyscraper."],
          { kural: "skyscraper: gökdelen · kiosk: büfe · municipality: belediye." }),
        Q("encty.places", "uygulama", 2, "There are a lot of cars and people in the city centre. It is very ___ and ___.", "noisy / crowded",
          [["quiet / clean", "kavrama", "Çok araba ve insan olan bir yer sessiz olmaz."], ["quiet / crowded", "kavrama", "“quiet” (sessiz) ile çok araba olan yer çelişir."], ["historic / quiet", "kavrama", "Cümle tarihî olmayı değil, kalabalık ve gürültüyü anlatıyor."]],
          "Çok araba ve çok insan → ses ve kalabalık.", ["Çok araba gürültü yapar: noisy.", "Çok insan kalabalık demektir: crowded.", "Cevap: noisy / crowded."],
          { kural: "noisy ↔ quiet · crowded: kalabalık · clean ↔ polluted · modern ↔ historic." }),
        Q("encty.places", "transfer", 2, "Read the text and answer the question.<br><i>I live in a small town. It is quiet and clean. There is a historic museum in the town centre. There aren't any skyscrapers, but there is a big park next to my school.</i><br>Which sentence is <b>true</b> about the town?", "It is quiet.",
          [["There are a lot of skyscrapers.", "dikkat", "Metinde “There aren't any skyscrapers” deniyor."], ["It is noisy and polluted.", "dikkat", "Metne göre kasaba sessiz ve temizdir."], ["The park is next to the museum.", "dikkat", "Park okulun yanındadır, müzenin değil."]],
          "Her seçeneği metindeki cümlelerle karşılaştır.", ["Metin: “It is quiet and clean.”", "Gökdelen yok, park okulun yanında.", "Doğru seçenek: It is quiet."],
          { kural: "There is / There are ile bir yerde neler olduğunu, sıfatlarla o yerin nasıl olduğunu anlatırız." }),
      ],
      "encty.prep": [
        () => {
          const y = karistir(YERLER).slice(0, 6), ad = i => "the " + y[i][1];
          const harita = G.tablo(["⬅️ West", "Main Street", "East ➡️"], [[0, 1, 2].map(i => y[i][0] + " " + y[i][1]), ["🚗 ═════", "🚗 ═════", "🚗 ═════"], [3, 4, 5].map(i => y[i][0] + " " + y[i][1])]);
          const karsi = i => (i + 3) % 6, mod = R(0, 2);
          if (mod === 0) {
            const ust = Math.random() < 0.5, [a, b, c] = ust ? [0, 1, 2] : [3, 4, 5];
            return S({ kaz: "encty.prep", duzey: "uygulama", zorluk: 1, gorsel: harita, soru: `Look at the map. What is <b>between</b> ${ad(a)} and ${ad(c)}?`, dogru: ad(b),
              yanlis: [[ad(karsi(b)), "kavrama", "Bu yer caddenin karşı tarafındadır; ortadaki yerin karşısındadır."], [ad(karsi(a)), "dikkat", "Bu yer caddenin karşı tarafında, köşededir."], [ad(karsi(c)), "dikkat", "Bu yer caddenin karşı tarafında, köşededir."]],
              ipucu: "İki yerin tam ortasında hangi yer var?", cozum: [`${ad(a)} ve ${ad(c)} haritada aynı sırada, iki uçtadır.`, `Bu ikisinin ortasında ${ad(b)} vardır.`, `Cevap: ${ad(b)} is between ${ad(a)} and ${ad(c)}.`],
              kural: "between A and B: A ile B arasında." });
          }
          if (mod === 1) {
            const x = R(0, 5), d = karsi(x), kom = [x % 3 === 1 ? x - 1 : x, x % 3 === 1 ? x + 1 : (x % 3 === 0 ? x + 1 : x - 1)].filter(i => i !== x);
            const yan = kom[0], kalan = [0, 1, 2, 3, 4, 5].filter(i => i !== x && i !== d && i !== yan);
            return S({ kaz: "encty.prep", duzey: "uygulama", zorluk: 2, gorsel: harita, soru: `Look at the map. What is <b>opposite</b> ${ad(x)}?`, dogru: ad(d),
              yanlis: [[ad(yan), "kavrama", "Bu yer aynı sıradadır; “opposite” değil “next to” olur."], ...karistir(kalan).slice(0, 2).map(i => [ad(i), "dikkat", "Bu yer tam karşıda değildir; çapraz ya da uzaktadır."])],
              ipucu: "Caddenin tam karşı tarafına bak.", cozum: [`${ad(x)} haritada bir sütundadır.`, `Caddenin karşı tarafında, aynı sütunda ${ad(d)} vardır.`, `Cevap: ${ad(d)} is opposite ${ad(x)}.`],
              kural: "opposite / across from: karşısında (caddenin öbür yanında, tam karşıda)." });
          }
          const dogrular = [`The ${y[0][1]} is next to the ${y[1][1]}.`, `The ${y[4][1]} is between the ${y[3][1]} and the ${y[5][1]}.`, `The ${y[2][1]} is opposite the ${y[5][1]}.`];
          return S({ kaz: "encty.prep", duzey: "aciklama", zorluk: 2, gorsel: harita, soru: "Look at the map. Which sentence is <b>true</b>?", dogru: sec(dogrular),
            yanlis: [[`The ${y[0][1]} is opposite the ${y[4][1]}.`, "dikkat", `${ad(0)} köşededir; karşısında ${ad(3)} vardır.`], [`The ${y[1][1]} is between the ${y[3][1]} and the ${y[5][1]}.`, "kavrama", `${ad(1)} caddenin öbür yanındadır; bu iki yerin arasında değildir.`], [`The ${y[2][1]} is next to the ${y[0][1]}.`, "dikkat", `${ad(2)} ile ${ad(0)} arasında ${ad(1)} vardır; yan yana değildir.`]],
            ipucu: "Her cümleyi haritada tek tek kontrol et.", cozum: ["next to: aynı sırada hemen yanında.", "between: iki yerin ortasında; opposite: caddenin tam karşısında.", "Haritaya uyan tek cümle doğru seçenektir."],
            kural: "next to: yanında · between: arasında · opposite: karşısında." });
        },
        Q("encty.prep", "hatirlama", 1, "🚗🏠 The car is <b>in front of</b> the house. What does “in front of” mean?", "önünde",
          [["arkasında", "bilgi", "“arkasında” = behind."], ["yanında", "bilgi", "“yanında” = next to."], ["karşısında", "bilgi", "“karşısında” = opposite / across from."]],
          "front = ön.", ["“front” ön demektir.", "“in front of” = önünde.", "The car is in front of the house = Araba evin önündedir."],
          { kural: "in front of: önünde ↔ behind: arkasında." }),
        Q("encty.prep", "uygulama", 1, "The garden is at the back of the house. The garden is ___ the house.", "behind",
          [["in front of", "kavrama", "“in front of” önünde demektir; bahçe evin arkasında."], ["between", "kavrama", "“between” iki şeyin arasında demektir; burada tek bir yer var."], ["on", "bilgi", "“on” üstünde demektir."]],
          "at the back of = arkasında.", ["Cümle bahçenin evin arka tarafında olduğunu söylüyor.", "Arkasında = behind.", "The garden is behind the house."],
          { kural: "behind: arkasında · near: yakınında · on the corner of: köşesinde." }),
        Q("encty.prep", "transfer", 2, "— Excuse me, is there a bakery near here?<br>— Yes, there is. It's ___ Gül Street and Lale Street. It's on the corner.", "on the corner of",
          [["between of", "islem", "“between” ile “of” birlikte kullanılmaz; ayrıca iki sokak köşesi için “on the corner of” denir."], ["in front", "islem", "“in front” sonuna “of” almalıdır ve anlamı köşe değildir."], ["opposite of", "islem", "“opposite” ile “of” kullanılmaz; ayrıca anlam köşe değil."]],
          "Cevabın sonunda “It's on the corner.” deniyor.", ["Fırın iki sokağın birleştiği köşededir.", "Köşesinde = on the corner of.", "It's on the corner of Gül Street and Lale Street."],
          { kural: "on the corner of X Street: X Caddesi'nin köşesinde." }),
        Q("encty.prep", "uygulama", 2, "Choose the correct sentence.", "The cinema is across from the park.",
          [["The cinema is across of the park.", "islem", "Doğru kalıp “across from” olur."], ["The cinema is between the park.", "kavrama", "“between” iki yer ister: between the park and the bank."], ["The cinema is next the park.", "islem", "Doğru kalıp “next to” olur."]],
          "Her edat kalıbının doğru yazımını hatırla.", ["Yer edatları kalıp olarak öğrenilir: next to, across from, in front of.", "“between” her zaman iki yerle kullanılır: between A and B.", "Doğru cümle: The cinema is across from the park."],
          { kural: "across from = opposite: karşısında." }),
      ],
      "encty.dir": [
        Q("encty.dir", "hatirlama", 1, "⬅️ What does this sign mean?", "Turn left.",
          [["Turn right.", "dikkat", "Sağa dönüş oku ➡️ olur."], ["Go straight.", "dikkat", "Düz gitme oku ⬆️ olur."], ["Go back.", "kavrama", "Ok sol yönü gösteriyor, geri gitmeyi değil."]],
          "Okun yönüne bak.", ["Ok sola bakıyor.", "Sola dön = Turn left.", "Cevap: Turn left."],
          { kural: "Turn left: sola dön · Turn right: sağa dön · Go straight: düz git." }),
        Q("encty.dir", "transfer", 1, "— Excuse me, ___ can I get to the post office?<br>— Go straight and turn right. It's on your left.", "how",
          [["what", "kavrama", "Yol tarifi sorarken “What can I get…” denmez; “How can I get to…?” kalıbı kullanılır."], ["who", "bilgi", "“who” kişi sorar."], ["when", "bilgi", "“when” zaman sorar; yol tarifi için “how” kullanılır."]],
          "Bir yere nasıl gidileceğini soruyoruz.", ["Yol sormak = bir yere nasıl gideceğimizi sormak.", "“Nasıl” = how.", "Excuse me, how can I get to the post office?"],
          { kural: "Yol sorma: Excuse me, how can I get to …? / Where is …, please?" }),
        Q("encty.dir", "uygulama", 2, "Follow the directions: <b>Go straight. Take the second turning on the left. It's on your right.</b><br>Which arrows show the first two steps?", "⬆️ then ⬅️ (2nd street)",
          [["⬆️ then ➡️ (2nd street)", "dikkat", "Tarifte “on the left” deniyor; sola sapılmalı."], ["⬆️ then ⬅️ (1st street)", "dikkat", "Tarif ikinci (second) sokağı söylüyor, birinciyi değil."], ["➡️ then ⬆️ (2nd street)", "dikkat", "Önce düz gidilir (Go straight), sonra sola sapılır."]],
          "Adımları sırayla oku: önce ne, sonra ne?", ["İlk adım: Go straight → ⬆️.", "İkinci adım: soldaki ikinci sokağa sap → ⬅️ (2nd street).", "Cevap: ⬆️ then ⬅️ (2nd street)."],
          { kural: "Take the first / second / third turning on the left / right: soldaki / sağdaki birinci / ikinci / üçüncü sokağa sap." }),
        Q("encty.dir", "transfer", 2, "Read the dialogue.<br><i>Tourist: Excuse me, where is the museum, please?<br>Elif: Go straight along this street. Turn right at the bank. The museum is next to the library.</i><br>Where is the museum?", "next to the library",
          [["next to the bank", "dikkat", "Bankada sağa dönülüyor; müze kütüphanenin yanında."], ["opposite the library", "dikkat", "Metinde “next to” deniyor, “opposite” değil."], ["behind the bank", "dikkat", "Metinde müzenin bankanın arkasında olduğu söylenmiyor."]],
          "Diyalogun son cümlesine bak.", ["Elif yol tarifinden sonra müzenin yerini söylüyor.", "“The museum is next to the library.”", "Cevap: next to the library."],
          { kural: "Yol tarifinin sonunda yerin konumu söylenir: It's next to / opposite / on your left …" }),
        Q("encty.dir", "aciklama", 1, "Which sentence is <b>not</b> a direction?", "The museum is very historic.",
          [["Go straight.", "kavrama", "Bu bir yol tarifidir: düz git."], ["Turn right at the bakery.", "kavrama", "Bu bir yol tarifidir: fırından sağa dön."], ["Cross the street.", "kavrama", "Bu bir yol tarifidir: karşıya geç."]],
          "Yol tarifi emir cümlesiyle yapılır.", ["Yol tarifi cümleleri emir kipindedir: Go, Turn, Take, Cross.", "“The museum is very historic.” müzeyi anlatır, yön söylemez.", "Cevap: The museum is very historic."],
          { kural: "Yol tarifi emir cümleleriyle yapılır: Go straight. Turn left. Take the first turning." }),
      ],
    },
  });

  /* ============ 3) TRANSPORTATION IN THE NEIGHBOURHOOD AND CITY ============ */
  const TRN_SOZ = [["ferry", "vapur, feribot"], ["subway", "metro"], ["tram", "tramvay"], ["bus", "otobüs"], ["minibus", "minibüs, dolmuş"], ["taxi", "taksi"],
    ["train", "tren"], ["plane", "uçak"], ["ticket", "bilet"], ["bus stop", "otobüs durağı"], ["station", "istasyon"], ["sign", "işaret, tabela"], ["parking", "otopark, park etme"],
    ["traffic lights", "trafik ışıkları"], ["pedestrian crossing", "yaya geçidi"], ["passenger", "yolcu"], ["driver", "sürücü, şoför"], ["seat belt", "emniyet kemeri"],
    ["helmet", "kask"], ["on foot", "yürüyerek"], ["fast", "hızlı"], ["slow", "yavaş"], ["cheap", "ucuz"], ["expensive", "pahalı"]];
  const ARAC = [["🚌", "bus"], ["🚋", "tram"], ["⛴️", "ferry"], ["🚇", "subway"], ["🚕", "taxi"], ["🚆", "train"], ["🚲", "bike"], ["🚗", "car"], ["✈️", "plane"], ["🚐", "minibus"]];
  const KISI = [["Ayşe", "She"], ["Emre", "He"], ["My uncle", "He"], ["Our teacher", "She"], ["Kerem", "He"], ["My grandmother", "She"]];

  KONU_EKLE("en", {
    id: "en_transport", tema: "en5", ad: "Transportation in the Neighbourhood and City", tr: "Mahallede ve şehirde ulaşım",
    kazanimlar: [
      { id: "entrn.vocab", ad: "Ulaşım araçlarını ve ulaşımla ilgili kelimeleri (ticket, bus stop, sign…) tanıma" },
      { id: "entrn.by", ad: "Ulaşım şeklini by bus / on foot ile anlatma, How do you go …? / How long does it take? sorularını kullanma" },
      { id: "entrn.rules", ad: "Trafik işaretlerini ve kurallarını emir cümleleriyle anlama; ulaşım araçlarını karşılaştırma" },
    ],
    sozluk: TRN_SOZ,
    anlatim: [
      { baslik: "Ulaşım araçları",
        metin: "Şehirde ve mahallede farklı ulaşım araçları kullanırız: <b>a bus</b> (otobüs), <b>a minibus</b> (minibüs / dolmuş), <b>a tram</b> (tramvay), <b>a subway</b> (metro), <b>a ferry</b> (vapur), <b>a taxi</b> (taksi), <b>a train</b> (tren), <b>a plane</b> (uçak), <b>a bike</b> (bisiklet).<br>Ulaşımla ilgili kelimeler: <b>a ticket</b> (bilet), <b>a bus stop</b> (otobüs durağı), <b>a station</b> (istasyon), <b>a sign</b> (işaret), <b>parking</b> (otopark), <b>traffic lights</b> (trafik ışıkları), <b>a pedestrian crossing</b> (yaya geçidi), <b>a passenger</b> (yolcu), <b>a driver</b> (sürücü).",
        ornek: "<b>In Istanbul, people cross the Bosphorus by ferry.</b><br><b>We wait for the bus at the bus stop.</b>",
        durak: { soru: "⛴️ Which vehicle travels on the sea and carries passengers?", secenekler: [["a ferry", true, "Vapur (ferry) denizde yolcu taşır."], ["a tram", false, "Tramvay raylar üzerinde, karada gider."], ["a subway", false, "Metro yerin altında gider."], ["a taxi", false, "Taksi karayolunda gider."]] } },
      { baslik: "by bus, on foot",
        metin: "Bir yere hangi araçla gittiğimizi anlatırken <b>by + araç</b> kullanırız ve araçtan önce <b>a / the</b> koymayız: <b>by bus, by tram, by ferry, by subway, by bike, by car</b>.<br>Yürüyerek gidiyorsak <b>on foot</b> deriz.<br>Sorular: <b>How do you go to school? — I go to school by bus.</b><br><b>How long does it take? — It takes twenty minutes.</b> (Ne kadar sürüyor? — Yirmi dakika sürüyor.)",
        ornek: "<b>— How does your father go to work?<br>— He goes to work by subway. It takes thirty minutes.</b>",
        gorsel: G.tablo(["Araç", "Kalıp"], [["🚌 bus", "by bus"], ["🚋 tram", "by tram"], ["⛴️ ferry", "by ferry"], ["🚲 bike", "by bike"], ["🚶 yürüyerek", "on foot"]]),
        durak: { soru: "Choose the correct answer: I walk to school. I go to school ___.", secenekler: [["on foot", true, "Yürüyerek gitmek “on foot” ile anlatılır."], ["by foot", false, "Doğru ve yaygın kalıp “on foot” olur."], ["by walk", false, "“by walk” diye bir kalıp yoktur."], ["by bus", false, "Cümle yürüyerek gittiğini söylüyor, otobüsle değil."]] } },
      { baslik: "Trafik kuralları ve karşılaştırma",
        metin: "Trafik işaretleri ve kurallar genellikle <b>emir cümleleriyle</b> verilir: <b>Stop!</b> (Dur!), <b>Wait for the green light.</b> (Yeşil ışığı bekle.), <b>Use the pedestrian crossing.</b> (Yaya geçidini kullan.), <b>Fasten your seat belt.</b> (Emniyet kemerini tak.), <b>Wear a helmet.</b> (Kask tak.), <b>Don't park here.</b> (Buraya park etme.)<br>Araçları karşılaştırırken sıfatların karşılaştırma hâlini kullanırız: <b>The subway is faster than the bus. A taxi is more expensive than a minibus.</b>",
        ornek: "<b>🚦 Red light: Stop! · Green light: Go!</b><br><b>A bike is cheaper than a car.</b>",
        durak: { soru: "🚫🅿️ What does this sign mean?", secenekler: [["Don't park here.", true, "Üzeri çizili P işareti “park etmek yasak” demektir."], ["You can park here.", false, "İşaret yasaklayıcıdır (🚫)."], ["Wear a helmet.", false, "Kask işareti farklıdır."], ["Turn left.", false, "Bu işaret yön göstermez."]] } },
    ],
    uret: {
      "entrn.vocab": [
        kelime("entrn.vocab", TRN_SOZ),
        () => {
          const [e, a] = sec(ARAC.filter(x => x[1] !== "car" && x[1] !== "bike"));
          const diger = karistir(ARAC.filter(x => x[1] !== a)).slice(0, 3);
          return S({ kaz: "entrn.vocab", duzey: "hatirlama", zorluk: 1, soru: `${e} What is this vehicle?`, dogru: "a " + a,
            yanlis: diger.map(x => ["a " + x[1], "bilgi", `${x[0]} işareti “a ${x[1]}” aracını gösterir.`]),
            ipucu: "Resimdeki aracın nerede gittiğini (yol, ray, deniz, hava) düşün.",
            cozum: [`Resimde ${e} var.`, `Bu aracın İngilizcesi “${a}” olur.`, `Cevap: a ${a}.`],
            kural: "Ulaşım araçları: bus, minibus, tram, subway, ferry, taxi, train, plane, bike, car." });
        },
        Q("entrn.vocab", "aciklama", 1, "You buy a ___ before you get on the train.", "ticket",
          [["sign", "bilgi", "“sign” işaret / tabela demektir; satın alınmaz."], ["driver", "bilgi", "“driver” sürücüdür."], ["helmet", "bilgi", "“helmet” kasktır; trene binmek için gerekmez."]],
          "Trene binmeden önce gişeden ne alırız?", ["Toplu taşımaya binmek için para ödeyip bir şey alırız.", "Bu şey bilettir: ticket.", "You buy a ticket before you get on the train."],
          { kural: "ticket: bilet · ticket office: bilet gişesi · passenger: yolcu." }),
        Q("entrn.vocab", "uygulama", 1, "We wait for the bus at the ___.", "bus stop",
          [["station", "kavrama", "“station” tren ya da metro istasyonudur; otobüs için “bus stop” denir."], ["parking", "bilgi", "“parking” otoparktır; otobüs beklenen yer değildir."], ["airport", "bilgi", "“airport” havalimanıdır."]],
          "Otobüsü nerede bekleriz?", ["Otobüs belirli yerlerde durur.", "Bu yere otobüs durağı = bus stop denir.", "We wait for the bus at the bus stop."],
          { kural: "bus stop: otobüs durağı · train station: tren istasyonu · airport: havalimanı." }),
        Q("entrn.vocab", "transfer", 2, "Read the text and answer the question.<br><i>My name is Deniz. I live in İzmir. Every morning I take the ferry to the other side of the city. My school is near the pier. On Saturdays I go to my grandmother's house by tram.</i><br>How does Deniz go to school?", "by ferry",
          [["by tram", "dikkat", "Deniz tramvayla cumartesi günleri büyükannesine gidiyor."], ["on foot", "dikkat", "Metinde yürüdüğü söylenmiyor."], ["by bus", "dikkat", "Metinde otobüsten söz edilmiyor."]],
          "Her sabah (every morning) ne yapıyor?", ["Deniz her sabah vapura biniyor (takes the ferry).", "Okulu iskelenin yakınında.", "Demek ki okula vapurla gidiyor: by ferry."],
          { kural: "take the ferry = go by ferry: vapura binmek / vapurla gitmek." }),
      ],
      "entrn.by": [
        () => {
          const [kisi, zamir] = sec(KISI), yuru = Math.random() < 0.25;
          const [e, a] = yuru ? ["🚶", ""] : sec(ARAC.filter(x => x[1] !== "plane"));
          const dogru = yuru ? "on foot" : "by " + a;
          const yanlis = yuru
            ? [["by foot", "bilgi", "Yürüyerek gitmek için kalıp “on foot” olur."], ["with foot", "bilgi", "Türkçedeki “ile” gibi “with” kullanılmaz."], ["by bus", "dikkat", "Resimde yürüyen biri var, otobüs değil."]]
            : [["with " + a, "bilgi", "Ulaşım aracı “with” ile değil “by” ile söylenir."], ["by a " + a, "islem", "“by” kalıbında araçtan önce “a” kullanılmaz."], ["on foot", "dikkat", `Resimde ${e} var; yürüyerek gitmiyor.`]];
          const yer = sec(["to work", "to the market", "to school", "to the city centre"]);
          return S({ kaz: "entrn.by", duzey: "uygulama", zorluk: 1, soru: `${e} How does ${kisi.toLowerCase().startsWith("my") || kisi.startsWith("Our") ? kisi.replace(/^My/, "your").replace(/^Our/, "your") : kisi} go ${yer}?<br>${zamir} goes ${yer} ___.`, dogru, yanlis,
            ipucu: "Resimdeki araca bak. Araçlarla hangi edat kullanılır?",
            cozum: [`Resimde ${yuru ? "yürüyen biri" : e + " (" + a + ")"} var.`, yuru ? "Yürüyerek gitmek “on foot” ile anlatılır." : "Araçla gitmek “by + araç” ile anlatılır; araçtan önce a / the gelmez.", `Cevap: ${zamir} goes ${yer} ${dogru}.`],
            kural: "by bus / by tram / by ferry … ama yürüyerek: on foot." });
        },
        () => {
          const ad = ["bus", "on foot", "car", "bike", "subway"], d = karistir([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 5);
          const veri = ad.map((a, i) => [a, d[i]]), sorMod = Math.random() < 0.5;
          const gorsel = G.sutun(veri, { baslik: "How do the students in 6/A go to school?", birim: "students" });
          if (sorMod) {
            const i = R(0, 4), ifade = ad[i] === "on foot" ? "on foot" : "by " + ad[i];
            const diger = d.filter((_, j) => j !== i).slice(0, 3);
            return S({ kaz: "entrn.by", duzey: "transfer", zorluk: 1, gorsel, soru: `Look at the graph. How many students go to school <b>${ifade}</b>?`, dogru: String(d[i]),
              yanlis: diger.map(v => [String(v), "dikkat", `${v}, grafikte başka bir ulaşım şeklinin sütunudur.`]),
              ipucu: `Grafikte “${ad[i]}” sütununu bul ve yüksekliğini oku.`,
              cozum: [`Soru “${ifade}” giden öğrencileri soruyor.`, `Grafikte “${ad[i]}” sütunu ${d[i]} değerini gösteriyor.`, `Cevap: ${d[i]} students go to school ${ifade}.`],
              kural: "Grafik sorularında önce doğru sütunu bul, sonra değeri dikkatle oku." });
          }
          const mx = d.indexOf(Math.max(...d)), ifade = i => ad[i] === "on foot" ? "on foot" : "by " + ad[i];
          return S({ kaz: "entrn.by", duzey: "transfer", zorluk: 2, gorsel, soru: "Look at the graph. How do <b>most</b> students go to school?", dogru: ifade(mx),
            yanlis: [0, 1, 2, 3, 4].filter(i => i !== mx).slice(0, 3).map(i => [ifade(i), "dikkat", `Bu yolu ${d[i]} öğrenci kullanıyor; en yüksek sütun değil.`]),
            ipucu: "En yüksek sütunu bul.", cozum: ["“most students” = öğrencilerin çoğu, en çok öğrenci.", `En yüksek sütun “${ad[mx]}” (${d[mx]} öğrenci).`, `Cevap: Most students go to school ${ifade(mx)}.`],
            kural: "most: en çok · How do most students …? → en yüksek değeri bul." });
        },
        Q("entrn.by", "transfer", 1, "— How ___ does it take to get to school?<br>— It takes fifteen minutes by bus.", "long",
          [["many", "kavrama", "“How many” sayı sorar; süre için “How long” kullanılır."], ["much", "kavrama", "“How much” fiyat ya da miktar sorar."], ["often", "kavrama", "“How often” sıklık sorar (her gün, haftada iki kez)."]],
          "Cevapta bir süre (fifteen minutes) var.", ["Cevap bir süreyi bildiriyor: fifteen minutes.", "Süre sormak için “How long does it take?” kullanılır.", "Cevap: long."],
          { kural: "How long does it take? — It takes … minutes. (Ne kadar sürer?)" }),
        Q("entrn.by", "transfer", 2, "— ___<br>— I go to school by tram.", "How do you go to school?",
          [["How long does it take?", "kavrama", "Bu soru süre sorar; cevapta süre yok."], ["Where is your school?", "kavrama", "Bu soru okulun yerini sorar; cevapta yer yok."], ["When do you go to school?", "kavrama", "Bu soru zaman sorar; cevapta saat yok."]],
          "Cevap ulaşım aracını söylüyor.", ["Cevap “by tram” yani ulaşım şeklini veriyor.", "Ulaşım şekli “How do you go to …?” ile sorulur.", "Soru: How do you go to school?"],
          { kural: "How do you go to …? — I go by … / on foot." }),
        Q("entrn.by", "uygulama", 2, "Choose the correct sentence.", "My cousins go to the beach by minibus.",
          [["My cousins go to the beach by the minibus.", "islem", "“by” kalıbında araçtan önce “the” kullanılmaz."], ["My cousins goes to the beach by minibus.", "dikkat", "“My cousins” çoğul olduğu için fiil “go” olmalı."], ["My cousins go to the beach on minibus.", "bilgi", "Araçla gitmek “by + araç” ile anlatılır."]],
          "Hem “by” kalıbına hem de özne–fiil uyumuna bak.", ["“My cousins” çoğuldur: go.", "Araç “by minibus” biçiminde söylenir.", "Doğru cümle: My cousins go to the beach by minibus."],
          { kural: "by + araç (a / the yok): by bus, by minibus, by car." }),
      ],
      "entrn.rules": [
        Q("entrn.rules", "hatirlama", 1, "🚦 The traffic light is <b>red</b>. What must you do?", "Stop and wait.",
          [["Go quickly.", "bilgi", "Kırmızı ışıkta geçilmez; durulur."], ["Turn left.", "kavrama", "Kırmızı ışık yön göstermez, durmayı söyler."], ["Park your car.", "kavrama", "Kırmızı ışık park etmek anlamına gelmez."]],
          "Kırmızı ışık ne anlama gelir?", ["Trafik ışıklarında kırmızı = dur.", "Yeşil ışık yanana kadar beklenir.", "Cevap: Stop and wait."],
          { kural: "Red: Stop! · Yellow: Get ready. · Green: Go!" }),
        Q("entrn.rules", "uygulama", 1, "🚲⛑️ You are riding a bike. ___ a helmet.", "Wear",
          [["Don't wear", "kavrama", "Bisiklet sürerken kask takmamak güvenli değildir."], ["Wears", "islem", "Emir cümlesinde fiil yalın hâlde kullanılır."], ["Wearing", "islem", "Emir cümlesi fiilin yalın hâliyle başlar."]],
          "Güvenlik kuralı: emir cümlesi yalın fiille başlar.", ["Bisiklet sürerken kask takmalıyız.", "Emir cümlesi fiilin yalın hâliyle başlar: Wear.", "Wear a helmet."],
          { kural: "Emir: fiilin yalın hâli (Wear, Stop, Wait). Olumsuz emir: Don't + fiil." }),
        Q("entrn.rules", "aciklama", 2, "Which rule is <b>wrong</b> for passengers on a bus?", "Talk to the driver all the time.",
          [["Give your seat to old people.", "kavrama", "Bu doğru ve kibar bir davranıştır."], ["Don't eat or drink on the bus.", "kavrama", "Bu doğru bir kuraldır."], ["Hold on tight.", "kavrama", "Bu doğru bir güvenlik kuralıdır: sıkıca tutun."]],
          "Hangi davranış güvenliği tehlikeye atar?", ["Sürücü yola dikkat etmelidir.", "Sürücüyle sürekli konuşmak onun dikkatini dağıtır.", "Yanlış kural: Talk to the driver all the time."],
          { kural: "Toplu taşımada: Give your seat to old people. Hold on tight. Don't talk to the driver." }),
        Q("entrn.rules", "baglanti", 2, "🚇 The subway takes 15 minutes. 🚌 The bus takes 40 minutes. The subway is ___ the bus.", "faster than",
          [["slower than", "kavrama", "Metro daha kısa sürüyor; yani daha hızlı, daha yavaş değil."], ["fast than", "islem", "Karşılaştırmada sıfat -er alır: faster."], ["the fastest", "kavrama", "İki şey karşılaştırılırken “-er than” kullanılır; “the fastest” en üstünlüktür."]],
          "Hangisi daha az sürüyor? İki şeyi karşılaştırıyoruz.", ["Metro 15, otobüs 40 dakika sürüyor; metro daha hızlı.", "İki şeyi karşılaştırırken: sıfat + er + than.", "The subway is faster than the bus."],
          { kural: "fast → faster than · cheap → cheaper than · expensive → more expensive than." }),
        Q("entrn.rules", "uygulama", 2, "Look at the table. Which sentence is <b>true</b>?", "A taxi is more expensive than a minibus.",
          [["A minibus is more expensive than a taxi.", "dikkat", "Minibüs 20 TL, taksi 150 TL; minibüs daha ucuz."], ["A taxi is cheaper than a minibus.", "dikkat", "Taksi daha pahalıdır."], ["A minibus is expensiver than a taxi.", "islem", "“expensive” uzun bir sıfattır; “more expensive” denir. Ayrıca anlam da yanlış."]],
          "Fiyatları karşılaştır.", ["Taksi: 150 TL, minibüs: 20 TL.", "Taksi daha pahalıdır; “expensive” uzun sıfat olduğu için “more expensive than” denir.", "Doğru: A taxi is more expensive than a minibus."],
          { gorsel: G.tablo(["Vehicle", "Price", "Time"], [["🚕 taxi", "150 TL", "10 minutes"], ["🚐 minibus", "20 TL", "25 minutes"]]), kural: "Kısa sıfat: cheap → cheaper. Uzun sıfat: expensive → more expensive." }),
      ],
    },
  });

  /* ================= 4) COUNTRIES, NATIONALITIES AND LANGUAGES ================= */
  // [ülke, milliyet, dil, bayrak]
  const ULKE = [["Turkey", "Turkish", "Turkish", "🇹🇷"], ["Germany", "German", "German", "🇩🇪"], ["France", "French", "French", "🇫🇷"], ["Italy", "Italian", "Italian", "🇮🇹"],
    ["Spain", "Spanish", "Spanish", "🇪🇸"], ["Japan", "Japanese", "Japanese", "🇯🇵"], ["China", "Chinese", "Chinese", "🇨🇳"], ["Brazil", "Brazilian", "Portuguese", "🇧🇷"],
    ["Russia", "Russian", "Russian", "🇷🇺"], ["Greece", "Greek", "Greek", "🇬🇷"], ["Egypt", "Egyptian", "Arabic", "🇪🇬"], ["the USA", "American", "English", "🇺🇸"],
    ["Mexico", "Mexican", "Spanish", "🇲🇽"], ["England", "English", "English", "🇬🇧"], ["Azerbaijan", "Azerbaijani", "Azerbaijani", "🇦🇿"]];
  const ISIMLER = [["Kenji", "He"], ["Maria", "She"], ["Pierre", "He"], ["Anna", "She"], ["Lucas", "He"], ["Sofia", "She"], ["Hans", "He"], ["Li", "She"]];
  // [yalın, geçmiş, yanlış düzenli biçim, bağlam]
  const GECMIS = [["visit", "visited", null, "Last summer we ___ (visit) our friends in Italy."], ["travel", "travelled", null, "My parents ___ (travel) to Japan in 2023."],
    ["go", "went", "goed", "Two years ago, my family ___ (go) to Germany."], ["see", "saw", "seed", "We ___ (see) the Eiffel Tower in Paris last year."],
    ["eat", "ate", "eated", "In Mexico, I ___ (eat) tacos for lunch yesterday."], ["buy", "bought", "buyed", "My sister ___ (buy) a souvenir in Egypt last month."],
    ["take", "took", "taked", "Ali ___ (take) a lot of photos in Rome last week."], ["fly", "flew", "flyed", "We ___ (fly) to Spain last Saturday."],
    ["meet", "met", "meeted", "I ___ (meet) a Brazilian girl at the festival yesterday."], ["learn", "learnt", null, "Elif ___ (learn) some French words last year."],
    ["have", "had", "haved", "We ___ (have) a great time in Greece last summer."], ["watch", "watched", null, "We ___ (watch) a Chinese dance show last night."]];

  KONU_EKLE("en", {
    id: "en_countries", tema: "en6", ad: "Countries, Nationalities and Languages", tr: "Ülkeler, milliyetler ve diller",
    kazanimlar: [
      { id: "encou.nat", ad: "Ülke, milliyet ve dil adlarını eşleştirme (Japan – Japanese)" },
      { id: "encou.talk", ad: "Where are you from? / What language do you speak? sorularını sorup cevaplama" },
      { id: "encou.past", ad: "Seyahat ve deneyimleri simple past (düzenli / düzensiz fiiller) ve soru ekleriyle anlatma" },
    ],
    sozluk: [["country", "ülke"], ["nationality", "milliyet, uyruk"], ["language", "dil"], ["capital", "başkent"], ["flag", "bayrak"], ["culture", "kültür"], ["tourist", "turist"],
      ["travel", "seyahat etmek"], ["visit", "ziyaret etmek"], ["abroad", "yurt dışında"], ["world", "dünya"], ["souvenir", "hediyelik eşya"], ["passport", "pasaport"],
      ["Germany", "Almanya"], ["German", "Alman, Almanca"], ["France", "Fransa"], ["French", "Fransız, Fransızca"], ["Spain", "İspanya"], ["Spanish", "İspanyol, İspanyolca"],
      ["Japan", "Japonya"], ["Greece", "Yunanistan"], ["Egypt", "Mısır"], ["Arabic", "Arapça"], ["England", "İngiltere"], ["English", "İngiliz, İngilizce"]],
    anlatim: [
      { baslik: "Ülkeler, milliyetler ve diller",
        metin: "Ülke adı (<b>country</b>) ile o ülkenin insanını anlatan milliyet (<b>nationality</b>) ve konuşulan dil (<b>language</b>) farklı kelimelerdir. Hepsi <b>büyük harfle</b> başlar.<br>Milliyet ekleri: <b>-ish</b> (Turkish, Spanish, English), <b>-an / -ian</b> (German, Italian, Brazilian, Egyptian, Russian, American), <b>-ese</b> (Japanese, Chinese), farklılar: France → <b>French</b>, Greece → <b>Greek</b>.<br>Dikkat: Bir ülkenin dili milliyetiyle her zaman aynı değildir: Brazil → Brazilian → <b>Portuguese</b>; Egypt → Egyptian → <b>Arabic</b>; Mexico → Mexican → <b>Spanish</b>.",
        ornek: "<b>Kenji is from Japan. He is Japanese. He speaks Japanese.</b><br><b>Lucas is from Brazil. He is Brazilian. He speaks Portuguese.</b>",
        gorsel: G.tablo(["Country", "Nationality", "Language"], [["🇹🇷 Turkey", "Turkish", "Turkish"], ["🇩🇪 Germany", "German", "German"], ["🇫🇷 France", "French", "French"], ["🇯🇵 Japan", "Japanese", "Japanese"], ["🇧🇷 Brazil", "Brazilian", "Portuguese"], ["🇪🇬 Egypt", "Egyptian", "Arabic"]]),
        durak: { soru: "Pierre is from France. He is ___.", secenekler: [["French", true, "Fransa'dan gelen kişi Fransızdır: French."], ["France", false, "“France” ülke adıdır, milliyet değil."], ["Franch", false, "Yazım yanlıştır; doğrusu French."], ["Frenchish", false, "Böyle bir kelime yoktur."]] } },
      { baslik: "Nerelisin? Hangi dili konuşuyorsun?",
        metin: "Birinin nereli olduğunu sorarken: <b>Where are you from? — I'm from Turkey. I'm Turkish.</b><br>Üçüncü kişi için: <b>Where is she from? — She's from Spain.</b><br>Dil sorarken: <b>What language do you speak? — I speak Turkish and a little English.</b><br><b>What language do they speak in Brazil? — They speak Portuguese.</b><br>Milliyet sorusu: <b>What nationality is he? — He's Italian.</b>",
        ornek: "<b>— Hi! I'm Maria. I'm from Mexico.<br>— Nice to meet you, Maria. Do you speak English?<br>— Yes, I do. I speak Spanish and English.</b>",
        durak: { soru: "— Where is Hans from?<br>— ___", secenekler: [["He's from Germany.", true, "“Where … from?” sorusuna ülke adıyla cevap verilir."], ["He's German language.", false, "Soru yeri soruyor; ayrıca bu cümle dil bilgisi açısından yanlıştır."], ["He speaks German.", false, "Bu cevap dil sorusuna uygundur, “nereli” sorusuna değil."], ["Yes, he is.", false, "Where sorusu Yes/No ile cevaplanmaz."]] } },
      { baslik: "Seyahatleri anlatmak: simple past",
        metin: "Geçmişteki seyahatlerimizi anlatırken <b>simple past</b> kullanırız. <b>Düzenli fiiller</b> -ed alır: visit → visit<b>ed</b>, watch → watch<b>ed</b>, travel → travel<b>led</b>. <b>Düzensiz fiiller</b> ezberlenir: go → <b>went</b>, see → <b>saw</b>, eat → <b>ate</b>, buy → <b>bought</b>, take → <b>took</b>, fly → <b>flew</b>, meet → <b>met</b>, have → <b>had</b>.<br>Olumsuz ve soru: <b>We didn't go to Spain. Did you visit Rome? — Yes, I did.</b><br>Soru eki: <b>You visited Greece, didn't you?</b>",
        ornek: "<b>Last summer my family went to Italy. We visited Rome and ate pizza. I bought a souvenir for my best friend.</b>",
        gorsel: G.tablo(["Yalın", "Geçmiş", "Türü"], [["visit", "visited", "düzenli"], ["travel", "travelled", "düzenli"], ["go", "went", "düzensiz"], ["see", "saw", "düzensiz"], ["eat", "ate", "düzensiz"], ["buy", "bought", "düzensiz"]]),
        durak: { soru: "Choose the correct answer: Two years ago, we ___ to Egypt.", secenekler: [["went", true, "“go” düzensiz bir fiildir; geçmiş hâli “went” olur."], ["goed", false, "“go” düzensizdir; -ed almaz."], ["go", false, "“Two years ago” geçmişi gösterir; fiil geçmiş hâlde olmalı."], ["going", false, "-ing hâli tek başına geçmiş zamanı anlatmaz."]] } },
    ],
    uret: {
      "encou.nat": [
        () => {
          const [ulke, mil, , bayrak] = sec(ULKE), [isim, zamir] = sec(ISIMLER);
          const diger = karistir(ULKE.filter(u => u[1] !== mil)).slice(0, 2);
          return S({ kaz: "encou.nat", duzey: "uygulama", zorluk: 1, soru: `${bayrak} ${isim} is from ${ulke}. ${zamir} is ___.`, dogru: mil,
            yanlis: [[ulke.replace(/^the /, ""), "kavrama", "Bu ülke adıdır; boşluğa milliyet gelmelidir."], ...diger.map(u => [u[1], "bilgi", `“${u[1]}” ${u[0]} ülkesinin milliyetidir.`])],
            ipucu: "Ülke adı ile milliyet adı farklıdır. Boşluğa hangisi gelir?",
            cozum: [`${isim} ${ulke} ülkesinden.`, `${ulke} ülkesinden olan kişiye “${mil}” denir.`, `Cevap: ${zamir} is ${mil}.`],
            kural: "Ülke → milliyet: Turkey → Turkish, Japan → Japanese, Italy → Italian, France → French." });
        },
        () => {
          const [ulke, mil, dil, bayrak] = sec(ULKE);
          const yakin = { Brazilian: "Brazilian", Egyptian: "Egyptian", American: "American", Mexican: "Mexican" };
          const aday = karistir(["English", "Spanish", "Portuguese", "Arabic", "French", "German", "Russian", "Chinese", "Italian", "Greek"].filter(d => d !== dil));
          const yanlis = [];
          if (yakin[mil]) yanlis.push([mil, "kavrama", `“${mil}” milliyettir; ${ulke} ülkesinde konuşulan dil “${dil}” olur.`]);
          aday.slice(0, 3).forEach(d => yanlis.push([d, "bilgi", `${ulke} ülkesinde konuşulan resmî dil “${d}” değildir.`]));
          return S({ kaz: "encou.nat", duzey: yakin[mil] ? "aciklama" : "hatirlama", zorluk: yakin[mil] ? 2 : 1, soru: `${bayrak} What language do people speak in ${ulke}?`, dogru: dil, yanlis,
            ipucu: "Bazı ülkelerde konuşulan dil, milliyet adından farklıdır.",
            cozum: [`Soru ${ulke} ülkesinde konuşulan dili soruyor.`, `${ulke} → ${mil} (milliyet) → ${dil} (dil).`, `Cevap: They speak ${dil}.`],
            kural: "Brazil → Portuguese, Egypt → Arabic, Mexico → Spanish, the USA → English." });
        },
        kelime("encou.nat", [["country", "ülke"], ["nationality", "milliyet, uyruk"], ["language", "dil"], ["capital", "başkent"], ["flag", "bayrak"], ["culture", "kültür"], ["tourist", "turist"], ["abroad", "yurt dışında"], ["souvenir", "hediyelik eşya"], ["passport", "pasaport"], ["Greece", "Yunanistan"], ["Egypt", "Mısır"], ["Germany", "Almanya"], ["Spain", "İspanya"]]),
        Q("encou.nat", "aciklama", 1, "Which word is a <b>country</b>?", "Japan",
          [["Japanese", "kavrama", "“Japanese” milliyet ya da dil adıdır."], ["Spanish", "kavrama", "“Spanish” milliyet ya da dil adıdır; ülke Spain'dir."], ["Greek", "kavrama", "“Greek” milliyet ya da dil adıdır; ülke Greece'tir."]],
          "Ülke adları -ish, -ese, -an gibi eklerle bitmez çoğunlukla.", ["Seçeneklerden üçü milliyet / dil adıdır.", "Japan bir ülkedir; Japanese ise milliyeti ve dili anlatır.", "Cevap: Japan."],
          { kural: "Country: Japan · Nationality: Japanese · Language: Japanese." }),
        Q("encou.nat", "uygulama", 2, "Find the <b>wrong</b> match.", "Greece – Greekish",
          [["Italy – Italian", "kavrama", "Bu eşleştirme doğrudur."], ["China – Chinese", "kavrama", "Bu eşleştirme doğrudur."], ["Russia – Russian", "kavrama", "Bu eşleştirme doğrudur."]],
          "Her milliyet adını tek tek kontrol et.", ["Italy → Italian, China → Chinese, Russia → Russian doğrudur.", "Greece ülkesinin milliyeti “Greek” olur; “Greekish” diye bir kelime yoktur.", "Yanlış eşleştirme: Greece – Greekish."],
          { kural: "Düzensiz milliyetler: France → French, Greece → Greek, the Netherlands → Dutch." }),
      ],
      "encou.talk": [
        Q("encou.talk", "transfer", 1, "— ___<br>— I'm from Italy.", "Where are you from?",
          [["What language do you speak?", "kavrama", "Bu soru dil sorar; cevapta dil yok."], ["What's your name?", "kavrama", "Bu soru isim sorar."], ["How old are you?", "kavrama", "Bu soru yaş sorar."]],
          "Cevap bir ülke adı veriyor.", ["Cevap: I'm from Italy (İtalya'lıyım).", "Nereli olduğunu sormak için “Where are you from?” kullanılır.", "Soru: Where are you from?"],
          { kural: "Where are you from? — I'm from + ülke." }),
        Q("encou.talk", "transfer", 1, "— What language do you speak?<br>— ___", "I speak Spanish and English.",
          [["I'm from Spain.", "kavrama", "Bu cevap nereli olunduğunu söyler; dil sorusuna doğrudan cevap değildir."], ["I'm Spanish.", "kavrama", "Bu cevap milliyeti söyler, konuşulan dili değil."], ["Yes, I speak.", "bilgi", "“What” sorusu Yes/No ile cevaplanmaz."]],
          "Soru dil soruyor: I speak + dil.", ["“What language” = hangi dil.", "Cevapta “I speak …” ile dil söylenmeli.", "Uygun cevap: I speak Spanish and English."],
          { kural: "What language do you speak? — I speak Turkish / English …" }),
        Q("encou.talk", "uygulama", 2, "Choose the correct question: <b>___ is she from? — She's from Egypt.</b>", "Where",
          [["What", "kavrama", "“What is she from?” diye bir soru yoktur; yer için “Where” kullanılır."], ["Who", "bilgi", "“Who” kişi sorar."], ["When", "bilgi", "“When” zaman sorar."]],
          "Cevapta bir ülke (yer) var.", ["Cevap: She's from Egypt.", "Yer soran soru kelimesi “Where”dir.", "Where is she from?"],
          { kural: "Where is he / she from? — He's / She's from …" }),
        Q("encou.talk", "transfer", 2, "Read the text and answer the question.<br><i>Hello! My name is Lucas. I'm eleven. I'm from Brazil, but now I live in Ankara with my family. I speak Portuguese and a little Turkish. My best friend is Emre. He is Turkish.</i><br>What language does Lucas speak at home with his family?", "Portuguese",
          [["Brazilian", "kavrama", "“Brazilian” milliyettir; Brezilya'da konuşulan dil Portekizcedir."], ["Spanish", "dikkat", "Metinde İspanyolcadan söz edilmiyor."], ["English", "dikkat", "Metinde Lucas'ın İngilizce konuştuğu söylenmiyor."]],
          "Metinde “I speak …” cümlesini bul.", ["Lucas Brezilyalıdır ve “I speak Portuguese and a little Turkish” diyor.", "Ailesi de Brezilyalı olduğu için evde Portekizce konuşur; Türkçesi ise biraz.", "Cevap: Portuguese."],
          { kural: "Okuma sorularında cevabı metindeki bilgiye dayandır." }),
        Q("encou.talk", "baglanti", 2, "Look at the table. Which sentence is <b>true</b>?", "Yuki is Japanese and she speaks Japanese.",
          [["Carlos is from Spain.", "dikkat", "Tabloya göre Carlos Meksikalıdır (Mexico)."], ["Amira speaks French.", "dikkat", "Tabloya göre Amira Arapça konuşur."], ["Yuki is from China.", "dikkat", "Tabloya göre Yuki Japonya'dandır."]],
          "Her kişinin satırını kontrol et.", ["Yuki: Japan – Japanese – Japanese.", "Carlos: Mexico, Amira: Egypt – Arabic.", "Doğru cümle: Yuki is Japanese and she speaks Japanese."],
          { gorsel: G.tablo(["Name", "Country", "Language"], [["Yuki", "🇯🇵 Japan", "Japanese"], ["Carlos", "🇲🇽 Mexico", "Spanish"], ["Amira", "🇪🇬 Egypt", "Arabic"]]), kural: "Tablo okurken satır (kişi) ve sütun (bilgi türü) birlikte okunur." }),
      ],
      "encou.past": [
        () => {
          const [yalin, gecmis, yanlisD, cumle] = sec(GECMIS);
          const yanlis = [[yalin, "dikkat", "Cümlede geçmiş zaman ifadesi var; fiil geçmiş hâlde olmalı."], [yalin + "ing", "islem", "-ing hâli tek başına geçmiş zamanı anlatmaz."]];
          if (yanlisD) yanlis.push([yanlisD, "bilgi", `“${yalin}” düzensiz bir fiildir; geçmiş hâli “${gecmis}” olur, -ed almaz.`]);
          else yanlis.push([yalin + "s", "islem", "-s eki geniş zamanda üçüncü tekil kişi içindir."]);
          return S({ kaz: "encou.past", duzey: "uygulama", zorluk: yanlisD ? 2 : 1, soru: `Choose the correct answer:<br><b>${cumle}</b>`, dogru: gecmis, yanlis,
            ipucu: "Zaman ifadesini bul. Fiil düzenli mi, düzensiz mi?",
            cozum: ["Cümlede geçmiş zaman ifadesi var (last, ago, yesterday, in 2023).", yanlisD ? `“${yalin}” düzensiz bir fiildir; geçmiş hâli ezberlenir: ${gecmis}.` : `“${yalin}” düzenli bir fiildir: ${yalin} → ${gecmis}.`, `Cevap: ${gecmis}.`],
            kural: "Düzenli: -ed (visited). Düzensiz: ezberle (go → went, see → saw, eat → ate)." });
        },
        Q("encou.past", "uygulama", 1, "Make the sentence negative: <b>We visited Paris.</b>", "We didn't visit Paris.",
          [["We didn't visited Paris.", "islem", "“didn't”ten sonra fiil yalın hâle döner: visit."], ["We wasn't visit Paris.", "bilgi", "Simple past olumsuzu “didn't + yalın fiil” ile yapılır."], ["We don't visit Paris.", "dikkat", "“don't” geniş zamandır; cümle geçmişte."]],
          "didn't + fiilin yalın hâli", ["Olumsuz yapmak için “didn't” ekle.", "“didn't”ten sonra fiil yalın hâle döner: visited → visit.", "We didn't visit Paris."],
          { kural: "Olumsuz: didn't + yalın fiil. Soru: Did + özne + yalın fiil?" }),
        Q("encou.past", "transfer", 1, "— Did you go to Germany last year?<br>— Yes, ___.", "I did",
          [["I went", "bilgi", "Kısa cevapta “Yes, I did.” denir."], ["I do", "dikkat", "Soru geçmiş zamanda (Did); kısa cevap da “did” olmalı."], ["I was", "kavrama", "Soru “Did” ile sorulduğu için cevap “did” ile verilir."]],
          "Soru Did ile başlıyor.", ["“Did you …?” sorusunun kısa cevabı “did” ile verilir.", "Olumlu: Yes, I did. Olumsuz: No, I didn't.", "Cevap: I did."],
          { kural: "Did you …? — Yes, I did. / No, I didn't." }),
        Q("encou.past", "baglanti", 2, "Choose the correct question tag: <b>You travelled to Japan last summer, ___?</b>", "didn't you",
          [["did you", "kavrama", "Olumlu cümleye olumsuz soru eki gelir."], ["weren't you", "bilgi", "Cümlede “be” fiili yok; simple past fiillerde soru eki “didn't” olur."], ["don't you", "dikkat", "Cümle geçmiş zamanda; soru eki de geçmiş olmalı."]],
          "Olumlu, simple past bir cümle → olumsuz soru eki.", ["Cümle olumlu ve fiili “travelled” (simple past).", "Simple past cümlelerde soru eki “did / didn't” ile yapılır; olumlu cümleye “didn't”.", "You travelled to Japan last summer, didn't you?"],
          { kural: "Olumlu geçmiş cümle → didn't + zamir? Olumsuz geçmiş cümle → did + zamir?" }),
        Q("encou.past", "transfer", 2, "Read Elif's holiday postcard and answer the question.<br><i>Dear Zeynep, We are in Spain! Yesterday we visited a famous museum in Madrid. Then we ate paella in a small restaurant. It was delicious! I bought a fan for you. See you soon! Elif</i><br>What did Elif buy for Zeynep?", "a fan",
          [["paella", "dikkat", "Elif paella yedi; Zeynep için almadı."], ["a postcard", "dikkat", "Elif kartpostal gönderiyor ama hediye olarak bir yelpaze aldı."], ["a museum ticket", "dikkat", "Metinde müze bileti alındığı söylenmiyor."]],
          "“I bought … for you.” cümlesini bul.", ["Soru, Elif'in Zeynep için ne aldığını soruyor.", "Metin: “I bought a fan for you.”", "Cevap: a fan (bir yelpaze)."],
          { kural: "buy → bought: satın aldı." }),
      ],
    },
  });

  /* ============== 5) FOOD FROM AROUND THE WORLD AND BREAKFAST ============== */
  const KAHVALTI = [["🫒", "olives", "zeytin"], ["🍯", "honey", "bal"], ["🧀", "cheese", "peynir"], ["🥚", "eggs", "yumurta"], ["🍞", "bread", "ekmek"],
    ["🍅", "tomatoes", "domates"], ["🥒", "cucumbers", "salatalık"], ["🥛", "milk", "süt"], ["🍵", "tea", "çay"], ["🧈", "butter", "tereyağı"],
    ["🍓", "jam", "reçel"], ["🥯", "simit", "simit"], ["🍊", "orange juice", "portakal suyu"]];
  const YEMEK = [["pizza", "Italy"], ["sushi", "Japan"], ["tacos", "Mexico"], ["croissants", "France"], ["paella", "Spain"], ["baklava", "Turkey"], ["fish and chips", "England"], ["hamburgers", "the USA"]];

  KONU_EKLE("en", {
    id: "en_food", tema: "en6", ad: "Food from Around the World and Breakfast", tr: "Dünya mutfakları ve kahvaltı",
    kazanimlar: [
      { id: "enfod.breakfast", ad: "Kahvaltı yiyecek ve içeceklerini tanıma; yiyecekleri sıfatlarla (healthy, delicious…) anlatma" },
      { id: "enfod.offer", ad: "Would you like some …? / Can I have some …? ile yiyecek ikram etme, isteme; beğeni bildirme" },
      { id: "enfod.world", ad: "Farklı ülkelerin yemeklerini ve tarif kelimelerini (cuisine, ingredient, recipe) tanıma" },
    ],
    sozluk: [["breakfast", "kahvaltı"], ["olives", "zeytin"], ["honey", "bal"], ["cheese", "peynir"], ["eggs", "yumurta"], ["jam", "reçel"], ["butter", "tereyağı"],
      ["bread", "ekmek"], ["tomatoes", "domates"], ["cucumbers", "salatalık"], ["milk", "süt"], ["orange juice", "portakal suyu"], ["healthy", "sağlıklı"],
      ["nutritious", "besleyici"], ["delicious", "lezzetli"], ["yummy", "nefis, çok lezzetli"], ["favourite", "en sevilen"], ["cuisine", "mutfak (yemek kültürü)"],
      ["ingredient", "malzeme, içerik"], ["recipe", "yemek tarifi"], ["dish", "yemek, tabak"], ["spicy", "acılı, baharatlı"], ["sweet", "tatlı"], ["salty", "tuzlu"]],
    anlatim: [
      { baslik: "Kahvaltı",
        metin: "Türk kahvaltısında pek çok yiyecek vardır: <b>olives</b> (zeytin), <b>cheese</b> (peynir), <b>eggs</b> (yumurta), <b>honey</b> (bal), <b>jam</b> (reçel), <b>butter</b> (tereyağı), <b>bread</b> (ekmek), <b>tomatoes</b> (domates), <b>cucumbers</b> (salatalık), <b>simit</b>. İçecekler: <b>tea</b> (çay), <b>milk</b> (süt), <b>orange juice</b> (portakal suyu).<br>Yiyecekleri anlatırken şu sıfatları kullanırız: <b>healthy</b> (sağlıklı), <b>nutritious</b> (besleyici), <b>delicious / yummy</b> (lezzetli / nefis), <b>sweet</b> (tatlı), <b>salty</b> (tuzlu), <b>spicy</b> (acılı).",
        ornek: "<b>I have eggs, cheese, olives and bread for breakfast. Breakfast is very nutritious.</b><br><b>Honey is sweet and delicious.</b>",
        durak: { soru: "🍯 Which breakfast food is this?", secenekler: [["honey", true, "🍯 bal kavanozudur: honey."], ["jam", false, "Reçel (jam) genellikle meyveden yapılır; resim bal kavanozu."], ["butter", false, "Tereyağı (butter) 🧈 ile gösterilir."], ["cheese", false, "Peynir (cheese) 🧀 ile gösterilir."]] } },
      { baslik: "İkram etmek ve istemek",
        metin: "Birine yiyecek ikram ederken: <b>Would you like some cheese?</b> ya da <b>Do you want some tea?</b><br>Cevap verirken: <b>Yes, please.</b> (Evet, lütfen.) / <b>No, thanks.</b> (Hayır, teşekkürler.)<br>Bir şey isterken: <b>Can I have some honey, please?</b> — <b>Sure, here you are.</b> (Tabii, buyurun.)<br>Beğeni bildirirken: <b>It's my favourite.</b> (En sevdiğim.) / <b>I love it!</b> / <b>I don't like olives.</b> (Zeytin sevmem.)",
        ornek: "<b>— Would you like some eggs?<br>— Yes, please. I love eggs.<br>— Would you like some olives?<br>— No, thanks. I don't like olives.<br>— Can I have some jam, please? It's my favourite.<br>— Sure, here you are.</b>",
        durak: { soru: "— Would you like some orange juice?<br>— ___ I'm not thirsty.", secenekler: [["No, thanks.", true, "Susamadığı için kibarca reddediyor: No, thanks."], ["Yes, please.", false, "“Susamadım” diyen biri ikramı kabul etmez."], ["Here you are.", false, "“Here you are” bir şeyi verirken söylenir."], ["It's my favourite.", false, "Susamadığını söyleyen biri için bu cevap uymaz."]] } },
      { baslik: "Dünya mutfakları",
        metin: "Her ülkenin kendine özgü bir mutfağı (<b>cuisine</b>) vardır: İtalya'da <b>pizza</b>, Japonya'da <b>sushi</b>, Meksika'da <b>tacos</b>, Fransa'da <b>croissants</b>, İspanya'da <b>paella</b>, Türkiye'de <b>baklava</b> ve <b>kebab</b>, İngiltere'de <b>fish and chips</b>.<br>Bir yemeği yapmak için <b>recipe</b> (tarif) okuruz; tarifte <b>ingredients</b> (malzemeler) yazar. Tarifler genellikle emir cümleleriyle yazılır: <b>Cut the tomatoes. Mix the eggs. Add some salt.</b>",
        ornek: "<b>Sushi is a famous Japanese dish. Its main ingredients are rice and fish.</b><br><b>Last year, I ate tacos in Mexico. They were spicy but yummy!</b>",
        durak: { soru: "Pizza is a famous dish from ___.", secenekler: [["Italy", true, "Pizza İtalyan mutfağına aittir."], ["Japan", false, "Japonya'nın ünlü yemeği sushidir."], ["Mexico", false, "Meksika'nın ünlü yemeği tacostur."], ["France", false, "Fransa'nın ünlü yiyeceklerinden biri kruvasandır."]] } },
    ],
    uret: {
      "enfod.breakfast": [
        () => {
          const [e, en, tr] = sec(KAHVALTI), diger = karistir(KAHVALTI.filter(k => k[1] !== en)).slice(0, 3);
          if (Math.random() < 0.5)
            return S({ kaz: "enfod.breakfast", duzey: "hatirlama", zorluk: 1, soru: `${e} What is this?`, dogru: en,
              yanlis: diger.map(k => [k[1], "bilgi", `“${k[1]}” = ${k[2]} (${k[0]}).`]),
              ipucu: "Resimdeki kahvaltılığın İngilizcesini hatırla.", cozum: [`Resimde ${e} var.`, `Bu, Türkçede “${tr}” demektir.`, `İngilizcesi: ${en}.`],
              kural: "Kahvaltılıklar: olives, cheese, eggs, honey, jam, butter, bread, tomatoes, cucumbers, simit, tea, milk." });
          return S({ kaz: "enfod.breakfast", duzey: "hatirlama", zorluk: 1, soru: `What is <b>“${tr}”</b> in English?`, dogru: en,
            yanlis: diger.map(k => [k[1], "bilgi", `“${k[1]}” = ${k[2]}.`]),
            ipucu: "Kahvaltı sofrasını düşün.", cozum: [`Aranan kelime: “${tr}”.`, `İngilizcesi “${en}” olur.`, "Diğer seçenekler başka kahvaltılıklardır."],
            kural: "Yeni kelimeleri resimleriyle birlikte tekrar et." });
        },
        Q("enfod.breakfast", "aciklama", 1, "Eggs, cheese and milk give us energy and help us grow. They are ___.", "nutritious",
          [["spicy", "kavrama", "“spicy” acılı demektir; yumurta, peynir ve süt acılı değildir."], ["salty", "kavrama", "Cümle tadı değil, besin değerini anlatıyor."], ["boring", "bilgi", "“boring” sıkıcı demektir; yiyecek için uygun değildir."]],
          "Enerji veren ve büyümemize yardım eden yiyecekler…", ["Cümle bu yiyeceklerin bize enerji verdiğini söylüyor.", "Besin değeri yüksek = besleyici = nutritious.", "They are nutritious."],
          { kural: "nutritious: besleyici · healthy: sağlıklı · delicious / yummy: lezzetli." }),
        Q("enfod.breakfast", "uygulama", 1, "🍋 Lemons are sour. 🍯 Honey is ___. 🧂 Crisps are salty.", "sweet",
          [["sour", "kavrama", "Ekşi (sour) olan limondur; bal tatlıdır."], ["salty", "kavrama", "Tuzlu (salty) olan cipstir; bal tatlıdır."], ["spicy", "bilgi", "Bal acılı (spicy) değildir."]],
          "Balın tadı nasıldır?", ["Her yiyeceğin bir tadı var.", "Bal şekerli bir yiyecektir; tadı tatlıdır.", "Honey is sweet."],
          { kural: "sweet: tatlı · salty: tuzlu · sour: ekşi · spicy: acılı." }),
        Q("enfod.breakfast", "transfer", 2, "Read the text and answer the question.<br><i>On Sundays, my family has a big breakfast. My mother makes eggs with tomatoes. My father likes cheese and olives. My little brother loves honey and butter, but I don't like honey. My favourite is simit with tea.</i><br>What is the writer's favourite breakfast food?", "simit",
          [["honey", "dikkat", "Yazar “I don't like honey” diyor."], ["cheese", "dikkat", "Peyniri seven babasıdır."], ["eggs", "dikkat", "Domatesli yumurtayı annesi yapıyor; yazarın favorisi değil."]],
          "“My favourite is …” cümlesini bul.", ["Soru yazarın en sevdiği kahvaltılığı soruyor.", "Metin: “My favourite is simit with tea.”", "Cevap: simit."],
          { kural: "favourite: en sevilen. My favourite food is … = En sevdiğim yiyecek …" }),
        Q("enfod.breakfast", "transfer", 2, "Look at the café menu. How much is a <b>cheese toast</b> and an <b>orange juice</b>?", "110 TL",
          [["70 TL", "islem", "Bu yalnızca tostun fiyatıdır; portakal suyu eklenmemiş."], ["40 TL", "islem", "Bu yalnızca portakal suyunun fiyatıdır."], ["90 TL", "dikkat", "Fiyatlar yanlış satırlardan okunmuş; tost 70, portakal suyu 40 TL."]],
          "İki fiyatı bul ve topla.", ["Cheese toast: 70 TL.", "Orange juice: 40 TL.", "70 + 40 = 110 TL."],
          { gorsel: G.tablo(["🍽️ Menu", "Price"], [["🥚 Menemen", "90 TL"], ["🧀 Cheese toast", "70 TL"], ["🥯 Simit", "15 TL"], ["🍵 Tea", "10 TL"], ["🍊 Orange juice", "40 TL"]]), kural: "How much is …? fiyat sorar. Menüden fiyatları dikkatle oku." }),
      ],
      "enfod.offer": [
        () => {
          const [e, en] = sec(KAHVALTI.filter(k => !["eggs", "tomatoes", "cucumbers", "olives"].includes(k[1]))), olumlu = Math.random() < 0.5;
          const dogru = olumlu ? "Yes, please. It's my favourite." : "No, thanks. I don't like it.";
          return S({ kaz: "enfod.offer", duzey: "transfer", zorluk: 1, soru: `${e} — Would you like some ${en}?<br>— ___ ${olumlu ? "😋" : "😖"}`, dogru,
            yanlis: [[olumlu ? "No, thanks. I don't like it." : "Yes, please. It's my favourite.", "dikkat", olumlu ? "Yüz ifadesi (😋) yiyeceği sevdiğini gösteriyor." : "Yüz ifadesi (😖) yiyeceği sevmediğini gösteriyor."],
              ["Yes, I would like.", "bilgi", "Kısa cevapta “Yes, please.” denir; “I would like” tek başına eksik kalır."], ["Here you are.", "kavrama", "“Here you are” bir şeyi verirken söylenir, ikrama cevap değildir."]],
            ipucu: "Yüz ifadesine bak: kabul mü ediyor, reddediyor mu?",
            cozum: ["“Would you like some …?” bir ikram sorusudur.", olumlu ? "😋 yiyeceği sevdiğini gösterir; kabul ederken “Yes, please.” denir." : "😖 yiyeceği sevmediğini gösterir; reddederken “No, thanks.” denir.", `Cevap: ${dogru}`],
            kural: "Would you like some …? — Yes, please. / No, thanks." });
        },
        Q("enfod.offer", "uygulama", 1, "— Can I have some bread, please?<br>— Sure, ___", "here you are.",
          [["no, thanks.", "kavrama", "“No, thanks” ikramı reddederken söylenir; burada bir şey veriliyor."], ["yes, please.", "kavrama", "“Yes, please” ikramı kabul ederken söylenir."], ["I don't like it.", "kavrama", "İsteğe cevap veren kişi ekmeği uzatıyor; beğenisini söylemiyor."]],
          "Bir şeyi birine uzatırken ne deriz?", ["Karşıdaki kişi ekmek istiyor.", "Ekmeği uzatırken “Here you are.” (Buyurun.) deriz.", "Sure, here you are."],
          { kural: "Can I have some …, please? — Sure, here you are." }),
        Q("enfod.offer", "uygulama", 2, "Choose the correct sentence.", "Can I have some cheese, please?",
          [["Can I have any cheese, please?", "islem", "Kibar isteklerde ve ikramlarda “some” kullanılır."], ["Can I has some cheese, please?", "islem", "Can'den sonra fiil yalın hâlde kullanılır: have."], ["Can I having some cheese, please?", "islem", "Can'den sonra -ing kullanılmaz."]],
          "Can + yalın fiil + some", ["Can'den sonra fiil yalın hâldedir: have.", "İsterken ve ikram ederken “some” kullanılır.", "Can I have some cheese, please?"],
          { kural: "İstek: Can I have some …, please? İkram: Would you like some …?" }),
        Q("enfod.offer", "transfer", 2, "Which is the correct order of the dialogue?<br>(1) Yes, please. I love it.<br>(2) Here you are.<br>(3) Would you like some honey?<br>(4) Thank you!", "3 – 1 – 2 – 4",
          [["1 – 3 – 2 – 4", "strateji", "Önce ikram sorusu gelmeli; cevap sorudan önce olamaz."], ["3 – 2 – 1 – 4", "strateji", "Kişi kabul etmeden bal verilmez; önce “Yes, please.” gelir."], ["2 – 3 – 1 – 4", "strateji", "Diyalog ikram sorusuyla başlar."]],
          "Diyalog neyle başlar? İkram, kabul, verme, teşekkür.", ["İlk önce ikram sorusu: (3) Would you like some honey?", "Sonra kabul: (1), ardından verme: (2).", "En sonda teşekkür: (4). Sıra: 3 – 1 – 2 – 4."],
          { kural: "İkram diyaloğu: Would you like …? → Yes, please. → Here you are. → Thank you!" }),
        Q("enfod.offer", "transfer", 1, "— Would you like some olives?<br>— No, thanks. ___", "I don't like olives.",
          [["It's my favourite.", "kavrama", "En sevdiği yiyeceği reddetmesi mantıklı değildir."], ["I love olives.", "kavrama", "Zeytini seven biri genellikle “No, thanks” demez."], ["Yes, I like olives.", "dikkat", "Cevap “No, thanks” ile başladı; ardından “Yes” gelmez."]],
          "Reddettikten sonra nedenini söylüyor.", ["“No, thanks” ikramı reddeder.", "Uygun bir neden: Zeytin sevmiyorum.", "No, thanks. I don't like olives."],
          { kural: "Beğenmemek: I don't like … · Beğenmek: I like / love … · It's my favourite." }),
      ],
      "enfod.world": [
        () => {
          const [yemek, ulke] = sec(YEMEK), diger = karistir(YEMEK.filter(y => y[1] !== ulke)).slice(0, 3);
          return S({ kaz: "enfod.world", duzey: "hatirlama", zorluk: 1, soru: `Which country is famous for <b>${yemek}</b>?`, dogru: ulke,
            yanlis: diger.map(y => [y[1], "bilgi", `${y[1]} ülkesinin ünlü yemeği ${y[0]}.`]),
            ipucu: "Bu yemeği hangi ülkenin mutfağıyla duyuyoruz?", cozum: [`Yemek: ${yemek}.`, `Bu yemek ${ulke} mutfağına aittir.`, `Cevap: ${ulke}.`],
            kural: "pizza – Italy, sushi – Japan, tacos – Mexico, paella – Spain, croissants – France, baklava – Turkey." });
        },
        kelime("enfod.world", [["cuisine", "mutfak (yemek kültürü)"], ["ingredient", "malzeme, içerik"], ["recipe", "yemek tarifi"], ["dish", "yemek, tabak"], ["spicy", "acılı, baharatlı"], ["delicious", "lezzetli"], ["nutritious", "besleyici"], ["healthy", "sağlıklı"], ["sweet", "tatlı"], ["salty", "tuzlu"], ["yummy", "nefis, çok lezzetli"], ["favourite", "en sevilen"]]),
        Q("enfod.world", "aciklama", 2, "Look at the recipe. Which one is <b>not</b> an ingredient for menemen?", "cheese",
          [["eggs", "dikkat", "Yumurta tarifte malzeme olarak yazıyor."], ["tomatoes", "dikkat", "Domates tarifte malzeme olarak yazıyor."], ["green peppers", "dikkat", "Yeşil biber tarifte malzeme olarak yazıyor."]],
          "Malzeme listesini kontrol et.", ["Tarifteki malzemeler: eggs, tomatoes, green peppers, butter, salt.", "Peynir (cheese) listede yok.", "Cevap: cheese."],
          { gorsel: G.tablo(["🍳 Menemen recipe", "Ingredients"], [["Step 1: Cut the peppers and tomatoes.", "3 eggs"], ["Step 2: Cook them in butter.", "2 tomatoes"], ["Step 3: Add the eggs and some salt.", "2 green peppers"], ["Step 4: Mix and serve.", "butter, salt"]]), kural: "recipe: tarif · ingredients: malzemeler. Tarif adımları emir cümleleriyle yazılır." }),
        Q("enfod.world", "uygulama", 2, "Put the recipe steps in order: (A) Eat your sandwich. (B) Put cheese on the bread. (C) Cut the bread. (D) Add some tomatoes.<br>Which is the correct order?", "C – B – D – A",
          [["A – B – C – D", "strateji", "Sandviç yapılmadan yenemez; yeme en son adımdır."], ["B – C – D – A", "strateji", "Ekmek kesilmeden üzerine peynir konamaz."], ["C – D – A – B", "strateji", "Sandviç yendikten sonra peynir konmaz."]],
          "Önce ekmeği hazırla, en son ye.", ["İlk adım: Cut the bread (C).", "Sonra peynir (B) ve domates (D) eklenir.", "En son yenir (A): C – B – D – A."],
          { kural: "Tarif sıralamada first, then, next, finally gibi kelimelere ve mantığa dikkat et." }),
        Q("enfod.world", "baglanti", 2, "Read the text and answer the question.<br><i>Last month, Kaan went to Japan with his family. They visited Tokyo. Kaan ate sushi for the first time. Its ingredients were rice, fish and seaweed. He thought it was delicious.</i><br>Which sentence is <b>true</b>?", "Kaan liked sushi.",
          [["Kaan ate sushi every day in Turkey.", "dikkat", "Kaan suşiyi ilk kez Japonya'da yedi."], ["Sushi has cheese in it.", "dikkat", "Metne göre malzemeler pirinç, balık ve deniz yosunu."], ["Kaan went to Japan alone.", "dikkat", "Kaan ailesiyle gitti (with his family)."]],
          "Kaan suşi hakkında ne düşündü?", ["Metin: “He thought it was delicious.” (Lezzetli olduğunu düşündü.)", "Lezzetli bulduysa sevmiştir.", "Doğru cümle: Kaan liked sushi."],
          { kural: "Simple past: go → went, eat → ate, think → thought." }),
      ],
    },
  });
})();
