@echo off
rem Kendi bilgisayarinizda tasinabilir paketi olusturur (internet gerekir, Python kurulu olmasi GEREKMEZ).
echo Hangi surum olusturulsun?
echo   1  CPU  (her bilgisayarda calisir, ~1.5 GB)
echo   2  NVIDIA GPU - CUDA 12.6 (GTX 10xx - RTX 40xx, ~4 GB)
echo   3  NVIDIA GPU - CUDA 12.8 (RTX 50xx dahil, ~4 GB)
set "S=1"
set /p "S=Secim [1]: "
set "T=cpu"
if "%S%"=="2" set "T=cu126"
if "%S%"=="3" set "T=cu128"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_portable.ps1" -Torch %T%
pause
