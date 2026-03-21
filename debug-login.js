const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing admin login...');
        
        const response = await axios.post('http://localhost:8000/api/auth/adminlogin', {
                email: 'bhargavisurampudi1@gmail.com',
                password: 'lzevtyxurfrapoiw'
        }, {
                withCredentials: true
        });
        
        console.log('✅ Login successful:', response.data);
        
        // Test getadmin
        const adminResponse = await axios.get('http://localhost:8000/api/user/getadmin', {
                withCredentials: true
        });
        
        console.log('✅ Get admin successful:', adminResponse.data);
        
    } catch (error) {
        console.error('❌ Login failed:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url
        });
    }
}

testLogin();
