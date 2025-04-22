import React, { useEffect, useState } from "react";
import {
  getApiKeyEntries,
  getActiveEntryId,
  saveActiveEntryId,
  removeActiveEntryId,
} from "../../utils/localStorage";
import type { ApiKeyEntry } from "../../types/apiKey";
import ApiKeysTab from "./ApiKeysTab";

const AI_PROVIDERS = []; // no longer used in this component

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"general" | "apikeys">("general");
  const [entries, setEntries] = useState<ApiKeyEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  // Load entries and active entry ID on mount
  useEffect(() => {
    setEntries(getApiKeyEntries());
    setActiveEntryId(getActiveEntryId());
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="tabs mb-4">
            <a
              className={`tab tab-lifted ${activeTab === "general" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              General Settings
            </a>
            <a
              className={`tab tab-lifted ${activeTab === "apikeys" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("apikeys")}
            >
              API Keys
            </a>
          </div>
          {activeTab === "general" ? (
            <>
              <h2 className="card-title">Default API Key</h2>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Select Default API Key</span>
                </label>
                <select
                  value={activeEntryId || ""}
                  onFocus={() => {
                    const newEntries = getApiKeyEntries();
                    setEntries(newEntries);
                    const current = getActiveEntryId();
                    if (!current || !newEntries.some((e) => e.id === current)) {
                      removeActiveEntryId();
                      setActiveEntryId(null);
                    } else {
                      setActiveEntryId(current);
                    }
                  }}
                  onChange={(e) => {
                    saveActiveEntryId(e.target.value);
                    setActiveEntryId(e.target.value);
                  }}
                  className="select select-bordered w-full"
                >
                  <option value="">-- Select Default API Key --</option>
                  {entries.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.provider} | {entry.model} | ****
                      {entry.key.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <ApiKeysTab />
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
