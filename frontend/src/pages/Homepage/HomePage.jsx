import { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Spin,
  Typography,
  Pagination,
} from 'antd';
import {
  PlusOutlined,
  RightOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import './HomePage.css';
import ThreeDGlobe from '../../components/Minicomponents/Globe/ThreeDGlobe';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { getTrips, createTrip } from '../../api/tripApi';
import moment from 'moment';
import defaultImage from '../../assets/images/defaultImage.jpeg';
import CreateTripDrawer from './CreateTripDrawer';

const { Meta } = Card;
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
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
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
      setIsDrawerVisible(false); 
      fetchTrips();
    } catch (error) {
      console.error('Errore nella creazione del viaggio:', error);
    }
  };

  const showCreateDrawer = () => {
    setIsDrawerVisible(true); 
  };

  const handleDrawerCancel = () => {
    setIsDrawerVisible(false); 
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
            onClick={showCreateDrawer}
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

      <CreateTripDrawer
        isDrawerVisible={isDrawerVisible}
        handleDrawerCancel={handleDrawerCancel}
        newTrip={newTrip}
        setNewTrip={setNewTrip}
        handleCreateTrip={handleCreateTrip}
      />
    </div>
  );
};

export default HomePage;
