import React from 'react';
import './ServicesPage.css';

const ServicesPage = () => {
  return (
    <div className="services-page">
      <div className="container py-5">
        <div className="services-header text-center mb-5">
          <h1>Our Services</h1>
          <p className="lead">Comprehensive financial solutions for your every need</p>
        </div>

        <div className="services-grid">
          <div className="service-item card">
            <div className="card-body">
              <h3>Personal Loans</h3>
              <p>Quick and affordable personal loans for your immediate needs.</p>
              <ul>
                <li>Up to KES 2M loan limit</li>
                <li>12-15% annual interest rate</li>
                <li>Flexible repayment terms</li>
                <li>24-hour approval</li>
              </ul>
            </div>
          </div>

          <div className="service-item card">
            <div className="card-body">
              <h3>Business Loans</h3>
              <p>Grow your business with our tailored business financing solutions.</p>
              <ul>
                <li>Up to KES 5M loan limit</li>
                <li>Competitive rates from 12%</li>
                <li>Business advisory support</li>
                <li>Grace period options</li>
              </ul>
            </div>
          </div>

          <div className="service-item card">
            <div className="card-body">
              <h3>Savings Accounts</h3>
              <p>Secure your future with our high-yield savings accounts.</p>
              <ul>
                <li>Competitive interest rates</li>
                <li>No minimum balance</li>
                <li>Online banking access</li>
                <li>Mobile money integration</li>
              </ul>
            </div>
          </div>

          <div className="service-item card">
            <div className="card-body">
              <h3>Fixed Deposits</h3>
              <p>Lock in attractive returns with our fixed deposit accounts.</p>
              <ul>
                <li>Higher interest rates</li>
                <li>Flexible terms (3-36 months)</li>
                <li>Loan against deposit</li>
                <li>Automatic renewal options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
