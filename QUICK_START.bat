@echo off
REM Quick Start Script for Library Management System (Windows)

echo 🎯 Library Management System - Quick Start
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Backend Setup
echo 📦 Setting up Backend...
cd library_backend
call npm install >nul 2>&1
echo ✅ Backend dependencies installed
cd..
echo.

REM Frontend Setup
echo 📦 Setting up Frontend...
cd Library-Management-System
call npm install >nul 2>&1
echo ✅ Frontend dependencies installed
cd..
echo.

echo 🚀 Ready to start the application!
echo.
echo To run the application:
echo.
echo PowerShell Terminal 1 - Backend:
echo   cd library_backend
echo   npm start
echo.
echo PowerShell Terminal 2 - Frontend:
echo   cd Library-Management-System
echo   npm start
echo.
echo Access the application at: http://localhost:3000
echo Backend API at: http://localhost:5000/api
echo.
pause
