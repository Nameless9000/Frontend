import Head from 'next/head';
import React, { useState } from 'react';
import Navbar from '../navbar';
import styles from '../../styles/Upload.module.css';
import { Input, notification, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useUser } from '../user';

const { Dragger } = Upload;
const { Option } = Select;

export default function UploadC() {
    const { user } = useUser();
    const { domains } = user;

    const initialState = {
        selectedDomain: {
            name: domains.find((d) => d.name === user.settings.domain.name) ? user.settings.domain.name : 'i.astral.cool',
            wildcard: domains.find((d) => d.name === user.settings.domain.name) ? domains.find((d) => d.name === user.settings.domain.name).wildcard : false,
            subdomain: user.settings.domain.subdomain !== '' && user.settings.domain.subdomain !== null ? user.settings.domain.subdomain : '',
        },
    };

    const [{ selectedDomain }, setState] = useState(initialState);

    const domainSelection = (
        <Select
            showSearch
            className={styles.domainDropdown}
            defaultValue={selectedDomain.name}
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onSelect={(x) => {
                const domain = domains.find((d) => d.name === x);

                if (!domain) return notification.error({
                    message: 'Something went wrong',
                    description: 'Invalid domain selection',
                });

                setState((state) => ({ ...state, selectedDomain: { ...domain, subdomain: domain.wildcard ? '' : selectedDomain.subdomain } }));
            }}
        >
            {domains.map((d) => (
                <Option key={d.name} value={d.name}>
                    {d.name}
                </Option>
            ))}
        </Select>
    );

    const setDomain = (val: string) => {
        val = val.replace(/\W/g, '-');

        if (val.trim().length > 60) return;

        setState((state) => ({
            ...state,
            selectedDomain: {
                ...selectedDomain,
                subdomain: val,
            },
        }));
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Upload a File</title>
            </Head>

            <Navbar enabled="upload" />

            <div className={styles.page}>
                <div className={styles.section}>
                    <h1 className={styles.title}>Upload a File</h1>

                    <Dragger style={{ width: '99%', marginLeft: 11 }}>
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

                    <h1 className={styles.title}>Preferences</h1>

                    <Input
                        value={selectedDomain.subdomain !== '' && selectedDomain.wildcard ? selectedDomain.subdomain : ''}
                        placeholder={selectedDomain.wildcard ? 'Subdomain' : 'Not Available'}
                        onChange={(val) => setDomain(val.target.value)}
                        disabled={selectedDomain.wildcard === false}
                        className={styles.domainInput}
                        addonAfter={domainSelection}
                    />


                </div>
            </div>
        </div>
    );
}
