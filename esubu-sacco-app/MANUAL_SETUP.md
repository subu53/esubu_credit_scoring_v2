# 🏦 Esubu SACCO Setup - Manual Steps

## 📋 Prerequisites
1. **Node.js**: Download and install from https://nodejs.org/ (LTS version)
2. **Python**: You have Anaconda/Conda available

## 🚀 Step-by-Step Setup

### Step 1: Install Node.js
- Go to https://nodejs.org/
- Download and install the LTS version
- Restart your command prompt after installation

### Step 2: Backend Setup
Open Command Prompt or PowerShell and run:

```bash
# Navigate to project
cd C:\Users\Sam_Ke\esubu_credit_scoring_v2\esubu-sacco-app

# Create Python environment
C:\Users\Sam_Ke\anaconda3\_conda.exe create -n esubu-sacco python=3.11 -y

# Install backend dependencies
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install fastapi==0.104.1 uvicorn[standard]==0.24.0 python-multipart==0.0.6 python-jose[cryptography]==3.3.0 passlib[bcrypt]==1.7.4 sqlalchemy==2.0.23 pydantic==1.10.12 python-dotenv==1.0.0 pandas==2.1.3 reportlab==4.0.7 python-decouple==3.8 email-validator==2.1.0 aiofiles==23.2.1 jinja2==3.1.2

# Initialize database
cd backend
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python init_db.py
```

### Step 3: Frontend Setup
Open a NEW Command Prompt/PowerShell window:

```bash
# Navigate to frontend
cd C:\Users\Sam_Ke\esubu_credit_scoring_v2\esubu-sacco-app\frontend

# Install dependencies
npm install

# Start frontend (this will open browser automatically)
npm start
```

### Step 4: Start Backend Server
In another NEW Command Prompt/PowerShell window:

```bash
# Navigate to backend
cd C:\Users\Sam_Ke\esubu_credit_scoring_v2\esubu-sacco-app\backend

# Start backend server
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python run_server.py
```

## 🎯 Access Your Application

After both servers are running:

- **Frontend Website**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔑 Login Credentials

- **Admin**: admin@esubusacco.co.ke / admin123
- **Officer**: officer@esubusacco.co.ke / officer123

## ✅ What You'll See

1. **Public Website** - Professional SACCO landing page
2. **Loan Application Form** - For public users
3. **Staff Login** - Secure authentication
4. **Officer Dashboard** - Manage loan applications
5. **Admin Panel** - Full system control

## 🆘 If You Encounter Issues

1. **Python not found**: Make sure Anaconda is installed and path is correct
2. **Node.js not found**: Install Node.js from official website
3. **Port conflicts**: Make sure ports 3000 and 8000 are free
4. **Dependencies fail**: Try installing them one by one
