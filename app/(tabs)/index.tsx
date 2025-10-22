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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useTheme } from "@/src/hooks";
import { eventService } from "@/src/services";
import { EventWithOrganizer } from "@/src/types";
import { Loading, ErrorMessage } from "@/src/components";
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

  const [events, setEvents] = useState<EventWithOrganizer[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "academic" | "cultural" | "sports">("all");
  const [error, setError] = useState("");

  const styles = createStyles(isDark);

  // Categorías para filtrar
  const categories = [
    { key: "all", label: "Todos", icon: "apps" },
    { key: "academic", label: "Académico", icon: "school" },
    { key: "cultural", label: "Cultural", icon: "color-palette" },
    { key: "sports", label: "Deportivo", icon: "football" },
  ] as const;

  /**
   * Carga los eventos
   */
  const loadEvents = async () => {
    try {
      setError("");
      const result = await eventService.getAllEvents();

      if (result.success && result.data) {
        const sortedEvents = result.data.sort((a, b) => {
          return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
        });
        
        setEvents(sortedEvents);
        filterEvents(sortedEvents, searchQuery, selectedCategory);
      } else {
        setError(result.message || "Error al cargar eventos");
      }
    } catch (error) {
      console.error("Error cargando eventos:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Filtra eventos por búsqueda y categoría
   */
  const filterEvents = (
    eventsList: EventWithOrganizer[],
    query: string,
    category: typeof selectedCategory
  ) => {
    let filtered = eventsList;

    if (category !== "all") {
      filtered = filtered.filter((event) => event.event_type === category);
    }

    if (query.trim()) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  /**
   * Maneja el cambio de búsqueda
   */
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterEvents(events, text, selectedCategory);
  };

  /**
   * Maneja el cambio de categoría
   */
  const handleCategoryChange = (category: typeof selectedCategory) => {
    setSelectedCategory(category);
    filterEvents(events, searchQuery, category);
  };


  /**
   * Render de cada evento
   */
  const renderEvent = ({ item }: { item: EventWithOrganizer }) => {
    const occupancy = getOccupancyPercentage(item.registered_count || 0, item.capacity);
    const isFull = occupancy >= 100;
    const isAlmostFull = occupancy >= 80 && occupancy < 100;

    // Colores según categoría
    const categoryColors = {
      academic: getIOSColor(IOS_COLORS.systemBlue, isDark),
      cultural: getIOSColor(IOS_COLORS.purple, isDark),
      sports: getIOSColor(IOS_COLORS.green, isDark),
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
              { backgroundColor: categoryColors[item.event_type] },
            ]}
          >
            <Ionicons
              name={
                item.event_type === "academic"
                  ? "school"
                  : item.event_type === "cultural"
                  ? "color-palette"
                  : "football"
              }
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
  };

  /**
   * Header de la lista
   */
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* Saludo */}
      <View style={styles.greetingContainer}>
        <View>
          <Text style={styles.greetingText}>Hola,</Text>
          <Text style={styles.userName}>{user?.first_name || "Usuario"} 👋</Text>
        </View>
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

      {/* Barra de búsqueda estilo iOS */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={getIOSColor(IOS_COLORS.label.tertiary, isDark)} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar eventos..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={getIOSColor(IOS_COLORS.label.tertiary, isDark)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close-circle" size={18} color={getIOSColor(IOS_COLORS.label.tertiary, isDark)} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros de categoría */}
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && styles.categoryChipActive,
            ]}
            onPress={() => handleCategoryChange(category.key as typeof selectedCategory)}
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
      </View>

      {/* Título de sección */}
      <Text style={styles.sectionTitle}>Próximos Eventos</Text>
    </View>
  );

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

  if (loading) {
    return <Loading message="Cargando eventos..." />;
  }

  if (error && !refreshing) {
    return <ErrorMessage message={error} onRetry={loadEvents} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.event_id.toString()}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    categoriesContainer: {
      flexDirection: "row",
      gap: IOS_SPACING.sm,
      marginBottom: IOS_SPACING.xl,
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
