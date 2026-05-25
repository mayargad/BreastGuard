@echo off
title Stop BreastGuard
color 0C
echo.
echo  Stopping BreastGuard...
echo.
taskkill /f /fi "WINDOWTITLE eq BreastGuard Backend*" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq BreastGuard Frontend*" >nul 2>&1
taskkill /f /im python.exe /fi "WINDOWTITLE eq BreastGuard*" >nul 2>&1
echo  All BreastGuard processes stopped.
echo.
timeout /t 2 /nobreak >nul
