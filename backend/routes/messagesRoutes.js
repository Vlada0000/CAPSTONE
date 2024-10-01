// routes/messageRoutes.js
import express from 'express';
import { sendMessage, getMessages } from '../controllers/messages.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Invia un messaggio
router.post('/:tripId', authMiddleware, sendMessage);

// Recupera tutti i messaggi di un viaggio
router.get('/:tripId', authMiddleware, getMessages);

export default router;
