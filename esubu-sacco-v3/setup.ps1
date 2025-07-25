# Esubu SACCO Setup Script for Windows
Write-Host "🏦 Setting up Esubu SACCO Web Application..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location frontend

# Install dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

# Create build directory
Write-Host "🏗️ Creating build directory..." -ForegroundColor Yellow
npm run build

# Start development server
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API is connected to: https://esubu-credit-scoring-v2-1-edit-12.onrender.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Available commands:" -ForegroundColor White
Write-Host "  npm start     - Start development server" -ForegroundColor Gray
Write-Host "  npm run build - Build for production" -ForegroundColor Gray
Write-Host "  npm test      - Run tests" -ForegroundColor Gray

npm start
