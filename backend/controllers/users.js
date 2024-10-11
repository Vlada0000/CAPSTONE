import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import { validatePassword } from '../utils/validatePassword.js';
import { sendProfileDeletionEmail } from '../services/emailService.js';
import Notification from '../models/Notification.js';
import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';
import bcrypt from 'bcrypt';

export const getLoggedInUserProfile = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Non autenticato' });
  res.json(req.user);
};

export const getUserProfileById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  const { search } = req.query;

  try {
    const query = search
      ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
      : {};
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { name, email, birthdate, surname } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, birthdate, surname },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Nessun file caricato' });
    }

    const { path, filename } = req.file;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: path, profileImagePublicId: filename }, 
      { new: true }
    );

    res.json({ message: 'Immagine del profilo aggiornata con successo', user: updatedUser });
  } catch (error) {
    console.error('Errore durante il caricamento dell\'immagine:', error);
    res.status(500).json({ error: 'Errore nel caricamento dell\'immagine' });
  }
};
export const deleteUserProfile = async (req, res) => {
  try {
   
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    const trips = await Trip.find({
      $or: [
        { organizer: userId },
        { 'participants.user': userId },
      ],
    });

    for (const trip of trips) {
      await Expense.deleteMany({ trip: trip._id });
      await Trip.findByIdAndDelete(trip._id);
    }

    await Expense.deleteMany({
      $or: [
        { paidBy: userId },
        { participants: userId },
      ],
    });

    await Notification.deleteMany({
      $or: [
        { sender: userId },
        { recipient: userId },
      ],
    });

    if (user.profileImagePublicId) {
      const publicId = user.profileImagePublicId;

      try {
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'not found') {
          console.log('Immagine non trovata su Cloudinary, può essere già stata eliminata.');
        } else {
          console.log('Immagine del profilo eliminata da Cloudinary.');
        }
      } catch (error) {
        console.error("Errore durante l'eliminazione dell'immagine su Cloudinary:", error);
      }
    }

    await User.findByIdAndDelete(userId);
    await sendProfileDeletionEmail(user.email, user.name);

    res.status(204).end();
  } catch (error) {
    console.error('Errore durante la cancellazione del profilo:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const getUserTrips = async (req, res) => {
  const userId = req.user._id;

  try {
    const trips = await Trip.find({
      $or: [{ organizer: userId }, { 'participants.user': userId }]
    }).populate('participants.user').populate('organizer');

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Errore del server nel recupero dei viaggi' });
  }
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'La password attuale non è corretta' });

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) return res.status(400).json({ message: passwordValidation.message });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore del server durante l\'aggiornamento della password' });
  }
};
