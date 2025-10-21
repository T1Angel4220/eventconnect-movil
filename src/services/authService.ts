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
      // Aseguramos que el rol sea siempre 'participant' en móvil
      const registerData = {
        ...data,
        role: 'participant' as const,
      };

      const response = await api.post<RegisterResponse>('/auth/register', registerData);
      
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
   * Solicita recuperación de contraseña (envía código por email)
   */
  async forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResponse> {
    try {
      const response = await api.post<ForgotPasswordResponse>('/auth/request-password-reset', data);
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
   * Verifica el código de recuperación de 6 dígitos
   */
  async verifyCode(data: VerifyCodeData): Promise<VerifyCodeResponse> {
    try {
      const response = await api.post<VerifyCodeResponse>('/auth/verify-reset-code', data);
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
   * Restablece la contraseña con el código verificado
   */
  async resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
    try {
      const response = await api.post<ResetPasswordResponse>('/auth/reset-password', data);
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

