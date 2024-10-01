import express from 'express';
import { 
  acceptTripInvitation, 
  declineTripInvitation, 
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  addPhotoToTrip,
  inviteUserToTrip,
  removeUserFromTrip,
  getTrips,
  getParticipants
} from '../controllers/trips.js';
import authMiddleware from '../middlewares/auth.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

// Crea un nuovo viaggio
router.post('/', authMiddleware, createTrip);

// Ottieni tutti i viaggi dell'utente
router.get('/', authMiddleware, getTrips);

// Ottieni i dettagli di un singolo viaggio
router.get('/:tripId', authMiddleware, getTripById);

// Aggiorna un viaggio (solo organizzatore)
router.put('/:tripId', authMiddleware, updateTrip);

// Elimina un viaggio (solo organizzatore)
router.delete('/:tripId', authMiddleware, deleteTrip);

router.get('/:tripId/participants', authMiddleware, getParticipants);

// Aggiungi una foto a un viaggio
router.post('/:tripId/photo', authMiddleware, upload.single('photo'), addPhotoToTrip);

// Invita un utente a un viaggio (solo organizzatore)
router.post('/:tripId/invite', authMiddleware, inviteUserToTrip);

router.delete('/:tripId/participants/:participantId', authMiddleware, removeUserFromTrip);


// Accetta un invito al viaggio
router.patch('/:tripId/accept', authMiddleware, acceptTripInvitation);

// Rifiuta un invito al viaggio
router.patch('/:tripId/decline', authMiddleware, declineTripInvitation);

export default router;
