import axios from 'axios';

// Backend API base URL
const API_BASE_URL = 'https://esubu-credit-scoring-v2-1-edit-12.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Services
export const apiService = {
  // Loan Application APIs
  submitLoanApplication: async (applicationData) => {
    try {
      const response = await api.post('/api/loan-application', applicationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit loan application');
    }
  },

  getLoanApplications: async () => {
    try {
      const response = await api.get('/api/loan-applications');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch loan applications');
    }
  },

  getLoanApplicationById: async (id) => {
    try {
      const response = await api.get(`/api/loan-application/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch loan application');
    }
  },

  // Credit Scoring API
  calculateCreditScore: async (applicationData) => {
    try {
      const response = await api.post('/api/credit-score', applicationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to calculate credit score');
    }
  },

  // Loan Calculator API
  calculateLoan: async (principal, rate, term) => {
    try {
      const response = await api.post('/api/loan-calculator', {
        principal: parseFloat(principal),
        interest_rate: parseFloat(rate),
        term_months: parseInt(term)
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to calculate loan');
    }
  },

  // Authentication APIs
  login: async (credentials) => {
    try {
      const response = await api.post('/api/login', credentials);
      if (response.data.access_token) {
        localStorage.setItem('authToken', response.data.access_token);
        localStorage.setItem('userType', response.data.user_type);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    window.location.href = '/';
  },

  // Contact Form API
  submitContactForm: async (contactData) => {
    try {
      const response = await api.post('/api/contact', contactData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit contact form');
    }
  },

  // Member Registration API
  registerMember: async (memberData) => {
    try {
      const response = await api.post('/api/register', memberData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to register member');
    }
  },

  // Dashboard APIs (for officers/admin)
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/dashboard/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  },

  // Application Management (for officers)
  updateApplicationStatus: async (applicationId, status, remarks) => {
    try {
      const response = await api.put(`/api/loan-application/${applicationId}/status`, {
        status,
        remarks
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update application status');
    }
  },

  addApplicationRemark: async (applicationId, remark) => {
    try {
      const response = await api.post(`/api/loan-application/${applicationId}/remarks`, {
        remark
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add remark');
    }
  }
};

export default api;
