import express from 'express';
import { getAdminBrief } from '../controller/adminStatsController.js';

const adminRoutes = express.Router();

adminRoutes.get('/stats', getAdminBrief);
adminRoutes.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });
    const { sendSubscriptionEmail } = await import('../utils/emailService.js');
    await sendSubscriptionEmail(email);
    res.json({ success: true, message: "Subscribed! Check your email." });
});

export default adminRoutes;
