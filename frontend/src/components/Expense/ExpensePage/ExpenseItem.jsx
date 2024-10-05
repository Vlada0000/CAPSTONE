import React from 'react';
import { List, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const ExpenseItem = ({ expense, participants, onEdit, onDelete }) => {
  const paidById = typeof expense.paidBy === 'object' ? expense.paidBy._id : expense.paidBy;

  const payer = participants.find((p) => p._id === paidById);

  return (
    <List.Item
      actions={[
        <Button type="link" onClick={() => onEdit(expense)}>
          <EditOutlined />
        </Button>,
        <Popconfirm
          title="Sicuro di voler eliminare questa spesa?"
          onConfirm={() => onDelete(expense._id)}
        >
          <Button type="link" danger>
            <DeleteOutlined />
          </Button>
        </Popconfirm>,
      ]}
    >
      <List.Item.Meta
        title={`€${expense.amount} - ${expense.description}`}
        description={`Pagato da: ${payer?.name || 'Partecipante non trovato'}, Data: ${expense.date ? moment(expense.date).format('DD/MM/YYYY') : 'N/A'}`}
      />
    </List.Item>
  );
};

export default ExpenseItem;
