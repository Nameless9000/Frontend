import { User } from '../typings';
import { useEffect, useState } from 'react';
import { UserProvider } from '../components/user';
import { useRouter } from 'next/router';
import API from '../api';
import '../styles/antd.less';
import '../styles/globals.less';
import Loading from '../components/loading';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        const refreshToken = async () => {
            try {
                const data = await API.refreshToken();

                data.user['accessToken'] = data.accessToken;

                setUser(data.user);

                setTimeout(() => {
                    setLoading(false);
                }, 500);

                router.push('/dashboard');
            } catch (err) {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };

        refreshToken();
    }, []);

    return loading ? <Loading /> : (
        <UserProvider value={{ user, setUser }}>
            <Component {...pageProps} />
        </UserProvider>
    );
}
