import { apiConfig, ApiResponse } from "./config";
import { Idea } from "@ai-brainstorm/types";
import { getApiKey } from "../../utils/localStorage";

// AI API endpoint
const AI_ENDPOINT = "/api/ai";

/**
 * Helper to create headers with API key
 */
const getAuthHeaders = (): HeadersInit => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key is required. Please set it in the settings page.");
  }
  return {
    "X-API-Key": apiKey,
  };
};

/**
 * AI Service API
 */
export const aiApi = {
  /**
   * Generate ideas based on a prompt
   */
  generateIdeas: (payload: {
    sessionId: string;
    prompt: string;
    context?: string;
    technique?: string;
    count?: number;
  }): Promise<ApiResponse<Idea[]>> => {
    return apiConfig.post<Idea[]>(`${AI_ENDPOINT}/generate`, payload, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Expand on a specific idea
   */
  expandIdea: (payload: {
    ideaId: string;
    sessionId: string;
    idea: string;
    depth?: number;
  }): Promise<ApiResponse<Idea[]>> => {
    return apiConfig.post<Idea[]>(`${AI_ENDPOINT}/expand`, payload, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Get alternative perspectives on an idea
   */
  getAlternativePerspectives: (payload: {
    ideaId: string;
    sessionId: string;
    idea: string;
    count?: number;
  }): Promise<ApiResponse<Idea[]>> => {
    return apiConfig.post<Idea[]>(`${AI_ENDPOINT}/perspectives`, payload, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Refine or improve an idea
   */
  refineIdea: (payload: {
    ideaId: string;
    sessionId: string;
    idea: string;
    instructions: string;
  }): Promise<ApiResponse<Idea>> => {
    return apiConfig.post<Idea>(`${AI_ENDPOINT}/refine`, payload, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Check if API key is valid
   */
  validateApiKey: (
    apiKey: string
  ): Promise<ApiResponse<{ valid: boolean }>> => {
    return apiConfig.post<{ valid: boolean }>(
      `${AI_ENDPOINT}/validate-key`,
      {},
      {
        headers: { "X-API-Key": apiKey },
      }
    );
  },
};

export default aiApi;
