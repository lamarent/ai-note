# AI Assistant Onboarding & Workflow Guide

This guide outlines the recommended workflow for an AI assistant starting work on the AI Brainstorm project. Following these steps will help ensure the AI has the necessary context to contribute effectively.

## Initial Onboarding Steps

When first engaging with the project or starting a new major task:

1.  **Understand the Context System:**

    - **Action:** Read `docs/context/README.md` thoroughly.
    - **Goal:** Understand how project context, development logs, knowledge base, and state are organized.

2.  **Review Recent Development History:**

    - **Action:** Read the most recent entries (at least the last 2-3 major updates) in `docs/context/00_development-log.md`.
    - **Goal:** Understand what tasks were recently completed, the challenges faced, and the immediate next steps identified.

3.  **Check Current Development State:**

    - **Action:** Check for recently updated files within the `docs/context/state/` directory, particularly `current-focus.md` and `blockers.md`.
    - **Goal:** Identify the specific task(s) currently being worked on and any known obstacles.

4.  **Grasp Project Overview & Goals:**

    - **Action:** Read the main `docs/README.md`.
    - **Action:** Review `docs/Product-Specification.md`.
    - **Goal:** Understand the application's purpose, target features (especially MVP), and overall goals.

5.  **Understand High-Level Architecture:**

    - **Action:** Review `docs/Architecture.md`.
    - **Goal:** Understand the major components of the system (frontend, backend, database, AI service) and how they interact.

6.  **Understand Technical Setup:**
    - **Action:** Review `docs/Development-Guide.md`.
    - **Goal:** Understand the technology stack, project structure, environment setup, and common development commands.

## Workflow for Executing Tasks

Once onboarded, follow this general workflow for development tasks:

1.  **Clarify Task:** Ensure the request is clear. If ambiguous, ask clarifying questions.
2.  **Refresh Context:** Briefly re-check the latest entry in `docs/context/00_development-log.md` and any relevant files in `docs/context/state/` to ensure no critical updates occurred since onboarding.
3.  **Consult Knowledge Base & Guides (As Needed):**
    - If the task involves specific areas like database migrations, frontend patterns, or API design, consult relevant files in `docs/context/knowledge-base/` or `docs/guides/`.
    - Refer to `docs/API-Design.md` or `docs/UI-Design.md` if relevant to the task (but prioritize code/log context if documentation seems potentially outdated).
4.  **Plan & Execute:** Formulate a plan (if necessary) and implement the required code changes, adhering to project conventions (linting, formatting, etc.).
5.  **Test:** Ensure changes work as expected (manual testing, running automated tests if applicable).
6.  **Document & Update Context:**
    - **CRITICAL STEP:** Add a new entry to the top of `docs/context/00_development-log.md`.
    - **Log Entry Contents:** Summarize the task, detail the key changes made (including file paths), mention any challenges overcome or decisions made, and outline the next logical steps or remaining work.
    - **Knowledge Base Update (Optional):** If the task involved solving a novel problem or establishing a new pattern, consider adding a concise note to the relevant file in `docs/context/knowledge-base/`.
    - **State Update (Optional):** If the task significantly changes the current focus or resolves a blocker, update the relevant files in `docs/context/state/`.

## Key Principles

- **Prioritize the Development Log:** `00_development-log.md` is the most up-to-date source of truth for ongoing work.
- **Leverage the Knowledge Base:** Use it to avoid re-solving problems documented there.
- **Maintain the Context:** Always update `00_development-log.md` after completing work. This is crucial for continuity.
- **Follow Project Conventions:** Adhere to guidelines in `Development-Guide.md` and established code patterns.
