import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading || checked) return;

    setChecked(true);

    if (user) {
      router.replace({
        pathname: '/SplashScreen',
        params: { redirect: 'HomeScreen' },
      } as any);
    } else {
      router.replace({
        pathname: '/SplashScreen',
        params: { redirect: 'LoginScreen' },
      } as any);
    }
  }, [user, loading]);

  return null;
}