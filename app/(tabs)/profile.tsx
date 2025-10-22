import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useTheme } from "@/src/hooks";
import { Ionicons } from "@expo/vector-icons";

/**
 * Pantalla de perfil del usuario con opciones de configuración
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, theme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      {/* Header con toggle de tema */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity
          onPress={toggleTheme}
          style={styles.themeToggle}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={theme === 'system' ? 'phone-portrait-outline' : isDark ? "sunny" : "moon"} 
            size={24} 
            color={isDark ? "#fbbf24" : "#000000"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Información del usuario */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons 
              name="person-circle" 
              size={100} 
              color={isDark ? "#ffffff" : "#3b82f6"} 
            />
          </View>
          
          <Text style={styles.name}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role === "participant" ? "Participante" : user?.role}
            </Text>
          </View>
        </View>

        {/* Opciones */}
        <View style={styles.optionsSection}>
          {/* Tema */}
          <View style={styles.optionCard}>
            <View style={styles.optionHeader}>
              <Ionicons 
                name="color-palette" 
                size={24} 
                color={isDark ? "#ffffff" : "#000000"} 
              />
              <Text style={styles.optionTitle}>Tema de la Aplicación</Text>
            </View>
            <View style={styles.themeOptions}>
              <TouchableOpacity 
                style={[
                  styles.themeOption, 
                  theme === 'system' && styles.themeOptionActive
                ]}
                onPress={() => toggleTheme()}
              >
                <Ionicons name="phone-portrait-outline" size={20} color={theme === 'system' ? "#ffffff" : isDark ? "#ffffff" : "#000000"} />
                <Text style={[styles.themeOptionText, theme === 'system' && styles.themeOptionTextActive]}>
                  Sistema
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.themeOption, 
                  theme === 'light' && styles.themeOptionActive
                ]}
                onPress={() => toggleTheme()}
              >
                <Ionicons name="sunny" size={20} color={theme === 'light' ? "#000000" : isDark ? "#ffffff" : "#000000"} />
                <Text style={[styles.themeOptionText, theme === 'light' && styles.themeOptionTextActive]}>
                  Claro
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.themeOption, 
                  theme === 'dark' && styles.themeOptionActive
                ]}
                onPress={() => toggleTheme()}
              >
                <Ionicons name="moon" size={20} color={theme === 'dark' ? "#ffffff" : isDark ? "#ffffff" : "#000000"} />
                <Text style={[styles.themeOptionText, theme === 'dark' && styles.themeOptionTextActive]}>
                  Oscuro
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.themeDescription}>
              {theme === 'system' && 'El tema se ajusta automáticamente según la configuración de tu dispositivo'}
              {theme === 'light' && 'Interfaz con colores claros para mejor visibilidad'}
              {theme === 'dark' && 'Interfaz con colores oscuros para reducir la fatiga visual'}
            </Text>
          </View>

          {/* Cerrar Sesión */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#000000" : "#ffffff",
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#1f2937",
    },
    themeToggle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
      borderWidth: 2,
      borderColor: isDark ? "#374151" : "#e5e7eb",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    profileSection: {
      alignItems: "center",
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    avatarContainer: {
      marginBottom: 16,
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#1f2937",
      marginBottom: 4,
      textAlign: "center",
    },
    email: {
      fontSize: 16,
      color: isDark ? "#9ca3af" : "#6b7280",
      marginBottom: 12,
      textAlign: "center",
    },
    roleBadge: {
      backgroundColor: isDark ? "#1f2937" : "#eff6ff",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? "#3b82f6" : "#3b82f6",
    },
    roleText: {
      fontSize: 14,
      color: "#3b82f6",
      fontWeight: "600",
      textTransform: "capitalize",
    },
    optionsSection: {
      padding: 20,
      gap: 16,
    },
    optionCard: {
      backgroundColor: isDark ? "#000000" : "#ffffff",
      borderRadius: 16,
      borderWidth: 2,
      borderColor: isDark ? "#374151" : "#e5e7eb",
      padding: 20,
      gap: 16,
    },
    optionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    optionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#1f2937",
    },
    themeOptions: {
      flexDirection: "row",
      gap: 12,
    },
    themeOption: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isDark ? "#374151" : "#e5e7eb",
      backgroundColor: isDark ? "#1f2937" : "#f9fafb",
    },
    themeOptionActive: {
      backgroundColor: isDark ? "#ffffff" : "#000000",
      borderColor: isDark ? "#ffffff" : "#000000",
    },
    themeOptionText: {
      fontSize: 14,
      fontWeight: "600",
      color: isDark ? "#ffffff" : "#1f2937",
    },
    themeOptionTextActive: {
      color: isDark ? "#000000" : "#ffffff",
    },
    themeDescription: {
      fontSize: 13,
      color: isDark ? "#9ca3af" : "#6b7280",
      lineHeight: 18,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "#1f2937" : "#fef2f2",
      padding: 18,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: "#ef4444",
      gap: 12,
    },
    logoutText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#ef4444",
    },
  });
