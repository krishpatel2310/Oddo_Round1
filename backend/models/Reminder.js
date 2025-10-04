import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  // Basic info
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  
  // Type of reminder
  type: {
    type: String,
    enum: ['spending_limit', 'weekly', 'monthly', 'custom'],
    required: true
  },
  
  // For spending limit reminders
  limitAmount: {
    type: Number,
    required: function() { 
      return this.type === 'spending_limit'; 
    }
  },
  
  // For time-based reminders
  startDate: {
    type: Date,
    required: function() { 
      return this.type !== 'spending_limit'; 
    }
  },
  
  nextReminderDate: {
    type: Date,
    required: function() { 
      return this.type !== 'spending_limit'; 
    }
  },
  
  reminderTime: {
    type: String,
    required: function() { 
      return this.type !== 'spending_limit'; 
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isRead: {
    type: Boolean,
    default: false
  },
  
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;
