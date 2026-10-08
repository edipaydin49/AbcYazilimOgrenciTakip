"""Türkçe 1. Bölüm: Söz Varlığı soru havuzu.

a. Sözcükte Anlam  ·  b. Sözcükler Arası Anlam İlişkileri  ·  c. Söz Grupları

Sorular aşağıdaki veri listelerinden rastgele kurulur. Listeye cümle, deyim, atasözü
veya sözcük çifti ekleyip betiği yeniden çalıştırınca havuz büyür.
Çalıştırınca soru_havuzu.json ve ../SozVarligiSoruUretici.html dosyalarını üretir.
İsteğe bağlı 1. argüman: claude.ai yayın kopyasının yolu.
"""
import json
import random
import sys
from collections import Counter
from pathlib import Path

BURA = Path(__file__).parent
KOK = BURA.parent
sys.path.insert(0, str(KOK.parent / "ortak"))
from sayfa_olustur import sayfa_yaz  # noqa: E402

rnd = random.Random(1923)

K_A = "Sözcükte Anlam"
K_B = "Sözcükler Arası Anlam İlişkileri"
K_C = "Söz Grupları"

# =====================================================================
# VERİ: a. Sözcükte Anlam
# =====================================================================
# Altı çizili sözcük <u>...</u> ile gösterilir.
GERCEK = [
    "Bu ipliği iğneye geçirmek zor, çok <u>ince</u>.",
    "Kışın <u>soğuk</u> sudan uzak durmalısın.",
    "Annem çok <u>tatlı</u> bir kek yapmış.",
    "Deprem bütün binayı <u>sarstı</u>.",
    "Bahçeye büyük bir <u>taş</u> yuvarlandı.",
    "Bu bavul taşıyamayacağım kadar <u>ağır</u>.",
    "Fırından <u>sıcak</u> ekmek aldık.",
    "Bardak yere düşünce <u>kırıldı</u>.",
    "Bu bıçak çok <u>keskin</u>, dikkatli kullan.",
    "Gökyüzünde <u>parlak</u> bir yıldız gördük.",
    "Bu ekmek çok <u>sert</u>, yiyemedim.",
    "Salatadaki biber çok <u>acı</u> çıktı.",
    "Çorba <u>tatsız</u> olmuş, biraz tuz ekle.",
    "Masadaki <u>boş</u> bardakları topladı.",
    "Yeni aldığımız yastık çok <u>yumuşak</u>.",
    "Gölün en <u>derin</u> yeri on metreymiş.",
    "Güneşte oturunca biraz <u>ısındım</u>.",
    "Kalemini <u>kırmızı</u> kutuya koydu.",
]
MECAZ = [
    "Bu konuda çok <u>ince</u> düşünmüş.",
    "Ali, arkadaşlarına karşı çok <u>soğuk</u> davranıyor.",
    "Annesinin <u>tatlı</u> sözleri onu rahatlattı.",
    "Bu haber hepimizi derinden <u>sarstı</u>.",
    "Onun <u>taş</u> kalbini kimse yumuşatamadı.",
    "Bu sözler bana çok <u>ağır</u> geldi.",
    "Köye gidince bizi çok <u>sıcak</u> karşıladılar.",
    "Öğretmenimiz bu davranışa <u>kırıldı</u> ama belli etmedi.",
    "Çocuğun <u>keskin</u> zekâsı herkesi şaşırttı.",
    "Ayşe, sınıfın en <u>parlak</u> öğrencisidir.",
    "Babam bana <u>sert</u> bir dille konuştu.",
    "Bu <u>acı</u> haber hepimizi üzdü.",
    "Arkadaşının <u>tatsız</u> şakası kimseyi güldürmedi.",
    "Onun <u>boş</u> sözlerine artık inanmıyorum.",
    "Komşumuz çok <u>yumuşak</u> huylu biridir.",
    "Herkes onun <u>derin</u> bilgisine hayrandı.",
    "Yeni öğretmenimize ilk günden <u>ısındım</u>.",
    "Bu yıl <u>tatlı</u> bir heyecan içindeyim.",
]
TERIM = [
    "Üçgenin iç <u>açıları</u> toplamı 180 derecedir.",
    "Bu cümlenin <u>yüklemi</u> bir fiildir.",
    "Kaleci, son dakikadaki <u>penaltı</u> atışını kurtardı.",
    "Hücrenin <u>çekirdeği</u> kalıtım bilgisini taşır.",
    "Oyunun ikinci <u>perdesi</u> çok heyecanlıydı.",
    "Doktor, hastanın <u>tansiyonunu</u> ölçtü.",
    "Bu sayının <u>karesini</u> hesaplayınız.",
    "Şiirin her <u>dizesi</u> ayrı bir duygu taşıyordu.",
    "Ressam, tablodaki <u>perspektifi</u> çok iyi kullanmış.",
    "Paragrafın <u>ana düşüncesini</u> bulunuz.",
    "Suyun cisimlere uyguladığı <u>kaldırma kuvveti</u> ölçüldü.",
    "Bu kesrin <u>paydası</u> paydan büyüktür.",
    "Bitkiler <u>fotosentez</u> ile besin üretir.",
    "Mahkeme, <u>davalının</u> itirazını reddetti.",
]
YAN = [
    "Masanın bir <u>ayağı</u> kırılmış.",
    "Kapının <u>kolu</u> elimde kaldı.",
    "Dağın <u>eteğinde</u> küçük bir köy var.",
    "Testinin <u>ağzı</u> kırılmıştı.",
    "Nehrin bir <u>kolu</u> köyün içinden geçiyor.",
    "Kitabın <u>sırtı</u> yırtılmış.",
    "Bıçağın <u>ağzı</u> körelmiş.",
    "Sokağın <u>başında</u> bizi bekliyordu.",
    "Tencerenin <u>kulağı</u> çok ısınmıştı.",
    "Çaydanlığın <u>burnundan</u> buhar çıkıyordu.",
]
ANLAM_TURU = {"Gerçek anlam": GERCEK, "Mecaz anlam": MECAZ, "Terim anlam": TERIM, "Yan anlam": YAN}

SOMUT = ["masa", "kalem", "rüzgâr", "ses", "koku", "su", "ağaç", "duman", "gölge", "ışık", "bulut", "kitap", "taş", "hava"]
SOYUT = ["sevgi", "umut", "korku", "özlem", "cesaret", "düşünce", "mutluluk", "hayal", "saygı", "akıl", "merak", "huzur", "kıskançlık", "sabır"]

# Çok anlamlılık: sözcük -> [(anlam, cümle), ...]
COK_ANLAMLI = {
    "tutmak": [
        ("yakalamak", "Kaçan hırsızı polis hemen <u>tuttu</u>."),
        ("elde bulundurmak", "Bavulu iki eliyle sıkıca <u>tuttu</u>."),
        ("kiralamak", "Yazın deniz kenarında bir ev <u>tuttuk</u>."),
        ("taraftarı olmak", "Sen hangi takımı <u>tutuyorsun</u>?"),
    ],
    "çıkmak": [
        ("aşağıdan yukarıya gitmek", "Merdivenleri hızla <u>çıktı</u>."),
        ("bulunduğu yerden dışarıya gitmek", "Sabah erkenden evden <u>çıktı</u>."),
        ("yayımlanmak", "Yazarın yeni kitabı geçen hafta <u>çıktı</u>."),
        ("bir sınavda soru olarak gelmek", "Sınavda çalıştığım konudan iki soru <u>çıktı</u>."),
    ],
    "açmak": [
        ("kapalı bir şeyi açık duruma getirmek", "Kapıyı yavaşça <u>açtı</u>."),
        ("çiçeklenmek", "Bahçedeki güller <u>açtı</u>."),
        ("bir aracı çalıştırmak", "Babam her sabah radyoyu <u>açar</u>."),
        ("bir konuyu söz etmeye başlamak", "Öğretmen, gezi konusunu toplantıda yeniden <u>açtı</u>."),
    ],
    "almak": [
        ("satın almak", "Pazardan taze meyve <u>aldık</u>."),
        ("içine sığdırmak", "Bu salon yüz kişi <u>alır</u>."),
        ("elde etmek, kazanmak", "Sınavdan yüksek not <u>aldı</u>."),
        ("bir yerden başka bir yere götürmek", "Yağmur başlayınca çamaşırları içeri <u>aldı</u>."),
    ],
    "kesmek": [
        ("bir şeyi keskin bir araçla bölmek", "Ekmeği bıçakla dilim dilim <u>kesti</u>."),
        ("akışını durdurmak", "Arıza yüzünden mahallenin suyunu <u>kestiler</u>."),
        ("birinin sözünü yarıda bırakmasına neden olmak", "Lütfen sözümü <u>kesme</u>."),
        ("bir ilişkiyi sona erdirmek", "Eski komşularıyla bütün bağlarını <u>kesti</u>."),
    ],
    "düşmek": [
        ("yere inmek, yıkılmak", "Çocuk bisikletten <u>düştü</u>."),
        ("azalmak", "Gece hava sıcaklığı sıfırın altına <u>düştü</u>."),
        ("bir yere yolu uğramak", "Bu sabah yolumuz çarşıya <u>düştü</u>."),
        ("bir yerde bulunmak", "Okulumuz, parkın tam karşısına <u>düşüyor</u>."),
    ],
}

# =====================================================================
# VERİ: b. Sözcükler Arası Anlam İlişkileri
# =====================================================================
ES = [("siyah", "kara"), ("ak", "beyaz"), ("ihtiyar", "yaşlı"), ("cevap", "yanıt"), ("okul", "mektep"),
      ("öğrenci", "talebe"), ("hediye", "armağan"), ("millet", "ulus"), ("doktor", "hekim"), ("yıl", "sene"),
      ("kelime", "sözcük"), ("isim", "ad"), ("soru", "sual"), ("misafir", "konuk"), ("fakir", "yoksul"),
      ("imkân", "olanak"), ("deprem", "zelzele"), ("sonbahar", "güz"), ("hikâye", "öykü"), ("vatan", "yurt"),
      ("savaş", "harp"), ("fikir", "düşünce"), ("doğa", "tabiat"), ("örnek", "misal"), ("neden", "sebep"),
      ("kırmızı", "al"), ("şehir", "kent")]
ZIT = [("büyük", "küçük"), ("uzun", "kısa"), ("sıcak", "soğuk"), ("iyi", "kötü"), ("gece", "gündüz"),
       ("zengin", "fakir"), ("açık", "kapalı"), ("kolay", "zor"), ("genç", "yaşlı"), ("ağır", "hafif"),
       ("erken", "geç"), ("aşağı", "yukarı"), ("cesur", "korkak"), ("doğru", "yanlış"), ("dolu", "boş"),
       ("ileri", "geri"), ("var", "yok"), ("ince", "kalın"), ("yakın", "uzak"), ("eski", "yeni"),
       ("tembel", "çalışkan"), ("hızlı", "yavaş"), ("sevinç", "keder"), ("geniş", "dar")]
GENEL_OZEL = [("meyve", "elma"), ("hayvan", "kedi"), ("çiçek", "lale"), ("taşıt", "otobüs"), ("renk", "mavi"),
              ("kuş", "serçe"), ("mevsim", "ilkbahar"), ("sebze", "havuç"), ("mobilya", "dolap")]
PARCA_BUTUN = [("yaprak", "ağaç"), ("sayfa", "kitap"), ("tekerlek", "bisiklet"), ("parmak", "el"),
               ("oda", "ev"), ("tuş", "klavye"), ("dal", "ağaç"), ("pencere", "bina")]
NEDEN_SONUC = [("yağmur", "sel"), ("çalışmak", "başarı"), ("deprem", "yıkım"), ("ateş", "duman"),
               ("dikkatsizlik", "kaza"), ("soğuk", "üşüme"), ("uykusuzluk", "yorgunluk")]
ILISKI = {"Eş anlamlılık": ES, "Zıt anlamlılık": ZIT, "Genel-özel ilişkisi": GENEL_OZEL,
          "Parça-bütün ilişkisi": PARCA_BUTUN, "Neden-sonuç ilişkisi": NEDEN_SONUC}

ZIT_CUMLE = [
    "Az konuşup çok dinlemeyi öğrenmeliyiz.",
    "Gece gündüz demeden çalıştı.",
    "Yaşlı genç herkes meydanda toplandı.",
    "Sevinçli günler de olur, kederli günler de.",
    "Sabah erken kalktı, akşam geç yattı.",
    "İyi gün dostu değil, kötü gün dostu ol.",
    "Kolay soruları önce, zor soruları sonra çözdü.",
    "Eski kitaplarını yeni öğrencilere bağışladı.",
    "Uzun yolda kısa molalar verdik.",
    "Dar sokaklardan geniş bir meydana çıktık.",
]
DUZ_CUMLE = [
    "Bugün okulda resim dersi yaptık.",
    "Annem akşam yemeği için çorba pişirdi.",
    "Kütüphaneden iki kitap ödünç aldım.",
    "Kardeşim bahçede top oynuyor.",
    "Yarın sabah dedemleri ziyaret edeceğiz.",
    "Öğretmenimiz yeni konuyu anlattı.",
    "Hava bugün çok güneşliydi.",
    "Babam hafta sonu arabayı yıkadı.",
    "Sınıfımızda yirmi beş öğrenci var.",
    "Akşam ailece televizyon izledik.",
    "Bahçedeki elma ağacı bu yıl meyve verdi.",
    "Okulumuzun bahçesi çok geniştir.",
    "Kedimiz bütün gün kanepede uyudu.",
    "Bu kitabı iki günde okudum.",
    "Teyzem bize kurabiye getirdi.",
    "Müze gezisine otobüsle gittik.",
]

# Eş sesli (sesteş) sözcükler: sözcük -> {anlam: [cümleler]}
ES_SESLI = {
    "yaz": {"mevsim adı": ["Bu <u>yaz</u> köyümüze gideceğiz.", "<u>Yaz</u> tatilinde çok kitap okudum.", "<u>Yaz</u> aylarında hava çok sıcak olur."],
            "yazmak eylemi": ["Adını deftere <u>yaz</u>.", "Bu cümleyi tahtaya <u>yaz</u>."]},
    "yüz": {"sayı": ["Kumbaramda <u>yüz</u> lira biriktirdim.", "Okulumuzda <u>yüz</u> öğrenci var.", "Bu kitap <u>yüz</u> sayfadan oluşuyor."],
            "surat, çehre": ["Sabah kalkınca <u>yüzünü</u> yıkadı.", "Güneşten <u>yüzü</u> kızarmıştı."],
            "yüzmek eylemi": ["Havuzda her gün bir saat <u>yüz</u>."]},
    "gül": {"çiçek adı": ["Bahçemizdeki <u>gül</u> açtı.", "Anneme kırmızı bir <u>gül</u> aldım.", "Vazodaki <u>gül</u> solmuş."],
            "gülmek eylemi": ["Bu şakaya sen de <u>gül</u>.", "Fotoğraf çekilirken biraz <u>gül</u>."]},
    "at": {"hayvan adı": ["Dedemin beyaz bir <u>at</u>ı var.", "<u>At</u> çok hızlı koşuyordu.", "Çiftlikte bir <u>at</u> gördük."],
           "atmak eylemi": ["Topu bana doğru <u>at</u>.", "Çöpleri çöp kutusuna <u>at</u>."]},
    "çay": {"içecek": ["Kahvaltıda bir bardak <u>çay</u> içtim.", "Annem demlikte <u>çay</u> demledi.", "Misafirlere <u>çay</u> ikram ettik."],
            "küçük akarsu": ["Köyün yanından küçük bir <u>çay</u> akıyor.", "<u>Çay</u> kenarında piknik yaptık."]},
    "dolu": {"buz hâlinde yağış": ["Gece yağan <u>dolu</u> arabalara zarar verdi.", "<u>Dolu</u> yüzünden ekinler zarar gördü.", "Öğleden sonra kısa süreli <u>dolu</u> yağdı."],
             "boş olmayan": ["Bardak su ile <u>dolu</u>.", "Salon izleyicilerle <u>dolu</u>ydu."]},
    "yaş": {"ömür, yıl": ["Kardeşim on iki <u>yaş</u>ında.", "Dedem bu yıl seksen <u>yaş</u>ına girdi.", "Aynı <u>yaş</u>taki çocuklar bir arada oynadı."],
            "ıslak, nemli": ["<u>Yaş</u> çamaşırları balkona astı.", "Yağmurdan sonra çimenler <u>yaş</u>tı."]},
    "bin": {"sayı": ["Okulumuzda <u>bin</u> öğrenci okuyor.", "Bu köprü <u>bin</u> yıllıkmış.", "Kitaplıkta <u>bin</u> kitap var."],
            "binmek eylemi": ["Otobüse arka kapıdan <u>bin</u>.", "Bisikletine <u>bin</u> de gezelim."]},
}

# =====================================================================
# VERİ: c. Söz Grupları
# =====================================================================
# (deyim, anlam, örnek cümle, anlam grubu) — aynı gruptakiler birbirine çeldirici olmaz.
DEYIMLER = [
    ("ağzı kulaklarına varmak", "çok sevinmek", "Karnesini görünce ağzı kulaklarına vardı.", "sevinç"),
    ("etekleri zil çalmak", "çok sevinmek", "Tatil haberini alınca etekleri zil çaldı.", "sevinç"),
    ("göz atmak", "kısaca bakmak, gözden geçirmek", "Sınavdan önce notlarıma göz attım.", "bakmak"),
    ("kulak asmamak", "söyleneni önemsememek, dinlememek", "Uyarılarıma hiç kulak asmadı.", "önemsememek"),
    ("burun kıvırmak", "beğenmemek, küçümsemek", "Hazırladığımız yemeğe burun kıvırdı.", "önemsememek"),
    ("burnu havada olmak", "kendini beğenmiş, kibirli olmak", "Kazandığı ödülden sonra burnu havada oldu.", "kibir"),
    ("eli açık olmak", "cömert olmak", "Dedem çok eli açık bir insandır.", "cömert"),
    ("gözden düşmek", "değerini, itibarını yitirmek", "Yalan söyleyince arkadaşlarının gözünden düştü.", "değer"),
    ("ipe un sermek", "bir işi yapmamak için bahaneler ileri sürmek", "Ödev zamanı gelince ipe un sermeye başladı.", "bahane"),
    ("ayağını denk almak", "dikkatli davranmak", "Bu işte ayağını denk al, sonra pişman olma.", "dikkat"),
    ("dili tutulmak", "şaşkınlıktan ya da korkudan konuşamaz olmak", "Sahneye çıkınca dili tutuldu.", "korku"),
    ("yüreği ağzına gelmek", "çok korkmak", "Kapı birden çarpınca yüreği ağzına geldi.", "korku"),
    ("pireyi deve yapmak", "küçük bir şeyi çok büyütmek", "Küçük bir tartışmada pireyi deve yaptı.", "abartı"),
    ("kılı kırk yarmak", "çok titiz davranmak", "Ödevini hazırlarken kılı kırk yardı.", "titizlik"),
    ("gözü tutmak", "beğenmek", "Vitrindeki ayakkabı gözümü tuttu.", "beğenmek"),
    ("ağzı sıkı olmak", "sır saklamasını bilmek", "Ona güvenebilirsin, ağzı çok sıkıdır.", "sır"),
    ("eli kulağında olmak", "gerçekleşmesi çok yakın olmak", "Yaz tatilinin eli kulağında.", "yakınlık"),
    ("kulak kabartmak", "gizlice dinlemeye çalışmak", "Yan masadaki konuşmaya kulak kabarttı.", "dinlemek"),
    ("içi içine sığmamak", "heyecandan sabırsızlanmak", "Gezi sabahı içi içine sığmıyordu.", "sabırsızlık"),
    ("dört gözle beklemek", "büyük bir istekle beklemek", "Bayramı dört gözle bekliyoruz.", "sabırsızlık"),
    ("yüzü kızarmak", "utanmak", "Yanlış cevap verince yüzü kızardı.", "utanç"),
    ("sözünde durmak", "verdiği sözü yerine getirmek", "Babam sözünde durup bizi parka götürdü.", "söz"),
    ("kafa yormak", "bir konu üzerinde çok düşünmek", "Bu problemi çözmek için çok kafa yordum.", "düşünmek"),
    ("ateş pahası", "çok pahalı", "Pazardaki domatesler ateş pahasıydı.", "pahalı"),
    ("dilinin ucunda olmak", "hatırlayacak gibi olup hatırlayamamak", "Filmin adı dilimin ucunda ama bir türlü söyleyemiyorum.", "hatırlamak"),
    ("göz yummak", "görmezden gelmek, hoş görmek", "Öğretmen bu küçük hataya göz yumdu.", "hoşgörü"),
    ("el ele vermek", "birlikte çalışmak, iş birliği yapmak", "Mahalleli el ele verip parkı temizledi.", "yardım"),
    ("çenesi düşmek", "çok konuşmak, gevezelik etmek", "Yaşlandıkça çenesi düştü.", "konuşmak"),
    ("aklı başına gelmek", "hatasını anlayıp doğru düşünmeye başlamak", "Notları düşünce aklı başına geldi.", "akıl"),
    ("gözü yemek", "bir işi yapmaya cesaret etmek", "O yüksek duvardan atlamaya gözü yemedi.", "cesaret"),
    ("paçayı kurtarmak", "kötü bir durumdan kurtulmak", "Son anda gelen yardımla paçayı kurtardık.", "kurtulmak"),
    ("hapı yutmak", "kötü bir duruma düşmek", "Yağmur başladı, şemsiyemiz de yok; hapı yuttuk.", "kurtulmak"),
    ("eteğindeki taşları dökmek", "içinde tuttuklarını söyleyip rahatlamak", "Uzun süre sustuktan sonra eteğindeki taşları döktü.", "rahatlamak"),
]
# (atasözü, anlam, grup)
ATASOZLERI = [
    ("Damlaya damlaya göl olur.", "Küçük birikimler zamanla büyük bir varlık oluşturur.", "birikim"),
    ("Ak akçe kara gün içindir.", "Biriktirilen para zor günlerde işe yarar.", "birikim"),
    ("Ağaç yaşken eğilir.", "İnsan küçük yaşta eğitilmelidir.", "eğitim"),
    ("Sakla samanı, gelir zamanı.", "Gereksiz görünen şeyler bir gün işe yarayabilir.", "saklamak"),
    ("Bugünün işini yarına bırakma.", "Yapılması gereken iş zamanında yapılmalıdır.", "zaman"),
    ("Komşu komşunun külüne muhtaçtır.", "İnsanlar her zaman birbirine ihtiyaç duyar.", "yardım"),
    ("Bir elin nesi var, iki elin sesi var.", "Yardımlaşarak yapılan iş daha başarılı olur.", "yardım"),
    ("Ayağını yorganına göre uzat.", "Harcamalarını gelirine göre ayarla.", "tutumluluk"),
    ("Dost acı söyler.", "Gerçek dost, hoşa gitmese de doğruyu söyler.", "dostluk"),
    ("Üzüm üzüme baka baka kararır.", "İnsanlar birlikte oldukları kişilerden etkilenir.", "etkilenme"),
    ("Sütten ağzı yanan yoğurdu üfleyerek yer.", "Bir işte zarar gören kişi benzer durumlarda çok dikkatli davranır.", "ders"),
    ("Bir musibet bin nasihatten yeğdir.", "İnsan, başına gelen kötü olaydan çok ders çıkarır.", "ders"),
    ("Acele işe şeytan karışır.", "Aceleyle yapılan işte hata olur.", "acele"),
    ("Tatlı dil yılanı deliğinden çıkarır.", "Güzel sözle her iş başarılabilir.", "tatlı dil"),
    ("İşleyen demir ışıldar.", "Çalışan insan her zaman gelişir ve değer kazanır.", "emek"),
    ("Emek olmadan yemek olmaz.", "Çalışmadan kazanç elde edilmez.", "emek"),
    ("Söz gümüşse sükût altındır.", "Bazen susmak konuşmaktan daha değerlidir.", "susmak"),
    ("Gülü seven dikenine katlanır.", "Sevilen şeyin zorluklarına da katlanmak gerekir.", "sabır"),
    ("Sabır acıdır, meyvesi tatlıdır.", "Sabretmek zordur ama sonucu güzeldir.", "sabır"),
    ("Bin bilsen de bir bilene danış.", "Ne kadar bilgili olursan ol, bilen birine danışmalısın.", "danışmak"),
    ("Ne ekersen onu biçersin.", "İnsan yaptıklarının karşılığını görür.", "emek"),
    ("Görünen köy kılavuz istemez.", "Açıkça belli olan bir şey için açıklamaya gerek yoktur.", "açıklık"),
    ("Dereyi görmeden paçaları sıvama.", "Bir işin sonucu belli olmadan hazırlığa girişme.", "erken davranmak"),
    ("Ateş düştüğü yeri yakar.", "Acıyı en çok, başına gelen kişi hisseder.", "acı"),
    ("Taşıma su ile değirmen dönmez.", "Sürekli dışarıdan destekle bir iş yürümez.", "kalıcılık"),
]
IKILEME_CUMLE = [
    "Misafirler yavaş yavaş gitmeye başladı.",
    "Bahçede irili ufaklı taşlar vardı.",
    "Sabah sabah kapımız çalındı.",
    "Düşüne düşüne doğru kararı verdi.",
    "Dolabın içinde eski püskü giysiler vardı.",
    "Akşama doğru yorgun argın eve döndük.",
    "Öğrenciler sınıfa birer birer girdi.",
    "Pazardan çeşit çeşit meyve aldık.",
    "Kardeşim ufak tefek bir çocuktur.",
    "Bu işi er geç bitireceğiz.",
    "Sokakta çoluk çocuk herkes vardı.",
    "Dedem bize bol bol masal anlattı.",
    "Yağmur şıpır şıpır yağıyordu.",
    "Çocuklar koşa koşa bahçeye çıktı.",
]
PEKISTIRME = ["masmavi", "bembeyaz", "kıpkırmızı", "yemyeşil", "simsiyah", "tertemiz", "sapasağlam", "upuzun",
              "dosdoğru", "paramparça", "yepyeni", "kupkuru", "sımsıkı", "büsbütün", "çırılçıplak", "sapsarı"]
PEKISTIRMESIZ = ["mavimsi", "beyazlık", "kırmızı", "yeşillik", "siyahlık", "temizlik", "sağlıklı", "uzunca",
                 "doğruluk", "parçalı", "yenilik", "kurutmak", "sıkıca", "sarımsı"]
PEKISTIRME_CUMLE = [
    "Bahçedeki çimenler yemyeşil olmuş.",
    "Odasını tertemiz topladı.",
    "Gökyüzü bugün masmavi görünüyordu.",
    "Kar yağınca her yer bembeyaz oldu.",
    "Utancından kıpkırmızı kesildi.",
    "Vazo yere düşünce paramparça oldu.",
    "Bize yepyeni bir oyun öğretti.",
    "Kazadan sapasağlam kurtuldu.",
    "Yol dosdoğru köye uzanıyordu.",
    "Kardeşimin elini sımsıkı tuttu.",
]
YANSIMA = ["şırıltı", "hışırtı", "gümbürtü", "miyav", "horultu", "çatırtı", "vızıltı", "tıkırtı", "cıvıltı", "fısıltı", "şakırtı", "gıcırtı"]
YANSIMA_DEGIL = ["rüzgâr", "yağmur", "ırmak", "dalga", "kuş", "kapı", "tren", "fırtına"]

# =====================================================================
havuz = []
gorulen = set()


def ekle(konu, zorluk, soru, dogru, yanlislar):
    secenek = list(dict.fromkeys([y for y in yanlislar if y != dogru]))[:3]
    if len(secenek) < 3:
        raise ValueError(f"Yetersiz çeldirici: {soru} / {dogru}")
    anahtar = (soru, dogru, tuple(sorted(secenek)))
    if anahtar in gorulen:
        return False
    gorulen.add(anahtar)
    secenek.append(dogru)
    rnd.shuffle(secenek)
    havuz.append({"id": len(havuz) + 1, "konu": konu, "zorluk": zorluk, "soru": soru,
                  "secenekler": secenek, "dogru": secenek.index(dogru)})
    return True


def tekrar(adet, fonk):
    """fonk() bir soru ekler; aynı soru tekrar çıkarsa yeniden dener."""
    eklenen = deneme = 0
    while eklenen < adet and deneme < adet * 20:
        deneme += 1
        if fonk():
            eklenen += 1


def kok(cumle):
    return cumle.split("<u>")[1].split("</u>")[0]


# ---------------- a. Sözcükte Anlam ----------------
def tek_farkli(hedef, diger, soru, zorluk):
    def f():
        d = rnd.choice(hedef)
        # Aynı sözcüğün iki kullanımı aynı soruda yer almasın (ipucu olmasın).
        yanlis = rnd.sample([c for c in diger if kok(c) != kok(d)], 3)
        return ekle(K_A, zorluk, soru, d, yanlis)
    return f


tekrar(16, tek_farkli(MECAZ, GERCEK, "Aşağıdaki cümlelerin hangisinde altı çizili sözcük <b>mecaz anlamda</b> kullanılmıştır?", "Kolay"))
tekrar(16, tek_farkli(GERCEK, MECAZ, "Aşağıdaki cümlelerin hangisinde altı çizili sözcük <b>gerçek anlamında</b> kullanılmıştır?", "Kolay"))
tekrar(14, tek_farkli(TERIM, GERCEK + MECAZ, "Aşağıdaki cümlelerin hangisinde altı çizili sözcük <b>terim anlamlıdır</b>?", "Orta"))
tekrar(10, tek_farkli(YAN, GERCEK + TERIM, "Aşağıdaki cümlelerin hangisinde altı çizili sözcük <b>yan anlamda</b> kullanılmıştır?", "Orta"))
for tur, cumleler in ANLAM_TURU.items():
    for c in cumleler:
        ekle(K_A, "Orta", f"“{c}” cümlesinde altı çizili sözcük hangi anlamda kullanılmıştır?",
             tur, [t for t in ANLAM_TURU if t != tur])
for kelime, anlamlar in [("sıcak", ("gerçek", "mecaz")), ("ağır", ("gerçek", "mecaz")), ("tatlı", ("gerçek", "mecaz"))]:
    g = next(c for c in GERCEK if kok(c) == kelime)
    m = next(c for c in MECAZ if kok(c) == kelime)
    ekle(K_A, "Zor", f"I. {g}<br>II. {m}<br>Bu cümlelerdeki altı çizili sözcüklerin anlamı ile ilgili hangisi doğrudur?",
         "I. cümlede gerçek, II. cümlede mecaz anlamdadır.",
         ["I. cümlede mecaz, II. cümlede gerçek anlamdadır.", "İkisi de gerçek anlamdadır.", "İkisi de mecaz anlamdadır."])
tekrar(10, lambda: ekle(K_A, "Kolay", "Aşağıdakilerden hangisi <b>soyut</b> bir addır?", rnd.choice(SOYUT), rnd.sample(SOMUT, 3)))
tekrar(10, lambda: ekle(K_A, "Kolay", "Aşağıdakilerden hangisi <b>somut</b> bir addır?", rnd.choice(SOMUT), rnd.sample(SOYUT, 3)))
tekrar(4, lambda: ekle(K_A, "Orta", "Aşağıdaki altı çizili sözcüklerden hangisi <b>soyut</b> bir addır?",
                       f"Yüreğindeki <u>{rnd.choice(['umut', 'korku', 'özlem', 'sevgi'])}</u> hiç bitmedi.",
                       [f"Uzaktan gelen <u>{w}</u> hepimizi uyandırdı." for w in ("ses", "koku", "rüzgâr")]
                       + ["Odaya yayılan <u>koku</u> çok güzeldi."]))
for kelime, anlamlar in COK_ANLAMLI.items():
    for anlam, cumle in anlamlar:
        ekle(K_A, "Zor", f"“{kelime}” sözcüğü aşağıdaki cümlelerin hangisinde “{anlam}” anlamında kullanılmıştır?",
             cumle, [c for a, c in anlamlar if a != anlam])

# ---------------- b. Sözcükler Arası Anlam İlişkileri ----------------
es_es = {a: b for a, b in ES} | {b: a for a, b in ES}
zit_es = {a: b for a, b in ZIT} | {b: a for a, b in ZIT}
tum_sozcuk = sorted({w for cift in ES + ZIT for w in cift})


def cift_yaz(c):
    return f"{c[0]} – {c[1]}"


for a, b in ES:
    ekle(K_B, "Kolay", f"“{a}” sözcüğünün eş anlamlısı aşağıdakilerden hangisidir?", b,
         rnd.sample([w for w in tum_sozcuk if w not in (a, b) and es_es.get(w) not in (a, b)], 3))
for a, b in ZIT:
    ekle(K_B, "Kolay", f"“{a}” sözcüğünün zıt anlamlısı aşağıdakilerden hangisidir?", b,
         rnd.sample([w for w in tum_sozcuk if w not in (a, b) and zit_es.get(w) not in (a, b) and es_es.get(w) != b], 3))
tekrar(14, lambda: ekle(K_B, "Kolay", "Aşağıdakilerin hangisinde <b>eş anlamlı</b> sözcükler bir arada verilmemiştir?",
                        cift_yaz(rnd.choice(ZIT)), [cift_yaz(c) for c in rnd.sample(ES, 3)]))
tekrar(14, lambda: ekle(K_B, "Kolay", "Aşağıdakilerin hangisinde <b>zıt anlamlı</b> sözcükler bir arada verilmemiştir?",
                        cift_yaz(rnd.choice(ES)), [cift_yaz(c) for c in rnd.sample(ZIT, 3)]))
for iliski, ciftler in ILISKI.items():
    for c in (ciftler if len(ciftler) < 10 else rnd.sample(ciftler, 8)):
        ekle(K_B, "Orta", f"“{cift_yaz(c)}” sözcükleri arasındaki anlam ilişkisi aşağıdakilerden hangisidir?",
             iliski, rnd.sample([i for i in ILISKI if i != iliski], 3))
for iliski in ("Genel-özel ilişkisi", "Parça-bütün ilişkisi", "Neden-sonuç ilişkisi"):
    tekrar(8, lambda iliski=iliski: ekle(
        K_B, "Orta", f"Aşağıdaki sözcük çiftlerinden hangisinde <b>{iliski.lower()}</b> vardır?",
        cift_yaz(rnd.choice(ILISKI[iliski])),
        [cift_yaz(rnd.choice(ILISKI[d])) for d in rnd.sample([i for i in ILISKI if i != iliski], 3)]))
tekrar(12, lambda: ekle(K_B, "Orta", "Aşağıdaki cümlelerin hangisinde <b>zıt anlamlı</b> sözcükler bir arada kullanılmıştır?",
                        rnd.choice(ZIT_CUMLE), rnd.sample(DUZ_CUMLE, 3)))
tekrar(6, lambda: ekle(K_B, "Zor", "Aşağıdaki cümlelerin hangisinde zıt anlamlı sözcükler bir arada <b>kullanılmamıştır</b>?",
                       rnd.choice(DUZ_CUMLE), rnd.sample(ZIT_CUMLE, 3)))
for kelime, anlamlar in ES_SESLI.items():
    for anlam, cumleler in anlamlar.items():
        digerleri = [c for a, cs in anlamlar.items() if a != anlam for c in cs]
        if len(digerleri) >= 3:
            ekle(K_B, "Orta", f"“{kelime}” sözcüğü aşağıdaki cümlelerin hangisinde “{anlam}” anlamında kullanılmıştır?",
                 rnd.choice(cumleler), rnd.sample(digerleri, 3))
        if len(cumleler) >= 3 and digerleri:
            for farkli in digerleri[:2]:
                ekle(K_B, "Zor", f"Aşağıdaki cümlelerin hangisinde altı çizili “{kelime}” sözcüğü diğerlerinden <b>farklı anlamda</b> kullanılmıştır?",
                     farkli, cumleler)
for kelime, anlamlar in list(ES_SESLI.items())[:6]:
    a1, a2 = list(anlamlar)[:2]
    ekle(K_B, "Zor", f"“{anlamlar[a1][0]}” ve “{anlamlar[a2][0]}” cümlelerindeki “{kelime}” sözcükleri arasındaki ilişki hangisidir?",
         "Eş seslilik (sesteşlik)", ["Eş anlamlılık", "Zıt anlamlılık", "Genel-özel ilişkisi"])

# ---------------- c. Söz Grupları ----------------
for deyim, anlam, _, grup in DEYIMLER:
    yanlis = [a for _, a, _, g in DEYIMLER if g != grup and a != anlam]
    ekle(K_C, "Orta", f"“{deyim}” deyiminin anlamı aşağıdakilerden hangisidir?", anlam, rnd.sample(sorted(set(yanlis)), 3))
    yanlis_d = [d for d, _, _, g in DEYIMLER if g != grup]
    ekle(K_C, "Orta", f"“{anlam}” anlamına gelen deyim aşağıdakilerden hangisidir?", deyim, rnd.sample(yanlis_d, 3))
tekrar(16, lambda: ekle(K_C, "Kolay", "Aşağıdaki cümlelerin hangisinde <b>deyim</b> kullanılmıştır?",
                        rnd.choice(DEYIMLER)[2], rnd.sample(DUZ_CUMLE, 3)))
tekrar(8, lambda: ekle(K_C, "Orta", "Aşağıdaki cümlelerin hangisinde deyim <b>kullanılmamıştır</b>?",
                       rnd.choice(DUZ_CUMLE), [d[2] for d in rnd.sample(DEYIMLER, 3)]))
for soz, anlam, grup in ATASOZLERI:
    yanlis = [a for _, a, g in ATASOZLERI if g != grup]
    ekle(K_C, "Orta", f"“{soz}” atasözünün anlamı aşağıdakilerden hangisidir?", anlam, rnd.sample(yanlis, 3))
    yanlis_s = [s for s, _, g in ATASOZLERI if g != grup]
    ekle(K_C, "Zor", f"“{anlam}” düşüncesini anlatan atasözü aşağıdakilerden hangisidir?", soz, rnd.sample(yanlis_s, 3))
tekrar(10, lambda: ekle(K_C, "Orta", "Aşağıdakilerden hangisi bir <b>atasözüdür</b>?",
                        rnd.choice(ATASOZLERI)[0], [d[0] for d in rnd.sample(DEYIMLER, 3)]))
tekrar(10, lambda: ekle(K_C, "Orta", "Aşağıdakilerden hangisi bir atasözü değil, <b>deyimdir</b>?",
                        rnd.choice(DEYIMLER)[0], [a[0] for a in rnd.sample(ATASOZLERI, 3)]))
ekle(K_C, "Orta", "Atasözleri ile deyimler arasındaki fark için aşağıdakilerden hangisi doğrudur?",
     "Atasözleri genellikle bir öğüt verir; deyimler bir durumu kısa ve etkili anlatır.",
     ["Deyimler her zaman bir öğüt verir.", "Atasözleri tek bir sözcükten oluşur.", "Deyimlerin sözcükleri değiştirilebilir."])
tekrar(14, lambda: ekle(K_C, "Kolay", "Aşağıdaki cümlelerin hangisinde <b>ikileme</b> kullanılmıştır?",
                        rnd.choice(IKILEME_CUMLE), rnd.sample(DUZ_CUMLE, 3)))
tekrar(8, lambda: ekle(K_C, "Orta", "Aşağıdaki cümlelerin hangisinde ikileme <b>kullanılmamıştır</b>?",
                       rnd.choice(DUZ_CUMLE), rnd.sample(IKILEME_CUMLE, 3)))
tekrar(10, lambda: ekle(K_C, "Kolay", "Aşağıdakilerden hangisi <b>pekiştirmeli</b> bir sözcüktür?",
                        rnd.choice(PEKISTIRME), rnd.sample(PEKISTIRMESIZ, 3)))
tekrar(10, lambda: ekle(K_C, "Kolay", "Aşağıdaki cümlelerin hangisinde <b>pekiştirmeli</b> bir sözcük kullanılmıştır?",
                        rnd.choice(PEKISTIRME_CUMLE), rnd.sample(DUZ_CUMLE, 3)))
tekrar(8, lambda: ekle(K_C, "Kolay", "Aşağıdakilerden hangisi bir <b>yansıma</b> sözcük değildir?",
                       rnd.choice(YANSIMA_DEGIL), rnd.sample(YANSIMA, 3)))
tekrar(6, lambda: ekle(K_C, "Kolay", "Aşağıdakilerden hangisi bir <b>yansıma</b> sözcüktür?",
                       rnd.choice(YANSIMA), rnd.sample(YANSIMA_DEGIL, 3)))

for i, s in enumerate(havuz, start=1):
    s["id"] = i
(BURA / "soru_havuzu.json").write_text(json.dumps(havuz, ensure_ascii=False, indent=1), encoding="utf-8")

LOGO = """<svg width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
      <path class="kare edge" d="M6 8 h46 a4 4 0 0 1 4 4 v26 a4 4 0 0 1 -4 4 h-26 l-12 10 v-10 h-8 a4 4 0 0 1 -4 -4 v-26 a4 4 0 0 1 4 -4 z"></path>
      <text class="lbl" x="29" y="32" text-anchor="middle" style="font-size:19px">Aa</text>
    </svg>"""
sayfa_yaz(havuz, KOK / "SozVarligiSoruUretici.html", "Söz Varlığı", "Söz Varlığı",
          "Türkçe · 1. Bölüm", LOGO, sys.argv[1] if len(sys.argv) > 1 else None)
print(len(havuz), "soru")
for (k, z), n in sorted(Counter((s["konu"], s["zorluk"]) for s in havuz).items()):
    print(f"  {k:34} {z:6} {n}")
