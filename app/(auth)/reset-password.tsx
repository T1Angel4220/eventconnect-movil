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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button, Input, PasswordStrength } from "@/src/components";
import { authService } from "@/src/services";
import { validatePassword, validatePasswordMatch } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";

/**
 * Pantalla de Reseteo de Contraseña
 * Permite cambiar la contraseña con el código verificado
 */
export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; code?: string }>();

  const email = params.email || "";
  const code = params.code || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    let isValid = true;

    // Validar nueva contraseña
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setNewPasswordError(passwordValidation.error || "");
      isValid = false;
    } else {
      setNewPasswordError("");
    }

    // Validar confirmación
    const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchValidation.isValid) {
      setConfirmPasswordError(matchValidation.error || "");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  /**
   * Resetea la contraseña
   */
  const handleResetPassword = async () => {
    if (!email || !code) {
      Alert.alert("Error", "Datos de verificación no válidos");
      return;
    }

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const result = await authService.resetPassword({
        email,
        code,
        new_password: newPassword,
      });

      if (result.success) {
        Alert.alert(
          "¡Contraseña Actualizada!",
          "Tu contraseña ha sido cambiada exitosamente",
          [
            {
              text: "Ir a Login",
              onPress: () => router.replace("/(auth)/login"),
            },
          ]
        );
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al cambiar la contraseña");
      console.error("Error reseteando contraseña:", error);
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
          <Ionicons name="key-outline" size={80} color="#3b82f6" />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Nueva Contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresa tu nueva contraseña para tu cuenta
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nueva Contraseña"
            placeholder="••••••••"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setNewPasswordError("");
            }}
            error={newPasswordError}
            icon="lock-closed-outline"
            isPassword
            autoFocus
          />

          <PasswordStrength password={newPassword} />

          <Input
            label="Confirmar Nueva Contraseña"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError("");
            }}
            error={confirmPasswordError}
            icon="lock-closed-outline"
            isPassword
          />

          <Button
            title="Cambiar Contraseña"
            onPress={handleResetPassword}
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
    gap: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});

