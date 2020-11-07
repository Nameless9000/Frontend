import { UploadOutlined } from '@ant-design/icons';
import { Input, message, Select, Upload } from 'antd';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '../styles/upload.module.css';
import Navbar from './navbar';
const { Dragger } = Upload;
const { Option } = Select;

export default function UploadComponent({ userProp, domainsProp, router }) {
  interface InitialState {
    user: any;
    domains: Array<any>;
    selectedDomain: any;
    domainInput: string;
  }

  const initialState = {
    user: userProp,
    domains: domainsProp,
    selectedDomain: {
      name: 'astral.cool',
      wildcard: false,
    },
    domainInput: '',
  };

  const [{ user, domains, selectedDomain, domainInput }, setState] = useState<InitialState>(initialState);

  const domainSelect = (
    <Select
      onSelect={(x) => {
        const domain = domains.find((d) => d.name === x);

        if (!domain) return message.error('Invalid domain selection');

        setState((state) => ({ ...state, selectedDomain: domain }));
      }}
      defaultValue="astral.cool"
      className="select-after"
    >
      {domains.map((d) => (
        <Option key={d.name} value={d.name}>
          {d.name}
        </Option>
      ))}
    </Select>
  );

  const setDomain = (val: string) => {
    val = val.replace(/\s/g, '-');

    if (val.trim().length > 60) return;

    setState((state) => ({ ...state, domainInput: val }));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Astral Dashboard</title>
      </Head>

      <Navbar user={user} enabled="upload" />

      <div className={styles.uploadPage}>
        <div className={styles.section}>
          <h1 className={styles.title}>Upload a file</h1>
          <Dragger>
            <UploadOutlined
              style={{
                fontSize: '30px',
                marginTop: '10px',
              }}
            />
            <p
              style={{
                fontSize: '16px',
                fontWeight: 500,
                marginTop: '5px',
              }}
            >
              Click or drag a file to this area to upload
            </p>
            <p
              style={{
                paddingLeft: '30px',
                paddingRight: '30px',
                marginBottom: '10px',
              }}
            >
              Your url will automatically be copied to your clipboard.
            </p>
          </Dragger>

          <h1 className={styles.title} style={{
            marginBottom: '-5px',
          }}>Preferences</h1>

          <Input
            value={domainInput !== '' ? domainInput : ''}
            onChange={(val) => setDomain(val.target.value)}
            disabled={selectedDomain.wildcard === false}
            className={styles.domainInput}
            placeholder={selectedDomain.wildcard ? 'subdomain' : 'not available'}
            addonAfter={domainSelect}
          />
        </div>
      </div>
    </div>
  );
}
