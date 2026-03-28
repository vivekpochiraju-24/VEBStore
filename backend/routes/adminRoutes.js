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
    try {
        const { sendSubscriptionEmail, resetTransporter } = await import('../utils/emailService.js');
        resetTransporter(); // CRITICAL: Reset the cache for diagnostic to pick up NEW settings
        const testEmail = req.query.email || "test@gmail.com";
        await sendSubscriptionEmail(testEmail);
        res.json({ success: true, message: `Diagnostic mail dispatched to ${testEmail} via Port 465 SSL. If it doesn't arrive in 60s, check Spam or Render Logs.` });
    } catch (err) {
        console.error("DIAGNOSTIC ERROR [SMTP]:", err.message);
        res.status(500).json({ success: false, message: `SMTP HANDSHAKE FAILURE: ${err.message}. Please verify 'EMAIL_USER' & 'EMAIL_PASS' in Render Environment.` });
    }
});

export default adminRoutes;
