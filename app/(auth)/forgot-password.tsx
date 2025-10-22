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
} from "react-native";
import { useRouter } from "expo-router";
import { Button, Input, IOSAlert, AlertButton } from "@/src/components";
import { validateEmail } from "@/src/utils";
import { authService } from "@/src/services";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_COLORS, getIOSColor } from "@/src/constants/iosStyles";

/**
 * Pantalla de Recuperar Contraseña - Diseño iOS Nativo
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
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
   * Valida el email
   */
  const validateForm = (): boolean => {
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setEmailError(validation.error || "");
      return false;
    }
    setEmailError("");
    return true;
  };

  /**
   * Maneja el envío del código de recuperación
   */
  const handleSendCode = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const result = await authService.forgotPassword({ email });

      if (result.success && result.userId) {
        setAlertConfig({
          visible: true,
          title: "¡Código Enviado!",
          message: "Revisa tu correo electrónico. Te hemos enviado un código de verificación.",
          buttons: [
            {
              text: "Continuar",
              style: "default",
              onPress: () => {
                router.push({
                  pathname: "/(auth)/verify-code",
                  params: {
                    email,
                    userId: result.userId!.toString(),
                  },
                });
              },
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
        message: "Ocurrió un error al enviar el código",
        buttons: [{ text: "OK", style: "default" }],
      });
      console.error("Error en forgot password:", error);
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
          {/* Botón de volver */}
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
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>

          {/* Espaciador superior */}
          <View style={styles.topSpacer} />

          {/* Icono de llave */}
          <View style={styles.iconSection}>
            <View style={styles.iconCircle}>
              <Ionicons 
                name="key" 
                size={56} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
              />
            </View>
          </View>

          {/* Título y descripción */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.description}>
              No te preocupes, te enviaremos un código de verificación a tu email para restablecer tu contraseña.
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formSection}>
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
                textContentType="emailAddress"
              />
            </View>

            {/* Botón de enviar código */}
            <View style={styles.buttonContainer}>
              <Button
                title={isLoading ? "Enviando..." : "Enviar Código de Recuperación"}
                onPress={handleSendCode}
                loading={isLoading}
                fullWidth
              />
            </View>

            {/* Link de login con salto de línea */}
            <View style={styles.loginRow}>
              <Text style={styles.loginQuestion}>¿Recordaste tu contraseña?</Text>
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
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: isDark 
        ? 'rgba(10, 132, 255, 0.15)' 
        : 'rgba(0, 122, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // Header Section
    headerSection: {
      alignItems: 'center',
      marginBottom: 40,
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
    description: {
      fontSize: 15,
      fontWeight: '400',
      color: getIOSColor(colors.label.secondary, isDark),
      textAlign: 'center',
      lineHeight: 22,
      letterSpacing: -0.24,
    },
    
    // Form Section
    formSection: {
      gap: 0,
    },
    inputGroup: {
      marginBottom: 24,
    },
    buttonContainer: {
      marginBottom: 24,
    },
    
    // Login Link Section
    loginRow: {
      alignItems: 'center',
      gap: 8,
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
