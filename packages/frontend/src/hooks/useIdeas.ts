import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { /* apiConfig, */ ApiResponse, ApiError } from "../services/api/config";
import { ideaApi } from "../services/api/ideaApi";
import { Idea, CreateIdea, UpdateIdea } from "@ai-brainstorm/types";

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
const IDEA_KEYS = {
  all: ["ideas"] as const,
  lists: () => [...IDEA_KEYS.all, "list"] as const,
  listBySession: (sessionId: string) =>
    [...IDEA_KEYS.lists(), { sessionId }] as const,
  details: () => [...IDEA_KEYS.all, "detail"] as const,
  detail: (id: string) => [...IDEA_KEYS.details(), id] as const,
};

// Fetch all ideas for a specific session
export const useGetIdeasBySession = (
  sessionId: string,
  options?: Omit<
    UseQueryOptions<Idea[], ApiError>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  return useQuery<Idea[], ApiError>({
    queryKey: IDEA_KEYS.listBySession(sessionId),
    queryFn: () => handleApiResponse(ideaApi.getBySessionId(sessionId)),
    enabled: !!sessionId,
    ...options,
  });
};

// Fetch a single idea by ID
export const useGetIdeaById = (
  id: string,
  options?: Omit<
    UseQueryOptions<Idea, ApiError>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  return useQuery<Idea, ApiError>({
    queryKey: IDEA_KEYS.detail(id),
    queryFn: () => handleApiResponse(ideaApi.getById(id)),
    enabled: !!id,
    ...options,
  });
};

// Create a new idea
export const useCreateIdea = (
  options?: UseMutationOptions<Idea, ApiError, CreateIdea>
) => {
  const queryClient = useQueryClient();

  return useMutation<Idea, ApiError, CreateIdea>({
    mutationFn: (data: CreateIdea) => handleApiResponse(ideaApi.create(data)),
    onSuccess: (newIdea, variables, context) => {
      // Only add optimistic update if needed
      queryClient.setQueryData(IDEA_KEYS.detail(newIdea.id), newIdea);
      options?.onSuccess?.(newIdea, variables, context);
    },
    onSettled: (data) => {
      // Force refetch regardless of outcome
      if (data?.sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.listBySession(data.sessionId),
        });
        queryClient.refetchQueries({
          queryKey: IDEA_KEYS.listBySession(data.sessionId),
        });
      } else {
        queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
        queryClient.refetchQueries({ queryKey: IDEA_KEYS.lists() });
      }
    },
    ...options,
  });
};

// Update an existing idea
export const useUpdateIdea = (
  options?: UseMutationOptions<Idea, ApiError, { id: string; data: UpdateIdea }>
) => {
  const queryClient = useQueryClient();

  let previousCategoryId: string | undefined | null = null;

  return useMutation<Idea, ApiError, { id: string; data: UpdateIdea }>({
    onMutate: async ({ id }) => {
      const previousIdea = queryClient.getQueryData<Idea>(IDEA_KEYS.detail(id));
      previousCategoryId = previousIdea?.categoryId;
    },
    mutationFn: ({ id, data }) => handleApiResponse(ideaApi.update(id, data)),
    onSuccess: (updatedIdea, variables, context) => {
      // Invalidate the specific idea detail
      queryClient.invalidateQueries({
        queryKey: IDEA_KEYS.detail(variables.id),
      });

      // Invalidate the list for the session the idea belongs to
      if (updatedIdea.sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.listBySession(updatedIdea.sessionId),
        });
      } else {
        // Fallback: Invalidate general list if session ID is missing
        queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
      }

      // If the category changed, invalidate lists for old/new categories if necessary
      // This requires knowing the old category ID (captured in onMutate)
      const categoryIdChanged = previousCategoryId !== updatedIdea.categoryId;
      if (categoryIdChanged) {
        // Optional: Invalidate old category list
        // if (previousCategoryId) {
        //    queryClient.invalidateQueries({ queryKey: CATEGORY_IDEA_KEYS.listByCategory(previousCategoryId) });
        // }
        // Optional: Invalidate new category list
        // if (updatedIdea.categoryId) {
        //    queryClient.invalidateQueries({ queryKey: CATEGORY_IDEA_KEYS.listByCategory(updatedIdea.categoryId) });
        // }
        // If category-specific lists aren't used, this section might be unnecessary
        // or a simpler invalidation of the session list might suffice.
      }

      // Optional: Set detail data for immediate optimistic update
      queryClient.setQueryData(IDEA_KEYS.detail(variables.id), updatedIdea);

      // Call original onSuccess if provided
      options?.onSuccess?.(updatedIdea, variables, context);
    },
    onError: (err, variables, context) => {
      options?.onError?.(err, variables, context);
    },
    ...options,
  });
};

// Delete an idea
export const useDeleteIdea = (
  options?: UseMutationOptions<void, ApiError, string>
) => {
  const queryClient = useQueryClient();

  let sessionIdForInvalidation: string | undefined;

  return useMutation<void, ApiError, string>({
    onMutate: async (id: string) => {
      // Cancel any outgoing refetch to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: IDEA_KEYS.all });

      // Get the idea's session ID before deleting for later invalidation
      try {
        const idea = await queryClient.fetchQuery<Idea>({
          queryKey: IDEA_KEYS.detail(id),
          staleTime: 10000,
        });
        sessionIdForInvalidation = idea?.sessionId;

        // Snapshot the previous state
        const previousIdeas = sessionIdForInvalidation
          ? queryClient.getQueryData<Idea[]>(
              IDEA_KEYS.listBySession(sessionIdForInvalidation)
            )
          : null;

        // Optimistically remove the idea from the list
        if (previousIdeas && sessionIdForInvalidation) {
          queryClient.setQueryData<Idea[]>(
            IDEA_KEYS.listBySession(sessionIdForInvalidation),
            previousIdeas.filter((idea) => idea.id !== id)
          );
        }

        return { previousIdeas, sessionIdForInvalidation };
      } catch (e) {
        console.error("Failed to get sessionId before deleting idea", e);
        return {};
      }
    },
    mutationFn: (id: string) => handleApiResponse(ideaApi.delete(id)),
    onSuccess: (data, id, context) => {
      options?.onSuccess?.(data, id, context);
    },
    onSettled: (data, error, id /*, context */) => {
      // Remove the idea from cache
      queryClient.removeQueries({ queryKey: IDEA_KEYS.detail(id) });

      // If we have the session ID, invalidate and force refetch the list
      if (sessionIdForInvalidation) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.listBySession(sessionIdForInvalidation),
        });
        queryClient.refetchQueries({
          queryKey: IDEA_KEYS.listBySession(sessionIdForInvalidation),
        });
      } else {
        // Fallback: Invalidate all idea lists
        queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
        queryClient.refetchQueries({ queryKey: IDEA_KEYS.lists() });
      }
    },
    ...options,
  });
};

// Example for bulk update (if needed)
export const useUpdateIdeasBulk = (
  options?: UseMutationOptions<
    Idea[],
    ApiError,
    { ideas: { id: string; data: UpdateIdea }[] }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    Idea[],
    ApiError,
    { ideas: { id: string; data: UpdateIdea }[] }
  >({
    mutationFn: (data) => handleApiResponse(ideaApi.updateBulk(data.ideas)),
    onSuccess: (updatedIdeas, variables, context) => {
      if (updatedIdeas.length > 0) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.listBySession(updatedIdeas[0].sessionId),
        });
        updatedIdeas.forEach((idea) => {
          queryClient.setQueryData(IDEA_KEYS.detail(idea.id), idea);
        });
      }
      options?.onSuccess?.(updatedIdeas, variables, context);
    },
    ...options,
  });
};
