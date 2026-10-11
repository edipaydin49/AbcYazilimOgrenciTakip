@echo off
rem Webcam (0, 1, ...) ya da rtsp:// / http:// yayin adresi
call "%~dp0_ortam.bat" || exit /b 1
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set "ZAMAN=%%i"
set "CIKTI=%KOK%sonuclar\yayin_%ZAMAN%"
set "KAYNAK=0"
set /p "KAYNAK=Kamera numarasi ya da yayin adresi [0]: "
echo Pencerede q tusu analizi bitirir.
"%PY%" -m futbol_analiz canli --kaynak "%KAYNAK%" --adim 2 --cikti "%CIKTI%" --goster
if exist "%CIKTI%\rapor.html" start "" "%CIKTI%\rapor.html"
pause
