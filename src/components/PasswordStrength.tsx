// Componente para mostrar la fuerza de la contraseña con criterios individuales
// Similar al frontend web

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_COLORS, IOS_SPACING, IOS_RADIUS, getIOSColor } from "@/src/constants/iosStyles";

interface PasswordStrengthProps {
  password: string;
}

interface PasswordCriteria {
  label: string;
  test: (password: string) => boolean;
}

const criteria: PasswordCriteria[] = [
  {
    label: "Mínimo 8 caracteres",
    test: (pwd) => pwd.length >= 8,
  },
  {
    label: "Al menos una minúscula",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: "Al menos una mayúscula",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: "Al menos un número",
    test: (pwd) => /\d/.test(pwd),
  },
];

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);

  if (!password) return null;

  // Calcular fortaleza
  const metCriteria = criteria.filter((criterion) => criterion.test(password)).length;
  const strengthPercentage = (metCriteria / criteria.length) * 100;

  // Determinar color y texto de fortaleza
  const getStrengthInfo = () => {
    if (metCriteria <= 1) {
      return {
        text: "Muy débil",
        color: "#FF3B30", // iOS Red
      };
    }
    if (metCriteria === 2) {
      return {
        text: "Débil",
        color: "#FF9500", // iOS Orange
      };
    }
    if (metCriteria === 3) {
      return {
        text: "Buena",
        color: "#007AFF", // iOS Blue
      };
    }
    return {
      text: "Fuerte",
      color: "#34C759", // iOS Green
    };
  };

  const strengthInfo = getStrengthInfo();

  return (
    <View style={styles.container}>
      {/* Barra de fortaleza */}
      <View style={styles.strengthHeader}>
        <Text style={styles.strengthLabel}>Fortaleza:</Text>
        <Text style={[styles.strengthText, { color: strengthInfo.color }]}>
          {strengthInfo.text}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${strengthPercentage}%`,
              backgroundColor: strengthInfo.color,
            },
          ]}
        />
      </View>

      {/* Lista de criterios */}
      <View style={styles.criteriaContainer}>
        {criteria.map((criterion, index) => {
          const isMet = criterion.test(password);
          return (
            <View key={index} style={styles.criteriaRow}>
              <Ionicons
                name={isMet ? "checkmark-circle" : "close-circle"}
                size={18}
                color={isMet ? "#34C759" : "#FF3B30"}
                style={styles.criteriaIcon}
              />
              <Text
                style={[
                  styles.criteriaText,
                  {
                    color: isMet
                      ? "#34C759"
                      : getIOSColor(IOS_COLORS.label.secondary, isDark),
                  },
                ]}
              >
                {criterion.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) => {
  const colors = isDark ? IOS_COLORS : IOS_COLORS;

  return StyleSheet.create({
    container: {
      marginTop: IOS_SPACING.md,
      marginBottom: IOS_SPACING.sm,
    },
    strengthHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: IOS_SPACING.xs,
    },
    strengthLabel: {
      fontSize: 13,
      fontWeight: "400",
      color: getIOSColor(colors.label.secondary, isDark),
      letterSpacing: -0.08,
    },
    strengthText: {
      fontSize: 13,
      fontWeight: "600",
      letterSpacing: -0.08,
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: isDark
        ? "rgba(142, 142, 147, 0.24)"
        : "rgba(120, 120, 128, 0.16)",
      borderRadius: IOS_RADIUS.small,
      overflow: "hidden",
      marginBottom: IOS_SPACING.md,
    },
    progressBar: {
      height: "100%",
      borderRadius: IOS_RADIUS.small,
    },
    criteriaContainer: {
      gap: IOS_SPACING.xs,
    },
    criteriaRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    criteriaIcon: {
      marginRight: IOS_SPACING.xs,
    },
    criteriaText: {
      fontSize: 13,
      fontWeight: "400",
      letterSpacing: -0.08,
    },
  });
};

export default PasswordStrength;
