#!/bin/bash

# Esubu SACCO Setup Script
echo "🏦 Setting up Esubu SACCO Web Application..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create build directory
echo "🏗️ Creating build directory..."
npm run build

# Start development server
echo "🚀 Starting development server..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API is connected to: https://esubu-credit-scoring-v2-1-edit-12.onrender.com"
echo ""
echo "✅ Setup complete!"
echo ""
echo "🔧 Available commands:"
echo "  npm start     - Start development server"
echo "  npm run build - Build for production"
echo "  npm test      - Run tests"

npm start
