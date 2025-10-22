// Hook para manejo del esquema de colores del sistema

import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Hook para obtener el tema actual del sistema
 */
export const useColorScheme = () => {
  const colorScheme = useRNColorScheme();
  
  return {
    isDark: colorScheme === 'dark',
    colorScheme: colorScheme ?? 'light',
  };
};

