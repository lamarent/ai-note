# 002 - Core Features Implementation Plan

This document outlines the plan and timeline for implementing the remaining core features of the AI Brainstorm application.

## Overview

The core MVP features left to implement are:

1. AI-Powered Idea Generation
2. Export and Sharing

## Tasks

### 1. AI-Powered Idea Generation

- Backend:
  - New routes in worker: `/api/ideas/generate`, `/api/ideas/expand`, `/api/ideas/refine`, `/api/ideas/perspectives`.
  - Integrate OpenAI GPT API with prompt templates.
- Frontend:
  - API service methods in `ideaApi.ts`.
  - React Query hooks: `useGenerateIdeas`, `useExpandIdea`, `useRefineIdea`, `useGetPerspectives`.
  - UI: controls/buttons in `SessionDetailPage` to trigger generation, expansion, refinement, alternative perspectives (e.g., modal or sidebar).
- Maintain context of session and selected idea across calls.

### 2. Export and Sharing

- Frontend utility functions:
  - `exportSessionAsMarkdown(session, ideas, categories)`
  - `exportSessionAsJSON(session, ideas, categories)`
- UI:
  - Buttons on `SessionDetailPage` for "Export Markdown", "Export JSON", and "Copy to Clipboard".
  - Trigger file download or copy to clipboard.

## Timeline

- **Day 1:** Complete AI-Powered Idea Generation
- **Day 2:** Implement Export & Sharing
- **Day 3:** Testing, bug fixes, and documentation

_Last updated: 2025-05-01_
