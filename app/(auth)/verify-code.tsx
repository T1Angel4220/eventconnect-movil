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
import { useRouter, useLocalSearchParams } from "expo-router";
import { CodeInput, IOSAlert, AlertButton } from "@/src/components";
import { authService } from "@/src/services";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_COLORS, getIOSColor } from "@/src/constants/iosStyles";

/**
 * Pantalla de Verificación de Código - Diseño iOS Nativo
 */
export default function VerifyCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; userId?: string }>();
  const { isDark } = useTheme();

  const email = params.email || "";
  const userId = params.userId ? parseInt(params.userId) : undefined;
  const [, setCode] = useState("");
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
   * Verifica el código ingresado
   */
  const handleVerifyCode = async (verificationCode: string) => {
    if (!email || !userId) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Datos de recuperación no proporcionados",
        buttons: [{ text: "OK", style: "default" }],
      });
      return;
    }

    try {
      setIsLoading(true);

      const result = await authService.verifyCode({
        email,
        code: verificationCode,
        userId,
      });

      if (result.success && result.resetId) {
        setAlertConfig({
          visible: true,
          title: "¡Código Verificado!",
          message: "Ahora puedes cambiar tu contraseña",
          buttons: [
            {
              text: "Continuar",
              style: "default",
              onPress: () => {
                router.push({
                  pathname: "/(auth)/reset-password",
                  params: {
                    email,
                    resetId: result.resetId!.toString(),
                  },
                });
              },
            },
          ],
        });
      } else {
        setAlertConfig({
          visible: true,
          title: "Código Inválido",
          message: result.message || "El código no es correcto",
          buttons: [{ text: "OK", style: "default" }],
        });
        setCode("");
      }
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Ocurrió un error al verificar el código",
        buttons: [{ text: "OK", style: "default" }],
      });
      console.error("Error verificando código:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reenvía el código
   */
  const handleResendCode = async () => {
    if (!email) return;

    try {
      const result = await authService.forgotPassword({ email });
      
      if (result.success && result.userId) {
        setAlertConfig({
          visible: true,
          title: "¡Código Reenviado!",
          message: "Revisa tu correo electrónico",
          buttons: [{ text: "OK", style: "default" }],
        });
        setCode("");
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
        message: "No se pudo reenviar el código",
        buttons: [{ text: "OK", style: "default" }],
      });
      console.error("Error reenviando código:", error);
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
            <Text style={styles.backText}>Atrás</Text>
          </TouchableOpacity>

          {/* Espaciador superior */}
          <View style={styles.topSpacer} />

          {/* Icono de escudo */}
          <View style={styles.iconSection}>
            <View style={styles.iconCircle}>
              <Ionicons 
                name="shield-checkmark" 
                size={56} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
              />
            </View>
          </View>

          {/* Título y descripción */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Verifica tu Código</Text>
            <Text style={styles.description}>
              Ingresa el código de 6 dígitos que enviamos a
            </Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* Input de código */}
          <View style={styles.codeSection}>
            <View style={styles.codeInputWrapper}>
              <CodeInput
                length={6}
                onComplete={handleVerifyCode}
                onChangeCode={setCode}
              />
            </View>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Verificando...</Text>
              </View>
            )}
          </View>

          {/* Card informativa */}
          <View style={styles.infoCard}>
            <Ionicons 
              name="information-circle" 
              size={20} 
              color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              El código expira en 15 minutos. Revisa tu bandeja de entrada y también la carpeta de spam.
            </Text>
          </View>

          {/* Link de reenviar código con salto de línea */}
          <View style={styles.resendRow}>
            <Text style={styles.resendQuestion}>¿No recibiste el código?</Text>
            <TouchableOpacity 
              onPress={handleResendCode}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.6}
            >
              <Text style={styles.resendLink}>Reenviar</Text>
            </TouchableOpacity>
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
      marginBottom: 4,
    },
    emailText: {
      fontSize: 15,
      fontWeight: '600',
      color: getIOSColor(colors.systemBlue, isDark),
      textAlign: 'center',
      letterSpacing: -0.24,
    },
    
    // Code Section
    codeSection: {
      marginBottom: 32,
      alignItems: 'center',
    },
    codeInputWrapper: {
      width: '100%',
      maxWidth: 380,
      alignSelf: 'center',
    },
    loadingContainer: {
      marginTop: 16,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 13,
      fontWeight: '400',
      color: getIOSColor(colors.label.secondary, isDark),
      letterSpacing: -0.08,
    },
    
    // Info Card
    infoCard: {
      flexDirection: 'row',
      backgroundColor: isDark
        ? 'rgba(142, 142, 147, 0.12)'
        : 'rgba(120, 120, 128, 0.08)',
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
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
    
    // Resend Section
    resendRow: {
      alignItems: 'center',
      gap: 8,
    },
    resendQuestion: {
      fontSize: 15,
      fontWeight: '400',
      color: getIOSColor(colors.label.secondary, isDark),
      letterSpacing: -0.24,
      textAlign: 'center',
    },
    resendLink: {
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
