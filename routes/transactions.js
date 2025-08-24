import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getStats,
} from '../controllers/transactionController.js';

const router = express.Router();

// Create a new transaction
router.post('/', authenticateToken, createTransaction);

// Get all transactions with pagination and filtering
router.get('/', authenticateToken, getTransactions);

// Get transaction statistics
router.get('/stats', authenticateToken, getStats); // ensure stats route exists

// Get a single transaction by ID
router.get('/:id', authenticateToken, getTransactionById);

// Update a transaction
router.put('/:id', authenticateToken, updateTransaction);

// Delete a transaction
router.delete('/:id', authenticateToken, deleteTransaction);

export default router;
