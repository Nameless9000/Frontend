import React, { useEffect, useState } from 'react';
import { useUser } from '../components/user';
import { useRouter } from 'next/router';
import Loading from '../components/loading';
import Verify from '../components/verify';

export default function Dashboard() {
    const router = useRouter();
    const { user } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);

            router.push('/');
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <Loading />;

    return user && user.discord.id ? <h1>hi {user.username}</h1> : <Verify />;
}
