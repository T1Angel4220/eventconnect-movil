// Componente para entrada de código de verificación (6 dígitos)

import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";

interface CodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onChangeCode?: (code: string) => void;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  length = 6,
  onComplete,
  onChangeCode,
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChangeText = (text: string, index: number) => {
    // Solo permitir números
    const digit = text.replace(/[^0-9]/g, "");
    
    if (digit.length === 0) {
      // Borrar dígito actual
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
      onChangeCode?.(newCode.join(""));
      return;
    }

    // Actualizar código
    const newCode = [...code];
    newCode[index] = digit[0];
    setCode(newCode);

    const fullCode = newCode.join("");
    onChangeCode?.(fullCode);

    // Si completó el dígito, mover al siguiente
    if (digit.length > 0 && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Si completó todos los dígitos, llamar onComplete
    if (fullCode.length === length) {
      onComplete(fullCode);
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    // Si presiona backspace y el campo está vacío, ir al anterior
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            code[index] && styles.inputFilled,
          ]}
          value={code[index]}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#1f2937",
    backgroundColor: "#f9fafb",
  },
  inputFilled: {
    borderColor: "#3b82f6",
    backgroundColor: "#ffffff",
  },
});

export default CodeInput;

