import { useState, useEffect } from "react";
import { getApiKey } from "../utils/localStorage";

/**
 * Hook for accessing and checking API key availability
 *
 * @returns Object containing apiKey and hasApiKey flag
 */
export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    const storedApiKey = getApiKey();
    setApiKey(storedApiKey);
    setHasApiKey(!!storedApiKey);
  }, []);

  return {
    apiKey,
    hasApiKey,
  };
};

export default useApiKey;
