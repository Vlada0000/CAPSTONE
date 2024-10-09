import { useState } from 'react';
import { Drawer, Menu, Button } from 'antd';
import {
  UserOutlined,
  FileOutlined,
  DollarOutlined,
  MessageOutlined,
  MenuOutlined,
} from '@ant-design/icons';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const menuItems = [
    {
      key: 'participants',
      icon: <UserOutlined />,
      label: 'Partecipanti',
    },
    {
      key: 'itineraries',
      icon: <FileOutlined />,
      label: 'Itinerari',
    },
    {
      key: 'expenses',
      icon: <DollarOutlined />,
      label: 'Spese',
    },
    {
      key: 'chat',
      icon: <MessageOutlined />,
      label: 'Chat',
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={showDrawer}
        className="sidebar-drawer-toggle"
      >
        Menu
      </Button>

      <Drawer
        title="Navigazione"
        placement="left"
        closable={true}
        onClose={closeDrawer}
        open={visible}
      >
        <Menu
          mode="inline"
          selectedKeys={[activeSection]}
          onClick={(e) => {
            setActiveSection(e.key);
            closeDrawer();
          }}
          style={{ height: '100%' }}
          items={menuItems} 
        />
      </Drawer>
    </>
  );
};

export default Sidebar;
