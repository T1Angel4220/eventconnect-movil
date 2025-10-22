import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useAuth, useTheme } from "@/src/hooks";
import { userService } from "@/src/services";
import { Input, Button, Loading, IOSAlert, AlertButton } from "@/src/components";
import { IOS_TYPOGRAPHY, IOS_SPACING, IOS_RADIUS, IOS_COLORS, IOS_SHADOWS, getIOSColor } from "@/src/constants/iosStyles";
import { validateEmail, validateName } from "@/src/utils/validators";

/**
 * Pantalla de Editar Perfil - Estilo iOS/Apple
 */
export default function EditProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { isDark } = useTheme();

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState<string | undefined>(user?.profile_image);
  const [tempImageUri, setTempImageUri] = useState<string | undefined>();
  
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Errores de validación
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
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

  /**
   * Solicita permisos de la galería
   */
  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setAlertConfig({
          visible: true,
          title: "Permisos Necesarios",
          message: "Necesitamos permisos para acceder a tu galería de fotos.",
          buttons: [{ text: "OK", style: "default" }],
        });
        return false;
      }
    }
    return true;
  };

  /**
   * Abre el selector de imágenes
   */
  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Usar array en lugar de MediaTypeOptions (deprecado)
        allowsEditing: true,
        aspect: [1, 1], // Cuadrado
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        console.log('🖼️ Imagen seleccionada:', uri);
        setTempImageUri(uri);
        // No subimos la imagen automáticamente, esperamos a que guarde todos los cambios
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  /**
   * Toma una foto con la cámara
   */
  const takePhoto = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          setAlertConfig({
            visible: true,
            title: "Permisos Necesarios",
            message: "Necesitamos permisos para acceder a tu cámara.",
            buttons: [{ text: "OK", style: "default" }],
          });
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        console.log('📷 Foto tomada:', uri);
        setTempImageUri(uri);
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  /**
   * Muestra opciones para cambiar la foto
   */
  const showImageOptions = () => {
    setAlertConfig({
      visible: true,
      title: "Cambiar Foto de Perfil",
      message: "Selecciona una opción",
      buttons: [
        {
          text: "Tomar Foto",
          onPress: takePhoto,
        },
        {
          text: "Elegir de Galería",
          onPress: pickImage,
        },
        ...(profileImage || tempImageUri ? [{
          text: "Eliminar Foto",
          style: "destructive" as const,
          onPress: handleDeleteImage,
        }] : []),
        {
          text: "Cancelar",
          style: "cancel" as const,
        },
      ],
    });
  };

  /**
   * Elimina la imagen de perfil
   */
  const handleDeleteImage = async () => {
    try {
      setUploadingImage(true);
      const result = await userService.deleteProfileImage();

      if (result.success) {
        setProfileImage(undefined);
        setTempImageUri(undefined);
        await refreshUser();
        Alert.alert('¡Éxito!', 'Foto de perfil eliminada');
      } else {
        Alert.alert('Error', result.message || 'No se pudo eliminar la foto');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la foto');
    } finally {
      setUploadingImage(false);
    }
  };

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
    };

    // Validar nombres - extraer solo el error del objeto retornado
    const firstNameResult = validateName(firstName, 'Nombre');
    const lastNameResult = validateName(lastName, 'Apellido');
    const emailResult = validateEmail(email);

    if (!firstNameResult.isValid) newErrors.firstName = firstNameResult.error || '';
    if (!lastNameResult.isValid) newErrors.lastName = lastNameResult.error || '';
    if (!emailResult.isValid) newErrors.email = emailResult.error || '';

    setErrors(newErrors);

    return firstNameResult.isValid && lastNameResult.isValid && emailResult.isValid;
  };

  /**
   * Guarda los cambios del perfil
   */
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setLoading(true);

      console.log('📸 Estado de imagen - tempImageUri:', tempImageUri);
      console.log('📸 Estado de imagen - profileImage:', profileImage);

      // 1. Subir imagen si hay una nueva
      if (tempImageUri) {
        console.log('📤 Subiendo imagen:', tempImageUri);
        setUploadingImage(true);
        const imageResult = await userService.updateProfileImage(tempImageUri);
        
        console.log('📷 Resultado de subida de imagen:', imageResult);
        
        if (imageResult.success && imageResult.data) {
          console.log('✅ Imagen subida exitosamente:', imageResult.data.profile_image);
          setProfileImage(imageResult.data.profile_image);
          // Limpiar la imagen temporal después de subirla exitosamente
          setTempImageUri(undefined);
        } else {
          console.error('❌ Error al subir imagen:', imageResult.message);
          Alert.alert('Advertencia', imageResult.message || 'No se pudo actualizar la foto de perfil');
        }
        setUploadingImage(false);
      } else {
        console.log('⚠️ No hay imagen temporal para subir');
      }

      // 2. Actualizar información personal
      console.log('📝 Actualizando perfil con datos:', {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
      });

      const result = await userService.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
      });

      console.log('📄 Resultado de actualización de perfil:', result);

      if (result.success) {
        // Refrescar datos del usuario en el contexto
        console.log('🔄 Refrescando datos del usuario...');
        await refreshUser();

        setAlertConfig({
          visible: true,
          title: "¡Éxito!",
          message: "Tu perfil ha sido actualizado",
          buttons: [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ],
        });
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar el perfil');
      }
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene la URI de la imagen a mostrar
   */
  const getDisplayImageUri = (): string => {
    if (tempImageUri) return tempImageUri;
    if (profileImage) return userService.getImageUrl(profileImage);
    return 'https://via.placeholder.com/200?text=Sin+Foto';
  };

  if (!user) {
    return <Loading message="Cargando..." />;
  }

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
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Foto de perfil */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: getDisplayImageUri() }}
                style={styles.avatar}
              />
              {uploadingImage && (
                <View style={styles.avatarOverlay}>
                  <Loading message="" />
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={showImageOptions}
              activeOpacity={0.7}
              disabled={uploadingImage}
            >
              <Ionicons 
                name="camera" 
                size={20} 
                color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
              />
              <Text style={styles.changePhotoText}>Cambiar Foto</Text>
            </TouchableOpacity>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre</Text>
              <Input
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (errors.firstName) setErrors({ ...errors, firstName: '' });
                }}
                placeholder="Tu nombre"
                autoCapitalize="words"
                error={errors.firstName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apellido</Text>
              <Input
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (errors.lastName) setErrors({ ...errors, lastName: '' });
                }}
                placeholder="Tu apellido"
                autoCapitalize="words"
                error={errors.lastName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <Input
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />
            </View>
          </View>

          {/* Información */}
          <View style={styles.infoCard}>
            <Ionicons 
              name="information-circle-outline" 
              size={20} 
              color={getIOSColor(IOS_COLORS.systemBlue, isDark)} 
            />
            <Text style={styles.infoText}>
              Si cambias tu correo electrónico, asegúrate de usar uno válido y que puedas verificar.
            </Text>
          </View>
        </ScrollView>

        {/* Botón de guardar */}
        <View style={styles.footer}>
          <Button
            title={loading ? "Guardando..." : "Guardar Cambios"}
            onPress={handleSave}
            loading={loading}
            disabled={uploadingImage}
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
    avatarSection: {
      alignItems: 'center',
      marginBottom: IOS_SPACING.xxxl,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: IOS_SPACING.md,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: getIOSColor(colors.fill.tertiary, isDark),
    },
    avatarOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    changePhotoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: IOS_SPACING.xs,
      paddingVertical: IOS_SPACING.sm,
      paddingHorizontal: IOS_SPACING.md,
    },
    changePhotoText: {
      ...IOS_TYPOGRAPHY.body,
      color: getIOSColor(colors.systemBlue, isDark),
      fontWeight: '600',
    },
    form: {
      gap: IOS_SPACING.lg,
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
    infoCard: {
      flexDirection: 'row',
      backgroundColor: isDark
        ? 'rgba(10, 132, 255, 0.15)'
        : 'rgba(0, 122, 255, 0.1)',
      borderRadius: IOS_RADIUS.medium,
      padding: IOS_SPACING.md,
      marginTop: IOS_SPACING.xl,
      gap: IOS_SPACING.sm,
    },
    infoText: {
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

