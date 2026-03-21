import Notification from '../model/notificationModel.js';
import User from '../model/userModel.js';
import admin from 'firebase-admin';

// Initialize Firebase Admin (Only if credentials provided/available)
// This will fail silently or log error if serviceAccount is missing
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount))
        });
    } catch (e) {
        console.log("Firebase Admin already initialized or init error");
    }
}

export const createNotification = async (userId, title, message, type = 'System') => {
    try {
        const notification = new Notification({
            userId,
            title,
            message,
            type
        });
        await notification.save();

        // If user has FCM token and notifications enabled, send push
        const user = await User.findById(userId);
        if (user && user.notification_enabled && user.fcmToken) {
            const payload = {
                notification: {
                    title,
                    body: message
                },
                token: user.fcmToken
            };
            try {
                await admin.messaging().send(payload);
            } catch (err) {
                console.error("FCM Send Error:", err);
            }
        }
        return notification;
    } catch (error) {
        console.error("Notification creation error:", error);
    }
};

export const notifyAllUsers = async (title, message, type = 'Promo') => {
    try {
        const users = await User.find({ notification_enabled: true });
        const notifications = users.map(user => ({
            userId: user._id,
            title,
            message,
            type
        }));
        await Notification.insertMany(notifications);

        // Batch FCM send if needed (complex for mvp, skipping for now)
    } catch (error) {
        console.error("Global notification error:", error);
    }
};
