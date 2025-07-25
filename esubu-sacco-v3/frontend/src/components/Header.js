import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo Section */}
          <div className="logo-section">
            <Link to="/" className="logo">
              <div className="logo-icon">
                <FaShieldAlt />
              </div>
              <div className="logo-text">
                <h2>Esubu SACCO</h2>
                <span className="tagline">Empowering Dreams</span>
              </div>
            </Link>
            <div className="sasra-badge">
              <span>Licensed by SASRA</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-links">
              <li>
                <Link 
                  to="/" 
                  className={isActive('/')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className={isActive('/about')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className={isActive('/services')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/apply-loan" 
                  className={`${isActive('/apply-loan')} cta-link`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Apply for Loan
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={isActive('/contact')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Action Buttons */}
            <div className="header-actions">
              <Link to="/login" className="btn btn-outline btn-sm">
                Officer Login
              </Link>
              <Link to="/apply-loan" className="btn btn-primary btn-sm">
                Join Us
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />}
    </header>
  );
};

export default Header;
