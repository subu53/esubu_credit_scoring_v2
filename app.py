import streamlit as st
import pandas as pd
import numpy as np
import joblib
import cloudpickle
import pickle
from sklearn.preprocessing import LabelEncoder
import os
from pathlib import Path

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
            role TEXT NOT NULL CHECK (role IN ('admin', 'officer')),
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
                "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                (DEFAULT_ADMIN_USERNAME, hashed_password, 'admin')
            )
            logger.info(f"Default admin user '{DEFAULT_ADMIN_USERNAME}' created")
            
    except Exception as e:
        logger.error(f"Error creating user table: {e}")
        st.error("Database initialization failed. Please check logs.")

def add_user(username, password, role):
    """Add user with hashed password"""
    try:
        # Validate input
        if not username or not password or not role:
            return False, "All fields are required"
        
        if role not in ['admin', 'officer']:
            return False, "Invalid role"
        
        # Hash password
        hashed_password = SecurityUtils.hash_password(password)
        
        # Insert user
        DatabaseUtils.execute_query(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            (username, hashed_password, role)
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
            "SELECT password, role FROM users WHERE username = ?",
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
            return user['role']
        
        log_user_action(username, 'LOGIN_FAILED', "Invalid credentials")
        return None
        
    except Exception as e:
        logger.error(f"Login error for user {username}: {e}")
        return None

def get_all_users():
    """Get all users with enhanced error handling"""
    try:
        users = DatabaseUtils.execute_query(
            "SELECT username, role, created_at, last_login FROM users ORDER BY username",
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

    # Load and apply preprocessing pipeline
    try:
        pipeline = joblib.load("preprocessing_pipeline.pkl")
        input_transformed = pipeline.transform(input_df)
    except Exception as e:
        st.error(f"Error loading or applying preprocessing pipeline: {e}")
        return None

    # Predict probability
    try:
        prob = model.predict_proba(input_transformed)[0][1]
    except Exception as e:
        st.error(f"Prediction error: {e}")
        return None

    # Use original (non-transformed) values for logic decisions
    income = input_df['monthly_income'].values[0]
    repayment_history = input_df['repayment_history'].values[0]
    has_collateral = input_df['has_collateral'].values[0]
    missing_docs = input_df['missing_documents'].values[0]

    # Business logic
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

# ------------------ UI FUNCTIONS ------------------
def login_page():
    st.title("🏦 Credit Scoring System Login")
    st.markdown("---")
    
    with st.form("login_form"):
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        login_submitted = st.form_submit_button("Login")
        
        if login_submitted:
            if username and password:
                role = login_user(username, password)
                if role:
                    st.session_state.logged_in = True
                    st.session_state.username = username
                    st.session_state.role = role
                    st.success(f"Welcome {username}!")
                    st.rerun()
                else:
                    st.error("Invalid username or password")
            else:
                st.warning("Please enter both username and password")

def logout():
    st.session_state.logged_in = False
    st.session_state.username = ""
    st.session_state.role = ""
    st.rerun()

def loan_application():
    st.title("💰 Loan Application")
    st.write("Please fill in the following details for your loan application:")

    with st.form("loan_application_form"):
        col1, col2 = st.columns(2)

        with col1:
            age = st.number_input("Age (Years)", min_value=18, max_value=100, value=30)
            years_in_job = st.number_input("Years in Current Job", min_value=0.0, max_value=50.0, value=3.0)
            mm_account_age = st.number_input("Mobile Money Account Age (Months)", min_value=0, max_value=240, value=24)
            savings_income_ratio = st.number_input("Savings to Income Ratio", min_value=0.0, max_value=1.0, value=0.2)
            sacco_membership_years = st.number_input("Sacco Membership (Years)", min_value=0, max_value=50, value=5)
            past_loan_default = st.selectbox("Past Loan Default?", ['Yes', 'No'])
            loan_amount_requested = st.number_input("Requested Loan Amount (KES)", min_value=1000, value=50000)
            informal_employment = st.selectbox("Informal Employment?", ['Yes', 'No'])

        with col2:
            years_with_bank = st.number_input("Years With Bank Account", min_value=0, max_value=100, value=6)
            debt_income_ratio = st.number_input("Debt-to-Income Ratio", min_value=0.0, max_value=1.0, value=0.3)
            income = st.number_input("Monthly Income (KES)", min_value=0, value=50000)
            disposable_income = st.number_input("Disposable Income (KES)", min_value=0, value=20000)
            mm_score = st.slider("Mobile Money Score", 0, 100, 70)
            monthly_savings = st.number_input("Monthly Savings (KES)", min_value=0, value=5000)
            sacco_shares = st.number_input("Sacco Shares Value (KES)", min_value=0, value=15000)
            current_debt = st.number_input("Current Debt (KES)", min_value=0, value=10000)
            active_loans = st.number_input("Number of Active Loans", min_value=0, max_value=50, value=1)
            mm_transactions = st.number_input("Mobile Money Transactions (Monthly)", min_value=0, value=20)
            mm_volume = st.number_input("Mobile Money Volume (KES/month)", min_value=0, value=30000)
            credit_history = st.number_input("Credit History Length (Years)", min_value=0, max_value=100, value=5)
            loan_income_ratio = st.number_input("Loan-to-Income Ratio", min_value=0.0, max_value=5.0, value=1.0)
            debt_service_ratio = st.number_input("Debt Service Ratio", min_value=0.0, max_value=1.0, value=0.35)
            sacco_contrib = st.number_input("Monthly Sacco Contribution (KES)", min_value=0, value=2000)
            household_size = st.number_input("Household Size", min_value=1, max_value=20, value=4)
            asset_score = st.slider("Asset Ownership Score", 0, 100, 60)
            dependents = st.number_input("Number of Dependents", min_value=0, max_value=10, value=2)
            prev_sacco_loans = st.selectbox("Previous Sacco Loans?", ['Yes', 'No'])
            region_type = st.selectbox("Region Type", ['Urban', 'Rural', 'Semi-Urban'])
            prev_loans_count = st.number_input("Number of Previous Loans", min_value=0, max_value=50, value=1)

        submitted = st.form_submit_button("Submit Application")

        if submitted:
            model = load_model()
            if model is None:
                st.error("Unable to process application. Model not available.")
                return

            # Construct input DataFrame
            input_data = pd.DataFrame([{
                'Age': age,
                'Years_In_Current_Job': years_in_job,
                'Mobile_Money_Account_Age_Months': mm_account_age,
                'Savings_to_Income_Ratio': savings_income_ratio,
                'Sacco_Membership_Years': sacco_membership_years,
                'Past_Loan_Default': past_loan_default,
                'Requested_Loan_Amount_KES': loan_amount_requested,
                'Employment_Status_Informal': informal_employment,
                'Years_With_Bank_Account': years_with_bank,
                'Debt_to_Income_Ratio': debt_income_ratio,
                'Monthly_Income_KES': income,
                'Disposable_Income_KES': disposable_income,
                'Mobile_Money_Score': mm_score,
                'Monthly_Savings_KES': monthly_savings,
                'Sacco_Shares_Value_KES': sacco_shares,
                'Current_Debt_KES': current_debt,
                'Active_Loan_Count': active_loans,
                'Monthly_Mobile_Money_Transactions': mm_transactions,
                'Monthly_Mobile_Money_Volume_KES': mm_volume,
                'Credit_History_Length_Years': credit_history,
                'Loan_to_Income_Ratio': loan_income_ratio,
                'Debt_Service_Ratio': debt_service_ratio,
                'Monthly_Sacco_Contribution_KES': sacco_contrib,
                'Household_Size': household_size,
                'Asset_Ownership_Score': asset_score,
                'Dependents': dependents,
                'Previous_Sacco_Loans': prev_sacco_loans,
                'Region_Type_Semi-Urban': 1 if region_type == 'Semi-Urban' else 0,
                'Previous_Loans_Count': prev_loans_count
            }])

            # Run decision engine
            results = run_decision_engine(model, input_data)

            if results:
                st.markdown("---")
                st.subheader("📋 Decision Result")
                st.markdown(results['message'])
                st.info(f"**Probability of Approval:** {results['probability']*100:.2f}%")

                # Officer/Admin override for 'Review'
                if st.session_state.role in ["officer", "admin"] and results['decision'] == 'Review':
                    st.warning("⚠️ This application requires manual review. You can override the system's decision below.")
                    override = st.selectbox("Override Decision", ['No Action', 'Approve', 'Reject'])
                    if override != 'No Action':
                        if st.button("Confirm Override"):
                            st.success(f"✅ Decision overridden to: {override}")
                            # Optional: Log override action here

def admin_dashboard():
    st.title("👨‍💼 Admin Dashboard")
    
    tab1, tab2 = st.tabs(["👥 User Management", "💼 Loan Application"])
    
    with tab1:
        st.subheader("Add New User")
        
        with st.form("add_user_form"):
            new_username = st.text_input("Username")
            new_password = st.text_input("Password", type="password")
            role = st.selectbox("Role", ["admin", "officer"])
            add_submitted = st.form_submit_button("Add User")
            
            if add_submitted:
                if new_username and new_password:
                    success, message = add_user(new_username, new_password, role)
                    if success:
                        st.success(f"✅ {message}")
                        st.rerun()
                    else:
                        st.error(f"❌ {message}")
                else:
                    st.warning("Please fill in all fields")

        st.markdown("---")
        st.subheader("Current Users")
        users = get_all_users()
        
        if users:
            for i, user_data in enumerate(users):
                username = user_data['username']
                user_role = user_data['role']
                col1, col2, col3 = st.columns([2, 1, 1])
                with col1:
                    st.write(f"**{username}** ({user_role})")
                with col2:
                    st.write("🔒 Admin" if user_role == "admin" else "👤 Officer")
                with col3:
                    if username != DEFAULT_ADMIN_USERNAME:  # Prevent deleting the default admin
                        if st.button("🗑️ Delete", key=f"delete_{username}_{i}"):
                            success, message = delete_user(username)
                            if success:
                                st.success(f"✅ {message}")
                                st.rerun()
                            else:
                                st.error(f"❌ {message}")
                st.markdown("---")
        else:
            st.info("No users found")
    
    with tab2:
        loan_application()

# ------------------ MAIN ------------------
def main():
    # Initialize database
    create_user_table()
    
    # Initialize session state
    if "logged_in" not in st.session_state:
        st.session_state.logged_in = False
        st.session_state.username = ""
        st.session_state.role = ""

    # Main app logic
    if not st.session_state.logged_in:
        login_page()
    else:
        # Sidebar with user info and logout
        with st.sidebar:
            st.success(f"✅ Logged in as **{st.session_state.username}**")
            st.info(f"Role: **{st.session_state.role.title()}**")
            st.markdown("---")
            if st.button("🚪 Logout", type="primary"):
                logout()

        # Main content based on role
        if st.session_state.role == "admin":
            admin_dashboard()
        elif st.session_state.role == "officer":
            loan_application()

if __name__ == "__main__":
    main()
