import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('member');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const loginData = {
        ...formData,
        user_type: loginType
      };
      
      const result = await apiService.login(loginData);
      
      // Redirect based on user type
      if (loginType === 'officer' || loginType === 'admin') {
        window.location.href = `${process.env.REACT_APP_BACKEND_URL || 'https://esubu-credit-scoring-v2-1-edit-12.onrender.com'}/dashboard`;
      } else {
        navigate('/');
      }
      
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-card">
              <div className="login-header text-center">
                <h2>Welcome Back</h2>
                <p>Sign in to your account</p>
              </div>

              <div className="login-type-selector">
                <button
                  type="button"
                  className={`type-btn ${loginType === 'member' ? 'active' : ''}`}
                  onClick={() => setLoginType('member')}
                >
                  Member Login
                </button>
                <button
                  type="button"
                  className={`type-btn ${loginType === 'officer' ? 'active' : ''}`}
                  onClick={() => setLoginType('officer')}
                >
                  Officer Login
                </button>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                {errorMessage && (
                  <div className="alert alert-danger">
                    {errorMessage}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-options">
                  <div className="remember-me">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary login-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              {loginType === 'member' && (
                <div className="signup-link text-center">
                  <p>Don't have an account? <a href="/loan-application">Apply for Membership</a></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
