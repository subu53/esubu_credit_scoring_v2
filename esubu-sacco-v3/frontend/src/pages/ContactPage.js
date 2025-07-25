import React, { useState } from 'react';
import { apiService } from '../services/api';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await apiService.submitContactForm(formData);
      setSubmitMessage('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="contact-page">
      <div className="container py-5">
        <div className="contact-header text-center mb-5">
          <h1>Contact Us</h1>
          <p className="lead">Get in touch with our friendly team</p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="contact-info">
              <h3>Visit Our Office</h3>
              <p><strong>Address:</strong> Bungoma County, Kenya</p>
              <p><strong>P.O. Box:</strong> 1234-50200</p>
              <p><strong>Phone:</strong> +254 700 123 456</p>
              <p><strong>Email:</strong> info@esubusacco.co.ke</p>
              <p><strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM</p>
            </div>
          </div>
          <div className="col-md-6">
              <div className="contact-form card">
                <div className="card-body">
                  <h4>Send us a Message</h4>
                  {submitMessage && (
                    <div className={`alert ${submitMessage.includes('error') ? 'alert-danger' : 'alert-success'}`}>
                      {submitMessage}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input 
                        type="text" 
                        name="name"
                        className="form-control" 
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="email" 
                        name="email"
                        className="form-control" 
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <textarea 
                        name="message"
                        className="form-control" 
                        rows="5" 
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
