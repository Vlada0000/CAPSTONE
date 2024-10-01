import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Badge, Avatar, Button, Typography } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined, SmileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../api/notificationApi';
import { useSocket } from '../../context/socketContext';
import logo from '../../assets/images/logo.JPG';
import defaultImage from '../../assets/images/user.jpg';
import './NavBar.css';

const { Text } = Typography;

const NavBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { onNotification, offNotification, isSocketInitialized } = useSocket();

  const userImage = user?.profileImage || defaultImage;

  useEffect(() => {
    if (!isSocketInitialized || !user) return;
    fetchNotifications();
    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prevCount) => prevCount + 1);
    };
    onNotification(handleNotification);
    return () => offNotification(handleNotification);
  }, [isSocketInitialized, user, onNotification, offNotification]);

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

  const handleMarkAsRead = async (notificationId) => {
    try {
      const notificationToMark = notifications.find((n) => n._id === notificationId);
      if (notificationToMark?.read) return;
      await markNotificationAsRead(notificationId, user.token);
      setNotifications((prev) => prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)));
      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notificationItems = notifications.map((notification) => ({
    key: notification._id,
    label: (
      <div className={`notification-item ${notification.read ? 'read' : 'unread'}`} onClick={() => handleMarkAsRead(notification._id)}>
        <Text>{notification.message || 'New notification'}</Text>
      </div>
    ),
  }));

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        {/* Logo */}
        <Navbar.Brand onClick={() => navigate('/')} className="d-flex align-items-center logo">
          <img src={logo} alt="Travel Mate" className="navbar-logo" />
          <span className="logo-text">Travel Mate</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarResponsive" />

        {/* Collapsible content */}
        <Navbar.Collapse id="navbarResponsive" className="justify-content-end" >
          <Nav className="ml-auto d-flex align-items-center">
            {/* Notifications */}
            <Dropdown align="end">
              <Dropdown.Toggle as="div">
                <Badge count={unreadCount} size="small" offset={[-5, 5]}>
                  <BellOutlined className="notification-icon" />
                </Badge>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {notifications.map((notification) => (
                  <Dropdown.Item key={notification._id} onClick={() => navigate(notification.url)}>
                    <Text>{notification.message || 'New notification'}</Text>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* User Avatar */}
            <Dropdown align="end">
              <Dropdown.Toggle as="div">
                <Avatar src={userImage} size="large" className="user-avatar" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate('/profile')}><UserOutlined /> Profile</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/settings')}><SettingOutlined /> Settings</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}><LogoutOutlined /> Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default NavBar;
