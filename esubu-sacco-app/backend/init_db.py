from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db import models
from app.crud.user import create_user
from app.schemas.user import UserCreate
from app.core.config import settings

def init_db():
    """Initialize database with default admin user"""
    # Create tables
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin exists
        existing_admin = db.query(models.User).filter(
            models.User.email == settings.ADMIN_EMAIL
        ).first()
        
        if not existing_admin:
            admin_user = UserCreate(
                email=settings.ADMIN_EMAIL,
                password=settings.ADMIN_PASSWORD,
                full_name="System Administrator",
                role="admin"
            )
            create_user(db, admin_user)
            print(f"Created admin user: {settings.ADMIN_EMAIL}")
        else:
            print("Admin user already exists")
            
        # Create sample officer
        existing_officer = db.query(models.User).filter(
            models.User.email == "officer@esubusacco.co.ke"
        ).first()
        
        if not existing_officer:
            officer_user = UserCreate(
                email="officer@esubusacco.co.ke",
                password="officer123",
                full_name="John Doe",
                role="officer"
            )
            create_user(db, officer_user)
            print("Created sample officer user: officer@esubusacco.co.ke")
        else:
            print("Sample officer already exists")
            
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
