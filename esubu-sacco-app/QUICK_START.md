# 🚀 Quick Start Guide - Esubu SACCO Management System

## ⚡ Get Running in 10 Minutes

### **Prerequisites**
- Download and install Node.js from https://nodejs.org/
- Conda/Anaconda already available on your system

### **Backend Setup (5 minutes)**
```bash
# 1. Create Python environment
C:\Users\Sam_Ke\anaconda3\_conda.exe create -n esubu-sacco python=3.11 -y

# 2. Install dependencies
cd backend
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install fastapi uvicorn python-multipart sqlalchemy pydantic python-jose[cryptography] passlib[bcrypt] python-dotenv pandas reportlab python-decouple email-validator aiofiles jinja2

# 3. Initialize database
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python init_db.py

# 4. Start backend server
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python run_server.py
```

### **Frontend Setup (5 minutes)**
```bash
# In a new terminal:
cd frontend
npm install
npm start
```

### **Access the Application**
- **Website**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### **Login Credentials**
- **Admin**: admin@esubusacco.co.ke / admin123  
- **Officer**: officer@esubusacco.co.ke / officer123

## 🎯 **What You'll See**

### **Public Website (localhost:3000)**
✅ Professional SACCO landing page  
✅ About Us with Bungoma County story  
✅ Services and contact information  
✅ Online loan application form  
✅ "Licensed by SASRA" badge  
✅ Mobile-responsive design  

### **Staff Dashboard (after login)**
✅ Loan application management  
✅ Search and filter applications  
✅ Status tracking and remarks  
✅ Dashboard statistics  
✅ Admin user management  
✅ CSV export functionality  

## 🏆 **You Now Have**
A fully functional, production-ready SACCO management system with:
- Professional frontend website
- Secure backend API
- Role-based access control
- Credit scoring integration
- Comprehensive dashboards
- Modern tech stack (React + FastAPI)
