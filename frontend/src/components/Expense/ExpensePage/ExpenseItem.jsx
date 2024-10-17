import { List, Button, Popconfirm, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import defaultImage from '../../../assets/images/expenses.jpeg'; 

const ExpenseItem = ({ expense, participants, onEdit, onDelete }) => {
  
  const paidById = typeof expense.paidBy === 'object' ? expense.paidBy._id : expense.paidBy;
  const payer = participants.find((p) => p._id === paidById);

  return (
    <List.Item
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px', 
        background: '#fff',
        borderBottom: '1px solid #eaeaea',
        transition: 'transform 0.3s ease',
        marginBottom: '10px',
        borderRadius: '8px',
      }}
      actions={[
        <Button
          type="link"
          onClick={() => onEdit(expense)}
          style={{
            color: '#1890ff',
            fontSize: '16px',
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
          <EditOutlined style={{ fontSize: '20px' }} />
        </Button>,
        <Popconfirm
          title="Sicuro di voler eliminare questa spesa?"
          onConfirm={() => onDelete(expense._id)}
        >
          <Button
            type="link"
            danger
            style={{
              color: '#ff4d4f',
              fontSize: '16px',
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
            <DeleteOutlined style={{ fontSize: '20px' }} />
          </Button>
        </Popconfirm>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={defaultImage} size={64} />}  
        title={`€${expense.amount} - ${expense.description}`}
        description={`Pagato da: ${payer?.name || 'Partecipante non trovato'}, Data: ${expense.date ? moment(expense.date).format('DD/MM/YYYY') : 'N/A'}`}
      />
    </List.Item>
  );
};

export default ExpenseItem;
