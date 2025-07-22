import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loanAPI } from '../services/api';
import { LoanApplicationWithRemarks } from '../types';

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  
  
  const [application, setApplication] = useState<LoanApplicationWithRemarks | null>(null);
  const [loading, setLoading] = useState(true);
  const [remarkText, setRemarkText] = useState('');
  const [submittingRemark, setSubmittingRemark] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await loanAPI.getApplication(parseInt(id!));
      setApplication(response.data);
    } catch (error) {
      console.error('Error fetching application:', error);
      setError('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkText.trim()) return;

    setSubmittingRemark(true);
    try {
      await loanAPI.addRemark(parseInt(id!), remarkText);
      setRemarkText('');
      await fetchApplication(); // Refresh to show new remark
    } catch (error) {
      console.error('Error adding remark:', error);
      setError('Failed to add remark');
    } finally {
      setSubmittingRemark(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await loanAPI.updateApplication(parseInt(id!), { status });
      await fetchApplication(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'badge-warning',
      under_review: 'badge-info',
      approved: 'badge-success',
      rejected: 'badge-danger',
    };
    return badges[status as keyof typeof badges] || 'badge-info';
  };

  const getDecisionBadge = (decision?: string) => {
    if (!decision) return 'badge-info';
    const badges = {
      approved: 'badge-success',
      rejected: 'badge-danger',
      pending: 'badge-warning',
    };
    return badges[decision as keyof typeof badges] || 'badge-info';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <h2>Error</h2>
          <p>{error || 'Application not found'}</p>
          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Link to="/" className="logo">Esubu SACCO</Link>
              <span style={{ marginLeft: '20px', color: 'var(--gray-600)' }}>
                Application Details
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Link to="/dashboard" className="btn btn-outline">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="container">
          {/* Application Header */}
          <div className="card">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h2>Application #{application.application_number}</h2>
                <p style={{ marginBottom: '10px' }}>
                  Submitted on {new Date(application.created_at).toLocaleDateString('en-KE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: '10px' }}>
                  <span className={`badge ${getStatusBadge(application.status)}`}>
                    {application.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className={`badge ${getDecisionBadge(application.system_decision)}`}>
                    {application.system_decision || 'Pending Decision'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Update Buttons */}
            <div className="d-flex gap-1" style={{ marginTop: '20px' }}>
              <button
                onClick={() => updateStatus('under_review')}
                className="btn btn-outline"
                disabled={application.status === 'under_review'}
              >
                Mark Under Review
              </button>
              <button
                onClick={() => updateStatus('approved')}
                className="btn btn-primary"
                disabled={application.status === 'approved'}
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus('rejected')}
                className="btn btn-secondary"
                disabled={application.status === 'rejected'}
              >
                Reject
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            {/* Application Details */}
            <div>
              {/* Personal Information */}
              <div className="card">
                <h3>Personal Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>Full Name:</strong><br />
                    {application.full_name}
                  </div>
                  <div>
                    <strong>ID Number:</strong><br />
                    {application.id_number}
                  </div>
                  <div>
                    <strong>Phone:</strong><br />
                    {application.phone_number}
                  </div>
                  <div>
                    <strong>Email:</strong><br />
                    {application.email}
                  </div>
                  <div>
                    <strong>Date of Birth:</strong><br />
                    {application.date_of_birth}
                  </div>
                  <div>
                    <strong>Gender:</strong><br />
                    {application.gender}
                  </div>
                  <div>
                    <strong>Marital Status:</strong><br />
                    {application.marital_status}
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="card">
                <h3>Employment Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>Employment Status:</strong><br />
                    {application.employment_status}
                  </div>
                  <div>
                    <strong>Employer:</strong><br />
                    {application.employer_name || 'N/A'}
                  </div>
                  <div>
                    <strong>Job Title:</strong><br />
                    {application.job_title || 'N/A'}
                  </div>
                  <div>
                    <strong>Monthly Income:</strong><br />
                    {formatCurrency(application.monthly_income)}
                  </div>
                  <div>
                    <strong>Employment Duration:</strong><br />
                    {application.employment_duration || 'N/A'}
                  </div>
                  <div>
                    <strong>Monthly Expenses:</strong><br />
                    {formatCurrency(application.monthly_expenses)}
                  </div>
                </div>
              </div>

              {/* Loan Information */}
              <div className="card">
                <h3>Loan Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>Loan Amount:</strong><br />
                    <span style={{ fontSize: '1.2rem', color: 'var(--primary-green)' }}>
                      {formatCurrency(application.loan_amount)}
                    </span>
                  </div>
                  <div>
                    <strong>Loan Purpose:</strong><br />
                    {application.loan_purpose}
                  </div>
                  <div>
                    <strong>Loan Term:</strong><br />
                    {application.loan_term_months} months
                  </div>
                  <div>
                    <strong>Credit Score:</strong><br />
                    <span style={{ 
                      fontSize: '1.2rem',
                      color: application.credit_score && application.credit_score >= 700 ? 'var(--light-green)' : 
                             application.credit_score && application.credit_score >= 600 ? 'orange' : 'var(--primary-red)'
                    }}>
                      {application.credit_score || 'N/A'}
                    </span>
                  </div>
                </div>
                
                {application.decision_reason && (
                  <div style={{ marginTop: '15px', padding: '15px', background: 'var(--gray-100)', borderRadius: '8px' }}>
                    <strong>Decision Reason:</strong><br />
                    {application.decision_reason}
                  </div>
                )}
              </div>

              {/* Address Information */}
              <div className="card">
                <h3>Address Information</h3>
                <div>
                  <strong>Residential Address:</strong><br />
                  {application.residential_address}
                </div>
                <div style={{ marginTop: '15px' }}>
                  <strong>County:</strong><br />
                  {application.county}
                </div>
              </div>

              {/* Credit Information */}
              <div className="card">
                <h3>Credit Information</h3>
                <div>
                  <strong>Has Existing Loans:</strong><br />
                  {application.has_existing_loans ? 'Yes' : 'No'}
                </div>
                {application.has_existing_loans && application.existing_loan_details && (
                  <div style={{ marginTop: '15px' }}>
                    <strong>Existing Loan Details:</strong><br />
                    {application.existing_loan_details}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Remarks */}
            <div>
              <div className="card">
                <h3>Internal Remarks</h3>
                
                {/* Add Remark Form */}
                <form onSubmit={handleAddRemark} style={{ marginBottom: '20px' }}>
                  <div className="form-group">
                    <label>Add Remark</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={remarkText}
                      onChange={(e) => setRemarkText(e.target.value)}
                      placeholder="Enter your remark..."
                      disabled={submittingRemark}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={submittingRemark || !remarkText.trim()}
                  >
                    {submittingRemark ? 'Adding...' : 'Add Remark'}
                  </button>
                </form>

                {/* Existing Remarks */}
                <div>
                  {application.remarks && application.remarks.length > 0 ? (
                    application.remarks
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((remark) => (
                        <div
                          key={remark.id}
                          style={{
                            background: 'var(--gray-100)',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '10px',
                            fontSize: '0.9rem'
                          }}
                        >
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Officer #{remark.user_id}</strong>
                            <span style={{ float: 'right', color: 'var(--gray-600)' }}>
                              {new Date(remark.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div>{remark.remark}</div>
                        </div>
                      ))
                  ) : (
                    <p style={{ color: 'var(--gray-600)', fontStyle: 'italic' }}>
                      No remarks yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="card">
                <h3>Financial Summary</h3>
                <div style={{ fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Monthly Income:</span>
                    <strong>{formatCurrency(application.monthly_income)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Monthly Expenses:</span>
                    <strong>{formatCurrency(application.monthly_expenses)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Net Income:</span>
                    <strong style={{ color: 'var(--primary-green)' }}>
                      {formatCurrency(application.monthly_income - application.monthly_expenses)}
                    </strong>
                  </div>
                  <hr />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Loan Amount:</span>
                    <strong>{formatCurrency(application.loan_amount)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Loan Term:</span>
                    <strong>{application.loan_term_months} months</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Est. Monthly Payment:</span>
                    <strong>
                      {formatCurrency(application.loan_amount / application.loan_term_months * 1.12)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
