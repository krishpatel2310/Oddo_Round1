import express from 'express';
import {
  createReminder,
  getReminders,
  checkSpendingLimits,
  getTodayReminders,
  markAsRead,
  deleteReminder
} from '../controllers/ReminderController.js';
import auth from '../Middleware/auth.js';

const router = express.Router();

// All routes need authentication
router.use(auth);

// Create new reminder
router.post('/', createReminder);

// Get all user reminders
router.get('/', getReminders);

// Check spending limits
router.get('/spending-alerts', checkSpendingLimits);

// Get today's reminders
router.get('/today', getTodayReminders);

// Mark reminder as read
router.patch('/:id/read', markAsRead);

// Delete reminder
router.delete('/:id', deleteReminder);

export default router;
