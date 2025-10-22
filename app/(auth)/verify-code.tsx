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
import { CodeInput } from "@/src/components";
import { authService } from "@/src/services";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_TYPOGRAPHY, IOS_SPACING, IOS_RADIUS, IOS_COLORS, getIOSColor } from "@/src/constants/iosStyles";

/**
 * Pantalla de Verificación de Código - Estilo iOS
 * Verifica el código de 6 dígitos enviado por email
 */
export default function VerifyCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; userId?: string }>();
  const { isDark } = useTheme();

  const email = params.email || "";
  const userId = params.userId ? parseInt(params.userId) : undefined;
  const [, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const styles = createStyles(isDark);

  /**
   * Verifica el código ingresado
   */
  const handleVerifyCode = async (verificationCode: string) => {
    if (!email || !userId) {
      Alert.alert("Error", "Datos de recuperación no proporcionados");
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
        Alert.alert("¡Código Verificado!", "Ahora puedes cambiar tu contraseña", [
          {
            text: "Continuar",
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
        ]);
      } else {
        Alert.alert("Código Inválido", result.message || "El código no es correcto");
        setCode("");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al verificar el código");
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
        Alert.alert("¡Código Reenviado!", "Revisa tu correo electrónico");
        setCode("");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo reenviar el código");
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
            <Text style={styles.backText}>Atrás</Text>
          </TouchableOpacity>

          {/* Espaciador */}
          <View style={styles.spacer} />

          {/* Icono central */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons 
                name="shield-checkmark" 
                size={56} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
              />
            </View>
          </View>

          {/* Título y descripción */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Verifica tu Código</Text>
            <Text style={styles.subtitle}>
              Ingresa el código de 6 dígitos que enviamos a
            </Text>
            <Text style={styles.email}>{email}</Text>
          </View>

          {/* Input de código */}
          <View style={styles.codeContainer}>
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

          {/* Card informativa estilo iOS */}
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

          {/* Botón de reenviar */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>¿No recibiste el código?</Text>
            <TouchableOpacity onPress={handleResendCode} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.resendLink}>Reenviar</Text>
            </TouchableOpacity>
          </View>

          {/* Espaciador final */}
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
      paddingHorizontal: IOS_SPACING.lg, // 20px
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
      height: IOS_SPACING.xl,
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
      marginBottom: IOS_SPACING.sm,
    },
    email: {
      ...IOS_TYPOGRAPHY.headline,
      color: getIOSColor(colors.systemBlue, isDark),
      textAlign: 'center',
    },
    codeContainer: {
      marginBottom: IOS_SPACING.xl,
      alignItems: 'center',
    },
    codeInputWrapper: {
      width: '100%',
      maxWidth: 380, // Ancho máximo para pantallas grandes
      alignSelf: 'center',
    },
    loadingContainer: {
      marginTop: IOS_SPACING.md,
      alignItems: 'center',
    },
    loadingText: {
      ...IOS_TYPOGRAPHY.footnote,
      color: getIOSColor(colors.label.secondary, isDark),
    },
    infoCard: {
      flexDirection: 'row',
      backgroundColor: isDark
        ? 'rgba(142, 142, 147, 0.16)'
        : 'rgba(120, 120, 128, 0.12)',
      borderRadius: IOS_RADIUS.medium,
      padding: IOS_SPACING.md,
      marginBottom: IOS_SPACING.xl,
    },
    infoIcon: {
      marginRight: IOS_SPACING.sm,
      marginTop: 2,
    },
    infoText: {
      ...IOS_TYPOGRAPHY.footnote,
      color: getIOSColor(colors.label.secondary, isDark),
      flex: 1,
      lineHeight: 18,
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: IOS_SPACING.xs,
    },
    resendText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
    },
    resendLink: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.systemBlue, isDark),
      fontWeight: '600',
    },
    bottomSpacer: {
      height: IOS_SPACING.xxxl,
    },
  });
};
