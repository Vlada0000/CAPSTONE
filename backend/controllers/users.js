import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import upload from '../config/cloudinary.js'
import Trip from '../models/Trip.js';
import bcrypt from 'bcrypt';
// Get logged-in user's profile
export const getLoggedInUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Non autenticato' });
  }
  res.json(req.user);
};

export const getUserProfileById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get list of users with optional search
export const getUsers = async (req, res) => {
  const { search } = req.query;

  try {
    const query = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update logged-in user's profile
export const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Upload profile image
// controllers/users.js
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      console.error('Nessun file caricato');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = req.file.path;

    // Aggiorna il profilo utente con la nuova URL dell'immagine
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imageUrl },
      { new: true }
    );

    res.json({
      message: 'Immagine del profilo aggiornata con successo',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Errore in uploadProfileImage:', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
};


// Delete logged-in user's profile
export const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.profileImage) {
      const publicId = `profile_images/${req.user._id}`;
      await cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Failed to delete image from Cloudinary:', error);
        }
      });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserTrips = async (req, res) => {
  const userId = req.user._id; // L'ID dell'utente autenticato, recuperato dal middleware di autenticazione

  try {
    // Cerca i viaggi dove l'utente è l'organizzatore o partecipa come partecipante
    const trips = await Trip.find({
      $or: [
        { organizer: userId }, // Viaggi creati dall'utente
        { 'participants.user': userId } // Viaggi a cui l'utente partecipa
      ]
    }).populate('participants.user').populate('organizer'); // Popola i dati degli utenti

    // Restituisci i viaggi
    res.status(200).json(trips);
  } catch (error) {
    console.error('Errore nel recupero dei viaggi:', error);
    res.status(500).json({ message: 'Errore del server nel recupero dei viaggi' });
  }
};
export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;

  try {
    // Trova l'utente nel database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Verifica che la password attuale sia corretta
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La password attuale non è corretta' });
    }

    // Hash della nuova password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Aggiorna la password dell'utente
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della password:', error);
    res.status(500).json({ message: 'Errore del server durante l\'aggiornamento della password' });
  }
};