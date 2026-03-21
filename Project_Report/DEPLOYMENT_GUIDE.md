# VEBStore Deployment Guide

## Table of Contents

1. **Deployment Overview**
   - Architecture Overview
   - Deployment Environments
   - Infrastructure Requirements
   - Security Considerations

2. **Local Development Setup**
   - Prerequisites
   - Environment Configuration
   - Database Setup
   - Running the Application

3. **Staging Deployment**
   - Staging Environment
   - CI/CD Pipeline
   - Testing Procedures
   - Quality Assurance

4. **Production Deployment**
   - Production Architecture
   - Deployment Process
   - Monitoring and Logging
   - Performance Optimization

5. **Cloud Deployment**
   - AWS Deployment
   - Google Cloud Platform
   - Microsoft Azure
   - Heroku Deployment

6. **Container Deployment**
   - Docker Configuration
   - Kubernetes Setup
   - Docker Compose
   - Container Orchestration

7. **Database Deployment**
   - MongoDB Atlas
   - Self-hosted MongoDB
   - Database Migration
   - Backup and Recovery

8. **Security Deployment**
   - SSL/TLS Configuration
   - Firewall Setup
   - Security Headers
   - Access Control

9. **Monitoring and Maintenance**
   - Application Monitoring
   - Performance Monitoring
   - Error Tracking
   - Log Management

10. **Troubleshooting**
    - Common Issues
    - Debugging Techniques
    - Performance Issues
    - Security Issues

---

## 1. Deployment Overview

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    VEBSTORE ARCHITECTURE                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Frontend  │  │   Admin     │  │   Mobile    │      │
│  │   (React)   │  │   (React)   │  │   (PWA)     │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│         │               │               │               │
│         └───────────────┼───────────────┘               │
│                         │                               │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Load Balancer (Nginx)                │ │
│  └─────────────────────────────────────────────────────┘ │
│                                 │                       │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Application Server                   │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ │
│  │  │   Frontend  │ │   Backend   │ │   Admin     │ │ │
│  │  │   Server    │ │   Server    │ │   Server    │ │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
│                                 │                       │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Database Layer                        │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ │
│  │  │  MongoDB    │ │    Redis    │ │   Storage   │ │ │
│  │  │ (Primary)   │ │  (Cache)    │ │ (Cloudinary) │ │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                External Services                     │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ │
│  │  │   Razorpay  │ │  SendGrid   │ │   Cloudinary│ │ │
│  │  │ (Payments)  │ │  (Email)    │ │  (Images)   │ │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Deployment Environments

#### Development Environment
- **Purpose**: Local development and testing
- **URL**: http://localhost:3000 (frontend), http://localhost:8000 (backend)
- **Database**: Local MongoDB instance
- **Features**: Hot reload, debug mode, mock data

#### Staging Environment
- **Purpose**: Pre-production testing
- **URL**: https://staging.vebstore.com
- **Database**: Staging MongoDB Atlas
- **Features**: Production-like setup, testing data, CI/CD integration

#### Production Environment
- **Purpose**: Live application
- **URL**: https://vebstore.com
- **Database**: Production MongoDB Atlas
- **Features**: High availability, scalability, monitoring

### Infrastructure Requirements

#### Minimum Requirements
- **CPU**: 2 cores minimum, 4 cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 50GB SSD minimum, 100GB recommended
- **Network**: 100Mbps minimum, 1Gbps recommended
- **OS**: Ubuntu 20.04 LTS or CentOS 8

#### Recommended Production Setup
- **Load Balancer**: Nginx or AWS ALB
- **Application Servers**: 2-4 instances
- **Database**: MongoDB Atlas M30 cluster
- **Cache**: Redis Cluster
- **Storage**: Cloudinary or AWS S3
- **CDN**: Cloudflare or AWS CloudFront

### Security Considerations

#### Network Security
- **Firewall**: Configure UFW or AWS Security Groups
- **SSL/TLS**: Enable HTTPS with valid certificates
- **VPN**: Secure access to infrastructure
- **DDoS Protection**: Cloudflare or AWS Shield

#### Application Security
- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control
- **Input Validation**: Sanitize all user inputs
- **Data Encryption**: Encrypt sensitive data at rest and in transit

---

## 2. Local Development Setup

### Prerequisites

#### System Requirements
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **MongoDB**: Version 6.x or higher
- **Redis**: Version 7.x or higher
- **Git**: Version 2.x or higher

#### Development Tools
- **IDE**: VS Code, WebStorm, or similar
- **Browser**: Chrome with React Developer Tools
- **API Testing**: Postman or Insomnia
- **Database GUI**: MongoDB Compass

### Environment Configuration

#### Backend Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/vebstore/vebstore-backend.git
   cd vebstore-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env File**
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=8000
   FRONTEND_URL=http://localhost:3000
   ADMIN_URL=http://localhost:5174

   # Database Configuration
   MONGODB_URL=mongodb://localhost:27017/vebstore_dev
   REDIS_URL=redis://localhost:6379

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   # Admin Credentials
   ADMIN_EMAIL=admin@vebstore.com
   ADMIN_PASSWORD=admin123

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # Payment Configuration
   RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=your-razorpay-secret

   # Cloudinary Configuration
   CLOUDINARY_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret

   # Other Services
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/vebstore/vebstore-frontend.git
   cd vebstore-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env File**
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

5. **Start Frontend Server**
   ```bash
   npm run dev
   ```

#### Admin Panel Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/vebstore/vebstore-admin.git
   cd vebstore-admin
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env File**
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   ```

5. **Start Admin Server**
   ```bash
   npm run dev
   ```

### Database Setup

#### MongoDB Installation

1. **Install MongoDB (Ubuntu)**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB Service**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Create Database**
   ```bash
   mongo
   use vebstore_dev
   db.createCollection("users")
   db.createCollection("products")
   db.createCollection("orders")
   ```

#### Redis Installation

1. **Install Redis (Ubuntu)**
   ```bash
   sudo apt update
   sudo apt install redis-server
   ```

2. **Start Redis Service**
   ```bash
   sudo systemctl start redis-server
   sudo systemctl enable redis-server
   ```

### Running the Application

#### Development Servers

1. **Backend Server**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:8000
   ```

2. **Frontend Server**
   ```bash
   cd frontend
   npm run dev
   # Server runs on http://localhost:3000
   ```

3. **Admin Server**
   ```bash
   cd admin
   npm run dev
   # Server runs on http://localhost:5174
   ```

#### Access Points

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:5174
- **Backend API**: http://localhost:8000/api
- **API Documentation**: http://localhost:8000/api-docs

---

## 3. Staging Deployment

### Staging Environment

#### Environment Configuration

1. **Staging .env File**
   ```env
   NODE_ENV=staging
   PORT=8000
   FRONTEND_URL=https://staging.vebstore.com
   ADMIN_URL=https://staging-admin.vebstore.com

   MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/vebstore_staging
   REDIS_URL=redis://staging-redis:6379

   JWT_SECRET=staging-jwt-secret-key
   JWT_EXPIRES_IN=24h

   RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=staging-razorpay-secret
   ```

2. **Database Setup**
   - Create staging database
   - Seed with test data
   - Configure indexes
   - Set up replication

#### CI/CD Pipeline

1. **GitHub Actions Workflow**
   ```yaml
   name: Deploy to Staging
   on:
     push:
       branches: [develop]

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run test
         - run: npm run build

     deploy:
       needs: test
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Deploy to staging
           run: |
             ssh user@staging-server "
               cd /var/www/vebstore-staging
               git pull origin develop
               npm ci
               npm run build
               pm2 restart staging-app
             "
   ```

2. **Deployment Script**
   ```bash
   #!/bin/bash
   # deploy-staging.sh

   echo "Starting staging deployment..."

   # Pull latest code
   git pull origin develop

   # Install dependencies
   npm ci --production

   # Build application
   npm run build

   # Restart application
   pm2 restart staging-app

   # Run health check
   curl -f http://localhost:8000/health || exit 1

   echo "Staging deployment completed successfully!"
   ```

### Testing Procedures

#### Automated Testing

1. **Unit Tests**
   ```bash
   npm run test:unit
   ```

2. **Integration Tests**
   ```bash
   npm run test:integration
   ```

3. **E2E Tests**
   ```bash
   npm run test:e2e
   ```

#### Manual Testing

1. **Functionality Testing**
   - User registration and login
   - Product browsing and search
   - Shopping cart functionality
   - Checkout process
   - Payment processing

2. **Performance Testing**
   - Load testing with Artillery
   - Stress testing
   - Performance profiling

3. **Security Testing**
   - Authentication testing
   - Authorization testing
   - Input validation testing
   - SQL injection testing

### Quality Assurance

#### Code Quality

1. **ESLint Configuration**
   ```json
   {
     "extends": ["react-app", "airbnb"],
     "rules": {
       "no-console": "warn",
       "no-unused-vars": "error",
       "prefer-const": "error"
     }
   }
   ```

2. **Prettier Configuration**
   ```json
   {
     "semi": true,
     "trailingComma": "es5",
     "singleQuote": true,
     "printWidth": 80,
     "tabWidth": 2
   }
   ```

#### Code Review Process

1. **Pull Request Requirements**
   - All tests must pass
   - Code coverage > 80%
   - No ESLint errors
   - Manual review approval

2. **Review Checklist**
   - Code follows style guidelines
   - Functions are properly documented
   - Error handling is implemented
   - Security best practices are followed

---

## 4. Production Deployment

### Production Architecture

#### High Availability Setup

```
┌─────────────────────────────────────────────────────────┐
│                    Production Architecture                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Load Balancer (AWS ALB)               │ │
│  └─────────────────────────────────────────────────────┘ │
│                                 │                       │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Auto Scaling Group                     │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ │
│  │  │   Instance  │ │   Instance  │ │   Instance  │ │ │
│  │  │     1       │ │     2       │ │     3       │ │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
│                                 │                       │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Database Cluster                       │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ │
│  │  │   Primary    │ │   Secondary  │ │   Arbiter    │ │ │
│  │  │   MongoDB    │ │   MongoDB    │ │   MongoDB    │ │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
│                                 │                       │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Cache Cluster                           │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ │
│  │  │  Redis Node  │ │  Redis Node  │ │  Redis Node  │ │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Infrastructure Components

1. **Load Balancer**
   - AWS Application Load Balancer
   - SSL termination
   - Health checks
   - Auto-routing

2. **Application Servers**
   - EC2 instances (t3.medium or larger)
   - Auto Scaling Group
   - Elastic Load Balancer
   - Health monitoring

3. **Database**
   - MongoDB Atlas M30 cluster
   - 3-node replica set
   - Automatic failover
   - Daily backups

4. **Cache**
   - Redis ElastiCache cluster
   - Multi-AZ deployment
   - Automatic failover
   - Data persistence

### Deployment Process

#### Production Deployment Steps

1. **Pre-deployment Checklist**
   ```bash
   #!/bin/bash
   # pre-deploy-checklist.sh

   echo "Running pre-deployment checklist..."

   # Check environment variables
   if [ -z "$MONGODB_URL" ]; then
     echo "Error: MONGODB_URL not set"
     exit 1
   fi

   # Run tests
   npm run test
   if [ $? -ne 0 ]; then
     echo "Error: Tests failed"
     exit 1
   fi

   # Check code quality
   npm run lint
   if [ $? -ne 0 ]; then
     echo "Error: Linting failed"
     exit 1
   fi

   # Build application
   npm run build
   if [ $? -ne 0 ]; then
     echo "Error: Build failed"
     exit 1
   fi

   echo "Pre-deployment checklist completed successfully!"
   ```

2. **Deployment Script**
   ```bash
   #!/bin/bash
   # deploy-production.sh

   set -e

   echo "Starting production deployment..."

   # Create backup
   ./scripts/backup-database.sh

   # Pull latest code
   git pull origin main

   # Install dependencies
   npm ci --production

   # Build application
   npm run build

   # Run database migrations
   npm run migrate

   # Restart application with zero downtime
   pm2 reload production-app

   # Run health checks
   ./scripts/health-check.sh

   # Clear cache
   npm run cache:clear

   echo "Production deployment completed successfully!"
   ```

3. **Rollback Script**
   ```bash
   #!/bin/bash
   # rollback-production.sh

   echo "Starting production rollback..."

   # Get previous commit
   PREVIOUS_COMMIT=$(git rev-parse HEAD~1)

   # Checkout previous commit
   git checkout $PREVIOUS_COMMIT

   # Install dependencies
   npm ci --production

   # Build application
   npm run build

   # Restart application
   pm2 restart production-app

   # Run health checks
   ./scripts/health-check.sh

   echo "Production rollback completed!"
   ```

#### Blue-Green Deployment

1. **Blue Environment Setup**
   ```bash
   # Setup blue environment
   docker-compose -f docker-compose.blue.yml up -d
   ```

2. **Green Environment Setup**
   ```bash
   # Setup green environment
   docker-compose -f docker-compose.green.yml up -d
   ```

3. **Switch Traffic**
   ```bash
   # Switch load balancer to green
   aws elbv2 modify-listener \
     --listener-arn arn:aws:elasticloadbalancing:... \
     --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...:targetgroup/green/...
   ```

### Monitoring and Logging

#### Application Monitoring

1. **Health Check Endpoint**
   ```javascript
   // health-check.js
   app.get('/health', async (req, res) => {
     try {
       // Check database connection
       await mongoose.connection.db.admin().ping()
       
       // Check Redis connection
       await redisClient.ping()
       
       // Check memory usage
       const memUsage = process.memoryUsage()
       
       res.json({
         status: 'healthy',
         timestamp: new Date().toISOString(),
         uptime: process.uptime(),
         memory: memUsage,
         database: 'connected',
         cache: 'connected'
       })
     } catch (error) {
       res.status(503).json({
         status: 'unhealthy',
         error: error.message,
         timestamp: new Date().toISOString()
       })
     }
   })
   ```

2. **Metrics Collection**
   ```javascript
   // metrics.js
   const prometheus = require('prom-client')

   // Create metrics
   const httpRequestDuration = new prometheus.Histogram({
     name: 'http_request_duration_seconds',
     help: 'Duration of HTTP requests in seconds',
     labelNames: ['method', 'route', 'status']
   })

   const httpRequestTotal = new prometheus.Counter({
     name: 'http_requests_total',
     help: 'Total number of HTTP requests',
     labelNames: ['method', 'route', 'status']
   })

   // Middleware to collect metrics
   app.use((req, res, next) => {
     const start = Date.now()
     
     res.on('finish', () => {
       const duration = (Date.now() - start) / 1000
       
       httpRequestDuration
         .labels(req.method, req.route?.path || req.path, res.statusCode)
         .observe(duration)
         
       httpRequestTotal
         .labels(req.method, req.route?.path || req.path, res.statusCode)
         .inc()
     })
     
     next()
   })
   ```

#### Log Management

1. **Winston Configuration**
   ```javascript
   // logger.js
   const winston = require('winston')

   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.errors({ stack: true }),
       winston.format.json()
     ),
     defaultMeta: { service: 'vebstore' },
     transports: [
       new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
       new winston.transports.File({ filename: 'logs/combined.log' }),
       new winston.transports.Console({
         format: winston.format.simple()
       })
     ]
   })

   module.exports = logger
   ```

2. **Log Rotation**
   ```javascript
   // log-rotation.js
   const winston = require('winston')
   require('winston-daily-rotate-file')

   const transport = new winston.transports.DailyRotateFile({
     filename: 'logs/application-%DATE%.log',
     datePattern: 'YYYY-MM-DD',
     zippedArchive: true,
     maxSize: '20m',
     maxFiles: '14d'
   })

   const logger = winston.createLogger({
     transports: [transport]
   })
   ```

### Performance Optimization

#### Caching Strategy

1. **Redis Caching**
   ```javascript
   // cache.js
   const redis = require('redis')
   const client = redis.createClient()

   class CacheService {
     async get(key) {
       try {
         const data = await client.get(key)
         return data ? JSON.parse(data) : null
       } catch (error) {
         console.error('Cache get error:', error)
         return null
       }
     }

     async set(key, data, ttl = 3600) {
       try {
         await client.setex(key, ttl, JSON.stringify(data))
       } catch (error) {
         console.error('Cache set error:', error)
       }
     }

     async del(key) {
       try {
         await client.del(key)
       } catch (error) {
         console.error('Cache delete error:', error)
       }
     }
   }

   module.exports = new CacheService()
   ```

2. **Application Caching**
   ```javascript
   // product-cache.js
   const cache = require('./cache')
   const Product = require('../models/Product')

   class ProductService {
     async getProducts(filters = {}) {
       const cacheKey = `products:${JSON.stringify(filters)}`
       
       // Try to get from cache
       let products = await cache.get(cacheKey)
       
       if (!products) {
         // Get from database
         products = await Product.find(filters)
           .populate('category')
           .lean()
         
         // Cache for 1 hour
         await cache.set(cacheKey, products, 3600)
       }
       
       return products
     }

     async createProduct(productData) {
       const product = await Product.create(productData)
       
       // Clear cache
       await cache.del('products:{}')
       
       return product
     }
   }

   module.exports = ProductService
   ```

#### Database Optimization

1. **Indexing Strategy**
   ```javascript
   // indexes.js
   const Product = require('../models/Product')

   // Create indexes
   Product.createIndexes([
     { name: 'text', description: 'text' },
     { category: 1, subCategory: 1 },
     { price: 1 },
     { status: 1 },
     { averageRating: -1 },
     { createdAt: -1 }
   ])

   const Order = require('../models/Order')

   Order.createIndexes([
     { userId: 1 },
     { status: 1 },
     { createdAt: -1 },
     { totalAmount: -1 }
   ])
   ```

2. **Query Optimization**
   ```javascript
   // optimized-queries.js
   class OrderService {
     async getOrderStats(dateRange) {
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
             avgOrderValue: { $avg: '$totalAmount' }
           }
         }
       ]

       const result = await Order.aggregate(pipeline)
       return result[0] || {}
     }
   }
   ```

---

## 5. Cloud Deployment

### AWS Deployment

#### Infrastructure Setup

1. **VPC Configuration**
   ```bash
   # Create VPC
   aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=vebstore-vpc}]'

   # Create subnets
   aws ec2 create-subnet --vpc-id vpc-id --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
   aws ec2 create-subnet --vpc-id vpc-id --cidr-block 10.0.2.0/24 --availability-zone us-east-1b

   # Create internet gateway
   aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=vebstore-igw}]'

   # Attach internet gateway
   aws ec2 attach-internet-gateway --vpc-id vpc-id --internet-gateway-id igw-id
   ```

2. **Security Groups**
   ```bash
   # Create security group
   aws ec2 create-security-group --group-name vebstore-sg --description "VEBStore security group" --vpc-id vpc-id

   # Add rules
   aws ec2 authorize-security-group-ingress --group-id sg-id --protocol tcp --port 80 --cidr 0.0.0.0/0
   aws ec2 authorize-security-group-ingress --group-id sg-id --protocol tcp --port 443 --cidr 0.0.0.0/0
   aws ec2 authorize-security-group-ingress --group-id sg-id --protocol tcp --port 8000 --source-group sg-id
   ```

3. **EC2 Instances**
   ```bash
   # Launch template
   aws ec2 create-launch-template --launch-template-name vebstore-template --launch-template-data file://launch-template.json

   # Auto Scaling Group
   aws autoscaling create-auto-scaling-group --auto-scaling-group-name vebstore-asg --launch-template-name vebstore-template --min-size 2 --max-size 6 --desired-capacity 3 --vpc-zone-identifier subnet-id1,subnet-id2

   # Load Balancer
   aws elbv2 create-load-balancer --name vebstore-alb --subnets subnet-id1,subnet-id2 --security-groups sg-id
   ```

#### Deployment Script

1. **User Data Script**
   ```bash
   #!/bin/bash
   # user-data.sh

   # Update system
   apt update && apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt-get install -y nodejs

   # Install PM2
   npm install -g pm2

   # Create app directory
   mkdir -p /var/www/vebstore
   cd /var/www/vebstore

   # Clone repository
   git clone https://github.com/vebstore/vebstore-backend.git .

   # Install dependencies
   npm ci --production

   # Build application
   npm run build

   # Start application
   pm2 start ecosystem.config.js

   # Setup PM2 startup
   pm2 startup
   pm2 save
   ```

2. **PM2 Configuration**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'vebstore',
       script: 'index.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 8000
       },
       error_file: '/var/log/vebstore/error.log',
       out_file: '/var/log/vebstore/out.log',
       log_file: '/var/log/vebstore/combined.log',
       time: true,
       max_memory_restart: '1G',
       node_args: '--max-old-space-size=1024'
     }]
   }
   ```

### Google Cloud Platform

#### GCP Setup

1. **Project Setup**
   ```bash
   # Create project
   gcloud projects create vebstore-production

   # Set project
   gcloud config set project vebstore-production

   # Enable APIs
   gcloud services enable compute.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   ```

2. **Cloud Run Deployment**
   ```bash
   # Build and deploy
   gcloud builds submit --tag gcr.io/vebstore-production/vebstore-backend

   # Deploy to Cloud Run
   gcloud run deploy vebstore-backend \
     --image gcr.io/vebstore-production/vebstore-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 1Gi \
     --cpu 1 \
     --max-instances 10
   ```

### Microsoft Azure

#### Azure Setup

1. **Resource Group**
   ```bash
   # Create resource group
   az group create --name vebstore-rg --location eastus
   ```

2. **App Service**
   ```bash
   # Create app service plan
   az appservice plan create --name vebstore-plan --resource-group vebstore-rg --sku B1 --is-linux

   # Create web app
   az webapp create --name vebstore-app --resource-group vebstore-rg --plan vebstore-plan --runtime "NODE|18-lts"

   # Deploy
   az webapp up --name vebstore-app --resource-group vebstore-rg --location eastus
   ```

### Heroku Deployment

#### Heroku Setup

1. **Create App**
   ```bash
   # Login to Heroku
   heroku login

   # Create app
   heroku create vebstore-production

   # Add addons
   heroku addons:create mongolab:sandbox
   heroku addons:create rediscloud
   ```

2. **Deploy**
   ```bash
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-jwt-secret

   # Deploy
   git push heroku main

   # Scale dynos
   heroku ps:scale web=2
   ```

---

## 6. Container Deployment

### Docker Configuration

#### Dockerfile

1. **Backend Dockerfile**
   ```dockerfile
   # Dockerfile
   FROM node:18-alpine

   # Set working directory
   WORKDIR /app

   # Copy package files
   COPY package*.json ./

   # Install dependencies
   RUN npm ci --only=production && npm cache clean --force

   # Copy application code
   COPY . .

   # Create non-root user
   RUN addgroup -g 1001 -S nodejs
   RUN adduser -S nodejs -u 1001

   # Change ownership
   RUN chown -R nodejs:nodejs /app
   USER nodejs

   # Expose port
   EXPOSE 8000

   # Health check
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
     CMD curl -f http://localhost:8000/health || exit 1

   # Start application
   CMD ["npm", "start"]
   ```

2. **Frontend Dockerfile**
   ```dockerfile
   # Dockerfile.frontend
   FROM node:18-alpine as build

   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Nginx Configuration**
   ```nginx
   # nginx.conf
   events {
     worker_connections 1024;
   }

   http {
     include /etc/nginx/mime.types;
     default_type application/octet-stream;

     server {
       listen 80;
       server_name localhost;
       root /usr/share/nginx/html;
       index index.html;

       location / {
         try_files $uri $uri/ /index.html;
       }

       location /api {
         proxy_pass http://backend:8000;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_set_header X-Forwarded-Proto $scheme;
       }
     }
   }
   ```

#### Docker Compose

1. **Development Docker Compose**
   ```yaml
   # docker-compose.dev.yml
   version: '3.8'

   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - NODE_ENV=development
         - MONGODB_URL=mongodb://mongo:27017/vebstore_dev
         - REDIS_URL=redis://redis:6379
       depends_on:
         - mongo
         - redis
       volumes:
         - ./backend:/app
         - /app/node_modules

     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       environment:
         - VITE_BACKEND_URL=http://localhost:8000
       volumes:
         - ./frontend:/app
         - /app/node_modules

     admin:
       build: ./admin
       ports:
         - "5174:5174"
       environment:
         - VITE_BACKEND_URL=http://localhost:8000
       volumes:
         - ./admin:/app
         - /app/node_modules

     mongo:
       image: mongo:6.0
       ports:
         - "27017:27017"
       volumes:
         - mongo_data:/data/db
       environment:
         - MONGO_INITDB_ROOT_USERNAME=admin
         - MONGO_INITDB_ROOT_PASSWORD=password

     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
       volumes:
         - redis_data:/data

   volumes:
     mongo_data:
     redis_data:
   ```

2. **Production Docker Compose**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'

   services:
     backend:
       build: ./backend
       restart: unless-stopped
       environment:
         - NODE_ENV=production
         - MONGODB_URL=${MONGODB_URL}
         - REDIS_URL=${REDIS_URL}
         - JWT_SECRET=${JWT_SECRET}
       depends_on:
         - redis
       deploy:
         replicas: 3
         resources:
           limits:
             memory: 512M
           reservations:
             memory: 256M

     frontend:
       build: ./frontend
       restart: unless-stopped
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./ssl:/etc/nginx/ssl:ro
       depends_on:
         - backend

     redis:
       image: redis:7-alpine
       restart: unless-stopped
       volumes:
         - redis_data:/data
       command: redis-server --appendonly yes
       deploy:
         resources:
           limits:
             memory: 256M
           reservations:
             memory: 128M

   volumes:
     redis_data:
   ```

### Kubernetes Setup

#### Kubernetes Manifests

1. **Namespace**
   ```yaml
   # namespace.yaml
   apiVersion: v1
   kind: Namespace
   metadata:
     name: vebstore
   ```

2. **ConfigMap**
   ```yaml
   # configmap.yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: vebstore-config
     namespace: vebstore
   data:
     NODE_ENV: "production"
     PORT: "8000"
   ```

3. **Secret**
   ```yaml
   # secret.yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: vebstore-secrets
     namespace: vebstore
   type: Opaque
   data:
     mongodb-url: <base64-encoded-url>
     jwt-secret: <base64-encoded-secret>
     redis-url: <base64-encoded-url>
   ```

4. **Deployment**
   ```yaml
   # deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: vebstore-backend
     namespace: vebstore
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: vebstore-backend
     template:
       metadata:
         labels:
           app: vebstore-backend
       spec:
         containers:
         - name: backend
           image: vebstore/backend:latest
           ports:
           - containerPort: 8000
           envFrom:
           - configMapRef:
               name: vebstore-config
           - secretRef:
               name: vebstore-secrets
           resources:
             requests:
               memory: "256Mi"
               cpu: "250m"
             limits:
               memory: "512Mi"
               cpu: "500m"
           livenessProbe:
             httpGet:
               path: /health
               port: 8000
             initialDelaySeconds: 30
             periodSeconds: 10
           readinessProbe:
             httpGet:
               path: /health
               port: 8000
             initialDelaySeconds: 5
             periodSeconds: 5
   ```

5. **Service**
   ```yaml
   # service.yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: vebstore-backend-service
     namespace: vebstore
   spec:
     selector:
       app: vebstore-backend
     ports:
     - protocol: TCP
       port: 8000
       targetPort: 8000
     type: ClusterIP
   ```

6. **Ingress**
   ```yaml
   # ingress.yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: vebstore-ingress
     namespace: vebstore
     annotations:
       kubernetes.io/ingress.class: nginx
       cert-manager.io/cluster-issuer: letsencrypt-prod
   spec:
     tls:
     - hosts:
       - vebstore.com
       secretName: vebstore-tls
     rules:
     - host: vebstore.com
       http:
         paths:
         - path: /api
           pathType: Prefix
           backend:
             service:
               name: vebstore-backend-service
               port:
                 number: 8000
         - path: /
           pathType: Prefix
           backend:
             service:
               name: vebstore-frontend-service
               port:
                 number: 80
   ```

### Container Orchestration

#### Helm Charts

1. **Chart Structure**
   ```
   vebstore/
   ├── Chart.yaml
   ├── values.yaml
   ├── templates/
   │   ├── deployment.yaml
   │   ├── service.yaml
   │   ├── ingress.yaml
   │   ├── configmap.yaml
   │   └── secret.yaml
   └── charts/
   ```

2. **Values.yaml**
   ```yaml
   # values.yaml
   replicaCount: 3

   image:
     repository: vebstore/backend
     tag: latest
     pullPolicy: IfNotPresent

   service:
     type: ClusterIP
     port: 8000

   ingress:
     enabled: true
     host: vebstore.com
     tls: true

   resources:
     limits:
       cpu: 500m
       memory: 512Mi
     requests:
       cpu: 250m
       memory: 256Mi

   autoscaling:
     enabled: true
     minReplicas: 2
     maxReplicas: 10
     targetCPUUtilizationPercentage: 80
   ```

---

## 7. Database Deployment

### MongoDB Atlas

#### Atlas Setup

1. **Create Cluster**
   - Login to MongoDB Atlas
   - Create new cluster
   - Choose cloud provider and region
   - Select cluster tier (M30+ for production)
   - Configure cluster settings

2. **Database Configuration**
   ```javascript
   // Connect to Atlas
   const mongoose = require('mongoose')

   const connectDB = async () => {
     try {
       const conn = await mongoose.connect(process.env.MONGODB_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         maxPoolSize: 10,
         serverSelectionTimeoutMS: 5000,
         socketTimeoutMS: 45000,
       })

       console.log(`MongoDB Connected: ${conn.connection.host}`)
     } catch (error) {
       console.error('Database connection error:', error)
       process.exit(1)
     }
   }

   module.exports = connectDB
   ```

3. **Index Creation**
   ```javascript
   // indexes.js
   const Product = require('../models/Product')

   const createIndexes = async () => {
     try {
       await Product.createIndexes([
         { name: 'text', description: 'text' },
         { category: 1, subCategory: 1 },
         { price: 1 },
         { status: 1 },
         { averageRating: -1 },
         { createdAt: -1 }
       ])

       console.log('Indexes created successfully')
     } catch (error) {
       console.error('Index creation error:', error)
     }
   }

   module.exports = createIndexes
   ```

### Self-hosted MongoDB

#### MongoDB Setup

1. **Installation**
   ```bash
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Configuration**
   ```yaml
   # /etc/mongod.conf
   storage:
     dbPath: /var/lib/mongodb
     journal:
       enabled: true

   systemLog:
     destination: file
     logAppend: true
     path: /var/log/mongodb/mongod.log

   net:
     port: 27017
     bindIp: 127.0.0.1,::1

   replication:
     replSetName: "vebstore-replica"

   security:
     authorization: enabled
   ```

3. **Replica Set**
   ```javascript
   // initiate-replica.js
   const { MongoClient } = require('mongodb')

   const initiateReplica = async () => {
     const client = new MongoClient('mongodb://localhost:27017')
     
     try {
       await client.connect()
       
       const admin = client.db('admin')
       await admin.command({
         replSetInitiate: {
           _id: 'vebstore-replica',
           members: [
             { _id: 0, host: 'localhost:27017' },
             { _id: 1, host: 'mongo2:27017' },
             { _id: 2, host: 'mongo3:27017' }
           ]
         }
       })
       
       console.log('Replica set initiated')
     } catch (error) {
       console.error('Replica set initiation error:', error)
     } finally {
       await client.close()
     }
   }

   initiateReplica()
   ```

### Database Migration

#### Migration Scripts

1. **Migration Framework**
   ```javascript
   // migration.js
   const mongoose = require('mongoose')
   const fs = require('fs')
   const path = require('path')

   class Migration {
     constructor() {
       this.migrationsPath = path.join(__dirname, 'migrations')
       this.connection = null
     }

     async connect() {
       this.connection = await mongoose.connect(process.env.MONGODB_URL)
     }

     async disconnect() {
       await this.connection.disconnect()
     }

     async runMigrations() {
       const migrations = await this.getMigrations()
       
       for (const migration of migrations) {
         await this.runMigration(migration)
       }
     }

     async getMigrations() {
       const files = fs.readdirSync(this.migrationsPath)
       return files
         .filter(file => file.endsWith('.js'))
         .sort()
         .map(file => require(path.join(this.migrationsPath, file)))
     }

     async runMigration(migration) {
       try {
         console.log(`Running migration: ${migration.name}`)
         await migration.up(this.connection)
         console.log(`Migration completed: ${migration.name}`)
       } catch (error) {
         console.error(`Migration failed: ${migration.name}`, error)
         throw error
       }
     }
   }

   module.exports = Migration
   ```

2. **Sample Migration**
   ```javascript
   // migrations/001_create_users.js
   const createUserCollection = async (connection) => {
     const db = connection.db('vebstore')
     
     // Create collection with validation
     await db.createCollection('users', {
       validator: {
         $jsonSchema: {
           bsonType: 'object',
           required: ['email', 'password'],
           properties: {
             email: {
               bsonType: 'string',
               pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
             },
             password: {
               bsonType: 'string',
               minLength: 8
             }
           }
         }
       }
     })

     // Create indexes
     await db.collection('users').createIndex({ email: 1 }, { unique: true })
     await db.collection('users').createIndex({ createdAt: -1 })
   }

   module.exports = {
     name: '001_create_users',
     up: createUserCollection
   }
   ```

### Backup and Recovery

#### Backup Strategy

1. **Automated Backups**
   ```bash
   #!/bin/bash
   # backup-mongodb.sh

   BACKUP_DIR="/backups/mongodb"
   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_NAME="vebstore_backup_$DATE"

   # Create backup directory
   mkdir -p $BACKUP_DIR

   # Create backup
   mongodump --uri="$MONGODB_URL" --out="$BACKUP_DIR/$BACKUP_NAME"

   # Compress backup
   tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"

   # Remove uncompressed backup
   rm -rf "$BACKUP_DIR/$BACKUP_NAME"

   # Upload to cloud storage (AWS S3)
   aws s3 cp "$BACKUP_DIR/$BACKUP_NAME.tar.gz" "s3://vebstore-backups/$BACKUP_NAME.tar.gz"

   # Clean up old backups (keep last 7 days)
   find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

   echo "Backup completed: $BACKUP_NAME"
   ```

2. **Recovery Script**
   ```bash
   #!/bin/bash
   # restore-mongodb.sh

   BACKUP_NAME=$1
   RESTORE_DIR="/tmp/mongodb_restore"

   if [ -z "$BACKUP_NAME" ]; then
     echo "Usage: $0 <backup_name>"
     exit 1
   fi

   # Download backup from S3
   aws s3 cp "s3://vebstore-backups/$BACKUP_NAME.tar.gz" "/tmp/$BACKUP_NAME.tar.gz"

   # Extract backup
   mkdir -p $RESTORE_DIR
   tar -xzf "/tmp/$BACKUP_NAME.tar.gz" -C $RESTORE_DIR

   # Restore database
   mongorestore --uri="$MONGODB_URL" "$RESTORE_DIR/$BACKUP_NAME"

   # Clean up
   rm -rf "/tmp/$BACKUP_NAME.tar.gz" $RESTORE_DIR

   echo "Database restored from: $BACKUP_NAME"
   ```

---

## 8. Security Deployment

### SSL/TLS Configuration

#### Let's Encrypt Setup

1. **Certbot Installation**
   ```bash
   # Install Certbot
   sudo apt update
   sudo apt install certbot python3-certbot-nginx

   # Obtain certificate
   sudo certbot --nginx -d vebstore.com -d www.vebstore.com

   # Auto-renewal
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

2. **Nginx SSL Configuration**
   ```nginx
   # nginx.conf
   server {
       listen 80;
       server_name vebstore.com www.vebstore.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name vebstore.com www.vebstore.com;

       ssl_certificate /etc/letsencrypt/live/vebstore.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/vebstore.com/privkey.pem;

       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
       ssl_prefer_server_ciphers off;

       ssl_session_cache shared:SSL:10m;
       ssl_session_timeout 10m;

       add_header Strict-Transport-Security "max-age=31536000" always;
       add_header X-Frame-Options DENY;
       add_header X-Content-Type-Options nosniff;
       add_header X-XSS-Protection "1; mode=block";

       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

### Firewall Setup

#### UFW Configuration

```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application port (if needed)
sudo ufw allow 8000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

#### AWS Security Groups

```bash
# Create security group
aws ec2 create-security-group --group-name vebstore-sg --description "VEBStore security group"

# Add rules
aws ec2 authorize-security-group-ingress --group-id sg-id --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-id --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-id --protocol tcp --port 443 --cidr 0.0.0.0/0
```

### Security Headers

#### Helmet.js Configuration

```javascript
// security.js
const helmet = require('helmet')

const securityMiddleware = helmet({
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
})

module.exports = securityMiddleware
```

### Access Control

#### Rate Limiting

```javascript
// rate-limiting.js
const rateLimit = require('express-rate-limit')

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests',
      message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false
  })
}

const limits = {
  general: createRateLimit(15 * 60 * 1000, 100, 'Too many requests from this IP'),
  auth: createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts'),
  upload: createRateLimit(60 * 60 * 1000, 10, 'Too many upload attempts')
}

module.exports = limits
```

---

## 9. Monitoring and Maintenance

### Application Monitoring

#### Prometheus Setup

1. **Prometheus Configuration**
   ```yaml
   # prometheus.yml
   global:
     scrape_interval: 15s

   scrape_configs:
     - job_name: 'vebstore'
       static_configs:
         - targets: ['localhost:8000']
       metrics_path: '/metrics'
       scrape_interval: 5s
   ```

2. **Metrics Exporter**
   ```javascript
   // metrics.js
   const prometheus = require('prom-client')

   // Create metrics
   const httpRequestDuration = new prometheus.Histogram({
     name: 'http_request_duration_seconds',
     help: 'Duration of HTTP requests in seconds',
     labelNames: ['method', 'route', 'status']
   })

   const httpRequestTotal = new prometheus.Counter({
     name: 'http_requests_total',
     help: 'Total number of HTTP requests',
     labelNames: ['method', 'route', 'status']
   })

   const activeConnections = new prometheus.Gauge({
     name: 'active_connections',
     help: 'Number of active connections'
   })

   // Middleware to collect metrics
   const metricsMiddleware = (req, res, next) => {
     const start = Date.now()
     
     res.on('finish', () => {
       const duration = (Date.now() - start) / 1000
       
       httpRequestDuration
         .labels(req.method, req.route?.path || req.path, res.statusCode)
         .observe(duration)
         
       httpRequestTotal
         .labels(req.method, req.route?.path || req.path, res.statusCode)
         .inc()
     })
     
     next()
   }

   module.exports = {
     metricsMiddleware,
     register: prometheus.register,
     metrics: {
       httpRequestDuration,
       httpRequestTotal,
       activeConnections
     }
   }
   ```

#### Grafana Dashboard

1. **Dashboard Configuration**
   ```json
   {
     "dashboard": {
       "title": "VEBStore Dashboard",
       "panels": [
         {
           "title": "Request Rate",
           "type": "graph",
           "targets": [
             {
               "expr": "rate(http_requests_total[5m])",
               "legendFormat": "{{method}} {{route}}"
             }
           ]
         },
         {
           "title": "Response Time",
           "type": "graph",
           "targets": [
             {
               "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
               "legendFormat": "95th percentile"
             }
           ]
         }
       ]
     }
   }
   ```

### Performance Monitoring

#### APM Integration

1. **New Relic Setup**
   ```javascript
   // newrelic.js
   require('newrelic')

   module.exports = {
     app_name: 'VEBStore',
     license_key: process.env.NEW_RELIC_LICENSE_KEY,
     logging: {
       level: 'info'
     }
   }
   ```

2. **Custom Metrics**
   ```javascript
   // custom-metrics.js
   const newrelic = require('newrelic')

   class CustomMetrics {
     static recordProductView(productId) {
       newrelic.recordMetric('Custom/ProductView', 1, {
         productId: productId
       })
     }

     static recordOrderAmount(amount) {
       newrelic.recordMetric('Custom/OrderAmount', amount)
     }

     static recordCacheHit(cacheKey) {
       newrelic.recordMetric('Custom/CacheHit', 1, {
         cacheKey: cacheKey
       })
     }
   }

   module.exports = CustomMetrics
   ```

### Error Tracking

#### Sentry Integration

1. **Sentry Configuration**
   ```javascript
   // sentry.js
   const Sentry = require('@sentry/node')

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
     integrations: [
       new Sentry.Integrations.Http({ tracing: true })
     ]
   })

   module.exports = Sentry
   ```

2. **Error Handling**
   ```javascript
   // error-handler.js
   const Sentry = require('./sentry')

   const errorHandler = (err, req, res, next) => {
     // Log to Sentry
     Sentry.captureException(err, {
       req,
       user: req.user
     })

     // Send error response
     res.status(err.status || 500).json({
       error: {
         message: err.message,
         ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
       }
     })
   }

   module.exports = errorHandler
   ```

### Log Management

#### ELK Stack Setup

1. **Logstash Configuration**
   ```ruby
   # logstash.conf
   input {
     beats {
       port => 5044
     }
   }

   filter {
     if [fields][service] == "vebstore" {
       json {
         source => "message"
       }
       
       date {
         match => [ "timestamp", "ISO8601" ]
       }
       
       if [level] == "error" {
         mutate {
           add_tag => [ "error" ]
         }
       }
     }
   }

   output {
     elasticsearch {
       hosts => ["elasticsearch:9200"]
       index => "vebstore-%{+YYYY.MM.dd}"
     }
   }
   ```

2. **Filebeat Configuration**
   ```yaml
   # filebeat.yml
   filebeat.inputs:
   - type: log
     enabled: true
     paths:
       - /var/log/vebstore/*.log
     fields:
       service: vebstore
     fields_under_root: true

   output.logstash:
     hosts: ["logstash:5044"]

   logging.level: info
   logging.to_files: true
   logging.files:
     path: /var/log/filebeat
     name: filebeat
     keepfiles: 7
     permissions: 0644
   ```

---

## 10. Troubleshooting

### Common Issues

#### Application Issues

1. **Server Not Starting**
   ```bash
   # Check logs
   pm2 logs vebstore

   # Check port usage
   netstat -tlnp | grep :8000

   # Check process
   ps aux | grep node

   # Restart application
   pm2 restart vebstore
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod

   # Test connection
   mongo --eval "db.adminCommand('ismaster')"

   # Check logs
   tail -f /var/log/mongodb/mongod.log

   # Restart MongoDB
   sudo systemctl restart mongod
   ```

3. **Redis Connection Issues**
   ```bash
   # Check Redis status
   sudo systemctl status redis

   # Test connection
   redis-cli ping

   # Check logs
   tail -f /var/log/redis/redis.log

   # Restart Redis
   sudo systemctl restart redis
   ```

#### Performance Issues

1. **High CPU Usage**
   ```bash
   # Check CPU usage
   top
   htop

   # Check Node.js process
   ps aux | grep node

   # Profile application
   node --prof app.js
   node --prof-process isolate-*.log > processed.txt
   ```

2. **High Memory Usage**
   ```bash
   # Check memory usage
   free -h
   ps aux --sort=-%mem | head

   # Check Node.js memory
   node --inspect app.js

   # Monitor with PM2
   pm2 monit
   ```

3. **Slow Database Queries**
   ```javascript
   // Enable query logging
   mongoose.set('debug', true)

   // Profile queries
   db.collection.find({}).explain('executionStats')

   // Check indexes
   db.collection.getIndexes()
   ```

### Debugging Techniques

#### Application Debugging

1. **Node Inspector**
   ```bash
   # Start with debugging
   node --inspect-brk app.js

   # Connect with Chrome DevTools
   # Open chrome://inspect
   ```

2. **VS Code Debugging**
   ```json
   // .vscode/launch.json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug Node.js",
         "type": "node",
         "request": "launch",
         "program": "${workspaceFolder}/index.js",
         "env": {
           "NODE_ENV": "development"
         },
         "console": "integratedTerminal",
         "restart": true,
         "runtimeExecutable": "nodemon"
       }
     ]
   }
   ```

#### Database Debugging

1. **MongoDB Debugging**
   ```javascript
   // Enable debug mode
   mongoose.set('debug', true)

   // Profile query
   const query = Product.find({ category: 'electronics' })
   query.explain('executionStats', (err, stats) => {
     console.log('Query stats:', stats)
   })
   ```

2. **Redis Debugging**
   ```bash
   # Monitor Redis commands
   redis-cli monitor

   # Check memory usage
   redis-cli info memory

   # Check slow log
   redis-cli slowlog get 10
   ```

### Security Issues

#### Common Security Problems

1. **Brute Force Attacks**
   ```bash
   # Check failed login attempts
   grep "Failed login" /var/log/vebstore/auth.log | tail -100

   # Block IP with fail2ban
   sudo fail2ban-client status vebstore-auth
   ```

2. **SQL Injection Attempts**
   ```javascript
   // Check for suspicious queries
   const suspiciousPatterns = [
     /union.*select/i,
     /drop.*table/i,
     /insert.*into/i
   ]

   app.use((req, res, next) => {
     const query = JSON.stringify(req.body)
     if (suspiciousPatterns.some(pattern => pattern.test(query))) {
       console.warn('Suspicious query detected:', query)
       return res.status(400).json({ error: 'Invalid request' })
     }
     next()
   })
   ```

3. **XSS Attempts**
   ```javascript
   // Check for XSS patterns
   const xssPatterns = [
     /<script/i,
     /javascript:/i,
     /on\w+\s*=/i
   ]

   const sanitizeInput = (input) => {
     if (typeof input !== 'string') return input
    
     return input.replace(/[<>]/g, '')
   }
   ```

### Recovery Procedures

#### Data Recovery

1. **Database Recovery**
   ```bash
   # Restore from backup
   mongorestore --uri="$MONGODB_URL" /path/to/backup

   # Point-in-time recovery
   mongorestore --uri="$MONGODB_URL" --oplogReplay /path/to/oplog
   ```

2. **Application Recovery**
   ```bash
   # Rollback to previous version
   git checkout <previous-commit>
   npm ci
   npm run build
   pm2 restart vebstore
   ```

#### Disaster Recovery

1. **Full System Recovery**
   ```bash
   # Restore from backup
   ./scripts/restore-system.sh

   # Verify services
   ./scripts/health-check.sh

   # Monitor system
   ./scripts/monitor-system.sh
   ```

---

*This comprehensive deployment guide provides detailed instructions for deploying the VEBStore platform in various environments, from local development to production cloud deployments.*
