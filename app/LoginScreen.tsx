import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields!');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      router.replace('/HomeScreen'); // ✅ FIXED
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.emoji}>✈️</Text>
          <Text style={styles.title}>TravelEase</Text>
          <Text style={styles.subtitle}>Explore the world with ease</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Welcome Back!</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => router.push('/SignupScreen')} // ✅ FIXED
          >
            <Text style={styles.signupBtnText}>
              Don't have an account?{' '}
              <Text style={styles.signupBtnTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    padding: 24,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  emoji: { fontSize: 60, marginBottom: 10 },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  subtitle: { fontSize: 16, color: '#a0a0b0', marginTop: 8 },
  form: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  loginBtn: {
    backgroundColor: '#e94560',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  signupBtn: { alignItems: 'center', padding: 8 },
  signupBtnText: { color: '#a0a0b0', fontSize: 15 },
  signupBtnTextBold: { color: '#e94560', fontWeight: 'bold' },
});