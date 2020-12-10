import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import styles from '../styles/Domains.module.css';
import Link from 'next/link';
import { Button } from 'antd';

export default function Domains() {
    const [domains, setDomains] = useState([]);

    useEffect(() => {
        Axios.get(`${process.env.BACKEND_URL}/domains`).then(({ data }) => {
            for (const domain of data.domains) {
                domain.name = domain.name
                    .replace('nigga', 'n*gga')
                    .replace('nigger', 'n*gger');
            }

            setDomains(data.domains);
        });
    }, []);

    return (
        <div className={styles.container}>
            <h3 style={{ marginTop: '10px' }}>Wildcard ({domains.filter((d) => d.wildcard).length})</h3>
            <ul>
                {domains
                    .filter((d) => d.wildcard)
                    .map((d) => (
                        <li key={d.name}>{d.name}</li>
                    ))}
            </ul>

            <h3>Non-Wildcard ({domains.filter((d) => !d.wildcard).length})</h3>
            <ul>
                {domains
                    .filter((d) => !d.wildcard)
                    .map((d) => (
                        <li key={d.name}>{d.name}</li>
                    ))}
            </ul>
        </div>
    );
}
