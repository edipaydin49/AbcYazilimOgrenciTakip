@echo off
call "%~dp0_ortam.bat" || exit /b 1
echo Web arayuzu baslatiliyor... Tarayici birkac saniye icinde acilacak.
echo Kapatmak icin bu pencereyi kapatin.
start "" /min cmd /c "timeout /t 8 >nul & start http://localhost:8501"
cd /d "%KOK%app"
"%PY%" -m streamlit run "%KOK%app\app.py" --server.headless true --server.port 8501 --browser.gatherUsageStats false --server.maxUploadSize 4096
pause
