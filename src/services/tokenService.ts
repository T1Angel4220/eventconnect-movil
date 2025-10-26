import api from "./api";

interface TokenData {
  user_id: number;
  token: string;
}

interface ApiResponse {
  success: boolean;
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
      };
    }
  };
}

export const tokenService = new TokenService();
