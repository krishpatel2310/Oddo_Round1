const Budget = require('../models/Budget');

// Create a new budget entry
exports.createBudget = async (req, res) => {
  try {
    const { user, category, limit } = req.body;

    const newBudget = new Budget({
      user,       // we assume frontend sends a user ID for now
      category,
      limit
    });

    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all budgets
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete budget by ID
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findByIdAndDelete(id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
