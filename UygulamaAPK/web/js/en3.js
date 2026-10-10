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
})();
