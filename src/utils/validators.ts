// Funciones de validación

import { VALIDATION_RULES } from '@/src/constants/config';

/**
 * Valida un email
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'El email es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email inválido' };
  }

  return { isValid: true };
};

/**
 * Valida una contraseña
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'La contraseña es requerida' };
  }

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `La contraseña debe tener al menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`,
    };
  }

  if (password.length > VALIDATION_RULES.PASSWORD_MAX_LENGTH) {
    return {
      isValid: false,
      error: `La contraseña no puede tener más de ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} caracteres`,
    };
  }

  // Debe contener al menos una letra mayúscula
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos una letra mayúscula',
    };
  }

  // Debe contener al menos una letra minúscula
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos una letra minúscula',
    };
  }

  // Debe contener al menos un número
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos un número',
    };
  }

  return { isValid: true };
};

/**
 * Valida que las contraseñas coincidan
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): { isValid: boolean; error?: string } => {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Las contraseñas no coinciden' };
  }

  return { isValid: true };
};

/**
 * Valida un nombre (first_name o last_name)
 */
export const validateName = (name: string, fieldName: string = 'nombre'): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: `El ${fieldName} es requerido` };
  }

  if (name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return {
      isValid: false,
      error: `El ${fieldName} debe tener al menos ${VALIDATION_RULES.NAME_MIN_LENGTH} caracteres`,
    };
  }

  if (name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `El ${fieldName} no puede tener más de ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`,
    };
  }

  // Solo letras y espacios
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
    return {
      isValid: false,
      error: `El ${fieldName} solo puede contener letras`,
    };
  }

  return { isValid: true };
};

/**
 * Valida un código de verificación (6 dígitos)
 */
export const validateCode = (code: string): { isValid: boolean; error?: string } => {
  if (!code) {
    return { isValid: false, error: 'El código es requerido' };
  }

  if (code.length !== VALIDATION_RULES.CODE_LENGTH) {
    return {
      isValid: false,
      error: `El código debe tener ${VALIDATION_RULES.CODE_LENGTH} dígitos`,
    };
  }

  if (!/^\d+$/.test(code)) {
    return { isValid: false, error: 'El código solo puede contener números' };
  }

  return { isValid: true };
};

/**
 * Obtiene la fuerza de una contraseña (0-4)
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  return Math.min(strength, 4);
};

/**
 * Obtiene el texto descriptivo de la fuerza de contraseña
 */
export const getPasswordStrengthText = (strength: number): string => {
  switch (strength) {
    case 0:
    case 1:
      return 'Muy débil';
    case 2:
      return 'Débil';
    case 3:
      return 'Buena';
    case 4:
      return 'Fuerte';
    default:
      return '';
  }
};

/**
 * Obtiene el color de la fuerza de contraseña
 */
export const getPasswordStrengthColor = (strength: number): string => {
  switch (strength) {
    case 0:
    case 1:
      return '#ef4444'; // red-500
    case 2:
      return '#f59e0b'; // amber-500
    case 3:
      return '#3b82f6'; // blue-500
    case 4:
      return '#22c55e'; // green-500
    default:
      return '#9ca3af'; // gray-400
  }
};

