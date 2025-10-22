// Configuración de la aplicación

// URL del backend
// En desarrollo, usa tu IP local (no localhost porque el emulador no la reconoce)
// Para encontrar tu IP: ipconfig en Windows, ifconfig en Mac/Linux
export const API_BASE_URL = __DEV__
  ? "http://localhost:3001/api" // ⚠️ IMPORTANTE: Incluir puerto :3001
  : "https://tu-api-produccion.com/api"; // URL de producción cuando despliegues

// URL base para imágenes y archivos estáticos (sin /api)
export const IMAGE_BASE_URL = __DEV__
  ? "http://localhost:3001"
  : "https://tu-api-produccion.com";

// Configuración de timeouts
export const API_TIMEOUT = 10000; // 10 segundos

// Claves de AsyncStorage
export const STORAGE_KEYS = {
  TOKEN: "@eventconnect_token",
  USER: "@eventconnect_user",
  REMEMBER_EMAIL: "@eventconnect_remember_email",
} as const;

// Tipos de eventos (para filtros y displays) - EN ESPAÑOL
export const EVENT_TYPES = {
  academico: "Académico",
  cultural: "Cultural",
  deportivo: "Deportivo",
} as const;

// Estados de eventos
export const EVENT_STATUS = {
  upcoming: "Próximo",
  in_progress: "En Curso",
  completed: "Completado",
} as const;

// Configuración de validaciones
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  CODE_LENGTH: 6,
} as const;
