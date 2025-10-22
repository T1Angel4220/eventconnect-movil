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
import { Button, Input, PasswordStrength } from "@/src/components";
import { validateEmail, validatePassword, getPasswordStrength } from "@/src/utils";
import { authService } from "@/src/services";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_TYPOGRAPHY, IOS_SPACING, IOS_RADIUS, IOS_COLORS, getIOSColor } from "@/src/constants/iosStyles";

/**
 * Pantalla de Registro - Estilo iOS/Apple
 */
export default function RegisterScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const styles = createStyles(isDark);
  const passwordStrength = getPasswordStrength(formData.password);

  /**
   * Actualiza un campo del formulario
   */
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
      isValid = false;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || "";
      isValid = false;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error || "";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Maneja el registro
   */
  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const result = await authService.register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      if (result.success) {
        Alert.alert(
          "¡Registro Exitoso!",
          "Tu cuenta ha sido creada. Ya puedes iniciar sesión.",
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
      Alert.alert("Error", "Ocurrió un error durante el registro");
      console.error("Error en registro:", error);
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

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.iconCircle}>
              <Ionicons 
                name="person-add" 
                size={36} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
              />
            </View>
          </View>

          {/* Título */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>
              Completa tus datos para registrarte
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                <Input
                  label="Nombre"
                  placeholder="Tu nombre"
                  value={formData.firstName}
                  onChangeText={(text) => updateField("firstName", text)}
                  error={errors.firstName}
                  icon="person-outline"
                  autoCapitalize="words"
                />
              </View>
              
              <View style={styles.halfWidth}>
                <Input
                  label="Apellido"
                  placeholder="Tu apellido"
                  value={formData.lastName}
                  onChangeText={(text) => updateField("lastName", text)}
                  error={errors.lastName}
                  icon="person-outline"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <Input
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={formData.email}
              onChangeText={(text) => updateField("email", text)}
              error={errors.email}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChangeText={(text) => updateField("password", text)}
              error={errors.password}
              icon="lock-closed-outline"
              isPassword
            />

            {formData.password.length > 0 && (
              <PasswordStrength strength={passwordStrength} />
            )}

            <Input
              label="Confirmar contraseña"
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField("confirmPassword", text)}
              error={errors.confirmPassword}
              icon="lock-closed-outline"
              isPassword
            />

            {/* Botón de registro */}
            <Button
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              style={styles.registerButton}
            />

            {/* Login link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
              <TouchableOpacity 
                onPress={() => router.push("/(auth)/login")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.loginLink}>Inicia Sesión</Text>
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
      height: IOS_SPACING.lg,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: IOS_SPACING.lg,
    },
    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: isDark 
        ? 'rgba(10, 132, 255, 0.15)' 
        : 'rgba(0, 122, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: IOS_SPACING.xl,
    },
    title: {
      ...IOS_TYPOGRAPHY.largeTitle,
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: IOS_SPACING.sm,
      textAlign: 'center',
    },
    subtitle: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
      textAlign: 'center',
    },
    formContainer: {
      gap: IOS_SPACING.md,
    },
    rowContainer: {
      flexDirection: 'row',
      gap: IOS_SPACING.sm,
    },
    halfWidth: {
      flex: 1,
    },
    registerButton: {
      marginTop: IOS_SPACING.md,
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: IOS_SPACING.lg,
      gap: IOS_SPACING.xs,
    },
    loginText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
    },
    loginLink: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.systemBlue, isDark),
      fontWeight: '600',
    },
    bottomSpacer: {
      height: IOS_SPACING.xl,
    },
  });
};
