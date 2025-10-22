import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Button, Input } from "@/src/components";
import { useAuth, useTheme } from "@/src/hooks";
import { validateEmail } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";

/**
 * Pantalla de Login con diseño moderno y soporte para modo claro/oscuro
 */
export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { isDark, toggleTheme, theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    let isValid = true;

    // Validar email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validar contraseña
    if (!password) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  /**
   * Maneja el login
   */
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const result = await login({ email, password });

      if (result.success) {
        // Redirigir al dashboard después del login exitoso
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", result.message);
        setIsLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
      console.error("Error en login:", error);
      setIsLoading(false);
    }
  };

  const styles = createStyles(isDark);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Toggle Button */}
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

        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons 
              name="calendar" 
              size={48} 
              color={isDark ? "#000000" : "#ffffff"} 
            />
          </View>
          <Text style={styles.title}>Event Connect</Text>
          <Text style={styles.subtitle}>Sistema de Gestión de Eventos</Text>
        </View>

        {/* Card de login */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar Sesión</Text>

          <View style={styles.form}>
            <Input
              label="Correo electrónico"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              error={emailError}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              error={passwordError}
              icon="lock-closed-outline"
              isPassword
            />

            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <Button
              title="Ingresar al Panel"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Event Connect - Sistema de Gestión Universitaria
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#000000" : "#ffffff",
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24,
      paddingTop: 60,
    },
    themeToggle: {
      position: "absolute",
      top: 50,
      right: 20,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark ? "#000000" : "#ffffff",
      borderWidth: 2,
      borderColor: isDark ? "#ffffff" : "#e5e7eb",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 1000,
    },
    header: {
      alignItems: "center",
      marginBottom: 32,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 16,
      backgroundColor: isDark ? "#ffffff" : "#000000",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    title: {
      fontSize: 36,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#000000",
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? "#9ca3af" : "#6b7280",
      textAlign: "center",
    },
    card: {
      backgroundColor: isDark ? "#000000" : "#ffffff",
      borderRadius: 16,
      borderWidth: 2,
      borderColor: isDark ? "#ffffff" : "#e5e7eb",
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
    cardTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#000000",
      marginBottom: 24,
      textAlign: "center",
    },
    form: {
      gap: 16,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: 8,
    },
    forgotPasswordText: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
      fontWeight: "600",
    },
    loginButton: {
      marginTop: 8,
    },
    registerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
    },
    registerText: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
    },
    registerLink: {
      fontSize: 14,
      color: isDark ? "#ffffff" : "#000000",
      fontWeight: "700",
    },
    footer: {
      marginTop: 32,
      alignItems: "center",
    },
    footerText: {
      fontSize: 12,
      color: isDark ? "#6b7280" : "#9ca3af",
      textAlign: "center",
    },
  });
