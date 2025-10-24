import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { registrationService } from "@/src/services";
import { RegistrationWithDetails } from "@/src/types";
import { Loading, ErrorMessage, IOSAlert, IOSSuccessAlert } from "@/src/components";
import {
  formatDate,
  formatTime,
  getTimeUntilEvent,
  getImageUrl,
  formatEventType,
} from "@/src/utils";
import { IOS_TYPOGRAPHY, IOS_SPACING, IOS_RADIUS, IOS_COLORS, IOS_SHADOWS, getIOSColor } from "@/src/constants/iosStyles";

/**
 * Pantalla de Mis Eventos - Estilo iOS/Apple
 * Eventos a los que el usuario está registrado
 */
export default function MyEventsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [registrations, setRegistrations] = useState<RegistrationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<{id: number, title: string} | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const styles = createStyles(isDark);

  /**
   * Carga las inscripciones del usuario
   */
  const loadRegistrations = async () => {
    try {
      setError("");
      const result = await registrationService.getMyRegistrations();

      if (result.success && result.data) {
        // Ordenar por fecha (más próximos primero)
        const sortedRegistrations = result.data.sort((a: RegistrationWithDetails, b: RegistrationWithDetails) => {
          return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
        });
        
        setRegistrations(sortedRegistrations);
      } else {
        setError("Error al cargar tus eventos");
      }
    } catch (error) {
      console.error("Error cargando registros:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  /**
   * Cancela una inscripción
   */
  const handleCancelRegistration = (registrationId: number, eventTitle: string) => {
    setSelectedRegistration({ id: registrationId, title: eventTitle });
    setShowCancelAlert(true);
  };

  /**
   * Confirma la cancelación
   */
  const confirmCancellation = async () => {
    if (!selectedRegistration) return;

    setIsCanceling(true);

    try {
      const result = await registrationService.cancelRegistration(selectedRegistration.id);

      if (result.success) {
        // Cerrar alerta de confirmación
        setShowCancelAlert(false);
        
        // Recargar eventos
        await loadRegistrations();
        
        // Mostrar alerta de éxito
        setTimeout(() => {
          setShowSuccessAlert(true);
        }, 300);
      } else {
        setError(result.message || "No se pudo cancelar");
      }
    } catch (error) {
      console.error("Error cancelando inscripción:", error);
      setError("No se pudo cancelar la inscripción");
    } finally {
      setIsCanceling(false);
      setSelectedRegistration(null);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  /**
   * Render de cada registro
   */
  const renderRegistration = ({ item }: { item: RegistrationWithDetails }) => {
    // Verificar si el evento ya pasó
    const eventDate = new Date(item.event_date);
    const isPast = eventDate.getTime() < Date.now();

    // Colores según categoría (CORREGIDO A ESPAÑOL)
    const categoryColor = 
      item.event_type === 'academico' ? getIOSColor(IOS_COLORS.systemBlue, isDark) :
      item.event_type === 'cultural' ? getIOSColor(IOS_COLORS.purple, isDark) :
      getIOSColor(IOS_COLORS.green, isDark);

    // Icono según categoría (CORREGIDO A ESPAÑOL)
    const categoryIcon = 
      item.event_type === 'academico' ? 'school' :
      item.event_type === 'cultural' ? 'color-palette' :
      'football';

    return (
      <TouchableOpacity
        style={[styles.eventCard, isPast && styles.eventCardPast]}
        onPress={() => router.push(`/event/${item.event_id}`)}
        activeOpacity={0.7}
      >
        {/* Imagen del evento */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getImageUrl(item.event_image) }}
            style={[styles.eventImage, isPast && styles.eventImagePast]}
            resizeMode="cover"
          />
          
          {/* Overlay gradient (opcional) */}
          <View style={styles.imageOverlay} />

          {/* Badge de categoría */}
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Ionicons name={categoryIcon as any} size={14} color="#FFFFFF" />
            <Text style={styles.categoryText}>{formatEventType(item.event_type)}</Text>
          </View>

          {/* Badge de estado */}
          {isPast && (
            <View style={styles.pastBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
              <Text style={styles.pastText}>Finalizado</Text>
            </View>
          )}
        </View>

        {/* Contenido */}
        <View style={styles.eventContent}>
          {/* Título */}
          <Text style={[styles.eventTitle, isPast && styles.eventTitlePast]} numberOfLines={2}>
            {item.event_title}
          </Text>

          {/* Organizador */}
          {item.organizer_name && (
            <View style={styles.organizerRow}>
              <Ionicons 
                name="person-circle-outline" 
                size={16} 
                color={getIOSColor(IOS_COLORS.label.tertiary, isDark)} 
              />
              <Text style={styles.organizerText} numberOfLines={1}>
                {item.organizer_name}
              </Text>
            </View>
          )}

          {/* Separador */}
          <View style={styles.separator} />

          {/* Fecha y hora */}
          <View style={styles.infoRow}>
            <Ionicons 
              name="calendar-outline" 
              size={16} 
              color={isPast 
                ? getIOSColor(IOS_COLORS.label.tertiary, isDark)
                : getIOSColor(IOS_COLORS.label.secondary, isDark)
              } 
            />
            <Text style={[styles.infoText, isPast && styles.infoTextPast]}>
              {formatDate(item.event_date)} • {formatTime(item.event_date)}
            </Text>
          </View>

          {/* Ubicación */}
          {item.event_location && (
            <View style={styles.infoRow}>
              <Ionicons 
                name="location-outline" 
                size={16} 
                color={isPast 
                  ? getIOSColor(IOS_COLORS.label.tertiary, isDark)
                  : getIOSColor(IOS_COLORS.label.secondary, isDark)
                } 
              />
              <Text style={[styles.infoText, isPast && styles.infoTextPast]} numberOfLines={1}>
                {item.event_location}
              </Text>
            </View>
          )}

          {/* Duración */}
          {item.duration && (
            <View style={styles.infoRow}>
              <Ionicons 
                name="time-outline" 
                size={16} 
                color={isPast 
                  ? getIOSColor(IOS_COLORS.label.tertiary, isDark)
                  : getIOSColor(IOS_COLORS.label.secondary, isDark)
                } 
              />
              <Text style={[styles.infoText, isPast && styles.infoTextPast]}>
                {item.duration} minutos
              </Text>
            </View>
          )}

          {/* Tiempo hasta el evento o botón de cancelar */}
          {!isPast && (
            <>
              {/* Badge de tiempo restante */}
              <View style={styles.timeUntilBadge}>
                <Ionicons name="alarm-outline" size={18} color={getIOSColor(IOS_COLORS.systemBlue, isDark)} />
                <Text style={styles.timeUntilText}>{getTimeUntilEvent(item.event_date)}</Text>
              </View>

              {/* Botón de cancelar mejorado */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelRegistration(item.registration_id, item.event_title)}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={18} color={getIOSColor(IOS_COLORS.red, isDark)} />
                <Text style={styles.cancelText}>Cancelar Inscripción</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Badge de evento pasado */}
          {isPast && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={getIOSColor(IOS_COLORS.green, isDark)} />
              <Text style={styles.completedText}>Evento completado</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Header de la lista
   */
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Mis Eventos</Text>
      <Text style={styles.headerSubtitle}>
        {registrations.length} {registrations.length === 1 ? "evento" : "eventos"} registrado{registrations.length !== 1 && "s"}
      </Text>
    </View>
  );

  /**
   * Empty state
   */
  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={80} color={getIOSColor(IOS_COLORS.label.quaternary, isDark)} />
      <Text style={styles.emptyTitle}>No tienes eventos</Text>
      <Text style={styles.emptySubtitle}>
        Explora los eventos disponibles y regístrate en los que te interesen
      </Text>
    </View>
  );

  if (loading) {
    return <Loading message="Cargando tus eventos..." />;
  }

  if (error && !refreshing) {
    return <ErrorMessage message={error} onRetry={loadRegistrations} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={registrations}
        renderItem={renderRegistration}
        keyExtractor={(item) => item.registration_id.toString()}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadRegistrations();
            }}
            tintColor={getIOSColor(IOS_COLORS.systemBlue, isDark)}
          />
        }
      />

      {/* Alert de confirmación para cancelar */}
      <IOSAlert
        visible={showCancelAlert}
        title="Cancelar Inscripción"
        message={`¿Estás seguro que deseas cancelar tu inscripción a:\n\n"${selectedRegistration?.title}"\n\nEsta acción liberará tu cupo y no podrás recuperarlo si el evento se llena.`}
        buttons={[
          {
            text: "No, mantener",
            style: "cancel",
            onPress: () => {
              setShowCancelAlert(false);
              setSelectedRegistration(null);
            },
          },
          {
            text: isCanceling ? "Cancelando..." : "Sí, cancelar",
            style: "destructive",
            onPress: confirmCancellation,
            loading: isCanceling,
          },
        ]}
        isLoading={isCanceling}
      />

      {/* Alert de éxito */}
      <IOSSuccessAlert
        visible={showSuccessAlert}
        type="success"
        title="¡Inscripción Cancelada!"
        message="Tu inscripción ha sido cancelada exitosamente. El cupo está ahora disponible para otros participantes."
        onClose={() => setShowSuccessAlert(false)}
        autoClose={true}
        autoCloseDuration={3000}
        buttonText="Entendido"
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
      paddingTop: IOS_SPACING.md,
      paddingBottom: IOS_SPACING.lg,
    },
    headerTitle: {
      ...IOS_TYPOGRAPHY.largeTitle,
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: IOS_SPACING.xs,
    },
    headerSubtitle: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
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
    eventCardPast: {
      opacity: 0.7,
    },
    imageContainer: {
      position: "relative",
      width: "100%",
      height: 180,
      backgroundColor: getIOSColor(colors.background.tertiary, isDark),
    },
    eventImage: {
      width: "100%",
      height: "100%",
    },
    eventImagePast: {
      opacity: 0.5,
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)",
    },
    categoryBadge: {
      position: "absolute",
      top: IOS_SPACING.md,
      left: IOS_SPACING.md,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: IOS_SPACING.sm + 2,
      paddingVertical: IOS_SPACING.xs + 2,
      borderRadius: IOS_RADIUS.medium,
      gap: 5,
      ...IOS_SHADOWS.small,
    },
    categoryText: {
      ...IOS_TYPOGRAPHY.caption1,
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 12,
    },
    pastBadge: {
      position: "absolute",
      top: IOS_SPACING.md,
      right: IOS_SPACING.md,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: IOS_SPACING.sm + 2,
      paddingVertical: IOS_SPACING.xs + 2,
      borderRadius: IOS_RADIUS.medium,
      backgroundColor: "rgba(0,0,0,0.6)",
      gap: 4,
      ...IOS_SHADOWS.small,
    },
    pastText: {
      ...IOS_TYPOGRAPHY.caption1,
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 12,
    },
    checkedInBadge: {
      position: "absolute",
      bottom: IOS_SPACING.sm,
      right: IOS_SPACING.sm,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: IOS_SPACING.sm,
      paddingVertical: IOS_SPACING.xs,
      borderRadius: IOS_RADIUS.small,
      backgroundColor: getIOSColor(colors.green, isDark),
      gap: 4,
    },
    checkedInText: {
      ...IOS_TYPOGRAPHY.caption1,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    eventContent: {
      padding: IOS_SPACING.lg,
    },
    eventTitle: {
      ...IOS_TYPOGRAPHY.title3,
      color: getIOSColor(colors.label.primary, isDark),
      fontWeight: "700",
      marginBottom: IOS_SPACING.xs,
    },
    eventTitlePast: {
      color: getIOSColor(colors.label.secondary, isDark),
    },
    organizerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: IOS_SPACING.xs,
      marginBottom: IOS_SPACING.md,
    },
    organizerText: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.label.tertiary, isDark),
      flex: 1,
    },
    separator: {
      height: 1,
      backgroundColor: getIOSColor(colors.separator, isDark),
      marginBottom: IOS_SPACING.md,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: IOS_SPACING.sm,
      marginBottom: IOS_SPACING.sm,
    },
    infoText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
      flex: 1,
    },
    infoTextPast: {
      color: getIOSColor(colors.label.tertiary, isDark),
    },
    timeUntilBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: IOS_SPACING.xs,
      marginTop: IOS_SPACING.md,
      marginBottom: IOS_SPACING.md,
      paddingHorizontal: IOS_SPACING.md,
      paddingVertical: IOS_SPACING.sm,
      backgroundColor: getIOSColor(colors.systemBlue, isDark) + "15",
      borderRadius: IOS_RADIUS.medium,
      borderWidth: 1,
      borderColor: getIOSColor(colors.systemBlue, isDark) + "30",
    },
    timeUntilText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.systemBlue, isDark),
      fontWeight: "700",
    },
    cancelButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: IOS_SPACING.xs,
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: getIOSColor(colors.red, isDark),
      borderRadius: IOS_RADIUS.button,
      paddingVertical: IOS_SPACING.md,
      marginTop: IOS_SPACING.xs,
    },
    cancelText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.red, isDark),
      fontWeight: "700",
    },
    completedBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: IOS_SPACING.xs,
      marginTop: IOS_SPACING.md,
      paddingHorizontal: IOS_SPACING.md,
      paddingVertical: IOS_SPACING.sm,
      backgroundColor: getIOSColor(colors.green, isDark) + "15",
      borderRadius: IOS_RADIUS.medium,
      borderWidth: 1,
      borderColor: getIOSColor(colors.green, isDark) + "30",
    },
    completedText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.green, isDark),
      fontWeight: "700",
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
