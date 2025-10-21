import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { eventService, registrationService } from "@/src/services";
import { EventWithOrganizer } from "@/src/types";
import { Loading, Button } from "@/src/components";
import {
  formatDate,
  formatTime,
  formatDuration,
  getTimeUntilEvent,
  getEventTypeName,
  formatCapacity,
  getOccupancyPercentage,
} from "@/src/utils";

/**
 * Pantalla de Detalles de Evento
 */
export default function EventDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const eventId = params.id ? parseInt(params.id) : 0;

  const [event, setEvent] = useState<EventWithOrganizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  /**
   * Carga los detalles del evento
   */
  useEffect(() => {
    if (eventId) {
      loadEventDetails();
    }
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      const result = await eventService.getEventById(eventId);

      if (result.success && result.data) {
        setEvent(result.data);
      } else {
        Alert.alert("Error", result.message || "No se pudo cargar el evento");
        router.back();
      }
    } catch (error) {
      console.error("Error cargando evento:", error);
      Alert.alert("Error", "Error al conectar con el servidor");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la inscripción al evento
   */
  const handleRegister = async () => {
    if (!event) return;

    Alert.alert(
      "Confirmar Inscripción",
      `¿Deseas inscribirte a "${event.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              setRegistering(true);
              const result = await registrationService.createRegistration({
                event_id: eventId,
              });

              if (result.success) {
                Alert.alert(
                  "¡Inscripción Exitosa!",
                  "Te has inscrito correctamente al evento",
                  [
                    {
                      text: "Ver Mis Eventos",
                      onPress: () => router.push("/(tabs)/my-events"),
                    },
                    { text: "OK" },
                  ]
                );
              } else {
                Alert.alert("Error", result.message);
              }
            } catch (error) {
              Alert.alert("Error", "No se pudo completar la inscripción");
            } finally {
              setRegistering(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <Loading message="Cargando detalles..." />;
  }

  if (!event) {
    return null;
  }

  const occupancy = getOccupancyPercentage(event.registered_count || 0, event.capacity);
  const isFull = occupancy >= 100;
  const isAlmostFull = occupancy >= 80 && occupancy < 100;

  return (
    <View style={styles.container}>
      {/* Header con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Evento</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Imagen del evento */}
        <View style={styles.imageContainer}>
          {event.event_image ? (
            <Image
              source={{ uri: `http://10.79.27.186:3001${event.event_image}` }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="calendar" size={80} color="#d1d5db" />
            </View>
          )}

          {/* Badge de categoría */}
          <View style={[styles.categoryBadge, styles[`${event.event_type}Badge`]]}>
            <Ionicons
              name={
                event.event_type === "academic"
                  ? "school"
                  : event.event_type === "cultural"
                  ? "color-palette"
                  : "football"
              }
              size={16}
              color="#ffffff"
            />
            <Text style={styles.categoryText}>{getEventTypeName(event.event_type)}</Text>
          </View>
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          {/* Título */}
          <Text style={styles.title}>{event.title}</Text>

          {/* Tiempo hasta el evento */}
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={20} color="#3b82f6" />
            <Text style={styles.timeText}>{getTimeUntilEvent(event.event_date)}</Text>
          </View>

          {/* Descripción */}
          {event.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          )}

          {/* Información del evento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="calendar" size={20} color="#3b82f6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Fecha</Text>
                  <Text style={styles.infoValue}>{formatDate(event.event_date)}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="time" size={20} color="#3b82f6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Hora</Text>
                  <Text style={styles.infoValue}>{formatTime(event.event_date)}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="hourglass" size={20} color="#3b82f6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Duración</Text>
                  <Text style={styles.infoValue}>{formatDuration(event.duration)}</Text>
                </View>
              </View>

              {event.location && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="location" size={20} color="#3b82f6" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Ubicación</Text>
                      <Text style={styles.infoValue}>{event.location}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Organizador */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organizador</Text>
            <View style={styles.organizerCard}>
              <View style={styles.organizerIcon}>
                <Ionicons name="person" size={24} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.organizerName}>{event.organizer_name}</Text>
                <Text style={styles.organizerEmail}>{event.organizer_email}</Text>
              </View>
            </View>
          </View>

          {/* Capacidad */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disponibilidad</Text>
            <View style={styles.capacityCard}>
              <View style={styles.capacityHeader}>
                <Text style={styles.capacityText}>
                  {formatCapacity(event.registered_count || 0, event.capacity)}
                </Text>
                <Text
                  style={[
                    styles.occupancyText,
                    { color: isFull ? "#ef4444" : isAlmostFull ? "#f59e0b" : "#10b981" },
                  ]}
                >
                  {occupancy}% ocupado
                </Text>
              </View>
              <View style={styles.capacityBar}>
                <View
                  style={[
                    styles.capacityFill,
                    {
                      width: `${Math.min(occupancy, 100)}%`,
                      backgroundColor: isFull
                        ? "#ef4444"
                        : isAlmostFull
                        ? "#f59e0b"
                        : "#3b82f6",
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón de inscripción fijo */}
      <View style={styles.footer}>
        {isFull ? (
          <View style={styles.fullContainer}>
            <Ionicons name="close-circle" size={24} color="#ef4444" />
            <Text style={styles.fullText}>Cupo Completo</Text>
          </View>
        ) : (
          <Button
            title="Inscribirme al Evento"
            onPress={handleRegister}
            loading={registering}
            fullWidth
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#f3f4f6",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
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
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  organizerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  organizerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  organizerEmail: {
    fontSize: 14,
    color: "#6b7280",
  },
  capacityCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  capacityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  capacityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  occupancyText: {
    fontSize: 14,
    fontWeight: "600",
  },
  capacityBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  capacityFill: {
    height: "100%",
    borderRadius: 4,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  fullContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 12,
  },
  fullText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ef4444",
  },
});

