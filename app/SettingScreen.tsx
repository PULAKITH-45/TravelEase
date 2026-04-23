import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [locationServices, setLocationServices] = useState(false);

  const handleClearData = () => {
    Alert.alert('Clear Data', 'This will clear all bookmarks and trips. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          Alert.alert('Success', 'All data cleared!');
        }
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/LoginScreen');
        }
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>

      {/* Preferences */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.section}>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingText}>Push Notifications</Text>
            <Text style={styles.settingSubText}>Get travel updates</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Text style={styles.settingSubText}>Enable dark theme</Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingText}>Location Services</Text>
            <Text style={styles.settingSubText}>Find nearby destinations</Text>
          </View>
          <Switch value={locationServices} onValueChange={setLocationServices} />
        </View>

      </View>

      {/* Account */}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.section}>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/ProfileScreen')}>
          <Text style={styles.menuEmoji}>👤</Text>
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/BookmarksScreen')}>
          <Text style={styles.menuEmoji}>🔖</Text>
          <Text style={styles.menuText}>My Bookmarks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/TripPlannerScreen')}>
          <Text style={styles.menuEmoji}>🗺️</Text>
          <Text style={styles.menuText}>My Trips</Text>
        </TouchableOpacity>

      </View>

      {/* Danger Zone */}
      <Text style={styles.sectionTitle}>Danger Zone</Text>
      <View style={styles.section}>

        <TouchableOpacity style={styles.dangerItem} onPress={handleClearData}>
          <Text style={styles.menuEmoji}>🗑️</Text>
          <Text style={styles.dangerText}>Clear All Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerItem} onPress={handleLogout}>
          <Text style={styles.menuEmoji}>🚪</Text>
          <Text style={styles.dangerText}>Logout</Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 16 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#a0a0b0',
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: 1,
  },

  section: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    marginBottom: 8,
    elevation: 3,
    overflow: 'hidden',
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },

  settingText: { fontSize: 16, color: '#fff' },
  settingSubText: { fontSize: 12, color: '#a0a0b0', marginTop: 2 },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },

  menuEmoji: { fontSize: 20, marginRight: 12 },
  menuText: { flex: 1, fontSize: 16, color: '#fff' },

  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },

  dangerText: { fontSize: 16, color: '#e94560', fontWeight: '600' },
});