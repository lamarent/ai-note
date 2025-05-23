import { apiConfig, ApiResponse } from "./config";
import type { FetchOptions } from "./config";
import { Idea } from "@ai-brainstorm/types";
import { getActiveEntryId, getApiKeyEntries } from "../../utils/localStorage";

// AI API endpoint
const AI_ENDPOINT = "/api/ai";

/**
 * Helper to create headers with API key and AI settings
 */
const getAuthHeaders = (): HeadersInit => {
  const activeEntryId = getActiveEntryId();
  const entries = getApiKeyEntries();
  const entry = entries.find((e) => e.id === activeEntryId);
  if (!entry) {
    throw new Error(
      "API key entry is required. Please select one in the settings page."
    );
  }
  const { key: apiKey, provider, model } = entry;
  const headers: Record<string, string> = {
    "X-API-Key": apiKey,
  };
  if (provider) {
    headers["X-AI-Provider"] = provider;
  }
  if (model) {
    headers["X-AI-Model"] = model;
  }
  return headers;
};

/**
 * AI Service API
 */
export const aiApi = {
  /**
   * Generate ideas based on a prompt, with optional custom timeout
   */
  generateIdeas: (
    payload: {
      sessionId: string;
      prompt: string;
      context?: string;
      technique?: string;
      count?: number;
    },
    // timeout in milliseconds (overrides default)
    timeout = 50000
  ): Promise<ApiResponse<Idea[]>> => {
    // Build options with optional timeout
    const options: FetchOptions = { headers: getAuthHeaders(), timeout };
    return apiConfig.post<Idea[]>(`${AI_ENDPOINT}/generate`, payload, options);
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
