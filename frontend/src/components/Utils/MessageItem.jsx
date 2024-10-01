// components/MessageItem.js
import React from 'react';
import { List, Typography } from 'antd';

const { Text } = Typography;

const MessageItem = ({ message }) => (
  <List.Item>
    <List.Item.Meta
      title={<Text strong>{message.sender.name}</Text>}
      description={<Text>{message.content}</Text>}
    />
    <div>
      <Text type="secondary">
        {new Date(message.timestamp).toLocaleTimeString()}
      </Text>
    </div>
  </List.Item>
);

export default MessageItem;
