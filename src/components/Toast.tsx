import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IOS_COLORS, IOS_SPACING, IOS_TYPOGRAPHY, IOS_RADIUS, IOS_SHADOWS, getIOSColor } from '@/src/constants/iosStyles';
import { useTheme } from '@/src/hooks';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

/**
 * Toast notification estilo iOS - Notificación elegante y profesional
 */
export default function Toast({ 
  visible, 
  message, 
  type = 'info', 
  duration = 3000,
  onDismiss 
}: ToastProps) {
  const { isDark } = useTheme();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const styles = createStyles(isDark, type);

  useEffect(() => {
    if (visible) {
      // Animación de entrada
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss después de la duración
      const timer = setTimeout(() => {
        dismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      dismiss();
    }
  }, [visible]);

  const dismiss = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: -100,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  };

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />;
      case 'error':
        return <Ionicons name="close-circle" size={24} color="#FFFFFF" />;
      case 'warning':
        return <Ionicons name="warning" size={24} color="#FFFFFF" />;
      case 'info':
        return <Ionicons name="information-circle" size={24} color="#FFFFFF" />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={dismiss}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        <TouchableOpacity onPress={dismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={20} color="rgba(255, 255, 255, 0.8)" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (isDark: boolean, type: ToastType) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#34C759'; // iOS green
      case 'error':
        return '#FF3B30'; // iOS red
      case 'warning':
        return '#FF9500'; // iOS orange
      case 'info':
        return '#007AFF'; // iOS blue
    }
  };

  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 20,
      left: IOS_SPACING.md,
      right: IOS_SPACING.md,
      zIndex: 9999,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: getBackgroundColor(),
      borderRadius: IOS_RADIUS.medium,
      padding: IOS_SPACING.md,
      gap: IOS_SPACING.sm,
      ...IOS_SHADOWS.large,
    },
    iconContainer: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      ...IOS_TYPOGRAPHY.body,
      color: '#FFFFFF',
      flex: 1,
      fontWeight: '500',
    },
  });
};

