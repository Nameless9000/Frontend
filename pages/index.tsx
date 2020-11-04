/* eslint-disable no-unused-vars */
import { useState } from 'react';
import Link from 'next/link';
import { Form, Input, Button, Modal, Tabs, Alert } from 'antd';
import styles from '../styles/main.module.css';
import Head from 'next/head';
import { UserOutlined, LockOutlined, MailOutlined, CheckOutlined } from '@ant-design/icons';
import Axios from 'axios';
const { TabPane } = Tabs;
import { SiDiscord } from 'react-icons/si';
import { useRouter } from 'next/router';

const initialState = {
  showModal: false,
  username: '',
  password: '',
  email: '',
  invite: '',
  error: '',
};

export default function Home() {
  const router = useRouter();
  const [{ showModal, username, password, email, invite, error }, setState] = useState(initialState);

  const toggleModal = () => {
    setState((state) => ({ ...state, showModal: true }));
  };

  const closeModal = () => {
    setState((state) => ({ ...state, showModal: false }));
  };

  const setInput = (property: string, val: string) => {
    setState((state) => ({ ...state, [property]: val }));
  };

  const login = async () => {
    if (!username || !password || password.length <= 3 || username.length <= 0)
      return setState((state) => ({ ...state, error: 'Fill out all of the fields.' }));
    try {
      const { data } = await Axios.post('http://localhost:3001/auth/login', {
        username,
        password,
      }, {
        withCredentials: true,
      });

      if (!data.success)
        return setState((state) => ({ ...state, error: data.message }));

      router.push('/dashboard');
    } catch (err) {
      setState((state) => ({ ...state, error: err.response.data.error }));
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title></title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 style={{ color: 'white' }}>astral.cool</h1>
        <p style={{ fontSize: '20px', marginTop: '-20px' }}>private invite-only image host.</p>
        <div style={{ marginTop: '-10px' }}>
          <Button style={{ marginRight: '5px' }} onClick={toggleModal}>Login/Register</Button>
          <Button style={{ marginRight: '5px' }} href="https://discord.gg/NkE9uVJ6Ww" target="blank">Discord Server</Button>
        </div>

        <Modal
          title={<Tabs defaultActiveKey="1" centered type="card">
            <TabPane tab="Login" key="1">
              <Form
                name="basic"
                initialValues={{ remember: true }}
                style={{ marginTop: '10px' }}
              >
                {error !== '' && <Alert style={{ marginBottom: '20px' }} type="error" message={error} />}
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Provide a valid username' }]}
                >
                  <Input onChange={(val) => setInput('username', val.target.value)} size="large" placeholder="Username" prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Provide a valid password', min: 5 }]}
                >
                  <Input.Password onChange={(val) => setInput('password', val.target.value)} size="large" placeholder="Password" prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item>
                  <Button onClick={login} block size="large">
                    Login
                  </Button>
                  <Button href="https://api.astral.cool/auth/login/discord" icon={<SiDiscord style={{ marginRight: '8px' }} />} type="primary" block size="large" style={{ marginTop: '10px', marginBottom: '-35px', backgroundColor: '#7289DA', border: 'none' }}>
                    Login with Discord
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="Register" key="2">
              <Form
                name="basic"
                initialValues={{ remember: true }}
                style={{ marginTop: '10px' }}
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Provide a valid username' }]}
                >
                  <Input size="large" placeholder="Username" prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Provide a valid password', min: 5 }]}
                >
                  <Input.Password size="large" placeholder="Password" prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Provide a valid email', type: 'email' }]}
                >
                  <Input size="large" placeholder="Email" prefix={<MailOutlined />} />
                </Form.Item>

                <Form.Item
                  name="invite"
                  rules={[{ required: true, message: 'Provide a valid invite' }]}
                >
                  <Input size="large" placeholder="Invite" prefix={<CheckOutlined />} />
                </Form.Item>

                <Form.Item>
                  <Button block size="large" style={{ marginBottom: '-30px' }}>
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>}
          visible={showModal}
          centered
          onCancel={closeModal}
          footer={null}
        >

        </Modal>
      </main>
    </div>
  );
}
