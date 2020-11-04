/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Form, Input, Button, Modal, Tabs } from 'antd';
import styles from '../styles/main.module.css';
import Head from 'next/head';
import { UserOutlined, LockOutlined, MailOutlined, CheckOutlined } from '@ant-design/icons';
import Axios from 'axios';
const { TabPane } = Tabs;
import { SiDiscord } from 'react-icons/si';

const initialState = {
  showModal: false,
  username: '',
  password: '',
  email: '',
  invite: '',
};

export default function Home() {
  const [{ showModal, username, password, email, invite }, setState] = useState(initialState);

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
    try {
      const res = await Axios.post('https://api.astral.cool/auth/login', {
        username,
        password,
      });

      console.log(res);
    } catch (err) {
      console.log(err);
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
        </div>

        <Modal
          title={<Tabs defaultActiveKey="1" centered type="card">
            <TabPane tab="Login" key="1">
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

                <Form.Item>
                  <Button block size="large">
                    Login
                  </Button>
                  <Button icon={<SiDiscord style={{ marginRight: '8px' }} />} type="primary" block size="large" style={{ marginTop: '10px', marginBottom: '-35px', backgroundColor: '#7289DA', border: 'none' }}>
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
