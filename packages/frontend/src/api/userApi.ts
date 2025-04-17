import { apiConfig, ApiResponse } from "./config";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  avatar?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  avatar?: string;
}

/**
 * User API client for handling user-related operations
 */
export const userApi = {
  /**
   * Get all users
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    return apiConfig.get<User[]>("/users");
  },

  /**
   * Get a user by ID
   */
  async getUser(id: string): Promise<ApiResponse<User>> {
    return apiConfig.get<User>(`/users/${id}`);
  },

  /**
   * Create a new user
   */
  async createUser(data: CreateUserData): Promise<ApiResponse<User>> {
    return apiConfig.post<User>("/users", data);
  },

  /**
   * Update a user
   */
  async updateUser(
    id: string,
    data: UpdateUserData
  ): Promise<ApiResponse<User>> {
    return apiConfig.put<User>(`/users/${id}`, data);
  },

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiConfig.delete<{ success: boolean }>(`/users/${id}`);
  },
};
