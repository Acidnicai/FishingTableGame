@echo off
cd /d "%~dp0"
if not exist "node_modules\electron\dist\electron.exe" (
  echo Preparing the pond, first time only...
  call npm install
  if errorlevel 1 (
    echo Install failed. Need Node.js and a network connection.
    pause
    exit /b 1
  )
)
start "" /D "%~dp0." "%~dp0node_modules\electron\dist\electron.exe" .
