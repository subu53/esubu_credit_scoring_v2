import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
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
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><Link to="/login">Staff Login</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <h1>Empowering Dreams. One Loan at a Time.</h1>
          <p>
            Join thousands of Kenyans who trust Esubu SACCO for their financial needs. 
            We provide fair, transparent, and member-owned financial services to help you grow.
          </p>
          <div className="hero-buttons">
            <Link to="/apply" className="btn btn-primary">Apply for a Loan</Link>
            <a href="#about" className="btn btn-outline">Learn More</a>
          </div>
          <div className="sasra-badge">✓ Licensed by SASRA</div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2>About Esubu SACCO</h2>
            <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
              Founded in 2015 by three childhood friends from Bungoma County, we've grown 
              from a small table-banking group to a fully licensed SACCO serving over 8,000 members.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div className="card">
              <h3>Our Story</h3>
              <p>
                Esubu SACCO was founded in 2015 by three childhood friends from Bungoma County. 
                With humble beginnings as a community table-banking group in a small rural market, 
                the founders saw firsthand how limited access to credit was holding back farmers, 
                boda boda riders, mama mbogas, and teachers.
              </p>
            </div>

            <div className="card">
              <h3>Our Mission</h3>
              <p>
                Our mission was simple: create a safe, transparent, and member-owned SACCO 
                that empowers low- and medium-income earners to save consistently and access 
                loans fairly. We design systems that serve real Kenyan lives.
              </p>
            </div>

            <div className="card">
              <h3>Our Growth</h3>
              <p>
                Since then, Esubu SACCO has grown into a fully licensed deposit-taking SACCO 
                under SASRA, now serving over 8,000 members across Kenya, both online and in-person. 
                We still honor our roots — we know our members by name.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h3>Our Vision</h3>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              To be the leading SACCO in Kenya, known for financial inclusion, 
              innovation, and empowering communities to achieve their dreams through 
              accessible and fair financial services.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section" style={{ background: 'var(--gray-100)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2>Our Services</h2>
            <p>Comprehensive financial solutions designed for Kenyan families and businesses</p>
          </div>

          <div className="services-grid">
            <div className="card">
              <h3>💰 Loans</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>✓ Personal Loans</li>
                <li>✓ Business Loans</li>
                <li>✓ Emergency Loans</li>
                <li>✓ School Fees Loans</li>
                <li>✓ Asset Purchase Loans</li>
              </ul>
              <p><strong>Competitive rates starting at 12% per annum</strong></p>
            </div>

            <div className="card">
              <h3>💳 Deposits</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>✓ Savings Accounts</li>
                <li>✓ Fixed Deposits</li>
                <li>✓ Current Accounts</li>
                <li>✓ Junior Savers</li>
                <li>✓ Group Accounts</li>
              </ul>
              <p><strong>Earn up to 8% annual interest</strong></p>
            </div>

            <div className="card">
              <h3>🤝 Member Benefits</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>✓ Dividend Payments</li>
                <li>✓ Insurance Cover</li>
                <li>✓ Financial Advisory</li>
                <li>✓ Mobile Banking</li>
                <li>✓ ATM Services</li>
              </ul>
              <p><strong>Exclusive benefits for members</strong></p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/apply" className="btn btn-primary">Apply Now</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container text-center">
          <h2>Ready to Join Esubu SACCO?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            Take the first step towards financial freedom. Apply for membership and 
            start your journey with us today.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/apply" className="btn btn-primary">Join Us Today</Link>
            <a href="#contact" className="btn btn-secondary">Contact Us</a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section" style={{ background: 'var(--gray-100)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2>Contact Us</h2>
            <p>Get in touch with our friendly team</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div className="card">
              <h3>📧 Email</h3>
              <p>info@esubusacco.co.ke</p>
              <p>support@esubusacco.co.ke</p>
            </div>

            <div className="card">
              <h3>📞 Phone</h3>
              <p>+254-700-123-456</p>
              <p>+254-711-987-654</p>
              <p><em>Monday - Friday: 8:00 AM - 5:00 PM</em></p>
            </div>

            <div className="card">
              <h3>📍 Location</h3>
              <p>Bungoma County, Kenya</p>
              <p>Visit our offices for personalized service</p>
              <p><strong>Licensed by SASRA</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Esubu SACCO</h4>
              <p>Empowering Dreams. One Loan at a Time.</p>
              <p>Licensed by SASRA</p>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#about">About Us</a>
              <a href="#services">Services</a>
              <Link to="/apply">Apply for Loan</Link>
              <Link to="/login">Staff Login</Link>
            </div>

            <div className="footer-section">
              <h4>Services</h4>
              <a href="#services">Loans</a>
              <a href="#services">Deposits</a>
              <a href="#services">Member Benefits</a>
            </div>

            <div className="footer-section">
              <h4>Contact</h4>
              <p>info@esubusacco.co.ke</p>
              <p>+254-700-123-456</p>
              <p>Bungoma County, Kenya</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 Esubu SACCO. All rights reserved. Licensed by SASRA.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
