# AI-Assisted Development Context Tracking

This directory contains files and documentation to support AI-assisted development for the AI Brainstorm application. The context tracking system provides a structured way to maintain project context, track development progress, and share knowledge between human developers and AI assistants.

## Purpose

1. **Maintain Continuity**: Preserve context across development sessions.
2. **Track Progress**: Document completed work and remaining tasks via the `00_development-log.md`.
3. **Share Knowledge**: Create a knowledge base (`knowledge-base/`) that both humans and AI can reference for specific topics (e.g., database setup, frontend patterns).
4. **Track State**: Maintain current development state (`state/`) like focus and blockers.
5. **Enhance Collaboration**: Facilitate smoother handoffs between different developers and AI assistants.

## Directory Structure

```
docs/context/
├── README.md                         # This file: Overview of the context system
├── 00_development-log.md             # PRIMARY: Chronological log of development activities (newest first)
├── ai-brainstorm-implementation.md   # Context note on AI Brainstorm implementation
├── plan-idea-management.md           # Context note on idea management planning
├── refactor-header-layout.md         # Context note on header refactoring
├── knowledge-base/                   # Specific, persistent knowledge related to the project
│   ├── database-notes.md             # Notes on DB setup, migrations, seeding, integration with the backend
│   ├── frontend-notes.md             # Notes on specific frontend integration points or patterns
│   └── ...                           # Add other focused knowledge files as needed
├── state/                            # Current snapshot of the development state
│   ├── current-focus.md              # What's actively being worked on (optional, keep updated)
│   ├── blockers.md                   # Current blockers and challenges (optional, keep updated)
│   └── next-steps.md                 # Near-term planned next steps (optional, keep updated)
├── references/                       # Useful reference points (optional)
│   ├── key-files.md                  # List of critical files with descriptions
│   └── external-resources.md         # Links to relevant external docs, articles, etc.
```

## How to Use

### For Human Developers

1. **Primary:** After each development session or significant task, add a new entry to the top of `00_development-log.md` with a summary, key changes, and next steps.
2. **Knowledge Base:** If you document a specific setup, pattern, or solution that might be useful later (and isn't covered in formal docs), add it to a relevant file in `knowledge-base/`.
3. **State (Optional):** Keep `state/current-focus.md` and `state/blockers.md` updated if helpful for collaboration or resuming work.
4. **Formal Docs:** Use the main `docs/` directory for stable, formal documentation (Architecture, Guides, Product Specs, etc.).

### For AI Assistants

1. **Start Here:** Review this `README.md` first.
2. **Check Log:** Review the most recent entries in `00_development-log.md` to understand history and the latest progress/context.
3. **Check State:** Review files in `state/` (especially `current-focus.md` and `blockers.md`) if they exist and are recent.
4. **Consult Knowledge Base:** Refer to files in `knowledge-base/` for specific technical details or established patterns.
5. **Update Log:** After implementing significant changes or completing a task, add a new entry to `00_development-log.md` summarizing the work done.

## Guidelines

1. **Focus the Log:** Use `00_development-log.md` for chronological updates.
2. **Organize Knowledge:** Use `knowledge-base/` for reusable, topic-specific information.
3. **Be Concise:** Keep entries brief but informative.
4. **Be Specific:** Include specific file paths, function names, decisions, etc.
5. **Be Chronological:** Add new entries at the top of `00_development-log.md`.
6. **Be Actionable:** Include enough context for the next person/AI to take action.
7. **Avoid Duplication:** Don't repeat information already present in formal documentation (`docs/`) unless summarizing it for context.

## Integration with Development Workflow

This context tracking system complements the formal documentation and code.

Use this system alongside:

- ADRs (`docs/ADR/`) for important architectural decisions.
- Planning docs (`docs/planning/`) for specific initiatives.
- GitHub issues for task tracking.
- Pull requests for code reviews.
- Formal documentation (`docs/`) for stable information.
