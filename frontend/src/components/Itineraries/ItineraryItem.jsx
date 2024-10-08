import { List, Button, Popconfirm, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import defaultImage from '../../assets/images/itinerary.jpg'; 

const ItineraryItem = ({ itinerary, onEdit, onDelete }) => (
  <List.Item
    key={itinerary._id}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      background: '#fff',
      borderRadius: '15px',
      border: '1px solid #eaeaea',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      marginBottom: '20px',
    }}
    actions={[
      <Button
        type="link"
        onClick={() => onEdit(itinerary)}
        style={{
          color: '#1890ff',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          background: '#f0f2f5',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#e6f7ff')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#f0f2f5')}
      >
        <EditOutlined />
      </Button>,
      <Popconfirm
        title="Sicuro di voler eliminare questo itinerario?"
        onConfirm={() => onDelete(itinerary._id)}
      >
        <Button
          type="link"
          danger
          style={{
            color: '#ff4d4f',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            background: '#f0f2f5',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#ffccc7')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#f0f2f5')}
        >
          <DeleteOutlined />
        </Button>
      </Popconfirm>,
    ]}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
      e.currentTarget.style.transform = 'translateY(-5px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <Avatar
      src={defaultImage}
      size={80}
      style={{
        borderRadius: '10px',
        marginRight: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    />
    <List.Item.Meta
      title={
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px',
          }}
        >
          {itinerary.location || 'Località non disponibile'}
        </div>
      }
      description={
        <div style={{ fontSize: '16px', color: '#555' }}>
          <p style={{ marginBottom: '5px' }}>
            <strong style={{ color: '#8C8C8C' }}>Data:</strong>{' '}
            {itinerary.date
              ? moment(itinerary.date).format('DD/MM/YYYY')
              : 'N/A'}
          </p>
          <p style={{ marginBottom: '5px' }}>
            <strong style={{ color: '#8C8C8C' }}>Attività:</strong>{' '}
            {itinerary.activities?.join(', ') || 'Non specificato'}
          </p>
          <p>
            <strong style={{ color: '#8C8C8C' }}>Note:</strong>{' '}
            {itinerary.notes || 'Nessuna nota'}
          </p>
        </div>
      }
    />
  </List.Item>
);

export default ItineraryItem;
