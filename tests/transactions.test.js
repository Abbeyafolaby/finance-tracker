import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

describe('Transaction API Endpoints', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Transaction.deleteMany({});

    // Create test user
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'TestPass123',
        accountType: 'tier 1'
      });

    testUser = response.body.data.user;
    authToken = response.body.data.token;
  });

  describe('POST /api/transactions', () => {
    it('should create a new credit transaction', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 100.50,
          type: 'credit',
          description: 'Test credit',
          category: 'Income'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction.amount).toBe(100.50);
      expect(response.body.data.transaction.type).toBe('credit');
      expect(response.body.data.transaction.description).toBe('Test credit');
      expect(response.body.data.transaction.category).toBe('Income');
      expect(response.body.data.newBalance).toBe(100.50);

      // Verify user balance was updated
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.balance).toBe(100.50);
    });

    it('should create a new debit transaction', async () => {
      // First add some credit to have balance
      await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 200,
          type: 'credit',
          description: 'Initial balance',
        });

      const transactionData = {
        amount: 50.25,
        type: 'debit',
        description: 'Grocery shopping',
        category: 'Food',
      };

      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transactionData);

      expect(response.status).toBe(201);
      expect(response.body.data.transaction.type).toBe('debit');
      expect(response.body.data.newBalance).toBe(149.75);

      // Verify user balance was updated
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.balance).toBe(149.75);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should validate amount is positive', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: -50,
          type: 'debit',
          description: 'Invalid amount',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should validate transaction type', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 100,
          type: 'invalid',
          description: 'Invalid type',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .send({
          amount: 100,
          type: 'credit',
          description: 'No auth',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/transactions', () => {
    beforeEach(async () => {
      // Create test transactions
      const transactions = [
        {
          user: testUser._id,
          amount: 100,
          type: 'credit',
          description: 'Transaction 1',
          category: 'Income',
          date: new Date('2024-01-01'),
          balanceAfter: 100,
        },
        {
          user: testUser._id,
          amount: 50,
          type: 'debit',
          description: 'Transaction 2',
          category: 'Food',
          date: new Date('2024-01-02'),
          balanceAfter: 50,
        },
        {
          user: testUser._id,
          amount: 75,
          type: 'credit',
          description: 'Transaction 3',
          category: 'Bonus',
          date: new Date('2024-01-03'),
          balanceAfter: 125,
        },
      ];

      await Transaction.insertMany(transactions);
    });

    it('should get all transactions for authenticated user', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toHaveLength(3);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/transactions?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.transactions).toHaveLength(2);
      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.itemsPerPage).toBe(2);
    });

    it('should filter by transaction type', async () => {
      const response = await request(app)
        .get('/api/transactions?type=credit')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.transactions).toHaveLength(2);
      response.body.data.transactions.forEach(transaction => {
        expect(transaction.type).toBe('credit');
      });
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/transactions?category=Food')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.transactions).toHaveLength(1);
      expect(response.body.data.transactions[0].category).toBe('Food');
    });

    it('should filter by date range', async () => {
      const response = await request(app)
        .get('/api/transactions?startDate=2024-01-01&endDate=2024-01-02')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.transactions).toHaveLength(2);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/transactions');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/transactions/:id', () => {
    let testTransaction;

    beforeEach(async () => {
      const transaction = new Transaction({
        user: testUser._id,
        amount: 100,
        type: 'credit',
        description: 'Test transaction',
        balanceAfter: 100,
      });
      await transaction.save();
      testTransaction = transaction;
    });

    it('should get a specific transaction', async () => {
      const response = await request(app)
        .get(`/api/transactions/${testTransaction._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testTransaction._id.toString());
    });

    it('should return 404 for non-existent transaction', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/transactions/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should not allow access to other users transactions', async () => {
      const otherUser = new User({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123',
        accountType: 'tier 1',
      });
      await otherUser.save();

      const otherTransaction = new Transaction({
        user: otherUser._id,
        amount: 100,
        type: 'credit',
        description: 'Other user transaction',
        balanceAfter: 100,
      });
      await otherTransaction.save();

      const response = await request(app)
        .get(`/api/transactions/${otherTransaction._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);

      // Clean up
      await User.findByIdAndDelete(otherUser._id);
      await Transaction.findByIdAndDelete(otherTransaction._id);
    });
  });

  describe('PUT /api/transactions/:id', () => {
    let testTransaction;

    beforeEach(async () => {
      // Create initial credit transaction with all required fields
      const creditResponse = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 200,
          type: 'credit',
          description: 'Initial balance',
          category: 'Income', // Add category
        });

      // Create debit transaction with all required fields
      const debitResponse = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 50,
          type: 'debit',
          description: 'Original description',
          category: 'Food', // Add category
        });

      testTransaction = debitResponse.body.data.transaction;
    });

    it('should update a transaction', async () => {
      const updateData = {
        amount: 75,
        description: 'Updated description',
        category: 'Food', // Add category
        type: 'debit' // Explicitly set type
      };

      const response = await request(app)
        .put(`/api/transactions/${testTransaction._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.balance).toBe(125); // 200 - 75 = 125
    });

    it('should handle type change from debit to credit', async () => {
      const updateData = {
        amount: 100,
        type: 'credit',
        description: 'Changed to credit',
      };

      const response = await request(app)
        .put(`/api/transactions/${testTransaction._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.balance).toBe(300); // 200 - (-50) + 100 = 300
    });
  });

  describe('DELETE /api/transactions/:id', () => {
    let testTransaction;

    beforeEach(async () => {
      // Create initial credit transaction
      const creditResponse = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 200,
          type: 'credit',
          description: 'Initial balance',
        });

      // Create debit transaction to be deleted
      const debitResponse = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 50,
          type: 'debit',
          description: 'To be deleted',
        });

      testTransaction = debitResponse.body.data.transaction;
    });

    it('should delete a transaction and adjust balance', async () => {
      const response = await request(app)
        .delete(`/api/transactions/${testTransaction._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.balance).toBe(200); // 150 + 50 = 200 (reverting debit)
    });
  });

  describe('GET /api/transactions/stats', () => {
    beforeEach(async () => {
      // Create transactions through the API to ensure proper handling
      await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 100,
          type: 'credit',
          description: 'Income 1',
          category: 'Salary'
        });

      await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 50,
          type: 'debit',
          description: 'Expense 1',
          category: 'Food'
        });

      await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 75,
          type: 'credit',
          description: 'Income 2',
          category: 'Bonus'
        });
    });

    it('should get transaction statistics', async () => {
      // Get all transactions to verify they exist
      const allTrans = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`);
      
      console.log('All transactions:', JSON.stringify(allTrans.body.data.transactions, null, 2));

      const response = await request(app)
        .get('/api/transactions/stats')
        .set('Authorization', `Bearer ${authToken}`);

      console.log('Stats response:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.summary.totalTransactions).toBe(3);
      expect(response.body.data.summary.totalCredit).toBe(175);
      expect(response.body.data.summary.totalDebit).toBe(50);
      expect(response.body.data.summary.netAmount).toBe(125);
    });
  });
});
