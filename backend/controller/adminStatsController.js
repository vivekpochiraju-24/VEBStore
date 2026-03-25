import Order from "../model/orderModel.js";
import Message from "../model/messageModel.js";
import User from "../model/userModel.js";

export const getAdminBrief = async (req, res) => {
    try {
        // Pending Orders (not shipped/delivered)
        const pendingOrders = await Order.countDocuments({ status: { $in: ['Order Received', 'Order Placed', 'Order Packed', 'Shipped'] } });
        
        // Unreplied Messages
        const unrepliedMessages = await Message.countDocuments({ status: 'Pending' });
        
        // Users registered in last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const newUsers = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });

        return res.status(200).json({
            pendingOrders,
            unrepliedMessages,
            newUsers
        });
    } catch (error) {
        console.error("getAdminBrief error", error);
        return res.status(500).json({ message: "Failed to fetch admin stats" });
    }
};
