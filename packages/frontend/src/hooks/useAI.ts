import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiConfig, ApiResponse, ApiError } from "../services/api/config";
import { Idea } from "@ai-brainstorm/types";

// API Endpoints
const AI_ENDPOINT = "/api/ai";

// API client for AI operations
const aiApi = {
  // Generate ideas based on a prompt
  generateIdeas: (payload: {
    sessionId: string;
    prompt: string;
    context?: string;
    technique?: string;
    count?: number;
  }) => {
    return apiConfig.post<Idea[]>(`${AI_ENDPOINT}/generate`, payload);
  },

  // Expand on a specific idea
  expandIdea: (payload: {
    ideaId: string;
    sessionId: string;
    depth?: number;
  }) => {
    return apiConfig.post<Idea[]>(`${AI_ENDPOINT}/expand`, payload);
  },

  // Get alternative perspectives on an idea
  getAlternativePerspectives: (payload: {
    ideaId: string;
    sessionId: string;
    count?: number;
  }) => {
    return apiConfig.post<Idea[]>(`${AI_ENDPOINT}/perspectives`, payload);
  },

  // Refine or improve an idea
  refineIdea: (payload: {
    ideaId: string;
    sessionId: string;
    instructions: string;
  }) => {
    return apiConfig.post<Idea>(`${AI_ENDPOINT}/refine`, payload);
  },
};

// Helper function to handle API responses
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

// Hook for generating new ideas
export const useGenerateIdeas = (
  options?: UseMutationOptions<
    Idea[],
    ApiError,
    {
      sessionId: string;
      prompt: string;
      context?: string;
      technique?: string;
      count?: number;
    }
  >
) => {
  return useMutation<
    Idea[],
    ApiError,
    {
      sessionId: string;
      prompt: string;
      context?: string;
      technique?: string;
      count?: number;
    }
  >({
    mutationFn: (payload) => handleApiResponse(aiApi.generateIdeas(payload)),
    ...options,
  });
};

// Hook for expanding an existing idea
export const useExpandIdea = (
  options?: UseMutationOptions<
    Idea[],
    ApiError,
    {
      ideaId: string;
      sessionId: string;
      depth?: number;
    }
  >
) => {
  return useMutation<
    Idea[],
    ApiError,
    {
      ideaId: string;
      sessionId: string;
      depth?: number;
    }
  >({
    mutationFn: (payload) => handleApiResponse(aiApi.expandIdea(payload)),
    ...options,
  });
};

// Hook for getting alternative perspectives on an idea
export const useAlternativePerspectives = (
  options?: UseMutationOptions<
    Idea[],
    ApiError,
    {
      ideaId: string;
      sessionId: string;
      count?: number;
    }
  >
) => {
  return useMutation<
    Idea[],
    ApiError,
    {
      ideaId: string;
      sessionId: string;
      count?: number;
    }
  >({
    mutationFn: (payload) =>
      handleApiResponse(aiApi.getAlternativePerspectives(payload)),
    ...options,
  });
};

// Hook for refining or improving an idea
export const useRefineIdea = (
  options?: UseMutationOptions<
    Idea,
    ApiError,
    {
      ideaId: string;
      sessionId: string;
      instructions: string;
    }
  >
) => {
  return useMutation<
    Idea,
    ApiError,
    {
      ideaId: string;
      sessionId: string;
      instructions: string;
    }
  >({
    mutationFn: (payload) => handleApiResponse(aiApi.refineIdea(payload)),
    ...options,
  });
};
