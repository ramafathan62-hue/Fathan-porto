@echo off
title Portfolio - Starting All Servers
echo.
echo  ===================================================
echo   Rama Fikri Fathan - Portfolio Dev Server Launcher
echo  ===================================================
echo.

:: Kill any existing node processes
echo [1/5] Stopping existing node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

:: Regenerate Prisma client to ensure DB schema is synced
echo [2/5] Syncing database schema...
cd /d d:\website\fathan-porto\apps\api
npx prisma generate --no-hints 2>nul
cd /d d:\website\fathan-porto

:: Start API server (port 3001)
echo [3/5] Starting API Server on port 3001...
start "API Server :3001" cmd /k "title API Server && cd /d d:\website\fathan-porto\apps\api && npx tsx --watch src/index.ts"
timeout /t 3 /nobreak >nul

:: Start Web portfolio (port 5173)
echo [4/5] Starting Portfolio Website on port 5173...
start "Portfolio Web :5173" cmd /k "title Portfolio Website && cd /d d:\website\fathan-porto\apps\web && npm run dev -- --port 5173"
timeout /t 2 /nobreak >nul

:: Start Admin panel (port 5174)
echo [5/5] Starting Admin Panel on port 5174...
start "Admin Panel :5174" cmd /k "title Admin Panel && cd /d d:\website\fathan-porto\apps\admin && npm run dev -- --port 5174"

echo.
echo  ===================================================
echo   All servers are starting up!
echo  ===================================================
echo.
echo   Portfolio:   http://localhost:5173
echo   Admin Panel: http://localhost:5174
echo   API:         http://localhost:3001
echo.
echo   Wait a few seconds then open the URLs above.
echo.
pause
