import Message from '../models/Message.js';
import Trip from '../models/Trip.js';
import { emitGlobalEvent } from '../config/socket.js';
import Notification from '../models/Notification.js';

export const sendMessage = async (req, res) => {
  const { tripId } = req.params;
  const { content } = req.body;
  const senderId = req.user._id;

  try {
    const trip = await Trip.findById(tripId).populate('participants.user');
    if (!trip) return res.status(404).json({ error: 'Viaggio non trovato' });

    const isParticipant = trip.participants.some(p => p.user._id.equals(senderId));
    if (!isParticipant) return res.status(403).json({ error: 'Non sei autorizzato a inviare messaggi per questo viaggio' });

    const newMessage = new Message({ content, sender: senderId, trip: tripId });
    await newMessage.save();
    await newMessage.populate('sender', 'name');

    emitGlobalEvent('message', { content: newMessage.content, sender: newMessage.sender.name, tripId, timestamp: newMessage.timestamp }, tripId);

    const notifications = trip.participants
      .filter(({ user }) => !user._id.equals(senderId))
      .map(async ({ user }) => {
        const notification = new Notification({
          recipient: user._id,
          sender: senderId,
          type: 'new_message',
          message: `Nuovo messaggio da ${req.user.name} nel viaggio "${trip.name}"`,
          data: { tripId, messageId: newMessage._id.toString() },
        });
        await notification.save();
        emitGlobalEvent('notification', { type: 'new_message', data: { tripId, messageId: newMessage._id.toString(), message: notification.message } }, user._id.toString());
      });

    await Promise.all(notifications);
    res.status(201).json({ _id: newMessage._id, content: newMessage.content, sender: newMessage.sender.name, tripId: newMessage.trip, timestamp: newMessage.timestamp });
  } catch (error) {
    console.error("Errore nell'invio del messaggio:", error);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const getMessages = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId).populate('participants.user');
    if (!trip) return res.status(404).json({ error: 'Viaggio non trovato' });

    const isParticipant = trip.participants.some(p => p.user.equals(req.user._id));
    if (!isParticipant) return res.status(403).json({ error: 'Non sei autorizzato a vedere i messaggi di questo viaggio' });

    const messages = await Message.find({ trip: tripId }).populate('sender', 'name');
    res.status(200).json(messages);
  } catch (error) {
    console.error('Errore durante il recupero dei messaggi:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const deleteMessage = async (req, res) => {
  const { tripId, messageId } = req.params;
  const userId = req.user._id;

  try {
    const trip = await Trip.findById(tripId).populate('participants.user');
    if (!trip) return res.status(404).json({ error: 'Viaggio non trovato' });

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: 'Messaggio non trovato' });

    const isSender = message.sender.equals(userId);
    const isAdmin = trip.participants.some(p => p.user.equals(userId) && p.role === 'admin');
    if (!isSender && !isAdmin) return res.status(403).json({ error: 'Non sei autorizzato a eliminare questo messaggio' });

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: 'Messaggio eliminato con successo' });
  } catch (error) {
    console.error("Errore durante l'eliminazione del messaggio:", error);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const editMessage = async (req, res) => {
  const { tripId, messageId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  try {
    const trip = await Trip.findById(tripId).populate('participants.user');
    if (!trip) return res.status(404).json({ error: 'Viaggio non trovato' });

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: 'Messaggio non trovato' });

    if (!message.sender.equals(userId)) return res.status(403).json({ error: 'Non sei autorizzato a modificare questo messaggio' });

    message.content = content;
    await message.save();
    res.status(200).json({ message: 'Messaggio modificato con successo', data: message });
  } catch (error) {
    console.error('Errore durante la modifica del messaggio:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
};