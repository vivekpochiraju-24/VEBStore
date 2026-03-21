# 🚀 Chapter 8: Final Production Deployment

This chapter details the strategy and implementation of the VEBStore platform across a distributed cloud environment.

## 8.1 Distributed Hosting Strategy
VEBStore uses a specialized hosting approach to maximize performance and scalability.

| Project | Platform | Category | Key Configuration |
| :--- | :--- | :--- | :--- |
| **Frontend** | Netlify | Static / SPA | Base: `/frontend`, Build: `npm run build` |
| **Admin Panel** | Netlify | Static / SPA | Base: `/admin`, Build: `npm run build` |
| **Backend API** | Render / Railway | Node.js Server | Port: 10000 (Env Default), Runtime: Node 20 |
| **Database** | MongoDB Atlas | Managed DB | Cluster: VEBStore, Region: AWS Mumbai |

## 8.2 Production Optimizations (Netlify Fixes)
To prevent common 404 errors in Single Page Applications (SPAs):
- **_redirects File**: Placed in the `public` folder of both `frontend` and `admin` projects.
  - Content: `/* /index.html 200`
- **netlify.toml**: root configuration for automatic monorepo detection.
- **Environment Injection**: Securely injecting Cloudinary and Razorpay keys into the Netlify build process.

## 8.3 Security & Maintenance
- **CORS Protection**: Access restricted specifically to the production Netlify domains.
- **SSL/TLS Termination**: Automatic HTTPS provided by Netlify and Render.
- **Automated CI/CD**: Pushing to the `main` GitHub branch triggers automatic redeployments of both sites.

---
*VEBStore · Final Year Project Documentation Series*
