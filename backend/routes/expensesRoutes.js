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


router.post('/', authMiddleware, addExpense);


router.get('/', authMiddleware, getExpenses);


router.get('/:id', authMiddleware, getExpenseById);


router.put('/:id', authMiddleware, updateExpense);


router.delete('/:id', authMiddleware, deleteExpense);


router.get('/:tripId/split', authMiddleware, calculateSplit);
export default router;