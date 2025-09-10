import Transaction from "../models/Transaction.js";

// @desc    Add new transaction
// @route   POST /api/transactions
export const addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json({ message: "Transaction added", transaction });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get all transactions
// @route   GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
