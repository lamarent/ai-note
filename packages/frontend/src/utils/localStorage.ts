import type { ApiKeyEntry } from "../types/apiKey";

// Local storage keys
const STORAGE_KEYS = {
  API_KEY: "ai-brainstorm-api-key",
  PROVIDER: "ai-brainstorm-ai-provider",
  MODEL: "ai-brainstorm-ai-model",
  API_KEY_ENTRIES: "ai-brainstorm-api-key-entries",
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

/**
 * Save AI provider to local storage
 * @param provider - The AI provider to save (e.g., "openai", "anthropic", "openrouter")
 */
export const saveProvider = (provider: string): void => {
  localStorage.setItem(STORAGE_KEYS.PROVIDER, provider);
};

/**
 * Get AI provider from local storage
 * @returns The stored AI provider or null if not found
 */
export const getProvider = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.PROVIDER);
};

/**
 * Save AI model to local storage
 * @param model - The AI model to save
 */
export const saveModel = (model: string): void => {
  localStorage.setItem(STORAGE_KEYS.MODEL, model);
};

/**
 * Get AI model from local storage
 * @returns The stored AI model or null if not found
 */
export const getModel = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.MODEL);
};

export const getApiKeyEntries = (): ApiKeyEntry[] => {
  const entries = localStorage.getItem(STORAGE_KEYS.API_KEY_ENTRIES);
  if (!entries) return [];
  try {
    return JSON.parse(entries);
  } catch {
    return [];
  }
};

export const saveApiKeyEntries = (entries: ApiKeyEntry[]): void => {
  localStorage.setItem(STORAGE_KEYS.API_KEY_ENTRIES, JSON.stringify(entries));
};

export const addApiKeyEntry = (entry: ApiKeyEntry): void => {
  const entries = getApiKeyEntries();
  entries.push(entry);
  saveApiKeyEntries(entries);
};

export const removeApiKeyEntry = (id: string): void => {
  const entries = getApiKeyEntries().filter((e) => e.id !== id);
  saveApiKeyEntries(entries);
};

export const updateApiKeyEntry = (entry: ApiKeyEntry): void => {
  const entries = getApiKeyEntries().map((e) =>
    e.id === entry.id ? entry : e
  );
  saveApiKeyEntries(entries);
};

export default {
  saveApiKey,
  getApiKey,
  removeApiKey,
  saveProvider,
  getProvider,
  saveModel,
  getModel,
  getApiKeyEntries,
  saveApiKeyEntries,
  addApiKeyEntry,
  removeApiKeyEntry,
  updateApiKeyEntry,
};
