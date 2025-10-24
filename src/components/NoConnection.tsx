import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IOS_COLORS, IOS_SPACING, IOS_TYPOGRAPHY, IOS_RADIUS, IOS_SHADOWS, getIOSColor } from '@/src/constants/iosStyles';
import { useTheme } from '@/src/hooks';

interface NoConnectionProps {
  onRetry: () => void;
  message?: string;
  retrying?: boolean;
}

/**
 * Pantalla completa profesional cuando no hay conexión a internet
 */
export default function NoConnection({ 
  onRetry, 
  message = "No hay conexión a internet",
  retrying = false 
}: NoConnectionProps) {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Ilustración/Icono */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons 
              name="cloud-offline" 
              size={80} 
              color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
            />
          </View>
          <View style={styles.wifiIconContainer}>
            <Ionicons 
              name="wifi" 
              size={40} 
              color={getIOSColor(IOS_COLORS.red, isDark)} 
            />
            <View style={styles.slashLine} />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>{message}</Text>

        {/* Mensaje descriptivo */}
        <Text style={styles.message}>
          Parece que no tienes conexión a internet en este momento. Verifica tu conexión Wi-Fi o datos móviles e intenta nuevamente.
        </Text>

        {/* Lista de sugerencias */}
        <View style={styles.suggestionsContainer}>
          <View style={styles.suggestionItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.suggestionText}>Verifica que el Wi-Fi esté activado</Text>
          </View>
          <View style={styles.suggestionItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.suggestionText}>Revisa que los datos móviles estén habilitados</Text>
          </View>
          <View style={styles.suggestionItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.suggestionText}>Intenta moverte a una zona con mejor señal</Text>
          </View>
        </View>

        {/* Botón de reintentar */}
        <TouchableOpacity 
          style={[styles.retryButton, retrying && styles.retryButtonDisabled]}
          onPress={onRetry}
          activeOpacity={0.7}
          disabled={retrying}
        >
          {retrying ? (
            <>
              <Ionicons name="hourglass" size={20} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Reintentando...</Text>
            </>
          ) : (
            <>
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Reintentar Conexión</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Indicador de estado */}
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Sin conexión</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: getIOSColor(IOS_COLORS.background.primary, isDark),
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: IOS_SPACING.xl,
    },
    iconContainer: {
      position: 'relative',
      marginBottom: IOS_SPACING.xxl,
    },
    iconBackground: {
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: isDark
        ? 'rgba(10, 132, 255, 0.15)'
        : 'rgba(0, 122, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      ...IOS_SHADOWS.medium,
    },
    wifiIconContainer: {
      position: 'absolute',
      bottom: -10,
      right: -10,
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: isDark
        ? getIOSColor(IOS_COLORS.background.secondary, isDark)
        : '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: getIOSColor(IOS_COLORS.background.primary, isDark),
      ...IOS_SHADOWS.large,
    },
    slashLine: {
      position: 'absolute',
      width: 50,
      height: 3,
      backgroundColor: getIOSColor(IOS_COLORS.red, isDark),
      transform: [{ rotate: '-45deg' }],
      borderRadius: 2,
    },
    title: {
      ...IOS_TYPOGRAPHY.largeTitle,
      color: getIOSColor(IOS_COLORS.label.primary, isDark),
      textAlign: 'center',
      marginBottom: IOS_SPACING.md,
      fontWeight: '700',
    },
    message: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(IOS_COLORS.label.secondary, isDark),
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: IOS_SPACING.xxl,
      maxWidth: '90%',
    },
    suggestionsContainer: {
      width: '100%',
      backgroundColor: isDark
        ? getIOSColor(IOS_COLORS.background.secondary, isDark)
        : getIOSColor(IOS_COLORS.background.tertiary, isDark),
      borderRadius: IOS_RADIUS.card,
      padding: IOS_SPACING.lg,
      marginBottom: IOS_SPACING.xxl,
      ...IOS_SHADOWS.small,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: IOS_SPACING.md,
    },
    bulletPoint: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: getIOSColor(IOS_COLORS.systemBlue, isDark),
      marginRight: IOS_SPACING.md,
      marginTop: 8,
    },
    suggestionText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(IOS_COLORS.label.secondary, isDark),
      flex: 1,
      lineHeight: 22,
    },
    retryButton: {
      backgroundColor: getIOSColor(IOS_COLORS.systemBlue, isDark),
      borderRadius: IOS_RADIUS.button,
      paddingVertical: IOS_SPACING.md + 2,
      paddingHorizontal: IOS_SPACING.xxl,
      flexDirection: 'row',
      alignItems: 'center',
      gap: IOS_SPACING.sm,
      ...IOS_SHADOWS.medium,
      marginBottom: IOS_SPACING.xl,
    },
    retryButtonDisabled: {
      opacity: 0.6,
    },
    retryButtonText: {
      ...IOS_TYPOGRAPHY.body,
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 17,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: IOS_SPACING.sm,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: getIOSColor(IOS_COLORS.red, isDark),
    },
    statusText: {
      ...IOS_TYPOGRAPHY.caption1,
      color: getIOSColor(IOS_COLORS.label.tertiary, isDark),
    },
  });

