import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi, CreateUserData, UpdateUserData, User } from "../api";

// Query keys
export const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...USER_KEYS.lists(), { filters }] as const,
  details: () => [...USER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USER_KEYS.details(), id] as const,
};

/**
 * Hook to fetch all users
 */
export function useUsers() {
  return useQuery({
    queryKey: USER_KEYS.lists(),
    queryFn: async () => {
      const response = await userApi.getUsers();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch users");
      }
      return response.data as User[];
    },
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: async () => {
      const response = await userApi.getUser(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch user");
      }
      return response.data as User;
    },
    enabled: !!id, // Only run query if ID is provided
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await userApi.createUser(data);
      if (!response.success) {
        throw new Error(response.error || "Failed to create user");
      }
      return response.data as User;
    },
    onSuccess: () => {
      // Invalidate users list query to refetch
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      const response = await userApi.updateUser(id, data);
      if (!response.success) {
        throw new Error(response.error || "Failed to update user");
      }
      return response.data as User;
    },
    onSuccess: (updatedUser) => {
      // Update the user in the cache
      queryClient.setQueryData(USER_KEYS.detail(id), updatedUser);
      // Invalidate the list to refetch
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await userApi.deleteUser(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete user");
      }
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove the user from the cache
      queryClient.removeQueries({ queryKey: USER_KEYS.detail(deletedId) });
      // Invalidate the list to refetch
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
  });
}
