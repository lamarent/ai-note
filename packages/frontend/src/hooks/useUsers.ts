import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiConfig, ApiResponse } from "../api/config";

// Moved types from userApi.ts - IMPORTANT: Export User
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  avatar?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  avatar?: string;
}
// End of moved types

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
      const response = await apiConfig.get<User[]>("/users");
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
      const response = await apiConfig.get<User>(`/users/${id}`);
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
      const response = await apiConfig.post<User>("/users", data);
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
      const response = await apiConfig.put<User>(`/users/${id}`, data);
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
      const response = await apiConfig.delete<{ success: boolean }>(
        `/users/${id}`
      );
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
