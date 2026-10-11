@echo off
call "%~dp0_ortam.bat" || exit /b 1
"%PY%" -m futbol_analiz.kontrol
pause
