@echo off
echo 🏦 Starting Esubu SACCO Backend Server...
echo Licensed by SASRA
echo ========================================

cd /d "C:\Users\Sam_Ke\esubu_credit_scoring_v2\esubu-sacco-app\backend"

echo Starting server on http://localhost:8000
echo API Documentation available at http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python run_server.py

pause
