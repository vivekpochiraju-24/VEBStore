import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// ============================================================
// BREVO HTTP API EMAIL SERVICE
// Uses HTTPS (port 443) — works on ALL hosting platforms
// including Render free tier which BLOCKS all SMTP ports
// ============================================================

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER_EMAIL = process.env.EMAIL_USER || 'vivekpochiraju@gmail.com';
const SENDER_NAME = 'VEBStore';

const sendBrevoEmail = async ({ to, subject, html, text }) => {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        console.warn('[EMAIL] ⚠️ BREVO_API_KEY not set. Add it to Render Environment Variables.');
        throw new Error('Email service not configured. Please add BREVO_API_KEY to environment variables.');
    }

    const payload = {
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text || subject,
    };

    try {
        const response = await axios.post(BREVO_API_URL, payload, {
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            timeout: 15000,
        });
        console.log(`[EMAIL] ✅ Sent via Brevo HTTP API to ${to} — MessageId: ${response.data?.messageId}`);
        return response.data;
    } catch (err) {
        const errMsg = err.response?.data?.message || err.message;
        console.error(`[EMAIL] ❌ Brevo API Error: ${errMsg}`);
        throw new Error(errMsg);
    }
};

// Kept for backward compatibility
export const getTransporter = () => null;
export const resetTransporter = () => true;

// ============================================================
// ORDER CONFIRMATION EMAIL
// ============================================================
export const sendOrderEmail = async (email, orderData) => {
    const { _id, items, amount, address, paymentMethod } = orderData;

    const html = `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);border:1px solid #f1f5f9;">
        <div style="background:#0f172a;padding:40px 0;text-align:center;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr><td align="center" style="background:#00d4aa;width:60px;height:60px;border-radius:50%;vertical-align:middle;">
                    <div style="color:#0f172a;font-size:30px;font-weight:bold;line-height:60px;">✓</div>
                </td></tr>
            </table>
            <h1 style="color:#fff;margin:15px 0 0;font-size:28px;font-weight:800;">VEB<span style="color:#00d4aa;">Store</span></h1>
            <div style="margin-top:10px;display:inline-block;padding:4px 12px;background:rgba(255,255,255,0.1);border-radius:4px;">
                <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Status: <strong>Order Placed</strong></span>
            </div>
        </div>
        <div style="padding:40px 30px;">
            <h2 style="color:#0f172a;margin:0 0 10px;font-size:20px;font-weight:800;">Hi ${address?.firstName || 'Customer'},</h2>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 30px;">We're getting your order ready to be shipped. We will notify you when it has been sent.</p>
            <div style="background:#f8fafc;padding:24px;border-radius:16px;margin-bottom:30px;">
                <h3 style="margin:0 0 16px;color:#0f172a;font-size:14px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e2e8f0;padding-bottom:12px;">Order Summary (#${_id.toString().slice(-6)})</h3>
                <table style="width:100%;border-collapse:collapse;">
                    ${items.map(item => `
                        <tr>
                            <td style="padding:8px 0;font-size:14px;color:#475569;"><strong>${item.quantity}x</strong> ${item.name} (${item.size})</td>
                            <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:bold;text-align:right;">₹${item.price}</td>
                        </tr>`).join('')}
                    <tr><td colspan="2" style="padding-top:16px;border-top:1px dashed #e2e8f0;">
                        <table style="width:100%;">
                            <tr>
                                <td style="font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;">Total Paid</td>
                                <td style="font-size:24px;color:#0f172a;font-weight:900;text-align:right;">₹${amount}</td>
                            </tr>
                        </table>
                    </td></tr>
                </table>
            </div>
            <table style="width:100%;margin-bottom:30px;">
                <tr>
                    <td style="width:50%;vertical-align:top;padding-right:15px;">
                        <h4 style="margin:0 0 8px;color:#0f172a;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Payment Method</h4>
                        <div style="display:inline-block;padding:4px 10px;background:#f1f5f9;border-radius:6px;font-size:12px;font-weight:800;color:#334155;text-transform:uppercase;">
                            ${paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                        </div>
                    </td>
                    <td style="width:50%;vertical-align:top;">
                        <h4 style="margin:0 0 8px;color:#0f172a;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Shipping To</h4>
                        <p style="color:#64748b;font-size:13px;line-height:1.5;margin:0;">
                            <strong>${address?.firstName} ${address?.lastName}</strong><br/>
                            ${address?.street}, ${address?.city}<br/>
                            ${address?.state} ${address?.pinCode}
                        </p>
                    </td>
                </tr>
            </table>
            <div style="text-align:center;margin-top:40px;">
                <a href="https://vebstore-frontend.onrender.com/order" style="display:inline-block;background:#0f172a;color:#fff;padding:16px 40px;text-decoration:none;border-radius:12px;font-weight:700;font-size:15px;">Track Order Details</a>
            </div>
        </div>
        <div style="background:#f8fafc;padding:24px 30px;text-align:center;border-top:1px solid #f1f5f9;">
            <p style="color:#64748b;font-size:12px;margin:0;">This email was sent automatically. Please do not reply.</p>
            <p style="color:#94a3b8;font-size:12px;margin:8px 0 0;">© ${new Date().getFullYear()} VEBStore. Premium Fashion & Style.</p>
        </div>
    </div>`;

    await sendBrevoEmail({
        to: email,
        subject: `Order Confirmation - #${_id.toString().slice(-6)}`,
        html,
        text: `Hi ${address?.firstName}, your VEBStore order #${_id.toString().slice(-6)} has been placed. Total: ₹${amount}`,
    });
};

// ============================================================
// CANCELLATION EMAIL
// ============================================================
export const sendCancelEmail = async (email, orderData) => {
    const { _id, paymentMethod, amount } = orderData;
    const isOnline = paymentMethod?.toLowerCase() !== 'cod';

    const html = `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);border:1px solid #f1f5f9;">
        <div style="background:#fef2f2;padding:40px 30px;text-align:center;">
            <div style="width:50px;height:50px;background:#ef4444;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:15px;">
                <span style="color:#fff;font-size:24px;">✕</span>
            </div>
            <h1 style="color:#991b1b;margin:0;font-size:24px;font-weight:800;">Order Cancelled</h1>
            <p style="color:#b91c1c;margin:5px 0 0;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">ID: #${_id.toString().slice(-6)}</p>
        </div>
        <div style="padding:40px 30px;">
            <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">Your cancellation request has been processed successfully.</p>
            ${isOnline ? `
            <div style="background:#f8fafc;padding:24px;border-radius:12px;border-left:4px solid #3b82f6;margin-bottom:30px;">
                <h4 style="margin:0 0 8px;color:#0f172a;font-size:14px;text-transform:uppercase;">Refund Status</h4>
                <p style="color:#475569;font-size:14px;line-height:1.5;margin:0;">Since you paid via <strong>${paymentMethod}</strong>, your refund of <strong>₹${amount}</strong> will be processed back within 5-7 business days.</p>
            </div>` : `<p style="color:#64748b;font-size:14px;">Since this was a COD order, no payment was taken and no refund is required.</p>`}
            <div style="text-align:center;margin-top:30px;">
                <a href="https://vebstore-frontend.onrender.com" style="color:#3b82f6;font-weight:bold;text-decoration:none;">Continue Shopping →</a>
            </div>
        </div>
        <div style="background:#f8fafc;padding:24px;text-align:center;border-top:1px solid #f1f5f9;">
            <p style="color:#94a3b8;font-size:11px;">© ${new Date().getFullYear()} VEBStore Support.</p>
        </div>
    </div>`;

    await sendBrevoEmail({
        to: email,
        subject: `Order Cancelled - #${_id.toString().slice(-6)}`,
        html,
        text: `Your VEBStore order #${_id.toString().slice(-6)} has been cancelled.`,
    });
};

// ============================================================
// OTP EMAIL
// ============================================================
export const sendOtpEmail = async (email, otp) => {
    const html = `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:500px;margin:0 auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);border:1px solid #f1f5f9;">
        <div style="background:#0f172a;padding:30px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">VEB<span style="color:#00d4aa;">Store</span></h1>
            <p style="color:#94a3b8;margin:5px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Identity Verification</p>
        </div>
        <div style="padding:40px 30px;text-align:center;">
            <div style="display:inline-block;padding:12px 24px;background:#f0fdf4;border-radius:12px;margin-bottom:24px;">
                <span style="color:#16a34a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Security Token</span>
            </div>
            <h2 style="color:#0f172a;margin:0 0 10px;font-size:18px;">Verify Your Email</h2>
            <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 30px;">Use the code below to complete your verification. Valid for 10 minutes.</p>
            <div style="background:#f8fafc;padding:30px;border-radius:16px;border:1px dashed #e2e8f0;">
                <h1 style="color:#0f172a;font-size:42px;font-weight:900;letter-spacing:8px;margin:0;">${otp}</h1>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin-top:30px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #f1f5f9;">
            <p style="color:#94a3b8;font-size:11px;margin:0;">© ${new Date().getFullYear()} VEBStore. Secure & Trusted.</p>
        </div>
    </div>`;

    await sendBrevoEmail({
        to: email,
        subject: `Your VEBStore Verification Code: ${otp}`,
        html,
        text: `Your VEBStore OTP is: ${otp}. Valid for 10 minutes.`,
    });
};

// ============================================================
// TRACKING EMAIL
// ============================================================
export const sendTrackingEmail = async (email, orderData, status) => {
    const { _id, items, address } = orderData;

    let statusColor = '#3b82f6', icon = '🚚', message = 'Your order is progressing!';
    if (status === 'Packing') { statusColor = '#f59e0b'; icon = '📦'; message = 'We are currently packing your items.'; }
    else if (status === 'Shipped' || status === 'Out for delivery') { statusColor = '#8b5cf6'; icon = '🚀'; message = 'Your order has been shipped and is on its way!'; }
    else if (status === 'Delivered') { statusColor = '#10b981'; icon = '🎉'; message = 'Your order has been delivered! Enjoy your items.'; }

    const html = `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);border:1px solid #f1f5f9;">
        <div style="background:#0f172a;padding:40px 30px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">VEB<span style="color:#00d4aa;">Store</span></h1>
            <p style="color:#94a3b8;margin:10px 0 0;font-size:14px;text-transform:uppercase;letter-spacing:2px;">Order Tracking Update</p>
        </div>
        <div style="padding:40px 30px;">
            <h2 style="color:#0f172a;margin:0 0 10px;font-size:20px;">Hi ${address?.firstName || 'Customer'},</h2>
            <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 30px;">${message}</p>
            <div style="background:${statusColor}15;border-left:4px solid ${statusColor};padding:20px;border-radius:0 8px 8px 0;margin-bottom:30px;">
                <p style="margin:0;font-size:14px;color:#64748b;text-transform:uppercase;font-weight:bold;letter-spacing:1px;">Current Status</p>
                <h3 style="margin:5px 0 0;color:${statusColor};font-size:24px;">${icon} ${status}</h3>
            </div>
            <div style="background:#f8fafc;padding:24px;border-radius:12px;margin-bottom:30px;">
                <h4 style="margin:0 0 16px;color:#0f172a;font-size:16px;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">Order #${_id.toString().slice(-6)}</h4>
                ${items.map(item => `<div style="color:#475569;font-size:14px;margin-bottom:8px;"><strong>${item.quantity}x</strong> ${item.name}</div>`).join('')}
            </div>
            <div style="text-align:center;margin-top:40px;">
                <a href="https://vebstore-frontend.onrender.com/order" style="display:inline-block;background:#0f172a;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">View Full Tracking</a>
            </div>
        </div>
        <div style="background:#f8fafc;padding:24px 30px;text-align:center;border-top:1px solid #f1f5f9;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} VEBStore. Premium Fashion & Style.</p>
        </div>
    </div>`;

    await sendBrevoEmail({
        to: email,
        subject: `${icon} Order Update: ${status} - #${_id.toString().slice(-6)}`,
        html,
        text: `VEBStore Order Update: Your order #${_id.toString().slice(-6)} status is now "${status}".`,
    });
};

// ============================================================
// SUBSCRIPTION / WELCOME EMAIL
// ============================================================
export const sendSubscriptionEmail = async (email) => {
    const html = `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8fafc;padding:40px 20px;">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.06);">
            <div style="background:#0f172a;padding:60px 40px;text-align:center;">
                <div style="color:#fff;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:4px;margin-bottom:20px;opacity:0.6;">Welcome to the Elite</div>
                <h1 style="color:#fff;margin:0;font-size:48px;font-weight:900;line-height:1.1;letter-spacing:-2px;">UNFOLD YOUR<br/><span style="color:#00d4aa;">REWARD.</span></h1>
            </div>
            <div style="padding:50px 40px;text-align:center;">
                <p style="color:#475569;font-size:18px;line-height:1.6;margin-bottom:35px;font-weight:500;">Thank you for joining our exclusive circle. Enjoy a private discount on your next purchase.</p>
                <div style="background:#f1f5f9;border-radius:20px;padding:30px;border:2px dashed #cbd5e1;margin-bottom:40px;">
                    <div style="color:#64748b;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">Your Exclusive Access Code</div>
                    <div style="color:#0f172a;font-size:42px;font-weight:900;margin-bottom:5px;">WELCOME20</div>
                    <div style="color:#00d4aa;font-size:16px;font-weight:700;">20% OFF ALL COLLECTIONS</div>
                </div>
                <a href="https://vebstore-frontend.onrender.com/products" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:20px 45px;border-radius:14px;font-weight:800;font-size:16px;box-shadow:0 4px 15px rgba(15,23,42,0.25);">BROWSE COLLECTIONS</a>
                <div style="margin-top:45px;padding-top:40px;border-top:1px solid #f1f5f9;">
                    <p style="color:#94a3b8;font-size:13px;line-height:1.6;">Enjoy early access to new drops, priority customer support, and members-only flash sales.</p>
                </div>
            </div>
            <div style="background:#f8fafc;padding:30px;text-align:center;border-top:1px solid #f1f5f9;">
                <p style="color:#64748b;font-size:11px;margin:0;font-weight:600;">© 2026 VEBStore Global Hub • India</p>
            </div>
        </div>
    </div>`;

    await sendBrevoEmail({
        to: email,
        subject: '💎 Welcome to VEBStore Elite — Your 20% Reward Inside',
        html,
        text: `Welcome to VEBStore! Use code WELCOME20 for 20% off all collections at https://vebstore-frontend.onrender.com/products`,
    });
};
