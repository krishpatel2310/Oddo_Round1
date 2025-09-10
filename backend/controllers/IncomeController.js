// In backend/controllers/IncomeController.js

import Income from "../models/Income.js";

// Create new income for the logged-in user
export const createIncome = async (req, res) => {
  try {
    // Combine the form data (req.body) with the user's ID from the middleware
    const newIncome = new Income({
      ...req.body,
      user: req.user.id,
    });

    // Basic input validation
    if (!newIncome.type || !newIncome.source || !newIncome.amount || !newIncome.date) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all incomes for the logged-in user
export const getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete income by ID for the logged-in user
export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findOne({ _id: id, user: req.user.id });

    if (!income) {
      return res.status(404).json({ message: "Income not found or you are not authorized." });
    }

    await income.deleteOne();
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};