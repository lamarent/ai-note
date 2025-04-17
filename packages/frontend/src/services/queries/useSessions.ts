import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from "@tanstack/react-query";
import {
  sessionApi,
  Session,
  CreateSessionInput,
  UpdateSessionInput,
} from "../api/sessionApi";
import { ApiError } from "../api/config";

// Query keys for caching
export const SESSION_KEYS = {
  all: ["sessions"] as const,
  lists: () => [...SESSION_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...SESSION_KEYS.lists(), filters] as const,
  details: () => [...SESSION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SESSION_KEYS.details(), id] as const,
};

/**
 * Hook for getting all sessions
 */
export const useGetSessions = (
  options?: Omit<
    UseQueryOptions<Session[], ApiError, Session[], QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Session[], ApiError>({
    queryKey: SESSION_KEYS.lists(),
    queryFn: () => sessionApi.getAll(),
    ...options,
  });
};

/**
 * Hook for getting a session by ID
 */
export const useGetSession = (
  id: string,
  options?: Omit<
    UseQueryOptions<Session, ApiError, Session, QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Session, ApiError>({
    queryKey: SESSION_KEYS.detail(id),
    queryFn: () => sessionApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook for getting sessions by owner ID
 */
export const useGetSessionsByOwnerId = (
  ownerId: string,
  options?: Omit<
    UseQueryOptions<Session[], ApiError, Session[], QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Session[], ApiError>({
    queryKey: SESSION_KEYS.list({ ownerId }),
    queryFn: () => sessionApi.getByOwnerId(ownerId),
    enabled: !!ownerId,
    ...options,
  });
};

/**
 * Hook for creating a session
 */
export const useCreateSession = (
  options?: UseMutationOptions<Session, ApiError, CreateSessionInput>
) => {
  const queryClient = useQueryClient();

  return useMutation<Session, ApiError, CreateSessionInput>({
    mutationFn: (data) => sessionApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });
      queryClient.setQueryData(SESSION_KEYS.detail(data.id), data);
    },
    ...options,
  });
};

/**
 * Hook for updating a session
 */
export const useUpdateSession = (
  options?: UseMutationOptions<
    Session,
    ApiError,
    { id: string; data: UpdateSessionInput }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Session,
    ApiError,
    { id: string; data: UpdateSessionInput }
  >({
    mutationFn: ({ id, data }) => sessionApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });
      queryClient.setQueryData(SESSION_KEYS.detail(data.id), data);
    },
    ...options,
  });
};

/**
 * Hook for deleting a session
 */
export const useDeleteSession = (
  options?: UseMutationOptions<unknown, ApiError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, string>({
    mutationFn: (id) => sessionApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });
      queryClient.removeQueries({ queryKey: SESSION_KEYS.detail(id) });
    },
    ...options,
  });
};
