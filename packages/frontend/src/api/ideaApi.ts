import { apiConfig, ApiResponse } from "./config";
import { Category } from "./categoryApi";

export interface Position {
  x: number;
  y: number;
}

export interface Idea {
  id: string;
  content: string;
  sessionId: string;
  categoryId?: string;
  createdBy: string;
  position: Position;
  upvotes: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIdeaData {
  content: string;
  sessionId: string;
  categoryId?: string;
  createdBy: string;
  position?: Position;
}

export interface UpdateIdeaData {
  content?: string;
  categoryId?: string | null;
  position?: Position;
}

/**
 * Idea API client for handling brainstorming ideas operations
 */
export const ideaApi = {
  /**
   * Get all ideas
   */
  async getIdeas(): Promise<ApiResponse<Idea[]>> {
    return apiConfig.get<Idea[]>("/ideas");
  },

  /**
   * Get an idea by ID
   */
  async getIdea(id: string): Promise<ApiResponse<Idea>> {
    return apiConfig.get<Idea>(`/ideas/${id}`);
  },

  /**
   * Get ideas by session ID
   */
  async getIdeasBySession(sessionId: string): Promise<ApiResponse<Idea[]>> {
    return apiConfig.get<Idea[]>(`/ideas/session/${sessionId}`);
  },

  /**
   * Get ideas by category ID
   */
  async getIdeasByCategory(categoryId: string): Promise<ApiResponse<Idea[]>> {
    return apiConfig.get<Idea[]>(`/ideas/category/${categoryId}`);
  },

  /**
   * Create a new idea
   */
  async createIdea(data: CreateIdeaData): Promise<ApiResponse<Idea>> {
    return apiConfig.post<Idea>("/ideas", data);
  },

  /**
   * Update an idea
   */
  async updateIdea(
    id: string,
    data: UpdateIdeaData
  ): Promise<ApiResponse<Idea>> {
    return apiConfig.put<Idea>(`/ideas/${id}`, data);
  },

  /**
   * Delete an idea
   */
  async deleteIdea(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiConfig.delete<{ success: boolean }>(`/ideas/${id}`);
  },
};
