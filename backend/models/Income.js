const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['fixed', 'variable'],
    default: 'variable',
    required: true
  },
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  note: String,
  month: Number,
  year: Number
});

incomeSchema.pre('save', function (next) {
  const d = new Date(this.date);
  this.month = d.getMonth() + 1;
  this.year = d.getFullYear();
  next();
});

module.exports = mongoose.model('Income', incomeSchema);
