package tr.abc.ogrenme;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.InputStream;

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

        @Override
        public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
            // Ana pencere uygulama dışına (ör. youtube.com) gidemez; çocuk uygulamanın içinde kalır.
            return r.isForMainFrame() && !ALAN.equals(r.getUrl().getHost());
        }
    }

    private class Krom extends WebChromeClient {
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
        public String surum() {
            return "1.2";
        }
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
