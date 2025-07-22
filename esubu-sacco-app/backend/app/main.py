from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.database import get_db, engine
from app.db import models
from app.api import auth, loan_applications, admin, officers
from app.core.security import get_current_user

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Esubu SACCO Management System",
    description="Empowering Dreams. One Loan at a Time.",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(loan_applications.router, prefix="/api/v1/loans", tags=["Loan Applications"])
app.include_router(officers.router, prefix="/api/v1/officers", tags=["Officers"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {"message": "Welcome to Esubu SACCO - Empowering Dreams. One Loan at a Time."}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Esubu SACCO API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
