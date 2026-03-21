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
    const { email, password } = req.body;
    
    console.log("Admin login attempt:", { email, passwordReceived: password ? "***" : "undefined" });
    
    // Admin credentials
    const adminEmail = "bhargavisurampudi1@gmail.com";
    const adminPassword = "bhargavi10";
    
    console.log("Expected credentials:", { adminEmail, adminPassword: "***" });
    console.log("Email match:", email === adminEmail);
    console.log("Password match:", password === adminPassword);
    
    if (email === adminEmail && password === adminPassword) {
      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      
      // Set cookie
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`);
      
      return res.status(200).json({ 
        success: true, 
        token, 
        message: "Admin login successful" 
      });
    }
    
    return res.status(400).json({ message: "Invalid administrator credentials" });

  } catch (error) {
    console.error("AdminLogin error:", error.message);
    return res.status(500).json({ message: "Server error during admin login" });
  }
}
