// Componente de Alerta de Éxito/Error estilo iOS
// Diseño inspirado en las alertas de Apple con íconos y animaciones

import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_COLORS, getIOSColor, IOS_RADIUS } from "@/src/constants/iosStyles";

export type AlertType = "success" | "error" | "warning" | "info";

interface IOSSuccessAlertProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message?: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
  showButton?: boolean;
  buttonText?: string;
}

export const IOSSuccessAlert: React.FC<IOSSuccessAlertProps> = ({
  visible,
  type = "success",
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDuration = 2500,
  showButton = true,
  buttonText = "Entendido",
}) => {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);
  
  // Animación de escala
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const iconScaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animar entrada
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(100),
          Animated.spring(iconScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 5,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Auto-cerrar si está habilitado
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDuration);
        return () => clearTimeout(timer);
      }
    } else {
      scaleAnim.setValue(0);
      iconScaleAnim.setValue(0);
    }
  }, [visible, autoClose, autoCloseDuration]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(iconScaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getIconConfig = () => {
    switch (type) {
      case "success":
        return {
          name: "checkmark-circle" as const,
          color: "#34C759", // iOS Green
          backgroundColor: isDark ? "rgba(52, 199, 89, 0.15)" : "rgba(52, 199, 89, 0.1)",
        };
      case "error":
        return {
          name: "close-circle" as const,
          color: "#FF3B30", // iOS Red
          backgroundColor: isDark ? "rgba(255, 59, 48, 0.15)" : "rgba(255, 59, 48, 0.1)",
        };
      case "warning":
        return {
          name: "warning" as const,
          color: "#FF9500", // iOS Orange
          backgroundColor: isDark ? "rgba(255, 149, 0, 0.15)" : "rgba(255, 149, 0, 0.1)",
        };
      case "info":
        return {
          name: "information-circle" as const,
          color: "#007AFF", // iOS Blue
          backgroundColor: isDark ? "rgba(0, 122, 255, 0.15)" : "rgba(0, 122, 255, 0.1)",
        };
      default:
        return {
          name: "checkmark-circle" as const,
          color: "#34C759",
          backgroundColor: isDark ? "rgba(52, 199, 89, 0.15)" : "rgba(52, 199, 89, 0.1)",
        };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Blur background (solo en iOS) */}
        {Platform.OS === "ios" ? (
          <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
        ) : (
          <View style={styles.overlayBackground} />
        )}

        {/* Alert Container con animación */}
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.alertBox}>
            {/* Ícono animado */}
            <Animated.View
              style={[
                styles.iconContainer,
                { backgroundColor: iconConfig.backgroundColor },
                {
                  transform: [{ scale: iconScaleAnim }],
                },
              ]}
            >
              <Ionicons name={iconConfig.name} size={48} color={iconConfig.color} />
            </Animated.View>

            {/* Título */}
            <Text style={styles.title}>{title}</Text>

            {/* Mensaje */}
            {message && <Text style={styles.message}>{message}</Text>}

            {/* Botón (opcional) */}
            {showButton && (
              <TouchableOpacity
                style={[styles.button, { borderColor: iconConfig.color }]}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, { color: iconConfig.color }]}>
                  {buttonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const createStyles = (isDark: boolean) => {
  const { width } = Dimensions.get("window");
  const alertWidth = Math.min(width - 60, 320);

  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.4)",
    },
    overlayBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.4)",
    },
    alertContainer: {
      width: alertWidth,
      maxWidth: 320,
    },
    alertBox: {
      backgroundColor: isDark
        ? "rgba(28, 28, 30, 0.98)"
        : "rgba(255, 255, 255, 0.98)",
      borderRadius: IOS_RADIUS.xlarge,
      padding: 24,
      alignItems: "center",
      // iOS shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.5 : 0.2,
      shadowRadius: 20,
      elevation: 10,
    },

    // Ícono
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },

    // Título
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: isDark
        ? getIOSColor(IOS_COLORS.label.primary, isDark)
        : "#000000",
      textAlign: "center",
      marginBottom: 8,
      letterSpacing: -0.5,
    },

    // Mensaje
    message: {
      fontSize: 15,
      fontWeight: "400",
      color: isDark
        ? getIOSColor(IOS_COLORS.label.secondary, isDark)
        : "rgba(60, 60, 67, 0.6)",
      textAlign: "center",
      lineHeight: 21,
      marginBottom: 20,
      letterSpacing: -0.24,
    },

    // Botón
    button: {
      width: "100%",
      paddingVertical: 14,
      borderRadius: IOS_RADIUS.button,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: 17,
      fontWeight: "600",
      letterSpacing: -0.41,
    },
  });
};

export default IOSSuccessAlert;

