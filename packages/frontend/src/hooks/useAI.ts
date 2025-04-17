import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse, ApiError } from "../services/api/config";
import { Idea } from "@ai-brainstorm/types";
import { aiApi } from "../services/api/aiApi";
import { useApiKey } from "./useApiKey";

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

// Hook for validating API key
export const useValidateApiKey = (
  options?: UseMutationOptions<{ valid: boolean }, ApiError, string>
) => {
  return useMutation<{ valid: boolean }, ApiError, string>({
    mutationFn: (apiKey) => handleApiResponse(aiApi.validateApiKey(apiKey)),
    ...options,
  });
};

// Hook for checking if the user has set an API key
export const useCheckApiKey = () => {
  const { hasApiKey } = useApiKey();
  return { hasApiKey };
};

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
  const { hasApiKey } = useCheckApiKey();

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
    mutationFn: (payload) => {
      if (!hasApiKey) {
        throw new ApiError(
          "API key is required. Please set it in the settings page.",
          400
        );
      }
      return handleApiResponse(aiApi.generateIdeas(payload));
    },
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
      idea: string;
      depth?: number;
    }
  >
) => {
  const { hasApiKey } = useCheckApiKey();

  return useMutation<
    Idea[],
    ApiError,
    {
      ideaId: string;
      sessionId: string;
      idea: string;
      depth?: number;
    }
  >({
    mutationFn: (payload) => {
      if (!hasApiKey) {
        throw new ApiError(
          "API key is required. Please set it in the settings page.",
          400
        );
      }
      return handleApiResponse(aiApi.expandIdea(payload));
    },
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
      idea: string;
      count?: number;
    }
  >
) => {
  const { hasApiKey } = useCheckApiKey();

  return useMutation<
    Idea[],
    ApiError,
    {
      ideaId: string;
      sessionId: string;
      idea: string;
      count?: number;
    }
  >({
    mutationFn: (payload) => {
      if (!hasApiKey) {
        throw new ApiError(
          "API key is required. Please set it in the settings page.",
          400
        );
      }
      return handleApiResponse(aiApi.getAlternativePerspectives(payload));
    },
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
      idea: string;
      instructions: string;
    }
  >
) => {
  const { hasApiKey } = useCheckApiKey();

  return useMutation<
    Idea,
    ApiError,
    {
      ideaId: string;
      sessionId: string;
      idea: string;
      instructions: string;
    }
  >({
    mutationFn: (payload) => {
      if (!hasApiKey) {
        throw new ApiError(
          "API key is required. Please set it in the settings page.",
          400
        );
      }
      return handleApiResponse(aiApi.refineIdea(payload));
    },
    ...options,
  });
};
