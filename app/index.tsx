import { useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { registerForPushNotificationsAsync } from "./notifications.service";

export default function HomeScreen() {
  const fetchToken = async () => {
    const token = await registerForPushNotificationsAsync();
    alert(`Pushs Notification Token: ${token}`);
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <View style={styles.textContainer}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
