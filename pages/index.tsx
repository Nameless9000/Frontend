import React from 'react';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { Button } from 'antd';

export default function Index() {
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

                    <Button
                        style={{ marginRight: '5px' }}
                        href="https://discord.gg/NkE9uVJ6Ww"
                        target="blank"
                    >
                        Discord Server
                    </Button>
                </div>
            </main>
        </div>
    );
}
