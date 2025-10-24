// Tipos relacionados con inscripciones

import { EventType } from './event.types';

export type RegistrationStatus = 'registered' | 'canceled';

export interface Registration {
  registration_id: number;
  user_id: number;
  event_id: number;
  registered_at: string;
  status: RegistrationStatus;
}

export interface RegistrationWithDetails extends Registration {
  user_first_name?: string;
  user_last_name?: string;
  user_email?: string;
  event_title: string;
  event_date: string;
  event_location: string | null;
  event_type: EventType;
  event_capacity: number;
  event_image: string | null;
  duration: number | null;
  organizer_id: number;
  organizer_name?: string;
}

export interface CreateRegistrationData {
  event_id: number;
}

export interface CreateRegistrationResponse {
  success: boolean;
  message: string;
  data?: Registration;
}

export interface RegistrationListResponse {
  success: boolean;
  data: RegistrationWithDetails[];
}

