import React from 'react';
import { List } from 'antd';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, participants, onEdit, onDelete }) => (
  <List
    bordered
    dataSource={expenses}
    renderItem={(expense) => (
      <ExpenseItem
        expense={expense}
        participants={participants}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )}
  />
);

export default ExpenseList;
