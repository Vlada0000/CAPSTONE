import React from 'react';
import { List, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const ItineraryItem = ({ itinerary, onEdit, onDelete }) => (
  <List.Item
    key={itinerary._id}
    style={{
      padding: '25px',
      
      background: '#fff',
      borderRadius: '10px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      fontFamily: "'Exo', serif", 
    }}
    actions={[
      <Button type="link" onClick={() => onEdit(itinerary)} style={{ color: '#4A4A4A', fontSize: '16px' }}>
        <EditOutlined />
      </Button>,
      <Popconfirm
        title="Sicuro di voler eliminare questo itinerario?"
        onConfirm={() => onDelete(itinerary._id)}
      >
        <Button type="link" danger style={{ color: '#d9534f', fontSize: '16px' }}>
          <DeleteOutlined />
        </Button>
      </Popconfirm>,
    ]}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(-5px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <List.Item.Meta
      title={
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
          {itinerary.location || 'Località non disponibile'}
        </div>
      }
      description={
        <div style={{ fontSize: '16px', color: '#555' }}>
          <p style={{ marginBottom: '5px' }}>
            <strong style={{ color: '#8C8C8C' }}>Data:</strong>{' '}
            {itinerary.date ? moment(itinerary.date).format('DD/MM/YYYY') : 'N/A'}
          </p>
          <p style={{ marginBottom: '5px' }}>
            <strong style={{ color: '#8C8C8C' }}>Attività:</strong> {itinerary.activities?.join(', ') || 'Non specificato'}
          </p>
          <p>
            <strong style={{ color: '#8C8C8C' }}>Note:</strong> {itinerary.notes || 'Nessuna nota'}
          </p>
        </div>
      }
    />
  </List.Item>
);

export default ItineraryItem;
