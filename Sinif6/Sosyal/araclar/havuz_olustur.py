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

# ---------------- EK SORULAR (2. sürüm) ----------------
H.liste(DEGER, "Kolay", [
    ("Toplumun en küçük birimi hangisidir?", "Aile", ["Okul", "Belediye", "Mahalle"]),
    ("Aşağıdakilerden hangisi her çocuğun sahip olduğu bir haktır?", "Eğitim hakkı", ["Araba kullanma hakkı", "Oy kullanma hakkı", "Milletvekili seçilme hakkı"]),
    ("Esnafın dürüst çalışmasını ve dayanışmasını sağlayan tarihî teşkilat hangisidir?", "Ahilik", ["İmece", "Vakıf", "Kurultay"]),
    ("Toplumun yararına hizmet etmek için mal ya da para bağışlanarak kurulan kuruma ne ad verilir?", "Vakıf", ["Fabrika", "Banka", "Pazar"]),
    ("Aşağıdakilerden hangisi kültürel mirasımıza örnektir?", "Halk oyunları", ["Akıllı telefon", "Hızlı tren", "Bilgisayar oyunu"]),
])
H.liste(DEGER, "Orta", [
    ("Aşağıdakilerden hangisi UNESCO Somut Olmayan Kültürel Miras listesinde yer alan değerlerimizden biridir?", "Karagöz", ["Galata Kulesi", "Sümela Manastırı", "Topkapı Sarayı"]),
    ("Ebru sanatı, Türk kahvesi kültürü ve Nasreddin Hoca fıkraları neyin örnekleridir?", "Somut olmayan kültürel mirasın", ["Doğal afetlerin", "Ekonomik faaliyetlerin", "Yönetim birimlerinin"]),
    ("Ahilik teşkilatının kurucusu olarak kabul edilen kişi kimdir?", "Ahi Evran", ["Yunus Emre", "Hacı Bektaş Veli", "Mevlana"]),
    ("Bir kişinin hem öğrenci hem kardeş hem de takım kaptanı olması neyi gösterir?", "Farklı gruplarda farklı rollerinin olduğunu", ["Tek bir rolü olduğunu", "Statüsünün hiç değişmediğini", "Hiçbir gruba ait olmadığını"]),
    ("Okulda bir arkadaşının dışlandığını gören öğrencinin yapması gereken en doğru davranış hangisidir?", "Arkadaşını gruba katmak ve öğretmene haber vermek", ["Görmezden gelmek", "Dışlayanlara katılmak", "Arkadaşıyla alay etmek"]),
])
H.liste(DEGER, "Zor", [
    ("Toplumsal dayanışmanın artmasına en çok katkı sağlayan davranış hangisidir?", "Afet bölgesindeki insanlara yardım kampanyasına katılmak", ["Yalnızca kendi ihtiyacını düşünmek", "Komşularla görüşmemek", "Ortak alanları kirletmek"]),
])
H.liste(TARIH, "Kolay", [
    ("Kök Türk Devleti'nin kurucusu kimdir?", "Bumin Kağan", ["Mete Han", "Bilge Kağan", "Attila"]),
    ("Avrupa Hun Devleti'nin en ünlü hükümdarı kimdir?", "Attila", ["Mete Han", "Bumin Kağan", "Tuğrul Bey"]),
    ("İlk Türk devletlerinde devlet işlerinin görüşüldüğü meclise ne ad verilir?", "Kurultay", ["Divan", "Senato", "Kongre"]),
    ("İlk Türk devletlerinde yazısız hukuk kurallarına ne ad verilir?", "Töre", ["Kurultay", "Kut", "Balbal"]),
    ("Büyük Selçuklu Devleti'nin kurucusu kimdir?", "Tuğrul Bey", ["Alparslan", "Melikşah", "Gazneli Mahmut"]),
    ("İpek Yolu üzerinde tüccarların konaklaması için yapılan yapılara ne ad verilir?", "Kervansaray", ["Medrese", "Kale", "Cami"]),
    ("Türkiye Selçuklu Devleti'nin kurucusu kimdir?", "Kutalmışoğlu Süleyman Şah", ["Tuğrul Bey", "Mete Han", "Bumin Kağan"]),
])
H.liste(TARIH, "Orta", [
    ("Kavimler Göçü hangi yılda başlamıştır?", "375", ["751", "1071", "552"]),
    ("Asya Hun hükümdarı Mete Han'ın orduda kurduğu düzen hangisidir?", "Onlu sistem", ["Tımar sistemi", "Yeniçeri ocağı", "Devşirme sistemi"]),
    ("İlk Türk devletlerinde hükümdarlık yetkisinin Tanrı tarafından verildiğine inanılmasına ne ad verilir?", "Kut", ["Töre", "Kurultay", "Balbal"]),
    ("İlk Türklerde mezarların başına dikilen taş heykellere ne ad verilir?", "Balbal", ["Kurgan", "Yazıt", "Kervansaray"]),
    ("Uygurların benimsediği din hangisidir?", "Maniheizm", ["Budizm", "Gök Tanrı inancı", "Hristiyanlık"]),
    ("Büyük Selçukluların Bizans ile yaptığı ilk savaş hangisidir?", "Pasinler Savaşı (1048)", ["Malazgirt Savaşı (1071)", "Talas Savaşı (751)", "Dandanakan Savaşı (1040)"]),
    ("Malazgirt Savaşı'ndan sonra Anadolu'da kurulan ilk Türk beyliklerinden biri hangisidir?", "Danişmentliler", ["Osmanlılar", "Karahanlılar", "Uygurlar"]),
    ("Türkiye Selçukluları ile Bizans arasında 1176'da yapılan savaş hangisidir?", "Miryokefalon Savaşı", ["Malazgirt Savaşı", "Pasinler Savaşı", "Talas Savaşı"]),
    ("Kâğıdın Çin'den İslam dünyasına yayılmasında etkili olan savaş hangisidir?", "Talas Savaşı", ["Malazgirt Savaşı", "Kösedağ Savaşı", "Dandanakan Savaşı"]),
    ("Kutadgu Bilig hangi devlet döneminde yazılmıştır?", "Karahanlılar", ["Kök Türkler", "Gazneliler", "Uygurlar"]),
    ("Divanü Lügati't-Türk'ün yazılma amacı hangisidir?", "Araplara Türkçeyi öğretmek", ["Savaş taktiklerini anlatmak", "Ticaret kurallarını belirlemek", "Hükümdarlara öğüt vermek"]),
    ("Hindistan'dan Avrupa'ya baharat taşınan ticaret yoluna ne ad verilir?", "Baharat Yolu", ["İpek Yolu", "Kral Yolu", "Kürk Yolu"]),
])
H.liste(TARIH, "Zor", [
    ("Orta Asya'dan yapılan Türk göçlerinin nedenleri arasında hangisi yoktur?", "Deniz ticaretinin gelişmesi", ["Kuraklık", "Nüfus artışı", "Siyasi baskılar"]),
    ("Türkiye Selçuklularının Moğollara yenildiği 1243 tarihli savaş hangisidir?", "Kösedağ Savaşı", ["Miryokefalon Savaşı", "Malazgirt Savaşı", "Pasinler Savaşı"]),
    ("İpek Yolu'nun zamanla önemini kaybetmesinin en önemli nedeni hangisidir?", "Coğrafi Keşiflerle yeni deniz yollarının bulunması", ["İpek üretiminin artması", "Kervansarayların çoğalması", "Türklerin ticareti bırakması"]),
    ("Uygurların kâğıt ve matbaa kullanması neyi gösterir?", "Kültür ve bilimde ileri gittiklerini", ["Göçebe yaşadıklarını", "Hiç yazı kullanmadıklarını", "Yalnızca hayvancılık yaptıklarını"]),
])
H.liste(YERYUZU, "Kolay", [
    ("Dünya'nın gerçek şekline ne ad verilir?", "Geoit", ["Küre", "Elips", "Silindir"]),
    ("En uzun paralel hangisidir?", "Ekvator", ["Yengeç dönencesi", "Kuzey kutup dairesi", "Oğlak dönencesi"]),
    ("Bir yerin enlem ve boylam değerleriyle belirlenen konumuna ne ad verilir?", "Matematik konum", ["Özel konum", "Göreceli konum", "Yerel konum"]),
    ("Haritadaki işaretlerin ne anlama geldiğini gösteren bölüme ne ad verilir?", "Lejant (açıklama)", ["Ölçek", "Pusula", "Başlık"]),
    ("Türkiye'de en fazla yağış alan bölge hangisidir?", "Karadeniz Bölgesi", ["İç Anadolu Bölgesi", "Güneydoğu Anadolu Bölgesi", "Ege Bölgesi"]),
    ("Ülkemizde en çok can kaybına neden olan doğal afet hangisidir?", "Deprem", ["Çığ", "Kasırga", "Hortum"]),
    ("Afet ve acil durumlarda çalışan devlet kurumumuz hangisidir?", "AFAD", ["TÜİK", "TRT", "PTT"]),
])
H.liste(YERYUZU, "Orta", [
    ("Meridyenlerle ilgili hangisi doğrudur?", "Hepsinin uzunluğu eşittir ve kutuplarda birleşir.", ["Ekvator'dan kutuplara küçülür.", "Birbirine paraleldir.", "Toplam 180 tanedir."]),
    ("Paralellerle ilgili hangisi doğrudur?", "Ekvator'dan kutuplara doğru küçülür.", ["Hepsinin uzunluğu eşittir.", "Kutuplarda birleşir.", "Toplam 360 tanedir."]),
    ("Bir yerin çevresindeki dağlara, denizlere ve ülkelere göre konumuna ne ad verilir?", "Özel konum", ["Matematik konum", "Enlem", "Boylam"]),
    ("Türkiye'nin özel konumunun bir sonucu hangisidir?", "Asya ile Avrupa arasında köprü olması", ["Ekvator üzerinde bulunması", "Güney yarım kürede olması", "Hiç denize kıyısı olmaması"]),
    ("Haritadaki uzunlukların gerçek uzunluklara göre ne kadar küçültüldüğünü gösteren orana ne ad verilir?", "Ölçek", ["Lejant", "İzohips", "Yön oku"]),
    ("Yükselti arttıkça hava sıcaklığı genel olarak nasıl değişir?", "Azalır.", ["Artar.", "Değişmez.", "Önce artar sonra azalır."]),
    ("Her mevsim sıcak ve yağışlı olan, gür ormanların bulunduğu iklim hangisidir?", "Ekvatoral iklim", ["Çöl iklimi", "Kutup iklimi", "Karasal iklim"]),
    ("Yıl boyunca çok az yağış alan, gece ile gündüz arasındaki sıcaklık farkı fazla olan iklim hangisidir?", "Çöl iklimi", ["Ekvatoral iklim", "Karadeniz iklimi", "Muson iklimi"]),
    ("Yazları çok yağış alan, Hindistan'da görülen iklim hangisidir?", "Muson iklimi", ["Akdeniz iklimi", "Kutup iklimi", "Çöl iklimi"]),
    ("Kutup ikliminin görüldüğü yerlerdeki bitki örtüsü hangisidir?", "Tundra", ["Maki", "Bozkır", "Savan"]),
    ("Haritada aynı yükseltideki noktaları birleştiren eğrilere ne ad verilir?", "Eş yükselti eğrileri (izohips)", ["Paraleller", "Meridyenler", "Ölçek çizgileri"]),
])
for boylam, yon, saat in [(30, "doğu", "14.00"), (45, "doğu", "15.00"), (15, "batı", "11.00"), (60, "doğu", "16.00"), (30, "batı", "10.00")]:
    H.ekle(YERYUZU, "Zor", f"Başlangıç meridyeninde (0°) saat 12.00 iken {boylam}° {yon} boylamında yerel saat kaçtır?",
           saat, [s for s in ("10.00", "11.00", "12.00", "13.00", "14.00", "15.00", "16.00") if s != saat][:6:2])
H.liste(YERYUZU, "Zor", [
    ("Kuzey yarım kürede bulunan ülkemizde dağların güneye bakan yamaçları neden daha sıcaktır?", "Güneş ışınlarını daha dik açıyla aldıkları için", ["Denize daha uzak oldukları için", "Daha yüksek oldukları için", "Rüzgâr almadıkları için"]),
    ("Kıyı kesimlerde gece ile gündüz arasındaki sıcaklık farkının az olmasının nedeni nedir?", "Denizin ılımanlaştırıcı etkisi", ["Yükseltinin fazla olması", "Bitki örtüsünün az olması", "Ekvator'a uzak olması"]),
])
H.liste(EKONOMI, "Kolay", [
    ("Ürünlerin başka ülkelere satılmasına ne ad verilir?", "İhracat", ["İthalat", "Tüketim", "Tasarruf"]),
    ("Başka ülkelerden ürün satın alınmasına ne ad verilir?", "İthalat", ["İhracat", "Üretim", "Dağıtım"]),
    ("Kayısı üretimiyle ünlü ilimiz hangisidir?", "Malatya", ["Rize", "Edirne", "Kars"]),
    ("Fındık üretiminde öne çıkan illerimiz hangileridir?", "Ordu ve Giresun", ["Konya ve Aksaray", "Antalya ve Mersin", "Van ve Muş"]),
    ("Muz üretimiyle tanınan ilçemiz hangisidir?", "Anamur", ["Ürgüp", "Bodrum", "Safranbolu"]),
    ("Bilinçli bir tüketici alışveriş yaparken ne yapmalıdır?", "Son kullanma tarihine bakmalı ve fiş almalıdır.", ["Fiş almamalıdır.", "Ürünün etiketine hiç bakmamalıdır.", "İhtiyacından fazla almalıdır."]),
])
H.liste(EKONOMI, "Orta", [
    ("Hammaddelerin işlenerek ürüne dönüştürüldüğü ekonomik faaliyet hangisidir?", "Sanayi", ["Tarım", "Ticaret", "Turizm"]),
    ("Üretimi oluşturan faktörlerden biri hangisidir?", "Emek", ["İsraf", "Borç", "Tatil"]),
    ("GAP (Güneydoğu Anadolu Projesi) ile en çok hangi alanlarda gelişme hedeflenmiştir?", "Sulama ve enerji üretimi", ["Balıkçılık ve madencilik", "Kayak turizmi", "Çay tarımı"]),
    ("Türkiye'nin en büyük barajı hangisidir?", "Atatürk Barajı", ["Keban Barajı", "Hirfanlı Barajı", "Sarıyar Barajı"]),
    ("Atatürk Barajı hangi akarsu üzerinde kurulmuştur?", "Fırat", ["Kızılırmak", "Sakarya", "Yeşilırmak"]),
    ("Şeker pancarı üretiminde öne çıkan bölgemiz hangisidir?", "İç Anadolu Bölgesi", ["Karadeniz Bölgesi", "Akdeniz Bölgesi", "Doğu Anadolu Bölgesi"]),
    ("Turunçgil (portakal, limon) üretiminin en çok yapıldığı bölgemiz hangisidir?", "Akdeniz Bölgesi", ["Doğu Anadolu Bölgesi", "İç Anadolu Bölgesi", "Karadeniz Bölgesi"]),
    ("Haklarının ihlal edildiğini düşünen tüketici nereye başvurabilir?", "Tüketici hakem heyetine", ["Belediye parkına", "Spor kulübüne", "Kütüphaneye"]),
    ("Tarımda makine kullanımının artması neyi sağlar?", "Verimin artmasını", ["Üretimin azalmasını", "Toprağın çoraklaşmasını", "İş gücünün artmasını"]),
])
H.liste(EKONOMI, "Zor", [
    ("Bir ülkenin ihracatının ithalatından fazla olması neyi gösterir?", "Dış ticaretin ülke lehine olduğunu", ["Ülkenin hiç üretim yapmadığını", "Dış ticaretin ülke aleyhine olduğunu", "Ülkenin hiç ithalat yapmadığını"]),
    ("Rüzgâr enerjisi santrallerinin en çok Ege ve Marmara kıyılarında kurulmasının nedeni nedir?", "Bu bölgelerin sürekli ve güçlü rüzgâr alması", ["Bu bölgelerde güneşin hiç görünmemesi", "Bu bölgelerde akarsuyun olmaması", "Bu bölgelerin çok yüksek olması"]),
])
H.liste(YONETIM, "Kolay", [
    ("Türkiye Cumhuriyeti'nin ilk Cumhurbaşkanı kimdir?", "Mustafa Kemal Atatürk", ["İsmet İnönü", "Celal Bayar", "Fevzi Çakmak"]),
    ("İllerde devleti temsil eden yönetici kimdir?", "Vali", ["Muhtar", "Belediye başkanı", "Milletvekili"]),
    ("İlçelerde devleti temsil eden yönetici kimdir?", "Kaymakam", ["Vali", "Muhtar", "Milletvekili"]),
    ("Köy ve mahallelerin yöneticisi kimdir?", "Muhtar", ["Vali", "Kaymakam", "Bakan"]),
    ("Kanunları yapan, değiştiren ve kaldıran kurum hangisidir?", "TBMM", ["Belediye", "Valilik", "Muhtarlık"]),
])
H.liste(YONETIM, "Orta", [
    ("Cumhurbaşkanı kaç yıl için seçilir?", "5 yıl", ["4 yıl", "7 yıl", "3 yıl"]),
    ("Saltanat hangi tarihte kaldırılmıştır?", "1 Kasım 1922", ["29 Ekim 1923", "23 Nisan 1920", "3 Mart 1924"]),
    ("Türk kadınına milletvekili seçme ve seçilme hakkı hangi yıl verilmiştir?", "1934", ["1923", "1930", "1950"]),
    ("Türk kadınına belediye seçimlerinde seçme ve seçilme hakkı hangi yıl verilmiştir?", "1930", ["1934", "1920", "1946"]),
    ("Kanunların Anayasa'ya uygun olup olmadığını denetleyen kurum hangisidir?", "Anayasa Mahkemesi", ["Belediye Meclisi", "Sayıştay", "İl Genel Meclisi"]),
    ("Aşağıdakilerden hangisi seçimle göreve gelir?", "Belediye başkanı", ["Vali", "Kaymakam", "Okul müdürü"]),
    ("Yönetimin tek bir kişide olduğu ve babadan oğula geçtiği yönetim biçimine ne ad verilir?", "Monarşi", ["Cumhuriyet", "Demokrasi", "Meşrutiyet"]),
    ("Devletin bütçesini onaylamak hangi kurumun görevidir?", "TBMM", ["Anayasa Mahkemesi", "Belediyeler", "Valilikler"]),
])
H.liste(YONETIM, "Zor", [
    ("Valilerin seçimle değil atamayla göreve gelmesi neyi gösterir?", "Merkezî yönetimin temsilcisi olduklarını", ["Yerel yönetimin temsilcisi olduklarını", "Yargı yetkisi kullandıklarını", "Yasama yetkisi kullandıklarını"]),
    ("Cumhuriyet yönetiminin en temel özelliği hangisidir?", "Halkın kendi temsilcilerini seçmesi", ["Yönetimin babadan oğula geçmesi", "Seçim yapılmaması", "Tek kişinin her kararı vermesi"]),
])
H.liste(DUNYA, "Kolay", [
    ("Aşağıdaki ülkelerden hangisi Türkiye'nin komşusu değildir?", "Romanya", ["Bulgaristan", "Gürcistan", "İran"]),
    ("Türkiye ile en uzun kara sınırına sahip komşu ülke hangisidir?", "Suriye", ["Yunanistan", "Gürcistan", "Ermenistan"]),
    ("Türkiye'nin kaç kara komşusu vardır?", "8", ["5", "6", "10"]),
    ("Türk dilini ve kültürünü yurt dışında tanıtmak için kurulan kurum hangisidir?", "Yunus Emre Enstitüsü", ["Kızılay", "AFAD", "TÜBİTAK"]),
])
H.liste(DUNYA, "Orta", [
    ("Yurt dışındaki kalkınma ve yardım projelerini yürüten Türk kurumu hangisidir?", "TİKA (Türk İşbirliği ve Koordinasyon Ajansı)", ["TRT", "TCDD", "PTT"]),
    ("Türkiye'nin “iki devlet, tek millet” olarak tanımladığı ülke hangisidir?", "Azerbaycan", ["Gürcistan", "Bulgaristan", "Irak"]),
    ("Türkiye'nin üyesi olduğu ve merkezi İstanbul'da bulunan ekonomik örgüt hangisidir?", "Karadeniz Ekonomik İşbirliği Örgütü", ["NATO", "Avrupa Birliği", "UNESCO"]),
    ("Türkiye, İran ve Pakistan'ın kurucu üyesi olduğu ekonomik örgüt hangisidir?", "Ekonomik İşbirliği Teşkilatı (ECO)", ["NATO", "D-8", "BM"]),
    ("Türkiye'nin üyesi olduğu, gelişmekte olan 8 İslam ülkesinin ekonomik örgütü hangisidir?", "D-8", ["G-20", "NATO", "Avrupa Birliği"]),
])
H.liste(DUNYA, "Zor", [
    ("Türkiye'nin başka ülkelerde yaşanan depremlere arama kurtarma ekibi göndermesi neyin göstergesidir?", "Uluslararası yardımlaşmanın", ["Ticari rekabetin", "Askerî ittifakın", "Sınır anlaşmazlığının"]),
    ("Kuzey Kıbrıs Türk Cumhuriyeti'ni tanıyan tek ülke hangisidir?", "Türkiye", ["Yunanistan", "İngiltere", "Azerbaycan"]),
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
