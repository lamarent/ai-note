/**
 * API Configuration
 */

// Base URL for API calls
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

// Default request timeout in milliseconds
export const DEFAULT_TIMEOUT = 10000;

// Default headers for all requests
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
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
