"""Android SDK olmadan APK derler.

Adımlar: javac (sahte Android imzalarıyla) → dx (classes.dex) → ikili AndroidManifest.xml ve
resources.arsc (bu dosyada yazılan kodlayıcılarla) → zip → zipalign → apksigner (v1 + v2 + v3 imza).
zipalign ve apksigner Ubuntu paketlerinden gelir: apt-get install zipalign apksigner (denetim için: aapt).
Hedef SDK 34: Android 16'nın Play Protect denetimi için güncel hedef ve v2/v3 imza gerekir;
35'te zorunlu kenardan kenara görünüm başlığı durum çubuğunun altına iteceği için 34'te kalındı.

Kullanım: python3 apk_derle.py [surum_kodu] [surum_adi]
Çıktı: UygulamaAPK/OgrenmeYolculugu.apk
"""
import os
import shutil
import struct
import subprocess
import sys
import zipfile
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
ANDROID = KOK / "android"
WEB = KOK / "web"
CACHE = KOK / "araclar" / ".cache"
GECICI = KOK / "araclar" / ".derleme"
ANAHTAR = KOK / "anahtar" / "ogrenme.jks"
CIKTI = KOK / "OgrenmeYolculugu.apk"

PAKET = "tr.abc.ogrenme"
UYGULAMA_ADI = "Öğrenme Yolculuğu"
SURUM_KODU = int(sys.argv[1]) if len(sys.argv) > 1 else 1
SURUM_ADI = sys.argv[2] if len(sys.argv) > 2 else "1.0"
DX_URL = "https://repo1.maven.org/maven2/com/jakewharton/android/repackaged/dalvik-dx/16.0.1/dalvik-dx-16.0.1.jar"


def calistir(*komut, **kw):
    print("$", " ".join(str(k) for k in komut))
    subprocess.run([str(k) for k in komut], check=True, **kw)


# ---------------------------------------------------------------- ikili XML (AXML)
ANDROID_NS = "http://schemas.android.com/apk/res/android"
ATTR_ID = {  # android.R.attr değerleri (sabit, tüm Android sürümlerinde aynı)
    "label": 0x01010001, "icon": 0x01010002, "name": 0x01010003, "exported": 0x01010010,
    "configChanges": 0x0101001f, "minSdkVersion": 0x0101020c, "versionCode": 0x0101021b,
    "versionName": 0x0101021c, "targetSdkVersion": 0x01010270,
}
T_REF, T_STR, T_DEC, T_HEX, T_BOOL = 0x01, 0x03, 0x10, 0x11, 0x12


def dize_havuzu(dizeler, utf8=True):
    veri = bytearray()
    ofsetler = []
    for d in dizeler:
        ofsetler.append(len(veri))
        if utf8:
            b = d.encode("utf-8")
            for n in (len(d), len(b)):
                veri += bytes([0x80 | (n >> 8), n & 0xFF]) if n > 0x7F else bytes([n])
            veri += b + b"\x00"
        else:
            b = d.encode("utf-16-le")
            veri += struct.pack("<H", len(d)) + b + b"\x00\x00"
    while len(veri) % 4:
        veri += b"\x00"
    baslik_boyu = 28
    dizi_basi = baslik_boyu + 4 * len(dizeler)
    toplam = dizi_basi + len(veri)
    return (struct.pack("<HHIIIIII", 0x0001, baslik_boyu, toplam, len(dizeler), 0,
                        0x100 if utf8 else 0, dizi_basi, 0)
            + b"".join(struct.pack("<I", o) for o in ofsetler) + bytes(veri))


def axml(kok):
    """kok: (etiket, [(ad, deger, tur, android_mi)], [cocuklar])"""
    attr_adlari = []

    def topla(e):
        for ad, _, _, ns in e[1]:
            if ns and ad not in attr_adlari:
                attr_adlari.append(ad)
        for c in e[2]:
            topla(c)
    topla(kok)
    attr_adlari.sort(key=lambda a: ATTR_ID[a])
    dizeler = list(attr_adlari)

    def idx(s):
        if s not in dizeler:
            dizeler.append(s)
        return dizeler.index(s)

    idx("android"), idx(ANDROID_NS)
    govde = bytearray()

    def dugum(e):
        etiket, attrlar, cocuklar = e
        attrlar = sorted(attrlar, key=lambda a: (0, ATTR_ID[a[0]]) if a[3] else (1, a[0]))
        parca = bytearray()
        for ad, deger, tur, ns in attrlar:
            ham = idx(deger) if tur == T_STR else 0xFFFFFFFF
            veri = {T_STR: lambda: idx(deger), T_BOOL: lambda: 0xFFFFFFFF if deger else 0}.get(tur, lambda: deger)()
            parca += struct.pack("<iIIHBBI", idx(ANDROID_NS) if ns else -1, idx(ad), ham, 8, 0, tur, veri)
        govde.extend(struct.pack("<HHIIiiIHHHHHH", 0x0102, 16, 36 + len(parca), 1, -1, -1, idx(etiket),
                                 20, 20, len(attrlar), 0, 0, 0) + parca)
        for c in cocuklar:
            dugum(c)
        govde.extend(struct.pack("<HHIIiiI", 0x0103, 16, 24, 1, -1, -1, idx(etiket)))

    dugum(kok)
    ns_bas = struct.pack("<HHIIiII", 0x0100, 16, 24, 1, -1, idx("android"), idx(ANDROID_NS))
    ns_son = struct.pack("<HHIIiII", 0x0101, 16, 24, 1, -1, idx("android"), idx(ANDROID_NS))
    havuz = dize_havuzu(dizeler)
    harita = struct.pack("<HHI", 0x0180, 8, 8 + 4 * len(attr_adlari)) + b"".join(
        struct.pack("<I", ATTR_ID[a]) for a in attr_adlari)
    icerik = havuz + harita + ns_bas + bytes(govde) + ns_son
    return struct.pack("<HHI", 0x0003, 8, 8 + len(icerik)) + icerik


def manifest():
    A = lambda ad, deger, tur: (ad, deger, tur, True)  # noqa: E731
    return axml(("manifest", [("package", PAKET, T_STR, False), A("versionCode", SURUM_KODU, T_DEC),
                              A("versionName", SURUM_ADI, T_STR)], [
        ("uses-sdk", [A("minSdkVersion", 24, T_DEC), A("targetSdkVersion", 34, T_DEC)], []),
        ("uses-permission", [A("name", "android.permission.INTERNET", T_STR)], []),
        ("application", [A("label", UYGULAMA_ADI, T_STR), A("icon", 0x7F010000, T_REF)], [
            ("activity", [A("name", PAKET + ".MainActivity", T_STR), A("exported", True, T_BOOL),
                          A("configChanges", 0x0DA0, T_HEX)], [  # orientation|screenSize|screenLayout|smallestScreenSize|keyboardHidden
                ("intent-filter", [], [
                    ("action", [A("name", "android.intent.action.MAIN", T_STR)], []),
                    ("category", [A("name", "android.intent.category.LAUNCHER", T_STR)], []),
                ]),
            ]),
        ]),
    ]))


# ---------------------------------------------------------------- resources.arsc (tek kaynak: simge)
def resources_arsc():
    genel = dize_havuzu(["res/mipmap/ic_launcher.png"])
    turler = dize_havuzu(["mipmap"])
    anahtarlar = dize_havuzu(["ic_launcher"])
    tur_ozellik = struct.pack("<HHIBBHI", 0x0202, 16, 20, 1, 0, 0, 1) + struct.pack("<I", 0)
    config = struct.pack("<I", 64) + bytes(60)
    baslik = 20 + len(config)
    girdiler_bas = baslik + 4
    girdi = struct.pack("<HHI", 8, 0, 0) + struct.pack("<HBBI", 8, 0, T_STR, 0)
    tur_parca = (struct.pack("<HHIBBHII", 0x0201, baslik, girdiler_bas + len(girdi), 1, 0, 0, 1, girdiler_bas)
                 + config + struct.pack("<I", 0) + girdi)
    ad = PAKET.encode("utf-16-le").ljust(256, b"\x00")
    paket_baslik = 288
    tur_ofset = paket_baslik
    anahtar_ofset = tur_ofset + len(turler)
    paket_govde = turler + anahtarlar + tur_ozellik + tur_parca
    paket = struct.pack("<HHII", 0x0200, paket_baslik, paket_baslik + len(paket_govde), 0x7F) + ad + struct.pack(
        "<IIIII", tur_ofset, 1, anahtar_ofset, 1, 0) + paket_govde
    icerik = genel + paket
    return struct.pack("<HHII", 0x0002, 12, 12 + len(icerik), 1) + icerik


# ---------------------------------------------------------------- simge
def simge(yol):
    from PIL import Image, ImageDraw
    n = 192
    im = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([8, 8, n - 8, n - 8], radius=44, fill=(36, 83, 199, 255))
    d.rounded_rectangle([44, 52, 148, 140], radius=10, fill=(255, 255, 255, 255))
    d.rectangle([94, 52, 98, 140], fill=(36, 83, 199, 255))
    for y in (72, 92, 112):
        d.rectangle([56, y, 86, y + 6], fill=(242, 182, 50, 255))
        d.rectangle([106, y, 136, y + 6], fill=(242, 182, 50, 255))
    d.polygon([(120, 132), (150, 132), (135, 164)], fill=(242, 182, 50, 255))
    im.save(yol)


# ---------------------------------------------------------------- derleme
def main():
    shutil.rmtree(GECICI, ignore_errors=True)
    (GECICI / "stub").mkdir(parents=True)
    (GECICI / "sinif").mkdir()
    CACHE.mkdir(parents=True, exist_ok=True)
    dx = CACHE / "dx.jar"
    if not dx.exists() or dx.stat().st_size < 100000:
        calistir("curl", "-sSfL", "-o", dx, DX_URL)

    stublar = [str(p) for p in (ANDROID / "stubs").rglob("*.java")]
    calistir("javac", "--release", "8", "-nowarn", "-d", GECICI / "stub", *stublar)
    kaynaklar = [str(p) for p in (ANDROID / "src").rglob("*.java")]
    calistir("javac", "--release", "8", "-nowarn", "-encoding", "UTF-8", "-cp", GECICI / "stub",
             "-d", GECICI / "sinif", *kaynaklar)
    calistir("java", "-cp", dx, "com.android.dx.command.Main", "--dex", "--min-sdk-version=24",
             f"--output={GECICI / 'classes.dex'}", GECICI / "sinif")

    simge(GECICI / "ic_launcher.png")
    imzasiz = GECICI / "imzasiz.apk"
    with zipfile.ZipFile(imzasiz, "w") as z:
        z.writestr(zipfile.ZipInfo("AndroidManifest.xml", (2026, 1, 1, 0, 0, 0)), manifest(), zipfile.ZIP_DEFLATED)
        z.writestr(zipfile.ZipInfo("resources.arsc", (2026, 1, 1, 0, 0, 0)), resources_arsc(), zipfile.ZIP_STORED)
        z.write(GECICI / "classes.dex", "classes.dex", zipfile.ZIP_DEFLATED)
        z.write(GECICI / "ic_launcher.png", "res/mipmap/ic_launcher.png", zipfile.ZIP_STORED)
        for p in sorted(WEB.rglob("*")):
            if p.is_file():
                z.write(p, "assets/web/" + p.relative_to(WEB).as_posix(), zipfile.ZIP_DEFLATED)

    if not ANAHTAR.exists():
        ANAHTAR.parent.mkdir(parents=True, exist_ok=True)
        calistir("keytool", "-genkeypair", "-keystore", ANAHTAR, "-storepass", "ogrenme6", "-keypass", "ogrenme6",
                 "-alias", "ogrenme", "-keyalg", "RSA", "-keysize", "2048", "-validity", "10000",
                 "-dname", "CN=Ogrenme Yolculugu, O=Aile, C=TR")
    hizali = GECICI / "hizali.apk"
    calistir("zipalign", "-p", "-f", "4", imzasiz, hizali)
    calistir("apksigner", "sign", "--ks", ANAHTAR, "--ks-pass", "pass:ogrenme6", "--ks-key-alias", "ogrenme",
             "--key-pass", "pass:ogrenme6", "--v1-signing-enabled", "true", "--v2-signing-enabled", "true",
             "--v3-signing-enabled", "true", "--v4-signing-enabled", "false", "--out", CIKTI, hizali)
    calistir("apksigner", "verify", "--min-sdk-version", "24", CIKTI)
    print(f"APK hazır: {CIKTI} ({CIKTI.stat().st_size / 1e6:.2f} MB)")


if __name__ == "__main__":
    main()
