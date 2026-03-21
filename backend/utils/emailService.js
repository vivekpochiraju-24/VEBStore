import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.ADMIN_PASSWORD || process.env.EMAIL_PASS || 'your-app-password'
    }
});

export const sendOrderEmail = async (email, orderData) => {
    const { _id, items, amount, address } = orderData;
    const itemsHtml = items.map(item => `<li>${item.name} x ${item.quantity} (Size: ${item.size}) - ₹${item.price}</li>`).join('');

    const mailOptions = {
        from: '"VEBStore Orders" <orders@vebstore.com>',
        to: email,
        subject: `Order Confirmation - #${_id.toString().slice(-6)}`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;">
                
                <!-- Premium Header -->
                <div style="background-color: #0f172a; padding: 40px 30px; text-align: center;">
                    <div style="width: 50px; height: 50px; background-color: #00d4aa; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                        <span style="color: #0f172a; font-size: 24px;">✓</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">VEB<span style="color: #00d4aa;">Store</span></h1>
                    <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Order Confirmed</p>
                </div>

                <!-- Content Body -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #0f172a; margin: 0 0 10px 0; font-size: 20px;">Hi ${address.firstName},</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">We're getting your order ready to be shipped. We will notify you when it has been sent.</p>

                    <!-- Order Summary Box -->
                    <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 30px;">
                        <h3 style="margin: 0 0 16px 0; color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Order Summary (#${_id.toString().slice(-6)})</h3>
                        <ul style="list-style: none; padding: 0; margin: 0 0 16px 0;">
                            ${items.map(item => `
                                <li style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #475569; font-size: 14px;">
                                    <span>${item.quantity}x ${item.name} (${item.size})</span>
                                    <span style="font-weight: bold;">₹${item.price}</span>
                                </li>
                            `).join('')}
                        </ul>
                        <div style="border-top: 2px dashed #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold;">Total Paid</span>
                            <span style="color: #0f172a; font-size: 20px; font-weight: 900;">₹${amount}</span>
                        </div>
                    </div>

                    <!-- Shipping Address -->
                    <div style="margin-bottom: 30px;">
                        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px; text-transform: uppercase;">Shipping To</h4>
                        <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">
                            ${address.firstName} ${address.lastName}<br/>
                            ${address.street}<br/>
                            ${address.city}, ${address.state} ${address.pinCode}<br/>
                            ${address.country}
                        </p>
                    </div>

                    <!-- Call to Action -->
                    <div style="text-align: center; margin-top: 40px;">
                        <a href="http://localhost:5173/order" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); transition: background-color 0.2s;">Track My Order</a>
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
        from: '"VEBStore Support" <support@vebstore.com>',
        to: email,
        subject: `Order Cancelled - #${_id.toString().slice(-6)}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #ff4444;">Order Cancelled</h2>
                <p>Your order #${_id.toString().slice(-6)} has been cancelled successfully.</p>
                ${isOnline ? `<p style="background: #fff4f4; padding: 10px; border-radius: 5px; border-left: 4px solid #ff4444;"><strong>Refund Update:</strong> Since you paid via ${paymentMethod}, your refund of ₹${amount} will be processed back to your original payment method within 5-7 business days.</p>` : `<p>Since this was a COD order, no refund is required.</p>`}
                <p>We hope to see you again soon!</p>
                <p style="font-size: 12px; color: #777; margin-top: 30px; text-align: center;">&copy; 2026 VEBStore. All rights reserved.</p>
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
        from: '"VEBStore Security" <security@vebstore.com>',
        to: email,
        subject: `Your VEBStore Verification Code: ${otp}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #000; text-align: center;">VEBStore Account Verification</h2>
                <p>Hello,</p>
                <p>We received a request to verify your email address. Here is your one-time password (OTP):</p>
                <div style="background: #f1f1f1; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                    <h1 style="letter-spacing: 5px; color: #000; font-size: 32px; margin: 0;">${otp}</h1>
                </div>
                <p>This code will expire in 10 minutes. Do not share this code with anyone.</p>
                <p style="font-size: 12px; color: #777; margin-top: 30px; text-align: center;">&copy; 2026 VEBStore. All rights reserved.</p>
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
        from: '"VEBStore Tracking" <tracking@vebstore.com>',
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
