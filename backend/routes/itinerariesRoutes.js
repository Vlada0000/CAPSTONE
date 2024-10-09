import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  addItinerary,
  getItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
} from '../controllers/itineraries.js';

const router = express.Router();

router.post('/', authMiddleware, addItinerary);
router.get('/:tripId', authMiddleware, getItineraries);
router.get('/details/:id', authMiddleware, getItineraryById);
router.put('/:id', authMiddleware, updateItinerary);
router.delete('/:id', authMiddleware, deleteItinerary);

export default router;
