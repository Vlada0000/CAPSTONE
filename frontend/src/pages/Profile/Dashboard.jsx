import React from 'react';
import { Row, Col, Card, Typography, Progress, List, Avatar, Upload, Button } from 'antd';
import {
  TrophyOutlined,
  RocketOutlined,
  EnvironmentOutlined,
  CameraOutlined
} from '@ant-design/icons';
import UserTrips from './UserTrips';
import './Dashboard.css';

const { Title, Text } = Typography;

const Dashboard = ({ profileData, trips, handleFileChange, handleUploadImage }) => {
  // Calcolo delle statistiche
  const totalTrips = trips.length;
  const visitedCountries = [...new Set(trips.map((trip) => trip.country))].length;
  const progress = (visitedCountries / 195) * 100; 

  return (
    <div className="dashboard-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Title level={2}>Benvenuto, {profileData.name}!</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="stats-card">
                <TrophyOutlined className="stats-icon" />
                <Text className="stats-text">{totalTrips}</Text>
                <Text type="secondary">Viaggi Totali</Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="stats-card">
                <EnvironmentOutlined className="stats-icon" />
                <Text className="stats-text">{visitedCountries}</Text>
                <Text type="secondary">Paesi Visitati</Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="stats-card">
                <RocketOutlined className="stats-icon" />
                <Text className="stats-text">{progress.toFixed(2)}%</Text>
                <Text type="secondary">Mondo Esplorato</Text>
              </Card>
            </Col>
          </Row>
          <Card className="progress-card">
            <Text strong>Progresso di Esplorazione Globale</Text>
            <Progress percent={progress.toFixed(2)} status="active" />
          </Card>
          <UserTrips trips={trips} />
        </Col>
        <Col xs={24} lg={8}>
          <Card className="profile-summary-card">
            <Avatar
              size={120}
              src={profileData.profileImage}
              className="dashboard-avatar"
            />
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <Button
                shape="circle"
                icon={<CameraOutlined />}
                className="dashboard-upload-button"
              />
            </Upload>
            <Button
              type="primary"
              onClick={handleUploadImage}
              className="dashboard-upload-image-button"
            >
              Aggiorna Immagine
            </Button>
            <List className="profile-info-list">
              <List.Item>
                <Text strong>Nome:</Text> {profileData.name}
              </List.Item>
              <List.Item>
                <Text strong>Cognome:</Text> {profileData.surname}
              </List.Item>
              <List.Item>
                <Text strong>Email:</Text> {profileData.email}
              </List.Item>
              <List.Item>
                <Text strong>Data di Nascita:</Text>{' '}
                {profileData.birthdate || 'Non specificata'}
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
