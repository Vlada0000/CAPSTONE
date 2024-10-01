import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv'

dotenv.config()
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error('Token mancante nelle intestazioni');
    return res.status(401).json({ error: 'Token mancante' });
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    console.error('Token malformato');
    return res.status(401).json({ error: 'Token malformato' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      console.error('Utente non trovato');
      return res.status(401).json({ error: 'Utente non trovato' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Errore durante la verifica del token:', err);
    return res.status(401).json({ error: 'Token non valido o scaduto' });
  }
};

export default authMiddleware;
