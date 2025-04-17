import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ideaApi, CreateIdeaData, UpdateIdeaData, Idea } from "../api";
import { SESSION_KEYS } from "./useSessions";

// Query keys
export const IDEA_KEYS = {
  all: ["ideas"] as const,
  lists: () => [...IDEA_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...IDEA_KEYS.lists(), { filters }] as const,
  bySession: (sessionId: string) =>
    [...IDEA_KEYS.lists(), { sessionId }] as const,
  byCategory: (categoryId: string) =>
    [...IDEA_KEYS.lists(), { categoryId }] as const,
  details: () => [...IDEA_KEYS.all, "detail"] as const,
  detail: (id: string) => [...IDEA_KEYS.details(), id] as const,
};

/**
 * Hook to fetch all ideas
 */
export function useIdeas() {
  return useQuery({
    queryKey: IDEA_KEYS.lists(),
    queryFn: async () => {
      const response = await ideaApi.getIdeas();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch ideas");
      }
      return response.data as Idea[];
    },
  });
}

/**
 * Hook to fetch a single idea by ID
 */
export function useIdea(id: string) {
  return useQuery({
    queryKey: IDEA_KEYS.detail(id),
    queryFn: async () => {
      const response = await ideaApi.getIdea(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch idea");
      }
      return response.data as Idea;
    },
    enabled: !!id, // Only run query if ID is provided
  });
}

/**
 * Hook to fetch ideas by session ID
 */
export function useSessionIdeas(sessionId: string) {
  return useQuery({
    queryKey: IDEA_KEYS.bySession(sessionId),
    queryFn: async () => {
      const response = await ideaApi.getIdeasBySession(sessionId);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch session ideas");
      }
      return response.data as Idea[];
    },
    enabled: !!sessionId, // Only run query if session ID is provided
  });
}

/**
 * Hook to fetch ideas by category ID
 */
export function useCategoryIdeas(categoryId: string) {
  return useQuery({
    queryKey: IDEA_KEYS.byCategory(categoryId),
    queryFn: async () => {
      const response = await ideaApi.getIdeasByCategory(categoryId);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch category ideas");
      }
      return response.data as Idea[];
    },
    enabled: !!categoryId, // Only run query if category ID is provided
  });
}

/**
 * Hook to create a new idea
 */
export function useCreateIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIdeaData) => {
      const response = await ideaApi.createIdea(data);
      if (!response.success) {
        throw new Error(response.error || "Failed to create idea");
      }
      return response.data as Idea;
    },
    onSuccess: (newIdea) => {
      // Invalidate ideas list query to refetch
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });

      // Invalidate session ideas
      if (newIdea.sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.bySession(newIdea.sessionId),
        });

        // Also invalidate the session detail to reflect idea count changes
        queryClient.invalidateQueries({
          queryKey: SESSION_KEYS.detail(newIdea.sessionId),
        });
      }

      // If idea has a category, invalidate category ideas
      if (newIdea.categoryId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.byCategory(newIdea.categoryId),
        });
      }
    },
  });
}

/**
 * Hook to update an idea
 */
export function useUpdateIdea(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateIdeaData) => {
      const response = await ideaApi.updateIdea(id, data);
      if (!response.success) {
        throw new Error(response.error || "Failed to update idea");
      }
      return response.data as Idea;
    },
    onSuccess: (updatedIdea) => {
      // Update the idea in the cache
      queryClient.setQueryData(IDEA_KEYS.detail(id), updatedIdea);

      // Invalidate all idea lists
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });

      // Invalidate session ideas
      if (updatedIdea.sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.bySession(updatedIdea.sessionId),
        });
      }

      // If idea has a category, invalidate category ideas
      if (updatedIdea.categoryId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.byCategory(updatedIdea.categoryId),
        });
      }
    },
  });
}

/**
 * Hook to delete an idea
 */
export function useDeleteIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Get the idea first to know its session and category for cache invalidation
      const ideaResponse = await ideaApi.getIdea(id);
      const idea = ideaResponse.data as Idea;

      const response = await ideaApi.deleteIdea(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete idea");
      }

      // Return id, sessionId, and categoryId for cache invalidation
      return {
        id,
        sessionId: idea?.sessionId,
        categoryId: idea?.categoryId,
      };
    },
    onSuccess: ({ id, sessionId, categoryId }) => {
      // Remove the idea from the cache
      queryClient.removeQueries({ queryKey: IDEA_KEYS.detail(id) });

      // Invalidate idea lists
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });

      // Invalidate session ideas
      if (sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.bySession(sessionId),
        });

        // Also invalidate the session detail to reflect idea count changes
        queryClient.invalidateQueries({
          queryKey: SESSION_KEYS.detail(sessionId),
        });
      }

      // If idea had a category, invalidate category ideas
      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.byCategory(categoryId),
        });
      }
    },
  });
}
