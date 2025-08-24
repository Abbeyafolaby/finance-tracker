import { body, validationResult } from 'express-validator';

// Validation rules for user registration
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('accountType')
    .isIn(['personal', 'business', 'savings'])
    .withMessage('Account type must be personal, business, or savings'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),
];

// Validation rules for profile update
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('accountType')
    .optional()
    .isIn(['personal', 'business', 'savings'])
    .withMessage('Account type must be personal, business, or savings'),
];

// Middleware to check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  next();
};

export {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  handleValidationErrors,
};
