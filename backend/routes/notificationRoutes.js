import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notification.js';

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.patch('/:id/read', authMiddleware, markAsRead);
router.patch('/read/all', authMiddleware, markAllAsRead);

export default router;
