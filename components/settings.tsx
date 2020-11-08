import { DownloadOutlined, QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Input, message, Select, Switch, Tooltip } from 'antd';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '../styles/settings.module.css';
import Navbar from './navbar';
const { Option } = Select;

export default function Settings({ userProp, domainsProp, router }) {
  interface InitialState {
    user: any;
    domains: Array<any>;
    selectedDomain: any;
    domainInput: string;
  }

  const initialState = {
    user: userProp,
    selectedDomain: {
      name: '',
      wildcard: false,
    },
    domainInput: '',
    domains: domainsProp,
  };

  const [{ user, domains, selectedDomain, domainInput }, setState] = useState<InitialState>(initialState);

  useEffect(() => {
    let name: string;
    let wildcard: boolean;
    const domain = domains.find((d) => d.name === user.settings.domain.name);

    if (!domain) {
      name = 'astral.cool';
      wildcard = false;
    }

    name = domain.name;
    wildcard = domain.wildcard;

    setState((state) => ({ ...state, selectedDomain: { name, wildcard }, domainInput: user.settings.domain.subdomain !== '' && user.settins.domain.subdomain !== null ? user.settings.domain.subdomain : '' }));
  }, []);

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

      <Navbar user={user} enabled="settings" />

      <div className={styles.settingsPage}>
        <div className={styles.section}>
          <h1 className={styles.title}>Config Generator</h1>
          <p className={styles.titleCaption}>You only need to generate one config.</p>

          <Button
            href={`http://localhost:3001/files/config?key=${user.key}`}
            className={styles.configButton}
            icon={<DownloadOutlined />}
          >
            Download Config
          </Button>
        </div>

        <div className={styles.section}>
          <h1 className={styles.title}>Domain Preferences</h1>
          <p className={styles.titleCaption}>
            Your current domain is<span style={{ fontWeight: 500 }}>{' '}
              {domainInput !== '' && selectedDomain.wildcard ? domainInput + '.' + selectedDomain.name : selectedDomain.name}
            </span>.
          </p>

          <Input
            value={domainInput !== '' ? domainInput : ''}
            onChange={(val) => setDomain(val.target.value)}
            disabled={selectedDomain.wildcard === false}
            className={styles.domainInput}
            placeholder={selectedDomain.wildcard ? 'subdomain' : 'not available'}
            addonAfter={domainSelect}
          />

          <Button
            href={`http://localhost:3001/files/config?key=${user.key}`}
            className={styles.configButton}
            icon={<SaveOutlined />}
          >
            Save Domain
          </Button>
        </div>

        <div className={styles.section}>
          <h1 className={styles.title}>Upload Preferences</h1>

          <div className={styles.switchContainer}>
            <div className={styles.switchInput}>
              <p>Show Link</p>
              <Switch
                onClick={(val) => {
                  setState((state) => ({ ...state, randomDomain: val }));
                }}
                style={{
                  marginLeft: '10px',
                  width: '55px',
                }} />
            </div>

            <div className={styles.switchInput}>
              <p>Invisible Link</p>
              <Switch
                onClick={(val) => {
                  setState((state) => ({ ...state, randomDomain: val }));
                }}
                style={{
                  marginLeft: '10px',
                  width: '55px',
                }} />
            </div>

            <div className={styles.switchInput}>
              <Tooltip placement="right" overlayStyle={{
                marginTop: '-10px',
              }} title="Random domain will choose a random domain which you can provide.">
                <QuestionCircleOutlined className={styles.questionIcon} />
              </Tooltip>

              <p>Random Domain</p>
              <Switch
                onClick={(val) => {
                  setState((state) => ({ ...state, randomDomain: val }));
                }}
                style={{
                  marginLeft: '10px',
                  width: '55px',
                }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
