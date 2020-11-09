import { Button, Form, Input, message, Modal } from 'antd';
import Axios from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from '../styles/account.module.css';
import Navbar from './navbar';
const { confirm } = Modal;

export default function Account({ userProp, router }) {
  const initialState = {
    user: userProp,
  };

  const [{ user }] = useState(initialState);

  const relinkDiscord = () => {
    confirm({
      title: 'Are you sure?',
      content: 'Your role will be removed on your previous account.',
      okButtonProps: {
        style: {
          backgroundColor: '#444444',
          border: 'none',
        },
      },
      onOk: () => {
        window.location.href = `${process.env.BACKEND_URL}/auth/discord/link`;
      },
    });
  };

  const wipeFiles = () => {
    confirm({
      title: 'Are you sure?',
      content: 'All of your files will be deleted.',
      okButtonProps: {
        style: {
          backgroundColor: '#444444',
          border: 'none',
        },
      },
      onOk: async () => {
        try {
          const { data } = await Axios.post(`${process.env.BACKEND_URL}/files/wipe`, {}, {
            withCredentials: true,
          });

          if (data.success) message.success('Wiped files successfully.');
        } catch (err) {
          message.error(err.response.data.error);
        }
      },
    });
  };

  const disableAccount = async () => {
    confirm({
      title: 'Are you sure?',
      content: 'Your account will be disabled, this action is not reversible.',
      okButtonProps: {
        style: {
          backgroundColor: '#444444',
          border: 'none',
        },
      },
      onOk: async () => {
        try {
          const { data } = await Axios.post(`${process.env.BACKEND_URL}/users/@me/disable`, {}, {
            withCredentials: true,
          });

          if (data.success) router.push('/');
        } catch (err) {
          message.error(err.response.data.error);
        }
      },
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Astral Settings</title>
      </Head>

      <Navbar enabled="account" user={user} />

      <div className={styles.accountPage}>
        <div className={styles.section}>
          <h1 className={styles.title}>Account</h1>
          <Form
            layout="vertical"
            name="basic"
            initialValues={{ remember: true }}
          >
            <Form.Item
              className={styles.accountInput}
              label="Username"
              name="username"
            >
              <Input disabled style={{
                backgroundColor: 'transparent',
              }} placeholder={user.username} />
            </Form.Item>

            <Form.Item
              className={styles.accountInput}
              label="UID"
              name="uid"
            >
              <Input disabled style={{
                backgroundColor: 'transparent',
              }} placeholder={user._id} />
            </Form.Item>

            <Form.Item
              className={styles.accountInput}
              label="Discord ID"
              name="discordId"
            >
              <Input disabled style={{
                backgroundColor: 'transparent',
              }} placeholder={user.discord.id} />
            </Form.Item>

            <Form.Item
              className={styles.accountInput}
              label="Current Domain"
              name="currentDomain"
            >
              <Input disabled style={{
                backgroundColor: 'transparent',
              }} placeholder={user.settings.domain.subdomain !== null && user.settings.domain.subdomain !== '' ? `${user.settings.domain.subdomain}.${user.settings.domain.name}` : user.settings.domain.name} />
            </Form.Item>

            <Form.Item
              className={styles.accountInput}
              label="Invites"
              name="invites"
            >
              <Input disabled style={{
                backgroundColor: 'transparent',
              }} placeholder={user.invites} />
            </Form.Item>

            <Form.Item
              className={styles.accountInput}
              label="Invited By"
              name="invitedBy"
            >
              <Input disabled style={{
                backgroundColor: 'transparent',
              }} placeholder={user.invitedBy} />
            </Form.Item>

            <Form.Item
              className={styles.accountInput}
              label="Invited Users"
              name="invitedUsers"
            >
              <Input disabled style={{
                backgroundColor: 'transparent',
              }} placeholder={user.invitedUsers.length !== 0 ? user.invitedUsers.join(', ') : 'None'} />
            </Form.Item>

            <Form.Item
              className={styles.accountInput}
              label="Registration Date"
              name="registrationDate"
            >
              <Input disabled style={{
                backgroundColor: 'transparent',
              }} placeholder={user.registrationDate} />
            </Form.Item>
          </Form>

          <div className={styles.btnContainer}>
            <Button
              className={styles.btn}
              size="large"
              onClick={relinkDiscord}
            >
              <span style={{
                fontSize: '14px',
                paddingBottom: '4px',
              }}>Relink Discord</span>
            </Button>

            <Button
              className={styles.btn}
              size="large"
              onClick={wipeFiles}
            >
              <span style={{
                fontSize: '14px',
                paddingBottom: '4px',
              }}>Wipe Files</span>
            </Button>

            <Button
              className={styles.btn}
              size="large"
              onClick={disableAccount}
            >
              <span style={{
                fontSize: '14px',
                paddingBottom: '4px',
              }}>Disable Account</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
