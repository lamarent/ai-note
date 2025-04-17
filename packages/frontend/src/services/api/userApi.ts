import { apiConfig, ApiResponse } from "./config";
import { User, CreateUser, UpdateUser } from "@ai-brainstorm/types";

// API endpoints
const USERS_ENDPOINT = "/api/users"; // Adjust if needed

/**
 * Users API service using apiConfig
 */
export const userApi = {
  /**
   * Get all users
   */
  getAll: (): Promise<ApiResponse<User[]>> => {
    return apiConfig.get<User[]>(USERS_ENDPOINT);
  },

  /**
   * Get a user by ID
   */
  getById: (id: string): Promise<ApiResponse<User>> => {
    return apiConfig.get<User>(`${USERS_ENDPOINT}/${id}`);
  },

  /**
   * Create a new user
   */
  create: (data: CreateUser): Promise<ApiResponse<User>> => {
    return apiConfig.post<User>(USERS_ENDPOINT, data);
  },

  /**
   * Update a user
   */
  update: (id: string, data: UpdateUser): Promise<ApiResponse<User>> => {
    return apiConfig.put<User>(`${USERS_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a user
   */
  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiConfig.delete<void>(`${USERS_ENDPOINT}/${id}`);
  },
};
