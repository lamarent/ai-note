import { apiConfig /*, ApiResponse */ } from "./config";
import { Category, CreateCategory, UpdateCategory } from "@ai-brainstorm/types";

// API endpoints
const CATEGORIES_ENDPOINT = "/api/categories";

/**
 * Categories API service
 */
export const categoryApi = {
  /**
   * Get all categories (or filter by query params if needed)
   */
  getAll: () => {
    return apiConfig.get<Category[]>(CATEGORIES_ENDPOINT);
  },

  /**
   * Get categories by session ID
   */
  getBySessionId: (sessionId: string) => {
    // Pass sessionId as a query parameter
    return apiConfig.get<Category[]>(
      `${CATEGORIES_ENDPOINT}?sessionId=${sessionId}`
    );
  },

  /**
   * Get a category by ID
   */
  getById: (id: string) => {
    return apiConfig.get<Category>(`${CATEGORIES_ENDPOINT}/${id}`);
  },

  /**
   * Create a new category
   */
  create: (data: CreateCategory) => {
    return apiConfig.post<Category>(CATEGORIES_ENDPOINT, data);
  },

  /**
   * Update a category
   */
  update: (id: string, data: UpdateCategory) => {
    return apiConfig.put<Category>(`${CATEGORIES_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a category
   */
  delete: (id: string) => {
    return apiConfig.delete<void>(`${CATEGORIES_ENDPOINT}/${id}`);
  },
};
