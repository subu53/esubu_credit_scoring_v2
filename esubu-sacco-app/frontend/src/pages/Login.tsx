import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (error: any) {
      setError(
        error.response?.data?.detail || 
        'Login failed. Please check your credentials.'
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
            </ul>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        background: 'var(--gray-100)',
        paddingTop: '80px'
      }}>
        <div className="container">
          <div style={{ 
            maxWidth: '400px', 
            margin: '0 auto',
            background: 'var(--white)',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2>Staff Login</h2>
              <p>Access the Esubu SACCO management system</p>
              <div className="sasra-badge">Licensed by SASRA</div>
            </div>

            {error && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
                style={{ marginTop: '20px' }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <p>
                <Link to="/" style={{ color: 'var(--primary-green)' }}>
                  ← Back to Public Site
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: 'var(--gray-100)',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              <h4 style={{ marginBottom: '15px', color: 'var(--gray-800)' }}>Demo Credentials</h4>
              <div style={{ marginBottom: '10px' }}>
                <strong>Admin:</strong><br />
                Email: admin@esubusacco.co.ke<br />
                Password: admin123
              </div>
              <div>
                <strong>Officer:</strong><br />
                Email: officer@esubusacco.co.ke<br />
                Password: officer123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
