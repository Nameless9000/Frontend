import { useEffect } from 'react';
import { UserProvider } from '../components/user';
import API from '../api';
import '../styles/antd.less';
import '../styles/globals.less';

export default function MyApp({ Component, pageProps }) {
    useEffect(() => {
        const refreshToken = async () => {
            try {
                const data = await API.refreshToken();
                console.log(data);
            } catch (err) {}
        };

        refreshToken();
    }, []);

    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
}
