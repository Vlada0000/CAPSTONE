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


router.post('/', authMiddleware, createTrip);


router.get('/', authMiddleware, getTrips);


router.get('/:tripId', authMiddleware, getTripById);


router.put('/:tripId', authMiddleware, updateTrip);


router.delete('/:tripId', authMiddleware, deleteTrip);

router.get('/:tripId/participants', authMiddleware, getParticipants);


router.post('/:tripId/photo', authMiddleware, upload.single('photo'), addPhotoToTrip);


router.post('/:tripId/invite', authMiddleware, inviteUserToTrip);

router.delete('/:tripId/participants/:participantId', authMiddleware, removeUserFromTrip);


router.patch('/:tripId/accept', authMiddleware, acceptTripInvitation);


router.patch('/:tripId/decline', authMiddleware, declineTripInvitation);

export default router;
