# Admin Login Troubleshooting Guide

## Current Configuration
- **Email**: `bhargavisurampudi1@gmail.com`
- **Password**: `bhargavi10`

## Debugging Steps

### 1. Check Browser Console
Open browser dev tools (F12) and check:
- Console tab for frontend debug logs
- Network tab for API requests
- Look for "Frontend - Sending login request" messages

### 2. Check Backend Logs
Your backend should show:
- "Admin login attempt:" messages
- Email and password match status
- Any environment variable overrides

### 3. Verify Backend URL
Make sure your admin panel is connecting to the correct backend:
1. Check browser console for `serverUrl` value
2. Should be your deployed backend URL (not localhost)
3. Test backend health: `https://your-backend-url.vercel.app/health`

### 4. Common Issues

#### CORS Errors
- Backend must include Netlify domain in CORS origins
- Check for CORS errors in browser console

#### Environment Variables
Backend might have different admin credentials set:
```
ADMIN_LOGIN_EMAIL=bhargavisurampudi1@gmail.com
ADMIN_LOGIN_PASSWORD=bhargavi10
```

#### Network Issues
- Backend URL might be incorrect
- Backend might not be deployed/running
- Firewall blocking requests

### 5. Test with Simple Server
For quick testing, you can run the simple server:
```bash
cd backend
node simple-server.js
```
Then update admin panel to use `http://localhost:8000`

### 6. Verify Exact Credentials
Ensure no extra spaces or characters:
- Email: `bhargavisurampudi1@gmail.com` (28 chars)
- Password: `bhargavi10` (10 chars)

### 7. Check Production vs Development
- Development: Uses fallback credentials in code
- Production: Uses environment variables if set

## What to Check First
1. Browser console logs (Frontend debug)
2. Backend logs (Backend debug)
3. Network tab for failed requests
4. Backend health endpoint

## If Still Failing
1. Share browser console logs
2. Share backend logs
3. Check if backend URL is accessible
4. Verify environment variables on deployment platform
