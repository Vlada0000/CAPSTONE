import React from 'react';
import { List, Badge } from 'antd';


const ParticipantsList = ({ participants }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={participants}
      renderItem={participant => (
        <List.Item>
          <div className="container">
            <div className="row align-items-center">
              {/* Nome e Cognome del Partecipante */}
              <div className="col-12 col-md-6">
                <List.Item.Meta
                  title={`${participant.user.name} ${participant.user.surname}`}
                />
              </div>
              {/* Stato del Partecipante con Badge */}
              <div className="col-12 col-md-6 text-md-right">
                <Badge
                  status={participant.status === 'accepted' ? 'success' : 'warning'}
                  text={
                    participant.status === 'accepted' 
                      ? 'Accettato' 
                      : participant.status === 'pending' 
                      ? 'In attesa' 
                      : 'Rifiutato'
                  }
                />
              </div>
            </div>
          </div>
        </List.Item>
      )}
    />
  );
};


export default ParticipantsList;
