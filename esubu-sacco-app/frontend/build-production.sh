#!/bin/bash

echo "🏦 Building Esubu SACCO Frontend for Production"
echo "=============================================="

# Set production environment
export NODE_ENV=production
export GENERATE_SOURCEMAP=false
export CI=false

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Copy additional files
echo "📋 Copying deployment files..."
cp _redirects build/ 2>/dev/null || echo "No _redirects file found"
cp render.yaml build/ 2>/dev/null || echo "No render.yaml file found"

echo ""
echo "✅ Build completed successfully!"
echo "📁 Build files are in the 'build' directory"
echo "🚀 Ready for deployment to Render"
echo ""
echo "Next steps:"
echo "1. Push code to GitHub"
echo "2. Connect to Render"
echo "3. Deploy as Static Site"
echo ""
echo "🌐 Your Esubu SACCO will be live soon!"
