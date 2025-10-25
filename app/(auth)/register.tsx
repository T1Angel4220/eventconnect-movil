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
import { useRouter } from "expo-router";
import {
  Button,
  Input,
  PasswordStrength,
  IOSAlert,
  AlertButton,
} from "@/src/components";
import { validateEmail, validatePassword } from "@/src/utils";
import { authService } from "@/src/services";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import {
  IOS_SPACING,
  IOS_COLORS,
  getIOSColor,
  IOS_RADIUS,
} from "@/src/constants/iosStyles";

/**
 * Pantalla de Registro - Diseño iOS Nativo con Validación en Tiempo Real
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

  // Estado "touched" para mostrar errores solo después de interacción
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

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
   * Validación en tiempo real del email
   */
  useEffect(() => {
    if (touched.email && formData.email) {
      const validation = validateEmail(formData.email);
      if (!validation.isValid) {
        setErrors((prev) => ({ ...prev, email: validation.error || "" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }
  }, [formData.email, touched.email]);

  /**
   * Validación en tiempo real de la contraseña
   */
  useEffect(() => {
    if (touched.password && formData.password) {
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        setErrors((prev) => ({ ...prev, password: validation.error || "" }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  }, [formData.password, touched.password]);

  /**
   * Validación en tiempo real de confirmación de contraseña
   */
  useEffect(() => {
    if (touched.confirmPassword && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Las contraseñas no coinciden",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  }, [formData.password, formData.confirmPassword, touched.confirmPassword]);

  /**
   * Validación en tiempo real de nombre
   */
  useEffect(() => {
    if (touched.firstName && !formData.firstName.trim()) {
      setErrors((prev) => ({ ...prev, firstName: "El nombre es requerido" }));
    } else {
      setErrors((prev) => ({ ...prev, firstName: "" }));
    }
  }, [formData.firstName, touched.firstName]);

  /**
   * Validación en tiempo real de apellido
   */
  useEffect(() => {
    if (touched.lastName && !formData.lastName.trim()) {
      setErrors((prev) => ({ ...prev, lastName: "El apellido es requerido" }));
    } else {
      setErrors((prev) => ({ ...prev, lastName: "" }));
    }
  }, [formData.lastName, touched.lastName]);

  /**
   * Verifica si la contraseña es válida (todos los criterios)
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
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    validateEmail(formData.email).isValid &&
    isPasswordValid(formData.password) &&
    formData.confirmPassword === formData.password &&
    formData.password &&
    formData.confirmPassword;

  /**
   * Actualiza un campo del formulario
   */
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Marcar como tocado
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  /**
   * Maneja el blur de los inputs
   */
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  /**
   * Maneja el registro
   */
  const handleRegister = async () => {
    // Marcar todos los campos como tocados
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validar todo antes de enviar
    if (!formData.firstName.trim()) {
      setErrors((prev) => ({ ...prev, firstName: "El nombre es requerido" }));
      return;
    }

    if (!formData.lastName.trim()) {
      setErrors((prev) => ({ ...prev, lastName: "El apellido es requerido" }));
      return;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setErrors((prev) => ({ ...prev, email: emailValidation.error || "" }));
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setErrors((prev) => ({
        ...prev,
        password: passwordValidation.error || "",
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      return;
    }

    try {
      setIsLoading(true);

      const result = await authService.register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      if (result.success) {
        setAlertConfig({
          visible: true,
          title: "¡Registro Exitoso!",
          message: "Tu cuenta ha sido creada. Ya puedes iniciar sesión.",
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
        message: "Ocurrió un error durante el registro",
        buttons: [{ text: "OK", style: "default" }],
      });
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

          {/* Ícono */}
          <View style={styles.iconSection}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="person-add"
                size={44}
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
              />
            </View>
          </View>

          {/* Título */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>
              Completa tus datos para registrarte en Event Connect
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Fila de nombre y apellido */}
            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                <Input
                  label="Nombre"
                  placeholder="Tu nombre"
                  value={formData.firstName}
                  onChangeText={(text) => updateField("firstName", text)}
                  onBlur={() => handleBlur("firstName")}
                  error={touched.firstName ? errors.firstName : ""}
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
                  onBlur={() => handleBlur("lastName")}
                  error={touched.lastName ? errors.lastName : ""}
                  icon="person-outline"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <Input
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={formData.email}
              onChangeText={(text) => updateField("email", text)}
              onBlur={() => handleBlur("email")}
              error={touched.email ? errors.email : ""}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            {/* Contraseña */}
            <View>
              <Input
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChangeText={(text) => updateField("password", text)}
                onBlur={() => handleBlur("password")}
                error={touched.password ? errors.password : ""}
                icon="lock-closed-outline"
                isPassword
              />

              {/* Mostrar PasswordStrength solo si hay texto */}
              {formData.password.length > 0 && (
                <PasswordStrength password={formData.password} />
              )}
            </View>

            {/* Confirmar contraseña */}
            <Input
              label="Confirmar contraseña"
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField("confirmPassword", text)}
              onBlur={() => handleBlur("confirmPassword")}
              error={touched.confirmPassword ? errors.confirmPassword : ""}
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
                Al registrarte, aceptas los términos y condiciones de Event
                Connect.
              </Text>
            </View>

            {/* Botón de registro */}
            <Button
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={isLoading}
              disabled={!isFormValid}
              fullWidth
              style={styles.registerButton}
            />

            {/* Login link con salto de línea */}
            <View style={styles.loginSection}>
              <Text style={styles.loginQuestion}>¿Ya tienes cuenta?</Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/login")}
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
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      marginTop: 25,
      marginLeft: -8,
    },
    backText: {
      fontSize: 17,
      fontWeight: "400",
      color: getIOSColor(colors.systemBlue, isDark),
      marginLeft: 4,
      letterSpacing: -0.41,
    },
    topSpacer: {
      height: 16,
    },

    // Icon Section
    iconSection: {
      alignItems: "center",
      marginBottom: 24,
    },
    iconCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: isDark
        ? "rgba(10, 132, 255, 0.15)"
        : "rgba(0, 122, 255, 0.1)",
      alignItems: "center",
      justifyContent: "center",
    },

    // Header Section
    headerSection: {
      alignItems: "center",
      marginBottom: 32,
      paddingHorizontal: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: 12,
      textAlign: "center",
      letterSpacing: 0.36,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: "400",
      color: getIOSColor(colors.label.secondary, isDark),
      textAlign: "center",
      lineHeight: 22,
      letterSpacing: -0.24,
    },

    // Form
    formContainer: {
      gap: IOS_SPACING.md,
    },
    rowContainer: {
      flexDirection: "row",
      gap: IOS_SPACING.sm,
    },
    halfWidth: {
      flex: 1,
    },

    // Info Card
    infoCard: {
      flexDirection: "row",
      backgroundColor: isDark
        ? "rgba(142, 142, 147, 0.12)"
        : "rgba(120, 120, 128, 0.08)",
      borderRadius: IOS_RADIUS.medium,
      padding: 16,
      marginTop: IOS_SPACING.xs,
    },
    infoIcon: {
      marginRight: 12,
      marginTop: 2,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      fontWeight: "400",
      color: getIOSColor(colors.label.secondary, isDark),
      lineHeight: 18,
      letterSpacing: -0.08,
    },

    registerButton: {
      marginTop: IOS_SPACING.md,
    },

    // Login Section con salto de línea
    loginSection: {
      alignItems: "center",
      gap: 8,
      marginTop: IOS_SPACING.md,
    },
    loginQuestion: {
      fontSize: 15,
      fontWeight: "400",
      color: getIOSColor(colors.label.secondary, isDark),
      letterSpacing: -0.24,
      textAlign: "center",
    },
    loginLink: {
      fontSize: 15,
      fontWeight: "600",
      color: getIOSColor(colors.systemBlue, isDark),
      letterSpacing: -0.24,
      textAlign: "center",
    },

    bottomSpacer: {
      height: 32,
    },
  });
};
