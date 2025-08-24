import User from '../models/User.js';

// Get user profile (protected route)
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update user profile (protected route)
const updateProfile = async (req, res) => {
  try {
    const { name, accountType } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (accountType) updates.accountType = accountType;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get user balance (protected route)
const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('balance name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        balance: user.balance,
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update user balance (protected route - for future transaction implementation)
const updateBalance = async (req, res) => {
  try {
    const { amount, type } = req.body; // type: 'add' or 'subtract'

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      });
    }

    if (!type || !['add', 'subtract'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "add" or "subtract"',
      });
    }

    let balanceChange;
    if (type === 'add') {
      balanceChange = amount;
    } else {
      // Check if user has sufficient balance
      if (req.user.balance < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance',
        });
      }
      balanceChange = -amount;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { balance: balanceChange } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: `Balance ${type === 'add' ? 'added' : 'subtracted'} successfully`,
      data: {
        newBalance: user.balance,
        change: balanceChange,
      },
    });
  } catch (error) {
    console.error('Update balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export { getProfile, updateProfile, getBalance, updateBalance };
