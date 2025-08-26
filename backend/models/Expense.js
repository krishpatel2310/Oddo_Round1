const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Others'],
    required: true
  },
  description: String,
  date: {
    type: Date,
    required: true
  },
  week: Number,
  month: Number,
  year: Number
});

// Auto-calculate week, month, year
expenseSchema.pre('save', function (next) {
  const d = new Date(this.date);
  this.week = Math.ceil(d.getDate() / 7);
  this.month = d.getMonth() + 1;
  this.year = d.getFullYear();
  next();
});

module.exports = mongoose.model('Expense', expenseSchema);
