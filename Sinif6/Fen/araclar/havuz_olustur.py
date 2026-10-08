"""6. sınıf Fen Bilimleri soru havuzu.

Bilgi soruları elle yazılmıştır; sürat, bileşke kuvvet ve yoğunluk soruları sayılarla üretilir.
Çalıştırınca soru_havuzu.json ve ../FenSoruUretici.html dosyalarını üretir.
"""
import json
import sys
from pathlib import Path

BURA = Path(__file__).parent
KOK = BURA.parent
sys.path.insert(0, str(KOK.parent.parent / "ortak"))
from havuz_araclari import Havuz  # noqa: E402
from sayfa_olustur import sayfa_yaz  # noqa: E402

H = Havuz(66)
rnd = H.rnd

GUNES = "Güneş Sistemi ve Tutulmalar"
SISTEM = "Vücudumuzdaki Sistemler"
KUVVET = "Kuvvet ve Hareket"
MADDE = "Madde ve Isı"
SES = "Ses ve Özellikleri"
ELEKTRIK = "Elektriğin İletimi"

H.liste(GUNES, "Kolay", [
    ("Güneş'e en yakın gezegen hangisidir?", "Merkür", ["Venüs", "Mars", "Neptün"]),
    ("Güneş Sistemi'ndeki en büyük gezegen hangisidir?", "Jüpiter", ["Satürn", "Dünya", "Uranüs"]),
    ("Belirgin halkalarıyla tanınan gezegen hangisidir?", "Satürn", ["Mars", "Merkür", "Venüs"]),
    ("Yüzeyindeki demir oksit nedeniyle “Kızıl Gezegen” olarak bilinen gezegen hangisidir?", "Mars", ["Jüpiter", "Venüs", "Neptün"]),
    ("Güneş'e en uzak gezegen hangisidir?", "Neptün", ["Uranüs", "Satürn", "Jüpiter"]),
    ("Güneş Sistemi'nde kaç gezegen vardır?", "8", ["7", "9", "10"]),
    ("Güneş Sistemi'nin merkezinde bulunan gök cismi hangisidir?", "Güneş", ["Dünya", "Ay", "Jüpiter"]),
    ("Güneş hangi gök cismi grubunda yer alır?", "Yıldız", ["Gezegen", "Uydu", "Asteroit"]),
    ("Dünya'nın doğal uydusu hangisidir?", "Ay", ["Güneş", "Mars", "Venüs"]),
    ("Güneş Sistemi'ndeki en sıcak gezegen hangisidir?", "Venüs", ["Merkür", "Mars", "Jüpiter"]),
])
H.liste(GUNES, "Orta", [
    ("Aşağıdakilerden hangisi iç gezegenlerden biri değildir?", "Jüpiter", ["Merkür", "Venüs", "Mars"]),
    ("Aşağıdakilerden hangisi dış gezegenlerden biridir?", "Uranüs", ["Dünya", "Mars", "Merkür"]),
    ("İç gezegenler ile dış gezegenleri birbirinden ayıran yapı hangisidir?", "Asteroit kuşağı", ["Samanyolu", "Atmosfer", "Ay'ın yörüngesi"]),
    ("Uydusu olmayan gezegenler hangileridir?", "Merkür ve Venüs", ["Mars ve Dünya", "Jüpiter ve Satürn", "Uranüs ve Neptün"]),
    ("İç gezegenlerin ortak özelliği hangisidir?", "Yüzeyleri kayalıktır.", ["Gaz hâlindedirler.", "Hepsinin halkası vardır.", "Güneş'e en uzak gezegenlerdir."]),
    ("Dış gezegenlerin ortak özelliği hangisidir?", "Büyük kısmı gazlardan oluşur.", ["Yüzeyleri kayalıktır.", "Hiç uyduları yoktur.", "Güneş'e en yakın gezegenlerdir."]),
    ("Gezegenler için aşağıdakilerden hangisi doğrudur?", "Kendi ışıklarını üretmezler.", ["Kendi ışıklarını üretirler.", "Hepsinin uydusu vardır.", "Güneş'in çevresinde dolanmazlar."]),
    ("Ay tutulması hangi ay evresinde gerçekleşir?", "Dolunay", ["Yeni ay", "İlk dördün", "Son dördün"]),
    ("Güneş tutulması hangi ay evresinde gerçekleşir?", "Yeni ay", ["Dolunay", "İlk dördün", "Son dördün"]),
])
H.liste(GUNES, "Zor", [
    ("Ay tutulması sırasında Güneş, Dünya ve Ay nasıl sıralanır?", "Güneş – Dünya – Ay", ["Güneş – Ay – Dünya", "Dünya – Güneş – Ay", "Ay – Güneş – Dünya"]),
    ("Güneş tutulması sırasında Güneş, Ay ve Dünya nasıl sıralanır?", "Güneş – Ay – Dünya", ["Güneş – Dünya – Ay", "Ay – Güneş – Dünya", "Dünya – Güneş – Ay"]),
    ("Güneş tutulması neden çıplak gözle izlenmemelidir?", "Güneş ışınları göze zarar verir.", ["Tutulma sırasında Güneş görünmez.", "Ay'ın gölgesi gözü üşütür.", "Tutulma gece gerçekleşir."]),
    ("Ay tutulmasında Ay'ın görünmez hâle gelmesinin nedeni nedir?", "Ay'ın Dünya'nın gölgesinde kalması", ["Güneş'in Ay'ın gölgesinde kalması", "Ay'ın kendi ışığını kaybetmesi", "Dünya'nın Ay'ın gölgesinde kalması"]),
    ("Güneş tutulması Dünya'nın neresinden gözlenebilir?", "Ay'ın gölgesinin düştüğü bölgelerden", ["Dünya'nın her yerinden", "Yalnızca gece olan bölgelerden", "Yalnızca kutuplardan"]),
])

H.liste(SISTEM, "Kolay", [
    ("Vücudumuza şekil veren, iç organları koruyan sistem hangisidir?", "Destek ve hareket sistemi", ["Sindirim sistemi", "Boşaltım sistemi", "Solunum sistemi"]),
    ("Kemiklerin birleşme yerlerine ne ad verilir?", "Eklem", ["Kas", "Kıkırdak", "Damar"]),
    ("Kafatası kemikleri arasında hangi tür eklem bulunur?", "Oynamaz eklem", ["Hareketli eklem", "Yarı oynar eklem", "Menteşe eklem"]),
    ("Dirsek ve diz hangi tür ekleme örnektir?", "Hareketli eklem", ["Oynamaz eklem", "Yarı oynar eklem", "Hiçbiri"]),
    ("Omurga kemikleri arasında hangi tür eklem bulunur?", "Yarı oynar eklem", ["Oynamaz eklem", "Hareketli eklem", "Sabit eklem"]),
    ("Kalp kaç odacıktan oluşur?", "4", ["2", "3", "6"]),
    ("Kalpten vücuda kan taşıyan damarlara ne ad verilir?", "Atardamar", ["Toplardamar", "Kılcal damar", "Lenf damarı"]),
    ("Vücuttan kalbe kan getiren damarlara ne ad verilir?", "Toplardamar", ["Atardamar", "Kılcal damar", "Akciğer atardamarı"]),
    ("Kanı süzerek idrar oluşturan organ hangisidir?", "Böbrek", ["Karaciğer", "Mide", "Akciğer"]),
    ("Solunum sisteminde gaz alışverişinin gerçekleştiği yapı hangisidir?", "Alveol (hava kesecikleri)", ["Soluk borusu", "Gırtlak", "Burun"]),
    ("Sindirimin tamamlandığı ve besinlerin kana geçtiği organ hangisidir?", "İnce bağırsak", ["Mide", "Kalın bağırsak", "Yemek borusu"]),
    ("Oksijen taşıyan kan hücresi hangisidir?", "Alyuvar", ["Akyuvar", "Kan pulcuğu", "Kan plazması"]),
])
H.liste(SISTEM, "Orta", [
    ("Vücudu mikroplara karşı savunan kan hücresi hangisidir?", "Akyuvar", ["Alyuvar", "Kan pulcuğu", "Plazma"]),
    ("Kanın pıhtılaşmasını sağlayan yapı hangisidir?", "Kan pulcukları", ["Alyuvarlar", "Akyuvarlar", "Kan plazması"]),
    ("Atardamar ile toplardamar arasında madde alışverişini sağlayan damarlar hangileridir?", "Kılcal damarlar", ["Aort damarı", "Akciğer toplardamarı", "Lenf damarları"]),
    ("Kalp – akciğer – kalp arasında gerçekleşen dolaşıma ne ad verilir?", "Küçük kan dolaşımı", ["Büyük kan dolaşımı", "Lenf dolaşımı", "Sindirim dolaşımı"]),
    ("Kalp – vücut – kalp arasında gerçekleşen dolaşıma ne ad verilir?", "Büyük kan dolaşımı", ["Küçük kan dolaşımı", "Akciğer dolaşımı", "Böbrek dolaşımı"]),
    ("Karbonhidrat (nişasta) sindirimi hangi organda başlar?", "Ağız", ["Mide", "İnce bağırsak", "Kalın bağırsak"]),
    ("Protein sindirimi hangi organda başlar?", "Mide", ["Ağız", "Yemek borusu", "Kalın bağırsak"]),
    ("Yağların küçük damlacıklara ayrılmasını sağlayan safra sıvısını üreten organ hangisidir?", "Karaciğer", ["Pankreas", "Mide", "Böbrek"]),
    ("Kalın bağırsağın temel görevi hangisidir?", "Su ve minerallerin emilmesi", ["Protein sindiriminin başlaması", "Safra üretimi", "Kanın süzülmesi"]),
    ("Kendi isteğimizle çalıştıramadığımız, mide ve bağırsak duvarında bulunan kas çeşidi hangisidir?", "Düz kas", ["Çizgili kas", "İskelet kası", "Kol kası"]),
    ("Kalp kası için aşağıdakilerden hangisi doğrudur?", "Çizgili görünümlüdür ama istemsiz çalışır.", ["İstemli çalışır.", "Düz kas grubundandır ve isteğimizle çalışır.", "Yalnızca uykuda çalışır."]),
    ("Böbreğin kanı süzen en küçük yapı birimine ne ad verilir?", "Nefron", ["Alveol", "Nöron", "Bronşçuk"]),
    ("Oluşan idrarın biriktirildiği organ hangisidir?", "İdrar kesesi", ["Böbrek", "Üreter", "Karaciğer"]),
    ("Kırmızı kemik iliğinin görevi hangisidir?", "Kan hücrelerini üretmek", ["Safra üretmek", "Besinleri sindirmek", "Kanı süzmek"]),
    ("Yemek borusunda hangi tür sindirim gerçekleşir?", "Sindirim gerçekleşmez, besin mideye iletilir.", ["Protein sindirimi", "Yağ sindirimi", "Karbonhidrat sindirimi tamamlanır."]),
])
H.liste(SISTEM, "Zor", [
    ("Soluk alma sırasında diyafram kasında ne olur?", "Kasılır ve aşağı doğru iner.", ["Gevşer ve yukarı doğru çıkar.", "Hiç hareket etmez.", "Gevşer ve aşağı iner."]),
    ("Soluk verme sırasında göğüs boşluğunun hacmi nasıl değişir?", "Azalır.", ["Artar.", "Değişmez.", "Önce artar sonra artmaya devam eder."]),
    ("Solunum yolunun doğru sıralaması hangisidir?", "Burun – soluk borusu – bronş – bronşçuk – alveol", ["Burun – bronş – soluk borusu – alveol – bronşçuk", "Alveol – bronşçuk – bronş – burun – soluk borusu", "Burun – alveol – bronş – soluk borusu – bronşçuk"]),
    ("Genel verici olarak bilinen kan grubu hangisidir?", "0 Rh(−)", ["AB Rh(+)", "A Rh(+)", "B Rh(−)"]),
    ("Genel alıcı olarak bilinen kan grubu hangisidir?", "AB Rh(+)", ["0 Rh(−)", "A Rh(−)", "B Rh(+)"]),
    ("Aşağıdakilerden hangisi boşaltım görevi de yapan bir organ değildir?", "Mide", ["Deri", "Akciğer", "Böbrek"]),
    ("Akciğerlerin boşaltıma katkısı hangisidir?", "Karbondioksit ve su buharını vücuttan atar.", ["İdrar üretir.", "Safra salgılar.", "Ter üretir."]),
    ("Pankreasın sindirime katkısı hangisidir?", "İnce bağırsağa sindirim enzimleri gönderir.", ["Safra üretir.", "Su emilimini yapar.", "Besinleri mideye iletir."]),
])

# Kuvvet ve hareket: sayılarla
for f1, f2 in [(10, 6), (15, 15), (20, 8), (12, 5), (30, 12), (7, 9), (25, 10)]:
    H.ekle(KUVVET, "Kolay", f"Bir cisme aynı yönde {f1} N ve {f2} N büyüklüğünde iki kuvvet uygulanıyor. Bileşke kuvvet kaç N'dir?",
           f"{f1 + f2} N", [f"{abs(f1 - f2)} N" if f1 != f2 else "1 N", f"{f1 * f2} N", f"{max(f1, f2)} N"])
for f1, f2 in [(10, 6), (20, 8), (12, 5), (30, 12), (9, 16), (25, 10)]:
    H.ekle(KUVVET, "Orta", f"Bir cisme zıt yönlerde {f1} N ve {f2} N büyüklüğünde iki kuvvet uygulanıyor. Bileşke kuvvet kaç N'dir?",
           f"{abs(f1 - f2)} N", [f"{f1 + f2} N", f"{min(f1, f2)} N", f"{max(f1, f2)} N"])
for yol, sure in [(100, 20), (60, 12), (150, 30), (240, 40), (90, 15), (360, 60)]:
    H.ekle(KUVVET, "Orta", f"{yol} m yolu {sure} saniyede alan bir koşucunun sürati kaç m/s'dir?",
           f"{yol // sure} m/s", [f"{yol * sure} m/s", f"{yol - sure} m/s", f"{yol // sure + 2} m/s"])
for surat, sure in [(60, 3), (80, 2), (90, 4), (50, 5), (70, 3)]:
    H.ekle(KUVVET, "Zor", f"Sürati {surat} km/h olan bir otomobil {sure} saatte kaç km yol alır?",
           f"{surat * sure} km", [f"{surat + sure} km", f"{surat // sure} km" if surat % sure == 0 else f"{surat * sure + 10} km", f"{surat * (sure + 1)} km"])
H.liste(KUVVET, "Kolay", [
    ("Kuvvetin birimi hangisidir?", "Newton (N)", ["Metre (m)", "Kilogram (kg)", "Saniye (s)"]),
    ("Kuvvet hangi araçla ölçülür?", "Dinamometre", ["Termometre", "Barometre", "Ampermetre"]),
    ("Birim zamanda alınan yola ne ad verilir?", "Sürat", ["Kuvvet", "Kütle", "Enerji"]),
    ("Sürat nasıl hesaplanır?", "Alınan yol ÷ geçen süre", ["Geçen süre ÷ alınan yol", "Alınan yol · geçen süre", "Alınan yol + geçen süre"]),
])
H.liste(KUVVET, "Orta", [
    ("Bir cisme etki eden kuvvetlerin bileşkesi sıfır ise bu kuvvetlere ne ad verilir?", "Dengelenmiş kuvvetler", ["Dengelenmemiş kuvvetler", "Sürtünme kuvvetleri", "Kütle çekim kuvvetleri"]),
    ("Duran bir cisme dengelenmiş kuvvetler etki ederse cisim ne yapar?", "Durmaya devam eder.", ["Hızlanır.", "Yön değiştirir.", "Yavaşlar."]),
    ("Zıt yönlü iki kuvvetin bileşkesinin yönü nasıl belirlenir?", "Büyük olan kuvvetin yönündedir.", ["Küçük olan kuvvetin yönündedir.", "Her zaman sağa doğrudur.", "Yönü yoktur."]),
])
H.liste(KUVVET, "Zor", [
    ("Halat çekme oyununda iki takım eşit kuvvetle çekerse ne olur?", "Halat hareket etmez.", ["Halat sağa hareket eder.", "Halat sola hareket eder.", "Halat kopar."]),
    ("Sürat–zaman grafiğinde yatay bir çizgi neyi gösterir?", "Cismin sabit süratle hareket ettiğini", ["Cismin durduğunu", "Cismin hızlandığını", "Cismin yavaşladığını"]),
])

# Madde ve ısı
for m, v in [(20, 5), (60, 20), (48, 12), (90, 30), (27, 9), (100, 50)]:
    H.ekle(MADDE, "Orta", f"Kütlesi {m} g, hacmi {v} cm³ olan bir maddenin yoğunluğu kaç g/cm³'tür?",
           f"{m // v} g/cm³", [f"{m * v} g/cm³", f"{m - v} g/cm³", f"{m // v + 1} g/cm³"])
for d, v in [(2, 15), (3, 10), (5, 8), (4, 6)]:
    H.ekle(MADDE, "Zor", f"Yoğunluğu {d} g/cm³ olan bir maddenin {v} cm³'ünün kütlesi kaç g'dır?",
           f"{d * v} g", [f"{d + v} g", f"{v // d if v % d == 0 else v + d * 2} g", f"{d * v + v} g"])
H.liste(MADDE, "Kolay", [
    ("Sıcaklığı ölçmek için kullanılan araç hangisidir?", "Termometre", ["Dinamometre", "Barometre", "Cetvel"]),
    ("Isı hangi yönde akar?", "Sıcak maddeden soğuk maddeye", ["Soğuk maddeden sıcak maddeye", "Her iki yöne eşit", "Isı hiç akmaz"]),
    ("Aşağıdakilerden hangisi ısıyı iyi ileten bir maddedir?", "Bakır", ["Tahta", "Plastik", "Strafor"]),
    ("Aşağıdakilerden hangisi ısı yalıtımında kullanılır?", "Strafor (köpük)", ["Demir", "Alüminyum", "Bakır"]),
    ("Aşağıdakilerden hangisi gaz yakıttır?", "Doğal gaz", ["Kömür", "Odun", "Benzin"]),
    ("Aşağıdakilerden hangisi katı yakıttır?", "Kömür", ["Benzin", "Doğal gaz", "Mazot"]),
    ("Aşağıdakilerden hangisi sıvı yakıttır?", "Benzin", ["Odun", "Doğal gaz", "Kömür"]),
])
H.liste(MADDE, "Orta", [
    ("Isı ile sıcaklık arasındaki fark için hangisi doğrudur?", "Isı bir enerji türüdür, sıcaklık ise ölçülebilen bir büyüklüktür.", ["İkisi aynı şeydir.", "Sıcaklık bir enerji türüdür.", "Isı termometre ile ölçülür."]),
    ("Sıcaklık birimi olarak günlük hayatta en çok kullanılan birim hangisidir?", "Santigrat derece (°C)", ["Joule", "Newton", "Kilogram"]),
    ("Kışın evlerin dış duvarlarına yalıtım malzemesi kaplanmasının amacı nedir?", "Isı kaybını azaltmak", ["Evi daha ağır yapmak", "Elektrik iletmek", "Sesi artırmak"]),
    ("Sobalı evlerde karbonmonoksit zehirlenmesini önlemek için ne yapılmalıdır?", "Baca düzenli temizlenmeli ve oda havalandırılmalıdır.", ["Sobanın kapağı açık bırakılıp uyunmalıdır.", "Odanın pencereleri hiç açılmamalıdır.", "Sobaya ıslak odun konulmalıdır."]),
    ("Yoğunluk nasıl hesaplanır?", "Kütle ÷ hacim", ["Hacim ÷ kütle", "Kütle · hacim", "Kütle + hacim"]),
])
H.liste(MADDE, "Zor", [
    ("Su dolu bir kaba atılan cisim batıyorsa bu cisim için ne söylenebilir?", "Yoğunluğu sudan büyüktür.", ["Yoğunluğu sudan küçüktür.", "Yoğunluğu suya eşittir.", "Kütlesi yoktur."]),
    ("Zeytinyağı suyun üzerinde kalır. Bunun nedeni nedir?", "Zeytinyağının yoğunluğu sudan küçüktür.", ["Zeytinyağının yoğunluğu sudan büyüktür.", "Zeytinyağı daha sıcaktır.", "Zeytinyağının kütlesi yoktur."]),
])

H.liste(SES, "Kolay", [
    ("Ses nasıl oluşur?", "Maddelerin titreşmesiyle", ["Işığın kırılmasıyla", "Maddelerin erimesiyle", "Isının akmasıyla"]),
    ("Ses hangi ortamda yayılamaz?", "Boşlukta", ["Suda", "Havada", "Demirde"]),
    ("Sesin bir engele çarpıp geri dönmesine ne ad verilir?", "Sesin yansıması", ["Sesin soğurulması", "Sesin kırılması", "Sesin erimesi"]),
    ("Yankı oluşmasının nedeni nedir?", "Sesin yansıması", ["Sesin boşlukta yayılması", "Sesin ışığa dönüşmesi", "Sesin donması"]),
])
H.liste(SES, "Orta", [
    ("Ses genellikle hangi ortamda en hızlı yayılır?", "Katı", ["Sıvı", "Gaz", "Boşluk"]),
    ("Aşağıdakilerden hangisi sesi en iyi soğurur?", "Sünger", ["Cam", "Mermer", "Demir"]),
    ("Konser salonlarının duvarlarının yumuşak ve gözenekli malzemelerle kaplanmasının amacı nedir?", "Sesin yansımasını azaltmak", ["Sesi daha çok yansıtmak", "Salonu ısıtmak", "Elektriği iletmek"]),
    ("Uzay boşluğunda iki astronotun telsiz olmadan konuşamamasının nedeni nedir?", "Sesin yayılması için maddesel ortam gerekir.", ["Uzay çok soğuktur.", "Uzayda ışık yoktur.", "Ses boşlukta çok hızlı yayılır."]),
])
H.liste(SES, "Zor", [
    ("Ses yalıtımı için duvarlar arasına hangisi konulursa en uygun olur?", "Gözenekli köpük malzeme", ["Cam levha", "Metal levha", "Mermer plaka"]),
    ("Kulağını demiryolu rayına dayayan kişi treni neden daha erken duyar?", "Ses katılarda havaya göre daha hızlı yayılır.", ["Ses katılarda daha yavaş yayılır.", "Rayda ses oluşmaz.", "Hava sesi hiç iletmez."]),
])

H.liste(ELEKTRIK, "Kolay", [
    ("Aşağıdakilerden hangisi elektriği iyi iletir?", "Bakır tel", ["Plastik cetvel", "Tahta kalem", "Lastik silgi"]),
    ("Aşağıdakilerden hangisi elektriği iletmez (yalıtkandır)?", "Plastik", ["Demir", "Alüminyum", "Bakır"]),
    ("Elektrik kablolarının dış kısmı neden plastikle kaplanır?", "Plastik yalıtkan olduğu için elektrik çarpmasını önler.", ["Plastik elektriği iyi iletir.", "Kablo daha ağır olsun diye.", "Kablo daha çok ısınsın diye."]),
    ("Direncin birimi hangisidir?", "Ohm (Ω)", ["Newton (N)", "Volt (V)", "Joule (J)"]),
])
H.liste(ELEKTRIK, "Orta", [
    ("Kurşun kalemin ucu (grafit) için hangisi doğrudur?", "Elektriği iletir.", ["Elektriği iletmez.", "Isıyı hiç iletmez.", "Manyetiktir."]),
    ("Bir devrede iletken telin uzunluğu artırılırsa ampulün parlaklığı nasıl değişir?", "Azalır.", ["Artar.", "Değişmez.", "Ampul patlar."]),
    ("Bir devrede iletken telin kesit alanı (kalınlığı) artırılırsa direnç nasıl değişir?", "Azalır.", ["Artar.", "Değişmez.", "Sıfır olur."]),
    ("İletken bir telin elektrik akımına karşı gösterdiği zorluğa ne ad verilir?", "Direnç", ["Gerilim", "Kuvvet", "Sürat"]),
])
H.liste(ELEKTRIK, "Zor", [
    ("Aynı maddeden yapılmış tellerden hangisinin direnci en büyüktür?", "Uzun ve ince tel", ["Kısa ve kalın tel", "Kısa ve ince tel", "Uzun ve kalın tel"]),
    ("Islak elle elektrikli aletlere dokunmak neden tehlikelidir?", "Su elektriği iletebilir ve çarpılma riski oluşur.", ["Su elektriği tamamen keser.", "Islak el aleti bozar ama tehlikesi yoktur.", "Su yalıtkan olduğu için tehlike yoktur."]),
])

for i, s in enumerate(H.sorular, start=1):
    s["id"] = i
(BURA / "soru_havuzu.json").write_text(json.dumps(H.sorular, ensure_ascii=False, indent=1), encoding="utf-8")
LOGO = """<svg width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
      <circle class="kare edge" cx="29" cy="29" r="12"></circle>
      <ellipse class="cizgi" cx="29" cy="29" rx="25" ry="9" fill="none"></ellipse>
      <circle class="asal edge" cx="52" cy="27" r="4"></circle>
    </svg>"""
sayfa_yaz(H.sorular, KOK / "FenSoruUretici.html", "Fen Bilimleri 6 Soru Üretici", "Fen Bilimleri 6",
          "6. sınıf Fen Bilimleri", LOGO, sys.argv[1] if len(sys.argv) > 1 else None)
H.ozet()
