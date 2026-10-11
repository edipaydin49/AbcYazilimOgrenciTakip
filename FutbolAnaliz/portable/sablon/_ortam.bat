@echo off
rem Tasinabilir ortam: her sey bu klasorun icinde kalir, sisteme hicbir sey kurulmaz.
set "KOK=%~dp0"
set "PY=%KOK%python\python.exe"
set "PYTHONNOUSERSITE=1"
set "PYTHONUTF8=1"
set "PYTHONIOENCODING=utf-8"
set "FUTBOL_MODELLER=%KOK%modeller"
set "YOLO_CONFIG_DIR=%KOK%ayarlar\ultralytics"
set "MPLCONFIGDIR=%KOK%ayarlar\matplotlib"
set "TORCH_HOME=%KOK%ayarlar\torch"
set "YOLO_OFFLINE=1"
if not exist "%YOLO_CONFIG_DIR%" mkdir "%YOLO_CONFIG_DIR%"
if not exist "%MPLCONFIGDIR%" mkdir "%MPLCONFIGDIR%"
if not exist "%KOK%sonuclar" mkdir "%KOK%sonuclar"
if not exist "%PY%" (
  echo HATA: python klasoru bulunamadi. Zip dosyasini tamamen cikardiginizdan emin olun.
  pause
  exit /b 1
)
chcp 65001 >nul
