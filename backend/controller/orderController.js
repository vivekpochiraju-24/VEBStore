import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import Razorpay from 'razorpay'
import dotenv from 'dotenv'
import { sendOrderEmail, sendCancelEmail, sendTrackingEmail } from "../utils/emailService.js";
import { createNotification } from "../utils/notificationService.js";
dotenv.config()
const currency = 'inr'
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// for User
export const placeOrder = async (req,res) => {

     try {
         const {items , amount , address, appliedCoins} = req.body;
         const userId = req.userId;
         
         // Validate user coins
         const user = await User.findById(userId);
         const coinsToDeduct = Number(appliedCoins) || 0;
         if (coinsToDeduct > 0 && user.supercoins < coinsToDeduct) {
             return res.status(400).json({message: 'Insufficient Supercoins'})
         }

         const orderData = {
            items,
            amount,
            appliedCoins: coinsToDeduct,
            userId,
            address,
            paymentMethod:'COD',
            payment:false,
            date: Date.now()
         }

         const newOrder = new Order(orderData)
         await newOrder.save()

         let updateQuery = { cartData: {} };
         if (coinsToDeduct > 0) {
             updateQuery.$inc = { supercoins: -coinsToDeduct };
         }
         await User.findByIdAndUpdate(userId, updateQuery)
         
         // Send Confirmation Email
         const updatedUser = await User.findById(userId);
         if (updatedUser) {
             const targetEmail = address.email || user.email;
             console.log(`[ORDER] Preparing to send email to: ${targetEmail} (Opt-in: ${updatedUser.emailUpdatesOptIn})`);
             if (targetEmail && updatedUser.emailUpdatesOptIn) {
                 sendOrderEmail(targetEmail, newOrder).catch(e => console.error("Order Mail Error:", e));
             }
             createNotification(userId, "Order Placed", `Your order #${newOrder._id.toString().slice(-6)} has been placed successfully.`, "Order");
             
             // WhatsApp Simulator
             if (user.whatsappOptIn && user.whatsappPhone) {
                 const productNames = items.map(item => item.name).join(", ");
                 console.log(`------------------------------------------------------------------`);
                 console.log(`[WHATSAPP API - NEW ORDER] 📱 Sending message to +${user.whatsappPhone}`);
                 console.log(`[WHATSAPP API] 💬 "🛍️ Order Confirmed! Hi ${user.name}, your VEBStore order #${newOrder._id.toString().slice(-6)} has been placed successfully.`);
                 console.log(`[WHATSAPP API] 📦 Products: ${productNames}`);
                 console.log(`[WHATSAPP API] 🚚 We will notify you once your order is dispatched."`);
                 console.log(`------------------------------------------------------------------`);
             }
         }

         return res.status(201).json({message:'Order Place'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Order Place error'})
    }
    
}


export const placeOrderRazorpay = async (req,res) => {
    try {
        
         const {items , amount , address, appliedCoins} = req.body;
         const userId = req.userId;

         const user = await User.findById(userId);
         const coinsToDeduct = Number(appliedCoins) || 0;
         if (coinsToDeduct > 0 && user.supercoins < coinsToDeduct) {
             return res.status(400).json({message: 'Insufficient Supercoins'})
         }

         const orderData = {
            items,
            amount,
            appliedCoins: coinsToDeduct,
            userId,
            address,
            paymentMethod:'Razorpay',
            payment:false,
            date: Date.now()
         }

         const newOrder = new Order(orderData)
         await newOrder.save()

         const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
         }
         await razorpayInstance.orders.create(options, (error,order)=>{
            if(error) {
                console.log(error)
                return res.status(500).json(error)
            }
            res.status(200).json(order)
         })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message
            })
    }
}


export const verifyRazorpay = async (req,res) =>{
    try {
        const userId = req.userId
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status === 'paid'){
            const newOrder = await Order.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            
            let updateQuery = { cartData: {} };
            if (newOrder.appliedCoins > 0) {
                updateQuery.$inc = { supercoins: -newOrder.appliedCoins };
            }
            const user = await User.findByIdAndUpdate(userId, updateQuery, { new: true })
            
            // Send Order Confirmation Email via Razorpay
            const targetEmail = newOrder.address.email || user.email;
            console.log(`[RAZORPAY SUCCESS] Sending confirmation to: ${targetEmail} (Opt-in: ${user.emailUpdatesOptIn})`);
            if (targetEmail && user.emailUpdatesOptIn) {
                sendOrderEmail(targetEmail, newOrder).catch(e => console.error("Order Mail Error:", e));
            }
            createNotification(userId, "Order Summary", `Your Razorpay order #${newOrder._id.toString().slice(-6)} has been confirmed!`, "Order");

            // WhatsApp Simulator for Razorpay
            if (user && user.whatsappOptIn && user.whatsappPhone && newOrder) {
                const productNames = newOrder.items.map(item => item.name).join(", ");
                console.log(`------------------------------------------------------------------`);
                console.log(`[WHATSAPP API - RAZORPAY PAID] 📱 Sending message to +${user.whatsappPhone}`);
                console.log(`[WHATSAPP API] 💬 "🛍️ Payment Successful! Hi ${user.name}, your VEBStore order #${newOrder._id.toString().slice(-6)} has been paid via Razorpay.`);
                console.log(`[WHATSAPP API] 📦 Products: ${productNames}`);
                console.log(`[WHATSAPP API] 🚚 We will notify you once your order is dispatched."`);
                console.log(`------------------------------------------------------------------`);
            }
            
            res.status(200).json({message:'Payment Successful'
            })
        }
        else{
            res.json({message:'Payment Failed'
            })
        }
    } catch (error) {
        console.log(error)
         res.status(500).json({message:error.message
            })
    }
}






export const userOrders = async (req,res) => {
      try {
        const userId = req.userId;
        const orders = await Order.find({userId})
        return res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"userOrders error"})
    }
    
}




//for Admin



    
export const allOrders = async (req,res) => {
    try {
        const orders = await Order.find({})
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"adminAllOrders error"})
        
    }
    
}
    
export const updateStatus = async (req,res) => {
    
try {
    const {orderId , status} = req.body

    const order = await Order.findByIdAndUpdate(orderId , { status }, { new: true })
    
    // Send Status Update Notification
    createNotification(order.userId, "Order Update", `Your order #${order._id.toString().slice(-6)} status is now: ${status}`, "Order");

    // Send Tracking Email updates
    const user = await User.findById(order.userId);
    const targetEmail = order.address?.email || user?.email;
    if (targetEmail && user?.emailUpdatesOptIn) {
        sendTrackingEmail(targetEmail, order, status).catch(e => console.error("Tracking Mail Error:", e));
    }

    // WhatsApp Simulator for Status Update
    if (user && user.whatsappOptIn && user.whatsappPhone) {
        console.log(`------------------------------------------------------------------`);
        console.log(`[WHATSAPP API - STATUS UPDATE] 📱 Sending message to +${user.whatsappPhone}`);
        console.log(`[WHATSAPP API] 💬 "🔔 Order Update! Hi ${user.name}, the status of your VEBStore order #${order._id.toString().slice(-6)} is now: *${status}*."`);
        console.log(`------------------------------------------------------------------`);
    }

    return res.status(201).json({message:'Status Updated'})
} catch (error) {
     return res.status(500).json({message:error.message
            })
}
}


export const cancelOrder = async (req,res) => {
    try {
        const {orderId , reason} = req.body
        const order = await Order.findById(orderId)
        
        if(!order) return res.status(404).json({message:"Order not found"})
        
        // Only allow cancellation if order is not Shipped/Delivered
        if(order.status !== 'Order Placed' && order.status !== 'Packing') {
            return res.status(400).json({message:"Order cannot be cancelled at this stage"})
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId , { 
            status: 'Cancelled',
            isCancelled: true,
            cancellationReason: reason
        }, { new: true })
        
        // Refund Supercoins if used
        if (updatedOrder.appliedCoins && updatedOrder.appliedCoins > 0) {
            await User.findByIdAndUpdate(order.userId, {
                $inc: { supercoins: updatedOrder.appliedCoins }
            });
        }

        // Send Cancellation Email
        const user = await User.findById(order.userId);
        if (user) {
            sendCancelEmail(user.email, updatedOrder).catch(e => console.error("Cancel Mail Error:", e));
            createNotification(order.userId, "Order Cancelled", `Your order #${orderId.slice(-6)} has been cancelled.`, "Order");
        }

        return res.status(200).json({message:'Order Cancelled Successfully'})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const requestReturnExchange = async (req,res) => {
    try {
        const {orderId , reason, type} = req.body
        const order = await Order.findById(orderId)
        
        if(!order) return res.status(404).json({message:"Order not found"})
        
        // Only allow if Delivered
        if(order.status !== 'Delivered') {
            return res.status(400).json({message:"Only delivered orders can be returned/exchanged"})
        }

        // Check 7 day policy
        const orderDate = new Date(order.date)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        if(orderDate < sevenDaysAgo) {
            return res.status(400).json({message:"Return/Exchange period (7 days) has expired"})
        }

        await Order.findByIdAndUpdate(orderId , {
            status: type === 'Return' ? 'Return Requested' : 'Exchange Requested',
            returnRequest: {
                status: 'Requested',
                type,
                reason,
                requestDate: new Date()
            }
        })
        
        return res.status(200).json({message:'Request Submitted Successfully'})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const handleReturnExchange = async (req,res) => {
    try {
        const {orderId , status} = req.body // status: 'Approved' or 'Rejected'
        const order = await Order.findById(orderId)
        
        if(!order) return res.status(404).json({message:"Order not found"})

        const finalStatus = status === 'Approved' 
            ? (order.returnRequest.type === 'Return' ? 'Refunded' : 'Exchange Processed')
            : 'Return/Exchange Rejected'

        await Order.findByIdAndUpdate(orderId , {
            status: finalStatus,
            'returnRequest.status': status
        })
        
        return res.status(200).json({message:'Request Updated Successfully'})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}