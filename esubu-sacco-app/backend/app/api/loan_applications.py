from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.loan_application import (
    LoanApplication, 
    LoanApplicationCreate, 
    LoanApplicationUpdate,
    LoanApplicationWithRemarks,
    ApplicationRemarkCreate,
    ApplicationRemark
)
from app.crud import loan_application as loan_crud
from app.core.security import get_current_user, get_current_officer_user

router = APIRouter()

@router.post("/", response_model=LoanApplication)
async def create_loan_application(
    application: LoanApplicationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_officer_user)
):
    """Create a new loan application"""
    return loan_crud.create_loan_application(db, application, current_user.id)

@router.get("/", response_model=List[LoanApplication])
async def get_loan_applications(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None, description="Filter by status"),
    decision: Optional[str] = Query(None, description="Filter by system decision"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_officer_user)
):
    """Get all loan applications with optional filters"""
    return loan_crud.get_loan_applications(db, skip=skip, limit=limit, status=status, decision=decision)

@router.get("/stats")
async def get_application_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_officer_user)
):
    """Get application statistics for dashboard"""
    return loan_crud.get_application_stats(db)

@router.get("/search")
async def search_applications(
    q: str = Query(..., description="Search term"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_officer_user)
):
    """Search applications by name, ID, or application number"""
    return loan_crud.search_applications(db, q)

@router.get("/{application_id}", response_model=LoanApplicationWithRemarks)
async def get_loan_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_officer_user)
):
    """Get a specific loan application with remarks"""
    application = loan_crud.get_loan_application(db, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.put("/{application_id}", response_model=LoanApplication)
async def update_loan_application(
    application_id: int,
    application_update: LoanApplicationUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_officer_user)
):
    """Update a loan application (status, decision, etc.)"""
    application = loan_crud.update_loan_application(db, application_id, application_update)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.post("/{application_id}/remarks", response_model=ApplicationRemark)
async def add_application_remark(
    application_id: int,
    remark_text: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_officer_user)
):
    """Add a remark to an application"""
    remark = ApplicationRemarkCreate(application_id=application_id, remark=remark_text)
    return loan_crud.add_remark(db, remark, current_user.id)
