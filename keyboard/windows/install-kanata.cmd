@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
set "RUNTIME_DIR=%SCRIPT_DIR%runtime"
set "KANATA_EXE=%RUNTIME_DIR%\kanata.exe"
set "TEMP_DIR=%TEMP%\athesto-kanata-install"

if /I "%PROCESSOR_ARCHITECTURE%"=="ARM64" (
    set "KANATA_ASSET=windows-binaries-arm64.zip"
) else (
    set "KANATA_ASSET=windows-binaries-x64.zip"
)

set "KANATA_URL=https://github.com/jtroo/kanata/releases/latest/download/!KANATA_ASSET!"

echo Installing Kanata from the official GitHub release...

if exist "%TEMP_DIR%" rmdir /S /Q "%TEMP_DIR%"
mkdir "%TEMP_DIR%" || exit /b 1

curl.exe -fL "!KANATA_URL!" -o "%TEMP_DIR%\kanata.zip"
if errorlevel 1 (
    echo Failed to download Kanata.
    exit /b 1
)

tar.exe -xf "%TEMP_DIR%\kanata.zip" -C "%TEMP_DIR%"
if errorlevel 1 (
    echo Failed to extract Kanata.
    exit /b 1
)

set "KANATA_SOURCE="

for /R "%TEMP_DIR%" %%F in (*winIOv2*gui*.exe) do (
    if not defined KANATA_SOURCE set "KANATA_SOURCE=%%F"
)

if not defined KANATA_SOURCE (
    for /R "%TEMP_DIR%" %%F in (*gui*winIOv2*.exe) do (
        if not defined KANATA_SOURCE set "KANATA_SOURCE=%%F"
    )
)

if not defined KANATA_SOURCE (
    for /R "%TEMP_DIR%" %%F in (*winIOv2*.exe) do (
        if not defined KANATA_SOURCE set "KANATA_SOURCE=%%F"
    )
)

if not defined KANATA_SOURCE (
    for /R "%TEMP_DIR%" %%F in (*gui*.exe) do (
        if not defined KANATA_SOURCE set "KANATA_SOURCE=%%F"
    )
)

if not defined KANATA_SOURCE (
    echo No compatible Kanata GUI executable was found in the release.
    exit /b 1
)

if not exist "%RUNTIME_DIR%" mkdir "%RUNTIME_DIR%" || exit /b 1
copy /Y "!KANATA_SOURCE!" "%KANATA_EXE%" >nul
if errorlevel 1 (
    echo Failed to install Kanata.
    exit /b 1
)

rmdir /S /Q "%TEMP_DIR%"

echo Kanata was installed at:
echo %KANATA_EXE%
echo.
echo Run start-kanata.cmd to enable the keyboard remaps.
exit /b 0
