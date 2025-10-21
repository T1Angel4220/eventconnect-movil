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
import { authService } from "@/src/services";
import { validateEmail } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";

/**
 * Pantalla de Recuperación de Contraseña
 * Solicita el email para enviar código de verificación
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();

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

      if (result.success) {
        Alert.alert(
          "¡Código Enviado!",
          "Revisa tu correo electrónico. Hemos enviado un código de 6 dígitos.",
          [
            {
              text: "Continuar",
              onPress: () => {
                // Navegar a verificación de código y pasar el email
                router.push({
                  pathname: "/(auth)/verify-code",
                  params: { email: email.trim().toLowerCase() },
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <Ionicons name="mail-unread-outline" size={80} color="#3b82f6" />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Recuperar Contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo electrónico y te enviaremos un código de
            verificación
          </Text>
        </View>

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
            title="Enviar Código"
            onPress={handleRequestCode}
            loading={isLoading}
            fullWidth
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "600",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});

