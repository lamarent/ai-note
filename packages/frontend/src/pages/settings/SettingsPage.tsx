import React, { useEffect, useState } from "react";
import {
  getApiKey,
  saveApiKey,
  getProvider,
  saveProvider,
  getModel,
  saveModel,
} from "../../utils/localStorage";
import { useValidateApiKey } from "../../hooks/useAI";

const AI_PROVIDERS = [
  { id: "openrouter", name: "OpenRouter" },
  { id: "openai", name: "OpenAI" },
  { id: "anthropic", name: "Anthropic" },
];

const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [provider, setProvider] = useState<string>(AI_PROVIDERS[0].id);
  const [model, setModel] = useState<string>("");
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
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

  // Load stored settings on mount
  useEffect(() => {
    const storedApiKey = getApiKey();
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    const storedProvider = getProvider();
    if (storedProvider) {
      setProvider(storedProvider);
    }
    const storedModel = getModel();
    if (storedModel) {
      setModel(storedModel);
    }
  }, []);

  // Fetch models whenever provider or API key changes
  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      setModelsError(null);
      const key = apiKey || getApiKey();
      if (!key) {
        setModelsError("API key required to fetch models");
        setLoadingModels(false);
        return;
      }
      let url = "";
      let headers: HeadersInit = {};
      try {
        switch (provider) {
          case "openai":
            url = "https://api.openai.com/v1/models";
            headers = { Authorization: `Bearer ${key}` };
            break;
          case "anthropic":
            url = "https://api.anthropic.com/v1/models";
            headers = { "x-api-key": key };
            break;
          case "openrouter":
            url = "https://openrouter.ai/api/v1/models";
            headers = { Authorization: `Bearer ${key}` };
            break;
        }
        const res = await fetch(url, { headers });
        if (!res.ok) {
          throw new Error(`Failed to fetch models: ${res.statusText}`);
        }
        const data = await res.json();
        let models: string[] = [];
        if (Array.isArray(data.data)) {
          models = data.data.map((m: any) => m.id);
        } else if (Array.isArray(data.models)) {
          models = data.models.map((m: any) => m.id || m.name);
        } else if (Array.isArray(data)) {
          models = data.map((m: any) => m.id);
        }
        setModelsList(models);
      } catch (err: any) {
        setModelsError(err.message || "Error fetching models");
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModels();
  }, [provider, apiKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setValidationError("API key cannot be empty");
      return;
    }

    // Simple format validation
    if (apiKey.length < 10) {
      setValidationError(
        "API key appears to be too short. Please check your key."
      );
      return;
    }

    // Save provider and model
    saveProvider(provider);
    if (model) saveModel(model);

    setIsValidating(true);
    setValidationError(null);

    try {
      validateApiKeyMutation.mutate(apiKey);
    } catch {
      setIsValidating(false);
      setValidationError(
        "An error occurred during validation. The key has been saved anyway."
      );
      saveApiKey(apiKey);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">API Configuration</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">AI Provider</span>
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="select select-bordered w-full"
              >
                {AI_PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {provider === "openrouter" && (
              <div className="text-sm text-gray-500 mt-1">
                Need an OpenRouter API key?{" "}
                <a
                  href="https://openrouter.ai/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  Go to the API keys page
                </a>
                .
              </div>
            )}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">AI Service API Key</span>
              </label>
              <input
                type="password"
                placeholder="Enter your API key"
                className={`input input-bordered w-full ${validationError ? "input-error" : ""}`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Model</span>
              </label>
              {loadingModels ? (
                <div className="loading loading-dots"></div>
              ) : (
                <>
                  <input
                    list="modelOptions"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Start typing model name..."
                    className="input input-bordered w-full"
                  />
                  <datalist
                    id="modelOptions"
                    className="max-h-40 overflow-auto"
                  >
                    {modelsList.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                </>
              )}
              {modelsError && (
                <div className="text-error text-sm mt-1">{modelsError}</div>
              )}
            </div>

            {validationError && (
              <div className="text-error text-sm">{validationError}</div>
            )}

            <div className="flex items-center">
              <button
                type="submit"
                className={`btn btn-primary ${isValidating ? "loading" : ""}`}
                disabled={!apiKey || isValidating}
              >
                {isValidating ? "Validating..." : "Save Settings"}
              </button>
              {isSaved && (
                <span className="ml-4 text-success">
                  Settings saved successfully!
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
