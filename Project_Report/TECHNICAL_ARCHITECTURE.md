# Technical Architecture Documentation

## System Architecture Overview

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    VEBSTORE ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Client    │  │   Client    │  │   Client    │  │   Client    │ │
│  │   Browser   │  │   Mobile    │  │   Admin     │  │   API       │ │
│  │             │  │   App       │  │   Panel     │  │   Client    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│         │               │               │               │         │
│         └───────────────┼───────────────┼───────────────┘         │
│                         │               │                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                Load Balancer (Nginx)                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                 │                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                API Gateway (Express.js)                     │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │ │
│  │  │   Auth      │ │  Product    │ │   Order     │ │ Payment │ │ │
│  │  │  Service    │ │  Service    │ │  Service    │ │ Service │ │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                 │                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Message Queue                            │ │
│  │                   (Redis/BullMQ)                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                 │                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                     Database Layer                          │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │ │
│  │  │  MongoDB    │ │    Redis     │ │  File Store │ │  Cache  │ │ │
│  │  │ (Primary)   │ │  (Sessions)  │ │ (Cloudinary) │ │ (Redis) │ │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Microservices Architecture

### Service Decomposition

#### 1. Authentication Service
```javascript
// Auth Service Architecture
class AuthService {
  // JWT Token Management
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
      issuer: 'vebstore',
      audience: 'vebstore-users'
    })
  }

  // Password Security
  async hashPassword(password) {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  // Session Management
  async createSession(userId, deviceInfo) {
    const session = {
      userId,
      deviceInfo,
      createdAt: new Date(),
      lastActivity: new Date()
    }
    await redis.setex(`session:${userId}`, 86400, JSON.stringify(session))
    return session
  }
}
```

#### 2. Product Service
```javascript
// Product Service Architecture
class ProductService {
  // Product CRUD Operations
  async createProduct(productData) {
    const product = new Product({
      ...productData,
      slug: this.generateSlug(productData.name),
      status: 'active',
      createdAt: new Date()
    })
    await product.save()
    return product
  }

  // Inventory Management
  async updateStock(productId, quantity, operation) {
    const product = await Product.findById(productId)
    if (operation === 'add') {
      product.stock += quantity
    } else {
      product.stock = Math.max(0, product.stock - quantity)
    }
    await product.save()
    
    // Emit stock update event
    eventEmitter.emit('stockUpdated', {
      productId,
      newStock: product.stock,
      operation
    })
    
    return product
  }

  // Search and Filtering
  async searchProducts(query, filters) {
    const searchQuery = {
      status: 'active',
      ...filters
    }

    if (query) {
      searchQuery.$text = { $search: query }
    }

    return await Product.find(searchQuery)
      .populate('category')
      .populate('reviews')
      .sort({ createdAt: -1 })
  }
}
```

#### 3. Order Service
```javascript
// Order Service Architecture
class OrderService {
  // Order Processing
  async createOrder(userId, orderData) {
    const order = new Order({
      userId,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      paymentMethod: orderData.paymentMethod,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      createdAt: new Date()
    })

    await order.save()

    // Update inventory
    for (const item of order.items) {
      await productService.updateStock(item.productId, item.quantity, 'subtract')
    }

    // Send order confirmation
    await notificationService.sendOrderConfirmation(order)

    return order
  }

  // Order Status Management
  async updateOrderStatus(orderId, status, trackingInfo = null) {
    const order = await Order.findById(orderId)
    order.status = status
    order.updatedAt = new Date()

    if (trackingInfo) {
      order.trackingInfo = trackingInfo
    }

    await order.save()

    // Send status update notification
    await notificationService.sendStatusUpdate(order)

    return order
  }
}
```

## Database Architecture

### MongoDB Schema Design

#### User Collection Schema
```javascript
const userSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  phone: {
    type: String,
    required: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },

  // Profile Information
  avatar: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    default: 'prefer_not_to_say'
  },

  // Address Management
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Invalid pincode']
    },
    country: {
      type: String,
      required: true,
      default: 'India'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],

  // Shopping Data
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    variant: {
      size: String,
      color: String
    }
  }],

  // Preferences
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: true
    },
    whatsappUpdates: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'gu', 'ta', 'te', 'mr', 'bn'],
      default: 'en'
    },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP'],
      default: 'INR'
    }
  },

  // Account Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isAccountActive: {
    type: Boolean,
    default: true
  },
  accountType: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer'
  },

  // Security
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual Fields
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

userSchema.virtual('defaultAddress', {
  ref: 'Address',
  localField: 'addresses',
  foreignField: '_id',
  justOne: true,
  options: { match: { isDefault: true } }
})

// Indexes
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ phone: 1 }, { unique: true, sparse: true })
userSchema.index({ createdAt: -1 })
userSchema.index({ 'addresses.pincode': 1 })
```

#### Product Collection Schema
```javascript
const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    maxlength: 500
  },

  // Product Details
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },

  // Categorization
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  attributes: [{
    name: String,
    value: String,
    type: {
      type: String,
      enum: ['text', 'number', 'boolean', 'select'],
      default: 'text'
    }
  }],

  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tax: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  shippingCost: {
    type: Number,
    min: 0,
    default: 0
  },

  // Inventory
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  minOrderQuantity: {
    type: Number,
    min: 1,
    default: 1
  },
  maxOrderQuantity: {
    type: Number,
    min: 1
  },
  trackInventory: {
    type: Boolean,
    default: true
  },
  allowBackorder: {
    type: Boolean,
    default: false
  },

  // Variants
  variants: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        min: 0
      },
      sku: {
        type: String,
        required: true
      },
      stock: {
        type: Number,
        min: 0,
        default: 0
      },
      image: String
    }]
  }],

  // Media
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  videos: [{
    url: String,
    thumbnail: String,
    title: String,
    duration: Number
  }],

  // Specifications
  specifications: [{
    name: String,
    value: String,
    group: String
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'in', 'mm'],
      default: 'cm'
    },
    weight: Number,
    weightUnit: {
      type: String,
      enum: ['kg', 'g', 'lb', 'oz'],
      default: 'kg'
    }
  },

  // Reviews and Ratings
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: String,
    comment: {
      type: String,
      maxlength: 1000
    },
    images: [String],
    helpful: {
      type: Number,
      default: 0
    },
    verified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },

  // SEO
  seo: {
    title: String,
    description: String,
    keywords: [String],
    canonicalUrl: String,
    ogImage: String
  },

  // Status and Availability
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'discontinued', 'out_of_stock'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  availability: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'pre_order', 'discontinued'],
    default: 'in_stock'
  },

  // Shipping Information
  shipping: {
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingTime: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks'],
        default: 'days'
      }
    },
    shippingRegions: [String],
    fragile: {
      type: Boolean,
      default: false
    }
  },

  // Warranty and Returns
  warranty: {
    period: Number,
    unit: {
      type: String,
      enum: ['days', 'months', 'years'],
      default: 'months'
    },
    type: String,
    description: String
  },
  returnPolicy: {
    days: Number,
    conditions: String,
    restockingFee: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },

  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  purchaseCount: {
    type: Number,
    default: 0
  },
  addToCartCount: {
    type: Number,
    default: 0
  },
  wishlistCount: {
    type: Number,
    default: 0
  },

  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual Fields
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100)
  }
  return this.price
})

productSchema.virtual('isInStock').get(function() {
  return this.stock > 0 || this.allowBackorder
})

productSchema.virtual('totalReviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
  count: true
})

// Indexes
productSchema.index({ name: 'text', description: 'text' })
productSchema.index({ slug: 1 }, { unique: true })
productSchema.index({ sku: 1 }, { unique: true })
productSchema.index({ category: 1, subCategory: 1 })
productSchema.index({ price: 1 })
productSchema.index({ status: 1 })
productSchema.index({ featured: 1 })
productSchema.index({ createdAt: -1 })
productSchema.index({ averageRating: -1 })
productSchema.index({ 'reviews.rating': 1 })
```

## API Gateway Architecture

### Request Flow Management

```javascript
// API Gateway Configuration
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const compression = require('compression')

const app = express()

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.razorpay.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))

// CORS Configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    error: 'Too many requests',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
})

app.use('/api/', limiter)

// Response Compression
app.use(compression())

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`)
  next()
})
```

### Service Routing

```javascript
// Service Router Configuration
class ServiceRouter {
  constructor() {
    this.routes = new Map()
    this.loadBalancer = new LoadBalancer()
  }

  registerService(path, service) {
    this.routes.set(path, service)
  }

  async routeRequest(req, res) {
    const servicePath = this.extractServicePath(req.path)
    const service = this.routes.get(servicePath)

    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }

    try {
      const instance = await this.loadBalancer.getInstance(service)
      const response = await instance.handleRequest(req)
      res.json(response)
    } catch (error) {
      res.status(500).json({ error: 'Service unavailable' })
    }
  }

  extractServicePath(path) {
    const segments = path.split('/')
    return segments[2] // /api/service/...
  }
}
```

## Security Architecture

### Authentication & Authorization

```javascript
// Security Middleware Stack
class SecurityMiddleware {
  // JWT Authentication
  static authenticate(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }

  // Role-based Authorization
  static authorize(roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }

      next()
    }
  }

  // Input Validation
  static validateInput(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.body)
      if (error) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        })
      }
      next()
    }
  }

  // Rate Limiting per User
  static userRateLimit(options) {
    const userLimits = new Map()

    return async (req, res, next) => {
      const userId = req.user?.id || req.ip
      const limit = userLimits.get(userId) || { count: 0, resetTime: Date.now() + 60000 }

      if (Date.now() > limit.resetTime) {
        limit.count = 0
        limit.resetTime = Date.now() + 60000
      }

      limit.count++

      if (limit.count > options.max) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((limit.resetTime - Date.now()) / 1000)
        })
      }

      userLimits.set(userId, limit)
      next()
    }
  }
}
```

### Data Encryption

```javascript
// Encryption Service
class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm'
    this.secretKey = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32)
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.algorithm, this.secretKey)
    cipher.setAAD(Buffer.from('vebstore', 'utf8'))

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    }
  }

  decrypt(encryptedData) {
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey)
    decipher.setAAD(Buffer.from('vebstore', 'utf8'))
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }
}
```

## Performance Architecture

### Caching Strategy

```javascript
// Multi-Level Caching System
class CacheManager {
  constructor() {
    this.memoryCache = new Map()
    this.redisClient = redis.createClient()
    this.cacheConfig = {
      memory: {
        maxSize: 1000,
        ttl: 300000 // 5 minutes
      },
      redis: {
        ttl: 3600000 // 1 hour
      }
    }
  }

  async get(key) {
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      const item = this.memoryCache.get(key)
      if (Date.now() - item.timestamp < this.cacheConfig.memory.ttl) {
        return item.data
      }
      this.memoryCache.delete(key)
    }

    // Check Redis cache
    try {
      const cached = await this.redisClient.get(key)
      if (cached) {
        const data = JSON.parse(cached)
        // Store in memory cache
        this.memoryCache.set(key, {
          data,
          timestamp: Date.now()
        })
        return data
      }
    } catch (error) {
      console.error('Redis cache error:', error)
    }

    return null
  }

  async set(key, data, options = {}) {
    // Store in memory cache
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now()
    })

    // Store in Redis cache
    try {
      const ttl = options.ttl || this.cacheConfig.redis.ttl
      await this.redisClient.setex(key, ttl / 1000, JSON.stringify(data))
    } catch (error) {
      console.error('Redis cache error:', error)
    }
  }

  async invalidate(pattern) {
    // Clear memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key)
      }
    }

    // Clear Redis cache
    try {
      const keys = await this.redisClient.keys(`*${pattern}*`)
      if (keys.length > 0) {
        await this.redisClient.del(...keys)
      }
    } catch (error) {
      console.error('Redis cache error:', error)
    }
  }
}
```

### Database Optimization

```javascript
// Database Query Optimization
class QueryOptimizer {
  // Aggregation Pipeline Optimization
  static async getDashboardStats(dateRange) {
    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: dateRange.start,
            $lte: dateRange.end
          },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' },
          uniqueCustomers: { $addToSet: '$userId' }
        }
      },
      {
        $addFields: {
          uniqueCustomerCount: { $size: '$uniqueCustomers' }
        }
      },
      {
        $project: {
          uniqueCustomers: 0
        }
      }
    ]

    const stats = await Order.aggregate(pipeline)
    return stats[0] || {}
  }

  // Optimized Product Search
  static async searchProducts(query, filters, pagination) {
    const searchQuery = {
      status: 'active',
      ...filters
    }

    if (query) {
      searchQuery.$text = { $search: query }
      searchQuery.score = { $meta: 'textScore' }
    }

    const pipeline = [
      { $match: searchQuery },
      ...(query ? [{ $sort: { score: { $meta: 'textScore' } } }] : []),
      {
        $facet: {
          products: [
            { $skip: pagination.skip },
            { $limit: pagination.limit },
            {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            },
            { $unwind: '$category' },
            {
              $project: {
                name: 1,
                slug: 1,
                price: 1,
                images: 1,
                averageRating: 1,
                reviewCount: 1,
                category: '$category.name',
                score: 1
              }
            }
          ],
          totalCount: [{ $count: 'count' }]
        }
      }
    ]

    const result = await Product.aggregate(pipeline)
    return {
      products: result[0].products,
      totalCount: result[0].totalCount[0]?.count || 0
    }
  }
}
```

## Monitoring & Observability

### Application Monitoring

```javascript
// Monitoring Service
class MonitoringService {
  constructor() {
    this.metrics = new Map()
    this.alerts = []
  }

  // Performance Metrics
  recordMetric(name, value, tags = {}) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    this.metrics.get(name).push({
      value,
      timestamp: Date.now(),
      tags
    })

    // Check for alerts
    this.checkAlerts(name, value)
  }

  // Health Checks
  async performHealthChecks() {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      externalAPIs: await this.checkExternalAPIs(),
      diskSpace: await this.checkDiskSpace(),
      memory: await this.checkMemory()
    }

    const healthy = Object.values(checks).every(check => check.status === 'healthy')
    
    return {
      status: healthy ? 'healthy' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString()
    }
  }

  // Alert Management
  checkAlerts(metricName, value) {
    const thresholds = this.getThresholds(metricName)
    
    if (value > thresholds.critical) {
      this.sendAlert('critical', metricName, value)
    } else if (value > thresholds.warning) {
      this.sendAlert('warning', metricName, value)
    }
  }

  async sendAlert(level, metric, value) {
    const alert = {
      level,
      metric,
      value,
      timestamp: new Date().toISOString(),
      resolved: false
    }

    this.alerts.push(alert)

    // Send to monitoring service
    await this.notifyMonitoringService(alert)
    
    // Send to Slack/Discord
    await this.sendSlackNotification(alert)
  }
}
```

### Error Tracking

```javascript
// Error Tracking Service
class ErrorTracker {
  constructor() {
    this.errors = []
    this.errorCounts = new Map()
  }

  trackError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context: {
        userId: context.userId,
        url: context.url,
        method: context.method,
        userAgent: context.userAgent,
        timestamp: new Date().toISOString(),
        ...context
      }
    }

    // Store error
    this.errors.push(errorInfo)

    // Count errors by type
    const errorKey = `${error.name}:${error.message}`
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1)

    // Check for error patterns
    this.analyzeErrorPatterns(errorInfo)

    // Send to error tracking service
    this.sendToErrorService(errorInfo)
  }

  analyzeErrorPatterns(errorInfo) {
    const recentErrors = this.errors.filter(
      error => Date.now() - new Date(error.context.timestamp).getTime() < 300000
    )

    // Check for error spikes
    if (recentErrors.length > 100) {
      this.sendAlert('error_spike', recentErrors.length)
    }

    // Check for common errors
    const commonErrors = Array.from(this.errorCounts.entries())
      .filter(([_, count]) => count > 10)
      .sort(([_, a], [__, b]) => b - a)

    if (commonErrors.length > 0) {
      this.sendAlert('common_errors', commonErrors)
    }
  }
}
```

## Deployment Architecture

### Container Configuration

```dockerfile
# Dockerfile for Backend Services
FROM node:18-alpine

# Security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Application
COPY . .
RUN chown -R nodejs:nodejs /app
USER nodejs

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - MONGODB_URL=${MONGODB_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - mongodb
      - redis
    restart: unless-stopped

  mongodb:
    image: mongo:6.0
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongodb_data:
  redis_data:
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run E2E tests
        run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Build Docker image
        run: docker build -t vebstore:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker tag vebstore:${{ github.sha }} ${{ secrets.DOCKER_REGISTRY }}/vebstore:latest
          docker push ${{ secrets.DOCKER_REGISTRY }}/vebstore:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Update production environment
          ssh ${{ secrets.PROD_USER }}@${{ secrets.PROD_HOST }} "
            docker pull ${{ secrets.DOCKER_REGISTRY }}/vebstore:latest
            docker-compose down
            docker-compose up -d
          "
      
      - name: Run smoke tests
        run: npm run test:smoke
      
      - name: Notify deployment
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-type: application/json' \
            --data '{"text":"✅ VEBStore deployed successfully!"}'
```

This technical architecture documentation provides a comprehensive overview of the VEBStore system design, covering all major components and their interactions. The architecture is designed for scalability, security, and maintainability while following industry best practices.
