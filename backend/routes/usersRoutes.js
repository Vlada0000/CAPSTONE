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
import authMiddleware from '../middlewares/auth.js'; 
import upload from '../config/cloudinary.js'; 

const router = express.Router();


router.get('/me', authMiddleware, getLoggedInUserProfile);

router.get('/:userId', authMiddleware, getUserProfileById);

router.get('/', authMiddleware, getUsers);

router.put('/me', authMiddleware, updateUserProfile);

router.get('/me/trips', authMiddleware, getUserTrips);

router.put('/update-password', authMiddleware, updatePassword);

router.post('/me/profile-image', authMiddleware, upload.single('profileImage'), uploadProfileImage);

router.delete('/me', authMiddleware, deleteUserProfile);

export default router;