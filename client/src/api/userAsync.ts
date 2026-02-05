import { apiClient } from "./fileAsync";
import type { User, UserMetadata } from "@/types/userTypes";

export const createUser = async (userData: UserMetadata): Promise<User> => {
  try {
    const response = await apiClient.post<User>('/users/', userData);
    return response.data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

export const getUser = async (clerkId: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/users/${clerkId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get user:", error);
    throw error;
  }
};