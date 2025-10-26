// Servicio de gestión de perfil de usuario

import api, { getErrorMessage } from "./api";
import { User } from "@/src/types";
import { API_BASE_URL } from "@/src/constants/config";

interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Servicio de gestión de usuario
 */
class UserService {
  /**
   * Obtiene el perfil del usuario actual
   */
  async getMyProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<ApiResponse<User>>("/organizer/profile");
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Actualiza la información del perfil
   */
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    try {
      const response = await api.put<ApiResponse<User>>(
        "/organizer/profile",
        data,
      );
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Sube o actualiza la imagen de perfil
   */
  async updateProfileImage(
    imageUri: string,
  ): Promise<ApiResponse<{ profile_image: string }>> {
    try {
      // Crear FormData para enviar la imagen
      const formData = new FormData();

      // Obtener la extensión del archivo
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      // Agregar la imagen al FormData
      formData.append("profileImage", {
        uri: imageUri,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      // Enviar petición con FormData
      const response = await api.post<ApiResponse<{ profile_image: string }>>(
        "/organizer/profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      const message = getErrorMessage(error);
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Elimina la imagen de perfil
   */
  async deleteProfileImage(): Promise<ApiResponse> {
    try {
      const response = await api.delete<ApiResponse>(
        "/organizer/profile-image",
      );
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Cambia la contraseña del usuario
   */
  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    try {
      const response = await api.put<ApiResponse>(
        "/organizer/change-password",
        data,
      );
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Elimina la cuenta del usuario
   */
  async deleteAccount(password: string): Promise<ApiResponse> {
    try {
      const response = await api.delete<ApiResponse>("/organizer/account", {
        data: { password },
      });
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Obtiene la URL completa de una imagen de perfil
   */
  getImageUrl(profileImage?: string): string {
    if (!profileImage) {
      return "https://via.placeholder.com/200?text=Sin+Foto";
    }

    // Si ya es una URL completa, retornarla
    if (
      profileImage.startsWith("http://") ||
      profileImage.startsWith("https://")
    ) {
      return profileImage;
    }

    // Construir URL completa
    const baseUrl = API_BASE_URL.replace("/api", "");
    return `${baseUrl}${profileImage}`;
  }
}

// Exportar instancia única del servicio
export default new UserService();
