// Componente de input estilo iOS/Apple

import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_COLORS, IOS_SPACING, IOS_RADIUS, IOS_TYPOGRAPHY, getIOSColor } from "@/src/constants/iosStyles";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  isPassword = false,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { isDark } = useTheme();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const styles = createStyles(isDark, isFocused, !!error);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View style={styles.inputContainer}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={styles.iconColor.color}
            style={styles.icon}
          />
        )}
        
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={getIOSColor(IOS_COLORS.label.tertiary, isDark)}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={getIOSColor(IOS_COLORS.label.tertiary, isDark)}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const createStyles = (isDark: boolean, isFocused: boolean, hasError: boolean) => {
  const colors = isDark ? IOS_COLORS : IOS_COLORS;
  
  let borderColor = getIOSColor(colors.separator.opaque, isDark);
  let iconColor = getIOSColor(colors.label.secondary, isDark);
  
  if (hasError) {
    borderColor = getIOSColor(colors.red, isDark);
    iconColor = getIOSColor(colors.red, isDark);
  } else if (isFocused) {
    borderColor = getIOSColor(colors.systemBlue, isDark);
    iconColor = getIOSColor(colors.systemBlue, isDark);
  }

  return StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    label: {
      fontSize: 13,
      fontWeight: '600', // Negritas (Semibold)
      color: getIOSColor(colors.label.primary, isDark), // Negro en light, blanco en dark
      marginBottom: IOS_SPACING.xs,
      paddingLeft: 2,
      letterSpacing: -0.08,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark 
        ? getIOSColor(colors.fill.tertiary, isDark)
        : getIOSColor(colors.background.secondary, isDark),
      borderWidth: 1,
      borderColor: borderColor,
      borderRadius: IOS_RADIUS.input,
      paddingHorizontal: IOS_SPACING.md,
      minHeight: 44, // Mínimo de iOS para touch targets
    },
    icon: {
      marginRight: IOS_SPACING.sm,
    },
    iconColor: {
      color: iconColor,
    },
    input: {
      flex: 1,
      paddingVertical: IOS_SPACING.sm + 2,
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.primary, isDark),
    },
    eyeIcon: {
      padding: IOS_SPACING.xs,
      marginLeft: IOS_SPACING.xs,
    },
    error: {
      ...IOS_TYPOGRAPHY.caption1,
      color: getIOSColor(colors.red, isDark),
      marginTop: IOS_SPACING.xs,
      paddingLeft: 2,
    },
  });
};

export default Input;
