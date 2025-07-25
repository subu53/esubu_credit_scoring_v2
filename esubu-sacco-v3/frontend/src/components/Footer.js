import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn,
  FaShieldAlt 
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <FaShieldAlt className="footer-logo-icon" />
              <div>
                <h3>Esubu SACCO</h3>
                <p className="footer-tagline">Empowering Dreams. One Loan at a Time.</p>
              </div>
            </div>
            <p className="footer-description">
              Licensed by SASRA and serving over 8,000 members across Kenya since 2015. 
              We provide transparent, member-owned financial services to empower communities.
            </p>
            <div className="sasra-footer-badge">
              <span>🛡️ Licensed by SASRA</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/apply-loan">Apply for Loan</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/login">Officer Login</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Our Services</h4>
            <ul className="footer-links">
              <li><a href="#loans">Personal Loans</a></li>
              <li><a href="#business">Business Loans</a></li>
              <li><a href="#savings">Savings Accounts</a></li>
              <li><a href="#deposits">Fixed Deposits</a></li>
              <li><a href="#insurance">Insurance Services</a></li>
              <li><a href="#mobile">Mobile Banking</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Information</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <p>+254 700 123 456</p>
                  <p>+254 733 987 654</p>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <p>info@esubusacco.co.ke</p>
                  <p>support@esubusacco.co.ke</p>
                </div>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <p>Bungoma County, Kenya</p>
                  <p>P.O. Box 1234-50200</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="social-media">
              <h5>Follow Us</h5>
              <div className="social-links">
                <a href="#facebook" aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a href="#twitter" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#linkedin" aria-label="LinkedIn">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} Esubu SACCO. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#regulatory">Regulatory Information</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
