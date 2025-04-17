import { apiClient } from "./client";

// Types for the API
export interface Idea {
  id: string;
  content: string;
  sessionId: string;
  position: { x: number; y: number };
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIdeaInput {
  content: string;
  sessionId: string;
  position?: { x: number; y: number };
  categoryId?: string;
}

export interface UpdateIdeaInput {
  content?: string;
  position?: { x: number; y: number };
  categoryId?: string | null;
}

// API endpoints
const IDEAS_ENDPOINT = "/api/ideas";

/**
 * Ideas API service
 */
export const ideaApi = {
  /**
   * Get all ideas
   */
  getAll: () => {
    return apiClient.get<Idea[]>(IDEAS_ENDPOINT);
  },

  /**
   * Get an idea by ID
   */
  getById: (id: string) => {
    return apiClient.get<Idea>(`${IDEAS_ENDPOINT}/${id}`);
  },

  /**
   * Create a new idea
   */
  create: (data: CreateIdeaInput) => {
    // Ensure position is set if not provided
    const ideaData = {
      ...data,
      position: data.position || { x: 0, y: 0 },
    };
    return apiClient.post<Idea>(IDEAS_ENDPOINT, ideaData);
  },

  /**
   * Update an idea
   */
  update: (id: string, data: UpdateIdeaInput) => {
    return apiClient.put<Idea>(`${IDEAS_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete an idea
   */
  delete: (id: string) => {
    return apiClient.delete(`${IDEAS_ENDPOINT}/${id}`);
  },

  /**
   * Get ideas by session ID
   */
  getBySessionId: (sessionId: string) => {
    return apiClient.get<Idea[]>(IDEAS_ENDPOINT, {
      params: { sessionId },
    });
  },

  /**
   * Update multiple ideas at once (e.g., for bulk position updates)
   */
  updateBulk: (ideas: { id: string; data: UpdateIdeaInput }[]) => {
    return apiClient.post<Idea[]>(`${IDEAS_ENDPOINT}/bulk`, { ideas });
  },

  /**
   * Update idea position
   */
  updatePosition: (id: string, position: { x: number; y: number }) => {
    return apiClient.patch<Idea>(`${IDEAS_ENDPOINT}/${id}/position`, {
      position,
    });
  },
};
