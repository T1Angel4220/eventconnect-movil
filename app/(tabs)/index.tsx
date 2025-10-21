import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/hooks";
import { eventService, registrationService } from "@/src/services";
import { EventWithOrganizer } from "@/src/types";
import { Loading, ErrorMessage } from "@/src/components";
import {
  formatDate,
  formatTime,
  formatDuration,
  getTimeUntilEvent,
  getEventTypeName,
  truncateText,
  formatCapacity,
  getOccupancyPercentage,
} from "@/src/utils";

/**
 * Dashboard Principal - Lista de Eventos Disponibles
 * Para usuarios participantes
 */
export default function EventsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [events, setEvents] = useState<EventWithOrganizer[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "academic" | "cultural" | "sports">("all");
  const [error, setError] = useState("");

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
        // Ordenar por fecha (más próximos primero)
        const sortedEvents = result.data.sort((a, b) => {
          return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
        });
        
        setEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
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

  /**
   * Efecto inicial
   */
  useEffect(() => {
    loadEvents();
  }, []);

  /**
   * Filtra los eventos según búsqueda y categoría
   */
  useEffect(() => {
    let filtered = [...events];

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) => event.event_type === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.organizer_name.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedCategory, events]);

  /**
   * Maneja el refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  /**
   * Navega a detalles del evento
   */
  const handleEventPress = (eventId: number) => {
    router.push({
      pathname: `/event/[id]`,
      params: { id: eventId },
    });
  };

  /**
   * Inscripción rápida
   */
  const handleQuickRegister = async (eventId: number, eventTitle: string) => {
    Alert.alert(
      "Confirmar Inscripción",
      `¿Deseas inscribirte a "${eventTitle}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Inscribirme",
          onPress: async () => {
            try {
              const result = await registrationService.createRegistration({ event_id: eventId });
              
              if (result.success) {
                Alert.alert("¡Inscripción Exitosa!", "Te has inscrito correctamente al evento");
                loadEvents(); // Recargar eventos
              } else {
                Alert.alert("Error", result.message);
              }
            } catch (error) {
              Alert.alert("Error", "No se pudo completar la inscripción");
            }
          },
        },
      ]
    );
  };

  /**
   * Renderiza un evento
   */
  const renderEvent = ({ item }: { item: EventWithOrganizer }) => {
    const occupancy = getOccupancyPercentage(item.registered_count || 0, item.capacity);
    const isFull = occupancy >= 100;
    const isAlmostFull = occupancy >= 80 && occupancy < 100;

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => handleEventPress(item.event_id)}
        activeOpacity={0.7}
      >
        {/* Imagen del evento */}
        <View style={styles.eventImageContainer}>
          {item.event_image ? (
            <Image
              source={{ uri: `http://10.79.27.186:3001${item.event_image}` }} // TODO: Usar API_BASE_URL desde config
              style={styles.eventImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.eventImage, styles.eventImagePlaceholder]}>
              <Ionicons name="calendar" size={40} color="#9ca3af" />
            </View>
          )}
          
          {/* Badge de categoría */}
          <View style={[styles.categoryBadge, styles[`${item.event_type}Badge`]]}>
            <Ionicons
              name={item.event_type === "academic" ? "school" : item.event_type === "cultural" ? "color-palette" : "football"}
              size={12}
              color="#ffffff"
            />
            <Text style={styles.categoryBadgeText}>{getEventTypeName(item.event_type)}</Text>
          </View>
        </View>

        {/* Contenido del evento */}
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>

          {item.description && (
            <Text style={styles.eventDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          {/* Información del evento */}
          <View style={styles.eventInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color="#6b7280" />
              <Text style={styles.infoText}>{formatDate(item.event_date)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="#6b7280" />
              <Text style={styles.infoText}>{formatTime(item.event_date)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="hourglass-outline" size={16} color="#6b7280" />
              <Text style={styles.infoText}>{formatDuration(item.duration)}</Text>
            </View>

            {item.location && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#6b7280" />
                <Text style={styles.infoText} numberOfLines={1}>
                  {truncateText(item.location, 20)}
                </Text>
              </View>
            )}
          </View>

          {/* Organizador */}
          <View style={styles.organizerContainer}>
            <Ionicons name="person-outline" size={14} color="#9ca3af" />
            <Text style={styles.organizerText}>{item.organizer_name}</Text>
          </View>

          {/* Capacidad */}
          <View style={styles.capacityContainer}>
            <View style={styles.capacityBar}>
              <View
                style={[
                  styles.capacityFill,
                  {
                    width: `${Math.min(occupancy, 100)}%`,
                    backgroundColor: isFull ? "#ef4444" : isAlmostFull ? "#f59e0b" : "#3b82f6",
                  },
                ]}
              />
            </View>
            <Text style={styles.capacityText}>
              {formatCapacity(item.registered_count || 0, item.capacity)}
            </Text>
          </View>

          {/* Tiempo hasta el evento */}
          <Text style={styles.timeUntil}>{getTimeUntilEvent(item.event_date)}</Text>

          {/* Botón de inscripción rápida */}
          {!isFull && (
            <TouchableOpacity
              style={styles.quickRegisterButton}
              onPress={(e) => {
                e.stopPropagation();
                handleQuickRegister(item.event_id, item.title);
              }}
            >
              <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
              <Text style={styles.quickRegisterText}>Inscribirme</Text>
            </TouchableOpacity>
          )}

          {isFull && (
            <View style={styles.fullBadge}>
              <Ionicons name="close-circle" size={18} color="#ef4444" />
              <Text style={styles.fullText}>Cupo Completo</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Header del listado
   */
  const ListHeader = () => (
    <View>
      {/* Bienvenida */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>¡Hola, {user?.first_name}! 👋</Text>
        <Text style={styles.subtitleText}>Descubre eventos increíbles</Text>
      </View>

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar eventos..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros de categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Ionicons
              name={category.icon as any}
              size={18}
              color={selectedCategory === category.key ? "#ffffff" : "#6b7280"}
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

      {/* Contador de eventos */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""} disponible{filteredEvents.length !== 1 ? "s" : ""}
        </Text>
      </View>
    </View>
  );

  /**
   * Contenido vacío
   */
  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No hay eventos</Text>
      <Text style={styles.emptyText}>
        {searchQuery || selectedCategory !== "all"
          ? "No se encontraron eventos con estos filtros"
          : "Aún no hay eventos disponibles"}
      </Text>
    </View>
  );

  // Estados de carga y error
  if (loading) {
    return <Loading message="Cargando eventos..." />;
  }

  if (error && events.length === 0) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} />
        <TouchableOpacity style={styles.retryButton} onPress={loadEvents}>
          <Ionicons name="refresh" size={20} color="#ffffff" />
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.event_id.toString()}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyComponent}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  listContent: {
    padding: 16,
  },
  welcomeContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: "#6b7280",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  categoryChipTextActive: {
    color: "#ffffff",
  },
  counterContainer: {
    marginBottom: 16,
  },
  counterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  eventCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImageContainer: {
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f3f4f6",
  },
  eventImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  academicBadge: {
    backgroundColor: "#3b82f6",
  },
  culturalBadge: {
    backgroundColor: "#8b5cf6",
  },
  sportsBadge: {
    backgroundColor: "#10b981",
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  eventInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6b7280",
  },
  organizerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  organizerText: {
    fontSize: 13,
    color: "#9ca3af",
  },
  capacityContainer: {
    marginBottom: 12,
  },
  capacityBar: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  capacityFill: {
    height: "100%",
    borderRadius: 3,
  },
  capacityText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  timeUntil: {
    fontSize: 13,
    color: "#3b82f6",
    fontWeight: "600",
    marginBottom: 12,
  },
  quickRegisterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  quickRegisterText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  fullBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  fullText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    gap: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
