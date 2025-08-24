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

### Transactions (to be implemented)

- `GET /api/transactions` - Get all transactions (protected)
- `POST /api/transactions` - Create new transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)

### Reports (to be implemented)

- `GET /api/reports/summary` - Get financial summary (protected)
- `GET /api/analytics/spending` - Get spending analytics (protected)

## Security Features

- **Password Security**: All passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication for protected routes
- **Input Validation**: Comprehensive validation using express-validator
- **Security Headers**: Helmet.js for security headers
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configurable Cross-Origin Resource Sharing

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
