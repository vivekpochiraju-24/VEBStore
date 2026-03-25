# VEBStore - How to Run the Website

## 🚀 Quick Start

### Option 1: Automatic Startup (Recommended)
```powershell
# Run the startup script
.\start-website.ps1
```

### Option 2: Manual Startup

#### Step 1: Start Backend Server
```powershell
cd backend
npm run dev
```

#### Step 2: Start Frontend Server (in new terminal)
```powershell
cd frontend
npm run dev
```

## 🌐 Access Points

- **Frontend Website**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

## 👤 Test Login Credentials

- **Email**: bhargavisurampudi1@gmail.com
- **Password**: password123

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (or use the provided MongoDB Atlas connection)
3. **npm** or **yarn**

## 🔧 First Time Setup

### Install Dependencies
```powershell
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### Environment Configuration
The backend uses `.env` file (already configured):
- MongoDB connection
- JWT secrets
- Email service
- Firebase configuration

## 🛠️ Features Status

✅ **Working Features:**
- User authentication (login/register)
- Google OAuth login
- Product browsing
- Product details view
- Shopping cart
- Order placement
- Exchange program
- Admin panel
- Dark/Light theme toggle

✅ **API Endpoints:**
- `/api/auth/login` - User login
- `/api/auth/registration` - User registration
- `/api/auth/googlelogin` - Google OAuth
- `/api/product/list` - Get all products
- `/api/user/getcurrentuser` - Get current user
- `/api/health` - Health check

## 🔍 Troubleshooting

### Common Issues

1. **Login successful but website not opening**
   - ✅ **FIXED**: This issue has been resolved with improved state management
   - If it persists, clear browser cache and cookies
   - Ensure both frontend and backend servers are running

2. **Port already in use**
   - Close other applications using ports 5173 or 8000
   - Or change ports in vite.config.js / backend index.js

3. **MongoDB connection failed**
   - Check internet connection
   - Verify MongoDB URL in .env file

4. **Products not loading**
   - Check backend server status
   - Verify database connection

5. **White screen after login**
   - Wait 2-3 seconds for authentication to complete
   - Check browser console for errors
   - Refresh the page if needed

### Server Status Check
```powershell
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost:5173

# Test login API
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"bhargavisurampudi1@gmail.com\",\"password\":\"password123\"}"
```

### Login Flow Debugging
1. **Backend Login**: Working ✅
2. **Frontend State Management**: Fixed ✅  
3. **Navigation After Login**: Improved ✅
4. **Loading States**: Added ✅

## 📞 Support

If you encounter issues:
1. Check both servers are running
2. Verify internet connection
3. Clear browser cache and cookies
4. Use the test credentials provided above

## 🎯 Next Steps

- Add new products through admin panel
- Configure email service for notifications
- Set up payment gateway (Razorpay)
- Deploy to production (Netlify/Vercel)

---

**VEBStore Elite Platform** - Premium Fashion E-Commerce
