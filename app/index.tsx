import { useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { Href, useRouter } from "expo-router";
import { useAuth } from "@/src/hooks";
import { setNotificationHandler } from "expo-notifications";

// Demasiado importante: configurar el manejador de notificaciones en la raíz de la aplicación
setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Pantalla inicial de la app
 * Redirige al usuario según su estado de autenticación
 */
export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    let route: Href = isAuthenticated ? "/(tabs)" : "/(auth)/login";

    router.replace(route);
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

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
