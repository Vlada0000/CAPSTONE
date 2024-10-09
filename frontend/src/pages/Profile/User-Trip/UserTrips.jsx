import { Card, Col, Row, Empty, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EnvironmentOutlined } from '@ant-design/icons';
import defaultImage from '../../../assets/images/defaultImage.jpeg';
import './UserTrips.css';

const { Meta } = Card;
const { Title } = Typography;

const UserTrips = ({ trips }) => {
  const navigate = useNavigate();

  const handleNavigate = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  return (
    <div className="user-trips-container">
      <Title level={3} className="user-trips-title">I miei Viaggi</Title>
      {trips.length === 0 ? (
        <Empty description="Non ci sono viaggi disponibili" />
      ) : (
        <Row gutter={[24, 24]}>
          {trips.map((trip) => (
            <Col xs={24} sm={12} md={8} lg={6} key={trip._id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={trip.name}
                    src={trip.photoUrl || defaultImage}
                    className="trip-card-image"
                  />
                }
                onClick={() => handleNavigate(trip._id)}
                className="trip-card" 
              >
                <Meta
                  title={
                    <span className="trip-card-title"> 
                      {trip.name}
                    </span>
                  }
                  description={
                    <>
                      <p>{trip.description}</p>
                      <Tag
                        icon={<EnvironmentOutlined />}
                        color="blue"
                        className="trip-card-country" 
                      >
                        {trip.country}
                      </Tag>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default UserTrips;
