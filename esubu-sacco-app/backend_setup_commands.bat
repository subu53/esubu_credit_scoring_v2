REM Esubu SACCO Backend Setup Commands
REM Run these one by one in Command Prompt

REM Navigate to project
cd C:\Users\Sam_Ke\esubu_credit_scoring_v2\esubu-sacco-app

REM Install remaining Python packages
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install python-jose[cryptography] passlib[bcrypt] python-dotenv

REM Initialize database
cd backend
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python init_db.py

REM Test backend server
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python run_server.py
