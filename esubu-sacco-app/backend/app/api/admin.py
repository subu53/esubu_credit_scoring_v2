from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import User, UserCreate, UserUpdate
from app.schemas.loan_application import LoanApplicationUpdate
from app.crud import user as user_crud
from app.crud import loan_application as loan_crud
from app.core.security import get_current_admin_user
import pandas as pd
from io import StringIO

router = APIRouter()

@router.get("/dashboard")
async def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get comprehensive dashboard data for admins"""
    stats = loan_crud.get_application_stats(db)
    
    # Get user statistics
    total_officers = len(user_crud.get_officers(db))
    total_admins = len(user_crud.get_admins(db))
    
    # Get recent applications
    recent_applications = loan_crud.get_loan_applications(db, skip=0, limit=10)
    
    return {
        "application_stats": stats,
        "user_stats": {
            "total_officers": total_officers,
            "total_admins": total_admins
        },
        "recent_applications": recent_applications,
        "user_info": {
            "name": current_user.full_name,
            "role": current_user.role,
            "email": current_user.email
        }
    }

# User Management
@router.post("/users/", response_model=User)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create a new user (officer or admin)"""
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_crud.create_user(db=db, user=user)

@router.get("/users/", response_model=List[User])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get all users"""
    return user_crud.get_users(db, skip=skip, limit=limit)

@router.get("/users/{user_id}", response_model=User)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get a specific user"""
    db_user = user_crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/users/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update a user"""
    db_user = user_crud.update_user(db, user_id=user_id, user_update=user_update)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/users/{user_id}")
async def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Deactivate a user"""
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
    
    db_user = user_crud.deactivate_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deactivated successfully"}

# Application Management
@router.put("/applications/{application_id}/override")
async def override_application_decision(
    application_id: int,
    decision: str,
    reason: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Override system decision for an application"""
    if decision not in ["approved", "rejected", "pending"]:
        raise HTTPException(status_code=400, detail="Invalid decision")
    
    update_data = LoanApplicationUpdate(
        system_decision=decision,
        decision_reason=f"Admin Override: {reason}",
        status="under_review" if decision == "pending" else decision
    )
    
    application = loan_crud.update_loan_application(db, application_id, update_data)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return application

# Reports
@router.get("/reports/applications/csv")
async def export_applications_csv(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Export all applications as CSV"""
    applications = loan_crud.get_loan_applications(db, skip=0, limit=10000)
    
    # Convert to DataFrame
    data = []
    for app in applications:
        data.append({
            "Application Number": app.application_number,
            "Full Name": app.full_name,
            "ID Number": app.id_number,
            "Phone": app.phone_number,
            "Email": app.email,
            "Loan Amount": app.loan_amount,
            "Loan Purpose": app.loan_purpose,
            "Monthly Income": app.monthly_income,
            "Credit Score": app.credit_score,
            "System Decision": app.system_decision,
            "Status": app.status,
            "Created At": app.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    
    df = pd.DataFrame(data)
    csv_buffer = StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_content = csv_buffer.getvalue()
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=loan_applications.csv"}
    )

@router.get("/system/logs")
async def get_system_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get system activity logs"""
    # Placeholder for system logs - would implement actual logging
    return {"message": "System logs feature coming soon"}
