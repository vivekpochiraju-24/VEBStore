# VEBStore API Documentation

## Overview

The VEBStore API provides comprehensive endpoints for managing products, orders, users, and administrative functions. This documentation covers all available endpoints, request/response formats, authentication requirements, and usage examples.

## Base URL

```
Development: http://localhost:8000/api
Production: https://api.vebstore.com/api
```

## Authentication

### JWT Token Authentication

All protected endpoints require a valid JWT token sent in the `Authorization` header or as an HTTP-only cookie.

```http
Authorization: Bearer <jwt_token>
# OR
Cookie: token=<jwt_token>
```

### Token Generation

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6789012345",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "expiresIn": "7d"
}
```

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "64a1b2c3d4e5f6789012345",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Product Endpoints

### Get All Products
```http
GET /products?page=1&limit=20&category=electronics&sort=price:asc&search=laptop
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20, max: 100)
- `category` (string): Filter by category
- `subCategory` (string): Filter by subcategory
- `sort` (string): Sort format (field:direction)
- `search` (string): Search query
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `rating` (number): Minimum rating filter

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "64a1b2c3d4e5f6789012345",
        "name": "Premium Laptop",
        "slug": "premium-laptop",
        "description": "High-performance laptop with latest specs",
        "price": 99999,
        "originalPrice": 119999,
        "discount": 17,
        "images": [
          {
            "url": "https://res.cloudinary.com/vebstore/image/upload/v1/products/laptop1.jpg",
            "alt": "Premium Laptop Front View",
            "isMain": true
          }
        ],
        "category": {
          "_id": "64a1b2c3d4e5f6789012346",
          "name": "Electronics",
          "slug": "electronics"
        },
        "subCategory": {
          "_id": "64a1b2c3d4e5f6789012347",
          "name": "Laptops",
          "slug": "laptops"
        },
        "brand": "TechBrand",
        "stock": 45,
        "averageRating": 4.5,
        "reviewCount": 128,
        "status": "active",
        "featured": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-20T14:25:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 15,
      "totalProducts": 285,
      "hasNext": true,
      "hasPrev": false,
      "limit": 20
    },
    "filters": {
      "categories": [
        { "name": "Electronics", "count": 95 },
        { "name": "Clothing", "count": 78 }
      ],
      "brands": [
        { "name": "TechBrand", "count": 23 },
        { "name": "StyleCo", "count": 18 }
      ],
      "priceRange": {
        "min": 499,
        "max": 99999
      }
    }
  }
}
```

### Get Single Product
```http
GET /products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "Premium Laptop",
    "slug": "premium-laptop",
    "description": "High-performance laptop with latest specs and premium build quality.",
    "shortDescription": "Powerful laptop for professionals",
    "sku": "LPT-001",
    "price": 99999,
    "originalPrice": 119999,
    "discount": 17,
    "images": [
      {
        "url": "https://res.cloudinary.com/vebstore/image/upload/v1/products/laptop1.jpg",
        "alt": "Premium Laptop Front View",
        "isMain": true,
        "order": 0
      },
      {
        "url": "https://res.cloudinary.com/vebstore/image/upload/v1/products/laptop2.jpg",
        "alt": "Premium Laptop Side View",
        "isMain": false,
        "order": 1
      }
    ],
    "category": {
      "_id": "64a1b2c3d4e5f6789012346",
      "name": "Electronics",
      "slug": "electronics"
    },
    "subCategory": {
      "_id": "64a1b2c3d4e5f6789012347",
      "name": "Laptops",
      "slug": "laptops"
    },
    "brand": "TechBrand",
    "stock": 45,
    "minOrderQuantity": 1,
    "maxOrderQuantity": 5,
    "variants": [
      {
        "name": "Configuration",
        "options": [
          {
            "name": "8GB RAM",
            "price": 99999,
            "sku": "LPT-001-8GB",
            "stock": 25
          },
          {
            "name": "16GB RAM",
            "price": 114999,
            "sku": "LPT-001-16GB",
            "stock": 20
          }
        ]
      }
    ],
    "specifications": [
      {
        "name": "Processor",
        "value": "Intel Core i7-12700H",
        "group": "Performance"
      },
      {
        "name": "RAM",
        "value": "8GB DDR4",
        "group": "Memory"
      }
    ],
    "dimensions": {
      "length": 35.8,
      "width": 23.9,
      "height": 1.8,
      "unit": "cm",
      "weight": 1.8,
      "weightUnit": "kg"
    },
    "reviews": [
      {
        "_id": "64a1b2c3d4e5f6789012348",
        "userId": "64a1b2c3d4e5f6789012349",
        "rating": 5,
        "title": "Excellent laptop!",
        "comment": "Great performance and build quality.",
        "helpful": 12,
        "verified": true,
        "createdAt": "2024-01-18T09:15:00.000Z",
        "user": {
          "name": "Jane Smith",
          "avatar": "https://res.cloudinary.com/vebstore/image/upload/v1/avatars/user1.jpg"
        }
      }
    ],
    "averageRating": 4.5,
    "reviewCount": 128,
    "seo": {
      "title": "Premium Laptop - Best Price Online | VEBStore",
      "description": "Buy Premium Laptop at best price. Free shipping, EMI options available.",
      "keywords": ["laptop", "computer", "tech", "premium"]
    },
    "shipping": {
      "freeShipping": true,
      "shippingTime": { "min": 2, "max": 4, "unit": "days" },
      "fragile": true
    },
    "warranty": {
      "period": 12,
      "unit": "months",
      "type": "Manufacturer Warranty",
      "description": "Comprehensive warranty covering hardware defects"
    },
    "returnPolicy": {
      "days": 30,
      "conditions": "Product must be in original condition",
      "restockingFee": 0
    },
    "viewCount": 1542,
    "purchaseCount": 89,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:25:00.000Z"
  }
}
```

### Create Product (Admin Only)
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "shortDescription": "Brief description",
  "sku": "PRD-001",
  "price": 19999,
  "originalPrice": 24999,
  "category": "64a1b2c3d4e5f6789012346",
  "subCategory": "64a1b2c3d4e5f6789012347",
  "brand": "BrandName",
  "stock": 100,
  "images": [
    {
      "url": "https://res.cloudinary.com/vebstore/image/upload/v1/products/new1.jpg",
      "alt": "Product Image",
      "isMain": true
    }
  ],
  "specifications": [
    {
      "name": "Feature",
      "value": "Specification value",
      "group": "General"
    }
  ],
  "tags": ["tag1", "tag2"],
  "seo": {
    "title": "Product Title",
    "description": "Product description for SEO",
    "keywords": ["keyword1", "keyword2"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012350",
    "name": "New Product",
    "slug": "new-product",
    "status": "active",
    "createdAt": "2024-01-25T10:30:00.000Z"
  }
}
```

### Update Product (Admin Only)
```http
PUT /products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 21999,
  "stock": 150
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012350",
    "name": "Updated Product Name",
    "price": 21999,
    "stock": 150,
    "updatedAt": "2024-01-25T11:30:00.000Z"
  }
}
```

### Delete Product (Admin Only)
```http
DELETE /products/:id
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Cart Endpoints

### Get Cart
```http
GET /cart
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "64a1b2c3d4e5f6789012351",
        "productId": "64a1b2c3d4e5f6789012345",
        "quantity": 2,
        "variant": {
          "size": "16GB RAM",
          "color": "Space Gray"
        },
        "addedAt": "2024-01-25T09:15:00.000Z",
        "product": {
          "_id": "64a1b2c3d4e5f6789012345",
          "name": "Premium Laptop",
          "slug": "premium-laptop",
          "price": 114999,
          "images": [
            {
              "url": "https://res.cloudinary.com/vebstore/image/upload/v1/products/laptop1.jpg",
              "alt": "Premium Laptop",
              "isMain": true
            }
          ],
          "stock": 45,
          "averageRating": 4.5
        }
      }
    ],
    "summary": {
      "totalItems": 2,
      "subtotal": 229998,
      "shipping": 0,
      "tax": 41199.64,
      "total": 271197.64,
      "savings": 40000
    }
  }
}
```

### Add to Cart
```http
POST /cart/add
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "productId": "64a1b2c3d4e5f6789012345",
  "quantity": 1,
  "variant": {
    "size": "16GB RAM",
    "color": "Space Gray"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "itemId": "64a1b2c3d4e5f6789012351",
    "cartSummary": {
      "totalItems": 3,
      "subtotal": 344997,
      "total": 406196.63
    }
  }
}
```

### Update Cart Item
```http
PUT /cart/:itemId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": {
    "itemId": "64a1b2c3d4e5f6789012351",
    "quantity": 3,
    "cartSummary": {
      "totalItems": 4,
      "subtotal": 344997,
      "total": 406196.63
    }
  }
}
```

### Remove from Cart
```http
DELETE /cart/:itemId
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "cartSummary": {
      "totalItems": 1,
      "subtotal": 99999,
      "total": 117998.81
    }
  }
}
```

### Clear Cart
```http
DELETE /cart
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

## Order Endpoints

### Create Order
```http
POST /orders
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "64a1b2c3d4e5f6789012345",
      "quantity": 1,
      "variant": {
        "size": "16GB RAM",
        "color": "Space Gray"
      },
      "price": 114999
    }
  ],
  "shippingAddress": {
    "type": "home",
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "billingAddress": {
    "type": "home",
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "razorpay",
  "totalAmount": 117998.81
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012352",
    "orderNumber": "ORD-20240125-001",
    "userId": "64a1b2c3d4e5f6789012349",
    "items": [
      {
        "productId": "64a1b2c3d4e5f6789012345",
        "quantity": 1,
        "variant": {
          "size": "16GB RAM",
          "color": "Space Gray"
        },
        "price": 114999,
        "product": {
          "name": "Premium Laptop",
          "images": [
            {
              "url": "https://res.cloudinary.com/vebstore/image/upload/v1/products/laptop1.jpg",
              "alt": "Premium Laptop",
              "isMain": true
            }
          ]
        }
      }
    ],
    "shippingAddress": {
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "billingAddress": {
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "paymentMethod": "razorpay",
    "paymentStatus": "pending",
    "status": "pending",
    "totalAmount": 117998.81,
    "subtotal": 114999,
    "tax": 20699.82,
    "shipping": 0,
    "createdAt": "2024-01-25T12:30:00.000Z",
    "estimatedDelivery": "2024-01-29T00:00:00.000Z"
  }
}
```

### Get User Orders
```http
GET /orders?page=1&limit=10&status=pending
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (integer): Page number
- `limit` (integer): Items per page
- `status` (string): Filter by order status

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "64a1b2c3d4e5f6789012352",
        "orderNumber": "ORD-20240125-001",
        "status": "pending",
        "paymentStatus": "pending",
        "totalAmount": 117998.81,
        "items": [
          {
            "productId": "64a1b2c3d4e5f6789012345",
            "quantity": 1,
            "price": 114999,
            "product": {
              "name": "Premium Laptop",
              "images": [
                {
                  "url": "https://res.cloudinary.com/vebstore/image/upload/v1/products/laptop1.jpg",
                  "alt": "Premium Laptop",
                  "isMain": true
                }
              ]
            }
          }
        ],
        "createdAt": "2024-01-25T12:30:00.000Z",
        "estimatedDelivery": "2024-01-29T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalOrders": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Single Order
```http
GET /orders/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012352",
    "orderNumber": "ORD-20240125-001",
    "userId": "64a1b2c3d4e5f6789012349",
    "items": [
      {
        "_id": "64a1b2c3d4e5f6789012353",
        "productId": "64a1b2c3d4e5f6789012345",
        "quantity": 1,
        "variant": {
          "size": "16GB RAM",
          "color": "Space Gray"
        },
        "price": 114999,
        "product": {
          "_id": "64a1b2c3d4e5f6789012345",
          "name": "Premium Laptop",
          "slug": "premium-laptop",
          "images": [
            {
              "url": "https://res.cloudinary.com/vebstore/image/upload/v1/products/laptop1.jpg",
              "alt": "Premium Laptop",
              "isMain": true
            }
          ]
        }
      }
    ],
    "shippingAddress": {
      "type": "home",
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "billingAddress": {
      "type": "home",
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "paymentMethod": "razorpay",
    "paymentId": "pay_64a1b2c3d4e5f6789012354",
    "paymentStatus": "paid",
    "status": "confirmed",
    "totalAmount": 117998.81,
    "subtotal": 114999,
    "tax": 20699.82,
    "shipping": 0,
    "trackingInfo": {
      "carrier": "FedEx",
      "trackingNumber": "1234567890",
      "trackingUrl": "https://www.fedex.com/tracking/1234567890"
    },
    "orderHistory": [
      {
        "status": "pending",
        "timestamp": "2024-01-25T12:30:00.000Z",
        "note": "Order placed successfully"
      },
      {
        "status": "confirmed",
        "timestamp": "2024-01-25T12:35:00.000Z",
        "note": "Payment confirmed"
      },
      {
        "status": "processing",
        "timestamp": "2024-01-25T14:20:00.000Z",
        "note": "Order is being processed"
      }
    ],
    "createdAt": "2024-01-25T12:30:00.000Z",
    "updatedAt": "2024-01-25T14:20:00.000Z",
    "estimatedDelivery": "2024-01-29T00:00:00.000Z"
  }
}
```

### Cancel Order
```http
POST /orders/:id/cancel
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "reason": "No longer needed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012352",
    "status": "cancelled",
    "cancellationReason": "No longer needed",
    "cancelledAt": "2024-01-25T15:30:00.000Z",
    "refundStatus": "processing"
  }
}
```

## Payment Endpoints

### Create Payment Intent
```http
POST /payment/create-intent
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderId": "64a1b2c3d4e5f6789012352",
  "amount": 117998.81,
  "currency": "INR"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_64a1b2c3d4e5f6789012355",
    "amount": 117998.81,
    "currency": "INR",
    "razorpayOrder": {
      "id": "order_64a1b2c3d4e5f6789012356",
      "entity": "order",
      "amount": 11799881,
      "currency": "INR",
      "status": "created",
      "notes": [],
      "created_at": 1643123456
    },
    "key": "rzp_test_SSMJtAPB3B3MTE"
  }
}
```

### Verify Payment
```http
POST /payment/verify
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "razorpay_payment_id": "pay_64a1b2c3d4e5f6789012355",
  "razorpay_order_id": "order_64a1b2c3d4e5f6789012356",
  "razorpay_signature": "signature_hash",
  "orderId": "64a1b2c3d4e5f6789012352"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "pay_64a1b2c3d4e5f6789012355",
    "orderId": "64a1b2c3d4e5f6789012352",
    "status": "paid",
    "paidAt": "2024-01-25T12:45:00.000Z"
  }
}
```

## User Endpoints

### Get User Profile
```http
GET /user/profile
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012349",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "avatar": "https://res.cloudinary.com/vebstore/image/upload/v1/avatars/user1.jpg",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "gender": "male",
    "addresses": [
      {
        "_id": "64a1b2c3d4e5f6789012357",
        "type": "home",
        "street": "123 Main Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "country": "India",
        "isDefault": true
      }
    ],
    "preferences": {
      "newsletter": true,
      "smsNotifications": true,
      "whatsappUpdates": false,
      "language": "en",
      "currency": "INR"
    },
    "isEmailVerified": true,
    "isPhoneVerified": true,
    "isAccountActive": true,
    "lastLogin": "2024-01-25T10:15:00.000Z",
    "createdAt": "2024-01-10T08:30:00.000Z",
    "updatedAt": "2024-01-25T10:15:00.000Z"
  }
}
```

### Update User Profile
```http
PUT /user/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567891",
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "preferences": {
    "newsletter": true,
    "smsNotifications": false,
    "whatsappUpdates": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012349",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567891",
    "updatedAt": "2024-01-25T11:30:00.000Z"
  }
}
```

### Add Address
```http
POST /user/addresses
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "type": "work",
  "street": "456 Business Ave",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "country": "India",
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012358",
    "type": "work",
    "street": "456 Business Ave",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India",
    "isDefault": false,
    "createdAt": "2024-01-25T12:00:00.000Z"
  }
}
```

### Update Address
```http
PUT /user/addresses/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "street": "789 Updated Street",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "pincode": "600001",
  "isDefault": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012358",
    "street": "789 Updated Street",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600001",
    "isDefault": true,
    "updatedAt": "2024-01-25T12:30:00.000Z"
  }
}
```

### Delete Address
```http
DELETE /user/addresses/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

### Get Wishlist
```http
GET /user/wishlist
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "64a1b2c3d4e5f6789012359",
        "productId": "64a1b2c3d4e5f6789012345",
        "addedAt": "2024-01-20T10:30:00.000Z",
        "product": {
          "_id": "64a1b2c3d4e5f6789012345",
          "name": "Premium Laptop",
          "slug": "premium-laptop",
          "price": 99999,
          "originalPrice": 119999,
          "discount": 17,
          "images": [
            {
              "url": "https://res.cloudinary.com/vebstore/image/upload/v1/products/laptop1.jpg",
              "alt": "Premium Laptop",
              "isMain": true
            }
          ],
          "averageRating": 4.5,
          "reviewCount": 128,
          "stock": 45,
          "status": "active"
        }
      }
    ],
    "totalItems": 1
  }
}
```

### Add to Wishlist
```http
POST /user/wishlist
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "productId": "64a1b2c3d4e5f6789012345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to wishlist",
  "data": {
    "wishlistItemId": "64a1b2c3d4e5f6789012359",
    "totalItems": 1
  }
}
```

### Remove from Wishlist
```http
DELETE /user/wishlist/:productId
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product removed from wishlist",
  "data": {
    "totalItems": 0
  }
}
```

## Admin Endpoints

### Get Dashboard Stats
```http
GET /admin/dashboard/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totals": {
      "totalProducts": 1250,
      "totalCustomers": 5420,
      "totalOrders": 3250,
      "totalRevenue": 12500000,
      "returnsCancellations": 125
    },
    "recentOrders": [
      {
        "_id": "64a1b2c3d4e5f6789012352",
        "orderNumber": "ORD-20240125-001",
        "customerName": "John Doe",
        "amount": 117998.81,
        "status": "confirmed",
        "createdAt": "2024-01-25T12:30:00.000Z"
      }
    ],
    "chartData": [
      {
        "month": "Jan",
        "sales": 4500000,
        "orders": 320
      },
      {
        "month": "Feb",
        "sales": 5200000,
        "orders": 380
      }
    ],
    "topProducts": [
      {
        "_id": "64a1b2c3d4e5f6789012345",
        "name": "Premium Laptop",
        "sales": 125,
        "revenue": 12500000
      }
    ],
    "recentCustomers": [
      {
        "_id": "64a1b2c3d4e5f6789012349",
        "name": "John Doe",
        "email": "user@example.com",
        "totalOrders": 3,
        "totalSpent": 250000,
        "joinedAt": "2024-01-10T08:30:00.000Z"
      }
    ]
  }
}
```

### Get All Orders (Admin)
```http
GET /admin/orders?page=1&limit=20&status=confirmed&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (integer): Page number
- `limit` (integer): Items per page
- `status` (string): Filter by order status
- `startDate` (string): Filter by start date
- `endDate` (string): Filter by end date
- `search` (string): Search by order number or customer name

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "64a1b2c3d4e5f6789012352",
        "orderNumber": "ORD-20240125-001",
        "customer": {
          "_id": "64a1b2c3d4e5f6789012349",
          "name": "John Doe",
          "email": "user@example.com",
          "phone": "+1234567890"
        },
        "items": [
          {
            "productId": "64a1b2c3d4e5f6789012345",
            "name": "Premium Laptop",
            "quantity": 1,
            "price": 114999
          }
        ],
        "totalAmount": 117998.81,
        "status": "confirmed",
        "paymentStatus": "paid",
        "paymentMethod": "razorpay",
        "shippingAddress": {
          "street": "123 Main Street",
          "city": "Mumbai",
          "state": "Maharashtra",
          "pincode": "400001",
          "country": "India"
        },
        "trackingInfo": {
          "carrier": "FedEx",
          "trackingNumber": "1234567890"
        },
        "createdAt": "2024-01-25T12:30:00.000Z",
        "estimatedDelivery": "2024-01-29T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 50,
      "totalOrders": 1000,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "totalRevenue": 117998810,
      "avgOrderValue": 117998.81,
      "statusBreakdown": {
        "pending": 50,
        "confirmed": 200,
        "processing": 150,
        "shipped": 300,
        "delivered": 250,
        "cancelled": 50
      }
    }
  }
}
```

### Update Order Status (Admin)
```http
PUT /admin/orders/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "shipped",
  "trackingInfo": {
    "carrier": "FedEx",
    "trackingNumber": "1234567890",
    "trackingUrl": "https://www.fedex.com/tracking/1234567890"
  },
  "note": "Order shipped via FedEx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012352",
    "status": "shipped",
    "trackingInfo": {
      "carrier": "FedEx",
      "trackingNumber": "1234567890",
      "trackingUrl": "https://www.fedex.com/tracking/1234567890"
    },
    "updatedAt": "2024-01-25T14:30:00.000Z"
  }
}
```

### Get All Customers (Admin)
```http
GET /admin/customers?page=1&limit=20&search=john&status=active
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "_id": "64a1b2c3d4e5f6789012349",
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com",
        "phone": "+1234567890",
        "avatar": "https://res.cloudinary.com/vebstore/image/upload/v1/avatars/user1.jpg",
        "totalOrders": 3,
        "totalSpent": 250000,
        "avgOrderValue": 83333.33,
        "lastOrderDate": "2024-01-25T12:30:00.000Z",
        "status": "active",
        "isEmailVerified": true,
        "isPhoneVerified": true,
        "createdAt": "2024-01-10T08:30:00.000Z",
        "lastLogin": "2024-01-25T10:15:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 100,
      "totalCustomers": 2000,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "totalCustomers": 2000,
      "activeCustomers": 1850,
      "newCustomersThisMonth": 125,
      "avgCustomerLifetimeValue": 125000
    }
  }
}
```

## Error Responses

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 1000 requests per 15 minutes per user
- **Admin endpoints**: 500 requests per 15 minutes per admin

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1643123456
```

## Webhooks

### Order Status Webhook

When order status changes, VEBStore can send webhook notifications to configured endpoints:

```json
{
  "event": "order.status_updated",
  "data": {
    "orderId": "64a1b2c3d4e5f6789012352",
    "orderNumber": "ORD-20240125-001",
    "oldStatus": "confirmed",
    "newStatus": "shipped",
    "timestamp": "2024-01-25T14:30:00.000Z",
    "customer": {
      "email": "user@example.com",
      "phone": "+1234567890"
    }
  }
}
```

### Payment Webhook

```json
{
  "event": "payment.completed",
  "data": {
    "paymentId": "pay_64a1b2c3d4e5f6789012355",
    "orderId": "64a1b2c3d4e5f6789012352",
    "amount": 117998.81,
    "currency": "INR",
    "status": "paid",
    "timestamp": "2024-01-25T12:45:00.000Z"
  }
}
```

## SDK and Client Libraries

### JavaScript/Node.js

```javascript
import VEBStoreAPI from '@vebstore/api-client'

const client = new VEBStoreAPI({
  baseURL: 'https://api.vebstore.com/api',
  apiKey: 'your-api-key'
})

// Get products
const products = await client.products.list({
  category: 'electronics',
  limit: 20
})

// Create order
const order = await client.orders.create({
  items: [{ productId: 'prod_123', quantity: 1 }],
  shippingAddress: { /* address data */ }
})
```

### Python

```python
from vebstore_api import VEBStoreClient

client = VEBStoreClient(
    base_url='https://api.vebstore.com/api',
    api_key='your-api-key'
)

# Get products
products = client.products.list(
    category='electronics',
    limit=20
)

# Create order
order = client.orders.create({
    'items': [{'product_id': 'prod_123', 'quantity': 1}],
    'shipping_address': { /* address data */ }
})
```

## Testing

### API Testing Examples

```bash
# Health check
curl -X GET https://api.vebstore.com/api/health

# Get products
curl -X GET "https://api.vebstore.com/api/products?limit=5"

# Login
curl -X POST https://api.vebstore.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create order (with auth)
curl -X POST https://api.vebstore.com/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"prod_123","quantity":1}]}'
```

## Support

For API support and questions:
- **Documentation**: https://docs.vebstore.com/api
- **Support Email**: api-support@vebstore.com
- **Status Page**: https://status.vebstore.com
- **GitHub Issues**: https://github.com/vebstore/api/issues

---

*This API documentation covers all endpoints available in the VEBStore platform. For the most up-to-date information, please refer to the interactive API documentation at https://docs.vebstore.com/api*
