import type { AxiosInstance } from "axios";
import type { User } from "@/types/userTypes";

export function createUsersApi(apiClient: AxiosInstance) {
  return {
    createUser: async (): Promise<User> => {
      try {
        const response = await apiClient.post<User>("/users/");
        return response.data;
      } catch (error) {
        console.error("Failed to create user in database: ", error);
        throw error;
      }
    },

    getUser: async (): Promise<User> => {
      try {
        const response = await apiClient.get<User>("/users/me");
        return response.data;
      } catch (error) {
        console.error("Failed to sync user: ", error);
        throw error;
      }
    },
  };
}
