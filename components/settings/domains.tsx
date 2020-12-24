import { PlusOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Input, Table, Tag } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import React from 'react';
import styles from '../../styles/Domains.module.css';
import { useUser } from '../user';

export default function Domains() {
    const { user } = useUser();
    const { domains } = user;

    const columns: any = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Wildcard',
            dataIndex: 'wildcard',
            key: 'wildcard',
            render: (wildcard: boolean) => (
                <span>{wildcard ? 'Yes' : 'No'}</span>
            ),
        },
        {
            title: 'Date Added',
            dataIndex: 'dateAdded',
            key: 'dateAdded',
            render: (date: Date) => (
                <span>{new Date(date).toLocaleString()}</span>
            ),
            sorter: (a: any, b: any) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
            responsive: ['sm'],
        },
        {
            title: 'Users',
            dataIndex: 'users',
            key: 'users',
            sorter: (a: { users: number; }, b: { users: number; }) => a.users - b.users,
            responsive: ['sm'],
        },
        {
            title: 'Tags',
            key: 'tags',
            render: (domain: { wildcard: boolean; donated: boolean; userOnly: boolean; }) => (
                <div>
                    {domain.wildcard && <Tag color="gold">
                        WILDCARD
                    </Tag>}

                    <Tag color="green">
                        {!domain.donated ? 'OFFICIAL' : 'DONATED'}
                    </Tag>

                    <Tag>
                        {domain.userOnly ? 'USER-ONLY' : 'PUBLIC'}
                    </Tag>
                </div>
            ),
            responsive: ['md'],
        },
    ];

    return (
        <div>
            <div className={styles.section}>
                <h1 className={styles.title}>Add a Domain</h1>
                <p className={styles.caption}>You can add domains for your use only, or allow others to use them.</p>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="ant-statistic-title" style={{ marginTop: -7 }}><WarningOutlined /> These settings are not changeable later.</span>
                    <Checkbox>Allow Subdomain</Checkbox>
                    <Checkbox style={{ marginTop: 3, marginLeft: 0 }}>Private Domain</Checkbox>
                </div>

                <Input
                    className={styles.domainInput}
                    placeholder="Domain Name"
                />

                <Button
                    className={styles.btn}
                    icon={<PlusOutlined />}
                >
                    Add Domain
                </Button>
            </div>

            <div className={styles.section}>
                <h1 className={styles.title}>Domains</h1>
                <p className={styles.caption}>There are currently <strong>{domains.filter((d) => d.userOnly === false).length}</strong> public domain(s).</p>

                <Table
                    dataSource={domains}
                    columns={columns}
                    style={{
                        marginTop: 3,
                    }}
                />
            </div>
        </div>
    );
}
