/* İlkokul 3. sınıf Türkçe — Tema 5–8 konuları (Sağlık ve Spor, Okuma Kültürü, Vatandaşlık, Sanat).
 * Okuma metinleri, cümleler ve şiirler özgündür; yazım kuralları TDK Yazım Kılavuzu'na göre verilmiştir.
 */
(function () {
  "use strict";
  const { S, Q, G, sec, karistir } = OGR;

  /* ---------- Çözüm adımları: 🔎 → 💡 → ✏️ … → ✅ → 🔁 ---------- */
  const ADIM = a => a.map((s, i) => i === 0 ? "🔎 Soruyu anlayalım: " + s : i === 1 ? "💡 Hatırlayalım: " + s : i === a.length - 2 ? "✅ Sonuç: " + s : i === a.length - 1 ? "🔁 Kontrol edelim: " + s : "✏️ " + s);
  // Havuz sorusu: T(kaz, düzey, zorluk, soru, doğru, [[yanlış, hata, neden]×3], ipucu, [5–7 adım], kural, dogruNeden, görsel?)
  const T = (kaz, duzey, zorluk, soru, dogru, yanlis, ipucu, adim, kural, dogruNeden, gorsel) =>
    Q(kaz, duzey, zorluk, soru, dogru, yanlis, ipucu, ADIM(adim), gorsel ? { kural, dogruNeden, gorsel } : { kural, dogruNeden });
  // Veri listesinden soru üreten üreteç: her çağrıda listeden bir öğe seçilir.
  const V = (kaz, duzey, zorluk, liste, kur) => () => S(Object.assign({ kaz, duzey, zorluk }, kur(sec(liste))));

  /* ---------- Görsel yardımcıları (yalnızca g-* sınıfları ve emoji) ---------- */
  const sar = (t, n = 56) => { const s = []; let l = ""; for (const x of t.split(" ")) { if ((l + " " + x).trim().length > n) { s.push(l); l = x; } else l = (l + " " + x).trim(); } if (l) s.push(l); return s; };
  // Okuma kartı: başlık + (otomatik bölünen) metin
  function KART(baslik, metin, etiket) {
    const sat = Array.isArray(metin) ? metin : sar(metin), ust = baslik ? 40 : 14, H = ust + 26 + sat.length * 27;
    let ic = `<rect class="g-yumusak g-cizgi" x="10" y="6" width="540" height="${H - 12}" rx="10" stroke-width="1.5"/>` + (baslik ? G.yazi(280, 34, baslik, { b: 1 }) : "");
    sat.forEach((s, i) => { ic += G.yazi(30, ust + 22 + i * 27, s, { a: "start" }); });
    return G.svg(560, H, ic, etiket || "okuma kartı");
  }
  // Sözcük kartları (karışık dizilmiş)
  function KUTU(sozler, etiket) {
    let x = 14, y = 12, ic = "";
    sozler.forEach(s => { const w = 26 + s.length * 9.5; if (x + w > 548) { x = 14; y += 56; } ic += `<rect class="g-b g-cizgi" x="${x}" y="${y}" width="${w}" height="42" rx="8" stroke-width="1.5"/>` + G.yazi(x + w / 2, y + 27, s, { b: 1 }); x += w + 12; });
    return G.svg(560, y + 58, ic, etiket || "karışık sözcük kartları");
  }
  // Konuşma balonları: [[kim (emoji + ad), söz], …]
  function BALON(liste, etiket) {
    let y = 10, ic = "";
    liste.forEach(([kim, soz], i) => {
      const sag = i % 2 === 1, w = Math.min(530, Math.max(170, 40 + soz.length * 7.6)), x = sag ? 550 - w : 10;
      ic += `<rect class="${sag ? "g-yumusak" : "g-bos"} g-cizgi" x="${x}" y="${y}" width="${w}" height="54" rx="16" stroke-width="1.5"/>` + G.yazi(x + 14, y + 19, kim, { a: "start", k: 1 }) + G.yazi(x + 14, y + 42, soz, { a: "start" });
      y += 64;
    });
    return G.svg(560, y, ic, etiket || "konuşma balonları");
  }
  // Resimli sahneler: [[emoji, alt yazı ("|" ile iki satır), harf?], …]
  function SAHNE(p, etiket) {
    const w = 540 / p.length; let ic = "";
    p.forEach(([em, alt, harf], i) => {
      const x = 10 + i * w, cx = x + w / 2, sat = alt.split("|");
      ic += `<rect class="g-bos g-cizgi" x="${x + 4}" y="8" width="${w - 8}" height="156" rx="12" stroke-width="1.5"/>` + `<text x="${cx}" y="80" font-size="46" text-anchor="middle">${em}</text>`;
      sat.forEach((s, j) => { ic += G.yazi(cx, 118 + j * 20, s, { k: 1 }); });
      if (harf) ic += `<circle class="g-b g-cizgi" cx="${x + 24}" cy="30" r="14"/>` + G.yazi(x + 24, 35, harf, { b: 1 });
    });
    return G.svg(560, 172, ic, etiket || "resimli sahneler");
  }
  // Afiş / duyuru: başlık + ortalanmış satırlar
  function AFIS(baslik, satirlar, etiket) {
    const H = 70 + satirlar.length * 30;
    let ic = `<rect class="g-bos g-cizgi" x="20" y="8" width="520" height="${H - 16}" rx="10" stroke-width="2"/><rect class="g-a" x="20" y="8" width="520" height="8" rx="4"/>` + G.yazi(280, 44, baslik, { b: 1 });
    satirlar.forEach((s, i) => { ic += G.yazi(280, 78 + i * 30, s); });
    return G.svg(560, H, ic, etiket || "afiş");
  }
  // Numaralı yönerge kartı: [[emoji, metin], …]
  function YONERGE(baslik, adimlar, etiket) {
    const H = 56 + adimlar.length * 46;
    let ic = `<rect class="g-yumusak g-cizgi" x="10" y="6" width="540" height="${H - 12}" rx="10" stroke-width="1.5"/>` + G.yazi(280, 34, baslik, { b: 1 });
    adimlar.forEach(([em, m], i) => { const y = 52 + i * 46; ic += `<circle class="g-a" cx="40" cy="${y + 14}" r="15"/>` + G.yazi(40, y + 19, i + 1, { b: 1 }) + `<text x="78" y="${y + 24}" font-size="26" text-anchor="middle">${em}</text>` + G.yazi(102, y + 19, m, { a: "start" }); });
    return G.svg(560, H, ic, etiket || "yönerge kartı");
  }

  /* ======================= 5. TEMA: SAĞLIK VE SPOR ======================= */

  /* ---------- 1. Cümle: sözcük sırası; olumlu, olumsuz ve soru cümleleri ---------- */
  const SIRA_VERI = [
    { s: ["havuzda", "Deniz", "yüzer", "her sabah"], d: "Deniz her sabah havuzda yüzer.", y: ["Havuzda yüzer Deniz her sabah.", "Her sabah Deniz yüzer havuzda.", "Yüzer Deniz havuzda her sabah."] },
    { s: ["içti", "süt", "Ece", "bir bardak"], d: "Ece bir bardak süt içti.", y: ["Süt Ece bir bardak içti.", "İçti bir bardak Ece süt.", "Bir bardak içti süt Ece."] },
    { s: ["koştuk", "parkta", "arkadaşlarımla", "akşam"], d: "Akşam arkadaşlarımla parkta koştuk.", y: ["Koştuk parkta akşam arkadaşlarımla.", "Parkta koştuk arkadaşlarımla akşam.", "Arkadaşlarımla koştuk akşam parkta."] },
    { s: ["yıkar", "ellerini", "yemekten önce", "Mert"], d: "Mert yemekten önce ellerini yıkar.", y: ["Ellerini Mert yıkar yemekten önce.", "Yıkar yemekten önce Mert ellerini.", "Yemekten önce yıkar ellerini Mert."] },
    { s: ["oynadık", "bahçede", "voleybol", "teneffüste"], d: "Teneffüste bahçede voleybol oynadık.", y: ["Oynadık bahçede teneffüste voleybol.", "Voleybol oynadık teneffüste bahçede.", "Bahçede oynadık voleybol teneffüste."] },
    { s: ["uyurum", "erken", "her gece", "ben"], d: "Ben her gece erken uyurum.", y: ["Uyurum ben her gece erken.", "Erken uyurum her gece ben.", "Her gece uyurum erken ben."] },
  ];
  const TUR_VERI = [
    { c: "Ali her gün sebze yer.", t: "olumlu cümle", n: "İş yapılıyor; olumsuzluk eki ya da soru sözü yok." },
    { c: "Zeynep bugün bisiklete binmedi.", t: "olumsuz cümle", n: "“binmedi” sözündeki “-me” eki işin yapılmadığını gösteriyor." },
    { c: "Maç saat kaçta başlayacak?", t: "soru cümlesi", n: "“kaçta” soru sözüyle cevap isteniyor; sonunda soru işareti var." },
    { c: "Kardeşim abur cubur sevmez.", t: "olumsuz cümle", n: "“sevmez” sözü işin yapılmadığını gösteriyor." },
    { c: "Sabah kahvaltısını yaptın mı?", t: "soru cümlesi", n: "“mı” soru sözüyle cevap isteniyor." },
    { c: "Bu ayakkabı koşu için uygun değil.", t: "olumsuz cümle", n: "“değil” sözü cümleyi olumsuz yapıyor." },
    { c: "Dedem her akşam yürüyüşe çıkar.", t: "olumlu cümle", n: "Yürüyüşe çıkma işi yapılıyor; olumsuz söz yok." },
    { c: "Spor salonunda kimler vardı?", t: "soru cümlesi", n: "“kimler” soru sözüyle cevap isteniyor." },
    { c: "Bugün bahçede hiç kimse yok.", t: "olumsuz cümle", n: "“yok” sözü cümleyi olumsuz yapıyor." },
  ];
  const TURLER = ["olumlu cümle", "olumsuz cümle", "soru cümlesi", "ünlem cümlesi"];
  KONU_EKLE("tr", {
    id: "t3_cumle", tema: "t3t5", ad: "Cümle: Sözcük Sırası; Olumlu, Olumsuz ve Soru Cümleleri", sayfa: "5. tema", gorev: "Karışık sözcüklerden cümle kurma ve cümle türlerini ayırma",
    kazanimlar: [
      { id: "t3cum.sira", ad: "Sözcükleri doğru sıraya dizerek anlamlı cümle kurar" },
      { id: "t3cum.tur", ad: "Olumlu, olumsuz ve soru cümlelerini ayırt eder ve birbirine dönüştürür" },
    ],
    anlatim: [
      { baslik: "Sözcükler sıraya girince cümle olur",
        metin: "Bir duyguyu, düşünceyi ya da olayı anlatan sözcük dizisine <b>cümle</b> denir.<br>Sözcükleri rastgele dizersek anlam bozulur. Türkçede <b>iş bildiren sözcük</b> çoğunlukla cümlenin <b>sonuna</b> gelir.<br>Cümle <b>büyük harfle başlar</b>, sonuna bir <b>noktalama işareti</b> konur.",
        ornek: "“koşar · Ayşe · bahçede” → <b>Ayşe bahçede koşar.</b> (iş bildiren “koşar” en sonda)",
        gorsel: KUTU(["top", "Can", "attı", "kaleye"], "karışık sözcükler: top, Can, attı, kaleye"),
        durak: { soru: "Kartlardaki sözcüklerle kurulan anlamlı cümle hangisidir?", secenekler: [["Can kaleye top attı.", true, "İş bildiren “attı” sonda; kim, nereye, ne sırası doğru."], ["Attı Can top kaleye.", false, "İş bildiren sözcük başa gelmiş, cümle kulağa tuhaf geliyor."], ["Kaleye attı top Can.", false, "Sözcüklerin sırası karışık; anlamı anlamak zor."], ["Top Can kaleye attı.", false, "“Top Can” bir kişinin adı gibi okunuyor; anlam karışıyor."]] } },
      { baslik: "Olumlu ve olumsuz cümle",
        metin: "Bir işin <b>yapıldığını</b> ya da bir durumun <b>var olduğunu</b> anlatan cümleye <b>olumlu cümle</b> denir.<br>İşin <b>yapılmadığını</b> anlatan cümleye <b>olumsuz cümle</b> denir. Olumsuzluğu çoğu zaman <b>-me, -ma</b> eki, <b>değil</b> ya da <b>yok</b> sözü gösterir.",
        ornek: "Ece ip atlıyor. (olumlu) → Ece ip atlamıyor. (olumsuz)<br>Su soğuk. (olumlu) → Su soğuk değil. (olumsuz)",
        durak: { soru: "Hangisi olumsuz bir cümledir?", secenekler: [["Bugün yüzmeye gitmedik.", true, "“gitmedik” sözündeki “-me” eki işin yapılmadığını gösteriyor."], ["Bugün yüzmeye gittik.", false, "Yüzmeye gidilmiş; iş yapıldığı için olumlu cümledir."], ["Bugün yüzmeye gidecek misiniz?", false, "Bu cümle soru soruyor; soru cümlesidir."], ["Havuzun suyu çok temiz.", false, "Bir durumun var olduğunu anlatıyor; olumlu cümledir."]] } },
      { baslik: "Soru cümlesi",
        metin: "Bir şey öğrenmek için sorulan cümleye <b>soru cümlesi</b> denir. Soru cümlesinde <b>mi (mı, mu, mü)</b> ya da <b>kim, ne, nerede, ne zaman, nasıl, neden, kaç</b> gibi soru sözleri bulunur.<br>Soru cümlesinin sonuna <b>soru işareti (?)</b> konur.",
        ornek: "Dişlerini fırçaladın <b>mı</b>? · Antrenman <b>ne zaman</b> başlıyor? · Takımda <b>kaç</b> oyuncu var?",
        gorsel: BALON([["👧 Elif", "Yarın maça gelecek misin?"], ["👦 Kerem", "Evet, geleceğim."]], "Elif ile Kerem konuşuyor"),
        durak: { soru: "Konuşmada Elif'in söylediği cümle hangi türdendir?", secenekler: [["Soru cümlesi", true, "“misin” soru sözü var ve cümle soru işaretiyle bitiyor."], ["Olumlu cümle", false, "Elif bilgi vermiyor, bir şey soruyor."], ["Olumsuz cümle", false, "Cümlede “-me, değil, yok” gibi olumsuzluk yok."], ["Bu bir cümle değildir", false, "Sözcükler anlamlı bir sırayla dizilmiş; bu bir cümledir."]] } },
      { baslik: "Cümleleri dönüştürelim",
        metin: "Aynı cümleyi küçük değişikliklerle olumlu, olumsuz ya da soru cümlesine çevirebiliriz.<br>• Olumsuz yapmak için iş bildiren sözcüğe <b>-me/-ma</b> ekleriz ya da <b>değil</b> deriz.<br>• Soru yapmak için <b>mi</b> sözünü ayrı yazarız ve sona <b>?</b> koyarız.",
        ornek: "Ben sabah koşarım. → Ben sabah koşmam. → Ben sabah koşar mıyım?",
        durak: { soru: "“Kardeşim süt içti.” cümlesinin olumsuz hâli hangisidir?", secenekler: [["Kardeşim süt içmedi.", true, "“içti” sözüne “-me” eklenince iş yapılmamış olur."], ["Kardeşim süt içti mi?", false, "Bu cümle soru cümlesidir, olumsuz değildir."], ["Kardeşim süt içecek.", false, "Bu cümle hâlâ olumludur; yalnızca zamanı değişmiş."], ["Kardeşim çok süt içti.", false, "“çok” sözü cümleyi olumsuz yapmaz."]] } },
    ],
    uret: {
      "t3cum.sira": [
        V("t3cum.sira", "uygulama", 1, SIRA_VERI, v => ({
          soru: "Kartlardaki sözcüklerle kurulan <b>anlamlı ve kurallı</b> cümle hangisidir?", gorsel: KUTU(v.s, "karışık sözcük kartları: " + v.s.join(", ")),
          dogru: v.d, yanlis: [[v.y[0], "kavrama", "Sözcüklerin sırası karışmış; iş bildiren sözcük en sonda olmalıydı."], [v.y[1], "dikkat", "İş bildiren sözcük sonda değil; cümleyi sesli oku, kulağına tuhaf gelecek."], [v.y[2], "kavrama", "İş bildiren sözcük başa gelmiş; kurallı cümlede bu sözcük sona gelir."]],
          ipucu: "Önce iş bildiren sözcüğü bul ve onu en sona koy. Sonra “kim?” sorusunun cevabını başa getir.",
          cozum: ADIM(["Karışık sözcüklerle kurallı bir cümle kuracağız.", "Türkçede iş bildiren sözcük çoğunlukla cümlenin sonuna gelir.", "Kartlardaki iş bildiren sözcüğü bulup en sona koyalım.", "Kim? sorusunun cevabını başa, diğer sözcükleri araya yerleştirelim.", "Doğru cümle: " + v.d, "Cümleyi sesli oku; akıcı ve anlaşılır geliyorsa doğru kurmuşsun demektir."]),
          kural: "Kurallı cümlede iş bildiren sözcük sondadır; cümle büyük harfle başlar, noktalama işaretiyle biter.", dogruNeden: "İş bildiren sözcük sonda ve sözcükler anlamlı bir sırayla dizilmiş.",
        })),
        T("t3cum.sira", "hatirlama", 1, "Kurallı bir cümlede iş bildiren sözcük çoğunlukla nerede bulunur?", "Cümlenin sonunda",
          [["Cümlenin başında", "bilgi", "Başa çoğunlukla işi yapan kişi gelir; iş bildiren sözcük sona gelir."], ["Cümlenin ortasında", "bilgi", "Kurallı cümlede iş bildiren sözcük ortada değil, sondadır."], ["Her yerde olabilir, fark etmez", "kavrama", "Sıra fark eder; sırayı bozarsak cümle tuhaflaşır."]],
          "“Ali top oynadı.” cümlesinde iş bildiren sözcük hangisi, nerede?",
          ["İş bildiren sözcüğün kurallı cümledeki yerini soruyor.", "İş bildiren sözcük; koşmak, yemek, oynamak gibi yapılan bir işi anlatır.", "Örnek: “Ali top oynadı.” İş bildiren sözcük “oynadı”.", "“oynadı” cümlenin en sonunda duruyor.", "İş bildiren sözcük kurallı cümlenin sonunda bulunur.", "Başka bir cümle dene: “Ben süt içtim.” → “içtim” yine sonda."],
          "Kurallı cümlede iş bildiren sözcük sondadır.", "Türkçede kurallı cümlelerde iş bildiren sözcük sona gelir."),
        T("t3cum.sira", "uygulama", 2, "Kartlardaki sözcüklerden anlamlı bir cümle kurulursa <b>en sona</b> hangi sözcük gelir?", "yapıyoruz",
          [["Biz", "kavrama", "“Biz” işi yapanları gösterir; çoğunlukla başa gelir."], ["jimnastik", "kavrama", "“jimnastik” ne yapıldığını söyler ama iş bildiren sözcük değildir."], ["sabahları", "dikkat", "“sabahları” zamanı bildirir; sona değil başa ya da ortaya gelir."]],
          "Hangi sözcük yapılan işi anlatıyor?",
          ["Sona gelecek sözcüğü bulacağız.", "Kurallı cümlede iş bildiren sözcük en sona gelir.", "Sözcükler: Biz, sabahları, jimnastik, yapıyoruz.", "Yapılan işi anlatan sözcük “yapıyoruz”.", "En sona “yapıyoruz” gelir: Biz sabahları jimnastik yapıyoruz.", "Cümleyi oku: anlamlı ve akıcı; demek ki sıra doğru."],
          "İş bildiren sözcük sona yerleşir.", "“yapıyoruz” yapılan işi bildirir; kurallı cümlede sona gelir.", KUTU(["jimnastik", "yapıyoruz", "Biz", "sabahları"])),
        T("t3cum.sira", "aciklama", 2, "Hangisi <b>anlamlı bir cümle değildir</b>?", "Spor yaparız çünkü sağlıklı.",
          [["Spor yapmak bizi sağlıklı tutar.", "dikkat", "Bu cümle tam ve anlamlıdır."], ["Her gün biraz yürüyüş yapalım.", "dikkat", "Bu cümle bir öneri bildiriyor ve anlamlıdır."], ["Sağlıklı olmak için spor yaparız.", "dikkat", "Bu cümle tam ve anlamlıdır."]],
          "Her seçeneği sesli oku. Hangisinde düşünce yarım kalıyor ya da kim olduğu belli değil?",
          ["Anlamı eksik ya da bozuk olan sözcük dizisini arıyoruz.", "Cümle bir düşünceyi tam ve anlaşılır biçimde anlatır.", "“Spor yaparız çünkü sağlıklı.” dizisinde kimin sağlıklı olduğu belli değil; düşünce yarım kalmış.", "Diğer üç seçenek tam bir düşünce anlatıyor.", "Anlamlı olmayan dizi: “Spor yaparız çünkü sağlıklı.”", "Düzeltmeyi dene: “Spor yaparız çünkü spor bizi sağlıklı tutar.” Şimdi anlam tamam."],
          "Cümle bir düşünceyi tam olarak anlatmalıdır.", "Bu dizide düşünce yarım kalmış; neyin sağlıklı olduğu söylenmemiş."),
        T("t3cum.sira", "transfer", 3, "Beden eğitimi öğretmeni tahtaya karışık sözcükler yazdı. Sözcüklerin <b>hepsi</b> kullanılarak kurulan doğru cümle hangisidir?", "Maçtan sonra bol su içmeliyiz.",
          [["Maçtan sonra su içmeliyiz.", "dikkat", "“bol” sözcüğü kullanılmamış; bütün sözcükleri kullanmalıyız."], ["Bol su maçtan sonra içmeliyiz.", "kavrama", "Sıra karışık; “bol su” iş bildiren sözcüğün hemen önüne gelmeli."], ["İçmeliyiz maçtan sonra bol su.", "kavrama", "İş bildiren sözcük başa gelmiş; kurallı cümlede sonda olur."]],
          "Bütün kartları kullan, iş bildiren sözcüğü sona koy.",
          ["Bütün sözcükleri kullanarak kurallı cümle kuracağız.", "Kurallı cümlede iş bildiren sözcük sondadır; hiçbir kart dışarıda kalmamalı.", "İş bildiren sözcük: “içmeliyiz” → en sona.", "Zaman bildiren “maçtan sonra” başa; “bol su” iş bildiren sözcüğün önüne.", "Doğru cümle: Maçtan sonra bol su içmeliyiz.", "Kartları say: maçtan, sonra, bol, su, içmeliyiz → beşi de cümlede var."],
          "Cümle kurarken verilen bütün sözcükleri kullan ve iş bildiren sözcüğü sona koy.", "Beş sözcüğün hepsi kullanılmış ve iş bildiren sözcük sonda.", KUTU(["su", "içmeliyiz", "maçtan", "bol", "sonra"])),
        T("t3cum.sira", "baglanti", 2, "“sınıfımız · kazandı · koşu yarışını” sözcükleriyle kurulan cümle hangi noktalama işaretiyle bitmelidir?", "Nokta (.)",
          [["Soru işareti (?)", "kavrama", "Cümle bir şey sormuyor, bilgi veriyor."], ["Virgül (,)", "bilgi", "Virgül cümle sonuna konmaz; cümle içinde kullanılır."], ["Hiçbir işaret konmaz", "bilgi", "Her cümle bir noktalama işaretiyle biter."]],
          "Önce cümleyi kur: “Sınıfımız koşu yarışını kazandı.” Bilgi mi veriyor, soru mu soruyor?",
          ["Kurduğumuz cümlenin sonuna gelecek işareti soruyor.", "Bilgi veren cümleler nokta ile, soru cümleleri soru işaretiyle biter.", "Cümle: Sınıfımız koşu yarışını kazandı.", "Bu cümle bir haberi, bilgiyi anlatıyor; soru sormuyor.", "Sonuna nokta konur.", "Cümleyi soru yapsaydık “kazandı mı?” derdik; burada öyle değil."],
          "Bilgi veren cümleler noktayla biter.", "Cümle bilgi veriyor; bilgi veren cümlenin sonuna nokta konur."),
      ],
      "t3cum.tur": [
        V("t3cum.tur", "aciklama", 1, TUR_VERI, v => ({
          soru: "Kartta yazan cümle hangi türdendir?", gorsel: KART("", [v.c], "cümle kartı: " + v.c),
          dogru: v.t, yanlis: TURLER.filter(t => t !== v.t).map(t => [t, t === "ünlem cümlesi" ? "bilgi" : "kavrama", t === "ünlem cümlesi" ? "Cümlede sevinç, korku ya da şaşkınlık bildiren bir duygu ve ünlem işareti yok." : t === "olumlu cümle" ? "Cümlede olumsuzluk ya da soru var; olumlu değil." : t === "olumsuz cümle" ? "Cümlede “-me/-ma, değil, yok” gibi olumsuzluk bildiren bir söz yok." : "Cümle bir şey sormuyor; soru sözü ve soru işareti yok."]),
          ipucu: "Cümlede “-me/-ma, değil, yok” var mı? Soru sözü ya da “?” var mı?",
          cozum: ADIM(["Cümlenin olumlu mu, olumsuz mu, soru mu olduğunu bulacağız.", "Olumsuz cümlede “-me/-ma, değil, yok”; soru cümlesinde “mi” ya da soru sözü ve “?” bulunur.", "Cümle: “" + v.c + "”", v.n, "Bu cümle bir " + v.t + "dir.", "Cümlenin sonundaki işarete de bak; soru cümlesi “?” ile biter."]),
          kural: "Olumsuzluk: -me/-ma, değil, yok. Soru: mi, kim, ne, nerede, kaç… ve “?”", dogruNeden: v.n,
        })),
        V("t3cum.tur", "uygulama", 2, [
          { c: "Ben her sabah koşarım.", o: "Ben her sabah koşmam.", s: "Ben her sabah koşar mıyım?" },
          { c: "Ayşe yüzmeyi seviyor.", o: "Ayşe yüzmeyi sevmiyor.", s: "Ayşe yüzmeyi seviyor mu?" },
          { c: "Ahmet meyve yedi.", o: "Ahmet meyve yemedi.", s: "Ahmet meyve yedi mi?" },
          { c: "Bu su temiz.", o: "Bu su temiz değil.", s: "Bu su temiz mi?" },
          { c: "Takımımız maçı kazandı.", o: "Takımımız maçı kazanmadı.", s: "Takımımız maçı kazandı mı?" },
        ], v => ({
          soru: `“${v.c}” cümlesinin <b>olumsuz</b> hâli hangisidir?`, gorsel: BALON([["🧒 Öğrenci", v.c], ["👩‍🏫 Öğretmen", "Şimdi bu cümleyi olumsuz yap!"]], "öğretmenle öğrenci konuşuyor"),
          dogru: v.o, yanlis: [[v.s, "kavrama", "Bu cümle soru soruyor; olumsuz değil, soru cümlesi."], [v.c.replace(/\.$/, "!"), "dikkat", "Yalnızca sondaki işaret değişmiş; cümle hâlâ olumlu."], [v.s.replace(/\?$/, ".").replace(/ (mı|mi|mu|mü|mıyım)\./, "."), "dikkat", "Bu cümle hâlâ olumlu; içinde “-me/-ma” eki ya da “değil” sözü yok."]],
          ipucu: "İşin yapılmadığını anlatmak için “-me/-ma” eki ya da “değil” sözü gerekir.",
          cozum: ADIM(["Olumlu cümleyi olumsuz cümleye çevireceğiz.", "Olumsuz cümle işin yapılmadığını anlatır; “-me/-ma” eki ya da “değil” kullanılır.", "Olumlu cümle: " + v.c, "Olumsuzluk eklenince: " + v.o, "Doğru cevap: " + v.o, "Anlamı karşılaştır: ilk cümlede iş yapılıyor, ikincisinde yapılmıyor. Anlam tersine döndü."]),
          kural: "Olumsuz yapmak için iş bildiren sözcüğe -me/-ma eklenir ya da “değil” denir.", dogruNeden: "Cümleye olumsuzluk eklenmiş; artık iş yapılmadığını anlatıyor.",
        })),
        T("t3cum.tur", "uygulama", 2, "“Okul takımına seçildin.” cümlesinin <b>soru</b> hâli hangisidir?", "Okul takımına seçildin mi?",
          [["Okul takımına seçilmedin.", "kavrama", "Bu cümle olumsuzdur; soru sormuyor."], ["Okul takımına seçildinmi?", "bilgi", "“mi” her zaman ayrı yazılır: seçildin mi?"], ["Okul takımına seçildin!", "dikkat", "Yalnızca işaret değişmiş; soru sözü yok."]],
          "Soru sözü “mi”yi ekle; ayrı yazmayı ve soru işaretini unutma.",
          ["Bilgi veren cümleyi soru cümlesine çevireceğiz.", "Soru cümlesi yapmak için “mi” sözü ayrı yazılır ve sona “?” konur.", "“seçildin” sözünden sonra ayrı olarak “mi” ekleyelim.", "Sona soru işareti koyalım.", "Doğru cevap: Okul takımına seçildin mi?", "“mi”nin ayrı yazıldığını ve sonda “?” olduğunu bir kez daha kontrol et."],
          "Soru eki “mi” ayrı yazılır; soru cümlesi “?” ile biter.", "“mi” ayrı yazılmış ve cümle soru işaretiyle bitmiş."),
        T("t3cum.tur", "aciklama", 2, "Konuşmada hangi çocuk <b>olumsuz</b> bir cümle söylemiştir?", "Ece",
          [["Can", "kavrama", "Can bir soru sormuş; onun cümlesi soru cümlesidir."], ["Ali", "dikkat", "Ali “Ben her gün süt içerim.” diyor; olumlu cümle."], ["Selin", "kavrama", "Selin'in cümlesinde “-me” ya da “değil” yok; olumlu cümle."]],
          "“-me/-ma”, “değil” ya da “yok” sözünü arayın.",
          ["Olumsuz cümle söyleyen çocuğu bulacağız.", "Olumsuz cümlede “-me/-ma”, “değil” ya da “yok” bulunur.", "Can: “...seviyor musun?” → soru. Ali: “...içerim.” → olumlu.", "Ece: “Ben gazlı içecek içmem.” → “içmem” sözünde “-me” var.", "Olumsuz cümleyi Ece söylemiştir.", "Selin: “Ayran çok faydalı.” → olumsuzluk yok. Cevabımız Ece."],
          "Olumsuz cümlede iş yapılmaz: -me/-ma, değil, yok.", "Ece'nin “içmem” sözü işin yapılmadığını gösteriyor.",
          BALON([["🧒 Can", "Ayran içmeyi seviyor musun?"], ["👧 Ece", "Ben gazlı içecek içmem."], ["👦 Ali", "Ben her gün süt içerim."], ["👧 Selin", "Ayran çok faydalı."]], "dört çocuğun konuşması")),
        T("t3cum.tur", "transfer", 3, "Doktor, Mert'e “Akşamları ekrana çok bakma.” diyor. Bu cümlenin anlamına <b>en yakın</b> olumlu cümle hangisidir?", "Akşamları ekrana az bak.",
          [["Akşamları ekrana çok bak.", "kavrama", "Bu cümle doktorun söylediğinin tam tersini anlatıyor."], ["Akşamları ekrana bakmıyor musun?", "kavrama", "Bu bir soru cümlesi; doktor soru sormamış."], ["Akşamları ekrana hiç bakma.", "dikkat", "Bu cümle de olumsuz; üstelik “hiç” anlamı değiştiriyor."]],
          "Olumsuzluğu kaldırınca anlam değişmesin; “çok bakma” yerine olumlu ne söylenebilir?",
          ["Aynı anlamı veren olumlu bir cümle arıyoruz.", "Olumlu cümlede “-me/-ma”, “değil”, “yok” bulunmaz.", "Doktor “çok bakma” diyor; yani ekrana bakacaksan az bak.", "“Akşamları ekrana az bak.” cümlesinde olumsuzluk yok ve anlam aynı.", "Doğru cevap: Akşamları ekrana az bak.", "“Çok bak” seçeneği anlamı tersine çevirir; dikkat et."],
          "Olumsuz bir cümle, karşıt anlamlı bir sözcükle olumlu cümleye çevrilebilir.", "Cümlede olumsuzluk yok ve doktorun öğüdüyle aynı anlamı taşıyor.", AFIS("🩺 Doktorun Öğütleri", ["Akşamları ekrana çok bakma.", "Her gün meyve ye.", "Erken yat, erken kalk."], "doktorun öğüt kartı")),
        T("t3cum.tur", "hatirlama", 1, "Aşağıdaki sözlerden hangisi cümleyi <b>olumsuz</b> yapar?", "değil",
          [["mi", "bilgi", "“mi” cümleyi soru cümlesi yapar."], ["çok", "kavrama", "“çok” miktar bildirir; cümleyi olumsuz yapmaz."], ["her gün", "kavrama", "“her gün” zaman bildirir; cümleyi olumsuz yapmaz."]],
          "“Hava sıcak.” cümlesine hangisini eklersen anlam tersine döner?",
          ["Cümleyi olumsuz yapan sözü bulacağız.", "Olumsuzluk “-me/-ma” eki, “değil” ya da “yok” ile yapılır.", "“Hava sıcak.” → “Hava sıcak değil.” Anlam tersine döndü.", "“mi” eklersek soru olur; “çok” ya da “her gün” anlamı tersine çevirmez.", "Cümleyi olumsuz yapan söz: değil.", "Bir cümle daha dene: “Ödevim hazır değil.” → olumsuz."],
          "“değil” ve “yok” sözleri cümleyi olumsuz yapar.", "“değil” sözü cümleye olumsuz anlam katar."),
      ],
    },
    oyun: [
      { tur: "eslestir", kaz: "t3cum.tur", soru: "Cümleleri türleriyle eşleştir.", ciftler: [["Her gün yürüyüş yaparım.", "olumlu cümle"], ["Abur cubur yemem.", "olumsuz cümle"], ["Maç ne zaman başlıyor?", "soru cümlesi"]], aciklama: "Olumlu cümlede iş yapılır, olumsuz cümlede yapılmaz; soru cümlesi soru sorar ve “?” ile biter." },
      { tur: "eslestir", kaz: "t3cum.tur", soru: "Olumlu cümleleri olumsuz hâlleriyle eşleştir.", ciftler: [["Ali koşuyor.", "Ali koşmuyor."], ["Su soğuk.", "Su soğuk değil."], ["Sınıfta top var.", "Sınıfta top yok."], ["Ece uyudu.", "Ece uyumadı."]], aciklama: "Olumsuzluk -me/-ma eki, “değil” ya da “yok” sözüyle yapılır." },
      { tur: "sirala", kaz: "t3cum.sira", soru: "Sözcükleri sıraya dizerek anlamlı bir cümle kur.", ogeler: ["Ben", "her sabah", "dişlerimi", "fırçalarım."], aciklama: "“Ben her sabah dişlerimi fırçalarım.” İş bildiren “fırçalarım” sözcüğü sona gelir." },
      { tur: "uret", kaz: "t3cum.sira", soru: "SAĞLIK harfleriyle en az 3 anlamlı kelime üret.", harfler: "SAĞLIK", kelimeler: ["sağlık", "sağ", "akıl", "ağıl", "kısa", "sıla", "kas", "kal", "sal", "sık", "kıl", "ağ", "ak", "al", "as"], hedef: 3, aciklama: "Örnekler: sağ, akıl, kas, kal, sal, sık, ağ. Her harfi bir kelimede en fazla bir kez kullanabilirsin." },
    ],
  });

  /* ---------- 2. Büyük harflerin kullanıldığı yerler ---------- */
  const BUY_VERI = [
    { y: "ayşe her cumartesi yüzmeye gider.", d: "Ayşe her cumartesi yüzmeye gider.", z: "Ayşe her Cumartesi yüzmeye gider.", n: "Cümle başındaki ve kişi adı olan “Ayşe” büyük harfle başlar; gün adı “cumartesi” burada belirli bir tarih bildirmediği için küçük yazılır." },
    { y: "Kedimiz pamuk süt içmeyi sever.", d: "Kedimiz Pamuk süt içmeyi sever.", z: "Kedimiz Pamuk Süt içmeyi sever.", n: "“Pamuk” kedinin özel adıdır; hayvanlara verilen özel adlar büyük harfle başlar." },
    { y: "Bu yaz trabzon'da dağ yürüyüşü yaptık.", d: "Bu yaz Trabzon'da dağ yürüyüşü yaptık.", z: "Bu yaz Trabzon'da Dağ yürüyüşü yaptık.", n: "“Trabzon” bir şehir adıdır; şehir adları büyük harfle başlar." },
    { y: "Takımımız almanya'daki turnuvaya katıldı.", d: "Takımımız Almanya'daki turnuvaya katıldı.", z: "Takımımız Almanya'daki Turnuvaya katıldı.", n: "“Almanya” bir ülke adıdır; ülke adları büyük harfle başlar." },
    { y: "Dedem Kemal bey her sabah bisiklete biner.", d: "Dedem Kemal Bey her sabah bisiklete biner.", z: "dedem Kemal Bey her sabah bisiklete biner.", n: "Kişi adından sonra gelen “Bey” saygı sözüdür ve büyük harfle başlar." },
    { y: "en sevdiğim sporcu yüzücü deniz yılmaz.", d: "En sevdiğim sporcu yüzücü Deniz Yılmaz.", z: "En sevdiğim sporcu yüzücü Deniz yılmaz.", n: "Cümle büyük harfle başlar; kişi adı ve soyadı da büyük harfle yazılır." },
  ];
  KONU_EKLE("tr", {
    id: "t3_buyuk", tema: "t3t5", ad: "Büyük Harflerin Kullanıldığı Yerler", sayfa: "5. tema", gorev: "Büyük harfle başlaması gereken sözcükleri bulma",
    kazanimlar: [
      { id: "t3buy.cumle", ad: "Cümle ve dize başlarında büyük harf kullanır" },
      { id: "t3buy.ozel", ad: "Kişi, hayvan, şehir, ülke adlarında, saygı sözlerinde ve belirli tarihlerde büyük harf kullanır" },
    ],
    anlatim: [
      { baslik: "Cümle büyük harfle başlar",
        metin: "Her cümlenin <b>ilk harfi büyük</b> yazılır. Noktadan, soru işaretinden ya da ünlemden sonra gelen yeni cümle de büyük harfle başlar.<br>Şiirlerde her <b>dize</b> (satır) de büyük harfle başlar.",
        ornek: "<b>S</b>abah erkenden kalktım. <b>K</b>ahvaltımı yaptım. <b>S</b>onra okula yürüdüm.",
        gorsel: KART("", ["sabah erkenden kalktım. kahvaltımı yaptım."], "küçük harfle yazılmış iki cümle"),
        durak: { soru: "Karttaki yazıda kaç harfin büyük yazılması gerekir?", secenekler: [["2", true, "İki cümle var: “sabah” ve “kahvaltımı” sözcüklerinin ilk harfleri büyük olmalı."], ["1", false, "Noktadan sonra yeni bir cümle başlıyor; o da büyük harfle başlamalı."], ["3", false, "Yalnızca cümle başları büyük olmalı; burada iki cümle var."], ["Hiç", false, "Cümleler her zaman büyük harfle başlar."]] } },
      { baslik: "Özel adlar büyük harfle başlar",
        metin: "Tek bir varlığa verilen ada <b>özel ad</b> denir. Özel adlar büyük harfle başlar:<br>• Kişi adları ve soyadları: <b>A</b>li <b>Y</b>ıldız<br>• Hayvanlara verilen adlar: <b>B</b>oncuk, <b>K</b>arabaş<br>• Şehir ve ülke adları: <b>R</b>ize, <b>T</b>ürkiye, <b>J</b>aponya",
        ornek: "“kedi” her kedi için kullanılır → küçük harf. “Tekir” yalnızca bizim kedimizin adı → büyük harf.",
        durak: { soru: "Hangi sözcük her zaman büyük harfle başlar?", secenekler: [["İzmir", true, "İzmir bir şehrin özel adıdır."], ["şehir", false, "“şehir” bütün şehirler için kullanılan genel bir addır."], ["köpek", false, "“köpek” bütün köpekler için kullanılır; özel ad değildir."], ["futbol", false, "“futbol” bir spor dalının adıdır; özel ad değildir."]] } },
      { baslik: "Saygı sözleri ve belirli tarihler",
        metin: "Kişi adlarından sonra gelen <b>Hanım, Bey</b> gibi saygı sözleri büyük harfle başlar: Ayşe <b>H</b>anım, Murat <b>B</b>ey.<br>Ay ve gün adları <b>belirli bir tarihi</b> gösteriyorsa büyük harfle başlar: 29 <b>E</b>kim 1923.<br>Belirli bir tarih yoksa küçük yazılır: Okullar <b>e</b>ylülde açılır.",
        ornek: "23 <b>N</b>isan 1920 (belirli tarih) · Her <b>c</b>umartesi yüzerim. (belirli tarih yok)",
        durak: { soru: "Hangi cümlede ay adı doğru yazılmıştır?", secenekler: [["Spor şenliği 19 Mayıs 2026 günü yapılacak.", true, "Gün, ay ve yıl birlikte belirli bir tarih bildiriyor; “Mayıs” büyük harfle başlar."], ["Spor şenliği 19 mayıs 2026 günü yapılacak.", false, "Belirli tarih bildiren ay adı büyük harfle başlar."], ["Her Mayıs ayında şenlik yapılır.", false, "Burada belirli bir tarih yok; “mayıs” küçük yazılır."], ["Şenlik Mayısta yapılır.", false, "Belirli bir tarih yok; “mayısta” küçük harfle yazılır."]] } },
    ],
    uret: {
      "t3buy.cumle": [
        T("t3buy.cumle", "hatirlama", 1, "Cümlenin ilk harfi nasıl yazılır?", "Büyük harfle",
          [["Küçük harfle", "bilgi", "Cümleler küçük harfle değil, büyük harfle başlar."], ["İsteğe göre büyük ya da küçük", "kavrama", "Bu bir kuraldır; her cümle büyük harfle başlar."], ["Yalnızca ilk cümle büyük harfle başlar", "kavrama", "Her yeni cümle büyük harfle başlar, yalnızca ilki değil."]],
          "Kitabındaki herhangi bir cümlenin ilk harfine bak.",
          ["Cümle başında hangi harfin kullanılacağını soruyor.", "Her cümle büyük harfle başlar.", "Örnek: “Bugün maç var.” → “B” büyük.", "Noktadan sonra gelen yeni cümle de büyük harfle başlar.", "Cümlenin ilk harfi büyük harfle yazılır.", "Defterindeki son cümleye bak: ilk harfini büyük yazdın mı?"],
          "Her cümle büyük harfle başlar.", "Türkçede bütün cümleler büyük harfle başlar."),
        T("t3buy.cumle", "uygulama", 1, "Karttaki yazıda hangi sözcük büyük harfle başlamalıydı?", "spor",
          [["Her", "dikkat", "“Her” zaten büyük harfle başlamış ve doğru."], ["yorgunluğu", "kavrama", "Bu sözcük cümlenin ortasında; küçük yazılır."], ["Yürüyüş", "dikkat", "“Yürüyüş” zaten büyük harfle başlamış."]],
          "Noktadan sonra gelen ilk sözcüğe bak.",
          ["Büyük harfle başlaması gereken sözcüğü bulacağız.", "Noktadan sonra yeni cümle başlar ve büyük harfle yazılır.", "İlk cümle “Her...” ile başlamış; doğru.", "Noktadan sonra “spor” gelmiş ama küçük yazılmış.", "Büyük harfle başlaması gereken sözcük: spor → Spor.", "Diğer noktalardan sonra da bak: “Yürüyüş” büyük; doğru."],
          "Nokta, soru işareti ve ünlemden sonra yeni cümle büyük harfle başlar.", "“spor” noktadan sonra yeni cümlenin ilk sözcüğüdür.", KART("", ["Her gün biraz hareket et. spor yorgunluğu alır.", "Yürüyüş yapmak da çok faydalıdır."], "yazım hatalı kart")),
        T("t3buy.cumle", "uygulama", 2, "Şiirin dizelerinden hangisinin yazımı <b>yanlıştır</b>?", "3. dize",
          [["1. dize", "dikkat", "1. dize “Koşarım” ile büyük harfle başlamış; doğru."], ["2. dize", "dikkat", "2. dize “Rüzgâr” ile büyük harfle başlamış; doğru."], ["4. dize", "dikkat", "4. dize “Sporla” ile büyük harfle başlamış; doğru."]],
          "Her dizenin ilk harfine tek tek bak.",
          ["Yazımı yanlış olan dizeyi arıyoruz.", "Şiirde her dize büyük harfle başlar.", "1. dize “Koşarım”, 2. dize “Rüzgâr”, 4. dize “Sporla” → büyük.", "3. dize “her sabah” küçük harfle başlamış.", "Yanlış yazılan dize: 3. dize. Doğrusu: “Her sabah...”", "Dizeleri baştan say ve her birinin ilk harfini parmağınla göster."],
          "Şiirde her dize büyük harfle başlar.", "3. dize küçük harfle başlamış; dizeler büyük harfle başlamalıdır.", KART("Koşu", ["1. Koşarım çayırda, bayırda,", "2. Rüzgâr eser saçlarımda.", "3. her sabah erkenden kalkarım,", "4. Sporla güne başlarım."], "dört dizelik şiir")),
        T("t3buy.cumle", "transfer", 2, "Ceren arkadaşına not yazdı. Notta <b>kaç</b> yerde büyük harf kullanılmalıydı ama kullanılmamış?", "2",
          [["1", "dikkat", "Yalnızca birini bulmuşsun; noktalardan sonraki sözcüklere tek tek bak."], ["3", "dikkat", "“Merhaba” zaten büyük; yalnızca iki hata var."], ["4", "kavrama", "Cümle ortasındaki sözcükler küçük yazılır; hepsi hata değil."]],
          "Her noktadan sonraki ilk sözcüğe bak.",
          ["Büyük yazılması gerekip küçük yazılan yerleri sayacağız.", "Her cümle büyük harfle başlar.", "“Merhaba.” doğru. Sonra “yarın” küçük → hata 1.", "“Çantanı unutma.” doğru. Sonra “saat” küçük → hata 2.", "Toplam 2 yerde büyük harf kullanılmamış.", "Düzeltilmiş hâl: Merhaba. Yarın maç var. Çantanı unutma. Saat onda buluşalım."],
          "Her yeni cümlenin ilk harfi büyüktür.", "“yarın” ve “saat” yeni cümlelerin başında oldukları hâlde küçük yazılmış.", KART("📝 Ceren'in notu", ["Merhaba. yarın maç var. Çantanı unutma.", "saat onda buluşalım."], "Ceren'in notu")),
        T("t3buy.cumle", "aciklama", 2, "Hangi cümlede büyük harf <b>doğru</b> kullanılmıştır?", "Annem bana sağlıklı bir kahvaltı hazırladı.",
          [["annem bana sağlıklı bir kahvaltı hazırladı.", "dikkat", "Cümle küçük harfle başlamış."], ["Annem Bana sağlıklı bir kahvaltı hazırladı.", "kavrama", "“bana” cümlenin ortasında; büyük yazılmaz."], ["Annem bana Sağlıklı bir Kahvaltı hazırladı.", "kavrama", "Cümle ortasındaki sözcükler özel ad değilse küçük yazılır."]],
          "Cümle başına ve cümle ortasındaki sözcüklere ayrı ayrı bak.",
          ["Büyük harfin doğru kullanıldığı cümleyi arıyoruz.", "Cümle başı büyük; özel ad olmayan sözcükler cümle ortasında küçük yazılır.", "Birinci seçenek küçük harfle başlıyor → yanlış.", "Üçüncü ve dördüncü seçeneklerde cümle ortasında gereksiz büyük harfler var → yanlış.", "Doğru cümle: Annem bana sağlıklı bir kahvaltı hazırladı.", "Doğru cümlede yalnızca ilk harf büyük; başka özel ad yok."],
          "Büyük harf gelişigüzel kullanılmaz; cümle başında ve özel adlarda kullanılır.", "Cümle büyük harfle başlamış, ortadaki sözcükler doğru olarak küçük yazılmış."),
        T("t3buy.cumle", "baglanti", 3, "“Ne güzel bir gün! hadi parka gidelim.” yazısında hangi düzeltme yapılmalıdır?", "“hadi” sözcüğü büyük harfle başlamalı.",
          [["“gün” sözcüğü büyük harfle başlamalı.", "kavrama", "“gün” cümlenin ortasında; küçük yazılır."], ["Ünlem işareti silinmeli.", "bilgi", "Sevinç bildiren cümlenin sonuna ünlem konur; doğru."], ["“parka” sözcüğü büyük harfle başlamalı.", "kavrama", "“park” bir yerin özel adı değil; küçük yazılır."]],
          "Ünlem işaretinden sonra yeni bir cümle başlıyor mu?",
          ["Yazıdaki yanlışı bulup düzelteceğiz.", "Ünlem işaretinden sonra gelen yeni cümle de büyük harfle başlar.", "İlk cümle “Ne güzel bir gün!” ünlemle bitmiş.", "İkinci cümle “hadi” ile başlıyor ama küçük yazılmış.", "Düzeltme: “Hadi parka gidelim.”", "Kuralı hatırla: nokta, soru işareti ve ünlemden sonra büyük harf gelir."],
          "Ünlem ve soru işaretinden sonra gelen cümle de büyük harfle başlar.", "Ünlemden sonra yeni cümle başlıyor; ilk harfi büyük olmalı."),
      ],
      "t3buy.ozel": [
        V("t3buy.ozel", "uygulama", 2, BUY_VERI, v => ({
          soru: "Karttaki cümlenin büyük harf bakımından <b>doğru</b> yazılışı hangisidir?", gorsel: KART("", [v.y], "yazım hatalı cümle: " + v.y),
          dogru: v.d, yanlis: [[v.y, "dikkat", "Bu, karttaki hatalı yazılışın aynısı; düzeltme yapılmamış."], [v.d.toLocaleUpperCase("tr-TR").charAt(0) + v.d.slice(1).replace(/ (\S)/g, (m, c) => " " + c.toLocaleUpperCase("tr-TR")), "kavrama", "Her sözcük büyük harfle başlamaz; yalnızca cümle başı ve özel adlar büyük yazılır."], [v.z, "dikkat", "Bu yazılışta hâlâ bir yanlış var: ya gereksiz bir büyük harf eklenmiş ya da büyük yazılması gereken bir harf küçük kalmış."]],
          ipucu: "Cümlede kişi, hayvan, şehir ya da ülke adı var mı? Cümle başı büyük mü?",
          cozum: ADIM(["Cümleyi büyük harf kurallarına göre düzelteceğiz.", "Cümle başı ve özel adlar (kişi, hayvan, şehir, ülke adları, Hanım/Bey) büyük harfle başlar.", "Hatalı cümle: " + v.y, v.n, "Doğru yazılış: " + v.d, "Özel adları tek tek göster: hepsi büyük harfle mi başlıyor? Diğer sözcükler küçük mü?"]),
          kural: "Özel adlar ve cümle başları büyük harfle başlar; diğer sözcükler küçük yazılır.", dogruNeden: v.n,
        })),
        T("t3buy.ozel", "hatirlama", 1, "Aşağıdakilerden hangisi <b>özel ad</b> olduğu için büyük harfle başlar?", "Karadeniz",
          [["deniz", "kavrama", "“deniz” bütün denizler için kullanılan genel bir addır."], ["kalem", "kavrama", "“kalem” bütün kalemlerin ortak adıdır."], ["oyuncu", "kavrama", "“oyuncu” bütün oyuncular için kullanılır."]],
          "Hangisi yalnızca tek bir varlığın adıdır?",
          ["Özel adı bulacağız.", "Özel ad, tek bir varlığa verilen addır ve büyük harfle başlar.", "deniz, kalem, oyuncu → birçok varlık için kullanılır; genel ad.", "Karadeniz → tek bir denizin adı; özel ad.", "Cevap: Karadeniz.", "“Hangi deniz?” diye sorunca “Karadeniz” cevabı tek bir denizi gösterir."],
          "Tek bir varlığa verilen ad özel addır; büyük harfle başlar.", "Karadeniz tek bir denizin adıdır; özel addır."),
        T("t3buy.ozel", "aciklama", 2, "Tabloda hangi satırdaki sözcüklerin <b>ikisi de</b> büyük harfle başlamalıdır?", "rize – japonya",
          [["kedi – şehir", "kavrama", "“kedi” ve “şehir” genel adlardır; küçük yazılır."], ["boncuk – top", "dikkat", "“Boncuk” bir hayvan adı olabilir ama “top” genel addır."], ["ülke – ayşe", "dikkat", "“Ayşe” büyük yazılır ama “ülke” genel addır."]],
          "Her satırdaki iki sözcüğün de özel ad olup olmadığına bak.",
          ["İki sözcüğü de özel ad olan satırı bulacağız.", "Şehir, ülke, kişi ve hayvan adları özel addır; büyük harfle başlar.", "kedi – şehir: ikisi de genel ad. boncuk – top: yalnızca biri özel ad olabilir.", "ülke – ayşe: yalnızca “Ayşe” özel ad. rize – japonya: şehir ve ülke adı.", "İkisi de büyük harfle başlamalı: Rize – Japonya.", "“Hangi şehir?” → Rize. “Hangi ülke?” → Japonya. İkisi de tek bir yeri gösteriyor."],
          "Şehir ve ülke adları özel addır.", "Rize bir şehir, Japonya bir ülke adıdır; ikisi de özel addır.", G.tablo(["Satır", "Sözcükler"], [["1", "kedi – şehir"], ["2", "boncuk – top"], ["3", "ülke – ayşe"], ["4", "rize – japonya"]])),
        T("t3buy.ozel", "uygulama", 2, "Afişte hangi sözcüğün yazımı <b>yanlıştır</b>?", "konya",
          [["Okulumuz", "dikkat", "“Okulumuz” cümle başında; büyük harfle başlaması doğru."], ["Haziran", "kavrama", "Gün, ay, yıl birlikte belirli tarih bildiriyor; “Haziran” büyük yazılır."], ["Ahmet", "dikkat", "“Ahmet” kişi adı; büyük harfle başlaması doğru."]],
          "Afişte geçen şehir adına dikkat et.",
          ["Afişteki yazım yanlışını arıyoruz.", "Kişi ve şehir adları ile belirli tarihteki ay adları büyük harfle başlar.", "“Okulumuz” cümle başı, “Ahmet” kişi adı, “12 Haziran 2026” belirli tarih → doğru.", "“konya” bir şehir adı ama küçük yazılmış.", "Yanlış yazılan sözcük: konya → Konya.", "Afişi tekrar oku; özel adların hepsi büyük harfle mi başlıyor?"],
          "Şehir adları büyük harfle başlar.", "Konya bir şehir adıdır; büyük harfle başlamalıdır.", AFIS("🏃 KOŞU ŞENLİĞİ", ["Okulumuz 12 Haziran 2026'da", "konya'da koşu şenliğine katılıyor.", "Sorumlu öğretmen: Ahmet Bey"], "koşu şenliği afişi")),
        T("t3buy.ozel", "transfer", 3, "Sena, köpeğinin adını yazarken hangisinde yazımı <b>doğru</b> yapmıştır?", "Köpeğim Paşa ile her gün parkta koşarız.",
          [["Köpeğim paşa ile her gün parkta koşarız.", "kavrama", "“Paşa” köpeğin özel adıdır; büyük harfle başlamalı."], ["Köpeğim Paşa ile her gün Parkta koşarız.", "kavrama", "“park” genel bir yer adıdır; küçük yazılır."], ["köpeğim Paşa ile her gün parkta koşarız.", "dikkat", "Cümle küçük harfle başlamış."]],
          "Hayvanlara verilen adlar özel addır.",
          ["Büyük harfleri doğru kullanılmış cümleyi arıyoruz.", "Cümle başı ve hayvanlara verilen özel adlar büyük harfle başlar.", "Cümlede “Köpeğim” cümle başı → büyük; “Paşa” köpeğin adı → büyük.", "“park” genel ad → küçük.", "Doğru cümle: Köpeğim Paşa ile her gün parkta koşarız.", "Kendine sor: “Hangi köpek?” → Paşa. Tek bir köpeği gösteriyor, öyleyse özel ad."],
          "Hayvanlara verilen adlar büyük harfle başlar.", "Cümle başı ve köpeğin özel adı büyük, genel ad olan “park” küçük yazılmış.", SAHNE([["🐕", "Paşa"], ["🌳", "park"], ["🏃‍♀️", "Sena"]], "Sena, köpeği Paşa ve park")),
        T("t3buy.ozel", "baglanti", 2, "“Ayşe ___ bize yüzmeyi öğretti.” Boşluğa saygı sözü hangi yazımla gelmelidir?", "Hanım",
          [["hanım", "bilgi", "Kişi adından sonra gelen saygı sözü büyük harfle başlar."], ["HANIM", "kavrama", "Bütün harfleri büyük yazmak gerekmez; yalnızca ilk harf büyük."], ["hanim", "dikkat", "Hem ilk harf küçük hem de “ı” yerine “i” yazılmış."]],
          "Kişi adından sonra gelen “Hanım, Bey” sözlerini nasıl yazıyoruz?",
          ["Saygı sözünün doğru yazımını bulacağız.", "Kişi adından sonra gelen “Hanım” ve “Bey” büyük harfle başlar.", "Ad: Ayşe → saygı sözü hemen arkasında.", "Saygı sözü “Hanım” ilk harfi büyük yazılır.", "Doğru yazım: Ayşe Hanım.", "Benzer örnek: Murat Bey, Elif Hanım."],
          "Kişi adından sonra gelen Hanım, Bey sözleri büyük harfle başlar.", "Saygı sözü kişi adına bağlı olduğu için büyük harfle başlar."),
      ],
    },
    oyun: [
      { tur: "eslestir", kaz: "t3buy.ozel", soru: "Özel adları türleriyle eşleştir.", ciftler: [["Erzurum", "şehir adı"], ["Türkiye", "ülke adı"], ["Pamuk", "kedi adı"], ["Elif Kaya", "kişi adı"]], aciklama: "Şehir, ülke, hayvan ve kişi adları özel addır; büyük harfle başlar." },
      { tur: "eslestir", kaz: "t3buy.ozel", soru: "Yanlış yazılan sözcükleri doğru yazımlarıyla eşleştir.", ciftler: [["sivas", "Sivas"], ["mehmet bey", "Mehmet Bey"], ["29 ekim 1923", "29 Ekim 1923"]], aciklama: "Şehir adı, kişi adı ve saygı sözü ile belirli tarihteki ay adı büyük harfle başlar." },
      { tur: "sirala", kaz: "t3buy.cumle", soru: "Dizeleri sıraya koyarak şiiri tamamla.", ogeler: ["Top attım,", "Kaleye girdi,", "Arkadaşlarım", "Beni alkışladı."], aciklama: "Şiirde her dize büyük harfle başlar: Top, Kaleye, Arkadaşlarım, Beni." },
      { tur: "uret", kaz: "t3buy.cumle", soru: "KOŞULAR harfleriyle en az 3 anlamlı kelime üret.", harfler: "KOŞULAR", kelimeler: ["koşular", "koşu", "koşul", "okul", "kuş", "kuşlar", "kural", "kol", "kul", "kar", "kor", "kur", "oluk", "uşak", "ark", "rol", "ok", "al", "ak"], hedef: 3, aciklama: "Örnekler: koşu, okul, kuş, kural, kol, kar. Her harfi bir kelimede en fazla bir kez kullanabilirsin." },
    ],
  });

  /* SON */
})();
