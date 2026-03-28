# Deploy VEBStore Backend to Render

## 🔧 Issues Fixed

The deployment issues you encountered have been resolved:

### ✅ **Fixed Problems:**
1. **Port Binding**: Now uses Render's dynamic port (process.env.PORT)
2. **Email Service**: Disabled SMTP verification in production to avoid timeouts
3. **Graceful Shutdown**: Proper SIGTERM/SIGINT handling with process.exit(0)
4. **CORS Configuration**: Updated for production domains

## 🚀 **Deployment Steps**

### 1. **Prepare Your Code**
```bash
# Ensure all changes are committed
git add .
git commit -m "Fix Render deployment issues"
git push origin main
```

### 2. **Render Dashboard Setup**

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder as root directory

2. **Configure Service Settings**
   ```
   Name: vebstore-backend
   Environment: Node
   Region: Choose nearest to your users
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: node index.js
   Instance Type: Free
   ```

### 3. **Environment Variables**
Add these in Render Dashboard → Environment Variables:

```bash
# Required
NODE_ENV=production
PORT=10000

# Database
MONGODB_URL=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_strong_jwt_secret

# Admin Credentials
ADMIN_EMAIL=your_admin_email@gmail.com
ADMIN_PASSWORD=your_admin_password

# Cloudinary (for images)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URLs (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://your-admin-domain.com
```

### 4. **Deployment Process**

Render will automatically:
1. Pull your code from GitHub
2. Run `npm install`
3. Start your server with `node index.js`
4. Perform health checks on `/health`

## 🔍 **Troubleshooting**

### Common Issues & Solutions:

1. **Port Binding Error**
   - ✅ **Fixed**: Code now uses `process.env.PORT` automatically

2. **Email Service Timeout**
   - ✅ **Fixed**: SMTP verification disabled in production

3. **Database Connection Failed**
   - Check MONGODB_URL environment variable
   - Ensure IP whitelist includes Render's IP ranges

4. **CORS Issues**
   - Add your frontend domains to environment variables
   - Check FRONTEND_URL and ADMIN_URL are set correctly

5. **Build Fails**
   - Ensure package.json has correct dependencies
   - Check for syntax errors in code

### Health Check
Your service should respond to:
```
GET https://your-app-name.onrender.com/health
```

Response:
```json
{"status":"OK","timestamp":"2024-..."}
```

## 🌐 **Post-Deployment**

Once deployed:

1. **Update Frontend URLs**
   ```javascript
   // In frontend/.env
   VITE_BACKEND_URL=https://your-app-name.onrender.com
   ```

2. **Update Admin URLs**
   ```javascript
   // In admin/.env
   VITE_BACKEND_URL=https://your-app-name.onrender.com
   ```

3. **Test API Endpoints**
   ```bash
   # Test health
   curl https://your-app-name.onrender.com/health
   
   # Test login
   curl -X POST https://your-app-name.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@email.com","password":"password"}'
   ```

## 📋 **Deployment Checklist**

- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Frontend URLs updated
- [ ] Health check passing
- [ ] API endpoints tested
- [ ] CORS properly configured

## 🎯 **Expected URLs**

After successful deployment:
- **Backend API**: `https://vebstore-backend.onrender.com`
- **Health Check**: `https://vebstore-backend.onrender.com/health`
- **API Docs**: `https://vebstore-backend.onrender.com/api/...`

---

**Note**: The free tier on Render has a 15-minute startup time after inactivity. Your app will automatically spin down and spin up when accessed.
