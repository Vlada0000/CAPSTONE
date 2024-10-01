import Trip from '../models/Trip.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { emitGlobalEvent } from '../config/socket.js';
import upload from '../config/cloudinary.js';

export const getTrips = async (req, res) => {
  const userId = req.user._id;

 
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10; 
  const skip = (page - 1) * limit; 

  try {
    
    const trips = await Trip.find({
      $or: [
        { organizer: userId },
        { 'participants.user': userId }
      ]
    })
    .populate('participants.user')
    .populate('organizer')
    .skip(skip) 
    .limit(limit);

   
    const totalTrips = await Trip.countDocuments({
      $or: [
        { organizer: userId },
        { 'participants.user': userId }
      ]
    });

    res.status(200).json({
      trips,
      totalTrips,
      totalPages: Math.ceil(totalTrips / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Errore nel recupero dei viaggi:', error);
    res.status(500).json({ message: 'Errore del server nel recupero dei viaggi' });
  }
};

// Ottenere i partecipanti di un viaggio
export const getParticipants = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId).populate('participants.user');
    if (!trip) {
      return res.status(404).json({ message: 'Viaggio non trovato' });
    }

    const participants = trip.participants.map((p) => ({
      _id: p.user._id,
      name: p.user.name,
    }));

    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ message: 'Errore del server nel recupero dei partecipanti' });
  }
};


// Creare un nuovo viaggio
export const createTrip = async (req, res) => {
  const { name, description, startDate, endDate } = req.body;
  const organizer = req.user._id;

  try {
    const newTrip = new Trip({
      name,
      description,
      startDate,
      endDate,
      organizer,
      participants: [{ user: organizer, status: 'accepted' }]
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    console.error('Errore nella creazione del viaggio:', error);
    res.status(500).json({ message: 'Errore del server nella creazione del viaggio' });
  }
};

// Eliminare un viaggio (solo organizzatore)
export const deleteTrip = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user._id;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Viaggio non trovato' });
    }

    // Verifica se l'utente è l'organizzatore
    if (trip.organizer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Solo l\'organizzatore può eliminare il viaggio' });
    }

    // Elimina il viaggio
    await Trip.findByIdAndDelete(tripId);

    // Notifica tutti i partecipanti riguardo l'eliminazione del viaggio
    const notifications = trip.participants.map(async (participant) => {
      const notification = new Notification({
        recipient: participant.user,
        sender: userId,
        type: 'trip_deleted',
        message: `Il viaggio "${trip.name}" è stato eliminato.`,
        data: { tripId: trip._id },
      });
      await notification.save();

      
      emitGlobalEvent(`notification_${participant.user.toString()}`, notification);
    });

    await Promise.all(notifications); 

    res.status(200).json({ message: 'Viaggio eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione del viaggio:', error);
    res.status(500).json({ message: 'Errore del server nell\'eliminazione del viaggio' });
  }
};
// Ottenere un viaggio per ID


export const getTripById = async (req, res) => {
  const { tripId } = req.params; 
  const userId = req.user._id;

  try {
   
    const trip = await Trip.findById(tripId).populate('participants.user').populate('organizer');

   
    if (!trip) {
      return res.status(404).json({ message: 'Viaggio non trovato' });
    }

   
    const isParticipant = trip.participants.some(p => p.user._id.toString() === userId.toString());
    const isOrganizer = trip.organizer._id.toString() === userId.toString();

    if (!isParticipant && !isOrganizer) {
      return res.status(403).json({ message: 'Non sei autorizzato a visualizzare questo viaggio' });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error('Errore nel recupero del viaggio:', error);
    res.status(500).json({ message: 'Errore del server nel recupero del viaggio' });
  }
};

export const updateTrip = async (req, res) => {
  const { tripId } = req.params;
  const updates = req.body;
  const userId = req.user._id;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Viaggio non trovato' });
    }

    
    if (trip.organizer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Solo l\'organizzatore può aggiornare il viaggio' });
    }

   
    Object.assign(trip, updates);
    const updatedTrip = await trip.save();

    
    const notifications = trip.participants
      .filter(participant => participant.user.toString() !== userId.toString()) 
      .map(async (participant) => {
        const notification = new Notification({
          recipient: participant.user,
          sender: userId,
          type: 'trip_updated',
          message: `Il viaggio "${trip.name}" è stato aggiornato.`,
          data: { tripId: trip._id },
        });
        await notification.save();

        emitGlobalEvent(`notification_${participant.user.toString()}`, notification);
      });

    await Promise.all(notifications); 

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error('Errore nell\'aggiornamento del viaggio:', error);
    res.status(500).json({ message: 'Errore del server nell\'aggiornamento del viaggio' });
  }
};


export const inviteUserToTrip = async (req, res) => {
  const { tripId } = req.params;
  const { email } = req.body;
  const userId = req.user._id;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Viaggio non trovato' });
    }

    if (trip.organizer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Solo l\'organizzatore può invitare utenti al viaggio' });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const alreadyParticipant = trip.participants.some(p => p.user.toString() === userToInvite._id.toString());
    if (alreadyParticipant) {
      return res.status(400).json({ message: 'Utente già partecipa al viaggio' });
    }

    
    trip.participants.push({ user: userToInvite._id, status: 'pending' });
    await trip.save();

   
    const notification = new Notification({
      recipient: userToInvite._id,
      sender: userId,
      type: 'trip_invite',
      message: `${req.user.name} ti ha invitato al viaggio "${trip.name}"`,
      tripId: trip._id,
      data: { tripId: trip._id },
    });
    await notification.save();

    
    emitGlobalEvent(`notification_${userToInvite._id.toString()}`, notification);

    res.status(200).json({ message: 'Utente invitato con successo' });
  } catch (error) {
    console.error('Errore nell\'invito dell\'utente:', error);
    res.status(500).json({ message: 'Errore del server nell\'invito dell\'utente' });
  }
};

export const removeUserFromTrip = async (req, res) => {
  const { tripId, participantId } = req.params;
  const userId = req.user._id;

  try {
    
    const trip = await Trip.findById(tripId).populate('participants.user');
    
    if (!trip) {
      return res.status(404).json({ message: 'Viaggio non trovato' });
    }

   
    const participantIndex = trip.participants.findIndex(
      (participant) => participant.user._id.toString() === participantId
    );

    if (participantIndex === -1) {
      return res.status(404).json({ message: 'Partecipante non trovato nel viaggio' });
    }

   
    const removedParticipant = trip.participants[participantIndex];
    trip.participants.splice(participantIndex, 1);
    await trip.save();  

    
    const removalNotification = new Notification({
      recipient: removedParticipant.user,
      sender: userId,
      type: 'removed_from_trip',
      message: `Sei stato rimosso dal viaggio "${trip.name}".`,
      tripId: trip._id,
      data: { tripId: trip._id },
    });
    await removalNotification.save();

    
    emitGlobalEvent(`notification_${removedParticipant.user._id.toString()}`, removalNotification);

    
    const otherParticipants = trip.participants.filter(p => p.user._id.toString() !== participantId);
    const notifications = otherParticipants.map(async (participant) => {
      const notification = new Notification({
        recipient: participant.user,
        sender: userId,
        type: 'participant_removed',
        message: `${removedParticipant.user.name} è stato rimosso dal viaggio "${trip.name}".`,
        data: { tripId: trip._id },
      });
      await notification.save();

      
      emitGlobalEvent(`notification_${participant.user._id.toString()}`, notification);
    });

    await Promise.all(notifications); 

    return res.status(200).json({ message: 'Partecipante rimosso con successo' });
  } catch (error) {
    console.error('Errore durante la rimozione del partecipante:', error);
    return res.status(500).json({ message: 'Errore del server' });
  }
};


export const acceptTripInvitation = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user._id;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Viaggio non trovato' });
    }

    const participant = trip.participants.find(p => p.user.toString() === userId.toString() && p.status === 'pending');
    if (!participant) {
      return res.status(400).json({ message: 'Invito non trovato o già gestito' });
    }

    participant.status = 'accepted';
    await trip.save();

    const notification = new Notification({
      recipient: trip.organizer,
      sender: userId,
      type: 'trip_accepted',
      message: `${req.user.name} ha accettato il tuo invito al viaggio "${trip.name}"`,
      data: { tripId: trip._id },
    });
    await notification.save();

   
    emitGlobalEvent(`notification_${trip.organizer.toString()}`, notification);

    res.status(200).json({ message: 'Invito accettato con successo', trip });
  } catch (error) {
    console.error('Errore nell\'accettazione dell\'invito:', error);
    res.status(500).json({ message: 'Errore del server nell\'accettazione dell\'invito' });
  }
};


// Rifiutare un invito al viaggio
export const declineTripInvitation = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user._id;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Viaggio non trovato' });
    }

    const participantIndex = trip.participants.findIndex(p => p.user.toString() === userId.toString() && p.status === 'pending');
    if (participantIndex === -1) {
      return res.status(400).json({ message: 'Invito non trovato o già gestito' });
    }

    trip.participants.splice(participantIndex, 1); 
    await trip.save();

    const notification = new Notification({
      recipient: trip.organizer,
      sender: userId,
      type: 'trip_declined',
      message: `${req.user.name} ha rifiutato il tuo invito al viaggio "${trip.name}"`,
      data: { tripId: trip._id },
    });
    await notification.save();

    
    emitGlobalEvent(`notification_${trip.organizer.toString()}`, notification);

    res.status(200).json({ message: 'Invito rifiutato con successo' });
  } catch (error) {
    console.error('Errore nel rifiuto dell\'invito:', error);
    res.status(500).json({ message: 'Errore del server nel rifiuto dell\'invito' });
  }
};

// Aggiungere una foto a un viaggio
export const addPhotoToTrip = async (req, res) => {
  const { tripId } = req.params;  
  const photo = req.file;  

  if (!photo) {
    return res.status(400).json({ message: 'Nessuna foto fornita' });
  }

  try {
   
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Viaggio non trovato' });
    }

    
    trip.photoUrl = photo.path;  

    await trip.save();

    res.status(200).json({ message: 'Foto caricata con successo', trip });
  } catch (error) {
    console.error('Errore nel caricamento della foto:', error);
    res.status(500).json({ message: 'Errore del server nel caricamento della foto' });
  }
};