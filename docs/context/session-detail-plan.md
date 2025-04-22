# Session Detail UI Planning

## Context

- We're building the Session Detail screen for the AI Brainstorm App.
- Goals: easy to use, intuitive, supports dynamic interaction with AI.

## Goals

- Provide clear session title and controls.
- Show list of ideas and allow editing, adding, deleting.
- Integrate AI assistance with prompt input and suggestions.
- Easily manage categories/tags and idea relationships.

## Proposed Wireframe

```
Header: Session Title | [Share] [Export] [Delete] [AI Assist Toggle]
Sidebar: Tools Panel with AI settings, categories, search
Main:
  - Idea Cards list
  - [+ Add Idea]
  - AI Prompt Input at bottom or as modal
```

## Key Components

- **SessionHeader**: title, actions, AI toggle.
- **IdeaList**: scrollable container of IdeaCard.
- **IdeaCard**: content, edit/delete actions, AI badge.
- **AddIdeaButton/Form** for quick idea entry.
- **AIPromptPanel**: input for AI queries, parameter controls, generate button.
- **ToolsPanel**: category/tag filters, AI settings.

## AI Interaction Patterns

- **Inline Suggestions**: AI can suggest ideas for a selected idea group.
- **Modal AI Assist**: full-screen AI prompt with previous context.
- **AIBadge**: clickable badge to regenerate or expand AI content.
- **LoadingIndicator**: feedback during AI processing.

## Technical Considerations

- Use **DaisyUI** + **TailwindCSS**.
- Use **React** with **TypeScript** in a **monorepo** managed by **pnpm**.
- State management with **React Query** or **Zustand**.
- Store active API entry ID in **localStorage** under `ai-brainstorm-active-entry-id`.
- UI events `apiKeyEntriesChanged` and `activeEntryIdChanged` for real-time updates.
- API integration patterns for AI calls (REST/WebSocket).

## Next Steps

1. Implement **SessionHeader** component.
2. Scaffold **IdeaList** and **IdeaCard** components.
3. Build **AIPromptPanel** and integrate AI API calls.
4. Wire up state management and manage API key entries.
5. Create storybook stories for UI components.
