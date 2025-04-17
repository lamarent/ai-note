import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiConfig, ApiResponse } from "../api/config";
import { SESSION_KEYS } from "./useSessions";
import { Category } from "../api/categoryApi";

// Moved types from ideaApi.ts
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
// End of moved types

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
      const response = await apiConfig.get<Idea[]>("/ideas");
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
      const response = await apiConfig.get<Idea>(`/ideas/${id}`);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch idea");
      }
      return response.data as Idea;
    },
    enabled: !!id,
  });
}

/**
 * Hook to fetch ideas by session ID
 */
export function useSessionIdeas(sessionId: string) {
  return useQuery({
    queryKey: IDEA_KEYS.bySession(sessionId),
    queryFn: async () => {
      const response = await apiConfig.get<Idea[]>(
        `/ideas/session/${sessionId}`
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch session ideas");
      }
      return response.data as Idea[];
    },
    enabled: !!sessionId,
  });
}

/**
 * Hook to fetch ideas by category ID
 */
export function useCategoryIdeas(categoryId: string) {
  return useQuery({
    queryKey: IDEA_KEYS.byCategory(categoryId),
    queryFn: async () => {
      const response = await apiConfig.get<Idea[]>(
        `/ideas/category/${categoryId}`
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch category ideas");
      }
      return response.data as Idea[];
    },
    enabled: !!categoryId,
  });
}

/**
 * Hook to create a new idea
 */
export function useCreateIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIdeaData) => {
      const response = await apiConfig.post<Idea>("/ideas", data);
      if (!response.success) {
        throw new Error(response.error || "Failed to create idea");
      }
      return response.data as Idea;
    },
    onSuccess: (newIdea) => {
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });

      if (newIdea.sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.bySession(newIdea.sessionId),
        });

        queryClient.invalidateQueries({
          queryKey: SESSION_KEYS.detail(newIdea.sessionId),
        });
      }

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
      const response = await apiConfig.put<Idea>(`/ideas/${id}`, data);
      if (!response.success) {
        throw new Error(response.error || "Failed to update idea");
      }
      return response.data as Idea;
    },
    onSuccess: (updatedIdea) => {
      queryClient.setQueryData(IDEA_KEYS.detail(id), updatedIdea);

      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });

      if (updatedIdea.sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.bySession(updatedIdea.sessionId),
        });
      }

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
      const ideaResponse = await apiConfig.get<Idea>(`/ideas/${id}`);
      const idea = ideaResponse.data;

      if (!ideaResponse.success || !idea) {
        console.warn(
          `Failed to fetch idea ${id} before deleting, cache invalidation for session/category might be incomplete.`
        );
      }

      const response = await apiConfig.delete<{ success: boolean }>(
        `/ideas/${id}`
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to delete idea");
      }

      return {
        id,
        sessionId: idea?.sessionId,
        categoryId: idea?.categoryId,
      };
    },
    onSuccess: ({ id, sessionId, categoryId }) => {
      queryClient.removeQueries({ queryKey: IDEA_KEYS.detail(id) });

      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });

      if (sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.bySession(sessionId),
        });

        queryClient.invalidateQueries({
          queryKey: SESSION_KEYS.detail(sessionId),
        });
      }

      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.byCategory(categoryId),
        });
      }
    },
  });
}
