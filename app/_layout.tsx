import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { BookmarkProvider } from '../context/BookmarkContext';


SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // small delay so it doesn’t flash white
        await new Promise(resolve => setTimeout(resolve, 300));
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (!appReady) return null;

  return (
    <AuthProvider>
      <BookmarkProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </BookmarkProvider>
    </AuthProvider>
  );
}