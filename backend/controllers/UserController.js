import User from "../models/User.js";
import Transaction from "../models/Transaction.js";


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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
   
    const userId = req.user.id;
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;

   
    // Get monthly income using Transaction model
    const incomeResult = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          transactionType: 'income',
          month: currentMonth,
          year: currentYear
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get monthly expenses using Transaction model
    const expenseResult = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          transactionType: 'expense',
          month: currentMonth,
          year: currentYear
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpenses = expenseResult[0]?.total || 0;
    const savings = totalIncome - totalExpenses;

  
    res.status(200).json({
      income: totalIncome,
      expenses: totalExpenses,
      savings: savings,
    });

  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Server error while fetching summary." });
  }
};