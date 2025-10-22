import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { registrationService } from "@/src/services";
import { RegistrationWithDetails } from "@/src/types";
import { Loading, ErrorMessage } from "@/src/components";
import {
  formatDate,
  formatTime,
  getTimeUntilEvent,
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
    Alert.alert(
      "Cancelar Inscripción",
      `¿Estás seguro que deseas cancelar tu inscripción a "${eventTitle}"?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await registrationService.cancelRegistration(registrationId);

              if (result.success) {
                Alert.alert("¡Cancelado!", "Tu inscripción ha sido cancelada");
                loadRegistrations();
              } else {
                Alert.alert("Error", result.message || "No se pudo cancelar");
              }
            } catch (error) {
              Alert.alert("Error", "No se pudo cancelar la inscripción");
              console.error("Error cancelando inscripción:", error);
            }
          },
        },
      ]
    );
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

    // Colores según categoría
    const categoryColor = 
      item.event_type === 'academic' ? getIOSColor(IOS_COLORS.systemBlue, isDark) :
      item.event_type === 'cultural' ? getIOSColor(IOS_COLORS.purple, isDark) :
      getIOSColor(IOS_COLORS.green, isDark);

  return (
      <TouchableOpacity
        style={[styles.eventCard, isPast && styles.eventCardPast]}
        onPress={() => router.push(`/event/${item.event_id}`)}
        activeOpacity={0.7}
      >
        {/* Badge de categoría */}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: categoryColor },
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
          <Text style={styles.categoryText}>
            {item.event_type === 'academic' ? 'Académico' : 
             item.event_type === 'cultural' ? 'Cultural' : 
             'Deportivo'}
          </Text>
        </View>

        {/* Badge de estado */}
        {isPast && (
          <View style={styles.pastBadge}>
            <Text style={styles.pastText}>Finalizado</Text>
          </View>
        )}

        {/* Contenido */}
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <View style={styles.eventTitleContainer}>
              <Text style={[styles.eventTitle, isPast && styles.eventTitlePast]} numberOfLines={2}>
                {item.event_title}
              </Text>
            </View>
          </View>

          {/* Fecha y hora */}
          <View style={styles.infoRow}>
            <Ionicons 
              name="calendar-outline" 
              size={14} 
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
                size={14} 
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

          {/* Tiempo hasta el evento o botón de cancelar */}
          {!isPast && (
            <>
              <View style={styles.timeContainer}>
                <Ionicons 
                  name="time-outline" 
                  size={16} 
                  color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
                />
                <Text style={styles.timeText}>{getTimeUntilEvent(item.event_date)}</Text>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelRegistration(item.registration_id, item.event_title)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancelar Inscripción</Text>
              </TouchableOpacity>
            </>
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
      height: 160,
    },
    eventImage: {
      width: "100%",
      height: "100%",
    },
    eventImagePast: {
      opacity: 0.6,
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
    pastBadge: {
      position: "absolute",
      top: IOS_SPACING.sm,
      right: IOS_SPACING.sm,
      paddingHorizontal: IOS_SPACING.sm,
      paddingVertical: IOS_SPACING.xs,
      borderRadius: IOS_RADIUS.small,
      backgroundColor: getIOSColor(colors.systemGray, isDark),
    },
    pastText: {
      ...IOS_TYPOGRAPHY.caption1,
      color: "#FFFFFF",
      fontWeight: "600",
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
      padding: IOS_SPACING.md,
    },
    eventHeader: {
      marginBottom: IOS_SPACING.sm,
    },
    eventTitleContainer: {
    flex: 1,
    },
    eventTitle: {
      ...IOS_TYPOGRAPHY.headline,
      color: getIOSColor(colors.label.primary, isDark),
    },
    eventTitlePast: {
      color: getIOSColor(colors.label.secondary, isDark),
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
    infoTextPast: {
      color: getIOSColor(colors.label.tertiary, isDark),
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: IOS_SPACING.xs,
      marginTop: IOS_SPACING.sm,
      marginBottom: IOS_SPACING.sm,
    },
    timeText: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.systemBlue, isDark),
      fontWeight: "600",
    },
    cancelButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: getIOSColor(colors.red, isDark),
      borderRadius: IOS_RADIUS.button,
      paddingVertical: IOS_SPACING.sm,
      alignItems: "center",
      marginTop: IOS_SPACING.xs,
    },
    cancelText: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.red, isDark),
      fontWeight: "600",
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
