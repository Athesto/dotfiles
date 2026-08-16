@echo off
setlocal EnableExtensions

tasklist /FI "IMAGENAME eq kanata.exe" | find /I "kanata.exe" >nul
if errorlevel 1 (
    echo Kanata is not running.
    exit /b 0
)

taskkill /IM kanata.exe /F >nul
if errorlevel 1 (
    echo Kanata could not be stopped.
    exit /b 1
)

echo Kanata stopped. The keyboard is using its normal Windows behavior.
exit /b 0
