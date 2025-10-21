// Servicio de eventos

import api, { getErrorMessage } from './api';
import { Event, EventWithOrganizer } from '@/src/types';

interface EventsResponse {
  success: boolean;
  data?: EventWithOrganizer[];
  message?: string;
}

interface EventResponse {
  success: boolean;
  data?: EventWithOrganizer;
  message?: string;
}

/**
 * Servicio de eventos
 */
class EventService {
  /**
   * Obtiene todos los eventos disponibles
   */
  async getAllEvents(): Promise<EventsResponse> {
    try {
      const response = await api.get<EventsResponse>('/events/with-organizer');
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
   * Obtiene un evento por su ID
   */
  async getEventById(eventId: number): Promise<EventResponse> {
    try {
      const response = await api.get<EventResponse>(`/events/${eventId}`);
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
   * Obtiene eventos próximos
   */
  async getUpcomingEvents(limit?: number): Promise<EventsResponse> {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get<EventsResponse>('/events/upcoming', { params });
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
   * Obtiene eventos activos (en curso)
   */
  async getActiveEvents(): Promise<EventsResponse> {
    try {
      const response = await api.get<EventsResponse>('/events/active');
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
   * Busca eventos por filtros
   */
  async searchEvents(filters: {
    type?: string;
    search?: string;
  }): Promise<EventsResponse> {
    try {
      const response = await api.get<EventsResponse>('/events', { params: filters });
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
export default new EventService();

