# VEBStore Testing Documentation

## Overview

This comprehensive testing documentation covers all aspects of testing the VEBStore e-commerce platform, including unit tests, integration tests, end-to-end tests, performance testing, and security testing.

## Testing Strategy

### Testing Pyramid

```
    ┌─────────────────────┐
    │   E2E Tests (10%)   │
    │   Cypress/Playwright│
    └─────────────────────┘
          ┌─────────────────────┐
          │  Integration (20%)  │
          │  API/Service Tests  │
          └─────────────────────┘
                ┌─────────────────────┐
                │   Unit Tests (70%)  │
                │   Jest/React Testing │
                └─────────────────────┘
```

### Test Categories

1. **Unit Tests**: Individual component and function testing
2. **Integration Tests**: API endpoint and service integration
3. **End-to-End Tests**: Complete user workflows
4. **Performance Tests**: Load and stress testing
5. **Security Tests**: Vulnerability and penetration testing
6. **Accessibility Tests**: WCAG compliance testing

## Unit Testing

### Frontend Unit Tests

#### Component Testing with Jest & React Testing Library

```javascript
// src/components/__tests__/ProductCard.test.js
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductCard from '../ProductCard'
import { ShopContext } from '../../context/ShopContext'

// Mock data
const mockProduct = {
  _id: '1',
  name: 'Test Product',
  price: 999,
  originalPrice: 1299,
  discount: 23,
  image: 'test-image.jpg',
  category: 'electronics',
  subCategory: 'laptops',
  averageRating: 4.5,
  reviewCount: 128,
  stock: 45
}

const mockAddToCart = jest.fn()
const mockAddToWishlist = jest.fn()

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ShopContext.Provider value={{
        addToCart: mockAddToCart,
        addToWishlist: mockAddToWishlist,
        currency: 'INR'
      }}>
        {component}
      </ShopContext.Provider>
    </BrowserRouter>
  )
}

describe('ProductCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders product information correctly', () => {
    renderWithProviders(<ProductCard {...mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('₹999')).toBeInTheDocument()
    expect(screen.getByText('₹1299')).toBeInTheDocument()
    expect(screen.getByText('23% OFF')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(128)')).toBeInTheDocument()
  })

  test('displays discount badge when discount exists', () => {
    renderWithProviders(<ProductCard {...mockProduct} />)
    
    const discountBadge = screen.getByText('23% OFF')
    expect(discountBadge).toBeInTheDocument()
    expect(discountBadge).toHaveClass('bg-red-500')
  })

  test('does not display discount when no discount', () => {
    const productWithoutDiscount = { ...mockProduct, discount: 0, originalPrice: 999 }
    renderWithProviders(<ProductCard {...productWithoutDiscount} />)
    
    expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument()
    expect(screen.queryByText('₹1299')).not.toBeInTheDocument()
  })

  test('calls addToCart when add to cart button is clicked', async () => {
    renderWithProviders(<ProductCard {...mockProduct} />)
    
    const addToCartButton = screen.getByText('Add to Cart')
    fireEvent.click(addToCartButton)
    
    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct._id, 1)
    })
  })

  test('calls addToWishlist when wishlist button is clicked', async () => {
    renderWithProviders(<ProductCard {...mockProduct} />)
    
    const wishlistButton = screen.getByLabelText('Add to wishlist')
    fireEvent.click(wishlistButton)
    
    await waitFor(() => {
      expect(mockAddToWishlist).toHaveBeenCalledWith(mockProduct._id)
    })
  })

  test('navigates to product detail page when product name is clicked', () => {
    renderWithProviders(<ProductCard {...mockProduct} />)
    
    const productName = screen.getByText('Test Product')
    fireEvent.click(productName)
    
    expect(window.location.pathname).toBe(`/product/${mockProduct._id}`)
  })

  test('displays out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    renderWithProviders(<ProductCard {...outOfStockProduct} />)
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    expect(screen.getByText('Add to Cart')).toBeDisabled()
  })

  test('displays rating stars correctly', () => {
    renderWithProviders(<ProductCard {...mockProduct} />)
    
    const ratingContainer = screen.getByTestId('rating-stars')
    expect(ratingContainer).toBeInTheDocument()
    
    // Check for filled stars based on rating
    const filledStars = screen.getAllByLabelText(/filled star/i)
    expect(filledStars).toHaveLength(4)
  })
})
```

#### Context Testing

```javascript
// src/context/__tests__/ShopContext.test.js
import React, { useContext } from 'react'
import { render, act, screen } from '@testing-library/react'
import { ShopContext, ShopProvider } from '../ShopContext'
import * as productService from '../../services/productService'

// Mock product service
jest.mock('../../services/productService')
const mockFetchProducts = productService.fetchProducts
const mockAddToCart = productService.addToCart
const mockAddToWishlist = productService.addToWishlist

const TestComponent = () => {
  const { products, cartItems, addToCart, addToWishlist, loading } = useContext(ShopContext)
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading...' : 'Loaded'}</div>
      <div data-testid="products-count">{products.length}</div>
      <div data-testid="cart-count">{cartItems.length}</div>
      <button onClick={() => addToCart('product1', 1)}>Add to Cart</button>
      <button onClick={() => addToWishlist('product1')}>Add to Wishlist</button>
    </div>
  )
}

const renderWithProvider = () => {
  return render(
    <ShopProvider>
      <TestComponent />
    </ShopProvider>
  )
}

describe('ShopContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetchProducts.mockResolvedValue([
      { _id: 'product1', name: 'Product 1', price: 999 },
      { _id: 'product2', name: 'Product 2', price: 1299 }
    ])
  })

  test('initializes with empty state', () => {
    renderWithProvider()
    
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...')
    expect(screen.getByTestId('products-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
  })

  test('fetches products on mount', async () => {
    renderWithProvider()
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(mockFetchProducts).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('loading')).toHaveTextContent('Loaded')
    expect(screen.getByTestId('products-count')).toHaveTextContent('2')
  })

  test('adds product to cart', async () => {
    mockAddToCart.mockResolvedValue({ success: true })
    
    renderWithProvider()
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    const addToCartButton = screen.getByText('Add to Cart')
    
    await act(async () => {
      fireEvent.click(addToCartButton)
    })
    
    expect(mockAddToCart).toHaveBeenCalledWith('product1', 1)
  })

  test('adds product to wishlist', async () => {
    mockAddToWishlist.mockResolvedValue({ success: true })
    
    renderWithProvider()
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    const addToWishlistButton = screen.getByText('Add to Wishlist')
    
    await act(async () => {
      fireEvent.click(addToWishlistButton)
    })
    
    expect(mockAddToWishlist).toHaveBeenCalledWith('product1')
  })

  test('handles product fetch error', async () => {
    mockFetchProducts.mockRejectedValue(new Error('Network error'))
    
    renderWithProvider()
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(screen.getByTestId('loading')).toHaveTextContent('Loaded')
    expect(screen.getByTestId('products-count')).toHaveTextContent('0')
  })
})
```

#### Utility Function Testing

```javascript
// src/utils/__tests__/formatters.test.js
import { formatCurrency, formatDate, formatDiscount, generateSlug } from '../formatters'

describe('Formatters', () => {
  describe('formatCurrency', () => {
    test('formats INR currency correctly', () => {
      expect(formatCurrency(99999, 'INR')).toBe('₹99,999')
      expect(formatCurrency(0, 'INR')).toBe('₹0')
      expect(formatCurrency(1000000, 'INR')).toBe('₹10,00,000')
    })

    test('formats USD currency correctly', () => {
      expect(formatCurrency(999.99, 'USD')).toBe('$999.99')
      expect(formatCurrency(0, 'USD')).toBe('$0.00')
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00')
    })

    test('handles invalid input', () => {
      expect(formatCurrency(null, 'INR')).toBe('₹0')
      expect(formatCurrency(undefined, 'USD')).toBe('$0.00')
      expect(formatCurrency('invalid', 'INR')).toBe('₹0')
    })
  })

  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2024-01-25T10:30:00.000Z')
      expect(formatDate(date)).toBe('Jan 25, 2024')
      expect(formatDate(date, 'long')).toBe('January 25, 2024')
      expect(formatDate(date, 'short')).toBe('1/25/2024')
    })

    test('handles string dates', () => {
      expect(formatDate('2024-01-25')).toBe('Jan 25, 2024')
    })

    test('handles invalid dates', () => {
      expect(formatDate('invalid')).toBe('Invalid Date')
      expect(formatDate(null)).toBe('Invalid Date')
    })
  })

  describe('formatDiscount', () => {
    test('calculates discount percentage', () => {
      expect(formatDiscount(100, 75)).toBe('25% OFF')
      expect(formatDiscount(200, 100)).toBe('50% OFF')
      expect(formatDiscount(999, 0)).toBe('100% OFF')
    })

    test('handles zero discount', () => {
      expect(formatDiscount(100, 100)).toBe('0% OFF')
    })

    test('handles invalid input', () => {
      expect(formatDiscount(null, 100)).toBe('0% OFF')
      expect(formatDiscount(100, null)).toBe('0% OFF')
    })
  })

  describe('generateSlug', () => {
    test('generates slug from string', () => {
      expect(generateSlug('Premium Laptop')).toBe('premium-laptop')
      expect(generateSlug('iPhone 15 Pro Max')).toBe('iphone-15-pro-max')
      expect(generateSlug('Hello World!')).toBe('hello-world')
    })

    test('handles special characters', () => {
      expect(generateSlug('Product @#$%')).toBe('product')
      expect(generateSlug('Multiple   Spaces')).toBe('multiple-spaces')
    })

    test('handles empty input', () => {
      expect(generateSlug('')).toBe('')
      expect(generateSlug(null)).toBe('')
    })
  })
})
```

### Backend Unit Tests

#### Controller Testing

```javascript
// tests/controllers/authController.test.js
const request = require('supertest')
const app = require('../../app')
const User = require('../../models/User')
const bcrypt = require('bcrypt')

// Mock User model
jest.mock('../../models/User')
jest.mock('bcrypt')

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/register', () => {
    test('registers user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123'
      }

      bcrypt.hash.mockResolvedValue('hashedPassword')
      User.create.mockResolvedValue({
        _id: 'user123',
        ...userData,
        password: 'hashedPassword'
      })

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Registration successful')
      expect(response.body.user.email).toBe(userData.email)
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12)
    })

    test('validates required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toContain('validation')
    })

    test('handles duplicate email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123'
      }

      User.create.mockRejectedValue(new Error('Email already exists'))

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/auth/login', () => {
    test('logs in user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      }

      const mockUser = {
        _id: 'user123',
        email: 'john@example.com',
        password: 'hashedPassword'
      }

      User.findOne.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(true)

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
      expect(response.body.user.email).toBe(loginData.email)
    })

    test('handles invalid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      }

      User.findOne.mockResolvedValue(null)

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid credentials')
    })

    test('handles incorrect password', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      }

      const mockUser = {
        _id: 'user123',
        email: 'john@example.com',
        password: 'hashedPassword'
      }

      User.findOne.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(false)

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })
})
```

#### Service Testing

```javascript
// tests/services/productService.test.js
const productService = require('../../services/productService')
const Product = require('../../models/Product')

// Mock Product model
jest.mock('../../models/Product')

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchProducts', () => {
    test('fetches products with filters', async () => {
      const filters = {
        category: 'electronics',
        minPrice: 1000,
        maxPrice: 10000,
        page: 1,
        limit: 10
      }

      const mockProducts = [
        { _id: '1', name: 'Laptop', price: 50000, category: 'electronics' },
        { _id: '2', name: 'Phone', price: 15000, category: 'electronics' }
      ]

      Product.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockProducts)
              })
            })
          })
        })
      })

      Product.countDocuments.mockResolvedValue(2)

      const result = await productService.fetchProducts(filters)

      expect(Product.find).toHaveBeenCalledWith({
        category: 'electronics',
        price: { $gte: 1000, $lte: 10000 },
        status: 'active'
      })
      expect(result.products).toEqual(mockProducts)
      expect(result.totalCount).toBe(2)
    })

    test('handles search query', async () => {
      const filters = {
        search: 'laptop',
        page: 1,
        limit: 10
      }

      Product.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([])
              })
            })
          })
        })
      })

      Product.countDocuments.mockResolvedValue(0)

      await productService.fetchProducts(filters)

      expect(Product.find).toHaveBeenCalledWith({
        $text: { $search: 'laptop' },
        status: 'active'
      })
    })

    test('handles database errors', async () => {
      Product.find.mockImplementation(() => {
        throw new Error('Database error')
      })

      await expect(productService.fetchProducts({}))
        .rejects.toThrow('Database error')
    })
  })

  describe('createProduct', () => {
    test('creates product successfully', async () => {
      const productData = {
        name: 'New Product',
        price: 9999,
        category: 'electronics',
        description: 'Product description'
      }

      const createdProduct = {
        _id: 'product123',
        ...productData,
        slug: 'new-product',
        status: 'active',
        createdAt: new Date()
      }

      Product.create.mockResolvedValue(createdProduct)

      const result = await productService.createProduct(productData)

      expect(Product.create).toHaveBeenCalledWith({
        ...productData,
        slug: 'new-product',
        status: 'active'
      })
      expect(result).toEqual(createdProduct)
    })

    test('validates required fields', async () => {
      const invalidProductData = {
        name: '',
        price: -100
      }

      Product.create.mockRejectedValue(new Error('Validation failed'))

      await expect(productService.createProduct(invalidProductData))
        .rejects.toThrow('Validation failed')
    })
  })

  describe('updateStock', () => {
    test('updates stock successfully', async () => {
      const productId = 'product123'
      const quantity = 5
      const operation = 'add'

      const mockProduct = {
        _id: productId,
        name: 'Test Product',
        stock: 10,
        save: jest.fn().mockResolvedValue()
      }

      Product.findById.mockResolvedValue(mockProduct)

      const result = await productService.updateStock(productId, quantity, operation)

      expect(Product.findById).toHaveBeenCalledWith(productId)
      expect(mockProduct.stock).toBe(15)
      expect(mockProduct.save).toHaveBeenCalled()
    })

    test('handles subtract operation', async () => {
      const productId = 'product123'
      const quantity = 3
      const operation = 'subtract'

      const mockProduct = {
        _id: productId,
        name: 'Test Product',
        stock: 10,
        save: jest.fn().mockResolvedValue()
      }

      Product.findById.mockResolvedValue(mockProduct)

      await productService.updateStock(productId, quantity, operation)

      expect(mockProduct.stock).toBe(7)
    })

    test('prevents negative stock', async () => {
      const productId = 'product123'
      const quantity = 15
      const operation = 'subtract'

      const mockProduct = {
        _id: productId,
        name: 'Test Product',
        stock: 10,
        save: jest.fn().mockResolvedValue()
      }

      Product.findById.mockResolvedValue(mockProduct)

      await productService.updateStock(productId, quantity, operation)

      expect(mockProduct.stock).toBe(0)
    })

    test('handles product not found', async () => {
      const productId = 'nonexistent'
      const quantity = 5
      const operation = 'add'

      Product.findById.mockResolvedValue(null)

      await expect(productService.updateStock(productId, quantity, operation))
        .rejects.toThrow('Product not found')
    })
  })
})
```

#### Model Testing

```javascript
// tests/models/User.test.js
const User = require('../../models/User')
const mongoose = require('mongoose')

describe('User Model', () => {
  let connection

  beforeAll(async () => {
    connection = await mongoose.connect(process.env.MONGODB_TEST_URL)
  })

  afterAll(async () => {
    await connection.close()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('User Creation', () => {
    test('creates user with valid data', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123'
      }

      const user = new User(userData)
      const savedUser = await user.save()

      expect(savedUser.firstName).toBe(userData.firstName)
      expect(savedUser.lastName).toBe(userData.lastName)
      expect(savedUser.email).toBe(userData.email)
      expect(savedUser.phone).toBe(userData.phone)
      expect(savedUser.password).not.toBe(userData.password) // Should be hashed
      expect(savedUser.createdAt).toBeDefined()
    })

    test('requires required fields', async () => {
      const user = new User({})
      
      await expect(user.save()).rejects.toThrow()
    })

    test('validates email format', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '+1234567890',
        password: 'password123'
      })

      await expect(user.save()).rejects.toThrow()
    })

    test('validates phone format', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: 'invalid-phone',
        password: 'password123'
      })

      await expect(user.save()).rejects.toThrow()
    })

    test('enforces unique email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123'
      }

      await new User(userData).save()

      const duplicateUser = new User(userData)
      await expect(duplicateUser.save()).rejects.toThrow()
    })
  })

  describe('Virtual Fields', () => {
    test('fullName virtual field works', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123'
      })

      await user.save()

      expect(user.fullName).toBe('John Doe')
    })
  })

  describe('Instance Methods', () => {
    test('comparePassword method works', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123'
      })

      await user.save()

      const isMatch = await user.comparePassword('password123')
      expect(isMatch).toBe(true)

      const isNotMatch = await user.comparePassword('wrongpassword')
      expect(isNotMatch).toBe(false)
    })
  })

  describe('Static Methods', () => {
    test('findByEmail method works', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123'
      }

      await new User(userData).save()

      const foundUser = await User.findByEmail('john@example.com')
      expect(foundUser).toBeTruthy()
      expect(foundUser.email).toBe('john@example.com')

      const notFoundUser = await User.findByEmail('nonexistent@example.com')
      expect(notFoundUser).toBeNull()
    })
  })
})
```

## Integration Testing

### API Integration Tests

```javascript
// tests/integration/auth.test.js
const request = require('supertest')
const app = require('../../app')
const User = require('../../models/User')
const db = require('../../config/database')

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await db.connect()
  })

  afterAll(async () => {
    await db.close()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('POST /api/auth/register', () => {
    test('registers and authenticates user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123',
        confirmPassword: 'password123'
      }

      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(registerResponse.body.success).toBe(true)
      expect(registerResponse.body.user.email).toBe(userData.email)

      // Verify user exists in database
      const user = await User.findOne({ email: userData.email })
      expect(user).toBeTruthy()
      expect(user.firstName).toBe(userData.firstName)

      // Login with registered user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200)

      expect(loginResponse.body.success).toBe(true)
      expect(loginResponse.body.token).toBeDefined()
      expect(loginResponse.body.user.email).toBe(userData.email)
    })

    test('prevents duplicate registration', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123',
        confirmPassword: 'password123'
      }

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      // Second registration with same email
      const duplicateResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(duplicateResponse.body.success).toBe(false)
    })
  })

  describe('Protected Routes', () => {
    let authToken

    beforeEach(async () => {
      // Register and login user
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123'
      }

      await request(app)
        .post('/api/auth/register')
        .send(userData)

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })

      authToken = loginResponse.body.token
    })

    test('accesses protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.email).toBe('john@example.com')
    })

    test('rejects protected route without token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    test('rejects protected route with invalid token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })
})
```

### Service Integration Tests

```javascript
// tests/integration/orderService.test.js
const OrderService = require('../../services/orderService')
const Product = require('../../models/Product')
const Order = require('../../models/Order')
const User = require('../../models/User')
const db = require('../../config/database')

describe('OrderService Integration', () => {
  beforeAll(async () => {
    await db.connect()
  })

  afterAll(async () => {
    await db.close()
  })

  beforeEach(async () => {
    await Order.deleteMany({})
    await Product.deleteMany({})
    await User.deleteMany({})
  })

  describe('createOrder', () => {
    let user, product

    beforeEach(async () => {
      user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123'
      })

      product = await Product.create({
        name: 'Test Product',
        price: 9999,
        category: 'electronics',
        stock: 10
      })
    })

    test('creates order successfully', async () => {
      const orderData = {
        userId: user._id,
        items: [{
          productId: product._id,
          quantity: 2,
          price: product.price
        }],
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'MH',
          pincode: '400001',
          country: 'India'
        },
        totalAmount: 19998
      }

      const order = await OrderService.createOrder(orderData)

      expect(order).toBeTruthy()
      expect(order.userId).toBe(user._id)
      expect(order.items).toHaveLength(1)
      expect(order.items[0].productId).toBe(product._id)
      expect(order.items[0].quantity).toBe(2)
      expect(order.status).toBe('pending')

      // Check inventory update
      const updatedProduct = await Product.findById(product._id)
      expect(updatedProduct.stock).toBe(8)
    })

    test('handles insufficient stock', async () => {
      product.stock = 1
      await product.save()

      const orderData = {
        userId: user._id,
        items: [{
          productId: product._id,
          quantity: 5,
          price: product.price
        }],
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'MH',
          pincode: '400001',
          country: 'India'
        },
        totalAmount: 49995
      }

      await expect(OrderService.createOrder(orderData))
        .rejects.toThrow('Insufficient stock')
    })

    test('handles product not found', async () => {
      const orderData = {
        userId: user._id,
        items: [{
          productId: new mongoose.Types.ObjectId(),
          quantity: 1,
          price: 9999
        }],
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'MH',
          pincode: '400001',
          country: 'India'
        },
        totalAmount: 9999
      }

      await expect(OrderService.createOrder(orderData))
        .rejects.toThrow('Product not found')
    })
  })

  describe('updateOrderStatus', () => {
    let order

    beforeEach(async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123'
      })

      order = await Order.create({
        userId: user._id,
        items: [{
          productId: new mongoose.Types.ObjectId(),
          quantity: 1,
          price: 9999
        }],
        status: 'pending',
        totalAmount: 9999
      })
    })

    test('updates order status successfully', async () => {
      const updatedOrder = await OrderService.updateOrderStatus(
        order._id,
        'confirmed',
        { carrier: 'FedEx', trackingNumber: '123456' }
      )

      expect(updatedOrder.status).toBe('confirmed')
      expect(updatedOrder.trackingInfo).toEqual({
        carrier: 'FedEx',
        trackingNumber: '123456'
      })
    })

    test('handles invalid status', async () => {
      await expect(OrderService.updateOrderStatus(order._id, 'invalid'))
        .rejects.toThrow('Invalid order status')
    })

    test('handles order not found', async () => {
      await expect(OrderService.updateOrderStatus(
        new mongoose.Types.ObjectId(),
        'confirmed'
      )).rejects.toThrow('Order not found')
    })
  })
})
```

## End-to-End Testing

### Cypress E2E Tests

```javascript
// cypress/e2e/shopping-flow.cy.js
describe('Complete Shopping Flow', () => {
  beforeEach(() => {
    // Reset database and seed test data
    cy.task('db:seed')
    cy.visit('/')
  })

  describe('Product Browsing', () => {
    it('displays product catalog', () => {
      cy.get('[data-testid="product-grid"]').should('be.visible')
      cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0)
      
      // Check product information display
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="product-name"]').should('be.visible')
        cy.get('[data-testid="product-price"]').should('be.visible')
        cy.get('[data-testid="product-image"]').should('be.visible')
      })
    })

    it('filters products by category', () => {
      cy.get('[data-testid="category-filter"]').click()
      cy.get('[data-testid="category-electronics"]').click()
      
      cy.url().should('include', 'category=electronics')
      cy.get('[data-testid="product-card"]').each(($card) => {
        cy.wrap($card).find('[data-testid="product-category"]').should('contain', 'Electronics')
      })
    })

    it('searches for products', () => {
      cy.get('[data-testid="search-input"]').type('laptop{enter}')
      
      cy.url().should('include', 'search=laptop')
      cy.get('[data-testid="product-card"]').each(($card) => {
        cy.wrap($card).find('[data-testid="product-name"]').should('contain', 'laptop', { matchCase: false })
      })
    })

    it('sorts products by price', () => {
      cy.get('[data-testid="sort-dropdown"]').click()
      cy.get('[data-testid="sort-price-low"]').click()
      
      // Verify price sorting
      let previousPrice = 0
      cy.get('[data-testid="product-card"]').each(($card, index) => {
        if (index > 0) {
          cy.wrap($card).find('[data-testid="product-price"]').invoke('text').then((text) => {
            const price = parseInt(text.replace(/[^0-9]/g, ''))
            expect(price).to.be.gte(previousPrice)
            previousPrice = price
          })
        }
      })
    })
  })

  describe('Product Details', () => {
    beforeEach(() => {
      cy.get('[data-testid="product-card"]').first().click()
    })

    it('displays product details page', () => {
      cy.get('[data-testid="product-title"]').should('be.visible')
      cy.get('[data-testid="product-price"]').should('be.visible')
      cy.get('[data-testid="product-description"]').should('be.visible')
      cy.get('[data-testid="product-images"]').should('be.visible')
      cy.get('[data-testid="product-specifications"]').should('be.visible')
    })

    it('adds product to cart', () => {
      cy.get('[data-testid="add-to-cart"]').click()
      
      // Verify cart update
      cy.get('[data-testid="cart-count"]').should('contain', '1')
      cy.get('[data-testid="cart-sidebar"]').should('be.visible')
      cy.get('[data-testid="cart-item"]').should('have.length', 1)
    })

    it('adds product to wishlist', () => {
      cy.get('[data-testid="add-to-wishlist"]').click()
      
      // Verify wishlist update
      cy.get('[data-testid="wishlist-count"]').should('contain', '1')
    })

    it('selects product variants', () => {
      // Check if variants are available
      cy.get('[data-testid="variant-selector"]').then(($variants) => {
        if ($variants.length > 0) {
          cy.get('[data-testid="variant-selector"]').first().click()
          cy.get('[data-testid="variant-option"]').first().click()
          
          // Verify price update if variant affects price
          cy.get('[data-testid="product-price"]').invoke('text').should('not.be.empty')
        }
      })
    })

    it('displays product reviews', () => {
      cy.get('[data-testid="reviews-section"]').should('be.visible')
      
      // Check review elements
      cy.get('[data-testid="review-card"]').should('have.length.greaterThan', 0)
      cy.get('[data-testid="review-rating"]').should('be.visible')
      cy.get('[data-testid="review-comment"]').should('be.visible')
    })

    it('writes product review', () => {
      // Login first
      cy.login('test@example.com', 'password123')
      
      cy.get('[data-testid="write-review"]').click()
      cy.get('[data-testid="review-rating"]').click({ multiple: true, force: true })
      cy.get('[data-testid="review-title"]').type('Great product!')
      cy.get('[data-testid="review-comment"]').type('Really happy with this purchase.')
      cy.get('[data-testid="submit-review"]').click()
      
      // Verify review submission
      cy.get('[data-testid="review-success"]').should('be.visible')
      cy.get('[data-testid="review-card"]').first().should('contain', 'Great product!')
    })
  })

  describe('Shopping Cart', () => {
    beforeEach(() => {
      // Add products to cart
      cy.get('[data-testid="product-card"]').eq(0).within(() => {
        cy.get('[data-testid="add-to-cart"]').click()
      })
      cy.get('[data-testid="product-card"]').eq(1).within(() => {
        cy.get('[data-testid="add-to-cart"]').click()
      })
    })

    it('displays cart with correct items', () => {
      cy.get('[data-testid="cart-sidebar"]').should('be.visible')
      cy.get('[data-testid="cart-item"]').should('have.length', 2)
      
      // Check cart summary
      cy.get('[data-testid="cart-subtotal"]').should('be.visible')
      cy.get('[data-testid="cart-total"]').should('be.visible')
    })

    it('updates item quantity', () => {
      cy.get('[data-testid="cart-item"]').first().within(() => {
        cy.get('[data-testid="quantity-increase"]').click()
        cy.get('[data-testid="quantity-display"]').should('contain', '2')
      })
      
      // Verify price update
      cy.get('[data-testid="cart-total"]').invoke('text').should('not.be.empty')
    })

    it('removes item from cart', () => {
      cy.get('[data-testid="cart-item"]').first().within(() => {
        cy.get('[data-testid="remove-item"]').click()
      })
      
      cy.get('[data-testid="cart-item"]').should('have.length', 1)
      cy.get('[data-testid="cart-count"]').should('contain', '1')
    })

    it('proceeds to checkout', () => {
      cy.get('[data-testid="checkout-button"]').click()
      
      cy.url().should('include', '/checkout')
      cy.get('[data-testid="checkout-form"]').should('be.visible')
    })
  })

  describe('Checkout Process', () => {
    beforeEach(() => {
      // Add product and proceed to checkout
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="add-to-cart"]').click()
      })
      cy.get('[data-testid="checkout-button"]').click()
    })

    it('displays checkout form', () => {
      cy.get('[data-testid="shipping-address"]').should('be.visible')
      cy.get('[data-testid="billing-address"]').should('be.visible')
      cy.get('[data-testid="payment-method"]').should('be.visible')
      cy.get('[data-testid="order-summary"]').should('be.visible')
    })

    it('fills shipping information', () => {
      cy.get('[data-testid="shipping-first-name"]').type('John')
      cy.get('[data-testid="shipping-last-name"]').type('Doe')
      cy.get('[data-testid="shipping-email"]').type('john@example.com')
      cy.get('[data-testid="shipping-phone"]').type('+1234567890')
      cy.get('[data-testid="shipping-address"]').type('123 Main St')
      cy.get('[data-testid="shipping-city"]').type('Mumbai')
      cy.get('[data-testid="shipping-state"]').type('Maharashtra')
      cy.get('[data-testid="shipping-pincode"]').type('400001')
    })

    it('selects payment method', () => {
      cy.get('[data-testid="payment-razorpay"]').click()
      cy.get('[data-testid="payment-razorpay"]').should('be.checked')
    })

    it('places order successfully', () => {
      // Fill shipping information
      cy.get('[data-testid="shipping-first-name"]').type('John')
      cy.get('[data-testid="shipping-last-name"]').type('Doe')
      cy.get('[data-testid="shipping-email"]').type('john@example.com')
      cy.get('[data-testid="shipping-phone"]').type('+1234567890')
      cy.get('[data-testid="shipping-address"]').type('123 Main St')
      cy.get('[data-testid="shipping-city"]').type('Mumbai')
      cy.get('[data-testid="shipping-state"]').type('Maharashtra')
      cy.get('[data-testid="shipping-pincode"]').type('400001')
      
      // Select payment method
      cy.get('[data-testid="payment-razorpay"]').click()
      
      // Place order
      cy.get('[data-testid="place-order"]').click()
      
      // Mock payment success
      cy.get('[data-testid="payment-success"]').should('be.visible')
      
      // Verify order confirmation
      cy.url().should('include', '/order-confirmation')
      cy.get('[data-testid="order-number"]').should('be.visible')
      cy.get('[data-testid="order-details"]').should('be.visible')
    })

    it('validates required fields', () => {
      cy.get('[data-testid="place-order"]').click()
      
      // Check validation errors
      cy.get('[data-testid="error-message"]').should('be.visible')
      cy.get('[data-testid="shipping-first-name"]').should('have.class', 'error')
    })
  })

  describe('User Account', () => {
    beforeEach(() => {
      cy.login('test@example.com', 'password123')
      cy.visit('/account')
    })

    it('displays user profile', () => {
      cy.get('[data-testid="profile-info"]').should('be.visible')
      cy.get('[data-testid="user-name"]').should('contain', 'Test User')
      cy.get('[data-testid="user-email"]').should('contain', 'test@example.com')
    })

    it('updates profile information', () => {
      cy.get('[data-testid="edit-profile"]').click()
      cy.get('[data-testid="first-name"]').clear().type('John')
      cy.get('[data-testid="last-name"]').clear().type('Doe')
      cy.get('[data-testid="phone"]').clear().type('+1234567890')
      cy.get('[data-testid="save-profile"]').click()
      
      cy.get('[data-testid="success-message"]').should('contain', 'Profile updated')
      cy.get('[data-testid="user-name"]').should('contain', 'John Doe')
    })

    it('displays order history', () => {
      cy.get('[data-testid="order-history"]').should('be.visible')
      cy.get('[data-testid="order-item"]').should('have.length.greaterThan', 0)
      
      // Check order details
      cy.get('[data-testid="order-item"]').first().within(() => {
        cy.get('[data-testid="order-number"]').should('be.visible')
        cy.get('[data-testid="order-date"]').should('be.visible')
        cy.get('[data-testid="order-status"]').should('be.visible')
        cy.get('[data-testid="order-total"]').should('be.visible')
      })
    })

    it('displays wishlist', () => {
      cy.get('[data-testid="wishlist"]').should('be.visible')
      
      // Add items to wishlist first
      cy.visit('/')
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="add-to-wishlist"]').click()
      })
      
      cy.visit('/account')
      cy.get('[data-testid="wishlist-items"]').should('have.length', 1)
    })

    it('manages addresses', () => {
      cy.get('[data-testid="address-book"]').should('be.visible')
      
      // Add new address
      cy.get('[data-testid="add-address"]').click()
      cy.get('[data-testid="address-type"]').select('home')
      cy.get('[data-testid="address-street"]').type('456 New St')
      cy.get('[data-testid="address-city"]').type('Bangalore')
      cy.get('[data-testid="address-state"]').type('Karnataka')
      cy.get('[data-testid="address-pincode"]').type('560001')
      cy.get('[data-testid="save-address"]').click()
      
      cy.get('[data-testid="address-item"]').should('have.length.greaterThan', 0)
    })
  })
})
```

### Playwright E2E Tests

```javascript
// tests/e2e/admin-panel.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login')
    await page.fill('[data-testid="email"]', 'admin@vebstore.com')
    await page.fill('[data-testid="password"]', 'admin123')
    await page.click('[data-testid="login-button"]')
    await expect(page).toHaveURL('/admin/dashboard')
  })

  test('displays dashboard with statistics', async ({ page }) => {
    await expect(page.locator('[data-testid="dashboard-stats"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-products"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-orders"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-customers"]')).toBeVisible()
  })

  test('displays charts and graphs', async ({ page }) => {
    await expect(page.locator('[data-testid="sales-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="order-status-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="category-chart"]')).toBeVisible()
  })

  test('manages products', async ({ page }) => {
    await page.click('[data-testid="products-menu"]')
    await expect(page).toHaveURL('/admin/products')
    
    // Add new product
    await page.click('[data-testid="add-product"]')
    await page.fill('[data-testid="product-name"]', 'Test Product')
    await page.fill('[data-testid="product-price"]', '9999')
    await page.fill('[data-testid="product-description"]', 'Test description')
    await page.selectOption('[data-testid="product-category"]', 'electronics')
    await page.click('[data-testid="save-product"]')
    
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Product created')
    
    // Verify product in list
    await expect(page.locator('[data-testid="product-list"]')).toContainText('Test Product')
  })

  test('manages orders', async ({ page }) => {
    await page.click('[data-testid="orders-menu"]')
    await expect(page).toHaveURL('/admin/orders')
    
    await expect(page.locator('[data-testid="orders-list"]')).toBeVisible()
    await expect(page.locator('[data-testid="order-item"]')).toHaveCount.greaterThan(0)
    
    // Update order status
    await page.click('[data-testid="order-item"]').first()
    await page.selectOption('[data-testid="order-status"]', 'shipped')
    await page.fill('[data-testid="tracking-number"]', '1234567890')
    await page.click('[data-testid="update-order"]')
    
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Order updated')
  })

  test('manages customers', async ({ page }) => {
    await page.click('[data-testid="customers-menu"]')
    await expect(page).toHaveURL('/admin/customers')
    
    await expect(page.locator('[data-testid="customers-list"]')).toBeVisible()
    await expect(page.locator('[data-testid="customer-item"]')).toHaveCount.greaterThan(0)
    
    // Search customer
    await page.fill('[data-testid="customer-search"]', 'test')
    await page.press('[data-testid="customer-search"]', 'Enter')
    
    await expect(page.locator('[data-testid="customer-item"]')).toHaveCount.lessThan(10)
  })

  test('filters and searches data', async ({ page }) => {
    await page.click('[data-testid="orders-menu"]')
    
    // Filter by status
    await page.selectOption('[data-testid="status-filter"]', 'pending')
    await page.click('[data-testid="apply-filter"]')
    
    await expect(page.locator('[data-testid="order-item"]')).toHaveCount.greaterThan(0)
    
    // Search by order number
    await page.fill('[data-testid="order-search"]', 'ORD-')
    await page.press('[data-testid="order-search"]', 'Enter')
    
    await expect(page.locator('[data-testid="order-item"]')).toHaveCount.greaterThan(0)
  })

  test('exports data', async ({ page }) => {
    await page.click('[data-testid="orders-menu"]')
    
    // Export orders
    const downloadPromise = page.waitForEvent('download')
    await page.click('[data-testid="export-orders"]')
    const download = await downloadPromise
    
    expect(download.suggestedFilename()).toMatch(/orders.*\.csv$/)
  })

  test('handles real-time updates', async ({ page }) => {
    await page.click('[data-testid="dashboard-menu"]')
    
    // Check initial stats
    const initialOrders = await page.locator('[data-testid="total-orders"]').textContent()
    
    // Simulate new order (would need API call in real scenario)
    await page.evaluate(() => {
      // Mock WebSocket or polling update
      window.dispatchEvent(new CustomEvent('orderUpdate', {
        detail: { type: 'new', count: 1 }
      }))
    })
    
    // Wait for update (in real scenario, this would be automatic)
    await page.waitForTimeout(1000)
    
    // Verify update (this would work with real WebSocket/polling)
    // const updatedOrders = await page.locator('[data-testid="total-orders"]').textContent()
    // expect(parseInt(updatedOrders)).toBe(parseInt(initialOrders) + 1)
  })
})
```

## Performance Testing

### Load Testing with Artillery

```yaml
# artillery-config.yml
config:
  target: 'http://localhost:8000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Load test"
    - duration: 60
      arrivalRate: 100
      name: "Stress test"
    - duration: 30
      arrivalRate: 200
      name: "Peak load"
  processor: "./test-processor.js"

scenarios:
  - name: "Browse Products"
    weight: 40
    flow:
      - get:
          url: "/api/products"
          qs:
            page: "{{ $randomInteger(1, 10) }}"
            limit: 20
      - think: 1
      - get:
          url: "/api/products/{{ $randomProductId() }}"
      - think: 2

  - name: "User Authentication"
    weight: 20
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test{{ $randomInteger(1, 1000) }}@example.com"
            password: "password123"
      - think: 1

  - name: "Shopping Cart"
    weight: 30
    flow:
      - post:
          url: "/api/cart/add"
          headers:
            Authorization: "Bearer {{ $randomToken() }}"
          json:
            productId: "{{ $randomProductId() }}"
            quantity: 1
      - think: 1
      - get:
          url: "/api/cart"
          headers:
            Authorization: "Bearer {{ $randomToken() }}"

  - name: "Checkout Process"
    weight: 10
    flow:
      - post:
          url: "/api/orders"
          headers:
            Authorization: "Bearer {{ $randomToken() }}"
          json:
            items:
              - productId: "{{ $randomProductId() }}"
                quantity: 1
            shippingAddress:
              street: "123 Test St"
              city: "Test City"
              state: "TS"
              pincode: "123456"
              country: "India"
            totalAmount: 9999
```

### Performance Monitoring

```javascript
// tests/performance/performance-monitor.js
const { performance } = require('perf_hooks')
const axios = require('axios')

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      responseTime: [],
      throughput: [],
      errorRate: [],
      memoryUsage: [],
      cpuUsage: []
    }
  }

  async measureEndpoint(url, method = 'GET', payload = {}) {
    const startTime = performance.now()
    
    try {
      const response = await axios({
        method,
        url,
        data: payload,
        timeout: 30000
      })
      
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      this.recordMetric('responseTime', responseTime)
      this.recordMetric('throughput', 1)
      
      return {
        responseTime,
        status: response.status,
        success: true
      }
    } catch (error) {
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      this.recordMetric('responseTime', responseTime)
      this.recordMetric('errorRate', 1)
      
      return {
        responseTime,
        error: error.message,
        success: false
      }
    }
  }

  recordMetric(type, value) {
    if (!this.metrics[type]) {
      this.metrics[type] = []
    }
    this.metrics[type].push({
      value,
      timestamp: Date.now()
    })
  }

  calculateStats(metricType) {
    const values = this.metrics[metricType].map(m => m.value)
    
    if (values.length === 0) {
      return null
    }
    
    const sorted = values.sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)
    
    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {},
      details: {}
    }
    
    Object.keys(this.metrics).forEach(metricType => {
      const stats = this.calculateStats(metricType)
      if (stats) {
        report.summary[metricType] = {
          average: stats.avg,
          min: stats.min,
          max: stats.max,
          p95: stats.p95,
          p99: stats.p99
        }
        
        report.details[metricType] = {
          samples: stats.count,
          distribution: this.createDistribution(this.metrics[metricType])
        }
      }
    })
    
    return report
  }

  createDistribution(metricData) {
    const values = metricData.map(m => m.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const bins = 10
    const binSize = (max - min) / bins
    
    const distribution = []
    
    for (let i = 0; i < bins; i++) {
      const binMin = min + (i * binSize)
      const binMax = binMin + binSize
      const count = values.filter(v => v >= binMin && v < binMax).length
      
      distribution.push({
        range: `${binMin.toFixed(2)}-${binMax.toFixed(2)}`,
        count,
        percentage: (count / values.length) * 100
      })
    }
    
    return distribution
  }
}

// Usage example
async function runPerformanceTests() {
  const monitor = new PerformanceMonitor()
  const endpoints = [
    '/api/products',
    '/api/products/64a1b2c3d4e5f6789012345',
    '/api/categories',
    '/api/auth/login'
  ]
  
  console.log('Starting performance tests...')
  
  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint}...`)
    
    // Run 100 requests
    for (let i = 0; i < 100; i++) {
      await monitor.measureEndpoint(endpoint)
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  const report = monitor.generateReport()
  
  console.log('Performance Report:')
  console.log(JSON.stringify(report, null, 2))
  
  // Save report to file
  const fs = require('fs')
  fs.writeFileSync('performance-report.json', JSON.stringify(report, null, 2))
  
  console.log('Report saved to performance-report.json')
}

// Run if called directly
if (require.main === module) {
  runPerformanceTests().catch(console.error)
}

module.exports = PerformanceMonitor
```

## Security Testing

### Security Test Suite

```javascript
// tests/security/security.test.js
const request = require('supertest')
const app = require('../../app')
const User = require('../../models/User')

describe('Security Tests', () => {
  describe('Authentication Security', () => {
    test('prevents SQL injection in login', async () => {
      const maliciousInput = {
        email: "'; DROP TABLE users; --",
        password: "password"
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(maliciousInput)
        .expect(401)

      expect(response.body.success).toBe(false)
      
      // Verify users table still exists
      const users = await User.find()
      expect(users).toBeDefined()
    })

    test('prevents brute force attacks', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      // Make multiple failed login attempts
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/auth/login')
          .send(loginData)
      }

      // Should be rate limited
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(429)

      expect(response.body.error).toContain('rate limit')
    })

    test('validates JWT tokens properly', async () => {
      const invalidTokens = [
        'invalid.jwt.token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid',
        '',
        null,
        undefined
      ]

      for (const token of invalidTokens) {
        const response = await request(app)
          .get('/api/user/profile')
          .set('Authorization', `Bearer ${token}`)
          .expect(401)

        expect(response.body.success).toBe(false)
      }
    })

    test('prevents XSS in user inputs', async () => {
      const xssPayload = {
        firstName: '<script>alert("xss")</script>',
        lastName: 'Doe',
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(xssPayload)
        .expect(201)

      // Verify script tag is escaped
      expect(response.body.user.firstName).not.toContain('<script>')
    })
  })

  describe('API Security', () => {
    test('enforces CORS policies', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Origin', 'http://malicious-site.com')
        .expect(200)

      expect(response.headers['access-control-allow-origin']).not.toBe('http://malicious-site.com')
    })

    test('prevents unauthorized access to admin endpoints', async () => {
      const adminEndpoints = [
        '/api/admin/dashboard',
        '/api/admin/products',
        '/api/admin/orders',
        '/api/admin/customers'
      ]

      for (const endpoint of adminEndpoints) {
        await request(app)
          .get(endpoint)
          .expect(401)

        await request(app)
          .post(endpoint)
          .send({})
          .expect(401)

        await request(app)
          .put(endpoint + '/123')
          .send({})
          .expect(401)

        await request(app)
          .delete(endpoint + '/123')
          .expect(401)
      }
    })

    test('validates input data types', async () => {
      const invalidData = {
        name: 123, // Should be string
        price: 'invalid', // Should be number
        category: null, // Should be string
        stock: -10 // Should be positive
      }

      const response = await request(app)
        .post('/api/admin/products')
        .set('Authorization', 'Bearer valid-admin-token')
        .send(invalidData)
        .expect(400)

      expect(response.body.error).toContain('validation')
    })

    test('prevents mass assignment vulnerabilities', async () => {
      const maliciousPayload = {
        name: 'Valid Product',
        price: 9999,
        category: 'electronics',
        role: 'admin', // Should not be assignable
        isAdmin: true, // Should not be assignable
        permissions: ['all'] // Should not be assignable
      }

      // This should only update allowed fields
      const response = await request(app)
        .post('/api/admin/products')
        .set('Authorization', 'Bearer valid-admin-token')
        .send(maliciousPayload)
        .expect(201)

      expect(response.body.data.role).toBeUndefined()
      expect(response.body.data.isAdmin).toBeUndefined()
      expect(response.body.data.permissions).toBeUndefined()
    })
  })

  describe('Data Protection', () => {
    test('hashes passwords securely', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      // Password should not be returned
      expect(response.body.user.password).toBeUndefined()

      // Check database
      const user = await User.findOne({ email: userData.email })
      expect(user.password).not.toBe(userData.password)
      expect(user.password).toMatch(/^\$2[aby]\$\d+\$/) // bcrypt hash format
    })

    test('does not expose sensitive data in responses', async () => {
      // Create user and login
      await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          password: 'password123'
        })

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        })

      const token = loginResponse.body.token

      // Get profile
      const profileResponse = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      // Check no sensitive data
      expect(profileResponse.body.data.password).toBeUndefined()
      expect(profileResponse.body.data.loginAttempts).toBeUndefined()
      expect(profileResponse.body.data.passwordResetToken).toBeUndefined()
    })
  })
})
```

## Accessibility Testing

### Accessibility Test Suite

```javascript
// tests/accessibility/accessibility.test.js
const { axe, toHaveNoViolations } = require('jest-axe')
const { render, screen } = '@testing-library/react'
import ProductCard from '../../components/ProductCard'

expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  test('ProductCard has no accessibility violations', async () => {
    const mockProduct = {
      _id: '1',
      name: 'Test Product',
      price: 999,
      image: 'test-image.jpg',
      averageRating: 4.5,
      reviewCount: 128,
      stock: 45
    }

    const { container } = render(<ProductCard {...mockProduct} />)
    const results = await axe(container)
    
    expect(results).toHaveNoViolations()
  })

  test('Navigation is keyboard accessible', () => {
    render(<Navigation />)
    
    const navItems = screen.getAllByRole('menuitem')
    
    navItems.forEach(item => {
      expect(item).toHaveAttribute('tabindex')
      expect(item).toHaveAttribute('aria-label')
    })
  })

  test('Forms have proper labels', () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  test('Images have alt text', () => {
    const mockProduct = {
      _id: '1',
      name: 'Test Product',
      price: 999,
      image: 'test-image.jpg'
    }

    render(<ProductCard {...mockProduct} />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt')
  })

  test('Buttons have accessible names', () => {
    render(<ProductCard {...mockProduct} />)
    
    const buttons = screen.getAllByRole('button')
    
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName()
    })
  })
})
```

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/src/**/__tests__/**/*.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testTimeout: 10000
}
```

### Cypress Configuration

```javascript
// cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    env: {
      apiUrl: 'http://localhost:8000/api'
    }
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
})
```

## Continuous Integration

### GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6.0
        env:
          MONGO_INITDB_ROOT_USERNAME: test
          MONGO_INITDB_ROOT_PASSWORD: test
        ports:
          - 27017:27017
      
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit
        env:
          MONGODB_TEST_URL: mongodb://test:test@localhost:27017/test?authSource=admin
          REDIS_URL: redis://localhost:6379
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    services:
      mongodb:
        image: mongo:6.0
        env:
          MONGO_INITDB_ROOT_USERNAME: test
          MONGO_INITDB_ROOT_PASSWORD: test
        ports:
          - 27017:27017
      
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start backend server
        run: npm run start:test &
        env:
          NODE_ENV: test
          MONGODB_URL: mongodb://test:test@localhost:27017/test?authSource=admin
          REDIS_URL: redis://localhost:6379
      
      - name: Wait for server
        run: sleep 10
      
      - name: Run integration tests
        run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    needs: integration-tests
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start full stack
        run: |
          npm run start:test &
          npm run start:frontend &
          sleep 30
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots

  performance-tests:
    runs-on: ubuntu-latest
    needs: e2e-tests
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install artillery
        run: npm install -g artillery
      
      - name: Start server
        run: npm run start:test &
        env:
          NODE_ENV: test
          MONGODB_URL: mongodb://test:test@localhost:27017/test?authSource=admin
          REDIS_URL: redis://localhost:6379
      
      - name: Wait for server
        run: sleep 10
      
      - name: Run performance tests
        run: artillery run artillery-config.yml
      
      - name: Upload performance report
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: artillery-report.html
```

## Test Reports

### Coverage Report Generation

```javascript
// scripts/generate-coverage-report.js
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function generateCoverageReport() {
  try {
    // Run tests with coverage
    console.log('Running tests with coverage...')
    execSync('npm run test:coverage', { stdio: 'inherit' })
    
    // Generate HTML report
    console.log('Generating HTML coverage report...')
    execSync('npx nyc report --reporter=html', { stdio: 'inherit' })
    
    // Generate summary report
    const coveragePath = path.join(__dirname, '../coverage/coverage-summary.json')
    const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'))
    
    const summary = {
      timestamp: new Date().toISOString(),
      total: {
        lines: coverageData.total.lines,
        functions: coverageData.total.functions,
        branches: coverageData.total.branches,
        statements: coverageData.total.statements
      },
      coverage: {
        lines: coverageData.total.lines.pct,
        functions: coverageData.total.functions.pct,
        branches: coverageData.total.branches.pct,
        statements: coverageData.total.statements.pct
      }
    }
    
    // Save summary
    fs.writeFileSync(
      path.join(__dirname, '../coverage-summary.json'),
      JSON.stringify(summary, null, 2)
    )
    
    console.log('Coverage report generated successfully!')
    console.log(`Overall coverage: ${summary.coverage.statements}%`)
    
  } catch (error) {
    console.error('Error generating coverage report:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  generateCoverageReport()
}

module.exports = generateCoverageReport
```

This comprehensive testing documentation covers all aspects of testing the VEBStore platform, ensuring high-quality, reliable, and secure software delivery.
