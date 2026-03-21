# 🔒 Chapter 5: Integration & Security Architecture

This chapter details the backend infrastructure of the VEBStore project, including secure authentication, payment integration, and the asset pipeline.

## 5.1 Backend Infrastructure (Node.js & Express)
The backend is structured into specialized routes and controllers to ensure modularity and scalability.

### 5.1.1 Authentication & Security Protocols (authController.js)
- **JWT (JSON Web Tokens)**: Used for stateless, role-based authentication.
- **Bcrypt.js**: Industry-standard password hashing before database commits.
- **CORS (Cross-Origin Resource Sharing)**: Restricted to trusted domains (Netlify & Localhost).
- **Cookie Security**: HTTP-only cookies for session token storage to prevent XSS.

### 5.1.2 Database Management (db.js & Mongoose)
- **Singleton Pattern**: A single connection instance is shared across the application.
- **Fail-Safe Connection**: Automated retry logic for MongoDB Atlas connections.
- **Mongoose Middleware**: Pre-save hooks for data validation (Email, Phone format).

## 5.2 Third-Party Integrations
### 5.2.1 Payment Gateway (Razorpay)
- **Razorpay Orders API**: Generates secure pre-orders for the frontend.
- **Webhook-less Verification**: Direct SHA-256 signature verification for transaction integrity.
- **Refund-Ready Logs**: Stores payment IDs for future refund or matching tasks.

### 5.2.2 Asset Storage Pipeline (Cloudinary)
- **Automated Compression**: Images are compressed on upload to ensure fast loading times.
- **Global CDN Delivery**: Assets are served from the nearest Cloudinary node for low latency.
- **Multi-slot Multer Middleware**: Handles parallel file uploads for product imagery.

### 5.2.3 Communication Service (Nodemailer)
- **Transactional Emails**: Automated order confirmation emails with itemized details.
- **Security Alerts**: Instant high-entropy OTPs for password recovery.
- **Admin Notifications**: (Planned) Alerts for high-priority return requests.

## 5.3 Security Best Practices
- **Environment Isolation**: Sensitive keys (DB URI, API Secrets) are never hardcoded.
- **Input Sanitization**: Built-in Express and Mongoose sanitizers prevent NoSQL injection.
- **Rate Limiting**: (Conceptual) Protection against brute-force login attempts.

---
*VEBStore · Final Year Project Documentation Series*
