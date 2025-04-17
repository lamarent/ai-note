import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
  QueryKey,
} from "@tanstack/react-query";
// Import types and API service from categoryApi.ts
import {
  categoryApi,
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "../categoryApi";
import { ApiError } from "../../services/api/config";
import { IDEA_KEYS } from "./useIdeas"; // Import idea keys for invalidation

// Query keys for categories
export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  list: (
    filters: Record<string, unknown> // Example filter structure
  ) => [...CATEGORY_KEYS.lists(), filters] as const,
  bySession: (
    sessionId: string // Key for session-specific categories
  ) => [...CATEGORY_KEYS.lists(), { sessionId }] as const,
  details: () => [...CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,
};

// Fetch all categories
export const useGetCategories = (
  options?: Omit<UseQueryOptions<Category[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery<Category[], Error>({
    queryKey: CATEGORY_KEYS.lists(),
    queryFn: async () => {
      const response = await categoryApi.getCategories();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch categories");
      }
      return response.data;
    },
    ...options,
  });
};

// Fetch a single category by ID
export const useGetCategory = (
  id: string,
  options?: Omit<
    UseQueryOptions<Category, Error>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  return useQuery<Category, Error>({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: async () => {
      const response = await categoryApi.getCategory(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch category");
      }
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

// Create a new category
export const useCreateCategory = (
  options?: UseMutationOptions<Category, Error, CreateCategoryData>
) => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CreateCategoryData>({
    mutationFn: async (data: CreateCategoryData) => {
      const response = await categoryApi.createCategory(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create category");
      }
      return response.data;
    },
    onSuccess: (newCategory) => {
      // Invalidate generic list and session-specific list
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      if (newCategory.sessionId) {
        queryClient.invalidateQueries({
          queryKey: CATEGORY_KEYS.bySession(newCategory.sessionId),
        });
      }
      // Optional: Add to cache
      queryClient.setQueryData(
        CATEGORY_KEYS.detail(newCategory.id),
        newCategory
      );
    },
    ...options,
  });
};

// Update an existing category
export const useUpdateCategory = (
  options?: UseMutationOptions<
    Category,
    Error,
    { id: string; data: UpdateCategoryData }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, { id: string; data: UpdateCategoryData }>(
    {
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: UpdateCategoryData;
      }) => {
        const response = await categoryApi.updateCategory(id, data);
        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to update category");
        }
        return response.data;
      },
      onSuccess: (updatedCategory, variables) => {
        // Invalidate relevant lists and detail views
        queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: CATEGORY_KEYS.detail(variables.id),
        });
        if (updatedCategory.sessionId) {
          queryClient.invalidateQueries({
            queryKey: CATEGORY_KEYS.bySession(updatedCategory.sessionId),
          });
        }
        // Update cache
        queryClient.setQueryData(
          CATEGORY_KEYS.detail(variables.id),
          updatedCategory
        );

        // Also invalidate ideas associated with this category, as name/color might affect display
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.byCategory(variables.id),
        });
        // Invalidate general idea lists too, just in case
        queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
      },
      ...options,
    }
  );
};

// Delete a category
export const useDeleteCategory = (
  options?: UseMutationOptions<{ success: boolean }, Error, string>
) => {
  const queryClient = useQueryClient();

  // Fetch category before deleting to get sessionId for invalidation
  const mutation = useMutation<
    { success: boolean; sessionId?: string },
    Error,
    string
  >({
    mutationFn: async (id: string) => {
      let sessionId: string | undefined;
      try {
        const catResponse = await categoryApi.getCategory(id);
        if (catResponse.success && catResponse.data) {
          sessionId = catResponse.data.sessionId;
        }
      } catch (e) {
        console.error(
          "Failed to fetch category before delete for cache invalidation:",
          e
        );
      }

      const response = await categoryApi.deleteCategory(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete category");
      }
      return { success: true, sessionId };
    },
    onSuccess: ({ sessionId }, id) => {
      // Remove detail, invalidate lists
      queryClient.removeQueries({ queryKey: CATEGORY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      if (sessionId) {
        queryClient.invalidateQueries({
          queryKey: CATEGORY_KEYS.bySession(sessionId),
        });
      }
      // Invalidate ideas associated with this category
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.byCategory(id) });
      // Invalidate general idea lists
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
    },
    ...options,
  });

  return mutation;
};
