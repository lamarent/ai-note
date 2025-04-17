import {
  API_BASE_URL,
  DEFAULT_HEADERS,
  DEFAULT_TIMEOUT,
  ERROR_MESSAGES,
  ApiError,
  isNetworkError,
} from "./config";

interface RequestOptions extends RequestInit {
  timeout?: number;
  params?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * Handles API response and transforms it appropriately
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // If no content, return empty object
  if (response.status === 204) {
    return {} as T;
  }

  // Try to parse as JSON, fallback to text if that fails
  const contentType = response.headers.get("content-type");
  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // If response is not ok, throw an error
  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      response.statusText ||
      ERROR_MESSAGES.DEFAULT;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

/**
 * Creates a URL with query parameters
 */
function createUrl(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(endpoint, API_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Base fetch function with timeout and error handling
 */
async function fetchWithTimeout<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(ERROR_MESSAGES.TIMEOUT, 408);
    }

    if (isNetworkError(error)) {
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * API client for making HTTP requests
 */
export const apiClient = {
  /**
   * Sends a GET request
   */
  get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...rest } = options;
    const url = createUrl(endpoint, params);

    return fetchWithTimeout<T>(url, {
      method: "GET",
      headers: { ...DEFAULT_HEADERS, ...headers },
      ...rest,
    });
  },

  /**
   * Sends a POST request
   */
  post<T>(
    endpoint: string,
    data: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const { headers, params, ...rest } = options;
    const url = createUrl(endpoint, params);

    return fetchWithTimeout<T>(url, {
      method: "POST",
      headers: { ...DEFAULT_HEADERS, ...headers },
      body: JSON.stringify(data),
      ...rest,
    });
  },

  /**
   * Sends a PUT request
   */
  put<T>(
    endpoint: string,
    data: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const { headers, params, ...rest } = options;
    const url = createUrl(endpoint, params);

    return fetchWithTimeout<T>(url, {
      method: "PUT",
      headers: { ...DEFAULT_HEADERS, ...headers },
      body: JSON.stringify(data),
      ...rest,
    });
  },

  /**
   * Sends a PATCH request
   */
  patch<T>(
    endpoint: string,
    data: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const { headers, params, ...rest } = options;
    const url = createUrl(endpoint, params);

    return fetchWithTimeout<T>(url, {
      method: "PATCH",
      headers: { ...DEFAULT_HEADERS, ...headers },
      body: JSON.stringify(data),
      ...rest,
    });
  },

  /**
   * Sends a DELETE request
   */
  delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { headers, params, ...rest } = options;
    const url = createUrl(endpoint, params);

    return fetchWithTimeout<T>(url, {
      method: "DELETE",
      headers: { ...DEFAULT_HEADERS, ...headers },
      ...rest,
    });
  },
};
