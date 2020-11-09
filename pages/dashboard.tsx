import Axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '../styles/main.module.css';
import VerifyComponent from '../components/verify';
import DashboardComponent from '../components/dashboard';

interface InitialState {
  user: any;
  images: any,
  loading: boolean;
}

const initialState = {
  user: {},
  images: [],
  loading: true,
};

export default function Dashboard() {
  const [{ user, loading, images }, setState] = useState<InitialState>(initialState);
  const router = useRouter();

  useEffect(() => {
    Axios.get(`${process.env.BACKEND_URL}/users/@me`, {
      withCredentials: true,
    })
      .then(({ data }) => {
        Axios.get(`${process.env.BACKEND_URL}/users/${data._id}/images`, {
          withCredentials: true,
        })
          .then((res) => {
            setTimeout(() => {
              setState((state) => ({ ...state, loading: false, user: data, images: res.data.images }));
            }, 1000);
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
    <DashboardComponent userProp={user} imagesProp={images} router={router} />
  );
}
