import express from 'express';
import {
  getLoggedInUserProfile,
  getUserProfileById,
  getUsers,
  updateUserProfile,
  uploadProfileImage,
  deleteUserProfile,
  getUserTrips,
  updatePassword
} from '../controllers/users.js';
import authMiddleware from '../middlewares/auth.js'; // Middleware for authentication
import upload from '../config/cloudinary.js'; // Importa il middleware di upload

const router = express.Router();

// Route to get the logged-in user's profile
router.get('/me', authMiddleware, getLoggedInUserProfile);

// Route to get a specific user's profile by ID
router.get('/:userId', authMiddleware, getUserProfileById);

// Route to get a list of users with optional search
router.get('/', authMiddleware, getUsers);

// Route to update the logged-in user's profile
router.put('/me', authMiddleware, updateUserProfile);

router.get('/me/trips', authMiddleware, getUserTrips);

router.put('/update-password', authMiddleware, updatePassword);
// Route to upload a profile image for the logged-in user
router.post('/me/profile-image', authMiddleware, upload.single('profileImage'), uploadProfileImage);


// Route to delete the logged-in user's profile
router.delete('/me', authMiddleware, deleteUserProfile);

export default router;