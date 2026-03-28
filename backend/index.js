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

// CORS Configuration with fallback
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            "http://localhost:5173", 
            "http://localhost:5174", 
            "http://127.0.0.1:5173", 
            "http://127.0.0.1:5174",
            "https://vebstore.netlify.app",
            "https://admin-vebstore.netlify.app",
            "https://vebadmin.netlify.app",
            "https://veb-store.vercel.app"
        ];
        
        // Add environment-specific origins
        if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);
        if (process.env.ADMIN_URL) allowedOrigins.push(process.env.ADMIN_URL);
        
        // In production, be more permissive to avoid CORS issues
        if (process.env.NODE_ENV === 'production') {
            // Allow common deployment platforms
            const productionOrigins = [
                ...allowedOrigins,
                /\.netlify\.app$/,  // All Netlify apps
                /\.vercel\.app$/,   // All Vercel apps
                /\.onrender\.com$/, // All Render apps
                /\.github\.dev$/,   // GitHub Codespaces
                /\.web\.app$/,      // GitHub Pages
            ];
            
            // Check if origin matches any allowed pattern
            const isAllowed = productionOrigins.some(allowedOrigin => {
                if (allowedOrigin instanceof RegExp) {
                    return allowedOrigin.test(origin);
                }
                return allowedOrigin === origin;
            });
            
            if (isAllowed) {
                return callback(null, true);
            }
        }
        
        // Development: strict checking
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Log the blocked origin for debugging
        console.log(`[CORS] Blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie']
};

// Apply CORS with error handling
app.use(cors(corsOptions));

// Fallback CORS for any missed requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

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


