import { useState, useEffect } from 'react';
import { Layout, Menu, Spin, message, Drawer, Button, Modal } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LockOutlined,
  LogoutOutlined,
  LineChartOutlined,
  MenuOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../context/authContext';
import {
  getLoggedInUserProfile,
  updateUserProfile,
  uploadProfileImage,
  updateUserPassword,
  getUserTrips,
  deleteUserProfile,
} from '../../../api/userApi';
import Dashboard from '../Dashboard/Dashboard';
import EditProfileForm from '../Profile-Form/EditProfileForm';
import PasswordChangeForm from '../Profile-Form/PasswordChangeForm';
import moment from 'moment';
import defaultImage from '../../../assets/images/user.jpg';
import './Profile.css';

const { Sider, Content } = Layout;
const { confirm } = Modal;

const Profile = () => {
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
  const [drawerVisible, setDrawerVisible] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getLoggedInUserProfile(token);
        setProfileData({
          name: data.name,
          surname: data.surname,
          email: data.email,
          birthdate: data.birthdate ? moment(data.birthdate).format('YYYY-MM-DD') : '',
          profileImage: data.profileImage || defaultImage,
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
      const formattedBirthdate = profileData.birthdate
        ? moment(profileData.birthdate).format('YYYY-MM-DD')
        : '';
      const updatedProfile = {
        name: profileData.name,
        surname: profileData.surname,
        email: profileData.email,
        birthdate: formattedBirthdate,
      };
      await updateUserProfile(updatedProfile, token);
      setUser((prevUser) => ({ ...prevUser, ...updatedProfile }));
      message.success('Profilo aggiornato con successo!');
    } catch (error) {
      console.error("Errore durante l'aggiornamento del profilo:", error);
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

  const handleDeleteProfile = async () => {
    try {
      await deleteUserProfile(token);
      message.success('Profilo cancellato con successo!');
      logout();
    } catch (error) {
      message.error('Errore durante la cancellazione del profilo');
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Sei sicuro di voler cancellare il tuo profilo?',
      icon: <ExclamationCircleOutlined />,
      content: 'Questa azione è irreversibile. Il tuo profilo sarà cancellato definitivamente.',
      okText: 'Sì, cancella',
      okType: 'danger',
      cancelText: 'Annulla',
      onOk: handleDeleteProfile,
    });
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <LineChartOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'edit-profile',
      icon: <UserOutlined />,
      label: 'Modifica Profilo',
    },
    {
      key: 'change-password',
      icon: <LockOutlined />,
      label: 'Cambia Password',
    },
    {
      key: 'delete-profile',
      icon: <SettingOutlined />,
      label: 'Cancella Profilo',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ];

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
        trigger={null}
      >
        <div className="profile-sider-header">
          <img
            src={profileData.profileImage || defaultImage}
            className="profile-sider-avatar"
            alt="User Avatar"
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
            if (key === 'delete-profile') {
              showDeleteConfirm();
            } else {
              setSelectedMenuKey(key);
            }
          }}
          items={menuItems}
        />
      </Sider>

      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={260}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          onClick={({ key }) => {
            if (key === 'delete-profile') {
              showDeleteConfirm();
            } else {
              setSelectedMenuKey(key);
              setDrawerVisible(false);
            }
          }}
          items={menuItems}
        />
      </Drawer>

      <Layout>
        <Content className="profile-content">
          <Button
            className="menu-toggle"
            icon={<MenuOutlined />}
            type="text"
            onClick={() => setDrawerVisible(true)}
          />
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Profile;
