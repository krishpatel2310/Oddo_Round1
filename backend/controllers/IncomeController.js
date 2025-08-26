const Income = require('../models/Income');

// Create new income
exports.createIncome = async (req, res) => {
  try {
    const { user, type, source, amount, date, note } = req.body;

    // Basic input validation
    if (!user || !type || !source || !amount || !date) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const newIncome = new Income({
      user,
      type,
      source,
      amount,
      date,
      note
    });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all incomes
exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find()
      .populate('user', 'name email') // Optional: show user info
      .sort({ createdAt: -1 });

    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete income by ID
exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const income = await Income.findByIdAndDelete(id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
