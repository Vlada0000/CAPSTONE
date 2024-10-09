import express from 'express';
import { sendMessage, getMessages, deleteMessage, editMessage } from '../controllers/messages.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/:tripId', authMiddleware, sendMessage);
router.get('/:tripId', authMiddleware, getMessages);
router.delete('/:tripId/messages/:messageId', authMiddleware, deleteMessage);
router.put('/:tripId/messages/:messageId', authMiddleware, editMessage);

export default router;
