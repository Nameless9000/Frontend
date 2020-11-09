import Axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '../styles/main.module.css';
import VerifyComponent from '../components/verify';
import SettingsComponent from '../components/settings';

interface InitialState {
  user: any;
  domains: any;
  loading: boolean;
}

const initialState = {
  user: {},
  domains: [],
  loading: true,
};

export default function Settings() {
  const [{ user, domains, loading }, setState] = useState<InitialState>(initialState);
  const router = useRouter();

  useEffect(() => {
    Axios.get(`${process.env.BACKEND_URL}/users/@me`, {
      withCredentials: true,
    })
      .then(({ data }) => {
        Axios.get(`${process.env.BACKEND_URL}/domains`)
          .then((domains) => {
            setTimeout(() => {
              setState((state) => ({ ...state, loading: false, user: data, domains: domains.data.domains }));
            }, (1000));
          });
      })
      .catch(() => {
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
    <SettingsComponent userProp={user} domainsProp={domains} router={router} />
  );
}
