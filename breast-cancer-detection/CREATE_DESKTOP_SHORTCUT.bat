@echo off
title Create Desktop Shortcut
echo.
echo  Creating BreastGuard shortcut on Desktop...

REM Use PowerShell to create a proper .lnk shortcut
powershell -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell;" ^
  "$desktop = [System.Environment]::GetFolderPath('Desktop');" ^
  "$shortcut = $ws.CreateShortcut($desktop + '\BreastGuard.lnk');" ^
  "$shortcut.TargetPath = '%~dp0START_BREASTGUARD.bat';" ^
  "$shortcut.WorkingDirectory = '%~dp0';" ^
  "$shortcut.Description = 'BreastGuard - Breast Cancer Detection System';" ^
  "$shortcut.WindowStyle = 1;" ^
  "$shortcut.Save();"

if errorlevel 1 (
    echo  [!] Could not create shortcut automatically.
    echo      Please manually right-click START_BREASTGUARD.bat
    echo      and choose "Send to > Desktop (create shortcut)"
) else (
    echo  [OK] Shortcut created on Desktop!
    echo       Look for "BreastGuard" on your Desktop.
)
echo.
pause
