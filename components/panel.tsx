import React, { useState } from 'react';
import styles from '../styles/panel.module.css';
import Navbar from './navbar';

export default function Panel({ userProp, router }) {
  const initialState = {
    user: userProp,
  };

  const [{ user }, setState] = useState(initialState);

  return (
    <div className={styles.container}>
      <Navbar user={user} enabled="panel" />
      <div className={styles.panelPage}>
      hi {userProp.username}
      </div>
    </div>
  );
}
