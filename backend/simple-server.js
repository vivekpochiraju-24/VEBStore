import express from 'express';
import cors from 'cors';

const app = express();
const port = 8000;

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "http://localhost:5174",
        "https://vebstore.netlify.app",
        "https://admin-vebstore.netlify.app"
    ],
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple admin login for testing
app.post('/api/auth/adminlogin', (req, res) => {
    const { email, password } = req.body;
    
    console.log('=== ADMIN LOGIN TEST ===');
    console.log('Email:', email);
    console.log('Password:', password ? '***' : 'NOT PROVIDED');
    
    // Updated test credentials
    if (email === 'bhargavisurampudi1@gmail.com' && password === 'bhargavi10') {
        console.log('✅ Login successful!');
        return res.json({ 
            success: true, 
            token: 'test-token-123',
            message: 'Admin login successful' 
        });
    }
    
    console.log('❌ Login failed');
    return res.status(400).json({ message: 'Invalid credentials' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log('🚀 Simple VEBStore Server Starting...');
    console.log(`📍 Server running on: http://localhost:${port}`);
    console.log('🎯 Simple Backend Ready!');
});
