import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext'; // ✅ FIXED

type Trip = {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  notes: string;
  booked: boolean;
};

export default function TripPlannerScreen() {
  const { user } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    const planned = await AsyncStorage.getItem(`trips_${user?.uid}`);
    const booked = await AsyncStorage.getItem(`trips_booked`);

    const plannedTrips = planned ? JSON.parse(planned) : [];
    const bookedTrips = booked ? JSON.parse(booked) : [];

    setTrips([...bookedTrips, ...plannedTrips]);
  };

  const saveTrips = async (updated: Trip[]) => {
    setTrips(updated);
    await AsyncStorage.setItem(`trips_${user?.uid}`, JSON.stringify(updated));
  };

  const addTrip = () => {
    if (!destination || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill destination and dates!');
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      destination,
      startDate,
      endDate,
      budget,
      notes,
      booked: false,
    };

    saveTrips([...trips, newTrip]);

    setDestination('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setNotes('');
    setShowForm(false);
  };

  const deleteTrip = (id: string) => {
    Alert.alert('Delete Trip', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => saveTrips(trips.filter(t => t.id !== id))
      },
    ]);
  };

  const bookedTrips = trips.filter(t => t.booked);
  const plannedTrips = trips.filter(t => !t.booked);

  return (
    <View style={styles.container}>
      <ScrollView>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addBtnText}>
            {showForm ? '✕ Cancel' : '+ Plan New Trip'}
          </Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>New Trip</Text>

            <TextInput
              style={styles.input}
              placeholder="Destination *"
              placeholderTextColor="#999"
              value={destination}
              onChangeText={setDestination}
            />

            <TextInput
              style={styles.input}
              placeholder="Start Date"
              placeholderTextColor="#999"
              value={startDate}
              onChangeText={setStartDate}
            />

            <TextInput
              style={styles.input}
              placeholder="End Date"
              placeholderTextColor="#999"
              value={endDate}
              onChangeText={setEndDate}
            />

            <TextInput
              style={styles.input}
              placeholder="Budget (₹)"
              placeholderTextColor="#999"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes"
              placeholderTextColor="#999"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <TouchableOpacity style={styles.saveBtn} onPress={addTrip}>
              <Text style={styles.saveBtnText}>Save Trip</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Booked Trips */}
        {bookedTrips.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              ✅ Booked Trips ({bookedTrips.length})
            </Text>

            <FlatList
              data={bookedTrips}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={[styles.tripCard, styles.bookedCard]}>
                  <Text style={styles.tripDestination}>✈️ {item.destination}</Text>
                  <Text style={styles.tripDate}>
                    📅 {item.startDate} → {item.endDate}
                  </Text>

                  <TouchableOpacity onPress={() => deleteTrip(item.id)}>
                    <Text style={styles.deleteText}>🗑️ Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        )}

        {/* Planned Trips */}
        <Text style={styles.sectionTitle}>
          🗺️ Planned Trips ({plannedTrips.length})
        </Text>

        <FlatList
          data={plannedTrips}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.tripCard}>
              <Text style={styles.tripDestination}>✈️ {item.destination}</Text>
              <Text style={styles.tripDate}>
                📅 {item.startDate} → {item.endDate}
              </Text>

              <TouchableOpacity onPress={() => deleteTrip(item.id)}>
                <Text style={styles.deleteText}>🗑️ Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 16 },
  addBtn: {
    backgroundColor: '#e94560',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  form: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  input: {
    backgroundColor: '#0f3460',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    marginBottom: 12,
  },
  textArea: { height: 80 },
  saveBtn: {
    backgroundColor: '#e94560',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, color: '#fff', marginBottom: 12 },
  tripCard: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  bookedCard: { borderLeftWidth: 4, borderLeftColor: '#4CAF50' },
  tripDestination: { fontSize: 16, color: '#fff' },
  tripDate: { color: '#aaa', marginTop: 4 },
  deleteText: { color: '#e94560', marginTop: 8 },
});