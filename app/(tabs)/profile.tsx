import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useTheme } from "@/src/hooks";
import { userService } from "@/src/services";
import {
  IOS_TYPOGRAPHY,
  IOS_SPACING,
  IOS_RADIUS,
  IOS_COLORS,
  IOS_SHADOWS,
  getIOSColor,
} from "@/src/constants/iosStyles";
import { IOSAlert, AlertButton } from "@/src/components";
import tokenService from "@/src/services/tokenService";

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

  // Estados para el diálogo de eliminación de cuenta
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const styles = createStyles(isDark);

  /**
   * Traduce el rol del usuario al español
   */
  const getRoleLabel = (role: string | undefined): string => {
    if (!role) return "";

    const roleMap: { [key: string]: string } = {
      participant: "Participante",
      organizer: "Organizador",
      admin: "Administrador",
    };

    return roleMap[role.toLowerCase()] || role;
  };

  /**
   * Ejecuta el logout y redirige al login
   */
  const performLogout = async () => {
    try {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const { success, message } = await tokenService.deleteToken(
        user?.user_id,
      );

      if (!success) {
        throw new Error(message || "No se pudo eliminar el token");
      }

      await logout();
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
   * Maneja la eliminación de cuenta
   */
  const handleDeleteAccount = () => {
    setDeletePassword("");
    setAlertConfig({
      visible: true,
      title: "⚠️ Eliminar Cuenta",
      message:
        "Esta acción es permanente y no se puede deshacer.\n\nSe eliminarán todos tus datos, eventos e inscripciones.\n\nIngresa tu contraseña para confirmar:",
      buttons: [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => {
            setDeletePassword("");
          },
        },
        {
          text: "Eliminar",
          style: "destructive",
          loading: isDeleting,
          onPress: (passwordFromAlert) =>
            confirmDeleteAccount(passwordFromAlert),
        },
      ],
    });
  };

  /**
   * Confirma la eliminación de cuenta
   * @param passwordFromAlert - Contraseña recibida directamente del componente IOSAlert
   */
  const confirmDeleteAccount = async (passwordFromAlert?: string) => {
    // Usar la contraseña que viene del componente IOSAlert directamente
    const currentPassword = passwordFromAlert?.trim() || "";

    console.log(
      "🔐 Contraseña recibida:",
      currentPassword
        ? `"${currentPassword}" (${currentPassword.length} caracteres)`
        : "vacía",
    );

    if (!currentPassword) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Debes ingresar tu contraseña",
        buttons: [{ text: "OK", style: "default" }],
      });
      return;
    }

    try {
      setIsDeleting(true);
      const result = await userService.deleteAccount(currentPassword);

      if (result.success) {
        // Cerrar el modal primero
        setAlertConfig({ ...alertConfig, visible: false });
        setDeletePassword("");
        setIsDeleting(false);

        // Cerrar sesión y redirigir inmediatamente
        await logout();
        router.replace("/(auth)/login");

        // Mostrar mensaje de éxito estilo iOS después de redirigir
        setTimeout(() => {
          setAlertConfig({
            visible: true,
            title: "✓ Cuenta Eliminada",
            message: "Tu cuenta ha sido eliminada exitosamente",
            buttons: [{ text: "OK", style: "default" }],
          });
        }, 500);
      } else {
        setIsDeleting(false);
        setAlertConfig({
          visible: true,
          title: "Error",
          message: result.message || "No se pudo eliminar la cuenta",
          buttons: [{ text: "OK", style: "default" }],
        });
      }
    } catch {
      setIsDeleting(false);
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Ocurrió un error al eliminar la cuenta",
        buttons: [{ text: "OK", style: "default" }],
      });
    }
  };

  /**
   * Opciones de tema
   */
  const themeOptions = [
    {
      key: "system",
      label: "Sistema",
      description: "Usar configuración del dispositivo",
      icon: "phone-portrait-outline",
    },
    {
      key: "light",
      label: "Claro",
      description: "Siempre usar modo claro",
      icon: "sunny-outline",
    },
    {
      key: "dark",
      label: "Oscuro",
      description: "Siempre usar modo oscuro",
      icon: "moon-outline",
    },
  ] as const;

  /**
   * Secciones del perfil
   */
  const ProfileSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
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
              name={
                theme === "system"
                  ? "phone-portrait-outline"
                  : isDark
                    ? "sunny"
                    : "moon"
              }
              size={22}
              color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
            />
          </TouchableOpacity>
        </View>

        {/* Avatar y nombre */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            {user?.profile_image ? (
              <Image
                source={{ uri: userService.getImageUrl(user.profile_image) }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Ionicons
                  name="person"
                  size={56}
                  color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
                />
              </View>
            )}
          </View>
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{getRoleLabel(user.role)}</Text>
            </View>
          )}
        </View>

        {/* Botones de acción rápida */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/(profile)/edit-profile")}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons
                name="pencil"
                size={20}
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
              />
            </View>
            <Text style={styles.quickActionText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/(profile)/change-password")}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons
                name="lock-closed"
                size={20}
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
              />
            </View>
            <Text style={styles.quickActionText}>Contraseña</Text>
          </TouchableOpacity>
        </View>

        {/* Información personal */}
        <ProfileSection title="Información Personal">
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => router.push("/(profile)/edit-profile")}
              activeOpacity={0.7}
            >
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
              <Ionicons
                name="chevron-forward"
                size={20}
                color={getIOSColor(IOS_COLORS.label.tertiary, isDark)}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => router.push("/(profile)/edit-profile")}
              activeOpacity={0.7}
            >
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
              <Ionicons
                name="chevron-forward"
                size={20}
                color={getIOSColor(IOS_COLORS.label.tertiary, isDark)}
              />
            </TouchableOpacity>
          </View>
        </ProfileSection>

        {/* Seguridad */}
        <ProfileSection title="Seguridad">
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => router.push("/(profile)/change-password")}
              activeOpacity={0.7}
            >
              <View style={styles.infoIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={getIOSColor(IOS_COLORS.systemBlue, isDark)}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Contraseña</Text>
                <Text style={styles.infoValue}>••••••••</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={getIOSColor(IOS_COLORS.label.tertiary, isDark)}
              />
            </TouchableOpacity>
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
                    <View
                      style={[
                        styles.themeOptionIcon,
                        theme === option.key && styles.themeOptionIconActive,
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={
                          theme === option.key
                            ? getIOSColor(IOS_COLORS.systemBlue, isDark)
                            : getIOSColor(IOS_COLORS.label.secondary, isDark)
                        }
                      />
                    </View>
                    <View style={styles.themeOptionContent}>
                      <Text style={styles.themeOptionLabel}>
                        {option.label}
                      </Text>
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
                {index < themeOptions.length - 1 && (
                  <View style={styles.divider} />
                )}
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

        {/* Zona de Peligro */}
        <ProfileSection title="Zona de Peligro">
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.dangerRow}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.dangerIcon}>
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={getIOSColor(IOS_COLORS.red, isDark)}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.dangerLabel}>Eliminar Cuenta</Text>
                <Text style={styles.dangerDescription}>
                  Eliminar permanentemente tu cuenta y todos los datos
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={getIOSColor(IOS_COLORS.red, isDark)}
              />
            </TouchableOpacity>
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
          © 2025 Event Connect{"\n"}
          Sistema de Gestión de Eventos Universitarios
        </Text>
      </ScrollView>

      {/* Alerta iOS */}
      <IOSAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={() => {
          setAlertConfig({ ...alertConfig, visible: false });
          setDeletePassword("");
        }}
        showInput={alertConfig.title?.includes("Eliminar Cuenta")}
        inputPlaceholder="Contraseña"
        inputValue={deletePassword}
        onInputChange={setDeletePassword}
        secureTextEntry={true}
        isLoading={isDeleting}
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
      flexGrow: 1,
      paddingBottom: IOS_SPACING.xxxl,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: IOS_SPACING.lg,
      paddingTop: IOS_SPACING.xl,
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
      alignItems: "center",
      paddingVertical: IOS_SPACING.xl,
      paddingHorizontal: IOS_SPACING.lg,
    },
    avatarWrapper: {
      marginBottom: IOS_SPACING.md,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDark
        ? "rgba(10, 132, 255, 0.15)"
        : "rgba(0, 122, 255, 0.1)",
      alignItems: "center",
      justifyContent: "center",
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: getIOSColor(colors.fill.tertiary, isDark),
    },
    userName: {
      ...IOS_TYPOGRAPHY.title1,
      color: getIOSColor(colors.label.primary, isDark),
      marginBottom: IOS_SPACING.xs,
      textAlign: "center",
    },
    userEmail: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
      marginBottom: IOS_SPACING.sm,
      textAlign: "center",
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
      textTransform: "capitalize",
      fontWeight: "600",
    },
    quickActionsContainer: {
      flexDirection: "row",
      paddingHorizontal: IOS_SPACING.lg,
      paddingVertical: IOS_SPACING.md,
      gap: IOS_SPACING.md,
      marginBottom: IOS_SPACING.lg,
    },
    quickActionButton: {
      flex: 1,
      alignItems: "center",
      paddingVertical: IOS_SPACING.md,
      paddingHorizontal: IOS_SPACING.sm,
      backgroundColor: isDark
        ? getIOSColor(colors.background.secondary, isDark)
        : getIOSColor(colors.background.tertiary, isDark),
      borderRadius: IOS_RADIUS.medium,
      ...IOS_SHADOWS.small,
    },
    quickActionIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark
        ? "rgba(10, 132, 255, 0.15)"
        : "rgba(0, 122, 255, 0.1)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: IOS_SPACING.xs,
    },
    quickActionText: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.label.primary, isDark),
      fontWeight: "600",
      textAlign: "center",
    },
    section: {
      marginBottom: IOS_SPACING.xl,
      paddingHorizontal: IOS_SPACING.lg,
    },
    sectionTitle: {
      ...IOS_TYPOGRAPHY.footnote,
      color: getIOSColor(colors.label.secondary, isDark),
      textTransform: "uppercase",
      marginBottom: IOS_SPACING.sm,
      paddingLeft: 2,
    },
    card: {
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
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark
        ? "rgba(10, 132, 255, 0.15)"
        : "rgba(0, 122, 255, 0.1)",
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
    },
    divider: {
      height: 0.5,
      backgroundColor: getIOSColor(colors.separator.opaque, isDark),
      marginLeft: IOS_SPACING.md,
    },
    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: IOS_SPACING.md,
    },
    themeOptionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    themeOptionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark
        ? getIOSColor(colors.fill.tertiary, isDark)
        : getIOSColor(colors.background.secondary, isDark),
      alignItems: "center",
      justifyContent: "center",
      marginRight: IOS_SPACING.md,
    },
    themeOptionIconActive: {
      backgroundColor: isDark
        ? "rgba(10, 132, 255, 0.15)"
        : "rgba(0, 122, 255, 0.1)",
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
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
      color: "#FFFFFF",
      fontWeight: "600",
    },
    dangerRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: IOS_SPACING.md,
    },
    dangerIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark
        ? "rgba(255, 59, 48, 0.15)"
        : "rgba(255, 59, 48, 0.1)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: IOS_SPACING.md,
    },
    dangerLabel: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.red, isDark),
      fontWeight: "600",
    },
    dangerDescription: {
      ...IOS_TYPOGRAPHY.caption1,
      color: getIOSColor(colors.label.secondary, isDark),
      marginTop: 2,
    },
    footer: {
      ...IOS_TYPOGRAPHY.caption1,
      color: getIOSColor(colors.label.tertiary, isDark),
      textAlign: "center",
      marginTop: IOS_SPACING.xl,
      paddingHorizontal: IOS_SPACING.lg,
      lineHeight: 18,
    },
  });
};
