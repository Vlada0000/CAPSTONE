// src/components/Trip/Sidebar.jsx
import React, { useState } from 'react';
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

  return (
    <>
      {/* Button to trigger the Drawer */}
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={showDrawer}
        className="sidebar-drawer-toggle"
      >
        Menu
      </Button>

      {/* Drawer component */}
      <Drawer
        title="Navigazione"
        placement="left"
        closable={true}
        onClose={closeDrawer}
        visible={visible}
        bodyStyle={{ padding: 0 }} // Remove extra padding inside the drawer
      >
        <Menu
          mode="inline"
          selectedKeys={[activeSection]}
          onClick={(e) => {
            setActiveSection(e.key);
            closeDrawer(); // Close the drawer when a menu item is clicked
          }}
          style={{ height: '100%' }}
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
      </Drawer>
    </>
  );
};

export default Sidebar;
