// Test file to verify API connectivity and medicine scanner functionality
// Run this in browser console after backend is running

const API_BASE_URL = 'http://localhost:8000';

// Test 1: Check if backend is accessible
async function testBackendHealth() {
  try {
    console.log('🔍 Testing backend connectivity...');
    const response = await fetch(`${API_BASE_URL}/medi-ai/user/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      console.log('✅ Backend is accessible!');
      return true;
    } else {
      console.log('❌ Backend responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
    return false;
  }
}

// Test 2: Test medicine scanner endpoint with a mock image
async function testMedicineScannerEndpoint() {
  try {
    console.log('🧪 Testing medicine scanner endpoint...');
    
    // Create a simple test image file
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText('Test Medicine', 10, 50);
    
    // Convert to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    const testFile = new File([blob], 'test-medicine.jpg', { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('image', testFile);
    
    const response = await fetch(`${API_BASE_URL}/medi-ai/medicine-scanner/`, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Medicine scanner endpoint is working!');
      console.log('Response:', result);
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Medicine scanner endpoint error:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Medicine scanner test failed:', error.message);
    return false;
  }
}

// Test 3: Full integration test
async function runFullTest() {
  console.log('🚀 Starting API integration tests...\n');
  
  const healthCheck = await testBackendHealth();
  if (!healthCheck) {
    console.log('❌ Backend health check failed. Make sure Django server is running on port 8000.');
    return;
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  
  const scannerTest = await testMedicineScannerEndpoint();
  if (!scannerTest) {
    console.log('❌ Medicine scanner test failed. Check backend logs for errors.');
    return;
  }
  
  console.log('\n🎉 All tests passed! Medicine scanner integration is working properly.');
  console.log('✅ Frontend can now successfully communicate with the Gemini AI backend.');
}

// Export test functions for manual use
window.mediAiTests = {
  testBackendHealth,
  testMedicineScannerEndpoint,
  runFullTest
};

console.log('🧪 MediAI API Test Suite loaded!');
console.log('📋 Available tests:');
console.log('   - mediAiTests.testBackendHealth()');
console.log('   - mediAiTests.testMedicineScannerEndpoint()'); 
console.log('   - mediAiTests.runFullTest()');
console.log('');
console.log('💡 Run mediAiTests.runFullTest() to test everything at once!');

export { testBackendHealth, testMedicineScannerEndpoint, runFullTest };
