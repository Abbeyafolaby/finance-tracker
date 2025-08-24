import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from '../middleware/validation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register - User registration
router.post(
  '/register',
  validateRegistration,
  handleValidationErrors,
  register
);

// POST /api/auth/login - User login
router.post('/login', validateLogin, handleValidationErrors, login);

// GET /api/auth/profile - Get user profile (protected)
router.get('/profile', auth, getProfile);

export default router;
