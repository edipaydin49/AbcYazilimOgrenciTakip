/* 6. sınıf Türkçe — 3. tema: Farklı Dünyalar.
 * Ova Çocuk · Mısır - İspanya - Norveç · Çocuklar Neredeyse Okulları Orada (Dinleme/İzleme) ·
 * Ay Avcısı Eskimolar · Gelin “Türk Dünyasını” Keşfedelim · Üretmek Gibisi Yok!
 * Ders kitabının metinleri kullanılmaz; okuma parçaları bu dosya için yazılmış özgün kısa metinlerdir.
 */
(function () {
  "use strict";
  const { Q, G } = OGR;

  /* ------------------------------------------------------------------ */
  /* Ortak kısa metinler                                                 */
  /* ------------------------------------------------------------------ */
  const OVA1 = "<i>Güneş ovanın üstünde yükselirken Elif, dedesiyle birlikte buğday tarlasına gitti. Dedesi sararmış başakları eliyle okşadı ve “Bu yıl bereketli olacak.” dedi. Öğleye doğru komşular da geldi; hep birlikte ekin biçtiler. Akşam olunca yorgun ama mutlu bir şekilde köye döndüler.</i>";
  const OVA2 = "<i>Can, şehirden yaz tatili için köydeki babaannesinin yanına gelmişti. İlk günler inekleri sağmayı, tavuklara yem vermeyi hiç bilmiyordu. Babaannesi ona sabırla her işi gösterdi. Tatilin sonunda Can, kümesten yumurtaları kimseye sormadan toplayabiliyordu. Şehre dönerken “Köyde her işin bir emeği varmış.” dedi.</i>";
  const OVA3 = "<i>Ovada o yıl yağmur az yağmıştı. Köylüler kuyulardan su taşıyarak fidanlarını sulamaya çalıştı. Küçük Mert de her sabah okula gitmeden önce iki kova su taşıdı. Sonbaharda fidanlar meyve verince köylüler, Mert'in emeğini unutmadı ve ilk elmaları ona ikram etti.</i>";

  KONU_EKLE("tr", {
    id: "tr_ova", tema: "tr3", ad: "Ova Çocuk", sayfa: "s. 118", gorev: "Okuduğunu anlama",
    kazanimlar: [
      { id: "trova.unsur", ad: "Hikâyenin unsurlarını (olay, kişi, yer, zaman) belirleme" },
      { id: "trova.anafikir", ad: "Metnin konusunu ve ana fikrini belirleme" },
      { id: "trova.karakter", ad: "Kişilerin özelliklerini ve duygularını metinden çıkarma" },
    ],
    anlatim: [
      {
        baslik: "Hikâyenin dört unsuru",
        metin: "Her hikâye dört temel unsurdan oluşur:<br><b>Olay:</b> Hikâyede yaşanan durum (Ne oldu?).<br><b>Kişiler (karakterler):</b> Olayı yaşayan insanlar ya da kişileştirilmiş varlıklar (Kim?).<br><b>Yer (mekân):</b> Olayın geçtiği yer (Nerede?).<br><b>Zaman:</b> Olayın geçtiği zaman (Ne zaman?).<br>Bu unsurları bulmak için 5N1K sorularını sorarız.",
        ornek: "“Bir bahar sabahı Ayşe, ovadaki bahçede kuzusunu aradı.” Kişi: Ayşe · Yer: ovadaki bahçe · Zaman: bir bahar sabahı · Olay: kuzuyu aramak.",
        durak: { soru: "“Kış akşamı köy odasında dedem bize masal anlattı.” cümlesinde olayın geçtiği yer neresidir?", secenekler: [["Köy odası", true, "“Nerede?” sorusunun cevabı köy odasıdır."], ["Kış akşamı", false, "Bu, olayın zamanıdır; “Ne zaman?” sorusunun cevabıdır."], ["Dedem", false, "Dede, olaydaki kişidir; yer değildir."], ["Masal anlatmak", false, "Bu, olayın kendisidir."]] },
      },
      {
        baslik: "Konu ve ana fikir",
        metin: "<b>Konu:</b> Metinde ne anlatıldığıdır; kısa bir söz grubuyla söylenir (ör. “köyde hasat zamanı”).<br><b>Ana fikir:</b> Yazarın metinle okura vermek istediği temel mesajdır; genellikle bir yargı cümlesiyle söylenir (ör. “Birlikte çalışmak işi kolaylaştırır.”).<br><b>Yardımcı fikirler:</b> Ana fikri destekleyen, açıklayan küçük düşüncelerdir.<br>İpucu: Ana fikir çoğu zaman metnin sonunda, bir kişinin söylediği sözde ya da olayın sonucunda saklıdır.",
        ornek: "Konu: Köylülerin birlikte ekin biçmesi. Ana fikir: Dayanışma, zor işleri kolaylaştırır.",
        durak: { soru: "Aşağıdakilerden hangisi bir “ana fikir” cümlesidir?", secenekler: [["Emek vermeden başarı elde edilmez.", true, "Bu, okura verilen bir mesajdır; yargı bildirir."], ["Köyde hasat zamanı", false, "Bu bir söz grubudur; metnin konusunu söyler."], ["Elif ve dedesi", false, "Bunlar hikâyenin kişileridir."], ["Buğday tarlası", false, "Bu, olayın geçtiği yerdir."]] },
      },
      {
        baslik: "Kişilerin özellikleri ve duyguları",
        metin: "Yazar, kişilerin özelliklerini her zaman açıkça söylemez. Kişinin <b>davranışlarına</b>, <b>konuşmalarına</b> ve <b>başkalarına nasıl davrandığına</b> bakarak çıkarım yaparız.<br>• Fiziksel özellik: uzun boylu, esmer, yaşlı…<br>• Karakter özelliği: çalışkan, sabırlı, yardımsever, meraklı…<br>• Duygu: sevinç, hüzün, korku, özlem, gurur…<br>Kırsal yaşamı anlatan hikâyelerde kişiler çoğu zaman doğayla iç içe, emeğe saygılı ve dayanışma içinde gösterilir.",
        ornek: "“Mert, her sabah okula gitmeden önce fidanlara su taşıdı.” → Mert çalışkan ve sorumluluk sahibidir.",
        durak: { soru: "“Babaannesi, Can'a her işi sabırla gösterdi.” cümlesine göre babaanne nasıl biridir?", secenekler: [["Sabırlı ve öğretmeyi seven biri", true, "Her işi sabırla göstermesi bu özellikleri anlatır."], ["Aceleci biri", false, "Sabırla davranan biri aceleci değildir."], ["Bencil biri", false, "Torununa yardım etmesi bencilliği göstermez."], ["Korkak biri", false, "Cümlede korkuyla ilgili bir ipucu yoktur."]] },
      },
    ],
    uret: {
      "trova.unsur": [
        Q("trova.unsur", "hatirlama", 1, OVA1 + "<br><br>Bu metindeki olay nerede geçmektedir?", "Buğday tarlasında",
          [["Şehirde", "dikkat", "Metinde şehirden söz edilmiyor; olay ovadaki tarlada geçiyor."], ["Okulda", "dikkat", "Okul metinde geçmiyor; metni yeniden oku."], ["Evin bahçesinde", "dikkat", "Elif ve dedesi bahçeye değil, buğday tarlasına gidiyor."]],
          "“Nerede?” sorusunu metne sor.",
          ["Soruda olayın geçtiği yer, yani mekân isteniyor.", "Metinde “dedesiyle birlikte buğday tarlasına gitti” deniyor.", "Olay, ovadaki buğday tarlasında geçer."],
          { kural: "Yer (mekân), “Nerede?” sorusunun cevabıdır." }),
        Q("trova.unsur", "aciklama", 1, OVA1 + "<br><br>Bu metnin kişileri aşağıdakilerden hangisinde doğru verilmiştir?", "Elif, dedesi ve komşular",
          [["Yalnızca Elif", "dikkat", "Elif'in yanında dedesi ve sonradan gelen komşular da var."], ["Elif ve babası", "dikkat", "Metinde baba değil, dede geçiyor."], ["Dedesi ve öğretmeni", "dikkat", "Metinde öğretmen yok; olayı Elif de yaşıyor."]],
          "Olayı yaşayan herkesi düşün; sonradan gelenleri de unutma.",
          ["Soruda olayı yaşayan kişiler isteniyor.", "Metinde Elif ve dedesi tarlaya gidiyor, öğleye doğru komşular da geliyor.", "Kişiler: Elif, dedesi ve komşular."],
          { kural: "Kişiler, “Kim?” sorusunun cevabıdır; olaya sonradan katılanlar da kişidir." }),
        Q("trova.unsur", "uygulama", 2, OVA1 + "<br><br>Bu metindeki olayların zamanı için aşağıdakilerden hangisi söylenebilir?", "Sabahtan akşama kadar bir gün içinde geçer.",
          [["Bir kış gecesi geçer.", "dikkat", "Güneşin yükselmesi ve hasat, kış gecesiyle uyuşmaz."], ["Birkaç yıl içinde geçer.", "kavrama", "“Güneş yükselirken”, “öğleye doğru” ve “akşam olunca” ifadeleri tek bir günü anlatır."], ["Zamanla ilgili hiçbir ipucu yoktur.", "dikkat", "Metinde birçok zaman ifadesi var: güneş yükselirken, öğleye doğru, akşam olunca."]],
          "Metindeki zaman ifadelerinin altını çiz.",
          ["Soruda olayın zamanı isteniyor.", "“Güneş yükselirken”, “öğleye doğru”, “akşam olunca” ifadeleri sabahtan akşama uzanan bir günü gösterir.", "Olaylar bir gün içinde, sabahtan akşama kadar geçer."],
          { kural: "Zaman ifadeleri (sabah, öğleye doğru, akşam olunca…) olayın ne zaman geçtiğini gösterir." }),
        Q("trova.unsur", "transfer", 2, "Bir arkadaşın yazdığı hikâyenin ilk cümlesi şöyle: <i>“Ali çok sevindi.”</i> Bu cümleyi hikâyenin dört unsuruna göre tamamlamak isterse hangi cümle en uygundur?", "Bir yaz sabahı köydeki bahçede Ali, ilk kez kendi diktiği domatesi kopardı ve çok sevindi.",
          [["Ali çok çok sevindi.", "strateji", "Bu cümleye yer, zaman ve olay eklenmemiş; yalnızca duygu tekrar edilmiş."], ["Köy çok güzeldi.", "kavrama", "Bu cümlede yer var ama kişi, zaman ve olay yok."], ["Bir yaz sabahıydı.", "kavrama", "Bu cümlede yalnızca zaman var; kişi, yer ve olay eksik."]],
          "Kişi, yer, zaman ve olayın hepsini içeren seçeneği bul.",
          ["Soruda dört unsuru da içeren cümle isteniyor.", "Seçenekleri kim, nerede, ne zaman, ne oldu sorularıyla tek tek kontrol et.", "Yalnızca domatesli cümlede kişi (Ali), yer (bahçe), zaman (yaz sabahı) ve olay (domatesi koparmak) birlikte var."],
          { kural: "İyi bir hikâye girişi kişiyi, yeri ve zamanı tanıtır; ardından olay başlar." }),
        Q("trova.unsur", "baglanti", 2, "1. temada sözcük anlamlarını öğrenmiştik. <i>“Ova”</i> sözcüğünün anlamı aşağıdakilerden hangisidir?", "Düz ve geniş arazi",
          [["Yüksek ve sarp dağ", "bilgi", "Sarp dağ ovanın tam tersidir; ova düz bir yerdir."], ["Denizle çevrili kara parçası", "bilgi", "Bu, adanın tanımıdır."], ["Akarsuyun denize döküldüğü yer", "bilgi", "Bu, akarsu ağzıdır; ova düz ve geniş arazidir."]],
          "Ovada tarlalar neden kolay sürülür?",
          ["Soruda “ova” sözcüğünün anlamı isteniyor.", "Ovalar düz olduğu için tarım yapmaya çok elverişlidir.", "Ova, düz ve geniş arazi demektir."],
          { kural: "Bilmediğin sözcüğün anlamını cümlenin gelişinden tahmin et, sonra sözlükten doğrula." }),
      ],
      "trova.anafikir": [
        Q("trova.anafikir", "aciklama", 1, OVA1 + "<br><br>Bu metnin konusu aşağıdakilerden hangisidir?", "Köyde birlikte ekin biçilmesi",
          [["Elif'in okula başlaması", "dikkat", "Metinde okuldan söz edilmiyor."], ["Dedenin hastalanması", "dikkat", "Dede hasta değil; tarlada çalışıyor."], ["Şehirde bir gün", "dikkat", "Olay şehirde değil, ovadaki köyde geçiyor."]],
          "“Bu metin neyi anlatıyor?” diye sor.",
          ["Soruda metnin konusu isteniyor.", "Metinde Elif, dedesi ve komşular tarlada birlikte ekin biçiyor.", "Konu: Köyde birlikte ekin biçilmesi."],
          { kural: "Konu, metinde ne anlatıldığıdır; kısa bir söz grubuyla söylenir." }),
        Q("trova.anafikir", "uygulama", 2, OVA2 + "<br><br>Bu metnin ana fikri aşağıdakilerden hangisidir?", "Köydeki her işin bir emeği vardır ve emeğe saygı duyulmalıdır.",
          [["Şehir hayatı köy hayatından daha kolaydır.", "kavrama", "Metin, şehir ile köyü karşılaştırmıyor; emeğin değerini anlatıyor."], ["Can tatile köye gitmiştir.", "kavrama", "Bu, metindeki bir olaydır; ana fikir değildir."], ["Tavuklar her gün yumurtlar.", "kavrama", "Bu bir bilgi cümlesidir; metnin mesajı değildir."]],
          "Can'ın metnin sonunda söylediği söze dikkat et.",
          ["Soruda yazarın vermek istediği mesaj isteniyor.", "Can, öğrendiklerinden sonra “Köyde her işin bir emeği varmış.” diyor.", "Ana fikir: Her işin bir emeği vardır ve emeğe saygı duyulmalıdır."],
          { kural: "Ana fikir çoğu zaman metnin sonunda ya da bir kişinin söylediği sözde gizlidir." }),
        Q("trova.anafikir", "uygulama", 2, OVA3 + "<br><br>Bu metne en uygun başlık hangisidir?", "Mert'in Kovaları",
          [["Şehirde Bir Gün", "dikkat", "Olay şehirde değil, ovadaki köyde geçiyor."], ["Kış Tatili", "dikkat", "Metinde kış tatili geçmiyor; olay yaz ve sonbaharda geçiyor."], ["Okul Gezisi", "kavrama", "Okul yalnızca bir ayrıntı; metin Mert'in fidanlara su taşımasını anlatıyor."]],
          "Başlık, metnin konusunu ya da ana fikrini yansıtmalı.",
          ["Soruda metnin tamamını kapsayan başlık isteniyor.", "Metin, kuraklıkta Mert'in fidanlara su taşımasını ve emeğinin karşılığını anlatıyor.", "“Mert'in Kovaları” bu konuyu en iyi yansıtan başlıktır."],
          { kural: "Başlık; kısa, ilgi çekici ve metnin konusuna ya da ana fikrine uygun olmalıdır." }),
        Q("trova.anafikir", "aciklama", 2, OVA3 + "<br><br>Aşağıdakilerden hangisi bu metnin yardımcı fikirlerinden biridir?", "Kuraklıkta köylüler fidanları kuyudan su taşıyarak suladı.",
          [["Emek veren, karşılığını alır.", "kavrama", "Bu, metnin ana fikridir; yardımcı fikir değildir."], ["Elmalar en çok kışın yetişir.", "dikkat", "Metinde elmalar sonbaharda meyve veriyor; bu bilgi metinde yok."], ["Mert okula gitmeyi sevmezdi.", "dikkat", "Metinde böyle bir bilgi yok."]],
          "Yardımcı fikir, metinde geçen ve ana fikri destekleyen bir ayrıntıdır.",
          ["Soruda ana fikri destekleyen ayrıntı isteniyor.", "Metinde kuraklık ve köylülerin su taşıması anlatılıyor; bu, emeğin önemini destekler.", "Yardımcı fikir: Kuraklıkta köylüler fidanları kuyudan su taşıyarak suladı."],
          { kural: "Ana fikir metnin temel mesajıdır; yardımcı fikirler onu destekleyen ayrıntılardır." }),
        Q("trova.anafikir", "transfer", 2, "Sınıfınızda herkes evden bir fide getirip okul bahçesine dikti. Öğretmeniniz “Bu çalışmamızın ana fikri ne olabilir?” diye sordu. En uygun cevap hangisidir?", "Birlikte çalışırsak çevremizi güzelleştirebiliriz.",
          [["Okul bahçesi büyüktür.", "kavrama", "Bu bir bilgi cümlesidir; çalışmanın mesajını vermez."], ["Fideler evden getirildi.", "kavrama", "Bu, olayın bir ayrıntısıdır; ana fikir değildir."], ["Ağaç dikmek", "kavrama", "Bu bir söz grubu; konuyu söyler, mesajı söylemez."]],
          "Ana fikir bir mesaj, bir ders içerir.",
          ["Soruda çalışmadan çıkarılacak mesaj isteniyor.", "Herkesin katkısıyla bahçe yeşillendi; bu, dayanışmanın gücünü gösterir.", "Ana fikir: Birlikte çalışırsak çevremizi güzelleştirebiliriz."],
          { kural: "Konu “ne anlatıldığı”, ana fikir “ne öğretildiği”dir." }),
      ],
      "trova.karakter": [
        Q("trova.karakter", "aciklama", 1, OVA3 + "<br><br>Mert'in en belirgin özelliği aşağıdakilerden hangisidir?", "Çalışkan ve sorumluluk sahibi olması",
          [["Tembel olması", "kavrama", "Her sabah okuldan önce su taşıyan biri tembel değildir."], ["Bencil olması", "kavrama", "Mert köyün fidanlarına yardım ediyor; bu bencillik değildir."], ["Korkak olması", "dikkat", "Metinde Mert'in korktuğunu gösteren bir ipucu yok."]],
          "Mert'in yaptığı işe bak: Ne zaman, ne yapıyor?",
          ["Soruda Mert'in karakter özelliği isteniyor.", "Mert, her sabah okula gitmeden önce iki kova su taşıyor.", "Bu davranış onun çalışkan ve sorumluluk sahibi olduğunu gösterir."],
          { kural: "Kişinin özelliklerini davranışlarından çıkarırız." }),
        Q("trova.karakter", "aciklama", 2, OVA2 + "<br><br>Metnin başında ve sonunda Can'da hangi değişim görülür?", "Köy işlerini bilmezken öğrenip kendi başına yapabilir hâle gelmiştir.",
          [["Köyü sevmezken şehirde kalmaya karar vermiştir.", "dikkat", "Can şehre dönüyor ama köyde kalmaya karar vermiyor; metinde böyle bir bilgi yok."], ["Başta çok bilgiliyken sonra her şeyi unutmuştur.", "kavrama", "Tam tersi: Başta bilmiyordu, sonunda öğrenmişti."], ["Hiçbir değişim olmamıştır.", "dikkat", "Can, sonunda yumurtaları tek başına toplayabiliyor; bu bir değişimdir."]],
          "Can'ın ilk günlerini ve tatilin sonunu karşılaştır.",
          ["Soruda karakterin hikâye boyunca nasıl değiştiği soruluyor.", "Başta inek sağmayı, tavuklara yem vermeyi bilmiyordu; sonunda yumurtaları kendi başına topluyordu.", "Can, köy işlerini öğrenmiş ve kendi başına yapabilir hâle gelmiştir."],
          { kural: "Hikâyelerde kişiler olaylar sonunda değişebilir; başı ve sonu karşılaştır." }),
        Q("trova.karakter", "uygulama", 2, OVA1 + "<br><br>Dedenin “Bu yıl bereketli olacak.” sözünde hangi duygu öne çıkar?", "Umut ve sevinç",
          [["Korku", "kavrama", "Bereketli bir yıl beklemek korku değil, umut anlatır."], ["Öfke", "kavrama", "Dedenin sözünde kızgınlık yoktur."], ["Pişmanlık", "kavrama", "Pişmanlık geçmişte yapılan bir şeye üzülmektir; dede geleceğe umutla bakıyor."]],
          "Dede başakları okşarken ne bekliyor?",
          ["Soruda dedenin sözündeki duygu soruluyor.", "Dede başakları okşuyor ve bol ürün bekliyor.", "Bu söz umut ve sevinç duygusunu anlatır."],
          { kural: "Duyguyu bulmak için kişinin sözlerine ve hareketlerine birlikte bak." }),
        Q("trova.karakter", "transfer", 2, "Köyden şehre yeni taşınan bir arkadaşınız sınıfa ilk kez geldi ve kimseyle konuşmuyor. Onun duygularını anlamak için en uygun düşünce hangisidir?", "Yeni bir yerde yalnız ve tedirgin hissediyor olabilir.",
          [["Bizi sevmediği için konuşmuyordur.", "kavrama", "Bu, acele bir yargıdır; yeni ortama alışmak zaman alır."], ["Konuşmayı bilmiyordur.", "kavrama", "Sessiz kalmak, konuşmayı bilmemek anlamına gelmez."], ["Onunla ilgilenmemize gerek yok.", "strateji", "Empati kuran biri, yeni arkadaşına yardım etmeye çalışır."]],
          "Kendini onun yerine koy: İlk gün sen nasıl hissederdin?",
          ["Soruda arkadaşın duygusunu anlamamız isteniyor.", "Yeni bir yere gelen kişi çoğu zaman yalnız ve tedirgin hisseder.", "En uygun düşünce: Yalnız ve tedirgin hissediyor olabilir; ona yardım etmeliyiz."],
          { kural: "Empati, kendini başkasının yerine koyarak onun duygularını anlamaktır." }),
        Q("trova.karakter", "hatirlama", 1, "Aşağıdakilerden hangisi bir kişinin <b>karakter</b> özelliğidir, fiziksel özelliği değildir?", "Yardımsever",
          [["Uzun boylu", "bilgi", "Boy, görünüşle ilgili fiziksel bir özelliktir."], ["Kıvırcık saçlı", "bilgi", "Saç şekli fiziksel bir özelliktir."], ["Ela gözlü", "bilgi", "Göz rengi fiziksel bir özelliktir."]],
          "Gözle görülebilen özellik mi, davranışla anlaşılan özellik mi?",
          ["Soruda davranışla ilgili özellik isteniyor.", "Boy, saç ve göz rengi gözle görülen fiziksel özelliklerdir.", "Yardımseverlik ise davranışlarla anlaşılan bir karakter özelliğidir."],
          { kural: "Fiziksel özellik görünüşü, karakter özelliği davranışı anlatır." }),
      ],
    },
    oyun: [
      { tur: "eslestir", kaz: "trova.unsur", soru: "Kırsal yaşamla ilgili sözcükleri anlamlarıyla eşleştir.", ciftler: [["harman", "ekinin dövülüp tanesinin ayrıldığı yer"], ["imece", "köylülerin el birliğiyle iş görmesi"], ["ahır", "büyükbaş hayvanların barındığı yer"], ["çapa", "toprağı kazıp yumuşatmaya yarayan alet"]], aciklama: "Harman ekinin dövüldüğü yer, imece el birliğiyle yapılan iş, ahır hayvanların barınağı, çapa ise toprağı kazmaya yarayan alettir." },
      { tur: "sirala", kaz: "trova.unsur", soru: "Elif'in hikâyesindeki olayları oluş sırasına göre diz.", ogeler: ["Elif dedesiyle tarlaya gitti.", "Dedesi başakları okşadı.", "Komşular yardıma geldi.", "Hep birlikte ekin biçtiler.", "Akşam köye döndüler."], aciklama: "Olaylar sabah tarlaya gitmekle başlar, öğleye doğru komşuların gelmesiyle sürer ve akşam köye dönüşle biter." },
      { tur: "uret", kaz: "trova.anafikir", soru: "HARMAN sözcüğünün harfleriyle en az 3 anlamlı kelime üret.", harfler: "HARMAN", kelimeler: ["harman", "nar", "ham", "han", "nam", "ana", "ara", "ama", "aman", "arma", "mana", "anma", "an", "ar", "ah"], hedef: 3, aciklama: "Örneğin: nar, han, ana, ara, aman, mana, anma." },
    ],
  });

  /* KONULAR_SONU */
})();
