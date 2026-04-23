import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import { destinations } from '../data/destinations'; // ✅ FIXED

const categories = ['All', 'Beach', 'City', 'Adventure'];

export default function HomeScreen() {
  const router = useRouter();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = useCallback(() => {
    if (selectedCategory === 'All') return destinations;
    return destinations.filter(d => d.category === selectedCategory);
  }, [selectedCategory]);

  const featured = destinations.slice(0, 3);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Traveller! 👋</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => router.push('/ProfileScreen')}
          >
            <Text style={styles.profileEmoji}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/SearchScreen')}
        >
          <Text style={styles.searchText}>🔍 Search destinations...</Text>
        </TouchableOpacity>

        {/* Featured */}
        <Text style={styles.sectionTitle}>Featured Destinations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featured.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.featuredCard}
              onPress={() =>
                router.push({
                  pathname: '/DestinationDetailScreen',
                  params: { id: item.id },
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.featuredImage} />
              <View style={styles.featuredOverlay}>
                <Text style={styles.featuredName}>{item.name}</Text>
                <Text style={styles.featuredCountry}>{item.country}</Text>
                <Text style={styles.featuredRating}>⭐ {item.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category */}
        <Text style={styles.sectionTitle}>Explore by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                selectedCategory === cat && styles.categoryBtnActive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List */}
        <FlatList
          data={filtered()}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/DestinationDetailScreen',
                  params: { id: item.id },
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName}>{item.name}</Text>

                  <TouchableOpacity
                    onPress={() =>
                      isBookmarked(item.id)
                        ? removeBookmark(item.id)
                        : addBookmark(item)
                    }
                  >
                    <Text style={styles.bookmarkIcon}>
                      {isBookmarked(item.id) ? '🔖' : '🏳️'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.cardCountry}>📍 {item.country}</Text>
                <Text style={styles.cardWeather}>🌤️ {item.weather}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardRating}>⭐ {item.rating}</Text>
                  <Text style={styles.cardPrice}>
                    ₹{item.price.toLocaleString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Quick Links */}
        <View style={styles.quickLinks}>
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => router.push('/BookmarksScreen')}
          >
            <Text style={styles.quickEmoji}>🔖</Text>
            <Text style={styles.quickText}>Bookmarks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => router.push('/TripPlannerScreen')}
          >
            <Text style={styles.quickEmoji}>🗺️</Text>
            <Text style={styles.quickText}>Trip Planner</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => router.push('/SettingScreen')} 
          >
            <Text style={styles.quickEmoji}>⚙️</Text>
            <Text style={styles.quickText}>Settings</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 20, paddingTop: 50,
  },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  email: { fontSize: 13, color: '#a0a0b0', marginTop: 2 },
  profileBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#e94560', alignItems: 'center', justifyContent: 'center',
  },
  profileEmoji: { fontSize: 20 },
  searchBar: {
    backgroundColor: '#16213e', margin: 16, padding: 14,
    borderRadius: 12, borderWidth: 1, borderColor: '#e94560',
  },
  searchText: { color: '#a0a0b0', fontSize: 15 },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#fff',
    marginLeft: 16, marginTop: 8, marginBottom: 12,
  },
  featuredCard: {
    width: 220, height: 150, marginLeft: 16,
    borderRadius: 16, overflow: 'hidden',
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 10,
  },
  featuredName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  featuredCountry: { fontSize: 12, color: '#ddd' },
  featuredRating: { fontSize: 12, color: '#ffd700' },
  categoryRow: { paddingLeft: 16, marginBottom: 16 },
  categoryBtn: {
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#16213e',
    marginRight: 8, borderWidth: 1, borderColor: '#0f3460',
  },
  categoryBtnActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  categoryText: { color: '#a0a0b0', fontSize: 14 },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#16213e', borderRadius: 16,
    marginHorizontal: 16, marginBottom: 16, overflow: 'hidden', elevation: 5,
  },
  cardImage: { width: '100%', height: 180 },
  cardContent: { padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  bookmarkIcon: { fontSize: 22 },
  cardCountry: { fontSize: 13, color: '#a0a0b0', marginTop: 4 },
  cardWeather: { fontSize: 13, color: '#a0a0b0', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  cardRating: { fontSize: 14, color: '#ffd700' },
  cardPrice: { fontSize: 14, color: '#e94560', fontWeight: 'bold' },
  quickLinks: {
    flexDirection: 'row', justifyContent: 'space-around',
    padding: 16, marginBottom: 20,
  },
  quickBtn: {
    backgroundColor: '#16213e', padding: 16, borderRadius: 16,
    alignItems: 'center', width: '30%', elevation: 3,
  },
  quickEmoji: { fontSize: 28, marginBottom: 6 },
  quickText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});