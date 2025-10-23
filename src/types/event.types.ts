// Tipos relacionados con eventos

export type EventType = 'academico' | 'cultural' | 'deportivo';
export type EventStatus = 'upcoming' | 'in_progress' | 'completed';
export type DateRangeFilter = 'today' | 'this_week' | 'this_month' | 'custom';
export type SortByOption = 'date' | 'popularity' | 'created_at';
export type SortOrder = 'asc' | 'desc';

export interface Event {
  event_id: number;
  title: string;
  description: string | null;
  event_date: string;
  duration: number; // en minutos
  status: EventStatus;
  location: string | null;
  event_type: EventType;
  capacity: number;
  organizer_id: number;
  event_image: string;
  created_at: string;
  updated_at: string;
}

export interface EventWithOrganizer extends Event {
  organizer_name: string;
  organizer_email: string;
  organizer_first_name?: string;
  organizer_last_name?: string;
  registered_count?: number;
  available_spots?: number;
}

export interface EventDetails extends EventWithOrganizer {
  available_slots?: number;
  is_registered?: boolean;
}

/**
 * Filtros avanzados para eventos
 */
export interface EventFilters {
  // Filtros de fecha
  dateRange?: DateRangeFilter;
  startDate?: string;
  endDate?: string;
  
  // Filtros básicos
  location?: string;
  eventType?: EventType;
  status?: EventStatus;
  
  // Ordenamiento
  sortBy?: SortByOption;
  sortOrder?: SortOrder;
}

