// Hook para controlar la barra de navegación del sistema
// Oculta automáticamente la barra después de 5 segundos de inactividad

import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

/**
 * Hook para auto-ocultar la barra de navegación
 * Solo funciona en Android
 */
export const useNavigationBar = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Solo ejecutar en Android
    if (Platform.OS !== 'android') {
      return;
    }

    /**
     * Oculta la barra de navegación
     */
    const hideNavigationBar = async () => {
      try {
        await NavigationBar.setVisibilityAsync('hidden');
        await NavigationBar.setBehaviorAsync('overlay-swipe');
      } catch (error) {
        console.error('Error ocultando barra de navegación:', error);
      }
    };

    /**
     * Muestra la barra de navegación
     */
    const showNavigationBar = async () => {
      try {
        await NavigationBar.setVisibilityAsync('visible');
      } catch (error) {
        console.error('Error mostrando barra de navegación:', error);
      }
    };

    /**
     * Reinicia el temporizador para ocultar la barra
     */
    const resetTimer = () => {
      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Mostrar la barra
      showNavigationBar();

      // Configurar nuevo timeout para ocultar después de 5 segundos
      timeoutRef.current = setTimeout(() => {
        hideNavigationBar();
      }, 5000);
    };

    // Iniciar el temporizador al montar
    resetTimer();

    // Cleanup al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Mostrar la barra al salir
      showNavigationBar();
    };
  }, []);

  /**
   * Función para llamar cuando el usuario interactúa con la pantalla
   */
  const onUserInteraction = () => {
    if (Platform.OS === 'android') {
      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Mostrar la barra
      NavigationBar.setVisibilityAsync('visible').catch((error) => {
        console.error('Error mostrando barra:', error);
      });

      // Ocultar después de 5 segundos
      timeoutRef.current = setTimeout(() => {
        NavigationBar.setVisibilityAsync('hidden').catch((error) => {
          console.error('Error ocultando barra:', error);
        });
      }, 5000);
    }
  };

  return { onUserInteraction };
};

export default useNavigationBar;

