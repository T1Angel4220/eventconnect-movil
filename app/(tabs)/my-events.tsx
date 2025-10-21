import { View, Text, StyleSheet } from "react-native";

/**
 * Pantalla de mis inscripciones
 * Muestra los eventos a los que el usuario está inscrito
 */
export default function MyEventsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Inscripciones</Text>
      <Text style={styles.subtitle}>Próximamente...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
});

