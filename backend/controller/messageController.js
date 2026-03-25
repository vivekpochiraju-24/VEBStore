import Message from "../model/messageModel.js";
import { createNotification } from "../utils/notificationService.js";

export const postMessage = async (req, res) => {
    try {
        const { name, email, message, userId } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newMessage = await Message.create({ name, email, message, userId });
        return res.status(201).json({ message: "Message sent successfully!", data: newMessage });
    } catch (error) {
        console.error("postMessage error", error);
        return res.status(500).json({ message: "Failed to send message" });
    }
};

export const getAdminMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch messages" });
    }
};

export const replyToMessage = async (req, res) => {
    try {
        const { id, adminReply } = req.body;
        if (!id || !adminReply) {
            return res.status(400).json({ message: "Reply content and ID required" });
        }
        const updatedMessage = await Message.findByIdAndUpdate(id, { 
            adminReply, 
            status: 'Replied',
            isRead: false,
            repliedAt: Date.now() 
        }, { new: true });

        // Add User Notification if logged in
        if (updatedMessage.userId) {
            createNotification(updatedMessage.userId, "New Message from Admin", `Your query has been answered: "${adminReply.substring(0, 30)}..."`, "Support");
        }

        return res.status(200).json({ message: "Reply sent successfully!", data: updatedMessage });
    } catch (error) {
        return res.status(500).json({ message: "Failed to send reply" });
    }
};

export const getUserMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({ userId }).sort({ createdAt: -1 });
        
        // Mark all as read when they view the page
        await Message.updateMany({ userId, status: 'Replied' }, { isRead: true });
        
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch user messages" });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const { userId } = req.params;
        const count = await Message.countDocuments({ userId, status: 'Replied', isRead: false });
        return res.status(200).json({ count });
    } catch (error) {
        return res.status(500).json({ count: 0 });
    }
}
