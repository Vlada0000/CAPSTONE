// components/ItineraryForm.js
import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Button } from 'antd';
import moment from 'moment';

const ItineraryForm = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // Set initial values when editing
    form.setFieldsValue({
      ...initialValues,
      date: initialValues.date ? moment(initialValues.date) : null,
      activities: initialValues.activities ? initialValues.activities.join(', ') : '',
    });
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      date: values.date ? values.date.format('YYYY-MM-DD') : null,
      activities: values.activities.split(',').map((activity) => activity.trim()),
    };
    onSubmit(formattedValues);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        label="Luogo"
        name="location"
        rules={[{ required: true, message: 'Inserisci il luogo' }]}
      >
        <Input placeholder="Inserisci il luogo" />
      </Form.Item>
      <Form.Item
        label="Data"
        name="date"
        rules={[{ required: true, message: 'Seleziona una data' }]}
      >
        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Seleziona una data" />
      </Form.Item>
      <Form.Item
        label="Attività"
        name="activities"
        rules={[{ required: true, message: 'Inserisci almeno un\'attività' }]}
      >
        <Input placeholder="Inserisci le attività (separate da virgole)" />
      </Form.Item>
      <Form.Item label="Note" name="notes">
        <Input.TextArea placeholder="Aggiungi note aggiuntive" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
          Salva
        </Button>
        <Button onClick={onCancel}>Annulla</Button>
      </Form.Item>
    </Form>
  );
};

export default ItineraryForm;
