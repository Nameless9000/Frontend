import { LogoutOutlined } from '@ant-design/icons';
import { SiDiscord } from 'react-icons/si';
import { Button } from 'antd';
import React from 'react';
import styles from '../styles/main.module.css';
import Axios from 'axios';
import { useRouter } from 'next/router';

export default function Verify() {
  const router = useRouter();

  const logout = () => {
    Axios.get(`${process.env.BACKEND_URL}/auth/logout`, {
      withCredentials: true,
    })
      .then(() => {
        router.push('/');
      })
      .catch(() => {
        router.push('/');
      });
  };

  return (
    <div className={styles.container} style={{ textAlign: 'center' }}>
      <h2>Thank you for registering, just one last step!</h2>
      <p style={{ fontSize: '20px', marginTop: '-5px' }}>
        Please link your Discord account to Astral, this is to verify your
        identity & join the Discord server.
      </p>

      <div style={{ marginTop: '-2px' }}>
        <Button
          icon={
            <SiDiscord style={{ marginRight: '8px', marginBottom: '-2.5px' }} />
          }
          href={`${process.env.BACKEND_URL}/auth/discord/link`}
          style={{
            marginRight: '5px',
            marginTop: '-10px',
            backgroundColor: '#7289DA',
            border: 'none',
          }}
          size="large"
          type="primary"
        >
          Link account
        </Button>
        <Button
          size="large"
          icon={<LogoutOutlined />}
          onClick={logout}
          style={{ marginRight: '5px' }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
