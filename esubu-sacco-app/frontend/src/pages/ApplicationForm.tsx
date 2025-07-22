import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loanAPI } from '../services/api';
import { LoanApplicationForm } from '../types';

const ApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<LoanApplicationForm>({
    // Applicant Information
    full_name: '',
    id_number: '',
    phone_number: '',
    email: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    
    // Employment Information
    employment_status: '',
    employer_name: '',
    job_title: '',
    monthly_income: 0,
    employment_duration: '',
    
    // Loan Information
    loan_amount: 0,
    loan_purpose: '',
    loan_term_months: 12,
    
    // Address Information
    residential_address: '',
    county: '',
    
    // Credit Information
    has_existing_loans: false,
    existing_loan_details: '',
    monthly_expenses: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await loanAPI.createApplication(formData);
      setSuccess(`Application submitted successfully! Your application number is: ${response.data.application_number}`);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error: any) {
      setError(
        error.response?.data?.detail || 
        'Failed to submit application. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="logo">
              Esubu SACCO
            </Link>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Staff Login</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Application Form */}
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--gray-100)',
        paddingTop: '100px',
        paddingBottom: '50px'
      }}>
        <div className="container">
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            background: 'var(--white)',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1>Loan Application</h1>
              <p>Apply for a loan with Esubu SACCO - Licensed by SASRA</p>
              <div className="sasra-badge">Licensed by SASRA</div>
            </div>

            {error && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                background: '#d4edda',
                color: '#155724',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--primary-green)' }}>Personal Information</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div className="form-group">
                    <label htmlFor="full_name">Full Name *</label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      className="form-control"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="id_number">ID Number *</label>
                    <input
                      type="text"
                      id="id_number"
                      name="id_number"
                      className="form-control"
                      value={formData.id_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone_number">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      className="form-control"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date_of_birth">Date of Birth *</label>
                    <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      className="form-control"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender *</label>
                    <select
                      id="gender"
                      name="gender"
                      className="form-control"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="marital_status">Marital Status *</label>
                    <select
                      id="marital_status"
                      name="marital_status"
                      className="form-control"
                      value={formData.marital_status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--primary-green)' }}>Employment Information</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div className="form-group">
                    <label htmlFor="employment_status">Employment Status *</label>
                    <select
                      id="employment_status"
                      name="employment_status"
                      className="form-control"
                      value={formData.employment_status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Employed">Employed</option>
                      <option value="Self-employed">Self-employed</option>
                      <option value="Student">Student</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="employer_name">Employer Name</label>
                    <input
                      type="text"
                      id="employer_name"
                      name="employer_name"
                      className="form-control"
                      value={formData.employer_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="job_title">Job Title</label>
                    <input
                      type="text"
                      id="job_title"
                      name="job_title"
                      className="form-control"
                      value={formData.job_title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="monthly_income">Monthly Income (KES) *</label>
                    <input
                      type="number"
                      id="monthly_income"
                      name="monthly_income"
                      className="form-control"
                      value={formData.monthly_income}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="employment_duration">Employment Duration</label>
                    <input
                      type="text"
                      id="employment_duration"
                      name="employment_duration"
                      className="form-control"
                      value={formData.employment_duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 2 years"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="monthly_expenses">Monthly Expenses (KES) *</label>
                    <input
                      type="number"
                      id="monthly_expenses"
                      name="monthly_expenses"
                      className="form-control"
                      value={formData.monthly_expenses}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Loan Information */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--primary-green)' }}>Loan Information</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div className="form-group">
                    <label htmlFor="loan_amount">Loan Amount (KES) *</label>
                    <input
                      type="number"
                      id="loan_amount"
                      name="loan_amount"
                      className="form-control"
                      value={formData.loan_amount}
                      onChange={handleInputChange}
                      min="1000"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="loan_term_months">Loan Term (Months) *</label>
                    <select
                      id="loan_term_months"
                      name="loan_term_months"
                      className="form-control"
                      value={formData.loan_term_months}
                      onChange={handleInputChange}
                      required
                    >
                      <option value={6}>6 months</option>
                      <option value={12}>12 months</option>
                      <option value={18}>18 months</option>
                      <option value={24}>24 months</option>
                      <option value={36}>36 months</option>
                      <option value={48}>48 months</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="loan_purpose">Loan Purpose *</label>
                    <select
                      id="loan_purpose"
                      name="loan_purpose"
                      className="form-control"
                      value={formData.loan_purpose}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Purpose</option>
                      <option value="Business">Business</option>
                      <option value="Education">Education</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Asset Purchase">Asset Purchase</option>
                      <option value="Home Improvement">Home Improvement</option>
                      <option value="Medical">Medical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--primary-green)' }}>Address Information</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="residential_address">Residential Address *</label>
                    <textarea
                      id="residential_address"
                      name="residential_address"
                      className="form-control"
                      value={formData.residential_address}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="county">County *</label>
                    <select
                      id="county"
                      name="county"
                      className="form-control"
                      value={formData.county}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select County</option>
                      <option value="Bungoma">Bungoma</option>
                      <option value="Nairobi">Nairobi</option>
                      <option value="Mombasa">Mombasa</option>
                      <option value="Kiambu">Kiambu</option>
                      <option value="Kakamega">Kakamega</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Credit Information */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--primary-green)' }}>Credit Information</h3>
                
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="has_existing_loans"
                      checked={formData.has_existing_loans}
                      onChange={handleInputChange}
                      style={{ marginRight: '10px' }}
                    />
                    I have existing loans
                  </label>
                </div>

                {formData.has_existing_loans && (
                  <div className="form-group">
                    <label htmlFor="existing_loan_details">Existing Loan Details</label>
                    <textarea
                      id="existing_loan_details"
                      name="existing_loan_details"
                      className="form-control"
                      value={formData.existing_loan_details}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Please provide details about your existing loans..."
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ padding: '15px 40px', fontSize: '1.1rem' }}
                >
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <p>
                <Link to="/" style={{ color: 'var(--primary-green)' }}>
                  ← Back to Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
