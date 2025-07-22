import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI, loanAPI } from '../services/api';
import { User, LoanApplication, AdminDashboardData, UserForm } from '../types';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'applications' | 'reports'>('overview');
  
  // User management state
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserForm>({
    email: '',
    password: '',
    full_name: '',
    role: 'officer',
  });

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
    fetchApplications();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await loanAPI.getApplications({ limit: 100 });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAPI.createUser(userForm);
      setUserForm({ email: '', password: '', full_name: '', role: 'officer' });
      setShowUserForm(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await adminAPI.deactivateUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Error deactivating user:', error);
        alert('Failed to deactivate user');
      }
    }
  };

  const handleOverrideDecision = async (applicationId: number, decision: string) => {
    const reason = prompt(`Please provide a reason for overriding to "${decision}":`);
    if (reason) {
      try {
        await adminAPI.overrideDecision(applicationId, decision, reason);
        fetchApplications();
        alert('Decision overridden successfully');
      } catch (error) {
        console.error('Error overriding decision:', error);
        alert('Failed to override decision');
      }
    }
  };

  const exportToCSV = async () => {
    try {
      const response = await adminAPI.exportApplicationsCSV();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'loan_applications.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV');
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
                Admin Dashboard
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span>Welcome, {user?.full_name}</span>
              <Link to="/dashboard" className="btn btn-outline">
                Officer View
              </Link>
              <button onClick={logout} className="btn btn-outline">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="container">
          {/* Tab Navigation */}
          <div className="card">
            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--gray-300)', paddingBottom: '20px' }}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline'}`}
              >
                Reports
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && dashboardData && (
              <div style={{ paddingTop: '20px' }}>
                <h3>System Overview</h3>
                
                {/* Stats Grid */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-number">{dashboardData.application_stats.total}</div>
                    <div className="stat-label">Total Applications</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{dashboardData.application_stats.approved}</div>
                    <div className="stat-label">Approved</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{dashboardData.application_stats.pending}</div>
                    <div className="stat-label">Pending Review</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{dashboardData.user_stats.total_officers}</div>
                    <div className="stat-label">Active Officers</div>
                  </div>
                </div>

                {/* Recent Applications */}
                <div style={{ marginTop: '30px' }}>
                  <h4>Recent Applications</h4>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>App #</th>
                          <th>Applicant</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recent_applications.slice(0, 5).map((app) => (
                          <tr key={app.id}>
                            <td>{app.application_number}</td>
                            <td>{app.full_name}</td>
                            <td>{formatCurrency(app.loan_amount)}</td>
                            <td>
                              <span className={`badge ${getStatusBadge(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td>{new Date(app.created_at).toLocaleDateString()}</td>
                            <td>
                              <Link to={`/applications/${app.id}`} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div style={{ paddingTop: '20px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3>User Management</h3>
                  <button
                    onClick={() => setShowUserForm(true)}
                    className="btn btn-primary"
                  >
                    Add New User
                  </button>
                </div>

                {/* Add User Form */}
                {showUserForm && (
                  <div className="card" style={{ marginBottom: '20px' }}>
                    <h4>Create New User</h4>
                    <form onSubmit={handleCreateUser}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={userForm.email}
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={userForm.password}
                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={userForm.full_name}
                            onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Role</label>
                          <select
                            className="form-control"
                            value={userForm.role}
                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'admin' | 'officer' })}
                          >
                            <option value="officer">Officer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ marginTop: '15px' }}>
                        <button type="submit" className="btn btn-primary">
                          Create User
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowUserForm(false)}
                          className="btn btn-outline"
                          style={{ marginLeft: '10px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Users Table */}
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Last Login</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userItem) => (
                        <tr key={userItem.id}>
                          <td>{userItem.id}</td>
                          <td>{userItem.full_name}</td>
                          <td>{userItem.email}</td>
                          <td>
                            <span className={`badge ${userItem.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                              {userItem.role}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${userItem.is_active ? 'badge-success' : 'badge-danger'}`}>
                              {userItem.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(userItem.created_at).toLocaleDateString()}</td>
                          <td>
                            {userItem.last_login 
                              ? new Date(userItem.last_login).toLocaleDateString()
                              : 'Never'
                            }
                          </td>
                          <td>
                            {userItem.id !== user?.id && (
                              <button
                                onClick={() => handleDeactivateUser(userItem.id)}
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                disabled={!userItem.is_active}
                              >
                                Deactivate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div style={{ paddingTop: '20px' }}>
                <h3>Application Management</h3>
                
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>App #</th>
                        <th>Applicant</th>
                        <th>Amount</th>
                        <th>Credit Score</th>
                        <th>Status</th>
                        <th>System Decision</th>
                        <th>Date</th>
                        <th>Admin Actions</th>
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
                              <small>{app.email}</small>
                            </div>
                          </td>
                          <td>{formatCurrency(app.loan_amount)}</td>
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
                              {app.status}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${app.system_decision === 'approved' ? 'badge-success' : 
                                                     app.system_decision === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                              {app.system_decision || 'Pending'}
                            </span>
                          </td>
                          <td>{new Date(app.created_at).toLocaleDateString()}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <button
                                onClick={() => handleOverrideDecision(app.id, 'approved')}
                                className="btn btn-primary"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              >
                                Override: Approve
                              </button>
                              <button
                                onClick={() => handleOverrideDecision(app.id, 'rejected')}
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              >
                                Override: Reject
                              </button>
                              <Link
                                to={`/applications/${app.id}`}
                                className="btn btn-outline"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              >
                                View Details
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div style={{ paddingTop: '20px' }}>
                <h3>Reports & Analytics</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div className="card">
                    <h4>Export Data</h4>
                    <p>Download application data for analysis</p>
                    <button onClick={exportToCSV} className="btn btn-primary">
                      Export Applications (CSV)
                    </button>
                  </div>

                  <div className="card">
                    <h4>System Logs</h4>
                    <p>View system activity and user actions</p>
                    <button className="btn btn-outline" disabled>
                      View Logs (Coming Soon)
                    </button>
                  </div>

                  <div className="card">
                    <h4>Performance Metrics</h4>
                    <p>Application processing and approval rates</p>
                    <button className="btn btn-outline" disabled>
                      View Metrics (Coming Soon)
                    </button>
                  </div>
                </div>

                {/* Summary Stats */}
                {dashboardData && (
                  <div style={{ marginTop: '30px' }}>
                    <h4>Summary Statistics</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                      <div style={{ background: 'var(--gray-100)', padding: '20px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Approval Rate</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                          {dashboardData.application_stats.total > 0 
                            ? Math.round((dashboardData.application_stats.approved / dashboardData.application_stats.total) * 100)
                            : 0}%
                        </div>
                      </div>
                      <div style={{ background: 'var(--gray-100)', padding: '20px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Rejection Rate</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-red)' }}>
                          {dashboardData.application_stats.total > 0 
                            ? Math.round((dashboardData.application_stats.rejected / dashboardData.application_stats.total) * 100)
                            : 0}%
                        </div>
                      </div>
                      <div style={{ background: 'var(--gray-100)', padding: '20px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Total Officers</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                          {dashboardData.user_stats.total_officers}
                        </div>
                      </div>
                      <div style={{ background: 'var(--gray-100)', padding: '20px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Total Admins</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-red)' }}>
                          {dashboardData.user_stats.total_admins}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
