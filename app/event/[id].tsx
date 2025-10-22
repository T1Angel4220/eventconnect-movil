import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
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
  getImageUrl,
} from "@/src/utils";
import { useTheme } from "@/src/hooks";
import { IOS_TYPOGRAPHY, IOS_SPACING, IOS_RADIUS, IOS_COLORS, IOS_SHADOWS, getIOSColor } from "@/src/constants/iosStyles";

/**
 * Pantalla de Detalles de Evento - Estilo iOS/Apple
 */
export default function EventDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const eventId = params.id ? parseInt(params.id) : 0;
  const { isDark } = useTheme();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          text: "Inscribirme",
          onPress: async () => {
            try {
              setRegistering(true);
              const result = await registrationService.createRegistration({ event_id: event.event_id });

              if (result.success) {
                Alert.alert("¡Éxito!", "Te has inscrito exitosamente al evento", [
                  {
                    text: "Ver Mis Eventos",
                    onPress: () => router.push("/(tabs)/my-events"),
                  },
                  {
                    text: "Aceptar",
                    onPress: () => router.back(),
                  },
                ]);
              } else {
                Alert.alert("Error", result.message);
              }
            } catch (error) {
              Alert.alert("Error", "No se pudo completar la inscripción");
              console.error("Error en inscripción:", error);
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

  // Colores según categoría
  const categoryColors = {
    academic: getIOSColor(IOS_COLORS.systemBlue, isDark),
    cultural: getIOSColor(IOS_COLORS.purple, isDark),
    sports: getIOSColor(IOS_COLORS.green, isDark),
  };

  const styles = createStyles(isDark);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header transparente sobre la imagen */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.backButtonCircle}>
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={getIOSColor(IOS_COLORS.label.primary, isDark)} 
              />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Imagen del evento */}
          <View style={styles.imageContainer}>
            {event.event_image ? (
              <Image
                source={{ uri: getImageUrl(event.event_image) }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                <Ionicons name="calendar" size={80} color={getIOSColor(IOS_COLORS.label.quaternary, isDark)} />
              </View>
            )}

            {/* Badge de categoría */}
            <View style={[styles.categoryBadge, { backgroundColor: categoryColors[event.event_type] }]}>
              <Ionicons
                name={
                  event.event_type === "academic"
                    ? "school"
                    : event.event_type === "cultural"
                    ? "color-palette"
                    : "football"
                }
                size={16}
                color="#FFFFFF"
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
              <Ionicons 
                name="time-outline" 
                size={20} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
              />
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
                    <Ionicons 
                      name="calendar" 
                      size={20} 
                      color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Fecha</Text>
                    <Text style={styles.infoValue}>{formatDate(event.event_date)}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons 
                      name="time" 
                      size={20} 
                      color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Hora</Text>
                    <Text style={styles.infoValue}>{formatTime(event.event_date)}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons 
                      name="hourglass" 
                      size={20} 
                      color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
                    />
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
                        <Ionicons 
                          name="location" 
                          size={20} 
                          color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
                        />
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
                  <Ionicons 
                    name="person" 
                    size={24} 
                    color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
                  />
                </View>
                <View>
                  <Text style={styles.organizerName}>
                    {event.organizer_first_name} {event.organizer_last_name}
                  </Text>
                  <Text style={styles.organizerEmail}>{event.organizer_email}</Text>
                </View>
              </View>
            </View>

            {/* Capacidad */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Capacidad</Text>

              <View style={styles.capacityCard}>
                <View style={styles.capacityHeader}>
                  <Text style={styles.capacityText}>Lugares disponibles</Text>
                  <Text style={[
                    styles.occupancyText,
                    {
                      color: isFull
                        ? getIOSColor(IOS_COLORS.red, isDark)
                        : isAlmostFull
                        ? getIOSColor(IOS_COLORS.orange, isDark)
                        : getIOSColor(IOS_COLORS.green, isDark),
                    },
                  ]}>
                    {formatCapacity(event.registered_count || 0, event.capacity)}
                  </Text>
                </View>

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
              </View>
            </View>
          </View>

          {/* Espaciador para el botón flotante */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Botón de inscripción flotante */}
        <View style={styles.footer}>
          {isFull ? (
            <View style={styles.fullContainer}>
              <Ionicons 
                name="close-circle" 
                size={24} 
                color={getIOSColor(IOS_COLORS.red, isDark)} 
              />
              <Text style={styles.fullText}>Evento Lleno</Text>
            </View>
          ) : (
            <Button
              title={registering ? "Inscribiendo..." : "Inscribirse al Evento"}
              onPress={handleRegister}
              loading={registering}
              fullWidth
            />
          )}
        </View>
      </View>
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
    container: {
      flex: 1,
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      paddingTop: IOS_SPACING.md,
      paddingHorizontal: IOS_SPACING.lg,
    },
    backButton: {
      width: 40,
      height: 40,
    },
    backButtonCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark
        ? 'rgba(44, 44, 46, 0.9)'
        : 'rgba(255, 255, 255, 0.9)',
      alignItems: "center",
      justifyContent: "center",
      ...IOS_SHADOWS.medium,
    },
    scrollView: {
      flex: 1,
    },
    imageContainer: {
      position: "relative",
    },
    image: {
      width: "100%",
      height: 320,
      backgroundColor: getIOSColor(colors.fill.tertiary, isDark),
    },
    imagePlaceholder: {
      justifyContent: "center",
      alignItems: "center",
    },
    categoryBadge: {
      position: "absolute",
      bottom: IOS_SPACING.lg,
      left: IOS_SPACING.lg,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: IOS_SPACING.md,
      paddingVertical: IOS_SPACING.sm,
      borderRadius: IOS_RADIUS.medium,
      gap: IOS_SPACING.xs,
      ...IOS_SHADOWS.medium,
    },
    categoryText: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    content: {
      padding: IOS_SPACING.lg,
    },
    title: {
      ...IOS_TYPOGRAPHY.largeTitle,
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: IOS_SPACING.md,
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: IOS_SPACING.xl,
      gap: IOS_SPACING.sm,
    },
    timeText: {
      ...IOS_TYPOGRAPHY.headline,
      color: getIOSColor(colors.systemBlue, isDark),
    },
    section: {
      marginBottom: IOS_SPACING.xl,
    },
    sectionTitle: {
      ...IOS_TYPOGRAPHY.title3,
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: IOS_SPACING.md,
    },
    description: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
      lineHeight: 24,
    },
    infoCard: {
      backgroundColor: isDark
        ? getIOSColor(colors.background.secondary, isDark)
        : getIOSColor(colors.background.tertiary, isDark),
      borderRadius: IOS_RADIUS.card,
      overflow: "hidden",
      ...IOS_SHADOWS.small,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: IOS_SPACING.md,
    },
    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark 
        ? 'rgba(10, 132, 255, 0.15)' 
        : 'rgba(0, 122, 255, 0.1)',
      alignItems: "center",
      justifyContent: "center",
      marginRight: IOS_SPACING.md,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      ...IOS_TYPOGRAPHY.caption1,
      color: getIOSColor(colors.label.secondary, isDark),
      marginBottom: 2,
    },
    infoValue: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.primary, isDark),
      fontWeight: "600",
    },
    divider: {
      height: 0.5,
      backgroundColor: getIOSColor(colors.separator.opaque, isDark),
      marginLeft: IOS_SPACING.md,
    },
    organizerCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark
        ? getIOSColor(colors.background.secondary, isDark)
        : getIOSColor(colors.background.tertiary, isDark),
      borderRadius: IOS_RADIUS.card,
      padding: IOS_SPACING.md,
      ...IOS_SHADOWS.small,
    },
    organizerIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark 
        ? 'rgba(10, 132, 255, 0.15)' 
        : 'rgba(0, 122, 255, 0.1)',
      alignItems: "center",
      justifyContent: "center",
      marginRight: IOS_SPACING.md,
    },
    organizerName: {
      ...IOS_TYPOGRAPHY.headline,
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: 2,
    },
    organizerEmail: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.label.secondary, isDark),
    },
    capacityCard: {
      backgroundColor: isDark
        ? getIOSColor(colors.background.secondary, isDark)
        : getIOSColor(colors.background.tertiary, isDark),
      borderRadius: IOS_RADIUS.card,
      padding: IOS_SPACING.md,
      ...IOS_SHADOWS.small,
    },
    capacityHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: IOS_SPACING.md,
    },
    capacityText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.primary, isDark),
    },
    occupancyText: {
      ...IOS_TYPOGRAPHY.headline,
      fontWeight: "600",
    },
    capacityBar: {
      height: 8,
      backgroundColor: getIOSColor(colors.fill.tertiary, isDark),
      borderRadius: 4,
      overflow: "hidden",
    },
    capacityFill: {
      height: "100%",
      borderRadius: 4,
    },
    bottomSpacer: {
      height: 100,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: IOS_SPACING.lg,
      paddingBottom: IOS_SPACING.xl,
      backgroundColor: isDark
        ? 'rgba(28, 28, 30, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
      borderTopWidth: 0.5,
      borderTopColor: getIOSColor(colors.separator.opaque, isDark),
    },
    fullContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? 'rgba(255, 69, 58, 0.15)'
        : 'rgba(255, 59, 48, 0.1)',
      borderRadius: IOS_RADIUS.button,
      paddingVertical: IOS_SPACING.md,
      gap: IOS_SPACING.sm,
    },
    fullText: {
      ...IOS_TYPOGRAPHY.headline,
      color: getIOSColor(colors.red, isDark),
    },
  });
};
