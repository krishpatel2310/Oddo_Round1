import Reminder from '../models/Reminder.js';
import Transaction from '../models/Transaction.js';

// Simple helper function to calculate next reminder date
function getNextReminderDate(type, startDate) {
  const nextDate = new Date(startDate);
  
  if (type === 'weekly') {
    // Add 7 days
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (type === 'monthly') {
    // Add 1 month
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  return nextDate;
}

// Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const { title, description, type, limitAmount, startDate, reminderTime } = req.body;
    const userId = req.user.id;
    
    let nextReminderDate = null;
    
    // Calculate next reminder date for recurring reminders
    if (type === 'weekly' || type === 'monthly') {
      nextReminderDate = getNextReminderDate(type, startDate);
    } else if (type === 'custom') {
      nextReminderDate = new Date(startDate);
    }
    
    const reminder = new Reminder({
      title,
      description,
      type,
      limitAmount,
      startDate,
      nextReminderDate,
      reminderTime,
      userId
    });
    
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reminders for a user
export const getReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await Reminder.find({ userId, isActive: true });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check spending limit reminders
export const checkSpendingLimits = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all spending limit reminders
    const spendingReminders = await Reminder.find({
      userId,
      type: 'spending_limit',
      isActive: true
    });
    
    const alerts = [];
    
    for (let reminder of spendingReminders) {
      // Calculate total expenses for this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const totalExpenses = await Transaction.aggregate([
        {
          $match: {
            user: userId,
            transactionType: 'expense',
            date: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);
      
      const currentSpent = totalExpenses[0]?.total || 0;
      
      // Check if limit exceeded
      if (currentSpent > reminder.limitAmount) {
        alerts.push({
          reminderId: reminder._id,
          title: reminder.title,
          limitAmount: reminder.limitAmount,
          currentSpent,
          isExceeded: true
        });
        
        // Mark as unread to show red indicator
        reminder.isRead = false;
        await reminder.save();
      }
    }
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active reminders that need to be shown today
export const getTodayReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find reminders due today
    const dueReminders = await Reminder.find({
      userId,
      isActive: true,
      type: { $in: ['weekly', 'monthly', 'custom'] },
      nextReminderDate: { $gte: today, $lt: tomorrow }
    });
    
    // Update next reminder date for recurring reminders
    for (let reminder of dueReminders) {
      if (reminder.type === 'weekly' || reminder.type === 'monthly') {
        reminder.nextReminderDate = getNextReminderDate(reminder.type, reminder.nextReminderDate);
        reminder.isRead = false; // Mark as unread
        await reminder.save();
      } else if (reminder.type === 'custom') {
        // Custom reminders are one-time, so deactivate
        reminder.isActive = false;
        reminder.isRead = false;
        await reminder.save();
      }
    }
    
    res.json(dueReminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark reminder as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const reminder = await Reminder.findOne({ _id: id, userId });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    reminder.isRead = true;
    await reminder.save();
    
    res.json({ message: 'Reminder marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete reminder
export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    await Reminder.findOneAndDelete({ _id: id, userId });
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
