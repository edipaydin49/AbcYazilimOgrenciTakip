@echo off
title Futbol Analiz
:menu
cls
echo ==============================================
echo            FUTBOL ANALIZ  -  Tasinabilir
echo ==============================================
echo.
echo   1  Web arayuzu (onerilen)
echo   2  Video dosyasi analiz et
echo   3  Ekrandaki canli yayini analiz et
echo   4  Kamera / RTSP yayini analiz et
echo   5  Sistem kontrolu (GPU, modeller)
echo   6  Sonuclar klasorunu ac
echo   0  Cikis
echo.
set "SECIM="
set /p "SECIM=Seciminiz: "
if "%SECIM%"=="1" call "%~dp0WEB_ARAYUZ.bat" & goto menu
if "%SECIM%"=="2" call "%~dp0VIDEO_ANALIZ.bat" & goto menu
if "%SECIM%"=="3" call "%~dp0CANLI_EKRAN.bat" & goto menu
if "%SECIM%"=="4" call "%~dp0CANLI_YAYIN.bat" & goto menu
if "%SECIM%"=="5" call "%~dp0SISTEM_KONTROL.bat" & goto menu
if "%SECIM%"=="6" start "" "%~dp0sonuclar" & goto menu
if "%SECIM%"=="0" exit /b 0
goto menu
