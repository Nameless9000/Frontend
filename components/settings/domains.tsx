import { Table, Tag } from 'antd';
import React from 'react';
import styles from '../../styles/Domains.module.css';
import { useUser } from '../user';

export default function Domains() {
    const { user } = useUser();
    const { domains } = user;

    const columns = [
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
        },
        {
            title: 'Tags',
            key: 'tags',
            render: (domain: { wildcard: boolean; donated: boolean; userOnly: boolean; }) => (
                <div>
                    {domain.wildcard && <Tag color="blue">
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
        },
    ];

    return (
        <div>
            <div className={styles.section}>
                <h1 className={styles.title}>Add a Domain</h1>
                <p className={styles.caption}>You can add domains for your use only, or allow others to use them.</p>
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
