package tr.abc.ogrenme;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.util.Collections;

/**
 * Aynı Wi-Fi ağındaki bilgisayardan veli panelini görmek için küçük HTTP sunucusu.
 * Yalnızca GET: uygulamanın sayfaları (assets/web) ve şifreyle korunan /api/veri (öğrenci kayıtları).
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

    private void istek(Socket s) {
        try {
            s.setSoTimeout(15000);
            BufferedReader r = new BufferedReader(new InputStreamReader(s.getInputStream(), "UTF-8"));
            String ilk = r.readLine();
            String satir;
            while ((satir = r.readLine()) != null && !satir.isEmpty()) { /* başlıklar okunup geçilir */ }
            OutputStream o = s.getOutputStream();
            if (ilk == null) { s.close(); return; }
            String[] p = ilk.split(" ");
            if (p.length < 2 || !p[0].equals("GET")) { yanit(o, 405, "text/plain; charset=utf-8", "Yalnızca GET".getBytes("UTF-8"), null); s.close(); return; }
            String hedef = p[1], yol = hedef, sorgu = "";
            int q = hedef.indexOf('?');
            if (q >= 0) { yol = hedef.substring(0, q); sorgu = hedef.substring(q + 1); }
            yol = URLDecoder.decode(yol, "UTF-8");
            if (yol.equals("/")) { yanit(o, 302, "text/plain", new byte[0], "Location: /veli.html\r\n"); }
            else if (yol.equals("/api/veri")) apiVeri(o, parametre(sorgu, "pin"));
            else if (yol.contains("..") || yol.contains("\\") || !yol.startsWith("/")) yanit(o, 400, "text/plain; charset=utf-8", "Geçersiz yol".getBytes("UTF-8"), null);
            else {
                byte[] b;
                try (InputStream in = kaynak.ac("web" + yol)) { b = oku(in); } catch (Exception e) { b = null; }
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

    private static String parametre(String sorgu, String ad) {
        try {
            for (String p : sorgu.split("&")) {
                int e = p.indexOf('=');
                if (e > 0 && p.substring(0, e).equals(ad)) return URLDecoder.decode(p.substring(e + 1), "UTF-8");
            }
        } catch (Exception e) { }
        return null;
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
