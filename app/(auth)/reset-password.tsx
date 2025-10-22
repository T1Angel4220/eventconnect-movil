import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button, Input, PasswordStrength, IOSAlert, AlertButton } from "@/src/components";
import { validatePassword } from "@/src/utils";
import { authService } from "@/src/services";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_SPACING, IOS_COLORS, getIOSColor, IOS_RADIUS } from "@/src/constants/iosStyles";

/**
 * Pantalla de Restablecer Contraseña - Diseño iOS Nativo con Validación en Tiempo Real
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

  // Estado "touched" para mostrar errores solo después de interacción
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  // Estado para la alerta iOS
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons: AlertButton[];
  }>({
    visible: false,
    title: "",
    message: "",
    buttons: [{ text: "OK", style: "default" }],
  });

  const styles = createStyles(isDark);

  /**
   * Validación en tiempo real de la contraseña
   */
  useEffect(() => {
    if (touched.password && password) {
      const validation = validatePassword(password);
      if (!validation.isValid) {
        setPasswordError(validation.error || "");
      } else {
        setPasswordError("");
      }
    }
  }, [password, touched.password]);

  /**
   * Validación en tiempo real de confirmación de contraseña
   */
  useEffect(() => {
    if (touched.confirmPassword && confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmError("Las contraseñas no coinciden");
      } else {
        setConfirmError("");
      }
    }
  }, [password, confirmPassword, touched.confirmPassword]);

  /**
   * Verifica si todos los criterios de contraseña se cumplen
   */
  const isPasswordValid = (pwd: string): boolean => {
    if (!pwd) return false;
    
    const hasMinLength = pwd.length >= 8;
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    
    return hasMinLength && hasLowerCase && hasUpperCase && hasNumber;
  };

  /**
   * Verifica si el formulario es válido
   */
  const isFormValid = 
    isPasswordValid(password) && 
    confirmPassword === password &&
    password && 
    confirmPassword;

  /**
   * Maneja el cambio de contraseña
   */
  const handleResetPassword = async () => {
    // Marcar todos los campos como tocados
    setTouched({ password: true, confirmPassword: true });

    // Validar contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || "");
      return;
    }

    // Validar confirmación
    if (password !== confirmPassword) {
      setConfirmError("Las contraseñas no coinciden");
      return;
    }

    if (!email || !resetId) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Datos de recuperación no válidos",
        buttons: [{ text: "OK", style: "default" }],
      });
      return;
    }

    try {
      setIsLoading(true);

      const result = await authService.resetPassword({
        email,
        resetId,
        new_password: password,
      });

      if (result.success) {
        setAlertConfig({
          visible: true,
          title: "¡Contraseña Actualizada!",
          message: "Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión.",
          buttons: [
            {
              text: "Iniciar Sesión",
              style: "default",
              onPress: () => router.replace("/(auth)/login"),
            },
          ],
        });
      } else {
        setAlertConfig({
          visible: true,
          title: "Error",
          message: result.message,
          buttons: [{ text: "OK", style: "default" }],
        });
      }
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Ocurrió un error al cambiar la contraseña",
        buttons: [{ text: "OK", style: "default" }],
      });
      console.error("Error en reset password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja el blur de los inputs
   */
  const handleBlur = (field: "password" | "confirmPassword") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
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
          bounces={false}
        >
          {/* Botón de volver estilo iOS */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.6}
          >
            <Ionicons 
              name="chevron-back" 
              size={28} 
              color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
            />
            <Text style={styles.backText}>Atrás</Text>
          </TouchableOpacity>

          {/* Espaciador */}
          <View style={styles.topSpacer} />

          {/* Icono central */}
          <View style={styles.iconSection}>
            <View style={styles.iconCircle}>
              <Ionicons 
                name="lock-closed" 
                size={48} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
              />
            </View>
          </View>

          {/* Título y descripción */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Crear Nueva Contraseña</Text>
            <Text style={styles.subtitle}>
              Tu nueva contraseña debe ser diferente a las anteriores
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Input de nueva contraseña */}
            <View>
              <Input
                label="Nueva contraseña"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (!touched.password) {
                    setTouched((prev) => ({ ...prev, password: true }));
                  }
                }}
                onBlur={() => handleBlur("password")}
                error={touched.password ? passwordError : ""}
                icon="lock-closed-outline"
                isPassword
              />

              {/* Mostrar PasswordStrength solo si hay texto */}
              {password.length > 0 && (
                <PasswordStrength password={password} />
              )}
            </View>

            {/* Input de confirmar contraseña */}
            <Input
              label="Confirmar contraseña"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (!touched.confirmPassword) {
                  setTouched((prev) => ({ ...prev, confirmPassword: true }));
                }
              }}
              onBlur={() => handleBlur("confirmPassword")}
              error={touched.confirmPassword ? confirmError : ""}
              icon="lock-closed-outline"
              isPassword
            />

            {/* Info card */}
            <View style={styles.infoCard}>
              <Ionicons 
                name="information-circle" 
                size={20} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Usa al menos 8 caracteres con una combinación de letras mayúsculas, minúsculas y números.
              </Text>
            </View>

            {/* Botón de restablecer */}
            <Button
              title="Restablecer Contraseña"
              onPress={handleResetPassword}
              loading={isLoading}
              disabled={!isFormValid}
              fullWidth
              style={styles.resetButton}
            />

            {/* Volver al login */}
            <View style={styles.loginSection}>
              <Text style={styles.loginQuestion}>¿Recordaste tu contraseña?</Text>
              <TouchableOpacity 
                onPress={() => router.replace("/(auth)/login")}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.6}
              >
                <Text style={styles.loginLink}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Espaciador inferior */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Alerta iOS */}
      <IOSAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
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
      paddingHorizontal: 20,
    },
    
    // Back Button
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      marginTop: 25,
      marginLeft: -8,
    },
    backText: {
      fontSize: 17,
      fontWeight: '400',
      color: getIOSColor(colors.systemBlue, isDark),
      marginLeft: 4,
      letterSpacing: -0.41,
    },
    topSpacer: {
      height: 24,
    },
    
    // Icon Section
    iconSection: {
      alignItems: 'center',
      marginBottom: 32,
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
    
    // Header Section
    headerSection: {
      alignItems: 'center',
      marginBottom: 36,
      paddingHorizontal: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: 12,
      textAlign: 'center',
      letterSpacing: 0.36,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '400',
      color: getIOSColor(colors.label.secondary, isDark),
      textAlign: 'center',
      lineHeight: 22,
      letterSpacing: -0.24,
    },
    
    // Form
    formContainer: {
      gap: IOS_SPACING.md,
    },
    
    // Info Card
    infoCard: {
      flexDirection: 'row',
      backgroundColor: isDark
        ? 'rgba(142, 142, 147, 0.12)'
        : 'rgba(120, 120, 128, 0.08)',
      borderRadius: IOS_RADIUS.medium,
      padding: 16,
      marginTop: IOS_SPACING.sm,
    },
    infoIcon: {
      marginRight: 12,
      marginTop: 2,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      fontWeight: '400',
      color: getIOSColor(colors.label.secondary, isDark),
      lineHeight: 18,
      letterSpacing: -0.08,
    },
    
    resetButton: {
      marginTop: IOS_SPACING.md,
    },
    
    // Login Section
    loginSection: {
      alignItems: 'center',
      gap: 8,
      marginTop: IOS_SPACING.sm,
    },
    loginQuestion: {
      fontSize: 15,
      fontWeight: '400',
      color: getIOSColor(colors.label.secondary, isDark),
      letterSpacing: -0.24,
      textAlign: 'center',
    },
    loginLink: {
      fontSize: 15,
      fontWeight: '600',
      color: getIOSColor(colors.systemBlue, isDark),
      letterSpacing: -0.24,
      textAlign: 'center',
    },
    
    bottomSpacer: {
      height: 40,
    },
  });
};
