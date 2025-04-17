import { API_BASE_URL } from "../constants";

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  success: boolean;
};

/**
 * API configuration and utility functions
 */
export const apiConfig = {
  baseUrl: API_BASE_URL,

  /**
   * Generic fetch wrapper with error handling
   */
  async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      // Set default headers
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        throw new Error(`Expected JSON response but got ${contentType}`);
      }

      const data = await response.json();

      if (!response.ok) {
        // API error with response
        return {
          data: null,
          error:
            data.error || `Error ${response.status}: ${response.statusText}`,
          success: false,
        };
      }

      // Success response
      return {
        data,
        error: null,
        success: true,
      };
    } catch (error) {
      // Network or parsing error
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("API request failed:", errorMessage);

      return {
        data: null,
        error: errorMessage,
        success: false,
      };
    }
  },

  /**
   * GET request wrapper
   */
  async get<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.fetchApi<T>(endpoint, {
      method: "GET",
      ...options,
    });
  },

  /**
   * POST request wrapper
   */
  async post<T>(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.fetchApi<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  },

  /**
   * PUT request wrapper
   */
  async put<T>(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.fetchApi<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  },

  /**
   * DELETE request wrapper
   */
  async delete<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.fetchApi<T>(endpoint, {
      method: "DELETE",
      ...options,
    });
  },
};
