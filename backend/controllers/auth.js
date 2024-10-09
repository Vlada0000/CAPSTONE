import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import { generateToken } from '../utils/jwt.js';
import { validatePassword } from '../utils/validatePassword.js';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
  try {
    const { email, password, name, surname, birthdate, googleID } = req.body; 
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email già in uso' });
    }
    if (!name || !surname || !birthdate) {
      return res.status(400).json({ error: 'Nome, cognome e data di nascita sono obbligatori' });
    }
    if (password) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.message });
      }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const newUser = new User({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name,
      surname,
      birthdate,
      googleID,
    });

    const userCreated = await newUser.save();

    await sendWelcomeEmail(userCreated.email, userCreated.name);

    const token = generateToken(userCreated);

    res.status(201).json({
      message: 'Registrazione avvenuta con successo!',
      token,
      user: {
        id: userCreated._id,
        name: userCreated.name,
        surname: userCreated.surname,
        email: userCreated.email,
        birthdate: userCreated.birthdate,
        profileImage: userCreated.profileImage,
      },
    });
  } catch (err) {
    console.error('Errore durante la registrazione:', err);
    res.status(500).json({ error: "Errore nel salvataggio dell'utente" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || user.googleID) {
      return res.status(401).json({ error: 'Credenziali errate o account Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenziali errate' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login avvenuto con successo!',
      token,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        birthdate: user.birthdate,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error('Errore durante il login:', err);
    res.status(500).json({ error: 'Errore durante il login' });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const { user, token } = req.user;

    let existingUser = await User.findOne({ googleID: user.googleID });

    if (!existingUser) {
      existingUser = new User({
        email: user.email.toLowerCase(),
        name: user.name,
        surname: user.surname,
        googleID: user.googleID,
      });
      await existingUser.save();
    }

    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  } catch (err) {
    console.error('Errore nella callback di Google:', err);
    res.status(500).json({ error: "Errore nell'autenticazione con Google" });
  }
};