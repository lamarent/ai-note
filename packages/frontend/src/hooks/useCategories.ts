import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { ApiResponse, ApiError } from "../services/api/config";
import { Category, CreateCategory, UpdateCategory } from "@ai-brainstorm/types";
import { categoryApi } from "../services/api/categoryApi";

// Removed local interface Category

// Re-use handleApiResponse (could be moved to a shared utils file later)
async function handleApiResponse<T>(
  responsePromise: Promise<ApiResponse<T>>
): Promise<T> {
  const response = await responsePromise;
  if (response.success && response.data !== undefined) {
    return response.data;
  } else if (response.success && response.data === undefined) {
    return {} as T;
  }
  throw new ApiError(
    response.message || response.error || "API request failed",
    response.status,
    response.data
  );
}

// Define query keys
const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  listBySession: (sessionId: string) =>
    [...CATEGORY_KEYS.lists(), { sessionId }] as const,
  details: () => [...CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,
};

// --- React Query Hooks --- //

// Fetch all categories (or by session)
export const useGetCategoriesBySession = (
  sessionId: string,
  options?: UseQueryOptions<Category[], ApiError>
) => {
  return useQuery<Category[], ApiError>({
    queryKey: CATEGORY_KEYS.listBySession(sessionId),
    queryFn: () => handleApiResponse(categoryApi.getBySessionId(sessionId)),
    enabled: !!sessionId,
    ...options,
  });
};

// Fetch category by ID
export const useGetCategoryById = (
  id: string,
  options?: UseQueryOptions<Category, ApiError>
) => {
  return useQuery<Category, ApiError>({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => handleApiResponse(categoryApi.getById(id)),
    enabled: !!id,
    ...options,
  });
};

// Create a new category
export const useCreateCategory = (
  options?: UseMutationOptions<Category, ApiError, CreateCategory>
) => {
  const queryClient = useQueryClient();
  return useMutation<Category, ApiError, CreateCategory>({
    mutationFn: (data: CreateCategory) =>
      handleApiResponse(categoryApi.create(data)),
    onSuccess: (newCategory /* ... */) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.listBySession(newCategory.sessionId),
      });
      // ... other onSuccess logic ...
    },
    ...options,
  });
};

// Update a category
export const useUpdateCategory = (
  options?: UseMutationOptions<
    Category,
    ApiError,
    { id: string; data: UpdateCategory }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<Category, ApiError, { id: string; data: UpdateCategory }>({
    mutationFn: ({ id, data }) =>
      handleApiResponse(categoryApi.update(id, data)),
    onSuccess: (updatedCategory, variables /* ... */) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.listBySession(updatedCategory.sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.detail(variables.id),
      });
      // ... other onSuccess logic ...
    },
    ...options,
  });
};

// Delete a category
export const useDeleteCategory = (
  options?: UseMutationOptions<void, ApiError, string>
) => {
  const queryClient = useQueryClient();
  // Need sessionId for invalidation
  let sessionIdForInvalidation: string | undefined;

  return useMutation<void, ApiError, string>({
    onMutate: async (id: string) => {
      try {
        const category = await queryClient.fetchQuery<Category>({
          queryKey: CATEGORY_KEYS.detail(id),
          staleTime: 10000,
        });
        sessionIdForInvalidation = category?.sessionId;
      } catch (e) {
        console.error("Failed to get sessionId before deleting category", e);
      }
    },
    mutationFn: (id: string) => handleApiResponse(categoryApi.delete(id)),
    onSuccess: (data, id, context) => {
      queryClient.removeQueries({ queryKey: CATEGORY_KEYS.detail(id) });
      if (sessionIdForInvalidation) {
        queryClient.invalidateQueries({
          queryKey: CATEGORY_KEYS.listBySession(sessionIdForInvalidation),
        });
      }
      // Consider invalidating broader session/idea queries if needed
      options?.onSuccess?.(data, id, context);
    },
    ...options,
  });
};
