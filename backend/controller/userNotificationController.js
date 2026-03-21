import Notification from "../model/notificationModel.js";
import User from "../model/userModel.js";

export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.userId; // From isAuth middleware
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markNotificationsRead = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
        res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateNotificationToken = async (req, res) => {
    try {
        const userId = req.userId;
        const { fcmToken, enabled } = req.body;
        await User.findByIdAndUpdate(userId, { 
            fcmToken: fcmToken || "", 
            notification_enabled: enabled 
        });
        res.status(200).json({ message: "Notification preferences updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
