import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notification.js';

const router = express.Router();

// Recupera tutte le notifiche per l'utente autenticato
router.get('/', authMiddleware, getNotifications);

// Marca una singola notifica come letta (usa PATCH per aggiornamento parziale)
router.patch('/:id/read', authMiddleware, markAsRead);

// Marca tutte le notifiche come lette
router.patch('/read/all', authMiddleware, markAllAsRead);

export default router;
