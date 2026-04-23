import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Details() {
  const { name, price } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20 }}>{name || "No Name"}</Text>
      <Text>₹{price || 0}</Text>

      <Button
        title="Book Now"
        onPress={() =>
          router.push({
            pathname: "/PaymentScreen",
            params: { name, price }
          })
        }
      />
    </View>
  );
}