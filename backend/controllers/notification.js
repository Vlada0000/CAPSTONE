import Notification from '../models/Notification.js';
import { emitGlobalEvent } from '../config/socket.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('sender', 'name profileImage');

    res.json(notifications);
  } catch (error) {
    console.error('Errore nel recupero delle notifiche:', error);
    res.status(500).json({ message: 'Errore del server nel recupero delle notifiche' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: 'Notifica non trovata o non appartenente a questo utente' });

    emitGlobalEvent(`notificationRead_${req.user._id}`, { notificationId: notification._id, recipient: req.user._id });
    res.json(notification);
  } catch (error) {
    console.error('Errore nel marcare la notifica come letta:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    emitGlobalEvent(`allNotificationsRead_${req.user._id}`, { recipient: req.user._id });
    res.json({ message: 'Tutte le notifiche sono state marcate come lette' });
  } catch (error) {
    console.error('Errore nel marcare tutte le notifiche come lette:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
};