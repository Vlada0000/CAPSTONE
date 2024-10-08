import { Drawer, Form, Input, Button } from 'antd';
import { useState } from 'react';
import DateValidator from '../../components/DateValidator'; 

const { TextArea } = Input;

const CreateTripDrawer = ({ isDrawerVisible, handleDrawerCancel, newTrip, setNewTrip, handleCreateTrip }) => {
  const [startDateValid, setStartDateValid] = useState(null);
  const [endDateValid, setEndDateValid] = useState(null);

  // Gestione delle date
  const handleStartDateValid = (date) => {
    setNewTrip({ ...newTrip, startDate: date });
    setStartDateValid(date);
  };

  const handleEndDateValid = (date) => {
    setNewTrip({ ...newTrip, endDate: date });
    setEndDateValid(date);
  };

  const handleDateInvalid = () => {
    setStartDateValid(null);
    setEndDateValid(null);
  };

  return (
    <Drawer
      title="Crea un Nuovo Viaggio"
      placement="right"
      onClose={handleDrawerCancel}
      open={isDrawerVisible}
      width={400}
      className="create-trip-drawer"
    >
      <Form layout="vertical">
        <Form.Item
          label="Nome Viaggio"
          required
          rules={[{ required: true, message: 'Inserisci il nome del viaggio' }]}
        >
          <Input
            value={newTrip.name}
            onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
            placeholder="Inserisci il nome del viaggio"
          />
        </Form.Item>
        <Form.Item
          label="Descrizione"
          required
          rules={[{ required: true, message: 'Inserisci una descrizione' }]}
        >
          <TextArea
            rows={3}
            value={newTrip.description}
            onChange={(e) =>
              setNewTrip({ ...newTrip, description: e.target.value })
            }
            placeholder="Inserisci una descrizione"
          />
        </Form.Item>

        <Form.Item
          label="Paese"
          required
          rules={[{ required: true, message: 'Inserisci il paese del viaggio' }]}
        >
          <Input
            value={newTrip.country}
            onChange={(e) => setNewTrip({ ...newTrip, country: e.target.value })}
            placeholder="Inserisci il paese del viaggio"
          />
        </Form.Item>

        <Form.Item
          label="Data di Inizio"
          required
          rules={[{ required: true, message: 'Seleziona la data di inizio' }]}
        >
          {/* Integrazione di DateValidator per la Data di Inizio */}
          <DateValidator
            onDateValid={handleStartDateValid}
            onDateInvalid={handleDateInvalid}
            minDate={null} 
            placeholder="Seleziona la data di inizio"
          />
        </Form.Item>

        <Form.Item
          label="Data di Fine"
          required
          rules={[
            { required: true, message: 'Seleziona la data di fine' },
            () => ({
              validator(_, value) {
                if (!endDateValid || (startDateValid && value && value.isAfter(startDateValid))) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('La data di fine deve essere successiva alla data di inizio'));
              },
            }),
          ]}
        >
          {/* Integrazione di DateValidator per la Data di Fine */}
          <DateValidator
            onDateValid={handleEndDateValid}
            onDateInvalid={handleDateInvalid}
            minDate={startDateValid} 
            placeholder="Seleziona la data di fine"
          />
        </Form.Item>

        <Button type="primary" onClick={handleCreateTrip} block disabled={!startDateValid || !endDateValid}>
          Crea Viaggio
        </Button>
      </Form>
    </Drawer>
  );
};

export default CreateTripDrawer;
