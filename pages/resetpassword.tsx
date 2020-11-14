import { LockOutlined, RedoOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from '../styles/resetpassword.module.css';

export default function ResetPassword({ query, valid }) {
  const initialState = {
    password: '',
    confirmPassword: '',
    error: '',
  };

  const [{ password, confirmPassword, error }, setState] = useState(initialState);
  const router = useRouter();
  const [form] = useForm();

  const setInput = (property: string, val: string) => {
    setState((state) => ({ ...state, [property]: val }));
  };

  const resetPassword = async () => {
    if (!password || !confirmPassword || password.length < 5 || confirmPassword.length < 5)
      return setState((state) => ({ ...state, error: 'Password must be 5 characters long' }));

    if (confirmPassword !== password)
      return setState((state) => ({ ...state, error: 'Confirmation must match the password' }));

    try {
      const { data } = await Axios.post(`${process.env.BACKEND_URL}/auth/resetpassword`, {
        key: query,
        password,
        confirmPassword,
      });

      if (data.success)
        router.push('/');
    } catch (err) {
      setState((state) => ({ ...state, error: err.response.data.error || 'Something went wrong' }));
    }
  };

  return !valid ? <h1>invalid key</h1> : (
    <div className={styles.container}>
      <main className={styles.main}>
        <Form form={form}>
          {error !== '' && (
            <Alert
              style={{ marginBottom: '20px' }}
              type="error"
              message={error}
            />
          )}

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
              onChange={(val) => setInput('password', val.target.value)}
              size="large"
              placeholder="New Password"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: 'Provide a valid confirmation',
                min: 5,
              },
            ]}
          >
            <Input.Password
              onChange={(val) => setInput('confirmPassword', val.target.value)}
              size="large"
              placeholder="Confirm Password"
              prefix={<RedoOutlined />}
            />
          </Form.Item>

          <Button block size="large" onClick={resetPassword}>
            Reset Password
          </Button>
        </Form>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: { query: { key: string; }; }) {
  let valid = true;

  try {
    await Axios.get(`${process.env.BACKEND_URL}/auth/passwordresets/${context.query.key}`);
  } catch (err) {
    valid = false;
  }

  return {
    props: {
      valid,
      query: context.query.key,
    },
  };
};
