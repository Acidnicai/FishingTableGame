@echo off
rem First launch downloads portable Node.js when this computer does not have it.
cd /d "%~dp0"
if exist "node_modules\electron\dist\electron.exe" (
  start "" /D "%~dp0" "%~dp0node_modules\electron\dist\electron.exe" .
  exit /b 0
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\play.ps1"
if errorlevel 1 pause
