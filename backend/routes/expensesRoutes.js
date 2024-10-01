import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from '../controllers/expenses.js';
import { calculateSplit } from '../controllers/expenses.js';

const router = express.Router();

// Add a new expense
router.post('/', authMiddleware, addExpense);

// Get all expenses
router.get('/', authMiddleware, getExpenses);

// Get an expense by ID
router.get('/:id', authMiddleware, getExpenseById);

// Update an expense by ID
router.put('/:id', authMiddleware, updateExpense);

// Delete an expense by ID
router.delete('/:id', authMiddleware, deleteExpense);

// Suddivisione delle spese per un viaggio specifico
router.get('/:tripId/split', authMiddleware, calculateSplit);
export default router;