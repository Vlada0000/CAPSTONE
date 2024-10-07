import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/authContext';
import { getMessages, sendMessage as sendMessageApi, deleteMessage, editMessage } from '../../../api/messagesApi';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Card, Modal, message } from 'antd';

const Chat = ({ tripId }) => {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [editMode, setEditMode] = useState({ isEditing: false, messageId: null, newContent: '' });
  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!tripId || !token) return;
      try {
        const fetchedMessages = await getMessages(tripId, token);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Errore durante il recupero dei messaggi:', error);
      }
    };
    fetchMessages();
  }, [tripId, token]);

  const handleSendMessage = useCallback(async (content) => {
    if (!content.trim() || !token || isSending) return;

    setIsSending(true);

    try {
      const messageData = {
        content,
        senderId: user._id,
        sender: { name: user.name },
        tripId,
      };

      const savedMessage = await sendMessageApi(tripId, messageData, token);
      const updatedMessage = { ...messageData, ...savedMessage };

      setMessages((prevMessages) => [...prevMessages, updatedMessage]);
    } catch (error) {
      console.error("Errore durante l'invio del messaggio:", error);
      message.error("Errore durante l'invio del messaggio");
    } finally {
      setIsSending(false);
    }
  }, [tripId, token, user, isSending]);

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(tripId, messageId, token);
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
      message.success('Messaggio eliminato con successo');
    } catch (error) {
      console.error("Errore durante l'eliminazione del messaggio:", error);
      message.error("Errore durante l'eliminazione del messaggio");
    }
  };

  const handleEditMessage = (messageId, currentContent) => {
    setEditMode({ isEditing: true, messageId, newContent: currentContent });
  };

  const handleSaveEdit = async () => {
    try {
      await editMessage(tripId, editMode.messageId, editMode.newContent, token);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === editMode.messageId ? { ...msg, content: editMode.newContent } : msg
        )
      );
      setEditMode({ isEditing: false, messageId: null, newContent: '' });
      message.success('Messaggio modificato con successo');
    } catch (error) {
      console.error("Errore durante la modifica del messaggio:", error);
      message.error("Errore durante la modifica del messaggio");
    }
  };

  return (
    <Card
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      }}
    >
      <MessageList
        messages={messages}
        onDeleteMessage={handleDeleteMessage}
        onEditMessage={handleEditMessage}
        userId={user._id}
      />
      <ChatInput onSendMessage={handleSendMessage} />

      <Modal
        title="Modifica Messaggio"
        open={editMode.isEditing}
        onOk={handleSaveEdit}
        onCancel={() => setEditMode({ isEditing: false, messageId: null, newContent: '' })}
      >
        <input
          value={editMode.newContent}
          onChange={(e) => setEditMode({ ...editMode, newContent: e.target.value })}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />
      </Modal>
    </Card>
  );
};

export default Chat;
