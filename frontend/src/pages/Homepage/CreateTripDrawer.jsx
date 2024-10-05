import { Drawer, Form, Input, DatePicker, Button } from 'antd';

const { TextArea } = Input;

const CreateTripDrawer = ({ isDrawerVisible, handleDrawerCancel, newTrip, setNewTrip, handleCreateTrip }) => {
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
        <DatePicker
          value={newTrip.startDate}
          onChange={(date) =>
            setNewTrip({ ...newTrip, startDate: date })
          }
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
        />
      </Form.Item>
      <Form.Item
        label="Data di Fine"
        required
        rules={[{ required: true, message: 'Seleziona la data di fine' }]}
      >
        <DatePicker
          value={newTrip.endDate}
          onChange={(date) => setNewTrip({ ...newTrip, endDate: date })}
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
        />
      </Form.Item>
      <Button type="primary" onClick={handleCreateTrip} block>
        Crea Viaggio
      </Button>
    </Form>
  </Drawer>
);
};

export default CreateTripDrawer;
