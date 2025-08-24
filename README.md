# Finance Tracker

A comprehensive personal finance management application for tracking income, expenses, and maintaining financial balance.

## Description

Finance Tracker is a web application designed to help individuals manage their personal finances effectively. The application provides intuitive tools for recording financial transactions, categorizing expenses, setting budgets, and generating detailed financial reports to help users make informed financial decisions.

## Features

- **User Authentication**
  - Secure user registration and login
  - JWT-based authentication
  - Password hashing with bcrypt

- **Balance Tracking**
  - Real-time balance calculation
  - Account balance history
  - Default balance of 0 for new users

- **Transaction Management**
  - Record income and expense transactions
  - Categorize transactions (Food, Transportation, Entertainment, etc.)
  - Add transaction descriptions and notes
  - Support for recurring transactions
  - **Advanced Features**:
    - Pagination and filtering (by type, category, date range)
    - Sorting capabilities (by amount, date, etc.)
    - Transaction statistics and analytics
    - Category breakdown and monthly summaries
    - Automatic balance adjustment after each transaction

- **User Experience**
  - Responsive design for mobile and desktop
  - Intuitive user interface
  - Data export functionality (CSV, PDF)
  - Secure user authentication

## Installation & Usage

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/financetracker
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser and navigate to `http://localhost:3000`**

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt for password hashing
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Express-validator
- **Development**: Nodemon, ESLint, Prettier
- **Testing**: Jest, Supertest

## Project Structure

```
finance-tracker/
├── config/          # Database and app configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware (auth, validation)
├── models/          # Database models
├── routes/          # API route definitions
├── tests/           # Test files
├── app.js           # Express app configuration
├── server.js        # Server entry point
├── package.json     # Dependencies and scripts
└── README.md        # Project documentation
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### User Management

- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users/balance` - Get user balance (protected)
- `POST /api/users/balance` - Update user balance (protected)

### Transactions

- `GET /api/transactions` - Get all transactions with pagination & filtering (protected)
- `POST /api/transactions` - Create new transaction (protected)
- `GET /api/transactions/:id` - Get specific transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)
- `GET /api/transactions/stats` - Get transaction statistics (protected)

### Reports (to be implemented)

- `GET /api/reports/summary` - Get financial summary (protected)
- `GET /api/analytics/spending` - Get spending analytics (protected)

## API Testing with Postman/Thunder Client

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### 1. User Registration

**POST** `/auth/register`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "accountType": "tier 1",
  "password": "SecurePass123"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "accountType": "tier 1",
      "balance": 0,
      "isActive": true,
      "createdAt": "2023-09-06T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. User Login

**POST** `/auth/login`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "accountType": "tier 1",
      "balance": 0,
      "isActive": true,
      "createdAt": "2023-09-06T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Get User Profile (Protected)

**GET** `/auth/profile`

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "accountType": "tier 1",
      "balance": 0,
      "isActive": true,
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

### User Management Endpoints

#### 4. Get User Profile (Protected)

**GET** `/users/profile`

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "accountType": "tier 1",
      "balance": 0,
      "isActive": true,
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

#### 5. Update User Profile (Protected)

**PUT** `/users/profile`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Body (JSON):**

```json
{
  "name": "John Smith",
  "accountType": "tier 2"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Smith",
      "email": "john.doe@example.com",
      "accountType": "tier 2",
      "balance": 0,
      "isActive": true,
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

#### 6. Get User Balance (Protected)

**GET** `/users/balance`

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "balance": 1500.5,
    "user": {
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

#### 7. Update User Balance (Protected)

**POST** `/users/balance`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Body (JSON):**

```json
{
  "amount": 500,
  "type": "add"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Balance added successfully",
  "data": {
    "newBalance": 2000.5,
    "change": 500
  }
}
```

### Transaction Endpoints

#### 8. Create Transaction (Protected)

**POST** `/transactions`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Body (JSON):**

```json
{
  "amount": 150.75,
  "type": "debit",
  "description": "Grocery shopping",
  "category": "Food",
  "date": "2024-01-15T10:30:00.000Z"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "transaction": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "user": "64f8a1b2c3d4e5f6a7b8c9d0",
      "amount": 150.75,
      "type": "debit",
      "description": "Grocery shopping",
      "category": "Food",
      "date": "2024-01-15T10:30:00.000Z",
      "balanceAfter": 849.25,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "newBalance": 849.25
  }
}
```

#### 9. Get All Transactions (Protected)

**GET** `/transactions`

**Query Parameters:**

- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)
- `type` (optional): Filter by transaction type (credit/debit)
- `category` (optional): Filter by category
- `startDate` (optional): Filter transactions from this date (ISO format)
- `endDate` (optional): Filter transactions until this date (ISO format)
- `sortBy` (optional): Sort field (default: date)
- `sortOrder` (optional): Sort order (asc/desc, default: desc)

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "user": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "amount": 150.75,
        "type": "debit",
        "description": "Grocery shopping",
        "category": "Food",
        "date": "2024-01-15T10:30:00.000Z",
        "balanceAfter": 849.25,
        "formattedAmount": "-$150.75"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### 10. Get Specific Transaction (Protected)

**GET** `/transactions/:id`

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "amount": 150.75,
    "type": "debit",
    "description": "Grocery shopping",
    "category": "Food",
    "date": "2024-01-15T10:30:00.000Z",
    "balanceAfter": 849.25,
    "formattedAmount": "-$150.75"
  }
}
```

#### 11. Update Transaction (Protected)

**PUT** `/transactions/:id`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Body (JSON):**

```json
{
  "amount": 175.5,
  "type": "debit",
  "description": "Updated grocery shopping",
  "category": "Food & Beverages"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "transaction": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "amount": 175.5,
      "type": "debit",
      "description": "Updated grocery shopping",
      "category": "Food & Beverages",
      "balanceAfter": 824.5
    },
    "newBalance": 824.5
  }
}
```

#### 12. Delete Transaction (Protected)

**DELETE** `/transactions/:id`

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response Example:**

```json
{
  "success": true,
  "message": "Transaction deleted successfully",
  "data": {
    "deletedTransaction": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "amount": 175.5,
      "type": "debit",
      "description": "Updated grocery shopping"
    },
    "newBalance": 1000.0
  }
}
```

#### 13. Get Transaction Statistics (Protected)

**GET** `/transactions/stats`

**Query Parameters:**

- `startDate` (optional): Start date for statistics (ISO format)
- `endDate` (optional): End date for statistics (ISO format)

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalTransactions": 25,
      "totalCredit": 5000.0,
      "totalDebit": 3250.75,
      "netAmount": 1749.25,
      "averageAmount": 200.0
    },
    "categoryBreakdown": [
      {
        "_id": "Food",
        "count": 8,
        "totalAmount": 1200.5
      },
      {
        "_id": "Transportation",
        "count": 5,
        "totalAmount": 450.0
      }
    ],
    "monthlyBreakdown": [
      {
        "_id": {
          "year": 2024,
          "month": 1
        },
        "count": 15,
        "totalCredit": 3000.0,
        "totalDebit": 2000.0
      }
    ]
  }
}
```

### Testing Workflow

1. **Start with Registration**: Use the registration endpoint to create a new user
2. **Login**: Use the login endpoint to get a JWT token
3. **Copy the Token**: From the login response, copy the `token` value
4. **Set Authorization Header**: For all protected endpoints, add `Authorization: Bearer YOUR_TOKEN_HERE`
5. **Test Protected Endpoints**: Use the token to test profile and balance endpoints

### Common Error Responses

#### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

#### Authentication Error (401)

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### Unauthorized (401)

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

#### Not Found (404)

```json
{
  "success": false,
  "message": "User not found"
}
```

#### Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Postman Collection Setup

1. **Create a new collection** named "Finance Tracker API"
2. **Set base URL variable**: Create a variable `baseUrl` with value `http://localhost:3000/api`
3. **Set token variable**: After login, set a variable `token` with the JWT token value
4. **Use variables in requests**:
   - URL: `{{baseUrl}}/auth/login`
   - Authorization: `Bearer {{token}}`

### Thunder Client Setup

1. **Create a new collection** named "Finance Tracker API"
2. **Set environment variables**:
   - `baseUrl`: `http://localhost:3000/api`
   - `token`: (leave empty initially, will be set after login)
3. **Use variables in requests**:
   - URL: `{{baseUrl}}/auth/login`
   - Authorization: `Bearer {{token}}`

## Security Features

- **Password Security**: All passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication for protected routes
- **Input Validation**: Comprehensive validation using express-validator
- **Security Headers**: Helmet.js for HTTP security headers
- **Rate Limiting**: Protection against brute force attacks and abuse
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Input Sanitization**: XSS protection and injection attack prevention
- **Data Validation**: Amount must be positive, type must be credit/debit
- **Automatic Balance Management**: Secure balance updates after each transaction

## Development Guidelines

- Follow ESLint rules for code consistency
- Use Prettier for code formatting
- Write tests for new features
- Follow RESTful API design principles
- Implement proper error handling
- Use async/await for database operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the ISC License.

## Author

**Abiodun Afolabi**

- GitHub: [@Abbeyafolaby](https://github.com/Abbeyafolaby)
