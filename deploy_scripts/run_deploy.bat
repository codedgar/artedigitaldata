@echo off
setlocal enabledelayedexpansion

:: Limpiar variables previas para evitar conflictos
set GITHUB_TOKEN=
set GITHUB_REPO=

:: Cargar variables desde .env usando PowerShell para evitar problemas de CRLF/espacios
set "ENV_FILE=%~dp0..\.env"
if exist "%ENV_FILE%" (
    for /f "tokens=*" %%a in ('powershell -Command "Get-Content '%ENV_FILE%' | Where-Object { $_ -match '=' -and -not $_.StartsWith('#') } | ForEach-Object { $_.Trim() }"') do (
        set "%%a"
    )
)

echo ===================================================
echo Iniciando proceso COMPLETO de Deploy - Arte Digital Data
echo ===================================================

pushd "%~dp0.."

echo.
echo [1/3] COMPILANDO EL CSS DE TAILWIND...
:: El FTP sube public/ tal cual esta en local: sin recompilar aca, el sitio
:: se publica con el CSS viejo.
call npm run build:css
if %ERRORLEVEL% neq 0 goto :error_css

:: El VPS hace `git reset --hard origin/main`, o sea que toma el CSS
:: commiteado, mientras que el FTP sube el local. Si el CSS recien compilado
:: no esta commiteado, los dos entornos quedarian con versiones distintas.
git --version >nul 2>&1
if %ERRORLEVEL% neq 0 goto :error_sin_git
git ls-files --error-unmatch public/css/tailwind.css >nul 2>&1
if %ERRORLEVEL% neq 0 goto :error_css_desincronizado
git diff --quiet HEAD -- public/css/tailwind.css
if %ERRORLEVEL% neq 0 goto :error_css_desincronizado

popd

echo.
echo [2/3] DESPLEGANDO EN EL VPS (!VPS_HOST!) POR SSH...
echo Primero actualizamos desde Github y luego corremos el script en el VPS.
echo.
:: Construir la URL completa para forzarla en el VPS
set "REPO_URL=https://!GITHUB_TOKEN!@github.com/!GITHUB_REPO!"

ssh -p !VPS_PORT! !VPS_USER!@!VPS_HOST! "mkdir -p artedigitaldata && cd artedigitaldata && git remote set-url origin !REPO_URL! 2>/dev/null || (git init && git remote add origin !REPO_URL!) && echo 'Bajando cambios al VPS...' && git fetch origin main && git reset --hard origin/main && echo 'Corriendo el deploy de backend...' && bash deploy_scripts/server_update.sh"

echo.
echo [3/3] SUBIENDO ARCHIVOS DE FRONTEND AL FTP (!FTP_HOST!)...
node "%~dp0upload_ftp.js"
if %ERRORLEVEL% neq 0 (
    echo Error al subir archivos por FTP. Revisa la consola.
    pause
    exit /b
)

echo.
echo ===================================================
echo El proceso de deploy de Arte Digital Data ha finalizado!
echo VPS y FTP estan completamente actualizados.
echo ===================================================
pause
exit /b 0

:error_css
echo.
echo ERROR: fallo "npm run build:css". Deploy cancelado.
echo Revisa tailwind.config.js y que las dependencias esten instaladas.
popd
pause
exit /b 1

:error_sin_git
echo.
echo ERROR: no se encontro "git" en el PATH. Deploy cancelado.
echo Se necesita para verificar que el CSS compilado este commiteado.
popd
pause
exit /b 1

:error_css_desincronizado
echo.
echo ===================================================
echo DEPLOY CANCELADO: public/css/tailwind.css sin commitear
echo ===================================================
echo El CSS se recompilo y quedo distinto del que hay en git.
echo El VPS toma ese archivo desde git y el FTP desde local, asi que
echo deployar ahora dejaria los dos entornos con estilos distintos.
echo.
echo Solucion:
echo     git add public/css/tailwind.css
echo     git commit -m "build: recompilar CSS de Tailwind"
echo     git push
echo.
echo Despues volve a correr el deploy.
popd
pause
exit /b 1
