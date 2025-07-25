import { apiService } from '../services/api';

// Simple test to verify backend connection
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test basic connectivity
    const response = await fetch('https://esubu-credit-scoring-v2-1-edit-12.onrender.com/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('Backend response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Backend connection successful');
      return true;
    } else {
      console.log('❌ Backend connection failed');
      return false;
    }
  } catch (error) {
    console.error('Backend connection error:', error);
    return false;
  }
};

// Test loan application submission
export const testLoanApplication = async () => {
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    idNumber: '12345678',
    phoneNumber: '0712345678',
    email: 'john.doe@example.com',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    maritalStatus: 'single',
    county: 'Nairobi',
    town: 'Nairobi',
    address: '123 Test Street',
    employmentStatus: 'employed',
    employerName: 'Test Company',
    jobTitle: 'Developer',
    workDuration: '2 years',
    monthlyIncome: 50000,
    loanType: 'personal',
    requestedAmount: 100000,
    loanPurpose: 'Business',
    loanTerm: 12,
    dependents: 0,
    pastLoanDefault: false,
    bankAccount: true,
    collateralAvailable: false,
    estimatedMonthlyPayment: 9000,
    debtToIncomeRatio: 18,
    applicationDate: new Date().toISOString(),
    status: 'pending',
    source: 'web_application'
  };

  try {
    console.log('Testing loan application submission...');
    const result = await apiService.submitLoanApplication(testData);
    console.log('✅ Loan application test successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Loan application test failed:', error);
    return null;
  }
};

// Helper function to run all tests
export const runBackendTests = async () => {
  console.log('🔄 Running backend integration tests...');
  
  const connectionTest = await testBackendConnection();
  
  if (connectionTest) {
    await testLoanApplication();
  }
  
  console.log('✅ Backend tests completed');
};
