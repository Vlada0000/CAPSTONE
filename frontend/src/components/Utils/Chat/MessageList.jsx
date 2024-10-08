import { useState } from 'react';
import { List, Avatar, Button, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';

const MessageList = ({ messages, onDeleteMessage, onEditMessage, userId }) => {
  const [selectedMessageId, setSelectedMessageId] = useState(null); 

  const handleSelectMessage = (messageId) => {
    if (selectedMessageId === messageId) {
      setSelectedMessageId(null); 
    } else {
      setSelectedMessageId(messageId);
    }
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={messages}
      renderItem={(message) => {
        const senderName = message.sender?.name || 'Anonimo';
        const avatarLetter = senderName.charAt(0).toUpperCase();
        const isSender = message.sender?._id === userId;
        const isSelected = selectedMessageId === message._id;

        return (
          <List.Item
            key={message._id}
            onClick={() => handleSelectMessage(message._id)} 
            style={{
              cursor: 'pointer',
              backgroundColor: isSelected ? '#f0f0f0' : 'transparent', 
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <List.Item.Meta
              avatar={<Avatar>{avatarLetter}</Avatar>}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{senderName}</span>
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    {moment(message.createdAt).format('HH:mm')} 
                  </span>
                </div>
              }
              description={message.content}
            />
            
            {/* Mostra i bottoni di modifica ed eliminazione solo se il messaggio è selezionato */}
            {isSelected && isSender && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Popconfirm
                  title="Sei sicuro di voler eliminare questo messaggio?"
                  onConfirm={(e) => {
                    e.stopPropagation(); // Ferma la propagazione del click per evitare di deselezionare
                    onDeleteMessage(message._id);
                  }}
                  okText="Sì"
                  cancelText="No"
                >
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={(e) => e.stopPropagation()} 
                  />
                </Popconfirm>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onEditMessage(message._id, message.content);
                  }}
                />
              </div>
            )}
          </List.Item>
        );
      }}
      style={{ maxHeight: '500px', overflowY: 'auto', padding: '1rem' }}
    />
  );
};

export default MessageList;
