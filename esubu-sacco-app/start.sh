#!/bin/bash

# Esubu SACCO Application Startup Script
echo "🏦 Starting Esubu SACCO Management System"
echo "Empowering Dreams. One Loan at a Time."
echo "Licensed by SASRA"
echo "=========================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo "🔍 Checking dependencies..."

if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is required but not installed."
    exit 1
fi

echo "✅ All dependencies found!"

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Initialize database
echo "🗄️ Initializing database..."
python init_db.py

# Start backend server in background
echo "🚀 Starting backend server..."
python run_server.py &
BACKEND_PID=$!

cd ..

# Setup frontend
echo "🔧 Setting up frontend..."
cd frontend

# Install Node.js dependencies
echo "📥 Installing Node.js dependencies..."
npm install

# Start frontend server
echo "🚀 Starting frontend server..."
npm start &
FRONTEND_PID=$!

cd ..

echo ""
echo "🎉 Esubu SACCO is now running!"
echo "================================="
echo "�� Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "🔐 Demo Login Credentials:"
echo "Admin: admin@esubusacco.co.ke / admin123"
echo "Officer: officer@esubusacco.co.ke / officer123"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap 'echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT
wait
