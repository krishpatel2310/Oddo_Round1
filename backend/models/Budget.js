import mongoose from "mongoose";

const { Schema, model } = mongoose;

const budgetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  category: {
    type: String,
    enum: ["Food", "Transport", "Bills", "Shopping", "Health", "Others"],
    required: [true, "Category is required."],
  },
  
  budgetAmount: {
    type: Number,
    required: [true, "Budget amount is required."],
    min: [0, "Budget amount must be a positive number."],
  },
  
  period: {
    type: String,
    enum: ["monthly", "weekly", "yearly"],
    default: "monthly",
    required: true,
  },
  
  // Tracking fields
  spentAmount: {
    type: Number,
    default: 0,
    min: [0, "Spent amount cannot be negative."],
  },
  
  remainingAmount: {
    type: Number,
    default: 0,
  },
  
  // Alert settings
  alertThreshold: {
    type: Number,
    default: 80, // Alert when 80% of budget is spent
    min: [0, "Alert threshold must be between 0 and 100."],
    max: [100, "Alert threshold must be between 0 and 100."],
  },
  
  alertEnabled: {
    type: Boolean,
    default: true,
  },
  
  // Period tracking
  month: {
    type: Number,
    required: true,
  },
  
  year: {
    type: Number,
    required: true,
  },
  
  // Status tracking
  isExceeded: {
    type: Boolean,
    default: false,
  },
  
  exceededAmount: {
    type: Number,
    default: 0,
  },
  
  // Activity tracking
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to calculate remaining amount and exceeded status
budgetSchema.pre("save", function (next) {
  this.remainingAmount = Math.max(0, this.budgetAmount - this.spentAmount);
  this.isExceeded = this.spentAmount > this.budgetAmount;
  this.exceededAmount = this.isExceeded ? this.spentAmount - this.budgetAmount : 0;
  this.lastUpdated = new Date();
  next();
});

// Index for efficient queries
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });
budgetSchema.index({ user: 1, period: 1 });

// Static method to update budget spent amount
budgetSchema.statics.updateBudgetSpending = async function(userId, category, amount, date) {
  const transactionDate = new Date(date);
  const month = transactionDate.getMonth() + 1;
  const year = transactionDate.getFullYear();
  
  const budget = await this.findOne({
    user: userId,
    category: category,
    month: month,
    year: year
  });
  
  if (budget) {
    budget.spentAmount += amount;
    await budget.save();
    return budget;
  }
  
  return null;
};

// Static method to get budget analytics
budgetSchema.statics.getBudgetAnalytics = async function(userId, month, year) {
  return await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        month: month,
        year: year
      }
    },
    {
      $group: {
        _id: null,
        totalBudget: { $sum: "$budgetAmount" },
        totalSpent: { $sum: "$spentAmount" },
        totalRemaining: { $sum: "$remainingAmount" },
        exceededBudgets: {
          $sum: { $cond: ["$isExceeded", 1, 0] }
        },
        categories: { $push: "$$ROOT" }
      }
    }
  ]);
};

const Budget = model("Budget", budgetSchema);

export default Budget;