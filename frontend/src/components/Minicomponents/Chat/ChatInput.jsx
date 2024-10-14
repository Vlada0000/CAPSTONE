import { useState } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handlePressEnter = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div style={{ borderTop: '1px solid #f0f0f0', padding: '1rem' }}>
      <TextArea
        rows={2}
        placeholder="Scrivi un messaggio..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onPressEnter={(e) => {
          e.preventDefault();
          handlePressEnter();
        }}
        style={{ resize: 'none' }}
      />
    </div>
  );
};

export default ChatInput;
