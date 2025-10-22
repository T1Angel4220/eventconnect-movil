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
import { validateEmail } from "@/src/utils";
import { authService } from "@/src/services";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_TYPOGRAPHY, IOS_SPACING, IOS_RADIUS, IOS_COLORS, getIOSColor } from "@/src/constants/iosStyles";

/**
 * Pantalla de Recuperar Contraseña - Estilo iOS/Apple
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        Alert.alert(
          "¡Código Enviado!",
          "Revisa tu correo electrónico. Te hemos enviado un código de verificación.",
          [
            {
              text: "Continuar",
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
          ]
        );
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al enviar el código");
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
                name="key" 
                size={44} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
              />
            </View>
          </View>

          {/* Título y descripción */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.subtitle}>
              No te preocupes, te enviaremos un código de verificación a tu email para restablecer tu contraseña.
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
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

            {/* Botón de enviar código */}
            <Button
              title="Enviar Código de Recuperación"
              onPress={handleSendCode}
              loading={isLoading}
              fullWidth
              style={styles.sendButton}
            />

            {/* Recordaste contraseña */}
            <View style={styles.rememberContainer}>
              <Text style={styles.rememberText}>¿Recordaste tu contraseña?</Text>
              <TouchableOpacity 
                onPress={() => router.push("/(auth)/login")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.rememberLink}>Iniciar Sesión</Text>
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
    sendButton: {
      marginTop: IOS_SPACING.md,
    },
    rememberContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: IOS_SPACING.xl,
      gap: IOS_SPACING.xs,
    },
    rememberText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
    },
    rememberLink: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.systemBlue, isDark),
      fontWeight: '600',
    },
    bottomSpacer: {
      height: IOS_SPACING.xxxl,
    },
  });
};
