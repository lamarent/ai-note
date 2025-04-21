import { apiConfig } from "./config";
import { Idea, CreateIdea, UpdateIdea } from "@ai-brainstorm/types";

// API endpoints
const IDEAS_ENDPOINT = "/api/ideas";

/**
 * Ideas API service
 */
export const ideaApi = {
  /**
   * Get all ideas
   */
  getAll: (sessionId: string) => {
    return apiConfig.get<Idea[]>(`${IDEAS_ENDPOINT}/session/${sessionId}`);
  },

  /**
   * Get an idea by ID
   */
  getById: (id: string) => {
    return apiConfig.get<Idea>(`${IDEAS_ENDPOINT}/${id}`);
  },

  /**
   * Create a new idea
   */
  create: (data: CreateIdea) => {
    return apiConfig.post<Idea>(`${IDEAS_ENDPOINT}`, data);
  },

  /**
   * Update an idea
   */
  update: (id: string, data: UpdateIdea) => {
    return apiConfig.put<Idea>(`${IDEAS_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete an idea
   */
  delete: (id: string) => {
    return apiConfig.delete<void>(`${IDEAS_ENDPOINT}/${id}`);
  },

  /**
   * Get ideas by session ID
   */
  getBySessionId: (sessionId: string) => {
    return apiConfig.get<Idea[]>(`${IDEAS_ENDPOINT}/session/${sessionId}`);
  },

  /**
   * Update multiple ideas at once (e.g., for bulk position updates)
   */
  updateBulk: (ideas: { id: string; data: UpdateIdea }[]) => {
    return apiConfig.post<Idea[]>(`${IDEAS_ENDPOINT}/bulk`, { ideas });
  },

  /**
   * Update idea position
   */
  updatePosition: (id: string, position: { x: number; y: number }) => {
    return apiConfig.patch<Idea>(`${IDEAS_ENDPOINT}/${id}/position`, {
      position,
    });
  },
};
