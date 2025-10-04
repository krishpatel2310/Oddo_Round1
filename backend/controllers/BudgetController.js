import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

// @desc    Create or update budget for a category
// @route   POST /api/budgets
export const createOrUpdateBudget = async (req, res) => {
  try {
    const { category, budgetAmount, period, alertThreshold, alertEnabled, month, year } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!category || !budgetAmount || !month || !year) {
      return res.status(400).json({ 
        message: "Category, budget amount, month, and year are required" 
      });
    }

    // Check if budget already exists for this category and period
    let budget = await Budget.findOne({
      user: userId,
      category,
      month,
      year
    });

    if (budget) {
      // Update existing budget
      budget.budgetAmount = budgetAmount;
      budget.period = period || budget.period;
      budget.alertThreshold = alertThreshold !== undefined ? alertThreshold : budget.alertThreshold;
      budget.alertEnabled = alertEnabled !== undefined ? alertEnabled : budget.alertEnabled;
    } else {
      // Create new budget
      budget = new Budget({
        user: userId,
        category,
        budgetAmount,
        period: period || 'monthly',
        alertThreshold: alertThreshold || 80,
        alertEnabled: alertEnabled !== undefined ? alertEnabled : true,
        month,
        year
      });

      // Calculate spent amount from existing transactions
      const spentAmount = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            transactionType: 'expense',
            category: category,
            month: month,
            year: year
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]);

      budget.spentAmount = spentAmount.length > 0 ? spentAmount[0].total : 0;
    }

    await budget.save();
    
    res.status(201).json({ 
      message: budget.isNew ? "Budget created successfully" : "Budget updated successfully", 
      budget 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get all budgets for a user
// @route   GET /api/budgets
export const getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year, period } = req.query;

    let query = { user: userId };
    
    // If no month/year specified, get current month's budgets
    const currentDate = new Date();
    const currentMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const currentYear = year ? parseInt(year) : currentDate.getFullYear();
    
    query.month = currentMonth;
    query.year = currentYear;
    
    if (period) {
      query.period = period;
    }

    const budgets = await Budget.find(query).sort({ category: 1 });
    
    // Update spent amounts for each budget
    for (let budget of budgets) {
      const spentAmount = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            transactionType: 'expense',
            category: budget.category,
            month: currentMonth,
            year: currentYear
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]);

      budget.spentAmount = spentAmount.length > 0 ? spentAmount[0].total : 0;
      budget.spent = budget.spentAmount; // Add spent property for frontend compatibility
      budget.amount = budget.budgetAmount; // Add amount property for frontend compatibility
      await budget.save();
    }
    
    res.json({ 
      budgets,
      message: "Budgets retrieved successfully"
    });
  } catch (err) {
    console.error('Error in getBudgets:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get budget by ID
// @route   GET /api/budgets/:id
export const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get budget analytics and charts data
// @route   GET /api/budgets/analytics
export const getBudgetAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    // Get budget overview
    const budgets = await Budget.find({
      user: userId,
      month: currentMonth,
      year: currentYear
    });

    // Calculate totals
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.budgetAmount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spentAmount, 0);
    const totalRemaining = Math.max(0, totalBudget - totalSpent);
    const totalOverspending = budgets.reduce((sum, budget) => sum + (budget.isExceeded ? budget.exceededAmount : 0), 0);
    const exceededBudgets = budgets.filter(budget => budget.isExceeded).length;

    // Budget vs Spent by category (for charts)
    const categoryData = budgets.map(budget => ({
      category: budget.category,
      budgeted: budget.budgetAmount,
      spent: budget.spentAmount,
      remaining: budget.remainingAmount,
      percentage: budget.budgetAmount > 0 ? (budget.spentAmount / budget.budgetAmount * 100).toFixed(1) : 0,
      isExceeded: budget.isExceeded,
      exceededAmount: budget.exceededAmount
    }));

    // Monthly trend data (last 6 months)
    const trendData = await Budget.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          year: { $gte: currentYear - 1 }
        }
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalBudget: { $sum: "$budgetAmount" },
          totalSpent: { $sum: "$spentAmount" },
          exceededCount: { $sum: { $cond: ["$isExceeded", 1, 0] } }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $limit: 6
      }
    ]);

    // Alerts for overspending
    const alerts = budgets.filter(budget => {
      const spentPercentage = budget.budgetAmount > 0 ? (budget.spentAmount / budget.budgetAmount * 100) : 0;
      return budget.alertEnabled && (spentPercentage >= budget.alertThreshold || budget.isExceeded);
    }).map(budget => ({
      category: budget.category,
      message: budget.isExceeded 
        ? `Budget exceeded for ${budget.category}! Overspent by ₹${budget.exceededAmount.toFixed(2)}`
        : `Warning: ${((budget.spentAmount / budget.budgetAmount) * 100).toFixed(1)}% of ${budget.category} budget used`,
      type: budget.isExceeded ? 'error' : 'warning',
      budgetAmount: budget.budgetAmount,
      spentAmount: budget.spentAmount,
      exceededAmount: budget.exceededAmount
    }));

    res.json({
      overview: {
        totalBudget,
        totalSpent,
        remaining: totalRemaining,
        overspending: totalOverspending,
        exceededBudgets,
        budgetUtilization: totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0
      },
      categoryData,
      trendData: trendData.map(item => ({
        month: `${item._id.month}/${item._id.year}`,
        totalBudget: item.totalBudget,
        totalSpent: item.totalSpent,
        exceededCount: item.exceededCount,
        utilization: item.totalBudget > 0 ? ((item.totalSpent / item.totalBudget) * 100).toFixed(1) : 0
      })),
      alerts,
      budgets
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update budget spending (called when transaction is created)
// @route   PUT /api/budgets/update-spending
export const updateBudgetSpending = async (req, res) => {
  try {
    const { category, amount, date, transactionType } = req.body;
    const userId = req.user.id;

    if (transactionType !== 'expense') {
      return res.json({ message: "Budget update skipped - not an expense" });
    }

    const transactionDate = new Date(date);
    const month = transactionDate.getMonth() + 1;
    const year = transactionDate.getFullYear();

    const budget = await Budget.findOne({
      user: userId,
      category,
      month,
      year
    });

    if (budget) {
      budget.spentAmount += amount;
      await budget.save();

      // Check if alert should be triggered
      const spentPercentage = (budget.spentAmount / budget.budgetAmount) * 100;
      const shouldAlert = budget.alertEnabled && 
        (spentPercentage >= budget.alertThreshold || budget.isExceeded);

      res.json({ 
        message: "Budget updated successfully",
        budget,
        alert: shouldAlert ? {
          category: budget.category,
          message: budget.isExceeded 
            ? `Budget exceeded for ${budget.category}! Overspent by $${budget.exceededAmount.toFixed(2)}`
            : `Warning: ${spentPercentage.toFixed(1)}% of ${budget.category} budget used`,
          type: budget.isExceeded ? 'error' : 'warning'
        } : null
      });
    } else {
      res.json({ message: "No budget found for this category and period" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get spending trends and patterns
// @route   GET /api/budgets/spending-trends
export const getSpendingTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'last6months' } = req.query;

        let matchStage = { user: new mongoose.Types.ObjectId(userId) };
    
    // Adjust date range based on period
    const now = new Date();
    if (period === 'last6months') {
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      matchStage.createdAt = { $gte: sixMonthsAgo };
    } else if (period === 'lastyear') {
      const lastYear = new Date(now.getFullYear() - 1, 0, 1);
      matchStage.createdAt = { $gte: lastYear };
    }

    // Get spending by category over time
    const spendingTrends = await Transaction.aggregate([
      {
        $match: {
          ...matchStage,
          transactionType: 'expense'
        }
      },
      {
        $group: {
          _id: {
            month: "$month",
            year: "$year",
            category: "$category"
          },
          totalSpent: { $sum: "$amount" },
          transactionCount: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format data for charts
    const formattedTrends = {};
    spendingTrends.forEach(item => {
      const monthKey = `${item._id.month}/${item._id.year}`;
      if (!formattedTrends[monthKey]) {
        formattedTrends[monthKey] = {};
      }
      formattedTrends[monthKey][item._id.category] = item.totalSpent;
    });

    res.json({
      spendingTrends: formattedTrends,
      rawData: spendingTrends
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  createOrUpdateBudget,
  getBudgets,
  getBudgetById,
  deleteBudget,
  getBudgetAnalytics,
  updateBudgetSpending,
  getSpendingTrends
};