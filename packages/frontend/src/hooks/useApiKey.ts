import { useState, useEffect } from "react";
import {
  getActiveEntryId,
  getApiKeyEntries,
  removeActiveEntryId,
} from "../utils/localStorage";

/**
 * Hook for accessing and checking API key availability
 *
 * @returns Object containing apiKey and hasApiKey flag
 */
export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    const updateKey = () => {
      const activeEntryId = getActiveEntryId();
      const entries = getApiKeyEntries();
      const entry = entries.find((e) => e.id === activeEntryId) || null;
      if (activeEntryId && !entry) {
        removeActiveEntryId();
      }
      setApiKey(entry ? entry.key : null);
      setHasApiKey(!!entry);
    };
    // initial load
    updateKey();
    // subscribe to storage change events
    window.addEventListener("activeEntryIdChanged", updateKey);
    window.addEventListener("apiKeyEntriesChanged", updateKey);
    return () => {
      window.removeEventListener("activeEntryIdChanged", updateKey);
      window.removeEventListener("apiKeyEntriesChanged", updateKey);
    };
  }, []);

  return {
    apiKey,
    hasApiKey,
  };
};

export default useApiKey;
