import { LinkOutlined, UploadOutlined } from '@ant-design/icons';
import { Input, message, Select, Switch, Upload } from 'antd';
import Axios from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
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
    showLink: boolean;
    invisibleLink: boolean;
    randomDomain: boolean;
  }

  const initialState = {
    user: userProp,
    domains: domainsProp,
    selectedDomain: {
      name: 'astral.cool',
      wildcard: false,
    },
    domainInput: '',
    showLink: false,
    invisibleLink: false,
    randomDomain: false,
  };

  const [{ user, domains, selectedDomain, domainInput, showLink, invisibleLink, randomDomain }, setState] = useState<InitialState>(initialState);

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
          <Dragger
            action="http://localhost:3001/files"
            headers={{
              key: user.key,
              domain: selectedDomain.wildcard && domainInput !== '' ? `${domainInput}.${selectedDomain.name}` : selectedDomain.name,
              showLink: showLink ? 'true' : 'false',
              invisibleLink: invisibleLink ? 'true' : 'false',
              randomDomain: randomDomain ? 'true' : 'false',
            }}
            onDownload={(file) => {
              if (file.status === 'done') {
                const { response } = file;

                message.success('Copied url to clipboard');
                navigator.clipboard.writeText(response.imageUrl);
              }
            }}
            onPreview={(file) => {
              window.open(file.response.imageUrl, '_blank');
            }}
            listType="picture"
            showUploadList={{
              showDownloadIcon: true,
              downloadIcon: () => {
                return (
                  <LinkOutlined />
                );
              },
            }}
            onRemove={({ response }) => {
              Axios.get(response.deletionUrl)
                .then(() => {
                  message.success('Deleted file successfully');
                })
                .catch((err) => {
                  if (err.response) return message.error(err.response.data.error);
                  message.error('Something went wrong');
                });
            }}
            onChange={({ file }) => {
              if (file.status === 'done') {
                const { response } = file;

                message.success('Copied url to clipboard');
                navigator.clipboard.writeText(response.imageUrl);
              } else if (file.status === 'error') {
                message.error('Upload failed');
              }
            }}
          >
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

          <div className={styles.switchContainer}>
            <h1 style={{
              fontSize: '26px',
              marginTop: '5px',
            }}>URL Settings</h1>
            <div className={styles.switchInput}>
              <p>Show Link</p>
              <Switch
                onClick={(val) => {
                  setState((state) => ({ ...state, showLink: val }));
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
                  setState((state) => ({ ...state, invisibleLink: val }));
                }}
                style={{
                  marginLeft: '10px',
                  width: '55px',
                }} />
            </div>
            <div className={styles.switchInput} style={{
              marginBottom: '10px',
            }}>
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
