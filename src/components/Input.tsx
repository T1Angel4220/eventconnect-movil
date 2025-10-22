// Componente de input personalizado con soporte para modo oscuro

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

  // Colores dinámicos según el tema
  const getLabelColor = () => (isDark ? "#ffffff" : "#000000");
  const getInputBgColor = () => (isDark ? "#ffffff" : "#f3f4f6");
  const getBorderColor = () => {
    if (error) return "#ef4444";
    if (isFocused) return isDark ? "#ffffff" : "#000000";
    return isDark ? "#4b5563" : "#e5e7eb";
  };
  const getIconColor = () => {
    if (error) return "#ef4444";
    if (isFocused) return isDark ? "#000000" : "#000000";
    return "#6b7280";
  };
  const getTextColor = () => "#000000"; // Siempre negro porque el input es blanco/gris claro
  const getPlaceholderColor = () => "#9ca3af";

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: getLabelColor() }]}>{label}</Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: getInputBgColor(),
            borderColor: getBorderColor(),
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={getIconColor()}
            style={styles.icon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            { color: getTextColor() },
            style,
          ]}
          placeholderTextColor={getPlaceholderColor()}
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
              color="#6b7280"
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  error: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 6,
    marginLeft: 4,
  },
});

export default Input;
