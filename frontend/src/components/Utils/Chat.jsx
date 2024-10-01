import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useSocket } from '../../context/socketContext';
import { useAuth } from '../../context/authContext';
import { getMessages, sendMessageApi } from '../../api/messagesApi';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const Chat = ({ tripId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { sendMessage, joinRoom, onMessage } = useSocket();
  const { user } = useAuth();

  const token = user?.token;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!token) {
          console.error('Token mancante per il recupero dei messaggi');
          return;
        }
        const fetchedMessages = await getMessages(tripId, token);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Errore durante il recupero dei messaggi:', error);
      }
    };

    if (tripId && token) {
      fetchMessages();
      joinRoom(tripId);

      
      onMessage((message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [tripId, token, joinRoom, onMessage]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && token) {
      const messageData = {
        content: newMessage,
        senderId: user._id,
        sender: { name: user.name }, 
        tripId,
      };

      try {
        const savedMessage = await sendMessageApi(tripId, messageData, token);

        sendMessage({
          ...messageData,
          timestamp: savedMessage.timestamp,
        });

        setNewMessage('');
      } catch (error) {
        console.error("Errore durante l'invio del messaggio:", error);
      }
    } else {
      console.error('Token mancante o messaggio vuoto');
    }
  };

  // Ascolta le notifiche
  useEffect(() => {
    if (user) {
      const { _id: userId } = user;
      joinRoom(userId);

      onMessage((notificationMessage) => {
        notification.open({
          message: 'Nuova Notifica',
          description: notificationMessage.message,
          onClick: () => {
            console.log('Notifica cliccata!');
          },
        });
      });
    }
  }, [user, joinRoom, onMessage]);

  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        position: 'relative',
      }}
    >
      {/* Lista dei Messaggi */}
      <MessageList messages={messages} />

      {/* Input per inviare nuovi messaggi */}
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Chat;
