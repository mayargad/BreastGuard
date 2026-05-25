@echo off
title BreastGuard Launcher
color 0D

echo.
echo  ==========================================
echo   BREASTGUARD ^| Breast Cancer Detection
echo   Starting... please wait
echo  ==========================================
echo.

REM ── Paths ──────────────────────────────────────────────────
set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

REM ── Check node_modules exists ──────────────────────────────
if not exist "%FRONTEND%\node_modules" (
    color 0E
    echo  [!] First time setup needed.
    echo      Running setup automatically...
    echo.
    call "%ROOT%SETUP_FIRST_TIME.bat"
)

REM ── Start Backend in a new window ──────────────────────────
echo  [1/3] Starting Backend (Flask)...
start "BreastGuard Backend" cmd /k "color 0A && title BreastGuard Backend && cd /d "%BACKEND%" && python app.py"

REM ── Wait 3 seconds for backend to start ───────────────────
timeout /t 3 /nobreak >nul

REM ── Start Frontend in a new window ────────────────────────
echo  [2/3] Starting Frontend (React)...
start "BreastGuard Frontend" cmd /k "color 0B && title BreastGuard Frontend && cd /d "%FRONTEND%" && npm start"

REM ── Wait for React to compile (usually ~15 seconds) ───────
echo  [3/3] Waiting for website to compile...
echo.
echo  The website will open automatically in your browser.
echo  This usually takes 15-30 seconds the first time.
echo.
echo  ==========================================
echo   HOW TO STOP:
echo   Close the two black windows that opened
echo   (Backend + Frontend)
echo  ==========================================
echo.
timeout /t 20 /nobreak >nul

REM ── Open browser ──────────────────────────────────────────
start http://localhost:3000

echo  Done! If the browser did not open automatically,
echo  go to: http://localhost:3000
echo.
pause
