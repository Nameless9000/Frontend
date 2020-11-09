import Axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '../styles/main.module.css';
import VerifyComponent from '../components/verify';
import AccountComponent from '../components/account';

interface InitialState {
  user: any;
  loading: boolean;
}

const initialState = {
  user: {},
  loading: true,
};

export default function Account() {
  const [{ user, loading }, setState] = useState<InitialState>(initialState);
  const router = useRouter();

  useEffect(() => {
    Axios.get(`${process.env.BACKEND_URL}/users/@me`, {
      withCredentials: true,
    })
      .then(({ data }) => {
        setTimeout(() => {
          setState((state) => ({ ...state, loading: false, user: data }));
        }, 1000);
      }).catch(() => {
        router.push('/');
      });
  }, []);

  const spinner = (
    <LoadingOutlined style={{ fontSize: 40, color: 'white' }} spin />
  );

  if (loading)
    return (
      <div className={styles.container}>
        <Spin indicator={spinner} />
      </div>
    );

  return user.discord.id === null ? (
    <VerifyComponent />
  ) : (
    <AccountComponent userProp={user} router={router} />
  );
}
