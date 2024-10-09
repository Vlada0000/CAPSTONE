import Itinerary from '../models/Itinerary.js';
import Trip from '../models/Trip.js';
import { emitGlobalEvent } from '../config/socket.js';
import Notification from '../models/Notification.js';

export const addItinerary = async (req, res) => {
  const { trip, location, date, activities, notes } = req.body;
  const userId = req.user._id.toString();

  try {
    const newItinerary = new Itinerary({ trip, location, date, activities, notes });
    const savedItinerary = await newItinerary.save();
    const tripDetails = await Trip.findById(trip).populate('participants.user');

    const notifications = tripDetails.participants
      .filter(({ user }) => user._id.toString() !== userId)
      .map(async ({ user }) => {
        const notification = new Notification({
          recipient: user._id,
          sender: userId,
          type: 'itinerary_added',
          message: 'Un nuovo itinerario è stato aggiunto.',
          data: { tripId: trip.toString(), itineraryId: savedItinerary._id.toString() },
        });
        await notification.save();
        emitGlobalEvent('notification', { type: 'itinerary_added', data: { tripId: trip.toString(), itinerary: savedItinerary } }, user._id.toString());
      });

    await Promise.all(notifications);
    res.status(201).json(savedItinerary);
  } catch (error) {
    console.error("Errore durante l'aggiunta dell'itinerario:", error);
    res.status(500).json({ message: 'Errore del server' });
  }
};

export const getItineraries = async (req, res) => {
  const { tripId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const tripDetails = await Trip.findById(tripId).populate('participants.user');
    if (!tripDetails) return res.status(404).json({ error: 'Viaggio non trovato' });

    const isParticipant = tripDetails.participants.some(p => p.user.equals(req.user._id));
    if (!isParticipant) return res.status(403).json({ error: 'Non sei autorizzato a visualizzare gli itinerari di questo viaggio' });

    const itineraries = await Itinerary.find({ trip: tripId }).skip(skip).limit(limit);
    const totalItineraries = await Itinerary.countDocuments({ trip: tripId });
    res.status(200).json({ itineraries, totalItineraries, totalPages: Math.ceil(totalItineraries / limit), currentPage: page });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getItineraryById = async (req, res) => {
  const { id } = req.params;

  try {
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) return res.status(404).json({ error: 'Itinerario non trovato' });

    const tripDetails = await Trip.findById(itinerary.trip).populate('participants.user');
    const isParticipant = tripDetails.participants.some(p => p.user.equals(req.user._id));
    if (!isParticipant) return res.status(403).json({ error: 'Non sei autorizzato a visualizzare questo itinerario' });

    res.status(200).json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateItinerary = async (req, res) => {
  const { id } = req.params;
  const { location, date, activities, notes } = req.body;

  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(id, { location, date, activities, notes }, { new: true });
    if (!updatedItinerary) return res.status(404).json({ error: 'Itinerario non trovato' });

    const tripDetails = await Trip.findById(updatedItinerary.trip).populate('participants.user');
    const userId = req.user._id.toString();

    const notifications = tripDetails.participants
      .filter(({ user }) => user._id.toString() !== userId)
      .map(async ({ user }) => {
        const notification = new Notification({
          recipient: user._id,
          sender: userId,
          type: 'itinerary_updated',
          message: "L'itinerario è stato aggiornato.",
          data: { tripId: updatedItinerary.trip.toString(), itineraryId: updatedItinerary._id.toString() },
        });
        await notification.save();
        emitGlobalEvent('notification', { type: 'itinerary_updated', data: { tripId: updatedItinerary.trip.toString(), itinerary: updatedItinerary } }, user._id.toString());
      });

    await Promise.all(notifications);
    res.status(200).json(updatedItinerary);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'itinerario:', error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteItinerary = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(id);
    if (!deletedItinerary) return res.status(404).json({ error: 'Itinerario non trovato' });

    const tripDetails = await Trip.findById(deletedItinerary.trip).populate('participants.user');
    const userId = req.user._id.toString();

    const notifications = tripDetails.participants
      .filter(({ user }) => user._id.toString() !== userId)
      .map(async ({ user }) => {
        const notification = new Notification({
          recipient: user._id,
          sender: userId,
          type: 'itinerary_deleted',
          message: 'Un itinerario è stato eliminato.',
          data: { tripId: deletedItinerary.trip.toString(), itineraryId: deletedItinerary._id.toString() },
        });
        await notification.save();
        emitGlobalEvent('notification', { type: 'itinerary_deleted', data: { tripId: deletedItinerary.trip.toString(), itineraryId: deletedItinerary._id.toString(), message: notification.message } }, user._id.toString());
      });

    await Promise.all(notifications);
    res.status(200).json({ message: 'Itinerario eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'itinerario:', error);
    res.status(400).json({ error: error.message });
  }
};