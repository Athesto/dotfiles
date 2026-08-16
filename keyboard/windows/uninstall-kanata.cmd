@echo off
setlocal EnableExtensions

set "SCRIPT_DIR=%~dp0"
set "RUNTIME_DIR=%SCRIPT_DIR%runtime"

if not exist "%RUNTIME_DIR%" (
    echo Kanata is not installed in this folder.
    exit /b 0
)

echo This will stop Kanata and remove:
echo %RUNTIME_DIR%
echo.
choice /C YN /N /M "Continue? [Y/N] "
if errorlevel 2 exit /b 0

call "%SCRIPT_DIR%stop-kanata.cmd"
rmdir /S /Q "%RUNTIME_DIR%"

if exist "%RUNTIME_DIR%" (
    echo Kanata could not be removed.
    exit /b 1
)

echo Kanata was removed. The configuration and scripts were preserved.
exit /b 0
