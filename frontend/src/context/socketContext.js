import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './authContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);

  useEffect(() => {
    if (user && user.token) {
     

      const socketIo = io(process.env.REACT_APP_BACKEND_URL, {
        query: { token: user.token },
        transports: ['websocket'],
        autoConnect: true,
      });

      socketIo.on('connect', () => {
        
        setIsSocketInitialized(true);
      });

      socketIo.on('disconnect', () => {
        
        setIsSocketInitialized(false);
      });

      socketIo.on('connect_error', (err) => {
        console.error('Connection error:', err);
      });

      setSocket(socketIo);

      return () => {
        
        socketIo.disconnect();
        setIsSocketInitialized(false);
      };
    } else {
      console.log("User not found or token not available, socket not initialized.");
    }
  }, [user]);

  const sendMessage = (messageData) => {
    if (socket && isSocketInitialized) {
      socket.emit('sendMessage', messageData);
    } else {
      console.warn('Socket not initialized or connected');
    }
  };

  const sendNotification = (notificationData) => {
    if (socket && isSocketInitialized) {
      socket.emit('sendNotification', notificationData);
    } else {
      console.warn('Socket not initialized or connected');
    }
  };

  const joinRoom = (tripId) => {
    if (socket && isSocketInitialized) {
      socket.emit('joinRoom', tripId);
    } else {
      console.warn('Socket not initialized or connected');
    }
  };

  const onMessage = (callback) => {
    if (socket && isSocketInitialized) {
      socket.on('message', callback);
    } else {
      console.warn('Socket not initialized or connected');
    }
  };

  const offMessage = (callback) => {
    if (socket && isSocketInitialized) {
      socket.off('message', callback);
    }
  };

  const onNotification = (callback) => {
    if (socket && isSocketInitialized) {
      socket.on('notification', callback);
    } else {
      console.warn('Socket not initialized or connected');
    }
  };

  const offNotification = (callback) => {
    if (socket && isSocketInitialized) {
      socket.off('notification', callback);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        sendNotification,
        joinRoom,
        onMessage,
        offMessage,
        onNotification,
        offNotification,
        socket,
        isSocketInitialized,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
