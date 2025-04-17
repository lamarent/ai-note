import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiConfig, ApiResponse } from "../api/config";
import { IDEA_KEYS } from "./useIdeas";

// Moved types from categoryApi.ts
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
// End of moved types

// Query keys
export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...CATEGORY_KEYS.lists(), { filters }] as const,
  bySession: (sessionId: string) =>
    [...CATEGORY_KEYS.lists(), { sessionId }] as const,
  details: () => [...CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,
};

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: CATEGORY_KEYS.lists(),
    queryFn: async () => {
      const response = await apiConfig.get<Category[]>("/categories");
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch categories");
      }
      return response.data as Category[];
    },
  });
}

/**
 * Hook to fetch a single category by ID
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: async () => {
      const response = await apiConfig.get<Category>(`/categories/${id}`);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch category");
      }
      return response.data as Category;
    },
    enabled: !!id, // Only run query if ID is provided
  });
}

/**
 * Hook to create a new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryData) => {
      const response = await apiConfig.post<Category>("/categories", data);
      if (!response.success) {
        throw new Error(response.error || "Failed to create category");
      }
      return response.data as Category;
    },
    onSuccess: (newCategory) => {
      // Invalidate categories list query to refetch
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });

      // If category is associated with a session, invalidate session categories
      if (newCategory.sessionId) {
        queryClient.invalidateQueries({
          queryKey: CATEGORY_KEYS.bySession(newCategory.sessionId),
        });
      }
    },
  });
}

/**
 * Hook to update a category
 */
export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCategoryData) => {
      const response = await apiConfig.put<Category>(`/categories/${id}`, data);
      if (!response.success) {
        throw new Error(response.error || "Failed to update category");
      }
      return response.data as Category;
    },
    onSuccess: (updatedCategory) => {
      // Update the category in the cache
      queryClient.setQueryData(CATEGORY_KEYS.detail(id), updatedCategory);

      // Invalidate categories list to refetch
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });

      // Invalidate session categories
      if (updatedCategory.sessionId) {
        queryClient.invalidateQueries({
          queryKey: CATEGORY_KEYS.bySession(updatedCategory.sessionId),
        });
      }

      // Invalidate ideas by category since the category name/color might have changed
      queryClient.invalidateQueries({
        queryKey: IDEA_KEYS.byCategory(id),
      });
    },
  });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Get the category first to know its session for cache invalidation
      const categoryResponse = await apiConfig.get<Category>(
        `/categories/${id}`
      );
      const category = categoryResponse.data;

      if (!categoryResponse.success || !category) {
        console.warn(
          `Failed to fetch category ${id} before deleting, cache invalidation for session might be incomplete.`
        );
        // Decide if we should throw or continue
      }

      const response = await apiConfig.delete<{ success: boolean }>(
        `/categories/${id}`
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to delete category");
      }

      // Return id and sessionId for cache invalidation
      return {
        id,
        sessionId: category?.sessionId,
      };
    },
    onSuccess: ({ id, sessionId }) => {
      // Remove the category from the cache
      queryClient.removeQueries({ queryKey: CATEGORY_KEYS.detail(id) });

      // Invalidate categories list to refetch
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });

      // If we have the session ID, invalidate session categories
      if (sessionId) {
        queryClient.invalidateQueries({
          queryKey: CATEGORY_KEYS.bySession(sessionId),
        });
      }

      // Invalidate ideas by category since they might need to be uncategorized
      queryClient.invalidateQueries({
        queryKey: IDEA_KEYS.byCategory(id),
      });

      // Invalidate all ideas lists since some ideas might have changed category
      queryClient.invalidateQueries({
        queryKey: IDEA_KEYS.lists(),
      });
    },
  });
}
