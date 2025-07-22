import axios, { AxiosResponse } from 'axios';
import {
  User,
  LoanApplication,
  LoanApplicationWithRemarks,
  ApplicationStats,
  DashboardData,
  AdminDashboardData,
  LoginCredentials,
  AuthResponse,
  LoanApplicationForm,
  UserForm,
  ApplicationRemark
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/api/v1/auth/login', credentials),
  
  verifyToken: (): Promise<AxiosResponse<{ valid: boolean; user: string; role: string }>> =>
    api.post('/api/v1/auth/verify-token'),
  
  getProfile: (): Promise<AxiosResponse<User>> =>
    api.get('/api/v1/auth/me'),
};

// Loan Applications API
export const loanAPI = {
  createApplication: (application: LoanApplicationForm): Promise<AxiosResponse<LoanApplication>> =>
    api.post('/api/v1/loans/', application),
  
  getApplications: (params?: {
    skip?: number;
    limit?: number;
    status?: string;
    decision?: string;
  }): Promise<AxiosResponse<LoanApplication[]>> =>
    api.get('/api/v1/loans/', { params }),
  
  getApplication: (id: number): Promise<AxiosResponse<LoanApplicationWithRemarks>> =>
    api.get(`/api/v1/loans/${id}`),
  
  updateApplication: (
    id: number,
    update: { status?: string; system_decision?: string; decision_reason?: string; credit_score?: number }
  ): Promise<AxiosResponse<LoanApplication>> =>
    api.put(`/api/v1/loans/${id}`, update),
  
  addRemark: (id: number, remark: string): Promise<AxiosResponse<ApplicationRemark>> =>
    api.post(`/api/v1/loans/${id}/remarks`, null, { params: { remark_text: remark } }),
  
  getStats: (): Promise<AxiosResponse<ApplicationStats>> =>
    api.get('/api/v1/loans/stats'),
  
  searchApplications: (query: string): Promise<AxiosResponse<LoanApplication[]>> =>
    api.get('/api/v1/loans/search', { params: { q: query } }),
};

// Officer API
export const officerAPI = {
  getDashboard: (): Promise<AxiosResponse<DashboardData>> =>
    api.get('/api/v1/officers/dashboard'),
  
  getProfile: (): Promise<AxiosResponse<User>> =>
    api.get('/api/v1/officers/profile'),
};

// Admin API
export const adminAPI = {
  getDashboard: (): Promise<AxiosResponse<AdminDashboardData>> =>
    api.get('/api/v1/admin/dashboard'),
  
  // User Management
  createUser: (user: UserForm): Promise<AxiosResponse<User>> =>
    api.post('/api/v1/admin/users/', user),
  
  getUsers: (params?: { skip?: number; limit?: number }): Promise<AxiosResponse<User[]>> =>
    api.get('/api/v1/admin/users/', { params }),
  
  getUser: (id: number): Promise<AxiosResponse<User>> =>
    api.get(`/api/v1/admin/users/${id}`),
  
  updateUser: (
    id: number,
    update: Partial<Pick<User, 'email' | 'full_name' | 'role' | 'is_active'>>
  ): Promise<AxiosResponse<User>> =>
    api.put(`/api/v1/admin/users/${id}`, update),
  
  deactivateUser: (id: number): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/api/v1/admin/users/${id}`),
  
  // Application Management
  overrideDecision: (
    id: number,
    decision: string,
    reason: string
  ): Promise<AxiosResponse<LoanApplication>> =>
    api.put(`/api/v1/admin/applications/${id}/override`, null, {
      params: { decision, reason }
    }),
  
  // Reports
  exportApplicationsCSV: (): Promise<AxiosResponse<string>> =>
    api.get('/api/v1/admin/reports/applications/csv', {
      responseType: 'text',
    }),
  
  getSystemLogs: (params?: { skip?: number; limit?: number }): Promise<AxiosResponse<any[]>> =>
    api.get('/api/v1/admin/system/logs', { params }),
};

// Public API (no auth required)
export const publicAPI = {
  healthCheck: (): Promise<AxiosResponse<{ status: string; message: string }>> =>
    axios.get(`${API_BASE_URL}/health`),
};

export default api;
