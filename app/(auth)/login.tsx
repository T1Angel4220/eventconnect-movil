import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Button, Input, IOSAlert, AlertButton } from "@/src/components";
import { useAuth, useTheme } from "@/src/hooks";
import { validateEmail } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { IOS_COLORS, getIOSColor } from "@/src/constants/iosStyles";

/**
 * Pantalla de Login - Diseño iOS Nativo
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
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    let isValid = true;

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "");
      isValid = false;
    } else {
      setEmailError("");
    }

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
        router.replace("/(tabs)");
      } else {
        setAlertConfig({
          visible: true,
          title: "Error de Autenticación",
          message: result.message,
          buttons: [{ text: "OK", style: "default" }],
        });
        setIsLoading(false);
      }
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Ocurrió un error inesperado. Intenta nuevamente.",
        buttons: [{ text: "OK", style: "default" }],
      });
      console.error("Error en login:", error);
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
          bounces={false}
        >
          {/* Espaciador superior */}
          <View style={styles.topSpacer} />

          {/* Logo y Branding */}
          <View style={styles.brandContainer}>
            <Image
              source={
                isDark
                  ? require("@/src/img/logo_light-f.png")
                  : require("@/src/img/logo_dark-f.png")
              }
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>Event Connect</Text>
            <Text style={styles.brandSubtitle}>Sistema de Gestión de Eventos</Text>
          </View>

          {/* Toggle tema - ciclo entre system/light/dark */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.themeToggle}
            activeOpacity={0.6}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name={
                theme === 'system' 
                  ? 'phone-portrait-outline' 
                  : theme === 'dark' 
                  ? 'moon' 
                  : 'sunny'
              }
              size={22}
              color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
            />
          </TouchableOpacity>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
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
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Input
                label="Contraseña"
                placeholder="Tu contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
                error={passwordError}
                icon="lock-closed-outline"
                isPassword
              />
            </View>

            {/* Forgot Password Link */}
            <View style={styles.forgotContainer}>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/forgot-password")}
                activeOpacity={0.6}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Link con salto de línea */}
            <View style={styles.registerSection}>
              <Text style={styles.registerQuestion}>¿No tienes una cuenta?</Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/register")}
                activeOpacity={0.6}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.registerLink}>Regístrate gratis</Text>
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
    topSpacer: {
      height: 100,
    },

    // Brand Section
    brandContainer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 24,
    },
    brandTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: getIOSColor(colors.label.primary, isDark),
      letterSpacing: 0.36,
      textAlign: 'center',
    },
    brandSubtitle: {
      fontSize: 15,
      fontWeight: '400',
      color: getIOSColor(colors.label.secondary, isDark),
      letterSpacing: -0.24,
      textAlign: 'center',
      marginTop: 4,
    },

    // Theme Toggle
    themeToggle: {
      position: 'absolute',
      top: 25,
      right: 20,
      padding: 8,
      borderRadius: 20,
    },
    
    // Form Section
    formSection: {
      gap: 0,
    },
    inputGroup: {
      marginBottom: 20,
    },
    forgotContainer: {
      alignItems: 'flex-end',
      marginBottom: 24,
      marginTop: 4,
    },
    forgotText: {
      fontSize: 15,
      fontWeight: '400',
      color: getIOSColor(colors.systemBlue, isDark),
      letterSpacing: -0.24,
    },

    // Divider
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
      gap: 12,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: isDark
        ? 'rgba(84, 84, 88, 0.65)'
        : 'rgba(60, 60, 67, 0.29)',
    },
    dividerText: {
      fontSize: 15,
      fontWeight: '400',
      color: getIOSColor(colors.label.secondary, isDark),
      letterSpacing: -0.24,
    },

    // Register Section con salto de línea
    registerSection: {
      alignItems: 'center',
      gap: 8,
    },
    registerQuestion: {
      fontSize: 15,
      fontWeight: '400',
      color: getIOSColor(colors.label.secondary, isDark),
      letterSpacing: -0.24,
      textAlign: 'center',
    },
    registerLink: {
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
