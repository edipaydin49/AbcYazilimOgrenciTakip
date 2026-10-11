@echo off
rem Kullanim: video dosyasini bu dosyanin uzerine surukleyip birakin ya da cift tiklayin.
call "%~dp0_ortam.bat" || exit /b 1
set "VIDEO=%~1"
if "%VIDEO%"=="" set /p "VIDEO=Video dosyasini bu pencereye surukleyip birakin, sonra Enter: "
if not defined VIDEO exit /b 1
set "VIDEO=%VIDEO:"=%"
if not exist "%VIDEO%" (
  echo Dosya bulunamadi: %VIDEO%
  pause
  exit /b 1
)
for %%F in ("%VIDEO%") do set "AD=%%~nF"
set "CIKTI=%KOK%sonuclar\%AD%"
echo.
echo Analiz basliyor: %VIDEO%
echo Pencerede izlemek icin acilan goruntude q tusu analizi bitirir.
echo.
"%PY%" -m futbol_analiz analiz "%VIDEO%" --cikti "%CIKTI%" --goster
if exist "%CIKTI%\rapor.html" start "" "%CIKTI%\rapor.html"
echo.
echo Sonuclar: %CIKTI%
pause
