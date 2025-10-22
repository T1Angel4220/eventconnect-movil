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
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Button, Input } from "@/src/components";
import { authService } from "@/src/services";
import { validateEmail } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";

/**
 * Pantalla de Recuperación de Contraseña
 * Solicita el email para enviar código de verificación
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    const emailValidation = validateEmail(email);
    
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  /**
   * Solicita el código de recuperación
   */
  const handleRequestCode = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const result = await authService.forgotPassword({ email: email.trim().toLowerCase() });

      if (result.success && result.userId) {
        Alert.alert(
          "¡Código Enviado!",
          "Revisa tu correo electrónico. Hemos enviado un código de 6 dígitos.",
          [
            {
              text: "Continuar",
              onPress: () => {
                // Navegar a verificación de código y pasar email y userId
                router.push({
                  pathname: "/(auth)/verify-code",
                  params: {
                    email: email.trim().toLowerCase(),
                    userId: result.userId!.toString(),
                  },
                });
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
      console.error("Error solicitando código:", error);
    } finally {
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
        {/* Botón de volver */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? "#ffffff" : "#000000"} 
          />
        </TouchableOpacity>

        {/* Header con icono */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name="mail-unread" 
              size={64} 
              color={isDark ? "#000000" : "#ffffff"} 
            />
          </View>
          <Text style={styles.title}>Event Connect</Text>
          <Text style={styles.subtitle}>Recuperar Contraseña</Text>
        </View>

        {/* Card de recuperación */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.description}>
            No te preocupes, te enviaremos un código de verificación a tu email para restablecer tu contraseña.
          </Text>

          <View style={styles.form}>
            <Input
              label="Correo electrónico"
              placeholder="tu@email.com"
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
              autoFocus
            />

            <Button
              title="Enviar Código de Recuperación"
              onPress={handleRequestCode}
              loading={isLoading}
              fullWidth
              style={styles.submitButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Recordaste tu contraseña? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Iniciar Sesión</Text>
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
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
      alignSelf: "flex-start",
    },
    header: {
      alignItems: "center",
      marginBottom: 32,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
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
      fontSize: 32,
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
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#000000",
      marginBottom: 12,
      textAlign: "center",
    },
    description: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 20,
    },
    form: {
      gap: 16,
    },
    submitButton: {
      marginTop: 8,
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
    },
    loginText: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
    },
    loginLink: {
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
