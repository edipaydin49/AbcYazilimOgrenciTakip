"""6. sınıf İngilizce soru havuzu (MEB 6. sınıf üniteleri).

Soru türleri: Vocabulary, Grammar, Dialogue, Reading, Listening.
Dinleme soruları tarayıcının yerleşik seslendirmesiyle okunur ("ses" alanı).
Çalıştırınca soru_havuzu.json, kelimeler.json ve ../IngilizceSoruUretici.html dosyalarını üretir.
"""
import json
import sys
from pathlib import Path

BURA = Path(__file__).parent
KOK = BURA.parent
sys.path.insert(0, str(KOK.parent.parent / "ortak"))
from havuz_araclari import Havuz  # noqa: E402
from sayfa_olustur import sayfa_yaz  # noqa: E402

H = Havuz(2026)
rnd = H.rnd

UNITELER = {
    1: "Unit 1 · Life",
    2: "Unit 2 · Yummy Breakfast",
    3: "Unit 3 · Downtown",
    4: "Unit 4 · Weather and Emotions",
    5: "Unit 5 · At the Fair",
    6: "Unit 6 · Occupations",
    7: "Unit 7 · Holidays",
    8: "Unit 8 · Bookworms",
    9: "Unit 9 · Saving the Planet",
    10: "Unit 10 · Democracy",
}

# ---------------------------------------------------------------------------
# KELİMELER: (İngilizce, Türkçe, örnek cümle)
# ---------------------------------------------------------------------------
KELIMELER = {
    1: [("get up", "yataktan kalkmak", "I get up at seven o'clock."),
        ("wake up", "uyanmak", "I wake up early on weekdays."),
        ("have breakfast", "kahvaltı yapmak", "We have breakfast together."),
        ("brush your teeth", "dişlerini fırçalamak", "Brush your teeth twice a day."),
        ("take a shower", "duş almak", "She takes a shower in the morning."),
        ("get dressed", "giyinmek", "He gets dressed quickly."),
        ("have lunch", "öğle yemeği yemek", "We have lunch at noon."),
        ("do homework", "ödev yapmak", "I do my homework after school."),
        ("go to bed", "yatmak", "I go to bed at ten."),
        ("wash your face", "yüzünü yıkamak", "Wash your face with cold water."),
        ("early", "erken", "My father gets up early."),
        ("late", "geç", "Don't be late for school!"),
        ("at noon", "öğlen", "The shop closes at noon."),
        ("weekend", "hafta sonu", "I play football at the weekend."),
        ("every day", "her gün", "I read a book every day.")],
    2: [("cheese", "peynir", "I like white cheese."),
        ("olive", "zeytin", "Black olives are delicious."),
        ("honey", "bal", "I eat bread with honey."),
        ("jam", "reçel", "Strawberry jam is my favourite."),
        ("butter", "tereyağı", "Can I have some butter, please?"),
        ("egg", "yumurta", "I have a boiled egg for breakfast."),
        ("bread", "ekmek", "There is fresh bread on the table."),
        ("tomato", "domates", "Tomatoes are red."),
        ("cucumber", "salatalık", "I like cucumbers in my salad."),
        ("milk", "süt", "I drink a glass of milk every morning."),
        ("orange juice", "portakal suyu", "Would you like some orange juice?"),
        ("sausage", "sosis", "My brother doesn't like sausages."),
        ("pepper", "biber", "Green peppers are healthy."),
        ("delicious", "lezzetli", "This cake is delicious!"),
        ("healthy", "sağlıklı", "A good breakfast is healthy.")],
    3: [("shopping mall", "alışveriş merkezi", "The shopping mall is very big."),
        ("bank", "banka", "My mother works at a bank."),
        ("museum", "müze", "We visited a history museum."),
        ("hospital", "hastane", "The hospital is next to the park."),
        ("library", "kütüphane", "I borrow books from the library."),
        ("post office", "postane", "I sent a letter from the post office."),
        ("bakery", "fırın", "The bakery sells fresh bread."),
        ("pharmacy", "eczane", "You can buy medicine at the pharmacy."),
        ("bus stop", "otobüs durağı", "Wait for me at the bus stop."),
        ("crowded", "kalabalık", "The city centre is crowded."),
        ("noisy", "gürültülü", "Big cities are noisy."),
        ("quiet", "sessiz", "The village is quiet."),
        ("safe", "güvenli", "My neighbourhood is safe."),
        ("dangerous", "tehlikeli", "This street is dangerous at night."),
        ("dirty", "kirli", "The river is dirty.")],
    4: [("sunny", "güneşli", "It's sunny today."),
        ("rainy", "yağmurlu", "I feel sad on rainy days."),
        ("cloudy", "bulutlu", "The sky is cloudy."),
        ("snowy", "karlı", "It's snowy in Kars."),
        ("windy", "rüzgârlı", "It's windy. Let's fly a kite!"),
        ("stormy", "fırtınalı", "It's stormy. Stay at home."),
        ("foggy", "sisli", "It's foggy. Drive slowly."),
        ("happy", "mutlu", "I feel happy on sunny days."),
        ("sad", "üzgün", "Why are you sad?"),
        ("angry", "kızgın", "My dad is angry with me."),
        ("bored", "sıkılmış", "I feel bored at home."),
        ("excited", "heyecanlı", "We are excited about the trip."),
        ("tired", "yorgun", "I'm tired after the match."),
        ("scared", "korkmuş", "The little boy is scared of the storm."),
        ("relaxed", "rahatlamış", "I feel relaxed at the beach.")],
    5: [("fair", "lunapark", "Let's go to the fair on Saturday!"),
        ("roller coaster", "hız treni", "The roller coaster is very fast."),
        ("Ferris wheel", "dönme dolap", "We can see the city from the Ferris wheel."),
        ("bumper cars", "çarpışan arabalar", "Bumper cars are fun."),
        ("haunted house", "korku evi", "The haunted house is scary."),
        ("merry-go-round", "atlıkarınca", "Little children love the merry-go-round."),
        ("ticket", "bilet", "How much is a ticket?"),
        ("exciting", "heyecan verici", "The roller coaster is exciting."),
        ("scary", "korkutucu", "The haunted house is scarier than the bumper cars."),
        ("boring", "sıkıcı", "This game is boring."),
        ("fun", "eğlenceli", "The fair is really fun."),
        ("dizzy", "başı dönmüş", "I feel dizzy after the ride."),
        ("candy floss", "pamuk şeker", "I bought pink candy floss."),
        ("terrifying", "dehşet verici", "The ghost train was terrifying!")],
    6: [("nurse", "hemşire", "The nurse helps the doctor."),
        ("engineer", "mühendis", "My aunt is an engineer."),
        ("farmer", "çiftçi", "The farmer grows vegetables."),
        ("cook", "aşçı", "The cook makes delicious soup."),
        ("dentist", "diş hekimi", "I go to the dentist twice a year."),
        ("firefighter", "itfaiyeci", "Firefighters are very brave."),
        ("police officer", "polis memuru", "The police officer helps people."),
        ("vet", "veteriner", "The vet looks after sick animals."),
        ("architect", "mimar", "An architect designs buildings."),
        ("lawyer", "avukat", "My uncle is a lawyer."),
        ("mechanic", "tamirci", "The mechanic repairs cars."),
        ("waiter", "garson", "The waiter brings our food."),
        ("teacher", "öğretmen", "Our teacher is very kind."),
        ("job", "meslek, iş", "What's your dream job?"),
        ("brave", "cesur", "Firefighters are brave.")],
    7: [("holiday", "tatil", "Where were you on holiday?"),
        ("beach", "plaj", "We were at the beach all day."),
        ("tent", "çadır", "We slept in a tent."),
        ("souvenir", "hediyelik eşya", "I bought a souvenir for my friend."),
        ("suitcase", "bavul", "My suitcase was very heavy."),
        ("passport", "pasaport", "Don't forget your passport!"),
        ("campsite", "kamp alanı", "The campsite was near a lake."),
        ("sunbathe", "güneşlenmek", "My mother likes to sunbathe."),
        ("abroad", "yurt dışı", "We went abroad last summer."),
        ("yesterday", "dün", "I was at home yesterday."),
        ("last summer", "geçen yaz", "Last summer we were in Muğla."),
        ("trip", "gezi, yolculuk", "The school trip was great."),
        ("visit", "ziyaret etmek", "We visited our grandparents."),
        ("sightseeing", "gezip görme", "We went sightseeing in Rome."),
        ("view", "manzara", "The view from the hotel was amazing.")],
    8: [("fairy tale", "masal", "Cinderella is a famous fairy tale."),
        ("comic", "çizgi roman", "My brother reads comics."),
        ("science fiction", "bilim kurgu", "I love science fiction films."),
        ("horror story", "korku hikâyesi", "Horror stories scare me."),
        ("adventure", "macera", "This adventure book is exciting."),
        ("detective story", "dedektif hikâyesi", "Sherlock Holmes is in detective stories."),
        ("biography", "biyografi", "I read a biography of Atatürk."),
        ("poem", "şiir", "She wrote a poem about spring."),
        ("novel", "roman", "This novel has 300 pages."),
        ("writer", "yazar", "Who is your favourite writer?"),
        ("character", "karakter", "The main character is a brave girl."),
        ("be born", "doğmak", "I was born in 2014."),
        ("bookworm", "kitap kurdu", "My sister is a real bookworm."),
        ("story", "hikâye", "Tell me a story, please."),
        ("famous", "ünlü", "He was a famous writer.")],
    9: [("recycle", "geri dönüştürmek", "We recycle paper and glass."),
        ("reduce", "azaltmak", "Reduce the use of plastic bags."),
        ("reuse", "yeniden kullanmak", "Reuse your old bottles."),
        ("pollution", "kirlilik", "Air pollution is a big problem."),
        ("waste", "israf etmek", "Don't waste water."),
        ("save", "tasarruf etmek", "Save energy at home."),
        ("environment", "çevre", "We must protect the environment."),
        ("rubbish", "çöp", "Put the rubbish in the bin."),
        ("plant", "(bitki) dikmek", "Let's plant trees in the garden."),
        ("turn off", "kapatmak", "Turn off the lights."),
        ("tap", "musluk", "Turn off the tap."),
        ("protect", "korumak", "Protect the animals and plants."),
        ("nature", "doğa", "I love walking in nature."),
        ("glass", "cam", "Recycle glass bottles."),
        ("energy", "enerji", "Solar energy is clean.")],
    10: [("vote", "oy vermek", "I will vote for Elif."),
         ("election", "seçim", "We have a class election today."),
         ("candidate", "aday", "There are three candidates."),
         ("class president", "sınıf başkanı", "Who is your class president?"),
         ("ballot box", "oy sandığı", "Put your vote in the ballot box."),
         ("right", "hak", "Every child has rights."),
         ("respect", "saygı göstermek", "Respect other people's ideas."),
         ("equal", "eşit", "All people are equal."),
         ("campaign", "kampanya", "Her campaign was very creative."),
         ("speech", "konuşma", "He gave a great speech."),
         ("win", "kazanmak", "Who will win the election?"),
         ("choose", "seçmek", "Choose the best candidate."),
         ("rule", "kural", "Follow the class rules."),
         ("promise", "söz vermek", "I promise a cleaner classroom."),
         ("fair", "adil", "The election was fair.")],
}

# ---------------------------------------------------------------------------
# DİLBİLGİSİ: (cümle, doğru, [yanlışlar], açıklama)
# ---------------------------------------------------------------------------
GRAMER = {
    1: [("My brother ___ up at 7 o'clock every morning.", "gets", ["get", "getting", "is get"], "He/She/It ile geniş zamanda fiile -s takısı gelir: gets."),
        ("I ___ breakfast at 8 a.m.", "have", ["has", "having", "to have"], "I/You/We/They ile fiil yalın kullanılır: have."),
        ("She ___ her teeth twice a day.", "brushes", ["brush", "brushs", "brushing"], "-sh ile biten fiiller He/She/It ile -es alır: brushes."),
        ("What time ___ you go to school?", "do", ["does", "are", "is"], "You ile geniş zaman sorusu 'do' ile kurulur."),
        ("What time does he ___ to bed?", "go", ["goes", "going", "went"], "Does kullanılan soruda fiil yalın hâle döner: go."),
        ("We have lunch ___ noon.", "at", ["in", "on", "to"], "Saatlerle ve 'noon, night' ile 'at' kullanılır."),
        ("I do my homework ___ the evening.", "in", ["at", "on", "to"], "the morning / the afternoon / the evening ile 'in' kullanılır."),
        ("Ali ___ TV on weekdays.", "doesn't watch", ["don't watch", "not watch", "isn't watch"], "He/She/It olumsuzunda doesn't + yalın fiil kullanılır."),
        ("My parents ___ coffee in the morning.", "drink", ["drinks", "drinking", "is drink"], "They (my parents) ile fiil yalın kullanılır."),
        ("___ your sister take a shower in the morning?", "Does", ["Do", "Is", "Are"], "Your sister = she; soru 'Does' ile başlar."),
        ("I go to school ___ Monday ___ Friday.", "from / to", ["in / at", "at / on", "on / in"], "Bir aralığı anlatırken 'from ... to ...' kullanılır.")],
    2: [("I like eggs but I ___ like sausages.", "don't", ["doesn't", "am not", "isn't"], "I ile olumsuz geniş zaman: don't + fiil."),
        ("My father ___ olives.", "loves", ["love", "loving", "is love"], "He/She/It ile fiil -s alır: loves."),
        ("Can I have ___ orange juice, please?", "some", ["a", "an", "many"], "Sayılamayan isimlerle (juice, milk) 'some' kullanılır."),
        ("There ___ some milk in the fridge.", "is", ["are", "am", "be"], "Sayılamayan isimlerle 'There is' kullanılır."),
        ("There ___ two eggs on the plate.", "are", ["is", "am", "be"], "Çoğul isimlerle 'There are' kullanılır."),
        ("___ you like honey? — Yes, I do.", "Do", ["Does", "Are", "Is"], "Cevap 'Yes, I do.' olduğuna göre soru 'Do' ile kurulur."),
        ("She ___ like tea. She likes milk.", "doesn't", ["don't", "isn't", "not"], "She ile olumsuz: doesn't + yalın fiil."),
        ("I would like ___ apple, please.", "an", ["a", "some", "many"], "Sesli harfle başlayan tekil isimden önce 'an' gelir."),
        ("Would you like some cheese? — No, ___.", "thanks", ["please", "I like", "you are"], "Kibarca reddetmek için 'No, thanks.' denir."),
        ("How ___ eggs do you want?", "many", ["much", "any", "a"], "Sayılabilen çoğul isimlerle 'How many' kullanılır.")],
    3: [("The city is ___ than the village.", "noisier", ["noisy", "more noisy", "noisiest"], "-y ile biten kısa sıfatlar -ier alır: noisy → noisier."),
        ("Istanbul is more crowded ___ Bursa.", "than", ["then", "from", "as"], "Karşılaştırmada 'than' kullanılır."),
        ("The museum is ___ than the shopping mall.", "more interesting", ["interestinger", "most interesting", "interesting"], "Uzun sıfatlarda 'more + sıfat + than' kullanılır."),
        ("My street is ___ than your street.", "quieter", ["quiet", "more quiet", "quietest"], "Kısa sıfatlar -er alır: quiet → quieter."),
        ("The bank is ___ the post office and the bakery.", "between", ["next", "in", "at"], "İki yerin arası 'between ... and ...' ile anlatılır."),
        ("The pharmacy is next ___ the hospital.", "to", ["at", "of", "on"], "'Yanında' anlamı için 'next to' kullanılır."),
        ("Excuse me, ___ is the library? — It's on Green Street.", "where", ["what", "who", "when"], "Yer sormak için 'where' kullanılır."),
        ("Big cities are ___ than small towns.", "busier", ["busy", "more busy", "busiest"], "busy → busier."),
        ("A village is ___ than a city.", "safer", ["safe", "more safe", "safest"], "-e ile biten kısa sıfatlar yalnızca -r alır: safe → safer."),
        ("The shopping mall is ___ than the bakery.", "bigger", ["biger", "more big", "big"], "Kısa sıfatlarda son harf ikilenebilir: big → bigger.")],
    4: [("What's the weather ___ in Ankara today? — It's snowy.", "like", ["likes", "is", "do"], "Hava durumu 'What's the weather like?' ile sorulur."),
        ("It's raining. Take your ___!", "umbrella", ["sunglasses", "swimsuit", "fan"], "Yağmurlu havada şemsiye (umbrella) gerekir."),
        ("When it's sunny, I ___ happy.", "feel", ["feels", "am feel", "feeling"], "I ile fiil yalın: feel."),
        ("How ___ you feel when it's stormy? — I feel scared.", "do", ["does", "are", "is"], "You ile geniş zaman sorusu 'do' ile kurulur."),
        ("My sister ___ bored on rainy days.", "feels", ["feel", "feeling", "is feel"], "She ile fiil -s alır: feels."),
        ("It's very ___ today. You can't see the road.", "foggy", ["sunny", "warm", "hot"], "Yolu göremiyorsak hava sislidir (foggy)."),
        ("It's ___ today. Let's fly a kite!", "windy", ["foggy", "snowy", "rainy"], "Uçurtma uçurmak için rüzgârlı (windy) hava gerekir."),
        ("It's snowy. Let's make a ___!", "snowman", ["sandcastle", "kite", "picnic"], "Karlı havada kardan adam (snowman) yapılır.")],
    5: [("The roller coaster is ___ than the merry-go-round.", "more exciting", ["exciting", "excitinger", "most exciting"], "Uzun sıfatlar: more exciting than."),
        ("The haunted house is ___ than the bumper cars.", "scarier", ["scary", "more scary", "scariest"], "scary → scarier."),
        ("Let's ___ the Ferris wheel!", "ride", ["rides", "riding", "to ride"], "Let's'ten sonra fiil yalın kullanılır."),
        ("I think the merry-go-round is ___ than the roller coaster.", "more boring", ["boringer", "boring", "most boring"], "Uzun sıfatlar: more boring than."),
        ("How about going to the fair? — ___", "That's a great idea!", ["I'm fine, thanks.", "You're welcome.", "See you yesterday."], "Bir öneriyi kabul ederken 'That's a great idea!' denir."),
        ("The Ferris wheel is ___ than the roller coaster.", "slower", ["slow", "more slow", "slowest"], "Kısa sıfatlar -er alır: slow → slower."),
        ("I ___ scared of the haunted house.", "am", ["is", "are", "be"], "I ile 'am' kullanılır."),
        ("Which ride is ___, the roller coaster or the bumper cars?", "faster", ["fast", "more fast", "fastest"], "İki şeyi karşılaştırırken -er kullanılır: faster.")],
    6: [("What ___ your mother do? — She is a nurse.", "does", ["do", "is", "are"], "Meslek sorusu: What does he/she do?"),
        ("My father ___ at a hospital. He is a doctor.", "works", ["work", "working", "is work"], "He ile fiil -s alır: works."),
        ("A ___ flies planes.", "pilot", ["farmer", "vet", "dentist"], "Uçak uçuran kişi pilottur."),
        ("A ___ helps sick animals.", "vet", ["pilot", "lawyer", "architect"], "Hasta hayvanlara veteriner (vet) bakar."),
        ("A ___ designs buildings.", "architect", ["cook", "waiter", "farmer"], "Binaları mimar (architect) tasarlar."),
        ("A ___ grows vegetables and fruits.", "farmer", ["mechanic", "pilot", "nurse"], "Sebze ve meyve yetiştiren kişi çiftçidir."),
        ("Where does a firefighter work? — At a ___.", "fire station", ["bakery", "farm", "bank"], "İtfaiyeciler itfaiye istasyonunda (fire station) çalışır."),
        ("My uncle ___ a teacher. He teaches English.", "is", ["are", "am", "does"], "He ile 'is' kullanılır."),
        ("Does your brother work at a bank? — No, he ___.", "doesn't", ["don't", "isn't", "not"], "Does ile sorulan soruya kısa cevap: No, he doesn't."),
        ("She is ___ engineer.", "an", ["a", "the", "some"], "Sesli harfle başlayan 'engineer' kelimesinden önce 'an' gelir.")],
    7: [("Where ___ you last summer? — I was in Bodrum.", "were", ["was", "are", "did"], "You ile geçmiş zamanda 'were' kullanılır."),
        ("How ___ the weather? — It was hot and sunny.", "was", ["were", "is", "did"], "The weather = it; geçmiş zamanda 'was'."),
        ("My parents ___ at the hotel last week.", "were", ["was", "are", "is"], "They (my parents) ile geçmiş zamanda 'were'."),
        ("I ___ at home yesterday. I was in the park.", "wasn't", ["weren't", "didn't", "am not"], "I ile olumsuz geçmiş: wasn't."),
        ("___ you at the beach last weekend? — Yes, I was.", "Were", ["Was", "Did", "Are"], "You ile geçmiş zaman sorusu 'Were' ile başlar."),
        ("A ___ is a small thing you buy to remember a place.", "souvenir", ["tent", "passport", "ticket"], "Bir yeri hatırlamak için alınan küçük eşya hediyelik eşyadır."),
        ("It ___ cold in Uludağ last winter.", "was", ["were", "is", "be"], "It ile geçmiş zamanda 'was'."),
        ("We ___ in Antalya two years ago.", "were", ["was", "are", "is"], "We ile geçmiş zamanda 'were'."),
        ("The food at the hotel ___ delicious. I didn't like it.", "wasn't", ["was", "weren't", "isn't"], "Beğenmediyse yemek lezzetli değildi: wasn't.")],
    8: [("Atatürk ___ born in 1881.", "was", ["were", "is", "did"], "Doğum bilgisi 'was/were born' ile verilir; he → was."),
        ("My grandparents ___ born in Rize.", "were", ["was", "are", "is"], "They ile 'were born'."),
        ("Long ago, a king ___ in a big castle.", "lived", ["lives", "living", "live"], "Geçmişte olan olaylar için düzenli fiiller -ed alır: lived."),
        ("The children ___ in the garden yesterday.", "played", ["play", "plays", "playing"], "'Yesterday' geçmiş zamandır: played."),
        ("Sherlock Holmes stories are ___ stories.", "detective", ["fairy", "poetry", "horror"], "Sherlock Holmes bir dedektiftir."),
        ("A book about a person's life is a ___.", "biography", ["comic", "horror story", "fairy tale"], "Bir kişinin hayatını anlatan kitap biyografidir."),
        ("Stories with dragons, princesses and magic are ___.", "fairy tales", ["biographies", "detective stories", "newspapers"], "Ejderha, prenses ve sihir masallarda (fairy tales) olur."),
        ("Where ___ Mozart born? — In Salzburg.", "was", ["were", "did", "is"], "He (Mozart) ile 'was born'."),
        ("When were you born? — I was born ___ 2014.", "in", ["on", "at", "to"], "Yıllardan önce 'in' kullanılır."),
        ("I ___ a fairy tale to my little brother last night.", "read", ["reads", "reading", "am read"], "'Last night' geçmiş zamandır; read fiilinin geçmiş hâli de 'read' yazılır.")],
    9: [("We should ___ paper, glass and plastic.", "recycle", ["waste", "throw", "pollute"], "Kâğıt, cam ve plastik geri dönüştürülmelidir (recycle)."),
        ("___ off the lights when you leave the room.", "Turn", ["Turns", "Turning", "To turned"], "Emir cümleleri yalın fiille başlar: Turn off."),
        ("Don't ___ water. Turn off the tap.", "waste", ["save", "recycle", "reuse"], "Su israf edilmemelidir: Don't waste water."),
        ("We ___ plant more trees.", "should", ["shouldn't", "does", "is"], "Öneri bildirirken 'should + yalın fiil' kullanılır."),
        ("We shouldn't ___ rubbish on the ground.", "throw", ["recycle", "plant", "save"], "Yere çöp atmamalıyız: shouldn't throw."),
        ("Factories cause air ___.", "pollution", ["recycling", "energy", "nature"], "Fabrikalar hava kirliliğine (pollution) neden olur."),
        ("Use a cloth bag. ___ use plastic bags.", "Don't", ["Doesn't", "Not", "No"], "Olumsuz emir 'Don't + fiil' ile kurulur."),
        ("___ water! Take shorter showers.", "Save", ["Waste", "Pollute", "Throw"], "Kısa duş alarak su tasarrufu (save) yapılır."),
        ("We can ___ old jars as pencil holders.", "reuse", ["pollute", "waste", "throw"], "Eski kavanozları yeniden kullanabiliriz (reuse).")],
    10: [("I will ___ for Elif in the class election.", "vote", ["voting", "votes", "voted"], "'Will'den sonra fiil yalın kullanılır."),
         ("If I become class president, I ___ make our classroom cleaner.", "will", ["was", "did", "am"], "Gelecekle ilgili söz verirken 'will' kullanılır."),
         ("Each student puts the vote in the ___ box.", "ballot", ["lunch", "pencil", "toy"], "Oylar oy sandığına (ballot box) atılır."),
         ("A person who wants to win an election is a ___.", "candidate", ["vote", "ballot", "rule"], "Seçimde yarışan kişi adaydır (candidate)."),
         ("Everyone ___ equal rights in a democracy.", "has", ["have", "having", "is"], "Everyone tekil kabul edilir: has."),
         ("Ayşe ___ the class president last year.", "was", ["were", "is", "will"], "'Last year' geçmiş zamandır; she → was."),
         ("We should ___ other people's ideas.", "respect", ["waste", "pollute", "throw"], "Başkalarının fikirlerine saygı (respect) göstermeliyiz."),
         ("Who will you vote for? — I ___ vote for Can.", "will", ["was", "did", "am"], "Soruda 'will' varsa cevapta da 'will' kullanılır."),
         ("I ___ organise a book fair if I win.", "will", ["am", "was", "do"], "Gelecekle ilgili plan: will + yalın fiil.")],
}

# ---------------------------------------------------------------------------
# DİYALOGLAR: (A cümlesi, doğru B cevabı, [yanlışlar])
# ---------------------------------------------------------------------------
DIYALOG = {
    1: [("What time do you get up?", "At seven o'clock.", ["In the kitchen.", "Yes, I do.", "With my brother."]),
        ("Do you have breakfast every day?", "Yes, I do.", ["Yes, I am.", "At 8 o'clock.", "No, he doesn't."]),
        ("What do you do after school?", "I do my homework.", ["I'm twelve.", "It's on Monday.", "Yes, I did."])],
    2: [("Would you like some tea?", "Yes, please.", ["Yes, I am.", "No, I'm not.", "It's on the table."]),
        ("Can I have some bread, please?", "Here you are.", ["I'm twelve.", "See you!", "It's sunny."]),
        ("What do you have for breakfast?", "Cheese, olives and eggs.", ["At the park.", "By bus.", "I'm fine."])],
    3: [("Excuse me, where is the bank?", "It's next to the bakery.", ["It's sunny.", "At 9 o'clock.", "I like it."]),
        ("Which is more crowded, the city or the village?", "The city is more crowded.", ["Yes, it is.", "At the station.", "I go by bus."]),
        ("How can I get to the museum?", "Go straight and turn left.", ["It's a museum.", "I'm from Izmir.", "It's 10 lira."])],
    4: [("What's the weather like today?", "It's cloudy and cold.", ["I'm thirteen.", "It's Monday.", "I like apples."]),
        ("How do you feel on snowy days?", "I feel excited.", ["It's snowy.", "I'm from Kars.", "Yes, I do."]),
        ("Why are you sad?", "Because it's rainy and I can't go out.", ["I'm fine, thanks.", "It's on the desk.", "Yes, I am."])],
    5: [("Let's go to the fair!", "Sure, why not?", ["I was born in 2014.", "It's on the table.", "No, she isn't."]),
        ("Which ride is more exciting?", "The roller coaster.", ["At the fair.", "Two tickets.", "Yes, it is."]),
        ("How much is a ticket for the Ferris wheel?", "It's 50 lira.", ["It's exciting.", "It's next to the café.", "I'm scared."])],
    6: [("What does your father do?", "He's an engineer.", ["He's fine.", "He's at home.", "He likes football."]),
        ("Where does a nurse work?", "At a hospital.", ["A doctor.", "Every day.", "She is kind."]),
        ("What do you want to be in the future?", "I want to be an architect.", ["I was a student.", "At the school.", "Yes, I want."])],
    7: [("Where were you last weekend?", "I was at my grandmother's house.", ["I am at school.", "I will go to Izmir.", "It was sunny."]),
        ("How was your holiday?", "It was fantastic!", ["I was in Antalya.", "Yes, I do.", "By plane."]),
        ("Were you in Trabzon last summer?", "No, I wasn't.", ["No, I don't.", "No, I'm not.", "No, it wasn't me."])],
    8: [("What kind of books do you like?", "I like adventure stories.", ["I read it yesterday.", "It was born in 1990.", "At the library."]),
        ("When was your grandfather born?", "He was born in 1950.", ["He is a doctor.", "In Trabzon.", "Yes, he was."]),
        ("Who is your favourite writer?", "Ömer Seyfettin.", ["A fairy tale.", "In 1884.", "Two books."])],
    9: [("How can we save energy?", "We should turn off the lights.", ["We should waste water.", "It's my bag.", "At 7 o'clock."]),
        ("What should we do with old bottles?", "We should recycle them.", ["We should throw them in the sea.", "They are blue.", "Yes, we do."]),
        ("Can you turn off the tap, please?", "Sure, no problem.", ["It's a tap.", "Yes, I was.", "At the beach."])],
    10: [("Who will you vote for?", "I will vote for Mert.", ["It's a ballot box.", "On Monday.", "Yes, I was."]),
         ("What will you do if you become class president?", "I will organise a book fair.", ["I was a class president.", "It's in the box.", "Yes, I will."]),
         ("Is the election on Friday?", "Yes, it is.", ["Yes, I will.", "Yes, I do.", "Yes, they are."])],
}

# ---------------------------------------------------------------------------
# OKUMA: (metin, [(soru, doğru, [yanlışlar]), ...])
# ---------------------------------------------------------------------------
OKUMA = {
    1: ("Hi, I'm Deniz. I get up at 7:00 every day. I have breakfast with my family at 7:30. I go to school by bus. "
        "School starts at 8:30. After school, I do my homework and play basketball. I go to bed at 10 p.m.",
        [("What time does Deniz have breakfast?", "At 7:30.", ["At 7:00.", "At 8:30.", "At 10 p.m."]),
         ("How does Deniz go to school?", "By bus.", ["On foot.", "By car.", "By bike."]),
         ("What does Deniz do after school?", "Homework and basketball.", ["Watches TV.", "Goes to bed.", "Has breakfast."])]),
    2: ("Emre's family has breakfast together on Sundays. There are eggs, cheese, olives, tomatoes and honey on the table. "
        "Emre likes honey but he doesn't like olives. His mother drinks tea and his father drinks orange juice.",
        [("What doesn't Emre like?", "Olives.", ["Honey.", "Eggs.", "Cheese."]),
         ("What does Emre's father drink?", "Orange juice.", ["Tea.", "Milk.", "Coffee."]),
         ("When does the family have breakfast together?", "On Sundays.", ["Every day.", "On Mondays.", "In the evening."])]),
    3: ("My town is small and quiet. There is a bakery next to the post office. The library is between the bank and the park. "
        "My favourite place is the library because it is quieter than the park.",
        [("Where is the library?", "Between the bank and the park.", ["Next to the post office.", "Behind the bakery.", "In the shopping mall."]),
         ("Why does the writer like the library?", "It is quieter than the park.", ["It is bigger than the bank.", "It sells bread.", "It is noisy."]),
         ("What is next to the post office?", "A bakery.", ["A library.", "A bank.", "A park."])]),
    4: ("Today it is cold and windy in Erzurum. Tomorrow it will be snowy. Ela loves snowy days. She feels excited because "
        "she can make a snowman. Her brother Can doesn't like cold weather. He feels bored at home.",
        [("What is the weather like in Erzurum today?", "Cold and windy.", ["Hot and sunny.", "Rainy.", "Foggy."]),
         ("How does Ela feel on snowy days?", "Excited.", ["Bored.", "Angry.", "Scared."]),
         ("Who doesn't like cold weather?", "Can.", ["Ela.", "Ela's friend.", "Their teacher."])]),
    5: ("Last Saturday, Mert and Ada were at the fair. Mert loved the roller coaster because it was very exciting. "
        "Ada was scared of the haunted house. She thinks the Ferris wheel is more relaxing.",
        [("Which ride did Mert love?", "The roller coaster.", ["The haunted house.", "The Ferris wheel.", "The bumper cars."]),
         ("What was Ada scared of?", "The haunted house.", ["The roller coaster.", "The Ferris wheel.", "Mert."]),
         ("When were they at the fair?", "Last Saturday.", ["Last Sunday.", "Yesterday.", "Every day."])]),
    6: ("My name is Selin. My mother is a vet. She works at an animal clinic and helps sick animals. "
        "My father is a cook. He works at a restaurant and makes delicious food. I want to be a pilot in the future.",
        [("What does Selin's mother do?", "She's a vet.", ["She's a cook.", "She's a pilot.", "She's a nurse."]),
         ("Where does Selin's father work?", "At a restaurant.", ["At an animal clinic.", "At an airport.", "At a school."]),
         ("What does Selin want to be?", "A pilot.", ["A vet.", "A cook.", "A teacher."])]),
    7: ("Last summer, I was in Fethiye with my family. The weather was hot and sunny. We were at the beach every day. "
        "My sister was very happy because the sea was clean and warm. The hotel was great but the food wasn't delicious.",
        [("Where was the writer last summer?", "In Fethiye.", ["In Erzurum.", "In Ankara.", "At home."]),
         ("How was the weather?", "Hot and sunny.", ["Cold and rainy.", "Snowy.", "Foggy."]),
         ("What wasn't good on the holiday?", "The food.", ["The hotel.", "The sea.", "The weather."])]),
    8: ("Roald Dahl was a famous writer. He was born in 1916 in Wales. His books are very popular with children. "
        "'Charlie and the Chocolate Factory' is one of his famous books.",
        [("When was Roald Dahl born?", "In 1916.", ["In 1961.", "In 1906.", "In 2016."]),
         ("Where was he born?", "In Wales.", ["In London.", "In Türkiye.", "In America."]),
         ("Who loves his books?", "Children.", ["Only teachers.", "Doctors.", "Nobody."])]),
    9: ("Our school has a recycling club. Every Friday, we collect paper, glass and plastic. We also plant trees in the "
        "school garden. Our teacher always says, 'Turn off the lights and don't waste water.'",
        [("When does the club collect paper, glass and plastic?", "Every Friday.", ["Every Monday.", "Every day.", "At the weekend."]),
         ("Where do they plant trees?", "In the school garden.", ["In the park.", "In the forest.", "On the street."]),
         ("What does the teacher say?", "Don't waste water.", ["Throw rubbish on the ground.", "Leave the lights on.", "Use more plastic."])]),
    10: ("Our class had an election last week. There were three candidates: Ece, Burak and Zeynep. Every student voted. "
         "Zeynep won the election with 14 votes. She promised a cleaner classroom and a book corner.",
         [("How many candidates were there?", "Three.", ["Two.", "Four.", "Fourteen."]),
          ("Who won the election?", "Zeynep.", ["Ece.", "Burak.", "The teacher."]),
          ("What did Zeynep promise?", "A cleaner classroom and a book corner.", ["A school trip.", "More homework.", "A new computer."])]),
}

# ---------------------------------------------------------------------------
# SORULARI KUR
# ---------------------------------------------------------------------------
for u, konu in UNITELER.items():
    kel = KELIMELER[u]
    trler = [t for _, t, _ in kel]
    enler = [e for e, _, _ in kel]
    for en, tr, ornek in kel:
        H.ekle(konu, "Kolay", f"“<b>{en}</b>” kelimesinin Türkçe anlamı hangisidir?", tr,
               rnd.sample([t for t in trler if t != tr], 3), tur="Vocabulary")
        H.ekle(konu, "Kolay", f"“<b>{tr}</b>” kelimesinin İngilizcesi hangisidir?", en,
               rnd.sample([e for e in enler if e != en], 3), tur="Vocabulary")
        H.ekle(konu, "Kolay", "Dinleyin. Duyduğunuz kelime hangisidir?", en,
               rnd.sample([e for e in enler if e != en], 3), tur="Listening", ses=en)
    for cumle, dogru, yanlis, aciklama in GRAMER[u]:
        H.ekle(konu, "Orta", f"Boşluğa hangisi gelmelidir?<br><i>{cumle}</i>", dogru, yanlis,
               tur="Grammar", aciklama=aciklama)
    for a, b, yanlis in DIYALOG[u]:
        H.ekle(konu, "Orta", f"Diyaloğu tamamlayınız.<br><b>A:</b> {a}<br><b>B:</b> ______", b, yanlis, tur="Dialogue")
        H.ekle(konu, "Zor", "Dinleyin. Duyduğunuz soruya verilecek en uygun cevap hangisidir?", b, yanlis,
               tur="Listening", ses=a)
    metin, sorular = OKUMA[u]
    for soru, dogru, yanlis in sorular:
        H.ekle(konu, "Zor", f"<i>{metin}</i><br><br><b>{soru}</b>", dogru, yanlis, tur="Reading")

for i, s in enumerate(H.sorular, start=1):
    s["id"] = i
(BURA / "soru_havuzu.json").write_text(json.dumps(H.sorular, ensure_ascii=False, indent=1), encoding="utf-8")
(BURA / "kelimeler.json").write_text(json.dumps(
    [{"unite": UNITELER[u], "en": e, "tr": t, "ornek": o} for u, ks in KELIMELER.items() for e, t, o in ks],
    ensure_ascii=False, indent=1), encoding="utf-8")

LOGO = """<svg width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
      <path class="kare edge" d="M6 8 h46 a4 4 0 0 1 4 4 v26 a4 4 0 0 1 -4 4 h-26 l-12 10 v-10 h-8 a4 4 0 0 1 -4 -4 v-26 a4 4 0 0 1 4 -4 z"></path>
      <text class="lbl" x="29" y="32" text-anchor="middle" style="font-size:17px">EN</text>
    </svg>"""
sayfa_yaz(H.sorular, KOK / "IngilizceSoruUretici.html", "İngilizce 6 Soru Üretici", "English 6",
          "6. sınıf İngilizce", LOGO, sys.argv[1] if len(sys.argv) > 1 else None, etiket_dili="en")

# Kelime kartları sayfası (aralıklı tekrar)
kartlar = json.dumps([{"unite": UNITELER[u], "en": e, "tr": t, "ornek": o}
                      for u, ks in KELIMELER.items() for e, t, o in ks], ensure_ascii=False)
kart_govde = (BURA / "kart_sablonu.html").read_text(encoding="utf-8").replace("/*KELIMELER*/", kartlar)
(KOK / "KelimeKartlari.html").write_text('<!doctype html>\n<html lang="tr">\n' + kart_govde + "</html>\n", encoding="utf-8")
if len(sys.argv) > 2:
    Path(sys.argv[2]).write_text(kart_govde.replace('<meta charset="utf-8">\n', "").replace(
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n', ""), encoding="utf-8")

H.ozet()
