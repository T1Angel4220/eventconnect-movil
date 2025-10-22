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
import { Button, Input, PasswordStrength } from "@/src/components";
import { useAuth } from "@/src/hooks";
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePasswordMatch,
} from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";

/**
 * Pantalla de Registro con diseño moderno y soporte para modo claro/oscuro
 */
export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    let isValid = true;

    // Validar nombres
    const firstNameValidation = validateName(firstName, "nombre");
    if (!firstNameValidation.isValid) {
      setFirstNameError(firstNameValidation.error || "");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    const lastNameValidation = validateName(lastName, "apellido");
    if (!lastNameValidation.isValid) {
      setLastNameError(lastNameValidation.error || "");
      isValid = false;
    } else {
      setLastNameError("");
    }

    // Validar email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validar contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || "");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Validar confirmación
    const matchValidation = validatePasswordMatch(password, confirmPassword);
    if (!matchValidation.isValid) {
      setConfirmPasswordError(matchValidation.error || "");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  /**
   * Maneja el registro
   */
  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const result = await register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.success) {
        Alert.alert(
          "¡Bienvenido a EventConnect!",
          "Tu cuenta ha sido creada exitosamente.",
          [
            {
              text: "Continuar",
              onPress: () => router.replace("/(tabs)"),
            },
          ]
        );
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
      console.error("Error en registro:", error);
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

        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons 
              name="person-add" 
              size={40} 
              color={isDark ? "#000000" : "#ffffff"} 
            />
          </View>
          <Text style={styles.title}>Event Connect</Text>
          <Text style={styles.subtitle}>Registro de Organizador</Text>
        </View>

        {/* Card de registro */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Crear Cuenta</Text>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label="Nombre"
                  placeholder="Tu nombre"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    setFirstNameError("");
                  }}
                  error={firstNameError}
                  icon="person-outline"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.halfWidth}>
                <Input
                  label="Apellido"
                  placeholder="Tu apellido"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    setLastNameError("");
                  }}
                  error={lastNameError}
                  icon="person-outline"
                  autoCapitalize="words"
                />
              </View>
            </View>

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

            <PasswordStrength password={password} />

            <Input
              label="Confirmar Contraseña"
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
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Inicia Sesión</Text>
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
    row: {
      flexDirection: "row",
      gap: 12,
    },
    halfWidth: {
      flex: 1,
    },
    registerButton: {
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
