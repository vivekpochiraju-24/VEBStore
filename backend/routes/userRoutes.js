import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getAdmin, getCurrentUser, optInWhatsapp } from "../controller/userController.js"
import adminAuth from "../middleware/adminAuth.js"

let userRoutes = express.Router()

userRoutes.get("/getcurrentuser",isAuth,getCurrentUser)
userRoutes.get("/getadmin",getAdmin)
userRoutes.post("/whatsapp-optin", isAuth, optInWhatsapp)

export default userRoutes