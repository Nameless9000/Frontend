import React from 'react';
import Navbar from './navbar';
import styles from '../styles/Dashboard.module.css';
import Head from 'next/head';
import { useUser } from './user';
import { Button, Card, List } from 'antd';
import { CameraOutlined, DatabaseOutlined, DeleteOutlined, LinkOutlined, MailOutlined } from '@ant-design/icons';

export default function Dashboard() {
    const { user } = useUser();
    const { images } = user;

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
                                disabled={user.invites <= 0}
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

                <div className={styles.section}>
                    <h1 className={styles.title}>Gallery</h1>
                    <p className={styles.galleryCaption}>Here you can view all of your images.</p>

                    <div className={styles.galleryContainer}>
                        <List
                            locale={{ emptyText: 'You haven\'t uploaded any images.' }}
                            dataSource={images.filter((i) => i.filename.split('.')[1] !== 'mp4')}
                            pagination={images.length <= 14 ? false : {
                                pageSize: 14,
                                showSizeChanger: false,
                                responsive: true,
                                style: {
                                    marginLeft: '4px',
                                },
                            }}
                            renderItem={(m) => {
                                return (
                                    <Card
                                        key={m.link}
                                        style={{
                                            width: '241.1px',
                                            height: '170px',
                                            marginBottom: '10px',
                                            marginLeft: '10px',
                                        }}
                                        cover={
                                            <a href={m.link} target="blank">
                                                <img
                                                    style={{
                                                        height: '100px',
                                                        width: '239px',
                                                        objectFit: 'cover',
                                                    }}
                                                    src={m.link}
                                                />
                                            </a>
                                        }
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}>
                                            <span>
                                                <div className="ant-statistic-title" style={{
                                                    marginBottom: '0px',
                                                    marginTop: '-11px',
                                                }}>{m.filename}</div>
                                                <span style={{
                                                    fontSize: '13.6px',
                                                }}>Uploaded at {new Date(m.dateUploaded).toLocaleDateString()}</span>
                                            </span>

                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                marginTop: '-15px',
                                                marginLeft: '20px',
                                            }}>

                                                <Button
                                                    type="primary"
                                                    style={{
                                                        backgroundColor: '#e03024',
                                                        border: 'none',
                                                        marginTop: '4px',
                                                    }}
                                                    shape="circle"
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


