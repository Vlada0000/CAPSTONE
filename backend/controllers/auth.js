import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import { generateToken } from '../utils/jwt.js';
import {validatePassword} from '../utils/validatePassword.js'
import dotenv from 'dotenv'

dotenv.config()

export const register = async (req, res) => {
  try {
    const { email, password, name, surname, birthdate, googleID } = req.body;

    // Controlla se l'email è già in uso
    if (await User.findOne({ email: email.toLowerCase().trim() })) {
      return res.status(409).json({ error: 'Email già in uso' });
    }

    // Controlla che nome, cognome e data di nascita siano presenti
    if (!name || !surname || !birthdate) {
      return res.status(400).json({ error: 'Nome, cognome e data di nascita sono obbligatori' });
    }

    // Se è presente una password, validala
    if (password) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.message });
      }
    }

    // Crea l'hash della password solo se è fornita
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Crea un nuovo utente
    const newUser = new User({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name,
      surname,
      birthdate,
      googleID,
    });

    // Salva l'utente nel database
    const userCreated = await newUser.save();

    // Invia un'email di benvenuto
    await sendWelcomeEmail(userCreated.email, userCreated.name);

    // Genera un token per l'utente
    const token = generateToken(userCreated);

    // Risposta al client
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
    res.status(500).json({ error: 'Errore nel salvataggio dell\'utente' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trova l'utente tramite email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Controlla se l'utente esiste e se non è un account Google
    if (!user || user.googleID) {
      return res.status(401).json({ error: 'Credenziali errate o account Google' });
    }

    // Confronta la password inserita con quella salvata nel database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenziali errate' });
    }

    // Genera un token per l'utente
    const token = generateToken(user);

    // Risposta al client
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
    res.status(500).json({ error: 'Errore nell\'autenticazione con Google' });
  }
};
