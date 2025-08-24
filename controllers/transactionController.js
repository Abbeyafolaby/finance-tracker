import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

// Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const { amount, type, description, category, date } = req.body;
    const userId = req.user.id;

    // Get current user balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate new balance
    let newBalance;
    if (type === 'credit') {
      newBalance = user.balance + amount;
    } else {
      newBalance = user.balance - amount;
    }

    // Create transaction
    const transaction = new Transaction({
      user: userId,
      amount,
      type,
      description,
      category,
      date: date || new Date(),
      balanceAfter: newBalance,
    });

    await transaction.save();

    // Update user balance
    user.balance = newBalance;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: {
        transaction,
        newBalance: user.balance,
      },
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message,
    });
  }
};

// Get all transactions for a user with pagination and filtering
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    // Build filter object
    const filter = { user: userId };

    if (type) {
      filter.type = type.toLowerCase();
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get transactions with pagination
    const transactions = await Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email');

    // Get total count for pagination
    const total = await Transaction.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message,
    });
  }
};

// Get a single transaction by ID
export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      _id: id,
      user: userId,
    }).populate('user', 'name email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message,
    });
  }
};

// Update a transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { amount, type, description, category, date } = req.body;

    // Find the transaction
    const transaction = await Transaction.findOne({
      _id: id,
      user: userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Get current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate balance adjustment
    let balanceAdjustment = 0;

    // Remove old transaction effect
    if (transaction.type === 'credit') {
      balanceAdjustment -= transaction.amount;
    } else {
      balanceAdjustment += transaction.amount;
    }

    // Add new transaction effect
    if (type === 'credit') {
      balanceAdjustment += amount;
    } else {
      balanceAdjustment -= amount;
    }

    // Update transaction
    transaction.amount = amount;
    transaction.type = type;
    transaction.description = description;
    transaction.category = category;
    transaction.date = date || transaction.date;
    transaction.balanceAfter = user.balance + balanceAdjustment;

    await transaction.save();

    // Update user balance
    user.balance += balanceAdjustment;
    await user.save();

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: {
        transaction,
        newBalance: user.balance,
      },
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
      error: error.message,
    });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the transaction
    const transaction = await Transaction.findOne({
      _id: id,
      user: userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Get current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate balance adjustment
    let balanceAdjustment = 0;
    if (transaction.type === 'credit') {
      balanceAdjustment -= transaction.amount;
    } else {
      balanceAdjustment += transaction.amount;
    }

    // Update user balance
    user.balance += balanceAdjustment;
    await user.save();

    // Delete transaction
    await Transaction.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      data: {
        deletedTransaction: transaction,
        newBalance: user.balance,
      },
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
      error: error.message,
    });
  }
};

export const getStats = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { startDate, endDate } = req.query;
    const match = { user: mongoose.Types.ObjectId(userId) };

    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    // Summary aggregation
    const summaryAgg = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalCredit: {
            $sum: {
              $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0],
            },
          },
          totalDebit: {
            $sum: {
              $cond: [{ $eq: ['$type', 'debit'] }, '$amount', 0],
            },
          },
          averageAmount: { $avg: '$amount' },
        },
      },
    ]);

    const summaryData = summaryAgg[0] || {
      totalTransactions: 0,
      totalCredit: 0,
      totalDebit: 0,
      averageAmount: 0,
    };

    const netAmount =
      (summaryData.totalCredit || 0) - (summaryData.totalDebit || 0);

    // Category breakdown
    const categoryAgg = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
      {
        $project: {
          category: '$_id',
          totalAmount: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Monthly breakdown
    const monthlyAgg = await Transaction.aggregate([
      { $match: match },
      {
        $project: {
          amount: 1,
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          totalAmount: 1,
          count: 1,
          _id: 0,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    return res.json({
      success: true,
      data: {
        summary: {
          totalTransactions: summaryData.totalTransactions || 0,
          totalCredit: summaryData.totalCredit || 0,
          totalDebit: summaryData.totalDebit || 0,
          netAmount,
          averageAmount: summaryData.averageAmount || 0,
        },
        categoryBreakdown: categoryAgg,
        monthlyBreakdown: monthlyAgg,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findById(id).populate(
      'user',
      'name email'
    );

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: 'Transaction not found' });
    }

    // Ensure the authenticated user owns the transaction
    if (transaction.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ success: false, message: 'Transaction not found' });
    }

    return res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};
