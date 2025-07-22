export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'officer';
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface LoanApplication {
  id: number;
  // Applicant Information
  full_name: string;
  id_number: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  
  // Employment Information
  employment_status: string;
  employer_name?: string;
  job_title?: string;
  monthly_income: number;
  employment_duration?: string;
  
  // Loan Information
  loan_amount: number;
  loan_purpose: string;
  loan_term_months: number;
  
  // Address Information
  residential_address: string;
  county: string;
  
  // Credit Information
  has_existing_loans: boolean;
  existing_loan_details?: string;
  monthly_expenses: number;
  
  // System Generated
  application_number: string;
  credit_score?: number;
  system_decision?: 'approved' | 'rejected' | 'pending';
  decision_reason?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
  created_by?: number;
}

export interface ApplicationRemark {
  id: number;
  application_id: number;
  user_id: number;
  remark: string;
  created_at: string;
}

export interface LoanApplicationWithRemarks extends LoanApplication {
  remarks: ApplicationRemark[];
}

export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  under_review: number;
}

export interface DashboardData {
  stats: ApplicationStats;
  recent_applications: LoanApplication[];
  user_info: {
    name: string;
    role: string;
    email: string;
  };
}

export interface AdminDashboardData extends DashboardData {
  user_stats: {
    total_officers: number;
    total_admins: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}

export interface LoanApplicationForm {
  // Applicant Information
  full_name: string;
  id_number: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  
  // Employment Information
  employment_status: string;
  employer_name: string;
  job_title: string;
  monthly_income: number;
  employment_duration: string;
  
  // Loan Information
  loan_amount: number;
  loan_purpose: string;
  loan_term_months: number;
  
  // Address Information
  residential_address: string;
  county: string;
  
  // Credit Information
  has_existing_loans: boolean;
  existing_loan_details: string;
  monthly_expenses: number;
}

export interface UserForm {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'officer';
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}
