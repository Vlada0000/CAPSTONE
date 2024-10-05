import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Nav,
  NavDropdown,
  Badge,
  Image,
  Button,
  Container,
} from 'react-bootstrap';
import {
  BellFill,
  PersonFill,
  GearFill,
  BoxArrowRight,
  Check,
  X,
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
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
        console.error('Error fetching notifications:', error);
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

  const handleMarkAsRead = async (notificationId) => {
    try {
      const notificationToMark = notifications.find((n) => n._id === notificationId);
      if (notificationToMark?.read) return;
      await markNotificationAsRead(notificationId, user.token);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(user.token);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAcceptInvite = async (notificationId) => {
    try {
      await acceptTripInvitation(notificationId, user.token);
      await handleMarkAsRead(notificationId);
      navigate('/invitations');
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleRejectInvite = async (notificationId) => {
    try {
      await declineTripInvitation(notificationId, user.token);
      await handleMarkAsRead(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error('Error rejecting invitation:', error);
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="navbar-custom" fixed="top">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} className="navbar-logo">
          <img src={logo} alt="Travel Mate" className="navbar-logo-img" />
          <span className="navbar-logo-text">Travel Mate</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
       {user && (
         <Nav className="ml-auto align-items-center">
           {/* Notification Dropdown */}
           <NavDropdown
            title={
              <div className="d-inline-flex align-items-center">
                 <BellFill className="notification-icon" />
                  {unreadCount > 0 && (
              <Badge pill variant="danger" className="notification-badge">
                {unreadCount}
              </Badge>
            )}
          </div>
        }
        id="notification-dropdown"
        className="dropstart" 
       
      >
        <div className="notification-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NavDropdown.Item
                key={notification._id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => handleMarkAsRead(notification._id)}
              >
                <div className="notification-message">
                  {notification.message || 'Nuova notifica'}
                </div>
                {notification.type === 'trip_invite' && (
                  <div className="notification-actions">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptInvite(notification._id);
                      }}
                    >
                      <Check />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRejectInvite(notification._id);
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                )}
              </NavDropdown.Item>
            ))
          ) : (
            <NavDropdown.Item>Nessuna nuova notifica</NavDropdown.Item>
          )}
        </div>
        {notifications.length > 0 && (
          <NavDropdown.Item as="button" onClick={handleMarkAllAsRead}>
            Segna tutte come lette
          </NavDropdown.Item>
        )}
      </NavDropdown>

      {/* User Avatar Dropdown */}
      <NavDropdown
        title={
          <Image src={userImage} roundedCircle className="user-avatar" />
        }
        id="user-dropdown"
        className="dropstart" 
        
      >
        <NavDropdown.Item onClick={() => navigate('/profile')}>
          <PersonFill /> Profilo
        </NavDropdown.Item>
        <NavDropdown.Item onClick={() => navigate('/settings')}>
          <GearFill /> Impostazioni
        </NavDropdown.Item>
           <NavDropdown.Item onClick={handleLogout}>
             <BoxArrowRight /> Logout
           </NavDropdown.Item>
          </NavDropdown>
         </Nav>
         )}
      </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default NavBar;
