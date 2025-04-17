import { apiConfig, ApiResponse } from "./config";
import { User } from "./userApi";
import { Category } from "./categoryApi";
import { Idea } from "./ideaApi";

export interface Session {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  isPublic: boolean;
  owner?: User;
  collaborators?: User[];
  categories?: Category[];
  ideas?: Idea[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionData {
  title: string;
  description?: string;
  ownerId: string;
  collaborators?: string[];
  isPublic?: boolean;
}

export interface UpdateSessionData {
  title?: string;
  description?: string;
  collaborators?: string[];
  isPublic?: boolean;
}

/**
 * Session API client for handling brainstorming session operations
 */
export const sessionApi = {
  /**
   * Get all sessions
   */
  async getSessions(): Promise<ApiResponse<Session[]>> {
    return apiConfig.get<Session[]>("/sessions");
  },

  /**
   * Get a session by ID
   */
  async getSession(id: string): Promise<ApiResponse<Session>> {
    return apiConfig.get<Session>(`/sessions/${id}`);
  },

  /**
   * Get sessions by owner ID
   */
  async getSessionsByOwner(ownerId: string): Promise<ApiResponse<Session[]>> {
    return apiConfig.get<Session[]>(`/sessions/user/${ownerId}`);
  },

  /**
   * Create a new session
   */
  async createSession(data: CreateSessionData): Promise<ApiResponse<Session>> {
    return apiConfig.post<Session>("/sessions", data);
  },

  /**
   * Update a session
   */
  async updateSession(
    id: string,
    data: UpdateSessionData
  ): Promise<ApiResponse<Session>> {
    return apiConfig.put<Session>(`/sessions/${id}`, data);
  },

  /**
   * Delete a session
   */
  async deleteSession(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiConfig.delete<{ success: boolean }>(`/sessions/${id}`);
  },
};
