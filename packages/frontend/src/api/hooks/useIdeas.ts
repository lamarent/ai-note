import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Idea, CreateIdeaData, UpdateIdeaData } from "../types";

const API_URL = "http://localhost:3001/api";

// Fetch all ideas
export const useGetIdeas = () => {
  return useQuery<Idea[]>({
    queryKey: ["ideas"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/ideas`);
      if (!response.ok) {
        throw new Error("Failed to fetch ideas");
      }
      return response.json();
    },
  });
};

// Fetch all ideas for a specific session
export const useGetSessionIdeas = (sessionId: string) => {
  return useQuery<Idea[]>({
    queryKey: ["sessions", sessionId, "ideas"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/sessions/${sessionId}/ideas`);
      if (!response.ok) {
        throw new Error("Failed to fetch session ideas");
      }
      return response.json();
    },
    enabled: !!sessionId,
  });
};

// Fetch a single idea by ID
export const useGetIdea = (id: string) => {
  return useQuery<Idea>({
    queryKey: ["ideas", id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/ideas/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch idea");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

// Create a new idea
export const useCreateIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIdeaData) => {
      const response = await fetch(`${API_URL}/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create idea");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({
        queryKey: ["sessions", data.sessionId, "ideas"],
      });
    },
  });
};

// Update an existing idea
export const useUpdateIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateIdeaData }) => {
      const response = await fetch(`${API_URL}/ideas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update idea");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["ideas", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["sessions", data.sessionId, "ideas"],
      });
    },
  });
};

// Delete an idea
export const useDeleteIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/ideas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete idea");
      }

      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      // We need to know the sessionId to invalidate the session-specific query
      // but can't get it from the delete response, so we invalidate all session ideas queries
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};
