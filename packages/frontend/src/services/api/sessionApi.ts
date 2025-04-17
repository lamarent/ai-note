import { apiConfig, ApiResponse } from "./config";
import { Session, CreateSession, UpdateSession } from "@ai-brainstorm/types";

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
    return apiConfig.get<Session[]>(SESSIONS_ENDPOINT);
  },

  /**
   * Get a session by ID
   */
  getById: (id: string) => {
    return apiConfig.get<Session>(`${SESSIONS_ENDPOINT}/${id}`);
  },

  /**
   * Create a new session
   */
  create: (data: CreateSession) => {
    return apiConfig.post<Session>(SESSIONS_ENDPOINT, data);
  },

  /**
   * Update a session
   */
  update: (id: string, data: UpdateSession) => {
    return apiConfig.put<Session>(`${SESSIONS_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a session
   */
  delete: (id: string) => {
    return apiConfig.delete<void>(`${SESSIONS_ENDPOINT}/${id}`);
  },

  /**
   * Get sessions by owner ID
   */
  getByOwnerId: (ownerId: string) => {
    return apiConfig.get<Session[]>(`${SESSIONS_ENDPOINT}?ownerId=${ownerId}`);
  },
};
