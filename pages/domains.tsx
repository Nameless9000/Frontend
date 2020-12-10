import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import styles from '../styles/Domains.module.css';
import Link from 'next/link';

export default function Domains() {
    const [domains, setDomains] = useState([]);

    useEffect(() => {
        Axios.get(`${process.env.BACKEND_URL}/domains`)
            .then(({ data }) => {
                for (const domain of data.domains) {
                    domain.name = domain.name.replace('nigga', 'n*gga')
                        .replace('nigger', 'n*gger');
                }

                setDomains(data.domains);
            });
    }, []);

    return (
        <div className={styles.container}>
            <Link href="/">
                <p style={{
                    cursor: 'pointer',
                    marginTop: '10px',
                }}>
                      Back
                </p>
            </Link>

            <h2 style={{
                marginTop: '-5px',
                marginLeft: '5px',
                fontWeight: 400,
            }}>There are <strong>{domains.length}</strong> domains.</h2>

            <h3 className={styles.title}>Wildcard ({domains.filter((d) => d.wildcard).length})</h3>
            <ul>
                {domains.filter((d) => d.wildcard).map((d) => (
                    <li key={d.name}>
                        {d.name}
                    </li>
                ))}
            </ul>

            <h3 className={styles.title}>Non-Wildcard ({domains.filter((d) => !d.wildcard).length})</h3>
            <ul>
                {domains.filter((d) => !d.wildcard).map((d) => (
                    <li key={d.name}>
                        {d.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
