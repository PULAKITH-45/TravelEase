import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useBookmarks } from '../context/BookmarkContext';
import { destinations } from '../data/destinations'; // ✅ FIXED

const categories = ['All', 'Beach', 'City', 'Adventure'];
const sortOptions = ['Default', 'Price: Low to High', 'Price: High to Low', 'Rating'];

export default function SearchScreen() {
  const router = useRouter();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Default');

  const filtered = useCallback(() => {
    let result = destinations.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedCategory !== 'All') {
      result = result.filter(d => d.category === selectedCategory);
    }

    if (selectedSort === 'Price: Low to High') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'Price: High to Low') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'Rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, selectedCategory, selectedSort]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search destinations..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        autoFocus
      />

      {/* Category */}
      <View style={styles.filterRow}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterBtn, selectedCategory === cat && styles.filterBtnActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort */}
      <View style={styles.sortRow}>
        {sortOptions.map(sort => (
          <TouchableOpacity
            key={sort}
            style={[styles.sortBtn, selectedSort === sort && styles.sortBtnActive]}
            onPress={() => setSelectedSort(sort)}
          >
            <Text style={[styles.sortText, selectedSort === sort && styles.sortTextActive]}>
              {sort}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.resultCount}>
        {filtered().length} destinations found
      </Text>

      <FlatList
        data={filtered()}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No destinations found!</Text>
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
              <View style={styles.cardHeader}>
                <Text style={styles.cardName}>{item.name}</Text>

                <TouchableOpacity
                  onPress={() =>
                    isBookmarked(item.id)
                      ? removeBookmark(item.id)
                      : addBookmark(item)
                  }
                >
                  <Text>{isBookmarked(item.id) ? '🔖' : '🏳️'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.cardCountry}>📍 {item.country}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.cardRating}>⭐ {item.rating}</Text>
                <Text style={styles.cardPrice}>₹{item.price.toLocaleString()}</Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 16 },
  searchInput: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#e94560',
    marginBottom: 12,
  },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  filterBtnActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  filterText: { color: '#a0a0b0', fontSize: 13 },
  filterTextActive: { color: '#fff', fontWeight: 'bold' },
  sortRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  sortBtnActive: { backgroundColor: '#0f3460', borderColor: '#e94560' },
  sortText: { color: '#a0a0b0', fontSize: 12 },
  sortTextActive: { color: '#e94560', fontWeight: 'bold' },
  resultCount: { color: '#a0a0b0', fontSize: 13, marginBottom: 10 },
  empty: { textAlign: 'center', color: '#a0a0b0', marginTop: 50, fontSize: 16 },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    flexDirection: 'row',
  },
  cardImage: { width: 100, height: 100 },
  cardContent: { flex: 1, padding: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  cardCountry: { fontSize: 12, color: '#a0a0b0', marginTop: 4 },
  cardFooter: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cardRating: { fontSize: 13, color: '#ffd700' },
  cardPrice: { fontSize: 13, color: '#e94560', fontWeight: 'bold' },
  cardCategory: { fontSize: 13, color: '#a0a0b0' },
});