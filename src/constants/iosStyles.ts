// Estilos y constantes para UI estilo iOS/Apple
// Basado en Human Interface Guidelines de Apple

/**
 * Tipografía iOS (usando System fonts nativos)
 */
export const IOS_TYPOGRAPHY = {
  // Títulos grandes
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 41,
    letterSpacing: 0.37,
  },
  // Títulos
  title1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: 0.36,
  },
  title2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: 0.35,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 25,
    letterSpacing: 0.38,
  },
  // Headlines
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  // Body
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  // Callout
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  // Subhead
  subheadline: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  // Footnote
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  // Caption
  caption1: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 13,
    letterSpacing: 0.07,
  },
} as const;

/**
 * Espaciado iOS
 */
export const IOS_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/**
 * Bordes redondeados iOS
 */
export const IOS_RADIUS = {
  small: 8,
  medium: 10,
  large: 12,
  xlarge: 16,
  button: 10,
  card: 12,
  input: 10,
} as const;

/**
 * Colores del sistema iOS
 */
export const IOS_COLORS = {
  // Azul iOS (Color primario del sistema)
  systemBlue: {
    light: '#007AFF',
    dark: '#0A84FF',
  },
  // Grises del sistema
  systemGray: {
    light: '#8E8E93',
    dark: '#8E8E93',
  },
  systemGray2: {
    light: '#AEAEB2',
    dark: '#636366',
  },
  systemGray3: {
    light: '#C7C7CC',
    dark: '#48484A',
  },
  systemGray4: {
    light: '#D1D1D6',
    dark: '#3A3A3C',
  },
  systemGray5: {
    light: '#E5E5EA',
    dark: '#2C2C2E',
  },
  systemGray6: {
    light: '#F2F2F7',
    dark: '#1C1C1E',
  },
  // Fondos
  background: {
    primary: {
      light: '#FFFFFF',
      dark: '#000000',
    },
    secondary: {
      light: '#F2F2F7',
      dark: '#1C1C1E',
    },
    tertiary: {
      light: '#FFFFFF',
      dark: '#2C2C2E',
    },
  },
  // Colores de relleno (fills)
  fill: {
    primary: {
      light: 'rgba(120, 120, 128, 0.2)',
      dark: 'rgba(120, 120, 128, 0.36)',
    },
    secondary: {
      light: 'rgba(120, 120, 128, 0.16)',
      dark: 'rgba(120, 120, 128, 0.32)',
    },
    tertiary: {
      light: 'rgba(118, 118, 128, 0.12)',
      dark: 'rgba(118, 118, 128, 0.24)',
    },
  },
  // Labels (textos)
  label: {
    primary: {
      light: '#000000',
      dark: '#FFFFFF',
    },
    secondary: {
      light: 'rgba(60, 60, 67, 0.6)',
      dark: 'rgba(235, 235, 245, 0.6)',
    },
    tertiary: {
      light: 'rgba(60, 60, 67, 0.3)',
      dark: 'rgba(235, 235, 245, 0.3)',
    },
    quaternary: {
      light: 'rgba(60, 60, 67, 0.18)',
      dark: 'rgba(235, 235, 245, 0.18)',
    },
  },
  // Separadores
  separator: {
    opaque: {
      light: '#C6C6C8',
      dark: '#38383A',
    },
    nonOpaque: {
      light: 'rgba(60, 60, 67, 0.29)',
      dark: 'rgba(84, 84, 88, 0.6)',
    },
  },
  // Colores semánticos
  red: {
    light: '#FF3B30',
    dark: '#FF453A',
  },
  orange: {
    light: '#FF9500',
    dark: '#FF9F0A',
  },
  yellow: {
    light: '#FFCC00',
    dark: '#FFD60A',
  },
  green: {
    light: '#34C759',
    dark: '#32D74B',
  },
  teal: {
    light: '#5AC8FA',
    dark: '#64D2FF',
  },
  indigo: {
    light: '#5856D6',
    dark: '#5E5CE6',
  },
  purple: {
    light: '#AF52DE',
    dark: '#BF5AF2',
  },
} as const;

/**
 * Sombras iOS (muy sutiles)
 */
export const IOS_SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;

/**
 * Helper para obtener colores según tema
 */
export const getIOSColor = (color: any, isDark: boolean) => {
  if (typeof color === 'object' && 'light' in color && 'dark' in color) {
    return isDark ? color.dark : color.light;
  }
  return color;
};

/**
 * Safe Area Insets (para manejo de notch, etc.)
 */
export const IOS_SAFE_AREA = {
  top: 44, // Status bar + navigation bar
  bottom: 34, // Home indicator en iPhones sin botón
  sides: 0,
} as const;

