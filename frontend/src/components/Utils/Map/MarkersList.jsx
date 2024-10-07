import { Marker, Popup } from 'react-leaflet';
import { Button, Input, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const MarkersList = ({ markers, setMarkers }) => {
  const handleUpdateMarker = (index, description) => {
    const updatedMarkers = markers.map((marker, i) =>
      i === index ? { ...marker, description } : marker
    );
    setMarkers(updatedMarkers);
    message.success('Marker aggiornato con successo!');
  };

  const handleDeleteMarker = (index) => {
    Modal.confirm({
      title: 'Sei sicuro di voler eliminare questo marker?',
      onOk: () => {
        const updatedMarkers = markers.filter((_, i) => i !== index);
        setMarkers(updatedMarkers);
        message.success('Marker eliminato con successo!');
      },
    });
  };

  return (
    <>
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]}>
          <Popup minWidth={200}>
            <div className="marker-popup">
              <h3>Informazioni sulla Posizione</h3>
              <Input.TextArea
                rows={2}
                value={marker.description}
                onChange={(e) => handleUpdateMarker(index, e.target.value)}
                placeholder="Inserisci una descrizione"
              />
              <div className="popup-actions">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleUpdateMarker(index, marker.description)}
                >
                  Aggiorna
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteMarker(index)}
                >
                  Elimina
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MarkersList;
