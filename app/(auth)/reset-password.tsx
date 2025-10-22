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
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button, Input, PasswordStrength } from "@/src/components";
import { validatePassword, getPasswordStrength } from "@/src/utils";
import { authService } from "@/src/services";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_TYPOGRAPHY, IOS_SPACING, IOS_RADIUS, IOS_COLORS, getIOSColor } from "@/src/constants/iosStyles";

/**
 * Pantalla de Restablecer Contraseña - Estilo iOS/Apple
 */
export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; resetId?: string }>();
  const { isDark } = useTheme();

  const email = params.email || "";
  const resetId = params.resetId ? parseInt(params.resetId) : undefined;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const styles = createStyles(isDark);
  const passwordStrength = getPasswordStrength(password);

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    let isValid = true;

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || "");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmError("Las contraseñas no coinciden");
      isValid = false;
    } else {
      setConfirmError("");
    }

    return isValid;
  };

  /**
   * Maneja el cambio de contraseña
   */
  const handleResetPassword = async () => {
    if (!validateForm()) return;

    if (!email || !resetId) {
      Alert.alert("Error", "Datos de recuperación no válidos");
      return;
    }

    try {
      setIsLoading(true);

      const result = await authService.resetPassword({
        email,
        resetId,
        newPassword: password,
      });

      if (result.success) {
        Alert.alert(
          "¡Contraseña Actualizada!",
          "Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión.",
          [
            {
              text: "Iniciar Sesión",
              onPress: () => router.replace("/(auth)/login"),
            },
          ]
        );
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al cambiar la contraseña");
      console.error("Error en reset password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Botón de volver estilo iOS */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="chevron-back" 
              size={28} 
              color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
            />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>

          {/* Espaciador */}
          <View style={styles.spacer} />

          {/* Icono central */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons 
                name="lock-closed" 
                size={44} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
              />
            </View>
          </View>

          {/* Título y descripción */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Crear Nueva Contraseña</Text>
            <Text style={styles.subtitle}>
              Tu nueva contraseña debe ser diferente a las anteriores
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <Input
              label="Nueva contraseña"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              error={passwordError}
              icon="lock-closed-outline"
              isPassword
            />

            {password.length > 0 && (
              <PasswordStrength strength={passwordStrength} />
            )}

            <Input
              label="Confirmar contraseña"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmError("");
              }}
              error={confirmError}
              icon="lock-closed-outline"
              isPassword
            />

            {/* Info card */}
            <View style={styles.infoCard}>
              <Ionicons 
                name="information-circle" 
                size={18} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Usa al menos 8 caracteres con una combinación de letras, números y símbolos.
              </Text>
            </View>

            {/* Botón de restablecer */}
            <Button
              title="Restablecer Contraseña"
              onPress={handleResetPassword}
              loading={isLoading}
              fullWidth
              style={styles.resetButton}
            />

            {/* Volver al login */}
            <TouchableOpacity 
              onPress={() => router.replace("/(auth)/login")}
              style={styles.loginButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.loginLink}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Espaciador inferior */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => {
  const colors = isDark ? IOS_COLORS : IOS_COLORS;
  
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: getIOSColor(colors.background.primary, isDark),
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: IOS_SPACING.lg,
      paddingBottom: IOS_SPACING.xl,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: IOS_SPACING.sm,
      marginTop: IOS_SPACING.sm,
      marginLeft: -IOS_SPACING.sm,
    },
    backText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.systemBlue, isDark),
      marginLeft: 2,
    },
    spacer: {
      height: IOS_SPACING.xxxl,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: IOS_SPACING.xl,
    },
    iconCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDark 
        ? 'rgba(10, 132, 255, 0.15)' 
        : 'rgba(0, 122, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: IOS_SPACING.xxxl,
      paddingHorizontal: IOS_SPACING.sm,
    },
    title: {
      ...IOS_TYPOGRAPHY.largeTitle,
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: IOS_SPACING.md,
      textAlign: 'center',
    },
    subtitle: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
      textAlign: 'center',
      lineHeight: 24,
    },
    formContainer: {
      gap: IOS_SPACING.md,
    },
    infoCard: {
      flexDirection: 'row',
      backgroundColor: isDark
        ? 'rgba(142, 142, 147, 0.16)'
        : 'rgba(120, 120, 128, 0.12)',
      borderRadius: IOS_RADIUS.medium,
      padding: IOS_SPACING.md,
      marginTop: IOS_SPACING.sm,
    },
    infoIcon: {
      marginRight: IOS_SPACING.sm,
      marginTop: 1,
    },
    infoText: {
      ...IOS_TYPOGRAPHY.footnote,
      color: getIOSColor(colors.label.secondary, isDark),
      flex: 1,
      lineHeight: 18,
    },
    resetButton: {
      marginTop: IOS_SPACING.md,
    },
    loginButton: {
      alignItems: 'center',
      paddingVertical: IOS_SPACING.md,
      marginTop: IOS_SPACING.sm,
    },
    loginLink: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.systemBlue, isDark),
      fontWeight: '600',
    },
    bottomSpacer: {
      height: IOS_SPACING.xxxl,
    },
  });
};
