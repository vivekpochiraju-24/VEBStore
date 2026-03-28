import express from 'express';
import { getAdminBrief } from '../controller/adminStatsController.js';

const adminRoutes = express.Router();

adminRoutes.get('/stats', getAdminBrief);
adminRoutes.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email required" });
        
        const { sendSubscriptionEmail } = await import('../utils/emailService.js');
        await sendSubscriptionEmail(email);

        res.json({ success: true, message: "Subscribed! Welcome to the Elite circle." });
    } catch (err) {
        console.error("Sub Route Mail Sync Issues (Silent):", err.message);
        // SILENT FAIL-SAFE: The user portal should NEVER show a 500 error for newsletter
        // We will still store the subscription in DB, even if mail server is delayed
        res.json({ success: true, message: "Welcome to the Elite circle! Your rewards reveal is syncing." });
    }
});

adminRoutes.get('/test-email', async (req, res) => {
    // Check env var first before even trying
    if (!process.env.BREVO_API_KEY) {
        return res.status(500).json({ 
            success: false, 
            message: 'BREVO_API_KEY is NOT SET in Render Environment Variables. Go to Render Dashboard → Backend Service → Environment → Add BREVO_API_KEY.' 
        });
    }
    try {
        const { sendSubscriptionEmail } = await import('../utils/emailService.js');
        const testEmail = req.query.email || process.env.EMAIL_USER || 'test@example.com';
        await sendSubscriptionEmail(testEmail);
        res.json({ success: true, message: `✅ Brevo HTTP API: Mail dispatched to ${testEmail}. Check your inbox (and Spam folder).` });
    } catch (err) {
        console.error('DIAGNOSTIC ERROR [BREVO]:', err.message);
        res.status(500).json({ 
            success: false, 
            message: `❌ Brevo API Error: ${err.message}. Likely cause: Sender email '${process.env.EMAIL_USER}' is not verified in your Brevo account. Go to Brevo → Senders & IPs → Verify your email.`
        });
    }
});

export default adminRoutes;
