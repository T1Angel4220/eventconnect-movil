import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useTheme } from "@/src/hooks";
import { IOS_TYPOGRAPHY, IOS_SPACING, IOS_RADIUS, IOS_COLORS, IOS_SHADOWS, getIOSColor } from "@/src/constants/iosStyles";
import { IOSAlert, AlertButton } from "@/src/components";

/**
 * Pantalla de Perfil de Usuario - Estilo iOS/Apple
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  // Estado para la alerta iOS
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons: AlertButton[];
  }>({
    visible: false,
    title: "",
    message: "",
    buttons: [{ text: "OK", style: "default" }],
  });

  const styles = createStyles(isDark);

  /**
   * Ejecuta el logout y redirige al login
   */
  const performLogout = async () => {
    try {
      await logout();
      // Redirigir al login después de cerrar sesión
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    setAlertConfig({
      visible: true,
      title: "Cerrar Sesión",
      message: "¿Estás seguro que deseas cerrar sesión?",
      buttons: [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: performLogout,
        },
      ],
    });
  };

  /**
   * Opciones de tema
   */
  const themeOptions = [
    {
      key: 'system',
      label: 'Sistema',
      description: 'Usar configuración del dispositivo',
      icon: 'phone-portrait-outline',
    },
    {
      key: 'light',
      label: 'Claro',
      description: 'Siempre usar modo claro',
      icon: 'sunny-outline',
    },
    {
      key: 'dark',
      label: 'Oscuro',
      description: 'Siempre usar modo oscuro',
      icon: 'moon-outline',
    },
  ] as const;

  /**
   * Secciones del perfil
   */
  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.themeToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={theme === 'system' ? 'phone-portrait-outline' : isDark ? "sunny" : "moon"}
              size={22}
              color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
            />
          </TouchableOpacity>
        </View>

        {/* Avatar y nombre */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons 
              name="person" 
              size={56} 
              color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
            />
          </View>
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          )}
        </View>

        {/* Información personal */}
        <ProfileSection title="Información Personal">
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombre Completo</Text>
                <Text style={styles.infoValue}>
                  {user?.first_name} {user?.last_name}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Correo Electrónico</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>
          </View>
        </ProfileSection>

        {/* Apariencia */}
        <ProfileSection title="Apariencia">
          <View style={styles.card}>
            {themeOptions.map((option, index) => (
              <React.Fragment key={option.key}>
                <TouchableOpacity
                  style={styles.themeOption}
                  onPress={() => setTheme?.(option.key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.themeOptionLeft}>
                    <View style={[
                      styles.themeOptionIcon,
                      theme === option.key && styles.themeOptionIconActive
                    ]}>
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={theme === option.key 
                          ? getIOSColor(IOS_COLORS.systemBlue, isDark)
                          : getIOSColor(IOS_COLORS.label.secondary, isDark)
                        }
                      />
                    </View>
                    <View style={styles.themeOptionContent}>
                      <Text style={styles.themeOptionLabel}>{option.label}</Text>
                      <Text style={styles.themeOptionDescription}>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  {theme === option.key && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
                    />
                  )}
                </TouchableOpacity>
                {index < themeOptions.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </ProfileSection>

        {/* Acerca de */}
        <ProfileSection title="Acerca de">
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Versión</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Sistema</Text>
              <Text style={styles.aboutValue}>Event Connect</Text>
            </View>
          </View>
        </ProfileSection>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          © 2025 Event Connect{'\n'}
          Sistema de Gestión de Eventos Universitarios
        </Text>
      </ScrollView>

      {/* Alerta iOS */}
      <IOSAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={() => setAlertConfig({ ...alertConfig, visible: false })}
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
    container: {
      flex: 1,
    },
    content: {
      paddingBottom: IOS_SPACING.xxxl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: IOS_SPACING.lg,
      paddingTop: IOS_SPACING.md,
      paddingBottom: IOS_SPACING.lg,
    },
    headerTitle: {
      ...IOS_TYPOGRAPHY.largeTitle,
      color: getIOSColor(colors.label.primary, isDark),
    },
    themeToggle: {
      padding: IOS_SPACING.sm,
    },
    avatarContainer: {
      alignItems: 'center',
      paddingVertical: IOS_SPACING.xl,
      paddingHorizontal: IOS_SPACING.lg,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDark 
        ? 'rgba(10, 132, 255, 0.15)' 
        : 'rgba(0, 122, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: IOS_SPACING.md,
    },
    userName: {
      ...IOS_TYPOGRAPHY.title1,
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: IOS_SPACING.xs,
      textAlign: 'center',
    },
    userEmail: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
      marginBottom: IOS_SPACING.sm,
      textAlign: 'center',
    },
    roleBadge: {
      paddingHorizontal: IOS_SPACING.md,
      paddingVertical: IOS_SPACING.xs,
      borderRadius: IOS_RADIUS.large,
      backgroundColor: isDark
        ? getIOSColor(colors.fill.tertiary, isDark)
        : getIOSColor(colors.background.secondary, isDark),
      marginTop: IOS_SPACING.sm,
    },
    roleText: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.label.secondary, isDark),
      textTransform: 'capitalize',
      fontWeight: '600',
    },
    section: {
      marginBottom: IOS_SPACING.xl,
      paddingHorizontal: IOS_SPACING.lg,
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
      ...IOS_SHADOWS.small,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: IOS_SPACING.md,
    },
    infoIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark 
        ? 'rgba(10, 132, 255, 0.15)' 
        : 'rgba(0, 122, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
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
    },
    divider: {
      height: 0.5,
      backgroundColor: getIOSColor(colors.separator.opaque, isDark),
      marginLeft: IOS_SPACING.md,
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: IOS_SPACING.md,
    },
    themeOptionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    themeOptionIcon: {
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
    themeOptionIconActive: {
      backgroundColor: isDark 
        ? 'rgba(10, 132, 255, 0.15)' 
        : 'rgba(0, 122, 255, 0.1)',
    },
    themeOptionContent: {
      flex: 1,
    },
    themeOptionLabel: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: 2,
    },
    themeOptionDescription: {
      ...IOS_TYPOGRAPHY.caption1,
      color: getIOSColor(colors.label.secondary, isDark),
    },
    aboutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: IOS_SPACING.md,
    },
    aboutLabel: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.primary, isDark),
    },
    aboutValue: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: getIOSColor(colors.red, isDark),
      marginHorizontal: IOS_SPACING.lg,
      paddingVertical: IOS_SPACING.md,
      borderRadius: IOS_RADIUS.button,
      gap: IOS_SPACING.sm,
      marginTop: IOS_SPACING.lg,
      ...IOS_SHADOWS.small,
    },
    logoutText: {
      ...IOS_TYPOGRAPHY.body,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    footer: {
      ...IOS_TYPOGRAPHY.caption1,
      color: getIOSColor(colors.label.tertiary, isDark),
      textAlign: 'center',
      marginTop: IOS_SPACING.xl,
      paddingHorizontal: IOS_SPACING.lg,
      lineHeight: 18,
    },
  });
};
