import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loanAPI, officerAPI } from '../services/api';
import { LoanApplication, ApplicationStats } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, decisionFilter]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, dashboardResponse] = await Promise.all([
        loanAPI.getStats(),
        officerAPI.getDashboard()
      ]);
      
      setStats(statsResponse.data);
      setApplications(dashboardResponse.data.recent_applications);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await loanAPI.getApplications({
        skip: 0,
        limit: 50,
        status: statusFilter || undefined,
        decision: decisionFilter || undefined,
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchApplications();
      return;
    }

    try {
      const response = await loanAPI.searchApplications(searchTerm);
      setApplications(response.data);
    } catch (error) {
      console.error('Error searching applications:', error);
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
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
                Officer Dashboard
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span>Welcome, {user?.full_name}</span>
              {isAdmin && (
                <Link to="/admin" className="btn btn-secondary">
                  Admin Panel
                </Link>
              )}
              <button onClick={logout} className="btn btn-outline">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <div className="container">
          {/* Stats Cards */}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Applications</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.pending}</div>
                <div className="stat-label">Pending Review</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.approved}</div>
                <div className="stat-label">Approved</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.rejected}</div>
                <div className="stat-label">Rejected</div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="card" style={{ marginTop: '30px' }}>
            <h3>Loan Applications</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px',
              marginBottom: '20px' 
            }}>
              <div className="form-group">
                <label>Search Applications</label>
                <div className="d-flex gap-1">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, ID, or app number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button onClick={handleSearch} className="btn btn-primary">
                    Search
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Status Filter</label>
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label>Decision Filter</label>
                <select
                  className="form-control"
                  value={decisionFilter}
                  onChange={(e) => setDecisionFilter(e.target.value)}
                >
                  <option value="">All Decisions</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <Link to="/apply" className="btn btn-primary">
                New Application (Walk-in)
              </Link>
            </div>

            {/* Applications Table */}
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>App #</th>
                    <th>Applicant</th>
                    <th>Amount</th>
                    <th>Purpose</th>
                    <th>Credit Score</th>
                    <th>Status</th>
                    <th>Decision</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>{app.application_number}</td>
                      <td>
                        <div>
                          <strong>{app.full_name}</strong>
                          <br />
                          <small>{app.phone_number}</small>
                        </div>
                      </td>
                      <td>{formatCurrency(app.loan_amount)}</td>
                      <td>{app.loan_purpose}</td>
                      <td>
                        {app.credit_score ? (
                          <span style={{ 
                            color: app.credit_score >= 700 ? 'var(--light-green)' : 
                                   app.credit_score >= 600 ? 'orange' : 'var(--primary-red)'
                          }}>
                            {app.credit_score}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getDecisionBadge(app.system_decision)}`}>
                          {app.system_decision || 'Pending'}
                        </span>
                      </td>
                      <td>{new Date(app.created_at).toLocaleDateString()}</td>
                      <td>
                        <Link
                          to={`/applications/${app.id}`}
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '0.875rem' }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {applications.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>No applications found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
