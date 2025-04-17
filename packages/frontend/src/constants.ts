/**
 * Application-wide constants
 */

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8787/api";

// Feature Flags
export const ENABLE_WEBSOCKETS =
  import.meta.env.VITE_ENABLE_WEBSOCKETS === "true";

// UI Constants
export const DEFAULT_ANIMATION_DURATION = 300; // ms
export const MAX_IDEAS_PER_SESSION = 100;
export const DEFAULT_PAGINATION_LIMIT = 20;
