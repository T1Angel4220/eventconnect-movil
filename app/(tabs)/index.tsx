import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useTheme, useToast } from "@/src/hooks";
import { eventService } from "@/src/services";
import { EventWithOrganizer, EventFilters } from "@/src/types";
import { Loading, EventFiltersModal, NoConnection } from "@/src/components";
import {
  formatDate,
  formatTime,
  getEventTypeName,
  formatCapacity,
  getOccupancyPercentage,
  getImageUrl,
} from "@/src/utils";
import { IOS_TYPOGRAPHY, IOS_SPACING, IOS_RADIUS, IOS_COLORS, IOS_SHADOWS, getIOSColor } from "@/src/constants/iosStyles";

/**
 * Dashboard Principal - Lista de Eventos Disponibles (Estilo iOS)
 * Para usuarios participantes
 */
export default function EventsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark, toggleTheme, theme } = useTheme();
  const toast = useToast();

  const [events, setEvents] = useState<EventWithOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "academico" | "cultural" | "deportivo">("all");
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Estados para filtros avanzados
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<EventFilters>({});

  // Memoizar estilos para evitar recreación en cada render
  const styles = React.useMemo(() => createStyles(isDark), [isDark]);

  // Categorías para filtrar
  const categories = React.useMemo(() => [
    { key: "all", label: "Todos", icon: "apps" },
    { key: "academico", label: "Académico", icon: "school" },
    { key: "cultural", label: "Cultural", icon: "color-palette" },
    { key: "deportivo", label: "Deportivo", icon: "football" },
  ] as const, []);

  /**
   * Carga los eventos con filtros avanzados
   */
  const loadEvents = React.useCallback(async (isInitial: boolean = false) => {
    try {
      setHasConnectionError(false);
      
      // Construir filtros combinando categoría local con filtros avanzados
      const filters: EventFilters = {
        ...activeFilters,
        // Agregar filtro de categoría si no es "all"
        eventType: selectedCategory !== 'all' ? selectedCategory : activeFilters.eventType,
        // Usar sortBy por defecto si no hay filtros activos
        sortBy: activeFilters.sortBy || 'date',
        sortOrder: activeFilters.sortOrder || 'asc',
      };

      console.log('🔍 Cargando eventos - isInitial:', isInitial, 'isInitialLoad:', isInitialLoad);
      const result = await eventService.getEventsWithFilters(filters);

      if (result.success && result.data) {
        setEvents(result.data);
        setHasConnectionError(false);
        setIsInitialLoad(false);
        console.log('✅ Eventos cargados:', result.data.length);
      } else {
        console.log('❌ Error en respuesta - Mostrando PANTALLA COMPLETA');
        // SIEMPRE mostrar pantalla completa cuando hay error de conexión
        setHasConnectionError(true);
      }
    } catch (error) {
      console.error("Error cargando eventos - Mostrando PANTALLA COMPLETA", error);
      // SIEMPRE mostrar pantalla completa cuando no hay conexión
      setHasConnectionError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setRetrying(false);
    }
  }, [activeFilters, selectedCategory]);

  useEffect(() => {
    loadEvents(true); // Primera carga
  }, [loadEvents]);

  /**
   * Filtra eventos localmente (solo búsqueda)
   * Los filtros de categoría y avanzados se aplican en el backend
   */
  const filteredEvents = React.useMemo(() => {
    let filtered = events;

    // Filtrar por búsqueda local (solo búsqueda de texto)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((event) => {
        const matchTitle = event.title.toLowerCase().includes(query);
        const matchDesc = event.description?.toLowerCase().includes(query) || false;
        const matchLocation = event.location?.toLowerCase().includes(query) || false;
        return matchTitle || matchDesc || matchLocation;
      });
    }

    return filtered;
  }, [events, searchQuery]);

  /**
   * Contador de filtros activos
   */
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (activeFilters.dateRange) count++;
    if (activeFilters.location) count++;
    if (activeFilters.eventType) count++;
    if (activeFilters.status) count++;
    if (activeFilters.sortBy && activeFilters.sortBy !== 'date') count++;
    return count;
  }, [activeFilters]);

  /**
   * Aplicar filtros avanzados
   */
  const handleApplyFilters = React.useCallback((filters: EventFilters) => {
    console.log('🎯 Aplicando filtros en index:', filters);
    setActiveFilters(filters);
    
    // Si se seleccionó un tipo de evento en filtros avanzados, limpiar categoría local
    if (filters.eventType) {
      setSelectedCategory('all');
    }
    
    setShowFiltersModal(false);
  }, []);

  /**
   * Limpiar todos los filtros
   */
  const handleClearAllFilters = React.useCallback(() => {
    setActiveFilters({});
    setSelectedCategory('all');
    setSearchQuery('');
  }, []);


  /**
   * Render de cada evento - Memoizado
   */
  const renderEvent = React.useCallback(({ item }: { item: EventWithOrganizer }) => {
    const occupancy = getOccupancyPercentage(item.registered_count || 0, item.capacity);
    const isFull = occupancy >= 100;
    const isAlmostFull = occupancy >= 80 && occupancy < 100;

    // Normalizar tipo de evento a lowercase para comparaciones
    const eventType = item.event_type.toLowerCase();

    // Colores según categoría
    const getCategoryColor = () => {
      if (eventType === "academico") return getIOSColor(IOS_COLORS.systemBlue, isDark);
      if (eventType === "cultural") return getIOSColor(IOS_COLORS.purple, isDark);
      if (eventType === "deportivo") return getIOSColor(IOS_COLORS.green, isDark);
      return getIOSColor(IOS_COLORS.systemGray, isDark);
    };

    // Icono según categoría
    const getCategoryIcon = () => {
      if (eventType === "academico") return "school";
      if (eventType === "cultural") return "color-palette";
      if (eventType === "deportivo") return "football";
      return "calendar";
    };

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => router.push(`/event/${item.event_id}`)}
        activeOpacity={0.7}
      >
        {/* Imagen del evento */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getImageUrl(item.event_image) }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          
          {/* Badge de categoría */}
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor() },
            ]}
          >
            <Ionicons
              name={getCategoryIcon() as any}
              size={12}
              color="#FFFFFF"
            />
            <Text style={styles.categoryText}>{getEventTypeName(item.event_type)}</Text>
          </View>

          {/* Badge de lleno/casi lleno */}
          {(isFull || isAlmostFull) && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isFull ? getIOSColor(IOS_COLORS.red, isDark) : getIOSColor(IOS_COLORS.orange, isDark) },
              ]}
            >
              <Text style={styles.statusText}>{isFull ? "Lleno" : "Casi lleno"}</Text>
            </View>
          )}
        </View>

        {/* Contenido */}
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>

          {/* Fecha y hora */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color={getIOSColor(IOS_COLORS.label.secondary, isDark)} />
            <Text style={styles.infoText}>
              {formatDate(item.event_date)} • {formatTime(item.event_date)}
            </Text>
          </View>

          {/* Ubicación */}
          {item.location && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={14} color={getIOSColor(IOS_COLORS.label.secondary, isDark)} />
              <Text style={styles.infoText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          )}

          {/* Capacidad */}
          <View style={styles.capacityContainer}>
            <View style={styles.capacityBar}>
              <View
                style={[
                  styles.capacityFill,
                  {
                    width: `${Math.min(occupancy, 100)}%`,
                    backgroundColor: isFull
                      ? getIOSColor(IOS_COLORS.red, isDark)
                      : isAlmostFull
                      ? getIOSColor(IOS_COLORS.orange, isDark)
                      : getIOSColor(IOS_COLORS.systemBlue, isDark),
                  },
                ]}
              />
            </View>
            <Text style={styles.capacityText}>
              {formatCapacity(item.registered_count || 0, item.capacity)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [router, isDark, styles]);

  /**
   * Header simplificado - Solo el título de sección
   */
  const ListHeader = React.useCallback(() => (
    <View style={styles.listHeaderContainer}>
      <Text style={styles.sectionTitle}>Próximos Eventos</Text>
    </View>
  ), [styles]);

  /**
   * Empty state
   */
  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={80} color={getIOSColor(IOS_COLORS.label.quaternary, isDark)} />
      <Text style={styles.emptyTitle}>No hay eventos disponibles</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedCategory !== "all"
          ? "Intenta cambiar los filtros"
          : "Vuelve más tarde para ver nuevos eventos"}
      </Text>
    </View>
  );

  // Manejo de estados de carga y error
  if (loading && !retrying) {
    return <Loading message="Cargando eventos..." />;
  }

  if (hasConnectionError) {
    return (
      <NoConnection 
        onRetry={() => {
          setRetrying(true);
          setHasConnectionError(false);
          setLoading(true);
          loadEvents(true); // Reintentar como carga inicial
        }}
        message="Sin conexión a internet"
        retrying={retrying}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header FUERA del FlatList para que el teclado no se cierre */}
      <View style={styles.headerContainer}>
        {/* Saludo */}
        <View style={styles.greetingContainer}>
          <View>
            <Text style={styles.greetingText}>Hola,</Text>
            <Text style={styles.userName}>{user?.first_name || "Usuario"} 👋</Text>
          </View>
          {/* Toggle de tema */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.themeToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={theme === 'system' ? 'phone-portrait-outline' : isDark ? "sunny" : "moon"}
              size={24}
              color={getIOSColor(IOS_COLORS.label.primary, isDark)}
            />
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda con filtros */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={getIOSColor(IOS_COLORS.label.tertiary, isDark)} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={getIOSColor(IOS_COLORS.label.tertiary, isDark)}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={18} color={getIOSColor(IOS_COLORS.label.tertiary, isDark)} />
            </TouchableOpacity>
          )}
          {/* Botón de filtros avanzados */}
          <TouchableOpacity
            onPress={() => setShowFiltersModal(true)}
            style={styles.filterButtonInSearch}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={getIOSColor(IOS_COLORS.label.primary, isDark)}
            />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Filtros de categoría - FUERA del FlatList */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          style={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryChip,
                selectedCategory === category.key && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.key as typeof selectedCategory)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={
                  selectedCategory === category.key
                    ? "#FFFFFF"
                    : getIOSColor(IOS_COLORS.label.primary, isDark)
                }
              />
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category.key && styles.categoryChipTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Chips de filtros activos */}
        {activeFiltersCount > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersContainer}
            style={styles.activeFiltersScroll}
          >
            <TouchableOpacity
              style={styles.clearFiltersChip}
              onPress={handleClearAllFilters}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={16} color="#FFFFFF" />
              <Text style={styles.clearFiltersText}>Limpiar ({activeFiltersCount})</Text>
            </TouchableOpacity>
            
            {activeFilters.dateRange && (
              <View style={styles.activeFilterChip}>
                <Ionicons name="calendar" size={14} color={getIOSColor(IOS_COLORS.systemBlue, isDark)} />
                <Text style={styles.activeFilterText}>
                  {activeFilters.dateRange === 'today' && 'Hoy'}
                  {activeFilters.dateRange === 'this_week' && 'Esta Semana'}
                  {activeFilters.dateRange === 'this_month' && 'Este Mes'}
                  {activeFilters.dateRange === 'custom' && 'Personalizado'}
                </Text>
              </View>
            )}
            
            {activeFilters.status && (
              <View style={styles.activeFilterChip}>
                <Ionicons name="time" size={14} color={getIOSColor(IOS_COLORS.orange, isDark)} />
                <Text style={styles.activeFilterText}>
                  {activeFilters.status === 'upcoming' && 'Próximos'}
                  {activeFilters.status === 'in_progress' && 'En Curso'}
                  {activeFilters.status === 'completed' && 'Completados'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Lista de eventos */}
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.event_id.toString()}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadEvents();
            }}
            tintColor={getIOSColor(IOS_COLORS.systemBlue, isDark)}
          />
        }
      />

      {/* Modal de filtros avanzados */}
      <EventFiltersModal
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        filters={activeFilters}
        onApply={handleApplyFilters}
      />
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => {
  const colors = isDark ? IOS_COLORS : IOS_COLORS;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: getIOSColor(colors.background.primary, isDark),
    },
    listContent: {
      paddingBottom: IOS_SPACING.xl,
    },
    headerContainer: {
      paddingHorizontal: IOS_SPACING.lg,
      paddingTop: IOS_SPACING.xl,
      paddingBottom: IOS_SPACING.lg,
    },
    greetingContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: IOS_SPACING.lg,
    },
    greetingText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
    },
    userName: {
      ...IOS_TYPOGRAPHY.largeTitle,
      color: getIOSColor(colors.label.primary, isDark),
      marginTop: IOS_SPACING.xs,
    },
    themeToggle: {
      padding: IOS_SPACING.sm,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark
        ? getIOSColor(colors.fill.tertiary, isDark)
        : getIOSColor(colors.background.secondary, isDark),
      borderRadius: IOS_RADIUS.medium,
      paddingHorizontal: IOS_SPACING.md,
      paddingVertical: IOS_SPACING.sm,
      marginBottom: IOS_SPACING.lg,
    },
    searchInput: {
      flex: 1,
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.primary, isDark),
      marginLeft: IOS_SPACING.sm,
      marginRight: IOS_SPACING.sm,
    },
    filterButtonInSearch: {
      position: 'relative',
      padding: IOS_SPACING.xs,
      marginLeft: IOS_SPACING.xs,
    },
    filterBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: getIOSColor(colors.red, isDark),
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    filterBadgeText: {
      ...IOS_TYPOGRAPHY.caption2,
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 10,
    },
    categoriesScroll: {
      marginBottom: IOS_SPACING.xl,
    },
    categoriesContainer: {
      flexDirection: "row",
      gap: IOS_SPACING.sm,
      paddingRight: IOS_SPACING.lg,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: IOS_SPACING.md,
      paddingVertical: IOS_SPACING.sm,
      borderRadius: IOS_RADIUS.large,
      backgroundColor: isDark
        ? getIOSColor(colors.fill.tertiary, isDark)
        : getIOSColor(colors.background.secondary, isDark),
      gap: IOS_SPACING.xs,
    },
    categoryChipActive: {
      backgroundColor: getIOSColor(colors.systemBlue, isDark),
    },
    categoryChipText: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.label.primary, isDark),
      fontWeight: "600",
    },
    categoryChipTextActive: {
      color: "#FFFFFF",
    },
    activeFiltersScroll: {
      marginTop: IOS_SPACING.md,
    },
    activeFiltersContainer: {
      flexDirection: 'row',
      gap: IOS_SPACING.sm,
      paddingRight: IOS_SPACING.lg,
    },
    clearFiltersChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: IOS_SPACING.md,
      paddingVertical: IOS_SPACING.sm,
      borderRadius: IOS_RADIUS.large,
      backgroundColor: getIOSColor(colors.red, isDark),
      gap: IOS_SPACING.xs,
    },
    clearFiltersText: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    activeFilterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: IOS_SPACING.md,
      paddingVertical: IOS_SPACING.sm,
      borderRadius: IOS_RADIUS.large,
      backgroundColor: isDark
        ? getIOSColor(colors.fill.tertiary, isDark)
        : getIOSColor(colors.background.secondary, isDark),
      gap: IOS_SPACING.xs,
      borderWidth: 1,
      borderColor: getIOSColor(colors.separator.opaque, isDark),
    },
    activeFilterText: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.label.primary, isDark),
      fontWeight: '500',
    },
    listHeaderContainer: {
      paddingHorizontal: IOS_SPACING.lg,
      paddingTop: IOS_SPACING.md,
    },
    sectionTitle: {
      ...IOS_TYPOGRAPHY.title2,
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: IOS_SPACING.md,
    },
    eventCard: {
      marginHorizontal: IOS_SPACING.lg,
      marginBottom: IOS_SPACING.lg,
      borderRadius: IOS_RADIUS.card,
      backgroundColor: isDark
        ? getIOSColor(colors.background.secondary, isDark)
        : getIOSColor(colors.background.tertiary, isDark),
      overflow: "hidden",
      ...IOS_SHADOWS.medium,
    },
    imageContainer: {
      position: "relative",
      width: "100%",
      height: 180,
    },
    eventImage: {
      width: "100%",
      height: "100%",
    },
    categoryBadge: {
      position: "absolute",
      top: IOS_SPACING.sm,
      left: IOS_SPACING.sm,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: IOS_SPACING.sm,
      paddingVertical: IOS_SPACING.xs,
      borderRadius: IOS_RADIUS.small,
      gap: 4,
    },
    categoryText: {
      ...IOS_TYPOGRAPHY.caption1,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    statusBadge: {
      position: "absolute",
      top: IOS_SPACING.sm,
      right: IOS_SPACING.sm,
      paddingHorizontal: IOS_SPACING.sm,
      paddingVertical: IOS_SPACING.xs,
      borderRadius: IOS_RADIUS.small,
    },
    statusText: {
      ...IOS_TYPOGRAPHY.caption1,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    eventContent: {
      padding: IOS_SPACING.md,
    },
    eventTitle: {
      ...IOS_TYPOGRAPHY.headline,
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: IOS_SPACING.sm,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: IOS_SPACING.xs,
      marginBottom: IOS_SPACING.xs,
    },
    infoText: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.label.secondary, isDark),
    },
    capacityContainer: {
      marginTop: IOS_SPACING.sm,
    },
    capacityBar: {
      height: 4,
      backgroundColor: getIOSColor(colors.fill.tertiary, isDark),
      borderRadius: 2,
      overflow: "hidden",
      marginBottom: IOS_SPACING.xs,
    },
    capacityFill: {
      height: "100%",
      borderRadius: 2,
    },
    capacityText: {
      ...IOS_TYPOGRAPHY.caption1,
      color: getIOSColor(colors.label.tertiary, isDark),
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: IOS_SPACING.xxxl * 2,
      paddingHorizontal: IOS_SPACING.xl,
    },
    emptyTitle: {
      ...IOS_TYPOGRAPHY.title2,
      color: getIOSColor(colors.label.primary, isDark),
      marginTop: IOS_SPACING.lg,
      marginBottom: IOS_SPACING.sm,
      textAlign: "center",
    },
    emptySubtitle: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
      textAlign: "center",
    },
  });
};
