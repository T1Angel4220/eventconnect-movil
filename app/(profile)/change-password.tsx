import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { userService } from "@/src/services";
import { Input, Button, PasswordStrength, IOSAlert, AlertButton } from "@/src/components";
import { IOS_TYPOGRAPHY, IOS_SPACING, IOS_RADIUS, IOS_COLORS, getIOSColor } from "@/src/constants/iosStyles";
import { validatePassword, getPasswordStrength } from "@/src/utils/validators";

/**
 * Pantalla de Cambiar Contraseña - Estilo iOS/Apple
 */
export default function ChangePasswordScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);

  // Errores de validación
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  // Calcular fuerza de la contraseña
  const passwordStrength = getPasswordStrength(newPassword);

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    // Validar contraseña actual
    if (!currentPassword) {
      newErrors.currentPassword = 'Ingresa tu contraseña actual';
    }

    // Validar nueva contraseña - extraer solo el error del objeto retornado
    const passwordResult = validatePassword(newPassword);
    if (!passwordResult.isValid) {
      newErrors.newPassword = passwordResult.error || '';
    }

    // Validar que la nueva contraseña sea diferente
    if (newPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente';
    }

    // Validar confirmación
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);

    return !newErrors.currentPassword && !newErrors.newPassword && !newErrors.confirmPassword;
  };

  /**
   * Maneja el cambio de contraseña
   */
  const handleChangePassword = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setLoading(true);

      const result = await userService.changePassword({
        currentPassword,
        newPassword,
      });

      if (result.success) {
        setAlertConfig({
          visible: true,
          title: "¡Contraseña Actualizada!",
          message: "Tu contraseña ha sido cambiada exitosamente",
          buttons: [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ],
        });

        // Limpiar campos
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        Alert.alert('Error', result.message || 'No se pudo cambiar la contraseña');
      }
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      Alert.alert('Error', 'Ocurrió un error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="chevron-back" 
              size={28} 
              color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Icono */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons 
                name="lock-closed" 
                size={48} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
              />
            </View>
          </View>

          {/* Descripción */}
          <Text style={styles.description}>
            Por tu seguridad, necesitamos verificar tu contraseña actual antes de establecer una nueva.
          </Text>

          {/* Formulario */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña Actual</Text>
              <Input
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
                }}
                placeholder="Tu contraseña actual"
                secureTextEntry
                autoCapitalize="none"
                error={errors.currentPassword}
                icon="lock-closed-outline"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nueva Contraseña</Text>
              <Input
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                }}
                placeholder="Mínimo 8 caracteres"
                secureTextEntry
                autoCapitalize="none"
                error={errors.newPassword}
                icon="lock-open-outline"
              />
              {newPassword.length > 0 && (
                <PasswordStrength password={newPassword} />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
              <Input
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                placeholder="Repite tu nueva contraseña"
                secureTextEntry
                autoCapitalize="none"
                error={errors.confirmPassword}
                icon="checkmark-circle-outline"
              />
            </View>
          </View>

          {/* Requisitos */}
          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>Requisitos de Contraseña:</Text>
            <View style={styles.requirement}>
              <Ionicons 
                name={newPassword.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={newPassword.length >= 8 
                  ? getIOSColor(IOS_COLORS.green, isDark) 
                  : getIOSColor(IOS_COLORS.label.tertiary, isDark)
                } 
              />
              <Text style={styles.requirementText}>Mínimo 8 caracteres</Text>
            </View>
            <View style={styles.requirement}>
              <Ionicons 
                name={/[A-Z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={/[A-Z]/.test(newPassword) 
                  ? getIOSColor(IOS_COLORS.green, isDark) 
                  : getIOSColor(IOS_COLORS.label.tertiary, isDark)
                } 
              />
              <Text style={styles.requirementText}>Una letra mayúscula</Text>
            </View>
            <View style={styles.requirement}>
              <Ionicons 
                name={/[a-z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={/[a-z]/.test(newPassword) 
                  ? getIOSColor(IOS_COLORS.green, isDark) 
                  : getIOSColor(IOS_COLORS.label.tertiary, isDark)
                } 
              />
              <Text style={styles.requirementText}>Una letra minúscula</Text>
            </View>
            <View style={styles.requirement}>
              <Ionicons 
                name={/[0-9]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={/[0-9]/.test(newPassword) 
                  ? getIOSColor(IOS_COLORS.green, isDark) 
                  : getIOSColor(IOS_COLORS.label.tertiary, isDark)
                } 
              />
              <Text style={styles.requirementText}>Un número</Text>
            </View>
          </View>

          {/* Advertencia de seguridad */}
          <View style={styles.warningCard}>
            <Ionicons 
              name="shield-checkmark" 
              size={20} 
              color={getIOSColor(IOS_COLORS.orange, isDark)} 
            />
            <Text style={styles.warningText}>
              Usa una contraseña única que no hayas usado en otros sitios. Esto ayuda a mantener tu cuenta segura.
            </Text>
          </View>
        </ScrollView>

        {/* Botón de guardar */}
        <View style={styles.footer}>
          <Button
            title={loading ? "Cambiando..." : "Cambiar Contraseña"}
            onPress={handleChangePassword}
            loading={loading}
            disabled={!currentPassword || !newPassword || !confirmPassword || passwordStrength < 2}
            fullWidth
          />
        </View>
      </View>

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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: IOS_SPACING.lg,
      paddingVertical: IOS_SPACING.md,
      borderBottomWidth: 0.5,
      borderBottomColor: getIOSColor(colors.separator.opaque, isDark),
    },
    backButton: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...IOS_TYPOGRAPHY.headline,
      color: getIOSColor(colors.label.primary, isDark),
      fontWeight: '600',
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: IOS_SPACING.lg,
      paddingTop: IOS_SPACING.xl,
      paddingBottom: IOS_SPACING.xxxl,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: IOS_SPACING.lg,
    },
    iconCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDark
        ? 'rgba(10, 132, 255, 0.15)'
        : 'rgba(0, 122, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    description: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.label.secondary, isDark),
      textAlign: 'center',
      marginBottom: IOS_SPACING.xxxl,
      lineHeight: 22,
    },
    form: {
      gap: IOS_SPACING.lg,
      marginBottom: IOS_SPACING.xl,
    },
    inputGroup: {
      gap: IOS_SPACING.xs,
    },
    label: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.label.primary, isDark),
      fontWeight: '600',
      marginLeft: IOS_SPACING.xs,
    },
    requirementsCard: {
      backgroundColor: isDark
        ? getIOSColor(colors.background.secondary, isDark)
        : getIOSColor(colors.background.tertiary, isDark),
      borderRadius: IOS_RADIUS.card,
      padding: IOS_SPACING.md,
      marginBottom: IOS_SPACING.lg,
    },
    requirementsTitle: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.label.primary, isDark),
      fontWeight: '600',
      marginBottom: IOS_SPACING.sm,
    },
    requirement: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: IOS_SPACING.sm,
      paddingVertical: IOS_SPACING.xs,
    },
    requirementText: {
      ...IOS_TYPOGRAPHY.subheadline,
      color: getIOSColor(colors.label.secondary, isDark),
    },
    warningCard: {
      flexDirection: 'row',
      backgroundColor: isDark
        ? 'rgba(255, 159, 10, 0.15)'
        : 'rgba(255, 149, 0, 0.1)',
      borderRadius: IOS_RADIUS.medium,
      padding: IOS_SPACING.md,
      gap: IOS_SPACING.sm,
    },
    warningText: {
      ...IOS_TYPOGRAPHY.footnote,
      color: getIOSColor(colors.label.secondary, isDark),
      flex: 1,
      lineHeight: 18,
    },
    footer: {
      padding: IOS_SPACING.lg,
      paddingBottom: IOS_SPACING.xl,
      borderTopWidth: 0.5,
      borderTopColor: getIOSColor(colors.separator.opaque, isDark),
      backgroundColor: getIOSColor(colors.background.primary, isDark),
    },
  });
};

