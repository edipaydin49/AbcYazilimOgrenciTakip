/* İstatistik motoru: olay günlüğünden bütün ölçümleri hesaplar.
 *
 * Olay türleri (depo.js ile kaydedilir):
 *  soru    : { konu, kaz, duzey, zorluk, mod, testId, ilkDogru, sonDogru, deneme, ilkSure, toplamSure, ipucu,
 *              cozumGoruldu, terk, ilkHata, kendiHata, kontrol, soruNesnesi }
 *  test    : { testId, tur, konu, tema, n, dogru, sure, oz, kendiIstegi }
 *  video   : { konu, vid, toplam, izlenen, oynatilan, geriSarma, ileriSarma, duraklatma, bolumAcma:{i:sayı}, bitti }
 *  durak   : { konu, kaynak: "video"|"metin", bolum, dogru, sure }
 *  anlatim : { konu, okunan, toplam, bitti }
 *  oturum  : { bas, son, aktifSn, kesinti }
 *  hataDefteri : { } (öğrencinin önceki yanlışlarına dönmesi)
 */
(function () {
  "use strict";
  const GUN = 86400000;
  const TEKRAR_GUNLERI = [1, 3, 7, 30];
  const oran = (a, b) => (b ? a / b : null);
  const ort = a => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  const gunNo = t => Math.floor((t - new Date(t).getTimezoneOffset() * 60000) / GUN);
  const bugunNo = () => gunNo(Date.now());

  function guven(n) {
    if (n >= 15) return { ad: "Yüksek", n };
    if (n >= 5) return { ad: "Orta", n };
    return { ad: "Düşük", n };
  }

  /* Soru kayıtları için ortak ölçümler */
  function soruOlcumleri(sorular) {
    const cevaplanan = sorular.filter(s => !s.terk);
    const ilkDogru = cevaplanan.filter(s => s.ilkDogru).length;
    const sonDogru = cevaplanan.filter(s => s.sonDogru).length;
    const ilkYanlis = cevaplanan.filter(s => !s.ilkDogru && s.deneme >= 2);
    const ipucuyla = cevaplanan.filter(s => s.ipucu);
    const kontrol = cevaplanan.filter(s => s.kontrol);
    return {
      n: sorular.length,
      cevaplanan: cevaplanan.length,
      ilkDeneme: oran(ilkDogru, cevaplanan.length),
      sonDeneme: oran(sonDogru, cevaplanan.length),
      ortSure: ort(cevaplanan.map(s => s.ilkSure).filter(Boolean)),
      terk: oran(sorular.filter(s => s.terk).length, sorular.length),
      ipucuOrani: oran(ipucuyla.length, cevaplanan.length),
      ipucuylaCozulen: oran(ipucuyla.filter(s => s.sonDogru).length, sonDogru),
      ipucusuzCozme: oran(cevaplanan.filter(s => s.ilkDogru && !s.ipucu && !s.cozumGoruldu).length, cevaplanan.length),
      duzeltme: oran(ilkYanlis.filter(s => s.sonDogru).length, ilkYanlis.length),
      duzeltmeN: ilkYanlis.length,
      cozumSonrasi: oran(kontrol.filter(s => s.ilkDogru).length, kontrol.length),
      cozumSonrasiN: kontrol.length,
    };
  }

  function gruplaOlcum(sorular, anahtar, degerler) {
    const s = {};
    for (const d of degerler) {
      const grup = sorular.filter(x => String(x[anahtar]) === String(d) && !x.terk);
      s[d] = { basari: oran(grup.filter(x => x.ilkDogru).length, grup.length), n: grup.length };
    }
    return s;
  }

  /* Ana hesap: isteğe bağlı zaman aralığı (gün) ve konu süzgeci */
  function hesapla({ gun = null, konu = null } = {}) {
    const sinir = gun ? Date.now() - gun * GUN : 0;
    const sec = tip => DEPO.liste(tip).filter(o => o.t >= sinir && (!konu || o.konu === konu));
    const sorular = sec("soru");
    const testler = sec("test");
    const videolar = sec("video");
    const duraklar = sec("durak");
    const anlatimlar = sec("anlatim");
    const oturumlar = DEPO.liste("oturum").filter(o => o.t >= sinir);

    const genel = soruOlcumleri(sorular);
    const zorluk = gruplaOlcum(sorular, "zorluk", [1, 2, 3]);
    const duzey = gruplaOlcum(sorular, "duzey", ["hatirlama", "aciklama", "uygulama", "transfer", "baglanti"]);

    // Hata türleri: sistemin çıkardığı (çeldiricinin türü) ve öğrencinin kendi söylediği
    const hataSay = {}, kendiSay = {};
    sorular.forEach(s => { if (s.ilkHata) hataSay[s.ilkHata] = (hataSay[s.ilkHata] || 0) + 1; if (s.kendiHata) kendiSay[s.kendiHata] = (kendiSay[s.kendiHata] || 0) + 1; });
    // Aynı hata türünün aynı kazanımda tekrar etmesi
    const kazHata = {};
    sorular.filter(s => s.ilkHata).forEach(s => { const k = s.kaz + "|" + s.ilkHata; kazHata[k] = (kazHata[k] || 0) + 1; });
    const tekrarEdenHata = Object.entries(kazHata).filter(([, n]) => n >= 2).map(([k, n]) => ({ kaz: k.split("|")[0], hata: k.split("|")[1], n })).sort((a, b) => b.n - a.n);
    const hataTekrarOrani = oran(tekrarEdenHata.reduce((a, x) => a + x.n - 1, 0), sorular.filter(s => s.ilkHata).length);

    // Kazanım haritası
    const kazanim = {};
    const kazGrup = {};
    sorular.forEach(s => (kazGrup[s.kaz] = kazGrup[s.kaz] || []).push(s));
    for (const [id, k] of Object.entries(ICERIK.KAZANIM)) {
      if (konu && k.konu !== konu) continue;
      const ks = kazGrup[id] || [];
      const o = soruOlcumleri(ks);
      const son = ks.filter(s => !s.terk).slice(-8);
      const ustalik = son.length ? son.reduce((a, s, i) => a + (s.ilkDogru ? 1 : 0) * (i + 1), 0) / son.reduce((a, _, i) => a + i + 1, 0) : null;
      kazanim[id] = { ...o, ustalik, guven: guven(o.cevaplanan), ad: k.ad, konu: k.konu, tema: k.tema };
    }

    // Konu düzeyi: anlatım, video, durak, konu sonu test, tekrar testleri
    const konuOzet = {};
    for (const k of ICERIK.KONULAR) {
      if (konu && k.id !== konu) continue;
      const ks = sorular.filter(s => s.konu === k.id);
      const vid = videolar.filter(v => v.konu === k.id);
      const toplamSn = Math.max(0, ...vid.map(v => v.toplam || 0));
      const izlenenSn = Math.max(0, ...vid.map(v => v.izlenen || 0));     // her oturumda biriken benzersiz saniye
      const oynatilanSn = vid.reduce((a, v) => a + (v.oynatilan || 0), 0);
      const bolumAcma = {};
      vid.forEach(v => Object.entries(v.bolumAcma || {}).forEach(([i, n]) => { bolumAcma[i] = (bolumAcma[i] || 0) + n; }));
      const dur = duraklar.filter(d => d.konu === k.id);
      const anl = anlatimlar.filter(a => a.konu === k.id);
      const ksTest = testler.filter(t => t.konu === k.id && t.tur === "konuSonu");
      const tekrar = {};
      TEKRAR_GUNLERI.forEach(g => { const t = testler.filter(x => x.konu === k.id && x.tur === "tekrar" + g); tekrar[g] = t.length ? oran(t[t.length - 1].dogru, t[t.length - 1].n) : null; });
      konuOzet[k.id] = {
        ad: k.ad, tema: k.tema, ...soruOlcumleri(ks),
        video: vid.length ? {
          tamamlama: oran(izlenenSn, toplamSn), aktif: oran(oynatilanSn, toplamSn), geriSarma: vid.reduce((a, v) => a + (v.geriSarma || 0), 0),
          ileriSarma: vid.reduce((a, v) => a + (v.ileriSarma || 0), 0), duraklatma: vid.reduce((a, v) => a + (v.duraklatma || 0), 0),
          oturum: vid.length, bolumAcma, tekrarlananBolumler: Object.entries(bolumAcma).filter(([, n]) => n > 1).map(([i]) => +i),
          toplamSn, izlenenSn, oynatilanSn,
        } : null,
        anlatim: anl.length ? { okunan: Math.max(...anl.map(a => a.okunan)), toplam: anl[0].toplam, bitti: anl.some(a => a.bitti) } : null,
        durak: { basari: oran(dur.filter(d => d.dogru).length, dur.length), n: dur.length },
        konuSonu: ksTest.length ? { ilk: oran(ksTest[0].dogru, ksTest[0].n), son: oran(ksTest[ksTest.length - 1].dogru, ksTest[ksTest.length - 1].n), sayi: ksTest.length } : null,
        tekrar,
      };
    }

    // Çalışma alışkanlıkları
    const gunluk = {};
    oturumlar.forEach(o => { const g = gunNo(o.t); gunluk[g] = (gunluk[g] || 0) + o.aktifSn / 60; });
    const gunSay = gun || Math.max(1, bugunNo() - (oturumlar.length ? gunNo(oturumlar[0].t) : bugunNo()) + 1);
    const toplamDk = oturumlar.reduce((a, o) => a + o.aktifSn, 0) / 60;
    const planDk = DEPO.ayar.gunlukHedefDk * gunSay;
    const ozler = testler.filter(t => t.oz);
    const calisma = {
      toplamDk, gunlukOrtDk: toplamDk / gunSay, planDk, planFarkDk: toplamDk - planDk,
      hedefTutanGun: Object.values(gunluk).filter(d => d >= DEPO.ayar.gunlukHedefDk).length, gunSay,
      kesinti: oturumlar.reduce((a, o) => a + (o.kesinti || 0), 0), oturumSayisi: oturumlar.length,
      testSayisi: testler.length, tamamlananKonu: new Set(testler.filter(t => t.tur === "konuSonu" && oran(t.dogru, t.n) >= 0.7).map(t => t.konu)).size,
      kendiTekrari: testler.filter(t => t.kendiIstegi).length,
      hataDefteriDonus: DEPO.liste("hataDefteri").filter(o => o.t >= sinir).length,
      yardimsiz: genel.ipucusuzCozme,
      ozDegerlendirme: ozler.length ? { ort: ort(ozler.map(t => t.oz)), gercek: ort(ozler.map(t => oran(t.dogru, t.n) * 5)) } : null,
      gunluk,
    };

    // Tekrar (aralıklı) testlerinin genel başarısı
    const tekrarBasari = {};
    TEKRAR_GUNLERI.forEach(g => { const t = testler.filter(x => x.tur === "tekrar" + g); tekrarBasari[g] = { basari: oran(t.reduce((a, x) => a + x.dogru, 0), t.reduce((a, x) => a + x.n, 0)), n: t.length }; });
    const ilkOgrenme = testler.filter(x => x.tur === "konuSonu");
    tekrarBasari[0] = { basari: oran(ilkOgrenme.reduce((a, x) => a + x.dogru, 0), ilkOgrenme.reduce((a, x) => a + x.n, 0)), n: ilkOgrenme.length };

    // Konu sonu testleri ve denemeler
    const testTur = {};
    testler.forEach(t => { const k = t.tur.startsWith("tekrar") ? "tekrar" : t.tur; (testTur[k] = testTur[k] || { dogru: 0, n: 0, sayi: 0 }); testTur[k].dogru += t.dogru; testTur[k].n += t.n; testTur[k].sayi++; });

    return { genel, zorluk, duzey, hataSay, kendiSay, tekrarEdenHata, hataTekrarOrani, kazanim, konuOzet, calisma, tekrarBasari, testTur, sorular, testler };
  }

  /* Günlük başarı ve süre serisi (grafikler için) */
  function gunlukSeri(gunSayisi = 14) {
    const bas = bugunNo() - gunSayisi + 1;
    const seri = [];
    const sinir = Date.now() - (gunSayisi + 1) * GUN;
    const gunler = {};
    for (const x of DEPO.liste("soru")) if (x.t >= sinir && !x.terk) { const g = gunNo(x.t); (gunler[g] = gunler[g] || { d: 0, n: 0, sn: 0 }); gunler[g].n++; if (x.ilkDogru) gunler[g].d++; }
    for (const o of DEPO.liste("oturum")) if (o.t >= sinir) { const g = gunNo(o.t); (gunler[g] = gunler[g] || { d: 0, n: 0, sn: 0 }); gunler[g].sn += o.aktifSn; }
    for (let g = bas; g <= bugunNo(); g++) {
      const x = gunler[g] || { d: 0, n: 0, sn: 0 };
      seri.push({ gun: g, basari: x.n ? x.d / x.n : null, n: x.n, dk: x.sn / 60 });
    }
    return seri;
  }

  /* Aralıklı tekrar planı: konu sonu testinden 1, 3, 7 ve 30 gün sonra */
  function tekrarPlani() {
    const testler = DEPO.liste("test");
    const plan = [];
    for (const k of ICERIK.KONULAR) {
      const ilk = testler.find(t => t.konu === k.id && t.tur === "konuSonu");
      if (!ilk) continue;
      for (const g of TEKRAR_GUNLERI) {
        const yapildi = testler.find(t => t.konu === k.id && t.tur === "tekrar" + g);
        const zaman = ilk.t + g * GUN;
        plan.push({ konu: k.id, gun: g, zaman, yapildi: !!yapildi, sonuc: yapildi ? oran(yapildi.dogru, yapildi.n) : null, vadesi: !yapildi && Date.now() >= zaman - 3 * 3600000 });
      }
    }
    return plan;
  }

  /* Uyarlanabilir zorluk: kazanımdaki son cevaplara göre 1–3 */
  function onerilenZorluk(kazId) {
    const son = DEPO.liste("soru").filter(s => s.kaz === kazId && !s.terk).slice(-6);
    if (son.length < 2) return 1;
    const b = son.filter(s => s.ilkDogru).length / son.length;
    return b < 0.5 ? 1 : b < 0.8 ? 2 : 3;
  }

  /* Sonraki çalışma önerisi */
  function oneri(hazir) {
    const plan = tekrarPlani().filter(p => p.vadesi);
    if (plan.length) return { tur: "tekrar", konu: plan[0].konu, gun: plan[0].gun, metin: `${ICERIK.KONU[plan[0].konu].ad} için ${plan[0].gun}. gün tekrar testi zamanı geldi.` };
    const h = hazir || hesapla({});
    const zayif = Object.entries(h.kazanim).filter(([, k]) => k.cevaplanan >= 4 && k.ustalik !== null && k.ustalik < 0.6).sort((a, b) => a[1].ustalik - b[1].ustalik);
    if (zayif.length) return { tur: "alistirma", konu: zayif[0][1].konu, metin: `“${zayif[0][1].ad}” konusunda biraz daha alıştırma iyi gelir.` };
    for (const k of ICERIK.KONULAR) {
      const ks = h.konuOzet[k.id];
      if (!ks.konuSonu) {
        if (!ks.anlatim && !ks.video) return { tur: "anlatim", konu: k.id, metin: `Sıradaki konu: ${k.ad}. Önce konu anlatımını izle.` };
        return { tur: ks.n < 8 ? "alistirma" : "konuSonu", konu: k.id, metin: ks.n < 8 ? `${k.ad} konusunda alıştırma yap.` : `${k.ad} konu sonu testine hazırsın.` };
      }
    }
    return { tur: "deneme", metin: "Bütün konuları tamamladın. Genel deneme ile kendini sına!" };
  }

  /* Güçlü ve tekrar edilmesi gereken kazanımlar */
  function gucluZayif(h) {
    const k = Object.entries(h.kazanim).filter(([, x]) => x.cevaplanan >= 3);
    return {
      guclu: k.filter(([, x]) => x.ilkDeneme >= 0.8).sort((a, b) => b[1].ilkDeneme - a[1].ilkDeneme).slice(0, 5),
      zayif: k.filter(([, x]) => x.ilkDeneme < 0.6).sort((a, b) => a[1].ilkDeneme - b[1].ilkDeneme).slice(0, 5),
    };
  }

  window.ANALIZ = { hesapla, gunlukSeri, tekrarPlani, onerilenZorluk, oneri, gucluZayif, guven, gunNo, bugunNo, TEKRAR_GUNLERI, GUN };
})();
