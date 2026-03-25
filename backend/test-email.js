import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log(`[ENV CHECK] EMAIL_USER: ${process.env.EMAIL_USER}`);
console.log(`[ENV CHECK] EMAIL_PASS: ${process.env.EMAIL_PASS?.slice(0, 4)}... (length: ${process.env.EMAIL_PASS?.length})`);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: `"VEBStore Test" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'VEBStore Email Connection Test 🚀',
    text: 'If you are reading this, your VEBStore email configuration is working perfectly! All order updates and OTPs will now be delivered via this account.',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 2px solid #00d4aa; border-radius: 12px; text-align: center;">
            <h1 style="color: #0f172a;">Success! 🚀</h1>
            <p style="color: #475569; font-size: 16px;">This is a test email from your **VEBStore** project.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #0f172a; font-weight: bold;">Configuration Verified:</p>
                <p style="margin: 5px 0 0 0; color: #64748b;">Sender: ${process.env.EMAIL_USER}</p>
            </div>
            <p style="color: #10b981; font-weight: bold;">Your App Password is working correctly.</p>
        </div>
    `
};

console.log(`[TEST] Attempting to send email to ${process.env.EMAIL_USER}...`);

transporter.sendMail(mailOptions)
    .then(info => {
        console.log('✅ Success! Email sent: ' + info.response);
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Failed! Error details:');
        console.error(error);
        process.exit(1);
    });
