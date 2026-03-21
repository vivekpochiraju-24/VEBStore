import User from "../model/userModel.js"


export const getCurrentUser = async (req,res) => {
    try {
        let user = await User.findById(req.userId).select("-password")
        if(!user){
           return res.status(404).json({message:"user is not found"}) 
        }
        return res.status(200).json(user)
    } catch (error) {
         console.log(error)
    return res.status(500).json({message:`getCurrentUser error ${error}`})
    }
}

export const getAdmin = async (req,res) => {
    try {
        let adminEmail = req.adminEmail;
        if(!adminEmail){
            return res.status(404).json({message:"Admin is not found"}) 
        }
        return res.status(201).json({
            email:adminEmail,
            role:"admin"
        })
    } catch (error) {
        console.log(error)
    return res.status(500).json({message:`getAdmin error ${error}`})
    }
}

export const optInWhatsapp = async (req, res) => {
    try {
        const { whatsappPhone } = req.body;
        if (!whatsappPhone) {
            return res.status(400).json({ message: "WhatsApp number is required" });
        }
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        user.whatsappOptIn = true;
        user.whatsappPhone = whatsappPhone;
        await user.save();
        
        // Simulating the realistic send via console log
        console.log(`[WHATSAPP API SIMULATION] 📱 Successfully subscribed +${whatsappPhone}`);
        console.log(`[WHATSAPP API SIMULATION] 💬 Sent welcome message to +${whatsappPhone}: "Welcome to VEBStore WhatsApp Updates! We will share our latest exclusive products here."`);
        
        return res.status(200).json({ 
            message: "Successfully opted in for WhatsApp updates!",
            user: { ...user._doc, password: "" } 
        });
    } catch (error) {
        console.log("optInWhatsapp error", error);
        return res.status(500).json({ message: `Whatsapp opt-in error: ${error.message}` });
    }
}