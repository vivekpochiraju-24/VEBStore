import { adminLogin } from '../../../controller/authController.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    // Mock the request/response for the existing controller
    const mockReq = {
      body: req.body,
      cookies: req.cookies || {}
    };

    const mockRes = {
      cookie: (name, value, options) => {
        res.setHeader('Set-Cookie', `${name}=${value}; ${Object.entries(options).map(([k, v]) => `${k}=${v}`).join('; ')}`);
      },
      status: (code) => ({
        json: (data) => res.status(code).json(data)
      }),
      json: (data) => res.status(200).json(data)
    };

    await adminLogin(mockReq, mockRes);
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
}
