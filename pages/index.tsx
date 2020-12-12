import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import API from '../api';
import { Button, Dropdown, Menu, Modal, Tabs, Form, Input, notification } from 'antd';
import { CheckOutlined, DownOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { SiDiscord } from 'react-icons/si';
import { useRouter } from 'next/router';
import { APIError } from '../api';

const { useForm } = Form;
const { TabPane } = Tabs;

export default function Index({ data, code }) {
    const initialState = {
        showModal: false,
        resetPasswordModal: false,
        username: '',
        password: '',
        email: '',
        invite: '',
    };

    const [{
        showModal,
        resetPasswordModal,
        username,
        password,
        email,
        invite,
    }, setState] = useState(initialState);
    const router = useRouter();
    const [form] = useForm();
    const [passwordResetForm] = useForm();

    useEffect(() => {
        if (code) {
            setState((state) => ({ ...state, invite: code, showModal: true }));
        }
    }, []);

    const menu = (
        <Menu>
            <Menu.Item>
                <a target="blank" href="https://discord.gg/astral">
                    Discord Server
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="blank" href="https://github.com/astral-cool">
                    Github Repo
                </a>
            </Menu.Item>
        </Menu>
    );

    const closeModal = () => {
        form.resetFields();
        passwordResetForm.resetFields();

        setState(() => ({
            ...initialState,
            showModal: false,
            resetPasswordModal: false,
        }));
    };

    const resetForms = () => {
        form.resetFields();

        setState(() => ({
            ...initialState,
            showModal: true,
        }));
    };

    const setInput = (property: string, val: string) => {
        setState((state) => ({
            ...state, [property]: val,
        }));
    };

    const filter = (value: any) => {
        return value.filter((v: any, i: any) => value.indexOf(v) === i);
    };

    const login = async () => {
        try {
            await form.validateFields(
                [
                    'username',
                    'password',
                ]
            );
            const data = await API.login(username, password);

            if (data.success) router.push('/dashboard');
        } catch (err) {
            if (err instanceof APIError) return notification.error({
                message: 'Something went wrong',
                description: err.message,
            });

            notification.error({
                message: 'Provide the required fields',
                description: filter(err.errorFields.map((e: any) => e.errors.join())).join(', ') + '.',
            });
        }
    };

    const register = async () => {
        try {
            await form.validateFields();
            const data = await API.register(username, password, email, invite);

            if (data.success) notification.success({
                message: 'Success',
                description: 'Registered successfully, check your email to verify.',
            });
        } catch (err) {
            if (err instanceof APIError) return notification.error({
                message: 'Something went wrong',
                description: err.message,
            });

            notification.error({
                message: 'Provide the required fields',
                description: filter(err.errorFields.map((e: any) => e.errors.join())).join(', ') + '.',
            });
        }
    };

    const resetPassword = async () => {
        try {
            await passwordResetForm.validateFields();
            const data = await API.resetPassword(email);

            if (data.success) notification.success({
                message: 'Success',
                description: 'If a user exist with that email we\'ll send over the password reset instructions.',
            });
        } catch (err) {
            if (err instanceof APIError) return notification.error({
                message: 'Something went wrong',
                description: err.message,
            });

            notification.error({
                message: 'Provide the required fields',
                description: filter(err.errorFields.map((e: any) => e.errors.join())).join(', ') + '.',
            });
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Astral</title>
                <meta name="og:title" content="Astral, private file host."/>
                <meta name="og:description" content="Astral is a simple and powerful file hosting platform, with great support, competent developers, and a welcoming community."/>
                <meta name="theme-color" content="#e6394a" />
            </Head>

            <main className={styles.main}>
                <h1 style={{ color: 'white' }}>astral.cool</h1>

                <p style={{ fontSize: '20px', marginTop: '-18px' }}>
                    &quot;{data.testimonial}&quot; <strong style={{ fontWeight: 500 }}>- {data.user}</strong>
                </p>

                <div style={{ marginTop: '-10px' }}>
                    <Button
                        style={{ marginRight: '5px' }}
                        onClick={() => setState((state) => ({ ...state, showModal: true }))}
                    >
                        Login/Register
                    </Button>

                    <Dropdown overlay={menu}>
                        <Button style={{ marginRight: '5px' }}>
                            More Stuff <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>

                <Modal
                    centered
                    className="authModal"
                    visible={showModal}
                    onCancel={closeModal}
                    footer={null}
                    title={
                        <Tabs
                            centered
                            defaultActiveKey={code ? '2' : '1'}
                            type="card"
                            onTabClick={resetForms}
                        >
                            <TabPane tab="Login" key="1">
                                <Form
                                    form={form}
                                    name="login"
                                    style={{ marginTop: '10px' }}
                                >
                                    <Form.Item
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Provide a valid username',
                                                min: 3,
                                            },
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            onPressEnter={login}
                                            placeholder="Username"
                                            prefix={<UserOutlined />}
                                            onChange={(val) => setInput('username', val.target.value)}
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
                                            size="large"
                                            onPressEnter={login}
                                            placeholder="Password"
                                            prefix={<LockOutlined />}
                                            onChange={(val) => setInput('password', val.target.value)}
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="link"
                                            className={styles.forgotPassword}
                                            onClick={() => setState((state) => ({ ...state, showModal: false, resetPasswordModal: true }))}
                                        >
                                            Forgot your password? Reset
                                        </Button>

                                        <Button
                                            block
                                            size="large"
                                            onClick={login}
                                        >
                                            Login
                                        </Button>

                                        <Button
                                            href={`${process.env.BACKEND_URL}/auth/discord/login`}
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
                                    name="login"
                                    style={{ marginTop: '10px' }}
                                >
                                    <Form.Item
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Provide a valid username',
                                                min: 3,
                                            },
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Username"
                                            onPressEnter={register}
                                            prefix={<UserOutlined />}
                                            onChange={(val) => setInput('username', val.target.value)}
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
                                            size="large"
                                            placeholder="Password"
                                            onPressEnter={register}
                                            prefix={<LockOutlined />}
                                            onChange={(val) => setInput('password', val.target.value)}
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
                                            size="large"
                                            placeholder="Email"
                                            onPressEnter={register}
                                            prefix={<MailOutlined />}
                                            onChange={(val) => setInput('email', val.target.value)}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="invite"
                                        rules={[
                                            { required: true, message: 'Provide a valid invite' },
                                        ]}
                                        initialValue={invite ? invite : ''}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Invite"
                                            onPressEnter={register}
                                            prefix={<CheckOutlined />}
                                            onChange={(val) => setInput('invite', val.target.value)}
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            block
                                            size="large"
                                            onClick={register}
                                            style={{ marginBottom: '-30px' }}
                                        >
                                            Register
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                        </Tabs>
                    }
                />

                <Modal
                    centered
                    title="Reset your password"
                    visible={resetPasswordModal}
                    onCancel={closeModal}
                    footer={null}
                >
                    <Form
                        form={passwordResetForm}
                    >
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
                                size="large"
                                placeholder="Email"
                                onPressEnter={resetPassword}
                                prefix={<MailOutlined />}
                                onChange={(val) => setInput('email', val.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            style={{ marginBottom: '5px' }}>
                            <Button
                                block
                                size="large"
                                onClick={resetPassword}
                            >
                                Reset Password
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </main>
        </div>
    );
}

export async function getServerSideProps({ query }) {
    const { code } = query;
    const data = await API.getTestimonial();

    return {
        props: {
            data: {
                user: data.user,
                testimonial: data.testimonial,
            },
            code: code ? code : null,
        },
    };
}
