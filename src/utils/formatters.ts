// Funciones de formato

import { EVENT_TYPES, EVENT_STATUS } from '@/src/constants/config';
import { EventType, EventStatus } from '@/src/types';

/**
 * Formatea una fecha en formato legible
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return date.toLocaleDateString('es-ES', options);
};

/**
 * Formatea una fecha con hora
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  const dateStr = date.toLocaleDateString('es-ES', dateOptions);
  const timeStr = date.toLocaleTimeString('es-ES', timeOptions);
  
  return `${dateStr} a las ${timeStr}`;
};

/**
 * Formatea solo la hora
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return date.toLocaleTimeString('es-ES', options);
};

/**
 * Calcula cuánto tiempo falta para un evento
 */
export const getTimeUntilEvent = (dateString: string): string => {
  const eventDate = new Date(dateString);
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  
  if (diff < 0) {
    return 'Evento pasado';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `En ${days} día${days > 1 ? 's' : ''}`;
  }
  
  if (hours > 0) {
    return `En ${hours} hora${hours > 1 ? 's' : ''}`;
  }
  
  return 'Muy pronto';
};

/**
 * Formatea la duración en minutos a un formato legible
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Obtiene el nombre legible del tipo de evento
 */
export const getEventTypeName = (type: EventType): string => {
  return EVENT_TYPES[type] || type;
};

/**
 * Obtiene el nombre legible del estado del evento
 */
export const getEventStatusName = (status: EventStatus): string => {
  return EVENT_STATUS[status] || status;
};

/**
 * Formatea un nombre completo
 */
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

/**
 * Obtiene las iniciales de un nombre
 */
export const getInitials = (firstName: string, lastName: string): string => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};

/**
 * Trunca un texto si es muy largo
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Formatea la capacidad del evento
 */
export const formatCapacity = (current: number, total: number): string => {
  return `${current}/${total} inscritos`;
};

/**
 * Calcula el porcentaje de ocupación
 */
export const getOccupancyPercentage = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

