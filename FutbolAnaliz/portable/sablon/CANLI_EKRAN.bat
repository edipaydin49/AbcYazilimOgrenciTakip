@echo off
rem Ekranda acik olan mac yayinini (tarayici, TV uygulamasi) canli analiz eder.
call "%~dp0_ortam.bat" || exit /b 1
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set "ZAMAN=%%i"
set "CIKTI=%KOK%sonuclar\canli_%ZAMAN%"
echo.
echo Mac yayinini tam ekran acin. Iki monitorunuz varsa yayini hangi monitorde actiginizi yazin.
set "EKRAN=1"
set /p "EKRAN=Monitor numarasi [1]: "
set "SURE="
set /p "SURE=Kac dakika analiz edilsin? (bos = Ctrl+C ile durdurana kadar): "
set "SUREARG="
if not "%SURE%"=="" set /a SANIYE=%SURE%*60
if not "%SURE%"=="" set "SUREARG=--sure %SANIYE%"
echo.
echo 5 saniye icinde basliyor, yayin penceresine gecin...
timeout /t 5 >nul
"%PY%" -m futbol_analiz canli --kaynak screen --ekran %EKRAN% --adim 2 --cikti "%CIKTI%" %SUREARG%
if exist "%CIKTI%\rapor.html" start "" "%CIKTI%\rapor.html"
pause
