import { Text, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.textContainer}>
      <Text>Edit app/index.tsx to edit this screen, xd.</Text>
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
