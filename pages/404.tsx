import { HomeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';
import React from 'react';
import styles from '../styles/main.module.css';

export default function Custom404() {
  return (
    <div className={styles.container}>
      <h2>404 Invalid Page</h2>
      <Link href="/">
        <Button icon={<HomeOutlined />}>
        Home
        </Button>
      </Link>
    </div>
  );
}
