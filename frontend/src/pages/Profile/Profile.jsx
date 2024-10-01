import React, { useState, useEffect } from 'react';
import { Layout, Menu, Spin, message } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LockOutlined,
  LogoutOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/authContext';
import {
  getLoggedInUserProfile,
  updateUserProfile,
  uploadProfileImage,
  updateUserPassword,
  getUserTrips,
} from '../../api/userApi';
import Dashboard from '../Profile/Dashboard';
import EditProfileForm from '../Profile/EditProfileForm';
import PasswordChangeForm from '../Profile/PasswordChangeForm';
import './Profile.css';

const { Sider, Content } = Layout;

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    surname: '',
    email: '',
    birthdate: '',
    profileImage: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [trips, setTrips] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenuKey, setSelectedMenuKey] = useState('dashboard');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getLoggedInUserProfile(token);
        setProfileData({
          name: data.name,
          surname: data.surname,
          email: data.email,
          birthdate: data.birthdate || '',
          profileImage: data.profileImage || '/default-profile.png',
        });
        const tripsData = await getUserTrips(token);
        setTrips(tripsData);
      } catch (error) {
        message.error('Errore nel recupero del profilo');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = ({ file }) => {
    setFile(file);
  };

  const handleSaveChanges = async () => {
    try {
      await updateUserProfile(
        {
          name: profileData.name,
          surname: profileData.surname,
          email: profileData.email,
          birthdate: profileData.birthdate,
        },
        token
      );
      setUser((prevUser) => ({ ...prevUser, ...profileData }));
      message.success('Profilo aggiornato con successo!');
    } catch (error) {
      message.error('Aggiornamento del profilo non riuscito');
    }
  };

  const handleUploadImage = async () => {
    if (!file) {
      message.error('Seleziona un file da caricare.');
      return;
    }
    try {
      const result = await uploadProfileImage(file, token);
      setProfileData((prevData) => ({
        ...prevData,
        profileImage: result.user.profileImage,
      }));
      message.success('Immagine del profilo aggiornata con successo!');
    } catch (error) {
      message.error("Errore durante il caricamento dell'immagine");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await updateUserPassword(passwordData, token);
      setPasswordData({ oldPassword: '', newPassword: '' });
      message.success('Password modificata con successo!');
    } catch (error) {
      message.error('Errore durante la modifica della password');
    }
  };

  const renderContent = () => {
    switch (selectedMenuKey) {
      case 'dashboard':
        return (
          <Dashboard
            profileData={profileData}
            trips={trips}
            handleFileChange={handleFileChange}
            handleUploadImage={handleUploadImage}
          />
        );
      case 'edit-profile':
        return (
          <EditProfileForm
            profileData={profileData}
            handleInputChange={handleInputChange}
            handleSaveChanges={handleSaveChanges}
          />
        );
      case 'change-password':
        return (
          <PasswordChangeForm
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            handlePasswordChange={handlePasswordChange}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="profile-layout">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className="profile-sider"
        width={260}
      >
        <div className="profile-sider-header">
          <img
            src={profileData.profileImage}
            alt="Profile"
            className="profile-sider-avatar"
          />
          <h2 className="profile-sider-name">
            {profileData.name} {profileData.surname}
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          onClick={({ key }) => {
            if (key === 'logout') {
              logout();
            } else {
              setSelectedMenuKey(key);
            }
          }}
        >
          <Menu.Item key="dashboard" icon={<LineChartOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="edit-profile" icon={<UserOutlined />}>
            Modifica Profilo
          </Menu.Item>
          <Menu.Item key="change-password" icon={<LockOutlined />}>
            Cambia Password
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content className="profile-content">{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default ProfilePage;
