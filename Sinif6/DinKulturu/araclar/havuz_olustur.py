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
