from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, and_, func
from app.db.models import LoanApplication, ApplicationRemark
from app.schemas.loan_application import LoanApplicationCreate, LoanApplicationUpdate, ApplicationRemarkCreate
from typing import Optional, List
import random
import string
from datetime import datetime

def generate_application_number():
    """Generate unique application number"""
    prefix = "ESB"
    timestamp = datetime.now().strftime("%Y%m%d")
    random_suffix = ''.join(random.choices(string.digits, k=4))
    return f"{prefix}{timestamp}{random_suffix}"

def calculate_credit_score(application_data: dict) -> float:
    """Simple credit scoring algorithm"""
    score = 600  # Base score
    
    # Income factor
    monthly_income = application_data.get('monthly_income', 0)
    if monthly_income > 100000:
        score += 100
    elif monthly_income > 50000:
        score += 50
    elif monthly_income > 30000:
        score += 25
    
    # Employment status
    employment_status = application_data.get('employment_status', '')
    if employment_status in ['Employed', 'Self-employed']:
        score += 50
    elif employment_status == 'Student':
        score += 10
    
    # Loan to income ratio
    loan_amount = application_data.get('loan_amount', 0)
    if monthly_income > 0:
        ratio = loan_amount / (monthly_income * 12)
        if ratio < 0.3:
            score += 50
        elif ratio < 0.5:
            score += 25
        elif ratio > 0.8:
            score -= 50
    
    # Existing loans penalty
    if application_data.get('has_existing_loans', False):
        score -= 30
    
    # Expense to income ratio
    monthly_expenses = application_data.get('monthly_expenses', 0)
    if monthly_income > 0:
        expense_ratio = monthly_expenses / monthly_income
        if expense_ratio < 0.5:
            score += 30
        elif expense_ratio > 0.8:
            score -= 40
    
    return max(300, min(850, score))  # Keep score between 300-850

def get_system_decision(credit_score: float) -> tuple:
    """Determine system decision based on credit score"""
    if credit_score >= 700:
        return "approved", "Excellent credit profile"
    elif credit_score >= 600:
        return "pending", "Credit profile needs manual review"
    else:
        return "rejected", "Credit score below minimum threshold"

def create_loan_application(db: Session, application: LoanApplicationCreate, user_id: Optional[int] = None):
    # Generate application number
    application_number = generate_application_number()
    
    # Calculate credit score
    application_dict = application.dict()
    credit_score = calculate_credit_score(application_dict)
    
    # Get system decision
    system_decision, decision_reason = get_system_decision(credit_score)
    
    db_application = LoanApplication(
        **application.dict(),
        application_number=application_number,
        credit_score=credit_score,
        system_decision=system_decision,
        decision_reason=decision_reason,
        created_by=user_id
    )
    
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def get_loan_application(db: Session, application_id: int):
    return db.query(LoanApplication).options(
        joinedload(LoanApplication.remarks)
    ).filter(LoanApplication.id == application_id).first()

def get_loan_applications(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    decision: Optional[str] = None
):
    query = db.query(LoanApplication).options(
        joinedload(LoanApplication.remarks)
    )
    
    if status:
        query = query.filter(LoanApplication.status == status)
    if decision:
        query = query.filter(LoanApplication.system_decision == decision)
    
    return query.order_by(desc(LoanApplication.created_at)).offset(skip).limit(limit).all()

def update_loan_application(db: Session, application_id: int, application_update: LoanApplicationUpdate):
    db_application = db.query(LoanApplication).filter(LoanApplication.id == application_id).first()
    if db_application:
        update_data = application_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_application, field, value)
        db_application.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_application)
    return db_application

def add_remark(db: Session, remark: ApplicationRemarkCreate, user_id: int):
    db_remark = ApplicationRemark(
        application_id=remark.application_id,
        user_id=user_id,
        remark=remark.remark
    )
    db.add(db_remark)
    db.commit()
    db.refresh(db_remark)
    return db_remark

def get_application_stats(db: Session):
    """Get application statistics"""
    total = db.query(LoanApplication).count()
    pending = db.query(LoanApplication).filter(LoanApplication.status == "pending").count()
    approved = db.query(LoanApplication).filter(LoanApplication.system_decision == "approved").count()
    rejected = db.query(LoanApplication).filter(LoanApplication.system_decision == "rejected").count()
    under_review = db.query(LoanApplication).filter(LoanApplication.status == "under_review").count()
    
    return {
        "total": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "under_review": under_review
    }

def search_applications(db: Session, search_term: str):
    """Search applications by name, ID number, or application number"""
    return db.query(LoanApplication).filter(
        (LoanApplication.full_name.contains(search_term)) |
        (LoanApplication.id_number.contains(search_term)) |
        (LoanApplication.application_number.contains(search_term))
    ).order_by(desc(LoanApplication.created_at)).all()
