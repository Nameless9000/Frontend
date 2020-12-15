import React from 'react';
import Navbar from './navbar';
import styles from '../styles/Dashboard.module.css';
import Head from 'next/head';
import { useUser } from './user';
import { Button, Card } from 'antd';
import { CameraOutlined, DatabaseOutlined, MailOutlined } from '@ant-design/icons';

export default function Dashboard() {
    const { user } = useUser();

    return (
        <div className={styles.container}>
            <Head>
                <title>Astral Dashboard</title>
            </Head>

            <Navbar enabled="home" />

            <div className={styles.dashboard}>
                <div className={styles.section}>
                    <h1 className={styles.title}>Welcome, {user.username}.</h1>

                    <div className={styles.statsCon}>
                        <Card className={styles.statsBox}>
                            <div className="ant-statistic-title"><CameraOutlined /> Images</div>
                            <div className={styles.statContent}>You have uploaded <strong>{user.uploads}</strong> images.</div>
                        </Card>

                        <Card className={styles.statsBox}>
                            <div className="ant-statistic-title"><MailOutlined /> Invites</div>
                            <Button
                                shape="round"
                                style={{
                                    marginTop: '3px',
                                }}
                            >
                              Manage Invites (<strong>{user.invites}</strong>)
                            </Button>
                        </Card>

                        <Card className={styles.statsBox}>
                            <div className="ant-statistic-title"><DatabaseOutlined /> Storage Used</div>
                            <div className={styles.statContent}>{user.storageUsed}</div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
