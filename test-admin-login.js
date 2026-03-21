// Test admin credentials
import axios from 'axios';

const testAdminLogin = async () => {
    try {
        console.log('Testing admin login...');
        
        const response = await axios.post('http://localhost:8000/api/auth/adminlogin', {
            email: 'bhargavisurampudi1@gmail.com',
            password: 'bhargavi10'
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            timeout: 5000
        });
        
        console.log('✅ Admin login successful!');
        console.log('Response:', response.data);
        
    } catch (error) {
        console.error('❌ Admin login failed:');
        console.error('Status:', error.response?.status);
        console.error('Message:', error.response?.data?.message);
        console.error('Error:', error.message);
    }
};

testAdminLogin();
