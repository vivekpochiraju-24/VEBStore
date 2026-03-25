import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOrderEmail = async (email, orderData) => {
    const { _id, items, amount, address } = orderData;
    const itemsHtml = items.map(item => `<li>${item.name} x ${item.quantity} (Size: ${item.size}) - ₹${item.price}</li>`).join('');

    const mailOptions = {
        from: `"VEBStore Orders" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Confirmation - #${_id.toString().slice(-6)}`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;">
                
                <!-- Premium Header -->
                <div style="background-color: #0f172a; padding: 40px 0; text-align: center;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                            <td align="center" style="background-color: #00d4aa; width: 60px; height: 60px; border-radius: 50%; vertical-align: middle;">
                                <div style="color: #0f172a; font-size: 30px; font-weight: bold; line-height: 60px; text-align: center;">✓</div>
                            </td>
                        </tr>
                    </table>
                    <h1 style="color: #ffffff; margin: 15px 0 0 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">VEB<span style="color: #00d4aa;">Store</span></h1>
                    <div style="margin-top: 10px; display: inline-block; padding: 4px 12px; background-color: rgba(255,255,255,0.1); border-radius: 4px;">
                        <span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Status: <strong>Order Placed</strong></span>
                    </div>
                </div>

                <!-- Content Body -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #0f172a; margin: 0 0 10px 0; font-size: 20px; font-weight: 800;">Hi ${address.firstName},</h2>
                    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">We're getting your order ready to be shipped. We will notify you when it has been sent.</p>

                    <!-- Order Summary Table -->
                    <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin-bottom: 30px;">
                        <h3 style="margin: 0 0 16px 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">Order Summary (#${_id.toString().slice(-6)})</h3>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            ${items.map(item => `
                                <tr>
                                    <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                                        <strong>${item.quantity}x</strong> ${item.name} (${item.size})
                                    </td>
                                    <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: bold; text-align: right;">
                                        ₹${item.price}
                                    </td>
                                </tr>
                            `).join('')}
                            <tr>
                                <td colspan="2" style="padding-top: 16px; border-top: 1px dashed #e2e8f0;">
                                    <table style="width: 100%;">
                                        <tr>
                                            <td style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Total Paid</td>
                                            <td style="font-size: 24px; color: #0f172a; font-weight: 900; text-align: right;">₹${amount}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- Payment & Shipping Details -->
                    <table style="width: 100%; margin-bottom: 30px;">
                        <tr>
                            <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                                <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Payment Method</h4>
                                <div style="display: inline-block; padding: 4px 10px; background-color: #f1f5f9; border-radius: 6px; font-size: 12px; font-weight: 800; color: #334155; text-transform: uppercase;">
                                    ${orderData.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                                </div>
                            </td>
                            <td style="width: 50%; vertical-align: top;">
                                <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Shipping To</h4>
                                <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
                                    <strong>${address.firstName} ${address.lastName}</strong><br/>
                                    ${address.street}, ${address.city}<br/>
                                    ${address.state} ${address.pinCode}
                                </p>
                            </td>
                        </tr>
                    </table>

                    <!-- Call to Action -->
                    <div style="text-align: center; margin-top: 40px;">
                        <a href="http://localhost:5173/order" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);">Track Order Details</a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
                    <p style="color: #64748b; font-size: 12px; margin: 0;">This email was sent automatically. Please do not reply directly to this message.</p>
                    <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0 0;">&copy; ${new Date().getFullYear()} VEBStore. Premium Fashion & Style.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] 📧 Sent Order Confirmation to ${email}`);
    } catch (error) {
        console.warn(`[EMAIL SIMULATION] 📧 Could not securely connect to SMTP. (Check ADMIN_PASSWORD in .env). Simulated Confirmation to ${email}:\n   SUBJECT: ${mailOptions.subject}\n   TOTAL: ₹${amount}\n`);
    }
};

export const sendCancelEmail = async (email, orderData) => {
    const { _id, paymentMethod, amount } = orderData;
    const isOnline = paymentMethod.toLowerCase() !== 'cod';

    const mailOptions = {
        from: `"VEBStore Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Cancelled - #${_id.toString().slice(-6)}`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;">
                <div style="background-color: #fef2f2; padding: 40px 30px; text-align: center;">
                    <div style="width: 50px; height: 50px; background-color: #ef4444; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                        <span style="color: #ffffff; font-size: 24px;">✕</span>
                    </div>
                    <h1 style="color: #991b1b; margin: 0; font-size: 24px; font-weight: 800;">Order Cancelled</h1>
                    <p style="color: #b91c1c; margin: 5px 0 0 0; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">ID: #${_id.toString().slice(-6)}</p>
                </div>
                <div style="padding: 40px 30px;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">Your cancellation request has been processed successfully.</p>
                    
                    ${isOnline ? `
                    <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border-left: 4px solid #3b82f6; margin-bottom: 30px;">
                        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px; text-transform: uppercase;">Refund Status</h4>
                        <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0;">Since you paid via <strong>${paymentMethod}</strong>, your refund of <strong>₹${amount}</strong> will be processed back to your original source within 5-7 business days.</p>
                    </div>
                    ` : `
                    <p style="color: #64748b; font-size: 14px;">Since this was a COD order, no payment was taken and no refund is required.</p>
                    `}
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:5173" style="color: #3b82f6; font-weight: bold; text-decoration: none;">Continue Shopping &rarr;</a>
                    </div>
                </div>
                <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;">
                    <p style="color: #94a3b8; font-size: 11px;">&copy; ${new Date().getFullYear()} VEBStore Support.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] 📧 Sent Cancellation to ${email}`);
    } catch (error) {
        console.warn(`[EMAIL SIMULATION] 📧 Could not securely connect to SMTP. (Check ADMIN_PASSWORD in .env). Simulated Cancel to ${email}:\n   SUBJECT: ${mailOptions.subject}\n`);
    }
};

export const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: `"VEBStore Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Verification Code: ${otp}`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;">
                <div style="background-color: #0f172a; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">VEB<span style="color: #00d4aa;">Store</span></h1>
                    <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Identity Verification</p>
                </div>
                <div style="padding: 40px 30px; text-align: center;">
                    <div style="display: inline-block; padding: 12px 24px; background-color: #f0fdf4; border-radius: 12px; margin-bottom: 24px;">
                        <span style="color: #16a34a; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Security Token</span>
                    </div>
                    <h2 style="color: #0f172a; margin: 0 0 10px 0; font-size: 18px;">Verify Your Email</h2>
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">Use the code below to complete your verification. This code is valid for 10 minutes.</p>
                    
                    <div style="background-color: #f8fafc; padding: 30px; border-radius: 16px; border: 1px dashed #e2e8f0;">
                        <h1 style="color: #0f172a; font-size: 42px; font-weight: 900; letter-spacing: 8px; margin: 0;">${otp}</h1>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">If you didn't request this, please ignore this email or contact support.</p>
                </div>
                <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} VEBStore. Secure & Trusted.</p>
                </div>
            </div>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("OTP Email send error:", error);
        throw error; // Make sure the controller knows it failed to send
    }
};

export const sendTrackingEmail = async (email, orderData, status) => {
    const { _id, items, address, date } = orderData;
    
    // Status visual mapping
    let statusColor = "#3b82f6"; // Blue
    let icon = "🚚";
    let message = "Your order is progressing!";
    
    if (status === 'Packing') {
        statusColor = "#f59e0b"; // Orange
        icon = "📦";
        message = "We are currently packing your items.";
    } else if (status === 'Shipped' || status === 'Out for delivery') {
        statusColor = "#8b5cf6"; // Purple
        icon = "🚀";
        message = "Your order has been shipped and is on its way!";
    } else if (status === 'Delivered') {
        statusColor = "#10b981"; // Green
        icon = "🎉";
        message = "Your order has been delivered! Enjoy your items.";
    }

    const mailOptions = {
        from: `"VEBStore Tracking" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `${icon} Order Update: ${status} - #${_id.toString().slice(-6)}`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;">
                
                <!-- Premium Header -->
                <div style="background-color: #0f172a; padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">VEB<span style="color: #00d4aa;">Store</span></h1>
                    <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Order Tracking Update</p>
                </div>

                <!-- Content Body -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #0f172a; margin: 0 0 10px 0; font-size: 20px;">Hi ${address.firstName},</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">${message}</p>

                    <!-- Status Highlight Box -->
                    <div style="background-color: ${statusColor}15; border-left: 4px solid ${statusColor}; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                        <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Current Status</p>
                        <h3 style="margin: 5px 0 0 0; color: ${statusColor}; font-size: 24px;">${icon} ${status}</h3>
                    </div>

                     <!-- Order Details -->
                    <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 30px;">
                        <h4 style="margin: 0 0 16px 0; color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Order Details (#${_id.toString().slice(-6)})</h4>
                        
                        <div style="margin-bottom: 16px;">
                            ${items.map(item => `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #475569; font-size: 14px;">
                                    <span><strong>${item.quantity}x</strong> ${item.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Call to Action -->
                    <div style="text-align: center; margin-top: 40px;">
                        <a href="http://localhost:5173/order" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); transition: background-color 0.2s;">View Full Tracking</a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
                    <p style="color: #64748b; font-size: 12px; margin: 0;">This email was sent automatically. Please do not reply directly to this message.</p>
                    <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0 0;">&copy; ${new Date().getFullYear()} VEBStore. Premium Fashion & Style.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] 📧 Sent tracking update to ${email}: Status ${status}`);
    } catch (error) {
        console.warn(`[EMAIL SIMULATION] 📧 Could not securely connect to SMTP, but the following Order tracking email was structurally generated for ${email}:\n   SUBJECT: ${mailOptions.subject}\n   STATUS: ${status}\n`);
    }
};

// --- Subscription Email ---
export const sendSubscriptionEmail = async (email) => {
    try {
        const mailOptions = {
            from: `"VEBStore Management" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '👑 Exclusive: You\'re In! Your 20% Welcome Reveal Inside',
            html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06);">
                    
                    <!-- Hero Section -->
                    <div style="background-color: #0f172a; padding: 60px 40px; text-align: center; position: relative;">
                        <div style="color: #ffffff; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 20px; opacity: 0.6;">Welcome to the Elite</div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 48px; font-weight: 900; line-height: 1.1; letter-spacing: -2px;">UNFOLD YOUR<br/><span style="color: #00d4aa;">REWARD.</span></h1>
                    </div>

                    <div style="padding: 50px 40px; text-align: center;">
                        <p style="color: #475569; font-size: 18px; line-height: 1.6; margin-bottom: 35px; font-weight: 500;">Thank you for joining our exclusive circle. As a new member of the VEBStore community, we are delighted to offer you a private discount on your next purchase.</p>
                        
                        <!-- Discount Card -->
                        <div style="background-color: #f1f5f9; border-radius: 20px; padding: 30px; border: 2px dashed #cbd5e1; margin-bottom: 40px;">
                            <div style="color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Your Exclusive Access Code</div>
                            <div style="color: #0f172a; font-size: 42px; font-weight: 900; margin-bottom: 5px;">WELCOME20</div>
                            <div style="color: #00d4aa; font-size: 16px; font-weight: 700;">20% OFF ALL COLLECTIONS</div>
                        </div>

                        <a href="https://vebstore.netlify.app/collections" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 20px 45px; border-radius: 14px; font-weight: 800; font-size: 16px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(15, 23, 42, 0.25);">BROWSE COLLECTIONS</a>
                        
                        <div style="margin-top: 45px; padding-top: 40px; border-top: 1px solid #f1f5f9;">
                            <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">Enjoy early access to new drops, priority customer support, and members-only flash sales.</p>
                        </div>
                    </div>

                    <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #f1f5f9;">
                        <p style="color: #64748b; font-size: 11px; margin: 0; font-weight: 600;">&copy; 2026 VEBStore Global Hub • Mumbai, India</p>
                    </div>
                </div>
            </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] 📧 Welcome Subscription sent to ${email}`);
    } catch (error) {
        console.error('Subscription Email Error:', error);
    }
};
