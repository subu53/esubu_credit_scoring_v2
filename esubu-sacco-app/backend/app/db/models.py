from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin, officer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships
    loan_applications_created = relationship("LoanApplication", back_populates="created_by_user")
    remarks = relationship("ApplicationRemark", back_populates="user")

class LoanApplication(Base):
    __tablename__ = "loan_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Applicant Information
    full_name = Column(String, nullable=False)
    id_number = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    email = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    marital_status = Column(String, nullable=False)
    
    # Employment Information
    employment_status = Column(String, nullable=False)
    employer_name = Column(String)
    job_title = Column(String)
    monthly_income = Column(Float, nullable=False)
    employment_duration = Column(String)
    
    # Loan Information
    loan_amount = Column(Float, nullable=False)
    loan_purpose = Column(String, nullable=False)
    loan_term_months = Column(Integer, nullable=False)
    
    # Address Information
    residential_address = Column(Text, nullable=False)
    county = Column(String, nullable=False)
    
    # Credit Information
    has_existing_loans = Column(Boolean, default=False)
    existing_loan_details = Column(Text)
    monthly_expenses = Column(Float, nullable=False)
    
    # System Generated
    application_number = Column(String, unique=True, nullable=False)
    credit_score = Column(Float)
    system_decision = Column(String)  # approved, rejected, pending
    decision_reason = Column(Text)
    
    # Tracking
    status = Column(String, default="pending")  # pending, under_review, approved, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    created_by_user = relationship("User", back_populates="loan_applications_created")
    remarks = relationship("ApplicationRemark", back_populates="application")

class ApplicationRemark(Base):
    __tablename__ = "application_remarks"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("loan_applications.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    remark = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    application = relationship("LoanApplication", back_populates="remarks")
    user = relationship("User", back_populates="remarks")

class SystemLog(Base):
    __tablename__ = "system_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)
    details = Column(Text)
    ip_address = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
