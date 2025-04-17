# Documentation Restructuring Plan (2025-XX-XX)

## Goal

Restructure, update, and clean redundant files in the `docs` and `docs/context` directories to improve clarity, reduce redundancy, and enhance usability for AI-assisted development.

## Analysis Summary

- `docs/README.md`: Standard project overview.
- `docs/context/README.md`: Describes an intended structure not fully implemented.
- `docs/Development-Guide.md`: Standard setup guide.
- `docs/context/development-log.md`: Main chronological log, currently verbose.
- Other `docs/context/*.md` files: Specific notes likely related to log entries.
- Redundancy: `MVP-Plan.md` vs. `Features.md`. Potential staleness in `API-Design.md`, `UI-Design.md`.

## Proposed Structure

```
docs/
├── README.md                 # Updated main README
├── Product-Specification.md  # Merged MVP + Features
├── Architecture.md
├── API-Design.md
├── UI-Design.md
├── Development-Guide.md
├── ADR/                      # Architectural Decision Records
│   └── ...
├── planning/                 # Planning documents
│   └── 001-docs-restructure-plan.md # This plan
├── guides/                   # Specific guides
│   ├── database.md
│   └── cloudflare-d1-migration.md
└── context/                  # AI-Assisted Development Context
    ├── README.md             # Updated context README
    ├── 00_development-log.md # Renamed main log
    ├── knowledge-base/
    │   ├── database-notes.md
    │   └── frontend-notes.md
    │   └── ... (add others as needed)
    ├── state/
    │   ├── current-focus.md  # (To be created/maintained)
    │   └── blockers.md       # (To be created/maintained)
    ├── references/
    │   └── ... (add as needed)
    └── archive/              # (Contents to be checked)
```

## Action Plan

1.  **Create Directories:**
    - `docs/guides/`
    - `docs/context/knowledge-base/`
    - `docs/context/state/`
    - `docs/context/references/`
2.  **Merge Files:**
    - Merge content from `docs/MVP-Plan.md` and `docs/Features.md` into `docs/Product-Specification.md`.
    - Merge content from `docs/context/database-backend-wrangler.md` and `docs/context/database-migrations.md` into `docs/context/knowledge-base/database-notes.md`.
3.  **Move & Rename Files:**
    - `mv docs/database.md docs/guides/database.md`
    - `mv docs/CLOUDFLARE_D1_MIGRATION.md docs/guides/cloudflare-d1-migration.md`
    - `mv docs/context/development-log.md docs/context/00_development-log.md`
    - `mv docs/context/frontend-database-integration.md docs/context/knowledge-base/frontend-notes.md`
4.  **Delete Redundant Files:**
    - `rm docs/MVP-Plan.md`
    - `rm docs/Features.md`
    - `rm docs/context/database-backend-wrangler.md`
    - `rm docs/context/database-migrations.md`
    - `rm docs/context/frontend-database-integration.md`
5.  **Update Content:**
    - Update links in `docs/README.md`.
    - Update `docs/context/README.md` to reflect the new structure and usage guidelines.
6.  **Review `docs/context/archive/`:** List contents and decide on cleanup action.
