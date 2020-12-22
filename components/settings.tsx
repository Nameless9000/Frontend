import { DownloadOutlined, PictureOutlined, SaveOutlined, SettingOutlined, ToolOutlined } from '@ant-design/icons';
import { FaSitemap } from 'react-icons/fa';
import { Button, Input, Layout, Menu, notification, Select, Switch, Tooltip } from 'antd';
import { useUser } from './user';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from '../styles/Settings.module.css';
import Navbar from './navbar';
import API, { APIError } from '../api';
import Modal from 'antd/lib/modal/Modal';
import ms from 'ms';

const { Option } = Select;
const { Content, Sider } = Layout;

export default function Settings() {
    let { user, setUser } = useUser();
    const { domains } = user;

    const initialState = {
        tab: 1,
        selectedDomain: {
            name: domains.find((d) => d.name === user.settings.domain.name) ? user.settings.domain.name : 'i.astral.cool',
            wildcard: domains.find((d) => d.name === user.settings.domain.name) ? domains.find((d) => d.name === user.settings.domain.name).wildcard : false,
            subdomain: user.settings.domain.subdomain !== '' && user.settings.domain.subdomain !== null ? user.settings.domain.subdomain : '',
        },
        autoWipeManager: false,
    };

    const [{ tab, selectedDomain, autoWipeManager }, setState] = useState(initialState);

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

    const enable = async (property: string, value: boolean) => {
        const options = ['longUrl', 'showLink', 'invisibleUrl', 'embeds', 'autoWipe', 'randomDomain'];

        try {
            let data: any = {};

            for (const prop of options) {
                if (prop === property) data[property] = value;
            }

            data = await API.updateSettings(data);

            if (data.success) {
                user = Object.assign({}, user);

                switch (property) {
                    case 'randomDomain':
                        user.settings.randomDomain.enabled = value;
                        break;
                    case 'autoWipe':
                        user.settings.autoWipe.enabled = value;
                        break;
                    case 'embeds':
                        user.settings.embed.enabled = value;
                        break;
                    default:
                        user.settings[property] = value;
                        break;
                }

                setUser(user);

                notification.success({
                    message: 'Success',
                    description: `${value ? 'Enabled' : 'Disabled'} ${property} successfully.`,
                });
            }
        } catch (err) {
            if (err instanceof APIError) return notification.error({
                message: 'Something went wrong',
                description: err.message,
            });
        }
    };

    const setWipeInterval = async (val: number) => {
        try {
            const data = await API.setWipeInterval(val);

            if (data.success) {
                user = Object.assign({}, user);
                user.settings.autoWipe.interval = val;

                setUser(user);

                notification.success({
                    message: 'Success',
                    description: `Updated auto-wipe interval to ${val}ms.`,
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

                    <div className={styles.section}>
                        <h1 className={styles.title}>General Settings</h1>

                        <div className={styles.switchCon}>
                            <div style={{ marginRight: 20 }}>
                                <p className={`ant-statistic-title ${styles.switchCap}`}>URL Settings</p>

                                <div className={styles.switch}>
                                    <Tooltip placement="topRight" title="Long URL will make your filename 17 characters instead of 7.">
                                        <p style={{ cursor: 'pointer', marginRight: 16 }}>Long URL</p>
                                    </Tooltip>

                                    <Switch
                                        defaultChecked={user.settings.longUrl}
                                        onClick={(val) => enable('longUrl', val)}
                                        className={styles.switchChild}
                                    />
                                </div>

                                <div className={styles.switch}>
                                    <Tooltip placement="topRight" title="Show link will make your URL show up in discord.">
                                        <p style={{ cursor: 'pointer', marginRight: 14 }}>Show Link</p>
                                    </Tooltip>

                                    <Switch
                                        defaultChecked={user.settings.showLink}
                                        onClick={(val) => enable('showLink', val)}
                                        className={styles.switchChild}
                                    />
                                </div>

                                <div className={styles.switch}>
                                    <Tooltip placement="topRight" title="Invisible URL will get rid of the filename at the end of the link of the image.">
                                        <p style={{ cursor: 'pointer' }}>Invisible URL</p>
                                    </Tooltip>

                                    <Switch
                                        defaultChecked={user.settings.invisibleUrl}
                                        onClick={(val) => enable('invisibleUrl', val)}
                                        className={styles.switchChild}
                                    />
                                </div>
                            </div>

                            <div>
                                <p className={`ant-statistic-title ${styles.switchCap}`}>Misc Settings</p>

                                <div className={styles.switch}>
                                    {user.settings.embed.enabled && <Button
                                        type="primary"
                                        onClick={() => setState((state) => ({ ...state, tab: 2 }))}
                                        style={{
                                            backgroundColor: '#444444',
                                            border: 'none',
                                            marginRight: '10px',
                                            marginTop: '-1px',
                                        }}
                                        shape="circle"
                                        icon={<ToolOutlined />}
                                        size="small"
                                    />}

                                    <Tooltip placement="topRight" title="Embeds will allow you to have a custom title, description, and color on your images.">
                                        <p style={{ cursor: 'pointer', marginRight: 3 }}>Discord Embeds</p>
                                    </Tooltip>

                                    <Switch
                                        defaultChecked={user.settings.embed.enabled}
                                        onClick={(val) => enable('embeds', val)}
                                        className={styles.switchChild}
                                    />
                                </div>

                                <div className={styles.switch} >
                                    {user.settings.autoWipe.enabled && <Button
                                        type="primary"
                                        onClick={() => setState((state) => ({ ...state, autoWipeManager: true }))}
                                        style={{
                                            backgroundColor: '#444444',
                                            border: 'none',
                                            marginRight: '10px',
                                            marginTop: '-1px',
                                        }}
                                        shape="circle"
                                        icon={<ToolOutlined />}
                                        size="small"
                                    />}

                                    <Tooltip placement="topRight" title="Auto-file wiping will automatically wipe your files based on a interval you provide.">
                                        <p style={{ cursor: 'pointer', marginRight: 1 }}>Auto File Wiping</p>
                                    </Tooltip>

                                    <Switch
                                        defaultChecked={user.settings.autoWipe.enabled}
                                        onClick={(val) => enable('autoWipe', val)}
                                        className={styles.switchChild}
                                    />
                                </div>

                                <div className={styles.switch} style={{ marginBottom: 5 }}>
                                    {user.settings.randomDomain.enabled && <Button
                                        type="primary"
                                        onClick={() => setState((state) => ({ ...state, tab: 3 }))}
                                        style={{
                                            backgroundColor: '#444444',
                                            border: 'none',
                                            marginRight: '10px',
                                            marginTop: '-1px',
                                        }}
                                        shape="circle"
                                        icon={<ToolOutlined />}
                                        size="small"
                                    />}

                                    <Tooltip placement="topRight" title="Random domain will choose a random domain from a list you provide.">
                                        <p style={{ cursor: 'pointer' }}>Random Domain</p>
                                    </Tooltip>

                                    <Switch
                                        defaultChecked={user.settings.randomDomain.enabled}
                                        onClick={(val) => enable('randomDomain', val)}
                                        className={styles.switchChild}
                                    />
                                </div>
                            </div>
                        </div>
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
                        selectedKeys={[tab.toString()]}
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        onClick={({ key }) => {
                            setState((state) => ({ ...state, tab: parseInt(key as string), autoWipeManager: false }));
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

            <Modal
                closable={false}
                centered
                footer={null}
                visible={autoWipeManager}
                onCancel={() => setState((state) => ({ ...state, autoWipeManager: false }))}
            >
                <Select
                    onSelect={(val) => setWipeInterval(val)}
                    defaultValue={user.settings.autoWipe.interval}
                    style={{ width: '100%', textAlign: 'center' }}
                >
                    <Option value={ms('1m')}>1 Hour</Option>
                    <Option value={ms('2h')}>2 Hours</Option>
                    <Option value={ms('12h')}>12 Hours</Option>
                    <Option value={ms('24h')}>24 Hours</Option>
                    <Option value={ms('1w')}>1 Week</Option>
                    <Option value={ms('2w')}>2 Weeks</Option>
                    <Option value={ms('4w')}>1 Month</Option>
                </Select>
            </Modal>
        </div>
    );
}
