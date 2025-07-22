import streamlit as st
import pandas as pd
import numpy as np
import joblib
import cloudpickle
import pickle
from sklearn.preprocessing import LabelEncoder
import os
from pathlib import Path
from datetime import datetime
import base64
from io import BytesIO

# Import our custom modules
from config import *
from utils import SecurityUtils, DatabaseUtils, log_user_action, validate_input, logger

# ------------------ DATABASE ------------------
def create_user_table():
    """Create users table with enhanced security"""
    try:
        query = '''CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('admin', 'officer', 'member')),
            full_name TEXT,
            email TEXT,
            phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )'''
        DatabaseUtils.execute_query(query)
        
        # 🔐 Seed default admin if not exists
        existing_admin = DatabaseUtils.execute_query(
            "SELECT username FROM users WHERE username = ?", 
            (DEFAULT_ADMIN_USERNAME,), 
            fetch_one=True
        )
        
        if not existing_admin:
            hashed_password = SecurityUtils.hash_password(DEFAULT_ADMIN_PASSWORD)
            DatabaseUtils.execute_query(
                "INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)",
                (DEFAULT_ADMIN_USERNAME, hashed_password, 'admin', 'System Administrator')
            )
            logger.info(f"Default admin user '{DEFAULT_ADMIN_USERNAME}' created")
            
    except Exception as e:
        logger.error(f"Error creating user table: {e}")
        st.error("Database initialization failed. Please check logs.")

def create_loan_applications_table():
    """Create loan applications table"""
    try:
        query = '''CREATE TABLE IF NOT EXISTS loan_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            applicant_name TEXT NOT NULL,
            applicant_email TEXT,
            applicant_phone TEXT,
            applicant_id_number TEXT,
            age INTEGER,
            employment_status TEXT,
            monthly_income REAL,
            monthly_savings REAL,
            requested_loan_amount REAL,
            years_with_sacco INTEGER,
            mobile_money_account_age INTEGER,
            total_mobile_money_last_month REAL,
            credit_history_length REAL,
            past_loan_default INTEGER,
            active_loans INTEGER,
            household_size INTEGER,
            dependents INTEGER,
            region_type TEXT,
            has_collateral INTEGER,
            collateral_value REAL,
            loan_purpose TEXT,
            guarantor_name TEXT,
            guarantor_phone TEXT,
            credit_score INTEGER,
            decision TEXT,
            approved_amount REAL,
            probability REAL,
            status TEXT DEFAULT 'pending',
            created_by TEXT,
            reviewed_by TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            notes TEXT
        )'''
        DatabaseUtils.execute_query(query)
    except Exception as e:
        logger.error(f"Error creating loan applications table: {e}")
        st.error("Database initialization failed. Please check logs.")

def add_user(username, password, role, full_name="", email="", phone=""):
    """Add user with hashed password"""
    try:
        # Validate input
        if not username or not password or not role:
            return False, "All fields are required"
        
        if role not in ['admin', 'officer', 'member']:
            return False, "Invalid role"
        
        # Hash password
        hashed_password = SecurityUtils.hash_password(password)
        
        # Insert user
        DatabaseUtils.execute_query(
            "INSERT INTO users (username, password, role, full_name, email, phone) VALUES (?, ?, ?, ?, ?, ?)",
            (username, hashed_password, role, full_name, email, phone)
        )
        
        log_user_action(st.session_state.get('username', 'system'), 'USER_CREATED', f"Created user: {username}")
        return True, "User created successfully"
        
    except Exception as e:
        logger.error(f"Error adding user {username}: {e}")
        return False, "Username already exists or database error"

def login_user(username, password):
    """Authenticate user with hashed password"""
    try:
        user = DatabaseUtils.execute_query(
            "SELECT password, role, full_name FROM users WHERE username = ?",
            (username,),
            fetch_one=True
        )
        
        if user and SecurityUtils.verify_password(password, user['password']):
            # Update last login
            DatabaseUtils.execute_query(
                "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE username = ?",
                (username,)
            )
            
            log_user_action(username, 'LOGIN_SUCCESS', "User logged in")
            return user['role'], user['full_name']
        
        log_user_action(username, 'LOGIN_FAILED', "Invalid credentials")
        return None, None
        
    except Exception as e:
        logger.error(f"Login error for user {username}: {e}")
        return None

def get_all_users():
    """Get all users with enhanced error handling"""
    try:
        users = DatabaseUtils.execute_query(
            "SELECT username, role, full_name, email, phone, created_at, last_login FROM users ORDER BY username",
            fetch_all=True
        )
        return [dict(user) for user in users] if users else []
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        return []

def delete_user(username):
    """Delete user with logging"""
    try:
        if username == DEFAULT_ADMIN_USERNAME:
            return False, "Cannot delete default admin user"
        
        rows_affected = DatabaseUtils.execute_query(
            "DELETE FROM users WHERE username = ?", 
            (username,)
        )
        
        if rows_affected > 0:
            log_user_action(st.session_state.get('username', 'system'), 'USER_DELETED', f"Deleted user: {username}")
            return True, "User deleted successfully"
        else:
            return False, "User not found"
            
    except Exception as e:
        logger.error(f"Error deleting user {username}: {e}")
        return False, "Database error occurred"

def save_loan_application(form_data, results=None):
    """Save loan application to database"""
    try:
        query = '''INSERT INTO loan_applications (
            applicant_name, applicant_email, applicant_phone, applicant_id_number,
            age, employment_status, monthly_income, monthly_savings, requested_loan_amount,
            years_with_sacco, mobile_money_account_age, total_mobile_money_last_month,
            credit_history_length, past_loan_default, active_loans, household_size,
            dependents, region_type, has_collateral, collateral_value, loan_purpose,
            guarantor_name, guarantor_phone, credit_score, decision, approved_amount,
            probability, status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'''
        
        params = (
            form_data['applicant_name'], form_data.get('applicant_email', ''),
            form_data.get('applicant_phone', ''), form_data.get('applicant_id_number', ''),
            form_data['age'], form_data['employment_status'], form_data['monthly_income'],
            form_data['monthly_savings'], form_data['requested_loan_amount'],
            form_data['years_with_sacco'], form_data['mobile_money_account_age'],
            form_data['total_mobile_money_last_month'], form_data['credit_history_length'],
            form_data['past_loan_default'], form_data['active_loans'], form_data['household_size'],
            form_data.get('dependents', 0), form_data.get('region_type', 'Urban'),
            form_data.get('has_collateral', 0), form_data.get('collateral_value', 0),
            form_data.get('loan_purpose', ''), form_data.get('guarantor_name', ''),
            form_data.get('guarantor_phone', ''),
            results['credit_score'] if results else None,
            results['decision'] if results else 'Pending',
            results['loan_amount'] if results else None,
            results['probability'] if results else None,
            'processed' if results else 'pending',
            st.session_state.get('username', 'anonymous')
        )
        
        DatabaseUtils.execute_query(query, params)
        return True, "Application saved successfully"
    except Exception as e:
        logger.error(f"Error saving loan application: {e}")
        return False, f"Error saving application: {str(e)}"

def get_loan_applications(status=None, created_by=None):
    """Get loan applications with optional filtering"""
    try:
        query = "SELECT * FROM loan_applications"
        params = []
        conditions = []
        
        if status:
            conditions.append("status = ?")
            params.append(status)
        
        if created_by:
            conditions.append("created_by = ?")
            params.append(created_by)
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        query += " ORDER BY created_at DESC"
        
        applications = DatabaseUtils.execute_query(query, tuple(params), fetch_all=True)
        return [dict(app) for app in applications] if applications else []
    except Exception as e:
        logger.error(f"Error fetching loan applications: {e}")
        return []

def update_loan_application(app_id, updates):
    """Update loan application"""
    try:
        set_clauses = []
        params = []
        
        for field, value in updates.items():
            set_clauses.append(f"{field} = ?")
            params.append(value)
        
        params.append(app_id)
        
        query = f"UPDATE loan_applications SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        
        DatabaseUtils.execute_query(query, tuple(params))
        return True, "Application updated successfully"
    except Exception as e:
        logger.error(f"Error updating loan application: {e}")
        return False, f"Error updating application: {str(e)}"

# ------------------ MODEL ------------------
@st.cache_resource
def load_model():
    try:
        return joblib.load("credit_scoring_stacked_model.pkl")
    except FileNotFoundError:
        st.error("Model file not found. Please ensure 'credit_scoring_stacked_model.pkl' is in the app directory.")
        return None
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None

# ------------------ DECISION ENGINE ------------------
def map_probability_to_score(prob, min_score=300, max_score=800):
    return int(min_score + prob * (max_score - min_score))

def decision_logic(prob, income, repayment_history, has_collateral, missing_docs=False):
    credit_score = map_probability_to_score(prob)

    if credit_score >= 700 and repayment_history == 'good':
        decision = 'Approved'
    elif credit_score >= 600 and repayment_history in ['good', 'average'] and has_collateral:
        decision = 'Approved'
    elif 500 <= credit_score < 600 or repayment_history == 'average':
        decision = 'Review'
    else:
        decision = 'Rejected'

    if missing_docs:
        decision = 'Review'

    return credit_score, decision

def estimate_loan_amount(income, credit_score):
    if credit_score >= 750:
        multiplier = 3.0
    elif credit_score >= 700:
        multiplier = 2.5
    elif credit_score >= 650:
        multiplier = 2.0
    elif credit_score >= 600:
        multiplier = 1.5
    else:
        multiplier = 1.0

    return round(income * multiplier, -3)

def generate_message(decision, credit_score, amount=None):
    if decision == 'Approved':
        return f"✅ Congratulations! Your loan has been approved with a credit score of {credit_score}. The approved loan amount is **KES {amount:,.0f}**."
    elif decision == 'Review':
        return f"📋 Your loan application is under review. A loan officer will contact you shortly. (Credit score: {credit_score})"
    else:
        return f"❌ We're sorry, your loan application was not approved at this time. (Credit score: {credit_score})"

def run_decision_engine(model, input_df):
    if model is None:
        return None

    # Exact feature list and order from model's error message
    feature_names = [
        'Age', 'Years_In_Current_Job', 'Mobile_Money_Account_Age_Months', 'Savings_to_Income_Ratio',
        'Sacco_Membership_Years', 'Past_Loan_Default', 'Requested_Loan_Amount_KES', 'Employment_Status_Informal',
        'Years_With_Bank_Account', 'Debt_to_Income_Ratio', 'Monthly_Income_KES', 'Disposable_Income_KES',
        'Mobile_Money_Score', 'Monthly_Savings_KES', 'Sacco_Shares_Value_KES', 'Current_Debt_KES',
        'Active_Loan_Count', 'Monthly_Mobile_Money_Transactions', 'Sacco_Contribution_Rate',
        'Monthly_Mobile_Money_Volume_KES', 'Credit_History_Length_Years', 'Loan_to_Income_Ratio',
        'Debt_Service_Ratio', 'Monthly_Sacco_Contribution_KES', 'Household_Size', 'Asset_Ownership_Score',
        'Dependents', 'Previous_Sacco_Loans', 'Region_Type_Semi-Urban', 'Previous_Loans_Count'
    ]

    # Set default values: 0 for numeric, False for bool
    row = {col: 0 for col in feature_names}
    # Set bool columns to False (if any)
    bool_cols = [col for col in feature_names if "Region_Type_" in col or "Employment_Status_" in col]
    for col in bool_cols:
        row[col] = False

    # Fill in values from the form (input_df)
    for col in input_df.columns:
        if col in row:
            row[col] = input_df[col].values[0]

    # Build DataFrame
    full_input_df = pd.DataFrame([row], columns=feature_names)

    # Predict probability
    try:
        prob = model.predict_proba(full_input_df)[0][1]
    except Exception as e:
        st.error(f"Prediction error: {e}")
        return None

    # Use original (non-transformed) values for logic decisions
    income = row.get('Monthly_Income_KES', 0)
    repayment_history = None
    has_collateral = row.get('Has_Collateral', None)
    missing_docs = False

    credit_score, decision = decision_logic(prob, income, repayment_history, has_collateral, missing_docs)

    approved_loan_amount = None
    if decision == 'Approved':
        approved_loan_amount = estimate_loan_amount(income, credit_score)

    message = generate_message(decision, credit_score, approved_loan_amount)

    return {
        'credit_score': credit_score,
        'decision': decision,
        'loan_amount': approved_loan_amount,
        'probability': round(prob, 4),
        'message': message
    }

# ------------------ UTILITY FUNCTIONS ------------------
def export_to_excel(data, filename):
    """Export data to Excel format"""
    output = BytesIO()
    df = pd.DataFrame(data)
    
    # Convert timestamp columns to readable format
    timestamp_cols = ['created_at', 'updated_at', 'last_login']
    for col in timestamp_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col]).dt.strftime('%Y-%m-%d %H:%M:%S')
    
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Data', index=False)
    
    return output.getvalue()

def create_download_link(data, filename, link_text):
    """Create a download link for data"""
    excel_data = export_to_excel(data, filename)
    b64 = base64.b64encode(excel_data).decode()
    href = f'<a href="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,{b64}" download="{filename}">{link_text}</a>'
    return href

# ------------------ UI FUNCTIONS ------------------
def show_header():
    """Show the main header for the website"""
    st.markdown("""
    <div style="background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%); padding: 2rem; border-radius: 10px; margin-bottom: 2rem;">
        <h1 style="color: white; text-align: center; margin: 0; font-size: 2.5rem;">
            🏦 Esubu Sacco
        </h1>
        <p style="color: #e0e0e0; text-align: center; margin: 0.5rem 0 0 0; font-size: 1.2rem;">
            Your Trusted Financial Partner - Empowering Communities Through Smart Lending
        </p>
    </div>
    """, unsafe_allow_html=True)

def show_homepage():
    """Show the homepage for visitors"""
    show_header()
    
    # Hero section
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("""
        ## Welcome to Esubu Sacco
        
        At Esubu Sacco, we believe in empowering our community through accessible financial services. 
        Our AI-powered loan application system ensures fair, fast, and transparent loan processing.
        
        ### Why Choose Esubu Sacco?
        
        ✅ **Quick Loan Processing** - Get decisions in minutes, not days  
        ✅ **Fair Assessment** - AI-powered credit scoring ensures fairness  
        ✅ **Competitive Rates** - Best rates for our valued members  
        ✅ **Community Focused** - Supporting local economic growth  
        ✅ **Transparent Process** - Know exactly where you stand  
        """)
        
        st.markdown("### Ready to Apply?")
        if st.button("🚀 Apply for a Loan Now", type="primary", use_container_width=True):
            st.session_state.show_loan_form = True
            st.rerun()
    
    with col2:
        st.markdown("""
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #2a5298;">
            <h4 style="color: #2a5298; margin-top: 0;">📊 Quick Stats</h4>
            <p><strong>10,000+</strong> Members Served</p>
            <p><strong>KES 500M+</strong> Loans Disbursed</p>
            <p><strong>95%</strong> Satisfaction Rate</p>
            <p><strong>24/7</strong> Online Service</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("---")
        
        st.markdown("""
        <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #28a745;">
            <h4 style="color: #28a745; margin-top: 0;">💡 Loan Tips</h4>
            <ul style="margin: 0; padding-left: 1rem;">
                <li>Maintain good savings habits</li>
                <li>Keep mobile money active</li>
                <li>Pay previous loans on time</li>
                <li>Provide accurate information</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

def login_page():
    """Enhanced login page"""
    show_header()
    
    st.markdown("## 🔐 Staff Login Portal")
    st.markdown("Access your dashboard to manage loan applications and member services.")
    
    with st.form("login_form"):
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        login_submitted = st.form_submit_button("Login")
        
        if login_submitted:
            if username and password:
                role, full_name = login_user(username, password)
                if role:
                    st.session_state.logged_in = True
                    st.session_state.username = username
                    st.session_state.role = role
                    st.session_state.full_name = full_name or username
                    st.success(f"Welcome back, {st.session_state.full_name}!")
                    st.rerun()
                else:
                    st.error("Invalid username or password")
            else:
                st.warning("Please enter both username and password")

def logout():
    st.session_state.logged_in = False
    st.session_state.username = ""
    st.session_state.role = ""
    st.session_state.full_name = ""
    st.rerun()

def show_loan_application_form():
    """Show the comprehensive loan application form"""
    show_header()
    
    st.markdown("## 📋 Loan Application Form")
    st.markdown("Please fill out all sections accurately. Your information is secure and confidential.")
    
    with st.form("comprehensive_loan_form", clear_on_submit=False):
        # Personal Information Section
        st.markdown("### 👤 Personal Information")
        col1, col2 = st.columns(2)
        
        with col1:
            applicant_name = st.text_input("Full Name *", placeholder="Enter your full legal name")
            applicant_email = st.text_input("Email Address", placeholder="your.email@example.com")
            age = st.number_input("Age *", min_value=18, max_value=100, value=30)
            applicant_id_number = st.text_input("National ID Number", placeholder="12345678")
        
        with col2:
            applicant_phone = st.text_input("Phone Number", placeholder="+254700000000")
            employment_status = st.selectbox("Employment Status *", [
                "Formal Employment", "Self-employed", "Informal Employment", "Unemployed", "Retired"
            ])
            household_size = st.number_input("Household Size *", min_value=1, max_value=20, value=3)
            dependents = st.number_input("Number of Dependents", min_value=0, max_value=15, value=0)
        
        st.markdown("---")
        
        # Financial Information Section
        st.markdown("### 💰 Financial Information")
        col1, col2 = st.columns(2)
        
        with col1:
            monthly_income = st.number_input("Monthly Income (KES) *", min_value=0, value=50000, step=1000)
            monthly_savings = st.number_input("Monthly Savings (KES) *", min_value=0, value=5000, step=500)
            requested_loan_amount = st.number_input("Requested Loan Amount (KES) *", min_value=1000, value=30000, step=1000)
        
        with col2:
            credit_history_length = st.number_input("Credit History Length (Years)", min_value=0, max_value=30, value=2)
            active_loans = st.number_input("Number of Active Loans", min_value=0, max_value=10, value=0)
            past_loan_default = st.radio("Have you ever defaulted on a loan? *", ["No", "Yes"])
        
        st.markdown("---")
        
        # SACCO & Mobile Money Information
        st.markdown("### 🏛️ SACCO & Mobile Money Information")
        col1, col2 = st.columns(2)
        
        with col1:
            years_with_sacco = st.number_input("Years as SACCO Member *", min_value=0, max_value=40, value=3)
            mobile_money_account_age = st.number_input("Mobile Money Account Age (Months) *", min_value=0, max_value=240, value=24)
        
        with col2:
            total_mobile_money_last_month = st.number_input("Mobile Money Transactions Last Month (KES)", min_value=0, value=15000, step=1000)
            region_type = st.selectbox("Region Type", ["Urban", "Semi-Urban", "Rural"])
        
        st.markdown("---")
        
        # Loan Details Section
        st.markdown("### 📄 Loan Details")
        col1, col2 = st.columns(2)
        
        with col1:
            loan_purpose = st.selectbox("Loan Purpose", [
                "Business Expansion", "Education", "Medical", "Home Improvement", 
                "Agriculture", "Emergency", "Debt Consolidation", "Other"
            ])
            has_collateral = st.radio("Do you have collateral?", ["No", "Yes"])
        
        with col2:
            if has_collateral == "Yes":
                collateral_value = st.number_input("Estimated Collateral Value (KES)", min_value=0, value=0, step=1000)
            else:
                collateral_value = 0
            
        st.markdown("---")
        
        # Guarantor Information
        st.markdown("### 🤝 Guarantor Information (Optional)")
        col1, col2 = st.columns(2)
        
        with col1:
            guarantor_name = st.text_input("Guarantor Full Name", placeholder="Enter guarantor's name")
        
        with col2:
            guarantor_phone = st.text_input("Guarantor Phone Number", placeholder="+254700000000")
        
        st.markdown("---")
        
        # Terms and Conditions
        st.markdown("### 📋 Terms and Conditions")
        terms_accepted = st.checkbox("I agree to the terms and conditions and confirm that all information provided is accurate *")
        privacy_accepted = st.checkbox("I consent to the processing of my personal data for loan assessment purposes *")
        
        # Submit button
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            submitted = st.form_submit_button("🚀 Submit Loan Application", type="primary", use_container_width=True)
        
        # Form validation and processing
        if submitted:
            # Validate required fields
            required_fields = {
                "Full Name": applicant_name,
                "Age": age,
                "Employment Status": employment_status,
                "Monthly Income": monthly_income,
                "Monthly Savings": monthly_savings,
                "Requested Loan Amount": requested_loan_amount,
                "Years with SACCO": years_with_sacco,
                "Mobile Money Account Age": mobile_money_account_age,
                "Past Loan Default": past_loan_default,
                "Terms Acceptance": terms_accepted,
                "Privacy Consent": privacy_accepted
            }
            
            missing_fields = [field for field, value in required_fields.items() 
                            if not value or (isinstance(value, str) and not value.strip())]
            
            if missing_fields:
                st.error(f"Please fill in the following required fields: {', '.join(missing_fields)}")
                return
            
            if not terms_accepted or not privacy_accepted:
                st.error("Please accept the terms and conditions and privacy policy to proceed.")
                return
            
            # Prepare form data
            form_data = {
                'applicant_name': applicant_name,
                'applicant_email': applicant_email,
                'applicant_phone': applicant_phone,
                'applicant_id_number': applicant_id_number,
                'age': age,
                'employment_status': employment_status,
                'monthly_income': monthly_income,
                'monthly_savings': monthly_savings,
                'requested_loan_amount': requested_loan_amount,
                'years_with_sacco': years_with_sacco,
                'mobile_money_account_age': mobile_money_account_age,
                'total_mobile_money_last_month': total_mobile_money_last_month,
                'credit_history_length': credit_history_length,
                'past_loan_default': 1 if past_loan_default == "Yes" else 0,
                'active_loans': active_loans,
                'household_size': household_size,
                'dependents': dependents,
                'region_type': region_type,
                'has_collateral': 1 if has_collateral == "Yes" else 0,
                'collateral_value': collateral_value,
                'loan_purpose': loan_purpose,
                'guarantor_name': guarantor_name,
                'guarantor_phone': guarantor_phone
            }
            
            # Process with ML model
            input_data = {
                "Age": age,
                "Employment_Status_Informal": 1 if employment_status == "Informal Employment" else 0,
                "Monthly_Income_KES": monthly_income,
                "Monthly_Savings_KES": monthly_savings,
                "Requested_Loan_Amount_KES": requested_loan_amount,
                "Sacco_Membership_Years": years_with_sacco,
                "Mobile_Money_Account_Age_Months": mobile_money_account_age,
                "Monthly_Mobile_Money_Volume_KES": total_mobile_money_last_month,
                "Credit_History_Length_Years": credit_history_length,
                "Past_Loan_Default": form_data['past_loan_default'],
                "Active_Loan_Count": active_loans,
                "Household_Size": household_size,
                "Dependents": dependents,
                "Region_Type_Semi-Urban": 1 if region_type == "Semi-Urban" else 0
            }
            
            input_df = pd.DataFrame([input_data])
            model = load_model()
            
            if model is None:
                st.error("Our system is temporarily unavailable. Please try again later.")
                return
            
            # Run decision engine
            results = run_decision_engine(model, input_df)
            
            if results:
                # Save to database
                success, message = save_loan_application(form_data, results)
                
                if success:
                    st.success("🎉 Application submitted successfully!")
                    
                    # Show results
                    st.markdown("---")
                    st.markdown("## 📊 Loan Assessment Results")
                    
                    # Create results display
                    if results['decision'] == 'Approved':
                        st.success(results['message'])
                        st.balloons()
                    elif results['decision'] == 'Review':
                        st.warning(results['message'])
                    else:
                        st.error(results['message'])
                    
                    # Display details in columns
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        st.metric("Credit Score", results['credit_score'])
                    
                    with col2:
                        st.metric("Approval Probability", f"{results['probability']*100:.1f}%")
                    
                    with col3:
                        if results['loan_amount']:
                            st.metric("Approved Amount", f"KES {results['loan_amount']:,.0f}")
                        else:
                            st.metric("Approved Amount", "Pending Review")
                    
                    st.markdown("---")
                    st.info("📞 A loan officer will contact you within 24 hours to finalize the process. Thank you for choosing Esubu Sacco!")
                    
                else:
                    st.error(f"Error submitting application: {message}")
            else:
                st.error("Unable to process your application. Please contact our support team.")

def admin_dashboard():
    """Enhanced admin dashboard"""
    st.title("👨‍💼 Admin Dashboard")
    st.markdown(f"Welcome back, **{st.session_state.full_name}**! Here's your administrative overview.")
    
    # Quick stats
    applications = get_loan_applications()
    users = get_all_users()
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Applications", len(applications))
    
    with col2:
        pending_count = len([app for app in applications if app['status'] == 'pending'])
        st.metric("Pending Review", pending_count)
    
    with col3:
        approved_count = len([app for app in applications if app['decision'] == 'Approved'])
        st.metric("Approved", approved_count)
    
    with col4:
        st.metric("System Users", len(users))
    
    st.markdown("---")
    
    # Navigation tabs
    tab1, tab2, tab3, tab4 = st.tabs(["📊 Applications Overview", "👥 User Management", "💼 New Loan Form", "📈 Reports"])
    
    with tab1:
        st.subheader("Recent Loan Applications")
        
        if applications:
            # Filter options
            col1, col2, col3 = st.columns(3)
            
            with col1:
                status_filter = st.selectbox("Filter by Status", ["All", "pending", "processed"], key="admin_status_filter")
            
            with col2:
                decision_filter = st.selectbox("Filter by Decision", ["All", "Approved", "Review", "Rejected"], key="admin_decision_filter")
            
            with col3:
                if st.button("📥 Export to Excel"):
                    download_link = create_download_link(applications, "loan_applications.xlsx", "Download Excel File")
                    st.markdown(download_link, unsafe_allow_html=True)
            
            # Apply filters
            filtered_apps = applications
            if status_filter != "All":
                filtered_apps = [app for app in filtered_apps if app['status'] == status_filter]
            if decision_filter != "All":
                filtered_apps = [app for app in filtered_apps if app['decision'] == decision_filter]
            
            # Display applications
            for app in filtered_apps[:10]:  # Show latest 10
                with st.expander(f"Application #{app['id']} - {app['applicant_name']} ({app['decision']})"):
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        st.write(f"**Name:** {app['applicant_name']}")
                        st.write(f"**Email:** {app['applicant_email']}")
                        st.write(f"**Phone:** {app['applicant_phone']}")
                        st.write(f"**Amount Requested:** KES {app['requested_loan_amount']:,.0f}")
                        st.write(f"**Monthly Income:** KES {app['monthly_income']:,.0f}")
                    
                    with col2:
                        st.write(f"**Credit Score:** {app['credit_score']}")
                        st.write(f"**Decision:** {app['decision']}")
                        if app['approved_amount']:
                            st.write(f"**Approved Amount:** KES {app['approved_amount']:,.0f}")
                        st.write(f"**Status:** {app['status']}")
                        st.write(f"**Applied:** {app['created_at']}")
                    
                    # Admin actions
                    st.markdown("**Admin Actions:**")
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        if st.button("✅ Approve", key=f"approve_{app['id']}"):
                            update_loan_application(app['id'], {'status': 'approved', 'reviewed_by': st.session_state.username})
                            st.success("Application approved!")
                            st.rerun()
                    
                    with col2:
                        if st.button("❌ Reject", key=f"reject_{app['id']}"):
                            update_loan_application(app['id'], {'status': 'rejected', 'reviewed_by': st.session_state.username})
                            st.success("Application rejected!")
                            st.rerun()
                    
                    with col3:
                        if st.button("📝 Edit", key=f"edit_{app['id']}"):
                            st.session_state[f"edit_app_{app['id']}"] = True
                    
                    # Notes section
                    notes = st.text_area("Officer Notes:", value=app.get('notes', ''), key=f"notes_{app['id']}")
                    if st.button("💾 Save Notes", key=f"save_notes_{app['id']}"):
                        update_loan_application(app['id'], {'notes': notes})
                        st.success("Notes saved!")
                        st.rerun()
        else:
            st.info("No loan applications found.")
    
    with tab2:
        st.subheader("User Management")
        
        # Add new user section
        with st.expander("➕ Add New User"):
            with st.form("add_user_form"):
                col1, col2 = st.columns(2)
                
                with col1:
                    new_username = st.text_input("Username")
                    new_password = st.text_input("Password", type="password")
                    role = st.selectbox("Role", ["admin", "officer", "member"])
                
                with col2:
                    full_name = st.text_input("Full Name")
                    email = st.text_input("Email")
                    phone = st.text_input("Phone")
                
                add_submitted = st.form_submit_button("Add User", type="primary")
                
                if add_submitted:
                    if new_username and new_password:
                        success, message = add_user(new_username, new_password, role, full_name, email, phone)
                        if success:
                            st.success(f"✅ {message}")
                            st.rerun()
                        else:
                            st.error(f"❌ {message}")
                    else:
                        st.warning("Username and password are required")
        
        # Display existing users
        st.markdown("### Current Users")
        
        if users:
            for i, user_data in enumerate(users):
                username = user_data['username']
                user_role = user_data['role']
                full_name = user_data.get('full_name', '')
                
                with st.expander(f"{full_name or username} ({user_role})"):
                    col1, col2, col3 = st.columns([2, 1, 1])
                    
                    with col1:
                        st.write(f"**Username:** {username}")
                        st.write(f"**Role:** {user_role}")
                        st.write(f"**Email:** {user_data.get('email', 'N/A')}")
                        st.write(f"**Phone:** {user_data.get('phone', 'N/A')}")
                    
                    with col2:
                        st.write(f"**Created:** {user_data.get('created_at', 'N/A')}")
                        st.write(f"**Last Login:** {user_data.get('last_login', 'Never')}")
                    
                    with col3:
                        if username != DEFAULT_ADMIN_USERNAME:
                            if st.button("🗑️ Delete", key=f"delete_{username}_{i}"):
                                success, message = delete_user(username)
                                if success:
                                    st.success(f"✅ {message}")
                                    st.rerun()
                                else:
                                    st.error(f"❌ {message}")
        else:
            st.info("No users found")
    
    with tab3:
        st.subheader("Create New Loan Application")
        st.info("As an admin, you can create loan applications on behalf of members.")
        show_loan_application_form()
    
    with tab4:
        st.subheader("📈 System Reports")
        
        if applications:
            # Summary statistics
            total_requested = sum(app['requested_loan_amount'] for app in applications)
            total_approved = sum(app['approved_amount'] or 0 for app in applications if app['decision'] == 'Approved')
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric("Total Requested", f"KES {total_requested:,.0f}")
            
            with col2:
                st.metric("Total Approved", f"KES {total_approved:,.0f}")
            
            with col3:
                approval_rate = len([app for app in applications if app['decision'] == 'Approved']) / len(applications) * 100
                st.metric("Approval Rate", f"{approval_rate:.1f}%")
            
            # Decision distribution
            st.markdown("### Decision Distribution")
            decisions = {}
            for app in applications:
                decision = app['decision']
                decisions[decision] = decisions.get(decision, 0) + 1
            
            st.bar_chart(decisions)
            
            # Export options
            st.markdown("### Export Options")
            col1, col2 = st.columns(2)
            
            with col1:
                if st.button("📥 Export All Applications"):
                    download_link = create_download_link(applications, "all_applications.xlsx", "Download All Applications")
                    st.markdown(download_link, unsafe_allow_html=True)
            
            with col2:
                if st.button("📥 Export User List"):
                    download_link = create_download_link(users, "user_list.xlsx", "Download User List")
                    st.markdown(download_link, unsafe_allow_html=True)

def officer_dashboard():
    """Enhanced officer dashboard"""
    st.title("👤 Loan Officer Dashboard")
    st.markdown(f"Welcome, **{st.session_state.full_name}**! Manage your loan applications here.")
    
    # Get applications created by this officer
    my_applications = get_loan_applications(created_by=st.session_state.username)
    all_applications = get_loan_applications()  # Officers can view all but only edit their own
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("My Applications", len(my_applications))
    
    with col2:
        my_pending = len([app for app in my_applications if app['status'] == 'pending'])
        st.metric("My Pending", my_pending)
    
    with col3:
        total_applications = len(all_applications)
        st.metric("Total System Applications", total_applications)
    
    st.markdown("---")
    
    # Navigation tabs
    tab1, tab2, tab3 = st.tabs(["📊 My Applications", "👁️ All Applications", "💼 New Application"])
    
    with tab1:
        st.subheader("Applications I Created")
        
        if my_applications:
            # Export option for my applications
            if st.button("📥 Export My Applications"):
                download_link = create_download_link(my_applications, f"my_applications_{st.session_state.username}.xlsx", "Download My Applications")
                st.markdown(download_link, unsafe_allow_html=True)
            
            for app in my_applications:
                with st.expander(f"Application #{app['id']} - {app['applicant_name']} ({app['decision']})"):
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        st.write(f"**Name:** {app['applicant_name']}")
                        st.write(f"**Email:** {app['applicant_email']}")
                        st.write(f"**Phone:** {app['applicant_phone']}")
                        st.write(f"**Amount Requested:** KES {app['requested_loan_amount']:,.0f}")
                    
                    with col2:
                        st.write(f"**Credit Score:** {app['credit_score']}")
                        st.write(f"**Decision:** {app['decision']}")
                        if app['approved_amount']:
                            st.write(f"**Approved Amount:** KES {app['approved_amount']:,.0f}")
                        st.write(f"**Status:** {app['status']}")
                    
                    # Officer can edit their own applications
                    notes = st.text_area("My Notes:", value=app.get('notes', ''), key=f"my_notes_{app['id']}")
                    if st.button("💾 Update Notes", key=f"update_my_notes_{app['id']}"):
                        update_loan_application(app['id'], {'notes': notes})
                        st.success("Notes updated!")
                        st.rerun()
        else:
            st.info("You haven't created any applications yet.")
    
    with tab2:
        st.subheader("All System Applications (View Only)")
        st.info("You can view all applications but can only edit the ones you created.")
        
        if all_applications:
            # Filter options
            col1, col2 = st.columns(2)
            
            with col1:
                status_filter = st.selectbox("Filter by Status", ["All", "pending", "processed"], key="officer_status_filter")
            
            with col2:
                decision_filter = st.selectbox("Filter by Decision", ["All", "Approved", "Review", "Rejected"], key="officer_decision_filter")
            
            # Apply filters
            filtered_apps = all_applications
            if status_filter != "All":
                filtered_apps = [app for app in filtered_apps if app['status'] == status_filter]
            if decision_filter != "All":
                filtered_apps = [app for app in filtered_apps if app['decision'] == decision_filter]
            
            for app in filtered_apps[:20]:  # Show latest 20
                with st.expander(f"Application #{app['id']} - {app['applicant_name']} ({app['decision']}) - Created by: {app['created_by']}"):
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        st.write(f"**Name:** {app['applicant_name']}")
                        st.write(f"**Email:** {app['applicant_email']}")
                        st.write(f"**Phone:** {app['applicant_phone']}")
                        st.write(f"**Amount Requested:** KES {app['requested_loan_amount']:,.0f}")
                    
                    with col2:
                        st.write(f"**Credit Score:** {app['credit_score']}")
                        st.write(f"**Decision:** {app['decision']}")
                        if app['approved_amount']:
                            st.write(f"**Approved Amount:** KES {app['approved_amount']:,.0f}")
                        st.write(f"**Created by:** {app['created_by']}")
                    
                    if app.get('notes'):
                        st.write(f"**Notes:** {app['notes']}")
        else:
            st.info("No applications found in the system.")
    
    with tab3:
        st.subheader("Create New Loan Application")
        st.info("Create a loan application on behalf of a member.")
        show_loan_application_form()

# ------------------ MAIN ------------------
def main():
    # Page configuration
    st.set_page_config(
        page_title="Esubu Sacco - Your Financial Partner",
        page_icon="🏦",
        layout="wide",
        initial_sidebar_state="auto"
    )
    
    # Custom CSS for better styling
    st.markdown("""
    <style>
    .main > div {
        padding-top: 2rem;
    }
    .stButton > button {
        width: 100%;
        border-radius: 20px;
        border: none;
        padding: 0.5rem 1rem;
        font-weight: 600;
        transition: all 0.3s;
    }
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 10px rgba(0,0,0,0.2);
    }
    .metric-card {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-left: 4px solid #2a5298;
    }
    .stExpander {
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        margin-bottom: 1rem;
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Initialize database
    create_user_table()
    create_loan_applications_table()
    
    # Initialize session state
    if "logged_in" not in st.session_state:
        st.session_state.logged_in = False
        st.session_state.username = ""
        st.session_state.role = ""
        st.session_state.full_name = ""
        st.session_state.show_loan_form = False
    
    # Navigation
    if not st.session_state.logged_in:
        # Public section
        if st.session_state.get('show_loan_form', False):
            show_loan_application_form()
            
            # Back to home button
            if st.button("🏠 Back to Home"):
                st.session_state.show_loan_form = False
                st.rerun()
        else:
            # Sidebar for public users
            with st.sidebar:
                st.markdown("## 🏦 Esubu Sacco")
                st.markdown("---")
                
                if st.button("🚀 Apply for Loan", type="primary", use_container_width=True):
                    st.session_state.show_loan_form = True
                    st.rerun()
                
                st.markdown("---")
                
                if st.button("🔐 Staff Login", use_container_width=True):
                    st.session_state.show_login = True
                    st.rerun()
                
                st.markdown("---")
                st.markdown("""
                ### 📞 Contact Us
                **Phone:** +254 700 000 000  
                **Email:** info@esubusacco.co.ke  
                **Address:** Nairobi, Kenya
                
                ### ⏰ Working Hours
                **Mon-Fri:** 8:00 AM - 5:00 PM  
                **Saturday:** 9:00 AM - 1:00 PM  
                **Sunday:** Closed
                """)
            
            # Show appropriate page
            if st.session_state.get('show_login', False):
                login_page()
                
                if st.button("🏠 Back to Home"):
                    st.session_state.show_login = False
                    st.rerun()
            else:
                show_homepage()
    
    else:
        # Authenticated section
        with st.sidebar:
            st.success(f"✅ Welcome, **{st.session_state.full_name}**")
            st.info(f"Role: **{st.session_state.role.title()}**")
            st.markdown("---")
            
            if st.button("🚪 Logout", type="primary", use_container_width=True):
                logout()
            
            st.markdown("---")
            st.markdown(f"### Quick Stats")
            apps_count = len(get_loan_applications())
            st.metric("Total Applications", apps_count)
            
            if st.session_state.role in ['admin', 'officer']:
                my_apps_count = len(get_loan_applications(created_by=st.session_state.username))
                st.metric("My Applications", my_apps_count)
        
        # Main dashboard based on role
        if st.session_state.role == "admin":
            admin_dashboard()
        elif st.session_state.role == "officer":
            officer_dashboard()
        else:  # member role
            st.title("👤 Member Dashboard")
            st.info("Member dashboard functionality coming soon!")

if __name__ == "__main__":
    main()
