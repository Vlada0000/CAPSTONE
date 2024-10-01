import React from 'react';
import { List, Badge } from 'antd';

const ParticipantsList = ({ participants }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={participants}
      renderItem={participant => (
        <List.Item>
          <List.Item.Meta
            title={`${participant.user.name} ${participant.user.surname}`}
            description={
              <Badge
                status={participant.status === 'accepted' ? 'success' : 'warning'}
                text={participant.status === 'accepted' ? 'Accettato' : participant.status === 'pending' ? 'In attesa' : 'Rifiutato'}
              />
            }
          />
        </List.Item>
      )}
    />
  );
};

export default ParticipantsList;
