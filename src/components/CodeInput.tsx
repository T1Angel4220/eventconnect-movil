// Componente para entrada de código de verificación (6 dígitos) - Estilo iOS

import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Dimensions,
} from "react-native";
import { useTheme } from "@/src/hooks";
import { IOS_COLORS, IOS_SPACING, IOS_RADIUS, getIOSColor } from "@/src/constants/iosStyles";

interface CodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onChangeCode?: (code: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CodeInput: React.FC<CodeInputProps> = ({
  length = 6,
  onComplete,
  onChangeCode,
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { isDark } = useTheme();

  const styles = createStyles(isDark);

  // Calcular tamaño dinámico de los inputs para evitar que se salgan
  // Consideramos padding adicional de seguridad (40px total = 20px cada lado)
  const safetyPadding = 40;
  const lateralPadding = IOS_SPACING.lg * 2; // 40px (20 cada lado del ScrollView)
  const availableWidth = SCREEN_WIDTH - lateralPadding - safetyPadding;
  const gapSize = IOS_SPACING.sm; // 8px
  const totalGap = gapSize * (length - 1); // 5 gaps para 6 inputs = 40px
  const inputSize = Math.min(
    Math.floor((availableWidth - totalGap) / length),
    50 // Tamaño máximo reducido para mayor seguridad
  );

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
            { width: inputSize, height: inputSize + 8 },
            code[index] && styles.inputFilled,
          ]}
          value={code[index]}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          autoFocus={index === 0}
          placeholderTextColor={getIOSColor(IOS_COLORS.label.quaternary, isDark)}
        />
      ))}
    </View>
  );
};

const createStyles = (isDark: boolean) => {
  const colors = isDark ? IOS_COLORS : IOS_COLORS;

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: IOS_SPACING.sm,
      flexWrap: "nowrap",
      paddingHorizontal: 4, // Padding adicional de seguridad
    },
    input: {
      borderWidth: 1.5,
      borderColor: getIOSColor(colors.fill.tertiary, isDark),
      borderRadius: IOS_RADIUS.medium,
      textAlign: "center",
      fontSize: 24, // Reducido de 28 a 24
      fontWeight: "600",
      color: getIOSColor(colors.label.primary, isDark),
      backgroundColor: isDark 
        ? getIOSColor(colors.fill.tertiary, isDark)
        : getIOSColor(colors.background.tertiary, isDark),
    },
    inputFilled: {
      borderColor: getIOSColor(colors.systemBlue, isDark),
      borderWidth: 2,
      backgroundColor: isDark
        ? 'rgba(10, 132, 255, 0.1)'
        : 'rgba(0, 122, 255, 0.05)',
    },
  });
};

export default CodeInput;
