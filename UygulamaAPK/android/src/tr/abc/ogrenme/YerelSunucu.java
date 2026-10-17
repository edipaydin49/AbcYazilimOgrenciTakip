package tr.abc.ogrenme;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.util.Collections;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Aynı Wi-Fi ağındaki bilgisayardan veli panelini görmek için küçük HTTP sunucusu.
 * Yalnızca GET: uygulamanın sayfaları (assets/web) ve şifreyle korunan /api/veri (öğrenci kayıtları).
 * Şifre adres satırında değil "X-Pin" başlığında gelir (tarayıcı geçmişine ve kayıtlara düşmez).
 * Sınırlar: aynı anda en çok 8 bağlantı, istek satırı 2 KB, başlıklar 8 KB, 10 sn zaman aşımı;
 * 5 hatalı şifreden sonra 1 dakika kilit. Not: bağlantı şifrelenmemiş HTTP'dir; yalnızca güvendiğiniz ev ağında kullanın.
 * Android'e bağımlı değildir; dosyalar Kaynak arayüzüyle okunur (bilgisayarda da test edilebilir).
 */
public class YerelSunucu {
    public interface Kaynak {
        InputStream ac(String yol) throws Exception;
    }

    private final Kaynak kaynak;
    private ServerSocket soket;
    private volatile String veri;   // tabletteki uygulamanın en son gönderdiği kayıtlar (JSON)
    private volatile String pin;
    private int hataliDeneme = 0;
    private long kilitBitis = 0;
    private final AtomicInteger acikBaglanti = new AtomicInteger();
    static final int EN_COK_BAGLANTI = 8, SATIR_SINIRI = 2048, BASLIK_SINIRI = 8192;

    public YerelSunucu(Kaynak kaynak) {
        this.kaynak = kaynak;
    }

    public synchronized int baslat() {
        if (soket != null) return soket.getLocalPort();
        for (int port = 8080; port <= 8090 && soket == null; port++) {
            try { soket = new ServerSocket(port); } catch (Exception e) { soket = null; }
        }
        if (soket == null) return -1;
        final ServerSocket ss = soket;
        Thread t = new Thread(new Runnable() {
            public void run() {
                while (!ss.isClosed()) {
                    try {
                        final Socket s = ss.accept();
                        if (acikBaglanti.incrementAndGet() > EN_COK_BAGLANTI) { acikBaglanti.decrementAndGet(); try { s.close(); } catch (Exception x) { } continue; }
                        Thread i = new Thread(new Runnable() { public void run() { istek(s); } });
                        i.setDaemon(true);
                        i.start();
                    } catch (Exception e) { /* soket kapatıldı */ }
                }
            }
        });
        t.setDaemon(true);
        t.start();
        return ss.getLocalPort();
    }

    public synchronized void durdur() {
        try { if (soket != null) soket.close(); } catch (Exception e) { }
        soket = null;
    }

    public synchronized boolean calisiyor() {
        return soket != null && !soket.isClosed();
    }

    public synchronized int port() {
        return calisiyor() ? soket.getLocalPort() : -1;
    }

    public void veriGuncelle(String json, String p) {
        veri = json;
        pin = p;
    }

    /** Wi-Fi ağındaki IPv4 adresi (ör. 192.168.1.34). Bulunamazsa boş. */
    public static String ipAdresi() {
        String yedek = "";
        try {
            for (NetworkInterface ni : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                if (!ni.isUp() || ni.isLoopback()) continue;
                for (InetAddress a : Collections.list(ni.getInetAddresses())) {
                    if (!(a instanceof Inet4Address) || !a.isSiteLocalAddress()) continue;
                    if (ni.getName().startsWith("wlan")) return a.getHostAddress();
                    if (yedek.isEmpty()) yedek = a.getHostAddress();
                }
            }
        } catch (Exception e) { }
        return yedek;
    }

    /* Sınırlı satır okuma: CRLF'e kadar en çok "sinir" bayt; aşılırsa null. */
    static String satirOku(InputStream in, int sinir) throws Exception {
        ByteArrayOutputStream b = new ByteArrayOutputStream();
        int c;
        while ((c = in.read()) >= 0) {
            if (c == '\n') break;
            if (c != '\r') b.write(c);
            if (b.size() > sinir) return null;
        }
        if (c < 0 && b.size() == 0) return null;
        return b.toString("UTF-8");
    }

    private void istek(Socket s) {
        try {
            istekIsle(s);
        } finally {
            acikBaglanti.decrementAndGet();
        }
    }

    private void istekIsle(Socket s) {
        try {
            s.setSoTimeout(10000);
            InputStream in = new java.io.BufferedInputStream(s.getInputStream());
            OutputStream o = s.getOutputStream();
            String ilk = satirOku(in, SATIR_SINIRI);
            if (ilk == null) { yanit(o, 400, "text/plain; charset=utf-8", "İstek çok uzun".getBytes("UTF-8"), null); s.close(); return; }
            String satir, gelenPin = null;
            int toplam = 0;
            while ((satir = satirOku(in, SATIR_SINIRI)) != null && !satir.isEmpty()) {
                toplam += satir.length();
                if (toplam > BASLIK_SINIRI) { yanit(o, 400, "text/plain; charset=utf-8", "Başlıklar çok uzun".getBytes("UTF-8"), null); s.close(); return; }
                int iki = satir.indexOf(':');
                if (iki > 0 && satir.substring(0, iki).trim().equalsIgnoreCase("X-Pin")) gelenPin = URLDecoder.decode(satir.substring(iki + 1).trim(), "UTF-8");
            }
            String[] p = ilk.split(" ");
            if (p.length < 2 || !p[0].equals("GET")) { yanit(o, 405, "text/plain; charset=utf-8", "Yalnızca GET".getBytes("UTF-8"), null); s.close(); return; }
            String hedef = p[1], yol = hedef, sorgu = "";
            int q = hedef.indexOf('?');
            if (q >= 0) { yol = hedef.substring(0, q); sorgu = hedef.substring(q + 1); }
            yol = URLDecoder.decode(yol, "UTF-8");
            if (yol.equals("/")) { yanit(o, 302, "text/plain", new byte[0], "Location: /veli.html\r\n"); }
            else if (yol.equals("/api/veri")) apiVeri(o, gelenPin);
            else if (yol.contains("..") || yol.contains("\\") || !yol.startsWith("/")) yanit(o, 400, "text/plain; charset=utf-8", "Geçersiz yol".getBytes("UTF-8"), null);
            else {
                byte[] b;
                try (InputStream dosya = kaynak.ac("web" + yol)) { b = oku(dosya); } catch (Exception e) { b = null; }
                if (b == null) yanit(o, 404, "text/plain; charset=utf-8", "Bulunamadı".getBytes("UTF-8"), null);
                else yanit(o, 200, tur(yol), b, "Cache-Control: no-cache\r\n");
            }
            o.flush();
            s.close();
        } catch (Exception e) {
            try { s.close(); } catch (Exception x) { }
        }
    }

    private synchronized void apiVeri(OutputStream o, String gelenPin) throws Exception {
        long simdi = System.currentTimeMillis();
        if (simdi < kilitBitis) { json(o, 429, "{\"hata\":\"Çok fazla hatalı deneme. Bir dakika sonra tekrar deneyin.\"}"); return; }
        if (veri == null || pin == null) { json(o, 503, "{\"hata\":\"Tabletteki uygulama henüz veri göndermedi. Tablette uygulama açık olmalı.\"}"); return; }
        if (gelenPin == null || !gelenPin.equals(pin)) {
            if (++hataliDeneme >= 5) { kilitBitis = simdi + 60000; hataliDeneme = 0; }
            json(o, 401, "{\"hata\":\"Şifre yanlış.\"}");
            return;
        }
        hataliDeneme = 0;
        json(o, 200, veri);
    }

    private static void json(OutputStream o, int kod, String govde) throws Exception {
        yanit(o, kod, "application/json; charset=utf-8", govde.getBytes("UTF-8"), "Cache-Control: no-store\r\n");
    }

    private static void yanit(OutputStream o, int kod, String tur, byte[] govde, String ek) throws Exception {
        String ad = kod == 200 ? "OK" : kod == 302 ? "Found" : kod == 400 ? "Bad Request" : kod == 401 ? "Unauthorized" : kod == 404 ? "Not Found" : kod == 405 ? "Method Not Allowed" : kod == 429 ? "Too Many Requests" : "Service Unavailable";
        String bas = "HTTP/1.1 " + kod + " " + ad + "\r\nContent-Type: " + tur + "\r\nContent-Length: " + govde.length + "\r\nConnection: close\r\n"
            + "X-Content-Type-Options: nosniff\r\n" + (ek == null ? "" : ek) + "\r\n";
        o.write(bas.getBytes("UTF-8"));
        o.write(govde);
    }

    private static byte[] oku(InputStream in) throws Exception {
        ByteArrayOutputStream b = new ByteArrayOutputStream();
        byte[] t = new byte[16384];
        int n;
        while ((n = in.read(t)) > 0) b.write(t, 0, n);
        return b.toByteArray();
    }

    static String tur(String yol) {
        if (yol.endsWith(".html")) return "text/html; charset=utf-8";
        if (yol.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (yol.endsWith(".css")) return "text/css; charset=utf-8";
        if (yol.endsWith(".json")) return "application/json; charset=utf-8";
        if (yol.endsWith(".svg")) return "image/svg+xml";
        if (yol.endsWith(".png")) return "image/png";
        return "application/octet-stream";
    }
}
