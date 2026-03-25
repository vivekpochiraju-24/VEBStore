import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
dotenv.config()
import cors from "cors"
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import exchangeRoutes from './routes/exchangeRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

let port = process.env.PORT || 8000

let app = express()

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173", 
            "http://localhost:5174", 
            "http://127.0.0.1:5173", 
            "http://127.0.0.1:5174", 
            "https://vebstore-frontend.onrender.com",
            "https://vebstore-admin.onrender.com",
            process.env.FRONTEND_URL, 
            process.env.ADMIN_URL,
            "https://vebstore.netlify.app",
            "https://admin-vebstore.netlify.app",
            "https://vebadmin.netlify.app"
        ];
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/exchange", exchangeRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/admin", adminRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start server
const server = app.listen(port, '0.0.0.0', () => {
    console.log("🚀 VEBStore Server Starting...")
    console.log(`📍 Server running on: http://localhost:${port}`)
    console.log(`📍 Also accessible on: http://0.0.0.0:${port}`)
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
    connectDb().then(() => {
        console.log("✅ Database connected successfully")
        
        // SMTP Verification
        import('./utils/emailService.js').then(({ transporter }) => {
            transporter.verify((error, success) => {
                if (error) {
                    console.error("❌ Email Service (SMTP) Error:", error.message);
                } else {
                    console.log("📨 Email Service (SMTP) Verified & Ready!");
                }
            });
        });

        console.log("🎯 VEBStore Backend Ready!")
    }).catch(err => {
        console.error("❌ Database connection failed:", err.message)
        process.exit(1)
    })
})

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully')
    server.close(() => {
        console.log('Process terminated')
    })
})


