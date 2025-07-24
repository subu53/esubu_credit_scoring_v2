@echo off
echo 🔧 Esubu SACCO - Complete Issue Resolution
echo =========================================

echo.
echo 🔍 Installing all missing Python dependencies...

REM Install all required packages at once
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install pydantic-settings python-multipart python-jose[cryptography] passlib[bcrypt] fastapi uvicorn sqlalchemy python-dotenv email-validator

echo.
echo 🗄️ Initializing database...
cd backend
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python init_db.py

if %errorlevel% equ 0 (
    echo ✅ Database initialized successfully!
    echo.
    echo 🚀 Starting backend server...
    echo Backend will be available at: http://localhost:8000
    echo API Documentation: http://localhost:8000/docs
    echo.
    echo 🔑 Default Credentials:
    echo Admin: admin@esubusacco.co.ke / admin123
    echo Officer: officer@esubusacco.co.ke / officer123
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python run_server.py
) else (
    echo ❌ Database initialization failed
    echo Check the error messages above
)

pause
