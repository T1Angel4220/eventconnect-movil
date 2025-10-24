// Configuración de axios para peticiones HTTP

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/src/constants/config';
import { getToken } from '@/src/utils/storage';

/**
 * Instancia de axios configurada
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de peticiones para agregar el token
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getToken();
      
      // Log detallado del token
      if (__DEV__) {
        if (token) {
          console.log(`🔑 Token encontrado:`, token.substring(0, 20) + '...');
        } else {
          console.warn(`⚠️ No hay token disponible para ${config.url}`);
        }
      }
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log de peticiones en desarrollo
      if (__DEV__) {
        console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`, config.data);
        console.log(`🔐 Authorization header:`, config.headers.Authorization ? 'Presente' : 'Ausente');
      }
      
      return config;
    } catch (error) {
      console.error('💥 Error en interceptor de petición:', error);
      return config;
    }
  },
  (error) => {
    console.error('💥 Error en interceptor de petición:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas para manejo de errores
 */
api.interceptors.response.use(
  (response) => {
    // Log de respuestas exitosas en desarrollo
    if (__DEV__) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Log de errores en desarrollo
    if (__DEV__) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Manejar errores comunes
    if (error.response) {
      // El servidor respondió con un código de error
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // Token inválido o expirado
          console.log('⚠️ Token inválido o expirado');
          // Aquí podrías emitir un evento para cerrar sesión
          break;
        case 403:
          console.log('⚠️ Acceso denegado');
          break;
        case 404:
          console.log('⚠️ Recurso no encontrado');
          break;
        case 500:
          console.log('⚠️ Error del servidor');
          break;
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('⚠️ No se recibió respuesta del servidor');
    } else {
      // Algo pasó al configurar la petición
      console.error('⚠️ Error al configurar la petición:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

/**
 * Helper para extraer mensajes de error
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Error de axios
    const message = error.response?.data?.message;
    if (message) return message;
    
    if (error.response?.status === 401) {
      return 'No autorizado. Por favor inicia sesión nuevamente.';
    }
    
    if (error.response?.status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    }
    
    if (error.response?.status === 404) {
      return 'Recurso no encontrado.';
    }
    
    if (error.response?.status === 500) {
      return 'Error del servidor. Por favor intenta más tarde.';
    }
    
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión.';
    }
    
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Ocurrió un error inesperado.';
};

