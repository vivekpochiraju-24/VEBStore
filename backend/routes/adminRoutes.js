import express from 'express';
import { getAdminBrief } from '../controller/adminStatsController.js';

const adminRoutes = express.Router();

adminRoutes.get('/stats', getAdminBrief);
adminRoutes.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email required" });
        
        // Use a background process for email to avoid blocking the user
        import('../utils/emailService.js').then(({ sendSubscriptionEmail }) => {
            sendSubscriptionEmail(email).catch(e => console.error("Bg Mail Error:", e));
        });

        res.json({ success: true, message: "Subscribed! Check your email." });
    } catch (err) {
        console.error("Sub Route Error:", err);
        res.status(500).json({ success: false, message: "Mail server synchronization error" });
    }
});

export default adminRoutes;
