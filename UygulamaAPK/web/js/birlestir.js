/* Dersleri birleştirir: bütün derslerin temaları, konuları ve kazanımları tek yerde toplanır;
 * soru üretme, yazılı sınav kapsamları ve konu videoları buradan sağlanır.
 */
(function () {
  "use strict";
  const { sec } = OGR;
  const DERSLER = DERS_LISTESI;
  const TEMALAR = [], KONULAR = [];
  for (const d of DERSLER) {
    for (const k of d.konular) { k.ders = d.id; KONULAR.push(k); }
    for (const t of d.temalar) TEMALAR.push({ ...t, ders: d.id, konular: d.konular.filter(k => k.tema === t.id).map(k => k.id) });
    d.temaListesi = TEMALAR.filter(t => t.ders === d.id);
  }
  const DERS = Object.fromEntries(DERSLER.map(d => [d.id, d]));
  const TEMA = Object.fromEntries(TEMALAR.map(t => [t.id, t]));
  const KONU = Object.fromEntries(KONULAR.map(k => [k.id, k]));
  const KAZANIM = {};
  KONULAR.forEach(k => k.kazanimlar.forEach(z => { KAZANIM[z.id] = { ...z, konu: k.id, tema: k.tema, ders: k.ders }; }));

  /* Bir kazanımdan, istenen zorluğa en yakın ve yakın zamanda sorulmamış bir soru üretir. */
  const sonSorulan = [];
  function soruUret(kazId, zorluk) {
    const konu = KONU[KAZANIM[kazId].konu];
    const ureteçler = konu.uret[kazId];
    let enIyi = null, enIyiPuan = Infinity;
    for (let deneme = 0; deneme < 30; deneme++) {
      const s = sec(ureteçler)(zorluk || 2);
      if (!s) continue;
      const anahtar = s.soru + "|" + s.secenekler.map(x => x.m).sort().join("|");
      const puan = (zorluk ? Math.abs(s.zorluk - zorluk) : 0) + (sonSorulan.includes(anahtar) ? 5 : 0);
      if (puan < enIyiPuan) { enIyi = s; enIyi._anahtar = anahtar; enIyiPuan = puan; }
      if (puan === 0) break;
    }
    sonSorulan.push(enIyi._anahtar); if (sonSorulan.length > 80) sonSorulan.shift();
    delete enIyi._anahtar;
    enIyi.id = kazId + ":" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    enIyi.konu = konu.id; enIyi.tema = konu.tema; enIyi.ders = konu.ders;
    if (!enIyi.kural && konu.kurallar) enIyi.kural = konu.kurallar[kazId] || null;
    return enIyi;
  }

  /* Yazılı sınavlar: her dersin varsayılan kapsamı, veli panelinden değiştirilebilir (DEPO.ayar.yazililar). */
  const YAZILILAR = [
    { id: "d1y1", ad: "1. Dönem 1. Yazılı", kisa: "1. dönem · 1. yazılı" },
    { id: "d1y2", ad: "1. Dönem 2. Yazılı", kisa: "1. dönem · 2. yazılı" },
    { id: "d2y1", ad: "2. Dönem 1. Yazılı", kisa: "2. dönem · 1. yazılı" },
    { id: "d2y2", ad: "2. Dönem 2. Yazılı", kisa: "2. dönem · 2. yazılı" },
  ];
  function yaziliKapsam(dersId, yaziliId) {
    const ozel = window.DEPO && DEPO.ayar.yazililar && DEPO.ayar.yazililar[dersId + "." + yaziliId];
    const l = (ozel && ozel.konular) || (DERS[dersId].yazililar || {})[yaziliId] || [];
    return l.filter(k => KONU[k]);
  }
  function yaziliTarih(dersId, yaziliId) {
    const ozel = window.DEPO && DEPO.ayar.yazililar && DEPO.ayar.yazililar[dersId + "." + yaziliId];
    return ozel && ozel.tarih || "";
  }

  window.ICERIK = { DERSLER, DERS, TEMALAR, TEMA, KONULAR, KONU, KAZANIM, YAZILILAR, yaziliKapsam, yaziliTarih, soruUret, yardim: OGR };
  window.DUZEY_AD = { hatirlama: "Bilgiyi hatırlama", aciklama: "Kavramı açıklama", uygulama: "Örnek üzerinde uygulama", transfer: "Yeni nesil / transfer", baglanti: "Önceki konularla bağlantı" };
  window.HATA_AD = { bilgi: "Bilgi eksikliği", kavrama: "Kavrama hatası", islem: "İşlem hatası", dikkat: "Dikkat / okuduğunu anlama", strateji: "Zaman yönetimi / strateji" };
  window.HATA_ONERI = {
    bilgi: "Konunun ilgili bölümünü yeniden anlatın; kuralı ya da tanımı birlikte tekrar edin.",
    kavrama: "Görsel anlatım ve farklı örnekler sunun; kavramı kendi cümleleriyle anlatmasını isteyin.",
    islem: "Adım adım çözüm çalışması yaptırın; her adımı yazarak ilerlemesini sağlayın.",
    dikkat: "Soruda verilenleri ve isteneni ayrı ayrı işaretletin; olumsuz ifadelerin altını çizdirin.",
    strateji: "Alternatif çözüm yollarını gösterin ve süreli kısa alıştırmalar yaptırın.",
  };
})();
