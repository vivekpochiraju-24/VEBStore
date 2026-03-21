# ✉️ Chapter 7: Transactional Communication — Nodemailer

This chapter details the specialized email notification system designed for VEBStore, ensuring a high-touch customer lifecycle through automated communication.

## 7.1 Communication Strategy
VEBStore utilizes **Nodemailer** integrated with **Gmail SMTP** to provide real-time updates for critical account and order events.

### 7.1.1 Email Engine Configuration (emailService.js)
- **SMTP Protocol**: Secure connection established via Google SMTPS (Port 465/587).
- **App Password Security**: Utilizes dedicated 2FA-secured App Passwords to bypass traditional login risks.
- **Dynamic Templating**: HTML-based emails with embedded CSS for a premium, branded look across all devices.

## 7.2 Core Communication Workflows
### 7.2.1 Order Confirmation Lifecycle
Scheduled immediately upon successful checkout (COD or Razorpay):
- **Itemized Breakdown**: High-contrast list of products, sizes, and quantities.
- **Price Transparency**: Clear display of subtotal and total amount paid.
- **Visual Branding**: Uses the 'Fashion & Style' header for brand consistency.

### 7.2.2 Live Tracking Updates
Triggered when an Administrator updates the order status in the Management Hub:
- **Status Badges**: Color-coded headers (Blue for Processing, Purple for Shipped, Green for Delivered).
- **Interactive Links**: 'Track My Order' buttons that redirect users directly to their profile history.

### 7.2.3 Security & Retrieval (OTPs)
Dispatched for account verification and password resets:
- **High-Entropy Keys**: Generates 6-digit numeric codes with 10-minute expiration.
- **Security Footer**: Includes standard technical warnings and copy-protection measures.

## 7.3 Operational Resilience
- **Verification on Startup**: The backend performs a `transporter.verify()` check on every launch.
- **Simulation Logs**: (Development mode) Falling back to detailed console logs if SMTP connectivity is interrupted, ensuring no data loss during local testing.

---
*VEBStore · Final Year Project Documentation Series*
