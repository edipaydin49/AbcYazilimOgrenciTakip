#!/bin/sh
# Tüm soru havuzlarını ve web sayfalarını yeniden üretir. Depo kökünden çalıştırın: sh ortak/tumunu_olustur.sh
set -e
python3 KupSorulari/araclar/ciktilari_olustur.py
python3 CarpanlarKatlar/araclar/havuz_olustur.py > /dev/null
python3 SozVarligi/araclar/havuz_olustur.py > /dev/null
for ders in Ingilizce Matematik Fen Sosyal DinKulturu; do
  python3 Sinif6/$ders/araclar/havuz_olustur.py > /dev/null
done
python3 Sinif6/araclar/ana_sayfa_olustur.py
