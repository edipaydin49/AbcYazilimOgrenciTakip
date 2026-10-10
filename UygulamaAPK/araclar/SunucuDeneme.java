import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import tr.abc.ogrenme.YerelSunucu;

/** YerelSunucu'yu bilgisayarda çalıştırır (test için). Kullanım: java SunucuDeneme <kök> <veri.json> <pin> */
public class SunucuDeneme {
    public static void main(String[] a) throws Exception {
        final String kok = a[0];
        YerelSunucu s = new YerelSunucu(yol -> new FileInputStream(kok + "/" + yol));
        int port = s.baslat();
        s.veriGuncelle(new String(Files.readAllBytes(Paths.get(a[1])), "UTF-8"), a[2]);
        System.out.println("PORT " + port + " IP " + YerelSunucu.ipAdresi());
        System.out.flush();
        Thread.sleep(Long.MAX_VALUE);
    }
}
