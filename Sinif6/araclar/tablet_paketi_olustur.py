"""Bütün sayfaları TEK bir HTML dosyasında birleştirir (tablete kopyalanıp doğrudan açılsın diye).

Çıktı: depo kökünde 6Sinif_EgitimSeti_Tablet.html
Dosya açıldığında ana sayfa görünür; bir derse dokununca o sayfa tam ekran açılır,
"Ana sayfa" düğmesiyle geri dönülür. İnternet gerekmez (yalnızca yazı tipi internetten
gelir, yoksa tabletin kendi yazı tipi kullanılır).
"""
import json
import sys
from pathlib import Path

BURA = Path(__file__).parent
sys.path.insert(0, str(BURA))
from ana_sayfa_olustur import DEPO, SAYFALAR, SINIF, olustur  # noqa: E402

BASLIKLAR = {
    "INGILIZCE": "İngilizce Soru Üretici", "KART": "Kelime Kartları", "MATEMATIK": "Matematik 6",
    "CARPAN": "Çarpanlar ve Katlar", "KUP": "Küp Soruları", "TURKCE": "Söz Varlığı",
    "MACERA": "Türkçe Macerası", "FEN": "Fen Bilimleri 6", "SOSYAL": "Sosyal Bilgiler 6", "DIN": "Din Kültürü 6",
}

sayfalar = {k: {"baslik": BASLIKLAR[k], "html": (SINIF / yol).resolve().read_text(encoding="utf-8")}
            for k, (yol, _) in SAYFALAR.items()}
# Gömülü JSON içinde "<" karakterleri kaçışlanır; böylece </script> ve <!-- ana sayfayı bozamaz.
veri = json.dumps(sayfalar, ensure_ascii=False).replace("<", "\\u003c")

ana = olustur({k: "#" + k for k in SAYFALAR})
kabuk = """
<style>
#cerceve { position: fixed; inset: 0; z-index: 50; background: var(--paper); display: flex; flex-direction: column; }
#cerceve[hidden] { display: none; }
#cerceveUst { display: flex; align-items: center; gap: 12px; padding: calc(env(safe-area-inset-top, 0px) + 8px) 12px 8px; background: var(--sheet); border-bottom: 1px solid var(--line); }
#cerceveUst button { font: 800 1rem var(--font-body); border-radius: 12px; padding: 9px 14px; border: 2px solid var(--cobalt); background: var(--cobalt); color: var(--sheet); cursor: pointer; }
#cerceveUst span { font: 800 1.1rem var(--font-display); }
#cerceve iframe { flex: 1; width: 100%; border: 0; background: var(--paper); }
</style>
<div id="cerceve" hidden>
  <div id="cerceveUst"><button type="button" id="anaDon">← Ana sayfa</button><span id="cerceveBaslik"></span></div>
  <iframe id="sayfa" title="Ders sayfası"></iframe>
</div>
<script type="application/json" id="sayfaVerisi">__VERI__</script>
<script>
const SAYFALAR = JSON.parse(document.getElementById("sayfaVerisi").textContent);
const cerceve = document.getElementById("cerceve"), sayfa = document.getElementById("sayfa");
let acik = null;
function ac(anahtar) {
  const s = SAYFALAR[anahtar];
  if (!s) { kapat(); return; }
  if (acik !== anahtar) { sayfa.srcdoc = s.html; acik = anahtar; }
  document.getElementById("cerceveBaslik").textContent = s.baslik;
  cerceve.hidden = false;
  document.body.style.overflow = "hidden";
}
function kapat() {
  cerceve.hidden = true;
  document.body.style.overflow = "";
  try { sayfa.contentWindow.speechSynthesis && sayfa.contentWindow.speechSynthesis.cancel(); } catch (e) {}
}
function hashIsle() { const k = location.hash.slice(1); if (SAYFALAR[k]) ac(k); else kapat(); }
window.addEventListener("hashchange", hashIsle);
document.getElementById("anaDon").addEventListener("click", () => {
  if (location.hash) history.pushState("", document.title, location.pathname + location.search);
  kapat();
});
hashIsle();
</script>
""".replace("__VERI__", veri)

cikti = DEPO / "6Sinif_EgitimSeti_Tablet.html"
cikti.write_text('<!doctype html>\n<html lang="tr">\n' + ana + kabuk + "</html>\n", encoding="utf-8")
print(f"Tablet paketi: {cikti.name} ({cikti.stat().st_size / 1e6:.1f} MB)")
