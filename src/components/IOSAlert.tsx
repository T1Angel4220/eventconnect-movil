// Componente de Alerta estilo iOS nativo
// Replica el diseño de UIAlertController de iOS

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_COLORS, getIOSColor, IOS_RADIUS } from "@/src/constants/iosStyles";

export interface AlertButton {
  text: string;
  onPress?: (inputValue?: string) => void;
  style?: "default" | "cancel" | "destructive";
  loading?: boolean;
}

interface IOSAlertProps {
  visible: boolean;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
  // Nuevas props para input
  showInput?: boolean;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (text: string) => void;
  secureTextEntry?: boolean;
  isLoading?: boolean;
}

export const IOSAlert: React.FC<IOSAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: "OK", style: "default" }],
  onDismiss,
  showInput = false,
  inputPlaceholder = "",
  inputValue = "",
  onInputChange,
  secureTextEntry = false,
  isLoading = false,
}) => {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);
  const [showPassword, setShowPassword] = useState(false);

  const handleButtonPress = (button: AlertButton) => {
    if (button.loading || isLoading) return;
    if (button.onPress) {
      // Si hay un input visible, pasar el valor del input al callback
      if (showInput) {
        button.onPress(inputValue);
      } else {
        button.onPress();
      }
    }
    if (onDismiss && !button.loading) {
      onDismiss();
    }
  };

  const getButtonStyle = (button: AlertButton, index: number) => {
    const isLast = index === buttons.length - 1;
    const baseStyle: any[] = [styles.button];

    if (!isLast) {
      baseStyle.push(styles.buttonBorder);
    }

    // Si hay 2 botones, ponerlos horizontalmente
    if (buttons.length === 2) {
      baseStyle.push(styles.buttonHorizontal);
      if (index === 0) {
        baseStyle.push(styles.buttonLeft);
      }
    }

    return baseStyle;
  };

  const getButtonTextStyle = (button: AlertButton) => {
    if (button.style === "cancel") {
      return [styles.buttonText, styles.buttonTextCancel];
    }
    if (button.style === "destructive") {
      return [styles.buttonText, styles.buttonTextDestructive];
    }
    return [styles.buttonText, styles.buttonTextDefault];
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Blur background (solo en iOS) */}
        {Platform.OS === "ios" ? (
          <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
        ) : (
          <View style={styles.overlayBackground} />
        )}

        {/* Alert Container */}
        <View style={styles.alertContainer}>
          <View style={styles.alertBox}>
            {/* Title */}
            {title && <Text style={styles.title}>{title}</Text>}

            {/* Message */}
            {message && (
              <Text style={[styles.message, !title && styles.messageOnly, showInput && styles.messageWithInput]}>
                {message}
              </Text>
            )}

            {/* Input (si se solicita) */}
            {showInput && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={inputValue}
                  onChangeText={onInputChange}
                  placeholder={inputPlaceholder}
                  placeholderTextColor={isDark ? "rgba(235, 235, 245, 0.3)" : "rgba(60, 60, 67, 0.3)"}
                  secureTextEntry={secureTextEntry && !showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                {secureTextEntry && (
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={18}
                      color={isDark ? "rgba(235, 235, 245, 0.6)" : "rgba(60, 60, 67, 0.6)"}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Buttons */}
            <View style={buttons.length === 2 ? styles.buttonsRowContainer : styles.buttonsContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={getButtonStyle(button, index)}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.6}
                  disabled={button.loading || isLoading}
                >
                  {button.loading ? (
                    <ActivityIndicator 
                      size="small" 
                      color={button.style === "destructive" ? "#FF3B30" : "#007AFF"} 
                    />
                  ) : (
                    <Text style={getButtonTextStyle(button)}>{button.text}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (isDark: boolean) => {
  const { width } = Dimensions.get("window");
  const alertWidth = Math.min(width - 80, 270); // iOS alert width

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
      maxWidth: 270,
    },
    alertBox: {
      backgroundColor: isDark
        ? "rgba(58, 58, 60, 0.95)" // iOS dark alert background
        : "rgba(242, 242, 247, 0.95)", // iOS light alert background
      borderRadius: IOS_RADIUS.large,
      overflow: "hidden",
      // iOS shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.5 : 0.3,
      shadowRadius: 20,
      elevation: 10,
    },

    // Title
    title: {
      fontSize: 17,
      fontWeight: "600",
      color: isDark
        ? getIOSColor(IOS_COLORS.label.primary, isDark)
        : "#000000",
      textAlign: "center",
      paddingTop: 20,
      paddingHorizontal: 16,
      letterSpacing: -0.41,
    },

    // Message
    message: {
      fontSize: 13,
      fontWeight: "400",
      color: isDark
        ? getIOSColor(IOS_COLORS.label.primary, isDark)
        : "#000000",
      textAlign: "center",
      paddingHorizontal: 16,
      paddingTop: 4,
      paddingBottom: 20,
      lineHeight: 18,
      letterSpacing: -0.08,
    },
    messageOnly: {
      paddingTop: 20,
    },
    messageWithInput: {
      paddingBottom: 12,
    },

    // Input Container
    inputContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      position: 'relative',
    },
    input: {
      backgroundColor: isDark
        ? "rgba(118, 118, 128, 0.24)"
        : "rgba(255, 255, 255, 0.9)",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      paddingRight: 40,
      fontSize: 14,
      color: isDark
        ? getIOSColor(IOS_COLORS.label.primary, isDark)
        : "#000000",
      borderWidth: 0.5,
      borderColor: isDark
        ? "rgba(84, 84, 88, 0.65)"
        : "rgba(60, 60, 67, 0.29)",
    },
    eyeButton: {
      position: 'absolute',
      right: 24,
      top: '40%',
      marginTop: -9, // La mitad del tamaño del ícono (18px / 2)
      paddingHorizontal: 8,
      paddingVertical: 4,
    },

    // Buttons Container
    buttonsContainer: {
      borderTopWidth: 0.5,
      borderTopColor: isDark
        ? "rgba(84, 84, 88, 0.65)"
        : "rgba(60, 60, 67, 0.29)",
    },
    buttonsRowContainer: {
      flexDirection: "row",
      borderTopWidth: 0.5,
      borderTopColor: isDark
        ? "rgba(84, 84, 88, 0.65)"
        : "rgba(60, 60, 67, 0.29)",
    },

    // Button
    button: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
    },
    buttonHorizontal: {
      flex: 1,
    },
    buttonBorder: {
      borderBottomWidth: 0.5,
      borderBottomColor: isDark
        ? "rgba(84, 84, 88, 0.65)"
        : "rgba(60, 60, 67, 0.29)",
    },
    buttonLeft: {
      borderRightWidth: 0.5,
      borderRightColor: isDark
        ? "rgba(84, 84, 88, 0.65)"
        : "rgba(60, 60, 67, 0.29)",
    },

    // Button Text
    buttonText: {
      fontSize: 17,
      letterSpacing: -0.41,
      fontWeight: "400",
    },
    buttonTextDefault: {
      color: "#007AFF", // iOS Blue
      fontWeight: "600",
    },
    buttonTextCancel: {
      color: "#007AFF", // iOS Blue
      fontWeight: "700", // Semibold para cancel
    },
    buttonTextDestructive: {
      color: "#FF3B30", // iOS Red
      fontWeight: "400",
    },
  });
};

// Función helper para mostrar alertas de forma más sencilla
export const showIOSAlert = (
  title: string,
  message: string,
  buttons?: AlertButton[],
  setAlertConfig?: (config: any) => void
) => {
  if (setAlertConfig) {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons: buttons || [{ text: "OK", style: "default" }],
    });
  }
};

export default IOSAlert;

