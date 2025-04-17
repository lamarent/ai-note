import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
  QueryKey,
} from "@tanstack/react-query";
// Import types and API service from ideaApi.ts
import { ideaApi, Idea, CreateIdeaData, UpdateIdeaData } from "../ideaApi";
import { ApiError } from "../../services/api/config";
import { SESSION_KEYS } from "./useSessions"; // Import session keys for invalidation

// Query keys for ideas
export const IDEA_KEYS = {
  all: ["ideas"] as const,
  lists: () => [...IDEA_KEYS.all, "list"] as const,
  list: (
    filters: Record<string, unknown> // Example filter structure
  ) => [...IDEA_KEYS.lists(), filters] as const,
  bySession: (sessionId: string) =>
    [...IDEA_KEYS.lists(), { sessionId }] as const,
  byCategory: (
    categoryId: string // Added for potential future use
  ) => [...IDEA_KEYS.lists(), { categoryId }] as const,
  details: () => [...IDEA_KEYS.all, "detail"] as const,
  detail: (id: string) => [...IDEA_KEYS.details(), id] as const,
};

// Fetch all ideas (Consider if this is needed or if ideas are always session-specific)
export const useGetIdeas = (
  options?: Omit<UseQueryOptions<Idea[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery<Idea[], Error>({
    queryKey: IDEA_KEYS.lists(),
    queryFn: async () => {
      const response = await ideaApi.getIdeas();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch ideas");
      }
      return response.data;
    },
    ...options,
  });
};

// Fetch all ideas for a specific session
export const useGetSessionIdeas = (
  sessionId: string,
  options?: Omit<
    UseQueryOptions<Idea[], Error>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  return useQuery<Idea[], Error>({
    // Use specific query key including sessionId
    queryKey: IDEA_KEYS.bySession(sessionId),
    queryFn: async () => {
      const response = await ideaApi.getIdeasBySession(sessionId);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch session ideas");
      }
      return response.data;
    },
    enabled: !!sessionId, // Only run if sessionId is available
    ...options,
  });
};

// Fetch a single idea by ID
export const useGetIdea = (
  id: string,
  options?: Omit<
    UseQueryOptions<Idea, Error>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  return useQuery<Idea, Error>({
    queryKey: IDEA_KEYS.detail(id),
    queryFn: async () => {
      const response = await ideaApi.getIdea(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch idea");
      }
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

// Create a new idea
export const useCreateIdea = (
  options?: UseMutationOptions<Idea, Error, CreateIdeaData>
) => {
  const queryClient = useQueryClient();

  return useMutation<Idea, Error, CreateIdeaData>({
    mutationFn: async (data: CreateIdeaData) => {
      const response = await ideaApi.createIdea(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create idea");
      }
      return response.data;
    },
    onSuccess: (newIdea) => {
      // Invalidate the generic list and the specific session list
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
      if (newIdea.sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.bySession(newIdea.sessionId),
        });
      }
      // Optional: Add to cache
      queryClient.setQueryData(IDEA_KEYS.detail(newIdea.id), newIdea);
    },
    ...options,
  });
};

// Update an existing idea
export const useUpdateIdea = (
  options?: UseMutationOptions<
    Idea,
    Error,
    { id: string; data: UpdateIdeaData }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<Idea, Error, { id: string; data: UpdateIdeaData }>({
    mutationFn: async ({ id, data }: { id: string; data: UpdateIdeaData }) => {
      const response = await ideaApi.updateIdea(id, data);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update idea");
      }
      return response.data;
    },
    onSuccess: (updatedIdea, variables) => {
      // Invalidate generic list, specific idea detail, and session list
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: IDEA_KEYS.detail(variables.id),
      });
      if (updatedIdea.sessionId) {
        // Use updatedIdea to get sessionId
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.bySession(updatedIdea.sessionId),
        });
      }
      // Update cache
      queryClient.setQueryData(IDEA_KEYS.detail(variables.id), updatedIdea);
    },
    ...options,
  });
};

// Delete an idea
export const useDeleteIdea = (
  options?: UseMutationOptions<{ success: boolean }, Error, string>
) => {
  const queryClient = useQueryClient();

  // Need to fetch the idea before deleting to get its sessionId for invalidation
  const mutation = useMutation<
    { success: boolean; sessionId?: string },
    Error,
    string
  >({
    mutationFn: async (id: string) => {
      // Fetch idea first (handle potential error)
      let sessionId: string | undefined;
      try {
        const ideaResponse = await ideaApi.getIdea(id);
        if (ideaResponse.success && ideaResponse.data) {
          sessionId = ideaResponse.data.sessionId;
        }
      } catch (e) {
        console.error(
          "Failed to fetch idea before delete for cache invalidation:",
          e
        );
      }

      const response = await ideaApi.deleteIdea(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete idea");
      }
      return { success: true, sessionId };
    },
    onSuccess: ({ sessionId }, id) => {
      // Invalidate generic list and remove detail
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
      queryClient.removeQueries({ queryKey: IDEA_KEYS.detail(id) });
      // Invalidate session list if we found the sessionId
      if (sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.bySession(sessionId),
        });
      }
    },
    ...options,
  });

  return mutation;
};
