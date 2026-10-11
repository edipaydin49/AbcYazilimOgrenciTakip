# FutbolAnaliz - Windows tasinabilir paket olusturucu
#
# Gomulu (embeddable) Python + tum kutuphaneler + YOLO modelleri tek klasorde toplanir.
# Cikan klasor/zip USB bellege kopyalanip kurulumsuz calistirilabilir.
#
# Kullanim (PowerShell):
#   .\build_portable.ps1                 # CPU surumu (her bilgisayarda calisir)
#   .\build_portable.ps1 -Torch cu126    # NVIDIA GPU surumu (cok daha hizli, ~3 GB)
#   .\build_portable.ps1 -Test           # paketlenen Python ile testleri de calistir

param(
    [string]$PythonVersion = "3.12.10",
    [ValidateSet("cpu", "cu126", "cu128")][string]$Torch = "cpu",
    [string]$Out = "",
    [switch]$Test,
    [switch]$NoZip
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"   # Invoke-WebRequest'i cok hizlandirir
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Here = $PSScriptRoot
$Proj = (Resolve-Path (Join-Path $Here "..")).Path
if (-not $Out) { $Out = Join-Path $Proj "dist" }
$Name = "FutbolAnaliz_Portable_$Torch"
$Root = Join-Path $Out $Name
$PyDir = Join-Path $Root "python"
$Py = Join-Path $PyDir "python.exe"

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Run($exe, [string[]]$argv) {
    & $exe @argv
    if ($LASTEXITCODE -ne 0) { throw "Komut basarisiz ($LASTEXITCODE): $exe $($argv -join ' ')" }
}
function Download($url, $dest) {
    for ($i = 1; $i -le 4; $i++) {
        try { Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing; return }
        catch { if ($i -eq 4) { throw }; Start-Sleep -Seconds (2 * $i) }
    }
}

Step "Klasor hazirlaniyor: $Root"
if (Test-Path $Root) { Remove-Item $Root -Recurse -Force }
New-Item -ItemType Directory -Force -Path $PyDir, "$Root\app", "$Root\modeller", "$Root\sonuclar", "$Root\ayarlar" | Out-Null

Step "Gomulu Python $PythonVersion indiriliyor"
$zip = Join-Path $env:TEMP "python-$PythonVersion-embed-amd64.zip"
Download "https://www.python.org/ftp/python/$PythonVersion/python-$PythonVersion-embed-amd64.zip" $zip
Expand-Archive -Path $zip -DestinationPath $PyDir -Force

# ._pth: site-packages'i ac ve uygulama klasorunu ekle (goreli yol -> tasinabilir)
$pth = Get-ChildItem $PyDir -Filter "python*._pth" | Select-Object -First 1
$lines = (Get-Content $pth.FullName) -replace '^#\s*import site', 'import site'
$lines += '..\app'
Set-Content -Path $pth.FullName -Value $lines -Encoding ASCII

Step "pip kuruluyor"
$getpip = Join-Path $env:TEMP "get-pip.py"
Download "https://bootstrap.pypa.io/get-pip.py" $getpip
Run $Py @($getpip, "--no-warn-script-location")

Step "PyTorch ($Torch) kuruluyor"
Run $Py @("-m", "pip", "install", "--no-warn-script-location", "--no-cache-dir",
    "torch", "torchvision", "--index-url", "https://download.pytorch.org/whl/$Torch")

Step "Kutuphaneler kuruluyor"
$req = Join-Path $env:TEMP "futbol_req.txt"
Get-Content (Join-Path $Proj "requirements.txt") | Where-Object { $_ -notmatch '^\s*pytest' } | Set-Content $req
Run $Py @("-m", "pip", "install", "--no-warn-script-location", "--no-cache-dir", "-r", $req)

Step "Uygulama kopyalaniyor"
Copy-Item -Recurse (Join-Path $Proj "futbol_analiz") "$Root\app\futbol_analiz"
Copy-Item (Join-Path $Proj "app.py") "$Root\app\app.py"
Copy-Item (Join-Path $Here "sablon\*") $Root -Recurse
Copy-Item (Join-Path $Here "OKUBENI.txt") $Root

Step "YOLO modelleri indiriliyor"
foreach ($m in @("yolo11s.pt", "yolo11m.pt")) {
    Download "https://github.com/ultralytics/assets/releases/download/v8.3.0/$m" (Join-Path $Root "modeller\$m")
}
# Kendi egittiginiz futbol modeli / saha modeli varsa paketle
foreach ($m in @("futbol.pt", "saha.pt")) {
    $src = Join-Path $Proj "modeller\$m"
    if (Test-Path $src) { Copy-Item $src "$Root\modeller\$m"; Write-Host "  + $m eklendi" }
}

Step "Duman testi (paketlenmis Python ile)"
$env:PYTHONNOUSERSITE = "1"
$env:FUTBOL_MODELLER = "$Root\modeller"
$env:YOLO_CONFIG_DIR = "$Root\ayarlar\ultralytics"
$env:MPLCONFIGDIR = "$Root\ayarlar\matplotlib"
New-Item -ItemType Directory -Force -Path $env:YOLO_CONFIG_DIR, $env:MPLCONFIGDIR | Out-Null
Run $Py @("-m", "futbol_analiz.kontrol")
Run $Py @("-c", "import streamlit, futbol_analiz.report, futbol_analiz.pipeline; print('import ok')")

if ($Test) {
    Step "Testler (paketlenmis Python ile)"
    $tmpTests = Join-Path $env:TEMP "futbol_tests"
    if (Test-Path $tmpTests) { Remove-Item $tmpTests -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $tmpTests | Out-Null
    Copy-Item -Recurse (Join-Path $Proj "tests") "$tmpTests\tests"
    Run $Py @("-m", "pip", "install", "--no-warn-script-location", "-q", "pytest")
    Push-Location $tmpTests
    try { Run $Py @("-m", "pytest", "-q", "-p", "no:cacheprovider", "tests") }
    finally { Pop-Location }
    Run $Py @("-m", "pip", "uninstall", "-y", "-q", "pytest", "pluggy", "iniconfig")
}

Step "Temizlik"
Get-ChildItem $Root -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
Remove-Item "$Root\ayarlar\*", "$Root\Ultralytics" -Recurse -Force -ErrorAction SilentlyContinue
# pip'in Scripts\*.exe baslaticilari mutlak yol icerir, tasinabilir degil; hepsi "python -m" ile cagriliyor
Remove-Item "$PyDir\Scripts" -Recurse -Force -ErrorAction SilentlyContinue

$size = (Get-ChildItem $Root -Recurse -File | Measure-Object Length -Sum).Sum / 1MB
Write-Host ("Paket boyutu: {0:N0} MB" -f $size)

if (-not $NoZip) {
    Step "Zip olusturuluyor"
    $zipOut = Join-Path $Out "$Name.zip"
    if (Test-Path $zipOut) { Remove-Item $zipOut -Force }
    $7z = Get-Command 7z -ErrorAction SilentlyContinue
    if ($7z) { Run $7z.Source @("a", "-tzip", "-mx=5", $zipOut, $Root) | Out-Null }
    else { Compress-Archive -Path $Root -DestinationPath $zipOut -CompressionLevel Optimal }
    Write-Host ("Zip: $zipOut ({0:N0} MB)" -f ((Get-Item $zipOut).Length / 1MB)) -ForegroundColor Green
}
Write-Host "`nHazir: $Root" -ForegroundColor Green
