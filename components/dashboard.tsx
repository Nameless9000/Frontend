import React from 'react';
import Navbar from './navbar';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <Navbar enabled="home" />
            dashboard page
        </div>
    );
}
