// Hook para controlar la barra de navegación del sistema
// Oculta automáticamente la barra después de 5 segundos
// Solo aparece con el gesto nativo de deslizar la barra de notificaciones

import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

/**
 * Hook para auto-ocultar la barra de navegación
 * Solo funciona en Android
 * La barra solo aparece con el gesto de deslizar desde arriba
 */
export const useNavigationBar = () => {
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
        // overlay-swipe permite que aparezca al deslizar desde arriba
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

    // Mostrar la barra inicialmente
    showNavigationBar();

    // Ocultar después de 5 segundos
    const timeout = setTimeout(() => {
      hideNavigationBar();
    }, 5000);

    // Cleanup al desmontar
    return () => {
      clearTimeout(timeout);
      // Mostrar la barra al salir de la app
      showNavigationBar();
    };
  }, []);
};

export default useNavigationBar;

