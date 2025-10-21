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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button, CodeInput } from "@/src/components";
import { authService } from "@/src/services";
import { Ionicons } from "@expo/vector-icons";

/**
 * Pantalla de Verificación de Código
 * Verifica el código de 6 dígitos enviado por email
 */
export default function VerifyCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; userId?: string }>();

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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={80} color="#3b82f6" />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Verifica tu Código</Text>
          <Text style={styles.subtitle}>
            Ingresa el código de 6 dígitos que enviamos a
          </Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.form}>
          <CodeInput
            length={6}
            onComplete={handleVerifyCode}
            onChangeCode={setCode}
          />

          {isLoading && (
            <Text style={styles.loadingText}>Verificando...</Text>
          )}

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>¿No recibiste el código? </Text>
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendLink}>Reenviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "600",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  email: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  form: {
    gap: 24,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#6b7280",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    color: "#6b7280",
  },
  resendLink: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "600",
  },
});

