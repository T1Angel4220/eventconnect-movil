import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IOS_COLORS, IOS_SPACING, IOS_TYPOGRAPHY, IOS_RADIUS, getIOSColor } from '@/src/constants/iosStyles';
import { useTheme } from '@/src/hooks';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary para capturar errores y mostrarlos de forma elegante
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('🔴 Error capturado por ErrorBoundary:', error);
    console.log('📋 Error Info:', errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Componente de fallback cuando hay un error
 */
function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Icono de error */}
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle" size={80} color={getIOSColor(IOS_COLORS.red, isDark)} />
        </View>

        {/* Título */}
        <Text style={styles.title}>Algo salió mal</Text>

        {/* Mensaje */}
        <Text style={styles.message}>
          La aplicación encontró un problema inesperado. No te preocupes, tus datos están seguros.
        </Text>

        {/* Detalles técnicos (solo en modo desarrollo) */}
        {__DEV__ && error && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Detalles técnicos:</Text>
            <Text style={styles.detailsText}>{error.message}</Text>
          </View>
        )}

        {/* Botón de reintentar */}
        <TouchableOpacity style={styles.button} onPress={onReset} activeOpacity={0.7}>
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: getIOSColor(IOS_COLORS.background.primary, isDark),
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: IOS_SPACING.xl,
    },
    iconContainer: {
      marginBottom: IOS_SPACING.xl,
    },
    title: {
      ...IOS_TYPOGRAPHY.largeTitle,
      color: getIOSColor(IOS_COLORS.label.primary, isDark),
      textAlign: 'center',
      marginBottom: IOS_SPACING.md,
    },
    message: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(IOS_COLORS.label.secondary, isDark),
      textAlign: 'center',
      marginBottom: IOS_SPACING.xxl,
      lineHeight: 24,
    },
    detailsContainer: {
      backgroundColor: isDark
        ? getIOSColor(IOS_COLORS.background.secondary, isDark)
        : getIOSColor(IOS_COLORS.background.tertiary, isDark),
      borderRadius: IOS_RADIUS.medium,
      padding: IOS_SPACING.md,
      marginBottom: IOS_SPACING.xl,
      width: '100%',
    },
    detailsTitle: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(IOS_COLORS.label.primary, isDark),
      fontWeight: '600',
      marginBottom: IOS_SPACING.sm,
    },
    detailsText: {
      ...IOS_TYPOGRAPHY.caption1,
      color: getIOSColor(IOS_COLORS.red, isDark),
      fontFamily: 'monospace',
    },
    button: {
      backgroundColor: getIOSColor(IOS_COLORS.systemBlue, isDark),
      borderRadius: IOS_RADIUS.button,
      paddingVertical: IOS_SPACING.md,
      paddingHorizontal: IOS_SPACING.xxl,
      flexDirection: 'row',
      alignItems: 'center',
      gap: IOS_SPACING.sm,
    },
    buttonText: {
      ...IOS_TYPOGRAPHY.body,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });

export default ErrorBoundary;

