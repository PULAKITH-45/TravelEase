import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBookmarks } from '../context/BookmarkContext';
import { destinations } from '../data/destinations';

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  const [showDate, setShowDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const place = destinations.find((item) => item.id === id);

  if (!place) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>
          Destination not found
        </Text>
      </View>
    );
  }

  const isBookmarked = bookmarks.some((b) => b.id === place.id);

  const toggleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(place.id);
    } else {
      addBookmark(place);
    }
  };

  const onChange = (event: any, date?: Date) => {
    if (event.type === 'dismissed') {
      setShowDate(false);
      return;
    }

    if (event.type === 'set' && date) {
      setShowDate(false);
      setSelectedDate(date);

      router.push({
        pathname: '/PaymentScreen',
        params: {
          name: place.name,
          price: place.price,
          date: date.toDateString(),
        },
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: place.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.country}>📍 {place.country}</Text>
        <Text style={styles.rating}>⭐ {place.rating}</Text>
        <Text style={styles.weather}>🌤️ {place.weather}</Text>
        <Text style={styles.price}>₹{place.price}</Text>

        <Text style={styles.description}>{place.description}</Text>

        {/* 📅 ITINERARY */}
        <Text style={styles.itineraryTitle}>📅 Itinerary</Text>

        {place.itinerary.map((day, index) => (
          <Text key={index} style={styles.itineraryText}>
            {day}
          </Text>
        ))}

        {/* 🔥 BOOK NOW */}
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => setShowDate(true)}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>

        {/* 📅 DATE PICKER */}
        {showDate && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
            onChange={onChange}
          />
        )}

        {/* 🔖 BOOKMARK */}
        <TouchableOpacity style={styles.bookmarkBtn} onPress={toggleBookmark}>
          <Text style={styles.bookmarkText}>
            {isBookmarked ? 'Remove Bookmark ❌' : 'Add Bookmark 🔖'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },

  image: { width: '100%', height: 250 },

  content: { padding: 16 },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  country: {
    color: '#aaa',
    marginTop: 4,
  },

  rating: {
    color: '#ffd700',
    marginTop: 6,
  },

  weather: {
    color: '#aaa',
    marginTop: 4,
  },

  price: {
    color: '#e94560',
    fontSize: 20,
    marginTop: 8,
    fontWeight: 'bold',
  },

  description: {
    color: '#ccc',
    marginTop: 12,
    lineHeight: 20,
  },

  itineraryTitle: {
    color: '#fff',
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 16,
  },

  itineraryText: {
    color: '#ccc',
    marginTop: 5,
  },

  bookBtn: {
    backgroundColor: '#e94560',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },

  bookBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  bookmarkBtn: {
    backgroundColor: '#0f3460',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },

  bookmarkText: {
    color: '#fff',
  },
});