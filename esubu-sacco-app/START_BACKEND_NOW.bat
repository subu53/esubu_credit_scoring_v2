@echo off
echo 🏦 Esubu SACCO Backend Server Starter
echo Licensed by SASRA
echo =====================================

echo.
echo 🔍 Starting backend server...
echo This will start the API server on http://localhost:8000
echo.

cd /d "C:\Users\Sam_Ke\esubu_credit_scoring_v2\esubu-sacco-app\backend"

echo Installing any missing dependencies...
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install python-jose[cryptography] passlib[bcrypt] python-dotenv >nul 2>&1

echo.
echo Initializing database...
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python init_db.py

echo.
echo ✅ Starting Esubu SACCO Backend Server...
echo.
echo 🌐 Access points:
echo - API Server: http://localhost:8000
echo - API Documentation: http://localhost:8000/docs
echo - Health Check: http://localhost:8000/health
echo.
echo 🔑 Default Credentials:
echo - Admin: admin@esubusacco.co.ke / admin123
echo - Officer: officer@esubusacco.co.ke / officer123
echo.
echo 📖 Press Ctrl+C to stop the server
echo =====================================
echo.

C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python run_server.py

pause
