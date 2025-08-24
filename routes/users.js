import express from 'express';
import {
  getProfile,
  updateProfile,
  getBalance,
  updateBalance,
} from '../controllers/userController.js';
import {
  validateProfileUpdate,
  handleValidationErrors,
} from '../middleware/validation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes are protected with authentication middleware
router.use(auth);

// GET /api/users/profile - Get user profile
router.get('/profile', getProfile);

// PUT /api/users/profile - Update user profile
router.put(
  '/profile',
  validateProfileUpdate,
  handleValidationErrors,
  updateProfile
);

// GET /api/users/balance - Get user balance
router.get('/balance', getBalance);

// POST /api/users/balance - Update user balance (for future transaction implementation)
router.post('/balance', updateBalance);

export default router;
