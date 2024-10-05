import React, { useState } from 'react';
import { List, Typography, Button, Popconfirm, Input } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { deleteMessage, editMessage } from '../../../api/messagesApi'; 
import { useAuth } from '../../../context/authContext'; 

const { Text } = Typography;

const MessageItem = ({ message, tripId, onMessageUpdated }) => {
  const { user } = useAuth();
  const isSender = user && message.sender._id === user._id; // Controllo se l'utente è il mittente del messaggio

  const [isEditing, setIsEditing] = useState(false); 
  const [editContent, setEditContent] = useState(message.content); 

  const handleDelete = async () => {
    try {
      await deleteMessage(tripId, message._id, user.token); 
      onMessageUpdated();  
    } catch (error) {
      console.error('Errore durante l\'eliminazione del messaggio:', error);
    }
  };

  const handleEdit = async () => {
    try {
      await editMessage(tripId, message._id, editContent, user.token);
      setIsEditing(false); 
      onMessageUpdated(); 
    } catch (error) {
      console.error('Errore durante la modifica del messaggio:', error);
    }
  };

  return (
    <List.Item
      actions={
        isSender
          ? isEditing
            ? [
                <Button type="link" icon={<CheckOutlined />} onClick={handleEdit}>
                  Salva
                </Button>,
                <Button type="link" icon={<CloseOutlined />} onClick={() => setIsEditing(false)}>
                  Annulla
                </Button>,
              ]
            : [
                <Button type="link" onClick={() => setIsEditing(true)}>
                  <EditOutlined /> 
                </Button>,
                <Popconfirm
                  title="Sei sicuro di voler eliminare questo messaggio?"
                  onConfirm={handleDelete}
                >
                  <Button type="link" danger>
                    <DeleteOutlined /> 
                  </Button>
                </Popconfirm>,
              ]
          : null
      }
    >
      <List.Item.Meta
        title={<Text strong>{message.sender.name}</Text>}
        description={
          isEditing ? (
            <Input.TextArea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
            />
          ) : (
            <Text>{message.content}</Text>
          )
        }
      />
      <div>
        <Text type="secondary">
          {new Date(message.timestamp).toLocaleTimeString()}
        </Text>
      </div>
    </List.Item>
  );
};

export default MessageItem;
