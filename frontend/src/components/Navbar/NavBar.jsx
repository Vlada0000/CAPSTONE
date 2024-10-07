import { useState, useEffect } from 'react';
import { Menu, Badge, Image, Button, Drawer } from 'antd';
import {
  BellFilled,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
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

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notificationDrawerVisible, setNotificationDrawerVisible] = useState(false);

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
        navigate(`/trip/${tripId}`);
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
      if (!tripId) {
        throw new Error('ID del viaggio non trovato nella notifica.');
      }
      await acceptTripInvitation(tripId, user.token);
      await handleMarkAsRead(notificationId, tripId);
    } catch (error) {
      console.error('Errore nella chiamata API per accettare invito:', error);
    }
  };

  const handleRejectInvite = async (notificationId) => {
    try {
      await declineTripInvitation(notificationId, user.token);
      await handleMarkAsRead(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error('Errore nel rifiuto dell\'invito:', error);
    }
  };

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const showNotificationDrawer = () => setNotificationDrawerVisible(true);
  const closeNotificationDrawer = () => setNotificationDrawerVisible(false);

  return (
    <div className="navbar-custom">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <img src={logo} alt="Travel Mate" className="navbar-logo-img" />
        <span className="navbar-logo-text">Travel Mate</span>
      </div>

      <Button className="navbar-toggler" icon={<MenuOutlined />} onClick={showDrawer} />

      <Drawer title="Menu" placement="right" onClose={closeDrawer} open={drawerVisible}>
        <Menu mode="inline" selectable={false}>
          <Menu.Item key="profile" onClick={() => { closeDrawer(); navigate('/profile'); }}>
            <UserOutlined /> Profilo
          </Menu.Item>
          <Menu.Item key="logout" onClick={handleLogout}>
            <LogoutOutlined /> Logout
          </Menu.Item>
          {user && (
            <Menu.Item key="notifications" onClick={showNotificationDrawer}>
              <BellFilled /> Notifiche {unreadCount > 0 && <Badge count={unreadCount} />}
            </Menu.Item>
          )}
        </Menu>
      </Drawer>

      <Drawer
        title="Notifiche"
        placement="right"
        onClose={closeNotificationDrawer}
        open={notificationDrawerVisible}
        width="480px"
      >
        <Menu mode="inline" selectable={false}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Menu.Item
                key={notification._id}
                onClick={() => handleMarkAsRead(notification._id, notification.data?.tripId)}
              >
                <div>{notification.message || 'Nuova notifica'}</div>
                {notification.type === 'trip_invite' && notification.data?.tripId && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      type="link"
                      icon={<CheckOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptInvite(notification._id, notification.data.tripId);
                      }}
                    />
                    <Button
                      type="link"
                      icon={<CloseOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRejectInvite(notification._id);
                      }}
                    />
                  </div>
                )}
              </Menu.Item>
            ))
          ) : (
            <Menu.Item key="no-notifications">Nessuna nuova notifica</Menu.Item>
          )}
          {notifications.length > 0 && (
            <Menu.Item key="mark-all-read" onClick={handleMarkAllAsRead}>
              Segna tutte come lette
            </Menu.Item>
          )}
        </Menu>
      </Drawer>

      <Menu mode="horizontal" className="navbar-menu">
        {user && (
          <>
            <Menu.Item key="notifications" onClick={showNotificationDrawer}>
              <BellFilled className="notification-icon" />
              {unreadCount > 0 && <Badge count={unreadCount} className="notification-badge" />}
            </Menu.Item>
            <Menu.SubMenu
              key="user"
              title={<Image src={userImage} alt="User Avatar" style={{ width: 30, height: 30, borderRadius: '50%' }} />}
            >
              <Menu.Item key="profile" onClick={() => navigate('/profile')}>
                <UserOutlined /> Profilo
              </Menu.Item>
              <Menu.Item key="logout" onClick={handleLogout}>
                <LogoutOutlined /> Logout
              </Menu.Item>
            </Menu.SubMenu>
          </>
        )}
      </Menu>
    </div>
  );
};

export default NavBar;
