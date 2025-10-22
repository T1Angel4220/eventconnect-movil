// Tipos relacionados con eventos

// IMPORTANTE: Los tipos de eventos están en ESPAÑOL en la base de datos
export type EventType = 'academico' | 'cultural' | 'deportivo';
export type EventStatus = 'upcoming' | 'in_progress' | 'completed';

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
}

export interface EventDetails extends EventWithOrganizer {
  available_slots?: number;
  is_registered?: boolean;
}

