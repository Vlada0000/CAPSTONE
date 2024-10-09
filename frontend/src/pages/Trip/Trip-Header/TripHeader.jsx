import { useState } from 'react';
import {
  Typography,
  Button,
  Form,
  Input,
  Upload,
  message,
  Popconfirm,
  Modal,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
  addPhotoToTrip,
  deleteTrip,
  updateTrip,
  getTripById,
} from '../../../api/tripApi';
import DateValidator from '../../../components/DateValidator'; 
import defaultImage from '../../../assets/images/defaultImage.jpeg';
import './TripHeader.css';

const { Title, Text } = Typography;

const TripHeader = ({ trip, user, onTripUpdate, navigate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tripData, setTripData] = useState({
    name: trip.name,
    description: trip.description,
    startDate: moment(trip.startDate),
    endDate: moment(trip.endDate),
  });
  const [photoFile, setPhotoFile] = useState(null);

  const handlePhotoChange = (info) => {
    if (info.file) {
      setPhotoFile(info.file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) {
      message.error('Seleziona una foto da caricare.');
      return;
    }

    try {
      await addPhotoToTrip(trip._id, photoFile, user.token);
      message.success('Foto caricata con successo!');
      const updatedTrip = await getTripById(trip._id, user.token);
      onTripUpdate(updatedTrip);
      setPhotoFile(null);
    } catch (error) {
      console.error('Error uploading della foto:', error);
      message.error('Errore durante il caricamento della foto');
    }
  };

  const handleSaveTripChanges = async () => {
    if (
      !tripData.name.trim() ||
      !tripData.description.trim() ||
      !tripData.startDate ||
      !tripData.endDate
    ) {
      message.error('Tutti i campi sono richiesti.');
      return;
    }

    try {
      await updateTrip(
        trip._id,
        {
          ...tripData,
          startDate: tripData.startDate.format('YYYY-MM-DD'),
          endDate: tripData.endDate.format('YYYY-MM-DD'),
        },
        user.token
      );
      message.success('Viaggio aggiornato con successo!');
      setIsModalVisible(false);
      const updatedTrip = await getTripById(trip._id, user.token);
      onTripUpdate(updatedTrip);
    } catch (error) {
      console.error("Error durante l'aggiornamento del viaggio:", error);
      message.error('Errore durante l\'aggiornamento del viaggio');
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(trip._id, user.token);
      message.success('Viaggio eliminato con successo!');
      navigate('/');
    } catch (error) {
      console.error('Errore durante l\'eliminazione del viaggio:', error);
      message.error('Errore durante l\'eliminazione del viaggio');
    }
  };

  return (
    <div className="trip-header">
      <div
        className="trip-header-background"
        style={{
          backgroundImage: `url(${trip.photoUrl || defaultImage})`,
        }}
      >
        <div className="trip-header-overlay">
          <div className="trip-header-content">
            <Title className="trip-title">{trip.name}</Title>
            <Text className="trip-description">{trip.description}</Text>
            <div className="trip-dates">
              <Text className='text-white'>
                <strong>Data inizio:</strong>{' '}
                {moment(trip.startDate).format('DD/MM/YYYY')}
              </Text>
              <Text style={{ marginLeft: '20px' }} className="text-white">
                <strong>Data fine:</strong>{' '}
                {moment(trip.endDate).format('DD/MM/YYYY')}
              </Text>
            </div>
            {trip.organizer._id === user._id && (
              <div className="trip-actions">
                <Button
                  type="button"
                  icon={<EditOutlined />}
                  onClick={() => setIsModalVisible(true)}
                >
                  Modifica
                </Button>
                <Popconfirm
                  title="Sei sicuro di voler eliminare questo viaggio?"
                  onConfirm={handleDeleteTrip}
                  okText="Sì"
                  cancelText="No"
                >
                  <Button type="danger" icon={<DeleteOutlined />}>
                    Elimina
                  </Button>
                </Popconfirm>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        title="Modifica Viaggio"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="trip-edit-modal"
      >
        <Form layout="vertical" className="trip-edit-form">
          <Form.Item label="Nome del viaggio" required>
            <Input
              value={tripData.name}
              onChange={(e) =>
                setTripData({ ...tripData, name: e.target.value })
              }
              placeholder="Inserisci il nome del viaggio"
            />
          </Form.Item>
          <Form.Item label="Descrizione del viaggio" required>
            <Input.TextArea
              value={tripData.description}
              onChange={(e) =>
                setTripData({ ...tripData, description: e.target.value })
              }
              placeholder="Inserisci la descrizione del viaggio"
              rows={4}
            />
          </Form.Item>
          <Form.Item label="Data inizio" required>
            <DateValidator
              initialValue={tripData.startDate}
              onDateValid={(date) => setTripData({ ...tripData, startDate: date })}
              placeholder="Seleziona la data di inizio"
            />
          </Form.Item>
          <Form.Item label="Data fine" required>
            <DateValidator
              initialValue={tripData.endDate}
              minDate={tripData.startDate} 
              onDateValid={(date) => setTripData({ ...tripData, endDate: date })}
              placeholder="Seleziona la data di fine"
            />
          </Form.Item>
          <Form.Item label="Cambia Immagine">
            <Upload
              beforeUpload={() => false}
              onChange={handlePhotoChange}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Seleziona Immagine</Button>
            </Upload>
            {photoFile && (
              <Button
                type="primary"
                onClick={handleUploadPhoto}
                style={{ marginTop: '10px' }}
              >
                Carica Foto
              </Button>
            )}
          </Form.Item>
          <div className="trip-edit-actions">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveTripChanges}
            >
              Salva
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={() => setIsModalVisible(false)}
              style={{ marginLeft: '8px' }}
            >
              Annulla
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TripHeader;
