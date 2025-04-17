import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Session, CreateSessionData, UpdateSessionData } from "../types";

const API_URL = "http://localhost:3001/api";

// Fetch all sessions
export const useGetSessions = () => {
  return useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/sessions`);
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }
      return response.json();
    },
  });
};

// Fetch a single session by ID
export const useGetSession = (id: string) => {
  return useQuery<Session>({
    queryKey: ["sessions", id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/sessions/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

// Create a new session
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSessionData) => {
      const response = await fetch(`${API_URL}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

// Update an existing session
export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSessionData;
    }) => {
      const response = await fetch(`${API_URL}/sessions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update session");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["sessions", variables.id] });
    },
  });
};

// Delete a session
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/sessions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};
