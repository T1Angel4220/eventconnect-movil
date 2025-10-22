// Paleta de colores para EventConnect Mobile
// Sistema de Gestión de Eventos Universitarios

/**
 * Colores institucionales compartidos con web
 */
export const BRAND_COLORS = {
  primary: '#3b82f6',      // Azul institucional principal
  primaryDark: '#2563eb',  // Azul oscuro para hover
  primaryLight: '#60a5fa', // Azul claro para backgrounds
} as const;

/**
 * Colores por categoría de evento
 * Vibrantes y diferenciados para fácil identificación
 */
export const EVENT_COLORS = {
  academic: {
    main: '#3b82f6',
    light: '#dbeafe',
    dark: '#1e40af',
  },
  cultural: {
    main: '#8b5cf6',
    light: '#ede9fe',
    dark: '#6d28d9',
  },
  sports: {
    main: '#10b981',
    light: '#d1fae5',
    dark: '#047857',
  },
} as const;

/**
 * Tema Claro - Optimizado para lectura en exteriores
 */
export const LIGHT_THEME = {
  background: {
    primary: '#f9fafb',    // Gris muy claro (no blanco puro)
    secondary: '#ffffff',   // Blanco para cards
    tertiary: '#f3f4f6',   // Gris intermedio
  },
  text: {
    primary: '#111827',     // Casi negro
    secondary: '#6b7280',   // Gris medio
    tertiary: '#9ca3af',    // Gris claro
    inverse: '#ffffff',     // Blanco para texto sobre fondos oscuros
  },
  border: {
    light: '#e5e7eb',       // Gris muy claro
    medium: '#d1d5db',      // Gris claro
    dark: '#9ca3af',        // Gris medio
  },
  status: {
    success: '#10b981',     // Verde
    warning: '#f59e0b',     // Amarillo/naranja
    error: '#ef4444',       // Rojo
    info: '#3b82f6',        // Azul
  },
} as const;

/**
 * Tema Oscuro - Reducción de fatiga visual
 */
export const DARK_THEME = {
  background: {
    primary: '#111827',     // Gris oscuro (no negro puro)
    secondary: '#1f2937',   // Gris medio-oscuro para cards
    tertiary: '#374151',    // Gris intermedio
  },
  text: {
    primary: '#f9fafb',     // Casi blanco
    secondary: '#d1d5db',   // Gris claro
    tertiary: '#9ca3af',    // Gris medio
    inverse: '#111827',     // Oscuro para texto sobre fondos claros
  },
  border: {
    light: '#374151',       // Gris oscuro
    medium: '#4b5563',      // Gris medio
    dark: '#6b7280',        // Gris claro
  },
  status: {
    success: '#10b981',     // Verde (igual que light)
    warning: '#fbbf24',     // Amarillo más brillante
    error: '#f87171',       // Rojo más suave
    info: '#60a5fa',        // Azul más claro
  },
} as const;

/**
 * Gradientes decorativos (opcional para headers/hero sections)
 */
export const GRADIENTS = {
  primary: ['#3b82f6', '#2563eb'],
  cultural: ['#8b5cf6', '#7c3aed'],
  sports: ['#10b981', '#059669'],
  sunset: ['#f59e0b', '#ef4444'],
} as const;

/**
 * Helper para obtener color de categoría
 */
export const getEventColor = (type: 'academic' | 'cultural' | 'sports') => {
  return EVENT_COLORS[type].main;
};

/**
 * Helper para obtener colores del tema actual
 */
export const getThemeColors = (isDark: boolean) => {
  return isDark ? DARK_THEME : LIGHT_THEME;
};

