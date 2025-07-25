import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { apiService } from '../services/api';
import { 
  FaUser, 
  FaMoneyBillWave, 
  FaFileAlt, 
  FaShieldAlt,
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';
import './LoanApplicationPage.css';

const LoanApplicationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm();

  const watchedValues = watch([
    'monthlyIncome',
    'requestedAmount',
    'loanTerm'
  ]);

  // Calculate estimated monthly payment
  const calculateMonthlyPayment = () => {
    const amount = parseFloat(watchedValues[1]) || 0;
    const term = parseInt(watchedValues[2]) || 12;
    const interestRate = 0.15; // 15% annual rate
    const monthlyRate = interestRate / 12;
    
    if (amount > 0 && term > 0) {
      const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                     (Math.pow(1 + monthlyRate, term) - 1);
      return payment.toFixed(2);
    }
    return '0.00';
  };

  // Submit form to backend API
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Format data for API
      const applicationData = {
        // Personal Information
        firstName: data.firstName,
        lastName: data.lastName,
        idNumber: data.idNumber,
        phoneNumber: data.phoneNumber,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        
        // Address Information
        county: data.county,
        town: data.town,
        address: data.address,
        
        // Employment Information
        employmentStatus: data.employmentStatus,
        employerName: data.employerName,
        jobTitle: data.jobTitle,
        workDuration: data.workDuration,
        monthlyIncome: parseFloat(data.monthlyIncome),
        
        // Loan Information
        loanType: data.loanType,
        requestedAmount: parseFloat(data.requestedAmount),
        loanPurpose: data.loanPurpose,
        loanTerm: parseInt(data.loanTerm),
        
        // Additional Information
        dependents: parseInt(data.dependents) || 0,
        pastLoanDefault: data.pastLoanDefault === 'yes',
        bankAccount: data.bankAccount === 'yes',
        collateralAvailable: data.collateralAvailable === 'yes',
        
        // Calculated fields
        estimatedMonthlyPayment: parseFloat(calculateMonthlyPayment()),
        debtToIncomeRatio: (parseFloat(calculateMonthlyPayment()) / parseFloat(data.monthlyIncome)) * 100,
        
        // Metadata
        applicationDate: new Date().toISOString(),
        status: 'pending',
        source: 'web_application'
      };

      // Send to your existing Render backend
      const result = await apiService.submitLoanApplication(applicationData);
      
      if (result.success || result.application_id) {
        setApplicationId(result.applicationId);
        setCurrentStep(3); // Success step
        toast.success('Application submitted successfully!');
        reset();
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="loan-application-page">
      <div className="container">
        <div className="application-header">
          <h1>Loan Application</h1>
          <p>Complete the form below to apply for your loan. All information is secure and confidential.</p>
          
          {/* Progress Indicator */}
          <div className="progress-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Personal Info</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Loan Details</span>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        <div className="application-content">
          <div className="row">
            <div className="col-md-8">
              <div className="application-form card">
                {currentStep === 1 && (
                  <form className="step-form" id="step1">
                    <div className="step-header">
                      <FaUser className="step-icon" />
                      <h3>Personal Information</h3>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">First Name *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.firstName ? 'error' : ''}`}
                            {...register('firstName', { required: 'First name is required' })}
                          />
                          {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Last Name *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.lastName ? 'error' : ''}`}
                            {...register('lastName', { required: 'Last name is required' })}
                          />
                          {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">ID Number *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.idNumber ? 'error' : ''}`}
                            {...register('idNumber', { 
                              required: 'ID number is required',
                              pattern: {
                                value: /^[0-9]{8}$/,
                                message: 'Please enter a valid 8-digit ID number'
                              }
                            })}
                          />
                          {errors.idNumber && <span className="error-message">{errors.idNumber.message}</span>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Phone Number *</label>
                          <input
                            type="tel"
                            className={`form-control ${errors.phoneNumber ? 'error' : ''}`}
                            placeholder="0700123456"
                            {...register('phoneNumber', { 
                              required: 'Phone number is required',
                              pattern: {
                                value: /^(07|01)[0-9]{8}$/,
                                message: 'Please enter a valid Kenyan phone number'
                              }
                            })}
                          />
                          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber.message}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Email Address *</label>
                          <input
                            type="email"
                            className={`form-control ${errors.email ? 'error' : ''}`}
                            {...register('email', { 
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Please enter a valid email address'
                              }
                            })}
                          />
                          {errors.email && <span className="error-message">{errors.email.message}</span>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Date of Birth *</label>
                          <input
                            type="date"
                            className={`form-control ${errors.dateOfBirth ? 'error' : ''}`}
                            {...register('dateOfBirth', { required: 'Date of birth is required' })}
                          />
                          {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth.message}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="form-label">Gender *</label>
                          <select
                            className={`form-control form-select ${errors.gender ? 'error' : ''}`}
                            {...register('gender', { required: 'Please select gender' })}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.gender && <span className="error-message">{errors.gender.message}</span>}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="form-label">Marital Status *</label>
                          <select
                            className={`form-control form-select ${errors.maritalStatus ? 'error' : ''}`}
                            {...register('maritalStatus', { required: 'Please select marital status' })}
                          >
                            <option value="">Select Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                          </select>
                          {errors.maritalStatus && <span className="error-message">{errors.maritalStatus.message}</span>}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="form-label">Number of Dependents</label>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            className="form-control"
                            {...register('dependents')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="step-actions">
                      <button type="button" className="btn btn-primary" onClick={nextStep}>
                        Next Step
                      </button>
                    </div>
                  </form>
                )}

                {currentStep === 2 && (
                  <form className="step-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="step-header">
                      <FaMoneyBillWave className="step-icon" />
                      <h3>Loan & Employment Details</h3>
                    </div>

                    {/* Employment Information */}
                    <h4>Employment Information</h4>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Employment Status *</label>
                          <select
                            className={`form-control form-select ${errors.employmentStatus ? 'error' : ''}`}
                            {...register('employmentStatus', { required: 'Please select employment status' })}
                          >
                            <option value="">Select Status</option>
                            <option value="employed">Employed</option>
                            <option value="self-employed">Self-Employed</option>
                            <option value="business-owner">Business Owner</option>
                            <option value="farmer">Farmer</option>
                            <option value="student">Student</option>
                            <option value="retired">Retired</option>
                          </select>
                          {errors.employmentStatus && <span className="error-message">{errors.employmentStatus.message}</span>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Monthly Income (KES) *</label>
                          <input
                            type="number"
                            min="1000"
                            max="10000000"
                            className={`form-control ${errors.monthlyIncome ? 'error' : ''}`}
                            placeholder="30000"
                            {...register('monthlyIncome', { 
                              required: 'Monthly income is required',
                              min: {
                                value: 1000,
                                message: 'Minimum income is KES 1,000'
                              }
                            })}
                          />
                          {errors.monthlyIncome && <span className="error-message">{errors.monthlyIncome.message}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Loan Information */}
                    <h4>Loan Information</h4>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Loan Type *</label>
                          <select
                            className={`form-control form-select ${errors.loanType ? 'error' : ''}`}
                            {...register('loanType', { required: 'Please select loan type' })}
                          >
                            <option value="">Select Loan Type</option>
                            <option value="personal">Personal Loan</option>
                            <option value="business">Business Loan</option>
                            <option value="emergency">Emergency Loan</option>
                            <option value="education">Education Loan</option>
                            <option value="agriculture">Agriculture Loan</option>
                          </select>
                          {errors.loanType && <span className="error-message">{errors.loanType.message}</span>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Requested Amount (KES) *</label>
                          <input
                            type="number"
                            min="1000"
                            max="5000000"
                            className={`form-control ${errors.requestedAmount ? 'error' : ''}`}
                            placeholder="100000"
                            {...register('requestedAmount', { 
                              required: 'Loan amount is required',
                              min: {
                                value: 1000,
                                message: 'Minimum loan is KES 1,000'
                              },
                              max: {
                                value: 5000000,
                                message: 'Maximum loan is KES 5,000,000'
                              }
                            })}
                          />
                          {errors.requestedAmount && <span className="error-message">{errors.requestedAmount.message}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Loan Term (Months) *</label>
                          <select
                            className={`form-control form-select ${errors.loanTerm ? 'error' : ''}`}
                            {...register('loanTerm', { required: 'Please select loan term' })}
                          >
                            <option value="">Select Term</option>
                            <option value="6">6 Months</option>
                            <option value="12">12 Months</option>
                            <option value="18">18 Months</option>
                            <option value="24">24 Months</option>
                            <option value="36">36 Months</option>
                            <option value="48">48 Months</option>
                            <option value="60">60 Months</option>
                          </select>
                          {errors.loanTerm && <span className="error-message">{errors.loanTerm.message}</span>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Purpose of Loan *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.loanPurpose ? 'error' : ''}`}
                            placeholder="e.g., Business expansion, Education, Emergency"
                            {...register('loanPurpose', { required: 'Please specify loan purpose' })}
                          />
                          {errors.loanPurpose && <span className="error-message">{errors.loanPurpose.message}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Additional Questions */}
                    <h4>Additional Information</h4>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Have you defaulted on any loan before? *</label>
                          <select
                            className={`form-control form-select ${errors.pastLoanDefault ? 'error' : ''}`}
                            {...register('pastLoanDefault', { required: 'Please select an option' })}
                          >
                            <option value="">Select Option</option>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </select>
                          {errors.pastLoanDefault && <span className="error-message">{errors.pastLoanDefault.message}</span>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Do you have a bank account? *</label>
                          <select
                            className={`form-control form-select ${errors.bankAccount ? 'error' : ''}`}
                            {...register('bankAccount', { required: 'Please select an option' })}
                          >
                            <option value="">Select Option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                          {errors.bankAccount && <span className="error-message">{errors.bankAccount.message}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="step-actions">
                      <button type="button" className="btn btn-outline" onClick={prevStep}>
                        Previous
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="spinner" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {currentStep === 3 && applicationId && (
                  <div className="success-step text-center">
                    <FaCheckCircle className="success-icon" />
                    <h3>Application Submitted Successfully!</h3>
                    <p>Your application ID is: <strong>{applicationId}</strong></p>
                    <p>We'll review your application and get back to you within 24 hours.</p>
                    <div className="success-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setCurrentStep(1);
                          setApplicationId(null);
                        }}
                      >
                        Submit Another Application
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="application-sidebar">
                {/* Loan Calculator */}
                {currentStep === 2 && (
                  <div className="calculator-card card">
                    <div className="card-header">
                      <FaMoneyBillWave className="card-icon" />
                      <h4>Loan Calculator</h4>
                    </div>
                    <div className="card-body">
                      <div className="calculation-item">
                        <span>Requested Amount:</span>
                        <strong>KES {watchedValues[1] ? parseFloat(watchedValues[1]).toLocaleString() : '0'}</strong>
                      </div>
                      <div className="calculation-item">
                        <span>Loan Term:</span>
                        <strong>{watchedValues[2] || '0'} months</strong>
                      </div>
                      <div className="calculation-item">
                        <span>Interest Rate:</span>
                        <strong>15% p.a.</strong>
                      </div>
                      <div className="calculation-item highlight">
                        <span>Monthly Payment:</span>
                        <strong>KES {parseFloat(calculateMonthlyPayment()).toLocaleString()}</strong>
                      </div>
                      {watchedValues[0] && (
                        <div className="calculation-item">
                          <span>Debt-to-Income:</span>
                          <strong>{((parseFloat(calculateMonthlyPayment()) / parseFloat(watchedValues[0])) * 100).toFixed(1)}%</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Trust Indicators */}
                <div className="trust-card card">
                  <div className="card-header">
                    <FaShieldAlt className="card-icon" />
                    <h4>Why Choose Esubu SACCO?</h4>
                  </div>
                  <div className="card-body">
                    <ul className="trust-list">
                      <li>✓ SASRA Licensed & Regulated</li>
                      <li>✓ Competitive Interest Rates</li>
                      <li>✓ Quick 24-hour Approval</li>
                      <li>✓ No Hidden Charges</li>
                      <li>✓ Member-Owned Institution</li>
                      <li>✓ 9+ Years of Service</li>
                      <li>✓ 8,000+ Satisfied Members</li>
                    </ul>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="contact-card card">
                  <div className="card-body">
                    <h5>Need Help?</h5>
                    <p>Contact our loan officers:</p>
                    <p><strong>Phone:</strong> +254 700 123 456</p>
                    <p><strong>Email:</strong> loans@esubusacco.co.ke</p>
                    <p><strong>Office Hours:</strong> Mon-Fri 8AM-5PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationPage;
