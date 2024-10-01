// controllers/messages.js
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
    if (!trip) {
      return res.status(404).json({ error: 'Viaggio non trovato' });
    }

    const isParticipant = trip.participants.some((p) => p.user._id.equals(senderId));
    if (!isParticipant) {
      return res.status(403).json({ error: 'Non sei autorizzato a inviare messaggi per questo viaggio' });
    }

    const newMessage = new Message({
      content,
      sender: senderId,
      trip: tripId,
    });

    await newMessage.save();

    emitGlobalEvent(
      'message',
      {
        content: newMessage.content,
        sender: req.user.name,
        tripId,
        timestamp: newMessage.timestamp,
      },
      tripId
    );

    const notifications = trip.participants
      .filter(({ user }) => !user._id.equals(senderId))
      .map(async ({ user }) => {
        const notification = new Notification({
          recipient: user._id,
          sender: senderId,
          type: 'new_message',
          message: `Nuovo messaggio da ${req.user.name} nel viaggio "${trip.name}"`,
          data: {
            tripId,
            messageId: newMessage._id.toString(),
          },
        });
        await notification.save();

        emitGlobalEvent(
          'notification',
          {
            type: 'new_message',
            data: {
              tripId,
              messageId: newMessage._id.toString(),
              message: notification.message,
            },
          },
          user._id.toString()
        );
      });

    await Promise.all(notifications);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Errore nell\'invio del messaggio:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const getMessages = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId).populate('participants.user');
    if (!trip) {
      return res.status(404).json({ error: 'Viaggio non trovato' });
    }

    const isParticipant = trip.participants.some((p) => p.user.equals(req.user._id));
    if (!isParticipant) {
      return res.status(403).json({ error: 'Non sei autorizzato a vedere i messaggi di questo viaggio' });
    }

    const messages = await Message.find({ trip: tripId }).populate('sender', 'name');
    res.status(200).json(messages);
  } catch (error) {
    console.error('Errore durante il recupero dei messaggi:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
};
