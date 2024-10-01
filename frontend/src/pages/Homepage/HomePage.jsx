import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Input,
  DatePicker,
  Spin,
  Modal,
  Typography,
  Pagination,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  RightOutlined,
  LeftOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import './HomePage.css';
import ThreeDGlobe from '../../components/Utils/ThreeDGlobe';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { getTrips, createTrip } from '../../api/tripApi';
import moment from 'moment';
import defaultImage from '../../assets/images/defaultImage.jpeg';

const { Meta } = Card;
const { TextArea } = Input;
const { Title, Text } = Typography;

const HomePage = () => {
  const { user, loading } = useAuth();
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [pageSize] = useState(6); 
  const [newTrip, setNewTrip] = useState({
    name: '',
    description: '',
    startDate: null,
    endDate: null,
  });
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      setLoadingTrips(true);
      const fetchedTrips = await getTrips(user.token);
      setTrips(fetchedTrips);
    } catch (error) {
      console.error('Errore nel recupero dei viaggi:', error);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNavigate = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  const handleCreateTrip = async () => {
    try {
      const tripData = {
        ...newTrip,
        startDate: newTrip.startDate
          ? newTrip.startDate.format('YYYY-MM-DD')
          : null,
        endDate: newTrip.endDate ? newTrip.endDate.format('YYYY-MM-DD') : null,
      };
      await createTrip(tripData, user.token);
      setNewTrip({
        name: '',
        description: '',
        startDate: null,
        endDate: null,
      });
      setIsModalVisible(false);
      fetchTrips();
    } catch (error) {
      console.error('Errore nella creazione del viaggio:', error);
    }
  };

  const showCreateModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setNewTrip({ name: '', description: '', startDate: null, endDate: null });
  };

   
   const paginatedTrips = trips.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  if (loading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <div className="hero-section">
        <ThreeDGlobe />
        <div className="hero-overlay">
          <Title className="hero-title animate__animated animate__fadeInDown">
            Benvenuto, {user.name}!
          </Title>
          <Text className="hero-subtitle animate__animated animate__fadeInUp">
            Esplora il mondo. Pianifica i tuoi viaggi con facilità.
          </Text>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
            className="create-trip-button animate__animated animate__fadeInUp"
          >
            Crea Nuovo Viaggio
          </Button>
        </div>
      </div>

      <div className="trips-section">
        <Title level={2} className="section-title">
          I tuoi viaggi
        </Title>
        {loadingTrips ? (
          <Spin size="large" className="trips-loading-spinner" />
        ) : trips.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {paginatedTrips.map((trip) => (
                <Col xs={24} sm={12} md={8} lg={6} key={trip._id}>
                  <Card
                    hoverable
                    className="trip-card"
                    cover={
                      <div className="trip-card-image-wrapper">
                        <img
                          alt={trip.name}
                          src={trip.photoUrl || defaultImage}
                          className="trip-card-image"
                        />
                        <div className="trip-card-overlay">
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<RightOutlined />}
                            onClick={() => handleNavigate(trip._id)}
                          />
                        </div>
                      </div>
                    }
                  >
                    <Meta
                      title={trip.name}
                      description={
                        trip.description || 'Nessuna descrizione disponibile.'
                      }
                    />
                    <div className="trip-dates">
                      <CalendarOutlined style={{ marginRight: '8px' }} />
                      {moment(trip.startDate).format('DD/MM/YYYY')} -{' '}
                      {moment(trip.endDate).format('DD/MM/YYYY')}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="pagination-container ">
              <Pagination 
                current={currentPage}
                pageSize={pageSize}
                total={trips.length}
                onChange={handlePageChange}
                showSizeChanger={false} 
              />
            </div>
          </>
        ) : (
          <p className="no-trips-message">
            Non hai ancora creato nessun viaggio.
          </p>
        )}
      </div>

     
      <Modal
        title="Crea un Nuovo Viaggio"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className="create-trip-modal"
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
      </Modal>
    </div>
  );
};

export default HomePage;
