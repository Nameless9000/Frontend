import { DownloadOutlined, PictureOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons';
import { FaSitemap } from 'react-icons/fa';
import { Button, Input, Layout, Menu, notification, Select } from 'antd';
import { useUser } from './user';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from '../styles/Settings.module.css';
import Navbar from './navbar';
import API, { APIError } from '../api';

const { Option } = Select;
const { Content, Sider } = Layout;

export default function Settings() {
    let { user, setUser } = useUser();
    const { domains, settings } = user;

    const initialState = {
        tab: 1,
        selectedDomain: {
            name: settings.domain.name,
            wildcard: domains.find((d) => d.name === settings.domain.name).wildcard || false,
            subdomain: settings.domain.subdomain !== '' && settings.domain.subdomain !== null ? settings.domain.subdomain : '',
        },
    };

    const [{ tab, selectedDomain }, setState] = useState(initialState);

    const domainSelection = (
        <Select
            showSearch
            className={styles.domainDropdown}
            defaultValue={selectedDomain.name}
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onSelect={(x) => {
                const domain = domains.find((d) => d.name === x);

                if (!domain) return notification.error({
                    message: 'Something went wrong',
                    description: 'Invalid domain selection',
                });

                setState((state) => ({ ...state, selectedDomain: { ...domain, subdomain: domain.wildcard ? '' : selectedDomain.subdomain } }));
            }}
        >
            {domains.map((d) => (
                <Option key={d.name} value={d.name}>
                    {d.name}
                </Option>
            ))}
        </Select>
    );

    const setDomain = (val: string) => {
        val = val.replace(/\W/g, '-');

        if (val.trim().length > 60) return;

        setState((state) => ({
            ...state,
            selectedDomain: {
                ...selectedDomain,
                subdomain: val,
            },
        }));
    };

    const saveDomain = async () => {
        try {
            const domain = domains.find((d) => d.name === selectedDomain.name);

            if (!domain) return notification.error({
                message: 'Something went wrong',
                description: 'Invalid domain selection',
            });

            const data = await API.saveDomain({
                domain: domain.name,
                subdomain: selectedDomain.subdomain,
            });

            if (data.success) {
                user = Object.assign({}, user);
                user.settings.domain = {
                    name: domain.name,
                    subdomain: selectedDomain.subdomain,
                };

                setUser(user);

                notification.success({
                    message: 'Success',
                    description: 'Updated domain successfully.',
                });
            }
        } catch (err) {
            if (err instanceof APIError) return notification.error({
                message: 'Something went wrong',
                description: err.message,
            });
        }
    };

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
                        <p className={styles.caption}>Your current domain is<span style={{ fontWeight: 500 }}>{' '}
                            {selectedDomain.subdomain !== '' && selectedDomain.wildcard ? `${selectedDomain.subdomain}.${selectedDomain.name}` : selectedDomain.name}
                        </span>.</p>

                        <Input
                            value={selectedDomain.subdomain !== '' && selectedDomain.wildcard ? selectedDomain.subdomain : ''}
                            placeholder={selectedDomain.wildcard ? 'Subdomain' : 'Not Available'}
                            onChange={(val) => setDomain(val.target.value)}
                            disabled={selectedDomain.wildcard === false}
                            className={styles.domainInput}
                            addonAfter={domainSelection}
                        />

                        <Button
                            className={styles.btn}
                            icon={<SaveOutlined />}
                            onClick={saveDomain}
                        >
                            Save Domain
                        </Button>
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
                            setState((state) => ({ ...state, tab: parseInt(key as string) }));
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
