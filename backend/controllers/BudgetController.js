import Budget from "../models/Budget.js";

// Create a new budget entry
export const createBudget = async (req, res) => {
  try {
    const { user, category, limit } = req.body;

    const newBudget = new Budget({
      user,       // we assume frontend sends a user ID for now
      category,
      limit,
    });

    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all budgets
export const getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete budget by ID
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findByIdAndDelete(id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
