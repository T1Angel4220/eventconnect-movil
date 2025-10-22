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
import { useRouter, useLocalSearchParams } from "expo-router";
import { CodeInput } from "@/src/components";
import { authService } from "@/src/services";
import { Ionicons } from "@expo/vector-icons";

/**
 * Pantalla de Verificación de Código
 * Verifica el código de 6 dígitos enviado por email
 */
export default function VerifyCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; userId?: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const email = params.email || "";
  const userId = params.userId ? parseInt(params.userId) : undefined;
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        userId, // Enviar userId al backend
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
                  resetId: result.resetId!.toString(), // Pasar resetId a la siguiente pantalla
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
        setCode(""); // Limpiar código actual
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo reenviar el código");
      console.error("Error reenviando código:", error);
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

        {/* Header con icono */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name="shield-checkmark" 
              size={64} 
              color={isDark ? "#000000" : "#ffffff"} 
            />
          </View>
          <Text style={styles.title}>Event Connect</Text>
          <Text style={styles.subtitle}>Verificar Código</Text>
        </View>

        {/* Card de verificación */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Verifica tu Código</Text>
          <Text style={styles.description}>
            Ingresa el código de 6 dígitos que enviamos a
          </Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.form}>
            <CodeInput
              length={6}
              onComplete={handleVerifyCode}
              onChangeCode={setCode}
            />

            {isLoading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Verificando código...</Text>
              </View>
            )}

            <View style={styles.infoBox}>
              <Ionicons 
                name="information-circle" 
                size={20} 
                color={isDark ? "#9ca3af" : "#6b7280"} 
              />
              <Text style={styles.infoText}>
                El código expira en 15 minutos. Revisa tu bandeja de entrada y la carpeta de spam.
              </Text>
            </View>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>¿No recibiste el código? </Text>
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={styles.resendLink}>Reenviar</Text>
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
      justifyContent: "center",
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
      alignSelf: "flex-start",
    },
    header: {
      alignItems: "center",
      marginBottom: 32,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
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
      fontSize: 32,
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
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#000000",
      marginBottom: 12,
      textAlign: "center",
    },
    description: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
      textAlign: "center",
      marginBottom: 8,
    },
    email: {
      fontSize: 16,
      color: isDark ? "#ffffff" : "#000000",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 32,
    },
    form: {
      gap: 24,
      alignItems: "center",
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    loadingText: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
      fontWeight: "600",
    },
    infoBox: {
      flexDirection: "row",
      backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
      borderRadius: 12,
      padding: 16,
      gap: 12,
      alignItems: "flex-start",
    },
    infoText: {
      flex: 1,
      fontSize: 12,
      color: isDark ? "#9ca3af" : "#6b7280",
      lineHeight: 18,
    },
    resendContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
    },
    resendText: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
    },
    resendLink: {
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
