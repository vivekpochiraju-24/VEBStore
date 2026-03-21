# VEBStore Deployment Guide

## Admin Panel Netlify Deployment

### Issue Fixed
The admin panel was failing to login on Netlify because it was trying to connect to `localhost:8000` instead of the deployed backend.

### Changes Made

1. **Updated `.env` file:**
   ```
   VITE_BACKEND_URL = "https://your-backend-url.vercel.app"
   ```

2. **Updated `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [build.environment]
     VITE_BACKEND_URL = "https://your-backend-url.vercel.app"

   [[redirects]]
     from = "/api/*"
     to = "https://your-backend-url.vercel.app/api/:splat"
     status = 200
     force = true

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Updated `AuthContext.jsx` fallback URL**

### Before Deploying to Netlify

1. **Replace `https://your-backend-url.vercel.app`** with your actual deployed backend URL in:
   - `.env` file
   - `netlify.toml` file (2 places)
   - `src/context/AuthContext.jsx` fallback

2. **Backend Environment Variables:**
   Ensure your backend has these environment variables set:
   ```
   ADMIN_LOGIN_EMAIL=bhargavisurampudi1@gmail.com
   ADMIN_LOGIN_PASSWORD=bhargavi10
   ```
   Or customize with your own credentials.

3. **Default Admin Credentials:**
   - Email: `bhargavisurampudi1@gmail.com`
   - Password: `bhargavi10`

### Deployment Steps

1. Push changes to your repository
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard:
   - `VITE_BACKEND_URL=https://your-backend-url.vercel.app`
4. Deploy

### Cookie Configuration
The backend now sets secure cookies in production:
- `secure: true` when `NODE_ENV=production`
- `httpOnly: true`
- `sameSite: "Strict"`

### Troubleshooting

If login still fails:
1. Check browser console for CORS errors
2. Verify backend URL is correct and accessible
3. Check Netlify function logs
4. Ensure backend is deployed and running
5. Verify environment variables are set correctly in Netlify dashboard
