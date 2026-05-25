@echo off
title BreastGuard - First Time Setup
color 0D
echo.
echo  ================================
echo   BREASTGUARD - First Time Setup
echo  ================================
echo.

REM ── Check Python ──────────────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [ERROR] Python is not installed or not in PATH.
    echo.
    echo  Please install Python from: https://python.org/downloads
    echo  IMPORTANT: Check "Add Python to PATH" during installation!
    echo.
    pause
    exit /b 1
)
echo  [OK] Python found.

REM ── Check Node ─────────────────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [ERROR] Node.js is not installed.
    echo.
    echo  Please install Node.js from: https://nodejs.org  (choose LTS)
    echo.
    pause
    exit /b 1
)
echo  [OK] Node.js found.

REM ── Install Python packages ────────────────────────────────
echo.
echo  Installing Python packages (flask, flask-cors)...
cd /d "%~dp0backend"
pip install -r requirements.txt --quiet
if errorlevel 1 (
    color 0C
    echo  [ERROR] Failed to install Python packages.
    pause
    exit /b 1
)
echo  [OK] Python packages installed.

REM ── Install Node packages ──────────────────────────────────
echo.
echo  Installing Node packages (this may take a minute)...
cd /d "%~dp0frontend"
call npm install --silent
if errorlevel 1 (
    color 0C
    echo  [ERROR] Failed to install Node packages.
    pause
    exit /b 1
)
echo  [OK] Node packages installed.

echo.
echo  ================================
echo   Setup Complete!
echo   Now run: START_BREASTGUARD.bat
echo  ================================
echo.
pause
