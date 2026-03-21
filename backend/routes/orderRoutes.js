import express from 'express'
import isAuth from '../middleware/isAuth.js'
import { allOrders, cancelOrder, handleReturnExchange, placeOrder, placeOrderRazorpay, requestReturnExchange, updateStatus, userOrders, verifyRazorpay } from '../controller/orderController.js'
import { getAdminStats } from '../controller/adminController.js'
import adminAuth from '../middleware/adminAuth.js'

const orderRoutes = express.Router()

//for User
orderRoutes.post("/placeorder",isAuth,placeOrder)
orderRoutes.post("/razorpay",isAuth,placeOrderRazorpay)
orderRoutes.post("/userorder",isAuth,userOrders)
orderRoutes.post("/verifyrazorpay",isAuth,verifyRazorpay)
orderRoutes.post("/cancel",isAuth,cancelOrder)
orderRoutes.post("/return-exchange",isAuth,requestReturnExchange)
 
//for Admin
orderRoutes.post("/list",adminAuth,allOrders)
orderRoutes.get("/list",adminAuth,allOrders)
orderRoutes.post("/status",adminAuth,updateStatus)
orderRoutes.post("/handle-return",adminAuth,handleReturnExchange)
orderRoutes.get("/dashboard-stats",adminAuth,getAdminStats)

export default orderRoutes