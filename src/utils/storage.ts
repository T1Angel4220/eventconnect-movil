// Utilidades para manejo de AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/src/constants/config';
import { User } from '@/src/types';

/**
 * Guarda el token de autenticación
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Error guardando token:', error);
    throw error;
  }
};

/**
 * Obtiene el token de autenticación
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
};

/**
 * Elimina el token de autenticación
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error eliminando token:', error);
    throw error;
  }
};

/**
 * Guarda los datos del usuario
 */
export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error guardando usuario:', error);
    throw error;
  }
};

/**
 * Obtiene los datos del usuario
 */
export const getUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
};

/**
 * Elimina los datos del usuario
 */
export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    throw error;
  }
};

/**
 * Limpia toda la data de autenticación
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
  } catch (error) {
    console.error('Error limpiando datos de autenticación:', error);
    throw error;
  }
};

/**
 * Guarda el email para recordar
 */
export const saveRememberedEmail = async (email: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_EMAIL, email);
  } catch (error) {
    console.error('Error guardando email:', error);
    throw error;
  }
};

/**
 * Obtiene el email guardado
 */
export const getRememberedEmail = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_EMAIL);
  } catch (error) {
    console.error('Error obteniendo email:', error);
    return null;
  }
};

/**
 * Elimina el email guardado
 */
export const removeRememberedEmail = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
  } catch (error) {
    console.error('Error eliminando email:', error);
    throw error;
  }
};

