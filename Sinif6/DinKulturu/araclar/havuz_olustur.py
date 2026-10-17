"""6. sınıf Din Kültürü ve Ahlak Bilgisi soru havuzu.

Çalıştırınca soru_havuzu.json ve ../DinKulturuSoruUretici.html dosyalarını üretir.
"""
import json
import sys
from pathlib import Path

BURA = Path(__file__).parent
KOK = BURA.parent
sys.path.insert(0, str(KOK.parent.parent / "ortak"))
from havuz_araclari import Havuz  # noqa: E402
from sayfa_olustur import sayfa_yaz  # noqa: E402

H = Havuz(571)

IMAN = "Peygamber ve İlahi Kitaplara İman"
NAMAZ = "Namaz"
ZARARLI = "Zararlı Alışkanlıklar"
HZ = "Hz. Muhammed'in Hayatı"
DEGER = "Temel Değerlerimiz"

YONELME = {"Hz. Musa": "Hz. Musa'ya", "Hz. Davud": "Hz. Davud'a", "Hz. İsa": "Hz. İsa'ya", "Hz. Muhammed": "Hz. Muhammed'e"}
KITAPLAR = [("Tevrat", "Hz. Musa"), ("Zebur", "Hz. Davud"), ("İncil", "Hz. İsa"), ("Kur'an-ı Kerim", "Hz. Muhammed")]
for kitap, peygamber in KITAPLAR:
    H.ekle(IMAN, "Kolay", f"{kitap} hangi peygambere indirilmiştir?", peygamber, [p for k, p in KITAPLAR if k != kitap])
    H.ekle(IMAN, "Kolay", f"{YONELME[peygamber]} indirilen ilahi kitap hangisidir?",
           kitap, [k for k, p in KITAPLAR if k != kitap])
SIFATLAR = [("Sıdk", "doğru sözlü olmak"), ("Emanet", "güvenilir olmak"), ("Fetanet", "akıllı ve zeki olmak"),
            ("İsmet", "günah işlememek"), ("Tebliğ", "Allah'ın emirlerini insanlara eksiksiz iletmek")]
for ad, anlam in SIFATLAR:
    H.ekle(IMAN, "Orta", f"Peygamberlerin “{anlam}” özelliğine ne ad verilir?", ad, [a for a, _ in SIFATLAR if a != ad][:4])
H.liste(IMAN, "Kolay", [
    ("İlk peygamber kimdir?", "Hz. Âdem", ["Hz. Nuh", "Hz. İbrahim", "Hz. Musa"]),
    ("Son peygamber kimdir?", "Hz. Muhammed", ["Hz. İsa", "Hz. Musa", "Hz. Âdem"]),
    ("Allah'ın emirlerini peygamberlere ileten melek hangisidir?", "Cebrail", ["Mikail", "İsrafil", "Azrail"]),
    ("Kur'an-ı Kerim'de adı geçen peygamber sayısı kaçtır?", "25", ["10", "40", "99"]),
])
H.liste(IMAN, "Orta", [
    ("Bazı peygamberlere indirilen küçük kitapçıklara ne ad verilir?", "Suhuf", ["Tefsir", "Hadis", "Siyer"]),
    ("Allah'ın peygamberlerine bildirdiği emir ve yasaklara ne ad verilir?", "Vahiy", ["İlham", "Rüya", "Kıssa"]),
    ("Peygamberlerin gönderilme amacı hangisidir?", "İnsanlara doğru yolu göstermek", ["Zengin olmak", "Ülkeler fethetmek", "Yalnızca mucize göstermek"]),
])
H.liste(IMAN, "Zor", [
    ("Peygamberlerin insanlar arasından seçilmesinin nedeni hangisidir?", "İnsanlara örnek olabilmeleri", ["Melek olmamaları için", "Hiç yorulmamaları için", "Yalnızca savaşmaları için"]),
    ("Peygamberlerin tebliğ sıfatına sahip olması ne anlama gelir?", "Vahyi eksiksiz olarak insanlara iletmeleri", ["Günah işlememeleri", "Çok zeki olmaları", "Her zaman doğru söylemeleri"]),
])

H.liste(NAMAZ, "Kolay", [
    ("Günde kaç vakit namaz kılınır?", "5", ["3", "4", "7"]),
    ("Namaza çağrı için okunan söze ne ad verilir?", "Ezan", ["Kamet", "Tekbir", "Dua"]),
    ("Namaz kılarken yönelinen yere ne ad verilir?", "Kıble", ["Mihrap", "Minare", "Kürsü"]),
    ("Aşağıdakilerden hangisi beş vakit namazdan biri değildir?", "Teravih", ["Sabah", "İkindi", "Yatsı"]),
    ("Haftada bir kez, cemaatle kılınan namaz hangisidir?", "Cuma namazı", ["Teravih namazı", "Bayram namazı", "Cenaze namazı"]),
])
H.liste(NAMAZ, "Orta", [
    ("Namazın kaç farzı vardır?", "12", ["6", "4", "10"]),
    ("Abdestin kaç farzı vardır?", "4", ["6", "2", "12"]),
    ("Aşağıdakilerden hangisi namazın dışındaki farzlardan (şartlarından) biridir?", "Kıbleye yönelmek", ["Rükû", "Secde", "Kıyam"]),
    ("Aşağıdakilerden hangisi namazın içindeki farzlardan (rükünlerinden) biridir?", "Secde", ["Abdest almak", "Vakit", "Niyet"]),
    ("Namaza “Allahu Ekber” diyerek başlamaya ne ad verilir?", "İftitah tekbiri", ["Kıraat", "Rükû", "Selam"]),
    ("Namazda ayakta durmaya ne ad verilir?", "Kıyam", ["Kıraat", "Kade", "Secde"]),
    ("Namazda Kur'an'dan ayet ya da sure okumaya ne ad verilir?", "Kıraat", ["Kıyam", "Rükû", "Tekbir"]),
])
H.liste(NAMAZ, "Zor", [
    ("Aşağıdakilerden hangisi abdestin farzlarından biri değildir?", "Ağza su vermek", ["Yüzü yıkamak", "Kolları dirseklerle birlikte yıkamak", "Ayakları topuklarla birlikte yıkamak"]),
    ("Namazın son oturuşuna ne ad verilir?", "Ka'de-i ahîre", ["Kıyam", "Rükû", "İftitah tekbiri"]),
])

H.liste(ZARARLI, "Kolay", [
    ("Aşağıdakilerden hangisi zararlı bir alışkanlıktır?", "Sigara içmek", ["Kitap okumak", "Spor yapmak", "Erken uyumak"]),
    ("İhtiyaçtan fazla tüketerek nimetleri boşa harcamaya ne ad verilir?", "İsraf", ["Tasarruf", "Cömertlik", "Kanaat"]),
])
H.liste(ZARARLI, "Orta", [
    ("Zararlı alışkanlıklardan korunmanın en etkili yolu hangisidir?", "Hiç başlamamak ve olumsuz arkadaş ortamından uzak durmak", ["Bir kez denemek", "Arkadaş baskısına uymak", "Merak edilen her şeyi denemek"]),
    ("Kumar oynamak neden zararlıdır?", "Kişinin emeğini ve aile huzurunu kaybetmesine neden olur.", ["Sağlığı güçlendirir.", "Zenginliği garanti eder.", "Aile bağlarını kuvvetlendirir."]),
    ("Teknoloji bağımlılığını önlemek için ne yapılmalıdır?", "Ekran süresi sınırlandırılmalı ve farklı etkinliklere zaman ayrılmalıdır.", ["Bütün gün telefonla oynanmalıdır.", "Uyku saatleri azaltılmalıdır.", "Arkadaşlarla görüşülmemelidir."]),
])
H.liste(ZARARLI, "Zor", [
    ("Dinimizin bedeni korumayı emretmesinin amacı nedir?", "Sağlığın Allah'ın bir emaneti olması", ["Kişinin yalnızca güçlü görünmesi", "Spor yarışmalarını kazanmak", "Başkalarından üstün olmak"]),
])

H.liste(HZ, "Kolay", [
    ("Hz. Muhammed hangi şehirde doğmuştur?", "Mekke", ["Medine", "Kudüs", "Taif"]),
    ("Hz. Muhammed'in annesinin adı nedir?", "Âmine", ["Halime", "Hatice", "Fatıma"]),
    ("Hz. Muhammed'in babasının adı nedir?", "Abdullah", ["Ebu Talip", "Abdülmuttalib", "Hamza"]),
    ("Hz. Muhammed'e verilen “güvenilir kişi” anlamındaki lakap hangisidir?", "el-Emin", ["el-Faruk", "es-Sıddık", "Seyfullah"]),
    ("İlk vahiy hangi mağarada gelmiştir?", "Hira", ["Sevr", "Uhud", "Kuba"]),
    ("İlk Müslüman olan kişi kimdir?", "Hz. Hatice", ["Hz. Ömer", "Hz. Osman", "Hz. Hamza"]),
])
H.liste(HZ, "Orta", [
    ("Hz. Muhammed hangi yılda doğmuştur?", "571", ["610", "622", "632"]),
    ("İlk vahiy hangi yılda gelmiştir?", "610", ["571", "622", "630"]),
    ("Mekke'den Medine'ye hicret hangi yılda gerçekleşmiştir?", "622", ["610", "571", "632"]),
    ("Babası ve annesi vefat ettikten sonra Hz. Muhammed'i yanına alan dedesi kimdir?", "Abdülmuttalib", ["Ebu Talip", "Abdullah", "Ebu Bekir"]),
    ("Hz. Muhammed'in süt annesi kimdir?", "Halime", ["Âmine", "Hatice", "Ümmü Eymen"]),
    ("İlk inen ayetler hangi surededir?", "Alak", ["Fatiha", "Bakara", "İhlas"]),
])
H.liste(HZ, "Zor", [
    ("Mekke'nin fethi hangi yılda gerçekleşmiştir?", "630", ["622", "610", "571"]),
    ("Hz. Muhammed'in vefat ettiği yıl hangisidir?", "632", ["630", "622", "610"]),
    ("Hz. Muhammed'in son haccında yaptığı ve insan haklarını vurgulayan konuşmaya ne ad verilir?", "Veda Hutbesi", ["Hilfu'l-Fudul", "Medine Sözleşmesi", "Akabe Biatı"]),
    ("Gençliğinde haksızlığa uğrayanlara yardım etmek amacıyla katıldığı topluluk hangisidir?", "Hilfu'l-Fudul (Erdemliler Topluluğu)", ["Ensar", "Muhacirler", "Ehl-i Suffe"]),
])

H.liste(DEGER, "Kolay", [
    ("Herkese hakkını vermeye ne ad verilir?", "Adalet", ["Kibir", "Cimrilik", "İsraf"]),
    ("Aşağıdakilerden hangisi merhametli bir davranıştır?", "Sokak hayvanlarına su ve yiyecek bırakmak", ["Arkadaşıyla alay etmek", "Sırayı bozmak", "Çevreyi kirletmek"]),
    ("Sözünde durmak hangi değerle ilgilidir?", "Güvenilirlik", ["Bencillik", "Tembellik", "Kıskançlık"]),
])
H.liste(DEGER, "Orta", [
    ("Komşumuzun ihtiyacı olduğunda yardım etmemiz hangi değere örnektir?", "Yardımlaşma", ["İsraf", "Kibir", "Haset"]),
    ("Sınavda kopya çekmemek hangi değere örnektir?", "Dürüstlük", ["Cimrilik", "Kıskançlık", "Tembellik"]),
])

# ---------------- EK SORULAR (2. sürüm) ----------------
PEYGAMBER_KISSA = [
    ("Hz. Nuh", "Büyük tufan sırasında inananlarla birlikte gemiye binen peygamber"),
    ("Hz. İbrahim", "Kâbe'yi oğlu Hz. İsmail ile birlikte inşa eden peygamber"),
    ("Hz. Musa", "Firavun'a karşı mücadele eden ve İsrailoğullarını Mısır'dan çıkaran peygamber"),
    ("Hz. Yusuf", "Kardeşleri tarafından kuyuya atılan, sonra Mısır'da yönetici olan peygamber"),
    ("Hz. Yunus", "Balığın karnında kalıp Allah'a dua eden peygamber"),
    ("Hz. Eyyüp", "Hastalıklar karşısında gösterdiği sabırla örnek olan peygamber"),
    ("Hz. Süleyman", "Hayvanların dilinden anlamasıyla bilinen peygamber"),
    ("Hz. İsa", "Babasız dünyaya gelen peygamber"),
]
for ad, tarif in PEYGAMBER_KISSA:
    H.ekle(IMAN, "Orta", f"{tarif} kimdir?", ad, [a for a, _ in PEYGAMBER_KISSA if a != ad][:7:2])
H.liste(IMAN, "Kolay", [
    ("İman esasları kaç tanedir?", "6", ["4", "5", "8"]),
    ("Aşağıdakilerden hangisi iman esaslarından biridir?", "Peygamberlere iman", ["Namaz kılmak", "Oruç tutmak", "Zekât vermek"]),
    ("Kur'an-ı Kerim kaç sureden oluşur?", "114", ["99", "120", "6236"]),
    ("Kur'an-ı Kerim'in ilk suresi hangisidir?", "Fatiha", ["Bakara", "Nas", "İhlas"]),
    ("Kur'an-ı Kerim'in son suresi hangisidir?", "Nas", ["Fatiha", "Felak", "Bakara"]),
    ("Kur'an-ı Kerim'in en uzun suresi hangisidir?", "Bakara", ["Fatiha", "Yasin", "Kevser"]),
    ("Kur'an-ı Kerim hangi dilde indirilmiştir?", "Arapça", ["Farsça", "İbranice", "Süryanice"]),
    ("Kur'an-ı Kerim'i ezberleyen kişiye ne ad verilir?", "Hafız", ["İmam", "Müezzin", "Kadı"]),
])
H.liste(IMAN, "Orta", [
    ("Peygamberlerin, Allah'ın izniyle gösterdikleri olağanüstü olaylara ne ad verilir?", "Mucize", ["Keramet", "Vahiy", "Kıssa"]),
    ("Hz. Muhammed'in en büyük mucizesi hangisidir?", "Kur'an-ı Kerim", ["Hicret", "Miraç", "Ayın ikiye bölünmesi"]),
    ("Kur'an-ı Kerim'in indirilmeye başlandığı geceye ne ad verilir?", "Kadir Gecesi", ["Miraç Kandili", "Regaib Kandili", "Berat Kandili"]),
    ("Kur'an-ı Kerim yaklaşık kaç yılda indirilmiştir?", "23 yılda", ["5 yılda", "40 yılda", "1 yılda"]),
    ("Kur'an-ı Kerim hangi halife döneminde kitap hâline getirilmiştir?", "Hz. Ebubekir", ["Hz. Osman", "Hz. Ali", "Hz. Ömer"]),
    ("Kur'an-ı Kerim hangi halife döneminde çoğaltılarak farklı şehirlere gönderilmiştir?", "Hz. Osman", ["Hz. Ebubekir", "Hz. Ali", "Hz. Ömer"]),
    ("Kitap hâline getirilmiş Kur'an-ı Kerim'e ne ad verilir?", "Mushaf", ["Suhuf", "Tefsir", "Meal"]),
    ("Kur'an-ı Kerim'in başka bir dile çevrilmiş anlamına ne ad verilir?", "Meal", ["Tefsir", "Hadis", "Siyer"]),
])
H.liste(IMAN, "Zor", [
    ("Ülü'l-azm (azim sahibi) peygamberler arasında hangisi yer almaz?", "Hz. Yusuf", ["Hz. Nuh", "Hz. İbrahim", "Hz. Musa"]),
    ("Kur'an-ı Kerim'in ayetlerini açıklayan bilime ne ad verilir?", "Tefsir", ["Siyer", "Fıkıh", "Meal"]),
])
H.liste(NAMAZ, "Kolay", [
    ("Ezan okuyan görevliye ne ad verilir?", "Müezzin", ["İmam", "Hatip", "Vaiz"]),
    ("Cemaate namaz kıldıran görevliye ne ad verilir?", "İmam", ["Müezzin", "Kayyum", "Hafız"]),
    ("Camide imamın namaz kıldırırken durduğu yere ne ad verilir?", "Mihrap", ["Minber", "Minare", "Kürsü"]),
    ("Cuma ve bayram hutbelerinin okunduğu basamaklı yere ne ad verilir?", "Minber", ["Mihrap", "Kürsü", "Şadırvan"]),
    ("Ezanın okunduğu, caminin yüksek kulesine ne ad verilir?", "Minare", ["Kubbe", "Mihrap", "Minber"]),
    ("Beş vakit namazın doğru sıralaması hangisidir?", "Sabah – öğle – ikindi – akşam – yatsı", ["Sabah – ikindi – öğle – yatsı – akşam", "Öğle – sabah – akşam – ikindi – yatsı", "Yatsı – akşam – ikindi – öğle – sabah"]),
    ("Ramazan ayında yatsı namazından sonra kılınan namaz hangisidir?", "Teravih namazı", ["Cuma namazı", "Bayram namazı", "Cenaze namazı"]),
])
H.liste(NAMAZ, "Orta", [
    ("Sabah namazı kaç rekâttır?", "2 rekât sünnet, 2 rekât farz", ["4 rekât sünnet, 4 rekât farz", "3 rekât farz, 2 rekât sünnet", "2 rekât farz"]),
    ("Akşam namazının farzı kaç rekâttır?", "3", ["2", "4", "5"]),
    ("İkindi namazı kaç rekâttır?", "4 rekât sünnet, 4 rekât farz", ["2 rekât sünnet, 2 rekât farz", "3 rekât farz, 2 rekât sünnet", "4 rekât farz, 2 rekât sünnet"]),
    ("Yatsı namazından sonra kılınan 3 rekâtlık vacip namaz hangisidir?", "Vitir namazı", ["Teravih namazı", "Kuşluk namazı", "Teheccüd namazı"]),
    ("Farz namazlardan hemen önce okunan, namazın başladığını bildiren söze ne ad verilir?", "Kamet", ["Ezan", "Tekbir", "Salavat"]),
    ("Su bulunamadığında ya da kullanılamadığında temiz toprakla alınan abdeste ne ad verilir?", "Teyemmüm", ["Gusül", "Mesh", "Kaza"]),
    ("Vaktinde kılınamayan farz namazın daha sonra kılınmasına ne ad verilir?", "Kaza namazı", ["Teravih", "Vitir", "Nafile"]),
    ("Cenaze namazının diğer namazlardan farkı nedir?", "Ayakta kılınır, rükû ve secdesi yoktur.", ["Yalnızca oturarak kılınır.", "Sadece secdeden oluşur.", "Günde beş kez kılınır."]),
    ("Bayram namazları ne zaman kılınır?", "Ramazan ve Kurban Bayramı'nın ilk günü sabah", ["Her cuma öğle vakti", "Her gece yatsıdan sonra", "Ramazan'ın her gecesi"]),
])
H.liste(NAMAZ, "Zor", [
    ("Namazın insana kazandırdıkları arasında hangisi yer almaz?", "Tembellik", ["Düzen ve disiplin", "Temizlik alışkanlığı", "Allah'ı anma"]),
    ("Cuma namazının kılınma vakti hangisidir?", "Öğle namazı vakti", ["Sabah namazı vakti", "Akşam namazı vakti", "Yatsı namazı vakti"]),
])
H.liste(ZARARLI, "Kolay", [
    ("Sigara içilen ortamda bulunup dumanı solumak zorunda kalan kişiye ne ad verilir?", "Pasif içici", ["Aktif sporcu", "Bağımlı", "Gönüllü"]),
    ("Bağımlılıkla mücadele eden ve 1920'de kurulan kuruluşumuz hangisidir?", "Yeşilay", ["Kızılay", "AFAD", "TEMA"]),
    ("Aşağıdakilerden hangisi sağlıklı bir alışkanlıktır?", "Düzenli spor yapmak", ["Geç saate kadar ekrana bakmak", "Sigara içmek", "Sürekli abur cubur yemek"]),
    ("Kişinin bırakmakta zorlandığı, kendisine zarar veren alışkanlığa ne ad verilir?", "Bağımlılık", ["Hobi", "Yetenek", "Erdem"]),
])
H.liste(ZARARLI, "Orta", [
    ("Sigarayı bırakmak isteyenlerin arayabileceği danışma hattı hangisidir?", "ALO 171", ["112", "155", "110"]),
    ("Uzun süre ekran başında kalmanın zararlarından biri hangisidir?", "Göz yorgunluğu ve duruş bozukluğu", ["Kasların güçlenmesi", "Uykunun düzelmesi", "Görmenin artması"]),
    ("Arkadaşı sigara teklif eden bir öğrencinin yapması gereken en doğru davranış hangisidir?", "Kararlı bir şekilde “hayır” demek", ["Bir kez denemek", "Arkadaşı kırılmasın diye kabul etmek", "Gizlice denemek"]),
    ("Peygamberimizin “Zarar vermek de zarara zararla karşılık vermek de yoktur.” sözü neyi öğütler?", "Kendimize ve başkalarına zarar vermemeyi", ["Zararlı alışkanlıkları denemeyi", "İntikam almayı", "Kuralları çiğnemeyi"]),
    ("Alkollü içkiler insanın en çok hangi yönüne zarar verir?", "Aklına ve sağlığına", ["Boyuna", "Saçlarına", "Ayakkabısına"]),
])
H.liste(ZARARLI, "Zor", [
    ("Dinimizin korunmasını istediği beş temel değer hangisinde doğru verilmiştir?", "Can, akıl, nesil, mal, din", ["Para, ün, makam, güç, şöhret", "Ev, araba, telefon, giysi, oyuncak", "Spor, müzik, sinema, tiyatro, resim"]),
    ("Dijital bağımlılıktan korunmak için hangisi etkili bir yöntemdir?", "Günlük ekran süresi belirleyip açık hava etkinlikleri yapmak", ["Telefonu yatağa götürmek", "Yemekte sürekli tablet kullanmak", "Ödevleri ertelemek"]),
])
H.liste(HZ, "Kolay", [
    ("Hz. Muhammed'in doğduğu yıl yaşanan ve bu yıla adını veren olay hangisidir?", "Fil Olayı", ["Hicret", "Bedir Savaşı", "Mekke'nin fethi"]),
    ("Hicret sırasında Hz. Muhammed'in yol arkadaşı kimdir?", "Hz. Ebubekir", ["Hz. Ömer", "Hz. Osman", "Hz. Hamza"]),
    ("Hicret yolculuğunda saklanılan mağara hangisidir?", "Sevr Mağarası", ["Hira Mağarası", "Uhud Dağı", "Kuba"]),
    ("Hz. Muhammed'in vefat ettiği şehir hangisidir?", "Medine", ["Mekke", "Taif", "Kudüs"]),
    ("Hz. Muhammed'in kızı Hz. Fatıma'nın oğulları kimlerdir?", "Hz. Hasan ve Hz. Hüseyin", ["Hz. Ali ve Hz. Ömer", "Hz. Osman ve Hz. Hamza", "Hz. Zeyd ve Hz. Bilal"]),
    ("Hz. Muhammed'in sözlerine ne ad verilir?", "Hadis", ["Ayet", "Sure", "Tefsir"]),
])
H.liste(HZ, "Orta", [
    ("Hz. Muhammed kaç yaşında Hz. Hatice ile evlenmiştir?", "25", ["15", "40", "53"]),
    ("Hz. Muhammed kaç yaşında peygamber olmuştur?", "40", ["25", "30", "53"]),
    ("Dedesinin vefatından sonra Hz. Muhammed'i yanına alan amcası kimdir?", "Ebu Talip", ["Hamza", "Abbas", "Ebu Leheb"]),
    ("Gençliğinde Hz. Muhammed hangi işle uğraşmıştır?", "Ticaret", ["Demircilik", "Denizcilik", "Çiftçilik"]),
    ("İlk Müslüman olan çocuk kimdir?", "Hz. Ali", ["Hz. Zeyd", "Hz. Hasan", "Hz. Osman"]),
    ("Medine'ye gelen Mekkeli Müslümanlara ne ad verilir?", "Muhacir", ["Ensar", "Sahabe", "Tabiun"]),
    ("Mekkeli Müslümanlara kucak açan Medineli Müslümanlara ne ad verilir?", "Ensar", ["Muhacir", "Kureyş", "Hanif"]),
    ("Hicret sırasında Medine yakınlarında inşa edilen ilk mescit hangisidir?", "Kuba Mescidi", ["Mescid-i Nebevi", "Mescid-i Aksa", "Mescid-i Haram"]),
    ("Hicri takvimin başlangıcı hangi olaydır?", "Hicret", ["Fil Olayı", "İlk vahiy", "Mekke'nin fethi"]),
    ("Hz. Muhammed'in hayatını inceleyen bilime ne ad verilir?", "Siyer", ["Tefsir", "Fıkıh", "Kelam"]),
])
H.liste(HZ, "Zor", [
    ("Hz. Muhammed'in Kâbe onarımı sırasında Hacerülesved'in yerine konmasıyla ilgili anlaşmazlığı çözmesi hangi özelliğini gösterir?", "Adaletli ve güvenilir olmasını", ["Zengin olmasını", "Güçlü bir savaşçı olmasını", "Çok seyahat etmesini"]),
    ("Müslümanlarla Mekkeli müşrikler arasında 624 yılında yapılan ilk büyük savaş hangisidir?", "Bedir Savaşı", ["Uhud Savaşı", "Hendek Savaşı", "Huneyn Savaşı"]),
    ("Medine'yi savunmak için şehrin çevresine hendek kazılan savaş hangisidir?", "Hendek Savaşı", ["Bedir Savaşı", "Uhud Savaşı", "Tebük Seferi"]),
    ("628 yılında Mekkelilerle yapılan ve sonradan Mekke'nin fethine zemin hazırlayan antlaşma hangisidir?", "Hudeybiye Antlaşması", ["Medine Sözleşmesi", "Akabe Biatı", "Veda Hutbesi"]),
    ("Mekke'nin fethinden sonra Hz. Muhammed'in Mekkelilere genel af ilan etmesi hangi değeri gösterir?", "Merhamet ve affedicilik", ["İntikam", "Kibir", "Cimrilik"]),
])
H.liste(DEGER, "Kolay", [
    ("Başkasına ait bir hakkı çiğnemeye dinimizde ne ad verilir?", "Kul hakkı yemek", ["Sadaka vermek", "İkram etmek", "Selam vermek"]),
    ("Alçakgönüllülüğe ne ad verilir?", "Tevazu", ["Kibir", "Haset", "Gıybet"]),
    ("Kendini başkalarından üstün görmeye ne ad verilir?", "Kibir", ["Tevazu", "Sabır", "Şükür"]),
    ("Bir kişinin arkasından, duyunca üzüleceği şekilde konuşmaya ne ad verilir?", "Gıybet", ["Nasihat", "Selam", "Dua"]),
    ("Başkasının sahip olduğu nimetin ondan gitmesini istemeye ne ad verilir?", "Haset (kıskançlık)", ["Şükür", "Tevazu", "Sabır"]),
])
H.liste(DEGER, "Orta", [
    ("Zenginlerin belirli bir mal miktarına sahip olduklarında yılda bir kez ihtiyaç sahiplerine verdiği ibadete ne ad verilir?", "Zekât", ["Fitre", "Kurban", "Hac"]),
    ("Ramazan ayında, bayramdan önce ihtiyaç sahiplerine verilen yardıma ne ad verilir?", "Fitre (fıtır sadakası)", ["Zekât", "Kurban", "Vergi"]),
    ("Kendisine bırakılan bir eşyayı koruyup sahibine eksiksiz geri vermek hangi değere örnektir?", "Emanete sadakat", ["İsraf", "Kıskançlık", "Kibir"]),
    ("Sınavdan düşük not alan öğrencinin vazgeçmeden çalışmaya devam etmesi hangi değere örnektir?", "Sabır ve azim", ["Haset", "Kibir", "Tembellik"]),
    ("Anne ve babaya iyi davranmak, onlara saygı göstermek dinimizde hangi kavramla anlatılır?", "Ana babaya iyilik", ["Kul hakkı", "Gıybet", "İsraf"]),
])

for i, s in enumerate(H.sorular, start=1):
    s["id"] = i
(BURA / "soru_havuzu.json").write_text(json.dumps(H.sorular, ensure_ascii=False, indent=1), encoding="utf-8")
LOGO = """<svg width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
      <path class="kare edge" d="M6 12 q12 -6 23 2 q11 -8 23 -2 v34 q-12 -6 -23 2 q-11 -8 -23 -2 z"></path>
      <line class="cizgi" x1="29" y1="14" x2="29" y2="48"></line>
    </svg>"""
sayfa_yaz(H.sorular, KOK / "DinKulturuSoruUretici.html", "Din Kültürü 6 Soru Üretici", "Din Kültürü 6",
          "6. sınıf Din Kültürü ve Ahlak Bilgisi", LOGO, sys.argv[1] if len(sys.argv) > 1 else None)
H.ozet()
