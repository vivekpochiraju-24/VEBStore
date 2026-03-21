import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import Product from "../model/productModel.js";

export const getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const returnsCancellations = await Order.countDocuments({
            status: { $in: ['Cancelled', 'Refunded', 'Return Requested', 'Exchange Requested'] }
        });

        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        // Chart Data (last 6 months)
        const chartDataRaw = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    sales: { $sum: "$amount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = chartDataRaw.map(item => ({
            month: monthNames[item._id - 1],
            sales: item.sales,
            orders: item.orders
        }));

        res.status(200).json({
            totals: {
                totalProducts,
                totalCustomers,
                totalOrders,
                returnsCancellations
            },
            recentOrders,
            chartData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
