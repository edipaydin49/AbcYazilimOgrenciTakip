"""6. sınıf Sosyal Bilgiler soru havuzu.

Çalıştırınca soru_havuzu.json ve ../SosyalSoruUretici.html dosyalarını üretir.
"""
import json
import sys
from pathlib import Path

BURA = Path(__file__).parent
KOK = BURA.parent
sys.path.insert(0, str(KOK.parent.parent / "ortak"))
from havuz_araclari import Havuz  # noqa: E402
from sayfa_olustur import sayfa_yaz  # noqa: E402

H = Havuz(1071)

DEGER = "Biz ve Değerlerimiz"
TARIH = "Tarihe Yolculuk"
YERYUZU = "Yeryüzünde Yaşam"
EKONOMI = "Ekonomi ve Sosyal Hayat"
YONETIM = "Yönetim ve Demokrasi"
DUNYA = "Uluslararası İlişkiler"

H.liste(DEGER, "Kolay", [
    ("Bir kişinin bulunduğu gruptaki konumuna ne ad verilir?", "Statü", ["Rol", "Değer", "Hak"]),
    ("Bir kişinin statüsünün gerektirdiği davranışlara ne ad verilir?", "Rol", ["Statü", "Kural", "Görev yeri"]),
    ("Aşağıdakilerden hangisi doğuştan kazanılan bir statüdür?", "Kardeş olmak", ["Öğretmen olmak", "Sınıf başkanı olmak", "Doktor olmak"]),
    ("Aşağıdakilerden hangisi sonradan kazanılan bir statüdür?", "Sınıf başkanı olmak", ["Kız çocuk olmak", "Torun olmak", "Kardeş olmak"]),
    ("Çocukların haklarını koruyan uluslararası belge hangisidir?", "Çocuk Haklarına Dair Sözleşme", ["Medeni Kanun", "Ticaret Kanunu", "Trafik Kanunu"]),
])
H.liste(DEGER, "Orta", [
    ("Ali okulda öğrenci, evde ağabey, futbol takımında kaptandır. Bu durum neyi gösterir?", "Bir kişinin birden fazla statüsü olabilir.", ["Bir kişinin yalnızca bir rolü vardır.", "Statüler değişmez.", "Roller her yerde aynıdır."]),
    ("Toplumsal kurallar hangi amaçla oluşturulur?", "Toplumda düzen ve uyumu sağlamak için", ["Herkesin istediğini yapması için", "Kişileri cezalandırmak için", "Yalnızca okulda uygulanmak için"]),
    ("Aşağıdakilerden hangisi bir yardımlaşma geleneğimizdir?", "İmece", ["Rekabet", "İsraf", "Bencillik"]),
])

H.liste(TARIH, "Kolay", [
    ("Orhun Yazıtları hangi Türk devletinden kalmıştır?", "Kök Türkler", ["Uygurlar", "Asya Hun Devleti", "Karahanlılar"]),
    ("Asya Hun Devleti'nin en ünlü hükümdarı kimdir?", "Mete Han", ["Bilge Kağan", "Tuğrul Bey", "Alparslan"]),
    ("“Türk” adını devlet adı olarak kullanan ilk Türk devleti hangisidir?", "Kök Türk Devleti", ["Asya Hun Devleti", "Uygur Devleti", "Büyük Selçuklu Devleti"]),
    ("Yerleşik hayata geçen ilk Türk devleti hangisidir?", "Uygurlar", ["Kök Türkler", "Asya Hunları", "Avrupa Hunları"]),
    ("İpek Yolu hangi iki bölgeyi birbirine bağlıyordu?", "Çin ve Avrupa", ["Afrika ve Amerika", "Hindistan ve Avustralya", "Mısır ve Japonya"]),
    ("Malazgirt Savaşı hangi yılda yapılmıştır?", "1071", ["1040", "751", "1176"]),
    ("Malazgirt Savaşı'nda Türk ordusunun komutanı kimdir?", "Sultan Alparslan", ["Tuğrul Bey", "Gazneli Mahmut", "Mete Han"]),
    ("Divanü Lügati't-Türk adlı eserin yazarı kimdir?", "Kaşgarlı Mahmut", ["Yusuf Has Hacib", "Nizamülmülk", "Bilge Kağan"]),
    ("Kutadgu Bilig adlı eserin yazarı kimdir?", "Yusuf Has Hacib", ["Kaşgarlı Mahmut", "Edip Ahmet", "Ahmet Yesevi"]),
])
H.liste(TARIH, "Orta", [
    ("İslamiyet'i resmî din olarak kabul eden ilk Türk devleti hangisidir?", "Karahanlılar", ["Gazneliler", "Büyük Selçuklular", "Uygurlar"]),
    ("Türklerin İslamiyet'i kabul etmesinde etkili olan, 751'de yapılan savaş hangisidir?", "Talas Savaşı", ["Malazgirt Savaşı", "Dandanakan Savaşı", "Miryokefalon Savaşı"]),
    ("Büyük Selçuklu Devleti'nin kurulmasını sağlayan 1040 tarihli savaş hangisidir?", "Dandanakan Savaşı", ["Malazgirt Savaşı", "Talas Savaşı", "Pasinler Savaşı"]),
    ("Malazgirt Savaşı'nın en önemli sonucu hangisidir?", "Anadolu'nun kapıları Türklere açıldı.", ["İpek Yolu kapandı.", "Kök Türk Devleti kuruldu.", "Türkler Çin'e yerleşti."]),
    ("Hindistan'a seferleriyle tanınan Gazneli hükümdar kimdir?", "Gazneli Mahmut", ["Satuk Buğra Han", "Tuğrul Bey", "Alparslan"]),
    ("Büyük Selçuklularda Nizamiye Medreselerini kuran vezir kimdir?", "Nizamülmülk", ["Kaşgarlı Mahmut", "Yusuf Has Hacib", "Tonyukuk"]),
    ("Orhun Yazıtları kimler adına dikilmiştir?", "Bilge Kağan, Kül Tigin ve Tonyukuk", ["Mete Han ve Atilla", "Tuğrul Bey ve Çağrı Bey", "Alparslan ve Melikşah"]),
    ("Kavimler Göçü'nü başlatan Türk topluluğu hangisidir?", "Avrupa Hunları (Hunlar)", ["Uygurlar", "Karahanlılar", "Kök Türkler"]),
    ("İpek Yolu'nda en çok ticareti yapılan ve yola adını veren ürün hangisidir?", "İpek", ["Pamuk", "Çay", "Altın"]),
])
H.liste(TARIH, "Zor", [
    ("Uygurların yerleşik hayata geçtiğini gösteren kanıt hangisidir?", "Şehirler kurup tarımla uğraşmaları", ["Atlı göçebe yaşamaları", "Çadırlarda yaşamaları", "Sürekli savaşmaları"]),
    ("Orhun Yazıtları'nın Türk tarihi açısından önemi nedir?", "Türk adının geçtiği ve Türkçe yazılmış ilk belgelerden olması", ["Arap alfabesiyle yazılması", "Osmanlı Devleti döneminde dikilmesi", "Latin harfleriyle yazılması"]),
    ("İpek Yolu'nun önemli olmasının nedeni nedir?", "Ticaretin yanında kültür alışverişini de sağlaması", ["Yalnızca askeri amaçla kullanılması", "Sadece Türkiye'den geçmesi", "Denizde bulunması"]),
])

H.liste(YERYUZU, "Kolay", [
    ("0° enlemi olan ve Dünya'yı iki eşit parçaya ayıran çizgi hangisidir?", "Ekvator", ["Başlangıç meridyeni", "Yengeç dönencesi", "Kutup dairesi"]),
    ("Başlangıç (0°) meridyeni hangi kentten geçer?", "Greenwich (Londra)", ["İstanbul", "Paris", "New York"]),
    ("Türkiye hangi yarım kürededir?", "Kuzey ve Doğu yarım kürede", ["Güney ve Batı yarım kürede", "Kuzey ve Batı yarım kürede", "Güney ve Doğu yarım kürede"]),
    ("Akdeniz ikliminin görüldüğü yerlerde yaygın bitki örtüsü hangisidir?", "Maki", ["Bozkır", "Tundra", "Gür orman"]),
    ("Karasal iklimin görüldüğü yerlerde yaygın bitki örtüsü hangisidir?", "Bozkır", ["Maki", "Tropikal orman", "Savan"]),
    ("Her mevsim yağış alan iklim tipi hangisidir?", "Karadeniz iklimi", ["Akdeniz iklimi", "Karasal iklim", "Çöl iklimi"]),
])
H.liste(YERYUZU, "Orta", [
    ("Toplam kaç paralel (enlem dairesi) vardır?", "180", ["90", "360", "45"]),
    ("Toplam kaç meridyen vardır?", "360", ["180", "90", "24"]),
    ("Ardışık iki meridyen arasındaki yerel saat farkı kaç dakikadır?", "4 dakika", ["1 dakika", "10 dakika", "60 dakika"]),
    ("Türkiye hangi enlemler arasında yer alır?", "36° – 42° Kuzey enlemleri", ["26° – 45° Kuzey enlemleri", "36° – 42° Güney enlemleri", "0° – 10° Kuzey enlemleri"]),
    ("Türkiye hangi boylamlar arasında yer alır?", "26° – 45° Doğu boylamları", ["36° – 42° Doğu boylamları", "26° – 45° Batı boylamları", "10° – 20° Doğu boylamları"]),
    ("Akdeniz ikliminin özelliği hangisidir?", "Yazları sıcak ve kurak, kışları ılık ve yağışlı", ["Her mevsim yağışlı", "Kışları soğuk ve karlı", "Yıl boyu çok soğuk"]),
    ("Karasal iklimin özelliği hangisidir?", "Yazları sıcak ve kurak, kışları soğuk ve karlı", ["Her mevsim yağışlı ve ılık", "Kışları ılık ve yağışlı", "Yıl boyu sıcak ve nemli"]),
    ("Ekvator'dan kutuplara doğru gidildikçe sıcaklık genel olarak nasıl değişir?", "Azalır.", ["Artar.", "Değişmez.", "Önce azalır sonra artar."]),
])
for fark, sure in [(5, 20), (10, 40), (15, 60), (19, 76), (3, 12), (8, 32)]:
    H.ekle(YERYUZU, "Zor", f"Aralarında {fark} meridyen farkı bulunan iki şehir arasındaki yerel saat farkı kaç dakikadır?",
           f"{sure} dakika", [f"{fark} dakika", f"{sure * 2} dakika", f"{fark * 15} dakika"])
H.liste(YERYUZU, "Zor", [
    ("Türkiye'nin en doğusu ile en batısı arasındaki yerel saat farkı kaç dakikadır?", "76 dakika", ["60 dakika", "19 dakika", "120 dakika"]),
    ("Doğudaki bir şehirde Güneş'in batıdaki şehirden önce doğmasının nedeni nedir?", "Dünya'nın batıdan doğuya doğru dönmesi", ["Dünya'nın doğudan batıya dönmesi", "Doğudaki şehirlerin daha yüksek olması", "Ay'ın Dünya'nın çevresinde dolanması"]),
])

H.liste(EKONOMI, "Kolay", [
    ("Türkiye'de çay tarımı en çok hangi ilimizde yapılır?", "Rize", ["Konya", "Antalya", "Edirne"]),
    ("Fındık üretiminin en fazla yapıldığı bölgemiz hangisidir?", "Karadeniz Bölgesi", ["İç Anadolu Bölgesi", "Doğu Anadolu Bölgesi", "Akdeniz Bölgesi"]),
    ("Buğday üretiminin en fazla yapıldığı bölgemiz hangisidir?", "İç Anadolu Bölgesi", ["Karadeniz Bölgesi", "Akdeniz Bölgesi", "Ege Bölgesi"]),
    ("İhtiyaçlarımızı karşılamak için mal ve hizmet satın almaya ne ad verilir?", "Tüketim", ["Üretim", "Dağıtım", "Tasarruf"]),
    ("Gelirimizin bir kısmını ileride kullanmak üzere ayırmaya ne ad verilir?", "Tasarruf", ["İsraf", "Tüketim", "Borç"]),
])
H.liste(EKONOMI, "Orta", [
    ("Büyükbaş hayvancılığın en yaygın olduğu bölgemiz hangisidir?", "Doğu Anadolu Bölgesi", ["Akdeniz Bölgesi", "Ege Bölgesi", "Marmara Bölgesi"]),
    ("Sanayinin en gelişmiş olduğu bölgemiz hangisidir?", "Marmara Bölgesi", ["Doğu Anadolu Bölgesi", "Karadeniz Bölgesi", "Güneydoğu Anadolu Bölgesi"]),
    ("Zeytin üretiminin en çok yapıldığı bölgemiz hangisidir?", "Ege Bölgesi", ["İç Anadolu Bölgesi", "Doğu Anadolu Bölgesi", "Karadeniz Bölgesi"]),
    ("Aşağıdakilerden hangisi bir ekonomik faaliyettir?", "Turizm", ["Uyumak", "Oyun oynamak", "Kitap okumak"]),
    ("Bir ürünün üreticiden tüketiciye ulaştırılmasına ne ad verilir?", "Dağıtım", ["Üretim", "Tasarruf", "İsraf"]),
])
H.liste(EKONOMI, "Zor", [
    ("Akdeniz kıyılarında turizmin gelişmesinin en önemli nedeni hangisidir?", "Yaz mevsiminin uzun, güneşli ve sıcak olması", ["Kışların çok soğuk olması", "Yıl boyu kar yağması", "Ormanların çok sık olması"]),
    ("Bir ülkede nitelikli iş gücünün artması için en önemli adım hangisidir?", "Eğitime yatırım yapmak", ["İsrafı artırmak", "Okul sayısını azaltmak", "Tasarrufu engellemek"]),
])

H.liste(YONETIM, "Kolay", [
    ("Türkiye Büyük Millet Meclisi hangi tarihte açılmıştır?", "23 Nisan 1920", ["29 Ekim 1923", "19 Mayıs 1919", "30 Ağustos 1922"]),
    ("Cumhuriyet hangi tarihte ilan edilmiştir?", "29 Ekim 1923", ["23 Nisan 1920", "10 Kasım 1938", "1 Kasım 1922"]),
    ("Türkiye'de seçme yaşı kaçtır?", "18", ["16", "21", "25"]),
    ("Yasama yetkisi hangi kuruma aittir?", "Türkiye Büyük Millet Meclisi", ["Bağımsız mahkemeler", "Belediyeler", "Valilikler"]),
    ("Yargı yetkisini kim kullanır?", "Bağımsız mahkemeler", ["TBMM", "Muhtarlar", "Okul müdürleri"]),
    ("Devletin temel yapısını ve vatandaşların temel haklarını belirleyen en üst hukuk kuralı hangisidir?", "Anayasa", ["Yönetmelik", "Genelge", "Okul kuralları"]),
])
H.liste(YONETIM, "Orta", [
    ("Yürütme yetkisi kime aittir?", "Cumhurbaşkanı", ["TBMM Başkanı", "Anayasa Mahkemesi", "Valiler"]),
    ("TBMM kaç milletvekilinden oluşur?", "600", ["450", "550", "500"]),
    ("Yasama, yürütme ve yargının ayrı kurumlar tarafından kullanılmasına ne ad verilir?", "Kuvvetler ayrılığı", ["Kuvvetler birliği", "Merkeziyetçilik", "Monarşi"]),
    ("Halkın kendi kendini yönettiği yönetim biçimine ne ad verilir?", "Demokrasi", ["Monarşi", "Oligarşi", "Teokrasi"]),
    ("Aşağıdakilerden hangisi bir vatandaşlık görevidir?", "Vergi vermek", ["Kitap okumak", "Spor yapmak", "Tatile gitmek"]),
])
H.liste(YONETIM, "Zor", [
    ("Seçimlerde oyların gizli verilmesinin amacı nedir?", "Seçmenin baskı altında kalmadan özgürce oy kullanması", ["Seçimin daha uzun sürmesi", "Sonuçların açıklanmaması", "Herkesin aynı adaya oy vermesi"]),
    ("Okulda sınıf başkanlığı seçimi yapılması hangi ilkenin uygulanmasına örnektir?", "Demokrasi", ["Monarşi", "Kuvvetler birliği", "Teokrasi"]),
])

H.liste(DUNYA, "Kolay", [
    ("Türkiye'nin kurucu üyeleri arasında yer aldığı, dünya barışını korumak için 1945'te kurulan örgüt hangisidir?", "Birleşmiş Milletler (BM)", ["Avrupa Birliği (AB)", "Türk Devletleri Teşkilatı", "Ekonomik İşbirliği Teşkilatı"]),
    ("Türk dili konuşan ülkelerin iş birliği için kurduğu örgüt hangisidir?", "Türk Devletleri Teşkilatı", ["NATO", "Birleşmiş Milletler", "Avrupa Konseyi"]),
    ("Aşağıdakilerden hangisi bir askerî savunma örgütüdür?", "NATO", ["UNICEF", "UNESCO", "Kızılay"]),
])
H.liste(DUNYA, "Orta", [
    ("Türkiye NATO'ya hangi yıl üye olmuştur?", "1952", ["1945", "1923", "1999"]),
    ("Çocukların sağlık, eğitim ve haklarıyla ilgilenen Birleşmiş Milletler kuruluşu hangisidir?", "UNICEF", ["NATO", "UNESCO", "IMF"]),
    ("Eğitim, bilim ve kültür alanında çalışan Birleşmiş Milletler kuruluşu hangisidir?", "UNESCO", ["UNICEF", "NATO", "Dünya Bankası"]),
    ("İslam ülkeleri arasında iş birliğini amaçlayan uluslararası örgüt hangisidir?", "İslam İşbirliği Teşkilatı", ["NATO", "Avrupa Birliği", "Türk Devletleri Teşkilatı"]),
])
H.liste(DUNYA, "Zor", [
    ("Türkiye'nin uluslararası örgütlere üye olmasının yararı hangisidir?", "Diğer ülkelerle iş birliğinin artması", ["Ülkenin dünyadan yalıtılması", "Ticaretin azalması", "Komşu ülkelerle ilişkilerin kesilmesi"]),
])

for i, s in enumerate(H.sorular, start=1):
    s["id"] = i
(BURA / "soru_havuzu.json").write_text(json.dumps(H.sorular, ensure_ascii=False, indent=1), encoding="utf-8")
LOGO = """<svg width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
      <circle class="kare edge" cx="29" cy="29" r="24"></circle>
      <ellipse class="cizgi" cx="29" cy="29" rx="10" ry="24" fill="none"></ellipse>
      <line class="cizgi" x1="5" y1="29" x2="53" y2="29"></line>
    </svg>"""
sayfa_yaz(H.sorular, KOK / "SosyalSoruUretici.html", "Sosyal Bilgiler 6 Soru Üretici", "Sosyal Bilgiler 6",
          "6. sınıf Sosyal Bilgiler", LOGO, sys.argv[1] if len(sys.argv) > 1 else None)
H.ozet()
