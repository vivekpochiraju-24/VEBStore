import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log("Testing SMTP for:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    logger: true,
    debug: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("❌ verification failed:", error);
    } else {
        console.log("✅ verification successful");
    }
    process.exit();
});
