import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useUser } from '../components/user';
import { useRouter } from 'next/router';

export default function Dashboard() {
    const router = useRouter();
    const { user, dispatch } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/');
        } else {
            setLoading(false);
        }
    }, []);

    const nullifyUser = async () => {
        dispatch({
            type: 'NULLIFY',
        });

        router.push('/');
    };

    return loading || !user ? 'loading...' : (
        <div>
            <p>welcome {user.username}</p>

            <Button onClick={nullifyUser}>
              logout
            </Button>
        </div>
    );
}
