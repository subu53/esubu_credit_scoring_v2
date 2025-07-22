from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import User
from app.crud import user as user_crud
from app.core.security import get_current_officer_user

router = APIRouter()

@router.get("/dashboard")
async def get_officer_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_officer_user)
):
    """Get dashboard data for loan officers"""
    from app.crud.loan_application import get_application_stats
    
    stats = get_application_stats(db)
    
    # Get recent applications
    from app.crud.loan_application import get_loan_applications
    recent_applications = get_loan_applications(db, skip=0, limit=5)
    
    return {
        "stats": stats,
        "recent_applications": recent_applications,
        "user_info": {
            "name": current_user.full_name,
            "role": current_user.role,
            "email": current_user.email
        }
    }

@router.get("/profile", response_model=User)
async def get_officer_profile(current_user = Depends(get_current_officer_user)):
    """Get current officer's profile"""
    return current_user
