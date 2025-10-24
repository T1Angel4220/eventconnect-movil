// Componente de botón estilo iOS/Apple

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
import { IOS_COLORS, IOS_SPACING, IOS_RADIUS, IOS_SHADOWS, getIOSColor } from "@/src/constants/iosStyles";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "destructive" | "text";
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

  const styles = createStyles(isDark, variant, size, isDisabled, fullWidth);

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.6}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === "primary" ? "#FFFFFF" : getIOSColor(IOS_COLORS.systemBlue, isDark)} 
          size="small" 
        />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (
  isDark: boolean, 
  variant: string, 
  size: string, 
  isDisabled: boolean,
  fullWidth: boolean
) => {
  const colors = isDark ? IOS_COLORS : IOS_COLORS;
  
  // Obtener estilo base según variante
  let buttonStyle: any = {};
  let textColor = "";

  switch (variant) {
    case "primary":
      buttonStyle = {
        backgroundColor: getIOSColor(colors.systemBlue, isDark),
        ...IOS_SHADOWS.small,
      };
      textColor = "#FFFFFF";
      break;
    
    case "secondary":
      buttonStyle = {
        backgroundColor: getIOSColor(colors.fill.tertiary, isDark),
      };
      textColor = getIOSColor(colors.label.primary, isDark);
      break;
    
    case "outline":
      buttonStyle = {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: getIOSColor(colors.systemBlue, isDark),
      };
      textColor = getIOSColor(colors.systemBlue, isDark);
      break;
    
    case "danger":
    case "destructive":
      buttonStyle = {
        backgroundColor: getIOSColor(colors.red, isDark),
        ...IOS_SHADOWS.small,
      };
      textColor = "#FFFFFF";
      break;
    
    case "text":
      buttonStyle = {
        backgroundColor: "transparent",
      };
      textColor = getIOSColor(colors.systemBlue, isDark);
      break;
  }

  // Obtener padding según tamaño
  let padding = {};
  let fontSize = 17;
  let fontWeight: any = '600';

  switch (size) {
    case "small":
      padding = {
        paddingVertical: IOS_SPACING.sm,
        paddingHorizontal: IOS_SPACING.md,
      };
      fontSize = 15;
      break;
    
    case "medium":
      padding = {
        paddingVertical: IOS_SPACING.md,
        paddingHorizontal: IOS_SPACING.lg,
      };
      fontSize = 17;
      fontWeight = '600';
      break;
    
    case "large":
      padding = {
        paddingVertical: IOS_SPACING.lg,
        paddingHorizontal: IOS_SPACING.xl,
      };
      fontSize = 17;
      fontWeight = '600';
      break;
  }

  return StyleSheet.create({
    button: {
      ...buttonStyle,
      ...padding,
      borderRadius: IOS_RADIUS.button,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      minHeight: 44, // Mínimo de iOS para touch targets
      width: fullWidth ? "100%" : "auto",
      opacity: isDisabled ? 0.4 : 1,
    },
    text: {
      fontSize,
      fontWeight,
      color: textColor,
      letterSpacing: -0.41,
    },
  });
};

export default Button;
