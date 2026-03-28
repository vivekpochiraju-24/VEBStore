import User from "../model/userModel.js";
import validator from "validator"
import bcrypt from "bcryptjs"
import { genToken, genToken1 } from "../config/token.js";
import { sendOtpEmail } from "../utils/emailService.js";

export const otpStore = new Map();

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!validator.isEmail(email)) return res.status(400).json({ message: "Invalid Email format" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
        otpStore.set(email, { otp, expiresAt });

        console.log(`[TESTING OTP] Code for ${email} is ${otp}`);

        try {
            await sendOtpEmail(email, otp);
        } catch (e) {
            console.log("Failed to send real email. Check EMAIL_USER in .env. Test OTP is in console log.");
        }

        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.log("sendOtp error", error);
        return res.status(500).json({ message: "Failed to send OTP" });
    }
}

export const registration = async (req, res) => {
    try {
        console.log(`[AUTH] Registration attempt in ${process.env.NODE_ENV} mode`);
        const { name, email, password, phone } = req.body;

        const existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "User already exist" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Enter valid Email" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Enter Strong Password" })
        }
        let hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashPassword, phone })
        let token = await genToken(user._id)
        const isProduction = process.env.NODE_ENV === "production" || req.get('host')?.includes('onrender.com');
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json(user)
    } catch (error) {
        console.log("registration error")
        return res.status(500).json({ message: `registration error ${error}` })
    }

}


export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        
        console.log("Login attempt:", { email, passwordReceived: !!password });
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        let user = await User.findOne({ email })
        if (!user) {
            console.log("User not found:", email);
            return res.status(404).json({ message: "User not found" })
        }
        
        console.log("User found:", { id: user._id, email: user.email });
        
        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            console.log("Password mismatch for:", email);
            return res.status(400).json({ message: "Incorrect password" })
        }
        
        console.log("Password verified for:", email);
        
        let token = await genToken(user._id)
        if (!token) {
            console.log("Token generation failed for:", email);
            return res.status(500).json({ message: "Token generation failed" });
        }
        
        console.log("Token generated for:", email);
        
        const isProduction = process.env.NODE_ENV === "production" || req.get('host')?.includes('onrender.com');
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        
        console.log("Cookie set for:", email);
        
        const responseUser = { _id: user._id, name: user.name, email: user.email };
        console.log("Login successful for:", email);
        
        return res.status(200).json({ success: true, user: responseUser, message: "Login successful" })

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error during login" })
    }
}

export const logOut = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production" || req.get('host')?.includes('onrender.com');
        
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        })
        res.clearCookie("admin_token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        })
        return res.status(200).json({ success: true, message: "Logged out from all sessions" })
    } catch (error) {
        console.log("logOut error")
        return res.status(500).json({ message: `LogOut error ${error}` })
    }

}


export const googleLogin = async (req, res) => {
    try {
        let { name, email } = req.body;
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({
                name, email
            })
        }

        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user)

    } catch (error) {
        console.log("googleLogin error")
        return res.status(500).json({ message: `googleLogin error ${error}` })
    }

}


export const adminLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        
        console.log("Admin login attempt:", { email, passwordReceived: !!password });
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        // Priority:
        // 1. ADMIN_EMAIL / ADMIN_PASSWORD (From .env)
        // 2. ADMIN_LOGIN_EMAIL / ADMIN_LOGIN_PASSWORD (Fallback)
        // 3. Defaults (Fallback for ease of use)
        const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_LOGIN_EMAIL || "bhargavisurampudi1@gmail.com";
        const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_LOGIN_PASSWORD || "bhargavi10";
        
        console.log("Expected credentials:", { adminEmail, passwordReceived: !!adminPassword });
        console.log("Email match:", email === adminEmail);
        console.log("Password match:", password === adminPassword);
        
        if (email === adminEmail && password === adminPassword) {
            let token = await genToken1(email)
            if (!token) {
                console.log("Admin token generation failed for:", email);
                return res.status(500).json({ message: "Token generation failed" });
            }
            
            console.log("Admin token generated for:", email);
            
            const isProduction = process.env.NODE_ENV === "production" || req.get('host')?.includes('onrender.com');
            
            res.cookie("admin_token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                maxAge: 1 * 24 * 60 * 60 * 1000
            })
            
            console.log("Admin cookie set for:", email);
            console.log("Admin login successful for:", email);
            
            return res.status(200).json({ success: true, token, message: "Admin login successful" })
        }
        
        console.log("Admin credentials invalid for:", email);
        return res.status(400).json({ message: "Invalid administrator credentials" })

    } catch (error) {
        console.error("AdminLogin error:", error);
        return res.status(500).json({ message: "Server error during admin login" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, phone, currentPassword, newPassword, preferredProductType, emailUpdatesOptIn } = req.body;

        // Get user id from cookie
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const jwt = (await import("jsonwebtoken")).default;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Validate phone if provided
        if (phone && phone.trim() !== "") {
            const cleanPhone = phone.trim().replace(/\D/g, '');
            if (cleanPhone.length !== 10) {
                return res.status(400).json({ message: "A valid 10-digit mobile number is required" });
            }
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name && name.trim()) user.name = name.trim();
        if (phone !== undefined) user.phone = phone.trim();
        if (preferredProductType) user.preferredProductType = preferredProductType;
        if (typeof emailUpdatesOptIn === 'boolean') user.emailUpdatesOptIn = emailUpdatesOptIn;

        // If changing password, verify current password first
        if (newPassword) {
            if (!currentPassword) return res.status(400).json({ message: "Enter your current password" });
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
            if (newPassword.length < 8) return res.status(400).json({ message: "New password must be at least 8 characters" });
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();
        return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.log("updateProfile error", error);
        return res.status(500).json({ message: `Update profile error: ${error.message}` });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, otp } = req.body;

        const storedOtpData = otpStore.get(email);
        if (!storedOtpData) return res.status(400).json({ message: "OTP not requested or expired." });
        if (Date.now() > storedOtpData.expiresAt) return res.status(400).json({ message: "OTP has expired." });
        if (storedOtpData.otp !== otp) return res.status(400).json({ message: "Invalid OTP code." });

        otpStore.delete(email);

        let user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found." });
        if (newPassword.length < 8) return res.status(400).json({ message: "Enter Strong Password" });

        let hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.log("Reset password error", error);
        return res.status(500).json({ message: `Reset password error: ${error.message}` });
    }
}
