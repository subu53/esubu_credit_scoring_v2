import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserFriends, 
  FaChartLine, 
  FaShieldAlt, 
  FaHandshake,
  FaMoneyBillWave,
  FaPiggyBank,
  FaMobile,
  FaAward,
  FaUsers,
  FaMapMarkerAlt
} from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Empowering Dreams. One Loan at a Time.</h1>
              <p className="hero-subtitle">
                Join over 8,000 members who trust Esubu SACCO for transparent, 
                member-owned financial services. Licensed by SASRA since 2015.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <FaUsers className="stat-icon" />
                  <div>
                    <h3>8,000+</h3>
                    <p>Active Members</p>
                  </div>
                </div>
                <div className="stat">
                  <FaAward className="stat-icon" />
                  <div>
                    <h3>9 Years</h3>
                    <p>Of Service</p>
                  </div>
                </div>
                <div className="stat">
                  <FaMapMarkerAlt className="stat-icon" />
                  <div>
                    <h3>All Kenya</h3>
                    <p>Coverage</p>
                  </div>
                </div>
              </div>
              <div className="hero-actions">
                <Link to="/apply-loan" className="btn btn-primary btn-large">
                  Apply for Loan
                </Link>
                <Link to="/about" className="btn btn-outline btn-large">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-card">
                <div className="card-header">
                  <FaShieldAlt className="card-icon" />
                  <div>
                    <h4>SASRA Licensed</h4>
                    <p>Fully Regulated SACCO</p>
                  </div>
                </div>
                <div className="card-body">
                  <div className="trust-indicators">
                    <div className="indicator">
                      <span className="indicator-label">Security</span>
                      <div className="indicator-bar">
                        <div className="indicator-fill" style={{width: '100%'}}></div>
                      </div>
                    </div>
                    <div className="indicator">
                      <span className="indicator-label">Trust</span>
                      <div className="indicator-bar">
                        <div className="indicator-fill" style={{width: '98%'}}></div>
                      </div>
                    </div>
                    <div className="indicator">
                      <span className="indicator-label">Growth</span>
                      <div className="indicator-bar">
                        <div className="indicator-fill" style={{width: '95%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2>Our Financial Services</h2>
            <p>Comprehensive financial solutions designed for your success</p>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="service-card card">
                <div className="service-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="card-body">
                  <h3>Personal & Business Loans</h3>
                  <p>Quick approval, competitive rates, and flexible repayment terms for all your financial needs.</p>
                  <ul className="service-features">
                    <li>✓ Up to KES 5M loan limit</li>
                    <li>✓ Low interest rates from 12% p.a.</li>
                    <li>✓ 24-hour approval process</li>
                    <li>✓ No hidden charges</li>
                  </ul>
                  <Link to="/apply-loan" className="btn btn-primary">Apply Now</Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="service-card card">
                <div className="service-icon">
                  <FaPiggyBank />
                </div>
                <div className="card-body">
                  <h3>Savings & Deposits</h3>
                  <p>Secure your future with our high-yield savings accounts and fixed deposit options.</p>
                  <ul className="service-features">
                    <li>✓ Competitive interest rates</li>
                    <li>✓ No minimum balance fees</li>
                    <li>✓ Online account management</li>
                    <li>✓ Automatic savings plans</li>
                  </ul>
                  <Link to="/services" className="btn btn-outline">Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="about-preview py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="about-content">
                <h2>Our Story</h2>
                <p className="lead">
                  From humble beginnings in Bungoma County to serving thousands across Kenya.
                </p>
                <p>
                  Founded in 2015 by three childhood friends, Esubu SACCO began as a community 
                  table-banking group in a small rural market. We witnessed firsthand how limited 
                  access to credit held back farmers, boda boda riders, mama mbogas, and teachers.
                </p>
                <p>
                  Today, we're a fully licensed deposit-taking SACCO under SASRA, serving over 
                  8,000 members with the same community spirit that started it all.
                </p>
                <div className="mission-vision">
                  <div className="mission">
                    <h4>Our Mission</h4>
                    <p>Create safe, transparent, and member-owned financial services that empower communities.</p>
                  </div>
                  <div className="vision">
                    <h4>Our Vision</h4>
                    <p>To be Kenya's most trusted community-focused SACCO, known by name and deed.</p>
                  </div>
                </div>
                <Link to="/about" className="btn btn-primary">Read Full Story</Link>
              </div>
            </div>
            <div className="col-md-6">
              <div className="values-grid">
                <div className="value-item">
                  <FaUserFriends className="value-icon" />
                  <h4>Community First</h4>
                  <p>We know our members by name and design services for real Kenyan lives.</p>
                </div>
                <div className="value-item">
                  <FaChartLine className="value-icon" />
                  <h4>Transparent Growth</h4>
                  <p>Clear terms, no hidden fees, and shared prosperity for all members.</p>
                </div>
                <div className="value-item">
                  <FaShieldAlt className="value-icon" />
                  <h4>SASRA Licensed</h4>
                  <p>Fully regulated and compliant with all Kenyan financial regulations.</p>
                </div>
                <div className="value-item">
                  <FaHandshake className="value-icon" />
                  <h4>Member Owned</h4>
                  <p>Every member has a voice in how we operate and grow together.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta py-5">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Ready to Join Our Community?</h2>
            <p className="lead">
              Take the first step towards financial freedom. Apply for a loan or open 
              a savings account today.
            </p>
            <div className="cta-actions">
              <Link to="/apply-loan" className="btn btn-primary btn-large">
                Apply for Loan
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-large">
                Visit Our Office
              </Link>
            </div>
            <div className="trust-badges">
              <div className="badge">
                <FaShieldAlt />
                <span>SASRA Licensed</span>
              </div>
              <div className="badge">
                <FaMobile />
                <span>Mobile Banking</span>
              </div>
              <div className="badge">
                <FaAward />
                <span>9+ Years Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
