package tr.abc.ogrenme;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Locale;

/**
 * Uygulamanın tamamı assets/web içindeki sayfalardır. Sayfalar https://appassets.androidplatform.net
 * adresinden sunulur; böylece YouTube oynatıcısı uygulama içinde çalışır ve veriler (IndexedDB)
 * kalıcı olarak cihazda saklanır.
 */
public class MainActivity extends Activity {
    private static final String ALAN = "appassets.androidplatform.net";
    private WebView web;
    private View tamEkran;
    private WebChromeClient.CustomViewCallback tamEkranGeri;
    private TextToSpeech ses;
    private volatile boolean sesHazir;
    private YerelSunucu sunucu;
    private boolean sunucuDuraklatildi;
    private ValueCallback<Uri[]> dosyaGeri;
    private static final int DOSYA_SEC = 41;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        requestWindowFeature(1); // Window.FEATURE_NO_TITLE
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setTextZoom(100);
        web.addJavascriptInterface(new Kopru(), "Android");
        web.setWebViewClient(new Istemci());
        web.setWebChromeClient(new Krom());
        setContentView(web);
        web.loadUrl("https://" + ALAN + "/index.html");
        // İngilizce sesli okuma: cihazın metin okuma motoru (önce İngiliz, yoksa Amerikan İngilizcesi)
        try {
            ses = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
                public void onInit(int durum) {
                    if (durum != TextToSpeech.SUCCESS || ses == null) return;
                    int r = ses.setLanguage(Locale.UK);
                    if (r < 0) r = ses.setLanguage(Locale.US);
                    sesHazir = r >= 0;
                }
            });
        } catch (Exception e) {
            ses = null;
        }
    }

    /* Uygulama arka plana geçince izleme sunucusu kapanır (ağda gereksiz açık kalmasın); öne gelince yeniden açılır. */
    @Override
    protected void onStop() {
        if (sunucu != null && sunucu.calisiyor()) { sunucu.durdur(); sunucuDuraklatildi = true; }
        super.onStop();
    }

    @Override
    protected void onStart() {
        super.onStart();
        if (sunucuDuraklatildi && sunucu != null) { sunucuDuraklatildi = false; sunucu.baslat(); }
    }

    /* Yedekten geri yükleme: sayfadaki <input type="file"> için Android dosya seçicisi */
    @Override
    protected void onActivityResult(int istek, int sonuc, Intent veri) {
        if (istek == DOSYA_SEC && dosyaGeri != null) {
            Uri[] secilen = null;
            if (sonuc == RESULT_OK && veri != null && veri.getData() != null) secilen = new Uri[] { veri.getData() };
            dosyaGeri.onReceiveValue(secilen);
            dosyaGeri = null;
            return;
        }
        super.onActivityResult(istek, sonuc, veri);
    }

    @Override
    protected void onDestroy() {
        if (sunucu != null) sunucu.durdur();
        if (ses != null) ses.shutdown();
        super.onDestroy();
    }

    private class Istemci extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
            Uri u = r.getUrl();
            if (!ALAN.equals(u.getHost())) return null;
            String yol = u.getPath();
            if (yol == null || yol.equals("/")) yol = "/index.html";
            try {
                InputStream in = getAssets().open("web" + yol);
                return new WebResourceResponse(tur(yol), "utf-8", in);
            } catch (Exception e) {
                return null;
            }
        }

        // API 24'te eklendi; derlemede kullanılan android.jar 23 olduğu için @Override yazılmaz (cihazda yine geçersiz kılar).
        public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
            // Ana pencere uygulama dışına (ör. youtube.com) gidemez; çocuk uygulamanın içinde kalır.
            return r.isForMainFrame() && !ALAN.equals(r.getUrl().getHost());
        }
    }

    private class Krom extends WebChromeClient {
        @Override
        public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> geri, FileChooserParams p) {
            if (dosyaGeri != null) dosyaGeri.onReceiveValue(null);
            dosyaGeri = geri;
            Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("*/*");
            i.putExtra(Intent.EXTRA_MIME_TYPES, new String[] { "application/json", "text/plain", "application/octet-stream" });
            try {
                startActivityForResult(i, DOSYA_SEC);
            } catch (Exception e) {
                dosyaGeri = null;
                return false;
            }
            return true;
        }

        @Override
        public void onShowCustomView(View v, CustomViewCallback c) {
            tamEkran = v;
            tamEkranGeri = c;
            setContentView(v);
        }

        @Override
        public void onHideCustomView() {
            if (tamEkran == null) return;
            tamEkran = null;
            setContentView(web);
            if (tamEkranGeri != null) tamEkranGeri.onCustomViewHidden();
            tamEkranGeri = null;
        }
    }

    /** Sayfaların çağırdığı Android işlevleri: window.Android.paylas(...) */
    private class Kopru {
        @JavascriptInterface
        public void paylas(final String baslik, final String metin) {
            runOnUiThread(new Runnable() {
                public void run() {
                    Intent i = new Intent(Intent.ACTION_SEND);
                    i.setType("text/plain");
                    i.putExtra(Intent.EXTRA_SUBJECT, baslik);
                    i.putExtra(Intent.EXTRA_TEXT, metin);
                    startActivity(Intent.createChooser(i, baslik));
                }
            });
        }

        @JavascriptInterface
        public boolean sesVar() {
            return sesHazir;
        }

        @JavascriptInterface
        public void konus(String metin, float hiz) {
            if (!sesHazir || ses == null) return;
            ses.setSpeechRate(hiz <= 0 ? 0.9f : hiz);
            ses.speak(metin, TextToSpeech.QUEUE_FLUSH, null, "ogrenme");
        }

        /* Bilgisayardan izleme: aynı Wi-Fi ağındaki tarayıcıya veli panelini sunar. Adresi döndürür (ör. http://192.168.1.34:8080). */
        @JavascriptInterface
        public String sunucuBaslat() {
            if (sunucu == null) sunucu = new YerelSunucu(new YerelSunucu.Kaynak() {
                public InputStream ac(String yol) throws Exception { return getAssets().open(yol); }
            });
            int port = sunucu.baslat();
            if (port < 0) return "";
            ekranAcik(true);
            return "http://" + YerelSunucu.ipAdresi() + ":" + port;
        }

        @JavascriptInterface
        public void sunucuDurdur() {
            if (sunucu != null) sunucu.durdur();
            ekranAcik(false);
        }

        @JavascriptInterface
        public String sunucuAdres() {
            if (sunucu == null || !sunucu.calisiyor()) return "";
            return "http://" + YerelSunucu.ipAdresi() + ":" + sunucu.port();
        }

        @JavascriptInterface
        public void veriGuncelle(String json, String pin) {
            if (sunucu != null) sunucu.veriGuncelle(json, pin);
        }

        @JavascriptInterface
        public String surum() {
            return "1.9";
        }

        /* Video tam ekranı: sistem çubuklarını gizler ve ekranı yatay çevirir (soru katmanı web sayfasında kalır). */
        @JavascriptInterface
        public void tamEkran(final boolean acik) {
            runOnUiThread(new Runnable() {
                public void run() {
                    View d = getWindow().getDecorView();
                    if (acik) {
                        d.setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
                        setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
                    } else {
                        d.setSystemUiVisibility(0);
                        setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
                    }
                }
            });
        }

        /* Yedek: veriyi tabletin İndirilenler/OgrenmeYolculugu klasörüne yazar (uygulama silinse de kalır).
         * Aynı adlı dosya bu uygulamaya aitse üzerine yazılır. Başarılıysa dosyanın yerini, değilse "" döndürür. */
        @JavascriptInterface
        public String yedekKaydet(String json, String ad) {
            if (ad == null || !ad.matches("[A-Za-z0-9_.-]{1,80}")) return "";
            try {
                byte[] b = json.getBytes("UTF-8");
                if (Build.VERSION.SDK_INT >= 29) {
                    ContentResolver cr = getContentResolver();
                    Uri koleksiyon = Uri.parse("content://media/external/downloads");
                    Uri hedef = null;
                    Cursor c = cr.query(koleksiyon, new String[] { "_id" }, "_display_name=? AND relative_path=?", new String[] { ad, "Download/OgrenmeYolculugu/" }, null);
                    if (c != null) {
                        if (c.moveToFirst()) hedef = Uri.withAppendedPath(koleksiyon, String.valueOf(c.getLong(0)));
                        c.close();
                    }
                    if (hedef == null) {
                        ContentValues d = new ContentValues();
                        d.put("_display_name", ad);
                        d.put("mime_type", "application/json");
                        d.put("relative_path", "Download/OgrenmeYolculugu");
                        hedef = cr.insert(koleksiyon, d);
                    }
                    if (hedef == null) return "";
                    OutputStream o = cr.openOutputStream(hedef, "wt");
                    o.write(b);
                    o.close();
                    return "İndirilenler/OgrenmeYolculugu/" + ad;
                }
                File k = new File(getExternalFilesDir(null), "yedek");
                k.mkdirs();
                FileOutputStream o = new FileOutputStream(new File(k, ad));
                o.write(b);
                o.close();
                return k.getAbsolutePath() + "/" + ad;
            } catch (Exception e) {
                return "";
            }
        }
    }

    /** Sunucu açıkken ekran kapanmasın (uygulama arka plana düşerse bağlantı kesilebilir). */
    private void ekranAcik(final boolean acik) {
        runOnUiThread(new Runnable() {
            public void run() {
                if (acik) getWindow().addFlags(128);   // WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                else getWindow().clearFlags(128);
            }
        });
    }

    private static String tur(String yol) {
        if (yol.endsWith(".html")) return "text/html";
        if (yol.endsWith(".js")) return "application/javascript";
        if (yol.endsWith(".css")) return "text/css";
        if (yol.endsWith(".json")) return "application/json";
        if (yol.endsWith(".svg")) return "image/svg+xml";
        if (yol.endsWith(".png")) return "image/png";
        return "application/octet-stream";
    }

    @Override
    public void onBackPressed() {
        if (tamEkran != null) {
            new Krom().onHideCustomView();
            return;
        }
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
