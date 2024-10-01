// src/pages/TripDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Spin, message, Menu } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById } from '../../api/tripApi';
import { useAuth } from '../../context/authContext';
import Itineraries from '../../components/Itineraries/Itineraries';
import Expenses from '../../components/Expense/Expenses';
import Chat from '../../components/Utils/Chat';
import ParticipantsSection from '../Trip/ParticipantsSection';
import TripHeader from '../Trip/TripHeader';
import {
  UserOutlined,
  FileOutlined,
  DollarOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import './TripDetailsPage.css';

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
          onClick={(e) => setActiveSection(e.key)}
          className="trip-detail-menu"
        >
          <Menu.Item key="participants" icon={<UserOutlined />}>
            Partecipanti
          </Menu.Item>
          <Menu.Item key="itineraries" icon={<FileOutlined />}>
            Itinerari
          </Menu.Item>
          <Menu.Item key="expenses" icon={<DollarOutlined />}>
            Spese
          </Menu.Item>
          <Menu.Item key="chat" icon={<MessageOutlined />}>
            Chat
          </Menu.Item>
        </Menu>
      </Header>
      <Content className="trip-detail-content">
        {activeSection === 'participants' && (
          <ParticipantsSection
            trip={trip}
            user={user}
            onTripUpdate={updateTripData}
          />
        )}
        {activeSection === 'itineraries' && <Itineraries tripId={tripId} />}
        {activeSection === 'expenses' && <Expenses tripId={tripId} />}
        {activeSection === 'chat' && <Chat tripId={tripId} />}
      </Content>
    </Layout>
  );
};

export default TripDetailPage;
