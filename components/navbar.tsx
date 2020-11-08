import { Button, Drawer, Dropdown } from 'antd';
import React, { useState } from 'react';
import styles from '../styles/navbar.module.css';
import { Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Axios from 'axios';
import {
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  ToolOutlined,
  UploadOutlined
} from '@ant-design/icons';

export default function Navbar({ user, enabled }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const logout = () => {
    Axios.get('http://localhost:3001/auth/logout', {
      withCredentials: true,
    })
      .then(() => {
        router.push('/');
      })
      .catch(() => {
        router.push('/');
      });
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Button
          icon={<ToolOutlined style={{ fontSize: '14px' }} />}
          style={{ border: 'none' }}
        >
          Account
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          icon={<LogoutOutlined style={{ fontSize: '14px' }} />}
          style={{ border: 'none' }}
          onClick={logout}
        >
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className={styles.menuBar}>
      <div className={styles.logo}>
        <img src="/logo.png" height="50px" className={styles.logoImage} />
      </div>
      <div className={styles.menuCon}>
        <div className={styles.leftMenu}>
          <Link href="/dashboard">
            <Button
              className={`${styles.navButton} ${
                enabled === 'home' && styles.navButtonActive
              }`}
              icon={<HomeOutlined style={{ fontSize: '14px' }} />}
            >
              Home
            </Button>
          </Link>
          <Link href="/settings">
            <Button
              className={`${styles.navButton} ${
                enabled === 'settings' && styles.navButtonActive
              }`}
              icon={<SettingOutlined style={{ fontSize: '14px' }} />}
            >
              Settings
            </Button>
          </Link>
          <Link href="/upload">
            <Button
              className={`${styles.navButton} ${
                enabled === 'upload' && styles.navButtonActive
              }`}
              icon={<UploadOutlined style={{ fontSize: '14px' }} />}
            >
              Upload
            </Button>
          </Link>
        </div>
        <div className={styles.rightMenu}>
          <Dropdown overlay={menu} placement="bottomCenter">
            <Button className={styles.logoutButton} type="primary">
              <img
                src={user.discord.avatar}
                height="25px"
                style={{
                  marginRight: '10px',
                  borderRadius: '5px',
                  marginBottom: '2px',
                }}
              />
              <span
                style={{
                  fontSize: '16px',
                  marginRight: '3px',
                  marginTop: '1.5px',
                }}
              >
                {user.username}
              </span>
            </Button>
          </Dropdown>
        </div>
        <Button className={styles.barsMenu} type="primary" onClick={showDrawer}>
          <span className={styles.barsBtn} />
        </Button>
        <Drawer
          title={`Welcome ${user.username}.`}
          placement="right"
          closable={false}
          onClose={closeDrawer}
          visible={visible}
        >
          <Menu style={{ backgroundColor: '#1f1f1f', border: 'none' }}>
            <Menu.Item
              style={
                enabled === 'home' && {
                  backgroundColor: '#444444',
                  borderRadius: '10px',
                }
              }
            >
              <Link href="/dashboard">
                <span>
                  <HomeOutlined style={{ fontSize: '14px' }} />
                  Home
                </span>
              </Link>
            </Menu.Item>
            <Menu.Item
              style={
                enabled === 'settings' && {
                  backgroundColor: '#444444',
                  borderRadius: '10px',
                }
              }
            >
              <Link href="/settings">
                <span>
                  <SettingOutlined style={{ fontSize: '14px' }} />
                  Settings
                </span>
              </Link>
            </Menu.Item>
            <Menu.Item
              style={
                enabled === 'upload' && {
                  backgroundColor: '#444444',
                  borderRadius: '10px',
                }
              }
            >
              <Link href="/upload">
                <span>
                  <UploadOutlined style={{ fontSize: '14px' }} />
                  Upload
                </span>
              </Link>
            </Menu.Item>
          </Menu>

          <Menu style={{ backgroundColor: '#1f1f1f', border: 'none' }}>
            <Menu.Item onClick={logout}>
              <span>
                <LogoutOutlined style={{ fontSize: '14px' }} />
                Logout
              </span>
            </Menu.Item>
          </Menu>
        </Drawer>
      </div>
    </nav>
  );
}
