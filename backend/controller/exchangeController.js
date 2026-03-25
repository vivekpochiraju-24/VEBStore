import Exchange from '../model/exchangeModel.js';
import Product from '../model/productModel.js';
import User from '../model/userModel.js';

// Create new exchange request
export const createExchangeRequest = async (req, res) => {
    try {
        const {
            oldProduct,
            oldProductCondition,
            oldProductImages,
            oldProductDescription,
            clothQuality,
            clothYearsUsed,
            clothDamages,
            requestedCoins
        } = req.body;

        const userId = req.userId; // From isAuth middleware

        // Validate required fields
        if (!oldProduct || !oldProductImages || !oldProductDescription || !clothQuality || !clothYearsUsed || !clothDamages) {
            return res.status(400).json({ message: "All cloth analysis fields are required" });
        }

        // Create exchange request
        const exchange = new Exchange({
            user: userId,
            oldProduct,
            oldProductCondition: oldProductCondition || 'Good', // Default for legacy compatibility
            oldProductImages,
            oldProductDescription,
            clothQuality,
            clothYearsUsed,
            clothDamages,
            requestedCoins
        });

        await exchange.save();

        // Populate exchange details for response
        await exchange.populate([
            { path: 'user', select: 'name email' }
        ]);

        res.status(201).json({
            message: "Exchange request created successfully",
            exchange
        });

    } catch (error) {
        console.log("CreateExchange error", error);
        return res.status(500).json({ message: `CreateExchange error: ${error.message}` });
    }
};

// Get all exchange requests (for admin)
export const getAllExchangeRequests = async (req, res) => {
    try {
        const exchanges = await Exchange.find({})
            .populate('user', 'name email')
            .sort({ exchangeDate: -1 });

        res.status(200).json(exchanges);

    } catch (error) {
        console.log("GetAllExchanges error", error);
        return res.status(500).json({ message: `GetAllExchanges error: ${error.message}` });
    }
};

// Get user's exchange requests
export const getUserExchangeRequests = async (req, res) => {
    try {
        const userId = req.userId;
        const exchanges = await Exchange.find({ user: userId })
            .sort({ exchangeDate: -1 });

        res.status(200).json(exchanges);

    } catch (error) {
        console.log("GetUserExchanges error", error);
        return res.status(500).json({ message: `GetUserExchanges error: ${error.message}` });
    }
};

// Approve/Reject exchange request (admin)
export const updateExchangeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, grantedCoins, adminNotes } = req.body;

        const exchange = await Exchange.findById(id);
        if (!exchange) {
            return res.status(404).json({ message: "Exchange request not found" });
        }

        // If newly approved, give user supercoins
        if (status === 'Approved' && exchange.status !== 'Approved') {
            exchange.grantedCoins = Number(grantedCoins) || 0;
            const user = await User.findById(exchange.user);
            if (user) {
                user.supercoins = (user.supercoins || 0) + exchange.grantedCoins;
                await user.save();
            }
        } 
        // If reverting from approved
        else if (status !== 'Approved' && exchange.status === 'Approved') {
            const user = await User.findById(exchange.user);
            if (user) {
                user.supercoins = Math.max(0, (user.supercoins || 0) - exchange.grantedCoins);
                await user.save();
            }
        }

        // Update exchange
        exchange.status = status;
        exchange.adminNotes = adminNotes || '';

        if (status === 'Approved') {
            exchange.adminApproved = true;
        } else {
            exchange.adminApproved = false;
        }

        if (status === 'Completed') {
            exchange.completedDate = new Date();
        }

        await exchange.save();

        // Populate updated exchange for response
        await exchange.populate([
            { path: 'user', select: 'name email' }
        ]);

        res.status(200).json({
            message: `Exchange request ${status.toLowerCase()}`,
            exchange
        });

    } catch (error) {
        console.log("UpdateExchangeStatus error", error);
        return res.status(500).json({ message: `UpdateExchangeStatus error: ${error.message}` });
    }
};

// Delete exchange request
export const deleteExchangeRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const exchange = await Exchange.findById(id);
        if (!exchange) {
            return res.status(404).json({ message: "Exchange request not found" });
        }

        // Check if user owns this exchange or if admin
        if (exchange.user.toString() !== userId && !req.adminEmail) {
            return res.status(403).json({ message: "Not authorized to delete this exchange" });
        }

        await Exchange.findByIdAndDelete(id);

        res.status(200).json({ message: "Exchange request deleted successfully" });

    } catch (error) {
        console.log("DeleteExchange error", error);
        return res.status(500).json({ message: `DeleteExchange error: ${error.message}` });
    }
};
