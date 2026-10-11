// Sürüm kapısı: APK derlenmeden önce bütün testleri sırayla çalıştırır; biri bile başarısızsa çıkış kodu 1 olur.
// Kullanım: node araclar/tum_testler.js [ekran_goruntusu_klasoru]
const { spawnSync } = require("child_process"), path = require("path"), os = require("os"), fs = require("fs");
const KOK = path.join(__dirname, ".."), CIKTI = process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), "ogr-test-"));
const dersler = {
  mat: ["icerik", "mat_ek", "mat_ek2", "mat_tgs"], fen: ["fen", "fen1", "fen2", "fen3", "fen_ek1", "fen_ek2", "fen_tgs"],
  tr: ["tr", "tr1", "tr2", "tr3", "tr_ek1", "tr_ek2", "tr_tgs"], en: ["en", "en1", "en2", "en3", "en4", "en_ek1", "en_ek2", "en_tgs"],
};
const testler = [
  ...Object.entries(dersler).map(([d, l]) => ({ ad: "İçerik denetimi · " + d, arg: ["araclar/ders_dogrula.js", ...l.filter(f => fs.existsSync(path.join(KOK, "web/js", f + ".js"))).map(f => "web/js/" + f + ".js")], tamam: /SORUN: yok/ })),
  { ad: "Bütün içerik (soru üretimi)", arg: ["araclar/icerik_test.js"], tamam: /sorunlu 0 .*hata 0/ },
  { ad: "Arayüz (uçtan uca)", arg: ["araclar/arayuz_test.js", CIKTI], tamam: /HATALAR: yok/ },
  { ad: "Türkçe Diyarı", arg: ["araclar/oyun_test.js", CIKTI], tamam: /HATALAR: yok/ },
  { ad: "İngilizce oyunları", arg: ["araclar/ingoyun_test.js", CIKTI], tamam: /HATALAR: yok/ },
  { ad: "Videolar", arg: ["araclar/video_test.js"], tamam: /HATALAR: yok|SORUN: yok/ },
  { ad: "Bilgisayardan izleme (Java sunucu)", arg: ["araclar/uzak_test.js", CIKTI], tamam: /HATALAR: yok/ },
];
let kotu = 0;
for (const t of testler) {
  const bas = Date.now();
  const r = spawnSync("node", t.arg, { cwd: KOK, encoding: "utf8", timeout: 15 * 60 * 1000, maxBuffer: 64 * 1024 * 1024 });
  const cikti = (r.stdout || "") + (r.stderr || "");
  const ok = r.status === 0 && t.tamam.test(cikti);
  if (!ok) kotu++;
  console.log(`${ok ? "✓" : "✗"} ${t.ad} (${Math.round((Date.now() - bas) / 1000)} sn)`);
  if (!ok) console.log(cikti.split("\n").slice(-15).map(x => "    " + x).join("\n"));
}
console.log(kotu ? `\n${kotu} test BAŞARISIZ — APK derlemeyin.` : "\nBütün testler geçti.");
process.exit(kotu ? 1 : 0);
