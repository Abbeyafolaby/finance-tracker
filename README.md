# Finance Tracker

A comprehensive personal finance management application for tracking income, expenses, and maintaining financial balance.

## Description

Finance Tracker is a web application designed to help individuals manage their personal finances effectively. The application provides intuitive tools for recording financial transactions, categorizing expenses, setting budgets, and generating detailed financial reports to help users make informed financial decisions.

## Features

- **Transaction Management**
  - Record income and expense transactions
  - Categorize transactions (Food, Transportation, Entertainment, etc.)
  - Add transaction descriptions and notes
  - Support for recurring transactions

- **Balance Tracking**
  - Real-time balance calculation
  - Account balance history

- **User Experience**
  - Responsive design for mobile and desktop
  - Intuitive user interface
  - Data export functionality (CSV, PDF)
  - Secure user authentication

## Installation & Usage

### Prerequisites
- Node.js
- MongoDB


### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/financetracker
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Usage
1. **Register/Login**: Create an account or login to access your dashboard
2. **Add Transactions**: Record your income and expenses with categories
3. **View Reports**: Access detailed analytics and reports on your spending habits

## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Testing**: Jest

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/reports/summary` - Get financial summary
- `GET /api/analytics/spending` - Get spending analytics

## Author

**Name**
- Name: Abiodun Afolabi
- GitHub: [@Abbeyafolaby](https://github.com/Abbeyafolaby)