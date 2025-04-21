import React, { useEffect, useState } from "react";
import type { ApiKeyEntry } from "../../types/apiKey";
import {
  getApiKeyEntries,
  addApiKeyEntry,
  removeApiKeyEntry,
  updateApiKeyEntry,
} from "../../utils/localStorage";

const AI_PROVIDERS = [
  { id: "openrouter", name: "OpenRouter" },
  { id: "openai", name: "OpenAI" },
  { id: "anthropic", name: "Anthropic" },
];

const ApiKeysTab: React.FC = () => {
  const [entries, setEntries] = useState<ApiKeyEntry[]>([]);
  const [entryProvider, setEntryProvider] = useState<string>(
    AI_PROVIDERS[0].id
  );
  const [entryKey, setEntryKey] = useState<string>("");
  const [entryModel, setEntryModel] = useState<string>("");
  const [entryModelsList, setEntryModelsList] = useState<string[]>([]);
  const [entryLoadingModels, setEntryLoadingModels] = useState(false);
  const [entryModelsError, setEntryModelsError] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<ApiKeyEntry | null>(null);

  useEffect(() => {
    setEntries(getApiKeyEntries());
  }, []);

  useEffect(() => {
    const fetchModelsForEntry = async () => {
      setEntryLoadingModels(true);
      setEntryModelsError(null);
      if (!entryKey) {
        setEntryModelsError("API key required to fetch models");
        setEntryLoadingModels(false);
        return;
      }
      let url = "";
      let headers: HeadersInit = {};
      switch (entryProvider) {
        case "openai":
          url = "https://api.openai.com/v1/models";
          headers = { Authorization: `Bearer ${entryKey}` };
          break;
        case "anthropic":
          url = "https://api.anthropic.com/v1/models";
          headers = { "x-api-key": entryKey };
          break;
        case "openrouter":
          url = "https://openrouter.ai/api/v1/models";
          headers = { Authorization: `Bearer ${entryKey}` };
          break;
      }
      try {
        const res = await fetch(url, { headers });
        if (!res.ok)
          throw new Error(`Failed to fetch models: ${res.statusText}`);
        const data = await res.json();
        let models: string[] = [];
        if (Array.isArray(data.data)) {
          models = data.data.map((m: any) => m.id);
        } else if (Array.isArray(data.models)) {
          models = data.models.map((m: any) => m.id || m.name);
        } else if (Array.isArray(data)) {
          models = data.map((m: any) => m.id);
        }
        setEntryModelsList(models);
      } catch (err: any) {
        setEntryModelsError(err.message || "Error fetching models");
      } finally {
        setEntryLoadingModels(false);
      }
    };
    fetchModelsForEntry();
  }, [entryProvider, entryKey]);

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id =
      editingEntry?.id || crypto.randomUUID?.() || Date.now().toString();
    const createdAt = editingEntry?.createdAt || new Date().toISOString();
    const newEntry: ApiKeyEntry = {
      id,
      provider: entryProvider,
      model: entryModel,
      key: entryKey,
      createdAt,
    };
    if (editingEntry) {
      updateApiKeyEntry(newEntry);
      setEntries((prev) => prev.map((en) => (en.id === id ? newEntry : en)));
    } else {
      addApiKeyEntry(newEntry);
      setEntries((prev) => [...prev, newEntry]);
    }
    setEditingEntry(null);
    setEntryProvider(AI_PROVIDERS[0].id);
    setEntryKey("");
    setEntryModel("");
  };

  const handleEditEntry = (entry: ApiKeyEntry) => {
    setEditingEntry(entry);
    setEntryProvider(entry.provider);
    setEntryKey(entry.key);
    setEntryModel(entry.model);
  };

  const handleDeleteEntry = (id: string) => {
    removeApiKeyEntry(id);
    setEntries((prev) => prev.filter((en) => en.id !== id));
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setEntryProvider(AI_PROVIDERS[0].id);
    setEntryKey("");
    setEntryModel("");
  };

  return (
    <>
      <h2 className="card-title">API Key Entries</h2>
      <ul>
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex justify-between items-center border p-2 rounded mb-2"
          >
            <div>
              <div>
                <strong>Provider:</strong> {entry.provider}
              </div>
              <div>
                <strong>Model:</strong> {entry.model}
              </div>
              <div>
                <strong>Key:</strong> ****{entry.key.slice(-4)}
              </div>
              <div>
                <small>{new Date(entry.createdAt).toLocaleString()}</small>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => handleEditEntry(entry)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-sm btn-error"
                onClick={() => handleDeleteEntry(entry.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleEntrySubmit} className="space-y-4 mt-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">API Provider</span>
          </label>
          <select
            value={entryProvider}
            onChange={(e) => setEntryProvider(e.target.value)}
            className="select select-bordered w-full"
          >
            {AI_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">API Key</span>
          </label>
          <input
            type="password"
            placeholder="Enter your API key"
            className={`input input-bordered w-full ${entryModelsError ? "input-error" : ""}`}
            value={entryKey}
            onChange={(e) => setEntryKey(e.target.value)}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Model</span>
          </label>
          {entryLoadingModels ? (
            <div className="loading loading-dots"></div>
          ) : (
            <>
              <input
                list="entryModelOptions"
                value={entryModel}
                onChange={(e) => setEntryModel(e.target.value)}
                placeholder="Start typing model name..."
                className="input input-bordered w-full"
              />
              <datalist
                id="entryModelOptions"
                className="max-h-40 overflow-auto"
              >
                {entryModelsList.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </>
          )}
          {entryModelsError && (
            <div className="text-error text-sm mt-1">{entryModelsError}</div>
          )}
        </div>
        <div className="flex items-center">
          <button type="submit" className="btn btn-primary">
            {editingEntry ? "Update Entry" : "Add Entry"}
          </button>
          {editingEntry && (
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default ApiKeysTab;
