// Componente que controla la barra de navegación del sistema
// Oculta automáticamente después de 5 segundos de inactividad

import React, { ReactNode } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useNavigationBar } from '@/src/hooks';

interface NavigationBarControllerProps {
  children: ReactNode;
}

/**
 * Wrapper que controla el auto-ocultado de la barra de navegación
 */
export const NavigationBarController: React.FC<NavigationBarControllerProps> = ({ children }) => {
  const { onUserInteraction } = useNavigationBar();

  return (
    <TouchableWithoutFeedback onPress={onUserInteraction}>
      <View style={styles.container}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NavigationBarController;

