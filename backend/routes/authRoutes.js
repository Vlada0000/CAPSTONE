import express from 'express';
import passport from '../config/passport.js';
import { register, login, googleCallback } from '../controllers/auth.js';

const router = express.Router();

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

// Google login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

export default router;