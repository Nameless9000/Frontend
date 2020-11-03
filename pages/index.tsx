import { useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import Head from 'next/head';
import styles from '../styles/main.module.css';
import Axios from 'axios';

const initialState = {
  showLogin: false,
  showRegister: false,
  username: '',
  password: '',
  email: '',
  invite: '',
};

export default function Home() {
  const [{ showLogin, showRegister, username, password, email, invite }, setState] = useState(initialState);

  const toggleModal = () => {
    setState((state) => ({ ...state, showLogin: true }));
  };

  const closeModal = () => {
    setState((state) => ({ ...state, showLogin: false }));
  };

  const setInput = (property: string, val: string) => {
    setState((state) => ({ ...state, [property]: val }));
  };

  const resetForm = () => {
    setState({ ...initialState });
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
          <Button style={{ marginRight: '5px' }} onClick={toggleModal}>Login</Button>
          <Button>Register</Button>
        </div>

        <Modal
          title="Login"
          visible={showLogin}
          centered
          onCancel={closeModal}
          footer={null}
        >
          <Form
            name="basic"
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please provide a valid username.' }]}
            >
              <Input onChange={(val) => setInput('username', val.target.value)} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please provide a valid password.', min: 5 }]}
            >
              <Input.Password onChange={(val) => setInput('password', val.target.value)} />
            </Form.Item>

            <Form.Item style={{ marginBottom: '0px', marginTop: '10px' }}>
              <Button type="ghost" block onClick={login}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </main>
    </div>
  );
}
