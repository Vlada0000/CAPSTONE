import React from 'react';
import { Form, Input, Button, Select, Checkbox, List, DatePicker } from 'antd';
import moment from 'moment';

const ExpenseForm = ({
  participants,
  expenseData,
  setExpenseData,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  const [form] = Form.useForm();

  const handleDateChange = (date) => {
    setExpenseData({ ...expenseData, date });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        ...expenseData,
        date: expenseData.date ? moment(expenseData.date) : null,
      }}
    >
      <Form.Item label="Importo" name="amount" rules={[{ required: true, message: 'Inserisci l\'importo' }]}>
        <Input
          type="number"
          placeholder="Inserisci l'importo"
          value={expenseData.amount}
          onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Descrizione" name="description" rules={[{ required: true, message: 'Inserisci una descrizione' }]}>
        <Input
          type="text"
          placeholder="Descrivi la spesa"
          value={expenseData.description}
          onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Data" name="date" rules={[{ required: true, message: 'Seleziona una data' }]}>
        <DatePicker
          value={expenseData.date ? moment(expenseData.date) : null}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          style={{ width: '100%' }}
          placeholder="Seleziona una data"
        />
      </Form.Item>
      <Form.Item label="Pagato da" name="paidBy" rules={[{ required: true, message: 'Seleziona chi ha pagato' }]}>
        <Select
          placeholder="Seleziona chi ha pagato"
          value={expenseData.paidBy}
          onChange={(value) => setExpenseData({ ...expenseData, paidBy: value })}
        >
          {participants.map((participant) => (
            <Select.Option key={participant._id} value={participant._id}>
              {participant.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Chi partecipa alla spesa?" name="participants" rules={[{ required: true, message: 'Seleziona almeno un partecipante' }]}>
        <Checkbox.Group
          value={expenseData.participants}
          onChange={(selectedParticipants) => setExpenseData({ ...expenseData, participants: selectedParticipants })}
        >
          <List
            bordered
            dataSource={participants}
            renderItem={(participant) => (
              <List.Item>
                <Checkbox value={participant._id}>{participant.name}</Checkbox>
              </List.Item>
            )}
          />
        </Checkbox.Group>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEditing ? 'Salva Modifiche' : 'Aggiungi Spesa'}
        </Button>
        {isEditing && (
          <Button onClick={onCancel} style={{ marginLeft: '10px' }}>
            Annulla
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default ExpenseForm;
