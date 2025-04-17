import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
  QueryKey,
} from "@tanstack/react-query";
// Import types and API service from sessionApi.ts
import {
  sessionApi,
  Session,
  CreateSessionData,
  UpdateSessionData,
} from "../sessionApi";
// Import ApiError from the correct path
import { ApiError } from "../../services/api/config";

// Query keys
export const SESSION_KEYS = {
  all: ["sessions"] as const,
  lists: () => [...SESSION_KEYS.all, "list"] as const,
  list: (
    filters: Record<string, unknown> // Example filter structure
  ) => [...SESSION_KEYS.lists(), filters] as const,
  details: () => [...SESSION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SESSION_KEYS.details(), id] as const,
};

// Fetch all sessions
export const useGetSessions = (
  options?: Omit<UseQueryOptions<Session[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery<Session[], Error>({
    queryKey: SESSION_KEYS.lists(),
    queryFn: async () => {
      const response = await sessionApi.getSessions();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch sessions");
      }
      return response.data;
    },
    ...options,
  });
};

// Fetch a single session by ID
export const useGetSession = (
  id: string,
  options?: Omit<
    UseQueryOptions<Session, Error>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  return useQuery<Session, Error>({
    queryKey: SESSION_KEYS.detail(id),
    queryFn: async () => {
      const response = await sessionApi.getSession(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch session");
      }
      return response.data;
    },
    enabled: !!id, // Only run query if ID is provided
    ...options,
  });
};

// Create a new session
export const useCreateSession = (
  options?: UseMutationOptions<Session, Error, CreateSessionData>
) => {
  const queryClient = useQueryClient();

  return useMutation<Session, Error, CreateSessionData>({
    mutationFn: async (data: CreateSessionData) => {
      const response = await sessionApi.createSession(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create session");
      }
      return response.data;
    },
    onSuccess: (newSession) => {
      // Invalidate the list query
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });
      // Optionally, add the new session to the cache immediately
      queryClient.setQueryData(SESSION_KEYS.detail(newSession.id), newSession);
    },
    ...options,
  });
};

// Update an existing session
export const useUpdateSession = (
  options?: UseMutationOptions<
    Session,
    Error,
    { id: string; data: UpdateSessionData }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<Session, Error, { id: string; data: UpdateSessionData }>({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSessionData;
    }) => {
      const response = await sessionApi.updateSession(id, data);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update session");
      }
      return response.data;
    },
    onSuccess: (updatedSession, variables) => {
      // Invalidate list and detail queries
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: SESSION_KEYS.detail(variables.id),
      });
      // Update the specific session query cache
      queryClient.setQueryData(
        SESSION_KEYS.detail(variables.id),
        updatedSession
      );
    },
    ...options,
  });
};

// Delete a session
export const useDeleteSession = (
  options?: UseMutationOptions<{ success: boolean }, Error, string> // Error type changed
) => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id: string) => {
      const response = await sessionApi.deleteSession(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete session");
      }
      return { success: true }; // Return success indicator
    },
    onSuccess: (_, id) => {
      // Invalidate list query
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });
      // Remove the deleted session from the cache
      queryClient.removeQueries({ queryKey: SESSION_KEYS.detail(id) });
    },
    ...options,
  });
};
