// Componente de botón personalizado con soporte para modo oscuro

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "@/src/hooks";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;
  const { isDark } = useTheme();

  // Colores dinámicos según el tema
  const getButtonStyle = () => {
    if (variant === "primary") {
      return {
        backgroundColor: isDark ? "#ffffff" : "#000000",
        borderWidth: 2,
        borderColor: isDark ? "#ffffff" : "#000000",
      };
    }
    if (variant === "outline") {
      return {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: isDark ? "#ffffff" : "#000000",
      };
    }
    if (variant === "danger") {
      return {
        backgroundColor: "#ef4444",
        borderWidth: 2,
        borderColor: "#ef4444",
      };
    }
    return {
      backgroundColor: "#6b7280",
      borderWidth: 2,
      borderColor: "#6b7280",
    };
  };

  const getTextColor = () => {
    if (variant === "primary") {
      return isDark ? "#000000" : "#ffffff";
    }
    if (variant === "outline") {
      return isDark ? "#ffffff" : "#000000";
    }
    return "#ffffff";
  };

  const getLoaderColor = () => {
    if (variant === "primary") {
      return isDark ? "#000000" : "#ffffff";
    }
    if (variant === "outline") {
      return isDark ? "#ffffff" : "#000000";
    }
    return "#ffffff";
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getLoaderColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`${size}Text`],
            { color: getTextColor() },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  // Sizes
  small: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  // Text styles
  text: {
    fontWeight: "700",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});

export default Button;
