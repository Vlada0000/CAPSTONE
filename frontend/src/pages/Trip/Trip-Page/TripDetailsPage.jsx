import { useState, useEffect } from 'react';
import { Layout, Spin, message, Menu, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById } from '../../../api/tripApi';
import { useAuth } from '../../../context/authContext';
import Itineraries from '../../../components/Itineraries/Itineraries';
import Expenses from '../../../components/Expense/ExpensePage/Expenses';
import Chat from '../../../components/Minicomponents/Chat/Chat';
import ParticipantsSection from '../Participants-section/ParticipantsSection';
import TripHeader from '../Trip-Header/TripHeader';
import {
  UserOutlined,
  FileOutlined,
  DollarOutlined,
  MessageOutlined,
  CheckOutlined,
  CameraOutlined,
  ArrowLeftOutlined, 
} from '@ant-design/icons';
import './TripDetailsPage.css';
import TravelCheckList from '../../../components/Minicomponents/Check-List/TravelCheckList';
import PhotoAlbum from '../PhotoAlbum';

const { Header, Content } = Layout;

const TripDetailPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('participants');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tripId) return;

    const fetchTrip = async () => {
      try {
        const data = await getTripById(tripId, user.token);
        setTrip(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading trip:', error);
        message.error('Errore durante il caricamento del viaggio');
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, user.token]);

  const updateTripData = (updatedTrip) => {
    setTrip(updatedTrip);
  };

  const menuItems = [
    { key: 'participants', icon: <UserOutlined />, label: 'Partecipanti' },
    { key: 'itineraries', icon: <FileOutlined />, label: 'Itinerari' },
    { key: 'photoAlbum', icon: <CameraOutlined />, label: 'Album ricordi' },
    { key: 'expenses', icon: <DollarOutlined />, label: 'Spese' },
    { key: 'chat', icon: <MessageOutlined />, label: 'Chat' },
    { key: 'travelCheckList', icon: <CheckOutlined />, label: 'Travel Check List' },
  ];

  if (loading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!trip) {
    return <div>Viaggio non trovato</div>;
  }

  return (
    <Layout className="trip-detail-layout">
      <TripHeader
        trip={trip}
        user={user}
        onTripUpdate={updateTripData}
        navigate={navigate}
      />
      <Header className="trip-detail-header">
        <Menu
          mode="horizontal"
          selectedKeys={[activeSection]}
          items={menuItems}
          onClick={(e) => setActiveSection(e.key)}
          className="trip-detail-menu"
        />
      </Header>
      <Content className="trip-detail-content">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')} 
          className="back-button"
        />
        {activeSection === 'participants' && (
          <ParticipantsSection
            trip={trip}
            user={user}
            onTripUpdate={updateTripData}
          />
        )}
        {activeSection === 'itineraries' && <Itineraries tripId={tripId} />}
        {activeSection === 'photoAlbum' && <PhotoAlbum tripId={tripId} />}
        {activeSection === 'expenses' && <Expenses tripId={tripId} />}
        {activeSection === 'chat' && <Chat tripId={tripId} />}
        {activeSection === 'travelCheckList' && <TravelCheckList />}
      </Content>
    </Layout>
  );
};

export default TripDetailPage;
