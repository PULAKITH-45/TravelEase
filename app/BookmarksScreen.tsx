import { useRouter } from 'expo-router';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useBookmarks } from '../context/BookmarkContext';

export default function BookmarksScreen() {
  const router = useRouter();
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔖</Text>
            <Text style={styles.emptyText}>No bookmarks yet!</Text>
            <Text style={styles.emptySubText}>
              Save your favourite destinations
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/DestinationDetailScreen',
                params: { id: item.id }
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardCountry}>📍 {item.country}</Text>
              <Text style={styles.cardWeather}>🌤️ {item.weather}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardRating}>⭐ {item.rating}</Text>
                <Text style={styles.cardPrice}>
                  ₹{item.price.toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeBookmark(item.id)}
              >
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 16 },
  empty: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  emptySubText: { fontSize: 14, color: '#a0a0b0', marginTop: 8 },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 5,
  },
  cardImage: { width: 110, height: 130 },
  cardContent: { flex: 1, padding: 12 },
  cardName: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
  cardCountry: { fontSize: 13, color: '#a0a0b0', marginTop: 4 },
  cardWeather: { fontSize: 13, color: '#a0a0b0', marginTop: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardRating: { fontSize: 13, color: '#ffd700' },
  cardPrice: { fontSize: 13, color: '#e94560', fontWeight: 'bold' },
  removeBtn: {
    backgroundColor: '#e94560',
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  removeBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});