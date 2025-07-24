from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./esubu_sacco.db"
    
    # Security
    SECRET_KEY: str = "esubu-sacco-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # SACCO Information
    SACCO_NAME: str = "Esubu SACCO"
    SACCO_TAGLINE: str = "Empowering Dreams. One Loan at a Time."
    SACCO_LICENSE: str = "Licensed by SASRA"
    
    # Contact Information
    CONTACT_EMAIL: str = "info@esubusacco.co.ke"
    CONTACT_PHONE: str = "+254-700-123-456"
    CONTACT_ADDRESS: str = "Bungoma County, Kenya"
    
    # Admin Configuration
    ADMIN_EMAIL: str = "admin@esubusacco.co.ke"
    ADMIN_PASSWORD: str = "admin123"  # Change in production
    
    class Config:
        env_file = ".env"

settings = Settings()
