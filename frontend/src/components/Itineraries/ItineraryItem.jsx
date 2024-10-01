// components/ItineraryItem.js
import React from 'react';
import { List, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const ItineraryItem = ({ itinerary, onEdit, onDelete }) => (
  <List.Item
    key={itinerary._id}
    style={{
      padding: '20px',
      marginBottom: '20px',
      background: '#f9f9f9',
      borderRadius: '8px',
    }}
    actions={[
      <Button type="link" onClick={() => onEdit(itinerary)}>
        <EditOutlined />
      </Button>,
      <Popconfirm
        title="Sicuro di voler eliminare questo itinerario?"
        onConfirm={() => onDelete(itinerary._id)}
      >
        <Button type="link" danger>
          <DeleteOutlined />
        </Button>
      </Popconfirm>,
    ]}
  >
    <List.Item.Meta
      title={
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          {itinerary.location || 'N/A'}
        </div>
      }
      description={
        <div>
          <p>
            <strong>Data:</strong>{' '}
            {itinerary.date ? moment(itinerary.date).format('DD/MM/YYYY') : 'N/A'}
          </p>
          <p>
            <strong>Attività:</strong> {itinerary.activities?.join(', ') || 'N/A'}
          </p>
          <p>
            <strong>Note:</strong> {itinerary.notes || 'Nessuna nota'}
          </p>
        </div>
      }
    />
  </List.Item>
);

export default ItineraryItem;
