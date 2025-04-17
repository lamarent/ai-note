// Local storage keys
const STORAGE_KEYS = {
  API_KEY: "ai-brainstorm-api-key",
};

/**
 * Save API key to local storage
 * @param apiKey - The API key to save
 */
export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
};

/**
 * Get API key from local storage
 * @returns The stored API key or null if not found
 */
export const getApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.API_KEY);
};

/**
 * Remove API key from local storage
 */
export const removeApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
};

export default {
  saveApiKey,
  getApiKey,
  removeApiKey,
};
