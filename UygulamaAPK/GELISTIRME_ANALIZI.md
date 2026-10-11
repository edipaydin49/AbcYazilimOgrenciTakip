# Öğrenme Yolculuğu — geliştirme analizi ve yol haritası

Bu belge iki kaynağı birleştirir:
1. Uygulamanın kodu üzerinden yapılan analiz.
2. Velinin ilettiği teknik ve pedagojik öneriler (veri güvenliği, kalıcılığın ölçülmesi, uyarlanabilir öğrenme, ölçme kalitesi, karar destek paneli).

Her maddenin yanında durumu yazar:
- ✅ **1.7'de yapıldı**
- 🟡 **kısmen var**
- ⏳ **planlandı**

## 1. Bugünkü durum (sürüm 1.7)

| Alan | Durum |
|---|---|
| Dersler | Matematik, Fen Bilimleri, Türkçe ve İngilizce. Toplam 66 konu, 200 kazanım. |
| Soru üretimi | Matematik ve sayısal konularda sorular her seferinde yeni sayılarla üretilir. Sözel konularda geniş bir soru havuzu vardır. Aynı soru kısa süre içinde tekrar gelmez. 1.7 ile her derse “tane tane” çözümlü yüzlerce yeni soru eklendi. |
| Çözüm | Çözüm adım adım açılır: 🔎 soruyu anla → 💡 hatırla → ✏️ uygula → ✅ sonuç → 🔁 kontrol. Ayrıca her seçenek tek tek incelenir, bir “Unutma” kuralı gösterilir ve benzer bir soru sorulur. |
| Denemeler | Dört tür deneme vardır: mini (10 soru), ders (20 soru), karma (4 ders × 10 = 40 soru, 60 dk) ve yazılı provası. Sonuçta doğru, yanlış, boş ve net sayısı ile net gelişim grafiği gösterilir. |
| Öğrenme motoru | Kazanım bazında akıllı tekrar, öğrenme profili, görülmüş ve yeni soru ayrımı, veli uyarıları. |
| Oyunlar | Türkçe Diyarı (3 ada, 79 görev). İngilizce: Downtown, Roller Coaster, Breakfast Chef, Wardrobe. |
| Takip | Veli paneli: “Bugün ne yapmalıyız?”, akordiyon soru kayıtları ve konu ayrıntısı. Bilgisayardan izleme (aynı Wi‑Fi) ve isteğe bağlı bulut eşitleme. |
| Veri güvenliği | İndirilenler klasörüne yedek: elle, otomatik günlük ve sürüm güncellemesinde. Yedekten geri yükleme. |

## 2. Öncelik sırası (öneri belgesiyle uyumlu)

1. **Veri güvenliği ve yedekleme.** Kayıt kaybolursa bütün ölçüm boşa gider.
2. **Gerçek öğrenmenin ölçülmesi.** İlk deneme, yardımsız çözüm, birkaç gün sonra hatırlama ve yeni sorulardaki başarı.
3. **Uyarlanabilir öğrenme.** Doğru kazanımı, doğru zamanda, doğru yardımla çalıştırmak.
4. **Ölçme kalitesi ve pilot.** Cevap anahtarı, kazanım uyumu ve zorluk tutarlılığı.
5. **Veli paneli bir karar destek aracı olmalı.** Sayı yığını değil, “bugün ne yapmalıyız?” sorusuna cevap.

## 3. Önerilerin durumu

### 3.1 Veri güvenliği ve mimari

| Öneri | Durum | Not |
|---|---|---|
| Otomatik yedek, güncelleme öncesi yedek, geri yükleme | ✅ | Yedekler İndirilenler/OgrenmeYolculugu klasörüne yazılır, uygulama silinse de kalır. Günlük yedek 3 dosya hâlinde dönüşümlüdür. Sürüm değiştiğinde ayrıca yedek alınır. Geri yükleme kayıtları birleştirir, mükerrer kayıt oluşturmaz. Şifre ve bulut adresi yedeğe yazılmaz. |
| Geri yükleme testi | ✅ | Arayüz testi yedeği geri yükler ve iki kez yüklendiğinde mükerrer kayıt olmadığını doğrular. |
| Şema sürümü | ✅ | Dışa aktarılan veride `sema: 2` alanı bulunur. Olay günlüğü yalnızca ekleme yapar; eski kayıtlar (ders alanı olmayanlar) okunabilir. |
| Birleşik olay şeması (eventId, sessionId, type…) | 🟡 | Her olayda `id`, `tip`, `t`, `s`, `cihaz` alanları zaten var. `oturumId` alanı ve kayıtlara açık bir `schemaVersion` eklenmesi planlandı. |
| Güvenilir eşitleme | 🟡 | Kayıt yalnızca sunucu `ok` döndürünce “gönderildi” sayılır. Gönderim sırasında değişen kayıt yeniden gönderilir. Aynı kimlik iki kez eklenmez. ⏳ Üstel geri çekilmeli yeniden deneme. |
| Yerel ağ sunucusu güvenliği | ✅ | Ayrıntılar aşağıdaki listede. |
| Tekrarlanabilir derleme ve sürüm kapısı | ✅ | `node araclar/tum_testler.js` bütün testleri çalıştırır; biri bile başarısızsa APK derlenmez. Derleme betiği her seferinde aynı araçlarla ve aynı anahtarla imzalar. |
| Teşhis ekranı (sürüm, kayıt sayısı, son yedek, son eşitleme) | 🟡 | Ayarlar sekmesinde son yedek ve son eşitleme bilgisi var. ⏳ Tek bir teşhis kartı. |
| Erişilebilirlik | 🟡 | Büyük dokunma alanları, klavye odağı, karanlık mod ve İngilizce sesli okuma var. ⏳ Türkçe sesli okuma ve yazı boyutu ayarı. |

Yerel ağ sunucusunda yapılanlar:
- Şifre artık adres satırında değil, `X-Pin` başlığında gider; tarayıcı geçmişine düşmez.
- Bütün veri tek bir korumalı adresten (`/api/veri`) verilir; diğer adresler yalnızca uygulamanın kendi sayfalarıdır.
- 5 hatalı denemeden sonra 1 dakika kilit uygulanır.
- Aynı anda en fazla 8 bağlantı kabul edilir.
- Sınırlar: istek satırı en fazla 2 KB, başlıklar en fazla 8 KB, zaman aşımı 10 sn.
- `..` ile klasör dışına çıkılamaz.
- Uygulama arka plana geçince sunucu kapanır, öne gelince yeniden açılır.
- Uyarı: bağlantı şifrelenmemiş HTTP'dir; yalnızca ev ağında kullanılmalıdır.

### 3.2 Gerçek öğrenmenin ölçülmesi

| Öneri | Durum | Not |
|---|---|---|
| Konu bazında öğrenme profili | ✅ | Konu ayrıntısında gösterilenler: ilk deneme, yardımsız çözüm, yardımla sonunda doğru, gecikmeli hatırlama (3+ gün sonra), transfer (yeni nesil), ilk kez görülen ve daha önce görülmüş sorulardaki başarı, tekrarlanan hata türü. Her değerin yanında kaç soruya dayandığı yazar. |
| Daha önce görülmüş ve yeni soruların ayrılması | ✅ | Her soruya kalıcı bir anahtar (`sk`) verilir: kazanım + soru metni + doğru cevap. Kayıtta `gorulmus` alanı tutulur. |
| Güven kalibrasyonu (“emin misin?”) | ⏳ | Soru sonunda isteğe bağlı 3 düğme: emindim, kararsızdım, tahmin ettim. |
| Hata türü: sistem tahmini, öğrenci beyanı, sonraki soruda doğrulama | 🟡 | Sistem tahmini (çeldiricinin hata türü) ve öğrenci beyanı ayrı ayrı kaydediliyor. ⏳ Sonraki benzer soruda doğrulama raporu. |

### 3.3 Uyarlanabilir öğrenme

| Öneri | Durum | Not |
|---|---|---|
| Uyarlanabilir aralıklı tekrar | ✅ | Kazanım bazında 6 kutu vardır: 1, 2, 4, 8, 16, 32 gün. Kurallar: (1) Yardımsız ve hızlı doğru cevap aralığı uzatır. (2) Yardımsız ama yavaş doğru cevap aralığı aynı bırakır. (3) İpucu ya da çözüm görülerek verilen doğru cevap aralığı uzatmaz, bir kutu geri götürür. (4) Yanlış cevap aralığı 1 güne indirir. Gün içindeki yalnızca ilk cevap sayılır. Ana sayfada “🧠 Akıllı tekrar” bulunur (5 kazanım × 2 soru). Veli panelinin Aralıklı tekrar sekmesinde kuyruk görünür. |
| Yanlıştan sonra mini öğretim döngüsü | 🟡 | Mevcut adımlar: yanlış → hata türü sorusu → adım adım çözüm ve seçenek analizi → benzer soru. ⏳ Benzer soru da yanlışsa ön koşul kazanıma yönlendirme. |
| Kazanım ön koşul haritası | ⏳ | Örnek: EBOB → çarpanlar, asal çarpanlar. Yanlışta önce ön koşul tekrarı. |
| Uyarlanabilir haftalık plan | ⏳ | Akıllı tekrar kuyruğu + yazılı tarihleri + zayıf kazanımlar → günlük 3 görev. |

### 3.4 İçerik kalitesi (QA)

| Öneri | Durum | Not |
|---|---|---|
| Cevap anahtarının üreteçten bağımsız denetimi | 🟡 | `ders_dogrula.js` ve `icerik_test.js` her üreteci binlerce kez çalıştırır. Denetlenenler: tek doğru cevap, 4 farklı seçenek, boş veya hatalı alan olmaması, kazanım kimliği, çözümün adım sayısı. ⏳ Matematikte ikinci, bağımsız hesapla cevap doğrulama. |
| Zorluk tutarlılığı | ⏳ | Pilot verisiyle: zorluk 1, 2 ve 3 sorularının gerçek başarı oranları sıralı mı? |
| Kararlı soru kimliği | ✅ | `sk` anahtarı (bkz. 3.2). |
| Çeşitlilik ve dil | 🟡 | Yazım, TDK ve British English A1 kurallarına göre yazıldı. ⏳ Öğretmen gözüyle örneklem okuması. |

### 3.5 Veli paneli

| Öneri | Durum | Not |
|---|---|---|
| Günlük özet: “Bugün ne yapmalıyız?” | ✅ | Özet sekmesinin en üstünde: akıllı tekrar, sıradaki adım ve son 14 günün uyarıları, her biri bir öneriyle. |
| Eyleme dönük uyarılar | ✅ | Üç uyarı türü: “aynı hata 3+ ayrı testte tekrarlandı”, “ipucuyla yüksek, yardımsız düşük”, “başarı daha önce görülen sorulara dayanıyor”. Ayrıca “tekrar testi X gündür bekliyor”. Uyarı için konuda en az 5 soru gerekir. |
| Örneklem büyüklüğü | ✅ | Her değerin yanında soru sayısı ve güven düzeyi (düşük, orta, yüksek) yazar. |
| Soru kayıtları | ✅ | Akordiyon yapısı: Ders › konu başlığı › konu, müfredat sırasıyla. Her başlıkta soru sayısı, ilk deneme ve yardımsız başarı görünür. Konu açılınca her soru zaman, kazanım, düzey, zorluk, süre, ilk ve son cevap, yardım, hata türü ve test türüyle listelenir. “Tümünü aç/kapat” düğmesi vardır. |
| Ayrıntılı süzgeçler (ilk/tekrar, yardımlı/yardımsız, yeni/görülmüş) | 🟡 | Öğrenme profilinde ayrı ayrı gösteriliyor. ⏳ Soru kayıtlarında süzgeç düğmeleri. |

### 3.6 Video

| Öneri | Durum | Not |
|---|---|---|
| Açılan ve gerçekten izlenen videoyu ayırma | ✅ | Gerçek oynatma süresi, tamamlama, geri ve ileri sarma ölçülüyor. |
| Bölüm zaman damgalarını kazanıma bağlama | 🟡 | Veli, videolara bölüm ve durak sorusu ekleyebiliyor. ⏳ Hazır videolar için kazanım etiketleri. |
| Gerçek cihazda ebeveyn kilidiyle deneme | ⏳ | Tablette uygulama içi oynatma, kilit açıkken ve kapalıyken denenmeli. |

## 4. Pilot planı (4 hafta)

| Hafta | Amaç | Bakılacak yer |
|---|---|---|
| 1 | Başlangıç düzeyi | Her dersten 1 mini deneme ve konu başına 10 alıştırma. Veli paneli › Denemeler ve Öğrenme profili. |
| 2 | Öğrenme döngüsü | Her gün akıllı tekrar + 1 konu. Uyarılara göre müdahale. |
| 3 | Kalıcılık ve transfer | Gecikmeli hatırlama ve yeni sorulardaki başarı yükseliyor mu? |
| 4 | Karar | Net gelişimi, 7 ve 30 gün tekrar başarısı. İşe yaramayan derste anlatım + hata defteri öne alınır. |

Başarı ölçütü:
- Yardımsız başarı ile gecikmeli hatırlama birlikte artmalı.
- “Görülmüş soru” başarısı ile “yeni soru” başarısı arasındaki fark kapanmalı.

## 5. Yol haritası

1. **Sağlamlaştırma (1.7, büyük ölçüde tamam):** yedekleme ve geri yükleme, sunucu güvenliği, sürüm kapısı testleri.
2. **Ölçme kalitesi:** güven kalibrasyonu, hata türü doğrulama, zorluk tutarlılığı raporu, matematikte bağımsız cevap doğrulama.
3. **Öğrenme motoru:** ön koşul haritası, yanlıştan sonra ön koşula yönlendirme, uyarlanabilir haftalık plan.
4. **Veli paneli:** soru kayıtlarında süzgeçler, haftalık güvenilirlik raporu, ödül vitrini.
5. **Pilot:** 4 haftalık kullanım ve değerlendirme (bölüm 4).
6. **Genişletme:**
   - Sosyal Bilgiler ve Din Kültürü
   - Kitabın 2. cildi
   - Türkçe sesli okuma
   - Açık uçlu yazılı soruları
   - Konu özet kartları
   - Birden çok öğrenci profili
   - Günlük görev ve seri

## 6. Bundan sonraki küçük ve etkili adımlar

1. **Günlük görev ve seri (streak):** her gün 3 kısa görev ve kaç gün üst üste çalışıldığının sayılması.
2. **Türkçe sesli okuma:** okuma parçaları tabletin Türkçe sesiyle dinlenir. Altyapı İngilizce için hazır.
3. **Haftalık plan:** veli, hangi gün hangi dersin çalışılacağını seçer; ana sayfada “bugünün planı” görünür.
4. **Ödül vitrini:** puanlar biriktikçe veli tarafından belirlenen küçük ödüller.
