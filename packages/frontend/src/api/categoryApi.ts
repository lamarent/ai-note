import { apiConfig, ApiResponse } from "./config";

export interface Category {
  id: string;
  name: string;
  color: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  color: string;
  sessionId: string;
}

export interface UpdateCategoryData {
  name?: string;
  color?: string;
}

/**
 * Category API client for handling idea category operations
 */
export const categoryApi = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiConfig.get<Category[]>("/categories");
  },

  /**
   * Get a category by ID
   */
  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return apiConfig.get<Category>(`/categories/${id}`);
  },

  /**
   * Create a new category
   */
  async createCategory(
    data: CreateCategoryData
  ): Promise<ApiResponse<Category>> {
    return apiConfig.post<Category>("/categories", data);
  },

  /**
   * Update a category
   */
  async updateCategory(
    id: string,
    data: UpdateCategoryData
  ): Promise<ApiResponse<Category>> {
    return apiConfig.put<Category>(`/categories/${id}`, data);
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiConfig.delete<{ success: boolean }>(`/categories/${id}`);
  },
};
