import { DownloadOutlined, PictureOutlined, SettingOutlined } from '@ant-design/icons';
import { FaSitemap } from 'react-icons/fa';
import { Button, Input, Layout, Menu } from 'antd';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from '../styles/Settings.module.css';
import Navbar from './navbar';
import { useUser } from './user';

const { Content, Sider } = Layout;
const initialState = {
    domain: {
        name: '',
        subdomain: '',
    },
};

export default function Settings() {
    const [{ domain }, setState] = useState(initialState);
    const { user } = useUser();
    const [tab, setTab] = useState(1);


    const renderTab = () => {
        switch (tab) {
            case 1:
                return <div>
                    <div className={styles.section}>
                        <h1 className={styles.title}>Config Generator</h1>
                        <p className={styles.caption}>You only need to generate one config.</p>

                        <Button
                            href={`${process.env.BACKEND_URL}/files/config?key=${user.key}`}
                            className={styles.btn}
                            icon={<DownloadOutlined style={{ paddingTop: '3px' }} />}
                        >
                            <span style={{ paddingTop: '2px' }}>
                            Download Config
                            </span>
                        </Button>
                    </div>

                    <div className={styles.section}>
                        <h1 className={styles.title}>Domain Preferences</h1>
                        <p className={styles.caption}>Your current domain is <strong>i.astral.cool</strong>.</p>

                        <Input

                        />
                    </div>
                </div>;
            case 2:
                return <h1>embed settings</h1>;
            case 3:
                return <h1>domain settings</h1>;
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Astral Settings</title>
            </Head>

            <Navbar enabled="settings" />

            <Layout className={styles.settings}>
                <Sider collapsed={true}>
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        onClick={({ key }) => {
                            setTab(parseInt(key as string));
                        }}
                    >
                        <Menu.Item key="1" icon={<SettingOutlined />}>
                            General
                        </Menu.Item>
                        <Menu.Item key="2" icon={<PictureOutlined />}>
                            Embeds
                        </Menu.Item>
                        <Menu.Item key="3" icon={<FaSitemap style={{
                            paddingTop: '4px',
                        }} />}>
                            Domains
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout className={styles.sections}>
                    <Content style={{ marginTop: '30px' }}>
                        {renderTab()}
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}
