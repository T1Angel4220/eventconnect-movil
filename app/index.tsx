import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/hooks";

/**
 * Pantalla inicial de la app
 * Redirige al usuario según su estado de autenticación
 */
export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Usuario autenticado → ir al dashboard
        router.replace("/(tabs)");
      } else {
        // Usuario no autenticado → ir al login
        router.replace("/(auth)/login");
      }
    }
  }, [isLoading, isAuthenticated]);

  // Mostrar loading mientras se verifica la autenticación
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
