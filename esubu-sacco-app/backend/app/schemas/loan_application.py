from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class LoanApplicationBase(BaseModel):
    # Applicant Information
    full_name: str
    id_number: str
    phone_number: str
    email: EmailStr
    date_of_birth: str
    gender: str
    marital_status: str
    
    # Employment Information
    employment_status: str
    employer_name: Optional[str] = None
    job_title: Optional[str] = None
    monthly_income: float
    employment_duration: Optional[str] = None
    
    # Loan Information
    loan_amount: float
    loan_purpose: str
    loan_term_months: int
    
    # Address Information
    residential_address: str
    county: str
    
    # Credit Information
    has_existing_loans: bool = False
    existing_loan_details: Optional[str] = None
    monthly_expenses: float

class LoanApplicationCreate(LoanApplicationBase):
    pass

class LoanApplicationUpdate(BaseModel):
    status: Optional[str] = None
    system_decision: Optional[str] = None
    decision_reason: Optional[str] = None
    credit_score: Optional[float] = None

class LoanApplication(LoanApplicationBase):
    id: int
    application_number: str
    credit_score: Optional[float] = None
    system_decision: Optional[str] = None
    decision_reason: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[int] = None
    
    class Config:
        from_attributes = True

class ApplicationRemarkBase(BaseModel):
    remark: str

class ApplicationRemarkCreate(ApplicationRemarkBase):
    application_id: int

class ApplicationRemark(ApplicationRemarkBase):
    id: int
    application_id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class LoanApplicationWithRemarks(LoanApplication):
    remarks: List[ApplicationRemark] = []
