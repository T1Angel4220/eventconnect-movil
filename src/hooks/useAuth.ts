// Hook personalizado para usar el AuthContext

import { useContext } from 'react';
import { AuthContext } from '@/src/contexts/AuthContext';

/**
 * Hook para acceder al contexto de autenticación
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 * 
 * @throws Error si se usa fuera del AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

export default useAuth;

