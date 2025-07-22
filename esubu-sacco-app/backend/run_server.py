#!/usr/bin/env python3
"""
Esubu SACCO Backend Server
Run this script to start the FastAPI backend server
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    print("🏦 Starting Esubu SACCO Backend Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔐 Licensed by SASRA")
    print("-" * 50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
