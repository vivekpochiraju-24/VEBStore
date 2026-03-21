# Local Development Setup

## Prerequisites
1. Node.js installed
2. MongoDB installed and running on localhost:27017
3. Git installed

## Setup Steps

### 1. Backend Setup
```bash
cd backend
npm install
```

### 2. Create Backend Environment File
Create `.env` file in `backend/` directory:
```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your settings
MONGODB_URI=mongodb://localhost:27017/vebstore
PORT=8000
NODE_ENV=development
ADMIN_LOGIN_EMAIL=bhargavisurampudi1@gmail.com
ADMIN_LOGIN_PASSWORD=bhargavi10
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:8000

### 4. Frontend Setup
In a new terminal:
```bash
cd admin
npm install
```

### 5. Start Frontend Development Server
```bash
cd admin
npm run dev
```
Frontend will run on: http://localhost:5174

## Login Credentials
- Email: `bhargavisurampudi1@gmail.com`
- Password: `lzevtyxurfrapoiw`

## What Works Locally
✅ Admin login authentication
✅ Dashboard with real data
✅ Product management
✅ Order management
✅ All CRUD operations

## Troubleshooting

### Backend Issues
- Make sure MongoDB is running
- Check if port 8000 is free
- Verify .env file exists

### Frontend Issues
- Make sure backend is running on port 8000
- Check if port 5174 is free
- Clear browser cache

### Database Issues
- Start MongoDB service
- Check MongoDB connection string
- Create database if needed

## Development URLs
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:5174
- Health Check: http://localhost:8000/health

## API Endpoints
- POST /api/auth/adminlogin - Admin login
- GET /api/user/getadmin - Get admin data
- GET /api/order/dashboard-stats - Dashboard statistics
- GET /api/product - Get products
- POST /api/product - Create product
- GET /api/order - Get orders
- PUT /api/order/:id - Update order

## Notes
- Backend uses MongoDB for data persistence
- Frontend uses Vite for development
- Hot reload enabled for both frontend and backend
- CORS configured for localhost development
