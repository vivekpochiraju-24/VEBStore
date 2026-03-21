# 🎨 Chapter 2: System Analysis & Design

This chapter outlines the architectural blueprints and data models that form the backbone of the VEBStore ecosystem.

## 2.1 System Architecture
VEBStore uses a three-tier architecture:
- **Presentation Layer**: React 19 (Frontend & Admin)
- **Logic Layer**: Node.js & Express 5 (Backend)
- **Data Layer**: MongoDB (Database) & Cloudinary (Assets)

### 2.1.1 Architecture Visual
```mermaid
graph TD
    User([Customer]) --> FE[React Boutique]
    Admin([Administrator]) --> AH[React Management Hub]
    
    subgraph "API Gateway (Express)"
        FE <--> AR[Auth Routes]
        FE <--> PR[Product Routes]
        FE <--> OR[Order Routes]
        FE <--> CR[Cart Routes]
        
        AH <--> AR
        AH <--> PR
        AH <--> OR
        AH <--> ST[Stats Routes]
    end
    
    subgraph "Data Services"
        AR <--> DB[(MongoDB)]
        PR <--> CL[Cloudinary Storage]
        OR <--> RP[Razorpay Gateway]
        OR <--> NM[Nodemailer]
    end
```

## 2.2 Database Schema (Entity-Relationship Diagram)
VEBStore utilizes a non-relational model optimized for high-performance retail lookups.

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ CART : maintains
    PRODUCT ||--o{ ORDER_ITEM : contained_in
    ORDER ||--o{ ORDER_ITEM : consists_of
    ORDER ||--o{ RETURN_REQUEST : initiates
    
    USER {
        string _id PK
        string name
        string email
        string password
        string phone
        string role
        date createdAt
    }
    
    PRODUCT {
        string _id PK
        string name
        string description
        number price
        string category
        string subCategory
        array images
        array sizes
        boolean bestseller
    }
    
    ORDER {
        string _id PK
        string userId FK
        array items
        number amount
        string address
        string status
        string paymentMethod
        boolean payment
        date date
    }
```

## 2.3 Key Use Cases
### 2.3.1 Customer Use Case
- **Account Management**: Signup/Login/Profile Update.
- **Product Discovery**: Search, Filter by Category, View Details.
- **Purchase Cycle**: Cart management, Place Order (COD/Online).
- **Post-Purchase**: Order tracking, Cancellation, Request Return/Exchange.

### 2.3.2 Administrator Use Case
- **Inventory Control**: Add/Edit/Remove products.
- **Operational Management**: Status updates (Processing, Shipped, Delivered), Approve Returns.
- **Analytics**: Revenue tracking and inventory health reports.

---
*VEBStore · Final Year Project Documentation Series*
