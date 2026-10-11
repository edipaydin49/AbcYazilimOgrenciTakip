"""Maç sonu raporu: JSON + grafikli, tek dosya HTML."""
from __future__ import annotations

import base64
import html
import io
import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
from matplotlib.patches import Arc, Circle, Rectangle  # noqa: E402

from .pitch import CIRCLE_R, GOAL_BOX_L, GOAL_BOX_W, LENGTH, PENALTY_BOX_L, PENALTY_BOX_W, WIDTH  # noqa: E402


def _rgb(bgr):
    return tuple(c / 255 for c in bgr[::-1])


def _pitch(ax):
    lw, c = 1.2, "white"
    ax.add_patch(Rectangle((-2, -2), LENGTH + 4, WIDTH + 4, color="#2e7d32", zorder=0))
    ax.add_patch(Rectangle((0, 0), LENGTH, WIDTH, fill=False, ec=c, lw=lw))
    ax.plot([LENGTH / 2] * 2, [0, WIDTH], c=c, lw=lw)
    ax.add_patch(Circle((LENGTH / 2, WIDTH / 2), CIRCLE_R, fill=False, ec=c, lw=lw))
    for x0, s in ((0, 1), (LENGTH, -1)):
        ax.add_patch(Rectangle((x0 if s > 0 else x0 - PENALTY_BOX_L, (WIDTH - PENALTY_BOX_W) / 2), PENALTY_BOX_L, PENALTY_BOX_W, fill=False, ec=c, lw=lw))
        ax.add_patch(Rectangle((x0 if s > 0 else x0 - GOAL_BOX_L, (WIDTH - GOAL_BOX_W) / 2), GOAL_BOX_L, GOAL_BOX_W, fill=False, ec=c, lw=lw))
        ax.add_patch(Arc((x0 + s * 11, WIDTH / 2), 2 * CIRCLE_R, 2 * CIRCLE_R, theta1=-53 if s > 0 else 127, theta2=53 if s > 0 else 233, ec=c, lw=lw))
    ax.set_xlim(-2, LENGTH + 2)
    ax.set_ylim(WIDTH + 2, -2)
    ax.set_aspect("equal")
    ax.axis("off")


def _img(fig) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=110, bbox_inches="tight")
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode()


def figures(summary: dict, heatmaps: dict, possession_timeline: list) -> dict[str, str]:
    teams = summary["takimlar"]
    col = {k: _rgb(teams[k]["renk_bgr"]) for k in (0, 1)}
    figs = {}

    # Isı haritaları
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    for k, ax in zip((0, 1), axes):
        _pitch(ax)
        hm = heatmaps[k]
        if hm.max() > 0:
            ax.imshow(np.ma.masked_where(hm == 0, hm), extent=(0, LENGTH, WIDTH, 0), cmap="YlOrRd", alpha=0.75,
                      interpolation="nearest", zorder=1)
        ax.set_title(f"Takım {'AB'[k]} ısı haritası")
    figs["isi_haritasi"] = _img(fig)

    # Pas ağları + ortalama konumlar
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    for k, ax in zip((0, 1), axes):
        _pitch(ax)
        net = teams[k]["pas_agi"]
        nodes = {int(i): v for i, v in net["dugumler"].items()}
        mx = max([e["sayi"] for e in net["kenarlar"]] or [1])
        for e in net["kenarlar"]:
            a, b = nodes.get(e["kimden"]), nodes.get(e["kime"])
            if a and b:
                ax.plot([a[0], b[0]], [a[1], b[1]], c="white", lw=1 + 5 * e["sayi"] / mx, alpha=0.7)
        for pid, (x, y) in nodes.items():
            ax.scatter(x, y, s=260, color=col[k], edgecolors="black", zorder=3)
            ax.text(x, y, str(pid), ha="center", va="center", fontsize=7, zorder=4)
        ax.set_title(f"Takım {'AB'[k]} pas ağı ({teams[k]['dizilis']})")
    figs["pas_agi"] = _img(fig)

    # Sahiplik zaman çizgisi
    if possession_timeline:
        t = np.array([p[0] for p in possession_timeline])
        v = np.array([np.nan if p[1] is None else p[1] for p in possession_timeline], dtype=float)
        fig, ax = plt.subplots(figsize=(12, 1.6))
        for k in (0, 1):
            ax.fill_between(t, 0, 1, where=v == k, color=col[k], step="post", label=f"Takım {'AB'[k]}")
        ax.set_yticks([])
        ax.set_xlabel("saniye")
        ax.legend(loc="upper right", ncol=2, fontsize=8)
        ax.set_title("Topa sahip olma zaman çizgisi")
        figs["sahiplik"] = _img(fig)

    # Olay haritası (paslar, top kayıpları, şutlar)
    fig, ax = plt.subplots(figsize=(8, 5))
    _pitch(ax)
    sty = {"pas": ("-", 0.8), "top_kaybi": (":", 1.2), "sut": ("--", 2.0)}
    for e in summary["olaylar"]:
        if e["start"] and e["end"] and summary["kalibre"]:
            ls, lw = sty[e["type"]]
            ax.annotate("", xy=e["end"], xytext=e["start"], arrowprops=dict(arrowstyle="->", color=col.get(e["team"], "w"), ls=ls, lw=lw))
    ax.set_title("Olay haritası (düz: pas, noktalı: top kaybı, kesik: şut)")
    figs["olaylar"] = _img(fig)
    return figs


def write_report(out_dir: str | Path, summary: dict, heatmaps: dict, possession_timeline: list) -> Path:
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    (out / "rapor.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2, default=float), encoding="utf-8")
    figs = figures(summary, heatmaps, possession_timeline)
    T = summary["takimlar"]
    rows = [
        ("Topa sahip olma %", "topa_sahip_olma_%"), ("Diziliş", "dizilis"), ("Pas", "pas"), ("Pas isabeti %", "pas_isabet_%"),
        ("Top kaybı", "top_kaybi"), ("Şut (sezgisel)", "sut"), ("Ort. pas uzunluğu (m)", "ortalama_pas_uzunlugu_m"),
        ("Alan kontrolü % (Voronoi)", "alan_kontrolu_%"), ("Toplam mesafe (m)", "toplam_mesafe_m"), ("Sprint", "sprint"),
    ]
    team_rows = "".join(f"<tr><td>{a}</td><td>{T[0].get(k)}</td><td>{T[1].get(k)}</td></tr>" for a, k in rows)
    for key, lbl in (("genislik_m", "Genişlik (m)"), ("derinlik_m", "Derinlik (m)"), ("kompaktlik_m", "Kompaktlık (m)"), ("savunma_hatti_m", "Savunma hattı yüksekliği (m)")):
        team_rows += f"<tr><td>{lbl}</td><td>{T[0]['ortalama_sekil'].get(key)}</td><td>{T[1]['ortalama_sekil'].get(key)}</td></tr>"
    cols = ["id", "takim", "rol", "bolge", "sure_dk", "mesafe_m", "dakikada_mesafe_m", "max_hiz_kmh", "sprint", "topla_bulusma", "pas", "pas_alma", "top_kaybi", "pas_isabet_%"]
    ph = "".join(f"<th>{c}</th>" for c in cols) + "<th>Hız</th><th>Dayanıklılık</th><th>Yoğunluk</th><th>Katılım</th><th>Pas</th>"
    pr = ""
    for p in summary["oyuncular"]:
        pr += "<tr>" + "".join(f"<td>{'AB'[p[c]] if c == 'takim' else html.escape('-' if p[c] is None else str(p[c]))}</td>" for c in cols)
        pr += "".join(f"<td><div class='bar' style='width:{v or 0}%'></div>{'' if v is None else v}</td>" for v in p["puan"].values()) + "</tr>"
    imgs = "".join(f"<img src='data:image/png;base64,{b}'>" for b in figs.values())
    changes = "".join(f"<li>Takım {'AB'[k]}: " + ", ".join(f"{t}s → {f}" for t, f in T[k]["dizilis_degisimleri"]) + "</li>" for k in (0, 1))
    note = "" if summary["kalibre"] else "<p class='warn'>Saha kalibre edilmedi: konum, mesafe ve hız değerleri yaklaşıktır.</p>"
    page = f"""<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Maç Analiz Raporu</title><style>
body{{font-family:system-ui,sans-serif;margin:0 auto;max-width:1200px;padding:16px;background:#f6f7f9;color:#1d232b}}
table{{border-collapse:collapse;width:100%;background:#fff;margin:12px 0;font-size:13px}}td,th{{border:1px solid #dde1e6;padding:5px 7px;text-align:left}}
th{{background:#eef1f4}}img{{max-width:100%;display:block;margin:12px 0;background:#fff}}.warn{{color:#b3261e}}
.bar{{height:6px;background:#3b82f6;border-radius:3px}}.wrap{{overflow-x:auto}}</style></head><body>
<h1>Maç Analiz Raporu</h1><p>Süre: {summary['sure_s']} s · Kare: {summary['kare']} · Ortalama pres mesafesi: {summary['ortalama_pres_mesafesi_m']} m</p>{note}
<h2>Takım karşılaştırması</h2><table><tr><th></th><th>Takım A</th><th>Takım B</th></tr>{team_rows}</table>
<h3>Diziliş değişimleri</h3><ul>{changes}</ul>
<h2>Görseller</h2>{imgs}
<h2>Oyuncu profilleri</h2><p>Puanlar (0-100) bu videodaki verilerden türetilmiştir. Kimlik numaraları takip kimlikleridir (forma numarası değil).</p>
<div class="wrap"><table><tr>{ph}</tr>{pr}</table></div></body></html>"""
    path = out / "rapor.html"
    path.write_text(page, encoding="utf-8")
    return path
