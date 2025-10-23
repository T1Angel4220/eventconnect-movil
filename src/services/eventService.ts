// Servicio de eventos

import api, { getErrorMessage } from './api';
import { Event, EventWithOrganizer, EventFilters } from '@/src/types';

interface EventsResponse {
  success: boolean;
  data?: EventWithOrganizer[];
  message?: string;
  filters?: EventFilters;
  count?: number;
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
   * Obtiene un evento por su ID (con información del organizador)
   */
  async getEventById(eventId: number): Promise<EventResponse> {
    try {
      // Primero intentamos obtener todos los eventos con organizador
      const allEventsResponse = await api.get<EventsResponse>('/events/with-organizer');
      
      if (allEventsResponse.data.success && allEventsResponse.data.data) {
        // Buscar el evento específico en la lista
        const event = allEventsResponse.data.data.find(e => e.event_id === eventId);
        
        if (event) {
          return {
            success: true,
            data: event,
          };
        }
      }
      
      // Si no lo encontramos, fallback al endpoint original
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
   * Busca eventos por filtros básicos (búsqueda y tipo)
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

  /**
   * Obtiene eventos con filtros avanzados
   */
  async getEventsWithFilters(filters: EventFilters): Promise<EventsResponse> {
    try {
      // Construir query params desde los filtros
      const params: any = {};

      if (filters.dateRange) params.dateRange = filters.dateRange;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.location) params.location = filters.location;
      if (filters.eventType) params.eventType = filters.eventType;
      if (filters.status) params.status = filters.status;
      if (filters.onlyAvailable !== undefined) params.onlyAvailable = filters.onlyAvailable;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;

      console.log('📤 Enviando filtros al backend:', params);

      const response = await api.get<EventsResponse>('/events', { params });
      
      console.log('📥 Respuesta del backend:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener eventos con filtros:', error);
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

