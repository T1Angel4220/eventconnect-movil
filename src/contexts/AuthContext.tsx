// Context de autenticación

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '@/src/types';
import { authService } from '@/src/services';
import { getToken, getUser, saveToken, saveUser, clearAuthData } from '@/src/utils/storage';

/**
 * Tipo del contexto de autenticación
 */
interface AuthContextType {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Métodos
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

/**
 * Contexto de autenticación
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props del provider
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider del contexto de autenticación
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Verifica la autenticación al iniciar la app
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Actualiza isAuthenticated cuando cambia user o token
   */
  useEffect(() => {
    setIsAuthenticated(!!user && !!token);
  }, [user, token]);

  /**
   * Verifica el estado de autenticación al iniciar
   */
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Obtener datos guardados
      const savedToken = await getToken();
      const savedUser = await getUser();
      
      if (savedToken && savedUser) {
        // Verificar que el token siga siendo válido
        const isValid = await authService.checkAuth();
        
        if (isValid) {
          setToken(savedToken);
          setUser(savedUser);
          console.log('✅ Sesión restaurada:', savedUser.email);
        } else {
          // Token inválido, limpiar datos
          console.log('⚠️ Token inválido, limpiando sesión');
          await clearAuthData();
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('ℹ️ No hay sesión guardada');
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      // En caso de error, limpiar datos por seguridad
      await clearAuthData();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inicia sesión
   */
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔐 Intentando login con:', credentials.email);
      
      const result = await authService.login(credentials);
      
      if (result.success && result.token && result.user) {
        // Guardar en estado
        setToken(result.token);
        setUser(result.user);
        
        console.log('✅ Login exitoso:', result.user.email);
        
        return {
          success: true,
          message: result.message || 'Sesión iniciada exitosamente',
        };
      }
      
      console.log('❌ Login fallido:', result.message);
      return {
        success: false,
        message: result.message || 'Error al iniciar sesión',
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error inesperado al iniciar sesión',
      };
    }
  };

  /**
   * Registra un nuevo usuario
   */
  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('📝 Intentando registro con:', data.email);
      
      const result = await authService.register(data);
      
      if (result.success && result.token && result.user) {
        console.log('✅ Registro exitoso:', data.email);
        
        // Auto-login después del registro exitoso
        setToken(result.token);
        setUser(result.user);
        
        return {
          success: true,
          message: result.message || 'Usuario registrado exitosamente',
        };
      }
      
      console.log('❌ Registro fallido:', result.message);
      return {
        success: false,
        message: result.message || 'Error al registrar usuario',
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error inesperado al registrar usuario',
      };
    }
  };

  /**
   * Cierra la sesión
   */
  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Cerrando sesión...');
      
      // Llamar al servicio de logout (limpia AsyncStorage)
      await authService.logout();
      
      // Limpiar estado
      setToken(null);
      setUser(null);
      
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      // Igual limpiamos el estado local
      setToken(null);
      setUser(null);
    }
  };

  /**
   * Actualiza los datos del usuario
   */
  const updateUser = async (updatedUser: User): Promise<void> => {
    try {
      // Actualizar en AsyncStorage
      await saveUser(updatedUser);
      
      // Actualizar en estado
      setUser(updatedUser);
      
      console.log('✅ Usuario actualizado:', updatedUser.email);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  };

  /**
   * Refresca la autenticación (útil después de actualizar perfil)
   */
  const refreshAuth = async (): Promise<void> => {
    try {
      const savedToken = await getToken();
      const savedUser = await getUser();
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Error refrescando autenticación:', error);
    }
  };

  /**
   * Valor del contexto
   */
  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

