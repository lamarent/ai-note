import React, { useEffect, useState } from "react";
import { getApiKey, saveApiKey } from "../../utils/localStorage";
import { useValidateApiKey } from "../../hooks/useAI";

const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isSaved, setIsSaved] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateApiKeyMutation = useValidateApiKey({
    onSuccess: (data) => {
      setIsValidating(false);
      if (data.valid) {
        saveApiKey(apiKey);
        setIsSaved(true);
        setValidationError(null);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        setValidationError(
          "The API key is invalid. Please check your key and try again."
        );
      }
    },
    onError: (error) => {
      setIsValidating(false);
      setValidationError(
        error.message || "Failed to validate API key. Please try again."
      );
    },
  });

  useEffect(() => {
    const storedApiKey = getApiKey();
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setValidationError("API key cannot be empty");
      return;
    }

    // Simple format validation (can be enhanced based on the actual API key format)
    if (apiKey.length < 10) {
      setValidationError(
        "API key appears to be too short. Please check your key."
      );
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    // Try to validate the API key
    try {
      validateApiKeyMutation.mutate(apiKey);
    } catch (err) {
      setIsValidating(false);
      setValidationError(
        "An error occurred during validation. The key has been saved anyway."
      );

      // Save the key even if validation fails, since the validation endpoint might not be available in all environments
      saveApiKey(apiKey);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    if (isSaved) setIsSaved(false);
    if (validationError) setValidationError(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">API Configuration</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">AI Service API Key</span>
              </label>
              <input
                type="password"
                placeholder="Enter your API key"
                className={`input input-bordered w-full ${validationError ? "input-error" : ""}`}
                value={apiKey}
                onChange={handleChange}
              />
              <label className="label">
                <span className="label-text-alt">
                  Your API key is stored locally in your browser and never sent
                  to our servers.
                </span>
              </label>
              {validationError && (
                <div className="text-error text-sm mt-1">{validationError}</div>
              )}
            </div>

            <div className="flex items-center mt-4">
              <button
                type="submit"
                className={`btn btn-primary ${isValidating ? "loading" : ""}`}
                disabled={!apiKey || isValidating}
              >
                {isValidating ? "Validating..." : "Save API Key"}
              </button>
              {isSaved && (
                <span className="ml-4 text-success">
                  API key saved successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
