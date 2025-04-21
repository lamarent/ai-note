# 005 — Migration Plan: Replace General Settings with Managed Entries

## Context

So far we have two parallel mechanisms:

- **General Settings tab**: a single-key form (`getApiKey`, `saveApiKey`, `getProvider`, `getModel`)
- **API Keys tab**: fully-managed list of `ApiKeyEntry` objects

The rest of the app still reads from the old single-key APIs. We need to migrate to using our new entries exclusively and retire the legacy API.

## Goals

1. Replace the General Settings form with a dropdown selector of existing entries (no inline key/model fields).
2. Update all consumers (hooks, fetchers, components) to read the active entry via a new `getActiveEntryId` + `getApiKeyEntries` combo.
3. Remove the old single-key localStorage APIs and corresponding UI blocks.
4. Clean up related documentation, types, and tests.

## Scope

- **Data Layer**

  - Create `STORAGE_KEYS.ACTIVE_ENTRY_ID`
  - Implement:
    - `getActiveEntryId(): string | null`
    - `saveActiveEntryId(id: string): void`
  - Deprecate/remove:
    - `getApiKey`, `saveApiKey`, `getProvider`, `saveProvider`, `getModel`, `saveModel`

- **UI**

  - In `SettingsPage` General tab:
    - Replace form with `<select>` sourcing `entries` + `activeEntryId` + saveActiveEntryId
    - Remove all inline API-key / provider / model inputs in general tab
  - In feature pages (e.g., brainstorming, sessions, other AI-driven components):
    - Add an optional dropdown or selector to override the default entry for that feature
    - Default to using the active entry ID from Settings
  - Ensure the General tab now serves exclusively as a _picker_ of which entry is live

- **Hooks & Fetchers**

  - Refactor `useValidateApiKey` and any direct calls to `getApiKey` to use the selected entry's `key` and `provider`
  - Update data‑fetch utilities to reference the active entry for authorization

- **Documentation & Types**

  - Remove mentions of single-key storage from `API-Design.md` and `UI-Design.md`
  - Update type definitions to remove legacy APIs

- **Testing & QA**
  - Add tests for `getActiveEntryId` / `saveActiveEntryId`
  - Update tests that reference legacy storage functions
  - Manual walkthrough: verify switching the dropdown updates the live entry across the app

## Tasks

1. **Data Layer**: Scaffold `activeEntryId` methods in `localStorage.ts`, mark old APIs as deprecated
2. **UI Update**: Modify `SettingsPage` to show entry selector; remove legacy form
3. **Hook Refactor**: Update `useValidateApiKey` to accept entry object instead of raw key
4. **Code Cleanup**: Remove deprecated storage functions and imports
5. **Documentation**: Edit design docs, ADR, and planning
6. **Testing**: Write/adjust unit tests, end‑to‑end smoke test

## Next Steps

- Kick off Task 1 (data layer edits)
- Branch for migration
- Plan code review, then QA pass on staging
