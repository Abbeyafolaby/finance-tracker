import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  validateTransaction,
  handleValidationErrors,
} from '../middleware/validation.js';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getStats,
} from '../controllers/transactionController.js';

const router = express.Router();

// Create a new transaction - ADD VALIDATION MIDDLEWARE
router.post('/', 
  authenticateToken, 
  validateTransaction, 
  handleValidationErrors, 
  createTransaction
);

// Get all transactions with pagination and filtering
router.get('/', authenticateToken, getTransactions);

// Get transaction statistics
router.get('/stats', authenticateToken, getStats);

// Get a single transaction by ID
router.get('/:id', authenticateToken, getTransactionById);

// Update a transaction - ADD VALIDATION MIDDLEWARE
router.put('/:id', 
  authenticateToken, 
  validateTransaction, 
  handleValidationErrors, 
  updateTransaction
);

// Delete a transaction
router.delete('/:id', authenticateToken, deleteTransaction);

export default router;