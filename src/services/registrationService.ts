// Servicio de inscripciones

import api, { getErrorMessage } from './api';
import {
  CreateRegistrationData,
  CreateRegistrationResponse,
  RegistrationListResponse,
  RegistrationWithDetails,
} from '@/src/types';

interface CancelRegistrationResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Servicio de inscripciones
 */
class RegistrationService {
  /**
   * Crea una nueva inscripción a un evento
   */
  async createRegistration(data: CreateRegistrationData): Promise<CreateRegistrationResponse> {
    try {
      const response = await api.post<CreateRegistrationResponse>('/registrations', data);
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
   * Obtiene las inscripciones del usuario autenticado
   */
  async getMyRegistrations(): Promise<RegistrationListResponse> {
    try {
      const response = await api.get<RegistrationListResponse>('/registrations/my');
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      return {
        success: false,
        data: [],
      };
    }
  }

  /**
   * Cancela una inscripción
   */
  async cancelRegistration(registrationId: number): Promise<CancelRegistrationResponse> {
    try {
      const response = await api.put<CancelRegistrationResponse>(
        `/registrations/${registrationId}/cancel`
      );
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
   * Obtiene información de capacidad de un evento
   */
  async getEventCapacity(eventId: number): Promise<{
    success: boolean;
    data?: { current: number; capacity: number; available: number };
    message?: string;
  }> {
    try {
      const response = await api.get(`/registrations/event/${eventId}/capacity`);
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
   * Verifica si el usuario está inscrito en un evento
   */
  async checkUserRegistration(eventId: number): Promise<{
    success: boolean;
    data?: {
      isRegistered: boolean;
      status?: 'registered' | 'canceled';
      registrationId?: number;
      registeredAt?: Date;
    };
    message?: string;
  }> {
    try {
      const response = await api.get(`/registrations/check/${eventId}`);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      return {
        success: false,
        message,
      };
    }
  }
}

// Exportar instancia única del servicio
export default new RegistrationService();

