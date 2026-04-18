import nodemailer from 'nodemailer';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Create SMTP Transporter as fallback
const smtpTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
       rejectUnauthorized: false
    }
});

// Hybrid Email Sender (Tries Brevo API, falls back to SMTP)
const sendEmail = async (options) => {
    try {
        const apiKey = process.env.BREVO_API_KEY;
        
        // Strategy 1: Brevo API (Preferred for Cloud/Production)
        if (apiKey && apiKey !== 'your_brevo_api_key') {
            const data = {
                sender: { name: "VEBStore Official", email: process.env.EMAIL_USER || "vivekpochiraju@gmail.com" },
                to: [{ email: options.to }],
                subject: options.subject,
                htmlContent: options.html
            };

            try {
                const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
                    headers: {
                        'api-key': apiKey,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`[EMAIL] 🚀 Brevo Success: Sent to ${options.to}`);
                return response.data;
            } catch (apiError) {
                console.warn(`[EMAIL] ⚠️ Brevo API failed: ${apiError.message}. Falling back to SMTP...`);
            }
        }

        // Strategy 2: SMTP Fallback (Best for Local/Correct SMTP credentials)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            console.log(`[EMAIL] 📧 Attempting SMTP fallback for ${options.to}...`);
            const mailOptions = {
                from: `"VEBStore Official" <${process.env.EMAIL_USER}>`,
                to: options.to,
                subject: options.subject,
                html: options.html
            };

            const info = await smtpTransporter.sendMail(mailOptions);
            console.log(`[EMAIL] ✅ SMTP Success: ${info.messageId}`);
            return info;
        }

        throw new Error('No valid email configuration available (Missing BREVO_API_KEY or incorrect SMTP credentials)');

    } catch (error) {
        console.error(`[EMAIL ERROR] ❌ Delivery Failed: ${error.message}`);
        throw error;
    }
};

const sendEmailViaBrevo = sendEmail; // Alias for backward compatibility if needed

// ===================================
// Premium Email Template Functions
// ===================================

export const sendOrderEmail = async (email, orderData) => {
    const { _id, items, amount, address } = orderData;
    const mailOptions = {
        to: email,
        subject: `Order Confirmed: #${_id.toString().slice(-6)} - Thank you for your purchase!`,
        html: `
            <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #edf2f7;">
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 50px 30px; text-align: center;">
                    <div style="background-color: #00d4aa; width: 64px; height: 64px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                        <span style="color: #0f172a; font-size: 32px; font-weight: bold;">✓</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800;">VEB<span style="color: #00d4aa;">Store</span></h1>
                    <p style="color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; margin-top: 10px;">Order Confirmation</p>
                </div>
                <div style="padding: 40px 30px;">
                    <h2 style="color: #0f172a; font-size: 24px;">Hi ${address.firstName},</h2>
                    <p style="color: #475569; font-size: 16px;">We've received your order and are preparing it for shipment.</p>
                    <div style="background-color: #f8fafc; border-radius: 18px; border: 1px solid #e2e8f0; padding: 25px; margin-bottom: 40px;">
                        <h3 style="margin: 0 0 20px 0; color: #0f172a; font-size: 14px; text-transform: uppercase;">Your Items</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            ${items.map(item => `
                                <tr>
                                    <td style="padding: 15px 0;">
                                        <div style="color: #0f172a; font-size: 15px; font-weight: 700;">${item.name} (${item.size})</div>
                                        <div style="color: #64748b; font-size: 13px;">Qty: ${item.quantity} • ₹${item.price}</div>
                                    </td>
                                </tr>
                            `).join('')}
                        </table>
                        <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                            <table style="width: 100%;">
                                <tr>
                                    <td style="font-size: 16px; color: #0f172a; font-weight: 800;">Order Total</td>
                                    <td style="font-size: 24px; color: #0f172a; font-weight: 900; text-align: right;">₹${amount}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/order" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 45px; text-decoration: none; border-radius: 14px; font-weight: 800;">Track Your Journey</a>
                    </div>
                </div>
            </div>`
    };
    await sendEmail(mailOptions);
};

export const sendCancelEmail = async (email, orderData) => {
    const { _id, amount } = orderData;
    const mailOptions = {
        to: email,
        subject: `Order Cancelled: #${_id.toString().slice(-6)}`,
        html: `<div style="text-align: center; padding: 50px;">
            <h1 style="color: #ef4444;">Order Cancelled</h1>
            <p>Your order #${_id.toString().slice(-6)} for ₹${amount} has been cancelled.</p>
        </div>`
    };
    await sendEmail(mailOptions);
};

export const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        to: email,
        subject: `Your Verification Code: ${otp}`,
        html: `<div style="text-align: center; padding: 50px; font-family: sans-serif;">
            <h2>Verify Your Email</h2>
            <div style="font-size: 40px; font-weight: bold; margin: 20px; letter-spacing: 5px;">${otp}</div>
            <p>Valid for 10 minutes.</p>
        </div>`
    };
    await sendEmail(mailOptions);
};

export const sendTrackingEmail = async (email, orderData, status) => {
    const { _id } = orderData;
    const mailOptions = {
        to: email,
        subject: `Order Update: ${status}`,
        html: `<div style="text-align: center; padding: 50px;">
            <h2>Order Tracking Update</h2>
            <p>Your order #${_id.toString().slice(-6)} status is now: <b>${status}</b></p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/order">View Details</a>
        </div>`
    };
    await sendEmail(mailOptions);
};

export const sendSubscriptionEmail = async (email) => {
    const mailOptions = {
        to: email,
        subject: '👑 Exclusive Access: You\'re officially in the circle!',
        html: `
            <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 60px 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 30px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);">
                    <div style="background-color: #0f172a; padding: 80px 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 44px; font-weight: 900;">WELCOME TO<br/><span style="color: #00d4aa;">VEBSTORE.</span></h1>
                    </div>
                    <div style="padding: 60px 40px; text-align: center;">
                        <p style="color: #475569; font-size: 18px; font-weight: 500;">Use code <b>VEB2026</b> for 20% off your first order.</p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 22px 55px; border-radius: 16px; font-weight: 800; text-decoration: none;">SHOP NOW</a>
                    </div>
                </div>
            </div>`
    };
    await sendEmail(mailOptions);
};
