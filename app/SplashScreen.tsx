import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

export default function SplashScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams();

  const translateX = useSharedValue(-100);
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // ✈️ animation
    opacity.value = withTiming(1, { duration: 500 });

    translateX.value = withDelay(200, withTiming(250, { duration: 1500 }));
    translateY.value = withDelay(200, withTiming(-300, { duration: 1500 }));

    // ✅ redirect after animation (TS FIX APPLIED)
    setTimeout(() => {
      if (redirect) {
        router.replace(`/${redirect}` as any);
      } else {
        router.replace('/LoginScreen' as any);
      }
    }, 1800);
  }, []);

  const planeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.plane, planeStyle]}>
        ✈️
      </Animated.Text>

      <Text style={styles.title}>TravelEase</Text>
      <Text style={styles.subtitle}>Explore the world with ease</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plane: {
    fontSize: 60,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    marginTop: 20,
    fontWeight: 'bold',
  },
  subtitle: {
  color: '#a0a0b0',
  fontSize: 14,
  marginTop: 8,
},
});