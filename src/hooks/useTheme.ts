// Hook para usar el contexto de tema

import { useContext } from 'react';
import { ThemeContext } from '@/src/contexts/ThemeContext';

/**
 * Hook para acceder al contexto de tema
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  
  return context;
};

