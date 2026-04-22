import User from "../model/userModel.js";

// Add to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        res.json({ success: true, message: "Added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        user.wishlist = user.wishlist.filter(id => id !== productId);
        await user.save();

        res.json({ success: true, message: "Removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get wishlist
const getWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { addToWishlist, removeFromWishlist, getWishlist }
