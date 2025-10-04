import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import mongoose from 'mongoose';

// @desc    Create new transaction (income or expense)
// @route   POST /api/transactions
export const createTransaction = async (req, res) => {
  try {
    const { transactionType, amount, date, source, incomeType, note, category, description } = req.body;
    const userId = req.user.id;

    // Validate required fields based on transaction type
    if (transactionType === 'income') {
      if (!source || !incomeType) {
        return res.status(400).json({ 
          message: "Source and income type are required for income transactions" 
        });
      }
    } else if (transactionType === 'expense') {
      if (!category) {
        return res.status(400).json({ 
          message: "Category is required for expense transactions" 
        });
      }
    }

    const transaction = new Transaction({
      user: userId,
      transactionType,
      amount,
      date,
      source: transactionType === 'income' ? source : undefined,
      incomeType: transactionType === 'income' ? incomeType : undefined,
      note: transactionType === 'income' ? note : undefined,
      category: transactionType === 'expense' ? category : undefined,
      description: transactionType === 'expense' ? description : undefined,
    });

    await transaction.save();

    // Update budget if this is an expense transaction
    let budgetAlert = null;
    if (transactionType === 'expense') {
      const transactionDate = new Date(date);
      const month = transactionDate.getMonth() + 1;
      const year = transactionDate.getFullYear();

      const budget = await Budget.findOne({
        user: userId,
        category: category,
        month: month,
        year: year
      });

      if (budget) {
        budget.spentAmount += amount;
        await budget.save();

        // Check if alert should be triggered
        const spentPercentage = (budget.spentAmount / budget.budgetAmount) * 100;
        if (budget.alertEnabled && (spentPercentage >= budget.alertThreshold || budget.isExceeded)) {
          budgetAlert = {
            category: budget.category,
            message: budget.isExceeded 
              ? `Budget exceeded for ${budget.category}! Overspent by $${budget.exceededAmount.toFixed(2)}`
              : `Warning: ${spentPercentage.toFixed(1)}% of ${budget.category} budget used`,
            type: budget.isExceeded ? 'error' : 'warning',
            budgetAmount: budget.budgetAmount,
            spentAmount: budget.spentAmount,
            remainingAmount: budget.remainingAmount
          };
        }
      }
    }

    res.status(201).json({ 
      message: "Transaction created successfully", 
      transaction,
      budgetAlert 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get all transactions for a user
// @route   GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, limit, page = 1 } = req.query;

    let query = { user: userId };
    
    // Filter by transaction type if specified
    if (type && ['income', 'expense'].includes(type)) {
      query.transactionType = type;
    }

    const limitNum = limit ? parseInt(limit) : undefined;
    const skip = limitNum ? (parseInt(page) - 1) * limitNum : 0;

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(limitNum)
      .skip(skip)
      .lean();

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: limitNum ? {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limitNum),
        totalTransactions: total,
        hasNext: skip + limitNum < total,
        hasPrev: parseInt(page) > 1
      } : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
export const getTransactionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const transaction = await Transaction.findOne({ 
      _id: req.params.id, 
      user: userId 
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { transactionType, amount, date, source, incomeType, note, category, description } = req.body;

    const transaction = await Transaction.findOne({ 
      _id: req.params.id, 
      user: userId 
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update fields based on transaction type
    transaction.transactionType = transactionType || transaction.transactionType;
    transaction.amount = amount || transaction.amount;
    transaction.date = date || transaction.date;

    if (transactionType === 'income') {
      transaction.source = source || transaction.source;
      transaction.incomeType = incomeType || transaction.incomeType;
      transaction.note = note || transaction.note;
      // Clear expense fields
      transaction.category = undefined;
      transaction.description = undefined;
    } else if (transactionType === 'expense') {
      transaction.category = category || transaction.category;
      transaction.description = description || transaction.description;
      // Clear income fields
      transaction.source = undefined;
      transaction.incomeType = undefined;
      transaction.note = undefined;
    }

    await transaction.save();
    res.json({ message: "Transaction updated successfully", transaction });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transaction = await Transaction.findOneAndDelete({ 
      _id: req.params.id, 
      user: userId 
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get transaction summary for dashboard
// @route   GET /api/transactions/summary
export const getTransactionSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Convert userId to ObjectId for proper MongoDB comparison
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // Get ALL user transactions (remove month/year filter for now to test)
    const incomeResult = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          transactionType: 'income'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const expenseResult = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          transactionType: 'expense'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpenses = expenseResult[0]?.total || 0;
    const savings = totalIncome - totalExpenses;

    res.json({
      income: totalIncome,
      expenses: totalExpenses,
      savings: savings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get transactions by category (for analytics)
// @route   GET /api/transactions/analytics/category
export const getTransactionsByCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const matchQuery = {
      user: userId,
      transactionType: 'expense'
    };

    if (month) matchQuery.month = parseInt(month);
    if (year) matchQuery.year = parseInt(year);

    const categoryData = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          count: 1,
          _id: 0
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(categoryData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
