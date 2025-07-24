@echo off
echo 🌐 Node.js PATH Fix and Frontend Setup
echo ======================================

echo.
echo 🔍 Looking for Node.js installation...

REM Check common Node.js installation paths
if exist "C:\Program Files\nodejs\node.exe" (
    echo ✅ Found Node.js in Program Files
    set "NODE_PATH=C:\Program Files\nodejs"
    goto :found_node
)

if exist "C:\Program Files (x86)\nodejs\node.exe" (
    echo ✅ Found Node.js in Program Files (x86)
    set "NODE_PATH=C:\Program Files (x86)\nodejs"
    goto :found_node
)

if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    echo ✅ Found Node.js in Local AppData
    set "NODE_PATH=%LOCALAPPDATA%\Programs\nodejs"
    goto :found_node
)

if exist "%APPDATA%\npm\node.exe" (
    echo ✅ Found Node.js in AppData npm
    set "NODE_PATH=%APPDATA%\npm"
    goto :found_node
)

echo ❌ Node.js not found in common locations
echo.
echo 📖 Please ensure Node.js is installed:
echo 1. Download from https://nodejs.org/ (LTS version)
echo 2. Install with default settings
echo 3. Restart your computer
echo 4. Run this script again
echo.
goto :end

:found_node
echo.
echo 🔧 Setting up PATH for this session...
set "PATH=%NODE_PATH%;%PATH%"

echo Testing Node.js...
"%NODE_PATH%\node.exe" --version
if %errorlevel% neq 0 (
    echo ❌ Node.js test failed
    goto :end
)

echo Testing npm...
"%NODE_PATH%\npm.cmd" --version
if %errorlevel% neq 0 (
    echo ❌ npm test failed
    goto :end
)

echo.
echo ✅ Node.js is working!
echo.
echo 🌐 Installing frontend dependencies...
cd frontend

echo Running npm install...
"%NODE_PATH%\npm.cmd" install

if %errorlevel% neq 0 (
    echo ❌ npm install failed
    echo.
    echo 🔧 Troubleshooting:
    echo 1. Check internet connection
    echo 2. Clear npm cache: npm cache clean --force
    echo 3. Try running as Administrator
    goto :end
)

echo.
echo ✅ Frontend dependencies installed!
echo.
echo 🚀 Starting frontend development server...
echo Your browser will open automatically to http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

"%NODE_PATH%\npm.cmd" start

:end
pause
