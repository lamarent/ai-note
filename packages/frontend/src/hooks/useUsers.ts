import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { ApiResponse, ApiError } from "../services/api/config";
import { userApi } from "../services/api/userApi";
import { User, CreateUser, UpdateUser } from "@ai-brainstorm/types";

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
const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  details: () => [...USER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USER_KEYS.details(), id] as const,
};

// --- React Query Hooks --- //

export const useGetUsers = (
  options?: Omit<UseQueryOptions<User[], ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery<User[], ApiError>({
    queryKey: USER_KEYS.lists(),
    queryFn: () => handleApiResponse(userApi.getAll()),
    ...options,
  });
};

export const useGetUserById = (
  id: string,
  options?: Omit<
    UseQueryOptions<User, ApiError>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  return useQuery<User, ApiError>({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => handleApiResponse(userApi.getById(id)),
    enabled: !!id,
    ...options,
  });
};

export const useCreateUser = (
  options?: UseMutationOptions<User, ApiError, CreateUser>
) => {
  const queryClient = useQueryClient();
  return useMutation<User, ApiError, CreateUser>({
    mutationFn: (data: CreateUser) => handleApiResponse(userApi.create(data)),
    onSuccess: (newUser, variables, context) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      queryClient.setQueryData(USER_KEYS.detail(newUser.id), newUser);
      options?.onSuccess?.(newUser, variables, context);
    },
    ...options,
  });
};

export const useUpdateUser = (
  options?: UseMutationOptions<User, ApiError, { id: string; data: UpdateUser }>
) => {
  const queryClient = useQueryClient();
  return useMutation<User, ApiError, { id: string; data: UpdateUser }>({
    mutationFn: ({ id, data }) => handleApiResponse(userApi.update(id, data)),
    onSuccess: (updatedUser, variables, context) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: USER_KEYS.detail(variables.id),
      });
      queryClient.setQueryData(USER_KEYS.detail(variables.id), updatedUser);
      options?.onSuccess?.(updatedUser, variables, context);
    },
    ...options,
  });
};

export const useDeleteUser = (
  options?: UseMutationOptions<void, ApiError, string>
) => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: (id: string) => handleApiResponse(userApi.delete(id)),
    onSuccess: (data, id, context) => {
      queryClient.removeQueries({ queryKey: USER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      options?.onSuccess?.(data, id, context);
    },
    ...options,
  });
};
