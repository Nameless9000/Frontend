import Head from 'next/head';
import React from 'react';
import styles from '../styles/Settings.module.css';
import Navbar from './navbar';
import General from './settings/general';
import Sidebar from './sidebar';

export default function Settings() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Astral Settings</title>
            </Head>

            <Navbar enabled="settings" />
            <Sidebar selectedTab="domains" render={<General />} />
        </div>
    );
}
