import { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Offcanvas, Badge, Image, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import {
  MenuOutlined,
  UserOutlined, 
  LogoutOutlined,
  BellFilled,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../api/notificationApi';
import { acceptTripInvitation, declineTripInvitation } from '../../api/tripApi';
import { useSocket } from '../../context/socketContext';
import logo from '../../assets/images/logo.JPG';
import defaultImage from '../../assets/images/user.jpg';
import './NavBar.css';

const NavBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { onNotification, offNotification, isSocketInitialized } = useSocket();
  const [offcanvasVisible, setOffcanvasVisible] = useState(false);
  const [notificationOffcanvasVisible, setNotificationOffcanvasVisible] = useState(false);

  const userImage = user?.profileImage || defaultImage;

  useEffect(() => {
    if (!isSocketInitialized || !user) return;

    const fetchNotifications = async () => {
      if (!user?.token) return;
      try {
        const data = await getNotifications(user.token);
        setNotifications(data);
        const unread = data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Errore nel recupero delle notifiche:', error);
      }
    };

    fetchNotifications();

    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prevCount) => prevCount + 1);
    };

    onNotification(handleNotification);
    return () => offNotification(handleNotification);
  }, [isSocketInitialized, user, onNotification, offNotification]);

  const handleMarkAsRead = async (notificationId, tripId) => {
    try {
      const notificationToMark = notifications.find((n) => n._id === notificationId);
      if (notificationToMark?.read) return;

      await markNotificationAsRead(notificationId, user.token);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));

      if (tripId) {
        navigate(`/trips/${tripId}`);
      }
    } catch (error) {
      console.error('Errore nel segnare la notifica come letta:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(user.token);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Errore nel segnare tutte le notifiche come lette:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAcceptInvite = async (notificationId, tripId) => {
    try {
      if (!tripId) throw new Error('ID del viaggio non trovato nella notifica.');
      await acceptTripInvitation(tripId, user.token);
      await handleMarkAsRead(notificationId, tripId);
    } catch (error) {
      console.error('Errore nella chiamata API per accettare invito:', error);
    }
  };

  const handleRejectInvite = async (notificationId) => {
    try { 
      const notification = notifications.find((n) => n._id === notificationId);
      if (!notification || !notification.data.tripId) throw new Error('ID del viaggio non trovato nella notifica');
      
      const tripId = notification.data.tripId; 
      await declineTripInvitation(tripId, user.token);
      await handleMarkAsRead(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error('Errore nel rifiuto dell\'invito:', error);
    }
  };

  const showOffcanvas = () => setOffcanvasVisible(true);
  const closeOffcanvas = () => setOffcanvasVisible(false);

  const showNotificationOffcanvas = () => setNotificationOffcanvasVisible(true);
  const closeNotificationOffcanvas = () => setNotificationOffcanvasVisible(false);

  return (
    <Navbar bg="light" expand="lg" className="navbar-custom p-3">
      <Navbar.Brand onClick={() => navigate('/')} className="d-flex align-items-center">
        <img src={logo} alt="Travel Mate" className="navbar-logo-img me-2" />
        <span className="navbar-logo-text fw-bold">Travel Mate</span>
      </Navbar.Brand>

      <Button variant="primary" className="navbar-toggler d-lg-none" onClick={showOffcanvas}>
        <MenuOutlined />
      </Button>

      <Offcanvas show={offcanvasVisible} onHide={closeOffcanvas} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="offcanvas-body">
          <Nav className="flex-column">
            <Nav.Link onClick={() => { closeOffcanvas(); navigate('/profile'); }}>
              <UserOutlined className="me-2" /> Profilo
            </Nav.Link>
            <Nav.Link onClick={handleLogout}>
              <LogoutOutlined className="me-2" /> Logout
            </Nav.Link>
            {user && (
              <Nav.Link onClick={showNotificationOffcanvas}>
                <BellFilled className="me-2" /> Notifiche {unreadCount > 0 && <Badge bg="danger">{unreadCount}</Badge>}
              </Nav.Link>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={notificationOffcanvasVisible} onHide={closeNotificationOffcanvas} placement="end">
        <Offcanvas.Header closeButton className="offcanvas-header">
          <Offcanvas.Title>Notifiche</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="notification-offcanvas-body">
          <Nav className="flex-column">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Nav.Item
                  key={notification._id}
                  onClick={() => handleMarkAsRead(notification._id, notification.data?.tripId)}
                  className={`notification-item p-3 mb-2 rounded shadow-sm ${notification.read ? 'read' : 'unread'}`}
                >
                  <div className="fw-bold">{notification.message || 'Nuova notifica'}</div>
                  {notification.type === 'trip_invite' && notification.data?.tripId && (
                    <div className="d-flex gap-2">
                      <Button variant="success" className="button-accept" onClick={(e) => { e.stopPropagation(); handleAcceptInvite(notification._id, notification.data.tripId); }}>
                        <CheckOutlined />
                      </Button>
                      <Button variant="danger" className="button-decline" onClick={(e) => { e.stopPropagation(); handleRejectInvite(notification._id); }}>
                        <CloseOutlined />
                      </Button>
                    </div>
                  )}
                </Nav.Item>
              ))
            ) : (
              <div className="text-center">Nessuna nuova notifica</div>
            )}
            {notifications.length > 0 && (
              <Button variant="link" onClick={handleMarkAllAsRead} className="mt-3" id="btn-mark-all-read">
                Segna tutte come lette
              </Button>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {user && (
        <Nav className="ms-auto d-none d-lg-flex align-items-center">
          <Nav.Link onClick={showNotificationOffcanvas}>
            <div className="notification-icon-container">
              <BellFilled className="notification-icon me-2" />
              {unreadCount > 0 && <Badge className="notification-badge">{unreadCount}</Badge>}
            </div>
          </Nav.Link>
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="d-flex align-items-center">
              <Image src={userImage} roundedCircle width="40" height="40" className="me-2" style={{ objectFit: 'cover' }} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate('/profile')}>
                <UserOutlined className="me-2" /> Profilo
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
                <LogoutOutlined className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      )}
    </Navbar>
  );
};

export default NavBar;
