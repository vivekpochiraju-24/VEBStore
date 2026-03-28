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
app.set("trust proxy", 1);

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

// Simple and effective CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            "http://localhost:5173", 
            "http://localhost:5174", 
            "http://127.0.0.1:5173", 
            "http://127.0.0.1:5174",
            "https://vebstore.netlify.app",
            "https://admin-vebstore.netlify.app",
            "https://vebadmin.netlify.app",
            "https://veb-store.vercel.app",
            "https://vebstore-frontend.onrender.com"
        ];
        
        // Add environment-specific origins
        if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);
        if (process.env.ADMIN_URL) allowedOrigins.push(process.env.ADMIN_URL);
        
        // Allow common deployment platforms in production
        if (process.env.NODE_ENV === 'production') {
            allowedOrigins.push(
                /\.netlify\.app$/,
                /\.vercel\.app$/,
                /\.onrender\.com$/,
                /\.github\.dev$/,
                /\.web\.app$/
            );
        }
        
        // Check if origin is allowed
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return allowed === origin;
        });
        
        if (isAllowed) {
            console.log(`[CORS] Allowing origin: ${origin}`);
            return callback(null, true);
        }
        
        console.log(`[CORS] Blocking origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie']
}));

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
    console.log(`📍 Local Access: http://localhost:${port}`)
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)

    connectDb().then(() => {
        console.log("✅ Database connected successfully")
        
        // Email service is now lazy-loaded and optional
        console.log("📨 Email service ready (lazy-loaded)")
        
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
        process.exit(0)
    })
})

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully')
    server.close(() => {
        console.log('Process terminated')
        process.exit(0)
    })
})


