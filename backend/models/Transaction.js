import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
 
  transactionType: {
    type: String,
    enum: ["income", "expense"],
    required: [true, "Transaction type is required."],
  },
  
  amount: {
    type: Number,
    required: [true, "Amount is required."],
    min: [0, "Amount must be a positive number."],
  },
  
  date: {
    type: Date,
    required: [true, "Date is required."],
  },
  
  // Fields for Income transactions
  source: {
    type: String,
    required: function() {
      return this.transactionType === 'income';
    },
    trim: true,
  },
  
  incomeType: {
    type: String,
    enum: ["Salary", "Bonus", "Investment", "Freelance", "Gift", "Other"],
    required: function() {
      return this.transactionType === 'income';
    },
  },
  
  note: {
    type: String,
    trim: true,
  },
  
  // Fields for Expense transactions
  category: {
    type: String,
    enum: ["Food", "Transport", "Bills", "Shopping", "Health", "Others"],
    required: function() {
      return this.transactionType === 'expense';
    },
  },
  
  description: {
    type: String,
    trim: true,
  },
  
  // Computed fields for analytics
  week: Number,
  month: Number,
  year: Number,
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Pre-save middleware to compute date fields
transactionSchema.pre("save", function (next) {
  const d = new Date(this.date);
  this.week = Math.ceil(d.getDate() / 7);
  this.month = d.getMonth() + 1;
  this.year = d.getFullYear();
  next();
});

// Index for efficient queries
transactionSchema.index({ user: 1, transactionType: 1, date: -1 });
transactionSchema.index({ user: 1, month: 1, year: 1 });

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
