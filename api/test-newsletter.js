// Test script for subscribe-newsletter function
// Run with: node api/test-newsletter.js

async function testNewsletterFunction() {
  const testEmail = 'test@example.com';
  const testRecaptchaToken = 'test-token'; // You'll need a real token for full testing
  
  console.log('🧪 Testing newsletter subscription function...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/subscribe-newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        recaptchaToken: testRecaptchaToken
      })
    });
    
    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📦 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Test passed - Function executed successfully');
    } else {
      console.log('❌ Test failed - Function returned error');
    }
    
  } catch (error) {
    console.error('🚨 Network/Request Error:', error.message);
  }
}

// Test different scenarios
async function runAllTests() {
  console.log('='.repeat(50));
  console.log('🚀 Starting Newsletter Function Tests');
  console.log('='.repeat(50));
  
  // Test 1: Missing recaptcha token
  console.log('\n📝 Test 1: Missing reCAPTCHA token');
  try {
    const response = await fetch('http://localhost:3000/api/subscribe-newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    const data = await response.json();
    console.log('Status:', response.status, 'Data:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 2: Invalid method
  console.log('\n📝 Test 2: Invalid HTTP method (GET)');
  try {
    const response = await fetch('http://localhost:3000/api/subscribe-newsletter', {
      method: 'GET'
    });
    const data = await response.json();
    console.log('Status:', response.status, 'Data:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 3: Valid request (will fail at reCAPTCHA verification without real token)
  console.log('\n📝 Test 3: Valid request with test token');
  await testNewsletterFunction();
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ Tests completed');
  console.log('='.repeat(50));
}

// Check if running as main script
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testNewsletterFunction, runAllTests };