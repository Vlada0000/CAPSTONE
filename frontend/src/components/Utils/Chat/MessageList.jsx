import React from 'react';
import { List, Avatar, Button, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const MessageList = ({ messages, onDeleteMessage, onEditMessage, userId }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={messages}
      renderItem={(message) => {
        const senderName = message.sender?.name || 'Anonimo'; 
        const avatarLetter = senderName.charAt(0).toUpperCase(); 

        const isSender = message.sender?._id === userId; 

        return (
          <List.Item
            key={message._id} 
            actions={
              isSender
                ? [
                    <Popconfirm
                      title="Sei sicuro di voler eliminare questo messaggio?"
                      onConfirm={() => onDeleteMessage(message._id)}
                      okText="Sì"
                      cancelText="No"
                    >
                      <Button type="link" icon={<DeleteOutlined />} />
                    </Popconfirm>,
                    <Button type="link" icon={<EditOutlined />} onClick={() => onEditMessage(message._id, message.content)} />,
                  ]
                : []
            }
          >
            <List.Item.Meta
              avatar={<Avatar>{avatarLetter}</Avatar>}
              title={<strong>{senderName}</strong>}
              description={message.content}
            />
          </List.Item>
        );
      }}
      style={{ maxHeight: '500px', overflowY: 'auto', padding: '1rem' }}
    />
  );
};

export default MessageList;

