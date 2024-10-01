import React, { useEffect, useRef } from 'react';
import { List } from 'antd';
import MessageItem from './MessageItem';

const MessageList = ({ messages }) => {
  const listRef = useRef(null);

  // Scorre automaticamente all'ultimo messaggio quando i messaggi cambiano
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={listRef}
      style={{
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '0 1rem',
        marginBottom: '1rem',
      }}
    >
      <List
        dataSource={messages}
        renderItem={(message) => <MessageItem message={message} />}
      />
    </div>
  );
};

export default MessageList;
