# 🚨 Troubleshooting Guide - Esubu SACCO Setup

## 🔍 **Step-by-Step Troubleshooting**

### **Issue 1: Node.js Not Found**
**Error**: `node: The term 'node' is not recognized...`

**Solution**:
1. Download Node.js from https://nodejs.org/ (choose LTS version)
2. Install it with default settings
3. **Restart your command prompt/PowerShell**
4. Test: `node --version` should show version number

### **Issue 2: Python/Conda Not Working**
**Error**: `conda: The term 'conda' is not recognized...`

**Solution**:
1. Your conda path is: `C:\Users\Sam_Ke\anaconda3\_conda.exe`
2. This should work, but if not, try:
   - Install Anaconda from https://www.anaconda.com/
   - Or install Miniconda from https://docs.conda.io/en/latest/miniconda.html

### **Issue 3: Package Installation Failures**
**Error**: `ERROR: Failed building wheel...` or similar

**Solution**:
Try installing packages individually:
```bash
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install fastapi
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install uvicorn
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install sqlalchemy
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install pydantic
```

### **Issue 4: Database Initialization Fails**
**Error**: Database or import errors

**Solution**:
```bash
cd backend
# Check if all files are there
dir
# Try running database init manually
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python init_db.py
```

### **Issue 5: Frontend Dependencies Fail**
**Error**: `npm install` fails

**Solution**:
```bash
cd frontend
# Clear npm cache
npm cache clean --force
# Try installing again
npm install
# Or install minimal dependencies
npm install react react-dom react-router-dom axios
```

## 🔧 **Manual Step-by-Step Setup**

If the automated script fails, follow these manual steps:

### **Step 1: Install Prerequisites**
1. Install Node.js from https://nodejs.org/
2. Restart command prompt

### **Step 2: Create Python Environment**
```bash
C:\Users\Sam_Ke\anaconda3\_conda.exe create -n esubu-sacco python=3.11 -y
```

### **Step 3: Install Core Backend Packages**
```bash
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco pip install fastapi uvicorn sqlalchemy pydantic python-dotenv
```

### **Step 4: Test Backend**
```bash
cd backend
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python init_db.py
```

### **Step 5: Install Frontend**
```bash
cd frontend
npm install
```

### **Step 6: Start Servers**

**Backend** (new terminal):
```bash
cd backend
C:\Users\Sam_Ke\anaconda3\_conda.exe run -n esubu-sacco python run_server.py
```

**Frontend** (new terminal):
```bash
cd frontend
npm start
```

## 🎯 **Quick Test Commands**

To verify everything is working:

1. **Test conda**: `C:\Users\Sam_Ke\anaconda3\_conda.exe --version`
2. **Test Node.js**: `node --version`
3. **Test npm**: `npm --version`
4. **Test environment**: `C:\Users\Sam_Ke\anaconda3\_conda.exe env list`

## 🆘 **If All Else Fails**

1. **Use online development environment** like Replit or CodeSandbox
2. **Install Docker** and run containerized version
3. **Use cloud deployment** services like Heroku or Render

## 📞 **Common Error Messages & Solutions**

| Error | Solution |
|-------|----------|
| "Python was not found" | Install Python or use full conda path |
| "node is not recognized" | Install Node.js and restart terminal |
| "Permission denied" | Run as Administrator |
| "Port already in use" | Kill processes on ports 3000/8000 |
| "Module not found" | Install missing packages individually |

## 💡 **Pro Tips**

1. **Always restart your terminal** after installing new software
2. **Use full paths** if commands aren't recognized
3. **Check internet connection** for package downloads
4. **Run as Administrator** if permission issues occur
5. **Use Windows Defender exclusions** for development folders
