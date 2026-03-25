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

        // Advanced Statistics
        const statusDistribution = await Order.aggregate([
            { $group: { _id: "$status", value: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]);

        const customerTypeDistribution = await Order.aggregate([
            { $group: { _id: "$userId", orderCount: { $sum: 1 }, totalSpent: { $sum: "$amount" } } },
            { $group: { 
                _id: { $cond: [{ $gt: ["$orderCount", 1] }, "Returning", "New"] },
                value: { $sum: "$totalSpent" },
                count: { $sum: 1 }
            } }
        ]);

        // Monthly Chart Data (last 6 months)
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
                    orders: { $sum: 1 },
                    products: { 
                        $sum: { 
                            $reduce: { 
                                input: "$items", 
                                initialValue: 0, 
                                in: { $add: ["$$value", { $ifNull: ["$$this.quantity", 1] }] } 
                            } 
                        } 
                    }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthNamesFull = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = chartDataRaw.map(item => ({
            month: monthNamesFull[item._id - 1],
            sales: item.sales,
            orders: item.orders,
            products: item.products
        }));

        res.status(200).json({
            totals: {
                totalProducts,
                totalCustomers,
                totalOrders,
                returnsCancellations
            },
            recentOrders,
            chartData,
            statusDistribution: statusDistribution.map(d => ({ name: d._id, value: d.value, count: d.count })),
            customerTypeDistribution: customerTypeDistribution.map(d => ({ name: d._id, value: d.value, count: d.count }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
