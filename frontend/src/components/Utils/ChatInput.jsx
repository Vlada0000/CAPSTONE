// components/ChatInput.js
import React from 'react';
import { Input, Button } from 'antd';

const ChatInput = ({ newMessage, setNewMessage, handleSendMessage }) => (
  <Input
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    onPressEnter={handleSendMessage}
    placeholder="Scrivi un messaggio"
    addonAfter={
      <Button type="primary" onClick={handleSendMessage}>
        Invia
      </Button>
    }
  />
);

export default ChatInput;
