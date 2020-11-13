import { useEffect, useState } from 'react';
import { Form, Input, Button, Modal, Tabs, Alert, Spin } from 'antd';
import styles from '../styles/main.module.css';
import Head from 'next/head';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  CheckOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import Axios from 'axios';
const { TabPane } = Tabs;
import { SiDiscord } from 'react-icons/si';
import { useRouter } from 'next/router';
import { useForm } from 'antd/lib/form/Form';

const initialState = {
  showModal: false,
  username: '',
  password: '',
  email: '',
  invite: '',
  error: '',
  message: '',
  resetModal: false,
  loading: true,
};

export default function Home() {
  const [
    { showModal, username, password, email, invite, error, message, resetModal, loading },
    setState,
  ] = useState(initialState);
  const router = useRouter();
  const [form] = useForm();
  const [resetPasswordForm] = useForm();

  useEffect(() => {
    Axios.get(`${process.env.BACKEND_URL}/users/@me`, {
      withCredentials: true,
    })
      .then(() => {
        router.push('/dashboard');
      })
      .catch(() => {
        setTimeout(() => {
          setState((state) => ({ ...state, loading: false }));
        }, 1000);
      });
  }, []);

  const toggleModal = () => {
    setState((state) => ({ ...state, showModal: true }));
  };

  const closeModal = () => {
    form.resetFields();
    resetPasswordForm.resetFields();
    setState(() => ({
      ...initialState,
      loading: false,
      showModal: false,
      resetModal: false,
      error: '',
      message: '',
    }));
  };

  const setInput = (property: string, val: string) => {
    setState((state) => ({ ...state, [property]: val }));
  };

  const resetMessages = () => {
    form.resetFields();
    setState(() => ({
      ...initialState,
      error: '',
      message: '',
      showModal: true,
      loading: false,
    }));
  };

  const login = async () => {
    if (!username || !password || password.length <= 3 || username.length <= 0)
      return setState((state) => ({
        ...state,
        error: 'Fill out all of the fields.',
      }));
    try {
      const { data } = await Axios.post(
        `${process.env.BACKEND_URL}/auth/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (!data.success)
        return setState((state) => ({ ...state, error: data.message }));

      router.push('/dashboard');
    } catch (err) {
      setState((state) => ({ ...state, error: err.response.data.error }));
    }
  };

  const register = async () => {
    if (
      !username ||
      !password ||
      !email ||
      !invite ||
      password.length <= 3 ||
      username.length <= 0 ||
      email.length <= 0 ||
      invite.length <= 0
    )
      return setState((state) => ({
        ...state,
        error: 'Fill out all of the fields.',
      }));
    try {
      const { data } = await Axios.post(
        `${process.env.BACKEND_URL}/auth/register`,
        {
          username,
          password,
          email,
          invite,
        },
        {
          withCredentials: true,
        }
      );

      if (!data.success)
        return setState((state) => ({ ...state, error: data.message }));

      setState((state) => ({ ...state, message: data.message }));
    } catch (err) {
      setState((state) => ({ ...state, error: err.response.data.error }));
    }
  };

  const resetPassword = async () => {
    if (!email || email.length <= 0)
      return setState((state) => ({ ...state, error: 'Provide an email' }));

    setState((state) => ({ ...state, error: '' }));

    try {
      const { data }= await Axios.post(`${process.env.BACKEND_URL}/auth/sendpasswordreset`, {
        email,
      });

      if (!data.success)
        return setState((state) => ({ ...state, error: data.message }));

      setState((state) => ({ ...state, message: data.message }));
    } catch (err) {
      setState((state) => ({ ...state, error: err.response.data.error }));
    }
  };

  const spinner = (
    <LoadingOutlined style={{ fontSize: 40, color: 'white' }} spin />
  );

  if (loading)
    return (
      <div className={styles.container}>
        <Spin indicator={spinner} />
      </div>
    );

  return (
    <div className={styles.container}>
      <Head>
        <title>Astral</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Astral, private image hosting." />
        <meta
          property="og:description"
          content="Astral is a simple and powerful image hosting platform, with great support, competent developers, and a welcoming community."
        />
        <meta name="theme-color" content="#e6394a" />
      </Head>

      <main className={styles.main}>
        <h1 style={{ color: 'white' }}>astral.cool</h1>
        <p style={{ fontSize: '20px', marginTop: '-20px' }}>
          private invite-only image host.
        </p>
        <div style={{ marginTop: '-10px' }}>
          <Button style={{ marginRight: '5px' }} onClick={toggleModal}>
            Login/Register
          </Button>
          <Button
            style={{ marginRight: '5px' }}
            href="https://discord.gg/NkE9uVJ6Ww"
            target="blank"
          >
            Discord Server
          </Button>
        </div>

        <Modal
          className="loginModal"
          title={
            <Tabs
              defaultActiveKey="1"
              centered
              type="card"
              onTabClick={resetMessages}
            >
              <TabPane tab="Login" key="1">
                <Form
                  form={form}
                  name="basic"
                  initialValues={{ remember: true }}
                  style={{ marginTop: '10px' }}
                >
                  {error !== '' && (
                    <Alert
                      style={{ marginBottom: '20px' }}
                      type="error"
                      message={error}
                    />
                  )}
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: 'Provide a valid username' },
                    ]}
                  >
                    <Input
                      onPressEnter={login}
                      onChange={(val) => setInput('username', val.target.value)}
                      size="large"
                      placeholder="Username"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Provide a valid password',
                        min: 5,
                      },
                    ]}
                  >
                    <Input.Password
                      onPressEnter={login}
                      onChange={(val) => setInput('password', val.target.value)}
                      size="large"
                      placeholder="Password"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      onClick={() =>
                        setState((state) => ({ ...state, showModal: false, resetModal: true }))
                      }
                      type="link"
                      className={styles.forgotPassword}
                    >
                      Forgot your password? Reset
                    </Button>
                    <Button onClick={login} block size="large">
                      Login
                    </Button>
                    <Button
                      href={`${process.env.BACKEND_URL}/auth/login/discord`}
                      icon={<SiDiscord style={{ marginRight: '8px' }} />}
                      type="primary"
                      block
                      size="large"
                      style={{
                        marginTop: '10px',
                        marginBottom: '-35px',
                        backgroundColor: '#7289DA',
                        border: 'none',
                      }}
                    >
                      Login with Discord
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="Register" key="2">
                <Form
                  form={form}
                  name="basic"
                  initialValues={{ remember: true }}
                  style={{ marginTop: '10px' }}
                >
                  {error !== '' && (
                    <Alert
                      style={{ marginBottom: '20px' }}
                      type="error"
                      message={error}
                    />
                  )}
                  {message !== '' && (
                    <Alert
                      style={{ marginBottom: '20px' }}
                      type="success"
                      message={message}
                    />
                  )}
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: 'Provide a valid username' },
                    ]}
                  >
                    <Input
                      onPressEnter={register}
                      onChange={(val) => setInput('username', val.target.value)}
                      size="large"
                      placeholder="Username"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Provide a valid password',
                        min: 5,
                        type: 'string',
                      },
                    ]}
                  >
                    <Input.Password
                      onPressEnter={register}
                      onChange={(val) => setInput('password', val.target.value)}
                      size="large"
                      placeholder="Password"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Provide a valid email',
                        type: 'email',
                      },
                    ]}
                  >
                    <Input
                      onPressEnter={register}
                      size="large"
                      onChange={(val) => setInput('email', val.target.value)}
                      placeholder="Email"
                      prefix={<MailOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="invite"
                    rules={[
                      { required: true, message: 'Provide a valid invite' },
                    ]}
                  >
                    <Input
                      onPressEnter={register}
                      size="large"
                      onChange={(val) => setInput('invite', val.target.value)}
                      placeholder="Invite"
                      prefix={<CheckOutlined />}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      onClick={register}
                      block
                      size="large"
                      style={{ marginBottom: '-30px' }}
                    >
                      Register
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          }
          visible={showModal}
          centered
          onCancel={closeModal}
          footer={null}
        />

        <Modal
          visible={resetModal}
          centered
          title="Reset your password"
          onCancel={closeModal}
          footer={null}
        >
          <Form
            form={resetPasswordForm}
          >
            {error !== '' && (
              <Alert
                style={{ marginBottom: '20px' }}
                type="error"
                message={error}
              />
            )}

            {message !== '' && (
              <Alert
                style={{ marginBottom: '20px' }}
                type="success"
                message={message}
              />
            )}

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Provide a valid email', type: 'email' },
              ]}
            >
              <Input
                onPressEnter={resetPassword}
                onChange={(val) => setInput('email', val.target.value)}
                prefix={<MailOutlined />}
                size="large"
                type="email"
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: '5px' }}>
              <Button
                onClick={resetPassword}
                block
                size="large"
              >
                Send Email
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </main>
    </div>
  );
}
