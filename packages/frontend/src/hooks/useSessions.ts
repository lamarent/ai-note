import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type DefinedInitialDataOptions,
  type UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { ApiResponse, ApiError } from "../services/api/config";
import { sessionApi } from "../services/api/sessionApi";
import { Session, CreateSession, UpdateSession } from "@ai-brainstorm/types";

// Define query keys
const SESSION_KEYS = {
  all: ["sessions"] as const,
  lists: () => [...SESSION_KEYS.all, "list"] as const,
  list: (filters: string) => [...SESSION_KEYS.lists(), { filters }] as const,
  details: () => [...SESSION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SESSION_KEYS.details(), id] as const,
  byOwner: (ownerId: string) =>
    [...SESSION_KEYS.all, "owner", ownerId] as const,
};

// Helper to extract data or throw error from ApiResponse
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

// Fetch all sessions
export const useGetSessions = (
  options?:
    | Omit<
        DefinedInitialDataOptions<Session[], ApiError>,
        "queryKey" | "queryFn"
      >
    | Omit<
        UndefinedInitialDataOptions<Session[], ApiError>,
        "queryKey" | "queryFn"
      >
) => {
  return useQuery<Session[], ApiError>({
    queryKey: SESSION_KEYS.lists(),
    queryFn: () => handleApiResponse(sessionApi.getAll()),
    ...options,
  });
};

// Fetch session by ID
export const useGetSessionById = (
  id: string,
  options?:
    | Omit<
        DefinedInitialDataOptions<Session, ApiError>,
        "queryKey" | "queryFn" | "enabled"
      >
    | Omit<
        UndefinedInitialDataOptions<Session, ApiError>,
        "queryKey" | "queryFn" | "enabled"
      >
) => {
  return useQuery<Session, ApiError>({
    queryKey: SESSION_KEYS.detail(id),
    queryFn: () => handleApiResponse(sessionApi.getById(id)),
    enabled: !!id,
    ...options,
  });
};

// Fetch sessions by owner ID
export const useGetSessionsByOwner = (
  ownerId: string,
  options?:
    | Omit<
        DefinedInitialDataOptions<Session[], ApiError>,
        "queryKey" | "queryFn" | "enabled"
      >
    | Omit<
        UndefinedInitialDataOptions<Session[], ApiError>,
        "queryKey" | "queryFn" | "enabled"
      >
) => {
  return useQuery<Session[], ApiError>({
    queryKey: SESSION_KEYS.byOwner(ownerId),
    queryFn: () => handleApiResponse(sessionApi.getByOwnerId(ownerId)),
    enabled: !!ownerId,
    ...options,
  });
};

// Create a new session
export const useCreateSession = (
  options?: UseMutationOptions<Session, ApiError, CreateSession>
) => {
  const queryClient = useQueryClient();

  return useMutation<Session, ApiError, CreateSession>({
    mutationFn: (data: CreateSession) =>
      handleApiResponse(sessionApi.create(data)),
    onSuccess: (newSession, variables, context) => {
      console.log("newSession", newSession);
      options?.onSuccess?.(newSession, variables, context);
    },
    onSettled: () => {
      // Force refetch sessions list
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });
      queryClient.refetchQueries({ queryKey: SESSION_KEYS.lists() });
    },
    ...options,
  });
};

// Update a session
export const useUpdateSession = (
  options?: UseMutationOptions<
    Session,
    ApiError,
    { id: string; data: UpdateSession }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<Session, ApiError, { id: string; data: UpdateSession }>({
    mutationFn: ({ id, data }: { id: string; data: UpdateSession }) =>
      handleApiResponse(sessionApi.update(id, data)),
    onSuccess: (updatedSession, variables, context) => {
      // Only do the optimistic update here
      queryClient.setQueryData<Session[] | undefined>(
        SESSION_KEYS.lists(),
        (oldData) =>
          (oldData ?? []).map((session) =>
            session.id === variables.id ? updatedSession : session
          )
      );
      queryClient.setQueryData<Session | undefined>(
        SESSION_KEYS.detail(variables.id),
        updatedSession
      );

      options?.onSuccess?.(updatedSession, variables, context);
    },
    onSettled: (data, _error, variables) => {
      // Force refetch regardless of outcome
      queryClient.invalidateQueries({
        queryKey: SESSION_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });
      queryClient.refetchQueries({ queryKey: SESSION_KEYS.lists() });

      if (data?.ownerId) {
        queryClient.invalidateQueries({
          queryKey: SESSION_KEYS.byOwner(data.ownerId),
        });
      }
    },
    ...options,
  });
};

// Delete a session
export const useDeleteSession = (
  options?: UseMutationOptions<void, ApiError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (id: string) => handleApiResponse(sessionApi.delete(id)),
    onSuccess: (data, id, context) => {
      options?.onSuccess?.(data, id, context);
    },
    onSettled: (_data, _error, id) => {
      // Force remove and invalidate
      queryClient.removeQueries({ queryKey: SESSION_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.lists() });
      queryClient.refetchQueries({ queryKey: SESSION_KEYS.lists() });
    },
    ...options,
  });
};
