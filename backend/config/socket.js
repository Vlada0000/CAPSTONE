import { Server as SocketIOServer } from 'socket.io';
import Trip from '../models/Trip.js';
import Message from '../models/Message.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv'

dotenv.config()

let io;

export const initSocket = (server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
      credentials: true,
    },
  });

  io.setMaxListeners(20);
  io.on('connection', handleConnection);

  console.log('Socket.IO server initialized');
};

const handleConnection = async (socket) => {
  console.log(`User connected: ${socket.id}`);
  const { token } = socket.handshake.query;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        console.error('Utente non trovato per il token fornito');
        socket.disconnect();
        return;
      }

      socket.user = user;
      socket.join(user._id.toString());
      console.log(`User ${user._id} joined personal room`);

      socket.on('joinRoom', (tripId) => handleJoinRoom(socket, tripId));
      socket.on('sendMessage', (messageData) => handleSendMessage(socket, messageData));
      socket.on('disconnect', () => handleDisconnect(socket));
    } catch (err) {
      console.error('Token non valido:', err);
      socket.disconnect();
    }
  } else {
    console.error('Token mancante nella query di handshake');
    socket.disconnect();
  }
};

const handleJoinRoom = (socket, tripId) => {
  socket.join(tripId);
  console.log(`User ${socket.id} joined trip room: ${tripId}`);
};

const handleSendMessage = async (socket, messageData) => {
  const { tripId, content } = messageData;

  if (!content || !tripId) {
    console.error('Dati del messaggio non validi:', messageData);
    return;
  }

  try {
    const trip = await Trip.findById(tripId).populate('participants.user');
    if (!trip) {
      console.error('Viaggio non trovato');
      return;
    }

    const senderId = socket.user._id;

    const isParticipant = trip.participants.some((p) => p.user.equals(senderId));
    if (!isParticipant) {
      console.error('L\'utente non è un partecipante del viaggio');
      return;
    }

    const newMessage = new Message({
      content,
      sender: senderId,
      trip: tripId,
    });
    await newMessage.save();

    io.to(tripId).emit('message', {
      content: newMessage.content,
      sender: senderId,
      tripId,
      timestamp: newMessage.timestamp,
    });

    console.log(`Messaggio inviato nella stanza del viaggio ${tripId}`);
  } catch (error) {
    console.error('Errore nell\'invio del messaggio:', error);
  }
};

const handleDisconnect = (socket) => {
  console.log(`User disconnected: ${socket.id}`);
};

export const emitGlobalEvent = (event, data, userId = null) => {
  if (io) {
    if (userId) {
      io.to(userId).emit(event, data);
      console.log(`Evento emesso all'utente ${userId}: ${event}`);
    } else {
      io.emit(event, data);
      console.log(`Evento globale emesso: ${event}`);
    }
  } else {
    console.error('Socket.IO non è stato inizializzato');
  }
};

export { io };
