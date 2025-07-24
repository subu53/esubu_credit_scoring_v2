@echo off
echo 🌐 Esubu SACCO Frontend Starter
echo Licensed by SASRA  
echo ================================

echo.
echo 🔍 Looking for Node.js...

REM Try different Node.js installation paths
set NODEJS_PATH=""

if exist "C:\Program Files\nodejs\node.exe" (
    set NODEJS_PATH="C:\Program Files\nodejs"
    echo ✅ Found Node.js in Program Files
) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set NODEJS_PATH="C:\Program Files (x86)\nodejs"
    echo ✅ Found Node.js in Program Files (x86)
) else if exist "%APPDATA%\npm\node.exe" (
    set NODEJS_PATH="%APPDATA%\npm"
    echo ✅ Found Node.js in AppData
) else (
    echo ❌ Node.js not found in common locations
    echo.
    echo 📖 Please:
    echo 1. Make sure Node.js is installed from https://nodejs.org/
    echo 2. Restart your computer
    echo 3. Try running this script again
    echo.
    pause
    exit /b 1
)

echo.
echo 🌐 Starting Esubu SACCO Frontend...
echo This will open your browser to http://localhost:3000
echo.

cd /d "C:\Users\Sam_Ke\esubu_credit_scoring_v2\esubu-sacco-app\frontend"

REM Add Node.js to PATH for this session
set PATH=%NODEJS_PATH%;%PATH%

echo Installing frontend dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ npm install failed
    echo.
    echo 🔧 Troubleshooting:
    echo 1. Make sure you have internet connection
    echo 2. Try running as Administrator
    echo 3. Clear npm cache: npm cache clean --force
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Starting development server...
echo 🌐 Your browser will open automatically to http://localhost:3000
echo 📖 Press Ctrl+C to stop the server
echo.

npm start

pause
