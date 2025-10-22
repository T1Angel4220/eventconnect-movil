// Servicio de autenticación

import api, { getErrorMessage } from './api';
import {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  ForgotPasswordData,
  ForgotPasswordResponse,
  VerifyCodeData,
  VerifyCodeResponse,
  ResetPasswordData,
  ResetPasswordResponse,
} from '@/src/types';
import { saveToken, saveUser, clearAuthData } from '@/src/utils/storage';

/**
 * Servicio de autenticación
 */
class AuthService {
  /**
   * Inicia sesión con email y contraseña
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      if (response.data.success && response.data.token && response.data.user) {
        // Guardar token y usuario en AsyncStorage
        await saveToken(response.data.token);
        await saveUser(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Registra un nuevo usuario (participante)
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      // Transformar de snake_case a camelCase para el backend
      const registerData = {
        firstName: data.first_name,  // Cambiar a camelCase
        lastName: data.last_name,    // Cambiar a camelCase
        email: data.email,
        password: data.password,
        role: 'participant' as const,
      };

      console.log('📤 Enviando datos de registro:', registerData);

      const response = await api.post<RegisterResponse>('/auth/register', registerData);
      
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('❌ Error en registro:', message);
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Solicita recuperación de contraseña (envía código por email)
   */
  async forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResponse & { userId?: number }> {
    try {
      const response = await api.post('/auth/forgot-password', { email: data.email });
      
      // El backend devuelve: { message: string, userId: number }
      return {
        success: true,
        message: response.data.message || 'Código enviado exitosamente',
        userId: response.data.userId,
      };
    } catch (error) {
      const message = getErrorMessage(error);
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Verifica el código de recuperación de 6 dígitos
   */
  async verifyCode(data: VerifyCodeData & { userId?: number }): Promise<VerifyCodeResponse & { resetId?: number }> {
    try {
      const response = await api.post('/auth/verify-code', {
        userId: data.userId,
        code: data.code,
      });
      
      // El backend devuelve: { message: string, resetId: number }
      return {
        success: true,
        message: response.data.message || 'Código verificado exitosamente',
        isValid: true,
        resetId: response.data.resetId,
      };
    } catch (error) {
      const message = getErrorMessage(error);
      return {
        success: false,
        message,
        isValid: false,
      };
    }
  }

  /**
   * Restablece la contraseña con el código verificado
   */
  async resetPassword(data: { email: string; resetId: number; new_password: string }): Promise<ResetPasswordResponse> {
    try {
      const response = await api.post('/auth/reset-password', {
        resetId: data.resetId,
        newPassword: data.new_password, // Backend espera 'newPassword' en camelCase
      });
      
      return {
        success: true,
        message: response.data.message || 'Contraseña restablecida exitosamente',
      };
    } catch (error) {
      const message = getErrorMessage(error);
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async logout(): Promise<void> {
    try {
      // Limpiar datos locales
      await clearAuthData();
      
      // Opcional: Llamar al endpoint de logout si existe
      // await api.post('/auth/logout');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      // Igual limpiamos los datos locales
      await clearAuthData();
    }
  }

  /**
   * Verifica si el usuario está autenticado
   * (Útil para verificar al iniciar la app)
   */
  async checkAuth(): Promise<boolean> {
    try {
      // Intenta hacer una petición simple para verificar el token
      const response = await api.get('/auth/me');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

// Exportar instancia única del servicio
export default new AuthService();

