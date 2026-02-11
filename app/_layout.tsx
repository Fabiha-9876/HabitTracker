import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '@/src/hooks/useAuth';
import { useHabitStore } from '@/src/stores/habitStore';
import { requestPermissions } from '@/src/services/notifications';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/src/theme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <RootLayoutNav />
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const lastUser = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    const uid = user?.uid ?? null;

    if (uid === lastUser.current) return;
    lastUser.current = uid;

    if (user) {
      useHabitStore.getState().setUserId(user.uid);
      useHabitStore.getState().syncFromFirestore().catch(() => {});
      requestPermissions().catch(() => {});
      router.replace('/(tabs)');
    } else {
      useHabitStore.getState().setUserId(null);
      router.replace('/(auth)/login');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
