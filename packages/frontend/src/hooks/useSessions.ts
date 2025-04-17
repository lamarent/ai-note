import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiConfig, ApiResponse } from "../api/config";
import { User } from "./useUsers";
import { Category } from "./useCategories";
import { Idea } from "./useIdeas";

export interface Session {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  isPublic: boolean;
  owner?: User;
  collaborators?: User[];
  categories?: Category[];
  ideas?: Idea[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionData {
  title: string;
  description?: string;
  ownerId: string;
  collaborators?: string[];
  isPublic?: boolean;
}

export interface UpdateSessionData {
  title?: string;
  description?: string;
  collaborators?: string[];
  isPublic?: boolean;
}

// Query keys
export const SESSION_KEYS = {
  all: ["sessions"] as const,
  lists: () => [...SESSION_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...SESSION_KEYS.lists(), { filters }] as const,
  byOwner: (ownerId: string) => [...SESSION_KEYS.lists(), { ownerId }] as const,
  details: () => [...SESSION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SESSION_KEYS.details(), id] as const,
};

/**
 * Hook to fetch all sessions
 */
export function useSessions() {
  return useQuery({
    queryKey: SESSION_KEYS.lists(),
    queryFn: async () => {
      const response = await apiConfig.get<Session[]>("/sessions");
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch sessions");
      }
      return response.data as Session[];
    },
  });
}

/**
 * Hook to fetch a single session by ID
 */
export function useSession(id: string) {
  return useQuery({
    queryKey: SESSION_KEYS.detail(id),
    queryFn: async () => {
      const response = await apiConfig.get<Session>(`/sessions/${id}`);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch session");
      }
      return response.data as Session;
    },
    enabled: !!id, // Only run query if ID is provided
  });
}

/**
 * Hook to fetch sessions by owner ID
 */
export function useSessionsByOwner(ownerId: string) {
  return useQuery({
    queryKey: SESSION_KEYS.byOwner(ownerId),
    queryFn: async () => {
      const response = await apiConfig.get<Session[]>(
        `/sessions/user/${ownerId}`
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch owner sessions");
      }
      return response.data as Session[];
    },
    enabled: !!ownerId, // Only run query if owner ID is provided
  });
}

/**
 * Hook to create a new session
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSessionData) => {
      const response = await apiConfig.post<Session>("/sessions", data);
      if (!response.success) {
        throw new Error(response.error || "Failed to create session");
      }
      return response.data as Session;
    },
    onSuccess: (newSession) => {
      // Invalidate sessions list query to refetch
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });

      // If the session has an owner, also invalidate the owner's sessions
      if (newSession.ownerId) {
        queryClient.invalidateQueries({
          queryKey: SESSION_KEYS.byOwner(newSession.ownerId),
        });
      }
    },
  });
}

/**
 * Hook to update a session
 */
export function useUpdateSession(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSessionData) => {
      const response = await apiConfig.put<Session>(`/sessions/${id}`, data);
      if (!response.success) {
        throw new Error(response.error || "Failed to update session");
      }
      return response.data as Session;
    },
    onSuccess: (updatedSession) => {
      // Update the session in the cache
      queryClient.setQueryData(SESSION_KEYS.detail(id), updatedSession);

      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });

      // If the session has an owner, also invalidate the owner's sessions
      if (updatedSession.ownerId) {
        queryClient.invalidateQueries({
          queryKey: SESSION_KEYS.byOwner(updatedSession.ownerId),
        });
      }
    },
  });
}

/**
 * Hook to delete a session
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Get the session first to know the owner ID for cache invalidation
      const sessionResponse = await apiConfig.get<Session>(`/sessions/${id}`);
      const session = sessionResponse.data;

      if (!sessionResponse.success || !session) {
        console.warn(
          `Failed to fetch session ${id} before deleting, cache invalidation for owner might be incomplete.`
        );
        // Decide if we should throw or continue
      }

      const response = await apiConfig.delete<{ success: boolean }>(
        `/sessions/${id}`
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to delete session");
      }

      // Return both ID and owner ID for cache invalidation
      return { id, ownerId: session?.ownerId };
    },
    onSuccess: ({ id, ownerId }) => {
      // Remove the session from the cache
      queryClient.removeQueries({ queryKey: SESSION_KEYS.detail(id) });

      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });

      // If we have the owner ID, invalidate their sessions list
      if (ownerId) {
        queryClient.invalidateQueries({
          queryKey: SESSION_KEYS.byOwner(ownerId),
        });
      }
    },
  });
}
