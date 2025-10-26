import api from "./api";

interface TokenData {
  user_id: number;
  token: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class TokenService {
  createToken = async (data: TokenData): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>("/token", data);

      return response.data;
    } catch (error) {
      console.error("Error creating token:", error);
      return {
        success: false,
        error: "Failed to create token",
      };
    }
  };

  deleteToken = async (user_id: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete<ApiResponse>("/token/" + user_id);

      console.log("Delete token response:", response);

      return { success: true, message: "Token deleted successfully" };
    } catch (error) {
      console.error("Error deleting token:", error);
      return {
        success: false,
        error: "Failed to delete token",
      };
    }
  };
}

const tokenService = new TokenService();

export default tokenService;
export { TokenData, ApiResponse };
