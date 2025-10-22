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
  const params = useLocalSearchParams<{ email?: string; resetId?: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const email = params.email || "";
  const resetId = params.resetId ? parseInt(params.resetId) : undefined;

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
    if (!email || !resetId) {
      Alert.alert("Error", "Datos de verificación no válidos");
      return;
    }

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const result = await authService.resetPassword({
        email,
        code: "", // No se usa pero mantenemos la interfaz
        new_password: newPassword,
        resetId, // Enviar resetId al backend
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
              name="key" 
              size={64} 
              color={isDark ? "#000000" : "#ffffff"} 
            />
          </View>
          <Text style={styles.title}>Event Connect</Text>
          <Text style={styles.subtitle}>Nueva Contraseña</Text>
        </View>

        {/* Card de reset */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Restablecer Contraseña</Text>
          <Text style={styles.description}>
            Ingresa tu nueva contraseña. Asegúrate de que sea segura y diferente a la anterior.
          </Text>

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

            <View style={styles.infoBox}>
              <Ionicons 
                name="information-circle" 
                size={20} 
                color={isDark ? "#9ca3af" : "#6b7280"} 
              />
              <Text style={styles.infoText}>
                La contraseña debe tener al menos 8 caracteres, incluir letras mayúsculas, minúsculas, números y caracteres especiales.
              </Text>
            </View>

            <Button
              title="Cambiar Contraseña"
              onPress={handleResetPassword}
              loading={isLoading}
              fullWidth
              style={styles.submitButton}
            />
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
    infoBox: {
      flexDirection: "row",
      backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
      borderRadius: 12,
      padding: 16,
      gap: 12,
      alignItems: "flex-start",
    },
    infoText: {
      flex: 1,
      fontSize: 12,
      color: isDark ? "#9ca3af" : "#6b7280",
      lineHeight: 18,
    },
    submitButton: {
      marginTop: 8,
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
