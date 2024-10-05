// routes/messageRoutes.js
import express from 'express';
import { sendMessage, getMessages, deleteMessage, editMessage } from '../controllers/messages.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Invia un messaggio
router.post('/:tripId', authMiddleware, sendMessage);

// Recupera tutti i messaggi di un viaggio
router.get('/:tripId', authMiddleware, getMessages);

router.delete('/:tripId/messages/:messageId', authMiddleware, deleteMessage);

// Rotta per modificare un messaggio
router.put('/:tripId/messages/:messageId', authMiddleware, editMessage);

export default router;
