import express from "express"
import { adminLogin, googleLogin, login, logOut, registration, resetPassword, sendOtp, updateProfile } from "../controller/authController.js"

const authRoutes = express.Router()

authRoutes.post("/registration", registration)
authRoutes.post("/login", login)
authRoutes.get("/logout", logOut)
authRoutes.post("/googlelogin", googleLogin)
authRoutes.post("/send-otp", sendOtp)
authRoutes.post("/adminlogin", adminLogin)
authRoutes.post("/resetpassword", resetPassword)
authRoutes.put("/update-profile", updateProfile)




export default authRoutes