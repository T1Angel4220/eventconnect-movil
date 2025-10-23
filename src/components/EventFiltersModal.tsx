// Componente de Filtros de Eventos - Estilo iOS

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventFilters, DateRangeFilter, EventType, SortByOption } from '@/src/types';
import { useTheme } from '@/src/hooks';
import { IOS_COLORS, IOS_SPACING, IOS_RADIUS, IOS_TYPOGRAPHY, getIOSColor } from '@/src/constants/iosStyles';

export interface EventFiltersModalProps {
  visible: boolean;
  filters: EventFilters;
  onApply: (filters: EventFilters) => void;
  onClose: () => void;
}

export const EventFiltersModal: React.FC<EventFiltersModalProps> = ({
  visible,
  filters: initialFilters,
  onApply,
  onClose,
}) => {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);
  const [filters, setFilters] = useState<EventFilters>(initialFilters);

  // Sincronizar filtros cuando cambian los props o se abre el modal
  useEffect(() => {
    if (visible) {
      setFilters(initialFilters);
    }
  }, [visible, initialFilters]);

  const handleApply = () => {
    console.log('🎯 Aplicando filtros desde modal:', filters);
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onApply(emptyFilters);
    onClose();
  };

  const dateRangeOptions: { key: DateRangeFilter; label: string; icon: string }[] = [
    { key: 'today', label: 'Hoy', icon: 'today' },
    { key: 'this_week', label: 'Esta Semana', icon: 'calendar' },
    { key: 'this_month', label: 'Este Mes', icon: 'calendar-outline' },
  ];

  const eventTypeOptions: { key: EventType; label: string; icon: string }[] = [
    { key: 'academico', label: 'Académico', icon: 'school' },
    { key: 'cultural', label: 'Cultural', icon: 'color-palette' },
    { key: 'deportivo', label: 'Deportivo', icon: 'football' },
  ];

  const sortByOptions: { key: SortByOption; label: string; icon: string }[] = [
    { key: 'date', label: 'Fecha', icon: 'calendar' },
    { key: 'popularity', label: 'Popularidad', icon: 'trending-up' },
    { key: 'created_at', label: 'Más Recientes', icon: 'time' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filtros</Text>
          <TouchableOpacity onPress={handleReset} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.resetText}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Rango de Fechas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FECHA</Text>
            <View style={styles.card}>
              {dateRangeOptions.map((option, index) => (
                <React.Fragment key={option.key}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => setFilters({ ...filters, dateRange: option.key })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[
                        styles.optionIcon,
                        filters.dateRange === option.key && styles.optionIconActive
                      ]}>
                        <Ionicons
                          name={option.icon as any}
                          size={20}
                          color={filters.dateRange === option.key
                            ? getIOSColor(IOS_COLORS.systemBlue, isDark)
                            : getIOSColor(IOS_COLORS.label.secondary, isDark)
                          }
                        />
                      </View>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                    </View>
                    {filters.dateRange === option.key && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
                      />
                    )}
                  </TouchableOpacity>
                  {index < dateRangeOptions.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Tipo de Evento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TIPO DE EVENTO</Text>
            <View style={styles.card}>
              {eventTypeOptions.map((option, index) => (
                <React.Fragment key={option.key}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => setFilters({
                      ...filters,
                      eventType: filters.eventType === option.key ? undefined : option.key
                    })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[
                        styles.optionIcon,
                        filters.eventType === option.key && styles.optionIconActive
                      ]}>
                        <Ionicons
                          name={option.icon as any}
                          size={20}
                          color={filters.eventType === option.key
                            ? getIOSColor(IOS_COLORS.systemBlue, isDark)
                            : getIOSColor(IOS_COLORS.label.secondary, isDark)
                          }
                        />
                      </View>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                    </View>
                    {filters.eventType === option.key && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
                      />
                    )}
                  </TouchableOpacity>
                  {index < eventTypeOptions.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Ordenar Por */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ORDENAR POR</Text>
            <View style={styles.card}>
              {sortByOptions.map((option, index) => (
                <React.Fragment key={option.key}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => setFilters({ ...filters, sortBy: option.key })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[
                        styles.optionIcon,
                        filters.sortBy === option.key && styles.optionIconActive
                      ]}>
                        <Ionicons
                          name={option.icon as any}
                          size={20}
                          color={filters.sortBy === option.key
                            ? getIOSColor(IOS_COLORS.systemBlue, isDark)
                            : getIOSColor(IOS_COLORS.label.secondary, isDark)
                          }
                        />
                      </View>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                    </View>
                    {filters.sortBy === option.key && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
                      />
                    )}
                  </TouchableOpacity>
                  {index < sortByOptions.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </View>

        </ScrollView>

        {/* Footer con botón de aplicar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.7}
          >
            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (isDark: boolean) => {
  const colors = isDark ? IOS_COLORS : IOS_COLORS;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: getIOSColor(colors.background.primary, isDark),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: IOS_SPACING.lg,
      paddingVertical: IOS_SPACING.md,
      borderBottomWidth: 0.5,
      borderBottomColor: getIOSColor(colors.separator.opaque, isDark),
    },
    title: {
      ...IOS_TYPOGRAPHY.headline,
      color: getIOSColor(colors.label.primary, isDark),
      fontWeight: '600',
    },
    cancelText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.systemBlue, isDark),
    },
    resetText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.red, isDark),
    },
    content: {
      flex: 1,
      paddingHorizontal: IOS_SPACING.lg,
    },
    section: {
      marginTop: IOS_SPACING.xl,
    },
    sectionTitle: {
      ...IOS_TYPOGRAPHY.footnote,
      color: getIOSColor(colors.label.secondary, isDark),
      textTransform: 'uppercase',
      marginBottom: IOS_SPACING.sm,
      paddingLeft: 2,
    },
    card: {
      backgroundColor: isDark
        ? getIOSColor(colors.background.secondary, isDark)
        : getIOSColor(colors.background.tertiary, isDark),
      borderRadius: IOS_RADIUS.card,
      overflow: 'hidden',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: IOS_SPACING.md,
    },
    toggleOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: IOS_SPACING.md,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    optionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark
        ? getIOSColor(colors.fill.tertiary, isDark)
        : getIOSColor(colors.background.secondary, isDark),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: IOS_SPACING.md,
    },
    optionIconActive: {
      backgroundColor: isDark
        ? 'rgba(10, 132, 255, 0.15)'
        : 'rgba(0, 122, 255, 0.1)',
    },
    optionLabel: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.primary, isDark),
    },
    optionDescription: {
      ...IOS_TYPOGRAPHY.caption1,
      color: getIOSColor(colors.label.secondary, isDark),
      marginTop: 2,
    },
    divider: {
      height: 0.5,
      backgroundColor: getIOSColor(colors.separator.opaque, isDark),
      marginLeft: IOS_SPACING.md,
    },
    footer: {
      padding: IOS_SPACING.lg,
      paddingBottom: IOS_SPACING.xl,
      borderTopWidth: 0.5,
      borderTopColor: getIOSColor(colors.separator.opaque, isDark),
      backgroundColor: getIOSColor(colors.background.primary, isDark),
    },
    applyButton: {
      backgroundColor: getIOSColor(colors.systemBlue, isDark),
      paddingVertical: IOS_SPACING.md,
      borderRadius: IOS_RADIUS.button,
      alignItems: 'center',
    },
    applyButtonText: {
      ...IOS_TYPOGRAPHY.body,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });
};

export default EventFiltersModal;

