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
import { useRouter } from "expo-router";
import { Button, Input } from "@/src/components";
import { useAuth, useTheme } from "@/src/hooks";
import { validateEmail } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { IOS_COLORS, IOS_SHADOWS, getIOSColor } from "@/src/constants/iosStyles";

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
        Alert.alert("Error de Autenticación", result.message);
        setIsLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado. Intenta nuevamente.");
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
            {/* Toggle de tema */}
            <TouchableOpacity
              onPress={toggleTheme}
              style={styles.themeToggle}
              hitSlop={{ top: 10, bottom: 10, left: 12, right: 12 }}
              activeOpacity={0.6}
            >
              <Ionicons 
                name={theme === 'system' ? 'phone-portrait-outline' : isDark ? "sunny" : "moon"} 
                size={20} 
                color={getIOSColor(IOS_COLORS.label.secondary, isDark)} 
              />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Ionicons 
                  name="calendar" 
                  size={48} 
                  color="#FFFFFF"
                />
              </View>
            </View>
            
            <Text style={styles.appName}>Event Connect</Text>
            <Text style={styles.appTagline}>Sistema de Gestión de Eventos</Text>
          </View>

          {/* Título de la pantalla */}
          <Text style={styles.screenTitle}>Iniciar Sesión</Text>

          {/* Formulario */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Input
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
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
                textContentType="emailAddress"
              />
            </View>

            <View style={styles.inputGroup}>
              <Input
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
                error={passwordError}
                icon="lock-closed-outline"
                isPassword
                textContentType="password"
              />
            </View>

            {/* Link de contraseña olvidada */}
            <View style={styles.forgotContainer}>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/forgot-password")}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.6}
              >
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            {/* Botón de login */}
            <View style={styles.buttonContainer}>
              <Button
                title={isLoading ? "Iniciando..." : "Iniciar Sesión"}
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>O</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Link de registro */}
            <View style={styles.registerRow}>
              <Text style={styles.registerQuestion}>¿No tienes una cuenta?</Text>
              <TouchableOpacity 
                onPress={() => router.push("/(auth)/register")}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.6}
              >
                <Text style={styles.registerLink}>Regístrate gratis</Text>
              </TouchableOpacity>
            </View>
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
      paddingHorizontal: 20,
    },
    topSpacer: {
      height: 16,
    },
    
    // Branding Section
    brandContainer: {
      alignItems: 'center',
      marginBottom: 40,
      position: 'relative',
    },
    themeToggle: {
      position: 'absolute',
      top: 20,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark
        ? 'rgba(142, 142, 147, 0.12)'
        : 'rgba(120, 120, 128, 0.08)',
    },
    logoContainer: {
      marginBottom: 80,
    },
    logoBackground: {
      width: 80,
      top:60,
      height: 80,
      borderRadius: 18,
      backgroundColor: getIOSColor(IOS_COLORS.systemBlue, isDark),
      alignItems: 'center',
      justifyContent: 'center',
      ...IOS_SHADOWS.medium,
    },
    appName: {
      fontSize: 26,
      fontWeight: '700',
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: 4,
      letterSpacing: 0.2,
    },
    appTagline: {
      fontSize: 13,
      fontWeight: '400',
      color: getIOSColor(colors.label.tertiary, isDark),
      letterSpacing: -0.08,
    },
    
    // Screen Title
    screenTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: 32,
      letterSpacing: 0.35,
    },
    
    // Form Section
    formSection: {
      gap: 0,
    },
    inputGroup: {
      marginBottom: 16,
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
    buttonContainer: {
      marginBottom: 24,
    },
    
    // Divider
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 0.5,
      backgroundColor: getIOSColor(colors.separator.opaque, isDark),
    },
    dividerText: {
      fontSize: 15,
      fontWeight: '400',
      color: getIOSColor(colors.label.tertiary, isDark),
      paddingHorizontal: 16,
      letterSpacing: -0.24,
    },
    
    // Register Section
    registerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
    },
    registerQuestion: {
      fontSize: 15,
      fontWeight: '400',
      color: getIOSColor(colors.label.secondary, isDark),
      letterSpacing: -0.24,
    },
    registerLink: {
      fontSize: 15,
      fontWeight: '600',
      color: getIOSColor(colors.systemBlue, isDark),
      letterSpacing: -0.24,
    },
    
    bottomSpacer: {
      height: 40,
    },
  });
};
