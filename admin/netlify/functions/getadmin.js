export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    // Check if admin is logged in via token
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Simple token validation (in production, use proper JWT verification)
    // For now, return admin data if token exists
    const adminData = {
      _id: "admin123",
      name: "Administrator",
      email: "bhargavisurampudi1@gmail.com",
      role: "admin"
    };

    return res.status(200).json(adminData);

  } catch (error) {
    console.error('Get admin error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
