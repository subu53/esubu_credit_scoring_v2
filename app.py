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

    # List of the 30 features in the order from df.info (Loan_Term_Months removed)
    feature_names = [
        "Age", "Years_In_Current_Job", "Household_Size", "Monthly_Income_KES", "Monthly_Savings_KES", "Credit_History_Length_Years", "Past_Loan_Default", "Active_Loan_Count", "Current_Debt_KES", "Mobile_Money_Account_Age_Months", "Monthly_Mobile_Money_Transactions", "Monthly_Mobile_Money_Volume_KES", "Sacco_Membership_Years", "Monthly_Sacco_Contribution_KES", "Sacco_Shares_Value_KES", "Requested_Loan_Amount_KES", "Asset_Ownership_Score", "Debt_to_Income_Ratio", "Loan_to_Income_Ratio", "Debt_Service_Ratio", "Savings_to_Income_Ratio", "Sacco_Contribution_Rate", "Disposable_Income_KES", "Mobile_Money_Score", "Region_Type_Semi-Urban", "Region_Type_Urban", "Employment_Status_Informal", "Previous_Sacco_Loans", "Years_With_Bank_Account", "Savings_Rate"
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
    st.header("\U0001F4B0 Loan Application")
    st.markdown("Please fill in the following details to apply for a loan:")

    with st.form("loan_application_form"):
        age = st.number_input("Age", min_value=18, max_value=100, value=30)
        employment_status = st.selectbox("Employment Status", [
            "Self-employed", "Informal", "Formal", "Unemployed"
        ])
        monthly_income = st.number_input("Monthly Income (KES)", min_value=0, value=50000)
        monthly_savings = st.number_input("Monthly Savings (KES)", min_value=0, value=5000)
        requested_loan_amount = st.number_input("Requested Loan Amount (KES)", min_value=1000, value=30000)
        years_with_sacco = st.number_input("Years With SACCO", min_value=0, max_value=40, value=3)
        mobile_money_account_age = st.number_input("Mobile Money Account Age (Months)", min_value=0, max_value=240, value=24)
        total_mobile_money_last_month = st.number_input("Total Mobile Money Transacted Last Month (KES)", min_value=0, value=15000)
        credit_history_length = st.number_input("Credit History Length (Years)", min_value=0, max_value=30, value=2)
        past_loan_default = st.radio("Have you defaulted on a loan before?", ["Yes", "No"])
        past_loan_default = 1 if past_loan_default == "Yes" else 0
        active_loans = st.number_input("Number of Active Loans", min_value=0, max_value=10, value=0)
        household_size = st.number_input("Household Size", min_value=1, max_value=20, value=3)
        submitted = st.form_submit_button("Submit Application")

    if submitted:
        # Prepare input data as DataFrame
        input_data = {
            "Age": age,
            "Employment_Status_Informal": 1 if employment_status == "Informal" else 0,
            "Employment_Status_Self-employed": 1 if employment_status == "Self-employed" else 0,
            "Employment_Status_Unemployed": 1 if employment_status == "Unemployed" else 0,
            "Monthly_Income_KES": monthly_income,
            "Monthly_Savings_KES": monthly_savings,
            "Requested_Loan_Amount_KES": requested_loan_amount,
            "Years_With_SACCO": years_with_sacco,
            "Mobile_Money_Account_Age_Months": mobile_money_account_age,
            "Monthly_Mobile_Money_Volume_KES": total_mobile_money_last_month,
            "Credit_History_Length_Years": credit_history_length,
            "Past_Loan_Default": past_loan_default,
            "Active_Loan_Count": active_loans,
            "Household_Size": household_size
        }
        input_df = pd.DataFrame([input_data])
        model = load_model()
        if model is None:
            st.error("Model not available.")
            return
        results = run_decision_engine(model, input_df)
        if results:
            st.markdown("---")
            st.subheader("\U0001F4CB Decision Result")
            st.markdown(results['message'])
            st.info(f"**Probability of Approval:** {results['probability']*100:.2f}%")
        else:
            st.error("Unable to process application.")

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
