import User from "../models/User.js";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Optional: Check if email exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all users (optional use)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getDashboardSummary = async (req, res) => {
  try {
    // We get the user ID from the auth middleware
    const userId = req.user.id;
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1; // Mongoose middleware saves month as 1-12

    // Get total income for the current month
    const incomeRecords = await Income.find({ user: userId, year: currentYear, month: currentMonth });
    const totalIncome = incomeRecords.reduce((sum, item) => sum + item.amount, 0);

    // Get total expenses for the current month
    const expenseRecords = await Expense.find({ user: userId, year: currentYear, month: currentMonth });
    const totalExpenses = expenseRecords.reduce((sum, item) => sum + item.amount, 0);

    // Get total budget for the current month by summing all category limits
    const budgetRecords = await Budget.find({ user: userId, year: currentYear, month: currentMonth });
    const totalBudget = budgetRecords.reduce((sum, item) => sum + item.limit, 0);

    // Calculate derived values
    const savings = totalIncome - totalExpenses;
    const budgetUtilization = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;

    // Send the final summary object
    res.status(200).json({
      income: totalIncome,
      expenses: totalExpenses,
      budget: totalBudget,
      savings: savings,
      budgetUtilizationPercentage: budgetUtilization,
    });

  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Server error while fetching summary." });
  }
};