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

// Aggiungere un nuovo itinerario
router.post('/', authMiddleware, addItinerary);

// Ottenere tutti gli itinerari di un viaggio
router.get('/:tripId', authMiddleware, getItineraries);

// Ottenere un singolo itinerario
router.get('/details/:id', authMiddleware, getItineraryById);

// Aggiornare un itinerario
router.put('/:id', authMiddleware, updateItinerary);

// Eliminare un itinerario
router.delete('/:id', authMiddleware, deleteItinerary);

export default router;
