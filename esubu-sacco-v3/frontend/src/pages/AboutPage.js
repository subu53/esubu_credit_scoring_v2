import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container py-5">
        <div className="about-header text-center mb-5">
          <h1>About Esubu SACCO</h1>
          <p className="lead">Our journey from a small community group to Kenya's trusted SACCO</p>
        </div>

        <div className="story-section mb-5">
          <h2>Our Story</h2>
          <p>
            Esubu SACCO was founded in 2015 by three childhood friends from Bungoma County. 
            With humble beginnings as a community table-banking group in a small rural market, 
            the founders saw firsthand how limited access to credit was holding back farmers, 
            boda boda riders, mama mbogas, and teachers.
          </p>
          <p>
            Their mission was simple: create a safe, transparent, and member-owned SACCO 
            that empowers low- and medium-income earners to save consistently and access loans fairly.
          </p>
          <p>
            Since then, Esubu SACCO has grown into a fully licensed deposit-taking SACCO under SASRA, 
            now serving over 8,000 members across Kenya, both online and in-person.
          </p>
          <p>
            We still honor our roots — we know our members by name, and we design systems 
            that serve real Kenyan lives.
          </p>
        </div>

        <div className="mission-vision-section">
          <div className="row">
            <div className="col-md-6">
              <div className="card mission-card">
                <div className="card-body">
                  <h3>Our Mission</h3>
                  <p>
                    To create safe, transparent, and member-owned financial services that 
                    empower low- and medium-income earners in Kenya to achieve their dreams 
                    through consistent savings and fair access to credit.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card vision-card">
                <div className="card-body">
                  <h3>Our Vision</h3>
                  <p>
                    To be Kenya's most trusted community-focused SACCO, known by name and 
                    deed, where every member experiences personal financial growth and 
                    community empowerment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
