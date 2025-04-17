import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from "@tanstack/react-query";
import {
  ideaApi,
  Idea,
  CreateIdeaInput,
  UpdateIdeaInput,
} from "../api/ideaApi";
import { ApiError } from "../api/config";

// Query keys for caching
export const IDEA_KEYS = {
  all: ["ideas"] as const,
  lists: () => [...IDEA_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...IDEA_KEYS.lists(), filters] as const,
  details: () => [...IDEA_KEYS.all, "detail"] as const,
  detail: (id: string) => [...IDEA_KEYS.details(), id] as const,
  bySession: (sessionId: string) =>
    [...IDEA_KEYS.lists(), { sessionId }] as const,
};

/**
 * Hook for getting all ideas
 */
export const useGetIdeas = (
  options?: Omit<
    UseQueryOptions<Idea[], ApiError, Idea[], QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Idea[], ApiError>({
    queryKey: IDEA_KEYS.lists(),
    queryFn: () => ideaApi.getAll(),
    ...options,
  });
};

/**
 * Hook for getting ideas by session ID
 */
export const useGetIdeasBySessionId = (
  sessionId: string,
  options?: Omit<
    UseQueryOptions<Idea[], ApiError, Idea[], QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Idea[], ApiError>({
    queryKey: IDEA_KEYS.bySession(sessionId),
    queryFn: () => ideaApi.getBySessionId(sessionId),
    enabled: !!sessionId,
    ...options,
  });
};

/**
 * Hook for getting an idea by ID
 */
export const useGetIdea = (
  id: string,
  options?: Omit<
    UseQueryOptions<Idea, ApiError, Idea, QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Idea, ApiError>({
    queryKey: IDEA_KEYS.detail(id),
    queryFn: () => ideaApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook for creating an idea
 */
export const useCreateIdea = (
  options?: UseMutationOptions<Idea, ApiError, CreateIdeaInput>
) => {
  const queryClient = useQueryClient();

  return useMutation<Idea, ApiError, CreateIdeaInput>({
    mutationFn: (data) => ideaApi.create(data),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: IDEA_KEYS.bySession(data.sessionId),
      });

      // Update cache with new idea
      queryClient.setQueryData(IDEA_KEYS.detail(data.id), data);
    },
    ...options,
  });
};

/**
 * Hook for updating an idea
 */
export const useUpdateIdea = (
  options?: UseMutationOptions<
    Idea,
    ApiError,
    { id: string; data: UpdateIdeaInput }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<Idea, ApiError, { id: string; data: UpdateIdeaInput }>({
    mutationFn: ({ id, data }) => ideaApi.update(id, data),
    onSuccess: (updatedIdea) => {
      // Get the current idea to find its session ID
      const currentIdea = queryClient.getQueryData<Idea>(
        IDEA_KEYS.detail(updatedIdea.id)
      );

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });

      if (currentIdea?.sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.bySession(currentIdea.sessionId),
        });
      }

      // Update cache with updated idea
      queryClient.setQueryData(IDEA_KEYS.detail(updatedIdea.id), updatedIdea);
    },
    ...options,
  });
};

/**
 * Hook for updating idea position
 */
export const useUpdateIdeaPosition = (
  options?: UseMutationOptions<
    Idea,
    ApiError,
    { id: string; position: { x: number; y: number } }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Idea,
    ApiError,
    { id: string; position: { x: number; y: number } }
  >({
    mutationFn: ({ id, position }) => ideaApi.updatePosition(id, position),
    onSuccess: (updatedIdea) => {
      // Get the current idea to find its session ID
      const currentIdea = queryClient.getQueryData<Idea>(
        IDEA_KEYS.detail(updatedIdea.id)
      );

      // Invalidate session ideas
      if (currentIdea?.sessionId) {
        queryClient.invalidateQueries({
          queryKey: IDEA_KEYS.bySession(currentIdea.sessionId),
        });
      }

      // Update cache with updated idea
      queryClient.setQueryData(IDEA_KEYS.detail(updatedIdea.id), updatedIdea);
    },
    ...options,
  });
};

/**
 * Hook for updating multiple ideas at once
 */
export const useUpdateBulkIdeas = (
  options?: UseMutationOptions<
    Idea[],
    ApiError,
    { ideas: { id: string; data: UpdateIdeaInput }[]; sessionId: string }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Idea[],
    ApiError,
    { ideas: { id: string; data: UpdateIdeaInput }[]; sessionId: string }
  >({
    mutationFn: ({ ideas }) => ideaApi.updateBulk(ideas),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: IDEA_KEYS.bySession(variables.sessionId),
      });

      // Update cache for each idea
      variables.ideas.forEach(({ id }) => {
        queryClient.invalidateQueries({ queryKey: IDEA_KEYS.detail(id) });
      });
    },
    ...options,
  });
};

/**
 * Hook for deleting an idea
 */
export const useDeleteIdea = (
  options?: UseMutationOptions<
    unknown,
    ApiError,
    { id: string; sessionId: string }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, { id: string; sessionId: string }>({
    mutationFn: ({ id }) => ideaApi.delete(id),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: IDEA_KEYS.bySession(variables.sessionId),
      });

      // Remove from cache
      queryClient.removeQueries({ queryKey: IDEA_KEYS.detail(variables.id) });
    },
    ...options,
  });
};
