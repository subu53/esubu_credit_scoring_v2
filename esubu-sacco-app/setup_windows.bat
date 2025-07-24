@echo off
echo 🏦 Esubu SACCO Management System Setup
echo Empowering Dreams. One Loan at a Time.
echo Licensed by SASRA
echo ==========================================

echo.
echo 🔍 Checking prerequisites...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo 📖 Please install Node.js first:
    echo 1. Go to https://nodejs.org/
    echo 2. Download and install the LTS version
    echo 3. Restart your command prompt
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version

echo.
echo 🔍 Setting up Python environment...

REM Create conda environment (check if already exists)
C:\Users\Sam_Ke\anaconda3\_conda.exe env list | findstr "esubu-sacco" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Conda environment 'esubu-sacco' already exists
) else (
    echo Creating conda environment...
    C:\Users\Sam_Ke\anaconda3\_conda.exe create -n esubu-sacco python=3.11 -y
    if %errorlevel% neq 0 goto error
    echo ✅ Conda environment created
)

REM Install backend dependencies using simplified requirements
echo.
echo 📦 Installing backend dependencies...
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install -r backend/requirements_simple.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install from requirements_simple.txt, trying individual packages...
    C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install fastapi uvicorn python-multipart sqlalchemy pydantic python-dotenv
    if %errorlevel% neq 0 goto error
)

REM Initialize database
echo.
echo 🗄️ Initializing database...
cd backend
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python init_db.py
if %errorlevel% neq 0 goto error
cd ..

REM Install frontend dependencies
echo.
echo 🌐 Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 goto error
cd ..

echo.
echo ✅ Setup complete!
echo.
echo � To start your Esubu SACCO system:
echo.
echo 1. Backend Server:
echo    - Double-click 'start_backend.bat' OR
echo    - Run: cd backend ^&^& C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python run_server.py
echo.
echo 2. Frontend Website (in a new terminal):
echo    - Run: cd frontend ^&^& npm start
echo.
echo 🎯 Access your application:
echo    - Website: http://localhost:3000
echo    - API: http://localhost:8000
echo    - API Docs: http://localhost:8000/docs
echo.
echo 🔑 Login credentials:
echo    - Admin: admin@esubusacco.co.ke / admin123
echo    - Officer: officer@esubusacco.co.ke / officer123
echo.
echo 🎉 Your Esubu SACCO system is ready!
goto end

:error
echo.
echo ❌ Setup failed. Error details above.
echo.
echo 🔧 Troubleshooting steps:
echo 1. Make sure Node.js is installed from https://nodejs.org/
echo 2. Check that Anaconda/Conda is properly installed
echo 3. Try running: MANUAL_SETUP.md for step-by-step instructions
echo 4. Check internet connection for package downloads
echo.
exit /b 1

:end
pause
