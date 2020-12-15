import { User } from '../typings';
import { useEffect, useState } from 'react';
import { UserProvider } from '../components/user';
import API from '../api';
import Loading from '../components/loading';
import '../styles/antd.less';
import '../styles/globals.less';

export default function MyApp({ Component, pageProps }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        const refreshToken = async () => {
            try {
                const data = await API.refreshToken();
                const { images, storageUsed } = await API.getImages();

                data.user['images'] = images;
                data.user['storageUsed'] = storageUsed;
                data.user['accessToken'] = data.accessToken;

                setUser(data.user);

                setTimeout(() => {
                    setLoading(false);
                }, 500);
            } catch (err) {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };

        if (!user) refreshToken();
    }, []);

    return loading ? <Loading /> : (
        <UserProvider value={{ user, setUser }}>
            <Component {...pageProps} />
        </UserProvider>
    );
}
