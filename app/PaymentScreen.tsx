import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function PaymentScreen() {
  const router = useRouter();

  // ✅ FIXED PARAMS
  const { name, price, date } = useLocalSearchParams();

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handlePayment = async () => {
    // 🔒 Validation for card
    if (selectedMethod === 'card') {
      if (!cardNumber || !cardHolder || !expiry || !cvv) {
        Alert.alert('Error', 'Please fill all card details!');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        Alert.alert('Error', 'Enter valid 16 digit card number!');
        return;
      }
      if (cvv.length < 3) {
        Alert.alert('Error', 'Enter valid CVV!');
        return;
      }
    }

    setLoading(true);

    setTimeout(async () => {
      setLoading(false);

      const key = `trips_booked`;
      const existing = await AsyncStorage.getItem(key);
      const bookedTrips = existing ? JSON.parse(existing) : [];

      // ✅ STORE DATA
      const newTrip = {
        id: Date.now().toString(),
        destination: name,
        startDate: date || 'TBD',
        endDate: 'TBD',
        budget: String(price),
        notes: 'Booked via TravelEase',
        booked: true,
      };

      bookedTrips.push(newTrip);
      await AsyncStorage.setItem(key, JSON.stringify(bookedTrips));

      // ✅ SUCCESS ALERT
      Alert.alert(
        '✅ Payment Successful!',
        `Trip to ${name}\nDate: ${date}\nAmount: ₹${price}`,
        [{ text: 'OK', onPress: () => router.replace('/HomeScreen') }]
      );
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* 🧾 ORDER SUMMARY */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Destination</Text>
          <Text style={styles.summaryValue}>{name || 'N/A'}</Text>
        </View>

        {/* 📅 DATE */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Date</Text>
          <Text style={styles.summaryValue}>{date || 'N/A'}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount</Text>
          <Text style={styles.summaryPrice}>₹{price || '0'}</Text>
        </View>
      </View>

      {/* 💳 PAYMENT METHOD */}
      <Text style={styles.sectionTitle}>Payment Method</Text>

      <View style={styles.methodRow}>
        <TouchableOpacity
          style={[styles.methodBtn, selectedMethod === 'card' && styles.methodBtnActive]}
          onPress={() => setSelectedMethod('card')}
        >
          <Text style={styles.methodEmoji}>💳</Text>
          <Text style={[styles.methodText, selectedMethod === 'card' && styles.methodTextActive]}>
            Card
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodBtn, selectedMethod === 'upi' && styles.methodBtnActive]}
          onPress={() => setSelectedMethod('upi')}
        >
          <Text style={styles.methodEmoji}>📱</Text>
          <Text style={[styles.methodText, selectedMethod === 'upi' && styles.methodTextActive]}>
            UPI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodBtn, selectedMethod === 'netbanking' && styles.methodBtnActive]}
          onPress={() => setSelectedMethod('netbanking')}
        >
          <Text style={styles.methodEmoji}>🏦</Text>
          <Text style={[styles.methodText, selectedMethod === 'netbanking' && styles.methodTextActive]}>
            Net Banking
          </Text>
        </TouchableOpacity>
      </View>

      {/* 💳 CARD FORM */}
      {selectedMethod === 'card' && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Card Details</Text>

          <TextInput
            style={styles.input}
            placeholder="Card Number"
            placeholderTextColor="#999"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            keyboardType="numeric"
            maxLength={19}
          />

          <TextInput
            style={styles.input}
            placeholder="Card Holder Name"
            placeholderTextColor="#999"
            value={cardHolder}
            onChangeText={setCardHolder}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
              placeholderTextColor="#999"
              value={expiry}
              onChangeText={setExpiry}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              placeholderTextColor="#999"
              value={cvv}
              onChangeText={setCvv}
              secureTextEntry
            />
          </View>
        </View>
      )}

      {/* 📱 UPI */}
      {selectedMethod === 'upi' && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>UPI Payment</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter UPI ID"
            placeholderTextColor="#999"
          />
        </View>
      )}

      {/* 🏦 NET BANKING */}
      {selectedMethod === 'netbanking' && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Select Bank</Text>
          {['SBI', 'HDFC', 'ICICI', 'Axis'].map(bank => (
            <TouchableOpacity key={bank} style={styles.bankItem}>
              <Text style={styles.bankText}>{bank} Bank</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 💰 PAY BUTTON */}
      <TouchableOpacity
        style={styles.payBtn}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payBtnText}>
            Pay ₹{price || '0'} Now 🔒
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.secureText}>🔒 100% Secure Payment</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 16 },

  summaryCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  summaryTitle: { color: '#fff', fontSize: 18, marginBottom: 10 },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },

  summaryLabel: { color: '#aaa' },
  summaryValue: { color: '#fff' },
  summaryPrice: { color: '#e94560', fontWeight: 'bold' },

  sectionTitle: { color: '#fff', fontSize: 16, marginBottom: 10 },

  methodRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },

  methodBtn: {
    flex: 1,
    backgroundColor: '#16213e',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  methodBtnActive: { backgroundColor: '#0f3460' },

  methodEmoji: { fontSize: 20 },
  methodText: { color: '#aaa' },
  methodTextActive: { color: '#fff' },

  form: { backgroundColor: '#16213e', padding: 16, borderRadius: 12 },

  input: {
    backgroundColor: '#0f3460',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: '#fff',
  },

  row: { flexDirection: 'row', gap: 10 },
  halfInput: { flex: 1 },

  bankItem: { padding: 10 },
  bankText: { color: '#fff' },

  payBtn: {
    backgroundColor: '#e94560',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },

  payBtnText: { color: '#fff', fontWeight: 'bold' },

  secureText: { textAlign: 'center', color: '#aaa', marginTop: 10 },
  formTitle: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 10,
},

});