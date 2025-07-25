// API Configuration
const API_BASE_URL = 'https://esubu-credit-scoring-v2-1-edit-12.onrender.com';

// Global State
let currentStep = 1;
let currentLoginType = 'member';

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update URL hash
    window.location.hash = pageId;
}

// Multi-step Form Navigation
function nextStep(step) {
    const currentStepEl = document.getElementById(`step-${currentStep}`);
    const nextStepEl = document.getElementById(`step-${step}`);
    
    if (currentStepEl && nextStepEl) {
        currentStepEl.classList.remove('active');
        nextStepEl.classList.add('active');
        currentStep = step;
    }
}

function prevStep(step) {
    const currentStepEl = document.getElementById(`step-${currentStep}`);
    const prevStepEl = document.getElementById(`step-${step}`);
    
    if (currentStepEl && prevStepEl) {
        currentStepEl.classList.remove('active');
        prevStepEl.classList.add('active');
        currentStep = step;
    }
}

// Loan Calculator
function calculateLoan() {
    const amount = parseFloat(document.getElementById('calc-amount').value) || 0;
    const term = parseInt(document.getElementById('calc-term').value) || 0;
    const rate = 0.15; // 15% annual interest rate
    
    if (amount > 0 && term > 0) {
        const monthlyRate = rate / 12;
        const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                              (Math.pow(1 + monthlyRate, term) - 1);
        const totalInterest = (monthlyPayment * term) - amount;
        
        document.getElementById('monthly-payment').textContent = 
            `KES ${monthlyPayment.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
        document.getElementById('total-interest').textContent = 
            `KES ${totalInterest.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
    } else {
        document.getElementById('monthly-payment').textContent = 'KES 0';
        document.getElementById('total-interest').textContent = 'KES 0';
    }
}

// Login Type Selector
function setLoginType(type) {
    currentLoginType = type;
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Loading Overlay
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
}

// API Helper Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Form Submission Handlers
async function submitLoanApplication(formData) {
    try {
        showLoading();
        
        // Format data for API
        const applicationData = {
            // Personal Information
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            idNumber: formData.get('idNumber'),
            phoneNumber: formData.get('phoneNumber'),
            email: formData.get('email'),
            dateOfBirth: formData.get('dateOfBirth'),
            gender: formData.get('gender'),
            
            // Employment Information
            employmentStatus: formData.get('employmentStatus'),
            employerName: formData.get('employerName'),
            jobTitle: formData.get('jobTitle'),
            monthlyIncome: parseFloat(formData.get('monthlyIncome')),
            
            // Loan Information
            loanType: formData.get('loanType'),
            requestedAmount: parseFloat(formData.get('requestedAmount')),
            loanTerm: parseInt(formData.get('loanTerm')),
            loanPurpose: formData.get('loanPurpose'),
            
            // Metadata
            applicationDate: new Date().toISOString(),
            status: 'pending',
            source: 'web_application'
        };
        
        // Calculate additional fields
        const monthlyPayment = calculateMonthlyPaymentAmount(
            applicationData.requestedAmount, 
            applicationData.loanTerm
        );
        
        applicationData.estimatedMonthlyPayment = monthlyPayment;
        applicationData.debtToIncomeRatio = (monthlyPayment / applicationData.monthlyIncome) * 100;
        
        // Submit to API
        const result = await apiCall('/api/loan-application', 'POST', applicationData);
        
        hideLoading();
        showNotification('Loan application submitted successfully! We will review and get back to you soon.', 'success');
        
        // Reset form and go back to home
        document.getElementById('loanForm').reset();
        currentStep = 1;
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.getElementById('step-1').classList.add('active');
        
        setTimeout(() => {
            showPage('home');
        }, 2000);
        
        return result;
        
    } catch (error) {
        hideLoading();
        showNotification('Failed to submit application. Please try again or contact support.', 'error');
        console.error('Loan application error:', error);
    }
}

function calculateMonthlyPaymentAmount(principal, termMonths) {
    const rate = 0.15 / 12; // 15% annual rate
    if (rate === 0) return principal / termMonths;
    return (principal * rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
}

async function submitContactForm(formData) {
    try {
        showLoading();
        
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        const result = await apiCall('/api/contact', 'POST', contactData);
        
        hideLoading();
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        return result;
        
    } catch (error) {
        hideLoading();
        showNotification('Failed to send message. Please try again.', 'error');
        console.error('Contact form error:', error);
    }
}

async function submitLogin(formData) {
    try {
        showLoading();
        
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            user_type: currentLoginType
        };
        
        const result = await apiCall('/api/login', 'POST', loginData);
        
        hideLoading();
        
        if (result.access_token) {
            // Store token
            localStorage.setItem('authToken', result.access_token);
            localStorage.setItem('userType', result.user_type);
            
            showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect based on user type
            if (currentLoginType === 'officer' || currentLoginType === 'admin') {
                setTimeout(() => {
                    window.open(`${API_BASE_URL}/dashboard`, '_blank');
                }, 1500);
            } else {
                setTimeout(() => {
                    showPage('home');
                }, 1500);
            }
        }
        
        return result;
        
    } catch (error) {
        hideLoading();
        showNotification('Login failed. Please check your credentials.', 'error');
        console.error('Login error:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Handle loan application form submission
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        loanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            submitLoanApplication(formData);
        });
    }
    
    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            submitContactForm(formData);
        });
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            submitLogin(formData);
        });
    }
    
    // Handle hash navigation
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showPage(hash);
        } else {
            showPage('home');
        }
    }
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Handle initial load
    
    // Test backend connection on load
    testBackendConnection();
});

// Backend Connection Test
async function testBackendConnection() {
    const statusElement = document.getElementById('backend-status');
    
    try {
        if (statusElement) {
            statusElement.innerHTML = '🔄 Testing connection...';
        }
        
        const response = await fetch(`${API_BASE_URL}/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (response.ok) {
            console.log('✅ Backend connection successful');
            if (statusElement) {
                statusElement.innerHTML = '✅ Connected to backend API<br><small>Ready to process applications</small>';
                statusElement.style.color = 'var(--success-color)';
            }
        } else {
            console.warn('⚠️ Backend responded but with error status:', response.status);
            if (statusElement) {
                statusElement.innerHTML = `⚠️ Backend responding (Status: ${response.status})<br><small>Some features may be limited</small>`;
                statusElement.style.color = 'var(--warning-color)';
            }
        }
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        if (statusElement) {
            statusElement.innerHTML = '❌ Connection failed<br><small>Please check your internet connection</small>';
            statusElement.style.color = 'var(--danger-color)';
        }
        // Optionally show a subtle notification to user
        setTimeout(() => {
            showNotification('Note: Some features may be limited due to connectivity issues.', 'warning');
        }, 2000);
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0
    }).format(amount);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhoneNumber(phone) {
    const re = /^(\+254|0)[17]\d{8}$/;
    return re.test(phone);
}

// Export functions for global access
window.showPage = showPage;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.calculateLoan = calculateLoan;
window.setLoginType = setLoginType;
