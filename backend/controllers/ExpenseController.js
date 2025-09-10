// In backend/controllers/ExpenseController.js

import Expense from "../models/Expense.js";

// Add new expense
export const addExpense = async (req, res) => {
  try {
    // Create a new expense by combining the form data (req.body)
    // with the logged-in user's ID (req.user.id) from the middleware
    const expense = new Expense({
      ...req.body,
      user: req.user.id 
    });
    
    await expense.save();
    res.status(201).json({ message: "Expense added", expense });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all expenses for the logged-in user
export const getExpenses = async (req, res) => {
  try {
    // Only find expenses that belong to the currently logged-in user
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    // We should also ensure a user can only delete their own expense
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found or you're not authorized to delete it." });
    }
    
    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};