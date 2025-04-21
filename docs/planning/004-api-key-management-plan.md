# 004 - API Key Management Plan

## Context

The current `SettingsPage` supports a single API key, provider, and model stored in local storage. We need to extend it to manage multiple API keys, each associated with its provider and model.

## Goals

- Provide a new "API Keys" tab in the Settings page alongside the existing "General Settings".
- Allow users to add, edit, and remove multiple API key entries.
- Each entry should capture:
  - Provider
  - Model
  - API Key (masked for display)
- Persist entries in `localStorage` with a clear schema.

## Scope

- **Data Layer**: Update `utils/localStorage.ts` to handle an array of entries instead of single values.
- **Type Definitions**: Define a new `ApiKeyEntry` type.
- **UI Update**: Modify `SettingsPage.tsx`:
  - Add tab navigation.
  - Implement the "API Keys" tab:
    - List existing entries with edit and delete actions.
    - Form to create a new entry.
- **Persistence**: Store entries under a new key in `localStorage`.
- **Documentation**: Update docs to reflect new storage schema and UI changes.

## Tasks

1. **Define `ApiKeyEntry` type**
   - Create `src/types/apiKey.ts`.
2. **Extend `localStorage` utils**
   - Add:
     - `getApiKeyEntries(): ApiKeyEntry[]`
     - `saveApiKeyEntries(entries: ApiKeyEntry[]): void`
     - `addApiKeyEntry(entry: ApiKeyEntry): void`
     - `removeApiKeyEntry(id: string): void`
     - `updateApiKeyEntry(entry: ApiKeyEntry): void`
3. **UI Changes**
   - Modify `SettingsPage.tsx`:
     - Introduce tab control for "General Settings" and "API Keys".
     - Build list UI and form in the new tab.
4. **Testing & Validation**
   - Ensure entries persist and reload correctly.
   - Handle validation for missing or invalid input.
5. **Documentation**
   - Update `API-Design.md` and `UI-Design.md` as needed.

## Next Steps

1. Implement data layer changes in `utils/localStorage.ts`.
2. Scaffold `ApiKeyEntry` type.
3. Update `SettingsPage.tsx` with tab navigation and new UI skeleton.
