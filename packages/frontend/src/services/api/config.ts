/**
 * API Configuration
 */

// Base URL for API calls
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8787"; // Use /api suffix from constants.ts

// Default request timeout in milliseconds
export const DEFAULT_TIMEOUT = 20000;

// Default headers for all requests
export const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * HTTP Status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Common API Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  TIMEOUT: "Request timed out. Please try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "You do not have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "An error occurred on the server. Please try again later.",
  DEFAULT: "An unexpected error occurred. Please try again.",
};

/**
 * API Response interface
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  message?: string;
  success: boolean;
}

/**
 * API Error class for consistent error handling
 */
export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }

  /**
   * Creates an ApiError from an unknown error
   */
  static from(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof Error) {
      return new ApiError(error.message, 0);
    }

    return new ApiError(String(error), 0);
  }
}

/**
 * Determine if the error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  return (
    error instanceof Error &&
    (error.message.includes("Network Error") ||
      error.message.includes("Failed to fetch") ||
      error.message.includes("Network request failed"))
  );
};

/**
 * API configuration and utility functions
 */
export const apiConfig = {
  baseUrl: API_BASE_URL,

  /**
   * Generic fetch wrapper with error handling, timeout, and ApiResponse structure.
   */
  async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    const url = `${this.baseUrl}${endpoint}`;
    const mergedOptions: RequestInit = {
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, mergedOptions);
      clearTimeout(timeoutId);

      let responseData: any = null;
      const contentType = response.headers.get("content-type");

      // Try to parse JSON only if the content type indicates it
      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = await response.json();
        } catch /* (parseError) */ {
          // Removed unused parseError
          // Handle cases where parsing fails despite content type header
          return {
            success: false,
            status: response.status, // Still report original status
            error: "Failed to parse JSON response",
            message: responseData?.error || ERROR_MESSAGES.DEFAULT,
          };
        }
      }
      // Handle cases like 204 No Content or non-JSON responses
      else if (response.ok && response.status !== HTTP_STATUS.NO_CONTENT) {
        // Maybe log a warning or handle text response if expected
        // responseData = await response.text();
      }

      if (!response.ok) {
        const errorPayload = responseData || {}; // Use parsed JSON error if available
        const errorMessage =
          errorPayload.error || errorPayload.message || response.statusText;

        return {
          success: false,
          status: response.status,
          error: errorMessage,
          message: errorMessage.error || errorMessage || ERROR_MESSAGES.DEFAULT, // Prefer server message
          data: responseData, // Include error data if present
        };
      }

      // Success case
      return {
        success: true,
        status: response.status,
        data: responseData as T, // Assume successful response data matches T
        message: responseData?.message, // Include success message if present
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        return {
          success: false,
          status: 0, // Or a specific status code for timeout
          error: ERROR_MESSAGES.TIMEOUT,
          message: ERROR_MESSAGES.TIMEOUT,
        };
      } else if (isNetworkError(error)) {
        return {
          success: false,
          status: 0, // Or a specific status code for network error
          error: ERROR_MESSAGES.NETWORK_ERROR,
          message: ERROR_MESSAGES.NETWORK_ERROR,
        };
      } else {
        // Other unexpected errors
        const err = ApiError.from(error);
        return {
          success: false,
          status: err.status || 0,
          error: err.message || ERROR_MESSAGES.DEFAULT,
          message: err.message || ERROR_MESSAGES.DEFAULT,
        };
      }
    }
  },

  async get<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.fetchApi<T>(endpoint, {
      method: "GET",
      ...options,
    });
  },

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

  async patch<T>(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.fetchApi<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    });
  },

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
