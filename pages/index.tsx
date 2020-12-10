import React from 'react';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function Index() {
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
            <Menu.Item>
                <Link href="/domains">
                    Domains
                </Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className={styles.container}>
            <Head>
                <title>Astral</title>
                <meta name="og:title" content="Astral, private image hosting."/>
                <meta name="og:description" content="Astral is a simple and powerful image hosting platform, with great support, competent developers, and a welcoming community."/>
                <meta name="theme-color" content="#e6394a" />
            </Head>

            <main className={styles.main}>
                <h1 style={{ color: 'white' }}>astral.cool</h1>

                <p style={{ fontSize: '20px', marginTop: '-20px' }}>
                    private invite-only image host.
                </p>

                <div style={{ marginTop: '-10px' }}>
                    <Button style={{ marginRight: '5px' }}>
                        Login/Register
                    </Button>

                    <Dropdown overlay={menu}>
                        <Button style={{ marginRight: '5px' }}>
                            More Stuff <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
            </main>
        </div>
    );
}
