// Componente que controla la barra de navegación del sistema
// Oculta automáticamente después de 5 segundos
// Solo aparece al deslizar la barra de notificaciones

import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigationBar } from '@/src/hooks';

interface NavigationBarControllerProps {
  children: ReactNode;
}

/**
 * Wrapper que controla el auto-ocultado de la barra de navegación
 * La barra solo aparece con el gesto de deslizar desde arriba
 */
export const NavigationBarController: React.FC<NavigationBarControllerProps> = ({ children }) => {
  // Solo iniciamos el hook, no necesitamos onUserInteraction
  useNavigationBar();

  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NavigationBarController;

