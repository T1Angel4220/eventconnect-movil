// Componente para mostrar la fuerza de la contraseña

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  getPasswordStrength,
  getPasswordStrengthText,
  getPasswordStrengthColor,
} from "@/src/utils";

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  const text = getPasswordStrengthText(strength);
  const color = getPasswordStrengthColor(strength);

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                backgroundColor: index < strength ? color : "#e5e7eb",
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.text, { color }]}>
        Contraseña {text.toLowerCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 4,
  },
  barsContainer: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 6,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default PasswordStrength;

