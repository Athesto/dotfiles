@echo off
setlocal EnableExtensions

set "SCRIPT_DIR=%~dp0"
set "KANATA_EXE=%SCRIPT_DIR%runtime\kanata.exe"
set "KANATA_CONFIG=%SCRIPT_DIR%vim-hybrid.kbd"

if not exist "%KANATA_EXE%" (
    echo Kanata is not installed.
    echo Run install-kanata.cmd first.
    exit /b 1
)

if not exist "%KANATA_CONFIG%" (
    echo Configuration not found:
    echo %KANATA_CONFIG%
    exit /b 1
)

tasklist /FI "IMAGENAME eq kanata.exe" | find /I "kanata.exe" >nul
if not errorlevel 1 (
    echo Kanata is already running.
    exit /b 0
)

pushd "%SCRIPT_DIR%"
start "" "%KANATA_EXE%" --cfg "%KANATA_CONFIG%"
popd

echo Kanata started with vim-hybrid.kbd.
exit /b 0
