import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { Modal, Input, message } from 'antd';

const MapClickHandler = ({ setMarkers }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [descriptionInput, setDescriptionInput] = useState('');

  useMapEvents({
    click(e) {
      setCurrentMarker({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        description: '',
      });
      setDescriptionInput('');
      setIsModalVisible(true);
    },
  });

  const handleAddMarker = () => {
    if (currentMarker) {
      const newMarker = { ...currentMarker, description: descriptionInput };
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      setIsModalVisible(false);
      message.success('Marker aggiunto con successo!');
    }
  };

  return (
    <Modal
      title="Aggiungi Descrizione al Marker"
      open={isModalVisible}
      onOk={handleAddMarker}
      onCancel={() => setIsModalVisible(false)}
      okText="Aggiungi Marker"
    >
      <Input.TextArea
        rows={4}
        value={descriptionInput}
        onChange={(e) => setDescriptionInput(e.target.value)}
        placeholder="Inserisci una descrizione per questo marker"
      />
    </Modal>
  );
};

export default MapClickHandler;
