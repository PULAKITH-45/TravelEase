import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext'; // ✅ FIXED
import { useBookmarks } from '../context/BookmarkContext'; // ✅ FIXED

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { bookmarks } = useBookmarks();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(
    user?.email?.split('@')[0] || 'Traveller'
  );
  const [editing, setEditing] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/LoginScreen'); // ✅ FIXED
        }
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>

        {editing ? (
          <TextInput
            style={styles.nameInput}
            value={displayName}
            onChangeText={setDisplayName}
            autoFocus
          />
        ) : (
          <Text style={styles.name}>{displayName}</Text>
        )}

        <Text style={styles.email}>{user?.email}</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditing(!editing)}
        >
          <Text style={styles.editBtnText}>
            {editing ? '✅ Save' : '✏️ Edit Name'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{bookmarks.length}</Text>
          <Text style={styles.statLabel}>Bookmarks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>🌍</Text>
          <Text style={styles.statLabel}>Explorer</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>✈️</Text>
          <Text style={styles.statLabel}>Traveller</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/BookmarksScreen')} // ✅ FIXED
        >
          <Text style={styles.menuEmoji}>🔖</Text>
          <Text style={styles.menuText}>My Bookmarks</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/TripPlannerScreen')} // ✅ FIXED
        >
          <Text style={styles.menuEmoji}>🗺️</Text>
          <Text style={styles.menuText}>My Trips</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/SettingScreen')} // ✅ FIXED
        >
          <Text style={styles.menuEmoji}>⚙️</Text>
          <Text style={styles.menuText}>Settings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: {
    backgroundColor: '#16213e',
    padding: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e94560',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  nameInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e94560',
    marginBottom: 4,
    textAlign: 'center',
    minWidth: 150,
  },
  email: { fontSize: 14, color: '#a0a0b0' },
  editBtn: {
    marginTop: 12,
    backgroundColor: '#0f3460',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editBtnText: { color: '#e94560', fontSize: 14 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#16213e',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
  },
  statCard: { alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#e94560' },
  statLabel: { fontSize: 12, color: '#a0a0b0', marginTop: 4 },
  menu: {
    backgroundColor: '#16213e',
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  menuEmoji: { fontSize: 20, marginRight: 12 },
  menuText: { flex: 1, fontSize: 16, color: '#fff' },
  menuArrow: { fontSize: 20, color: '#a0a0b0' },
  logoutBtn: {
    backgroundColor: '#e94560',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  logoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});