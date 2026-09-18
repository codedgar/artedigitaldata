@echo off
setlocal enabledelayedexpansion

:: Cargar variables desde .env
set "ENV_FILE=%~dp0..\.env"
if exist "%ENV_FILE%" (
    for /f "tokens=*" %%a in ('powershell -Command "Get-Content '%ENV_FILE%' | Where-Object { $_ -match '=' -and -not $_.StartsWith('#') } | ForEach-Object { $_.Trim() }"') do (
        set "%%a"
    )
)

echo ===================================================
echo Iniciando proceso COMPLETO de Deploy - ArteDigitalData
echo ===================================================

echo.
echo [1/2] DESPLEGANDO EN EL VPS (!VPS_HOST!) POR SSH...
echo.

set "REPO_URL=https://!GITHUB_TOKEN@github.com/jpupper/artedigitaldata"

ssh -p !VPS_PORT! !VPS_USER!@!VPS_HOST! "mkdir -p artedigitaldata && cd artedigitaldata && git remote set-url origin !REPO_URL! 2>/dev/null || (git init && git remote add origin !REPO_URL!) && echo 'Bajando cambios al VPS...' && git fetch origin main && git reset --hard origin/main && echo 'Instalando dependencias...' && npm install && echo 'Compilando TypeScript...' && npx tsc && echo 'Reiniciando servidor...' && pm2 restart artedigitaldata || pm2 start dist/server.js --name artedigitaldata && pm2 save"

echo.
echo [2/2] SUBIENDO ARCHIVOS DE FRONTEND AL FTP (!FTP_HOST!)...
node "%~dp0upload_ftp.js"
if %ERRORLEVEL% neq 0 (
    echo Error al subir archivos por FTP.
    pause
    exit /b 2
)

echo.
echo ===================================================
echo Deploy de ArteDigitalData finalizado!
echo ===================================================
pause
