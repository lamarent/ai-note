import { apiClient } from "./client";

// Types for the API
export interface Session {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface CreateSessionInput {
  title: string;
  description: string;
  isPublic: boolean;
  ownerId: string;
}

export interface UpdateSessionInput {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

// API endpoints
const SESSIONS_ENDPOINT = "/api/sessions";

/**
 * Sessions API service
 */
export const sessionApi = {
  /**
   * Get all sessions
   */
  getAll: () => {
    return apiClient.get<Session[]>(SESSIONS_ENDPOINT);
  },

  /**
   * Get a session by ID
   */
  getById: (id: string) => {
    return apiClient.get<Session>(`${SESSIONS_ENDPOINT}/${id}`);
  },

  /**
   * Create a new session
   */
  create: (data: CreateSessionInput) => {
    return apiClient.post<Session>(SESSIONS_ENDPOINT, data);
  },

  /**
   * Update a session
   */
  update: (id: string, data: UpdateSessionInput) => {
    return apiClient.put<Session>(`${SESSIONS_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a session
   */
  delete: (id: string) => {
    return apiClient.delete(`${SESSIONS_ENDPOINT}/${id}`);
  },

  /**
   * Get sessions by owner ID
   */
  getByOwnerId: (ownerId: string) => {
    return apiClient.get<Session[]>(SESSIONS_ENDPOINT, {
      params: { ownerId },
    });
  },
};
