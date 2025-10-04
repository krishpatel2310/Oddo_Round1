import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import transactionRoutes from './routes/TransactionRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Middlewares
app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/budgets', budgetRoutes);


app.get('/', (req, res) => {
  res.send('API is working');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
